import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, screen } from "storybook/test";
import { ConfirmTransactionDialogView } from "./ConfirmTransactionDialogView";

const meta = {
  title: "Transactions/ConfirmTransactionDialogView",
  component: ConfirmTransactionDialogView,
  args: {
    open: true,
    onOpenChange: fn(),
    initialValues: { amount: 200, date: new Date(2026, 9, 10) },
    description: "Enter what was really charged for Electricity and when it was paid.",
    isSaving: false,
    onConfirm: fn(),
  },
} satisfies Meta<typeof ConfirmTransactionDialogView>;
export default meta;

type Story = StoryObj<typeof meta>;

// The dialog renders in a portal, outside the story canvas, so queries go through `screen`.
export const Filled: Story = {
  play: async ({ args, userEvent }) => {
    // The currency mask separates the symbol with a no-break space.
    await expect((screen.getByRole("textbox", { name: "Amount" }) as HTMLInputElement).value).toMatch(/^R\$\s200,00$/);
    await userEvent.click(screen.getByRole("button", { name: "Confirm" }));
    await expect(args.onConfirm).toHaveBeenCalledTimes(1);
  },
};

export const EmptyAmount: Story = {
  args: { initialValues: { amount: null, date: new Date(2026, 9, 10) } },
  play: async ({ args, userEvent }) => {
    await userEvent.click(screen.getByRole("button", { name: "Confirm" }));
    await expect(await screen.findByText("Amount must be positive")).toBeVisible();
    await expect(args.onConfirm).not.toHaveBeenCalled();
  },
};

export const Saving: Story = {
  tags: ["!test"],
  args: { isSaving: true },
};
