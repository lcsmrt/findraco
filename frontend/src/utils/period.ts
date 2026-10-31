import {
  addMonths,
  differenceInCalendarMonths,
  endOfMonth,
  endOfYear,
  format,
  isSameDay,
  isSameMonth,
  isSameYear,
  parseISO,
  startOfMonth,
  startOfYear,
  subMonths,
} from "date-fns";

export type Period = "this-month" | "last-3m" | "last-6m" | "this-year";

export const PERIODS: readonly Period[] = ["this-month", "last-3m", "last-6m", "this-year"];

export const DEFAULT_PERIOD: Period = "this-month";

/** An inclusive `yyyy-MM-dd` date range. */
export type PeriodRange = { startDate: string; endDate: string };

const DATE_FORMAT = "yyyy-MM-dd";

/** Whether the range starts on a month's first day and ends on a month's last day. */
function isMonthAligned(start: Date, end: Date) {
  return isSameDay(start, startOfMonth(start)) && isSameDay(end, endOfMonth(end));
}

/**
 * The period control label: "October 2026" for one calendar month,
 * "Aug – Oct 2026" for whole months, the year on both ends when they differ.
 * A range not aligned to months shows its days ("5 – 20 Oct 2026").
 */
export function periodLabel({ startDate, endDate }: PeriodRange): string {
  const start = parseISO(startDate);
  const end = parseISO(endDate);
  const sameYear = isSameYear(start, end);

  if (isMonthAligned(start, end)) {
    if (countMonths(startDate, endDate) === 1) return format(start, "MMMM yyyy");
    return sameYear
      ? `${format(start, "MMM")} – ${format(end, "MMM yyyy")}`
      : `${format(start, "MMM yyyy")} – ${format(end, "MMM yyyy")}`;
  }
  if (isSameDay(start, end)) return format(start, "d MMM yyyy");
  if (isSameMonth(start, end)) return `${format(start, "d")} – ${format(end, "d MMM yyyy")}`;
  return sameYear
    ? `${format(start, "d MMM")} – ${format(end, "d MMM yyyy")}`
    : `${format(start, "d MMM yyyy")} – ${format(end, "d MMM yyyy")}`;
}

/**
 * Moves the range by its own length in calendar months: one month
 * steps by one, a quarter by three, a year by twelve. Month-aligned ranges stay
 * aligned to whole months.
 */
export function shiftRange(range: PeriodRange, direction: 1 | -1): PeriodRange {
  const start = parseISO(range.startDate);
  const end = parseISO(range.endDate);
  const months = countMonths(range.startDate, range.endDate) * direction;
  const aligned = isMonthAligned(start, end);
  const nextStart = addMonths(start, months);
  const nextEnd = addMonths(end, months);
  return {
    startDate: format(aligned ? startOfMonth(nextStart) : nextStart, DATE_FORMAT),
    endDate: format(aligned ? endOfMonth(nextEnd) : nextEnd, DATE_FORMAT),
  };
}

/** Calendar months touched by an inclusive `yyyy-MM-dd` range (Oct 15 – Nov 10 → 2). */
export function countMonths(startDate: string, endDate: string): number {
  return differenceInCalendarMonths(parseISO(endDate), parseISO(startDate)) + 1;
}

/** Resolves a preset token to an inclusive `yyyy-MM-dd` range relative to `now`. */
export function resolvePeriodDates(period: Period, now: Date): PeriodRange {
  function fmt(d: Date) {
    return format(d, DATE_FORMAT);
  }
  switch (period) {
    case "this-month":
      return {
        startDate: fmt(startOfMonth(now)),
        endDate: fmt(endOfMonth(now)),
      };
    case "last-3m":
      return {
        startDate: fmt(startOfMonth(subMonths(now, 2))),
        endDate: fmt(endOfMonth(now)),
      };
    case "last-6m":
      return {
        startDate: fmt(startOfMonth(subMonths(now, 5))),
        endDate: fmt(endOfMonth(now)),
      };
    case "this-year":
      return { startDate: fmt(startOfYear(now)), endDate: fmt(endOfYear(now)) };
  }
}
