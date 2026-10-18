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
  participantsForMode,
  type TransactionFormOutput,
  type TransactionFormValues,
} from "./transactionForm";

const ATTRIBUTION_OPTIONS = [
  ["ME", "Me"],
  ["SOMEONE", "Someone else"],
  ["SPLIT", "Split"],
] as const;

type AttributionFieldsProps = {
  control: Control<TransactionFormValues, unknown, TransactionFormOutput>;
  /** The form owns the participants list, since choosing an owned category also sets it. */
  participants: UseFieldArrayReturn<TransactionFormValues, "participants">;
  /** Called on every change made here: a hand edit stops the category from setting participants. */
  onEdit: () => void;
  members: PlanMember[];
  currentUserId?: number;
  disabled?: boolean;
};

export function AttributionFields({
  control,
  participants,
  onEdit,
  members,
  currentUserId,
  disabled,
}: AttributionFieldsProps) {
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

  function handleAttributionModeChange(next: TransactionFormValues["attributionMode"]) {
    onEdit();
    attributionMode.onChange(next);
    splitMode.onChange("EQUAL");
    replace(participantsForMode(next, values, members, currentUserId));
  }

  function handleParticipantToggle(member: PlanMember, index: number, isChecked: boolean) {
    onEdit();
    if (isChecked) {
      append({ memberId: member.userId, memberName: member.name, shareAmount: null });
    } else {
      remove(index);
    }
  }

  return (
    <>
      <Field>
        <FieldLabel>Attributed to</FieldLabel>
        <ToggleGroup
          aria-label="Attributed to"
          variant="outline"
          tone="primary"
          value={[attributionMode.value]}
          onValueChange={([next]) => next && handleAttributionModeChange(next)}
          disabled={disabled}
          className="w-full flex-nowrap"
        >
          {ATTRIBUTION_OPTIONS.map(([value, label]) => (
            <ToggleGroupItem key={value} value={value} className="flex-1">
              {label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </Field>

      {attributionMode.value === "SOMEONE" && (
        <Field>
          <FieldLabel htmlFor="transaction-attributed-person">Person</FieldLabel>
          <StandardCombobox
            id="transaction-attributed-person"
            items={otherMembers.map((member) => ({ id: member.userId, name: member.name }))}
            value={person ? { id: person.memberId, name: person.memberName } : null}
            onValueChange={(value) => {
              onEdit();
              replace(value ? [{ memberId: value.id, memberName: value.name, shareAmount: null }] : []);
            }}
            itemLabel={(member) => member.name}
            placeholder="Select a person"
            disabled={disabled}
          />
          <FieldError errors={[participantsError]} />
        </Field>
      )}

      {attributionMode.value === "SPLIT" && (
        <>
          <Field>
            <FieldLabel>Split mode</FieldLabel>
            <ToggleGroup
              aria-label="Split mode"
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
                Equal
              </ToggleGroupItem>
              <ToggleGroupItem value="EXACT" className="flex-1">
                Exact
              </ToggleGroupItem>
            </ToggleGroup>
          </Field>

          <Field>
            <FieldLabel>Participants</FieldLabel>
            <div className="flex flex-col gap-2">
              {members.map((member) => {
                const index = fields.findIndex((field) => field.memberId === member.userId);
                const participant = fields[index];

                return (
                  <div key={member.userId} className="flex items-center gap-2">
                    <Checkbox
                      aria-label={member.name}
                      checked={participant !== undefined}
                      onCheckedChange={(isChecked) =>
                        handleParticipantToggle(member, index, isChecked)
                      }
                      disabled={disabled}
                    />
                    <Text className="flex-1">{member.name}</Text>
                    {splitMode.value === "EXACT" && participant && (
                      <Controller
                        key={participant.id}
                        control={control}
                        name={`participants.${index}.shareAmount`}
                        render={({ field, fieldState }) => (
                          <CurrencyInput
                            {...field}
                            onValueChange={(shareAmount) => {
                              onEdit();
                              field.onChange(shareAmount);
                            }}
                            aria-label={`${member.name}'s share`}
                            aria-invalid={fieldState.invalid}
                            placeholder="R$ 0,00"
                            className="h-8 w-28"
                            disabled={disabled}
                          />
                        )}
                      />
                    )}
                  </div>
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
