import type { DashboardSummaryResponse } from "@/api/dtos";
import { describe, expect, it } from "vitest";
import { summaryView } from "./summaryView";

const LUCAS = 1;
const LIVIA = 2;
function colorOf(id: number) {
  return id === LUCAS ? "blue" : id === LIVIA ? "pink" : "grey";
}

const dashboard: DashboardSummaryResponse = {
  totalIncome: 5147,
  totalExpenses: 4450,
  netBalance: 697,
  // Unsorted on purpose: segments follow member id order.
  personBreakdown: [
    { userId: LIVIA, name: "Livia", income: 2414, expense: 2105, net: 309, actualIncome: 1400, actualExpense: 600, actualNet: 800 },
    { userId: LUCAS, name: "Lucas", income: 2733, expense: 2345, net: 388, actualIncome: 1600, actualExpense: 600, actualNet: 1000 },
  ],
  actualIncome: 3000,
  actualExpenses: 1200,
  actualBalance: 1800,
  neutralOut: 0,
  neutralIn: 0,
};

describe("summaryView", () => {
  it("shows the plan totals with a segment per member (UX-05 AC 1)", () => {
    const view = summaryView(dashboard, null, colorOf);

    expect(view.income.total).toBe(5147);
    expect(view.expenses.total).toBe(4450);
    expect(view.balance).toBe(697);
    expect(view.income.segments.map((s) => [s.memberId, s.name, s.color, s.dimmed])).toEqual([
      [LUCAS, "Lucas", "blue", false],
      [LIVIA, "Livia", "pink", false],
    ]);
    expect(view.expenses.segments.map((s) => s.memberId)).toEqual([LUCAS, LIVIA]);
  });

  it("member segments use actual amounts relative to the plan's actual total", () => {
    const view = summaryView(dashboard, null, colorOf);

    expect(view.income.segments.map((s) => [s.memberId, s.amount])).toEqual([
      [LUCAS, 1600],
      [LIVIA, 1400],
    ]);
    expect(view.expenses.segments.map((s) => [s.memberId, s.amount])).toEqual([
      [LUCAS, 600],
      [LIVIA, 600],
    ]);
    expect(view.income.segments.map((s) => s.widthPct)).toEqual([(1600 / 3000) * 100, (1400 / 3000) * 100]);
    expect(view.expenses.segments.map((s) => s.widthPct)).toEqual([50, 50]);
    expect(view.income.segments.reduce((sum, s) => sum + s.amount, 0)).toBe(view.income.actual);
    expect(view.expenses.segments.reduce((sum, s) => sum + s.amount, 0)).toBe(view.expenses.actual);
  });

  it("omits a member whose actual amount is zero", () => {
    const view = summaryView(
      {
        ...dashboard,
        actualIncome: 1600,
        personBreakdown: dashboard.personBreakdown.map((person) =>
          person.userId === LIVIA ? { ...person, actualIncome: 0 } : person,
        ),
      },
      null,
      colorOf,
    );

    // Livia still has forecast income (2414) but nothing received yet.
    expect(view.income.segments.map((s) => s.memberId)).toEqual([LUCAS]);
    expect(view.income.segments[0].widthPct).toBe(100);
    expect(view.expenses.segments.map((s) => s.memberId)).toEqual([LUCAS, LIVIA]);
  });

  it("pairs each plan total with its actual figure", () => {
    const view = summaryView(dashboard, null, colorOf);

    expect(view.income.actual).toBe(3000);
    expect(view.expenses.actual).toBe(1200);
    expect(view.balanceActual).toBe(1800);
  });

  it("member selected keeps actual figures", () => {
    const view = summaryView(dashboard, LIVIA, colorOf);

    expect(view.income).toMatchObject({ actual: 1400, total: 2414 });
    expect(view.expenses).toMatchObject({ actual: 600, total: 2105 });
    expect(view.balanceActual).toBe(800);
    expect(view.balance).toBe(309);
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
      (600 / 1200) * 100,
      5,
    );
  });

  it("shows zeros for a selected member without transactions", () => {
    const view = summaryView(dashboard, 99, colorOf);

    expect(view).toMatchObject({
      income: { total: 0, actual: 0 },
      expenses: { total: 0, actual: 0 },
      balance: 0,
      balanceActual: 0,
    });
  });

  it("leaves out members with no amount and handles an empty period", () => {
    const view = summaryView(
      { ...dashboard, totalIncome: 0, personBreakdown: [{ userId: LUCAS, name: "Lucas", income: 0, expense: 10, net: -10, actualIncome: 0, actualExpense: 10, actualNet: -10 }] },
      null,
      colorOf,
    );

    expect(view.income.segments).toEqual([]);
    expect(view.expenses.segments.map((s) => s.memberId)).toEqual([LUCAS]);
  });

  it("gives the neutral movements of the plan: what went out and what came in", () => {
    const view = summaryView({ ...dashboard, neutralOut: 2000, neutralIn: 500 }, null, colorOf);

    expect(view.neutral).toEqual({ out: 2000, in: 500 });
  });

  it("shows neutral movements when only one direction moved", () => {
    expect(summaryView({ ...dashboard, neutralOut: 1500 }, null, colorOf).neutral).toEqual({ out: 1500, in: 0 });
    expect(summaryView({ ...dashboard, neutralIn: 80 }, null, colorOf).neutral).toEqual({ out: 0, in: 80 });
  });

  it("has no neutral line when nothing neutral moved", () => {
    expect(summaryView(dashboard, null, colorOf).neutral).toBeNull();
  });

  it("has no neutral line in a member's view: the plan's neutral money is not theirs", () => {
    expect(summaryView({ ...dashboard, neutralOut: 2000, neutralIn: 500 }, LIVIA, colorOf).neutral).toBeNull();
  });
});
