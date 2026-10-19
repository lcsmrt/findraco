import {
  CreateFinancialTransactionCategoryRequest,
  FinancialTransactionCategory,
} from "@/api/dtos";
import { FinancialTransactionType } from "@/api/dtos/financialTransaction";
import type { PlanMember } from "@/api/dtos/plan";
import type { CategoryFormDefaults } from "@/hooks/useCategoryFormSheet";
import { toCents } from "@/utils/money";
import { z } from "zod";

export function categoryHasChildren(
  categoryId: number,
  categories: FinancialTransactionCategory[],
) {
  return categories.some((c) => c.parentId === categoryId);
}

/** Categories that can be the parent of `editingId`: roots of `type`, never itself. */
export function parentOptions(
  categories: FinancialTransactionCategory[],
  type: FinancialTransactionType,
  editingId?: number,
) {
  return categories
    .filter((c) => c.parentId == null && c.type === type && c.id !== editingId)
    .sort((a, b) => a.description.localeCompare(b.description));
}

/** The owner a category would have: a child inherits its parent's (CAT-15). */
export function effectiveOwnerId(
  parentId: number | null,
  ownerId: number | null,
  categories: FinancialTransactionCategory[],
): number | null {
  if (parentId != null) {
    return categories.find((c) => c.id === parentId)?.ownerId ?? null;
  }
  return ownerId;
}

export type OwnerOption = { id: number; name: string; active: boolean };

/**
 * Members a root can belong to: the active members, plus the current owner
 * when they left the plan, so the OWNER can keep that ownership (CAT-14).
 */
export function ownerOptions(
  members: PlanMember[],
  category?: FinancialTransactionCategory | null,
): OwnerOption[] {
  const options: OwnerOption[] = members
    .map((member) => ({ id: member.userId, name: member.name, active: true }))
    .sort((a, b) => a.name.localeCompare(b.name));
  const ownerId = category?.parentId == null ? category?.ownerId : null;
  if (ownerId != null && !options.some((o) => o.id === ownerId)) {
    options.push({ id: ownerId, name: category?.ownerName ?? "", active: false });
  }
  return options;
}

const memberLimitRowSchema = z.object({
  memberId: z.number(),
  memberName: z.string(),
  /** Reais; `null` = no individual limit for this member. */
  amount: z.number().nullable(),
  /** false = a former member's dormant entry (kept or removed, never edited). */
  active: z.boolean(),
});

export type MemberLimitRow = z.input<typeof memberLimitRowSchema>;

const categoryFormBaseSchema = z.object({
  type: z.enum(["DEBIT", "CREDIT"]),
  description: z.string().trim().min(1, "Name is required"),
  parentId: z.number().nullable(),
  ownerId: z.number().nullable(),
  /** Reais; `null` = no limit. */
  spendingLimit: z.number().nullable(),
  limitMode: z.enum(["single", "perMember"]),
  memberLimits: z.array(memberLimitRowSchema),
});

/** What the fields hold while editing: limits in reais, `null` when empty. */
export type CategoryFormValues = z.input<typeof categoryFormBaseSchema>;

/** What a valid submit hands over; no field narrows, so it matches the values. */
export type CategoryFormOutput = z.output<typeof categoryFormBaseSchema>;

/**
 * Hierarchy rules the API enforces, checked up front: a category with
 * subcategories keeps its type and stays a root; a parent must be a root of
 * the same type.
 */
export function createCategoryFormSchema(
  categories: FinancialTransactionCategory[],
  editing?: FinancialTransactionCategory | null,
) {
  return categoryFormBaseSchema.superRefine((values, ctx) => {
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
}

/** Per-member limit rules the API enforces (CAT-13), checked up front. */
function refineMemberLimits(
  values: CategoryFormValues,
  ctx: z.RefinementCtx,
  categories: FinancialTransactionCategory[],
) {
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
    if (row.amount != null && row.amount < 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Amount cannot be negative",
        path: ["memberLimits", index, "amount"],
      });
    }
  });
}

/**
 * Each active member's read-only share of the per-member total, in percent
 * (one decimal). Former members and members without an amount have no share.
 */
export function memberLimitShares(
  rows: MemberLimitRow[],
): Map<number, number> {
  const amounts = rows
    .filter((row) => row.active)
    .flatMap((row) =>
      row.amount == null ? [] : [{ memberId: row.memberId, cents: toCents(row.amount) }],
    );
  const total = amounts.reduce((sum, row) => sum + row.cents, 0);
  const shares = new Map<number, number>();
  amounts.forEach((row) =>
    shares.set(
      row.memberId,
      total === 0 ? 0 : Math.round((row.cents / total) * 1000) / 10,
    ),
  );
  return shares;
}

/**
 * One row per active member (with their stored amount, if any), then the
 * stored entries of former members.
 */
export function buildMemberLimitRows(
  category: FinancialTransactionCategory | null | undefined,
  members: PlanMember[],
): MemberLimitRow[] {
  const stored = category?.memberLimits ?? [];
  const activeRows: MemberLimitRow[] = members
    .map((member) => {
      const entry = stored.find((e) => e.memberId === member.userId);
      return {
        memberId: member.userId,
        memberName: member.name,
        amount: entry ? entry.amount : null,
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
      amount: entry.amount,
      active: entry.active,
    }));
  return [...activeRows, ...otherRows];
}

export function buildDefaultValues(
  category?: FinancialTransactionCategory | null,
  defaults?: CategoryFormDefaults,
  members: PlanMember[] = [],
  categories: FinancialTransactionCategory[] = [],
): CategoryFormValues {
  const memberLimits = buildMemberLimitRows(category, members);
  if (category) {
    return {
      type: category.type,
      description: category.description,
      parentId: category.parentId ?? null,
      // A child reports its parent's owner; only a root's owner is its own.
      ownerId: category.parentId == null ? (category.ownerId ?? null) : null,
      spendingLimit: category.spendingLimit ?? null,
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
    spendingLimit: null,
    limitMode: "single",
    memberLimits,
  };
}

/**
 * Per member mode sends every row with an amount (former members' entries
 * included, unchanged) and no plain limit; single mode sends the plain limit
 * and clears the per-member entries.
 */
export function toPayload(
  values: CategoryFormOutput,
): CreateFinancialTransactionCategoryRequest["body"] {
  const perMember = values.type === "DEBIT" && values.limitMode === "perMember";
  return {
    type: values.type,
    description: values.description.trim(),
    parentId: values.parentId,
    ownerId: values.parentId == null ? values.ownerId : null,
    // Income categories carry no limit.
    spendingLimit:
      values.type === "DEBIT" && !perMember
        ? (values.spendingLimit ?? undefined)
        : undefined,
    memberLimits: perMember
      ? values.memberLimits.flatMap((row) =>
          row.amount == null ? [] : [{ memberId: row.memberId, amount: row.amount }],
        )
      : [],
  };
}
