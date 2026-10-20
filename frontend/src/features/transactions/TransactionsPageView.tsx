import type { ReactNode } from "react";
import type { FinancialTransaction } from "@/api/dtos/financialTransaction";
import { Badge } from "@/components/badge/base/Badge";
import { Button } from "@/components/button/base/Button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/input/base/InputGroup";
import { Table, TableContent, TablePagination } from "@/components/table";
import type { Sorting } from "@/components/table/components/TableHeader";
import type { Pagination } from "@/components/table/TablePagination";
import type { ColumnDef } from "@tanstack/react-table";
import { SearchIcon, UploadIcon, XIcon } from "lucide-react";
import { useRef } from "react";
import type { FilterChip } from "./useTransactionFilterChips";
import { TransactionMobileList } from "./components/TransactionMobileList";

type TransactionsPageViewProps = {
  search: string;
  onSearchChange: (search: string) => void;
  /** The filter popover: a slot, because it loads the plan's categories itself. */
  filters: ReactNode;
  chips: FilterChip[];
  onClearFilters: () => void;
  onImport: (file: File) => void;
  isImporting: boolean;
  transactions: FinancialTransaction[];
  isLoading: boolean;
  pagination?: Partial<Pagination>;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  columns: ColumnDef<FinancialTransaction>[];
  sorting: Sorting[];
  onSortChange: (next: Sorting[]) => void;
  onEdit: (transaction: FinancialTransaction) => void;
};

export function TransactionsPageView({
  search,
  onSearchChange,
  filters,
  chips,
  onClearFilters,
  onImport,
  isImporting,
  transactions,
  isLoading,
  pagination,
  onPageChange,
  onPageSizeChange,
  columns,
  sorting,
  onSortChange,
  onEdit,
}: TransactionsPageViewProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleImportClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      onImport(file);
      e.target.value = "";
    }
  }

  return (
    <>
      <div className="flex flex-col gap-2 px-2">
        <div className="flex gap-2">
          <div className="flex flex-1 justify-between gap-2">
            <InputGroup className="flex-1 sm:max-w-sm">
              <InputGroupInput
                placeholder="Search transactions..."
                aria-label="Search transactions"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-9"
              />
              <InputGroupAddon>
                <SearchIcon className="text-muted-foreground pointer-events-none h-4 w-4" />
              </InputGroupAddon>
            </InputGroup>

            {filters}
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleImportClick}
              disabled={isImporting}
              // The label hides below `sm`; the button keeps its name there.
              aria-label={isImporting ? "Importing..." : "Import CSV"}
            >
              <UploadIcon className="h-4 w-4" />
              <span className="hidden sm:inline">
                {isImporting ? "Importing..." : "Import CSV"}
              </span>
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>

        {chips.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {chips.map((chip) => (
              <Badge key={chip.key} variant="outline" className="gap-1 pr-1">
                {chip.label}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 rounded"
                  aria-label={`Remove ${chip.label}`}
                  onClick={chip.onRemove}
                >
                  <XIcon className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
            <Button
              type="button"
              variant="link"
              size="xs"
              className="text-muted-foreground h-auto p-0"
              onClick={onClearFilters}
            >
              Clear all
            </Button>
          </div>
        )}
      </div>

      <TransactionMobileList
        className="sm:hidden"
        transactions={transactions}
        isLoading={isLoading}
        pagination={pagination}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        onEdit={onEdit}
      />

      <div className="hidden sm:block">
        <Table
          tableId="financialTransactionsPagele"
          border="all"
          className="mx-2 w-auto rounded-lg shadow-sm"
          data={transactions}
          columns={columns}
        >
          {(table) => (
            <>
              <TableContent
                table={table}
                sorting={sorting}
                onSortChange={onSortChange}
                emptyState="No transactions found."
                isLoading={isLoading}
              />
              <TablePagination
                pagination={pagination}
                onPageChange={onPageChange}
                onPageSizeChange={onPageSizeChange}
              />
            </>
          )}
        </Table>
      </div>
    </>
  );
}
