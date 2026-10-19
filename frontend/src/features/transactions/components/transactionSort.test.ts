import { describe, expect, it } from "vitest";
import { toSorting, toTransactionSort } from "./transactionSort";

const pairs = [
  ["startDate", "startDate"],
  ["amount", "amount"],
  ["description", "description"],
  ["category", "category"],
  ["participants", "attributedTo"],
] as const;

describe("toTransactionSort (STD-12 AC 1)", () => {
  it.each(pairs)("sorts column %s by the API field %s", (column, field) => {
    expect(toTransactionSort([{ by: column, direction: "desc" }])).toEqual({
      by: field,
      direction: "desc",
    });
  });

  it("clears the sort for a column the API cannot sort by", () => {
    expect(toTransactionSort([{ by: "actions", direction: "asc" }])).toBeNull();
  });

  it("clears the sort when the table has none", () => {
    expect(toTransactionSort([])).toBeNull();
  });
});

describe("toSorting (STD-12 AC 1)", () => {
  it.each(pairs)("shows column %s sorted for the API field %s", (column, field) => {
    expect(toSorting({ by: field, direction: "asc" })).toEqual([
      { by: column, direction: "asc" },
    ]);
  });

  it("shows the end date column for the endDate field", () => {
    expect(toSorting({ by: "endDate", direction: "desc" })).toEqual([
      { by: "endDate", direction: "desc" },
    ]);
  });

  it("shows no sorted column without a sort", () => {
    expect(toSorting(null)).toEqual([]);
  });
});
