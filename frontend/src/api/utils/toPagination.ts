import type { Pagination } from "@/components/table/TablePagination";
import type { PagedResponse } from "../dtos/paged";

/**
 * Turns a paged API response into the table's pagination props; the inverse of `buildPagedQuery`.
 * The API sends no `first` flag, so it is derived from the 0-based page index.
 */
export function toPagination<T>(page: PagedResponse<T>): Pagination {
  return {
    number: page.page,
    size: page.size,
    totalElements: page.totalElements,
    totalPages: page.totalPages,
    first: page.page === 0,
    last: page.last,
  };
}
