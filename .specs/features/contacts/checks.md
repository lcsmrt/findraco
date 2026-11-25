# Contacts checks

Build: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -DskipITs -Dsurefire.skip=true; cd frontend && pnpm lint; cd frontend && pnpm build; cd frontend && node scripts/check-siblings.ts
Run unit: cd frontend && pnpm exec vitest run --project=unit --reporter=verbose src/features/plans/components/ContactsSection.test.tsx src/features/contacts/ContactStatementPage.test.tsx src/features/transactions/components/TransactionFormDrawer.test.tsx
Run formunit: cd frontend && pnpm exec vitest run --project=unit --reporter=verbose src/features/transactions/components/transactionForm.test.ts src/features/transactions/utils/suggestAllocations.test.ts
Run stories: cd frontend && pnpm exec vitest run --project=storybook --reporter=verbose src/features/plans/components/ContactsSectionView.stories.tsx src/features/contacts/components/ContactStatementView.stories.tsx src/features/transactions/components/TransactionCells.stories.tsx src/features/transactions/components/TransactionMobileList.stories.tsx
Plan: `.specs/features/contacts/plan.md`

47 checks in 5 slices · 4 one-way doors · 0 open, of which 0 block

Test rules:
- Backend proofs are one IT method each, run alone with failsafe (the pattern of `neutral-movements`). A class name alone (`ContactRoleMatrixIT`, `ContactSchemaIT`, `OpenApiSnapshotIT`) runs every method in it.
- Stories and flow tests render in English. The pt-BR copy is the plan's: "Contatos", "Novo contato", "Nenhum contato ainda", "Deve R$ X", "Crédito de R$ X", "Em dia", "Arquivados", "Já existe um contato com esse nome", "Quite o saldo antes de arquivar", "Registrar pagamento", "Pagamento de contato", "R$ X vira crédito", "Pago", "Parcial (R$ Y de R$ X)", "Em aberto", "Previsto", "Nada com este contato ainda". en: "Contacts", "New contact", "No contacts yet", "Owes R$ X", "Credit of R$ X", "Settled", "Archived", "A contact with that name already exists", "Settle the balance before archiving", "Record payment", "Contact payment", "R$ X becomes credit", "Paid", "Partial (R$ Y of R$ X)", "Open", "Planned", "Nothing with this contact yet", "Rename", "Archive", "Delete", "Try again".
- Width stories set their viewport with `page.viewport` from `@vitest/browser/context` and read rects inside `waitFor`.
- `suggestAllocations` lives in `src/features/transactions/utils/` and is the form's suggestion only; the backend's oldest-first fill (C26, C45) is the rule for requests that omit allocations.

## Checks

### S1 - Contacts

**C1** - An OWNER creates "Mãe": 201 with `name` "Mãe", listed by `GET /contacts` with owed 0 and credit 0; "  Mãe  " is saved as "Mãe"; an empty or 61-character name is 422 with a `name` field error and no row (AC 1)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactsIT#createsTrimsAndBoundsTheName' -Dsurefire.skip=true

**C2** - A second active "mãe" in the same plan is 422 `contact-name-taken`; the same name is accepted when the first is archived, when it belongs to another plan, and when a member has that name (AC 2)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactsIT#rejectsADuplicateActiveNameOnly' -Dsurefire.skip=true

**C3** - Renaming "Mãe" to "Mamãe" with its `version` returns the new name, and the transaction that has her share then returns `contactName` "Mamãe"; a stale `version` is 409 (AC 3)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactsIT#renameReachesTheSharesAndChecksTheVersion' -Dsurefire.skip=true

**C4** - `GET /contacts` lists active contacts by name with owed and credit: "Ana" owes 50.00, "Bia" has credit 20.00, "Caio" 0 - and omits archived ones unless `archived=true` (AC 4)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactsIT#listsActiveContactsByNameWithTheirBalances' -Dsurefire.skip=true

**C5** - Archiving at balance zero moves the contact to the archived list, its past share still returns its name, and a new split naming it is 422 `contact-archived`; owing 0.01 or holding credit 5.00 is 409 `contact-balance-not-zero`; owing 0 with only planned shares archives (AC 5, 6)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactsIT#archivesOnlyAtZeroBalance' -Dsurefire.skip=true

**C6** - Unarchiving returns the contact to the active list; when another active contact took its name meanwhile it is 422 `contact-name-taken` (AC 7)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactsIT#unarchiveRestoresUnlessTheNameIsTaken' -Dsurefire.skip=true

**C7** - Deleting a contact with no share, live or trashed, and no repayment is 204 and the row is gone; with a share in the trash, a live share or a repayment it is 409 `contact-in-use` (AC 8)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactsIT#deletesOnlyAnUnusedContact' -Dsurefire.skip=true

**C8** - Each contact route answers by role: list and statement 200 for OWNER, EDITOR, CONTRIBUTOR and VIEWER; create, rename, archive, unarchive and delete 2xx for OWNER and EDITOR and 403 for CONTRIBUTOR and VIEWER; every route 404 for a user outside the plan and for a contact of another plan (AC 9, 29)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactRoleMatrixIT' -Dsurefire.skip=true

**C9** - The Plans page shows "Contacts" below the members: with no contacts "No contacts yet" and its explanation line; with contacts each name and "Owes R$ 50,00", "Credit of R$ 20,00" or "Settled"; archived ones under "Archived" (AC 4, 5)
Proof: run stories | ✓ src/features/plans/components/ContactsSectionView.stories.tsx > Empty
Proof: run stories | ✓ src/features/plans/components/ContactsSectionView.stories.tsx > With Balances
Proof: run stories | ✓ src/features/plans/components/ContactsSectionView.stories.tsx > With Archived

**C10** - A VIEWER and a CONTRIBUTOR see the Contacts section with no "New contact" button and no row menu; an OWNER sees both (AC 4)
Proof: run stories | ✓ src/features/plans/components/ContactsSectionView.stories.tsx > Read Only

**C11** - An OWNER uses "New contact", types "Mãe" and saves: the POST carries `name` "Mãe" and "Mãe" appears in the section; a taken name shows "A contact with that name already exists" on the field (AC 1, 2)
Proof: run unit | ✓ ContactsSection > creates a contact and lists it
Proof: run unit | ✓ ContactsSection > shows the taken-name error on the field

**C12** - An OWNER archives a contact with a balance: the page shows "Settle the balance before archiving" with the amount, and the contact stays active; archiving at zero moves it to "Archived"; deleting a used contact offers "Archive" instead (AC 5, 6, 8)
Proof: run unit | ✓ ContactsSection > refuses to archive a contact with a balance
Proof: run unit | ✓ ContactsSection > archives a settled contact
Proof: run unit | ✓ ContactsSection > offers archive when delete is refused

**C13** - The schema refuses a participant row with both a member and a contact, or neither, and a REPAYMENT row without `repayment_contact_id` or a non-repayment row with one (doors 2, 3)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactSchemaIT' -Dsurefire.skip=true

### S2 - A contact's share is not plan spending

**C14** - Splits with contacts save: R$ 80 equal "Eu"+"Mãe" gives 40.00/40.00; R$ 100 exact 30/70 as sent; R$ 50 with only "Mãe" one share of 50.00; R$ 100.01 equal "Eu", "Livia", "Mãe" gives 33.34, 33.34, 33.33 (AC 10)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactSharesIT#splitsWithContactsUseTheExistingRules' -Dsurefire.skip=true

**C15** - An R$ 80 "Restaurante" expense split 40 "Eu" / 40 "Mãe": the summary reports expenses 40.00 and result −40.00, the monthly trend 40.00, the person breakdown only "Eu" with 40.00 (AC 11)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactSharesIT#contactSharesLeaveTotalsTrendAndPeople' -Dsurefire.skip=true

**C16** - The same expense: "Restaurante" spends 40.00 and its 50.00 limit has 10.00 left; with R$ 20 of items in "Bebidas", "Bebidas" spends 10.00 and "Restaurante" 30.00 (AC 11)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactSharesIT#contactSharesLeaveCategoriesItemsAndLimits' -Dsurefire.skip=true

**C17** - A contact share on an income, on each neutral kind (TRANSFER, CARD_BILL_PAYMENT, SAVINGS), on a REFUND and on a REPAYMENT is 422 `contact-share-not-allowed`, on create and on edit (AC 12)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactSharesIT#contactSharesOnlyOnPlainExpenses' -Dsurefire.skip=true

**C18** - A split naming an archived contact is 422 `contact-archived`; a contact of another plan is 404 (AC 13)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactSharesIT#archivedOrForeignContactsAreRefused' -Dsurefire.skip=true

**C19** - A CONTRIBUTOR saving a split with a contact is 403 and no row is written; an EDITOR is 201 (AC 14)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactSharesIT#onlyOwnerAndEditorSplitWithContacts' -Dsurefire.skip=true

**C20** - A monthly series of R$ 120 with "Irmã" 100% generates each occurrence with her share of 120.00; changing the split to 60/60 with "this and following" from March changes March on and leaves January, February and a confirmed occurrence untouched (AC 15)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactSharesIT#seriesCarryContactSharesThroughEdits' -Dsurefire.skip=true

**C21** - In the transaction form an OWNER sees the active contacts after the members in both equal and exact splits, and saving R$ 80 equal with "Mãe" sends `participants` with her `contactId`; a CONTRIBUTOR is offered no contact (AC 10, 14)
Proof: run unit | ✓ TransactionFormDrawer contacts > offers contacts after members in the split
Proof: run unit | ✓ TransactionFormDrawer contacts > sends the contact share
Proof: run unit | ✓ TransactionFormDrawer contacts > offers no contact to a contributor

**C22** - A row split with "Mãe" shows her name with the members in the table and the phone list (AC 16)
Proof: run stories | ✓ src/features/transactions/components/TransactionCells.stories.tsx > With Contact Share
Proof: run stories | ✓ src/features/transactions/components/TransactionMobileList.stories.tsx > With Contact Share

**C23** - The form maps a contact participant both ways: a loaded share with `contactId` comes back into the form and the payload carries `contactId`, never `memberId`, for it (AC 10, 16)
Proof: run formunit | ✓ transactionForm contacts > round-trips a contact share

### S3 - Payments from a contact

**C24** - A REPAYMENT of R$ 150 from "Mãe" received by "Eu" counts in no income, result, trend or person breakdown, and the summary reports 150.00 in `neutralIn` (AC 20)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='RepaymentsIT#repaymentCountsInNoTotal' -Dsurefire.skip=true

**C25** - Explicit allocations are stored: owing 200 (Oct) and 300 (Nov), paying 100 with only Nov gives Nov 100 allocated and Oct untouched; paying 600 with both in full stores 200 and 300 and leaves 100 credit (AC 18, 21)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='RepaymentsIT#storesExplicitAllocationsAndKeepsExcessAsCredit' -Dsurefire.skip=true

**C26** - A repayment with no allocations fills oldest first: paying 300 gives Oct 200 and Nov 100; paying 600 gives 200, 300 and 100 credit (AC 25)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='RepaymentsIT#omittedAllocationsFillOldestFirst' -Dsurefire.skip=true

**C27** - An allocation above the share's open amount is 422 `allocation-exceeds-open`; allocations adding up above the payment are 422 `allocation-exceeds-amount`; an allocation to a planned share or to another contact's share is 422 `allocation-exceeds-open` (AC 21)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='RepaymentsIT#allocationLimitsAreEnforced' -Dsurefire.skip=true

**C28** - Two repayments that each allocate the full 200 of the same share, sent at the same moment from two threads: one is 201, the other 422 `allocation-exceeds-open`, and the share's allocations total 200.00 (AC 22)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='RepaymentsIT#concurrentRepaymentsNeverOverAllocate' -Dsurefire.skip=true

**C29** - Editing a repayment replaces its allocations with the ones sent; moving it to the trash drops its allocations from the share's status and the balance, and restoring it brings them back (AC 23)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='RepaymentsIT#editReplacesAndTrashSuspendsAllocations' -Dsurefire.skip=true

**C30** - A share of 100 settled 60 by Pix A and 40 by Pix B, reduced to 70: A keeps 60, B 10, credit 30; removing the contact from the split frees all 100; trashing the purchase frees it and restoring it counts it again (AC 24)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='RepaymentsIT#reducingAShareCutsNewestPaymentsFirst' -Dsurefire.skip=true

**C31** - The allocation suggestion fills from the oldest open share up to the amount: 300 over 200 (Oct) and 300 (Nov) gives 200 and 100; 600 gives 200, 300 and an excess of 100; 0 gives nothing (AC 18)
Proof: run formunit | ✓ suggestAllocations > fills oldest first up to the amount
Proof: run formunit | ✓ suggestAllocations > reports the excess

**C32** - From the statement, "Record payment" opens the form as an income of kind "Contact payment" with the contact chosen; typing 300 pre-ticks October 200 and November 100; unticking October and saving sends only November's allocation (AC 17, 18)
Proof: run unit | ✓ ContactStatementPage > records a payment with the suggested allocation
Proof: run unit | ✓ ContactStatementPage > sends only the ticked allocations

**C33** - In the form, an income can take the kind "Contact payment"; choosing a contact lists its open shares oldest first and shows "R$ 100,00 becomes credit" when the amount exceeds them (AC 19, 18)
Proof: run unit | ✓ TransactionFormDrawer repayment > turns an income into a contact payment
Proof: run unit | ✓ TransactionFormDrawer repayment > shows the excess as credit

**C34** - A repayment row shows its kind badge and the contact's name in the table and the phone list (AC 20)
Proof: run stories | ✓ src/features/transactions/components/TransactionCells.stories.tsx > Repayment
Proof: run stories | ✓ src/features/transactions/components/TransactionMobileList.stories.tsx > Repayment

### S4 - The contact's statement

**C35** - The statement groups by month, newest first, each share with date, description, share, allocated and status: 200 with 200 allocated `PAID`, 300 with 100 `PARTIAL`, 50 with 0 `OPEN`, a planned 120 `PLANNED`; each repayment with its `unallocated` part (AC 26)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactStatementIT#groupsByMonthWithStatuses' -Dsurefire.skip=true

**C36** - The balance counts actual shares minus live repayments: shares 200 actual + 120 planned and a payment of 150 give owed 50.00, credit 0; a payment of 250 gives owed 0, credit 50.00 (AC 27)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactStatementIT#balanceLeavesPlannedOutAndShowsCredit' -Dsurefire.skip=true

**C37** - A trashed purchase and a trashed payment leave the statement and the balance, and come back on restore (AC 28)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactStatementIT#trashedRowsLeaveTheStatement' -Dsurefire.skip=true

**C38** - The statement view shows the balance first ("Owes R$ 50,00", "Credit of R$ 50,00", "Settled"), then months with each status label "Paid", "Partial (R$ 100,00 of R$ 300,00)", "Open", "Planned", and the payments (AC 26, 27)
Proof: run stories | ✓ src/features/contacts/components/ContactStatementView.stories.tsx > Owes
Proof: run stories | ✓ src/features/contacts/components/ContactStatementView.stories.tsx > Credit
Proof: run stories | ✓ src/features/contacts/components/ContactStatementView.stories.tsx > Settled

**C39** - The statement view shows "Nothing with this contact yet" when empty, the skeleton while loading and the error state with "Try again" (AC 30)
Proof: run stories | ✓ src/features/contacts/components/ContactStatementView.stories.tsx > Empty
Proof: run stories | ✓ src/features/contacts/components/ContactStatementView.stories.tsx > Loading
Proof: run stories | ✓ src/features/contacts/components/ContactStatementView.stories.tsx > Error

**C40** - An OWNER sees "Record payment", "Rename", "Archive" and "Delete" on the statement; a VIEWER sees none of them (AC 29)
Proof: run stories | ✓ src/features/contacts/components/ContactStatementView.stories.tsx > Read Only

**C41** - At 390 px and 1280 px the Contacts section and the statement fit their width: no element's right edge past the viewport, and a 12-month statement scrolls with the page (AC 31)
Proof: run stories | ✓ src/features/plans/components/ContactsSectionView.stories.tsx > Fits Phone
Proof: run stories | ✓ src/features/contacts/components/ContactStatementView.stories.tsx > Fits Phone
Proof: run stories | ✓ src/features/contacts/components/ContactStatementView.stories.tsx > Fits Desktop

**C42** - Tapping a contact in the Contacts section opens its statement at its own route under Plans, and the browser back returns to Plans (AC 26)
Proof: run unit | ✓ ContactsSection > opens the statement route

**C43** - On the local stack at 390 × 844 and 1280 × 800: create "Mãe", split a purchase with her, see expenses drop, record a payment from the statement, see statuses and balance, archive at zero; the Plans page, statement, form and Overview show nothing clipped (AC 1-31)
Proof: walk - each step at both widths

### S5 - The MCP

**C44** - `create_transaction` with `attributedTo` ["Mãe"] puts the whole amount on her; ["Lucas", "Mãe"] splits equally; an unknown name is refused listing members and contacts; a name shared by a member and a contact is refused as ambiguous (AC 32)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpContactsIT#attributedToResolvesContacts' -Dsurefire.skip=true

**C45** - `create_transaction` with `kind` REPAYMENT and `contact` "Mãe" of 300 over 200 (Oct) and 300 (Nov) allocates 200 and 100, and the response states the settled purchases and a credit of 0; 600 states a credit of 100 (AC 33)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpContactsIT#repaymentAppliesOldestFirst' -Dsurefire.skip=true

**C46** - `list_contacts` returns each active contact with name, owed and credit; `list_transactions` names "Mãe" in `attributedTo` of her purchase (AC 34)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpContactsIT#listsContactsAndNamesThemInTransactions' -Dsurefire.skip=true

**C47** - The committed `backend/openapi.json` matches the running API, with the contact routes, `contactId` on participants and `REPAYMENT` (Surface)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='OpenApiSnapshotIT' -Dsurefire.skip=true

## Coverage

| Set (size) | Member -> proof | Unproven |
| --- | --- | --- |
| `GET /plan/{planId}/contacts` statuses (2) | 200 C4 C8 · 404 C8 | - |
| `POST /plan/{planId}/contacts` statuses (5) | 201 C1 · 422 `contact-name-taken` C2 · 422 name bounds C1 · 403 C8 · 404 C8 | - |
| `PUT /plan/{planId}/contacts/{id}` statuses (5) | 200 C3 · 422 `contact-name-taken` C2 · 409 stale C3 · 404 C8 · 403 C8 | - |
| `POST /plan/{planId}/contacts/{id}/archive` statuses (4) | 200 C5 · 409 `contact-balance-not-zero` C5 · 404 C8 · 403 C8 | - |
| `POST /plan/{planId}/contacts/{id}/unarchive` statuses (4) | 200 C6 · 422 `contact-name-taken` C6 · 404 C8 · 403 C8 | - |
| `DELETE /plan/{planId}/contacts/{id}` statuses (4) | 204 C7 · 409 `contact-in-use` C7 · 404 C8 · 403 C8 | - |
| `GET /plan/{planId}/contacts/{id}/statement` statuses (2) | 200 C35 C8 · 404 C8 | - |
| transactions and series routes, new statuses (6) | 403 contributor C19 · 422 `contact-archived` C18 · 422 `contact-share-not-allowed` C17 · 422 `allocation-exceeds-open` C27 C28 · 422 `allocation-exceeds-amount` C27 · 404 foreign contact C18 | - |
| Landing doors (4) | 1 contacts table C1 C2 C5 · 2 member-or-contact C13 C14 · 3 repayment kind C13 C24 · 4 allocations C25 C27 C28 | - |
| roles × contact writes (4) | OWNER C8 · EDITOR C8 C19 · CONTRIBUTOR C8 C19 C10 C21 · VIEWER C8 C10 C40 | - |
| totals a contact share leaves, AC 11 (7) | income/expense C15 · result C15 · trend C15 · person breakdown C15 · category total C16 · item allocation C16 · limit C16 | - |
| kinds refusing a contact share, AC 12 (6) | income C17 · TRANSFER C17 · CARD_BILL_PAYMENT C17 · SAVINGS C17 · REFUND C17 · REPAYMENT C17 | - |
| split examples, AC 10 (4) | 80 equal C14 · 30/70 exact C14 · 100% contact C14 · 100.01 three-way C14 | - |
| archive examples, AC 6 (3) | owes 0.01 C5 · credit 5 C5 · planned only C5 | - |
| allocation examples, AC 18/25 (3) | 300 over 200+300 C26 C31 C45 · 600 with excess C25 C26 C31 C45 · Nov only C25 C32 | - |
| reduction examples, AC 24 (3) | 100 → 70 C30 · contact removed C30 · trash and restore C30 | - |
| share statuses (4) | PAID C35 C38 · PARTIAL C35 C38 · OPEN C35 C38 · PLANNED C35 C38 | - |
| balance labels (3) | owes C38 C9 · credit C38 C9 · settled C38 C9 | - |
| statement states (4) | data C38 · empty C39 · loading C39 · error C39 | - |
| widths, AC 31 (2) | 390 C41 C43 · 1280 C41 C43 | - |
| MCP names, AC 32 (4) | contact only C44 · member + contact C44 · unknown C44 · ambiguous C44 | - |
| contact controls (7) | "New contact" C11 · row open C42 · "Archive" C12 · "Delete" C12 · "Record payment" C32 · "Rename" C3 C40 · split picker C21 | - |

## Swept

- validation: C1 (name bounds and trim), C17, C18, C27
- failure modes: C28 (the losing request writes nothing), C19 (a refused split leaves no row)
- idempotency: n/a - no request is retried by a client; a duplicate repayment is a second payment, as a duplicate expense is today
- authorization: C8, C10, C19, C21, C40
- concurrency: C28 (two repayments on one share), C3 (stale version on rename)
- data lifecycle: C5, C6, C7, C29, C30, C37; what a user entered comes back: C23
- dependency failure: n/a - no external call
- state transitions: C5 (archive guard), C6 (unarchive), C7 (delete guard); share status is derived, C35
- observability: n/a - no logging requirement; the existing request log covers the new routes

## Handoff

- **Settled mid-build:** none
- **Dispatched:** backend worker 1 (Sonnet), contacts + contact shares (C1-C8, C13-C20, C47), at `c8027bc9`, returned (`9dfea332`, `4f7abd42`; C8 statement row and C17 REPAYMENT case left to worker 2); backend worker 2 (Sonnet), repayments + statement + MCP (C24-C30, C35-C37, C44-C46, C8/C17 legs, C47 refresh), at `4f7abd42`, returned (`8fdfda0c`, `f0f63149`); frontend worker 3 (Sonnet), C9-C12, C21-C23, C31-C34, C38-C42, at `f0f63149`
- **Boundary:** C1-C7, C13-C16, C18-C20, C47 closed at `4f7abd42`; C8, C17, C24-C30, C35-C37, C44-C47 closed at `f0f63149`
- **Abandoned:** none
- **Walked:** none yet
