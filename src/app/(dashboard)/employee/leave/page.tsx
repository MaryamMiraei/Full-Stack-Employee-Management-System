import LeaveEmployeeCards from "@/features/leaves/components/LeaveEmployeeCards";
import LeaveEmployeeTable from "@/features/leaves/components/LeaveEmployeeTable";
import React from "react";

const EmployeeLeavePage = () => {
  return (
    <div className="p-5">
      <header className="ml-15 lg:ml-0 mb-8">
        <h1 className="font-bold text-xl">Leave Management</h1>
        <p className="text-gray-500 text-sm">Manage leave applications</p>
      </header>
      <main>
        <div>
          <LeaveEmployeeCards />
        </div>
        <LeaveEmployeeTable />
      </main>
    </div>
  );
};

export default EmployeeLeavePage;
