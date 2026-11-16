import Table from "@/components/ui/Table";
import type { ILeave } from "../types/leave.type";

const LeaveEmployeeTable = () => {
  const columns = [
    { key: "type", title: "Type" },
    { key: "dates", title: "Dates" },
    { key: "reason", title: "Reason" },
    { key: "status", title: "Status" },
  ];
  const leaves: ILeave[] = [];

  return (
    <div>
      <Table
        columns={columns}
        data={leaves}
        rowKey="id"
        emptyMessage="No leave applications found"
      />
    </div>
  );
};

export default LeaveEmployeeTable;
