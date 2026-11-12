import { NextResponse } from "next/server";

export const POST = async () => {
  const response = NextResponse.json({
    message: "Logout successful",
  });

  response.cookies.set({
    name: "access_token",
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
};
