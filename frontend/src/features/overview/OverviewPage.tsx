import { useGetDashboardSummary } from "@/api/services/useDashboardService";
import { useGetCategorySpending } from "@/api/services/useCategoryService";
import { useMemo } from "react";
import {
  resolvePeriodDates,
  type Period,
} from "./filters/overviewParams";
import { useOverviewFilters } from "./filters/useOverviewFilters";
import { useMemberColors } from "@/hooks/useMemberColors";
import {
  useOverviewMemberFilter,
  type MemberOption,
} from "./useOverviewMemberFilter";
import { buildSpendingRows } from "./utils/spendingRows";
import { summaryView } from "./utils/summaryView";
import { useOverviewTrend } from "./useOverviewTrend";
import { OverviewPageView } from "./OverviewPageView";

export function OverviewPage() {
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

  const trend = useOverviewTrend(range, effectiveMemberId);

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
            selectedMember: focusedMember,
            colorOf,
          })
        : null,
    [spending, focusedMember, colorOf],
  );

  function handlePeriodClick(p: Period) {
    updateOverview((o) => ({ ...o, period: p, customRange: null }));
  }

  function handleRangeChange(next: { from: string; to: string }) {
    updateOverview((o) => ({ ...o, customRange: next }));
  }

  function handleMemberChange(member: MemberOption | null) {
    updateOverview((o) => ({ ...o, memberId: member?.id ?? null }));
  }

  return (
    <OverviewPageView
      navigator={{
        range,
        period,
        isCustom: customRange != null,
        onPresetChange: handlePeriodClick,
        onRangeChange: handleRangeChange,
      }}
      memberFilter={
        showMemberPicker
          ? {
              members: memberOptions,
              selectedId: effectiveMemberId,
              onChange: handleMemberChange,
              colorOf,
            }
          : null
      }
      summary={isLoading ? null : summary}
      spending={isSpendingLoading ? null : spendingView}
      trend={trend}
    />
  );
}
