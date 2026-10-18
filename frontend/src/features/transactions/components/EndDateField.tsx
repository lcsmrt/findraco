import { Badge } from "@/components/badge/base/Badge";
import { DatePicker } from "@/components/input/DatePicker";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/input/base/Field";
import { useId } from "react";
import { Controller, type Control } from "react-hook-form";
import type { TransactionFormOutput, TransactionFormValues } from "./transactionForm";

type EndDateFieldProps = {
  control: Control<TransactionFormValues, unknown, TransactionFormOutput>;
  disabled?: boolean;
};

/** A recurring series' end date, empty for an ongoing series; used by create and series edit. */
export function EndDateField({ control, disabled }: EndDateFieldProps) {
  const id = useId();

  return (
    // The "Ongoing" badge shares the label's row, a layout FormField does not offer.
    <Controller
      control={control}
      name="endDate"
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <div className="flex items-center justify-between">
            <FieldLabel htmlFor={id}>End date</FieldLabel>
            {!field.value && <Badge variant="secondary">Ongoing</Badge>}
          </div>
          <DatePicker
            id={id}
            value={field.value}
            onChange={field.onChange}
            disabled={disabled}
            className="w-full"
          />
          <FieldError errors={[fieldState.error]} />
          <FieldDescription>Leave empty to keep this series ongoing, with no end date.</FieldDescription>
        </Field>
      )}
    />
  );
}
