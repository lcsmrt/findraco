import type {
  FinancialTransactionSortBy,
  FinancialTransactionType,
  PagedFinancialTransactionsFilter,
} from "@/api/dtos/financialTransaction";
import {
  endOfMonth,
  endOfYear,
  format,
  isValid,
  parseISO,
  startOfMonth,
  startOfYear,
  subMonths,
} from "date-fns";

export type Period = "this-month" | "last-3m" | "last-6m" | "this-year";
export type HomeTab = "overview" | "transactions" | "categories";
export type SortDirection = "asc" | "desc";

export type OverviewFilters = {
  period: Period;
  /** Absolute range; when set it takes precedence over `period`. */
  customRange: { from: string; to: string } | null;
  memberId: number | null;
};

export type CategoriesFilters = {
  period: Period;
  /** Absolute range; when set it takes precedence over `period`. */
  customRange: { from: string; to: string } | null;
};

export type TransactionFilters = {
  filter: PagedFinancialTransactionsFilter;
  sort: { by: FinancialTransactionSortBy; direction: SortDirection } | null;
  size: number;
};

export const DEFAULT_PERIOD: Period = "this-month";
export const DEFAULT_TAB: HomeTab = "overview";
export const DEFAULT_PAGE_SIZE = 10;

export const PLAN_PARAM = "plan";
export const TAB_PARAM = "tab";
export const OVERVIEW_PARAM_KEYS = [
  "period",
  "periodFrom",
  "periodTo",
  "overviewMember",
] as const;
export const CATEGORIES_PARAM_KEYS = [
  "categoriesPeriod",
  "categoriesPeriodFrom",
  "categoriesPeriodTo",
] as const;
export const TRANSACTION_PARAM_KEYS = [
  "type",
  "category",
  "member",
  "from",
  "to",
  "min",
  "max",
  "q",
  "sort",
  "size",
] as const;

const TABS: readonly HomeTab[] = ["overview", "transactions", "categories"];
const PERIODS: readonly Period[] = [
  "this-month",
  "last-3m",
  "last-6m",
  "this-year",
];
const TYPES: readonly FinancialTransactionType[] = ["CREDIT", "DEBIT"];
const SORT_FIELDS: readonly FinancialTransactionSortBy[] = [
  "startDate",
  "endDate",
  "amount",
  "description",
  "category",
  "attributedTo",
];

const DATE_FORMAT = "yyyy-MM-dd";
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const parseId = (value: string | null): number | null => {
  if (value == null || !/^\d+$/.test(value)) return null;
  const n = Number(value);
  return Number.isSafeInteger(n) && n > 0 ? n : null;
};

const parseDate = (value: string | null): string | null => {
  if (value == null || !DATE_PATTERN.test(value)) return null;
  return isValid(parseISO(value)) ? value : null;
};

const parseAmount = (value: string | null): number | null => {
  if (value == null || !/^\d+(\.\d+)?$/.test(value)) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
};

const parseSort = (value: string | null): TransactionFilters["sort"] => {
  if (value == null) return null;
  const dot = value.lastIndexOf(".");
  if (dot < 0) return null;
  const by = value.slice(0, dot);
  const direction = value.slice(dot + 1);
  const field = SORT_FIELDS.find((f) => f === by);
  if (!field || (direction !== "asc" && direction !== "desc")) return null;
  return { by: field, direction };
};

export const parsePlanParam = (params: URLSearchParams): number | null =>
  parseId(params.get(PLAN_PARAM));

export const parseTab = (params: URLSearchParams): HomeTab =>
  TABS.find((t) => t === params.get(TAB_PARAM)) ?? DEFAULT_TAB;

export const serializeTab = (tab: HomeTab): Record<string, string> =>
  tab === DEFAULT_TAB ? {} : { [TAB_PARAM]: tab };

export const parseOverviewFilters = (
  params: URLSearchParams,
): OverviewFilters => {
  const memberId = parseId(params.get("overviewMember"));
  const rawPeriod = params.get("period");

  if (rawPeriod === "custom") {
    const from = parseDate(params.get("periodFrom"));
    const to = parseDate(params.get("periodTo"));
    if (from && to && from <= to) {
      return { period: DEFAULT_PERIOD, customRange: { from, to }, memberId };
    }
    return { period: DEFAULT_PERIOD, customRange: null, memberId };
  }

  const period = PERIODS.find((p) => p === rawPeriod) ?? DEFAULT_PERIOD;
  return { period, customRange: null, memberId };
};

export const serializeOverviewFilters = (
  filters: OverviewFilters,
): Record<string, string> => {
  const out: Record<string, string> = {};
  if (filters.customRange) {
    out.period = "custom";
    out.periodFrom = filters.customRange.from;
    out.periodTo = filters.customRange.to;
  } else if (filters.period !== DEFAULT_PERIOD) {
    out.period = filters.period;
  }
  if (filters.memberId != null) out.overviewMember = String(filters.memberId);
  return out;
};

export const parseCategoriesFilters = (
  params: URLSearchParams,
): CategoriesFilters => {
  const rawPeriod = params.get("categoriesPeriod");

  if (rawPeriod === "custom") {
    const from = parseDate(params.get("categoriesPeriodFrom"));
    const to = parseDate(params.get("categoriesPeriodTo"));
    if (from && to && from <= to) {
      return { period: DEFAULT_PERIOD, customRange: { from, to } };
    }
    return { period: DEFAULT_PERIOD, customRange: null };
  }

  const period = PERIODS.find((p) => p === rawPeriod) ?? DEFAULT_PERIOD;
  return { period, customRange: null };
};

export const serializeCategoriesFilters = (
  filters: CategoriesFilters,
): Record<string, string> => {
  if (filters.customRange) {
    return {
      categoriesPeriod: "custom",
      categoriesPeriodFrom: filters.customRange.from,
      categoriesPeriodTo: filters.customRange.to,
    };
  }
  return filters.period !== DEFAULT_PERIOD
    ? { categoriesPeriod: filters.period }
    : {};
};

export const parseTransactionFilters = (
  params: URLSearchParams,
): TransactionFilters => {
  const filter: PagedFinancialTransactionsFilter = {};

  const type = TYPES.find((t) => t === params.get("type"));
  if (type) filter.type = type;
  const categoryId = parseId(params.get("category"));
  if (categoryId != null) filter.categoryId = categoryId;
  const memberId = parseId(params.get("member"));
  if (memberId != null) filter.memberId = memberId;
  const startDateFrom = parseDate(params.get("from"));
  if (startDateFrom) filter.startDateFrom = startDateFrom;
  const startDateTo = parseDate(params.get("to"));
  if (startDateTo) filter.startDateTo = startDateTo;
  const amountMin = parseAmount(params.get("min"));
  if (amountMin != null) filter.amountMin = amountMin;
  const amountMax = parseAmount(params.get("max"));
  if (amountMax != null) filter.amountMax = amountMax;
  const description = params.get("q");
  if (description) filter.description = description;

  const rawSize = params.get("size");
  const size =
    rawSize != null && /^\d+$/.test(rawSize) && Number(rawSize) > 0
      ? Number(rawSize)
      : DEFAULT_PAGE_SIZE;

  return { filter, sort: parseSort(params.get("sort")), size };
};

export const serializeTransactionFilters = (
  filters: TransactionFilters,
): Record<string, string> => {
  const { filter, sort, size } = filters;
  const out: Record<string, string> = {};
  if (filter.type) out.type = filter.type;
  if (filter.categoryId != null) out.category = String(filter.categoryId);
  if (filter.memberId != null) out.member = String(filter.memberId);
  if (filter.startDateFrom) out.from = filter.startDateFrom;
  if (filter.startDateTo) out.to = filter.startDateTo;
  if (filter.amountMin != null) out.min = String(filter.amountMin);
  if (filter.amountMax != null) out.max = String(filter.amountMax);
  if (filter.description) out.q = filter.description;
  if (sort) out.sort = `${sort.by}.${sort.direction}`;
  if (size !== DEFAULT_PAGE_SIZE) out.size = String(size);
  return out;
};

/** Resolves a preset token to an inclusive `yyyy-MM-dd` range relative to `now`. */
export const resolvePeriodDates = (period: Period, now: Date) => {
  const fmt = (d: Date) => format(d, DATE_FORMAT);
  switch (period) {
    case "this-month":
      return {
        startDate: fmt(startOfMonth(now)),
        endDate: fmt(endOfMonth(now)),
      };
    case "last-3m":
      return {
        startDate: fmt(startOfMonth(subMonths(now, 2))),
        endDate: fmt(endOfMonth(now)),
      };
    case "last-6m":
      return {
        startDate: fmt(startOfMonth(subMonths(now, 5))),
        endDate: fmt(endOfMonth(now)),
      };
    case "this-year":
      return { startDate: fmt(startOfYear(now)), endDate: fmt(endOfYear(now)) };
  }
};
