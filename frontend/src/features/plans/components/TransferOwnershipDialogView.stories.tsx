import type { PlanMember } from "@/api/dtos";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, screen } from "storybook/test";
import { TransferOwnershipDialogView } from "./TransferOwnershipDialogView";

const candidates: PlanMember[] = [
  { userId: 2, name: "Livia Souza", email: "livia@example.com", role: "EDITOR" },
  { userId: 3, name: "Ana Lima", email: "ana@example.com", role: "VIEWER" },
];

const meta = {
  title: "Plans/TransferOwnershipDialogView",
  component: TransferOwnershipDialogView,
  args: {
    open: true,
    onOpenChange: fn(),
    candidates,
    isLoading: false,
    isTransferring: false,
    onTransfer: fn(),
  },
} satisfies Meta<typeof TransferOwnershipDialogView>;
export default meta;

type Story = StoryObj<typeof meta>;

// The dialog renders in a portal, outside the story canvas, so queries go through `screen`.
export const WithCandidates: Story = {
  play: async ({ args, userEvent }) => {
    await expect(screen.getByRole("button", { name: "Transfer" })).toBeDisabled();
    await userEvent.click(screen.getByRole("combobox", { name: "New owner" }));
    await userEvent.click(await screen.findByRole("option", { name: "Ana Lima" }));
    await userEvent.click(screen.getByRole("button", { name: "Transfer" }));
    await expect(args.onTransfer).toHaveBeenCalledWith(3);
  },
};

export const Transferring: Story = {
  args: { isTransferring: true },
};

export const Loading: Story = {
  args: { candidates: [], isLoading: true },
};

export const NoCandidates: Story = {
  args: { candidates: [] },
  play: async () => {
    await expect(screen.getByText("There are no other members to transfer ownership to.")).toBeVisible();
  },
};

export const Mobile: Story = {
  globals: { viewport: { value: "mobile1" } },
};
