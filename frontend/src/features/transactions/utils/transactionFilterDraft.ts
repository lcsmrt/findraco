import type {
  Category,
  TransactionType,
  PagedTransactionsFilter,
} from "@/api/dtos";

export const TYPE_ALL = "ALL" as const;

// StandardCombobox requires an `id`; PlanMember keys on `userId`, so members are adapted to this shape.
export type MemberOption = { id: number; name: string };

/** Editable popover state; mapped from and back to the applied URL filters. */
export type FilterDraft = {
  type: TransactionType | typeof TYPE_ALL;
  /** Kept apart from `category`, which is null until the category name has loaded. */
  categoryId: number | null;
  category: Category | null;
  /** Kept apart from `member`, which is null until the plan members have loaded. */
  memberId: number | null;
  member: MemberOption | null;
  /** Reais; `null` means no bound. */
  amountMin: number | null;
  amountMax: number | null;
};

export type AppliedFilters = {
  filter: PagedTransactionsFilter;
  categoryForDisplay: Category | null;
  memberForDisplay: MemberOption | null;
};

export function toDraft(applied: AppliedFilters): FilterDraft {
  const { filter, categoryForDisplay, memberForDisplay } = applied;
  return {
    type: filter.type ?? TYPE_ALL,
    categoryId: filter.categoryId ?? null,
    category: categoryForDisplay,
    memberId: filter.memberId ?? null,
    member: memberForDisplay,
    amountMin: filter.amountMin ?? null,
    amountMax: filter.amountMax ?? null,
  };
}

export function withDraftCategory(
  draft: FilterDraft,
  category: Category | null,
): FilterDraft {
  return { ...draft, category, categoryId: category?.id ?? null };
}

export function withDraftMember(
  draft: FilterDraft,
  member: MemberOption | null,
): FilterDraft {
  return { ...draft, member, memberId: member?.id ?? null };
}

export function fromDraft(draft: FilterDraft): AppliedFilters {
  const filter: PagedTransactionsFilter = {};
  if (draft.type !== TYPE_ALL) filter.type = draft.type;
  if (draft.categoryId != null) filter.categoryId = draft.categoryId;
  if (draft.memberId != null) filter.memberId = draft.memberId;
  if (draft.amountMin != null) filter.amountMin = draft.amountMin;
  if (draft.amountMax != null) filter.amountMax = draft.amountMax;
  return {
    filter,
    categoryForDisplay: draft.category,
    memberForDisplay: draft.member,
  };
}
