import {
  CategoryUsage,
  DeleteFinancialTransactionCategoryRequest,
  FinancialTransactionCategory,
} from "@/api/dtos";
import {
  useDeleteFinancialTransactionCategory,
  useGetCategoryUsage,
} from "@/api/services/useFinancialTransactionCategoryService";
import { SessionExpiredError } from "@/api/clients/sessionExpiredError";
import { resolveErrorMessage } from "@/api/utils/resolveErrorMessage";
import { Button } from "@/components/button/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/dialog/Dialog";
import { Field, FieldLabel } from "@/components/input/base/Field";
import { StandardCombobox } from "@/components/input/StandardCombobox";
import { AxiosError } from "axios";
import { Trash2Icon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { categoryHasChildren } from "./CategoryFormSheet";

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

type DeleteCategoryDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: FinancialTransactionCategory | null;
  categories: FinancialTransactionCategory[];
};

export const DeleteCategoryDialog = ({
  open,
  onOpenChange,
  category,
  categories,
}: DeleteCategoryDialogProps) => {
  const [targetId, setTargetId] = useState<number | null>(null);
  const [conflict, setConflict] = useState<string | null>(null);

  useEffect(() => {
    setTargetId(null);
    setConflict(null);
  }, [category, open]);

  const {
    data: usage,
    isError: usageFailed,
    refetch: refetchUsage,
  } = useGetCategoryUsage(category?.id ?? null, { enabled: open });

  const { mutate: deleteCategory, isPending } =
    useDeleteFinancialTransactionCategory({
      showErrorToast: false,
      onSuccess: () => onOpenChange(false),
      onError: (error) => {
        const kind = classifyDeleteError(error);
        // The session-expired handler already told the user.
        if (kind === "session-expired") return;
        const message = resolveErrorMessage({ error });
        if (kind == null) {
          toast.error(message);
          return;
        }
        // The category changed since the dialog opened (a child or a reference
        // was added): show why and reload the counts.
        setConflict(message);
        refetchUsage();
      },
    });

  if (!category) return null;

  const hasChildren = categoryHasChildren(category.id, categories);
  const inUse = usage != null && isCategoryInUse(usage);
  const request = buildDeleteRequest(category.id, {
    hasChildren,
    usage: usage ?? null,
    targetId,
  });
  const targets = eligibleDeleteTargets(category, categories);
  const selectedTarget = targets.find((c) => c.id === targetId) ?? null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete &ldquo;{category.description}&rdquo;</DialogTitle>
          <DialogDescription>
            {hasChildren
              ? "This category has subcategories. Move them to another category or delete them before deleting it."
              : usage == null
                ? usageFailed
                  ? "Could not check where this category is used. Close and try again."
                  : "Checking where this category is used..."
                : inUse
                  ? `This category is used by ${describeUsage(usage)}. Choose a category to receive them; then it is deleted.`
                  : "This category is not used by any transaction, item or recurrence definition. Are you sure you want to delete it? This action cannot be undone."}
          </DialogDescription>
        </DialogHeader>

        {conflict && (
          <p className="text-destructive text-sm">{conflict}</p>
        )}

        {inUse && !hasChildren && (
          <Field>
            <FieldLabel htmlFor="delete-category-target">Move to</FieldLabel>
            <StandardCombobox
              id="delete-category-target"
              items={targets}
              value={selectedTarget}
              onValueChange={(target) => setTargetId(target?.id ?? null)}
              itemLabel={(c) => c.description}
              placeholder="Select a category..."
              emptyMessage="No other category of this type"
              disabled={isPending}
            />
          </Field>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            type="button"
            disabled={isPending}
            onClick={() => onOpenChange(false)}
          >
            <XIcon className="h-4 w-4" />
            {hasChildren ? "Close" : "Cancel"}
          </Button>
          {!hasChildren && (
            <Button
              type="button"
              variant="destructive"
              isLoading={isPending}
              disabled={request == null}
              onClick={() => request && deleteCategory(request)}
            >
              <Trash2Icon className="h-4 w-4" />
              {inUse ? "Move and delete" : "Delete"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
