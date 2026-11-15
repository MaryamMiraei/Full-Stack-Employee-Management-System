export interface EmployeeFormData {
  allowances: number;
  basicSalary: number;
  bio: string;
  deductions: number;
  department: string;
  email: string;
  employmentStatus: "ACTIVE" | "INACTIVE";
  firstName: string;
  joinDate: string;
  lastName: string;
  phone: string;
  position: string;

  // Only for creating a new employee account
  password?: string;
}

export interface ICreateEmployeeRequest extends Omit<
  EmployeeFormData,
  "password"
> {
  password: string;
}

export interface IEmployee {
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