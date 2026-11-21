import { NextResponse } from "next/server";

import { serverApi } from "@/lib/api/serverApi";
import { getCurrentUser } from "@/lib/auth/auth";

import type { IEmployee } from "@/features/employees/types/employee.type";
import type { IAttendance } from "@/features/attendance/types/attendance.type";
import type { ILeave } from "@/features/leaves/types/leave.type";

export const GET = async () => {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // Fetch dashboard data simultaneously
    const [employeesResponse, attendanceResponse, leavesResponse] =
      await Promise.all([
        serverApi.get<IEmployee[]>("/employees"),
        serverApi.get<IAttendance[]>("/attendances"),
        serverApi.get<ILeave[]>("/leaves"),
      ]);

    const employees = employeesResponse.data;
    const attendances = attendanceResponse.data;
    const leaves = leavesResponse.data;

    // Active employees
    const activeEmployees = employees.filter((employee) => !employee.isDeleted);

    // Unique departments
    const departments = new Set(
      activeEmployees
        .map((employee) => employee.department?.trim())
        .filter((department) => department),
    );

    // Today's date in configured timezone
    const today = new Intl.DateTimeFormat("en-CA", {
      timeZone: process.env.ATTENDANCE_TIME_ZONE || "Asia/Tehran",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());

    // Today's attendance
    const todayAttendance = attendances.filter(
      (attendance) => attendance.date === today,
    ).length;

    // Pending leave requests
    const pendingLeaves = leaves.filter(
      (leave) => leave.status === "PENDING",
    ).length;

    return NextResponse.json(
      {
        totalEmployees: activeEmployees.length,
        totalDepartments: departments.size,
        todayAttendance,
        pendingLeaves,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "private, no-store",
        },
      },
    );
  } catch (error) {
    console.error("Get admin dashboard stats error:", error);

    return NextResponse.json(
      { message: "Failed to get dashboard statistics" },
      { status: 500 },
    );
  }
};
