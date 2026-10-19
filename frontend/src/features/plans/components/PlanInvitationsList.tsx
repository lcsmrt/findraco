import { Invitation, InvitationStatus } from "@/api/dtos";
import {
  useGetPlanInvitations,
  useRevokeInvitation,
} from "@/api/services/useInvitationService";
import { Badge } from "@/components/badge/base/Badge";
import { Button } from "@/components/button/base/Button";
import { useConfirm } from "@/components/dialog/useConfirm";
import { Spinner } from "@/components/spinner/base/Spinner";
import { Text } from "@/components/typography/base/Text";
import { format } from "date-fns";
import { Trash2Icon } from "lucide-react";
import { ROLE_LABELS, STATUS_LABELS } from "../utils/planLabels";

type PlanInvitationsListProps = {
  planId: number;
};

const STATUS_VARIANTS: Record<
  InvitationStatus,
  "secondary" | "success" | "outline" | "destructive"
> = {
  PENDING: "secondary",
  ACCEPTED: "success",
  EXPIRED: "outline",
  REVOKED: "destructive",
};

function invitationLabel(invitation: Invitation): string {
  return invitation.type === "EMAIL"
    ? (invitation.email ?? "Email invitation")
    : "Link invitation";
}

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

  if (isLoading) {
    return (
      <div className="flex justify-center py-6">
        <Spinner />
      </div>
    );
  }

  if (invitations.length === 0) {
    return (
      <Text as="p" variant="secondary" className="py-6 text-center">
        No invitations created for this plan yet.
      </Text>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {invitations.map((invitation) => (
        <li
          key={invitation.id}
          className="border-border flex items-center justify-between gap-3 rounded-lg border p-3"
        >
          <div className="flex flex-col gap-1">
            <Text variant="label">{invitationLabel(invitation)}</Text>
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge variant="outline">{ROLE_LABELS[invitation.role]}</Badge>
              <Badge variant={STATUS_VARIANTS[invitation.status]}>
                {STATUS_LABELS[invitation.status]}
              </Badge>
              {invitation.expiresAt && (
                <Text variant="caption">
                  Expires on{" "}
                  {format(new Date(invitation.expiresAt), "dd/MM/yyyy HH:mm")}
                </Text>
              )}
            </div>
          </div>

          {invitation.status === "PENDING" && (
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              className="text-muted-foreground hover:bg-accent hover:text-destructive rounded"
              onClick={() => handleRevoke(invitation)}
            >
              <Trash2Icon className="h-4 w-4" />
            </Button>
          )}
        </li>
      ))}
    </ul>
  );
}
