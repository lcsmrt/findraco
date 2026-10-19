import { parseDate, parseId } from "@/utils/searchParams";
import {
  endOfMonth,
  endOfYear,
  format,
  startOfMonth,
  startOfYear,
  subMonths,
} from "date-fns";

export type Period = "this-month" | "last-3m" | "last-6m" | "this-year";

export type OverviewFilters = {
  period: Period;
  /** Absolute range; when set it takes precedence over `period`. */
  customRange: { from: string; to: string } | null;
  memberId: number | null;
};

export const DEFAULT_PERIOD: Period = "this-month";

/** Every query param the Overview owns; the home gate persists exactly these. */
export const OVERVIEW_PARAM_KEYS = [
  "period",
  "periodFrom",
  "periodTo",
  "overviewMember",
] as const;

const PERIODS: readonly Period[] = [
  "this-month",
  "last-3m",
  "last-6m",
  "this-year",
];

const DATE_FORMAT = "yyyy-MM-dd";

export function parseOverviewFilters(params: URLSearchParams): OverviewFilters {
  const memberId = parseId(params.get("overviewMember"));
  const rawPeriod = params.get("period");

  if (rawPeriod === "custom") {
    const from = parseDate(params.get("periodFrom"));
    const to = parseDate(params.get("periodTo"));
    if (from && to && from <= to) {
      return { period: DEFAULT_PERIOD, customRange: { from, to }, memberId };
    }
    return { period: DEFAULT_PERIOD, customRange: null, memberId };
  }

  const period = PERIODS.find((p) => p === rawPeriod) ?? DEFAULT_PERIOD;
  return { period, customRange: null, memberId };
}

export function serializeOverviewFilters(
  filters: OverviewFilters,
): Record<string, string> {
  const out: Record<string, string> = {};
  if (filters.customRange) {
    out.period = "custom";
    out.periodFrom = filters.customRange.from;
    out.periodTo = filters.customRange.to;
  } else if (filters.period !== DEFAULT_PERIOD) {
    out.period = filters.period;
  }
  if (filters.memberId != null) out.overviewMember = String(filters.memberId);
  return out;
}

/** Resolves a preset token to an inclusive `yyyy-MM-dd` range relative to `now`. */
export function resolvePeriodDates(period: Period, now: Date) {
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
