"use client";

import { useState } from "react";
import { toast } from "react-toastify";

import Button from "@/components/ui/Button";
import Table, { type IColumn } from "@/components/ui/Table";

import AdminPayslipsModal from "@/features/payslips/components/PayslipsModal";

import { months } from "@/constants/months";
import { formatCurrency } from "@/lib/utils/AUXFunctions";
import { usePayslips } from "@/features/payslips/hooks/useGetPayslips";
import type { IPayslipResponse } from "@/features/payslips/types/payslips.type";

const AdminPayslipsPage = () => {
  const [addFormModal, setAddFormModal] = useState(false);

  const { data: payslips = [], isPending, isError } = usePayslips();

  const columns: IColumn<IPayslipResponse>[] = [
    {
      key: "employee",
      title: "Employee",
      render: (row) =>
        row.employee
          ? `${row.employee.firstName} ${row.employee.lastName}`
          : "-",
    },
    {
      key: "period",
      title: "Period",
      className: "text-slate-500",
      render: (row) => {
        const month = months.find((item) => item.value === row.month);

        return `${month?.label ?? "-"} ${row.year}`;
      },
    },
    {
      key: "basicSalary",
      title: "Basic Salary",
      className: "text-slate-500",
      render: (row) => formatCurrency(row.basicSalary),
    },
    {
      key: "netSalary",
      title: "Net Salary",
      render: (row) => formatCurrency(row.netSalary),
    },
    {
      key: "actions",
      title: "Actions",
      render: (row) => (
        <a
          href={`/print/payslip/${row.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded text-blue-600 bg-blue-50 hover:bg-white ring-1 ring-blue-600/10 hover:cursor-pointer transition-transform active:scale-90"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-1.5"
            aria-hidden="true"
          >
            <path d="M12 15V3" />
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <path d="m7 10 5 5 5-5" />
          </svg>
          Download
        </a>
      ),
    },
  ];

  if (isPending) {
    return <p className="p-5">Loading payslips...</p>;
  }

  if (isError) {
    toast.error("Failed to load payslips");

    return <p className="p-5">Failed to load payslips.</p>;
  }

  return (
    <div className="p-5">
      <header className="ml-15 lg:ml-0 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-bold text-xl">Payslips</h1>
          <p className="text-gray-500 text-sm">
            Generate and manage employee payslips
          </p>
        </div>

        <Button onClick={() => setAddFormModal(true)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
          Generate Payslip
        </Button>
      </header>

      {addFormModal && (
        <AdminPayslipsModal close={() => setAddFormModal(false)} />
      )}

      <main>
        <Table
          columns={columns}
          data={payslips}
          rowKey="id"
          emptyMessage="No payslips found"
        />
      </main>
    </div>
  );
};

export default AdminPayslipsPage;
