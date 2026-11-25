# contacts proofs

**HEAD**: 8e7e3551
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
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer contacts > offers a plan of one member the split when it has a contact 61ms
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer contacts > offers no contact to a contributor 39ms
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer repayment > turns an income into a contact payment 472ms
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer repayment > gives the payment one receiving member whatever split came before, and lets the user choose who 519ms
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer repayment > shows the excess as credit 387ms
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer repayment > keeps what the user ticked when the amount changes afterwards 405ms
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer repayment > loads the allocations of the payment being edited 73ms
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer repayment > offers no contact payment to a contributor 118ms

 Test Files  3 passed (3)
      Tests  70 passed (70)
   Start at  08:12:52
   Duration  13.89s (transform 577ms, setup 435ms, collect 7.24s, tests 11.82s, environment 1.54s, prepare 144ms)

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
   Start at  08:13:08
   Duration  2.50s (transform 118ms, setup 219ms, collect 1.81s, tests 23ms, environment 874ms, prepare 82ms)

No story files found for the specified pattern: src/**/*.mdx
```

`Run table` - exit 0

```
Creating Table Instance...

 ✓ |unit| src/features/transactions/TransactionsPage.test.tsx > TransactionsPage period navigator (PNAV-01, PNAV-02) > replaces a custom range with the This month preset (PNAV-03 AC 1) 238ms
stdout | src/features/transactions/TransactionsPage.test.tsx > TransactionsPage period navigator (PNAV-01, PNAV-02) > ignores the pre-feature from and to params and opens on the current month (PNAV-05)
Creating Table Instance...

 ✓ |unit| src/features/transactions/TransactionsPage.test.tsx > TransactionsPage period navigator (PNAV-01, PNAV-02) > keeps the period when all filters are cleared (PNAV-02 AC 4) 114ms
 ✓ |unit| src/features/transactions/TransactionsPage.test.tsx > TransactionsPage period navigator (PNAV-01, PNAV-02) > ignores the pre-feature from and to params and opens on the current month (PNAV-05) 27ms

 Test Files  2 passed (2)
      Tests  53 passed (53)
   Start at  08:13:12
   Duration  13.09s (transform 636ms, setup 218ms, collect 3.09s, tests 9.39s, environment 692ms, prepare 85ms)

No story files found for the specified pattern: src/**/*.mdx
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactsIT#createsTrimsAndBoun` - exit 0

```
2026-11-25T08:13:45.339-03:00  INFO 3622204 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-25T08:13:45.401-03:00  INFO 3622204 --- [           main] [] com.lcs.findraco.plan.ContactsIT         : Started ContactsIT in 9.556 seconds (process running for 10.713)
2026-11-25T08:13:46.068-03:00  INFO 3622204 --- [           main] [311d8029-4bc4-45af-bfc0-7cdd200abbf7] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts 201 215ms userId=1 planId=1
2026-11-25T08:13:46.149-03:00  INFO 3622204 --- [           main] [63702a5a-73fc-4f38-a62b-9cf0e6eae1b3] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts 201 22ms userId=1 planId=1
2026-11-25T08:13:46.170-03:00  INFO 3622204 --- [           main] [ad9a51dc-6ad0-4fe4-b67b-a90f92b0a97f] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts 422 18ms userId=1 planId=1
2026-11-25T08:13:46.209-03:00  INFO 3622204 --- [           main] [d31f857b-0531-4df0-b745-e030c006b243] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts 422 7ms userId=1 planId=1
2026-11-25T08:13:46.217-03:00  INFO 3622204 --- [           main] [8d4a123b-ac7e-4810-a850-4bc783fae587] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts 422 6ms userId=1 planId=1
2026-11-25T08:13:46.239-03:00  INFO 3622204 --- [           main] [51c483e4-37af-4e46-8b6b-8217a75cdbe7] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts 201 20ms userId=1 planId=1
2026-11-25T08:13:46.267-03:00  INFO 3622204 --- [           main] [9cffadac-f173-402a-b555-197e88a11433] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 26ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactsIT#rejectsADuplicateAc` - exit 0

```
2026-11-25T08:14:08.209-03:00  INFO 3622704 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-25T08:14:08.209-03:00  INFO 3622704 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-25T08:14:08.211-03:00  INFO 3622704 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-25T08:14:08.268-03:00  INFO 3622704 --- [           main] [] com.lcs.findraco.plan.ContactsIT         : Started ContactsIT in 9.89 seconds (process running for 11.056)
2026-11-25T08:14:08.933-03:00  INFO 3622704 --- [           main] [75287d72-35a9-4ebd-a52b-cdf6edbd6f99] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts 422 199ms userId=1 planId=1
2026-11-25T08:14:09.057-03:00  INFO 3622704 --- [           main] [905cac9c-1244-4e6d-9e7b-1c9957061072] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts 201 40ms userId=1 planId=2
2026-11-25T08:14:09.102-03:00  INFO 3622704 --- [           main] [451c9d5b-0385-4e05-9ec3-b012b4c46b58] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts 201 16ms userId=1 planId=1
2026-11-25T08:14:09.141-03:00  INFO 3622704 --- [           main] [3c143b01-f822-45d4-acb5-3b68bb7f5adf] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts/{id}/archive 200 37ms userId=1 planId=1
2026-11-25T08:14:09.160-03:00  INFO 3622704 --- [           main] [8cf7058f-8dd7-4de5-9762-c505364a2120] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts 201 16ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactsIT#renameReachesTheSha` - exit 0

```
2026-11-25T08:14:30.354-03:00  INFO 3623150 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-25T08:14:30.354-03:00  INFO 3623150 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-25T08:14:30.355-03:00  INFO 3623150 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-25T08:14:30.411-03:00  INFO 3623150 --- [           main] [] com.lcs.findraco.plan.ContactsIT         : Started ContactsIT in 9.614 seconds (process running for 10.807)
2026-11-25T08:14:31.169-03:00  INFO 3623150 --- [           main] [037cf3dd-f6ea-4b6b-8449-e8b64b9a0ec0] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/contacts/{id} 200 235ms userId=1 planId=1
2026-11-25T08:14:31.260-03:00  INFO 3623150 --- [           main] [bee34d7c-1348-4231-9c07-7f4853f41671] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/{id} 200 38ms userId=1 planId=1
2026-11-25T08:14:31.280-03:00  INFO 3623150 --- [           main] [af4f499e-0d16-4590-bb61-94ae07129b31] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/contacts/{id} 409 18ms userId=1 planId=1
2026-11-25T08:14:31.326-03:00  INFO 3623150 --- [           main] [8c9eb4cf-2e12-4bbf-a553-945dd4f75add] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 19ms userId=1 planId=1
2026-11-25T08:14:31.345-03:00  INFO 3623150 --- [           main] [48f97a31-e105-4448-a857-cfd0ceaa3a49] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/contacts/{id} 422 10ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactsIT#listsActiveContacts` - exit 0

```
2026-11-25T08:14:54.448-03:00  INFO 3623608 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable prompts capabilities, notification: true
2026-11-25T08:14:54.449-03:00  INFO 3623608 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable completions capabilities
2026-11-25T08:14:54.598-03:00  INFO 3623608 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-25T08:14:54.598-03:00  INFO 3623608 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-25T08:14:54.599-03:00  INFO 3623608 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-25T08:14:54.661-03:00  INFO 3623608 --- [           main] [] com.lcs.findraco.plan.ContactsIT         : Started ContactsIT in 10.908 seconds (process running for 12.155)
2026-11-25T08:14:55.428-03:00  INFO 3623608 --- [           main] [4cf9f8f5-cfba-416c-a8fe-2e59fdb699f6] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts/{id}/archive 200 243ms userId=1 planId=1
2026-11-25T08:14:55.458-03:00  INFO 3623608 --- [           main] [75de402e-a041-475d-96fb-242aff815c8c] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 24ms userId=1 planId=1
2026-11-25T08:14:55.537-03:00  INFO 3623608 --- [           main] [129659ec-3a9f-4771-ad32-69904dc90980] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 18ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactsIT#archivesOnlyAtZeroB` - exit 0

```
2026-11-25T08:15:19.036-03:00  WARN 3624065 --- [           main] [bed19b71-0de9-45da-81a7-f877e3412c96] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: allocations
2026-11-25T08:15:19.036-03:00  WARN 3624065 --- [           main] [bed19b71-0de9-45da-81a7-f877e3412c96] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#allocations()
2026-11-25T08:15:19.036-03:00  WARN 3624065 --- [           main] [bed19b71-0de9-45da-81a7-f877e3412c96] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List)
2026-11-25T08:15:19.036-03:00  WARN 3624065 --- [           main] [bed19b71-0de9-45da-81a7-f877e3412c96] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List)
2026-11-25T08:15:19.036-03:00  WARN 3624065 --- [           main] [bed19b71-0de9-45da-81a7-f877e3412c96] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List)
2026-11-25T08:15:19.036-03:00  WARN 3624065 --- [           main] [bed19b71-0de9-45da-81a7-f877e3412c96] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#participants()
2026-11-25T08:15:19.037-03:00  WARN 3624065 --- [           main] [bed19b71-0de9-45da-81a7-f877e3412c96] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-25T08:15:19.037-03:00  WARN 3624065 --- [           main] [bed19b71-0de9-45da-81a7-f877e3412c96] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-25T08:15:19.059-03:00  INFO 3624065 --- [           main] [bed19b71-0de9-45da-81a7-f877e3412c96] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 48ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactsIT#unarchiveRestoresUn` - exit 0

```
2026-11-25T08:15:40.459-03:00  INFO 3624536 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-25T08:15:40.515-03:00  INFO 3624536 --- [           main] [] com.lcs.findraco.plan.ContactsIT         : Started ContactsIT in 9.437 seconds (process running for 10.673)
2026-11-25T08:15:41.202-03:00  INFO 3624536 --- [           main] [8020765b-1171-454b-85ae-3f2000573716] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts/{id}/archive 200 230ms userId=1 planId=1
2026-11-25T08:15:41.232-03:00  INFO 3624536 --- [           main] [0d764cf2-3c6e-4b68-ab9c-a866955aedc6] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts/{id}/archive 200 24ms userId=1 planId=1
2026-11-25T08:15:41.265-03:00  INFO 3624536 --- [           main] [af4d5695-25a4-45bb-a4d7-58fb37f8b102] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts 201 30ms userId=1 planId=1
2026-11-25T08:15:41.294-03:00  INFO 3624536 --- [           main] [450f679f-c2e3-469b-9399-81e95922c1e1] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts/{id}/unarchive 422 28ms userId=1 planId=1
2026-11-25T08:15:41.356-03:00  INFO 3624536 --- [           main] [7cb426c3-d96f-478f-b06b-c9070fe61cee] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 25ms userId=1 planId=1
2026-11-25T08:15:41.437-03:00  INFO 3624536 --- [           main] [10c68315-d17e-455b-9b45-db51c04b737e] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts/{id}/unarchive 200 18ms userId=1 planId=1
2026-11-25T08:15:41.452-03:00  INFO 3624536 --- [           main] [e39811f5-8c4f-449d-aacd-4174507252ab] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 13ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactsIT#deletesOnlyAnUnused` - exit 0

```
2026-11-25T08:16:03.658-03:00  INFO 3625031 --- [           main] [3296b0c0-3c24-4ac3-99c1-b082ee550eb7] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 314ms userId=1 planId=1
2026-11-25T08:16:03.694-03:00  INFO 3625031 --- [           main] [4bcb7935-0249-49d9-8577-1c021a8822ef] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/{id} 200 30ms userId=1 planId=1
2026-11-25T08:16:03.720-03:00  INFO 3625031 --- [           main] [523dcc28-1e2d-440f-b30c-706aef359a5a] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/contacts/{id} 409 25ms userId=1 planId=1
2026-11-25T08:16:03.758-03:00  INFO 3625031 --- [           main] [951b6f17-7aec-4745-81ea-f50df2cd64b3] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/contacts/{id} 409 13ms userId=1 planId=1
2026-11-25T08:16:03.777-03:00  INFO 3625031 --- [           main] [1e5e535f-8df5-4096-a06c-6ecdc1c70e70] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/contacts/{id} 409 17ms userId=1 planId=1
2026-11-25T08:16:03.787-03:00  INFO 3625031 --- [           main] [63729993-c38b-4559-9a61-8401f38e76d1] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/contacts/{id} 409 9ms userId=1 planId=1
2026-11-25T08:16:03.820-03:00  INFO 3625031 --- [           main] [3e63e857-c85f-4dd0-8a51-f9e593cd3b4a] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 31ms userId=1 planId=1
2026-11-25T08:16:03.898-03:00  INFO 3625031 --- [           main] [ae3d5d45-4993-4b55-891b-e6898a27b8b0] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/contacts/{id} 204 26ms userId=1 planId=1
2026-11-25T08:16:03.915-03:00  INFO 3625031 --- [           main] [03af0ad3-d440-414f-bf75-563657a6fab2] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 15ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactRoleMatrixIT' -Dsurefir` - exit 0

```
2026-11-25T08:16:28.338-03:00  INFO 3625492 --- [           main] [ea0c45b3-db2e-41a1-aec7-c4b203b801fd] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts/{id}/unarchive 200 16ms userId=2 planId=1
2026-11-25T08:16:28.399-03:00  INFO 3625492 --- [           main] [64b0cea2-0108-4268-9abf-52dc32d888f5] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts/{id}/unarchive 403 5ms userId=3 planId=1
2026-11-25T08:16:28.460-03:00  INFO 3625492 --- [           main] [0e758fe2-6634-4b65-a26f-97e0f750a4fc] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts/{id}/unarchive 403 7ms userId=4 planId=1
2026-11-25T08:16:28.523-03:00  INFO 3625492 --- [           main] [8d29f9c7-e13d-454b-bf38-c10623807a39] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts/{id}/unarchive 404 6ms userId=5 planId=1
2026-11-25T08:16:28.622-03:00  INFO 3625492 --- [           main] [3a2e1d02-5b6b-4802-912f-ed240765ce40] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/contacts/{id} 204 30ms userId=1 planId=1
2026-11-25T08:16:28.725-03:00  INFO 3625492 --- [           main] [a44bef77-dcea-46a2-9b41-b15d4bb050e6] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/contacts/{id} 204 13ms userId=2 planId=1
2026-11-25T08:16:28.787-03:00  INFO 3625492 --- [           main] [944440e0-1d9a-4055-a082-f89230a89429] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/contacts/{id} 403 5ms userId=3 planId=1
2026-11-25T08:16:28.844-03:00  INFO 3625492 --- [           main] [2c9bc1a6-56df-4273-8c98-6dd0e52357f2] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/contacts/{id} 403 6ms userId=4 planId=1
2026-11-25T08:16:28.905-03:00  INFO 3625492 --- [           main] [51dc6644-3879-4ca8-bf09-385ba6dad9b7] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/contacts/{id} 404 6ms userId=5 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactSchemaIT' -Dsurefire.sk` - exit 0

```
2026-11-25T08:16:50.048-03:00  INFO 3625953 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Registered tools: 11
2026-11-25T08:16:50.048-03:00  INFO 3625953 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable resources capabilities, notification: true
2026-11-25T08:16:50.049-03:00  INFO 3625953 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable resources templates capabilities, notification: true
2026-11-25T08:16:50.050-03:00  INFO 3625953 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable prompts capabilities, notification: true
2026-11-25T08:16:50.051-03:00  INFO 3625953 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable completions capabilities
2026-11-25T08:16:50.180-03:00  INFO 3625953 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-25T08:16:50.180-03:00  INFO 3625953 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-25T08:16:50.181-03:00  INFO 3625953 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-25T08:16:50.240-03:00  INFO 3625953 --- [           main] [] com.lcs.findraco.plan.ContactSchemaIT    : Started ContactSchemaIT in 9.278 seconds (process running for 10.575)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactSharesIT#splitsWithCont` - exit 0

```
2026-11-25T08:17:12.600-03:00  WARN 3626432 --- [           main] [13d031a0-68e3-41c9-8988-11066a53a57b] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List)
2026-11-25T08:17:12.601-03:00  WARN 3626432 --- [           main] [13d031a0-68e3-41c9-8988-11066a53a57b] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List)
2026-11-25T08:17:12.601-03:00  WARN 3626432 --- [           main] [13d031a0-68e3-41c9-8988-11066a53a57b] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List)
2026-11-25T08:17:12.601-03:00  WARN 3626432 --- [           main] [13d031a0-68e3-41c9-8988-11066a53a57b] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#participants()
2026-11-25T08:17:12.601-03:00  WARN 3626432 --- [           main] [13d031a0-68e3-41c9-8988-11066a53a57b] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-25T08:17:12.747-03:00  INFO 3626432 --- [           main] [13d031a0-68e3-41c9-8988-11066a53a57b] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 263ms userId=1 planId=1
2026-11-25T08:17:12.821-03:00  INFO 3626432 --- [           main] [2a2c945a-9426-44ca-9f0f-780aac9053c3] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 18ms userId=1 planId=1
2026-11-25T08:17:12.836-03:00  INFO 3626432 --- [           main] [5544c605-b14f-41eb-a059-88e0b9aed7db] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 13ms userId=1 planId=1
2026-11-25T08:17:12.860-03:00  INFO 3626432 --- [           main] [6320163c-dd4f-41aa-8292-0f7253fe474f] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 19ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactSharesIT#contactSharesL` - exit 0

```
2026-11-25T08:17:34.605-03:00  WARN 3626883 --- [           main] [36665fc4-4d97-4ad9-9926-4741ae6e0199] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#items()
2026-11-25T08:17:34.605-03:00  WARN 3626883 --- [           main] [36665fc4-4d97-4ad9-9926-4741ae6e0199] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#participants()
2026-11-25T08:17:34.605-03:00  WARN 3626883 --- [           main] [36665fc4-4d97-4ad9-9926-4741ae6e0199] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#allocations()
2026-11-25T08:17:34.606-03:00  WARN 3626883 --- [           main] [36665fc4-4d97-4ad9-9926-4741ae6e0199] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-25T08:17:34.606-03:00  WARN 3626883 --- [           main] [36665fc4-4d97-4ad9-9926-4741ae6e0199] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: allocations
2026-11-25T08:17:34.755-03:00  INFO 3626883 --- [           main] [36665fc4-4d97-4ad9-9926-4741ae6e0199] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 260ms userId=1 planId=1
2026-11-25T08:17:34.848-03:00  INFO 3626883 --- [           main] [89467fbc-9484-4686-9c8a-e2edeb921046] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/dashboard 200 82ms userId=1 planId=1
2026-11-25T08:17:34.913-03:00  INFO 3626883 --- [           main] [2b7900be-00ec-4d61-9b96-cea1c4e8559e] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/dashboard/trend 200 22ms userId=1 planId=1
2026-11-25T08:17:34.947-03:00  INFO 3626883 --- [           main] [3c45b86e-0b2f-43ba-9058-065938ffea6f] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/dashboard 200 26ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactSharesIT#contactSharesL` - exit 0

```
2026-11-25T08:17:57.322-03:00  WARN 3627339 --- [           main] [fb0cb111-519e-447f-81f6-23c95944d7ad] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#com.lcs.findraco.transaction.request.UpdateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List, Long)
2026-11-25T08:17:57.322-03:00  WARN 3627339 --- [           main] [fb0cb111-519e-447f-81f6-23c95944d7ad] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#com.lcs.findraco.transaction.request.UpdateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List, Long)
2026-11-25T08:17:57.322-03:00  WARN 3627339 --- [           main] [fb0cb111-519e-447f-81f6-23c95944d7ad] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: allocations
2026-11-25T08:17:57.323-03:00  WARN 3627339 --- [           main] [fb0cb111-519e-447f-81f6-23c95944d7ad] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#items()
2026-11-25T08:17:57.323-03:00  WARN 3627339 --- [           main] [fb0cb111-519e-447f-81f6-23c95944d7ad] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#allocations()
2026-11-25T08:17:57.323-03:00  WARN 3627339 --- [           main] [fb0cb111-519e-447f-81f6-23c95944d7ad] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-25T08:17:57.323-03:00  WARN 3627339 --- [           main] [fb0cb111-519e-447f-81f6-23c95944d7ad] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#participants()
2026-11-25T08:17:57.371-03:00  INFO 3627339 --- [           main] [fb0cb111-519e-447f-81f6-23c95944d7ad] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/{id} 200 61ms userId=1 planId=1
2026-11-25T08:17:57.398-03:00  INFO 3627339 --- [           main] [bbcd479d-3231-4bd0-8d2d-a66521b45ae3] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/category/spending 200 25ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactSharesIT#contactSharesO` - exit 0

```
2026-11-25T08:18:19.844-03:00  INFO 3627822 --- [           main] [0e4f65ea-46e0-499e-8511-731f56e0fb41] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/{id} 422 16ms userId=1 planId=1
2026-11-25T08:18:19.862-03:00  INFO 3627822 --- [           main] [b530f59a-2f0f-4fee-8522-ecf8122692eb] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 16ms userId=1 planId=1
2026-11-25T08:18:19.875-03:00  INFO 3627822 --- [           main] [ba77cbf7-0654-4d8b-81d9-d2b17faaf761] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/{id} 422 12ms userId=1 planId=1
2026-11-25T08:18:19.884-03:00  INFO 3627822 --- [           main] [44ac036f-0b3e-4d7e-9faf-ac80b34cc0a0] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 7ms userId=1 planId=1
2026-11-25T08:18:19.899-03:00  INFO 3627822 --- [           main] [8f1e0a0e-c816-41bc-a6ad-53ae15eaccde] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/{id} 422 14ms userId=1 planId=1
2026-11-25T08:18:19.959-03:00  WARN 3627822 --- [           main] [42bc5d3d-cd8a-47f0-a3d8-bfd7b57d0e48] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-25T08:18:19.959-03:00  WARN 3627822 --- [           main] [42bc5d3d-cd8a-47f0-a3d8-bfd7b57d0e48] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-25T08:18:19.959-03:00  WARN 3627822 --- [           main] [42bc5d3d-cd8a-47f0-a3d8-bfd7b57d0e48] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-25T08:18:19.968-03:00  INFO 3627822 --- [           main] [42bc5d3d-cd8a-47f0-a3d8-bfd7b57d0e48] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 422 19ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactSharesIT#archivedOrFore` - exit 0

```
2026-11-25T08:18:43.216-03:00  WARN 3628267 --- [           main] [c4735369-f41d-410a-bcfa-16427ee6ccf5] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List)
2026-11-25T08:18:43.216-03:00  WARN 3628267 --- [           main] [c4735369-f41d-410a-bcfa-16427ee6ccf5] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#participants()
2026-11-25T08:18:43.242-03:00  INFO 3628267 --- [           main] [c4735369-f41d-410a-bcfa-16427ee6ccf5] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 58ms userId=1 planId=1
2026-11-25T08:18:43.278-03:00  INFO 3628267 --- [           main] [b96e61f7-2ea0-427c-b965-6769cfbb4840] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 404 11ms userId=1 planId=1
2026-11-25T08:18:43.288-03:00  WARN 3628267 --- [           main] [08fb2006-c8d5-4eec-8379-18755d797f1d] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-25T08:18:43.289-03:00  WARN 3628267 --- [           main] [08fb2006-c8d5-4eec-8379-18755d797f1d] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-25T08:18:43.289-03:00  WARN 3628267 --- [           main] [08fb2006-c8d5-4eec-8379-18755d797f1d] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-25T08:18:43.298-03:00  INFO 3628267 --- [           main] [08fb2006-c8d5-4eec-8379-18755d797f1d] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 422 18ms userId=1 planId=1
2026-11-25T08:18:43.308-03:00  INFO 3628267 --- [           main] [5b7a443b-b9ce-47ab-bc7f-673b82455d45] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 404 8ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactSharesIT#onlyOwnerAndEd` - exit 0

```
2026-11-25T08:19:05.381-03:00  WARN 3628717 --- [           main] [961556d5-0116-45b8-b31a-97a90a375f31] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#items()
2026-11-25T08:19:05.381-03:00  WARN 3628717 --- [           main] [961556d5-0116-45b8-b31a-97a90a375f31] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#allocations()
2026-11-25T08:19:05.381-03:00  WARN 3628717 --- [           main] [961556d5-0116-45b8-b31a-97a90a375f31] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#participants()
2026-11-25T08:19:05.381-03:00  WARN 3628717 --- [           main] [961556d5-0116-45b8-b31a-97a90a375f31] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#com.lcs.findraco.transaction.request.UpdateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List, Long)
2026-11-25T08:19:05.381-03:00  WARN 3628717 --- [           main] [961556d5-0116-45b8-b31a-97a90a375f31] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#com.lcs.findraco.transaction.request.UpdateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List, Long)
2026-11-25T08:19:05.382-03:00  WARN 3628717 --- [           main] [961556d5-0116-45b8-b31a-97a90a375f31] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#com.lcs.findraco.transaction.request.UpdateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List, Long)
2026-11-25T08:19:05.382-03:00  WARN 3628717 --- [           main] [961556d5-0116-45b8-b31a-97a90a375f31] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: allocations
2026-11-25T08:19:05.404-03:00  INFO 3628717 --- [           main] [961556d5-0116-45b8-b31a-97a90a375f31] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/{id} 403 34ms userId=3 planId=1
2026-11-25T08:19:05.426-03:00  INFO 3628717 --- [           main] [a220acbb-bc2e-4771-beba-533b974190d4] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 19ms userId=2 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactSharesIT#seriesCarryCon` - exit 0

```
2026-11-25T08:19:26.409-03:00  INFO 3629203 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-25T08:19:26.464-03:00  INFO 3629203 --- [           main] [] c.l.f.transaction.ContactSharesIT        : Started ContactSharesIT in 9.422 seconds (process running for 10.694)
2026-11-25T08:19:27.048-03:00  WARN 3629203 --- [           main] [90fe1aa4-621b-4d48-b86b-28ffef50395f] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-25T08:19:27.051-03:00  WARN 3629203 --- [           main] [90fe1aa4-621b-4d48-b86b-28ffef50395f] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-25T08:19:27.051-03:00  WARN 3629203 --- [           main] [90fe1aa4-621b-4d48-b86b-28ffef50395f] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-25T08:19:27.226-03:00  INFO 3629203 --- [           main] [90fe1aa4-621b-4d48-b86b-28ffef50395f] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 291ms userId=1 planId=1
2026-11-25T08:19:27.321-03:00  INFO 3629203 --- [           main] [d9dae900-fa66-4b8e-9ac9-2f8ae5a7e4a1] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 31ms userId=1 planId=1
2026-11-25T08:19:27.379-03:00  INFO 3629203 --- [           main] [d84474b8-d805-43cd-a86c-4d578a7ec303] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/{id}/confirm 200 56ms userId=1 planId=1
2026-11-25T08:19:27.474-03:00  INFO 3629203 --- [           main] [18fc7f67-bc79-416b-9f64-cb52fd1530f8] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 89ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='RepaymentsIT#repaymentCountsIn` - exit 0

```
2026-11-25T08:19:48.783-03:00  WARN 3629649 --- [           main] [bd23fdef-7d7a-45b6-8963-84e9b8835882] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#allocations()
2026-11-25T08:19:48.783-03:00  WARN 3629649 --- [           main] [bd23fdef-7d7a-45b6-8963-84e9b8835882] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List)
2026-11-25T08:19:48.783-03:00  WARN 3629649 --- [           main] [bd23fdef-7d7a-45b6-8963-84e9b8835882] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List)
2026-11-25T08:19:48.783-03:00  WARN 3629649 --- [           main] [bd23fdef-7d7a-45b6-8963-84e9b8835882] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List)
2026-11-25T08:19:48.952-03:00  INFO 3629649 --- [           main] [bd23fdef-7d7a-45b6-8963-84e9b8835882] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 279ms userId=1 planId=1
2026-11-25T08:19:49.074-03:00  INFO 3629649 --- [           main] [f4f8e66a-1a8f-41b0-9a15-80c2ad204b5b] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/dashboard 200 71ms userId=1 planId=1
2026-11-25T08:19:49.105-03:00  INFO 3629649 --- [           main] [8d2d50c3-5846-4609-9952-49809785c5b8] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/dashboard/trend 200 21ms userId=1 planId=1
2026-11-25T08:19:49.188-03:00  INFO 3629649 --- [           main] [b4bbb957-b240-4e34-85ff-7d41d610bfe7] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction 200 81ms userId=1 planId=1
2026-11-25T08:19:49.223-03:00  INFO 3629649 --- [           main] [f67c52d6-e8ab-4b09-a92c-3ac77126403a] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction 200 32ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='RepaymentsIT#storesExplicitAll` - exit 0

```
2026-11-25T08:20:10.667-03:00  WARN 3630106 --- [           main] [efc743e7-bd4c-46c8-b567-54dde72f7fb9] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: allocations
2026-11-25T08:20:10.668-03:00  WARN 3630106 --- [           main] [efc743e7-bd4c-46c8-b567-54dde72f7fb9] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-25T08:20:10.668-03:00  WARN 3630106 --- [           main] [efc743e7-bd4c-46c8-b567-54dde72f7fb9] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List)
2026-11-25T08:20:10.668-03:00  WARN 3630106 --- [           main] [efc743e7-bd4c-46c8-b567-54dde72f7fb9] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List)
2026-11-25T08:20:10.668-03:00  WARN 3630106 --- [           main] [efc743e7-bd4c-46c8-b567-54dde72f7fb9] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List)
2026-11-25T08:20:10.849-03:00  INFO 3630106 --- [           main] [efc743e7-bd4c-46c8-b567-54dde72f7fb9] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 292ms userId=1 planId=1
2026-11-25T08:20:10.956-03:00  INFO 3630106 --- [           main] [521044e9-3207-4274-97b6-88d82602079f] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 36ms userId=1 planId=1
2026-11-25T08:20:11.002-03:00  INFO 3630106 --- [           main] [641aee24-9806-4957-b6e3-db84a0580249] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 36ms userId=1 planId=1
2026-11-25T08:20:11.019-03:00  INFO 3630106 --- [           main] [964b4c4c-d7d4-4486-a81c-4b3e8679a5b1] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 13ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='RepaymentsIT#omittedAllocation` - exit 0

```
2026-11-25T08:20:32.835-03:00  WARN 3630597 --- [           main] [a85b6eb0-66c7-4baa-aaa4-e5098c21ce3e] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#allocations()
2026-11-25T08:20:32.835-03:00  WARN 3630597 --- [           main] [a85b6eb0-66c7-4baa-aaa4-e5098c21ce3e] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: allocations
2026-11-25T08:20:32.835-03:00  WARN 3630597 --- [           main] [a85b6eb0-66c7-4baa-aaa4-e5098c21ce3e] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-25T08:20:33.012-03:00  INFO 3630597 --- [           main] [a85b6eb0-66c7-4baa-aaa4-e5098c21ce3e] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 291ms userId=1 planId=1
2026-11-25T08:20:33.115-03:00  INFO 3630597 --- [           main] [a2dc33f3-8c88-4303-ae94-d0b12b55b73e] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 30ms userId=1 planId=1
2026-11-25T08:20:33.149-03:00  INFO 3630597 --- [           main] [b4f968e5-900e-452b-a35d-789321e5580c] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 28ms userId=1 planId=1
2026-11-25T08:20:33.167-03:00  INFO 3630597 --- [           main] [b28a7ba3-6c65-46e7-81ca-722f38af7b6a] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 13ms userId=1 planId=1
2026-11-25T08:20:33.201-03:00  INFO 3630597 --- [           main] [99ebcbfc-fc0c-4469-91f4-c629c70299b5] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 32ms userId=1 planId=1
2026-11-25T08:20:33.220-03:00  INFO 3630597 --- [           main] [809ff09e-dbd8-40c7-80f5-c10547b79744] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 15ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='RepaymentsIT#allocationLimitsA` - exit 0

```
2026-11-25T08:20:54.839-03:00  WARN 3631045 --- [           main] [535baad3-df16-4d35-a0a5-e1527c4afa6f] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: allocations
2026-11-25T08:20:55.030-03:00  INFO 3631045 --- [           main] [535baad3-df16-4d35-a0a5-e1527c4afa6f] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 301ms userId=1 planId=1
2026-11-25T08:20:55.076-03:00  INFO 3631045 --- [           main] [17d0d95c-e548-4d49-aa56-d0aff0416f99] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 33ms userId=1 planId=1
2026-11-25T08:20:55.127-03:00  INFO 3631045 --- [           main] [d70cbd1c-3228-43f5-8754-ca28739e5d5e] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 27ms userId=1 planId=1
2026-11-25T08:20:55.155-03:00  INFO 3631045 --- [           main] [4f1e5e67-ac6e-4446-8f97-6af935598dda] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 26ms userId=1 planId=1
2026-11-25T08:20:55.183-03:00  INFO 3631045 --- [           main] [5ebedb47-d551-4b35-8fde-c2d0da820c2d] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 26ms userId=1 planId=1
2026-11-25T08:20:55.209-03:00  INFO 3631045 --- [           main] [fe935e86-e328-40ce-96c8-9f15deee5315] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 24ms userId=1 planId=1
2026-11-25T08:20:55.279-03:00  INFO 3631045 --- [           main] [21303a0f-6a95-4609-aec3-9345f8efde98] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 22ms userId=1 planId=1
2026-11-25T08:20:55.302-03:00  INFO 3631045 --- [           main] [6830ae97-ff9c-438a-a028-300eb093fddd] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 21ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='RepaymentsIT#concurrentRepayme` - exit 0

```
2026-11-25T08:21:17.355-03:00  INFO 3631492 --- [pool-3-thread-1] [edbb1790-3664-48de-8293-668c50653e24] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 347ms userId=1 planId=1
2026-11-25T08:21:17.459-03:00  INFO 3631492 --- [pool-3-thread-1] [0e4cbd4f-de9e-489b-8c9e-5b0945d55866] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 32ms userId=1 planId=1
2026-11-25T08:21:17.473-03:00  INFO 3631492 --- [pool-3-thread-2] [543e2007-b3f9-4ac8-b0ec-7dc3b69f810f] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 46ms userId=1 planId=1
2026-11-25T08:21:17.508-03:00  INFO 3631492 --- [pool-3-thread-1] [3b17ab51-7939-4b21-afe2-81a6aefe587e] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 25ms userId=1 planId=1
2026-11-25T08:21:17.522-03:00  INFO 3631492 --- [pool-3-thread-2] [5e75e8b8-3de4-4fbf-93e6-d0098fabfb6b] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 38ms userId=1 planId=1
2026-11-25T08:21:17.562-03:00  INFO 3631492 --- [pool-3-thread-1] [8d7f9300-bfd8-4966-a157-dcd03f033ce2] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 29ms userId=1 planId=1
2026-11-25T08:21:17.572-03:00  INFO 3631492 --- [pool-3-thread-2] [4ad4b294-e72b-40f1-8bbb-b1eec3702ad6] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 39ms userId=1 planId=1
2026-11-25T08:21:17.616-03:00  INFO 3631492 --- [pool-3-thread-2] [7bbe491b-dffb-4036-b55d-fb3699e6100b] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 32ms userId=1 planId=1
2026-11-25T08:21:17.628-03:00  INFO 3631492 --- [pool-3-thread-1] [2c239397-b8b2-449c-8866-1abbde757ac9] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 44ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='RepaymentsIT#editReplacesAndTr` - exit 0

```
2026-11-25T08:21:39.900-03:00  INFO 3631951 --- [           main] [f43d3f8b-3885-4cd9-85bb-fa0774f0879e] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts/{id}/statement 200 42ms userId=1 planId=1
2026-11-25T08:21:39.922-03:00  INFO 3631951 --- [           main] [ec810957-055b-41fb-9bed-632ab2022e64] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 19ms userId=1 planId=1
2026-11-25T08:21:39.946-03:00  INFO 3631951 --- [           main] [5945f27b-f1b3-486e-856d-8c3bb6d2259d] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/{id} 200 19ms userId=1 planId=1
2026-11-25T08:21:39.964-03:00  INFO 3631951 --- [           main] [b7afbe11-fcfb-4497-869e-b8b1801593eb] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts/{id}/statement 200 17ms userId=1 planId=1
2026-11-25T08:21:39.983-03:00  INFO 3631951 --- [           main] [263138fd-f770-42c6-8b54-6a3391d5f9e2] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts/{id}/statement 200 17ms userId=1 planId=1
2026-11-25T08:21:40.000-03:00  INFO 3631951 --- [           main] [7701aed7-d8ab-4043-9aed-59a8dcd18da2] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 14ms userId=1 planId=1
2026-11-25T08:21:40.060-03:00  INFO 3631951 --- [           main] [577a9948-4b11-4ce4-afe0-7c42f0dcb3d8] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 200 58ms userId=1 planId=1
2026-11-25T08:21:40.084-03:00  INFO 3631951 --- [           main] [d4cee19c-da2d-4928-8ba9-af8b8e6562ef] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts/{id}/statement 200 22ms userId=1 planId=1
2026-11-25T08:21:40.099-03:00  INFO 3631951 --- [           main] [d6b6eea8-af77-4cb1-a849-20fa8482645d] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 13ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='RepaymentsIT#reducingAShareCut` - exit 0

```
2026-11-25T08:22:02.203-03:00  INFO 3632403 --- [           main] [0702b48d-a270-469a-9d5f-219bf9ab8e0f] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/{id} 200 32ms userId=1 planId=1
2026-11-25T08:22:02.221-03:00  INFO 3632403 --- [           main] [b3db8cc1-238a-44d2-8969-2294167ddfcb] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 14ms userId=1 planId=1
2026-11-25T08:22:02.258-03:00  INFO 3632403 --- [           main] [fd4b4cc1-acca-4b6f-a212-f16146477275] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 31ms userId=1 planId=1
2026-11-25T08:22:02.278-03:00  INFO 3632403 --- [           main] [ea86cb87-c777-4c56-b91a-c90b681968fd] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/{id} 200 17ms userId=1 planId=1
2026-11-25T08:22:02.307-03:00  INFO 3632403 --- [           main] [84307875-dbf4-4707-b338-d039f1b87438] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts/{id}/statement 200 27ms userId=1 planId=1
2026-11-25T08:22:02.322-03:00  INFO 3632403 --- [           main] [ccad930d-cf33-4c5b-b524-aae9de6c89e6] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 12ms userId=1 planId=1
2026-11-25T08:22:02.382-03:00  INFO 3632403 --- [           main] [c4d0b28e-e0ee-4e03-ad7b-967bda178cc7] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 200 57ms userId=1 planId=1
2026-11-25T08:22:02.421-03:00  INFO 3632403 --- [           main] [65f9b822-e510-497c-ba73-091114d775a3] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts/{id}/statement 200 37ms userId=1 planId=1
2026-11-25T08:22:02.444-03:00  INFO 3632403 --- [           main] [f35cd7f1-e92f-4f3e-91a7-c095ef5488af] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 20ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactStatementIT#groupsByMon` - exit 0

```
2026-11-25T08:22:25.593-03:00  WARN 3632902 --- [           main] [0df45bc1-32d6-4e74-b8c5-49eb41ef3b9a] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: allocations
2026-11-25T08:22:25.593-03:00  WARN 3632902 --- [           main] [0df45bc1-32d6-4e74-b8c5-49eb41ef3b9a] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#allocations()
2026-11-25T08:22:25.593-03:00  WARN 3632902 --- [           main] [0df45bc1-32d6-4e74-b8c5-49eb41ef3b9a] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#participants()
2026-11-25T08:22:25.593-03:00  WARN 3632902 --- [           main] [0df45bc1-32d6-4e74-b8c5-49eb41ef3b9a] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-25T08:22:25.594-03:00  WARN 3632902 --- [           main] [0df45bc1-32d6-4e74-b8c5-49eb41ef3b9a] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-25T08:22:25.594-03:00  WARN 3632902 --- [           main] [0df45bc1-32d6-4e74-b8c5-49eb41ef3b9a] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#items()
2026-11-25T08:22:25.771-03:00  INFO 3632902 --- [           main] [0df45bc1-32d6-4e74-b8c5-49eb41ef3b9a] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 292ms userId=1 planId=1
2026-11-25T08:22:25.807-03:00  INFO 3632902 --- [           main] [173db1e5-0832-4acf-8652-b4338379b2a4] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 29ms userId=1 planId=1
2026-11-25T08:22:25.851-03:00  INFO 3632902 --- [           main] [5a9c8f4e-4fe1-44f1-b0f2-42fb7f41c172] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts/{id}/statement 200 37ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactStatementIT#balanceLeav` - exit 0

```
2026-11-25T08:22:49.307-03:00  WARN 3633347 --- [           main] [c6587692-8636-4600-b9a0-8c82c46cb279] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#items()
2026-11-25T08:22:49.307-03:00  WARN 3633347 --- [           main] [c6587692-8636-4600-b9a0-8c82c46cb279] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: allocations
2026-11-25T08:22:49.307-03:00  WARN 3633347 --- [           main] [c6587692-8636-4600-b9a0-8c82c46cb279] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-25T08:22:49.307-03:00  WARN 3633347 --- [           main] [c6587692-8636-4600-b9a0-8c82c46cb279] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-25T08:22:49.491-03:00  INFO 3633347 --- [           main] [c6587692-8636-4600-b9a0-8c82c46cb279] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 316ms userId=1 planId=1
2026-11-25T08:22:49.541-03:00  INFO 3633347 --- [           main] [f86685d4-53c8-4134-b5f7-ee3a22dd0ecd] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts/{id}/statement 200 44ms userId=1 planId=1
2026-11-25T08:22:49.626-03:00  INFO 3633347 --- [           main] [444a4a53-0632-48e5-a009-8243aa0c0ef6] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 30ms userId=1 planId=1
2026-11-25T08:22:49.645-03:00  INFO 3633347 --- [           main] [9f62f068-4097-456f-b767-808de46fde6b] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts/{id}/statement 200 18ms userId=1 planId=1
2026-11-25T08:22:49.672-03:00  INFO 3633347 --- [           main] [67384c08-d3ca-4c26-a203-97797dddb8eb] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 24ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactStatementIT#trashedRows` - exit 0

```
2026-11-25T08:23:12.035-03:00  INFO 3633812 --- [           main] [c550f36f-20ee-4bb7-b017-17ca37373389] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 294ms userId=1 planId=1
2026-11-25T08:23:12.071-03:00  INFO 3633812 --- [           main] [ae2a7772-e007-465a-8efc-70d80c402eec] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/{id} 200 24ms userId=1 planId=1
2026-11-25T08:23:12.116-03:00  INFO 3633812 --- [           main] [dffab8e9-5fc9-4258-a8df-8e10814095b9] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts/{id}/statement 200 43ms userId=1 planId=1
2026-11-25T08:23:12.235-03:00  INFO 3633812 --- [           main] [39c6bcf5-f15a-4d09-9f0b-35bcfe7511c2] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 200 58ms userId=1 planId=1
2026-11-25T08:23:12.254-03:00  INFO 3633812 --- [           main] [5159d2a5-f37e-47c8-9619-12a17c0d820c] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts/{id}/statement 200 18ms userId=1 planId=1
2026-11-25T08:23:12.266-03:00  INFO 3633812 --- [           main] [cf0b8ffe-07ad-4d28-a84b-7c6ed6506071] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/{id} 200 9ms userId=1 planId=1
2026-11-25T08:23:12.291-03:00  INFO 3633812 --- [           main] [478f678b-9765-441a-87ca-46b0c28a483b] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts/{id}/statement 200 24ms userId=1 planId=1
2026-11-25T08:23:12.336-03:00  INFO 3633812 --- [           main] [e7faec79-74d3-4b47-a9f1-b658102cf075] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 200 37ms userId=1 planId=1
2026-11-25T08:23:12.360-03:00  INFO 3633812 --- [           main] [eb5d1694-2ed6-42f6-a8fd-0080752b30ba] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts/{id}/statement 200 22ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpContactsIT#attributedToReso` - exit 0

```
2026-11-25T08:23:34.849-03:00  INFO 3634314 --- [           main] [200183f2-f50f-4bff-9f53-d913319aac87] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 248ms userId=- planId=-
2026-11-25T08:23:34.890-03:00  INFO 3634314 --- [           main] [be4fcad2-9f60-444d-b087-273c635674c6] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=create_transaction user=1 plan=1 outcome=ok durationMs=36
2026-11-25T08:23:34.890-03:00  INFO 3634314 --- [           main] [be4fcad2-9f60-444d-b087-273c635674c6] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 39ms userId=- planId=-
2026-11-25T08:23:34.962-03:00  INFO 3634314 --- [           main] [8243b5dd-bc05-4f81-9926-be0319b55299] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=create_transaction user=1 plan=1 outcome=error durationMs=18
2026-11-25T08:23:34.963-03:00  INFO 3634314 --- [           main] [8243b5dd-bc05-4f81-9926-be0319b55299] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 21ms userId=- planId=-
2026-11-25T08:23:34.999-03:00  INFO 3634314 --- [           main] [0600242e-4a64-4e28-a30f-4a13edb6c726] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=create_transaction user=1 plan=1 outcome=error durationMs=17
2026-11-25T08:23:34.999-03:00  INFO 3634314 --- [           main] [0600242e-4a64-4e28-a30f-4a13edb6c726] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 21ms userId=- planId=-
2026-11-25T08:23:35.020-03:00  INFO 3634314 --- [           main] [5de8c244-5d33-410d-80af-51c8176fae43] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=create_transaction user=1 plan=1 outcome=error durationMs=16
2026-11-25T08:23:35.021-03:00  INFO 3634314 --- [           main] [5de8c244-5d33-410d-80af-51c8176fae43] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 20ms userId=- planId=-
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpContactsIT#repaymentApplies` - exit 0

```
2026-11-25T08:23:57.075-03:00  WARN 3634768 --- [           main] [33244b59-984a-4079-b3f8-dc10e147e3e0] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: allocations
2026-11-25T08:23:57.076-03:00  WARN 3634768 --- [           main] [33244b59-984a-4079-b3f8-dc10e147e3e0] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#items()
2026-11-25T08:23:57.076-03:00  WARN 3634768 --- [           main] [33244b59-984a-4079-b3f8-dc10e147e3e0] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List)
2026-11-25T08:23:57.076-03:00  WARN 3634768 --- [           main] [33244b59-984a-4079-b3f8-dc10e147e3e0] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List)
2026-11-25T08:23:57.076-03:00  WARN 3634768 --- [           main] [33244b59-984a-4079-b3f8-dc10e147e3e0] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List)
2026-11-25T08:23:57.161-03:00  INFO 3634768 --- [           main] [33244b59-984a-4079-b3f8-dc10e147e3e0] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=create_transaction user=1 plan=1 outcome=ok durationMs=264
2026-11-25T08:23:57.175-03:00  INFO 3634768 --- [           main] [33244b59-984a-4079-b3f8-dc10e147e3e0] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 303ms userId=- planId=-
2026-11-25T08:23:57.286-03:00  INFO 3634768 --- [           main] [2e49317a-7781-4772-b4b4-23cd1334267e] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=create_transaction user=1 plan=1 outcome=ok durationMs=58
2026-11-25T08:23:57.287-03:00  INFO 3634768 --- [           main] [2e49317a-7781-4772-b4b4-23cd1334267e] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 62ms userId=- planId=-
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpContactsIT#listsContactsAnd` - exit 0

```
2026-11-25T08:24:19.828-03:00  WARN 3635262 --- [           main] [0ffde27d-3773-47e8-a602-5f22713b0f4c] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#participants()
2026-11-25T08:24:19.828-03:00  WARN 3635262 --- [           main] [0ffde27d-3773-47e8-a602-5f22713b0f4c] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-25T08:24:19.828-03:00  WARN 3635262 --- [           main] [0ffde27d-3773-47e8-a602-5f22713b0f4c] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-25T08:24:19.904-03:00  INFO 3635262 --- [           main] [0ffde27d-3773-47e8-a602-5f22713b0f4c] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=create_transaction user=1 plan=1 outcome=ok durationMs=252
2026-11-25T08:24:19.917-03:00  INFO 3635262 --- [           main] [0ffde27d-3773-47e8-a602-5f22713b0f4c] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 290ms userId=- planId=-
2026-11-25T08:24:19.939-03:00  INFO 3635262 --- [           main] [1ef5ad37-13fe-4297-a8db-7cdf13bca211] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=list_contacts user=1 plan=1 outcome=ok durationMs=17
2026-11-25T08:24:19.940-03:00  INFO 3635262 --- [           main] [1ef5ad37-13fe-4297-a8db-7cdf13bca211] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 21ms userId=- planId=-
2026-11-25T08:24:20.060-03:00  INFO 3635262 --- [           main] [d54ac420-67e9-4a7c-be22-d6c91d9fc0c3] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=list_transactions user=1 plan=1 outcome=ok durationMs=65
2026-11-25T08:24:20.060-03:00  INFO 3635262 --- [           main] [d54ac420-67e9-4a7c-be22-d6c91d9fc0c3] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 70ms userId=- planId=-
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='OpenApiSnapshotIT' -Dsurefire.` - exit 0

```
2026-11-25T08:24:42.052-03:00  INFO 3635737 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable resources templates capabilities, notification: true
2026-11-25T08:24:42.053-03:00  INFO 3635737 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable prompts capabilities, notification: true
2026-11-25T08:24:42.054-03:00  INFO 3635737 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable completions capabilities
2026-11-25T08:24:42.187-03:00  INFO 3635737 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-25T08:24:42.187-03:00  INFO 3635737 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-25T08:24:42.189-03:00  INFO 3635737 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 2 ms
2026-11-25T08:24:42.242-03:00  INFO 3635737 --- [           main] [] c.lcs.findraco.shared.OpenApiSnapshotIT  : Started OpenApiSnapshotIT in 9.524 seconds (process running for 10.834)
2026-11-25T08:24:43.226-03:00  INFO 3635737 --- [           main] [9e1357ee-a275-46c1-a2e8-21334c0829d3] o.springdoc.api.AbstractOpenApiResource  : Init duration for springdoc-openapi is: 615 ms
2026-11-25T08:24:43.261-03:00  INFO 3635737 --- [           main] [9e1357ee-a275-46c1-a2e8-21334c0829d3] c.l.f.shared.web.RequestLogFilter        : GET /v3/api-docs 200 679ms userId=- planId=-
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='RepaymentsIT#aSettledPurchaseM` - exit 0

```
2026-11-25T08:25:06.707-03:00  WARN 3636215 --- [           main] [0f54ea52-b493-4e9b-b041-1166ece2cc1b] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#allocations()
2026-11-25T08:25:06.708-03:00  WARN 3636215 --- [           main] [0f54ea52-b493-4e9b-b041-1166ece2cc1b] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#com.lcs.findraco.transaction.request.UpdateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List, Long)
2026-11-25T08:25:06.708-03:00  WARN 3636215 --- [           main] [0f54ea52-b493-4e9b-b041-1166ece2cc1b] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#com.lcs.findraco.transaction.request.UpdateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List, Long)
2026-11-25T08:25:06.708-03:00  WARN 3636215 --- [           main] [0f54ea52-b493-4e9b-b041-1166ece2cc1b] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#com.lcs.findraco.transaction.request.UpdateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List, Long)
2026-11-25T08:25:06.708-03:00  WARN 3636215 --- [           main] [0f54ea52-b493-4e9b-b041-1166ece2cc1b] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#participants()
2026-11-25T08:25:06.708-03:00  WARN 3636215 --- [           main] [0f54ea52-b493-4e9b-b041-1166ece2cc1b] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-25T08:25:06.762-03:00  INFO 3636215 --- [           main] [0f54ea52-b493-4e9b-b041-1166ece2cc1b] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/{id} 200 68ms userId=1 planId=1
2026-11-25T08:25:06.820-03:00  INFO 3636215 --- [           main] [6893e740-4476-4646-816e-dd38b5f7d2d1] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts/{id}/statement 200 33ms userId=1 planId=1
2026-11-25T08:25:06.843-03:00  INFO 3636215 --- [           main] [c2da3dcb-52a9-440e-bd9e-a2b0530233f8] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 18ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='RepaymentsIT#editingAPaymentWh` - exit 0

```
2026-11-25T08:25:30.095-03:00  INFO 3636691 --- [           main] [16c636e6-1a77-4e9e-8144-716bf7b81e92] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/{id} 200 55ms userId=1 planId=1
2026-11-25T08:25:30.207-03:00  INFO 3636691 --- [           main] [d826a4a8-8a6c-429d-9873-2f817cbda30b] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 200 57ms userId=1 planId=1
2026-11-25T08:25:30.245-03:00  INFO 3636691 --- [           main] [1d218111-5c78-4557-8f60-3292fcb6e1d6] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts/{id}/statement 200 36ms userId=1 planId=1
2026-11-25T08:25:30.270-03:00  INFO 3636691 --- [           main] [b6d46a90-857f-48db-bb9f-d11ce017d530] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 20ms userId=1 planId=1
2026-11-25T08:25:30.312-03:00  INFO 3636691 --- [           main] [add13c84-f1c5-408d-9bf6-1d8b66e74420] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 31ms userId=1 planId=1
2026-11-25T08:25:30.328-03:00  INFO 3636691 --- [           main] [6c234409-406a-492b-a74a-a89a4b949da8] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/{id} 200 15ms userId=1 planId=1
2026-11-25T08:25:30.362-03:00  INFO 3636691 --- [           main] [f540f646-9d32-400c-beda-78cfcb988f7d] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/{id} 200 31ms userId=1 planId=1
2026-11-25T08:25:30.391-03:00  INFO 3636691 --- [           main] [fbc784fc-231a-43cd-99da-924492a766ec] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 200 28ms userId=1 planId=1
2026-11-25T08:25:30.407-03:00  INFO 3636691 --- [           main] [28d18e0d-c18b-4f96-b5a7-375320bc932e] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts/{id}/statement 200 14ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactSharesIT#markingAContac` - exit 0

```
2026-11-25T08:25:53.008-03:00  WARN 3637192 --- [           main] [c4b02ac5-b1f8-4858-bdc3-10b24413f157] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List)
2026-11-25T08:25:53.008-03:00  WARN 3637192 --- [           main] [c4b02ac5-b1f8-4858-bdc3-10b24413f157] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List)
2026-11-25T08:25:53.009-03:00  WARN 3637192 --- [           main] [c4b02ac5-b1f8-4858-bdc3-10b24413f157] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List)
2026-11-25T08:25:53.153-03:00  INFO 3637192 --- [           main] [c4b02ac5-b1f8-4858-bdc3-10b24413f157] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 268ms userId=1 planId=1
2026-11-25T08:25:53.201-03:00  INFO 3637192 --- [           main] [df392b5b-ecdc-4ebf-84f4-2d5495b6a930] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/{id}/kind 422 37ms userId=1 planId=1
2026-11-25T08:25:53.241-03:00  INFO 3637192 --- [           main] [66518699-e798-4702-a250-f0bd7b3c99e2] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/{id}/kind 422 14ms userId=1 planId=1
2026-11-25T08:25:53.254-03:00  INFO 3637192 --- [           main] [ec0de3b4-8c77-4e45-90fd-13cd88849e25] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/{id}/kind 422 12ms userId=1 planId=1
2026-11-25T08:25:53.268-03:00  INFO 3637192 --- [           main] [5a085dad-7b54-4430-844b-785fbc0d39f6] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/{id}/kind 422 12ms userId=1 planId=1
2026-11-25T08:25:53.283-03:00  INFO 3637192 --- [           main] [48beb142-eaa1-4dff-a2e6-91b457c195da] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/{id} 200 13ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactsIT#refusesArchiveWithP` - exit 0

```
2026-11-25T08:26:16.258-03:00  INFO 3637711 --- [           main] [7bd9e875-cabf-430c-bb71-d43a03e3949f] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts/{id}/archive 409 30ms userId=1 planId=1
2026-11-25T08:26:16.311-03:00  INFO 3637711 --- [           main] [50d510ae-0a22-492d-9ea9-b38ff2edade6] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts/{id}/archive 409 23ms userId=1 planId=1
2026-11-25T08:26:16.328-03:00  INFO 3637711 --- [           main] [18765a37-2c6a-4cad-bb50-b911465ea6d8] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 15ms userId=1 planId=1
2026-11-25T08:26:16.413-03:00  INFO 3637711 --- [           main] [4d37e864-76ac-42e8-9f51-919a7b070f4e] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts/{id}/archive 200 30ms userId=1 planId=1
2026-11-25T08:26:16.484-03:00  INFO 3637711 --- [           main] [3b7d9893-cd1e-4730-b5af-8b661be1aaf2] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 68ms userId=1 planId=1
2026-11-25T08:26:16.509-03:00  INFO 3637711 --- [           main] [ec625525-dc6d-4909-971f-6a7f5b3505ad] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts/{id}/archive 200 21ms userId=1 planId=1
2026-11-25T08:26:16.526-03:00  INFO 3637711 --- [           main] [42a19038-4eba-4073-94a5-08de94032bad] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/{id} 200 16ms userId=1 planId=1
2026-11-25T08:26:16.546-03:00  INFO 3637711 --- [           main] [be2fc39d-f574-4398-9e4c-ec4594e14647] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts/{id}/archive 200 18ms userId=1 planId=1
2026-11-25T08:26:16.559-03:00  INFO 3637711 --- [           main] [20500661-07e7-47ab-8056-93a5962e3afa] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 10ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='RepaymentsIT#aPurchaseRestoreW` - exit 0

```
2026-11-25T08:26:39.174-03:00  WARN 3638174 --- [           main] [137063c4-b422-4704-8fac-b047cabeea61] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List)
2026-11-25T08:26:39.175-03:00  WARN 3638174 --- [           main] [137063c4-b422-4704-8fac-b047cabeea61] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List)
2026-11-25T08:26:39.175-03:00  WARN 3638174 --- [           main] [137063c4-b422-4704-8fac-b047cabeea61] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#allocations()
2026-11-25T08:26:39.175-03:00  WARN 3638174 --- [           main] [137063c4-b422-4704-8fac-b047cabeea61] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#items()
2026-11-25T08:26:39.175-03:00  WARN 3638174 --- [           main] [137063c4-b422-4704-8fac-b047cabeea61] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-25T08:26:39.371-03:00  INFO 3638174 --- [           main] [137063c4-b422-4704-8fac-b047cabeea61] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 309ms userId=1 planId=1
2026-11-25T08:26:39.414-03:00  INFO 3638174 --- [           main] [9bb767ee-bd9e-4b14-b015-d5a30fe39eb2] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/{id} 200 25ms userId=1 planId=1
2026-11-25T08:26:41.016-03:00  INFO 3638174 --- [pool-3-thread-1] [55df72cc-981a-449d-bbb2-3936a9d309aa] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 200 1597ms userId=1 planId=1
2026-11-25T08:26:41.057-03:00  INFO 3638174 --- [           main] [b8fe36ff-1e51-4cc4-aa01-208bc9184e42] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts/{id}/statement 200 40ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```
