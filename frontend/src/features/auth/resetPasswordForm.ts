import { z } from "zod";

export const resetPasswordSchema = z
  .object({
    password: z.string().min(1, "Please enter a new password"),
    confirmPassword: z.string().min(1, "Please confirm the new password"),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
