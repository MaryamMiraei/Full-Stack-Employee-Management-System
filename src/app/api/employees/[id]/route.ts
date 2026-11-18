import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { serverApi } from "@/lib/api/serverApi";
import { verifyToken } from "@/lib/auth/token";
import type { IEmployee } from "@/features/employees/types/employee.type";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

interface IEmployeeUpdate {
  firstName?: string;
  lastName?: string;
  phone?: string;
  department?: string;
  position?: string;
  joinDate?: string;
  employmentStatus?: "ACTIVE" | "INACTIVE";
  basicSalary?: number;
  allowances?: number;
  deductions?: number;
  bio?: string;
}

// ==============================
// PATCH - Update Employee
// ==============================

export const PATCH = async (request: Request, { params }: RouteParams) => {
  try {
    // 1. Authentication
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const session = await verifyToken(token);

    if (!session) {
      return NextResponse.json(
        { message: "Invalid or expired session" },
        { status: 401 },
      );
    }

    // 2. Authorization
    if (session.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // 3. Get employee ID
    const { id } = await params;

    // 4. Get request body
    const body: IEmployeeUpdate = await request.json();

    // 5. Find employee
    const employeesResponse = await serverApi.get<IEmployee[]>("/employees");

    const employee = employeesResponse.data.find(
      (item) => item.id === id && !item.isDeleted,
    );

    if (!employee) {
      return NextResponse.json(
        { message: "Employee not found" },
        { status: 404 },
      );
    }

    // 6. Validate numeric fields
    const numericFields = ["basicSalary", "allowances", "deductions"] as const;

    for (const field of numericFields) {
      const value = body[field];

      if (value !== undefined && (!Number.isFinite(value) || value < 0)) {
        return NextResponse.json(
          { message: `${field} must be a non-negative number` },
          { status: 400 },
        );
      }
    }

    // 7. Update employee
    const updatedEmployee = await serverApi.patch<IEmployee>(
      `/employees/${id}`,
      {
        ...body,
        updatedAt: new Date().toISOString(),
      },
    );

    return NextResponse.json(
      {
        message: "Employee updated successfully",
        employee: updatedEmployee.data,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Update employee error:", error);

    return NextResponse.json(
      { message: "Failed to update employee" },
      { status: 500 },
    );
  }
};

// ==============================
// DELETE - Soft Delete Employee
// ==============================

export const DELETE = async (request: Request, { params }: RouteParams) => {
  try {
    // 1. Authentication
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const session = await verifyToken(token);

    if (!session) {
      return NextResponse.json(
        { message: "Invalid or expired session" },
        { status: 401 },
      );
    }

    // 2. Authorization
    if (session.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // 3. Get employee ID
    const { id } = await params;

    // 4. Find employee
    const employeesResponse = await serverApi.get<IEmployee[]>("/employees");

    const employee = employeesResponse.data.find(
      (item) => item.id === id && !item.isDeleted,
    );

    if (!employee) {
      return NextResponse.json(
        { message: "Employee not found" },
        { status: 404 },
      );
    }

    // 5. Soft Delete
    const response = await serverApi.patch<IEmployee>(`/employees/${id}`, {
      isDeleted: true,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        message: "Employee deleted successfully",
        employee: response.data,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Delete employee error:", error);

    return NextResponse.json(
      { message: "Failed to delete employee" },
      { status: 500 },
    );
  }
};
