# Session Persistence Design

**Spec**: `.specs/features/session-persistence/spec.md`
**Context**: `.specs/features/session-persistence/context.md`
**Status**: Approved (2026-10-16)

---

## Architecture Overview

Approach A (chosen by the user on 2026-10-16 over a server-side cookie session): a short-lived JWT
access token kept in memory, plus an opaque renewal credential ("session token") in an `HttpOnly`
cookie scoped to `/api/findraco/auth`, stored in the API only as a SHA-256 hash in a new
`user_sessions` table. Every renewal rotates the session token; a replayed one outside a 30-second
grace window deletes that device's whole chain. The rest of the API keeps `Authorization: Bearer`
unchanged (AD-005 untouched), so controllers, `TestAuthHelper` and Swagger need no change.

```mermaid
sequenceDiagram
    participant SPA
    participant API as API (/auth/*)
    participant DB as user_sessions

    SPA->>API: POST /auth/login {email, password}
    API->>DB: delete user's expired rows; insert row (new family)
    API-->>SPA: 200 {token: JWT 15m} + Set-Cookie findraco_session (30d)
    Note over SPA: JWT in memory only; localStorage holds only the "hasSession" hint

    SPA->>API: GET /plan/... (Bearer, expired)
    API-->>SPA: 401 "Authentication required."
    SPA->>API: POST /auth/refresh (cookie) — one call per tab, serialized across tabs
    API->>DB: lock row by hash; mark replaced; insert successor (expires now+30d)
    API-->>SPA: 200 {token} + Set-Cookie (new session token)
    SPA->>API: retry GET /plan/... (new Bearer)

    alt session expired / unknown / replayed > 30s
        API-->>SPA: 401 (+ cookie cleared)
        Note over SPA: expireSession(): clear token, cache, plan; toast once; navigate /login {from}
    end
```

---

## Code Reuse Analysis

### Existing Components to Leverage

| Component | Location | How to Use |
| --------- | -------- | ---------- |
| Opaque hashed token pattern | `backend/.../services/PasswordResetService.java` (`generateToken`, `hash`, `Clock`) | Same 32 random bytes, Base64url, SHA-256 hex hash. `hash` is package-private static there; extract both helpers to `security/OpaqueTokens` and use them from both services. |
| `PasswordResetToken` entity + V10 migration | `models/PasswordResetToken.java`, `db/migration/V10__...sql` | Shape and SQL conventions for `UserSession` / V12 (IDENTITY PK, `token_hash varchar(64)` unique, FK `ON DELETE CASCADE`). |
| `JwtService` | `security/JwtService.java` | Unchanged API; only `jwt.expiration-ms` default drops to 15 min. |
| `JwtAuthenticationFilter` | `security/JwtAuthenticationFilter.java` | Unchanged: an invalid/expired token already leaves the request anonymous; the new entry point turns that into `401`. |
| `ErrorResponseDto` | `dtos/response/ErrorResponseDto.java` | Body of every new `401` (ProblemDetail migration is a separate quick task). |
| Injected `Clock` | `config/TimeConfig.java` | `SessionService` takes `Clock` for expiry/grace math; unit tests pass a fixed clock. |
| `AbstractIntegrationTest` + `truncateAll()` | `test/.../support/` | New `SessionIT`; the new table is truncated automatically (it enumerates `information_schema`). |
| `PrivateRoute` `state.from` | `frontend/src/app/routing/PrivateRoute.tsx`, `LoginPage.tsx:55` | Return-to-page after sign-in already works; expiry navigation passes the same `from`. |
| `Spinner` | `frontend/src/components/spinner/Spinner.tsx` | Full-page loading state while the session resolves. |
| `clearSessionStorage` | `frontend/src/lib/storage.ts` | Reused by sign-out and expiry; its key list changes (`accessToken` → `hasSession`). |
| Service-hook test pattern | `frontend/src/api/services/usePlanService.test.ts` | Hook tests; the client tests use a custom axios `adapter` instead of module mocks (no new dependency). |

### Integration Points

| System | Integration Method |
| ------ | ------------------ |
| `SecurityConfig` | `exceptionHandling(authenticationEntryPoint(...))`; `/auth/refresh` and `/auth/logout` added to `permitAll`. |
| `PasswordResetService.resetPassword` | Calls `SessionService.revokeAll(user)` in the same transaction (SESS-11). |
| Database | Flyway `V12__create_user_sessions.sql`. |
| nginx (prod) | No change: `/api/` is proxied same-origin, so the cookie path `/api/findraco/auth` matches. |
| Vite dev (`:5173` → API `:3000`) | Same site (`localhost`), cross-origin: axios `withCredentials: true`; CORS already has `allowCredentials(true)`. |

---

## Components

### Backend

#### `UserSession` + `UserSessionRepository`

- **Purpose**: One row per issued session token; a device's chain shares a `familyId`.
- **Location**: `models/UserSession.java`, `repositories/UserSessionRepository.java`
- **Interfaces**:
  - `Optional<UserSession> findByTokenHashForUpdate(String hash)` — `@Lock(PESSIMISTIC_WRITE)`; serializes concurrent renewals of the same token.
  - `void deleteAllByFamilyId(UUID familyId)` — `@Modifying @Query`
  - `void deleteAllByUser(User user)` — `@Modifying @Query`
  - `void deleteExpiredByUser(User user, LocalDateTime now)` — `@Modifying @Query` (`expiresAt <= now`)
- **Reuses**: `PasswordResetToken` / `PasswordResetTokenRepository` shape.

#### `SessionService`

- **Purpose**: Session lifecycle — open, rotate, revoke. Owns all expiry, grace and replay rules.
- **Location**: `services/SessionService.java`
- **Interfaces**:
  - `IssuedSession open(User user)` — deletes the user's expired rows, creates a new family, returns `{accessToken, sessionToken}`.
  - `IssuedSession rotate(String sessionToken)` — throws `AuthenticationExceptions.InvalidSessionException` when the token is unknown, expired, or replayed outside the grace window (the latter deletes the family and logs `WARN "Session token replay detected; revoked family {familyId} of user {userId}"`).
  - `void revoke(String sessionToken)` — deletes the token's family; unknown token is a no-op.
  - `void revokeAll(User user)`
  - `record IssuedSession(String accessToken, String sessionToken)` (nested).
- **Rotation rules** (`now` from `Clock`):
  1. Row not found → invalid.
  2. `expiresAt <= now` → invalid.
  3. `replacedAt == null` → set `replacedAt = now`, insert successor in the same family with `expiresAt = now + ttl`.
  4. `replacedAt != null && now <= replacedAt + grace` → insert another successor in the same family (no revoke).
  5. `replacedAt != null && now > replacedAt + grace` → delete family, log `WARN`, invalid.
- **Config**: `app.session.ttl=P30D`, `app.session.reuse-grace=PT30S` (`Duration` properties).
- **Dependencies**: `UserSessionRepository`, `JwtService`, `Clock`.
- **Reuses**: `OpaqueTokens.generate()` / `OpaqueTokens.hash()`.

#### `OpaqueTokens`

- **Purpose**: Random token generation and SHA-256 hashing, shared by password reset and sessions.
- **Location**: `security/OpaqueTokens.java` (static helpers moved from `PasswordResetService`, behavior unchanged).

#### `SessionCookies`

- **Purpose**: Build the `Set-Cookie` header values; read the cookie name in one place.
- **Location**: `security/SessionCookies.java` (`@Component`)
- **Interfaces**:
  - `String NAME = "findraco_session"`
  - `ResponseCookie issue(String sessionToken)` — `HttpOnly; Secure(${app.session.cookie-secure:true}); SameSite=Strict; Path=/api/findraco/auth; Max-Age=<ttl seconds>`.
  - `ResponseCookie clear()` — same attributes, `Max-Age=0`.

#### `AuthenticationController` (changed) + `AuthenticationService` (changed)

- `POST /auth/login` → `200 {token}` + `Set-Cookie: issue(...)`. `AuthenticationService.authenticate` returns `IssuedSession` (calls `SessionService.open`).
- `POST /auth/refresh` (new, `permitAll`) → reads `@CookieValue(name = SessionCookies.NAME, required = false)`; missing → `InvalidSessionException`; success → `200 {token}` + new cookie.
- `POST /auth/logout` (new, `permitAll`) → `SessionService.revoke` if the cookie is present; always `204` + `Set-Cookie: clear()`.
- Controllers stay thin: one service call, cookie header from `SessionCookies`, DTO wrap.

#### `AuthenticationExceptions.InvalidSessionException` + handler

- `GlobalExceptionHandler` maps it to `401` with `ErrorResponseDto("Authentication required.", path)` **and** `Set-Cookie: clear()`.

#### `JsonAuthenticationEntryPoint`

- **Purpose**: Answer unauthenticated access to protected routes with `401` + `ErrorResponseDto` JSON instead of Spring's empty `403` (SESS-01).
- **Location**: `security/JsonAuthenticationEntryPoint.java`; wired in `SecurityConfig.exceptionHandling`.
- Authenticated-but-forbidden paths keep their current `403`/`404` (default `AccessDeniedHandler` and service-level not-found are untouched).

#### Config

- `jwt.expiration-ms` default `86400000` → `900000` (production does not set `JWT_EXPIRATION_MS`; `.env.example` comment updated). `application-test.properties` keeps 24h for the existing ITs.

### Frontend

#### `accessToken` store

- **Purpose**: The only holder of the access token — module memory, never web storage (SESS-07).
- **Location**: `src/api/clients/accessToken.ts`
- **Interfaces**: `getAccessToken(): string | null`, `setAccessToken(token: string | null): void`.
- Replaces `setAccessTokenAccessor` and the `localStorage` read in `findracoApi.ts`.

#### `findracoApi` (changed)

- **Location**: `src/api/clients/findracoApi.ts`
- `withCredentials: true`.
- Request interceptor: `Bearer ${getAccessToken()}` when set.
- Response interceptor on `401`, when the request URL does not start with `/auth/` and was not already retried:
  1. `await renewSession()` (single-flight, below); set the token; retry the original request once.
  2. If renewal answered `401` → `onSessionExpired()` (registered by `AuthProvider`) and reject.
  3. If renewal failed without a response (network) → reject the **original** error (normal toast; no sign-out).
- `renewSession(): Promise<string>` — module-level shared promise so concurrent `401`s in a tab trigger one `POST /auth/refresh` (SESS-05). Inside, the call runs under `navigator.locks.request("findraco-session-renewal", ...)` when available, so two tabs rotate one after another with the jar's latest cookie (SESS-09); the 30s grace covers browsers without the Web Locks API and lost responses.
- `onSessionExpired` fires once per failed renewal (it is attached to the shared promise, not to each request), which gives "toast once, navigate once" (SESS-02).
- `setSessionExpiredHandler(handler: () => void): void` — registration hook.

#### `useAuthService` (changed)

- `login` unchanged on the wire (`LoginResponse.token`).
- New raw fns: `refreshSession(): Promise<LoginResponse>` (used by `renewSession` and start-up), `logout(): Promise<void>`.

#### `AuthProvider` (rewritten)

- **Location**: `src/app/providers/AuthProvider.tsx`
- **Context**: `{ user, setUser, status: "loading" | "authenticated" | "anonymous", signIn(token), signOut() }` (`setAccessToken` and `isInitializing` removed; the 4 `useAuth()` consumers only read `user`, Login uses `signIn`).
- **Start-up** (SESS-03 AC7, SESS-12):
  1. Remove the legacy `localStorage["accessToken"]`.
  2. No `hasSession` hint → `anonymous` (no network call, no toast).
  3. Hint present → `refreshSession()` → set token → fetch profile (`queryClient.fetchQuery(["profile"])`, which throws on error — fixes the swallowed `refetch` failure) → `authenticated`.
  4. Renewal `401` → `expireSession()` (toast + `anonymous`).
  5. Renewal network failure → `status` stays `loading`-class "unreachable": full-page "Can't reach findraco. Retry" with a retry button (start-up has no "original request" to fail; signing out would contradict the edge case).
- **`expireSession()`** (registered with `setSessionExpiredHandler`): `setAccessToken(null)`, `queryClient.clear()`, `clearSessionStorage()`, `setUser(null)`, `status = anonymous`, `toast.error("Your session expired. Please sign in again.")`, `navigate(PATHS.login, { replace: true, state: { from: location } })`.
- **`signIn(token)`**: set token, store `hasSession`, fetch profile, `authenticated`.
- **`signOut()`**: `logout()` with errors ignored, then the same local clearing as expiry without toast, navigate to `/login` (SESS-10).

#### `PrivateRoute` (changed)

- `loading` → full-page centered `Spinner` (no private page, no layout); `anonymous` → `<Navigate to="/login" state={{ from }} replace />`; `authenticated` → `<Outlet />`. Reads `useAuth().status`; `lib/auth.ts` (`isAuthenticated`) is deleted.

#### `storage.ts`, `Navbar`, `LoginPage` (changed)

- `STORAGE_KEYS`: `accessToken` → `hasSession` (`user`, `activePlanId` kept).
- `Navbar` logout → `useAuth().signOut()`.
- `LoginPage` → `signIn(res.token)`; return-to-page logic unchanged.

---

## Data Models

### `user_sessions` (V12)

```sql
CREATE TABLE public.user_sessions (
    id          bigint NOT NULL,              -- IDENTITY, as V10
    user_id     bigint NOT NULL,              -- FK users(id) ON DELETE CASCADE
    family_id   uuid NOT NULL,                -- one per sign-in (device chain)
    token_hash  character varying(64) NOT NULL, -- UNIQUE; SHA-256 hex of the session token
    expires_at  timestamp(6) without time zone NOT NULL, -- issue time + 30 days
    replaced_at timestamp(6) without time zone,          -- set when rotated
    created_at  timestamp(6) without time zone NOT NULL
);
-- indexes: uk on token_hash, idx on user_id, idx on family_id
```

Revocation is a delete (logout: family; reset: user; replay: family). A deleted token presented later
is simply "unknown" → `401`. No `revoked_at` column is needed.

**Relationships**: many `user_sessions` → one `users`.

---

## Error Handling Strategy

| Error Scenario | Handling | User Impact |
| -------------- | -------- | ----------- |
| Protected request, missing/invalid/expired JWT | `JsonAuthenticationEntryPoint` → `401` | Silent renewal + retry |
| Renewal: token unknown, expired, or user deleted (cascade) | `InvalidSessionException` → `401` + cookie cleared | Toast "Your session expired. Please sign in again.", `/login`, then back to the page |
| Renewal: replay > 30s after rotation | Family deleted, `WARN` log, `401` | Same as above, on the device whose chain was revoked |
| Renewal: network failure mid-session | Original request rejected | Normal error toast; still signed in |
| Renewal: network failure at start-up | Full-page retry state | "Can't reach findraco." + Retry |
| Login wrong credentials (`401` on `/auth/login`) | Interceptor skips `/auth/*` | "Invalid username or password." |
| Logout request fails | Ignored; local state cleared anyway | Lands on `/login` |
| Forbidden for role / not owner | Unchanged `403` / `404` | Unchanged |

---

## Risks & Concerns

| Concern | Location (file:line) | Impact | Mitigation |
| ------- | -------------------- | ------ | ---------- |
| Profile-load failure swallowed: `refetch()` never rejects | `frontend/src/app/providers/AuthProvider.tsx:57` | Expired token kept; empty pages (the reported bug) | Rewrite uses `fetchQuery` (throws) and the interceptor's expiry path |
| Route guard trusts any stored token | `frontend/src/lib/auth.ts:7`, `app/routing/PrivateRoute.tsx:7` | Private pages render with no session | Guard reads `status` from `AuthProvider`; `lib/auth.ts` deleted |
| Logout leaves the in-memory token and query cache | `frontend/src/components/navbar/Navbar.tsx:24` | Next user on the device can see cached data from the previous one | `signOut()` clears token and `queryClient` |
| Unauthenticated → empty `403` | `backend/.../config/SecurityConfig.java:44` (no entry point) | Client can't tell expiry from forbidden | `JsonAuthenticationEntryPoint` → `401` |
| `Secure` cookie on `http://localhost` | dev only | Chrome and Firefox treat localhost as secure; I'm not certain Safari stores `Secure` cookies over plain-HTTP localhost | `app.session.cookie-secure` (`SESSION_COOKIE_SECURE`, default `true`) can be set `false` in `backend/.env` |
| Concurrent renewals of the same row | `SessionService.rotate` | Two successors or a false replay | `PESSIMISTIC_WRITE` row lock + grace window + Web Locks in the SPA |
| ITs share `dev_finsight` and use a 24h JWT | `src/test/resources/application-test.properties:15` | None for existing tests | New expiry tests mint expired JWTs explicitly or backdate rows via `JdbcTemplate` |
| Everyone is signed out on deploy | — | One extra sign-in per user | Accepted in the spec (Assumptions) |

---

## Tech Decisions (only non-obvious ones)

| Decision | Choice | Rationale |
| -------- | ------ | --------- |
| Revocation storage | Delete rows; no `revoked_at` | A missing row already yields `401`; less state to keep consistent |
| Cross-tab coordination | Web Locks API + server grace window | Locks keep the chain linear in modern browsers; grace covers the rest without a fork-prone design |
| "Has session" hint | Non-secret `localStorage["hasSession"]` | `HttpOnly` cookie is invisible to JS; the hint avoids a pointless `401` on the login page and lets start-up show the expiry toast only to returning users |
| Profile fetch at start-up | `queryClient.fetchQuery` | Throws on error, unlike `refetch()` |
| Cookie scope | `Path=/api/findraco/auth`, `SameSite=Strict` | Cookie never rides on data endpoints, so no CSRF surface on mutations |

**Project-level decision** (append to STATE as AD-009): sessions are a 15-minute bearer JWT in memory
plus a rotating, hashed `user_sessions` token in an `HttpOnly` cookie limited to `/auth/*`; the API
keeps bearer auth for every other route.
