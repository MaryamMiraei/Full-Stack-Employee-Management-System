import { NextResponse } from "next/server";

import { getDB } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/auth";

interface IRouteParams {
  params: Promise<{
    id: string;
  }>;
}

interface IPayslipRow {
  id: string;
  employeeId: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  month: number;
  year: number;
  createdAt: string;
  updatedAt: string;
  employeeFirstName: string;
  employeeLastName: string;
  employeeEmail: string;
  employeeDepartment: string | null;
  employeePosition: string | null;
}

export const GET = async (_request: Request, { params }: IRouteParams) => {
  try {
    // 1. Authentication
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 2. Get payslip ID
    const { id } = await params;

    const db = getDB();

    // 3. Fetch payslip and employee
    const payslip = await db
      .prepare(
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
         WHERE p.id = ?
           AND e.is_deleted = 0`,
      )
      .bind(id)
      .first<IPayslipRow>();

    if (!payslip) {
      return NextResponse.json(
        { message: "Payslip not found" },
        { status: 404 },
      );
    }

    // 4. Employee can only access their own payslip
    if (
      currentUser.role === "employee" &&
      payslip.employeeId !== currentUser.userId
    ) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // 5. Build response
    const response = {
      id: payslip.id,
      employeeId: payslip.employeeId,
      basicSalary: payslip.basicSalary,
      allowances: payslip.allowances,
      deductions: payslip.deductions,
      month: payslip.month,
      year: payslip.year,
      createdAt: payslip.createdAt,
      updatedAt: payslip.updatedAt,
      netSalary: payslip.basicSalary + payslip.allowances - payslip.deductions,
      employee: {
        id: payslip.employeeId,
        firstName: payslip.employeeFirstName,
        lastName: payslip.employeeLastName,
        email: payslip.employeeEmail,
        department: payslip.employeeDepartment,
        position: payslip.employeePosition,
      },
    };

    return NextResponse.json(response, {
      status: 200,
      headers: {
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    console.error("Get payslip error:", error);

    return NextResponse.json(
      { message: "Failed to fetch payslip" },
      { status: 500 },
    );
  }
};
