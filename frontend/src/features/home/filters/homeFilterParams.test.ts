import { describe, expect, it } from "vitest";
import * as homeFilterParams from "./homeFilterParams";
import * as overviewParams from "@/features/overview/filters/overviewParams";
import {
  parseOverviewFilters,
  serializeOverviewFilters,
} from "@/features/overview/filters/overviewParams";
import {
  parseTab,
  parseTransactionFilters,
  serializeTab,
  serializeTransactionFilters,
  type TransactionFilters,
} from "./homeFilterParams";

const params = (init: Record<string, string>) => new URLSearchParams(init);

const DEFAULT_TRANSACTIONS: TransactionFilters = {
  filter: {},
  sort: null,
  size: 10,
};

describe("transactions codec", () => {
  const full: TransactionFilters = {
    filter: {
      type: "DEBIT",
      categoryId: 12,
      memberId: 7,
      startDateFrom: "2026-10-01",
      startDateTo: "2026-10-31",
      amountMin: 50,
      amountMax: 99.5,
      description: "mercado",
    },
    sort: { by: "amount", direction: "desc" },
    size: 25,
  };

  it("round-trips every field", () => {
    const serialized = serializeTransactionFilters(full);
    expect(serialized).toEqual({
      type: "DEBIT",
      category: "12",
      member: "7",
      from: "2026-10-01",
      to: "2026-10-31",
      min: "50",
      max: "99.5",
      q: "mercado",
      sort: "amount.desc",
      size: "25",
    });
    expect(parseTransactionFilters(params(serialized))).toEqual(full);
  });

  it("round-trips a search containing reserved characters", () => {
    const filters: TransactionFilters = {
      ...DEFAULT_TRANSACTIONS,
      filter: { description: "a&b=c d" },
    };
    const url = new URLSearchParams(serializeTransactionFilters(filters));
    expect(parseTransactionFilters(new URLSearchParams(url.toString()))).toEqual(
      filters,
    );
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
    ["from", "yesterday"],
    ["to", "2026-02-30"],
    ["min", "abc"],
    ["max", "-5"],
    ["sort", "bogus.desc"],
    ["sort", "amount.sideways"],
    ["sort", "amount"],
    ["size", "0"],
    ["size", "many"],
  ])("falls back to the default for unparseable %s=%s", (key, value) => {
    expect(parseTransactionFilters(params({ [key]: value }))).toEqual(
      DEFAULT_TRANSACTIONS,
    );
  });

  it("keeps valid params when a sibling param is invalid", () => {
    const out = parseTransactionFilters(
      params({ category: "abc", member: "7" }),
    );
    expect(out.filter).toEqual({ memberId: 7 });
  });
});

describe("tab codec", () => {
  it("defaults to overview and omits it on serialize", () => {
    expect(parseTab(params({}))).toBe("overview");
    expect(serializeTab("overview")).toEqual({});
  });

  it("round-trips transactions", () => {
    expect(parseTab(params(serializeTab("transactions")))).toBe("transactions");
  });

  it("round-trips categories", () => {
    expect(serializeTab("categories")).toEqual({ tab: "categories" });
    expect(parseTab(params(serializeTab("categories")))).toBe("categories");
  });

  it("falls back to overview for an unknown tab", () => {
    expect(parseTab(params({ tab: "settings" }))).toBe("overview");
  });
});

// UX-01 AC 1: the Categories tab has no period; links saved before still load.
describe("legacy Categories period params", () => {
  const legacy = params({
    tab: "categories",
    period: "this-year",
    categoriesPeriod: "custom",
    categoriesPeriodFrom: "2026-09-01",
    categoriesPeriodTo: "2026-09-30",
  });

  it("parses a URL with categoriesPeriod without error and ignores it", () => {
    expect(parseTab(legacy)).toBe("categories");
    expect(parseOverviewFilters(legacy)).toEqual({
      period: "this-year",
      customRange: null,
      memberId: null,
    });
    expect(parseTransactionFilters(legacy)).toEqual(DEFAULT_TRANSACTIONS);
  });

  it("has no Categories period codec", () => {
    expect("parseCategoriesFilters" in homeFilterParams).toBe(false);
    expect("serializeCategoriesFilters" in homeFilterParams).toBe(false);
    expect("CATEGORIES_PARAM_KEYS" in homeFilterParams).toBe(false);
    expect("parseCategoriesFilters" in overviewParams).toBe(false);
    expect("serializeCategoriesFilters" in overviewParams).toBe(false);
    expect("CATEGORIES_PARAM_KEYS" in overviewParams).toBe(false);
  });

  it("serializes no categories period", () => {
    const serialized = {
      ...serializeTab(parseTab(legacy)),
      ...serializeOverviewFilters(parseOverviewFilters(legacy)),
      ...serializeTransactionFilters(parseTransactionFilters(legacy)),
    };
    expect(serialized).toEqual({ tab: "categories", period: "this-year" });
  });
});
