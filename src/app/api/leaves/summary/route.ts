import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { serverApi } from "@/lib/api/serverApi";
import { verifyToken } from "@/lib/auth/token";
import type { ILeave } from "@/features/leaves/types/leave.type";



interface IUserSession {
  userId: string;
  role: "admin" | "employee";
}

interface IEmployeeSource {
  id: string;
  userId?: string;
}

const getSession = async (): Promise<IUserSession | null> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) return null;

    const session = await verifyToken(token);

    if (!session) return null;

    return session as IUserSession;
  } catch {
    return null;
  }
};

// Calculate inclusive calendar days between two dates
const getLeaveDays = (
  startDate: string,
  endDate: string,
  year: number,
): number => {
  const start = new Date(`${startDate}T00:00:00.000Z`);
  const end = new Date(`${endDate}T00:00:00.000Z`);

  if (
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime()) ||
    start > end
  ) {
    return 0;
  }

  const yearStart = new Date(Date.UTC(year, 0, 1));
  const yearEnd = new Date(Date.UTC(year + 1, 0, 1));

  const effectiveStart = new Date(
    Math.max(start.getTime(), yearStart.getTime()),
  );

  const effectiveEnd = new Date(
    Math.min(end.getTime(), yearEnd.getTime() - 86400000),
  );

  if (effectiveStart > effectiveEnd) return 0;

  return (
    Math.floor((effectiveEnd.getTime() - effectiveStart.getTime()) / 86400000) +
    1
  );
};

export const GET = async (request: Request) => {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (session.role !== "employee") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const yearParam = searchParams.get("year");

    const year = yearParam ? Number(yearParam) : new Date().getFullYear();

    if (!Number.isInteger(year) || year < 2000 || year > 2100) {
      return NextResponse.json({ message: "Invalid year" }, { status: 400 });
    }

    // Find the employee linked to the logged-in user
    const employeesResponse =
      await serverApi.get<IEmployeeSource[]>("/employees");

    const employee = employeesResponse.data.find(
      (item) => item.userId === session.userId || item.id === session.userId,
    );

    if (!employee) {
      return NextResponse.json(
        { message: "Employee not found" },
        { status: 404 },
      );
    }

    // Get only this employee's leave requests
    const leavesResponse = await serverApi.get<ILeave[]>("/leaves");

    const approvedLeaves = leavesResponse.data.filter(
      (leave) =>
        leave.employeeId === employee.id && leave.status === "APPROVED",
    );

    const summary = {
      year,
      totalDays: 0,
      byType: {
        ANNUAL: 0,
        SICK: 0,
        UNPAID: 0,
        CASUAL: 0,
      },
    };

    approvedLeaves.forEach((leave) => {
      const days = getLeaveDays(leave.startDate, leave.endDate, year);

      if (days === 0) return;

      summary.byType[leave.type] += days;
      summary.totalDays += days;
    });

    return NextResponse.json(summary, { status: 200 });
  } catch (error) {
    console.error("Get leave summary error:", error);

    return NextResponse.json(
      { message: "Failed to get leave summary" },
      { status: 500 },
    );
  }
};
