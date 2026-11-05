import type { Category } from "@/api/dtos";
import { describe, expect, it } from "vitest";
import { categoryQuickCreate } from "./categoryQuickCreate";

function cat(id: number, description: string, type: Category["type"] = "DEBIT"): Category {
  return { id, version: 0, description, type };
}

const categories = [cat(1, "Food"), cat(2, "Pet shop"), cat(3, "Salary", "CREDIT")];

describe("categoryQuickCreate", () => {
  it("labels the create row with the transaction type, next to partial matches", () => {
    const expense = categoryQuickCreate({ search: "Pet", type: "DEBIT", categories, canManageCategories: true });
    const income = categoryQuickCreate({ search: "Pet", type: "CREDIT", categories, canManageCategories: true });

    expect(expense).toEqual({ description: "Pet", label: "Create expense category \"Pet\"" });
    expect(income?.label).toBe("Create income category \"Pet\"");
  });

  it("offers no create row when a category of that type has the same name", () => {
    const same = categoryQuickCreate({ search: "  fOOd ", type: "DEBIT", categories, canManageCategories: true });
    // The same name under the other type is a different category.
    const otherType = categoryQuickCreate({ search: "Salary", type: "DEBIT", categories, canManageCategories: true });

    expect(same).toBeNull();
    expect(otherType?.description).toBe("Salary");
  });

  it("offers no create row without the manage-categories permission", () => {
    expect(categoryQuickCreate({ search: "Pet", type: "DEBIT", categories, canManageCategories: false })).toBeNull();
  });

  it("offers no create row for a blank search or one over 255 characters", () => {
    function create(search: string) {
      return categoryQuickCreate({ search, type: "DEBIT", categories, canManageCategories: true });
    }

    expect(create("   ")).toBeNull();
    expect(create("")).toBeNull();
    expect(create("a".repeat(256))).toBeNull();
    expect(create(` ${"a".repeat(255)} `)?.description).toBe("a".repeat(255));
  });
});
