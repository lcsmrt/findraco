import type { Invitation } from "@/api/dtos";
import {
  useGetPlanInvitations,
  useRevokeInvitation,
} from "@/api/services/useInvitationService";
import { useConfirm } from "@/components/dialog/useConfirm";
import { invitationLabel } from "./invitationLabel";
import { PlanInvitationsListView } from "./PlanInvitationsListView";
import { useTranslation } from "react-i18next";

type PlanInvitationsListProps = {
  planId: number;
};

export function PlanInvitationsList({ planId }: PlanInvitationsListProps) {
  const { t } = useTranslation();

  const { data: invitations = [], isLoading } =
    useGetPlanInvitations(planId);
  const confirm = useConfirm();
  const { mutate: revokeInvitation } = useRevokeInvitation();

  async function handleRevoke(invitation: Invitation) {
    const confirmed = await confirm({
      title: t("plans.planInvitationsList.revokeInvitation"),
      description: t("plans.planInvitationsList.revokeDescription", { name: invitationLabel(invitation) }),
      confirmLabel: t("plans.planInvitationsList.revoke"),
      cancelLabel: t("common.cancel"),
      variant: "destructive",
    });
    if (confirmed) {
      revokeInvitation({ params: { planId, invitationId: invitation.id } });
    }
  }

  return (
    <PlanInvitationsListView
      invitations={invitations}
      isLoading={isLoading}
      onRevoke={handleRevoke}
    />
  );
}
