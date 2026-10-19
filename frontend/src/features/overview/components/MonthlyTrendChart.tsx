import { Card, CardContent, CardHeader, CardTitle } from "@/components/card/base/Card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/chart/base/Chart";
import { Skeleton } from "@/components/skeleton/base/Skeleton";
import { typographyVariants } from "@/components/typography/base/typographyVariants";
import { cn } from "@/lib/mergeClasses";
import { format } from "date-fns";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { formatMoney } from "@/utils/money";
import type { TrendMonth } from "./trendMonths";

const chartConfig: ChartConfig = {
  income: { label: "Income", color: "var(--success)" },
  expenses: { label: "Expenses", color: "var(--destructive)" },
};

/** Months outside the selected period recede (UX-05 AC 5). */
const OUT_OF_PERIOD_OPACITY = 0.3;

type MonthDotProps = {
  cx?: number;
  cy?: number;
  index?: number;
  stroke?: string;
  months: TrendMonth[];
};

/** A filled, larger dot on months inside the selected period; a faded one elsewhere. */
function MonthDot({ cx, cy, index = 0, stroke, months }: MonthDotProps) {
  if (cx == null || cy == null) return null;
  const inPeriod = months[index]?.inPeriod ?? false;
  return (
    <circle
      cx={cx}
      cy={cy}
      r={inPeriod ? 4 : 3}
      fill={stroke}
      fillOpacity={inPeriod ? 1 : OUT_OF_PERIOD_OPACITY}
      stroke="none"
    />
  );
}

type MonthTickProps = {
  x?: number;
  y?: number;
  index?: number;
  months: TrendMonth[];
};

function MonthTick({ x = 0, y = 0, index = 0, months }: MonthTickProps) {
  const month = months[index];
  if (!month) return null;
  return (
    <text
      x={x}
      y={y + 12}
      textAnchor="middle"
      className={cn(
        typographyVariants({ variant: "caption" }),
        month.inPeriod ? "fill-foreground" : "fill-muted-foreground",
      )}
    >
      {month.label}
    </text>
  );
}

function withTitles(months: TrendMonth[]) {
  return months.map((month) => ({
    ...month,
    title: format(new Date(month.year, month.month - 1, 1), "MMMM yyyy"),
  }));
}

type MonthlyTrendChartProps = {
  months: TrendMonth[] | undefined;
  isLoading: boolean;
};

/** Income and Expenses as one line each across the months, the selected period highlighted (UX-05 AC 4–6). */
export function MonthlyTrendChart({ months, isLoading }: MonthlyTrendChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly trend</CardTitle>
      </CardHeader>
      <CardContent className="px-2 sm:px-6">
        {isLoading || !months ? (
          <Skeleton className="h-64 w-full" />
        ) : (
          <ChartContainer config={chartConfig} className="h-64 w-full">
            <LineChart data={withTitles(months)} margin={{ left: 4, right: 12 }}>
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
                tickFormatter={(v: number) => formatMoney(v, { compact: true })}
              />
              <ChartTooltip
                cursor={{ stroke: "var(--border)" }}
                content={
                  <ChartTooltipContent
                    labelFormatter={(_, payload) => payload?.[0]?.payload?.title ?? ""}
                  />
                }
              />
              <ChartLegend content={<ChartLegendContent />} />
              {(["income", "expenses"] as const).map((key) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={`var(--color-${key})`}
                  strokeWidth={2}
                  dot={<MonthDot months={months} />}
                  activeDot={{ r: 5 }}
                  isAnimationActive={false}
                />
              ))}
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
