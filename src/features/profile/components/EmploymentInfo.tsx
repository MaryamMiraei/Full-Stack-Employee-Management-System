import type { IUserProfile } from "../types/profile.type";

import FormArea from "@/components/ui/FormArea";

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
    // {
    //   label: "Employee ID",
    //   value: profile.employeeId,
    // },
  ];

  return (
    <FormArea title="Employment Information">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {items.map(({ label, value }) => (
          <div key={label} className="space-y-1">
            <p className="text-sm text-gray-500">{label}</p>
            <p className="font-medium">{value || "—"}</p>
          </div>
        ))}
      </div>
    </FormArea>
  );
};

export default EmploymentInfo;
