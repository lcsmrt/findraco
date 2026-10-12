import { CategoryBreakdown } from "@/api/dtos";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/card/Card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/chart/Chart";
import { cn } from "@/lib/mergeClasses";
import { formatCurrency } from "@/utils/string/formatters";
import { useMemo, useState } from "react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";

type Status = "no-limit" | "ok" | "warning" | "over";

type ChartEntry = {
  categoryId: number;
  /** Y-axis label: expand marker on roots with children, indent on children. */
  label: string;
  hasChildren: boolean;
  categoryName: string;
  spent: number;
  limit?: number;
  remaining?: number;
  spentBar: number;
  remainingBar: number;
  status: Status;
};

const WARNING_THRESHOLD = 0.8;
const LABEL_CHAR_WIDTH = 7;
const LABEL_MAX_WIDTH = 140;

function roundedRect(
  x: number,
  y: number,
  width: number,
  height: number,
  tl: number,
  tr: number,
  br: number,
  bl: number,
): string {
  return [
    `M ${x + tl},${y}`,
    `H ${x + width - tr}`,
    `Q ${x + width},${y} ${x + width},${y + tr}`,
    `V ${y + height - br}`,
    `Q ${x + width},${y + height} ${x + width - br},${y + height}`,
    `H ${x + bl}`,
    `Q ${x},${y + height} ${x},${y + height - bl}`,
    `V ${y + tl}`,
    `Q ${x},${y} ${x + tl},${y}`,
    `Z`,
  ].join(" ");
}

const STATUS_COLORS: Record<Status, string> = {
  "no-limit": "var(--primary)",
  ok: "var(--success)",
  warning: "#f97316",
  over: "var(--destructive)",
};

function getStatus(spent: number, limit?: number): Status {
  if (limit == null) return "no-limit";
  if (spent > limit) return "over";
  if (spent / limit >= WARNING_THRESHOLD) return "warning";
  return "ok";
}

interface CategorySpendingChartProps {
  /** Root categories with rolled-up spend; children are shown on expand. */
  data: CategoryBreakdown[];
}

const toEntry = (
  entry: CategoryBreakdown,
  label: string,
  hasChildren: boolean,
): ChartEntry => {
  const status = getStatus(entry.spent, entry.limit);
  const remainingBar =
    entry.limit != null && status !== "over" ? entry.limit - entry.spent : 0;
  return {
    categoryId: entry.categoryId,
    label,
    hasChildren,
    categoryName: entry.categoryName,
    spent: entry.spent,
    limit: entry.limit,
    remaining: entry.remaining,
    spentBar: entry.spent,
    remainingBar,
    status,
  };
};

interface BarShapeBaseProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

interface SpentBarShapeProps extends BarShapeBaseProps {
  payload?: ChartEntry;
}

const SpentBarShape = ({
  x = 0,
  y = 0,
  width = 0,
  height = 0,
  payload,
}: SpentBarShapeProps) => {
  if (!payload || width <= 0) return null;

  const fill = STATUS_COLORS[payload.status];
  const isOver = payload.status === "over";
  const hasRemaining = payload.remainingBar > 0;

  const limitMarkerX =
    isOver && payload.limit != null && payload.spent > 0
      ? x + (payload.limit / payload.spent) * width
      : null;

  const pad = 2;
  const r = 4;
  const ry = y + pad;
  const rh = height - pad * 2;
  const d = hasRemaining
    ? roundedRect(x, ry, width, rh, r, 0, 0, r)
    : roundedRect(x, ry, width, rh, r, r, r, r);

  return (
    <g>
      <path d={d} fill={fill} />
      {limitMarkerX != null && (
        <rect
          x={limitMarkerX - 1.5}
          y={y}
          width={3}
          height={height}
          fill="var(--muted-foreground)"
          opacity={0.35}
          rx={1.5}
        />
      )}
    </g>
  );
};

const RemainingBarShape = ({
  x = 0,
  y = 0,
  width = 0,
  height = 0,
}: BarShapeBaseProps) => {
  if (width <= 0) return null;

  const pad = 2;
  const r = 4;

  return (
    <path
      d={roundedRect(x, y + pad, width, height - pad * 2, 0, r, r, 0)}
      fill="var(--muted-foreground)"
    />
  );
};

type CategoryTooltipProps = {
  active?: boolean;
  payload?: Array<{ payload: ChartEntry }>;
};

const CategoryTooltip = ({ active, payload }: CategoryTooltipProps) => {
  if (!active || !payload?.length) return null;
  const entry = payload[0].payload;

  return (
    <div className="border-border/50 bg-background grid min-w-36 items-start gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs shadow-xl">
      <p className="font-medium">{entry.categoryName}</p>
      <div className="grid gap-1">
        <div className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground">Spent</span>
          <span className="font-mono font-medium tabular-nums">
            {formatCurrency(entry.spent, "BRL")}
          </span>
        </div>
        {entry.limit != null && (
          <div className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground">Limit</span>
            <span className="font-mono font-medium tabular-nums">
              {formatCurrency(entry.limit, "BRL")}
            </span>
          </div>
        )}
        {entry.limit != null && entry.remaining != null && (
          <div className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground">Remaining</span>
            <span
              className={cn(
                "font-mono font-medium tabular-nums",
                entry.status === "over" && "text-destructive",
              )}
            >
              {formatCurrency(entry.remaining, "BRL")}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

const chartConfig: ChartConfig = {
  spentBar: { label: "Spent" },
  remainingBar: { label: "Remaining" },
};

export const CategorySpendingChart = ({ data }: CategorySpendingChartProps) => {
  const [expandedIds, setExpandedIds] = useState<ReadonlySet<number>>(
    () => new Set(),
  );

  const chartData = useMemo<ChartEntry[]>(
    () =>
      data.flatMap((root) => {
        const hasChildren = root.children.length > 0;
        const expanded = hasChildren && expandedIds.has(root.categoryId);
        const marker = hasChildren ? (expanded ? "▾ " : "▸ ") : "";
        const rootEntry = toEntry(root, `${marker}${root.categoryName}`, hasChildren);
        if (!expanded) return [rootEntry];
        return [
          rootEntry,
          ...root.children.map((child) =>
            toEntry(child, `↳ ${child.categoryName}`, false),
          ),
        ];
      }),
    [data, expandedIds],
  );

  const toggleRoot = (index: number | undefined) => {
    const entry = index != null ? chartData[index] : undefined;
    if (!entry?.hasChildren) return;
    setExpandedIds((current) => {
      const next = new Set(current);
      if (next.has(entry.categoryId)) next.delete(entry.categoryId);
      else next.add(entry.categoryId);
      return next;
    });
  };

  const chartHeight = Math.max(280, chartData.length * 48);
  const labelWidth = Math.min(
    LABEL_MAX_WIDTH,
    Math.max(...chartData.map((entry) => entry.label.length)) *
      LABEL_CHAR_WIDTH +
      12,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending by Category</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-muted-foreground flex h-32 items-center justify-center text-sm">
            No categorized expenses for this period.
          </p>
        ) : (
          <ChartContainer
            config={chartConfig}
            style={{ height: chartHeight }}
            className="w-full"
          >
            <BarChart
              data={chartData}
              layout="vertical"
              barSize={18}
              onClick={(state) => toggleRoot(state?.activeTooltipIndex)}
              className={cn(
                chartData.some((entry) => entry.hasChildren) &&
                  "[&_.recharts-surface]:cursor-pointer",
              )}
            >
              <XAxis
                type="number"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11 }}
                tickFormatter={(v: number) =>
                  formatCurrency(v, "BRL").replace("R$\u00a0", "R$ ")
                }
              />
              <YAxis
                type="category"
                dataKey="label"
                width={labelWidth}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
              />
              <ChartTooltip content={<CategoryTooltip />} />
              <Bar
                dataKey="spentBar"
                stackId="a"
                shape={(props: SpentBarShapeProps) => (
                  <SpentBarShape {...props} />
                )}
              />
              <Bar
                dataKey="remainingBar"
                stackId="a"
                shape={(props: BarShapeBaseProps) => (
                  <RemainingBarShape {...props} />
                )}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};
