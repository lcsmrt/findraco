import type { Plan } from "@/api/dtos";
import { useCreatePlan, useRenamePlan } from "@/api/services/usePlanService";
import type { PlanNameFormOutput } from "./planNameForm";

type UsePlanNameSubmitArgs = { onDone: () => void } & (
  | { mode: "create"; onCreated?: (plan: Plan) => void }
  | { mode: "rename"; plan: Plan }
);

/** Submits a plan name: creates a plan or renames the given one, then calls `onDone`. */
export function usePlanNameSubmit(args: UsePlanNameSubmitArgs) {
  const createPlan = useCreatePlan({
    onSuccess: (plan) => {
      if (args.mode === "create") args.onCreated?.(plan);
      args.onDone();
    },
  });
  const renamePlan = useRenamePlan({ onSuccess: () => args.onDone() });

  function submit({ name }: PlanNameFormOutput) {
    if (args.mode === "rename") {
      renamePlan.mutate({ params: { planId: args.plan.id }, body: { name } });
      return;
    }
    createPlan.mutate({ body: { name } });
  }

  return { submit, isSubmitting: createPlan.isPending || renamePlan.isPending };
}
