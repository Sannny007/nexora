import { randomUUID } from "node:crypto";
import { AppError } from "../errors/app-error.js";
import { createUser, findUserByEmail, findUserById } from "../repositories/user.repository.js";
import type { UserRow } from "../repositories/user.repository.js";
import type { LoginInput, RegisterInput } from "../schemas/auth.schema.js";
import { hashPassword, verifyPassword } from "../utils/password.js";
import { signAccessToken } from "../utils/jwt.js";
import { consumeRefreshToken, createRefreshToken, revokeRefreshToken } from "./token.service.js";

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

const DUMMY_HASH = await hashPassword(randomUUID());

export const loginUser = async (
  input: LoginInput,
): Promise<{ user: UserRow; accessToken: string; refreshToken: string }> => {
  const user = await findUserByEmail(input.email);

  const hashToCheck = user ? user.password_hash : DUMMY_HASH;
  const passwordMatches = await verifyPassword(hashToCheck, input.password);

  if (!user || !passwordMatches) {
    throw new AppError(401, "Invalid email or password");
  }

  const { password_hash: _passwordHash, ...safeUser } = user;
  const accessToken = await signAccessToken({
    userId: safeUser.id,
    role: safeUser.role,
  });
  const refreshToken = await createRefreshToken(safeUser.id);

  return { user: safeUser, accessToken, refreshToken };
};

export const refreshSession = async (
  refreshToken: string,
) : Promise<{ accessToken: string; refreshToken: string }> => {
  const userId = await consumeRefreshToken(refreshToken);
  const user = userId ? await findUserById(userId) : null;

  if (!user) {
    throw new AppError(401, "Invalid or expired refresh token");
  }

  const accessToken = await signAccessToken({ userId: user.id, role: user.role,  });
  const newRefreshToken = await createRefreshToken(user.id);
  return { accessToken, refreshToken: newRefreshToken };
};

export const logoutUser = (refreshToken: string): Promise<void> => {
  return revokeRefreshToken(refreshToken);
};
