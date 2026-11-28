import { NextResponse } from "next/server";

import { getDB } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/auth";
import { getLocalDate } from "@/lib/utils/attendance.utils";

export const POST = async () => {
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

    // 3. Find active employee
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
        { message: "Employee not found" },
        { status: 404 },
      );
    }

    // 4. Get current local date
    const now = new Date();
    const today = getLocalDate(now);

    // 5. Prevent duplicate check-in
    const existingAttendance = await db
      .prepare(
        `SELECT id
         FROM attendances
         WHERE user_id = ? AND date = ?`,
      )
      .bind(currentUser.userId, today)
      .first<{ id: string }>();

    if (existingAttendance) {
      return NextResponse.json(
        { message: "You have already checked in today" },
        { status: 409 },
      );
    }

    // 6. Create attendance record
    const attendance = {
      id: crypto.randomUUID(),
      employeeId: employee.id,
      userId: currentUser.userId,
      date: today,
      checkIn: now.toISOString(),
      checkOut: null,
      workingMinutes: null,
      dayType: "WORKDAY" as const,
      status: "IN_PROGRESS" as const,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    // 7. Insert into D1
    await db
      .prepare(
        `INSERT INTO attendances (
          id,
          employee_id,
          user_id,
          date,
          check_in,
          check_out,
          working_minutes,
          day_type,
          status,
          created_at,
          updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        attendance.id,
        attendance.employeeId,
        attendance.userId,
        attendance.date,
        attendance.checkIn,
        attendance.checkOut,
        attendance.workingMinutes,
        attendance.dayType,
        attendance.status,
        attendance.createdAt,
        attendance.updatedAt,
      )
      .run();

    return NextResponse.json(
      {
        message: "Check-in successful",
        attendance,
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
