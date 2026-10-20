import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";
import { memberColor } from "@/utils/memberColors";
import * as SpendingStories from "./components/CategorySpendingList.stories";
import * as TrendStories from "./components/MonthlyTrendChart.stories";
import PeriodNavigatorMeta from "./components/PeriodNavigator.stories";
import * as SummaryStories from "./components/SummaryCards.stories";
import { OverviewPageView } from "./OverviewPageView";

// The sections' own stories build their fixtures from the real builders; the tab reuses them.
const members = [
  { id: 1, name: "Lucas Martins" },
  { id: 2, name: "Livia Souza" },
];
const refs = members.map((member) => ({ userId: member.id }));

const meta = {
  title: "Overview/OverviewPageView",
  component: OverviewPageView,
  args: {
    navigator: PeriodNavigatorMeta.args,
    memberFilter: {
      members,
      selectedId: null,
      onChange: fn(),
      colorOf: (userId) => memberColor(refs, userId),
    },
    summary: SummaryStories.default.args.view,
    spending: SpendingStories.default.args.view,
    trend: TrendStories.default.args,
  },
} satisfies Meta<typeof OverviewPageView>;
export default meta;

type Story = StoryObj<typeof meta>;

export const SharedPlan: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("button", { name: "All" })).toBeVisible();
    await expect(canvas.getAllByText("Food").length).toBeGreaterThan(0);
  },
};

export const SingleMember: Story = {
  args: { memberFilter: null },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole("button", { name: "All" })).toBeNull();
  },
};

export const Loading: Story = {
  args: {
    summary: null,
    spending: null,
    trend: { months: undefined, isLoading: true },
  },
};

export const Empty: Story = {
  args: {
    summary: SummaryStories.NoActivity.args?.view,
    spending: SpendingStories.Empty.args?.view,
    trend: { ...TrendStories.default.args, ...TrendStories.NoData.args },
  },
};

export const LargeValues: Story = {
  args: {
    summary: SummaryStories.ManyMembersLargeValues.args?.view,
    spending: SpendingStories.ManyLongCategories.args?.view,
    trend: { ...TrendStories.default.args, ...TrendStories.YearLargeValues.args },
  },
};

export const Mobile: Story = {
  globals: { viewport: { value: "mobile1" } },
};
