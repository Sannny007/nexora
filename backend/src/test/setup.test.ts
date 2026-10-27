import { expect, it } from "vitest";
import { pool } from "../db.js";
import { redis } from "../redis.js";

it("writes data in the first test", async () => {
  await pool.query(
    "INSERT INTO users (email, password_hash, name) VALUES ('t@example.com', 'x', 'T')",
  );
  await redis.set("probe", "1");
});

it("sees a clean database and Redis in the next test", async () => {
  const { rows } = await pool.query("SELECT count(*)::int AS n FROM users");
  expect(rows[0]?.n).toBe(0);
  expect(await redis.get("probe")).toBeNull();
});