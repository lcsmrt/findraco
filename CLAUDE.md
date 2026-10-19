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

- Layered: **controller → service → repository**. Controller resolves identity, delegates one call,
  wraps in a response DTO — no business logic.
- Status: `201` create, `204` delete, `200` read/update (`HttpStatus.CREATED`, not raw `201`).
- Identity: `PlanContext` for plan-scoped endpoints, `@AuthenticationPrincipal` otherwise. `@Valid` on
  every body.
- Services: `@Transactional` (`readOnly` for reads). Ownership mismatch → **not-found (privacy)**, not
  403. Roles via `PlanAuthorization`. Throw typed `XxxExceptions`.
- DTOs (**no Lombok, no MapStruct**): `XxxRequestDto` with Bean Validation; `XxxResponseDto` immutable,
  built from the entity; map by hand.
- Exceptions: nested in `XxxExceptions`, one per semantic, each mapped in `GlobalExceptionHandler` with an
  explicit status. Error bodies use RFC 7807 `ProblemDetail` (own `type` URIs, field errors under an
  `errors` extension). _ProblemDetail migration pending — see `.specs/quick/error-contract-problemdetail-migration.md`._
- Constructor injection only (no field `@Autowired`). Routes as `ApiRoutes` constants. All user-data
  queries plan-scoped.
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
- Component files export only components. Logic that hits an extraction trigger moves to a sibling
  `.ts` with a test; at most 60 code lines before a component's main `return` (extract a hook); no IIFE
  in JSX. → `/component-creation`
- Every component with its own visual has a story; a container fetches and passes down, with no visual
  of its own. → `/component-creation`, `/frontend-testing`
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
- Tests: logic → sibling unit test (90% branch coverage); visual → story (a11y violations fail); flow →
  integration test with MSW, never `vi.mock` of our own modules. → `/frontend-testing`
- Comments explain why, never what; no spec IDs in code (traceability lives in test names).
  → `/component-creation`
- No bypass: `eslint-disable` comments are ignored and `@ts-ignore`/`@ts-expect-error`/`@ts-nocheck` are
  lint errors. A wrong rule changes for the whole codebase. Lint is green on every `main` commit.
- CI gates deploy: a push that changes an app runs its lint, build and tests (docs-only pushes run
  nothing); nothing reaches production without passing them. → `/frontend-testing`
- Skills: `/component-creation`, `/feature-structure`, `/form-creation`, `/api-integration`,
  `/frontend-testing`.
