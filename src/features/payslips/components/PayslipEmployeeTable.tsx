"use client";
import { months } from "@/constants/months";
import { formatCurrency } from "@/lib/utils/AUXFunctions";
import type { IPayslipResponse } from "../types/payslips.type";
import type { IColumn } from "@/components/ui/Table";
import { usePayslips } from "../hooks/useGetPayslips";
import { toast } from "react-toastify";
import Table from "@/components/ui/Table";

const PayslipEmployeeTable = () => {
  const columns: IColumn<IPayslipResponse>[] = [
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

  const { data: payslips = [], isPending, isError } = usePayslips();

  if (isPending) {
    return <p className="p-5">Loading payslips...</p>;
  }

  if (isError) {
    toast.error("Failed to load payslips");

    return <p className="p-5">Failed to load payslips.</p>;
  }

  return (
    <div>
      <Table
        columns={columns}
        data={payslips}
        rowKey="id"
        emptyMessage="No payslips found"
      />
    </div>
  );
};

export default PayslipEmployeeTable;
