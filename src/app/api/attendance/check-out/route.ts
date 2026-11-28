import { NextResponse } from "next/server";

import { getDB } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/auth";
import { getLocalDate } from "@/lib/utils/attendance.utils";

export const PATCH = async () => {
  try {
    // 1. Authentication
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 2. Authorization
    if (currentUser.role !== "employee") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const db = getDB();

    // 3. Get current local date
    const now = new Date();
    const today = getLocalDate(now);

    // 4. Find active attendance
    const attendance = await db
      .prepare(
        `SELECT
          id,
          employee_id AS employeeId,
          user_id AS userId,
          date,
          check_in AS checkIn,
          check_out AS checkOut,
          working_minutes AS workingMinutes,
          day_type AS dayType,
          status,
          created_at AS createdAt,
          updated_at AS updatedAt
        FROM attendances
        WHERE user_id = ?
          AND date = ?
          AND status = 'IN_PROGRESS'`,
      )
      .bind(currentUser.userId, today)
      .first<{
        id: string;
        employeeId: string;
        userId: string;
        date: string;
        checkIn: string;
        checkOut: string | null;
        workingMinutes: number | null;
        dayType: "WORKDAY" | "WEEKEND" | "HOLIDAY";
        status: "IN_PROGRESS" | "COMPLETED";
        createdAt: string;
        updatedAt: string;
      }>();

    if (!attendance) {
      return NextResponse.json(
        { message: "No active check-in found for today" },
        { status: 404 },
      );
    }

    // 5. Calculate working minutes
    const checkOut = now.toISOString();

    const workingMinutes = Math.floor(
      (now.getTime() - new Date(attendance.checkIn).getTime()) / 60000,
    );

    if (workingMinutes <= 0) {
      return NextResponse.json(
        { message: "Invalid check-out time" },
        { status: 400 },
      );
    }

    // 6. Update attendance in D1
    await db
      .prepare(
        `UPDATE attendances
         SET
           check_out = ?,
           working_minutes = ?,
           status = 'COMPLETED',
           updated_at = ?
         WHERE id = ?
           AND status = 'IN_PROGRESS'`,
      )
      .bind(checkOut, workingMinutes, checkOut, attendance.id)
      .run();

    // 7. Return updated attendance
    const updatedAttendance = {
      ...attendance,
      checkOut,
      workingMinutes,
      status: "COMPLETED" as const,
      updatedAt: checkOut,
    };

    return NextResponse.json(
      {
        message: "Check-out successful",
        attendance: updatedAttendance,
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
