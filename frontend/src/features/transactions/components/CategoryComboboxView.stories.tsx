import type { Category } from "@/api/dtos";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, screen } from "storybook/test";
import { FieldLabel } from "@/components/input/base/Field";
import { groupCategoryOptions } from "../utils/categoryOptions";
import { categoryQuickCreate } from "../utils/categoryQuickCreate";
import { CategoryComboboxView } from "./CategoryComboboxView";

const categories: Category[] = [
  { id: 1, version: 0, type: "DEBIT", description: "Food" },
  { id: 11, version: 0, type: "DEBIT", description: "Restaurants", parentId: 1 },
  { id: 12, version: 0, type: "DEBIT", description: "Groceries", parentId: 1 },
  { id: 2, version: 0, type: "DEBIT", description: "Housing" },
  { id: 3, version: 0, type: "DEBIT", description: "Transport" },
];

type DemoProps = {
  categories: Category[];
  initialSearch?: string;
  initialValue?: Category | null;
  isLoading?: boolean;
  disabled?: boolean;
  defaultOpen?: boolean;
  canManageCategories?: boolean;
  /** Disables the create row, as while the request is pending. */
  creating?: boolean;
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
  defaultOpen = false,
  canManageCategories = true,
  creating = false,
  onCreate = () => {},
}: DemoProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [search, setSearch] = useState(initialSearch);
  const [value, setValue] = useState<Category | null | undefined>(initialValue);
  const quickCreate = categoryQuickCreate({ search, type: "DEBIT", categories: all, canManageCategories });

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
        quickCreate={quickCreate && { label: quickCreate.label, disabled: creating }}
        onCreate={onCreate}
        onClear={() => setValue(null)}
        disabled={disabled}
        open={open}
        onOpenChange={setOpen}
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
    await userEvent.click(await screen.findByRole("button", { name: 'Create expense category "Pets"' }));
    await expect(args.onCreate).toHaveBeenCalledTimes(1);
  },
};

// A partial match ("Food" for "Foo") still offers the row.
export const CreateNextToMatches: Story = {
  args: { defaultOpen: true, initialSearch: "Foo" },
  play: async () => {
    await expect(await screen.findByRole("option", { name: "Food" })).toBeVisible();
    await expect(screen.getByRole("button", { name: 'Create expense category "Foo"' })).toBeVisible();
  },
};

export const CreateExistingName: Story = {
  args: { defaultOpen: true, initialSearch: "housing" },
  play: async () => {
    await expect(await screen.findByRole("option", { name: "Housing" })).toBeVisible();
    await expect(screen.queryByRole("button", { name: /^Create/ })).toBeNull();
  },
};

export const CreatePending: Story = {
  args: { defaultOpen: true, initialSearch: "Pets", creating: true },
  play: async () => {
    await expect(await screen.findByRole("button", { name: 'Create expense category "Pets"' })).toBeDisabled();
  },
};

export const CreateNotAllowed: Story = {
  args: { defaultOpen: true, initialSearch: "Pets", canManageCategories: false },
  play: async () => {
    await expect(await screen.findByText("No results")).toBeVisible();
    await expect(screen.queryByRole("button", { name: /^Create/ })).toBeNull();
  },
};

export const Disabled: Story = {
  tags: ["!test"],
  args: { initialValue: categories[0], disabled: true },
};

export const ManyLongNames: Story = {
  tags: ["!test"],
  args: {
    defaultOpen: true,
    initialValue: {
      id: 900,
      version: 0,
      type: "DEBIT",
      description: "Household maintenance, repairs and improvements for the shared apartment",
    },
    categories: Array.from({ length: 30 }, (_, index) => ({
      id: 100 + index,
      version: 0,
      type: "DEBIT" as const,
      description: `Household maintenance, repairs and improvements ${index + 1}`,
    })),
  },
};
