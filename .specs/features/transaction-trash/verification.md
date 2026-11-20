# Transaction Trash verification

**Verdict**: FAIL
**Proofs**: `proofs.md` at e1dcbd01 (invalid: written on a dirty tree, see the first finding; the previous clean run at 61128784 was 33 pass / 0 fail)
**Verifier**: independent sub-agent (author != verifier)

## Checks

| Check | Test | Holds |
| --- | --- | --- |
| C1 | `TransactionTrashIT` `deleteAnswersDeletionIdAndHidesTheRow` | yes - 200 + numeric `deletionId`, list without the row, November expenses 150.00 -> 100.00 |
| C2 | `TransactionTrashIT` `seriesDeleteMakesOneDeletionForEveryRowInScope` | yes - one deletion, 3 rows on it, parcels 1-3 listed |
| C3 | `TransactionTrashIT` `singleDeleteOfAnOccurrenceIsNotRecreatedByASeriesEdit` | yes - "all" edit yields Jan, Feb, Apr, May; exception 2026-03-15 recorded |
| C4 | `TransactionTrashIT` `trashedTransactionIsNotFoundById` | yes - get/update/confirm/delete 404 `transaction-not-found`; series delete 404 `series-not-found` |
| C5 | `TransactionTrashIT` `trashedSeriesIsNotToppedUp` | yes - row count unchanged and zero active rows after top-up to +3y and horizon to +5y |
| C6 | `TransactionTrashIT` `trashedRowsCountInNoReader` | no - summary `actualExpenses` and item-level category spending are not asserted; the `deletion IS NULL` on `DashboardReportRepository.java:38` and `CategorySpendingRepository.java:37` can be removed with the test green |
| C7 | `TransactionTrashIT` `restoreBringsBackTheOriginalRow` | yes - amount, date, category, participants (equal to before), item, `restored: 1`, no deletion left |
| C8 | `TransactionTrashIT` `restoreOnlyThisRemovesTheException` | yes - exceptions 1 -> 0, 5 rows listed including March |
| C9 | `TransactionTrashIT` `restoreFollowingPutsBackTheSeriesEnd` | yes - parcels 3 -> 6, 6 rows, `restored: 3`; open-ended `endDate` set then null again |
| C10 | `TransactionTrashIT` `restoreAllReactivatesTheSeries` | yes - all rows listed again and top-up adds rows after the restore |
| C11 | `TransactionTrashIT` `restoreAfterTheSeriesChangedIsAConflict` | yes - 409 `trash-series-changed`, 3 rows still trashed, parcels and deletion unchanged (edit case only, see findings) |
| C12 | `TransactionTrashIT` `restoreOfAMissingDeletionIsNotFound` | yes - unknown id, other plan, second restore each 404 `trash-entry-not-found` |
| C13 | `TransactionTrashIT` `restoreWithoutRightsOnEveryRowIsDenied` | yes - 403 `not-transaction-creator`, row still on the deletion |
| C14 | `TransactionsPage.test.tsx` `undo in the delete toast restores the transaction` | yes - writes are exactly DELETE then POST `trash/7/restore`, "Transaction restored." shown |
| C15 | `TransactionsPage.test.tsx` `undo in the series delete toast restores the series` | yes - DELETE series then POST `trash/8/restore`, "Transaction restored." shown |
| C16 | `TransactionTrashIT` `trashListsDeletionsNewestFirstWithTotals` | yes - series entry first (real clock, distinct `deletedAt`), count 6, 1800.00, `deletedBy`, `expiresAt` = `deletedAt` + 30 d |
| C17 | `TransactionTrashIT` `contributorSeesOnlyTheirOwnDeletions` | yes - contributor sees 1 (theirs), owner 2 |
| C18 | `PlanAuthorizationMatrixIT` `eachRouteAnswersEachRoleAsTheMatrixSays` + `everyEndpointOfTheApplicationHasAMatrixRowOrIsListedAsNotRoleScoped` | yes - trash GET 200/200/200/403, restore 200/200/404/403, non-member 404 |
| C19 | `PlanTrashSection.test.tsx` `hides the trash from a viewer` | yes - no "Trash" text and no request to `/trash` |
| C20 | `PlanTrashListView.stories.tsx` `Entries` | yes - description, "6 transactions", 1.800,00, "Deleted by Ana on 10/11/2026", "Removed for good on 10/12/2026" |
| C21 | `PlanTrashSection.test.tsx` `restoring an entry removes it and refreshes transactions` | yes - POST `trash/9/restore`, Gym gone, Rent kept, transactions list refetched, success toast |
| C22 | `PlanTrashListView.stories.tsx` `Empty` | yes - exact empty copy |
| C23 | `PlanTrashListView.stories.tsx` `Load Error` | yes - alert with the error copy, no empty copy, Retry calls `onRetry` |
| C24 | `TransactionTrashPurgeIT` `purgesAtThirtyDaysAndKeepsYounger` | yes - exactly-30-day row and series purged with participants, items and definition; 29 d 23 h kept |
| C25 | `PlanSchemaIT` `everyForeignKeyToPlansCascadesOnDelete` | no - asserts that no non-cascading FK to `plans` exists, not that `transaction_deletions.plan_id` has one; without the FK the test stays green |
| C26 | `TransactionTrashIT` `reimportSkipsATrashedRow` | yes - `imported` 0, `skippedDuplicates` 2, one row listed |
| C27 | `TransactionTrashIT` `categoryDeleteIgnoresAndMovesTrashedRows` | yes - 204 without target, row and item category NULL; with target both moved |
| C28 | `TransactionTrashIT` `restoreAfterCategoryDeleteUsesTheTarget` | yes - restored row in the target; without target, no category |
| C29 | `TransactionTrashIT` `restoreOccurrenceAfterTheSeriesCategoryWasDeleted` | yes - "only this" and "this and following" restore 200 in the target, parcels 6; edited series still 409 after the move |
| C30 | `PlanTrashListView.stories.tsx` `Newest Only` | yes - added in the fix pass for the 50-row finding; asserts the exact sentence for 2 of 60, and `Entries` asserts it is absent when all are loaded (author-judged, no second Verifier) |

Own examples, run at e1dcbd01 as a throwaway IT (deleted afterwards), all as the plan says:
"this and following" from parcel 1 of 6 (trashes the series whole: one entry, 6 rows, 1800.00, `series-not-found`
on the definition; restore gives 6 rows and parcel count 6); purge of a "this and following" tail (30 d + 1 s) and the
later "all" of the same series (30 d) in one run (both gone, definition gone, no FK error); a trashed income and a
trashed row whose item carries another category count in no total, actual total, trend, item-level spending or item
usage; a contributor restores their own deletion (200, `restored: 1`).

## Findings

| Finding | Evidence | Fix | Closed |
| --- | --- | --- | --- |
| `proofs.md` at e1dcbd01 is not a valid run: 12 checks and the build fail on Spotless over the Verifier's throwaway file, written while the run was in progress | `proofs.md` line 4 `Tree: dirty - .../VerifierScratchIT.java`; lines 309-316 Spotless violations in that file | the file and its `target/` outputs are deleted; rerun `check_proofs.py transaction-trash` on the clean tree | ba2ed305 - proofs rerun on a clean tree: 36 pass, 0 fail (`proofs.md`) |
| C6 leaves two of the filters it claims unguarded: the summary's actual (confirmed / due) totals and item-level category spending | `TransactionTrashIT.java:215-231` asserts `totalExpenses`, `personBreakdown[0].expense`, the trend and category-level `spent` only; the trashed row has no item; `DashboardReportRepository.java:38` and `CategorySpendingRepository.java:37` filters can be dropped with C6 green | in C6 also assert `actualExpenses` = 100.00 and give the trashed row an item in a second category whose `spent` stays 0 | e6ca3732 - C6 asserts `actualExpenses` and a trashed item's category staying at 0 |
| AC 9 "or deleted again" has no check, and the behaviour it fixes is harsher than its rationale: once a second occurrence of a series is deleted, the first deletion answers 409 and stays 409 even after the second is restored (restore bumps the version again). An "only this" edit of any other occurrence does the same (`claimVersion` force-increments the definition) | throwaway example: delete March, delete April (both single), restore March -> 409 `trash-series-changed`; restore April -> 200; restore March -> 409. `TransactionTrashService.java:160`, `TransactionService.java:316-320`, `:497` | add the "deleted again" case to C11's test; and put to the user whether a later delete or an "only this" edit should block restoring an older deletion (the rationale, a parcel past a new end, applies only to pattern and end changes). Until then the trash still offers "Restaurar" on entries that can never be restored | e6ca3732 - C11 gains `restoreAfterTheSeriesWasDeletedAgainIsAConflict` (AC 9 as written); whether a later delete or an only-this edit should block older restores is put to the user in the report |
| C25 does not prove `transaction_deletions.plan_id` cascades: it only proves no FK to `plans` is non-cascading; nothing asserts the FK exists | `PlanSchemaIT.java:18-25`; `MigrationsIT` lists no `transaction_deletions` constraint; `PlanPermanentDeletionIT.java:39-63` counts per table but not `transaction_deletions`, although its plan already holds a deletion (`:186-192`) | add `transaction_deletions` to `PlanPermanentDeletionIT`'s per-table counts (or assert `fk_transaction_deletions_plan` in `MigrationsIT`) and name that test in C25 | e6ca3732 - `PlanPermanentDeletionIT` counts `transaction_deletions`; C25 names it |
| A contributor restoring their own deletion (AC 14 / Surface "who may modify every row") has no check: C13 is the 403 case, the matrix row is the 404 case | `TransactionTrashIT.java:398-415`; `PlanAuthorizationMatrixIT` restore row (contributor 404 on the owner's deletion) | add the 200 case (contributor deletes and restores their own row) to C17's test | e6ca3732 - C17's test restores the contributor's own deletion (200) |
| The SPA trash shows only the 50 newest deletions, with no paging or hint; older ones stay restorable through the API but invisible on the Plans screen (AC 13 "list the plan's deletions") | `PlanTrashSection.tsx:9` `TRASH_PAGE = { page: 0, size: 50 }` | page the list (load more) or say in the UI that only the newest 50 are shown | 23eb5609 - the trash card says "Showing the N newest of M deletions" when more exist (C30) |
