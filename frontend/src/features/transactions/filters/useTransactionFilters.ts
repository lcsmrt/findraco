import { useSearchParamGroup } from "@/hooks/useSearchParamGroup";
import { PERIOD_PARAM_KEYS } from "@/utils/periodParams";
import { useCallback } from "react";
import {
  parseTransactionFilters,
  serializeTransactionFilters,
  TRANSACTION_PARAM_KEYS,
} from "./transactionParams";

/** Clear removes filters and the search; the period is where the member is, and sort and page size are display preferences. */
const CLEARABLE_TRANSACTION_PARAM_KEYS = TRANSACTION_PARAM_KEYS.filter(
  (key) => key !== "sort" && key !== "size" && !PERIOD_PARAM_KEYS.some((periodKey) => periodKey === key),
);

/** Transactions filters, read from and written to the URL query string (the single source of truth). */
export function useTransactionFilters() {
  const { value, update, clear } = useSearchParamGroup(
    TRANSACTION_PARAM_KEYS,
    parseTransactionFilters,
    serializeTransactionFilters,
  );
  const clearTransactions = useCallback(
    () => clear(CLEARABLE_TRANSACTION_PARAM_KEYS),
    [clear],
  );
  return {
    transactions: value,
    updateTransactions: update,
    clearTransactions,
  };
}
