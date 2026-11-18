import type { TransactionTrashEntry } from "@/api/dtos";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";
import { PlanTrashListView } from "./PlanTrashListView";

// Midday UTC keeps the calendar day the same in every time zone the suite may run in.
const entries: TransactionTrashEntry[] = [
  {
    id: 9,
    kind: "SERIES",
    scope: "ALL",
    description: "Gym",
    count: 6,
    amount: 1800,
    type: "DEBIT",
    deletedAt: "2026-11-10T12:00:00Z",
    deletedBy: { id: 1, name: "Ana" },
    expiresAt: "2026-12-10T12:00:00Z",
  },
  {
    id: 8,
    kind: "TRANSACTION",
    scope: null,
    description: "Rent",
    count: 1,
    amount: 150.5,
    type: "CREDIT",
    deletedAt: "2026-11-05T12:00:00Z",
    deletedBy: null,
    expiresAt: "2026-12-05T12:00:00Z",
  },
];

const meta = {
  title: "Plans/PlanTrashListView",
  component: PlanTrashListView,
  args: { entries, isError: false, restoringId: null, onRestore: fn(), onRetry: fn() },
} satisfies Meta<typeof PlanTrashListView>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Entries: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await expect(canvas.getByText("Gym")).toBeVisible();
    await expect(canvas.getByText(/^6 transactions/)).toBeVisible();
    await expect(canvas.getByText(/1\.800,00/)).toBeVisible();
    await expect(canvas.getByText("Deleted by Ana on 10/11/2026")).toBeVisible();
    await expect(canvas.getByText("Removed for good on 10/12/2026")).toBeVisible();
    await expect(canvas.getByText("Deleted on 05/11/2026")).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Restore Rent" }));
    await expect(args.onRestore).toHaveBeenCalledWith(entries[1]);
  },
};

export const Empty: Story = {
  args: { entries: [] },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByText("Nothing in the trash. What you delete stays here for 30 days."),
    ).toBeVisible();
  },
};

export const LoadError: Story = {
  args: { entries: [], isError: true },
  play: async ({ args, canvas, userEvent }) => {
    await expect(canvas.getByRole("alert")).toHaveTextContent("Could not load the trash.");
    await expect(canvas.queryByText(/Nothing in the trash/)).toBeNull();
    await userEvent.click(canvas.getByRole("button", { name: "Retry" }));
    await expect(args.onRetry).toHaveBeenCalled();
  },
};

export const Restoring: Story = {
  args: { restoringId: 9 },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("button", { name: "Restore Gym" })).toBeDisabled();
    await expect(canvas.getByRole("button", { name: "Restore Rent" })).toBeDisabled();
  },
};
