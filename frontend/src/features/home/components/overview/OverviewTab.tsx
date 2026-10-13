import { useGetDashboardSummary } from "@/api/services/useDashboardService";
import { StandardCombobox } from "@/components/input/StandardCombobox";
import { Skeleton } from "@/components/skeleton/Skeleton";
import { useMemo } from "react";
import {
  resolvePeriodDates,
  type Period,
} from "../../filters/homeFilterParams";
import { useHomeFilters } from "../../hooks/useHomeFilters";
import { PeriodNavigator } from "../PeriodNavigator";
import { countMonths, scaleTreeLimits } from "../../utils/scaleLimits";
import {
  useOverviewMemberFilter,
  type MemberOption,
} from "../../hooks/useOverviewMemberFilter";
import { CategorySpendingChart } from "./CategorySpendingChart";
import { MonthlyTrendChart } from "./MonthlyTrendChart";
import { PersonBreakdownList } from "./PersonBreakdownList";
import { SummaryCards } from "./SummaryCards";

export const OverviewTab = () => {
  const { overview, updateOverview } = useHomeFilters();
  const { period, customRange } = overview;
  const { memberOptions, showMemberPicker, selectedMember, effectiveMemberId } =
    useOverviewMemberFilter();

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

  const monthCount = countMonths(filter.startDate, filter.endDate);

  // SPEC_DEVIATION: remaining/percentUsed/overLimit are recomputed on the
  // client instead of using the backend values as-is, because the limit is
  // scaled to the selected period (monthCount) client-side, so the backend's
  // single-month evaluation would be inconsistent with the scaled limit shown.
  const scaledCategoryBreakdown = useMemo(
    () => (data ? scaleTreeLimits(data.categoryBreakdown, monthCount) : []),
    [data, monthCount],
  );

  const handlePeriodClick = (p: Period) =>
    updateOverview((o) => ({ ...o, period: p, customRange: null }));

  const handleRangeChange = (next: { from: string; to: string }) =>
    updateOverview((o) => ({ ...o, customRange: next }));

  const handleMemberChange = (member: MemberOption | null) =>
    updateOverview((o) => ({ ...o, memberId: member?.id ?? null }));

  return (
    <div className="flex flex-col gap-6 px-4">
      <div className="flex flex-wrap items-center gap-2">
        <PeriodNavigator
          range={range}
          period={period}
          isCustom={customRange != null}
          onPresetChange={handlePeriodClick}
          onRangeChange={handleRangeChange}
        />
        {showMemberPicker && (
          <div className="min-w-48">
            <StandardCombobox
              items={memberOptions}
              value={selectedMember}
              onValueChange={handleMemberChange}
              itemLabel={(m) => m.name}
              placeholder="All members"
              clearable
            />
          </div>
        )}
      </div>

      {isLoading || !data ? (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
          </div>
          <div className="flex flex-col gap-6">
            <Skeleton className="h-80" />
            <Skeleton className="h-80" />
          </div>
        </div>
      ) : (
        <>
          <SummaryCards data={data} />
          <div className="flex flex-col gap-6">
            <CategorySpendingChart data={scaledCategoryBreakdown} />
            <MonthlyTrendChart data={data.monthlyTrend} />
            <PersonBreakdownList data={data.personBreakdown} />
          </div>
        </>
      )}
    </div>
  );
};
