import type { MonthlyTrend } from "@/api/dtos";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { MonthlyTrendChart } from "./MonthlyTrendChart";
import { fillTrendMonths, trendWindow } from "../utils/trendMonths";

const october = { startDate: "2026-10-01", endDate: "2026-10-31" };

function trend(selected: { startDate: string; endDate: string }, data: MonthlyTrend[]) {
  return fillTrendMonths(data, trendWindow(selected), selected);
}

const halfYear: MonthlyTrend[] = [
  { year: 2026, month: 5, income: 9800, expenses: 7200 },
  { year: 2026, month: 6, income: 10200, expenses: 8100 },
  { year: 2026, month: 7, income: 9800, expenses: 11250 },
  { year: 2026, month: 8, income: 11000, expenses: 6900 },
  { year: 2026, month: 9, income: 10400, expenses: 7400 },
  { year: 2026, month: 10, income: 11000, expenses: 5852.5 },
];

const meta = {
  title: "Overview/MonthlyTrendChart",
  component: MonthlyTrendChart,
  // The months come from the real builder, so each story shows what the Overview would render.
  args: { months: trend(october, halfYear), isLoading: false },
} satisfies Meta<typeof MonthlyTrendChart>;
export default meta;

type Story = StoryObj<typeof meta>;

export const OneMonthSelected: Story = {};

export const QuarterSelected: Story = {
  tags: ["!test"],
  args: { months: trend({ startDate: "2026-08-01", endDate: "2026-10-31" }, halfYear) },
};

export const Loading: Story = { args: { months: undefined, isLoading: true } };

// Months without data still appear, at zero.
export const NoData: Story = { tags: ["!test"], args: { months: trend(october, []) } };

export const YearLargeValues: Story = {
  tags: ["!test"],
  args: {
    months: trend(
      { startDate: "2026-01-01", endDate: "2026-12-31" },
      Array.from({ length: 12 }, (_, index) => ({
        year: 2026,
        month: index + 1,
        income: 987654321 - index * 1000000,
        expenses: 123456789 + index * 25000000,
      })),
    ),
  },
};

export const Mobile: Story = { tags: ["!test"], globals: { viewport: { value: "mobile1" } } };
