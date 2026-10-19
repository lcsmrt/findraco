import { Badge } from "@/components/badge/base/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card/base/Card";
import { Text } from "@/components/typography/base/Text";
import { cn } from "@/lib/mergeClasses";
import { formatMoney } from "@/utils/money";
import { getFirstName } from "@/utils/string/formatters";
import { ChevronRightIcon, TriangleAlertIcon, TriangleIcon } from "lucide-react";
import { useState } from "react";
import { MemberDot } from "@/components/memberDot/MemberDot";
import type {
  Bar,
  MemberAmount,
  MemberSubRow,
  SpendingRow,
  SpendingRowsView,
  Usage,
} from "./spendingRows";

const OVERFLOW_HATCH =
  "repeating-linear-gradient(135deg, color-mix(in srgb, var(--destructive) 75%, transparent) 0 3px, transparent 3px 6px)";

type UsageBarProps = {
  bar: Bar;
  className?: string;
};

/** Member-coloured segments; when over, a tick at the limit and the overflow hatched in red (UX-03 AC 5). */
function UsageBar({ bar, className }: UsageBarProps) {
  return (
    <div className={cn("bg-muted relative h-2 w-full rounded-full", className)}>
      <div className="flex h-full gap-0.5 overflow-hidden rounded-full">
        {bar.segments.map((segment) => (
          <div
            key={segment.memberId}
            className={cn(
              "h-full shrink-0 transition-opacity first:rounded-l-full last:rounded-r-full",
              segment.dimmed && "opacity-25",
            )}
            style={{ width: `${segment.widthPct}%`, backgroundColor: segment.color }}
          />
        ))}
      </div>
      {bar.limitTickPct != null && (
        <>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 rounded-r-full"
            style={{ left: `${bar.limitTickPct}%`, backgroundImage: OVERFLOW_HATCH }}
          />
          <div
            aria-hidden
            className="bg-foreground pointer-events-none absolute -top-1 -bottom-1 w-0.5 -translate-x-1/2 rounded-full"
            style={{ left: `${bar.limitTickPct}%` }}
          />
        </>
      )}
    </div>
  );
}

type StatusTextProps = {
  usage: Usage;
  className?: string;
};

/** ok "remaining X" muted, warning "⚠ remaining X" amber, over "▲ over by X" red (UX-03 AC 4). */
function StatusText({ usage, className }: StatusTextProps) {
  if (usage.status === "none") return null;
  return (
    <Text
      variant="caption"
      className={cn(
        "inline-flex items-center gap-1 whitespace-nowrap tabular-nums",
        usage.status === "warning" && "text-warning",
        usage.status === "over" && "text-destructive",
        className,
      )}
    >
      {usage.status === "warning" && <TriangleAlertIcon className="size-3.5" />}
      {usage.status === "over" && <TriangleIcon className="size-3 fill-current" />}
      {usage.status === "over"
        ? `over by ${formatMoney(usage.overBy ?? 0)}`
        : `remaining ${formatMoney(usage.remaining ?? 0)}`}
      <span className="text-muted-foreground">· {usage.percent}%</span>
    </Text>
  );
}

type AmountProps = {
  spent: number;
  limit: number | null;
  /** A member sub-row's smaller figures, in normal weight. */
  compact?: boolean;
  className?: string;
};

function Amount({ spent, limit, compact = false, className }: AmountProps) {
  return (
    <span className={cn("whitespace-nowrap tabular-nums", className)}>
      <Text variant={compact ? "caption" : "label"} className={cn(compact && "text-foreground")}>
        {formatMoney(spent)}
      </Text>
      {limit != null && (
        <Text variant={compact ? "caption" : "secondary"}> of {formatMoney(limit)}</Text>
      )}
    </span>
  );
}

type MemberLineProps = {
  members: MemberAmount[];
};

/** "● Lucas R$ 1.051 · ● Livia R$ 694" (UX-04 AC 3). */
function MemberLine({ members }: MemberLineProps) {
  return (
    <Text variant="caption" className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-0.5">
      {members.map((member) => (
        <span
          key={member.memberId}
          className={cn(
            "inline-flex max-w-full min-w-0 items-center gap-1.5 whitespace-nowrap tabular-nums",
            member.dimmed && "opacity-50",
          )}
        >
          <MemberDot color={member.color} />
          <span className="min-w-0 truncate" title={member.name}>
            {getFirstName(member.name)}
          </span>
          <span className="shrink-0">{formatMoney(member.amount)}</span>
        </span>
      ))}
    </Text>
  );
}

type RowBodyProps = {
  row: SpendingRow;
};

/** The text and bar lines shared by roots and children. */
function RowDetails({ row }: RowBodyProps) {
  const detail = row.focus ? (
    <Text variant="caption" className="inline-flex min-w-0 items-center gap-1.5 tabular-nums">
      <MemberDot color={row.focus.color} />
      <span className="min-w-0">
        {getFirstName(row.focus.name)} {formatMoney(row.focus.spent)} of {formatMoney(row.focus.of)}
        {row.focus.sharedLimit != null && ` · shared limit ${formatMoney(row.focus.sharedLimit)}`}
      </span>
    </Text>
  ) : (
    row.memberLine.length > 0 && <MemberLine members={row.memberLine} />
  );

  return (
    <>
      {row.bar && <UsageBar bar={row.bar} className={cn(row.depth === 1 && "h-1.5")} />}
      {(detail || row.status !== "none") && (
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
          {detail || <span />}
          <StatusText usage={row} className="ml-auto" />
        </div>
      )}
    </>
  );
}

type RowHeaderProps = {
  row: SpendingRow;
  expandable: boolean;
  expanded: boolean;
};

function RowHeader({ row, expandable, expanded }: RowHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-0.5">
      <span className="flex min-w-0 items-center gap-1.5">
        {row.depth === 0 && (
          <ChevronRightIcon
            aria-hidden
            className={cn(
              "text-muted-foreground size-4 shrink-0 transition-transform",
              expanded && "rotate-90",
              !expandable && "invisible",
            )}
          />
        )}
        <Text variant={row.depth === 0 ? "title" : "body"} className="break-words">
          {row.name}
        </Text>
        {row.owner && (
          <Badge
            variant="outline"
            className={cn(!row.owner.active && "text-muted-foreground opacity-70")}
          >
            <MemberDot color={row.owner.color} className="size-1.5" />
            <span title={row.owner.name}>{getFirstName(row.owner.name)}</span>
            {!row.owner.active && " (former member)"}
          </Badge>
        )}
      </span>
      <Amount spent={row.spent} limit={row.limit} className="ml-auto" />
    </div>
  );
}

type SubRowProps = {
  sub: MemberSubRow;
};

/** One member's spend against their own limit, always visible (UX-04 AC 4). */
function SubRow({ sub }: SubRowProps) {
  return (
    <div className={cn("flex flex-col gap-1", !sub.active && "opacity-60")}>
      <div className="flex items-center justify-between gap-3">
        <span className="flex min-w-0 items-center gap-1.5">
          <MemberDot color={sub.color} />
          <Text variant="caption" className="text-foreground truncate" title={sub.name}>
            {getFirstName(sub.name)}
            {!sub.active && <span className="text-muted-foreground"> (former member)</span>}
          </Text>
        </span>
        <span className="flex items-center gap-3">
          <StatusText usage={sub} className="hidden sm:inline-flex" />
          <Amount spent={sub.spent} limit={sub.limit} compact />
        </span>
      </div>
      {sub.bar && <UsageBar bar={sub.bar} className="h-1" />}
      <StatusText usage={sub} className="self-end sm:hidden" />
    </div>
  );
}

type SubRowsProps = {
  rows: MemberSubRow[];
};

function SubRows({ rows }: SubRowsProps) {
  return rows.length > 0 && (
    <div className="border-border ml-2 flex flex-col gap-2.5 border-l-2 pl-4">
      {rows.map((sub) => (
        <SubRow key={sub.memberId} sub={sub} />
      ))}
    </div>
  );
}

type RootRowProps = {
  row: SpendingRow;
  expanded: boolean;
  onToggle: () => void;
};

function RootRow({ row, expanded, onToggle }: RootRowProps) {
  const expandable = row.children.length > 0;
  const body = (
    <>
      <RowHeader row={row} expandable={expandable} expanded={expanded} />
      <RowDetails row={row} />
    </>
  );

  return (
    <li className="flex flex-col gap-2.5 py-3.5 first:pt-0 last:pb-0">
      {expandable ? (
        <button
          type="button"
          aria-expanded={expanded}
          onClick={onToggle}
          className="hover:bg-muted/60 focus-visible:ring-ring/50 -mx-2 flex flex-col gap-2 rounded-lg px-2 py-1.5 text-left transition-colors outline-none focus-visible:ring-[3px]"
        >
          {body}
        </button>
      ) : (
        <div className="flex flex-col gap-2 py-1.5">{body}</div>
      )}
      <SubRows rows={row.memberSubRows} />
      {expandable && expanded && (
        <ul className="border-border ml-2 flex flex-col gap-3 border-l-2 pl-4">
          {row.children.map((child) => (
            <li key={child.categoryId} className="flex flex-col gap-2">
              <div className="flex flex-col gap-1.5">
                <RowHeader row={child} expandable={false} expanded={false} />
                <RowDetails row={child} />
              </div>
              <SubRows rows={child.memberSubRows} />
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

type CategorySpendingListProps = {
  view: SpendingRowsView;
  className?: string;
};

/**
 * Expense categories as a list with usage bars (UX-03): click anywhere on a root to
 * toggle its children; roots with a child in trouble start open.
 */
export function CategorySpendingList({ view, className }: CategorySpendingListProps) {
  // Manual toggles last until leaving the page; the defaults apply on first render.
  const [expanded, setExpanded] = useState(() => new Set(view.defaultExpandedIds));

  function toggle(categoryId: number) {
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(categoryId)) next.delete(categoryId);
      else next.add(categoryId);
      return next;
    });
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Spending by category</CardTitle>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        {view.rows.length === 0 ? (
          <Text as="p" variant="secondary" className="flex h-32 items-center justify-center">
            No expense categories yet.
          </Text>
        ) : (
          <ul className="divide-border flex flex-col divide-y">
            {view.rows.map((row) => (
              <RootRow
                key={row.categoryId}
                row={row}
                expanded={expanded.has(row.categoryId)}
                onToggle={() => toggle(row.categoryId)}
              />
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
