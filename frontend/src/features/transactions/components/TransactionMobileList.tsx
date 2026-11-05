import type { Transaction } from "@/api/dtos/transaction";
import { Amount } from "@/components/amount/Amount";
import { Button } from "@/components/button/base/Button";
import { Skeleton } from "@/components/skeleton/base/Skeleton";
import { TablePagination } from "@/components/table";
import type { Pagination } from "@/components/table/TablePagination";
import { Heading } from "@/components/typography/base/Heading";
import { Text } from "@/components/typography/base/Text";
import { cn } from "@/lib/mergeClasses";
import { formatPattern } from "@/utils/dates";
import { TransactionStatusBadge } from "./TransactionCells";
import { groupByDay } from "../utils/groupByDay";
import { CheckIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

const DAY_HEADING_PATTERN = "EEE, d MMM yyyy";

type TransactionMobileRowProps = {
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
  /** Present only for a row the member may confirm. */
  onConfirm?: (transaction: Transaction) => void;
};

/**
 * Description, category and people on the left, signed amount on the right; tap edits when allowed.
 * Confirm sits beside the row, not inside it, so a tap on it never opens the edit drawer.
 */
function TransactionMobileRow({ transaction, onEdit, onConfirm }: TransactionMobileRowProps) {
  const { t } = useTranslation();
  const people = transaction.participants.map((p) => p.name).join(", ");
  const details = [transaction.category?.description, people].filter(Boolean);
  return (
    <div className="flex items-center">
      <button
        type="button"
        disabled={!transaction.permissions.edit}
        onClick={() => onEdit(transaction)}
        className="active:bg-muted/60 flex min-w-0 flex-1 cursor-pointer items-center justify-between gap-3 px-3 py-2.5 text-left"
      >
        <span className="flex min-w-0 flex-col gap-0.5">
          <span className="flex items-center gap-1.5">
            <Text variant="label" className="truncate">
              {transaction.description}
            </Text>
            <TransactionStatusBadge status={transaction.status} />
          </span>
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
      {onConfirm && (
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="text-muted-foreground mr-1 shrink-0"
          aria-label={t("common.confirm")}
          onClick={() => onConfirm(transaction)}
        >
          <CheckIcon className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

type TransactionMobileListProps = {
  transactions: Transaction[];
  isLoading: boolean;
  pagination?: Partial<Pagination>;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onEdit: (transaction: Transaction) => void;
  onConfirm: (transaction: Transaction) => void;
  /** The same rule as the table's Confirm action. */
  canConfirm: (transaction: Transaction) => boolean;
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
  onConfirm,
  canConfirm,
  className,
}: TransactionMobileListProps) {
  const { t } = useTranslation();

  const days = groupByDay(transactions);
  return (
    <div className={cn("bg-card mx-4 overflow-hidden rounded-lg border shadow-sm", className)}>
      {isLoading ? (
        <div className="flex flex-col gap-2 p-3">
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
        </div>
      ) : days.length === 0 ? (
        <Text as="p" variant="secondary" className="flex h-24 items-center justify-center">
          {t("transactions.transactionMobileList.noTransactionsFound")}
        </Text>
      ) : (
        days.map((group) => (
          <section key={group.day}>
            <Heading level={3} variant="caption" className="bg-muted/50 border-b px-3 py-1.5">
              {formatPattern(group.day, DAY_HEADING_PATTERN)}
            </Heading>
            <div className="divide-y border-b">
              {group.transactions.map((transaction) => (
                <TransactionMobileRow
                  key={transaction.id}
                  transaction={transaction}
                  onEdit={onEdit}
                  onConfirm={canConfirm(transaction) ? onConfirm : undefined}
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
