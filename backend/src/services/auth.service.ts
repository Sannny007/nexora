import { input } from "zod";
import { AppError } from "../errors/app-error.js";
import { createUser } from "../repositories/user.repository.js";
import type { UserRow } from "../repositories/user.repository.js";
import type { RegisterInput } from "../schemas/auth.schema.js";
import { hashPassword } from "../utils/password.js";

const isDuplicateEmailError = (err: unknown): boolean => {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    err.code === "23505" &&
    "constraint" in err &&
    err.constraint === "users_email_unique"
  );
};

export const registerUser = async (input: RegisterInput): Promise<UserRow> => {
  const passwordHash = await hashPassword(input.password);

  try {
    return await createUser({
      name: input.name,
      email: input.email.toLowerCase(),
      passwordHash,
    });
  } catch (err) {
    if (isDuplicateEmailError(err)) {
      throw new AppError(409, "Email already registered");
    }
    throw err;
  }
};

