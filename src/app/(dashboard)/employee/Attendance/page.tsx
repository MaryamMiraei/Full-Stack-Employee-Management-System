import AttendanceActions from "@/features/attendance/components/AttendanceAction";
import AttendanceSummary from "@/features/attendance/components/AttendanceCard";
import AttendanceTable from "@/features/attendance/components/AttendanceTable";

const AttendancePage = () => {
  return (
    <div className="space-y-8">
      <div className="mb-8 ml-15 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Attendance</h1>

          <p className="text-sm text-slate-500 mt-1">
            Track your daily working hours and attendance.
          </p>
        </div>

        <AttendanceActions />
      </div>

      <AttendanceSummary />

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Attendance History</h2>

        <AttendanceTable />
      </section>
    </div>
  );
};

export default AttendancePage;
