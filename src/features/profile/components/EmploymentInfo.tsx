import type { IUserProfile } from "../types/profile.type";

interface IEmploymentInfoProps {
  profile: IUserProfile;
}

const EmploymentInfo = ({ profile }: IEmploymentInfoProps) => {
  const items = [
    {
      label: "Department",
      value: profile.department,
    },
    {
      label: "Position",
      value: profile.position,
    },
    {
      label: "Employee ID",
      value: profile.employeeId,
    },
  ];

  return (
    <section className="rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-5">
      <h3 className="text-lg font-semibold">Employment Information</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {items.map((item) => (
          <div key={item.label} className="space-y-1">
            <p className="text-sm text-gray-500">{item.label}</p>

            <p className="font-medium">{item.value || "—"}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default EmploymentInfo;
