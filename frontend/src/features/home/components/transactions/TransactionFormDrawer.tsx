import { FinancialTransaction } from "@/api/dtos/financialTransaction";
import {
  useCreateFinancialTransaction,
  useCreateFinancialTransactionSeries,
  useGetFinancialTransactionSeries,
  useUpdateFinancialTransaction,
  useUpdateFinancialTransactionSeries,
} from "@/api/services/useFinancialTransactionService";
import type { FinancialTransactionCategory } from "@/api/dtos";
import { useGetPlanMembers } from "@/api/services/usePlanService";
import { useAuth } from "@/app/providers/useAuth";
import { usePlanContext } from "@/app/providers/usePlanContext";
import { Badge } from "@/components/badge/Badge";
import { Button } from "@/components/button/Button";
import { Checkbox } from "@/components/input/base/Checkbox";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/input/base/Field";
import { Input } from "@/components/input/base/Input";
import { DatePicker } from "@/components/input/DatePicker";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/sheet/Sheet";
import { cn } from "@/lib/mergeClasses";
import { formatCurrency } from "@/utils/string/formatters";
import { maskCurrency } from "@/utils/string/masks";
import { zodResolver } from "@hookform/resolvers/zod";
import { addMonths, format } from "date-fns";
import {
  CopyIcon,
  PlusIcon,
  SaveIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import { useCallback, useEffect, useRef } from "react";
import { useForm, type UseFormSetValue } from "react-hook-form";
import { AttributionFields } from "./AttributionFields";
import { CategoryCombobox } from "./CategoryCombobox";
import { useSeriesScope } from "./useSeriesScope";
import { TransactionTypeToggle } from "@/components/transactionTypeToggle/TransactionTypeToggle";
import {
  TransactionFormMode,
  TransactionFormValues,
  buildDefaultValues,
  categoryAttribution,
  toPayload,
  toSeriesCreatePayload,
  toSeriesEditPayload,
  transactionFormSchema,
} from "./transactionForm";

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

  const { activePlanId, activePlan } = usePlanContext();
  const { user } = useAuth();
  const currentUserId = user?.id;
  const { data: members = [] } = useGetPlanMembers(activePlanId ?? undefined);
  const canAttributeToOthers =
    activePlan?.myRole === "OWNER" || activePlan?.myRole === "EDITOR";
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
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: buildDefaultValues(transaction, currentUserId, definition),
  });

  const originalParcelsNumberRef = useRef<string | undefined>(undefined);
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
    originalParcelsNumberRef.current =
      definition?.mode === "INSTALLMENT"
        ? String(definition.parcelsNumber ?? "")
        : undefined;
  }, [transaction, open, reset, currentUserId, definition]);

  const parcelsNumberValue = watch("parcelsNumber");
  const parcelsNumberChanged =
    isSeriesEdit &&
    definition?.mode === "INSTALLMENT" &&
    parcelsNumberValue !== originalParcelsNumberRef.current;

  const {
    mutate: createFinancialTransaction,
    isPending: isCreatingFinancialTransaction,
  } = useCreateFinancialTransaction({
    onSuccess: () => onOpenChange(false),
  });

  const {
    mutate: updateFinancialTransaction,
    isPending: isUpdatingFinancialTransaction,
  } = useUpdateFinancialTransaction({
    onSuccess: () => onOpenChange(false),
  });

  const {
    mutate: createFinancialTransactionSeries,
    isPending: isCreatingFinancialTransactionSeries,
  } = useCreateFinancialTransactionSeries({
    onSuccess: () => onOpenChange(false),
  });

  const {
    mutate: updateFinancialTransactionSeries,
    isPending: isUpdatingFinancialTransactionSeries,
  } = useUpdateFinancialTransactionSeries({
    onSuccess: () => onOpenChange(false),
  });

  const isPending =
    isCreatingFinancialTransaction ||
    isUpdatingFinancialTransaction ||
    isCreatingFinancialTransactionSeries ||
    isUpdatingFinancialTransactionSeries;

  const onSubmit = async (values: TransactionFormValues) => {
    if (isSeriesEdit) {
      if (!transaction?.seriesId || !definition) return;

      const scope = parcelsNumberChanged
        ? "ALL"
        : await chooseScope({ title: "Edit series" });
      if (!scope) return;

      updateFinancialTransactionSeries({
        params: { seriesId: transaction.seriesId },
        body: toSeriesEditPayload(
          values,
          transaction,
          definition,
          scope,
          showAttribution,
          currentUserId,
        ),
      });
      return;
    }

    if (mode === "create" && values.recurring && values.recurrenceMode) {
      createFinancialTransactionSeries({
        body: toSeriesCreatePayload(values, showAttribution, currentUserId),
      });
      return;
    }

    const body = toPayload(values, showAttribution, currentUserId);

    if (isEditing) {
      updateFinancialTransaction({ params: { id: transaction!.id }, body });
    } else {
      createFinancialTransaction({ body });
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>

        {isSeriesEdit && !definition && (
          <p className="text-muted-foreground px-4 text-sm">Loading…</p>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-4 pb-2"
        >
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

            <Field>
              <FieldLabel htmlFor="transaction-description">
                Description
              </FieldLabel>
              <Input
                id="transaction-description"
                placeholder="e.g., Rent, Salary, Groceries"
                disabled={isPending}
                aria-invalid={!!errors.description}
                {...register("description")}
              />
              <FieldError errors={[errors.description]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="transaction-amount">Amount</FieldLabel>
              {(() => {
                const { onChange, ...amountRest } = register("amount");
                return (
                  <Input
                    id="transaction-amount"
                    type="text"
                    inputMode="numeric"
                    placeholder="R$ 0,00"
                    disabled={isPending}
                    aria-invalid={!!errors.amount}
                    {...amountRest}
                    onChange={(e) => {
                      e.target.value = maskCurrency(e.target.value);
                      onChange(e);
                    }}
                  />
                );
              })()}
              <FieldError errors={[errors.amount]} />
            </Field>

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
              <Field>
                <FieldLabel>Items</FieldLabel>
                <div className="flex flex-col gap-2">
                  {watch("items").map((item, index) => {
                    const items = watch("items");
                    return (
                      <div
                        key={index}
                        className="border-border flex flex-col gap-2 rounded-md border p-2"
                      >
                        <div className="flex items-center gap-2">
                          <Input
                            placeholder="Item description"
                            className="flex-1"
                            disabled={isPending}
                            value={item.description}
                            onChange={(e) => {
                              const updated = [...items];
                              updated[index] = {
                                ...updated[index],
                                description: e.target.value,
                              };
                              setValue("items", updated);
                            }}
                          />
                          <Input
                            type="text"
                            inputMode="numeric"
                            placeholder="R$ 0,00"
                            className="w-28"
                            disabled={isPending}
                            value={item.amount}
                            onChange={(e) => {
                              const updated = [...items];
                              updated[index] = {
                                ...updated[index],
                                amount: maskCurrency(e.target.value),
                              };
                              setValue("items", updated);
                            }}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            disabled={isPending}
                            onClick={() =>
                              setValue(
                                "items",
                                items.filter((_, i) => i !== index),
                              )
                            }
                          >
                            <Trash2Icon className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                        <CategoryCombobox
                          value={item.category ?? null}
                          onValueChange={(v) => {
                            const updated = [...items];
                            updated[index] = {
                              ...updated[index],
                              category: v ?? null,
                            };
                            setValue("items", updated);
                          }}
                          type={watch("type")}
                          disabled={isPending}
                        />
                      </div>
                    );
                  })}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isPending}
                    onClick={() =>
                      setValue("items", [
                        ...watch("items"),
                        { description: "", amount: "", category: null },
                      ])
                    }
                  >
                    <PlusIcon className="h-3.5 w-3.5" />
                    Add item
                  </Button>
                </div>
                {watch("items").length > 0 &&
                  (() => {
                    const totalDigits = watch("amount").replace(/\D/g, "");
                    const totalCents =
                      totalDigits.length > 0 ? parseInt(totalDigits, 10) : 0;
                    const itemsCents = watch("items").reduce((sum, item) => {
                      const digits = item.amount.replace(/\D/g, "");
                      return sum + (digits.length > 0 ? parseInt(digits, 10) : 0);
                    }, 0);
                    const remainderCents = totalCents - itemsCents;
                    return (
                      <p
                        className={cn(
                          "text-sm",
                          remainderCents < 0
                            ? "text-destructive"
                            : "text-muted-foreground",
                        )}
                      >
                        Remainder: {formatCurrency(remainderCents / 100, "BRL")}
                      </p>
                    );
                  })()}
                <FieldError errors={[errors.items]} />
              </Field>
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
                {(() => {
                  const { onChange, ...parcelsRest } = register("parcelsNumber");
                  return (
                    <Input
                      id="transaction-parcels"
                      type="text"
                      inputMode="numeric"
                      placeholder="e.g., 12"
                      disabled={isPending}
                      aria-invalid={!!errors.parcelsNumber}
                      {...parcelsRest}
                      onChange={(e) => {
                        e.target.value = e.target.value.replace(/\D/g, "");
                        onChange(e);
                      }}
                    />
                  );
                })()}
                <FieldError errors={[errors.parcelsNumber]} />
                <p className="text-muted-foreground text-sm">
                  Currently: parcel {definition.firstParcel ?? 1} of{" "}
                  {definition.parcelsNumber}
                </p>
                {parcelsNumberChanged && (
                  <p className="text-sm text-amber-600 dark:text-amber-400">
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
                      <div className="flex w-full gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          disabled={isPending}
                          onClick={() => {
                            setValue("recurrenceMode", "INSTALLMENT", {
                              shouldValidate: true,
                            });
                            setValue("endDate", undefined);
                          }}
                          className={cn(
                            "flex-1 border",
                            watch("recurrenceMode") === "INSTALLMENT"
                              ? "border-primary/30 bg-primary/15 text-primary-ink hover:bg-primary/20 hover:text-primary-ink"
                              : "border-border text-muted-foreground hover:border-primary/30 hover:text-primary-ink hover:bg-transparent",
                          )}
                        >
                          Installments
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          disabled={isPending}
                          onClick={() => {
                            setValue("recurrenceMode", "RECURRING", {
                              shouldValidate: true,
                            });
                            setValue("parcelsNumber", undefined);
                            setValue("currentParcel", undefined);
                          }}
                          className={cn(
                            "flex-1 border",
                            watch("recurrenceMode") === "RECURRING"
                              ? "border-primary/30 bg-primary/15 text-primary-ink hover:bg-primary/20 hover:text-primary-ink"
                              : "border-border text-muted-foreground hover:border-primary/30 hover:text-primary-ink hover:bg-transparent",
                          )}
                        >
                          Recurring
                        </Button>
                      </div>
                      <FieldError errors={[errors.recurrenceMode]} />
                    </Field>

                    {watch("recurrenceMode") === "INSTALLMENT" && (
                      <>
                        <Field>
                          <FieldLabel htmlFor="transaction-parcels-create">
                            Number of installments
                          </FieldLabel>
                          {(() => {
                            const { onChange, ...parcelsRest } =
                              register("parcelsNumber");
                            return (
                              <Input
                                id="transaction-parcels-create"
                                type="text"
                                inputMode="numeric"
                                placeholder="e.g., 12"
                                disabled={isPending}
                                aria-invalid={!!errors.parcelsNumber}
                                {...parcelsRest}
                                onChange={(e) => {
                                  e.target.value = e.target.value.replace(
                                    /\D/g,
                                    "",
                                  );
                                  onChange(e);
                                }}
                              />
                            );
                          })()}
                          <FieldError errors={[errors.parcelsNumber]} />
                        </Field>

                        <Field>
                          <FieldLabel htmlFor="transaction-current-parcel">
                            Current installment
                          </FieldLabel>
                          {(() => {
                            const { onChange, ...currentRest } =
                              register("currentParcel");
                            return (
                              <Input
                                id="transaction-current-parcel"
                                type="text"
                                inputMode="numeric"
                                placeholder="1"
                                disabled={isPending}
                                aria-invalid={!!errors.currentParcel}
                                {...currentRest}
                                onChange={(e) => {
                                  e.target.value = e.target.value.replace(
                                    /\D/g,
                                    "",
                                  );
                                  onChange(e);
                                }}
                              />
                            );
                          })()}
                          <FieldError errors={[errors.currentParcel]} />
                        </Field>

                        {(() => {
                          const total = parseInt(
                            (watch("parcelsNumber") ?? "").replace(/\D/g, ""),
                            10,
                          );
                          const currentDigits = (
                            watch("currentParcel") ?? ""
                          ).replace(/\D/g, "");
                          const current =
                            currentDigits.length > 0
                              ? parseInt(currentDigits, 10)
                              : 1;
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
        </form>

        <SheetFooter>
          {isEditing && transaction && (onDuplicate || onDelete) && (
            <div className="flex gap-2 sm:hidden">
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
            </div>
          )}
          <Button
            variant="outline"
            type="button"
            disabled={isPending}
            onClick={() => onOpenChange(false)}
          >
            <XIcon className="h-4 w-4" />
            Cancel
          </Button>
          <Button
            type="button"
            isLoading={isPending}
            disabled={isSeriesEdit && !definition}
            onClick={handleSubmit(onSubmit)}
          >
            <SaveIcon className="h-4 w-4" />
            {submitLabel}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
