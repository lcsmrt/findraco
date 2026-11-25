import type { Contact } from "@/api/dtos/contact";
import { Text } from "@/components/typography/base/Text";
import type { TypographyVariant } from "@/components/typography/base/typographyVariants";
import { cn } from "@/lib/mergeClasses";
import { useTranslation } from "react-i18next";
import { contactBalance, contactBalanceLabel } from "./contactBalance";

type ContactBalanceProps = {
  contact: Pick<Contact, "owed" | "credit">;
  variant?: TypographyVariant;
  className?: string;
};

const TONE_CLASS = {
  owes: undefined,
  credit: "text-success",
  settled: "text-muted-foreground",
} as const;

/** What the contact owes ("Owes R$ 50,00"), the credit it holds, or "Settled". */
export function ContactBalance({ contact, variant = "secondary", className }: ContactBalanceProps) {
  const { t } = useTranslation();

  const { kind } = contactBalance(contact);

  return (
    <Text variant={variant} numeric className={cn("whitespace-nowrap", TONE_CLASS[kind], className)}>
      {contactBalanceLabel(t, contact)}
    </Text>
  );
}
