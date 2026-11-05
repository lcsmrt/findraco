import * as React from "react";
import { isValid, isSameDay } from "date-fns";
import { CalendarIcon, XIcon } from "lucide-react";
import type { DateRange, Matcher } from "react-day-picker";
import { Calendar } from "@/components/calendar/base/Calendar";
import { Popover, PopoverContent } from "@/components/popover/base/Popover";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/input/base/InputGroup";
import { cn } from "@/lib/mergeClasses";
import { datePlaceholder, dateFnsLocale, formatDate, parseDate } from "@/utils/dates";

const CURRENT_YEAR = new Date().getFullYear();

export type DatePickerProps = {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  disabledDates?: Matcher | Matcher[];
  fromYear?: number;
  toYear?: number;
  className?: string;
  id?: string;
  /** The text input, so a form can focus the field on a validation error. */
  ref?: React.Ref<HTMLInputElement>;
  onBlur?: () => void;
}

/**
 * Single date picker with an editable text input and a popover calendar.
 * Supports typing in dd/mm/yyyy format or selecting from the calendar.
 */
export function DatePicker({
  value,
  onChange,
  placeholder = datePlaceholder(),
  disabled,
  disabledDates,
  fromYear = 1900,
  toYear = CURRENT_YEAR + 20,
  className,
  id,
  ref,
  onBlur,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(
    value ? formatDate(value) : "",
  );
  const anchorRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setInputValue(value ? formatDate(value) : "");
  }, [value]);

  function commitInput(raw: string) {
    const trimmed = raw.trim();
    if (!trimmed) {
      onChange?.(undefined);
      setInputValue("");
      return;
    }
    const parsed = parseDate(trimmed);
    if (isValid(parsed)) {
      onChange?.(parsed);
      setInputValue(formatDate(parsed));
    } else {
      setInputValue(value ? formatDate(value) : "");
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <InputGroup ref={anchorRef} className={cn("w-44", className)}>
        <InputGroupAddon align="inline-start">
          <InputGroupButton
            size="icon-xs"
            disabled={disabled}
            aria-label="Open calendar"
            onClick={() => !disabled && setOpen((prev) => !prev)}
          >
            <CalendarIcon />
          </InputGroupButton>
        </InputGroupAddon>
        <InputGroupInput
          id={id}
          ref={ref}
          value={inputValue}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setOpen(false)}
          onBlur={(e) => {
            commitInput(e.currentTarget.value);
            onBlur?.();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.currentTarget.blur();
            if (e.key === "Escape")
              setInputValue(value ? formatDate(value) : "");
          }}
        />
        {value && !disabled && (
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              aria-label="Clear date"
              onClick={() => {
                onChange?.(undefined);
                setInputValue("");
              }}
            >
              <XIcon />
            </InputGroupButton>
          </InputGroupAddon>
        )}
      </InputGroup>
      <PopoverContent
        className="w-auto p-0"
        align="start"
        anchor={anchorRef}
        aria-label="Choose a date"
      >
        <Calendar
          mode="single"
          locale={dateFnsLocale()}
          selected={value}
          defaultMonth={value}
          captionLayout="dropdown"
          fromYear={fromYear}
          toYear={toYear}
          disabled={disabledDates}
          autoFocus
          onSelect={(date) => {
            onChange?.(date);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

export type DateRangePickerProps = {
  value?: DateRange;
  onChange?: (range: DateRange | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  disabledDates?: Matcher | Matcher[];
  fromYear?: number;
  toYear?: number;
  numberOfMonths?: number;
  className?: string;
  id?: string;
}

function formatRange(range?: DateRange): string {
  if (!range?.from) return "";
  const from = formatDate(range.from);
  if (!range.to) return from;
  return `${from} – ${formatDate(range.to)}`;
}

/**
 * Date range picker with a two-month calendar and year/month navigation via dropdown.
 * Closes automatically after both dates are selected.
 */
export function DateRangePicker({
  value,
  onChange,
  placeholder = `${datePlaceholder()} – ${datePlaceholder()}`,
  disabled,
  disabledDates,
  fromYear = 1900,
  toYear = CURRENT_YEAR + 20,
  numberOfMonths = 2,
  className,
  id,
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLDivElement>(null);
  const hasValue = !!(value?.from || value?.to);

  function handleSelect(range: DateRange | undefined) {
    onChange?.(range);
    if (range?.from && range?.to && !isSameDay(range.from, range.to)) {
      setOpen(false);
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <InputGroup
        ref={anchorRef}
        className={cn(numberOfMonths === 2 ? "w-68" : "w-44", className)}
      >
        <InputGroupAddon align="inline-start">
          <InputGroupButton
            size="icon-xs"
            disabled={disabled}
            aria-label="Open calendar"
            onClick={() => !disabled && setOpen((prev) => !prev)}
          >
            <CalendarIcon />
          </InputGroupButton>
        </InputGroupAddon>
        <InputGroupInput
          id={id}
          value={formatRange(value)}
          placeholder={placeholder}
          disabled={disabled}
          readOnly
          tabIndex={-1}
          className="cursor-pointer"
          onClick={() => !disabled && setOpen((prev) => !prev)}
        />
        {hasValue && !disabled && (
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              aria-label="Clear range"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                onChange?.(undefined);
              }}
            >
              <XIcon />
            </InputGroupButton>
          </InputGroupAddon>
        )}
      </InputGroup>
      <PopoverContent
        className="w-auto p-0"
        align="start"
        anchor={anchorRef}
        aria-label="Choose a period"
      >
        <Calendar
          mode="range"
          locale={dateFnsLocale()}
          selected={value}
          defaultMonth={value?.from ?? value?.to}
          captionLayout="dropdown"
          fromYear={fromYear}
          toYear={toYear}
          numberOfMonths={numberOfMonths}
          disabled={disabledDates}
          autoFocus
          onSelect={handleSelect}
        />
      </PopoverContent>
    </Popover>
  );
}
