import { z } from "zod";
import { newPasswordSchema } from "./utils/passwordSchema";

// Sign in, sign up and the reset request all ask for the account email, so they share one rule.
const emailField = z
  .string()
  .min(1, "auth.form.pleaseEnterYourEmail")
  .email("auth.form.invalidEmail");

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, "auth.form.pleaseEnterYourPassword"),
});

export type LoginFormValues = z.input<typeof loginSchema>;
export type LoginFormOutput = z.output<typeof loginSchema>;

export const registerUserSchema = z.object({
  name: z.string().min(1, "auth.form.pleaseEnterYourFullName"),
  email: emailField,
  password: newPasswordSchema("auth.form.pleaseEnterYourPassword"),
});

export type RegisterUserFormValues = z.input<typeof registerUserSchema>;
export type RegisterUserFormOutput = z.output<typeof registerUserSchema>;

export const forgotPasswordSchema = z.object({
  email: emailField,
});

export type ForgotPasswordFormValues = z.input<typeof forgotPasswordSchema>;
export type ForgotPasswordFormOutput = z.output<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password: newPasswordSchema("auth.form.pleaseEnterANewPassword"),
    confirmPassword: z.string().min(1, "auth.form.pleaseConfirmTheNewPassword"),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "auth.form.passwordsDoNotMatch",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormValues = z.input<typeof resetPasswordSchema>;
export type ResetPasswordFormOutput = z.output<typeof resetPasswordSchema>;
