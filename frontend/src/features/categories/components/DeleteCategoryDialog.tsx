import { Category } from "@/api/dtos";
import { useDeleteCategory, useGetCategoryUsage } from "@/api/services/useCategoryService";
import { problemMessage, problemToast } from "@/api/utils/problems";
import { Button } from "@/components/button/base/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/dialog/base/Dialog";
import { Field, FieldLabel } from "@/components/input/base/Field";
import { StandardCombobox } from "@/components/input/StandardCombobox";
import { Text } from "@/components/typography/base/Text";
import { Trash2Icon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  buildDeleteRequest,
  classifyDeleteError,
  describeDeletion,
  eligibleDeleteTargets,
  isCategoryInUse,
} from "../utils/categoryDeletion";
import { categoryHasChildren } from "./categoryForm";
import { useTranslation } from "react-i18next";

type DeleteCategoryDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category | null;
  categories: Category[];
};

export function DeleteCategoryDialog({
  open,
  onOpenChange,
  category,
  categories,
}: DeleteCategoryDialogProps) {
  const { t } = useTranslation();

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

  const { mutate: deleteCategory, isPending } = useDeleteCategory({
    showErrorToast: false,
    onSuccess: () => onOpenChange(false),
    onError: (error) => {
      const kind = classifyDeleteError(error);
      // The session-expired handler already told the user.
      if (kind === "session-expired") return;
      if (kind == null) {
        const { message, description } = problemToast(error);
        toast.error(message, description ? { description } : undefined);
        return;
      }
      // The category changed since the dialog opened (a child or a reference
      // was added): show why and reload the counts.
      setConflict(problemMessage(error));
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
          <DialogTitle>
            {t("categories.deleteCategoryDialog.deleteCategory", { name: category.description })}
          </DialogTitle>
          <DialogDescription>
            {describeDeletion({ hasChildren, usage, usageFailed })}
          </DialogDescription>
        </DialogHeader>

        {conflict && (
          <Text as="p" className="text-destructive">
            {conflict}
          </Text>
        )}

        {inUse && !hasChildren && (
          <Field>
            <FieldLabel htmlFor="delete-category-target">
              {t("categories.deleteCategoryDialog.moveTo")}
            </FieldLabel>
            <StandardCombobox
              id="delete-category-target"
              items={targets}
              value={selectedTarget}
              onValueChange={(target) => setTargetId(target?.id ?? null)}
              itemLabel={(c) => c.description}
              placeholder={t("categories.deleteCategoryDialog.selectACategory")}
              emptyMessage={t("categories.deleteCategoryDialog.noOtherCategory")}
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
            {hasChildren ? t("common.close") : t("common.cancel")}
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
              {inUse ? t("categories.deleteCategoryDialog.moveAndDelete") : t("common.delete")}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
