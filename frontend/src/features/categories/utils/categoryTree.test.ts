import type { Category } from "@/api/dtos";
import { describe, expect, it } from "vitest";
import { buildCategoryTree } from "./categoryTree";

function category(
  id: number,
  description: string,
  overrides: Partial<Category> = {},
): Category {
  return {
    id,
    description,
    type: "DEBIT",
    parentId: null,
    ...overrides,
  };
}

function names(tree: ReturnType<typeof buildCategoryTree>) {
  return tree.map((section) => ({
    type: section.type,
    roots: section.roots.map((root) => ({
      name: root.category.description,
      children: root.children.map((child) => child.description),
    })),
  }));
}

describe("buildCategoryTree", () => {
  it("sorts roots alphabetically, ignoring case (UX-01 AC 3)", () => {
    const tree = buildCategoryTree([
      category(1, "transport"),
      category(2, "Food"),
      category(3, "bills"),
      category(4, "Leisure"),
    ]);

    expect(tree[0].roots.map((r) => r.category.description)).toEqual([
      "bills",
      "Food",
      "Leisure",
      "transport",
    ]);
  });

  it("groups each child under its root, children sorted alphabetically ignoring case", () => {
    const tree = buildCategoryTree([
      category(10, "zoo", { parentId: 2 }),
      category(1, "Home"),
      category(11, "Rent", { parentId: 1 }),
      category(2, "Leisure"),
      category(12, "Bar", { parentId: 2 }),
      category(13, "cinema", { parentId: 2 }),
    ]);

    expect(names(tree)[0]).toEqual({
      type: "DEBIT",
      roots: [
        { name: "Home", children: ["Rent"] },
        { name: "Leisure", children: ["Bar", "cinema", "zoo"] },
      ],
    });
  });

  it("lists Expenses before Income, each with its own roots", () => {
    const tree = buildCategoryTree([
      category(1, "Salary", { type: "CREDIT" }),
      category(2, "Food"),
      category(3, "Bonus", { type: "CREDIT" }),
      category(4, "Gift", { type: "CREDIT", parentId: 3 }),
    ]);

    expect(names(tree)).toEqual([
      { type: "DEBIT", roots: [{ name: "Food", children: [] }] },
      {
        type: "CREDIT",
        roots: [
          { name: "Bonus", children: ["Gift"] },
          { name: "Salary", children: [] },
        ],
      },
    ]);
  });

  it("returns both sections, empty, without categories", () => {
    expect(names(buildCategoryTree([]))).toEqual([
      { type: "DEBIT", roots: [] },
      { type: "CREDIT", roots: [] },
    ]);
  });

  it("shows a child whose parent is missing as a root, in alphabetical place", () => {
    const tree = buildCategoryTree([
      category(1, "Food"),
      category(5, "Orphan", { parentId: 99 }),
      category(2, "Bills"),
    ]);

    expect(names(tree)[0].roots).toEqual([
      { name: "Bills", children: [] },
      { name: "Food", children: [] },
      { name: "Orphan", children: [] },
    ]);
  });

  it("keeps the category objects so rows can show owner and limits", () => {
    const food = category(1, "Food", {
      effectiveLimit: 900,
      ownerName: "Lucas",
    });
    const tree = buildCategoryTree([food]);

    expect(tree[0].roots[0].category).toBe(food);
  });
});
