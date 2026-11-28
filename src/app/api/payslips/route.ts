import { NextResponse } from "next/server";

import { getDB } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/auth";

type PayslipRow = {
  id: string;
  employeeId: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  month: number;
  year: number;
  createdAt: string;
  updatedAt: string;
  employeeFirstName: string | null;
  employeeLastName: string | null;
  employeeEmail: string | null;
  employeeDepartment: string | null;
  employeePosition: string | null;
};

const mapPayslip = (row: PayslipRow) => ({
  id: row.id,
  employeeId: row.employeeId,
  basicSalary: row.basicSalary,
  allowances: row.allowances,
  deductions: row.deductions,
  month: row.month,
  year: row.year,
  createdAt: row.createdAt,
  updatedAt: row.updatedAt,
  netSalary: row.basicSalary + row.allowances - row.deductions,
  employee: row.employeeFirstName
    ? {
        id: row.employeeId,
        firstName: row.employeeFirstName,
        lastName: row.employeeLastName,
        email: row.employeeEmail,
        department: row.employeeDepartment,
        position: row.employeePosition,
      }
    : null,
});

export const GET = async () => {
  try {
    // 1. Authentication
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const db = getDB();

    // 2. Fetch payslips based on role
    const query =
      currentUser.role === "admin"
        ? db.prepare(
            `SELECT
              p.id,
              p.employee_id AS employeeId,
              p.basic_salary AS basicSalary,
              p.allowances,
              p.deductions,
              p.month,
              p.year,
              p.created_at AS createdAt,
              p.updated_at AS updatedAt,
              e.first_name AS employeeFirstName,
              e.last_name AS employeeLastName,
              e.email AS employeeEmail,
              e.department AS employeeDepartment,
              e.position AS employeePosition
             FROM payslips p
             LEFT JOIN employees e
               ON e.id = p.employee_id
               AND e.is_deleted = 0
             ORDER BY p.year DESC, p.month DESC`,
          )
        : db.prepare(
            `SELECT
              p.id,
              p.employee_id AS employeeId,
              p.basic_salary AS basicSalary,
              p.allowances,
              p.deductions,
              p.month,
              p.year,
              p.created_at AS createdAt,
              p.updated_at AS updatedAt,
              e.first_name AS employeeFirstName,
              e.last_name AS employeeLastName,
              e.email AS employeeEmail,
              e.department AS employeeDepartment,
              e.position AS employeePosition
             FROM payslips p
             INNER JOIN employees e
               ON e.id = p.employee_id
             WHERE e.user_id = ?
               AND e.is_deleted = 0
             ORDER BY p.year DESC, p.month DESC`,
          );

    const result =
      currentUser.role === "admin"
        ? await query.all<PayslipRow>()
        : await query.bind(currentUser.userId).all<PayslipRow>();

    const payslips = result.results.map(mapPayslip);

    return NextResponse.json(payslips, {
      status: 200,
      headers: {
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    console.error("Get payslips error:", error);

    return NextResponse.json(
      { message: "Failed to fetch payslips" },
      { status: 500 },
    );
  }
};

export const POST = async (request: Request) => {
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

    // 3. Validate request body
    const body: unknown = await request.json().catch(() => null);

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        { message: "Invalid request data" },
        { status: 400 },
      );
    }

    const data = body as Record<string, unknown>;

    const { employeeId, month, year, basicSalary, allowances, deductions } =
      data;

    if (
      typeof employeeId !== "string" ||
      !employeeId.trim() ||
      typeof month !== "number" ||
      !Number.isInteger(month) ||
      month < 1 ||
      month > 12 ||
      typeof year !== "number" ||
      !Number.isInteger(year) ||
      year < 2000 ||
      ![basicSalary, allowances, deductions].every(
        (value) =>
          typeof value === "number" && Number.isFinite(value) && value >= 0,
      )
    ) {
      return NextResponse.json(
        { message: "Invalid payslip data" },
        { status: 400 },
      );
    }

    // 4. Convert validated values to numbers
    const salary = {
      basicSalary: basicSalary as number,
      allowances: allowances as number,
      deductions: deductions as number,
    };

    // 5. Find active employee
    const db = getDB();

    const employee = await db
      .prepare(
        `SELECT
          id,
          first_name AS firstName,
          last_name AS lastName,
          email,
          department,
          position
         FROM employees
         WHERE id = ?
           AND is_deleted = 0`,
      )
      .bind(employeeId.trim())
      .first<{
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        department: string | null;
        position: string | null;
      }>();

    if (!employee) {
      return NextResponse.json(
        { message: "Employee not found" },
        { status: 404 },
      );
    }

    // 6. Insert payslip
    const now = new Date().toISOString();
    const id = crypto.randomUUID();

    await db
      .prepare(
        `INSERT INTO payslips (
          id,
          employee_id,
          basic_salary,
          allowances,
          deductions,
          month,
          year,
          created_at,
          updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        id,
        employee.id,
        salary.basicSalary,
        salary.allowances,
        salary.deductions,
        month,
        year,
        now,
        now,
      )
      .run();

    // 7. Return created payslip
    const payslip = {
      id,
      employeeId: employee.id,
      basicSalary: salary.basicSalary,
      allowances: salary.allowances,
      deductions: salary.deductions,
      month,
      year,
      createdAt: now,
      updatedAt: now,
      netSalary: salary.basicSalary + salary.allowances - salary.deductions,
      employee,
    };

    return NextResponse.json(
      {
        message: "Payslip created successfully",
        payslip,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create payslip error:", error);

    return NextResponse.json(
      { message: "Failed to create payslip" },
      { status: 500 },
    );
  }
};
