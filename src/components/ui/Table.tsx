import type { ReactNode } from "react";

export interface IColumn<T> {
  key: string;
  title: string;
  className?:string;
  render?: (row: T) => ReactNode;
}

interface ITableProps<T> {
  columns: IColumn<T>[];
  data: T[];
  rowKey: keyof T;
  emptyMessage?: string;
}

function Table<T>({
  columns,
  data,
  rowKey,
  emptyMessage,
}: ITableProps<T>) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-300">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="uppercase">
            <tr className="bg-slate-200/50 text-[12px] text-slate-500">
              {columns.map((column) => (
                <th key={column.key} className="px-6 py-4">
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.length > 0 ? (
              data.map((row) => (
                <tr key={String(row[rowKey])} className="hover:bg-slate-200">
                  {columns.map((column) => (
                    <td
                      key={String(column.key)}
                      className={`px-6 py-4 text-center ${column.className ?? ""}`}
                    >
                      {column.render
                        ? column.render(row)
                        : String(row[column.key as keyof T] ?? "")}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-12 text-center text-slate-400"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Table;
