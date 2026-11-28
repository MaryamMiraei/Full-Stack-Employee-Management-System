import { NextResponse } from "next/server";

import { getDB } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/auth";
import { getLocalDate } from "@/lib/utils/attendance.utils";

export const GET = async () => {
  try {
    // 1. Authentication
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 2. Authorization
    if (currentUser.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // 3. Get D1 database
    const db = getDB();
    const today = getLocalDate();

    // 4. Fetch dashboard statistics
    const [employeesResult, departmentsResult, attendanceResult, leavesResult] =
      await Promise.all([
        db
          .prepare(
            `SELECT COUNT(*) AS totalEmployees
           FROM employees
           WHERE is_deleted = 0`,
          )
          .first<{ totalEmployees: number }>(),

        db
          .prepare(
            `SELECT COUNT(DISTINCT TRIM(department)) AS totalDepartments
           FROM employees
           WHERE is_deleted = 0
             AND department IS NOT NULL
             AND TRIM(department) != ''`,
          )
          .first<{ totalDepartments: number }>(),

        db
          .prepare(
            `SELECT COUNT(*) AS todayAttendance
           FROM attendances
           WHERE date = ?`,
          )
          .bind(today)
          .first<{ todayAttendance: number }>(),

        db
          .prepare(
            `SELECT COUNT(*) AS pendingLeaves
           FROM leaves
           WHERE status = 'PENDING'`,
          )
          .first<{ pendingLeaves: number }>(),
      ]);

    // 5. Return response
    return NextResponse.json(
      {
        totalEmployees: employeesResult?.totalEmployees ?? 0,
        totalDepartments: departmentsResult?.totalDepartments ?? 0,
        todayAttendance: attendanceResult?.todayAttendance ?? 0,
        pendingLeaves: leavesResult?.pendingLeaves ?? 0,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "private, no-store",
        },
      },
    );
  } catch (error) {
    console.error("Dashboard API error:", error);

    return NextResponse.json(
      { message: "Failed to load dashboard data" },
      { status: 500 },
    );
  }
};
