# Period Navigator Tasks

## Execution Protocol (MANDATORY -- do not skip)

Implement these tasks with the `tlc-spec-driven` skill: **activate it by name and follow its Execute flow and Critical Rules.** Do not search for skill files by filesystem path. The skill is the source of truth for the full flow (per-task cycle, sub-agent delegation, adequacy review, Verifier, discrimination sensor).

**If the skill cannot be activated, STOP and tell the user - do not proceed without it.**

---

**Design**: `.specs/features/period-navigator/design.md`
**Status**: Approved

---

## Test Coverage Matrix

> Generated from codebase, project guidelines, and spec - confirm before Execute. Guidelines found: `CLAUDE.md` (Frontend), `.claude/skills/frontend-testing/SKILL.md`, `frontend/scripts/testTable.ts`, `frontend/package.json`, AD-015.

| Code Layer | Required Test Type | Coverage Expectation | Location Pattern | Run Command |
| ---------- | ------------------ | -------------------- | ---------------- | ----------- |
| Pure computation (`utils/*.ts`) | unit | Every AC and edge case it serves; moved cases keep their assertions | sibling `*.test.ts` | Quick |
| URL params (`*Params.ts`) | unit | Round-trip, defaults, every invalid-range edge case | sibling `*.test.ts` | Quick |
| Container (`TransactionsPage`) | flow (`renderWithProviders`, MSW only, no `vi.mock` of our modules) | The decisions this feature adds: current-month request, arrow request, clear keeps period, no date chip | sibling `*.test.tsx` | Quick |
| Presentational (`PeriodNavigator`, page views) | story (a11y in error mode) | `play` for the label opening the calendar | sibling `*.stories.tsx` | Full |
| Feature hooks, moves | none | Build gate | - | Build |

## Gate Check Commands

> Run from `frontend/`. Per task: only the affected test files. Full gate once at each phase end.

| Gate Level | When to Use | Command |
| ---------- | ----------- | ------- |
| Quick | Tasks with unit or flow tests | `pnpm exec vitest run --project=unit <affected test files>` |
| Full | Tasks with stories | `pnpm exec vitest run --project=unit --project=storybook <affected files>` |
| Build | Last task of each phase | `pnpm lint && pnpm build && pnpm test` |

---

## Execution Plan

### Phase 1: Shared period

```
T1 → T2 → T3
```

### Phase 2: Transactions

```
T4 → T5 → T6
```

---

## Task Breakdown

### T1: Period vocabulary in `utils/period.ts`

**What**: Move `Period`, `PERIODS`, `DEFAULT_PERIOD`, `resolvePeriodDates`, `PeriodRange`, `periodLabel`, `shiftRange` and `countMonths` into `frontend/src/utils/period.ts`; delete `features/overview/utils/periodNavigator.ts` and `periodMonths.ts`; repoint every import (`overviewParams.ts`, `trendMonths.ts`, `useOverviewTrend.ts`, `PeriodNavigator.tsx`, `OverviewPage.tsx`, tests). Drop `presetRange` (callers use `resolvePeriodDates`).
**Where**: `frontend/src/utils/period.ts`
**Depends on**: None
**Reuses**: the existing modules and their tests, moved into `utils/period.test.ts`
**Requirement**: PNAV-01

**Done when**:

- [x] `utils/period.test.ts` holds every moved case of `periodNavigator.test.ts`, `periodMonths.test.ts` and the `resolvePeriodDates` cases, assertions unchanged
- [x] No import of the deleted modules remains
- [x] Gate check passes: Quick

**Tests**: unit
**Gate**: quick

**Commit**: `refactor(frontend): lift the period vocabulary to utils`

---

### T2: Period URL codec in `utils/periodParams.ts`

**What**: `PeriodSelection`, `PERIOD_PARAM_KEYS`, `parsePeriodParams`, `serializePeriodParams`, `resolveSelection` (design). `overviewParams.ts` composes them for its period part and keeps only `overviewMember` of its own; its period cases move to `periodParams.test.ts`.
**Where**: `frontend/src/utils/periodParams.ts`
**Depends on**: T1
**Reuses**: today's Overview parse/serialize rules, `parseDate`
**Requirement**: PNAV-01, PNAV-05

**Done when**:

- [ ] Unit: round-trip of each preset and of a custom range; default preset serializes to nothing; missing params → This month; `period=custom` missing either end, with an unparsable date or with start after end → This month; unknown token → This month; `resolveSelection` returns the custom range as is and resolves a preset against `now`
- [ ] `overviewParams.test.ts` keeps its member cases; the Overview URL format is unchanged (existing gate test still passes)
- [ ] Gate check passes: Quick

**Tests**: unit
**Gate**: quick

**Commit**: `refactor(frontend): one URL codec for a screen's period`

---

### T3: Shared `PeriodNavigator` with a clickable label

**What**: Move `PeriodNavigator` (and its story) to `frontend/src/components/periodNavigator/`; the label becomes a ghost `Button` that opens the same range calendar as Custom… with accessible name `Choose period, <label>`; Custom… stays. Overview imports the moved component.
**Where**: `frontend/src/components/periodNavigator/PeriodNavigator.tsx`
**Depends on**: T2
**Reuses**: existing component and story
**Requirement**: PNAV-04

**Done when**:

- [ ] Story `play`: clicking the label opens the dialog "Choose a period"; picking two different days calls `onRangeChange` with them and closes it
- [ ] Range menu still lists This month, Last 3 months, Last 6 months, This year, Custom…
- [ ] Gate check passes: Build (phase end)

**Tests**: story
**Gate**: build

**Commit**: `feat(frontend): period label opens the range calendar`

---

### T4: Period in the Transactions URL

**What**: `TransactionFilters` gains `period: PeriodSelection` via the T2 codec; `TRANSACTION_PARAM_KEYS` adds `PERIOD_PARAM_KEYS` and drops `from`/`to`; `startDateFrom`/`startDateTo` are no longer read from or written to the URL; `useTransactionFilters` excludes the period keys from the clearable ones.
**Where**: `frontend/src/features/transactions/filters/transactionParams.ts`
**Depends on**: None (phase 1 complete)
**Reuses**: `parsePeriodParams`, `serializePeriodParams`, `PERIOD_PARAM_KEYS`
**Requirement**: PNAV-01, PNAV-02, PNAV-03, PNAV-05

**Done when**:

- [ ] Unit: no params → `period` This month and no `startDateFrom`/`startDateTo` in `filter`; a custom period round-trips; old `from`/`to` params are ignored; date cases of `transactionParams.test.ts` rewritten for the amended outcome, not deleted
- [ ] Gate check passes: Quick

**Tests**: unit
**Gate**: quick

**Commit**: `feat(frontend): transactions keep their period in the URL`

---

### T5: Date leaves the filters popover

**What**: Remove the date range from `transactionFilterDraft.ts` (draft field, `toDraft`/`fromDraft`), the Date field from `TransactionFilterPopoverView.tsx`, the date chip from `useTransactionFilterChips.ts` and the date count from `activeFilterCount.ts`. One mechanical change across four files.
**Where**: `frontend/src/features/transactions/utils/transactionFilterDraft.ts`
**Depends on**: T4
**Reuses**: -
**Requirement**: PNAV-02

**Done when**:

- [ ] Unit: `activeFilterCount` and `transactionFilterDraft` date cases removed with the behaviour they covered and replaced by one case each asserting the period is not counted / not drafted
- [ ] The popover story no longer shows a Date field
- [ ] Gate check passes: Quick

**Tests**: unit
**Gate**: quick

**Commit**: `feat(frontend): the period is no longer a transactions filter`

---

### T6: Navigator on the Transactions screen

**What**: `TransactionsPage` resolves the selection (`resolveSelection`, memoized), sends it as `startDateFrom`/`startDateTo` on the list query, and passes `navigator` props; `TransactionsPageView` renders the `PeriodNavigator` on its own row above the search row on every width.
**Where**: `frontend/src/features/transactions/TransactionsPage.tsx`
**Depends on**: T5
**Reuses**: `OverviewPage`'s preset/range handlers pattern
**Requirement**: PNAV-01, PNAV-02, PNAV-03

**Done when**:

- [ ] Flow (`TransactionsPage.test.tsx`, fixed date): first load requests the current month and shows its label; "Previous period" requests the previous month across a year boundary; Clear all after a category filter keeps the period; no date chip; existing popover-date cases rewritten against the navigator
- [ ] `TransactionsPageView` story shows the navigator row
- [ ] Gate check passes: Build (phase end)

**Tests**: flow, story
**Gate**: build

**Commit**: `feat(frontend): month navigator on transactions`

---

## Phase Execution Map

```
Phase 1 → Phase 2

Phase 1:  T1 ------→ T2 ------→ T3
Phase 2:  T4 ------→ T5 ------→ T6
```

Execution is strictly sequential. 6 tasks → one worker.

## Pre-Approval Validation

### Diagram-Definition Cross-Check

| Task | Depends on | Diagram | Status |
| ---- | ---------- | ------- | ------ |
| T1 | None | start of Phase 1 | ✅ |
| T2 | T1 | T1 → T2 | ✅ |
| T3 | T2 | T2 → T3 | ✅ |
| T4 | None (phase order) | start of Phase 2 | ✅ |
| T5 | T4 | T4 → T5 | ✅ |
| T6 | T5 | T5 → T6 | ✅ |

### Test Co-location Validation

| Task | Layer | Matrix requires | Tests field | Status |
| ---- | ----- | --------------- | ----------- | ------ |
| T1 | utils | unit | unit | ✅ |
| T2 | utils params | unit | unit | ✅ |
| T3 | presentational | story | story | ✅ |
| T4 | URL params | unit | unit | ✅ |
| T5 | utils + view | unit | unit | ✅ |
| T6 | container + view | flow, story | flow, story | ✅ |
