import type { Contact } from "@/api/dtos/contact";
import { SessionExpiredError } from "@/api/clients/sessionExpiredError";
import {
  useArchiveContact,
  useDeleteContact,
  useUnarchiveContact,
} from "@/api/services/useContactService";
import { problemToast, problemType } from "@/api/utils/problems";
import { useConfirm } from "@/components/dialog/useConfirm";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import type { ContactNotice } from "./ContactNoticeView";

type UseContactActionsArgs = {
  /** Called once a contact is deleted, so a screen about it can leave. */
  onDeleted?: () => void;
};

/**
 * Archives, unarchives and deletes contacts for a screen. The two refusals the user can act on (a balance
 * still open, a contact in use) become a notice that says what to do; any other failure is a toast.
 */
export function useContactActions({ onDeleted }: UseContactActionsArgs = {}) {
  const { t } = useTranslation();

  const confirm = useConfirm();
  const [notice, setNotice] = useState<ContactNotice | null>(null);

  function reportError(error: Error) {
    if (error instanceof SessionExpiredError) return;
    const { message, description } = problemToast(error);
    toast.error(message, description ? { description } : undefined);
  }

  const archiveContact = useArchiveContact({ showErrorToast: false });
  const unarchiveContact = useUnarchiveContact();
  const deleteContact = useDeleteContact({ showErrorToast: false });

  function archive(contact: Contact) {
    setNotice(null);
    archiveContact.mutate(
      { params: { id: contact.id } },
      {
        onError: (error) => {
          if (problemType(error) === "contact-balance-not-zero") setNotice({ kind: "balance", contact });
          else reportError(error);
        },
      },
    );
  }

  function unarchive(contact: Contact) {
    setNotice(null);
    unarchiveContact.mutate({ params: { id: contact.id } });
  }

  async function remove(contact: Contact) {
    setNotice(null);
    const confirmed = await confirm({
      title: t("contacts.actions.deleteTitle", { name: contact.name }),
      description: t("contacts.actions.deleteDescription"),
      confirmLabel: t("contacts.actions.delete"),
      cancelLabel: t("common.cancel"),
      variant: "destructive",
    });
    if (!confirmed) return;
    deleteContact.mutate(
      { params: { id: contact.id } },
      {
        onSuccess: () => onDeleted?.(),
        onError: (error) => {
          if (problemType(error) === "contact-in-use") setNotice({ kind: "in-use", contact });
          else reportError(error);
        },
      },
    );
  }

  return {
    notice,
    dismissNotice: () => setNotice(null),
    archive,
    unarchive,
    remove,
    isPending: archiveContact.isPending || unarchiveContact.isPending || deleteContact.isPending,
  };
}
