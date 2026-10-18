import { describe, expect, it } from "vitest";
import type { FinancialTransactionCategory } from "@/api/dtos";
import { maskCurrency } from "@/utils/string/masks";
import type { PlanMember } from "@/api/dtos/plan";
import {
  buildDefaultValues,
  buildMemberLimitRows,
  createCategoryFormSchema,
  memberLimitShares,
  ownerOptions,
  parentOptions,
  toPayload,
  type CategoryFormValues,
  type MemberLimitRow,
} from "./categoryForm";

const cat = (
  id: number,
  description: string,
  overrides: Partial<FinancialTransactionCategory> = {},
): FinancialTransactionCategory => ({
  id,
  description,
  type: "DEBIT",
  parentId: null,
  spendingLimit: null,
  ...overrides,
});

const food = cat(1, "Food");
const delivery = cat(2, "Delivery", { parentId: 1 });
const shopping = cat(3, "Shopping");
const salary = cat(4, "Salary", { type: "CREDIT" });
const rent = cat(5, "Rent");
const categories = [food, delivery, shopping, salary, rent];

const values = (overrides: Partial<CategoryFormValues> = {}): CategoryFormValues => ({
  type: "DEBIT",
  description: "Groceries",
  parentId: null,
  ownerId: null,
  spendingLimit: "",
  limitMode: "single",
  memberLimits: [],
  ...overrides,
});

const issuesOf = (
  result: ReturnType<ReturnType<typeof createCategoryFormSchema>["safeParse"]>,
) =>
  result.success
    ? []
    : result.error.issues.map((i) => ({ path: i.path.join("."), message: i.message }));

describe("parentOptions", () => {
  it("lists only roots of the given type, sorted by name", () => {
    expect(parentOptions(categories, "DEBIT").map((c) => c.id)).toEqual([1, 5, 3]);
  });

  it("lists income roots for CREDIT", () => {
    expect(parentOptions(categories, "CREDIT").map((c) => c.id)).toEqual([4]);
  });

  it("excludes the category being edited", () => {
    expect(parentOptions(categories, "DEBIT", 5).map((c) => c.id)).toEqual([1, 3]);
  });

  it("never offers a child as a parent", () => {
    expect(parentOptions(categories, "DEBIT").some((c) => c.id === 2)).toBe(false);
  });
});

describe("createCategoryFormSchema", () => {
  it("accepts a root category", () => {
    expect(createCategoryFormSchema(categories).safeParse(values()).success).toBe(true);
  });

  it("accepts a root of the same type as parent", () => {
    expect(
      createCategoryFormSchema(categories).safeParse(values({ parentId: 1 })).success,
    ).toBe(true);
  });

  it("requires a name", () => {
    expect(
      issuesOf(createCategoryFormSchema(categories).safeParse(values({ description: "  " }))),
    ).toEqual([{ path: "description", message: "Name is required" }]);
  });

  it("rejects a child as parent", () => {
    expect(
      issuesOf(createCategoryFormSchema(categories).safeParse(values({ parentId: 2 }))),
    ).toEqual([
      { path: "parentId", message: "Choose a top-level category of the same type" },
    ]);
  });

  it("rejects a parent of the other type", () => {
    expect(
      issuesOf(createCategoryFormSchema(categories).safeParse(values({ parentId: 4 }))),
    ).toEqual([
      { path: "parentId", message: "Choose a top-level category of the same type" },
    ]);
  });

  it("rejects the category as its own parent", () => {
    expect(
      issuesOf(createCategoryFormSchema(categories, rent).safeParse(values({ parentId: 5 }))),
    ).toEqual([
      { path: "parentId", message: "Choose a top-level category of the same type" },
    ]);
  });

  it("blocks a type change on a category with children", () => {
    expect(
      issuesOf(
        createCategoryFormSchema(categories, food).safeParse(
          values({ description: "Food", type: "CREDIT" }),
        ),
      ),
    ).toEqual([
      { path: "type", message: "A category with subcategories cannot change type" },
    ]);
  });

  it("allows a type change on a category without children", () => {
    expect(
      createCategoryFormSchema(categories, rent).safeParse(
        values({ description: "Rent", type: "CREDIT" }),
      ).success,
    ).toBe(true);
  });

  it("blocks a parent on a category with children", () => {
    expect(
      issuesOf(
        createCategoryFormSchema(categories, food).safeParse(
          values({ description: "Food", parentId: 3 }),
        ),
      ),
    ).toEqual([
      { path: "parentId", message: "A category with subcategories cannot have a parent" },
    ]);
  });

  it("lets a child move to another root or back to the top level", () => {
    const schema = createCategoryFormSchema(categories, delivery);
    expect(schema.safeParse(values({ description: "Delivery", parentId: 3 })).success).toBe(true);
    expect(schema.safeParse(values({ description: "Delivery", parentId: null })).success).toBe(true);
  });
});

describe("buildDefaultValues", () => {
  it("maps an existing child category, masking its limit", () => {
    expect(
      buildDefaultValues(cat(2, "Delivery", { parentId: 1, spendingLimit: 200 })),
    ).toEqual({
      type: "DEBIT",
      description: "Delivery",
      parentId: 1,
      ownerId: null,
      spendingLimit: maskCurrency("20000"),
      limitMode: "single",
      memberLimits: [],
    });
  });

  it("treats a category without parentId as a root", () => {
    const withoutParent: FinancialTransactionCategory = {
      id: 1,
      type: "DEBIT",
      description: "Food",
    };
    expect(buildDefaultValues(withoutParent).parentId).toBeNull();
  });

  it("starts a new category from the given name and type", () => {
    expect(buildDefaultValues(null, { description: "Gym", type: "CREDIT" })).toEqual({
      type: "CREDIT",
      description: "Gym",
      parentId: null,
      ownerId: null,
      spendingLimit: "",
      limitMode: "single",
      memberLimits: [],
    });
  });

  // UX-02 AC 2: New subcategory opens the create form with that root as the parent.
  it("starts a new subcategory under the given parent, with the parent's type", () => {
    expect(buildDefaultValues(null, { parentId: 4 }, [], categories)).toEqual({
      type: "CREDIT",
      description: "",
      parentId: 4,
      ownerId: null,
      spendingLimit: "",
      limitMode: "single",
      memberLimits: [],
    });
    expect(buildDefaultValues(null, { parentId: 1 }, [], categories)).toMatchObject({
      type: "DEBIT",
      parentId: 1,
    });
  });

  it("passes the schema with the prefilled parent", () => {
    const schema = createCategoryFormSchema(categories);
    const prefilled = {
      ...buildDefaultValues(null, { parentId: 4 }, [], categories),
      description: "Bonus",
    };
    const parsed = schema.safeParse(prefilled);
    expect(parsed.success).toBe(true);
    expect(parsed.data?.parentId).toBe(4);
  });

  it("keeps today's defaults for a create without a parent, even with categories", () => {
    expect(buildDefaultValues(null, undefined, [], categories)).toEqual(
      buildDefaultValues(),
    );
    expect(
      buildDefaultValues(null, { description: "Gym", type: "CREDIT" }, [], categories),
    ).toMatchObject({ type: "CREDIT", description: "Gym", parentId: null });
  });

  it("starts a new category as a DEBIT root without defaults", () => {
    expect(buildDefaultValues()).toEqual({
      type: "DEBIT",
      description: "",
      parentId: null,
      ownerId: null,
      spendingLimit: "",
      limitMode: "single",
      memberLimits: [],
    });
  });
});

describe("toPayload", () => {
  it("maps a DEBIT child with a limit to the API body", () => {
    expect(
      toPayload(values({ description: " Delivery ", parentId: 1, spendingLimit: maskCurrency("20050") })),
    ).toEqual({
      type: "DEBIT",
      description: "Delivery",
      parentId: 1,
      ownerId: null,
      spendingLimit: 200.5,
      memberLimits: [],
    });
  });

  it("sends parentId null for a root and no limit when empty", () => {
    expect(toPayload(values())).toEqual({
      type: "DEBIT",
      description: "Groceries",
      parentId: null,
      ownerId: null,
      spendingLimit: undefined,
      memberLimits: [],
    });
  });

  it("drops the limit for a CREDIT category", () => {
    expect(
      toPayload(values({ type: "CREDIT", spendingLimit: maskCurrency("10000") })).spendingLimit,
    ).toBeUndefined();
  });
});

// ---- Per-member limits (CAT-11, CAT-13, CAT-14) ----

const lucas: PlanMember = { userId: 10, name: "Lucas", email: "l@x.com", role: "OWNER" };
const livia: PlanMember = { userId: 20, name: "Livia", email: "v@x.com", role: "EDITOR" };

const row = (
  memberId: number,
  memberName: string,
  amount: string,
  active = true,
): MemberLimitRow => ({ memberId, memberName, amount, active });

const groceries = cat(6, "Groceries", {
  memberLimits: [
    { memberId: 10, memberName: "Lucas", amount: 260, active: true },
    { memberId: 30, memberName: "Ana", amount: 50, active: false },
  ],
  effectiveLimit: 260,
});

describe("buildMemberLimitRows", () => {
  it("lists every active member with their stored amount, then former members' entries", () => {
    expect(buildMemberLimitRows(groceries, [lucas, livia])).toEqual([
      row(20, "Livia", ""),
      row(10, "Lucas", maskCurrency("26000")),
      row(30, "Ana", maskCurrency("5000"), false),
    ]);
  });

  it("lists active members with no amount for a new category", () => {
    expect(buildMemberLimitRows(null, [lucas])).toEqual([row(10, "Lucas", "")]);
  });
});

describe("buildDefaultValues with per-member limits", () => {
  it("starts in per member mode when the category has entries", () => {
    const defaults = buildDefaultValues(groceries, undefined, [lucas, livia]);
    expect(defaults.limitMode).toBe("perMember");
    expect(defaults.memberLimits).toHaveLength(3);
  });
});

describe("memberLimitShares", () => {
  it("computes each active member's read-only share of the total (260 / 140 → 65% / 35%)", () => {
    const shares = memberLimitShares([
      row(10, "Lucas", maskCurrency("26000")),
      row(20, "Livia", maskCurrency("14000")),
    ]);
    expect(shares.get(10)).toBe(65);
    expect(shares.get(20)).toBe(35);
  });

  it("gives every member a 0% share when the total is 0", () => {
    const shares = memberLimitShares([
      row(10, "Lucas", maskCurrency("0")),
      row(20, "Livia", maskCurrency("0")),
    ]);
    expect(shares.get(10)).toBe(0);
    expect(shares.get(20)).toBe(0);
  });

  it("leaves out former members and members without an amount", () => {
    const shares = memberLimitShares([
      row(10, "Lucas", maskCurrency("10000")),
      row(20, "Livia", ""),
      row(30, "Ana", maskCurrency("10000"), false),
    ]);
    expect(shares.get(10)).toBe(100);
    expect(shares.has(20)).toBe(false);
    expect(shares.has(30)).toBe(false);
  });

  it("rounds to one decimal", () => {
    const shares = memberLimitShares([
      row(10, "Lucas", maskCurrency("10000")),
      row(20, "Livia", maskCurrency("20000")),
    ]);
    expect(shares.get(10)).toBe(33.3);
    expect(shares.get(20)).toBe(66.7);
  });
});

describe("createCategoryFormSchema with per-member limits", () => {
  const perMember = (rows: MemberLimitRow[], overrides: Partial<CategoryFormValues> = {}) =>
    values({ limitMode: "perMember", memberLimits: rows, ...overrides });

  it("accepts one amount per member", () => {
    expect(
      createCategoryFormSchema(categories).safeParse(
        perMember([row(10, "Lucas", maskCurrency("26000")), row(20, "Livia", "")]),
      ).success,
    ).toBe(true);
  });

  it("rejects the same member twice", () => {
    expect(
      issuesOf(
        createCategoryFormSchema(categories).safeParse(
          perMember([row(10, "Lucas", "R$ 1,00"), row(10, "Lucas", "R$ 2,00")]),
        ),
      ),
    ).toEqual([{ path: "memberLimits.1.memberId", message: "Each member can have only one limit" }]);
  });

  it("rejects a negative amount", () => {
    expect(
      issuesOf(createCategoryFormSchema(categories).safeParse(perMember([row(10, "Lucas", "-1,00")]))),
    ).toEqual([{ path: "memberLimits.0.amount", message: "Amount cannot be negative" }]);
  });

  it("is not allowed on a CREDIT category", () => {
    expect(
      issuesOf(
        createCategoryFormSchema(categories).safeParse(
          perMember([row(10, "Lucas", "R$ 1,00")], { type: "CREDIT" }),
        ),
      ),
    ).toEqual([{ path: "limitMode", message: "Income categories cannot have per-member limits" }]);
  });

  it("is not allowed on an owned category or a child of one", () => {
    const owned = cat(7, "Professional", { ownerId: 10 });
    const withOwned = [...categories, owned];
    const message = "A category that belongs to one member cannot have per-member limits";
    expect(
      issuesOf(
        createCategoryFormSchema(withOwned, owned).safeParse(
          perMember([row(10, "Lucas", "R$ 1,00")], { description: "Professional", ownerId: 10 }),
        ),
      ),
    ).toEqual([{ path: "limitMode", message }]);
    expect(
      issuesOf(
        createCategoryFormSchema(withOwned).safeParse(
          perMember([row(10, "Lucas", "R$ 1,00")], { parentId: 7 }),
        ),
      ),
    ).toEqual([{ path: "limitMode", message }]);
  });
});

describe("toPayload with per-member limits", () => {
  it("sends every member with an amount and no plain limit", () => {
    expect(
      toPayload(
        values({
          limitMode: "perMember",
          spendingLimit: maskCurrency("99900"),
          memberLimits: [
            row(10, "Lucas", maskCurrency("26000")),
            row(20, "Livia", maskCurrency("14000")),
            row(40, "Bia", ""),
          ],
        }),
      ),
    ).toEqual({
      type: "DEBIT",
      description: "Groceries",
      parentId: null,
      ownerId: null,
      spendingLimit: undefined,
      memberLimits: [
        { memberId: 10, amount: 260 },
        { memberId: 20, amount: 140 },
      ],
    });
  });

  it("keeps a former member's entry unchanged until it is removed", () => {
    const rows = [row(10, "Lucas", maskCurrency("26000")), row(30, "Ana", maskCurrency("5000"), false)];
    expect(toPayload(values({ limitMode: "perMember", memberLimits: rows })).memberLimits).toEqual([
      { memberId: 10, amount: 260 },
      { memberId: 30, amount: 50 },
    ]);
    const removed = rows.filter((r) => r.memberId !== 30);
    expect(toPayload(values({ limitMode: "perMember", memberLimits: removed })).memberLimits).toEqual([
      { memberId: 10, amount: 260 },
    ]);
  });

  it("clears the per-member entries in single mode", () => {
    const payload = toPayload(
      values({ spendingLimit: maskCurrency("30000"), memberLimits: [row(10, "Lucas", maskCurrency("26000"))] }),
    );
    expect(payload.spendingLimit).toBe(300);
    expect(payload.memberLimits).toEqual([]);
  });

  it("sends no per-member entries for a CREDIT category", () => {
    expect(
      toPayload(
        values({ type: "CREDIT", limitMode: "perMember", memberLimits: [row(10, "Lucas", "R$ 1,00")] }),
      ).memberLimits,
    ).toEqual([]);
  });
});

// ---- Owner (CAT-15) ----

describe("ownerOptions", () => {
  it("offers the active members by name", () => {
    expect(ownerOptions([lucas, livia])).toEqual([
      { id: 20, name: "Livia", active: true },
      { id: 10, name: "Lucas", active: true },
    ]);
  });

  it("keeps a root's former owner as an option", () => {
    const owned = cat(7, "Professional", { ownerId: 30, ownerName: "Ana", ownerActive: false });
    expect(ownerOptions([lucas], owned)).toEqual([
      { id: 10, name: "Lucas", active: true },
      { id: 30, name: "Ana", active: false },
    ]);
  });

  it("does not offer a child's inherited owner", () => {
    const child = cat(8, "Courses", { parentId: 7, ownerId: 30, ownerName: "Ana" });
    expect(ownerOptions([lucas], child).map((o) => o.id)).toEqual([10]);
  });
});

describe("createCategoryFormSchema with an owner", () => {
  it("accepts an owner on a root", () => {
    expect(createCategoryFormSchema(categories).safeParse(values({ ownerId: 10 })).success).toBe(true);
  });

  it("rejects an owner on a child", () => {
    expect(
      issuesOf(createCategoryFormSchema(categories).safeParse(values({ parentId: 1, ownerId: 10 }))),
    ).toEqual([{ path: "ownerId", message: "A subcategory has its parent's owner" }]);
  });

  it("makes the owner and per-member mode mutually exclusive", () => {
    const message = "A category that belongs to one member cannot have per-member limits";
    expect(
      issuesOf(
        createCategoryFormSchema(categories).safeParse(
          values({ ownerId: 10, limitMode: "perMember", memberLimits: [row(10, "Lucas", "R$ 1,00")] }),
        ),
      ),
    ).toEqual([{ path: "limitMode", message }]);
    expect(
      createCategoryFormSchema(categories, cat(7, "Professional", { ownerId: 10 })).safeParse(
        values({ description: "Professional", ownerId: null, limitMode: "perMember", memberLimits: [] }),
      ).success,
    ).toBe(true);
  });
});

describe("owner in buildDefaultValues and toPayload", () => {
  it("takes a root's own owner", () => {
    expect(buildDefaultValues(cat(7, "Professional", { ownerId: 10 })).ownerId).toBe(10);
  });

  it("leaves a child's inherited owner out of the form", () => {
    expect(buildDefaultValues(cat(8, "Courses", { parentId: 7, ownerId: 10 })).ownerId).toBeNull();
  });

  it("sends the owner for a root and never for a child", () => {
    expect(toPayload(values({ ownerId: 10 })).ownerId).toBe(10);
    expect(toPayload(values({ parentId: 1, ownerId: 10 })).ownerId).toBeNull();
  });
});
