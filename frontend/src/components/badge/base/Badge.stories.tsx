import type { Meta, StoryObj } from "@storybook/react-vite";
import { CheckIcon } from "lucide-react";
import { Badge } from "./Badge";

const meta = {
  tags: ["!test"],
  title: "Badge",
  component: Badge,
  args: { children: "Shared" },
} satisfies Meta<typeof Badge>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Secondary: Story = { args: { variant: "secondary" } };

export const Destructive: Story = { args: { variant: "destructive", children: "Over limit" } };

export const Success: Story = { args: { variant: "success", children: "Paid" } };

export const Outline: Story = { args: { variant: "outline" } };

export const Ghost: Story = { args: { variant: "ghost" } };

export const Link: Story = {
  args: { variant: "link", render: <a href="#plans" />, children: "Plans" },
};

export const WithIcon: Story = {
  args: {
    variant: "success",
    children: (
      <>
        <CheckIcon data-icon="inline-start" aria-hidden />
        Paid
      </>
    ),
  },
};

// A badge never wraps: long labels are clipped by the pill so rows keep their height.
export const LongLabel: Story = {
  args: {
    variant: "secondary",
    className: "max-w-40",
    children: "Household groceries and weekly market",
  },
};
