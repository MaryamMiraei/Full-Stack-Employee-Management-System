export interface IPayslip {
  id: string;
  employeeId: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  month: number;
  year: number;
  createdAt: string;
  updatedAt: string;
}

export interface ICreatePayslipRequest {
  employeeId: string;
  month: number;
  year: number;
  basicSalary: number;
  allowances: number;
  deductions: number;
}

export interface IPayslipEmployee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  position: string;
}

export interface IPayslipResponse extends IPayslip {
  employee: IPayslipEmployee | null;
  netSalary: number;
}
