import type { Transaction } from "@/api/dtos/transaction";

/**
 * Whether the table has an attribution column. A plan of one member needs none, since every row is
 * the member's own; a row that gives a contact a share needs it even there, or her name would show
 * only on the phone list.
 */
export function showParticipantsColumn(memberCount: number, transactions: Transaction[]): boolean {
  return (
    memberCount > 1 ||
    transactions.some((transaction) => transaction.participants.some((participant) => participant.contactId != null))
  );
}
