import { SessionExpiredError } from "@/api/clients/sessionExpiredError";
import {
  CategoryUsage,
  DeleteCategoryRequest,
  Category,
} from "@/api/dtos";
import { problemType } from "@/api/utils/problems";

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
  function count(n: number, one: string, many: string) {
    return `${n} ${n === 1 ? one : many}`;
  }
  return `${count(transactions, "transaction", "transactions")}, ${count(items, "item", "items")} and ${count(recurrenceDefinitions, "recurrence definition", "recurrence definitions")}`;
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
