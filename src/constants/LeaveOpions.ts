import type { LeaveType } from "@/features/leaves/types/leave.type";

interface ILeaveOption {
  label: string;
  value: LeaveType;
}
export const LeaveOptions: ILeaveOption[] = [
  { label: "Sick Leave", value: "SICK" },
  { label: "Casual Leave", value: "CASUAL" },
  { label: "Unpaid Leave", value: "UNPAID" },
  { label: "Annual Leave", value: "ANNUAL" },
];
