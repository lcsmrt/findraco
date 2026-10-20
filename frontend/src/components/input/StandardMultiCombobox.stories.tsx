import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, screen } from "storybook/test";
import { Field, FieldLabel } from "./base/Field";
import { StandardMultiCombobox } from "./StandardMultiCombobox";

type Member = { id: number; name: string };

const members: Member[] = [
  { id: 1, name: "Lucas Martins" },
  { id: 2, name: "Livia Souza" },
  { id: 3, name: "Ana Lima" },
  { id: 4, name: "Bruno Costa" },
  { id: 5, name: "Carla Dias" },
];

type DemoProps = {
  items?: Member[];
  initialValue?: Member[];
  disabled?: boolean;
  maxVisibleChips?: number;
};

// The combobox is controlled, so the story holds the selection like a filter does.
function DemoMultiCombobox({ items = members, initialValue = [], disabled, maxVisibleChips }: DemoProps) {
  const [value, setValue] = useState(initialValue);
  return (
    <Field className="w-80">
      <FieldLabel htmlFor="demo-members">Members</FieldLabel>
      <StandardMultiCombobox
        id="demo-members"
        items={items}
        value={value}
        onValueChange={setValue}
        itemLabel={(item) => item.name}
        placeholder="All members"
        disabled={disabled}
        maxVisibleChips={maxVisibleChips}
      />
    </Field>
  );
}

const meta = {
  title: "Input/StandardMultiCombobox",
  component: DemoMultiCombobox,
} satisfies Meta<typeof DemoMultiCombobox>;
export default meta;

type Story = StoryObj<typeof meta>;

// The list renders in a portal, outside the story canvas, so queries go through `screen`.
export const Empty: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByText("All members"));
    await userEvent.click(await screen.findByRole("option", { name: "Ana Lima" }));
    await expect(canvas.getByText("Ana Lima")).toBeVisible();
  },
};

export const Open: Story = {
  tags: ["!test"],
  args: { initialValue: [members[0]] },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByText("Lucas Martins"));
    await expect(await screen.findByRole("listbox", { name: "All members" })).toBeVisible();
  },
};

export const SomeSelected: Story = { args: { initialValue: members.slice(0, 2) } };

// Past the visible maximum, the rest collapse into a "+N" badge.
export const Overflow: Story = {
  args: { initialValue: members },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("+2")).toBeVisible();
  },
};

export const NoResults: Story = {
  tags: ["!test"],
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByText("All members"));
    await userEvent.type(await screen.findByPlaceholderText("Search..."), "zzz");
    await expect(screen.getByText("No results")).toBeVisible();
  },
};

export const Disabled: Story = { tags: ["!test"], args: { initialValue: members.slice(0, 1), disabled: true } };

export const LongNames: Story = {
  tags: ["!test"],
  args: {
    items: [
      { id: 1, name: "Maria Eduarda Albuquerque de Vasconcelos" },
      { id: 2, name: "João Pedro Cavalcanti de Oliveira Neto" },
    ],
    initialValue: [
      { id: 1, name: "Maria Eduarda Albuquerque de Vasconcelos" },
      { id: 2, name: "João Pedro Cavalcanti de Oliveira Neto" },
    ],
    maxVisibleChips: 1,
  },
};
