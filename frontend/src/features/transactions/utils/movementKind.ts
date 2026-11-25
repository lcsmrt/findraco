import type { TransactionKind, TransactionType } from "@/api/dtos/transaction";

type MaybeKind = TransactionKind | null | undefined;

/**
 * Kinds that count in no total and take no category, split or items. A contact payment is one: the
 * money was already counted as spending when the purchase was made.
 */
export function isNeutralKind(kind: MaybeKind): boolean {
  return (
    kind === "TRANSFER" || kind === "CARD_BILL_PAYMENT" || kind === "SAVINGS" || kind === "REPAYMENT"
  );
}

/** A contact paying back what it owes: the kind with a contact and the purchases it settles. */
export function isRepayment(kind: MaybeKind): boolean {
  return kind === "REPAYMENT";
}

/** The kinds a row of this type can take; a refund and a contact payment are money coming in, so only a credit. */
export function kindsForType(type: TransactionType): TransactionKind[] {
  const neutral: TransactionKind[] = ["TRANSFER", "CARD_BILL_PAYMENT", "SAVINGS"];
  return type === "CREDIT" ? [...neutral, "REFUND", "REPAYMENT"] : neutral;
}

/** The kind a row keeps when its type changes: none when the new type cannot take it. */
export function kindForType(kind: MaybeKind, type: TransactionType): TransactionKind | null {
  return kind && kindsForType(type).includes(kind) ? kind : null;
}

/**
 * The type of the categories a row can use. A refund is a credit that pays back an expense, so it
 * sits in an expense category even though the row is a credit.
 */
export function categoryTypeFor(type: TransactionType, kind: MaybeKind): TransactionType {
  return kind === "REFUND" ? "DEBIT" : type;
}

/** A refund is one purchase paid back, not a list of items; a neutral movement has none either. */
export function hidesItems(kind: MaybeKind): boolean {
  return isNeutralKind(kind) || kind === "REFUND";
}

/** The copy of each kind, in the order the form lists them. */
export const KIND_LABEL_KEYS = {
  TRANSFER: "transactions.kinds.transfer",
  CARD_BILL_PAYMENT: "transactions.kinds.cardBillPayment",
  SAVINGS: "transactions.kinds.savings",
  REFUND: "transactions.kinds.refund",
  REPAYMENT: "transactions.kinds.repayment",
} as const satisfies Record<TransactionKind, string>;
