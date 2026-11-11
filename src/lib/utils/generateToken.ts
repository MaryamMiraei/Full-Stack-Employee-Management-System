import { SignJWT } from "jose";

interface ITokenPayload {
  userId: string;
  role: "admin" | "employee";
}

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export const generateToken = async ({ userId, role }: ITokenPayload) => {
  const token = await new SignJWT({
    role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime(process.env.JWT_EXPIRES_IN || "1h")
    .setJti(crypto.randomUUID())
    .sign(secret);

  return token;
};
