# Session Persistence Tasks

## Execution Protocol (MANDATORY -- do not skip)

Implement these tasks with the `tlc-spec-driven` skill: **activate it by name and follow its Execute flow and Critical Rules.** Do not search for skill files by filesystem path. The skill is the source of truth for the full flow (per-task cycle, sub-agent delegation, adequacy review, Verifier, discrimination sensor).

**If the skill cannot be activated, STOP and tell the user - do not proceed without it.**

---

**Design**: `.specs/features/session-persistence/design.md`
**Status**: Approved (2026-10-16) — DB tunnel down: `*IT` tests are written, not run (user runs them later)

---

## Test Coverage Matrix

> Generated from codebase, project guidelines, and spec - confirm before Execute. Guidelines found: `CLAUDE.md`, `.specs/codebase/TESTING.md`, `backend/pom.xml` (JaCoCo branch ≥ 0.80 on invariant classes), `frontend/package.json` (vitest `unit` project).

| Code Layer | Required Test Type | Coverage Expectation | Location Pattern | Run Command |
| ---------- | ------------------ | -------------------- | ---------------- | ----------- |
| Backend pure logic (`SessionService` rules, `OpaqueTokens`) | unit (JUnit 5 + Mockito, fixed `Clock`, no Spring) | All branches; 1:1 to spec ACs; every listed edge case | `backend/src/test/java/com/lcs/findraco/**/*Test.java` | `./mvnw test -Dtest=<Name>Test` |
| Backend controller / security / repository / migration | integration (`*IT` extends `AbstractIntegrationTest`, MockMvc, real JWT, real cookies) | All routes in scope: happy + every listed edge case + error paths with exact status, body message and `Set-Cookie` | `backend/src/test/java/com/lcs/findraco/**/*IT.java` | `./mvnw verify` (needs DB tunnel; empties `dev_finsight`) |
| Frontend client, service fns, providers, route guard | unit (vitest, jsdom; axios custom `adapter` for the client; `render`/`renderHook` + real `QueryClient` + `MemoryRouter`) | Every AC the unit owns: happy + edge + failure | co-located `*.test.ts(x)` | `npm run test` |
| Docs / config | none | build gate only | - | build gate |

## Gate Check Commands

> Generated from codebase - confirm before Execute. Backend from `backend/`, frontend from `frontend/`.

| Gate Level | When to Use | Command |
| ---------- | ----------- | ------- |
| Quick | Tasks with unit tests only | backend: `./mvnw test -Dtest='<Name>Test'` · frontend: `npm run test` |
| Full | Tasks with backend integration tests | `./mvnw verify` |
| Build | Phase completion, docs/config tasks | backend: `./mvnw verify` · frontend: `npm run build && npm run test && npx eslint <files touched by the feature>` (`npm run lint` has 23 pre-existing storybook/table errors; the feature adds none) |

---

## Execution Plan

Phases run in order; tasks within a phase run in order. Phase 1 ships the whole API side (deployable alone: the current SPA keeps working with a 15-minute token until Phase 2–3 land, so deploy them together).

### Phase 1: Backend sessions (SESS-01, 04, 06–11)

```
T1 → T2 → T3 → T4 → T5 → T6 → T7 → T8
```

### Phase 2: Frontend client (SESS-02, 04, 05, 07, 09)

```
T9 → T10 → T11
```

### Phase 3: Frontend app state and docs (SESS-02, 03, 10, 12)

```
T12 → T13 → T14
```

---

## Task Breakdown

### T1: Schema V12 + `UserSession` entity and repository

**What**: Flyway `V12__create_user_sessions.sql` (design DDL: IDENTITY PK, `uk` on `token_hash`, indexes on `user_id` and `family_id`, FK `ON DELETE CASCADE`), the `UserSession` entity and `UserSessionRepository` with `findByTokenHashForUpdate` (`PESSIMISTIC_WRITE`), `deleteAllByFamilyId`, `deleteAllByUser`, `deleteExpiredByUser`.
**Where**: `backend/src/main/resources/db/migration/V12__create_user_sessions.sql`
**Depends on**: None
**Reuses**: `V10__create_password_reset_tokens.sql`, `PasswordResetToken`, `PasswordResetTokenRepository`
**Requirement**: SESS-07, SESS-12

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [x] Migration applies on the full Flyway chain; `ddl-auto=validate` passes (covered by the existing `MigrationsIT`, which compares applied versions to the files on disk and boots under `validate`; not run)
- [x] `UserSessionRepositoryIT`: duplicate `token_hash` rejected; deleting a user cascades to their sessions; `deleteExpiredByUser` removes only rows with `expires_at <= now` of that user; `deleteAllByFamilyId` leaves other families intact (4 tests, written, not run)
- [x] Full gate passes (substitute gate: `test-compile` + all `*Test` unit tests green; `./mvnw verify` not run, DB tunnel down)

**Tests**: integration
**Gate**: full

---

### T2: Extract `OpaqueTokens`

**What**: Move `generateToken` / `hash` from `PasswordResetService` into `security/OpaqueTokens` (public static `generate()`, `hash(String)`), behavior unchanged; `PasswordResetService` calls it.
**Where**: `backend/src/main/java/com/lcs/findraco/security/OpaqueTokens.java`
**Depends on**: T1
**Reuses**: `PasswordResetService.generateToken`, `PasswordResetService.hash`
**Requirement**: SESS-07

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [x] `OpaqueTokensTest`: `generate()` yields 43-char Base64url without padding and differs across calls; `hash` returns the known SHA-256 hex of a fixed input and is 64 chars (3 tests, passing)
- [x] `PasswordRecoveryIT` still passes unchanged (assertions unchanged; its one `PasswordResetService.hash` call now reads `OpaqueTokens.hash` because the helper moved; compiles, not run)
- [x] Full gate passes (substitute gate: `test-compile` + all `*Test` unit tests green; `./mvnw verify` not run, DB tunnel down)

**Tests**: unit
**Gate**: full

---

### T3: `SessionService` rules

**What**: `SessionService` with `open`, `rotate`, `revoke`, `revokeAll` and the nested `IssuedSession` record, implementing the five rotation rules of the design; `AuthenticationExceptions.InvalidSessionException`; properties `app.session.ttl=P30D`, `app.session.reuse-grace=PT30S`.
**Where**: `backend/src/main/java/com/lcs/findraco/services/SessionService.java`
**Depends on**: T2
**Reuses**: `OpaqueTokens`, `JwtService`, injected `Clock`
**Requirement**: SESS-06, SESS-08, SESS-09, SESS-12

**Tools**:

- MCP: NONE
- Skill: `backend-exceptions`

**Done when**:

- [x] `SessionServiceTest` (Mockito repo, fixed `Clock`): `open` deletes the user's expired rows, saves a hash (never the raw token) with `expiresAt = now + 30d` in a new family, returns a JWT for the user's email
- [x] `rotate`: unknown → `InvalidSessionException`; `expiresAt <= now` → invalid (boundary: exactly `now` is invalid); current token → `replacedAt = now` + successor in the same family with `expiresAt = now + 30d`
- [x] `rotate` grace: replaced 30 s ago (boundary inclusive) → successor issued, nothing deleted; replaced 31 s ago → family deleted, `WARN` logged with family and user id, invalid
- [x] `revoke`: deletes the family; unknown token is a no-op. `revokeAll`: deletes every row of the user
- [x] Quick gate passes (`SessionServiceTest`: 11 tests, passing)

**Tests**: unit
**Gate**: quick

---

### T4: `401` entry point and 15-minute access token

**What**: `JsonAuthenticationEntryPoint` writing `401` + `ErrorResponseDto("Authentication required.", path)`; wired in `SecurityConfig.exceptionHandling`; `jwt.expiration-ms` default `900000`; the 24h override removed from `application-test.properties`; `.env.example` comment updated.
**Where**: `backend/src/main/java/com/lcs/findraco/security/JsonAuthenticationEntryPoint.java`
**Depends on**: T3
**Reuses**: `ErrorResponseDto`, `GlobalExceptionHandler.handleBadCredentials` body shape
**Requirement**: SESS-01, SESS-06

**Tools**:

- MCP: NONE
- Skill: `backend-exceptions`

**Done when**:

- [x] `AuthenticationIT`: protected route with no token, a malformed token, a token signed with another key, and an expired token each → `401`, body `message = "Authentication required."` (written, not run)
- [x] `AuthenticationIT`: a token from login has `exp - iat = 900` seconds (written, not run)
- [x] `PlanAuthorizationMatrixIT` passes unchanged (forbidden stays `403`/`404`, never `401`) (unchanged; every `403` it asserts uses an authenticated caller; not run)
- [x] Full gate passes (substitute gate: `test-compile` + all `*Test` unit tests green; `./mvnw verify` not run, DB tunnel down)

Note: the existing `AuthenticationIT.requestWithoutTokenIsRejectedForProtectedEndpoint` asserted the old empty `403`; SESS-01 replaces that behavior, so it now asserts `401` + "Authentication required." (5 tests added or changed in `AuthenticationIT`).

**Tests**: integration
**Gate**: full

---

### T5: Login opens a session and sets the cookie

**What**: `SessionCookies` (`issue`, `clear`, `NAME = "findraco_session"`, `app.session.cookie-secure=${SESSION_COOKIE_SECURE:true}`); `AuthenticationService.authenticate` returns `IssuedSession` via `SessionService.open`; `POST /auth/login` returns `{token}` + `Set-Cookie`; `.env.example` gains `SESSION_COOKIE_SECURE`.
**Where**: `backend/src/main/java/com/lcs/findraco/controllers/AuthenticationController.java`
**Depends on**: T4
**Reuses**: `ResponseCookie`, existing login DTOs
**Requirement**: SESS-06, SESS-07, SESS-12

**Tools**:

- MCP: NONE
- Skill: `backend-endpoint`

**Done when**:

- [x] New `SessionIT`: login → `200`, body `token` present, `Set-Cookie` `findraco_session` with `HttpOnly`, `Secure`, `SameSite=Strict`, `Path=/api/findraco/auth`, `Max-Age=2592000`; the cookie value is absent from the body (written, not run)
- [x] `SessionIT`: the DB row holds `sha256(cookie value)`, never the raw value (written, not run)
- [x] `SessionIT`: login deletes that user's expired rows (backdated via `JdbcTemplate`) and keeps another user's (written, not run)
- [x] Wrong password still `401` "Invalid username or password." with no cookie (written, not run)
- [x] Full gate passes (substitute gate: `test-compile` + all `*Test` unit tests green; `./mvnw verify` not run, DB tunnel down)

**Tests**: integration
**Gate**: full

---

### T6: `POST /auth/refresh`

**What**: Refresh endpoint (`permitAll`) reading the cookie, calling `SessionService.rotate`, returning `{token}` + new cookie; `InvalidSessionException` mapped in `GlobalExceptionHandler` to `401` "Authentication required." + cleared cookie.
**Where**: `backend/src/main/java/com/lcs/findraco/controllers/AuthenticationController.java`
**Depends on**: T5
**Reuses**: `SessionCookies`, `ApiRoutes.AUTH`
**Requirement**: SESS-04, SESS-06, SESS-08, SESS-09

**Tools**:

- MCP: NONE
- Skill: `backend-endpoint`, `backend-exceptions`

**Done when**:

- [x] `SessionIT`: refresh with a valid cookie → `200`, new token works on `/user/me`, new cookie differs from the old one, new row `expires_at ≈ now + 30d` (written, not run)
- [x] `SessionIT`: no cookie / unknown value / expired row (backdated) → `401`, body "Authentication required.", `Set-Cookie` with `Max-Age=0` (written, not run)
- [x] `SessionIT`: old cookie reused within 30 s → `200`; old cookie reused with `replaced_at` backdated 31 s → `401`, and the successor cookie of that family also → `401`, while a second login's family still refreshes (written, not run)
- [x] `SessionIT`: user deleted → refresh `401` (written, not run)
- [x] Full gate passes (substitute gate: `test-compile` + all `*Test` unit tests green; `./mvnw verify` not run, DB tunnel down)

Note: the missing-cookie rule lives in `SessionService.rotate` (null or blank token → `InvalidSessionException`) so the controller stays a single call; `SessionServiceTest.rotateWithoutATokenIsInvalid` covers the branch (7 `SessionIT` tests added).

**Tests**: integration
**Gate**: full

---

### T7: `POST /auth/logout`

**What**: Logout endpoint (`permitAll`) revoking the cookie's family when present; always `204` + cleared cookie.
**Where**: `backend/src/main/java/com/lcs/findraco/controllers/AuthenticationController.java`
**Depends on**: T6
**Reuses**: `SessionService.revoke`, `SessionCookies.clear`
**Requirement**: SESS-10

**Tools**:

- MCP: NONE
- Skill: `backend-endpoint`

**Done when**:

- [x] `SessionIT`: logout → `204` + `Max-Age=0` cookie; the same cookie then refreshes with `401` (written, not run)
- [x] `SessionIT`: a second device (separate login) still refreshes after the first logs out (written, not run)
- [x] `SessionIT`: logout with no cookie and with an expired access token → `204` (written, not run)
- [x] Full gate passes (substitute gate: `test-compile` + all `*Test` unit tests green; `./mvnw verify` not run, DB tunnel down)

Note: a missing cookie is a no-op inside `SessionService.revoke`, covered by `SessionServiceTest.revokeWithoutATokenIsANoOp` (3 `SessionIT` tests added).

**Tests**: integration
**Gate**: full

---

### T8: Password reset revokes every session

**What**: `PasswordResetService.resetPassword` calls `SessionService.revokeAll(user)` in the same transaction.
**Where**: `backend/src/main/java/com/lcs/findraco/services/PasswordResetService.java`
**Depends on**: T7
**Reuses**: `SessionService.revokeAll`
**Requirement**: SESS-11

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [x] `PasswordRecoveryIT`: two logins, reset the password, both cookies refresh with `401`; another user's session still refreshes (written, not run)
- [x] A failed reset (invalid token) revokes nothing (written, not run)
- [x] Full gate passes (substitute gate: `test-compile` + all `*Test` unit tests green; `./mvnw verify` not run, DB tunnel down)

**Tests**: integration
**Gate**: full

---

### T9: In-memory access token store

**What**: `accessToken.ts` with `getAccessToken` / `setAccessToken` holding the token in module memory only.
**Where**: `frontend/src/api/clients/accessToken.ts`
**Depends on**: None (phase order: runs after Phase 1)
**Reuses**: none
**Requirement**: SESS-07

**Tools**:

- MCP: NONE
- Skill: `api-integration`

**Done when**:

- [x] `accessToken.test.ts`: set/get/clear round-trip; setting a token writes nothing to `localStorage` or `sessionStorage` (2 tests, passing)
- [x] Quick gate passes

**Tests**: unit
**Gate**: quick

---

### T10: `logout` service fn

**What**: Raw `logout(): Promise<void>` (`POST /auth/logout`) in `useAuthService`.
**Where**: `frontend/src/api/services/useAuthService.ts`
**Depends on**: T9
**Reuses**: existing raw-fn pattern in the same file
**Requirement**: SESS-10

**Tools**:

- MCP: NONE
- Skill: `api-integration`

**Done when**:

- [x] `useAuthService.test.ts`: `logout` posts to `/auth/logout` with no body and resolves on `204` (1 test, passing)
- [x] Quick gate passes

**Tests**: unit
**Gate**: quick

---

### T11: `findracoApi` renewal interceptor

**What**: `withCredentials: true`; Bearer from the T9 store; `renewSession()` single-flight under `navigator.locks` when available; `401` handling (renew + retry once, skip `/auth/*`, network failure rejects the original error, `401` renewal fires the registered expiry handler once); `setSessionExpiredHandler`; `setAccessTokenAccessor` removed and its one call site in `AuthProvider` switched to the store.
**Where**: `frontend/src/api/clients/findracoApi.ts`
**Depends on**: T10
**Reuses**: existing interceptors
**Requirement**: SESS-02, SESS-04, SESS-05, SESS-09

**Tools**:

- MCP: NONE
- Skill: `api-integration`

**Done when**:

- [x] `findracoApi.test.ts` (custom axios adapter): a `401` on a protected route renews once and the retried request resolves with its data; three simultaneous `401`s produce exactly one `/auth/refresh` call and three retries
- [x] Renewal `401` → expiry handler called exactly once for three concurrent failures, all three reject
- [x] Renewal network error → original error rejected, expiry handler not called
- [x] `401` from `/auth/login` → no refresh call, error rejected as-is
- [x] A retried request that `401`s again is not retried a second time
- [x] With `navigator.locks` stubbed, renewal runs inside `request("findraco-session-renewal", …)`; without it, renewal still works
- [x] Requests carry `Authorization: Bearer <token>` from the store and `withCredentials: true`
- [x] Quick gate passes (`findracoApi.test.ts`: 8 tests, passing)

SPEC_DEVIATION: the design lists a `refreshSession()` raw fn in `useAuthService`; the `POST /auth/refresh` call lives inside `renewSession()` in `findracoApi.ts` instead, because `useAuthService` imports the client and the reverse import would be circular. `renewSession()` is exported and is what start-up (T12) calls. The expiry handler fires from `renewSession()` (attached to the shared promise), so a `401` at start-up reaches it too.

**Tests**: unit
**Gate**: quick

---

### T12: `AuthProvider` rewrite

**What**: Context `{ user, setUser, status, signIn, signOut, retry }` with `status: "loading" | "authenticated" | "anonymous" | "unreachable"`; start-up per design (remove legacy `localStorage["accessToken"]`, `hasSession` hint, `renewSession`, `fetchQuery(["profile"])`); `expireSession` registered via `setSessionExpiredHandler`; `STORAGE_KEYS` gains `hasSession`; `LoginPage` calls `signIn`, `Navbar` calls `signOut`.
**Where**: `frontend/src/app/providers/AuthProvider.tsx`
**Depends on**: None (phase order: runs after Phase 2)
**Reuses**: `clearSessionStorage`, `toast` (sonner), `useNavigate`/`useLocation`, `tanStackQueryClient`
**Requirement**: SESS-02, SESS-03, SESS-10, SESS-12

**Tools**:

- MCP: NONE
- Skill: `component-creation`

**Done when**:

- [ ] `AuthProvider.test.tsx`: no hint → `anonymous` with no network call; legacy `accessToken` key removed on mount
- [ ] Hint + renewal ok + profile ok → `authenticated`, `user` set
- [ ] Hint + renewal `401` → `anonymous`, toast "Your session expired. Please sign in again." once, hint removed
- [ ] Hint + renewal network error → `unreachable`; `retry()` re-runs start-up
- [ ] Expiry handler → token cleared, query cache empty, `activePlanId` and hint removed, navigates to `/login` with `state.from` = current location, toast once
- [ ] `signOut` → calls `logout`, clears the same state with no toast, navigates to `/login`; still does so when `logout` rejects
- [ ] `signIn(token)` → stores token in memory, sets hint, loads profile, `authenticated`
- [ ] Quick gate passes

**Tests**: unit
**Gate**: quick

---

### T13: `PrivateRoute` gates on session status

**What**: `PrivateRoute` reads `useAuth().status`: `loading` → full-page `Spinner`; `unreachable` → full-page "Can't reach findraco." with a Retry button calling `retry()`; `anonymous` → `Navigate` to `/login` with `state.from`; `authenticated` → `Outlet`. Delete `lib/auth.ts`; remove `accessToken` from `STORAGE_KEYS`.
**Where**: `frontend/src/app/routing/PrivateRoute.tsx`
**Depends on**: T12
**Reuses**: `Spinner`, `Button`
**Requirement**: SESS-03, SESS-12

**Tools**:

- MCP: NONE
- Skill: `component-creation`

**Done when**:

- [ ] `PrivateRoute.test.tsx`: `loading` renders the spinner and not the outlet; `unreachable` renders the message and Retry calls `retry`; `anonymous` redirects to `/login` carrying `from` (path + query); `authenticated` renders the outlet
- [ ] No remaining reference to `STORAGE_KEYS.accessToken` or `isAuthenticated`
- [ ] Build gate passes

**Tests**: unit
**Gate**: build

---

### T14: Codebase docs

**What**: Update the authentication sections of `.specs/codebase/ARCHITECTURE.md` (JWT + session flow, `user_sessions`, cookie, `401`) and the auth concern in `CONCERNS.md`.
**Where**: `.specs/codebase/ARCHITECTURE.md`
**Depends on**: T13
**Reuses**: design.md diagram
**Requirement**: SESS-07

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] ARCHITECTURE "Authentication" flow describes login → cookie, renewal, `401`, logout
- [ ] Build gate passes

**Tests**: none
**Gate**: build

---

## Phase Execution Map

```
Phase 1 → Phase 2 → Phase 3

Phase 1:  T1 → T2 → T3 → T4 → T5 → T6 → T7 → T8
Phase 2:  T9 → T10 → T11
Phase 3:  T12 → T13 → T14
```

Batches for Execute: worker 1 = Phase 1 (8 tasks), worker 2 = Phases 2–3 (6 tasks), then the Verifier.

---

## Task Granularity Check

| Task | Scope | Status |
| ---- | ----- | ------ |
| T1 | migration + entity + repository (one table) | ⚠️ cohesive |
| T2 | 1 helper class (moved) | ✅ |
| T3 | 1 service + its exception | ✅ |
| T4 | 1 entry point + its wiring/config | ⚠️ cohesive |
| T5 | login endpoint + cookie builder | ⚠️ cohesive |
| T6 | 1 endpoint + its error mapping | ✅ |
| T7 | 1 endpoint | ✅ |
| T8 | 1 call site | ✅ |
| T9 | 1 module | ✅ |
| T10 | 1 function | ✅ |
| T11 | 1 client module (+1 call-site swap to stay compiling) | ⚠️ cohesive |
| T12 | 1 provider (+2 call-site swaps to stay compiling) | ⚠️ cohesive |
| T13 | 1 component (+ dead-code removal) | ✅ |
| T14 | 1 doc | ✅ |

---

## Diagram-Definition Cross-Check

| Task | Depends On (task body) | Diagram Shows | Status |
| ---- | ---------------------- | ------------- | ------ |
| T1 | None | start of Phase 1 | ✅ |
| T2 | T1 | T1 → T2 | ✅ |
| T3 | T2 | T2 → T3 | ✅ |
| T4 | T3 | T3 → T4 | ✅ |
| T5 | T4 | T4 → T5 | ✅ |
| T6 | T5 | T5 → T6 | ✅ |
| T7 | T6 | T6 → T7 | ✅ |
| T8 | T7 | T7 → T8 | ✅ |
| T9 | None | start of Phase 2 | ✅ |
| T10 | T9 | T9 → T10 | ✅ |
| T11 | T10 | T10 → T11 | ✅ |
| T12 | None | start of Phase 3 | ✅ |
| T13 | T12 | T12 → T13 | ✅ |
| T14 | T13 | T13 → T14 | ✅ |

---

## Test Co-location Validation

| Task | Code Layer Created/Modified | Matrix Requires | Task Says | Status |
| ---- | --------------------------- | --------------- | --------- | ------ |
| T1 | migration / repository | integration | integration | ✅ |
| T2 | backend pure logic (+ service refactor) | unit (+ IT regression) | unit, full gate | ✅ |
| T3 | backend pure logic | unit | unit | ✅ |
| T4 | security / config | integration | integration | ✅ |
| T5 | controller / service | integration | integration | ✅ |
| T6 | controller / exception handler | integration | integration | ✅ |
| T7 | controller | integration | integration | ✅ |
| T8 | service | integration | integration | ✅ |
| T9 | frontend client | unit | unit | ✅ |
| T10 | frontend service fn | unit | unit | ✅ |
| T11 | frontend client | unit | unit | ✅ |
| T12 | frontend provider | unit | unit | ✅ |
| T13 | frontend route guard | unit | unit | ✅ |
| T14 | docs | none | none | ✅ |

---

## Requirement Coverage

| Requirement | Tasks |
| ----------- | ----- |
| SESS-01 | T4 |
| SESS-02 | T11, T12 |
| SESS-03 | T12, T13 |
| SESS-04 | T6, T11 |
| SESS-05 | T11 |
| SESS-06 | T3, T4, T5, T6 |
| SESS-07 | T1, T2, T5, T9, T14 |
| SESS-08 | T3, T6 |
| SESS-09 | T3, T6, T11 |
| SESS-10 | T7, T10, T12 |
| SESS-11 | T8 |
| SESS-12 | T1, T3, T5, T12, T13 |

**Coverage:** 12 total, 12 mapped to tasks, 0 unmapped
