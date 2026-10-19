import type { Invitation } from "@/api/dtos";

/** How an invitation is named in the list and in the revoke confirmation. */
export function invitationLabel(invitation: Invitation): string {
  return invitation.type === "EMAIL"
    ? (invitation.email ?? "Email invitation")
    : "Link invitation";
}
