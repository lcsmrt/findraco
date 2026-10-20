import { useState } from "react";
import { usePlanContext } from "@/app/providers/usePlanContext";
import { PlanNameDialog } from "./PlanNameDialog";
import { PlanSwitcherView } from "./PlanSwitcherView";

export function PlanSwitcher() {
  const { plans, activePlan, activePlanId, setActivePlanId } = usePlanContext();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <>
      <PlanSwitcherView
        plans={plans}
        activePlanId={activePlanId}
        activePlanName={activePlan?.name}
        onSelectPlan={setActivePlanId}
        onCreatePlan={() => setIsCreateOpen(true)}
      />

      <PlanNameDialog
        mode="create"
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSuccess={(plan) => setActivePlanId(plan.id)}
      />
    </>
  );
}
