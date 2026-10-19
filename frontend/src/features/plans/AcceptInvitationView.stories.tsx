import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";
import { AcceptInvitationView } from "./AcceptInvitationView";

const meta = {
  title: "Plans/AcceptInvitationView",
  component: AcceptInvitationView,
  args: {
    preview: { planName: "Household", role: "EDITOR", invitedByName: "Lucas Martins" },
    isLoading: false,
    isError: false,
    isAccepting: false,
    onAccept: fn(),
    onGoHome: fn(),
  },
} satisfies Meta<typeof AcceptInvitationView>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Invited: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await expect(canvas.getByText("You've been invited")).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Accept invitation" }));
    await expect(args.onAccept).toHaveBeenCalledTimes(1);
  },
};

export const Accepting: Story = {
  args: { isAccepting: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("button", { name: "Decline" })).toBeDisabled();
  },
};

export const Loading: Story = {
  args: { preview: undefined, isLoading: true },
};

export const Invalid: Story = {
  args: { preview: undefined, isError: true },
  play: async ({ args, canvas, userEvent }) => {
    await expect(canvas.getByText("Invalid invitation")).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Back to home" }));
    await expect(args.onGoHome).toHaveBeenCalledTimes(1);
  },
};

export const LongNames: Story = {
  args: {
    preview: {
      planName: "Household finances shared with the whole family and two flatmates",
      role: "CONTRIBUTOR",
      invitedByName: "Maria Fernanda da Silva Albuquerque Mendes",
    },
  },
};

export const Mobile: Story = {
  globals: { viewport: { value: "mobile1" } },
};
