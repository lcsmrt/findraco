import type { TransactionType } from "./transaction";

export type CategoryMemberLimit = {
  memberId: number;
  memberName: string;
  amount: number;
  active: boolean;
};

export type Category = {
  id: number;
  /** Sent back on edit; an edit of a version that changed since answers 409 `stale-version`. */
  version: number;
  type: TransactionType;
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

export type CategorySortBy =
  | "description"
  | "spendingLimit";

export type PagedCategoriesFilter = {
  description?: string;
  type?: TransactionType;
}

export type CreateCategoryRequest = {
  body: {
    type: TransactionType;
    description: string;
    spendingLimit?: number;
    parentId?: number | null;
    /** Roots only; a child inherits its parent's owner. */
    ownerId?: number | null;
    /** Replaced as a set; omitted keeps the stored entries, [] removes them. */
    memberLimits?: { memberId: number; amount: number }[];
  };
};

export type UpdateCategoryRequest = {
  params: { id: number };
  body: Partial<CreateCategoryRequest["body"]> & { version: number };
};

export type DeleteCategoryRequest = {
  id: number;
  /** Category that receives the deleted category's transactions, items and recurrences. */
  reassignTo?: number;
};

/** How many references a category has (`GET .../{id}/usage`); the delete dialog needs a target when any is above zero. */
export type CategoryUsage = {
  transactions: number;
  items: number;
  recurrenceDefinitions: number;
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
  type: TransactionType;
  ownerId: number | null;
  ownerName: string | null;
  /** false when the owner left the plan; null without an owner. Children inherit the parent's. */
  ownerActive: boolean | null;
  spent: number;
  limit: number | null;
  remaining: number | null;
  percentUsed: number | null;
  overLimit: boolean | null;
  members: CategorySpendingMember[];
  children: CategorySpending[];
};
