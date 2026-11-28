import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

import { getDB } from "@/lib/db";
import { verifyToken } from "@/lib/auth/token";

import type { ICreateEmployeeRequest } from "@/features/employees/types/employee.type";

interface IEmployee {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  joinDate: string;
  employmentStatus: "ACTIVE" | "INACTIVE";
  basicSalary: number;
  allowances: number;
  deductions: number;
  bio: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}

export const POST = async (request: Request) => {
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

    // 3. Request body
    const body: ICreateEmployeeRequest = await request.json();

    const {
      email,
      password,
      firstName,
      lastName,
      phone,
      department,
      position,
      joinDate,
      employmentStatus,
      basicSalary,
      allowances,
      deductions,
      bio,
    } = body;

    // 4. Validation
    if (
      typeof email !== "string" ||
      !email.trim() ||
      typeof password !== "string" ||
      password.length < 6 ||
      typeof firstName !== "string" ||
      !firstName.trim() ||
      typeof lastName !== "string" ||
      !lastName.trim() ||
      typeof phone !== "string" ||
      typeof department !== "string" ||
      typeof position !== "string" ||
      typeof joinDate !== "string" ||
      (employmentStatus !== "ACTIVE" && employmentStatus !== "INACTIVE") ||
      ![basicSalary, allowances, deductions].every(
        (value) =>
          typeof value === "number" && Number.isFinite(value) && value >= 0,
      )
    ) {
      return NextResponse.json(
        { message: "Invalid employee data" },
        { status: 400 },
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    const db = getDB();

    // 5. Check duplicate email
    const existingUser = await db
      .prepare("SELECT id FROM users WHERE email = ?")
      .bind(normalizedEmail)
      .first<{ id: string }>();

    if (existingUser) {
      return NextResponse.json(
        { message: "This email is already registered" },
        { status: 409 },
      );
    }

    // 6. Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // 7. Generate IDs and timestamps
    const userId = crypto.randomUUID();
    const employeeId = crypto.randomUUID();
    const now = new Date().toISOString();

    // 8. Insert User and Employee atomically
    await db.batch([
      db
        .prepare(
          `INSERT INTO users (
            id,
            email,
            password_hash,
            role
          ) VALUES (?, ?, ?, ?)`,
        )
        .bind(userId, normalizedEmail, passwordHash, "employee"),

      db
        .prepare(
          `INSERT INTO employees (
            id,
            user_id,
            first_name,
            last_name,
            email,
            phone,
            department,
            position,
            join_date,
            employment_status,
            basic_salary,
            allowances,
            deductions,
            bio,
            created_at,
            updated_at,
            is_deleted
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        )
        .bind(
          employeeId,
          userId,
          firstName.trim(),
          lastName.trim(),
          normalizedEmail,
          phone,
          department,
          position,
          joinDate,
          employmentStatus,
          basicSalary,
          allowances,
          deductions,
          bio ?? "",
          now,
          now,
          0,
        ),
    ]);

    // 9. Response
    const employee: IEmployee = {
      id: employeeId,
      userId,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: normalizedEmail,
      phone,
      department,
      position,
      joinDate,
      employmentStatus,
      basicSalary,
      allowances,
      deductions,
      bio: bio ?? "",
      createdAt: now,
      updatedAt: now,
      isDeleted: false,
    };

    return NextResponse.json(
      {
        message: "Employee created successfully",
        employee,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create employee error:", error);

    return NextResponse.json(
      { message: "Unable to create employee" },
      { status: 500 },
    );
  }
};

export const GET = async (request: Request) => {
  try {
    // 1. Authentication
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const session = await verifyToken(token);

    if (!session) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    // 2. Query parameters
    const { searchParams } = new URL(request.url);
    const department = searchParams.get("department");

    const db = getDB();

    // 3. Get employees from D1
    const query = department
      ? db
          .prepare(
            `SELECT
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
            WHERE is_deleted = 0
              AND department = ?`,
          )
          .bind(department)
      : db.prepare(
          `SELECT
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
            WHERE is_deleted = 0`,
        );

    const result = await query.all<IEmployee>();

    // 4. Response
    const employees = result.results.map((employee) => ({
      ...employee,
      isDeleted: Boolean(employee.isDeleted),
    }));

    return NextResponse.json(employees, { status: 200 });
  } catch (error) {
    console.error("GET employees error:", error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
};
