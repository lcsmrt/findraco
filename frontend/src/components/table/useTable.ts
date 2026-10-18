import type { Table } from "@tanstack/react-table";
import { createContext, useContext } from "react";

export type TableContextValue = {
  table: Table<any>;
};

export const TableContext = createContext<TableContextValue | null>(null);

export function useTable() {
  const context = useContext(TableContext);
  if (!context) throw new Error("useTable must be used within a Table");
  return context;
}
