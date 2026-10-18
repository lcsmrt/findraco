import type { FinancialTransactionCategory } from "@/api/dtos";
import { FinancialTransaction } from "@/api/dtos/financialTransaction";
import { useGetFinancialTransactionSeries } from "@/api/services/useFinancialTransactionService";
import { useGetPlanMembers } from "@/api/services/usePlanService";
import { useAuth } from "@/app/providers/useAuth";
import { usePlanContext } from "@/app/providers/usePlanContext";
import { Button } from "@/components/button/base/Button";
import { FormField } from "@/components/form/FormField";
import { FormSheet } from "@/components/form/FormSheet";
import { Checkbox } from "@/components/input/base/Checkbox";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/input/base/Field";
import { Input } from "@/components/input/base/Input";
import { CurrencyInput } from "@/components/input/CurrencyInput";
import { DatePicker } from "@/components/input/DatePicker";
import { ToggleGroup, ToggleGroupItem } from "@/components/toggleGroup/base/ToggleGroup";
import { TransactionTypeToggle } from "@/components/transactionTypeToggle/TransactionTypeToggle";
import { usePlanPermissions } from "@/hooks/usePlanPermissions";
import { zodResolver } from "@hookform/resolvers/zod";
import { CopyIcon, Trash2Icon } from "lucide-react";
import { useEffect, useRef } from "react";
import {
  Controller,
  useFieldArray,
  useForm,
  useWatch,
  type Control,
  type UseFormSetValue,
} from "react-hook-form";
import { AttributionFields } from "./AttributionFields";
import { CategoryCombobox } from "./CategoryCombobox";
import { EndDateField } from "./EndDateField";
import { InstallmentsField } from "./InstallmentsField";
import { ItemsField } from "./ItemsField";
import {
  TransactionFormMode,
  TransactionFormOutput,
  TransactionFormValues,
  buildDefaultValues,
  categoryAttribution,
  transactionFormSchema,
} from "./transactionForm";
import { useSeriesScope } from "./useSeriesScope";
import { useTransactionFormSubmit } from "./useTransactionFormSubmit";

type TransactionFormControl = Control<TransactionFormValues, unknown, TransactionFormOutput>;
type TransactionFormSetValue = UseFormSetValue<TransactionFormValues>;

const TITLES: Record<TransactionFormMode, string> = {
  create: "New Transaction",
  edit: "Edit Transaction",
  duplicate: "Duplicate Transaction",
};

type TransactionFormDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction?: FinancialTransaction;
  mode: TransactionFormMode;
  /** Edit footer, narrow screens (UX-02 AC 5). */
  onDuplicate?: (transaction: FinancialTransaction) => void;
  onDelete?: (transaction: FinancialTransaction) => void;
};

export function TransactionFormDrawer({
  open,
  onOpenChange,
  transaction,
  mode,
  onDuplicate,
  onDelete,
}: TransactionFormDrawerProps) {
  const isSeriesEdit = mode === "edit" && !!transaction?.seriesId;
  const { activePlanId } = usePlanContext();
  const currentUserId = useAuth().user?.id;
  const { data: members = [] } = useGetPlanMembers(activePlanId ?? undefined);
  const { canAttributeToOthers } = usePlanPermissions();
  const showAttribution = canAttributeToOthers && members.length > 1;
  const chooseScope = useSeriesScope();
  const { data: definition } = useGetFinancialTransactionSeries(transaction?.seriesId, {
    enabled: open && isSeriesEdit,
  });

  const { control, handleSubmit, setValue, reset } = useForm<
    TransactionFormValues,
    unknown,
    TransactionFormOutput
  >({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: buildDefaultValues(transaction, currentUserId, definition),
  });
  // The form owns the participants list: choosing an owned category replaces it too.
  const participants = useFieldArray({ control, name: "participants" });
  // Set by any change in AttributionFields: hand-edited participants win over the category's owner.
  const participantsTouchedRef = useRef(false);

  function applyCategoryAttribution(category: FinancialTransactionCategory | null | undefined) {
    if (!canAttributeToOthers) return;
    const attribution = categoryAttribution({
      mode,
      defaults: buildDefaultValues(transaction, currentUserId, definition),
      category,
      members,
      currentUserId,
      participantsTouched: participantsTouchedRef.current,
    });
    if (!attribution) return;
    setValue("attributionMode", attribution.attributionMode);
    setValue("splitMode", attribution.splitMode);
    participants.replace(attribution.participants);
  }

  useEffect(() => {
    participantsTouchedRef.current = false;
    reset(buildDefaultValues(transaction, currentUserId, definition));
  }, [transaction, open, reset, currentUserId, definition]);

  const { submit, isSubmitting: isPending } = useTransactionFormSubmit({
    mode,
    transaction,
    definition,
    showAttribution,
    currentUserId,
    chooseScope,
    onDone: () => onOpenChange(false),
  });

  return (
    <FormSheet
      open={open}
      onOpenChange={onOpenChange}
      title={isSeriesEdit ? "Edit series" : TITLES[mode]}
      onSubmit={handleSubmit(submit)}
      isSubmitting={isPending}
      submitLabel={mode === "edit" ? "Save" : "Create"}
      submitDisabled={isSeriesEdit && !definition}
      mobileActions={
        mode === "edit" &&
        transaction &&
        (onDuplicate || onDelete) && (
          <>
            {onDelete && (
              <Button
                variant="outline"
                type="button"
                className="text-destructive hover:text-destructive flex-1"
                disabled={isPending}
                onClick={() => onDelete(transaction)}
              >
                <Trash2Icon className="h-4 w-4" />
                Delete
              </Button>
            )}
            {onDuplicate && (
              <Button
                variant="outline"
                type="button"
                className="flex-1"
                disabled={isPending}
                onClick={() => onDuplicate(transaction)}
              >
                <CopyIcon className="h-4 w-4" />
                Duplicate
              </Button>
            )}
          </>
        )
      }
    >
      {isSeriesEdit && !definition && <p className="text-muted-foreground text-sm">Loading…</p>}

      <FieldGroup>
        {!isSeriesEdit && <TypeField control={control} setValue={setValue} disabled={isPending} />}

        <FormField control={control} name="description" label="Description">
          {(field) => (
            <Input {...field} placeholder="e.g., Rent, Salary, Groceries" disabled={isPending} />
          )}
        </FormField>

        <FormField control={control} name="amount" label="Amount">
          {(field) => (
            <CurrencyInput
              {...field}
              onValueChange={field.onChange}
              placeholder="R$ 0,00"
              disabled={isPending}
            />
          )}
        </FormField>

        <CategoryField
          control={control}
          onCategoryChange={applyCategoryAttribution}
          disabled={isPending}
        />

        {!isSeriesEdit && (
          <FormField control={control} name="date" label="Date">
            {(field) => (
              <DatePicker
                id={field.id}
                ref={field.ref}
                onBlur={field.onBlur}
                value={field.value}
                // Clearing the text keeps the last date: a transaction always has one.
                onChange={(date) => date && field.onChange(date)}
                disabled={isPending}
                className="w-full"
              />
            )}
          </FormField>
        )}

        {!isSeriesEdit && (
          <ItemsField
            control={control}
            disabled={isPending}
            renderCategory={(picker) => (
              <CategoryCombobox
                value={picker.value}
                onValueChange={picker.onValueChange}
                type={picker.type}
                disabled={picker.disabled}
              />
            )}
          />
        )}

        {showAttribution && (
          <AttributionFields
            control={control}
            participants={participants}
            onEdit={() => {
              participantsTouchedRef.current = true;
            }}
            members={members}
            currentUserId={currentUserId}
            disabled={isPending}
          />
        )}

        {isSeriesEdit && definition?.mode === "INSTALLMENT" && (
          <InstallmentsField
            mode="seriesEdit"
            definition={definition}
            control={control}
            disabled={isPending}
          />
        )}

        {isSeriesEdit && definition?.mode === "RECURRING" && (
          <EndDateField control={control} disabled={isPending} />
        )}

        {mode === "create" && (
          <RecurrenceFields control={control} setValue={setValue} disabled={isPending} />
        )}
      </FieldGroup>
    </FormSheet>
  );
}

type SectionProps = {
  control: TransactionFormControl;
  setValue: TransactionFormSetValue;
  disabled: boolean;
};

function TypeField({ control, setValue, disabled }: SectionProps) {
  return (
    // The toggle group names itself, a layout FormField's label-for-input does not fit.
    <Controller
      control={control}
      name="type"
      render={({ field }) => (
        <Field>
          <FieldLabel>Type</FieldLabel>
          <TransactionTypeToggle
            value={field.value}
            onChange={(type) => {
              field.onChange(type);
              // Categories belong to one type, so the chosen one no longer fits.
              setValue("category", null);
            }}
            disabled={disabled}
          />
        </Field>
      )}
    />
  );
}

type CategoryFieldProps = {
  control: TransactionFormControl;
  onCategoryChange: (category: FinancialTransactionCategory | null | undefined) => void;
  disabled: boolean;
};

function CategoryField({ control, onCategoryChange, disabled }: CategoryFieldProps) {
  const type = useWatch({ control, name: "type" });

  return (
    <FormField control={control} name="category" label="Category">
      {(field) => (
        <CategoryCombobox
          id={field.id}
          value={field.value ?? null}
          onValueChange={(category) => {
            field.onChange(category);
            onCategoryChange(category);
          }}
          type={type}
          disabled={disabled}
        />
      )}
    </FormField>
  );
}

function RecurrenceFields({ control, setValue, disabled }: SectionProps) {
  const [recurring, recurrenceMode] = useWatch({ control, name: ["recurring", "recurrenceMode"] });

  return (
    <>
      {/* A checkbox sits beside its label, a layout FormField does not offer. */}
      <Controller
        control={control}
        name="recurring"
        render={({ field }) => (
          <Field orientation="horizontal">
            <Checkbox
              id="transaction-recurring"
              checked={field.value}
              onCheckedChange={(checked) => {
                field.onChange(checked);
                if (checked) return;
                // Turning repetition off drops its settings, so turning it back on starts clean.
                setValue("recurrenceMode", undefined);
                setValue("parcelsNumber", undefined);
                setValue("currentParcel", undefined);
                setValue("endDate", undefined);
              }}
              disabled={disabled}
            />
            <FieldLabel htmlFor="transaction-recurring">Repeat or split into installments?</FieldLabel>
          </Field>
        )}
      />

      {recurring && (
        // The toggle group names itself, a layout FormField's label-for-input does not fit.
        <Controller
          control={control}
          name="recurrenceMode"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Mode</FieldLabel>
              <ToggleGroup
                aria-label="Mode"
                variant="outline"
                tone="primary"
                value={field.value ? [field.value] : []}
                onValueChange={([next]) => {
                  if (!next) return;
                  field.onChange(next);
                  // Each mode drops the other mode's settings.
                  if (next === "INSTALLMENT") {
                    setValue("endDate", undefined);
                  } else {
                    setValue("parcelsNumber", undefined);
                    setValue("currentParcel", undefined);
                  }
                }}
                disabled={disabled}
                className="w-full flex-nowrap"
              >
                <ToggleGroupItem value="INSTALLMENT" className="flex-1">
                  Installments
                </ToggleGroupItem>
                <ToggleGroupItem value="RECURRING" className="flex-1">
                  Recurring
                </ToggleGroupItem>
              </ToggleGroup>
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
      )}

      {recurring && recurrenceMode === "INSTALLMENT" && (
        <InstallmentsField mode="create" control={control} disabled={disabled} />
      )}

      {recurring && recurrenceMode === "RECURRING" && (
        <EndDateField control={control} disabled={disabled} />
      )}
    </>
  );
}
