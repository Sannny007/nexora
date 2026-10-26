import pg from "pg";

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } =  process.env;

if (!DB_HOST || !DB_PORT || !DB_USER || !DB_PASSWORD || !DB_NAME) {
  throw new Error("Missing database environment variables");
}

export const pool = new pg.Pool({
  host: DB_HOST,
  port: Number(DB_PORT),
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
});