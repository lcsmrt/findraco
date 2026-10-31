import type { Transaction } from "@/api/dtos/transaction";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";
import { TransactionMobileList } from "./TransactionMobileList";

function transaction(
  id: number,
  description: string,
  startDate: string,
  overrides: Partial<Transaction> = {},
): Transaction {
  return {
    id,
    permissions: { edit: true, delete: true },
    version: 0,
    type: "DEBIT",
    amount: 100,
    description,
    startDate,
    endDate: startDate,
    category: { id: 1, version: 0, type: "DEBIT", description: "Food" },
    splitMode: "EQUAL",
    participants: [{ id: 1, name: "Lucas Martins", shareAmount: 100 }],
    items: [],
    ...overrides,
  };
}

const week: Transaction[] = [
  transaction(1, "Groceries", "2026-10-14", { amount: 320 }),
  transaction(2, "Salary", "2026-10-14", {
    type: "CREDIT",
    amount: 5000,
    category: { id: 9, version: 0, type: "CREDIT", description: "Income" },
  }),
  transaction(3, "Bus pass", "2026-10-12", {
    amount: 150,
    category: undefined,
    participants: [],
  }),
];

const meta = {
  title: "Transactions/TransactionMobileList",
  component: TransactionMobileList,
  args: {
    transactions: week,
    isLoading: false,
    pagination: { number: 0, size: 10, totalElements: 3, totalPages: 1, first: true, last: true },
    onPageChange: fn(),
    onPageSizeChange: fn(),
    onEdit: fn(),
  },
  // The list is the narrow-screen layout, so every story shows it at phone width.
  globals: { viewport: { value: "mobile1" } },
} satisfies Meta<typeof TransactionMobileList>;
export default meta;

type Story = StoryObj<typeof meta>;

export const GroupedByDay: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await expect(canvas.getAllByRole("heading", { level: 3 })).toHaveLength(2);
    await userEvent.click(canvas.getByRole("button", { name: /Groceries/ }));
    await expect(args.onEdit).toHaveBeenCalledWith(week[0]);
  },
};

export const Loading: Story = { args: { transactions: [], isLoading: true, pagination: undefined } };

export const Empty: Story = {
  args: {
    transactions: [],
    pagination: { number: 0, size: 10, totalElements: 0, totalPages: 0, first: true, last: true },
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("No transactions found.")).toBeVisible();
  },
};

export const ManyLongRows: Story = {
  tags: ["!test"],
  args: {
    transactions: Array.from({ length: 30 }, (_, index) =>
      transaction(
        index + 10,
        "Annual maintenance contract for the building's elevators and generators",
        `2026-10-${String(30 - Math.floor(index / 3)).padStart(2, "0")}`,
        {
          amount: 987654.32,
          category: { id: 5, version: 0, type: "DEBIT", description: "Household maintenance and repairs" },
          participants: [
            { id: 1, name: "Maximiliano Albuquerque", shareAmount: 1 },
            { id: 2, name: "Livia Souza", shareAmount: 1 },
          ],
        },
      ),
    ),
    pagination: { number: 2, size: 30, totalElements: 412, totalPages: 14, first: false, last: false },
  },
};

export const Desktop: Story = { tags: ["!test"], globals: { viewport: { value: undefined } } };
