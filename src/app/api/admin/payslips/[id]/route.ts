import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { serverApi } from "@/lib/api/serverApi";
import { verifyToken } from "@/lib/auth/token";
import type { IPayslip, IPayslipEmployee, IPayslipResponse } from "@/features/payslips/types/payslips.type";



interface IEmployeeSource extends IPayslipEmployee {
  isDeleted: boolean;
}

interface IUserSession {
  userId: string;
  role: "admin" | "employee";
}

interface IRouteParams {
  params: Promise<{
    id: string;
  }>;
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

// GET: دریافت جزئیات یک فیش حقوقی
export const GET = async (request: Request, { params }: IRouteParams) => {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (session.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    // دریافت فیش حقوقی
    const payslipResponse = await serverApi.get<IPayslip>(
      `/payslips/${id}`,
    );

    const payslip = payslipResponse.data;

    // دریافت اطلاعات کارمند
    const employeeResponse =
      await serverApi.get<IEmployeeSource[]>("/employees");

    const employee = employeeResponse.data.find(
      (item) => item.id === payslip.employeeId && !item.isDeleted,
    );

    const result: IPayslipResponse = {
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
      netSalary: payslip.basicSalary + payslip.allowances - payslip.deductions,
    };

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Get payslip error:", error);

    return NextResponse.json(
      { message: "Failed to get payslip" },
      { status: 500 },
    );
  }
};
