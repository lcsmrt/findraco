import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, screen } from "storybook/test";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
  ComboboxValue,
} from "./Combobox";
import { useComboboxAnchor } from "./useComboboxAnchor";

const categories = ["Food", "Housing", "Transport", "Health", "Leisure"];

type DemoComboboxProps = {
  items: string[];
  defaultValue?: string | null;
  defaultOpen?: boolean;
  defaultInputValue?: string;
  disabled?: boolean;
  showClear?: boolean;
};

function DemoCombobox({
  items,
  defaultValue = null,
  defaultOpen = false,
  defaultInputValue,
  disabled = false,
  showClear = false,
}: DemoComboboxProps) {
  return (
    <Combobox
      items={items}
      defaultValue={defaultValue}
      defaultOpen={defaultOpen}
      defaultInputValue={defaultInputValue}
    >
      <ComboboxInput
        aria-label="Category"
        placeholder="Select a category"
        className="w-64"
        disabled={disabled}
        showClear={showClear}
      />
      <ComboboxContent>
        <ComboboxEmpty>No categories found</ComboboxEmpty>
        <ComboboxList aria-label="Categories">
          {(item: string) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}

const meta = {
  tags: ["!test"],
  title: "Input/Combobox",
  component: DemoCombobox,
  args: { items: categories },
} satisfies Meta<typeof DemoCombobox>;
export default meta;

type Story = StoryObj<typeof meta>;

// The popup renders in a portal, outside the story canvas, so queries go through `screen`.
export const Closed: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("combobox", { name: "Category" }));
    await userEvent.click(await screen.findByRole("option", { name: "Housing" }));
    await expect(canvas.getByRole("combobox", { name: "Category" })).toHaveValue("Housing");
  },
};

export const Open: Story = { args: { defaultOpen: true } };

export const Selected: Story = { args: { defaultValue: "Transport", defaultOpen: true } };

export const Clearable: Story = { args: { defaultValue: "Transport", showClear: true } };

export const NoResults: Story = {
  args: { defaultOpen: true, defaultInputValue: "Insurance" },
  play: async () => {
    await expect(await screen.findByText("No categories found")).toBeVisible();
  },
};

export const Disabled: Story = { args: { disabled: true, defaultValue: "Food" } };

export const ManyItems: Story = {
  args: {
    defaultOpen: true,
    items: Array.from(
      { length: 60 },
      (_, index) => `Household maintenance and repairs, subcategory ${index + 1}`,
    ),
  },
};

type CategoryGroup = { value: string; items: string[] };

const groups: CategoryGroup[] = [
  { value: "Expenses", items: ["Food", "Housing"] },
  { value: "Income", items: ["Salary"] },
];

function GroupedCombobox() {
  return (
    <Combobox items={groups} defaultOpen>
      <ComboboxInput aria-label="Category" placeholder="Select a category" className="w-64" />
      <ComboboxContent>
        <ComboboxList aria-label="Categories">
          {(group: CategoryGroup) => (
            <ComboboxGroup key={group.value} items={group.items}>
              <ComboboxLabel>{group.value}</ComboboxLabel>
              <ComboboxCollection>
                {(item: string) => (
                  <ComboboxItem key={item} value={item}>
                    {item}
                  </ComboboxItem>
                )}
              </ComboboxCollection>
              <ComboboxSeparator />
            </ComboboxGroup>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}

export const Groups: Story = { render: () => <GroupedCombobox /> };

function ChipsCombobox() {
  const anchor = useComboboxAnchor();
  return (
    <Combobox items={categories} multiple defaultValue={["Food", "Health"]}>
      <ComboboxChips ref={anchor} className="w-72">
        <ComboboxValue>
          {(values: string[]) =>
            values.map((value) => <ComboboxChip key={value}>{value}</ComboboxChip>)
          }
        </ComboboxValue>
        <ComboboxChipsInput aria-label="Categories" placeholder="Add a category" />
      </ComboboxChips>
      <ComboboxContent anchor={anchor}>
        <ComboboxList aria-label="Categories">
          {(item: string) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}

export const Chips: Story = { render: () => <ChipsCombobox /> };
