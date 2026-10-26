import type { Request, Response } from 'express';
import type { RegisterInput } from '../schemas/auth.schema.js';
import { registerUser } from '../services/auth.service.js';

export const register = async (req: Request, res: Response): Promise<void> => {
  const input = req.body as RegisterInput;
  const user = await registerUser(input);
  res.status(201).json({ user });
};
