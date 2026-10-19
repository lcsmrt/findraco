import type { FinancialTransactionCategory } from "@/api/dtos";
import { MEMBER_PALETTE } from "@/utils/memberColors";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";
import { CategoryTreeRow } from "./CategoryTreeRow";

function colorOf(memberId: number) {
  return MEMBER_PALETTE[(memberId - 1) % MEMBER_PALETTE.length];
}

const food: FinancialTransactionCategory = {
  id: 1,
  type: "DEBIT",
  description: "Food",
  spendingLimit: 2000,
};

const hobbies: FinancialTransactionCategory = {
  id: 2,
  type: "DEBIT",
  description: "Hobbies",
  ownerId: 2,
  ownerName: "Livia Souza",
  ownerActive: true,
  memberLimits: [
    { memberId: 1, memberName: "Lucas", amount: 300, active: true },
    { memberId: 2, memberName: "Livia", amount: 450, active: true },
  ],
  effectiveLimit: 750,
};

const meta = {
  title: "Categories/CategoryTreeRow",
  component: CategoryTreeRow,
  args: {
    category: food,
    colorOf,
    canManage: true,
    onEdit: fn(),
    onDelete: fn(),
    onAddChild: fn(),
    className: "w-[56rem] max-w-full",
  },
} satisfies Meta<typeof CategoryTreeRow>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Root: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "New subcategory of Food" }));
    await expect(args.onAddChild).toHaveBeenCalledWith(food);
  },
};

export const OwnerAndMemberLimits: Story = { args: { category: hobbies } };

export const Child: Story = {
  args: {
    category: { id: 11, type: "DEBIT", description: "Restaurants", parentId: 1, spendingLimit: 400 },
    child: { isLast: false },
  },
};

export const LastChild: Story = {
  args: {
    category: { id: 12, type: "DEBIT", description: "Groceries", parentId: 1 },
    child: { isLast: true },
  },
};

export const FormerOwner: Story = {
  args: {
    category: {
      ...hobbies,
      ownerActive: false,
      memberLimits: [{ memberId: 2, memberName: "Livia", amount: 450, active: false }],
    },
  },
};

export const NoLimit: Story = { args: { category: { ...food, spendingLimit: null } } };

export const ReadOnly: Story = {
  args: { canManage: false },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole("button", { name: "Edit Food" })).toBeNull();
  },
};

export const LongContent: Story = {
  args: {
    category: {
      ...hobbies,
      description: "Household maintenance, repairs and improvements for the whole building",
      ownerName: "Maximiliano Albuquerque de Vasconcelos",
      memberLimits: Array.from({ length: 6 }, (_, index) => ({
        memberId: index + 1,
        memberName: `Member ${index + 1}`,
        amount: 98765432.1,
        active: index !== 5,
      })),
      effectiveLimit: 592592592.6,
    },
  },
};

// Narrow screens stack the row and a tap opens the edit form.
export const Mobile: Story = {
  args: { category: hobbies, className: undefined },
  globals: { viewport: { value: "mobile1" } },
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: /Hobbies/ }));
    await expect(args.onEdit).toHaveBeenCalledWith(hobbies);
  },
};
