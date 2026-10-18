import { Button } from "@/components/button/Button";
import { Field, FieldError, FieldLabel } from "@/components/input/base/Field";
import { Input } from "@/components/input/base/Input";
import { cn } from "@/lib/mergeClasses";
import { maskCurrency } from "@/utils/string/masks";
import { Trash2Icon } from "lucide-react";
import type {
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import type { CategoryFormValues } from "./categoryForm";

type CategoryLimitFieldsProps = {
  register: UseFormRegister<CategoryFormValues>;
  watch: UseFormWatch<CategoryFormValues>;
  setValue: UseFormSetValue<CategoryFormValues>;
  errors: FieldErrors<CategoryFormValues>;
  /** Read-only share of the per-member total, in percent, by member id. */
  shares: Map<number, number>;
  /** Set when per-member limits are not allowed (e.g. an owned category). */
  perMemberDisabledReason?: string;
  disabled?: boolean;
};

const modeButtonClass = (selected: boolean) =>
  cn(
    "flex-1 border",
    selected
      ? "border-primary/30 bg-primary/15 text-primary-ink hover:bg-primary/20 hover:text-primary-ink"
      : "border-border text-muted-foreground hover:border-primary/30 hover:text-primary-ink hover:bg-transparent",
  );

/** Monthly limit of a DEBIT category: one plain amount, or one amount per member (CAT-11, CAT-14). */
export const CategoryLimitFields = ({
  register,
  watch,
  setValue,
  errors,
  shares,
  perMemberDisabledReason,
  disabled,
}: CategoryLimitFieldsProps) => {
  const limitMode = watch("limitMode");
  const rows = watch("memberLimits");
  const rowErrors = rows.map(
    (_, index) =>
      errors.memberLimits?.[index]?.amount ??
      errors.memberLimits?.[index]?.memberId,
  );
  const perMemberAllowed = perMemberDisabledReason == null;
  const isPerMember = limitMode === "perMember" && perMemberAllowed;

  const { onChange: onLimitChange, ...limitRest } = register("spendingLimit");

  const removeFormerMember = (memberId: number) =>
    setValue(
      "memberLimits",
      rows.filter((row) => row.memberId !== memberId),
      { shouldValidate: true },
    );

  return (
    <>
      <Field>
        <FieldLabel>Monthly limit</FieldLabel>
        <div className="flex w-full gap-2">
          <Button
            type="button"
            variant="ghost"
            disabled={disabled}
            onClick={() => setValue("limitMode", "single", { shouldValidate: true })}
            className={modeButtonClass(!isPerMember)}
          >
            Single
          </Button>
          <Button
            type="button"
            variant="ghost"
            disabled={disabled || !perMemberAllowed}
            onClick={() => setValue("limitMode", "perMember", { shouldValidate: true })}
            className={modeButtonClass(isPerMember)}
          >
            Per member
          </Button>
        </div>
        {perMemberDisabledReason && (
          <p className="text-muted-foreground text-xs">{perMemberDisabledReason}</p>
        )}
        <FieldError errors={[errors.limitMode]} />
      </Field>

      {!isPerMember && (
        <Field>
          <FieldLabel htmlFor="category-spending-limit">
            Amount{" "}
            <span className="text-muted-foreground font-normal">(optional)</span>
          </FieldLabel>
          <Input
            id="category-spending-limit"
            type="text"
            inputMode="numeric"
            placeholder="R$ 0,00"
            disabled={disabled}
            {...limitRest}
            onChange={(e) => {
              e.target.value = maskCurrency(e.target.value);
              onLimitChange(e);
            }}
          />
        </Field>
      )}

      {isPerMember && (
        <Field>
          <FieldLabel>Limit per member</FieldLabel>
          <div className="flex flex-col gap-2">
            {rows.map((row, index) => {
              const { onChange, ...rest } = register(`memberLimits.${index}.amount`);
              const share = shares.get(row.memberId);
              return (
                <div
                  key={row.memberId}
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
                  <Input
                    type="text"
                    inputMode="numeric"
                    placeholder="No limit"
                    className="w-32"
                    aria-label={`Limit for ${row.memberName}`}
                    disabled={disabled || !row.active}
                    aria-invalid={!!errors.memberLimits?.[index]?.amount}
                    {...rest}
                    onChange={(e) => {
                      e.target.value = maskCurrency(e.target.value);
                      onChange(e);
                    }}
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
                      onClick={() => removeFormerMember(row.memberId)}
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
};
