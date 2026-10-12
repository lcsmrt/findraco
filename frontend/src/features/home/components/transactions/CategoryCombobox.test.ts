import { describe, expect, it } from "vitest";
import type { FinancialTransactionCategory } from "@/api/dtos";
import { groupCategoryOptions } from "./CategoryCombobox";

const cat = (
  id: number,
  description: string,
  parentId: number | null = null,
): FinancialTransactionCategory => ({ id, description, type: "DEBIT", parentId });

const food = cat(1, "Food");
const delivery = cat(2, "Delivery", 1);
const diningOut = cat(3, "Dining out", 1);
const shopping = cat(4, "Shopping");
const home = cat(5, "Home", 4);
const rent = cat(6, "Rent");
// Unsorted on purpose: grouping must not depend on input order.
const categories = [home, rent, diningOut, shopping, delivery, food];

const view = (options: ReturnType<typeof groupCategoryOptions>) =>
  options.map((o) => `${o.isChild ? "  " : ""}${o.category.description}`);

describe("groupCategoryOptions", () => {
  it("lists roots by name, each followed by its children by name", () => {
    expect(view(groupCategoryOptions(categories))).toEqual([
      "Food",
      "  Delivery",
      "  Dining out",
      "Rent",
      "Shopping",
      "  Home",
    ]);
  });

  it("keeps both levels selectable as category options", () => {
    const options = groupCategoryOptions(categories);
    expect(options.map((o) => o.category.id)).toEqual([1, 2, 3, 6, 4, 5]);
  });

  it("shows a child whose parent is missing as a root", () => {
    const orphan = cat(7, "Gym", 99);
    expect(view(groupCategoryOptions([orphan, rent]))).toEqual(["Gym", "Rent"]);
  });

  it("keeps a matching child's parent visible during search", () => {
    expect(view(groupCategoryOptions(categories, "deliv"))).toEqual([
      "Food",
      "  Delivery",
    ]);
  });

  it("matches case-insensitively and ignores surrounding spaces", () => {
    expect(view(groupCategoryOptions(categories, "  HOME "))).toEqual([
      "Shopping",
      "  Home",
    ]);
  });

  it("shows a matching root without its non-matching children", () => {
    expect(view(groupCategoryOptions(categories, "food"))).toEqual(["Food"]);
  });

  it("returns nothing when no category matches", () => {
    expect(groupCategoryOptions(categories, "travel")).toEqual([]);
  });
});
