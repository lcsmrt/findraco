/** Cents stay a safe integer: 15 digits is far below Number.MAX_SAFE_INTEGER. */
export const MAX_CURRENCY_DIGITS = 15;

/**
 * Reads what was typed or pasted into a currency field as cents entered from the right, ATM-style:
 * every non-digit is ignored, so "1234" and "R$ 12,34" both give 12.34. No digit left (or only
 * zeros) is `null`, which lets backspace empty the field instead of sticking at R$ 0,00. Digits past
 * the cap are dropped, so typing at the end of a full field changes nothing.
 */
export function parseCurrencyDigits(text: string): number | null {
  const digits = text.replace(/\D/g, "").replace(/^0+/, "").slice(0, MAX_CURRENCY_DIGITS);
  if (digits === "") return null;
  return Number(digits) / 100;
}
