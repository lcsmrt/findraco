import type { TransactionKind } from "@/api/dtos/transaction";
import { FormField } from "@/components/form/FormField";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/input/base/Select";
import { useWatch, type Control, type UseFormSetValue } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { categoryTypeFor, hidesItems, KIND_LABEL_KEYS, kindsForType } from "../utils/movementKind";
import type { TransactionFormOutput, TransactionFormValues } from "./transactionForm";

// A Select needs a value for "no kind"; the form itself keeps `null`.
const NORMAL = "NORMAL";

type MovementKindFieldProps = {
  control: Control<TransactionFormValues, unknown, TransactionFormOutput>;
  setValue: UseFormSetValue<TransactionFormValues>;
  disabled?: boolean;
};

/**
 * How the row counts: a normal income or expense, a neutral movement, or (on a credit) a refund.
 * The kind decides which other fields the form shows, so changing it drops what no longer fits.
 */
export function MovementKindField({ control, setValue, disabled }: MovementKindFieldProps) {
  const { t } = useTranslation();

  const [type, recurring] = useWatch({ control, name: ["type", "recurring"] });
  const kinds = kindsForType(type);
  const labels = {
    [NORMAL]: t("transactions.kinds.normal"),
    ...Object.fromEntries(kinds.map((kind) => [kind, t(KIND_LABEL_KEYS[kind])])),
  };

  function handleChange(
    current: TransactionKind | null | undefined,
    value: string | null,
    onChange: (kind: TransactionKind | null) => void,
  ) {
    const next = kinds.find((kind) => kind === value) ?? null;
    onChange(next);
    // A refund sits in an expense category, so crossing it makes the chosen category the wrong type.
    if (categoryTypeFor(type, next) !== categoryTypeFor(type, current)) setValue("category", null);
    if (hidesItems(next)) setValue("items", []);
  }

  // A series carries no kind; turning repetition on clears it.
  if (recurring) return null;

  return (
    <FormField control={control} name="kind" label={t("transactions.kindField.movementKind")}>
      {(field) => (
        <Select
          value={field.value ?? NORMAL}
          items={labels}
          onValueChange={(value) => handleChange(field.value, value, field.onChange)}
          disabled={disabled}
        >
          <SelectTrigger id={field.id} className="w-full" aria-invalid={field["aria-invalid"]}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={NORMAL}>{labels[NORMAL]}</SelectItem>
            {kinds.map((kind) => (
              <SelectItem key={kind} value={kind}>
                {t(KIND_LABEL_KEYS[kind])}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </FormField>
  );
}
