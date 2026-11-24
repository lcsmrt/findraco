import type { Category, PlanMember } from "@/api/dtos";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { page } from "@vitest/browser/context";
import { expect, fn, screen, waitFor } from "storybook/test";
import { TransactionFilterPopoverView } from "./TransactionFilterPopoverView";

const categories: Category[] = [
  { id: 1, version: 0, type: "DEBIT", description: "Food" },
  { id: 11, version: 0, type: "DEBIT", description: "Restaurants", parentId: 1 },
  { id: 2, version: 0, type: "DEBIT", description: "Housing" },
  { id: 3, version: 0, type: "CREDIT", description: "Salary" },
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

// The count of active filters is a quiet fact about the button, not a state.
export const MetaBadges: Story = {
  args: ActiveFilters.args,
  play: async ({ canvas }) => {
    await expect(canvas.getByText("4").closest("[data-variant]")).toHaveAttribute("data-variant", "meta");
  },
};

export const OpenSharedPlan: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Filters" }));
    await expect(await screen.findByText("Attributed to")).toBeVisible();
    await expect(screen.getByLabelText("Type")).toHaveTextContent("All");
    // The period lives in the navigator, not in the filters.
    await expect(screen.queryByLabelText("Date")).toBeNull();
    await expect(screen.queryByText("Date")).toBeNull();
    await userEvent.click(screen.getByRole("button", { name: "Apply" }));
    await expect(args.onApply).toHaveBeenCalledWith(noFilters);
    // Applying closes the popover; the a11y check runs once it has left.
    await waitFor(() => expect(screen.queryByRole("button", { name: "Apply" })).toBeNull());
  },
};

// A phone finger needs 44 px: the type select, the category combobox and the buttons grow to it.
export const TouchTargets: Story = {
  play: async ({ canvas, userEvent }) => {
    await page.viewport(414, 896);
    await userEvent.click(canvas.getByRole("button", { name: "Filters" }));
    const dialog = await screen.findByRole("dialog", { name: "Filters" });
    const controls = [
      screen.getByLabelText("Type"),
      ...dialog.querySelectorAll("[role=combobox]"),
      ...dialog.querySelectorAll("[data-slot=button]"),
    ];
    await expect(controls.length).toBeGreaterThan(4);
    for (const control of controls) {
      await expect(control.getBoundingClientRect().height).toBe(44);
    }
  },
};

// The checkbox is 16 px: the row, label included, is the 44 px target, and a tap on the label toggles it.
export const CheckboxTarget: Story = {
  play: async ({ canvas, userEvent }) => {
    await page.viewport(414, 896);
    await userEvent.click(canvas.getByRole("button", { name: "Filters" }));
    const checkbox = await screen.findByRole("checkbox", { name: "Neutral" });
    const row = checkbox.closest("[data-slot=field]");
    const label = screen.getByText("Neutral", { selector: "label" });
    if (!row) throw new Error("The checkbox has no row");
    await waitFor(() => {
      expect(row.getBoundingClientRect().height).toBe(44);
      expect(label.getBoundingClientRect().height).toBe(44);
    });
    await expect(checkbox).not.toBeChecked();
    await userEvent.click(label);
    await expect(checkbox).toBeChecked();
  },
};

export const NeutralChoice: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Filters" }));
    await userEvent.click(await screen.findByRole("checkbox", { name: "Neutral" }));
    await userEvent.click(screen.getByRole("button", { name: "Apply" }));
    await expect(args.onApply).toHaveBeenCalledWith({ ...noFilters, filter: { kind: "NEUTRAL" } });
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
