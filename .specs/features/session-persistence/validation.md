# Session Persistence Validation

## Validation: session-persistence - FAIL ❌

**Date**: 2026-10-16
**Spec**: `.specs/features/session-persistence/spec.md`
**Diff range**: `main..feat/session-persistence` (`6fc0bb5`..`bd23b79`, 14 commits, 41 files)
**Verifier**: independent sub-agent (author ≠ verifier), read-only over the real tree
**Environment**: Postgres SSH tunnel down (user decision). No `*IT` ran. Evidence that comes only from an `*IT` is marked **static, IT not executed** and does not count as executed coverage.

> **Pending:** run `cd backend && ./mvnw verify` with the DB tunnel up. That run executes `SessionIT` (14), `AuthenticationIT` (5 new/changed), `PasswordRecoveryIT` (2 new), `UserSessionRepositoryIT` (4), `MigrationsIT` and `PlanAuthorizationMatrixIT`. Then run the pending IT mutations listed under Discrimination Sensor.

---

## Task Completion

| Task | Status | Notes |
| ---- | ------ | ----- |
| T1–T8 (backend) | ✅ Done (code) | Every `*IT` Done-when is "written, not run". The substitute gate (`test-compile` + `*Test`) is green. |
| T9, T10 | ✅ Done | Unit tests executed and green |
| T11 | ✅ Done | SPEC_DEVIATION (refresh call lives in `findracoApi.renewSession`, not `useAuthService`). This is a design-level deviation with no spec impact. |
| T12 | ✅ Done | SPEC_DEVIATION (start-up expiry does not navigate). See Q1. |
| T13 | ✅ Done | `lib/auth.ts` deleted. No `STORAGE_KEYS.accessToken` or `isAuthenticated` reference remains. |
| T14 | ✅ Done | ARCHITECTURE/CONCERNS updated |

---

## Spec-Anchored Acceptance Criteria

Legend: **E** = executed in this run; **S** = static, IT not executed.

### P1: Expired session sends me to login

| # | Criterion | Spec-defined outcome | `file:line` + assertion | Ev. | Result |
| - | --------- | -------------------- | ----------------------- | --- | ------ |
| 1 | No, malformed, wrongly signed or expired token on a protected endpoint | `401`, message "Authentication required." | `backend/src/test/java/com/lcs/findraco/security/AuthenticationIT.java:211,218,226,243`: `status().isUnauthorized()` + `jsonPath("$.message").value("Authentication required.")` | S | ✅ statically sound (pending) |
| 2 | Forbidden by role or ownership | unchanged `403`/`404`, never `401` | `backend/src/test/java/com/lcs/findraco/security/PlanAuthorizationMatrixIT.java:108,152,183,206,246`: `isForbidden()`; `:83,121,221,266`: `isNotFound()`. Every caller is authenticated, and the file is unchanged by the diff. | S | ✅ statically sound (pending) |
| 3 | Renewal fails after a protected `401` | discard token, clear cache and active plan, navigate `/login` | `frontend/src/app/providers/AuthProvider.test.tsx:203`: `getAccessToken()` null, `getQueryCache().getAll()` length 0, `activePlanId`/`hasSession` null, `pathname` `/login`. `frontend/src/api/clients/findracoApi.test.ts:183`: `expiredHandler` called once. | E | ✅ |
| 4 | Navigated to `/login` by expiry | toast "Your session expired. Please sign in again." | `AuthProvider.test.tsx:218-219`: `toHaveBeenCalledTimes(1)` + `toHaveBeenCalledWith(SESSION_EXPIRED_MESSAGE)` | E | ✅ |
| 5 | Several concurrent `401`s, renewal fails | toast once, navigate once | `findracoApi.test.ts:204-205`: one `/auth/refresh`, `expiredHandler` `toHaveBeenCalledTimes(1)`. The handler toasts and navigates once per call (`AuthProvider.test.tsx:218`). | E | ✅ (see Q2) |
| 6 | Sign in after an expiry redirect | navigate to the previous path **and query** | `AuthProvider.test.tsx:215`: `state` `{from:{pathname:"/plans",search:"?tab=members"}}`. `frontend/src/app/routing/PrivateRoute.test.tsx:64`: same `from`. **No test covers the final hop**, `frontend/src/features/login/LoginPage.tsx:55` (`navigate(\`${from.pathname}${from.search}\`)`): mutant L1 dropped `from.search` and **survived**. | E (partial) | ❌ GAP |
| 7 | Session resolving at start-up | full-page loading, no private page | `PrivateRoute.test.tsx:44`: `getByRole("status",{name:"Loading"})` + `queryByText("Private page")` null. `AuthProvider.test.tsx:152`: `status` `loading` before renewal settles. | E | ✅ |
| 8 | Wrong credentials | show "Invalid username or password."; no renewal; no expiry toast | `findracoApi.test.ts:223`: only `/auth/login` called, error `data.message` "Invalid username or password.", handler not called (E). `backend/src/test/java/com/lcs/findraco/security/SessionIT.java:113`: `401` + message (S). **Nothing tests that the login page shows the message.** It relies on the existing `buildMutationOptions` toast, which has no test. | E/S (partial) | ⚠️ partial (UI display untested) |

### P1: Stay signed in while I keep using the app

| # | Criterion | Spec-defined outcome | `file:line` + assertion | Ev. | Result |
| - | --------- | -------------------- | ----------------------- | --- | ------ |
| 1 | Sign-in creates a session | expires 30 days without renewal | `backend/src/test/java/com/lcs/findraco/services/SessionServiceTest.java:96`: `row.getExpiresAt()` `isEqualTo(NOW.plusDays(30))` (E). `SessionIT.java:82`: `Max-Age` `2592000` (S). | E | ✅ |
| 2 | Access token lifetime | 15 min | `AuthenticationIT.java:264`: `exp - iat` `isEqualTo(900)`. `application.properties` default `900000`. | S | ✅ statically sound (pending) |
| 3 | `401` with a valid session | renew, retry once, show the result, no redirect, no toast | `findracoApi.test.ts:141`: `response.data` equals `{url:"/plans"}`, one refresh, Bearer old→new, `expiredHandler` not called | E | ✅ |
| 4 | Concurrent `401`s with a valid session | one renewal, every request retried | `findracoApi.test.ts:157`: `callsTo("/auth/refresh")` length 1. Each URL is retried with `Bearer new-token`. | E | ✅ |
| 5 | Renewal | expiry = renewal + 30 days | `SessionServiceTest.java:154`: `successor.getExpiresAt()` `isEqualTo(NOW.plusDays(30))` (E). `SessionIT.java:148`: `≈ now+30d` (S). | E | ✅ |
| 6 | App opened with a valid session | requested private page, no login page | `AuthProvider.test.tsx:146`: `loading`→`authenticated`, user loaded. `PrivateRoute.test.tsx:77`: outlet rendered. | E | ✅ |
| 7 | Renewal of an expired, revoked or deleted-user session | API `401`; app behaves as Expired AC 3–4 | `SessionServiceTest.java:114,132` (E). `SessionIT.java:161,191` (S). `AuthProvider.test.tsx:159` (E): toast once + hint dropped; `PrivateRoute.test.tsx:64` (E) redirects with `from`. | E/S | ✅ for private pages; ⚠️ spec-precision for public pages (Q1) |
| 8 | Renewal credential storage | `HttpOnly`, `Secure`, `SameSite=Strict`, auth path; never in a body | `SessionIT.java:76-83` (login) and `:137-143` (refresh): `isHttpOnly`, `getSecure`, `getSameSite` "Strict", `getPath` `/api/findraco/auth`; `body doesNotContain(cookie)` only for login | S | ✅ statically sound (pending). Minor: the refresh body is not checked for the cookie value. |
| 9 | No web storage of the access token or credential | none in local/session storage or IndexedDB | `frontend/src/api/clients/accessToken.test.ts:112`: `setItem` spy not called, both storages empty. `AuthProvider.test.tsx:258`: legacy `accessToken` key null after `signIn`. | E | ✅ |
| 10 | Login page | no "remember me" | **No test.** Inspection only: `LoginPage.tsx:74-90` has email and password fields and no checkbox. | none | ❌ GAP (zero assertion evidence) |
| 11 | Credential at rest | SHA-256 only | `SessionServiceTest.java:93-95`: `tokenHash` `isEqualTo(OpaqueTokens.hash(token))` `.isNotEqualTo(token)`. `backend/src/test/java/com/lcs/findraco/security/OpaqueTokensTest.java:27`: FIPS vector. `SessionIT.java:92` (S). | E | ✅ |

### P1: A stolen renewal credential is contained

| # | Criterion | Spec-defined outcome | `file:line` + assertion | Ev. | Result |
| - | --------- | -------------------- | ----------------------- | --- | ------ |
| 1 | Renewal | presented credential invalidated, new one issued | `SessionServiceTest.java:150-157`: `replacedAt` `isEqualTo(NOW)`, successor hash equals the new token, new token differs from the presented one | E | ✅ |
| 2 | Replaced credential reused more than 30 s later | revoke the chain, `401`, `WARN` naming the user id | `SessionServiceTest.java:181`: throws `InvalidSessionException`, `deleteAllByFamilyId(family)`, `Level.WARN` with a message containing `family` and `"42"` (E). `SessionIT.java:178`: `401` for original and successor, other device `200` (S). | E | ✅ |
| 3 | Reused within 30 s | renew, no revocation | `SessionServiceTest.java:164`: boundary exactly 30 s, successor issued, `never().deleteAllByFamilyId`, no logs (E). `SessionIT.java:170` (S, `200` only). | E | ✅ |
| 4 | Two tabs renew at once | both stay signed in | `findracoApi.test.ts:255`: refresh runs while the `findraco-session-renewal` lock is held (`lockStateAtRefresh` `[true]`), plus the grace test above | E | ✅ |

### P2: Ending sessions

| # | Criterion | Spec-defined outcome | `file:line` + assertion | Ev. | Result |
| - | --------- | -------------------- | ----------------------- | --- | ------ |
| 1 | Sign out (API) | revoke the device session, clear the cookie | `SessionIT.java:203`: `204`, cookie `Max-Age` 0 and empty, then refresh `401` (S). `SessionServiceTest.java:199`: `deleteAllByFamilyId(family)` (E). | E/S | ✅ (IT pending) |
| 2 | Sign out (app) | discard token, clear cache and plan, `/login`, no toast | `AuthProvider.test.tsx:222-246`: `post("/auth/logout")`, token null, cache 0, `activePlanId` null, pathname `/login`, `toast.error` not called | E | ✅ |
| 3 | Sign-out request fails | still do AC 2 | the same `it.each` case "the logout request fails" (`AuthProvider.test.tsx:229`) | E | ✅ |
| 4 | Other devices | stay valid | `SessionIT.java:213` (S). `backend/src/test/java/com/lcs/findraco/repositories/UserSessionRepositoryIT.java:85` (S). | S | ✅ statically sound (pending) |
| 5 | Password reset | revoke every session of that user | `backend/src/test/java/com/lcs/findraco/services/PasswordRecoveryIT.java:173`: both cookies `401`, other user `200`; `:190` failed reset revokes nothing (S). `SessionServiceTest.java:227`: `deleteAllByUser(user)` (E). | S | ✅ statically sound (pending) |

### Edge cases

| Edge case | Evidence | Ev. | Result |
| --------- | -------- | --- | ------ |
| Legacy local-storage token removed, not sent | `AuthProvider.test.tsx:133`: key null, no renew/get/post. `findracoApi.test.ts:123`: Bearer comes from the memory store only. | E | ✅ |
| Sign-in deletes the user's expired rows | `SessionServiceTest.java:79`: `deleteExpiredByUser(user, NOW)` (E). `UserSessionRepositoryIT.java:70` covers the `<=` boundary and per-user scope (S). `SessionIT.java:98` (S). | E/S | ✅ |
| Renewal network failure: original error, no sign-out | `findracoApi.test.ts:208`: rejects with the original `401`/`AUTH_REQUIRED`, handler not called, token kept. `AuthProvider.test.tsx:173` covers start-up (`unreachable`). | E | ✅ |
| `401` from a public endpoint: no renewal | `findracoApi.test.ts:223` (`/auth/login`). `/user` (register) and `GET /invitation/*` are `permitAll` and have no `401` path (`SecurityConfig`), so the case is vacuous for them. | E | ✅ |
| Invitation link while signed out returns after sign-in | `AcceptInvitationPage` sits under `PrivateRoute` (`AppRouter.tsx`), and `PrivateRoute.test.tsx:64` carries `from`. The LoginPage hop is untested (see Expired AC 6). | E (partial) | ⚠️ same gap as Expired AC 6 |

**Status**: ❌ Gaps present (Expired AC 6, Persist AC 10); ⚠️ 1 partial (Expired AC 8); ⚠️ 2 spec-precision gaps (Q1, Q2).

---

## Questions from the orchestrator

**Q1. Do the T11/T12 SPEC_DEVIATIONs still satisfy SESS-02/03?**

- **T11**: the refresh call lives in `findracoApi.renewSession` instead of `useAuthService.refreshSession`. This affects the design only, and no AC depends on it. The handler is attached to the shared promise (`findracoApi.ts:54-60`), so start-up renewals reach it too (`AuthProvider.test.tsx:159`). ✅
- **T12, mid-session expiry**: status is `authenticated`. `expireSession` clears state, toasts once and navigates to `/login` with `state.from` (`AuthProvider.tsx:98-100`; mutants A5 and A8 killed). Expired AC 3–4 and 6 hold, apart from the LoginPage hop.
- **T12, start-up expiry on a private page**: `expireSession` clears state, toasts and sets `anonymous`. `PrivateRoute` then renders `<Navigate to="/login" state={{from: location}}>` (`PrivateRoute.tsx:28-29`), so the user lands on `/login` with the toast and the path plus query. AC 3, 4 and 6 hold through the composition. Each half is executed (`AuthProvider.test.tsx:159`, `PrivateRoute.test.tsx:64`), but no test renders both together.
- **T12, start-up expiry on a public page** (e.g. `/reset-password` with a stale hint): the app shows "Your session expired. Please sign in again." and stays on the page. Persist AC 7 literally requires "behave as in Expired AC 3–4", which includes navigating to `/login`. The deviation is the better UX: an emailed reset link must stay usable. However, the spec never considered this case. → **⚠️ Spec-precision gap**, not a behavior gap. Fix: amend Persist AC 7 / Expired AC 3 to scope the redirect to private pages, and decide whether a public page should show the toast at all.

**Q2. When a mutation fails because the session expired, its own "Authentication required." toast appears next to the expiry toast. Is that a violation?**

Confirmed by code. The interceptor rejects the original `401` after the handler runs (`findracoApi.ts:100-103`). `buildMutationOptions.onError` (`frontend/src/api/utils/buildMutationOptions.ts:44-51`) then toasts `resolveErrorMessage` = `response.data.message` = "Authentication required.". This happens for every concurrent failing mutation that has `showErrorToast` on.

- It is **not a literal violation** of Expired AC 5. The *expiry* toast is shown once, and navigation happens once.
- The spec defines what the original request does only for a network failure ("normal error toast"). For an expiry it says nothing. The Goal ("ends on `/login` with an explanation") is still met.
- → **⚠️ Spec-precision gap** (cosmetic UX). The user should decide between two options:
  - suppress the original request's toast when the renewal answered `401`, for example by rejecting with a marked or cancelled error;
  - accept the extra toast and write that into the spec.

  This does not force FAIL on its own.

**Q3. Zero-evidence ACs, shallow assertions, dead code**

- **Zero evidence**:
  - Persist AC 10 (no "remember me") has no assertion anywhere.
  - Expired AC 6's final hop (`LoginPage.tsx:55`) has no test, and mutant L1 survived.
  - Expired AC 8's UI message display is untested.
- **Shallow or partial assertions** (none block):
  - `findracoApi.test.ts:199` checks only that all three requests are `rejected`, not that each rejects with its original error.
  - `SessionIT.java:170` (within-grace reuse) asserts only `200`; the "no revoke" half is executed in the unit test.
  - The refresh response body is not asserted free of the cookie value (Persist AC 8).
- **Payload/conjunction rule**: satisfied elsewhere. Successor rows are asserted on family, expiry, hash and user. The WARN is asserted on level and contents. The Bearer value is asserted per call.
- **Dead code**: `useGetUserProfile` (`frontend/src/api/services/useAuthService.ts:57`) has **no caller left**. Its only caller on `main` was the old `AuthProvider`. This violates CLAUDE.md "no junk", so delete it. `setUser` is still exposed on the context with no external consumer, but that was already so on `main`, so it is out of scope.

---

## Discrimination Sensor

**Sensor depth**: P0-expanded (auth / critical path), 33 manual behavior-level mutations. They ran in a scratch `git worktree` at `bd23b79` (`frontend/node_modules` symlinked). `git status --porcelain` of the real tree was empty before and after, and the worktree was removed and pruned.

| # | File:line | Mutation | Killed? (by) |
| - | --------- | -------- | ------------ |
| B1 | `backend/src/main/java/com/lcs/findraco/services/SessionService.java:83` | grace `now.isAfter(replacedAt+grace)` → `!now.isBefore(...)` (>=) | ✅ (`...ExactlyThirtySecondsAgo...`) |
| B2 | `SessionService.java:84` | replay no longer deletes the family | ✅ |
| B3 | `SessionService.java:77` | expiry boundary: `expiresAt == now` treated as valid | ✅ (`rotateTokenExpiringExactlyNowIsInvalid`) |
| B4 | `SessionService.java:82` | rotation does not set `replacedAt` | ✅ |
| B5 | `SessionService.java:90` | successor issued in a new family | ✅ |
| B6 | `SessionService.java:57` | `open` skips the expired-row cleanup | ✅ |
| B7 | `SessionService.java:85` | replay log `WARN` → `INFO` | ✅ |
| B8 | `SessionService.java:115` | raw token stored instead of its hash | ✅ |
| B9 | `SessionService.java:116` | sliding expiry 29 days | ✅ |
| B10 | `SessionService.java:100` | `revoke` deletes nothing | ✅ |
| B11 | `backend/src/main/java/com/lcs/findraco/security/OpaqueTokens.java:25` | Base64 keeps padding | ✅ |
| F1 | `frontend/src/api/clients/findracoApi.ts:54` | no single-flight (`??=` → `=`) | ✅ (3 refreshes) |
| F2 | `findracoApi.ts:87` | `/auth/*` skip removed | ✅ |
| F3 | `findracoApi.ts:56` | network failure fires the expiry handler | ✅ |
| F4 | `findracoApi.ts:100` | handler fired per request instead of per renewal | ✅ (called 4×) |
| F5 | `findracoApi.ts:106` | retried request may retry again | ✅ (unbounded retry crashed the worker) |
| F6 | `findracoApi.ts:20` | `withCredentials` false | ✅ |
| F7 | `findracoApi.ts:42` | Web Lock bypassed | ✅ |
| A1 | `frontend/src/app/providers/AuthProvider.tsx:86` | query cache not cleared | ✅ |
| A2 | `AuthProvider.tsx:87` | active plan / hint not cleared | ✅ |
| A3 | `AuthProvider.tsx:66` | start-up renews with no hint | ✅ |
| A4 | `AuthProvider.tsx:115` | start-up network failure → `anonymous` | ✅ |
| A5 | `AuthProvider.tsx:99` | expiry navigate drops `state.from` | ✅ |
| A6 | `AuthProvider.tsx:140` | sign-out goes through `expireSession` (toast) | ✅ |
| A7 | `AuthProvider.tsx:120` | legacy key not removed | ✅ |
| A8 | `AuthProvider.tsx:98` | start-up expiry navigates (deviation reversed) | ✅ |
| A9 | `AuthProvider.tsx:135` | sign-out aborts when logout fails | ✅ |
| A10 | `AuthProvider.tsx:128` | `signIn` does not set the hint | ✅ |
| A11 | `AuthProvider.tsx:95` | expiry toast shown twice | ✅ |
| P1 | `frontend/src/app/routing/PrivateRoute.tsx:11` | `loading` renders the outlet | ✅ |
| P2 | `PrivateRoute.tsx:29` | anonymous redirect drops `from` | ✅ |
| P3 | `PrivateRoute.tsx:23` | Retry button not wired | ✅ |
| P4 | `PrivateRoute.tsx:28` | `anonymous` renders the outlet | ✅ |
| L1 | `frontend/src/features/login/LoginPage.tsx:55` | return path drops the query string | ❌ **Survived** → fix task 1 |

**Result**: 32/33 killed, 1 survived - FAIL ❌

### Pending sensor items (IT-only behaviors, run after `./mvnw verify` with the tunnel)

| # | File | Mutation | Expected killer |
| - | ---- | -------- | --------------- |
| I1 | `security/SessionCookies.java` | `.httpOnly(false)` / `.sameSite("Lax")` / `.path("/")` | `SessionIT.loginReturnsTheAccessTokenAndSetsTheSessionCookie` |
| I2 | `security/SessionCookies.java` | `clear()` uses `ttl` instead of `Duration.ZERO` | `SessionIT.assertCleared` (`Max-Age` 0) |
| I3 | `security/JsonAuthenticationEntryPoint.java` | status `403`, or message changed | `AuthenticationIT.requestWithoutToken...`, `malformedToken...` |
| I4 | `config/SecurityConfig.java` | remove `.exceptionHandling(...)` | `AuthenticationIT` (4 tests) |
| I5 | `exceptions/GlobalExceptionHandler.java` | `handleInvalidSession` drops the clearing `Set-Cookie` | `SessionIT.refreshWithoutACookie...` |
| I6 | `services/SessionService.java` | `rotate` `noRollbackFor` removed (replay revocation rolled back) | `SessionIT.replacedCookieReusedAfterThirtyOneSeconds...` (successor must `401`) |
| I7 | `controllers/AuthenticationController.java` | `logout` skips `sessionService.revoke` | `SessionIT.logoutRevokesTheSessionAndClearsTheCookie` |
| I8 | `services/PasswordResetService.java` | remove `sessionService.revokeAll(...)` | `PasswordRecoveryIT.resetRevokesEverySessionOfTheUserAndNoOtherUsers` |
| I9 | `repositories/UserSessionRepository.java` | `deleteExpiredByUser` `<=` → `<` | `UserSessionRepositoryIT.deleteExpiredByUser...` |
| I10 | `application.properties` | `jwt.expiration-ms` default back to `86400000` | `AuthenticationIT.accessTokenFromLoginLivesFifteenMinutes` |

---

## Gate Check

| Gate | Command | Result |
| ---- | ------- | ------ |
| Backend compile | `cd backend && ./mvnw -q test-compile` | exit 0 |
| Backend unit | `./mvnw test -Dtest='*Test' -Dsurefire.failIfNoSpecifiedTests=false` | exit 0. 111 run, 0 failed, 0 skipped (SessionServiceTest 13, OpaqueTokensTest 3) |
| Backend full | `./mvnw verify` | **not run** (DB tunnel down), pending |
| Frontend unit | `cd frontend && npm run test` | exit 0. 33 files, 344 passed |
| Frontend build | `npm run build` | exit 0 (chunk-size warning only) |
| Frontend lint | `npx eslint <14 feature files>` | exit 0. 0 errors, 1 warning: `react-refresh/only-export-components` at `AuthProvider.tsx:157`. It was already there on `main` (`useAuth` export). |

- **Test count**:
  - backend unit: 95 before → 111 after (+16);
  - frontend: 321 before → 344 after (+23);
  - ITs: +25 written, not run.
- **Test integrity**: one existing test changed its assertion, `AuthenticationIT.requestWithoutTokenIsRejectedForProtectedEndpoint` (`403` → `401` + message). SESS-01 requires this change. `storage.test.ts` swapped the key (`accessToken` → `hasSession`) and kept the same assertion count. No test was deleted or weakened.

---

## Code Quality

| Principle | Status |
| --------- | ------ |
| Minimum code / no scope creep | ✅ |
| Surgical changes | ✅ |
| Matches patterns (thin controllers, typed `XxxExceptions`, constructor injection, service fns + hooks) | ✅ |
| No junk / dead code | ❌ `useGetUserProfile` left with no caller (`useAuthService.ts:57`) |
| Spec-anchored outcome check | ⚠️ 2 spec-precision gaps (Q1, Q2) |
| Per-layer coverage expectation | ❌ the `LoginPage` changes in this diff (AC 6, 8, 10) have no test |
| Every test maps to a spec AC / edge case / Done-when | ✅ |
| Guidelines followed: `CLAUDE.md`, `.specs/codebase/TESTING.md` | ✅ apart from the dead code |

---

## Fix Plans

### Fix 1: `LoginPage` has no test for the spec behavior it owns (Major)

- **Root cause**: no test file exists for `frontend/src/features/login/LoginPage.tsx`, which this diff changed. Expired AC 6 (return path + query), Expired AC 8 (message shown) and Persist AC 10 (no "remember me") have no assertion. Mutant L1 survived.
- **Fix task**: add `frontend/src/features/login/LoginPage.test.tsx`, with `MemoryRouter` + a mocked `useAuth().signIn` and a mocked login service fn. Cover three cases:
  - (a) location state `from={pathname:"/plans",search:"?tab=members"}` → after submit, the pathname is `/plans` and the search is `?tab=members`;
  - (b) the login rejects with `401` "Invalid username or password." → the toast (`sonner` mock) gets that exact message, and `signIn` is not called;
  - (c) no checkbox/"remember" control is rendered.
- **Done when**: L1 is killed, and the three ACs cite `file:line`.

### Fix 2: Remove dead `useGetUserProfile` (Minor)

- **Fix task**: delete `useGetUserProfile` and its now-unused imports from `frontend/src/api/services/useAuthService.ts`. Keep the exported `getUserProfile`.
- **Done when**: `npm run build`, `npm run test` and eslint are green; grep finds no references.

### Fix 3 (spec, user decision): amend the spec for Q1 and Q2 (Minor)

- Scope "navigate to `/login`" on a start-up expiry to private pages, and decide whether public pages show the toast.
- State whether a request that failed because of an expiry keeps its own error toast. If it should not, add a fix task in `findracoApi`/`buildMutationOptions`.

---

## Requirement Traceability Update

| Requirement | Previous | New |
| ----------- | -------- | --- |
| SESS-01 | Implementing | ⏳ Verified statically; IT pending |
| SESS-02 | Implementing | ✅ Verified (spec-precision note Q2) |
| SESS-03 | Implementing | ❌ Needs Fix (AC 6 LoginPage hop, AC 8 UI) |
| SESS-04 | Implementing | ✅ Verified (spec-precision note Q1); IT pending for the API half |
| SESS-05 | Implementing | ✅ Verified |
| SESS-06 | Implementing | ✅ Verified (15-min lifetime IT pending) |
| SESS-07 | Implementing | ✅ Verified (cookie attributes IT pending) |
| SESS-08 | Implementing | ✅ Verified |
| SESS-09 | Implementing | ✅ Verified |
| SESS-10 | Implementing | ✅ Verified (API half IT pending) |
| SESS-11 | Implementing | ⏳ Verified statically; IT pending |
| SESS-12 | Implementing | ❌ Needs Fix (Persist AC 10 has no evidence; invitation return depends on the LoginPage hop) |

---

## Summary

**Overall**: ❌ Not Ready. The gaps are small and test-only, plus one dead-code removal.

**Spec-anchored check**: 33 criteria (28 ACs + 5 edge cases).

| Status | Count | Items |
| ------ | ----- | ----- |
| ✅ | 29 | 23 with executed evidence; 6 static-only and sound: Expired AC 1–2, Persist AC 2 and 8, End AC 4–5 |
| ❌ | 2 | Expired AC 6 (partial), Persist AC 10 |
| ⚠️ partial | 2 | Expired AC 8, invitation edge case |
| ⚠️ spec-precision | 2 | Q1, Q2 |

**Sensor**: 33 injected, 32 killed, 1 survived (L1); 10 pending (IT).
**Gate**: backend unit 111/111 and test-compile OK; frontend 344/344, build OK, eslint 0 errors; `./mvnw verify` pending.

**What works**:
- Session rules: rotation, grace boundary, replay revocation with WARN, sliding 30-day expiry, hash-only storage.
- Client: single-flight renewal under Web Lock, retry once, `/auth/*` skip, network failure keeps the session, expiry handler once.
- AuthProvider: start-up states, expiry/sign-out clearing.
- PrivateRoute: status gating.

All of the above are discriminating tests (32 mutants killed).

**Next steps**: Fix 1 and Fix 2 → re-verify. The user decides on Fix 3. Run `./mvnw verify` with the DB tunnel, then mutants I1–I10.
