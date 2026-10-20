import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, screen } from "storybook/test";
import { InvitePlanDialogView } from "./InvitePlanDialogView";

const meta = {
  title: "Plans/InvitePlanDialogView",
  component: InvitePlanDialogView,
  args: {
    open: true,
    onOpenChange: fn(),
    createdInvitation: null,
    invitationLink: null,
    isCreating: false,
    onCreate: fn(),
    onCopyLink: fn(),
  },
} satisfies Meta<typeof InvitePlanDialogView>;
export default meta;

type Story = StoryObj<typeof meta>;

// The dialog renders in a portal, outside the story canvas, so queries go through `screen`.
export const EmailForm: Story = {
  play: async ({ args, userEvent }) => {
    await userEvent.type(screen.getByRole("textbox", { name: "Email" }), "ana@example.com");
    await userEvent.click(screen.getByRole("button", { name: "Send invitation" }));
    await expect(args.onCreate).toHaveBeenCalledTimes(1);
  },
};

export const MissingEmail: Story = {
  play: async ({ args, userEvent }) => {
    await userEvent.click(screen.getByRole("button", { name: "Send invitation" }));
    await expect(await screen.findByText("Enter an email address")).toBeVisible();
    await expect(args.onCreate).not.toHaveBeenCalled();
  },
};

export const Creating: Story = {
  tags: ["!test"],
  args: { isCreating: true },
};

export const LinkCreated: Story = {
  args: {
    createdInvitation: { id: 1, token: "abc123", role: "VIEWER", type: "LINK", status: "PENDING" },
    invitationLink: "https://findraco.app/invitation/abc123",
  },
  play: async ({ args, userEvent }) => {
    await userEvent.click(screen.getByRole("button", { name: "Copy link" }));
    await expect(args.onCopyLink).toHaveBeenCalledTimes(1);
  },
};

export const EmailSent: Story = {
  args: {
    createdInvitation: {
      id: 2,
      token: "def456",
      role: "EDITOR",
      type: "EMAIL",
      email: "maria.fernanda.da.silva.albuquerque@a-very-long-company-domain.example.com",
      status: "PENDING",
    },
  },
};

export const Mobile: Story = {
  tags: ["!test"],
  globals: { viewport: { value: "mobile1" } },
};
