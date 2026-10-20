# Test Calibration Specification

## Problem Statement

The frontend went from too few tests to too many: 1442 tests in 182 files (2026-10-20). Two separate costs hide behind that number. CI time: the test step takes 247s of a ~7 min push, but 175s of it is the `unit` project running one file at a time (`maxWorkers: "25%"` gives one worker on the 4-vCPU runner; tests proper are 34s, jsdom setup and module collection 109s). Volume: every feature writes and maintains tests that protect nothing, driven by the content-based sibling gate (any `if` or `.map` demands a test), the 90% per-file branch threshold, and a story checklist that turns every variant into a test. The goal is an objective rule for what to test and how, one that does not hinge on judgment, and a suite cut down to it.

## Goals

- [ ] A full frontend test step on CI finishes in ≤ 120s (from 247s), and a typical affected-only push in ≤ 60s.
- [ ] A closed table "code kind → test kind → amount" decides every test; a module matching no row gets no test, and the gates enforce the table, not more.
- [ ] The existing suite is audited against the table and cut, with before/after numbers (tests, files, local and CI time) in a report the user reviews after the fact.
- [ ] The process (TESTING.md, `frontend-testing` skill, CLAUDE.md) keeps the calibration: the next feature writes tests by the table without fighting the tlc skill.

## Out of Scope

| Feature | Reason |
| --- | --- |
| Backend tests | Few and already gated on three invariant classes; the backend standards review is queued separately |
| E2E journeys (Playwright) | Blocked by the local Docker database; only the future rule about overlap with flow tests is set here (CAL-13) |
| Visual regression (screenshots) | Baselines would churn while the UI is still being reworked (`frontend-testing` skill) |
| `build-storybook` in CI | Catalog-only stories may break unnoticed; accepted, revisit if it bites |
| Writing tests for gaps the audit finds | The audit lists gaps as follow-ups; filling them is new work, not calibration |
| Editing the tlc-spec-driven skill | Upstream v3.3.0, unmodified; edits would be lost on update. The project docs it consults carry the rules |
| Observability/alerting beyond GitHub's own | Planned for later; one user today |

---

## Assumptions & Open Questions

| Assumption / decision | Chosen default | Rationale | Confirmed? |
| --- | --- | --- | --- |
| Full-suite cadence | Weekly scheduled run on `main` plus manual `workflow_dispatch`; every other push runs affected tests only | User: one user today, observability comes later; the phase-end local gate also runs the full suite | y |
| Worker count on CI | A fixed number per pool, measured on the runner in Design (start at 2; keep the one with no flaky timeout across three full runs) | 25% gives 1 worker on 4 vCPU; the cap exists because oversubscription made `user-event` tests time out | y (agent's discretion) |
| How a code kind is recognised | By path and file name only (e.g. `**/*Form.ts`, `src/api/services/use*Service.ts`, `**/*Params.ts`, `**/utils/**`); exact patterns are fixed in Design | Content-based classification is what made every `.map` demand a test; path/name keeps the rule mechanical | y |
| Pure computation inside `components/` (`spendingRows.ts`, `scaleLimits.ts`, `groupByDay.ts`, `transactionSort.ts`, `categoryDeletion.ts`, …) | Classified as business rule and moved to the feature's `utils/` folder, keeping its unit test; `.ts` glue next to components (column definitions, class maps, prop mapping) gets no test | A calculation shown to the user is cheap to unit-test (all 460 logic tests run in 0.2s) and costly to debug through a screen; the move keeps the path rule objective | n (shown in the audit report for review) |
| Critical modules (90% branch threshold) | `utils/money.ts`, `components/input/currencyDigits.ts`, `transactionForm.ts`, `categoryForm.ts`, `api/clients/findracoApi.ts` | An error there writes wrong data or drops the session without the user noticing; display errors are visible | y |
| A critical module loaded by an unrelated affected test | The affected run always includes the critical modules' own tests | Per-file coverage of a partly exercised critical module would fail the threshold for no defect | y (agent's discretion) |
| Version bump | No `1.0.0-beta.N` bump for this feature | Tests, CI and file moves change no behaviour the user sees | n |
| Approval of the cut | The audit cuts without waiting; the user reviews the committed report and cut afterwards | User (2026-10-20): "Já faz o processo todo, não quero validar nada"; git keeps every cut test | y |
| Push | Work lands on branch `test-calibration`, pushed so CI measures it (branches run CI, never deploy); merging to `main` is the user's | Pushing `main` deploys; blast-radius rule needs an explicit go-ahead | y |
| Flow vs E2E split | Revisit with a concrete example when the E2E work starts | User was still unsure why both exist; decided to move on | y (deferred) |

**Open questions:** none - all resolved or logged above.

---

## User Stories

### P1: Faster CI ⭐ MVP

**User Story**: As the developer, I want a frontend push to test only what it can break, in parallel, so that a push stops costing ~7 minutes.

**Why P1**: Cheap, independent of the calibration, and attacks the number seen on every push; most of the 247s is overhead, not test count.

**Acceptance Criteria**:

1. CIT-01: WHILE running on CI the Vitest config SHALL use a fixed `maxWorkers` number (not a percentage), the value chosen by measurement on the CI runner; local runs keep 25%. <!-- state-driven -->
2. CIT-02: WHEN a push changes frontend files and a usable base exists (the last green run on the branch, as the `changes` job computes it) THEN the frontend job SHALL run only the Vitest tests affected by the files changed since that base. <!-- event-driven -->
3. CIT-03: WHEN the diff since the base touches a force-rerun file (theme CSS, `vite.config.ts`, `src/test/**`, `.storybook/**`, `frontend/package.json`, `pnpm-lock.yaml`) THEN the frontend job SHALL run the full suite. <!-- event-driven -->
4. CIT-04: IF no usable base exists (manual dispatch, first run, force push) THEN the frontend job SHALL run the full suite. <!-- unwanted-behavior -->
5. CIT-05: WHEN the weekly schedule fires THEN the CI workflow SHALL run the full frontend suite on `main` and SHALL NOT deploy. <!-- event-driven -->
6. CIT-06: The frontend job SHALL run lint, build and `check-siblings` over the whole frontend on every run, affected-only or full. <!-- ubiquitous -->
7. CIT-07: WHILE a run is affected-only, the frontend job SHALL also run the critical modules' own tests, so the coverage threshold never measures a critical module from an unrelated test alone. <!-- state-driven -->
8. CIT-08: IF the scheduled full run fails THEN the workflow run SHALL end failed, which GitHub reports in the Actions tab and by its failed-run email. <!-- unwanted-behavior -->

**Independent Test**: Push a change to one logic module: the job log lists only that module's tests and the tests that import it. Push a change to `vite.config.ts`: the full suite runs. Trigger the workflow manually: the full suite runs. A full run's test step stays ≤ 120s.

---

### P2: The test table and the gates that enforce it

**User Story**: As the developer (and every agent writing code), I want a closed table that says which code gets which test and how much, so that what to test is a lookup, not a judgment call.

**Why P2**: The core of the calibration; the audit (P3) cuts against it.

**Acceptance Criteria**:

1. CAL-01: The `frontend-testing` skill and TESTING.md SHALL hold one closed table mapping each code kind, recognised by path and file name, to a test kind and an amount. <!-- ubiquitous -->
2. CAL-02: The table SHALL hold these rows: business rule (form schema and mapper, money, recurrence, split, pure computation under `utils/`) → unit, one case per rule the spec states plus the edges it names; service hook → unit through MSW, one per endpoint/mutation asserting method, URL, params/body and response mapping (plus the single 401 → refresh → retry test); URL params (`*Params.ts`) → unit, round trip plus an invalid value; shared hook (`src/hooks/**`) → unit through `renderHook`; feature hook → none of its own, covered by its container's flow; container → flow test (CAL-08); presentational component → story (CAL-06); `base/` primitive → catalog story only (CAL-07); tooling (local lint rules, gate scripts) → one valid and one invalid case per behaviour the rule promises; anything else (UI glue, simple formatting, wrappers) → none. <!-- ubiquitous -->
3. CAL-03: IF a module matches no row of the table THEN `check-siblings` SHALL NOT require a test for it. <!-- unwanted-behavior -->
4. CAL-04: WHEN a module matches a row whose test kind is unit THEN `check-siblings` SHALL fail naming that module if it has no sibling `.test.ts`. <!-- event-driven -->
5. CAL-05: The coverage gate SHALL apply the 90% per-file branch threshold only to the five critical modules (`utils/money.ts`, `components/input/currencyDigits.ts`, `transactionForm.ts`, `categoryForm.ts`, `api/clients/findracoApi.ts`) and SHALL fail no run on any other module's coverage. <!-- ubiquitous -->
6. CAL-06: A presentational component's story SHALL run as a test only when it shows a state the component handles in its own code (with data, empty, loading, error) or holds a `play` for the component's own interaction; every other story (variant showcase, extreme content, mobile viewport) SHALL carry the `!test` tag or be removed. <!-- ubiquitous -->
7. CAL-07: Every story under a `base/` folder SHALL carry the `!test` tag, stay visible in Storybook, and `check-siblings` SHALL NOT require a story for a `base/` component. <!-- ubiquitous -->
8. CAL-08: A flow test SHALL assert only container decisions: one happy submit asserting the full payload that reaches the network, an API failure, cancel, permission, and what happens after saving (navigation, toast, refetch); an assertion that depends only on a pure function's input and output SHALL live in that function's unit test, not in a flow test. <!-- ubiquitous -->
9. CAL-09: The table SHALL state that no test, in any layer, asserts library behaviour (Base UI, Tailwind, TanStack, react-hook-form, MSW). <!-- ubiquitous -->
10. CAL-10: The table SHALL state that, once E2E journeys exist, a happy path covered by an E2E journey gets no flow test of its own. <!-- ubiquitous -->

**Independent Test**: Run `check-siblings` against a scratch module per row: a business-rule module without a test fails, a glue `.ts` beside a component passes, a `base/` component without a story passes. Lower a critical module's coverage: `pnpm test` fails naming it; lower another module's: it passes. `vitest --project=storybook` lists no `base/` story and no `!test` story.

---

### P2: Process keeps the calibration

**User Story**: As the developer, I want the docs every agent reads to carry the table's consequences, so that the next feature does not rebuild the excess through the tlc skill.

**Why P2**: Without it the skill's defaults (existing tests as the floor, mutants on untested code, one test per AC) undo the calibration on the next feature.

**Acceptance Criteria**:

1. PROC-01: TESTING.md and the `frontend-testing` skill SHALL state that the table, not the existing tests, sets the floor and the ceiling of each layer's Test Coverage Matrix row. <!-- ubiquitous -->
2. PROC-02: CLAUDE.md and TESTING.md SHALL state that the Verifier's discrimination sensor mutates only code in a table row whose test kind is not none. <!-- ubiquitous -->
3. PROC-03: The `frontend-testing` skill SHALL state, for Specify, that a visual-only AC becomes a story or a named hand check and that an AC restating a rule already specified at another layer is not written. <!-- ubiquitous -->

**Independent Test**: Read the three documents: each rule is stated once in the place an agent loads at that step (matrix at Tasks, sensor at Verify, ACs at Specify).

---

### P3: Audit and cut the existing suite

**User Story**: As the developer, I want the current suite cut down to the table, with the numbers before and after, so that the suite matches the rule and I can see what the rule removed.

**Why P3**: Depends on the table (P2); the gain in volume is real but the CI gain mostly comes from P1.

**Acceptance Criteria**:

1. AUD-01: WHEN the audit runs THEN it SHALL produce a report listing every test file and story file with one verdict each (keep, cut, catalog, rewrite, move) and the table row or rule that justifies it. <!-- event-driven -->
2. AUD-02: The report SHALL give before and after numbers per test kind: tests, files, local wall time per Vitest project, and the CI test step time. <!-- ubiquitous -->
3. AUD-03: The audit SHALL commit the report before the cut, in its own commit, so the user can review report and cut afterwards and revert the cut alone. <!-- ubiquitous -->
4. AUD-04: WHEN a verdict is "rewrite" (a flow test repeating unit rules, per CAL-08) THEN the rewritten file SHALL keep every container decision the original asserted. <!-- event-driven -->
5. AUD-05: WHEN the approved cut lands THEN the full frontend gate (`pnpm lint && pnpm build && pnpm test`) SHALL pass. <!-- event-driven -->
6. AUD-06: IF the audit finds behaviour the table says to test and no test covers THEN the report SHALL list it as a follow-up, and the audit SHALL NOT write that test. <!-- unwanted-behavior -->

**Independent Test**: The report exists with a verdict per file and the numbers; the cut commit passes the full gate and the counts match the report.

---

## Edge Cases

- IF the changed files resolve to no affected test THEN the frontend job SHALL pass the test step without running any test file, while lint, build and `check-siblings` still run (CIT-06).
- IF a fixed worker count reproduces the `user-event` timeouts on CI THEN Design SHALL lower it, never add retries (TESTING.md: flaky tests are fixed at the cause).
- WHEN a catalog-only story stops rendering THEN no gate SHALL fail; this is the accepted cost of CAL-06 and CAL-07 (Out of Scope: `build-storybook` in CI).
- WHEN a module moves into a `utils/` folder during the audit THEN its sibling test SHALL move with it and keep passing.

---

## Implicit-Requirement Dimensions

| Dimension | Coverage |
| --- | --- |
| Input validation & bounds | N/A because the feature changes test selection and rules, not user input |
| Failure / partial-failure states | CIT-04 (no base → full), CIT-08 (scheduled failure), AUD-03 (no cut without approval), AUD-05 |
| Idempotency / retry / duplicate handling | N/A because CI runs are already idempotent; retries are forbidden by TESTING.md |
| Auth boundaries & rate limits | N/A because the workflow keeps its current permissions; the schedule deploys nothing (CIT-05) |
| Concurrency / ordering | Worker count (CIT-01); deploy ordering is unchanged |
| Data lifecycle / expiry | N/A because no data is stored |
| Observability | CIT-08 (GitHub's own failed-run report); more is out of scope |
| External-dependency failure | CIT-04 covers a missing base from the GitHub API |
| State-transition integrity | N/A because there are no states |

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
| --- | --- | --- | --- |
| CIT-01 | P1: Faster CI | Design | Pending |
| CIT-02 | P1: Faster CI | Design | Pending |
| CIT-03 | P1: Faster CI | Design | Pending |
| CIT-04 | P1: Faster CI | Design | Pending |
| CIT-05 | P1: Faster CI | Design | Pending |
| CIT-06 | P1: Faster CI | Design | Pending |
| CIT-07 | P1: Faster CI | Design | Pending |
| CIT-08 | P1: Faster CI | Design | Pending |
| CAL-01 | P2: Test table | Design | Pending |
| CAL-02 | P2: Test table | Design | Pending |
| CAL-03 | P2: Test table | Design | Pending |
| CAL-04 | P2: Test table | Design | Pending |
| CAL-05 | P2: Test table | Design | Pending |
| CAL-06 | P2: Test table | Design | Pending |
| CAL-07 | P2: Test table | Design | Pending |
| CAL-08 | P2: Test table | Design | Pending |
| CAL-09 | P2: Test table | Design | Pending |
| CAL-10 | P2: Test table | Design | Pending |
| PROC-01 | P2: Process | Design | Pending |
| PROC-02 | P2: Process | Design | Pending |
| PROC-03 | P2: Process | Design | Pending |
| AUD-01 | P3: Audit | Design | Pending |
| AUD-02 | P3: Audit | Design | Pending |
| AUD-03 | P3: Audit | Design | Pending |
| AUD-04 | P3: Audit | Design | Pending |
| AUD-05 | P3: Audit | Design | Pending |
| AUD-06 | P3: Audit | Design | Pending |

**Coverage:** 27 total, 0 mapped to tasks, 27 unmapped ⚠️ (tasks not written yet)

---

## Success Criteria

- [ ] CI test step on a full run ≤ 120s (baseline 247s, run 39360830629); typical affected-only push ≤ 60s.
- [ ] Test count and file count after the cut reported against the baseline: 1442 tests, 182 files (unit 86, storybook 92, tooling 4).
- [ ] The next feature after this one writes its Test Coverage Matrix straight from the table, with no test the table does not ask for.

## Baseline (measured 2026-10-20)

| Kind | Files | Tests | Summed file time (local) |
| --- | --- | --- | --- |
| Logic (`unit:logic`) | 37 | 460 | 0.2s |
| Stories outside `base/` | 63 | 323 | 31.8s |
| Tooling | 4 | 186 | 0.6s |
| Flows (`.test.tsx`) | 27 | 172 | 21.6s |
| Stories in `base/` | 29 | 142 | 9.7s |
| Service hooks | 13 | 113 | 4.0s |
| Hooks | 9 | 46 | 1.3s |

CI (4 vCPU, 1 worker): `unit` with coverage 175s (tests 34s, environment 57s, collect 52s); `tooling` + `storybook` 65s. Local (20 cores, 5 workers): `unit` with coverage 29.6s, without 22.8s; `storybook` 15.1s; `tooling` 1.3s.
