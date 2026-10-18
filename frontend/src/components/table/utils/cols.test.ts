import { type ColumnDef, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { getInitialColumnSizing, stretchColumns } from "./cols";

type Row = { a: string; b: string; c: string };

describe("getInitialColumnSizing", () => {
  it("keeps fixed sizes and splits the remaining width evenly among auto columns (STD-02 AC 1)", () => {
    const sizing = getInitialColumnSizing<Row>(
      [{ id: "a", size: 100 }, { id: "b" }, { id: "c" }],
      500,
    );

    expect(sizing).toEqual({ a: 100, b: 200, c: 200 });
  });

  it("returns only the fixed sizes when no column is auto (STD-02 AC 1)", () => {
    const sizing = getInitialColumnSizing<Row>(
      [
        { id: "a", size: 100 },
        { id: "b", size: 50 },
      ],
      500,
    );

    expect(sizing).toEqual({ a: 100, b: 50 });
  });

  it("gives auto columns 0 when the fixed columns already exceed the container (STD-02 AC 1)", () => {
    const sizing = getInitialColumnSizing<Row>([{ id: "a", size: 400 }, { id: "b" }], 300);

    expect(sizing).toEqual({ a: 400, b: 0 });
  });
});

describe("stretchColumns", () => {
  const columns: ColumnDef<Row>[] = [
    { id: "a", size: 100 },
    { id: "b", size: 200 },
  ];

  function renderTable() {
    return renderHook(() =>
      useReactTable<Row>({ data: [], columns, getCoreRowModel: getCoreRowModel() }),
    );
  }

  it("scales every column up to fill the container, rounding down (STD-02 AC 1)", () => {
    const { result } = renderTable();

    act(() => stretchColumns(result.current, 400));

    expect(result.current.getState().columnSizing).toEqual({ a: 133, b: 266 });
  });

  it("leaves the sizes untouched when the columns already fill the container (STD-02 AC 1)", () => {
    const { result } = renderTable();

    act(() => stretchColumns(result.current, 300));

    expect(result.current.getState().columnSizing).toEqual({});
  });

  it("leaves the sizes untouched when the columns are wider than the container (STD-02 AC 1)", () => {
    const { result } = renderTable();

    act(() => stretchColumns(result.current, 200));

    expect(result.current.getState().columnSizing).toEqual({});
  });
});
