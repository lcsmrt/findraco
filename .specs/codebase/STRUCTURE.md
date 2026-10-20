# Project Structure

**Root:** `/home/lcs/dev/finsight` (monorepo: `backend/` + `frontend/`)

## Directory Tree

```
finsight/
  docker-compose.yml               Production stack (finsight-api + finsight-web)
  DEPLOY.md                        Portainer deploy procedure
  backend/
    Dockerfile                     Maven build → JRE runtime image
    src/main/java/com/lcs/finsight/
      FinSightApplication.java     Spring Boot entrypoint
      config/                      OpenApiConfig, SecurityConfig
      controllers/                 REST controllers (@RestController)
      services/                    Business logic (@Service, @Transactional)
      repositories/                Spring Data JPA repositories
      models/                      JPA entities + enums
      dtos/
        request/                   Inbound request + filter DTOs
        response/                  Outbound response DTOs
      specifications/              JPA Specification query builders
      security/                    JWT filter/service, UserDetails
      exceptions/                  GlobalExceptionHandler + typed exceptions
      utils/                       ApiRoutes constants, DateUtils
  .github/workflows/
    ci.yml                         CI per push, each app job only when that app changed; deploy gated by CI
  frontend/
    Dockerfile                     Vite build → nginx runtime image
    nginx.conf                     Serves the SPA, proxies /api/ to the API on the host
    eslint.config.js               Layered import/syntax restrictions built from named fragments
    eslint.config.test.ts          Asserts every fragment per layer (tooling project)
    eslint/rules/                  Local lint rules: component logic cap, no IIFE in JSX (+ tests)
    scripts/check-siblings.ts      Gate: sibling test for logic modules, sibling story for visuals (+ test)
    .husky/                        pre-commit (lint-staged), commit-msg (check_commit.py)
    .storybook/                    Storybook config; a11y addon in error mode
    src/
      api/
        clients/                   findracoApi.ts (axios + session-refresh interceptor), accessToken.ts
        dtos/                      TS entity + request/response types
        services/                  useXxxService.ts (TanStack Query hooks) + xxx.handlers.ts (MSW factories)
        types/                     QueryOptions, MutationOptions
        utils/                     buildMutationOptions, buildPagedQuery, toPagination, resolve*Message
      app/                         The only layer that imports features
        App.tsx
        providers/                 XxxProvider.tsx + useXxx.ts (Auth, Plan, Theme), TanStackQueryProvider + queryClient, AppProvider
        routing/                   AppRouter, PrivateRoute, paths.ts
        layout/                    App shell: MainLayout, AuthLayout, Navbar, Toaster, mobile navigation
        home/                      HomePage (tabs), HomeFiltersGate, tab/plan params, useHomeTab, filterStorage
      components/                  Shared UI by family; primitives in <family>/base/
        button/base/, input/base/, table/base/, toggle/base/, toggleGroup/base/, …
        typography/base/           Heading, Text, typographyVariants (seven-step scale)
        input/CurrencyInput.tsx    Compositions sit beside their family's base/
        form/                      FormField, FormSheet
        amount/                    Amount
        sectionHeader/, pageHeader/, themeToggle/, …
      features/                    Sibling features; never import each other
        overview/                  incl. filters/ (overview params + useOverviewFilters)
        transactions/              incl. filters/ (transaction params + useTransactionFilters)
        categories/
        plans/
        auth/                      Login, RegisterUser, ForgotPassword, ResetPassword pages; components/AuthCard, PasswordInput
        notFound/
      hooks/                       Hooks used by 2+ features: usePlanPermissions, useSearchParamGroup, useDebounce
      lib/                         Adapters around a library or browser API: mergeClasses, storage
      utils/                       Our own pure functions: money.ts, memberColors, string formatters
      test/                        Test infrastructure: server, setupUnit, unhandledRequests, renderWithProviders, scenarios
```

### Frontend migration status

The tree above is the target set by the frontend standards. Migration is in progress; see `.specs/features/frontend-standards/tasks.md` for the slice that brings each area into place. Until then the code differs as follows:

| Area | Today | In place after |
| --- | --- | --- |
| Providers split into `XxxProvider.tsx` + `useXxx.ts`; `eslint.config.test.ts` and the `tooling` Vitest project | provider and hook in one file; no config test | STD-02 |
| `.github/workflows/ci.yml`, `frontend/.husky/` hooks | `deploy.yml` deploys untested; no hooks | STD-03 |
| `src/test/`, `*.handlers.ts`; Storybook in `pnpm test` with a11y errors | service tests `vi.mock` the client; stories run separately | STD-04 |
| `features/overview`, `transactions`, `categories`, `auth`; `app/layout`, `app/home`; families with `base/`; `useSearchParamGroup` | `features/home` (tabs, filters, hooks), `login`/`registerUser`/`forgotPassword`/`resetPassword`, `components/layout`, `navbar`, `sonner`, flat primitives | STD-05 |
| `money.ts`, `CurrencyInput`, `FormField`, `FormSheet`, `Amount`, toggles, `usePlanPermissions`, `AuthCard`, `PasswordInput` | `formatCurrency`/`maskCurrency`, hand-built toggles, inline role checks | STD-06 |
| `typography/base/`, `PageHeader` | raw `<p>`/`<span>` with size classes | STD-08 |
| `scripts/check-siblings.ts` (story and test reports) | no gate | STD-10, STD-11 |
| `eslint/rules/` (logic cap, IIFE ban); `toPagination` | no local rules | STD-12 |

## Module Organization

### Backend — Layered (controller → service → repository)

**Purpose:** REST API for auth, transactions, categories, dashboard.
**Location:** `backend/src/main/java/com/lcs/finsight/`
**Key files:** `controllers/FinancialTransactionController.java`, `services/FinancialTransactionService.java`, `models/FinancialTransaction.java`, `utils/ApiRoutes.java`. Each domain has a matching Controller/Service/Repository triplet; DTOs split into `dtos/request` and `dtos/response`; dynamic filtering lives in `specifications/`.

### Frontend — Feature-oriented SPA

**Purpose:** React + TypeScript client.
**Location:** `frontend/src/`
**Key files:** `app/routing/AppRouter.tsx`, `app/home/HomePage.tsx`, `api/services/*`, `components/input/base/Field.tsx`. Code lives where it is used and moves up one level per wider consumer (colocation ladder, `feature-structure` skill): inside a component's file → next to it → the feature's `hooks/`/`utils/`/`components/` → `src/`. Imports are layered and lint-enforced: features never import each other, only `app/` imports features, `components/**/base/**` imports neither features, `app/` nor `api/`.

### Frontend API layer (global)

**Purpose:** All data access. Service hooks are global (NOT per-feature).
**Location:** `src/api/`
**Key files:** `clients/findracoApi.ts` (axios), `services/useFinancialTransactionService.ts`, `services/*.handlers.ts` (MSW factories, imported by tests only), `utils/buildMutationOptions.ts`, `utils/buildPagedQuery.ts`.

## Where Things Live

**Transactions:**

- UI: `frontend/src/features/transactions/` (`TransactionsPage.tsx`, `TransactionFormDrawer.tsx` + `transactionForm.ts`, `TransactionFilterPopover.tsx`, `transactionColumns.tsx`, `filters/`)
- Data access (FE): `frontend/src/api/services/useFinancialTransactionService.ts`, DTOs `api/dtos/financialTransaction.ts`
- Business logic (BE): `backend/services/FinancialTransactionService.java` (incl. Nubank CSV import)
- API/Data (BE): `controllers/FinancialTransactionController.java`, `repositories/FinancialTransactionRepository.java`, `specifications/FinancialTransactionSpecification.java`, `models/FinancialTransaction.java`

**Categories:**

- UI: `frontend/src/features/categories/` (`CategoriesPage.tsx`, `CategoryFormSheet.tsx` + `categoryForm.ts`, `CategoryTreeRow.tsx`, `DeleteCategoryDialog.tsx`); the picker `CategoryCombobox.tsx` in `features/transactions/`
- Data access (FE): `api/services/useFinancialTransactionCategoryService.ts`, DTOs `api/dtos/financialTransactionCategory.ts`
- Business logic + data (BE): `services/FinancialTransactionCategoryService.java`, `controllers/FinancialTransactionCategoryController.java`, `models/FinancialTransactionCategory.java`

**Dashboard:**

- UI: `frontend/src/features/overview/` (`OverviewPage.tsx`, `SummaryCards.tsx`, `CategorySpendingList.tsx`, `MonthlyTrendChart.tsx`, `filters/`)
- Data access (FE): `api/services/useDashboardService.ts`, DTOs `api/dtos/dashboard.ts`
- Business logic + data (BE): `services/DashboardService.java`, `controllers/DashboardController.java`, response DTOs `DashboardSummaryDto`, `CategoryBreakdownDto`, `MonthlyTrendDto`

**Auth:**

- UI: `frontend/src/features/auth/` (four pages, `components/AuthCard.tsx`, `components/PasswordInput.tsx`), `app/providers/AuthProvider.tsx` + `useAuth.ts`, `app/routing/PrivateRoute.tsx`
- Data access (FE): `api/services/useAuthService.ts`, access token in memory (`api/clients/accessToken.ts`), renewal through the session cookie in `findracoApi.ts`
- Business logic + data (BE): `services/AuthenticationService.java`, `controllers/AuthenticationController.java`, `security/` (JwtService, JwtAuthenticationFilter, CustomUserDetailsService), `config/SecurityConfig.java`

**Configuration:**

- BE routes: `utils/ApiRoutes.java` (all paths under `/api/finsight`)
- FE base URL: `api/clients/findracoApi.ts` — same-origin `/api/findraco` by default; `VITE_FINDRACO_API_URL` in `.env.development` overrides it for the dev server

## Special Directories

**`backend/specifications/`:** JPA `Specification` builders for dynamic, filter-driven queries (e.g. `FinancialTransactionSpecification.belongsToUser`, `typeEquals`).

**`frontend/src/components/<family>/base/`:** Primitive pieces of each component family (from shadcn/Base UI), e.g. `input/base/` (`Field`, `Input`, `Select`, …). Editable only for app-wide changes; compositions sit beside `base/` in the family folder. Every primitive has a sibling `.stories.tsx`.

**`frontend/src/api/services/`:** All TanStack Query hooks live here globally, one `useXxxService.ts` file per domain — never inside a feature folder — each with a sibling `xxx.handlers.ts` of typed MSW handler factories.

**`frontend/src/test/`:** Test infrastructure for the `unit` Vitest project: MSW server with no default handlers, the unhandled-request recorder, `renderWithProviders`, named scenarios. Imported only by tests and stories.

**`frontend/eslint/rules/` and `frontend/scripts/`:** Tooling we own (local lint rules, the sibling gate), written in TypeScript, run natively by Node 24 and tested by the `tooling` Vitest project.
