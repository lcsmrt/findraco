# Phase 1 follow-ups verification

**Verdict**: FAIL
**Proofs**: `proofs.md` at 5dd4f403
**Verifier**: independent sub-agent (author != verifier)

## Checks

| Check | Test | Holds |
| --- | --- | --- |
| C1 | `TrashRuleRevisionIT` `restoreAfterAnotherOnlyThisDeleteSucceeds` | yes - asserts 200, `restored` 1 and March listed; the lock-version rule it replaces fails it (April's exception moves the version) |
| C2 | `TrashRuleRevisionIT` `restoreAfterAnOnlyThisEditSucceeds` | yes - 200, March 80.00, May 95.00 |
| C3 | `TrashRuleRevisionIT` `restoreAfterAnAmountEditConflicts` | yes - 409 `trash-series-changed`, deletion row kept, March absent, exception kept |
| C4 | `TrashRuleRevisionIT` `restoreAfterATailWasDeletedSucceeds` | yes - March 200, then June 200, both listed, and the definition's `endDate` is back to START+7 months |
| C5 | `TrashRuleRevisionIT` `restoreAfterAnyPatternChangeConflicts` | yes - 409 `trash-series-changed` for each of the 4; the end case moves the end to February, before March, so it is refused by `covers`, not by the revision |
| C6 | `TrashRuleRevisionIT` `flagOnlyEditKeepsTheDeletionRestorable` | yes - asserts the definition's flag true before and false after the edit, then restore 200 and March listed |
| C7 | `MigrationsIT` `ruleRevisionResetsExistingDeletions` | yes - column `NO`/`0`, revision 0, `definition_version` 3 -> 0 |
| C8 | `FormerMemberEditIT` `editKeepingAFormerMemberRecalculatesTheirShare` | yes - 200, Ana 60.00, owner 60.00, stored and returned |
| C9 | `FormerMemberEditIT` `seriesEditKeepingAFormerMemberSucceeds` | yes - 200, 3 occurrences each with Ana 45.00 |
| C10 | `FormerMemberEditIT` `formerMemberCannotJoinANewRow` | yes for a one-off row - edit and create 422 `participant-not-member`, row and version unchanged; the series path is not covered, see findings |
| C11 | `McpCaptureHubIT` `updateOfARowSharedWithAFormerMemberKeepsTheirShare` | yes - new description stored, Marina kept at 50.00 |
| C12 | `AttributionFields.stories.tsx` `Former Participant`; `TransactionFormDrawer.test.tsx` `keeps a former member's share when saving` | yes - checkbox "Ana Lima (no longer in the plan)" checked, share R$ 60,00 shown, PUT carries memberId 9 with its share; the pt-BR copy is claimed as the same key, not asserted |
| C13 | `TrashRuleRevisionIT` `restoringOneDeletionKeepsAnotherRestorable` | yes - June 200 then March 200, both listed |
| C14 | `TransactionFormDrawer.test.tsx` `shows the split of a row shared with a former member in a one-member plan` | yes - former checkbox present with one member, PUT amount 120 with both memberIds (fails if `showsAttribution` hides the fields) |
| C15 | `TrashRuleRevisionIT` `restoringTheTailFirstKeepsAnEarlierDeletionRestorable` | yes - June 200, then March 200, both listed; fails under the earlier code (March 409, my round-1 example) |
| C16 | `TrashRuleRevisionIT` `parcelsChangeBlocksTheRestore` | yes - 8 parcels: 409 `trash-series-changed` (parcel 3 is still inside the series, so only the revision can refuse it); 6 parcels resent: 200 and parcel 3 listed |
| C17 | `FormerMemberEditIT` `formerMemberCannotReturnToASeriesOccurrence` | yes - "only this" re-add 422 `participant-not-member` and the occurrence keeps only the owner; "this and following" from a pivot carrying Ana on a definition without her 422; both were 200 before the fix |
| C18 | `TrashRuleRevisionIT` `restoringATailAfterItsEndMovedConflicts` | yes - the "all" edit resends the same amount, description and split, so the revision does not move and the 409 can only come from the cut end no longer holding |

## Findings

| Finding | Evidence | Fix | Closed |
| --- | --- | --- | --- |
| Medium - a series edit puts a former member back on an occurrence that does not carry them (AC 7) | `TransactionService.java:523-531` lets any member on the definition through for a `THIS_ONE` edit. Throwaway IT: series owner+Ana; May edited "only this" to the owner alone; Ana leaves; May edited "only this" with owner+Ana -> 200, May shares `[owner=40.0, Ana=40.0]` (AC 7 says 422). The mirror case also passes: a `THIS_AND_FOLLOWING` edit from a pivot that carries Ana writes her onto the definition, so later generated occurrences take her | for `THIS_ONE`, keep only the pivot's participants; for `THIS_AND_FOLLOWING`/`ALL`, decide whether the definition alone, or the definition plus the in-scope rows, counts. Add a series case to C10 | 8802eb2b |
| Medium - restoring a tail does not give the series back its revision, so an older deletion stays locked after the tail comes back | `RecurrenceDefinition.java:221` raises the revision on the cut, and `restoreEnd` (`:238`) leaves it raised. Throwaway IT: March deleted "only this", then June and following deleted, June restored 200, then March restored -> 409 `trash-series-changed`, although the series has its original amount, rule and end again. This is the order opposite to C13, and a counter cannot get both orders right: lowering it on restore breaks C13 | decide with the owner whether "the end changed" includes an end that was cut and then put back. If not, compare the deletion against the end it saw (for example store the end with the revision and accept a restore when only the end differs and the current end equals the recorded one), and add the reverse-order case as a check | 8802eb2b |
| Low - C6 does not flip the flag it claims to flip | `TrashRuleRevisionIT.java:191` sends `requiresConfirmation: true` to a series created with the default true, so `changeRequiresConfirmation` never runs and the test would pass if a flag change raised the revision. A throwaway run with `false` -> edit 200, restore 200, so the code itself holds | send `false` (or create the series with `false`) and assert the definition's flag changed | 8802eb2b |
| Low - AC 2 names parcels, and no check proves a parcel-count change blocks a restore | C5 covers description, category, split and end date; the Coverage set "block it (6)" leaves parcels out. Throwaway IT: 6-parcel installment, parcel 2 deleted, "all" edit to 8 parcels -> restore 409; the same values resent -> restore 200, so the code holds | add an installment row (parcels 6 -> 8) to C5's table | 8802eb2b |
| Low - C12 claims the pt-BR label "(fora do plano)", and its tests assert only the English one | `TransactionFormDrawer.test.tsx:789` and `AttributionFields.stories.tsx:125` look for "(no longer in the plan)"; the pt-BR copy in `pt-BR.json` is proved only by key parity | reword C12 to the English label, or add one assertion under the Portuguese locale, as the existing `TransactionFormDrawer language` test does | 8802eb2b |
