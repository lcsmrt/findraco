import type { CreateInvitationRequest } from "@/api/dtos";
import { z } from "zod";

export const inviteSchema = z
  .object({
    role: z.enum(["EDITOR", "CONTRIBUTOR", "VIEWER"]),
    type: z.enum(["EMAIL", "LINK"]),
    email: z.string().optional(),
    expiresAt: z.string().optional(),
  })
  .superRefine((values, ctx) => {
    if (values.type === "EMAIL" && !values.email?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Enter an email address",
        path: ["email"],
      });
    }
  });

export type InviteFormValues = z.input<typeof inviteSchema>;
export type InviteFormOutput = z.output<typeof inviteSchema>;

export const INVITE_FORM_DEFAULTS: InviteFormValues = {
  role: "VIEWER",
  type: "EMAIL",
  email: "",
  expiresAt: "",
};

/**
 * Each invitation type sends only its own field: the address for email, the expiry for a link. The
 * expiry is typed as a local date and time; the API takes an instant, so it travels as UTC.
 */
export function toInvitePayload(values: InviteFormOutput): CreateInvitationRequest["body"] {
  return {
    role: values.role,
    type: values.type,
    email: values.type === "EMAIL" ? values.email?.trim() : undefined,
    expiresAt: values.type === "LINK" && values.expiresAt ? new Date(values.expiresAt).toISOString() : undefined,
  };
}
