import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

export type SearchParamGroup<T> = {
  value: T;
  /** Rewrites the group's keys from `fn(current)`; other params stay as they are. */
  update: (fn: (current: T) => T) => void;
  /** Removes `keys` (default: every key of the group); other params stay as they are. */
  clear: (keys?: readonly string[]) => void;
};

function withParams(
  prev: URLSearchParams,
  remove: readonly string[],
  add: Record<string, string>,
) {
  const next = new URLSearchParams(prev);
  remove.forEach((key) => next.delete(key));
  Object.entries(add).forEach(([key, value]) => next.set(key, value));
  return next;
}

/**
 * A group of query params owned by one piece of state, read with `parse` and written with
 * `serialize`. Updates replace the history entry: filter changes are not navigation, so Back
 * leaves the page instead of undoing a filter.
 *
 * `keys`, `parse` and `serialize` must be stable (module-level): they are dependencies of the
 * returned callbacks, and consumers put those callbacks in effect dependencies.
 */
export function useSearchParamGroup<T>(
  keys: readonly string[],
  parse: (params: URLSearchParams) => T,
  serialize: (value: T) => Record<string, string>,
): SearchParamGroup<T> {
  const [searchParams, setSearchParams] = useSearchParams();

  const value = useMemo(() => parse(searchParams), [parse, searchParams]);

  const update = useCallback(
    (fn: (current: T) => T) =>
      setSearchParams(
        (prev) => withParams(prev, keys, serialize(fn(parse(prev)))),
        { replace: true },
      ),
    [keys, parse, serialize, setSearchParams],
  );

  const clear = useCallback(
    (subset: readonly string[] = keys) =>
      setSearchParams((prev) => withParams(prev, subset, {}), {
        replace: true,
      }),
    [keys, setSearchParams],
  );

  return { value, update, clear };
}
