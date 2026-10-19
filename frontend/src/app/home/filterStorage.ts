function keyFor(userId: number, planId: number) {
  return `homeFilters:${userId}:${planId}`;
}

/** Saves the home query string for (user, plan). Never throws. */
export function saveHomeFilters(
  userId: number,
  planId: number,
  search: string,
): void {
  try {
    localStorage.setItem(keyFor(userId, planId), search);
  } catch {
    // Storage unavailable (private mode, quota): URL state still works.
  }
}

/** Loads the saved home query string for (user, plan), or null. Never throws. */
export function loadHomeFilters(
  userId: number,
  planId: number,
): string | null {
  try {
    return localStorage.getItem(keyFor(userId, planId));
  } catch {
    return null;
  }
}
