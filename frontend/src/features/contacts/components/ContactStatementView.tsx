import type { ContactStatement, ContactStatementMonth } from "@/api/dtos/contact";
import { PATHS } from "@/app/routing/paths";
import { Button } from "@/components/button/base/Button";
import { buttonVariants } from "@/components/button/base/buttonVariants";
import { ContactActionsMenu } from "@/components/contact/ContactActionsMenu";
import { ContactBalance } from "@/components/contact/ContactBalance";
import { Money } from "@/components/money/Money";
import { PageHeader } from "@/components/pageHeader/PageHeader";
import { Skeleton } from "@/components/skeleton/base/Skeleton";
import { Heading } from "@/components/typography/base/Heading";
import { Text } from "@/components/typography/base/Text";
import { cn } from "@/lib/mergeClasses";
import { formatDate, formatPattern } from "@/utils/dates";
import { formatMoney } from "@/utils/money";
import { ChevronLeftIcon, HandCoinsIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { shareStatusLabel, STATUS_TONE_CLASS } from "./statementLabels";

const MONTH_HEADING_PATTERN = "MMMM yyyy";

type MonthSectionProps = {
  month: ContactStatementMonth;
};

/** One calendar month: the purchases the contact took a share of, then the payments it made. */
function MonthSection({ month }: MonthSectionProps) {
  const { t } = useTranslation();

  // The API names a month `yyyy-MM`; its first day is a date the formatter reads.
  const heading = formatPattern(`${month.month}-01`, MONTH_HEADING_PATTERN);

  return (
    <section className="flex flex-col gap-2">
      <Heading level={2} variant="title" className="capitalize">
        {heading}
      </Heading>
      <ul className="border-border bg-card divide-y rounded-lg border">
        {month.shares.map((share) => (
          <li key={share.participantId} className="flex flex-col gap-0.5 px-3 py-2.5">
            <span className="flex items-baseline justify-between gap-3">
              <Text variant="label" className="min-w-0 truncate">
                {share.description}
              </Text>
              <Money value={share.share} variant="label" className="shrink-0" />
            </span>
            <span className="flex flex-wrap items-baseline justify-between gap-x-3">
              <Text variant="caption">{formatDate(share.date)}</Text>
              <Text variant="secondary" numeric className={cn("text-right", STATUS_TONE_CLASS[share.status])}>
                {shareStatusLabel(t, share)}
              </Text>
            </span>
          </li>
        ))}
        {month.repayments.map((payment) => (
          <li key={payment.transactionId} className="flex flex-col gap-0.5 px-3 py-2.5">
            <span className="flex items-baseline justify-between gap-3">
              <Text variant="label" className="min-w-0 truncate">
                {t("contacts.statement.payment")}
              </Text>
              <Money value={payment.amount} tone="income" variant="label" className="shrink-0" />
            </span>
            <span className="flex flex-wrap items-baseline justify-between gap-x-3">
              <Text variant="caption">{formatDate(payment.date)}</Text>
              {payment.unallocated > 0 && (
                <Text variant="secondary" numeric className="text-right">
                  {t("contacts.statement.unallocated", { amount: formatMoney(payment.unallocated) })}
                </Text>
              )}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

type ContactStatementViewProps = {
  /** Undefined while loading or when it failed to load. */
  statement: ContactStatement | undefined;
  isLoading: boolean;
  isError: boolean;
  /** Owners and editors record payments and change the contact; every other role only reads. */
  canManage: boolean;
  /** An archive or delete in flight: the menu waits for it. */
  isBusy: boolean;
  /** What a refused archive or delete tells the user, under the balance. */
  notice: ReactNode;
  onRetry: () => void;
  onRecordPayment: () => void;
  onRename: () => void;
  onArchive: () => void;
  onUnarchive: () => void;
  onDelete: () => void;
};

/** One contact's account: its balance first, then each month's purchases and payments, newest month first. */
export function ContactStatementView({
  statement,
  isLoading,
  isError,
  canManage,
  isBusy,
  notice,
  onRetry,
  onRecordPayment,
  onRename,
  onArchive,
  onUnarchive,
  onDelete,
}: ContactStatementViewProps) {
  const { t } = useTranslation();

  const contact = statement?.contact;
  const showActions = canManage && contact !== undefined;

  return (
    <div className="flex w-full flex-col gap-6 px-4">
      <Link to={PATHS.plans} className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "-ml-2 w-fit")}>
        <ChevronLeftIcon />
        {t("contacts.statement.backToPlans")}
      </Link>

      <PageHeader
        title={contact?.name ?? t("contacts.statement.fallbackTitle")}
        // The name is what the user typed, up to 60 characters: it wraps, since nothing else on the page shows it in full.
        wrapTitle
        actions={
          showActions && (
            <>
              {!contact.archived && (
                <Button variant="outline" onClick={onRecordPayment}>
                  <HandCoinsIcon className="h-4 w-4" />
                  {t("contacts.statement.recordPayment")}
                </Button>
              )}
              <ContactActionsMenu
                contact={contact}
                label={t("contacts.statement.moreActions")}
                disabled={isBusy}
                onRename={onRename}
                onArchive={onArchive}
                onUnarchive={onUnarchive}
                onDelete={onDelete}
              />
            </>
          )
        }
      />

      {notice}

      {isLoading && (
        <div role="status" aria-label={t("contacts.statement.loading")} className="flex flex-col gap-4">
          <Skeleton className="h-12" />
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
      )}

      {isError && (
        <div role="alert" className="flex flex-col items-center gap-3 py-10">
          <Text as="p" className="text-destructive text-center">
            {t("contacts.statement.loadError")}
          </Text>
          <Button type="button" variant="outline" onClick={onRetry}>
            {t("common.tryAgain")}
          </Button>
        </div>
      )}

      {statement && (
        <>
          <div className="border-border bg-card flex flex-col gap-1 rounded-lg border p-4">
            <ContactBalance contact={statement} variant="headline" />
          </div>
          {statement.months.length === 0 ? (
            <Text as="p" variant="secondary" className="py-6 text-center">
              {t("contacts.statement.empty")}
            </Text>
          ) : (
            <div className="flex flex-col gap-6">
              {statement.months.map((month) => (
                <MonthSection key={month.month} month={month} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
