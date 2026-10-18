/**
 * The one source of money locale and currency. Screens never name either: when i18n arrives, the
 * locale comes from the user and the currency from the data, and only this module changes.
 */
export const MONEY_LOCALE = "pt-BR";
export const MONEY_CURRENCY = "BRL";

const fullFormat = new Intl.NumberFormat(MONEY_LOCALE, {
  style: "currency",
  currency: MONEY_CURRENCY,
});

const compactFormat = new Intl.NumberFormat(MONEY_LOCALE, {
  style: "currency",
  currency: MONEY_CURRENCY,
  notation: "compact",
});

type FormatMoneyOptions = {
  /** Short form for tight spots such as chart axes ("R$ 1,5 mil"). */
  compact?: boolean;
};

/** Formats a value in reais for display ("R$ 12,34"). */
export function formatMoney(value: number, { compact = false }: FormatMoneyOptions = {}): string {
  return compact ? compactFormat.format(value) : fullFormat.format(value);
}

/**
 * Converts reais to integer cents. Sums and comparisons of money go through cents because reais as
 * floats drift (0.1 + 0.2 is 0.30000000000000004), which breaks checks such as "items ≤ total".
 * Assumes two fraction digits, true of BRL.
 */
export function toCents(value: number): number {
  return Math.round(value * 100);
}
