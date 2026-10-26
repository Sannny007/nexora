import { Router } from "express";
import { register } from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.js";
import { registerSchema } from "../schemas/auth.schema.js";

const authRounter: Router = Router();

authRounter.post("/register", validate(registerSchema), register);

export default authRounter;