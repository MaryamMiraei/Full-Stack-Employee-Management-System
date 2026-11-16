import LeaveAdminTable from "@/features/leaves/components/LeaveAdminTable";

const AdminLeavePage = () => {
  return (
    <div className="p-5">
      <header className="ml-15 lg:ml-0 mb-8">
        <h1 className="font-bold text-xl">Leave Management</h1>
        <p className="text-gray-500 text-sm">Manage leave applications</p>
      </header>
      <main>
        <LeaveAdminTable />
      </main>
    </div>
  );
};

export default AdminLeavePage;
