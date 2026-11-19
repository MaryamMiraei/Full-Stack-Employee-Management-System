import PayslipEmployeeTable from "@/features/payslips/components/PayslipEmployeeTable";

const PayslipEmployeePage = () => {
  return (
    <div>
      <header className="ml-15 lg:ml-0 mb-8 flex flex-col gap-4">
        <h1 className="font-bold text-xl">Payslips</h1>
        <p className="text-gray-500 text-sm">
          Generate and manage employee payslips
        </p>
      </header>
      <PayslipEmployeeTable/>
    </div>
  );
};

export default PayslipEmployeePage;
