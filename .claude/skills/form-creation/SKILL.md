---
name: form-creation
description: Build or change a form in the findraco frontend with react-hook-form + zod. Covers the form module (`xxxForm.ts`: schema, value types, `toFormValues`/`toPayload` mappers, with a test), domain-typed form values (money `number | null`, dates `Date`, empty `null`), binding every field through `Controller` via `FormField`, reading other fields with `useWatch` (never root `watch()` + `setValue()`), `useFieldArray` for every dynamic list, `FieldError errors={[…]}`, `CurrencyInput` and `NumberField`, the `FormSheet` skeleton, edit-mode reset, the required `mode` prop, and the `useXxxFormSubmit` hook. Use when building or editing any form: a create/edit sheet or dialog, an auth form, a filter with inputs, or a validated input flow. Triggers on "create a form", "form component", "react-hook-form", "zod schema", "zodResolver", "Controller", "FormField", "register", "watch", "setValue", "useFieldArray", "currency input", "money field", "form drawer", "edit form", "submit handler".
metadata:
  type: reference
---

# Form Creation

Forms use **react-hook-form** + **zod** + **`@hookform/resolvers/zod`**. Pick the container (Dialog,
Sheet, Page) with the table in `component-creation`; sheet forms render through `FormSheet`.

Every form has the same parts:

| Part | File | Holds |
| --- | --- | --- |
| Form module | `xxxForm.ts` (+ `xxxForm.test.ts`) | schema, `XxxFormValues`, `XxxFormOutput`, `toFormValues`, `toPayload`, form helpers |
| Form component | `XxxFormSheet.tsx` / `XxxDialog.tsx` | `useForm`, layout, `FormField`s |
| Field components | `XxxField.tsx` | one field or field group used in more than one place |
| Submit hook | `useXxxFormSubmit.ts` (+ test) | mutations and multi-step submit flows |

---

## The form module: `xxxForm.ts`

The schema, the value types and the mappers live in a `.ts` module next to the form, never in the
component file. Why: a component file exports only components (`component-creation`), validation rules
are business rules, and the test must import them. Enforced by lint
(`react-refresh/only-export-components`) and the sibling gate (`scripts/check-siblings.ts` requires
`xxxForm.test.ts` once the module holds a decision point).

```ts
// productForm.ts
import { z } from "zod";

export const productFormSchema = z.object({
  name: z.string().min(1, "Enter a name"),
  amount: z
    .number()
    .nullable()
    .refine((value): value is number => value !== null && value > 0, "Enter an amount"),
  limit: z.number().positive("Enter a positive limit").nullable(),
  date: z.date({ required_error: "Pick a date" }),
  category: z.object({ id: z.number(), name: z.string() }).nullable(),
});

/** What the fields hold while editing: domain types, `null` when empty. */
export type ProductFormValues = z.input<typeof productFormSchema>;

/** What a valid submit hands over: required fields are no longer `null`. */
export type ProductFormOutput = z.output<typeof productFormSchema>;

export function toFormValues(product?: Product): ProductFormValues {
  if (!product) return { name: "", amount: null, limit: null, date: new Date(), category: null };
  return {
    name: product.name,
    amount: product.amount,
    limit: product.limit ?? null,
    date: parseISO(product.date),
    category: product.category ?? null,
  };
}

export function toPayload(values: ProductFormOutput): CreateProductRequest["body"] {
  return {
    name: values.name,
    amount: values.amount,
    limit: values.limit,
    date: format(values.date, "yyyy-MM-dd"),
    categoryId: values.category?.id ?? null,
  };
}
```

**Form values hold domain types.** Money is `number | null` in reais, dates are `Date`, a missing value
is `null`. Never a masked string, never `0` for "empty" ("no limit" is not "limit R$ 0,00"). Required
and minimum rules live in the schema. The type-predicate `refine` above turns `number | null` into
`number` in `ProductFormOutput`, so `toPayload` needs no `!` or `as`. When no field narrows, the two
types are identical; keep both names anyway so every form reads the same.

**Mappers sit at the boundary and convert shape and type only.** `toFormValues` maps the API response
into form values; `toPayload` maps validated values into the request body. Nested → flat, ISO date →
`Date`, `undefined` → `null`. Never display formatting: a mapper that builds `"R$ 12,34"` or parses one
is wrong.

(`z.date({ required_error })` is the zod v3 API; on zod v4 it is `z.date({ error })`.)

---

## Form setup

```tsx
export function ProductFormSheet({ open, onOpenChange, mode, product }: ProductFormSheetProps) {
  const { control, handleSubmit, reset } = useForm<ProductFormValues, unknown, ProductFormOutput>({
    resolver: zodResolver(productFormSchema),
    defaultValues: toFormValues(product),
  });
  const { submit, isSubmitting } = useProductFormSubmit({
    mode,
    product,
    onDone: () => onOpenChange(false),
  });

  useEffect(() => {
    reset(toFormValues(product));
  }, [product, open, reset]);

  return (
    <FormSheet
      open={open}
      onOpenChange={onOpenChange}
      title={PRODUCT_FORM_TITLES[mode]}
      submitLabel={mode === "edit" ? "Save" : "Create"}
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit(submit)}
    >
      <FieldGroup>
        <FormField control={control} name="name" label="Name">
          {(field) => <Input {...field} />}
        </FormField>
        <FormField control={control} name="amount" label="Amount">
          {(field) => <CurrencyInput {...field} onValueChange={field.onChange} />}
        </FormField>
      </FieldGroup>
    </FormSheet>
  );
}
```

**Edit mode:** reset whenever the entity or the open state changes. The `open` dependency gives a clean
form on every open, not only when the entity changes.

---

## Binding: every field through `Controller`, written via `FormField`

**Every field binds through react-hook-form's `Controller`, written via `FormField`**
(`src/components/form/FormField.tsx`). `FormField` wraps `Controller` + `Field` + `FieldLabel` +
`FieldDescription` + `FieldError` and hands its render prop a `field` that already carries `id`, `ref`,
`onBlur`, `aria-invalid`, `value` and `onChange`:

```tsx
<FormField control={control} name="amount" label="Amount">
  {(field) => <CurrencyInput {...field} onValueChange={field.onChange} />}
</FormField>

<FormField control={control} name="note" label="Note" description="Optional.">
  {(field) => <Textarea {...field} />}
</FormField>

<FormField control={control} name="category" label="Category">
  {(field) => (
    <StandardCombobox
      id={field.id}
      value={field.value}
      onValueChange={field.onChange}
      items={categories}
      itemLabel={(category) => category.name}
    />
  )}
</FormField>
```

- Native inputs spread `field`. Base UI-style inputs take `onValueChange={field.onChange}`, which stays
  visible rather than renaming our props against Base UI's convention.
- Label/`id` wiring, `aria-invalid`, focus-on-error and `FieldError errors={[…]}` hold by construction.
- `FormField` keeps to `label`, `description` and the render prop. Do not add per-case props to it.
- **Special layouts** (horizontal, hidden label) use a raw `Controller`, which stays allowed:

```tsx
<Controller
  control={control}
  name="isRecurring"
  render={({ field, fieldState }) => (
    <Field orientation="horizontal" data-invalid={fieldState.invalid}>
      <Checkbox id="is-recurring" checked={field.value} onCheckedChange={field.onChange} />
      <FieldLabel htmlFor="is-recurring">Repeat monthly</FieldLabel>
      <FieldError errors={[fieldState.error]} />
    </Field>
  )}
/>
```

**Never `register`.** With `register` the DOM is the source of truth: `reset({ amount: 12.34 })` writes
`"12.34"` into the input, so defaults must already be masked strings and the mask leaks into mappers and
state. One binding pattern also removes a per-field judgement call. The cost, one re-render of that
`Controller` per keystroke, is imperceptible at 10–20 fields. Enforced by review.

---

## Reading other fields: `useWatch` in the section, never root `watch()` + `setValue()`

```tsx
// Wrong: the anti-pattern
const { watch, setValue } = useForm<ProductFormValues>();
const recurrence = watch("recurrence");
<DatePicker
  value={watch("date")}
  onChange={(date) => setValue("date", date, { shouldValidate: true })}
/>
```

Root `watch()` re-renders the whole form on every change. A field driven by `setValue()` never fires
blur/touched, cannot receive focus-on-error (no `ref`), and validates only when someone remembers
`{ shouldValidate: true }`.

```tsx
// Right: the field binds through FormField; the section that depends on another field reads it locally
function InstallmentsSection({ control }: InstallmentsSectionProps) {
  const recurrence = useWatch({ control, name: "recurrence" });
  if (recurrence !== "INSTALLMENTS") return null;
  return <InstallmentsField control={control} />;
}
```

Enforced by review.

---

## Dynamic lists: always `useFieldArray`

Every dynamic list inside a form (transaction items, member limits, participants) uses `useFieldArray`.
Never rebuild the array with `setValue("items", …)` and never `watch("items")` to render it. Why: the
manual rebuild runs on every keystroke and re-renders the whole form.

```tsx
function ItemsField({ control }: ItemsFieldProps) {
  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  return (
    <FieldGroup>
      {fields.map((item, index) => (
        <div key={item.id} className="flex items-end gap-2">
          <FormField control={control} name={`items.${index}.description`} label="Description">
            {(field) => <Input {...field} />}
          </FormField>
          <FormField control={control} name={`items.${index}.amount`} label="Amount">
            {(field) => <CurrencyInput {...field} onValueChange={field.onChange} />}
          </FormField>
          <Button variant="ghost" size="icon" type="button" aria-label="Remove item" onClick={() => remove(index)}>
            <TrashIcon />
          </Button>
        </div>
      ))}
      <Button variant="outline" type="button" onClick={() => append({ description: "", amount: null })}>
        Add item
      </Button>
    </FieldGroup>
  );
}
```

Key rows by `item.id` (generated by `useFieldArray`), never by index. Enforced by review.

---

## Errors: `FieldError errors={[…]}` only

`FieldError` always takes `errors={[…]}`. It renders nothing without an error and lists several. Never
re-implement that by hand:

```tsx
// Wrong
{errors.email && <FieldError>{errors.email.message}</FieldError>}

// Right (FormField does this for you; with a raw Controller:)
<FieldError errors={[fieldState.error]} />
```

No lint rule exists for this; enforced by review.

---

## Inputs

- **Money: `CurrencyInput`** (`src/components/input/CurrencyInput.tsx`). Contract: `value: number | null`,
  `onValueChange(value: number | null)`, other props go to `Input`. Typing is ATM-style: each digit
  enters from the right as cents (1, 2, 3, 4 shows R$ 0,01 → R$ 0,12 → R$ 1,23 → R$ 12,34), non-digits
  are ignored, pasting "R$ 12,34" yields 12.34, the numeric keypad opens on mobile. Empty is `null`.
  The masked string never leaves the component: never parse it (`replace(/\D/g, "")`, `/ 100`) and never
  call `maskCurrency`.
- Outside a form (a filter's min/max, an inline table edit), bind `CurrencyInput` to plain state:
  `<CurrencyInput value={min} onValueChange={setMin} />`.
- **Integers: `NumberField`** (`src/components/input/base/NumberField.tsx`, composed from Base UI) with
  `min` and `step` (installments: min 1, step 1). Never a text input that filters digits. Bind it with
  explicit props, never by spreading `field`: its `onChange` would reach the root element and store the
  DOM event instead of the number.

  ```tsx
  <FormField control={control} name="parcelsNumber" label="Installments">
    {(field) => (
      <NumberField
        id={field.id}
        ref={field.ref}
        onBlur={field.onBlur}
        aria-invalid={field["aria-invalid"]}
        value={field.value}
        onValueChange={field.onChange}
        min={1}
        step={1}
      />
    )}
  </FormField>
  ```
- Money arithmetic in a form (items must not exceed the total) goes through `toCents` (`component-creation`,
  Money).

---

## `FormSheet`: the sheet skeleton

Sheet forms render through `FormSheet` (`src/components/form/FormSheet.tsx`): `open`, `onOpenChange`,
`title`, `onSubmit`, `isSubmitting`, `submitLabel`, `mobileActions?`, `children`. It holds only the
skeleton: Sheet, title, scrolling form, footer with Cancel/Submit and loading state, and a
`mobileActions` slot (Delete, Duplicate, New subcategory). Everything specific to a form stays in that
form. Why: if the sheet becomes something else on mobile (a bottom drawer), the change happens once.
Keep it to the skeleton; per-case props piling up is the signal to stop.

---

## Field components: write a field once

A field or field group used in more than one place (create and series edit, two forms) becomes one
field component (`EndDateField`, `InstallmentsField`, `ItemsField`) that takes `control`. Never write
the same field twice.

---

## Modes

A form that supports several operations takes a **required** `mode` prop. Derive every label from it;
never infer the mode from the presence of an entity prop.

```tsx
type ProductFormMode = "create" | "edit" | "duplicate";

const PRODUCT_FORM_TITLES: Record<ProductFormMode, string> = {
  create: "New product",
  edit: "Edit product",
  duplicate: "Duplicate product",
};

type ProductFormSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: ProductFormMode;
  product?: Product;
};
```

- Required, because an optional `mode?` lets a caller omit it and silently get create behaviour while
  editing; TypeScript will not catch it.
- Derived labels avoid a mode that is accepted but never differentiated in the UI.
- Two dialogs that differ only in mode are one component (`PlanNameDialog` with
  `mode: "create" | "rename"`). The caller's overlay state is a discriminated union
  (`component-creation`).

---

## Submit

- A form whose submit calls **one** mutation may submit inline:
  `onSubmit={handleSubmit((values) => createPlan({ body: toPayload(values) }))}`.
- When submit **chooses between mutations** (create/edit/duplicate) or runs a **multi-step flow** (a
  series-scope prompt, a confirmation), it lives in `useXxxFormSubmit.ts` next to the form; the form's
  flow test covers it (`frontend-testing`). The component then stays under the logic cap
  (`component-creation`).

```ts
// useProductFormSubmit.ts
export function useProductFormSubmit({ mode, product, onDone }: UseProductFormSubmitArgs) {
  const createProduct = useCreateProduct({ onSuccess: onDone });
  const updateProduct = useUpdateProduct({ onSuccess: onDone });

  function submit(values: ProductFormOutput) {
    const body = toPayload(values);
    if (mode === "edit" && product) {
      updateProduct.mutate({ params: { id: product.id }, body });
      return;
    }
    createProduct.mutate({ body });
  }

  return { submit, isSubmitting: createProduct.isPending || updateProduct.isPending };
}
```

Success and error toasts come from `buildMutationOptions` inside the service hooks (`api-integration`);
override per call only when needed.

---

## Tests

`xxxForm.test.ts` covers the schema (each rule and message the spec defines), `toFormValues` and
`toPayload`. The submit hook has its own test; the form's flows (create, edit, validation errors) get
integration tests through MSW. Details: `frontend-testing`.
