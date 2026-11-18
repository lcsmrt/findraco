# Transaction Trash checks

Build: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -DskipITs -Dsurefire.skip=true; cd frontend && pnpm lint; cd frontend && pnpm build; cd frontend && node scripts/check-siblings.ts
Run unit: cd frontend && pnpm exec vitest run --project=unit --reporter=verbose src/features/transactions/TransactionsPage.test.tsx src/features/plans/components/PlanTrashSection.test.tsx src/api/services/useTransactionService.test.ts
Run stories: cd frontend && pnpm exec vitest run --project=storybook --reporter=verbose src/features/plans/components/PlanTrashListView.stories.tsx
Plan: `.specs/features/transaction-trash/plan.md`

28 checks in 4 slices · 4 one-way doors · 0 open, of which 0 block

## Checks

### S1 - Delete goes to the trash

**C1** [x] - Deleting a single R$ 50 November expense answers 200 with a `deletionId`; the list no longer has it and November's expense total drops by 50.00 (AC 1)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionTrashIT#deleteAnswersDeletionIdAndHidesTheRow' -Dsurefire.skip=true

**C2** [x] - "This and following" from parcel 4 of a 6-parcel series creates one deletion with 3 rows; parcels 1–3 stay listed (AC 2)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionTrashIT#seriesDeleteMakesOneDeletionForEveryRowInScope' -Dsurefire.skip=true

**C3** [x] - A single `DELETE …/transaction/{id}` of a series occurrence records its date as an exception; a following "all" edit of the series does not recreate it (AC 3)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionTrashIT#singleDeleteOfAnOccurrenceIsNotRecreatedByASeriesEdit' -Dsurefire.skip=true

**C4** [x] - A trashed transaction answers 404 `transaction-not-found` on get, update, confirm and delete, and deleting a series trashed whole answers 404 `series-not-found` (AC 4)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionTrashIT#trashedTransactionIsNotFoundById' -Dsurefire.skip=true

**C5** [x] - A series trashed whole gets no new occurrence from the top-up job or the read horizon (AC 5)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionTrashIT#trashedSeriesIsNotToppedUp' -Dsurefire.skip=true

**C6** [x] - With one active and one trashed expense in a category, the summary, person breakdown, monthly trend, category spending, category usage count and a list search by description each count only the active one (AC 6)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionTrashIT#trashedRowsCountInNoReader' -Dsurefire.skip=true

### S2 - Undo and restore

**C7** [x] - Restoring a single deletion brings the row back with the same amount, date, category, participants and items, answers `restored: 1`, and the deletion leaves the trash (AC 7)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionTrashIT#restoreBringsBackTheOriginalRow' -Dsurefire.skip=true

**C8** [x] - Restoring an "only this" deletion removes its exception (AC 8)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionTrashIT#restoreOnlyThisRemovesTheException' -Dsurefire.skip=true

**C9** [x] - Restoring "this and following" from parcel 4 of 6 gives 6 parcels and a parcel count of 6; for an open-ended series the end date is cleared again (AC 8)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionTrashIT#restoreFollowingPutsBackTheSeriesEnd' -Dsurefire.skip=true

**C10** [x] - Restoring an "all" deletion reactivates the series: its rows list again and the top-up generates for it again (AC 8)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionTrashIT#restoreAllReactivatesTheSeries' -Dsurefire.skip=true

**C11** [x] - After a series deletion, an edit of that series makes its restore answer 409 `trash-series-changed` and leaves rows and series unchanged (AC 9)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionTrashIT#restoreAfterTheSeriesChangedIsAConflict' -Dsurefire.skip=true

**C12** [x] - Restore answers 404 for an unknown id, a deletion already restored, and another plan's deletion (AC 10)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionTrashIT#restoreOfAMissingDeletionIsNotFound' -Dsurefire.skip=true

**C13** [x] - An editor deletes the owner's row, is changed to contributor, and the restore answers 403 with the row still trashed (AC 11)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionTrashIT#restoreWithoutRightsOnEveryRowIsDenied' -Dsurefire.skip=true

**C14** - Deleting from the Transactions screen shows a toast with "Undo"; using it calls restore for that `deletionId` and shows "Transaction restored." (AC 12)
Proof: run unit | ✓ TransactionsPage > undo in the delete toast restores the transaction

**C15** - Deleting a series from the Transactions screen offers the same "Undo" for the series deletion (AC 12)
Proof: run unit | ✓ TransactionsPage > undo in the series delete toast restores the series

### S3 - The plan's trash

**C16** [x] - The trash lists deletions newest first; an "all" delete of a 6-parcel R$ 300 series is one entry with count 6, amount 1800.00, `deletedBy` and `expiresAt` = deletion + 30 days (AC 13)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionTrashIT#trashListsDeletionsNewestFirstWithTotals' -Dsurefire.skip=true

**C17** [x] - A contributor's trash lists only the deletions they made (AC 14)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionTrashIT#contributorSeesOnlyTheirOwnDeletions' -Dsurefire.skip=true

**C18** [x] - The trash list and restore answer each role as the matrix says (VIEWER 403, non-member 404), and both routes have a matrix row (AC 14)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='PlanAuthorizationMatrixIT#eachRouteAnswersEachRoleAsTheMatrixSays+everyEndpointOfTheApplicationHasAMatrixRowOrIsListedAsNotRoleScoped' -Dsurefire.skip=true

**C19** - A viewer sees no trash section on the Plans screen (AC 14)
Proof: run unit | ✓ PlanTrashSection > hides the trash from a viewer

**C20** - Each trash entry shows its description, row count, total, who deleted and the expiry date (AC 13)
Proof: run stories | ✓ PlanTrashListView.stories.tsx > Entries

**C21** - Using "Restaurar" on an entry calls restore, the entry leaves the list and the transactions queries are refetched (AC 15)
Proof: run unit | ✓ PlanTrashSection > restoring an entry removes it and refreshes transactions

**C22** - An empty trash shows "Nothing in the trash. What you delete stays here for 30 days." (AC 16)
Proof: run stories | ✓ PlanTrashListView.stories.tsx > Empty

**C23** - A failed trash request shows the error state with a retry, not the empty message (AC 17)
Proof: run stories | ✓ PlanTrashListView.stories.tsx > Load Error

### S4 - Retention and the edges

**C24** [x] - The purge deletes a deletion made exactly 30 days ago with its rows, participants, items and trashed series, and keeps one made 29 days 23 h ago (AC 18)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionTrashPurgeIT#purgesAtThirtyDaysAndKeepsYounger' -Dsurefire.skip=true

**C25** [x] - Every foreign key to `plans` cascades, `transaction_deletions.plan_id` included (AC 19)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='PlanSchemaIT#everyForeignKeyToPlansCascadesOnDelete' -Dsurefire.skip=true

**C26** [x] - Importing the same statement again after trashing one of its rows imports nothing and reports that row as already imported (AC 20)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionTrashIT#reimportSkipsATrashedRow' -Dsurefire.skip=true

**C27** [x] - Deleting a category used only by a trashed row succeeds without a target; with a target, trashed rows and their items move to it (AC 21)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionTrashIT#categoryDeleteIgnoresAndMovesTrashedRows' -Dsurefire.skip=true

**C28** [x] - Restoring after its category was deleted with a target brings the row back in the target; without a target, with no category (AC 22)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionTrashIT#restoreAfterCategoryDeleteUsesTheTarget' -Dsurefire.skip=true

## Coverage

| Set (size) | Member -> proof | Unproven |
| --- | --- | --- |
| delete scopes (4) | single C1 · only this C8 · this and following C2, C9 · all C10 | - |
| readers that must skip trashed rows (9) | list/search C6 · get/update/confirm/delete by id C4 · summary C6 · person breakdown C6 · monthly trend C6 · category spending C6 · category usage C6, C27 · series regeneration C3, C5 · importer dedup C26 | - |
| `DELETE /plan/{planId}/transaction/{id}` statuses (3) | 200 C1 · 404 C4 · 403 C18 | - |
| `DELETE /plan/{planId}/transaction/series/{seriesId}` statuses (3) | 200 C2 · 404 C4 · 403 C18 | - |
| `GET /plan/{planId}/transaction/trash` statuses (3) | 200 C16 · 403 C18 · 404 C18 | - |
| `POST /plan/{planId}/transaction/trash/{deletionId}/restore` statuses (4) | 200 C7 · 404 C12 · 409 C11 · 403 C13, C18 | - |
| purge boundary, AC 18 (2 examples) | 30 days C24 · 29 days 23 h C24 | - |
| doors (4) | deletion record C2, C16 · `transactions.deletion_id` cascade C24 · `recurrence_definitions.deletion_id` C5, C10, C24 · 200 body C1, C14 | - |
| trash screen states (4) | entries C20 · empty C22 · error C23 · hidden for viewer C19 | - |

## Swept

- validation: existing - `size` bounded 1-100 like `TransactionFilter`, checked by `BoundedInputsIT` once the route exists
- failure modes: C11 (restore changes nothing on conflict), C13 (nothing restored on denial)
- idempotency: C12 (a second restore of the same deletion is 404, not a double insert)
- authorization: C13, C17, C18, C19
- concurrency: existing - series delete and restore lock the definition with `findByPlanAndSeriesIdForUpdate`; restore of a single row takes the deletion row `FOR UPDATE` so two restores cannot both pass; covered by C12's second-restore case
- data lifecycle: C7 (values come back unchanged), C24, C25
- dependency failure: n/a - no external call
- state transitions: C1, C7, C11, C24
- observability: n/a - the purge logs deletion ids only, like `PlanPurgeJob`; no requirement beyond it

## Handoff

- **Settled mid-build:** none
- **Dispatched:** backend builder (Sonnet, worktree /home/lcs/dev/findraco-trash) at 2e925704
- **Boundary:** C1–C13, C16–C18, C24–C28 closed at bac5414c
- **Abandoned:** -
- **Walked:** not yet
