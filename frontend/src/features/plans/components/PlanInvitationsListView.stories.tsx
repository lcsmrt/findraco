import type { Invitation } from "@/api/dtos";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";
import { PlanInvitationsListView } from "./PlanInvitationsListView";

const invitations: Invitation[] = [
  { id: 1, token: "a", role: "EDITOR", type: "EMAIL", email: "ana@example.com", status: "PENDING" },
  { id: 2, token: "b", role: "VIEWER", type: "LINK", status: "PENDING", expiresAt: "2026-11-01T18:30:00" },
  { id: 3, token: "c", role: "CONTRIBUTOR", type: "EMAIL", email: "joao@example.com", status: "ACCEPTED" },
  { id: 4, token: "d", role: "VIEWER", type: "LINK", status: "EXPIRED" },
  { id: 5, token: "e", role: "EDITOR", type: "EMAIL", status: "REVOKED" },
];

const meta = {
  title: "Plans/PlanInvitationsListView",
  component: PlanInvitationsListView,
  args: { invitations, isLoading: false, onRevoke: fn() },
} satisfies Meta<typeof PlanInvitationsListView>;
export default meta;

type Story = StoryObj<typeof meta>;

export const EveryStatus: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Revoke the invitation for ana@example.com" }));
    await expect(args.onRevoke).toHaveBeenCalledWith(invitations[0]);
    // Only pending invitations can be revoked.
    await expect(canvas.getAllByRole("button", { name: /Revoke/ })).toHaveLength(2);
  },
};

// Each status is a badge of its own family: pending and expired neutral (only pending has a clock),
// accepted success with a check, revoked destructive with an x.
export const StatusBadges: Story = {
  play: async ({ canvas }) => {
    const statuses = [
      { label: "Pending", tone: "neutral", icon: true },
      { label: "Accepted", tone: "success", icon: true },
      { label: "Expired", tone: "neutral", icon: false },
      { label: "Revoked", tone: "destructive", icon: true },
    ];
    for (const { label, tone, icon } of statuses) {
      const badge = canvas.getAllByText(label)[0].closest<HTMLElement>("[data-variant]");
      await expect(badge).toHaveAttribute("data-variant", "status");
      await expect(badge).toHaveAttribute("data-tone", tone);
      await expect(badge?.querySelector("svg") !== null).toBe(icon);
    }
  },
};

// The colour of a theme token as an element painting it computes it.
function tokenColor(token: string) {
  const probe = document.createElement("span");
  probe.style.color = `var(${token})`;
  document.body.append(probe);
  const { color } = getComputedStyle(probe);
  probe.remove();
  return color;
}

// Each status carries its own icon and colour, read from the rendered svg and the badge's text colour.
export const StatusColoursAndIcons: Story = {
  play: async ({ canvas }) => {
    const statuses = [
      { label: "Pending", icon: "lucide-clock", token: "--secondary-foreground" },
      { label: "Accepted", icon: "lucide-check", token: "--success" },
      { label: "Revoked", icon: "lucide-x", token: "--destructive" },
    ];
    for (const { label, icon, token } of statuses) {
      const badge = canvas.getAllByText(label)[0].closest<HTMLElement>("[data-variant]");
      await expect(badge?.querySelector("svg")).toHaveClass(icon);
      await expect(badge && getComputedStyle(badge).color).toBe(tokenColor(token));
    }
  },
};

export const Loading: Story = { args: { invitations: [], isLoading: true } };

export const Empty: Story = {
  args: { invitations: [] },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("No invitations created for this plan yet.")).toBeVisible();
  },
};

export const ManyLongEmails: Story = {
  tags: ["!test"],
  args: {
    invitations: Array.from({ length: 12 }, (_, index) => ({
      id: 100 + index,
      token: `t${index}`,
      role: "CONTRIBUTOR" as const,
      type: "EMAIL" as const,
      email: `maria.fernanda.da.silva.albuquerque.mendes.${index + 1}@a-very-long-company-domain.example.com`,
      status: "PENDING" as const,
      expiresAt: "2026-12-31T23:59:00",
    })),
  },
};

export const Mobile: Story = {
  tags: ["!test"],
  globals: { viewport: { value: "mobile1" } },
};
