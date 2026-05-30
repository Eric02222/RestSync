import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "milionario",
  database: process.env.DB_DATABASE || "restsync_db",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export { db };