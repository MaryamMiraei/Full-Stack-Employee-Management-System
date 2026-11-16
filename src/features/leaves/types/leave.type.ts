export type LeaveType = "ANNUAL" | "SICK" | "UNPAID" | "PERSONAL";
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
    PERSONAL: number;
  };
}
