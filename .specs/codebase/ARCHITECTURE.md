# Architecture

**Pattern:** Two-app monorepo — a Spring Boot modular monolith (`backend`, packaged by feature) serving a REST API consumed by a feature-oriented React SPA (`frontend`). The apps are decoupled and communicate only over HTTP/JSON, and the committed `backend/openapi.json` is the contract between them.

## High-Level Structure

```
frontend (React SPA)
  axios client (in-memory Bearer token; session cookie on /auth/*) ──► HTTP/JSON
                                     │
                                     ▼
backend  (Spring Boot, port 3000, base path /api/findraco)
  Controller ──► Service ──► Repository/Specification ──► JPA entities (aggregates)
       ▲              │                                         │
       └── Response ◄─┘          PostgreSQL (Flyway migrations) ◄┘
  Filter chain: RequestIdFilter → RequestLogFilter → JwtAuthenticationFilter
  Every error: application/problem+json (shared.error)
```

Plan-scoped requests carry the plan in the path (`/plan/{planId}/...`); the caller's membership and role are resolved before the controller runs, and the service applies the role rules.

## Backend Patterns

### Package by feature

**Location:** `backend/src/main/java/com/lcs/findraco/`
**Purpose:** One package per domain, so a rule has one home and the boundary between domains is checked.
**Implementation:** `auth`, `user`, `plan`, `category`, `transaction`, `dashboard` plus `shared`; inside a feature the layer sub-packages `controller`, `service`, `repository`, `model`, `request`, `response`, `exception`, `config`. A feature uses another only through its `service` and `model`; `ArchitectureTest` holds that and the other structural rules. The rules and their checks are in the `backend-structure` skill; the endpoint anatomy in `backend-endpoint`.

### Aggregates and guarded entities

**Location:** each feature's `model/`.
**Purpose:** A rule valid on every entry path (HTTP, CSV import, series generation) lives with the data it protects.
**Implementation:** `Transaction` (with participants and items), `RecurrenceDefinition` (with participants and exceptions) and `Category` (with member limits) have one creation method and intention-revealing methods instead of setters, take domain values only, and carry an optimistic-lock `@Version`. Rules that need a repository, the user, the clock or another feature stay in the service.

### Authentication and sessions (Security)

**Location:** `auth/` (`config/SecurityConfig`, `JwtAuthenticationFilter`, `service/JwtService`, `SessionService`) and `shared/security`.
**Purpose:** Bearer-token auth on every route, with a renewable 30-day session behind it (AD-009).
**Implementation:** A servlet filter validates the `Authorization: Bearer <token>` (a 15-minute JWT whose subject is the user id), loads the user by id and exposes `AuthenticatedUser` to controllers (`@CurrentUser`). A missing or invalid token leaves the request anonymous and the entry point answers protected routes with a `401` problem. The session token is an opaque random value sent only in the `findraco_session` cookie (`HttpOnly`, `SameSite=Strict`, `Path=/api/findraco/auth`, 30 days); `user_sessions` stores only its SHA-256 hash. `SessionService` opens, rotates and revokes sessions: each renewal replaces the token in the same device chain (`family_id`) and restarts the 30 days; a replaced token presented again within the reuse grace (`app.session.reuse-grace`) still renews, after that it deletes the whole chain and logs a `WARN`. Passwords are hashed with Argon2id through a `DelegatingPasswordEncoder`; login, forgot-password, sign-up and CSV import are rate limited (`shared/ratelimit`).

### Roles and permissions

**Location:** `plan/service/PlanAuthorization`, `plan/controller/PlanContextArgumentResolver`.
**Implementation:** `PlanContext(planId, userId, role)` is resolved from the path (404 for a non-member). `PlanAuthorization` answers `canX` queries and enforces them with `requireX` guards; plan and transaction responses carry the same answers as permission flags, which the frontend reads without computing anything.

### Errors

**Location:** `shared/error`, each feature's `exception/`.
**Implementation:** One `application/problem+json` format with `type` `urn:findraco:problem:<slug>` (the `ProblemType` enum), `requestId` and, when one applies, `field` or `errors`. A feature throws a `DomainException`; `GlobalExceptionHandler`, the security handlers, filters and the error page all build the body through `Problems`. See the `backend-exceptions` skill.

### Dynamic filtering and paging

**Location:** `transaction/repository/TransactionSpecification`, `shared/web/PageRequests`, `LikePatterns`, `PageResponse`.
**Implementation:** Filter records are translated into JPA `Specification` predicates; every paged sort ends with `id` as a unique tiebreaker and search terms match literally.

### Aggregation and series

**Location:** `dashboard/` and `category/service` (spending), `transaction/service` (series).
**Implementation:** Report queries live in a read-only repository of the reporting feature; services return totals, partitions and the category usage verdict (`ok | warning | over`). Open-ended series are topped up by a daily job and, for a read past a plan's generated mark, by `SeriesHorizon` in its own transaction; reads never write otherwise.

### Domain model

**Location:** each feature's `model/` (entities, enums, value types). Main entities: `User`, `Plan` / `PlanMembership` / `PlanInvitation`, `Category` / `CategoryMemberLimit`, `Transaction` / `TransactionParticipant` / `TransactionItem`, `RecurrenceDefinition` (+ exceptions), `UserSession`, `PasswordResetToken`. The schema is the Flyway migrations in `backend/src/main/resources/db/migration` (read them for columns, constraints and indexes).

## Frontend Patterns

### Feature-Oriented SPA

**Location:** `frontend/src/`
**Purpose:** Group code by feature rather than technical type.
**Implementation:**

- `api/` — axios client, DTOs, and TanStack Query service hooks.
- `app/` — bootstrap: `routing/`, `providers/`.
- `components/` — shared presentational shadcn-style primitives (no data hooks).
- `features/` — self-contained feature modules (pages, components, hooks).
- `hooks/`, `lib/`, `utils/` — shared logic.

**Example:** `features/overview`, `transactions`, `categories` and `plans` are sibling features, each served at its own route (`/overview`, `/transactions`, `/categories`, `/plans`); `app/layout/MainLayout.tsx` holds the navigation between them.

### Service-Hook Data Layer

**Location:** `api/clients/findracoApi.ts` + `api/services/*`.
**Purpose:** Centralize HTTP access and cache management; components never call axios directly.
**Implementation:** `findracoApi` sets `baseURL` from `VITE_FINDRACO_API_URL`, defaulting to the same-origin `/api/findraco`, sends credentials (`withCredentials`, for the session cookie in cross-origin dev), and a request interceptor injects the Bearer token from `api/clients/accessToken.ts` (module memory only). A response interceptor renews the session on a `401` from any non-`/auth/` route and retries the request once (see Authentication below). Service hooks (one `useXxxService.ts` per domain in `api/services/`) wrap TanStack Query; mutations use `buildMutationOptions` for automatic toast + cache invalidation. Query keys follow `["entityName", params]`.
**Example:** `api/services/useDashboardService.ts` → `useGetDashboardSummary` does `findracoApi.get` on the dashboard route with key `["dashboardSummary", params]`.

### Provider Composition & Routing

**Location:** `app/providers/AppProvider.tsx`, `app/routing/AppRouter.tsx`, `app/routing/paths.ts`.
**Purpose:** Wire global concerns and gate routes by auth.
**Implementation:** Providers nest `BrowserRouter → TanStackQueryProvider → AuthProvider → ConfirmDialog → CategoryFormDialog`. Auth state is exposed via `AuthProvider`/`useAuth` (React Context): `user`, `status` (`loading` / `authenticated` / `anonymous` / `unreachable`), `signIn`, `signOut`, `retry`. `AppRouter` (react-router v7) uses `PATHS` constants; `PrivateRoute` gates authenticated routes under `MainLayout` on `status` (spinner, "Can't reach findraco." + Retry, redirect to `/login` with `state.from`, or the outlet); public routes render under `AuthLayout`.

### Charts

**Location:** `components/chart/Chart.tsx` (shadcn wrapper over recharts: `ChartContainer`, `ChartTooltip`, etc.).
**Example:** the overview feature's trend and category-spending charts.

## Data Flow

### Authentication

1. **Sign in:** `POST /auth/login` → `AuthenticationService` verifies credentials and `SessionService.open` deletes the user's expired sessions and starts a new chain → `200 {token}` + `Set-Cookie: findraco_session`. `LoginPage` calls `AuthProvider.signIn(token)`: the JWT goes to the in-memory store, the non-secret `localStorage["hasSession"]` hint is set, and the profile loads through `queryClient.fetchQuery(["profile"])`. Nothing that grants access is written to web storage.
2. **Requests:** the request interceptor attaches `Authorization: Bearer <token>`. `JwtAuthenticationFilter` validates it and loads the user by id; plan-scoped routes then resolve the `PlanContext`.
3. **Renewal:** a `401` on a non-`/auth/` route calls `renewSession()`: one `POST /auth/refresh` per tab (shared promise), serialized across tabs with the `findraco-session-renewal` Web Lock when the browser has it. The API rotates the cookie and returns a new JWT; the original request is retried once.
4. **Start-up:** `AuthProvider` removes the legacy `localStorage["accessToken"]`; with no hint it is `anonymous` without a network call, otherwise it renews and loads the profile while `PrivateRoute` shows a full-page spinner. A renewal that fails without a response sets `unreachable` (Retry page).
5. **Expiry:** a renewal answered `401` (expired, revoked, replayed or deleted user; the API also clears the cookie) fires the session-expired handler once: it clears the token, query cache and session keys, toasts "Your session expired. Please sign in again." and, mid-session, navigates to `/login` with `state.from` so sign-in returns to the same path and query. At start-up the route guard does that redirect. A renewal network failure mid-session only rejects the original request.
6. **Sign out:** `AuthProvider.signOut` → `POST /auth/logout` (always `204`, revokes this device's chain, clears the cookie); local state is cleared and the user lands on `/login` even if the request fails. Other devices stay signed in.
7. **Password reset:** `PasswordResetService.resetPassword` calls `SessionService.revokeAll`; access tokens already issued stay valid until their 15-minute expiry.

### Transaction CRUD

1. The transactions feature calls the `useTransactionService` hooks.
2. axios → `TransactionController` (`/api/findraco/plan/{planId}/transaction`) → `TransactionService` (role guard, the aggregate's rules, `@Transactional`) → `TransactionRepository` (+ `TransactionSpecification` for filtered, paged reads).
3. The service returns the `TransactionResponse` (with its `version` and permission flags); mutations trigger TanStack Query invalidation and a sonner toast via `buildMutationOptions`, and a `stale-version` answer reloads the edited item.

### Dashboard aggregation

1. `useGetDashboardSummary(params)` sends `startDate`/`endDate` to the plan's dashboard route.
2. `DashboardController` resolves the `PlanContext` and calls `DashboardService`, which first makes sure the plan's open-ended series cover the period.
3. `DashboardService` runs the report queries of `DashboardReportRepository` and assembles the summary.
4. The SPA renders totals and recharts visualizations.

## Code Organization

**Approach:** Feature-based on both sides: packages by feature on the backend, feature folders on the frontend.

**Backend module boundaries:** Single Maven module, base package `com.lcs.findraco`, entry point `FindracoApplication`; the structure rules are checked by `ArchitectureTest`.

**Frontend module boundaries:** `@/` path alias for cross-folder imports; relative imports within a feature. Shared primitives in `components/` are purely presentational, while feature components under `features/<name>/components/` may call data hooks directly.

**Integration boundary:** The only coupling between apps is the REST contract under `/api/findraco`, described by `backend/openapi.json`, with the axios service hooks and types (`src/api/`) on the other side.
