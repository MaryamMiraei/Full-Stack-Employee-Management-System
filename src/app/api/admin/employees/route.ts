import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/auth";
import { serverApi } from "@/lib/api/serverApi";

export const GET = async () => {
  try {
    await requireRole("admin");

    const response = await serverApi.get("/employees");

    return NextResponse.json(response.data);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "UNAUTHORIZED") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }

      if (error.message === "FORBIDDEN") {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
      }
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
};
