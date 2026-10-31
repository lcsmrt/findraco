import {
  PERIOD_PARAM_KEYS,
  parsePeriodParams,
  serializePeriodParams,
  type PeriodSelection,
} from "@/utils/periodParams";
import { parseId } from "@/utils/searchParams";

export type OverviewFilters = PeriodSelection & {
  memberId: number | null;
};

/** Every query param the Overview owns; its filters gate keeps exactly these. */
export const OVERVIEW_PARAM_KEYS = [...PERIOD_PARAM_KEYS, "overviewMember"] as const;

export function parseOverviewFilters(params: URLSearchParams): OverviewFilters {
  return { ...parsePeriodParams(params), memberId: parseId(params.get("overviewMember")) };
}

export function serializeOverviewFilters(filters: OverviewFilters): Record<string, string> {
  const out = serializePeriodParams(filters);
  if (filters.memberId != null) out.overviewMember = String(filters.memberId);
  return out;
}
