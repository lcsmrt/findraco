import { describe, expect, it } from "vitest";
import { toSorting, toTransactionSort } from "./transactionSort";

describe("toTransactionSort (STD-12 AC 1)", () => {
  it("sorts a column by its API field", () => {
    expect(toTransactionSort([{ by: "amount", direction: "desc" }])).toEqual({
      by: "amount",
      direction: "desc",
    });
  });

  it("sorts the participants column by the API field attributedTo", () => {
    expect(toTransactionSort([{ by: "participants", direction: "desc" }])).toEqual({
      by: "attributedTo",
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
  it("shows a column sorted for its API field", () => {
    expect(toSorting({ by: "amount", direction: "asc" })).toEqual([
      { by: "amount", direction: "asc" },
    ]);
  });

  it("shows the participants column sorted for the API field attributedTo", () => {
    expect(toSorting({ by: "attributedTo", direction: "asc" })).toEqual([
      { by: "participants", direction: "asc" },
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
