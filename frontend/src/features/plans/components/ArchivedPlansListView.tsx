import type { ArchivedPlan } from "@/api/dtos";
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
import { RotateCcwIcon, Trash2Icon } from "lucide-react";
import { useTranslation } from "react-i18next";

type ArchivedPlansListViewProps = {
  plans: ArchivedPlan[];
  isError: boolean;
  /** The plan whose restore is in flight, if any. */
  restoringPlanId: number | null;
  onRestore: (plan: ArchivedPlan) => void;
  onDelete: (plan: ArchivedPlan) => void;
};

/** The owner's archived plans, with the date each is deleted permanently. */
export function ArchivedPlansListView({
  plans,
  isError,
  restoringPlanId,
  onRestore,
  onDelete,
}: ArchivedPlansListViewProps) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("plans.archivedPlansListView.archivedPlans")}</CardTitle>
        <CardDescription>{t("plans.archivedPlansListView.anArchivedPlanCanBe")}</CardDescription>
      </CardHeader>
      <CardContent>
        {isError ? (
          <Text as="p" role="alert" className="text-destructive py-6 text-center">
            {t("plans.archivedPlansListView.couldNotLoadYourArchived")}
          </Text>
        ) : (
          <ul className="flex flex-col gap-2">
            {plans.map((plan) => (
              <li
                key={plan.id}
                className="border-border flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 flex-col gap-1">
                  <Text variant="label" className="truncate">
                    {plan.name}
                  </Text>
                  <Text variant="caption">
                    {t("plans.archivedPlansListView.archivedOn", {
                      date: formatDate(new Date(plan.archivedAt)),
                    })}
                  </Text>
                  <Text variant="caption">
                    {t("plans.archivedPlansListView.deletedOn", {
                      date: formatDate(new Date(plan.deletesAt)),
                    })}
                  </Text>
                </div>
                <div className="flex shrink-0 items-center gap-2 *:flex-1 sm:*:flex-none">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    aria-label={t("plans.archivedPlansListView.restorePlan", { name: plan.name })}
                    isLoading={restoringPlanId === plan.id}
                    disabled={restoringPlanId !== null}
                    onClick={() => onRestore(plan)}
                  >
                    <RotateCcwIcon className="h-4 w-4" />
                    {t("plans.archivedPlansListView.restore")}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:bg-accent hover:text-destructive"
                    aria-label={t("plans.archivedPlansListView.deletePlanNow", { name: plan.name })}
                    disabled={restoringPlanId !== null}
                    onClick={() => onDelete(plan)}
                  >
                    <Trash2Icon className="h-4 w-4" />
                    {t("plans.archivedPlansListView.deleteNow")}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
