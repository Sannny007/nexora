import { expect, test } from "vitest";
import { loginSchema, registerSchema } from "./auth.schema.js";

test("register schema accepts valid input", () => {
  const result = registerSchema.safeParse({
    name: "Nexora User",
    email: "user@example.com",
    password: "secure-password",
  });
  expect(result.success).toBe(true);
});

test("register schema rejects invalid email and short password", () => {
  const result = registerSchema.safeParse({
    name: "Nexora User",
    email: "not-an-email",
    password: "short",
  });
  expect(result.success).toBe(false);
});

test("login schema requires an email and password", () => {
  expect(
    loginSchema.safeParse({ email: "user@example.com", password: "secret" }).success,
  ).toBe(true);
  expect(
    loginSchema.safeParse({ email: "user@example.com", password: "" }).success,
  ).toBe(false);
});