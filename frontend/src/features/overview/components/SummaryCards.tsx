import { Card, CardContent } from "@/components/card/base/Card";
import { Money } from "@/components/money/Money";
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
        variant="secondary"
        className={cn("flex flex-wrap gap-x-3 gap-y-0.5", className)}
      >
        {figure.segments.map((segment) => (
          // Only the dot fades for the other members: faded text would fall below readable contrast.
          <span
            key={segment.memberId}
            className="inline-flex max-w-full min-w-0 items-center gap-1.5 whitespace-nowrap"
          >
            <MemberDot color={segment.color} className={cn(segment.dimmed && "opacity-25")} />
            <span className="min-w-0 truncate" title={segment.name}>
              {getFirstName(segment.name)}
            </span>
            <Money value={segment.amount} className="shrink-0" />
          </span>
        ))}
      </Text>
    )
  );
}

type StatusCaptionProps = {
  forecast: number;
};

/** Names the headline figure as the actual one, then gives the forecast on its own line. */
function StatusCaption({ forecast }: StatusCaptionProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-0.5">
      <Text as="p" variant="caption">
        {t("overview.summaryCards.actual")}
      </Text>
      <Text as="p" variant="secondary" numeric>
        {t("overview.summaryCards.forecast", { amount: formatMoney(forecast) })}
      </Text>
    </div>
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
      <Money as="p" value={figure.actual} tone={tone} variant={size === "lg" ? "headline" : "figure"} />
      <StatusCaption forecast={figure.total} />
      <MemberBar figure={figure} />
      <MemberAmounts
        figure={figure}
        className={cn(size === "sm" && "flex-col items-start gap-y-1")}
      />
    </div>
  );
}

type NeutralLineProps = {
  neutral: NonNullable<SummaryView["neutral"]>;
};

/** What neutral movements moved, below the result and outside it. */
function NeutralLine({ neutral }: NeutralLineProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-0.5">
      <Text as="p" variant="caption">
        {t("overview.summaryCards.neutral")}
      </Text>
      <Text as="p" variant="secondary" numeric>
        {t("overview.summaryCards.neutralAmounts", {
          moneyOut: formatMoney(neutral.out),
          moneyIn: formatMoney(neutral.in),
        })}
      </Text>
    </div>
  );
}

type BalanceProps = {
  balance: number;
  actual: number;
  neutral: SummaryView["neutral"];
};

function Balance({ balance, actual, neutral }: BalanceProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-2">
      <Text as="p" variant="secondary">
        {t("overview.balance.balance")}
      </Text>
      <Money as="p" value={actual} tone="bySign" variant="headline" />
      <StatusCaption forecast={balance} />
      {neutral && <NeutralLine neutral={neutral} />}
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
          <Balance balance={view.balance} actual={view.balanceActual} neutral={view.neutral} />
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
            <Balance balance={view.balance} actual={view.balanceActual} neutral={view.neutral} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
