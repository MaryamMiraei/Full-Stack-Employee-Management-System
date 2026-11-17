import type { IEmployee } from "@/features/employees/types/employee.type";

export type LeaveType = "ANNUAL" | "SICK" | "UNPAID" | "CASUAL";
export type LeaveStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface ILeave {
  id: string;
  employeeId: string;

  type: LeaveType;
  startDate: string;
  endDate: string;

  reason: string;
  status: LeaveStatus;

  adminComment?: string;
  reviewedBy?: string;
  reviewedAt?: string;

  createdAt: string;
  updatedAt: string;
}

export interface ICreateLeaveRequest {
  type: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
}

export interface IUpdateLeaveStatusRequest {
  status: Exclude<LeaveStatus, "PENDING">;
  adminComment?: string;
}


export interface ILeaveSummary {
  year: number;
  totalDays: number;
  byType: {
    ANNUAL: number;
    SICK: number;
    UNPAID: number;
    CASUAL: number;
  };
}


export type ILeaveWithEmployee = ILeave & {
  employee: Pick<
    IEmployee,
    "id" | "firstName" | "lastName" | "email" | "department" | "position"
  > | null;
};

export interface IUpdateLeaveStatusRequest {
  status: "APPROVED" | "REJECTED";
  adminComment?: string;
}
