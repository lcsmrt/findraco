# Session Persistence — Specification

> Decisions from the discuss pass are in [context.md](./context.md). ROADMAP M5-08.

## Problem Statement

After a few days away, opening the app shows private pages with no data: the 24h JWT has expired, but
the frontend never notices (it only checks that a token exists in local storage, and the profile load's
failure is swallowed), and the API answers an expired token with an empty `403` that the client does not
handle. Separately, the token lives 24h with no renewal, so even a daily user has to sign in again every
day.

## Goals

- [ ] Zero cases of a private page rendering without data because the session expired: an expired
      session always ends on `/login` with an explanation.
- [ ] A user who opens the app at least once every 30 days never sees the login page.
- [ ] No credential that can mint new tokens is readable by page JavaScript.

## Out of Scope

| Feature | Reason |
| ------- | ------ |
| "Remember me" option on the login page | User decision: every session is persistent (context.md). |
| "Active sessions" screen, per-device revoke, "sign out everywhere" | Deferred idea; no current need. |
| Session revocation on an in-app password change | No such flow exists; only the reset flow changes passwords today. |
| Rate limiting login / renewal | Small user base; same call as `password-recovery`. |
| OAuth / tokens for third-party clients (Claude MCP connector, M5-05) | That feature brings its own auth model. |
| Migrating error bodies to `ProblemDetail` | Separate quick task (`.specs/quick/error-contract-problemdetail-migration.md`); this feature uses the current `ErrorResponseDto` shape. |
| Preserving unsaved form input across an expiry redirect | Rare with a 30-day sliding window; not worth the complexity. |

---

## Assumptions & Open Questions

| Assumption / decision | Chosen default | Rationale | Confirmed? |
| --------------------- | -------------- | --------- | ---------- |
| "Remember me" | Not offered; every sign-in creates a persistent session | User decision | y |
| Session length | 30 days of inactivity, sliding: each renewal restarts the 30 days; no absolute cap | Anyone using the app monthly never signs in again; recommended default, area not discussed | y |
| Access token lifetime | 15 minutes | Bounds how long a stolen or revoked-session access token stays usable; common default for short-lived bearer tokens | y |
| Expiry UX | Redirect to `/login`, toast "Your session expired. Please sign in again.", return to the previous path + query after sign-in | The return path mechanism (`state.from`) already exists for `PrivateRoute`; recommended default, area not discussed | y |
| Sign out scope | Ends the current device's session only | Signing out of a borrowed device must not sign the user out of their phone; recommended default, area not discussed | y |
| Password reset | Ends every session of that user; access tokens already issued remain valid until their ≤15-minute expiry | Closes the gap left by `password-recovery`; immediate access-token revocation would need a per-request DB check | y |
| Unauthenticated response | `401` with the current `ErrorResponseDto` shape, message "Authentication required." | Distinguishes "not signed in" from "forbidden"; matches today's error contract until the ProblemDetail migration | y |
| Rotation and reuse | Each renewal replaces the session credential; a replaced credential presented again more than 30 seconds after its replacement revokes that device's whole session chain | Detects a stolen credential being replayed; the 30-second grace tolerates concurrent tabs and lost responses | y |
| Existing users on deploy | The old local-storage token is discarded; every user signs in once after the deploy | Old tokens have no session to renew; one sign-in is the cost of the migration | y |
| Expired session records | Deleted when their user next signs in | No scheduler exists in the backend; per-user cleanup on sign-in bounds growth without adding one | y |
| Login response body | Still returns the access token in the `token` field | Keeps Swagger and scripted API use working | y |

**Open questions:** none - all resolved or logged above.

---

## User Stories

### P1: Expired session sends me to login ⭐ MVP

**User Story**: As a user returning after the session ended, I want to be told the session expired and
taken to the login page so that I never stare at an empty app wondering where my data went.

**Why P1**: This is the reported bug; it also holds whenever renewal fails.

**Acceptance Criteria**:

1. WHEN a request to a protected endpoint carries no access token, a malformed one, an invalidly signed one or an expired one THEN the API SHALL respond `401` with body message "Authentication required."  <!-- event-driven -->
2. WHEN an authenticated user calls an endpoint their plan role or ownership does not allow THEN the API SHALL respond with the same status it responds today (`403` or `404`), never `401`.  <!-- event-driven -->
3. IF a protected request fails with `401` and the session cannot be renewed THEN the app SHALL discard the access token, clear all cached query data and the active plan, and navigate to `/login`.  <!-- unwanted-behavior -->
4. WHEN the app navigates to `/login` because the session could not be renewed THEN it SHALL show the toast "Your session expired. Please sign in again."  <!-- event-driven -->
5. IF several requests fail with `401` at the same time and the session cannot be renewed THEN the app SHALL show the expiry toast once and navigate once.  <!-- unwanted-behavior -->
6. WHEN the user signs in after an expiry redirect THEN the app SHALL navigate to the path and query string the user was on.  <!-- event-driven -->
7. WHILE the app is resolving the session on start-up the app SHALL render a full-page loading state instead of any private page.  <!-- state-driven -->
8. WHEN sign-in fails with wrong credentials THEN the app SHALL show "Invalid username or password." and SHALL NOT attempt a renewal or show the expiry toast.  <!-- event-driven -->

**Independent Test**: Sign in, revoke the session in the database, wait for the access token to expire
(or shorten its lifetime in dev), click anything: the app lands on `/login` with the toast, and signing in
returns to the same page.

---

### P1: Stay signed in while I keep using the app ⭐ MVP

**User Story**: As a regular user, I want my session to keep itself alive so that I only sign in again
after a month without opening the app.

**Why P1**: It is the second half of the complaint ("having to log in every time").

**Acceptance Criteria**:

1. WHEN the user signs in THEN the system SHALL create a session that expires after 30 days without a renewal.  <!-- event-driven -->
2. The access token SHALL expire 15 minutes after it is issued.  <!-- ubiquitous -->
3. WHEN a protected request fails with `401` and the session is valid THEN the app SHALL obtain a new access token and retry the request once, and the user SHALL see the retried request's result with no redirect and no toast.  <!-- event-driven -->
4. IF several protected requests fail with `401` at the same time and the session is valid THEN the app SHALL renew the session once and retry each of them.  <!-- unwanted-behavior -->
5. WHEN a session is renewed THEN the system SHALL set its expiry to 30 days after the renewal.  <!-- event-driven -->
6. WHEN the app is opened (new tab, reload, reopened browser or installed app) while the session is valid THEN the app SHALL show the requested private page without showing the login page.  <!-- event-driven -->
7. IF a renewal is requested for a session that expired, was revoked or belongs to a user that no longer exists THEN the API SHALL respond `401` and the app SHALL behave as in "Expired session" AC 3–4.  <!-- unwanted-behavior -->
8. The credential that renews the session SHALL be stored only in an `HttpOnly`, `Secure`, `SameSite=Strict` cookie scoped to the auth endpoints, and SHALL NOT appear in any response body.  <!-- ubiquitous -->
9. The app SHALL NOT write the access token or the renewal credential to `localStorage`, `sessionStorage` or IndexedDB.  <!-- ubiquitous -->
10. The login page SHALL NOT offer a "remember me" option.  <!-- ubiquitous -->
11. The API SHALL store only a SHA-256 hash of each renewal credential, never the credential itself.  <!-- ubiquitous -->

**Independent Test**: Sign in, wait past the 15-minute access-token lifetime, use the app: requests
succeed with no visible interruption. Close and reopen the browser: the app opens signed in.

---

### P1: A stolen renewal credential is contained ⭐ MVP

**User Story**: As an account owner, I want a replayed session credential to end that session so that a
copied cookie can't keep someone else signed in for a month.

**Why P1**: A 30-day credential without rotation would be a long-lived bearer secret; rotation is what
makes the long window acceptable.

**Acceptance Criteria**:

1. WHEN a session is renewed THEN the API SHALL invalidate the presented renewal credential and issue a new one.  <!-- event-driven -->
2. IF a renewal credential that was already replaced is presented more than 30 seconds after its replacement THEN the API SHALL revoke every session in that device's chain, respond `401`, and log a `WARN` entry naming the user id.  <!-- unwanted-behavior -->
3. WHEN a renewal credential that was already replaced is presented within 30 seconds of its replacement THEN the API SHALL renew the session as if the credential were current and SHALL NOT revoke the chain.  <!-- event-driven -->
4. WHEN two tabs of the same browser renew at the same time THEN both tabs SHALL stay signed in.  <!-- event-driven -->

**Independent Test**: Capture the cookie, renew once, replay the captured cookie after 31 seconds: `401`,
and the browser that renewed is signed out on its next renewal.

---

### P2: Ending sessions

**User Story**: As a user, I want signing out and resetting my password to really end sessions so that a
device I left behind or someone who knew my password loses access.

**Why P2**: Sign-out already "works" locally today; server-side revocation hardens it but the bug fix
and persistence come first.

**Acceptance Criteria**:

1. WHEN the user clicks Sign out THEN the API SHALL revoke the current device's session and clear the renewal cookie.  <!-- event-driven -->
2. WHEN the user clicks Sign out THEN the app SHALL discard the access token, clear all cached query data and the active plan, and navigate to `/login` with no toast.  <!-- event-driven -->
3. IF the sign-out request fails THEN the app SHALL still perform "Ending sessions" AC 2.  <!-- unwanted-behavior -->
4. WHEN the user signs out on one device THEN the user's sessions on other devices SHALL stay valid.  <!-- event-driven -->
5. WHEN a password reset completes THEN the API SHALL revoke every session of that user.  <!-- event-driven -->

**Independent Test**: Sign in on two browsers; sign out on one, the other keeps working; reset the
password, the other is sent to `/login` within 15 minutes.

---

## Edge Cases

- WHEN the app is loaded with a token left in local storage by the previous version THEN the app SHALL remove it and SHALL NOT send it.
- WHEN a user signs in THEN the API SHALL delete that user's session records whose expiry has passed.
- IF the renewal request itself fails for a network reason (no response) THEN the app SHALL fail the original request with its normal error toast and SHALL NOT sign the user out.
- WHEN a `401` comes from a public endpoint (login, register, forgot/reset password, invitation preview) THEN the app SHALL NOT attempt a renewal.
- WHEN a user opens an invitation link while signed out and signs in THEN the app SHALL return to the invitation page (existing behavior, kept).

---

## Implicit-Requirement Dimensions

| Dimension | Resolution |
| --------- | ---------- |
| Input validation & bounds | Malformed / invalid / expired tokens → `401` (SESS-01); renewal input is the cookie only (SESS-07) |
| Failure / partial-failure states | Renewal failure vs. network failure distinguished (SESS-04, Edge Cases); sign-out failure still clears locally (SESS-10) |
| Idempotency / retry / duplicate handling | One renewal for concurrent `401`s, one retry per request (SESS-05); single toast/redirect (SESS-02) |
| Auth boundaries & rate limits | `401` vs. `403/404` (SESS-01); public endpoints never renew (Edge Cases); rate limiting out of scope |
| Concurrency / ordering | Concurrent tabs and the 30-second grace (SESS-09) |
| Data lifecycle / expiry | 30-day sliding expiry (SESS-06); cleanup on sign-in, old local-storage token removed (SESS-12) |
| Observability | `WARN` log on replay detection (SESS-08) |
| External-dependency failure | N/A because the feature calls no external service |
| State-transition integrity | Session states active → rotated → revoked/expired; replayed rotated credential revokes the chain (SESS-08) |

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
| -------------- | ----- | ----- | ------ |
| SESS-01 | P1 Expired (AC 1–2), `401` vs. `403/404` | Design | Pending |
| SESS-02 | P1 Expired (AC 3–5), clear, redirect, single toast | Design | Pending |
| SESS-03 | P1 Expired (AC 6–8), return path, start-up loading, bad credentials | Design | Pending |
| SESS-04 | P1 Persist (AC 7) + Edge (network failure, public endpoints), renewal failure handling | Design | Pending |
| SESS-05 | P1 Persist (AC 3–4), silent renewal and retry | Design | Pending |
| SESS-06 | P1 Persist (AC 1–2, 5), lifetimes and sliding expiry | Design | Pending |
| SESS-07 | P1 Persist (AC 8–9, 11), credential storage | Design | Pending |
| SESS-08 | P1 Theft (AC 1–2), rotation and replay revocation | Design | Pending |
| SESS-09 | P1 Theft (AC 3–4), grace window and concurrent tabs | Design | Pending |
| SESS-10 | P2 End (AC 1–4), sign out | Design | Pending |
| SESS-11 | P2 End (AC 5), revoke on password reset | Design | Pending |
| SESS-12 | P1 Persist (AC 6, 10) + Edge (legacy token, cleanup, invitation), start-up and migration | Design | Pending |

**ID format:** `SESS-NN`; each ID covers the AC range named in its row.

**Coverage:** 12 total, 0 mapped to tasks, 12 unmapped ⚠️ (tasks not written yet)

---

## Success Criteria

- [ ] After a week without opening the app, it opens signed in on the requested page.
- [ ] After more than 30 days away, the app shows `/login` with "Your session expired. Please sign in again." — never an empty home page.
- [ ] No request to a protected endpoint returns `403` because of a missing or expired token.
