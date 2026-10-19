import type { Meta, StoryObj } from "@storybook/react-vite";
import { SearchIcon, XIcon } from "lucide-react";
import { expect } from "storybook/test";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "./InputGroup";

const meta = {
  title: "Input/InputGroup",
  component: InputGroup,
} satisfies Meta<typeof InputGroup>;
export default meta;

type Story = StoryObj<typeof meta>;

export const InlineStart: Story = {
  render: () => (
    <InputGroup className="w-64">
      <InputGroupAddon>
        <SearchIcon aria-hidden />
      </InputGroupAddon>
      <InputGroupInput aria-label="Search" placeholder="Search..." />
    </InputGroup>
  ),
  // Clicking the addon focuses the input, so the icon acts as part of the field.
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getAllByRole("group")[1]);
    await expect(canvas.getByRole("textbox", { name: "Search" })).toHaveFocus();
  },
};

export const InlineEnd: Story = {
  render: () => (
    <InputGroup className="w-64">
      <InputGroupInput aria-label="Amount" placeholder="0,00" />
      <InputGroupAddon align="inline-end">
        <InputGroupText>BRL</InputGroupText>
      </InputGroupAddon>
    </InputGroup>
  ),
};

export const WithButton: Story = {
  render: () => (
    <InputGroup className="w-64">
      <InputGroupInput aria-label="Search" defaultValue="groceries" />
      <InputGroupAddon align="inline-end">
        <InputGroupButton size="icon-xs" aria-label="Clear search">
          <XIcon />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  ),
};

export const BlockAddons: Story = {
  render: () => (
    <InputGroup className="w-80">
      <InputGroupAddon align="block-start">
        <InputGroupText>Notes</InputGroupText>
      </InputGroupAddon>
      <InputGroupTextarea aria-label="Notes" placeholder="Anything worth remembering" />
      <InputGroupAddon align="block-end">
        <InputGroupText>0 / 280</InputGroupText>
      </InputGroupAddon>
    </InputGroup>
  ),
};

export const Invalid: Story = {
  render: () => (
    <InputGroup className="w-64">
      <InputGroupAddon>
        <SearchIcon aria-hidden />
      </InputGroupAddon>
      <InputGroupInput aria-label="Search" aria-invalid defaultValue="??" />
    </InputGroup>
  ),
};

export const Disabled: Story = {
  render: () => (
    <InputGroup className="w-64" data-disabled="true">
      <InputGroupAddon>
        <SearchIcon aria-hidden />
      </InputGroupAddon>
      <InputGroupInput aria-label="Search" disabled placeholder="Search..." />
    </InputGroup>
  ),
};

export const LongValue: Story = {
  render: () => (
    <InputGroup className="w-64">
      <InputGroupAddon>
        <SearchIcon aria-hidden />
      </InputGroupAddon>
      <InputGroupInput
        aria-label="Search"
        defaultValue="Annual maintenance contract for the building's elevators and generators"
      />
    </InputGroup>
  ),
};
