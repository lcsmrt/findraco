# Actual vs Forecast (Recurrence v3) Tasks

## Execution Protocol (MANDATORY -- do not skip)

Implement these tasks with the `tlc-spec-driven` skill: **activate it by name and follow its Execute flow and Critical Rules.** Do not search for skill files by filesystem path. The skill is the source of truth for the full flow (per-task cycle, sub-agent delegation, the walk, check_proofs, the Verifier and the screens sub-agent).

**If the skill cannot be activated, STOP and tell the user - do not proceed without it.**

---

**Design**: `.specs/features/actual-vs-forecast/design.md`
**Status**: Approved
**Approved**: 2026-11-05 - user: "Aprovo"
**Build**: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -DskipITs -Dsurefire.skip=true; cd frontend && pnpm lint; cd frontend && pnpm build; cd frontend && node scripts/check-siblings.ts
**Run unit**: cd frontend && pnpm exec vitest run --project=unit --reporter=verbose src/features/transactions src/features/overview src/api/services
**Run stories**: cd frontend && pnpm exec vitest run --project=storybook --reporter=verbose src/features/transactions src/features/overview

---

## Test Coverage Matrix

> Generated from codebase, project guidelines, and spec. Guidelines found: `CLAUDE.md`, `frontend/scripts/testTable.ts`, `.claude/skills/frontend-testing`, `.claude/skills/backend-testing`.

| Code Layer | Required Test Type | Coverage Expectation | Location Pattern | Run Command |
| ---------- | ------------------ | -------------------- | ---------------- | ----------- |
| Entity rule / pure logic (status, confirm, flag toggle, today) | unit (`*Test`) | 1:1 to the ACs it decides, edge cases included | `backend/src/test/java/com/lcs/findraco/**/*Test.java` | `./mvnw -B -q test -Dtest=<Class>` |
| Endpoint with a rule or guard (confirm, series edit, summary, list status) | integration (`*IT`) | One IT per rule asserting status and problem `type`; the role matrix gains the confirm endpoint | `backend/src/test/java/com/lcs/findraco/**/*IT.java` | `./mvnw -B verify -Dit.test=<Class>` |
| Migration | `MigrationsIT` | Existing rows land as `BY_DATE` / `false` | `backend/src/test/java/com/lcs/findraco/MigrationsIT.java` | `./mvnw -B verify -Dit.test=MigrationsIT` |
| Frontend form module, service hook | unit | 1:1 to the ACs it decides; raw function + hook | sibling `*.test.ts(x)` | Run unit |
| Container (confirm dialog, transaction form drawer) | flow (unit project, MSW) | The container's decisions only | sibling `*.test.tsx` | Run unit |
| Presentational views (cells, mobile list, summary cards, confirm dialog view) | story | One story per state handled | `*.stories.tsx` | Run stories |
| Resource files, generated types, prerelease bump | none | build gate only | - | Build |

## Gate Check Commands

| Gate Level | When to Use | Command |
| ---------- | ----------- | ------- |
| Quick | After tasks with unit tests only | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q test -Dtest=<Class>` or `cd frontend && pnpm exec vitest run --project=unit <related files>` |
| Full | After tasks with integration tests | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B verify -Dit.test=<Class>` |
| Build | Last task of a phase | Phase 1: `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B verify`; Phase 2: the `**Build**:` line + `cd frontend && pnpm exec vitest run --project=unit --project=tooling --project=storybook` |

---

## Execution Plan

### Phase 1: Backend

```
T1 → T2 → T3 → T4 → T5 → T6
```

### Phase 2: Frontend

```
T7 → T8 → T9 → T10 → T11 → T12
```

---

## Task Breakdown

### T1: Confirmation model and migration

**What**: `V23__add_transaction_confirmation.sql` (design Data Models); enum `Confirmation`; `TransactionStatus`; `Transaction.confirmation`, `status(today)`, `confirm(amount, date)`, `setConfirmed(boolean)`; `RecurrenceDefinition.requiresConfirmation` and `changeRequiresConfirmation(boolean, occurrences, today)`; unit tests `TransactionConfirmationTest`; `MigrationsIT` case for existing rows.
**Where**: `backend/src/main/java/com/lcs/findraco/transaction/model/`
**Depends on**: None
**Reuses**: guarded-aggregate pattern, `TransactionExceptions`
**Requirement**: AVF-01, AVF-02, AVF-03

**Done when**:

- [x] C1, C2, C3, C4, C9, C10, C11, C12, C13, C21, C22 pass

**Tests**: unit
**Gate**: quick
**Commit**: `feat(backend): store how a transaction becomes actual`

---

### T2: The reader's today

**What**: `UserService.today(long userId)` = `LocalDate.now(clock.withZone(ZoneId.of(user.timeZone)))`; unit test `UserTodayTest` with a fixed `Clock` and two zones.
**Where**: `backend/src/main/java/com/lcs/findraco/user/service/UserService.java`
**Depends on**: T1
**Reuses**: injected UTC `Clock`, `User.timeZone`
**Requirement**: AVF-01

**Done when**:

- [x] C5 passes

**Tests**: unit
**Gate**: quick
**Commit**: `feat(backend): resolve today in the user's time zone`

---

### T3: Status in transaction reads

**What**: `TransactionResponse.status` and `requiresConfirmation`, computed with `UserService.today`, on get, list and series responses; one-off transactions are created `BY_DATE`; `TransactionStatusIT`; `openapi.json` regenerated.
**Where**: `backend/src/main/java/com/lcs/findraco/transaction/response/TransactionResponse.java`
**Depends on**: T2
**Reuses**: `TransactionCrudIT` setup, fixed `Clock`
**Requirement**: AVF-01, AVF-04

**Done when**:

- [x] C6, C23, C24 pass; snapshot regenerated

**Tests**: integration
**Gate**: full
**Commit**: `feat(backend): report each transaction's status`

---

### T4: Series stamp, flag toggle and frozen confirmed occurrences

**What**: `CreateSeriesRequest.requiresConfirmation` (null → `true`) stamps the definition and every generated or topped-up occurrence; `editSeries` applies a changed flag through `changeRequiresConfirmation`, `UpdateSeriesRequest.pivotConfirmed` to the pivot, and keeps confirmed non-pivot occurrences out of `reconcile` (their dates join the call's exceptions); `SeriesConfirmationIT`; snapshot regenerated.
**Where**: `backend/src/main/java/com/lcs/findraco/transaction/service/TransactionService.java`
**Depends on**: T3
**Reuses**: `SeriesEditIT` setup, `SeriesRegenerator.reconcile`, `RecurringTransactionGenerator`, `OpenEndedSeriesTopUpService`
**Requirement**: AVF-02

**Done when**:

- [x] C7, C8, C14, C15, C16, C25 pass; snapshot regenerated

**Tests**: integration
**Gate**: full
**Commit**: `feat(backend): let series require confirmation and keep confirmed occurrences`

---

### T5: Confirm endpoint

**What**: `POST /plans/{planId}/transactions/{id}/confirm` with `ConfirmTransactionRequest(amount, startDate, version)`; moved date → `definition.except(oldDate)`; problem `transaction-not-awaiting-confirmation` (409) with its `problems.ts` copy in `en.json` and `pt-BR.json`; `TransactionConfirmIT`; role matrix row; snapshot regenerated.
**Where**: `backend/src/main/java/com/lcs/findraco/transaction/controller/TransactionController.java`
**Depends on**: T4
**Reuses**: `claimVersion`, `requireCanModifyTransaction`, `ProblemMatchers.problem`, role matrix
**Requirement**: AVF-02

**Done when**:

- [x] C17, C18, C19, C20, C26 pass; role matrix green; snapshot regenerated

**Tests**: integration
**Gate**: full
**Commit**: `feat(backend): confirm a transaction with its real amount and date`

---

### T6: Actual figures in the summary

**What**: `DashboardSummaryResponse.actualIncome`, `actualExpenses`, `actualBalance` from a twin query with the actual predicate and the reader's today; trend and per-person unchanged; `DashboardActualIT`; snapshot regenerated.
**Where**: `backend/src/main/java/com/lcs/findraco/dashboard/service/DashboardService.java`
**Depends on**: T5
**Reuses**: `sumByPlanAndTypeAndDateRange`, dashboard IT setup
**Requirement**: AVF-01

**Done when**:

- [x] C27, C28, C29, C30 pass; full backend `./mvnw -B verify` green (phase gate)

**Tests**: integration
**Gate**: build
**Commit**: `feat(backend): add actual figures to the month summary`

---

### T7: Frontend types and confirm service hook

**What**: types regenerated from `openapi.json`; `confirmTransaction` raw function + `useConfirmTransaction` hook (invalidates transactions and dashboard) + MSW handler factory; unit test.
**Where**: `frontend/src/api/services/useTransactionService.ts`
**Depends on**: None (Phase 1 complete)
**Reuses**: `buildMutationOptions`, existing transaction handlers
**Requirement**: AVF-02

**Done when**:

- [x] C31 passes

**Tests**: unit
**Gate**: quick
**Commit**: `feat(frontend): add the confirm transaction service hook`

---

### T8: Forecast and Pending badges

**What**: "Forecast" / "Pending" badges from `status` in `TransactionCells` and `TransactionMobileList`; copy in `en.json` and `pt-BR.json` ("Previsto", "Pendente"); stories `Forecast`, `Pending`, `Actual`.
**Where**: `frontend/src/features/transactions/components/TransactionCells.tsx`
**Depends on**: T7
**Reuses**: `Badge` primitive, existing cell stories
**Requirement**: AVF-02, AVF-04

**Done when**:

- [x] C32, C33 pass

**Tests**: story
**Gate**: quick
**Commit**: `feat(frontend): mark forecast and pending transactions`

---

### T9: Confirm dialog and row action

**What**: `confirmTransactionForm.ts` (zod: amount > 0, date) + unit test; `ConfirmTransactionDialog` (container) + `ConfirmTransactionDialogView` + story + flow test; "Confirm" row action in `useTransactionActions` shown when `requiresConfirmation && status !== "ACTUAL" && permissions.edit`.
**Where**: `frontend/src/features/transactions/components/ConfirmTransactionDialog.tsx`
**Depends on**: T8
**Reuses**: `FormField`, `CurrencyInput`, `DatePicker`, `TimeZoneDialog` pattern
**Requirement**: AVF-02

**Done when**:

- [x] C34, C35, C36, C37 pass

**Tests**: unit
**Gate**: quick
**Commit**: `feat(frontend): confirm an occurrence from the transactions list`

---

### T10: Requires confirmation and Status in the transaction form

**What**: `requiresConfirmation` (series create default on, edit from the definition) and `confirmed` in `transactionForm.ts` values and mappers (`confirmed` is sent as `pivotConfirmed`); "Requires confirmation" switch on series fields; "Status: Forecast · Actual" control when editing an occurrence with `requiresConfirmation`; one-off forms show neither; tests in `transactionForm.series.test.ts` and `TransactionFormDrawer.test.tsx`.
**Where**: `frontend/src/features/transactions/components/transactionForm.ts`
**Depends on**: T9
**Reuses**: `FormField`, `Switch`, `ToggleGroup` primitives
**Requirement**: AVF-02, AVF-04

**Done when**:

- [x] C38, C39, C40, C41 pass

**Tests**: unit
**Gate**: quick
**Commit**: `feat(frontend): choose confirmation and status in the transaction form`

---

### T11: Actual and forecast in the summary cards

**What**: `SummaryCards` shows actual and forecast for income, expenses and balance; stories `WithForecast`, `NoForecast`; copy ("Realizado", "Previsto").
**Where**: `frontend/src/features/overview/components/SummaryCards.tsx`
**Depends on**: T10
**Reuses**: `Amount`, existing `SummaryCards` stories
**Requirement**: AVF-01

**Done when**:

- [x] C42, C43 pass

**Tests**: story
**Gate**: quick
**Commit**: `feat(frontend): show actual and forecast in the month summary`

---

### T12: Prerelease bump

**What**: `frontend/package.json` `1.0.0-beta.29` → `1.0.0-beta.30`.
**Where**: `frontend/package.json`
**Depends on**: T11
**Reuses**: release rule (CLAUDE.md)
**Requirement**: AVF-01

**Done when**:

- [x] Phase gate green (Build line + unit, tooling and storybook projects)

**Tests**: none
**Gate**: build
**Commit**: `chore(release): 1.0.0-beta.30`

---

## Checks

**C1** - A `BY_DATE` transaction dated on or before today is actual (AVF-01, AC 1)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q test -Dtest='TransactionConfirmationTest#byDateOnOrBeforeTodayIsActual' -Dsurefire.failIfNoSpecifiedTests=true

**C2** - A `CONFIRMED` transaction is actual whatever its date, a future date included (AVF-01, AC 1; edge case 1)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q test -Dtest='TransactionConfirmationTest#confirmedIsActualEvenWhenFuture' -Dsurefire.failIfNoSpecifiedTests=true

**C3** - A `BY_DATE` transaction dated after today is forecast (AVF-01, AC 2; AVF-04, AC 1)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q test -Dtest='TransactionConfirmationTest#byDateAfterTodayIsForecast' -Dsurefire.failIfNoSpecifiedTests=true

**C4** - A `BY_DATE` transaction dated today is actual, so its day counts it with no action (AVF-01, AC 4; AVF-04, AC 2)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q test -Dtest='TransactionConfirmationTest#byDateTodayIsActual' -Dsurefire.failIfNoSpecifiedTests=true

**C5** - At 2026-11-05T01:00Z today is 2026-11-04 for `America/Sao_Paulo` and 2026-11-05 for `Europe/Lisbon` (AVF-01, AC 1)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q test -Dtest='UserTodayTest#todayFollowsTheUsersZone' -Dsurefire.failIfNoSpecifiedTests=true

**C6** - The list returns `status` `FORECAST` for a row dated after today and `ACTUAL` for one before it (AVF-01, AC 1-2)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionStatusIT#listReportsForecastAndActual' -Dsurefire.skip=true

**C7** - A series created without `requiresConfirmation` stores `true` and stamps every occurrence `REQUIRED` (AVF-02, AC 1)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesConfirmationIT#newSeriesRequiresConfirmationByDefault' -Dsurefire.skip=true

**C8** - Turning the flag off on a series turns its unconfirmed occurrences `BY_DATE` and leaves confirmed ones `CONFIRMED`; turning it on turns only future `BY_DATE` occurrences `REQUIRED` (AVF-02, AC 2)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesConfirmationIT#flagChangeTouchesOnlyForecastOccurrences' -Dsurefire.skip=true

**C9** - A `REQUIRED` occurrence dated three months back stays forecast (AVF-02, AC 3)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q test -Dtest='TransactionConfirmationTest#requiredStaysForecastWhateverItsDate' -Dsurefire.failIfNoSpecifiedTests=true

**C10** - A `REQUIRED` occurrence dated before today has status `PENDING`; dated today or later, `FORECAST` (AVF-02, AC 4-5)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q test -Dtest='TransactionConfirmationTest#requiredBeforeTodayIsPending' -Dsurefire.failIfNoSpecifiedTests=true

**C11** - `confirm` on a `BY_DATE` or `CONFIRMED` transaction throws `TransactionNotAwaitingConfirmationException` (AVF-02, AC 7)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q test -Dtest='TransactionConfirmationTest#confirmOnlyFromRequired' -Dsurefire.failIfNoSpecifiedTests=true

**C12** - `setConfirmed(false)` on a `CONFIRMED` occurrence makes it `REQUIRED` and forecast again (AVF-02, AC 10)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q test -Dtest='TransactionConfirmationTest#unconfirmMakesItForecast' -Dsurefire.failIfNoSpecifiedTests=true

**C13** - `changeRequiresConfirmation(true)` leaves a past `BY_DATE` occurrence `BY_DATE` (AVF-02, AC 2)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q test -Dtest='TransactionConfirmationTest#turningTheFlagOnSparesPastOccurrences' -Dsurefire.failIfNoSpecifiedTests=true

**C14** - A THIS_ONE edit with `pivotConfirmed: true` stores the pivot `CONFIRMED`; without `pivotConfirmed` and with a changed amount, the pivot keeps `REQUIRED` (AVF-02, AC 9)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesConfirmationIT#pivotStatusIsOnlyWhatTheRequestSays' -Dsurefire.skip=true

**C15** - An "all" edit changing the amount from 200 to 250 leaves a confirmed occurrence at 187.40 on its date and updates the others (AVF-02, AC 12; edge case 3)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesConfirmationIT#allEditKeepsConfirmedOccurrences' -Dsurefire.skip=true

**C16** - A "this and following" edit leaves a confirmed occurrence after the pivot unchanged and creates no second occurrence on its date (AVF-02, AC 12)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesConfirmationIT#followingEditKeepsConfirmedOccurrences' -Dsurefire.skip=true

**C17** - Confirming with amount 187.40 and date moved from the 10th to the 12th answers 200 with `status` `ACTUAL`, stores both, and a later "all" edit recreates nothing on the 10th (AVF-02, AC 7)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionConfirmIT#confirmStoresAmountAndMovedDate' -Dsurefire.skip=true

**C18** - A confirm by a member who may not edit the occurrence answers the role-denied problem; on another plan's transaction, 404 (AVF-02, AC 11)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionConfirmIT#confirmIsGuardedLikeEdit' -Dsurefire.skip=true

**C19** - A confirm with a stale `version` answers 409 stale-version and leaves amount and status unchanged (AVF-02, AC 13)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionConfirmIT#staleConfirmChangesNothing' -Dsurefire.skip=true

**C20** - A confirm with amount 0 answers 422 validation-failed (AVF-02, AC 14)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionConfirmIT#rejectsAZeroAmount' -Dsurefire.skip=true

**C21** - After V23, a pre-existing series is `requires_confirmation = false` and its transactions `BY_DATE` (AVF-03, AC 1, 3)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='MigrationsIT#v23LeavesExistingDataByDate' -Dsurefire.skip=true

**C22** - After V23, pre-existing transactions keep amount, date, category and shares (AVF-03, AC 2)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='MigrationsIT#v23KeepsExistingValues' -Dsurefire.skip=true

**C23** - A one-off transaction is created `BY_DATE` with `requiresConfirmation` false (AVF-04, AC 1-3)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionStatusIT#oneOffIsByDate' -Dsurefire.skip=true

**C24** - The same row reads `ACTUAL` for a member whose today is past its date and `FORECAST` for one whose today is before it (AVF-01, AC 1)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionStatusIT#statusUsesTheReadersToday' -Dsurefire.skip=true

**C25** - A topped-up occurrence of a series requiring confirmation is `REQUIRED` (AVF-02, AC 3)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesConfirmationIT#topUpStampsTheFlag' -Dsurefire.skip=true

**C26** - Confirming an already confirmed occurrence answers 409 `transaction-not-awaiting-confirmation` (AVF-02, AC 7)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionConfirmIT#confirmingTwiceIsAConflict' -Dsurefire.skip=true

**C27** - On the 5th, with salary 5000 on the 1st and rent 2000 (`BY_DATE`) on the 20th, the summary answers actual income 5000, actual expenses 0, actual balance 5000; totals 5000, 2000, 3000 (AVF-01, AC 3)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='DashboardActualIT#summarySplitsActualFromForecast' -Dsurefire.skip=true

**C28** - A pending occurrence counts in the totals and not in the actual figures (AVF-02, AC 3; context 7)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='DashboardActualIT#pendingCountsOnlyInForecast' -Dsurefire.skip=true

**C29** - A month with only past `BY_DATE` rows answers actual figures equal to the totals (AVF-01, AC 5)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='DashboardActualIT#noForecastMeansEqualFigures' -Dsurefire.skip=true

**C30** - Trend and per-person figures include forecast rows, as before (AVF-01, AC 6)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='DashboardActualIT#trendAndPeopleCountEverything' -Dsurefire.skip=true

**C31** - `confirmTransaction` posts amount, date and version to `/plans/{planId}/transactions/{id}/confirm` (AVF-02, AC 7)
Proof: run unit | ✓ confirmTransaction > posts amount, date and version

**C32** - A forecast row shows "Forecast" and a pending row "Pending"; an actual row neither (AVF-02, AC 4-5)
Proof: run stories | ✓ TransactionCells.stories.tsx > Status Badges

**C33** - The mobile list shows the same badges (AVF-02, AC 4-5; AVF-04, AC 1)
Proof: run stories | ✓ TransactionMobileList.stories.tsx > Forecast And Pending

**C34** - Clicking "Confirm" on a pending row of the transactions page opens the dialog with its amount and date filled in (AVF-02, AC 6)
Proof: run unit | ✓ TransactionsPage > confirm on a pending row opens the dialog prefilled

**C35** - Submitting the dialog with 187,40 sends 187.4 and closes it (AVF-02, AC 7)
Proof: run unit | ✓ ConfirmTransactionDialog > confirms with the edited amount

**C36** - The row hides "Confirm" for a member without edit permission and for an actual row (AVF-02, AC 11)
Proof: run unit | ✓ useTransactionActions > hides confirm without permission or when actual

**C37** - An empty or zero amount shows the validation message and sends nothing (AVF-02, AC 14)
Proof: run unit | ✓ confirmTransactionForm > rejects an empty or zero amount

**C38** - The series create form starts with "Requires confirmation" on (AVF-02, AC 1)
Proof: run unit | ✓ TransactionFormDrawer > series starts requiring confirmation

**C39** - Editing a forecast occurrence that requires confirmation shows Status preset to "Forecast", and saving after only an amount change sends `pivotConfirmed: false` (AVF-02, AC 8-9)
Proof: run unit | ✓ TransactionFormDrawer > status keeps its value when another field changes

**C40** - Setting Status to "Forecast" on a confirmed occurrence sends `pivotConfirmed: false` (AVF-02, AC 10)
Proof: run unit | ✓ TransactionFormDrawer > status forecast unconfirms

**C41** - A one-off transaction form shows neither "Requires confirmation" nor Status (AVF-04, AC 3)
Proof: run unit | ✓ TransactionFormDrawer > one-off shows no confirmation controls

**C42** - The summary cards show actual and forecast for income, expenses and balance (AVF-01, AC 3)
Proof: run stories | ✓ SummaryCards.stories.tsx > With Forecast

**C43** - In `pt-BR` the new texts read "Realizado", "Previsto", "Pendente", "Confirmar", "Exige confirmação" and "Situação" (edge case 4)
Proof: walk - Storybook at 390×844 with `locale` pt-BR: summary cards, transaction cells, mobile list, confirm dialog, transaction form

**C44** - A "this and following" edit from a confirmed occurrence whose date was moved off the series dates keeps that occurrence, with the form's values (AVF-02, AC 12)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesConfirmationIT#followingEditFromMovedConfirmedPivotKeepsIt' -Dsurefire.skip=true

**C45** - Confirming with a moved date, setting Status back to Forecast, then an "all" edit keeps the occurrence: it returns to its own series slot (AVF-02, AC 10)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesConfirmationIT#undoneMovedConfirmationSurvivesAllEdit' -Dsurefire.skip=true

**C46** - Confirming an occurrence onto another occurrence's date, then an "all" edit, keeps both (AVF-02, AC 12)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesConfirmationIT#confirmOntoSiblingDateKeepsTheSibling' -Dsurefire.skip=true

**C47** - A "this and following" or "all" edit with `pivotConfirmed: true` stores the pivot `CONFIRMED` (AVF-02, AC 9)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesConfirmationIT#pivotStatusAppliesInEveryScope' -Dsurefire.skip=true

**C48** - On the mobile list, "Confirm" on a pending row opens the confirm dialog (AVF-02, AC 6)
Proof: run unit | ✓ TransactionsPage > mobile confirm opens the dialog

**C49** - With a member selected, the summary cards show that member's actual and forecast figures (AVF-01, AC 3)
Proof: run unit | ✓ summaryView > member selected keeps actual figures

---

## Handoff

**Settled mid-build:** repo names win over the design (orchestrator accepted, batch A): table `transactions` / `ck_transactions_confirmation` (V13 renamed it), route `POST /plan/{planId}/transaction/{id}/confirm`, `markConfirmed(boolean)` instead of `setConfirmed` (no public `set*` rule); problem copy landed in T1. Verifier round 1 FAIL (9 findings) → fix pass: occurrences carry their series slot (`scheduled_date`, iCalendar RECURRENCE-ID) and reconcile matches by it, so a moved confirmation never needs an exception (closes findings 1-3); C32, C34, C39 tightened, C44-C49 added (orchestrator); fix worker (Opus) returned at 5c619d7, per-person breakdown gained actual figures for finding 7 (orchestrator accepted)
**Dispatched:** batch A (T1–T6, Sonnet) at 92f2745, returned at ca014ba; batch B (T7–T12, Sonnet) at ca014ba, returned at 5814209; Verifier (Opus) at 507ad8f
**Walked:** 2026-11-05, Storybook at 390×844 with `locale` pt-BR (script and screenshots in the session scratchpad `walk-avf/`): SummaryCards WithForecast and MemberSelected, TransactionCells Forecast/Pending/Confirmable, TransactionMobileList ForecastAndPending, ConfirmTransactionDialogView Filled, ConfirmationFields RequiredForecast. C43: "Realizado", "Previsto", "Pendente", "Confirmar", "Exige confirmação", "Situação" all shown. Found: the confirm dialog description reads English in pt-BR ("Enter what was really charged…"); MemberSelected shows forecast only although the API's actual figures honour `memberId`; the mobile list has no Confirm action (desktop only); the summary caption "Realizado · Previsto R$ X" reads as one label. Reached in the app by: sign in, Transactions, a series created with Requires confirmation on and a date before today

---

## Phase Execution Map

```
Phase 1 → Phase 2

Phase 1:  T1 → T2 → T3 → T4 → T5 → T6
Phase 2:  T7 → T8 → T9 → T10 → T11 → T12
```
