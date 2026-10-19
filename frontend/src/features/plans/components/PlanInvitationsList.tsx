import type { Invitation } from "@/api/dtos";
import {
  useGetPlanInvitations,
  useRevokeInvitation,
} from "@/api/services/useInvitationService";
import { useConfirm } from "@/components/dialog/useConfirm";
import { invitationLabel } from "./invitationLabel";
import { PlanInvitationsListView } from "./PlanInvitationsListView";

type PlanInvitationsListProps = {
  planId: number;
};

export function PlanInvitationsList({ planId }: PlanInvitationsListProps) {
  const { data: invitations = [], isLoading } =
    useGetPlanInvitations(planId);
  const confirm = useConfirm();
  const { mutate: revokeInvitation } = useRevokeInvitation();

  async function handleRevoke(invitation: Invitation) {
    const confirmed = await confirm({
      title: "Revoke invitation",
      description: `Are you sure you want to revoke the invitation for ${invitationLabel(invitation)}?`,
      confirmLabel: "Revoke",
      cancelLabel: "Cancel",
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
