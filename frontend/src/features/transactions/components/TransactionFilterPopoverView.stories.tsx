import type { Category, PlanMember } from "@/api/dtos";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, screen, waitFor } from "storybook/test";
import { TransactionFilterPopoverView } from "./TransactionFilterPopoverView";

const categories: Category[] = [
  { id: 1, type: "DEBIT", description: "Food" },
  { id: 11, type: "DEBIT", description: "Restaurants", parentId: 1 },
  { id: 2, type: "DEBIT", description: "Housing" },
  { id: 3, type: "CREDIT", description: "Salary" },
];

const members: PlanMember[] = [
  { userId: 1, name: "Lucas Martins", email: "lucas@example.com", role: "OWNER" },
  { userId: 2, name: "Livia Souza", email: "livia@example.com", role: "EDITOR" },
];

const noFilters = { filter: {}, categoryForDisplay: null, memberForDisplay: null };

const meta = {
  title: "Transactions/TransactionFilterPopoverView",
  component: TransactionFilterPopoverView,
  args: {
    appliedFilters: noFilters,
    onApply: fn(),
    members,
    categories,
    isLoadingCategories: false,
  },
} satisfies Meta<typeof TransactionFilterPopoverView>;
export default meta;

type Story = StoryObj<typeof meta>;

export const NoFilters: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("button", { name: "Filters" })).toBeVisible();
  },
};

export const ActiveFilters: Story = {
  args: {
    appliedFilters: {
      filter: { type: "DEBIT", categoryId: 11, memberId: 2, amountMin: 50 },
      categoryForDisplay: categories[1],
      memberForDisplay: { id: 2, name: "Livia Souza" },
    },
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("button", { name: "Filters 4" })).toBeVisible();
  },
};

export const OpenSharedPlan: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Filters" }));
    await expect(await screen.findByText("Attributed to")).toBeVisible();
    await expect(screen.getByLabelText("Type")).toHaveTextContent("All");
    await userEvent.click(screen.getByRole("button", { name: "Apply" }));
    await expect(args.onApply).toHaveBeenCalledWith(noFilters);
    // Applying closes the popover; the a11y check runs once it has left.
    await waitFor(() => expect(screen.queryByRole("button", { name: "Apply" })).toBeNull());
  },
};

export const OpenSingleMember: Story = {
  args: { members: [members[0]] },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Filters" }));
    await expect(await screen.findByText("Category")).toBeVisible();
    await expect(screen.queryByText("Attributed to")).toBeNull();
  },
};

export const LoadingCategories: Story = {
  tags: ["!test"],
  args: { categories: [], isLoadingCategories: true },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Filters" }));
    await expect(await screen.findByText("Category")).toBeVisible();
  },
};

export const Mobile: Story = {
  tags: ["!test"],
  globals: { viewport: { value: "mobile1" } },
  play: OpenSharedPlan.play,
};
