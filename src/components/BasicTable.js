function formatCell(c, d) {
  if (typeof c === "string") {
    return d[c];
  } else if (typeof c === "function") {
    return c(d);
  } else {
    return "Uknown column: " + typeof c;
  }
}

export default function BasicTable({ columns, data, title }) {
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
