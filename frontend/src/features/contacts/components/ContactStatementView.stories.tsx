import type { Contact, ContactStatement, ContactStatementMonth } from "@/api/dtos/contact";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { page } from "@vitest/browser/context";
import { MemoryRouter } from "react-router-dom";
import { expect, fn, screen, waitFor, within } from "storybook/test";
import { ContactStatementView } from "./ContactStatementView";

const mae: Contact = { id: 7, name: "Mãe", archived: false, owed: 50, credit: 0, version: 1 };

function share(participantId: number, date: string, description: string, amount: number, allocated: number, status: "PAID" | "PARTIAL" | "OPEN" | "PLANNED") {
  return { participantId, transactionId: participantId, date, description, share: amount, allocated, status };
}

// Shares of 200, 300 and 50 happened and 120 is planned; payments of 200 and 300 leave R$ 50 owed, and
// the part of the second payment that settles no purchase is the R$ 200 shown as unallocated.
const months: ContactStatementMonth[] = [
  {
    month: "2026-11",
    shares: [
      share(2, "2026-11-10", "Dinner", 300, 100, "PARTIAL"),
      share(3, "2026-11-18", "Gas", 50, 0, "OPEN"),
      share(4, "2026-11-28", "Pharmacy", 120, 0, "PLANNED"),
    ],
    repayments: [{ transactionId: 21, date: "2026-11-12", amount: 300, unallocated: 200 }],
  },
  {
    month: "2026-10",
    shares: [share(1, "2026-10-05", "Market", 200, 200, "PAID")],
    repayments: [{ transactionId: 20, date: "2026-10-20", amount: 200, unallocated: 0 }],
  },
];

const owes: ContactStatement = { contact: mae, owed: 50, credit: 0, months };

// The elements whose right edge sits past the page's width: something clipped or overflowing.
function pastTheViewport() {
  const limit = document.documentElement.clientWidth;
  return [...document.body.querySelectorAll<HTMLElement>("*")]
    .filter((element) => element.getBoundingClientRect().right > limit + 0.5)
    .map((element) => `${element.tagName.toLowerCase()} ${element.textContent?.slice(0, 30) ?? ""}`);
}

const meta = {
  title: "Contacts/ContactStatementView",
  component: ContactStatementView,
  args: {
    statement: owes,
    isLoading: false,
    isError: false,
    canManage: true,
    isBusy: false,
    notice: null,
    onRetry: fn(),
    onRecordPayment: fn(),
    onRename: fn(),
    onArchive: fn(),
    onUnarchive: fn(),
    onDelete: fn(),
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof ContactStatementView>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Owes: Story = {
  play: async ({ canvas }) => {
    // The balance comes before any month, and the months run newest first.
    const balance = canvas.getByText("Owes R$ 50,00");
    const headings = canvas.getAllByRole("heading", { level: 2 });
    await expect(headings.map((heading) => heading.textContent)).toEqual(["November 2026", "October 2026"]);
    await expect(balance.compareDocumentPosition(headings[0]) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    await expect(canvas.getByText("Paid")).toBeVisible();
    await expect(canvas.getByText("Partial (R$ 100,00 of R$ 300,00)")).toBeVisible();
    await expect(canvas.getByText("Open")).toBeVisible();
    await expect(canvas.getByText("Planned")).toBeVisible();
    // A payment shows its date, its amount and the part that settles no purchase.
    const payment = canvas.getAllByText("Payment")[0].closest("li")!;
    await expect(within(payment).getByText("R$ 300,00")).toBeVisible();
    await expect(within(payment).getByText("R$ 200,00 unallocated")).toBeVisible();
  },
};

export const Credit: Story = {
  args: { statement: { ...owes, contact: { ...mae, owed: 0, credit: 50 }, owed: 0, credit: 50 } },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Credit of R$ 50,00")).toBeVisible();
  },
};

export const Settled: Story = {
  args: {
    statement: {
      ...owes,
      contact: { ...mae, owed: 0 },
      owed: 0,
      credit: 0,
      months: [months[1]],
    },
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Settled")).toBeVisible();
    await expect(canvas.queryByText(/Owes|Credit of/)).toBeNull();
  },
};

export const Empty: Story = {
  args: { statement: { ...owes, contact: { ...mae, owed: 0 }, owed: 0, months: [] } },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Nothing with this contact yet")).toBeVisible();
  },
};

export const Loading: Story = {
  args: { statement: undefined, isLoading: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("status", { name: "Loading statement" })).toBeVisible();
    await expect(canvas.queryByText("Nothing with this contact yet")).toBeNull();
  },
};

export const Error: Story = {
  args: { statement: undefined, isError: true },
  play: async ({ args, canvas, userEvent }) => {
    await expect(canvas.getByText("Could not load this statement.")).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Try again" }));
    await expect(args.onRetry).toHaveBeenCalled();
  },
};

export const AsOwner: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Record payment" }));
    await expect(args.onRecordPayment).toHaveBeenCalled();
    await userEvent.click(canvas.getByRole("button", { name: "More actions" }));
    await expect(await screen.findByRole("menuitem", { name: "Rename" })).toBeVisible();
    await expect(screen.getByRole("menuitem", { name: "Archive" })).toBeVisible();
    await expect(screen.getByRole("menuitem", { name: "Delete" })).toBeVisible();
    await userEvent.click(screen.getByRole("menuitem", { name: "Archive" }));
    await expect(args.onArchive).toHaveBeenCalled();
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
  },
};

export const ReadOnly: Story = {
  args: { canManage: false },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Owes R$ 50,00")).toBeVisible();
    await expect(canvas.queryByRole("button", { name: "Record payment" })).toBeNull();
    await expect(canvas.queryByRole("button", { name: "More actions" })).toBeNull();
  },
};

export const Archived: Story = {
  args: { statement: { ...owes, contact: { ...mae, owed: 0, archived: true }, owed: 0, months: [months[1]] } },
  play: async ({ canvas, userEvent }) => {
    // An archived contact takes no new payment, and can be brought back.
    await expect(canvas.queryByRole("button", { name: "Record payment" })).toBeNull();
    await userEvent.click(canvas.getByRole("button", { name: "More actions" }));
    await expect(await screen.findByRole("menuitem", { name: "Unarchive" })).toBeVisible();
  },
};

const longYear: ContactStatementMonth[] = Array.from({ length: 12 }, (_, index) => {
  const month = String(12 - index).padStart(2, "0");
  return {
    month: `2025-${month}`,
    shares: [
      share(100 + index, `2025-${month}-10`, "Family lunch at the restaurant near the grandparents' house", 1234567.89, 0, "OPEN"),
    ],
    repayments: [{ transactionId: 200 + index, date: `2025-${month}-15`, amount: 100, unallocated: 100 }],
  };
});

const twelveMonths: ContactStatement = {
  contact: { ...mae, name: "Maria Fernanda da Silva Albuquerque Mendes de Souza Lima" },
  owed: 14000000,
  credit: 0,
  months: longYear,
};

// A long year scrolls with the page, and nothing is wider than the screen it is read on.
export const FitsPhone: Story = {
  args: { statement: twelveMonths },
  play: async () => {
    await page.viewport(390, 844);
    await waitFor(() => expect(pastTheViewport()).toEqual([]));
  },
};

export const FitsDesktop: Story = {
  args: { statement: twelveMonths },
  play: async () => {
    await page.viewport(1280, 800);
    await waitFor(() => expect(pastTheViewport()).toEqual([]));
  },
};
