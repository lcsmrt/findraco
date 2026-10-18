import { isValid, parseISO } from "date-fns";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/** A positive safe integer id from a query param, or null when absent or malformed. */
export function parseId(value: string | null): number | null {
  if (value == null || !/^\d+$/.test(value)) return null;
  const n = Number(value);
  return Number.isSafeInteger(n) && n > 0 ? n : null;
}

/** A real calendar date in `yyyy-MM-dd` from a query param, or null when absent or malformed. */
export function parseDate(value: string | null): string | null {
  if (value == null || !DATE_PATTERN.test(value)) return null;
  return isValid(parseISO(value)) ? value : null;
}
