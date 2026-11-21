import { NextResponse } from "next/server";

import { serverApi } from "@/lib/api/serverApi";
import { getCurrentUser } from "@/lib/auth/auth";

import type { IAttendance } from "@/features/attendance/types/attendance.type";
import { getLocalDate } from "@/lib/utils/attendance.utils";

export const POST = async () => {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== "employee") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const now = new Date();
    const date = getLocalDate(now);

    const { data: attendances } = await serverApi.get<IAttendance[]>(
      "/attendances",
      {
        params: {
          userId: user.userId,
          date,
        },
      },
    );

    if (attendances.length > 0) {
      return NextResponse.json(
        { message: "Attendance has already been registered today." },
        { status: 409 },
      );
    }

    const newAttendance: IAttendance = {
      id: crypto.randomUUID(),
      employeeId: user.userId,
      userId: user.userId,
      date,
      checkIn: now.toISOString(),
      checkOut: null,
      workingMinutes: null,
      dayType: "WORKDAY",
      status: "IN_PROGRESS",
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    const { data } = await serverApi.post<IAttendance>(
      "/attendances",
      newAttendance,
    );

    return NextResponse.json(
      {
        message: "Check-in successful.",
        attendance: data,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Check-in error:", error);

    return NextResponse.json(
      { message: "Failed to check in" },
      { status: 500 },
    );
  }
};
