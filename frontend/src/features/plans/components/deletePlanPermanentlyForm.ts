import { z } from "zod";

/** The typed text names the plan only when it is the plan's name exactly: no trimming, case-sensitive. */
export function matchesPlanName(typed: string, planName: string) {
  return typed === planName;
}

export function deletePlanPermanentlySchema(planName: string) {
  return z.object({
    confirmation: z
      .string()
      .refine((typed) => matchesPlanName(typed, planName), "plans.deleteForm.typeThePlanNameExactly"),
  });
}

export type DeletePlanPermanentlyFormValues = z.input<ReturnType<typeof deletePlanPermanentlySchema>>;
export type DeletePlanPermanentlyFormOutput = z.output<ReturnType<typeof deletePlanPermanentlySchema>>;
