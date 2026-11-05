import type { Meta, StoryObj } from "@storybook/react-vite";
import { Field, FieldLabel } from "./Field";
import { Switch } from "./Switch";

const meta: Meta<typeof Switch> = {
  title: "Input/Switch",
  component: Switch,
  tags: ["autodocs", "!test"],
};
export default meta;

type Story = StoryObj<typeof Switch>;

export const Off: Story = {
  render: () => (
    <Field orientation="horizontal">
      <Switch id="off" />
      <FieldLabel htmlFor="off">Notifications</FieldLabel>
    </Field>
  ),
};

export const On: Story = {
  render: () => (
    <Field orientation="horizontal">
      <Switch id="on" defaultChecked />
      <FieldLabel htmlFor="on">Notifications</FieldLabel>
    </Field>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Field orientation="horizontal">
      <Switch id="disabled" disabled />
      <FieldLabel htmlFor="disabled">Notifications</FieldLabel>
    </Field>
  ),
};
