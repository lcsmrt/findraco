import type { TransactionType } from "@/api/dtos/transaction";
import type { TypographyVariant } from "@/components/typography/base/typographyVariants";
import { Money } from "./Money";

type TransactionAmountProps = {
  /** Reais, always positive: the sign comes from `type`. */
  amount: number;
  type: TransactionType;
  variant?: TypographyVariant;
  className?: string;
};

/** A transaction value as the lists show it: a debit negative in red, a credit unsigned in green. */
export function TransactionAmount({ amount, type, variant, className }: TransactionAmountProps) {
  return (
    <Money
      value={type === "DEBIT" ? -amount : amount}
      tone="bySign"
      variant={variant}
      className={className}
    />
  );
}
