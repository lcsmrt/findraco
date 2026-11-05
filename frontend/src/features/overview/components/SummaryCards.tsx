import { Card, CardContent } from "@/components/card/base/Card";
import { Text } from "@/components/typography/base/Text";
import { cn } from "@/lib/mergeClasses";
import { formatMoney } from "@/utils/money";
import { getFirstName } from "@/utils/string/formatters";
import { MemberDot } from "@/components/memberDot/MemberDot";
import type { SummaryFigure, SummaryView } from "../utils/summaryView";
import { useTranslation } from "react-i18next";

type MemberBarProps = {
  figure: SummaryFigure;
};

function MemberBar({ figure }: MemberBarProps) {
  return (
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
}

type MemberAmountsProps = {
  figure: SummaryFigure;
  className?: string;
};

/** "● Lucas R$ 2.733 · ● Livia R$ 2.414". */
function MemberAmounts({ figure, className }: MemberAmountsProps) {
  return (
    figure.segments.length > 0 && (
      <Text
        as="div"
        variant="caption"
        className={cn("flex flex-wrap gap-x-3 gap-y-0.5", className)}
      >
        {figure.segments.map((segment) => (
          // Only the dot fades for the other members: faded text would fall below readable contrast.
          <span
            key={segment.memberId}
            className="inline-flex max-w-full min-w-0 items-center gap-1.5 whitespace-nowrap tabular-nums"
          >
            <MemberDot color={segment.color} className={cn(segment.dimmed && "opacity-25")} />
            <span className="min-w-0 truncate" title={segment.name}>
              {getFirstName(segment.name)}
            </span>
            <span className="shrink-0">{formatMoney(segment.amount)}</span>
          </span>
        ))}
      </Text>
    )
  );
}

type StatusCaptionProps = {
  forecast: number;
};

/** Says what the headline figure is: the actual one, beside the forecast. */
function StatusCaption({ forecast }: StatusCaptionProps) {
  const { t } = useTranslation();

  return (
    <Text as="p" variant="caption" className="tabular-nums">
      {t("overview.summaryCards.actualAndForecast", { amount: formatMoney(forecast) })}
    </Text>
  );
}

type FigureBlockProps = {
  label: string;
  figure: SummaryFigure;
  tone: "income" | "expense";
  size: "sm" | "lg";
};

function FigureBlock({ label, figure, tone, size }: FigureBlockProps) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <Text as="p" variant="secondary">
        {label}
      </Text>
      <Text
        as="p"
        variant={size === "lg" ? "headline" : "title"}
        className={cn("tabular-nums", tone === "income" ? "text-success" : "text-destructive")}
      >
        {formatMoney(figure.actual)}
      </Text>
      <StatusCaption forecast={figure.total} />
      <MemberBar figure={figure} />
      <MemberAmounts
        figure={figure}
        className={cn(size === "sm" && "flex-col items-start gap-y-1")}
      />
    </div>
  );
}

type BalanceProps = {
  balance: number;
  actual: number;
};

function Balance({ balance, actual }: BalanceProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-2">
      <Text as="p" variant="secondary">
        {t("overview.balance.balance")}
      </Text>
      <Text
        as="p"
        variant="headline"
        className={cn("tabular-nums", actual >= 0 ? "text-success" : "text-destructive")}
      >
        {formatMoney(actual)}
      </Text>
      <StatusCaption forecast={balance} />
    </div>
  );
}

type SummaryCardsProps = {
  view: SummaryView;
};

/**
 * Income, Expenses and Balance with member segments: one block with
 * Balance on top below `sm`, three cards in a row from `sm`.
 */
export function SummaryCards({ view }: SummaryCardsProps) {
  const { t } = useTranslation();

  return (
    <>
      <Card className="sm:hidden">
        <CardContent className="flex flex-col gap-5 px-4">
          <Balance balance={view.balance} actual={view.balanceActual} />
          <div className="grid grid-cols-2 gap-4">
            <FigureBlock
              label={t("overview.summaryCards.income")}
              figure={view.income}
              tone="income"
              size="sm"
            />
            <FigureBlock
              label={t("overview.summaryCards.expenses")}
              figure={view.expenses}
              tone="expense"
              size="sm"
            />
          </div>
        </CardContent>
      </Card>

      <div className="hidden gap-4 sm:grid sm:grid-cols-3">
        <Card>
          <CardContent>
            <FigureBlock
              label={t("overview.summaryCards.income")}
              figure={view.income}
              tone="income"
              size="lg"
            />
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <FigureBlock
              label={t("overview.summaryCards.expenses")}
              figure={view.expenses}
              tone="expense"
              size="lg"
            />
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Balance balance={view.balance} actual={view.balanceActual} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
