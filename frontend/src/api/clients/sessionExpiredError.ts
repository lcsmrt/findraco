/**
 * Rejection of a request whose session could not be renewed. The session-expired
 * handler already told the user, so callers should not show another error.
 */
export class SessionExpiredError extends Error {
  /** The request's own error, the 401 that triggered the failed renewal. */
  readonly original: unknown;

  constructor(original: unknown) {
    super("The session could not be renewed.");
    this.name = "SessionExpiredError";
    this.original = original;
  }
}
