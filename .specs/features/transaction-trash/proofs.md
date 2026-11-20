# transaction-trash proofs

**HEAD**: ba2ed305
**Tree**: clean
**Shell**: /bin/sh
**Result**: 36 pass, 0 fail

| Check | Proof | Result |
| --- | --- | --- |
| C1 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionTrashIT#deleteAnswe` | pass |
| C2 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionTrashIT#seriesDelet` | pass |
| C3 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionTrashIT#singleDelet` | pass |
| C4 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionTrashIT#trashedTran` | pass |
| C5 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionTrashIT#trashedSeri` | pass |
| C6 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionTrashIT#trashedRows` | pass |
| C7 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionTrashIT#restoreBrin` | pass |
| C8 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionTrashIT#restoreOnly` | pass |
| C9 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionTrashIT#restoreFoll` | pass |
| C10 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionTrashIT#restoreAllR` | pass |
| C11 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionTrashIT#restoreAfte` | pass |
| C11 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionTrashIT#restoreAfte` | pass |
| C12 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionTrashIT#restoreOfAM` | pass |
| C13 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionTrashIT#restoreWith` | pass |
| C14 | `run unit / ✓ TransactionsPage > undo in the delete toast restores the transaction` | pass |
| C15 | `run unit / ✓ TransactionsPage > undo in the series delete toast restores the series` | pass |
| C16 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionTrashIT#trashListsD` | pass |
| C17 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionTrashIT#contributor` | pass |
| C18 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='PlanAuthorizationMatrixIT#each` | pass |
| C19 | `run unit / ✓ PlanTrashSection > hides the trash from a viewer` | pass |
| C20 | `run stories / ✓ PlanTrashListView.stories.tsx > Entries` | pass |
| C21 | `run unit / ✓ PlanTrashSection > restoring an entry removes it and refreshes transactions` | pass |
| C22 | `run stories / ✓ PlanTrashListView.stories.tsx > Empty` | pass |
| C23 | `run stories / ✓ PlanTrashListView.stories.tsx > Load Error` | pass |
| C24 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionTrashPurgeIT#purges` | pass |
| C25 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='PlanSchemaIT#everyForeignKeyTo` | pass |
| C25 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='PlanPermanentDeletionIT#deleti` | pass |
| C26 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionTrashIT#reimportSki` | pass |
| C27 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionTrashIT#categoryDel` | pass |
| C28 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionTrashIT#restoreAfte` | pass |
| C29 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionTrashIT#restoreOccu` | pass |
| C30 | `run stories / ✓ PlanTrashListView.stories.tsx > Newest Only` | pass |
| Build | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -DskipITs -Dsurefire.skip=true` | pass |
| Build | `cd frontend && pnpm lint` | pass |
| Build | `cd frontend && pnpm build` | pass |
| Build | `cd frontend && node scripts/check-siblings.ts` | pass |

## Output

`Run unit` - exit 0

```
Creating Table Instance...

 ✓ |unit| src/features/transactions/TransactionsPage.test.tsx > TransactionsPage period navigator (PNAV-01, PNAV-02) > replaces a custom range with the This month preset (PNAV-03 AC 1) 176ms
stdout | src/features/transactions/TransactionsPage.test.tsx > TransactionsPage period navigator (PNAV-01, PNAV-02) > ignores the pre-feature from and to params and opens on the current month (PNAV-05)
Creating Table Instance...

 ✓ |unit| src/features/transactions/TransactionsPage.test.tsx > TransactionsPage period navigator (PNAV-01, PNAV-02) > keeps the period when all filters are cleared (PNAV-02 AC 4) 164ms
 ✓ |unit| src/features/transactions/TransactionsPage.test.tsx > TransactionsPage period navigator (PNAV-01, PNAV-02) > ignores the pre-feature from and to params and opens on the current month (PNAV-05) 29ms

 Test Files  3 passed (3)
      Tests  58 passed (58)
   Start at  00:36:23
   Duration  15.39s (transform 730ms, setup 332ms, collect 7.45s, tests 11.41s, environment 1.46s, prepare 199ms)

No story files found for the specified pattern: src/**/*.mdx
```

`Run stories` - exit 0

```
info Using tsconfig paths for react-docgen
info Using tsconfig paths for react-docgen
info Using tsconfig paths for react-docgen
 ✓ |storybook (chromium)| src/features/plans/components/PlanTrashListView.stories.tsx > Entries 292ms
 ✓ |storybook (chromium)| src/features/plans/components/PlanTrashListView.stories.tsx > Newest Only 37ms
 ✓ |storybook (chromium)| src/features/plans/components/PlanTrashListView.stories.tsx > Empty 31ms
 ✓ |storybook (chromium)| src/features/plans/components/PlanTrashListView.stories.tsx > Load Error 42ms
 ✓ |storybook (chromium)| src/features/plans/components/PlanTrashListView.stories.tsx > Restoring 37ms

 Test Files  1 passed (1)
      Tests  5 passed (5)
   Start at  00:36:41
   Duration  2.11s (transform 0ms, setup 409ms, collect 156ms, tests 440ms, environment 0ms, prepare 2.70s)

No story files found for the specified pattern: src/**/*.mdx
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionTrashIT#deleteAnswe` - exit 0

```
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-19T00:37:10.207-03:00  WARN 1920234 --- [           main] [de14c868-7ee1-43c9-880f-11b4e1dae0f3] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-19T00:37:10.212-03:00  WARN 1920234 --- [           main] [de14c868-7ee1-43c9-880f-11b4e1dae0f3] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-19T00:37:10.212-03:00  WARN 1920234 --- [           main] [de14c868-7ee1-43c9-880f-11b4e1dae0f3] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List)
2026-11-19T00:37:10.212-03:00  WARN 1920234 --- [           main] [de14c868-7ee1-43c9-880f-11b4e1dae0f3] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List)
2026-11-19T00:37:10.213-03:00  WARN 1920234 --- [           main] [de14c868-7ee1-43c9-880f-11b4e1dae0f3] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#participants()
2026-11-19T00:37:10.213-03:00  WARN 1920234 --- [           main] [de14c868-7ee1-43c9-880f-11b4e1dae0f3] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#items()
2026-11-19T00:37:10.380-03:00  INFO 1920234 --- [           main] [de14c868-7ee1-43c9-880f-11b4e1dae0f3] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 312ms userId=1 planId=1
2026-11-19T00:37:10.410-03:00  INFO 1920234 --- [           main] [4f6d63d1-17cf-4446-b9d1-784e11104a91] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 19ms userId=1 planId=1
2026-11-19T00:37:10.493-03:00  INFO 1920234 --- [           main] [d0e2b323-fb00-4bd2-877e-fa12cec15b6a] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/dashboard 200 80ms userId=1 planId=1
2026-11-19T00:37:10.573-03:00  INFO 1920234 --- [           main] [bee88098-d2a3-461e-9a51-b4596a1d3d5e] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/{id} 200 29ms userId=1 planId=1
2026-11-19T00:37:10.702-03:00  INFO 1920234 --- [           main] [847b977d-569c-41d8-a3bf-c61e82faddd1] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction 200 87ms userId=1 planId=1
2026-11-19T00:37:10.737-03:00  INFO 1920234 --- [           main] [1b28b6c1-b641-4120-b2b5-4618da40461f] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/dashboard 200 26ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionTrashIT#seriesDelet` - exit 0

```
2026-11-19T00:37:37.921-03:00  INFO 1921162 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-19T00:37:37.922-03:00  INFO 1921162 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-19T00:37:37.988-03:00  INFO 1921162 --- [           main] [] c.l.f.transaction.TransactionTrashIT     : Started TransactionTrashIT in 12.733 seconds (process running for 14.265)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-19T00:37:38.558-03:00  WARN 1921162 --- [           main] [2f4a1cd4-e823-40d7-85f2-ac2c8215eda4] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-19T00:37:38.561-03:00  WARN 1921162 --- [           main] [2f4a1cd4-e823-40d7-85f2-ac2c8215eda4] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-19T00:37:38.562-03:00  WARN 1921162 --- [           main] [2f4a1cd4-e823-40d7-85f2-ac2c8215eda4] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-19T00:37:38.760-03:00  INFO 1921162 --- [           main] [2f4a1cd4-e823-40d7-85f2-ac2c8215eda4] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 316ms userId=1 planId=1
2026-11-19T00:37:38.855-03:00  INFO 1921162 --- [           main] [c056e4b3-3a6d-4fa6-ae32-91e7a6fb5ec4] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 84ms userId=1 planId=1
2026-11-19T00:37:38.992-03:00  INFO 1921162 --- [           main] [c0eac894-b1cd-459a-831f-cfb82b0839c3] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction 200 86ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionTrashIT#singleDelet` - exit 0

```
2026-11-19T00:38:05.466-03:00  INFO 1921931 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-19T00:38:05.468-03:00  INFO 1921931 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 2 ms
2026-11-19T00:38:05.547-03:00  INFO 1921931 --- [           main] [] c.l.f.transaction.TransactionTrashIT     : Started TransactionTrashIT in 12.265 seconds (process running for 13.565)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-19T00:38:06.281-03:00  WARN 1921931 --- [           main] [888f235a-a994-4c16-832d-c2c2bbe21963] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-19T00:38:06.288-03:00  WARN 1921931 --- [           main] [888f235a-a994-4c16-832d-c2c2bbe21963] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-19T00:38:06.289-03:00  WARN 1921931 --- [           main] [888f235a-a994-4c16-832d-c2c2bbe21963] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-19T00:38:06.557-03:00  INFO 1921931 --- [           main] [888f235a-a994-4c16-832d-c2c2bbe21963] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 446ms userId=1 planId=1
2026-11-19T00:38:06.668-03:00  INFO 1921931 --- [           main] [7635dee9-47ff-4952-9400-931d86faaa11] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/{id} 200 95ms userId=1 planId=1
2026-11-19T00:38:06.799-03:00  INFO 1921931 --- [           main] [ee943510-aca0-44be-8f3e-5a811fed5636] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 120ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionTrashIT#trashedTran` - exit 0

```
2026-11-19T00:38:33.388-03:00  WARN 1922917 --- [           main] [4dcf789a-c25e-4b8a-b8f7-f0adadad2016] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-19T00:38:33.389-03:00  WARN 1922917 --- [           main] [4dcf789a-c25e-4b8a-b8f7-f0adadad2016] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-19T00:38:33.389-03:00  WARN 1922917 --- [           main] [4dcf789a-c25e-4b8a-b8f7-f0adadad2016] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#items()
2026-11-19T00:38:33.389-03:00  WARN 1922917 --- [           main] [4dcf789a-c25e-4b8a-b8f7-f0adadad2016] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#participants()
2026-11-19T00:38:33.389-03:00  WARN 1922917 --- [           main] [4dcf789a-c25e-4b8a-b8f7-f0adadad2016] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#com.lcs.findraco.transaction.request.UpdateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, Long)
2026-11-19T00:38:33.389-03:00  WARN 1922917 --- [           main] [4dcf789a-c25e-4b8a-b8f7-f0adadad2016] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#com.lcs.findraco.transaction.request.UpdateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, Long)
2026-11-19T00:38:33.428-03:00  INFO 1922917 --- [           main] [4dcf789a-c25e-4b8a-b8f7-f0adadad2016] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/{id} 404 55ms userId=1 planId=1
2026-11-19T00:38:33.456-03:00  INFO 1922917 --- [           main] [361cffc1-3670-4e25-9a62-68c43153e50d] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/{id}/confirm 404 26ms userId=1 planId=1
2026-11-19T00:38:33.475-03:00  INFO 1922917 --- [           main] [68979bc4-198c-4611-8fb5-6a3de6ef4981] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/{id} 404 16ms userId=1 planId=1
2026-11-19T00:38:33.490-03:00  WARN 1922917 --- [           main] [0ca72007-6824-4f2e-b75a-af84e220a252] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-19T00:38:33.490-03:00  WARN 1922917 --- [           main] [0ca72007-6824-4f2e-b75a-af84e220a252] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-19T00:38:33.491-03:00  WARN 1922917 --- [           main] [0ca72007-6824-4f2e-b75a-af84e220a252] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-19T00:38:33.535-03:00  INFO 1922917 --- [           main] [0ca72007-6824-4f2e-b75a-af84e220a252] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 58ms userId=1 planId=1
2026-11-19T00:38:33.625-03:00  INFO 1922917 --- [           main] [c2ff04e0-7221-4f28-8af1-e9feef939495] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 86ms userId=1 planId=1
2026-11-19T00:38:33.648-03:00  INFO 1922917 --- [           main] [a86029f8-e678-4519-a50d-be3b36138aa3] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/series/{seriesId} 404 21ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionTrashIT#trashedSeri` - exit 0

```
2026-11-19T00:39:00.372-03:00  INFO 1923900 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-19T00:39:00.372-03:00  INFO 1923900 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-19T00:39:00.374-03:00  INFO 1923900 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 2 ms
2026-11-19T00:39:00.453-03:00  INFO 1923900 --- [           main] [] c.l.f.transaction.TransactionTrashIT     : Started TransactionTrashIT in 10.987 seconds (process running for 12.645)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-19T00:39:01.023-03:00  WARN 1923900 --- [           main] [b6e3fd3f-ff5b-4ef8-99a5-f8fd96fe0c7b] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-19T00:39:01.027-03:00  WARN 1923900 --- [           main] [b6e3fd3f-ff5b-4ef8-99a5-f8fd96fe0c7b] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-19T00:39:01.028-03:00  WARN 1923900 --- [           main] [b6e3fd3f-ff5b-4ef8-99a5-f8fd96fe0c7b] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-19T00:39:01.214-03:00  INFO 1923900 --- [           main] [b6e3fd3f-ff5b-4ef8-99a5-f8fd96fe0c7b] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 300ms userId=1 planId=1
2026-11-19T00:39:01.337-03:00  INFO 1923900 --- [           main] [90887b6b-9f62-4545-9f6d-933107973d06] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 109ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionTrashIT#trashedRows` - exit 0

```
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-19T00:39:28.873-03:00  WARN 1924875 --- [           main] [b48017cb-4bd6-4d2b-a2b8-c24155dc2a55] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-19T00:39:28.876-03:00  WARN 1924875 --- [           main] [b48017cb-4bd6-4d2b-a2b8-c24155dc2a55] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#participants()
2026-11-19T00:39:28.877-03:00  WARN 1924875 --- [           main] [b48017cb-4bd6-4d2b-a2b8-c24155dc2a55] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#items()
2026-11-19T00:39:28.877-03:00  WARN 1924875 --- [           main] [b48017cb-4bd6-4d2b-a2b8-c24155dc2a55] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-19T00:39:28.877-03:00  WARN 1924875 --- [           main] [b48017cb-4bd6-4d2b-a2b8-c24155dc2a55] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List)
2026-11-19T00:39:28.877-03:00  WARN 1924875 --- [           main] [b48017cb-4bd6-4d2b-a2b8-c24155dc2a55] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List)
2026-11-19T00:39:29.008-03:00  INFO 1924875 --- [           main] [b48017cb-4bd6-4d2b-a2b8-c24155dc2a55] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 253ms userId=1 planId=1
2026-11-19T00:39:29.062-03:00  INFO 1924875 --- [           main] [5d589537-bc7b-481f-91bb-c15820de635b] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 36ms userId=1 planId=1
2026-11-19T00:39:29.092-03:00  INFO 1924875 --- [           main] [1826925a-278d-4e25-92ee-830160fa914a] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/{id} 200 28ms userId=1 planId=1
2026-11-19T00:39:29.171-03:00  INFO 1924875 --- [           main] [6f573e1d-652c-410e-9e51-c4007f9a7384] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/dashboard 200 77ms userId=1 planId=1
2026-11-19T00:39:29.256-03:00  INFO 1924875 --- [           main] [4a5e0e6d-43c5-4cea-a432-a7103d4fb211] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/dashboard/trend 200 22ms userId=1 planId=1
2026-11-19T00:39:29.319-03:00  INFO 1924875 --- [           main] [67a1d41d-624e-40f1-8cdc-8ce846419032] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/category/spending 200 61ms userId=1 planId=1
2026-11-19T00:39:29.341-03:00  INFO 1924875 --- [           main] [08f6b855-5ee6-4c9e-967b-d61ee1c037a7] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/category/{id}/usage 200 20ms userId=1 planId=1
2026-11-19T00:39:29.430-03:00  INFO 1924875 --- [           main] [9a2800ea-9e5c-4e34-8ac8-cea650e6b749] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction 200 85ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionTrashIT#restoreBrin` - exit 0

```
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-19T00:39:58.000-03:00  WARN 1925857 --- [           main] [b89eb5c3-cfb4-41b2-9549-ea081d32739a] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-19T00:39:58.003-03:00  WARN 1925857 --- [           main] [b89eb5c3-cfb4-41b2-9549-ea081d32739a] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-19T00:39:58.004-03:00  WARN 1925857 --- [           main] [b89eb5c3-cfb4-41b2-9549-ea081d32739a] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#items()
2026-11-19T00:39:58.004-03:00  WARN 1925857 --- [           main] [b89eb5c3-cfb4-41b2-9549-ea081d32739a] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#participants()
2026-11-19T00:39:58.004-03:00  WARN 1925857 --- [           main] [b89eb5c3-cfb4-41b2-9549-ea081d32739a] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List)
2026-11-19T00:39:58.005-03:00  WARN 1925857 --- [           main] [b89eb5c3-cfb4-41b2-9549-ea081d32739a] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List)
2026-11-19T00:39:58.165-03:00  INFO 1925857 --- [           main] [b89eb5c3-cfb4-41b2-9549-ea081d32739a] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 310ms userId=1 planId=1
2026-11-19T00:39:58.208-03:00  INFO 1925857 --- [           main] [ab173969-d3d6-42ee-a683-9f8d1cdcfebb] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/{id} 200 32ms userId=1 planId=1
2026-11-19T00:39:58.236-03:00  INFO 1925857 --- [           main] [38177832-873b-4fb1-be0a-417c6eee4916] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/{id} 200 25ms userId=1 planId=1
2026-11-19T00:39:58.290-03:00  INFO 1925857 --- [           main] [6cf829f9-3b3b-4136-a18b-7a2993df3ebc] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 200 52ms userId=1 planId=1
2026-11-19T00:39:58.336-03:00  INFO 1925857 --- [           main] [ca067e58-dda5-4b5d-93e8-465c5c68cfaa] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/{id} 200 19ms userId=1 planId=1
2026-11-19T00:39:58.499-03:00  INFO 1925857 --- [           main] [c59b9b1a-6b54-4264-aa85-5ac6ca2df4e5] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction 200 88ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionTrashIT#restoreOnly` - exit 0

```
2026-11-19T00:40:26.674-03:00  INFO 1926766 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 2 ms
2026-11-19T00:40:26.749-03:00  INFO 1926766 --- [           main] [] c.l.f.transaction.TransactionTrashIT     : Started TransactionTrashIT in 11.695 seconds (process running for 13.85)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-19T00:40:27.396-03:00  WARN 1926766 --- [           main] [dab38766-0b8e-4b8f-b196-cce0cd8c8ecb] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-19T00:40:27.400-03:00  WARN 1926766 --- [           main] [dab38766-0b8e-4b8f-b196-cce0cd8c8ecb] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-19T00:40:27.400-03:00  WARN 1926766 --- [           main] [dab38766-0b8e-4b8f-b196-cce0cd8c8ecb] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-19T00:40:27.622-03:00  INFO 1926766 --- [           main] [dab38766-0b8e-4b8f-b196-cce0cd8c8ecb] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 361ms userId=1 planId=1
2026-11-19T00:40:27.761-03:00  INFO 1926766 --- [           main] [8f12523a-d27c-423e-b5a4-7a85db3ca40c] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 126ms userId=1 planId=1
2026-11-19T00:40:27.873-03:00  INFO 1926766 --- [           main] [b8d73e06-8d80-41a5-95ba-2dfb98a65ed0] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 200 49ms userId=1 planId=1
2026-11-19T00:40:27.996-03:00  INFO 1926766 --- [           main] [871e80f6-54bd-4d9b-a064-b45a3b377c76] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction 200 84ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionTrashIT#restoreFoll` - exit 0

```
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
2026-11-19T00:40:55.920-03:00  WARN 1927709 --- [           main] [d8f887fd-2621-414c-a8c1-4715817fd2aa] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-19T00:40:55.924-03:00  WARN 1927709 --- [           main] [d8f887fd-2621-414c-a8c1-4715817fd2aa] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-19T00:40:55.924-03:00  WARN 1927709 --- [           main] [d8f887fd-2621-414c-a8c1-4715817fd2aa] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-19T00:40:56.125-03:00  INFO 1927709 --- [           main] [d8f887fd-2621-414c-a8c1-4715817fd2aa] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 343ms userId=1 planId=1
2026-11-19T00:40:56.226-03:00  INFO 1927709 --- [           main] [1f459225-7261-4fce-b583-fb48f19f4f21] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 89ms userId=1 planId=1
2026-11-19T00:40:56.251-03:00  INFO 1927709 --- [           main] [3ec6fe43-544a-48cf-a29f-8d9b53a6b877] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 23ms userId=1 planId=1
2026-11-19T00:40:56.339-03:00  INFO 1927709 --- [           main] [ea01237e-8dbb-416c-8b8f-8ec1d03e297c] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 200 42ms userId=1 planId=1
2026-11-19T00:40:56.381-03:00  INFO 1927709 --- [           main] [c7549cb8-94c0-4f77-9ed2-0acc79cb7a69] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 14ms userId=1 planId=1
2026-11-19T00:40:56.456-03:00  INFO 1927709 --- [           main] [d0235623-5383-4f42-b840-97585d05c0aa] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction 200 73ms userId=1 planId=1
2026-11-19T00:40:56.516-03:00  INFO 1927709 --- [           main] [0b2c2e50-d05e-4142-b670-665d0fad1e2d] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 51ms userId=1 planId=1
2026-11-19T00:40:56.557-03:00  INFO 1927709 --- [           main] [849b1b4a-6c27-406e-be88-66aacb0f1b8c] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 39ms userId=1 planId=1
2026-11-19T00:40:56.571-03:00  INFO 1927709 --- [           main] [eef14948-3ba6-4d9c-be7d-5cddc1d26931] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 12ms userId=1 planId=1
2026-11-19T00:40:56.612-03:00  INFO 1927709 --- [           main] [eab7b205-e14a-474b-8764-c14a7ba17c20] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 200 38ms userId=1 planId=1
2026-11-19T00:40:56.625-03:00  INFO 1927709 --- [           main] [0b6850f9-753c-45ad-8985-f0442ad2ffb8] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 11ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionTrashIT#restoreAllR` - exit 0

```
2026-11-19T00:41:24.333-03:00  INFO 1928633 --- [           main] [] c.l.f.transaction.TransactionTrashIT     : Started TransactionTrashIT in 13.112 seconds (process running for 14.747)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-19T00:41:25.016-03:00  WARN 1928633 --- [           main] [31a3f771-7367-4fb7-827c-94fe3cd1b6ad] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-19T00:41:25.019-03:00  WARN 1928633 --- [           main] [31a3f771-7367-4fb7-827c-94fe3cd1b6ad] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-19T00:41:25.019-03:00  WARN 1928633 --- [           main] [31a3f771-7367-4fb7-827c-94fe3cd1b6ad] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-19T00:41:25.234-03:00  INFO 1928633 --- [           main] [31a3f771-7367-4fb7-827c-94fe3cd1b6ad] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 362ms userId=1 planId=1
2026-11-19T00:41:25.350-03:00  INFO 1928633 --- [           main] [5e86b776-7e0e-483d-a94e-719bcc3888cd] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 103ms userId=1 planId=1
2026-11-19T00:41:25.405-03:00  INFO 1928633 --- [           main] [f97368f3-bf7b-4dd9-a2a2-ab365ce779f6] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction 200 54ms userId=1 planId=1
2026-11-19T00:41:25.529-03:00  INFO 1928633 --- [           main] [0f23d186-5296-431e-ad0c-5cb701a403bd] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 200 62ms userId=1 planId=1
2026-11-19T00:41:25.603-03:00  INFO 1928633 --- [           main] [1eecb2ed-819d-4a49-8eca-ceea7a072b54] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction 200 45ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionTrashIT#restoreAfte` - exit 0

```
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-19T00:41:51.771-03:00  WARN 1929444 --- [           main] [9942dc2a-6269-4159-81c9-3ea0e1a5bb1c] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-19T00:41:51.775-03:00  WARN 1929444 --- [           main] [9942dc2a-6269-4159-81c9-3ea0e1a5bb1c] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-19T00:41:51.775-03:00  WARN 1929444 --- [           main] [9942dc2a-6269-4159-81c9-3ea0e1a5bb1c] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-19T00:41:52.070-03:00  INFO 1929444 --- [           main] [9942dc2a-6269-4159-81c9-3ea0e1a5bb1c] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 442ms userId=1 planId=1
2026-11-19T00:41:52.219-03:00  INFO 1929444 --- [           main] [78ab7e32-bb81-423b-a803-eb56644e1e65] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 121ms userId=1 planId=1
2026-11-19T00:41:52.286-03:00  INFO 1929444 --- [           main] [817eabdc-52db-4dc7-89c4-4e96d1fd6c13] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 60ms userId=1 planId=1
2026-11-19T00:41:52.317-03:00  INFO 1929444 --- [           main] [81c1fcff-b2a3-4877-ac9d-692d5f775b5d] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 27ms userId=1 planId=1
2026-11-19T00:41:52.360-03:00  INFO 1929444 --- [           main] [8b4ae4a9-7eae-49ca-ad74-4a3a653101db] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 409 41ms userId=1 planId=1
2026-11-19T00:41:52.524-03:00  INFO 1929444 --- [           main] [1260215d-24a2-479e-b396-7c8fb91194f5] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 19ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionTrashIT#restoreAfte` - exit 0

```
2026-11-19T00:42:17.936-03:00  INFO 1930426 --- [           main] [] c.l.f.transaction.TransactionTrashIT     : Started TransactionTrashIT in 10.216 seconds (process running for 11.567)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
2026-11-19T00:42:18.735-03:00  WARN 1930426 --- [           main] [ab811088-daca-41b3-98fc-b63439d86fdf] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-19T00:42:18.739-03:00  WARN 1930426 --- [           main] [ab811088-daca-41b3-98fc-b63439d86fdf] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-19T00:42:18.740-03:00  WARN 1930426 --- [           main] [ab811088-daca-41b3-98fc-b63439d86fdf] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-19T00:42:18.987-03:00  INFO 1930426 --- [           main] [ab811088-daca-41b3-98fc-b63439d86fdf] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 418ms userId=1 planId=1
2026-11-19T00:42:19.132-03:00  INFO 1930426 --- [           main] [01160c4e-332c-45f6-a257-eb8d05d31037] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 128ms userId=1 planId=1
2026-11-19T00:42:19.211-03:00  INFO 1930426 --- [           main] [425f31b6-896c-4bfa-a434-bef0e9892340] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 74ms userId=1 planId=1
2026-11-19T00:42:19.263-03:00  INFO 1930426 --- [           main] [94cc31ce-c8e4-459b-96a2-808c77f94396] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 409 50ms userId=1 planId=1
2026-11-19T00:42:19.438-03:00  INFO 1930426 --- [           main] [7c370450-2b06-478b-88a8-bc208ec76d18] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction 200 123ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionTrashIT#restoreOfAM` - exit 0

```
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-19T00:42:46.831-03:00  WARN 1931402 --- [           main] [bd2621e4-84a9-4f2b-811c-0a381fdc67fb] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-19T00:42:46.835-03:00  WARN 1931402 --- [           main] [bd2621e4-84a9-4f2b-811c-0a381fdc67fb] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List)
2026-11-19T00:42:46.835-03:00  WARN 1931402 --- [           main] [bd2621e4-84a9-4f2b-811c-0a381fdc67fb] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List)
2026-11-19T00:42:46.835-03:00  WARN 1931402 --- [           main] [bd2621e4-84a9-4f2b-811c-0a381fdc67fb] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#participants()
2026-11-19T00:42:46.836-03:00  WARN 1931402 --- [           main] [bd2621e4-84a9-4f2b-811c-0a381fdc67fb] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#items()
2026-11-19T00:42:46.836-03:00  WARN 1931402 --- [           main] [bd2621e4-84a9-4f2b-811c-0a381fdc67fb] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-19T00:42:46.978-03:00  INFO 1931402 --- [           main] [bd2621e4-84a9-4f2b-811c-0a381fdc67fb] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 278ms userId=1 planId=1
2026-11-19T00:42:47.022-03:00  INFO 1931402 --- [           main] [feb8033b-df9b-4983-8219-d62da2763514] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/{id} 200 32ms userId=1 planId=1
2026-11-19T00:42:47.050-03:00  INFO 1931402 --- [           main] [a5b93dde-c81a-4c55-afe5-d93ad2b2ea9f] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 404 27ms userId=1 planId=1
2026-11-19T00:42:47.096-03:00  INFO 1931402 --- [           main] [e4d27765-8e88-4c1f-8cec-0e007be605bf] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 404 13ms userId=1 planId=2
2026-11-19T00:42:47.140-03:00  INFO 1931402 --- [           main] [3b2db1a8-297d-409f-9bd0-d0a0e6d912a9] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 200 42ms userId=1 planId=1
2026-11-19T00:42:47.154-03:00  INFO 1931402 --- [           main] [0e3ee721-6378-48d7-a4c8-ce1c29afdbb1] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 404 12ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionTrashIT#restoreWith` - exit 0

```
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-19T00:43:15.861-03:00  WARN 1932390 --- [           main] [865f3053-531c-4a74-9683-04b2f644c58c] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-19T00:43:15.864-03:00  WARN 1932390 --- [           main] [865f3053-531c-4a74-9683-04b2f644c58c] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List)
2026-11-19T00:43:15.865-03:00  WARN 1932390 --- [           main] [865f3053-531c-4a74-9683-04b2f644c58c] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List)
2026-11-19T00:43:15.865-03:00  WARN 1932390 --- [           main] [865f3053-531c-4a74-9683-04b2f644c58c] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#participants()
2026-11-19T00:43:15.865-03:00  WARN 1932390 --- [           main] [865f3053-531c-4a74-9683-04b2f644c58c] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-19T00:43:15.865-03:00  WARN 1932390 --- [           main] [865f3053-531c-4a74-9683-04b2f644c58c] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#items()
2026-11-19T00:43:16.009-03:00  INFO 1932390 --- [           main] [865f3053-531c-4a74-9683-04b2f644c58c] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 266ms userId=1 planId=1
2026-11-19T00:43:16.058-03:00  INFO 1932390 --- [           main] [b21cef5a-8d46-4475-8433-c22fdcf267d6] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/{id} 200 36ms userId=2 planId=1
2026-11-19T00:43:16.111-03:00  INFO 1932390 --- [           main] [cd19ef69-3a81-4973-9524-d41c96c46e80] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 403 47ms userId=2 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionTrashIT#trashListsD` - exit 0

```
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-19T00:43:45.370-03:00  WARN 1933311 --- [           main] [8a30b87b-7b78-4aa3-92c7-fb052f36dcc9] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#items()
2026-11-19T00:43:45.374-03:00  WARN 1933311 --- [           main] [8a30b87b-7b78-4aa3-92c7-fb052f36dcc9] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List)
2026-11-19T00:43:45.374-03:00  WARN 1933311 --- [           main] [8a30b87b-7b78-4aa3-92c7-fb052f36dcc9] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List)
2026-11-19T00:43:45.374-03:00  WARN 1933311 --- [           main] [8a30b87b-7b78-4aa3-92c7-fb052f36dcc9] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-19T00:43:45.374-03:00  WARN 1933311 --- [           main] [8a30b87b-7b78-4aa3-92c7-fb052f36dcc9] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-19T00:43:45.375-03:00  WARN 1933311 --- [           main] [8a30b87b-7b78-4aa3-92c7-fb052f36dcc9] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#participants()
2026-11-19T00:43:45.543-03:00  INFO 1933311 --- [           main] [8a30b87b-7b78-4aa3-92c7-fb052f36dcc9] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 297ms userId=1 planId=1
2026-11-19T00:43:45.599-03:00  INFO 1933311 --- [           main] [71294468-175a-412a-9661-9225fb437eb6] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/{id} 200 42ms userId=1 planId=1
2026-11-19T00:43:45.612-03:00  WARN 1933311 --- [           main] [5d3a23e3-7249-4e2e-9104-409af71ba458] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-19T00:43:45.613-03:00  WARN 1933311 --- [           main] [5d3a23e3-7249-4e2e-9104-409af71ba458] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-19T00:43:45.613-03:00  WARN 1933311 --- [           main] [5d3a23e3-7249-4e2e-9104-409af71ba458] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-19T00:43:45.661-03:00  INFO 1933311 --- [           main] [5d3a23e3-7249-4e2e-9104-409af71ba458] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 61ms userId=1 planId=1
2026-11-19T00:43:45.740-03:00  INFO 1933311 --- [           main] [98b43a2a-96ed-41b0-b171-3d1c9db75382] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 76ms userId=1 planId=1
2026-11-19T00:43:45.794-03:00  INFO 1933311 --- [           main] [df5b6abf-3100-4bed-bba9-dc0d14e70eba] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/trash 200 51ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionTrashIT#contributor` - exit 0

```
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-19T00:44:14.431-03:00  WARN 1934279 --- [           main] [1ad9a106-e757-4446-bf63-baeda076ee33] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-19T00:44:14.435-03:00  WARN 1934279 --- [           main] [1ad9a106-e757-4446-bf63-baeda076ee33] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List)
2026-11-19T00:44:14.435-03:00  WARN 1934279 --- [           main] [1ad9a106-e757-4446-bf63-baeda076ee33] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List)
2026-11-19T00:44:14.435-03:00  WARN 1934279 --- [           main] [1ad9a106-e757-4446-bf63-baeda076ee33] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#participants()
2026-11-19T00:44:14.435-03:00  WARN 1934279 --- [           main] [1ad9a106-e757-4446-bf63-baeda076ee33] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#items()
2026-11-19T00:44:14.436-03:00  WARN 1934279 --- [           main] [1ad9a106-e757-4446-bf63-baeda076ee33] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-19T00:44:14.638-03:00  INFO 1934279 --- [           main] [1ad9a106-e757-4446-bf63-baeda076ee33] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 332ms userId=1 planId=1
2026-11-19T00:44:14.670-03:00  INFO 1934279 --- [           main] [750787a5-fce0-4b88-a368-25bc428e1abe] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 20ms userId=2 planId=1
2026-11-19T00:44:14.714-03:00  INFO 1934279 --- [           main] [e2e909ce-3ee9-4d98-8022-a021aa3a46f3] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/{id} 200 42ms userId=1 planId=1
2026-11-19T00:44:14.736-03:00  INFO 1934279 --- [           main] [dbd7a3ca-df38-4074-9aea-593d0bc4c32d] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/{id} 200 19ms userId=2 planId=1
2026-11-19T00:44:14.800-03:00  INFO 1934279 --- [           main] [b307cc98-5d44-472b-ad4c-e08d81f8a691] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/trash 200 62ms userId=2 planId=1
2026-11-19T00:44:14.826-03:00  INFO 1934279 --- [           main] [f3438db7-8384-4699-af65-9e011a9b5c13] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/trash 200 23ms userId=1 planId=1
2026-11-19T00:44:14.949-03:00  INFO 1934279 --- [           main] [3a73c52e-afe6-4340-a5b6-8718ce2bf7aa] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 200 50ms userId=2 planId=1
2026-11-19T00:44:15.067-03:00  INFO 1934279 --- [           main] [a2d1221a-320d-4581-b3ed-84dd6c106f52] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction 200 76ms userId=2 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='PlanAuthorizationMatrixIT#each` - exit 0

```
2026-11-19T00:45:04.189-03:00  INFO 1935188 --- [           main] [d087f0f7-e3e2-4a3c-9c13-e809fd597be9] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/invitation 201 6ms userId=1 planId=1
2026-11-19T00:45:04.200-03:00  INFO 1935188 --- [           main] [ca86d55a-a5b8-4332-8f00-f7067591a51c] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/{id} 200 8ms userId=1 planId=1
2026-11-19T00:45:04.212-03:00  INFO 1935188 --- [           main] [7e28eeee-5fbb-4c0d-b49a-6405be18dca0] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/dashboard/trend 200 10ms userId=2 planId=1
2026-11-19T00:45:04.289-03:00  INFO 1935188 --- [           main] [4fff9fee-c533-4531-81f5-d18c3d19b8b4] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 14ms userId=1 planId=1
2026-11-19T00:45:04.297-03:00  INFO 1935188 --- [           main] [a569a98d-c1fe-47ba-b88b-44c31597bcc1] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/invitation 201 7ms userId=1 planId=1
2026-11-19T00:45:04.309-03:00  INFO 1935188 --- [           main] [b8f97b74-7f82-4115-9a5f-6e29bffe22ce] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/{id} 200 9ms userId=1 planId=1
2026-11-19T00:45:04.324-03:00  INFO 1935188 --- [           main] [45c62fbe-b05a-4561-8d9d-668794d3b605] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/dashboard/trend 200 12ms userId=3 planId=1
2026-11-19T00:45:04.415-03:00  INFO 1935188 --- [           main] [d9891720-4b8f-4f01-a95f-7f23ccddebeb] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 12ms userId=1 planId=1
2026-11-19T00:45:04.421-03:00  INFO 1935188 --- [           main] [ad5b86a4-8421-4487-b82b-17363a90960a] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/invitation 201 6ms userId=1 planId=1
2026-11-19T00:45:04.434-03:00  INFO 1935188 --- [           main] [0342a65d-cf4a-491e-80df-445183a668a1] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/{id} 200 8ms userId=1 planId=1
2026-11-19T00:45:04.448-03:00  INFO 1935188 --- [           main] [82171eb7-48f1-4f03-9673-fb3677a78ddb] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/dashboard/trend 200 12ms userId=4 planId=1
2026-11-19T00:45:04.537-03:00  INFO 1935188 --- [           main] [c3950260-e375-42bd-97b2-2c75e9158d81] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 14ms userId=1 planId=1
2026-11-19T00:45:04.544-03:00  INFO 1935188 --- [           main] [17693c11-4d85-4d9e-87c4-3d6da5aa2585] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/invitation 201 7ms userId=1 planId=1
2026-11-19T00:45:04.555-03:00  INFO 1935188 --- [           main] [774c3bc0-9abe-47c2-a5dc-5a6aed3e2e01] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/{id} 200 7ms userId=1 planId=1
2026-11-19T00:45:04.561-03:00  INFO 1935188 --- [           main] [c4f9945b-9440-4fe3-bcf9-ab761c07ce23] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/dashboard/trend 404 4ms userId=5 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionTrashPurgeIT#purges` - exit 0

```
2026-11-19T00:45:31.406-03:00  WARN 1936450 --- [           main] [3a4c0470-ff3b-4a25-864c-4c21ffd51c18] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#participants()
2026-11-19T00:45:31.406-03:00  WARN 1936450 --- [           main] [3a4c0470-ff3b-4a25-864c-4c21ffd51c18] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-19T00:45:31.406-03:00  WARN 1936450 --- [           main] [3a4c0470-ff3b-4a25-864c-4c21ffd51c18] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-19T00:45:31.407-03:00  WARN 1936450 --- [           main] [3a4c0470-ff3b-4a25-864c-4c21ffd51c18] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List)
2026-11-19T00:45:31.407-03:00  WARN 1936450 --- [           main] [3a4c0470-ff3b-4a25-864c-4c21ffd51c18] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List)
2026-11-19T00:45:31.639-03:00  INFO 1936450 --- [           main] [3a4c0470-ff3b-4a25-864c-4c21ffd51c18] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 428ms userId=1 planId=1
2026-11-19T00:45:31.713-03:00  INFO 1936450 --- [           main] [e6001a67-987f-4555-9e5a-f4824bde6970] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/{id} 200 50ms userId=1 planId=1
2026-11-19T00:45:31.733-03:00  WARN 1936450 --- [           main] [caf8a6ac-93f6-4fba-a596-efa5c813a549] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-19T00:45:31.733-03:00  WARN 1936450 --- [           main] [caf8a6ac-93f6-4fba-a596-efa5c813a549] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-19T00:45:31.734-03:00  WARN 1936450 --- [           main] [caf8a6ac-93f6-4fba-a596-efa5c813a549] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-19T00:45:31.806-03:00  INFO 1936450 --- [           main] [caf8a6ac-93f6-4fba-a596-efa5c813a549] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 89ms userId=1 planId=1
2026-11-19T00:45:31.885-03:00  INFO 1936450 --- [           main] [3c00426f-6de9-4354-bcb5-33d867ae039e] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 76ms userId=1 planId=1
2026-11-19T00:45:31.901-03:00  INFO 1936450 --- [           main] [a5dcced7-e4fe-4240-9bd4-4e1c3206ba21] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 14ms userId=1 planId=1
2026-11-19T00:45:31.915-03:00  INFO 1936450 --- [           main] [dcb971dd-669a-4997-bc34-84ac76ec49e0] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/{id} 200 11ms userId=1 planId=1
2026-11-19T00:45:31.945-03:00  INFO 1936450 --- [           main] [] c.l.f.t.s.TransactionTrashPurgeJob       : Purged 2 trash deletions: [1, 2]
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='PlanSchemaIT#everyForeignKeyTo` - exit 0

```
2026-11-19T00:45:58.919-03:00  INFO 1937434 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Registered tools: 8
2026-11-19T00:45:58.919-03:00  INFO 1937434 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable resources capabilities, notification: true
2026-11-19T00:45:58.921-03:00  INFO 1937434 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable resources templates capabilities, notification: true
2026-11-19T00:45:58.922-03:00  INFO 1937434 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable prompts capabilities, notification: true
2026-11-19T00:45:58.923-03:00  INFO 1937434 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable completions capabilities
2026-11-19T00:45:59.070-03:00  INFO 1937434 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-19T00:45:59.070-03:00  INFO 1937434 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-19T00:45:59.071-03:00  INFO 1937434 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-19T00:45:59.135-03:00  INFO 1937434 --- [           main] [] com.lcs.findraco.plan.PlanSchemaIT       : Started PlanSchemaIT in 10.638 seconds (process running for 12.277)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='PlanPermanentDeletionIT#deleti` - exit 0

```
2026-11-19T00:46:27.375-03:00  WARN 1938378 --- [           main] [d1029467-74d9-4fe9-8b10-4089f431c602] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-19T00:46:27.375-03:00  WARN 1938378 --- [           main] [d1029467-74d9-4fe9-8b10-4089f431c602] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-19T00:46:27.376-03:00  WARN 1938378 --- [           main] [d1029467-74d9-4fe9-8b10-4089f431c602] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-19T00:46:27.427-03:00  INFO 1938378 --- [           main] [d1029467-74d9-4fe9-8b10-4089f431c602] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 63ms userId=1 planId=1
2026-11-19T00:46:27.524-03:00  INFO 1938378 --- [           main] [9edbe994-548b-480d-a763-a7fdfdb6c979] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 94ms userId=1 planId=1
2026-11-19T00:46:27.549-03:00  INFO 1938378 --- [           main] [008bbccf-f7ad-48fe-8ee1-6cce6828e7a5] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/invitation 201 24ms userId=1 planId=1
2026-11-19T00:46:27.572-03:00  INFO 1938378 --- [           main] [b5c50b47-2745-4070-9798-c8b54f064988] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/category 201 17ms userId=1 planId=2
2026-11-19T00:46:27.592-03:00  INFO 1938378 --- [           main] [396262ab-fa14-4ba5-b6bd-217f694b8f70] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/category 201 18ms userId=1 planId=2
2026-11-19T00:46:27.624-03:00  INFO 1938378 --- [           main] [b26439c4-85be-455e-8fed-e95bc21e5351] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 29ms userId=1 planId=2
2026-11-19T00:46:27.664-03:00  INFO 1938378 --- [           main] [000f280a-a431-4ba3-aa36-bc2914ffdd98] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 37ms userId=1 planId=2
2026-11-19T00:46:27.697-03:00  INFO 1938378 --- [           main] [8d8044e1-0afc-4241-9409-ec3e2af00176] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 31ms userId=1 planId=2
2026-11-19T00:46:27.712-03:00  INFO 1938378 --- [           main] [adbc66e7-2322-4d9c-8f32-e7ba27517cc9] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/invitation 201 12ms userId=1 planId=2
2026-11-19T00:46:27.827-03:00  INFO 1938378 --- [           main] [168e3795-a149-4519-88e5-483662870e96] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{id}/permanent 204 33ms userId=1 planId=-
2026-11-19T00:46:27.884-03:00  INFO 1938378 --- [           main] [b29b7237-ebf6-4501-9143-01623e8d4270] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/invitation/{token} 404 16ms userId=- planId=-
2026-11-19T00:46:27.926-03:00  INFO 1938378 --- [           main] [e94c112d-b570-4815-a815-94cb5ee5da02] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/invitation/{token} 200 10ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionTrashIT#reimportSki` - exit 0

```
2026-11-19T00:46:56.210-03:00  INFO 1939336 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-19T00:46:56.210-03:00  INFO 1939336 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-19T00:46:56.212-03:00  INFO 1939336 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 2 ms
2026-11-19T00:46:56.284-03:00  INFO 1939336 --- [           main] [] c.l.f.transaction.TransactionTrashIT     : Started TransactionTrashIT in 12.794 seconds (process running for 14.462)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-19T00:46:57.151-03:00  INFO 1939336 --- [           main] [36a18e7a-7fb1-4632-8349-6881428166ba] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/import 201 314ms userId=1 planId=1
2026-11-19T00:46:57.293-03:00  INFO 1939336 --- [           main] [3d627185-3ad5-4998-ad22-6fd2be6b5556] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction 200 137ms userId=1 planId=1
2026-11-19T00:46:57.330-03:00  INFO 1939336 --- [           main] [10e43a14-dc83-4f35-94ff-1d32177412c0] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/{id} 200 26ms userId=1 planId=1
2026-11-19T00:46:57.351-03:00  INFO 1939336 --- [           main] [06725368-219f-44cc-96f2-d440159ca179] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/import 200 19ms userId=1 planId=1
2026-11-19T00:46:57.452-03:00  INFO 1939336 --- [           main] [26b75639-3fa3-45c0-b5c4-dc1ebcf35f28] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction 200 34ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionTrashIT#categoryDel` - exit 0

```
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
2026-11-19T00:47:25.616-03:00  WARN 1940293 --- [           main] [04dd9bd9-37c6-4bc6-974a-dc64c2c7d9df] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-19T00:47:25.620-03:00  WARN 1940293 --- [           main] [04dd9bd9-37c6-4bc6-974a-dc64c2c7d9df] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#participants()
2026-11-19T00:47:25.620-03:00  WARN 1940293 --- [           main] [04dd9bd9-37c6-4bc6-974a-dc64c2c7d9df] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#items()
2026-11-19T00:47:25.621-03:00  WARN 1940293 --- [           main] [04dd9bd9-37c6-4bc6-974a-dc64c2c7d9df] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List)
2026-11-19T00:47:25.621-03:00  WARN 1940293 --- [           main] [04dd9bd9-37c6-4bc6-974a-dc64c2c7d9df] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List)
2026-11-19T00:47:25.621-03:00  WARN 1940293 --- [           main] [04dd9bd9-37c6-4bc6-974a-dc64c2c7d9df] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-19T00:47:25.820-03:00  INFO 1940293 --- [           main] [04dd9bd9-37c6-4bc6-974a-dc64c2c7d9df] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 351ms userId=1 planId=1
2026-11-19T00:47:25.873-03:00  INFO 1940293 --- [           main] [a17c78c6-64b8-457e-bf57-41c3282ac159] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/{id} 200 39ms userId=1 planId=1
2026-11-19T00:47:26.000-03:00  INFO 1940293 --- [           main] [a91990e2-20d7-4ebd-9563-d3a0381ed3bf] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/category/{id} 204 125ms userId=1 planId=1
2026-11-19T00:47:26.143-03:00  INFO 1940293 --- [           main] [f06c0385-ec5d-4bc1-a8c2-8f2eeae083e4] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 29ms userId=1 planId=1
2026-11-19T00:47:26.168-03:00  INFO 1940293 --- [           main] [5872aea4-875f-488e-8742-ccc3beb99fc5] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/{id} 200 22ms userId=1 planId=1
2026-11-19T00:47:26.228-03:00  INFO 1940293 --- [           main] [4db566e3-4de2-496b-b0a0-ebe049bc9374] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/category/{id} 204 58ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionTrashIT#restoreAfte` - exit 0

```
2026-11-19T00:47:52.599-03:00  WARN 1941094 --- [           main] [edeb3a8e-715d-4373-84d3-b7227d3fbd49] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-19T00:47:52.600-03:00  WARN 1941094 --- [           main] [edeb3a8e-715d-4373-84d3-b7227d3fbd49] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#participants()
2026-11-19T00:47:52.600-03:00  WARN 1941094 --- [           main] [edeb3a8e-715d-4373-84d3-b7227d3fbd49] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-19T00:47:52.601-03:00  WARN 1941094 --- [           main] [edeb3a8e-715d-4373-84d3-b7227d3fbd49] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List)
2026-11-19T00:47:52.601-03:00  WARN 1941094 --- [           main] [edeb3a8e-715d-4373-84d3-b7227d3fbd49] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List)
2026-11-19T00:47:52.873-03:00  INFO 1941094 --- [           main] [edeb3a8e-715d-4373-84d3-b7227d3fbd49] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 458ms userId=1 planId=1
2026-11-19T00:47:52.927-03:00  INFO 1941094 --- [           main] [25fb5a51-49c9-4c2a-aaee-f3fc938026d2] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/{id} 200 36ms userId=1 planId=1
2026-11-19T00:47:53.001-03:00  INFO 1941094 --- [           main] [850ef873-421a-43b8-8bf2-f2f115b1bd1e] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/category/{id} 204 73ms userId=1 planId=1
2026-11-19T00:47:53.052-03:00  INFO 1941094 --- [           main] [7fe0135f-9e7f-48b9-8225-3b7141055b84] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 200 49ms userId=1 planId=1
2026-11-19T00:47:53.081-03:00  INFO 1941094 --- [           main] [2b9f2cb4-306f-410f-b327-9fd7094bd4aa] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/{id} 200 27ms userId=1 planId=1
2026-11-19T00:47:53.163-03:00  INFO 1941094 --- [           main] [bfba14c3-9a0c-4a76-a1f6-5dadac74d6bd] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 23ms userId=1 planId=1
2026-11-19T00:47:53.184-03:00  INFO 1941094 --- [           main] [c4416c16-a1af-4166-916b-de369d6f724a] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/{id} 200 18ms userId=1 planId=1
2026-11-19T00:47:53.229-03:00  INFO 1941094 --- [           main] [92a91bca-41c3-4006-b8f0-7f065e485b7f] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/category/{id} 204 44ms userId=1 planId=1
2026-11-19T00:47:53.252-03:00  INFO 1941094 --- [           main] [2423aad9-ecf5-4db0-afb8-a69b185e4e9b] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 200 21ms userId=1 planId=1
2026-11-19T00:47:53.272-03:00  INFO 1941094 --- [           main] [72bd20da-cbb7-41eb-96fd-8aede6ed320d] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/{id} 200 18ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionTrashIT#restoreOccu` - exit 0

```
2026-11-19T00:48:20.003-03:00  INFO 1942045 --- [           main] [9c4c990a-6e98-4af6-8db9-e497e016a0ba] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 445ms userId=1 planId=1
2026-11-19T00:48:20.173-03:00  INFO 1942045 --- [           main] [6501bc99-cb99-4293-810e-ed5a03fa54be] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 140ms userId=1 planId=1
2026-11-19T00:48:20.242-03:00  INFO 1942045 --- [           main] [c93e996e-71ef-4c66-b4ec-e2f6e4ccde1a] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 66ms userId=1 planId=1
2026-11-19T00:48:20.290-03:00  INFO 1942045 --- [           main] [8ea7d745-defe-4cb4-977c-e0bcb7904f55] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 44ms userId=1 planId=1
2026-11-19T00:48:20.386-03:00  INFO 1942045 --- [           main] [6980b942-fde1-40ab-bb80-5151e97dd89a] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/category/{id} 204 95ms userId=1 planId=1
2026-11-19T00:48:20.427-03:00  INFO 1942045 --- [           main] [92036d40-e015-44d0-8d72-102b75c23061] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 200 38ms userId=1 planId=1
2026-11-19T00:48:20.492-03:00  INFO 1942045 --- [           main] [32469ba2-1b84-48f9-abe4-e18f34bed789] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/{id} 200 25ms userId=1 planId=1
2026-11-19T00:48:20.591-03:00  INFO 1942045 --- [           main] [f0f9ccff-54db-4673-972b-c78a2a0f43aa] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 200 36ms userId=1 planId=1
2026-11-19T00:48:20.615-03:00  INFO 1942045 --- [           main] [df5337bf-ada7-4175-8a6d-da0011ce3faf] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/{id} 200 21ms userId=1 planId=1
2026-11-19T00:48:20.643-03:00  INFO 1942045 --- [           main] [a54a4040-ee7a-4873-9114-7a44875631cf] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 25ms userId=1 planId=1
2026-11-19T00:48:20.685-03:00  INFO 1942045 --- [           main] [98563576-348b-4747-9504-08e719d61e32] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 33ms userId=1 planId=1
2026-11-19T00:48:20.719-03:00  INFO 1942045 --- [           main] [cc1d655e-aa23-4cfe-8f01-a43aea33fc64] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 31ms userId=1 planId=1
2026-11-19T00:48:20.771-03:00  INFO 1942045 --- [           main] [9dd4ea33-2f9e-49aa-afec-2cabfddcf8bd] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 44ms userId=1 planId=1
2026-11-19T00:48:20.810-03:00  INFO 1942045 --- [           main] [61ba9973-b163-4d3d-9cbd-c28ba907f845] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/category/{id} 204 38ms userId=1 planId=1
2026-11-19T00:48:20.841-03:00  INFO 1942045 --- [           main] [bf6b7dbd-55d9-4ba7-9770-00f0c11d1fad] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 409 30ms userId=1 planId=1
```
