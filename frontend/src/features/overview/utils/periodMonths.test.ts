import { describe, expect, it } from "vitest";
import { resolvePeriodDates } from "../filters/overviewParams";
import { countMonths } from "./periodMonths";

const now = new Date(2026, 9, 11); // 2026-10-11

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
