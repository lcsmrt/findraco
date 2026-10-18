import { FinancialTransaction } from "@/api/dtos/financialTransaction";
import { useGetFinancialTransactionSeries } from "@/api/services/useFinancialTransactionService";
import type { FinancialTransactionCategory } from "@/api/dtos";
import { useGetPlanMembers } from "@/api/services/usePlanService";
import { useAuth } from "@/app/providers/useAuth";
import { usePlanContext } from "@/app/providers/usePlanContext";
import { usePlanPermissions } from "@/hooks/usePlanPermissions";
import { Badge } from "@/components/badge/base/Badge";
import { Button } from "@/components/button/base/Button";
import { Checkbox } from "@/components/input/base/Checkbox";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/input/base/Field";
import { Input } from "@/components/input/base/Input";
import { NumberField } from "@/components/input/base/NumberField";
import { CurrencyInput } from "@/components/input/CurrencyInput";
import { DatePicker } from "@/components/input/DatePicker";
import { FormField } from "@/components/form/FormField";
import { FormSheet } from "@/components/form/FormSheet";
import { zodResolver } from "@hookform/resolvers/zod";
import { addMonths, format } from "date-fns";
import { CopyIcon, Trash2Icon } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";
import { Controller, useForm, type UseFormSetValue } from "react-hook-form";
import { AttributionFields } from "./AttributionFields";
import { CategoryCombobox } from "./CategoryCombobox";
import { ItemsField } from "./ItemsField";
import { useSeriesScope } from "./useSeriesScope";
import { TransactionTypeToggle } from "@/components/transactionTypeToggle/TransactionTypeToggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/toggleGroup/base/ToggleGroup";
import {
  TransactionFormMode,
  TransactionFormOutput,
  TransactionFormValues,
  buildDefaultValues,
  categoryAttribution,
  seriesParcelsChanged,
  transactionFormSchema,
} from "./transactionForm";
import { useTransactionFormSubmit } from "./useTransactionFormSubmit";

type TransactionFormDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction?: FinancialTransaction;
  mode: TransactionFormMode;
  /** Edit footer, narrow screens (UX-02 AC 5). */
  onDuplicate?: (transaction: FinancialTransaction) => void;
  onDelete?: (transaction: FinancialTransaction) => void;
}

export const TransactionFormDrawer = ({
  open,
  onOpenChange,
  transaction,
  mode,
  onDuplicate,
  onDelete,
}: TransactionFormDrawerProps) => {
  const isEditing = mode === "edit";
  const isSeriesEdit = isEditing && !!transaction?.seriesId;

  const { activePlanId } = usePlanContext();
  const { user } = useAuth();
  const currentUserId = user?.id;
  const { data: members = [] } = useGetPlanMembers(activePlanId ?? undefined);
  const { canAttributeToOthers } = usePlanPermissions();
  const showAttribution = canAttributeToOthers && members.length > 1;

  const chooseScope = useSeriesScope();

  const { data: definition } = useGetFinancialTransactionSeries(
    transaction?.seriesId,
    { enabled: open && isSeriesEdit },
  );

  const title = isSeriesEdit
    ? "Edit series"
    : mode === "duplicate"
      ? "Duplicate Transaction"
      : mode === "edit"
        ? "Edit Transaction"
        : "New Transaction";

  const submitLabel = mode === "edit" ? "Save" : "Create";

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TransactionFormValues, unknown, TransactionFormOutput>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: buildDefaultValues(transaction, currentUserId, definition),
  });

  const participantsTouchedRef = useRef(false);

  // Every attribution change made through AttributionFields is a manual edit.
  const setAttributionValue = useCallback<UseFormSetValue<TransactionFormValues>>(
    (name, value, options) => {
      participantsTouchedRef.current = true;
      setValue(name, value, options);
    },
    [setValue],
  );

  const handleCategoryChange = (
    category: FinancialTransactionCategory | null | undefined,
  ) => {
    setValue("category", category);
    if (!canAttributeToOthers) return;
    const defaults = buildDefaultValues(transaction, currentUserId, definition);
    const attribution = categoryAttribution({
      mode,
      defaults,
      category,
      members,
      currentUserId,
      participantsTouched: participantsTouchedRef.current,
    });
    if (!attribution) return;
    setValue("attributionMode", attribution.attributionMode);
    setValue("splitMode", attribution.splitMode);
    setValue("participants", attribution.participants);
  };

  useEffect(() => {
    participantsTouchedRef.current = false;
    reset(buildDefaultValues(transaction, currentUserId, definition));
  }, [transaction, open, reset, currentUserId, definition]);

  const parcelsNumberValue = watch("parcelsNumber");
  const parcelsNumberChanged =
    isSeriesEdit && seriesParcelsChanged(definition, parcelsNumberValue);

  const { submit, isSubmitting: isPending } = useTransactionFormSubmit({
    mode,
    transaction,
    definition,
    showAttribution,
    currentUserId,
    chooseScope,
    onDone: () => onOpenChange(false),
  });

  const recurrenceMode = watch("recurrenceMode");

  return (
    <FormSheet
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      onSubmit={handleSubmit(submit)}
      isSubmitting={isPending}
      submitLabel={submitLabel}
      submitDisabled={isSeriesEdit && !definition}
      mobileActions={
        isEditing &&
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
      {isSeriesEdit && !definition && (
        <p className="text-muted-foreground text-sm">Loading…</p>
      )}

      <FieldGroup>
        {!isSeriesEdit && (
          <Field>
            <FieldLabel htmlFor="transaction-type">Type</FieldLabel>
            <TransactionTypeToggle
              value={watch("type")}
              onChange={(v) => {
                setValue("type", v);
                setValue("category", null);
              }}
              disabled={isPending}
            />
          </Field>
        )}

        <FormField control={control} name="description" label="Description">
          {(field) => (
            <Input
              {...field}
              placeholder="e.g., Rent, Salary, Groceries"
              disabled={isPending}
            />
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

        <Field>
          <FieldLabel htmlFor="transaction-category">Category</FieldLabel>
          <CategoryCombobox
            id="transaction-category"
            value={watch("category") ?? null}
            onValueChange={handleCategoryChange}
            type={watch("type")}
            disabled={isPending}
          />
        </Field>

        {!isSeriesEdit && (
          <Field>
            <FieldLabel htmlFor="transaction-date">Date</FieldLabel>
            <DatePicker
              id="transaction-date"
              value={watch("date")}
              onChange={(v) =>
                v && setValue("date", v, { shouldValidate: true })
              }
              disabled={isPending}
              className="w-full"
            />
            <FieldError errors={[errors.date]} />
          </Field>
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
            watch={watch}
            setValue={setAttributionValue}
            errors={errors}
            members={members}
            currentUserId={currentUserId}
            disabled={isPending}
          />
        )}

        {isSeriesEdit && definition?.mode === "INSTALLMENT" && (
          <Field>
            <FieldLabel htmlFor="transaction-parcels">
              Number of installments
            </FieldLabel>
            <Controller
              control={control}
              name="parcelsNumber"
              render={({ field }) => (
                <NumberField
                  id="transaction-parcels"
                  ref={field.ref}
                  name={field.name}
                  onBlur={field.onBlur}
                  value={field.value ?? null}
                  onValueChange={field.onChange}
                  min={1}
                  step={1}
                  placeholder="e.g., 12"
                  disabled={isPending}
                  aria-invalid={!!errors.parcelsNumber}
                />
              )}
            />
            <FieldError errors={[errors.parcelsNumber]} />
            <p className="text-muted-foreground text-sm">
              Currently: parcel {definition.firstParcel ?? 1} of{" "}
              {definition.parcelsNumber}
            </p>
            {parcelsNumberChanged && (
              <p className="text-warning text-sm">
                Changing the number of parcels updates the whole series.
              </p>
            )}
          </Field>
        )}

        {isSeriesEdit && definition?.mode === "RECURRING" && (
          <Field>
            <div className="flex items-center justify-between">
              <FieldLabel htmlFor="transaction-end-date">
                End date
              </FieldLabel>
              {!watch("endDate") && (
                <Badge variant="secondary">Ongoing</Badge>
              )}
            </div>
            <DatePicker
              id="transaction-end-date"
              value={watch("endDate")}
              onChange={(v) =>
                setValue("endDate", v, { shouldValidate: true })
              }
              disabled={isPending}
              className="w-full"
            />
            <FieldError errors={[errors.endDate]} />
            <p className="text-muted-foreground text-sm">
              Leave empty to keep this series ongoing, with no end date.
            </p>
          </Field>
        )}

        {mode === "create" && (
          <>
            <Field orientation="horizontal">
              <Checkbox
                id="transaction-recurring"
                checked={watch("recurring")}
                onCheckedChange={(checked) => {
                  setValue("recurring", checked);
                  if (!checked) {
                    setValue("recurrenceMode", undefined);
                    setValue("parcelsNumber", undefined);
                    setValue("currentParcel", undefined);
                    setValue("endDate", undefined);
                  }
                }}
                disabled={isPending}
              />
              <FieldLabel htmlFor="transaction-recurring">
                Repeat or split into installments?
              </FieldLabel>
            </Field>

            {watch("recurring") && (
              <>
                <Field>
                  <FieldLabel>Mode</FieldLabel>
                  <ToggleGroup
                    aria-label="Mode"
                    variant="outline"
                    tone="primary"
                    value={recurrenceMode ? [recurrenceMode] : []}
                    onValueChange={([next]) => {
                      if (!next) return;
                      setValue("recurrenceMode", next, { shouldValidate: true });
                      if (next === "INSTALLMENT") {
                        setValue("endDate", undefined);
                      } else {
                        setValue("parcelsNumber", undefined);
                        setValue("currentParcel", undefined);
                      }
                    }}
                    disabled={isPending}
                    className="w-full flex-nowrap"
                  >
                    <ToggleGroupItem value="INSTALLMENT" className="flex-1">
                      Installments
                    </ToggleGroupItem>
                    <ToggleGroupItem value="RECURRING" className="flex-1">
                      Recurring
                    </ToggleGroupItem>
                  </ToggleGroup>
                  <FieldError errors={[errors.recurrenceMode]} />
                </Field>

                {watch("recurrenceMode") === "INSTALLMENT" && (
                  <>
                    <Field>
                      <FieldLabel htmlFor="transaction-parcels-create">
                        Number of installments
                      </FieldLabel>
                      <Controller
                        control={control}
                        name="parcelsNumber"
                        render={({ field }) => (
                          <NumberField
                            id="transaction-parcels-create"
                            ref={field.ref}
                            name={field.name}
                            onBlur={field.onBlur}
                            value={field.value ?? null}
                            onValueChange={field.onChange}
                            min={1}
                            step={1}
                            placeholder="e.g., 12"
                            disabled={isPending}
                            aria-invalid={!!errors.parcelsNumber}
                          />
                        )}
                      />
                      <FieldError errors={[errors.parcelsNumber]} />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="transaction-current-parcel">
                        Current installment
                      </FieldLabel>
                      <Controller
                        control={control}
                        name="currentParcel"
                        render={({ field }) => (
                          <NumberField
                            id="transaction-current-parcel"
                            ref={field.ref}
                            name={field.name}
                            onBlur={field.onBlur}
                            value={field.value ?? null}
                            onValueChange={field.onChange}
                            min={1}
                            step={1}
                            placeholder="1"
                            disabled={isPending}
                            aria-invalid={!!errors.currentParcel}
                          />
                        )}
                      />
                      <FieldError errors={[errors.currentParcel]} />
                    </Field>

                    {(() => {
                      const total = watch("parcelsNumber") ?? Number.NaN;
                      const current = watch("currentParcel") ?? 1;
                      const date = watch("date");
                      if (
                        !Number.isFinite(total) ||
                        total < 2 ||
                        current < 1 ||
                        current > total ||
                        !date
                      ) {
                        return null;
                      }
                      const lastMonth = addMonths(date, total - current);
                      return (
                        <p className="text-muted-foreground text-sm">
                          Last installment: {total}/{total} —{" "}
                          {format(lastMonth, "MM/yyyy")}
                        </p>
                      );
                    })()}
                  </>
                )}

                {watch("recurrenceMode") === "RECURRING" && (
                  <Field>
                    <div className="flex items-center justify-between">
                      <FieldLabel htmlFor="transaction-create-end-date">
                        End date
                      </FieldLabel>
                      {!watch("endDate") && (
                        <Badge variant="secondary">Ongoing</Badge>
                      )}
                    </div>
                    <DatePicker
                      id="transaction-create-end-date"
                      value={watch("endDate")}
                      onChange={(v) =>
                        setValue("endDate", v, { shouldValidate: true })
                      }
                      disabled={isPending}
                      className="w-full"
                    />
                    <FieldError errors={[errors.endDate]} />
                    <p className="text-muted-foreground text-sm">
                      Leave empty to keep this series ongoing, with no end
                      date.
                    </p>
                  </Field>
                )}
              </>
            )}
          </>
        )}
      </FieldGroup>
    </FormSheet>
  );
};
