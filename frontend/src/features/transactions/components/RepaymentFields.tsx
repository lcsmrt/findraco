import type { Contact } from "@/api/dtos/contact";
import type { PlanMember } from "@/api/dtos/plan";
import { Button } from "@/components/button/base/Button";
import { FormField } from "@/components/form/FormField";
import { Checkbox } from "@/components/input/base/Checkbox";
import { Field, FieldError, FieldLabel } from "@/components/input/base/Field";
import { CurrencyInput } from "@/components/input/CurrencyInput";
import { StandardCombobox } from "@/components/input/StandardCombobox";
import { Skeleton } from "@/components/skeleton/base/Skeleton";
import { Text } from "@/components/typography/base/Text";
import { formatDate } from "@/utils/dates";
import { formatMoney } from "@/utils/money";
import {
  Controller,
  useController,
  useFormState,
  useWatch,
  type Control,
  type UseFieldArrayReturn,
  type UseFormSetValue,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { allocationExcess } from "../utils/allocationRows";
import type { TransactionFormOutput, TransactionFormValues } from "./transactionForm";

type RepaymentFormControl = Control<TransactionFormValues, unknown, TransactionFormOutput>;

type ReceiverFieldProps = {
  control: RepaymentFormControl;
  participants: UseFieldArrayReturn<TransactionFormValues, "participants">;
  members: PlanMember[];
  currentUserId?: number;
  disabled?: boolean;
};

/** Who received the money: the member saving, or another member when the user may attribute to others. */
function ReceiverField({ control, participants, members, currentUserId, disabled }: ReceiverFieldProps) {
  const { t } = useTranslation();

  const { field: attributionMode } = useController({ control, name: "attributionMode" });
  const values = useWatch({ control, name: "participants" });
  const receiverId = attributionMode.value === "SOMEONE" ? values[0]?.memberId : currentUserId;
  const receiver = members.find((member) => member.userId === receiverId);
  // A member who left the plan still shows under the name the row stored.
  const name = receiver?.name ?? values[0]?.memberName;

  function handleChange(member: { id: number | string; name: string } | null) {
    if (!member || typeof member.id !== "number") return;
    if (member.id === currentUserId) {
      attributionMode.onChange("ME");
      participants.replace([]);
      return;
    }
    attributionMode.onChange("SOMEONE");
    participants.replace([{ memberId: member.id, memberName: member.name, shareAmount: null }]);
  }

  return (
    <Field>
      <FieldLabel htmlFor="repayment-receiver">{t("transactions.repaymentFields.receivedBy")}</FieldLabel>
      <StandardCombobox
        id="repayment-receiver"
        items={members.map((member) => ({ id: member.userId, name: member.name }))}
        value={receiverId !== undefined && name !== undefined ? { id: receiverId, name } : null}
        onValueChange={handleChange}
        itemLabel={(member) => member.name}
        disabled={disabled}
      />
    </Field>
  );
}

type AllocationRowsProps = {
  control: RepaymentFormControl;
  setValue: UseFormSetValue<TransactionFormValues>;
  allocations: UseFieldArrayReturn<TransactionFormValues, "allocations">;
  onEdit: () => void;
  disabled?: boolean;
};

/** The contact's open purchases, oldest first: tick the ones this payment settles and set each amount. */
function AllocationRows({ control, setValue, allocations, onEdit, disabled }: AllocationRowsProps) {
  const { t } = useTranslation();

  const rows = useWatch({ control, name: "allocations" }) ?? [];
  const { errors } = useFormState({ control, name: "allocations" });
  const listError = errors.allocations?.root ?? errors.allocations;

  function handleTick(index: number, checked: boolean) {
    onEdit();
    const row = rows[index];
    if (checked && row.amount === null) setValue(`allocations.${index}.amount`, row.open);
  }

  return (
    <div className="flex flex-col gap-2">
      {allocations.fields.map((field, index) => {
        const row = rows[index];
        if (!row) return null;
        return (
          <div key={field.id} className="flex items-center gap-2">
            <Controller
              control={control}
              name={`allocations.${index}.checked`}
              render={({ field: tick }) => (
                <Checkbox
                  aria-label={row.description}
                  checked={tick.value}
                  onCheckedChange={(checked) => {
                    handleTick(index, checked);
                    tick.onChange(checked);
                  }}
                  disabled={disabled}
                />
              )}
            />
            <span className="flex min-w-0 flex-1 flex-col">
              <Text variant="label" className="truncate">
                {row.description}
              </Text>
              <Text variant="caption" className="truncate">
                {formatDate(row.date)} · {t("transactions.repaymentFields.open", { amount: formatMoney(row.open) })}
              </Text>
            </span>
            {row.checked && (
              <Controller
                control={control}
                name={`allocations.${index}.amount`}
                render={({ field: amount, fieldState }) => (
                  <CurrencyInput
                    {...amount}
                    value={amount.value ?? null}
                    onValueChange={(value) => {
                      onEdit();
                      amount.onChange(value);
                    }}
                    aria-label={t("transactions.repaymentFields.amountFor", { description: row.description })}
                    aria-invalid={fieldState.invalid}
                    placeholder={t("common.r000")}
                    className="h-8 w-28 shrink-0"
                    disabled={disabled}
                  />
                )}
              />
            )}
          </div>
        );
      })}
      <FieldError errors={[listError]} />
    </div>
  );
}

type RepaymentFieldsProps = {
  control: RepaymentFormControl;
  setValue: UseFormSetValue<TransactionFormValues>;
  /** The contact's open purchases: the form owns the list, since choosing a contact fills it. */
  allocations: UseFieldArrayReturn<TransactionFormValues, "allocations">;
  participants: UseFieldArrayReturn<TransactionFormValues, "participants">;
  /** The plan's active contacts. */
  contacts: Contact[];
  members: PlanMember[];
  currentUserId?: number;
  /** Whether the user may choose who received the money. */
  canChooseReceiver: boolean;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  /** Called when the user ticks or edits a purchase: typing the amount then leaves the choice alone. */
  onAllocationEdit: () => void;
  disabled?: boolean;
};

/** What a contact payment asks beyond a plain row: who paid, who received it and what it settles. */
export function RepaymentFields({
  control,
  setValue,
  allocations,
  participants,
  contacts,
  members,
  currentUserId,
  canChooseReceiver,
  isLoading,
  isError,
  onRetry,
  onAllocationEdit,
  disabled,
}: RepaymentFieldsProps) {
  const { t } = useTranslation();

  const [contact, amount, rows] = useWatch({ control, name: ["repaymentContact", "amount", "allocations"] });
  const excess = allocationExcess(amount, rows ?? []);
  const isListed = contact != null && !isLoading && !isError;

  return (
    <>
      <FormField control={control} name="repaymentContact" label={t("transactions.repaymentFields.contact")}>
        {(field) => (
          <StandardCombobox
            id={field.id}
            items={contacts}
            value={field.value ?? null}
            onValueChange={(value) => field.onChange(value ? { id: Number(value.id), name: value.name } : null)}
            itemLabel={(item) => item.name}
            placeholder={t("transactions.repaymentFields.selectAContact")}
            disabled={disabled}
          />
        )}
      </FormField>

      {canChooseReceiver && (
        <ReceiverField
          control={control}
          participants={participants}
          members={members}
          currentUserId={currentUserId}
          disabled={disabled}
        />
      )}

      {contact != null && (
        <Field>
          <FieldLabel>{t("transactions.repaymentFields.purchases")}</FieldLabel>
          {isLoading && (
            <div role="status" aria-label={t("transactions.repaymentFields.loading")}>
              <Skeleton className="h-10" />
            </div>
          )}
          {isError && (
            <div className="flex items-center justify-between gap-2">
              <Text variant="secondary">{t("transactions.repaymentFields.loadFailed")}</Text>
              <Button type="button" variant="outline" size="sm" onClick={onRetry}>
                {t("common.tryAgain")}
              </Button>
            </div>
          )}
          {isListed && allocations.fields.length === 0 && (
            <Text as="p" variant="secondary">
              {t("transactions.repaymentFields.nothingOpen")}
            </Text>
          )}
          {isListed && (
            <AllocationRows
              control={control}
              setValue={setValue}
              allocations={allocations}
              onEdit={onAllocationEdit}
              disabled={disabled}
            />
          )}
          {isListed && excess > 0 && (
            <Text as="p" variant="secondary" numeric>
              {t("transactions.repaymentFields.becomesCredit", { amount: formatMoney(excess) })}
            </Text>
          )}
        </Field>
      )}
    </>
  );
}
