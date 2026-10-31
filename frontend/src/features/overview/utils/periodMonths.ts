import { differenceInCalendarMonths, parseISO } from "date-fns";

/** Calendar months touched by an inclusive `yyyy-MM-dd` range (Oct 15 – Nov 10 → 2). */
export function countMonths(startDate: string, endDate: string): number {
  return differenceInCalendarMonths(parseISO(endDate), parseISO(startDate)) + 1;
}
