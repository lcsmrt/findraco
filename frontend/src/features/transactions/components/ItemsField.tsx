import type { Category } from "@/api/dtos";
import type { TransactionType } from "@/api/dtos/transaction";
import { Button } from "@/components/button/base/Button";
import { Field, FieldError, FieldLabel } from "@/components/input/base/Field";
import { Input } from "@/components/input/base/Input";
import { CurrencyInput } from "@/components/input/CurrencyInput";
import { Text } from "@/components/typography/base/Text";
import { cn } from "@/lib/mergeClasses";
import { formatMoney } from "@/utils/money";
import { PlusIcon, Trash2Icon } from "lucide-react";
import type { ReactElement } from "react";
import { Controller, useFieldArray, useFormState, useWatch, type Control } from "react-hook-form";
import {
  itemsRemainderCents,
  type TransactionFormOutput,
  type TransactionFormValues,
} from "./transactionForm";

/** What an item row hands its category picker. */
export type ItemCategoryPicker = {
  index: number;
  type: TransactionType;
  value: Category | null;
  onValueChange: (value: Category | null | undefined) => void;
  disabled?: boolean;
};

type ItemsFieldProps = {
  control: Control<TransactionFormValues, unknown, TransactionFormOutput>;
  /** The category picker fetches the plan's categories, so the form passes it in. */
  renderCategory: (picker: ItemCategoryPicker) => ReactElement;
  disabled?: boolean;
};

/** The transaction's items: each with a description, an amount and a category, and the remainder. */
export function ItemsField({ control, renderCategory, disabled }: ItemsFieldProps) {
  const { fields, append, remove } = useFieldArray({ control, name: "items" });
  const items = useWatch({ control, name: "items" });
  const amount = useWatch({ control, name: "amount" });
  const type = useWatch({ control, name: "type" });
  const { errors } = useFormState({ control, name: "items" });
  const remainderCents = itemsRemainderCents(amount, items);

  return (
    <Field>
      <FieldLabel>Items</FieldLabel>
      <div className="flex flex-col gap-2">
        {fields.map((item, index) => (
          <div key={item.id} className="border-border flex flex-col gap-2 rounded-md border p-2">
            {/* The row has no visible labels, a layout FormField does not offer. */}
            <div className="flex items-center gap-2">
              <Controller
                control={control}
                name={`items.${index}.description`}
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    aria-label={`Item ${index + 1} description`}
                    aria-invalid={fieldState.invalid}
                    placeholder="Item description"
                    className="flex-1"
                    disabled={disabled}
                  />
                )}
              />
              <Controller
                control={control}
                name={`items.${index}.amount`}
                render={({ field, fieldState }) => (
                  <CurrencyInput
                    {...field}
                    onValueChange={field.onChange}
                    aria-label={`Item ${index + 1} amount`}
                    aria-invalid={fieldState.invalid}
                    placeholder="R$ 0,00"
                    className="w-28"
                    disabled={disabled}
                  />
                )}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={`Remove item ${index + 1}`}
                disabled={disabled}
                onClick={() => remove(index)}
              >
                <Trash2Icon className="h-3.5 w-3.5" />
              </Button>
            </div>
            <Controller
              control={control}
              name={`items.${index}.category`}
              render={({ field }) =>
                renderCategory({
                  index,
                  type,
                  value: field.value ?? null,
                  onValueChange: (category) => field.onChange(category ?? null),
                  disabled,
                })
              }
            />
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled}
          onClick={() => append({ description: "", amount: null, category: null })}
        >
          <PlusIcon className="h-3.5 w-3.5" />
          Add item
        </Button>
      </div>
      {fields.length > 0 && (
        <Text as="p" variant="secondary" className={cn(remainderCents < 0 && "text-destructive")}>
          Remainder: {formatMoney(remainderCents / 100)}
        </Text>
      )}
      {/* With the item amounts registered as fields, the resolver files the list-level error under
          `root`. */}
      <FieldError errors={[errors.items?.root]} />
    </Field>
  );
}
