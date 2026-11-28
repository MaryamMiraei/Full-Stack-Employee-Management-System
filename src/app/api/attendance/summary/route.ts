import { NextResponse } from "next/server";

import { getDB } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/auth";
import { getCurrentMonth, isLateArrival } from "@/lib/utils/attendance.utils";

interface IAttendance {
  checkIn: string;
  workingMinutes: number | null;
}

export const GET = async () => {
  try {
    // 1. Authentication
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 2. Authorization
    if (currentUser.role !== "employee") {
      return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }

    const db = getDB();

    // 3. Check employee record
    const employee = await db
      .prepare(
        `SELECT id
         FROM employees
         WHERE user_id = ? AND is_deleted = 0`,
      )
      .bind(currentUser.userId)
      .first<{ id: string }>();

    if (!employee) {
      return NextResponse.json(
        { message: "Employee record not found" },
        { status: 404 },
      );
    }

    // 4. Get current month
    const currentMonth = getCurrentMonth();

    // 5. Get monthly attendance records
    const result = await db
      .prepare(
        `SELECT
          check_in AS checkIn,
          working_minutes AS workingMinutes
         FROM attendances
         WHERE user_id = ?
           AND date LIKE ?`,
      )
      .bind(currentUser.userId, `${currentMonth}%`)
      .all<IAttendance>();

    const monthlyAttendances = result.results;

    // 6. Calculate summary
    const daysPresent = monthlyAttendances.length;

    const lateArrivals = monthlyAttendances.filter((item) =>
      isLateArrival(item.checkIn),
    ).length;

    const completedAttendances = monthlyAttendances.filter(
      (item) => item.workingMinutes !== null,
    );

    const totalWorkMinutes = completedAttendances.reduce(
      (total, item) => total + (item.workingMinutes ?? 0),
      0,
    );

    const averageWorkMinutes =
      completedAttendances.length > 0
        ? Math.round(totalWorkMinutes / completedAttendances.length)
        : 0;

    // 7. Return summary
    return NextResponse.json(
      {
        daysPresent,
        lateArrivals,
        averageWorkMinutes,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "private, no-store",
        },
      },
    );
  } catch (error) {
    console.error("Attendance summary error:", error);

    return NextResponse.json(
      { message: "Failed to fetch attendance summary" },
      { status: 500 },
    );
  }
};
