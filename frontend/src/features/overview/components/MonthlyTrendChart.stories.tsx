import type { MonthlyTrend } from "@/api/dtos";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fireEvent, waitFor, within } from "storybook/test";
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

// The tooltip is the only place the chart writes a full figure, so it carries the same look as the lists.
export const Tooltip: Story = {
  play: async ({ canvasElement }) => {
    // The container measures itself after the first paint; a hover before that finds no plot area.
    const plot = await waitFor(() => {
      const surface = canvasElement.querySelector(".recharts-surface");
      if (!surface || !canvasElement.querySelector(".recharts-line-curve")) throw new Error("not drawn yet");
      return surface;
    });
    // Recharts reads the mouse move itself, which a user-event hover does not reach.
    const box = plot.getBoundingClientRect();
    fireEvent.mouseMove(plot, { clientX: box.left + box.width / 2, clientY: box.top + box.height / 2 });
    const values = await within(canvasElement).findAllByText(/^R\$ /, { selector: ".recharts-tooltip-wrapper *" });
    await expect(values).toHaveLength(2);
    for (const value of values) {
      const { fontFamily, fontVariantNumeric, fontSize } = getComputedStyle(value);
      await expect(fontFamily.replace(/^["']/, "").startsWith("Space Grotesk")).toBe(true);
      await expect(fontVariantNumeric).toContain("tabular-nums");
      await expect(parseFloat(fontSize)).toBe(14);
    }
  },
};

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
