import { typographyVariants } from "@/components/typography/base/typographyVariants";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { PlusIcon } from "lucide-react";
import { expect } from "storybook/test";
import { Button } from "@/components/button/base/Button";
import { SectionHeader } from "./SectionHeader";

const meta = {
  title: "Layout/SectionHeader",
  component: SectionHeader,
  args: { title: "Members" },
} satisfies Meta<typeof SectionHeader>;
export default meta;

type Story = StoryObj<typeof meta>;

export const TitleOnly: Story = {
  tags: ["!test"],
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("heading", { level: 2, name: "Members" })).toHaveClass(
      ...typographyVariants({ variant: "title" }).split(" "),
    );
  },
};

export const WithSubtitleAndAction: Story = {
  args: {
    subtitle: "People who can see this plan.",
    children: (
      <Button size="sm">
        <PlusIcon />
        Invite
      </Button>
    ),
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("People who can see this plan.")).toBeVisible();
    await expect(canvas.getByRole("button", { name: "Invite" })).toBeVisible();
  },
};

export const NestedLevel: Story = {
  tags: ["!test"],
  args: { level: 3, title: "Pending invitations" },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("heading", { level: 3, name: "Pending invitations" })).toBeVisible();
  },
};

export const LongText: Story = {
  tags: ["!test"],
  args: {
    title: "Spending by category across every member of the household this month",
    subtitle: "Limits apply per member; the remainder carries over to the next period automatically.",
    children: <Button size="sm">Edit</Button>,
  },
};

export const Mobile: Story = {
  tags: ["!test"],
  args: WithSubtitleAndAction.args,
  globals: { viewport: { value: "mobile1" } },
};
