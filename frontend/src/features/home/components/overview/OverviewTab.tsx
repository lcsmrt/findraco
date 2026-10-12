import { useGetDashboardSummary } from "@/api/services/useDashboardService";
import { useGetPlanMembers } from "@/api/services/usePlanService";
import { usePlanContext } from "@/app/providers/PlanProvider";
import { Button } from "@/components/button/Button";
import { DateRangePicker } from "@/components/input/DatePicker";
import { StandardCombobox } from "@/components/input/StandardCombobox";
import { Skeleton } from "@/components/skeleton/Skeleton";
import { cn } from "@/lib/mergeClasses";
import { differenceInCalendarMonths, format, parseISO } from "date-fns";
import { useEffect, useMemo } from "react";
import type { DateRange } from "react-day-picker";
import {
  resolvePeriodDates,
  type Period,
} from "../../filters/homeFilterParams";
import { useHomeFilters } from "../../hooks/useHomeFilters";
import { CategorySpendingChart } from "./CategorySpendingChart";
import { MonthlyTrendChart } from "./MonthlyTrendChart";
import { PersonBreakdownList } from "./PersonBreakdownList";
import { SummaryCards } from "./SummaryCards";

// StandardCombobox requires an `id`; PlanMember keys on `userId`, so members are adapted to this shape.
type MemberOption = { id: number; name: string };

const PERIOD_LABELS: Record<Period, string> = {
  "this-month": "This month",
  "last-3m": "Last 3M",
  "last-6m": "Last 6M",
  "this-year": "This year",
};

export const OverviewTab = () => {
  const { overview, updateOverview } = useHomeFilters();
  const { period, customRange, memberId } = overview;

  const { activePlanId } = usePlanContext();
  const { data: members = [], isSuccess: membersLoaded } = useGetPlanMembers(
    activePlanId ?? undefined,
  );
  const memberOptions = useMemo<MemberOption[]>(
    () => members.map((m) => ({ id: m.userId, name: m.name })),
    [members],
  );
  const showMemberPicker = memberOptions.length > 1;
  const selectedMember =
    memberOptions.find((m) => m.id === memberId) ?? null;
  const isMemberStale = membersLoaded && memberId != null && !selectedMember;
  // The member filter is ignored on single-member plans; until members load it is
  // applied as-is so the dashboard is not fetched twice for the common case.
  const effectiveMemberId =
    memberId != null && (!membersLoaded || showMemberPicker) && !isMemberStale
      ? memberId
      : null;

  useEffect(() => {
    if (isMemberStale) updateOverview((o) => ({ ...o, memberId: null }));
  }, [isMemberStale, updateOverview]);

  const isCustomActive = customRange != null;
  const customFrom = customRange?.from;
  const customTo = customRange?.to;
  const pickerRange = useMemo<DateRange | undefined>(
    () =>
      customFrom && customTo
        ? { from: parseISO(customFrom), to: parseISO(customTo) }
        : undefined,
    [customFrom, customTo],
  );

  const filter = useMemo(() => {
    const dates =
      customFrom && customTo
        ? { startDate: customFrom, endDate: customTo }
        : resolvePeriodDates(period, new Date());
    return effectiveMemberId != null
      ? { ...dates, memberId: effectiveMemberId }
      : dates;
  }, [period, customFrom, customTo, effectiveMemberId]);

  const { data, isLoading } = useGetDashboardSummary(filter);

  const monthCount = useMemo(() => {
    const start = parseISO(filter.startDate);
    const end = parseISO(filter.endDate);
    return differenceInCalendarMonths(end, start) + 1;
  }, [filter]);

  const scaledCategoryBreakdown = useMemo(() => {
    if (!data) return [];
    // SPEC_DEVIATION: remaining/percentUsed/overLimit are recomputed here
    // instead of using the backend values as-is, because the limit is
    // scaled to the selected period (monthCount) client-side, so the
    // backend's single-month evaluation would be inconsistent with the
    // scaled limit shown in the UI.
    return data.categoryBreakdown.map((entry) => {
      const limit = entry.limit != null ? entry.limit * monthCount : undefined;
      if (limit == null) {
        return {
          ...entry,
          limit: undefined,
          remaining: undefined,
          percentUsed: undefined,
          overLimit: undefined,
        };
      }
      const remaining = limit - entry.spent;
      const percentUsed =
        limit === 0 ? 0 : Math.round((entry.spent / limit) * 10000) / 100;
      const overLimit = entry.spent > limit;
      return { ...entry, limit, remaining, percentUsed, overLimit };
    });
  }, [data, monthCount]);

  const handlePeriodClick = (p: Period) =>
    updateOverview((o) => ({ ...o, period: p, customRange: null }));

  const handleCustomRangeChange = (range: DateRange | undefined) => {
    const from = range?.from;
    const to = range?.to ?? from;
    updateOverview((o) => ({
      ...o,
      customRange:
        from && to
          ? { from: format(from, "yyyy-MM-dd"), to: format(to, "yyyy-MM-dd") }
          : null,
    }));
  };

  const handleMemberChange = (member: MemberOption | null) =>
    updateOverview((o) => ({ ...o, memberId: member?.id ?? null }));

  return (
    <div className="flex flex-col gap-6 px-4">
      <div className="flex flex-wrap items-center gap-2">
        {(Object.keys(PERIOD_LABELS) as Period[]).map((p) => (
          <Button
            key={p}
            variant={period === p && !isCustomActive ? "default" : "outline"}
            onClick={() => handlePeriodClick(p)}
          >
            {PERIOD_LABELS[p]}
          </Button>
        ))}
        <DateRangePicker
          value={pickerRange}
          onChange={handleCustomRangeChange}
          placeholder="Custom period"
          className={cn(isCustomActive && "border-primary")}
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
