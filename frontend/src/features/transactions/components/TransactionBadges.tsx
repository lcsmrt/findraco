import type { Transaction } from "@/api/dtos/transaction";
import { Badge } from "@/components/badge/base/Badge";
import { ClockIcon, RepeatIcon, TriangleAlertIcon, UserIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { KIND_LABEL_KEYS } from "../utils/movementKind";

type TransactionStatusBadgeProps = {
  status: Transaction["status"];
};

/** An actual row carries no badge: only what has not happened yet, or is overdue, is marked. */
function TransactionStatusBadge({ status }: TransactionStatusBadgeProps) {
  const { t } = useTranslation();

  if (status === "ACTUAL") return null;
  if (status === "PENDING") {
    return (
      <Badge variant="status" tone="warning">
        <TriangleAlertIcon data-icon="inline-start" aria-hidden />
        {t("transactions.transactionStatusBadge.pending")}
      </Badge>
    );
  }
  return (
    <Badge variant="status" tone="neutral">
      <ClockIcon data-icon="inline-start" aria-hidden />
      {t("transactions.transactionStatusBadge.forecast")}
    </Badge>
  );
}

type TransactionKindBadgeProps = {
  kind: Transaction["kind"];
};

/** Names a row that counts as something other than income or expense; a normal row has none. */
export function TransactionKindBadge({ kind }: TransactionKindBadgeProps) {
  const { t } = useTranslation();

  if (!kind) return null;
  return <Badge variant="meta">{t(KIND_LABEL_KEYS[kind])}</Badge>;
}

type RepaymentContactBadgeProps = {
  repayment: Transaction["repayment"];
};

/** Who a contact payment came from, beside its kind. */
function RepaymentContactBadge({ repayment }: RepaymentContactBadgeProps) {
  if (!repayment) return null;
  return (
    <Badge variant="meta">
      <UserIcon data-icon="inline-start" aria-hidden />
      {repayment.contactName}
    </Badge>
  );
}

function SeriesBadge() {
  const { t } = useTranslation();

  return (
    <Badge variant="meta">
      <RepeatIcon data-icon="inline-start" aria-hidden />
      {t("transactions.descriptionCell.series")}
    </Badge>
  );
}

type TransactionItemsBadgeProps = {
  count: number;
};

function TransactionItemsBadge({ count }: TransactionItemsBadgeProps) {
  const { t } = useTranslation();

  if (count === 0) return null;
  return <Badge variant="meta">{t("transactions.transactionBadges.items", { count })}</Badge>;
}

type TransactionBadgesProps = {
  transaction: Transaction;
};

/**
 * The markers of one transaction, in the order of how much they change its meaning: status, kind (and
 * the contact of a contact payment), series, items. The table and the phone list render this one row so they never disagree.
 */
export function TransactionBadges({ transaction }: TransactionBadgesProps) {
  return (
    <>
      <TransactionStatusBadge status={transaction.status} />
      <TransactionKindBadge kind={transaction.kind} />
      <RepaymentContactBadge repayment={transaction.repayment} />
      {transaction.seriesId && <SeriesBadge />}
      <TransactionItemsBadge count={transaction.items.length} />
    </>
  );
}
