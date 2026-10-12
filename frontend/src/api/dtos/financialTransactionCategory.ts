import type { FinancialTransactionType } from "./financialTransaction";

export type CategoryMemberLimit = {
  memberId: number;
  memberName: string;
  amount: number;
  active: boolean;
};

export type FinancialTransactionCategory = {
  id: number;
  type: FinancialTransactionType;
  description: string;
  spendingLimit?: number | null;
  // SPEC_DEVIATION: optional (design: required) so the partial category shapes
  // embedded in transaction forms still type-check; null/undefined = root.
  parentId?: number | null;
  // Optional: categories embedded in transactions carry no membership data
  // (ownerActive, memberLimits and effectiveLimit are null there).
  ownerId?: number | null;
  ownerName?: string | null;
  ownerActive?: boolean | null;
  memberLimits?: CategoryMemberLimit[];
  effectiveLimit?: number | null;
};

export type FinancialTransactionCategorySortBy =
  | "description"
  | "spendingLimit";

export interface PagedFinancialTransactionCategoriesFilter {
  description?: string;
  type?: FinancialTransactionType;
}

export type CreateFinancialTransactionCategoryRequest = {
  body: {
    type: FinancialTransactionType;
    description: string;
    spendingLimit?: number;
    parentId?: number | null;
    /** Roots only; a child inherits its parent's owner. */
    ownerId?: number | null;
    /** Replaced as a set; omitted keeps the stored entries, [] removes them. */
    memberLimits?: { memberId: number; amount: number }[];
  };
};

export type UpdateFinancialTransactionCategoryRequest = {
  params: { id: number };
  body: Partial<CreateFinancialTransactionCategoryRequest["body"]>;
};

export type DeleteFinancialTransactionCategoryRequest = {
  id: number;
  /** Category that receives the deleted category's transactions, items and recurrences. */
  reassignTo?: number;
};

export type CategorySpendingFilter = {
  startDate: string;
  endDate: string;
};

export type CategorySpendingMember = {
  memberId: number;
  name: string;
  spent: number;
  limit: number | null;
  remaining: number | null;
  percentUsed: number | null;
  overLimit: boolean | null;
  active: boolean;
};

/** One row of the category spending tree; limits are monthly. */
export type CategorySpending = {
  categoryId: number;
  parentId: number | null;
  name: string;
  type: FinancialTransactionType;
  ownerId: number | null;
  ownerName: string | null;
  spent: number;
  limit: number | null;
  remaining: number | null;
  percentUsed: number | null;
  overLimit: boolean | null;
  members: CategorySpendingMember[];
  children: CategorySpending[];
};
