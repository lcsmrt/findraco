import {
  useGetArchivedPlans,
  useRestorePlan,
} from "@/api/services/usePlanService";
import { ArchivedPlansListView } from "./ArchivedPlansListView";

/** The Archived plans card; absent while the user owns no archived plan. */
export function ArchivedPlansSection() {
  const { data: plans = [], isLoading, isError } = useGetArchivedPlans();
  const restore = useRestorePlan();

  if (!isLoading && !isError && plans.length === 0) return null;

  return (
    <ArchivedPlansListView
      plans={plans}
      isLoading={isLoading}
      isError={isError}
      restoringPlanId={restore.isPending ? restore.variables : null}
      onRestore={(plan) => restore.mutate(plan.id)}
    />
  );
}
