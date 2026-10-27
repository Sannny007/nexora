import { afterAll, beforeEach } from 'vitest';
import { pool } from '../db.js';
import { redis } from '../redis.js';

if (process.env.DB_NAME !== "nexora_test" || process.env.REDIS_DB !== "1") {
  throw new Error("Refusing to run tests against a non-test database or Redis DB");
}

beforeEach(async () => {
  await pool.query("DELETE FROM users");
  await redis.flushdb();
});

afterAll(async () => {
  await pool.end();
  await redis.quit();
});