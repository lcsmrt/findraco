import { useDebounce } from "@/hooks/useDebounce";
import { useCallback, useEffect, useState } from "react";
import { useTransactionFilters } from "../filters/useTransactionFilters";

const SEARCH_DEBOUNCE_MS = 400;

/**
 * The Transactions search box. It keeps its own draft, starting from the URL's `q`, so a keystroke
 * does not rewrite the URL and refetch; `q` follows once typing settles.
 */
export function useTransactionSearch() {
  const { transactions, updateTransactions } = useTransactionFilters();
  const urlDescription = transactions.filter.description ?? "";
  const [search, setSearch] = useState(urlDescription);
  const debouncedSearch = useDebounce(search, SEARCH_DEBOUNCE_MS);

  useEffect(() => {
    // Only once typing has settled, so a stale debounced value never overwrites `q`.
    if (debouncedSearch === search && debouncedSearch !== urlDescription) {
      updateTransactions((t) => ({
        ...t,
        filter: { ...t.filter, description: debouncedSearch || undefined },
      }));
    }
  }, [debouncedSearch, search, urlDescription, updateTransactions]);

  /** Empties the box at once, without waiting for the debounce. */
  const clearSearch = useCallback(() => setSearch(""), []);

  return { search, setSearch, clearSearch };
}
