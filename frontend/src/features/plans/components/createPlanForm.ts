import { z } from "zod";

export const createPlanSchema = z.object({
  name: z.string().min(1, "Enter a name for the plan"),
});

export type CreatePlanFormValues = z.infer<typeof createPlanSchema>;
