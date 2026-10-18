import { SessionExpiredError } from "@/api/clients/sessionExpiredError";
import {
  CategoryUsage,
  DeleteFinancialTransactionCategoryRequest,
  FinancialTransactionCategory,
} from "@/api/dtos";
import { resolveErrorMessage } from "@/api/utils/resolveErrorMessage";
import { AxiosError } from "axios";

/** Categories that can receive a deleted category's references: same type, not itself, not its children. */
export const eligibleDeleteTargets = (
  category: FinancialTransactionCategory,
  categories: FinancialTransactionCategory[],
) =>
  categories
    .filter(
      (c) =>
        c.type === category.type &&
        c.id !== category.id &&
        c.parentId !== category.id,
    )
    .sort((a, b) => a.description.localeCompare(b.description));

/** True when any transaction, item or recurrence definition still uses the category. */
export const isCategoryInUse = ({
  transactions,
  items,
  recurrenceDefinitions,
}: CategoryUsage) => transactions + items + recurrenceDefinitions > 0;

export type DeleteState = {
  hasChildren: boolean;
  /** Usage counts from the API; null while they load. */
  usage: CategoryUsage | null;
  targetId: number | null;
};

/** The delete to send, or null while the dialog must not submit. */
export const buildDeleteRequest = (
  categoryId: number,
  { hasChildren, usage, targetId }: DeleteState,
): DeleteFinancialTransactionCategoryRequest | null => {
  if (hasChildren || usage == null) return null;
  if (isCategoryInUse(usage)) {
    return targetId == null ? null : { id: categoryId, reassignTo: targetId };
  }
  return { id: categoryId };
};

/** "3 transactions, 1 item and 0 recurrence definitions" for the dialog. */
export const describeUsage = ({
  transactions,
  items,
  recurrenceDefinitions,
}: CategoryUsage) => {
  const count = (n: number, one: string, many: string) =>
    `${n} ${n === 1 ? one : many}`;
  return `${count(transactions, "transaction", "transactions")}, ${count(items, "item", "items")} and ${count(recurrenceDefinitions, "recurrence definition", "recurrence definitions")}`;
};

/** Tells the two 409s of a category delete apart. */
export const classifyDeleteError = (
  error: unknown,
): "has-children" | "in-use" | "session-expired" | null => {
  if (error instanceof SessionExpiredError) return "session-expired";
  if (!(error instanceof AxiosError) || error.response?.status !== 409) {
    return null;
  }
  const message = resolveErrorMessage({ error });
  return message.includes("subcategories") ? "has-children" : "in-use";
};
