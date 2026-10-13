import type { DashboardSummaryResponse } from "@/api/dtos";
import { describe, expect, it } from "vitest";
import { summaryView } from "./summaryView";

const LUCAS = 1;
const LIVIA = 2;
const colorOf = (id: number) => (id === LUCAS ? "blue" : id === LIVIA ? "pink" : "grey");

const dashboard: DashboardSummaryResponse = {
  totalIncome: 5147,
  totalExpenses: 4450,
  netBalance: 697,
  categoryBreakdown: [],
  monthlyTrend: [],
  // Unsorted on purpose: segments follow member id order.
  personBreakdown: [
    { userId: LIVIA, name: "Livia", income: 2414, expense: 2105, net: 309 },
    { userId: LUCAS, name: "Lucas", income: 2733, expense: 2345, net: 388 },
  ],
};

describe("summaryView", () => {
  it("shows the plan totals with a segment per member (UX-05 AC 1)", () => {
    const view = summaryView(dashboard, null, colorOf);

    expect(view.income.total).toBe(5147);
    expect(view.expenses.total).toBe(4450);
    expect(view.balance).toBe(697);
    expect(view.income.segments.map((s) => [s.memberId, s.name, s.amount, s.color, s.dimmed])).toEqual([
      [LUCAS, "Lucas", 2733, "blue", false],
      [LIVIA, "Livia", 2414, "pink", false],
    ]);
    expect(view.expenses.segments.map((s) => [s.memberId, s.amount])).toEqual([
      [LUCAS, 2345],
      [LIVIA, 2105],
    ]);
    expect(view.income.segments.reduce((sum, s) => sum + s.widthPct, 0)).toBeCloseTo(100, 5);
  });

  it("shows the selected member's income, expense and balance, highlighting their segment (UX-05 AC 2)", () => {
    const view = summaryView(dashboard, LIVIA, colorOf);

    expect(view.income.total).toBe(2414);
    expect(view.expenses.total).toBe(2105);
    expect(view.balance).toBe(309);
    expect(view.income.segments.map((s) => [s.memberId, s.dimmed])).toEqual([
      [LUCAS, true],
      [LIVIA, false],
    ]);
    expect(view.expenses.segments.find((s) => s.memberId === LIVIA)?.widthPct).toBeCloseTo(
      (2105 / 4450) * 100,
      5,
    );
  });

  it("shows zeros for a selected member without transactions", () => {
    const view = summaryView(dashboard, 99, colorOf);

    expect(view).toMatchObject({ income: { total: 0 }, expenses: { total: 0 }, balance: 0 });
  });

  it("leaves out members with no amount and handles an empty period", () => {
    const view = summaryView(
      { ...dashboard, totalIncome: 0, personBreakdown: [{ userId: LUCAS, name: "Lucas", income: 0, expense: 10, net: -10 }] },
      null,
      colorOf,
    );

    expect(view.income.segments).toEqual([]);
    expect(view.expenses.segments.map((s) => s.memberId)).toEqual([LUCAS]);
  });
});
