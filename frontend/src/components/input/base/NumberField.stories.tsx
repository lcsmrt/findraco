import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect } from "storybook/test";
import { Field, FieldError, FieldLabel } from "./Field";
import { NumberField } from "./NumberField";

type InstallmentsFieldProps = {
  initialValue: number | null;
  disabled?: boolean;
  error?: string;
};

// NumberField is controlled here, as the forms bind it.
function InstallmentsField({
  initialValue,
  disabled,
  error,
}: InstallmentsFieldProps) {
  const [value, setValue] = useState(initialValue);

  return (
    <Field className="w-48" data-invalid={Boolean(error)}>
      <FieldLabel htmlFor="installments">Number of installments</FieldLabel>
      <NumberField
        id="installments"
        min={1}
        step={1}
        value={value}
        onValueChange={setValue}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        placeholder="e.g., 12"
      />
      <FieldError errors={[error ? { message: error } : undefined]} />
    </Field>
  );
}

const meta = {
  title: "Input/NumberField",
  component: InstallmentsField,
} satisfies Meta<typeof InstallmentsField>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Increment: Story = {
  args: { initialValue: 2 },
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByRole("textbox", {
      name: "Number of installments",
    });
    await userEvent.click(canvas.getByRole("button", { name: "Increase" }));
    await expect(input).toHaveValue("3");
    await userEvent.click(input);
    await userEvent.keyboard("{ArrowUp}");
    await expect(input).toHaveValue("4");
  },
};

export const DecrementAtMin: Story = {
  args: { initialValue: 1 },
  play: async ({ canvas, userEvent }) => {
    const decrease = canvas.getByRole("button", { name: "Decrease" });
    await expect(decrease).toBeDisabled();
    await userEvent.click(
      canvas.getByRole("textbox", { name: "Number of installments" }),
    );
    await userEvent.keyboard("{ArrowDown}");
    await expect(
      canvas.getByRole("textbox", { name: "Number of installments" }),
    ).toHaveValue("1");
  },
};

export const Typing: Story = {
  args: { initialValue: null },
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByRole("textbox", {
      name: "Number of installments",
    });
    await userEvent.type(input, "12");
    await expect(input).toHaveValue("12");
  },
};

export const Invalid: Story = {
  args: { initialValue: null, error: "Enter at least 2 installments" },
};

export const Disabled: Story = {
  args: { initialValue: 12, disabled: true },
};
