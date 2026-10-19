import type { CategorySpendingMember } from "@/api/dtos";
import { differenceInCalendarMonths, parseISO } from "date-fns";

/** Calendar months touched by an inclusive `yyyy-MM-dd` range (Oct 15 – Nov 10 → 2). */
export function countMonths(startDate: string, endDate: string): number {
  return differenceInCalendarMonths(parseISO(endDate), parseISO(startDate)) + 1;
}

export type ScaledLimit = {
  limit?: number;
  remaining?: number;
  percentUsed?: number;
  overLimit?: boolean;
};

/**
 * Scales a monthly limit to `monthCount` months and evaluates `spent` against it.
 * Usage is recomputed on the client because the API evaluates a single month.
 */
export function scaleLimit(
  spent: number,
  monthlyLimit: number | null | undefined,
  monthCount: number,
): ScaledLimit {
  if (monthlyLimit == null) {
    return {
      limit: undefined,
      remaining: undefined,
      percentUsed: undefined,
      overLimit: undefined,
    };
  }
  const limit = monthlyLimit * monthCount;
  return {
    limit,
    remaining: limit - spent,
    percentUsed: limit === 0 ? 0 : Math.round((spent / limit) * 10000) / 100,
    overLimit: spent > limit,
  };
}

/**
 * Scales one member's monthly limit like {@link scaleLimit}. A former member's
 * entry keeps its (scaled) amount but is never evaluated (CAT-14).
 */
export function scaleMemberLimit(
  member: CategorySpendingMember,
  monthCount: number,
): CategorySpendingMember {
  const scaled = scaleLimit(member.spent, member.limit, monthCount);
  return {
    ...member,
    limit: scaled.limit ?? null,
    remaining: member.active ? (scaled.remaining ?? null) : null,
    percentUsed: member.active ? (scaled.percentUsed ?? null) : null,
    overLimit: member.active ? (scaled.overLimit ?? null) : null,
  };
}

type LimitedNode<T> = {
  spent: number;
  limit?: number | null;
  children: T[];
  members?: CategorySpendingMember[];
};

export type ScaledNode<T> = Omit<
  T,
  "limit" | "remaining" | "percentUsed" | "overLimit" | "children"
> &
  ScaledLimit & { children: ScaledNode<T>[] };

/** Applies {@link scaleLimit} to every node of a category tree, and to its per-member rows. */
export function scaleTreeLimits<T extends LimitedNode<T>>(
  nodes: T[],
  monthCount: number,
): ScaledNode<T>[] {
  return nodes.map((node) => ({
    ...node,
    ...scaleLimit(node.spent, node.limit, monthCount),
    ...(node.members && {
      members: node.members.map((member) => scaleMemberLimit(member, monthCount)),
    }),
    children: scaleTreeLimits(node.children, monthCount),
  }));
}
