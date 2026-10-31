# Period Navigator Validation

**Date**: 2026-10-31
**Spec**: `.specs/features/period-navigator/spec.md`
**Diff range**: `7b99054..07710b5` (branch `period-navigator`, 6 commits, frontend only)
**Verifier**: independent sub-agent (author ≠ verifier)
**Verdict**: FAIL

---

## Task Completion

| Task | Status | Notes |
| ---- | ------ | ----- |
| T1 Period vocabulary in `utils/period.ts` | ✅ Done | `48c81d3` |
| T2 Period URL codec | ✅ Done | `8d0e699` |
| T3 Shared `PeriodNavigator`, clickable label | ⚠️ Done, defect | `df0839a`; first click on a preset full range closes the calendar (gap 1) |
| T4 Period in the Transactions URL | ⚠️ Done, weak test | `ce0cb66`; key-list mutant survives (gap 2) |
| T5 Date leaves the filters popover | ✅ Done | `465ce82` |
| T6 Navigator on Transactions | ✅ Done | `07710b5` |

---

## Spec-Anchored Acceptance Criteria

Paths are relative to `frontend/src/`.

### PNAV-01: Step through months on Transactions

| Criterion | Spec-defined outcome | `file:line` + assertion | Result |
| --------- | -------------------- | ----------------------- | ------ |
| AC1 opens with no period | Label "October 2026"; request carries `startDateFrom=2026-10-01`, `startDateTo=2026-10-31` | `features/transactions/TransactionsPage.test.tsx:625-630` - `label("October 2026")` + `expect(listQueries(requests)).toEqual([{ ...OCTOBER, page: "0", size: "10" }])` | ✅ PASS |
| AC2 Previous across a year | January 2026 → "December 2025", Dec dates requested | `TransactionsPage.test.tsx:633-647` - `label("December 2025")` + `toEqual({ startDateFrom: "2025-12-01", startDateTo: "2025-12-31", ... })` | ✅ PASS |
| AC3 Next | Next month's label and dates | `TransactionsPage.test.tsx:649-658` - `label("January 2026")` + `toEqual({ startDateFrom: "2026-01-01", startDateTo: "2026-01-31", ... })` | ✅ PASS |
| AC4 Range menu option | The Overview's resolution of the preset, and its label | `TransactionsPage.test.tsx:678-693` - Last 6 months → `label("May – Oct 2026")` + `toEqual({ startDateFrom: "2026-05-01", startDateTo: "2026-10-31", ... })`; all four presets: `utils/period.test.ts:69-76` - `expect(resolvePeriodDates(period, now)).toEqual({ startDate, endDate })` | ✅ PASS |
| AC5 Arrow on multi-month | Aug–Oct 2026 → May–Jul 2026 | `TransactionsPage.test.tsx:661-675` - `label("May – Jul 2026")` + `toEqual({ startDateFrom: "2026-05-01", startDateTo: "2026-07-31", ... })`; `utils/period.test.ts:36-40` | ✅ PASS |
| AC6 First page on change | `page: "0"` after a change from page 1 | `TransactionsPage.test.tsx:696-714` - `toEqual({ ..., page: "0", ... })` after `page` was `"1"` | ✅ PASS |
| AC7 Range menu exactly 5 options | This month · Last 3 months · Last 6 months · This year · Custom… | `components/periodNavigator/PeriodNavigator.stories.tsx:56-62` (RangeMenu `play`) - `toEqual(["This month","Last 3 months","Last 6 months","This year"])` + `getByRole("menuitem", { name: "Custom…" })` visible | ✅ PASS |
| AC8 Own row above search, left-aligned, every width | Layout | `features/transactions/TransactionsPageView.stories.tsx:91-92` - only `getByRole("button", { name: "Choose period, October 2026" })).toBeVisible()`; row position / alignment not asserted (`TransactionsPageView.tsx:77` `self-start` row before the search row) | ⚠️ Spec-precision gap (layout is visual; story asserts presence only) |
| AC9 Other filters, search, sort, page size kept | type, search, sort, size unchanged | `TransactionsPage.test.tsx:696-714` - `toEqual({ ..., size: "25", type: "DEBIT", sortBy: "amount", sortDirection: "asc" })`; **search (`description`) is not in that case** | ⚠️ Partial (search not asserted; gap 4) |

### PNAV-02: The navigator replaces the date filter

| Criterion | Spec-defined outcome | `file:line` + assertion | Result |
| --------- | -------------------- | ----------------------- | ------ |
| AC1 No date field in popover | Popover renders no Date field | `features/transactions/utils/transactionFilterDraft.test.ts:97-106` - `expect(draft).not.toHaveProperty("dateRange")` + `fromDraft(draft).filter).toEqual({})`; no story asserts the field's absence (`TransactionFilterPopoverView.stories.tsx` has no Date query) | ⚠️ Indirect (draft only; gap 5) |
| AC2 No period chip | Chips exclude the period | `TransactionsPage.test.tsx:454-475` - `expect(chipLabels()).toEqual(["Debit","Groceries","Livia","R$ 50,00 – R$ 200,00"])` while every request carries `...OCTOBER` | ✅ PASS |
| AC3 Count ignores period | Dates count 0 | `features/transactions/utils/activeFilterCount.test.ts:17-19` - `countActiveFilters({ startDateFrom, startDateTo })).toBe(0)` | ✅ PASS |
| AC4 Clear keeps period | After Clear all, label and request stay on September | `TransactionsPage.test.tsx:717-733` - `label("September 2026")` + `toEqual({ startDateFrom: "2026-09-01", startDateTo: "2026-09-30", page: "0", size: "10" })` | ✅ PASS |

### PNAV-03: Last period viewed is restored

| Criterion | Spec-defined outcome | `file:line` + assertion | Result |
| --------- | -------------------- | ----------------------- | ------ |
| AC1 Arrow-reached month restored | Return without params shows the same month | No test saves or restores a Transactions period. `transactionParams.test.ts:84-89` round-trips a preset through the codec only; `app/routing/PlanFiltersGate.test.tsx:133-150` restores `category`/`sort`, no period key. Mutant M4 (period keys dropped from `TRANSACTION_PARAM_KEYS`, the list the gate saves by) survives | ❌ GAP (gap 2) |
| AC2 Preset re-resolved later | Saved This month → the new current month | `utils/periodParams.test.ts:83-88` - `resolveSelection(DEFAULT_SELECTION, new Date(2026, 10, 3))).toEqual({ startDate: "2026-11-01", endDate: "2026-11-30" })`; `utils/period.test.ts:78-83` | ✅ PASS |
| AC3 Per (user, plan) | Stored under `filters:transactions:<user>:<plan>` | `PlanFiltersGate.test.tsx:225-242` - per-plan keys `filters:transactions:1:4` / `:1:5` (generic for every Transactions key; period keys inherit via `TRANSACTION_PARAM_KEYS`, not exercised) | ⚠️ Indirect |

### PNAV-04: Label opens the range calendar

| Criterion | Spec-defined outcome | `file:line` + assertion | Result |
| --------- | -------------------- | ----------------------- | ------ |
| AC1 Label opens Custom…'s calendar, preset to the range | Dialog "Choose a period" with the current range selected | `PeriodNavigator.stories.tsx:77-82` (LabelOpensCalendar) - `findByRole("dialog", { name: "Choose a period" })` visible; preset implied by the next assertion (`from: "2026-10-05"` kept). Shared component, so it holds for Overview (`OverviewPageView.tsx:32`) and Transactions | ✅ PASS |
| AC2 Two different days → applied, closed | The picked range becomes the period; calendar closes | `PeriodNavigator.stories.tsx:83-85` - `onRangeChange` `toHaveBeenCalledWith({ from: "2026-10-05", to: "2026-10-20" })` + dialog `toBeNull()`. **But the story starts from a one-day range**; from any real default (a full month) the member cannot pick 5–20 Oct (see UX finding) | ❌ GAP in practice (gap 1) |
| AC3 Accessible name | Button named with the current label | `TransactionsPage.test.tsx:621-623` - `findByRole("button", { name: "Choose period, ${name}" })` used in every navigator case; `PeriodNavigator.stories.tsx:80` | ✅ PASS (name "Choose period, …" accepted as "announces it opens the period picker") |
| AC4 Custom… kept | Menu item present | `PeriodNavigator.stories.tsx:62` - `getByRole("menuitem", { name: "Custom…" })).toBeVisible()`; `:69-73` opens the dialog | ✅ PASS |

### PNAV-05: Edge cases

| Edge case | Spec-defined outcome | `file:line` + assertion | Result |
| --------- | -------------------- | ----------------------- | ------ |
| Custom range missing an end | This month | `utils/periodParams.test.ts:60-62` - `toEqual(DEFAULT_SELECTION)`; `transactionParams.test.ts:91-98` | ✅ PASS |
| Unparsable date | This month | `utils/periodParams.test.ts:54-58` | ✅ PASS |
| Start after end | This month | `utils/periodParams.test.ts:48-52`; `transactionParams.test.ts:91-98` - `expect(reversed).toEqual(DEFAULT_TRANSACTIONS)` | ✅ PASS |
| Pre-feature `from`/`to` | Ignored, This month | `transactionParams.test.ts:100-104` - `toEqual(DEFAULT_TRANSACTIONS)` + `serialize(...)).toEqual({})`; flow `TransactionsPage.test.tsx:736-740` - `[{ ...OCTOBER, page: "0", size: "10" }]` | ✅ PASS |
| No period at all | This month | `utils/periodParams.test.ts:40-42`; `transactionParams.test.ts:77-82` | ✅ PASS |
| Empty month | "No transactions found." with the navigator usable | `TransactionsPageView.stories.tsx:112-117` - empty-state text visible (navigator rendered by the same view; not asserted in that story) | ✅ PASS (empty state); navigator presence covered by `:91` |
| Day range label | "5 – 20 Oct 2026" | `utils/period.test.ts:24-27` - `periodLabel(range("2026-10-05","2026-10-20"))).toBe("5 – 20 Oct 2026")` | ✅ PASS |

**Status**: ❌ Gaps present (PNAV-03 AC1 untested, PNAV-04 AC2 fails in practice) + ⚠️ 1 spec-precision gap (PNAV-01 AC8) and 3 indirect/partial (PNAV-01 AC9, PNAV-02 AC1, PNAV-03 AC3).

---

## UX finding: calendar preset to a full range (author's concern)

**Mechanism.** `PeriodNavigator.tsx:68-71` presets the draft to the current range (`{ from: range.startDate, to: range.endDate }`), as PNAV-04 AC1 asks. react-day-picker 9.14 `addToRange` on a *complete* range: a click after `from` gives `{ from, to: click }`; before `from` gives `{ click, to }`. Both are complete and different-day, so `handleSelect` (`PeriodNavigator.tsx:74-82`) applies and closes on the **first** click.

**Empirical evidence.** A scratch story (worktree only, discarded) with `range` 2026-10-01..2026-10-31: click the label, click "October 5th, 2026" → `onRangeChange` was called with `{ from: "2026-10-01", to: "2026-10-05" }` and the dialog closed (passed in the storybook project). Reaching 5–20 Oct from "October 2026" takes three openings and four clicks (31 → 20 → reopen, 20 → 5).

**Judgement.** This violates PNAV-04 AC2 in practice and makes the spec's own Independent Test ("tap 'October 2026', pick 5–20 Oct") impossible from the default state, which is a month-aligned range on both screens. The committed story avoids it by starting from a one-day range (`PeriodNavigator.stories.tsx:78`). The behaviour pre-dates this feature on Custom…, but the feature is what makes the label the primary path and adds AC2. Ranked as gap 1 (Major).

**Fix direction.** react-day-picker's `resetOnSelect` prop (in 9.14, `useRange.js`): with a full range selected, a click starts a new range `{ from: click, to: undefined }`. The preset stays visible (AC1 holds) and the next click completes the range (AC2 holds). One prop, reversible.

---

## Discrimination Sensor

Scratch: temporary `git worktree` at HEAD under the session scratchpad, real `frontend/node_modules` symlinked (no install), removed afterwards. Mutations limited to `scripts/testTable.ts` rows with a test kind (`utils/*.ts`, `*Params.ts`), per CLAUDE.md. That rule excludes `useTransactionFilters.ts` (clear exclusion) and `TransactionsPage.tsx`/`useTransactionPeriod.ts` (period → `startDateFrom/To`): they match no row. Both behaviours are still exercised indirectly: M3 and M5 break the query dates and clear-keeps-period flow cases. Tests run: `pnpm exec vitest run --project=unit` over `periodParams.test.ts`, `period.test.ts`, `transactionParams.test.ts`, `TransactionsPage.test.tsx`, `PlanFiltersGate.test.tsx`, `overviewParams.test.ts` (114 tests, green before mutation).

| Mutation | File:line | Description | Killed? |
| -------- | --------- | ----------- | ------- |
| M1 | `utils/periodParams.ts:21` | `from && to && from <= to` → `from && to` (accept a reversed custom range) | ✅ Killed (2: `periodParams.test.ts:48`, `transactionParams.test.ts:91`) |
| M2 | `utils/period.ts:60` | `shiftRange` step `countMonths(...) * direction` → `direction` (always one month) | ✅ Killed (4, incl. flow PNAV-01 AC5) |
| M3 | `utils/periodParams.ts:37` | `resolveSelection` ignores the custom range (`customRange ?` → `false ?`) | ✅ Killed (5, incl. flow AC2/3/5/6/9 and PNAV-02 AC4) |
| M4 | `features/transactions/filters/transactionParams.ts:31` | `...PERIOD_PARAM_KEYS` removed from `TRANSACTION_PARAM_KEYS` (gate stops saving/restoring the period, update stops clearing stale period keys) | ❌ Survived → fix task (gap 2) |
| M5 | `features/transactions/filters/transactionParams.ts:90` | parse reads the period from an empty `URLSearchParams` (URL period ignored) | ✅ Killed (8+) |

**Sensor depth**: lightweight (5 mutations)
**Result**: 4/5 killed - FAIL ❌
**Isolation**: `git status --porcelain` empty before and after; `git worktree list` shows only the real tree; `frontend/node_modules` intact.

---

## Code Quality

| Principle | Status |
| --------- | ------ |
| Minimum code | ✅ |
| Surgical changes | ✅ (moves keep assertions; date cases rewritten, not deleted) |
| No scope creep | ✅ (`useTransactionPeriod.ts` extraction keeps `TransactionsPage` under the 60-line rule) |
| Matches patterns | ✅ (Overview's codec and handlers reused) |
| Spec-anchored outcome check | ⚠️ PNAV-04 AC2 story uses a non-default starting range that hides the defect |
| Per-layer Coverage Expectation | ⚠️ URL params: the key list that drives persistence is unasserted (M4) |
| Every test maps to a spec requirement | ✅ |
| Documented guidelines followed: `CLAUDE.md`, `scripts/testTable.ts` | ✅ |
| Cosmetic | `TransactionsPage.test.tsx:512-513` and `:551-552` spread `...OCTOBER` twice |

---

## Gate Check

- **Gate command**: `pnpm lint && pnpm build && pnpm test` (from `frontend/`, real tree, read-only)
- **Result**: exit 0. unit+tooling+storybook: 906 passed, 0 failed; 136 files passed, 29 skipped files (story files whose stories are all `!test`, pre-existing pattern). critical: 174 passed, branches 96.03%.
- **Test count before feature** (`7b99054`, same projects, scratch): 883
- **Test count after feature**: 906
- **Delta**: +23
- **Failures**: none

---

## Fix Plans

### Fix 1: A preset full range swallows the first click (Major)

- **Root cause**: `PeriodNavigator.tsx` passes a complete preset range to `Calendar mode="range"`; `addToRange` turns the first click into a complete range, and `handleSelect` applies and closes it.
- **Fix task**: add `resetOnSelect` to the range `Calendar` in `components/periodNavigator/PeriodNavigator.tsx`. Story `play`: from `range` 2026-10-01..2026-10-31, click the label, click Oct 5 → dialog still open and `onRangeChange` not called; click Oct 20 → called with `{ from: "2026-10-05", to: "2026-10-20" }` and the dialog closes. Keep or replace the one-day `LabelOpensCalendar` story.
- **Done when**: the spec's PNAV-04 Independent Test passes from "October 2026" on both screens.

### Fix 2: Period persistence is untested (Major)

- **Root cause**: no test exercises `TRANSACTION_PARAM_KEYS` containing the period keys; M4 survives.
- **Fix task**: (a) `PlanFiltersGate.test.tsx`: saved `filters:transactions:1:5` = `plan=5&period=custom&periodFrom=2026-08-01&periodTo=2026-08-31`, `renderAt("/transactions")` → params restored with the three period keys (PNAV-03 AC1); and `/transactions?period=last-3m` counts as a screen param and is saved. (b) `TransactionsPage.test.tsx`: from `?period=custom&periodFrom=2026-09-01&periodTo=2026-09-30`, pick Range → This month → label "October 2026" and the last request carries `...OCTOBER` (stale period keys removed).
- **Done when**: M4 is killed.

### Fix 3 (Minor): PNAV-01 AC9 search

- Add `q=rent` to the route of `TransactionsPage.test.tsx:696` and `description: "rent"` to the expected request.

### Fix 4 (Minor): PNAV-02 AC1 popover

- `TransactionFilterPopoverView.stories.tsx` `OpenSharedPlan` play: `expect(canvas/screen.queryByLabelText("Date")).toBeNull()`.

### Fix 5 (Cosmetic)

- Drop the duplicated `...OCTOBER` at `TransactionsPage.test.tsx:513` and `:552`.

---

## Requirement Traceability Update

| Requirement | Previous Status | New Status |
| ----------- | --------------- | ---------- |
| PNAV-01 | Pending | ✅ Verified (minor: AC9 search, AC8 layout unasserted) |
| PNAV-02 | Pending | ✅ Verified (minor: AC1 indirect) |
| PNAV-03 | Pending | ❌ Needs Fix (AC1 untested, M4 survived) |
| PNAV-04 | Pending | ❌ Needs Fix (AC2 fails from a month-aligned range) |
| PNAV-05 | Pending | ✅ Verified |

---

## Summary

**Overall**: ❌ Not Ready

**Spec-anchored check**: 21/27 criteria matched spec outcome; 2 gaps (PNAV-03 AC1, PNAV-04 AC2), 1 spec-precision gap (PNAV-01 AC8), 3 indirect/partial (PNAV-01 AC9, PNAV-02 AC1, PNAV-03 AC3)
**Sensor**: 4/5 mutations killed
**Gate**: 906 + 174 passed, 0 failed

**What works**: current-month default and its request, arrows (incl. year boundary and multi-month), presets, first-page reset, clear keeps period, no chip / no count, invalid-range and legacy-param fallbacks, labels.

**Issues found**: calendar first click from a full range (Fix 1); period persistence untested (Fix 2); minor assertions (Fixes 3–5).

**Next steps**: route Fixes 1–2 (and 3–5) to an implementer, then re-verify (iteration 1 of 3).
