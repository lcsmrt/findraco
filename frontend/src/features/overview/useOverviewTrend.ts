import { useGetDashboardTrend } from "@/api/services/useDashboardService";
import { useMemo } from "react";
import { fillTrendMonths, trendWindow } from "./utils/trendMonths";
import type { PeriodRange } from "./utils/periodNavigator";

/**
 * The Overview trend: the months around the selected period, filtered by member on the server
 * (unlike the summary and spending, which dim the other members client-side), one entry per month.
 */
export function useOverviewTrend(range: PeriodRange, memberId: number | null) {
  const trendRange = useMemo(() => trendWindow(range), [range]);
  const filter = useMemo(
    () => (memberId != null ? { ...trendRange, memberId } : trendRange),
    [trendRange, memberId],
  );
  const { data, isLoading } = useGetDashboardTrend(filter);
  const months = useMemo(
    () => (data ? fillTrendMonths(data, trendRange, range) : undefined),
    [data, trendRange, range],
  );
  return { months, isLoading };
}
