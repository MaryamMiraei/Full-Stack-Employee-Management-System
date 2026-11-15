
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { verifyToken } from "@/lib/auth/token";

export const GET = async () => {
  try {
    const cookieStore = await cookies();

    const token = cookieStore.get("access_token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(token);

    if (!payload) {
      const response = NextResponse.json(
        { message: "Invalid or expired session" },
        { status: 401 },
      );

      response.cookies.delete("access_token");

      return response;
    }
    
    return NextResponse.json({
      user: {
        id: payload.userId,
        role: payload.role,
      },
    });
  } catch (error) {
    console.error("Session error:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
};
// import { NextResponse } from "next/server";
// import { getCurrentUser } from "@/lib/auth/auth";

// export const GET = async () => {
//   const user = await getCurrentUser();

//   if (!user) {
//     return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//   }

//   return NextResponse.json({
//     user: {
//       id: user.userId,
//       role: user.role,
//     },
//   });
// };