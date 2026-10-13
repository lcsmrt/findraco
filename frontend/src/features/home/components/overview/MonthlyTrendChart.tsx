import { Card, CardContent, CardHeader, CardTitle } from "@/components/card/Card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/chart/Chart";
import { Skeleton } from "@/components/skeleton/Skeleton";
import { format } from "date-fns";
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";
import type { TrendMonth } from "./trendMonths";

const chartConfig: ChartConfig = {
  income: { label: "Income", color: "var(--success)" },
  expenses: { label: "Expenses", color: "var(--destructive)" },
};

const compactCurrency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  notation: "compact",
});

/** Months outside the selected period recede (UX-05 AC 5). */
const OUT_OF_PERIOD_OPACITY = 0.3;

type MonthTickProps = {
  x?: number;
  y?: number;
  index?: number;
  months: TrendMonth[];
};

const MonthTick = ({ x = 0, y = 0, index = 0, months }: MonthTickProps) => {
  const month = months[index];
  if (!month) return null;
  return (
    <text
      x={x}
      y={y + 12}
      textAnchor="middle"
      fontSize={12}
      className={month.inPeriod ? "fill-foreground font-semibold" : "fill-muted-foreground"}
    >
      {month.label}
    </text>
  );
};

const withTitles = (months: TrendMonth[]) =>
  months.map((month) => ({
    ...month,
    title: format(new Date(month.year, month.month - 1, 1), "MMMM yyyy"),
  }));

type MonthlyTrendChartProps = {
  months: TrendMonth[] | undefined;
  isLoading: boolean;
};

/** Income and Expenses as grouped bars per month, the selected period highlighted (UX-05 AC 4–6). */
export const MonthlyTrendChart = ({ months, isLoading }: MonthlyTrendChartProps) => (
  <Card>
    <CardHeader>
      <CardTitle>Monthly trend</CardTitle>
    </CardHeader>
    <CardContent className="px-2 sm:px-6">
      {isLoading || !months ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <ChartContainer config={chartConfig} className="h-64 w-full">
          <BarChart data={withTitles(months)} barGap={2} barCategoryGap="22%">
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              interval={0}
              tick={<MonthTick months={months} />}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={64}
              tickFormatter={(v: number) => compactCurrency.format(v)}
            />
            <ChartTooltip
              cursor={{ fill: "var(--muted)", opacity: 0.5 }}
              content={
                <ChartTooltipContent
                  labelFormatter={(_, payload) => payload?.[0]?.payload?.title ?? ""}
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            {(["income", "expenses"] as const).map((key) => (
              <Bar key={key} dataKey={key} fill={`var(--color-${key})`} radius={[4, 4, 0, 0]} maxBarSize={28} isAnimationActive={false}>
                {months.map((month) => (
                  <Cell
                    key={`${month.year}-${month.month}`}
                    fillOpacity={month.inPeriod ? 1 : OUT_OF_PERIOD_OPACITY}
                  />
                ))}
              </Bar>
            ))}
          </BarChart>
        </ChartContainer>
      )}
    </CardContent>
  </Card>
);
