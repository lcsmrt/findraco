import type { Invitation, InvitationStatus } from "@/api/dtos";
import { Badge } from "@/components/badge/base/Badge";
import { Button } from "@/components/button/base/Button";
import { Spinner } from "@/components/spinner/base/Spinner";
import { Text } from "@/components/typography/base/Text";
import { format } from "date-fns";
import { Trash2Icon } from "lucide-react";
import { ROLE_LABELS, STATUS_LABELS } from "../utils/planLabels";
import { invitationLabel } from "./invitationLabel";

const STATUS_VARIANTS: Record<
  InvitationStatus,
  "secondary" | "success" | "outline" | "destructive"
> = {
  PENDING: "secondary",
  ACCEPTED: "success",
  EXPIRED: "outline",
  REVOKED: "destructive",
};

type PlanInvitationsListViewProps = {
  invitations: Invitation[];
  isLoading: boolean;
  onRevoke: (invitation: Invitation) => void;
};

export function PlanInvitationsListView({
  invitations,
  isLoading,
  onRevoke,
}: PlanInvitationsListViewProps) {
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
              aria-label={`Revoke the invitation for ${invitationLabel(invitation)}`}
              onClick={() => onRevoke(invitation)}
            >
              <Trash2Icon className="h-4 w-4" />
            </Button>
          )}
        </li>
      ))}
    </ul>
  );
}
