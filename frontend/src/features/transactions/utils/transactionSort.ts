import type {
  Transaction,
  TransactionSortBy,
} from "@/api/dtos/transaction";
import type { Sorting } from "@/components/table/components/TableHeader";
import type { TransactionFilters } from "../filters/transactionParams";

// The table's column ids and the API's sort fields differ (`participants` sorts by `attributedTo`),
// so sorting translates both ways.
const SORTABLE_FIELDS: Record<string, TransactionSortBy> = {
  startDate: "startDate",
  amount: "amount",
  description: "description",
  category: "category",
  participants: "attributedTo",
};
const SORT_COLUMNS: Record<
  TransactionSortBy,
  keyof Transaction
> = {
  startDate: "startDate",
  endDate: "endDate",
  amount: "amount",
  description: "description",
  category: "category",
  attributedTo: "participants",
};

/** The table's sorting state for the URL's sort. */
export function toSorting(sort: TransactionFilters["sort"]): Sorting[] {
  return sort ? [{ by: SORT_COLUMNS[sort.by], direction: sort.direction }] : [];
}

/** The URL's sort for the table's sorting state; a column the API cannot sort by clears it. */
export function toTransactionSort(sorting: Sorting[]): TransactionFilters["sort"] {
  const active = sorting[0];
  const by = active ? SORTABLE_FIELDS[active.by] : undefined;
  return by ? { by, direction: active.direction } : null;
}
