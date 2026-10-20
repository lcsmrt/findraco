# Test Calibration Validation

**Date**: 2026-10-20
**Spec**: `.specs/features/test-calibration/spec.md`
**Diff range**: `main..test-calibration` (ff3bfde..6910d61, 22 commits, 195 files)
**Verifier**: independent sub-agent (author ≠ verifier)

---

## Task Completion

| Task | Status | Notes |
| ---- | ------ | ----- |
| T1-T15 | ✅ Done | Every `Done when` box ticked in `tasks.md`. T14's AUD-04 claim does not hold for `TransactionFormDrawer.test.tsx` (see Gaps) |

---

## Spec-Anchored Acceptance Criteria

CI run ids, conclusions and Test-step timings below were re-read by the Verifier with `gh api repos/:owner/:repo/actions/runs/<id>/jobs` and `gh run view --log`; every listed run exists and ended `success`.

### P1: Faster CI

| Criterion | Spec-defined outcome | Evidence | Result |
| --- | --- | --- | --- |
| CIT-01 | fixed `maxWorkers` on CI, measured; 25% locally | `frontend/vite.config.ts:67` - `maxWorkers: process.env.CI ? 2 : "25%"`; N chosen from 10 full runs at N=2/3 (`design.md` "CI measurements") | ✅ PASS |
| CIT-02 | push with usable base runs only affected tests | `.github/workflows/ci.yml:26,75` (base output), `:161` - `vitest run --changed "$BASE" --passWithNoTests --project=unit --project=storybook`; run 39375424397 (one-module change): 11 unit+story files, Test step 27s | ✅ PASS |
| CIT-03 | force-rerun files run the full suite | `frontend/vite.config.ts:72-80`; Verifier probe in scratch: a change to `package.json`, `../pnpm-lock.yaml`, `vite.config.ts`, `src/index.css` each selects all 83 `unit` files (`vitest list --changed`), a change to `utils/money.ts` selects 17; run 39378904718 (`src/test/**` change): 141 files + tooling + critical | ✅ PASS |
| CIT-04 | no usable base → full suite | `ci.yml:47-54` (base only on `push` and ancestor), `:156-158` - `if [[ -z "$BASE" ]]; then pnpm test`; dispatch run 39378910114: 145 files | ✅ PASS |
| CIT-05 | weekly full run on `main`, no deploy | `ci.yml:8-9` - `cron: "0 6 * * 1"`; `ci.yml:189` - deploy requires `github.event_name == 'push'`; schedule has no base → `pnpm test`. No scheduled run exists yet (schedules fire on the default branch only) | ✅ PASS (config) |
| CIT-06 | lint, build, `check-siblings` on every run | `ci.yml:113-119` (unconditional Lint, Build), `:157` (`pnpm test` starts with `check-siblings`), `:160` (affected branch) | ✅ PASS |
| CIT-07 | affected run also runs critical modules' own tests | `ci.yml:163` - `vitest run --project=critical --coverage`; `vite.config.ts:130-141` (`critical` include = `<module>.test.ts`, `<module>.*.test.ts`); run 39375424397 log: critical 6 files | ✅ PASS |
| CIT-08 | failed scheduled run ends failed | `ci.yml:155` - `set -euo pipefail`, no `continue-on-error` in the workflow | ✅ PASS |

### P2: The test table and the gates

| Criterion | Spec-defined outcome | Evidence | Result |
| --- | --- | --- | --- |
| CAL-01 | skill and TESTING.md hold one closed table, kind → test → amount | `.claude/skills/frontend-testing/SKILL.md:18-36` (table with Amount column); `.specs/codebase/TESTING.md:104-119` (matrix rows, test kinds; amounts only for tooling/stories, the rest defers to the skill, `TESTING.md:6,121`) | ✅ PASS (minor: TESTING.md rows carry no amount column) |
| CAL-02 | the listed rows | `frontend/scripts/testTable.ts:6-26`; `SKILL.md:26-36`; `frontend/scripts/check-siblings.test.ts:172-198` - per-row `expect(findMissingTests(srcDir)).toEqual([modulePath])` and `.toEqual([])` | ✅ PASS |
| CAL-03 | no-row module needs no test | `check-siblings.test.ts:208-214` - logic modules outside every row → `toEqual([])`; `check-siblings.ts:298-301` | ✅ PASS |
| CAL-04 | unit-row module without sibling test fails, named | `check-siblings.test.ts:184-188` - `toEqual([modulePath])`; `check-siblings.ts:341-345` prints `src/<file>` | ✅ PASS |
| CAL-05 | 90% branches on the 5 critical modules only | `vite.config.ts:85-92` (include and thresholds from `criticalModules`); Verifier probe: skipping money's compact cases → `ERROR: Coverage for branches (66.66%) does not meet "src/utils/money.ts" threshold (90%)` | ✅ PASS |
| CAL-06 | non-state stories carry `!test` | `SKILL.md:112-116`; e.g. `src/app/layout/ToasterView.stories.tsx:35` - `tags: ["!test"]`; storybook project now 63 files / 166 tests (from 323) | ✅ PASS |
| CAL-07 | every `base/` story `!test`, no story demanded | all 29 `src/components/*/base/*.stories.tsx` have one `tags` key containing `"!test"` (e.g. `button/base/Button.stories.tsx:9`); `vitest list --project=storybook` lists 0 `base/` files; `check-siblings.test.ts:38-42` - `toEqual([])` | ✅ PASS |
| CAL-08 | flow tests assert container decisions only | `SKILL.md:172-186`; rewrites per `audit.md:124-137`. Rule stated, but `TransactionFormDrawer.test.tsx` lost two container decisions (AUD-04) | ✅ PASS (rule) |
| CAL-09 | no test asserts library behaviour | `SKILL.md:41-42` | ✅ PASS |
| CAL-10 | E2E-covered happy path gets no flow test | `SKILL.md:43` | ✅ PASS |

### P2: Process

| Criterion | Spec-defined outcome | Evidence | Result |
| --- | --- | --- | --- |
| PROC-01 | table sets floor and ceiling of matrix rows | `TESTING.md:121`; `SKILL.md:59-60` | ✅ PASS |
| PROC-02 | sensor mutates only non-none rows | `CLAUDE.md:76-77`; `TESTING.md:123` | ✅ PASS |
| PROC-03 | Specify: visual-only AC → story/hand check; no restated ACs | `SKILL.md:56-58` | ✅ PASS |

### P3: Audit and cut

| Criterion | Spec-defined outcome | Evidence | Result |
| --- | --- | --- | --- |
| AUD-01 | one verdict row per test/story file with its rule | `audit.md:52-235`: 182 rows; Verifier set-compare against every `*.test.ts(x)`/`*.stories.tsx` on `main`: 0 missing, 0 extra; every running file on HEAD maps to a row | ✅ PASS |
| AUD-02 | before/after tests, files, local wall time per project, CI step | `audit.md:22-46`. Verifier `vitest list --json` per project: unit 78/595, tooling 4/104, storybook 63/166, critical 6/169 → 145 files / 865 tests = audit total. Per-file after-counts match every row except `eslint.config.test.ts` (column says 47, actual 35; the row's note and the totals say 35) | ✅ PASS |
| AUD-03 | report committed alone before the cut | `6ed367c` (audit.md + tasks.md tick only) precedes the first cut commit `fef4684` | ✅ PASS |
| AUD-04 | a rewrite keeps every container decision the original asserted | `TransactionFormDrawer.test.tsx`: `main` lines 429-469 asserted that choosing an owned category in the drawer sets its owner as participant, and that participants edited by hand survive a later owned-category choice. The drawer's own wiring (`TransactionFormDrawer.tsx:97-111` `applyCategoryAttribution` with its `canAttributeToOthers` guard, `:238-240` `participantsTouchedRef`) is not in `categoryAttribution`'s unit test. The rewrite drops both; mutants M9, M10 survive the new suite and are killed by `main`'s test. Other sampled rewrites keep their decisions (see below) | ❌ GAP |
| AUD-05 | full gate passes on the cut | Verifier run: `pnpm lint && pnpm build && pnpm test` exit 0 (48s) | ✅ PASS |
| AUD-06 | uncovered table behaviour is listed, not written | `audit.md:250-260` (F1-F7); no new test written for them | ✅ PASS |

**AUD-04 sample** (container decisions in `git show main:<path>` vs HEAD):

- `CategoryFormSheet.test.tsx`: edit PUT URL (`:75`), cancel (`:96`), full create payload (`:109-128`) kept; cut limit rules are in `categoryForm.test.ts:253,416,454`. ✅
- `TransactionFormDrawer.test.tsx`: happy create with full payload (`:137`), edit PUT (`:159`), cancel, edit/create actions, recurring series kept; owned-category attribution wiring dropped. ❌
- `useOverviewFilters.test.tsx` (feature-hook cut): the hook only composes `useSearchParamGroup`; citations `useSearchParamGroup.test.tsx:61` and `overviewParams.test.ts:129` are the claimed tests. ✅
- `useFinancialTransactionCategoryService.test.ts` (service, 25 → 7): one test per endpoint/mutation with method, URL, params/body, mapping, invalidation and toast. The no-`reassignTo` branch (`useFinancialTransactionCategoryService.ts:221,240`) has no test any more; the table's "one per mutation" amount allows that. ✅
- `filterStorage.test.ts` cut: `PlanFiltersGate.test.tsx:218`, `:360` are the cited per-plan and per-screen cases. ✅
- `CurrencyInput.test.tsx` cut: `TransactionFormDrawer.test.tsx:137` is the cited happy submit. ✅
- `useTransactionActions` / `useTransactionFormSubmit` / `usePlanNameSubmit` trims: `TransactionsPage.test.tsx:167,180,193`, `MainLayout.test.tsx:221,250`, `PlanNameDialog.test.tsx:22,45` are the cited cases. ✅

### Goals

| Goal | Result |
| --- | --- |
| Full CI test step ≤ 120s | Met on both post-cut full runs: 74s (dispatch 39378910114), 119s (push 39378904718). The second sits 1s under the line on a runner that varied 95-153s before the cut, so it is not a robust margin |
| Typical affected-only push ≤ 60s | Met for a one-module push: 27s (39375424397, before the cut). The only post-cut affected run (39378639136, 56 files touched across features) took 79s |
| Closed table enforced by the gates | Met (CAL-02..07) |
| Audit with before/after numbers | Met: 1439 → 865 tests, 182 → 145 running files |

**Status**: ❌ Gaps present (AUD-04; surviving mutants M6, M9, M10)

---

## Discrimination Sensor

Scratch: `git worktree add --detach <scratchpad>/verifier/wt HEAD` + `pnpm install --frozen-lockfile --offline`; each mutant applied, `vitest related --run --project=unit --project=critical --project=storybook <file>` (or `--project=tooling` for scripts), then `git checkout` in the scratch. Targets are only code in non-none rows (PROC-02).

| # | File:line | Row | Description | Killed? |
| - | --------- | --- | ----------- | ------- |
| M1 | `frontend/scripts/testTable.ts:24` | tooling | Drop the URL params row | ✅ Killed (`names a URL params module ... (CAL-04)`) |
| M2 | `frontend/scripts/check-siblings.ts:175` | tooling | Drop the `base/` story exemption | ✅ Killed (`passes a base/ primitive without a story (CAL-07)`) |
| M3 | `frontend/src/utils/money.ts:35` | critical | `Math.round` → `Math.floor` in `toCents` | ✅ Killed (`converts 19.99 reais to 1999 cents`) |
| M4 | `frontend/src/features/transactions/components/transactionForm.ts:381` | critical | `toPayload` drops `categoryId` | ✅ Killed (`maps form values into the create/update request body`) |
| M5 | `frontend/src/features/transactions/components/transactionForm.ts:405` | critical | `toInlineSavePayload` ignores a changed description | ✅ Killed (`sends each changed field in place of the stored one`) |
| M6 | `frontend/src/features/transactions/utils/transactionSort.ts:13` | business rule (moved, 14 → 8) | `description` column sorts by API field `amount` | ❌ Survived (killed by `main`'s test: `sorts column description by the API field description`) |
| M7 | `frontend/src/features/transactions/utils/activeFilterCount.ts:9` | business rule (moved, 10 → 4) | member filter no longer counted | ✅ Killed (unit + `TransactionFilterPopoverView` story) |
| M8 | `frontend/src/api/services/useFinancialTransactionService.ts:264` | service hook (21 → 9) | series update URL gains a trailing `/` | ✅ Killed (service test + `useTransactionFormSubmit` series cases) |
| M9 | `frontend/src/features/transactions/components/TransactionFormDrawer.tsx:105` | container (flow rewritten 15 → 6) | `participantsTouched: false`: hand-edited participants are overwritten by an owned category | ❌ Survived (killed by `main`'s `keeps hand-edited participants ... (CAT-17)`) |
| M10 | `frontend/src/features/transactions/components/TransactionFormDrawer.tsx:98` | container | `applyCategoryAttribution` returns at once: owned category no longer attributes | ❌ Survived (killed by `main`'s `attributes the transaction to the owner of the chosen category (CAT-17)`) |

Extra probes (not mutants): CIT-03 trigger globs and the CAL-05 threshold (see AC table).

**Sensor depth**: expanded (10 mutants; the feature cut tests, so the question is whether the trimmed suite still kills realistic faults)
**Isolation**: real tree `git status --porcelain` empty before and after (matches baseline); scratch worktree clean after each mutant
**Result**: 7/10 killed - ❌ FAIL

---

## Code Quality

| Principle | Status |
| --- | --- |
| Minimum code | ✅ (`testTable.ts` 34 lines, read by the gate and the config) |
| Surgical changes | ✅ |
| No scope creep | ✅ (follow-ups listed, not written) |
| Matches patterns | ✅ (comments explain why; no lint bypass; English only) |
| Spec-anchored outcome check | ⚠️ AUD-04 fails for one file |
| Per-layer coverage expectation (tooling: one valid + one invalid per behaviour) | ✅ (`check-siblings.test.ts` pairs per row and exemption) |
| Every test maps to a requirement | ✅ |
| Documented guidelines followed: `CLAUDE.md`, `.claude/skills/frontend-testing/SKILL.md`, `.specs/codebase/TESTING.md` | ✅ |

---

## Edge Cases

- [x] No affected test → step passes, lint/build/siblings still run: `ci.yml:161` `--passWithNoTests`; run 39373953726 ran 0 unit/story files and passed (17s).
- [x] Worker count lowered, never retries: N=2 chosen; no `retry` in `vite.config.ts`.
- [x] Catalog story stops rendering → no gate fails: accepted; `!test` stories never run.
- [x] Module moved to `utils/` keeps its test: all 11 moves have a sibling test that runs (`features/*/utils/`, `app/layout/utils/`); counts match `audit.md`.

---

## Gate Check

- **Gate command**: `cd frontend && pnpm lint && pnpm build && pnpm test`
- **Result**: exit 0; 865 passed, 0 failed (145 files, 29 catalog files skipped); `critical` 169 passed, every critical module ≥ 90% branches (all files 95.91%)
- **Test count before feature**: 1442 (spec baseline; 1439 after T1)
- **Test count after feature**: 865
- **Delta**: -577, each cut justified per file in `audit.md`
- **Skipped tests**: the 29 `base/` story files (catalog by CAL-07)
- **Failures**: none

---

## Fix Plans

### Fix 1: Restore the drawer's owned-category decisions (AUD-04, M9, M10) - Major

- **Root cause**: T14 treated the two CAT-17 flow cases as repeats of `categoryAttribution`'s unit test, but they also prove the drawer's own wiring: calling it on category change behind `canAttributeToOthers`, and `participantsTouchedRef` set by `AttributionFields` edits.
- **Fix task**: in `frontend/src/features/transactions/components/TransactionFormDrawer.test.tsx`, restore one case: choose an owned category, then assert the POST body's `participants` is the owner; and one case: edit participants by hand, then choose an owned category, and assert the hand edit is sent. Update the `audit.md` row (6 → 8). Done when M9 and M10 are killed.

### Fix 2: Assert every column mapping of the sort (M6) - Minor

- **Root cause**: "per-column mappings are one rule" kept one column; the mapping is data, and a wrong entry is a realistic typo.
- **Fix task**: in `frontend/src/features/transactions/utils/transactionSort.test.ts`, assert the full `SORTABLE_FIELDS` and `SORT_COLUMNS` round trip in one table-driven case (no new `it` per column needed). Done when M6 is killed.

### Fix 3 (doc, minor): the TESTING.md matrix has no amount per frontend row (CAL-01); add the column or state that the skill's Amount column applies.

---

## Requirement Traceability Update

| Requirement | New Status |
| --- | --- |
| CIT-01..08 | ✅ Verified (CIT-05 by config; no scheduled run exists yet) |
| CAL-01..10 | ✅ Verified (CAL-01 minor doc note) |
| PROC-01..03 | ✅ Verified |
| AUD-01, 02, 03, 05, 06 | ✅ Verified |
| AUD-04 | ❌ Needs Fix |

---

## Summary

**Overall**: ❌ Not Ready

**Spec-anchored check**: 26/27 ACs matched; AUD-04 gap
**Sensor**: 7/10 mutations killed (M6, M9, M10 survived)
**Gate**: 865 passed, 0 failed

**What works**: the table as code drives the sibling gate and the coverage config; CI runs affected tests with a base and the full suite otherwise, verified on 15 real runs; full CI test step 74s/119s (from 247s); the audit covers every file and its totals match the suite exactly; critical modules, forms, money, URL-building service code and filter counting still kill realistic faults.

**Issues found**: the drawer rewrite lost two container decisions (Fix 1); the sort-mapping trim leaves column mappings unasserted (Fix 2); the full-run goal holds by 1s on one of two samples.

**Next steps**: route Fix 1 and Fix 2 to an implementer, then re-verify.

**validate_state**: `python3 .claude/skills/tlc-spec-driven/scripts/validate_state.py test-calibration --root .` → exit 1, "validation.md verdict is FAIL - route the ranked gaps to fix tasks, then re-verify (feature is not done)" (expected for a FAIL report).
