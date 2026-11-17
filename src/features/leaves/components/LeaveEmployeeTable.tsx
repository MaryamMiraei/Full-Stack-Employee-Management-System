import Table, { type IColumn } from "@/components/ui/Table";
import type { ILeave } from "../types/leave.type";
import { useGetLeaves } from "../hooks/useGetLeaves";
import {
  formatDate,
  formatText,
  getLeaveStatusStyle,
} from "@/lib/utils/AUXFunctions";

const LeaveEmployeeTable = () => {
  const { data: leaves, isLoading, isError } = useGetLeaves();

  if (isLoading) return <p>Loading...</p>;

  if (isError) return <p>Something went wrong!</p>;
  const columns: IColumn<ILeave>[] = [
    {
      key: "type",
      title: "Type",
      render: (row) => formatText(row.type),
    },
    {
      key: "dates",
      title: "Dates",
      render: (row) =>
        `${formatDate(row.startDate)} / ${formatDate(row.endDate)}`,
    },
    { key: "reason", title: "Reason" },
    {
      key: "status",
      title: "Status",
      render: (row) => (
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${getLeaveStatusStyle(row.status)}`}
        >
          {formatText(row.status)}
        </span>
      ),
    },
  ];

  return (
    <div>
      <Table
        columns={columns}
        data={leaves ?? []}
        rowKey="id"
        emptyMessage="No leave applications found"
      />
    </div>
  );
};

export default LeaveEmployeeTable;
