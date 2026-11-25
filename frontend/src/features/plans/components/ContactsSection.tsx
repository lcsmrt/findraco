import type { Contact } from "@/api/dtos/contact";
import { useGetContacts } from "@/api/services/useContactService";
import { ContactNameDialog } from "@/components/contact/ContactNameDialog";
import { ContactNoticeView } from "@/components/contact/ContactNoticeView";
import { useContactActions } from "@/components/contact/useContactActions";
import { usePlanPermissions } from "@/hooks/usePlanPermissions";
import { useState } from "react";
import { ContactsSectionView } from "./ContactsSectionView";

type NameDialogState =
  | { open: false }
  | { open: true; mode: "create" }
  | { open: true; mode: "rename"; contact: Contact };

/** The Contacts card of the Plans page, below the members. */
export function ContactsSection() {
  // A contact moves money out of the plan's spending, so managing them follows attributing to others.
  const { canAttributeToOthers } = usePlanPermissions();
  const { data: contacts = [], isLoading, isError, refetch } = useGetContacts({ archived: true });
  const actions = useContactActions();
  const [nameDialog, setNameDialog] = useState<NameDialogState>({ open: false });

  return (
    <>
      <ContactsSectionView
        contacts={contacts}
        isLoading={isLoading}
        isError={isError}
        canManage={canAttributeToOthers}
        isBusy={actions.isPending}
        notice={
          actions.notice && (
            <ContactNoticeView
              notice={actions.notice}
              onArchive={actions.archive}
              onDismiss={actions.dismissNotice}
            />
          )
        }
        onCreate={() => setNameDialog({ open: true, mode: "create" })}
        onRetry={() => void refetch()}
        onRename={(contact) => setNameDialog({ open: true, mode: "rename", contact })}
        onArchive={actions.archive}
        onUnarchive={actions.unarchive}
        onDelete={actions.remove}
      />
      {nameDialog.open && nameDialog.mode === "create" && (
        <ContactNameDialog open mode="create" onOpenChange={() => setNameDialog({ open: false })} />
      )}
      {nameDialog.open && nameDialog.mode === "rename" && (
        <ContactNameDialog
          open
          mode="rename"
          contact={nameDialog.contact}
          onOpenChange={() => setNameDialog({ open: false })}
        />
      )}
    </>
  );
}
