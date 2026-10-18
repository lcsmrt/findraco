import type { RecurrenceDefinitionResponse } from "@/api/dtos/financialTransaction";
import { FormField } from "@/components/form/FormField";
import { NumberField } from "@/components/input/base/NumberField";
import { format } from "date-fns";
import { useWatch, type Control } from "react-hook-form";
import {
  lastInstallment,
  seriesParcelsChanged,
  type TransactionFormOutput,
  type TransactionFormValues,
} from "./transactionForm";

type TransactionFormControl = Control<TransactionFormValues, unknown, TransactionFormOutput>;

type InstallmentsFieldProps = {
  control: TransactionFormControl;
  disabled?: boolean;
} & (
  | { mode: "create" }
  | { mode: "seriesEdit"; definition: RecurrenceDefinitionResponse }
);

/**
 * The number of installments. Creating, it adds the current installment and previews the last
 * one; editing a series, it shows where the series stands and warns that a new count changes it all.
 */
export function InstallmentsField(props: InstallmentsFieldProps) {
  const { control, disabled } = props;

  return (
    <>
      <FormField
        control={control}
        name="parcelsNumber"
        label="Number of installments"
        description={
          props.mode === "seriesEdit"
            ? `Currently: parcel ${props.definition.firstParcel ?? 1} of ${props.definition.parcelsNumber}`
            : undefined
        }
      >
        {(field) => (
          <NumberField
            id={field.id}
            ref={field.ref}
            onBlur={field.onBlur}
            aria-invalid={field["aria-invalid"]}
            value={field.value ?? null}
            onValueChange={field.onChange}
            min={1}
            step={1}
            placeholder="e.g., 12"
            disabled={disabled}
          />
        )}
      </FormField>

      {props.mode === "seriesEdit" ? (
        <ParcelsChangedWarning control={control} definition={props.definition} />
      ) : (
        <>
          <FormField control={control} name="currentParcel" label="Current installment">
            {(field) => (
              <NumberField
                id={field.id}
                ref={field.ref}
                onBlur={field.onBlur}
                aria-invalid={field["aria-invalid"]}
                value={field.value ?? null}
                onValueChange={field.onChange}
                min={1}
                step={1}
                placeholder="1"
                disabled={disabled}
              />
            )}
          </FormField>
          <LastInstallmentPreview control={control} />
        </>
      )}
    </>
  );
}

type ParcelsChangedWarningProps = {
  control: TransactionFormControl;
  definition: RecurrenceDefinitionResponse;
};

function ParcelsChangedWarning({ control, definition }: ParcelsChangedWarningProps) {
  const parcelsNumber = useWatch({ control, name: "parcelsNumber" });
  if (!seriesParcelsChanged(definition, parcelsNumber)) return null;
  return (
    <p className="text-warning text-sm">Changing the number of parcels updates the whole series.</p>
  );
}

type LastInstallmentPreviewProps = {
  control: TransactionFormControl;
};

function LastInstallmentPreview({ control }: LastInstallmentPreviewProps) {
  const [date, parcelsNumber, currentParcel] = useWatch({
    control,
    name: ["date", "parcelsNumber", "currentParcel"],
  });
  const last = lastInstallment(date, parcelsNumber, currentParcel);
  if (!last) return null;
  return (
    <p className="text-muted-foreground text-sm">
      Last installment: {last.number}/{last.number} — {format(last.month, "MM/yyyy")}
    </p>
  );
}
