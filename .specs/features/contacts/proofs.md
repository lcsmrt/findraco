# contacts proofs

**HEAD**: 93897353
**Tree**: clean
**Shell**: /bin/sh
**Result**: 80 pass, 0 fail

| Check | Proof | Result |
| --- | --- | --- |
| C1 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactsIT#createsTrimsAndBoun` | pass |
| C2 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactsIT#rejectsADuplicateAc` | pass |
| C3 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactsIT#renameReachesTheSha` | pass |
| C4 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactsIT#listsActiveContacts` | pass |
| C5 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactsIT#archivesOnlyAtZeroB` | pass |
| C6 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactsIT#unarchiveRestoresUn` | pass |
| C7 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactsIT#deletesOnlyAnUnused` | pass |
| C8 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactRoleMatrixIT' -Dsurefir` | pass |
| C9 | `run stories / ✓ src/features/plans/components/ContactsSectionView.stories.tsx > Empty` | pass |
| C9 | `run stories / ✓ src/features/plans/components/ContactsSectionView.stories.tsx > With Balances` | pass |
| C9 | `run stories / ✓ src/features/plans/components/ContactsSectionView.stories.tsx > With Archived` | pass |
| C10 | `run stories / ✓ src/features/plans/components/ContactsSectionView.stories.tsx > Read Only` | pass |
| C11 | `run unit / ✓ ContactsSection > creates a contact and lists it` | pass |
| C11 | `run unit / ✓ ContactsSection > shows the taken-name error on the field` | pass |
| C12 | `run unit / ✓ ContactsSection > refuses to archive a contact with a balance` | pass |
| C12 | `run unit / ✓ ContactsSection > archives a settled contact` | pass |
| C12 | `run unit / ✓ ContactsSection > offers archive when delete is refused` | pass |
| C13 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactSchemaIT' -Dsurefire.sk` | pass |
| C14 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactSharesIT#splitsWithCont` | pass |
| C15 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactSharesIT#contactSharesL` | pass |
| C16 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactSharesIT#contactSharesL` | pass |
| C17 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactSharesIT#contactSharesO` | pass |
| C18 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactSharesIT#archivedOrFore` | pass |
| C19 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactSharesIT#onlyOwnerAndEd` | pass |
| C20 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactSharesIT#seriesCarryCon` | pass |
| C21 | `run unit / ✓ TransactionFormDrawer contacts > offers contacts after members in the split` | pass |
| C21 | `run unit / ✓ TransactionFormDrawer contacts > sends the contact share` | pass |
| C21 | `run unit / ✓ TransactionFormDrawer contacts > offers no contact to a contributor` | pass |
| C22 | `run stories / ✓ src/features/transactions/components/TransactionCells.stories.tsx > With Contact Share` | pass |
| C22 | `run stories / ✓ src/features/transactions/components/TransactionMobileList.stories.tsx > With Contact Share` | pass |
| C23 | `run formunit / ✓ transactionForm contacts > round-trips a contact share` | pass |
| C24 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='RepaymentsIT#repaymentCountsIn` | pass |
| C25 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='RepaymentsIT#storesExplicitAll` | pass |
| C26 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='RepaymentsIT#omittedAllocation` | pass |
| C27 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='RepaymentsIT#allocationLimitsA` | pass |
| C28 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='RepaymentsIT#concurrentRepayme` | pass |
| C29 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='RepaymentsIT#editReplacesAndTr` | pass |
| C30 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='RepaymentsIT#reducingAShareCut` | pass |
| C31 | `run formunit / ✓ suggestAllocations > fills oldest first up to the amount` | pass |
| C31 | `run formunit / ✓ suggestAllocations > reports the excess` | pass |
| C32 | `run unit / ✓ ContactStatementPage > records a payment with the suggested allocation` | pass |
| C32 | `run unit / ✓ ContactStatementPage > sends only the ticked allocations` | pass |
| C33 | `run unit / ✓ TransactionFormDrawer repayment > turns an income into a contact payment` | pass |
| C33 | `run unit / ✓ TransactionFormDrawer repayment > shows the excess as credit` | pass |
| C34 | `run stories / ✓ src/features/transactions/components/TransactionCells.stories.tsx > Repayment` | pass |
| C34 | `run stories / ✓ src/features/transactions/components/TransactionMobileList.stories.tsx > Repayment` | pass |
| C35 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactStatementIT#groupsByMon` | pass |
| C36 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactStatementIT#balanceLeav` | pass |
| C37 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactStatementIT#trashedRows` | pass |
| C38 | `run stories / ✓ src/features/contacts/components/ContactStatementView.stories.tsx > Owes` | pass |
| C38 | `run stories / ✓ src/features/contacts/components/ContactStatementView.stories.tsx > Credit` | pass |
| C38 | `run stories / ✓ src/features/contacts/components/ContactStatementView.stories.tsx > Settled` | pass |
| C39 | `run stories / ✓ src/features/contacts/components/ContactStatementView.stories.tsx > Empty` | pass |
| C39 | `run stories / ✓ src/features/contacts/components/ContactStatementView.stories.tsx > Loading` | pass |
| C39 | `run stories / ✓ src/features/contacts/components/ContactStatementView.stories.tsx > Error` | pass |
| C40 | `run stories / ✓ src/features/contacts/components/ContactStatementView.stories.tsx > Read Only` | pass |
| C41 | `run stories / ✓ src/features/plans/components/ContactsSectionView.stories.tsx > Fits Phone` | pass |
| C41 | `run stories / ✓ src/features/contacts/components/ContactStatementView.stories.tsx > Fits Phone` | pass |
| C41 | `run stories / ✓ src/features/contacts/components/ContactStatementView.stories.tsx > Fits Desktop` | pass |
| C42 | `run unit / ✓ ContactsSection > opens the statement route` | pass |
| C43 | `walk - each step at both widths` | pass (Walked) |
| C44 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpContactsIT#attributedToReso` | pass |
| C45 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpContactsIT#repaymentApplies` | pass |
| C46 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpContactsIT#listsContactsAnd` | pass |
| C47 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='OpenApiSnapshotIT' -Dsurefire.` | pass |
| C48 | `run stories / ✓ src/features/contacts/components/ContactStatementView.stories.tsx > Long Name Reads In Full` | pass |
| C49 | `run table / ✓ TransactionsPage toolbar > names a contact on the table's attribution column even in a plan of o` | pass |
| C49 | `run table / ✓ TransactionsPage toolbar > has no attribution column in a plan of one member whose rows have no ` | pass |
| C49 | `run table / ✓ showParticipantsColumn > shows it in a plan of one member when a row has a contact's share, so h` | pass |
| C50 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='RepaymentsIT#aSettledPurchaseM` | pass |
| C51 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='RepaymentsIT#editingAPaymentWh` | pass |
| C52 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactSharesIT#markingAContac` | pass |
| C53 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactsIT#refusesArchiveWithP` | pass |
| C54 | `run unit / ✓ ContactsSection > refuses to archive a contact with planned purchases` | pass |
| C54 | `run stories / ✓ src/components/contact/ContactNoticeView.stories.tsx > Planned` | pass |
| C55 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='RepaymentsIT#aPurchaseRestoreW` | pass |
| Build | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -DskipITs -Dsurefire.skip=true` | pass |
| Build | `cd frontend && pnpm lint` | pass |
| Build | `cd frontend && pnpm build` | pass |
| Build | `cd frontend && node scripts/check-siblings.ts` | pass |

## Output

`Run stories` - exit 0

```

No story files found for the specified pattern: src/**/*.mdx
stderr | src/features/plans/components/ContactsSectionView.stories.tsx > With Balances
You are using Testing Library's `screen` object. Use `within(canvasElement)` instead.
More info: https://storybook.js.org/docs/writing-tests/interaction-testing?ref=error
stderr | src/features/contacts/components/ContactStatementView.stories.tsx > As Owner
You are using Testing Library's `screen` object. Use `within(canvasElement)` instead.
More info: https://storybook.js.org/docs/writing-tests/interaction-testing?ref=error
stderr | src/features/transactions/components/TransactionCells.stories.tsx > Edit Description
A component suspended inside an `act` scope, but the `act` call was not awaited. When testing React components that depend on asynchronous data, you must await the result:

await act(() => ...)
stderr | src/features/transactions/components/TransactionCells.stories.tsx > Edit Participants
You are using Testing Library's `screen` object. Use `within(canvasElement)` instead.
More info: https://storybook.js.org/docs/writing-tests/interaction-testing?ref=error
```

`Run unit` - exit 0

```
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer contacts > offers a plan of one member the split when it has a contact 63ms
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer contacts > offers no contact to a contributor 38ms
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer repayment > turns an income into a contact payment 476ms
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer repayment > gives the payment one receiving member whatever split came before, and lets the user choose who 499ms
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer repayment > shows the excess as credit 381ms
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer repayment > keeps what the user ticked when the amount changes afterwards 391ms
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer repayment > loads the allocations of the payment being edited 73ms
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer repayment > offers no contact payment to a contributor 111ms

 Test Files  3 passed (3)
      Tests  70 passed (70)
   Start at  12:40:58
   Duration  15.28s (transform 590ms, setup 493ms, collect 9.90s, tests 11.93s, environment 1.54s, prepare 149ms)

No story files found for the specified pattern: src/**/*.mdx
```

`Run formunit` - exit 0

```
 ✓ |unit| src/features/transactions/components/transactionForm.test.ts > transactionForm contacts > never turns a contact into the person of 'someone else' 0ms
 ✓ |unit| src/features/transactions/components/transactionForm.test.ts > transactionForm contact payment > sends the contact and only the ticked allocations, with no category or items 0ms
 ✓ |unit| src/features/transactions/components/transactionForm.test.ts > transactionForm contact payment > sends an empty allocation list when nothing is ticked, so the whole payment becomes credit 0ms
 ✓ |unit| src/features/transactions/components/transactionForm.test.ts > transactionForm contact payment > sends the member who received it when the user chose one 0ms
 ✓ |unit| src/features/transactions/components/transactionForm.test.ts > transactionForm contact payment > asks for the paying contact and keeps each ticked amount within what is open 0ms
 ✓ |unit| src/features/transactions/components/transactionForm.test.ts > transactionForm contact payment > refuses ticked amounts that add up to more than the payment, and accepts a payment that leaves credit 0ms
 ✓ |unit| src/features/transactions/components/transactionForm.test.ts > transactionForm contact payment > loads the contact of a stored payment and keeps its settled purchases on an inline edit 0ms
 ✓ |unit| src/features/transactions/components/transactionForm.test.ts > transactionForm contact payment > opens a new row as a contact payment from the preset contact, and leaves an existing row alone 0ms

 Test Files  2 passed (2)
      Tests  88 passed (88)
   Start at  12:41:16
   Duration  2.42s (transform 126ms, setup 230ms, collect 1.73s, tests 23ms, environment 866ms, prepare 84ms)

No story files found for the specified pattern: src/**/*.mdx
```

`Run table` - exit 0

```
Creating Table Instance...

 ✓ |unit| src/features/transactions/TransactionsPage.test.tsx > TransactionsPage period navigator (PNAV-01, PNAV-02) > replaces a custom range with the This month preset (PNAV-03 AC 1) 240ms
stdout | src/features/transactions/TransactionsPage.test.tsx > TransactionsPage period navigator (PNAV-01, PNAV-02) > ignores the pre-feature from and to params and opens on the current month (PNAV-05)
Creating Table Instance...

 ✓ |unit| src/features/transactions/TransactionsPage.test.tsx > TransactionsPage period navigator (PNAV-01, PNAV-02) > keeps the period when all filters are cleared (PNAV-02 AC 4) 116ms
 ✓ |unit| src/features/transactions/TransactionsPage.test.tsx > TransactionsPage period navigator (PNAV-01, PNAV-02) > ignores the pre-feature from and to params and opens on the current month (PNAV-05) 27ms

 Test Files  2 passed (2)
      Tests  53 passed (53)
   Start at  12:41:20
   Duration  13.09s (transform 598ms, setup 205ms, collect 3.07s, tests 9.42s, environment 691ms, prepare 84ms)

No story files found for the specified pattern: src/**/*.mdx
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactsIT#createsTrimsAndBoun` - exit 0

```
2026-11-25T12:41:54.646-03:00  INFO 3717824 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-25T12:41:54.703-03:00  INFO 3717824 --- [           main] [] com.lcs.findraco.plan.ContactsIT         : Started ContactsIT in 10.927 seconds (process running for 12.033)
2026-11-25T12:41:55.423-03:00  INFO 3717824 --- [           main] [5d2367bd-5ac5-47cf-b92d-58657b12be74] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts 201 217ms userId=1 planId=1
2026-11-25T12:41:55.505-03:00  INFO 3717824 --- [           main] [83f17e18-06fd-4a5f-ab9d-f974de9c77b3] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts 201 20ms userId=1 planId=1
2026-11-25T12:41:55.531-03:00  INFO 3717824 --- [           main] [48ed15a4-ff9a-41c1-b630-bf3c4a225641] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts 422 24ms userId=1 planId=1
2026-11-25T12:41:55.566-03:00  INFO 3717824 --- [           main] [207e286e-65a2-489a-87bb-ac79c87a3092] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts 422 6ms userId=1 planId=1
2026-11-25T12:41:55.572-03:00  INFO 3717824 --- [           main] [c0cb5c9b-3556-4e73-8952-6f83aee8fbe4] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts 422 5ms userId=1 planId=1
2026-11-25T12:41:55.592-03:00  INFO 3717824 --- [           main] [95d75339-c715-4a62-9aef-626f7a3be690] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts 201 18ms userId=1 planId=1
2026-11-25T12:41:55.619-03:00  INFO 3717824 --- [           main] [a3edb213-f3a3-4648-a295-425f36bd41d8] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 25ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactsIT#rejectsADuplicateAc` - exit 0

```
2026-11-25T12:42:19.253-03:00  INFO 3718284 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-25T12:42:19.253-03:00  INFO 3718284 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-25T12:42:19.255-03:00  INFO 3718284 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 2 ms
2026-11-25T12:42:19.311-03:00  INFO 3718284 --- [           main] [] com.lcs.findraco.plan.ContactsIT         : Started ContactsIT in 9.748 seconds (process running for 10.911)
2026-11-25T12:42:19.997-03:00  INFO 3718284 --- [           main] [d1e037e7-c8d3-4713-b925-a739fbabad8f] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts 422 204ms userId=1 planId=1
2026-11-25T12:42:20.122-03:00  INFO 3718284 --- [           main] [2e8fe49b-32d6-4b7e-afdf-4b927c00f0c3] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts 201 40ms userId=1 planId=2
2026-11-25T12:42:20.147-03:00  INFO 3718284 --- [           main] [cf7122d9-6d93-4dfb-a3f5-b4108f855a13] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts 201 15ms userId=1 planId=1
2026-11-25T12:42:20.184-03:00  INFO 3718284 --- [           main] [447824a7-30e5-42c7-9aac-311557f4b381] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts/{id}/archive 200 34ms userId=1 planId=1
2026-11-25T12:42:20.203-03:00  INFO 3718284 --- [           main] [76ef380a-d9bf-45e9-9300-26c7d81404fa] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts 201 17ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactsIT#renameReachesTheSha` - exit 0

```
2026-11-25T12:42:42.279-03:00  INFO 3718736 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-25T12:42:42.279-03:00  INFO 3718736 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-25T12:42:42.281-03:00  INFO 3718736 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-25T12:42:42.338-03:00  INFO 3718736 --- [           main] [] com.lcs.findraco.plan.ContactsIT         : Started ContactsIT in 9.649 seconds (process running for 10.86)
2026-11-25T12:42:43.074-03:00  INFO 3718736 --- [           main] [322c4d62-0c71-42f4-af38-a72a398c8f8c] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/contacts/{id} 200 232ms userId=1 planId=1
2026-11-25T12:42:43.183-03:00  INFO 3718736 --- [           main] [cb66e4e4-9399-4f55-8548-3abca0306f55] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/{id} 200 44ms userId=1 planId=1
2026-11-25T12:42:43.206-03:00  INFO 3718736 --- [           main] [46cc1708-c4cc-4388-9e3c-7586daf4a9e2] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/contacts/{id} 409 22ms userId=1 planId=1
2026-11-25T12:42:43.268-03:00  INFO 3718736 --- [           main] [b1f13572-e2ca-4c46-9f20-eae15ffe74b9] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 28ms userId=1 planId=1
2026-11-25T12:42:43.291-03:00  INFO 3718736 --- [           main] [a4a776bd-050a-4c6d-b245-e0084b94141a] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/contacts/{id} 422 11ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactsIT#listsActiveContacts` - exit 0

```
2026-11-25T12:43:05.217-03:00  INFO 3719223 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable prompts capabilities, notification: true
2026-11-25T12:43:05.218-03:00  INFO 3719223 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable completions capabilities
2026-11-25T12:43:05.375-03:00  INFO 3719223 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-25T12:43:05.375-03:00  INFO 3719223 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-25T12:43:05.377-03:00  INFO 3719223 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 2 ms
2026-11-25T12:43:05.435-03:00  INFO 3719223 --- [           main] [] com.lcs.findraco.plan.ContactsIT         : Started ContactsIT in 9.486 seconds (process running for 10.596)
2026-11-25T12:43:06.183-03:00  INFO 3719223 --- [           main] [2afaefa1-bf50-4fe8-815f-98a9db91fc1b] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts/{id}/archive 200 224ms userId=1 planId=1
2026-11-25T12:43:06.216-03:00  INFO 3719223 --- [           main] [112735cc-bb72-41c7-8bfe-8c1ddb17e7dd] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 25ms userId=1 planId=1
2026-11-25T12:43:06.300-03:00  INFO 3719223 --- [           main] [d1c0d6d4-890e-456d-8271-c9758d9aa055] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 18ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactsIT#archivesOnlyAtZeroB` - exit 0

```
2026-11-25T12:43:29.188-03:00  WARN 3719661 --- [           main] [733b8b13-f29b-4b91-a7b0-cc5f1c6d98a7] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: allocations
2026-11-25T12:43:29.188-03:00  WARN 3719661 --- [           main] [733b8b13-f29b-4b91-a7b0-cc5f1c6d98a7] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#allocations()
2026-11-25T12:43:29.189-03:00  WARN 3719661 --- [           main] [733b8b13-f29b-4b91-a7b0-cc5f1c6d98a7] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List)
2026-11-25T12:43:29.189-03:00  WARN 3719661 --- [           main] [733b8b13-f29b-4b91-a7b0-cc5f1c6d98a7] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List)
2026-11-25T12:43:29.189-03:00  WARN 3719661 --- [           main] [733b8b13-f29b-4b91-a7b0-cc5f1c6d98a7] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List)
2026-11-25T12:43:29.189-03:00  WARN 3719661 --- [           main] [733b8b13-f29b-4b91-a7b0-cc5f1c6d98a7] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#participants()
2026-11-25T12:43:29.189-03:00  WARN 3719661 --- [           main] [733b8b13-f29b-4b91-a7b0-cc5f1c6d98a7] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-25T12:43:29.189-03:00  WARN 3719661 --- [           main] [733b8b13-f29b-4b91-a7b0-cc5f1c6d98a7] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-25T12:43:29.211-03:00  INFO 3719661 --- [           main] [733b8b13-f29b-4b91-a7b0-cc5f1c6d98a7] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 52ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactsIT#unarchiveRestoresUn` - exit 0

```
2026-11-25T12:43:50.799-03:00  INFO 3720146 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 2 ms
2026-11-25T12:43:50.863-03:00  INFO 3720146 --- [           main] [] com.lcs.findraco.plan.ContactsIT         : Started ContactsIT in 9.454 seconds (process running for 10.714)
2026-11-25T12:43:51.567-03:00  INFO 3720146 --- [           main] [b40bb061-2a18-4d74-ba5b-f35bf91e845f] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts/{id}/archive 200 222ms userId=1 planId=1
2026-11-25T12:43:51.598-03:00  INFO 3720146 --- [           main] [e0fcdbf1-e112-449c-8192-853c80a1880c] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts/{id}/archive 200 26ms userId=1 planId=1
2026-11-25T12:43:51.632-03:00  INFO 3720146 --- [           main] [603e18cf-6331-4430-99b3-b81fa3dc900d] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts 201 30ms userId=1 planId=1
2026-11-25T12:43:51.655-03:00  INFO 3720146 --- [           main] [96e392a9-71bc-4350-8722-8b31c898cf5d] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts/{id}/unarchive 422 20ms userId=1 planId=1
2026-11-25T12:43:51.709-03:00  INFO 3720146 --- [           main] [22cc616e-dded-4df8-91a3-551d2cfe5bd5] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 27ms userId=1 planId=1
2026-11-25T12:43:51.794-03:00  INFO 3720146 --- [           main] [3cc3124c-3ae8-480a-9f44-d80fb6b3f53b] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts/{id}/unarchive 200 22ms userId=1 planId=1
2026-11-25T12:43:51.813-03:00  INFO 3720146 --- [           main] [ea9c3320-4976-4c26-9e5c-5fde0f7999b4] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 17ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactsIT#deletesOnlyAnUnused` - exit 0

```
2026-11-25T12:44:14.562-03:00  INFO 3720596 --- [           main] [c4d4f3dd-c83d-4d6f-afce-01405669ec11] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 284ms userId=1 planId=1
2026-11-25T12:44:14.590-03:00  INFO 3720596 --- [           main] [24871dce-ae86-4746-98e4-7cbd255580cc] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/{id} 200 22ms userId=1 planId=1
2026-11-25T12:44:14.615-03:00  INFO 3720596 --- [           main] [c0c0f7a6-bc5b-4f07-80f6-341d8faa98d7] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/contacts/{id} 409 23ms userId=1 planId=1
2026-11-25T12:44:14.657-03:00  INFO 3720596 --- [           main] [69b96a82-f16b-4271-80a9-94feb62da5e1] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/contacts/{id} 409 13ms userId=1 planId=1
2026-11-25T12:44:14.674-03:00  INFO 3720596 --- [           main] [b16394b8-da59-4104-b049-b843e43b9d60] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/contacts/{id} 409 15ms userId=1 planId=1
2026-11-25T12:44:14.684-03:00  INFO 3720596 --- [           main] [549070ac-d3e4-4ab5-acc6-307aaf1114a3] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/contacts/{id} 409 8ms userId=1 planId=1
2026-11-25T12:44:14.720-03:00  INFO 3720596 --- [           main] [ef75532d-3c98-4922-990e-129b0624429e] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 34ms userId=1 planId=1
2026-11-25T12:44:14.806-03:00  INFO 3720596 --- [           main] [ec07b989-ef8a-45a5-b905-f1cd3f2aa4e3] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/contacts/{id} 204 20ms userId=1 planId=1
2026-11-25T12:44:14.819-03:00  INFO 3720596 --- [           main] [f03b91b0-4a54-4d54-a1dd-6ef0776c8a64] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 11ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactRoleMatrixIT' -Dsurefir` - exit 0

```
2026-11-25T12:44:40.472-03:00  INFO 3721046 --- [           main] [39498412-1390-4dac-bc8f-e73f98a26e1c] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts/{id}/unarchive 200 16ms userId=2 planId=1
2026-11-25T12:44:40.541-03:00  INFO 3721046 --- [           main] [c7e650e9-60c9-4660-b8ca-cac2a888f89d] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts/{id}/unarchive 403 5ms userId=3 planId=1
2026-11-25T12:44:40.607-03:00  INFO 3721046 --- [           main] [c9d986e1-9338-4089-ab75-c97dca12c20c] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts/{id}/unarchive 403 6ms userId=4 planId=1
2026-11-25T12:44:40.673-03:00  INFO 3721046 --- [           main] [f8f55068-96f3-4517-9d99-d7866ebaa199] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts/{id}/unarchive 404 5ms userId=5 planId=1
2026-11-25T12:44:40.751-03:00  INFO 3721046 --- [           main] [4a87fa38-b33a-48a7-9cba-98117fa13a89] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/contacts/{id} 204 19ms userId=1 planId=1
2026-11-25T12:44:40.824-03:00  INFO 3721046 --- [           main] [c7c4bb36-d592-464e-a2f3-36bd49ca0c5a] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/contacts/{id} 204 12ms userId=2 planId=1
2026-11-25T12:44:40.887-03:00  INFO 3721046 --- [           main] [9a0d1580-a717-4061-a974-e2e34288e861] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/contacts/{id} 403 5ms userId=3 planId=1
2026-11-25T12:44:40.943-03:00  INFO 3721046 --- [           main] [bcff6561-c5fd-46d7-ac89-84e6a2a2df0f] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/contacts/{id} 403 5ms userId=4 planId=1
2026-11-25T12:44:41.001-03:00  INFO 3721046 --- [           main] [61095043-e531-45c5-8ad8-8d43b3e9daaa] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/contacts/{id} 404 4ms userId=5 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactSchemaIT' -Dsurefire.sk` - exit 0

```
2026-11-25T12:45:04.622-03:00  INFO 3721497 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Registered tools: 11
2026-11-25T12:45:04.622-03:00  INFO 3721497 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable resources capabilities, notification: true
2026-11-25T12:45:04.624-03:00  INFO 3721497 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable resources templates capabilities, notification: true
2026-11-25T12:45:04.624-03:00  INFO 3721497 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable prompts capabilities, notification: true
2026-11-25T12:45:04.626-03:00  INFO 3721497 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable completions capabilities
2026-11-25T12:45:04.755-03:00  INFO 3721497 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-25T12:45:04.755-03:00  INFO 3721497 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-25T12:45:04.757-03:00  INFO 3721497 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 2 ms
2026-11-25T12:45:04.815-03:00  INFO 3721497 --- [           main] [] com.lcs.findraco.plan.ContactSchemaIT    : Started ContactSchemaIT in 10.825 seconds (process running for 11.908)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactSharesIT#splitsWithCont` - exit 0

```
2026-11-25T12:45:27.978-03:00  WARN 3721951 --- [           main] [416ac247-c787-4574-91d9-fe3fa66127db] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#items()
2026-11-25T12:45:27.978-03:00  WARN 3721951 --- [           main] [416ac247-c787-4574-91d9-fe3fa66127db] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: allocations
2026-11-25T12:45:27.978-03:00  WARN 3721951 --- [           main] [416ac247-c787-4574-91d9-fe3fa66127db] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#allocations()
2026-11-25T12:45:27.978-03:00  WARN 3721951 --- [           main] [416ac247-c787-4574-91d9-fe3fa66127db] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-25T12:45:27.978-03:00  WARN 3721951 --- [           main] [416ac247-c787-4574-91d9-fe3fa66127db] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#participants()
2026-11-25T12:45:28.124-03:00  INFO 3721951 --- [           main] [416ac247-c787-4574-91d9-fe3fa66127db] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 274ms userId=1 planId=1
2026-11-25T12:45:28.206-03:00  INFO 3721951 --- [           main] [b9fa2a1a-39f4-4ea2-84b5-727d06a093f1] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 20ms userId=1 planId=1
2026-11-25T12:45:28.222-03:00  INFO 3721951 --- [           main] [fb542e2a-ec00-4ebe-afea-c3455bd26826] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 15ms userId=1 planId=1
2026-11-25T12:45:28.249-03:00  INFO 3721951 --- [           main] [6a92012b-fb22-45fd-a1a0-0d94df658989] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 21ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactSharesIT#contactSharesL` - exit 0

```
2026-11-25T12:45:49.913-03:00  WARN 3722430 --- [           main] [ae9f6313-27ab-4a4a-a9ee-b4f0e9c13f84] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#items()
2026-11-25T12:45:49.913-03:00  WARN 3722430 --- [           main] [ae9f6313-27ab-4a4a-a9ee-b4f0e9c13f84] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#allocations()
2026-11-25T12:45:49.913-03:00  WARN 3722430 --- [           main] [ae9f6313-27ab-4a4a-a9ee-b4f0e9c13f84] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#participants()
2026-11-25T12:45:49.913-03:00  WARN 3722430 --- [           main] [ae9f6313-27ab-4a4a-a9ee-b4f0e9c13f84] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: allocations
2026-11-25T12:45:49.913-03:00  WARN 3722430 --- [           main] [ae9f6313-27ab-4a4a-a9ee-b4f0e9c13f84] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-25T12:45:50.044-03:00  INFO 3722430 --- [           main] [ae9f6313-27ab-4a4a-a9ee-b4f0e9c13f84] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 249ms userId=1 planId=1
2026-11-25T12:45:50.160-03:00  INFO 3722430 --- [           main] [643e0f04-d1fd-47e7-bba4-27879119376e] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/dashboard 200 104ms userId=1 planId=1
2026-11-25T12:45:50.227-03:00  INFO 3722430 --- [           main] [c1d1069a-a080-4830-b400-a1e7413040c3] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/dashboard/trend 200 23ms userId=1 planId=1
2026-11-25T12:45:50.259-03:00  INFO 3722430 --- [           main] [282617e7-70fa-4715-815e-f5fe08ad47d5] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/dashboard 200 24ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactSharesIT#contactSharesL` - exit 0

```
2026-11-25T12:46:12.890-03:00  WARN 3722889 --- [           main] [58817f6a-bd95-425d-a92a-ab8de459f6e9] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#com.lcs.findraco.transaction.request.UpdateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List, Long)
2026-11-25T12:46:12.890-03:00  WARN 3722889 --- [           main] [58817f6a-bd95-425d-a92a-ab8de459f6e9] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#com.lcs.findraco.transaction.request.UpdateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List, Long)
2026-11-25T12:46:12.890-03:00  WARN 3722889 --- [           main] [58817f6a-bd95-425d-a92a-ab8de459f6e9] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#com.lcs.findraco.transaction.request.UpdateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List, Long)
2026-11-25T12:46:12.890-03:00  WARN 3722889 --- [           main] [58817f6a-bd95-425d-a92a-ab8de459f6e9] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: allocations
2026-11-25T12:46:12.890-03:00  WARN 3722889 --- [           main] [58817f6a-bd95-425d-a92a-ab8de459f6e9] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#allocations()
2026-11-25T12:46:12.891-03:00  WARN 3722889 --- [           main] [58817f6a-bd95-425d-a92a-ab8de459f6e9] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-25T12:46:12.891-03:00  WARN 3722889 --- [           main] [58817f6a-bd95-425d-a92a-ab8de459f6e9] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#participants()
2026-11-25T12:46:12.944-03:00  INFO 3722889 --- [           main] [58817f6a-bd95-425d-a92a-ab8de459f6e9] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/{id} 200 66ms userId=1 planId=1
2026-11-25T12:46:12.970-03:00  INFO 3722889 --- [           main] [ac204dff-ec60-41a1-9168-842f212a145b] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/category/spending 200 24ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactSharesIT#contactSharesO` - exit 0

```
2026-11-25T12:46:35.890-03:00  INFO 3723348 --- [           main] [b0e5c703-58aa-42bd-ad71-375a2641b79b] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/{id} 422 14ms userId=1 planId=1
2026-11-25T12:46:35.903-03:00  INFO 3723348 --- [           main] [3ab9cc4e-b85a-4bb4-a3eb-ae649f19c259] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 11ms userId=1 planId=1
2026-11-25T12:46:35.917-03:00  INFO 3723348 --- [           main] [4447ca22-3d75-424a-8d0e-9dd096c9f8fd] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/{id} 422 12ms userId=1 planId=1
2026-11-25T12:46:35.929-03:00  INFO 3723348 --- [           main] [57f3f933-41df-4c5b-903e-a93ccca0206c] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 11ms userId=1 planId=1
2026-11-25T12:46:35.945-03:00  INFO 3723348 --- [           main] [9c22a9a7-850d-4fe1-a326-57ef34150cb0] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/{id} 422 13ms userId=1 planId=1
2026-11-25T12:46:36.004-03:00  WARN 3723348 --- [           main] [1c7658e4-af3e-46d6-99c6-54dced44d84f] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-25T12:46:36.004-03:00  WARN 3723348 --- [           main] [1c7658e4-af3e-46d6-99c6-54dced44d84f] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-25T12:46:36.004-03:00  WARN 3723348 --- [           main] [1c7658e4-af3e-46d6-99c6-54dced44d84f] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-25T12:46:36.012-03:00  INFO 3723348 --- [           main] [1c7658e4-af3e-46d6-99c6-54dced44d84f] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 422 18ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactSharesIT#archivedOrFore` - exit 0

```
2026-11-25T12:46:58.414-03:00  WARN 3723818 --- [           main] [bf6e0659-5cd5-4c15-ae41-61e287cce3f5] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: allocations
2026-11-25T12:46:58.414-03:00  WARN 3723818 --- [           main] [bf6e0659-5cd5-4c15-ae41-61e287cce3f5] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#allocations()
2026-11-25T12:46:58.444-03:00  INFO 3723818 --- [           main] [bf6e0659-5cd5-4c15-ae41-61e287cce3f5] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 59ms userId=1 planId=1
2026-11-25T12:46:58.481-03:00  INFO 3723818 --- [           main] [37298a79-2b44-4ccc-b4e7-fea707290e50] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 404 12ms userId=1 planId=1
2026-11-25T12:46:58.491-03:00  WARN 3723818 --- [           main] [d263788c-1ba4-4dc1-a370-2be7a3103ef0] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-25T12:46:58.491-03:00  WARN 3723818 --- [           main] [d263788c-1ba4-4dc1-a370-2be7a3103ef0] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-25T12:46:58.491-03:00  WARN 3723818 --- [           main] [d263788c-1ba4-4dc1-a370-2be7a3103ef0] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-25T12:46:58.499-03:00  INFO 3723818 --- [           main] [d263788c-1ba4-4dc1-a370-2be7a3103ef0] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 422 17ms userId=1 planId=1
2026-11-25T12:46:58.510-03:00  INFO 3723818 --- [           main] [8b76a51c-30d9-45e0-9969-bac794add0f0] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 404 9ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactSharesIT#onlyOwnerAndEd` - exit 0

```
2026-11-25T12:47:22.883-03:00  WARN 3724306 --- [           main] [3380e4b2-5a2c-4cd1-ac40-9dfb09becdbb] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#allocations()
2026-11-25T12:47:22.883-03:00  WARN 3724306 --- [           main] [3380e4b2-5a2c-4cd1-ac40-9dfb09becdbb] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-25T12:47:22.883-03:00  WARN 3724306 --- [           main] [3380e4b2-5a2c-4cd1-ac40-9dfb09becdbb] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: allocations
2026-11-25T12:47:22.883-03:00  WARN 3724306 --- [           main] [3380e4b2-5a2c-4cd1-ac40-9dfb09becdbb] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#com.lcs.findraco.transaction.request.UpdateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List, Long)
2026-11-25T12:47:22.884-03:00  WARN 3724306 --- [           main] [3380e4b2-5a2c-4cd1-ac40-9dfb09becdbb] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#com.lcs.findraco.transaction.request.UpdateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List, Long)
2026-11-25T12:47:22.884-03:00  WARN 3724306 --- [           main] [3380e4b2-5a2c-4cd1-ac40-9dfb09becdbb] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#com.lcs.findraco.transaction.request.UpdateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List, Long)
2026-11-25T12:47:22.884-03:00  WARN 3724306 --- [           main] [3380e4b2-5a2c-4cd1-ac40-9dfb09becdbb] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#items()
2026-11-25T12:47:22.912-03:00  INFO 3724306 --- [           main] [3380e4b2-5a2c-4cd1-ac40-9dfb09becdbb] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/{id} 403 45ms userId=3 planId=1
2026-11-25T12:47:22.936-03:00  INFO 3724306 --- [           main] [9181d1b1-f2f4-41da-90bf-9e114eca4d1a] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 21ms userId=2 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactSharesIT#seriesCarryCon` - exit 0

```
2026-11-25T12:47:49.463-03:00  INFO 3724762 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-25T12:47:49.529-03:00  INFO 3724762 --- [           main] [] c.l.f.transaction.ContactSharesIT        : Started ContactSharesIT in 11.329 seconds (process running for 12.662)
2026-11-25T12:47:50.162-03:00  WARN 3724762 --- [           main] [cefec717-2e39-413d-820a-af189c616c52] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-25T12:47:50.166-03:00  WARN 3724762 --- [           main] [cefec717-2e39-413d-820a-af189c616c52] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-25T12:47:50.166-03:00  WARN 3724762 --- [           main] [cefec717-2e39-413d-820a-af189c616c52] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-25T12:47:50.369-03:00  INFO 3724762 --- [           main] [cefec717-2e39-413d-820a-af189c616c52] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 329ms userId=1 planId=1
2026-11-25T12:47:50.487-03:00  INFO 3724762 --- [           main] [709b6fc6-cfe3-46f9-a8c8-1fd26bd6cc31] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 45ms userId=1 planId=1
2026-11-25T12:47:50.566-03:00  INFO 3724762 --- [           main] [ead819f0-5c7b-4d62-9d4e-55c9c1742115] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/{id}/confirm 200 76ms userId=1 planId=1
2026-11-25T12:47:50.682-03:00  INFO 3724762 --- [           main] [12fbc16a-2eda-4c23-aa0a-147f53f2e140] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 109ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='RepaymentsIT#repaymentCountsIn` - exit 0

```
2026-11-25T12:48:14.582-03:00  WARN 3725216 --- [           main] [a3093938-519f-4542-8201-cd2c68b0bbbb] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List)
2026-11-25T12:48:14.582-03:00  WARN 3725216 --- [           main] [a3093938-519f-4542-8201-cd2c68b0bbbb] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List)
2026-11-25T12:48:14.582-03:00  WARN 3725216 --- [           main] [a3093938-519f-4542-8201-cd2c68b0bbbb] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-25T12:48:14.582-03:00  WARN 3725216 --- [           main] [a3093938-519f-4542-8201-cd2c68b0bbbb] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-25T12:48:14.736-03:00  INFO 3725216 --- [           main] [a3093938-519f-4542-8201-cd2c68b0bbbb] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 276ms userId=1 planId=1
2026-11-25T12:48:14.876-03:00  INFO 3725216 --- [           main] [173ca85b-b53f-41f0-80c1-8061b97fe055] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/dashboard 200 76ms userId=1 planId=1
2026-11-25T12:48:14.906-03:00  INFO 3725216 --- [           main] [82914446-f200-4f6c-9312-7d55ee5395b2] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/dashboard/trend 200 20ms userId=1 planId=1
2026-11-25T12:48:14.985-03:00  INFO 3725216 --- [           main] [f7490626-b9b0-41a0-8d1d-84fcf8bcc5ff] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction 200 77ms userId=1 planId=1
2026-11-25T12:48:15.018-03:00  INFO 3725216 --- [           main] [0feab9ea-5397-4034-83f1-3e0147ca75ce] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction 200 31ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='RepaymentsIT#storesExplicitAll` - exit 0

```
2026-11-25T12:48:37.533-03:00  WARN 3725667 --- [           main] [0b686eb7-debb-4837-bf45-aaa248576d2d] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#participants()
2026-11-25T12:48:37.533-03:00  WARN 3725667 --- [           main] [0b686eb7-debb-4837-bf45-aaa248576d2d] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List)
2026-11-25T12:48:37.534-03:00  WARN 3725667 --- [           main] [0b686eb7-debb-4837-bf45-aaa248576d2d] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List)
2026-11-25T12:48:37.534-03:00  WARN 3725667 --- [           main] [0b686eb7-debb-4837-bf45-aaa248576d2d] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List)
2026-11-25T12:48:37.534-03:00  WARN 3725667 --- [           main] [0b686eb7-debb-4837-bf45-aaa248576d2d] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: allocations
2026-11-25T12:48:37.734-03:00  INFO 3725667 --- [           main] [0b686eb7-debb-4837-bf45-aaa248576d2d] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 309ms userId=1 planId=1
2026-11-25T12:48:37.850-03:00  INFO 3725667 --- [           main] [30da8b2e-cff1-4b10-a909-33e543d38946] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 40ms userId=1 planId=1
2026-11-25T12:48:37.892-03:00  INFO 3725667 --- [           main] [6bc8b9e0-9790-4827-bdb6-a5e045abdfcd] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 33ms userId=1 planId=1
2026-11-25T12:48:37.912-03:00  INFO 3725667 --- [           main] [eecbb967-5b8f-4b65-ae24-04055f3e7d73] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 15ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='RepaymentsIT#omittedAllocation` - exit 0

```
2026-11-25T12:49:00.796-03:00  WARN 3726158 --- [           main] [2743eeaa-f20b-41a0-908d-7ce4758720ae] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#allocations()
2026-11-25T12:49:00.797-03:00  WARN 3726158 --- [           main] [2743eeaa-f20b-41a0-908d-7ce4758720ae] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: allocations
2026-11-25T12:49:00.797-03:00  WARN 3726158 --- [           main] [2743eeaa-f20b-41a0-908d-7ce4758720ae] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-25T12:49:00.973-03:00  INFO 3726158 --- [           main] [2743eeaa-f20b-41a0-908d-7ce4758720ae] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 286ms userId=1 planId=1
2026-11-25T12:49:01.074-03:00  INFO 3726158 --- [           main] [abdec865-db34-4a15-967e-b5ceb9dff6f5] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 31ms userId=1 planId=1
2026-11-25T12:49:01.115-03:00  INFO 3726158 --- [           main] [65ab32f9-8ce9-4cc2-957e-8a9be7469c1b] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 36ms userId=1 planId=1
2026-11-25T12:49:01.134-03:00  INFO 3726158 --- [           main] [af515450-28dd-420f-87e6-a6699e9ab0df] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 14ms userId=1 planId=1
2026-11-25T12:49:01.165-03:00  INFO 3726158 --- [           main] [33872f1c-180c-4e0d-9f0f-b54d1c96b5f0] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 28ms userId=1 planId=1
2026-11-25T12:49:01.179-03:00  INFO 3726158 --- [           main] [8075fa87-982a-462a-99a0-909f8804b19c] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 10ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='RepaymentsIT#allocationLimitsA` - exit 0

```
2026-11-25T12:49:24.159-03:00  WARN 3726594 --- [           main] [37ae2f5f-f31b-47b8-9840-4b5b4bc61b26] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#allocations()
2026-11-25T12:49:24.353-03:00  INFO 3726594 --- [           main] [37ae2f5f-f31b-47b8-9840-4b5b4bc61b26] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 317ms userId=1 planId=1
2026-11-25T12:49:24.400-03:00  INFO 3726594 --- [           main] [466bf237-a2ae-459e-b1d3-c844db33bba1] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 34ms userId=1 planId=1
2026-11-25T12:49:24.448-03:00  INFO 3726594 --- [           main] [e3cb2a0c-e91d-4747-b33e-981d13beb256] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 22ms userId=1 planId=1
2026-11-25T12:49:24.473-03:00  INFO 3726594 --- [           main] [ff96bde3-f29e-4182-b42e-f7ec68bf9e01] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 23ms userId=1 planId=1
2026-11-25T12:49:24.505-03:00  INFO 3726594 --- [           main] [8b6a445c-852b-4850-a2b2-ce791fac6711] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 30ms userId=1 planId=1
2026-11-25T12:49:24.540-03:00  INFO 3726594 --- [           main] [e6431952-364c-4983-8b51-2f3ca659ec3e] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 33ms userId=1 planId=1
2026-11-25T12:49:24.628-03:00  INFO 3726594 --- [           main] [98866d79-0324-4893-a17f-f68d9447aff4] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 40ms userId=1 planId=1
2026-11-25T12:49:24.657-03:00  INFO 3726594 --- [           main] [01c57a99-d6df-4955-be65-7ca267328b67] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 27ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='RepaymentsIT#concurrentRepayme` - exit 0

```
2026-11-25T12:49:49.113-03:00  INFO 3727047 --- [pool-3-thread-1] [a464d664-d3e1-4a68-b3d6-d7c5bcc21d33] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 331ms userId=1 planId=1
2026-11-25T12:49:49.218-03:00  INFO 3727047 --- [pool-3-thread-1] [8ac76376-cff1-4afc-976d-d1fb40f566ea] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 36ms userId=1 planId=1
2026-11-25T12:49:49.237-03:00  INFO 3727047 --- [pool-3-thread-2] [83a44b39-7d1f-4664-9bee-4306091da4d0] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 55ms userId=1 planId=1
2026-11-25T12:49:49.290-03:00  INFO 3727047 --- [pool-3-thread-1] [b0d4e649-cb5d-410a-a5e2-eeee584e83f0] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 39ms userId=1 planId=1
2026-11-25T12:49:49.309-03:00  INFO 3727047 --- [pool-3-thread-2] [2289d095-34c6-45b0-92f0-97bec1e5c928] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 58ms userId=1 planId=1
2026-11-25T12:49:49.356-03:00  INFO 3727047 --- [pool-3-thread-2] [1777fba0-68e3-4d53-a59c-de2025b0d9db] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 32ms userId=1 planId=1
2026-11-25T12:49:49.370-03:00  INFO 3727047 --- [pool-3-thread-1] [83180141-8bfe-4ae2-b387-d00ad3dd3d79] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 47ms userId=1 planId=1
2026-11-25T12:49:49.412-03:00  INFO 3727047 --- [pool-3-thread-2] [ef04f58d-a72b-479c-b0fe-dd4691b8a1ae] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 30ms userId=1 planId=1
2026-11-25T12:49:49.428-03:00  INFO 3727047 --- [pool-3-thread-1] [9a176c6c-eeb4-4c9a-b89a-9225efa5b497] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 47ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='RepaymentsIT#editReplacesAndTr` - exit 0

```
2026-11-25T12:50:12.105-03:00  INFO 3727504 --- [           main] [fb4ec688-79b8-4f1f-9ffd-8e52ade4f059] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts/{id}/statement 200 42ms userId=1 planId=1
2026-11-25T12:50:12.127-03:00  INFO 3727504 --- [           main] [bf8ab883-1238-4b19-a44c-b02b78af5992] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 20ms userId=1 planId=1
2026-11-25T12:50:12.158-03:00  INFO 3727504 --- [           main] [e16b9733-df40-4251-8759-ecc904bc1364] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/{id} 200 25ms userId=1 planId=1
2026-11-25T12:50:12.183-03:00  INFO 3727504 --- [           main] [46455334-00d8-4229-af17-896eafb196a0] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts/{id}/statement 200 23ms userId=1 planId=1
2026-11-25T12:50:12.215-03:00  INFO 3727504 --- [           main] [94a8a414-72bd-469e-a880-01adfe3d3378] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts/{id}/statement 200 30ms userId=1 planId=1
2026-11-25T12:50:12.231-03:00  INFO 3727504 --- [           main] [a88b3dcf-c381-4967-8365-49f8172583fc] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 13ms userId=1 planId=1
2026-11-25T12:50:12.288-03:00  INFO 3727504 --- [           main] [93723666-ef0f-41ad-bd5a-65aff17ca3c8] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 200 54ms userId=1 planId=1
2026-11-25T12:50:12.307-03:00  INFO 3727504 --- [           main] [b485e033-a110-495f-818a-5c23acce1459] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts/{id}/statement 200 18ms userId=1 planId=1
2026-11-25T12:50:12.323-03:00  INFO 3727504 --- [           main] [481e297d-f93d-4581-9c9e-8346cf1923bb] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 13ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='RepaymentsIT#reducingAShareCut` - exit 0

```
2026-11-25T12:50:34.858-03:00  INFO 3727945 --- [           main] [a6117526-9253-42c0-a90a-cdc786aca7ad] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/{id} 200 36ms userId=1 planId=1
2026-11-25T12:50:34.874-03:00  INFO 3727945 --- [           main] [ffd53011-c357-47c1-88c7-679f217dbf89] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 12ms userId=1 planId=1
2026-11-25T12:50:34.922-03:00  INFO 3727945 --- [           main] [5487f0b7-1d04-4ce1-9d5b-c8627077117e] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 40ms userId=1 planId=1
2026-11-25T12:50:34.940-03:00  INFO 3727945 --- [           main] [a4589c77-598a-426f-be43-2e41df4669f5] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/{id} 200 16ms userId=1 planId=1
2026-11-25T12:50:34.974-03:00  INFO 3727945 --- [           main] [8c80f269-1948-4c89-b15e-6f7793e06c2b] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts/{id}/statement 200 31ms userId=1 planId=1
2026-11-25T12:50:34.991-03:00  INFO 3727945 --- [           main] [f5b06eab-3c85-4703-9b0a-1b7113dc3716] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 13ms userId=1 planId=1
2026-11-25T12:50:35.040-03:00  INFO 3727945 --- [           main] [6b3a1e35-5822-4743-9321-f2bfe6e99d30] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 200 47ms userId=1 planId=1
2026-11-25T12:50:35.061-03:00  INFO 3727945 --- [           main] [79202021-02f3-413e-8747-970f7835ed71] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts/{id}/statement 200 19ms userId=1 planId=1
2026-11-25T12:50:35.074-03:00  INFO 3727945 --- [           main] [d139473c-71c3-4d9d-839e-425595d72561] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 11ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactStatementIT#groupsByMon` - exit 0

```
2026-11-25T12:50:57.109-03:00  WARN 3728391 --- [           main] [7f3f18db-c97a-4f95-8aa1-549a33203a3f] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-25T12:50:57.109-03:00  WARN 3728391 --- [           main] [7f3f18db-c97a-4f95-8aa1-549a33203a3f] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#allocations()
2026-11-25T12:50:57.109-03:00  WARN 3728391 --- [           main] [7f3f18db-c97a-4f95-8aa1-549a33203a3f] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List)
2026-11-25T12:50:57.109-03:00  WARN 3728391 --- [           main] [7f3f18db-c97a-4f95-8aa1-549a33203a3f] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List)
2026-11-25T12:50:57.109-03:00  WARN 3728391 --- [           main] [7f3f18db-c97a-4f95-8aa1-549a33203a3f] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List)
2026-11-25T12:50:57.109-03:00  WARN 3728391 --- [           main] [7f3f18db-c97a-4f95-8aa1-549a33203a3f] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-25T12:50:57.298-03:00  INFO 3728391 --- [           main] [7f3f18db-c97a-4f95-8aa1-549a33203a3f] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 308ms userId=1 planId=1
2026-11-25T12:50:57.344-03:00  INFO 3728391 --- [           main] [f2ebbb76-5b2b-45b7-9811-a7428e9c3757] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 40ms userId=1 planId=1
2026-11-25T12:50:57.398-03:00  INFO 3728391 --- [           main] [acd58de6-179f-44f4-a4bc-9aa7e936fb99] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts/{id}/statement 200 46ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactStatementIT#balanceLeav` - exit 0

```
2026-11-25T12:51:19.956-03:00  WARN 3728834 --- [           main] [87dcc13a-8c57-46bb-96ee-9cf859e4b956] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List)
2026-11-25T12:51:19.957-03:00  WARN 3728834 --- [           main] [87dcc13a-8c57-46bb-96ee-9cf859e4b956] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: allocations
2026-11-25T12:51:19.957-03:00  WARN 3728834 --- [           main] [87dcc13a-8c57-46bb-96ee-9cf859e4b956] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-25T12:51:19.957-03:00  WARN 3728834 --- [           main] [87dcc13a-8c57-46bb-96ee-9cf859e4b956] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#allocations()
2026-11-25T12:51:20.114-03:00  INFO 3728834 --- [           main] [87dcc13a-8c57-46bb-96ee-9cf859e4b956] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 278ms userId=1 planId=1
2026-11-25T12:51:20.160-03:00  INFO 3728834 --- [           main] [61546544-1d87-4e0c-bcc3-60b0d6d9a298] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts/{id}/statement 200 38ms userId=1 planId=1
2026-11-25T12:51:20.237-03:00  INFO 3728834 --- [           main] [be0d666e-eac6-407c-8ef1-80866e64a9a6] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 31ms userId=1 planId=1
2026-11-25T12:51:20.255-03:00  INFO 3728834 --- [           main] [eb54fe0b-a178-452e-91ab-80826f81cab8] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts/{id}/statement 200 16ms userId=1 planId=1
2026-11-25T12:51:20.274-03:00  INFO 3728834 --- [           main] [8cd67cf4-fcea-4009-8534-5de02f4385a1] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 17ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactStatementIT#trashedRows` - exit 0

```
2026-11-25T12:51:42.915-03:00  INFO 3729319 --- [           main] [b5499143-0508-41f5-b9e0-98846ca66358] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 275ms userId=1 planId=1
2026-11-25T12:51:42.952-03:00  INFO 3729319 --- [           main] [1484bf6f-28bf-45d6-9e4c-2f9f7dbf577a] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/{id} 200 24ms userId=1 planId=1
2026-11-25T12:51:42.997-03:00  INFO 3729319 --- [           main] [bc0304d9-699b-4652-9973-4219fec0a5fa] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts/{id}/statement 200 43ms userId=1 planId=1
2026-11-25T12:51:43.132-03:00  INFO 3729319 --- [           main] [9e6315ea-6869-45d2-b3da-34f3ef23cf54] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 200 72ms userId=1 planId=1
2026-11-25T12:51:43.152-03:00  INFO 3729319 --- [           main] [8dbd4434-e980-4069-ab2e-5e49975a812a] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts/{id}/statement 200 18ms userId=1 planId=1
2026-11-25T12:51:43.166-03:00  INFO 3729319 --- [           main] [c6183618-bc51-4a45-8fe9-1da4b0788efe] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/{id} 200 12ms userId=1 planId=1
2026-11-25T12:51:43.186-03:00  INFO 3729319 --- [           main] [a456048c-27e6-4ab1-bb22-4284d6bf0865] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts/{id}/statement 200 18ms userId=1 planId=1
2026-11-25T12:51:43.222-03:00  INFO 3729319 --- [           main] [7d124d9a-bd96-4857-8166-6774f077f617] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 200 31ms userId=1 planId=1
2026-11-25T12:51:43.242-03:00  INFO 3729319 --- [           main] [0d078edd-a2ab-450d-ac48-e6b02fe717ff] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts/{id}/statement 200 18ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpContactsIT#attributedToReso` - exit 0

```
2026-11-25T12:52:07.096-03:00  INFO 3729773 --- [           main] [31a808aa-646b-4cbd-a1e8-825c4a8de836] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 240ms userId=- planId=-
2026-11-25T12:52:07.146-03:00  INFO 3729773 --- [           main] [cfc2b3e4-b0f6-4bbf-8746-c2a5618d1c1c] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=create_transaction user=1 plan=1 outcome=ok durationMs=44
2026-11-25T12:52:07.146-03:00  INFO 3729773 --- [           main] [cfc2b3e4-b0f6-4bbf-8746-c2a5618d1c1c] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 48ms userId=- planId=-
2026-11-25T12:52:07.222-03:00  INFO 3729773 --- [           main] [8c9f834c-a79f-4e97-a599-a689df3504a3] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=create_transaction user=1 plan=1 outcome=error durationMs=19
2026-11-25T12:52:07.222-03:00  INFO 3729773 --- [           main] [8c9f834c-a79f-4e97-a599-a689df3504a3] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 23ms userId=- planId=-
2026-11-25T12:52:07.254-03:00  INFO 3729773 --- [           main] [e4da33d0-a612-4695-a566-881560d657aa] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=create_transaction user=1 plan=1 outcome=error durationMs=15
2026-11-25T12:52:07.254-03:00  INFO 3729773 --- [           main] [e4da33d0-a612-4695-a566-881560d657aa] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 18ms userId=- planId=-
2026-11-25T12:52:07.274-03:00  INFO 3729773 --- [           main] [9709f560-da64-4570-b630-69db83de1e9c] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=create_transaction user=1 plan=1 outcome=error durationMs=16
2026-11-25T12:52:07.275-03:00  INFO 3729773 --- [           main] [9709f560-da64-4570-b630-69db83de1e9c] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 19ms userId=- planId=-
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpContactsIT#repaymentApplies` - exit 0

```
2026-11-25T12:52:29.836-03:00  WARN 3730266 --- [           main] [aed69436-35d7-470d-bd43-33fd07fecdb6] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List)
2026-11-25T12:52:29.836-03:00  WARN 3730266 --- [           main] [aed69436-35d7-470d-bd43-33fd07fecdb6] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-25T12:52:29.836-03:00  WARN 3730266 --- [           main] [aed69436-35d7-470d-bd43-33fd07fecdb6] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#items()
2026-11-25T12:52:29.836-03:00  WARN 3730266 --- [           main] [aed69436-35d7-470d-bd43-33fd07fecdb6] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-25T12:52:29.836-03:00  WARN 3730266 --- [           main] [aed69436-35d7-470d-bd43-33fd07fecdb6] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: allocations
2026-11-25T12:52:29.922-03:00  INFO 3730266 --- [           main] [aed69436-35d7-470d-bd43-33fd07fecdb6] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=create_transaction user=1 plan=1 outcome=ok durationMs=253
2026-11-25T12:52:29.936-03:00  INFO 3730266 --- [           main] [aed69436-35d7-470d-bd43-33fd07fecdb6] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 291ms userId=- planId=-
2026-11-25T12:52:30.041-03:00  INFO 3730266 --- [           main] [a3d1cae5-db4f-486b-bdfe-830d88d37e2c] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=create_transaction user=1 plan=1 outcome=ok durationMs=52
2026-11-25T12:52:30.042-03:00  INFO 3730266 --- [           main] [a3d1cae5-db4f-486b-bdfe-830d88d37e2c] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 56ms userId=- planId=-
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpContactsIT#listsContactsAnd` - exit 0

```
2026-11-25T12:52:53.284-03:00  WARN 3730728 --- [           main] [6c3233dc-e94d-458b-bc9e-58c95011f1d5] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List)
2026-11-25T12:52:53.284-03:00  WARN 3730728 --- [           main] [6c3233dc-e94d-458b-bc9e-58c95011f1d5] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List)
2026-11-25T12:52:53.284-03:00  WARN 3730728 --- [           main] [6c3233dc-e94d-458b-bc9e-58c95011f1d5] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List)
2026-11-25T12:52:53.360-03:00  INFO 3730728 --- [           main] [6c3233dc-e94d-458b-bc9e-58c95011f1d5] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=create_transaction user=1 plan=1 outcome=ok durationMs=249
2026-11-25T12:52:53.374-03:00  INFO 3730728 --- [           main] [6c3233dc-e94d-458b-bc9e-58c95011f1d5] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 286ms userId=- planId=-
2026-11-25T12:52:53.395-03:00  INFO 3730728 --- [           main] [1fe22322-86e5-4e21-afaf-aece5ebd6778] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=list_contacts user=1 plan=1 outcome=ok durationMs=16
2026-11-25T12:52:53.396-03:00  INFO 3730728 --- [           main] [1fe22322-86e5-4e21-afaf-aece5ebd6778] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 19ms userId=- planId=-
2026-11-25T12:52:53.515-03:00  INFO 3730728 --- [           main] [3016f29c-fb50-4ae9-9677-ab2d9a3be6b2] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=list_transactions user=1 plan=1 outcome=ok durationMs=66
2026-11-25T12:52:53.516-03:00  INFO 3730728 --- [           main] [3016f29c-fb50-4ae9-9677-ab2d9a3be6b2] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 71ms userId=- planId=-
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='OpenApiSnapshotIT' -Dsurefire.` - exit 0

```
2026-11-25T12:53:15.427-03:00  INFO 3731180 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable resources templates capabilities, notification: true
2026-11-25T12:53:15.427-03:00  INFO 3731180 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable prompts capabilities, notification: true
2026-11-25T12:53:15.429-03:00  INFO 3731180 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable completions capabilities
2026-11-25T12:53:15.566-03:00  INFO 3731180 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-25T12:53:15.566-03:00  INFO 3731180 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-25T12:53:15.567-03:00  INFO 3731180 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-25T12:53:15.625-03:00  INFO 3731180 --- [           main] [] c.lcs.findraco.shared.OpenApiSnapshotIT  : Started OpenApiSnapshotIT in 9.202 seconds (process running for 10.512)
2026-11-25T12:53:16.576-03:00  INFO 3731180 --- [           main] [f320a5cb-ffb0-4258-bd5c-34b040aae41a] o.springdoc.api.AbstractOpenApiResource  : Init duration for springdoc-openapi is: 598 ms
2026-11-25T12:53:16.609-03:00  INFO 3731180 --- [           main] [f320a5cb-ffb0-4258-bd5c-34b040aae41a] c.l.f.shared.web.RequestLogFilter        : GET /v3/api-docs 200 660ms userId=- planId=-
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='RepaymentsIT#aSettledPurchaseM` - exit 0

```
2026-11-25T12:53:39.481-03:00  WARN 3731670 --- [           main] [72167f8e-0c35-40ab-86f7-527a0290ddd5] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#com.lcs.findraco.transaction.request.UpdateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List, Long)
2026-11-25T12:53:39.482-03:00  WARN 3731670 --- [           main] [72167f8e-0c35-40ab-86f7-527a0290ddd5] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#com.lcs.findraco.transaction.request.UpdateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List, Long)
2026-11-25T12:53:39.482-03:00  WARN 3731670 --- [           main] [72167f8e-0c35-40ab-86f7-527a0290ddd5] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-25T12:53:39.482-03:00  WARN 3731670 --- [           main] [72167f8e-0c35-40ab-86f7-527a0290ddd5] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#items()
2026-11-25T12:53:39.482-03:00  WARN 3731670 --- [           main] [72167f8e-0c35-40ab-86f7-527a0290ddd5] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: allocations
2026-11-25T12:53:39.482-03:00  WARN 3731670 --- [           main] [72167f8e-0c35-40ab-86f7-527a0290ddd5] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#participants()
2026-11-25T12:53:39.541-03:00  INFO 3731670 --- [           main] [72167f8e-0c35-40ab-86f7-527a0290ddd5] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/{id} 200 71ms userId=1 planId=1
2026-11-25T12:53:39.611-03:00  INFO 3731670 --- [           main] [5551ed5d-3d5a-4bd7-be2d-3cb465e2449a] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts/{id}/statement 200 43ms userId=1 planId=1
2026-11-25T12:53:39.638-03:00  INFO 3731670 --- [           main] [67a5860b-dcac-4bfc-8b8c-fd9d5c8f30a2] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 21ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='RepaymentsIT#editingAPaymentWh` - exit 0

```
2026-11-25T12:54:02.436-03:00  INFO 3732143 --- [           main] [c395d2da-5932-4240-89e5-af4a8ad71274] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/{id} 200 49ms userId=1 planId=1
2026-11-25T12:54:02.537-03:00  INFO 3732143 --- [           main] [3dc525c9-0c1b-41f6-9213-12d08ed0556b] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 200 54ms userId=1 planId=1
2026-11-25T12:54:02.575-03:00  INFO 3732143 --- [           main] [11972dfa-8ae2-4d27-82f0-a02f00a8ab51] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts/{id}/statement 200 36ms userId=1 planId=1
2026-11-25T12:54:02.597-03:00  INFO 3732143 --- [           main] [1387b3ea-56d2-4ceb-a941-eb266046d4e3] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 18ms userId=1 planId=1
2026-11-25T12:54:02.640-03:00  INFO 3732143 --- [           main] [fa8b4f38-968e-4a84-b6f6-f4d27c02f84d] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 33ms userId=1 planId=1
2026-11-25T12:54:02.652-03:00  INFO 3732143 --- [           main] [e9bda1b1-16d2-400f-be3e-c7c39a04dc42] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/{id} 200 10ms userId=1 planId=1
2026-11-25T12:54:02.682-03:00  INFO 3732143 --- [           main] [3c2c1f1e-07e4-4997-8e88-84f4d604370f] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/{id} 200 29ms userId=1 planId=1
2026-11-25T12:54:02.708-03:00  INFO 3732143 --- [           main] [986ce4b5-d13c-44a6-833b-5e559c50085b] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 200 24ms userId=1 planId=1
2026-11-25T12:54:02.728-03:00  INFO 3732143 --- [           main] [b0dd2a80-ffe5-45b9-975c-8d4ae26db043] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts/{id}/statement 200 17ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactSharesIT#markingAContac` - exit 0

```
2026-11-25T12:54:26.320-03:00  WARN 3732605 --- [           main] [3b6890b4-f4e8-48b0-845b-9f8cb5cc111c] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-25T12:54:26.321-03:00  WARN 3732605 --- [           main] [3b6890b4-f4e8-48b0-845b-9f8cb5cc111c] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#allocations()
2026-11-25T12:54:26.321-03:00  WARN 3732605 --- [           main] [3b6890b4-f4e8-48b0-845b-9f8cb5cc111c] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-25T12:54:26.476-03:00  INFO 3732605 --- [           main] [3b6890b4-f4e8-48b0-845b-9f8cb5cc111c] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 275ms userId=1 planId=1
2026-11-25T12:54:26.524-03:00  INFO 3732605 --- [           main] [ded7d7fc-750c-47fc-b911-bf1664586e6b] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/{id}/kind 422 36ms userId=1 planId=1
2026-11-25T12:54:26.562-03:00  INFO 3732605 --- [           main] [ee3f30ee-6729-4861-a45a-f2f3a0baaf55] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/{id}/kind 422 14ms userId=1 planId=1
2026-11-25T12:54:26.573-03:00  INFO 3732605 --- [           main] [66cf5ebd-2de7-45c2-9d3a-d405bd66bba3] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/{id}/kind 422 10ms userId=1 planId=1
2026-11-25T12:54:26.585-03:00  INFO 3732605 --- [           main] [70d69848-b442-40a6-8d65-5c0475137ec8] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/{id}/kind 422 10ms userId=1 planId=1
2026-11-25T12:54:26.598-03:00  INFO 3732605 --- [           main] [40239ca2-f765-4f2c-839d-f6301fc8abfa] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/{id} 200 12ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactsIT#refusesArchiveWithP` - exit 0

```
2026-11-25T12:54:51.295-03:00  INFO 3733071 --- [           main] [be5b11e6-0630-4fd7-a1f0-cf29f5582d02] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts/{id}/archive 409 33ms userId=1 planId=1
2026-11-25T12:54:51.345-03:00  INFO 3733071 --- [           main] [d2c8d5a8-d754-45d2-b588-70388474c94d] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts/{id}/archive 409 21ms userId=1 planId=1
2026-11-25T12:54:51.360-03:00  INFO 3733071 --- [           main] [75c891af-1c83-4a53-8189-db4a3fa9a240] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 13ms userId=1 planId=1
2026-11-25T12:54:51.434-03:00  INFO 3733071 --- [           main] [1c967c36-bd9a-4a65-ae90-3aea6ede9994] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts/{id}/archive 200 25ms userId=1 planId=1
2026-11-25T12:54:51.490-03:00  INFO 3733071 --- [           main] [8e0e7382-9645-4239-a965-6af336b67b31] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 54ms userId=1 planId=1
2026-11-25T12:54:51.508-03:00  INFO 3733071 --- [           main] [dc3a72f2-b5b8-47df-b4e6-5e5c2ac05b0b] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts/{id}/archive 200 15ms userId=1 planId=1
2026-11-25T12:54:51.520-03:00  INFO 3733071 --- [           main] [a414523b-3430-4b74-87cb-e756afe68fd2] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/{id} 200 11ms userId=1 planId=1
2026-11-25T12:54:51.535-03:00  INFO 3733071 --- [           main] [29eb4e0a-c87e-43ab-aa2b-d13d860f8ed4] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts/{id}/archive 200 13ms userId=1 planId=1
2026-11-25T12:54:51.548-03:00  INFO 3733071 --- [           main] [bd33a973-81f3-4e10-945e-56379f119edb] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 11ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='RepaymentsIT#aPurchaseRestoreW` - exit 0

```
2026-11-25T12:55:15.657-03:00  WARN 3733549 --- [           main] [ac2b6229-6338-4acc-a1ff-fe1dc204089e] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List)
2026-11-25T12:55:15.657-03:00  WARN 3733549 --- [           main] [ac2b6229-6338-4acc-a1ff-fe1dc204089e] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List)
2026-11-25T12:55:15.657-03:00  WARN 3733549 --- [           main] [ac2b6229-6338-4acc-a1ff-fe1dc204089e] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List)
2026-11-25T12:55:15.657-03:00  WARN 3733549 --- [           main] [ac2b6229-6338-4acc-a1ff-fe1dc204089e] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: allocations
2026-11-25T12:55:15.658-03:00  WARN 3733549 --- [           main] [ac2b6229-6338-4acc-a1ff-fe1dc204089e] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-25T12:55:15.841-03:00  INFO 3733549 --- [           main] [ac2b6229-6338-4acc-a1ff-fe1dc204089e] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 302ms userId=1 planId=1
2026-11-25T12:55:15.883-03:00  INFO 3733549 --- [           main] [428fc293-a56d-4984-8124-f843a3e24841] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/{id} 200 29ms userId=1 planId=1
2026-11-25T12:55:17.479-03:00  INFO 3733549 --- [pool-3-thread-1] [56b3dc01-6117-45b2-b13e-a3a77a100d3f] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 200 1591ms userId=1 planId=1
2026-11-25T12:55:17.525-03:00  INFO 3733549 --- [           main] [70b8b610-dcd8-439f-a09f-717790a9c975] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts/{id}/statement 200 44ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```
