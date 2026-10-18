import type { FinancialTransactionType } from "@/api/dtos/financialTransaction";
import { cn } from "@/lib/mergeClasses";
import { formatMoney } from "@/utils/money";

type AmountProps = {
  /** Reais, always positive: the sign comes from `type`. */
  value: number;
  type: FinancialTransactionType;
  className?: string;
};

/** A transaction value as lists show it: debits signed "- " in red, credits in green, monospace. */
export function Amount({ value, type, className }: AmountProps) {
  const isDebit = type === "DEBIT";

  return (
    <span
      className={cn(
        "font-mono",
        isDebit ? "text-destructive" : "text-success",
        className,
      )}
    >
      {isDebit && "- "}
      {formatMoney(value)}
    </span>
  );
}
