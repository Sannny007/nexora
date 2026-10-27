import { createHash, randomBytes } from "node:crypto";
import { redis } from "../redis.js";

const REFRESH_TTL_SECONDS = 7 * 24 * 60 * 60;

const keyFor = (token: string): string => {
  const hash = createHash("sha256").update(token).digest("hex");
  return `refresh:${hash}`;
};

export const createRefreshToken = async (userId: string): Promise<string> => {
  const token = randomBytes(32).toString("base64url");
  await redis.set(keyFor(token), userId, "EX", REFRESH_TTL_SECONDS);
  return token;
};

export const consumeRefreshToken = (token: string): Promise<string | null> => {
  return redis.getdel(keyFor(token));
};

export const revokeRefreshToken = async (token: string): Promise<void> => {
  await redis.del(keyFor(token));
};