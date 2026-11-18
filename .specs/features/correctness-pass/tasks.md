# Correctness Pass Tasks

## Execution Protocol (MANDATORY -- do not skip)

Implement these tasks with the `tlc-spec-driven` skill: **activate it by name and follow its Execute flow and Critical Rules.** Do not search for skill files by filesystem path. The skill is the source of truth for the full flow (per-task cycle, sub-agent delegation, the walk, check_proofs, the Verifier and the screens sub-agent).

**If the skill cannot be activated, STOP and tell the user - do not proceed without it.**

---

**Design**: none - fixes inside existing modules, no new pattern (spec Assumptions name each cause)
**Status**: Approved
**Approved**: 2026-11-18 - user: "Consegue seguir com design e tasks e execução disso aqui sozinho? Em seguida, escolher adequadamente entre lean e sdd e continuar com a fase 1. Sozinho, sem me chamar pra nada, até 9 da manhã"
**Build**: cd frontend && pnpm lint; cd frontend && pnpm build; cd frontend && node scripts/check-siblings.ts
**Run unit**: cd frontend && pnpm exec vitest run --project=unit --reporter=verbose src/app/providers/PlanProvider.test.tsx src/app/routing/PlanFiltersGate.test.tsx src/features/overview/utils/summaryView.test.ts src/features/transactions/components/transactionForm.test.ts src/features/transactions/components/TransactionFormDrawer.test.tsx src/utils/periodParams.test.ts src/features/overview/OverviewPage.test.tsx src/features/transactions/TransactionsPage.test.tsx src/features/overview/utils/spendingRows.test.ts
**Run stories**: cd frontend && pnpm exec vitest run --project=storybook --reporter=verbose src/features/overview/components/SummaryCards.stories.tsx src/components/input/DatePicker.stories.tsx src/features/transactions/components/TransactionMobileList.stories.tsx src/components/table/TablePagination.stories.tsx

> Unattended run (user, 2026-11-18): tasks were approved in advance with the spec; the user reviews after the build.

---

## Test Coverage Matrix

> Generated from codebase, project guidelines, and spec. Guidelines found: `CLAUDE.md` (Frontend), `.claude/skills/frontend-testing/SKILL.md`, `frontend/scripts/testTable.ts`. Lean per the user's rule: test what would really break, no repeats across layers.

| Code Layer | Required Test Type | Coverage Expectation | Location Pattern | Run Command |
| ---------- | ------------------ | -------------------- | ---------------- | ----------- |
| Pure computation (`utils/*.ts`, feature `utils/`) | unit | 1:1 to the ACs it decides | sibling `*.test.ts` | Run unit |
| URL params (`*Params.ts`) | unit | Each AC and the boundary between preset and custom | sibling `*.test.ts` | Run unit |
| Form module (`transactionForm.ts`, critical) | unit | Each AC; keeps the 90% branch threshold | sibling `*.test.ts` | Run unit |
| Providers and containers (`PlanProvider`, `OverviewPage`, `TransactionsPage`, `TransactionFormDrawer`) | flow (`renderWithProviders`, MSW only, no `vi.mock` of our modules) | The decisions the task adds | sibling `*.test.tsx` | Run unit |
| Presentational (`SummaryCards`, `DatePicker`, `TransactionMobileList`, `TablePagination`) | story with `play` (a11y in error mode) | The state the AC names | sibling `*.stories.tsx` | Run stories |
| i18n copy | none | parity check in lint/build | - | Build |

## Gate Check Commands

> Run from `frontend/`. Per task: only the affected test files. Full gate once at each phase end.

| Gate Level | When to Use | Command |
| ---------- | ----------- | ------- |
| Quick | Tasks with unit, flow or story tests | `pnpm exec vitest run --project=unit <affected test files>` and/or `pnpm exec vitest run --project=storybook <affected story files>` |
| Full | n/a: each task runs its own files | - |
| Build | Last task of each phase | `pnpm lint && pnpm build && pnpm test` |

---

## Execution Plan

### Phase 1: Plan, summary and form

```
T1 → T2 → T3 → T4 → T5 → T6
```

### Phase 2: Period, lists and limits

```
T7 → T8 → T9 → T10 → T11 → T12
```

---

## Task Breakdown

### T1: Keep the linked plan on reload and on a link after sign-in

**What**: `PlanProvider` stops clearing the stored active plan while the session is still restoring (clear only when the session is known to be signed out), and the default-plan fallback no longer overwrites a plan the gate is switching to, so `/overview?plan=<non-default>` renders that plan on reload and after sign-in. Add `app/providers/PlanProvider.test.tsx` (flow, real `AuthProvider` + `PlanProvider` + `PlanFiltersGate` under `renderWithProviders`/MSW, a probe child reading `usePlanContext().activePlan?.name`).
**Where**: `frontend/src/app/providers/PlanProvider.tsx` (and `app/routing/PlanFiltersGate.tsx` only if the fix needs it)
**Depends on**: None
**Reuses**: `useAuth().status` (`loading` / `authenticated` / unauthenticated values in `useAuthSession.ts`), the MSW handlers of the plan and auth services
**Requirement**: FIX-01

**Done when**:

- [ ] Tests named as in C1–C3 pass; the existing `PlanFiltersGate.test.tsx` suite still passes unchanged (C4)
- [ ] Gate check passes: Quick

**Tests**: unit
**Gate**: quick

**Commit**: `fix(frontend): keep the linked plan on reload`

---

### T2: Per-person legend on the actual basis

**What**: In `summaryView`, segment amounts and widths come from `actualIncome` / `actualExpense`, widths relative to the plan's actual total; members with an actual amount of zero are omitted. Headline `total`/`actual` unchanged.
**Where**: `frontend/src/features/overview/utils/summaryView.ts`
**Depends on**: T1
**Reuses**: existing `summaryView.test.ts` fixtures (update the cases that asserted forecast segments to the spec's basis)
**Requirement**: FIX-02

**Done when**:

- [ ] Tests named as in C5–C6 pass
- [ ] Gate check passes: Quick

**Tests**: unit
**Gate**: quick

**Commit**: `fix(frontend): show each member's actual amount under the summary`

---

### T3: Relabel the balance card

**What**: `overview.balance.balance` becomes "Net" (en) and "Resultado" (pt-BR); the `WithForecast` story's `play` asserts the "Net" label.
**Where**: `frontend/src/i18n/en.json` (and `pt-BR.json`, the same key)
**Depends on**: T2
**Reuses**: `SummaryCards.stories.tsx` `WithForecast`
**Requirement**: FIX-03

**Done when**:

- [ ] C7 and C8 pass
- [ ] Gate check passes: Quick (stories)

**Tests**: story
**Gate**: quick

**Commit**: `fix(frontend): call the income minus expenses card net`

---

### T4: "Outra pessoa" preselects and requires a person

**What**: `participantsForMode("SOMEONE", …)` keeps an other member already chosen, otherwise returns the first member other than the current user (in `members` order); the schema rejects `attributionMode: "SOMEONE"` with no participant, error on `participants` with the new key `transactions.transactionForm.choosePerson` ("Choose the person" / "Escolha a pessoa").
**Where**: `frontend/src/features/transactions/components/transactionForm.ts`
**Depends on**: T3
**Reuses**: the SPLIT refinement in the same `superRefine`, `transactionForm.test.ts`
**Requirement**: FIX-04

**Done when**:

- [ ] Tests named as in C9–C11 pass; critical branch threshold still met (`pnpm exec vitest run --project=critical --coverage`)
- [ ] Gate check passes: Quick

**Tests**: unit
**Gate**: quick

**Commit**: `fix(frontend): require the person when attributing to someone else`

---

### T5: Required date picker without a clear button

**What**: `DatePicker` gets a `required` prop: no clear button, and committing an empty text restores the current value's text instead of calling `onChange(undefined)`. Optional pickers keep today's behaviour. Stories `RequiredRestoresDate` and `OptionalClears` with `play`.
**Where**: `frontend/src/components/input/DatePicker.tsx`
**Depends on**: T4
**Reuses**: `DatePicker.stories.tsx` `WithValue` args
**Requirement**: FIX-05

**Done when**:

- [ ] Stories named as in C13–C14 pass
- [ ] Gate check passes: Quick (stories)

**Tests**: story
**Gate**: quick

**Commit**: `fix(frontend): keep a required date when its text is erased`

---

### T6: Transaction date uses the required picker

**What**: The transaction date field in `TransactionFormDrawer` passes `required` and drops the `date && …` workaround comment that the picker now owns; flow test asserts no clear button on the date field.
**Where**: `frontend/src/features/transactions/components/TransactionFormDrawer.tsx`
**Depends on**: T5
**Reuses**: `TransactionFormDrawer.test.tsx` setup
**Requirement**: FIX-05

**Done when**:

- [ ] Test named as in C12 passes
- [ ] Gate check passes: Build (last task of Phase 1)

**Tests**: unit
**Gate**: build

**Commit**: `fix(frontend): drop the clear button from the transaction date`

---

### T7: Arrow ranges that equal a preset become the preset

**What**: Add `selectionForRange(range, now): PeriodSelection` to `utils/periodParams.ts`: a range equal to `resolvePeriodDates(p, now)` for a preset `p` returns `{ period: p, customRange: null }`; any other range returns it as `customRange`.
**Where**: `frontend/src/utils/periodParams.ts`
**Depends on**: None (Phase 1 done)
**Reuses**: `resolvePeriodDates`, `PERIODS`
**Requirement**: FIX-06

**Done when**:

- [ ] Tests named as in C15–C17 pass
- [ ] Gate check passes: Quick

**Tests**: unit
**Gate**: quick

**Commit**: `fix(frontend): store an arrow range that matches a preset as the preset`

---

### T8: Overview arrows use the preset normalisation

**What**: `OverviewPage`'s arrow handler stores `selectionForRange(next, today)`; the calendar's custom pick stays a custom range (spec edge case). Flow test: ‹ then › leaves no `period=custom` in the URL.
**Where**: `frontend/src/features/overview/OverviewPage.tsx`
**Depends on**: T7
**Reuses**: `OverviewPage.test.tsx` setup
**Requirement**: FIX-06

**Done when**:

- [ ] Test named as in C18 passes
- [ ] Gate check passes: Quick

**Tests**: unit
**Gate**: quick

**Commit**: `fix(frontend): return the overview to this month through the arrows`

---

### T9: Transactions arrows use the preset normalisation

**What**: `useTransactionPeriod`'s arrow handler stores `selectionForRange(next, today)` (split the arrow path from the calendar path if they share `onRangeChange`); flow test in `TransactionsPage.test.tsx`.
**Where**: `frontend/src/features/transactions/useTransactionPeriod.ts`
**Depends on**: T8
**Reuses**: `TransactionsPage.test.tsx` setup
**Requirement**: FIX-06

**Done when**:

- [ ] Test named as in C19 passes
- [ ] Gate check passes: Quick

**Tests**: unit
**Gate**: quick

**Commit**: `fix(frontend): return transactions to this month through the arrows`

---

### T10: Series marker on phone rows

**What**: `TransactionMobileRow` shows the same series marker the desktop description cell shows (`RepeatIcon` + `transactions.descriptionCell.series`) when `transaction.seriesId` is set; story `SeriesRow` with `play`.
**Where**: `frontend/src/features/transactions/components/TransactionMobileList.tsx`
**Depends on**: T9
**Reuses**: the marker markup in `TransactionCells.tsx:362-366`
**Requirement**: FIX-07

**Done when**:

- [ ] Story named as in C20 passes
- [ ] Gate check passes: Quick (stories)

**Tests**: story
**Gate**: quick

**Commit**: `fix(frontend): mark series rows on the phone list`

---

### T11: No pager for an empty list

**What**: `TablePagination` renders nothing when `totalElements` is 0 (phone and desktop share it); its `Empty` story's `play` asserts no pager.
**Where**: `frontend/src/components/table/TablePagination.tsx`
**Depends on**: T10
**Reuses**: `TablePagination.stories.tsx` `Empty`
**Requirement**: FIX-07

**Done when**:

- [ ] Story named as in C21 passes
- [ ] Gate check passes: Quick (stories)

**Tests**: story
**Gate**: quick

**Commit**: `fix(frontend): hide the pager on an empty list`

---

### T12: Limit percent never contradicts the remaining amount

**What**: `usageOf` keeps `Math.round` but caps the percent at 99 while status is not OVER and `remaining > 0`, and floors it at 101 while OVER.
**Where**: `frontend/src/features/overview/utils/spendingRows.ts`
**Depends on**: T11
**Reuses**: `spendingRows.test.ts`
**Requirement**: FIX-08

**Done when**:

- [ ] Tests named as in C22–C23 pass
- [ ] Gate check passes: Build (last task)

**Tests**: unit
**Gate**: build

**Commit**: `fix(frontend): keep the limit percent consistent with what remains`

---

## Checks

**C1** - Reloading `/overview?plan=3` (member of plans 1 default and 3, session restoring) renders the screen for plan 3 and the active plan's name is plan 3's (FIX-01, AC 1)
Proof: run unit | ✓ PlanProvider > reloading a link to a non-default plan renders that plan

**C2** - Signing in from signed out, then opening `/overview?plan=3`, renders plan 3 (FIX-01, AC 2)
Proof: run unit | ✓ PlanProvider > a link to a non-default plan opened after sign-in renders that plan

**C3** - While the session status is `loading`, the stored `activePlanId` stays in storage and in context (FIX-01, AC 3)
Proof: run unit | ✓ PlanProvider > keeps the stored active plan while the session is restoring

**C4** - A link to a plan the user does not belong to redirects to the active plan's saved state (FIX-01, AC 4)
Proof: run unit | ✓ PlanFiltersGate > restores the active plan's state for a link to a plan the user does not belong to, never applying its ids

**C5** - Expenses segments carry each member's `actualExpense` (and Income `actualIncome`), widths as a share of the plan's actual total, so they sum to the headline (FIX-02, AC 1)
Proof: run unit | ✓ summaryView > member segments use actual amounts relative to the plan's actual total

**C6** - A member with actual 0 and forecast > 0 has no segment (FIX-02, AC 2)
Proof: run unit | ✓ summaryView > omits a member whose actual amount is zero

**C7** - The income − expenses card is labelled "Net" in en (FIX-03, AC 3)
Proof: run stories | ✓ SummaryCards.stories.tsx > With Forecast

**C8** - The pt-BR label is "Resultado" (FIX-03, AC 3)
Proof: grep -q '"balance": "Resultado"' frontend/src/i18n/pt-BR.json

**C9** - Switching from "Eu" to "Outra pessoa" in a plan with members [me, Marina, Bruno] selects Marina (FIX-04, AC 1)
Proof: run unit | ✓ participantsForMode > preselects the first other member for someone else

**C10** - Switching from "Dividir" with [me, Bruno] to "Outra pessoa" keeps Bruno (FIX-04, AC 1)
Proof: run unit | ✓ participantsForMode > keeps an other member already chosen for someone else

**C11** - "Outra pessoa" with no participant fails validation on `participants` with the choose-the-person message (FIX-04, AC 2)
Proof: run unit | ✓ transactionFormSchema > someone else without a person is invalid with the choose-the-person message

**C12** - The transaction form's date field shows no clear button (FIX-05, AC 3)
Proof: run unit | ✓ TransactionFormDrawer > the date field has no clear button

**C13** - A required picker holding 14/03/2026: erase the text and blur → the field shows 14/03/2026 again and `onChange` was not called with undefined (FIX-05, AC 4)
Proof: run stories | ✓ DatePicker.stories.tsx > Required Restores Date

**C14** - An optional picker holding a date: the clear button empties the field and the value (FIX-05, AC 5)
Proof: run stories | ✓ DatePicker.stories.tsx > Optional Clears

**C15** - Ranges equal to This month, Last 3 months, Last 6 months and This year at `now` become those presets with no custom range (FIX-06, AC 1)
Proof: run unit | ✓ selectionForRange > a range equal to a preset's range becomes that preset

**C16** - A range one month back from this month stays a custom range with its dates (FIX-06, AC 2)
Proof: run unit | ✓ selectionForRange > a range equal to no preset stays a custom range

**C17** - The preset from C15 resolved at a date in the next month gives the next month's range (FIX-06, AC 3)
Proof: run unit | ✓ selectionForRange > a preset reached by the arrows resolves against a later date

**C18** - On the Overview, ‹ then › leaves the URL without `period=custom` (FIX-06, AC 1)
Proof: run unit | ✓ OverviewPage > previous then next arrow returns to this month as a preset

**C19** - On Transactions, ‹ then › leaves the URL without `period=custom` (FIX-06, AC 1)
Proof: run unit | ✓ TransactionsPage > previous then next arrow returns to this month as a preset

**C20** - A phone row with a `seriesId` shows the "Series" marker (FIX-07, AC 1)
Proof: run stories | ✓ TransactionMobileList.stories.tsx > Series Row

**C21** - With `totalElements` 0 the pager renders nothing (FIX-07, AC 2)
Proof: run stories | ✓ TablePagination.stories.tsx > Empty

**C22** - `percentUsed` 99.9 with remaining 1.22 shows 99 (FIX-08, AC 3)
Proof: run unit | ✓ usageOf > caps the percent at 99 while money remains

**C23** - OVER with `percentUsed` 100.2 shows 101 (FIX-08, AC 4)
Proof: run unit | ✓ usageOf > shows at least 101 percent while over

---

## Handoff

**Settled mid-build:** none
**Dispatched:** worker A (Phase 1, T1–T6, Sonnet) at ed264208+tasks commit
**Walked:** not yet

---

## Phase Execution Map

```
Phase 1 → Phase 2

Phase 1:  T1 → T2 → T3 → T4 → T5 → T6
Phase 2:  T7 → T8 → T9 → T10 → T11 → T12
```
