import { NextResponse } from "next/server";

import { getDB } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/auth";

interface IAttendance {
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
}

export const GET = async (request: Request) => {
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

    // 3. Get optional month filter
    const { searchParams } = new URL(request.url);
    const month = searchParams.get("month");

    if (month && !/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
      return NextResponse.json(
        { message: "Invalid month format. Use YYYY-MM" },
        { status: 400 },
      );
    }

    // 4. Get attendance records from D1
    const db = getDB();

    const query = month
      ? db
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
          WHERE user_id = ? AND date LIKE ?
          ORDER BY check_in DESC`,
          )
          .bind(currentUser.userId, `${month}%`)
      : db
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
          ORDER BY check_in DESC`,
          )
          .bind(currentUser.userId);

    const result = await query.all<IAttendance>();

    return NextResponse.json(result.results, {
      status: 200,
      headers: {
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    console.error("Get attendance error:", error);

    return NextResponse.json(
      { message: "Failed to fetch attendance records" },
      { status: 500 },
    );
  }
};
