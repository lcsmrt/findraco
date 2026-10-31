import { describe, expect, it } from "vitest";
import {
  parseTransactionFilters,
  serializeTransactionFilters,
  type TransactionFilters,
} from "./transactionParams";

function params(init: Record<string, string>) {
  return new URLSearchParams(init);
}

const DEFAULT_TRANSACTIONS: TransactionFilters = {
  filter: {},
  period: { period: "this-month", customRange: null },
  sort: null,
  size: 10,
};

describe("transactions codec", () => {
  const full: TransactionFilters = {
    filter: {
      type: "DEBIT",
      categoryId: 12,
      memberId: 7,
      amountMin: 50,
      amountMax: 99.5,
      description: "mercado",
    },
    period: { period: "this-month", customRange: { from: "2026-10-01", to: "2026-10-31" } },
    sort: { by: "amount", direction: "desc" },
    size: 25,
  };

  it("round-trips every field", () => {
    const serialized = serializeTransactionFilters(full);
    expect(serialized).toEqual({
      type: "DEBIT",
      category: "12",
      member: "7",
      period: "custom",
      periodFrom: "2026-10-01",
      periodTo: "2026-10-31",
      min: "50",
      max: "99.5",
      q: "mercado",
      sort: "amount.desc",
      size: "25",
    });
    expect(parseTransactionFilters(params(serialized))).toEqual(full);
  });

  it("omits defaults on serialize", () => {
    expect(serializeTransactionFilters(DEFAULT_TRANSACTIONS)).toEqual({});
  });

  it("returns defaults for empty params (page size 10, no sort)", () => {
    expect(parseTransactionFilters(params({}))).toEqual(DEFAULT_TRANSACTIONS);
  });

  it.each([
    ["type", "TRANSFER"],
    ["category", "abc"],
    ["member", "1.5"],
    ["period", "last-decade"],
    ["periodFrom", "yesterday"],
    ["periodTo", "2026-02-30"],
    ["min", "abc"],
    ["max", "-5"],
    ["sort", "bogus.desc"],
    ["size", "0"],
  ])("falls back to the default for unparseable %s=%s", (key, value) => {
    expect(parseTransactionFilters(params({ [key]: value }))).toEqual(
      DEFAULT_TRANSACTIONS,
    );
  });

  it("opens on This month with no dates in the filter when no period is set (PNAV-01)", () => {
    const out = parseTransactionFilters(params({}));
    expect(out.period).toEqual({ period: "this-month", customRange: null });
    expect(out.filter).not.toHaveProperty("startDateFrom");
    expect(out.filter).not.toHaveProperty("startDateTo");
  });

  it("round-trips a preset period (PNAV-03)", () => {
    const filters: TransactionFilters = { ...DEFAULT_TRANSACTIONS, period: { period: "last-3m", customRange: null } };
    const serialized = serializeTransactionFilters(filters);
    expect(serialized).toEqual({ period: "last-3m" });
    expect(parseTransactionFilters(params(serialized))).toEqual(filters);
  });

  it("falls back to This month for a partial or reversed custom range (PNAV-05)", () => {
    const partial = parseTransactionFilters(params({ period: "custom", periodFrom: "2026-10-01" }));
    const reversed = parseTransactionFilters(
      params({ period: "custom", periodFrom: "2026-10-31", periodTo: "2026-10-01" }),
    );
    expect(partial).toEqual(DEFAULT_TRANSACTIONS);
    expect(reversed).toEqual(DEFAULT_TRANSACTIONS);
  });

  it("ignores the pre-feature from and to params (PNAV-05)", () => {
    const out = parseTransactionFilters(params({ from: "2026-09-01", to: "2026-09-30" }));
    expect(out).toEqual(DEFAULT_TRANSACTIONS);
    expect(serializeTransactionFilters(out)).toEqual({});
  });

  it("keeps valid params when a sibling param is invalid", () => {
    const out = parseTransactionFilters(
      params({ category: "abc", member: "7" }),
    );
    expect(out.filter).toEqual({ memberId: 7 });
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
    // `period` is now the Transactions period too; only the categories keys are ignored.
    expect(parseTransactionFilters(legacy)).toEqual({
      ...DEFAULT_TRANSACTIONS,
      period: { period: "this-year", customRange: null },
    });
    expect(serializeTransactionFilters(parseTransactionFilters(legacy))).toEqual({ period: "this-year" });
  });
});
