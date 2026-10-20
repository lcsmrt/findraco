import type { FinancialTransactionCategory } from "@/api/dtos";
import { MEMBER_PALETTE } from "@/utils/memberColors";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";
import { buildCategoryTree } from "./utils/categoryTree";
import { CategoriesPageView } from "./CategoriesPageView";

function colorOf(memberId: number) {
  return MEMBER_PALETTE[(memberId - 1) % MEMBER_PALETTE.length];
}

const categories: FinancialTransactionCategory[] = [
  { id: 1, type: "DEBIT", description: "Food", spendingLimit: 2000 },
  { id: 11, type: "DEBIT", description: "Restaurants", parentId: 1, spendingLimit: 400 },
  { id: 12, type: "DEBIT", description: "Groceries", parentId: 1 },
  {
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
  },
  { id: 3, type: "CREDIT", description: "Salary" },
];

const meta = {
  title: "Categories/CategoriesPageView",
  component: CategoriesPageView,
  // The sections come from the real builder, so each story shows what the tab would render.
  args: {
    sections: buildCategoryTree(categories),
    colorOf,
    canManage: true,
    onCreate: fn(),
    onEdit: fn(),
    onDelete: fn(),
    onAddChild: fn(),
  },
} satisfies Meta<typeof CategoriesPageView>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Manager: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await expect(canvas.getByText("Expenses")).toBeVisible();
    await expect(canvas.getByText("Income")).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "New Category" }));
    await expect(args.onCreate).toHaveBeenCalledTimes(1);
  },
};

export const ReadOnly: Story = {
  args: { canManage: false },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole("button", { name: "New Category" })).toBeNull();
  },
};

export const Loading: Story = {
  args: { sections: null },
};

export const Empty: Story = {
  args: { sections: buildCategoryTree([]) },
  play: async ({ canvas }) => {
    await expect(canvas.getAllByText("No categories yet.").length).toBeGreaterThan(0);
  },
};

export const ManyLongCategories: Story = {
  tags: ["!test"],
  args: {
    sections: buildCategoryTree(
      Array.from({ length: 20 }, (_, index) => ({
        id: 100 + index,
        type: "DEBIT" as const,
        description: `Household maintenance, repairs and improvements ${index + 1}`,
        spendingLimit: 98765432.1,
      })),
    ),
  },
};

export const Mobile: Story = {
  tags: ["!test"],
  globals: { viewport: { value: "mobile1" } },
};
