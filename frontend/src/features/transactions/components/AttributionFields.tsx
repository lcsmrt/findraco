import { PlanMember } from "@/api/dtos/plan";
import { Button } from "@/components/button/base/Button";
import { Checkbox } from "@/components/input/base/Checkbox";
import { Field, FieldError, FieldLabel } from "@/components/input/base/Field";
import { CurrencyInput } from "@/components/input/CurrencyInput";
import { StandardCombobox } from "@/components/input/StandardCombobox";
import { cn } from "@/lib/mergeClasses";
import type {
  FieldErrors,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import type { TransactionFormValues } from "./transactionForm";

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
        <div className="flex w-full gap-2">
          {(
            [
              ["ME", "Me"],
              ["SOMEONE", "Someone else"],
              ["SPLIT", "Split"],
            ] as const
          ).map(([value, label]) => (
            <Button
              key={value}
              type="button"
              variant="ghost"
              disabled={disabled}
              onClick={() => handleAttributionModeChange(value)}
              className={cn(
                "flex-1 border",
                attributionMode === value
                  ? "border-primary/30 bg-primary/15 text-primary-ink hover:bg-primary/20 hover:text-primary-ink"
                  : "border-border text-muted-foreground hover:border-primary/30 hover:text-primary-ink hover:bg-transparent",
              )}
            >
              {label}
            </Button>
          ))}
        </div>
      </Field>

      {attributionMode === "SOMEONE" && (
        <Field>
          <FieldLabel htmlFor="transaction-attributed-person">Person</FieldLabel>
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
            <div className="flex w-full gap-2">
              <Button
                type="button"
                variant="ghost"
                disabled={disabled}
                onClick={() => setValue("splitMode", "EQUAL")}
                className={cn(
                  "flex-1 border",
                  watch("splitMode") === "EQUAL"
                    ? "border-primary/30 bg-primary/15 text-primary-ink hover:bg-primary/20 hover:text-primary-ink"
                    : "border-border text-muted-foreground hover:border-primary/30 hover:text-primary-ink hover:bg-transparent",
                )}
              >
                Equal
              </Button>
              <Button
                type="button"
                variant="ghost"
                disabled={disabled}
                onClick={() => setValue("splitMode", "EXACT")}
                className={cn(
                  "flex-1 border",
                  watch("splitMode") === "EXACT"
                    ? "border-primary/30 bg-primary/15 text-primary-ink hover:bg-primary/20 hover:text-primary-ink"
                    : "border-border text-muted-foreground hover:border-primary/30 hover:text-primary-ink hover:bg-transparent",
                )}
              >
                Exact
              </Button>
            </div>
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
