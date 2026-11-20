# MCP Capture Hub verification

**Verdict**: FAIL
**Proofs**: `proofs.md` at a28e8483
**Verifier**: independent sub-agent (author != verifier)

## Checks

| Check | Test | Holds |
| --- | --- | --- |
| C1 | `McpCaptureHubIT` `createWithoutNamesAttributesTheCaller` | yes - a second member is in the plan, so a split over everyone would fail `containsExactly(ana)` |
| C2 | `McpCaptureHubIT` `createForOneNamedMemberAttributesTheWholeAmount` | yes - both spellings, owner and 100.00 asserted |
| C3 | `McpCaptureHubIT` `createForSeveralNamesSplitsEqually` | yes - exact cents and owners in order, compared with the app's split |
| C4 | `McpCaptureHubIT` `createWithAnUnknownOrAmbiguousNameIsAToolError` | yes for the cases it names (two namesakes by first name); see the finding on a first name that is also another member's full name |
| C5 | `McpCaptureHubIT` `createForSomeoneElseInASingleMemberPlanIsAToolError` | yes |
| C6 | `McpCaptureToolsIT` `createSchemaHasNoSeriesOrSplit` | yes - exact property set and required set |
| C7 | `McpCaptureHubIT` `updateWithCategorySetsItAndKeepsTheRest` | yes - category id, amount, date, description, split mode, participants and item fields |
| C8 | `McpCaptureHubIT` `updateWithRemoveCategoryLeavesItUncategorized` | yes |
| C9 | `McpCaptureHubIT` `updateWithCategoryAndRemoveCategoryIsAToolError` | yes - category and version unchanged |
| C10 | `McpCaptureHubIT` `updateWithACategoryOfTheOtherTypeIsAToolError` | yes - exact message, category and version unchanged |
| C11 | `TransactionListFilterIT` `uncategorizedListsOnlyRowsWithoutCategory` | yes - ids, total and the unfiltered / `false` lists |
| C12 | `McpCaptureHubIT` `listUncategorizedReturnsOnlyRowsWithoutCategory` | yes |
| C13 | `TransactionListFilterIT` `statusFilterFollowsTheReadersToday` | yes - every confirmation x date boundary, each row's own `status`, and the western reader |
| C14 | `McpCaptureHubIT` `listPendingReturnsWhatAwaitsConfirmation` | yes - same ids as the REST filter, plus FORECAST and ACTUAL |
| C15 | `TransactionListFilterIT` `invalidFilterCombinationsAreBadRequest` | yes - status and problem type for both |
| C16 | `McpCaptureHubIT` `listUncategorizedWithACategoryIsAToolError` | yes - `errorText` asserts `isError` |
| C17 | `McpCaptureHubIT` `listedRowsCarryAttributionAndSeries` | yes - all five values the claim names |
| C18 | `McpCaptureHubIT` `deleteASingleRowTrashesIt` | yes - description, count, list and the trash entry's id |
| C19 | `McpCaptureHubIT` `deleteAnOccurrenceDefaultsToThisOneAndHonoursScope` | partly - the default scope holds by the counts, but the THIS_ONE step asserts only "5 left", not that the third is the one gone (a delete of the second occurrence passes all three steps) |
| C20 | `McpCaptureHubIT` `restoreDeletionRestoresAndMapsServiceErrors` | yes - restored count, listed again, second call, other plan, series changed (exact message) |
| C21 | `McpCaptureHubIT` `deleteToolIsDestructiveAndNamesRestore` | yes |
| C22 | `McpCaptureHubIT` `deleteFollowsTheAppsRoleMatrix` | yes - exact messages, rows still listed, own delete succeeds |
| C23 | `OpenApiSnapshotIT` `theGeneratedDocsMatchTheCommittedSnapshot` | yes - the committed snapshot carries `status` and `uncategorized` |
| C24 | `TransactionListFilterIT` `filtersOnAnotherPlanAreNotFound` | yes |
| C25 | `McpCaptureHubIT` `updateOfARowSharedWithAFormerMemberIsAToolError` | yes - added in the fix pass; asserts the message, category, participants and version unchanged (author-judged, no second Verifier) |
| C26 | `McpCaptureHubIT` `contributorCanAttributeOnlyToThemselves` | yes - added in the fix pass; asserts the refusal message, no row created, and success with the caller's own name (author-judged) |

Own examples run at a28e8483 as a throwaway `VerifierProbeIT` (deleted): equal split of 100.00 over seven members
(14.29 x4, 14.28 x3) and of 10.00 in a spoken order other than the plan's (the first spoken gets the cent) match the
app exactly; 0.01 over two matches the app (0.01 / 0.00); `"marina costa"` and `"MARÍNA SOUZA"` pick the right namesake;
PENDING / FORECAST through the MCP for Pacific/Kiritimati and Pacific/Pago_Pago readers follow their own today; on an
open monthly series of 16 rows THIS_AND_FOLLOWING on the second trashes 15 and restores 15, ALL trashes and restores
16; viewer restore and a contributor restoring the owner's deletion are refused with nothing restored; ids from
another plan answer `Transaction N not found.` with no data of that plan.

## Findings

| Finding | Evidence | Fix | Closed |
| --- | --- | --- | --- |
| A first name that is also another member's full name is resolved silently instead of refused (AC 4): in a plan with "Ana Lima" (the caller) and a member named just "Ana", `attributedTo: ["ana"]` puts the whole amount on the member "Ana", and the result's `attributedTo: ["Ana"]` reads the same for either, so the wrong attribution is invisible | `McpMemberResolver.java:50-57` - the full-name pass runs first and the first-name pass only when it found nothing; probe: create answered `isError: false` | let the full name win only when the spoken name has more than one word; for a one-word name, match full and first names together, so two matches are the "Several members" error; add the case to C4 | 76c53097 - a one-word name is matched against full and first names together; two members is the tool error (C4) |
| Categorizing a row shared with a member who has left the plan fails, so the clean-up pass (AC 6) cannot fix those rows | `McpUpdateCopy.java:67` resends the stored participants and `TransactionService.java:281` refuses a non-member; probe: `update_transaction {category: "Mercado"}` on a row split with a removed member answered `Participant is not a member of the plan.` | decide the rule with the owner: either keep the stored shares of former members when an update leaves the split unchanged (service-level, also fixes the app's edit), or record it as a known limit with a tool message that says to edit it in the app; add a check either way | 101e5302 - stated limit: a tool error says the row is shared with a former member and changes nothing (C25); keeping a former member's share is an owner decision |
| The attribution role rule has no check: a CONTRIBUTOR's `create_transaction` with another member in `attributedTo` is refused only by the service, and nothing proves the tool keeps it (Surface lists CONTRIBUTOR for create) | probe: `Only owners and editors can attribute a transaction to other members.`; no row in `McpCaptureHubIT` or `roleMatrixForWrites` names `attributedTo` | add a check: CONTRIBUTOR with `attributedTo: ["Ana"]` is a tool error with that message and creates nothing; with their own name it succeeds | 84e7aab9 - C26: a contributor naming another member gets the tool error and nothing is created; their own name succeeds |
| `restore_deletion` has no role check through the MCP (Surface: "as the app's restore") | C20 covers outcomes only; probe: viewer `Viewers cannot use the transaction trash.`, contributor on the owner's deletion `Trash entry 1 not found.` | add the VIEWER and CONTRIBUTOR-on-another's-deletion rows to C22's test (or a sibling) asserting the message and that the row stays trashed | 6005c175 - C22 covers `restore_deletion` for a viewer and a contributor on another's deletion |
| C19's THIS_ONE step does not prove which occurrence went | `McpCaptureHubIT.java:451-452` asserts `count` 1 and 5 rows left; trashing the second instead of the third passes every later step | assert the third's id is absent from `list_transactions` and the other five present | 2b4e43a8 - C19 asserts the third occurrence's id is gone and the other five are listed |
