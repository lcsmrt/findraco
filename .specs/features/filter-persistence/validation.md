# Filter Persistence Validation

## Validation: filter-persistence - PASS ✅ (iteration 2)

**Date**: 2026-10-11
**Spec**: `.specs/features/filter-persistence/spec.md` (revised after iteration 1: Clear scope, P2 AC2–3 cross-plan links, new edge cases)
**Diff range**: `59a18b5..HEAD` (HEAD `ac897c3`, branch `feat/filter-persistence`)
**Verifier**: independent sub-agent (author ≠ verifier), re-derived from code and tests; commit messages, task ticks and the iteration-1 conclusions were not trusted.

**Iteration history**: iteration 1 was not ready (3 surviving mutants M1/M9/M10, 2 AC gaps, 1 spec conflict, 1 spec-precision gap) and produced fix tasks T10–T15. Iteration 2 (this report) re-checks those items and the iteration-1 changes.

**Verdict**: every AC and edge case has discriminating automated evidence at the level the Test Coverage Matrix requires. 15/15 mutants killed. All gates are green. The interactive UAT (T9 "Manual check") is still pending with the user. It does not block this verdict: validate.md treats UAT as a separate level, and tasks.md's coverage matrix sets the presentational wiring layer to "build gate". The feature is not done until the user completes that check.

---

## Task Completion

| Task | Status | Notes |
| ---- | ------ | ----- |
| T1–T8 | ✅ Done | Re-verified through the tests and sensor below |
| T9 Transactions wiring | ⚠️ UAT pending | `[ ] Manual check in the dev app` intentionally unticked; the user runs it |
| T10 Clear keeps sort/size | ✅ Done | `useHomeFilters.ts:30-32`; N5/N6 killed |
| T11 Gate save-on-change + cross-plan links | ✅ Done | `HomeFiltersGate.tsx:39-69`; M1, N1–N4 killed |
| T12 404-only drop + no retry on 404 | ✅ Done | `useTransactionFilterChips.ts:41,63`; M9, N7 killed |
| T13 Popover keeps category before name loads | ✅ Done | `transactionFilterDraft.ts:40`; N8 killed |
| T14 Overview member + page-reset hooks | ✅ Done | `useOverviewMemberFilter.ts`, `useTransactionsPage.ts`; M10, N10–N12 killed |
| T15 Popover keeps member before members load | ✅ Done | `transactionFilterDraft.ts:42,72`; N9 killed |

---

## Spec-Anchored Acceptance Criteria

Paths are relative to `frontend/src/`.

### P1: Filters survive tab switches and navigation

| Criterion | Spec-defined outcome | `file:line` + assertion | Verdict |
| --------- | -------------------- | ----------------------- | ------- |
| AC1 Transactions filter/sort/size → URL | each value in query params | `features/home/hooks/useHomeFilters.test.tsx:51` - `toEqual({plan:"1",category:"12",type:"DEBIT",sort:"amount.desc",size:"25"})`; all fields incl. `q`: `features/home/filters/homeFilterParams.test.ts:124-135` | ✅ PASS (hook/codec; handlers in `TransactionsTab.tsx` are build-gate wiring) |
| AC2 Overview period/member → URL | preset/custom/member in params | `useHomeFilters.test.tsx:71` - `toEqual({plan:"1",period:"last-3m",overviewMember:"7"})`; custom `homeFilterParams.test.ts:46-50` | ✅ PASS |
| AC3 tab switch and back → same filters | identical filters | `useHomeFilters.test.tsx:98-101` (Back returns `{plan,period:"last-6m"}`, tab overview); `:115-137` (other tab's params intact) | ✅ PASS |
| AC4 home → `/plans` → home restores tab + filters | latest state restored | Latest change persisted: `features/home/filters/HomeFiltersGate.test.tsx:168-180` - `localStorage.getItem("homeFilters:1:5")` equals each post-mount state; restore on `/`: `:96-105` | ✅ PASS (M1 now killed) |
| AC5 restored Transactions shows first page | page 0 | `features/home/hooks/useTransactionsPage.test.ts:300` - `expect(result.current[0]).toBe(0)` on mount; resets on filter/sort/size/clear `:316-320` | ✅ PASS (hook; `TransactionsTab.tsx:67` call site is wiring) |
| AC6 filter change replaces history | Back skips the change | `useHomeFilters.test.tsx:60-61`, `:82-83` - `expect(location.pathname).toBe("/other")` | ✅ PASS |
| AC7 tab switch pushes | Back returns to previous tab | `useHomeFilters.test.tsx:98-101` - `expect(hook.tab).toBe("overview")` | ✅ PASS |
| AC8 Clear removes type/category/member/dates/amounts/`q` from URL **and saved state**, keeps sort + size | exact param set | URL: `useHomeFilters.test.tsx:147-154` - `toEqual({plan,tab,period,overviewMember,sort:"amount.asc",size:"25"})`; saved: `HomeFiltersGate.test.tsx:178-180` - `toBe("plan=5&sort=amount.desc&tab=transactions")` | ✅ PASS (spec-precision gap from iteration 1 resolved) |

### P1: Filters survive page reload

| Criterion | Spec-defined outcome | `file:line` + assertion | Verdict |
| --------- | -------------------- | ----------------------- | ------- |
| AC1 any change → saved under `homeFilters:{user}:{plan}` | storage follows every change | `HomeFiltersGate.test.tsx:168-180` (filter, tab, clear after mount); key format `lib/filterStorage.test.ts:36` | ✅ PASS |
| AC2 no params → restore saved + write URL | URL = saved + plan, children never see defaults | `HomeFiltersGate.test.tsx:96-105` | ✅ PASS |
| AC3 params present → apply + save | URL wins and is stored | `HomeFiltersGate.test.tsx:121-125`, `:133-136` | ✅ PASS |
| AC4 preset relative to now | later month | `homeFilterParams.test.ts:213` - `toEqual({startDate:"2026-11-01",endDate:"2026-11-30"})` | ✅ PASS |
| AC5 custom range absolute | same dates | `homeFilterParams.test.ts:46-51` | ✅ PASS |
| AC6 defaults when nothing saved | overview, this-month, no member, size 10, no sort | `HomeFiltersGate.test.tsx:111` - `toBe("?plan=5")`; `homeFilterParams.test.ts:154-156` (size 10, no sort) | ✅ PASS |
| AC7 storage throws → no error | URL filtering continues | `HomeFiltersGate.test.tsx:255-256`; `lib/filterStorage.test.ts:43`, `:51` | ✅ PASS |

### P1: Each plan remembers its own filters

| Criterion | Spec-defined outcome | `file:line` + assertion | Verdict |
| --------- | -------------------- | ----------------------- | ------- |
| AC1 plan switch → new plan's saved state / defaults | URL = new plan's state, no bounce back | `HomeFiltersGate.test.tsx:147-149` - `activePlanId` stays 5, `params()` = `{plan:"5",member:"3"}` | ✅ PASS |
| AC2 switch back restores previous plan | previous plan's filters | `HomeFiltersGate.test.tsx:153-155` | ✅ PASS |
| AC3 never apply another plan's ids | no child render with foreign ids | `HomeFiltersGate.test.tsx:149`, `:155`, `:194`, `:229`; storage isolation `lib/filterStorage.test.ts:19`, `:24` | ✅ PASS |

### P2: Shareable filtered URL

| Criterion | Spec-defined outcome | `file:line` + assertion | Verdict |
| --------- | -------------------- | ----------------------- | ------- |
| AC1 valid URL → tab, filters, named chips | chips show names | `HomeFiltersGate.test.tsx:121`; `features/home/hooks/useTransactionFilterChips.test.tsx:108-114` - `["Debit","Groceries","Ana",...]` | ✅ PASS |
| AC2 link to another member plan → plan becomes active, URL filters applied | active plan = URL plan, URL filters kept | `HomeFiltersGate.test.tsx:190-197` - `activePlanId` 4, `params()` = `{plan:"4",tab:"transactions",category:"12"}`, every child render has `urlPlan === activePlanId`; waits for the plan list `:210-219` | ✅ PASS (spec conflict from iteration 1 resolved) |
| AC3 link to a non-member plan → ignore params, restore active plan's saved state | URL = active plan's saved state | `HomeFiltersGate.test.tsx:227-229` - `toEqual({plan:"5",tab:"transactions"})`, no render with `category` | ✅ PASS |
| AC4 unparseable value → default for that param | per-param default | `homeFilterParams.test.ts:158-175` (12 cases), `:177-183`, `:62-90` | ✅ PASS |

### Edge cases

| Edge case | Evidence | Verdict |
| --------- | -------- | ------- |
| Category 404 → dropped from URL + saved state | `useTransactionFilterChips.test.tsx:161-164` (exactly 1 request); saved state follows URL (`HomeFiltersGate.test.tsx:168`) | ✅ PASS |
| Category other error → kept | `useTransactionFilterChips.test.tsx:182-183` (500 and network) | ✅ PASS |
| Popover applied before category name loads → kept | `features/home/components/transactions/transactionFilterDraft.test.ts:347-350`; member equivalent `:385-388` | ✅ PASS |
| Stale member → dropped | Transactions `useTransactionFilterChips.test.tsx:190-191`; Overview `features/home/hooks/useOverviewMemberFilter.test.tsx:273-275` | ✅ PASS |
| Inverted custom range → this-month | `homeFilterParams.test.ts:82-83` | ✅ PASS |
| Single-member plan hides picker, ignores Overview member | `useOverviewMemberFilter.test.tsx:265-266` | ✅ PASS |
| Logout keeps saved filters (assumption) | `lib/storage.test.ts:30-34` | ✅ PASS |

**Status**: ✅ All ACs and edge cases covered (23/23 ACs, 7/7 edge cases). No spec-precision gaps.

---

## Discrimination Sensor

Run in an isolated `git worktree` at `/tmp/claude-1000/fp-sensor2` (detached HEAD, `node_modules` symlinked). Command: `npx vitest run --project=unit src/features/home src/lib src/api/services` (131 tests, all green before mutating). Each mutant was applied to one file, run, then restored. The worktree was removed afterwards, and the real tree's `git status --porcelain` matches the pre-sensor baseline (clean).

| # | File:line | Mutation | Outcome |
| - | --------- | -------- | ------- |
| M1 (re-run) | `features/home/filters/HomeFiltersGate.tsx:60` | Drop `search` from the save-effect deps | ✅ Killed (1) |
| M9 (re-run) | `features/home/hooks/useTransactionFilterChips.ts:63` | `isNotFound(categoryError)` → `categoryError != null` | ✅ Killed (2) |
| M10 (re-run) | `features/home/hooks/useOverviewMemberFilter.ts:33` | Remove the single-member/loading guard | ✅ Killed (1) |
| N1 | `HomeFiltersGate.tsx:47-48` | `activePlanSwitched` → `false` (bounce back to URL plan after user switch) | ✅ Killed (1) |
| N2 | `HomeFiltersGate.tsx:58` | Never update the agreed-plan ref | ✅ Killed (1) |
| N3 | `HomeFiltersGate.tsx:52` | Never switch to a linked member plan | ✅ Killed (2) |
| N4 | `HomeFiltersGate.tsx:50` | `isAwaitingPlans` → `false` (decide before plans load) | ✅ Killed (1) |
| N5 | `features/home/hooks/useHomeFilters.ts:31` | Clear also removes `size` | ✅ Killed (1) |
| N6 | `useHomeFilters.ts:31` | Clear keeps `q` | ✅ Killed (2) |
| N7 | `useTransactionFilterChips.ts:41` | Retry on 404 too | ✅ Killed (1) |
| N8 | `features/home/components/transactions/transactionFilterDraft.ts:40` | Draft `categoryId` taken from the display object | ✅ Killed (1) |
| N9 | `transactionFilterDraft.ts:72` | Apply member only from the display object | ✅ Killed (1) |
| N10 | `features/home/hooks/useTransactionsPage.ts:16` | No page reset on filter change | ✅ Killed (4) |
| N11 | `useTransactionsPage.ts:12-14` | Page-reset key ignores sort/size | ✅ Killed (2) |
| N12 | `useOverviewMemberFilter.ts:29` | Stale Overview member never dropped | ✅ Killed (1) |

**Sensor depth**: lightweight+ (3 re-runs + 12 new behavior-level mutations on the iteration-1 changes)
**Sensor outcome**: 15/15 killed ✅

---

## Interactive UAT

Pending, run by the user: tasks.md T9 "Manual check in the dev app: every spec Independent Test passes". Suggested extra checks, since these paths are build-gate wiring only: popover Apply/Reset and seeded category chip; search debounce into `q`; Overview dashboard request uses `effectiveMemberId`; PlanSwitcher while on home; opening a link to another plan you belong to; Back across a plan switch, which now follows the entry's `plan` and switches the active plan (consistent with P2 AC2).

---

## Code Quality

| Principle | Status |
| --------- | ------ |
| Minimum code | ✅ |
| Surgical changes | ✅ |
| No scope creep | ✅ (Clear scope now matches the user decision) |
| Matches patterns | ✅ (minor: `MemberOption` is declared twice, `useOverviewMemberFilter.ts:7` and `transactionFilterDraft.ts:14`; non-blocking) |
| Spec-anchored outcome check | ✅ |
| Per-layer Coverage Expectation (pure 1:1, hooks happy+edge+failure, wiring = build gate) | ✅ |
| Every test maps to a spec requirement | ✅ |
| Documented guidelines followed: `CLAUDE.md`, `.specs/codebase/TESTING.md` | ✅ |

Non-blocking doc note: the traceability table in spec.md maps FPERS-09 to "P2 AC 1–2", but P2 now has AC1–4.

---

## Gate Check

- **Commands** (from `frontend/`): `npm run test`; `npm run build` (`tsc -b && vite build`); `npx eslint` on the 25 added/modified frontend files in the diff. The full `npm run lint` was skipped because of 23 pre-existing Storybook errors outside this feature.
- **Outcome**: 139 passed, 0 failed, 0 skipped (15 files). Build exit 0 (only the chunk-size warning). ESLint exit 0, with 0 errors and 1 warning (`react-refresh/only-export-components` at `TransactionFilterPopover.tsx:52`, `countActiveFilters`). That export already existed before the feature (`59a18b5`, line 103).
- **Test count**: 45 before feature → 119 (iteration 1) → 139 now. +20 since iteration 1, no deletions or weakened assertions.

---

## Fix Plans

None blocking. Optional: dedupe `MemberOption`; update FPERS-09 traceability to P2 AC 1–4.

---

## Requirement Traceability Update

| Requirement | Previous | New |
| ----------- | -------- | --- |
| FPERS-01 | ✅ Verified | ✅ Verified |
| FPERS-02 | ❌ Needs Fix | ✅ Verified (UAT pending) |
| FPERS-03 | ✅ Verified | ✅ Verified |
| FPERS-04 | ⚠️ Needs Fix | ✅ Verified |
| FPERS-05 | ❌ Needs Fix | ✅ Verified |
| FPERS-06 | ✅ Verified | ✅ Verified |
| FPERS-07 | ✅ Verified | ✅ Verified |
| FPERS-08 | ✅ Verified | ✅ Verified |
| FPERS-09 | ⚠️ Spec conflict | ✅ Verified |
| FPERS-10 | ❌ Needs Fix | ✅ Verified |

(spec.md not edited by the Verifier.)

---

## Summary

**Overall**: ✅ Ready for UAT (automated verification passed; the T9 manual check remains)

**Spec-anchored check**: 23/23 ACs and 7/7 edge cases matched the spec outcome, with 0 spec-precision gaps
**Sensor**: 15/15 killed (incl. M1, M9, M10 from iteration 1)
**Gate**: 139 passed, build OK, eslint on touched files OK (0 errors)

**Next steps**: the user runs the T9 manual check, then ticks it in tasks.md.
