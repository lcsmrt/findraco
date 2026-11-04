import type { ArchivedPlan } from "@/api/dtos";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";
import { ArchivedPlansListView } from "./ArchivedPlansListView";

// Midday UTC keeps the calendar day the same in every time zone the suite may run in.
const plans: ArchivedPlan[] = [
  { id: 1, name: "Old home", archivedAt: "2026-10-20T12:00:00Z", deletesAt: "2026-11-19T12:00:00Z" },
  { id: 2, name: "Trip to Lisbon", archivedAt: "2026-10-28T12:00:00Z", deletesAt: "2026-11-27T12:00:00Z" },
];

const meta = {
  title: "Plans/ArchivedPlansListView",
  component: ArchivedPlansListView,
  args: { plans, isLoading: false, isError: false, restoringPlanId: null, onRestore: fn() },
} satisfies Meta<typeof ArchivedPlansListView>;
export default meta;

type Story = StoryObj<typeof meta>;

export const TwoPlans: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await expect(canvas.getByText("Archived plans")).toBeVisible();
    await expect(canvas.getByText("Old home")).toBeVisible();
    await expect(canvas.getByText("Archived on 20/10/2026")).toBeVisible();
    await expect(canvas.getByText("Deleted permanently on 19/11/2026")).toBeVisible();
    await expect(canvas.getByText("Archived on 28/10/2026")).toBeVisible();
    await expect(canvas.getByText("Deleted permanently on 27/11/2026")).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Restore Trip to Lisbon" }));
    await expect(args.onRestore).toHaveBeenCalledWith(plans[1]);
  },
};

export const Loading: Story = {
  args: { plans: [], isLoading: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Archived plans")).toBeVisible();
    await expect(canvas.queryByRole("button")).toBeNull();
  },
};

export const LoadFailed: Story = {
  args: { plans: [], isError: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("alert")).toHaveTextContent("Could not load your archived plans");
  },
};

export const Restoring: Story = {
  args: { restoringPlanId: 1 },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("button", { name: "Restore Old home" })).toBeDisabled();
    await expect(canvas.getByRole("button", { name: "Restore Trip to Lisbon" })).toBeDisabled();
  },
};

export const LongName: Story = {
  tags: ["!test"],
  args: {
    plans: [
      {
        id: 3,
        name: "Household finances shared with the whole family and two flatmates",
        archivedAt: "2026-10-20T12:00:00Z",
        deletesAt: "2026-11-19T12:00:00Z",
      },
    ],
  },
};

export const Mobile: Story = {
  tags: ["!test"],
  globals: { viewport: { value: "mobile1" } },
};
