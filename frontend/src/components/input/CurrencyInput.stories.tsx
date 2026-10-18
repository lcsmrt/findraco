import { Field, FieldError, FieldLabel } from "@/components/input/base/Field";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect } from "storybook/test";
import { CurrencyInput } from "./CurrencyInput";

type CurrencyFieldProps = {
  initialValue: number | null;
  disabled?: boolean;
  error?: string;
};

// CurrencyInput is controlled, so the stories hold its value in local state like a filter does.
function CurrencyField({ initialValue, disabled, error }: CurrencyFieldProps) {
  const [value, setValue] = useState(initialValue);

  return (
    <Field className="w-72" data-invalid={Boolean(error)}>
      <FieldLabel htmlFor="amount">Amount</FieldLabel>
      <CurrencyInput
        id="amount"
        value={value}
        onValueChange={setValue}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        placeholder="R$ 0,00"
      />
      <FieldError errors={[error ? { message: error } : undefined]} />
    </Field>
  );
}

const meta = {
  title: "Input/CurrencyInput",
  component: CurrencyField,
} satisfies Meta<typeof CurrencyField>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: { initialValue: null },
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByLabelText("Amount");
    await userEvent.type(input, "1234");
    await expect(input).toHaveValue("R$\u00a012,34");
  },
};

export const WithValue: Story = {
  args: { initialValue: 1250.5 },
};

export const LargeValue: Story = {
  args: { initialValue: 9999999999999.99 },
};

export const Invalid: Story = {
  args: { initialValue: null, error: "Enter an amount" },
};

export const Disabled: Story = {
  args: { initialValue: 12.34, disabled: true },
};
