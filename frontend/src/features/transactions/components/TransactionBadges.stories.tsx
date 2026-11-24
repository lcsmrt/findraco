import type { Transaction } from "@/api/dtos/transaction";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { TransactionBadges } from "./TransactionBadges";

const base: Transaction = {
  id: 1,
  permissions: { edit: true, delete: true },
  version: 0,
  type: "DEBIT",
  amount: 100,
  description: "Groceries",
  startDate: "2026-10-14",
  endDate: "2026-10-14",
  splitMode: "EQUAL",
  participants: [],
  items: [],
  status: "ACTUAL",
  requiresConfirmation: false,
};

function itemsOf(count: number): Transaction["items"] {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    description: `Item ${index + 1}`,
    amount: 10,
    quantity: 1,
  }));
}

const meta = {
  title: "Transactions/TransactionBadges",
  component: TransactionBadges,
  args: { transaction: base },
  decorators: [
    (Story) => (
      <div className="flex items-center gap-1.5">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TransactionBadges>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Plain: Story = {
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelectorAll("[data-variant]")).toHaveLength(0);
  },
};

// One item reads "1 item", three read "3 items", and a transaction without items has no badge.
export const ItemsCount: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      {[1, 3, 0].map((count) => (
        <div key={count} role="group" aria-label={`${count} items`} className="flex gap-1.5">
          <TransactionBadges transaction={{ ...base, items: itemsOf(count) }} />
        </div>
      ))}
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(within(canvas.getByRole("group", { name: "1 items" })).getByText("1 item")).toHaveAttribute(
      "data-variant",
      "meta",
    );
    await expect(within(canvas.getByRole("group", { name: "3 items" })).getByText("3 items")).toHaveAttribute(
      "data-variant",
      "meta",
    );
    await expect(canvas.getByRole("group", { name: "0 items" }).children).toHaveLength(0);
  },
};

export const Order: Story = {
  args: {
    transaction: {
      ...base,
      status: "FORECAST",
      requiresConfirmation: true,
      kind: "TRANSFER",
      seriesId: "series-1",
      items: itemsOf(3),
    },
  },
  play: async ({ canvasElement }) => {
    const labels = [...canvasElement.querySelectorAll("[data-variant]")].map((badge) => badge.textContent);
    await expect(labels).toEqual(["Forecast", "Between members", "Series", "3 items"]);
  },
};
