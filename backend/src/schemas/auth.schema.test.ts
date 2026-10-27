import assert from "node:assert/strict";
import test from "node:test";
import { loginSchema, registerSchema } from "./auth.schema.js";

test("register schema accepts valid input", () => {
  const result = registerSchema.safeParse({
    name: "Nexora User",
    email: "user@example.com",
    password: "secure-password",
  });

  assert.equal(result.success, true);
});

test("register schema rejects invalid email and short password", () => {
  const result = registerSchema.safeParse({
    name: "Nexora User",
    email: "not-an-email",
    password: "short",
  });

  assert.equal(result.success, false);
});

test("login schema requires an email and password", () => {
  assert.equal(
    loginSchema.safeParse({ email: "user@example.com", password: "secret" }).success,
    true,
  );
  assert.equal(
    loginSchema.safeParse({ email: "user@example.com", password: "" }).success,
    false,
  );
});
