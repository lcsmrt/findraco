import type { Transaction } from "@/api/dtos/transaction";
import type { PlanMember } from "@/api/dtos/plan";
import { Button } from "@/components/button/base/Button";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { SlidersHorizontalIcon } from "lucide-react";
import { page } from "@vitest/browser/context";
import { expect, fn, screen, waitFor, within } from "storybook/test";
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
    reviewTotal: 0,
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
    await expect(canvas.getByRole("button", { name: "More actions" })).toBeVisible();
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
    const moreActions = canvas.getByRole("button", { name: "More actions" });
    for (const target of [search, moreActions]) {
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

// A phone finger needs 44 px: every button and the search field grow to it. The filter chips are the
// exception: they stay 32 px with a 44 px tap area (FilterChipSizePhone).
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
    const buttons = visible(canvasElement.querySelectorAll("[data-slot=button]")).filter(
      (button) => !button.closest("[data-slot=badge]"),
    );
    const iconButtons = canvas.getAllByRole("button", { name: /^More actions|^Previous period|^Next period/ });
    const search = canvas.getByRole("textbox", { name: "Search transactions" });
    await expect(buttons.length).toBeGreaterThan(5);
    await expect(iconButtons).toHaveLength(3);
    // Controls ease their size in (transition-all), so the sizes are read once they settle.
    await waitFor(() => {
      for (const button of buttons) expect(button.getBoundingClientRect().height).toBe(44);
      for (const button of iconButtons) {
        const { width, height } = button.getBoundingClientRect();
        expect([width, height]).toEqual([44, 44]);
      }
      expect(search.getBoundingClientRect().height).toBe(44);
    });
  },
};

// An icon-only button is as wide as it is tall: the actions menu hides its label behind the dots.
export const IconButtonTargets: Story = {
  args: { onReview: fn() },
  play: async ({ canvas }) => {
    await page.viewport(414, 896);
    // First and last page step aside on a phone (header-polish); previous and next remain.
    const names = ["More actions", "Previous page", "Next page"];
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

// From 640 px up the sizes are the desktop ones: 36 px default, 32 px icon.
export const DesktopSizes: Story = {
  play: async ({ canvas }) => {
    await page.viewport(1280, 800);
    const filters = canvas.getByRole("button", { name: "Filters" });
    const icons = ["More actions", "Previous period", "Next period"].map((name) =>
      canvas.getByRole("button", { name }),
    );
    await waitFor(() => {
      expect(filters.getBoundingClientRect().height).toBe(36);
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

// The menu renders in a portal, outside the story canvas, so its queries go through `screen`.
async function openMenu(canvas: ReturnType<typeof within>, userEvent: { click: (element: Element) => Promise<void> }) {
  await userEvent.click(canvas.getByRole("button", { name: "More actions" }));
  return screen.findByRole("menu");
}

// The title row holds the title and the one menu button; everything else the page does sits below it.
export const MoreActionsMenu: Story = {
  args: { onReview: fn() },
  play: async ({ args, canvas, userEvent }) => {
    const row = canvas.getByRole("heading", { level: 1, name: "Transactions" }).closest("[data-slot=page-header-row]");
    if (!(row instanceof HTMLElement)) throw new Error("the title is not in a header row");
    await expect(within(row).getAllByRole("button").map((button) => button.getAttribute("aria-label"))).toEqual([
      "More actions",
    ]);
    const menu = within(await openMenu(canvas, userEvent));
    await expect(menu.getByRole("menuitem", { name: "Import CSV" })).toBeVisible();
    await userEvent.click(menu.getByRole("menuitem", { name: "Review movements" }));
    await expect(args.onReview).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
  },
};

// On a phone a menu item is a 44 px target like every other control.
export const MenuItemsPhone: Story = {
  args: { onReview: fn() },
  play: async ({ canvas, userEvent }) => {
    await page.viewport(414, 896);
    const menu = within(await openMenu(canvas, userEvent));
    for (const name of ["Import CSV", "Review movements"]) {
      const item = menu.getByRole("menuitem", { name });
      await waitFor(() => expect(item.getBoundingClientRect().height).toBeGreaterThanOrEqual(44));
    }
  },
};

export const ImportingDisabled: Story = {
  args: { isImporting: true, onReview: fn() },
  play: async ({ canvas, userEvent }) => {
    const menu = within(await openMenu(canvas, userEvent));
    await expect(menu.getByRole("menuitem", { name: "Importing…" })).toHaveAttribute("aria-disabled", "true");
    await expect(menu.queryByRole("menuitem", { name: "Import CSV" })).toBeNull();
  },
};

// A viewer has no `onReview`, so the menu offers the import only, whatever the review total says.
export const ViewerHasNoReview: Story = {
  args: { reviewTotal: 4 },
  play: async ({ canvas, userEvent }) => {
    const menu = within(await openMenu(canvas, userEvent));
    await expect(menu.getByRole("menuitem", { name: "Import CSV" })).toBeVisible();
    await expect(menu.queryByRole("menuitem", { name: "Review movements" })).toBeNull();
    await userEvent.keyboard("{Escape}");
    await expect(canvas.queryByText(/to review/)).toBeNull();
    await expect(canvas.getByRole("button", { name: "More actions" }).querySelector("[data-slot=review-dot]")).toBeNull();
  },
};

export const ReviewNotice: Story = {
  args: { reviewTotal: 1, onReview: fn() },
  play: async ({ args, canvas, userEvent }) => {
    await expect(canvas.getByText("1 movement to review")).toBeVisible();
    await expect(canvas.getByRole("button", { name: "More actions" }).querySelector("[data-slot=review-dot]")).not.toBeNull();
    await userEvent.click(canvas.getByRole("button", { name: "Review" }));
    await expect(args.onReview).toHaveBeenCalledTimes(1);
  },
};

export const ReviewNoticeMany: Story = {
  args: { reviewTotal: 4, onReview: fn() },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("4 movements to review")).toBeVisible();
  },
};

export const NothingToReview: Story = {
  args: { reviewTotal: 0, onReview: fn() },
  play: async ({ canvas }) => {
    await expect(canvas.queryByText(/to review/)).toBeNull();
    await expect(canvas.queryByRole("button", { name: "Review" })).toBeNull();
    await expect(canvas.getByRole("button", { name: "More actions" }).querySelector("[data-slot=review-dot]")).toBeNull();
  },
};

// The period row, the search row and the list share the page's left and right edges at both widths.
// On a wide screen the period control is as wide as its content, so its row is what reaches the right edge.
export const EdgesAligned: Story = {
  args: { onReview: fn(), reviewTotal: 2 },
  play: async ({ canvas, canvasElement }) => {
    function edges(element: Element | null | undefined) {
      if (!element) throw new Error("an element of the page is missing");
      const { left, right } = element.getBoundingClientRect();
      return { left, right };
    }
    function listElement() {
      const table = canvasElement.querySelector("#financialTransactionsPagele");
      if (table?.checkVisibility()) return table;
      return visible(canvas.getAllByText(/^\w{3}, \d+ \w{3} 2026$/))[0]?.closest("section")?.parentElement;
    }
    for (const width of [414, 1280]) {
      await page.viewport(width, 900);
      await waitFor(() => {
        const control = canvas.getByRole("button", { name: "Previous period" }).parentElement;
        const search = canvas.getByRole("textbox", { name: "Search transactions" }).closest("[data-slot=input-group]")?.parentElement;
        const list = edges(listElement());
        expect(Math.abs(edges(control).left - list.left)).toBeLessThanOrEqual(1);
        expect(Math.abs(edges(control?.parentElement).right - list.right)).toBeLessThanOrEqual(1);
        expect(Math.abs(edges(search).left - list.left)).toBeLessThanOrEqual(1);
        expect(Math.abs(edges(search).right - list.right)).toBeLessThanOrEqual(1);
      });
    }
  },
};

// The action of every page header sits on the title's row, not under it.
export const ActionOnTitleRow: Story = {
  play: async ({ canvas }) => {
    await page.viewport(414, 896);
    const title = canvas.getByRole("heading", { level: 1, name: "Transactions" }).getBoundingClientRect();
    const action = canvas.getByRole("button", { name: "More actions" }).getBoundingClientRect();
    await expect(action.top).toBeGreaterThanOrEqual(title.top);
    await expect(action.top).toBeLessThanOrEqual(title.bottom);
  },
};

// A filter chip is 32 px tall on a phone; a tap 6 px above or below it still lands on it.
export const FilterChipSizePhone: Story = {
  args: { chips: [{ key: "type", label: "Debit", onRemove: fn() }] },
  play: async ({ canvas }) => {
    await page.viewport(414, 896);
    const chip = canvas.getByRole("button", { name: "Remove Debit" }).closest("[data-slot=badge]");
    if (!chip) throw new Error("the filter chip is missing");
    await waitFor(() => {
      const box = chip.getBoundingClientRect();
      const x = box.left + box.width / 2;
      expect(box.height).toBe(32);
      for (const y of [box.top - 6, box.bottom + 6]) {
        const hit = document.elementFromPoint(x, y);
        expect(hit && chip.contains(hit)).toBe(true);
      }
    });
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
