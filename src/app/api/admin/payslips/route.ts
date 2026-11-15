import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { serverApi } from "@/lib/api/serverApi";
import { verifyToken } from "@/lib/auth/token";

import type {
  IPayslip,
  IPayslipEmployee,
  ICreatePayslipRequest,
  IPayslipResponse,
} from "@/features/payslips/types/payslips.type";

interface IEmployeeSource extends IPayslipEmployee {
  basicSalary: number;
  allowances: number;
  deductions: number;
  isDeleted: boolean;
}

interface IUserSession {
  userId: string;
  role: "admin" | "employee";
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

// GET: دریافت تمام فیش‌های حقوقی
export const GET = async () => {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (session.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const [payslipsResponse, employeesResponse] = await Promise.all([
      serverApi.get<IPayslip[]>("/payslips"),
      serverApi.get<IEmployeeSource[]>("/employees"),
    ]);

    const payslips = payslipsResponse.data;
    const employees = employeesResponse.data;

    const result: IPayslipResponse[] = payslips.map((payslip) => {
      const employee = employees.find(
        (item) => item.id === payslip.employeeId && !item.isDeleted,
      );

      return {
        ...payslip,
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
        netSalary:
          payslip.basicSalary + payslip.allowances - payslip.deductions,
      };
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Get payslips error:", error);

    return NextResponse.json(
      { message: "Failed to get payslips" },
      { status: 500 },
    );
  }
};

// POST: ایجاد فیش حقوقی جدید
export const POST = async (request: Request) => {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (session.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const body: ICreatePayslipRequest = await request.json();

    const { employeeId, month, year, basicSalary, allowances, deductions } =
      body;

    // اعتبارسنجی اطلاعات دریافتی
    if (
      typeof employeeId !== "string" ||
      !employeeId.trim() ||
      !Number.isInteger(month) ||
      month < 1 ||
      month > 12 ||
      !Number.isInteger(year) ||
      year < 2000 ||
      !Number.isFinite(basicSalary) ||
      basicSalary < 0 ||
      !Number.isFinite(allowances) ||
      allowances < 0 ||
      !Number.isFinite(deductions) ||
      deductions < 0
    ) {
      return NextResponse.json(
        { message: "Invalid payslip data" },
        { status: 400 },
      );
    }

    // بررسی وجود کارمند
    const employeesResponse =
      await serverApi.get<IEmployeeSource[]>("/employees");

    const employee = employeesResponse.data.find(
      (item) => item.id === employeeId && !item.isDeleted,
    );

    if (!employee) {
      return NextResponse.json(
        { message: "Employee not found" },
        { status: 404 },
      );
    }

    // ساخت فیش حقوقی
    const now = new Date().toISOString();

    const newPayslip: IPayslip = {
      id: crypto.randomUUID(),
      employeeId,
      basicSalary,
      allowances,
      deductions,
      month,
      year,
      createdAt: now,
      updatedAt: now,
    };

    // ذخیره در دیتابیس
    const response = await serverApi.post<IPayslip>("/payslips", newPayslip);

    const savedPayslip = response.data;

    // آماده‌سازی پاسخ همراه اطلاعات کارمند
    const result: IPayslipResponse = {
      ...savedPayslip,
      employee: {
        id: employee.id,
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        department: employee.department,
        position: employee.position,
      },
      netSalary:
        savedPayslip.basicSalary +
        savedPayslip.allowances -
        savedPayslip.deductions,
    };

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Create payslip error:", error);

    return NextResponse.json(
      { message: "Failed to create payslip" },
      { status: 500 },
    );
  }
};
