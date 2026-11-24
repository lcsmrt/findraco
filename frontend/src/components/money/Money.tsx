import { Text } from "@/components/typography/base/Text";
import type { TypographyVariant } from "@/components/typography/base/typographyVariants";
import { cn } from "@/lib/mergeClasses";
import { formatMoney, isShownNegative } from "@/utils/money";

export type MoneyTone = "default" | "income" | "expense" | "bySign";

type MoneyProps = {
  /** Reais, signed: a negative value shows the minus. */
  value: number;
  /** `bySign` follows what the figure shows, so a value that rounds to zero is not red. */
  tone?: MoneyTone;
  variant?: TypographyVariant;
  as?: "span" | "p" | "div";
  className?: string;
};

function toneClass(tone: MoneyTone, value: number) {
  if (tone === "income") return "text-success";
  if (tone === "expense") return "text-destructive";
  if (tone === "bySign") return isShownNegative(value) ? "text-destructive" : "text-success";
  return undefined;
}

/**
 * The one way to show a standalone money figure: pt-BR format with a typographic minus, tabular
 * digits in the app typeface, never wrapped.
 */
export function Money({ value, tone = "default", variant, as, className }: MoneyProps) {
  return (
    <Text
      as={as}
      variant={variant}
      numeric
      className={cn("whitespace-nowrap", toneClass(tone, value), className)}
    >
      {formatMoney(value)}
    </Text>
  );
}
