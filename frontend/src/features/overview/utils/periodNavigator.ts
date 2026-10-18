import {
  addMonths,
  endOfMonth,
  format,
  isSameDay,
  isSameMonth,
  isSameYear,
  parseISO,
  startOfMonth,
} from "date-fns";
import { resolvePeriodDates, type Period } from "../filters/overviewParams";
import { countMonths } from "./scaleLimits";

/** An inclusive `yyyy-MM-dd` date range. */
export type PeriodRange = { startDate: string; endDate: string };

const DATE_FORMAT = "yyyy-MM-dd";

/** Whether the range starts on a month's first day and ends on a month's last day. */
const isMonthAligned = (start: Date, end: Date) =>
  isSameDay(start, startOfMonth(start)) && isSameDay(end, endOfMonth(end));

/**
 * The period control label (UX-05 AC 8): "October 2026" for one calendar month,
 * "Aug – Oct 2026" for whole months, the year on both ends when they differ.
 * A range not aligned to months shows its days ("5 – 20 Oct 2026").
 */
export const periodLabel = ({ startDate, endDate }: PeriodRange): string => {
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
};

/**
 * Moves the range by its own length in calendar months (UX-05 AC 8): one month
 * steps by one, a quarter by three, a year by twelve. Month-aligned ranges stay
 * aligned to whole months.
 */
export const shiftRange = (range: PeriodRange, direction: 1 | -1): PeriodRange => {
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
};

/** Dates of a range-menu preset (UX-05 AC 9), resolved like the home filters. */
export const presetRange = (preset: Period, now: Date): PeriodRange =>
  resolvePeriodDates(preset, now);
