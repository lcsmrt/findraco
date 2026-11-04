import type { ArchivedPlan } from "@/api/dtos";
import { Button } from "@/components/button/base/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/card/base/Card";
import { Spinner } from "@/components/spinner/base/Spinner";
import { Text } from "@/components/typography/base/Text";
import { format } from "date-fns";
import { RotateCcwIcon } from "lucide-react";

const DATE_FORMAT = "dd/MM/yyyy";

type ArchivedPlansListViewProps = {
  plans: ArchivedPlan[];
  isLoading: boolean;
  isError: boolean;
  /** The plan whose restore is in flight, if any. */
  restoringPlanId: number | null;
  onRestore: (plan: ArchivedPlan) => void;
};

/** The owner's archived plans, with the date each is deleted permanently. */
export function ArchivedPlansListView({
  plans,
  isLoading,
  isError,
  restoringPlanId,
  onRestore,
}: ArchivedPlansListViewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Archived plans</CardTitle>
        <CardDescription>
          An archived plan can be restored until its deletion date.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-6">
            <Spinner />
          </div>
        ) : isError ? (
          <Text as="p" role="alert" className="text-destructive py-6 text-center">
            Could not load your archived plans. Try again later.
          </Text>
        ) : (
          <ul className="flex flex-col gap-2">
            {plans.map((plan) => (
              <li
                key={plan.id}
                className="border-border flex items-center justify-between gap-3 rounded-lg border p-3"
              >
                <div className="flex min-w-0 flex-col gap-1">
                  <Text variant="label" className="truncate">
                    {plan.name}
                  </Text>
                  <Text variant="caption">
                    Archived on {format(new Date(plan.archivedAt), DATE_FORMAT)}
                  </Text>
                  <Text variant="caption">
                    Deleted permanently on{" "}
                    {format(new Date(plan.deletesAt), DATE_FORMAT)}
                  </Text>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  aria-label={`Restore ${plan.name}`}
                  isLoading={restoringPlanId === plan.id}
                  disabled={restoringPlanId !== null}
                  onClick={() => onRestore(plan)}
                >
                  <RotateCcwIcon className="h-4 w-4" />
                  Restore
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
