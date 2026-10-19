import type { Row, Table } from "@tanstack/react-table";
import type { ReactNode } from "react";
import { TableBody } from "./components/TableBody";
import { type Sorting, TableHeader } from "./components/TableHeader";
import { TableBase } from "./base/TableParts";

type TableContentProps<TData> = {
  table: Table<TData>;
  sorting?: Sorting[];
  onSortChange?: (sorting: Sorting[]) => void;
  stickyHeader?: boolean;
  renderSubComponent?: (row: Row<TData>) => ReactNode;
  emptyState?: ReactNode;
  isLoading?: boolean;
};

export function TableContent<TData>({
  table,
  sorting,
  onSortChange,
  stickyHeader,
  renderSubComponent,
  emptyState,
  isLoading,
}: TableContentProps<TData>) {
  return (
    <TableBase className="w-full">
      <TableHeader
        table={table}
        sorting={sorting}
        onSortChange={onSortChange}
        isSticky={stickyHeader}
      />
      <TableBody
        table={table}
        renderSubComponent={renderSubComponent}
        emptyState={emptyState}
        isLoading={isLoading}
      />
    </TableBase>
  );
}
