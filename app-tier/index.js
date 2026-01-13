const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mysql = require("mysql");

const transactionService = require("./TransactionService");
const dbcreds = require("./DbConfig");

const app = express();
const port = 4000;
const JWT_SECRET = "mysecretkey";

/* ===============================
   MIDDLEWARE
================================ */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

/* ===============================
   DB CONNECTION (FOR AUTH)
================================ */
const con = mysql.createConnection({
  host: dbcreds.DB_HOST,
  user: dbcreds.DB_USER,
  password: dbcreds.DB_PWD,
  database: dbcreds.DB_DATABASE
});

con.connect((err) => {
  if (err) {
    console.error("[DB] Connection error:", err);
  } else {
    console.debug("[DB] Connected to", dbcreds.DB_DATABASE, "at", dbcreds.DB_HOST);
  }
});

con.on("error", (err) => {
  console.error("[DB] Error event:", err);
});

/* ===============================
   AUTH MIDDLEWARE
================================ */
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.sendStatus(401);

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.sendStatus(403);
  }
}

/* ===============================
   AUTH ROUTES
================================ */

// REGISTER
app.post("/auth/register", async (req, res) => {
  const { username, password } = req.body;
  console.debug(`[auth/register] Register attempt for username=${username}`);

  try {
    const hash = await bcrypt.hash(password, 10);
    const sql = "INSERT INTO users (username, password_hash) VALUES (?, ?)";

    con.query(sql, [username, hash], (err, result) => {
      if (err) {
        console.error("[auth/register] DB error:", err);
        return res.status(400).json({ message: "User already exists" });
      }

      console.debug("[auth/register] User registered:", username, "id:", result.insertId);
      res.status(201).json({ message: "User registered successfully" });
    });
  } catch (err) {
    console.error("[auth/register] Registration failed:", err);
    res.status(500).json({ message: "Registration failed" });
  }
});

// LOGIN
app.post("/auth/login", (req, res) => {
  const { username, password } = req.body;
  console.debug(`[auth/login] Login attempt for username=${username}`);

  const sql = "SELECT * FROM users WHERE username = ?";
  con.query(sql, [username], async (err, result) => {
    if (err) {
      console.error("[auth/login] DB error:", err);
      return res.sendStatus(500);
    }

    if (!result || result.length === 0) {
      console.debug("[auth/login] User not found:", username);
      return res.status(401).json({ message: "Invalid user" });
    }

    const valid = await bcrypt.compare(password, result[0].password_hash);
    console.debug("[auth/login] Password valid:", !!valid, "for user:", username);
    if (!valid) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign({ id: result[0].id, username: result[0].username }, JWT_SECRET, { expiresIn: "1h" });
    console.debug("[auth/login] Login success for user:", username, "id:", result[0].id);

    res.json({ token });
  });
});

/* ===============================
   HEALTH CHECK
================================ */
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

/* ===============================
   TRANSACTION ROUTES (PROTECTED)
================================ */

// ADD TRANSACTION
app.post("/transaction", authMiddleware, (req, res) => {
  try {
    const success = transactionService.addTransaction(
      req.body.amount,
      req.body.desc
    );

    if (success === 200) {
      res.json({ message: "added transaction successfully" });
    }
  } catch (err) {
    res.json({ message: "something went wrong", error: err.message });
  }
});

// GET ALL TRANSACTIONS
app.get("/transaction", authMiddleware, (req, res) => {
  try {
    const transactionList = [];

    transactionService.getAllTransactions((results) => {
      for (const row of results) {
        transactionList.push({
          id: row.id,
          amount: row.amount,
          description: row.description
        });
      }
      res.status(200).json({ result: transactionList });
    });
  } catch (err) {
    res.json({ message: "could not get transactions", error: err.message });
  }
});

// DELETE ALL TRANSACTIONS
app.delete("/transaction", authMiddleware, (req, res) => {
  try {
    transactionService.deleteAllTransactions(() => {
      res.status(200).json({ message: "All transactions deleted" });
    });
  } catch (err) {
    res.json({ message: "Delete failed", error: err.message });
  }
});

// DELETE ONE TRANSACTION
app.delete("/transaction/:id", authMiddleware, (req, res) => {
  try {
    const id = req.params.id;
    transactionService.deleteTransactionById(id, () => {
      res.status(200).json({
        message: `transaction with id ${id} deleted`
      });
    });
  } catch (err) {
    res.json({ message: "error deleting transaction", error: err.message });
  }
});

// GET ONE TRANSACTION
app.get("/transaction/:id", authMiddleware, (req, res) => {
  try {
    const id = req.params.id;
    transactionService.findTransactionById(id, (result) => {
      if (!result || result.length === 0) {
        return res.status(404).json({ message: "Transaction not found" });
      }
      res.status(200).json({
        id: result[0].id,
        amount: result[0].amount,
        desc: result[0].description
      });
    });
  } catch (err) {
    res.json({ message: "error retrieving transaction", error: err.message });
  }
});

/* ===============================
   START SERVER
================================ */
app.listen(port, () => {
  console.log(`AB3 backend app listening at http://localhost:${port}`);
});
