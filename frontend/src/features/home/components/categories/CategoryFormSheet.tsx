import {
  CreateFinancialTransactionCategoryRequest,
  FinancialTransactionCategory,
} from "@/api/dtos";
import { FinancialTransactionType } from "@/api/dtos/financialTransaction";
import type { PlanMember } from "@/api/dtos/plan";
import { usePlanContext } from "@/app/providers/PlanProvider";
import { useGetPlanMembers } from "@/api/services/usePlanService";
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
import { PlusIcon, SaveIcon, Trash2Icon, XIcon } from "lucide-react";
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
import { CategoryLimitFields } from "./CategoryLimitFields";
import { DeleteCategoryDialog } from "./DeleteCategoryDialog";

const NO_MEMBERS: PlanMember[] = [];

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

/** The owner a category would have: a child inherits its parent's (CAT-15). */
export const effectiveOwnerId = (
  parentId: number | null,
  ownerId: number | null,
  categories: FinancialTransactionCategory[],
): number | null => {
  if (parentId != null) {
    return categories.find((c) => c.id === parentId)?.ownerId ?? null;
  }
  return ownerId;
};

export type OwnerOption = { id: number; name: string; active: boolean };

/**
 * Members a root can belong to: the active members, plus the current owner
 * when they left the plan, so the OWNER can keep that ownership (CAT-14).
 */
export const ownerOptions = (
  members: PlanMember[],
  category?: FinancialTransactionCategory | null,
): OwnerOption[] => {
  const options: OwnerOption[] = members
    .map((member) => ({ id: member.userId, name: member.name, active: true }))
    .sort((a, b) => a.name.localeCompare(b.name));
  const ownerId = category?.parentId == null ? category?.ownerId : null;
  if (ownerId != null && !options.some((o) => o.id === ownerId)) {
    options.push({ id: ownerId, name: category?.ownerName ?? "", active: false });
  }
  return options;
};

const memberLimitRowSchema = z.object({
  memberId: z.number(),
  memberName: z.string(),
  /** Masked currency; empty = no individual limit for this member. */
  amount: z.string(),
  /** false = a former member's dormant entry (kept or removed, never edited). */
  active: z.boolean(),
});

export type MemberLimitRow = z.infer<typeof memberLimitRowSchema>;

const categoryFormBaseSchema = z.object({
  type: z.enum(["DEBIT", "CREDIT"]),
  description: z.string().trim().min(1, "Name is required"),
  parentId: z.number().nullable(),
  ownerId: z.number().nullable(),
  spendingLimit: z.string(),
  limitMode: z.enum(["single", "perMember"]),
  memberLimits: z.array(memberLimitRowSchema),
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
    refineMemberLimits(values, ctx, categories);
    if (values.parentId != null && values.ownerId != null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "A subcategory has its parent's owner",
        path: ["ownerId"],
      });
    }
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

/** Per-member limit rules the API enforces (CAT-13), checked up front. */
const refineMemberLimits = (
  values: CategoryFormValues,
  ctx: z.RefinementCtx,
  categories: FinancialTransactionCategory[],
) => {
  if (values.limitMode !== "perMember") return;
  if (values.type === "CREDIT") {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Income categories cannot have per-member limits",
      path: ["limitMode"],
    });
    return;
  }
  if (effectiveOwnerId(values.parentId, values.ownerId, categories) != null) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "A category that belongs to one member cannot have per-member limits",
      path: ["limitMode"],
    });
    return;
  }
  const seen = new Set<number>();
  values.memberLimits.forEach((row, index) => {
    if (seen.has(row.memberId)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Each member can have only one limit",
        path: ["memberLimits", index, "memberId"],
      });
    }
    seen.add(row.memberId);
    if (row.amount.trim().startsWith("-")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Amount cannot be negative",
        path: ["memberLimits", index, "amount"],
      });
    }
  });
};

const parseLimit = (masked: string): number | undefined => {
  const digits = masked.replace(/\D/g, "");
  return digits ? parseInt(digits, 10) / 100 : undefined;
};

const maskAmount = (amount: number) =>
  maskCurrency(String(Math.round(amount * 100)));

/**
 * Each active member's read-only share of the per-member total, in percent
 * (one decimal). Former members and members without an amount have no share.
 */
export const memberLimitShares = (
  rows: MemberLimitRow[],
): Map<number, number> => {
  const amounts = rows
    .filter((row) => row.active)
    .map((row) => ({ memberId: row.memberId, amount: parseLimit(row.amount) }))
    .filter((row): row is { memberId: number; amount: number } => row.amount != null);
  const total = amounts.reduce((sum, row) => sum + row.amount, 0);
  const shares = new Map<number, number>();
  amounts.forEach((row) =>
    shares.set(
      row.memberId,
      total === 0 ? 0 : Math.round((row.amount / total) * 1000) / 10,
    ),
  );
  return shares;
};

/**
 * One row per active member (with their stored amount, if any), then the
 * stored entries of former members.
 */
export const buildMemberLimitRows = (
  category: FinancialTransactionCategory | null | undefined,
  members: PlanMember[],
): MemberLimitRow[] => {
  const stored = category?.memberLimits ?? [];
  const activeRows: MemberLimitRow[] = members
    .map((member) => {
      const entry = stored.find((e) => e.memberId === member.userId);
      return {
        memberId: member.userId,
        memberName: member.name,
        amount: entry ? maskAmount(entry.amount) : "",
        active: true,
      };
    })
    .sort((a, b) => a.memberName.localeCompare(b.memberName));
  const listed = new Set(activeRows.map((row) => row.memberId));
  const otherRows: MemberLimitRow[] = stored
    .filter((entry) => !listed.has(entry.memberId))
    .map((entry) => ({
      memberId: entry.memberId,
      memberName: entry.memberName,
      amount: maskAmount(entry.amount),
      active: entry.active,
    }));
  return [...activeRows, ...otherRows];
};

export type CategoryFormDefaults = {
  description?: string;
  type?: FinancialTransactionType;
  /** Starts a subcategory of this root; the type follows the parent (UX-02 AC 2). */
  parentId?: number;
};

export const buildDefaultValues = (
  category?: FinancialTransactionCategory | null,
  defaults?: CategoryFormDefaults,
  members: PlanMember[] = [],
  categories: FinancialTransactionCategory[] = [],
): CategoryFormValues => {
  const memberLimits = buildMemberLimitRows(category, members);
  if (category) {
    return {
      type: category.type,
      description: category.description,
      parentId: category.parentId ?? null,
      // A child reports its parent's owner; only a root's owner is its own.
      ownerId: category.parentId == null ? (category.ownerId ?? null) : null,
      spendingLimit:
        category.spendingLimit != null ? maskAmount(category.spendingLimit) : "",
      limitMode: category.memberLimits?.length ? "perMember" : "single",
      memberLimits,
    };
  }
  const parent =
    defaults?.parentId != null
      ? categories.find((c) => c.id === defaults.parentId)
      : undefined;
  return {
    type: defaults?.type ?? parent?.type ?? "DEBIT",
    description: defaults?.description ?? "",
    parentId: defaults?.parentId ?? null,
    ownerId: null,
    spendingLimit: "",
    limitMode: "single",
    memberLimits,
  };
};

/**
 * Per member mode sends every row with an amount (former members' entries
 * included, unchanged) and no plain limit; single mode sends the plain limit
 * and clears the per-member entries.
 */
export const toPayload = (
  values: CategoryFormValues,
): CreateFinancialTransactionCategoryRequest["body"] => {
  const perMember = values.type === "DEBIT" && values.limitMode === "perMember";
  return {
    type: values.type,
    description: values.description.trim(),
    parentId: values.parentId,
    ownerId: values.parentId == null ? values.ownerId : null,
    // Income categories carry no limit.
    spendingLimit:
      values.type === "DEBIT" && !perMember
        ? parseLimit(values.spendingLimit)
        : undefined,
    memberLimits: perMember
      ? values.memberLimits.flatMap((row) => {
          const amount = parseLimit(row.amount);
          return amount == null ? [] : [{ memberId: row.memberId, amount }];
        })
      : [],
  };
};

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
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CategoryFormValues>({
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
  const ownerId = watch("ownerId");
  const isOwned = effectiveOwnerId(parentId, ownerId, categories) != null;
  const owners = ownerOptions(members, editing);
  const selectedOwner = owners.find((o) => o.id === ownerId) ?? null;

  return (
    <>
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
                  register={register}
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
          </form>

          <SheetFooter>
            {editing && (
              <div className="flex gap-2 sm:hidden">
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
              </div>
            )}
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
        onNewSubcategory={(root) =>
          void openWith({
            open: true,
            mode: "create",
            defaults: { parentId: root.id },
          })
        }
      />
    </CategoryFormSheetContext.Provider>
  );
};
