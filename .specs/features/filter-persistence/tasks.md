# Filter Persistence Tasks

## Execution Protocol (MANDATORY -- do not skip)

Implement these tasks with the `tlc-spec-driven` skill: **activate it by name and follow its Execute flow and Critical Rules.** Do not search for skill files by filesystem path. The skill is the source of truth for the full flow (per-task cycle, sub-agent delegation, adequacy review, Verifier, discrimination sensor).

**If the skill cannot be activated, STOP and tell the user - do not proceed without it.**

---

**Design**: `.specs/features/filter-persistence/design.md`
**Status**: Approved

---

## Test Coverage Matrix

> Generated from codebase, project guidelines, and spec - confirm before Execute. Guidelines found: `CLAUDE.md`, `.specs/codebase/TESTING.md`, `frontend/package.json` (vitest `unit` project, jsdom).

| Code Layer | Required Test Type | Coverage Expectation | Location Pattern | Run Command |
| ---------- | ------------------ | -------------------- | ---------------- | ----------- |
| Pure logic (param codec, storage helpers) | unit | All branches; 1:1 to spec ACs; every listed edge case | co-located `*.test.ts` | `npm run test` |
| Hooks (URL state, gate, chips, service hook) | unit (`renderHook` + `MemoryRouter` / real `QueryClient`, HTTP mocked at module level) | Every AC the hook owns: happy + edge + failure | co-located `*.test.ts(x)` | `npm run test` |
| Presentational wiring (HomePage, tabs, popover) | none | build gate (logic lives in tested hooks) | - | build gate |

## Gate Check Commands

> Generated from codebase - confirm before Execute. Run from `frontend/`.

| Gate Level | When to Use | Command |
| ---------- | ----------- | ------- |
| Quick | After tasks with unit tests only | `npm run test` |
| Full | No integration/e2e layer on the frontend | `npm run test` |
| Build | After phase completion or wiring-only tasks | `npm run lint && npm run build && npm run test` |

---

## Execution Plan

### Phase 1: Foundation

Independent building blocks, executed in order.

```
T1 → T2 → T3 → T4
```

### Phase 2: State layer

```
T5 → T6 → T7
```

### Phase 3: UI wiring

```
T8 → T9
```

---

## Task Breakdown

### T1: Home filter param codec

**What**: Pure parse/serialize functions for Overview and Transactions URL params, plus `resolvePeriodDates(token, now)` moved out of `OverviewTab`.
**Where**: `frontend/src/features/home/filters/homeFilterParams.ts`
**Depends on**: None
**Reuses**: `getPeriodDates` from `OverviewTab.tsx`; `PagedFinancialTransactionsFilter` / `FinancialTransactionSortBy` types
**Requirement**: FPERS-01, FPERS-06, FPERS-07 (defaults), FPERS-09, FPERS-10 (inverted range)

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [x] Round-trip parse(serialize(x)) = x for every field in the design's URL table; defaults are omitted on serialize
- [x] Unparseable values (non-numeric id, malformed date, unknown period/type/sort) fall back to that field's default
- [x] Custom range with `from > to` falls back to `this-month`
- [x] `resolvePeriodDates` resolves each preset relative to the injected `now` (saved `this-month` in a later month yields the later month)
- [x] Quick gate passes

**Tests**: unit
**Gate**: quick

---

### T2: Filter storage helpers

**What**: `saveHomeFilters(userId, planId, search)` / `loadHomeFilters(userId, planId)` keyed `homeFilters:{userId}:{planId}`, failure-safe.
**Where**: `frontend/src/lib/filterStorage.ts`
**Depends on**: T1
**Reuses**: none
**Requirement**: FPERS-05, FPERS-07, FPERS-08 (namespacing)

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [x] Different users / plans never read each other's state
- [x] A throwing `localStorage` (getItem/setItem) makes save a no-op and load return `null`, no exception escapes
- [x] Quick gate passes

**Tests**: unit
**Gate**: quick

---

### T3: Logout clears only session keys

**What**: Add `clearSessionStorage()` removing `accessToken`, `user`, `activePlanId`; `Navbar.logout` uses it instead of `clearStorage()`.
**Where**: `frontend/src/lib/storage.ts`
**Depends on**: T2
**Reuses**: `removeItemFromStorage`
**Requirement**: Assumption "saved filters kept on logout"

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [x] After `clearSessionStorage()`, auth keys are gone and `homeFilters:*` and the theme key remain
- [x] `Navbar.tsx` call site switched
- [x] Quick gate passes

**Tests**: unit
**Gate**: quick

---

### T4: Category-by-id service hook

**What**: `useGetFinancialTransactionCategory(id)` hitting `GET /plan/{planId}/financial-transaction-category/{id}`, key `["financialTransactionCategory", planId, id]`, disabled when `id` is null.
**Where**: `frontend/src/api/services/useFinancialTransactionCategoryService.ts`
**Depends on**: T3
**Reuses**: `useGetFinancialTransactionCategories` pattern; `usePlanService.test.ts` harness
**Requirement**: FPERS-09, FPERS-10

**Tools**:

- MCP: NONE
- Skill: `api-integration`

**Done when**:

- [x] No request when `id` is null; one request for a given (plan, id) across re-renders
- [x] Exported key builder used for cache seeding by T7
- [x] Quick gate passes

**Tests**: unit
**Gate**: quick

---

### T5: `useHomeFilters` URL-state hook

**What**: Hook reading `useSearchParams` via the T1 codec; exposes `tab`, `overview`, `transactions` and updaters; filter updates use `replace: true`, tab switches push; `clearTransactions` removes only Transactions params.
**Where**: `frontend/src/features/home/hooks/useHomeFilters.ts`
**Depends on**: None
**Reuses**: T1 codec
**Requirement**: FPERS-01, FPERS-03, FPERS-04

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [x] Updating a filter changes the URL and does not add a history entry; switching tab adds one
- [x] Updating one tab's filters leaves the other tab's params intact
- [x] Clear removes every Transactions param and nothing else
- [x] Quick gate passes

**Tests**: unit
**Gate**: quick

---

### T6: `HomeFiltersGate` restore + save

**What**: Component that, during render, redirects (`<Navigate replace>`) to the saved state of (user, active plan) when the URL has no home params or `plan` ≠ active plan; otherwise renders children and saves the query string on change.
**Where**: `frontend/src/features/home/filters/HomeFiltersGate.tsx`
**Depends on**: T5
**Reuses**: T2 storage, `usePlanContext`, `useAuth`
**Requirement**: FPERS-02, FPERS-05, FPERS-07, FPERS-08

**Tools**:

- MCP: NONE
- Skill: `component-creation`

**Done when**:

- [x] No params + saved state → URL becomes saved state with `plan`; children never render with default params first
- [x] No params + nothing saved → `?plan=<active>` (defaults)
- [x] URL params with matching `plan` win and are saved
- [x] `plan` mismatch → active plan's saved state is loaded (switch back restores the previous plan's filters)
- [x] Quick gate passes

**Tests**: unit
**Gate**: quick

---

### T7: Transaction filter chips hook

**What**: `useTransactionFilterChips` resolving member names from `useGetPlanMembers` cache and the category name from T4; drops a stale category (404) or member (absent after load) via `useHomeFilters`; exposes a `seedCategory(category)` that `setQueryData`s the picked category.
**Where**: `frontend/src/features/home/hooks/useTransactionFilterChips.ts`
**Depends on**: T6
**Reuses**: chip-building logic from `useTransactionFilters.ts`, T4, T5
**Requirement**: FPERS-09, FPERS-10

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] Chip labels match today's (type, category name, member name, date range, amount range)
- [ ] Seeded category → zero category requests
- [ ] Category 404 / member not in plan → filter removed from URL
- [ ] Quick gate passes

**Tests**: unit
**Gate**: quick

---

### T8: Home + Overview wiring

**What**: `HomePage` renders inside `HomeFiltersGate` and takes the tab from `useHomeFilters`; `OverviewTab` drops its local period/range/member state for `useHomeFilters`, ignoring the member filter when the plan has one member.
**Where**: `frontend/src/features/home/components/overview/OverviewTab.tsx`
**Depends on**: None
**Reuses**: T5, T6, T1 `resolvePeriodDates`
**Requirement**: FPERS-01, FPERS-02, FPERS-06, FPERS-10

**Tools**:

- MCP: NONE
- Skill: `component-creation`

**Done when**:

- [ ] `HomePage.tsx` and `OverviewTab.tsx` hold no filter `useState`
- [ ] Build gate passes

**Tests**: none
**Gate**: build

---

### T9: Transactions wiring

**What**: `TransactionsTab` and `TransactionFilterPopover` use `useHomeFilters` + `useTransactionFilterChips` (page number stays local, reset to 0 on filter change); popover seeds the picked category; `useTransactionFilters.ts` deleted.
**Where**: `frontend/src/features/home/components/transactions/TransactionsTab.tsx`
**Depends on**: T8
**Reuses**: T5, T7
**Requirement**: FPERS-01, FPERS-02, FPERS-04, FPERS-09

**Tools**:

- MCP: NONE
- Skill: `component-creation`

**Done when**:

- [ ] Search input keeps a local draft, debounced 400 ms into `q`
- [ ] `useTransactionFilters.ts` removed, no references left
- [ ] Manual check in the dev app: every spec Independent Test passes
- [ ] Build gate passes

**Tests**: none
**Gate**: build
