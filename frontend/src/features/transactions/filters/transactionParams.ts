import type {
  TransactionSortBy,
  TransactionType,
  PagedTransactionsFilter,
} from "@/api/dtos/transaction";
import {
  PERIOD_PARAM_KEYS,
  parsePeriodParams,
  serializePeriodParams,
  type PeriodSelection,
} from "@/utils/periodParams";
import { parseId } from "@/utils/searchParams";

export type SortDirection = "asc" | "desc";

export type TransactionFilters = {
  /** Never carries the dates: the period is kept apart and resolved into them when the list is queried. */
  filter: PagedTransactionsFilter;
  period: PeriodSelection;
  sort: { by: TransactionSortBy; direction: SortDirection } | null;
  size: number;
};

export const DEFAULT_PAGE_SIZE = 10;

/** Every query param the Transactions screen owns; its filters gate keeps exactly these. */
export const TRANSACTION_PARAM_KEYS = [
  "type",
  "category",
  "member",
  ...PERIOD_PARAM_KEYS,
  "min",
  "max",
  "q",
  "sort",
  "size",
] as const;

const TYPES: readonly TransactionType[] = ["CREDIT", "DEBIT"];
const SORT_FIELDS: readonly TransactionSortBy[] = [
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
  const filter: PagedTransactionsFilter = {};

  const type = TYPES.find((t) => t === params.get("type"));
  if (type) filter.type = type;
  const categoryId = parseId(params.get("category"));
  if (categoryId != null) filter.categoryId = categoryId;
  const memberId = parseId(params.get("member"));
  if (memberId != null) filter.memberId = memberId;
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

  return { filter, period: parsePeriodParams(params), sort: parseSort(params.get("sort")), size };
}

export function serializeTransactionFilters(
  filters: TransactionFilters,
): Record<string, string> {
  const { filter, period, sort, size } = filters;
  const out: Record<string, string> = serializePeriodParams(period);
  if (filter.type) out.type = filter.type;
  if (filter.categoryId != null) out.category = String(filter.categoryId);
  if (filter.memberId != null) out.member = String(filter.memberId);
  if (filter.amountMin != null) out.min = String(filter.amountMin);
  if (filter.amountMax != null) out.max = String(filter.amountMax);
  if (filter.description) out.q = filter.description;
  if (sort) out.sort = `${sort.by}.${sort.direction}`;
  if (size !== DEFAULT_PAGE_SIZE) out.size = String(size);
  return out;
}
