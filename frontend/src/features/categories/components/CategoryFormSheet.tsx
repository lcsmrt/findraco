import { FinancialTransactionCategory } from "@/api/dtos";
import type { PlanMember } from "@/api/dtos/plan";
import { usePlanContext } from "@/app/providers/usePlanContext";
import { useGetPlanMembers } from "@/api/services/usePlanService";
import {
  ALL_CATEGORIES_PAGE_SIZE,
  useGetFinancialTransactionCategories,
} from "@/api/services/useFinancialTransactionCategoryService";
import { Button } from "@/components/button/base/Button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/input/base/Field";
import { Input } from "@/components/input/base/Input";
import { StandardCombobox } from "@/components/input/StandardCombobox";
import { FormField } from "@/components/form/FormField";
import { FormSheet } from "@/components/form/FormSheet";
import { Text } from "@/components/typography/base/Text";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm, useWatch, type Control, type UseFormSetValue } from "react-hook-form";
import { TransactionTypeToggle } from "@/components/transactionTypeToggle/TransactionTypeToggle";
import { CategoryLimitFields } from "./CategoryLimitFields";
import {
  CategoryFormOutput,
  CategoryFormValues,
  buildDefaultValues,
  categoryHasChildren,
  createCategoryFormSchema,
  effectiveOwnerId,
  ownerOptions,
  parentOptions,
} from "./categoryForm";
import type { CategoryFormDefaults } from "@/hooks/useCategoryFormSheet";
import { DeleteCategoryDialog } from "./DeleteCategoryDialog";
import { useCategoryFormSubmit } from "./useCategoryFormSubmit";

const NO_MEMBERS: PlanMember[] = [];

type CategoryFormControl = Control<CategoryFormValues, unknown, CategoryFormOutput>;

type CategoryFormSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  category?: FinancialTransactionCategory | null;
  defaults?: CategoryFormDefaults;
  onSuccess?: (category: FinancialTransactionCategory) => void;
  /** Edit footer, narrow screens: opens a create form under this root. */
  onNewSubcategory?: (root: FinancialTransactionCategory) => void;
};

export function CategoryFormSheet({
  open,
  onOpenChange,
  mode,
  category,
  defaults,
  onSuccess,
  onNewSubcategory,
}: CategoryFormSheetProps) {
  const editing = mode === "edit" ? category : null;

  const { data: categoriesPage } = useGetFinancialTransactionCategories(
    { size: ALL_CATEGORIES_PAGE_SIZE },
    { enabled: open },
  );
  const categories = useMemo(() => categoriesPage?.content ?? [], [categoriesPage]);

  const { activePlanId } = usePlanContext();
  const { data: membersData } = useGetPlanMembers(activePlanId ?? undefined, {
    enabled: open && activePlanId != null,
  });
  const members = membersData ?? NO_MEMBERS;

  const schema = useMemo(() => createCategoryFormSchema(categories, editing), [categories, editing]);

  const { control, handleSubmit, setValue, reset } = useForm<
    CategoryFormValues,
    unknown,
    CategoryFormOutput
  >({
    resolver: zodResolver(schema),
    defaultValues: buildDefaultValues(editing, defaults, members, categories),
  });

  useEffect(() => {
    reset(buildDefaultValues(editing, defaults, members, categories));
  }, [editing, defaults, members, categories, open, reset]);

  // Kept after the sheet closes, so the delete dialog outlives it.
  const [deleting, setDeleting] = useState<FinancialTransactionCategory | null>(null);

  const { submit, isSubmitting: isPending } = useCategoryFormSubmit({
    editing,
    onSuccess,
    onDone: () => onOpenChange(false),
  });

  const hasChildren = editing != null && categoryHasChildren(editing.id, categories);
  const sectionProps = { control, setValue, categories, disabled: isPending };

  return (
    <>
      <FormSheet
        open={open}
        onOpenChange={onOpenChange}
        title={editing ? "Edit Category" : "New Category"}
        onSubmit={handleSubmit(submit)}
        isSubmitting={isPending}
        submitLabel={editing ? "Save" : "Create"}
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
          <TypeField {...sectionProps} hasChildren={hasChildren} />

          <FormField control={control} name="description" label="Name">
            {(field) => (
              <Input
                {...field}
                placeholder="e.g., Food, Transport, Entertainment"
                disabled={isPending}
              />
            )}
          </FormField>

          <ParentField {...sectionProps} editing={editing} hasChildren={hasChildren} />
          <OwnerField {...sectionProps} editing={editing} members={members} />
          <LimitSection {...sectionProps} />
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
}

type SectionProps = {
  control: CategoryFormControl;
  setValue: UseFormSetValue<CategoryFormValues>;
  categories: FinancialTransactionCategory[];
  disabled: boolean;
};

function TypeField({ control, setValue, disabled, hasChildren }: SectionProps & { hasChildren: boolean }) {
  return (
    // The toggle group names itself, a layout FormField's label-for-input does not fit.
    <Controller
      control={control}
      name="type"
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel>Type</FieldLabel>
          <TransactionTypeToggle
            value={field.value}
            onChange={(type) => {
              field.onChange(type);
              // Parents belong to one type, and income categories carry no limit.
              setValue("parentId", null);
              if (type === "CREDIT") setValue("spendingLimit", null);
            }}
            disabled={disabled || hasChildren}
          />
          {hasChildren && (
            <FieldDescription>
              A category with subcategories cannot change type.
            </FieldDescription>
          )}
          <FieldError errors={[fieldState.error]} />
        </Field>
      )}
    />
  );
}

type ParentFieldProps = SectionProps & {
  editing: FinancialTransactionCategory | null | undefined;
  hasChildren: boolean;
};

function ParentField({ control, setValue, categories, disabled, editing, hasChildren }: ParentFieldProps) {
  const type = useWatch({ control, name: "type" });
  const options = parentOptions(categories, type, editing?.id);

  return (
    <FormField
      control={control}
      name="parentId"
      label={
        <>
          Parent <Text variant="secondary">(optional)</Text>
        </>
      }
      description={hasChildren ? "A category with subcategories stays at the top level." : undefined}
    >
      {(field) => (
        <StandardCombobox
          id={field.id}
          items={options}
          value={options.find((option) => option.id === field.value) ?? null}
          onValueChange={(parent) => {
            field.onChange(parent?.id ?? null);
            // A subcategory takes its parent's owner. The owner field hides once a parent is set, so a
            // choice left here would fail validation on a field the user can no longer see.
            if (parent) setValue("ownerId", null);
          }}
          itemLabel={(option) => option.description}
          placeholder="None (top level)"
          emptyMessage="No top-level categories"
          disabled={disabled || hasChildren}
          clearable
        />
      )}
    </FormField>
  );
}

type OwnerFieldProps = SectionProps & {
  editing: FinancialTransactionCategory | null | undefined;
  members: PlanMember[];
};

function OwnerField({ control, setValue, disabled, editing, members }: OwnerFieldProps) {
  const parentId = useWatch({ control, name: "parentId" });
  const owners = ownerOptions(members, editing);
  if (parentId != null) return null;

  return (
    <FormField
      control={control}
      name="ownerId"
      label={
        <>
          Belongs to <Text variant="secondary">(optional)</Text>
        </>
      }
      description="Its spend and limit are this member's. Subcategories belong to the same member."
    >
      {(field) => (
        <StandardCombobox
          id={field.id}
          items={owners}
          value={owners.find((owner) => owner.id === field.value) ?? null}
          onValueChange={(owner) => {
            field.onChange(owner?.id ?? null);
            // An owned category has a single limit. The toggle already shows Single, but a stored
            // per-member mode would still fail validation on save.
            if (owner) setValue("limitMode", "single");
          }}
          itemLabel={(owner) => (owner.active ? owner.name : `${owner.name} (former member)`)}
          placeholder="Shared (everyone)"
          emptyMessage="No members"
          disabled={disabled}
          clearable
        />
      )}
    </FormField>
  );
}

function LimitSection({ control, categories, disabled }: SectionProps) {
  const [type, parentId, ownerId] = useWatch({ control, name: ["type", "parentId", "ownerId"] });
  if (type !== "DEBIT") return null;
  const isOwned = effectiveOwnerId(parentId, ownerId, categories) != null;

  return (
    <CategoryLimitFields
      control={control}
      perMemberDisabledReason={
        isOwned ? "A category that belongs to one member has a single limit." : undefined
      }
      disabled={disabled}
    />
  );
}
