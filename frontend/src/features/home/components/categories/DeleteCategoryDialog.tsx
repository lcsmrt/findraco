import {
  DeleteFinancialTransactionCategoryRequest,
  FinancialTransactionCategory,
} from "@/api/dtos";
import { useDeleteFinancialTransactionCategory } from "@/api/services/useFinancialTransactionCategoryService";
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

export type DeleteState = {
  hasChildren: boolean;
  /** Set once the API reported the category is still referenced. */
  inUse: boolean;
  targetId: number | null;
};

/** The delete to send, or null while the dialog must not submit. */
export const buildDeleteRequest = (
  categoryId: number,
  { hasChildren, inUse, targetId }: DeleteState,
): DeleteFinancialTransactionCategoryRequest | null => {
  if (hasChildren) return null;
  if (inUse) {
    return targetId == null ? null : { id: categoryId, reassignTo: targetId };
  }
  return { id: categoryId };
};

/** Tells the two 409s of a category delete apart. */
export const classifyDeleteError = (
  error: unknown,
): "has-children" | "in-use" | null => {
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

const INITIAL_STATE = { inUse: false, targetId: null, conflict: null };

export const DeleteCategoryDialog = ({
  open,
  onOpenChange,
  category,
  categories,
}: DeleteCategoryDialogProps) => {
  const [{ inUse, targetId, conflict }, setState] = useState<{
    inUse: boolean;
    targetId: number | null;
    conflict: string | null;
  }>(INITIAL_STATE);

  useEffect(() => {
    setState(INITIAL_STATE);
  }, [category, open]);

  const { mutate: deleteCategory, isPending } =
    useDeleteFinancialTransactionCategory({
      showErrorToast: false,
      onSuccess: () => onOpenChange(false),
      onError: (error) => {
        const kind = classifyDeleteError(error);
        const message = resolveErrorMessage({ error });
        if (kind === "in-use") {
          setState((s) => ({ ...s, inUse: true, conflict: message }));
        } else if (kind === "has-children") {
          setState((s) => ({ ...s, conflict: message }));
        } else {
          toast.error(message);
        }
      },
    });

  if (!category) return null;

  const hasChildren =
    categoryHasChildren(category.id, categories) ||
    (conflict != null && !inUse);
  // SPEC_DEVIATION: "in use" is learned from the API's 409, since no endpoint
  // reports reference counts; that first request deletes nothing, so the
  // target is still chosen before any category is removed (CAT-10 AC 17).
  const request = buildDeleteRequest(category.id, {
    hasChildren,
    inUse,
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
              : inUse
                ? "This category is in use. Choose a category to receive its transactions, items and recurrences; then it is deleted."
                : "Are you sure you want to delete this category? This action cannot be undone."}
          </DialogDescription>
        </DialogHeader>

        {conflict && inUse && (
          <p className="text-muted-foreground text-sm">{conflict}</p>
        )}

        {inUse && !hasChildren && (
          <Field>
            <FieldLabel htmlFor="delete-category-target">Move to</FieldLabel>
            <StandardCombobox
              id="delete-category-target"
              items={targets}
              value={selectedTarget}
              onValueChange={(target) =>
                setState((s) => ({ ...s, targetId: target?.id ?? null }))
              }
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
