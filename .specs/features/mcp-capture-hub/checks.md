# MCP Capture Hub checks

Build: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -DskipITs -Dsurefire.skip=true
Plan: `.specs/features/mcp-capture-hub/plan.md`

25 checks in 3 slices · 2 one-way doors · 0 open

## Checks

### S1 - Create for the right people

**C1** - `create_transaction` without `attributedTo` stores the whole amount on the caller, and the result's `attributedTo` is the caller's first name (AC 1)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureHubIT#createWithoutNamesAttributesTheCaller' -Dsurefire.skip=true

**C2** - `create_transaction` with `attributedTo: ["marina"]`, and again with `["Marína Souza"]`, stores the whole amount on Marina and nothing on the caller (AC 2)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureHubIT#createForOneNamedMemberAttributesTheWholeAmount' -Dsurefire.skip=true

**C3** - `create_transaction` of R$ 100,00 with three names stores 33,34 · 33,33 · 33,33, the same cents the app's equal split stores for the same three members (AC 3)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureHubIT#createForSeveralNamesSplitsEqually' -Dsurefire.skip=true

**C4** - `create_transaction` with a name that matches no member, with one that matches two, and with a one-word name that is one member's first name and another member's whole name (`"ana"` for "Ana Lima" and "Ana"), answers a tool error whose text lists the plan's members, and the plan's transaction count is unchanged (AC 4)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureHubIT#createWithAnUnknownOrAmbiguousNameIsAToolError' -Dsurefire.skip=true

**C5** - In a single-member plan, `create_transaction` with `attributedTo: ["Marina"]` answers the same tool error and creates nothing; with the caller's own name it succeeds (AC 5)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureHubIT#createForSomeoneElseInASingleMemberPlanIsAToolError' -Dsurefire.skip=true

**C6** - The `create_transaction` schema lists exactly `type`, `amount`, `description`, `date`, `category`, `plan`, `attributedTo`, and still no series or exact-split field (AC 1-3; AD-029)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureToolsIT#createSchemaHasNoSeriesOrSplit' -Dsurefire.skip=true

### S2 - Fix and find

**C7** - `update_transaction` with `category: "Mercado"` on an uncategorized row with an equal split and an item sets Mercado and keeps amount, date, description, split and item unchanged (AC 6)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureHubIT#updateWithCategorySetsItAndKeepsTheRest' -Dsurefire.skip=true

**C8** - `update_transaction` with `removeCategory: true` leaves the row with no category (AC 7)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureHubIT#updateWithRemoveCategoryLeavesItUncategorized' -Dsurefire.skip=true

**C9** - `update_transaction` with both `category` and `removeCategory: true` answers a tool error and the row's category and version are unchanged (AC 8)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureHubIT#updateWithCategoryAndRemoveCategoryIsAToolError' -Dsurefire.skip=true

**C10** - `update_transaction` of a DEBIT with an income category answers a tool error carrying the `transaction-category-type-mismatch` message, and the row is unchanged (AC 9)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureHubIT#updateWithACategoryOfTheOtherTypeIsAToolError' -Dsurefire.skip=true

**C11** - `GET …/transaction?uncategorized=true` on a plan with two uncategorized and three categorized rows answers `200` with exactly the two (AC 10)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionListFilterIT#uncategorizedListsOnlyRowsWithoutCategory' -Dsurefire.skip=true

**C12** - `list_transactions` with `uncategorized: true` returns exactly the uncategorized rows (AC 10)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureHubIT#listUncategorizedReturnsOnlyRowsWithoutCategory' -Dsurefire.skip=true

**C13** - `GET …/transaction?status=` returns, against the reader's today: `PENDING` the confirmation-required forecasts dated before today; `FORECAST` the other forecasts, a confirmation-required bill dated today included; `ACTUAL` the confirmed rows and automatic rows dated up to today - each row listed under exactly the status `Transaction.status(today)` gives it; a reader in a zone where the overdue bill's date has not come yet sees it under `FORECAST` (AC 11)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionListFilterIT#statusFilterFollowsTheReadersToday' -Dsurefire.skip=true

**C14** - `list_transactions` with `status: PENDING` returns the same rows as the REST filter (AC 11)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureHubIT#listPendingReturnsWhatAwaitsConfirmation' -Dsurefire.skip=true

**C15** - `GET …/transaction?uncategorized=true&categoryId=…` answers `400`, and `status=LATER` answers `400` (AC 12; Surface)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionListFilterIT#invalidFilterCombinationsAreBadRequest' -Dsurefire.skip=true

**C16** - `list_transactions` with `uncategorized: true` and a `category` answers a tool error (AC 12)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureHubIT#listUncategorizedWithACategoryIsAToolError' -Dsurefire.skip=true

**C17** - Listed rows carry `attributedTo` (first names: `["Ana"]` alone, `["Ana","Marina"]` split) and `series`: `"3/6"` for the third of six installments, `"monthly"` for an open monthly series, null for a single row (AC 13)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureHubIT#listedRowsCarryAttributionAndSeries' -Dsurefire.skip=true

**C25** - `update_transaction` on a row shared with someone who has left the plan answers the tool error "This transaction is shared with someone who is no longer in the plan, so it cannot be changed through Claude." and the row and its version are unchanged (AC 6; Out of scope)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureHubIT#updateOfARowSharedWithAFormerMemberIsAToolError' -Dsurefire.skip=true

### S3 - Delete a mistake, safely

**C18** - `delete_transaction` on a single row answers `deletionId`, `description`, `count: 1`; the row leaves `list_transactions` and appears in `GET …/transaction/trash` under that `deletionId` (AC 14)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureHubIT#deleteASingleRowTrashesIt' -Dsurefire.skip=true

**C19** - `delete_transaction` on the third of six installments without `scope` trashes only it (`count: 1`, five rows left); with `THIS_AND_FOLLOWING` on the fourth, `count: 3`; with `ALL`, every row of the series (AC 15)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureHubIT#deleteAnOccurrenceDefaultsToThisOneAndHonoursScope' -Dsurefire.skip=true

**C20** - `restore_deletion` of a `deletionId` answers `restored: 1` and the row is listed again; a second call, and an id from another plan, answer a tool error with the not-found message; a deletion whose series was edited since answers a tool error with the `trash-series-changed` message (AC 16)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureHubIT#restoreDeletionRestoresAndMapsServiceErrors' -Dsurefire.skip=true

**C21** - In `tools/list`, `delete_transaction` has `annotations.destructiveHint: true` and a description containing "30 days" and "restore_deletion" (AC 17)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureHubIT#deleteToolIsDestructiveAndNamesRestore' -Dsurefire.skip=true

**C22** - A CONTRIBUTOR deleting another member's row, and a VIEWER deleting any row, through `delete_transaction` get a tool error and the row stays listed; a CONTRIBUTOR deleting their own row succeeds (AC 18)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureHubIT#deleteFollowsTheAppsRoleMatrix' -Dsurefire.skip=true

**C23** - The committed `backend/openapi.json` matches the generated docs with the new `status` and `uncategorized` parameters (Changes underneath: contract)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='OpenApiSnapshotIT#theGeneratedDocsMatchTheCommittedSnapshot' -Dsurefire.skip=true

**C24** - `GET …/transaction?uncategorized=true&status=PENDING` on a plan the caller is not a member of answers `404` (Surface)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionListFilterIT#filtersOnAnotherPlanAreNotFound' -Dsurefire.skip=true

## Coverage

| Set (size) | Member -> proof | Unproven |
| --- | --- | --- |
| `GET /plan/{planId}/transaction` statuses (3) | 200 C11, C13 · 400 C15 · 404 C24 | - |
| MCP `create_transaction` cases (5) | no names C1 · one name C2 · several names C3 · unknown, ambiguous or a first name that is another's whole name C4 · someone else in a single-member plan C5 | - |
| MCP `update_transaction` cases (5) | `category` C7 · `removeCategory` C8 · both C9 · type mismatch C10 · row shared with a former member C25 | - |
| MCP `list_transactions` new params (2) | `status` C14 · `uncategorized` C12, C16 | - |
| MCP `delete_transaction` scopes (3) | THIS_ONE (default) C19 · THIS_AND_FOLLOWING C19 · ALL C19 · single row C18 | - |
| MCP `restore_deletion` outcomes (3) | restored C20 · not found C20 · series changed C20 | - |
| status values, AC 11 (3) | ACTUAL C13 · FORECAST C13 · PENDING C13, C14 | - |
| name matching, AC 2 (5 examples) | lowercase first name C2 · accented full name C2 · unknown C4 · ambiguous C4 · first name that is another's whole name C4 | - |
| `series` field values (3) | `k/N` C17 · `monthly` C17 · null C17 | - |
| doors (2) | REST list filters C11, C13, C15, C23 · tool names and parameters C6, C21 | - |

## Swept

- validation: C4, C5, C9, C15, C16; `attributedTo` bounded to 20 names by `McpMemberResolver` (`StrictToolSchemas` does not bound arrays)
- failure modes: C4, C9, C10, C20 (a refused call changes nothing)
- idempotency: C20 (a second restore is a tool error, not a double insert)
- authorization: C22; create and list roles as today (`McpCaptureToolsIT#roleMatrixForWrites`)
- concurrency: existing - delete and restore run `TransactionService`/`TransactionTrashService`, which lock the definition and the deletion (transaction-trash C12)
- data lifecycle: C7 (an update keeps split and items), C18 (a delete is restorable)
- dependency failure: n/a - no external call
- state transitions: C18, C20
- observability: existing - `McpToolRunner` logs each tool call and its outcome

## Handoff

- **Settled mid-build:** AC 11 / C13 boundary corrected to `Transaction.status(today)` (PENDING only before today) by the orchestrator - the criterion names that rule, the draft example contradicted it
- **Dispatched:** builder (Sonnet, main tree /home/lcs/dev/findraco) at 9acb6b8f, returned at 781faa24; Verifier (Opus) at a28e8483
- **Boundary:** C1–C24 built and green at the build's last commit (backend only; the SPA does not send the new filters)
- **Abandoned:** the C13 example "a bill dated 2026-11-18 requiring confirmation, reader's today 2026-11-18 → PENDING" (and AC 11's "on or before the reader's today"): `Transaction.status(today)` answers FORECAST for a confirmation-required row dated today and PENDING only when it is dated before today (`TransactionConfirmationTest#requiredBeforeTodayIsPending`). The filter follows `Transaction.status(today)` exactly, as the claim's first half requires, so `TransactionListFilterIT#statusFilterFollowsTheReadersToday` asserts the bill due today under FORECAST and the bill dated the day before under PENDING for the reader whose today it is; it also uses two real zones 25 hours apart (the context clock is the system one, so 2026-11-18T04:00Z cannot be pinned). The claim needs the owner's ruling: change the plan's PENDING boundary to "on or before today" (then `Transaction.status`, its test and the app's "A confirmar" view change too) or keep `status(today)` and correct C13/AC 11.
- **Walked:** n/a - no screen changes
