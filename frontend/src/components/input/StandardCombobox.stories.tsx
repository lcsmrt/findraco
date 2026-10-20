import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, screen } from "storybook/test";
import { Field, FieldLabel } from "./base/Field";
import { StandardCombobox } from "./StandardCombobox";

type Category = { id: number; description: string };

const categories: Category[] = [
  { id: 1, description: "Food" },
  { id: 2, description: "Housing" },
  { id: 3, description: "Transport" },
  { id: 4, description: "Health" },
];

type DemoProps = {
  items?: Category[];
  initialValue?: Category | null;
  loading?: boolean;
  disabled?: boolean;
  clearable?: boolean;
  onCreateOption?: (search: string) => void;
};

// The combobox is controlled, so the story holds the selection like a form field does.
function DemoCombobox({
  items = categories,
  initialValue = null,
  loading,
  disabled,
  clearable,
  onCreateOption,
}: DemoProps) {
  const [value, setValue] = useState(initialValue);
  return (
    <Field className="w-64">
      <FieldLabel htmlFor="demo-category">Category</FieldLabel>
      <StandardCombobox
        id="demo-category"
        items={items}
        value={value}
        onValueChange={setValue}
        itemLabel={(item) => item.description}
        placeholder="Select a category"
        loading={loading}
        disabled={disabled}
        clearable={clearable}
        onCreateOption={onCreateOption}
      />
    </Field>
  );
}

const meta = {
  title: "Input/StandardCombobox",
  component: DemoCombobox,
} satisfies Meta<typeof DemoCombobox>;
export default meta;

type Story = StoryObj<typeof meta>;

// The list renders in a portal, outside the story canvas, so queries go through `screen`.
export const Empty: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("combobox", { name: "Category" }));
    await userEvent.click(await screen.findByRole("option", { name: "Housing" }));
    await expect(canvas.getByRole("combobox", { name: "Category" })).toHaveTextContent("Housing");
  },
};

export const Selected: Story = { args: { initialValue: categories[2] } };

export const Open: Story = {
  tags: ["!test"],
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("combobox", { name: "Category" }));
    await expect(await screen.findByRole("listbox", { name: "Select a category" })).toBeVisible();
    await expect(screen.getByRole("dialog", { name: "Select a category" })).toBeVisible();
  },
};

export const Searching: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("combobox", { name: "Category" }));
    await userEvent.type(await screen.findByPlaceholderText("Search..."), "tra");
    await expect(screen.getAllByRole("option")).toHaveLength(1);
  },
};

export const NoResults: Story = {
  tags: ["!test"],
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("combobox", { name: "Category" }));
    await userEvent.type(await screen.findByPlaceholderText("Search..."), "insurance");
    await expect(screen.getByText("No results")).toBeVisible();
  },
};

export const CreateOption: Story = {
  args: { onCreateOption: fn() },
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("combobox", { name: "Category" }));
    await userEvent.type(await screen.findByPlaceholderText("Search..."), "Insurance");
    await userEvent.click(screen.getByRole("button", { name: /Create/ }));
    await expect(args.onCreateOption).toHaveBeenCalledWith("Insurance");
  },
};

export const Loading: Story = {
  args: { loading: true, items: [] },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("combobox", { name: "Category" }));
    await expect(await screen.findByRole("status")).toBeVisible();
  },
};

export const Clearable: Story = {
  args: { initialValue: categories[0], clearable: true },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Clear selection" }));
    await expect(canvas.getByRole("combobox", { name: "Category" })).toHaveTextContent(
      "Select a category",
    );
  },
};

export const Disabled: Story = { tags: ["!test"], args: { initialValue: categories[0], disabled: true } };

export const LongLabelsManyItems: Story = {
  tags: ["!test"],
  args: {
    items: Array.from({ length: 50 }, (_, index) => ({
      id: index + 1,
      description: `Household maintenance and repairs, subcategory ${index + 1}`,
    })),
    initialValue: { id: 1, description: "Household maintenance and repairs, subcategory 1" },
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("combobox", { name: "Category" }));
    await expect(await screen.findAllByRole("option")).toHaveLength(50);
  },
};
