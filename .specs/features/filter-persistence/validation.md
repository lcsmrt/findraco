# Filter Persistence Validation

## Validation: filter-persistence - FAIL ❌

**Date**: 2026-10-11
**Spec**: `.specs/features/filter-persistence/spec.md`
**Diff range**: `59a18b5..HEAD` (9 task commits, HEAD `ee37295`, branch `feat/filter-persistence`)
**Verifier**: independent sub-agent (author ≠ verifier)

Why FAIL: three discrimination-sensor mutants survived, two of them in tested state-layer logic (M1, M9). One P1 AC has no discriminating evidence (P1-Reload AC1, "save on every change"). Several ACs and edge cases are covered only by the build gate, and the T9 manual check is still pending.

---

## Task Completion

| Task | Status | Notes |
| ---- | ------ | ----- |
| T1 codec | ✅ Done | `homeFilterParams.ts` + 38 tests |
| T2 storage | ✅ Done | `filterStorage.ts` + 8 tests |
| T3 logout | ✅ Done | `clearSessionStorage` + 2 tests; `Navbar.tsx:25` call site switched (build-only) |
| T4 category-by-id | ✅ Done | 7 tests |
| T5 useHomeFilters | ✅ Done | 5 tests |
| T6 HomeFiltersGate | ⚠️ Partial | Done-when items pass, but the save-on-change path is undiscriminated (M1 survived) |
| T7 chips hook | ⚠️ Partial | 404 vs other-error branch undiscriminated (M9 survived) |
| T8 Home + Overview wiring | ✅ Done (build only) | Overview stale-member / single-member logic has no test (M10 survived) |
| T9 Transactions wiring | ⚠️ Partial | `[ ] Manual check in the dev app` is still unticked in tasks.md |

---

## Spec-Anchored Acceptance Criteria

Paths are relative to `frontend/src/`.

### P1: Filters survive tab switches and navigation

| Criterion | Spec-defined outcome | `file:line` + assertion | Verdict |
| --------- | -------------------- | ----------------------- | ------ |
| AC1 Transactions filter/sort/size → URL | each value is present in the query params | `features/home/hooks/useHomeFilters.test.tsx:213` - `expect(currentParams()).toEqual({plan,category:"12",type:"DEBIT",sort:"amount.desc",size:"25"})`; `:277` (min); every field round-trip `features/home/filters/homeFilterParams.test.ts:289-301` | ✅ PASS (hook/codec level; UI handlers in `TransactionsTab.tsx` are build-only) |
| AC2 Overview period/member → URL | preset/custom/member in params | `useHomeFilters.test.tsx:233` - `toEqual({plan:"1",period:"last-3m",overviewMember:"7"})`; custom `homeFilterParams.test.ts:211` | ✅ PASS (hook/codec level) |
| AC3 tab switch and back keeps exact filters | returning tab has identical filters | `useHomeFilters.test.tsx:253-263` (period survives tab push + Back); `:277-299` (one tab's update leaves other tab's params intact) | ✅ PASS |
| AC4 home → `/plans` → home restores tab + filters | latest tab and filters restored | Restore on `/` is evidenced at `features/home/filters/HomeFiltersGate.test.tsx:65-74`. The **latest change** only reaches storage through the save-on-change effect, which is undiscriminated (M1 survived) | ❌ GAP (depends on P1-Reload AC1) |
| AC5 restored Transactions shows first page | page = 0 | none (`TransactionsTab.tsx:71-72` local state, no test) | ❌ No evidence (manual pending, T9) |
| AC6 filter change replaces history entry | Back skips the filter change | `useHomeFilters.test.tsx:222-223`, `:244-245` - `expect(location.pathname).toBe("/other")` | ✅ PASS |
| AC7 tab switch pushes entry | Back returns to previous tab | `useHomeFilters.test.tsx:260-263` - `expect(hook.tab).toBe("overview")` | ✅ PASS |
| AC8 Clear removes Transactions params from URL **and saved state** | params gone from URL and storage | URL: `useHomeFilters.test.tsx:309-315`. Saved state: no test (relies on the M1-undiscriminated effect). Also clears `sort` and `size` (`useHomeFilters.ts:84`), even though AC1 lists "filter, sort or page size" separately | ⚠️ Partial + spec-precision gap |

### P1: Filters survive page reload

| Criterion | Spec-defined outcome | `file:line` + assertion | Verdict |
| --------- | -------------------- | ----------------------- | ------ |
| AC1 any change → saved to `homeFilters:{user}:{plan}` | storage updated on **every** change | Only mount-time save is asserted: `HomeFiltersGate.test.tsx:92` - `expect(localStorage.getItem("homeFilters:1:5")).toBe(...)`. No test changes the URL after mount. **M1 (drop `search` from effect deps) survived** | ❌ GAP |
| AC2 no params → restore saved + write URL | URL = saved state + plan | `HomeFiltersGate.test.tsx:65-74` - `params()).toEqual({plan:"5",tab:"transactions",category:"12",period:"last-3m"})`, children never see the pre-restore URL | ✅ PASS |
| AC3 params present → apply + save | URL wins, stored | `HomeFiltersGate.test.tsx:90-94`, `:102-105` | ✅ PASS |
| AC4 preset relative to now | later month resolves to later month | `homeFilterParams.test.ts:378` - `toEqual({startDate:"2026-11-01",endDate:"2026-11-30"})` (OverviewTab passes `new Date()` at `OverviewTab.tsx:74`, build-only) | ✅ PASS |
| AC5 custom range absolute | same dates | `homeFilterParams.test.ts:211-216` | ✅ PASS |
| AC6 defaults when nothing saved | overview, this-month, no member, no filters, size 10, no sort | `HomeFiltersGate.test.tsx:80` - `toBe("?plan=5")`; `homeFilterParams.test.ts:224`, `:320`, `:352` | ✅ PASS |
| AC7 storage throws → no error | URL filtering keeps working | `HomeFiltersGate.test.tsx:159-160`; `lib/filterStorage.test.ts:43`, `:51` | ✅ PASS |

### P1: Each plan remembers its own filters

| Criterion | Spec-defined outcome | `file:line` + assertion | Verdict |
| --------- | -------------------- | ----------------------- | ------ |
| AC1 plan switch → new plan's saved state / defaults | URL = new plan's state | `HomeFiltersGate.test.tsx:117-118` - `toEqual({plan:"5",member:"3"})`; defaults path `:80` | ✅ PASS |
| AC2 switch back restores previous plan | previous plan's filters | `HomeFiltersGate.test.tsx:123-124` | ✅ PASS |
| AC3 never apply other plan's ids | no foreign ids rendered | `HomeFiltersGate.test.tsx:132-133` - `childRenders.some(s=>s.includes("category"))).toBe(false)`; storage isolation `lib/filterStorage.test.ts:19`, `:24` | ✅ PASS |

### P2: Shareable filtered URL

| Criterion | Spec-defined outcome | `file:line` + assertion | Verdict |
| --------- | -------------------- | ----------------------- | ------ |
| AC1 valid URL for "a plan they belong to" renders tab, filters and named chips | chips show names | Active plan: `HomeFiltersGate.test.tsx:90`, chips `features/home/hooks/useTransactionFilterChips.test.tsx:99-107` - `["Debit","Groceries","Ana",...]`. A link whose `plan` is another plan the user belongs to is **discarded** (`HomeFiltersGate.tsx:53-56`, test `:132`). This is a design.md decision, but it narrows the AC and has no SPEC_DEVIATION marker | ⚠️ Partial (spec conflict) |
| AC2 unparseable value → default for that param | per-param default | `homeFilterParams.test.ts:336-340` (it.each, 12 cases), `:227-237`, `:251-260`, `:346`, tab `:361` | ✅ PASS |

### Edge cases

| Edge case | Evidence | Verdict |
| --------- | -------- | ------ |
| Stale category → dropped from URL + saved state | `useTransactionFilterChips.test.tsx:152-154` (404). Non-404 errors are not tested: M9 (drop on **any** error) survived | ⚠️ Weak |
| Stale member → dropped | Transactions: `useTransactionFilterChips.test.tsx:161-163`. Overview: `OverviewTab.tsx:47-57`, no test | ⚠️ Partial |
| Inverted custom range → this-month | `homeFilterParams.test.ts:240-248` | ✅ PASS |
| Single-member plan hides the picker and ignores the Overview member | `OverviewTab.tsx:44-53`, no test; M10 survived | ❌ No evidence (manual pending) |
| Logout keeps saved filters (assumption) | `lib/storage.test.ts:83-87`; `Navbar.tsx:25` build-only | ✅ PASS |

**Status**: ❌ Gaps present (2 GAP, 2 no-evidence, 1 spec-precision gap, 1 spec conflict)

---

## Discrimination Sensor

Run in an isolated `git worktree` at `/tmp/claude-1000/fp-sensor`, with `node_modules` symlinked from the real tree. Command: `npx vitest run --project=unit src/features/home src/lib src/api/services` (111 tests). The scratch was removed afterwards.

| # | File:line | Mutation | Outcome |
| - | --------- | -------- | ------- |
| M1 | `features/home/filters/HomeFiltersGate.tsx:44` | Remove `search` from the save effect deps (filter/tab changes after mount are never saved) | ❌ Survived |
| M2 | `features/home/filters/HomeFiltersGate.tsx:54` | `hasHomeParams && !hasPlanParam` → `hasHomeParams` (apply a foreign plan's params) | ✅ Killed (2) |
| M3 | `features/home/filters/homeFilterParams.ts:124` | Drop the `from <= to` check (inverted range accepted) | ✅ Killed (1) |
| M4 | `features/home/hooks/useHomeFilters.ts:77` | `updateTransactions` `replace: true` → `false` | ✅ Killed (1) |
| M5 | `features/home/hooks/useHomeFilters.ts:84` | Clear keeps `sort`/`size` (`TRANSACTION_PARAM_KEYS.slice(0,-2)`) | ✅ Killed (1) |
| M6 | `features/home/hooks/useTransactionFilterChips.ts:61` | Drop the `membersLoaded &&` guard (member dropped before members load) | ✅ Killed (1) |
| M7 | `features/home/filters/homeFilterParams.ts:209` | `last-3m` uses `subMonths(now, 3)` (off-by-one) | ✅ Killed (2) |
| M8 | `features/home/hooks/useHomeFilters.ts:49` | `setTab` uses `replace: true` (no push) | ✅ Killed (1) |
| M9 | `features/home/hooks/useTransactionFilterChips.ts:60` | `isNotFound(categoryError)` → `categoryError != null` (any network/5xx error silently drops the filter) | ❌ Survived |
| M10 | `features/home/components/overview/OverviewTab.tsx:51` | Remove the single-member / loading guard on the Overview member | ❌ Survived (no tests by design; build-only layer) |
| M11 | `features/home/filters/HomeFiltersGate.tsx:57` | Plan mismatch ignores the saved state (always defaults) | ✅ Killed (2) |

**Sensor depth**: lightweight+ (11 behavior-level mutations; standard feature, riskiest logic prioritised)
**Sensor outcome**: 8/11 killed, 3 survived (sensor FAIL ❌)

---

## Interactive UAT

Not performed. The T9 manual check ("every spec Independent Test passes in the dev app") is still unticked in tasks.md, and it is required for AC P1-Nav 5 and the single-member edge case.

---

## Code Quality

| Principle | Status |
| --------- | ------ |
| Minimum code | ✅ |
| Surgical changes | ✅ (Navbar, storage, service hook justified by design) |
| No scope creep | ⚠️ Clear now also resets sort + page size (the old clear kept them) |
| Matches patterns | ✅ (service hook raw fn + `useXxx`, named arrow components) |
| Spec-anchored outcome check | ❌ P1-Reload AC1 asserted only at mount |
| Per-layer Coverage Expectation (hooks: happy + edge + failure) | ❌ Gate save-on-change and chips non-404 failure branch missing |
| Every test maps to a spec requirement | ✅ (category update/delete invalidation tests map to FPERS-10 stale names) |
| Documented guidelines followed: `CLAUDE.md`, `.specs/codebase/TESTING.md` | ✅ |

---

## Gate Check

- **Gate commands** (from `frontend/`): `npm run test`, `npm run build` (`tsc -b && vite build`), `npx eslint <18 touched files>`. The full `npm run lint` was skipped because of 23 pre-existing Storybook errors outside this feature.
- **Outcome**: 119 passed, 0 failed, 0 skipped. Build exit 0 (only the chunk-size warning). ESLint on touched files exit 0.
- **Test count before feature**: 45 (5 pre-existing files)
- **Test count after feature**: 119
- **Delta**: +74 new tests, no deletions or weakening.

---

## Fix Plans

### Fix 1 (Major): save-on-change not discriminated (M1, P1-Reload AC1, P1-Nav AC4, AC8 saved half)
- **Root cause**: no test changes the URL while the gate is "current", so nothing asserts storage follows later changes.
- **Fix task**: in `HomeFiltersGate.test.tsx`, render at `/?plan=5`, navigate (or call `useHomeFilters().updateTransactions` / `setTab` / `clearTransactions` from a child), then assert `localStorage.getItem("homeFilters:1:5")` equals the new query string. Include one case that asserts cleared Transactions params are gone from storage.
- **Done when**: M1 is killed.

### Fix 2 (Major): category drop on non-404 errors undiscriminated (M9, stale-category edge case)
- **Fix task**: in `useTransactionFilterChips.test.tsx`, mock the category GET to fail with a 500/network error, then assert `category=12` stays in the URL.
- **Done when**: M9 is killed.

### Fix 3 (Minor, spec): shared link for a non-active plan the user belongs to (P2 AC1)
- Either amend the spec AC to "for the active plan" (matching the design decision), or add a `// SPEC_DEVIATION` at `HomeFiltersGate.tsx:53-56`. Optionally offer to switch plan. Needs a user decision.

### Fix 4 (Minor, spec-precision): "Clear filters" scope (P1-Nav AC8)
- Decide whether Clear should reset `sort`/`size`. The old behaviour kept them, and AC1 lists them separately from filters. Pin the decision in the spec and the test at `useHomeFilters.test.tsx:309`.

### Fix 5 (Manual/UAT): AC P1-Nav 5, single-member edge, Overview stale member (M10)
- Complete the T9 manual check covering each Independent Test plus: restored Transactions on page 1, a single-member plan with a saved `overviewMember`, and a removed member in the Overview URL. Optionally extract the Overview member logic into a tested pure helper.

---

## Requirement Traceability Update

| Requirement | Previous | New |
| ----------- | -------- | --- |
| FPERS-01 | In Tasks | ✅ Verified (hook/codec) |
| FPERS-02 | In Tasks | ❌ Needs Fix (AC4 via M1, AC5 manual) |
| FPERS-03 | In Tasks | ✅ Verified |
| FPERS-04 | In Tasks | ⚠️ Needs Fix (saved-state half, spec-precision) |
| FPERS-05 | In Tasks | ❌ Needs Fix (AC1, M1) |
| FPERS-06 | In Tasks | ✅ Verified |
| FPERS-07 | In Tasks | ✅ Verified |
| FPERS-08 | In Tasks | ✅ Verified |
| FPERS-09 | In Tasks | ⚠️ Spec conflict (AC1 non-active plan) |
| FPERS-10 | In Tasks | ❌ Needs Fix (M9; single-member no evidence) |

(spec.md not edited by the Verifier. The orchestrator applies these updates.)

---

## Summary

**Overall**: ❌ Not Ready

**Spec-anchored check**: 15/20 ACs matched the spec outcome. 2 GAP (Reload AC1, Nav AC4), 1 no evidence (Nav AC5), 2 partial (Nav AC8 incl. 1 spec-precision gap, P2 AC1 spec conflict). Edge cases: 2/5 fully evidenced.
**Sensor**: 8/11 mutations killed
**Gate**: 119 passed, build OK, eslint on touched files OK

**What works**: URL codec (invalid → default, relative presets, inverted range), replace/push history semantics, per-plan restore and isolation, failure-safe storage, logout keeps filters, chip labels and 404/stale-member drop.

**Next steps**: Fix 1 and Fix 2 (test-only), user decisions on Fix 3 and Fix 4, then the T9 manual check, then re-verify.
