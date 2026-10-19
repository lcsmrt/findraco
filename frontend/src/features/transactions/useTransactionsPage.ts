import { useCallback, useState } from "react";
import {
  serializeTransactionFilters,
  type TransactionFilters,
} from "./filters/transactionParams";

/**
 * Table page for the Transactions tab. Not part of the URL: it starts on the first
 * page and resets to it whenever the filters, sort or page size change.
 */
export function useTransactionsPage(transactions: TransactionFilters) {
  const filtersKey = new URLSearchParams(
    serializeTransactionFilters(transactions),
  ).toString();
  const [pageState, setPageState] = useState({ key: filtersKey, page: 0 });
  const page = pageState.key === filtersKey ? pageState.page : 0;

  const setPage = useCallback(
    (next: number) => setPageState({ key: filtersKey, page: next }),
    [filtersKey],
  );

  return [page, setPage] as const;
}
