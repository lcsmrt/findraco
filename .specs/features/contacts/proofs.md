# contacts proofs

**HEAD**: a2f3ebd2
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
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer contacts > offers a plan of one member the split when it has a contact 67ms
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer contacts > offers no contact to a contributor 58ms
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer repayment > turns an income into a contact payment 471ms
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer repayment > gives the payment one receiving member whatever split came before, and lets the user choose who 505ms
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer repayment > shows the excess as credit 365ms
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer repayment > keeps what the user ticked when the amount changes afterwards 395ms
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer repayment > loads the allocations of the payment being edited 73ms
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer repayment > offers no contact payment to a contributor 140ms

 Test Files  3 passed (3)
      Tests  70 passed (70)
   Start at  07:57:38
   Duration  13.75s (transform 655ms, setup 405ms, collect 7.13s, tests 11.74s, environment 1.54s, prepare 157ms)

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
   Start at  07:57:54
   Duration  2.33s (transform 133ms, setup 226ms, collect 1.73s, tests 23ms, environment 709ms, prepare 83ms)

No story files found for the specified pattern: src/**/*.mdx
```

`Run table` - exit 0

```
Creating Table Instance...

 ✓ |unit| src/features/transactions/TransactionsPage.test.tsx > TransactionsPage period navigator (PNAV-01, PNAV-02) > replaces a custom range with the This month preset (PNAV-03 AC 1) 246ms
stdout | src/features/transactions/TransactionsPage.test.tsx > TransactionsPage period navigator (PNAV-01, PNAV-02) > ignores the pre-feature from and to params and opens on the current month (PNAV-05)
Creating Table Instance...

 ✓ |unit| src/features/transactions/TransactionsPage.test.tsx > TransactionsPage period navigator (PNAV-01, PNAV-02) > keeps the period when all filters are cleared (PNAV-02 AC 4) 120ms
 ✓ |unit| src/features/transactions/TransactionsPage.test.tsx > TransactionsPage period navigator (PNAV-01, PNAV-02) > ignores the pre-feature from and to params and opens on the current month (PNAV-05) 27ms

 Test Files  2 passed (2)
      Tests  53 passed (53)
   Start at  07:57:58
   Duration  13.12s (transform 661ms, setup 198ms, collect 3.12s, tests 9.42s, environment 679ms, prepare 77ms)

No story files found for the specified pattern: src/**/*.mdx
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactsIT#createsTrimsAndBoun` - exit 0

```
2026-11-25T07:58:31.357-03:00  INFO 3603310 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-25T07:58:31.412-03:00  INFO 3603310 --- [           main] [] com.lcs.findraco.plan.ContactsIT         : Started ContactsIT in 9.578 seconds (process running for 10.797)
2026-11-25T07:58:32.108-03:00  INFO 3603310 --- [           main] [d4308ad1-cd91-4121-aeec-31e434749316] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts 201 223ms userId=1 planId=1
2026-11-25T07:58:32.189-03:00  INFO 3603310 --- [           main] [1cc85b3c-9821-4576-9ffb-f81d643b1b4b] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts 201 21ms userId=1 planId=1
2026-11-25T07:58:32.208-03:00  INFO 3603310 --- [           main] [53a23d02-0ab3-46c3-8210-c3698f4380b9] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts 422 17ms userId=1 planId=1
2026-11-25T07:58:32.258-03:00  INFO 3603310 --- [           main] [ac072e74-9c16-4143-874c-354770ce9cc7] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts 422 7ms userId=1 planId=1
2026-11-25T07:58:32.266-03:00  INFO 3603310 --- [           main] [f828fbd5-ff49-4c94-8912-968a90dda9aa] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts 422 6ms userId=1 planId=1
2026-11-25T07:58:32.287-03:00  INFO 3603310 --- [           main] [5865789e-6140-419e-813f-b5266806edc7] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts 201 19ms userId=1 planId=1
2026-11-25T07:58:32.314-03:00  INFO 3603310 --- [           main] [f43c8220-ea7e-4dd7-b478-c5728eb34ab2] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 24ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactsIT#rejectsADuplicateAc` - exit 0

```
2026-11-25T07:58:53.793-03:00  INFO 3603790 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-25T07:58:53.794-03:00  INFO 3603790 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-25T07:58:53.795-03:00  INFO 3603790 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-25T07:58:53.847-03:00  INFO 3603790 --- [           main] [] com.lcs.findraco.plan.ContactsIT         : Started ContactsIT in 9.502 seconds (process running for 10.753)
2026-11-25T07:58:54.549-03:00  INFO 3603790 --- [           main] [a0669c7d-d904-4b66-869c-640c68b2366c] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts 422 216ms userId=1 planId=1
2026-11-25T07:58:54.671-03:00  INFO 3603790 --- [           main] [439ad796-ab4f-4488-bed0-0ccb5410e9a8] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts 201 40ms userId=1 planId=2
2026-11-25T07:58:54.700-03:00  INFO 3603790 --- [           main] [7c627286-ddd7-4e29-9761-7bd3f4424e6c] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts 201 18ms userId=1 planId=1
2026-11-25T07:58:54.749-03:00  INFO 3603790 --- [           main] [e7b22dcc-9db5-4b16-9727-41c182452908] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts/{id}/archive 200 48ms userId=1 planId=1
2026-11-25T07:58:54.773-03:00  INFO 3603790 --- [           main] [8b6e62e9-8fae-48e8-93cc-64fa7ed2a497] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts 201 22ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactsIT#renameReachesTheSha` - exit 0

```
2026-11-25T07:59:16.967-03:00  INFO 3604250 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-25T07:59:16.967-03:00  INFO 3604250 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-25T07:59:16.968-03:00  INFO 3604250 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-25T07:59:17.027-03:00  INFO 3604250 --- [           main] [] com.lcs.findraco.plan.ContactsIT         : Started ContactsIT in 9.828 seconds (process running for 11.006)
2026-11-25T07:59:17.784-03:00  INFO 3604250 --- [           main] [791a027a-f57c-4b98-9b39-e500fff8aefe] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/contacts/{id} 200 260ms userId=1 planId=1
2026-11-25T07:59:17.892-03:00  INFO 3604250 --- [           main] [16994465-5ab8-4dba-9c58-2db54831cabc] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/{id} 200 43ms userId=1 planId=1
2026-11-25T07:59:17.912-03:00  INFO 3604250 --- [           main] [60de141c-f5ae-4b6e-8db7-3698f42cb907] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/contacts/{id} 409 18ms userId=1 planId=1
2026-11-25T07:59:17.982-03:00  INFO 3604250 --- [           main] [27fea2bb-66d7-4b4b-a6b0-373eb5978126] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 27ms userId=1 planId=1
2026-11-25T07:59:18.003-03:00  INFO 3604250 --- [           main] [b32a13d7-19fc-48d0-914d-9b14d3ba84bb] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/contacts/{id} 422 11ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactsIT#listsActiveContacts` - exit 0

```
2026-11-25T07:59:41.398-03:00  INFO 3604767 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable prompts capabilities, notification: true
2026-11-25T07:59:41.399-03:00  INFO 3604767 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable completions capabilities
2026-11-25T07:59:41.539-03:00  INFO 3604767 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-25T07:59:41.539-03:00  INFO 3604767 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-25T07:59:41.540-03:00  INFO 3604767 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-25T07:59:41.596-03:00  INFO 3604767 --- [           main] [] com.lcs.findraco.plan.ContactsIT         : Started ContactsIT in 11.055 seconds (process running for 12.242)
2026-11-25T07:59:42.349-03:00  INFO 3604767 --- [           main] [93019036-74c9-42c7-a7f8-bce5798cb1b3] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts/{id}/archive 200 241ms userId=1 planId=1
2026-11-25T07:59:42.384-03:00  INFO 3604767 --- [           main] [c3c080ee-336c-44dd-be07-f3ca7cd7e1d2] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 29ms userId=1 planId=1
2026-11-25T07:59:42.468-03:00  INFO 3604767 --- [           main] [c34996ca-c1e2-4418-bf50-c8ca20088389] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 18ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactsIT#archivesOnlyAtZeroB` - exit 0

```
2026-11-25T08:00:05.194-03:00  WARN 3605241 --- [           main] [4da44431-1c33-4805-901c-c2d307c2018b] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#allocations()
2026-11-25T08:00:05.195-03:00  WARN 3605241 --- [           main] [4da44431-1c33-4805-901c-c2d307c2018b] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List)
2026-11-25T08:00:05.196-03:00  WARN 3605241 --- [           main] [4da44431-1c33-4805-901c-c2d307c2018b] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List)
2026-11-25T08:00:05.196-03:00  WARN 3605241 --- [           main] [4da44431-1c33-4805-901c-c2d307c2018b] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List)
2026-11-25T08:00:05.196-03:00  WARN 3605241 --- [           main] [4da44431-1c33-4805-901c-c2d307c2018b] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#participants()
2026-11-25T08:00:05.196-03:00  WARN 3605241 --- [           main] [4da44431-1c33-4805-901c-c2d307c2018b] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-25T08:00:05.196-03:00  WARN 3605241 --- [           main] [4da44431-1c33-4805-901c-c2d307c2018b] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-25T08:00:05.196-03:00  WARN 3605241 --- [           main] [4da44431-1c33-4805-901c-c2d307c2018b] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#items()
2026-11-25T08:00:05.218-03:00  INFO 3605241 --- [           main] [4da44431-1c33-4805-901c-c2d307c2018b] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 52ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactsIT#unarchiveRestoresUn` - exit 0

```
2026-11-25T08:00:27.013-03:00  INFO 3605713 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-25T08:00:27.070-03:00  INFO 3605713 --- [           main] [] com.lcs.findraco.plan.ContactsIT         : Started ContactsIT in 9.446 seconds (process running for 10.629)
2026-11-25T08:00:27.786-03:00  INFO 3605713 --- [           main] [9ce029c3-a34e-41f7-aee5-41e7d25586b4] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts/{id}/archive 200 254ms userId=1 planId=1
2026-11-25T08:00:27.817-03:00  INFO 3605713 --- [           main] [c5189b97-1426-4ab4-892e-79c31c471c09] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts/{id}/archive 200 25ms userId=1 planId=1
2026-11-25T08:00:27.852-03:00  INFO 3605713 --- [           main] [901b7cf4-05a9-423c-8416-20927e1a29e0] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts 201 31ms userId=1 planId=1
2026-11-25T08:00:27.874-03:00  INFO 3605713 --- [           main] [be5c3b1c-8306-4c2e-907a-011a904bf8fe] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts/{id}/unarchive 422 20ms userId=1 planId=1
2026-11-25T08:00:27.928-03:00  INFO 3605713 --- [           main] [26d7dad7-64b3-45ca-b12f-f1ee2672d649] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 26ms userId=1 planId=1
2026-11-25T08:00:28.012-03:00  INFO 3605713 --- [           main] [7410262a-8c93-4424-b031-9306e7c72703] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts/{id}/unarchive 200 21ms userId=1 planId=1
2026-11-25T08:00:28.027-03:00  INFO 3605713 --- [           main] [f5e184d8-47c3-4da3-91b5-dccd20373681] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 13ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactsIT#deletesOnlyAnUnused` - exit 0

```
2026-11-25T08:00:50.387-03:00  INFO 3606178 --- [           main] [410b1a4c-9b58-4b29-a398-e2aba2834cb7] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 301ms userId=1 planId=1
2026-11-25T08:00:50.424-03:00  INFO 3606178 --- [           main] [9f4cbdf4-bce3-42a2-bbf2-f0f9684dda00] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/{id} 200 31ms userId=1 planId=1
2026-11-25T08:00:50.453-03:00  INFO 3606178 --- [           main] [b04f041c-d351-4c1e-a949-535cf4089dc4] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/contacts/{id} 409 27ms userId=1 planId=1
2026-11-25T08:00:50.495-03:00  INFO 3606178 --- [           main] [d7274b3e-1548-4526-aa87-8d3e0750cbbe] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/contacts/{id} 409 14ms userId=1 planId=1
2026-11-25T08:00:50.513-03:00  INFO 3606178 --- [           main] [7db13ac8-b6df-4652-8b11-a7b5955a9238] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/contacts/{id} 409 16ms userId=1 planId=1
2026-11-25T08:00:50.525-03:00  INFO 3606178 --- [           main] [f0f40be1-b4c4-4457-85e7-5d8efd741fa3] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/contacts/{id} 409 10ms userId=1 planId=1
2026-11-25T08:00:50.566-03:00  INFO 3606178 --- [           main] [84c6a049-d0f9-4226-b9b1-59b78e2d57c9] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 39ms userId=1 planId=1
2026-11-25T08:00:50.649-03:00  INFO 3606178 --- [           main] [c8f04fcf-8420-46df-8b6f-8d5750e4f248] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/contacts/{id} 204 19ms userId=1 planId=1
2026-11-25T08:00:50.664-03:00  INFO 3606178 --- [           main] [32ef6b14-4b30-4c8c-abe9-fb953ef6c4e5] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 13ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactRoleMatrixIT' -Dsurefir` - exit 0

```
2026-11-25T08:01:15.314-03:00  INFO 3606709 --- [           main] [dbf5c0bf-9059-4919-8195-0d0235fd6450] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts/{id}/unarchive 200 17ms userId=2 planId=1
2026-11-25T08:01:15.375-03:00  INFO 3606709 --- [           main] [ca21ab86-ff32-48e2-a48a-4d8f1d4246cc] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts/{id}/unarchive 403 6ms userId=3 planId=1
2026-11-25T08:01:15.437-03:00  INFO 3606709 --- [           main] [bc680085-166d-4712-9de5-fe55c98a5943] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts/{id}/unarchive 403 6ms userId=4 planId=1
2026-11-25T08:01:15.500-03:00  INFO 3606709 --- [           main] [d4822f2f-d64b-4dff-abc6-994ee8c44931] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts/{id}/unarchive 404 8ms userId=5 planId=1
2026-11-25T08:01:15.579-03:00  INFO 3606709 --- [           main] [51be8b6f-abf6-45cd-bc95-d703877e069f] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/contacts/{id} 204 21ms userId=1 planId=1
2026-11-25T08:01:15.653-03:00  INFO 3606709 --- [           main] [f04a8b01-30a8-44de-a0c1-49feea2c2196] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/contacts/{id} 204 16ms userId=2 planId=1
2026-11-25T08:01:15.720-03:00  INFO 3606709 --- [           main] [00abccbd-cfdf-4e75-a52c-e3d123ff3211] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/contacts/{id} 403 6ms userId=3 planId=1
2026-11-25T08:01:15.785-03:00  INFO 3606709 --- [           main] [52fe0ba0-2dde-40a0-8ee5-9f9df3c35aeb] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/contacts/{id} 403 8ms userId=4 planId=1
2026-11-25T08:01:15.853-03:00  INFO 3606709 --- [           main] [cd235fb8-1286-4d66-b447-902900cd23c9] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/contacts/{id} 404 6ms userId=5 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactSchemaIT' -Dsurefire.sk` - exit 0

```
2026-11-25T08:01:36.142-03:00  INFO 3607164 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Registered tools: 11
2026-11-25T08:01:36.142-03:00  INFO 3607164 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable resources capabilities, notification: true
2026-11-25T08:01:36.144-03:00  INFO 3607164 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable resources templates capabilities, notification: true
2026-11-25T08:01:36.144-03:00  INFO 3607164 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable prompts capabilities, notification: true
2026-11-25T08:01:36.146-03:00  INFO 3607164 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable completions capabilities
2026-11-25T08:01:36.275-03:00  INFO 3607164 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-25T08:01:36.275-03:00  INFO 3607164 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-25T08:01:36.276-03:00  INFO 3607164 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-25T08:01:36.342-03:00  INFO 3607164 --- [           main] [] com.lcs.findraco.plan.ContactSchemaIT    : Started ContactSchemaIT in 9.296 seconds (process running for 10.476)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactSharesIT#splitsWithCont` - exit 0

```
2026-11-25T08:01:58.385-03:00  WARN 3607649 --- [           main] [9cbd28b4-6557-40cb-a45f-bd41ad918123] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List)
2026-11-25T08:01:58.385-03:00  WARN 3607649 --- [           main] [9cbd28b4-6557-40cb-a45f-bd41ad918123] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List)
2026-11-25T08:01:58.385-03:00  WARN 3607649 --- [           main] [9cbd28b4-6557-40cb-a45f-bd41ad918123] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-25T08:01:58.385-03:00  WARN 3607649 --- [           main] [9cbd28b4-6557-40cb-a45f-bd41ad918123] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#allocations()
2026-11-25T08:01:58.385-03:00  WARN 3607649 --- [           main] [9cbd28b4-6557-40cb-a45f-bd41ad918123] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#participants()
2026-11-25T08:01:58.534-03:00  INFO 3607649 --- [           main] [9cbd28b4-6557-40cb-a45f-bd41ad918123] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 266ms userId=1 planId=1
2026-11-25T08:01:58.638-03:00  INFO 3607649 --- [           main] [b45877d6-f204-4722-8c1e-7e5107f3a451] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 33ms userId=1 planId=1
2026-11-25T08:01:58.661-03:00  INFO 3607649 --- [           main] [bc5eb9c3-2846-4adb-b38e-e69e8c678727] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 20ms userId=1 planId=1
2026-11-25T08:01:58.697-03:00  INFO 3607649 --- [           main] [fc6d4b80-42a2-412e-8f6d-230fa403079f] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 26ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactSharesIT#contactSharesL` - exit 0

```
2026-11-25T08:02:20.659-03:00  WARN 3608108 --- [           main] [89811814-da7d-4890-9e26-ff55dc318887] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#items()
2026-11-25T08:02:20.659-03:00  WARN 3608108 --- [           main] [89811814-da7d-4890-9e26-ff55dc318887] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-25T08:02:20.659-03:00  WARN 3608108 --- [           main] [89811814-da7d-4890-9e26-ff55dc318887] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List)
2026-11-25T08:02:20.659-03:00  WARN 3608108 --- [           main] [89811814-da7d-4890-9e26-ff55dc318887] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List)
2026-11-25T08:02:20.659-03:00  WARN 3608108 --- [           main] [89811814-da7d-4890-9e26-ff55dc318887] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List)
2026-11-25T08:02:20.813-03:00  INFO 3608108 --- [           main] [89811814-da7d-4890-9e26-ff55dc318887] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 265ms userId=1 planId=1
2026-11-25T08:02:20.910-03:00  INFO 3608108 --- [           main] [953536c1-792a-4caa-8f77-e5e21f28b3c1] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/dashboard 200 85ms userId=1 planId=1
2026-11-25T08:02:20.981-03:00  INFO 3608108 --- [           main] [865dc892-897f-45bc-8d6d-0a454b261b3d] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/dashboard/trend 200 23ms userId=1 planId=1
2026-11-25T08:02:21.020-03:00  INFO 3608108 --- [           main] [7618b31c-8584-45b8-8238-a2f3685967ed] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/dashboard 200 30ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactSharesIT#contactSharesL` - exit 0

```
2026-11-25T08:02:43.068-03:00  WARN 3608586 --- [           main] [162b614a-6300-40a3-8d37-4fcaf9298b39] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#com.lcs.findraco.transaction.request.UpdateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List, Long)
2026-11-25T08:02:43.068-03:00  WARN 3608586 --- [           main] [162b614a-6300-40a3-8d37-4fcaf9298b39] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#com.lcs.findraco.transaction.request.UpdateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List, Long)
2026-11-25T08:02:43.069-03:00  WARN 3608586 --- [           main] [162b614a-6300-40a3-8d37-4fcaf9298b39] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#allocations()
2026-11-25T08:02:43.069-03:00  WARN 3608586 --- [           main] [162b614a-6300-40a3-8d37-4fcaf9298b39] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: allocations
2026-11-25T08:02:43.069-03:00  WARN 3608586 --- [           main] [162b614a-6300-40a3-8d37-4fcaf9298b39] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-25T08:02:43.069-03:00  WARN 3608586 --- [           main] [162b614a-6300-40a3-8d37-4fcaf9298b39] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#items()
2026-11-25T08:02:43.069-03:00  WARN 3608586 --- [           main] [162b614a-6300-40a3-8d37-4fcaf9298b39] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-25T08:02:43.116-03:00  INFO 3608586 --- [           main] [162b614a-6300-40a3-8d37-4fcaf9298b39] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/{id} 200 60ms userId=1 planId=1
2026-11-25T08:02:43.144-03:00  INFO 3608586 --- [           main] [4b956de2-2fc8-4007-9761-09319f30fded] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/category/spending 200 26ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactSharesIT#contactSharesO` - exit 0

```
2026-11-25T08:03:06.019-03:00  INFO 3609063 --- [           main] [12c75f21-284b-457f-8c2c-f0f97218b765] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/{id} 422 15ms userId=1 planId=1
2026-11-25T08:03:06.033-03:00  INFO 3609063 --- [           main] [955a287b-f584-4f95-b36a-7caff4e993f5] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 12ms userId=1 planId=1
2026-11-25T08:03:06.047-03:00  INFO 3609063 --- [           main] [3e6c335d-69c5-46a5-9e21-ff5f00a7d6d9] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/{id} 422 13ms userId=1 planId=1
2026-11-25T08:03:06.057-03:00  INFO 3609063 --- [           main] [6d2bee1b-a61f-4cd6-a923-bc6d81ed426c] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 8ms userId=1 planId=1
2026-11-25T08:03:06.070-03:00  INFO 3609063 --- [           main] [66a2915e-936b-4137-9ea7-297815527872] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/{id} 422 12ms userId=1 planId=1
2026-11-25T08:03:06.162-03:00  WARN 3609063 --- [           main] [e93b185f-d04e-4221-9ffd-4dfc5639deef] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-25T08:03:06.162-03:00  WARN 3609063 --- [           main] [e93b185f-d04e-4221-9ffd-4dfc5639deef] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-25T08:03:06.163-03:00  WARN 3609063 --- [           main] [e93b185f-d04e-4221-9ffd-4dfc5639deef] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-25T08:03:06.171-03:00  INFO 3609063 --- [           main] [e93b185f-d04e-4221-9ffd-4dfc5639deef] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 422 19ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactSharesIT#archivedOrFore` - exit 0

```
2026-11-25T08:03:28.892-03:00  WARN 3609574 --- [           main] [82940bc2-4029-44c7-968f-8202747bfda3] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#participants()
2026-11-25T08:03:28.892-03:00  WARN 3609574 --- [           main] [82940bc2-4029-44c7-968f-8202747bfda3] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#items()
2026-11-25T08:03:28.926-03:00  INFO 3609574 --- [           main] [82940bc2-4029-44c7-968f-8202747bfda3] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 66ms userId=1 planId=1
2026-11-25T08:03:28.962-03:00  INFO 3609574 --- [           main] [04c8422c-ee63-459d-bea7-41e4f511eb68] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 404 11ms userId=1 planId=1
2026-11-25T08:03:28.974-03:00  WARN 3609574 --- [           main] [b9c0c608-8265-40d8-beb1-697eb3d63ede] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-25T08:03:28.974-03:00  WARN 3609574 --- [           main] [b9c0c608-8265-40d8-beb1-697eb3d63ede] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-25T08:03:28.974-03:00  WARN 3609574 --- [           main] [b9c0c608-8265-40d8-beb1-697eb3d63ede] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-25T08:03:28.984-03:00  INFO 3609574 --- [           main] [b9c0c608-8265-40d8-beb1-697eb3d63ede] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 422 19ms userId=1 planId=1
2026-11-25T08:03:28.995-03:00  INFO 3609574 --- [           main] [7ea343eb-15d7-48fd-9172-fcf64e7fc89d] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 404 10ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactSharesIT#onlyOwnerAndEd` - exit 0

```
2026-11-25T08:03:51.496-03:00  WARN 3610048 --- [           main] [e2d2a08c-3949-4acb-a0ca-daa198aee8f6] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#participants()
2026-11-25T08:03:51.496-03:00  WARN 3610048 --- [           main] [e2d2a08c-3949-4acb-a0ca-daa198aee8f6] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-25T08:03:51.496-03:00  WARN 3610048 --- [           main] [e2d2a08c-3949-4acb-a0ca-daa198aee8f6] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#items()
2026-11-25T08:03:51.496-03:00  WARN 3610048 --- [           main] [e2d2a08c-3949-4acb-a0ca-daa198aee8f6] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#com.lcs.findraco.transaction.request.UpdateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List, Long)
2026-11-25T08:03:51.496-03:00  WARN 3610048 --- [           main] [e2d2a08c-3949-4acb-a0ca-daa198aee8f6] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#com.lcs.findraco.transaction.request.UpdateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List, Long)
2026-11-25T08:03:51.496-03:00  WARN 3610048 --- [           main] [e2d2a08c-3949-4acb-a0ca-daa198aee8f6] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#com.lcs.findraco.transaction.request.UpdateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List, Long)
2026-11-25T08:03:51.496-03:00  WARN 3610048 --- [           main] [e2d2a08c-3949-4acb-a0ca-daa198aee8f6] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: allocations
2026-11-25T08:03:51.518-03:00  INFO 3610048 --- [           main] [e2d2a08c-3949-4acb-a0ca-daa198aee8f6] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/{id} 403 33ms userId=3 planId=1
2026-11-25T08:03:51.539-03:00  INFO 3610048 --- [           main] [a4e01578-e5fc-4fda-bde3-7a024eeb65d3] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 18ms userId=2 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactSharesIT#seriesCarryCon` - exit 0

```
2026-11-25T08:04:13.740-03:00  INFO 3610555 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-25T08:04:13.804-03:00  INFO 3610555 --- [           main] [] c.l.f.transaction.ContactSharesIT        : Started ContactSharesIT in 9.708 seconds (process running for 10.936)
2026-11-25T08:04:14.409-03:00  WARN 3610555 --- [           main] [d0a31b43-e187-4296-bead-2ccf5fc1b33e] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-25T08:04:14.412-03:00  WARN 3610555 --- [           main] [d0a31b43-e187-4296-bead-2ccf5fc1b33e] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-25T08:04:14.413-03:00  WARN 3610555 --- [           main] [d0a31b43-e187-4296-bead-2ccf5fc1b33e] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-25T08:04:14.573-03:00  INFO 3610555 --- [           main] [d0a31b43-e187-4296-bead-2ccf5fc1b33e] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 279ms userId=1 planId=1
2026-11-25T08:04:14.659-03:00  INFO 3610555 --- [           main] [07e273ea-a6a1-4aac-ae0b-ed463f5fa6f1] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 32ms userId=1 planId=1
2026-11-25T08:04:14.715-03:00  INFO 3610555 --- [           main] [02432b33-2e73-429a-9a5e-b6dfdc838664] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/{id}/confirm 200 54ms userId=1 planId=1
2026-11-25T08:04:14.827-03:00  INFO 3610555 --- [           main] [4f76c2aa-348f-4ece-ad18-23cec169707f] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 106ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='RepaymentsIT#repaymentCountsIn` - exit 0

```
2026-11-25T08:04:37.814-03:00  WARN 3611026 --- [           main] [0f1f280c-36d9-4ab6-b0d9-e1031b755517] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List)
2026-11-25T08:04:37.814-03:00  WARN 3611026 --- [           main] [0f1f280c-36d9-4ab6-b0d9-e1031b755517] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List)
2026-11-25T08:04:37.814-03:00  WARN 3611026 --- [           main] [0f1f280c-36d9-4ab6-b0d9-e1031b755517] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List)
2026-11-25T08:04:37.814-03:00  WARN 3611026 --- [           main] [0f1f280c-36d9-4ab6-b0d9-e1031b755517] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#allocations()
2026-11-25T08:04:37.975-03:00  INFO 3611026 --- [           main] [0f1f280c-36d9-4ab6-b0d9-e1031b755517] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 280ms userId=1 planId=1
2026-11-25T08:04:38.120-03:00  INFO 3611026 --- [           main] [560adfff-4501-4d4b-a618-ce83f9045c3e] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/dashboard 200 77ms userId=1 planId=1
2026-11-25T08:04:38.151-03:00  INFO 3611026 --- [           main] [c841fcd4-e299-43bd-b6bf-6c2590766db5] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/dashboard/trend 200 22ms userId=1 planId=1
2026-11-25T08:04:38.251-03:00  INFO 3611026 --- [           main] [52e4fc4f-7d88-4aab-88fc-c89de9994557] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction 200 98ms userId=1 planId=1
2026-11-25T08:04:38.287-03:00  INFO 3611026 --- [           main] [a3d14c7b-1f45-4d66-ae37-e8ee47f7b187] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction 200 34ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='RepaymentsIT#storesExplicitAll` - exit 0

```
2026-11-25T08:05:00.921-03:00  WARN 3611511 --- [           main] [ac7078cb-7246-4083-ac04-c9afad158c43] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List)
2026-11-25T08:05:00.921-03:00  WARN 3611511 --- [           main] [ac7078cb-7246-4083-ac04-c9afad158c43] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List)
2026-11-25T08:05:00.921-03:00  WARN 3611511 --- [           main] [ac7078cb-7246-4083-ac04-c9afad158c43] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#items()
2026-11-25T08:05:00.921-03:00  WARN 3611511 --- [           main] [ac7078cb-7246-4083-ac04-c9afad158c43] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-25T08:05:00.922-03:00  WARN 3611511 --- [           main] [ac7078cb-7246-4083-ac04-c9afad158c43] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: allocations
2026-11-25T08:05:01.113-03:00  INFO 3611511 --- [           main] [ac7078cb-7246-4083-ac04-c9afad158c43] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 311ms userId=1 planId=1
2026-11-25T08:05:01.222-03:00  INFO 3611511 --- [           main] [0d309632-4304-4ddd-98b8-309b1fd78f3b] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 29ms userId=1 planId=1
2026-11-25T08:05:01.265-03:00  INFO 3611511 --- [           main] [ad8c1687-ba07-43f9-8be7-7cba8c3b150f] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 34ms userId=1 planId=1
2026-11-25T08:05:01.282-03:00  INFO 3611511 --- [           main] [1727361e-5233-456b-870c-1c1f7c49526d] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 12ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='RepaymentsIT#omittedAllocation` - exit 0

```
2026-11-25T08:05:23.394-03:00  WARN 3612022 --- [           main] [5e3b4efa-fd26-4ad6-b647-6a6da90096fe] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#participants()
2026-11-25T08:05:23.394-03:00  WARN 3612022 --- [           main] [5e3b4efa-fd26-4ad6-b647-6a6da90096fe] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#items()
2026-11-25T08:05:23.395-03:00  WARN 3612022 --- [           main] [5e3b4efa-fd26-4ad6-b647-6a6da90096fe] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-25T08:05:23.578-03:00  INFO 3612022 --- [           main] [5e3b4efa-fd26-4ad6-b647-6a6da90096fe] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 294ms userId=1 planId=1
2026-11-25T08:05:23.673-03:00  INFO 3612022 --- [           main] [354482e3-2d1b-48ea-8540-c242a5be9823] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 34ms userId=1 planId=1
2026-11-25T08:05:23.706-03:00  INFO 3612022 --- [           main] [5881a714-1b7c-4ca4-8bee-70274e58c7a2] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 28ms userId=1 planId=1
2026-11-25T08:05:23.722-03:00  INFO 3612022 --- [           main] [e3e316ad-2de9-4679-b202-8c4e55d04709] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 12ms userId=1 planId=1
2026-11-25T08:05:23.752-03:00  INFO 3612022 --- [           main] [05db9909-6be9-4e58-af9f-abe30ef828f7] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 28ms userId=1 planId=1
2026-11-25T08:05:23.768-03:00  INFO 3612022 --- [           main] [20c8d563-ffee-4e6f-a62c-a40160f3b0f0] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 12ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='RepaymentsIT#allocationLimitsA` - exit 0

```
2026-11-25T08:05:46.050-03:00  WARN 3612492 --- [           main] [a5a23b23-46b4-4f03-89da-7ccf8f67c56f] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: allocations
2026-11-25T08:05:46.233-03:00  INFO 3612492 --- [           main] [a5a23b23-46b4-4f03-89da-7ccf8f67c56f] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 307ms userId=1 planId=1
2026-11-25T08:05:46.283-03:00  INFO 3612492 --- [           main] [ec55d6ff-af69-479b-9707-72fc1ba68d74] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 35ms userId=1 planId=1
2026-11-25T08:05:46.334-03:00  INFO 3612492 --- [           main] [6d608507-9e21-4067-b2af-916ad9782d2f] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 24ms userId=1 planId=1
2026-11-25T08:05:46.361-03:00  INFO 3612492 --- [           main] [111dbcd9-6ba2-478b-a4a3-e5c45af1c306] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 25ms userId=1 planId=1
2026-11-25T08:05:46.386-03:00  INFO 3612492 --- [           main] [d6e9c345-59ab-499c-8d12-7e1e87a83725] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 23ms userId=1 planId=1
2026-11-25T08:05:46.410-03:00  INFO 3612492 --- [           main] [149fc07d-816e-4820-877b-61ff60617e68] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 22ms userId=1 planId=1
2026-11-25T08:05:46.492-03:00  INFO 3612492 --- [           main] [d6a8b5c0-0b61-48b5-881c-445fd115730c] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 28ms userId=1 planId=1
2026-11-25T08:05:46.524-03:00  INFO 3612492 --- [           main] [b7c798e8-cce8-46bb-b0f3-bf28d8f09820] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 29ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='RepaymentsIT#concurrentRepayme` - exit 0

```
2026-11-25T08:06:08.860-03:00  INFO 3613015 --- [pool-3-thread-1] [f32b60db-a209-4fff-b7e6-fc613132c970] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 334ms userId=1 planId=1
2026-11-25T08:06:08.945-03:00  INFO 3613015 --- [pool-3-thread-1] [43dc6cf4-078a-472c-8a62-c24466395cf4] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 25ms userId=1 planId=1
2026-11-25T08:06:08.960-03:00  INFO 3613015 --- [pool-3-thread-2] [0812152f-e438-43d9-88c5-596c5edd4f97] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 40ms userId=1 planId=1
2026-11-25T08:06:09.009-03:00  INFO 3613015 --- [pool-3-thread-1] [09f3d480-f8ea-4da0-ae40-20b8f24f1a1a] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 32ms userId=1 planId=1
2026-11-25T08:06:09.021-03:00  INFO 3613015 --- [pool-3-thread-2] [a7d57e31-3e49-4789-869f-032d13041761] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 43ms userId=1 planId=1
2026-11-25T08:06:09.061-03:00  INFO 3613015 --- [pool-3-thread-1] [3d4116c8-e8d8-4042-8358-e3374fc0d2b2] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 29ms userId=1 planId=1
2026-11-25T08:06:09.074-03:00  INFO 3613015 --- [pool-3-thread-2] [579c282a-9790-4e57-8c8e-5bd55b1a3d4a] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 42ms userId=1 planId=1
2026-11-25T08:06:09.116-03:00  INFO 3613015 --- [pool-3-thread-1] [1731e87f-aced-494a-afd9-b6ac461a4cb1] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 29ms userId=1 planId=1
2026-11-25T08:06:09.130-03:00  INFO 3613015 --- [pool-3-thread-2] [881ff01c-eb6e-444c-b2d6-137f692a5ca4] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 44ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='RepaymentsIT#editReplacesAndTr` - exit 0

```
2026-11-25T08:06:31.931-03:00  INFO 3613511 --- [           main] [d9b4834c-e293-4d7c-85af-50f65e612966] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts/{id}/statement 200 48ms userId=1 planId=1
2026-11-25T08:06:31.955-03:00  INFO 3613511 --- [           main] [7b364863-1ca1-4cf0-85fe-ca5db27ab3be] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 22ms userId=1 planId=1
2026-11-25T08:06:31.981-03:00  INFO 3613511 --- [           main] [82477890-738d-4258-8db3-ec6cf3df3dfa] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/{id} 200 20ms userId=1 planId=1
2026-11-25T08:06:32.005-03:00  INFO 3613511 --- [           main] [ff4c1901-fcbd-457d-8a04-bf9809a11a28] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts/{id}/statement 200 22ms userId=1 planId=1
2026-11-25T08:06:32.031-03:00  INFO 3613511 --- [           main] [c2ee216d-c2d2-436f-b3e7-9f89f9006a65] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts/{id}/statement 200 23ms userId=1 planId=1
2026-11-25T08:06:32.046-03:00  INFO 3613511 --- [           main] [e906e812-abc1-45c6-981c-1abf9f47ac65] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 13ms userId=1 planId=1
2026-11-25T08:06:32.132-03:00  INFO 3613511 --- [           main] [7aeadae3-ec81-43ea-b89d-f56b8b4f512d] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 200 83ms userId=1 planId=1
2026-11-25T08:06:32.162-03:00  INFO 3613511 --- [           main] [34727dde-cd88-4706-ae84-afc2dd15a86d] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts/{id}/statement 200 27ms userId=1 planId=1
2026-11-25T08:06:32.180-03:00  INFO 3613511 --- [           main] [e2a43d2d-9dae-455e-a037-aeaeed09f4cc] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 15ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='RepaymentsIT#reducingAShareCut` - exit 0

```
2026-11-25T08:06:54.959-03:00  INFO 3613975 --- [           main] [b27e86e4-814f-4c8c-a677-60797a1f461e] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/{id} 200 37ms userId=1 planId=1
2026-11-25T08:06:54.974-03:00  INFO 3613975 --- [           main] [ad3311d2-7112-44f1-ae52-e9be95fcff85] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 11ms userId=1 planId=1
2026-11-25T08:06:55.005-03:00  INFO 3613975 --- [           main] [0848ec57-580b-438b-b106-a452a2ab218c] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 25ms userId=1 planId=1
2026-11-25T08:06:55.022-03:00  INFO 3613975 --- [           main] [c784953d-1bd5-4e5f-9846-1a8b8c03111b] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/{id} 200 15ms userId=1 planId=1
2026-11-25T08:06:55.063-03:00  INFO 3613975 --- [           main] [939475df-ae15-416d-9c66-dedd42eae041] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts/{id}/statement 200 38ms userId=1 planId=1
2026-11-25T08:06:55.081-03:00  INFO 3613975 --- [           main] [d501f44a-7a00-44db-aa9b-26b2c4fbd16c] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 14ms userId=1 planId=1
2026-11-25T08:06:55.132-03:00  INFO 3613975 --- [           main] [bb1b56aa-b043-461c-9c0b-da6a7b950fdc] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 200 49ms userId=1 planId=1
2026-11-25T08:06:55.153-03:00  INFO 3613975 --- [           main] [d5874d79-d241-4698-b45c-87cc23a40f85] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts/{id}/statement 200 19ms userId=1 planId=1
2026-11-25T08:06:55.169-03:00  INFO 3613975 --- [           main] [44afb5cd-be02-4a9e-9c9e-12d64997060c] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 13ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactStatementIT#groupsByMon` - exit 0

```
2026-11-25T08:07:17.837-03:00  WARN 3614444 --- [           main] [771b8b57-74c0-4f37-a4c9-5ed2e9cb5de0] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#items()
2026-11-25T08:07:17.837-03:00  WARN 3614444 --- [           main] [771b8b57-74c0-4f37-a4c9-5ed2e9cb5de0] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#participants()
2026-11-25T08:07:17.838-03:00  WARN 3614444 --- [           main] [771b8b57-74c0-4f37-a4c9-5ed2e9cb5de0] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-25T08:07:17.838-03:00  WARN 3614444 --- [           main] [771b8b57-74c0-4f37-a4c9-5ed2e9cb5de0] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List)
2026-11-25T08:07:17.838-03:00  WARN 3614444 --- [           main] [771b8b57-74c0-4f37-a4c9-5ed2e9cb5de0] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List)
2026-11-25T08:07:17.838-03:00  WARN 3614444 --- [           main] [771b8b57-74c0-4f37-a4c9-5ed2e9cb5de0] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List)
2026-11-25T08:07:18.024-03:00  INFO 3614444 --- [           main] [771b8b57-74c0-4f37-a4c9-5ed2e9cb5de0] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 310ms userId=1 planId=1
2026-11-25T08:07:18.064-03:00  INFO 3614444 --- [           main] [3737bd68-9706-4b1b-8cdb-7b9ec72391ac] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 33ms userId=1 planId=1
2026-11-25T08:07:18.116-03:00  INFO 3614444 --- [           main] [3ab8e34d-bab2-4c2f-856f-fcaadf2a33c0] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts/{id}/statement 200 44ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactStatementIT#balanceLeav` - exit 0

```
2026-11-25T08:07:39.931-03:00  WARN 3614926 --- [           main] [7907aebb-663c-4ec2-a7d6-4fd03d9e388d] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-25T08:07:39.931-03:00  WARN 3614926 --- [           main] [7907aebb-663c-4ec2-a7d6-4fd03d9e388d] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-25T08:07:39.931-03:00  WARN 3614926 --- [           main] [7907aebb-663c-4ec2-a7d6-4fd03d9e388d] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#participants()
2026-11-25T08:07:39.931-03:00  WARN 3614926 --- [           main] [7907aebb-663c-4ec2-a7d6-4fd03d9e388d] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: allocations
2026-11-25T08:07:40.109-03:00  INFO 3614926 --- [           main] [7907aebb-663c-4ec2-a7d6-4fd03d9e388d] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 320ms userId=1 planId=1
2026-11-25T08:07:40.164-03:00  INFO 3614926 --- [           main] [ef0af739-362c-4312-acb5-5685d540d39f] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts/{id}/statement 200 48ms userId=1 planId=1
2026-11-25T08:07:40.261-03:00  INFO 3614926 --- [           main] [6ca7e434-2e56-4624-a057-e587a3a5383b] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 41ms userId=1 planId=1
2026-11-25T08:07:40.286-03:00  INFO 3614926 --- [           main] [f2eb29cd-f474-4685-bb6e-c623e297995a] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts/{id}/statement 200 24ms userId=1 planId=1
2026-11-25T08:07:40.311-03:00  INFO 3614926 --- [           main] [576a1f40-2551-428a-a9ef-ae448d9b8ff2] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 22ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactStatementIT#trashedRows` - exit 0

```
2026-11-25T08:08:02.270-03:00  INFO 3615438 --- [           main] [a1bbe29b-2b90-4262-be36-69f51d432bc4] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 276ms userId=1 planId=1
2026-11-25T08:08:02.304-03:00  INFO 3615438 --- [           main] [d3d417da-182f-4c2f-842c-b145f2eb2c6c] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/{id} 200 23ms userId=1 planId=1
2026-11-25T08:08:02.347-03:00  INFO 3615438 --- [           main] [0ec5bed4-2655-4b9b-b23d-07c4b5be0ace] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts/{id}/statement 200 41ms userId=1 planId=1
2026-11-25T08:08:02.476-03:00  INFO 3615438 --- [           main] [eaa48310-96ae-4a0b-87be-c3827416b0c8] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 200 69ms userId=1 planId=1
2026-11-25T08:08:02.501-03:00  INFO 3615438 --- [           main] [263cf0b4-cb80-46ad-85b6-f2bc1c043c71] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts/{id}/statement 200 24ms userId=1 planId=1
2026-11-25T08:08:02.517-03:00  INFO 3615438 --- [           main] [ad60fdff-31f9-42e1-8167-72489fcba733] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/{id} 200 14ms userId=1 planId=1
2026-11-25T08:08:02.539-03:00  INFO 3615438 --- [           main] [fdc53564-01ce-48ec-abb3-0474809f8c87] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts/{id}/statement 200 21ms userId=1 planId=1
2026-11-25T08:08:02.579-03:00  INFO 3615438 --- [           main] [8160cb48-5057-49ce-a315-5186ba9f420e] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 200 35ms userId=1 planId=1
2026-11-25T08:08:02.599-03:00  INFO 3615438 --- [           main] [8d6fea1d-5970-49d3-a16b-81066078c842] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts/{id}/statement 200 18ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpContactsIT#attributedToReso` - exit 0

```
2026-11-25T08:08:25.332-03:00  INFO 3615913 --- [           main] [97d09687-8eb9-4255-9838-773cc64a5a05] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 248ms userId=- planId=-
2026-11-25T08:08:25.377-03:00  INFO 3615913 --- [           main] [56f29293-b9b7-44d2-be32-cec1df49d2c8] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=create_transaction user=1 plan=1 outcome=ok durationMs=40
2026-11-25T08:08:25.378-03:00  INFO 3615913 --- [           main] [56f29293-b9b7-44d2-be32-cec1df49d2c8] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 43ms userId=- planId=-
2026-11-25T08:08:25.457-03:00  INFO 3615913 --- [           main] [3d626fb1-8128-4011-878b-df430ff99241] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=create_transaction user=1 plan=1 outcome=error durationMs=18
2026-11-25T08:08:25.458-03:00  INFO 3615913 --- [           main] [3d626fb1-8128-4011-878b-df430ff99241] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 21ms userId=- planId=-
2026-11-25T08:08:25.492-03:00  INFO 3615913 --- [           main] [5b337f6d-cf62-4a3d-966d-b22dad08cd30] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=create_transaction user=1 plan=1 outcome=error durationMs=15
2026-11-25T08:08:25.493-03:00  INFO 3615913 --- [           main] [5b337f6d-cf62-4a3d-966d-b22dad08cd30] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 18ms userId=- planId=-
2026-11-25T08:08:25.516-03:00  INFO 3615913 --- [           main] [f1aa162b-a0c0-4c58-803c-34423bd82b3a] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=create_transaction user=1 plan=1 outcome=error durationMs=19
2026-11-25T08:08:25.516-03:00  INFO 3615913 --- [           main] [f1aa162b-a0c0-4c58-803c-34423bd82b3a] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 22ms userId=- planId=-
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpContactsIT#repaymentApplies` - exit 0

```
2026-11-25T08:08:47.465-03:00  WARN 3616389 --- [           main] [ae0ec3b5-be2b-4e35-b1e6-4476532c8d46] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List)
2026-11-25T08:08:47.465-03:00  WARN 3616389 --- [           main] [ae0ec3b5-be2b-4e35-b1e6-4476532c8d46] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-25T08:08:47.465-03:00  WARN 3616389 --- [           main] [ae0ec3b5-be2b-4e35-b1e6-4476532c8d46] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#items()
2026-11-25T08:08:47.466-03:00  WARN 3616389 --- [           main] [ae0ec3b5-be2b-4e35-b1e6-4476532c8d46] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-25T08:08:47.466-03:00  WARN 3616389 --- [           main] [ae0ec3b5-be2b-4e35-b1e6-4476532c8d46] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: allocations
2026-11-25T08:08:47.558-03:00  INFO 3616389 --- [           main] [ae0ec3b5-be2b-4e35-b1e6-4476532c8d46] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=create_transaction user=1 plan=1 outcome=ok durationMs=249
2026-11-25T08:08:47.572-03:00  INFO 3616389 --- [           main] [ae0ec3b5-be2b-4e35-b1e6-4476532c8d46] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 308ms userId=- planId=-
2026-11-25T08:08:47.680-03:00  INFO 3616389 --- [           main] [4f165227-3db3-45c0-9a8f-0bd94ea475a3] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=create_transaction user=1 plan=1 outcome=ok durationMs=55
2026-11-25T08:08:47.681-03:00  INFO 3616389 --- [           main] [4f165227-3db3-45c0-9a8f-0bd94ea475a3] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 59ms userId=- planId=-
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpContactsIT#listsContactsAnd` - exit 0

```
2026-11-25T08:09:09.919-03:00  WARN 3616865 --- [           main] [391b8750-aaa4-4807-80e7-c227e7ea7dcc] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#allocations()
2026-11-25T08:09:09.919-03:00  WARN 3616865 --- [           main] [391b8750-aaa4-4807-80e7-c227e7ea7dcc] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-25T08:09:09.919-03:00  WARN 3616865 --- [           main] [391b8750-aaa4-4807-80e7-c227e7ea7dcc] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#participants()
2026-11-25T08:09:10.000-03:00  INFO 3616865 --- [           main] [391b8750-aaa4-4807-80e7-c227e7ea7dcc] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=create_transaction user=1 plan=1 outcome=ok durationMs=242
2026-11-25T08:09:10.014-03:00  INFO 3616865 --- [           main] [391b8750-aaa4-4807-80e7-c227e7ea7dcc] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 279ms userId=- planId=-
2026-11-25T08:09:10.036-03:00  INFO 3616865 --- [           main] [7420ddd0-7b24-4273-9da8-b1a1d2074977] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=list_contacts user=1 plan=1 outcome=ok durationMs=18
2026-11-25T08:09:10.037-03:00  INFO 3616865 --- [           main] [7420ddd0-7b24-4273-9da8-b1a1d2074977] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 21ms userId=- planId=-
2026-11-25T08:09:10.171-03:00  INFO 3616865 --- [           main] [9a949a44-b46b-4984-b8b2-15b52bc04ba3] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=list_transactions user=1 plan=1 outcome=ok durationMs=76
2026-11-25T08:09:10.172-03:00  INFO 3616865 --- [           main] [9a949a44-b46b-4984-b8b2-15b52bc04ba3] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 81ms userId=- planId=-
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='OpenApiSnapshotIT' -Dsurefire.` - exit 0

```
2026-11-25T08:09:32.048-03:00  INFO 3617378 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable resources templates capabilities, notification: true
2026-11-25T08:09:32.049-03:00  INFO 3617378 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable prompts capabilities, notification: true
2026-11-25T08:09:32.050-03:00  INFO 3617378 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable completions capabilities
2026-11-25T08:09:32.183-03:00  INFO 3617378 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-25T08:09:32.183-03:00  INFO 3617378 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-25T08:09:32.184-03:00  INFO 3617378 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-25T08:09:32.240-03:00  INFO 3617378 --- [           main] [] c.lcs.findraco.shared.OpenApiSnapshotIT  : Started OpenApiSnapshotIT in 9.55 seconds (process running for 10.908)
2026-11-25T08:09:33.199-03:00  INFO 3617378 --- [           main] [8184f41b-ae1e-4795-aa2d-1bb28ed4f046] o.springdoc.api.AbstractOpenApiResource  : Init duration for springdoc-openapi is: 612 ms
2026-11-25T08:09:33.241-03:00  INFO 3617378 --- [           main] [8184f41b-ae1e-4795-aa2d-1bb28ed4f046] c.l.f.shared.web.RequestLogFilter        : GET /v3/api-docs 200 682ms userId=- planId=-
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='RepaymentsIT#aSettledPurchaseM` - exit 0

```
2026-11-25T08:09:57.965-03:00  WARN 3617844 --- [           main] [33a7240d-0f0f-4a2e-a067-3b81c6d34851] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-25T08:09:57.965-03:00  WARN 3617844 --- [           main] [33a7240d-0f0f-4a2e-a067-3b81c6d34851] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#items()
2026-11-25T08:09:57.966-03:00  WARN 3617844 --- [           main] [33a7240d-0f0f-4a2e-a067-3b81c6d34851] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: allocations
2026-11-25T08:09:57.966-03:00  WARN 3617844 --- [           main] [33a7240d-0f0f-4a2e-a067-3b81c6d34851] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#com.lcs.findraco.transaction.request.UpdateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List, Long)
2026-11-25T08:09:57.966-03:00  WARN 3617844 --- [           main] [33a7240d-0f0f-4a2e-a067-3b81c6d34851] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#com.lcs.findraco.transaction.request.UpdateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List, Long)
2026-11-25T08:09:57.967-03:00  WARN 3617844 --- [           main] [33a7240d-0f0f-4a2e-a067-3b81c6d34851] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#com.lcs.findraco.transaction.request.UpdateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long, List, Long)
2026-11-25T08:09:58.031-03:00  INFO 3617844 --- [           main] [33a7240d-0f0f-4a2e-a067-3b81c6d34851] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/{id} 200 80ms userId=1 planId=1
2026-11-25T08:09:58.097-03:00  INFO 3617844 --- [           main] [3c9ec317-d71a-45b8-9b7c-ed488c274ab5] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts/{id}/statement 200 42ms userId=1 planId=1
2026-11-25T08:09:58.126-03:00  INFO 3617844 --- [           main] [8bd00c19-1825-4cf0-b7fc-e1d9bd0df016] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 22ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='RepaymentsIT#editingAPaymentWh` - exit 0

```
2026-11-25T08:10:20.657-03:00  INFO 3618312 --- [           main] [37dbefbc-60a3-4670-b02b-d4b59857bd1b] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/{id} 200 64ms userId=1 planId=1
2026-11-25T08:10:20.775-03:00  INFO 3618312 --- [           main] [a7fa0231-db16-43d8-8fa0-76b1563e7254] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 200 55ms userId=1 planId=1
2026-11-25T08:10:20.819-03:00  INFO 3618312 --- [           main] [df73747e-b7a5-46ca-b325-a1c54fe275aa] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts/{id}/statement 200 42ms userId=1 planId=1
2026-11-25T08:10:20.844-03:00  INFO 3618312 --- [           main] [a486c9bf-8b9a-4fbc-bbe5-3d63a0d76260] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 21ms userId=1 planId=1
2026-11-25T08:10:20.885-03:00  INFO 3618312 --- [           main] [cf372ee4-e4b3-4ab7-a334-eea50e1b30fa] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 31ms userId=1 planId=1
2026-11-25T08:10:20.902-03:00  INFO 3618312 --- [           main] [dcf939e0-b956-4cd1-9489-0b15cea41467] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/{id} 200 15ms userId=1 planId=1
2026-11-25T08:10:20.944-03:00  INFO 3618312 --- [           main] [4b9eed4a-1adc-4d5a-8b98-d159f0ad6e98] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/{id} 200 39ms userId=1 planId=1
2026-11-25T08:10:20.984-03:00  INFO 3618312 --- [           main] [bdcb917b-a519-44b2-a027-d33a1970fec0] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 200 38ms userId=1 planId=1
2026-11-25T08:10:21.010-03:00  INFO 3618312 --- [           main] [995a4a9a-1ea1-42aa-bc01-12dd029d585c] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts/{id}/statement 200 23ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactSharesIT#markingAContac` - exit 0

```
2026-11-25T08:10:42.905-03:00  WARN 3618811 --- [           main] [354a05f1-0cf0-4c83-8956-23c6f66260d5] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#items()
2026-11-25T08:10:42.906-03:00  WARN 3618811 --- [           main] [354a05f1-0cf0-4c83-8956-23c6f66260d5] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#allocations()
2026-11-25T08:10:42.906-03:00  WARN 3618811 --- [           main] [354a05f1-0cf0-4c83-8956-23c6f66260d5] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-25T08:10:43.086-03:00  INFO 3618811 --- [           main] [354a05f1-0cf0-4c83-8956-23c6f66260d5] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 296ms userId=1 planId=1
2026-11-25T08:10:43.134-03:00  INFO 3618811 --- [           main] [c9608556-6197-4b3a-b2aa-f3a8049b7389] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/{id}/kind 422 37ms userId=1 planId=1
2026-11-25T08:10:43.174-03:00  INFO 3618811 --- [           main] [e74aa192-819c-4dea-920d-7682ce476577] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/{id}/kind 422 15ms userId=1 planId=1
2026-11-25T08:10:43.189-03:00  INFO 3618811 --- [           main] [2e04c70b-9404-47a6-8b81-d07fca1e6bc3] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/{id}/kind 422 12ms userId=1 planId=1
2026-11-25T08:10:43.201-03:00  INFO 3618811 --- [           main] [3fc894f5-903b-48e6-94eb-a7cc5914e641] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/{id}/kind 422 10ms userId=1 planId=1
2026-11-25T08:10:43.215-03:00  INFO 3618811 --- [           main] [6dfa31b2-b2a3-4a3b-942e-477b606410fa] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/{id} 200 13ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='ContactsIT#refusesArchiveWithP` - exit 0

```
2026-11-25T08:11:05.509-03:00  INFO 3619271 --- [           main] [c9360bbe-78d1-4ebc-b726-5881dd7617a2] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts/{id}/archive 409 43ms userId=1 planId=1
2026-11-25T08:11:05.548-03:00  INFO 3619271 --- [           main] [ef82e0c1-610e-4cfb-bde7-41a63b12a78f] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts/{id}/archive 409 16ms userId=1 planId=1
2026-11-25T08:11:05.559-03:00  INFO 3619271 --- [           main] [52757390-1aa5-40a7-8097-61713ff858a4] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 10ms userId=1 planId=1
2026-11-25T08:11:05.632-03:00  INFO 3619271 --- [           main] [e19aa6fc-57dd-4d5d-860e-208ff8aecbca] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts/{id}/archive 200 22ms userId=1 planId=1
2026-11-25T08:11:05.685-03:00  INFO 3619271 --- [           main] [d3696338-1e78-41e7-8a90-22079b3cd8a7] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 51ms userId=1 planId=1
2026-11-25T08:11:05.707-03:00  INFO 3619271 --- [           main] [44e0ccd9-7c96-4ad2-9acf-2bf3f8775941] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts/{id}/archive 200 18ms userId=1 planId=1
2026-11-25T08:11:05.725-03:00  INFO 3619271 --- [           main] [57faa609-83f9-45ad-b908-0c52c6fb2758] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/{id} 200 16ms userId=1 planId=1
2026-11-25T08:11:05.753-03:00  INFO 3619271 --- [           main] [4189e87f-58fa-4725-8f4f-69aaed1d7f3b] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/contacts/{id}/archive 200 25ms userId=1 planId=1
2026-11-25T08:11:05.773-03:00  INFO 3619271 --- [           main] [fec72464-9be5-4b60-b140-735eec38259a] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts 200 18ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='RepaymentsIT#aPurchaseRestoreW` - exit 0

```
2026-11-25T08:11:27.859-03:00  WARN 3619735 --- [           main] [4e50b34f-0dc6-4e7c-b8cb-f23e0fe544a0] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-25T08:11:27.859-03:00  WARN 3619735 --- [           main] [4e50b34f-0dc6-4e7c-b8cb-f23e0fe544a0] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#allocations()
2026-11-25T08:11:27.859-03:00  WARN 3619735 --- [           main] [4e50b34f-0dc6-4e7c-b8cb-f23e0fe544a0] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#items()
2026-11-25T08:11:27.859-03:00  WARN 3619735 --- [           main] [4e50b34f-0dc6-4e7c-b8cb-f23e0fe544a0] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-25T08:11:27.859-03:00  WARN 3619735 --- [           main] [4e50b34f-0dc6-4e7c-b8cb-f23e0fe544a0] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: allocations
2026-11-25T08:11:28.029-03:00  INFO 3619735 --- [           main] [4e50b34f-0dc6-4e7c-b8cb-f23e0fe544a0] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 280ms userId=1 planId=1
2026-11-25T08:11:28.069-03:00  INFO 3619735 --- [           main] [ccb71c7d-6b8a-40d1-9e6b-49e2cdca0fe7] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/{id} 200 29ms userId=1 planId=1
2026-11-25T08:11:29.679-03:00  INFO 3619735 --- [pool-3-thread-1] [9d5ae32b-798b-42fa-b0b1-9e8a8021f757] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 200 1605ms userId=1 planId=1
2026-11-25T08:11:29.722-03:00  INFO 3619735 --- [           main] [1d4fdebb-b446-42e6-84da-31b73833877c] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/contacts/{id}/statement 200 41ms userId=1 planId=1
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```
