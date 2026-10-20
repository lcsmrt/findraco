# Test Calibration Context

**Gathered:** 2026-10-20
**Spec:** `.specs/features/test-calibration/spec.md`
**Status:** Ready for design

---

## Feature Boundary

Frontend only: make CI test what a push can break, in parallel (P1); replace the content-based test rules with a closed table that the gates enforce (P2); write the table's consequences into the docs agents read (P2); audit and cut the current suite against the table, with the user approving the report first (P3).

---

## Implementation Decisions

### Method

- Measure first, then build the table from the data, then cut. "Junk" means what the table does not ask for.
- Measurement showed CI time and test volume are separate problems: CI time is overhead (one worker, per-file setup), volume is maintenance and token cost per feature.

### Scope

- Both fronts in one spec, as separate stories: CI time is P1 (cheap, independent), calibration P2/P3.
- Already done before this feature (2026-10-19): docs-only changes skip CI app jobs; per-app skip.

### Full-suite cadence

- Affected-only on every push; full suite weekly on `main` and on manual dispatch. User: "Relaxa. Semanal." One user today, observability comes later.

### What decides that code gets a test

- A closed table by code kind, recognised by path and file name. Anything outside the table gets no test, even with an `if`.

### Coverage threshold

- 90% per-file branches only on a named list of critical modules (the backend's JaCoCo model): `money.ts`, `currencyDigits.ts`, `transactionForm.ts`, `categoryForm.ts`, `findracoApi.ts`. Criterion: an error writes wrong data or drops the session silently. Display errors stay out.

### Stories

- `base/` stories: kept as catalog (the user wants the catalog), tagged `!test`, no gate demand.
- Other stories: a story runs as a test only for a state the component handles in its own code (data, empty, loading, error) or its own `play`; variants, extreme content and mobile are catalog or removed.
- Option "stories as tests only for screen Views" rejected on the data: `View` is everywhere (container/view split), so the boundary would need judgment, 28 non-View components handle their own states, and it saves only ~15-20s of CI over the chosen rule. Can move to it later by tags.

### Flow tests

- Only container decisions: happy submit with the full payload, API failure, cancel, permission, after-save behaviour. Value rules live in unit tests only (today `TransactionFormDrawer.test.tsx` repeats `transactionForm` rules through clicks).
- Future: a happy path covered by an E2E journey gets no flow test.

### Remaining rows (stated as assumptions, user did not object)

- Service hooks: one test per endpoint/mutation through MSW, plus the single refresh-interceptor test.
- Feature hooks: no `renderHook` test; covered by the container's flow. Shared hooks in `src/hooks/` keep unit tests.
- Tooling: one valid and one invalid case per behaviour a rule promises.

### Audit

- Mechanical cut by the table. User changed this (2026-10-20): run the whole process unattended, no validation stops; the report is committed before the cut and reviewed afterwards. A row that gives a wrong result is fixed in the table, not per item.
- General rule from the user: every test of library behaviour goes, in any layer.

### Process alignment (tlc skill)

- The skill is not in the way: its Test Coverage Matrix accepts `none`, Check C removes tests with no AC, Check D follows project guidelines.
- Three frictions, fixed in project docs (TESTING.md, `frontend-testing`, CLAUDE.md), never in the skill: existing tests as the floor; the mutation sensor on untested code; one test per AC making Specify the source of volume.

### Agent's Discretion

- Worker count on CI (measured).
- Making the affected run always include the critical modules' tests.
- Exact path/name patterns per table row (fixed in Design, visible in the audit report).

### Declined / Undiscussed Gray Areas → Assumptions

- Pure computation in `components/` moves to `utils/` and keeps its test (spec Assumptions, unconfirmed; shown in the audit report).
- No version bump (spec Assumptions, unconfirmed).

---

## Specific References

- Backend JaCoCo gate on three invariant classes: model for the critical-module list.
- `MainLayout.test.tsx`: model for a flow test (each test a screen decision, no value rules).
- ROADMAP todos "Frontend test audit & calibration" and "CI: run only affected tests" are this feature.

---

## Deferred Ideas

- Explain flow test vs E2E with a concrete example when E2E work starts (user still unsure why both exist).
- Story-as-test only for screen Views, if CI time from stories still bothers after P1.
- `build-storybook` in CI to catch broken catalog stories.
