import { MonthlyTrend } from "@/api/dtos";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/card/Card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/chart/Chart";
import { format } from "date-fns";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

type MonthlyTrendChartProps = {
  data: MonthlyTrend[];
};

const chartConfig: ChartConfig = {
  income: { label: "Income", color: "var(--success)" },
  expenses: { label: "Expenses", color: "var(--destructive)" },
};

const compactCurrency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  notation: "compact",
});

export const MonthlyTrendChart = ({ data }: MonthlyTrendChartProps) => {
  const chartData = data.map((d) => ({
    ...d,
    label: format(new Date(d.year, d.month - 1, 1), "MMM/yy"),
  }));
  const dot = chartData.length === 1 ? { r: 4 } : false;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Trend</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-muted-foreground flex h-32 items-center justify-center text-sm">
            No transactions for this period.
          </p>
        ) : (
          <ChartContainer config={chartConfig} className="h-75 w-full">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" tickLine={false} axisLine={false} />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={64}
                tickFormatter={(v: number) => compactCurrency.format(v)}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Line type="monotone" dataKey="income" stroke="var(--color-income)" strokeWidth={2} dot={dot} />
              <Line type="monotone" dataKey="expenses" stroke="var(--color-expenses)" strokeWidth={2} dot={dot} />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};
