import { Button } from "@/components/button/Button";
import { DateRangePicker } from "@/components/input/DatePicker";
import { cn } from "@/lib/mergeClasses";
import { format, parseISO } from "date-fns";
import { useMemo } from "react";
import type { DateRange } from "react-day-picker";
import type { Period } from "../filters/homeFilterParams";

const PERIOD_LABELS: Record<Period, string> = {
  "this-month": "This month",
  "last-3m": "Last 3M",
  "last-6m": "Last 6M",
  "this-year": "This year",
};

type CustomRange = { from: string; to: string } | null;

type PeriodPickerProps = {
  period: Period;
  customRange: CustomRange;
  onPeriodChange: (period: Period) => void;
  onCustomRangeChange: (range: CustomRange) => void;
};

/** Preset period buttons plus a custom range; a custom range wins over the preset. */
export const PeriodPicker = ({
  period,
  customRange,
  onPeriodChange,
  onCustomRangeChange,
}: PeriodPickerProps) => {
  const isCustomActive = customRange != null;
  const customFrom = customRange?.from;
  const customTo = customRange?.to;
  const pickerRange = useMemo<DateRange | undefined>(
    () =>
      customFrom && customTo
        ? { from: parseISO(customFrom), to: parseISO(customTo) }
        : undefined,
    [customFrom, customTo],
  );

  const handleCustomRangeChange = (range: DateRange | undefined) => {
    const from = range?.from;
    const to = range?.to ?? from;
    onCustomRangeChange(
      from && to
        ? { from: format(from, "yyyy-MM-dd"), to: format(to, "yyyy-MM-dd") }
        : null,
    );
  };

  return (
    <>
      {(Object.keys(PERIOD_LABELS) as Period[]).map((p) => (
        <Button
          key={p}
          variant={period === p && !isCustomActive ? "default" : "outline"}
          onClick={() => onPeriodChange(p)}
        >
          {PERIOD_LABELS[p]}
        </Button>
      ))}
      <DateRangePicker
        value={pickerRange}
        onChange={handleCustomRangeChange}
        placeholder="Custom period"
        className={cn(isCustomActive && "border-primary")}
      />
    </>
  );
};
