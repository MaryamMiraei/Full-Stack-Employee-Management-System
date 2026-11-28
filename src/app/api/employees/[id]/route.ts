import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { getDB } from "@/lib/db";
import { verifyToken } from "@/lib/auth/token";

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

interface IEmployee {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  department: string | null;
  position: string | null;
  joinDate: string | null;
  employmentStatus: "ACTIVE" | "INACTIVE";
  basicSalary: number;
  allowances: number;
  deductions: number;
  bio: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}

const employeeSelect = `
  SELECT
    id,
    user_id AS userId,
    first_name AS firstName,
    last_name AS lastName,
    email,
    phone,
    department,
    position,
    join_date AS joinDate,
    employment_status AS employmentStatus,
    basic_salary AS basicSalary,
    allowances,
    deductions,
    bio,
    created_at AS createdAt,
    updated_at AS updatedAt,
    is_deleted AS isDeleted
  FROM employees
`;

const getAuthenticatedAdmin = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    return { error: "Unauthorized", status: 401 };
  }

  const session = await verifyToken(token);

  if (!session) {
    return { error: "Invalid or expired session", status: 401 };
  }

  if (session.role !== "admin") {
    return { error: "Forbidden", status: 403 };
  }

  return { session };
};

// ==============================
// PATCH - Update Employee
// ==============================

export const PATCH = async (request: Request, { params }: RouteParams) => {
  try {
    // 1. Authentication and authorization
    const auth = await getAuthenticatedAdmin();

    if ("error" in auth) {
      return NextResponse.json(
        { message: auth.error },
        { status: auth.status },
      );
    }

    // 2. Get employee ID
    const { id } = await params;

    // 3. Validate request body
    const body: unknown = await request.json().catch(() => null);

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        { message: "Invalid request data" },
        { status: 400 },
      );
    }

    const updateData = body as IEmployeeUpdate;

    // 4. Validate numeric fields
    const numericFields = ["basicSalary", "allowances", "deductions"] as const;

    for (const field of numericFields) {
      const value = updateData[field];

      if (
        value !== undefined &&
        (typeof value !== "number" || !Number.isFinite(value) || value < 0)
      ) {
        return NextResponse.json(
          { message: `${field} must be a non-negative number` },
          { status: 400 },
        );
      }
    }

    if (
      updateData.employmentStatus !== undefined &&
      updateData.employmentStatus !== "ACTIVE" &&
      updateData.employmentStatus !== "INACTIVE"
    ) {
      return NextResponse.json(
        { message: "Invalid employment status" },
        { status: 400 },
      );
    }

    // 5. Find employee
    const db = getDB();

    const employee = await db
      .prepare(
        `${employeeSelect}
         WHERE id = ? AND is_deleted = 0`,
      )
      .bind(id)
      .first<IEmployee>();

    if (!employee) {
      return NextResponse.json(
        { message: "Employee not found" },
        { status: 404 },
      );
    }

    // 6. Map API fields to database columns
    const fieldMap = {
      firstName: "first_name",
      lastName: "last_name",
      phone: "phone",
      department: "department",
      position: "position",
      joinDate: "join_date",
      employmentStatus: "employment_status",
      basicSalary: "basic_salary",
      allowances: "allowances",
      deductions: "deductions",
      bio: "bio",
    } as const;

    const updates: string[] = [];
    const values: (string | number)[] = [];

    for (const [key, column] of Object.entries(fieldMap)) {
      const value = updateData[key as keyof IEmployeeUpdate];

      if (value !== undefined) {
        updates.push(`${column} = ?`);
        values.push(value);
      }
    }

    // 7. Update employee
    const updatedAt = new Date().toISOString();

    updates.push("updated_at = ?");
    values.push(updatedAt);
    values.push(id);

    await db
      .prepare(
        `UPDATE employees
         SET ${updates.join(", ")}
         WHERE id = ? AND is_deleted = 0`,
      )
      .bind(...values)
      .run();

    // 8. Get updated employee
    const updatedEmployee = await db
      .prepare(
        `${employeeSelect}
         WHERE id = ? AND is_deleted = 0`,
      )
      .bind(id)
      .first<IEmployee>();

    if (!updatedEmployee) {
      return NextResponse.json(
        { message: "Employee not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        message: "Employee updated successfully",
        employee: {
          ...updatedEmployee,
          isDeleted: Boolean(updatedEmployee.isDeleted),
        },
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
    // 1. Authentication and authorization
    const auth = await getAuthenticatedAdmin();

    if ("error" in auth) {
      return NextResponse.json(
        { message: auth.error },
        { status: auth.status },
      );
    }

    // 2. Get employee ID
    const { id } = await params;

    const db = getDB();

    // 3. Find employee
    const employee = await db
      .prepare(
        `${employeeSelect}
         WHERE id = ? AND is_deleted = 0`,
      )
      .bind(id)
      .first<IEmployee>();

    if (!employee) {
      return NextResponse.json(
        { message: "Employee not found" },
        { status: 404 },
      );
    }

    // 4. Soft Delete
    const updatedAt = new Date().toISOString();

    await db
      .prepare(
        `UPDATE employees
         SET is_deleted = 1, updated_at = ?
         WHERE id = ? AND is_deleted = 0`,
      )
      .bind(updatedAt, id)
      .run();

    const deletedEmployee = {
      ...employee,
      isDeleted: true,
      updatedAt,
    };

    return NextResponse.json(
      {
        message: "Employee deleted successfully",
        employee: deletedEmployee,
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
