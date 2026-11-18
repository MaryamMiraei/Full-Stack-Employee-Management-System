import { NextResponse } from "next/server";

import { serverApi } from "@/lib/api/serverApi";

import type {
  IPayslip,
  IPayslipEmployee,
  IPayslipResponse,
} from "@/features/payslips/types/payslips.type";
import { getCurrentUser } from "@/lib/auth/auth";

interface IEmployeeSource extends IPayslipEmployee {
  isDeleted: boolean;
  userId: string;
}

interface IRouteParams {
  params: Promise<{
    id: string;
  }>;
}

// GET: دریافت جزئیات یک فیش حقوقی
export const GET = async (request: Request, { params }: IRouteParams) => {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // دریافت فیش حقوقی
    const { data: payslip } = await serverApi.get<IPayslip>(`/payslips/${id}`);

    // دریافت اطلاعات کارمند
    const { data: employees } =
      await serverApi.get<IEmployeeSource[]>("/employees");

    const employee = employees.find(
      (item) => item.id === payslip.employeeId && !item.isDeleted,
    );

    if (!employee) {
      return NextResponse.json(
        { message: "Employee not found" },
        { status: 404 },
      );
    }

    // بررسی مالکیت فیش برای کارمند
    if (user.role === "employee" && employee.userId !== user.userId) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const result: IPayslipResponse = {
      ...payslip,
      employee: {
        id: employee.id,
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        department: employee.department,
        position: employee.position,
      },
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
