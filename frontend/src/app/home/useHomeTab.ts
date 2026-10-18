import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { parseTab, serializeTab, TAB_PARAM, type HomeTab } from "./homeParams";

/**
 * The active home tab, read from the URL query string. A tab switch pushes a history entry, unlike
 * filter updates: switching tabs is navigation, so Back returns to the previous tab.
 */
export function useHomeTab() {
  const [searchParams, setSearchParams] = useSearchParams();

  const tab = parseTab(searchParams);
  const setTab = useCallback(
    (next: HomeTab) =>
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);
        params.delete(TAB_PARAM);
        Object.entries(serializeTab(next)).forEach(([key, value]) =>
          params.set(key, value),
        );
        return params;
      }),
    [setSearchParams],
  );

  return { tab, setTab };
}
