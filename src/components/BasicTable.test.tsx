import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import BasicTable from "./BasicTable";

interface Row {
  id: number;
  label: string;
}

describe("BasicTable", () => {
  const data: Row[] = [
    { id: 1, label: "First" },
    { id: 2, label: "Second" },
  ];

  it("renders the title and one row per data entry", () => {
    render(<BasicTable<Row> title="My Rows" columns={["label"]} data={data} />);

    expect(screen.getByText("My Rows")).toBeInTheDocument();
    expect(screen.getByText("First")).toBeInTheDocument();
    expect(screen.getByText("Second")).toBeInTheDocument();
  });

  it("supports function columns", () => {
    render(
      <BasicTable<Row>
        title="Computed"
        columns={[(row) => `#${row.id}`]}
        data={data}
      />
    );

    expect(screen.getByText("#1")).toBeInTheDocument();
    expect(screen.getByText("#2")).toBeInTheDocument();
  });
});
