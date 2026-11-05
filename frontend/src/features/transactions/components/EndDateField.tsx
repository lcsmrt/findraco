import { Badge } from "@/components/badge/base/Badge";
import { DatePicker } from "@/components/input/DatePicker";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/input/base/Field";
import { useId } from "react";
import { Controller, type Control } from "react-hook-form";
import type { TransactionFormOutput, TransactionFormValues } from "./transactionForm";
import { useTranslation } from "react-i18next";

type EndDateFieldProps = {
  control: Control<TransactionFormValues, unknown, TransactionFormOutput>;
  disabled?: boolean;
};

/** A recurring series' end date, empty for an ongoing series; used by create and series edit. */
export function EndDateField({ control, disabled }: EndDateFieldProps) {
  const { t } = useTranslation();

  const id = useId();

  return (
    // The "Ongoing" badge shares the label's row, a layout FormField does not offer.
    <Controller
      control={control}
      name="endDate"
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <div className="flex items-center justify-between">
            <FieldLabel htmlFor={id}>{t("transactions.endDateField.endDate")}</FieldLabel>
            {!field.value && (
              <Badge variant="secondary">{t("transactions.endDateField.ongoing")}</Badge>
            )}
          </div>
          <DatePicker
            id={id}
            ref={field.ref}
            onBlur={field.onBlur}
            value={field.value}
            onChange={field.onChange}
            disabled={disabled}
            className="w-full"
          />
          <FieldError errors={[fieldState.error]} />
          <FieldDescription>{t("transactions.endDateField.leaveEmptyToKeepThis")}</FieldDescription>
        </Field>
      )}
    />
  );
}
