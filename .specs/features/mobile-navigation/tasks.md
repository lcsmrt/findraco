# Mobile Navigation Tasks

## Execution Protocol (MANDATORY -- do not skip)

Implement these tasks with the `tlc-spec-driven` skill: **activate it by name and follow its Execute flow and Critical Rules.** Do not search for skill files by filesystem path. The skill is the source of truth for the full flow (per-task cycle, sub-agent delegation, adequacy review, Verifier, discrimination sensor).

**If the skill cannot be activated, STOP and tell the user - do not proceed without it.**

---

**Design**: `.specs/features/mobile-navigation/design.md`
**Status**: Approved (user, 2026-10-19)

---

## Test Coverage Matrix

> Generated from codebase, project guidelines, and spec - confirm before Execute. Guidelines found: `CLAUDE.md` (Frontend), `.claude/skills/frontend-testing/SKILL.md`, `.specs/codebase/TESTING.md`, `frontend/vite.config.ts` (`unit`, `tooling`, `storybook` projects), `frontend/package.json` (`pnpm test` runs the sibling gate and 90% branch coverage per logic module), AD-012.

| Code Layer | Required Test Type | Coverage Expectation | Location Pattern | Run Command |
| ---------- | ------------------ | -------------------- | ---------------- | ----------- |
| Logic module (`.ts` with a decision point, arithmetic or iteration) | unit | All branches; 1:1 to the ACs it serves; every listed edge case; ≥ 90% branches | sibling `*.test.ts` | Quick |
| Service hooks | unit through MSW (`renderHookWithProviders`, handler factories) | Every mutation touched: the success toast text from the design's message table; the invalidated query keys | sibling `*.test.ts` + `*.handlers.ts` | Quick |
| Flow (container or screen whose behaviour a task changes) | integration (`unit` project, `renderWithProviders`, real router, network via MSW only, no `vi.mock` of our modules) | Happy + edge + error paths of the ACs touched | sibling `*.test.tsx` | Quick |
| Presentational component | story (`storybook` project, a11y in error mode) | Each variant and state; mobile viewport (390px) when the layout is narrow-only; `play` for links/buttons the AC names | sibling `*.stories.tsx` | Full |
| Pure renames | none (existing tests and stories move with their subjects) | Build gate | - | Build |
| Skills and docs | none | The task's `Done when` checked against `design.md` | - | Docs |

## Gate Check Commands

> Generated from codebase - confirm before Execute. Run from `frontend/`.

| Gate Level | When to Use | Command |
| ---------- | ----------- | ------- |
| Docs | Skill and doc tasks | none; `Done when` checked against `design.md` |
| Quick | Tasks with unit or integration tests | `pnpm exec vitest run --project=unit` |
| Full | Tasks with stories | `pnpm exec vitest run --project=unit --project=storybook` |
| Build | Phase end, renames, routing | `pnpm lint && pnpm build && pnpm test` |

---

## Execution Plan

Phases are ordered and run sequentially - each phase completes before the next begins, and tasks within a phase execute in order.

### Phase 1: Services (refresh and messages)

Independent of the navigation; lands first so later flow tests assert the final messages.

```
T1 → T2 → T3 → T4 → T5 → T6
```

### Phase 2: One route per screen

```
T7 → T8 → T9 → T10 → T11 → T12 → T13
```

### Phase 3: Navigation UI

```
T14 → T15 → T16 → T17
```

### Phase 4: Cleanup and docs

```
T18 → T19 → T20 → T21
```

---

## Task Breakdown

### T1: Refresh every transaction-derived query after a transaction write

**What**: Add `invalidateTransactionData(queryClient)` (invalidates `financialTransactions`, `categoryUsage`, `categorySpending`, `dashboardSummary`, `dashboardTrend` by key-name prefix, not awaited) and call it from every transaction mutation in place of their own key lists: create, update, delete, series create/update/delete, CSV import.
**Where**: `frontend/src/api/services/useFinancialTransactionService.ts`
**Depends on**: None
**Reuses**: existing `onSuccess` wiring; `useFinancialTransactionService.test.ts`
**Requirement**: NAV-02 (AC 4)

**Tools**: MCP: NONE · Skill: `api-integration`, `frontend-testing`

**Done when**:

- [x] One helper; no transaction mutation lists keys of its own (series update/delete still invalidate their own `financialTransactionSeries` entry, the series definition, which is not transaction-derived list data)
- [x] Tests: after a successful create, update, delete and series create, a seeded `dashboardSummary`, `dashboardTrend` and `categorySpending` query is invalidated (state `isInvalidated` or refetched), and the transactions query too (also import, series update and series delete)
- [x] A failed create invalidates nothing
- [x] Gate check passes: Quick (83 files, 752 tests, passing)

**Tests**: unit (service through MSW)
**Gate**: quick
**Commit**: `fix(transactions): refresh dashboard data after any transaction write`

---

### T2: Short success messages in the transaction service

**What**: Apply the design's message table to the seven transaction mutations ("Transaction added.", "Series created.", "Transaction updated.", "Series updated.", "Transaction deleted.", "Series deleted.", "Transactions imported.").
**Where**: `frontend/src/api/services/useFinancialTransactionService.ts`
**Depends on**: T1
**Reuses**: `buildMutationOptions`
**Requirement**: NAV-05 (AC 1, 2), NAV-02 (AC 3)

**Tools**: MCP: NONE · Skill: `api-integration`, `frontend-testing`

**Done when**:

- [x] Each mutation's success toast text equals its table row (spy on `sonner`'s `toast.success`, an external module)
- [x] `useCsvImport.test.ts` and any other assertion of the old text updated to the table (two assertions in `useCsvImport.test.ts`; no other)
- [x] No string in the file contains "successfully"
- [x] Gate check passes: Quick (83 files, 752 tests, passing)

**Tests**: unit (service through MSW)
**Gate**: quick
**Commit**: `feat(transactions): short success messages`

---

### T3: Short success messages in the category service

**What**: "Category created.", "Category updated.", "Category deleted."
**Where**: `frontend/src/api/services/useFinancialTransactionCategoryService.ts`
**Depends on**: T2
**Reuses**: T2's test pattern
**Requirement**: NAV-05 (AC 1, 2)

**Tools**: MCP: NONE · Skill: `api-integration`, `frontend-testing`

**Done when**:

- [x] Each mutation's success toast text equals its table row
- [x] Gate check passes: Quick (83 files, 755 tests, passing)

**Tests**: unit (service through MSW)
**Gate**: quick
**Commit**: `feat(categories): short success messages`

---

### T4: Short success messages in the plan service

**What**: "Plan created.", "Plan renamed.", "Plan archived.", "Ownership transferred.", "You left the plan.", "Role updated.", "Member removed."
**Where**: `frontend/src/api/services/usePlanService.ts`
**Depends on**: T3
**Reuses**: T2's test pattern
**Requirement**: NAV-05 (AC 1, 2)

**Tools**: MCP: NONE · Skill: `api-integration`, `frontend-testing`

**Done when**:

- [x] Each mutation's success toast text equals its table row
- [x] Gate check passes: Quick (83 files, 755 tests, passing)

**Tests**: unit (service through MSW)
**Gate**: quick
**Commit**: `feat(plans): short success messages`

---

### T5: Short success messages in the invitation service

**What**: "Invitation created.", "Invitation revoked.", "You joined the plan."
**Where**: `frontend/src/api/services/useInvitationService.ts`
**Depends on**: T4
**Reuses**: T2's test pattern
**Requirement**: NAV-05 (AC 1, 2)

**Tools**: MCP: NONE · Skill: `api-integration`, `frontend-testing`

**Done when**:

- [x] Each mutation's success toast text equals its table row (new `useInvitationService.test.ts`; `revoke` and `accept` handler factories added)
- [x] Gate check passes: Quick (84 files, 760 tests, passing)

**Tests**: unit (service through MSW)
**Gate**: quick
**Commit**: `feat(plans): short invitation success messages`

---

### T6: Short success message in the auth service

**What**: "Account created."; the reset-password message stays as it is.
**Where**: `frontend/src/api/services/useAuthService.ts`
**Depends on**: T5
**Reuses**: T2's test pattern
**Requirement**: NAV-05 (AC 1, 2)

**Tools**: MCP: NONE · Skill: `api-integration`, `frontend-testing`

**Done when**:

- [x] Register's success toast is "Account created."; reset password's is unchanged
- [x] `grep -r successfully frontend/src/api/services` finds nothing outside tests (finds nothing at all)
- [x] Gate check passes: Build (lint, build, sibling gate, coverage; unit 84 files / 760 tests, tooling + storybook 95 files / 643 tests, passing)

**Tests**: unit (service through MSW)
**Gate**: build
**Commit**: `feat(auth): short success message on sign-up`

---

### T7: Destination list and URL mapping

**What**: `Destination`, `DESTINATION_PATHS` and `currentDestination(pathname)` (`null` off the four paths).
**Where**: `frontend/src/app/layout/navigation.ts`
**Depends on**: None
**Reuses**: `PATHS`
**Requirement**: NAV-06 (AC 1), NAV-01 (AC 4)

**Tools**: MCP: NONE · Skill: `feature-structure`, `frontend-testing`

**Done when**:

- [x] `PATHS` gains `overview`, `transactions`, `categories`; `home` stays `/` for the redirect only
- [x] Tests: each of the four paths maps to its destination; `/invitation/abc`, `/` and an unknown path map to `null`; a trailing slash and a nested path (`/transactions/42`) map to the parent destination
- [x] Gate check passes: Quick (85 files, 770 tests, passing)

**Tests**: unit
**Gate**: quick
**Commit**: `feat(navigation): destination list and url mapping`

---

### T8: Saved filters per screen

**What**: Move `filterStorage` to `app/routing/` and key it by screen: `filters:<screen>:<user>:<plan>`; old `homeFilters:` keys are not read.
**Where**: `frontend/src/app/routing/filterStorage.ts` (moved from `app/home/`, with its test)
**Depends on**: T7
**Reuses**: current never-throw behaviour
**Requirement**: NAV-06 (AC 3)

**Tools**: MCP: NONE · Skill: `frontend-testing`

**Done when**:

- [x] Saving for one screen leaves another screen's entry unchanged; plans stay separate
- [x] An old `homeFilters:<user>:<plan>` entry is not returned
- [x] Storage that throws still never throws (existing cases kept; the key-format case now asserts the new key; `HomeFiltersGate` reads and writes the `overview` entry until T9, its test fixtures follow the new key; `storage.test.ts` fixtures use the new key)
- [x] Gate check passes: Quick (85 files, 772 tests, passing)

**Tests**: unit
**Gate**: quick
**Commit**: `feat(navigation): save filters per screen`

---

### T9: `PlanFiltersGate` per screen

**What**: Turn `HomeFiltersGate` into `PlanFiltersGate({ screen, paramKeys, children })`: the same plan-sync rules, scoped to one screen's keys and storage entry. `PLAN_PARAM` and `parsePlanParam` move with it.
**Where**: `frontend/src/app/routing/PlanFiltersGate.tsx` (from `app/home/HomeFiltersGate.tsx`, with its test)
**Depends on**: T8
**Reuses**: every existing gate rule and test case
**Requirement**: NAV-06 (AC 2, 3, 4, 5)

**Tools**: MCP: NONE · Skill: `frontend-testing`

**Done when**:

- [x] Every existing `HomeFiltersGate.test.tsx` case passes against `PlanFiltersGate` (adapted only in names, paths, the screen prop and per-screen fixtures; the `tab` row of the exported-keys table and the tab step of the "saves changes" case went with the tab param; the exported-keys table runs per screen)
- [x] New: opening a screen without params restores that screen's saved filters, or none (AC 2)
- [x] New: a filter change on Transactions leaves the Overview's saved entry unchanged (AC 3)
- [x] New: a plan switch on a screen redirects to the same path with the new plan's saved filters (AC 4)
- [x] New: a link with filter params and another member plan applies them and makes that plan active (AC 5)
- [x] Gate check passes: Quick (86 files, 776 tests, passing)

**Tests**: integration
**Gate**: quick
**Commit**: `feat(navigation): filters gate per screen`

---

### T10: Rename `OverviewTab` to `OverviewPage`

**What**: Rename the screen, its view, story and test files and symbols.
**Where**: `frontend/src/features/overview/OverviewTab*.tsx` → `OverviewPage*.tsx`
**Depends on**: T9
**Reuses**: -
**Requirement**: NAV-06 (AC 1)

**Tools**: MCP: NONE · Skill: `feature-structure`

**Done when**:

- [x] No `OverviewTab` symbol or file remains; story titles follow
- [x] Gate check passes: Build (lint, build, sibling gate, coverage; unit 86 files / 776 tests, tooling + storybook 95 files / 643 tests, passing)

**Tests**: none
**Gate**: build
**Commit**: `refactor(overview): rename the tab to a page`

---

### T11: Rename `TransactionsTab` to `TransactionsPage`

**What**: Rename the screen, its view, story and test files and symbols.
**Where**: `frontend/src/features/transactions/TransactionsTab*.tsx` → `TransactionsPage*.tsx`
**Depends on**: T10
**Reuses**: -
**Requirement**: NAV-06 (AC 1)

**Tools**: MCP: NONE · Skill: `feature-structure`

**Done when**:

- [x] No `TransactionsTab` symbol or file remains; story titles follow
- [x] Gate check passes: Build (lint, build, sibling gate, coverage; unit 86 files / 776 tests, tooling + storybook 95 files / 643 tests, passing)

**Tests**: none
**Gate**: build
**Commit**: `refactor(transactions): rename the tab to a page`

---

### T12: Rename `CategoriesTab` to `CategoriesPage`

**What**: Rename the screen, its view, story and test files and symbols.
**Where**: `frontend/src/features/categories/CategoriesTab*.tsx` → `CategoriesPage*.tsx`
**Depends on**: T11
**Reuses**: -
**Requirement**: NAV-06 (AC 1)

**Tools**: MCP: NONE · Skill: `feature-structure`

**Done when**:

- [x] No `CategoriesTab` symbol or file remains; story titles follow
- [x] Gate check passes: Build (lint, build, sibling gate, coverage; unit 86 files / 776 tests, tooling + storybook 95 files / 643 tests, passing)

**Tests**: none
**Gate**: build
**Commit**: `refactor(categories): rename the tab to a page`

---

### T13: Routes per screen

**What**: `AppRouter` serves `/overview`, `/transactions`, `/categories` (each in its `PlanFiltersGate`), `/plans`, and `/` as `<Navigate replace to="/overview">`; login, accept-invitation and not-found go to `/overview`; `src/app/home/` is deleted. `TransactionsPage` loses `onManageCategories`' caller here (the prop itself goes in T18).
**Where**: `frontend/src/app/routing/AppRouter.tsx`
**Depends on**: T12
**Reuses**: `PlanFiltersGate`, `PATHS`
**Requirement**: NAV-06 (AC 1, 6)

**Tools**: MCP: NONE · Skill: `feature-structure`, `frontend-testing`

**Done when**:

- [x] Routing test: `/` lands on `/overview`; each path renders its screen; the login redirect without `from` lands on `/overview`
- [x] No import of `app/home` remains; `HomeTabsView` story is gone; the sibling gate passes
- [x] Gate check passes: Build (lint, build, sibling gate, coverage; unit 85 files / 777 tests, tooling + storybook 94 files / 638 tests, passing)

**Tests**: integration
**Gate**: build
**Commit**: `feat(navigation): one route per screen`

---

### T14: `TabRowView`

**What**: Wide-screen row: links to the four destinations (active one underlined, `aria-current="page"`), and "New Transaction" at the end when `onAdd` is given; hidden below `sm`.
**Where**: `frontend/src/app/layout/TabRowView.tsx` (+ `TabRowView.stories.tsx`)
**Depends on**: None
**Reuses**: the tab styling from the removed `HomeTabsView`; `Button`; `DESTINATION_PATHS`
**Requirement**: NAV-03 (AC 1, 2), NAV-02 (AC 1, 5)

**Tools**: MCP: NONE · Skill: `component-creation`, `frontend-testing`

**Done when**:

- [x] Stories: each destination active; without add (VIEWER); `play` checks order Overview · Transactions · Categories · Plans and `aria-current` on the active one (links render through `RouterLink`, so the view stays presentational; stories wrap it in a `MemoryRouter` at a 1024px viewport)
- [x] Gate check passes: Full (176 files, 1236 tests, passing)

**Tests**: story
**Gate**: full
**Commit**: `feat(navigation): wide-screen tab row`

---

### T15: `BottomBarView`

**What**: Narrow-screen bar fixed to the bottom: Overview · Transactions · (+) · Categories · Plans, icon + visible label, active item in `primary` with `aria-current="page"`, four evenly spaced items without add, bottom padding `env(safe-area-inset-bottom)`; hidden from `sm`.
**Where**: `frontend/src/app/layout/BottomBarView.tsx` (+ `BottomBarView.stories.tsx`)
**Depends on**: T14
**Reuses**: lucide icons, `Text`, `DESTINATION_PATHS`
**Requirement**: NAV-01 (AC 1, 3, 4, 8), NAV-02 (AC 5, 6)

**Tools**: MCP: NONE · Skill: `component-creation`, `frontend-testing`

**Done when**:

- [x] Stories at 390px: each destination active; without add; `play` checks the order, the labels, `aria-current`, and that the add button calls `onAdd` (without add, `play` also checks four equal widths filling the bar; the active item uses `text-primary-ink`, the primary hue at text contrast, since plain `primary` fails the a11y contrast check)
- [x] Gate check passes: Full (177 files, 1241 tests, passing)

**Tests**: story
**Gate**: full
**Commit**: `feat(navigation): mobile bottom bar`

---

### T16: `MainLayoutView` slots and bottom space

**What**: Slots `navigation?: { tabRow, bottomBar }` and `overlay?`; below `sm`, when navigation is given, the main area reserves `calc(4rem + env(safe-area-inset-bottom))` at the bottom.
**Where**: `frontend/src/app/layout/MainLayoutView.tsx` (+ story)
**Depends on**: T15
**Reuses**: current frame
**Requirement**: NAV-01 (AC 7)

**Tools**: MCP: NONE · Skill: `component-creation`, `frontend-testing`

**Done when**:

- [x] Stories: with navigation and long content at 390px (`play` scrolls to the end and checks the last row sits above the bar); without navigation (accept-invitation, `WithPage`, now asserting neither nav shows). With navigation the page gets the `py-4 gap-6` spacing the removed `HomeTabsView` gave the screens
- [x] Gate check passes: Full (177 files, 1242 tests, passing; the bar-space check fails with the reserve removed)

**Tests**: story
**Gate**: full
**Commit**: `feat(navigation): layout slots and space for the bottom bar`

---

### T17: `MainLayout` wires navigation and the global add

**What**: The container shows navigation on the four destinations only, derives the current one, passes `onAdd` only when `canCreateTransactions`, and owns one `TransactionFormDrawer` in create mode.
**Where**: `frontend/src/app/layout/MainLayout.tsx`
**Depends on**: T16
**Reuses**: `currentDestination`, `usePlanPermissions`, `TransactionFormDrawer`
**Requirement**: NAV-01 (AC 5, 6), NAV-02 (AC 2, 3, 4, 5, 7 + edges), NAV-03 (AC 3 + accept-invitation edge)

**Tools**: MCP: NONE · Skill: `component-creation`, `frontend-testing`

**Done when**:

- [x] Integration (`MainLayout.test.tsx`, real router, MSW): tapping each destination navigates to its path; Plans → `/plans` (also: tapping Transactions restores its saved search; the tab row's Plans tab navigates and turns active)
- [x] As EDITOR on `/overview`: "+" opens "New Transaction" with Expense selected; saving closes the form, stays on `/overview`, shows "Transaction added.", and the summary request runs again
- [x] Saving from `/plans` stays on `/plans`
- [x] A failed create keeps the form open with its values and shows no success toast
- [x] As VIEWER: no "+" and no "New Transaction"; switching from an EDITOR plan to a VIEWER plan hides them without a reload (through the real switcher); while plans load, neither shows
- [x] `/invitation/:token` shows neither the tab row nor the bar (`invitationHandlers.preview` factory added)
- [x] Gate check passes: Build (lint, build, sibling gate, coverage; unit 86 files / 791 tests, tooling + storybook 96 files / 649 tests, passing)

**Tests**: integration
**Gate**: build
**Commit**: `feat(navigation): global add and navigation in the layout`

---

### T18: Transactions toolbar without the moved buttons

**What**: Drop "New Transaction" and "Manage Categories" from the toolbar, with the `onCreate` and `onManageCategories` props; drop `useTransactionActions.openCreate` if unused.
**Where**: `frontend/src/features/transactions/TransactionsPageView.tsx` (and its container, story, test)
**Depends on**: None
**Reuses**: -
**Requirement**: NAV-02 (AC 8), NAV-04 (AC 1, 2)

**Tools**: MCP: NONE · Skill: `component-creation`, `frontend-testing`

**Done when**:

- [x] Flow test: the toolbar shows search, filters and import, and neither removed button
- [x] Story updated (`SharedPlan` no longer clicks "New Transaction"; it checks import shows and neither removed button does); existing search, filter and import tests unchanged and green
- [x] `useTransactionActions.openCreate` and its create state removed (unused); its "opens the drawer empty to create" test went with it
- [x] Gate check passes: Full (178 files, 1256 tests, passing; Build also green: unit 86 / 791, tooling + storybook 96 / 649)

**Tests**: integration
**Gate**: full
**Commit**: `feat(transactions): drop toolbar shortcuts now in the navigation`

---

### T19: Plans page without Back

**What**: Drop `onBack` and the Back button.
**Where**: `frontend/src/features/plans/PlansPageView.tsx` (and `PlansPage.tsx`, story)
**Depends on**: T18
**Reuses**: -
**Requirement**: NAV-03 (AC 4)

**Tools**: MCP: NONE · Skill: `component-creation`

**Done when**:

- [x] Story `play`: no "Back" button (in `Owner`; the page's own top padding became `px-4`, since the layout now gives the vertical spacing under the tab row)
- [x] Gate check passes: Full (178 files, 1256 tests, passing)

**Tests**: story
**Gate**: full
**Commit**: `feat(plans): drop the back button`

---

### T20: Plan switcher without "Manage plans"

**What**: Drop `onManagePlans` and the "Manage plans" item; "Create plan" stays.
**Where**: `frontend/src/features/plans/components/PlanSwitcherView.tsx` (and `PlanSwitcher.tsx`, story)
**Depends on**: T19
**Reuses**: -
**Requirement**: NAV-03 (AC 5)

**Tools**: MCP: NONE · Skill: `component-creation`

**Done when**:

- [x] Story `play` opens the menu: "Create plan" present, "Manage plans" absent (in `Selected`; the create item's label is "New plan")
- [x] Gate check passes: Full (178 files, 1256 tests, passing)

**Tests**: story
**Gate**: full
**Commit**: `feat(plans): drop manage plans from the switcher`

---

### T21: Skills and structure docs

**What**: `/feature-structure`: one route per destination, screens are `XxxPage`, filters through `PlanFiltersGate`; `/api-integration`: a success toast is a short past-tense sentence, no "successfully"; `STRUCTURE.md`: `app/home` gone, routes listed.
**Where**: `.claude/skills/feature-structure/SKILL.md`
**Depends on**: T20
**Reuses**: design Tech Decisions
**Requirement**: NAV-05, NAV-06

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [ ] Each rule above present in its file (`/api-integration` and `.specs/codebase/STRUCTURE.md` included)
- [ ] No mention of `app/home`, `HomeTabs` or `?tab=` remains in skills, `CLAUDE.md`, `AGENTS.md` or `.specs/codebase/`
- [ ] Gate check passes: Build

**Tests**: none
**Gate**: build
**Commit**: `docs(skills): routes per screen and short success messages`

---

## Phase Execution Map

```
Phase 1 → Phase 2 → Phase 3 → Phase 4

Phase 1:  T1 → T2 → T3 → T4 → T5 → T6
Phase 2:  T7 → T8 → T9 → T10 → T11 → T12 → T13
Phase 3:  T14 → T15 → T16 → T17
Phase 4:  T18 → T19 → T20 → T21
```

Batches (~7 tasks, whole phases): worker 1 = Phase 1 (6), worker 2 = Phase 2 (7), worker 3 = Phases 3–4 (8).

---

## Pre-approval Checks

`validate_tasks.py`: 0 errors, 9 warnings, all accepted:

- **Multiple files in `Where`** (T9, T14, T15, T19, T20): a component with its co-located story or test (required by the matrix), a move with its test, or a container/view pair changed for one prop. One deliverable each.
- **`Tests: none`** (T10–T12 pure renames, T21 docs): the matrix says none for these layers; renames run the Build gate, which runs every moved test and story.

**Diagram ↔ `Depends on`:** every task depends on the one before it in its phase (T1, T7, T14, T18 start their phases with no dependency); the diagrams draw exactly those arrows. No dependency points to a later phase. ✅

| Task | Layer | Matrix requires | Task says | Status |
| ---- | ----- | --------------- | --------- | ------ |
| T1–T6 | Service hooks | unit through MSW | unit (service through MSW) | ✅ |
| T7, T8 | Logic module | unit | unit | ✅ |
| T9 | Flow (gate) | integration | integration | ✅ |
| T10–T12 | Pure renames | none | none | ✅ |
| T13 | Flow (routing) | integration | integration | ✅ |
| T14–T16 | Presentational | story | story | ✅ |
| T17 | Flow (layout) | integration | integration | ✅ |
| T18 | Flow (toolbar) | integration (+ story updated) | integration | ✅ |
| T19, T20 | Presentational | story | story | ✅ |
| T21 | Docs | none | none | ✅ |
