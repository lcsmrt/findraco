# Actual vs Forecast verification

**Verdict**: FAIL
**Proofs**: `proofs.md` at 507ad8f
**Verifier**: independent sub-agent (author != verifier)

## Checks

| Check | Test | Holds |
| --- | --- | --- |
| C1 | `TransactionConfirmationTest#byDateOnOrBeforeTodayIsActual` | yes |
| C2 | `TransactionConfirmationTest#confirmedIsActualEvenWhenFuture` | yes |
| C3 | `TransactionConfirmationTest#byDateAfterTodayIsForecast` | yes |
| C4 | `TransactionConfirmationTest#byDateTodayIsActual` | yes - the today boundary is asserted |
| C5 | `UserTodayTest#todayFollowsTheUsersZone` | yes |
| C6 | `TransactionStatusIT#listReportsForecastAndActual` | yes |
| C7 | `SeriesConfirmationIT#newSeriesRequiresConfirmationByDefault` | yes - body omits the flag; definition and all five rows asserted |
| C8 | `SeriesConfirmationIT#flagChangeTouchesOnlyForecastOccurrences` | yes - both directions, confirmed and past rows spared (ALL scope only) |
| C9 | `TransactionConfirmationTest#requiredStaysForecastWhateverItsDate` | yes |
| C10 | `TransactionConfirmationTest#requiredBeforeTodayIsPending` | yes - yesterday, today and tomorrow |
| C11 | `TransactionConfirmationTest#confirmOnlyFromRequired` | yes |
| C12 | `TransactionConfirmationTest#unconfirmMakesItForecast` | yes |
| C13 | `TransactionConfirmationTest#turningTheFlagOnSparesPastOccurrences` | yes - an occurrence dated today is not exercised |
| C14 | `SeriesConfirmationIT#pivotStatusIsOnlyWhatTheRequestSays` | yes - THIS_ONE only; see the scope finding |
| C15 | `SeriesConfirmationIT#allEditKeepsConfirmedOccurrences` | yes - confirmed row on its template date only |
| C16 | `SeriesConfirmationIT#followingEditKeepsConfirmedOccurrences` | yes - confirmed row after the pivot, not as the pivot |
| C17 | `TransactionConfirmIT#confirmStoresAmountAndMovedDate` | yes - removing `except(previousDate)` makes the count 6 |
| C18 | `TransactionConfirmIT#confirmIsGuardedLikeEdit` | yes |
| C19 | `TransactionConfirmIT#staleConfirmChangesNothing` | yes |
| C20 | `TransactionConfirmIT#rejectsAZeroAmount` | yes |
| C21 | `MigrationsIT#v23LeavesExistingDataByDate` | yes |
| C22 | `MigrationsIT#v23KeepsExistingValues` | yes |
| C23 | `TransactionStatusIT#oneOffIsByDate` | yes |
| C24 | `TransactionStatusIT#statusUsesTheReadersToday` | yes - a server-zone "today" fails it whatever the hour |
| C25 | `SeriesConfirmationIT#topUpStampsTheFlag` | yes |
| C26 | `TransactionConfirmIT#confirmingTwiceIsAConflict` | yes |
| C27 | `DashboardActualIT#summarySplitsActualFromForecast` | yes |
| C28 | `DashboardActualIT#pendingCountsOnlyInForecast` | yes |
| C29 | `DashboardActualIT#noForecastMeansEqualFigures` | yes - the row dated today catches `<` for `<=` |
| C30 | `DashboardActualIT#trendAndPeopleCountEverything` | yes |
| C31 | `useTransactionService.test.ts` `confirmTransaction > posts amount, date and version` | yes |
| C32 | `TransactionCells.stories.tsx` `Pending` | no - the named story asserts only the pending row; a "Forecast" badge on an actual row passes it (mutation survived) |
| C33 | `TransactionMobileList.stories.tsx` `Forecast And Pending` | yes - counts catch a badge on the actual row |
| C34 | `ConfirmTransactionDialog.test.tsx` `opens with the occurrence amount and date` | no - renders the dialog directly; the row's Confirm opening it is not exercised (`onConfirm: actions.edit` survived every unit test) |
| C35 | `ConfirmTransactionDialog.test.tsx` `confirms with the edited amount` | yes |
| C36 | `useTransactionActions.test.tsx` `hides confirm without permission or when actual` | yes |
| C37 | `confirmTransactionForm.test.ts` `rejects an empty or zero amount` | yes - at the schema; the dialog's display of the message rests on the resolver |
| C38 | `TransactionFormDrawer.test.tsx` `series starts requiring confirmation` | yes |
| C39 | `TransactionFormDrawer.test.tsx` `status keeps its value when another field changes` | no - starts from Actual, so an amount edit that turns a forecast into Actual is invisible (mutation survived) |
| C40 | `TransactionFormDrawer.test.tsx` `status forecast unconfirms` | yes |
| C41 | `TransactionFormDrawer.test.tsx` `one-off shows no confirmation controls` | yes - edit mode only |
| C42 | `SummaryCards.stories.tsx` `With Forecast` | yes - income's actual equals its forecast there; `summaryView.test.ts` covers the income mapping |
| C43 | walk - Storybook pt-BR at 390×844 | yes (walked) |
| C44 | `SeriesConfirmationIT#followingEditFromMovedConfirmedPivotKeepsIt` | yes - round 2 (orchestrator): failed on the pre-fix code per the fix worker (date matching deleted the pivot), passes at HEAD |
| C45 | `SeriesConfirmationIT#undoneMovedConfirmationSurvivesAllEdit` | yes - round 2: failed on the pre-fix code per the fix worker, passes at HEAD |
| C46 | `SeriesConfirmationIT#confirmOntoSiblingDateKeepsTheSibling` | yes - round 2: failed on the pre-fix code per the fix worker, passes at HEAD |
| C47 | `SeriesConfirmationIT#pivotStatusAppliesInEveryScope` | yes - round 2 (orchestrator mutation): restricting `pivotConfirmed` to THIS_ONE at `TransactionService.java:524` fails it |
| C48 | `TransactionsPage > mobile confirm opens the dialog` | yes - round 2 (orchestrator mutation): the mobile Confirm button calling `onEdit` fails it |
| C49 | `summaryView > member selected keeps actual figures` | yes - round 2 (orchestrator mutation): the member's actual taken from `income` fails it |

## Findings

| Finding | Evidence | Fix | Closed |
| --- | --- | --- | --- |
| Major - a "this and following" edit whose pivot is a confirmed occurrence moved off its template date deletes it | `SeriesRegenerator.java:68` drops the pivot from `confirmedDates`, then `:105` deletes it (no target on its date). Throwaway IT: confirm occurrence 3 on day+2, THIS_AND_FOLLOWING edit from it -> row 3 gone | keep a confirmed pivot out of the date matching (update it in place) and add a check | d7d9fce |
| Major - undoing a confirmation that moved the date, then an "all" edit, deletes the occurrence | `TransactionService.java:235` leaves the old date as an exception; after `pivotConfirmed: false` the REQUIRED row sits off-template and `SeriesRegenerator.java:105` deletes it. Throwaway IT: confirm on day+2, THIS_ONE `pivotConfirmed:false`, ALL edit -> 4 rows left | an unconfirmed off-template occurrence must survive regeneration (or undo restores the slot); add a check | d7d9fce |
| Major - confirming onto another occurrence's date makes the next "all" edit delete that other occurrence | `SeriesRegenerator.java:75` skips the target on the confirmed date, so the REQUIRED sibling on it is left over and deleted at `:105`. Throwaway IT: confirm Oct occurrence dated on Nov's date, ALL edit -> Nov forecast gone | match the sibling to the slot even when a confirmed row shares the date (or refuse such a date); add a check | d7d9fce |
| Major - the Status control is ignored for "this and following" and "all" scopes (AVF-02 AC 9) | `TransactionService.java:497` applies `pivotConfirmed` only in the THIS_ONE branch; the frontend sends it for every scope. Throwaway IT: THIS_AND_FOLLOWING with `pivotConfirmed: true` -> pivot stays REQUIRED | apply `pivotConfirmed` to the pivot in every scope (or hide/disable Status unless THIS_ONE); add a check | c332eab |
| Major - no test holds "Status never changes as a side effect of another field" for a forecast occurrence | `TransactionFormDrawer.test.tsx:746` starts from an Actual occurrence; mutating `transactionForm.ts:540` to `values.confirmed OR values.amount !== transaction.amount` passes all 126 form tests | run C39 on a forecast/pending occurrence: change the amount, save, assert `pivotConfirmed: false` | a0e6b1d |
| Major - the mobile list offers no Confirm (AVF-02 AC 6, success criterion 2) | `TransactionMobileList.tsx:22` takes only `onEdit`; on a phone the dialog cannot be reached | add Confirm to the mobile row (or record a confirmed departure) and a check | f9cb47c |
| Major - with a member selected the summary drops the actual figures (AVF-01 AC 3) although the API returns them for `memberId` | `summaryView.ts:54` sets `actual: null` for a selected member; `DashboardService` already filters the actual sums by `memberId` | show the member's actual figures (or confirm the departure in the spec) and add a check | 5bb8347 |
| Minor - C32's proof names only the Pending story | `TransactionCells.stories.tsx:150`; a Forecast badge on an ACTUAL row passed it | point C32 at a story that asserts all three states (Forecast, Pending, Actual) | a0e6b1d |
| Minor - C34 never clicks Confirm on a row | `TransactionsPage.tsx:87` mutated to `onConfirm: actions.edit` passed all 339 unit tests | a flow test: click Confirm on a pending row, assert the dialog opens prefilled | a0e6b1d |
