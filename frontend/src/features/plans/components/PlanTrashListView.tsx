import type { TransactionTrashEntry } from "@/api/dtos";
import { Amount } from "@/components/amount/Amount";
import { Badge } from "@/components/badge/base/Badge";
import { Button } from "@/components/button/base/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/card/base/Card";
import { Text } from "@/components/typography/base/Text";
import { formatDate } from "@/utils/dates";
import { RotateCcwIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

type PlanTrashListViewProps = {
  entries: TransactionTrashEntry[];
  /** How many deletions the plan's trash holds; more than `entries` when only the newest are loaded. */
  total: number;
  isError: boolean;
  /** The deletion whose restore is in flight, if any. */
  restoringId: number | null;
  onRestore: (entry: TransactionTrashEntry) => void;
  onRetry: () => void;
};

/** The plan's trashed deletions, with who deleted each and the date it is removed for good. */
export function PlanTrashListView({
  entries,
  total,
  isError,
  restoringId,
  onRestore,
  onRetry,
}: PlanTrashListViewProps) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("plans.planTrashListView.trash")}</CardTitle>
        <CardDescription>{t("plans.planTrashListView.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        {isError ? (
          <div role="alert" className="flex flex-col items-center gap-3 py-6">
            <Text as="p" className="text-destructive text-center">
              {t("plans.planTrashListView.loadError")}
            </Text>
            <Button type="button" variant="outline" size="sm" onClick={onRetry}>
              {t("plans.planTrashListView.retry")}
            </Button>
          </div>
        ) : entries.length === 0 ? (
          <Text as="p" className="text-muted-foreground py-6 text-center">
            {t("plans.planTrashListView.empty")}
          </Text>
        ) : (
          <ul className="flex flex-col gap-2">
            {entries.map((entry) => (
              <li
                key={entry.id}
                className="border-border flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 flex-col gap-1">
                  <div className="flex min-w-0 items-center gap-2">
                    <Text variant="label" className="truncate">
                      {entry.description}
                    </Text>
                    {entry.kind === "SERIES" && (
                      <Badge variant="secondary">{t("plans.planTrashListView.series")}</Badge>
                    )}
                  </div>
                  <Text variant="caption">
                    {t("plans.planTrashListView.count", { count: entry.count })}
                    {" · "}
                    <Amount value={entry.amount} type={entry.type} />
                  </Text>
                  <Text variant="caption">
                    {entry.deletedBy
                      ? t("plans.planTrashListView.deletedBy", {
                          name: entry.deletedBy.name,
                          date: formatDate(new Date(entry.deletedAt)),
                        })
                      : t("plans.planTrashListView.deletedOn", {
                          date: formatDate(new Date(entry.deletedAt)),
                        })}
                  </Text>
                  <Text variant="caption">
                    {t("plans.planTrashListView.expiresOn", {
                      date: formatDate(new Date(entry.expiresAt)),
                    })}
                  </Text>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="shrink-0"
                  aria-label={t("plans.planTrashListView.restoreEntry", {
                    description: entry.description,
                  })}
                  isLoading={restoringId === entry.id}
                  disabled={restoringId !== null}
                  onClick={() => onRestore(entry)}
                >
                  <RotateCcwIcon className="h-4 w-4" />
                  {t("plans.planTrashListView.restore")}
                </Button>
              </li>
            ))}
            {total > entries.length && (
              <li>
                <Text variant="caption" className="text-muted-foreground">
                  {t("plans.planTrashListView.newestOnly", { shown: entries.length, total })}
                </Text>
              </li>
            )}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
