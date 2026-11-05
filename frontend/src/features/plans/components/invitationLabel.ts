import type { Invitation } from "@/api/dtos";
import { i18n } from "@/i18n/i18n";

/** How an invitation is named in the list and in the revoke confirmation. */
export function invitationLabel(invitation: Invitation): string {
  return invitation.type === "EMAIL"
    ? (invitation.email ?? i18n.t("plans.invitationLabel.email"))
    : i18n.t("plans.invitationLabel.link");
}
