import type { Meta, StoryObj } from "@storybook/react-vite";
import { CheckIcon, ClockIcon, TriangleAlertIcon, XIcon } from "lucide-react";
import { Badge } from "./Badge";

const meta = {
  tags: ["!test"],
  title: "Badge",
  component: Badge,
  args: { children: "Shared" },
} satisfies Meta<typeof Badge>;
export default meta;

type Story = StoryObj<typeof meta>;

export const MetaFact: Story = { args: { variant: "meta" } };

export const Tag: Story = { args: { variant: "tag", children: "Food" } };

export const StatusNeutral: Story = {
  args: {
    variant: "status",
    tone: "neutral",
    children: (
      <>
        <ClockIcon data-icon="inline-start" aria-hidden />
        Forecast
      </>
    ),
  },
};

export const StatusWarning: Story = {
  args: {
    variant: "status",
    tone: "warning",
    children: (
      <>
        <TriangleAlertIcon data-icon="inline-start" aria-hidden />
        Pending
      </>
    ),
  },
};

export const StatusSuccess: Story = {
  args: {
    variant: "status",
    tone: "success",
    children: (
      <>
        <CheckIcon data-icon="inline-start" aria-hidden />
        Accepted
      </>
    ),
  },
};

export const StatusDestructive: Story = {
  args: {
    variant: "status",
    tone: "destructive",
    children: (
      <>
        <XIcon data-icon="inline-start" aria-hidden />
        Revoked
      </>
    ),
  },
};

export const Ghost: Story = { args: { variant: "ghost" } };

export const Link: Story = {
  args: { variant: "link", render: <a href="#plans" />, children: "Plans" },
};

// A badge never wraps: long labels are clipped by the pill so rows keep their height.
export const LongLabel: Story = {
  args: {
    variant: "meta",
    className: "max-w-40",
    children: "Household groceries and weekly market",
  },
};
