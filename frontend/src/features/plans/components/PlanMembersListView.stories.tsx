import type { PlanMember } from "@/api/dtos";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";
import { PlanMembersListView } from "./PlanMembersListView";

const members: PlanMember[] = [
  { userId: 1, name: "Lucas Martins", email: "lucas@example.com", role: "OWNER" },
  { userId: 2, name: "Livia Souza", email: "livia@example.com", role: "EDITOR" },
  { userId: 3, name: "Ana Lima", email: "ana@example.com", role: "VIEWER" },
];

const meta = {
  title: "Plans/PlanMembersListView",
  component: PlanMembersListView,
  args: {
    members,
    isLoading: false,
    // The viewer is the owner, so everyone else is manageable.
    canManageMember: (member: PlanMember) => member.userId !== 1,
    onRoleChange: fn(),
    onRemove: fn(),
  },
} satisfies Meta<typeof PlanMembersListView>;
export default meta;

type Story = StoryObj<typeof meta>;

export const AsOwner: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await expect(canvas.getByLabelText("Role of Livia Souza")).toHaveTextContent("Editor");
    await userEvent.click(canvas.getByRole("button", { name: "Remove Ana Lima" }));
    await expect(args.onRemove).toHaveBeenCalledWith(members[2]);
  },
};

export const ReadOnly: Story = {
  args: { canManageMember: () => false },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole("button", { name: /Remove/ })).toBeNull();
  },
};

export const Loading: Story = { args: { members: [], isLoading: true } };

export const Empty: Story = {
  args: { members: [] },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("No members in this plan.")).toBeVisible();
  },
};

export const ManyLongNames: Story = {
  tags: ["!test"],
  args: {
    members: Array.from({ length: 10 }, (_, index) => ({
      userId: index + 10,
      name: `Maria Fernanda da Silva Albuquerque Mendes ${index + 1}`,
      email: `maria.fernanda.${index + 1}@a-very-long-company-domain.example.com`,
      role: "CONTRIBUTOR" as const,
    })),
  },
};

export const Mobile: Story = {
  tags: ["!test"],
  globals: { viewport: { value: "mobile1" } },
};
