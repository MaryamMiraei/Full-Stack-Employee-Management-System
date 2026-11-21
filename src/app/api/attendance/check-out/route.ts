import { NextResponse } from "next/server";

import { serverApi } from "@/lib/api/serverApi";
import { getCurrentUser } from "@/lib/auth/auth";


import type { IAttendance } from "@/features/attendance/types/attendance.type";
import { getLocalDate } from "@/lib/utils/attendance.utils";

export const PATCH = async () => {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== "employee") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const date = getLocalDate();

    const { data: attendances } = await serverApi.get<IAttendance[]>(
      "/attendances",
      {
        params: {
          userId: user.userId,
          date,
          status: "IN_PROGRESS",
        },
      },
    );

    const attendance = attendances[0];

    if (!attendance) {
      return NextResponse.json(
        { message: "No active check-in found for today." },
        { status: 404 },
      );
    }

    const now = new Date();

    const workingMinutes = Math.floor(
      (now.getTime() - new Date(attendance.checkIn).getTime()) / 60000,
    );

    if (workingMinutes <= 0) {
      return NextResponse.json(
        { message: "Invalid check-out time." },
        { status: 400 },
      );
    }

    const { data } = await serverApi.patch<IAttendance>(
      `/attendances/${attendance.id}`,
      {
        checkOut: now.toISOString(),
        workingMinutes,
        status: "COMPLETED",
        updatedAt: now.toISOString(),
      },
    );

    return NextResponse.json(
      {
        message: "Check-out successful.",
        attendance: data,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Check-out error:", error);

    return NextResponse.json(
      { message: "Failed to check out" },
      { status: 500 },
    );
  }
};
