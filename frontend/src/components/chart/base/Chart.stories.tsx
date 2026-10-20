import type { Meta, StoryObj } from "@storybook/react-vite";
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "./Chart";

type MonthRow = { month: string; income: number; expenses: number };

const config = {
  income: { label: "Income", color: "var(--color-success)" },
  expenses: { label: "Expenses", color: "var(--color-destructive)" },
} satisfies ChartConfig;

const months: MonthRow[] = [
  { month: "Jan", income: 5000, expenses: 3200 },
  { month: "Feb", income: 5000, expenses: 4100 },
  { month: "Mar", income: 5400, expenses: 2900 },
  { month: "Apr", income: 5400, expenses: 6100 },
];

type DemoChartProps = {
  kind: "bar" | "line";
  data: MonthRow[];
  // Pins the tooltip on one point so its content is visible without hovering.
  tooltipIndex?: number;
  indicator?: "line" | "dot" | "dashed";
};

function DemoChart({ kind, data, tooltipIndex, indicator }: DemoChartProps) {
  const tooltip = (
    <ChartTooltip
      defaultIndex={tooltipIndex}
      active={tooltipIndex === undefined ? undefined : true}
      content={<ChartTooltipContent indicator={indicator} />}
    />
  );

  return (
    <ChartContainer config={config} className="w-[36rem] max-w-full">
      {kind === "bar" ? (
        <BarChart data={data} accessibilityLayer>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="month" tickLine={false} axisLine={false} />
          {tooltip}
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="income" fill="var(--color-income)" radius={4} />
          <Bar dataKey="expenses" fill="var(--color-expenses)" radius={4} />
        </BarChart>
      ) : (
        <LineChart data={data} accessibilityLayer>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="month" tickLine={false} axisLine={false} />
          {tooltip}
          <ChartLegend content={<ChartLegendContent />} />
          <Line dataKey="income" stroke="var(--color-income)" dot={false} />
          <Line dataKey="expenses" stroke="var(--color-expenses)" dot={false} />
        </LineChart>
      )}
    </ChartContainer>
  );
}

const meta = {
  tags: ["!test"],
  title: "Chart",
  component: DemoChart,
} satisfies Meta<typeof DemoChart>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Bars: Story = { args: { kind: "bar", data: months } };

export const Lines: Story = { args: { kind: "line", data: months } };

export const TooltipDot: Story = { args: { kind: "bar", data: months, tooltipIndex: 1 } };

export const TooltipLine: Story = {
  args: { kind: "line", data: months, tooltipIndex: 2, indicator: "line" },
};

export const TooltipDashed: Story = {
  args: { kind: "line", data: months, tooltipIndex: 3, indicator: "dashed" },
};

export const Empty: Story = { args: { kind: "bar", data: [] } };

export const ManyMonthsLargeValues: Story = {
  args: {
    kind: "bar",
    data: Array.from({ length: 24 }, (_, index) => ({
      month: `M${index + 1}`,
      income: 987654321 - index * 1000,
      expenses: 123456789 + index * 5000,
    })),
    tooltipIndex: 0,
  },
};

export const Mobile: Story = {
  args: { kind: "bar", data: months },
  globals: { viewport: { value: "mobile1" } },
};
