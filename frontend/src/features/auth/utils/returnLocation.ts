/** Where a sign-in should send the user back to: the page a guarded route turned them away from. */
export type ReturnLocation = {
  pathname: string;
  search: string;
};

/**
 * Reads the return location from router state. The state is whatever the previous navigation
 * stored (any value survives a reload in `history.state`), so its shape is checked, never assumed.
 */
export function readReturnLocation(state: unknown): ReturnLocation | undefined {
  if (typeof state !== "object" || state === null || !("from" in state)) {
    return undefined;
  }
  const { from } = state;
  if (typeof from !== "object" || from === null || !("pathname" in from) || !("search" in from)) {
    return undefined;
  }
  const { pathname, search } = from;
  return typeof pathname === "string" && typeof search === "string" ? { pathname, search } : undefined;
}
