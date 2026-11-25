import type { Contact } from "@/api/dtos/contact";
import { formatMoney } from "@/utils/money";
import type { TFunction } from "i18next";

export type ContactBalanceKind = "owes" | "credit" | "settled";

/** How a contact's account stands: what it owes, the credit it holds, or neither. */
export function contactBalance(contact: Pick<Contact, "owed" | "credit">): {
  kind: ContactBalanceKind;
  amount: number;
} {
  if (contact.owed > 0) return { kind: "owes", amount: contact.owed };
  if (contact.credit > 0) return { kind: "credit", amount: contact.credit };
  return { kind: "settled", amount: 0 };
}

/** The balance as a sentence: "Owes R$ 50,00", "Credit of R$ 20,00" or "Settled". */
export function contactBalanceLabel(t: TFunction, contact: Pick<Contact, "owed" | "credit">): string {
  const { kind, amount } = contactBalance(contact);
  if (kind === "settled") return t("contacts.balance.settled");
  return t(`contacts.balance.${kind}`, { amount: formatMoney(amount) });
}
