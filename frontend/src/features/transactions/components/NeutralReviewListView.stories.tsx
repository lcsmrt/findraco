import type { NeutralCandidate, Transaction } from "@/api/dtos";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";
import { NeutralReviewListView } from "./NeutralReviewListView";

function row(id: number, description: string, startDate: string, amount: number): Transaction {
  return {
    id,
    permissions: { edit: true, delete: true },
    version: id,
    type: "DEBIT",
    amount,
    description,
    startDate,
    endDate: startDate,
    splitMode: "EQUAL",
    participants: [],
    items: [],
    status: "ACTUAL",
    requiresConfirmation: false,
  };
}

const candidates: NeutralCandidate[] = [
  {
    transaction: row(1, "Pagamento de fatura", "2026-11-12", 1500),
    proposedKind: "CARD_BILL_PAYMENT",
  },
  {
    transaction: row(2, "Transferência enviada pelo Pix - MARINA SOUZA LIMA", "2026-11-09", 500),
    proposedKind: "TRANSFER",
  },
];

const meta = {
  title: "Transactions/NeutralReviewListView",
  component: NeutralReviewListView,
  args: {
    candidates,
    total: candidates.length,
    isLoading: false,
    isError: false,
    applyingId: null,
    onApply: fn(),
    onRetry: fn(),
  },
} satisfies Meta<typeof NeutralReviewListView>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Candidates: Story = {
  play: async ({ args, canvas, userEvent }) => {
    const bill = canvas.getAllByRole("listitem")[0];
    await expect(bill).toHaveTextContent("Pagamento de fatura");
    await expect(bill).toHaveTextContent("12/11/2026");
    await expect(bill).toHaveTextContent("1.500,00");
    await expect(bill).toHaveTextContent("Card bill");
    await expect(canvas.getAllByRole("listitem")[1]).toHaveTextContent("Between members");

    await userEvent.click(canvas.getByRole("button", { name: /^Apply.*MARINA/ }));

    await expect(args.onApply).toHaveBeenCalledWith(candidates[1]);
  },
};

export const MoneyAmounts: Story = {
  args: {
    candidates: [
      { transaction: row(1, "Pagamento de fatura", "2026-11-12", 1234.5), proposedKind: "CARD_BILL_PAYMENT" },
      {
        transaction: { ...row(2, "Estorno", "2026-11-09", 1234.5), type: "CREDIT" },
        proposedKind: "TRANSFER",
      },
    ],
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("\u2212R$ 1.234,50")).toHaveClass("text-destructive");
    await expect(canvas.getByText("R$ 1.234,50")).toHaveClass("text-success");
  },
};

export const Empty: Story = {
  args: { candidates: [], total: 0 },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Nothing to review.")).toBeVisible();
    await expect(canvas.queryByRole("button")).toBeNull();
  },
};

export const Loading: Story = {
  args: { candidates: [], total: 0, isLoading: true },
  play: async ({ canvas }) => {
    await expect(canvas.queryByText("Nothing to review.")).toBeNull();
  },
};

export const LoadError: Story = {
  args: { candidates: [], total: 0, isError: true },
  play: async ({ args, canvas, userEvent }) => {
    await expect(canvas.getByRole("alert")).toHaveTextContent("Could not load the movements to review.");
    await expect(canvas.queryByText("Nothing to review.")).toBeNull();
    await userEvent.click(canvas.getByRole("button", { name: "Retry" }));
    await expect(args.onRetry).toHaveBeenCalled();
  },
};

export const Applying: Story = {
  args: { applyingId: 1 },
  play: async ({ canvas }) => {
    for (const button of canvas.getAllByRole("button")) await expect(button).toBeDisabled();
  },
};

export const NewestOnly: Story = {
  args: { total: 120 },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Showing the 2 newest of 120.")).toBeVisible();
  },
};
