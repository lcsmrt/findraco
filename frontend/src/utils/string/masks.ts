/**
 * Masks a raw input string as a date in dd/MM/yyyy format.
 * Non-digit characters are stripped; separators are inserted automatically.
 *
 * @example
 * maskDate("01012024") // "01/01/2024"
 * maskDate("010")      // "01/0"
 */
export const maskDate = (value: string): string => {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
};
