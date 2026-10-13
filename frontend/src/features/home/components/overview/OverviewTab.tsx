import { useGetDashboardSummary } from "@/api/services/useDashboardService";
import { useGetCategorySpending } from "@/api/services/useFinancialTransactionCategoryService";
import { Skeleton } from "@/components/skeleton/Skeleton";
import { useMemo } from "react";
import {
  resolvePeriodDates,
  type Period,
} from "../../filters/homeFilterParams";
import { useHomeFilters } from "../../hooks/useHomeFilters";
import { PeriodNavigator } from "../PeriodNavigator";
import { countMonths } from "../../utils/scaleLimits";
import { useMemberColors } from "../../utils/memberColors";
import {
  useOverviewMemberFilter,
  type MemberOption,
} from "../../hooks/useOverviewMemberFilter";
import { CategorySpendingList } from "./CategorySpendingList";
import { MemberFilterChips } from "./MemberFilterChips";
import { MonthlyTrendChart } from "./MonthlyTrendChart";
import { PersonBreakdownList } from "./PersonBreakdownList";
import { buildSpendingRows } from "./spendingRows";
import { SummaryCards } from "./SummaryCards";

export const OverviewTab = () => {
  const { overview, updateOverview } = useHomeFilters();
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

  const filter = useMemo(
    () =>
      effectiveMemberId != null
        ? { ...range, memberId: effectiveMemberId }
        : range,
    [range, effectiveMemberId],
  );

  const { data, isLoading } = useGetDashboardSummary(filter);
  // Unfiltered: the member filter is applied client-side so the other members' segments can be dimmed.
  const { data: spending, isLoading: isSpendingLoading } = useGetCategorySpending(range);

  const monthCount = countMonths(range.startDate, range.endDate);

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

      {isLoading || !data ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
      ) : (
        <SummaryCards data={data} />
      )}

      {isSpendingLoading || !spendingView ? (
        <Skeleton className="h-80" />
      ) : (
        <CategorySpendingList view={spendingView} />
      )}

      {data && (
        <div className="flex flex-col gap-6">
          <MonthlyTrendChart data={data.monthlyTrend} />
          <PersonBreakdownList data={data.personBreakdown} />
        </div>
      )}
    </div>
  );
};
