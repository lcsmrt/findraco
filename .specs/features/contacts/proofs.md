# contacts proofs

**HEAD**: 0312a850
**Tree**: clean
**Shell**: /bin/sh
**Result**: 73 pass, 0 fail

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
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer contacts > offers a plan of one member the split when it has a contact 69ms
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer contacts > offers no contact to a contributor 38ms
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer repayment > turns an income into a contact payment 473ms
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer repayment > gives the payment one receiving member whatever split came before, and lets the user choose who 512ms
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer repayment > shows the excess as credit 378ms
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer repayment > keeps what the user ticked when the amount changes afterwards 387ms
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer repayment > loads the allocations of the payment being edited 76ms
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer repayment > offers no contact payment to a contributor 116ms

 Test Files  3 passed (3)
      Tests  69 passed (69)
   Start at  02:18:14
   Duration  13.32s (transform 503ms, setup 315ms, collect 6.39s, tests 11.69s, environment 1.13s, prepare 121ms)

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
   Start at  02:18:29
   Duration  2.42s (transform 121ms, setup 204ms, collect 1.81s, tests 23ms, environment 696ms, prepare 78ms)

No story files found for the specified pattern: src/**/*.mdx
```

`Run table` - exit 0

```
Creating Table Instance...

 ✓ |unit| src/features/transactions/TransactionsPage.test.tsx > TransactionsPage period navigator (PNAV-01, PNAV-02) > replaces a custom range with the This month preset (PNAV-03 AC 1) 258ms
stdout | src/features/transactions/TransactionsPage.test.tsx > TransactionsPage period navigator (PNAV-01, PNAV-02) > ignores the pre-feature from and to params and opens on the current month (PNAV-05)
Creating Table Instance...

 ✓ |unit| src/features/transactions/TransactionsPage.test.tsx > TransactionsPage period navigator (PNAV-01, PNAV-02) > keeps the period when all filters are cleared (PNAV-02 AC 4) 122ms
 ✓ |unit| src/features/transactions/TransactionsPage.test.tsx > TransactionsPage period navigator (PNAV-01, PNAV-02) > ignores the pre-feature from and to params and opens on the current month (PNAV-05) 26ms

 Test Files  2 passed (2)
      Tests  53 passed (53)
   Start at  02:18:34
   Duration  13.32s (transform 705ms, setup 174ms, collect 3.17s, tests 9.53s, environment 697ms, prepare 86ms)

No story files found for the specified pattern: src/**/*.mdx
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactsIT#createsTrimsAndBoun` - exit 0

```
2026-11-25T02:19:09.521-03:00  INFO 3493080 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-25T02:19:09.577-03:00  INFO 3493080 --- [           main] [] com.lcs.findraco.plan.ContactsIT         : Started ContactsIT in 11.782 seconds (process running for 12.983)
2026-11-25T02:19:10.336-03:00  INFO 3493080 --- [           main] [525c1f6a-2941-49dc-87d1-b13847d3db64] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts 201 237ms userId=1 planId=1
2026-11-25T02:19:10.424-03:00  INFO 3493080 --- [           main] [cba87ccc-b0d1-4334-93be-c9d940403c32] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts 201 17ms userId=1 planId=1
2026-11-25T02:19:10.443-03:00  INFO 3493080 --- [           main] [cd922dd6-94a4-449c-97ac-b29d4c9fe3a5] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts 422 17ms userId=1 planId=1
2026-11-25T02:19:10.480-03:00  INFO 3493080 --- [           main] [87095dfd-5348-4f33-94d1-d039039cd40f] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts 422 5ms userId=1 planId=1
2026-11-25T02:19:10.487-03:00  INFO 3493080 --- [           main] [00ef9e33-36e1-4c41-a0cd-4c8c7833ebcc] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts 422 5ms userId=1 planId=1
2026-11-25T02:19:10.506-03:00  INFO 3493080 --- [           main] [810d9446-7d43-4422-b09b-5a4d5c441b32] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts 201 17ms userId=1 planId=1
2026-11-25T02:19:10.529-03:00  INFO 3493080 --- [           main] [0af719ab-e197-481a-8ec2-be3314858a1b] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 21ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactsIT#rejectsADuplicateAc` - exit 0

```
2026-11-25T02:19:31.258-03:00  INFO 3493535 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-25T02:19:31.258-03:00  INFO 3493535 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-25T02:19:31.259-03:00  INFO 3493535 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-25T02:19:31.315-03:00  INFO 3493535 --- [           main] [] com.lcs.findraco.plan.ContactsIT         : Started ContactsIT in 9.592 seconds (process running for 10.85)
2026-11-25T02:19:32.017-03:00  INFO 3493535 --- [           main] [d693b72f-870c-441f-a5e9-592b087e886d] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts 422 225ms userId=1 planId=1
2026-11-25T02:19:32.137-03:00  INFO 3493535 --- [           main] [653e408d-eaae-4915-8f9c-d4b5cc1a5e68] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts 201 34ms userId=1 planId=2
2026-11-25T02:19:32.160-03:00  INFO 3493535 --- [           main] [455062b7-e551-4eb1-9bf9-1302efdfd1cd] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts 201 13ms userId=1 planId=1
2026-11-25T02:19:32.193-03:00  INFO 3493535 --- [           main] [f723cb4c-787c-4433-9830-12498b87c407] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts/{id}/archive 200 31ms userId=1 planId=1
2026-11-25T02:19:32.211-03:00  INFO 3493535 --- [           main] [26ff5317-3249-4b5a-a1b5-3b3dabf99ad2] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts 201 16ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactsIT#renameReachesTheSha` - exit 0

```
2026-11-25T02:19:52.853-03:00  INFO 3494009 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-25T02:19:52.854-03:00  INFO 3494009 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-25T02:19:52.855-03:00  INFO 3494009 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-25T02:19:52.921-03:00  INFO 3494009 --- [           main] [] com.lcs.findraco.plan.ContactsIT         : Started ContactsIT in 9.891 seconds (process running for 11.124)
2026-11-25T02:19:53.649-03:00  INFO 3494009 --- [           main] [7ac23e8e-1827-4b1f-9cdd-2112b0ac6e4e] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/contacts/{id} 200 232ms userId=1 planId=1
2026-11-25T02:19:53.750-03:00  INFO 3494009 --- [           main] [3afadfaf-f1f1-4d85-aa52-3043e0b34342] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/{id} 200 41ms userId=1 planId=1
2026-11-25T02:19:53.771-03:00  INFO 3494009 --- [           main] [982786a8-4760-4e90-a2d0-c9b9ffa2a80c] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/contacts/{id} 409 19ms userId=1 planId=1
2026-11-25T02:19:53.825-03:00  INFO 3494009 --- [           main] [c45212d6-727a-4444-8c4c-2723fec40c26] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 26ms userId=1 planId=1
2026-11-25T02:19:53.846-03:00  INFO 3494009 --- [           main] [37b3b03d-bbb9-4ae9-b178-6ad89b77b03b] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/contacts/{id} 422 10ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactsIT#listsActiveContacts` - exit 0

```
2026-11-25T02:20:16.176-03:00  INFO 3494458 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable prompts capabilities, notification: true
2026-11-25T02:20:16.178-03:00  INFO 3494458 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable completions capabilities
2026-11-25T02:20:16.314-03:00  INFO 3494458 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-25T02:20:16.315-03:00  INFO 3494458 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-25T02:20:16.316-03:00  INFO 3494458 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-25T02:20:16.372-03:00  INFO 3494458 --- [           main] [] com.lcs.findraco.plan.ContactsIT         : Started ContactsIT in 10.987 seconds (process running for 12.234)
2026-11-25T02:20:17.109-03:00  INFO 3494458 --- [           main] [0b20ae9d-8fe5-443c-bd18-94cd210908e5] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts/{id}/archive 200 221ms userId=1 planId=1
2026-11-25T02:20:17.166-03:00  INFO 3494458 --- [           main] [ca781a81-b92e-4b71-96f6-9d2124287f1a] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 42ms userId=1 planId=1
2026-11-25T02:20:17.242-03:00  INFO 3494458 --- [           main] [1055fe94-50c6-47da-b190-ff6a8fd7793f] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 16ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactsIT#archivesOnlyAtZeroB` - exit 0

```
2026-11-25T02:20:38.656-03:00  WARN 3494895 --- [           main] [1764dd05-bdf2-41cc-8be5-4ea3466d2435] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: allocations
2026-11-25T02:20:38.656-03:00  WARN 3494895 --- [           main] [1764dd05-bdf2-41cc-8be5-4ea3466d2435] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#allocations()
2026-11-25T02:20:38.656-03:00  WARN 3494895 --- [           main] [1764dd05-bdf2-41cc-8be5-4ea3466d2435] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#items()
2026-11-25T02:20:38.657-03:00  WARN 3494895 --- [           main] [1764dd05-bdf2-41cc-8be5-4ea3466d2435] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List)
2026-11-25T02:20:38.657-03:00  WARN 3494895 --- [           main] [1764dd05-bdf2-41cc-8be5-4ea3466d2435] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List)
2026-11-25T02:20:38.657-03:00  WARN 3494895 --- [           main] [1764dd05-bdf2-41cc-8be5-4ea3466d2435] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List)
2026-11-25T02:20:38.657-03:00  WARN 3494895 --- [           main] [1764dd05-bdf2-41cc-8be5-4ea3466d2435] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-25T02:20:38.657-03:00  WARN 3494895 --- [           main] [1764dd05-bdf2-41cc-8be5-4ea3466d2435] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#participants()
2026-11-25T02:20:38.679-03:00  INFO 3494895 --- [           main] [1764dd05-bdf2-41cc-8be5-4ea3466d2435] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 50ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactsIT#unarchiveRestoresUn` - exit 0

```
2026-11-25T02:20:59.360-03:00  INFO 3495331 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-25T02:20:59.418-03:00  INFO 3495331 --- [           main] [] com.lcs.findraco.plan.ContactsIT         : Started ContactsIT in 9.41 seconds (process running for 10.596)
2026-11-25T02:21:00.147-03:00  INFO 3495331 --- [           main] [efaa1f8b-bf7b-4751-9fd4-eeb9a13e5047] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts/{id}/archive 200 250ms userId=1 planId=1
2026-11-25T02:21:00.178-03:00  INFO 3495331 --- [           main] [3616e9f6-02d7-4d8d-9dff-b3b4e7fe5a8f] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts/{id}/archive 200 23ms userId=1 planId=1
2026-11-25T02:21:00.217-03:00  INFO 3495331 --- [           main] [5f922f9d-528b-427b-90c4-9093578affc8] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts 201 35ms userId=1 planId=1
2026-11-25T02:21:00.239-03:00  INFO 3495331 --- [           main] [6fbe2afc-9cbe-443f-bb1b-2f5624c69bea] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts/{id}/unarchive 422 20ms userId=1 planId=1
2026-11-25T02:21:00.293-03:00  INFO 3495331 --- [           main] [0cecb673-8e62-40cd-8b54-d201ee4a3ae4] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 24ms userId=1 planId=1
2026-11-25T02:21:00.380-03:00  INFO 3495331 --- [           main] [b3ad643e-9648-4092-aa5c-93f4efb5114d] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts/{id}/unarchive 200 18ms userId=1 planId=1
2026-11-25T02:21:00.396-03:00  INFO 3495331 --- [           main] [7fb6b772-a64c-46e8-aa2c-76bf3011e249] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 14ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactsIT#deletesOnlyAnUnused` - exit 0

```
2026-11-25T02:21:21.803-03:00  INFO 3495772 --- [           main] [2b9bb01f-493a-4787-9d99-c425a7484f14] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 286ms userId=1 planId=1
2026-11-25T02:21:21.835-03:00  INFO 3495772 --- [           main] [eb195bf1-df07-49a8-8121-c71850e0c590] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/{id} 200 26ms userId=1 planId=1
2026-11-25T02:21:21.863-03:00  INFO 3495772 --- [           main] [9860d6b4-472f-4592-9d30-ac58c7dd62b3] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/contacts/{id} 409 25ms userId=1 planId=1
2026-11-25T02:21:21.899-03:00  INFO 3495772 --- [           main] [585b6f66-93b9-45d7-8e26-52159cd874c0] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/contacts/{id} 409 11ms userId=1 planId=1
2026-11-25T02:21:21.913-03:00  INFO 3495772 --- [           main] [4f53e8b6-867c-4ddc-adb0-56f24dd4e50b] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/contacts/{id} 409 12ms userId=1 planId=1
2026-11-25T02:21:21.923-03:00  INFO 3495772 --- [           main] [ee5cedce-517c-4933-82b7-761e787271b3] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/contacts/{id} 409 9ms userId=1 planId=1
2026-11-25T02:21:21.961-03:00  INFO 3495772 --- [           main] [2b5679a5-9cec-4f19-83b4-bb18887ca676] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 36ms userId=1 planId=1
2026-11-25T02:21:22.059-03:00  INFO 3495772 --- [           main] [98906c4b-7309-405e-b685-a7ee32cf3599] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/contacts/{id} 204 29ms userId=1 planId=1
2026-11-25T02:21:22.074-03:00  INFO 3495772 --- [           main] [984ab271-17b7-4de6-b89d-53aab1e450dc] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 13ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactRoleMatrixIT' -Dsurefir` - exit 0

```
2026-11-25T02:21:46.341-03:00  INFO 3496218 --- [           main] [39bdaf02-7345-49e5-a89e-a07216d637c4] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts/{id}/unarchive 200 11ms userId=2 planId=1
2026-11-25T02:21:46.405-03:00  INFO 3496218 --- [           main] [0e9881e7-f6a6-40ba-9363-7b86227b4931] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts/{id}/unarchive 403 6ms userId=3 planId=1
2026-11-25T02:21:46.469-03:00  INFO 3496218 --- [           main] [5fad5985-4cfe-4d75-ab71-52549aefd6cf] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts/{id}/unarchive 403 5ms userId=4 planId=1
2026-11-25T02:21:46.531-03:00  INFO 3496218 --- [           main] [8dc54768-00c6-4aed-89a6-280247f8535b] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts/{id}/unarchive 404 5ms userId=5 planId=1
2026-11-25T02:21:46.610-03:00  INFO 3496218 --- [           main] [82f18215-3547-4da5-ba69-0296f3459736] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/contacts/{id} 204 24ms userId=1 planId=1
2026-11-25T02:21:46.687-03:00  INFO 3496218 --- [           main] [5c0e3445-916a-4d5a-84db-9bc4942040d9] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/contacts/{id} 204 15ms userId=2 planId=1
2026-11-25T02:21:46.756-03:00  INFO 3496218 --- [           main] [02cd9acc-e414-432b-bac7-77e9a0449214] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/contacts/{id} 403 8ms userId=3 planId=1
2026-11-25T02:21:46.824-03:00  INFO 3496218 --- [           main] [0ed5f416-04cc-4e03-8997-8c2c98a069af] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/contacts/{id} 403 7ms userId=4 planId=1
2026-11-25T02:21:46.884-03:00  INFO 3496218 --- [           main] [71a2b436-7dd3-46d4-a69b-68fd6c885ef8] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/contacts/{id} 404 5ms userId=5 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactSchemaIT' -Dsurefire.sk` - exit 0

```
2026-11-25T02:22:06.527-03:00  INFO 3496722 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Registered tools: 11
2026-11-25T02:22:06.527-03:00  INFO 3496722 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable resources capabilities, notification: true
2026-11-25T02:22:06.528-03:00  INFO 3496722 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable resources templates capabilities, notification: true
2026-11-25T02:22:06.529-03:00  INFO 3496722 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable prompts capabilities, notification: true
2026-11-25T02:22:06.530-03:00  INFO 3496722 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable completions capabilities
2026-11-25T02:22:06.666-03:00  INFO 3496722 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-25T02:22:06.666-03:00  INFO 3496722 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-25T02:22:06.667-03:00  INFO 3496722 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-25T02:22:06.723-03:00  INFO 3496722 --- [           main] [] com.lcs.findraco.plan.ContactSchemaIT    : Started ContactSchemaIT in 9.427 seconds (process running for 10.514)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactSharesIT#splitsWithCont` - exit 0

```
2026-11-25T02:22:28.517-03:00  WARN 3497153 --- [           main] [c4f3b6c1-27e1-487c-80ff-fb888fa79832] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#allocations()
2026-11-25T02:22:28.517-03:00  WARN 3497153 --- [           main] [c4f3b6c1-27e1-487c-80ff-fb888fa79832] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: allocations
2026-11-25T02:22:28.517-03:00  WARN 3497153 --- [           main] [c4f3b6c1-27e1-487c-80ff-fb888fa79832] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List)
2026-11-25T02:22:28.517-03:00  WARN 3497153 --- [           main] [c4f3b6c1-27e1-487c-80ff-fb888fa79832] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List)
2026-11-25T02:22:28.517-03:00  WARN 3497153 --- [           main] [c4f3b6c1-27e1-487c-80ff-fb888fa79832] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List)
2026-11-25T02:22:28.671-03:00  INFO 3497153 --- [           main] [c4f3b6c1-27e1-487c-80ff-fb888fa79832] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 263ms userId=1 planId=1
2026-11-25T02:22:28.747-03:00  INFO 3497153 --- [           main] [2a0d8507-2044-48f9-a41f-d301145215fd] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 19ms userId=1 planId=1
2026-11-25T02:22:28.764-03:00  INFO 3497153 --- [           main] [e3fb5cad-59c8-43ee-ad1a-7f04099f3acb] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 14ms userId=1 planId=1
2026-11-25T02:22:28.795-03:00  INFO 3497153 --- [           main] [b1930a4b-01a7-4ffd-b5c2-120f54a23bb7] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 24ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactSharesIT#contactSharesL` - exit 0

```
2026-11-25T02:22:49.512-03:00  WARN 3497642 --- [           main] [5ee91f31-64c0-4386-8138-f13ddf57c108] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-25T02:22:49.513-03:00  WARN 3497642 --- [           main] [5ee91f31-64c0-4386-8138-f13ddf57c108] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List)
2026-11-25T02:22:49.513-03:00  WARN 3497642 --- [           main] [5ee91f31-64c0-4386-8138-f13ddf57c108] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List)
2026-11-25T02:22:49.513-03:00  WARN 3497642 --- [           main] [5ee91f31-64c0-4386-8138-f13ddf57c108] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List)
2026-11-25T02:22:49.513-03:00  WARN 3497642 --- [           main] [5ee91f31-64c0-4386-8138-f13ddf57c108] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#items()
2026-11-25T02:22:49.652-03:00  INFO 3497642 --- [           main] [5ee91f31-64c0-4386-8138-f13ddf57c108] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 273ms userId=1 planId=1
2026-11-25T02:22:49.748-03:00  INFO 3497642 --- [           main] [e4889fa3-9b6d-4b89-8fbd-33da2f157830] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/dashboard 200 85ms userId=1 planId=1
2026-11-25T02:22:49.825-03:00  INFO 3497642 --- [           main] [24127749-3734-4825-97f3-1176ef9d2ad9] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/dashboard/trend 200 23ms userId=1 planId=1
2026-11-25T02:22:49.861-03:00  INFO 3497642 --- [           main] [54a312c2-317a-4ef8-ae9c-d52b6491f563] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/dashboard 200 27ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactSharesIT#contactSharesL` - exit 0

```
2026-11-25T02:23:11.070-03:00  WARN 3498090 --- [           main] [4619bc19-bd95-453f-bbe3-71f453af8bb6] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#com.lcs.findraco.transaction.request.UpdateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List, Long)
2026-11-25T02:23:11.071-03:00  WARN 3498090 --- [           main] [4619bc19-bd95-453f-bbe3-71f453af8bb6] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#com.lcs.findraco.transaction.request.UpdateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List, Long)
2026-11-25T02:23:11.071-03:00  WARN 3498090 --- [           main] [4619bc19-bd95-453f-bbe3-71f453af8bb6] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#com.lcs.findraco.transaction.request.UpdateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List, Long)
2026-11-25T02:23:11.071-03:00  WARN 3498090 --- [           main] [4619bc19-bd95-453f-bbe3-71f453af8bb6] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#items()
2026-11-25T02:23:11.071-03:00  WARN 3498090 --- [           main] [4619bc19-bd95-453f-bbe3-71f453af8bb6] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-25T02:23:11.072-03:00  WARN 3498090 --- [           main] [4619bc19-bd95-453f-bbe3-71f453af8bb6] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#participants()
2026-11-25T02:23:11.072-03:00  WARN 3498090 --- [           main] [4619bc19-bd95-453f-bbe3-71f453af8bb6] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-25T02:23:11.125-03:00  INFO 3498090 --- [           main] [4619bc19-bd95-453f-bbe3-71f453af8bb6] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/{id} 200 73ms userId=1 planId=1
2026-11-25T02:23:11.155-03:00  INFO 3498090 --- [           main] [d1b2eb4a-87c4-4e5b-b2a9-ccc0d16949eb] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/category/spending 200 28ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactSharesIT#contactSharesO` - exit 0

```
2026-11-25T02:23:32.461-03:00  INFO 3498529 --- [           main] [d1627f3b-ce48-40ce-b9f3-9ab899869c0a] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/{id} 422 15ms userId=1 planId=1
2026-11-25T02:23:32.475-03:00  INFO 3498529 --- [           main] [3fd1f839-5bf3-4fc7-9f0c-baae81ed515a] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 11ms userId=1 planId=1
2026-11-25T02:23:32.491-03:00  INFO 3498529 --- [           main] [fa80203d-ead4-4536-9079-f3e8180f158f] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/{id} 422 14ms userId=1 planId=1
2026-11-25T02:23:32.500-03:00  INFO 3498529 --- [           main] [af7d0a29-bf15-49e3-9a56-6c28df0dffa7] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 8ms userId=1 planId=1
2026-11-25T02:23:32.516-03:00  INFO 3498529 --- [           main] [ec2d8919-68fd-45d4-bc23-a93707546fcc] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/{id} 422 14ms userId=1 planId=1
2026-11-25T02:23:32.592-03:00  WARN 3498529 --- [           main] [08339db6-3cee-4000-bd84-aa9882c5620a] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-25T02:23:32.592-03:00  WARN 3498529 --- [           main] [08339db6-3cee-4000-bd84-aa9882c5620a] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-25T02:23:32.593-03:00  WARN 3498529 --- [           main] [08339db6-3cee-4000-bd84-aa9882c5620a] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-25T02:23:32.601-03:00  INFO 3498529 --- [           main] [08339db6-3cee-4000-bd84-aa9882c5620a] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 422 19ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactSharesIT#archivedOrFore` - exit 0

```
2026-11-25T02:23:53.824-03:00  WARN 3498987 --- [           main] [8651c999-8a57-4ef4-84dc-7b32d3859214] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List)
2026-11-25T02:23:53.824-03:00  WARN 3498987 --- [           main] [8651c999-8a57-4ef4-84dc-7b32d3859214] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-25T02:23:53.853-03:00  INFO 3498987 --- [           main] [8651c999-8a57-4ef4-84dc-7b32d3859214] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 66ms userId=1 planId=1
2026-11-25T02:23:53.892-03:00  INFO 3498987 --- [           main] [1e885e10-c203-41d2-adf0-c50a23fa9ca7] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 404 11ms userId=1 planId=1
2026-11-25T02:23:53.902-03:00  WARN 3498987 --- [           main] [0fd95c19-fc1d-4f7c-991b-75ffac2f327a] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-25T02:23:53.903-03:00  WARN 3498987 --- [           main] [0fd95c19-fc1d-4f7c-991b-75ffac2f327a] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-25T02:23:53.903-03:00  WARN 3498987 --- [           main] [0fd95c19-fc1d-4f7c-991b-75ffac2f327a] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-25T02:23:53.911-03:00  INFO 3498987 --- [           main] [0fd95c19-fc1d-4f7c-991b-75ffac2f327a] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 422 17ms userId=1 planId=1
2026-11-25T02:23:53.922-03:00  INFO 3498987 --- [           main] [f75e9a5a-f791-4cec-aaf9-ead04cac2f89] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 404 9ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactSharesIT#onlyOwnerAndEd` - exit 0

```
2026-11-25T02:24:15.070-03:00  WARN 3499461 --- [           main] [ff160927-c583-4d9a-8db4-0afc9d7b1a3a] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#com.lcs.findraco.transaction.request.UpdateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List, Long)
2026-11-25T02:24:15.070-03:00  WARN 3499461 --- [           main] [ff160927-c583-4d9a-8db4-0afc9d7b1a3a] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#com.lcs.findraco.transaction.request.UpdateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List, Long)
2026-11-25T02:24:15.070-03:00  WARN 3499461 --- [           main] [ff160927-c583-4d9a-8db4-0afc9d7b1a3a] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#com.lcs.findraco.transaction.request.UpdateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List, Long)
2026-11-25T02:24:15.071-03:00  WARN 3499461 --- [           main] [ff160927-c583-4d9a-8db4-0afc9d7b1a3a] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#participants()
2026-11-25T02:24:15.071-03:00  WARN 3499461 --- [           main] [ff160927-c583-4d9a-8db4-0afc9d7b1a3a] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#items()
2026-11-25T02:24:15.071-03:00  WARN 3499461 --- [           main] [ff160927-c583-4d9a-8db4-0afc9d7b1a3a] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-25T02:24:15.071-03:00  WARN 3499461 --- [           main] [ff160927-c583-4d9a-8db4-0afc9d7b1a3a] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: allocations
2026-11-25T02:24:15.096-03:00  INFO 3499461 --- [           main] [ff160927-c583-4d9a-8db4-0afc9d7b1a3a] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/{id} 403 40ms userId=3 planId=1
2026-11-25T02:24:15.121-03:00  INFO 3499461 --- [           main] [1bc3be4e-c274-4956-a159-c3c334454a11] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 22ms userId=2 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactSharesIT#seriesCarryCon` - exit 0

```
2026-11-25T02:24:35.092-03:00  INFO 3499906 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 2 ms
2026-11-25T02:24:35.147-03:00  INFO 3499906 --- [           main] [] c.l.f.transaction.ContactSharesIT        : Started ContactSharesIT in 9.061 seconds (process running for 10.227)
2026-11-25T02:24:35.742-03:00  WARN 3499906 --- [           main] [158e1288-9ab3-47d4-8ac3-57acad48500f] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-25T02:24:35.746-03:00  WARN 3499906 --- [           main] [158e1288-9ab3-47d4-8ac3-57acad48500f] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-25T02:24:35.746-03:00  WARN 3499906 --- [           main] [158e1288-9ab3-47d4-8ac3-57acad48500f] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-25T02:24:35.916-03:00  INFO 3499906 --- [           main] [158e1288-9ab3-47d4-8ac3-57acad48500f] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 293ms userId=1 planId=1
2026-11-25T02:24:36.014-03:00  INFO 3499906 --- [           main] [7382ef2e-9a2f-49a0-a498-ced68f227e96] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 30ms userId=1 planId=1
2026-11-25T02:24:36.079-03:00  INFO 3499906 --- [           main] [af63ced3-0f38-4437-aaed-12c393116018] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/{id}/confirm 200 62ms userId=1 planId=1
2026-11-25T02:24:36.183-03:00  INFO 3499906 --- [           main] [8a8cb8d6-5836-4848-bbca-b09010252bb8] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 99ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='RepaymentsIT#repaymentCountsIn` - exit 0

```
2026-11-25T02:24:57.445-03:00  WARN 3500388 --- [           main] [748121a4-435a-492b-94ff-b4ab14d50fa2] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#items()
2026-11-25T02:24:57.445-03:00  WARN 3500388 --- [           main] [748121a4-435a-492b-94ff-b4ab14d50fa2] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: allocations
2026-11-25T02:24:57.445-03:00  WARN 3500388 --- [           main] [748121a4-435a-492b-94ff-b4ab14d50fa2] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-25T02:24:57.445-03:00  WARN 3500388 --- [           main] [748121a4-435a-492b-94ff-b4ab14d50fa2] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#allocations()
2026-11-25T02:24:57.591-03:00  INFO 3500388 --- [           main] [748121a4-435a-492b-94ff-b4ab14d50fa2] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 284ms userId=1 planId=1
2026-11-25T02:24:57.734-03:00  INFO 3500388 --- [           main] [4dad7c19-3d87-4254-be0c-144cae0951d4] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/dashboard 200 85ms userId=1 planId=1
2026-11-25T02:24:57.763-03:00  INFO 3500388 --- [           main] [eca3f3c2-9ae8-4001-a495-2098c61e3ea2] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/dashboard/trend 200 20ms userId=1 planId=1
2026-11-25T02:24:57.850-03:00  INFO 3500388 --- [           main] [0350a262-c508-431b-ab02-f29bda612df9] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction 200 85ms userId=1 planId=1
2026-11-25T02:24:57.885-03:00  INFO 3500388 --- [           main] [8061d249-937b-423c-abea-3d4bc85ded69] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction 200 33ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='RepaymentsIT#storesExplicitAll` - exit 0

```
2026-11-25T02:25:19.110-03:00  WARN 3500838 --- [           main] [c8488ebe-e68d-446a-8328-ad816813a505] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List)
2026-11-25T02:25:19.111-03:00  WARN 3500838 --- [           main] [c8488ebe-e68d-446a-8328-ad816813a505] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#participants()
2026-11-25T02:25:19.111-03:00  WARN 3500838 --- [           main] [c8488ebe-e68d-446a-8328-ad816813a505] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#allocations()
2026-11-25T02:25:19.111-03:00  WARN 3500838 --- [           main] [c8488ebe-e68d-446a-8328-ad816813a505] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: allocations
2026-11-25T02:25:19.111-03:00  WARN 3500838 --- [           main] [c8488ebe-e68d-446a-8328-ad816813a505] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-25T02:25:19.279-03:00  INFO 3500838 --- [           main] [c8488ebe-e68d-446a-8328-ad816813a505] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 283ms userId=1 planId=1
2026-11-25T02:25:19.397-03:00  INFO 3500838 --- [           main] [7ba3bc68-f300-46f5-8678-2cc48087007b] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 32ms userId=1 planId=1
2026-11-25T02:25:19.438-03:00  INFO 3500838 --- [           main] [a68a6574-a2c4-47a9-b055-d7a7e40d3c7e] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 33ms userId=1 planId=1
2026-11-25T02:25:19.457-03:00  INFO 3500838 --- [           main] [fe7331fb-d4e3-4250-ba24-6d5fa1bf6616] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 13ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='RepaymentsIT#omittedAllocation` - exit 0

```
2026-11-25T02:25:40.475-03:00  WARN 3501283 --- [           main] [bd37a1d9-f7c6-4778-94f5-44754662d7b1] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List)
2026-11-25T02:25:40.476-03:00  WARN 3501283 --- [           main] [bd37a1d9-f7c6-4778-94f5-44754662d7b1] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List)
2026-11-25T02:25:40.476-03:00  WARN 3501283 --- [           main] [bd37a1d9-f7c6-4778-94f5-44754662d7b1] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List)
2026-11-25T02:25:40.654-03:00  INFO 3501283 --- [           main] [bd37a1d9-f7c6-4778-94f5-44754662d7b1] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 297ms userId=1 planId=1
2026-11-25T02:25:40.755-03:00  INFO 3501283 --- [           main] [3a4a58cc-88c3-4d44-98b7-1a099150845d] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 30ms userId=1 planId=1
2026-11-25T02:25:40.788-03:00  INFO 3501283 --- [           main] [4449145a-c7dc-4d49-95c3-76e0e078edce] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 28ms userId=1 planId=1
2026-11-25T02:25:40.802-03:00  INFO 3501283 --- [           main] [2d2e3130-833d-4ae5-92d4-604d895a512c] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 10ms userId=1 planId=1
2026-11-25T02:25:40.828-03:00  INFO 3501283 --- [           main] [32c33263-4a41-4891-a607-a42361d8675a] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 24ms userId=1 planId=1
2026-11-25T02:25:40.841-03:00  INFO 3501283 --- [           main] [d923af67-7dd9-460d-ab03-f872fcc13ccb] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 10ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='RepaymentsIT#allocationLimitsA` - exit 0

```
2026-11-25T02:26:01.853-03:00  WARN 3501733 --- [           main] [3fc5ca8b-875e-4804-a5ad-cbeecbff5da8] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-25T02:26:02.030-03:00  INFO 3501733 --- [           main] [3fc5ca8b-875e-4804-a5ad-cbeecbff5da8] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 299ms userId=1 planId=1
2026-11-25T02:26:02.071-03:00  INFO 3501733 --- [           main] [f615c2d8-be22-442a-b138-98459ca5d2fe] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 28ms userId=1 planId=1
2026-11-25T02:26:02.141-03:00  INFO 3501733 --- [           main] [24f95735-e666-43de-a365-9b3bb2c72412] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 34ms userId=1 planId=1
2026-11-25T02:26:02.169-03:00  INFO 3501733 --- [           main] [3df2171e-b7a8-463f-978c-3cabf928d6f5] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 25ms userId=1 planId=1
2026-11-25T02:26:02.193-03:00  INFO 3501733 --- [           main] [0240e5a5-92fd-488e-972d-3db3a7a05dbd] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 23ms userId=1 planId=1
2026-11-25T02:26:02.219-03:00  INFO 3501733 --- [           main] [1cecd009-a063-4499-8031-f70c1d2d6ec7] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 24ms userId=1 planId=1
2026-11-25T02:26:02.294-03:00  INFO 3501733 --- [           main] [89cf8c34-1463-451c-afda-822cdb7e6f0d] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 25ms userId=1 planId=1
2026-11-25T02:26:02.329-03:00  INFO 3501733 --- [           main] [aef73453-a3d3-4932-9b3e-c9331580576c] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 32ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='RepaymentsIT#concurrentRepayme` - exit 0

```
2026-11-25T02:26:23.361-03:00  INFO 3502199 --- [pool-3-thread-2] [9cf6c3f9-446e-4ef2-b1d9-e0dd05c85246] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 334ms userId=1 planId=1
2026-11-25T02:26:23.456-03:00  INFO 3502199 --- [pool-3-thread-2] [e018777f-0163-4594-a180-788dc061edc1] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 28ms userId=1 planId=1
2026-11-25T02:26:23.468-03:00  INFO 3502199 --- [pool-3-thread-1] [d0964640-b803-40ad-9bb6-ddb3298edbde] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 40ms userId=1 planId=1
2026-11-25T02:26:23.509-03:00  INFO 3502199 --- [pool-3-thread-2] [d0cdc062-66f8-4659-9ee2-d25318ba2322] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 30ms userId=1 planId=1
2026-11-25T02:26:23.523-03:00  INFO 3502199 --- [pool-3-thread-1] [bac13f73-5b42-40ed-be8b-16fcdf1cc83c] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 43ms userId=1 planId=1
2026-11-25T02:26:23.565-03:00  INFO 3502199 --- [pool-3-thread-1] [5647f65d-4be9-40ad-9884-87ff745017d4] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 30ms userId=1 planId=1
2026-11-25T02:26:23.582-03:00  INFO 3502199 --- [pool-3-thread-2] [d4720d1c-2f28-45d8-9459-aff08ce190cd] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 47ms userId=1 planId=1
2026-11-25T02:26:23.619-03:00  INFO 3502199 --- [pool-3-thread-1] [5baef3b7-160f-458c-8e5d-29fa27d4d5fc] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 25ms userId=1 planId=1
2026-11-25T02:26:23.631-03:00  INFO 3502199 --- [pool-3-thread-2] [2bcf61d1-0a8e-4937-8b63-55ba594e6722] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 37ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='RepaymentsIT#editReplacesAndTr` - exit 0

```
2026-11-25T02:26:44.871-03:00  INFO 3502647 --- [           main] [c1945d1c-3d07-4a26-8080-1565490c34c0] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts/{id}/statement 200 40ms userId=1 planId=1
2026-11-25T02:26:44.898-03:00  INFO 3502647 --- [           main] [39a90779-250a-433e-8347-58f6fb0f588b] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 25ms userId=1 planId=1
2026-11-25T02:26:44.923-03:00  INFO 3502647 --- [           main] [9f162eed-fc0b-4f1b-a71c-3760c0c15978] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/{id} 200 20ms userId=1 planId=1
2026-11-25T02:26:44.943-03:00  INFO 3502647 --- [           main] [769cd521-8c16-4e5a-8338-3ecbe642c905] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts/{id}/statement 200 18ms userId=1 planId=1
2026-11-25T02:26:44.963-03:00  INFO 3502647 --- [           main] [5a05c851-9af6-451b-9166-8f9f9cb1999c] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts/{id}/statement 200 19ms userId=1 planId=1
2026-11-25T02:26:44.977-03:00  INFO 3502647 --- [           main] [8d50ee9e-7d77-42b8-870f-892f89bfa4fc] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 12ms userId=1 planId=1
2026-11-25T02:26:45.022-03:00  INFO 3502647 --- [           main] [efe7a71e-f6ae-4e6a-b747-a8b5d585acf4] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 200 42ms userId=1 planId=1
2026-11-25T02:26:45.043-03:00  INFO 3502647 --- [           main] [bdc91bf7-081a-4bb1-bd09-5688320c4145] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts/{id}/statement 200 19ms userId=1 planId=1
2026-11-25T02:26:45.055-03:00  INFO 3502647 --- [           main] [3e064764-812c-451c-897c-1579493f16ae] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 10ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='RepaymentsIT#reducingAShareCut` - exit 0

```
2026-11-25T02:27:06.669-03:00  INFO 3503089 --- [           main] [5a1c9923-6845-41f5-a513-de87805e1f3f] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/{id} 200 34ms userId=1 planId=1
2026-11-25T02:27:06.687-03:00  INFO 3503089 --- [           main] [a4f55f29-23f8-4e9b-91a9-6455623338de] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 14ms userId=1 planId=1
2026-11-25T02:27:06.721-03:00  INFO 3503089 --- [           main] [da706e4f-d8c0-4244-a30a-6e8eb20d0901] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 27ms userId=1 planId=1
2026-11-25T02:27:06.737-03:00  INFO 3503089 --- [           main] [f13adcc1-11c2-4658-98e2-4621bd28b5f3] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/{id} 200 14ms userId=1 planId=1
2026-11-25T02:27:06.770-03:00  INFO 3503089 --- [           main] [e7adcf4f-60cc-46e8-8742-45331e612b70] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts/{id}/statement 200 31ms userId=1 planId=1
2026-11-25T02:27:06.791-03:00  INFO 3503089 --- [           main] [0469c839-7ccb-4380-bfc4-e1e4bcc07756] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 16ms userId=1 planId=1
2026-11-25T02:27:06.826-03:00  INFO 3503089 --- [           main] [ab5ed612-2c4a-48d3-af88-ba2d2b0570fe] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 200 32ms userId=1 planId=1
2026-11-25T02:27:06.850-03:00  INFO 3503089 --- [           main] [d1a38ee5-8695-4d7f-bcfa-2603461628f9] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts/{id}/statement 200 22ms userId=1 planId=1
2026-11-25T02:27:06.865-03:00  INFO 3503089 --- [           main] [cf5f22a5-e6af-44ce-8eac-ac1b35ac8bf2] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 12ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactStatementIT#groupsByMon` - exit 0

```
2026-11-25T02:27:28.868-03:00  WARN 3503532 --- [           main] [8c438ebf-4ca8-4419-b985-2ba9f6059734] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-25T02:27:28.868-03:00  WARN 3503532 --- [           main] [8c438ebf-4ca8-4419-b985-2ba9f6059734] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#participants()
2026-11-25T02:27:28.868-03:00  WARN 3503532 --- [           main] [8c438ebf-4ca8-4419-b985-2ba9f6059734] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#items()
2026-11-25T02:27:28.868-03:00  WARN 3503532 --- [           main] [8c438ebf-4ca8-4419-b985-2ba9f6059734] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List)
2026-11-25T02:27:28.868-03:00  WARN 3503532 --- [           main] [8c438ebf-4ca8-4419-b985-2ba9f6059734] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List)
2026-11-25T02:27:28.868-03:00  WARN 3503532 --- [           main] [8c438ebf-4ca8-4419-b985-2ba9f6059734] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List)
2026-11-25T02:27:29.045-03:00  INFO 3503532 --- [           main] [8c438ebf-4ca8-4419-b985-2ba9f6059734] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 288ms userId=1 planId=1
2026-11-25T02:27:29.082-03:00  INFO 3503532 --- [           main] [9bf58a57-ec38-4b28-b0ad-97294942402f] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 30ms userId=1 planId=1
2026-11-25T02:27:29.146-03:00  INFO 3503532 --- [           main] [ac6dc3a3-44f4-4f1e-8304-3352bbfaffbf] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts/{id}/statement 200 56ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactStatementIT#balanceLeav` - exit 0

```
2026-11-25T02:27:51.702-03:00  WARN 3504022 --- [           main] [9af68f19-5bea-428d-86c7-15099c1a264f] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List)
2026-11-25T02:27:51.702-03:00  WARN 3504022 --- [           main] [9af68f19-5bea-428d-86c7-15099c1a264f] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#participants()
2026-11-25T02:27:51.702-03:00  WARN 3504022 --- [           main] [9af68f19-5bea-428d-86c7-15099c1a264f] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: allocations
2026-11-25T02:27:51.702-03:00  WARN 3504022 --- [           main] [9af68f19-5bea-428d-86c7-15099c1a264f] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-25T02:27:51.874-03:00  INFO 3504022 --- [           main] [9af68f19-5bea-428d-86c7-15099c1a264f] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 291ms userId=1 planId=1
2026-11-25T02:27:51.924-03:00  INFO 3504022 --- [           main] [a5c0d24b-e61d-4628-ae85-40debfb613d1] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts/{id}/statement 200 44ms userId=1 planId=1
2026-11-25T02:27:52.000-03:00  INFO 3504022 --- [           main] [0376200e-7f87-4ae3-bc1f-05f089a403ea] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 30ms userId=1 planId=1
2026-11-25T02:27:52.024-03:00  INFO 3504022 --- [           main] [6c9a94fa-e8f2-4a56-b488-b49024608506] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts/{id}/statement 200 22ms userId=1 planId=1
2026-11-25T02:27:52.051-03:00  INFO 3504022 --- [           main] [330af1b7-dba3-4e24-93db-3fe4d45fd56d] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 25ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactStatementIT#trashedRows` - exit 0

```
2026-11-25T02:28:13.769-03:00  INFO 3504459 --- [           main] [d4b94d97-6d53-4e6c-a735-f8a122b80f7f] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 281ms userId=1 planId=1
2026-11-25T02:28:13.805-03:00  INFO 3504459 --- [           main] [e8136618-57b7-41a9-bb84-9e41ca93742b] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/{id} 200 26ms userId=1 planId=1
2026-11-25T02:28:13.848-03:00  INFO 3504459 --- [           main] [0f9308ba-9d54-4484-989a-44f08ed3c8b2] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts/{id}/statement 200 41ms userId=1 planId=1
2026-11-25T02:28:13.936-03:00  INFO 3504459 --- [           main] [2f2a4708-1324-4b93-8a04-8c9ddace5380] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 200 38ms userId=1 planId=1
2026-11-25T02:28:13.957-03:00  INFO 3504459 --- [           main] [d5fb1873-6c76-4b28-9106-4f1533434276] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts/{id}/statement 200 20ms userId=1 planId=1
2026-11-25T02:28:13.972-03:00  INFO 3504459 --- [           main] [3cc15235-489e-4507-a6a6-f697ce376632] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/{id} 200 13ms userId=1 planId=1
2026-11-25T02:28:13.994-03:00  INFO 3504459 --- [           main] [da9a5ec1-6a00-41cb-9ae8-49aaf2b835a6] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts/{id}/statement 200 20ms userId=1 planId=1
2026-11-25T02:28:14.027-03:00  INFO 3504459 --- [           main] [ad149ac6-9f08-4462-be7d-d1964b41a16d] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 200 26ms userId=1 planId=1
2026-11-25T02:28:14.043-03:00  INFO 3504459 --- [           main] [97a36396-6e81-4f58-961d-9068da4cbf4f] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts/{id}/statement 200 14ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpContactsIT#attributedToReso` - exit 0

```
2026-11-25T02:28:35.732-03:00  INFO 3504896 --- [           main] [5463acf7-7c93-4146-a865-9685ea4f0645] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 244ms userId=- planId=-
2026-11-25T02:28:35.783-03:00  INFO 3504896 --- [           main] [e6d6131e-a080-455d-bfdf-2faa006db4c3] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=create_transaction user=1 plan=1 outcome=ok durationMs=46
2026-11-25T02:28:35.783-03:00  INFO 3504896 --- [           main] [e6d6131e-a080-455d-bfdf-2faa006db4c3] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 49ms userId=- planId=-
2026-11-25T02:28:35.862-03:00  INFO 3504896 --- [           main] [007a3c5a-c89e-4cc1-a5de-bd20cc0cca45] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=create_transaction user=1 plan=1 outcome=error durationMs=21
2026-11-25T02:28:35.863-03:00  INFO 3504896 --- [           main] [007a3c5a-c89e-4cc1-a5de-bd20cc0cca45] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 25ms userId=- planId=-
2026-11-25T02:28:35.904-03:00  INFO 3504896 --- [           main] [8948cbef-61b7-4de5-9cd5-67abd4d85c5a] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=create_transaction user=1 plan=1 outcome=error durationMs=21
2026-11-25T02:28:35.905-03:00  INFO 3504896 --- [           main] [8948cbef-61b7-4de5-9cd5-67abd4d85c5a] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 26ms userId=- planId=-
2026-11-25T02:28:35.927-03:00  INFO 3504896 --- [           main] [443e2fa3-50e8-4abe-b9b9-a393b43f42be] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=create_transaction user=1 plan=1 outcome=error durationMs=17
2026-11-25T02:28:35.927-03:00  INFO 3504896 --- [           main] [443e2fa3-50e8-4abe-b9b9-a393b43f42be] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 21ms userId=- planId=-
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpContactsIT#repaymentApplies` - exit 0

```
2026-11-25T02:28:57.338-03:00  WARN 3505388 --- [           main] [cede9fa4-0e52-431c-a1a9-e5febb661f1e] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List)
2026-11-25T02:28:57.338-03:00  WARN 3505388 --- [           main] [cede9fa4-0e52-431c-a1a9-e5febb661f1e] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-25T02:28:57.339-03:00  WARN 3505388 --- [           main] [cede9fa4-0e52-431c-a1a9-e5febb661f1e] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#items()
2026-11-25T02:28:57.339-03:00  WARN 3505388 --- [           main] [cede9fa4-0e52-431c-a1a9-e5febb661f1e] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#allocations()
2026-11-25T02:28:57.339-03:00  WARN 3505388 --- [           main] [cede9fa4-0e52-431c-a1a9-e5febb661f1e] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#participants()
2026-11-25T02:28:57.423-03:00  INFO 3505388 --- [           main] [cede9fa4-0e52-431c-a1a9-e5febb661f1e] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=create_transaction user=1 plan=1 outcome=ok durationMs=242
2026-11-25T02:28:57.438-03:00  INFO 3505388 --- [           main] [cede9fa4-0e52-431c-a1a9-e5febb661f1e] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 281ms userId=- planId=-
2026-11-25T02:28:57.563-03:00  INFO 3505388 --- [           main] [a8c68b16-e4b2-4c09-8251-1f0c6b7f3a29] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=create_transaction user=1 plan=1 outcome=ok durationMs=51
2026-11-25T02:28:57.564-03:00  INFO 3505388 --- [           main] [a8c68b16-e4b2-4c09-8251-1f0c6b7f3a29] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 56ms userId=- planId=-
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpContactsIT#listsContactsAnd` - exit 0

```
2026-11-25T02:29:18.983-03:00  WARN 3505827 --- [           main] [29571d6c-de8f-4cca-a26b-75e836d4e2e0] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-25T02:29:18.983-03:00  WARN 3505827 --- [           main] [29571d6c-de8f-4cca-a26b-75e836d4e2e0] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#participants()
2026-11-25T02:29:18.983-03:00  WARN 3505827 --- [           main] [29571d6c-de8f-4cca-a26b-75e836d4e2e0] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: allocations
2026-11-25T02:29:19.060-03:00  INFO 3505827 --- [           main] [29571d6c-de8f-4cca-a26b-75e836d4e2e0] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=create_transaction user=1 plan=1 outcome=ok durationMs=249
2026-11-25T02:29:19.074-03:00  INFO 3505827 --- [           main] [29571d6c-de8f-4cca-a26b-75e836d4e2e0] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 295ms userId=- planId=-
2026-11-25T02:29:19.095-03:00  INFO 3505827 --- [           main] [08da8f3e-455b-4915-9afe-0371a3f428ae] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=list_contacts user=1 plan=1 outcome=ok durationMs=16
2026-11-25T02:29:19.096-03:00  INFO 3505827 --- [           main] [08da8f3e-455b-4915-9afe-0371a3f428ae] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 20ms userId=- planId=-
2026-11-25T02:29:19.209-03:00  INFO 3505827 --- [           main] [25f184ea-c1f1-41f2-b43f-87bf4d11231b] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=list_transactions user=1 plan=1 outcome=ok durationMs=56
2026-11-25T02:29:19.209-03:00  INFO 3505827 --- [           main] [25f184ea-c1f1-41f2-b43f-87bf4d11231b] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 61ms userId=- planId=-
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='OpenApiSnapshotIT' -Dsurefire.` - exit 0

```
2026-11-25T02:29:40.034-03:00  INFO 3506311 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable resources templates capabilities, notification: true
2026-11-25T02:29:40.035-03:00  INFO 3506311 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable prompts capabilities, notification: true
2026-11-25T02:29:40.036-03:00  INFO 3506311 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable completions capabilities
2026-11-25T02:29:40.163-03:00  INFO 3506311 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-25T02:29:40.163-03:00  INFO 3506311 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-25T02:29:40.165-03:00  INFO 3506311 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-25T02:29:40.229-03:00  INFO 3506311 --- [           main] [] c.lcs.findraco.shared.OpenApiSnapshotIT  : Started OpenApiSnapshotIT in 9.297 seconds (process running for 10.642)
2026-11-25T02:29:41.194-03:00  INFO 3506311 --- [           main] [620b08b0-17c8-4903-b51f-60eb06731428] o.springdoc.api.AbstractOpenApiResource  : Init duration for springdoc-openapi is: 613 ms
2026-11-25T02:29:41.237-03:00  INFO 3506311 --- [           main] [620b08b0-17c8-4903-b51f-60eb06731428] c.l.f.shared.web.RequestLogFilter        : GET /v3/api-docs 200 687ms userId=- planId=-
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```
