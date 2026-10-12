import { differenceInCalendarMonths, parseISO } from "date-fns";

/** Calendar months touched by an inclusive `yyyy-MM-dd` range (Oct 15 – Nov 10 → 2). */
export const countMonths = (startDate: string, endDate: string): number =>
  differenceInCalendarMonths(parseISO(endDate), parseISO(startDate)) + 1;

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
export const scaleLimit = (
  spent: number,
  monthlyLimit: number | null | undefined,
  monthCount: number,
): ScaledLimit => {
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
};

type LimitedNode<T> = {
  spent: number;
  limit?: number | null;
  children: T[];
};

export type ScaledNode<T> = Omit<
  T,
  "limit" | "remaining" | "percentUsed" | "overLimit" | "children"
> &
  ScaledLimit & { children: ScaledNode<T>[] };

/** Applies {@link scaleLimit} to every node of a category tree. */
export const scaleTreeLimits = <T extends LimitedNode<T>>(
  nodes: T[],
  monthCount: number,
): ScaledNode<T>[] =>
  nodes.map((node) => ({
    ...node,
    ...scaleLimit(node.spent, node.limit, monthCount),
    children: scaleTreeLimits(node.children, monthCount),
  }));
