import { PATHS } from "@/app/routing/paths";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePlanContext } from "@/app/providers/usePlanContext";
import { PlanNameDialog } from "./PlanNameDialog";
import { PlanSwitcherView } from "./PlanSwitcherView";

export function PlanSwitcher() {
  const navigate = useNavigate();
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
        onManagePlans={() => navigate(PATHS.plans)}
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
