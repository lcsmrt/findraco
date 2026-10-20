import { describe, expect, it } from "vitest";
import { buildPagedQuery } from "./buildPagedQuery";

function entries(query: string) {
  return [...new URLSearchParams(query)];
}

describe("buildPagedQuery", () => {
  it("returns an empty query without params or with no field set", () => {
    expect(buildPagedQuery()).toBe("");
    expect(buildPagedQuery({})).toBe("");
  });

  it("sends page, size and the sort as sortBy and sortDirection", () => {
    const query = buildPagedQuery({ page: 2, size: 20, sort: { by: "amount", direction: "desc" } });

    expect(entries(query)).toEqual([
      ["page", "2"],
      ["size", "20"],
      ["sortBy", "amount"],
      ["sortDirection", "desc"],
    ]);
  });

  it("keeps page 0, which is the first page", () => {
    expect(entries(buildPagedQuery({ page: 0 }))).toEqual([["page", "0"]]);
  });

  it("sends each filter value as its own param and drops empty ones", () => {
    const query = buildPagedQuery({
      filter: { type: "DEBIT", amountMin: 0, active: false, description: "", categoryId: null, memberId: undefined },
    });

    expect(entries(query)).toEqual([
      ["type", "DEBIT"],
      ["amountMin", "0"],
      ["active", "false"],
    ]);
  });
});
