import { PlanMember } from "@/api/dtos/plan";
import { Checkbox } from "@/components/input/base/Checkbox";
import { Field, FieldError, FieldLabel } from "@/components/input/base/Field";
import { CurrencyInput } from "@/components/input/CurrencyInput";
import { StandardCombobox } from "@/components/input/StandardCombobox";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/toggleGroup/base/ToggleGroup";
import type {
  FieldErrors,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import type { TransactionFormValues } from "./transactionForm";

const ATTRIBUTION_OPTIONS = [
  ["ME", "Me"],
  ["SOMEONE", "Someone else"],
  ["SPLIT", "Split"],
] as const;

type AttributionFieldsProps = {
  watch: UseFormWatch<TransactionFormValues>;
  setValue: UseFormSetValue<TransactionFormValues>;
  errors: FieldErrors<TransactionFormValues>;
  members: PlanMember[];
  currentUserId?: number;
  disabled?: boolean;
};

export const AttributionFields = ({
  watch,
  setValue,
  errors,
  members,
  currentUserId,
  disabled,
}: AttributionFieldsProps) => {
  const attributionMode = watch("attributionMode");
  const otherMembers = members.filter(
    (member) => member.userId !== currentUserId,
  );

  const handleAttributionModeChange = (
    next: TransactionFormValues["attributionMode"],
  ) => {
    setValue("attributionMode", next);
    setValue("splitMode", "EQUAL");
    if (next === "ME") {
      setValue("participants", []);
    } else if (next === "SOMEONE") {
      const kept = watch("participants").filter(
        (p) => p.memberId !== currentUserId,
      );
      setValue("participants", kept.slice(0, 1));
    } else {
      const current = watch("participants");
      if (current.length < 2) {
        setValue(
          "participants",
          members.map((member) => ({
            memberId: member.userId,
            memberName: member.name,
            shareAmount: null,
          })),
        );
      }
    }
  };

  return (
    <>
      <Field>
        <FieldLabel>Attributed to</FieldLabel>
        <ToggleGroup
          aria-label="Attributed to"
          variant="outline"
          tone="primary"
          value={[attributionMode]}
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

      {attributionMode === "SOMEONE" && (
        <Field>
          <FieldLabel htmlFor="transaction-attributed-person">
            Person
          </FieldLabel>
          <StandardCombobox
            id="transaction-attributed-person"
            items={otherMembers.map((member) => ({
              id: member.userId,
              name: member.name,
            }))}
            value={(() => {
              const person = watch("participants")[0];
              return person
                ? { id: person.memberId, name: person.memberName }
                : null;
            })()}
            onValueChange={(value) =>
              setValue(
                "participants",
                value
                  ? [
                      {
                        memberId: value.id,
                        memberName: value.name,
                        shareAmount: null,
                      },
                    ]
                  : [],
              )
            }
            itemLabel={(member) => member.name}
            placeholder="Select a person"
            disabled={disabled}
          />
          <FieldError errors={[errors.participants]} />
        </Field>
      )}

      {attributionMode === "SPLIT" && (
        <>
          <Field>
            <FieldLabel>Split mode</FieldLabel>
            <ToggleGroup
              aria-label="Split mode"
              variant="outline"
              tone="primary"
              value={[watch("splitMode")]}
              onValueChange={([next]) => next && setValue("splitMode", next)}
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
                const participants = watch("participants");
                const index = participants.findIndex(
                  (p) => p.memberId === member.userId,
                );
                const checked = index !== -1;

                return (
                  <div key={member.userId} className="flex items-center gap-2">
                    <Checkbox
                      checked={checked}
                      onCheckedChange={(isChecked) => {
                        if (isChecked) {
                          setValue("participants", [
                            ...participants,
                            {
                              memberId: member.userId,
                              memberName: member.name,
                              shareAmount: null,
                            },
                          ]);
                        } else {
                          setValue(
                            "participants",
                            participants.filter(
                              (p) => p.memberId !== member.userId,
                            ),
                          );
                        }
                      }}
                      disabled={disabled}
                    />
                    <span className="flex-1 text-sm">{member.name}</span>
                    {watch("splitMode") === "EXACT" && checked && (
                      <CurrencyInput
                        aria-label={`${member.name}'s share`}
                        placeholder="R$ 0,00"
                        className="h-8 w-28 text-sm"
                        value={participants[index]?.shareAmount ?? null}
                        onValueChange={(shareAmount) => {
                          const updated = [...participants];
                          updated[index] = { ...updated[index], shareAmount };
                          setValue("participants", updated);
                        }}
                        disabled={disabled}
                      />
                    )}
                  </div>
                );
              })}
            </div>
            <FieldError errors={[errors.participants]} />
          </Field>
        </>
      )}
    </>
  );
};
