import AdminDashboardCard from "@/features/dashboard/components/AdminDashboardCard";

const AdminDashboardPage = () => {
  return (
    <div>
      <header className="ml-15 lg:ml-0 mb-8">
        <h1 className="font-bold text-xl">Dashboard</h1>
        <p className="text-gray-500 text-sm">
          Welcome back, Admin — here's your overview
        </p>
      </header>
      <main>
        <AdminDashboardCard/>
      </main>
    </div>
  );
};

export default AdminDashboardPage;
