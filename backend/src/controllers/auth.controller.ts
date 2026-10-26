import type { Request, Response } from "express";
import type { LoginInput, RegisterInput } from "../schemas/auth.schema.js";
import { loginUser, registerUser } from "../services/auth.service.js";

export const register = async (req: Request, res: Response): Promise<void> => {
  const input = req.body as RegisterInput;
  const user = await registerUser(input);
  res.status(201).json({ user });
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const input = req.body as LoginInput;
  const user = await loginUser(input);
  res.status(200).json({ user });
};