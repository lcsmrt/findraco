import {
  type ColumnDef,
  type Row,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronRight } from "lucide-react";
import { type ReactNode, useMemo } from "react";
import { cn } from "@/lib/mergeClasses";
import { TableContext } from "./useTable";

type TableProps<T> = {
  data: T[];
  columns: ColumnDef<T, any>[];
  tableId: string;
  children: ReactNode;
  getRowCanExpand?: (row: Row<T>) => boolean;
  border?: "none" | "x" | "y" | "all";
  className?: string;
};

export const TableRoot = <T,>({
  data,
  columns,
  tableId,
  children,
  getRowCanExpand,
  border = "y",
  className,
}: TableProps<T>) => {
  const expandable = !!getRowCanExpand;

  const allColumns = useMemo(() => {
    if (!expandable) return columns;

    const expanderColumn: ColumnDef<T, unknown> = {
      id: "__expander",
      header: () => null,
      cell: ({ row }) => {
        if (!row.getCanExpand()) return null;
        return (
          <ChevronRight
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform duration-200",
              row.getIsExpanded() && "rotate-90",
            )}
          />
        );
      },
      enableSorting: false,
    };

    return [expanderColumn, ...columns];
  }, [columns, expandable]);

  const table = useReactTable({
    data,
    columns: allColumns,
    getCoreRowModel: getCoreRowModel(),
    getRowCanExpand,
    manualSorting: true,
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
  });

  return (
    <TableContext.Provider value={{ table }}>
      <div
        id={tableId}
        className={cn(
          "overflow-x-auto w-full max-w-full mx-auto",
          border === "none" && "border-none",
          border === "x" && "border-x border-border",
          border === "y" && "border-y border-border",
          border === "all" && "border border-border",
          className,
        )}
      >
        {children}
      </div>
    </TableContext.Provider>
  );
};
