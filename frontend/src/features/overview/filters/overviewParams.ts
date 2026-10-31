import { parseDate, parseId } from "@/utils/searchParams";
import { DEFAULT_PERIOD, PERIODS, type Period } from "@/utils/period";

export type OverviewFilters = {
  period: Period;
  /** Absolute range; when set it takes precedence over `period`. */
  customRange: { from: string; to: string } | null;
  memberId: number | null;
};

/** Every query param the Overview owns; its filters gate keeps exactly these. */
export const OVERVIEW_PARAM_KEYS = [
  "period",
  "periodFrom",
  "periodTo",
  "overviewMember",
] as const;

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
