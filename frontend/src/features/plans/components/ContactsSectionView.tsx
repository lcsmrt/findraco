import type { Contact } from "@/api/dtos/contact";
import { PATHS } from "@/app/routing/paths";
import { Button } from "@/components/button/base/Button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/card/base/Card";
import { ContactActionsMenu } from "@/components/contact/ContactActionsMenu";
import { ContactBalance } from "@/components/contact/ContactBalance";
import { Spinner } from "@/components/spinner/base/Spinner";
import { Heading } from "@/components/typography/base/Heading";
import { Text } from "@/components/typography/base/Text";
import { ChevronRightIcon, PlusIcon } from "lucide-react";
import type { ReactNode } from "react";
import { generatePath, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

type ContactRowProps = {
  contact: Contact;
  /** The row menu, which only a role that manages contacts gets. */
  menu: ReactNode;
};

/** One contact: its name and balance open its statement; the menu beside it changes the contact. */
function ContactRow({ contact, menu }: ContactRowProps) {
  return (
    <li className="border-border flex items-center gap-2 rounded-lg border">
      <Link
        to={generatePath(PATHS.contactStatement, { contactId: String(contact.id) })}
        className="hover:bg-muted/50 focus-visible:ring-ring flex min-w-0 flex-1 items-center justify-between gap-3 rounded-lg p-3 outline-none focus-visible:ring-3"
      >
        <span className="flex min-w-0 flex-col">
          <Text variant="label" className="truncate">
            {contact.name}
          </Text>
          <ContactBalance contact={contact} />
        </span>
        <ChevronRightIcon className="text-muted-foreground size-4 shrink-0" aria-hidden />
      </Link>
      {menu && <span className="shrink-0 pr-2">{menu}</span>}
    </li>
  );
}

type ContactsSectionViewProps = {
  /** Active and archived contacts, each flagged. */
  contacts: Contact[];
  isLoading: boolean;
  isError: boolean;
  /** Owners and editors create, rename, archive and delete; every other role only reads. */
  canManage: boolean;
  /** An archive or delete in flight: the menus wait for it. */
  isBusy: boolean;
  /** What a refused archive or delete tells the user, above the list. */
  notice: ReactNode;
  onCreate: () => void;
  onRetry: () => void;
  onRename: (contact: Contact) => void;
  onArchive: (contact: Contact) => void;
  onUnarchive: (contact: Contact) => void;
  onDelete: (contact: Contact) => void;
};

/** The Contacts card of the Plans page: who owes what, and the controls to manage them. */
export function ContactsSectionView({
  contacts,
  isLoading,
  isError,
  canManage,
  isBusy,
  notice,
  onCreate,
  onRetry,
  onRename,
  onArchive,
  onUnarchive,
  onDelete,
}: ContactsSectionViewProps) {
  const { t } = useTranslation();

  const active = contacts.filter((contact) => !contact.archived);
  const archived = contacts.filter((contact) => contact.archived);

  function menuFor(contact: Contact) {
    if (!canManage) return null;
    return (
      <ContactActionsMenu
        contact={contact}
        label={t("contacts.section.actionsFor", { name: contact.name })}
        disabled={isBusy}
        onRename={onRename}
        onArchive={onArchive}
        onUnarchive={onUnarchive}
        onDelete={onDelete}
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("contacts.section.title")}</CardTitle>
        {canManage && (
          <CardAction>
            <Button variant="outline" size="sm" onClick={onCreate}>
              <PlusIcon className="h-4 w-4" />
              {t("contacts.section.newContact")}
            </Button>
          </CardAction>
        )}
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {notice}
        {isLoading && (
          <div className="flex justify-center py-6">
            <Spinner />
          </div>
        )}
        {isError && (
          <div role="alert" className="flex flex-col items-center gap-3 py-6">
            <Text as="p" className="text-destructive text-center">
              {t("contacts.section.loadError")}
            </Text>
            <Button type="button" variant="outline" size="sm" onClick={onRetry}>
              {t("common.tryAgain")}
            </Button>
          </div>
        )}
        {!isLoading && !isError && contacts.length === 0 && (
          <div className="flex flex-col items-center gap-1 py-6 text-center">
            <Text variant="label">{t("contacts.section.emptyTitle")}</Text>
            <Text as="p" variant="secondary">
              {t("contacts.section.emptyHint")}
            </Text>
          </div>
        )}
        {active.length > 0 && (
          <ul className="flex flex-col gap-2">
            {active.map((contact) => (
              <ContactRow key={contact.id} contact={contact} menu={menuFor(contact)} />
            ))}
          </ul>
        )}
        {archived.length > 0 && (
          <section className="flex flex-col gap-2">
            <Heading level={3} variant="caption">
              {t("contacts.section.archived")}
            </Heading>
            <ul className="flex flex-col gap-2">
              {archived.map((contact) => (
                <ContactRow key={contact.id} contact={contact} menu={menuFor(contact)} />
              ))}
            </ul>
          </section>
        )}
      </CardContent>
    </Card>
  );
}
