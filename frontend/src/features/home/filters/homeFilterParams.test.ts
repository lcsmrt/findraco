import { describe, expect, it } from "vitest";
import * as homeFilterParams from "./homeFilterParams";
import * as overviewParams from "@/features/overview/filters/overviewParams";
import {
  parseOverviewFilters,
  serializeOverviewFilters,
} from "@/features/overview/filters/overviewParams";
import * as transactionParams from "@/features/transactions/filters/transactionParams";
import {
  parseTransactionFilters,
  serializeTransactionFilters,
  type TransactionFilters,
} from "@/features/transactions/filters/transactionParams";
import { parseTab, serializeTab } from "./homeFilterParams";

const params = (init: Record<string, string>) => new URLSearchParams(init);

const DEFAULT_TRANSACTIONS: TransactionFilters = {
  filter: {},
  sort: null,
  size: 10,
};

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
    expect("parseCategoriesFilters" in transactionParams).toBe(false);
    expect("serializeCategoriesFilters" in transactionParams).toBe(false);
    expect("CATEGORIES_PARAM_KEYS" in transactionParams).toBe(false);
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
