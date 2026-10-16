# Session Persistence Validation

## Validation: session-persistence (iteration 3) - PASS ✅

**Date**: 2026-10-16
**Spec**: `.specs/features/session-persistence/spec.md` (amended 2026-10-16: Expired AC 4 is narrowed to private pages; AC 9 and AC 10 are new). The spec has not changed since iteration 2.
**Diff range**: `main..feat/session-persistence` (`6fc0bb5`..`859a035`, 22 commits, 50 files). The only change since iteration 2 is `859a035` (F6). It touches only `frontend/src/app/providers/AuthProvider.test.tsx` (+19 lines) and `tasks.md`. No production file changed.
**Verifier**: an independent sub-agent (the author is not the verifier). It worked read-only over the real tree.
**Environment**: the Postgres SSH tunnel is down (user decision), so no `*IT` ran. Evidence that comes only from an `*IT` is marked **S** (static, IT not executed). Such evidence does not force a FAIL on its own.

> **Pending (does not block this verdict):**
> 1. Run `cd backend && ./mvnw verify` with the DB tunnel up. It covers `SessionIT`, `AuthenticationIT`, `PasswordRecoveryIT`, `UserSessionRepositoryIT`, `MigrationsIT` and `PlanAuthorizationMatrixIT`.
> 2. After it passes, run IT mutations I1–I10 (listed below).
>
> The backend has not changed since iteration 1, so this list is the same as before.

**Why PASS**:
- F6 adds one composition test. It is anchored to the spec and kills A15, the only survivor from iteration 2.
- 13 earlier killed mutants were re-run across the client, provider, guard, login page, mutation options and the backend service. All of them still die.
- Every AC and edge case has `file:line` evidence.
- All runnable gates pass.
- No real behavior gap, dead code or junk was added.

---

## Task Completion

| Task | Status | Notes |
| ---- | ------ | ----- |
| T1–T14 | ✅ Done | Unchanged. The `*IT` Done-when items are still "written, not run". |
| F1–F5 | ✅ Done | Unchanged since iteration 2. No production file changed after `93671fc`. |
| F6 Start-up expiry toast is announced once | ✅ Done | Test only, at `frontend/src/app/providers/AuthProvider.test.tsx:350-367`. A15 is killed (see below). |

---

## Spec-Anchored Acceptance Criteria

Legend: **E** = executed in this run; **S** = static, IT not executed. Test paths are relative to `frontend/src/` unless they start with `backend/`. F6 inserted 19 lines at `AuthProvider.test.tsx:350`. Citations in that file above line 349 did not move; the visitor test moved from `:354` to `:373`.

### P1: Expired session sends me to login

| # | Criterion | Spec-defined outcome | `file:line` + assertion | Ev. | Result |
| - | --------- | -------------------- | ----------------------- | --- | ------ |
| 1 | The token is missing, malformed, wrongly signed or expired | `401` with message "Authentication required." | `backend/src/test/java/com/lcs/findraco/security/AuthenticationIT.java:211,218,226,243`: `status().isUnauthorized()` + `jsonPath("$.message").value("Authentication required.")` | S | ✅ statically sound (pending) |
| 2 | Forbidden by role or ownership | the same `403`/`404` as today, never `401` | `backend/src/test/java/com/lcs/findraco/security/PlanAuthorizationMatrixIT.java:108,152,183,206,246`: `isForbidden()`; `:83,121,221,266`: `isNotFound()` | S | ✅ statically sound (pending) |
| 3 | Renewal fails after a protected `401` | discard the token, clear the cache and the active plan, go to `/login` | `app/providers/AuthProvider.test.tsx:229-235`: `getAccessToken()` is null, `getQueryCache().getAll()` has length 0, `activePlanId` and `hasSession` are null, `pathname` is `/login`. The same result through `PrivateRoute` after a start-up expiry: `:311-318`. | E | ✅ |
| 4 | Sent to `/login` from a **private** page because of an expiry | toast "Your session expired. Please sign in again." | Mid-session: `AuthProvider.test.tsx:333-334`, with `toHaveBeenCalledTimes(1)` + `toHaveBeenCalledWith(SESSION_EXPIRED_MESSAGE)`. Start-up on `/plans`: `:315-316`, same assertions. Shown **only once**: `:366`, where `toHaveBeenCalledTimes(1)` still holds after sign-in, sign-out and reopening `/plans` (F6). No toast for a visitor who never signed in: `:373`. | E | ✅ (the one-shot property is now pinned) |
| 5 | Several `401`s at once, renewal fails | one toast, one navigation | `api/clients/findracoApi.test.ts:214-215`: `callsTo("/auth/refresh")` has length 1, and `expiredHandler` `toHaveBeenCalledTimes(1)`. The handler toasts once per call: `AuthProvider.test.tsx:239`. | E | ✅ |
| 6 | Sign-in after an expiry redirect | go to the previous path **and query** | `features/login/LoginPage.test.tsx:123`: the location is `toBe("/plans?x=1")` from `state.from`. Producers: `AuthProvider.test.tsx:236-238` and `:312-314`. | E | ✅ |
| 7 | Session still resolving at start-up | full-page loading, no private page | `app/routing/PrivateRoute.test.tsx:50`: `getByRole("status",{name:"Loading"})`, and the private page is absent. `AuthProvider.test.tsx:166`: `loading` before the renewal settles. | E | ✅ |
| 8 | Wrong credentials | show "Invalid username or password."; no renewal; no expiry toast | `LoginPage.test.tsx:148-154`: `toast.error` is called with "Invalid username or password." exactly once, `signIn` is not called, and there is a single `post`. No renewal: `findracoApi.test.ts:233`. API side: `backend/src/test/java/com/lcs/findraco/security/SessionIT.java:113` (S). | E | ✅ |
| 9 | Start-up expiry on a public page | stay on the page, clear the session as in AC 3, no toast | `AuthProvider.test.tsx:184-191`: on `/reset-password?token=abc`, `pathname` and `search` are unchanged and `toast.error` is not called. The token is null, the cache is empty, and `activePlanId` and `hasSession` are null. A later in-app move to `/plans` shows no toast either: `:344-347`. | E | ✅ |
| 10 | Request fails because renewal failed | no toast for that request's own error | Client: `findracoApi.test.ts:206-213`: each of the 3 rejections is `toBeInstanceOf(SessionExpiredError)`, with `original` set to its own `401`. Shared toast: `api/utils/buildMutationOptions.test.ts:61-62`: `toast.error` is not called, and the caller's `onError` is still called. Other errors still toast: `:76-79`. Category delete: `features/home/components/categories/DeleteCategoryDialog.test.ts:164`. | E | ✅ |

### P1: Stay signed in while I keep using the app

| # | Criterion | Spec-defined outcome | `file:line` + assertion | Ev. | Result |
| - | --------- | -------------------- | ----------------------- | --- | ------ |
| 1 | Sign-in creates a session | expires after 30 days without a renewal | `backend/src/test/java/com/lcs/findraco/services/SessionServiceTest.java:96`: `getExpiresAt()` `isEqualTo(NOW.plusDays(30))` (E). `SessionIT.java:82`: `Max-Age` 2592000 (S). | E | ✅ |
| 2 | Access token lifetime | 15 minutes | `AuthenticationIT.java:264`: `exp - iat` `isEqualTo(900)` | S | ✅ statically sound (pending) |
| 3 | `401` while the session is valid | renew, retry once, show the result, no redirect, no toast | `findracoApi.test.ts:142-156`: the data is the retried response, there is 1 refresh, and the expiry handler is not called | E | ✅ |
| 4 | Several `401`s at once while the session is valid | one renewal, every request retried | `findracoApi.test.ts:176`: `callsTo("/auth/refresh")` has length 1, and each request is retried with the new Bearer token | E | ✅ |
| 5 | Renewal | expiry = renewal time + 30 days | `SessionServiceTest.java:154`: `isEqualTo(NOW.plusDays(30))` | E | ✅ |
| 6 | App opened while the session is valid | the private page, never the login page | `AuthProvider.test.tsx:160-170`: `loading` → `authenticated`. `PrivateRoute.test.tsx:78`: the outlet renders. | E | ✅ |
| 7 | Renewal of an expired, revoked or deleted-user session | API answers `401`; the app does AC 3–4 on a private page and AC 9 on a public page | API: `SessionServiceTest.java:114,132` (E), `SessionIT.java:161,191` (S). App, private page: `AuthProvider.test.tsx:305-319`. App, public page: `:174-192`. | E/S | ✅ |
| 8 | Renewal credential storage | cookie is `HttpOnly`, `Secure`, `SameSite=Strict`, scoped to the auth path; never in a body | `SessionIT.java:76-83,137-143` | S | ✅ statically sound (pending) |
| 9 | No web storage of the token or the credential | nothing in local or session storage, nor in IndexedDB | `api/clients/accessToken.test.ts:28`: the `setItem` spy is never called. `AuthProvider.test.tsx:279`: the legacy key is null after `signIn`. | E | ✅ |
| 10 | Login page | no "remember me" option | `LoginPage.test.tsx:163-164`: `queryByRole("checkbox")` is null and `queryByText(/remember/i)` is null | E | ✅ |
| 11 | Credential at rest | SHA-256 hash only | `SessionServiceTest.java:93-95`. `backend/src/test/java/com/lcs/findraco/security/OpaqueTokensTest.java:27`. | E | ✅ |

### P1: A stolen renewal credential is contained

| # | Criterion | Spec-defined outcome | `file:line` + assertion | Ev. | Result |
| - | --------- | -------------------- | ----------------------- | --- | ------ |
| 1 | Renewal | the presented credential is invalidated and a new one is issued | `SessionServiceTest.java:150-157` | E | ✅ |
| 2 | Replaced credential reused more than 30 s after its replacement | revoke the chain, `401`, `WARN` naming the user id | `SessionServiceTest.java:181` (E). `SessionIT.java:178` (S). | E | ✅ |
| 3 | Replaced credential reused within 30 s | renew, no revocation | `SessionServiceTest.java:164`: the boundary at exactly 30 s | E | ✅ |
| 4 | Two tabs renew at once | both stay signed in | `findracoApi.test.ts:294`: `lockStateAtRefresh` `toEqual([true])`, plus the 30-second grace above | E | ✅ |

### P2: Ending sessions

| # | Criterion | Spec-defined outcome | `file:line` + assertion | Ev. | Result |
| - | --------- | -------------------- | ----------------------- | --- | ------ |
| 1 | Sign out (API) | revoke the device's session, clear the cookie | `SessionIT.java:203` (S). `SessionServiceTest.java:199` (E). | E/S | ✅ (IT pending) |
| 2 | Sign out (app) | discard the token, clear the cache and the active plan, go to `/login`, no toast | `AuthProvider.test.tsx:256-266`: `/auth/logout` is called, the token is null, the cache is empty, the path is `/login`, and `toast.error` is not called. After a start-up expiry, sign-out and reopening a private page add no toast: `:366` (F6). | E | ✅ |
| 3 | Sign-out request fails | still do AC 2 | `AuthProvider.test.tsx:248-250`, the `it.each` case where logout fails | E | ✅ |
| 4 | Other devices | their sessions stay valid | `SessionIT.java:213`; `backend/src/test/java/com/lcs/findraco/repositories/UserSessionRepositoryIT.java:85` | S | ✅ statically sound (pending) |
| 5 | Password reset | revoke every session of the user | `backend/src/test/java/com/lcs/findraco/services/PasswordRecoveryIT.java:173,190` (S). `SessionServiceTest.java:227` (E). | S/E | ✅ statically sound (pending) |

### Edge cases

| Edge case | Evidence | Ev. | Result |
| --------- | -------- | --- | ------ |
| Token left in local storage by the old version: removed, never sent | `AuthProvider.test.tsx:153-157`; `findracoApi.test.ts:124` | E | ✅ |
| Sign-in deletes the user's expired sessions | `SessionServiceTest.java:79` (E); `UserSessionRepositoryIT.java:70` (S) | E/S | ✅ |
| Renewal fails on the network: the request fails with its normal error toast and the user stays signed in | `findracoApi.test.ts:224-230`: the original `AxiosError` is kept, the handler is not called, and the token is kept. `buildMutationOptions.test.ts:76` shows the normal toast. | E | ✅ |
| `401` from a public endpoint: no renewal | `findracoApi.test.ts:233` | E | ✅ |
| Invitation link opened while signed out: after sign-in, back to the invitation | `PrivateRoute.test.tsx:65` carries `from`, and `LoginPage.test.tsx:123` returns to it | E | ✅ |

**Status**: ✅ every AC (30) and edge case (5) has `file:line` evidence, and there are 0 spec-precision gaps. 6 ACs have static-only evidence (Expired 1–2, Persist 2 and 8, End 4–5) and wait for `./mvnw verify`.

### F6 spec-anchoring check

- The F6 test (`AuthProvider.test.tsx:350-367`) asserts `toHaveBeenCalledTimes(1)` twice:
  - at `:355`, after the start-up redirect;
  - at `:366`, after sign-in, sign-out (End AC 2: no toast) and reopening `/plans` while anonymous (Expired AC 4: a toast only for an expiry).
- This exact count is the spec outcome. Any extra call is a false expiry message.
- The text of the single call is pinned by the sibling test, which has the same setup: `:316`, `toHaveBeenCalledWith(SESSION_EXPIRED_MESSAGE)`. The constant at `:49` equals "Your session expired. Please sign in again.", the spec's wording.
- Together, the two tests pin "exactly one toast, with the spec's message".
- F6 does not repeat the message assertion. This is a non-blocking style note, not a gap: a mutant that changes the message is killed at `:316`.

---

## Discrimination Sensor

**Sensor depth**: P0-expanded (auth is a critical path).

**Setup**:
- Scratch: `git worktree add --detach <scratchpad>/wt HEAD` at `859a035`, with `frontend/node_modules` symlinked.
- Runner: a script applied one exact-match edit per mutant, ran the tests, then ran `git checkout -- <file>` in the worktree and checked that the file was byte-identical to the original.
- Frontend mutants ran the full unit suite: `npx vitest run --project=unit`, 356 tests.
- Backend mutants ran `./mvnw -q test -Dtest=SessionServiceTest`.
- The baseline in the scratch was 356/356 passing.

**Isolation**:
- `git status --porcelain` of the real tree was empty before and after.
- The worktree was removed with `--force` and pruned.
- `git worktree list` shows only the main tree.

### Iteration 2 survivor

| # | File:line | Mutation | Killed? (by) |
| - | --------- | -------- | ------------ |
| A15 | `frontend/src/app/providers/AuthProvider.tsx:113` | Delete `startUpExpiryPathRef.current = null;`, so the start-up expiry toast is no longer one-shot | ✅ **Killed** by exactly one test, "announces a start-up expiry only once, not again after signing in and out". The failure is `AuthProvider.test.tsx:366`: "expected "spy" to be called 1 times, but got 3 times". |

On the real code, the F6 test passed in all 3 isolated runs of `AuthProvider.test.tsx` (13/13 each) and in the full suite. No flakiness was seen.

### Regression spot check (iteration 2 killed mutants, re-run)

| # | File:line | Mutation | Killed? (by) |
| - | --------- | -------- | ------------ |
| R-F1 | `frontend/src/api/clients/findracoApi.ts:58` | No single-flight (`??=` → `=`) | ✅ 2 tests (Persist AC 4, Expired AC 5) |
| R-F2 | `findracoApi.ts:95` | Remove the `/auth/*` skip | ✅ 5 tests |
| M3 | `findracoApi.ts:107` | Reject with the raw `401` instead of `SessionExpiredError` | ✅ "… rejects all three requests with a session-expired error …" |
| R-A1 | `AuthProvider.tsx:92` | Do not clear the query cache | ✅ 4 tests |
| A16 | `AuthProvider.tsx:112` | `announceSessionExpiry` toasts with no path guard | ✅ 4 tests (including F6) |
| A17 | `AuthProvider.tsx:107` | Start-up expiry records no marker | ✅ 2 tests (including F6) |
| P5 | `frontend/src/app/routing/PrivateRoute.tsx:13` | The guard announces on `unreachable` instead of `anonymous` | ✅ 2 tests (including F6) |
| R-P1 | `PrivateRoute.tsx:16` | `loading` renders the outlet | ✅ "renders a full-page spinner …" |
| L1 | `frontend/src/features/login/LoginPage.tsx:58` | The return path drops `from.search` | ✅ "returns to the path and query string …" |
| M1 | `frontend/src/api/utils/buildMutationOptions.ts:47` | Toast a `SessionExpiredError` (Expired AC 10) | ✅ "shows no error toast when the session could not be renewed …" |
| R-B1 | `backend/src/main/java/com/lcs/findraco/services/SessionService.java:83` | Grace boundary `isAfter` → `!isBefore` | ✅ `SessionServiceTest` (13 run, 1 error) |
| R-B2 | `SessionService.java:84` | A replay no longer revokes the family | ✅ `rotateTokenReplacedThirtyOneSecondsAgoRevokesTheFamily…` |
| R-B8 | `SessionService.java:115` | Store the raw token instead of its hash | ✅ 3 tests |

### Equivalent (carried over, not re-run; the source has not changed since `93671fc`)

| # | File:line | Mutation | Status |
| - | --------- | -------- | ------ |
| D2 | `frontend/src/features/home/components/categories/DeleteCategoryDialog.tsx:126` | Remove the `session-expired` early return in `onError` | ⚪ Equivalent; excluded from the tally |

D2 changes nothing the spec can observe:
- Without the early return, a `SessionExpiredError` is classified as `"session-expired"`, which is not null.
- It therefore takes the conflict branch, not the toast branch. No toast appears either way, so Expired AC 10 holds.
- The only difference is a conflict state set on a dialog that is unmounting, plus one extra refetch on a session that is already gone.

**Result**: 14 injected, 14 killed, 0 survived; 1 equivalent (D2, documented); 10 pending (IT, below). PASS ✅

**Cumulative across iterations**:
- Iteration 1: 33 injected.
- Iteration 2: 27 injected.
- Iteration 3: 14 injected.
- Every executed non-equivalent mutant is now killed.

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
| Backend unit | `./mvnw test -Dtest='*Test' -Dsurefire.failIfNoSpecifiedTests=false` | exit 0; 111 run, 0 failed, 0 skipped; BUILD SUCCESS |
| Backend full | `./mvnw verify` | **not run** (DB tunnel down); pending |
| Frontend unit | `cd frontend && npm run test` | exit 0; 35 files, 356 passed; no unhandled errors |
| Frontend build | `npm run build` | exit 0 (chunk-size warning only) |
| Frontend lint | `npx eslint <20 feature files>` (from `git diff --name-only --diff-filter=d main..HEAD`) | exit 0; 0 errors, 6 `react-refresh/only-export-components` warnings, all on exports that already existed (`useAuth`, the `DeleteCategoryDialog` helpers). `npm run lint` has 23 errors that predate this feature and are unrelated to it. |

- **Test counts**:

  | Suite | `main` | Iteration 1 | Iteration 2 | Iteration 3 |
  | ----- | ------ | ----------- | ----------- | ----------- |
  | Backend unit | 95 | 111 | 111 | 111 |
  | Frontend | 321 | 344 | 355 | 356 |

- **Test integrity**: F6 adds 1 test. No test was deleted, changed or weakened (`git show 859a035` is additions only in the test file).
- The real tree was unchanged after the gates (`git status --porcelain` is empty).

---

## Code Quality

| Principle | Status |
| --------- | ------ |
| Minimum code, no scope creep | ✅ F6 is test-only, with 19 lines in one existing suite. It reuses `renderApp`, `renewAnswers401`, `navigateTo` and `auth`. |
| Surgical changes | ✅ Only `AuthProvider.test.tsx` and the F6 entry in `tasks.md` changed |
| Matches patterns | ✅ Same style as the sibling composition tests |
| No junk or dead code | ✅ No production change. Nothing new is unused. |
| Spec-anchored outcome check | ✅ The exact toast count, plus the message pinned at `:316` |
| Per-layer coverage | ✅ The one-shot start-up expiry is now pinned (A15 killed) |
| Every test maps to an AC, an edge case or a Done-when item | ✅ F6 maps to Expired AC 4 and End AC 2 |
| Guidelines followed: `CLAUDE.md`, `.specs/codebase/TESTING.md` | ✅ |

---

## Fix Plans

None. There are no open gaps.

Optional, not a gap: a component test for the D2 early return in `DeleteCategoryDialog`. It would only pin the "no conflict state, no refetch" detail.

---

## Requirement Traceability Update

| Requirement | Previous | New |
| ----------- | -------- | --- |
| SESS-01 | ⏳ Verified statically; IT pending | ⏳ Verified statically; IT pending |
| SESS-02 | ⚠️ A15 open | ✅ Verified (AC 3–5, 9, 10; one-shot toast pinned) |
| SESS-03 | ✅ | ✅ Verified |
| SESS-04 | ✅; API half IT pending | ✅ Verified; API half IT pending |
| SESS-05 | ✅ | ✅ Verified |
| SESS-06 | ✅ (15-minute lifetime IT pending) | ✅ Verified (15-minute lifetime IT pending) |
| SESS-07 | ✅ (cookie attributes IT pending) | ✅ Verified (cookie attributes IT pending) |
| SESS-08 | ✅ | ✅ Verified |
| SESS-09 | ✅ | ✅ Verified |
| SESS-10 | ⚠️ sign-out after a start-up expiry untested | ✅ Verified (`AuthProvider.test.tsx:366`) |
| SESS-11 | ⏳ Verified statically; IT pending | ⏳ Verified statically; IT pending |
| SESS-12 | ✅ | ✅ Verified |

---

## Summary

**Overall**: ✅ Ready, with the IT run pending.

**Spec-anchored check**: 35 of 35 (30 ACs + 5 edge cases) have evidence. 29 are executed; 6 are static-only and sound (Expired AC 1–2, Persist AC 2 and 8, End AC 4–5). There are 0 spec-precision gaps.

**Sensor**: 14 injected, 14 killed, 0 survived; 1 equivalent (D2); 10 pending (IT, I1–I10).

**Gate**:
- Backend: `test-compile` OK, unit tests 111/111.
- Frontend: 356/356 tests, build OK, eslint 0 errors.
- `./mvnw verify` is pending.

**Next steps**:
1. With the DB tunnel up, run `cd backend && ./mvnw verify`. All 6 IT classes must pass.
2. Then run mutants I1–I10 in a scratch worktree. Any survivor reopens validation.
3. Interactive UAT is optional for the expiry and sign-out flows.

---

## Iteration 2 (summary)

The verdict was FAIL ❌, at `93671fc`.
- **Sensor**: 27 mutants injected, 25 killed, D2 equivalent.
- **Survivor**: A15 survived. Removing `startUpExpiryPathRef.current = null;` at `AuthProvider.tsx:113` re-announced the start-up expiry toast after sign-in → sign-out → reopening a private page.
- **Evidence**: every AC and edge case had evidence. F1–F5 closed every iteration 1 gap.
- **Resolution**: fix task F6 (`859a035`), which iteration 3 confirms.

## Iteration 1 (summary)

The verdict was FAIL ❌, at `bd23b79`.
- **Sensor**: 33 mutants, 32 killed. L1 survived: the return path dropped the query string at `LoginPage.tsx:55`, and `LoginPage` had no tests.
- **Zero evidence**: Expired AC 6 (final hop), Persist AC 10 (no "remember me"), and the UI display for Expired AC 8.
- **Dead code**: `useGetUserProfile`.
- **Spec-precision gaps**: two, about start-up expiry on a public page and about the failed request's own toast after an expiry.
- **Resolution**: the spec amendment of 2026-10-16 plus fix tasks F1–F5.

## Addendum: IT run (2026-10-16, after iteration 3)

The DB tunnel came back up, which closes both pending items.

- **Gate**: `cd backend && ./mvnw verify` exit 0. Surefire ran 118 tests (the 111 unit tests plus the context-booting tests that need the DB) and failsafe ran 176; there were 0 failures, 0 errors and 0 skipped. `jacoco:check` passed.
- **IT mutants**: each mutant was applied to the real tree, the target IT class ran (`-Dit.test=<class> -Dtest=NONE -Djacoco.skip=true`) and the file was restored with `git checkout`. I1 and I3 were split into their variants.

| # | Mutation | Result | Killed by |
| - | -------- | ------ | --------- |
| I1a | `.httpOnly(false)` | ✅ Killed | `SessionIT.loginReturnsTheAccessTokenAndSetsTheSessionCookie:78` (+1) |
| I1b | `.sameSite("Lax")` | ✅ Killed | `SessionIT.loginReturnsTheAccessTokenAndSetsTheSessionCookie:80` (+1) |
| I1c | `.path("/")` | ✅ Killed | 9 `SessionIT` tests |
| I2 | `clear()` uses `ttl` | ✅ Killed | 7 `SessionIT` tests (`assertCleared`) |
| I3a | Entry point status `403` | ✅ Killed | 4 `AuthenticationIT` tests |
| I3b | Entry point message changed | ✅ Killed | 4 `AuthenticationIT` tests |
| I4 | Remove `.exceptionHandling(...)` | ✅ Killed | 4 `AuthenticationIT` tests |
| I5 | `handleInvalidSession` drops the clearing `Set-Cookie` | ✅ Killed | 6 `SessionIT` tests |
| I6 | `rotate` loses `noRollbackFor` | ✅ Killed | `SessionIT.replacedCookieReusedAfterThirtyOneSecondsRevokesItsDeviceChainOnly:187` (401 expected, 200 returned) |
| I7 | `logout` skips `sessionService.revoke` | ✅ Killed | `SessionIT.logoutRevokesTheSessionAndClearsTheCookie:209` |
| I8 | Reset skips `sessionService.revokeAll` | ✅ Killed | `PasswordRecoveryIT.resetRevokesEverySessionOfTheUserAndNoOtherUsers:184` |
| I9 | `deleteExpiredByUser` `<=` → `<` | ✅ Killed | `UserSessionRepositoryIT.deleteExpiredByUserRemovesOnlyThatUsersRowsExpiredAtOrBeforeNow:81` |
| I10 | `jwt.expiration-ms` default `86400000` | ✅ Killed | `AuthenticationIT.accessTokenFromLoginLivesFifteenMinutes:264` |

**Result**: 13 injected, 13 killed, 0 survived. `git status` was clean afterwards.

**Traceability**: SESS-01, 06, 07, 10 and 11 move to Verified. All 12 requirements are now Verified. The 6 static-only criteria (Expired AC 1–2, Persist AC 2 and 8, End AC 4–5) are now executed.

**Overall**: ✅ Ready. Remaining: merge and deploy (backend and frontend together), then UAT in prod.
