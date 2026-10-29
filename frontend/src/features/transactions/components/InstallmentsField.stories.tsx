import type { RecurrenceDefinitionResponse } from "@/api/dtos/transaction";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useForm } from "react-hook-form";
import { expect } from "storybook/test";
import { InstallmentsField } from "./InstallmentsField";
import {
  buildDefaultValues,
  type TransactionFormOutput,
  type TransactionFormValues,
} from "./transactionForm";

const definition: RecurrenceDefinitionResponse = {
  id: 9,
  seriesId: "s-1",
  type: "DEBIT",
  amount: 150,
  description: "Sofa",
  mode: "INSTALLMENT",
  parcelsNumber: 12,
  firstParcel: 3,
  startDate: "2026-05-01",
  splitMode: "EQUAL",
  participants: [],
};

type DemoFormProps = {
  parcelsNumber?: number;
  currentParcel?: number;
  seriesEdit?: boolean;
  error?: string;
};

// InstallmentsField needs a live form, so each story renders it inside a small test form.
function DemoForm({ parcelsNumber, currentParcel, seriesEdit = false, error }: DemoFormProps) {
  const { control } = useForm<TransactionFormValues, unknown, TransactionFormOutput>({
    defaultValues: { ...buildDefaultValues(), date: new Date(2026, 6, 15), parcelsNumber, currentParcel },
    errors: error ? { parcelsNumber: { type: "custom", message: error } } : undefined,
  });

  return (
    <form className="flex w-80 flex-col gap-4">
      {seriesEdit ? (
        <InstallmentsField mode="seriesEdit" definition={definition} control={control} />
      ) : (
        <InstallmentsField mode="create" control={control} />
      )}
    </form>
  );
}

const meta = {
  title: "Transactions/InstallmentsField",
  component: DemoForm,
} satisfies Meta<typeof DemoForm>;
export default meta;

type Story = StoryObj<typeof meta>;

export const CreateEmpty: Story = {
  args: {},
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.queryByText(/Last installment/)).toBeNull();
    await userEvent.type(canvas.getByLabelText("Number of installments"), "12");
    await userEvent.tab();
    await expect(canvas.getByText("Last installment: 12/12 — 06/2027")).toBeVisible();
  },
};

export const CreateFromALaterInstallment: Story = {
  args: { parcelsNumber: 12, currentParcel: 3 },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Last installment: 12/12 — 04/2027")).toBeVisible();
  },
};

export const CreateTooFewInstallments: Story = {
  args: { parcelsNumber: 1, error: "Enter at least 2 installments" },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("alert")).toHaveTextContent("Enter at least 2 installments");
    await expect(canvas.queryByText(/Last installment/)).toBeNull();
  },
};

export const SeriesEdit: Story = {
  args: { seriesEdit: true, parcelsNumber: 12 },
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByText("Currently: parcel 3 of 12")).toBeVisible();
    await expect(canvas.queryByText(/updates the whole series/)).toBeNull();
    await userEvent.click(canvas.getByRole("button", { name: "Increase" }));
    await expect(
      canvas.getByText("Changing the number of parcels updates the whole series."),
    ).toBeVisible();
  },
};

export const ManyInstallments: Story = {
  tags: ["!test"],
  args: { parcelsNumber: 360, currentParcel: 1 },
};
