/** Cents stay a safe integer: 15 digits is far below Number.MAX_SAFE_INTEGER. */
export const MAX_CURRENCY_DIGITS = 15;

type ParseCurrencyDigitsOptions = {
  /** The edit removed text (backspace, delete, cut) instead of adding it. */
  deleting?: boolean;
};

/**
 * Reads what was typed or pasted into a currency field as cents entered from the right, ATM-style:
 * every non-digit is ignored, so "1234" and "R$ 12,34" both give 12.34. No digit at all is `null`;
 * a typed zero is 0, because "limit R$ 0,00" is not "no limit". After a deletion, zeros alone are
 * only the display's padding ("R$ 0,0"), so they read as `null`: backspace empties the field instead
 * of sticking at R$ 0,00. Digits past the cap are dropped, so typing at the end of a full field
 * changes nothing.
 */
export function parseCurrencyDigits(
  text: string,
  { deleting = false }: ParseCurrencyDigitsOptions = {},
): number | null {
  const digits = text.replace(/\D/g, "");
  const significant = digits.replace(/^0+/, "").slice(0, MAX_CURRENCY_DIGITS);
  if (significant === "") return digits === "" || deleting ? null : 0;
  return Number(significant) / 100;
}
