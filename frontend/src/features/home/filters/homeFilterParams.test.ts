import { describe, expect, it } from "vitest";
import {
  parseCategoriesFilters,
  parseOverviewFilters,
  parseTab,
  parseTransactionFilters,
  resolvePeriodDates,
  serializeCategoriesFilters,
  serializeOverviewFilters,
  serializeTab,
  serializeTransactionFilters,
  type CategoriesFilters,
  type OverviewFilters,
  type TransactionFilters,
} from "./homeFilterParams";

const params = (init: Record<string, string>) => new URLSearchParams(init);

const DEFAULT_OVERVIEW: OverviewFilters = {
  period: "this-month",
  customRange: null,
  memberId: null,
};
const DEFAULT_TRANSACTIONS: TransactionFilters = {
  filter: {},
  sort: null,
  size: 10,
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

describe("categories codec", () => {
  const DEFAULT_CATEGORIES: CategoriesFilters = {
    period: "this-month",
    customRange: null,
  };

  it.each(["this-month", "last-3m", "last-6m", "this-year"] as const)(
    "round-trips preset %s",
    (period) => {
      const filters: CategoriesFilters = { period, customRange: null };
      expect(
        parseCategoriesFilters(params(serializeCategoriesFilters(filters))),
      ).toEqual(filters);
    },
  );

  it("round-trips a custom range under its own param names", () => {
    const filters: CategoriesFilters = {
      period: "this-month",
      customRange: { from: "2026-09-01", to: "2026-09-30" },
    };
    const serialized = serializeCategoriesFilters(filters);
    expect(serialized).toEqual({
      categoriesPeriod: "custom",
      categoriesPeriodFrom: "2026-09-01",
      categoriesPeriodTo: "2026-09-30",
    });
    expect(parseCategoriesFilters(params(serialized))).toEqual(filters);
  });

  it("serializes last-3m as categoriesPeriod", () => {
    expect(
      serializeCategoriesFilters({ period: "last-3m", customRange: null }),
    ).toEqual({ categoriesPeriod: "last-3m" });
  });

  it("omits defaults on serialize", () => {
    expect(serializeCategoriesFilters(DEFAULT_CATEGORIES)).toEqual({});
  });

  it("returns defaults for empty params", () => {
    expect(parseCategoriesFilters(params({}))).toEqual(DEFAULT_CATEGORIES);
  });

  it("falls back to this-month for an unknown period token", () => {
    expect(
      parseCategoriesFilters(params({ categoriesPeriod: "last-decade" })),
    ).toEqual(DEFAULT_CATEGORIES);
  });

  it("falls back to this-month when the custom range is inverted or malformed", () => {
    expect(
      parseCategoriesFilters(
        params({
          categoriesPeriod: "custom",
          categoriesPeriodFrom: "2026-09-30",
          categoriesPeriodTo: "2026-09-01",
        }),
      ),
    ).toEqual(DEFAULT_CATEGORIES);
    expect(
      parseCategoriesFilters(
        params({ categoriesPeriod: "custom", categoriesPeriodFrom: "2026-13-01" }),
      ),
    ).toEqual(DEFAULT_CATEGORIES);
  });

  it("is independent of the Overview period", () => {
    const both = params({ period: "this-year", categoriesPeriod: "last-6m" });
    expect(parseCategoriesFilters(both).period).toBe("last-6m");
    expect(parseOverviewFilters(both).period).toBe("this-year");
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
