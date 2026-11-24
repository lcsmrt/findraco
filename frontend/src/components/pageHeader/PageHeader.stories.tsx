import type { Meta, StoryObj } from "@storybook/react-vite";
import { PlusIcon } from "lucide-react";
import { expect } from "storybook/test";
import { Button } from "@/components/button/base/Button";
import { PageHeader } from "./PageHeader";

const meta = {
  title: "Layout/PageHeader",
  component: PageHeader,
  args: { title: "Plans" },
} satisfies Meta<typeof PageHeader>;
export default meta;

type Story = StoryObj<typeof meta>;

export const TitleOnly: Story = {
  tags: ["!test"],
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("heading", { level: 1, name: "Plans" })).toBeVisible();
  },
};

export const WithDescriptionAndActions: Story = {
  args: {
    description: "Manage your plans and switch between them.",
    actions: (
      <Button size="sm">
        <PlusIcon />
        New plan
      </Button>
    ),
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Manage your plans and switch between them.")).toBeVisible();
    await expect(canvas.getByRole("button", { name: "New plan" })).toBeVisible();
  },
};

// The context row frames the page's data (period, member) under the title; the actions stay beside it.
export const WithContext: Story = {
  args: {
    title: "Overview",
    context: <Button variant="outline">October 2026</Button>,
    actions: <Button variant="outline">Export</Button>,
  },
  play: async ({ canvas }) => {
    const title = canvas.getByRole("heading", { level: 1, name: "Overview" });
    const context = canvas.getByRole("button", { name: "October 2026" });
    await expect(context).toBeVisible();
    await expect(context.getBoundingClientRect().top).toBeGreaterThan(title.getBoundingClientRect().bottom);
    await expect(canvas.getByRole("button", { name: "Export" })).toBeVisible();
  },
};

export const LongTitle: Story = {
  tags: ["!test"],
  args: {
    title: "Household finances shared with the whole family and two flatmates",
    description: "Every member sees the same transactions, categories and limits.",
    actions: <Button size="sm">Invite</Button>,
  },
};

export const Mobile: Story = {
  tags: ["!test"],
  args: WithDescriptionAndActions.args,
  globals: { viewport: { value: "mobile1" } },
};
