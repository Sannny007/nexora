import type { RequestHandler } from "express";
import { AppError } from "../errors/app-error.js";
import type { AccessTokenPayload } from "../utils/jwt.js";

type Role = AccessTokenPayload["role"];

export const requireRole = (...allowed: Role[]): RequestHandler => {
  return (req, _res, next) => {
    if (!req.user) {
      throw new AppError(401, "Authentication required");
    }
    if (!allowed.includes(req.user.role)) {
      throw new AppError(403, "Forbidden");
    }
    next();
  };
};