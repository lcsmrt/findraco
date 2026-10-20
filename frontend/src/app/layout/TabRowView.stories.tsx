import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router-dom";
import { expect, fn, within } from "storybook/test";
import { TabRowView } from "./TabRowView";

const meta = {
  title: "App/TabRowView",
  component: TabRowView,
  parameters: {
    layout: "fullscreen",
    // The row shows from the `sm` breakpoint up, so the stories render it at a desktop width.
    viewport: {
      options: { desktop: { name: "Desktop", styles: { width: "1024px", height: "768px" }, type: "desktop" } },
    },
  },
  globals: { viewport: { value: "desktop" } },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  args: { current: "overview" },
} satisfies Meta<typeof TabRowView>;
export default meta;

type Story = StoryObj<typeof meta>;

export const OverviewActive: Story = {
  args: { onAdd: fn() },
  play: async ({ args, canvas, userEvent }) => {
    const nav = canvas.getByRole("navigation", { name: "Destinations" });
    const links = within(nav).getAllByRole("link");
    await expect(links.map((link) => link.textContent)).toEqual([
      "Overview",
      "Transactions",
      "Categories",
      "Plans",
    ]);
    await expect(within(nav).getByRole("link", { name: "Overview" })).toHaveAttribute("aria-current", "page");
    await expect(links.filter((link) => link.hasAttribute("aria-current"))).toHaveLength(1);
    await expect(within(nav).getByRole("link", { name: "Plans" })).toHaveAttribute("href", "/plans");

    await userEvent.click(canvas.getByRole("button", { name: "New Transaction" }));
    await expect(args.onAdd).toHaveBeenCalledTimes(1);
  },
};

export const TransactionsActive: Story = {
  tags: ["!test"],
  args: { current: "transactions", onAdd: fn() },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("link", { name: "Transactions" })).toHaveAttribute("aria-current", "page");
  },
};

export const CategoriesActive: Story = {
  tags: ["!test"],
  args: { current: "categories", onAdd: fn() },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("link", { name: "Categories" })).toHaveAttribute("aria-current", "page");
  },
};

export const PlansActive: Story = {
  tags: ["!test"],
  args: { current: "plans", onAdd: fn() },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("link", { name: "Plans" })).toHaveAttribute("aria-current", "page");
  },
};

export const WithoutAdd: Story = {
  args: { onAdd: null },
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole("link")).toHaveLength(4);
    await expect(canvas.queryByRole("button", { name: "New Transaction" })).toBeNull();
  },
};
