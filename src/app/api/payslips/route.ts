import { NextResponse } from "next/server";


import { serverApi } from "@/lib/api/serverApi";

import type {
  IPayslip,
  IPayslipEmployee,
  ICreatePayslipRequest,
  IPayslipResponse,
} from "@/features/payslips/types/payslips.type";
import { getCurrentUser } from "@/lib/auth/auth";

interface IEmployeeSource extends IPayslipEmployee {
  basicSalary: number;
  allowances: number;
  deductions: number;
  isDeleted: boolean;
  userId: string;
}

export const GET = async () => {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { data: payslips } =
      await serverApi.get<IPayslip[]>("/payslips");

    const { data: employees } =
      await serverApi.get<IEmployeeSource[]>("/employees");

    // فیلتر کردن فیش‌ها برای کارمند
    const filteredPayslips =
      user.role === "admin"
        ? payslips
        : payslips.filter((payslip) => {
            const employee = employees.find(
              (item) => item.id === payslip.employeeId
            );

            return employee?.userId === user.userId;
          });

    // اضافه کردن اطلاعات کارمند و محاسبه حقوق خالص
    const result: IPayslipResponse[] = filteredPayslips.map(
      (payslip) => {
        const employee = employees.find(
          (item) =>
            item.id === payslip.employeeId && !item.isDeleted
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
            payslip.basicSalary +
            payslip.allowances -
            payslip.deductions,
        };
      }
    );

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Get payslips error:", error);

    return NextResponse.json(
      { message: "Failed to get payslips" },
      { status: 500 }
    );
  }
};
// POST: ایجاد فیش حقوقی جدید
export const POST = async (request: Request) => {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== "admin") {
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
    const { data: employees } =
      await serverApi.get<IEmployeeSource[]>("/employees");

    const employee = employees.find(
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

    // ذخیره فیش حقوقی
    const { data: savedPayslip } = await serverApi.post<IPayslip>(
      "/payslips",
      newPayslip,
    );

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