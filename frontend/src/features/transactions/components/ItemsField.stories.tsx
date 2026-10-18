import { Input } from "@/components/input/base/Input";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useForm } from "react-hook-form";
import { expect } from "storybook/test";
import { ItemsField } from "./ItemsField";
import {
  buildDefaultValues,
  type TransactionFormOutput,
  type TransactionFormValues,
} from "./transactionForm";

const food: TransactionFormValues["category"] = {
  id: 1,
  type: "DEBIT",
  description: "Food",
  spendingLimit: null,
};

type DemoFormProps = {
  amount: number | null;
  items: TransactionFormValues["items"];
  itemsError?: string;
};

// ItemsField needs a live form, so each story renders it inside a small test form. The real
// category picker fetches the plan's categories; a read-only input stands in for it here.
function DemoForm({ amount, items, itemsError }: DemoFormProps) {
  const { control } = useForm<TransactionFormValues, unknown, TransactionFormOutput>({
    defaultValues: { ...buildDefaultValues(), amount, items },
    errors: itemsError ? { items: { root: { type: "custom", message: itemsError } } } : undefined,
  });

  return (
    <form className="w-96">
      <ItemsField
        control={control}
        renderCategory={(picker) => (
          <Input
            readOnly
            aria-label={`Item ${picker.index + 1} category`}
            placeholder="Category"
            value={picker.value?.description ?? ""}
          />
        )}
      />
    </form>
  );
}

const meta = {
  title: "Transactions/ItemsField",
  component: DemoForm,
} satisfies Meta<typeof DemoForm>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: { amount: 100, items: [] },
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.queryByText(/Remainder/)).toBeNull();
    await userEvent.click(canvas.getByRole("button", { name: "Add item" }));
    await expect(canvas.getByLabelText("Item 1 amount")).toBeVisible();
    await expect(canvas.getByText("Remainder: R$ 100,00")).toBeVisible();
  },
};

export const SeveralItems: Story = {
  args: {
    amount: 250,
    items: [
      { description: "Rice", amount: 32.9, category: food },
      { description: "Coffee", amount: 48.5, category: food },
      { description: "Cleaning supplies", amount: 61.35, category: null },
    ],
  },
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByText("Remainder: R$ 107,25")).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Remove item 3" }));
    await expect(canvas.queryByLabelText("Item 3 amount")).toBeNull();
    await expect(canvas.getByText("Remainder: R$ 168,60")).toBeVisible();
  },
};

export const OverTotal: Story = {
  args: {
    amount: 10,
    items: [{ description: "Snacks", amount: 20, category: null }],
    itemsError: "Items cannot exceed the transaction total",
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Remainder: -R$ 10,00")).toBeVisible();
    await expect(canvas.getByRole("alert")).toHaveTextContent(
      "Items cannot exceed the transaction total",
    );
  },
};

export const LongDescriptions: Story = {
  args: {
    amount: 987654.32,
    items: [
      {
        description: "Annual maintenance contract for the building's elevators and generators",
        amount: 123456.78,
        category: food,
      },
    ],
  },
};
