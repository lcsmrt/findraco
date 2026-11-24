import type { ComponentProps, ReactNode } from "react";
import type { Transaction } from "@/api/dtos/transaction";
import { Badge } from "@/components/badge/base/Badge";
import { PageHeader } from "@/components/pageHeader/PageHeader";
import { PeriodNavigator } from "@/components/periodNavigator/PeriodNavigator";
import { Button } from "@/components/button/base/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/dropdown/base/Dropdown";
import { Text } from "@/components/typography/base/Text";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/input/base/InputGroup";
import { Table, TableContent, TablePagination } from "@/components/table";
import type { Sorting } from "@/components/table/components/TableHeader";
import type { Pagination } from "@/components/table/TablePagination";
import type { ColumnDef } from "@tanstack/react-table";
import { EllipsisIcon, ListChecksIcon, SearchIcon, UploadIcon, XIcon } from "lucide-react";
import { useRef } from "react";
import type { FilterChip } from "./useTransactionFilterChips";
import { TransactionMobileList } from "./components/TransactionMobileList";
import { useTranslation } from "react-i18next";

type TransactionsPageViewProps = {
  navigator: ComponentProps<typeof PeriodNavigator>;
  search: string;
  onSearchChange: (search: string) => void;
  /** The filter popover: a slot, because it loads the plan's categories itself. */
  filters: ReactNode;
  chips: FilterChip[];
  onClearFilters: () => void;
  onImport: (file: File) => void;
  isImporting: boolean;
  /** Opens the review of rows that look like neutral movements; absent for a member who may not apply. */
  onReview?: () => void;
  /** How many movements wait for review; it drives the dot and the notice, for those who may review. */
  reviewTotal: number;
  transactions: Transaction[];
  isLoading: boolean;
  pagination?: Partial<Pagination>;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  columns: ColumnDef<Transaction>[];
  sorting: Sorting[];
  onSortChange: (next: Sorting[]) => void;
  onEdit: (transaction: Transaction) => void;
  onConfirm: (transaction: Transaction) => void;
  canConfirm: (transaction: Transaction) => boolean;
};

export function TransactionsPageView({
  navigator,
  search,
  onSearchChange,
  filters,
  chips,
  onClearFilters,
  onImport,
  isImporting,
  onReview,
  reviewTotal,
  transactions,
  isLoading,
  pagination,
  onPageChange,
  onPageSizeChange,
  columns,
  sorting,
  onSortChange,
  onEdit,
  onConfirm,
  canConfirm,
}: TransactionsPageViewProps) {
  const { t } = useTranslation();
  const importLabel = isImporting
    ? t("transactions.transactionsPageView.importing")
    : t("transactions.transactionsPageView.importCsv");

  // Only those who may apply a kind are asked to review; the total alone says nothing to a viewer.
  const showReview = onReview != null && reviewTotal > 0;

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
      <div className="flex flex-col gap-2 px-4">
        <PageHeader
          title={t("app.navigation.transactions")}
          context={<PeriodNavigator {...navigator} />}
          actions={
            <>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      variant="outline"
                      size="icon"
                      className="relative"
                      aria-label={t("transactions.transactionsPageView.moreActions")}
                    >
                      <EllipsisIcon />
                      {showReview && (
                        <span
                          data-slot="review-dot"
                          aria-hidden="true"
                          className="bg-primary ring-background absolute top-1 right-1 size-2 rounded-full ring-2"
                        />
                      )}
                    </Button>
                  }
                />
                <DropdownMenuContent align="end" className="min-w-48">
                  <DropdownMenuItem onClick={handleImportClick} disabled={isImporting}>
                    <UploadIcon />
                    {importLabel}
                  </DropdownMenuItem>
                  {onReview && (
                    <DropdownMenuItem onClick={onReview}>
                      <ListChecksIcon />
                      {t("transactions.transactionsPageView.reviewMovements")}
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleFileChange}
              />
            </>
          }
        />

        <div className="flex justify-between gap-2">
          <InputGroup className="flex-1 sm:max-w-sm">
            <InputGroupInput
              placeholder={t("transactions.transactionsPageView.searchTransactions")}
              aria-label={t("transactions.transactionsPageView.searchTransactions2")}
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

        {chips.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 max-sm:gap-y-3.5">
            {chips.map((chip) => (
              <Badge
                key={chip.key}
                variant="meta"
                // 32 px visible below `sm`; the pseudo-element behind the content adds the 44 px tap area. The
                // remove button has a 1 px border, so its own pseudo reaches 7.5 px to cover 6.5 px beyond it.
                className="relative isolate gap-1 pr-1 max-sm:h-8 max-sm:overflow-visible max-sm:after:absolute max-sm:after:inset-x-0 max-sm:after:-inset-y-[6.5px] max-sm:after:-z-10"
              >
                {chip.label}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="relative h-4 w-4 rounded max-sm:size-8 max-sm:after:absolute max-sm:after:inset-x-0 max-sm:after:-inset-y-[7.5px]"
                  aria-label={t("transactions.transactionsPageView.removeFilter", {
                    name: chip.label,
                  })}
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
              {t("transactions.transactionsPageView.clearAll")}
            </Button>
          </div>
        )}

        {showReview && (
          <div
            data-slot="review-notice"
            className="bg-muted/50 flex items-center justify-between gap-3 rounded-lg border px-3 py-2"
          >
            <Text variant="body" as="p">
              {t("transactions.transactionsPageView.reviewNotice", { count: reviewTotal })}
            </Text>
            <Button variant="outline" size="sm" className="shrink-0" onClick={onReview}>
              {t("transactions.transactionsPageView.review")}
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
        onConfirm={onConfirm}
        canConfirm={canConfirm}
      />

      <div className="hidden sm:block">
        <Table
          tableId="financialTransactionsPagele"
          border="all"
          className="mx-4 w-auto rounded-lg shadow-sm"
          data={transactions}
          columns={columns}
        >
          {(table) => (
            <>
              <TableContent
                table={table}
                sorting={sorting}
                onSortChange={onSortChange}
                emptyState={t("transactions.transactionMobileList.noTransactionsFound")}
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
