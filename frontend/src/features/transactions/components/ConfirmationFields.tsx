import { Field, FieldDescription, FieldLabel } from "@/components/input/base/Field";
import { Switch } from "@/components/input/base/Switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/toggleGroup/base/ToggleGroup";
import { Controller, type Control } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { TransactionFormOutput, TransactionFormValues } from "./transactionForm";

type ConfirmationFieldProps = {
  control: Control<TransactionFormValues, unknown, TransactionFormOutput>;
  disabled?: boolean;
};

/** A series' template: whether its occurrences stay forecast until a member confirms them. */
export function RequiresConfirmationField({ control, disabled }: ConfirmationFieldProps) {
  const { t } = useTranslation();

  return (
    // A switch sits beside its label, a layout FormField does not offer.
    <Controller
      control={control}
      name="requiresConfirmation"
      render={({ field }) => (
        <Field orientation="horizontal">
          <Switch
            id="transaction-requires-confirmation"
            checked={field.value}
            onCheckedChange={field.onChange}
            disabled={disabled}
          />
          <div className="flex flex-col gap-1">
            <FieldLabel htmlFor="transaction-requires-confirmation">
              {t("transactions.confirmationFields.requiresConfirmation")}
            </FieldLabel>
            <FieldDescription>
              {t("transactions.confirmationFields.staysForecastUntilConfirmed")}
            </FieldDescription>
          </div>
        </Field>
      )}
    />
  );
}

/** Whether this occurrence counts as actual; saving sends what it shows. */
export function StatusField({ control, disabled }: ConfirmationFieldProps) {
  const { t } = useTranslation();

  return (
    // The toggle group names itself, a layout FormField's label-for-input does not fit.
    <Controller
      control={control}
      name="confirmed"
      render={({ field }) => (
        <Field>
          <FieldLabel>{t("transactions.confirmationFields.status")}</FieldLabel>
          <ToggleGroup
            aria-label={t("transactions.confirmationFields.status")}
            variant="outline"
            tone="primary"
            value={[field.value ? "ACTUAL" : "FORECAST"]}
            onValueChange={([next]) => {
              if (next) field.onChange(next === "ACTUAL");
            }}
            disabled={disabled}
            className="w-full flex-nowrap"
          >
            <ToggleGroupItem value="FORECAST" className="flex-1">
              {t("transactions.confirmationFields.forecast")}
            </ToggleGroupItem>
            <ToggleGroupItem value="ACTUAL" className="flex-1">
              {t("transactions.confirmationFields.actual")}
            </ToggleGroupItem>
          </ToggleGroup>
        </Field>
      )}
    />
  );
}
