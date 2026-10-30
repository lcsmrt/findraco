import type { Transaction } from "@/api/dtos/transaction";
import { Amount } from "@/components/amount/Amount";
import { Skeleton } from "@/components/skeleton/base/Skeleton";
import { TablePagination } from "@/components/table";
import type { Pagination } from "@/components/table/TablePagination";
import { Heading } from "@/components/typography/base/Heading";
import { Text } from "@/components/typography/base/Text";
import { cn } from "@/lib/mergeClasses";
import { formatDate } from "@/utils/string/formatters";
import { groupByDay } from "../utils/groupByDay";

type TransactionMobileRowProps = {
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
};

/** Description, category and people on the left, signed amount on the right; tap edits when allowed. */
function TransactionMobileRow({
  transaction,
  onEdit,
}: TransactionMobileRowProps) {
  const people = transaction.participants.map((p) => p.name).join(", ");
  const details = [transaction.category?.description, people].filter(Boolean);
  return (
    <button
      type="button"
      disabled={!transaction.permissions.edit}
      onClick={() => onEdit(transaction)}
      className="active:bg-muted/60 flex w-full cursor-pointer items-center justify-between gap-3 px-3 py-2.5 text-left"
    >
      <span className="flex min-w-0 flex-col gap-0.5">
        <Text variant="label" className="truncate">
          {transaction.description}
        </Text>
        {details.length > 0 && (
          <Text variant="caption" className="truncate">
            {details.join(" · ")}
          </Text>
        )}
      </span>
      <Text className="shrink-0 whitespace-nowrap">
        <Amount value={transaction.amount} type={transaction.type} />
      </Text>
    </button>
  );
}

type TransactionMobileListProps = {
  transactions: Transaction[];
  isLoading: boolean;
  pagination?: Partial<Pagination>;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onEdit: (transaction: Transaction) => void;
  className?: string;
};

/** The narrow-screen Transactions list: the table's page, grouped by day. */
export function TransactionMobileList({
  transactions,
  isLoading,
  pagination,
  onPageChange,
  onPageSizeChange,
  onEdit,
  className,
}: TransactionMobileListProps) {
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
        <Text as="p" variant="secondary" className="flex h-24 items-center justify-center">
          No transactions found.
        </Text>
      ) : (
        days.map((group) => (
          <section key={group.day}>
            <Heading level={3} variant="caption" className="bg-muted/50 border-b px-3 py-1.5">
              {formatDate(group.day, "EEE, d MMM yyyy")}
            </Heading>
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
}
