# phase1-followups proofs

**HEAD**: e194d713
**Tree**: clean
**Shell**: /bin/sh
**Result**: 23 pass, 0 fail

| Check | Proof | Result |
| --- | --- | --- |
| C1 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TrashRuleRevisionIT#restoreAft` | pass |
| C2 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TrashRuleRevisionIT#restoreAft` | pass |
| C3 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TrashRuleRevisionIT#restoreAft` | pass |
| C4 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TrashRuleRevisionIT#restoreAft` | pass |
| C5 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TrashRuleRevisionIT#restoreAft` | pass |
| C6 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TrashRuleRevisionIT#flagOnlyEd` | pass |
| C7 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='MigrationsIT#ruleRevisionReset` | pass |
| C13 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TrashRuleRevisionIT#restoringO` | pass |
| C15 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TrashRuleRevisionIT#restoringT` | pass |
| C16 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TrashRuleRevisionIT#parcelsCha` | pass |
| C18 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TrashRuleRevisionIT#restoringA` | pass |
| C8 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='FormerMemberEditIT#editKeeping` | pass |
| C9 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='FormerMemberEditIT#seriesEditK` | pass |
| C10 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='FormerMemberEditIT#formerMembe` | pass |
| C11 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureHubIT#updateOfARowSh` | pass |
| C12 | `run stories / ✓ src/features/transactions/components/AttributionFields.stories.tsx > Former Participant` | pass |
| C12 | `run unit / ✓ TransactionFormDrawer > keeps a former member's share when saving` | pass |
| C17 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='FormerMemberEditIT#formerMembe` | pass |
| C14 | `run unit / ✓ TransactionFormDrawer > shows the split of a row shared with a former member in a one-member plan` | pass |
| Build | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -DskipITs -Dsurefire.skip=true` | pass |
| Build | `cd frontend && pnpm lint` | pass |
| Build | `cd frontend && pnpm build` | pass |
| Build | `cd frontend && node scripts/check-siblings.ts` | pass |

## Output

`Run stories` - exit 0

```
info Using tsconfig paths for react-docgen
info Using tsconfig paths for react-docgen
 ✓ |storybook (chromium)| src/features/transactions/components/AttributionFields.stories.tsx > Single Payer 265ms
 ✓ |storybook (chromium)| src/features/transactions/components/AttributionFields.stories.tsx > Someone Else 40ms
 ✓ |storybook (chromium)| src/features/transactions/components/AttributionFields.stories.tsx > Split 71ms
 ✓ |storybook (chromium)| src/features/transactions/components/AttributionFields.stories.tsx > Former Participant 64ms
 ✓ |storybook (chromium)| src/features/transactions/components/AttributionFields.stories.tsx > Former Person 27ms
 ✓ |storybook (chromium)| src/features/transactions/components/AttributionFields.stories.tsx > Split Exact Shares 46ms

 Test Files  1 passed (1)
      Tests  6 passed (6)
   Start at  22:11:19
   Duration  1.92s (transform 0ms, setup 373ms, collect 279ms, tests 514ms, environment 0ms, prepare 2.93s)

No story files found for the specified pattern: src/**/*.mdx
```

`Run unit` - exit 0

```
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer language > shows user data as typed in Portuguese 31ms
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer > series starts requiring confirmation 170ms
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer > status keeps its value when another field changes 169ms
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer > status forecast unconfirms 141ms
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer > keeps a former member's share when saving 72ms
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer > shows the split of a row shared with a former member in a one-member plan 109ms
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer > the date field has no clear button 35ms
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer > one-off shows no confirmation controls 35ms

 Test Files  1 passed (1)
      Tests  34 passed (34)
   Start at  22:11:23
   Duration  7.62s (transform 361ms, setup 94ms, collect 2.79s, tests 4.22s, environment 335ms, prepare 42ms)

No story files found for the specified pattern: src/**/*.mdx
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TrashRuleRevisionIT#restoreAft` - exit 0

```
2026-11-19T22:11:50.544-03:00  INFO 2090103 --- [           main] [] c.l.f.transaction.TrashRuleRevisionIT    : Started TrashRuleRevisionIT in 9.108 seconds (process running for 10.421)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-19T22:11:51.104-03:00  WARN 2090103 --- [           main] [c36a5f82-3350-4a18-909f-a266054338d7] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-19T22:11:51.107-03:00  WARN 2090103 --- [           main] [c36a5f82-3350-4a18-909f-a266054338d7] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-19T22:11:51.108-03:00  WARN 2090103 --- [           main] [c36a5f82-3350-4a18-909f-a266054338d7] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-19T22:11:51.302-03:00  INFO 2090103 --- [           main] [c36a5f82-3350-4a18-909f-a266054338d7] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 303ms userId=1 planId=1
2026-11-19T22:11:51.395-03:00  INFO 2090103 --- [           main] [dad8e76c-a44f-48a1-83cb-ac81b36977ff] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 80ms userId=1 planId=1
2026-11-19T22:11:51.428-03:00  INFO 2090103 --- [           main] [d6c662d6-b1d3-4c20-9b86-d8a37c8e2783] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 31ms userId=1 planId=1
2026-11-19T22:11:51.466-03:00  INFO 2090103 --- [           main] [a4b6a2e2-83ba-4366-ae75-386b187b1987] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 200 36ms userId=1 planId=1
2026-11-19T22:11:51.572-03:00  INFO 2090103 --- [           main] [72c23b34-bee9-4551-86a1-f0df95c2b283] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction 200 79ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TrashRuleRevisionIT#restoreAft` - exit 0

```
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-19T22:12:18.110-03:00  WARN 2090626 --- [           main] [2756e175-0efb-4499-ae3e-34df1db5f458] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-19T22:12:18.113-03:00  WARN 2090626 --- [           main] [2756e175-0efb-4499-ae3e-34df1db5f458] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-19T22:12:18.114-03:00  WARN 2090626 --- [           main] [2756e175-0efb-4499-ae3e-34df1db5f458] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-19T22:12:18.314-03:00  INFO 2090626 --- [           main] [2756e175-0efb-4499-ae3e-34df1db5f458] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 313ms userId=1 planId=1
2026-11-19T22:12:18.410-03:00  INFO 2090626 --- [           main] [e5fa01f2-d640-42ce-b38f-d8c9d6c9704b] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 84ms userId=1 planId=1
2026-11-19T22:12:18.459-03:00  INFO 2090626 --- [           main] [f42f52f2-9d38-459b-8814-830010414cd9] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 43ms userId=1 planId=1
2026-11-19T22:12:18.496-03:00  INFO 2090626 --- [           main] [be69a37d-ea68-44e7-bdb7-ede069a5f299] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 200 35ms userId=1 planId=1
2026-11-19T22:12:18.511-03:00  INFO 2090626 --- [           main] [1ea528b9-90ef-41e2-b8dd-92af1cab1095] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/{id} 200 13ms userId=1 planId=1
2026-11-19T22:12:18.567-03:00  INFO 2090626 --- [           main] [51b78fcc-445c-4839-a56d-26e3881c3b0f] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/{id} 200 14ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TrashRuleRevisionIT#restoreAft` - exit 0

```
2026-11-19T22:12:44.312-03:00  INFO 2091157 --- [           main] [] c.l.f.transaction.TrashRuleRevisionIT    : Started TrashRuleRevisionIT in 9.1 seconds (process running for 10.252)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-19T22:12:44.876-03:00  WARN 2091157 --- [           main] [dd64f946-32fc-4d44-a0db-55c94c1ae61b] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-19T22:12:44.880-03:00  WARN 2091157 --- [           main] [dd64f946-32fc-4d44-a0db-55c94c1ae61b] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-19T22:12:44.880-03:00  WARN 2091157 --- [           main] [dd64f946-32fc-4d44-a0db-55c94c1ae61b] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-19T22:12:45.046-03:00  INFO 2091157 --- [           main] [dd64f946-32fc-4d44-a0db-55c94c1ae61b] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 276ms userId=1 planId=1
2026-11-19T22:12:45.131-03:00  INFO 2091157 --- [           main] [74f4eba6-3d8e-492f-bca2-b70cc9437655] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 74ms userId=1 planId=1
2026-11-19T22:12:45.191-03:00  INFO 2091157 --- [           main] [cf63dd8d-5602-4cba-b323-5c2d7f20df03] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 54ms userId=1 planId=1
2026-11-19T22:12:45.229-03:00  INFO 2091157 --- [           main] [42c1d9e4-7213-4d88-a988-4bd22d10e2b2] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 409 35ms userId=1 planId=1
2026-11-19T22:12:45.366-03:00  INFO 2091157 --- [           main] [99be805d-7f03-4109-bd92-17531460cb92] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction 200 64ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TrashRuleRevisionIT#restoreAft` - exit 0

```
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-19T22:13:11.805-03:00  WARN 2091661 --- [           main] [07679ac4-c553-4d3b-b850-3b60cb9e3161] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-19T22:13:11.808-03:00  WARN 2091661 --- [           main] [07679ac4-c553-4d3b-b850-3b60cb9e3161] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-19T22:13:11.809-03:00  WARN 2091661 --- [           main] [07679ac4-c553-4d3b-b850-3b60cb9e3161] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-19T22:13:11.989-03:00  INFO 2091661 --- [           main] [07679ac4-c553-4d3b-b850-3b60cb9e3161] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 305ms userId=1 planId=1
2026-11-19T22:13:12.074-03:00  INFO 2091661 --- [           main] [cac88a64-c308-4d47-afe5-d4b5b9ebc6c4] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 72ms userId=1 planId=1
2026-11-19T22:13:12.101-03:00  INFO 2091661 --- [           main] [7ff35df4-421b-4156-b41b-53a4063cd0fe] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 25ms userId=1 planId=1
2026-11-19T22:13:12.143-03:00  INFO 2091661 --- [           main] [5e806434-52fd-4db5-be50-2c06aa0a3b0b] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 200 40ms userId=1 planId=1
2026-11-19T22:13:12.168-03:00  INFO 2091661 --- [           main] [c11e71e4-f9aa-43d3-a774-c9458f423a40] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 200 23ms userId=1 planId=1
2026-11-19T22:13:12.244-03:00  INFO 2091661 --- [           main] [f630419d-28a5-4c8f-a68d-025ec95e5120] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction 200 74ms userId=1 planId=1
2026-11-19T22:13:12.322-03:00  INFO 2091661 --- [           main] [b1c45564-8e35-4467-9a70-5a14e83672b9] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 20ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TrashRuleRevisionIT#restoreAft` - exit 0

```
2026-11-19T22:13:38.995-03:00  INFO 2092175 --- [           main] [138c97ec-f318-4367-9375-d6a15986a458] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 67ms userId=1 planId=1
2026-11-19T22:13:39.050-03:00  INFO 2092175 --- [           main] [6c86535f-f8b4-484b-a8dc-8281ee00601d] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 48ms userId=1 planId=1
2026-11-19T22:13:39.083-03:00  INFO 2092175 --- [           main] [00eccb35-51fb-4ce3-b209-884ae5251899] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 409 32ms userId=1 planId=1
2026-11-19T22:13:39.168-03:00  INFO 2092175 --- [           main] [1fa21b4a-a150-4817-ae06-47ec258de628] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 42ms userId=3 planId=2
2026-11-19T22:13:39.194-03:00  INFO 2092175 --- [           main] [f41f1924-bd28-41d1-bece-ef19ae546e06] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 23ms userId=3 planId=2
2026-11-19T22:13:39.234-03:00  INFO 2092175 --- [           main] [f7827897-aeea-41a4-afa1-14f1371fbc20] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 37ms userId=3 planId=2
2026-11-19T22:13:39.251-03:00  INFO 2092175 --- [           main] [721b86c1-e933-4880-80f2-3a6f6d352355] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 409 16ms userId=3 planId=2
2026-11-19T22:13:39.297-03:00  INFO 2092175 --- [           main] [3791aea9-6ff9-48d0-a044-df3ca27bec07] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 28ms userId=5 planId=3
2026-11-19T22:13:39.320-03:00  INFO 2092175 --- [           main] [f06da2ff-c5dd-40b5-9389-891ec380c7d0] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 21ms userId=5 planId=3
2026-11-19T22:13:39.390-03:00  INFO 2092175 --- [           main] [1000141c-df7d-4138-a9ee-7884735d3c27] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 67ms userId=5 planId=3
2026-11-19T22:13:39.409-03:00  INFO 2092175 --- [           main] [03a1b4a0-f440-4f6e-b107-b7fab9fd6061] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 409 16ms userId=5 planId=3
2026-11-19T22:13:39.452-03:00  INFO 2092175 --- [           main] [3f2ce758-249d-4407-8b39-7f70296bdfa0] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 27ms userId=7 planId=4
2026-11-19T22:13:39.482-03:00  INFO 2092175 --- [           main] [f75ac935-5d1d-401a-8e64-5516f51f4faa] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 28ms userId=7 planId=4
2026-11-19T22:13:39.539-03:00  INFO 2092175 --- [           main] [c5720da5-5fea-4ca5-b782-4bfd41655dc5] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 53ms userId=7 planId=4
2026-11-19T22:13:39.557-03:00  INFO 2092175 --- [           main] [1d70a206-45fc-4471-ba47-f6f1c1707abc] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 409 15ms userId=7 planId=4
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TrashRuleRevisionIT#flagOnlyEd` - exit 0

```
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-19T22:14:06.021-03:00  WARN 2092689 --- [           main] [d81b0b34-b818-4a74-b596-87b337be5202] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-19T22:14:06.025-03:00  WARN 2092689 --- [           main] [d81b0b34-b818-4a74-b596-87b337be5202] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-19T22:14:06.025-03:00  WARN 2092689 --- [           main] [d81b0b34-b818-4a74-b596-87b337be5202] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-19T22:14:06.200-03:00  INFO 2092689 --- [           main] [d81b0b34-b818-4a74-b596-87b337be5202] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 292ms userId=1 planId=1
2026-11-19T22:14:06.275-03:00  INFO 2092689 --- [           main] [01f3a6de-0f22-469a-ba4b-7e58d9a7ab7e] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 64ms userId=1 planId=1
2026-11-19T22:14:06.291-03:00  INFO 2092689 --- [           main] [ab90bfe8-14d8-42a8-8aff-4a2fff6ab4de] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 15ms userId=1 planId=1
2026-11-19T22:14:06.387-03:00  INFO 2092689 --- [           main] [2f624d1d-0b7c-4bf8-a994-7830a0236fa0] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 53ms userId=1 planId=1
2026-11-19T22:14:06.399-03:00  INFO 2092689 --- [           main] [053723b3-e4b3-403d-83d5-1b1b019d02c0] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 10ms userId=1 planId=1
2026-11-19T22:14:06.431-03:00  INFO 2092689 --- [           main] [bae08040-6dba-4f57-ac01-64c89cd5530a] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 200 30ms userId=1 planId=1
2026-11-19T22:14:06.498-03:00  INFO 2092689 --- [           main] [4099fcc4-3a5e-4570-936d-860d680d285e] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction 200 65ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='MigrationsIT#ruleRevisionReset` - exit 0

```
2026-11-19T22:14:33.640-03:00  INFO 2093209 --- [           main] [] o.f.core.internal.command.DbMigrate      : Migrating schema "public" to version "19 - drop percent split mode"
2026-11-19T22:14:33.651-03:00  INFO 2093209 --- [           main] [] o.f.core.internal.command.DbMigrate      : Migrating schema "public" to version "20 - lowercase emails"
2026-11-19T22:14:33.662-03:00  INFO 2093209 --- [           main] [] o.f.core.internal.command.DbMigrate      : Migrating schema "public" to version "21 - cascade plan deletion"
2026-11-19T22:14:33.686-03:00  INFO 2093209 --- [           main] [] o.f.core.internal.command.DbMigrate      : Migrating schema "public" to version "22 - add user language"
2026-11-19T22:14:33.696-03:00  INFO 2093209 --- [           main] [] o.f.core.internal.command.DbMigrate      : Migrating schema "public" to version "23 - add transaction confirmation"
2026-11-19T22:14:33.706-03:00  INFO 2093209 --- [           main] [] o.f.core.internal.command.DbMigrate      : Migrating schema "public" to version "24 - add transaction scheduled date"
2026-11-19T22:14:33.715-03:00  INFO 2093209 --- [           main] [] o.f.core.internal.command.DbMigrate      : Migrating schema "public" to version "25 - add oauth authorization"
2026-11-19T22:14:33.727-03:00  INFO 2093209 --- [           main] [] o.f.core.internal.command.DbMigrate      : Migrating schema "public" to version "26 - add oauth rotated refresh tokens"
2026-11-19T22:14:33.737-03:00  INFO 2093209 --- [           main] [] o.f.core.internal.command.DbMigrate      : Migrating schema "public" to version "27 - add transaction trash"
2026-11-19T22:14:33.755-03:00  INFO 2093209 --- [           main] [] o.f.core.internal.command.DbMigrate      : Successfully applied 27 migrations to schema "public", now at version v27 (execution time 00:00.294s)
2026-11-19T22:14:33.790-03:00  INFO 2093209 --- [           main] [] org.flywaydb.core.FlywayExecutor         : Database: jdbc:postgresql://localhost:39781/findraco_test_v13_scratch?loggerLevel=OFF (PostgreSQL 16.14)
2026-11-19T22:14:33.817-03:00  INFO 2093209 --- [           main] [] o.f.core.internal.command.DbValidate     : Successfully validated 28 migrations (execution time 00:00.014s)
2026-11-19T22:14:33.834-03:00  INFO 2093209 --- [           main] [] o.f.core.internal.command.DbMigrate      : Current version of schema "public": 27
2026-11-19T22:14:33.836-03:00  INFO 2093209 --- [           main] [] o.f.core.internal.command.DbMigrate      : Migrating schema "public" to version "28 - add recurrence rule revision"
2026-11-19T22:14:33.850-03:00  INFO 2093209 --- [           main] [] o.f.core.internal.command.DbMigrate      : Successfully applied 1 migration to schema "public", now at version v28 (execution time 00:00.008s)
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TrashRuleRevisionIT#restoringO` - exit 0

```
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-19T22:15:00.175-03:00  WARN 2093744 --- [           main] [fd93a196-2cac-45ee-9d3c-10de5ab460e9] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-19T22:15:00.179-03:00  WARN 2093744 --- [           main] [fd93a196-2cac-45ee-9d3c-10de5ab460e9] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-19T22:15:00.179-03:00  WARN 2093744 --- [           main] [fd93a196-2cac-45ee-9d3c-10de5ab460e9] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-19T22:15:00.376-03:00  INFO 2093744 --- [           main] [fd93a196-2cac-45ee-9d3c-10de5ab460e9] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 322ms userId=1 planId=1
2026-11-19T22:15:00.451-03:00  INFO 2093744 --- [           main] [1c2a2720-72ea-4e0a-a90c-93aad55df503] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 64ms userId=1 planId=1
2026-11-19T22:15:00.484-03:00  INFO 2093744 --- [           main] [0fc6e908-b85a-4828-b06d-7e75b0022e9f] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 32ms userId=1 planId=1
2026-11-19T22:15:00.524-03:00  INFO 2093744 --- [           main] [97a962f7-f858-4236-b534-f3dd4935882a] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 200 37ms userId=1 planId=1
2026-11-19T22:15:00.556-03:00  INFO 2093744 --- [           main] [f9660ea6-3688-49ed-9e10-2784562a0c09] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 200 28ms userId=1 planId=1
2026-11-19T22:15:00.631-03:00  INFO 2093744 --- [           main] [71bd0216-2988-40a1-b924-ba0616acefb6] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction 200 73ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TrashRuleRevisionIT#restoringT` - exit 0

```
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-19T22:15:27.313-03:00  WARN 2094259 --- [           main] [788b6d0c-e97d-4409-96a9-0050b9199858] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-19T22:15:27.316-03:00  WARN 2094259 --- [           main] [788b6d0c-e97d-4409-96a9-0050b9199858] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-19T22:15:27.316-03:00  WARN 2094259 --- [           main] [788b6d0c-e97d-4409-96a9-0050b9199858] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-19T22:15:27.502-03:00  INFO 2094259 --- [           main] [788b6d0c-e97d-4409-96a9-0050b9199858] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 309ms userId=1 planId=1
2026-11-19T22:15:27.597-03:00  INFO 2094259 --- [           main] [73a47da5-8a11-49b2-9318-a7f51d903ecb] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 83ms userId=1 planId=1
2026-11-19T22:15:27.627-03:00  INFO 2094259 --- [           main] [1124d0a9-fdc3-4ea8-8217-e9ed11f59021] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 28ms userId=1 planId=1
2026-11-19T22:15:27.663-03:00  INFO 2094259 --- [           main] [1aa49225-b45b-4dcf-938e-90047cf81dba] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 200 34ms userId=1 planId=1
2026-11-19T22:15:27.687-03:00  INFO 2094259 --- [           main] [bda7f889-5f01-49ec-9cbf-50a4ec3db2ed] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 200 23ms userId=1 planId=1
2026-11-19T22:15:27.759-03:00  INFO 2094259 --- [           main] [43790dd2-83d5-49ef-ac6e-98f533d22d04] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction 200 70ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TrashRuleRevisionIT#parcelsCha` - exit 0

```
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-19T22:15:54.054-03:00  WARN 2094773 --- [           main] [c9c7393f-40a9-453b-9d5e-9b0934ba9dcc] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-19T22:15:54.057-03:00  WARN 2094773 --- [           main] [c9c7393f-40a9-453b-9d5e-9b0934ba9dcc] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-19T22:15:54.058-03:00  WARN 2094773 --- [           main] [c9c7393f-40a9-453b-9d5e-9b0934ba9dcc] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-19T22:15:54.226-03:00  INFO 2094773 --- [           main] [c9c7393f-40a9-453b-9d5e-9b0934ba9dcc] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 281ms userId=1 planId=1
2026-11-19T22:15:54.309-03:00  INFO 2094773 --- [           main] [d0566034-732c-4e83-a368-2c2bb3fccbd6] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 72ms userId=1 planId=1
2026-11-19T22:15:54.366-03:00  INFO 2094773 --- [           main] [8da32f79-1a3c-4d01-91bf-3d37f65cabb6] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 50ms userId=1 planId=1
2026-11-19T22:15:54.391-03:00  INFO 2094773 --- [           main] [3514fc54-404f-4942-95b4-25a29a316a95] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 409 23ms userId=1 planId=1
2026-11-19T22:15:54.443-03:00  INFO 2094773 --- [           main] [762b5236-df26-48e7-b12c-2c7b92f23fe9] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 21ms userId=2 planId=2
2026-11-19T22:15:54.468-03:00  INFO 2094773 --- [           main] [1ce3dffc-6693-4572-945a-fdff10e44a5f] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 23ms userId=2 planId=2
2026-11-19T22:15:54.500-03:00  INFO 2094773 --- [           main] [71e0f2c5-39b9-47ac-9878-22b27966cbb6] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 29ms userId=2 planId=2
2026-11-19T22:15:54.525-03:00  INFO 2094773 --- [           main] [c69ab75c-159e-459d-87c6-b87115f8413b] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 200 24ms userId=2 planId=2
2026-11-19T22:15:54.590-03:00  INFO 2094773 --- [           main] [9c4b4cfa-53fd-48c0-bb86-57097406acef] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction 200 63ms userId=2 planId=2
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TrashRuleRevisionIT#restoringA` - exit 0

```
2026-11-19T22:16:20.471-03:00  INFO 2095280 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-19T22:16:20.526-03:00  INFO 2095280 --- [           main] [] c.l.f.transaction.TrashRuleRevisionIT    : Started TrashRuleRevisionIT in 9.12 seconds (process running for 10.373)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-19T22:16:21.089-03:00  WARN 2095280 --- [           main] [4457105f-c321-40d0-8a01-bb88fe11a9d3] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-19T22:16:21.092-03:00  WARN 2095280 --- [           main] [4457105f-c321-40d0-8a01-bb88fe11a9d3] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-19T22:16:21.093-03:00  WARN 2095280 --- [           main] [4457105f-c321-40d0-8a01-bb88fe11a9d3] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-19T22:16:21.260-03:00  INFO 2095280 --- [           main] [4457105f-c321-40d0-8a01-bb88fe11a9d3] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 280ms userId=1 planId=1
2026-11-19T22:16:21.334-03:00  INFO 2095280 --- [           main] [cb99191d-f123-4a87-b5c1-e4f7d86e2686] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 63ms userId=1 planId=1
2026-11-19T22:16:21.395-03:00  INFO 2095280 --- [           main] [9f639ebb-3933-43a1-8a23-cf9e0e84fdf0] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 55ms userId=1 planId=1
2026-11-19T22:16:21.423-03:00  INFO 2095280 --- [           main] [6715ce7d-31f9-47ba-a333-5e1d2c560833] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 409 27ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='FormerMemberEditIT#editKeeping` - exit 0

```
2026-11-19T22:16:48.059-03:00  WARN 2095795 --- [           main] [94fed275-d5e6-43b0-bee3-0e76c2d82998] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-19T22:16:48.063-03:00  WARN 2095795 --- [           main] [94fed275-d5e6-43b0-bee3-0e76c2d82998] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List)
2026-11-19T22:16:48.063-03:00  WARN 2095795 --- [           main] [94fed275-d5e6-43b0-bee3-0e76c2d82998] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List)
2026-11-19T22:16:48.063-03:00  WARN 2095795 --- [           main] [94fed275-d5e6-43b0-bee3-0e76c2d82998] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#items()
2026-11-19T22:16:48.063-03:00  WARN 2095795 --- [           main] [94fed275-d5e6-43b0-bee3-0e76c2d82998] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#participants()
2026-11-19T22:16:48.063-03:00  WARN 2095795 --- [           main] [94fed275-d5e6-43b0-bee3-0e76c2d82998] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-19T22:16:48.230-03:00  INFO 2095795 --- [           main] [94fed275-d5e6-43b0-bee3-0e76c2d82998] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 281ms userId=1 planId=1
2026-11-19T22:16:48.257-03:00  WARN 2095795 --- [           main] [6cee2119-bb4c-4367-89c6-1ce8fa52b1bb] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-19T22:16:48.257-03:00  WARN 2095795 --- [           main] [6cee2119-bb4c-4367-89c6-1ce8fa52b1bb] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#items()
2026-11-19T22:16:48.258-03:00  WARN 2095795 --- [           main] [6cee2119-bb4c-4367-89c6-1ce8fa52b1bb] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#participants()
2026-11-19T22:16:48.258-03:00  WARN 2095795 --- [           main] [6cee2119-bb4c-4367-89c6-1ce8fa52b1bb] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#com.lcs.findraco.transaction.request.UpdateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, Long)
2026-11-19T22:16:48.258-03:00  WARN 2095795 --- [           main] [6cee2119-bb4c-4367-89c6-1ce8fa52b1bb] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#com.lcs.findraco.transaction.request.UpdateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, Long)
2026-11-19T22:16:48.258-03:00  WARN 2095795 --- [           main] [6cee2119-bb4c-4367-89c6-1ce8fa52b1bb] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-19T22:16:48.313-03:00  INFO 2095795 --- [           main] [6cee2119-bb4c-4367-89c6-1ce8fa52b1bb] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/{id} 200 66ms userId=1 planId=1
2026-11-19T22:16:48.390-03:00  INFO 2095795 --- [           main] [3dd8c657-d4f0-4508-adf7-0c516a9a9db1] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/{id} 200 18ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='FormerMemberEditIT#seriesEditK` - exit 0

```
2026-11-19T22:17:13.768-03:00  INFO 2096305 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-19T22:17:13.769-03:00  INFO 2096305 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-19T22:17:13.770-03:00  INFO 2096305 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-19T22:17:13.826-03:00  INFO 2096305 --- [           main] [] c.l.f.transaction.FormerMemberEditIT     : Started FormerMemberEditIT in 8.809 seconds (process running for 10.045)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-19T22:17:14.421-03:00  WARN 2096305 --- [           main] [7eb6bcbd-01ae-434d-b72a-8879875e7d0d] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-19T22:17:14.425-03:00  WARN 2096305 --- [           main] [7eb6bcbd-01ae-434d-b72a-8879875e7d0d] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-19T22:17:14.425-03:00  WARN 2096305 --- [           main] [7eb6bcbd-01ae-434d-b72a-8879875e7d0d] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-19T22:17:14.610-03:00  INFO 2096305 --- [           main] [7eb6bcbd-01ae-434d-b72a-8879875e7d0d] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 300ms userId=1 planId=1
2026-11-19T22:17:14.733-03:00  INFO 2096305 --- [           main] [a0892f08-bdb9-43a3-9a94-37449a53d253] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 105ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='FormerMemberEditIT#formerMembe` - exit 0

```
2026-11-19T22:17:41.108-03:00  WARN 2096812 --- [           main] [e5ac9730-c7b8-455e-b5ef-038390727067] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-19T22:17:41.108-03:00  WARN 2096812 --- [           main] [e5ac9730-c7b8-455e-b5ef-038390727067] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-19T22:17:41.108-03:00  WARN 2096812 --- [           main] [e5ac9730-c7b8-455e-b5ef-038390727067] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#items()
2026-11-19T22:17:41.108-03:00  WARN 2096812 --- [           main] [e5ac9730-c7b8-455e-b5ef-038390727067] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List)
2026-11-19T22:17:41.109-03:00  WARN 2096812 --- [           main] [e5ac9730-c7b8-455e-b5ef-038390727067] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List)
2026-11-19T22:17:41.257-03:00  INFO 2096812 --- [           main] [e5ac9730-c7b8-455e-b5ef-038390727067] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 261ms userId=1 planId=1
2026-11-19T22:17:41.278-03:00  WARN 2096812 --- [           main] [58da8f2f-f1f5-4d41-b6df-bb7f94d7d8fd] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#com.lcs.findraco.transaction.request.UpdateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, Long)
2026-11-19T22:17:41.278-03:00  WARN 2096812 --- [           main] [58da8f2f-f1f5-4d41-b6df-bb7f94d7d8fd] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#com.lcs.findraco.transaction.request.UpdateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, Long)
2026-11-19T22:17:41.279-03:00  WARN 2096812 --- [           main] [58da8f2f-f1f5-4d41-b6df-bb7f94d7d8fd] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-19T22:17:41.279-03:00  WARN 2096812 --- [           main] [58da8f2f-f1f5-4d41-b6df-bb7f94d7d8fd] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-19T22:17:41.279-03:00  WARN 2096812 --- [           main] [58da8f2f-f1f5-4d41-b6df-bb7f94d7d8fd] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#participants()
2026-11-19T22:17:41.279-03:00  WARN 2096812 --- [           main] [58da8f2f-f1f5-4d41-b6df-bb7f94d7d8fd] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#items()
2026-11-19T22:17:41.315-03:00  INFO 2096812 --- [           main] [58da8f2f-f1f5-4d41-b6df-bb7f94d7d8fd] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/{id} 422 47ms userId=1 planId=1
2026-11-19T22:17:41.363-03:00  INFO 2096812 --- [           main] [fb93f47a-369f-4101-b865-eddb8b767fb1] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 17ms userId=1 planId=1
2026-11-19T22:17:41.381-03:00  INFO 2096812 --- [           main] [b76685c9-0302-45fc-9559-acba486ccda0] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/{id} 200 15ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureHubIT#updateOfARowSh` - exit 0

```
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-19T22:18:07.770-03:00  INFO 2097323 --- [           main] [f2532a05-794e-4257-9acb-12d7e5aaa011] i.m.server.McpAsyncServer                : Client initialize request - Protocol: 2025-06-18, Capabilities: ClientCapabilities[experimental=null, roots=null, sampling=null, elicitation=null, extensions=null], Info: Implementation[name=test, title=null, version=1, description=null, icons=null, websiteUrl=null]
2026-11-19T22:18:07.790-03:00  INFO 2097323 --- [           main] [f2532a05-794e-4257-9acb-12d7e5aaa011] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 130ms userId=- planId=-
2026-11-19T22:18:07.801-03:00  INFO 2097323 --- [           main] [9e0c761e-6944-41ff-b91c-7377eebb49d4] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 7ms userId=- planId=-
2026-11-19T22:18:07.959-03:00  WARN 2097323 --- [           main] [f1570cc0-7a26-4480-a872-d2756adae200] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-19T22:18:07.962-03:00  WARN 2097323 --- [           main] [f1570cc0-7a26-4480-a872-d2756adae200] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#items()
2026-11-19T22:18:07.963-03:00  WARN 2097323 --- [           main] [f1570cc0-7a26-4480-a872-d2756adae200] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#participants()
2026-11-19T22:18:07.963-03:00  WARN 2097323 --- [           main] [f1570cc0-7a26-4480-a872-d2756adae200] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#com.lcs.findraco.transaction.request.UpdateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, Long)
2026-11-19T22:18:07.963-03:00  WARN 2097323 --- [           main] [f1570cc0-7a26-4480-a872-d2756adae200] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#com.lcs.findraco.transaction.request.UpdateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, Long)
2026-11-19T22:18:07.963-03:00  WARN 2097323 --- [           main] [f1570cc0-7a26-4480-a872-d2756adae200] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-19T22:18:08.012-03:00  INFO 2097323 --- [           main] [f1570cc0-7a26-4480-a872-d2756adae200] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=update_transaction user=1 plan=1 outcome=ok durationMs=195
2026-11-19T22:18:08.027-03:00  INFO 2097323 --- [           main] [f1570cc0-7a26-4480-a872-d2756adae200] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 225ms userId=- planId=-
2026-11-19T22:18:08.110-03:00  INFO 2097323 --- [           main] [93a92dbb-086e-4577-b49b-942c80f36772] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/{id} 200 45ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='FormerMemberEditIT#formerMembe` - exit 0

```
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-19T22:18:34.363-03:00  WARN 2097836 --- [           main] [7f42e27e-3342-4a56-903b-0d3dcfcb0ff7] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-19T22:18:34.366-03:00  WARN 2097836 --- [           main] [7f42e27e-3342-4a56-903b-0d3dcfcb0ff7] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-19T22:18:34.367-03:00  WARN 2097836 --- [           main] [7f42e27e-3342-4a56-903b-0d3dcfcb0ff7] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-19T22:18:34.555-03:00  INFO 2097836 --- [           main] [7f42e27e-3342-4a56-903b-0d3dcfcb0ff7] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 309ms userId=1 planId=1
2026-11-19T22:18:34.643-03:00  INFO 2097836 --- [           main] [fbd19806-089b-4744-bc9c-e8194f59227a] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 74ms userId=1 planId=1
2026-11-19T22:18:34.669-03:00  INFO 2097836 --- [           main] [1f32e326-c28a-4376-a1ef-fe5205d24ae5] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 25ms userId=1 planId=1
2026-11-19T22:18:34.715-03:00  INFO 2097836 --- [           main] [02ae8f6f-db62-431d-a92e-ab6b5f6a0716] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 42ms userId=1 planId=1
2026-11-19T22:18:34.746-03:00  INFO 2097836 --- [           main] [d48e6266-4d5e-40ef-831c-dbce5c5fa0e0] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 422 26ms userId=1 planId=1
2026-11-19T22:18:34.791-03:00  INFO 2097836 --- [           main] [b517b108-be28-405b-b755-90bf2c9796d7] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 422 20ms userId=1 planId=1
2026-11-19T22:18:34.804-03:00  INFO 2097836 --- [           main] [be83b60c-2d5e-47a1-af24-68ecd586cfcb] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/{id} 200 11ms userId=1 planId=1
```
