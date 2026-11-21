import EmployeeDashboardStats from "@/features/dashboard/components/EmployeeDashboardCard";

const EmployeeDashboardPage = () => {
  return (
    <div>
      <header className="mb-8 ml-15 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center lg:ml-0">
        <h1 className="font-bold text-xl">Welcome</h1>
        <p className="text-gray-500 text-sm">Manage leave applications</p>
      </header>
      <EmployeeDashboardStats />
    </div>
  );
};

export default EmployeeDashboardPage;
