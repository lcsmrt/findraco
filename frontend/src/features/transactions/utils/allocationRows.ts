import type { ContactStatement, RepaymentAllocation } from "@/api/dtos";
import { toCents } from "@/utils/money";
import { suggestAllocations } from "./suggestAllocations";

/** One purchase of the contact a payment can settle, as the form's list holds it. */
export type AllocationRow = {
  /** The id of the contact's share, which the request's allocation points at. */
  participantId: number;
  /** `yyyy-MM-dd`. */
  date: string;
  description: string;
  /** What this payment may settle of the share: its open amount, plus what the payment itself holds. */
  open: number;
  checked: boolean;
  amount: number | null;
};

/**
 * The shares a payment may settle, oldest first: the actual shares with something open, and the ones
 * this payment already settles when it is edited. A planned share takes no payment.
 * @param own What the edited payment already allocates, which it gives back to be settled again.
 */
export function openAllocationRows(
  statement: ContactStatement | undefined,
  own: RepaymentAllocation[],
): AllocationRow[] {
  if (!statement) return [];
  // The statement lists months newest first and the shares inside a month oldest first.
  const shares = [...statement.months].reverse().flatMap((month) => month.shares);

  return shares.flatMap((share) => {
    if (share.status === "PLANNED") return [];
    const ownCents = toCents(own.find((allocation) => allocation.participantId === share.participantId)?.amount ?? 0);
    const openCents = toCents(share.share) - toCents(share.allocated) + ownCents;
    if (openCents <= 0) return [];
    return [
      {
        participantId: share.participantId,
        date: share.date,
        description: share.description,
        open: openCents / 100,
        checked: false,
        amount: null,
      },
    ];
  });
}

/** The rows with the oldest ticked up to the amount, the rest unticked. */
export function withSuggestion(rows: AllocationRow[], amount: number | null): AllocationRow[] {
  const { allocations } = suggestAllocations(
    rows.map((row) => ({ participantId: row.participantId, open: row.open })),
    amount,
  );
  return rows.map((row) => {
    const suggested = allocations.find((allocation) => allocation.participantId === row.participantId);
    return { ...row, checked: suggested !== undefined, amount: suggested?.amount ?? null };
  });
}

/** The rows with the shares the edited payment already settles ticked at those amounts. */
export function withAllocations(rows: AllocationRow[], own: RepaymentAllocation[]): AllocationRow[] {
  return rows.map((row) => {
    const allocation = own.find((candidate) => candidate.participantId === row.participantId);
    return { ...row, checked: allocation !== undefined, amount: allocation?.amount ?? null };
  });
}

/** What the payment holds beyond the ticked amounts: it becomes the contact's credit. */
export function allocationExcess(amount: number | null, rows: AllocationRow[]): number {
  const tickedCents = rows.reduce((sum, row) => (row.checked ? sum + toCents(row.amount ?? 0) : sum), 0);
  return Math.max(toCents(amount ?? 0) - tickedCents, 0) / 100;
}
