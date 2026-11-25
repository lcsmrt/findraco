import type { Contact } from "@/api/dtos/contact";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";
import { ContactNoticeView } from "./ContactNoticeView";

const owing: Contact = { id: 7, name: "Mãe", archived: false, owed: 50, credit: 0, version: 0 };

const meta = {
  title: "Contact/ContactNoticeView",
  component: ContactNoticeView,
  args: { notice: { kind: "balance", contact: owing }, onArchive: fn(), onDismiss: fn() },
} satisfies Meta<typeof ContactNoticeView>;
export default meta;

type Story = StoryObj<typeof meta>;

export const BalanceOwed: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Settle the balance before archiving")).toBeVisible();
    await expect(canvas.getByText("Mãe: Owes R$ 50,00")).toBeVisible();
  },
};

export const BalanceCredit: Story = {
  args: { notice: { kind: "balance", contact: { ...owing, owed: 0, credit: 20 } } },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Mãe: Credit of R$ 20,00")).toBeVisible();
  },
};

export const InUse: Story = {
  args: { notice: { kind: "in-use", contact: { ...owing, owed: 0 } } },
  play: async ({ args, canvas, userEvent }) => {
    await expect(canvas.getByText(/cannot be deleted/)).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Archive" }));
    await expect(args.onArchive).toHaveBeenCalledWith({ ...owing, owed: 0 });
  },
};

export const Dismissed: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Dismiss" }));
    await expect(args.onDismiss).toHaveBeenCalled();
  },
};
