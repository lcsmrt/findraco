import type { DashboardSummaryResponse } from "@/api/dtos";

export type SummarySegment = {
  memberId: number;
  name: string;
  amount: number;
  color: string;
  /** Another member is selected (UX-05 AC 2). */
  dimmed: boolean;
  /** Width in percent of the plan's total. */
  widthPct: number;
};

export type SummaryFigure = {
  /** The plan's total, or the selected member's amount. */
  total: number;
  segments: SummarySegment[];
};

export type SummaryView = {
  income: SummaryFigure;
  expenses: SummaryFigure;
  balance: number;
};

/**
 * The Overview summary (UX-05 AC 1–2, UX-04 AC 9): Income and Expenses with a segment
 * per member, from the unfiltered dashboard. With a member selected, the figures are
 * that member's and their segment is highlighted against the plan's total.
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
    amountOf: (person: (typeof people)[number]) => number,
  ): SummaryFigure {
    return {
      total: memberId != null ? (selected ? amountOf(selected) : 0) : planTotal,
      segments: people
        .filter((person) => amountOf(person) > 0)
        .map((person) => ({
          memberId: person.userId,
          name: person.name,
          amount: amountOf(person),
          color: colorOf(person.userId),
          dimmed: memberId != null && person.userId !== memberId,
          widthPct: planTotal > 0 ? (amountOf(person) / planTotal) * 100 : 0,
        })),
    };
  }

  return {
    income: figure(data.totalIncome, (person) => person.income),
    expenses: figure(data.totalExpenses, (person) => person.expense),
    balance: memberId != null ? (selected?.net ?? 0) : data.netBalance,
  };
}
