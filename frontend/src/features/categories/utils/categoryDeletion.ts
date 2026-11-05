import { SessionExpiredError } from "@/api/clients/sessionExpiredError";
import {
  CategoryUsage,
  DeleteCategoryRequest,
  Category,
} from "@/api/dtos";
import { problemType } from "@/api/utils/problems";
import { i18n } from "@/i18n/i18n";

/** Categories that can receive a deleted category's references: same type, not itself, not its children. */
export function eligibleDeleteTargets(
  category: Category,
  categories: Category[],
) {
  return categories
    .filter(
      (c) =>
        c.type === category.type &&
        c.id !== category.id &&
        c.parentId !== category.id,
    )
    .sort((a, b) => a.description.localeCompare(b.description));
}

/** True when any transaction, item or recurrence definition still uses the category. */
export function isCategoryInUse({
  transactions,
  items,
  recurrenceDefinitions,
}: CategoryUsage) {
  return transactions + items + recurrenceDefinitions > 0;
}

export type DeleteState = {
  hasChildren: boolean;
  /** Usage counts from the API; null while they load. */
  usage: CategoryUsage | null;
  targetId: number | null;
};

/** The delete to send, or null while the dialog must not submit. */
export function buildDeleteRequest(
  categoryId: number,
  { hasChildren, usage, targetId }: DeleteState,
): DeleteCategoryRequest | null {
  if (hasChildren || usage == null) return null;
  if (isCategoryInUse(usage)) {
    return targetId == null ? null : { id: categoryId, reassignTo: targetId };
  }
  return { id: categoryId };
}

/** "3 transactions, 1 item and 0 recurrence definitions" for the dialog. */
export function describeUsage({
  transactions,
  items,
  recurrenceDefinitions,
}: CategoryUsage) {
  return i18n.t("categories.usage.summary", {
    transactions: i18n.t("categories.usage.transactions", { count: transactions }),
    items: i18n.t("categories.usage.items", { count: items }),
    recurrences: i18n.t("categories.usage.recurrences", { count: recurrenceDefinitions }),
  });
}

/** What the delete dialog says about the category: why it cannot go yet, where it is used, or that it is free. */
export function describeDeletion({
  hasChildren,
  usage,
  usageFailed,
}: {
  hasChildren: boolean;
  usage: CategoryUsage | null | undefined;
  usageFailed: boolean;
}) {
  if (hasChildren) return i18n.t("categories.deletion.hasChildren");
  if (usage == null) {
    return i18n.t(usageFailed ? "categories.deletion.usageFailed" : "categories.deletion.checking");
  }
  return isCategoryInUse(usage)
    ? i18n.t("categories.deletion.inUse", { usage: describeUsage(usage) })
    : i18n.t("categories.deletion.unused");
}

/** Tells the two 409s of a category delete apart by problem type, never by wording. */
export function classifyDeleteError(
  error: unknown,
): "has-children" | "in-use" | "session-expired" | null {
  if (error instanceof SessionExpiredError) return "session-expired";
  switch (problemType(error)) {
    case "category-has-subcategories":
      return "has-children";
    case "category-in-use":
      return "in-use";
    default:
      return null;
  }
}
