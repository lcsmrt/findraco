import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { Heading } from "./Heading";

const meta = {
  tags: ["!test"],
  title: "Typography/Heading",
  component: Heading,
  args: { level: 1, variant: "headline", children: "Plans" },
} satisfies Meta<typeof Heading>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Level1Headline: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("heading", { level: 1, name: "Plans" })).toHaveClass("text-2xl", "font-bold");
  },
};

export const Level2Title: Story = {
  args: { level: 2, variant: "title", children: "Members" },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("heading", { level: 2, name: "Members" })).toBeVisible();
  },
};

export const Level3Label: Story = {
  args: { level: 3, variant: "label", children: "Groceries" },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("heading", { level: 3, name: "Groceries" })).toBeVisible();
  },
};

export const Level4Caption: Story = {
  args: { level: 4, variant: "caption", children: "Monday, 5 October" },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("heading", { level: 4, name: "Monday, 5 October" })).toBeVisible();
  },
};

export const Level5Body: Story = {
  args: { level: 5, variant: "body", children: "Pending invitations" },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("heading", { level: 5, name: "Pending invitations" })).toBeVisible();
  },
};

export const Level6Secondary: Story = {
  args: { level: 6, variant: "secondary", children: "Former members" },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("heading", { level: 6, name: "Former members" })).toBeVisible();
  },
};

export const Display: Story = {
  args: { level: 1, variant: "display", children: "404" },
};

export const LongText: Story = {
  args: {
    level: 1,
    variant: "headline",
    className: "max-w-80",
    children: "A very long page title that wraps over several lines on a narrow screen without overflowing",
  },
};
