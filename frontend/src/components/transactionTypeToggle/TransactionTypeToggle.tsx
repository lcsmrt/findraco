import type { TransactionType } from "@/api/dtos/transaction";
import { ToggleGroup, ToggleGroupItem } from "@/components/toggleGroup/base/ToggleGroup";
import { BanknoteArrowDownIcon, BanknoteArrowUpIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

type TransactionTypeToggleProps = {
  value: TransactionType;
  onChange: (value: TransactionType) => void;
  disabled?: boolean;
};

export function TransactionTypeToggle({ value, onChange, disabled }: TransactionTypeToggleProps) {
  const { t } = useTranslation();

  return (
    <ToggleGroup
      aria-label={t("components.transactionTypeToggle.transactionType")}
      variant="outline"
      value={[value]}
      // Clicking the pressed option would empty the group; a transaction always has a type.
      onValueChange={([next]) => next && onChange(next)}
      disabled={disabled}
      className="w-full flex-nowrap"
    >
      <ToggleGroupItem value="DEBIT" tone="destructive" className="flex-1">
        <BanknoteArrowDownIcon />
        {t("components.transactionTypeToggle.debit")}
      </ToggleGroupItem>
      <ToggleGroupItem value="CREDIT" tone="success" className="flex-1">
        <BanknoteArrowUpIcon />
        {t("components.transactionTypeToggle.credit")}
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
