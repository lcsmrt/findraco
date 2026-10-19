import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";
import { Text } from "@/components/typography/base/Text";
import { HomeTabsView } from "./HomeTabsView";

const meta = {
  title: "App/HomeTabsView",
  component: HomeTabsView,
  args: {
    activeTab: "overview",
    onTabChange: fn(),
    children: <Text as="p">Tab content</Text>,
  },
} satisfies Meta<typeof HomeTabsView>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Transactions" }));
    await expect(args.onTabChange).toHaveBeenCalledWith("transactions");
  },
};

export const Transactions: Story = {
  args: { activeTab: "transactions" },
};

export const Categories: Story = {
  args: { activeTab: "categories" },
};

export const LongContent: Story = {
  args: {
    children: (
      <Text as="p">
        {"A tab with a lot of content that wraps over several lines to check the layout holds. ".repeat(12)}
      </Text>
    ),
  },
};

export const Mobile: Story = {
  args: { activeTab: "transactions" },
  globals: { viewport: { value: "mobile1" } },
};
