import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "./Checkbox";
import { Input } from "./Input";
import { Label } from "./Label";

const meta = {
  tags: ["!test"],
  title: "Input/Label",
  component: Label,
} satisfies Meta<typeof Label>;
export default meta;

type Story = StoryObj<typeof meta>;

export const ForInput: Story = {
  render: () => (
    <div className="flex w-64 flex-col gap-2">
      <Label htmlFor="label-name">Name</Label>
      <Input id="label-name" placeholder="Lucas" />
    </div>
  ),
};

export const ForCheckbox: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="label-recurring" />
      <Label htmlFor="label-recurring">Recurring</Label>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="label-disabled" disabled className="peer" />
      <Label htmlFor="label-disabled">Unavailable on the free plan</Label>
    </div>
  ),
};

export const LongText: Story = {
  render: () => (
    <div className="flex w-64 flex-col gap-2">
      <Label htmlFor="label-long">
        Description shown on every installment of this recurring transaction
      </Label>
      <Input id="label-long" />
    </div>
  ),
};
