import { describe, expect, it } from "vitest";
import type { CategoryBreakdown } from "@/api/dtos";
import { resolvePeriodDates } from "../filters/homeFilterParams";
import { countMonths, scaleLimit, scaleTreeLimits } from "./scaleLimits";

const now = new Date(2026, 9, 11); // 2026-10-11

const breakdown = (
  overrides: Partial<CategoryBreakdown> & Pick<CategoryBreakdown, "spent">,
): CategoryBreakdown => ({
  categoryId: 1,
  parentId: null,
  categoryName: "Food",
  children: [],
  ...overrides,
});

describe("countMonths", () => {
  it.each([
    ["this-month", 1],
    ["last-3m", 3],
    ["last-6m", 6],
    ["this-year", 12],
  ] as const)("counts %s as %i month(s)", (period, months) => {
    const { startDate, endDate } = resolvePeriodDates(period, now);
    expect(countMonths(startDate, endDate)).toBe(months);
  });

  it("counts every calendar month a custom range touches", () => {
    expect(countMonths("2026-09-15", "2026-10-10")).toBe(2);
    expect(countMonths("2026-10-03", "2026-10-20")).toBe(1);
    expect(countMonths("2025-12-20", "2026-01-05")).toBe(2);
  });
});

describe("scaleLimit", () => {
  it("keeps a 1-month limit and evaluates usage", () => {
    expect(scaleLimit(300, 400, 1)).toEqual({
      limit: 400,
      remaining: 100,
      percentUsed: 75,
      overLimit: false,
    });
  });

  it("multiplies the limit by the month count for a 3-month range", () => {
    expect(scaleLimit(900, 400, 3)).toEqual({
      limit: 1200,
      remaining: 300,
      percentUsed: 75,
      overLimit: false,
    });
  });

  it("marks spend above the scaled limit as over limit", () => {
    expect(scaleLimit(1300, 400, 3)).toEqual({
      limit: 1200,
      remaining: -100,
      percentUsed: 108.33,
      overLimit: true,
    });
  });

  it("is not over when spend equals the limit", () => {
    expect(scaleLimit(400, 400, 1).overLimit).toBe(false);
  });

  it("reports 0 percent and not over for a zero limit with zero spend", () => {
    expect(scaleLimit(0, 0, 2)).toEqual({
      limit: 0,
      remaining: 0,
      percentUsed: 0,
      overLimit: false,
    });
  });

  it.each([null, undefined])("leaves every limit field empty without a limit (%s)", (limit) => {
    expect(scaleLimit(50, limit, 3)).toEqual({
      limit: undefined,
      remaining: undefined,
      percentUsed: undefined,
      overLimit: undefined,
    });
  });
});

describe("scaleTreeLimits", () => {
  it("produces the Overview breakdown values for flat categories", () => {
    const data = [
      breakdown({ categoryName: "Food", spent: 900, limit: 400, remaining: -500, percentUsed: 225, overLimit: true }),
      breakdown({ categoryId: 2, categoryName: "Fun", spent: 120 }),
    ];

    expect(scaleTreeLimits(data, 3)).toEqual([
      breakdown({ categoryName: "Food", spent: 900, limit: 1200, remaining: 300, percentUsed: 75, overLimit: false }),
      {
        ...breakdown({ categoryId: 2, categoryName: "Fun", spent: 120 }),
        limit: undefined,
        remaining: undefined,
        percentUsed: undefined,
        overLimit: undefined,
      },
    ]);
  });

  it("scales children independently of their parent", () => {
    const child = breakdown({ categoryId: 2, parentId: 1, categoryName: "Delivery", spent: 250, limit: 200 });
    const [root] = scaleTreeLimits([breakdown({ spent: 300, children: [child] })], 2);

    expect(root.limit).toBeUndefined();
    expect(root.children).toHaveLength(1);
    expect(root.children[0]).toMatchObject({
      categoryName: "Delivery",
      limit: 400,
      remaining: 150,
      percentUsed: 62.5,
      overLimit: false,
    });
  });
});
