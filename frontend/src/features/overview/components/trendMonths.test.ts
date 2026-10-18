import { describe, expect, it } from "vitest";
import { fillTrendMonths, trendWindow } from "./trendMonths";

const range = (startDate: string, endDate: string) => ({ startDate, endDate });

describe("trendWindow (UX-05 AC 4)", () => {
  it("covers the 6 months ending at a one-month period", () => {
    expect(trendWindow(range("2026-10-01", "2026-10-31"))).toEqual(range("2026-05-01", "2026-10-31"));
  });

  it("covers every month of a period longer than 6 months", () => {
    expect(trendWindow(range("2026-01-01", "2026-12-31"))).toEqual(range("2026-01-01", "2026-12-31"));
  });

  it("crosses the year boundary", () => {
    expect(trendWindow(range("2026-02-01", "2026-02-28"))).toEqual(range("2025-09-01", "2026-02-28"));
  });

  it("ends at the last month of a range not aligned to months", () => {
    expect(trendWindow(range("2026-10-15", "2026-11-10"))).toEqual(range("2026-06-01", "2026-11-30"));
  });
});

describe("fillTrendMonths (UX-05 AC 5)", () => {
  it("returns every month of the window with zeros for missing months", () => {
    const selected = range("2026-10-01", "2026-10-31");
    const months = fillTrendMonths(
      [
        { year: 2026, month: 6, income: 900, expenses: 300 },
        { year: 2026, month: 10, income: 1000, expenses: 450 },
      ],
      trendWindow(selected),
      selected,
    );

    expect(months.map((m) => [m.year, m.month, m.income, m.expenses])).toEqual([
      [2026, 5, 0, 0],
      [2026, 6, 900, 300],
      [2026, 7, 0, 0],
      [2026, 8, 0, 0],
      [2026, 9, 0, 0],
      [2026, 10, 1000, 450],
    ]);
  });

  it("flags the months inside the selected period", () => {
    const selected = range("2026-08-01", "2026-10-31");

    const months = fillTrendMonths([], trendWindow(selected), selected);

    expect(months.map((m) => [m.month, m.inPeriod])).toEqual([
      [5, false],
      [6, false],
      [7, false],
      [8, true],
      [9, true],
      [10, true],
    ]);
  });

  it("crosses the year boundary and covers 12 months of a year period", () => {
    const winter = range("2026-01-01", "2026-01-31");
    const crossing = fillTrendMonths(
      [{ year: 2025, month: 12, income: 50, expenses: 20 }],
      trendWindow(winter),
      winter,
    );
    expect(crossing.map((m) => [m.year, m.month])).toEqual([
      [2025, 8],
      [2025, 9],
      [2025, 10],
      [2025, 11],
      [2025, 12],
      [2026, 1],
    ]);
    expect(crossing[4]).toMatchObject({ income: 50, expenses: 20, inPeriod: false });
    expect(crossing[5].inPeriod).toBe(true);

    const year = range("2026-01-01", "2026-12-31");
    const yearMonths = fillTrendMonths([], trendWindow(year), year);
    expect(yearMonths).toHaveLength(12);
    expect(yearMonths.every((m) => m.inPeriod)).toBe(true);
  });
});
