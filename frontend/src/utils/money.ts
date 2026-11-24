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

const MINUS_SIGN = "\u2212";
const DIGIT_PARTS = new Set(["integer", "fraction"]);

// Intl keeps the sign of a value that rounds to zero ("-R$ 0,00"), which would read as a debt of nothing.
function showsOnlyZeros(parts: Intl.NumberFormatPart[]): boolean {
  return parts.every((part) => !DIGIT_PARTS.has(part.type) || /^0+$/.test(part.value));
}

/**
 * Whether `formatMoney` writes this value with a minus. Colour follows it, so a figure and its tone
 * never disagree on half a cent, which the formatter rounds away from zero and `toCents` towards it.
 */
export function isShownNegative(value: number): boolean {
  const parts = fullFormat.formatToParts(value);
  return parts.some((part) => part.type === "minusSign") && !showsOnlyZeros(parts);
}

type FormatMoneyOptions = {
  /** Short form for tight spots such as chart axes ("R$ 1,5 mil"). */
  compact?: boolean;
};

/**
 * Formats a value in reais for display ("R$ 12,34"). A negative value takes the typographic minus
 * U+2212 where the locale puts its hyphen ("−R$ 12,34"), so a sentence and a figure show the same sign.
 */
export function formatMoney(value: number, { compact = false }: FormatMoneyOptions = {}): string {
  const parts = (compact ? compactFormat : fullFormat).formatToParts(value);
  const showsZero = showsOnlyZeros(parts);
  return parts
    .map((part) => {
      if (part.type !== "minusSign") return part.value;
      return showsZero ? "" : MINUS_SIGN;
    })
    .join("");
}

/**
 * Converts reais to integer cents. Sums and comparisons of money go through cents because reais as
 * floats drift (0.1 + 0.2 is 0.30000000000000004), which breaks checks such as "items ≤ total".
 * Assumes two fraction digits, true of BRL.
 */
export function toCents(value: number): number {
  return Math.round(value * 100);
}
