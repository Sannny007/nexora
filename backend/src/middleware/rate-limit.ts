import type { RequestHandler } from 'express';
import { AppError } from '../errors/app-error.js';
import { redis } from '../redis.js';

type Options = { name: string; max: number; windowSeconds: number };

export const rateLimit = ({ name, max, windowSeconds }: Options): RequestHandler => {
  return async (req, _res, next) => {
    const key = `ratelimit:${name}:${req.ip ?? "unknown"}`;
    const count = await redis.incr(key);

    if (count === 1) {
      await redis.expire(key, windowSeconds);
    }
    if (count > max) {
      throw new AppError(429, "Too many requests, try again later");
    }
    next();
  };
};