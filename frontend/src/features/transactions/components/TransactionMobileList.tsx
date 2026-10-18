import type { FinancialTransaction } from "@/api/dtos/financialTransaction";
import { Amount } from "@/components/amount/Amount";
import { Skeleton } from "@/components/skeleton/base/Skeleton";
import { TablePagination } from "@/components/table";
import type { Pagination } from "@/components/table/TablePagination";
import { cn } from "@/lib/mergeClasses";
import { formatDate } from "@/utils/string/formatters";
import { groupByDay } from "./groupByDay";

type TransactionMobileRowProps = {
  transaction: FinancialTransaction;
  onEdit: (transaction: FinancialTransaction) => void;
};

/** Description, category and people on the left, signed amount on the right; tap edits (UX-02 AC 5). */
const TransactionMobileRow = ({
  transaction,
  onEdit,
}: TransactionMobileRowProps) => {
  const people = transaction.participants.map((p) => p.name).join(", ");
  const details = [transaction.category?.description, people].filter(Boolean);
  return (
    <button
      type="button"
      onClick={() => onEdit(transaction)}
      className="active:bg-muted/60 flex w-full cursor-pointer items-center justify-between gap-3 px-3 py-2.5 text-left"
    >
      <span className="flex min-w-0 flex-col gap-0.5">
        <span className="truncate text-sm font-medium">
          {transaction.description}
        </span>
        {details.length > 0 && (
          <span className="text-muted-foreground truncate text-xs">
            {details.join(" · ")}
          </span>
        )}
      </span>
      <Amount
        value={transaction.amount}
        type={transaction.type}
        className="shrink-0 text-sm whitespace-nowrap"
      />
    </button>
  );
};

type TransactionMobileListProps = {
  transactions: FinancialTransaction[];
  isLoading: boolean;
  pagination?: Partial<Pagination>;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onEdit: (transaction: FinancialTransaction) => void;
  className?: string;
};

/** The narrow-screen Transactions list: the table's page, grouped by day (UX-02 AC 4). */
export const TransactionMobileList = ({
  transactions,
  isLoading,
  pagination,
  onPageChange,
  onPageSizeChange,
  onEdit,
  className,
}: TransactionMobileListProps) => {
  const days = groupByDay(transactions);
  return (
    <div
      className={cn(
        "bg-card mx-2 overflow-hidden rounded-lg border shadow-sm",
        className,
      )}
    >
      {isLoading ? (
        <div className="flex flex-col gap-2 p-3">
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
        </div>
      ) : days.length === 0 ? (
        <p className="text-muted-foreground flex h-24 items-center justify-center text-sm">
          No transactions found.
        </p>
      ) : (
        days.map((group) => (
          <section key={group.day}>
            <h3 className="bg-muted/50 text-muted-foreground border-b px-3 py-1.5 text-xs font-medium">
              {formatDate(group.day, "EEE, d MMM yyyy")}
            </h3>
            <div className="divide-y border-b">
              {group.transactions.map((transaction) => (
                <TransactionMobileRow
                  key={transaction.id}
                  transaction={transaction}
                  onEdit={onEdit}
                />
              ))}
            </div>
          </section>
        ))
      )}
      <TablePagination
        pagination={pagination}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        isSticky={false}
      />
    </div>
  );
};
