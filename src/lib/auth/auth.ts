import "server-only";

import { cookies } from "next/headers";
import { verifyToken } from "./token";

export const getCurrentUser = async () => {
  const cookieStore = await cookies();

  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    return null;
  }

  const payload = await verifyToken(token);

  if (!payload) {
    return null;
  }

  return payload;
};

export const requireAuth = async () => {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("UNAUTHORIZED");
  }

  return user;
};

export const requireRole = async (role: "admin" | "employee") => {
  const user = await requireAuth();

  if (user.role !== role) {
    throw new Error("FORBIDDEN");
  }

  return user;
};
