import { toCents } from "@/utils/money";

/** One contact share a payment can settle: what is still open on it, oldest share first. */
export type OpenShare = {
  participantId: number;
  open: number;
};

export type SuggestedAllocation = {
  participantId: number;
  amount: number;
};

export type AllocationSuggestion = {
  allocations: SuggestedAllocation[];
  /** What the payment holds beyond the open shares: it becomes the contact's credit. */
  excess: number;
};

/**
 * What the form pre-ticks for a payment: the oldest open share first, each up to what is open on it,
 * until the amount runs out, so the last one may be partial. The user can change it before saving;
 * the backend's own oldest-first fill is the rule for a request that sends no allocations.
 */
export function suggestAllocations(shares: OpenShare[], amount: number | null): AllocationSuggestion {
  let leftCents = amount === null ? 0 : Math.max(toCents(amount), 0);
  const allocations: SuggestedAllocation[] = [];

  for (const share of shares) {
    const takenCents = Math.min(leftCents, toCents(share.open));
    if (takenCents <= 0) continue;
    allocations.push({ participantId: share.participantId, amount: takenCents / 100 });
    leftCents -= takenCents;
  }

  return { allocations, excess: leftCents / 100 };
}
