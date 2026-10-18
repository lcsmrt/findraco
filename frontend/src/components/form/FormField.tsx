import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/input/base/Field";
import { useId, type ReactNode } from "react";
import {
  Controller,
  type Control,
  type ControllerRenderProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

/** What the render prop receives: react-hook-form's field, plus the wiring the label and error need. */
export type FormFieldControlProps<
  TValues extends FieldValues,
  TName extends FieldPath<TValues>,
> = ControllerRenderProps<TValues, TName> & {
  id: string;
  "aria-invalid": boolean;
};

type FormFieldProps<
  TValues extends FieldValues,
  TName extends FieldPath<TValues>,
  TTransformedValues,
> = {
  control: Control<TValues, unknown, TTransformedValues>;
  name: TName;
  label: ReactNode;
  description?: ReactNode;
  children: (field: FormFieldControlProps<TValues, TName>) => ReactNode;
};

/**
 * One form field bound through `Controller`: the label points at the input, the input reports
 * `aria-invalid`, and the error renders under it. Special layouts (horizontal, hidden label) use a raw
 * `Controller` instead of growing props here.
 */
export function FormField<
  TValues extends FieldValues,
  TName extends FieldPath<TValues>,
  TTransformedValues = TValues,
>({ control, name, label, description, children }: FormFieldProps<TValues, TName, TTransformedValues>) {
  const id = useId();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} data-disabled={field.disabled}>
          <FieldLabel htmlFor={id}>{label}</FieldLabel>
          {children({ ...field, id, "aria-invalid": fieldState.invalid })}
          {description && <FieldDescription>{description}</FieldDescription>}
          <FieldError errors={[fieldState.error]} />
        </Field>
      )}
    />
  );
}
