import type { Contact } from "@/api/dtos/contact";
import { Button } from "@/components/button/base/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/dropdown/base/Dropdown";
import { ArchiveIcon, ArchiveRestoreIcon, EllipsisIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { useTranslation } from "react-i18next";

type ContactActionsMenuProps = {
  contact: Contact;
  /** What the menu button is called for a screen reader. */
  label: string;
  disabled?: boolean;
  onRename: (contact: Contact) => void;
  onArchive: (contact: Contact) => void;
  onUnarchive: (contact: Contact) => void;
  onDelete: (contact: Contact) => void;
};

/** What the user may do with a contact: rename it, archive or unarchive it, delete it. */
export function ContactActionsMenu({
  contact,
  label,
  disabled,
  onRename,
  onArchive,
  onUnarchive,
  onDelete,
}: ContactActionsMenuProps) {
  const { t } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" size="icon" aria-label={label} disabled={disabled}>
            <EllipsisIcon />
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="min-w-44">
        <DropdownMenuItem onClick={() => onRename(contact)}>
          <PencilIcon />
          {t("contacts.actions.rename")}
        </DropdownMenuItem>
        {contact.archived ? (
          <DropdownMenuItem onClick={() => onUnarchive(contact)}>
            <ArchiveRestoreIcon />
            {t("contacts.actions.unarchive")}
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={() => onArchive(contact)}>
            <ArchiveIcon />
            {t("contacts.actions.archive")}
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={() => onDelete(contact)}>
          <Trash2Icon />
          {t("contacts.actions.delete")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
