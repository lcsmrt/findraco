import type { PagedTransactionsFilter } from "@/api/dtos";

export function countActiveFilters(
  filter: PagedTransactionsFilter,
): number {
  let n = 0;
  if (filter.type) n++;
  if (filter.categoryId != null) n++;
  if (filter.memberId != null) n++;
  if (filter.startDateFrom || filter.startDateTo) n++;
  if (filter.amountMin != null || filter.amountMax != null) n++;
  return n;
}
