import type { ReactNode } from "react";

export type Column<T> = keyof T | ((row: T) => ReactNode);

function formatCell<T>(column: Column<T>, data: T): ReactNode {
  if (typeof column === "string") {
    return data[column as keyof T] as ReactNode;
  } else if (typeof column === "function") {
    return column(data);
  } else {
    return "Uknown column: " + typeof column;
  }
}

export default function BasicTable<T>({
  columns,
  data,
  title,
}: {
  columns: Column<T>[];
  data: T[];
  title: string;
}) {
  return (
    <div>
      <table className="MyTable">
        <tbody>
          <tr>
            <td className="MyTableHeading" colSpan={columns.length}>
              {title}
            </td>
          </tr>
          {data.map((d, index_d) => (
            <tr key={index_d}>
              {columns.map((c, index_c) => (
                <td key={index_c}>{formatCell(c, d)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
