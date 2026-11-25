import type { Contact } from "@/api/dtos/contact";
import { useCreateContact, useRenameContact } from "@/api/services/useContactService";
import { SessionExpiredError } from "@/api/clients/sessionExpiredError";
import { problemToast, problemType } from "@/api/utils/problems";
import { useState } from "react";
import { toast } from "sonner";
import type { ContactNameFormOutput } from "./contactNameForm";

type UseContactNameSubmitArgs = { onDone: () => void } & (
  | { mode: "create" }
  | { mode: "rename"; contact: Contact }
);

/**
 * Submits a contact's name: creates a contact or renames the given one, then calls `onDone`. A name another
 * active contact has stays on the form as a field error, and anything else is a toast.
 */
export function useContactNameSubmit(args: UseContactNameSubmitArgs) {
  const [isNameTaken, setIsNameTaken] = useState(false);

  function handleError(error: Error) {
    if (error instanceof SessionExpiredError) return;
    if (problemType(error) === "contact-name-taken") {
      setIsNameTaken(true);
      return;
    }
    const { message, description } = problemToast(error);
    toast.error(message, description ? { description } : undefined);
  }

  const createContact = useCreateContact({ showErrorToast: false, onSuccess: args.onDone, onError: handleError });
  const renameContact = useRenameContact({
    showErrorToast: false,
    onSuccess: args.onDone,
    onError: handleError,
    // Someone renamed or changed it meanwhile; the contacts reload, and the form closes as other edits do.
    onStale: args.onDone,
  });

  function submit({ name }: ContactNameFormOutput) {
    setIsNameTaken(false);
    if (args.mode === "rename") {
      renameContact.mutate({ params: { id: args.contact.id }, body: { name, version: args.contact.version } });
      return;
    }
    createContact.mutate({ body: { name } });
  }

  return {
    submit,
    isSubmitting: createContact.isPending || renameContact.isPending,
    isNameTaken,
  };
}
