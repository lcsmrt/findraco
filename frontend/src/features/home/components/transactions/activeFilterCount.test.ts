import { describe, expect, it } from "vitest";
import { countActiveFilters } from "./activeFilterCount";

describe("countActiveFilters", () => {
  it("counts nothing when no filter is applied", () => {
    expect(countActiveFilters({})).toBe(0);
  });

  it.each([
    ["type", { type: "DEBIT" as const }],
    ["category", { categoryId: 7 }],
    ["member", { memberId: 3 }],
    ["date range start only", { startDateFrom: "2026-07-01" }],
    ["date range end only", { startDateTo: "2026-07-31" }],
    ["amount minimum only", { amountMin: 10 }],
    ["amount maximum only", { amountMax: 500 }],
  ])("counts a %s as one filter", (_label, filter) => {
    expect(countActiveFilters(filter)).toBe(1);
  });

  it("counts a date range and an amount range once each, whatever bounds are set", () => {
    expect(
      countActiveFilters({
        startDateFrom: "2026-07-01",
        startDateTo: "2026-07-31",
        amountMin: 10,
        amountMax: 500,
      }),
    ).toBe(2);
  });

  it("counts every filter group and leaves the description search out", () => {
    expect(
      countActiveFilters({
        type: "CREDIT",
        categoryId: 7,
        memberId: 3,
        description: "rent",
        startDateFrom: "2026-07-01",
        amountMax: 500,
      }),
    ).toBe(5);
  });
});
