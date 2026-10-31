import type { ComponentProps } from "react";
import { Skeleton } from "@/components/skeleton/base/Skeleton";
import { CategorySpendingList } from "./components/CategorySpendingList";
import { MemberFilterChips } from "./components/MemberFilterChips";
import { MonthlyTrendChart } from "./components/MonthlyTrendChart";
import { PeriodNavigator } from "@/components/periodNavigator/PeriodNavigator";
import type { SpendingRowsView } from "./utils/spendingRows";
import { SummaryCards } from "./components/SummaryCards";
import type { SummaryView } from "./utils/summaryView";

type OverviewPageViewProps = {
  navigator: ComponentProps<typeof PeriodNavigator>;
  /** `null` hides the member filter (a plan with a single member). */
  memberFilter: ComponentProps<typeof MemberFilterChips> | null;
  /** `null` while the summary loads. */
  summary: SummaryView | null;
  /** `null` while the category spending loads. */
  spending: SpendingRowsView | null;
  trend: ComponentProps<typeof MonthlyTrendChart>;
};

export function OverviewPageView({
  navigator,
  memberFilter,
  summary,
  spending,
  trend,
}: OverviewPageViewProps) {
  return (
    <div className="flex flex-col gap-6 px-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <PeriodNavigator {...navigator} />
        {memberFilter && <MemberFilterChips {...memberFilter} />}
      </div>

      {summary ? (
        <SummaryCards view={summary} />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Skeleton className="h-28" />
          <Skeleton className="hidden h-28 sm:block" />
          <Skeleton className="hidden h-28 sm:block" />
        </div>
      )}

      {spending ? <CategorySpendingList view={spending} /> : <Skeleton className="h-80" />}

      <MonthlyTrendChart {...trend} />
    </div>
  );
}
