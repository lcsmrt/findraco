# Neutral Movements verification

**Verdict**: FAIL
**Proofs**: `proofs.md` at 84f3db67
**Verifier**: independent sub-agent (author != verifier)

## Checks

| Check | Test | Holds |
| --- | --- | --- |
| C1 | `NeutralMovementsIT` `neutralRowsCountInNoTotal` | yes - income, expenses, net and actual balance on the AC example; the neutral rows are debits only, the credit side rides on the same query |
| C2 | `NeutralMovementsIT` `neutralRowsLeaveTrendAndPeople` | yes - trend income/expenses and the owner's breakdown income/expense |
| C3 | `NeutralMovementsIT` `neutralKindsLeaveCategoriesAndLimits` | yes - whole spending tree compared before/after, per kind, debit and credit |
| C4 | `NeutralMovementsIT` `neutralKindRefusesCategorySplitAndItems` | yes - 3 kinds x 3 cases, create and update, status, type and field; nothing stored or changed |
| C5 | `NeutralMovementsIT` `dashboardReportsNeutralOutAndIn` | yes - out 2000, in 500, other month and trashed row left out; does not assert `totalIncome` is 0 with the neutral credit |
| C6 | `SummaryCards.stories.tsx` `With Neutral Movements`, `Default` | yes - runs in `en` ("Neutral", "out … · in …"); the `pt-BR` keys read "Neutros" and "saiu … · entrou …" |
| C7 | `NeutralMovementsIT` `refundLowersItsCategoryAndExpenses` | yes - Food 50, expenses 50, income 0, actual expenses and trend |
| C8 | `NeutralMovementsIT` `refundLowersTheSpendingOfWhoItIsAttributedTo` | yes - Marina 0, owner 50, category members |
| C9 | `NeutralMovementsIT` `refundNeedsAnExpenseCategoryOnACredit` | yes - 3 cases with status and type, nothing stored, then the valid refund |
| C10 | `NeutralMovementsIT` `limitIsMeasuredNetOfRefunds` | yes - spent, limit, remaining, percent, status before and after |
| C11 | `NeutralImportIT` `importMarksOnlyCardBillPayments` | yes |
| C12 | `NeutralCandidatesIT` `candidatesMatchTheRules` | yes - the 6 examples plus a trashed row, order and proposed kinds |
| C13 | `NeutralCandidatesIT` `applyingACandidateSetsItsKind` | yes - 200, kind, list, dashboard drop, 409 with no change; every candidate in it is uncategorized (see finding 1) |
| C14 | `NeutralCandidatesIT` `reviewFollowsTheRowRoles` | yes |
| C15 | `PlanAuthorizationMatrixIT` `neutralReviewFollowsTheRoleMatrix` | yes |
| C16 | `NeutralReviewSheet.test.tsx` `applies a candidate and removes it from the list`; `NeutralReviewListView.stories.tsx` `Empty` | yes |
| C17 | `transactionForm.test.ts` `maps the movement kind both ways`; `TransactionFormDrawer.test.tsx` `saves a neutral kind without category or split`, `keeps the category of a refund, from the expense categories` | yes - the third test picks "Reembolso", keeps an expense category and sends `categoryId` with `kind: REFUND`; it also asserts Items hidden, so the claim's "hides nothing else" means category and split |
| C18 | `TransactionFormDrawer.test.tsx` `reopens a row with its movement kind` | yes - and the PUT carries the kind back; only the creator edits (see finding 2) |
| C19 | `TransactionCells.stories.tsx` `Movement Kinds`; `TransactionMobileList.stories.tsx` `Movement Kinds` | yes - `en` labels; the `pt-BR` labels are "Entre membros", "Fatura", "Guardar", "Reembolso" |
| C20 | `TransactionsPage.test.tsx` `filters the list to neutral movements`; `NeutralMovementsIT` `listFilterNeutralReturnsOnlyRowsWithAKind` | yes |
| C21 | `McpNeutralKindIT` `createTakesTheKind` | yes |
| C22 | `McpNeutralKindIT` `updateAndListCarryTheKind` | yes |
| C23 | `McpNeutralKindIT` `summaryToolsUseTheNeutralRules` | yes - the month summary equals the dashboard body, and Food 50 |
| C24 | `MigrationsIT` `transactionKindIsAClosedNullableSet` | yes - the "existing rows" are inserted after V29, so the test holds nullable-with-no-default rather than pre-V29 rows |
| C25 | `NeutralCandidatesIT` `applyingRemovesTheCategoryOfANeutralRow` | yes - 200, kind set, category null in the response and the row, list empty, "Cartão" 1500 -> 0.00 |
| C26 | `NeutralMovementsIT` `anyMemberCanSaveAnotherMembersNeutralRow`; `TransactionFormDrawer.test.tsx` `keeps the payer of a neutral row when another member saves it` | yes - the backend accepts the owner's PUT with Marina as the one participant (200, kind TRANSFER, Marina kept), and the form, saved by Lucas, sends `participants: [{ memberId: livia }]` |
| C27 | `NeutralCandidatesIT` `oneWordNamesMatchOnlyTheWholeName` | yes - `containsExactly` the "LUCAS" row as TRANSFER, so "LUCAS FERREIRA" left out |
| C28 | `NeutralMovementsIT` `uncategorizedFilterLeavesNeutralRowsOut`; `McpNeutralKindIT` `uncategorizedFilterLeavesNeutralRowsOut` | yes - REST returns exactly the purchase (bill, savings and the categorized row left out), and MCP returns 1 row, the purchase |

Own examples run at HEAD in a throwaway IT, deleted afterwards. These passed:

- Every aggregate with refunds and the member filter: pizza 100 split 50/50 in a subcategory, with a refund of 30 attributed to Marina. The dashboard, trend and breakdown give the plan 1570 (a 1500 normal row plus 70 net), the owner 1550 and Marina 20. `neutralOut` is split per member.
- Per-member limits on the parent: 40 each. Food shows 70 of 80, Marina 20 of 40 OK, and the owner 50 of 40 OVER.
- A PUT that leaves out `kind` answers 200 and the row reads `kind` null, as `UpdateTransactionRequest` documents. The inline save and the form both send the kind back.
- "Estorno - Pagamento de fatura" is not proposed, and "  PAGAMENTO DE FATURA  " is.

## Findings

| Finding | Evidence | Fix | Closed |
| --- | --- | --- | --- |
| High - the review proposes rows it cannot apply. A "Pagamento de fatura" or Pix row that a member has already categorized is listed, applying it answers 422, and it stays in "Revisar movimentos" for good, which breaks AC 9 | `TransactionRepository.java:37` (`findNeutralCandidateTexts`) does not filter on category, items or split, and `Transaction.java:272` refuses the category. Example: imported "Pagamento de fatura" 1500 in category "Cartao" -> listed as CARD_BILL_PAYMENT -> `POST …/{id}/kind` 422 "CARD_BILL_PAYMENT is a neutral kind and takes no category." -> still 1 candidate. C13's rows are all uncategorized | product decision: either applying a neutral kind drops the category (and the items) of the row, or the finder leaves out rows that cannot take the proposed kind. Add a C13 case with a categorized candidate | ff54b48c |
| Medium - only the creator can save a neutral row from the form. The form sends the editor as the sole participant and the entity accepts only the creator, so an owner or editor editing the other owner's Pix or bill (including rows the review just marked, and rows from the other owner's import) gets 422 | `transactionForm.ts:483-485` forces `attributionMode: "ME"` (the current user), and `Transaction.java:280-283` compares the shares with `createdBy`. Example: Marina's TRANSFER 500; the owner PUTs `participants:[owner]` -> 422 "cannot be split with another member"; with participants left out -> 422 | keep the stored participants for a neutral row on edit (or send the creator), or make the entity rule "one participant" rather than "the creator". Add a non-creator edit to C4 or C18 | b09e870c |
| Low - a member whose name is one word matches any Pix with that first name, but AC 8 asks for first and last name | `NeutralMovementRules.java:49-51`: `getFirst()` and `getLast()` are the same token. Example: member "Lucas" and "Transferência enviada pelo Pix - LUCAS FERREIRA - …" -> TRANSFER | require at least two tokens in the member's name, or state the one-word case in the plan | a53ac0fb |
| Low - the "no category" filter, on the web and in MCP `list_transactions uncategorized=true`, now returns every neutral row, and those rows cannot take a category, so a Claude triage of uncategorized rows reaches 422 on each one | `TransactionSpecification.java:71-76` is `category IS NULL` with no kind condition, and the diff did not touch it | add `kind IS NULL` to `uncategorized`, or record the choice in the plan | 9677905e |
| Low - C17's proof does not hold its "Reembolso keeps category" half | the claim names it, but neither cited test picks "Reembolso"; the half sits in `TransactionFormDrawer.test.tsx:870`, which no check cites | add `TransactionFormDrawer > keeps the category of a refund, from the expense categories` as a C17 proof line | 30e40495 |
