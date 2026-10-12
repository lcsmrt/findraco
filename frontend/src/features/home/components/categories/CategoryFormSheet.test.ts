import { describe, expect, it } from "vitest";
import type { FinancialTransactionCategory } from "@/api/dtos";
import { maskCurrency } from "@/utils/string/masks";
import {
  buildDefaultValues,
  createCategoryFormSchema,
  parentOptions,
  toPayload,
  type CategoryFormValues,
} from "./CategoryFormSheet";

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
  spendingLimit: "",
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
      spendingLimit: maskCurrency("20000"),
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
      spendingLimit: "",
    });
  });

  it("starts a new category as a DEBIT root without defaults", () => {
    expect(buildDefaultValues()).toEqual({
      type: "DEBIT",
      description: "",
      parentId: null,
      spendingLimit: "",
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
      spendingLimit: 200.5,
    });
  });

  it("sends parentId null for a root and no limit when empty", () => {
    expect(toPayload(values())).toEqual({
      type: "DEBIT",
      description: "Groceries",
      parentId: null,
      spendingLimit: undefined,
    });
  });

  it("drops the limit for a CREDIT category", () => {
    expect(
      toPayload(values({ type: "CREDIT", spendingLimit: maskCurrency("10000") })).spendingLimit,
    ).toBeUndefined();
  });
});
