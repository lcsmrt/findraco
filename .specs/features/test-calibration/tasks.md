# Test Calibration Tasks

## Execution Protocol (MANDATORY -- do not skip)

Implement these tasks with the `tlc-spec-driven` skill: **activate it by name and follow its Execute flow and Critical Rules.** Do not search for skill files by filesystem path. The skill is the source of truth for the full flow (per-task cycle, sub-agent delegation, adequacy review, Verifier, discrimination sensor).

**If the skill cannot be activated, STOP and tell the user - do not proceed without it.**

---

**Design**: `.specs/features/test-calibration/design.md`
**Status**: Done (Verifier PASS, iteration 2, 2026-10-20)
**Branch**: `test-calibration`. Pushing this branch is allowed (CI runs, nothing deploys). Never push `main`, never merge.

---

## Test Coverage Matrix

> Generated from codebase, project guidelines, and spec. Guidelines found: `CLAUDE.md` (Frontend), `.claude/skills/frontend-testing/SKILL.md`, `.specs/codebase/TESTING.md`, `frontend/vite.config.ts`, `frontend/package.json`, this feature's `design.md` (the table that supersedes AD-012). The table, not the existing tests, sets the floor and the ceiling.

| Code Layer | Required Test Type | Coverage Expectation | Location Pattern | Run Command |
| ---------- | ------------------ | -------------------- | ---------------- | ----------- |
| Gate and table scripts (`scripts/*.ts`) | unit (tooling) | One valid and one invalid case per behaviour the script promises (per table row, per exemption) | `frontend/scripts/*.test.ts` | Tooling |
| Vitest config, package scripts, CI workflow | none | Proven by running them: local gate, and CI runs on the pushed branch | - | Build / CI |
| Skills and docs | none | The task's `Done when` checked against `design.md` | - | Docs |
| Audit cuts and rewrites of existing tests | the kind of the file touched | The design's verdict rules; nothing beyond them | existing files | Quick / Full |

## Gate Check Commands

> Run from `frontend/`.

| Gate Level | When to Use | Command |
| ---------- | ----------- | ------- |
| Docs | Skill and doc tasks | none; `Done when` checked against `design.md` |
| Tooling | Gate/table script tasks | `pnpm exec vitest run --project=tooling && node scripts/check-siblings.ts` |
| Quick | Tasks touching unit or flow tests | `pnpm exec vitest related --run <changed files>` |
| Full | Tasks touching stories | `pnpm exec vitest run --project=storybook` plus Quick |
| Build | Last task of each phase | `pnpm lint && pnpm build && pnpm test` |
| CI | CI tasks | `git push origin test-calibration`, then `gh run watch` / `gh workflow run ci.yml --ref test-calibration` |

---

## Execution Plan

Phases are ordered and run sequentially - each phase completes before the next begins, and tasks within a phase execute in order.

### Phase 1: The table as code and the gates

```
T1 → T2 → T3
```

### Phase 2: CI runs what a push can break

```
T4 → T5 → T6
```

### Phase 3: Docs carry the table

```
T7 → T8
```

### Phase 4: Audit report and stories

```
T9 → T10 → T11
```

### Phase 5: Unit and flow tests, final numbers

```
T12 → T13 → T14 → T15
```

---

## Task Breakdown

### T1: The test table as code

**What**: Create `scripts/testTable.ts` with `criticalModules`, `unitRows` and `needsUnitTest(relativePath)` per the design; wire `findMissingTests` in `scripts/check-siblings.ts` to require a sibling test only when `needsUnitTest` holds and the module has logic or is critical; update `check-siblings.test.ts`: one requiring case and one passing case per row, a critical module without logic still required, a logic module outside every row passing; drop the cases the old content-only rule needed and the table no longer asks for.
**Where**: `frontend/scripts/testTable.ts`, `frontend/scripts/check-siblings.ts`, `frontend/scripts/check-siblings.test.ts`
**Depends on**: None
**Reuses**: `hasLogic`, the test's temp-tree helpers
**Requirement**: CAL-02, CAL-03, CAL-04

**Tools**: MCP: NONE · Skill: `frontend-testing`

**Done when**:

- [x] `needsUnitTest` matches each row and each critical module, and nothing else
- [x] `node scripts/check-siblings.ts` passes on the current tree
- [x] Gate check passes: Tooling

**Tests**: unit (tooling)
**Gate**: tooling
**Commit**: `feat(testing): test table drives the sibling gate`

---

### T2: No story demanded of base primitives

**What**: `findMissingStories` exempts components under a `base/` folder; add a test case for it.
**Where**: `frontend/scripts/check-siblings.ts`
**Depends on**: T1
**Reuses**: `isComponentFile`
**Requirement**: CAL-07

**Tools**: MCP: NONE · Skill: `frontend-testing`

**Done when**:

- [x] A `base/` component without a story passes; a non-`base/` presentational one without a story still fails
- [x] Gate check passes: Tooling

**Tests**: unit (tooling)
**Gate**: tooling
**Commit**: `feat(testing): base primitives need no story`

---

### T3: Coverage only on critical modules

**What**: In `vite.config.ts`, `coverage.include` = the critical modules (imported from `scripts/testTable.ts`), one `{ branches: 90 }` threshold per critical module, no global number, and a `critical` project running the critical modules' sibling tests (`<module>.test.ts`, `<module>.*.test.ts`); in `package.json`, `test` and `test:coverage` per the design.
**Where**: `frontend/vite.config.ts` (+ `frontend/package.json` scripts)
**Depends on**: T2
**Reuses**: the `unit` project definition
**Requirement**: CAL-05, CIT-07

**Tools**: MCP: NONE · Skill: `frontend-testing`

**Done when**:

- [x] `pnpm exec vitest run --project=critical --coverage` reports exactly the five critical modules and passes
- [x] Temporarily skipping one `money.test.ts` case drops `money.ts` under 90% and fails it; reverted
- [x] Gate check passes: Build (phase end)

**Tests**: none (config; proven by the gate)
**Gate**: build
**Commit**: `feat(testing): coverage threshold on critical modules only`

---

### T4: Vitest config for CI parallelism and affected runs

**What**: `maxWorkers: process.env.CI ? 2 : "25%"` (the value is revisited in T6) and `forceRerunTriggers` per the design, each with a one-line why comment.
**Where**: `frontend/vite.config.ts`
**Depends on**: None (runs after Phase 1)
**Reuses**: the existing `maxWorkers` comment (update it, do not stack a second one)
**Requirement**: CIT-01, CIT-03

**Tools**: MCP: NONE · Skill: `frontend-testing`

**Done when**:

- [x] Locally, a whitespace change to `src/index.css` makes `pnpm exec vitest list --changed` (or `run --changed`) select every test file; a change to `src/utils/money.ts` selects only the related ones; reverted
- [x] Gate check passes: Quick (`pnpm exec vitest run --project=unit --project=tooling`)

**Tests**: none (config; proven by the local checks above)
**Gate**: quick
**Commit**: `ci(frontend): fixed workers on CI and force-rerun triggers`

---

### T5: CI tests the affected files and runs the full suite weekly

**What**: `ci.yml`: weekly `schedule` (Mondays 06:00 UTC); `changes` job outputs `base` (empty for `schedule`, `workflow_dispatch`, no usable base); frontend checkout `fetch-depth: 0`; Test step runs the affected command when `base` is set, else `pnpm test` (design). Comments explain why, matching the file's style. `deploy` untouched.
**Where**: `.github/workflows/ci.yml`
**Depends on**: T4
**Reuses**: the `changes` job's base logic
**Requirement**: CIT-02, CIT-04, CIT-05, CIT-06, CIT-08

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [x] `actionlint` passes if installed (else YAML parses with `python3 -c 'import yaml,sys; yaml.safe_load(open(sys.argv[1]))'`)
- [x] The affected command and the full command both run green locally from `frontend/` (with `BASE=main`)

**Tests**: none (workflow; proven by T6)
**Gate**: build
**Commit**: `ci: affected frontend tests on push, full suite weekly`

---

### T6: Measure on CI and fix the worker count

**What**: Push `test-calibration`. Dispatch full runs (`gh workflow run ci.yml --ref test-calibration`) with N=2 and N=3 (commit the N change between them as `ci(frontend): N workers on CI` if 3 wins); keep the fastest N with no failure across three full runs. Then push a one-module change and confirm the affected run selected only related files. Record every run id, test-step time and N in `design.md` under a new "CI measurements" section.
**Where**: `frontend/vite.config.ts` (N), `.specs/features/test-calibration/design.md`
**Depends on**: T5
**Reuses**: `gh api repos/:owner/:repo/actions/runs/<id>/jobs` step timings
**Requirement**: CIT-01, CIT-02, Goal (≤ 120s full)

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [x] Three green full runs at the chosen N; test-step times recorded
- [x] One affected run recorded with its file count
- [x] Any probe commit (the one-module change) is reverted in a following commit

**Tests**: none (measurement)
**Gate**: CI
**Commit**: `docs(test-calibration): CI measurements`

---

### T7: frontend-testing skill holds the table

**What**: Rewrite the skill per the design's Docs section: the table (rows, test kind, amount, pointing at `scripts/testTable.ts`), critical-module coverage, stories as test vs catalog (with the merge-the-tags warning), flow scope, no library tests, E2E overlap, Specify guidance, commands (`critical` project, `--changed`, weekly full). Keep its existing tone and the parts still true (MSW rules, `renderWithProviders`, no `vi.mock` of our modules).
**Where**: `.claude/skills/frontend-testing/SKILL.md`
**Depends on**: None (runs after Phase 2)
**Reuses**: current skill text
**Requirement**: CAL-01, CAL-02, CAL-06, CAL-08, CAL-09, CAL-10, PROC-01, PROC-03

**Tools**: MCP: NONE · Skill: `frontend-testing`

**Done when**:

- [x] Every rule from CAL-01..CAL-10 and PROC-01/03 stated once; no leftover "90% on every logic module" or "each variant" rule

**Tests**: none
**Gate**: docs
**Commit**: `docs(testing): frontend-testing skill holds the test table`

---

### T8: TESTING.md, CLAUDE.md, component-creation, STATE, ROADMAP

**What**: Update `.specs/codebase/TESTING.md` (frontend sections, matrix, floor/ceiling, sensor scope, CI), the Tests and story bullets of `CLAUDE.md` (plus the sensor-scope rule), the story rule in `.claude/skills/component-creation/SKILL.md`; add AD-015 to `.specs/STATE.md` superseding AD-012 (set AD-012 status); close the two ROADMAP todos with a one-line pointer to this feature.
**Where**: `.specs/codebase/TESTING.md` (+ `CLAUDE.md`, `component-creation/SKILL.md`, `STATE.md`, `ROADMAP.md`)
**Depends on**: T7
**Reuses**: T7's wording
**Requirement**: PROC-01, PROC-02, CAL-07

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [x] Sensor scope stated in CLAUDE.md and TESTING.md; floor/ceiling stated in TESTING.md
- [x] AD-012 marked `superseded by AD-015`

**Tests**: none
**Gate**: docs
**Commit**: `docs(testing): process docs follow the test table`

---

### T9: Audit report

**What**: Write `.specs/features/test-calibration/audit.md`: one row per test and story file (182) with kind, verdict, rule and planned tests before → after, per the design's verdict rules; the spec's baseline as "before"; follow-ups section. Commit it before any cut (AUD-03).
**Where**: `.specs/features/test-calibration/audit.md`
**Depends on**: None (runs after Phase 3)
**Reuses**: spec Baseline; `vitest list` output
**Requirement**: AUD-01, AUD-02, AUD-03, AUD-06

**Tools**: MCP: NONE · Skill: `frontend-testing`

**Done when**:

- [x] Every test and story file has exactly one row and verdict

**Tests**: none
**Gate**: docs
**Commit**: `docs(test-calibration): audit report`

---

### T10: base stories become catalog

**What**: Merge `"!test"` into the meta `tags` of every story file under a `base/` folder (never a second `tags` key).
**Where**: `frontend/src/components/**/base/*.stories.tsx`
**Depends on**: T9
**Reuses**: none
**Requirement**: CAL-07

**Tools**: MCP: NONE · Skill: `frontend-testing`

**Done when**:

- [x] `pnpm exec vitest run --project=storybook` reports every `base/` file skipped; `pnpm storybook` still lists them (check with `pnpm build-storybook` succeeding)
- [x] Gate check passes: Full

**Tests**: story (catalog only)
**Gate**: full
**Commit**: `test(stories): base primitives are catalog only`

---

### T11: Other stories: states run, the rest is catalog

**What**: Apply the story verdict rule to every non-`base/` story file per `audit.md`.
**Where**: `frontend/src/**/*.stories.tsx` (non-`base/`)
**Depends on**: T10
**Reuses**: audit verdicts
**Requirement**: CAL-06

**Tools**: MCP: NONE · Skill: `frontend-testing`, `component-creation`

**Done when**:

- [x] Each file matches its audit row; `node scripts/check-siblings.ts` passes
- [x] Gate check passes: Build (phase end)

**Tests**: story
**Gate**: build
**Commit**: `test(stories): only component states run as tests`

---

### T12: Logic and service unit tests trimmed to the table

**What**: Apply the verdicts for unit tests of modules, service hooks, API utils and shared hooks: moves to `utils/` (module + test + imports; a moved critical module also moves in `testTable.ts`), trims, library-test cuts, glue-test cuts.
**Where**: `frontend/src/**/*.test.ts` (non-hook-in-feature)
**Depends on**: None (runs after Phase 4)
**Reuses**: audit verdicts
**Requirement**: CAL-02, CAL-09

**Tools**: MCP: NONE · Skill: `frontend-testing`, `feature-structure`

**Done when**:

- [x] Each file matches its audit row; `node scripts/check-siblings.ts` passes; critical coverage passes
- [x] Gate check passes: Quick (`pnpm exec vitest run --project=unit --project=tooling`)

**Tests**: unit
**Gate**: quick
**Commit**: `test(unit): unit tests follow the test table`

---

### T13: Feature-hook tests

**What**: Cut each feature-hook test whose decisions are covered elsewhere (cite in `audit.md`), keep and list the rest as follow-ups.
**Where**: `frontend/src/features/**/use*.test.ts`
**Depends on**: T12
**Reuses**: audit verdicts
**Requirement**: CAL-02, AUD-06

**Tools**: MCP: NONE · Skill: `frontend-testing`

**Done when**:

- [x] Every cut has a cited covering test in `audit.md`
- [x] Gate check passes: Quick

**Tests**: unit
**Gate**: quick
**Commit**: `test(hooks): feature hooks are covered by their flows`

---

### T14: Flow tests prove container decisions only

**What**: Rewrite the flow tests per CAL-08 and the audit: drop pure value-rule assertions a unit test covers (cite it), keep every container decision (AUD-04).
**Where**: `frontend/src/**/*.test.tsx`
**Depends on**: T13
**Reuses**: `MainLayout.test.tsx` as the model
**Requirement**: CAL-08, AUD-04

**Tools**: MCP: NONE · Skill: `frontend-testing`

**Done when**:

- [x] Each file matches its audit row
- [x] Gate check passes: Quick

**Tests**: integration
**Gate**: quick
**Commit**: `test(flows): flow tests assert container decisions only`

---

### T15: Final numbers

**What**: Trim tooling tests per the table if the audit says so; run the Build gate; measure after-numbers (tests, files per kind, local wall time per project) and push to get the CI test-step time on a full run (dispatch); fill the "after" columns and totals of `audit.md`.
**Where**: `.specs/features/test-calibration/audit.md` (+ `frontend/eslint/rules/*.test.ts` if trimmed)
**Depends on**: T14
**Reuses**: the measurement script approach from the spec baseline (`vitest --reporter=json`)
**Requirement**: AUD-02, AUD-05, Goals

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [x] Build gate passes; CI full run green with its time recorded
- [x] `audit.md` totals match the suite

**Tests**: unit (tooling, if trimmed)
**Gate**: build
**Commit**: `docs(test-calibration): audit after-numbers`

---

## Diagram-Definition Cross-Check

| Task | Depends On (task body) | Diagram Shows | Status |
| ---- | ---------------------- | ------------- | ------ |
| T1 | None | start of Phase 1 | ✅ |
| T2 | T1 | T1 → T2 | ✅ |
| T3 | T2 | T2 → T3 | ✅ |
| T4 | None (after Phase 1) | Phase 1 → Phase 2 | ✅ |
| T5 | T4 | T4 → T5 | ✅ |
| T6 | T5 | T5 → T6 | ✅ |
| T7 | None (after Phase 2) | Phase 2 → Phase 3 | ✅ |
| T8 | T7 | T7 → T8 | ✅ |
| T9 | None (after Phase 3) | Phase 3 → Phase 4 | ✅ |
| T10 | T9 | T9 → T10 | ✅ |
| T11 | T10 | T10 → T11 | ✅ |
| T12 | None (after Phase 4) | Phase 4 → Phase 5 | ✅ |
| T13 | T12 | T12 → T13 | ✅ |
| T14 | T13 | T13 → T14 | ✅ |
| T15 | T14 | T14 → T15 | ✅ |

## Test Co-location Validation

| Task | Code Layer Created/Modified | Matrix Requires | Task Says | Status |
| ---- | --------------------------- | --------------- | --------- | ------ |
| T1, T2 | Gate and table scripts | unit (tooling) | unit (tooling) | ✅ |
| T3, T4, T5, T6 | Vitest config, scripts, CI | none | none | ✅ |
| T7, T8, T9 | Docs | none | none | ✅ |
| T10, T11 | Stories | story | story | ✅ |
| T12, T13, T14 | Existing tests | kind of file | unit / integration | ✅ |
| T15 | Audit doc (+ tooling tests) | none / unit | unit (tooling, if trimmed) | ✅ |
