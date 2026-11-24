import type { Transaction } from "@/api/dtos/transaction";
import type { PlanMember } from "@/api/dtos/plan";
import { Button } from "@/components/button/base/Button";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { SlidersHorizontalIcon } from "lucide-react";
import { page } from "@vitest/browser/context";
import { expect, fn, waitFor, within } from "storybook/test";
import PeriodNavigatorMeta from "@/components/periodNavigator/PeriodNavigator.stories";
import { buildTransactionColumns } from "./components/transactionColumns";
import { TransactionsPageView } from "./TransactionsPageView";

const members: PlanMember[] = [
  { userId: 1, name: "Lucas Martins", email: "lucas@example.com", role: "OWNER" },
  { userId: 2, name: "Livia Souza", email: "livia@example.com", role: "EDITOR" },
];

function transaction(id: number, overrides: Partial<Transaction> = {}): Transaction {
  return {
    id,
    permissions: { edit: true, delete: true },
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
    status: "ACTUAL",
    requiresConfirmation: false,
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
    onConfirm: fn(),
    canConfirm: () => false,
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
    navigator: PeriodNavigatorMeta.args,
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
    onConfirm: fn(),
    canConfirm: () => false,
  },
} satisfies Meta<typeof TransactionsPageView>;
export default meta;

type Story = StoryObj<typeof meta>;

export const SharedPlan: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("button", { name: "Choose period, October 2026" })).toBeVisible();
    await expect(canvas.getByRole("button", { name: "Previous period" })).toBeVisible();
    await expect(canvas.getByRole("columnheader", { name: /Attributed/ })).toBeVisible();
    await expect(canvas.getByRole("button", { name: "Import CSV" })).toBeVisible();
    await expect(canvas.queryByRole("button", { name: "New Transaction" })).toBeNull();
    await expect(canvas.queryByRole("button", { name: "Manage Categories" })).toBeNull();
  },
};

export const PageTitle: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("heading", { level: 1, name: "Transactions" })).toBeVisible();
  },
};

// Digits only line up in a column when the whole column, header included, sits against the same edge.
export const AmountColumnAligned: Story = {
  play: async ({ canvas }) => {
    const table = within(canvas.getByRole("table"));
    await expect(table.getByRole("columnheader", { name: /Amount/ })).toHaveStyle({ textAlign: "right" });
    for (const amount of [/6\.200,00/, /2\.400,00/]) {
      await expect(table.getByText(amount).closest("td")).toHaveStyle({ textAlign: "right" });
    }
  },
};

// The sort arrow sits left of a right-aligned label, so the label's edge meets the figures' edge.
export const AmountHeaderLabelAligned: Story = {
  play: async ({ canvas }) => {
    const table = within(canvas.getByRole("table"));
    const header = table.getByRole("columnheader", { name: /Amount/ });
    const labelNode = [...header.querySelectorAll("*")]
      .flatMap((element) => [...element.childNodes])
      .find((node) => node.nodeType === Node.TEXT_NODE && node.textContent?.includes("Amount"));
    if (!labelNode) throw new Error("header has no Amount label");
    const range = document.createRange();
    range.selectNodeContents(labelNode);
    const label = range.getBoundingClientRect();
    const icon = header.querySelector("svg")?.getBoundingClientRect();
    if (!icon) throw new Error("header has no sort arrow");
    await expect(icon.right).toBeLessThanOrEqual(label.left);
    const amount = table.getByText(/6\.200,00/).getBoundingClientRect();
    await expect(Math.abs(amount.right - label.right)).toBeLessThanOrEqual(8);
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

// Keyboard focus is a solid ring in the ring token, on a field and on a button alike.
export const FocusRing: Story = {
  play: async ({ canvas, userEvent }) => {
    const search = canvas.getByRole("textbox", { name: "Search transactions" });
    const importButton = canvas.getByRole("button", { name: "Import CSV" });
    for (const target of [search, importButton]) {
      for (let presses = 0; presses < 20 && document.activeElement !== target; presses += 1) {
        await userEvent.tab();
      }
      await expect(target).toHaveFocus();
      // The field draws its ring on the group around it, a button on itself.
      const ringed = target.closest("[data-slot=input-group]") ?? target;
      // Buttons ease their shadow in, so the ring is read once the transition has settled.
      await waitFor(() => expect(getComputedStyle(ringed).boxShadow).toContain("rgb(161, 74, 7)"));
    }
  },
};

function visible(elements: Iterable<Element>) {
  return [...elements].filter((element) => element.checkVisibility());
}

// A phone finger needs 44 px: every button, the search field and each filter chip grow to it.
export const TouchTargets: Story = {
  args: {
    chips: [
      { key: "type", label: "Debit", onRemove: fn() },
      { key: "category", label: "Food › Restaurants", onRemove: fn() },
    ],
    onReview: fn(),
  },
  play: async ({ canvas, canvasElement }) => {
    await page.viewport(414, 896);
    const buttons = visible(canvasElement.querySelectorAll("[data-slot=button]"));
    const iconButtons = canvas.getAllByRole("button", { name: /^Remove (Debit|Food)|^Previous period|^Next period/ });
    const search = canvas.getByRole("textbox", { name: "Search transactions" });
    const chips = visible(canvasElement.querySelectorAll("[data-variant=meta]")).filter((badge) =>
      badge.querySelector("[data-slot=button]"),
    );
    await expect(buttons.length).toBeGreaterThan(5);
    await expect(iconButtons.length).toBeGreaterThan(2);
    await expect(chips).toHaveLength(2);
    // Controls ease their size in (transition-all), so the sizes are read once they settle.
    await waitFor(() => {
      for (const button of buttons) expect(button.getBoundingClientRect().height).toBe(44);
      for (const button of iconButtons) {
        const { width, height } = button.getBoundingClientRect();
        expect([width, height]).toEqual([44, 44]);
      }
      expect(search.getBoundingClientRect().height).toBe(44);
      for (const chip of chips) expect(chip.getBoundingClientRect().height).toBe(44);
    });
  },
};

// An icon-only button is as wide as it is tall: the import and review buttons hide their label on a phone.
export const IconButtonTargets: Story = {
  args: { onReview: fn() },
  play: async ({ canvas }) => {
    await page.viewport(414, 896);
    const names = ["Import CSV", "Review movements", "First page", "Previous page", "Next page", "Last page"];
    const buttons = names.flatMap((name) => visible(canvas.getAllByRole("button", { name })));
    await expect(buttons).toHaveLength(names.length);
    await waitFor(() => {
      for (const button of buttons) {
        const { width, height } = button.getBoundingClientRect();
        expect([width, height]).toEqual([44, 44]);
      }
    });
  },
};

// From 640 px up the sizes are the desktop ones: 36 px default, 28 px small, 32 px icon.
export const DesktopSizes: Story = {
  play: async ({ canvas }) => {
    await page.viewport(1280, 800);
    const defaults = ["Import CSV", "Filters"].map((name) => canvas.getByRole("button", { name }));
    // The period's "Range" menu is the page's small button; its arrows are the icon buttons.
    const small = canvas.getByRole("button", { name: "Range" });
    const icons = ["Previous period", "Next period"].map((name) => canvas.getByRole("button", { name }));
    await waitFor(() => {
      for (const button of defaults) expect(button.getBoundingClientRect().height).toBe(36);
      expect(small.getBoundingClientRect().height).toBe(28);
      for (const button of icons) {
        const { width, height } = button.getBoundingClientRect();
        expect([width, height]).toEqual([32, 32]);
      }
    });
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

export const WithReview: Story = {
  args: { onReview: fn() },
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Review movements" }));
    await expect(args.onReview).toHaveBeenCalledTimes(1);
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
