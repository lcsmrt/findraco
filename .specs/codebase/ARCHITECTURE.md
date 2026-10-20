# Architecture

**Pattern:** Two-app monorepo — a layered Spring Boot monolith (`backend`) serving a REST API consumed by a feature-oriented React SPA (`frontend`). The apps are decoupled and communicate only over HTTP/JSON.

## High-Level Structure

```
frontend (React SPA)
  axios client (in-memory Bearer token; session cookie on /auth/*) ──► HTTP/JSON
                                     │
                                     ▼
backend  (Spring Boot, port 3000, base path /api/finsight)
  Controllers ──► Services ──► Repositories/Specifications ──► JPA Entities
       ▲                                                          │
       └────────────── Response DTOs ◄────── PostgreSQL ◄─────────┘
  Security filter chain: JwtAuthenticationFilter → CustomUserDetailsService
                          (unauthenticated → JsonAuthenticationEntryPoint → 401)
```

Every backend request is scoped to the authenticated user; ownership is re-checked in the service layer.

## Backend Patterns

### Layered Monolith

**Location:** `backend/src/main/java/com/lcs/finsight/`
**Purpose:** Separate HTTP concerns, business logic, and persistence.
**Implementation:** Package-per-layer:

- `controllers/` — thin `@RestController`s that validate input and delegate; route roots come from `utils/ApiRoutes` constants (e.g. `BASE = "/api/finsight"`, `DASHBOARD`, `FINANCIAL_TRANSACTION`, `FINANCIAL_TRANSACTION_CATEGORY`, `AUTH`, `USER`).
- `services/` — `@Transactional` business logic (`AuthenticationService`, `DashboardService`, `FinancialTransactionService`, `FinancialTransactionCategoryService`, `UserService`).
- `repositories/` — Spring Data JPA interfaces extending `JpaRepository` + `JpaSpecificationExecutor`.
- `models/` — JPA entities.
- `specifications/` — dynamic query filters built as JPA `Specification`s.
- `dtos/request` + `dtos/response` — manual entity↔DTO mapping (no MapStruct).
- `security/`, `config/`, `exceptions/`, `utils/` — cross-cutting concerns.

**Example:** `controllers/DashboardController.java` resolves the user via `@AuthenticationPrincipal` and calls `dashboardService.getSummary(...)`; it holds no business logic.

### JWT Authentication and Sessions (Security)

**Location:** `security/` (`JwtService`, `JwtAuthenticationFilter`, `JsonAuthenticationEntryPoint`, `SessionCookies`, `OpaqueTokens`, `CustomUserDetails`, `CustomUserDetailsService`) + `config/SecurityConfig` + `services/SessionService` + `models/UserSession` (`user_sessions`, V12).
**Purpose:** Bearer-token auth on every route, with a renewable 30-day session behind it (AD-009).
**Implementation:** A servlet filter validates the `Authorization: Bearer <token>` (a 15-minute JWT, `jwt.expiration-ms=900000`), extracts the email, and loads the user via `CustomUserDetailsService`. Controllers receive the principal through `@AuthenticationPrincipal`. A missing, malformed, wrongly signed or expired token leaves the request anonymous, and `JsonAuthenticationEntryPoint` answers protected routes with `401` + `ErrorResponseDto("Authentication required.")`; forbidden-for-role and not-owner keep their `403`/`404`. The session token is an opaque random value (`OpaqueTokens`) sent only in the `findraco_session` cookie (`HttpOnly`, `Secure` unless `SESSION_COOKIE_SECURE=false`, `SameSite=Strict`, `Path=/api/findraco/auth`, 30 days); `user_sessions` stores only its SHA-256 hash. `SessionService` opens, rotates and revokes sessions: each renewal replaces the token in the same device chain (`family_id`) and restarts the 30 days (`app.session.ttl`); a replaced token presented again within 30 s (`app.session.reuse-grace`) still renews, after that it deletes the whole chain and logs a `WARN`. Revocation is a row delete.

### Dynamic Filtering via Specifications

**Location:** `specifications/` + repositories implementing `JpaSpecificationExecutor`.
**Purpose:** Compose optional filters (date range, type, category) without hand-writing query permutations.
**Implementation:** Filter DTOs are translated into JPA `Specification` predicates and passed to the repository.

### Aggregation in Repository + Service

**Location:** `repositories/FinancialTransactionRepository` (JPQL) and `services/DashboardService`.
**Purpose:** Produce dashboard summaries without a reporting engine.
**Implementation:** JPQL queries `sumByUserAndTypeAndDateRange`, `findCategoryBreakdown`, and `findMonthlyTrend` (grouped by `year(startDate)`, `month(startDate)`, `type` with `SUM`); `DashboardService` assembles `DashboardSummaryDto` (`totalIncome`, `totalExpenses`, `netBalance`, `categoryBreakdown[]`, `monthlyTrend[]`). No forecasting/statistics yet.

### Domain Model

**Location:** `models/`. Three entities:

- `User` — id, name, email, password.
- `FinancialTransaction` — id, `user` (`@ManyToOne`), nullable `category` (`@ManyToOne`), `type` enum `CREDIT`/`DEBIT` stored as STRING (CREDIT = income, DEBIT = expense), `amount` (`BigDecimal`, absolute), description, `externalId` (CSV-import dedup), `frequency` (free-text recurrence hint, **not processed**), `parcelsNumber` (installments, **not processed**), `startDate`, nullable `endDate`. Indexed on `user_id`, `start_date`, and `(user_id, start_date)`.
- `FinancialTransactionCategory` — id, user, type, `description` (name), `spendingLimit` (`BigDecimal`, per-category budget).

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

**Location:** `api/clients/finsightApi.ts` + `api/services/*`.
**Purpose:** Centralize HTTP access and cache management; components never call axios directly.
**Implementation:** `findracoApi` sets `baseURL` from `VITE_FINDRACO_API_URL`, defaulting to the same-origin `/api/findraco`, sends credentials (`withCredentials`, for the session cookie in cross-origin dev), and a request interceptor injects the Bearer token from `api/clients/accessToken.ts` (module memory only). A response interceptor renews the session on a `401` from any non-`/auth/` route and retries the request once (see Authentication below). Service hooks (`useDashboardService.ts`, `useFinancialTransactionService.ts`, `useFinancialTransactionCategoryService.ts`, `useAuthService.ts`) wrap TanStack Query; mutations use `buildMutationOptions` for automatic toast + cache invalidation. Query keys follow `["entityName", params]`.
**Example:** `api/services/useDashboardService.ts` → `useGetDashboardSummary` does `finsightApi.get("/dashboard", { params })` with key `["dashboardSummary", params]`.

### Provider Composition & Routing

**Location:** `app/providers/AppProvider.tsx`, `app/routing/AppRouter.tsx`, `app/routing/paths.ts`.
**Purpose:** Wire global concerns and gate routes by auth.
**Implementation:** Providers nest `BrowserRouter → TanStackQueryProvider → AuthProvider → ConfirmDialog → CategoryFormDialog`. Auth state is exposed via `AuthProvider`/`useAuth` (React Context): `user`, `status` (`loading` / `authenticated` / `anonymous` / `unreachable`), `signIn`, `signOut`, `retry`. `AppRouter` (react-router v7) uses `PATHS` constants; `PrivateRoute` gates authenticated routes under `MainLayout` on `status` (spinner, "Can't reach findraco." + Retry, redirect to `/login` with `state.from`, or the outlet); public routes render under `AuthLayout`.

### Charts

**Location:** `components/chart/Chart.tsx` (shadcn wrapper over recharts: `ChartContainer`, `ChartTooltip`, etc.).
**Example:** `features/home/components/overview/MonthlyTrendChart.tsx`, `CategorySpendingChart.tsx`.

## Data Flow

### Authentication

1. **Sign in:** `POST /auth/login` → `AuthenticationService` verifies credentials and `SessionService.open` deletes the user's expired sessions and starts a new chain → `200 {token}` + `Set-Cookie: findraco_session`. `LoginPage` calls `AuthProvider.signIn(token)`: the JWT goes to the in-memory store, the non-secret `localStorage["hasSession"]` hint is set, and the profile loads through `queryClient.fetchQuery(["profile"])`. Nothing that grants access is written to web storage.
2. **Requests:** the request interceptor attaches `Authorization: Bearer <token>`. Backend `JwtAuthenticationFilter` validates it → `CustomUserDetailsService` loads the `User` by email → the principal is available via `@AuthenticationPrincipal`. Services re-check that the resource belongs to the authenticated user before acting.
3. **Renewal:** a `401` on a non-`/auth/` route calls `renewSession()`: one `POST /auth/refresh` per tab (shared promise), serialized across tabs with the `findraco-session-renewal` Web Lock when the browser has it. The API rotates the cookie and returns a new JWT; the original request is retried once.
4. **Start-up:** `AuthProvider` removes the legacy `localStorage["accessToken"]`; with no hint it is `anonymous` without a network call, otherwise it renews and loads the profile while `PrivateRoute` shows a full-page spinner. A renewal that fails without a response sets `unreachable` (Retry page).
5. **Expiry:** a renewal answered `401` (expired, revoked, replayed or deleted user; the API also clears the cookie) fires the session-expired handler once: it clears the token, query cache and session keys, toasts "Your session expired. Please sign in again." and, mid-session, navigates to `/login` with `state.from` so sign-in returns to the same path and query. At start-up the route guard does that redirect. A renewal network failure mid-session only rejects the original request.
6. **Sign out:** `AuthProvider.signOut` → `POST /auth/logout` (always `204`, revokes this device's chain, clears the cookie); local state is cleared and the user lands on `/login` even if the request fails. Other devices stay signed in.
7. **Password reset:** `PasswordResetService.resetPassword` calls `SessionService.revokeAll`; access tokens already issued stay valid until their 15-minute expiry.

### Transaction CRUD

1. UI in `features/home` (Transactions tab) calls `useFinancialTransactionService` hooks.
2. axios → `FinancialTransactionController` (`/api/finsight/financial-transaction`) → `FinancialTransactionService` (ownership check, `@Transactional`) → `FinancialTransactionRepository` (+ `specifications/` for filtered/paged reads).
3. Entities are mapped to response DTOs and returned; mutations trigger TanStack Query invalidation and a sonner toast via `buildMutationOptions`.

### Dashboard Aggregation

1. `useGetDashboardSummary(params)` sends `startDate`/`endDate` filters to `/api/finsight/dashboard`.
2. `DashboardController` resolves the user and calls `DashboardService.getSummary(user, start, end)`.
3. `DashboardService` runs the JPQL aggregation queries in `FinancialTransactionRepository` and assembles `DashboardSummaryDto`.
4. The SPA renders totals and recharts visualizations (`MonthlyTrendChart`, `CategorySpendingChart`).

## Code Organization

**Approach:** Layer-based on the backend, feature-based on the frontend.

**Backend module boundaries:** Single Gradle/Maven module, base package `com.lcs.finsight`; layers are separated by package (`controllers`, `services`, `repositories`, `models`, `specifications`, `dtos`, `security`, `config`, `exceptions`, `utils`). Entry point: `FinSightApplication.java`.

**Frontend module boundaries:** `@/` path alias for cross-folder imports; relative imports within a feature. Shared primitives in `components/` are purely presentational, while feature components under `features/<name>/components/` may call data hooks directly.

**Integration boundary:** The only coupling between apps is the REST contract under `/api/finsight` — backend `ApiRoutes` constants on one side, frontend axios service hooks + DTOs (`src/api/`) on the other.
