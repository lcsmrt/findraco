import { type ColumnDef, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { cleanup, renderHook } from "@testing-library/react";
import { ReactNode } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { TableContext, type TableContextValue, useTable } from "./useTable";

type ProbeRow = { id: number };

const rows: ProbeRow[] = [{ id: 1 }];
const columns: ColumnDef<ProbeRow>[] = [{ accessorKey: "id" }];

afterEach(cleanup);

describe("useTable", () => {
  it("throws when used outside a Table (STD-02 AC 6)", () => {
    expect(() => renderHook(() => useTable())).toThrow(
      "useTable must be used within a Table",
    );
  });

  it("returns the provided table inside a Table (STD-02 AC 6)", () => {
    const { result: tableResult } = renderHook(() =>
      useReactTable({ data: rows, columns, getCoreRowModel: getCoreRowModel() }),
    );
    const value: TableContextValue = { table: tableResult.current };
    function wrapper({ children }: { children: ReactNode }) {
      return <TableContext.Provider value={value}>{children}</TableContext.Provider>;
    }

    const { result } = renderHook(() => useTable(), { wrapper });

    expect(result.current).toBe(value);
  });
});
