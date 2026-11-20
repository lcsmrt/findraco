import type { NeutralCandidate } from "@/api/dtos";
import { Amount } from "@/components/amount/Amount";
import { Button } from "@/components/button/base/Button";
import { Skeleton } from "@/components/skeleton/base/Skeleton";
import { Text } from "@/components/typography/base/Text";
import { formatDate } from "@/utils/dates";
import { useTranslation } from "react-i18next";
import { TransactionKindBadge } from "./TransactionCells";

type NeutralReviewListViewProps = {
  candidates: NeutralCandidate[];
  /** How many rows are waiting for review; more than `candidates` when only the newest are loaded. */
  total: number;
  isLoading: boolean;
  isError: boolean;
  /** The row whose kind is being applied, if any. */
  applyingId: number | null;
  onApply: (candidate: NeutralCandidate) => void;
  onRetry: () => void;
};

/** The rows that look like a transfer or a card bill, each with the kind it proposes and an Apply. */
export function NeutralReviewListView({
  candidates,
  total,
  isLoading,
  isError,
  applyingId,
  onApply,
  onRetry,
}: NeutralReviewListViewProps) {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 px-4">
        <Skeleton className="h-16" />
        <Skeleton className="h-16" />
        <Skeleton className="h-16" />
      </div>
    );
  }

  if (isError) {
    return (
      <div role="alert" className="flex flex-col items-center gap-3 px-4 py-6">
        <Text as="p" className="text-destructive text-center">
          {t("transactions.neutralReviewListView.loadError")}
        </Text>
        <Button type="button" variant="outline" size="sm" onClick={onRetry}>
          {t("transactions.neutralReviewListView.retry")}
        </Button>
      </div>
    );
  }

  if (candidates.length === 0) {
    return (
      <Text as="p" className="text-muted-foreground px-4 py-6 text-center">
        {t("transactions.neutralReviewListView.empty")}
      </Text>
    );
  }

  return (
    <ul className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto px-4 pb-4">
      {candidates.map((candidate) => {
        const { transaction, proposedKind } = candidate;
        return (
          <li
            key={transaction.id}
            className="border-border flex items-center justify-between gap-3 rounded-lg border p-3"
          >
            <div className="flex min-w-0 flex-col gap-1">
              <Text variant="label" className="truncate">
                {transaction.description}
              </Text>
              <Text variant="caption">
                {formatDate(transaction.startDate)}
                {" · "}
                <Amount value={transaction.amount} type={transaction.type} />
              </Text>
              <span className="flex">
                <TransactionKindBadge kind={proposedKind} />
              </span>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="shrink-0"
              aria-label={t("transactions.neutralReviewListView.applyTo", {
                description: transaction.description,
              })}
              isLoading={applyingId === transaction.id}
              disabled={applyingId !== null}
              onClick={() => onApply(candidate)}
            >
              {t("transactions.neutralReviewListView.apply")}
            </Button>
          </li>
        );
      })}
      {total > candidates.length && (
        <li>
          <Text variant="caption">
            {t("transactions.neutralReviewListView.newestOnly", {
              shown: candidates.length,
              total,
            })}
          </Text>
        </li>
      )}
    </ul>
  );
}
