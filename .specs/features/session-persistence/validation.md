# Session Persistence Validation

## Validation: session-persistence (iteration 2) - FAIL ❌

**Date**: 2026-10-16
**Spec**: `.specs/features/session-persistence/spec.md` (amended 2026-10-16: Expired AC 4 is narrowed to private pages; AC 9 and AC 10 are new; two Assumptions rows are new)
**Diff range**: `main..feat/session-persistence` (`6fc0bb5`..`93671fc`, 20 commits, 50 files). Fix commits for this iteration: `7979f19` (F1), `c9f0ac8` (F2), `a7acae9` (F3), `6b86661` (F4), `93671fc` (F5).
**Verifier**: an independent sub-agent (the author is not the verifier). It worked read-only over the real tree.
**Environment**: the Postgres SSH tunnel is down (user decision), so no `*IT` ran. Evidence that comes only from an `*IT` is marked **S** (static, IT not executed). Such evidence does not force a FAIL on its own.

> **Pending:** run `cd backend && ./mvnw verify` with the DB tunnel up. It covers `SessionIT`, `AuthenticationIT`, `PasswordRecoveryIT`, `UserSessionRepositoryIT`, `MigrationsIT` and `PlanAuthorizationMatrixIT`. After it passes, run IT mutations I1–I10 (listed below). The fix commits do not touch the backend, so this list has not changed since iteration 1.

**Why FAIL**: one executed mutant survived. Mutant **A15** removes the one-shot reset in `announceSessionExpiry` (`frontend/src/app/providers/AuthProvider.tsx:113`). A probe test, run only in scratch, shows the flow it breaks:

1. The session expires at start-up on a private page.
2. The user signs in.
3. The user signs out.
4. The user opens a private page again.

With the mutant, step 4 shows a second, false "Your session expired. Please sign in again." toast. Expired AC 4 says the toast appears only for an expiry, and End AC 2 says sign-out shows no toast. The real code is correct; no test pins the behavior. Every AC and edge case has evidence, and no real behavior gap or dead code remains.

---

## Task Completion

| Task | Status | Notes |
| ---- | ------ | ----- |
| T1–T14 | ✅ Done | Unchanged since iteration 1. The `*IT` Done-when items are still "written, not run". |
| F1 `LoginPage` tests | ✅ Done | Adds 4 tests and kills L1. The catch on a failed login removes an unhandled rejection; mutant L3 confirms it. |
| F2 Remove `useGetUserProfile` | ✅ Done | `grep useGetUserProfile frontend/src` finds nothing. `useQuery` and `UseQueryOptions` are still used, by `useValidatePasswordResetToken` at `useAuthService.ts:122-126`. |
| F3 Silent expiry on public pages | ✅ Done, ⚠️ weak test | The behavior is correct. The one-shot reset of the start-up expiry marker has no test (A15 survived). |
| F4 `SessionExpiredError` | ✅ Done | |
| F5 `DeleteCategoryDialog` | ✅ Done | The classification is tested (D1 killed). The early return in `onError` has no test, but removing it changes nothing the spec can observe (D2 is equivalent; see the sensor section). |

---

## Spec-Anchored Acceptance Criteria

Legend: **E** = executed in this run; **S** = static, IT not executed. Test paths are relative to `frontend/src/` unless they start with `backend/`.

### P1: Expired session sends me to login

| # | Criterion | Spec-defined outcome | `file:line` + assertion | Ev. | Result |
| - | --------- | -------------------- | ----------------------- | --- | ------ |
| 1 | The token is missing, malformed, wrongly signed or expired | `401` with message "Authentication required." | `backend/src/test/java/com/lcs/findraco/security/AuthenticationIT.java:211,218,226,243`: `status().isUnauthorized()` + `jsonPath("$.message").value("Authentication required.")` | S | ✅ statically sound (pending) |
| 2 | Forbidden by role or ownership | the same `403`/`404` as today, never `401` | `backend/src/test/java/com/lcs/findraco/security/PlanAuthorizationMatrixIT.java:108,152,183,206,246`: `isForbidden()`; `:83,121,221,266`: `isNotFound()` | S | ✅ statically sound (pending) |
| 3 | Renewal fails after a protected `401` | discard the token, clear the cache and the active plan, go to `/login` | `app/providers/AuthProvider.test.tsx:229-235`: `getAccessToken()` null, `getQueryCache().getAll()` length 0, `activePlanId` and `hasSession` null, `pathname` `/login`. Same through `PrivateRoute` after a start-up expiry: `:311-318`. | E | ✅ |
| 4 | Sent to `/login` from a **private** page because of an expiry | toast "Your session expired. Please sign in again." | Mid-session: `AuthProvider.test.tsx:239-240` and `:333-334`, `toHaveBeenCalledTimes(1)` + `toHaveBeenCalledWith(SESSION_EXPIRED_MESSAGE)`. Start-up on `/plans`: `:315-316`, same assertions. No toast for a visitor who never signed in: `:354`. | E | ✅ (the "once only" reset is untested; see A15) |
| 5 | Several `401`s at once, renewal fails | one toast, one navigation | `api/clients/findracoApi.test.ts:214-215`: `callsTo("/auth/refresh")` length 1 and `expiredHandler` `toHaveBeenCalledTimes(1)`. The handler toasts once per call: `AuthProvider.test.tsx:239`. | E | ✅ |
| 6 | Sign-in after an expiry redirect | go to the previous path **and query** | `features/login/LoginPage.test.tsx:123`: location `toBe("/plans?x=1")` from `state.from`. Producers: `AuthProvider.test.tsx:236-238` and `:312-314` (`from` = `/plans` + `?tab=members`). L1 and L2 are killed. | E | ✅ (fixed since iteration 1) |
| 7 | Session still resolving at start-up | full-page loading, no private page | `app/routing/PrivateRoute.test.tsx:50`: `getByRole("status",{name:"Loading"})`, and the private page is absent. `AuthProvider.test.tsx:166`: `loading` before the renewal settles. | E | ✅ |
| 8 | Wrong credentials | show "Invalid username or password."; no renewal; no expiry toast | `LoginPage.test.tsx:148-154`: `toast.error` `toHaveBeenCalledWith("Invalid username or password.")` and `toHaveBeenCalledTimes(1)`, `signIn` not called, a single `post`. The test renders the real `useLogin` and `buildMutationOptions`. No renewal: `findracoApi.test.ts:233` (`/auth/login` 401 → no `/auth/refresh`). API side: `backend/src/test/java/com/lcs/findraco/security/SessionIT.java:113` (S). | E | ✅ (fixed since iteration 1) |
| 9 | Start-up expiry on a public page | stay on the page, clear the session as in AC 3, no toast | `AuthProvider.test.tsx:184-191`: on `/reset-password?token=abc`, `pathname` and `search` are unchanged, `toast.error` not called, token null, cache 0, `activePlanId` and `hasSession` null. A later in-app move to `/plans` shows no toast either: `:344-347`. A12, A13 and A14 are killed. | E | ✅ (new) |
| 10 | Request fails because renewal failed | no toast for that request's own error | Client: `findracoApi.test.ts:206-213`, each of the 3 rejections `toBeInstanceOf(SessionExpiredError)` with `original` = its own `401`. Shared toast: `api/utils/buildMutationOptions.test.ts:61-62`, `toast.error` not called and the caller's `onError` still called. Other errors still toast: `:76-79`. Category delete: `features/home/components/categories/DeleteCategoryDialog.test.ts:164`, `classifyDeleteError(SessionExpiredError)` `toBe("session-expired")`. M1–M5 and D1 are killed. The other toast sites in `src` are only `AuthProvider.tsx:104,114` (grep). | E | ✅ (new) |

### P1: Stay signed in while I keep using the app

| # | Criterion | Spec-defined outcome | `file:line` + assertion | Ev. | Result |
| - | --------- | -------------------- | ----------------------- | --- | ------ |
| 1 | Sign-in creates a session | expires after 30 days without a renewal | `backend/src/test/java/com/lcs/findraco/services/SessionServiceTest.java:96`: `getExpiresAt()` `isEqualTo(NOW.plusDays(30))` (E). `SessionIT.java:82`: `Max-Age` 2592000 (S). | E | ✅ |
| 2 | Access token lifetime | 15 minutes | `AuthenticationIT.java:264`: `exp - iat` `isEqualTo(900)` | S | ✅ statically sound (pending) |
| 3 | `401` while the session is valid | renew, retry once, show the result, no redirect, no toast | `findracoApi.test.ts:142-156`: the data is the retried response, 1 refresh, the expiry handler is not called | E | ✅ |
| 4 | Several `401`s at once while the session is valid | one renewal, every request retried | `findracoApi.test.ts:176`: `callsTo("/auth/refresh")` length 1, each request retried with the new Bearer token | E | ✅ |
| 5 | Renewal | expiry = renewal time + 30 days | `SessionServiceTest.java:154`: `isEqualTo(NOW.plusDays(30))` | E | ✅ |
| 6 | App opened while the session is valid | the private page, never the login page | `AuthProvider.test.tsx:160-170`: `loading` → `authenticated`. `PrivateRoute.test.tsx:78`: the outlet renders. | E | ✅ |
| 7 | Renewal of an expired, revoked or deleted-user session | API answers `401`; app does AC 3–4 on a private page and AC 9 on a public page | API: `SessionServiceTest.java:114,132` (E), `SessionIT.java:161,191` (S). App: private page `AuthProvider.test.tsx:305-319`, public page `:174-192`. | E/S | ✅ (the iteration 1 spec-precision gap is resolved) |
| 8 | Renewal credential storage | cookie is `HttpOnly`, `Secure`, `SameSite=Strict`, scoped to the auth path; never in a body | `SessionIT.java:76-83,137-143` | S | ✅ statically sound (pending) |
| 9 | No web storage of the token or the credential | nothing in local or session storage, nor IndexedDB | `api/clients/accessToken.test.ts:28` (the `setItem` spy is never called). `AuthProvider.test.tsx:279`: legacy key null after `signIn`. | E | ✅ |
| 10 | Login page | no "remember me" option | `LoginPage.test.tsx:163-164`: `queryByRole("checkbox")` null and `queryByText(/remember/i)` null | E | ✅ (fixed since iteration 1) |
| 11 | Credential at rest | SHA-256 hash only | `SessionServiceTest.java:93-95`. `backend/src/test/java/com/lcs/findraco/security/OpaqueTokensTest.java:27`. | E | ✅ |

### P1: A stolen renewal credential is contained

| # | Criterion | Spec-defined outcome | `file:line` + assertion | Ev. | Result |
| - | --------- | -------------------- | ----------------------- | --- | ------ |
| 1 | Renewal | presented credential invalidated, new one issued | `SessionServiceTest.java:150-157` | E | ✅ |
| 2 | Replaced credential reused more than 30 s after its replacement | revoke the chain, `401`, `WARN` naming the user id | `SessionServiceTest.java:181` (E). `SessionIT.java:178` (S). | E | ✅ |
| 3 | Replaced credential reused within 30 s | renew, no revocation | `SessionServiceTest.java:164`: boundary at exactly 30 s | E | ✅ |
| 4 | Two tabs renew at once | both stay signed in | `findracoApi.test.ts:294`: `lockStateAtRefresh` `toEqual([true])`, plus the 30-second grace above | E | ✅ |

### P2: Ending sessions

| # | Criterion | Spec-defined outcome | `file:line` + assertion | Ev. | Result |
| - | --------- | -------------------- | ----------------------- | --- | ------ |
| 1 | Sign out (API) | revoke the device's session, clear the cookie | `SessionIT.java:203` (S). `SessionServiceTest.java:199` (E). | E/S | ✅ (IT pending) |
| 2 | Sign out (app) | discard the token, clear the cache and the active plan, go to `/login`, no toast | `AuthProvider.test.tsx:256-266`: `/auth/logout` called, token null, cache 0, `/login`, `toast.error` not called | E | ✅ (sign-out right after a start-up expiry is untested; see A15) |
| 3 | Sign-out request fails | still do AC 2 | `AuthProvider.test.tsx:248-250`, the `it.each` case where logout fails | E | ✅ |
| 4 | Other devices | their sessions stay valid | `SessionIT.java:213`; `backend/src/test/java/com/lcs/findraco/repositories/UserSessionRepositoryIT.java:85` | S | ✅ statically sound (pending) |
| 5 | Password reset | revoke every session of the user | `backend/src/test/java/com/lcs/findraco/services/PasswordRecoveryIT.java:173,190` (S). `SessionServiceTest.java:227` (E). | S/E | ✅ statically sound (pending) |

### Edge cases

| Edge case | Evidence | Ev. | Result |
| --------- | -------- | --- | ------ |
| Token left in local storage by the old version: removed, never sent | `AuthProvider.test.tsx:153-157`; `findracoApi.test.ts:124` | E | ✅ |
| Sign-in deletes the user's expired sessions | `SessionServiceTest.java:79` (E); `UserSessionRepositoryIT.java:70` (S) | E/S | ✅ |
| Renewal fails on the network | the request fails with its normal error toast; the user stays signed in | E | ✅ `findracoApi.test.ts:224-230` checks that the error is the original `AxiosError` (not a `SessionExpiredError`), the handler is not called and the token is kept, so `buildMutationOptions` toasts it as normal (`:76`). M4 and R-F3 are killed. |
| `401` from a public endpoint: no renewal | `findracoApi.test.ts:233`. R-F2 is killed. | E | ✅ |
| Invitation link opened while signed out | after sign-in, back to the invitation | E | ✅ `PrivateRoute.test.tsx:65` carries `from`, and `LoginPage.test.tsx:123` returns to it. The final hop is fixed since iteration 1. |

**Status**: ✅ every AC (30) and edge case (5) has `file:line` evidence. There are no spec-precision gaps: the 2026-10-16 amendment resolved iteration 1's Q1 and Q2. 6 ACs have static-only evidence (Expired 1–2, Persist 2 and 8, End 4–5) and wait for `./mvnw verify`.

---

## Discrimination Sensor

**Sensor depth**: P0-expanded (auth is a critical path). The run made 24 frontend and 3 backend manual behavior-level mutations in a scratch `git worktree` at `93671fc` under the session scratch directory, with `frontend/node_modules` symlinked. For each frontend mutant, the full unit suite ran (`npx vitest run --project=unit`). Backend mutants ran `./mvnw test -Dtest=SessionServiceTest`. `git status --porcelain` of the real tree was empty before and after. The worktree was removed and pruned.

### New logic (fix commits)

| # | File:line | Mutation | Killed? (by) |
| - | --------- | -------- | ------------ |
| L1 | `frontend/src/features/login/LoginPage.tsx:58` | Return path drops `from.search` (iteration 1 survivor, re-run) | ✅ `LoginPage.test.tsx` "returns to the path and query string" |
| L2 | `LoginPage.tsx:58` | Always go to `PATHS.home`, ignoring `from` | ✅ same test |
| L3 | `LoginPage.tsx:54` | Remove `.catch(() => null)` (the F1 failed-login handling) | ✅ Vitest run fails with an unhandled rejection |
| L4 | `LoginPage.tsx:55` | Call `signIn` after a failed login | ✅ "shows the wrong-credentials message and does not sign in" |
| A12 | `frontend/src/app/providers/AuthProvider.tsx:103-104` | Toast on every expiry, including start-up on a public page (AC 9) | ✅ 3 tests (AC 9 and composition) |
| A13 | `AuthProvider.tsx:106` | Start-up expiry also navigates to `/login`, leaving the public page (AC 9) | ✅ AC 9 test + "does not announce … later opens a private page" |
| A14 | `AuthProvider.tsx:112` | `announceSessionExpiry` ignores the path (F3 path scoping) | ✅ "does not announce … later opens a private page" |
| A15 | `AuthProvider.tsx:113` | `announceSessionExpiry` no longer clears the marker (the toast is no longer one-shot) | ❌ **Survived** → fix task 1 |
| A16 | `AuthProvider.tsx:112` | `announceSessionExpiry` toasts with no guard | ✅ 3 tests (visitor, mid-session once, public-then-private) |
| A17 | `AuthProvider.tsx:107` | Start-up expiry records no marker | ✅ "takes the user from a private page … one expiry toast" |
| P5 | `frontend/src/app/routing/PrivateRoute.tsx:13` | The guard announces on `unreachable` instead of `anonymous` | ✅ same test |
| M1 | `frontend/src/api/utils/buildMutationOptions.ts:47` | Toast a `SessionExpiredError` (AC 10) | ✅ `buildMutationOptions.test.ts` "shows no error toast …" |
| M2 | `buildMutationOptions.ts:55` | Skip the caller's `onError` for a `SessionExpiredError` | ✅ same test (`onError` `toHaveBeenCalledExactlyOnceWith`) |
| M3 | `frontend/src/api/clients/findracoApi.ts:107` | Reject with the raw `401` instead of `SessionExpiredError` | ✅ `findracoApi.test.ts` "… with a session-expired error …" |
| M4 | `findracoApi.ts:106` | Wrap a renewal network failure as `SessionExpiredError` too | ✅ "rejects with the original error … without a response" |
| M5 | `findracoApi.ts:107` | `original` = the refresh error instead of the request's own `401` | ✅ `original` `toMatchObject({config:{url}})` |
| D1 | `frontend/src/features/home/components/categories/DeleteCategoryDialog.tsx:84` | `classifyDeleteError` stops recognizing `SessionExpiredError`, so the dialog would toast | ✅ `DeleteCategoryDialog.test.ts:164` |
| D2 | `DeleteCategoryDialog.tsx:126` | Remove the `session-expired` early return in `onError` | ⚪ Survived, **equivalent**. Excluded from the tally; reasoning below. |

### Regression spot check (unchanged critical paths from iteration 1)

| # | File:line | Mutation | Killed? (by) |
| - | --------- | -------- | ------------ |
| R-F1 | `findracoApi.ts:59` | No single-flight (`??=` → `=`) | ✅ 2 tests |
| R-F2 | `findracoApi.ts:95` | `/auth/*` skip removed | ✅ 5 tests |
| R-F3 | `findracoApi.ts:60` | A network failure fires the expiry handler | ✅ |
| R-A1 | `AuthProvider.tsx:92` | Query cache not cleared | ✅ 4 tests |
| R-A5 | `AuthProvider.tsx:105` | Expiry navigation drops `state.from` | ✅ |
| R-P1 | `PrivateRoute.tsx:16` | `loading` renders the outlet | ✅ |
| R-B1 | `backend/src/main/java/com/lcs/findraco/services/SessionService.java:83` | Grace boundary `isAfter` → `!isBefore` (>=) | ✅ `SessionServiceTest` |
| R-B2 | `SessionService.java:84` | Replay no longer revokes the family | ✅ |
| R-B8 | `SessionService.java:115` | Raw token stored instead of its hash | ✅ 3 tests |

**Result**: 27 injected, 25 killed, 1 survived (A15), 1 equivalent (D2, excluded). FAIL ❌.

**A15 is reachable.** It is not an equivalent mutant. A scratch-only probe test was added to the worktree copy of `AuthProvider.test.tsx` and deleted with the worktree. It does this:

1. The session expires at start-up on `/plans`; the toast count is 1.
2. `signIn`, then go to `/plans`.
3. `signOut`, then go to `/plans` again.
4. Expect the toast count to still be 1.

The probe **passes on the real code and fails with A15**. Without the reset, the guard announces the old start-up expiry again: the user gets "Your session expired" after a deliberate sign-out. Browser Back to a private page reaches this flow too. The real code is correct, but the suite does not pin the one-shot property.

**D2 is equivalent.** Without the early return, a `SessionExpiredError` is classified `"session-expired"`, which is non-null. It therefore takes the conflict branch (`setConflict` + `refetchUsage`), not the toast branch, so no toast appears either way (Expired AC 10 holds). The conflict text is set on a dialog that the expiry navigation is unmounting in the same render batch. The refetch hits a session that is already gone and ends silently, because `expireSession` from a non-authenticated status does not toast. The difference is one extra request pair and nothing the spec can observe. A component-level test for it is optional.

### Pending sensor items (IT-only; run after `./mvnw verify` with the tunnel up)

| # | File | Mutation | Expected killer |
| - | ---- | -------- | --------------- |
| I1 | `security/SessionCookies.java` | `.httpOnly(false)` / `.sameSite("Lax")` / `.path("/")` | `SessionIT.loginReturnsTheAccessTokenAndSetsTheSessionCookie` |
| I2 | `security/SessionCookies.java` | `clear()` uses `ttl` instead of `Duration.ZERO` | `SessionIT.assertCleared` |
| I3 | `security/JsonAuthenticationEntryPoint.java` | Status `403`, or a changed message | `AuthenticationIT.requestWithoutToken…`, `malformedToken…` |
| I4 | `config/SecurityConfig.java` | Remove `.exceptionHandling(...)` | `AuthenticationIT` (4 tests) |
| I5 | `exceptions/GlobalExceptionHandler.java` | `handleInvalidSession` drops the clearing `Set-Cookie` | `SessionIT.refreshWithoutACookie…` |
| I6 | `services/SessionService.java` | `rotate` loses `noRollbackFor` | `SessionIT.replacedCookieReusedAfterThirtyOneSeconds…` |
| I7 | `controllers/AuthenticationController.java` | `logout` skips `sessionService.revoke` | `SessionIT.logoutRevokesTheSessionAndClearsTheCookie` |
| I8 | `services/PasswordResetService.java` | Remove `sessionService.revokeAll(...)` | `PasswordRecoveryIT.resetRevokesEverySessionOfTheUserAndNoOtherUsers` |
| I9 | `repositories/UserSessionRepository.java` | `deleteExpiredByUser` `<=` → `<` | `UserSessionRepositoryIT.deleteExpiredByUser…` |
| I10 | `application.properties` | `jwt.expiration-ms` back to `86400000` | `AuthenticationIT.accessTokenFromLoginLivesFifteenMinutes` |

---

## Gate Check

| Gate | Command | Result |
| ---- | ------- | ------ |
| Backend compile | `cd backend && ./mvnw -q test-compile` | exit 0 |
| Backend unit | `./mvnw test -Dtest='*Test' -Dsurefire.failIfNoSpecifiedTests=false` | exit 0; 111 run, 0 failed, 0 skipped |
| Backend full | `./mvnw verify` | **not run** (DB tunnel down), pending |
| Frontend unit | `cd frontend && npm run test` | exit 0; 35 files, 355 passed; no unhandled errors or act warnings in the log |
| Frontend build | `npm run build` | exit 0 (chunk-size warning only) |
| Frontend lint | `npx eslint <20 existing feature files>` (from `git diff --diff-filter=d main..HEAD`) | exit 0; 0 errors, 6 `react-refresh/only-export-components` warnings. All 6 are on exports that already existed on `main`: `useAuth`, and the pure helpers in `DeleteCategoryDialog.tsx`. |

- **Test counts**:

  | Suite | `main` | Iteration 1 | Iteration 2 |
  | ----- | ------ | ----------- | ----------- |
  | Backend unit | 95 | 111 | 111 |
  | Frontend | 321 | 344 | 355 |

  The 11 frontend tests added in this iteration are 4 in `LoginPage`, 4 composition tests in `AuthProvider` (8 → 12; one start-up test was rewritten in place), 2 in `buildMutationOptions` and 1 in `classifyDeleteError`.
- **Test integrity**: one existing test was rewritten. T12's start-up-expiry test asserted a toast on any page; the amendment removes that behavior (Expired AC 9). The new version asserts AC 9 with more assertions than before (path, query, token, cache, plan, hint). The private-page start-up toast moved to the composition test at `AuthProvider.test.tsx:305`. The concurrent-expiry test in `findracoApi.test.ts` gained assertions and lost none. No test was deleted or weakened without a spec reason.

---

## Code Quality

| Principle | Status |
| --------- | ------ |
| Minimum code, no scope creep | ✅ `SessionExpiredError` lives in its own module because tests mock the client module; the reason is documented in tasks.md F4 |
| Surgical changes | ✅ |
| Matches patterns (service hooks, `buildMutationOptions`, named exports) | ✅ |
| No junk or dead code | ✅ `useGetUserProfile` is gone, and grep finds no new unused exports or imports |
| Spec-anchored outcome check | ✅ every assertion targets the exact spec message or state |
| Per-layer coverage | ⚠️ `AuthProvider` start-up expiry: the one-shot property is unpinned (A15) |
| Every test maps to an AC, an edge case or a Done-when item | ✅ |
| Guidelines followed: `CLAUDE.md`, `.specs/codebase/TESTING.md` | ✅ |

---

## Fix Plans

### Fix 1: Pin the one-shot start-up expiry toast (Major, test-only)

- **Root cause**: `announceSessionExpiry` clears `startUpExpiryPathRef` after it toasts (`AuthProvider.tsx:113`). No test brings an anonymous user back to the same private path after that first announcement, so removing the reset goes unnoticed (A15).
- **Fix task**: add one composition test to the "AuthProvider with PrivateRoute" suite in `frontend/src/app/providers/AuthProvider.test.tsx`:
  1. The session expires at start-up on `/plans?tab=members`; expect 1 toast.
  2. `signIn`, then go to `/plans`.
  3. `signOut` (logout resolves), then go to `/plans` again.
  4. Expect `/login`, and `toast.error` still `toHaveBeenCalledTimes(1)`.

  A smaller variant also works: after the first redirect, go to `/plans` again while still anonymous, and expect no second toast.
- **Done when**: A15 (deleting `startUpExpiryPathRef.current = null;` in `announceSessionExpiry`) fails that test, and the quick gate passes.

### Optional (not a gap): `DeleteCategoryDialog` `onError` early return

D2 is equivalent with respect to the spec. A component test would only pin the "no conflict state, no refetch" detail.

---

## Requirement Traceability Update

| Requirement | Previous | New |
| ----------- | -------- | --- |
| SESS-01 | ⏳ static | ⏳ Verified statically; IT pending |
| SESS-02 | ✅ (Q2 note) | ⚠️ AC 3–5, 9, 10 verified; A15 weak test open (Fix 1) |
| SESS-03 | ❌ Needs Fix | ✅ Verified (AC 6, 7, 8) |
| SESS-04 | ✅ (Q1 note) | ✅ Verified (Q1 resolved by amendment); API half IT pending |
| SESS-05 | ✅ | ✅ Verified |
| SESS-06 | ✅ | ✅ Verified (15-minute lifetime IT pending) |
| SESS-07 | ✅ | ✅ Verified (cookie attributes IT pending) |
| SESS-08 | ✅ | ✅ Verified |
| SESS-09 | ✅ | ✅ Verified |
| SESS-10 | ✅ | ⚠️ Verified; no test for sign-out after a start-up expiry (Fix 1) |
| SESS-11 | ⏳ static | ⏳ Verified statically; IT pending |
| SESS-12 | ❌ Needs Fix | ✅ Verified (Persist AC 10, dead code removed, invitation return) |

---

## Summary

**Overall**: ❌ Not Ready. One test-only fix remains.

**Spec-anchored check**:

| Status | Count | Items |
| ------ | ----- | ----- |
| ✅ | 35 of 35 (30 ACs + 5 edge cases) | 29 with executed evidence; 6 static-only and sound: Expired AC 1–2, Persist AC 2 and 8, End AC 4–5 |
| ⚠️ spec-precision | 0 | |

**Sensor**: 27 injected, 25 killed, 1 survived (A15), 1 equivalent (D2); 10 pending (IT).

**Gate**:
- backend: `test-compile` OK, unit 111/111;
- frontend: 355/355, build OK, eslint 0 errors;
- `./mvnw verify` is pending.

**What works**: every iteration 1 gap is closed.
- `LoginPage`: return path with query, wrong-credentials message, no "remember me", and no unhandled rejection on a failed login.
- AC 9: a public page stays silent and keeps its URL.
- AC 10: a single message on expiry, through the client, `buildMutationOptions` and the category delete.

**Next steps**:
1. Fix 1, then re-verify (iteration 3 of 3).
2. With the DB tunnel up, run `./mvnw verify`, then mutants I1–I10.

---

## Iteration 1 (summary)

FAIL ❌, at `bd23b79`.
- **Sensor**: 33 mutants, 32 killed. L1 survived: the return path dropped the query string at `LoginPage.tsx:55`, and `LoginPage` had no tests.
- **Zero evidence**: Expired AC 6 (final hop), Persist AC 10 (no "remember me"), and the UI display for Expired AC 8.
- **Dead code**: `useGetUserProfile`.
- **Spec-precision gaps**: two, about start-up expiry on a public page and the failed request's own toast after expiry.
- **Resolution**: the spec amendment of 2026-10-16 (Expired AC 4 narrowed, AC 9 and AC 10 added) plus fix tasks F1–F5. Iteration 2 confirms all of them.
