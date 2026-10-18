# Frontend Standards Specification

## Problem Statement

Frontend quality decayed as features shipped fast. The audit (`.specs/codebase/frontend-quality-audit.md`, 2026-10-16) found that the main cause is missing standards, not chaos. The skills never ask for stories or tests. The rules that do exist are not checked: lint is red with 66 errors, and CI deploys without running lint, typecheck or tests. The symptoms are two oversized forms, visual patterns copied instead of extracted, helpers inside component files, and test/story coverage limited to pure helpers and shadcn primitives. Every decision in this spec was taken with the user, one finding at a time; rationale and rejected alternatives are in `context.md`.

## Goals

- [ ] The standards are written once, coherently, in the frontend skills, `CLAUDE.md` and `.specs/codebase/` docs, and every one that can be checked mechanically is enforced by lint, a gate script or CI.
- [ ] `npm run lint` exits 0 on every commit of `main`, with no inline bypass anywhere.
- [ ] No commit reaches production without passing lint, typecheck and the test suites.
- [ ] The existing code complies with the standards, slice by slice, with no user-visible behaviour change other than the accessibility fixes listed here.
- [ ] Mobile-navigation (M5-09) can be built entirely under the new standards.

## Out of Scope

| Feature | Reason |
| ------- | ------ |
| Backend standards | The audit covered the frontend only |
| Shared skills repository | Deferred by the user (2026-10-16); skills stay in this repo |
| Visual regression testing | Not adopted now; baselines would churn during the UX rounds |
| Pact-style consumer contract tests | Same team, one deploy; generated types cover the contract (F2) |
| Integration-test backfill for every existing flow | Required for new spec ACs from now on; existing flows gain them when touched (see Assumptions) |
| Mobile-navigation behaviour (NAV-01..04) | Its own feature; only its prerequisites (D3) are here |
| Round-2 UX topics (mobile list, category form, delete/empty states) | Their own features, one at a time |
| Routing changes (`/?tab=` → paths) | Rejected at C4 |
| Local Docker database | Existing ROADMAP quick task; STD-14 depends on it |

---

## Assumptions & Open Questions

| Assumption / decision | Chosen default | Rationale | Confirmed? |
| --------------------- | -------------- | --------- | ---------- |
| All standards decisions | As recorded in `context.md` (C1–C9, B1–B8, D1–D4, E1–E5, F1–F3, G1–G2) | Reviewed one at a time with the user, 2026-10-16/17 | y |
| Behaviour preservation | Refactors change no user-visible behaviour, except: toggles gain `aria-pressed` and arrow-key navigation (B1); installment inputs become an accessible spinbutton (B2); a11y violations surfaced by stories are fixed; the typography consolidation listed in `design.md` decision 7 (amended 2026-10-17) | A standards effort must not smuggle in UX changes; a11y fixes and the typography scale are the stated exceptions | y |
| Slice order | STD-01 → 02 → 03 → 04 → 05 → 06 → 07 → 08 → 09 → 10 → 11 → 12; STD-13 after the backend standards review (user, 2026-10-17, `design.md` decision 10); STD-14 when the Docker DB exists | Foundations and gates first; each later slice lands its rule already satisfied (G1); D3 last, right before mobile-navigation | y |
| When the logic-cap rule (D4) lands | With STD-12 (D3), the slice after which no component exceeds 60 lines before its `return` | `TransactionsTab` exceeds the cap until D3; G1 forbids landing a red rule | y |
| `type`-only rule (E1) | Lands in the baseline slice (STD-02) | Autofix, ~32 files, no design work | y |
| Service-hook tests | Migrate from `vi.mock(findracoApi)` to MSW in STD-04 | F2's motivation: the mock skips the session-refresh interceptor, base URL and param serialisation | y |
| Integration tests for existing flows | Not backfilled wholesale; written for every new spec AC, and for an existing flow when a slice changes it | Bounded scope; the gate applies from now on | y |
| Coverage provider | Vitest `v8`, thresholds scoped by path glob to logic modules and hooks | Vitest default; per-path thresholds are built in | y |
| OpenAPI generator | Chosen in Design (e.g. `openapi-typescript` vs `orval`) | Needs a short comparison against the springdoc output | y |
| Story and test sibling scripts | Node scripts in `frontend/scripts/`, run by `npm test` and CI | Built-in tooling; no new dependency | y |
| Skills affected | Rewrite `component-creation`, `feature-structure`, `form-creation`, `api-integration`; add `frontend-testing`; rewrite the `CLAUDE.md` Frontend section; update `.specs/codebase/CONVENTIONS.md`, `STRUCTURE.md`, `TESTING.md` | One coherent pass (process note in `context.md`) | y |
| Exact `func-style` options and lint regexes | Calibrated at implementation against the ESLint docs and the codebase | Recorded as "verify/calibrate" in E2, E4a, E4b | y |

**Open questions:** none - all resolved or logged above.

---

## User Stories

### P1: Written standards ⭐ MVP

**User Story**: As the developer (and the agents who write most commits), I want every frontend standard written once, coherently, where work starts, so that new code follows it without re-deciding.

**Why P1**: Root cause A1–A3; every later slice and mobile-navigation follow these documents.

**Acceptance Criteria**:

1. The frontend skills and the `CLAUDE.md` Frontend section SHALL state every decision in `context.md`, each with its rule and, where the decision has one, its enforcement mechanism.  <!-- ubiquitous -->
2. The `component-creation`, `feature-structure`, `form-creation` and `api-integration` skills SHALL contain no rule that contradicts `context.md` (in particular: no "don't modify shadcn primitives", no "pure helpers always in `utils/`", no "domain language stays in the feature", no "arrow function components", no "comments only JSDoc").  <!-- ubiquitous -->
3. A `frontend-testing` skill SHALL define what gets a unit test, a story, an integration test and an E2E test, the story checklist, and the "no `vi.mock` of our modules in flow tests" rule.  <!-- ubiquitous -->
4. `.specs/codebase/CONVENTIONS.md`, `STRUCTURE.md` and `TESTING.md` SHALL describe the structure and conventions the standards define.  <!-- ubiquitous -->
5. WHEN a skill describes adding a shadcn primitive THEN it SHALL give the flow: check shadcn and Base UI first, install with the CLI, move into `<family>/base/`, convert to the project's function style.  <!-- event-driven -->

**Independent Test**: Read each rewritten skill against `context.md`; every decision maps to a rule and no contradicting rule remains.

---

### P1: Green lint baseline ⭐ MVP

**User Story**: As the developer, I want lint at zero errors with bypasses disabled, so that lint becomes a signal again.

**Why P1**: G1; nothing else can be enforced while lint is red.

**Acceptance Criteria**:

1. WHEN `npm run lint` runs THEN it SHALL exit 0.  <!-- event-driven -->
2. The ESLint config SHALL set `linterOptions.noInlineConfig: true`.  <!-- ubiquitous -->
3. The ESLint config SHALL configure `@typescript-eslint/ban-ts-comment` to report `@ts-ignore`, `@ts-expect-error` and `@ts-nocheck`.  <!-- ubiquitous -->
4. The ESLint config SHALL enforce `@typescript-eslint/consistent-type-definitions: "type"`, and the codebase SHALL contain no `interface` declarations outside `*.d.ts` library augmentations (amended 2026-10-17, E1 addendum).  <!-- ubiquitous -->
5. A component `.tsx` file SHALL export only components; schemas, mappers and helpers they exported move to sibling `.ts` modules (C1, C2).  <!-- ubiquitous -->
6. Every context provider SHALL be split into `XxxProvider.tsx` (component only) and `useXxx.ts` (context object + hook that throws outside the provider) (C3).  <!-- ubiquitous -->
7. Stories SHALL import Storybook types from `@storybook/react-vite`, and `.storybook/main.ts` SHALL not list `@storybook/addon-backgrounds` (F3).  <!-- ubiquitous -->
8. `components.json` SHALL point `utils` at `@/lib/mergeClasses`, `css` at `src/index.css` and `ui` at `@/components` (C8).  <!-- ubiquitous -->
9. IF a file contains an `eslint-disable` comment THEN lint SHALL still report the rule it tried to disable.  <!-- unwanted-behavior -->

**Independent Test**: Run `npm run lint` → exit 0; add `// eslint-disable-next-line` before a violation → still reported; add `@ts-ignore` → reported.

---

### P1: Gates before production ⭐ MVP

**User Story**: As the developer, I want CI to check every push and deploy to wait for it, so that a broken commit never reaches production.

**Why P1**: G2; turns the written standards into guarantees.

**Acceptance Criteria**:

1. WHEN a commit is pushed to any branch THEN GitHub Actions SHALL run a frontend job (lint, `tsc` via build, the test suites configured at the time) and a backend job (`./mvnw test`).  <!-- event-driven -->
2. WHEN a commit is pushed to `main` THEN the deploy job SHALL run only after both CI jobs succeed.  <!-- event-driven -->
3. IF any CI job fails THEN the deploy job SHALL NOT run.  <!-- unwanted-behavior -->
4. WHEN a push to `main` changes only paths the current deploy ignores (`.specs/**`, `.claude/**`, `*.md`) THEN the deploy job SHALL NOT run.  <!-- event-driven -->
5. WHEN a developer commits locally THEN a husky `pre-commit` hook SHALL run ESLint on the staged frontend files and block the commit on any error.  <!-- event-driven -->
6. WHEN a developer commits locally THEN a husky `commit-msg` hook SHALL run the tlc `check_commit.py` and block a non-Conventional-Commits message.  <!-- event-driven -->

**Independent Test**: Push a branch with a lint error → frontend job red; push a clean `main` commit → CI green then deploy runs; commit with message "stuff" → rejected locally.

---

### P1: Test infrastructure ⭐ MVP

**User Story**: As the developer, I want stories and network-level integration tests running in the normal test command, so that the testing standards have a working harness.

**Why P1**: F1/F2 enforcement slices (STD-10, STD-11) depend on it.

**Acceptance Criteria**:

1. WHEN `npm test` runs THEN it SHALL run both the `unit` and the `storybook` Vitest projects.  <!-- event-driven -->
2. The Storybook preview SHALL set the a11y addon to fail tests on violations (`a11y: { test: "error" }`), and the existing stories SHALL pass with it.  <!-- ubiquitous -->
3. The `unit` project SHALL start an MSW server for every test file, reset handlers after each test, and fail a test on any request without a handler.  <!-- ubiquitous -->
4. The service-hook tests SHALL exercise `findracoApi` through MSW instead of `vi.mock`, including at least one test that crosses the session-refresh interceptor (401 → refresh → retry).  <!-- ubiquitous -->
5. The CI frontend job SHALL install the Playwright browser and run both projects.  <!-- ubiquitous -->

**Independent Test**: Break an `aria` attribute in a story → `npm test` fails; add a request to an unmocked URL in a test → test fails; refresh-interceptor test passes through MSW.

---

### P2: Structure

**User Story**: As the developer, I want the folders to state each piece's scope, so that I never guess where code goes and features cannot depend on each other.

**Why P2**: C2, C4, C4b, C5, C6, C9 and the `base/` marker; prerequisite for the component slices.

**Acceptance Criteria**:

1. `src/features/` SHALL contain `overview`, `transactions`, `categories`, `plans`, `auth` and `notFound`, and no `home`, `login`, `registerUser`, `forgotPassword` or `resetPassword` folders.  <!-- ubiquitous -->
2. `MainLayout`, `AuthLayout`, `Navbar` and the `Toaster` SHALL live in `src/app/layout/`.  <!-- ubiquitous -->
3. The primitive pieces of each component family SHALL live in `src/components/<family>/base/`.  <!-- ubiquitous -->
4. `MemberDot`, `memberColors` and `TransactionTypeToggle` SHALL live at the root (`src/components/`, `src/utils/`), and every module used by a single component SHALL sit next to it.  <!-- ubiquitous -->
5. IF a file under `src/features/**` imports `@/features/*` THEN lint SHALL report an error.  <!-- unwanted-behavior -->
6. IF a file under `src/components/**` imports `@/features/*`, or `@/app/*` other than `@/app/providers/*` and `@/app/routing/paths` THEN lint SHALL report an error.  <!-- unwanted-behavior -->
7. IF a file under `src/components/**/base/**` imports `@/features/*`, `@/app/*` or `@/api/*` THEN lint SHALL report an error.  <!-- unwanted-behavior -->
8. IF a file outside `src/app/` imports `@/app/layout/*` or `@/app/routing/*` other than `paths` THEN lint SHALL report an error.  <!-- unwanted-behavior -->
9. `src/lib/` SHALL contain only adapters around libraries or browser APIs, and `filterStorage` SHALL live with the filter state it persists.  <!-- ubiquitous -->

**Independent Test**: `npm run lint` and the app's routes behave as before; adding `import … from "@/features/plans/…"` inside `features/overview` fails lint.

---

### P2: Shared components and tokens

**User Story**: As the developer, I want each repeated pattern to exist once, from shadcn/Base UI where possible, so that a change happens in one place.

**Why P2**: B1–B7, E3, E4a.

**Acceptance Criteria**:

1. The app SHALL use the shadcn (Base UI) `ToggleGroup` for every single-choice segmented control, with `tone` (primary, destructive, success) and `chip` variants, replacing the hand-built toggles in `TransactionTypeToggle`, the recurrence mode, the category limit mode, `AttributionFields` and `MemberFilterChips`.  <!-- ubiquitous -->
2. WHEN a toggle option is selected THEN its item SHALL expose `aria-pressed="true"` and arrow keys SHALL move focus between the options.  <!-- event-driven -->
3. Integer inputs (installments) SHALL use Base UI `NumberField` with a minimum of 1 and a step of 1.  <!-- ubiquitous -->
4. WHEN the user types digits into a `CurrencyInput` THEN each digit SHALL enter from the right as cents (typing 1, 2, 3, 4 shows R$ 0,01, R$ 0,12, R$ 1,23, R$ 12,34) and the form SHALL receive the numeric value (12.34), never the masked string.  <!-- event-driven -->
5. IF the user pastes or types non-digit characters into a `CurrencyInput` THEN the component SHALL ignore them.  <!-- unwanted-behavior -->
6. Money SHALL be formatted only through `formatMoney`, whose locale and currency come from one source (today `pt-BR`/`BRL`), and the currency → locale table SHALL not exist.  <!-- ubiquitous -->
7. An `Amount` component SHALL render a transaction value signed and toned by type (debit: "- " prefix, destructive tone; credit: no prefix, success tone), monospace, and the mobile list and the table SHALL use it.  <!-- ubiquitous -->
8. `TransactionFormDrawer` and `CategoryFormSheet` SHALL render through a shared `FormSheet` (title, scrolling form, Cancel/Submit with loading, `mobileActions` slot).  <!-- ubiquitous -->
9. The auth pages SHALL use `AuthCard` (built on `Card`) and `PasswordInput` (built on `InputGroup`), render button labels as plain text, and pass errors to `FieldError` only as `errors={[…]}`.  <!-- ubiquitous -->
10. Creating and renaming a plan SHALL use one `PlanNameDialog` with a required `mode: "create" | "rename"`.  <!-- ubiquitous -->
11. Every role-dependent UI decision SHALL read `usePlanPermissions()` capabilities (`canCreateTransactions`, `canAttributeToOthers`, `canManageCategories`, `canManagePlan`) and no component SHALL compare `myRole` directly.  <!-- ubiquitous -->
12. WHILE the active plan or its role is not loaded `usePlanPermissions()` SHALL report every capability as false.  <!-- state-driven -->
13. The theme SHALL define `--warning` and `--warning-foreground` in both modes, and status amber and `Badge` greens SHALL use tokens.  <!-- ubiquitous -->
14. IF a class string contains a raw palette colour (e.g. `text-amber-600`, `bg-green-100`) THEN lint SHALL report an error naming the token to use.  <!-- unwanted-behavior -->

**Independent Test**: Toggle Debit/Credit with the keyboard and a screen reader; type 1234 in an amount field and inspect the submitted payload (12.34); log in as VIEWER and see no create actions; `text-amber-600` in a component fails lint.

---

### P2: Form decomposition

**User Story**: As the developer, I want the two large forms split by responsibility, so that each part is readable, testable and within the standards.

**Why P2**: D1, D2, B8 and the `useFieldArray` rule.

**Acceptance Criteria**:

1. The transaction form's schema and mappers SHALL live in `transactionForm.ts`, and the category form's in `categoryForm.ts`, each with a sibling test.  <!-- ubiquitous -->
2. The transaction form's mutations and series-scope flow SHALL live in `useTransactionFormSubmit`, and the category form's in `useCategoryFormSubmit`.  <!-- ubiquitous -->
3. Every dynamic list inside a form (transaction items, `memberLimits`, `participants`) SHALL be managed with `useFieldArray`.  <!-- ubiquitous -->
4. The End date and Number of installments fields SHALL each exist as one component, used by both create and series edit.  <!-- ubiquitous -->
5. The "last installment" preview SHALL be computed by a tested helper, not inside JSX.  <!-- ubiquitous -->
6. WHEN the existing `TransactionFormDrawer` and `CategoryFormSheet` tests run against the decomposed forms THEN they SHALL pass, adapted only in import paths and in how values are entered.  <!-- event-driven -->

**Independent Test**: Create, edit, duplicate and series-edit a transaction and a category exactly as before; existing form tests green.

---

### P2: Typography

**User Story**: As the developer, I want text styled only through design-system typography, so that the type scale is consistent everywhere.

**Why P2**: E4b + C7.

**Acceptance Criteria**:

1. `Heading` (`level` 1–6 for the tag) and `Text` (`as` for the tag) SHALL live in `src/components/typography/base/` and SHALL share one `variant` scale: `display`, `headline`, `title`, `label`, `body`, `secondary`, `caption` (amended 2026-10-17, `design.md` decision 7).  <!-- ubiquitous -->
2. IF a file outside `**/base/**` renders a raw `<p>` or `<h1>`–`<h6>` THEN lint SHALL report an error.  <!-- unwanted-behavior -->
3. IF a class string outside `**/base/**` contains a font-size (`text-xs`…`text-9xl`) or font-weight (`font-thin`…`font-black`) class THEN lint SHALL report an error; alignment (`text-left/center/right`) and family (`font-mono`) classes SHALL stay allowed.  <!-- unwanted-behavior -->
4. Page titles SHALL render through `PageHeader`, section titles through `SectionHeader`, and field help text through `FieldDescription`.  <!-- ubiquitous -->
5. Each `Text`/`Heading` variant SHALL name a role, not a screen.  <!-- ubiquitous -->

**Independent Test**: `<p className="text-sm">` in a feature fails lint; every screen looks as before, except the typography changes listed in `design.md` decision 7.

---

### P2: Mechanical conventions

**User Story**: As the developer, I want one function style and comments that explain why, so that the code reads the same everywhere.

**Why P2**: E2, E5.

**Acceptance Criteria**:

1. The ESLint config SHALL enforce `func-style: ["error", "declaration"]`: top-level components, helpers and handlers declared inside components are `function` declarations, and arrows appear only as inline callbacks.  <!-- ubiquitous -->
2. Comments and JSDoc SHALL contain no spec or requirement IDs (e.g. `CAT-15`, `UX-02 AC 5`).  <!-- ubiquitous -->
3. Every `//` comment SHALL explain a reason (constraint, consequence, intentional decision), and comments that narrate what the code does SHALL be replaced by names or extractions.  <!-- ubiquitous -->

**Independent Test**: `const Foo = () => …` at top level fails lint; `grep -rE "(CAT|UX|NAV|STD)-[0-9]+" src --include=*.ts* | grep -v test` returns nothing.

---

### P2: Story coverage

**User Story**: As the developer, I want every piece of UI with its own visual in a story, so that I can work on any state in isolation and render/a11y issues are caught.

**Why P2**: F1 enforcement.

**Acceptance Criteria**:

1. Every component file that does not directly import `@/api/services`, `@/app/providers` or `react-router-dom` SHALL have a sibling `.stories.tsx`.  <!-- ubiquitous -->
2. IF a component file without such imports lacks a sibling story THEN the story gate script SHALL fail `npm test` and CI, naming the file.  <!-- unwanted-behavior -->
3. Each story file SHALL cover the component's variants, the states it handles (empty, loading, error), extreme content, and a mobile viewport when its layout changes.  <!-- ubiquitous -->
4. A container with a visual of its own SHALL be split into a container and a presentational view with a story.  <!-- ubiquitous -->

**Independent Test**: Delete a story → `npm test` fails naming the component; open Storybook and see every presentational component's states.

---

### P2: Test coverage

**User Story**: As the developer, I want every logic module and hook tested to a coverage floor, so that rules in code are verified, not assumed.

**Why P2**: F2 enforcement.

**Acceptance Criteria**:

1. Every logic `.ts` module and every hook with logic SHALL have a sibling `.test.ts`; DTO, type-only and constant-only modules SHALL be exempt.  <!-- ubiquitous -->
2. IF a logic module lacks a sibling test THEN the test gate script SHALL fail `npm test` and CI, naming the file.  <!-- unwanted-behavior -->
3. IF branch coverage of logic modules and hooks falls below 90% THEN `npm test` SHALL fail.  <!-- unwanted-behavior -->
4. The coverage threshold SHALL not apply to components, stories, DTOs or types.  <!-- ubiquitous -->

**Independent Test**: Delete a helper test → gate fails naming it; remove a branch's test case → coverage gate fails.

---

### P2: Transactions tab decomposition and the logic cap

**User Story**: As the developer, I want `TransactionsTab` split by concern and the component-logic cap enforced, so that no component does a hook's job.

**Why P2**: D3 + D4; last slice before mobile-navigation.

**Acceptance Criteria**:

1. `TransactionsTab` SHALL delegate search to `useTransactionSearch`, edit/duplicate/delete and drawer state to `useTransactionActions`, CSV import to `useCsvImport`, and sort mapping to a tested `transactionSort.ts`; the inline-save payload SHALL be built by a mapper in `transactionForm.ts`.  <!-- ubiquitous -->
2. Paged API responses SHALL convert to table pagination through `toPagination` in `src/api/utils/`.  <!-- ubiquitous -->
3. IF a component (a PascalCase function returning JSX) has more than 60 lines from the start of its body to its main `return` THEN the local lint rule SHALL report an error suggesting a hook.  <!-- unwanted-behavior -->
4. IF JSX contains an immediately invoked function expression THEN the local lint rule SHALL report an error.  <!-- unwanted-behavior -->
5. The local lint rule SHALL have tests (ESLint `RuleTester`) covering a component at 60 and at 61 lines, a non-component function, and an IIFE in JSX.  <!-- ubiquitous -->

**Independent Test**: Search, sort, page, edit, duplicate, delete and import behave as before; a 61-line component fails lint.

---

### P3: Generated API types

**User Story**: As the developer, I want frontend DTOs generated from the backend's OpenAPI schema, so that API drift becomes a compile error.

**Why P3**: F2; touches the backend; valuable but not blocking.

**Acceptance Criteria**:

1. The frontend API types SHALL be generated from the backend's OpenAPI schema by a script, and hand-written DTO types for generated shapes SHALL not exist.  <!-- ubiquitous -->
2. MSW handlers SHALL be typed with the generated types.  <!-- ubiquitous -->
3. IF the generated types are stale relative to the backend schema THEN CI SHALL fail.  <!-- unwanted-behavior -->

**Independent Test**: Rename a response field in the backend → regenerate → frontend and handlers fail to compile until updated.

---

### P3: E2E smoke tests

**User Story**: As the developer, I want a few critical journeys tested end to end, so that the app works as a whole, not just in parts.

**Why P3**: F2; blocked by the local Docker database task.

**Acceptance Criteria**:

1. Playwright SHALL cover: sign in, add a transaction, see it on the Overview, switch plans.  <!-- ubiquitous -->
2. The E2E suite SHALL run against a disposable database, never `dev_finsight`.  <!-- ubiquitous -->
3. WHERE the CI has the Postgres service container the E2E suite SHALL run in CI.  <!-- optional-feature -->

**Independent Test**: Run the suite locally against the Docker DB → green; break the add-transaction submit → suite fails.

---

## Edge Cases

- IF a lint regex flags a legitimate class (e.g. a neutral grey border) THEN the regex SHALL be adjusted for the whole codebase, never bypassed per file.
- IF the story gate classifies a container as presentational (a hook of ours wraps the router or API) THEN the container SHALL be split into container + view rather than exempted.
- WHEN a slice moves files THEN existing tests SHALL move with their subjects and keep passing.
- WHEN a shadcn primitive is reinstalled through the CLI THEN it SHALL be moved into `<family>/base/` and converted to function style before commit, or lint SHALL fail.
- IF the Storybook project is flaky in CI THEN the cause SHALL be fixed; retries SHALL NOT be added to hide it.
- WHEN mobile-navigation starts THEN STD-12 SHALL already be merged, so NAV-02 builds on `useTransactionActions`.

---

## Implicit-Requirement Dimensions

| Dimension | Resolution |
| --------- | ---------- |
| Input validation & bounds | `CurrencyInput` digit-only input and numeric output (STD-06 AC 4–5); `NumberField` min/step (STD-06 AC 3) |
| Failure / partial-failure states | CI failure blocks deploy (STD-03 AC 3); gate scripts and coverage fail with the offending file (STD-10, STD-11) |
| Idempotency / retry | Flaky tests are fixed, not retried (Edge Cases); otherwise N/A because no runtime operation is added |
| Auth boundaries & rate limits | Role checks centralised in `usePlanPermissions`, false while loading (STD-06 AC 11–12); backend enforcement unchanged |
| Concurrency / ordering | Slice order and the D4-rule timing (Assumptions); deploy ordered after CI (STD-03 AC 2) |
| Data lifecycle / expiry | N/A because no data is stored; E2E uses a disposable DB (STD-14 AC 2) |
| Observability | CI reports which job and file failed (STD-03, STD-10 AC 2, STD-11 AC 2); otherwise N/A because the project has no frontend telemetry |
| External-dependency failure | GitHub Actions outage blocks deploy, which is the intended fail-safe; N/A beyond that |
| State-transition integrity | N/A because no domain state changes; behaviour preservation (Assumptions) |

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
| -------------- | ----- | ----- | ------ |
| STD-01 | P1 Written standards (AC 1–5) | P1 (T1–T9) | Done |
| STD-02 | P1 Green lint baseline (AC 1–9) — C1, C3, C8, E1, F3 | P2–P4 (T10–T29) | Done |
| STD-03 | P1 Gates before production (AC 1–6) — G2 | P5 (T30–T33) | Done |
| STD-04 | P1 Test infrastructure (AC 1–5) — F1, F2 harness | P6 (T34–T42) | Done |
| STD-05 | P2 Structure (AC 1–9) — C2, C4, C4b, C5, C6, C9, `base/` | P7–P8 (T43–T55) | Done |
| STD-06 | P2 Shared components and tokens (AC 1–14) — B1–B7, E3, E4a | P9–P11 (T56–T79) | Pending |
| STD-07 | P2 Form decomposition (AC 1–6) — D1, D2, B8 | P12 (T80–T88) | Pending |
| STD-08 | P2 Typography (AC 1–5) — E4b, C7 | P13 (T89–T96) | Pending |
| STD-09 | P2 Mechanical conventions (AC 1–3) — E2, E5 | P14 (T97–T103) | Pending |
| STD-10 | P2 Story coverage (AC 1–4) — F1 | P15 (T104–T111) | Pending |
| STD-11 | P2 Test coverage (AC 1–4) — F2 | P16 (T112–T116) | Pending |
| STD-12 | P2 Transactions tab + logic cap (AC 1–5) — D3, D4 | P17 (T117–T125) | Pending |
| STD-13 | P3 Generated API types (AC 1–3) — F2, deferred until after the backend standards review | - | Deferred |
| STD-14 | P3 E2E smoke tests (AC 1–3) — F2, blocked by Docker DB | - | Pending |

**ID format:** `STD-NN`; each ID is one refactor slice and covers the AC range named in its row. Slice order follows the IDs (Assumptions).

**Coverage:** 14 total, 12 mapped to tasks (T1–T125), 2 unmapped by decision: STD-13 deferred (design decision 10), STD-14 blocked by the Docker DB

---

## Success Criteria

- [ ] `npm run lint` and `npm test` are green on every `main` commit, and no `eslint-disable` or `@ts-*` comment exists in the codebase.
- [ ] Production has received no commit that failed CI since STD-03.
- [ ] No component exceeds 60 lines of logic before its `return`, and no file exports both components and non-components.
- [ ] Every presentational component has a story; every logic module and hook has a test, at ≥ 90% branch coverage.
- [ ] Mobile-navigation is designed and built following only the rewritten skills, with no new audit finding in its Verifier report.
