import type { Plan } from "@/api/dtos";
import { Text } from "@/components/typography/base/Text";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { page } from "@vitest/browser/context";
import { expect, fn, waitFor, within } from "storybook/test";
import { PlansPageView } from "./PlansPageView";

const plans: Plan[] = [
  { id: 1, name: "Personal", isDefault: true, myRole: "OWNER", permissions: { createTransactions: true, attributeToOthers: true, manageCategories: true, managePlan: true } },
  { id: 2, name: "Household", isDefault: false, myRole: "EDITOR", permissions: { createTransactions: true, attributeToOthers: true, manageCategories: false, managePlan: false } },
];

// What the page paints for a theme token, as the computed colour a button's fill is compared to.
function tokenColor(token: string) {
  const probe = document.createElement("div");
  probe.style.backgroundColor = `var(${token})`;
  document.body.append(probe);
  const { backgroundColor } = getComputedStyle(probe);
  probe.remove();
  return backgroundColor;
}

const meta = {
  title: "Plans/PlansPageView",
  component: PlansPageView,
  args: {
    plans,
    activePlan: plans[0],
    activePlanId: 1,
    isLoading: false,
    canManagePlan: true,
    isArchiving: false,
    isLeaving: false,
    onCreatePlan: fn(),
    onSelectPlan: fn(),
    onRename: fn(),
    onTransferOwnership: fn(),
    onArchive: fn(),
    onInvite: fn(),
    onLeave: fn(),
    membersList: <Text as="p">Members list</Text>,
    invitationsList: <Text as="p">Invitations list</Text>,
    trash: <Text as="p">Trash list</Text>,
    archivedPlans: <Text as="p">Archived plans list</Text>,
  },
} satisfies Meta<typeof PlansPageView>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Owner: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await expect(canvas.getByText("Invitations for Personal")).toBeVisible();
    await expect(canvas.queryByRole("button", { name: "Back" })).toBeNull();
    await userEvent.click(canvas.getByRole("button", { name: "Rename plan" }));
    await expect(args.onRename).toHaveBeenCalledTimes(1);
    await userEvent.click(canvas.getByRole("button", { name: /Household/ }));
    await expect(args.onSelectPlan).toHaveBeenCalledWith(2);
  },
};

// The role and the default marker are quiet facts about a plan, not states.
export const MetaBadges: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Owner").closest("[data-variant]")).toHaveAttribute("data-variant", "meta");
    await expect(canvas.getByText("Default").closest("[data-variant]")).toHaveAttribute("data-variant", "meta");
  },
};

export const PageTitle: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("heading", { level: 1, name: "Plans" })).toBeVisible();
  },
};

// The page creates sit in the header as outline buttons (a border, no fill of their own): no filled
// primary button is left on the page.
export const HeaderActions: Story = {
  play: async ({ canvas, canvasElement }) => {
    const header = canvas.getByRole("heading", { level: 1, name: "Plans" }).closest("header");
    if (!header) throw new Error("the page title is not inside a header");
    const create = within(header).getByRole("button", { name: "New plan" });
    await expect(create).toBeVisible();
    await expect([tokenColor("--background"), "rgba(0, 0, 0, 0)"]).toContain(
      getComputedStyle(create).backgroundColor,
    );
    await expect(parseFloat(getComputedStyle(create).borderTopWidth)).toBeGreaterThan(0);
    const filled = [...canvasElement.querySelectorAll("[data-slot=button]")].filter(
      (button) => getComputedStyle(button).backgroundColor === tokenColor("--primary"),
    );
    await expect(filled).toHaveLength(0);
  },
};

export const Member: Story = {
  args: { activePlan: plans[1], activePlanId: 2, canManagePlan: false },
  play: async ({ args, canvas, userEvent }) => {
    await expect(canvas.queryByText("Invitations for Household")).toBeNull();
    await userEvent.click(canvas.getByRole("button", { name: "Leave plan" }));
    await expect(args.onLeave).toHaveBeenCalledTimes(1);
  },
};

export const Archiving: Story = {
  tags: ["!test"],
  args: { isArchiving: true },
};

export const Loading: Story = {
  args: { plans: [], activePlan: undefined, activePlanId: null, isLoading: true },
};

export const ManyLongPlans: Story = {
  tags: ["!test"],
  args: {
    plans: Array.from({ length: 9 }, (_, index) => ({
      id: index + 1,
      name: `Household finances shared with the whole family ${index + 1}`,
      isDefault: index === 0,
      myRole: index % 2 === 0 ? ("OWNER" as const) : ("VIEWER" as const),
      permissions: index % 2 === 0 ? { createTransactions: true, attributeToOthers: true, manageCategories: true, managePlan: true } : { createTransactions: false, attributeToOthers: false, manageCategories: false, managePlan: false },
    })),
    activePlan: {
      id: 1,
      name: "Household finances shared with the whole family 1",
      isDefault: true,
      myRole: "OWNER",
      permissions: { createTransactions: true, attributeToOthers: true, manageCategories: true, managePlan: true },
    },
  },
};

// On a phone the title takes its own line and the actions wrap below it, clear of the card's edge.
export const MembersHeaderPhone: Story = {
  play: async ({ canvas }) => {
    await page.viewport(414, 896);
    const title = canvas.getByText("Members of Personal");
    const card = title.closest("[data-slot=card]");
    if (!card) throw new Error("The members title is outside a card");
    const actions = ["Rename plan", "Transfer ownership", "Archive plan", "Invite"].map((name) =>
      canvas.getByRole("button", { name }),
    );
    await waitFor(() => {
      const lineHeight = parseFloat(getComputedStyle(title).lineHeight);
      expect(title.getBoundingClientRect().height).toBeLessThan(lineHeight * 1.5);
      const edge = card.getBoundingClientRect().right;
      for (const action of actions) {
        const box = action.getBoundingClientRect();
        expect(box.height).toBe(44);
        expect(box.top).toBeGreaterThanOrEqual(title.getBoundingClientRect().bottom);
        expect(edge - box.right).toBeGreaterThanOrEqual(12);
      }
    });
  },
};

export const Mobile: Story = {
  tags: ["!test"],
  globals: { viewport: { value: "mobile1" } },
};
