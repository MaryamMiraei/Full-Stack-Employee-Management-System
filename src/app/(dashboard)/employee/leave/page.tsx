"use client";
import Button from "@/components/ui/Button";
import LeaveEmployeeCards from "@/features/leaves/components/LeaveEmployeeCards";
import LeaveEmployeeModal from "@/features/leaves/components/LeaveEmployeeModal";
import LeaveEmployeeTable from "@/features/leaves/components/LeaveEmployeeTable";
import { Plus } from "lucide-react";
import { useState } from "react";

const EmployeeLeavePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <header className="mb-8 ml-15 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center lg:ml-0">
        <div>
          <h1 className="font-bold text-xl">Leave Management</h1>
          <p className="text-gray-500 text-sm">Manage leave applications</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} icon={<Plus size={16} />}>
          Apply for leave
        </Button>
      </header>
      {isModalOpen && (
        <LeaveEmployeeModal close={() => setIsModalOpen(false)} />
      )}
      <main className="flex flex-col gap-5">
        <div>
          <LeaveEmployeeCards />
        </div>
        <div>
          <LeaveEmployeeTable />
        </div>
      </main>
    </div>
  );
};

export default EmployeeLeavePage;
