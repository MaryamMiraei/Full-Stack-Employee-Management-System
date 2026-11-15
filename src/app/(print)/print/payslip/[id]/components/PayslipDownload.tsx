"use client";

import { useParams } from "next/navigation";
import { formatCurrency } from "@/lib/utils/AUXFunctions";
import { usePayslip } from "@/features/payslips/hooks/useGetPayslip";
import type { IColumn } from "@/components/ui/Table";
import Table from "@/components/ui/Table";
import Button from "@/components/ui/Button";

interface ISalaryRow {
  id: string;
  description: string;
  amount: number;
  isTotal?: boolean;
}

const PayslipDownload = () => {
  const params = useParams<{ id: string }>();

  const { data: payslip, isPending, isError } = usePayslip(params.id);

  const handlePrint = () => {
    window.print();
  };

  const formatMonth = (month: number) =>
    new Date(2026, month - 1).toLocaleString("en-US", {
      month: "long",
    });

  if (isPending) {
    return <p className="p-8 text-center text-slate-500">Loading payslip...</p>;
  }

  if (isError || !payslip) {
    return (
      <p className="p-8 text-center text-red-500">Failed to load payslip.</p>
    );
  }

  const salaryData: ISalaryRow[] = [
    {
      id: "basicSalary",
      description: "Basic Salary",
      amount: payslip.basicSalary,
    },
    {
      id: "allowances",
      description: "Allowances",
      amount: payslip.allowances,
    },
    {
      id: "deductions",
      description: "Deductions",
      amount: payslip.deductions,
    },
    {
      id: "netSalary",
      description: "Net Salary",
      amount: payslip.netSalary,
      isTotal: true,
    },
  ];

  const columns: IColumn<ISalaryRow>[] = [
    {
      key: "description",
      title: "DESCRIPTION",
      render: (row) => (
        <span className={row.isTotal ? "font-bold" : ""}>
          {row.description}
        </span>
      ),
    },
    {
      key: "amount",
      title: "AMOUNT",
      render: (row) => (
        <span className={row.isTotal ? "font-bold text-lg" : ""}>
          {row.id === "allowances" && "+"}
          {row.id === "deductions" && "-"}
          {formatCurrency(row.amount)}
        </span>
      ),
    },
  ];

  const payslipEmployeeDetails = [
    {
      id: "employeeName",
      label: "Employee Name",
      value: payslip.employee
        ? `${payslip.employee.firstName} ${payslip.employee.lastName}`
        : "-",
    },
    {
      id: "position",
      label: "Position",
      value: payslip.employee?.position ?? "-",
    },
    {
      id: "email",
      label: "Email",
      value: payslip.employee?.email ?? "-",
    },
    {
      id: "period",
      label: "Period",
      value: `${formatMonth(payslip.month)} ${payslip.year}`,
    },
  ];
  return (
    <div className="max-w-2xl mx-auto p-8 bg-white animate-fade-in print:max-w-full print:p-0 print:shadow-none">
      {/* Header */}
      <div className="text-center border-b border-slate-200 pb-6 mb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          PAYSLIP
        </h1>

        <p className="text-slate-500 text-sm mt-1">
          {formatMonth(payslip.month)} {payslip.year}
        </p>
      </div>

      {/* Employee Information */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {payslipEmployeeDetails.map((item) => (
          <div key={item.id}>
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
              {item.label}
            </p>

            <p className="font-semibold text-slate-900">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Salary Information */}
      <div className="rounded-xl border border-slate-200 overflow-hidden mb-8 print:overflow-visible">
        <Table
          columns={columns}
          data={salaryData}
          rowKey="id"
          emptyMessage="No salary information found"
        />
      </div>

      {/* Print Button */}
      <div className="flex justify-center print:hidden">
        <Button onClick={handlePrint}>Print Payslip</Button>
      </div>
    </div>
  );
};

export default PayslipDownload;
