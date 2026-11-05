import { format, parse } from "date-fns";
import { enUS, ptBR } from "date-fns/locale";
import type { Locale } from "date-fns";
import { enUS as dayPickerEnUS, ptBR as dayPickerPtBR } from "react-day-picker/locale";
import { i18n } from "@/i18n/i18n";
import type { Language } from "@/i18n/languages";

/**
 * The one place that formats a date for display. The words (months, weekdays) follow the language in
 * use; the numeric layout (day/month order, separator) follows the language, or, for a language that
 * names no region (`en`), the device's region: an English reader in Brazil reads 04/11/2026, one in
 * the United States 11/04/2026.
 */

const DATE_LOCALES: Record<Language, Locale> = { en: enUS, "pt-BR": ptBR };

export function dateFnsLocale(language: string = i18n.language): Locale {
  return language === "pt-BR" ? DATE_LOCALES["pt-BR"] : DATE_LOCALES.en;
}

/** The calendar's locale: the date-fns one plus DayPicker's own screen-reader labels ("Go to the next month"). */
export function dayPickerLocale(language: string = i18n.language) {
  return language === "pt-BR" ? dayPickerPtBR : dayPickerEnUS;
}

// `Intl` has no data for a language-and-region pair like en-BR and falls back to plain `en`, so the
// device's region is resolved to the locale the region itself writes dates in (BR → pt-BR, US → en-US).
function layoutLocale(): Intl.Locale {
  const language = new Intl.Locale(i18n.language);
  if (language.region !== undefined) return language;
  const region = new Intl.Locale(navigator.language).maximize().region;
  if (region === undefined) return language;
  // Without the script: ICU resolves en-Latn-GB to plain `en` and loses the British layout.
  const regional = new Intl.Locale(`und-${region}`).maximize();
  return new Intl.Locale(`${regional.language}-${region}`);
}

// A stored date is a calendar day: reading it in the viewer's time zone would move it a day.
export function toLocalDate(date: Date | string): Date {
  if (typeof date !== "string") return date;
  const [year, month, day] = date.split("T")[0].split("-").map(Number);
  return new Date(year, month - 1, day);
}

/** The wire format the API reads and writes for a calendar day. */
export function toIsoDate(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

/** "04/11/2026" or "11/04/2026", by the viewer's layout. */
export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat(layoutLocale(), {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(toLocalDate(date));
}

/** "04/11/2026 14:30": the layout of `formatDate`, on a 24-hour clock. */
export function formatDateTime(date: Date): string {
  const time = new Intl.DateTimeFormat(layoutLocale(), {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(date);
  return `${formatDate(date)} ${time}`;
}

/** "11/2026": month and year in numbers, in the viewer's order. */
export function formatMonthYear(date: Date): string {
  return new Intl.DateTimeFormat(layoutLocale(), {
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

/** A date-fns pattern with the month and weekday names of the language in use ("MMMM yyyy", "d MMM"). */
export function formatPattern(date: Date | string, pattern: string): string {
  return format(toLocalDate(date), pattern, { locale: dateFnsLocale() });
}

const SAMPLE_DAY = new Date(2026, 10, 24);

function layoutParts(): Intl.DateTimeFormatPart[] {
  return new Intl.DateTimeFormat(layoutLocale(), {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).formatToParts(SAMPLE_DAY);
}

function layoutAs(tokens: {
  day: string;
  month: string;
  year: string;
}): string {
  return layoutParts()
    .map((part) =>
      part.type === "day" || part.type === "month" || part.type === "year"
        ? tokens[part.type]
        : part.value,
    )
    .join("");
}

/** The hint for a date field, in the viewer's order and language: "dd/mm/yyyy", "mm/dd/yyyy" or "dd/mm/aaaa". */
export function datePlaceholder(): string {
  return layoutAs({ day: "dd", month: "mm", year: i18n.t("common.yearPlaceholder") });
}

/** Reads what a viewer typed in the layout `formatDate` writes; an invalid date is `Invalid Date`. */
export function parseDate(
  text: string,
  pattern = layoutAs({ day: "dd", month: "MM", year: "yyyy" }),
): Date {
  return parse(text, pattern, new Date());
}
