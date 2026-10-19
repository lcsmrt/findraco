import { describe, expect, it } from "vitest";
import { resolvePeriodDates, type Period } from "../filters/overviewParams";
import { periodLabel, presetRange, shiftRange } from "./periodNavigator";

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

describe("presetRange (UX-05 AC 9)", () => {
  it("resolves every preset like resolvePeriodDates", () => {
    const now = new Date(2026, 9, 12);
    const presets: Period[] = ["this-month", "last-3m", "last-6m", "this-year"];
    for (const preset of presets) {
      expect(presetRange(preset, now)).toEqual(resolvePeriodDates(preset, now));
    }
    expect(presetRange("last-3m", now)).toEqual(range("2026-08-01", "2026-10-31"));
  });
});
