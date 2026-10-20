# Test Calibration Validation

**Date**: 2026-10-20
**Spec**: `.specs/features/test-calibration/spec.md`
**Diff range**: `main..test-calibration` (3774b0e..4369d07, 26 commits, 199 files); this re-check covers the fix commits `716dedc..4369d07` (031646b, f62ff05, 4369d07: 4 files)
**Verifier**: independent sub-agent (author ≠ verifier), iteration 2 of at most 3

---

## Iteration History

| Iteration | Commit checked | Verdict | Gaps |
| --- | --- | --- | --- |
| 1 | 6910d61 (report 716dedc) | FAIL | AUD-04 (drawer lost the two CAT-17 decisions; M9, M10 survived), sort column mappings unasserted (M6 survived), TESTING.md matrix without amounts and a stale `eslint.config.test.ts` audit cell |
| 2 | 4369d07 (this report) | PASS | none blocking; M6, M9, M10 now killed, 3 fresh mutants killed |

Fixes between the two: 031646b restores the two owned-category flow cases, f62ff05 adds a table-driven column ↔ field case to the sort test, 4369d07 gives each TESTING.md frontend matrix row an Amount column and fixes the audit cell (47 → 35).

---

## Task Completion

| Task | Status | Notes |
| ---- | ------ | ----- |
| T1-T15 | ✅ Done | Every `Done when` box ticked in `tasks.md`. T14's AUD-04 gap from iteration 1 is closed by 031646b |
| Fix 1-3 (iteration 1) | ✅ Done | 031646b, f62ff05, 4369d07; each verified below |

---

## Spec-Anchored Acceptance Criteria

Iteration 2 re-checked only what the fix commits touch (`git diff --stat 716dedc..HEAD`: `TESTING.md`, `audit.md`, `TransactionFormDrawer.test.tsx`, `transactionSort.test.ts`) and spot-checked the rest: `vite.config.ts:67`, `ci.yml:161-163`, `check-siblings.test.ts:184-188` still read as cited, so every other iteration-1 row stands unchanged. CI run ids, conclusions and Test-step timings below were re-read by the iteration-1 Verifier with `gh api repos/:owner/:repo/actions/runs/<id>/jobs` and `gh run view --log`; every listed run exists and ended `success`.

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
| CAL-01 | skill and TESTING.md hold one closed table, kind → test → amount | `.claude/skills/frontend-testing/SKILL.md:24-36` (table with Amount column); `.specs/codebase/TESTING.md:105-122` (matrix with an Amount column since 4369d07; each frontend row's amount matches the skill's row word for word, e.g. `TESTING.md:112` service hooks "one test per endpoint or mutation, asserting method, URL, params/body and response mapping" = `SKILL.md:27`) | ✅ PASS (iteration-1 doc note closed) |
| CAL-02 | the listed rows | `frontend/scripts/testTable.ts:6-26`; `SKILL.md:26-36`; `frontend/scripts/check-siblings.test.ts:172-198` - per-row `expect(findMissingTests(srcDir)).toEqual([modulePath])` and `.toEqual([])` | ✅ PASS |
| CAL-03 | no-row module needs no test | `check-siblings.test.ts:208-214` - logic modules outside every row → `toEqual([])`; `check-siblings.ts:298-301` | ✅ PASS |
| CAL-04 | unit-row module without sibling test fails, named | `check-siblings.test.ts:184-188` - `toEqual([modulePath])`; `check-siblings.ts:341-345` prints `src/<file>` | ✅ PASS |
| CAL-05 | 90% branches on the 5 critical modules only | `vite.config.ts:85-92` (include and thresholds from `criticalModules`); Verifier probe: skipping money's compact cases → `ERROR: Coverage for branches (66.66%) does not meet "src/utils/money.ts" threshold (90%)` | ✅ PASS |
| CAL-06 | non-state stories carry `!test` | `SKILL.md:112-116`; e.g. `src/app/layout/ToasterView.stories.tsx:35` - `tags: ["!test"]`; storybook project now 63 files / 166 tests (from 323) | ✅ PASS |
| CAL-07 | every `base/` story `!test`, no story demanded | all 29 `src/components/*/base/*.stories.tsx` have one `tags` key containing `"!test"` (e.g. `button/base/Button.stories.tsx:9`); `vitest list --project=storybook` lists 0 `base/` files; `check-siblings.test.ts:38-42` - `toEqual([])` | ✅ PASS |
| CAL-08 | flow tests assert container decisions only | `SKILL.md:172-186`; rewrites per `audit.md:124-137`; the two restored drawer cases assert POST-body decisions (`participants`), not library behaviour | ✅ PASS |
| CAL-09 | no test asserts library behaviour | `SKILL.md:41-42` | ✅ PASS |
| CAL-10 | E2E-covered happy path gets no flow test | `SKILL.md:43` | ✅ PASS |

### P2: Process

| Criterion | Spec-defined outcome | Evidence | Result |
| --- | --- | --- | --- |
| PROC-01 | table sets floor and ceiling of matrix rows | `TESTING.md:124`; `SKILL.md:59-60` | ✅ PASS |
| PROC-02 | sensor mutates only non-none rows | `CLAUDE.md:76-77`; `TESTING.md:126` | ✅ PASS |
| PROC-03 | Specify: visual-only AC → story/hand check; no restated ACs | `SKILL.md:56-58` | ✅ PASS |

### P3: Audit and cut

| Criterion | Spec-defined outcome | Evidence | Result |
| --- | --- | --- | --- |
| AUD-01 | one verdict row per test/story file with its rule | `audit.md:52-235`: 182 rows; Verifier set-compare against every `*.test.ts(x)`/`*.stories.tsx` on `main`: 0 missing, 0 extra; every running file on HEAD maps to a row | ✅ PASS |
| AUD-02 | before/after tests, files, local wall time per project, CI step | `audit.md:22-46`. Iteration 2 `vitest list --json` per project on 4369d07: unit 78 files / 598 tests, tooling 4/104, storybook 63/166, critical 6/169 → 145 files / 868 tests = `audit.md:31` total (868) and `audit.md:33` (unit 598); gate run reports `Tests 868 passed`. Changed rows match the files: `audit.md:87` sort 14 → 9 (9 `it(`), `audit.md:137` drawer 15 → 8 (8 `it(`), `audit.md:138` `eslint.config.test.ts` now 114 → 35 (stale 47 fixed) | ✅ PASS |
| AUD-03 | report committed alone before the cut | `6ed367c` (audit.md + tasks.md tick only) precedes the first cut commit `fef4684` | ✅ PASS |
| AUD-04 | a rewrite keeps every container decision the original asserted | Iteration 1 gap closed by 031646b: `frontend/src/features/transactions/components/TransactionFormDrawer.test.tsx:295` "attributes the transaction to the owner of the chosen category (CAT-17)" - `expect(body.participants).toEqual([{ memberId: 2 }])` (`:308`); `:311` "keeps hand-edited participants when an owned category is chosen afterwards (CAT-17)" - `expect(body.splitMode).toBe("EQUAL")`, `expect(body.participants).toEqual([{ memberId: 1 }, { memberId: 2 }])` (`:324-325`). They reach the drawer's own wiring (`TransactionFormDrawer.tsx:97-111` `applyCategoryAttribution` behind `canAttributeToOthers`, `participantsTouchedRef`); M9 and M10 are now killed by them. Other sampled rewrites keep their decisions (see below) | ✅ PASS |
| AUD-05 | full gate passes on the cut | Iteration 2 run on 4369d07: `pnpm lint && pnpm build && pnpm test` exit 0 (48s), 868 passed | ✅ PASS |
| AUD-06 | uncovered table behaviour is listed, not written | `audit.md:250-260` (F1-F7); no new test written for them | ✅ PASS |

**AUD-04 sample** (container decisions in `git show main:<path>` vs HEAD):

- `CategoryFormSheet.test.tsx`: edit PUT URL (`:75`), cancel (`:96`), full create payload (`:109-128`) kept; cut limit rules are in `categoryForm.test.ts:253,416,454`. ✅
- `TransactionFormDrawer.test.tsx`: happy create with full payload (`:144`), edit PUT (`:167`), cancel (`:193`), edit/create actions (`:205`, `:223`), recurring series (`:245`), owned-category attribution (`:295`, `:311`, restored in iteration 2). ✅
- `useOverviewFilters.test.tsx` (feature-hook cut): the hook only composes `useSearchParamGroup`; citations `useSearchParamGroup.test.tsx:61` and `overviewParams.test.ts:129` are the claimed tests. ✅
- `useFinancialTransactionCategoryService.test.ts` (service, 25 → 7): one test per endpoint/mutation with method, URL, params/body, mapping, invalidation and toast. The no-`reassignTo` branch (`useFinancialTransactionCategoryService.ts:221,240`) has no test any more; the table's "one per mutation" amount allows that. ✅
- `filterStorage.test.ts` cut: `PlanFiltersGate.test.tsx:218`, `:360` are the cited per-plan and per-screen cases. ✅
- `CurrencyInput.test.tsx` cut: `TransactionFormDrawer.test.tsx:144` is the cited happy submit (`audit.md:128` updated to `:144`). ✅
- `useTransactionActions` / `useTransactionFormSubmit` / `usePlanNameSubmit` trims: `TransactionsPage.test.tsx:167,180,193`, `MainLayout.test.tsx:221,250`, `PlanNameDialog.test.tsx:22,45` are the cited cases. ✅

### Goals

| Goal | Result |
| --- | --- |
| Full CI test step ≤ 120s | Met on both post-cut full runs: 74s (dispatch 39378910114), 119s (push 39378904718). The second sits 1s under the line on a runner that varied 95-153s before the cut, so the margin is thin. The fix commits add 3 tests; no CI run was re-measured in iteration 2 |
| Typical affected-only push ≤ 60s | Partly met: 27s for a one-module push (39375424397), measured before the cut. The only post-cut affected run (39378639136, 56 files touched across features) took 79s, so the goal is missed for a wide push and unmeasured for a typical one after the cut |
| Closed table enforced by the gates | Met (CAL-02..07) |
| Audit with before/after numbers | Met: 1439 → 868 tests, 182 → 145 running files |

**Status**: ✅ All 27 ACs covered; no spec-precision gaps. The affected-only goal is only partly met (see Goals); it is a goal, not an AC

---

## Discrimination Sensor

Iteration 1 scratch: `git worktree add --detach <scratchpad>/verifier/wt HEAD` (6910d61) + `pnpm install --frozen-lockfile --offline`; each mutant applied, `vitest related --run --project=unit --project=critical --project=storybook <file>` (or `--project=tooling` for scripts), then `git checkout` in the scratch. Targets are only code in non-none rows (PROC-02).

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

| M6 (re-run) | `frontend/src/features/transactions/utils/transactionSort.ts:13` | business rule | `description: "description"` → `description: "amount"` | ✅ Killed (`transactionSort.test.ts:14` `maps every sortable column to its API field and back`) |
| M9 (re-run) | `frontend/src/features/transactions/components/TransactionFormDrawer.tsx:105` | container | `participantsTouched: participantsTouchedRef.current` → `participantsTouched: false` | ✅ Killed (`TransactionFormDrawer.test.tsx:311` `keeps hand-edited participants ... (CAT-17)`) |
| M10 (re-run) | `frontend/src/features/transactions/components/TransactionFormDrawer.tsx:98` | container | `if (!canAttributeToOthers) return;` → `return;` | ✅ Killed (`TransactionFormDrawer.test.tsx:295` `attributes the transaction to the owner of the chosen category (CAT-17)`) |
| N1 | `frontend/src/features/overview/filters/overviewParams.ts:46` | URL params (`*Params.ts`) | custom range accepted without `from <= to` (inverted range kept) | ✅ Killed (`overviewParams.test.ts:61` `falls back to this-month when the custom range is inverted`) |
| N2 | `frontend/src/features/overview/utils/scaleLimits.ts:38` | business rule (`utils/`, trimmed) | `overLimit: spent > limit` → `spent >= limit` | ✅ Killed (`scaleLimits.test.ts:61` `is not over when spend equals the limit`, `:65` zero-limit case) |
| N3 | `frontend/src/api/services/useFinancialTransactionService.ts:105` | service hook (21 → 9) | update PUT sends `{ ...body, participants: [] }` instead of `body` | ✅ Killed (service test `update PUTs the body to the transaction's URL ...`) |

Iteration 2 scratch: `git worktree add --detach <scratchpad>/verifier2/wt HEAD` (4369d07) + `pnpm install --frozen-lockfile --offline`; each mutant applied with `sed`, `vitest related --run --project=unit --project=critical --project=storybook <file>`, then `git checkout -- src` and an empty scratch `git status --porcelain` before the next; worktree removed with `git worktree remove --force` and pruned.

**Sensor depth**: expanded (iteration 1: 10 mutants; iteration 2: 3 re-runs + 3 fresh, all in non-none rows)
**Isolation**: real tree `git status --porcelain` empty before and after each iteration (iteration 2: diffed against the saved baseline, identical; also empty after the gate run)
**Totals**: iteration 1 7/10 killed; iteration 2 6/6 killed; every mutant that ever survived (M6, M9, M10) is now killed
**Result**: 6/6 killed in iteration 2 - ✅ PASS

---

## Code Quality

| Principle | Status |
| --- | --- |
| Minimum code | ✅ (`testTable.ts` 34 lines, read by the gate and the config) |
| Surgical changes | ✅ |
| No scope creep | ✅ (follow-ups listed, not written) |
| Matches patterns | ✅ (comments explain why; no lint bypass; English only) |
| Spec-anchored outcome check | ✅ (AUD-04 closed; the restored cases assert the exact POST `participants`) |
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
- **Result**: exit 0 in 48s on 4369d07; 868 passed, 0 failed (145 files, 29 catalog files skipped); `critical` 6 files / 169 passed, every critical module ≥ 90% branches (all files 95.91% branches)
- **Test count before feature**: 1442 (spec baseline; 1439 after T1)
- **Test count after feature**: 868 (865 at iteration 1, +2 drawer, +1 sort)
- **Delta**: -574, each cut justified per file in `audit.md`
- **Skipped tests**: the 29 `base/` story files (catalog by CAL-07)
- **Failures**: none

---

## Fix Plans

Iteration 1's three fixes are done and verified (see Iteration History). No new fix task. Kept below for the record.

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
| CAL-01..10 | ✅ Verified |
| PROC-01..03 | ✅ Verified |
| AUD-01..06 | ✅ Verified (AUD-04 after the iteration-1 fix) |

`spec.md`'s traceability table still reads "Pending" for every ID; this Verifier changes only `validation.md`, so the orchestrator should copy these statuses over.

---

## Summary

**Overall**: ✅ Ready

**Spec-anchored check**: 27/27 ACs matched spec outcome; 0 spec-precision gaps
**Sensor**: iteration 2 6/6 killed (M6, M9, M10 re-runs; N1-N3 fresh); 13/16 across both iterations, and the 3 survivors of iteration 1 are now killed
**Gate**: 868 passed, 0 failed

**What works**: the table as code drives the sibling gate and the coverage config; CI runs affected tests with a base and the full suite otherwise, verified on 15 real runs; full CI test step 74s/119s (from 247s); the audit covers every file and its totals (868) match the suite; the drawer flow again proves its owned-category wiring; every sort column mapping is asserted; TESTING.md and the skill carry the same amounts.

**Issues found (non-blocking)**: the affected-only ≤60s goal holds only for a one-module push measured before the cut (27s); the one wide post-cut push took 79s. The full-run 119s sample is 1s under its line. `spec.md` traceability still "Pending".

**Next steps**: copy the traceability statuses into `spec.md`; measure one typical post-cut affected push to settle the ≤60s goal.

**validate_state**: `python3 .claude/skills/tlc-spec-driven/scripts/validate_state.py test-calibration --root .` → exit 0, "validate_state: 0 error(s) across [test-calibration]".
