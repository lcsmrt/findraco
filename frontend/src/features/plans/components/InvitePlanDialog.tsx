import type { Invitation } from "@/api/dtos";
import { useCreateInvitation } from "@/api/services/useInvitationService";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { type InviteFormOutput, toInvitePayload } from "./inviteForm";
import { InvitePlanDialogView } from "./InvitePlanDialogView";

type InvitePlanDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  planId: number;
};

function buildInvitationLink(invitation: Invitation): string {
  const relative = invitation.link ?? `/invitation/${invitation.token}`;
  return `${window.location.origin}${relative}`;
}

export function InvitePlanDialog({
  open,
  onOpenChange,
  planId,
}: InvitePlanDialogProps) {
  const [createdInvitation, setCreatedInvitation] = useState<Invitation | null>(
    null,
  );

  useEffect(() => {
    setCreatedInvitation(null);
  }, [open]);

  const { mutate: createInvitation, isPending } = useCreateInvitation({
    onSuccess: (invitation) => setCreatedInvitation(invitation),
  });

  function handleCreate(values: InviteFormOutput) {
    createInvitation({ params: { planId }, body: toInvitePayload(values) });
  }

  function copyLink() {
    if (!createdInvitation) return;
    navigator.clipboard.writeText(buildInvitationLink(createdInvitation));
    toast.success("Link copied to clipboard.");
  }

  return (
    <InvitePlanDialogView
      open={open}
      onOpenChange={onOpenChange}
      createdInvitation={createdInvitation}
      invitationLink={createdInvitation ? buildInvitationLink(createdInvitation) : null}
      isCreating={isPending}
      onCreate={handleCreate}
      onCopyLink={copyLink}
    />
  );
}
