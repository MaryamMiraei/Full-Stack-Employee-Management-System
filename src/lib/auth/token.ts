import "server-only";

import { SignJWT, jwtVerify } from "jose";

export type UserRole = "admin" | "employee";

interface ITokenPayload {
  userId: string;
  role: UserRole;
}

const secret = process.env.JWT_SECRET;

if (!secret) {
  throw new Error("JWT_SECRET is not defined");
}

const secretKey = new TextEncoder().encode(secret);

export const generateToken = async ({ userId, role }: ITokenPayload) => {
  const token = await new SignJWT({ role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime(process.env.JWT_EXPIRES_IN || "1h")
    .setJti(crypto.randomUUID())
    .sign(secretKey);

  return token;
};

export const verifyToken = async (token: string) => {
  try {
    const { payload } = await jwtVerify(token, secretKey, {
      algorithms: ["HS256"],
    });

    if (
      typeof payload.sub !== "string" ||
      (payload.role !== "admin" && payload.role !== "employee")
    ) {
      return null;
    }

    return {
      userId: payload.sub,
      role: payload.role as UserRole,
      issuedAt: payload.iat,
      expiresAt: payload.exp,
    };
  } catch {
    return null;
  }
};
