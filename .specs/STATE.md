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
- **Status**: active

### AD-013
- **Decision**: Every form field binds through react-hook-form `Controller`, written via `FormField`; form values hold domain types (money as `number | null`, dates as `Date`, missing as `null`), and boundary mappers (`toFormValues`, `toPayload`) convert shape and type only. Other fields are read with `useWatch` locally, never `watch()` at the form root.
- **Reason**: Masked strings in form state were undone by hand 10+ times and `watch` + `setValue` re-rendered whole forms and skipped touched/focus; one binding pattern removes per-field judgement for agents.
- **Trade-off**: One re-render per keystroke in the edited field; `FormField` is one more owned component.
- **Scope**: Frontend forms.
- **Date**: 2026-10-17
- **Status**: active

## Handoff

- **Feature**: Frontend standards (`.specs/features/frontend-standards/`). Spec, design (approved 2026-10-17, decisions 1–10) and tasks (125 tasks, 17 phases, approved) are in place; AD-010..AD-013 logged above
- **Phase / Task**: **Execute**. Done: Phases 1–6 (T1–T42; STD-01..04 marked Done in spec traceability) and Phase 7 T43–T46. **Next: T47** (`HomeFiltersGate` + `filterStorage` move to `src/app/home/`, gate test without `vi.mock`, exported-keys case), then Phase 8 (T48–T55)
- **How Execute runs**: one sub-agent worker per batch of whole phases (~7 tasks), prompt = read implement.md + coding-principles + tasks.md + the phase's design decisions + the five frontend skills; worker never pushes. Orchestrator reviews each report, fixes artifacts, then dispatches the next batch
- **Explain to the user when asked (user request, 2026-10-18)**: (1) the story-gate refinement (design decision 8, T126: containers follow our hooks; a container renders only components); (2) the `interface` in `*.d.ts` exception below. Both were decided while the user said "seguir" without understanding them yet
- **Open topic with the user (revisit before STD-09 or sooner)**: T11 moved the axios augmentation (`declare module "axios"`, needs an `interface`) to `src/api/clients/axios.d.ts` and turned `consistent-type-definitions` off for `**/*.d.ts` (E1 addendum in `context.md`). The user did not understand/agree and wants to discuss it later
- **Pending verification**: the push of 2026-10-18 (this commit) is the first CI run with Playwright (T42 "next push" box) and the a11y fixes (light `--destructive` red-600 → red-700). Check `gh run list --limit 1`; tick T42's last box when green
- **Known follow-ups**: `TableHeader.tsx` has `header.column.id as keyof TData` (forced `as`, not lint-detectable); app `SelectTrigger`s may lack label association (surfaces in STD-10 stories); `src/test/scenarios.ts` not created yet (first flow test creates it); the commit-msg hook rejects git's default merge messages
- **Decisions this session**: form types `XxxFormValues` + `XxxFormOutput` (context.md); handlers imported by tests only; `Amount` stays `font-mono`; `FormField` built at the start of STD-06; table context replaced by a render prop (T28)
- **Paused**: M5-09 mobile-navigation (spec approved, Design waits for STD-12). Backend standards review (ROADMAP Open Todos) precedes STD-13
- **Runtime state**: Playwright Chromium build 1234 installed locally (`~/.cache/ms-playwright`). API/Vite not running
- **Blockers**: none. **Uncommitted files**: none. **Branch**: main, pushed
