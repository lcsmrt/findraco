import { z } from "zod";

export const planNameSchema = z.object({
  name: z.string().min(1, "Enter a name for the plan"),
});

export type PlanNameFormValues = z.input<typeof planNameSchema>;
export type PlanNameFormOutput = z.output<typeof planNameSchema>;
