import { Router } from "express";
import {
  login,
  logout,
  me,
  refresh,
  register,
} from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/authenticate.js";
import { rateLimit } from "../middleware/rate-limit.js";
import { validate } from "../middleware/validate.js";
import { loginSchema, registerSchema } from "../schemas/auth.schema.js";

const authRouter: Router = Router();

authRouter.post(
  "/register",
  rateLimit({ name: "register", max: 5, windowSeconds: 3600 }),
  validate(registerSchema),
  register,
);
authRouter.post(
  "/login",
  rateLimit({ name: "login", max: 10, windowSeconds: 900 }),
  validate(loginSchema),
  login,
);
authRouter.post("/refresh", refresh);
authRouter.post("/logout", logout);
authRouter.get("/me", authenticate, me);

export default authRouter;