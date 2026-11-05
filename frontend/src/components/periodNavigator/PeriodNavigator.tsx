import { Button } from "@/components/button/base/Button";
import { Calendar } from "@/components/calendar/base/Calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/dropdown/base/Dropdown";
import { Popover, PopoverContent } from "@/components/popover/base/Popover";
import { Text } from "@/components/typography/base/Text";
import { isSameDay, parseISO } from "date-fns";
import { dayPickerLocale, toIsoDate } from "@/utils/dates";
import {
  CalendarRangeIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
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
  onRangeChange: (range: CustomRange) => void;
};

function toCustom(range: PeriodRange): CustomRange {
  return {
    from: range.startDate,
    to: range.endDate,
  };
}

/**
 * "‹ October 2026 ›" plus a Range menu. The arrows step the period by
 * its own length and always produce an absolute range; presets set the period.
 * The label opens the same range calendar as Custom…, so a custom range is one tap away.
 */
export function PeriodNavigator({
  range,
  period,
  isCustom,
  onPresetChange,
  onRangeChange,
}: PeriodNavigatorProps) {
  const { t } = useTranslation();

  const anchorRef = useRef<HTMLDivElement>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [draft, setDraft] = useState<DateRange | undefined>();

  const label = periodLabel(range);

  function openCalendar() {
    setDraft({ from: parseISO(range.startDate), to: parseISO(range.endDate) });
    setIsCalendarOpen(true);
  }

  function handleSelect(next: DateRange | undefined) {
    setDraft(next);
    if (next?.from && next.to && !isSameDay(next.from, next.to)) {
      onRangeChange({
        from: toIsoDate(next.from),
        to: toIsoDate(next.to),
      });
      setIsCalendarOpen(false);
    }
  }

  return (
    <div ref={anchorRef} className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        aria-label={t("components.periodNavigator.previousPeriod")}
        onClick={() => onRangeChange(toCustom(shiftRange(range, -1)))}
      >
        <ChevronLeftIcon />
      </Button>
      <Button
        variant="ghost"
        className="min-w-36 tabular-nums sm:min-w-40"
        aria-label={t("components.periodNavigator.choosePeriod", { period: label })}
        onClick={openCalendar}
      >
        <Text variant="title" aria-live="polite">
          {label}
        </Text>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        aria-label={t("components.periodNavigator.nextPeriod")}
        onClick={() => onRangeChange(toCustom(shiftRange(range, 1)))}
      >
        <ChevronRightIcon />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="outline" size="sm" className="ml-1 gap-1">
              {t("components.periodNavigator.range")}
              <ChevronDownIcon className="text-muted-foreground" />
            </Button>
          }
        />
        <DropdownMenuContent className="min-w-44" align="end">
          <DropdownMenuRadioGroup
            value={isCustom ? "" : period}
            onValueChange={(value) => {
              const preset = PERIODS.find((p) => p === value);
              if (preset) onPresetChange(preset);
            }}
          >
            {PERIODS.map((preset) => (
              <DropdownMenuRadioItem key={preset} value={preset}>
                {t(PRESET_LABEL_KEYS[preset])}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={openCalendar}>
            <CalendarRangeIcon />
            {t("components.periodNavigator.custom")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <PopoverContent
          className="w-auto p-0"
          align="start"
          anchor={anchorRef}
          aria-label={t("components.periodNavigator.chooseAPeriod")}
        >
          <Calendar
            mode="range"
            locale={dayPickerLocale()}
            resetOnSelect
            selected={draft}
            defaultMonth={draft?.from}
            captionLayout="dropdown"
            numberOfMonths={1}
            autoFocus
            onSelect={handleSelect}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
