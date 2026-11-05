import type { Category } from "@/api/dtos";
import type { TransactionType } from "@/api/dtos/transaction";
import { i18n } from "@/i18n/i18n";

/** The API bound on a category description. */
const MAX_DESCRIPTION_LENGTH = 255;


export type CategoryQuickCreateInput = {
  search: string;
  /** The transaction's type; the new category takes it. */
  type: TransactionType | undefined;
  categories: Category[];
  canManageCategories: boolean;
};

export type CategoryQuickCreate = {
  /** The trimmed search, which becomes the description. */
  description: string;
  label: string;
};

/**
 * The "Create category" row of the picker, or null when it must not show: the member cannot manage
 * categories, the search is blank or too long for the API, or a category of the type already has
 * that name. Partial matches do not hide it.
 */
export function categoryQuickCreate({
  search,
  type,
  categories,
  canManageCategories,
}: CategoryQuickCreateInput): CategoryQuickCreate | null {
  const description = search.trim();
  if (!canManageCategories || type == null) return null;
  if (description === "" || description.length > MAX_DESCRIPTION_LENGTH) return null;

  const name = description.toLowerCase();
  const exists = categories.some(
    (category) => category.type === type && category.description.trim().toLowerCase() === name,
  );
  if (exists) return null;

  return { description, label: i18n.t(
      type === "DEBIT"
        ? "transactions.categoryQuickCreate.createExpense"
        : "transactions.categoryQuickCreate.createIncome",
      { name: description },
    ) };
}
