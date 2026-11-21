import { NextResponse } from "next/server";

import { serverApi } from "@/lib/api/serverApi";
import { getCurrentUser } from "@/lib/auth/auth";

import type { IAttendance } from "@/features/attendance/types/attendance.type";

export const GET = async (request: Request) => {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== "employee") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const month = searchParams.get("month");

    if (month && !/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
      return NextResponse.json(
        { message: "Invalid month format" },
        { status: 400 },
      );
    }

    const { data } = await serverApi.get<IAttendance[]>("/attendances");

    const filteredAttendances = data
      .filter(
        (attendance) =>
          attendance.userId === user.userId &&
          (!month || attendance.date.startsWith(month)),
      )
      .sort(
        (a, b) => new Date(b.checkIn).getTime() - new Date(a.checkIn).getTime(),
      );

    return NextResponse.json(filteredAttendances, {
      status: 200,
      headers: {
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    console.error("Get attendance error:", error);

    return NextResponse.json(
      { message: "Failed to get attendance records" },
      { status: 500 },
    );
  }
};
