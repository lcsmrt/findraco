# Period Navigator Validation

**Date**: 2026-10-31
**Spec**: `.specs/features/period-navigator/spec.md`
**Diff range**: `7b99054..2ef22d4` (branch `period-navigator`, frontend only); fix round 1 commits `198ccb5`, `4b11844`, `2ef22d4`
**Verifier**: independent sub-agent (author ≠ verifier)
**Iteration**: 2 of 3 (re-verification after Fix Round 1; iteration 1 verdict was FAIL)
**Verdict**: PASS

---

## Closed Gaps (from iteration 1)

| # | Previous gap | Fix | Evidence | Status |
| - | ------------ | --- | -------- | ------ |
| 1 | A full preset range swallowed the first calendar click (PNAV-04 AC2) | F1 `198ccb5` | `frontend/src/components/periodNavigator/PeriodNavigator.tsx:154` `resetOnSelect`; story `PeriodNavigator.stories.tsx:77-87` starts from the meta range 2026-10-01..2026-10-31 (`:9`): Oct 5 → `expect(args.onRangeChange).not.toHaveBeenCalled()` + dialog visible; Oct 20 → `toHaveBeenCalledWith({ from: "2026-10-05", to: "2026-10-20" })` + dialog `toBeNull()`. Mutant M6 killed | ✅ Closed |
| 2 | Period persistence untested; M4 survived (PNAV-03 AC1, AC3) | F2 `4b11844` | `frontend/src/app/routing/PlanFiltersGate.test.tsx:152-166` (saved custom period restored on `/transactions`), `:218-224` (period-only link saved as `period=last-3m&plan=5`); `frontend/src/features/transactions/TransactionsPage.test.tsx:716-729` (custom → This month requests October). M4 now killed | ✅ Closed |
| 3 | Search not asserted on period change (PNAV-01 AC9) | F2 `4b11844` | `TransactionsPage.test.tsx:695` route `?q=rent&…`, `:708` `description: "rent"` in the expected request | ✅ Closed |
| 4 | Popover has no Date field asserted only via the draft (PNAV-02 AC1) | F3 `2ef22d4` | `frontend/src/features/transactions/components/TransactionFilterPopoverView.stories.tsx:60-61` - `queryByLabelText("Date")` and `queryByText("Date")` `toBeNull()` with the popover open | ✅ Closed |
| 5 | Duplicated `...OCTOBER` spreads (cosmetic) | F2 `4b11844` | removed at former `TransactionsPage.test.tsx:513`, `:552` | ✅ Closed |

Note: `PlanFiltersGate.test.tsx:152-166` alone does not depend on the key list (the gate restores the saved string whole), so it passed under M4; the key list is held by `:218-224` and the flow at `TransactionsPage.test.tsx:716-729`, which both fail under M4.

---

## Task Completion

| Task | Status | Notes |
| ---- | ------ | ----- |
| T1 Period vocabulary in `utils/period.ts` | ✅ Done | `48c81d3` |
| T2 Period URL codec | ✅ Done | `8d0e699` |
| T3 Shared `PeriodNavigator`, clickable label | ✅ Done | `df0839a` + F1 `198ccb5` |
| T4 Period in the Transactions URL | ✅ Done | `ce0cb66` + F2 `4b11844` |
| T5 Date leaves the filters popover | ✅ Done | `465ce82` + F3 `2ef22d4` |
| T6 Navigator on Transactions | ✅ Done | `07710b5` |
| F1–F3 Fix Round 1 | ✅ Done | all Done-when boxes checked in `tasks.md` |

---

## Spec-Anchored Acceptance Criteria

Paths are relative to `frontend/src/`.

### PNAV-01: Step through months on Transactions

| Criterion | Spec-defined outcome | `file:line` + assertion | Result |
| --------- | -------------------- | ----------------------- | ------ |
| AC1 opens with no period | Label "October 2026"; request carries `startDateFrom=2026-10-01`, `startDateTo=2026-10-31` | `features/transactions/TransactionsPage.test.tsx:623-630` - `label("October 2026")` + `expect(listQueries(requests)).toEqual([{ ...OCTOBER, page: "0", size: "10" }])` | ✅ PASS |
| AC2 Previous across a year | January 2026 → "December 2025", Dec dates requested | `TransactionsPage.test.tsx:631-647` - `label("December 2025")` + `toEqual({ startDateFrom: "2025-12-01", startDateTo: "2025-12-31", ... })` | ✅ PASS |
| AC3 Next | Next month's label and dates | `TransactionsPage.test.tsx:648-657` - `label("January 2026")` + `toEqual({ startDateFrom: "2026-01-01", startDateTo: "2026-01-31", ... })` | ✅ PASS |
| AC4 Range menu option | The Overview's resolution of the preset, and its label | `TransactionsPage.test.tsx:676-691` - Last 6 months → `label("May – Oct 2026")` + `toEqual({ startDateFrom: "2026-05-01", startDateTo: "2026-10-31", ... })`; all four presets: `utils/period.test.ts:69-76` - `expect(resolvePeriodDates(period, now)).toEqual({ startDate, endDate })` | ✅ PASS |
| AC5 Arrow on multi-month | Aug–Oct 2026 → May–Jul 2026 | `TransactionsPage.test.tsx:659-674` - `label("May – Jul 2026")` + `toEqual({ startDateFrom: "2026-05-01", startDateTo: "2026-07-31", ... })`; `utils/period.test.ts:36-40` | ✅ PASS |
| AC6 First page on change | `page: "0"` after a change from page 1 | `TransactionsPage.test.tsx:694-714` - `toEqual({ ..., page: "0", ... })` after `page` was `"1"` | ✅ PASS |
| AC7 Range menu exactly 5 options | This month · Last 3 months · Last 6 months · This year · Custom… | `components/periodNavigator/PeriodNavigator.stories.tsx:56-62` (RangeMenu `play`) - `toEqual(["This month","Last 3 months","Last 6 months","This year"])` + `getByRole("menuitem", { name: "Custom…" })` visible | ✅ PASS |
| AC8 Own row above search, left-aligned, every width | Layout | `features/transactions/TransactionsPageView.stories.tsx:91-92` - only `getByRole("button", { name: "Choose period, October 2026" })).toBeVisible()`; row position / alignment not asserted (`TransactionsPageView.tsx:77` `self-start` row before the search row) | ⚠️ Spec-precision gap (layout is visual; story asserts presence only) |
| AC9 Other filters, search, sort, page size kept | type, search, sort, size unchanged | `TransactionsPage.test.tsx:694-714` - route `?q=rent&type=DEBIT&sort=amount.asc&size=25`, after ‹ `toEqual({ startDateFrom: "2026-09-01", startDateTo: "2026-09-30", page: "0", size: "25", description: "rent", type: "DEBIT", sortBy: "amount", sortDirection: "asc" })` | ✅ PASS (closed, F2) |

### PNAV-02: The navigator replaces the date filter

| Criterion | Spec-defined outcome | `file:line` + assertion | Result |
| --------- | -------------------- | ----------------------- | ------ |
| AC1 No date field in popover | Popover renders no Date field | `features/transactions/components/TransactionFilterPopoverView.stories.tsx:60-61` (OpenSharedPlan `play`, popover open) - `expect(screen.queryByLabelText("Date")).toBeNull()` + `expect(screen.queryByText("Date")).toBeNull()`; draft: `utils/transactionFilterDraft.test.ts:97-106` | ✅ PASS (closed, F3) |
| AC2 No period chip | Chips exclude the period | `TransactionsPage.test.tsx:454-475` - `expect(chipLabels()).toEqual(["Debit","Groceries","Livia","R$ 50,00 – R$ 200,00"])` while every request carries `...OCTOBER` | ✅ PASS |
| AC3 Count ignores period | Dates count 0 | `features/transactions/utils/activeFilterCount.test.ts:17-19` - `countActiveFilters({ startDateFrom, startDateTo })).toBe(0)` | ✅ PASS |
| AC4 Clear keeps period | After Clear all, label and request stay on September | `TransactionsPage.test.tsx:731-747` - `label("September 2026")` + `toEqual({ startDateFrom: "2026-09-01", startDateTo: "2026-09-30", page: "0", size: "10" })` | ✅ PASS |

### PNAV-03: Last period viewed is restored

| Criterion | Spec-defined outcome | `file:line` + assertion | Result |
| --------- | -------------------- | ----------------------- | ------ |
| AC1 Arrow-reached month restored | Return without params shows the same month (an arrow-reached month is a custom range) | `app/routing/PlanFiltersGate.test.tsx:152-166` - saved `plan=5&period=custom&periodFrom=2026-08-01&periodTo=2026-08-31`, `renderAt("/transactions")` → `expect(params()).toEqual({ plan: "5", period: "custom", periodFrom: "2026-08-01", periodTo: "2026-08-31" })`; key list: `:218-224` - `/transactions?period=last-3m` → `toEqual({ period: "last-3m", plan: "5" })` + `getItem("filters:transactions:1:5")).toBe("period=last-3m&plan=5")`; flow `TransactionsPage.test.tsx:716-729` - custom Sept → This month → `label("October 2026")` + `toEqual({ ...OCTOBER, page: "0", size: "10" })`. M4 now killed | ✅ PASS (closed, F2) |
| AC2 Preset re-resolved later | Saved This month → the new current month | `utils/periodParams.test.ts:83-88` - `resolveSelection(DEFAULT_SELECTION, new Date(2026, 10, 3))).toEqual({ startDate: "2026-11-01", endDate: "2026-11-30" })`; `utils/period.test.ts:78-83` | ✅ PASS |
| AC3 Per (user, plan) | Stored under `filters:transactions:<user>:<plan>` | `PlanFiltersGate.test.tsx:224` - period saved under `filters:transactions:1:5`; per-plan separation `:253` (`filters:transactions:1:4`) and `:302-305` | ✅ PASS (period key now exercised under the per-(user, plan) key) |

### PNAV-04: Label opens the range calendar

| Criterion | Spec-defined outcome | `file:line` + assertion | Result |
| --------- | -------------------- | ----------------------- | ------ |
| AC1 Label opens Custom…'s calendar, preset to the range | Dialog "Choose a period" opened from the label of the current range | `components/periodNavigator/PeriodNavigator.stories.tsx:77-81` (LabelOpensCalendar, meta range 2026-10-01..2026-10-31 at `:9`) - click `"Choose period, October 2026"` → `findByRole("dialog", { name: "Choose a period" })` `toBeVisible()`; preset `selected={draft}` from the range (`PeriodNavigator.tsx:68-71`, `:155`). Shared component, so it holds for Overview and Transactions | ✅ PASS |
| AC2 Two different days → applied, closed | First click starts a new range; second completes it, applies it and closes | `PeriodNavigator.tsx:154` `resetOnSelect`; `PeriodNavigator.stories.tsx:82-87` - from "October 2026", click Oct 5 → `expect(args.onRangeChange).not.toHaveBeenCalled()` + dialog still visible; click Oct 20 → `toHaveBeenCalledWith({ from: "2026-10-05", to: "2026-10-20" })` + dialog `toBeNull()`. Mutant M6 (drop `resetOnSelect`) killed at `:83` | ✅ PASS (closed, F1) |
| AC3 Accessible name | Button named with the current label | `TransactionsPage.test.tsx:621-623` - `findByRole("button", { name: "Choose period, ${name}" })` used in every navigator case; `PeriodNavigator.stories.tsx:80` | ✅ PASS (name "Choose period, …" accepted as "announces it opens the period picker") |
| AC4 Custom… kept | Menu item present | `PeriodNavigator.stories.tsx:62` - `getByRole("menuitem", { name: "Custom…" })).toBeVisible()`; `:69-73` opens the dialog | ✅ PASS |

### PNAV-05: Edge cases

| Edge case | Spec-defined outcome | `file:line` + assertion | Result |
| --------- | -------------------- | ----------------------- | ------ |
| Custom range missing an end | This month | `utils/periodParams.test.ts:60-62` - `toEqual(DEFAULT_SELECTION)`; `transactionParams.test.ts:91-98` | ✅ PASS |
| Unparsable date | This month | `utils/periodParams.test.ts:54-58` | ✅ PASS |
| Start after end | This month | `utils/periodParams.test.ts:48-52`; `transactionParams.test.ts:91-98` - `expect(reversed).toEqual(DEFAULT_TRANSACTIONS)` | ✅ PASS |
| Pre-feature `from`/`to` | Ignored, This month | `transactionParams.test.ts:100-104` - `toEqual(DEFAULT_TRANSACTIONS)` + `serialize(...)).toEqual({})`; flow `TransactionsPage.test.tsx:750-754` - `[{ ...OCTOBER, page: "0", size: "10" }]` | ✅ PASS |
| No period at all | This month | `utils/periodParams.test.ts:40-42`; `transactionParams.test.ts:77-82` | ✅ PASS |
| Empty month | "No transactions found." with the navigator usable | `TransactionsPageView.stories.tsx:112-117` - empty-state text visible (navigator rendered by the same view; not asserted in that story) | ✅ PASS (empty state); navigator presence covered by `:91` |
| Day range label | "5 – 20 Oct 2026" | `utils/period.test.ts:24-27` - `periodLabel(range("2026-10-05","2026-10-20"))).toBe("5 – 20 Oct 2026")` | ✅ PASS |

**Status**: ✅ All ACs covered (27/27 with `file:line` evidence); ⚠️ 1 spec-precision gap carried over, non-blocking: PNAV-01 AC8 (layout: own row above search, left-aligned, every width) is visual; `TransactionsPageView.stories.tsx` asserts the navigator's presence only, and the row order/`self-start` is confirmed by reading `TransactionsPageView.tsx:77`.

---

## Discrimination Sensor

Scratch: temp file copies (no worktree, no `pnpm exec`, no `git stash`). For each mutant: original copied to the session scratchpad, mutated in place, tests run with `node node_modules/vitest/vitest.mjs run --project=<p> <files>` from `frontend/`, original copied back and checked with `cmp` (byte-identical). Mutated files are all in a test-table row with a test kind (CLAUDE.md): `*Params.ts` (URL params → unit), `utils/*.ts` (pure computation → unit), `components/**` presentational (→ story).

| Mutation | File:line | Description | Tests run | Killed? |
| -------- | --------- | ----------- | --------- | ------- |
| M4 (re-run) | `frontend/src/features/transactions/filters/transactionParams.ts:31` | `...PERIOD_PARAM_KEYS` removed from `TRANSACTION_PARAM_KEYS` | unit: `PlanFiltersGate.test.tsx`, `TransactionsPage.test.tsx`, `transactionParams.test.ts` | ✅ Killed (2 failed / 80: `PlanFiltersGate.test.tsx:218`, `TransactionsPage.test.tsx:716`) |
| M6 (new) | `frontend/src/components/periodNavigator/PeriodNavigator.tsx:154` | `resetOnSelect` removed from the range `Calendar` | storybook: `PeriodNavigator.stories.tsx` | ✅ Killed (LabelOpensCalendar: "expected onRangeChange to not be called at all, but actually been called 1 times", `:83`) |
| M7 (new) | `frontend/src/utils/periodParams.ts:32` | `serializePeriodParams` drops every non-default preset (`return {}`) | unit: `periodParams.test.ts`, `transactionParams.test.ts`, `TransactionsPage.test.tsx`, `PlanFiltersGate.test.tsx`, `overviewParams.test.ts` | ✅ Killed (8 failed / 101, incl. flow PNAV-01 AC4 and `transactions codec > round-trips a preset period (PNAV-03)`) |

Iteration 1 mutants M1, M2, M3, M5 were killed then; the code they target is unchanged by the fix round.

**Sensor depth**: lightweight (3 mutations this iteration; 7 across both)
**Result**: 3/3 killed - PASS ✅
**Isolation**: baseline `git status --porcelain` = ` M .specs/LESSONS.md`, ` M .specs/lessons.json`; identical after every mutant and at the end. `git worktree list` shows only the real tree.

---

## Code Quality

| Principle | Status |
| --------- | ------ |
| Minimum code | ✅ (F1 is one prop) |
| Surgical changes | ✅ (fix round touches only the four files named in its tasks) |
| No scope creep | ✅ |
| Matches patterns | ✅ |
| Spec-anchored outcome check | ✅ (LabelOpensCalendar now starts from the default month-aligned range) |
| Per-layer Coverage Expectation | ✅ (key list now asserted; M4 killed) |
| Every test maps to a spec requirement | ✅ (new tests named with PNAV IDs) |
| Documented guidelines followed: `CLAUDE.md`, `frontend/scripts/testTable.ts` | ✅ |

---

## Edge Cases

- [x] Custom range missing an end / unparsable / start after end → This month
- [x] Pre-feature `from`/`to` ignored → This month
- [x] No period at all → This month
- [x] Empty month → "No transactions found." with the navigator rendered
- [x] Day range labelled "5 – 20 Oct 2026"

---

## Gate Check

- **Gate command**: `cd frontend && pnpm lint && pnpm build && pnpm test` (real tree, read-only)
- **Result**: exit 0. unit+tooling+storybook: 909 passed, 0 failed; 136 files passed, 29 skipped files (story files whose stories are all `!test`, pre-existing pattern). critical: 174 passed, branches 96.03%.
- **Test count before feature** (`7b99054`, measured in iteration 1): 883
- **Test count after feature**: 909 (iteration 1: 906)
- **Delta**: +26 (+3 in the fix round: two gate tests, one flow test)
- **Failures**: none

---

## Fix Plans

None.

---

## Requirement Traceability Update

| Requirement | Previous Status | New Status |
| ----------- | --------------- | ---------- |
| PNAV-01 | ✅ Verified (minor gaps) | ✅ Verified (AC8 layout: spec-precision gap, visual) |
| PNAV-02 | ✅ Verified (minor gap) | ✅ Verified |
| PNAV-03 | ❌ Needs Fix | ✅ Verified |
| PNAV-04 | ❌ Needs Fix | ✅ Verified |
| PNAV-05 | ✅ Verified | ✅ Verified |

---

## Summary

**Overall**: ✅ Ready

**Spec-anchored check**: 27/27 criteria with evidence; 1 spec-precision gap flagged (PNAV-01 AC8, layout)
**Sensor**: 3/3 mutations killed (M4 re-run, M6, M7)
**Gate**: 909 + 174 passed, 0 failed

**What works**: everything from iteration 1, plus: the range calendar starts a new range on the first click from a full month; the saved period is restored and saved through the gate's key list; search kept on a period change; no Date field in the popover.

**Issues found**: none blocking. AC8 placement remains verifiable only visually (UAT).

**Next steps**: interactive UAT of the placement and the label → calendar flow on a phone width, then merge.
