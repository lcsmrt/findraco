# STATE

## Decisions

### AD-001
- **Decision**: Manage all work through the `tlc-spec-driven` skill and the `.specs/` tree (upgraded to v3.3.0 on 2026-10-11).
- **Reason**: Project resumed after a gap; wanted structure and traceability that weren't used at the start.
- **Trade-off**: Upfront documentation effort before feature code.
- **Scope**: All features, both apps.
- **Date**: 2026-07-05
- **Status**: active

### AD-002
- **Decision**: Recurring/installment commitments generate concrete future `FinancialTransaction` rows sharing a `seriesId` — no statistical forecast or projection math; the existing dashboard shows the look-ahead for free.
- **Reason**: The user wants "expense X, 12 parcels" to become 12 real transactions; simpler, explainable, dashboard-compatible.
- **Trade-off**: One-off/variable spending is never anticipated; bulk rows instead of a computed view.
- **Scope**: Recurrence, dashboard. (v1's "must have an end date" was later relaxed by recurrence-model-v2's rolling 12-month window for open-ended RECURRING series.)
- **Date**: 2026-07-05
- **Status**: active

### AD-003
- **Decision**: An installment can be registered mid-way via total `N` + current parcel `k`; the generator produces parcels `k..N`, labelled `k/N`, starting at parcel `k`'s month; the implied end is shown read-only.
- **Reason**: The generator always assumed parcel 1, mislabelling or double-counting purchases already partly imported from the Nubank CSV.
- **Trade-off**: No automatic dedup against CSV imports — the user picks `k`.
- **Scope**: Installment series (backend generator, frontend form).
- **Date**: 2026-07-11
- **Status**: active

### AD-004
- **Decision**: Sharing is modelled as **Shared Plans** — a `Plan` owns transactions and categories; users join via `PlanMembership` with a role (OWNER/EDITOR/CONTRIBUTOR/VIEWER); access is two-layer (plan role × row ownership via `created_by`). Every user gets an auto-created, shareable default plan.
- **Reason**: "Share like a spreadsheet" with partial rights; a household model can't express read-only or own-rows-only.
- **Trade-off**: More entities and an authorization layer; required adopting Flyway for the destructive re-scope.
- **Scope**: All plan-scoped data (transactions, categories, dashboard), authorization.
- **Date**: 2026-07-11
- **Status**: active

### AD-005
- **Decision**: Plan-scoped requests carry the plan as a path variable (`/plan/{planId}/...`), resolved into a `PlanContext` that verifies membership; the plan stays out of the JWT.
- **Reason**: Structural scoping can't be forgotten (no cross-plan leak); switching plans needs no re-login.
- **Trade-off**: All scoped routes nested under the plan prefix; frontend query keys include the active plan.
- **Scope**: `ApiRoutes`, controllers, frontend service hooks.
- **Date**: 2026-07-12
- **Status**: active

### AD-006
- **Decision**: Deleting a plan is a soft delete (`plans.deleted_at`); dependent rows are never cascaded. Archived plans are filtered by explicit per-finder `deleted_at IS NULL`, not a global `@SQLRestriction` (which would break `membership.getPlan()` loads).
- **Reason**: A hard cascade delete was too risky; soft delete is reversible and keeps history.
- **Trade-off**: Archived rows accumulate until a purge exists (ROADMAP M4-07).
- **Scope**: Plan lifecycle, every plan read path.
- **Date**: 2026-07-12
- **Status**: active

### AD-007
- **Decision**: Line items (`TransactionItem`) are an additive child of a transaction, each with its own category; the category breakdown follows a partition invariant `spent[C] = A[C] − B[C] + I[C]` (uncategorized items and the un-itemized remainder stay on the parent category), computed in the pure `CategoryBreakdownAssembler`. Sums are loose (`0 ≤ Σitems ≤ amount`).
- **Reason**: "Cleaning vs. food inside one grocery run" needs the item to be the unit of category truth; loose sums avoid forcing full itemization.
- **Trade-off**: The category-keyed dashboard query and limit evaluation became item-aware; top-line totals never move.
- **Scope**: Transactions, dashboard category breakdown and limits.
- **Date**: 2026-07-15
- **Status**: active

### AD-008
- **Decision**: Category spend is computed per category × member from participation shares. A line item's amount is attributed to the transaction's participants in proportion to their shares, allocated in integer cents by the largest remainder method. Category settings tied to a member (per-member limits, ownership) are kept dormant when that member leaves the plan, never deleted, and apply again on rejoin.
- **Reason**: Per-member limits and owned categories need a member axis on the item-aware breakdown; penny-exact allocation keeps Σ members == category total; keeping member data matches how transactions already survive removal.
- **Trade-off**: Items cannot be assigned to one member explicitly; the proportional rule is provisional (IDEAS "Item-level splits").
- **Scope**: Category breakdown (dashboard + Categories tab), category limits, plan membership.
- **Date**: 2026-10-12
- **Status**: active

### AD-009
- **Decision**: Sessions are a 15-minute bearer JWT held in memory plus a rotating, SHA-256-hashed session token in `user_sessions`, delivered only in an `HttpOnly`, `SameSite=Strict` cookie scoped to `/api/findraco/auth`. Every other route keeps `Authorization: Bearer`. Revocation deletes rows; a session token replayed more than 30 s after rotation deletes its device chain.
- **Reason**: Expired sessions rendered empty pages and the 24h JWT forced a daily sign-in; the user wants 30-day sliding sessions with real sign-out and reset-revokes-all, which a stateless token cannot give. Chosen over a server-side cookie session to keep the bearer API, tests and Swagger unchanged.
- **Trade-off**: A session table and a renewal flow in the SPA; revocation reaches already-issued access tokens only after their 15 minutes.
- **Scope**: Authentication (backend `security/`, `SessionService`, frontend `findracoApi`, `AuthProvider`, `PrivateRoute`).
- **Date**: 2026-10-16
- **Status**: active

### AD-010
- **Decision**: Frontend standards live in the frontend skills, the `CLAUDE.md` Frontend section and `.specs/codebase/`, and every checkable one is enforced mechanically (lint, gate scripts, CI). Lint is green on every `main` commit with no inline bypass: `noInlineConfig`, `ban-ts-comment`. A wrong rule changes for the whole codebase, never per file.
- **Reason**: The audit found missing and unchecked standards, not chaos, as the cause of decay; lint was red with 66 errors and ignored.
- **Trade-off**: No escape hatch; an awkward case costs a rule change or a refactor instead of one comment.
- **Scope**: Frontend (`frontend/`), skills, `CLAUDE.md`.
- **Date**: 2026-10-17
- **Status**: active

### AD-011
- **Decision**: Nothing reaches production without CI. One `.github/workflows/ci.yml` runs frontend and backend jobs on every push; `deploy` needs both plus a change filter, runs one at a time, and a head guard skips it when the tested SHA is no longer the tip of `main`.
- **Reason**: The old workflow deployed every push to `main` untested, and Portainer builds `main` at call time, not the tested commit.
- **Trade-off**: Slower deploys; a seconds-wide race remains between the guard and Portainer; a skipped deploy whose successor fails leaves production on the previous release until a fix lands.
- **Scope**: CI/CD, husky hooks.
- **Date**: 2026-10-17
- **Status**: active

### AD-012
- **Decision**: Testing model. Logic modules (a decision point, arithmetic or iteration) get sibling unit tests, gated by content and held to 90% branch coverage; visuals get stories run with a11y in error mode; flows get integration tests with real providers and only the network simulated by explicit, per-test MSW handlers. No `vi.mock` of our own modules in flow tests.
- **Reason**: Tests should fail on our defects; mocking our modules skipped the session-refresh interceptor and serialisation, and blanket "test everything" would test libraries.
- **Trade-off**: More verbose screen tests; handler factories and the gate script are code we own.
- **Scope**: Frontend tests (`src/test/`, `*.handlers.ts`, `scripts/check-siblings.ts`).
- **Date**: 2026-10-17
- **Status**: superseded by AD-015

### AD-013
- **Decision**: Every form field binds through react-hook-form `Controller`, written via `FormField`; form values hold domain types (money as `number | null`, dates as `Date`, missing as `null`), and boundary mappers (`toFormValues`, `toPayload`) convert shape and type only. Other fields are read with `useWatch` locally, never `watch()` at the form root.
- **Reason**: Masked strings in form state were undone by hand 10+ times and `watch` + `setValue` re-rendered whole forms and skipped touched/focus; one binding pattern removes per-field judgement for agents.
- **Trade-off**: One re-render per keystroke in the edited field; `FormField` is one more owned component.
- **Scope**: Frontend forms.
- **Date**: 2026-10-17
- **Status**: active

### AD-014
- **Decision**: Every frontend destination has its own route (`/overview`, `/transactions`, `/categories`, `/plans`), and its URL carries only that screen's filters; the active plan stays a `?plan=` query param. Saved filters are kept per (user, plan, screen).
- **Reason**: Tabs as a `?tab=` param mixed location with filters, so a link from another screen lost the tab's filters; a path per screen also gives PWA shortcuts and nested screens a home.
- **Trade-off**: Old `/?tab=` links land on `/overview` (not mapped); filters saved before the change reset once. The plan in the path (`/plans/5/...`) was deferred.
- **Scope**: Frontend routing, `PlanFiltersGate`, filter storage; new screens add a route, not a tab.
- **Date**: 2026-10-19
- **Status**: active

### AD-015
- **Decision**: Testing model, calibrated. A closed table maps each code kind, recognised by path and file name (`frontend/scripts/testTable.ts`), to a test kind and an amount; a module matching no row gets no test. Business rules, service hooks, URL params and shared hooks get unit tests; feature hooks none of their own; containers flow tests of their decisions only; presentational components stories that run only for states the component handles and its own `play`, the rest catalog (`!test`), every `base/` story catalog. 90% branch coverage on five critical modules only (`money.ts`, `currencyDigits.ts`, `transactionForm.ts`, `categoryForm.ts`, `findracoApi.ts`). No test of library behaviour. Keeps AD-012's flow harness: real providers, MSW only, no `vi.mock` of our modules. CI runs the affected tests on a push and the full suite weekly and on dispatch.
- **Reason**: The content-based criterion and the per-file threshold drove 1442 tests that mostly protected nothing; a path rule is mechanical, and CI time was worker overhead, not test count.
- **Trade-off**: Catalog stories can break unnoticed (`build-storybook` is not in CI); a test the import graph misses waits for the weekly run or the phase-end gate.
- **Scope**: Frontend tests, `scripts/testTable.ts`, `scripts/check-siblings.ts`, `vite.config.ts`, `ci.yml`; supersedes AD-012.
- **Date**: 2026-10-20
- **Status**: active

### AD-016
- **Decision**: Backend standards live in the backend skills, the `CLAUDE.md` Backend section and `.specs/codebase/`, and every checkable one is enforced by the build: ArchUnit (one `ArchitectureTest`), Spotless with palantir-java-format, maven-enforcer (no Lombok/MapStruct, Java 25), `-Xlint:all` with `failOnWarning`, Error Prone. No `@SuppressWarnings`; a wrong check is disabled once, project-wide. Each rule lands in the slice that makes the code comply, never red.
- **Reason**: The backend audit found missing and unchecked standards as the root cause, as on the frontend (AD-010).
- **Trade-off**: No escape hatch; Error Prone can delay a JDK upgrade until it supports it.
- **Scope**: Backend (`backend/`), skills, `CLAUDE.md`, pre-commit hook.
- **Date**: 2026-10-29
- **Status**: active

### AD-017
- **Decision**: The backend is packaged by feature (`transaction`, `category`, `plan`, `auth`, `user`, `dashboard`) plus `shared`, with layer sub-packages (`controller`, `service`, `repository`, `model`, `request`, `response`, `exception`, `config`, and `importer` in `transaction`). `shared` depends on no feature. A feature uses another only through its `service` and `model`; writes to another feature's tables go through its owner's service; aggregate reads may use a read-only repository (`extends Repository`) over the other feature's entity. One name per domain in code, tables and routes (`Transaction*`, `Category*`, `/transaction`, `/category`).
- **Reason**: Packages by type gave no boundary between domains; business rules lived on one path and not another.
- **Trade-off**: Repositories and helpers must be `public` (the boundary is ArchUnit, not the compiler); one large move.
- **Scope**: All backend code; ArchUnit rules.
- **Date**: 2026-10-29
- **Status**: active

### AD-018
- **Decision**: Every backend error is RFC 9457 `application/problem+json` with `type` `urn:findraco:problem:<slug>` from the `ProblemType` enum, plus `requestId` and `field` when one applies; field errors as `errors[{field, code, message}]`. Feature exceptions extend `DomainException`, which carries type and status, handled once in `shared.error`. Statuses are semantic (400 unreadable, 422 invalid, 409 conflicts with state, 404 outside scope, never 403 for scope). User-facing text belongs to the client (`type` → copy map); `detail` is English, for developers, without personal data.
- **Reason**: Three error formats coexisted; the frontend parsed message text; i18n and new channels need a stable identifier.
- **Trade-off**: Changing the `type` format later breaks every client; each new error needs frontend copy (the build forces it).
- **Scope**: Backend `shared.error`, every exception; frontend problem map.
- **Date**: 2026-10-29
- **Status**: active

### AD-019
- **Decision**: The OpenAPI schema is the API contract, made true by springdoc customizers (required unless `@Nullable`, `planId` as path parameter, enums as `$ref`, real success status, common problem responses) and committed as `backend/openapi.json`; an IT fails on any difference. The frontend generates its types from the committed file.
- **Reason**: Generated frontend types were wrong everywhere (all optional, `PlanContext` leaking); contract changes must show in review.
- **Trade-off**: Every DTO change regenerates the snapshot in the same commit.
- **Scope**: Backend `shared.openapi`, `openapi.json`; frontend type generation.
- **Date**: 2026-10-29
- **Status**: active

### AD-020
- **Decision**: Backend tests run on a disposable Postgres 16 Testcontainers instance (`@ServiceConnection`), locally and in CI (`./mvnw -B verify`, deploy waits for it). A closed table decides tests: entity rules and pure logic get unit tests without Spring or mocks; endpoints with a rule or guard get an IT per rule asserting status and `type`; every endpoint × role sits in one role-matrix IT; no mocks of our own classes, fakes at external boundaries (fixed `Clock`, in-memory mail).
- **Reason**: ITs ran against the shared dev database over an SSH tunnel, so CI ran 9 of 32 classes; mock-heavy tests break on refactors without a bug.
- **Trade-off**: Docker needed on the dev machine; a few seconds per run.
- **Scope**: Backend tests, CI.
- **Date**: 2026-10-29
- **Status**: active

### AD-021
- **Decision**: Backend operational configuration lives under `app.*` (including `app.jwt` and `app.cors`), bound by `@Validated @ConfigurationProperties` records that fail startup on a missing or out-of-range value; no `@Value`. Environment variable names stay stable. Operational values (rate limits, CSV bounds, series horizon and schedule, sessions) are configurable; contract values the frontend mirrors (password length, field sizes, money scale, warning ratio) stay in code.
- **Reason**: The user wants what can be tuned in config; a contract value changed only on the server would drift from the client.
- **Trade-off**: One properties record per area.
- **Scope**: Backend configuration.
- **Date**: 2026-10-29
- **Status**: active

### AD-022
- **Decision**: Reads never write. Open-ended series are topped up to today + 12 months by a daily job (also at startup) and on creation or edit; a read past a plan's generated watermark first extends that plan's series in its own transaction. Deleting one occurrence records its date in `recurrence_exceptions` (iCalendar `EXDATE`); the generator never produces an excepted date and reconciles by date. Conforms to AD-002 (materialised future rows); whether future rows become forecasts is the "Recurrence v3" feature.
- **Reason**: Every dashboard read opened a second connection with a write lock; deleted occurrences came back on the next edit.
- **Trade-off**: A job and a watermark; distributed locking needed only with several instances.
- **Scope**: Series generation, read services, dashboard.
- **Date**: 2026-10-29
- **Status**: active

## Handoff

- **Next**: user reviews branch `period-navigator` (M5-06 Done, Verifier PASS on iteration 2, `.specs/features/period-navigator/validation.md`; local only, not pushed). UAT by hand: navigator row placement on Transactions (PNAV-01 AC8, not checkable in a story) and the label-opens-calendar flow on both screens. On push: bump frontend to `1.0.0-beta.21` in its own `chore(release)` commit. `main` carries the unpushed `71bc9c5` (daily DB backup), also on the branch. Deferred: shared period across screens, "All time" on Transactions, `DateRangePicker` now used only by its own story. Quick task `transactions-dead-branches` on branch `dead-branches` (beta.12) still awaiting the user's go
- **Last delivered**: period-navigator Done (2026-10-31): Transactions gets the month navigator (opens on the current month, own row above search, period restored per user/plan), the popover's Date field and chip are gone, the label opens the range calendar on both screens (`resetOnSelect`: first click starts a new range). Period vocabulary and codec lifted to `utils/period.ts` / `utils/periodParams.ts`, navigator to `components/periodNavigator/`; Transactions uses the Overview's `period`/`periodFrom`/`periodTo` keys (old `from`/`to` ignored). Verifier FAIL → 3 fixes → PASS, 7/8 mutants killed overall
- **Verifier lesson**: the sensor never uses a git worktree with `pnpm exec` here: pnpm 11 auto-installs in it (the store lives in the root `node_modules`) and rewrites the real `frontend/node_modules` links (happened 2026-10-31 even with the symlink; repaired with `pnpm install --frozen-lockfile --offline`). Mutate file copies in place, run `node frontend/node_modules/vitest/vitest.mjs run …`, restore and `cmp`
- **Pending decisions (user)**: explain flow test vs E2E with a concrete example when E2E starts (user still unsure why both)
- **Known test limits**: CSV import flow asserts the POST, not the file (jsdom FormData); two hook branches unreachable from any screen (recorded in test-calibration `audit.md` F7)
- **Affected ≤60s goal**: no typical post-cut sample yet; check on the next small push
- **UAT**: mobile-navigation and frontend-standards checks done by the user (2026-10-20), all OK
- **Process rules (user, 2026-10-19)**: full gate once per phase, related tests per task, fewer and grouped tasks; workers stay; every push that ships a frontend fix or change bumps `1.0.0-beta.N`; release tags later (ROADMAP)
- **1.0 criteria**: draft at the top of the ROADMAP
- **Explain to the user when asked (2026-10-18)**: (1) the story-gate refinement (design decision 8, T126; now superseded by AD-015); (2) the `interface` in `*.d.ts` exception (E1 addendum, T11)
- **Low notes**: `buildMutationOptions` keeps an unreachable "Operation completed successfully." fallback; one Storybook duplicate-React flake after `react-router-dom` entered stories (fix: `optimizeDeps.include`); the two `setupUnit.test.ts` cases depend on their order; Vitest 3.2.7 `--changed` hits EISDIR on the tooling project (tooling runs in full, ~1s)
- **Queue**: backend standards review (include CSV import parsing tests: `CsvImportIT` covers only dedup; bad date/amount, missing column, empty file, comma in description untested. Each layer tests its own job: the frontend only sends the file. After it, check which frontend tests the backend makes redundant), Recurrence v3: actual vs forecast (own Discuss; is a future occurrence an entry or a forecast; see backend-standards S26), M5-07 PWA, M5-05 Claude MCP connector, M5-10 i18n, local Docker DB quick task, round-2 UX topics
- **Blockers**: none. **Branch**: `period-navigator` (local). API/Vite not running
