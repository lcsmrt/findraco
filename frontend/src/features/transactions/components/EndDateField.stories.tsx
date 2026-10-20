import type { Meta, StoryObj } from "@storybook/react-vite";
import { useForm } from "react-hook-form";
import { expect } from "storybook/test";
import { EndDateField } from "./EndDateField";
import {
  buildDefaultValues,
  type TransactionFormOutput,
  type TransactionFormValues,
} from "./transactionForm";

type DemoFormProps = {
  endDate?: Date;
  error?: string;
  disabled?: boolean;
};

// EndDateField needs a live form, so each story renders it inside a small test form.
function DemoForm({ endDate, error, disabled }: DemoFormProps) {
  const { control } = useForm<TransactionFormValues, unknown, TransactionFormOutput>({
    defaultValues: { ...buildDefaultValues(), endDate },
    errors: error ? { endDate: { type: "custom", message: error } } : undefined,
  });

  return (
    <form className="w-80">
      <EndDateField control={control} disabled={disabled} />
    </form>
  );
}

const meta = {
  title: "Transactions/EndDateField",
  component: DemoForm,
} satisfies Meta<typeof DemoForm>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Ongoing: Story = {
  args: {},
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByText("Ongoing")).toBeVisible();
    await userEvent.type(canvas.getByLabelText("End date"), "31/12/2026");
    await userEvent.tab();
    await expect(canvas.queryByText("Ongoing")).toBeNull();
  },
};

export const WithEndDate: Story = {
  args: { endDate: new Date(2026, 11, 31) },
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText("End date")).toHaveValue("31/12/2026");
    await expect(canvas.queryByText("Ongoing")).toBeNull();
  },
};

export const BeforeStartDate: Story = {
  args: {
    endDate: new Date(2026, 0, 1),
    error: "The end date must be after the start date",
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("alert")).toHaveTextContent(
      "The end date must be after the start date",
    );
  },
};

export const Disabled: Story = {
  tags: ["!test"],
  args: { disabled: true },
};
