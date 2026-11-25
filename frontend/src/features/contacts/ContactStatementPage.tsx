import { useGetContactStatement } from "@/api/services/useContactService";
import { useAddTransaction } from "@/app/providers/useAddTransaction";
import { PATHS } from "@/app/routing/paths";
import { ContactNameDialog } from "@/components/contact/ContactNameDialog";
import { ContactNoticeView } from "@/components/contact/ContactNoticeView";
import { useContactActions } from "@/components/contact/useContactActions";
import { usePlanPermissions } from "@/hooks/usePlanPermissions";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { ContactStatementView } from "./components/ContactStatementView";

/** One contact's statement, under Plans: what it owes and for what, with the controls to record a payment. */
export function ContactStatementPage() {
  const { t } = useTranslation();

  const contactId = Number(useParams().contactId);
  const { data: statement, isLoading, isError, refetch } = useGetContactStatement(
    Number.isInteger(contactId) ? contactId : null,
  );
  // A payment or a change of the contact moves money out of the plan's spending: the role that may attribute to others.
  const { canAttributeToOthers } = usePlanPermissions();
  const { openAdd } = useAddTransaction();
  const navigate = useNavigate();
  const actions = useContactActions({ onDeleted: () => navigate(PATHS.plans) });
  const [isRenameOpen, setIsRenameOpen] = useState(false);

  const contact = statement?.contact;

  function handleRecordPayment() {
    if (!contact) return;
    openAdd({
      contact: { id: contact.id, name: contact.name },
      description: t("contacts.statement.paymentDescription", { name: contact.name }),
    });
  }

  return (
    <>
      <ContactStatementView
        statement={statement}
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
        onRetry={() => void refetch()}
        onRecordPayment={handleRecordPayment}
        onRename={() => setIsRenameOpen(true)}
        onArchive={() => contact && actions.archive(contact)}
        onUnarchive={() => contact && actions.unarchive(contact)}
        onDelete={() => contact && actions.remove(contact)}
      />
      {contact && (
        <ContactNameDialog mode="rename" contact={contact} open={isRenameOpen} onOpenChange={setIsRenameOpen} />
      )}
    </>
  );
}
