import { Button } from "@/components/button/base/Button";
import { Calendar } from "@/components/calendar/base/Calendar";
import { Popover, PopoverContent } from "@/components/popover/base/Popover";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/sheet/base/Drawer";
import { Toggle } from "@/components/toggle/base/Toggle";
import { Text } from "@/components/typography/base/Text";
import { useIsNarrowScreen } from "@/hooks/useIsNarrowScreen";
import { isSameDay, parseISO } from "date-fns";
import { dayPickerLocale, toIsoDate } from "@/utils/dates";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useRef, useState } from "react";
import type { DateRange } from "react-day-picker";
import { PERIODS, periodLabel, shiftRange, type Period, type PeriodRange } from "@/utils/period";
import { useTranslation } from "react-i18next";
import type { ParseKeys } from "i18next";

const PRESET_LABEL_KEYS = {
  "this-month": "components.periodNavigator.thisMonth",
  "last-3m": "components.periodNavigator.last3Months",
  "last-6m": "components.periodNavigator.last6Months",
  "this-year": "components.periodNavigator.thisYear",
} as const satisfies Record<Period, ParseKeys>;

type CustomRange = { from: string; to: string };

type PeriodNavigatorProps = {
  /** The resolved dates of the current selection. */
  range: PeriodRange;
  period: Period;
  /** Whether the selection is an absolute range rather than a preset. */
  isCustom: boolean;
  onPresetChange: (period: Period) => void;
  /** A range picked in the calendar. */
  onRangeChange: (range: CustomRange) => void;
  /** The range an arrow stepped to; the caller may recognise it as a preset. */
  onStep: (range: CustomRange) => void;
};

function toCustom(range: PeriodRange): CustomRange {
  return {
    from: range.startDate,
    to: range.endDate,
  };
}

type PeriodPanelProps = {
  period: Period;
  isCustom: boolean;
  draft: DateRange | undefined;
  onPresetSelect: (period: Period) => void;
  onRangeSelect: (range: DateRange | undefined) => void;
};

/** What the panel holds in both of its containers: the presets above the range calendar. */
function PeriodPanel({ period, isCustom, draft, onPresetSelect, onRangeSelect }: PeriodPanelProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-1 pb-2">
      <div className="flex flex-wrap gap-1.5 px-3 pt-3">
        {PERIODS.map((preset) => (
          <Toggle
            key={preset}
            variant="chip"
            pressed={!isCustom && period === preset}
            // A preset is applied whether or not it is already the current one.
            onPressedChange={() => onPresetSelect(preset)}
          >
            {t(PRESET_LABEL_KEYS[preset])}
          </Toggle>
        ))}
      </div>
      <Calendar
        mode="range"
        locale={dayPickerLocale()}
        resetOnSelect
        selected={draft}
        defaultMonth={draft?.from}
        captionLayout="dropdown"
        numberOfMonths={1}
        className="mx-auto max-sm:[--cell-size:--spacing(10)]"
        autoFocus
        onSelect={onRangeSelect}
      />
    </div>
  );
}

/**
 * "‹ October 2026 ›". The arrows step the period by its own length and report the range they
 * land on. The label opens one panel with the presets and the range calendar: a popover from `sm`,
 * a bottom sheet on a phone. Below `sm` the control spans the content width so the row has no ragged end.
 */
export function PeriodNavigator({
  range,
  period,
  isCustom,
  onPresetChange,
  onRangeChange,
  onStep,
}: PeriodNavigatorProps) {
  const { t } = useTranslation();

  const anchorRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState<DateRange | undefined>();
  const isNarrow = useIsNarrowScreen();

  const label = periodLabel(range);
  const title = t("components.periodNavigator.chooseAPeriod");

  function openPanel() {
    setDraft({ from: parseISO(range.startDate), to: parseISO(range.endDate) });
    setIsOpen(true);
  }

  function handlePresetSelect(next: Period) {
    onPresetChange(next);
    setIsOpen(false);
  }

  function handleRangeSelect(next: DateRange | undefined) {
    setDraft(next);
    if (next?.from && next.to && !isSameDay(next.from, next.to)) {
      onRangeChange({
        from: toIsoDate(next.from),
        to: toIsoDate(next.to),
      });
      setIsOpen(false);
    }
  }

  const panel = (
    <PeriodPanel
      period={period}
      isCustom={isCustom}
      draft={draft}
      onPresetSelect={handlePresetSelect}
      onRangeSelect={handleRangeSelect}
    />
  );

  return (
    <div ref={anchorRef} className="flex w-full items-center gap-1 sm:w-fit">
      <Button
        variant="ghost"
        size="icon"
        aria-label={t("components.periodNavigator.previousPeriod")}
        onClick={() => onStep(toCustom(shiftRange(range, -1)))}
      >
        <ChevronLeftIcon />
      </Button>
      <Button
        variant="ghost"
        className="min-w-36 flex-1 tabular-nums sm:min-w-40 sm:flex-none"
        aria-label={t("components.periodNavigator.choosePeriod", { period: label })}
        onClick={openPanel}
      >
        <Text variant="title" aria-live="polite">
          {label}
        </Text>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        aria-label={t("components.periodNavigator.nextPeriod")}
        onClick={() => onStep(toCustom(shiftRange(range, 1)))}
      >
        <ChevronRightIcon />
      </Button>

      {isNarrow ? (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>{title}</DrawerTitle>
            </DrawerHeader>
            {panel}
          </DrawerContent>
        </Drawer>
      ) : (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverContent className="w-auto p-0" align="start" anchor={anchorRef} aria-label={title}>
            {panel}
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
