import type {
  FinancialTransactionSortBy,
  FinancialTransactionType,
  PagedFinancialTransactionsFilter,
} from "@/api/dtos/financialTransaction";
import { parseDate, parseId } from "@/utils/searchParams";

export type SortDirection = "asc" | "desc";

export type TransactionFilters = {
  filter: PagedFinancialTransactionsFilter;
  sort: { by: FinancialTransactionSortBy; direction: SortDirection } | null;
  size: number;
};

export const DEFAULT_PAGE_SIZE = 10;

/** Every query param the Transactions tab owns; the home gate persists exactly these. */
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

const TYPES: readonly FinancialTransactionType[] = ["CREDIT", "DEBIT"];
const SORT_FIELDS: readonly FinancialTransactionSortBy[] = [
  "startDate",
  "endDate",
  "amount",
  "description",
  "category",
  "attributedTo",
];

function parseAmount(value: string | null): number | null {
  if (value == null || !/^\d+(\.\d+)?$/.test(value)) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function parseSort(value: string | null): TransactionFilters["sort"] {
  if (value == null) return null;
  const dot = value.lastIndexOf(".");
  if (dot < 0) return null;
  const by = value.slice(0, dot);
  const direction = value.slice(dot + 1);
  const field = SORT_FIELDS.find((f) => f === by);
  if (!field || (direction !== "asc" && direction !== "desc")) return null;
  return { by: field, direction };
}

export function parseTransactionFilters(
  params: URLSearchParams,
): TransactionFilters {
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
}

export function serializeTransactionFilters(
  filters: TransactionFilters,
): Record<string, string> {
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
}
