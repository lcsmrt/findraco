import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { Text } from "./Text";

const LONG_TEXT =
  "Groceries, pharmacy and the weekly market run split between three members of the household, with the remainder carried over to next month's budget so nothing is lost on the way.";

const meta = {
  tags: ["!test"],
  title: "Typography/Text",
  component: Text,
  args: { children: "Spending by category" },
} satisfies Meta<typeof Text>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Display: Story = { args: { variant: "display", children: "404" } };

export const Headline: Story = { args: { variant: "headline", children: "R$ 12.345,67" } };

export const Title: Story = { args: { variant: "title" } };

export const Label: Story = { args: { variant: "label" } };

export const Body: Story = {
  args: {},
  play: async ({ canvas }) => {
    const text = canvas.getByText("Spending by category");
    await expect(text.tagName).toBe("SPAN");
    await expect(text).toHaveClass("text-sm");
  },
};

export const Secondary: Story = { args: { variant: "secondary" } };

export const Caption: Story = { args: { variant: "caption" } };

export const Paragraph: Story = {
  args: { as: "p", variant: "secondary", children: LONG_TEXT },
  play: async ({ canvas }) => {
    await expect(canvas.getByText(LONG_TEXT).tagName).toBe("P");
  },
};

export const LongText: Story = {
  args: { as: "div", variant: "label", className: "max-w-60 truncate", children: LONG_TEXT },
};

export const ColourOverride: Story = {
  args: { variant: "label", className: "text-destructive", children: "Over the limit" },
};
