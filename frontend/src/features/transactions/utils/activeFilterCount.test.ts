import { describe, expect, it } from "vitest";
import { countActiveFilters } from "./activeFilterCount";

describe("countActiveFilters", () => {
  it("counts nothing when no filter is applied", () => {
    expect(countActiveFilters({})).toBe(0);
  });

  it("counts one applied filter as one", () => {
    expect(countActiveFilters({ categoryId: 7 })).toBe(1);
  });

  it("counts an amount range once, whatever bounds are set", () => {
    expect(countActiveFilters({ amountMin: 10, amountMax: 500 })).toBe(1);
  });

  it("does not count the period dates (PNAV-02 AC 3)", () => {
    expect(countActiveFilters({ startDateFrom: "2026-07-01", startDateTo: "2026-07-31" })).toBe(0);
  });

  it("counts every filter group and leaves the description search out", () => {
    expect(
      countActiveFilters({
        type: "CREDIT",
        categoryId: 7,
        memberId: 3,
        description: "rent",
        amountMax: 500,
      }),
    ).toBe(4);
  });
});
