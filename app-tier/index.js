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

/* ===============================
   AUTH MIDDLEWARE
================================ */
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.sendStatus(401);

  const token = authHeader.split(" ")[1];
  try {
    jwt.verify(token, JWT_SECRET);
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

  try {
    const hash = await bcrypt.hash(password, 10);
    const sql = "INSERT INTO users (username, password) VALUES (?, ?)";

    con.query(sql, [username, hash], (err) => {
      if (err)
        return res.status(400).json({ message: "User already exists" });

      res.json({ message: "User registered successfully" });
    });
  } catch (err) {
    res.status(500).json({ message: "Registration failed" });
  }
});

// LOGIN
app.post("/auth/login", (req, res) => {
  const { username, password } = req.body;

  const sql = "SELECT * FROM users WHERE username = ?";
  con.query(sql, [username], async (err, result) => {
    if (err) return res.sendStatus(500);

    if (result.length === 0)
      return res.status(401).json({ message: "Invalid user" });

    const valid = await bcrypt.compare(password, result[0].password);
    if (!valid)
      return res.status(401).json({ message: "Wrong password" });

    const token = jwt.sign(
      { userId: result[0].id },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  });
});

/* ===============================
   HEALTH CHECK
================================ */
app.get("/health", (req, res) => {
  res.json("This is the health check");
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
app.delete("/transaction/id", authMiddleware, (req, res) => {
  try {
    transactionService.deleteTransactionById(req.body.id, () => {
      res.status(200).json({
        message: `transaction with id ${req.body.id} deleted`
      });
    });
  } catch (err) {
    res.json({ message: "error deleting transaction", error: err.message });
  }
});

// GET ONE TRANSACTION
app.get("/transaction/id", authMiddleware, (req, res) => {
  try {
    transactionService.findTransactionById(req.body.id, (result) => {
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
