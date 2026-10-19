import type { FinancialTransactionCategory } from "@/api/dtos";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, screen } from "storybook/test";
import { FieldLabel } from "@/components/input/base/Field";
import { groupCategoryOptions } from "../utils/categoryOptions";
import { CategoryComboboxView } from "./CategoryComboboxView";

const categories: FinancialTransactionCategory[] = [
  { id: 1, type: "DEBIT", description: "Food" },
  { id: 11, type: "DEBIT", description: "Restaurants", parentId: 1 },
  { id: 12, type: "DEBIT", description: "Groceries", parentId: 1 },
  { id: 2, type: "DEBIT", description: "Housing" },
  { id: 3, type: "DEBIT", description: "Transport" },
];

type DemoProps = {
  categories: FinancialTransactionCategory[];
  initialSearch?: string;
  initialValue?: FinancialTransactionCategory | null;
  isLoading?: boolean;
  disabled?: boolean;
  defaultOpen?: boolean;
  onCreate?: () => void;
};

// The view is controlled, so the stories hold the search and the value like the container does,
// and group the options with the real builder.
function Demo({
  categories: all,
  initialSearch = "",
  initialValue = null,
  isLoading = false,
  disabled,
  defaultOpen,
  onCreate = () => {},
}: DemoProps) {
  const [search, setSearch] = useState(initialSearch);
  const [value, setValue] = useState<FinancialTransactionCategory | null | undefined>(initialValue);

  return (
    <div className="flex w-72 flex-col gap-2">
      <FieldLabel htmlFor="category">Category</FieldLabel>
      <CategoryComboboxView
        id="category"
        value={value}
        onValueChange={setValue}
        options={groupCategoryOptions(all, search)}
        isLoading={isLoading}
        search={search}
        onSearchChange={setSearch}
        onCreate={onCreate}
        onClear={() => setValue(null)}
        disabled={disabled}
        defaultOpen={defaultOpen}
      />
    </div>
  );
}

const meta = {
  title: "Transactions/CategoryComboboxView",
  component: Demo,
  args: { categories, onCreate: fn() },
} satisfies Meta<typeof Demo>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("combobox", { name: "Category" }));
    await userEvent.click(await screen.findByRole("option", { name: "Restaurants" }));
    await expect(canvas.getByRole("combobox", { name: "Category" })).toHaveTextContent("Restaurants");
  },
};

export const Selected: Story = {
  args: { initialValue: categories[3] },
};

export const OpenGrouped: Story = {
  args: { defaultOpen: true },
  play: async () => {
    await expect(await screen.findByRole("option", { name: "Groceries" })).toBeVisible();
  },
};

export const Loading: Story = {
  args: { defaultOpen: true, isLoading: true },
};

export const NoCategories: Story = {
  args: { categories: [], defaultOpen: true },
  play: async () => {
    await expect(await screen.findByText("No results")).toBeVisible();
  },
};

export const CreateFromSearch: Story = {
  args: { defaultOpen: true, initialSearch: "Pets" },
  play: async ({ args, userEvent }) => {
    await userEvent.click(await screen.findByRole("button", { name: "Create “Pets”" }));
    await expect(args.onCreate).toHaveBeenCalledTimes(1);
  },
};

export const Disabled: Story = {
  args: { initialValue: categories[0], disabled: true },
};

export const ManyLongNames: Story = {
  args: {
    defaultOpen: true,
    initialValue: {
      id: 900,
      type: "DEBIT",
      description: "Household maintenance, repairs and improvements for the shared apartment",
    },
    categories: Array.from({ length: 30 }, (_, index) => ({
      id: 100 + index,
      type: "DEBIT" as const,
      description: `Household maintenance, repairs and improvements ${index + 1}`,
    })),
  },
};
