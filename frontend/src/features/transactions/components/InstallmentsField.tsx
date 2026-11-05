import type { RecurrenceDefinitionResponse } from "@/api/dtos/transaction";
import { FormField } from "@/components/form/FormField";
import { NumberField } from "@/components/input/base/NumberField";
import { Text } from "@/components/typography/base/Text";
import { formatMonthYear } from "@/utils/dates";
import { useWatch, type Control } from "react-hook-form";
import {
  lastInstallment,
  seriesParcelsChanged,
  type TransactionFormOutput,
  type TransactionFormValues,
} from "./transactionForm";
import { useTranslation } from "react-i18next";

type TransactionFormControl = Control<TransactionFormValues, unknown, TransactionFormOutput>;

type InstallmentsFieldProps = {
  control: TransactionFormControl;
  disabled?: boolean;
} & (
  | { mode: "create" }
  | { mode: "seriesEdit"; definition: RecurrenceDefinitionResponse; occurrenceParcel: number }
);

/**
 * The number of installments. Creating, it adds the current installment and previews the last
 * one; editing a series, it shows which parcel the edited occurrence is and warns that a new count changes it all.
 */
export function InstallmentsField(props: InstallmentsFieldProps) {
  const { t } = useTranslation();

  const { control, disabled } = props;

  return (
    <>
      <FormField
        control={control}
        name="parcelsNumber"
        label={t("transactions.installmentsField.numberOfInstallments")}
        description={
          props.mode === "seriesEdit"
            ? t("transactions.installmentsField.currently", {
                parcel: props.occurrenceParcel,
                total: props.definition.parcelsNumber,
              })
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
            placeholder={t("transactions.installmentsField.eG12")}
            disabled={disabled}
          />
        )}
      </FormField>

      {props.mode === "seriesEdit" ? (
        <ParcelsChangedWarning control={control} definition={props.definition} />
      ) : (
        <>
          <FormField
            control={control}
            name="currentParcel"
            label={t("transactions.installmentsField.currentInstallment")}
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
  const { t } = useTranslation();

  const parcelsNumber = useWatch({ control, name: "parcelsNumber" });
  if (!seriesParcelsChanged(definition, parcelsNumber)) return null;
  return (
    <Text as="p" className="text-warning">
      {t("transactions.parcelsChangedWarning.changingTheNumberOfParcels")}
    </Text>
  );
}

type LastInstallmentPreviewProps = {
  control: TransactionFormControl;
};

function LastInstallmentPreview({ control }: LastInstallmentPreviewProps) {
  const { t } = useTranslation();

  const [date, parcelsNumber, currentParcel] = useWatch({
    control,
    name: ["date", "parcelsNumber", "currentParcel"],
  });
  const last = lastInstallment(date, parcelsNumber, currentParcel);
  if (!last) return null;
  return (
    <Text as="p" variant="secondary">
      {t("transactions.installmentsField.lastInstallment", {
        number: last.number,
        month: formatMonthYear(last.month),
      })}
    </Text>
  );
}
