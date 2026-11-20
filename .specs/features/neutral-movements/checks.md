# Neutral Movements checks

Build: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -DskipITs -Dsurefire.skip=true; cd frontend && pnpm lint; cd frontend && pnpm build; cd frontend && node scripts/check-siblings.ts
Run unit: cd frontend && pnpm exec vitest run --project=unit --reporter=verbose src/features/transactions/components/transactionForm.test.ts src/features/transactions/components/TransactionFormDrawer.test.tsx src/features/transactions/TransactionsPage.test.tsx src/features/transactions/components/NeutralReviewSheet.test.tsx
Run stories: cd frontend && pnpm exec vitest run --project=storybook --reporter=verbose src/features/transactions/components/TransactionCells.stories.tsx src/features/transactions/components/TransactionMobileList.stories.tsx src/features/overview/components/SummaryCards.stories.tsx src/features/transactions/components/NeutralReviewListView.stories.tsx
Plan: `.specs/features/neutral-movements/plan.md`

28 checks in 4 slices · 2 one-way doors · 0 open, of which 0 block

## Checks

### S1 - Neutral rows leave the totals

**C1** - November with R$ 3,000 salary, R$ 200 market, R$ 1,500 CARD_BILL_PAYMENT and R$ 500 TRANSFER sent: the dashboard answers income 3000.00, expenses 200.00, result 2800.00 (AC 1)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='NeutralMovementsIT#neutralRowsCountInNoTotal' -Dsurefire.skip=true

**C2** - With the same rows, the monthly trend for November answers income 3000.00 and expenses 200.00, and the person breakdown gives the owner expense 200.00 (AC 1)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='NeutralMovementsIT#neutralRowsLeaveTrendAndPeople' -Dsurefire.skip=true

**C3** - A R$ 500 SAVINGS debit and a R$ 300 TRANSFER credit leave every category's spending and the plan's limits unchanged, table-driven over the 3 neutral kinds (AC 1)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='NeutralMovementsIT#neutralKindsLeaveCategoriesAndLimits' -Dsurefire.skip=true

**C4** - A neutral kind sent with a category, with a split that includes another member, or with items answers 422 `neutral-kind-invalid` on create and on update, and nothing is stored or changed (AC 2)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='NeutralMovementsIT#neutralKindRefusesCategorySplitAndItems' -Dsurefire.skip=true

**C5** - R$ 1,500 bill + R$ 500 TRANSFER sent + R$ 500 TRANSFER received: the dashboard answers `neutralOut` 2000.00 and `neutralIn` 500.00 (AC 3)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='NeutralMovementsIT#dashboardReportsNeutralOutAndIn' -Dsurefire.skip=true

**C6** - The Overview shows "Neutros" under the result with "saiu R$ 2.000,00" and "entrou R$ 500,00" when the summary has them, and no "Neutros" line when both are 0 (AC 3)
Proof: run stories | ✓ src/features/overview/components/SummaryCards.stories.tsx > With Neutral Movements
Proof: run stories | ✓ src/features/overview/components/SummaryCards.stories.tsx > Default

**C28** - With an uncategorized market purchase and an uncategorized CARD_BILL_PAYMENT, `uncategorized=true` returns only the purchase, in REST and in MCP `list_transactions` (AC 1)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='NeutralMovementsIT#uncategorizedFilterLeavesNeutralRowsOut' -Dsurefire.skip=true
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpNeutralKindIT#uncategorizedFilterLeavesNeutralRowsOut' -Dsurefire.skip=true

### S2 - Refunds lower spending

**C7** - R$ 100 pizza (DEBIT, Food) and a R$ 50 REFUND (CREDIT, Food): Food's spending is 50.00, expenses drop from 100.00 to 50.00, and income stays 0.00 (AC 4)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='NeutralMovementsIT#refundLowersItsCategoryAndExpenses' -Dsurefire.skip=true

**C8** - A R$ 50 refund attributed to Marina lowers Marina's expense in the person breakdown by 50.00 and leaves the owner's unchanged (AC 4)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='NeutralMovementsIT#refundLowersTheSpendingOfWhoItIsAttributedTo' -Dsurefire.skip=true

**C9** - A refund with no category, with a CREDIT category, or on a DEBIT row answers 422 `neutral-kind-invalid` (3 cases) (AC 5)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='NeutralMovementsIT#refundNeedsAnExpenseCategoryOnACredit' -Dsurefire.skip=true

**C10** - Food with limit 80.00, pizza 100.00 and refund 50.00: category spending reports 50.00 of 80.00 and not over the limit (AC 6)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='NeutralMovementsIT#limitIsMeasuredNetOfRefunds' -Dsurefire.skip=true

### S3 - Imports and review

**C11** - A Nubank statement with "Pagamento de fatura" (-1500.00), a Pix sent to a plan member and a market purchase imports 3 rows: only the bill has kind CARD_BILL_PAYMENT; the Pix and the purchase have none (AC 7)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='NeutralImportIT#importMarksOnlyCardBillPayments' -Dsurefire.skip=true

**C12** - With member "Marina Lima", the review list proposes TRANSFER for "Transferência enviada pelo Pix - MARINA SOUZA LIMA - ..." and "Transferência recebida pelo Pix - Marína Lima - ...", CARD_BILL_PAYMENT for an unmarked "Pagamento de fatura", and does not list "... - MARINA COSTA - ...", a row that already has a kind, or a row with no bank text; newest first (AC 8)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='NeutralCandidatesIT#candidatesMatchTheRules' -Dsurefire.skip=true

**C13** - Applying a candidate with its version answers 200 with the kind set; the row leaves the review list and the dashboard's expenses drop by its amount; applying with a stale version answers 409 and changes nothing (AC 9)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='NeutralCandidatesIT#applyingACandidateSetsItsKind' -Dsurefire.skip=true

**C14** - A contributor's review list holds only rows they created, and applying a kind to another member's row answers 403; a non-member gets 404 on both routes (AC 8, AC 9)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='NeutralCandidatesIT#reviewFollowsTheRowRoles' -Dsurefire.skip=true

**C15** - The role matrix covers `GET …/transaction/neutral-candidates` and `POST …/transaction/{id}/kind` for every role (AC 8, AC 9)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='PlanAuthorizationMatrixIT#neutralReviewFollowsTheRoleMatrix' -Dsurefire.skip=true

**C16** - In "Revisar movimentos", a member clicks "Aplicar" on a candidate: the request carries its proposed kind and version, the row leaves the list, and the transactions list refetches; with no candidates the sheet shows its empty state (AC 9, AC 10)
Proof: run unit | ✓ NeutralReviewSheet > applies a candidate and removes it from the list
Proof: run stories | ✓ src/features/transactions/components/NeutralReviewListView.stories.tsx > Empty

**C25** - Applying CARD_BILL_PAYMENT from the review to an imported "Pagamento de fatura" of 1500 in category "Cartão" answers 200, the row has no category and the kind set, it leaves the review list, and the category's spending drops by 1500 (AC 9)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='NeutralCandidatesIT#applyingRemovesTheCategoryOfANeutralRow' -Dsurefire.skip=true

**C26** - The owner edits Marina's TRANSFER of 500 (Marina the only participant) from the form, changing only the description: the PUT keeps Marina as the participant, answers 200, and the kind stays TRANSFER (AC 2, AC 11)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='NeutralMovementsIT#anyMemberCanSaveAnotherMembersNeutralRow' -Dsurefire.skip=true
Proof: run unit | ✓ TransactionFormDrawer > keeps the payer of a neutral row when another member saves it

**C27** - Member "Lucas" (one-word name): "…pelo Pix - LUCAS FERREIRA - …" is not proposed; "…pelo Pix - LUCAS - …" is proposed as TRANSFER (AC 8)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='NeutralCandidatesIT#oneWordNamesMatchOnlyTheWholeName' -Dsurefire.skip=true

### S4 - Seeing and choosing the kind

**C17** - In the form, choosing "Fatura" hides category and split, choosing "Reembolso" keeps category (expense categories) and hides split and items, and the payload carries `kind`; a form value with kind CARD_BILL_PAYMENT maps back to the same choice (AC 11)
Proof: run unit | ✓ transactionForm > maps the movement kind both ways
Proof: run unit | ✓ TransactionFormDrawer > saves a neutral kind without category or split
Proof: run unit | ✓ TransactionFormDrawer > keeps the category of a refund, from the expense categories

**C18** - Reopening a row saved as "Guardar" shows "Guardar" selected (AC 11)
Proof: run unit | ✓ TransactionFormDrawer > reopens a row with its movement kind

**C19** - A row of each kind shows its badge - "Entre membros", "Fatura", "Guardar", "Reembolso" - in the desktop row and in the phone list (AC 12)
Proof: run stories | ✓ src/features/transactions/components/TransactionCells.stories.tsx > Movement Kinds
Proof: run stories | ✓ src/features/transactions/components/TransactionMobileList.stories.tsx > Movement Kinds

**C20** - Choosing the "Neutros" filter requests the list with `kind=NEUTRAL` and keeps it in the URL; the backend returns only rows with a kind (AC 13)
Proof: run unit | ✓ TransactionsPage > filters the list to neutral movements
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='NeutralMovementsIT#listFilterNeutralReturnsOnlyRowsWithAKind' -Dsurefire.skip=true

**C21** - MCP `create_transaction` with `kind: CARD_BILL_PAYMENT` stores it; with `kind: REFUND` and an expense category stores a refund; with a neutral kind and a category answers the tool error naming the rule (AC 14)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpNeutralKindIT#createTakesTheKind' -Dsurefire.skip=true

**C22** - MCP `update_transaction` sets and clears `kind` on an existing row, and `list_transactions` returns each row's `kind` (AC 14)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpNeutralKindIT#updateAndListCarryTheKind' -Dsurefire.skip=true

**C23** - MCP `get_month_summary` and `get_category_spending` answer the same totals as the dashboard for the C1 and C7 rows (AC 1, AC 4)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpNeutralKindIT#summaryToolsUseTheNeutralRules' -Dsurefire.skip=true

**C24** - `V29` adds `transactions.kind`, nullable, with `ck_transactions_kind` refusing 'OTHER'; existing rows read null (AC 1)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='MigrationsIT#transactionKindIsAClosedNullableSet' -Dsurefire.skip=true

## Coverage

| Set (size) | Member -> proof | Unproven |
| --- | --- | --- |
| kinds (4) | TRANSFER C1 · CARD_BILL_PAYMENT C1 · SAVINGS C3 · REFUND C7 | - |
| aggregate readers (7) | summary C1 · trend C2 · person breakdown C2 · category spending C3 · limits C3 · MCP summary C23 · MCP category spending C23 | - |
| refund readers (4) | category C7 · expenses C7 · person C8 · limit C10 | - |
| kind validation (6) | neutral + category C4 · neutral + split C4 · neutral + items C4 · refund without category C9 · refund with credit category C9 · refund on a debit C9 | - |
| review rule, AC 8 (7 examples) | Pix sent to member C12 · Pix received, accents C12 · unmarked bill C12 · other name C12 · already kinded C12 · no bank text C12 · one-word name C27 | - |
| `POST /plan/{planId}/transaction/{id}/kind` statuses (6) | 200 C13 · 409 C13 · 422 C4 · 403 C14 · 404 C14 · apply removes category C25 | - |
| `GET /plan/{planId}/transaction/neutral-candidates` statuses (2) | 200 C12 · 404 C14 | - |
| `POST`, `PUT`, `GET /plan/{planId}/transaction` with `kind` statuses (3) | 200 C17 · 422 C4 · 404 existing (PlanAuthorizationMatrixIT non-member rows) C15 | - |
| neutral row payer (2) | creator C4 · another member C26 | - |
| uncategorized filter (2) | REST C28 · MCP C28 | - |
| `GET /plan/{planId}/dashboard` new fields (2) | `neutralOut` C5 · `neutralIn` C5 | - |
| badges (4) | Entre membros C19 · Fatura C19 · Guardar C19 · Reembolso C19 | - |
| MCP tools (5) | create C21 · update C22 · list C22 · month summary C23 · category spending C23 | - |
| door 1: `V29` (1) | C24 | - |
| door 2: API field and filter (3) | request C17 · response C22 · filter C20 | - |

## Swept

- validation: C4, C9
- failure modes: C4, C13 - a refused request stores nothing
- idempotency: C13 - applying again with the new version sets the same kind; a stale version is 409
- authorization: C14, C15
- concurrency: C13 - the row's optimistic-lock version guards a concurrent edit
- data lifecycle: C18 - the kind comes back after save and reopen; C24 - existing rows stay null, no backfill
- dependency failure: n/a - no external call
- state transitions: C13 - unmarked → kinded through the review; the form sets and clears it (C17, C22)
- observability: n/a - no logging requirement

## Handoff

- **Settled mid-build:** 2026-11-20, Verifier finding 1 asked to the owner ("Pagamento de fatura" with a category in the review list): user chose "Aplicar tira a categoria" - applying a neutral kind from the review removes the row's category, items and split, leaving the payer alone.
- **Dispatched:** backend worker (Sonnet) at 17a800b6, returned; frontend worker (Sonnet) at eef88bf0, returned; Verifier (Opus) at 84f3db67, returned; resumed for C25-C28 at 96a4fd43, returned
- **Boundary:** backend C1-C5, C7-C15, C20 (backend), C21-C24 closed at 7f71b4bf; frontend C6, C16-C19, C20 (frontend) closed at 8af5c53c; fixes C25-C28 closed at b09e870c
- **Abandoned:** none
- **Walked:** local stack (Postgres 5434, jar on 3000, vite preview 5173) at cf8d14c1. Lucas and Marina Lima in one plan; API: salary 3000, Mercado 200, Pizza 100 in Comida (limit 80), REFUND 50 in Comida, SAVINGS 300; Nubank CSV import with "Pagamento de fatura" -1500, Pix sent to MARINA SOUZA LIMA -500, Pix received from MARINA LIMA +500 → only the bill stored as CARD_BILL_PAYMENT. Visão geral (desktop): Receitas 3.500, Despesas 750, Resultado 2.750, "Neutros saiu R$ 1.800,00 · entrou R$ 0,00" under the result, Comida R$ 50,00 de R$ 80,00. Transações: badges Fatura, Guardar, Reembolso on their rows; "Revisar movimentos" (toolbar, beside Importar CSV) lists the two Pix as "Entre membros"; Aplicar on the received one → list keeps 1, toast "Movimento marcado". Editar on Mercado → "Tipo de movimento" = Guardar hides Categoria; saved; reopened shows Guardar. Filtros → Neutros → URL kind=NEUTRAL, chip "Neutros", 5 rows (Pix received, bill, Caixinha, refund, Mercado), Salário gone. Dashboard after: income 3000, expenses 550, neutralOut 2000, neutralIn 500. Phone 390x844: list badges, review sheet full width with Aplicar, Overview line "saiu R$ 2.000,00 · entrou R$ 500,00".
