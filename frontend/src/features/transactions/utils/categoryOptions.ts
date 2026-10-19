import { FinancialTransactionCategory } from "@/api/dtos";

export type CategoryOption = {
  category: FinancialTransactionCategory;
  isChild: boolean;
};

/**
 * Orders categories as roots by name, each followed by its children by name.
 * A child whose parent is not in the list is shown as a root. Search keeps the
 * parent of a matching child visible so the child stays under it.
 */
export function groupCategoryOptions(
  categories: FinancialTransactionCategory[],
  search = "",
): CategoryOption[] {
  const query = search.trim().toLowerCase();
  function matches(c: FinancialTransactionCategory) {
    return !query || c.description.toLowerCase().includes(query);
  }
  function byName(a: FinancialTransactionCategory, b: FinancialTransactionCategory) {
    return a.description.localeCompare(b.description);
  }
  const ids = new Set(categories.map((c) => c.id));
  function isRoot(c: FinancialTransactionCategory) {
    return c.parentId == null || !ids.has(c.parentId);
  }

  return categories
    .filter(isRoot)
    .sort(byName)
    .flatMap((root) => {
      const children = categories
        .filter((c) => !isRoot(c) && c.parentId === root.id && matches(c))
        .sort(byName);
      if (!matches(root) && children.length === 0) return [];
      return [
        { category: root, isChild: false },
        ...children.map((category) => ({ category, isChild: true })),
      ];
    });
}
