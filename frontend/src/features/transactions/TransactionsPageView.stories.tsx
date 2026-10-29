import type { Transaction } from "@/api/dtos/transaction";
import type { PlanMember } from "@/api/dtos/plan";
import { Button } from "@/components/button/base/Button";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { SlidersHorizontalIcon } from "lucide-react";
import { expect, fn } from "storybook/test";
import { buildTransactionColumns } from "./components/transactionColumns";
import { TransactionsPageView } from "./TransactionsPageView";

const members: PlanMember[] = [
  { userId: 1, name: "Lucas Martins", email: "lucas@example.com", role: "OWNER" },
  { userId: 2, name: "Livia Souza", email: "livia@example.com", role: "EDITOR" },
];

function transaction(id: number, overrides: Partial<Transaction> = {}): Transaction {
  return {
    id,
    version: 0,
    type: "DEBIT",
    amount: 120 + id,
    description: `Groceries ${id}`,
    startDate: "2026-10-14",
    endDate: "2026-10-14",
    category: { id: 1, version: 0, type: "DEBIT", description: "Food" },
    splitMode: "EQUAL",
    participants: [
      { id: 1, name: "Lucas Martins", shareAmount: (120 + id) / 2 },
      { id: 2, name: "Livia Souza", shareAmount: (120 + id) / 2 },
    ],
    items: [],
    ...overrides,
  };
}

const transactions = [
  transaction(1),
  transaction(2, { type: "CREDIT", description: "Salary", amount: 6200, category: undefined }),
  transaction(3, { description: "Rent", amount: 2400, startDate: "2026-10-05", endDate: "2026-10-05" }),
];

function columns(sharedPlan: boolean) {
  return buildTransactionColumns({
    onDuplicate: fn(),
    onEdit: fn(),
    onDelete: fn(),
    onSave: fn(),
    showParticipantsColumn: sharedPlan,
    canEditParticipants: sharedPlan,
    members: sharedPlan ? members : [members[0]],
  });
}

const pagination = { number: 0, size: 10, totalElements: 3, totalPages: 1, first: true, last: true };

const meta = {
  title: "Transactions/TransactionsPageView",
  component: TransactionsPageView,
  args: {
    search: "",
    onSearchChange: fn(),
    filters: (
      <Button type="button" variant="outline">
        <SlidersHorizontalIcon />
        Filters
      </Button>
    ),
    chips: [],
    onClearFilters: fn(),
    onImport: fn(),
    isImporting: false,
    transactions,
    isLoading: false,
    pagination,
    onPageChange: fn(),
    onPageSizeChange: fn(),
    columns: columns(true),
    sorting: [],
    onSortChange: fn(),
    onEdit: fn(),
  },
} satisfies Meta<typeof TransactionsPageView>;
export default meta;

type Story = StoryObj<typeof meta>;

export const SharedPlan: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("columnheader", { name: /Attributed/ })).toBeVisible();
    await expect(canvas.getByRole("button", { name: "Import CSV" })).toBeVisible();
    await expect(canvas.queryByRole("button", { name: "New Transaction" })).toBeNull();
    await expect(canvas.queryByRole("button", { name: "Manage Categories" })).toBeNull();
  },
};

export const SingleMember: Story = {
  tags: ["!test"],
  args: { columns: columns(false) },
};

export const Loading: Story = {
  tags: ["!test"],
  args: { transactions: [], isLoading: true, pagination: undefined },
};

export const Empty: Story = {
  tags: ["!test"],
  args: { transactions: [], pagination: { ...pagination, totalElements: 0, totalPages: 0 } },
  play: async ({ canvas }) => {
    // The mobile list and the table both hold the message; CSS shows one per breakpoint.
    const visible = canvas.getAllByText("No transactions found.").find((element) => element.checkVisibility());
    await expect(visible).toBeVisible();
  },
};

export const ActiveFilters: Story = {
  args: {
    search: "groceries",
    chips: [
      { key: "type", label: "Debit", onRemove: fn() },
      { key: "category", label: "Food › Restaurants", onRemove: fn() },
    ],
  },
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Clear all" }));
    await expect(args.onClearFilters).toHaveBeenCalledTimes(1);
  },
};

export const Importing: Story = {
  args: { isImporting: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("button", { name: "Importing..." })).toBeDisabled();
  },
};

export const ManyLongTransactions: Story = {
  tags: ["!test"],
  args: {
    transactions: Array.from({ length: 25 }, (_, index) =>
      transaction(index + 10, {
        description: `Household maintenance, repairs and improvements for the shared apartment ${index + 1}`,
        amount: 98765432.1 + index,
      }),
    ),
    pagination: { number: 3, size: 25, totalElements: 1284, totalPages: 52, first: false, last: false },
  },
};

export const Mobile: Story = {
  tags: ["!test"],
  globals: { viewport: { value: "mobile1" } },
};
