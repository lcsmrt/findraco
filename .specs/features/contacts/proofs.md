# contacts proofs

**HEAD**: 29630779
**Tree**: clean
**Shell**: /bin/sh
**Result**: 79 pass, 0 fail

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
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer contacts > offers a plan of one member the split when it has a contact 67ms
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer contacts > offers no contact to a contributor 41ms
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer repayment > turns an income into a contact payment 463ms
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer repayment > gives the payment one receiving member whatever split came before, and lets the user choose who 511ms
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer repayment > shows the excess as credit 396ms
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer repayment > keeps what the user ticked when the amount changes afterwards 394ms
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer repayment > loads the allocations of the payment being edited 73ms
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer repayment > offers no contact payment to a contributor 115ms

 Test Files  3 passed (3)
      Tests  70 passed (70)
   Start at  07:37:21
   Duration  13.98s (transform 636ms, setup 407ms, collect 7.65s, tests 11.81s, environment 1.56s, prepare 132ms)

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
   Start at  07:37:37
   Duration  2.48s (transform 118ms, setup 227ms, collect 1.76s, tests 24ms, environment 879ms, prepare 83ms)

No story files found for the specified pattern: src/**/*.mdx
```

`Run table` - exit 0

```
Creating Table Instance...

 ✓ |unit| src/features/transactions/TransactionsPage.test.tsx > TransactionsPage period navigator (PNAV-01, PNAV-02) > replaces a custom range with the This month preset (PNAV-03 AC 1) 239ms
stdout | src/features/transactions/TransactionsPage.test.tsx > TransactionsPage period navigator (PNAV-01, PNAV-02) > ignores the pre-feature from and to params and opens on the current month (PNAV-05)
Creating Table Instance...

 ✓ |unit| src/features/transactions/TransactionsPage.test.tsx > TransactionsPage period navigator (PNAV-01, PNAV-02) > keeps the period when all filters are cleared (PNAV-02 AC 4) 119ms
 ✓ |unit| src/features/transactions/TransactionsPage.test.tsx > TransactionsPage period navigator (PNAV-01, PNAV-02) > ignores the pre-feature from and to params and opens on the current month (PNAV-05) 27ms

 Test Files  2 passed (2)
      Tests  53 passed (53)
   Start at  07:37:41
   Duration  13.23s (transform 675ms, setup 187ms, collect 3.18s, tests 9.45s, environment 684ms, prepare 82ms)

No story files found for the specified pattern: src/**/*.mdx
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactsIT#createsTrimsAndBoun` - exit 0

```
2026-11-25T07:38:21.644-03:00  INFO 3570831 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 2 ms
2026-11-25T07:38:21.717-03:00  INFO 3570831 --- [           main] [] com.lcs.findraco.plan.ContactsIT         : Started ContactsIT in 15.493 seconds (process running for 17.178)
2026-11-25T07:38:22.744-03:00  INFO 3570831 --- [           main] [2704a0a4-88ee-4fd0-9e83-7698324eb412] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts 201 483ms userId=1 planId=1
2026-11-25T07:38:22.891-03:00  INFO 3570831 --- [           main] [3c5acf8a-4475-4339-875e-57ea6c35d713] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts 201 29ms userId=1 planId=1
2026-11-25T07:38:22.917-03:00  INFO 3570831 --- [           main] [5a46791c-db69-4264-acb1-70607ec94c8d] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts 422 24ms userId=1 planId=1
2026-11-25T07:38:22.961-03:00  INFO 3570831 --- [           main] [32291bec-b9c6-4a4b-a69c-b2ed878fbf1a] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts 422 7ms userId=1 planId=1
2026-11-25T07:38:22.969-03:00  INFO 3570831 --- [           main] [99c4c6a4-466d-4fb5-b02f-8183bc7cc77b] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts 422 6ms userId=1 planId=1
2026-11-25T07:38:22.993-03:00  INFO 3570831 --- [           main] [6b967160-20ee-4c2c-9194-f59c0673ef55] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts 201 21ms userId=1 planId=1
2026-11-25T07:38:23.034-03:00  INFO 3570831 --- [           main] [4c1caebe-2c47-4c5a-adc1-877a686bfc1b] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 39ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactsIT#rejectsADuplicateAc` - exit 0

```
2026-11-25T07:38:54.133-03:00  INFO 3572948 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-25T07:38:54.133-03:00  INFO 3572948 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-25T07:38:54.135-03:00  INFO 3572948 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 2 ms
2026-11-25T07:38:54.201-03:00  INFO 3572948 --- [           main] [] com.lcs.findraco.plan.ContactsIT         : Started ContactsIT in 14.37 seconds (process running for 16.081)
2026-11-25T07:38:54.974-03:00  INFO 3572948 --- [           main] [f39253c5-705e-461c-9e08-eaa94e0878ff] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts 422 222ms userId=1 planId=1
2026-11-25T07:38:55.118-03:00  INFO 3572948 --- [           main] [54f509ae-4ae0-4a51-8c8b-a7d5c0e8d70d] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts 201 40ms userId=1 planId=2
2026-11-25T07:38:55.161-03:00  INFO 3572948 --- [           main] [48ee2dee-bf7c-4d05-991f-72e2ffc34e3e] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts 201 31ms userId=1 planId=1
2026-11-25T07:38:55.248-03:00  INFO 3572948 --- [           main] [5eb56e7b-94f2-4d41-b065-05f617eb027d] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts/{id}/archive 200 84ms userId=1 planId=1
2026-11-25T07:38:55.318-03:00  INFO 3572948 --- [           main] [2de4480b-71eb-40ee-8a72-59dea3c3fa6e] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts 201 66ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactsIT#renameReachesTheSha` - exit 0

```
2026-11-25T07:39:26.446-03:00  INFO 3575011 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-25T07:39:26.447-03:00  INFO 3575011 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-25T07:39:26.450-03:00  INFO 3575011 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 3 ms
2026-11-25T07:39:26.526-03:00  INFO 3575011 --- [           main] [] com.lcs.findraco.plan.ContactsIT         : Started ContactsIT in 14.196 seconds (process running for 16.085)
2026-11-25T07:39:27.407-03:00  INFO 3575011 --- [           main] [b8b1e3e7-e4d4-45da-9d28-1f109affc93c] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/contacts/{id} 200 256ms userId=1 planId=1
2026-11-25T07:39:27.523-03:00  INFO 3575011 --- [           main] [06b5a3d5-99a7-4b62-93b4-2f84facec75d] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/{id} 200 49ms userId=1 planId=1
2026-11-25T07:39:27.550-03:00  INFO 3575011 --- [           main] [202720ba-dfff-4c63-85ed-752ee92c2071] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/contacts/{id} 409 25ms userId=1 planId=1
2026-11-25T07:39:27.613-03:00  INFO 3575011 --- [           main] [a3e0cae3-0fb1-4617-9bd3-e264eeb93cd3] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 30ms userId=1 planId=1
2026-11-25T07:39:27.640-03:00  INFO 3575011 --- [           main] [b63fdc10-99f8-4eb6-8e72-98c732a0a31e] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/contacts/{id} 422 16ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactsIT#listsActiveContacts` - exit 0

```
2026-11-25T07:39:56.203-03:00  INFO 3577015 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable prompts capabilities, notification: true
2026-11-25T07:39:56.205-03:00  INFO 3577015 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable completions capabilities
2026-11-25T07:39:56.411-03:00  INFO 3577015 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-25T07:39:56.411-03:00  INFO 3577015 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-25T07:39:56.413-03:00  INFO 3577015 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 2 ms
2026-11-25T07:39:56.475-03:00  INFO 3577015 --- [           main] [] com.lcs.findraco.plan.ContactsIT         : Started ContactsIT in 13.092 seconds (process running for 14.855)
2026-11-25T07:39:57.407-03:00  INFO 3577015 --- [           main] [7983e91d-7404-419d-ac78-5ef9956eef7c] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts/{id}/archive 200 341ms userId=1 planId=1
2026-11-25T07:39:57.480-03:00  INFO 3577015 --- [           main] [a5fee6f4-a271-466c-8c05-cb164d780caf] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 61ms userId=1 planId=1
2026-11-25T07:39:57.570-03:00  INFO 3577015 --- [           main] [df01f39b-2101-41dc-a8fc-8f3cfee4924e] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 19ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactsIT#archivesOnlyAtZeroB` - exit 0

```
2026-11-25T07:40:28.384-03:00  WARN 3578980 --- [           main] [4e7bf899-e4d5-404b-9a62-bd8c555eaa58] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-25T07:40:28.384-03:00  WARN 3578980 --- [           main] [4e7bf899-e4d5-404b-9a62-bd8c555eaa58] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#participants()
2026-11-25T07:40:28.385-03:00  WARN 3578980 --- [           main] [4e7bf899-e4d5-404b-9a62-bd8c555eaa58] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: allocations
2026-11-25T07:40:28.385-03:00  WARN 3578980 --- [           main] [4e7bf899-e4d5-404b-9a62-bd8c555eaa58] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#allocations()
2026-11-25T07:40:28.385-03:00  WARN 3578980 --- [           main] [4e7bf899-e4d5-404b-9a62-bd8c555eaa58] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List)
2026-11-25T07:40:28.386-03:00  WARN 3578980 --- [           main] [4e7bf899-e4d5-404b-9a62-bd8c555eaa58] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List)
2026-11-25T07:40:28.386-03:00  WARN 3578980 --- [           main] [4e7bf899-e4d5-404b-9a62-bd8c555eaa58] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List)
2026-11-25T07:40:28.386-03:00  WARN 3578980 --- [           main] [4e7bf899-e4d5-404b-9a62-bd8c555eaa58] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#items()
2026-11-25T07:40:28.420-03:00  INFO 3578980 --- [           main] [4e7bf899-e4d5-404b-9a62-bd8c555eaa58] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 96ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactsIT#unarchiveRestoresUn` - exit 0

```
2026-11-25T07:40:57.826-03:00  INFO 3580993 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-25T07:40:57.912-03:00  INFO 3580993 --- [           main] [] com.lcs.findraco.plan.ContactsIT         : Started ContactsIT in 13.218 seconds (process running for 14.679)
2026-11-25T07:40:58.854-03:00  INFO 3580993 --- [           main] [96d32065-9120-487c-8326-f22036114868] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts/{id}/archive 200 348ms userId=1 planId=1
2026-11-25T07:40:58.927-03:00  INFO 3580993 --- [           main] [b8657f74-193a-4fdf-9633-9fda2cdabe21] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts/{id}/archive 200 64ms userId=1 planId=1
2026-11-25T07:40:58.999-03:00  INFO 3580993 --- [           main] [b48deac9-efa6-4bcd-82a0-72643664cc53] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts 201 66ms userId=1 planId=1
2026-11-25T07:40:59.047-03:00  INFO 3580993 --- [           main] [63e6198d-cb45-469e-906c-d83298767e31] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts/{id}/unarchive 422 45ms userId=1 planId=1
2026-11-25T07:40:59.160-03:00  INFO 3580993 --- [           main] [2cca9ab6-a975-4e03-a16b-fd70e795979e] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 46ms userId=1 planId=1
2026-11-25T07:40:59.257-03:00  INFO 3580993 --- [           main] [eb4261c0-81dd-42fe-843b-c757d7e56c41] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts/{id}/unarchive 200 23ms userId=1 planId=1
2026-11-25T07:40:59.275-03:00  INFO 3580993 --- [           main] [7ae0b17d-25f1-48f0-b770-d7a23e9fb535] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 16ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactsIT#deletesOnlyAnUnused` - exit 0

```
2026-11-25T07:41:29.202-03:00  INFO 3582922 --- [           main] [72e44525-0316-4ef1-988c-792853cc3dc8] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 340ms userId=1 planId=1
2026-11-25T07:41:29.264-03:00  INFO 3582922 --- [           main] [80f47886-4f39-468e-b183-d97b6f7f568e] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/{id} 200 54ms userId=1 planId=1
2026-11-25T07:41:29.328-03:00  INFO 3582922 --- [           main] [1d2af3bd-2bd7-43e0-937f-58ad88ea8d82] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/contacts/{id} 409 59ms userId=1 planId=1
2026-11-25T07:41:29.401-03:00  INFO 3582922 --- [           main] [032d184a-2e94-484d-a05e-3ace3355def7] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/contacts/{id} 409 21ms userId=1 planId=1
2026-11-25T07:41:29.427-03:00  INFO 3582922 --- [           main] [89e5fde2-3501-4d22-ab1f-9d84032a1c82] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/contacts/{id} 409 24ms userId=1 planId=1
2026-11-25T07:41:29.441-03:00  INFO 3582922 --- [           main] [041497c7-4942-4982-878f-9e3c9a932f59] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/contacts/{id} 409 12ms userId=1 planId=1
2026-11-25T07:41:29.491-03:00  INFO 3582922 --- [           main] [a95f1eb7-3a8d-4d7a-8db4-0c8d332c3e2f] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 48ms userId=1 planId=1
2026-11-25T07:41:29.669-03:00  INFO 3582922 --- [           main] [df53d33f-c8c0-45eb-b6ab-ef9ce6438081] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/contacts/{id} 204 59ms userId=1 planId=1
2026-11-25T07:41:29.696-03:00  INFO 3582922 --- [           main] [feadb9ca-4c92-4506-b6f7-7fa0f8f292a4] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 24ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactRoleMatrixIT' -Dsurefir` - exit 0

```
2026-11-25T07:42:02.408-03:00  INFO 3584945 --- [           main] [81d397f8-5c94-4b11-bd1e-febbb021a3ce] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts/{id}/unarchive 200 11ms userId=2 planId=1
2026-11-25T07:42:02.470-03:00  INFO 3584945 --- [           main] [5018845f-50c3-400a-ac9c-86e80a4f50d1] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts/{id}/unarchive 403 6ms userId=3 planId=1
2026-11-25T07:42:02.538-03:00  INFO 3584945 --- [           main] [f966781a-81c9-407e-8771-53ba36b929a2] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts/{id}/unarchive 403 6ms userId=4 planId=1
2026-11-25T07:42:02.605-03:00  INFO 3584945 --- [           main] [ec54ef32-7ac6-4fe5-ac3b-bd3d1db25b91] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts/{id}/unarchive 404 6ms userId=5 planId=1
2026-11-25T07:42:02.692-03:00  INFO 3584945 --- [           main] [a5932424-ad14-470d-be6a-b36879c2358b] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/contacts/{id} 204 23ms userId=1 planId=1
2026-11-25T07:42:02.769-03:00  INFO 3584945 --- [           main] [1749108c-84c9-4324-9a70-69a182411151] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/contacts/{id} 204 13ms userId=2 planId=1
2026-11-25T07:42:02.836-03:00  INFO 3584945 --- [           main] [5bb0d35a-bd20-435b-9465-fce177a2329d] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/contacts/{id} 403 7ms userId=3 planId=1
2026-11-25T07:42:02.903-03:00  INFO 3584945 --- [           main] [7a1db0ee-4373-446b-b6b6-fc2aea69a8e4] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/contacts/{id} 403 5ms userId=4 planId=1
2026-11-25T07:42:02.970-03:00  INFO 3584945 --- [           main] [55da4534-0d9d-4fee-b3c4-896d6845bb9b] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/contacts/{id} 404 6ms userId=5 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactSchemaIT' -Dsurefire.sk` - exit 0

```
2026-11-25T07:42:24.750-03:00  INFO 3585970 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Registered tools: 11
2026-11-25T07:42:24.750-03:00  INFO 3585970 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable resources capabilities, notification: true
2026-11-25T07:42:24.752-03:00  INFO 3585970 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable resources templates capabilities, notification: true
2026-11-25T07:42:24.753-03:00  INFO 3585970 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable prompts capabilities, notification: true
2026-11-25T07:42:24.754-03:00  INFO 3585970 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable completions capabilities
2026-11-25T07:42:24.893-03:00  INFO 3585970 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-25T07:42:24.893-03:00  INFO 3585970 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-25T07:42:24.895-03:00  INFO 3585970 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 2 ms
2026-11-25T07:42:24.957-03:00  INFO 3585970 --- [           main] [] com.lcs.findraco.plan.ContactSchemaIT    : Started ContactSchemaIT in 9.706 seconds (process running for 10.86)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactSharesIT#splitsWithCont` - exit 0

```
2026-11-25T07:42:49.566-03:00  WARN 3586415 --- [           main] [b0904bf9-6100-4e24-89d6-3a0603493ce0] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List)
2026-11-25T07:42:49.566-03:00  WARN 3586415 --- [           main] [b0904bf9-6100-4e24-89d6-3a0603493ce0] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List)
2026-11-25T07:42:49.566-03:00  WARN 3586415 --- [           main] [b0904bf9-6100-4e24-89d6-3a0603493ce0] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List)
2026-11-25T07:42:49.566-03:00  WARN 3586415 --- [           main] [b0904bf9-6100-4e24-89d6-3a0603493ce0] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#participants()
2026-11-25T07:42:49.566-03:00  WARN 3586415 --- [           main] [b0904bf9-6100-4e24-89d6-3a0603493ce0] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-25T07:42:49.707-03:00  INFO 3586415 --- [           main] [b0904bf9-6100-4e24-89d6-3a0603493ce0] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 260ms userId=1 planId=1
2026-11-25T07:42:49.786-03:00  INFO 3586415 --- [           main] [2d620e7d-7ce3-47d7-855d-2a09f18a8ce9] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 19ms userId=1 planId=1
2026-11-25T07:42:49.805-03:00  INFO 3586415 --- [           main] [ec66e9cb-65c2-4b8f-8e73-407a56fb45aa] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 16ms userId=1 planId=1
2026-11-25T07:42:49.830-03:00  INFO 3586415 --- [           main] [626eafae-4b7e-4df3-b093-d86b7462c71e] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 19ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactSharesIT#contactSharesL` - exit 0

```
2026-11-25T07:43:12.266-03:00  WARN 3586870 --- [           main] [10a2d954-e00e-45a8-8199-cea60d1d6dc2] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List)
2026-11-25T07:43:12.266-03:00  WARN 3586870 --- [           main] [10a2d954-e00e-45a8-8199-cea60d1d6dc2] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List)
2026-11-25T07:43:12.266-03:00  WARN 3586870 --- [           main] [10a2d954-e00e-45a8-8199-cea60d1d6dc2] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-25T07:43:12.266-03:00  WARN 3586870 --- [           main] [10a2d954-e00e-45a8-8199-cea60d1d6dc2] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#allocations()
2026-11-25T07:43:12.266-03:00  WARN 3586870 --- [           main] [10a2d954-e00e-45a8-8199-cea60d1d6dc2] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#items()
2026-11-25T07:43:12.413-03:00  INFO 3586870 --- [           main] [10a2d954-e00e-45a8-8199-cea60d1d6dc2] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 260ms userId=1 planId=1
2026-11-25T07:43:12.516-03:00  INFO 3586870 --- [           main] [33716184-9893-4286-be5c-68c88bf72bff] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/dashboard 200 91ms userId=1 planId=1
2026-11-25T07:43:12.591-03:00  INFO 3586870 --- [           main] [5826e00c-edc7-4e33-89e0-b92ac600ff13] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/dashboard/trend 200 20ms userId=1 planId=1
2026-11-25T07:43:12.626-03:00  INFO 3586870 --- [           main] [b464c86e-c3cd-4363-89e1-995ea466fd46] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/dashboard 200 27ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactSharesIT#contactSharesL` - exit 0

```
2026-11-25T07:43:34.752-03:00  WARN 3587363 --- [           main] [106d66d8-0e9f-41e0-8725-714221c63f71] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#participants()
2026-11-25T07:43:34.752-03:00  WARN 3587363 --- [           main] [106d66d8-0e9f-41e0-8725-714221c63f71] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-25T07:43:34.753-03:00  WARN 3587363 --- [           main] [106d66d8-0e9f-41e0-8725-714221c63f71] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#items()
2026-11-25T07:43:34.753-03:00  WARN 3587363 --- [           main] [106d66d8-0e9f-41e0-8725-714221c63f71] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#com.lcs.findraco.transaction.request.UpdateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List, Long)
2026-11-25T07:43:34.753-03:00  WARN 3587363 --- [           main] [106d66d8-0e9f-41e0-8725-714221c63f71] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#com.lcs.findraco.transaction.request.UpdateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List, Long)
2026-11-25T07:43:34.753-03:00  WARN 3587363 --- [           main] [106d66d8-0e9f-41e0-8725-714221c63f71] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#com.lcs.findraco.transaction.request.UpdateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List, Long)
2026-11-25T07:43:34.753-03:00  WARN 3587363 --- [           main] [106d66d8-0e9f-41e0-8725-714221c63f71] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#allocations()
2026-11-25T07:43:34.815-03:00  INFO 3587363 --- [           main] [106d66d8-0e9f-41e0-8725-714221c63f71] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/{id} 200 76ms userId=1 planId=1
2026-11-25T07:43:34.846-03:00  INFO 3587363 --- [           main] [3890a1b6-3380-4b02-a451-68b35e09e2a2] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/category/spending 200 29ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactSharesIT#contactSharesO` - exit 0

```
2026-11-25T07:43:57.446-03:00  INFO 3587845 --- [           main] [c05300bb-6ca3-4f52-bbd5-91569c338f19] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/{id} 422 11ms userId=1 planId=1
2026-11-25T07:43:57.459-03:00  INFO 3587845 --- [           main] [957906fa-e716-4374-8a2c-86ab357a2019] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 11ms userId=1 planId=1
2026-11-25T07:43:57.477-03:00  INFO 3587845 --- [           main] [f4a1e058-ed82-4e20-b2da-11778579ea0b] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/{id} 422 16ms userId=1 planId=1
2026-11-25T07:43:57.490-03:00  INFO 3587845 --- [           main] [07891f7c-8a29-42c1-9681-afbefb8bf902] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 11ms userId=1 planId=1
2026-11-25T07:43:57.507-03:00  INFO 3587845 --- [           main] [e4319b18-ffdb-4b96-9879-712f31c02e63] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/{id} 422 15ms userId=1 planId=1
2026-11-25T07:43:57.566-03:00  WARN 3587845 --- [           main] [d683ec20-af04-435d-8c70-f938861a32fc] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-25T07:43:57.567-03:00  WARN 3587845 --- [           main] [d683ec20-af04-435d-8c70-f938861a32fc] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-25T07:43:57.567-03:00  WARN 3587845 --- [           main] [d683ec20-af04-435d-8c70-f938861a32fc] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-25T07:43:57.575-03:00  INFO 3587845 --- [           main] [d683ec20-af04-435d-8c70-f938861a32fc] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 422 18ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactSharesIT#archivedOrFore` - exit 0

```
2026-11-25T07:44:19.255-03:00  WARN 3588293 --- [           main] [0dab05eb-d2c1-466c-8824-a481987d9147] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#items()
2026-11-25T07:44:19.255-03:00  WARN 3588293 --- [           main] [0dab05eb-d2c1-466c-8824-a481987d9147] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#participants()
2026-11-25T07:44:19.284-03:00  INFO 3588293 --- [           main] [0dab05eb-d2c1-466c-8824-a481987d9147] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 65ms userId=1 planId=1
2026-11-25T07:44:19.323-03:00  INFO 3588293 --- [           main] [472282da-2721-4cba-bc2a-ea08d7492f4f] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 404 15ms userId=1 planId=1
2026-11-25T07:44:19.336-03:00  WARN 3588293 --- [           main] [ecd5cab2-b82d-4d8d-882f-19b92e1797ec] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-25T07:44:19.336-03:00  WARN 3588293 --- [           main] [ecd5cab2-b82d-4d8d-882f-19b92e1797ec] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-25T07:44:19.336-03:00  WARN 3588293 --- [           main] [ecd5cab2-b82d-4d8d-882f-19b92e1797ec] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-25T07:44:19.344-03:00  INFO 3588293 --- [           main] [ecd5cab2-b82d-4d8d-882f-19b92e1797ec] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 422 19ms userId=1 planId=1
2026-11-25T07:44:19.355-03:00  INFO 3588293 --- [           main] [2dcc20c8-e518-43cc-8c33-d6fddfc6a2eb] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 404 9ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactSharesIT#onlyOwnerAndEd` - exit 0

```
2026-11-25T07:44:41.570-03:00  WARN 3588755 --- [           main] [c57cc755-6471-4c89-b815-fd559c710b2a] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#participants()
2026-11-25T07:44:41.570-03:00  WARN 3588755 --- [           main] [c57cc755-6471-4c89-b815-fd559c710b2a] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-25T07:44:41.570-03:00  WARN 3588755 --- [           main] [c57cc755-6471-4c89-b815-fd559c710b2a] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#items()
2026-11-25T07:44:41.570-03:00  WARN 3588755 --- [           main] [c57cc755-6471-4c89-b815-fd559c710b2a] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#com.lcs.findraco.transaction.request.UpdateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List, Long)
2026-11-25T07:44:41.570-03:00  WARN 3588755 --- [           main] [c57cc755-6471-4c89-b815-fd559c710b2a] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#com.lcs.findraco.transaction.request.UpdateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List, Long)
2026-11-25T07:44:41.571-03:00  WARN 3588755 --- [           main] [c57cc755-6471-4c89-b815-fd559c710b2a] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#com.lcs.findraco.transaction.request.UpdateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List, Long)
2026-11-25T07:44:41.571-03:00  WARN 3588755 --- [           main] [c57cc755-6471-4c89-b815-fd559c710b2a] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: allocations
2026-11-25T07:44:41.597-03:00  INFO 3588755 --- [           main] [c57cc755-6471-4c89-b815-fd559c710b2a] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/{id} 403 40ms userId=3 planId=1
2026-11-25T07:44:41.626-03:00  INFO 3588755 --- [           main] [22e372ca-750c-49e2-bef4-c93df033611c] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 26ms userId=2 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactSharesIT#seriesCarryCon` - exit 0

```
2026-11-25T07:45:02.824-03:00  INFO 3589216 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 2 ms
2026-11-25T07:45:02.880-03:00  INFO 3589216 --- [           main] [] c.l.f.transaction.ContactSharesIT        : Started ContactSharesIT in 9.313 seconds (process running for 10.655)
2026-11-25T07:45:03.451-03:00  WARN 3589216 --- [           main] [0440eef5-757e-46e9-883b-c6d3db0fdc68] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-25T07:45:03.454-03:00  WARN 3589216 --- [           main] [0440eef5-757e-46e9-883b-c6d3db0fdc68] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-25T07:45:03.455-03:00  WARN 3589216 --- [           main] [0440eef5-757e-46e9-883b-c6d3db0fdc68] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-25T07:45:03.632-03:00  INFO 3589216 --- [           main] [0440eef5-757e-46e9-883b-c6d3db0fdc68] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 291ms userId=1 planId=1
2026-11-25T07:45:03.738-03:00  INFO 3589216 --- [           main] [4a7a9e19-2519-41be-96ae-8f8b8a389775] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 29ms userId=1 planId=1
2026-11-25T07:45:03.798-03:00  INFO 3589216 --- [           main] [49c41039-f426-4cd5-b846-d7cccf6e364a] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/{id}/confirm 200 57ms userId=1 planId=1
2026-11-25T07:45:03.895-03:00  INFO 3589216 --- [           main] [645f6eb8-7595-49eb-81c3-29279286ac4a] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 92ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='RepaymentsIT#repaymentCountsIn` - exit 0

```
2026-11-25T07:45:25.479-03:00  WARN 3589674 --- [           main] [fa978419-4679-4290-9466-292ef2d068ce] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-25T07:45:25.479-03:00  WARN 3589674 --- [           main] [fa978419-4679-4290-9466-292ef2d068ce] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#items()
2026-11-25T07:45:25.479-03:00  WARN 3589674 --- [           main] [fa978419-4679-4290-9466-292ef2d068ce] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#allocations()
2026-11-25T07:45:25.479-03:00  WARN 3589674 --- [           main] [fa978419-4679-4290-9466-292ef2d068ce] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-25T07:45:25.644-03:00  INFO 3589674 --- [           main] [fa978419-4679-4290-9466-292ef2d068ce] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 276ms userId=1 planId=1
2026-11-25T07:45:25.767-03:00  INFO 3589674 --- [           main] [c1d2b3bb-4f00-424f-a945-2e6ec7dcb0a4] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/dashboard 200 72ms userId=1 planId=1
2026-11-25T07:45:25.796-03:00  INFO 3589674 --- [           main] [6052ed22-b47d-4c88-8c73-9c4570d084d1] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/dashboard/trend 200 21ms userId=1 planId=1
2026-11-25T07:45:25.872-03:00  INFO 3589674 --- [           main] [13a37d40-6a1f-47b4-b70d-5e314bd2cb13] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction 200 74ms userId=1 planId=1
2026-11-25T07:45:25.902-03:00  INFO 3589674 --- [           main] [c61e3ade-2914-4b43-a32a-c427727e59ac] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction 200 29ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='RepaymentsIT#storesExplicitAll` - exit 0

```
2026-11-25T07:45:47.580-03:00  WARN 3590134 --- [           main] [8f3dbd80-d63e-4eb9-a0c4-4fafa7926923] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#participants()
2026-11-25T07:45:47.580-03:00  WARN 3590134 --- [           main] [8f3dbd80-d63e-4eb9-a0c4-4fafa7926923] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#allocations()
2026-11-25T07:45:47.580-03:00  WARN 3590134 --- [           main] [8f3dbd80-d63e-4eb9-a0c4-4fafa7926923] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#items()
2026-11-25T07:45:47.580-03:00  WARN 3590134 --- [           main] [8f3dbd80-d63e-4eb9-a0c4-4fafa7926923] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-25T07:45:47.580-03:00  WARN 3590134 --- [           main] [8f3dbd80-d63e-4eb9-a0c4-4fafa7926923] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-25T07:45:47.763-03:00  INFO 3590134 --- [           main] [8f3dbd80-d63e-4eb9-a0c4-4fafa7926923] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 293ms userId=1 planId=1
2026-11-25T07:45:47.867-03:00  INFO 3590134 --- [           main] [216ab10c-4956-4bdd-99ee-060167997b99] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 32ms userId=1 planId=1
2026-11-25T07:45:47.908-03:00  INFO 3590134 --- [           main] [4c733a8d-b536-41be-b7ff-6ab1b56f4200] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 32ms userId=1 planId=1
2026-11-25T07:45:47.926-03:00  INFO 3590134 --- [           main] [f9da6892-cd71-42cc-b86b-d20c1f0a619a] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 15ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='RepaymentsIT#omittedAllocation` - exit 0

```
2026-11-25T07:46:09.271-03:00  WARN 3590627 --- [           main] [82ce8abe-1e98-4b71-83d6-836910f02e18] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: allocations
2026-11-25T07:46:09.271-03:00  WARN 3590627 --- [           main] [82ce8abe-1e98-4b71-83d6-836910f02e18] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-25T07:46:09.271-03:00  WARN 3590627 --- [           main] [82ce8abe-1e98-4b71-83d6-836910f02e18] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#allocations()
2026-11-25T07:46:09.442-03:00  INFO 3590627 --- [           main] [82ce8abe-1e98-4b71-83d6-836910f02e18] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 286ms userId=1 planId=1
2026-11-25T07:46:09.543-03:00  INFO 3590627 --- [           main] [e38d8682-13eb-4a72-9442-cdf3c340511b] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 32ms userId=1 planId=1
2026-11-25T07:46:09.610-03:00  INFO 3590627 --- [           main] [70b67aaa-b40e-4460-8c4b-c68cfec90156] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 52ms userId=1 planId=1
2026-11-25T07:46:09.631-03:00  INFO 3590627 --- [           main] [8529ed01-8b2e-4f91-a09c-e671796328ca] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 16ms userId=1 planId=1
2026-11-25T07:46:09.667-03:00  INFO 3590627 --- [           main] [1651a13f-79cb-416f-94f4-6a750859481c] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 34ms userId=1 planId=1
2026-11-25T07:46:09.683-03:00  INFO 3590627 --- [           main] [a3778875-1780-4972-8600-eeb06d928e79] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 12ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='RepaymentsIT#allocationLimitsA` - exit 0

```
2026-11-25T07:46:31.124-03:00  WARN 3591127 --- [           main] [ff9c404d-8262-4e2d-8d14-3e3723f77abc] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-25T07:46:31.305-03:00  INFO 3591127 --- [           main] [ff9c404d-8262-4e2d-8d14-3e3723f77abc] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 292ms userId=1 planId=1
2026-11-25T07:46:31.359-03:00  INFO 3591127 --- [           main] [137ad0d6-aa13-48f1-a549-8c229d63a97c] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 40ms userId=1 planId=1
2026-11-25T07:46:31.417-03:00  INFO 3591127 --- [           main] [352c3498-b5ee-4f97-a53d-fb487173ce2d] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 30ms userId=1 planId=1
2026-11-25T07:46:31.439-03:00  INFO 3591127 --- [           main] [c208ffea-837f-4239-8f8c-a958067269db] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 20ms userId=1 planId=1
2026-11-25T07:46:31.461-03:00  INFO 3591127 --- [           main] [37e93dcd-ecac-4023-9272-7b8c4fedeee4] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 20ms userId=1 planId=1
2026-11-25T07:46:31.487-03:00  INFO 3591127 --- [           main] [c73a33ea-e1d0-4fae-9eae-7c98bffdf323] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 24ms userId=1 planId=1
2026-11-25T07:46:31.572-03:00  INFO 3591127 --- [           main] [b109aea7-9198-4498-8157-878a7171da44] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 25ms userId=1 planId=1
2026-11-25T07:46:31.600-03:00  INFO 3591127 --- [           main] [6c474e75-61d5-4ae1-bab8-8752495574a4] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 27ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='RepaymentsIT#concurrentRepayme` - exit 0

```
2026-11-25T07:46:53.661-03:00  INFO 3591594 --- [pool-3-thread-2] [da0ca067-ee3c-4718-af53-1cd556c4f7f0] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 349ms userId=1 planId=1
2026-11-25T07:46:53.753-03:00  INFO 3591594 --- [pool-3-thread-2] [8df25fd6-a325-4490-b1de-e5d64601fe78] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 31ms userId=1 planId=1
2026-11-25T07:46:53.769-03:00  INFO 3591594 --- [pool-3-thread-1] [20aacc96-dcf5-423e-99dc-e1ccfe7c5dce] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 47ms userId=1 planId=1
2026-11-25T07:46:53.815-03:00  INFO 3591594 --- [pool-3-thread-2] [7e1392c7-2d3e-48bc-8535-c7ca61668c5e] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 36ms userId=1 planId=1
2026-11-25T07:46:53.831-03:00  INFO 3591594 --- [pool-3-thread-1] [49af17b7-77dc-48f4-8f60-6ffcb0177d80] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 52ms userId=1 planId=1
2026-11-25T07:46:53.869-03:00  INFO 3591594 --- [pool-3-thread-1] [fb60b877-86ad-44c9-ada3-7a9c98a8c11c] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 27ms userId=1 planId=1
2026-11-25T07:46:53.884-03:00  INFO 3591594 --- [pool-3-thread-2] [6c3eedb8-6f29-4ebd-b7e6-19d190a8e831] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 41ms userId=1 planId=1
2026-11-25T07:46:53.919-03:00  INFO 3591594 --- [pool-3-thread-2] [3fe504d5-931c-4381-ad6d-41e91841d05c] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 25ms userId=1 planId=1
2026-11-25T07:46:53.931-03:00  INFO 3591594 --- [pool-3-thread-1] [6a0d7321-5ddc-4bb9-a259-9eec89b1b1e1] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 37ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='RepaymentsIT#editReplacesAndTr` - exit 0

```
2026-11-25T07:47:16.629-03:00  INFO 3592087 --- [           main] [ffc4e8ba-b9aa-4387-91cf-01a189404527] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts/{id}/statement 200 42ms userId=1 planId=1
2026-11-25T07:47:16.651-03:00  INFO 3592087 --- [           main] [e23d37c1-8be1-41dc-8fb9-89ca880149c6] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 20ms userId=1 planId=1
2026-11-25T07:47:16.673-03:00  INFO 3592087 --- [           main] [b8b8372b-db04-441d-9b23-d60b87b469c8] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/{id} 200 17ms userId=1 planId=1
2026-11-25T07:47:16.694-03:00  INFO 3592087 --- [           main] [a42d4621-53ac-40f4-afe0-0ad7fd3b6a15] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts/{id}/statement 200 20ms userId=1 planId=1
2026-11-25T07:47:16.719-03:00  INFO 3592087 --- [           main] [4597099d-b7e8-407c-aa43-a16e3cdfc532] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts/{id}/statement 200 23ms userId=1 planId=1
2026-11-25T07:47:16.736-03:00  INFO 3592087 --- [           main] [e877918b-c2e8-4085-bcff-8a02c351250e] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 14ms userId=1 planId=1
2026-11-25T07:47:16.794-03:00  INFO 3592087 --- [           main] [ae8a561c-3c92-4190-8d5f-2e974c843090] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 200 54ms userId=1 planId=1
2026-11-25T07:47:16.815-03:00  INFO 3592087 --- [           main] [511a2f8b-b2f2-462c-960f-712bfa287e56] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts/{id}/statement 200 20ms userId=1 planId=1
2026-11-25T07:47:16.830-03:00  INFO 3592087 --- [           main] [d841b85d-5e4b-46f0-9063-f09c7c25a6f8] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 13ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='RepaymentsIT#reducingAShareCut` - exit 0

```
2026-11-25T07:47:39.456-03:00  INFO 3592549 --- [           main] [00470f8e-2aa1-400c-a456-c9457a4d10f4] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/{id} 200 30ms userId=1 planId=1
2026-11-25T07:47:39.475-03:00  INFO 3592549 --- [           main] [a341b87f-0136-45d0-bbed-4ed1dc496c40] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 15ms userId=1 planId=1
2026-11-25T07:47:39.509-03:00  INFO 3592549 --- [           main] [2c40e652-563b-48d0-b95f-27b62a9d8b05] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 27ms userId=1 planId=1
2026-11-25T07:47:39.523-03:00  INFO 3592549 --- [           main] [edcbce55-2960-4835-8d31-0a58d31be51f] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/{id} 200 12ms userId=1 planId=1
2026-11-25T07:47:39.550-03:00  INFO 3592549 --- [           main] [4fdda023-6025-44a0-af11-fd1486b1bc4f] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts/{id}/statement 200 25ms userId=1 planId=1
2026-11-25T07:47:39.569-03:00  INFO 3592549 --- [           main] [3906ac4c-a070-4b54-b62c-72310bc95cf9] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 15ms userId=1 planId=1
2026-11-25T07:47:39.622-03:00  INFO 3592549 --- [           main] [a5545370-5616-4b88-b06b-a53792fadc15] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 200 49ms userId=1 planId=1
2026-11-25T07:47:39.645-03:00  INFO 3592549 --- [           main] [ceab3278-a4b5-42cc-8d11-6d9f68a0918e] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts/{id}/statement 200 21ms userId=1 planId=1
2026-11-25T07:47:39.662-03:00  INFO 3592549 --- [           main] [619c80ab-aac5-4e55-b41a-f581581c63b8] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 14ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactStatementIT#groupsByMon` - exit 0

```
2026-11-25T07:48:01.012-03:00  WARN 3593052 --- [           main] [d07660ec-9fa7-4910-9d21-cd6405743a4f] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-25T07:48:01.013-03:00  WARN 3593052 --- [           main] [d07660ec-9fa7-4910-9d21-cd6405743a4f] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#allocations()
2026-11-25T07:48:01.013-03:00  WARN 3593052 --- [           main] [d07660ec-9fa7-4910-9d21-cd6405743a4f] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List)
2026-11-25T07:48:01.013-03:00  WARN 3593052 --- [           main] [d07660ec-9fa7-4910-9d21-cd6405743a4f] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List)
2026-11-25T07:48:01.013-03:00  WARN 3593052 --- [           main] [d07660ec-9fa7-4910-9d21-cd6405743a4f] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List)
2026-11-25T07:48:01.013-03:00  WARN 3593052 --- [           main] [d07660ec-9fa7-4910-9d21-cd6405743a4f] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-25T07:48:01.186-03:00  INFO 3593052 --- [           main] [d07660ec-9fa7-4910-9d21-cd6405743a4f] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 312ms userId=1 planId=1
2026-11-25T07:48:01.224-03:00  INFO 3593052 --- [           main] [05e84342-9e9d-493f-a2b2-d6150a93a81e] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 31ms userId=1 planId=1
2026-11-25T07:48:01.276-03:00  INFO 3593052 --- [           main] [690af7ae-06eb-4de8-8377-8f9873dc2ace] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts/{id}/statement 200 44ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactStatementIT#balanceLeav` - exit 0

```
2026-11-25T07:48:22.604-03:00  WARN 3593509 --- [           main] [57b8999d-bd41-46c3-aec0-f3068c09476a] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-25T07:48:22.604-03:00  WARN 3593509 --- [           main] [57b8999d-bd41-46c3-aec0-f3068c09476a] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-25T07:48:22.604-03:00  WARN 3593509 --- [           main] [57b8999d-bd41-46c3-aec0-f3068c09476a] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#allocations()
2026-11-25T07:48:22.605-03:00  WARN 3593509 --- [           main] [57b8999d-bd41-46c3-aec0-f3068c09476a] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#participants()
2026-11-25T07:48:22.775-03:00  INFO 3593509 --- [           main] [57b8999d-bd41-46c3-aec0-f3068c09476a] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 291ms userId=1 planId=1
2026-11-25T07:48:22.830-03:00  INFO 3593509 --- [           main] [08bfb55a-e010-454e-a441-b1f964b67404] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts/{id}/statement 200 50ms userId=1 planId=1
2026-11-25T07:48:22.923-03:00  INFO 3593509 --- [           main] [9a249812-9297-4506-a5aa-d466f03032e3] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 38ms userId=1 planId=1
2026-11-25T07:48:22.948-03:00  INFO 3593509 --- [           main] [dc336c75-2c9f-4abd-8b1b-a4ae261e5ac4] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts/{id}/statement 200 23ms userId=1 planId=1
2026-11-25T07:48:22.969-03:00  INFO 3593509 --- [           main] [3ca7028e-f727-4ddf-8720-fe00d3f4c96a] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 19ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactStatementIT#trashedRows` - exit 0

```
2026-11-25T07:48:44.942-03:00  INFO 3593970 --- [           main] [1766bf96-ad3f-44aa-bf3d-6e702a63c6a2] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 307ms userId=1 planId=1
2026-11-25T07:48:44.978-03:00  INFO 3593970 --- [           main] [a1e396e7-8ab7-42df-8e3f-4474733c0063] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/{id} 200 25ms userId=1 planId=1
2026-11-25T07:48:45.019-03:00  INFO 3593970 --- [           main] [fb21be1b-3c3e-4216-b77e-3b00b360bbe1] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts/{id}/statement 200 39ms userId=1 planId=1
2026-11-25T07:48:45.142-03:00  INFO 3593970 --- [           main] [6bf65de9-01bc-4904-93b2-eb5f8817c53f] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 200 68ms userId=1 planId=1
2026-11-25T07:48:45.164-03:00  INFO 3593970 --- [           main] [3c02bd40-7509-4871-9ef4-202269a21f48] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts/{id}/statement 200 21ms userId=1 planId=1
2026-11-25T07:48:45.183-03:00  INFO 3593970 --- [           main] [372c68d2-73e0-4678-9e59-934003ef556e] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/{id} 200 16ms userId=1 planId=1
2026-11-25T07:48:45.218-03:00  INFO 3593970 --- [           main] [4c7e9472-a3ac-4977-a08d-4391ccafe052] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts/{id}/statement 200 33ms userId=1 planId=1
2026-11-25T07:48:45.262-03:00  INFO 3593970 --- [           main] [6b8fa8f1-049a-4e83-8d23-1294ff505240] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 200 38ms userId=1 planId=1
2026-11-25T07:48:45.286-03:00  INFO 3593970 --- [           main] [d70f996e-408b-4a03-a623-b73fec274e54] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts/{id}/statement 200 21ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpContactsIT#attributedToReso` - exit 0

```
2026-11-25T07:49:07.346-03:00  INFO 3594438 --- [           main] [304e9833-98fa-4433-926c-5b707c59b28a] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 256ms userId=- planId=-
2026-11-25T07:49:07.389-03:00  INFO 3594438 --- [           main] [9481f371-4f28-4713-b2a6-227db61b7682] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=create_transaction user=1 plan=1 outcome=ok durationMs=38
2026-11-25T07:49:07.389-03:00  INFO 3594438 --- [           main] [9481f371-4f28-4713-b2a6-227db61b7682] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 41ms userId=- planId=-
2026-11-25T07:49:07.462-03:00  INFO 3594438 --- [           main] [ebc3f20a-265f-4965-8628-f0a6c2c40655] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=create_transaction user=1 plan=1 outcome=error durationMs=18
2026-11-25T07:49:07.462-03:00  INFO 3594438 --- [           main] [ebc3f20a-265f-4965-8628-f0a6c2c40655] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 22ms userId=- planId=-
2026-11-25T07:49:07.496-03:00  INFO 3594438 --- [           main] [532c1755-f079-423b-b525-e0cf7e97c203] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=create_transaction user=1 plan=1 outcome=error durationMs=15
2026-11-25T07:49:07.496-03:00  INFO 3594438 --- [           main] [532c1755-f079-423b-b525-e0cf7e97c203] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 18ms userId=- planId=-
2026-11-25T07:49:07.515-03:00  INFO 3594438 --- [           main] [11e023f5-58f2-4237-b119-0faf929cb8f2] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=create_transaction user=1 plan=1 outcome=error durationMs=15
2026-11-25T07:49:07.515-03:00  INFO 3594438 --- [           main] [11e023f5-58f2-4237-b119-0faf929cb8f2] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 18ms userId=- planId=-
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpContactsIT#repaymentApplies` - exit 0

```
2026-11-25T07:49:29.572-03:00  WARN 3594963 --- [           main] [d9597c52-0cec-4924-b009-48f0ed086c2e] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: allocations
2026-11-25T07:49:29.572-03:00  WARN 3594963 --- [           main] [d9597c52-0cec-4924-b009-48f0ed086c2e] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#participants()
2026-11-25T07:49:29.572-03:00  WARN 3594963 --- [           main] [d9597c52-0cec-4924-b009-48f0ed086c2e] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List)
2026-11-25T07:49:29.572-03:00  WARN 3594963 --- [           main] [d9597c52-0cec-4924-b009-48f0ed086c2e] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List)
2026-11-25T07:49:29.572-03:00  WARN 3594963 --- [           main] [d9597c52-0cec-4924-b009-48f0ed086c2e] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List)
2026-11-25T07:49:29.656-03:00  INFO 3594963 --- [           main] [d9597c52-0cec-4924-b009-48f0ed086c2e] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=create_transaction user=1 plan=1 outcome=ok durationMs=244
2026-11-25T07:49:29.670-03:00  INFO 3594963 --- [           main] [d9597c52-0cec-4924-b009-48f0ed086c2e] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 283ms userId=- planId=-
2026-11-25T07:49:29.787-03:00  INFO 3594963 --- [           main] [ec86afbc-9a56-4a1a-8a36-1f818f703042] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=create_transaction user=1 plan=1 outcome=ok durationMs=58
2026-11-25T07:49:29.788-03:00  INFO 3594963 --- [           main] [ec86afbc-9a56-4a1a-8a36-1f818f703042] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 62ms userId=- planId=-
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpContactsIT#listsContactsAnd` - exit 0

```
2026-11-25T07:49:51.831-03:00  WARN 3595426 --- [           main] [f40fd532-fd0d-490a-9686-11dacbf7f1e7] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#allocations()
2026-11-25T07:49:51.831-03:00  WARN 3595426 --- [           main] [f40fd532-fd0d-490a-9686-11dacbf7f1e7] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-25T07:49:51.831-03:00  WARN 3595426 --- [           main] [f40fd532-fd0d-490a-9686-11dacbf7f1e7] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#participants()
2026-11-25T07:49:51.931-03:00  INFO 3595426 --- [           main] [f40fd532-fd0d-490a-9686-11dacbf7f1e7] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=create_transaction user=1 plan=1 outcome=ok durationMs=253
2026-11-25T07:49:51.945-03:00  INFO 3595426 --- [           main] [f40fd532-fd0d-490a-9686-11dacbf7f1e7] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 291ms userId=- planId=-
2026-11-25T07:49:51.968-03:00  INFO 3595426 --- [           main] [4fb0ec77-bc12-4980-be12-b602299c4599] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=list_contacts user=1 plan=1 outcome=ok durationMs=19
2026-11-25T07:49:51.969-03:00  INFO 3595426 --- [           main] [4fb0ec77-bc12-4980-be12-b602299c4599] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 22ms userId=- planId=-
2026-11-25T07:49:52.080-03:00  INFO 3595426 --- [           main] [6f134645-5c27-47d4-9c14-300fcdd49165] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=list_transactions user=1 plan=1 outcome=ok durationMs=56
2026-11-25T07:49:52.080-03:00  INFO 3595426 --- [           main] [6f134645-5c27-47d4-9c14-300fcdd49165] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 61ms userId=- planId=-
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='OpenApiSnapshotIT' -Dsurefire.` - exit 0

```
2026-11-25T07:50:13.378-03:00  INFO 3595902 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable resources templates capabilities, notification: true
2026-11-25T07:50:13.379-03:00  INFO 3595902 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable prompts capabilities, notification: true
2026-11-25T07:50:13.380-03:00  INFO 3595902 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable completions capabilities
2026-11-25T07:50:13.508-03:00  INFO 3595902 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-25T07:50:13.508-03:00  INFO 3595902 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-25T07:50:13.509-03:00  INFO 3595902 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-25T07:50:13.564-03:00  INFO 3595902 --- [           main] [] c.lcs.findraco.shared.OpenApiSnapshotIT  : Started OpenApiSnapshotIT in 9.295 seconds (process running for 10.649)
2026-11-25T07:50:14.568-03:00  INFO 3595902 --- [           main] [ba7e7b36-4362-4b53-b569-59e469dc5327] o.springdoc.api.AbstractOpenApiResource  : Init duration for springdoc-openapi is: 648 ms
2026-11-25T07:50:14.611-03:00  INFO 3595902 --- [           main] [ba7e7b36-4362-4b53-b569-59e469dc5327] c.l.f.shared.web.RequestLogFilter        : GET /v3/api-docs 200 719ms userId=- planId=-
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='RepaymentsIT#aSettledPurchaseM` - exit 0

```
2026-11-25T07:50:36.790-03:00  WARN 3596404 --- [           main] [15f10382-4fe6-415b-b596-731c501fb906] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-25T07:50:36.790-03:00  WARN 3596404 --- [           main] [15f10382-4fe6-415b-b596-731c501fb906] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: allocations
2026-11-25T07:50:36.790-03:00  WARN 3596404 --- [           main] [15f10382-4fe6-415b-b596-731c501fb906] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#com.lcs.findraco.transaction.request.UpdateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List, Long)
2026-11-25T07:50:36.790-03:00  WARN 3596404 --- [           main] [15f10382-4fe6-415b-b596-731c501fb906] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#com.lcs.findraco.transaction.request.UpdateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List, Long)
2026-11-25T07:50:36.791-03:00  WARN 3596404 --- [           main] [15f10382-4fe6-415b-b596-731c501fb906] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#com.lcs.findraco.transaction.request.UpdateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List, Long)
2026-11-25T07:50:36.791-03:00  WARN 3596404 --- [           main] [15f10382-4fe6-415b-b596-731c501fb906] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#participants()
2026-11-25T07:50:36.841-03:00  INFO 3596404 --- [           main] [15f10382-4fe6-415b-b596-731c501fb906] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/{id} 200 68ms userId=1 planId=1
2026-11-25T07:50:36.899-03:00  INFO 3596404 --- [           main] [7c856674-7a2f-48d1-8441-ee54fa6622bf] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts/{id}/statement 200 34ms userId=1 planId=1
2026-11-25T07:50:36.924-03:00  INFO 3596404 --- [           main] [fe07d8ba-0e04-4ce9-a4e0-713152e679d5] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 19ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='RepaymentsIT#editingAPaymentWh` - exit 0

```
2026-11-25T07:50:59.674-03:00  INFO 3596878 --- [           main] [780f981e-8a37-4a61-8358-7040d33f9c07] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/{id} 200 48ms userId=1 planId=1
2026-11-25T07:50:59.786-03:00  INFO 3596878 --- [           main] [2122c7ad-0e0b-4dad-aa4d-6b54cda44a37] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 200 57ms userId=1 planId=1
2026-11-25T07:50:59.839-03:00  INFO 3596878 --- [           main] [2c450778-cea8-47bc-83c6-9966db1b77f2] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts/{id}/statement 200 51ms userId=1 planId=1
2026-11-25T07:50:59.869-03:00  INFO 3596878 --- [           main] [bd55acdb-a6a4-439a-b6f9-1c71653ff27e] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 26ms userId=1 planId=1
2026-11-25T07:50:59.920-03:00  INFO 3596878 --- [           main] [cb61976a-689b-49f1-ba64-d71db4ea4d6c] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 39ms userId=1 planId=1
2026-11-25T07:50:59.939-03:00  INFO 3596878 --- [           main] [05fa875a-d6f2-4013-b89e-54c21b2b0e8f] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/{id} 200 17ms userId=1 planId=1
2026-11-25T07:50:59.980-03:00  INFO 3596878 --- [           main] [0d26a8fe-d1ae-404c-81c2-f650d80d0a06] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/{id} 200 38ms userId=1 planId=1
2026-11-25T07:51:00.013-03:00  INFO 3596878 --- [           main] [013a4214-dd26-4985-85e5-620e194d0c40] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 200 31ms userId=1 planId=1
2026-11-25T07:51:00.037-03:00  INFO 3596878 --- [           main] [51035be9-81fc-4c86-bdc3-6a66548c3064] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts/{id}/statement 200 21ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactSharesIT#markingAContac` - exit 0

```
2026-11-25T07:51:23.001-03:00  WARN 3597352 --- [           main] [a3b18a67-4487-4606-b784-e3326bc8eed7] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#items()
2026-11-25T07:51:23.002-03:00  WARN 3597352 --- [           main] [a3b18a67-4487-4606-b784-e3326bc8eed7] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#participants()
2026-11-25T07:51:23.002-03:00  WARN 3597352 --- [           main] [a3b18a67-4487-4606-b784-e3326bc8eed7] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: allocations
2026-11-25T07:51:23.160-03:00  INFO 3597352 --- [           main] [a3b18a67-4487-4606-b784-e3326bc8eed7] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 279ms userId=1 planId=1
2026-11-25T07:51:23.217-03:00  INFO 3597352 --- [           main] [36682dad-35cb-497c-a4a3-f98dcf9e6255] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/{id}/kind 422 43ms userId=1 planId=1
2026-11-25T07:51:23.261-03:00  INFO 3597352 --- [           main] [461320e5-19ce-4608-a242-8c71f52d43f5] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/{id}/kind 422 16ms userId=1 planId=1
2026-11-25T07:51:23.276-03:00  INFO 3597352 --- [           main] [67476bb0-c36b-4504-b682-0c889f90538f] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/{id}/kind 422 13ms userId=1 planId=1
2026-11-25T07:51:23.293-03:00  INFO 3597352 --- [           main] [1c8502d8-c5d6-44de-b049-8411ea139132] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/{id}/kind 422 14ms userId=1 planId=1
2026-11-25T07:51:23.313-03:00  INFO 3597352 --- [           main] [fb354f6b-8769-43db-a06b-8ce8484d4c2d] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/{id} 200 18ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactsIT#refusesArchiveWithP` - exit 0

```
2026-11-25T07:51:47.699-03:00  INFO 3597846 --- [           main] [d371daa6-3b21-46e5-8fe9-a4f3b84a4df1] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts/{id}/archive 409 41ms userId=1 planId=1
2026-11-25T07:51:47.744-03:00  INFO 3597846 --- [           main] [c9734c58-1cb3-4dd4-9d5a-706089f29b80] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts/{id}/archive 409 21ms userId=1 planId=1
2026-11-25T07:51:47.764-03:00  INFO 3597846 --- [           main] [b3f97dc5-1bb6-4b0b-b225-435af054dad5] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 18ms userId=1 planId=1
2026-11-25T07:51:47.836-03:00  INFO 3597846 --- [           main] [b1d7b787-ce6e-4666-a0ef-f6afd784d13b] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts/{id}/archive 200 23ms userId=1 planId=1
2026-11-25T07:51:47.897-03:00  INFO 3597846 --- [           main] [2022602e-318b-4d67-9e44-bad22ac276e1] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 59ms userId=1 planId=1
2026-11-25T07:51:47.924-03:00  INFO 3597846 --- [           main] [605cd169-a427-48b6-897b-d988b0ffb6ad] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts/{id}/archive 200 23ms userId=1 planId=1
2026-11-25T07:51:47.941-03:00  INFO 3597846 --- [           main] [c8e3d7d9-b73b-4a58-9e3c-2e6d561f252e] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/{id} 200 15ms userId=1 planId=1
2026-11-25T07:51:47.959-03:00  INFO 3597846 --- [           main] [928153f7-fcd9-4b7f-a05b-e6a30c07d71c] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts/{id}/archive 200 16ms userId=1 planId=1
2026-11-25T07:51:47.971-03:00  INFO 3597846 --- [           main] [19470d4e-3ac9-4492-9c4f-3261c6817494] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 11ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
```
