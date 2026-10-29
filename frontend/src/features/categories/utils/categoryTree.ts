import type { Category } from "@/api/dtos";
import type { TransactionType } from "@/api/dtos/transaction";

export type CategoryTreeRoot = {
  category: Category;
  children: Category[];
};

export type CategoryTreeSection = {
  type: TransactionType;
  roots: CategoryTreeRoot[];
};

const SECTION_TYPES: readonly TransactionType[] = ["DEBIT", "CREDIT"];

function byName(
  a: Category,
  b: Category,
) {
  return a.description.localeCompare(b.description, undefined, {
    sensitivity: "base",
  });
}

/**
 * The Categories tab tree: Expenses then Income, roots sorted by name,
 * each followed by its children sorted by name. A child whose parent is not in the
 * list is shown as a root.
 */
export function buildCategoryTree(
  categories: Category[],
): CategoryTreeSection[] {
  const ids = new Set(categories.map((c) => c.id));
  function isRoot(c: Category) {
    return c.parentId == null || !ids.has(c.parentId);
  }

  const roots: CategoryTreeRoot[] = categories
    .filter(isRoot)
    .sort(byName)
    .map((root) => ({
      category: root,
      children: categories
        .filter((c) => !isRoot(c) && c.parentId === root.id)
        .sort(byName),
    }));

  return SECTION_TYPES.map((type) => ({
    type,
    roots: roots.filter((root) => root.category.type === type),
  }));
}
