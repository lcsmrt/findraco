# Flow Coverage Specification

## Problem Statement

The test-calibration audit (`.specs/features/test-calibration/audit.md`, follow-ups F1–F7) left container decisions tested only in feature-hook tests, which the table says get no test of their own, and one gap: `DatePicker.test.tsx` was cut before its form wiring moved to a story. This feature moves each decision to the layer the table names (flow test or story `play`), then cuts the hook tests that become redundant, and settles the provider-guard tests.

## Goals

- [ ] Every decision listed in F3–F7 is asserted in a flow test or a story `play`, and the feature-hook tests they replace are cut.
- [ ] The table says what provider guards get (nothing), and the guard tests are gone.

## Out of Scope

| Feature | Reason |
| --- | --- |
| New behaviour or production code changes | Tests only; a production change found necessary is reported, not made |
| E2E journeys | Blocked by the local Docker database |
| Other audit rows | Only F1–F7 |

---

## Assumptions & Open Questions

| Assumption / decision | Chosen default | Rationale | Confirmed? |
| --- | --- | --- | --- |
| Provider guards (`throw` outside the provider) | No test; the table states it | The guard only helps developers, fails on first render in dev, never reaches users | y (user, 2026-10-20) |
| A hook test whose decision no flow can reach after this feature | Kept, listed in `audit.md` | Same rule as test-calibration: cut only with a cited covering test | y |
| Version bump | None | Tests and docs only; no behaviour ships | y (test-calibration precedent) |
| Design phase | Skipped | No new pattern: flow tests follow `MainLayout.test.tsx` / `TransactionFormDrawer.test.tsx`, stories follow the story checklist | y |

**Open questions:** none - all resolved or logged above.

---

## User Stories

### P1: DatePicker form wiring is tested again ⭐ MVP

**User Story**: As the developer, I want the DatePicker's form wiring covered by its story, so that the gap left by cutting `DatePicker.test.tsx` closes.

**Why P1**: Today nothing tests it.

**Acceptance Criteria**:

1. FLOW-01: WHEN a form holding a required DatePicker is submitted empty THEN the story's `play` SHALL find the DatePicker's input focused.
2. FLOW-02: WHEN the DatePicker's input loses focus THEN the story's `play` SHALL find the field marked touched (its touched-dependent state rendered, as the component shows it).
3. FLOW-03: WHEN a date is typed into the DatePicker THEN the story's `play` SHALL find that date in the form's submitted value.

**Independent Test**: `pnpm exec vitest run --project=storybook src/components/input/DatePicker.stories.tsx` runs the three `play` checks.

---

### P1: Container decisions live in flow tests

**User Story**: As the developer, I want each container decision asserted in its screen's flow test, so that the feature-hook tests that hold them today can go.

**Why P1**: The bulk of the follow-ups; the table's rule for containers.

**Acceptance Criteria**:

1. FLOW-04: IF saving a category fails THEN `CategoryFormSheet.test.tsx` SHALL assert the sheet stays open with the typed values and no success toast shows. (F4)
2. FLOW-05: WHEN a member is chosen in the Overview's member filter THEN a new `OverviewPage` flow test SHALL assert the summary and trend requests carry that member, and the trend request is the per-member one. (F5)
3. FLOW-06: WHEN Cancel is chosen in `PlanNameDialog` or `InvitePlanDialog` THEN their flow tests SHALL assert nothing reaches the network and the dialog closes. (F6)
4. FLOW-07: IF the request of `PlanNameDialog` or `InvitePlanDialog` fails THEN their flow tests SHALL assert the dialog stays open with its values. (F6)
5. FLOW-08: `TransactionsPage.test.tsx` SHALL assert: a CSV import reaching the network and its result shown; the series-delete scope choice reaching the network; the active filters shown as chips and a chip's removal clearing that filter; the page resetting to the first page when a filter changes; clearing all filters. (F7)
6. FLOW-09: WHEN a series transaction is edited THEN `TransactionFormDrawer.test.tsx` SHALL assert the chosen series scope reaches the network. (F7)
7. FLOW-10: WHEN every decision a feature-hook test asserts is covered by a flow test or a unit test (cited `file:line` in `audit.md`) THEN that hook test SHALL be cut; IF one decision stays uncovered THEN the hook test SHALL keep only the uncovered cases and `audit.md` SHALL list it. Hook tests in scope: `useCategoryFormSubmit`, `useOverviewMemberFilter`, `useOverviewTrend`, `usePlanNameSubmit`, `useCsvImport`, `useTransactionActions`, `useTransactionFormSubmit`, `useTransactionSearch`, `useTransactionFilters`, `useTransactionFilterChips`, `useTransactionsPage`.

**Independent Test**: The quick gate passes; each cut row in `audit.md` cites its covering flow assertion.

---

### P2: Provider guards and the AuthProvider flow

**User Story**: As the developer, I want the table to settle provider guards and the AuthProvider tests to sit where the table expects them.

**Why P2**: Cleanup; nothing is unprotected today.

**Acceptance Criteria**:

1. FLOW-11: The `frontend-testing` skill's table and TESTING.md SHALL state that a provider guard (the throw when a hook is used outside its provider) gets no test. (F1)
2. FLOW-12: The guard tests of `useAuth`, `usePlanContext`, `useTheme`, `useConfirm`, `useSeriesScope` and `useCategoryFormSheet` SHALL be removed (the last one found while writing tasks; same guard). (F1)
3. FLOW-13: The AuthProvider tests SHALL live in `AuthProvider.test.tsx` beside `AuthProvider.tsx`, with the same cases `useAuthSession.test.tsx` holds today. (F2)

**Independent Test**: No `*.test.*` asserts "must be used within"; `AuthProvider.test.tsx` exists with 13 cases.

---

## Edge Cases

- IF a flow decision cannot be reached without a production change THEN the worker SHALL report it and keep the hook test (Out of Scope).
- WHEN a hook test file ends with zero cases THEN the file SHALL be deleted.

---

## Implicit-Requirement Dimensions

Remaining dimensions N/A for this scope: the feature changes tests and docs only.

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
| --- | --- | --- | --- |
| FLOW-01 | P1: DatePicker | Tasks | Pending |
| FLOW-02 | P1: DatePicker | Tasks | Pending |
| FLOW-03 | P1: DatePicker | Tasks | Pending |
| FLOW-04 | P1: Flows | Tasks | Pending |
| FLOW-05 | P1: Flows | Tasks | Pending |
| FLOW-06 | P1: Flows | Tasks | Pending |
| FLOW-07 | P1: Flows | Tasks | Pending |
| FLOW-08 | P1: Flows | Tasks | Pending |
| FLOW-09 | P1: Flows | Tasks | Pending |
| FLOW-10 | P1: Flows | Tasks | Pending |
| FLOW-11 | P2: Guards | Tasks | Pending |
| FLOW-12 | P2: Guards | Tasks | Pending |
| FLOW-13 | P2: Guards | Tasks | Pending |

**Coverage:** 13 total, 0 mapped to tasks, 13 unmapped ⚠️ (tasks not written yet)

---

## Success Criteria

- [ ] F1–F7 marked resolved in `audit.md`, each with its covering test or the reason a hook test stays.
- [ ] Feature-hook test count reported before → after.
