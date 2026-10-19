import { describe, expect, it } from "vitest";
import {
  parseOverviewFilters,
  resolvePeriodDates,
  serializeOverviewFilters,
  type OverviewFilters,
} from "./overviewParams";

function params(init: Record<string, string>) {
  return new URLSearchParams(init);
}

const DEFAULT_OVERVIEW: OverviewFilters = {
  period: "this-month",
  customRange: null,
  memberId: null,
};

describe("overview codec", () => {
  it.each(["this-month", "last-3m", "last-6m", "this-year"] as const)(
    "round-trips preset %s with a member",
    (period) => {
      const filters: OverviewFilters = { period, customRange: null, memberId: 7 };
      const out = parseOverviewFilters(
        params(serializeOverviewFilters(filters)),
      );
      expect(out).toEqual(filters);
    },
  );

  it("round-trips a custom range", () => {
    const filters: OverviewFilters = {
      period: "this-month",
      customRange: { from: "2026-09-01", to: "2026-09-30" },
      memberId: null,
    };
    const serialized = serializeOverviewFilters(filters);
    expect(serialized).toEqual({
      period: "custom",
      periodFrom: "2026-09-01",
      periodTo: "2026-09-30",
    });
    expect(parseOverviewFilters(params(serialized))).toEqual(filters);
  });

  it("omits defaults on serialize", () => {
    expect(serializeOverviewFilters(DEFAULT_OVERVIEW)).toEqual({});
  });

  it("returns defaults for empty params", () => {
    expect(parseOverviewFilters(params({}))).toEqual(DEFAULT_OVERVIEW);
  });

  it("falls back to this-month for an unknown period token", () => {
    expect(parseOverviewFilters(params({ period: "last-decade" })).period).toBe(
      "this-month",
    );
  });

  it("drops a non-numeric member id", () => {
    expect(
      parseOverviewFilters(params({ overviewMember: "abc" })).memberId,
    ).toBeNull();
  });

  it("falls back to this-month when the custom range is inverted", () => {
    const out = parseOverviewFilters(
      params({
        period: "custom",
        periodFrom: "2026-09-30",
        periodTo: "2026-09-01",
      }),
    );
    expect(out.period).toBe("this-month");
    expect(out.customRange).toBeNull();
  });

  it("falls back to this-month when a custom date is malformed or missing", () => {
    const malformed = parseOverviewFilters(
      params({ period: "custom", periodFrom: "2026-13-45", periodTo: "2026-09-01" }),
    );
    const missing = parseOverviewFilters(
      params({ period: "custom", periodFrom: "2026-09-01" }),
    );
    expect(malformed).toEqual(DEFAULT_OVERVIEW);
    expect(missing).toEqual(DEFAULT_OVERVIEW);
  });

  it("ignores custom dates when period is a preset", () => {
    const out = parseOverviewFilters(
      params({ period: "last-3m", periodFrom: "2026-09-01", periodTo: "2026-09-30" }),
    );
    expect(out.customRange).toBeNull();
    expect(out.period).toBe("last-3m");
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
