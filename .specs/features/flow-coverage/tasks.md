# Flow Coverage Tasks

## Execution Protocol (MANDATORY -- do not skip)

Implement these tasks with the `tlc-spec-driven` skill: **activate it by name and follow its Execute flow and Critical Rules.** Do not search for skill files by filesystem path. The skill is the source of truth for the full flow (per-task cycle, sub-agent delegation, adequacy review, Verifier, discrimination sensor).

**If the skill cannot be activated, STOP and tell the user - do not proceed without it.**

---

**Design**: skipped (spec, Assumptions)
**Status**: In Progress (Phases 1-2 done)
**Branch**: `flow-coverage`. Pushing this branch is allowed (CI runs, nothing deploys). Never push `main`, never merge; the orchestrator merges after the Verifier.

---

## Test Coverage Matrix

> Generated from codebase, project guidelines, and spec. Guidelines found: `CLAUDE.md` (Frontend), `.claude/skills/frontend-testing/SKILL.md`, `.specs/codebase/TESTING.md`, `frontend/scripts/testTable.ts`, `frontend/vite.config.ts`, `.specs/features/test-calibration/audit.md`.

| Code Layer | Required Test Type | Coverage Expectation | Location Pattern | Run Command |
| ---------- | ------------------ | -------------------- | ---------------- | ----------- |
| Container (page, sheet, dialog, drawer) | flow | Each decision the spec names, through MSW only; no `vi.mock` of our modules | `<Container>.test.tsx` beside it | Quick |
| Presentational component | story `play` | The states the spec names; a11y clean | `<Component>.stories.tsx` | Full |
| Feature hook | none | Cut once its decisions are covered (FLOW-10) | - | - |
| Skills and docs | none | `Done when` checked against the spec | - | Docs |

## Gate Check Commands

> Run from `frontend/`.

| Gate Level | When to Use | Command |
| ---------- | ----------- | ------- |
| Docs | Skill and doc tasks | none; `Done when` checked against the spec |
| Quick | Tasks touching flow tests | `pnpm exec vitest related --run <changed files>` |
| Full | Tasks touching stories | `pnpm exec vitest run --project=storybook <story file>` plus Quick |
| Build | Last task of each phase | `pnpm lint && pnpm build && pnpm test` |

---

## Execution Plan

Phases are ordered and run sequentially - each phase completes before the next begins, and tasks within a phase execute in order.

### Phase 1: Guards, AuthProvider, DatePicker

```
T1 → T2 → T3 → T4
```

### Phase 2: Category, Overview and plan flows

```
T5 → T6 → T7
```

### Phase 3: Transactions flows and the report

```
T8 → T9 → T10 → T11 → T12
```

---

## Task Breakdown

### T1: The table states provider guards get no test

**What**: In the `frontend-testing` skill's table and in `.specs/codebase/TESTING.md`, state that a provider guard (the throw when a hook is used outside its provider) gets no test, with the reason (developer-only, fails on first render in dev, never reaches users).
**Where**: `.claude/skills/frontend-testing/SKILL.md` (and `.specs/codebase/TESTING.md`)
**Depends on**: None
**Reuses**: the table's existing "no test" wording
**Requirement**: FLOW-11

**Tools**: MCP: NONE · Skill: `frontend-testing`

**Done when**:

- [x] Both docs state it in one line each, in the table's own style

**Tests**: none
**Gate**: docs
**Commit**: `docs(testing): provider guards get no test`

---

### T2: Remove the provider guard tests

**What**: Remove the "must be used within" cases of `useAuth`, `usePlanContext`, `useTheme`, `useConfirm`, `useSeriesScope`, `useCategoryFormSheet`; delete each file left with zero cases.
**Where**: `frontend/src/app/providers/useAuth.test.tsx` (and the five other guard test files)
**Depends on**: T1
**Reuses**: -
**Requirement**: FLOW-12

**Tools**: MCP: NONE · Skill: `frontend-testing`

**Done when**:

- [x] `grep -r "must be used within" src --include=*.test.*` finds nothing
- [x] `node scripts/check-siblings.ts` passes

**Tests**: none (removal)
**Gate**: quick
**Commit**: `test(providers): drop provider guard tests`

---

### T3: AuthProvider flow test

**What**: `git mv` `useAuthSession.test.tsx` to `AuthProvider.test.tsx`; rename its `describe` to the provider; cases unchanged.
**Where**: `frontend/src/app/providers/AuthProvider.test.tsx`
**Depends on**: T2
**Reuses**: the existing 13 cases
**Requirement**: FLOW-13

**Tools**: MCP: NONE · Skill: `frontend-testing`

**Done when**:

- [x] 13 cases pass under the new name
- [x] Gate check passes: Quick

**Tests**: flow
**Gate**: quick
**Commit**: `test(auth): authprovider flow test by its name`

---

### T4: DatePicker form wiring in its story

**What**: Add a story whose render holds a required DatePicker in a react-hook-form + zod form, with `play` checks: empty submit focuses the input (FLOW-01), blur marks it touched as the component shows it (FLOW-02), a typed date reaches the submitted value (FLOW-03).
**Where**: `frontend/src/components/input/DatePicker.stories.tsx`
**Depends on**: T3
**Reuses**: other stories with a form wrapper and `play` (e.g. CurrencyInput, if present); `FormField`
**Requirement**: FLOW-01, FLOW-02, FLOW-03

**Tools**: MCP: NONE · Skill: `frontend-testing`, `form-creation`

**Done when**:

- [x] Each `play` check fails when its wiring is broken (checked by a temporary mutation, reverted)
- [x] Gate check passes: Build (phase end)

**Tests**: story
**Gate**: build
**Commit**: `test(input): datepicker form wiring in its story`

---

### T5: Category sheet failure flow

**What**: Add the API-failure case to `CategoryFormSheet.test.tsx` (sheet stays open with typed values, no success toast); cut `useCategoryFormSubmit.test.ts` per FLOW-10 with its row in `audit.md` citing `file:line`.
**Where**: `frontend/src/features/categories/components/CategoryFormSheet.test.tsx`
**Depends on**: None (runs after Phase 1)
**Reuses**: MSW handler factories of the categories service
**Requirement**: FLOW-04, FLOW-10

**Tools**: MCP: NONE · Skill: `frontend-testing`

**Done when**:

- [x] Failure case passes; hook test cut or reduced per FLOW-10
- [x] Gate check passes: Quick

**Tests**: flow
**Gate**: quick
**Commit**: `test(categories): sheet failure flow replaces hook test`

---

### T6: Overview flow test

**What**: Create `OverviewPage.test.tsx`: choosing a member sends that member on the summary and trend requests, and the trend request is the per-member one; cut `useOverviewMemberFilter.test.tsx` and `useOverviewTrend.test.ts` per FLOW-10.
**Where**: `frontend/src/features/overview/OverviewPage.test.tsx`
**Depends on**: T5
**Reuses**: `TransactionsPage.test.tsx` setup (providers, MSW)
**Requirement**: FLOW-05, FLOW-10

**Tools**: MCP: NONE · Skill: `frontend-testing`

**Done when**:

- [x] Flow passes; hook tests cut or reduced per FLOW-10
- [x] Gate check passes: Quick

**Tests**: flow
**Gate**: quick
**Commit**: `test(overview): member filter flow replaces hook tests`

---

### T7: Plan dialogs cancel and failure

**What**: Add cancel (no request, dialog closes) and failure (dialog stays open with values) cases to `PlanNameDialog.test.tsx` and `InvitePlanDialog.test.tsx`; cut `usePlanNameSubmit.test.ts` per FLOW-10.
**Where**: `frontend/src/features/plans/components/PlanNameDialog.test.tsx` (and `InvitePlanDialog.test.tsx`)
**Depends on**: T6
**Reuses**: existing cases in both files
**Requirement**: FLOW-06, FLOW-07, FLOW-10

**Tools**: MCP: NONE · Skill: `frontend-testing`

**Done when**:

- [x] New cases pass; hook test cut per FLOW-10
- [x] Gate check passes: Build (phase end)

**Tests**: flow
**Gate**: build
**Commit**: `test(plans): dialog cancel and failure flows`

---

### T8: Transactions CSV import flow

**What**: Add a CSV import case to `TransactionsPage.test.tsx` (file reaches the network, result shown); cut `useCsvImport.test.ts` per FLOW-10.
**Where**: `frontend/src/features/transactions/TransactionsPage.test.tsx`
**Depends on**: None (runs after Phase 2)
**Reuses**: the file's setup; transactions MSW handlers
**Requirement**: FLOW-08, FLOW-10

**Tools**: MCP: NONE · Skill: `frontend-testing`

**Done when**:

- [ ] Import case passes; hook test cut or reduced per FLOW-10
- [ ] Gate check passes: Quick

**Tests**: flow
**Gate**: quick
**Commit**: `test(transactions): csv import flow`

---

### T9: Transactions series-delete scope flow

**What**: Add series-delete scope cases (each scope reaching the network, cancel sending nothing) to `TransactionsPage.test.tsx`; cut or reduce `useTransactionActions.test.tsx` per FLOW-10.
**Where**: `frontend/src/features/transactions/TransactionsPage.test.tsx`
**Depends on**: T8
**Reuses**: existing edit/duplicate/delete cases
**Requirement**: FLOW-08, FLOW-10

**Tools**: MCP: NONE · Skill: `frontend-testing`

**Done when**:

- [ ] Scope cases pass; hook test cut or reduced per FLOW-10
- [ ] Gate check passes: Quick

**Tests**: flow
**Gate**: quick
**Commit**: `test(transactions): series delete scope flow`

---

### T10: Transactions filters flow

**What**: Add to `TransactionsPage.test.tsx`: active filters shown as chips, removing a chip clears its filter, a filter change resets to the first page, clear all; cut or reduce `useTransactionFilterChips`, `useTransactionFilters`, `useTransactionSearch`, `useTransactionsPage` tests per FLOW-10.
**Where**: `frontend/src/features/transactions/TransactionsPage.test.tsx`
**Depends on**: T9
**Reuses**: existing search case
**Requirement**: FLOW-08, FLOW-10

**Tools**: MCP: NONE · Skill: `frontend-testing`

**Done when**:

- [ ] Filter cases pass; hook tests cut or reduced per FLOW-10
- [ ] Gate check passes: Quick

**Tests**: flow
**Gate**: quick
**Commit**: `test(transactions): filter chips, page reset and clear flows`

---

### T11: Series edit scope flow

**What**: Add series-edit scope cases to `TransactionFormDrawer.test.tsx` (chosen scope reaches the network); cut or reduce `useTransactionFormSubmit.test.ts` per FLOW-10.
**Where**: `frontend/src/features/transactions/components/TransactionFormDrawer.test.tsx`
**Depends on**: T10
**Reuses**: existing drawer cases
**Requirement**: FLOW-09, FLOW-10

**Tools**: MCP: NONE · Skill: `frontend-testing`

**Done when**:

- [ ] Scope cases pass; hook test cut or reduced per FLOW-10
- [ ] Gate check passes: Quick

**Tests**: flow
**Gate**: quick
**Commit**: `test(transactions): series edit scope flow`

---

### T12: Audit report closes F1–F7

**What**: In `test-calibration/audit.md`, mark F1–F7 resolved, each row with its covering `file:line` or why a hook test stays; report feature-hook test count before → after.
**Where**: `.specs/features/test-calibration/audit.md`
**Depends on**: T11
**Reuses**: the existing Follow-ups section
**Requirement**: FLOW-10

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [ ] Every F1–F7 marked; counts reported
- [ ] Gate check passes: Build (phase end)

**Tests**: none
**Gate**: build
**Commit**: `docs(test-calibration): follow-ups f1-f7 resolved`
