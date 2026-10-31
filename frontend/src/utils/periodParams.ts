import { DEFAULT_PERIOD, PERIODS, resolvePeriodDates, type PeriodRange, type Period } from "./period";
import { parseDate } from "./searchParams";

export type PeriodSelection = {
  period: Period;
  /** Absolute range; when set it takes precedence over `period`. */
  customRange: { from: string; to: string } | null;
};

/** The query params a screen's period occupies; each screen's filters gate keeps them. */
export const PERIOD_PARAM_KEYS = ["period", "periodFrom", "periodTo"] as const;

const DEFAULT_SELECTION: PeriodSelection = { period: DEFAULT_PERIOD, customRange: null };

export function parsePeriodParams(params: URLSearchParams): PeriodSelection {
  const rawPeriod = params.get("period");

  if (rawPeriod === "custom") {
    const from = parseDate(params.get("periodFrom"));
    const to = parseDate(params.get("periodTo"));
    return from && to && from <= to ? { period: DEFAULT_PERIOD, customRange: { from, to } } : DEFAULT_SELECTION;
  }

  const period = PERIODS.find((p) => p === rawPeriod) ?? DEFAULT_PERIOD;
  return { period, customRange: null };
}

export function serializePeriodParams(selection: PeriodSelection): Record<string, string> {
  if (selection.customRange) {
    return { period: "custom", periodFrom: selection.customRange.from, periodTo: selection.customRange.to };
  }
  return selection.period === DEFAULT_PERIOD ? {} : { period: selection.period };
}

/** The dates a selection stands for: a custom range as is, a preset resolved against `now`. */
export function resolveSelection(selection: PeriodSelection, now: Date): PeriodRange {
  const { customRange, period } = selection;
  return customRange
    ? { startDate: customRange.from, endDate: customRange.to }
    : resolvePeriodDates(period, now);
}
