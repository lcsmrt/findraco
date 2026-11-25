import type { Contact } from "@/api/dtos/contact";
import { PlanMember } from "@/api/dtos/plan";
import { Checkbox } from "@/components/input/base/Checkbox";
import { Field, FieldError, FieldLabel } from "@/components/input/base/Field";
import { CurrencyInput } from "@/components/input/CurrencyInput";
import { StandardCombobox } from "@/components/input/StandardCombobox";
import { ToggleGroup, ToggleGroupItem } from "@/components/toggleGroup/base/ToggleGroup";
import { Text } from "@/components/typography/base/Text";
import {
  Controller,
  useController,
  useFormState,
  useWatch,
  type Control,
  type UseFieldArrayReturn,
} from "react-hook-form";
import {
  contactSplitRows,
  participantsForMode,
  splitRows,
  type ContactSplitRow,
  type SplitRow,
  type TransactionFormOutput,
  type TransactionFormValues,
} from "./transactionForm";
import { useTranslation } from "react-i18next";

const ATTRIBUTION_OPTIONS = [
  ["ME", "transactions.attributionFields.me"],
  ["SOMEONE", "transactions.attributionFields.someoneElse"],
  ["SPLIT", "transactions.attributionFields.split"],
] as const;

type AttributionFieldsProps = {
  control: Control<TransactionFormValues, unknown, TransactionFormOutput>;
  /** The form owns the participants list, since choosing an owned category also sets it. */
  participants: UseFieldArrayReturn<TransactionFormValues, "participants">;
  /** Called on every change made here: a hand edit stops the category from setting participants. */
  onEdit: () => void;
  members: PlanMember[];
  /** The plan's active contacts, which an expense may be split with; empty for a role that may not. */
  contacts: Contact[];
  currentUserId?: number;
  disabled?: boolean;
};

type ParticipantRowProps = {
  control: AttributionFieldsProps["control"];
  label: string;
  /** The name an exact share's field is announced with. */
  name: string;
  /** The row's index in the participants list; -1 when the person is not in the split. */
  index: number;
  isExact: boolean;
  disabled?: boolean;
  onToggle: (isChecked: boolean) => void;
  onEdit: () => void;
};

/** One person of the split: ticked or not, with the share to enter when the split is exact. */
function ParticipantRow({ control, label, name, index, isExact, disabled, onToggle, onEdit }: ParticipantRowProps) {
  const { t } = useTranslation();

  const isIn = index >= 0;

  return (
    <div className="flex items-center gap-2">
      <Checkbox aria-label={label} checked={isIn} onCheckedChange={onToggle} disabled={disabled} />
      <Text className="min-w-0 flex-1 truncate">{label}</Text>
      {isExact && isIn && (
        <Controller
          control={control}
          name={`participants.${index}.shareAmount`}
          render={({ field, fieldState }) => (
            <CurrencyInput
              {...field}
              onValueChange={(shareAmount) => {
                onEdit();
                field.onChange(shareAmount);
              }}
              aria-label={t("transactions.attributionFields.share", { name })}
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
}

export function AttributionFields({
  control,
  participants,
  onEdit,
  members,
  contacts,
  currentUserId,
  disabled,
}: AttributionFieldsProps) {
  const { t } = useTranslation();

  const { field: attributionMode } = useController({ control, name: "attributionMode" });
  const { field: splitMode } = useController({ control, name: "splitMode" });
  const { errors } = useFormState({ control, name: "participants" });
  const { fields, replace, append, remove } = participants;
  // `fields` keeps the rows' identity; the values (shares included) come from the form.
  const values = useWatch({ control, name: "participants" });
  const person = values[0];
  // Once a share is registered as a field, the resolver files the list-level error under `root`.
  const participantsError = errors.participants?.root ?? errors.participants;
  const otherMembers = members.filter((member) => member.userId !== currentUserId);
  const rows = splitRows(members, values);
  // A contact's share leaves the plan's spending, so only a plain expense may carry one.
  const [type, kind] = useWatch({ control, name: ["type", "kind"] });
  const contactRows = contactSplitRows(type === "DEBIT" && !kind ? contacts : [], values);
  const personLabel =
    person && rows.some((row) => row.isFormer && row.userId === person.memberId)
      ? t("transactions.attributionFields.formerMember", { name: person.memberName })
      : (person?.memberName ?? "");

  function handleAttributionModeChange(next: TransactionFormValues["attributionMode"]) {
    onEdit();
    attributionMode.onChange(next);
    splitMode.onChange("EQUAL");
    replace(participantsForMode(next, values, members, currentUserId));
  }

  function handleParticipantToggle(row: SplitRow, index: number, isChecked: boolean) {
    onEdit();
    if (isChecked) {
      append({ memberId: row.userId, memberName: row.name, shareAmount: null });
    } else {
      remove(index);
    }
  }

  function handleContactToggle(row: ContactSplitRow, index: number, isChecked: boolean) {
    onEdit();
    if (isChecked) {
      append({ contactId: row.contactId, memberName: row.name, shareAmount: null });
    } else {
      remove(index);
    }
  }

  return (
    <>
      <Field>
        <FieldLabel>{t("transactions.attributionFields.attributedTo")}</FieldLabel>
        <ToggleGroup
          aria-label={t("transactions.attributionFields.attributedTo")}
          variant="outline"
          tone="primary"
          value={[attributionMode.value]}
          onValueChange={([next]) => next && handleAttributionModeChange(next)}
          disabled={disabled}
          className="w-full flex-nowrap"
        >
          {ATTRIBUTION_OPTIONS.map(([value, label]) => (
            <ToggleGroupItem key={value} value={value} className="flex-1">
              {t(label)}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </Field>

      {attributionMode.value === "SOMEONE" && (
        <Field>
          <FieldLabel htmlFor="transaction-attributed-person">
            {t("transactions.attributionFields.person")}
          </FieldLabel>
          <StandardCombobox
            id="transaction-attributed-person"
            items={otherMembers.map((member) => ({ id: member.userId, name: member.name }))}
            value={person?.memberId !== undefined ? { id: person.memberId, name: personLabel } : null}
            onValueChange={(value) => {
              onEdit();
              replace(
                value ? [{ memberId: value.id, memberName: value.name, shareAmount: null }] : [],
              );
            }}
            itemLabel={(member) => member.name}
            placeholder={t("transactions.attributionFields.selectAPerson")}
            disabled={disabled}
          />
          <FieldError errors={[participantsError]} />
        </Field>
      )}

      {attributionMode.value === "SPLIT" && (
        <>
          <Field>
            <FieldLabel>{t("transactions.attributionFields.splitMode")}</FieldLabel>
            <ToggleGroup
              aria-label={t("transactions.attributionFields.splitMode")}
              variant="outline"
              tone="primary"
              value={[splitMode.value]}
              onValueChange={([next]) => {
                if (!next) return;
                onEdit();
                splitMode.onChange(next);
              }}
              disabled={disabled}
              className="w-full flex-nowrap"
            >
              <ToggleGroupItem value="EQUAL" className="flex-1">
                {t("transactions.attributionFields.equal")}
              </ToggleGroupItem>
              <ToggleGroupItem value="EXACT" className="flex-1">
                {t("transactions.attributionFields.exact")}
              </ToggleGroupItem>
            </ToggleGroup>
          </Field>

          <Field>
            <FieldLabel>{t("transactions.attributionFields.participants")}</FieldLabel>
            <div className="flex flex-col gap-2">
              {rows.map((row) => {
                const index = fields.findIndex((field) => field.memberId === row.userId);
                const label = row.isFormer
                  ? t("transactions.attributionFields.formerMember", { name: row.name })
                  : row.name;

                return (
                  <ParticipantRow
                    key={`member-${row.userId}`}
                    control={control}
                    label={label}
                    name={row.name}
                    index={index}
                    isExact={splitMode.value === "EXACT"}
                    disabled={disabled}
                    onToggle={(isChecked) => handleParticipantToggle(row, index, isChecked)}
                    onEdit={onEdit}
                  />
                );
              })}
              {contactRows.map((row) => {
                const index = fields.findIndex((field) => field.contactId === row.contactId);
                const label = row.isArchived
                  ? t("transactions.attributionFields.archivedContact", { name: row.name })
                  : row.name;

                return (
                  <ParticipantRow
                    key={`contact-${row.contactId}`}
                    control={control}
                    label={label}
                    name={row.name}
                    index={index}
                    isExact={splitMode.value === "EXACT"}
                    disabled={disabled}
                    onToggle={(isChecked) => handleContactToggle(row, index, isChecked)}
                    onEdit={onEdit}
                  />
                );
              })}
            </div>
            <FieldError errors={[participantsError]} />
          </Field>
        </>
      )}
    </>
  );
}
