import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { serverApi } from "@/lib/api/serverApi";
import { generateToken } from "@/lib/auth/token";

// export const runtime = "nodejs";

interface ILoginRequest {
  email: string;
  password: string;
  role_type: "admin" | "employee";
}

interface IUser {
  id: string;
  email: string;
  passwordHash: string;
  role: "admin" | "employee";
}

export const POST = async (request: Request) => {
  try {
    const body: ILoginRequest = await request.json();

    const { email, password, role_type } = body;

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      (role_type !== "admin" && role_type !== "employee")
    ) {
      return NextResponse.json(
        { message: "Invalid request data" },
        { status: 400 },
      );
    }

    const response = await serverApi.get("/users", {
      params: { email },
    });

    const users: IUser[] = response.data;

    const user = users.find(
      (item) => item.email.toLowerCase() === email.trim().toLowerCase(),
    );

    if (!user || user.role !== role_type) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 },
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 },
      );
    }

    const token = await generateToken({
      userId: user.id,
      role: user.role,
    });

    const responseLogin = NextResponse.json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });

    responseLogin.cookies.set({
      name: "access_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60,
    });

    return responseLogin;
  } catch (error) {
    console.error("Login error:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
};
