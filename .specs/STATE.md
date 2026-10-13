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

## Handoff

- **Feature**: M5-04 Categories revamp (`.specs/features/categories-revamp/`). Branch `feat/categories-revamp`, not pushed or merged
- **Phase / Task**: Validate → UI/UX polish round. Verifier iteration 3 = PASS (`validation.md`); full backend `./mvnw verify` and frontend tests (269) green. First hands-on UAT by the user: OK overall
- **Completed**: T1–T24, F1–F5, verifier gap fix. `dev_finsight` re-seeded through the API (`test@findraco.local` = owner, `partner@findraco.local` = editor, password `Findraco#2026`; plan has Food › Groceries/Delivery/Restaurants, Shopping with per-member limits 650/350 where the partner is over, "Partner gym" owned by the partner, Income › Salary/Freelance)
- **In-progress** (file:line): none
- **Next step**: run a UI/UX polish round on the Categories tab and related screens. **The user explicitly wants the next session to ask a lot of questions before building**: run it as a Discuss pass (`references/discuss.md`), one gray area at a time, offering concrete options with a recommendation, and record answers in `context.md` (or an amendment section) before any code. Start by asking the user which screens/flows bothered them while testing, then go through the known topic below and any others found by walking the UI (tab layout, tree density, empty states, form sheet, delete dialog, mobile width, the Overview breakdown, the participants-follow-category behaviour).
  - Known topic (raised by the user): it is unclear how to see whether a person is over **their own** limit outside the unfiltered view; applying the member filter barely changes the limits. Cause: the Categories tab has no member filter and per-member rows are collapsed behind a small 👥 button (`frontend/src/features/home/components/categories/CategoryTreeRow.tsx`); on the member-filtered Overview, categories without a per-member entry compare that member's share against the whole category limit (`CategorySpendingAssembler` `Limits.forRow`). Proposal already floated, not yet approved: (1) "View as" member filter on the Categories tab (member's spend vs their own limit; no personal limit → spend only, limit labelled shared, no % bar); (2) same rule on the member-filtered Overview; (3) unfiltered: a badge naming who is over, member rows expanded by default when a category has per-member limits. Ask before assuming any of it.
  - After the round: implement via tlc (amend spec/tasks, batch workers, Verifier), UAT, then ship (merge/push only with the user's explicit OK). Next roadmap item: M5-05 Claude MCP connector. Pending quick task: local dev database (ROADMAP Open Todos)
- **Runtime state**: API runs detached (`setsid nohup ./mvnw spring-boot:run`), log `backend/target/api.log`, stop with `pkill -f spring-boot:run`. Vite dev server on :5173. DB via SSH tunnel `ssh -N -L 5432:localhost:5432 vps`
- **Blockers**: none. `npm run lint` fails on main with 23 pre-existing storybook/table errors; branch adds none
- **Uncommitted files**: none
- **Branch**: feat/categories-revamp
