import { NextResponse } from "next/server";

import { serverApi } from "@/lib/api/serverApi";
import { getCurrentUser } from "@/lib/auth/auth";



import type {
  IAttendance,
  IAttendanceSummary,
} from "@/features/attendance/types/attendance.type";
import { getCurrentMonth, isLateArrival } from "@/lib/utils/attendance.utils";

export const GET = async () => {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== "employee") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { data } = await serverApi.get<IAttendance[]>("/attendances");

    const currentMonth = getCurrentMonth();

    const monthlyAttendances = data.filter(
      (attendance) =>
        attendance.userId === user.userId &&
        attendance.date.startsWith(currentMonth),
    );

    const completedAttendances = monthlyAttendances.filter(
      (attendance) =>
        attendance.status === "COMPLETED" && attendance.workingMinutes !== null,
    );

    const totalWorkingMinutes = completedAttendances.reduce(
      (total, attendance) => total + (attendance.workingMinutes ?? 0),
      0,
    );

    const summary: IAttendanceSummary = {
      daysPresent: monthlyAttendances.length,

      lateArrivals: monthlyAttendances.filter((attendance) =>
        isLateArrival(attendance.checkIn),
      ).length,

      averageWorkMinutes:
        completedAttendances.length > 0
          ? Math.round(totalWorkingMinutes / completedAttendances.length)
          : 0,
    };

    return NextResponse.json(summary, {
      status: 200,
      headers: {
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    console.error("Get attendance summary error:", error);

    return NextResponse.json(
      { message: "Failed to get attendance summary" },
      { status: 500 },
    );
  }
};
