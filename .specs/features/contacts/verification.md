# Contacts verification

**Verdict**: FAIL
**Proofs**: `proofs.md` at 0312a850 (HEAD 44c5430a adds only a docs line)
**Verifier**: independent sub-agent (author != verifier)

## Checks

| Check | Test | Holds |
| --- | --- | --- |
| C1 | `ContactsIT#createsTrimsAndBoundsTheName` | yes - 201 with "Mãe", owed/credit 0, "  Tia  " → "Tia", "", blank and 61 chars 422 on `name`, 60 accepted, row count 3 |
| C2 | `ContactsIT#rejectsADuplicateActiveNameOnly` | yes - "mãe" 422 `contact-name-taken` on `name`; another plan, a member named "Joana" and an archived holder all accepted |
| C3 | `ContactsIT#renameReachesTheSharesAndChecksTheVersion` | yes - the transaction then reads `contactName` "Mamãe"; stale version 409 `stale-version` |
| C4 | `ContactsIT#listsActiveContactsByNameWithTheirBalances` | yes - Ana 50.00 / Bia credit 20.00 / Caio 0 by name, Dani only with `archived=true` |
| C5 | `ContactsIT#archivesOnlyAtZeroBalance` | yes - 0.01 and credit 5.00 are 409, planned-only archives, past share keeps its name, a new split 422 `contact-archived` |
| C6 | `ContactsIT#unarchiveRestoresUnlessTheNameIsTaken` | yes |
| C7 | `ContactsIT#deletesOnlyAnUnusedContact` | yes - trashed, live, repayment (and series) each 409 `contact-in-use`; unused 204 and the row gone |
| C8 | `ContactRoleMatrixIT` | yes - every route × five callers by exact status, plus a foreign contact 404 on every contact route |
| C9 | `ContactsSectionView.stories.tsx` `Empty`, `With Balances`, `With Archived` | yes, loosely - the three labels are asserted on the page but not paired with their names (Ana/Bia/Caio swapped would pass); placement below members is the page's, not this view's |
| C10 | `ContactsSectionView.stories.tsx` `Read Only` | yes at the view layer - controls hidden when `canManage` is false; the container passes `canAttributeToOthers`, false for CONTRIBUTOR and VIEWER |
| C11 | `ContactsSection.test.tsx` `creates a contact and lists it`, `shows the taken-name error on the field` | yes - POST body `{name:"Mãe"}` from "  Mãe  ", error inside `field-error` |
| C12 | `ContactsSection.test.tsx` `refuses to archive…`, `archives a settled contact`, `offers archive when delete is refused` | yes - "Ana: Owes R$ 50,00" with the notice, no Archived group; archive POST after the refused delete |
| C13 | `ContactSchemaIT` | yes - each named constraint rejects both/neither, duplicates, REPAYMENT without contact and non-repayment with one |
| C14 | `ContactSharesIT#splitsWithContactsUseTheExistingRules` | yes - all four examples by exact party=amount |
| C15 | `ContactSharesIT#contactSharesLeaveTotalsTrendAndPeople` | yes - expenses 40, result −40, trend 40, breakdown only the owner, memberId filter 40 |
| C16 | `ContactSharesIT#contactSharesLeaveCategoriesItemsAndLimits` | yes - 40 spent / 10 left; items: Bebidas 10, Restaurante 30, one member row |
| C17 | `ContactSharesIT#contactSharesOnlyOnPlainExpenses` | yes - six kinds on create and edit, plus a credit series; nothing stored. The set-kind route is outside it (finding 3) |
| C18 | `ContactSharesIT#archivedOrForeignContactsAreRefused` | yes - on transactions and series |
| C19 | `ContactSharesIT#onlyOwnerAndEditorSplitWithContacts` | yes - 403 `insufficient-role` on create and on editing its own row, no participant row; editor 201 |
| C20 | `ContactSharesIT#seriesCarryContactSharesThroughEdits` | yes - per-date shares: Jan, Feb and the confirmed one untouched |
| C21 | `TransactionFormDrawer.test.tsx` contacts: `offers contacts after members…`, `sends the contact share`, `offers no contact to a contributor` | yes - order Lucas, Livia, Mãe; exact share field; `{contactId}` in the payload; no contacts request for a contributor |
| C22 | `TransactionCells.stories.tsx` / `TransactionMobileList.stories.tsx` `With Contact Share` | yes |
| C23 | `transactionForm.test.ts` `round-trips a contact share` | yes - `contactId` back, no `memberId` property |
| C24 | `RepaymentsIT#repaymentCountsInNoTotal` | yes - income stays 100, `neutralIn` 150, breakdown and trend 100 |
| C25 | `RepaymentsIT#storesExplicitAllocationsAndKeepsExcessAsCredit` | yes - stored rows by share, Oct untouched, credit 100.00 |
| C26 | `RepaymentsIT#omittedAllocationsFillOldestFirst` | yes - newer purchase stored first, so the order is the date's |
| C27 | `RepaymentsIT#allocationLimitsAreEnforced` | yes - over-open, planned, other contact, made-up id, sum over amount, same share twice |
| C28 | `RepaymentsIT#concurrentRepaymentsNeverOverAllocate` | yes, loosely - asserts 201 + 422 by status, not the `allocation-exceeds-open` type the claim names; `aRepaymentWaitsForTheLockOnItsContact` proves the lock deterministically |
| C29 | `RepaymentsIT#editReplacesAndTrashSuspendsAllocations` | yes - statuses and balance through edit, trash and restore. The edit-while-the-purchase-is-trashed case is not covered (finding 2) |
| C30 | `RepaymentsIT#reducingAShareCutsNewestPaymentsFirst` | yes - A 60 / B 10 / credit 30, removal frees 100, trash and restore of the purchase |
| C31 | `suggestAllocations.test.ts` `fills oldest first…`, `reports the excess` | yes - the claim's "0 gives nothing" sits in a third test of the same file that the proof does not name |
| C32 | `ContactStatementPage.test.tsx` `records a payment with the suggested allocation`, `sends only the ticked allocations` | yes |
| C33 | `TransactionFormDrawer.test.tsx` repayment: `turns an income into a contact payment`, `shows the excess as credit` | yes |
| C34 | `TransactionCells.stories.tsx` / `TransactionMobileList.stories.tsx` `Repayment` | yes |
| C35 | `ContactStatementIT#groupsByMonthWithStatuses` | yes - months newest first, every field of every share, `unallocated` 0 and 40 |
| C36 | `ContactStatementIT#balanceLeavesPlannedOutAndShowsCredit` | yes |
| C37 | `ContactStatementIT#trashedRowsLeaveTheStatement` | yes |
| C38 | `ContactStatementView.stories.tsx` `Owes`, `Credit`, `Settled` | yes |
| C39 | `ContactStatementView.stories.tsx` `Empty`, `Loading`, `Error` | yes |
| C40 | `ContactStatementView.stories.tsx` `Read Only` | yes for the VIEWER half; the OWNER half is `As Owner`, which ran in the same run but is not named by the proof |
| C41 | `ContactsSectionView.stories.tsx` `Fits Phone`, `ContactStatementView.stories.tsx` `Fits Phone`, `Fits Desktop` | yes, loosely - right edges are checked; "scrolls with the page" is not asserted (an inner fixed-height scroller would pass) |
| C42 | `ContactsSection.test.tsx` `opens the statement route` | yes - `/plans/contacts/8` by PUSH |
| C43 | walk | yes - walked at `f9ad640a` at both widths (Handoff) |
| C44 | `McpContactsIT#attributedToResolvesContacts` | yes - unknown lists members and contacts; "ana" and "Rafa Souza" ambiguous; only 2 rows stored |
| C45 | `McpContactsIT#repaymentAppliesOldestFirst` | yes |
| C46 | `McpContactsIT#listsContactsAndNamesThemInTransactions` | yes |
| C47 | `OpenApiSnapshotIT` | yes |
| C48 | `ContactStatementView.stories.tsx` `Long Name Reads In Full` | yes - `scrollWidth <= clientWidth` fails on an ellipsis |
| C49 | `TransactionsPage.test.tsx` two tests, `showParticipantsColumn.test.ts` | yes |

Probed beyond the checks, by code reading and one throwaway IT (deleted, not committed). These hold:
- Every total query in `DashboardReportRepository` and `CategorySpendingRepository` (items and refunds included) filters `tp.member IS NOT NULL`. MCP `get_month_summary` reads `DashboardService`, and REPAYMENT appears only in `neutralIn`.
- Contacts are locked on every write that moves shares or allocations: edit, confirm, series edit and restore.
- A repayment's allocations are replaced on edit. Its amount is re-checked against them, and a switch to another contact re-fills from that contact.
- Another plan's contact ids are 404, and another plan's or another contact's participant ids are 422.
- Role gating holds on both the frontend and the backend.
- i18n keys are at parity.
- A future-dated repayment counts in the balance at once and is allocated (its status stays FORECAST). The plan says "Σ the amounts of its live repayments", so that is not a finding.

## Findings

| Finding | Evidence | Fix | Closed |
| --- | --- | --- | --- |
| 1 (medium, AC 27/24) A settled purchase moved to a future date keeps its allocation on a PLANNED share. The balance then says "Crédito de R$ 100", but no payment shows anything unallocated. The payment form's list hides planned shares, so the next edit of that payment silently drops the allocation. | Throwaway IT: purchase 100 (−10 days) paid by Pix 100, then edited to +40 days → 200; statement `credit 100`, share `PLANNED allocated 100`, repayment `unallocated 0`, stored `1=100.00`. `fitToShares` only cuts above the share amount; `openShares` refuses planned shares | Treat a share whose transaction is not actual as holding 0 in `RepaymentAllocationService.fitToShares` (called after edit/confirm/series edit already), so its allocations return to the payment as credit | `13ad8e1c` - C50 `RepaymentsIT#aSettledPurchaseMovedToAFutureDateReleasesItsAllocation` |
| 2 (medium, AC 23/24) Editing a payment while a purchase it settles is in the trash deletes that settlement for good. After the purchase is restored it reads "Em aberto", and the payment shows R$ 200 unallocated. The UI, an inline edit and the MCP all send the response's allocations, which leave out trashed purchases, so any edit (a description change, say) does this. | Throwaway IT: purchase 200 settled by Pix 200 → trash purchase → GET shows `allocations: []` → PUT with a new description and `allocations: []` → restore → share `OPEN allocated 0`, repayment `unallocated 200`, stored allocations `[]`. Cause: `allocate` runs `deleteByRepayment`, which removes trashed-purchase rows too | In `allocate`, delete and re-check only allocations on live purchases, and keep the trashed ones. On a purchase restore, fit the restored shares (`fitToShares`) and cap each repayment's live total at its amount. Prove it with a `RepaymentsIT` test: edit the payment while the purchase is trashed, restore, and the share is `PAID` again | `13ad8e1c` - C51 `RepaymentsIT#editingAPaymentWhileItsPurchaseIsTrashedKeepsThatSettlement` |
| 3 (low-medium, AC 12) `POST /transactions/{id}/kind` with TRANSFER, CARD_BILL_PAYMENT or SAVINGS on a purchase split with a contact answers 200. It silently replaces the split with the creator alone, so the contact's share and any allocations on it disappear. AC 12 refuses a contact share on a neutral kind with 422. | Throwaway IT: R$ 80 split owner + "C" → set kind TRANSFER → 200, participants `[owner 80]`, C's balance 0. `Transaction.assignKind` calls `replaceSplit` with the payer only | In `assignKind`, refuse a neutral kind with `ContactShareNotAllowedException` when any participant is a contact. Add a `ContactSharesIT` case: set kind TRANSFER on a split with "Mãe" → 422 `contact-share-not-allowed`, shares unchanged | `b96ea2a4` - C52 `ContactSharesIT#markingAContactSplitWithAKindIsRefusedAndLeavesTheSplit` |
| 4 (low, AC 5/6, plan gap) A contact archived with only planned shares (allowed by AC 6) starts owing when those shares become actual, for example the next occurrence of a series. It owes while archived: it is absent from the active list and the pickers, and its payment is refused. | Throwaway IT: planned 80 → archive 200 → purchase dated yesterday (kept on the row) → balance `owed 80.00`, `POST` repayment → 422 `contact-archived`. `ContactService.lockForUpdate` refuses archived contacts for new payments | Needs the user's call. Either refuse archiving while planned shares exist (changes AC 6's third example), or let a payment be recorded from an archived contact that owes. Either is provable with one `ContactsIT`/`RepaymentsIT` case | `101de709` backend, `efdcfb08` frontend - C53 `ContactsIT#refusesArchiveWithPlannedShares`, C54 (user decision 2026-11-25, C5 notes it) |
| 5 (low) Assertions looser than their claims: C28 checks 422 by status, not `allocation-exceeds-open`; C9 does not pair each balance with its contact; C41 does not assert "scrolls with the page"; C31's zero case and C40's owner half sit in tests the proofs do not name | rows C9, C28, C31, C40, C41 above | Assert `problem(422, "allocation-exceeds-open")` for the loser in C28. Scope C9's labels `within` each contact row. Name `As Owner` and `suggests nothing for a payment of zero…` in the C40/C31 proofs | `14ba3253` - C28 `allocation-exceeds-open` asserted, C9 balances tied to rows, C41 page scroll asserted, C31 zero case in the named test, C40 owner half in `Read Only` |
