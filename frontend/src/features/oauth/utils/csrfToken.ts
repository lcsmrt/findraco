const COOKIE_NAME = "XSRF-TOKEN";

/**
 * The authorization server's CSRF token, which it sets as a cookie readable by the page. A plain form
 * post cannot add a header, so the page copies the raw cookie value into the `_csrf` field.
 */
export function readCsrfToken(cookies: string): string {
  const entry = cookies
    .split("; ")
    .find((cookie) => cookie.startsWith(`${COOKIE_NAME}=`));
  return entry ? entry.slice(COOKIE_NAME.length + 1) : "";
}
