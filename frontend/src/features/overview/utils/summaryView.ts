import type { DashboardSummaryResponse } from "@/api/dtos";

export type SummarySegment = {
  memberId: number;
  name: string;
  /** The member's actual amount. */
  amount: number;
  color: string;
  /** Another member is selected. */
  dimmed: boolean;
  /** Width in percent of the plan's actual total. */
  widthPct: number;
};

export type SummaryFigure = {
  /** The plan's total, or the selected member's amount; it counts the forecast too. */
  total: number;
  /** The actual counterpart of `total`. */
  actual: number;
  segments: SummarySegment[];
};

export type SummaryView = {
  income: SummaryFigure;
  expenses: SummaryFigure;
  balance: number;
  balanceActual: number;
  /** Money moved by neutral movements, outside the figures above; null when there is none to show. */
  neutral: { out: number; in: number } | null;
};

/**
 * The Overview summary: Income and Expenses with a segment
 * per member, from the unfiltered dashboard. With a member selected, the figures are
 * that member's and their segment is highlighted against the plan's total. The neutral movements
 * are the plan's and are not split by member, so a member's view has none.
 */
export function summaryView(
  data: DashboardSummaryResponse,
  memberId: number | null,
  colorOf: (memberId: number) => string,
): SummaryView {
  const people = [...data.personBreakdown].sort((a, b) => a.userId - b.userId);
  const selected =
    memberId != null ? people.find((person) => person.userId === memberId) : undefined;

  function figure(
    planTotal: number,
    planActual: number,
    amountOf: (person: (typeof people)[number]) => number,
    actualOf: (person: (typeof people)[number]) => number,
  ): SummaryFigure {
    return {
      total: memberId != null ? (selected ? amountOf(selected) : 0) : planTotal,
      actual: memberId != null ? (selected ? actualOf(selected) : 0) : planActual,
      // The segments sit under the headline's actual figure, so they use the same basis.
      segments: people
        .filter((person) => actualOf(person) > 0)
        .map((person) => ({
          memberId: person.userId,
          name: person.name,
          amount: actualOf(person),
          color: colorOf(person.userId),
          dimmed: memberId != null && person.userId !== memberId,
          widthPct: planActual > 0 ? (actualOf(person) / planActual) * 100 : 0,
        })),
    };
  }

  return {
    income: figure(
      data.totalIncome,
      data.actualIncome,
      (person) => person.income,
      (person) => person.actualIncome,
    ),
    expenses: figure(
      data.totalExpenses,
      data.actualExpenses,
      (person) => person.expense,
      (person) => person.actualExpense,
    ),
    balance: memberId != null ? (selected?.net ?? 0) : data.netBalance,
    balanceActual: memberId != null ? (selected?.actualNet ?? 0) : data.actualBalance,
    neutral:
      memberId == null && (data.neutralOut !== 0 || data.neutralIn !== 0)
        ? { out: data.neutralOut, in: data.neutralIn }
        : null,
  };
}
