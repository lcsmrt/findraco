import { FinancialTransactionCategory } from "@/api/dtos";
import type { PlanMember } from "@/api/dtos/plan";
import { usePlanContext } from "@/app/providers/usePlanContext";
import { useGetPlanMembers } from "@/api/services/usePlanService";
import {
  ALL_CATEGORIES_PAGE_SIZE,
  useCreateFinancialTransactionCategory,
  useGetFinancialTransactionCategories,
  useUpdateFinancialTransactionCategory,
} from "@/api/services/useFinancialTransactionCategoryService";
import { Button } from "@/components/button/base/Button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/input/base/Field";
import { Input } from "@/components/input/base/Input";
import { StandardCombobox } from "@/components/input/StandardCombobox";
import { FormField } from "@/components/form/FormField";
import { FormSheet } from "@/components/form/FormSheet";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { TransactionTypeToggle } from "@/components/transactionTypeToggle/TransactionTypeToggle";
import { CategoryLimitFields } from "./CategoryLimitFields";
import {
  CategoryFormOutput,
  CategoryFormValues,
  buildDefaultValues,
  categoryHasChildren,
  createCategoryFormSchema,
  effectiveOwnerId,
  memberLimitShares,
  ownerOptions,
  parentOptions,
  toPayload,
} from "./categoryForm";
import type { CategoryFormDefaults } from "@/hooks/useCategoryFormSheet";
import { DeleteCategoryDialog } from "./DeleteCategoryDialog";

const NO_MEMBERS: PlanMember[] = [];

type CategoryFormSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  category?: FinancialTransactionCategory | null;
  defaults?: CategoryFormDefaults;
  onSuccess?: (category: FinancialTransactionCategory) => void;
  /** Edit footer, narrow screens: opens a create form under this root (UX-02 AC 3). */
  onNewSubcategory?: (root: FinancialTransactionCategory) => void;
};

export const CategoryFormSheet = ({
  open,
  onOpenChange,
  mode,
  category,
  defaults,
  onSuccess,
  onNewSubcategory,
}: CategoryFormSheetProps) => {
  const isEditing = mode === "edit";
  const editing = isEditing ? category : null;

  const { data: categoriesPage } = useGetFinancialTransactionCategories(
    { size: ALL_CATEGORIES_PAGE_SIZE },
    { enabled: open },
  );
  const categories = useMemo(
    () => categoriesPage?.content ?? [],
    [categoriesPage],
  );

  const { activePlanId } = usePlanContext();
  const { data: membersData } = useGetPlanMembers(activePlanId ?? undefined, {
    enabled: open && activePlanId != null,
  });
  const members = membersData ?? NO_MEMBERS;

  const schema = useMemo(
    () => createCategoryFormSchema(categories, editing),
    [categories, editing],
  );

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CategoryFormValues, unknown, CategoryFormOutput>({
    resolver: zodResolver(schema),
    defaultValues: buildDefaultValues(editing, defaults, members, categories),
  });

  useEffect(() => {
    reset(buildDefaultValues(editing, defaults, members, categories));
  }, [editing, defaults, members, categories, open, reset]);

  // Kept after the sheet closes, so the delete dialog outlives it.
  const [deleting, setDeleting] = useState<FinancialTransactionCategory | null>(
    null,
  );

  const { mutate: createCategory, isPending: isCreating } =
    useCreateFinancialTransactionCategory({
      onSuccess: (created) => {
        onSuccess?.(created);
        onOpenChange(false);
      },
    });
  const { mutate: updateCategory, isPending: isUpdating } =
    useUpdateFinancialTransactionCategory({
      onSuccess: (updated) => {
        onSuccess?.(updated);
        onOpenChange(false);
      },
    });
  const isPending = isCreating || isUpdating;

  const onSubmit = (values: CategoryFormOutput) => {
    if (editing) {
      updateCategory({ params: { id: editing.id }, body: toPayload(values) });
    } else {
      createCategory({ body: toPayload(values) });
    }
  };

  const type = watch("type");
  const parentId = watch("parentId");
  const hasChildren =
    editing != null && categoryHasChildren(editing.id, categories);
  const options = parentOptions(categories, type, editing?.id);
  const selectedParent = options.find((c) => c.id === parentId) ?? null;
  const ownerId = watch("ownerId");
  const isOwned = effectiveOwnerId(parentId, ownerId, categories) != null;
  const owners = ownerOptions(members, editing);
  const selectedOwner = owners.find((o) => o.id === ownerId) ?? null;

  return (
    <>
      <FormSheet
        open={open}
        onOpenChange={onOpenChange}
        title={isEditing ? "Edit Category" : "New Category"}
        onSubmit={handleSubmit(onSubmit)}
        isSubmitting={isPending}
        submitLabel={isEditing ? "Save" : "Create"}
        mobileActions={
          editing && (
            <>
              <Button
                variant="outline"
                type="button"
                className="text-destructive hover:text-destructive flex-1"
                disabled={isPending}
                onClick={() => {
                  setDeleting(editing);
                  onOpenChange(false);
                }}
              >
                <Trash2Icon className="h-4 w-4" />
                Delete
              </Button>
              {editing.parentId == null && onNewSubcategory && (
                <Button
                  variant="outline"
                  type="button"
                  className="flex-1"
                  disabled={isPending}
                  onClick={() => onNewSubcategory(editing)}
                >
                  <PlusIcon className="h-4 w-4" />
                  New subcategory
                </Button>
              )}
            </>
          )
        }
      >
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="category-type">Type</FieldLabel>
            <TransactionTypeToggle
              value={type}
              onChange={(v) => {
                setValue("type", v, { shouldValidate: true });
                setValue("parentId", null);
                if (v === "CREDIT") setValue("spendingLimit", null);
              }}
              disabled={isPending || hasChildren}
            />
            {hasChildren && (
              <p className="text-muted-foreground text-xs">
                A category with subcategories cannot change type.
              </p>
            )}
            <FieldError errors={[errors.type]} />
          </Field>

          <FormField control={control} name="description" label="Name">
            {(field) => (
              <Input
                {...field}
                placeholder="e.g., Food, Transport, Entertainment"
                disabled={isPending}
              />
            )}
          </FormField>

          <Field>
            <FieldLabel htmlFor="category-parent">
              Parent{" "}
              <span className="text-muted-foreground font-normal">
                (optional)
              </span>
            </FieldLabel>
            <StandardCombobox
              id="category-parent"
              items={options}
              value={selectedParent}
              onValueChange={(parent) => {
                setValue("parentId", parent?.id ?? null, {
                  shouldValidate: true,
                });
                // A subcategory takes its parent's owner (CAT-15).
                if (parent) setValue("ownerId", null);
              }}
              itemLabel={(c) => c.description}
              placeholder="None (top level)"
              emptyMessage="No top-level categories"
              disabled={isPending || hasChildren}
              clearable
            />
            {hasChildren && (
              <p className="text-muted-foreground text-xs">
                A category with subcategories stays at the top level.
              </p>
            )}
            <FieldError errors={[errors.parentId]} />
          </Field>

          {parentId == null && (
            <Field>
              <FieldLabel htmlFor="category-owner">
                Belongs to{" "}
                <span className="text-muted-foreground font-normal">
                  (optional)
                </span>
              </FieldLabel>
              <StandardCombobox
                id="category-owner"
                items={owners}
                value={selectedOwner}
                onValueChange={(owner) => {
                  setValue("ownerId", owner?.id ?? null, {
                    shouldValidate: true,
                  });
                  // An owned category has a single limit (CAT-13).
                  if (owner) setValue("limitMode", "single");
                }}
                itemLabel={(o) => (o.active ? o.name : `${o.name} (former member)`)}
                placeholder="Shared (everyone)"
                emptyMessage="No members"
                disabled={isPending}
                clearable
              />
              <p className="text-muted-foreground text-xs">
                Its spend and limit are this member's. Subcategories belong
                to the same member.
              </p>
              <FieldError errors={[errors.ownerId]} />
            </Field>
          )}

          {type === "DEBIT" && (
            <CategoryLimitFields
              control={control}
              watch={watch}
              setValue={setValue}
              errors={errors}
              shares={memberLimitShares(watch("memberLimits"))}
              perMemberDisabledReason={
                isOwned
                  ? "A category that belongs to one member has a single limit."
                  : undefined
              }
              disabled={isPending}
            />
          )}
        </FieldGroup>
      </FormSheet>
      <DeleteCategoryDialog
        open={deleting != null}
        onOpenChange={(isOpen) => {
          if (!isOpen) setDeleting(null);
        }}
        category={deleting}
        categories={categories}
      />
    </>
  );
};
