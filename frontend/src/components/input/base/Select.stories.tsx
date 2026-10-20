import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
} from "./Select";
import { Field, FieldLabel } from "./Field";

const meta: Meta<typeof Select> = {
  title: "Input/Select",
  component: Select,
  tags: ["autodocs", "!test"],
};
export default meta;

type Story = StoryObj<typeof Select>;

export const Default: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-48" aria-label="Option">
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="option1">Option 1</SelectItem>
        <SelectItem value="option2">Option 2</SelectItem>
        <SelectItem value="option3">Option 3</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const WithField: Story = {
  render: () => (
    <Field className="w-48">
      <FieldLabel htmlFor="role">Role</FieldLabel>
      <Select>
        <SelectTrigger id="role">
          <SelectValue placeholder="Select a role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="editor">Editor</SelectItem>
          <SelectItem value="viewer">Viewer</SelectItem>
        </SelectContent>
      </Select>
    </Field>
  ),
};

export const WithGroups: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-48" aria-label="Fruit">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Citrus</SelectLabel>
          <SelectItem value="orange">Orange</SelectItem>
          <SelectItem value="lemon">Lemon</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Berries</SelectLabel>
          <SelectItem value="strawberry">Strawberry</SelectItem>
          <SelectItem value="blueberry">Blueberry</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};
