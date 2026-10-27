import type { AccessTokenPayload } from "../utils/jwt.ts";

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; role: AccessTokenPayload["role"] };
    }
  }
}

export {};