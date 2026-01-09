const mysql = require("mysql");

async function waitForMySQL() {
  console.log("⏳ Waiting for MySQL...");

  const config = {
    host: process.env.DB_HOST || "mysql",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PWD,
    database: process.env.DB_DATABASE || "webappdb",
  };

  while (true) {
    try {
      const connection = mysql.createConnection(config);
      connection.connect((err) => {
        if (!err) {
          console.log("✅ MySQL is ready!");
          connection.end();
        }
      });

      break;
    } catch (error) {
      console.log("❌ MySQL not ready. Retrying in 2s...");
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }
}

module.exports = waitForMySQL;  // <-- THIS WAS MISSING

