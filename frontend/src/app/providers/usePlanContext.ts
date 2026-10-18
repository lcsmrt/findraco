import { Plan } from "@/api/dtos";
import { createContext, useContext } from "react";

export type PlanContextValue = {
  activePlanId: number | null;
  setActivePlanId: (planId: number) => void;
  activePlan?: Plan;
  plans: Plan[];
  isLoading: boolean;
};

export const PlanContext = createContext<PlanContextValue | null>(null);

export function usePlanContext() {
  const context = useContext(PlanContext);
  if (!context) throw new Error("usePlanContext must be used within a PlanProvider");
  return context;
}
