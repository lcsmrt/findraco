import { describe, expect, it } from "vitest";
import { countMonths, periodLabel, resolvePeriodDates, shiftRange } from "./period";

const now = new Date(2026, 9, 11); // 2026-10-11

function range(startDate: string, endDate: string) {
  return { startDate, endDate };
}

describe("periodLabel (UX-05 AC 8)", () => {
  it("names one calendar month in full", () => {
    expect(periodLabel(range("2026-10-01", "2026-10-31"))).toBe("October 2026");
  });

  it("shows a range of months with the year once", () => {
    expect(periodLabel(range("2026-08-01", "2026-10-31"))).toBe("Aug – Oct 2026");
    expect(periodLabel(range("2026-01-01", "2026-12-31"))).toBe("Jan – Dec 2026");
  });

  it("shows the year on both ends across years", () => {
    expect(periodLabel(range("2025-11-01", "2026-01-31"))).toBe("Nov 2025 – Jan 2026");
  });

  it("shows the days of a range not aligned to months", () => {
    expect(periodLabel(range("2026-10-05", "2026-10-20"))).toBe("5 – 20 Oct 2026");
    expect(periodLabel(range("2025-12-15", "2026-01-10"))).toBe("15 Dec 2025 – 10 Jan 2026");
  });
});

describe("shiftRange (UX-05 AC 8)", () => {
  it("moves one month by one month", () => {
    expect(shiftRange(range("2026-10-01", "2026-10-31"), -1)).toEqual(range("2026-09-01", "2026-09-30"));
    expect(shiftRange(range("2026-10-01", "2026-10-31"), 1)).toEqual(range("2026-11-01", "2026-11-30"));
  });

  it("moves a range by its month count (3, 6, 12)", () => {
    expect(shiftRange(range("2026-08-01", "2026-10-31"), -1)).toEqual(range("2026-05-01", "2026-07-31"));
    expect(shiftRange(range("2026-05-01", "2026-10-31"), 1)).toEqual(range("2026-11-01", "2027-04-30"));
    expect(shiftRange(range("2026-01-01", "2026-12-31"), -1)).toEqual(range("2025-01-01", "2025-12-31"));
  });

  it("crosses year boundaries and keeps month ends", () => {
    expect(shiftRange(range("2026-01-01", "2026-01-31"), -1)).toEqual(range("2025-12-01", "2025-12-31"));
    expect(shiftRange(range("2026-12-01", "2026-12-31"), 1)).toEqual(range("2027-01-01", "2027-01-31"));
    expect(shiftRange(range("2026-01-01", "2026-02-28"), 1)).toEqual(range("2026-03-01", "2026-04-30"));
  });

  it("shifts a range not aligned to months by its month count", () => {
    expect(shiftRange(range("2026-10-15", "2026-11-10"), 1)).toEqual(range("2026-12-15", "2027-01-10"));
  });
});

describe("countMonths", () => {
  it("counts a preset's months", () => {
    const { startDate, endDate } = resolvePeriodDates("last-3m", now);
    expect(countMonths(startDate, endDate)).toBe(3);
  });

  it("counts every calendar month a custom range touches", () => {
    expect(countMonths("2026-09-15", "2026-10-10")).toBe(2);
    expect(countMonths("2026-10-03", "2026-10-20")).toBe(1);
    expect(countMonths("2025-12-20", "2026-01-05")).toBe(2);
  });
});

describe("resolvePeriodDates", () => {
  const now = new Date(2026, 9, 11); // 2026-10-11

  it.each([
    ["this-month", "2026-10-01", "2026-10-31"],
    ["last-3m", "2026-08-01", "2026-10-31"],
    ["last-6m", "2026-05-01", "2026-10-31"],
    ["this-year", "2026-01-01", "2026-12-31"],
  ] as const)("resolves %s relative to now", (period, startDate, endDate) => {
    expect(resolvePeriodDates(period, now)).toEqual({ startDate, endDate });
  });

  it("resolves a saved this-month to the later month when restored later", () => {
    expect(resolvePeriodDates("this-month", new Date(2026, 10, 3))).toEqual({
      startDate: "2026-11-01",
      endDate: "2026-11-30",
    });
  });

  it("crosses the year boundary for last-3m", () => {
    expect(resolvePeriodDates("last-3m", new Date(2026, 0, 15))).toEqual({
      startDate: "2025-11-01",
      endDate: "2026-01-31",
    });
  });
});
