import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router-dom";
import { expect, fn, within } from "storybook/test";
import { BottomBarView } from "./BottomBarView";

const meta = {
  title: "App/BottomBarView",
  component: BottomBarView,
  parameters: {
    layout: "fullscreen",
    // The bar shows below the `sm` breakpoint only, so the stories render it at a phone width.
    viewport: {
      options: { phone: { name: "Phone (390px)", styles: { width: "390px", height: "844px" }, type: "mobile" } },
    },
  },
  globals: { viewport: { value: "phone" } },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  args: { current: "overview" },
} satisfies Meta<typeof BottomBarView>;
export default meta;

type Story = StoryObj<typeof meta>;

// The token's colour as the browser computes it, to compare with an element's computed `color`.
function tokenColor(token: string) {
  const probe = document.createElement("span");
  probe.style.color = `var(${token})`;
  document.body.append(probe);
  const color = getComputedStyle(probe).color;
  probe.remove();
  return color;
}

function itemNames(bar: HTMLElement) {
  return Array.from(bar.querySelectorAll("a, button")).map((item) => item.getAttribute("aria-label") ?? item.textContent);
}

export const OverviewActive: Story = {
  args: { onAdd: fn() },
  play: async ({ args, canvas, userEvent }) => {
    const bar = canvas.getByRole("navigation", { name: "Bottom bar" });
    await expect(bar).toBeVisible();
    await expect(itemNames(bar)).toEqual([
      "Overview",
      "Transactions",
      "New Transaction",
      "Categories",
      "Plans",
    ]);
    for (const label of ["Overview", "Transactions", "Categories", "Plans"]) {
      await expect(within(bar).getByText(label)).toBeVisible();
    }
    await expect(within(bar).getByRole("link", { name: "Overview" })).toHaveAttribute("aria-current", "page");
    await expect(within(bar).getAllByRole("link").filter((link) => link.hasAttribute("aria-current"))).toHaveLength(1);
    await expect(within(bar).getByRole("link", { name: "Plans" })).toHaveAttribute("href", "/plans");

    const activeColor = getComputedStyle(within(bar).getByRole("link", { name: "Overview" })).color;
    await expect(activeColor).toBe(tokenColor("--primary-ink"));
    await expect(getComputedStyle(within(bar).getByText("Overview")).color).toBe(activeColor);
    await expect(getComputedStyle(within(bar).getByRole("link", { name: "Plans" })).color).not.toBe(activeColor);

    await userEvent.click(within(bar).getByRole("button", { name: "New Transaction" }));
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
    const bar = canvas.getByRole("navigation", { name: "Bottom bar" });
    await expect(itemNames(bar)).toEqual(["Overview", "Transactions", "Categories", "Plans"]);
    // Four evenly spaced items: each takes the same share of the bar's width.
    const widths = within(bar).getAllByRole("link").map((link) => link.getBoundingClientRect().width);
    await expect(new Set(widths.map((width) => Math.round(width))).size).toBe(1);
    await expect(Math.round(widths[0] * 4)).toBe(Math.round(bar.getBoundingClientRect().width));
  },
};
