import type { PeriodNavigator } from "@/components/periodNavigator/PeriodNavigator";
import type { Period } from "@/utils/period";
import { resolveSelection } from "@/utils/periodParams";
import type { ComponentProps } from "react";
import { useMemo } from "react";
import { useTransactionFilters } from "./filters/useTransactionFilters";

/** The Transactions period: the dates the list is queried with and the props of its navigator. */
export function useTransactionPeriod() {
  const { transactions, updateTransactions } = useTransactionFilters();
  const { period, customRange } = transactions.period;
  const customFrom = customRange?.from;
  const customTo = customRange?.to;

  // Resolved on the date of use, so a saved "This month" follows the calendar.
  const range = useMemo(
    () =>
      resolveSelection(
        { period, customRange: customFrom && customTo ? { from: customFrom, to: customTo } : null },
        new Date(),
      ),
    [period, customFrom, customTo],
  );

  const navigator: ComponentProps<typeof PeriodNavigator> = {
    range,
    period,
    isCustom: customRange != null,
    onPresetChange: (next: Period) =>
      updateTransactions((t) => ({ ...t, period: { period: next, customRange: null } })),
    onRangeChange: (next) =>
      updateTransactions((t) => ({ ...t, period: { ...t.period, customRange: next } })),
  };

  return { range, navigator };
}
