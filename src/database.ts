import mysql2, { PoolOptions } from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();
const accses: PoolOptions = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  database: process.env.MYSQL_NAME,
  password: process.env.MYSQL_PASSWORD,
  port: Number(process.env.MYSQL_PORT),
  multipleStatements: true,
};

const connection = mysql2.createPool(accses);
export default connection;
