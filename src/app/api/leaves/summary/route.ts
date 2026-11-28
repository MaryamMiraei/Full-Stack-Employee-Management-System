import { NextResponse } from "next/server";

import { getDB } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/auth";

type LeaveType = "ANNUAL" | "SICK" | "UNPAID" | "CASUAL";

interface ILeave {
  type: LeaveType;
  startDate: string;
  endDate: string;
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

    // 3. Validate year
    const { searchParams } = new URL(request.url);
    const yearParam = searchParams.get("year");
    const year = yearParam ? Number(yearParam) : new Date().getFullYear();

    if (!Number.isInteger(year) || year < 2000 || year > 2100) {
      return NextResponse.json({ message: "Invalid year" }, { status: 400 });
    }

    // 4. Find employee
    const db = getDB();

    const employee = await db
      .prepare(
        `SELECT id
         FROM employees
         WHERE user_id = ?
           AND is_deleted = 0`,
      )
      .bind(currentUser.userId)
      .first<{ id: string }>();

    if (!employee) {
      return NextResponse.json(
        { message: "Employee not found" },
        { status: 404 },
      );
    }

    // 5. Get approved leaves overlapping selected year
    const yearStart = `${year}-01-01`;
    const yearEnd = `${year}-12-31`;

    const result = await db
      .prepare(
        `SELECT
          type,
          start_date AS startDate,
          end_date AS endDate
         FROM leaves
         WHERE employee_id = ?
           AND status = 'APPROVED'
           AND start_date <= ?
           AND end_date >= ?`,
      )
      .bind(employee.id, yearEnd, yearStart)
      .all<ILeave>();

    // 6. Calculate leave days
    const byType: Record<LeaveType, number> = {
      ANNUAL: 0,
      SICK: 0,
      UNPAID: 0,
      CASUAL: 0,
    };

    for (const leave of result.results) {
      const start = new Date(`${leave.startDate}T00:00:00Z`);
      const end = new Date(`${leave.endDate}T00:00:00Z`);

      const selectedYearStart = new Date(`${yearStart}T00:00:00Z`);
      const selectedYearEnd = new Date(`${yearEnd}T00:00:00Z`);

      const effectiveStart =
        start > selectedYearStart ? start : selectedYearStart;

      const effectiveEnd = end < selectedYearEnd ? end : selectedYearEnd;

      const days =
        Math.floor(
          (effectiveEnd.getTime() - effectiveStart.getTime()) / 86400000,
        ) + 1;

      if (days > 0) {
        byType[leave.type] += days;
      }
    }

    // 7. Calculate total
    const totalDays = Object.values(byType).reduce(
      (total, days) => total + days,
      0,
    );

    return NextResponse.json(
      {
        year,
        totalDays,
        byType,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "private, no-store",
        },
      },
    );
  } catch (error) {
    console.error("Leave summary error:", error);

    return NextResponse.json(
      { message: "Failed to fetch leave summary" },
      { status: 500 },
    );
  }
};
