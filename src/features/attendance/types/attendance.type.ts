export type AttendanceStatus = "IN_PROGRESS" | "COMPLETED";

export type AttendanceDayType = "WORKDAY" | "WEEKEND" | "HOLIDAY";

export interface IAttendance {
  id: string;
  employeeId: string;
  userId: string;
  date: string;
  checkIn: string;
  checkOut: string | null;
  workingMinutes: number | null;
  dayType: AttendanceDayType;
  status: AttendanceStatus;
  createdAt: string;
  updatedAt: string;
}

export interface IAttendanceSummary {
  daysPresent: number;
  lateArrivals: number;
  averageWorkMinutes: number;
}

export interface ICheckInResponse {
  message: string;
  attendance: IAttendance;
}

export interface ICheckOutResponse {
  message: string;
  attendance: IAttendance;
}
