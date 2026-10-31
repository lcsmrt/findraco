import { describe, expect, it } from "vitest";
import {
  parseOverviewFilters,
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
  it("round-trips a preset with a member", () => {
    const filters: OverviewFilters = { period: "last-3m", customRange: null, memberId: 7 };
    const out = parseOverviewFilters(params(serializeOverviewFilters(filters)));
    expect(out).toEqual(filters);
  });

  it("keeps the URL format of a custom range next to the member", () => {
    const filters: OverviewFilters = {
      period: "this-month",
      customRange: { from: "2026-09-01", to: "2026-09-30" },
      memberId: 7,
    };
    const serialized = serializeOverviewFilters(filters);
    expect(serialized).toEqual({
      period: "custom",
      periodFrom: "2026-09-01",
      periodTo: "2026-09-30",
      overviewMember: "7",
    });
    expect(parseOverviewFilters(params(serialized))).toEqual(filters);
  });

  it("omits defaults on serialize", () => {
    expect(serializeOverviewFilters(DEFAULT_OVERVIEW)).toEqual({});
  });

  it("returns defaults for empty params", () => {
    expect(parseOverviewFilters(params({}))).toEqual(DEFAULT_OVERVIEW);
  });

  it("drops a non-numeric member id", () => {
    expect(
      parseOverviewFilters(params({ overviewMember: "abc" })).memberId,
    ).toBeNull();
  });
});

// UX-01 AC 1: the Categories screen has no period; links saved before still load.
describe("legacy Categories period params", () => {
  const legacy = params({
    period: "this-year",
    categoriesPeriod: "custom",
    categoriesPeriodFrom: "2026-09-01",
    categoriesPeriodTo: "2026-09-30",
  });

  it("parses a URL with categoriesPeriod, ignores it and serializes no categories period", () => {
    expect(parseOverviewFilters(legacy)).toEqual({
      period: "this-year",
      customRange: null,
      memberId: null,
    });
    expect(serializeOverviewFilters(parseOverviewFilters(legacy))).toEqual({
      period: "this-year",
    });
  });
});
