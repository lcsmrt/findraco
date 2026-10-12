import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  OVERVIEW_PARAM_KEYS,
  parseOverviewFilters,
  parseTab,
  parseTransactionFilters,
  serializeOverviewFilters,
  serializeTab,
  serializeTransactionFilters,
  TAB_PARAM,
  TRANSACTION_PARAM_KEYS,
  type HomeTab,
  type OverviewFilters,
  type TransactionFilters,
} from "../filters/homeFilterParams";

const withParams = (
  prev: URLSearchParams,
  remove: readonly string[],
  add: Record<string, string>,
) => {
  const next = new URLSearchParams(prev);
  remove.forEach((key) => next.delete(key));
  Object.entries(add).forEach(([key, value]) => next.set(key, value));
  return next;
};

/**
 * Home filter state derived from the URL query string (single source of truth).
 * Filter updates replace the history entry; tab switches push a new one.
 */
export const useHomeFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const tab = parseTab(searchParams);
  const overview = useMemo(
    () => parseOverviewFilters(searchParams),
    [searchParams],
  );
  const transactions = useMemo(
    () => parseTransactionFilters(searchParams),
    [searchParams],
  );

  const setTab = useCallback(
    (next: HomeTab) =>
      setSearchParams((prev) =>
        withParams(prev, [TAB_PARAM], serializeTab(next)),
      ),
    [setSearchParams],
  );

  const updateOverview = useCallback(
    (update: (current: OverviewFilters) => OverviewFilters) =>
      setSearchParams(
        (prev) =>
          withParams(
            prev,
            OVERVIEW_PARAM_KEYS,
            serializeOverviewFilters(update(parseOverviewFilters(prev))),
          ),
        { replace: true },
      ),
    [setSearchParams],
  );

  const updateTransactions = useCallback(
    (update: (current: TransactionFilters) => TransactionFilters) =>
      setSearchParams(
        (prev) =>
          withParams(
            prev,
            TRANSACTION_PARAM_KEYS,
            serializeTransactionFilters(update(parseTransactionFilters(prev))),
          ),
        { replace: true },
      ),
    [setSearchParams],
  );

  const clearTransactions = useCallback(
    () =>
      setSearchParams((prev) => withParams(prev, TRANSACTION_PARAM_KEYS, {}), {
        replace: true,
      }),
    [setSearchParams],
  );

  return {
    tab,
    overview,
    transactions,
    setTab,
    updateOverview,
    updateTransactions,
    clearTransactions,
  };
};
