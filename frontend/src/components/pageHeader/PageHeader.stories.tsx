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

export const WithActions: Story = {
  args: {
    actions: (
      <Button size="sm">
        <PlusIcon />
        New plan
      </Button>
    ),
  },
  play: async ({ canvas }) => {
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
    actions: <Button size="sm">Invite</Button>,
  },
};

export const Mobile: Story = {
  tags: ["!test"],
  args: WithActions.args,
  globals: { viewport: { value: "mobile1" } },
};

// A title the user typed wraps onto a second line and stays whole, with the action still on the row.
export const WrappedLongTitle: Story = {
  args: {
    title: "Tia Maria Antonieta de Albuquerque Cavalcanti Pereira",
    wrapTitle: true,
    actions: <Button size="sm">Invite</Button>,
  },
  decorators: [
    (Story) => (
      <div className="w-[390px]">
        <Story />
      </div>
    ),
  ],
  play: async ({ canvas }) => {
    const title = canvas.getByRole("heading", { level: 1 });
    await expect(title.scrollWidth).toBeLessThanOrEqual(title.clientWidth);
    await expect(canvas.getByRole("button", { name: "Invite" })).toBeVisible();
  },
};
