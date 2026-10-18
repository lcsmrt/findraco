import { useSearchParamGroup } from "@/hooks/useSearchParamGroup";
import {
  OVERVIEW_PARAM_KEYS,
  parseOverviewFilters,
  serializeOverviewFilters,
} from "./overviewParams";

/** Overview filters, read from and written to the URL query string (the single source of truth). */
export function useOverviewFilters() {
  const { value, update } = useSearchParamGroup(
    OVERVIEW_PARAM_KEYS,
    parseOverviewFilters,
    serializeOverviewFilters,
  );
  return { overview: value, updateOverview: update };
}
