import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { Checkbox } from "./Checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "./Field";
import { Input } from "./Input";

const meta = {
  title: "Input/Field",
  component: Field,
} satisfies Meta<typeof Field>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Vertical: Story = {
  render: () => (
    <Field className="w-72">
      <FieldLabel htmlFor="field-description">Description</FieldLabel>
      <Input id="field-description" placeholder="Groceries" />
      <FieldDescription>Shown in the transaction list.</FieldDescription>
    </Field>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <Field orientation="horizontal" className="w-72">
      <Checkbox id="field-recurring" />
      <FieldContent>
        <FieldLabel htmlFor="field-recurring">Recurring</FieldLabel>
        <FieldDescription>Repeats every month until the end date.</FieldDescription>
      </FieldContent>
    </Field>
  ),
};

// The responsive orientation follows the field group's width, so it stacks in a narrow column.
export const Responsive: Story = {
  render: () => (
    <FieldGroup>
      <Field orientation="responsive">
        <FieldLabel htmlFor="field-limit">Monthly limit</FieldLabel>
        <Input id="field-limit" placeholder="R$ 0,00" />
      </Field>
    </FieldGroup>
  ),
};

export const ResponsiveMobile: Story = {
  ...Responsive,
  globals: { viewport: { value: "mobile1" } },
};

export const Invalid: Story = {
  render: () => (
    <Field data-invalid className="w-72">
      <FieldLabel htmlFor="field-amount">Amount</FieldLabel>
      <Input id="field-amount" aria-invalid defaultValue="-5" />
      <FieldError errors={[{ message: "Amount must be greater than zero" }]} />
    </Field>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("alert")).toHaveTextContent("Amount must be greater than zero");
  },
};

// Duplicate messages collapse; distinct ones become a list.
export const SeveralErrors: Story = {
  render: () => (
    <Field data-invalid className="w-72">
      <FieldLabel htmlFor="field-password">Password</FieldLabel>
      <Input id="field-password" type="password" aria-invalid />
      <FieldError
        errors={[
          { message: "At least 8 characters" },
          { message: "At least one number" },
          { message: "At least 8 characters" },
        ]}
      />
    </Field>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole("listitem")).toHaveLength(2);
  },
};

export const NoErrors: Story = {
  render: () => (
    <Field className="w-72">
      <FieldLabel htmlFor="field-name">Name</FieldLabel>
      <Input id="field-name" />
      <FieldError errors={[]} />
    </Field>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole("alert")).toBeNull();
  },
};

export const Set: Story = {
  render: () => (
    <FieldSet className="w-80">
      <FieldLegend>Account</FieldLegend>
      <FieldDescription>Used to sign in and to share plans.</FieldDescription>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="field-email">Email</FieldLabel>
          <Input id="field-email" type="email" />
        </Field>
        <FieldSeparator>or</FieldSeparator>
        <Field>
          <FieldTitle>Display name</FieldTitle>
          <Input aria-label="Display name" />
        </Field>
      </FieldGroup>
    </FieldSet>
  ),
};

export const LongContent: Story = {
  render: () => (
    <Field className="w-72">
      <FieldLabel htmlFor="field-long">
        Description shown on every installment of this recurring transaction
      </FieldLabel>
      <Input id="field-long" />
      <FieldDescription>
        Installments keep the same description, category and attribution; only the amount and the
        date change from one month to the next.
      </FieldDescription>
    </Field>
  ),
};
