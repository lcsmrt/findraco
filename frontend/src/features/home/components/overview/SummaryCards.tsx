import { Card, CardContent } from "@/components/card/Card";
import { cn } from "@/lib/mergeClasses";
import { formatCurrency, getFirstName } from "@/utils/string/formatters";
import { MemberDot } from "./MemberDot";
import type { SummaryFigure, SummaryView } from "./summaryView";

const money = (value: number) => formatCurrency(value, "BRL");

type MemberBarProps = {
  figure: SummaryFigure;
};

const MemberBar = ({ figure }: MemberBarProps) => (
  <div className="bg-muted flex h-1.5 w-full gap-0.5 overflow-hidden rounded-full">
    {figure.segments.map((segment) => (
      <div
        key={segment.memberId}
        className={cn(
          "h-full shrink-0 first:rounded-l-full last:rounded-r-full",
          segment.dimmed && "opacity-25",
        )}
        style={{ width: `${segment.widthPct}%`, backgroundColor: segment.color }}
      />
    ))}
  </div>
);

type MemberAmountsProps = {
  figure: SummaryFigure;
  className?: string;
};

/** "● Lucas R$ 2.733 · ● Livia R$ 2.414" (UX-05 AC 1). */
const MemberAmounts = ({ figure, className }: MemberAmountsProps) =>
  figure.segments.length > 0 && (
    <div className={cn("text-muted-foreground flex flex-wrap gap-x-3 gap-y-0.5 text-xs", className)}>
      {figure.segments.map((segment) => (
        <span
          key={segment.memberId}
          className={cn(
            "inline-flex max-w-full min-w-0 items-center gap-1.5 whitespace-nowrap tabular-nums",
            segment.dimmed && "opacity-50",
          )}
        >
          <MemberDot color={segment.color} />
          <span className="min-w-0 truncate" title={segment.name}>
            {getFirstName(segment.name)}
          </span>
          <span className="shrink-0">{money(segment.amount)}</span>
        </span>
      ))}
    </div>
  );

type FigureBlockProps = {
  label: string;
  figure: SummaryFigure;
  tone: "income" | "expense";
  size: "sm" | "lg";
};

const FigureBlock = ({ label, figure, tone, size }: FigureBlockProps) => (
  <div className="flex min-w-0 flex-col gap-2">
    <p className="text-muted-foreground text-sm font-medium">{label}</p>
    <p
      className={cn(
        "font-bold tabular-nums",
        size === "lg" ? "text-2xl" : "text-lg",
        tone === "income" ? "text-success" : "text-destructive",
      )}
    >
      {money(figure.total)}
    </p>
    <MemberBar figure={figure} />
    <MemberAmounts
      figure={figure}
      className={cn(size === "sm" && "flex-col items-start gap-y-1")}
    />
  </div>
);

type BalanceProps = {
  balance: number;
  size: "sm" | "lg";
};

const Balance = ({ balance, size }: BalanceProps) => (
  <div className="flex flex-col gap-2">
    <p className="text-muted-foreground text-sm font-medium">Balance</p>
    <p
      className={cn(
        "font-bold tabular-nums",
        size === "lg" ? "text-3xl" : "text-2xl",
        balance >= 0 ? "text-success" : "text-destructive",
      )}
    >
      {money(balance)}
    </p>
  </div>
);

type SummaryCardsProps = {
  view: SummaryView;
};

/**
 * Income, Expenses and Balance with member segments (UX-05 AC 1–3): one block with
 * Balance on top below `sm`, three cards in a row from `sm`.
 */
export const SummaryCards = ({ view }: SummaryCardsProps) => (
  <>
    <Card className="sm:hidden">
      <CardContent className="flex flex-col gap-5 px-4">
        <Balance balance={view.balance} size="lg" />
        <div className="grid grid-cols-2 gap-4">
          <FigureBlock label="Income" figure={view.income} tone="income" size="sm" />
          <FigureBlock label="Expenses" figure={view.expenses} tone="expense" size="sm" />
        </div>
      </CardContent>
    </Card>

    <div className="hidden gap-4 sm:grid sm:grid-cols-3">
      <Card>
        <CardContent>
          <FigureBlock label="Income" figure={view.income} tone="income" size="lg" />
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <FigureBlock label="Expenses" figure={view.expenses} tone="expense" size="lg" />
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Balance balance={view.balance} size="sm" />
        </CardContent>
      </Card>
    </div>
  </>
);
