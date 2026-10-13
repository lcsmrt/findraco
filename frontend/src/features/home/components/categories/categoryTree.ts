import type { FinancialTransactionCategory } from "@/api/dtos";
import type { FinancialTransactionType } from "@/api/dtos/financialTransaction";

export type CategoryTreeRoot = {
  category: FinancialTransactionCategory;
  children: FinancialTransactionCategory[];
};

export type CategoryTreeSection = {
  type: FinancialTransactionType;
  roots: CategoryTreeRoot[];
};

const SECTION_TYPES: readonly FinancialTransactionType[] = ["DEBIT", "CREDIT"];

const byName = (
  a: FinancialTransactionCategory,
  b: FinancialTransactionCategory,
) =>
  a.description.localeCompare(b.description, undefined, {
    sensitivity: "base",
  });

/**
 * The Categories tab tree (UX-01 AC 3): Expenses then Income, roots sorted by name,
 * each followed by its children sorted by name. A child whose parent is not in the
 * list is shown as a root.
 */
export const buildCategoryTree = (
  categories: FinancialTransactionCategory[],
): CategoryTreeSection[] => {
  const ids = new Set(categories.map((c) => c.id));
  const isRoot = (c: FinancialTransactionCategory) =>
    c.parentId == null || !ids.has(c.parentId);

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
};
