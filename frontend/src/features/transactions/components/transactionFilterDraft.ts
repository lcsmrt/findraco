import type {
  FinancialTransactionCategory,
  FinancialTransactionType,
  PagedFinancialTransactionsFilter,
} from "@/api/dtos";
import { format, parseISO } from "date-fns";
import type { DateRange } from "react-day-picker";

const ISO = "yyyy-MM-dd";
export const TYPE_ALL = "ALL" as const;

// StandardCombobox requires an `id`; PlanMember keys on `userId`, so members are adapted to this shape.
export type MemberOption = { id: number; name: string };

/** Editable popover state; mapped from and back to the applied URL filters. */
export type FilterDraft = {
  type: FinancialTransactionType | typeof TYPE_ALL;
  /** Kept apart from `category`, which is null until the category name has loaded. */
  categoryId: number | null;
  category: FinancialTransactionCategory | null;
  /** Kept apart from `member`, which is null until the plan members have loaded. */
  memberId: number | null;
  member: MemberOption | null;
  dateRange: DateRange | undefined;
  /** Reais; `null` means no bound. */
  amountMin: number | null;
  amountMax: number | null;
};

export type AppliedFilters = {
  filter: PagedFinancialTransactionsFilter;
  categoryForDisplay: FinancialTransactionCategory | null;
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
    dateRange:
      filter.startDateFrom || filter.startDateTo
        ? {
            from: filter.startDateFrom
              ? parseISO(filter.startDateFrom)
              : undefined,
            to: filter.startDateTo ? parseISO(filter.startDateTo) : undefined,
          }
        : undefined,
    amountMin: filter.amountMin ?? null,
    amountMax: filter.amountMax ?? null,
  };
}

export const withDraftCategory = (
  draft: FilterDraft,
  category: FinancialTransactionCategory | null,
): FilterDraft => ({ ...draft, category, categoryId: category?.id ?? null });

export const withDraftMember = (
  draft: FilterDraft,
  member: MemberOption | null,
): FilterDraft => ({ ...draft, member, memberId: member?.id ?? null });

export function fromDraft(draft: FilterDraft): AppliedFilters {
  const filter: PagedFinancialTransactionsFilter = {};
  if (draft.type !== TYPE_ALL) filter.type = draft.type;
  if (draft.categoryId != null) filter.categoryId = draft.categoryId;
  if (draft.memberId != null) filter.memberId = draft.memberId;
  if (draft.dateRange?.from)
    filter.startDateFrom = format(draft.dateRange.from, ISO);
  if (draft.dateRange?.to) filter.startDateTo = format(draft.dateRange.to, ISO);
  if (draft.amountMin != null) filter.amountMin = draft.amountMin;
  if (draft.amountMax != null) filter.amountMax = draft.amountMax;
  return {
    filter,
    categoryForDisplay: draft.category,
    memberForDisplay: draft.member,
  };
}
