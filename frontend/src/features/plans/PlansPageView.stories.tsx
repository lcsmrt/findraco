import type { Plan } from "@/api/dtos";
import { Text } from "@/components/typography/base/Text";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";
import { PlansPageView } from "./PlansPageView";

const plans: Plan[] = [
  { id: 1, name: "Personal", isDefault: true, myRole: "OWNER" },
  { id: 2, name: "Household", isDefault: false, myRole: "EDITOR" },
];

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

export const Member: Story = {
  args: { activePlan: plans[1], activePlanId: 2, canManagePlan: false },
  play: async ({ args, canvas, userEvent }) => {
    await expect(canvas.queryByText("Invitations for Household")).toBeNull();
    await userEvent.click(canvas.getByRole("button", { name: "Leave plan" }));
    await expect(args.onLeave).toHaveBeenCalledTimes(1);
  },
};

export const Archiving: Story = {
  args: { isArchiving: true },
};

export const Loading: Story = {
  args: { plans: [], activePlan: undefined, activePlanId: null, isLoading: true },
};

export const ManyLongPlans: Story = {
  args: {
    plans: Array.from({ length: 9 }, (_, index) => ({
      id: index + 1,
      name: `Household finances shared with the whole family ${index + 1}`,
      isDefault: index === 0,
      myRole: index % 2 === 0 ? ("OWNER" as const) : ("VIEWER" as const),
    })),
    activePlan: {
      id: 1,
      name: "Household finances shared with the whole family 1",
      isDefault: true,
      myRole: "OWNER",
    },
  },
};

export const Mobile: Story = {
  globals: { viewport: { value: "mobile1" } },
};
