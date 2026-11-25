import type { ContactShareStatus, ContactStatementShare } from "@/api/dtos/contact";
import { formatMoney } from "@/utils/money";
import type { TFunction } from "i18next";

const STATUS_KEYS = {
  PAID: "contacts.statement.status.paid",
  OPEN: "contacts.statement.status.open",
  PLANNED: "contacts.statement.status.planned",
} as const;

/** The colour each status reads in: settled is success, partly settled warns, the rest stay quiet. */
export const STATUS_TONE_CLASS = {
  PAID: "text-success",
  PARTIAL: "text-warning",
  OPEN: "text-foreground",
  PLANNED: "text-muted-foreground",
} as const satisfies Record<ContactShareStatus, string>;

/** "Paid", "Partial (R$ 100,00 of R$ 300,00)", "Open" or "Planned". */
export function shareStatusLabel(t: TFunction, share: Pick<ContactStatementShare, "status" | "allocated" | "share">) {
  if (share.status === "PARTIAL") {
    return t("contacts.statement.status.partial", {
      allocated: formatMoney(share.allocated),
      share: formatMoney(share.share),
    });
  }
  return t(STATUS_KEYS[share.status]);
}
