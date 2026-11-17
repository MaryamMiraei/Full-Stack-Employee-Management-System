import { NextResponse } from "next/server";
import { serverApi } from "@/lib/api/serverApi";
import { getCurrentUser } from "@/lib/auth/auth";

import type {
  ILeave,
  ICreateLeaveRequest,
  LeaveType,
} from "@/features/leaves/types/leave.type";

import type { IEmployee } from "@/features/employees/types/employee.type";

export const GET = async () => {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Fetch leaves and employees simultaneously
    const [leavesResponse, employeesResponse] = await Promise.all([
      serverApi.get<ILeave[]>("/leaves"),
      serverApi.get<IEmployee[]>("/employees"),
    ]);

    const leaves = leavesResponse.data;
    const employees = employeesResponse.data;

    // Filter leaves based on user role
    const filteredLeaves =
      user.role === "admin"
        ? leaves
        : leaves.filter((leave) => leave.employeeId === user.userId);

    // Populate employee information
    const populatedLeaves = filteredLeaves.map((leave) => {
      const employee = employees.find(
        (emp) => emp.id === leave.employeeId && !emp.isDeleted,
      );

      return {
        ...leave,
        employee: employee
          ? {
              id: employee.id,
              firstName: employee.firstName,
              lastName: employee.lastName,
              email: employee.email,
              department: employee.department,
              position: employee.position,
            }
          : null,
      };
    });

    return NextResponse.json(populatedLeaves, { status: 200 });
  } catch (error) {
    console.error("Get leaves error:", error);

    return NextResponse.json(
      { message: "Failed to get leaves" },
      { status: 500 },
    );
  }
};

export const POST = async (request: Request) => {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== "employee") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const body: ICreateLeaveRequest = await request.json();

    const { type, startDate, endDate, reason } = body;

    const leaveTypes: LeaveType[] = ["ANNUAL", "SICK", "UNPAID", "CASUAL"];

    if (
      !leaveTypes.includes(type) ||
      typeof startDate !== "string" ||
      typeof endDate !== "string" ||
      typeof reason !== "string" ||
      !reason.trim()
    ) {
      return NextResponse.json(
        { message: "Invalid leave data" },
        { status: 400 },
      );
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (
      Number.isNaN(start.getTime()) ||
      Number.isNaN(end.getTime()) ||
      start > end
    ) {
      return NextResponse.json(
        { message: "Invalid leave dates" },
        { status: 400 },
      );
    }

    const now = new Date().toISOString();

    const newLeave: ILeave = {
      id: crypto.randomUUID(),
      employeeId: user.userId,
      type,
      startDate,
      endDate,
      reason: reason.trim(),
      status: "PENDING",
      createdAt: now,
      updatedAt: now,
    };

    const { data } = await serverApi.post<ILeave>("/leaves", newLeave);

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Create leave error:", error);

    return NextResponse.json(
      { message: "Failed to create leave request" },
      { status: 500 },
    );
  }
};
