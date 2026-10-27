import { Redis } from "ioredis";

const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } = process.env;

if (!REDIS_HOST || !REDIS_PORT || !REDIS_PASSWORD) {
  throw new Error("Missing Redis environment variables");
}

export const redis = new Redis({
  host: REDIS_HOST,
  port: Number(REDIS_PORT),
  password: REDIS_PASSWORD,
});

redis.on("error", (err) => {
  console.error("Redis error:", err.message);
});