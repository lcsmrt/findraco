import { useGetPlans } from "@/api/services/usePlanService";
import { useAuth } from "@/app/providers/useAuth";
import {
  getItemFromStorage,
  removeItemFromStorage,
  storeItem,
} from "@/lib/storage";
import { z } from "zod";
import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PlanContext } from "./usePlanContext";

export function PlanProvider({ children }: { children: ReactNode }) {
  const { user, status } = useAuth();

  const [activePlanId, setActivePlanIdState] = useState<number | null>(() =>
    getItemFromStorage("activePlanId", z.number()),
  );

  const { data: plans = [], isLoading } = useGetPlans({
    enabled: !!user,
  });

  // The plan chosen last, readable by effects that run in the same pass as the choice: the state
  // they closed over is still the old one, and the default fallback must not undo a link's plan.
  const chosenPlanIdRef = useRef(activePlanId);

  const setActivePlanId = useCallback((planId: number) => {
    chosenPlanIdRef.current = planId;
    setActivePlanIdState(planId);
    storeItem("activePlanId", planId);
  }, []);

  useEffect(() => {
    if (!user) {
      // While the session restores the user is null too; the stored plan must survive that.
      if (status === "anonymous") {
        chosenPlanIdRef.current = null;
        setActivePlanIdState(null);
        removeItemFromStorage("activePlanId");
      }
      return;
    }

    if (plans.length === 0) return;

    const chosenPlanId = chosenPlanIdRef.current;
    const isActiveValid =
      chosenPlanId != null && plans.some((plan) => plan.id === chosenPlanId);

    if (!isActiveValid) {
      const fallback = plans.find((plan) => plan.isDefault) ?? plans[0];
      setActivePlanId(fallback.id);
    }
  }, [user, status, plans, setActivePlanId]);

  const activePlan = useMemo(
    () => plans.find((plan) => plan.id === activePlanId),
    [plans, activePlanId],
  );

  const value = useMemo(
    () => ({ activePlanId, setActivePlanId, activePlan, plans, isLoading }),
    [activePlanId, setActivePlanId, activePlan, plans, isLoading],
  );

  return (
    <PlanContext.Provider value={value}>{children}</PlanContext.Provider>
  );
}
