import { pool } from "../db.js";

export type UserRow = {
  id: string;
  email: string;
  name: string;
  role: "user" | "recruiter" | "admin";
  created_at: Date;
};

type CreateUserData = {
  name: string;
  email: string;
  passwordHash: string;
};

export const createUser = async (data: CreateUserData): Promise<UserRow> => {
  const result = await pool.query<UserRow>(
    `INSERT INTO users (name, email, password_hash)
    VALUES ($1, $2, $3)
    RETURNING id, email, name, role, created_at`,
    [data.name, data.email, data.passwordHash],
  );

  const user = result.rows[0];
  if (!user) {
    throw new Error("Inser returned no row");
  }
  return user;
}

export type UserWithPasswordRow = UserRow & { password_hash: string };

export const findUserByEmail = async (
  email: string,
): Promise<UserWithPasswordRow | null> => {
  const result = await pool.query<UserWithPasswordRow>(
    `SELECT id, email, name, role, created_at, password_hash
     FROM users
     WHERE lower(email) = lower($1)`,
    [email],
  );

  return result.rows[0] ?? null;
};


export const findUserById = async (id: string): Promise<UserRow | null> => {
  const result = await pool.query<UserRow>(
    `SELECT id, email, name, role, created_at FROM users WHERE id = $1`,
    [id],
  );
  return result.rows[0] ?? null;
};