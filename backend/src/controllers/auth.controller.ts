import type { CookieOptions, Request, Response } from "express";
import { AppError } from "../errors/app-error.js";
import type { LoginInput, RegisterInput } from "../schemas/auth.schema.js";
import {
  loginUser,
  logoutUser,
  refreshSession,
  registerUser,
} from "../services/auth.service.js";

const REFRESH_COOKIE = "refresh_token";

const baseCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  path: "/api/auth",
};

const refreshCookieOptions: CookieOptions = {
  ...baseCookieOptions,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const readRefreshToken = (req: Request): string | null => {
  const value: unknown = req.cookies?.[REFRESH_COOKIE];
  return typeof value === "string" && value.length > 0 ? value : null;
};

export const register = async (req: Request, res: Response): Promise<void> => {
  const input = req.body as RegisterInput;
  const user = await registerUser(input);
  res.status(201).json({ user });
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const input = req.body as LoginInput;
  const { user, accessToken, refreshToken } = await loginUser(input);
  res.cookie(REFRESH_COOKIE, refreshToken, refreshCookieOptions);
  res.status(200).json({ user, accessToken });
};

export const refresh = async (req: Request, res: Response): Promise<void> => {
  const token = readRefreshToken(req);
  if (!token) {
    throw new AppError(401, "Refresh token missing");
  }
  const { accessToken, refreshToken } = await refreshSession(token);
  res.cookie(REFRESH_COOKIE, refreshToken, refreshCookieOptions);
  res.status(200).json({ accessToken });
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  const token = readRefreshToken(req);
  if (token) {
    await logoutUser(token);
  }
  res.clearCookie(REFRESH_COOKIE, baseCookieOptions);
  res.status(204).send();
};

export const me = (req: Request, res: Response): void => {
  res.status(200).json({ user: req.user });
};