import {
  useGetArchivedPlans,
  useRestorePlan,
} from "@/api/services/usePlanService";
import { useState } from "react";
import { DeletePlanPermanentlyDialog } from "./DeletePlanPermanentlyDialog";
import { ArchivedPlansListView } from "./ArchivedPlansListView";

/** The Archived plans card; absent while the user owns no archived plan. */
export function ArchivedPlansSection() {
  const { data: plans = [], isLoading, isError } = useGetArchivedPlans();
  const restore = useRestorePlan();
  const [deletingPlanId, setDeletingPlanId] = useState<number | null>(null);
  // A plan that left the list (deleted, restored elsewhere) takes its dialog with it.
  const deletingPlan = plans.find((plan) => plan.id === deletingPlanId);

  if (!isLoading && !isError && plans.length === 0) return null;

  return (
    <>
      <ArchivedPlansListView
        plans={plans}
        isLoading={isLoading}
        isError={isError}
        restoringPlanId={restore.isPending ? restore.variables : null}
        onRestore={(plan) => restore.mutate(plan.id)}
        onDelete={(plan) => setDeletingPlanId(plan.id)}
      />
      {deletingPlan && (
        <DeletePlanPermanentlyDialog
          open
          onOpenChange={(open) => {
            if (!open) setDeletingPlanId(null);
          }}
          plan={deletingPlan}
        />
      )}
    </>
  );
}
