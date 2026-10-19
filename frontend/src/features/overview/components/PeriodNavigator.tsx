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
import { format, isSameDay, parseISO } from "date-fns";
import {
  CalendarRangeIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import { useRef, useState } from "react";
import type { DateRange } from "react-day-picker";
import type { Period } from "../filters/overviewParams";
import { periodLabel, shiftRange, type PeriodRange } from "../utils/periodNavigator";

const PRESET_LABELS: Record<Period, string> = {
  "this-month": "This month",
  "last-3m": "Last 3 months",
  "last-6m": "Last 6 months",
  "this-year": "This year",
};

const PRESETS: readonly Period[] = ["this-month", "last-3m", "last-6m", "this-year"];

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
 * "‹ October 2026 ›" plus a Range menu (UX-05 AC 8–9). The arrows step the period by
 * its own length and always produce an absolute range; presets set the period.
 */
export function PeriodNavigator({
  range,
  period,
  isCustom,
  onPresetChange,
  onRangeChange,
}: PeriodNavigatorProps) {
  const anchorRef = useRef<HTMLDivElement>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [draft, setDraft] = useState<DateRange | undefined>();

  function openCalendar() {
    setDraft({ from: parseISO(range.startDate), to: parseISO(range.endDate) });
    setIsCalendarOpen(true);
  }

  function handleSelect(next: DateRange | undefined) {
    setDraft(next);
    if (next?.from && next.to && !isSameDay(next.from, next.to)) {
      onRangeChange({
        from: format(next.from, "yyyy-MM-dd"),
        to: format(next.to, "yyyy-MM-dd"),
      });
      setIsCalendarOpen(false);
    }
  }

  return (
    <div ref={anchorRef} className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        aria-label="Previous period"
        onClick={() => onRangeChange(toCustom(shiftRange(range, -1)))}
      >
        <ChevronLeftIcon />
      </Button>
      <Text
        variant="title"
        className="min-w-36 text-center tabular-nums sm:min-w-40"
        aria-live="polite"
      >
        {periodLabel(range)}
      </Text>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Next period"
        onClick={() => onRangeChange(toCustom(shiftRange(range, 1)))}
      >
        <ChevronRightIcon />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="outline" size="sm" className="ml-1 gap-1">
              Range
              <ChevronDownIcon className="text-muted-foreground" />
            </Button>
          }
        />
        <DropdownMenuContent className="min-w-44" align="end">
          <DropdownMenuRadioGroup
            value={isCustom ? "" : period}
            onValueChange={(value) => {
              const preset = PRESETS.find((p) => p === value);
              if (preset) onPresetChange(preset);
            }}
          >
            {PRESETS.map((preset) => (
              <DropdownMenuRadioItem key={preset} value={preset}>
                {PRESET_LABELS[preset]}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={openCalendar}>
            <CalendarRangeIcon />
            Custom…
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <PopoverContent className="w-auto p-0" align="start" anchor={anchorRef}>
          <Calendar
            mode="range"
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
