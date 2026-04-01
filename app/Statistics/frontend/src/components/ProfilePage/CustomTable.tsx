import type { ReactNode } from "react";

interface CustomTableProps<T> {
  title: string;
  thead: string[];
  data: T[];
  renderRow: (item: T) => ReactNode;
}

const CustomTable = <T,>({
  title,
  thead,
  data,
  renderRow,
}: CustomTableProps<T>) => {
  return (
    <div>
      <h3 className="mb-8 text-center text-phoenix">{title}</h3>
      <div className="overflow-x-auto rounded-xl border border-neutral-300 dark:border-neutral-700">
        <table className="table w-full bg-white dark:bg-neutral-800">
          <thead className="bg-neutral-200 text-neutral-700 dark:text-neutral-50 dark:bg-neutral-900">
            <tr>
              {thead.map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr
                key={index}
                className="hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors text-nowrap"
              >
                {renderRow(item)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomTable;
