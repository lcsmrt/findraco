import type { CategorySpending, CategorySpendingMember, UsageStatus } from "@/api/dtos";
import { MEMBER_PALETTE } from "@/utils/memberColors";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { CategorySpendingList } from "./CategorySpendingList";
import { buildSpendingRows, type SelectedMember } from "../utils/spendingRows";

function colorOf(memberId: number) {
  return MEMBER_PALETTE[(memberId - 1) % MEMBER_PALETTE.length];
}

type Judged = Pick<CategorySpending, "limit" | "remaining" | "percentUsed" | "status">;

const NO_LIMIT: Judged = { limit: null, remaining: null, percentUsed: null, status: null };

/** A limit as the API judged it for the period; stories state the verdict, they never compute one. */
function judged(limit: number, remaining: number, percentUsed: number, status: UsageStatus): Judged {
  return { limit, remaining, percentUsed, status };
}

function member(
  memberId: number,
  name: string,
  spent: number,
  verdict: Judged = NO_LIMIT,
  active = true,
): CategorySpendingMember {
  return {
    memberId,
    name,
    spent,
    ...verdict,
    active,
  };
}

type CategoryInput = Partial<CategorySpending> & Pick<CategorySpending, "categoryId" | "name">;

function category(input: CategoryInput): CategorySpending {
  const members = input.members ?? [];
  return {
    parentId: null,
    type: "DEBIT",
    ownerId: null,
    ownerName: null,
    ownerActive: null,
    spent: members.reduce((sum, entry) => sum + entry.spent, 0),
    ...NO_LIMIT,
    children: [],
    ...input,
    members,
  };
}

const tree: CategorySpending[] = [
  category({
    categoryId: 1,
    name: "Food",
    ...judged(2000, 255, 87.25, "WARNING"),
    members: [member(1, "Lucas Martins", 1051), member(2, "Livia Souza", 694)],
    children: [
      category({
        categoryId: 11,
        parentId: 1,
        name: "Restaurants",
        ...judged(400, -90, 122.5, "OVER"),
        members: [member(1, "Lucas Martins", 310), member(2, "Livia Souza", 180)],
      }),
      category({
        categoryId: 12,
        parentId: 1,
        name: "Groceries",
        members: [member(1, "Lucas Martins", 741), member(2, "Livia Souza", 514)],
      }),
    ],
  }),
  category({
    categoryId: 2,
    name: "Housing",
    ...judged(3000, 600, 80, "WARNING"),
    members: [member(1, "Lucas Martins", 1200), member(2, "Livia Souza", 1200)],
  }),
  category({
    categoryId: 3,
    name: "Hobbies",
    ownerId: 2,
    ownerName: "Livia Souza",
    ownerActive: true,
    members: [member(2, "Livia Souza", 230, judged(300, 70, 76.67, "OK"))],
  }),
  category({
    categoryId: 4,
    name: "Transport",
    ...judged(500, -50, 110, "OVER"),
    members: [member(1, "Lucas Martins", 420, judged(300, -120, 140, "OVER")), member(3, "Ana Lima", 130, NO_LIMIT, false)],
  }),
];

function view(categories: CategorySpending[], selectedMember: SelectedMember | null = null) {
  return buildSpendingRows({ tree: categories, selectedMember, colorOf });
}

const meta = {
  title: "Overview/CategorySpendingList",
  component: CategorySpendingList,
  // The rows come from the real builder, so each story shows what the Overview would render.
  args: { view: view(tree) },
} satisfies Meta<typeof CategorySpendingList>;
export default meta;

type Story = StoryObj<typeof meta>;

// Food opens on load because Restaurants is over its limit; a click folds it.
export const LimitStatuses: Story = {
  play: async ({ canvas, userEvent }) => {
    const food = canvas.getByRole("button", { name: /Food/ });
    await expect(food).toHaveAttribute("aria-expanded", "true");
    await expect(canvas.getByText("Restaurants")).toBeVisible();
    await userEvent.click(food);
    await expect(canvas.queryByText("Restaurants")).toBeNull();
  },
};

export const MemberSelected: Story = {
  args: { view: view(tree, { id: 1, name: "Lucas Martins" }) },
};

export const Empty: Story = {
  args: { view: view([]) },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("No expense categories yet.")).toBeVisible();
  },
};

export const ManyLongCategories: Story = {
  tags: ["!test"],
  args: {
    view: view(
      Array.from({ length: 15 }, (_, index) =>
        category({
          categoryId: index + 100,
          name: `Household maintenance, repairs and improvements ${index + 1}`,
          ...judged(98765432.1, 9876543.12, 90, "WARNING"),
          members: [
            member(1, "Maximiliano Albuquerque", 87654321.09 + index * 1000000),
            member(2, "Livia Souza", 1234567.89),
          ],
        }),
      ),
    ),
  },
};

// Below `sm` a member's status moves under their bar.
export const Mobile: Story = { tags: ["!test"], globals: { viewport: { value: "mobile1" } } };
