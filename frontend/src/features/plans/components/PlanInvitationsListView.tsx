import type { Invitation, InvitationStatus } from "@/api/dtos";
import { Badge } from "@/components/badge/base/Badge";
import { Button } from "@/components/button/base/Button";
import { Spinner } from "@/components/spinner/base/Spinner";
import { Text } from "@/components/typography/base/Text";
import { formatDateTime } from "@/utils/dates";
import { Trash2Icon } from "lucide-react";
import { buildRoleLabels, buildStatusLabels } from "../utils/planLabels";
import { invitationLabel } from "./invitationLabel";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const statusLabels = buildStatusLabels(t);
  const roleLabels = buildRoleLabels(t);

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
        {t("plans.planInvitationsListView.noInvitationsCreatedForThis")}
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
              <Badge variant="outline">{roleLabels[invitation.role]}</Badge>
              <Badge variant={STATUS_VARIANTS[invitation.status]}>
                {statusLabels[invitation.status]}
              </Badge>
              {invitation.expiresAt && (
                <Text variant="caption">
                  {t("plans.planInvitationsListView.expiresOn", {
                    date: formatDateTime(new Date(invitation.expiresAt)),
                  })}
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
              aria-label={t("plans.planInvitationsListView.revoke", {
                name: invitationLabel(invitation),
              })}
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
