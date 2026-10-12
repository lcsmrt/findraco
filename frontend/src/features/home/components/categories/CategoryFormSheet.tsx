import {
  CreateFinancialTransactionCategoryRequest,
  FinancialTransactionCategory,
} from "@/api/dtos";
import { FinancialTransactionType } from "@/api/dtos/financialTransaction";
import {
  useCreateFinancialTransactionCategory,
  useGetFinancialTransactionCategories,
  useUpdateFinancialTransactionCategory,
} from "@/api/services/useFinancialTransactionCategoryService";
import { Button } from "@/components/button/Button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/input/base/Field";
import { Input } from "@/components/input/base/Input";
import { StandardCombobox } from "@/components/input/StandardCombobox";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/sheet/Sheet";
import { maskCurrency } from "@/utils/string/masks";
import { zodResolver } from "@hookform/resolvers/zod";
import { SaveIcon, XIcon } from "lucide-react";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { TransactionTypeToggle } from "../transactions/TransactionTypeToggle";

/** Page size large enough to hold every category of a plan (≈25 in practice). */
export const ALL_CATEGORIES_PAGE_SIZE = 100;

export const categoryHasChildren = (
  categoryId: number,
  categories: FinancialTransactionCategory[],
) => categories.some((c) => c.parentId === categoryId);

/** Categories that can be the parent of `editingId`: roots of `type`, never itself. */
export const parentOptions = (
  categories: FinancialTransactionCategory[],
  type: FinancialTransactionType,
  editingId?: number,
) =>
  categories
    .filter((c) => c.parentId == null && c.type === type && c.id !== editingId)
    .sort((a, b) => a.description.localeCompare(b.description));

const categoryFormBaseSchema = z.object({
  type: z.enum(["DEBIT", "CREDIT"]),
  description: z.string().trim().min(1, "Name is required"),
  parentId: z.number().nullable(),
  spendingLimit: z.string(),
});

export type CategoryFormValues = z.infer<typeof categoryFormBaseSchema>;

/**
 * Hierarchy rules the API enforces, checked up front: a category with
 * subcategories keeps its type and stays a root; a parent must be a root of
 * the same type.
 */
export const createCategoryFormSchema = (
  categories: FinancialTransactionCategory[],
  editing?: FinancialTransactionCategory | null,
) =>
  categoryFormBaseSchema.superRefine((values, ctx) => {
    const hasChildren =
      editing != null && categoryHasChildren(editing.id, categories);
    if (hasChildren && values.type !== editing.type) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "A category with subcategories cannot change type",
        path: ["type"],
      });
    }
    if (values.parentId == null) return;
    if (hasChildren) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "A category with subcategories cannot have a parent",
        path: ["parentId"],
      });
      return;
    }
    const allowed = parentOptions(categories, values.type, editing?.id);
    if (!allowed.some((c) => c.id === values.parentId)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Choose a top-level category of the same type",
        path: ["parentId"],
      });
    }
  });

export type CategoryFormDefaults = {
  description?: string;
  type?: FinancialTransactionType;
};

export const buildDefaultValues = (
  category?: FinancialTransactionCategory | null,
  defaults?: CategoryFormDefaults,
): CategoryFormValues => {
  if (category) {
    return {
      type: category.type,
      description: category.description,
      parentId: category.parentId ?? null,
      spendingLimit:
        category.spendingLimit != null
          ? maskCurrency(String(Math.round(category.spendingLimit * 100)))
          : "",
    };
  }
  return {
    type: defaults?.type ?? "DEBIT",
    description: defaults?.description ?? "",
    parentId: null,
    spendingLimit: "",
  };
};

const parseLimit = (masked: string): number | undefined => {
  const digits = masked.replace(/\D/g, "");
  return digits ? parseInt(digits, 10) / 100 : undefined;
};

export const toPayload = (
  values: CategoryFormValues,
): CreateFinancialTransactionCategoryRequest["body"] => ({
  type: values.type,
  description: values.description.trim(),
  parentId: values.parentId,
  // Income categories carry no limit.
  spendingLimit:
    values.type === "DEBIT" ? parseLimit(values.spendingLimit) : undefined,
});

type CategoryFormSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  category?: FinancialTransactionCategory | null;
  defaults?: CategoryFormDefaults;
  onSuccess?: (category: FinancialTransactionCategory) => void;
};

export const CategoryFormSheet = ({
  open,
  onOpenChange,
  mode,
  category,
  defaults,
  onSuccess,
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

  const schema = useMemo(
    () => createCategoryFormSchema(categories, editing),
    [categories, editing],
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(schema),
    defaultValues: buildDefaultValues(editing, defaults),
  });

  useEffect(() => {
    reset(buildDefaultValues(editing, defaults));
  }, [editing, defaults, open, reset]);

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

  const onSubmit = (values: CategoryFormValues) => {
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

  const { onChange: onLimitChange, ...limitRest } = register("spendingLimit");

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>{isEditing ? "Edit Category" : "New Category"}</SheetTitle>
        </SheetHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-4 pb-2"
        >
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="category-type">Type</FieldLabel>
              <TransactionTypeToggle
                value={type}
                onChange={(v) => {
                  setValue("type", v, { shouldValidate: true });
                  setValue("parentId", null);
                  if (v === "CREDIT") setValue("spendingLimit", "");
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

            <Field>
              <FieldLabel htmlFor="category-description">Name</FieldLabel>
              <Input
                id="category-description"
                placeholder="e.g., Food, Transport, Entertainment"
                disabled={isPending}
                aria-invalid={!!errors.description}
                {...register("description")}
              />
              <FieldError errors={[errors.description]} />
            </Field>

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
                onValueChange={(parent) =>
                  setValue("parentId", parent?.id ?? null, {
                    shouldValidate: true,
                  })
                }
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

            {type === "DEBIT" && (
              <Field>
                <FieldLabel htmlFor="category-spending-limit">
                  Monthly Limit{" "}
                  <span className="text-muted-foreground font-normal">
                    (optional)
                  </span>
                </FieldLabel>
                <Input
                  id="category-spending-limit"
                  type="text"
                  inputMode="numeric"
                  placeholder="R$ 0,00"
                  disabled={isPending}
                  {...limitRest}
                  onChange={(e) => {
                    e.target.value = maskCurrency(e.target.value);
                    onLimitChange(e);
                  }}
                />
              </Field>
            )}
          </FieldGroup>
        </form>

        <SheetFooter>
          <Button
            variant="outline"
            type="button"
            disabled={isPending}
            onClick={() => onOpenChange(false)}
          >
            <XIcon className="h-4 w-4" />
            Cancel
          </Button>
          <Button
            type="button"
            isLoading={isPending}
            onClick={handleSubmit(onSubmit)}
          >
            <SaveIcon className="h-4 w-4" />
            {isEditing ? "Save" : "Create"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

type CategoryFormSheetContextValue = {
  openCreate: (
    defaults?: CategoryFormDefaults,
  ) => Promise<FinancialTransactionCategory | null>;
  openEdit: (
    category: FinancialTransactionCategory,
  ) => Promise<FinancialTransactionCategory | null>;
};

const CategoryFormSheetContext =
  createContext<CategoryFormSheetContextValue | null>(null);

export const useCategoryFormSheet = () => {
  const ctx = useContext(CategoryFormSheetContext);
  if (!ctx)
    throw new Error(
      "useCategoryFormSheet must be used within CategoryFormSheetProvider",
    );
  return ctx;
};

type SheetState =
  | { open: false }
  | { open: true; mode: "create"; defaults?: CategoryFormDefaults }
  | { open: true; mode: "edit"; category: FinancialTransactionCategory };

type CategoryFormSheetProviderProps = {
  children: ReactNode;
};

/** One category form for the app; callers await the saved category (or null on cancel). */
export const CategoryFormSheetProvider = ({
  children,
}: CategoryFormSheetProviderProps) => {
  const [state, setState] = useState<SheetState>({ open: false });
  const resolverRef = useRef<
    ((category: FinancialTransactionCategory | null) => void) | null
  >(null);

  const openWith = (next: SheetState) => {
    resolverRef.current?.(null);
    setState(next);
    return new Promise<FinancialTransactionCategory | null>((resolve) => {
      resolverRef.current = resolve;
    });
  };

  const value: CategoryFormSheetContextValue = {
    openCreate: (defaults) => openWith({ open: true, mode: "create", defaults }),
    openEdit: (category) => openWith({ open: true, mode: "edit", category }),
  };

  const handleSuccess = (saved: FinancialTransactionCategory) => {
    resolverRef.current?.(saved);
    resolverRef.current = null;
  };

  const handleClose = () => {
    resolverRef.current?.(null);
    resolverRef.current = null;
    setState({ open: false });
  };

  return (
    <CategoryFormSheetContext.Provider value={value}>
      {children}
      <CategoryFormSheet
        open={state.open}
        onOpenChange={(isOpen) => !isOpen && handleClose()}
        mode={state.open ? state.mode : "create"}
        category={state.open && state.mode === "edit" ? state.category : null}
        defaults={
          state.open && state.mode === "create" ? state.defaults : undefined
        }
        onSuccess={handleSuccess}
      />
    </CategoryFormSheetContext.Provider>
  );
};
