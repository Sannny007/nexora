import type { RequestHandler } from "express";
import { AppError } from "../errors/app-error.js";
import { verifyAccessToken } from "../utils/jwt.js";
import type { AccessTokenPayload } from "../utils/jwt.js";

export const authenticate: RequestHandler = async (req, _res, next) => {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    throw new AppError(401, "Authentication required");
  }

  const token = header.slice("Bearer ".length);

  let payload: AccessTokenPayload;
  try {
    payload = await verifyAccessToken(token);
  } catch {
    throw new AppError(401, "Invalid or expired token");
  }

  req.user = { id: payload.userId, role: payload.role };
  next();
};