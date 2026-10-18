import { Button } from "@/components/button/base/Button";
import { Field, FieldError, FieldLabel } from "@/components/input/base/Field";
import { FormField } from "@/components/form/FormField";
import { CurrencyInput } from "@/components/input/CurrencyInput";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/toggleGroup/base/ToggleGroup";
import { cn } from "@/lib/mergeClasses";
import { Trash2Icon } from "lucide-react";
import {
  Controller,
  useController,
  useFieldArray,
  useFormState,
  useWatch,
  type Control,
} from "react-hook-form";
import {
  memberLimitShares,
  type CategoryFormOutput,
  type CategoryFormValues,
} from "./categoryForm";

type CategoryLimitFieldsProps = {
  control: Control<CategoryFormValues, unknown, CategoryFormOutput>;
  /** Set when per-member limits are not allowed (e.g. an owned category). */
  perMemberDisabledReason?: string;
  disabled?: boolean;
};

/** Monthly limit of a DEBIT category: one plain amount, or one amount per member (CAT-11, CAT-14). */
export function CategoryLimitFields({
  control,
  perMemberDisabledReason,
  disabled,
}: CategoryLimitFieldsProps) {
  const { field: limitMode } = useController({ control, name: "limitMode" });
  const { fields, remove } = useFieldArray({ control, name: "memberLimits" });
  const shares = memberLimitShares(useWatch({ control, name: "memberLimits" }));
  const { errors } = useFormState({ control, name: ["limitMode", "memberLimits"] });
  const rowErrors = fields.map(
    (_, index) => errors.memberLimits?.[index]?.amount ?? errors.memberLimits?.[index]?.memberId,
  );
  const perMemberAllowed = perMemberDisabledReason == null;
  const isPerMember = limitMode.value === "perMember" && perMemberAllowed;

  return (
    <>
      <Field>
        <FieldLabel>Monthly limit</FieldLabel>
        <ToggleGroup
          aria-label="Monthly limit"
          variant="outline"
          tone="primary"
          value={[isPerMember ? "perMember" : "single"]}
          onValueChange={([next]) => next && limitMode.onChange(next)}
          disabled={disabled}
          className="w-full flex-nowrap"
        >
          <ToggleGroupItem value="single" className="flex-1">
            Single
          </ToggleGroupItem>
          <ToggleGroupItem
            value="perMember"
            disabled={!perMemberAllowed}
            className="flex-1"
          >
            Per member
          </ToggleGroupItem>
        </ToggleGroup>
        {perMemberDisabledReason && (
          <p className="text-muted-foreground text-xs">
            {perMemberDisabledReason}
          </p>
        )}
        <FieldError errors={[errors.limitMode]} />
      </Field>

      {!isPerMember && (
        <FormField
          control={control}
          name="spendingLimit"
          label={
            <>
              Amount{" "}
              <span className="text-muted-foreground font-normal">
                (optional)
              </span>
            </>
          }
        >
          {(field) => (
            <CurrencyInput
              {...field}
              onValueChange={field.onChange}
              placeholder="R$ 0,00"
              disabled={disabled}
            />
          )}
        </FormField>
      )}

      {isPerMember && (
        <Field>
          <FieldLabel>Limit per member</FieldLabel>
          <div className="flex flex-col gap-2">
            {fields.map((row, index) => {
              const share = shares.get(row.memberId);
              return (
                <div
                  key={row.id}
                  className={cn(
                    "flex items-center gap-2",
                    !row.active && "text-muted-foreground",
                  )}
                >
                  <span className="min-w-0 flex-1 truncate text-sm">
                    {row.memberName}
                    {!row.active && (
                      <span className="ml-1 text-xs">(former member)</span>
                    )}
                  </span>
                  {/* The member's name labels the row, a layout FormField does not offer. */}
                  <Controller
                    control={control}
                    name={`memberLimits.${index}.amount`}
                    render={({ field, fieldState }) => (
                      <CurrencyInput
                        {...field}
                        onValueChange={field.onChange}
                        placeholder="No limit"
                        className="w-32"
                        aria-label={`Limit for ${row.memberName}`}
                        disabled={disabled || !row.active}
                        aria-invalid={fieldState.invalid}
                      />
                    )}
                  />
                  <span className="text-muted-foreground w-14 text-right text-xs tabular-nums">
                    {share != null ? `${share}%` : "—"}
                  </span>
                  {!row.active ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      disabled={disabled}
                      aria-label={`Remove ${row.memberName}'s limit`}
                      onClick={() => remove(index)}
                    >
                      <Trash2Icon className="h-4 w-4" />
                    </Button>
                  ) : (
                    <span className="w-8" />
                  )}
                </div>
              );
            })}
          </div>
          <p className="text-muted-foreground text-xs">
            The category limit is the sum of the members' limits. A member left
            empty has no limit of their own.
          </p>
          <FieldError errors={rowErrors} />
        </Field>
      )}
    </>
  );
}
