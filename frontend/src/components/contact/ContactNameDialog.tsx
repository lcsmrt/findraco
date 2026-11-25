import type { Contact } from "@/api/dtos/contact";
import { ContactNameDialogView } from "./ContactNameDialogView";
import { useContactNameSubmit } from "./useContactNameSubmit";

type ContactNameDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
} & ({ mode: "create" } | { mode: "rename"; contact: Contact });

/** Names a contact: a new one (`create`) or the given one (`rename`). */
export function ContactNameDialog(props: ContactNameDialogProps) {
  const { open, onOpenChange, mode } = props;
  const initialName = props.mode === "rename" ? props.contact.name : "";

  const { submit, isSubmitting, isNameTaken } = useContactNameSubmit(
    props.mode === "rename"
      ? { mode: "rename", contact: props.contact, onDone: () => onOpenChange(false) }
      : { mode: "create", onDone: () => onOpenChange(false) },
  );

  return (
    <ContactNameDialogView
      open={open}
      onOpenChange={onOpenChange}
      mode={mode}
      initialName={initialName}
      isSubmitting={isSubmitting}
      isNameTaken={isNameTaken}
      onSubmit={submit}
    />
  );
}
