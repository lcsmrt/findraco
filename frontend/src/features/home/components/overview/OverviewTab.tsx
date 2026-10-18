import {
  useGetDashboardSummary,
  useGetDashboardTrend,
} from "@/api/services/useDashboardService";
import { useGetCategorySpending } from "@/api/services/useFinancialTransactionCategoryService";
import { Skeleton } from "@/components/skeleton/Skeleton";
import { useMemo } from "react";
import {
  resolvePeriodDates,
  type Period,
} from "@/features/overview/filters/overviewParams";
import { useOverviewFilters } from "@/features/overview/filters/useOverviewFilters";
import { PeriodNavigator } from "../PeriodNavigator";
import { countMonths } from "../../utils/scaleLimits";
import { useMemberColors } from "@/utils/memberColors";
import {
  useOverviewMemberFilter,
  type MemberOption,
} from "../../hooks/useOverviewMemberFilter";
import { CategorySpendingList } from "./CategorySpendingList";
import { MemberFilterChips } from "./MemberFilterChips";
import { MonthlyTrendChart } from "./MonthlyTrendChart";
import { buildSpendingRows } from "./spendingRows";
import { SummaryCards } from "./SummaryCards";
import { summaryView } from "./summaryView";
import { fillTrendMonths, trendWindow } from "./trendMonths";

export const OverviewTab = () => {
  const { overview, updateOverview } = useOverviewFilters();
  const { period, customRange } = overview;
  const { memberOptions, showMemberPicker, selectedMember, effectiveMemberId } =
    useOverviewMemberFilter();
  const colorOf = useMemberColors();

  const customFrom = customRange?.from;
  const customTo = customRange?.to;

  const range = useMemo(
    () =>
      customFrom && customTo
        ? { startDate: customFrom, endDate: customTo }
        : resolvePeriodDates(period, new Date()),
    [period, customFrom, customTo],
  );

  // Unfiltered: the summary shows every member's segment and picks the selected member client-side.
  const { data, isLoading } = useGetDashboardSummary(range);
  const summary = useMemo(
    () => (data ? summaryView(data, effectiveMemberId, colorOf) : null),
    [data, effectiveMemberId, colorOf],
  );
  // Unfiltered: the member filter is applied client-side so the other members' segments can be dimmed.
  const { data: spending, isLoading: isSpendingLoading } = useGetCategorySpending(range);

  const monthCount = countMonths(range.startDate, range.endDate);

  const trendRange = useMemo(() => trendWindow(range), [range]);
  const trendFilter = useMemo(
    () =>
      effectiveMemberId != null ? { ...trendRange, memberId: effectiveMemberId } : trendRange,
    [trendRange, effectiveMemberId],
  );
  const { data: trend, isLoading: isTrendLoading } = useGetDashboardTrend(trendFilter);
  const trendMonths = useMemo(
    () => (trend ? fillTrendMonths(trend, trendRange, range) : undefined),
    [trend, trendRange, range],
  );

  const selectedName = selectedMember?.name;
  const focusedMember = useMemo(
    () =>
      effectiveMemberId != null && selectedName != null
        ? { id: effectiveMemberId, name: selectedName }
        : null,
    [effectiveMemberId, selectedName],
  );

  const spendingView = useMemo(
    () =>
      spending
        ? buildSpendingRows({
            tree: spending,
            monthCount,
            selectedMember: focusedMember,
            colorOf,
          })
        : null,
    [spending, monthCount, focusedMember, colorOf],
  );

  const handlePeriodClick = (p: Period) =>
    updateOverview((o) => ({ ...o, period: p, customRange: null }));

  const handleRangeChange = (next: { from: string; to: string }) =>
    updateOverview((o) => ({ ...o, customRange: next }));

  const handleMemberChange = (member: MemberOption | null) =>
    updateOverview((o) => ({ ...o, memberId: member?.id ?? null }));

  return (
    <div className="flex flex-col gap-6 px-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <PeriodNavigator
          range={range}
          period={period}
          isCustom={customRange != null}
          onPresetChange={handlePeriodClick}
          onRangeChange={handleRangeChange}
        />
        {showMemberPicker && (
          <MemberFilterChips
            members={memberOptions}
            selectedId={effectiveMemberId}
            onChange={handleMemberChange}
            colorOf={colorOf}
          />
        )}
      </div>

      {isLoading || !summary ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Skeleton className="h-28" />
          <Skeleton className="hidden h-28 sm:block" />
          <Skeleton className="hidden h-28 sm:block" />
        </div>
      ) : (
        <SummaryCards view={summary} />
      )}

      {isSpendingLoading || !spendingView ? (
        <Skeleton className="h-80" />
      ) : (
        <CategorySpendingList view={spendingView} />
      )}

      <MonthlyTrendChart months={trendMonths} isLoading={isTrendLoading} />
    </div>
  );
};
