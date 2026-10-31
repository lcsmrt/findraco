import type { Plan } from "@/api/dtos";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, screen, waitFor } from "storybook/test";
import { PlanSwitcherView } from "./PlanSwitcherView";

const plans: Plan[] = [
  { id: 1, name: "Personal", isDefault: true, myRole: "OWNER", permissions: { createTransactions: true, attributeToOthers: true, manageCategories: true, managePlan: true } },
  { id: 2, name: "Household", isDefault: false, myRole: "EDITOR", permissions: { createTransactions: true, attributeToOthers: true, manageCategories: false, managePlan: false } },
];

const meta = {
  title: "Plans/PlanSwitcherView",
  component: PlanSwitcherView,
  args: {
    plans,
    activePlanId: 1,
    activePlanName: "Personal",
    onSelectPlan: fn(),
    onCreatePlan: fn(),
  },
} satisfies Meta<typeof PlanSwitcherView>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Selected: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: /Personal/ }));
    await userEvent.click(await screen.findByRole("menuitemradio", { name: "Household" }));
    await expect(args.onSelectPlan).toHaveBeenCalledWith(2);
    // Plans is a destination of the navigation now; the menu only creates a plan.
    await expect(screen.getByRole("menuitem", { name: "New plan" })).toBeVisible();
    await expect(screen.queryByRole("menuitem", { name: "Manage plans" })).toBeNull();
    // A radio item keeps the menu open; Escape closes it so the a11y check runs once it has left.
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
  },
};

export const NoPlanSelected: Story = {
  args: { activePlanId: null, activePlanName: undefined },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("button", { name: /Select plan/ })).toBeVisible();
  },
};

export const LongPlanName: Story = {
  tags: ["!test"],
  args: {
    plans: [
      ...plans,
      { id: 3, name: "Household finances shared with the whole family", isDefault: false, myRole: "VIEWER", permissions: { createTransactions: false, attributeToOthers: false, manageCategories: false, managePlan: false } },
    ],
    activePlanId: 3,
    activePlanName: "Household finances shared with the whole family",
  },
};
