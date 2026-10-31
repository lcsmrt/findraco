import type { TransactionType } from "@/api/dtos/transaction";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/toggleGroup/base/ToggleGroup";
import { BanknoteArrowDownIcon, BanknoteArrowUpIcon } from "lucide-react";

type TransactionTypeToggleProps = {
  value: TransactionType;
  onChange: (value: TransactionType) => void;
  disabled?: boolean;
};

export function TransactionTypeToggle({
  value,
  onChange,
  disabled,
}: TransactionTypeToggleProps) {
  return (
    <ToggleGroup
      aria-label="Transaction type"
      variant="outline"
      value={[value]}
      // Clicking the pressed option would empty the group; a transaction always has a type.
      onValueChange={([next]) => next && onChange(next)}
      disabled={disabled}
      className="w-full flex-nowrap"
    >
      <ToggleGroupItem value="DEBIT" tone="destructive" className="flex-1">
        <BanknoteArrowDownIcon />
        Debit
      </ToggleGroupItem>
      <ToggleGroupItem value="CREDIT" tone="success" className="flex-1">
        <BanknoteArrowUpIcon />
        Credit
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
