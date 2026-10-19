// The access token lives only in module memory: never in localStorage,
// sessionStorage or IndexedDB, so a page reload drops it and the session is
// resumed through the HttpOnly renewal cookie instead.
let accessToken: string | null = null;

/**
 * Returns the current access token, or null when there is none.
 */
export function getAccessToken(): string | null {
  return accessToken;
}

/**
 * Replaces the in-memory access token; pass null to discard it.
 * @param token New access token, or null.
 */
export function setAccessToken(token: string | null): void {
  accessToken = token;
}
