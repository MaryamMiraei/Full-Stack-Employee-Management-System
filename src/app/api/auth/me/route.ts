import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/auth";

export const GET = async () => {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    user: {
      id: user.userId,
      role: user.role,
    },
  });
};
