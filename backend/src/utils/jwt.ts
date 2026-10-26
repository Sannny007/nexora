import { SignJWT, jwtVerify } from "jose";
import { type } from "os";

const { JWT_ACCESS_SECRET } = process.env;

if (!JWT_ACCESS_SECRET || JWT_ACCESS_SECRET.length < 32) {
  throw new Error("JWT_ACCESS_SECRET must be set and at least 32 characters long");
}

const secret = new TextEncoder().encode(JWT_ACCESS_SECRET);

const ISSUER = "nexora";
const ACCESS_TOKEN_TTL = "15m";

export type AccessTokenPayload = {
  userId: string;
  role: "user" | "recruiter" | "admin";
};

export const signAccessToken = (payload: AccessTokenPayload): Promise<string> => {
  return new SignJWT({ role: payload.role })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(payload.userId)
    .setIssuer(ISSUER)
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_TTL)
    .sign(secret);
};

export const verifyAccessToken = async (
  token: string,
): Promise<AccessTokenPayload> => {
  const { payload } = await jwtVerify(token, secret, {
    algorithms: ["HS256"],
    issuer: ISSUER,
  });

  const { sub, role } = payload;
  if (
    typeof sub !== "string" ||
    (role !== "user" && role !== "recruiter" && role !== "admin")
  ) {
    throw new Error("Invalid token payload");
  }

  return { userId: sub, role };
};