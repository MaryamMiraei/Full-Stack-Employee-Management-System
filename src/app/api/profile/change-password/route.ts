import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { serverApi } from "@/lib/api/serverApi";
import { getCurrentUser } from "@/lib/auth/auth";

interface IChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

interface IUser {
  id: string;
  passwordHash: string;
}

export const POST = async (request: Request) => {
  try {
    // 1. Get authenticated user
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 2. Validate request body
    const body = await request.json().catch(() => null);

    if (
      !body ||
      typeof body.currentPassword !== "string" ||
      typeof body.newPassword !== "string"
    ) {
      return NextResponse.json(
        { message: "Invalid request data" },
        { status: 400 },
      );
    }

    const { currentPassword, newPassword } = body as IChangePasswordRequest;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { message: "All password fields are required" },
        { status: 400 },
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { message: "New password must be at least 8 characters" },
        { status: 400 },
      );
    }

    if (Buffer.byteLength(newPassword, "utf8") > 72) {
      return NextResponse.json(
        { message: "New password is too long" },
        { status: 400 },
      );
    }

    // 3. Get user from JSON Server
    const userResponse = await serverApi.get<IUser[]>("/users", {
      params: {
        id: currentUser.userId,
      },
    });

    const user = userResponse.data[0];

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // 4. Verify current password
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Current password is incorrect" },
        { status: 400 },
      );
    }

    // 5. Prevent reusing the current password
    const isSamePassword = await bcrypt.compare(newPassword, user.passwordHash);

    if (isSamePassword) {
      return NextResponse.json(
        { message: "New password must be different from current password" },
        { status: 400 },
      );
    }

    // 6. Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // 7. Update password in JSON Server
    await serverApi.patch(`/users/${user.id}`, {
      passwordHash,
    });

    return NextResponse.json(
      { message: "Password changed successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Change password error:", error);

    return NextResponse.json(
      { message: "Failed to change password" },
      { status: 500 },
    );
  }
};
