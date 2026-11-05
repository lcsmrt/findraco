import { useGetDashboardTrend } from "@/api/services/useDashboardService";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { fillTrendMonths, trendWindow } from "./utils/trendMonths";
import type { PeriodRange } from "@/utils/period";

/**
 * The Overview trend: the months around the selected period, filtered by member on the server
 * (unlike the summary and spending, which dim the other members client-side), one entry per month.
 */
export function useOverviewTrend(range: PeriodRange, memberId: number | null) {
  // The month labels are written in the language in use, so a language switch rebuilds them.
  const { i18n } = useTranslation();
  const trendRange = useMemo(() => trendWindow(range), [range]);
  const filter = useMemo(
    () => (memberId != null ? { ...trendRange, memberId } : trendRange),
    [trendRange, memberId],
  );
  const { data, isLoading } = useGetDashboardTrend(filter);
  const language = i18n.language;
  const months = useMemo(
    // `language` is read only to rebuild the labels when it changes.
    () => (language && data ? fillTrendMonths(data, trendRange, range) : undefined),
    [data, trendRange, range, language],
  );
  return { months, isLoading };
}
