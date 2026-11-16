import { Field, FieldLabel } from "@/components/input/base/Field";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { PasswordInput } from "./PasswordInput";

type DemoFieldProps = {
  disabled?: boolean;
  invalid?: boolean;
};

function DemoField({ disabled = false, invalid = false }: DemoFieldProps) {
  return (
    <Field className="w-72">
      <FieldLabel htmlFor="demo-password">Password</FieldLabel>
      <PasswordInput id="demo-password" disabled={disabled} aria-invalid={invalid} />
    </Field>
  );
}

const meta = {
  title: "Auth/PasswordInput",
  component: DemoField,
} satisfies Meta<typeof DemoField>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Toggle: Story = {
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByLabelText("Password");
    await userEvent.type(input, "secret-password");
    await expect(input).toHaveAttribute("type", "password");

    await userEvent.click(canvas.getByRole("button", { name: "Show password" }));
    await expect(input).toHaveAttribute("type", "text");
    await expect(input).toHaveValue("secret-password");

    await userEvent.click(canvas.getByRole("button", { name: "Hide password" }));
    await expect(input).toHaveAttribute("type", "password");
  },
};

export const Invalid: Story = {
  tags: ["!test"],
  args: { invalid: true },
};

export const Disabled: Story = {
  tags: ["!test"],
  args: { disabled: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText("Password")).toBeDisabled();
    await expect(canvas.getByRole("button", { name: "Show password" })).toBeDisabled();
  },
};
