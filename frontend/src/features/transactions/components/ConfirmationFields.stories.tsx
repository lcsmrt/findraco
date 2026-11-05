import type { Meta, StoryObj } from "@storybook/react-vite";
import { useForm } from "react-hook-form";
import { expect } from "storybook/test";
import { RequiresConfirmationField, StatusField } from "./ConfirmationFields";
import {
  buildDefaultValues,
  type TransactionFormOutput,
  type TransactionFormValues,
} from "./transactionForm";

type DemoFormProps = {
  requiresConfirmation?: boolean;
  confirmed?: boolean;
  disabled?: boolean;
};

// The fields need a live form, so each story renders them inside a small test form.
function DemoForm({ requiresConfirmation = true, confirmed = false, disabled }: DemoFormProps) {
  const { control } = useForm<TransactionFormValues, unknown, TransactionFormOutput>({
    defaultValues: { ...buildDefaultValues(), requiresConfirmation, confirmed },
  });

  return (
    <form className="flex w-80 flex-col gap-4">
      <RequiresConfirmationField control={control} disabled={disabled} />
      <StatusField control={control} disabled={disabled} />
    </form>
  );
}

const meta = {
  title: "Transactions/ConfirmationFields",
  component: DemoForm,
} satisfies Meta<typeof DemoForm>;
export default meta;

type Story = StoryObj<typeof meta>;

export const RequiredForecast: Story = {
  args: {},
  play: async ({ canvas, userEvent }) => {
    const required = canvas.getByRole("switch", { name: "Requires confirmation" });
    await expect(required).toBeChecked();
    await expect(canvas.getByRole("button", { name: "Forecast" })).toHaveAttribute("aria-pressed", "true");
    await userEvent.click(required);
    await expect(required).not.toBeChecked();
    await userEvent.click(canvas.getByRole("button", { name: "Actual" }));
    await expect(canvas.getByRole("button", { name: "Actual" })).toHaveAttribute("aria-pressed", "true");
  },
};

export const NotRequiredActual: Story = {
  args: { requiresConfirmation: false, confirmed: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("switch", { name: "Requires confirmation" })).not.toBeChecked();
    await expect(canvas.getByRole("button", { name: "Actual" })).toHaveAttribute("aria-pressed", "true");
  },
};

export const Disabled: Story = {
  tags: ["!test"],
  args: { disabled: true },
};
