import mysql from 'mysql2/promise';

export async function getConnection() {
  const conn = await mysql.createConnection({
    host: process.env.RDS_HOST,
    port: Number(process.env.RDS_PORT),
    user: process.env.RDS_USER,
    password: process.env.RDS_PASS,
    database: process.env.RDS_DB
  });
  return conn;
}
