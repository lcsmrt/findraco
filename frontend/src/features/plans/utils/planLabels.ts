import type { TFunction } from "i18next";
import { InvitationStatus, PlanRole } from "@/api/dtos";

/** Role names in the language in use; a Select takes them as its `items` record. */
export function buildRoleLabels(t: TFunction): Record<PlanRole, string> {
  return {
    OWNER: t("plans.roles.owner"),
    EDITOR: t("plans.roles.editor"),
    CONTRIBUTOR: t("plans.roles.contributor"),
    VIEWER: t("plans.roles.viewer"),
  };
}

export const ROLE_OPTIONS: PlanRole[] = [
  "EDITOR",
  "CONTRIBUTOR",
  "VIEWER",
];

export function buildStatusLabels(t: TFunction): Record<InvitationStatus, string> {
  return {
    PENDING: t("plans.invitationStatus.pending"),
    ACCEPTED: t("plans.invitationStatus.accepted"),
    EXPIRED: t("plans.invitationStatus.expired"),
    REVOKED: t("plans.invitationStatus.revoked"),
  };
}
