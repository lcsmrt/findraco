# findraco

Personal-finance app: Spring Boot API (`backend`) + React/TS SPA (`frontend`).

> Prescriptive write-time standards. Detailed procedures live in the skills; descriptive maps in
> `.specs/codebase/`. This file overrides inference — if a rule is missing, ask rather than infer.
> Lives at the monorepo root and governs both apps.

---

## General

- **English only** — code, UI, comments, specs. Never leak Portuguese into artifacts.
- Follow the written standard; if a rule is missing, **ask — don't infer**.
- Research how it's usually solved before reinventing; prefer established patterns.
- Consistency and clarity over cleverness. No premature abstraction, no junk.

---

## Backend (`backend`)

- Package by feature: `com.lcs.findraco.<auth|user|plan|category|transaction|dashboard>.<layer>`, layers
  `controller`, `service`, `repository`, `model`, `request`, `response`, `exception`, `config` (plus
  `transaction.importer`); cross-cutting code in `shared.<config|error|openapi|security|web|ratelimit>`.
  Another feature is reached through its `service`, `model` or `response` only, never its controllers,
  requests, exceptions or configuration (ArchUnit); the repository reads still crossing features move
  behind their owner in BST-05.
- Layered: **controller → service → repository**. Controller resolves identity, delegates one call,
  wraps in a response record — no business logic.
- Status: `201` create, `204` delete, `200` read/update (`HttpStatus.CREATED`, not raw `201`).
- Identity: values, never entities. `PlanContext(planId, userId, role)` for plan-scoped endpoints (its
  resolver checks membership, 404 otherwise), `@CurrentUser AuthenticatedUser` otherwise; services take
  ids and reload what they need in their own transaction. No controller parameter is a JPA entity
  (ArchUnit). Parameter order: target ids, then the request, identity last. `@Valid` on every body.
- Services: `@Transactional` (`readOnly` for reads). Ownership mismatch → **not-found (privacy)**, not
  403. Roles via `PlanAuthorization`. Throw typed `XxxExceptions`.
- DTOs (**no Lombok, no MapStruct**) are records, one public type per file, nothing nested:
  `CreateXxxRequest`/`UpdateXxxRequest` (or `XxxFilter` for query parameters) with Bean Validation in
  `request/`; `XxxResponse`/`XxxSummaryResponse` in `response/`, built by `static from(entity)`. Simple
  names are unique across features (ArchUnit).
- Exceptions: nested in `XxxExceptions`, one per semantic, each mapped in `GlobalExceptionHandler` with an
  explicit status. Error bodies use RFC 7807 `ProblemDetail` (own `type` URIs, field errors under an
  `errors` extension). _ProblemDetail migration pending — decided in `.specs/features/backend-standards/context.md` S15._
- Constructor injection only (no field `@Autowired`). Routes as constants in the feature's
  `controller/XxxRoutes` (`ApiRoutes` holds `BASE` and `PLAN`); a route open without authentication is a
  `PublicEndpoints` bean declared by its feature. All user-data queries plan-scoped.
- Tests: unit `*Test` / integration `*IT` — see `.specs/codebase/TESTING.md`.
- Skills: `/backend-endpoint`, `/backend-exceptions`.

---

## Frontend (`frontend`)

React + TS, feature-oriented. Essentials only: each skill holds the full rules, their reasons and how
they are enforced. Read the matching skill before writing frontend code.

- Code style: `function` declarations for components, helpers and handlers; arrows only as inline
  callbacks. Named exports, never default, never `React.FC`. `type` everywhere, never `interface`; no
  `any`. Props `XxxProps`; files `PascalCase.tsx`, `useXxx.ts`, `camelCase.ts`. `cn()` for classes,
  `cva` for variants. → `/component-creation`
- Component files export only components. Logic that hits an extraction trigger moves to a `.ts`
  module (a business rule to the feature's `utils/`, with a test); at most 60 code lines before a
  component's main `return` (extract a hook); no IIFE in JSX. → `/component-creation`
- Every component with its own visual has a story, except `base/` primitives (catalog story, no gate);
  a container fetches and passes down, with no visual of its own. → `/component-creation`, `/frontend-testing`
- Primitives live in `src/components/<family>/base/` and are ours: edit them for app-wide changes only
  (tokens, variants, loading state, a11y); domain behaviour goes in a composition. Check shadcn and Base
  UI before writing a component by hand. → `/component-creation`
- Design system only: text through `Heading`/`Text` (no raw `<p>`/`<hN>`, no size or weight classes);
  meaningful colour from theme tokens, never the raw palette; money through `Amount`, `formatMoney` and
  `CurrencyInput`. → `/component-creation`
- Where code lives: born where it is used, lifted one rung when a second consumer appears; features
  never import each other; only `app/` imports features; providers are `XxxProvider.tsx` + `useXxx.ts`.
  `@/` cross-folder, relative within a feature. → `/feature-structure`
- Data: service hooks in `src/api/services/` (raw function + `useXxx` hook), plan-scoped query keys,
  mutations via `buildMutationOptions`; components never call `findracoApi`. Each service ships typed
  MSW handler factories. Request types `CreateXxxRequest`/`UpdateXxxRequest`; `XxxResponse` = API wire
  shape. → `/api-integration`
- Forms: react-hook-form + zod; every field through `Controller` via `FormField`; domain-typed values
  (`XxxFormValues`); `useWatch` locally, never root `watch()` + `setValue()`; `useFieldArray` for every
  dynamic list. → `/form-creation`
- Tests: a closed table decides them by path and file name (`scripts/testTable.ts`); a module matching
  no row gets no test. Business rules, service hooks, URL params, shared hooks → unit; container → flow
  test of its decisions, MSW only, never `vi.mock` of our own modules; presentational → story per state
  it handles (a11y violations fail); 90% branches on five critical modules only; no test of library
  behaviour. → `/frontend-testing`
- The Verifier's discrimination sensor mutates only code in a test-table row whose test kind is not
  none.
- Comments explain why, never what; no spec IDs in code (traceability lives in test names).
  → `/component-creation`
- No bypass: `eslint-disable` comments are ignored and `@ts-ignore`/`@ts-expect-error`/`@ts-nocheck` are
  lint errors. A wrong rule changes for the whole codebase. Lint is green on every `main` commit.
- Every push that ships a frontend fix or change bumps the prerelease in `frontend/package.json`
  (`1.0.0-beta.N` → `N+1`), in its own `chore(release): <version>` commit; the app shows it.
- CI gates deploy: a push that changes an app runs its lint, build and tests (docs-only pushes run
  nothing; the frontend runs the affected tests, the full suite weekly and on dispatch); nothing reaches
  production without passing them. → `/frontend-testing`
- Skills: `/component-creation`, `/feature-structure`, `/form-creation`, `/api-integration`,
  `/frontend-testing`.
