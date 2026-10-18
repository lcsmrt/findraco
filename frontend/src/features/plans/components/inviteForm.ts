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

/** Each invitation type sends only its own field: the address for email, the expiry for a link. */
export function toInvitePayload(values: InviteFormOutput): CreateInvitationRequest["body"] {
  return {
    role: values.role,
    type: values.type,
    email: values.type === "EMAIL" ? values.email?.trim() : undefined,
    expiresAt: values.type === "LINK" && values.expiresAt ? values.expiresAt : undefined,
  };
}
