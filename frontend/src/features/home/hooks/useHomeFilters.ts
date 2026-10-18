import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import {
  parseTab,
  serializeTab,
  TAB_PARAM,
  type HomeTab,
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
 * Home tab derived from the URL query string (single source of truth).
 * Tab switches push a new history entry.
 */
export const useHomeFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const tab = parseTab(searchParams);
  const setTab = useCallback(
    (next: HomeTab) =>
      setSearchParams((prev) =>
        withParams(prev, [TAB_PARAM], serializeTab(next)),
      ),
    [setSearchParams],
  );

  return { tab, setTab };
};
