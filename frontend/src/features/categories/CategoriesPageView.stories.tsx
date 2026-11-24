import type { Category } from "@/api/dtos";
import { MEMBER_PALETTE } from "@/utils/memberColors";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { page } from "@vitest/browser/context";
import { expect, fn, within } from "storybook/test";
import { buildCategoryTree } from "./utils/categoryTree";
import { CategoriesPageView } from "./CategoriesPageView";

function colorOf(memberId: number) {
  return MEMBER_PALETTE[(memberId - 1) % MEMBER_PALETTE.length];
}

const categories: Category[] = [
  { id: 1, version: 0, type: "DEBIT", description: "Food", spendingLimit: 2000 },
  { id: 11, version: 0, type: "DEBIT", description: "Restaurants", parentId: 1, spendingLimit: 400 },
  { id: 12, version: 0, type: "DEBIT", description: "Groceries", parentId: 1 },
  {
    id: 2,
    version: 0,
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
  { id: 3, version: 0, type: "CREDIT", description: "Salary" },
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

export const PageTitle: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("heading", { level: 1, name: "Categories" })).toBeVisible();
  },
};

// The page create sits in the header as an outline button (a border, no fill of its own): no filled
// primary button is left on the page.
export const HeaderActions: Story = {
  play: async ({ canvas, canvasElement }) => {
    const header = canvas.getByRole("heading", { level: 1, name: "Categories" }).closest("header");
    if (!header) throw new Error("the page title is not inside a header");
    const create = within(header).getByRole("button", { name: "New Category" });
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

// The create action sits on the title's row, not below it, on a phone.
export const ActionOnTitleRow: Story = {
  play: async ({ canvas }) => {
    await page.viewport(414, 896);
    const title = canvas.getByRole("heading", { level: 1, name: "Categories" }).getBoundingClientRect();
    const action = canvas.getByRole("button", { name: "New Category" }).getBoundingClientRect();
    await expect(action.top).toBeGreaterThanOrEqual(title.top);
    await expect(action.top).toBeLessThanOrEqual(title.bottom);
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
        version: 0,
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
