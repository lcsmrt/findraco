import type { Contact } from "@/api/dtos/contact";
import { Button } from "@/components/button/base/Button";
import { Text } from "@/components/typography/base/Text";
import { XIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { contactBalanceLabel } from "./contactBalance";

/** Why an action on a contact was refused, and what to do instead. */
export type ContactNotice = { kind: "balance"; contact: Contact } | { kind: "in-use"; contact: Contact };

type ContactNoticeViewProps = {
  notice: ContactNotice;
  onArchive: (contact: Contact) => void;
  onDismiss: () => void;
};

/** The refusal of an archive (settle the balance first) or of a delete (archive it instead). */
export function ContactNoticeView({ notice, onArchive, onDismiss }: ContactNoticeViewProps) {
  const { t } = useTranslation();

  const { contact } = notice;

  return (
    <div role="alert" className="border-border bg-muted/40 flex items-start justify-between gap-3 rounded-lg border p-3">
      <div className="flex min-w-0 flex-col gap-1">
        {notice.kind === "balance" ? (
          <>
            <Text variant="label">{t("contacts.notice.balance")}</Text>
            <Text variant="secondary" numeric>
              {t("contacts.notice.balanceOf", { name: contact.name, balance: contactBalanceLabel(t, contact) })}
            </Text>
          </>
        ) : (
          <>
            <Text variant="secondary">{t("contacts.notice.inUse", { name: contact.name })}</Text>
            <div>
              <Button type="button" variant="outline" size="sm" onClick={() => onArchive(contact)}>
                {t("contacts.actions.archive")}
              </Button>
            </div>
          </>
        )}
      </div>
      <Button type="button" variant="ghost" size="icon-sm" aria-label={t("contacts.notice.dismiss")} onClick={onDismiss}>
        <XIcon />
      </Button>
    </div>
  );
}
