# Session Persistence Context

**Gathered:** 2026-10-16
**Spec:** `.specs/features/session-persistence/spec.md`
**Status:** Ready for design

---

## Feature Boundary

An expired session is announced and sends the user to the login page instead of rendering empty
private pages, and a user who opens the app at least once every 30 days never has to sign in again.
Covers the API's unauthenticated response, session renewal, sign-out and session revocation on password
reset. ROADMAP M5-08.

---

## Implementation Decisions

### "Remember me"

- No "remember me" option on the login page. Every sign-in creates a persistent session, on every device.
- The user weighed the two meanings the option has in other apps (a session cookie that dies with the
  browser, or a pre-filled email) and rejected both: the session-cookie variant is unpredictable on
  phones (browsers are suspended, not closed) and defeated by "continue where you left off" on desktop;
  the pre-filled email duplicates the browser's password manager. On someone else's device, the user
  signs out.

### Agent's Discretion

None - the user discussed only the "remember me" area; the rest is recorded below as assumptions.

### Declined / Undiscussed Gray Areas → Assumptions

Each is written to the spec's Assumptions & Open Questions section with the default and rationale.

- **Session length:** 30 days of inactivity, sliding (each renewal restarts the window), no absolute cap.
- **Expiry UX:** redirect to `/login` with the toast "Your session expired. Please sign in again.";
  after signing in, return to the page the user was on. Unsaved form input is lost.
- **Ending sessions:** Sign out ends the current device only; a password reset ends every session of
  that user. No "active sessions" screen and no "sign out everywhere" button.

---

## Specific References

- Diagnosis of the current bug (2026-10-16): `AuthProvider.loadUserData` relies on `refetch()` rejecting,
  but TanStack Query's `refetch()` resolves with the error, so an expired token is never cleared;
  `PrivateRoute` only checks that a token exists in local storage; `PlanProvider` skips loading plans
  while `user` is null, so private pages render empty. The API answers an expired token with an empty
  `403` (Spring's default entry point), and the JWT lives 24h with no renewal
  (`jwt.expiration-ms` default `86400000`, not overridden in production).
- The password-reset token (`PasswordResetService`: random bytes, SHA-256 hash at rest, injected
  `Clock`) is the in-house pattern for opaque, hashed, expiring tokens.
- `password-recovery` spec left "revoking JWTs issued before the reset" out of scope for lack of a
  session store; this feature provides one.

---

## Deferred Ideas

- "Active sessions" screen listing devices, with per-device revoke.
- "Sign out everywhere" button.
- Revoking sessions on a future in-app "change password" (no such flow exists today).
- Rate limiting the login and renewal endpoints.
