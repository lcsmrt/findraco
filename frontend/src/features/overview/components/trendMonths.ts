import type { MonthlyTrend } from "@/api/dtos";
import {
  addMonths,
  endOfMonth,
  format,
  parseISO,
  startOfMonth,
  subMonths,
} from "date-fns";
import type { PeriodRange } from "../utils/periodNavigator";
import { countMonths } from "../utils/scaleLimits";

/** The trend shows at least this many months (UX-05 AC 4). */
export const TREND_MONTHS = 6;

const DATE_FORMAT = "yyyy-MM-dd";

/**
 * The months the trend covers (UX-05 AC 4): the 6 calendar months ending at the
 * selected period's last month, or every month of the period when it spans more.
 */
export function trendWindow(selected: PeriodRange): PeriodRange {
  const lastMonth = parseISO(selected.endDate);
  const months = Math.max(TREND_MONTHS, countMonths(selected.startDate, selected.endDate));
  return {
    startDate: format(startOfMonth(subMonths(lastMonth, months - 1)), DATE_FORMAT),
    endDate: format(endOfMonth(lastMonth), DATE_FORMAT),
  };
}

export type TrendMonth = MonthlyTrend & {
  label: string;
  /** The month lies inside the selected period (UX-05 AC 5). */
  inPeriod: boolean;
};

function monthKey(year: number, month: number) {
  return year * 12 + (month - 1);
}

/** One entry per month of the window, zero when the API has none (UX-05 AC 5). */
export function fillTrendMonths(
  data: MonthlyTrend[],
  window: PeriodRange,
  selected: PeriodRange,
): TrendMonth[] {
  const byMonth = new Map(data.map((entry) => [monthKey(entry.year, entry.month), entry]));
  const first = startOfMonth(parseISO(window.startDate));
  const selectedFrom = startOfMonth(parseISO(selected.startDate));
  const selectedTo = startOfMonth(parseISO(selected.endDate));
  const count = countMonths(window.startDate, window.endDate);

  return Array.from({ length: count }, (_, index) => {
    const date = addMonths(first, index);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const entry = byMonth.get(monthKey(year, month));
    return {
      year,
      month,
      income: entry?.income ?? 0,
      expenses: entry?.expenses ?? 0,
      label: format(date, "MMM"),
      inPeriod: date >= selectedFrom && date <= selectedTo,
    };
  });
}
