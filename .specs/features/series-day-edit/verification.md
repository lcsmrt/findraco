# Series date edit verification

**Verdict**: FAIL
**Proofs**: `proofs.md` at 8b448c59 (HEAD 6957e36e changes only `.specs`)
**Verifier**: independent sub-agent (author != verifier)

## Checks

| Check | Test | Holds |
| --- | --- | --- |
| C1 | `SeriesDateEditIT` `onlyThisMovesOneOccurrence` | yes - both examples, dates and slots exact |
| C2 | `SeriesDateEditIT` `movedAloneKeepsDateOnAllEdit` | yes |
| C3 | `SeriesDateEditIT` `dayChangeMovesPivotAndFollowing` | yes - both examples, `day_of_month`, start and end asserted |
| C4 | `SeriesDateEditIT` `confirmedKeepsDateOnDayChange` | yes |
| C5 | `SeriesDateEditIT` `movedAloneMovesWithFollowing` | yes |
| C6 | `SeriesDateEditIT` `dayThirtyOneFallsOnMonthEnd` | no - the January example holds; the February example ("day 31 from February gives 28/02, 31/03, 30/04") is replaced by a change from March that asserts 16/02, 31/03, 30/04, a different claim (`SeriesDateEditIT.java:262-280`) |
| C7 | `SeriesDateEditIT` `deletedMonthStaysEmptyOnDayChange` | yes |
| C8 | `SeriesDateEditIT` `topUpUsesChangedDay` | yes |
| C9 | `SeriesDateEditIT` `restoreBeforeDateChangeConflicts` | yes |
| C10 | `SeriesDateEditIT` `firstOccurrenceShiftsRecurringMonth` | yes on its example; no confirmed occurrence in it, see the first finding |
| C11 | `SeriesDateEditIT` `firstOccurrenceShiftsInstallmentMonth` | yes on its example; no confirmed occurrence in it, see the first finding |
| C12 | `SeriesDateEditIT` `monthShiftMovesDeletedMonth` | yes |
| C13 | `SeriesDateEditIT` `invalidDateChangeIsRefused` | yes - both refusals with slug, dates, slots and version unchanged, both 200s |
| C14 | `SeriesDateEditIT` `monthCollisionIsRefused` | yes |
| C15 | `TransactionFormDrawer.test.tsx` `shows the opened occurrence's date` | yes |
| C16 | `TransactionFormDrawer.test.tsx` `offers only this and following when the date changed`; `SeriesScopeDialog.stories.tsx` `Date Changed` | yes |
| C17 | `TransactionFormDrawer.test.tsx` `offers every scope when the date is unchanged` | yes |
| C18 | `transactionForm.series.test.ts` `sends the pivot date only when it changed` | yes - unchanged, same day at another hour, and changed |
| C19 | `TransactionFormDrawer.test.tsx` `refuses a date and installments change in one edit` | yes - message shown, no write sent |
| C20 | `TransactionFormDrawer.test.tsx` `shows the series date problems from the API` | yes - both slugs, both languages, exact copy |
| C21 | `MigrationsIT` `recurrenceDayOfMonthIsFilledAndBounded` | yes |
| C22 | `OpenApiSnapshotIT` | yes - `pivotDate` is in `backend/openapi.json` and the snapshot matches the generated spec |
| C23 | `SeriesEditIT`, `SeriesConfirmationIT`, `OpenEndedSeriesIT`, `OpenEndedTopUpIT`, `SeriesTopUpJobIT`, `TransactionTrashIT`, `TrashRuleRevisionIT` | yes - the one changed test (`SeriesConfirmationIT`) changes only for the "dates no longer reset to the slot" line of `Changes underneath` |
| C24 | `SeriesDateEditIT` `dateChangeNeedsRightsOverEveryOccurrenceInScope` | yes |

## Findings

| Finding | Evidence | Fix | Closed |
| --- | --- | --- | --- |
| A month change with a confirmed occurrence that stays behind adds an occurrence: the count is not kept (AC 10), and an installment series gets a second last installment. No check covers a month change with a confirmed occurrence that does not collide | Throwaway IT at HEAD, all 200: (a) installments 10x from 16/12/2026, 10/10 confirmed, first to 16/11/2026 gives 11 rows, 16/11/2026 to 16/09/2027, labelled `Laptop (1/10)` to `(10/10)` plus a second `Laptop (10/10)`; (b) monthly 16/03-16/06/2026, June confirmed, first to 16/02 gives 5 rows, Feb to Jun, end 16/05 with the confirmed June after it; (c) the same series with April deleted and May confirmed, first to 16/04 gives 4 rows (Apr, May, Jun new, Jul) from 3. Cause: `SeriesDateChange.requireOneOccurrencePerMonth` (`SeriesDateChange.java:59`) looks only for two rows in one month, and `SeriesRegenerator.reconcile` (`SeriesRegenerator.java:84,110`) then fills the month the moved rows left, because the confirmed row stays frozen in its old month and the deleted month moved onto it | Ask the owner which rule applies, then add a check for each of (a), (b), (c). Choices: refuse a month change that would change the count (broaden the 422 `series-month-collision` refusal), or keep the count by not filling the month a moved occurrence leaves | |
| C6's test does not prove C6's second example, and that example cannot happen through the interface: `pivotDate` is a date, and February has no 31st, so day 31 cannot be chosen from February | `SeriesDateEditIT.java:262-280` moves the series from March to 31/03 and asserts 16/02, 31/03, 30/04. The claim and AC 6 say "day 31 from February → 28/02, 31/03, 30/04" | Stop and ask (rule 3): correct AC 6 and C6 to the case the interface allows (from March, February keeps its date) and record the user's answer, or change the interface so it can carry the day | |
| After "Só esta" moves the last occurrence past the series' end date, the form refuses every later save of that occurrence unless its date goes back. The diff changed this rule (`earliestDate`), and no check covers it | `transactionForm.ts:174-179`: on reopening, `original.date` is the moved date, so `earliestDate` is the moved date too. Throwaway schema test at HEAD: RECURRING, end 16/06/2026, June moved alone to 02/07 (AC 1 allows another month) and reopened unchanged gives `transactions.form.theEndDateMustBe`. Moving June alone to 18/06 in the same month gives the same refusal. The API accepts both edits | Check the end date against the occurrence's slot, or only when the date changed in this edit; add a schema or drawer test for reopening an occurrence that was moved alone past the end | |
| An end date typed in the same edit as a month change is shifted a second time | Throwaway IT at HEAD: monthly 16/03-16/06/2026, the request's `series.endDate` set to 16/08 and the first occurrence moved to 16/04 gives end 16/09/2026 and 6 rows. `TransactionService.java:642` stores the typed end through `editPattern`, then `TransactionService.java:652` applies `moveSchedule`, which shifts it by the month difference (`RecurrenceDefinition.java:254`). This matters in the owner's case of a start month registered wrong, where the end month is usually wrong too | Shift the end only when the request leaves it as the definition had it, or have the form refuse an end change with a month change as it refuses date with installments. Ask the owner which, then add a check | |
