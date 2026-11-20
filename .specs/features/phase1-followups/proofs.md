# phase1-followups proofs

**HEAD**: 1f760b78
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
 ✓ |storybook (chromium)| src/features/transactions/components/AttributionFields.stories.tsx > Single Payer 292ms
 ✓ |storybook (chromium)| src/features/transactions/components/AttributionFields.stories.tsx > Someone Else 36ms
 ✓ |storybook (chromium)| src/features/transactions/components/AttributionFields.stories.tsx > Split 86ms
 ✓ |storybook (chromium)| src/features/transactions/components/AttributionFields.stories.tsx > Former Participant 62ms
 ✓ |storybook (chromium)| src/features/transactions/components/AttributionFields.stories.tsx > Former Person 30ms
 ✓ |storybook (chromium)| src/features/transactions/components/AttributionFields.stories.tsx > Split Exact Shares 45ms

 Test Files  1 passed (1)
      Tests  6 passed (6)
   Start at  22:02:01
   Duration  2.19s (transform 0ms, setup 411ms, collect 303ms, tests 552ms, environment 0ms, prepare 2.37s)

No story files found for the specified pattern: src/**/*.mdx
```

`Run unit` - exit 0

```
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer language > shows user data as typed in Portuguese 31ms
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer > series starts requiring confirmation 165ms
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer > status keeps its value when another field changes 168ms
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer > status forecast unconfirms 139ms
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer > keeps a former member's share when saving 77ms
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer > shows the split of a row shared with a former member in a one-member plan 109ms
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer > the date field has no clear button 36ms
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer > one-off shows no confirmation controls 35ms

 Test Files  1 passed (1)
      Tests  34 passed (34)
   Start at  22:02:05
   Duration  7.91s (transform 417ms, setup 126ms, collect 3.00s, tests 4.25s, environment 354ms, prepare 42ms)

No story files found for the specified pattern: src/**/*.mdx
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TrashRuleRevisionIT#restoreAft` - exit 0

```
2026-11-19T22:02:33.244-03:00  INFO 2079998 --- [           main] [] c.l.f.transaction.TrashRuleRevisionIT    : Started TrashRuleRevisionIT in 9.02 seconds (process running for 10.199)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-19T22:02:33.820-03:00  WARN 2079998 --- [           main] [eede0e86-8251-44ad-a2ba-e977a212de9c] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-19T22:02:33.824-03:00  WARN 2079998 --- [           main] [eede0e86-8251-44ad-a2ba-e977a212de9c] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-19T22:02:33.824-03:00  WARN 2079998 --- [           main] [eede0e86-8251-44ad-a2ba-e977a212de9c] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-19T22:02:33.988-03:00  INFO 2079998 --- [           main] [eede0e86-8251-44ad-a2ba-e977a212de9c] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 301ms userId=1 planId=1
2026-11-19T22:02:34.079-03:00  INFO 2079998 --- [           main] [0630d4f6-a639-4fb4-8945-12a6d284605d] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 79ms userId=1 planId=1
2026-11-19T22:02:34.113-03:00  INFO 2079998 --- [           main] [9cf9b48b-daa0-4c76-8639-d7f8a4047274] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 32ms userId=1 planId=1
2026-11-19T22:02:34.150-03:00  INFO 2079998 --- [           main] [14ba1753-601c-4b11-9f27-97f7b2b3ab93] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 200 34ms userId=1 planId=1
2026-11-19T22:02:34.247-03:00  INFO 2079998 --- [           main] [c5855bf1-d340-43f5-9717-8b32d6d93b31] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction 200 71ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TrashRuleRevisionIT#restoreAft` - exit 0

```
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-19T22:03:00.843-03:00  WARN 2080536 --- [           main] [a176a679-5195-43f3-83f3-da492483f3c8] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-19T22:03:00.846-03:00  WARN 2080536 --- [           main] [a176a679-5195-43f3-83f3-da492483f3c8] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-19T22:03:00.847-03:00  WARN 2080536 --- [           main] [a176a679-5195-43f3-83f3-da492483f3c8] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-19T22:03:01.024-03:00  INFO 2080536 --- [           main] [a176a679-5195-43f3-83f3-da492483f3c8] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 312ms userId=1 planId=1
2026-11-19T22:03:01.108-03:00  INFO 2080536 --- [           main] [968e7dd3-ab08-41a6-b546-879c32fc3984] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 73ms userId=1 planId=1
2026-11-19T22:03:01.147-03:00  INFO 2080536 --- [           main] [98d52da3-68b6-4c3e-af40-82f1e43c39d0] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 34ms userId=1 planId=1
2026-11-19T22:03:01.177-03:00  INFO 2080536 --- [           main] [b5403370-5bff-4b3b-b1e4-e7b881b35e8c] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 200 29ms userId=1 planId=1
2026-11-19T22:03:01.192-03:00  INFO 2080536 --- [           main] [a5d46cf0-65ca-40d4-9da5-2ed001368265] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/{id} 200 13ms userId=1 planId=1
2026-11-19T22:03:01.256-03:00  INFO 2080536 --- [           main] [51a2a968-bf15-4db5-b79a-4ae7c5f11a55] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/{id} 200 15ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TrashRuleRevisionIT#restoreAft` - exit 0

```
2026-11-19T22:03:27.694-03:00  INFO 2081062 --- [           main] [] c.l.f.transaction.TrashRuleRevisionIT    : Started TrashRuleRevisionIT in 9.257 seconds (process running for 10.53)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-19T22:03:28.279-03:00  WARN 2081062 --- [           main] [0b81d5ef-543c-4cd2-ba1e-060538e19c89] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-19T22:03:28.282-03:00  WARN 2081062 --- [           main] [0b81d5ef-543c-4cd2-ba1e-060538e19c89] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-19T22:03:28.282-03:00  WARN 2081062 --- [           main] [0b81d5ef-543c-4cd2-ba1e-060538e19c89] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-19T22:03:28.453-03:00  INFO 2081062 --- [           main] [0b81d5ef-543c-4cd2-ba1e-060538e19c89] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 283ms userId=1 planId=1
2026-11-19T22:03:28.535-03:00  INFO 2081062 --- [           main] [13b9ffa7-5b02-4795-979c-7f8aaf727aa5] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 69ms userId=1 planId=1
2026-11-19T22:03:28.581-03:00  INFO 2081062 --- [           main] [5cb5a127-a31f-4246-ae2e-320866db8423] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 42ms userId=1 planId=1
2026-11-19T22:03:28.606-03:00  INFO 2081062 --- [           main] [2eb15931-4006-4e79-afac-e1a09cb2126f] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 409 23ms userId=1 planId=1
2026-11-19T22:03:28.735-03:00  INFO 2081062 --- [           main] [f0f68a5c-f8a2-44cf-a979-a87af707c78c] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction 200 60ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TrashRuleRevisionIT#restoreAft` - exit 0

```
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-19T22:03:56.758-03:00  WARN 2081596 --- [           main] [048b8a48-1a08-42f4-a201-c5651c9cad41] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-19T22:03:56.761-03:00  WARN 2081596 --- [           main] [048b8a48-1a08-42f4-a201-c5651c9cad41] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-19T22:03:56.761-03:00  WARN 2081596 --- [           main] [048b8a48-1a08-42f4-a201-c5651c9cad41] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-19T22:03:56.932-03:00  INFO 2081596 --- [           main] [048b8a48-1a08-42f4-a201-c5651c9cad41] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 295ms userId=1 planId=1
2026-11-19T22:03:57.008-03:00  INFO 2081596 --- [           main] [b867bbc7-599e-43f4-b5f9-a90fc6ab0b81] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 65ms userId=1 planId=1
2026-11-19T22:03:57.033-03:00  INFO 2081596 --- [           main] [4975cfd1-4039-4121-9059-36c8da94ef0e] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 23ms userId=1 planId=1
2026-11-19T22:03:57.067-03:00  INFO 2081596 --- [           main] [92426cea-ad01-47e8-8a08-964ce3a40dff] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 200 32ms userId=1 planId=1
2026-11-19T22:03:57.090-03:00  INFO 2081596 --- [           main] [5454f340-8eb4-481a-aa05-feb22c8e72a8] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 200 22ms userId=1 planId=1
2026-11-19T22:03:57.160-03:00  INFO 2081596 --- [           main] [21d0829b-7f72-4fe5-a0d7-c1fddf922ac8] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction 200 68ms userId=1 planId=1
2026-11-19T22:03:57.246-03:00  INFO 2081596 --- [           main] [d7e2c144-9706-4c63-9560-7f722dcfaeb5] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 23ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TrashRuleRevisionIT#restoreAft` - exit 0

```
2026-11-19T22:04:25.031-03:00  INFO 2082130 --- [           main] [916ddd9d-3eac-48f9-8d38-e0043fa40910] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 64ms userId=1 planId=1
2026-11-19T22:04:25.078-03:00  INFO 2082130 --- [           main] [689ee8e5-ed29-427f-924e-8ab9dcf4165f] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 43ms userId=1 planId=1
2026-11-19T22:04:25.103-03:00  INFO 2082130 --- [           main] [6bba094b-f8aa-416d-9ba9-3afde7ce1211] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 409 23ms userId=1 planId=1
2026-11-19T22:04:25.161-03:00  INFO 2082130 --- [           main] [b767583f-4454-4734-9681-1ac0a2aa9de7] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 20ms userId=3 planId=2
2026-11-19T22:04:25.188-03:00  INFO 2082130 --- [           main] [cb649e37-ea6d-4f1c-a950-56027b747e6d] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 25ms userId=3 planId=2
2026-11-19T22:04:25.235-03:00  INFO 2082130 --- [           main] [d5b343bc-480a-48d2-802b-851e255428e1] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 44ms userId=3 planId=2
2026-11-19T22:04:25.254-03:00  INFO 2082130 --- [           main] [cca3f1ae-dd55-496f-80c5-417c090877f3] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 409 17ms userId=3 planId=2
2026-11-19T22:04:25.296-03:00  INFO 2082130 --- [           main] [8d4f2b09-b515-4d50-9eb2-08ec85a98e57] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 21ms userId=5 planId=3
2026-11-19T22:04:25.318-03:00  INFO 2082130 --- [           main] [4d10417a-e236-4cee-9c78-bf73343cc487] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 19ms userId=5 planId=3
2026-11-19T22:04:25.389-03:00  INFO 2082130 --- [           main] [8236eb52-8f17-4652-a5ae-c0e51b9cc38f] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 67ms userId=5 planId=3
2026-11-19T22:04:25.405-03:00  INFO 2082130 --- [           main] [7cf0a6c2-d32e-406a-8c8e-ca08bdb4a590] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 409 14ms userId=5 planId=3
2026-11-19T22:04:25.449-03:00  INFO 2082130 --- [           main] [3578d65c-7a53-4e32-9dc9-bab5487058b7] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 28ms userId=7 planId=4
2026-11-19T22:04:25.471-03:00  INFO 2082130 --- [           main] [61109a63-4e09-4a5d-878b-c1ab90e27a83] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 20ms userId=7 planId=4
2026-11-19T22:04:25.506-03:00  INFO 2082130 --- [           main] [50528d77-6d35-4018-85cd-c80d6830a568] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 33ms userId=7 planId=4
2026-11-19T22:04:25.520-03:00  INFO 2082130 --- [           main] [3cd6f036-4e93-4b0c-a22f-272e320b70d9] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 409 12ms userId=7 planId=4
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TrashRuleRevisionIT#flagOnlyEd` - exit 0

```
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-19T22:04:52.178-03:00  WARN 2082660 --- [           main] [679c269d-9300-443b-82d5-cb1003375ba7] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-19T22:04:52.181-03:00  WARN 2082660 --- [           main] [679c269d-9300-443b-82d5-cb1003375ba7] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-19T22:04:52.182-03:00  WARN 2082660 --- [           main] [679c269d-9300-443b-82d5-cb1003375ba7] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-19T22:04:52.353-03:00  INFO 2082660 --- [           main] [679c269d-9300-443b-82d5-cb1003375ba7] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 282ms userId=1 planId=1
2026-11-19T22:04:52.429-03:00  INFO 2082660 --- [           main] [b2eb4850-519d-460a-b4aa-dcb4feff3c25] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 65ms userId=1 planId=1
2026-11-19T22:04:52.446-03:00  INFO 2082660 --- [           main] [10f688e4-9583-4427-a2cb-a6c5158d06a1] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 15ms userId=1 planId=1
2026-11-19T22:04:52.534-03:00  INFO 2082660 --- [           main] [88e3e2c7-8ff5-4f67-a1c7-c5a480808307] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 45ms userId=1 planId=1
2026-11-19T22:04:52.544-03:00  INFO 2082660 --- [           main] [aad81c7d-fb61-4ba3-a0f5-60d7d5adec43] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 8ms userId=1 planId=1
2026-11-19T22:04:52.586-03:00  INFO 2082660 --- [           main] [ab892c63-2030-49f7-bdc2-80098129ea3f] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 200 41ms userId=1 planId=1
2026-11-19T22:04:52.651-03:00  INFO 2082660 --- [           main] [8a60fbb7-500f-4500-8d33-655f2082c765] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction 200 62ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='MigrationsIT#ruleRevisionReset` - exit 0

```
2026-11-19T22:05:19.954-03:00  INFO 2083191 --- [           main] [] o.f.core.internal.command.DbMigrate      : Migrating schema "public" to version "19 - drop percent split mode"
2026-11-19T22:05:19.964-03:00  INFO 2083191 --- [           main] [] o.f.core.internal.command.DbMigrate      : Migrating schema "public" to version "20 - lowercase emails"
2026-11-19T22:05:19.974-03:00  INFO 2083191 --- [           main] [] o.f.core.internal.command.DbMigrate      : Migrating schema "public" to version "21 - cascade plan deletion"
2026-11-19T22:05:19.991-03:00  INFO 2083191 --- [           main] [] o.f.core.internal.command.DbMigrate      : Migrating schema "public" to version "22 - add user language"
2026-11-19T22:05:19.997-03:00  INFO 2083191 --- [           main] [] o.f.core.internal.command.DbMigrate      : Migrating schema "public" to version "23 - add transaction confirmation"
2026-11-19T22:05:20.008-03:00  INFO 2083191 --- [           main] [] o.f.core.internal.command.DbMigrate      : Migrating schema "public" to version "24 - add transaction scheduled date"
2026-11-19T22:05:20.022-03:00  INFO 2083191 --- [           main] [] o.f.core.internal.command.DbMigrate      : Migrating schema "public" to version "25 - add oauth authorization"
2026-11-19T22:05:20.034-03:00  INFO 2083191 --- [           main] [] o.f.core.internal.command.DbMigrate      : Migrating schema "public" to version "26 - add oauth rotated refresh tokens"
2026-11-19T22:05:20.045-03:00  INFO 2083191 --- [           main] [] o.f.core.internal.command.DbMigrate      : Migrating schema "public" to version "27 - add transaction trash"
2026-11-19T22:05:20.060-03:00  INFO 2083191 --- [           main] [] o.f.core.internal.command.DbMigrate      : Successfully applied 27 migrations to schema "public", now at version v27 (execution time 00:00.252s)
2026-11-19T22:05:20.098-03:00  INFO 2083191 --- [           main] [] org.flywaydb.core.FlywayExecutor         : Database: jdbc:postgresql://localhost:46465/findraco_test_v13_scratch?loggerLevel=OFF (PostgreSQL 16.14)
2026-11-19T22:05:20.123-03:00  INFO 2083191 --- [           main] [] o.f.core.internal.command.DbValidate     : Successfully validated 28 migrations (execution time 00:00.012s)
2026-11-19T22:05:20.141-03:00  INFO 2083191 --- [           main] [] o.f.core.internal.command.DbMigrate      : Current version of schema "public": 27
2026-11-19T22:05:20.144-03:00  INFO 2083191 --- [           main] [] o.f.core.internal.command.DbMigrate      : Migrating schema "public" to version "28 - add recurrence rule revision"
2026-11-19T22:05:20.160-03:00  INFO 2083191 --- [           main] [] o.f.core.internal.command.DbMigrate      : Successfully applied 1 migration to schema "public", now at version v28 (execution time 00:00.010s)
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TrashRuleRevisionIT#restoringO` - exit 0

```
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-19T22:05:46.185-03:00  WARN 2083729 --- [           main] [ea551fda-e7ae-4e35-b287-a8b4b9b1893b] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-19T22:05:46.188-03:00  WARN 2083729 --- [           main] [ea551fda-e7ae-4e35-b287-a8b4b9b1893b] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-19T22:05:46.189-03:00  WARN 2083729 --- [           main] [ea551fda-e7ae-4e35-b287-a8b4b9b1893b] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-19T22:05:46.354-03:00  INFO 2083729 --- [           main] [ea551fda-e7ae-4e35-b287-a8b4b9b1893b] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 276ms userId=1 planId=1
2026-11-19T22:05:46.430-03:00  INFO 2083729 --- [           main] [f1897a23-cddc-47be-aa05-1e85fcebeae0] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 65ms userId=1 planId=1
2026-11-19T22:05:46.460-03:00  INFO 2083729 --- [           main] [07b630b7-2959-43da-8ff3-41d7cebb15f6] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 28ms userId=1 planId=1
2026-11-19T22:05:46.495-03:00  INFO 2083729 --- [           main] [4c5f5a94-5171-4dd0-85aa-68f4026fe9cb] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 200 33ms userId=1 planId=1
2026-11-19T22:05:46.514-03:00  INFO 2083729 --- [           main] [d8f71e38-3dca-4939-b7d3-1540090ae97f] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 200 17ms userId=1 planId=1
2026-11-19T22:05:46.581-03:00  INFO 2083729 --- [           main] [99a291bf-d52c-418d-8b3b-9340f7712d32] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction 200 65ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TrashRuleRevisionIT#restoringT` - exit 0

```
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
2026-11-19T22:06:12.989-03:00  WARN 2084250 --- [           main] [e6a0fec5-1465-49db-b361-2f9b415a2a50] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-19T22:06:12.992-03:00  WARN 2084250 --- [           main] [e6a0fec5-1465-49db-b361-2f9b415a2a50] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-19T22:06:12.993-03:00  WARN 2084250 --- [           main] [e6a0fec5-1465-49db-b361-2f9b415a2a50] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-19T22:06:13.183-03:00  INFO 2084250 --- [           main] [e6a0fec5-1465-49db-b361-2f9b415a2a50] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 313ms userId=1 planId=1
2026-11-19T22:06:13.272-03:00  INFO 2084250 --- [           main] [62b075ed-3482-429d-ad29-127f7dc6a561] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 76ms userId=1 planId=1
2026-11-19T22:06:13.298-03:00  INFO 2084250 --- [           main] [a8dad743-1484-4974-b229-0d6a732139b7] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 24ms userId=1 planId=1
2026-11-19T22:06:13.340-03:00  INFO 2084250 --- [           main] [e65bee49-2695-4c6e-bb6e-3afd881db130] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 200 40ms userId=1 planId=1
2026-11-19T22:06:13.366-03:00  INFO 2084250 --- [           main] [9816d5db-5ae5-43de-9ed6-0f2cbbf173f1] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 200 25ms userId=1 planId=1
2026-11-19T22:06:13.448-03:00  INFO 2084250 --- [           main] [ee8e2eb5-34bc-482e-85f9-2a369994fd3f] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction 200 80ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TrashRuleRevisionIT#parcelsCha` - exit 0

```
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-19T22:06:40.618-03:00  WARN 2084773 --- [           main] [d4e01dc8-5b10-49e4-a70f-e449394420dd] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-19T22:06:40.622-03:00  WARN 2084773 --- [           main] [d4e01dc8-5b10-49e4-a70f-e449394420dd] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-19T22:06:40.623-03:00  WARN 2084773 --- [           main] [d4e01dc8-5b10-49e4-a70f-e449394420dd] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-19T22:06:40.778-03:00  INFO 2084773 --- [           main] [d4e01dc8-5b10-49e4-a70f-e449394420dd] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 269ms userId=1 planId=1
2026-11-19T22:06:40.860-03:00  INFO 2084773 --- [           main] [59df405c-9971-4b58-baaa-f56a2b27ea91] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 71ms userId=1 planId=1
2026-11-19T22:06:40.916-03:00  INFO 2084773 --- [           main] [a5e443ca-bca2-4287-bc1f-aca0f5857328] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 51ms userId=1 planId=1
2026-11-19T22:06:40.949-03:00  INFO 2084773 --- [           main] [c30c1db6-6655-4fcd-b2c2-6f57e7a0e974] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 409 31ms userId=1 planId=1
2026-11-19T22:06:41.010-03:00  INFO 2084773 --- [           main] [59414c07-fe27-4319-b0bf-7000c7bc1420] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 29ms userId=2 planId=2
2026-11-19T22:06:41.035-03:00  INFO 2084773 --- [           main] [8f8d23ae-6f61-4325-a783-e337967bea12] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 22ms userId=2 planId=2
2026-11-19T22:06:41.068-03:00  INFO 2084773 --- [           main] [e6852a69-4400-43bb-8532-e2d1615ae43d] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 31ms userId=2 planId=2
2026-11-19T22:06:41.093-03:00  INFO 2084773 --- [           main] [cfb76185-2477-4dac-839b-b1bbe5b5d5f2] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 200 23ms userId=2 planId=2
2026-11-19T22:06:41.160-03:00  INFO 2084773 --- [           main] [4c73ef82-a0ce-47bb-a65e-6495fe84f82a] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction 200 65ms userId=2 planId=2
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TrashRuleRevisionIT#restoringA` - exit 0

```
2026-11-19T22:07:07.579-03:00  INFO 2085302 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-19T22:07:07.644-03:00  INFO 2085302 --- [           main] [] c.l.f.transaction.TrashRuleRevisionIT    : Started TrashRuleRevisionIT in 9.223 seconds (process running for 10.427)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-19T22:07:08.207-03:00  WARN 2085302 --- [           main] [03116296-a057-4643-9406-2f8429f596a5] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-19T22:07:08.210-03:00  WARN 2085302 --- [           main] [03116296-a057-4643-9406-2f8429f596a5] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-19T22:07:08.211-03:00  WARN 2085302 --- [           main] [03116296-a057-4643-9406-2f8429f596a5] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-19T22:07:08.381-03:00  INFO 2085302 --- [           main] [03116296-a057-4643-9406-2f8429f596a5] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 294ms userId=1 planId=1
2026-11-19T22:07:08.464-03:00  INFO 2085302 --- [           main] [b6d1b14e-bd1c-43c8-94f6-bfc5858376fa] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 69ms userId=1 planId=1
2026-11-19T22:07:08.526-03:00  INFO 2085302 --- [           main] [bd1dfab1-368a-4338-a06c-dcf5190789b1] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 57ms userId=1 planId=1
2026-11-19T22:07:08.557-03:00  INFO 2085302 --- [           main] [c8aabe5d-917f-4ece-b766-ae5b84932cbc] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 409 30ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='FormerMemberEditIT#editKeeping` - exit 0

```
2026-11-19T22:07:34.837-03:00  WARN 2085829 --- [           main] [2d77b7a6-d6ac-4139-82a1-af9151ec632e] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-19T22:07:34.840-03:00  WARN 2085829 --- [           main] [2d77b7a6-d6ac-4139-82a1-af9151ec632e] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List)
2026-11-19T22:07:34.841-03:00  WARN 2085829 --- [           main] [2d77b7a6-d6ac-4139-82a1-af9151ec632e] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List)
2026-11-19T22:07:34.841-03:00  WARN 2085829 --- [           main] [2d77b7a6-d6ac-4139-82a1-af9151ec632e] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-19T22:07:34.841-03:00  WARN 2085829 --- [           main] [2d77b7a6-d6ac-4139-82a1-af9151ec632e] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#items()
2026-11-19T22:07:34.841-03:00  WARN 2085829 --- [           main] [2d77b7a6-d6ac-4139-82a1-af9151ec632e] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#participants()
2026-11-19T22:07:35.018-03:00  INFO 2085829 --- [           main] [2d77b7a6-d6ac-4139-82a1-af9151ec632e] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 292ms userId=1 planId=1
2026-11-19T22:07:35.045-03:00  WARN 2085829 --- [           main] [8fdb5486-c96c-4152-98a7-56316a2e402c] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-19T22:07:35.045-03:00  WARN 2085829 --- [           main] [8fdb5486-c96c-4152-98a7-56316a2e402c] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-19T22:07:35.046-03:00  WARN 2085829 --- [           main] [8fdb5486-c96c-4152-98a7-56316a2e402c] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#com.lcs.findraco.transaction.request.UpdateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, Long)
2026-11-19T22:07:35.046-03:00  WARN 2085829 --- [           main] [8fdb5486-c96c-4152-98a7-56316a2e402c] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#com.lcs.findraco.transaction.request.UpdateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, Long)
2026-11-19T22:07:35.046-03:00  WARN 2085829 --- [           main] [8fdb5486-c96c-4152-98a7-56316a2e402c] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#items()
2026-11-19T22:07:35.046-03:00  WARN 2085829 --- [           main] [8fdb5486-c96c-4152-98a7-56316a2e402c] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#participants()
2026-11-19T22:07:35.093-03:00  INFO 2085829 --- [           main] [8fdb5486-c96c-4152-98a7-56316a2e402c] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/{id} 200 58ms userId=1 planId=1
2026-11-19T22:07:35.164-03:00  INFO 2085829 --- [           main] [2223a443-4f69-4b2c-a51a-1fcf7186b965] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/{id} 200 15ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='FormerMemberEditIT#seriesEditK` - exit 0

```
2026-11-19T22:08:00.937-03:00  INFO 2086360 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-19T22:08:00.938-03:00  INFO 2086360 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-19T22:08:00.939-03:00  INFO 2086360 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-19T22:08:00.996-03:00  INFO 2086360 --- [           main] [] c.l.f.transaction.FormerMemberEditIT     : Started FormerMemberEditIT in 9.139 seconds (process running for 10.358)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-19T22:08:01.585-03:00  WARN 2086360 --- [           main] [59e3fdba-6c7b-493c-8a0d-ae749a1bd13a] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-19T22:08:01.588-03:00  WARN 2086360 --- [           main] [59e3fdba-6c7b-493c-8a0d-ae749a1bd13a] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-19T22:08:01.589-03:00  WARN 2086360 --- [           main] [59e3fdba-6c7b-493c-8a0d-ae749a1bd13a] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-19T22:08:01.775-03:00  INFO 2086360 --- [           main] [59e3fdba-6c7b-493c-8a0d-ae749a1bd13a] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 300ms userId=1 planId=1
2026-11-19T22:08:01.869-03:00  INFO 2086360 --- [           main] [37bdee37-e923-4c66-880e-dd2c837cafe8] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 77ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='FormerMemberEditIT#formerMembe` - exit 0

```
2026-11-19T22:08:28.226-03:00  WARN 2086893 --- [           main] [75d84c96-0556-4117-a48f-2526309c0c8c] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List)
2026-11-19T22:08:28.226-03:00  WARN 2086893 --- [           main] [75d84c96-0556-4117-a48f-2526309c0c8c] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-19T22:08:28.226-03:00  WARN 2086893 --- [           main] [75d84c96-0556-4117-a48f-2526309c0c8c] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-19T22:08:28.227-03:00  WARN 2086893 --- [           main] [75d84c96-0556-4117-a48f-2526309c0c8c] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#participants()
2026-11-19T22:08:28.227-03:00  WARN 2086893 --- [           main] [75d84c96-0556-4117-a48f-2526309c0c8c] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#items()
2026-11-19T22:08:28.390-03:00  INFO 2086893 --- [           main] [75d84c96-0556-4117-a48f-2526309c0c8c] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 283ms userId=1 planId=1
2026-11-19T22:08:28.413-03:00  WARN 2086893 --- [           main] [136d8f42-a6c1-4335-a9ff-629e00bb35b8] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#items()
2026-11-19T22:08:28.414-03:00  WARN 2086893 --- [           main] [136d8f42-a6c1-4335-a9ff-629e00bb35b8] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-19T22:08:28.414-03:00  WARN 2086893 --- [           main] [136d8f42-a6c1-4335-a9ff-629e00bb35b8] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#participants()
2026-11-19T22:08:28.414-03:00  WARN 2086893 --- [           main] [136d8f42-a6c1-4335-a9ff-629e00bb35b8] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-19T22:08:28.414-03:00  WARN 2086893 --- [           main] [136d8f42-a6c1-4335-a9ff-629e00bb35b8] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#com.lcs.findraco.transaction.request.UpdateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, Long)
2026-11-19T22:08:28.414-03:00  WARN 2086893 --- [           main] [136d8f42-a6c1-4335-a9ff-629e00bb35b8] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#com.lcs.findraco.transaction.request.UpdateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, Long)
2026-11-19T22:08:28.465-03:00  INFO 2086893 --- [           main] [136d8f42-a6c1-4335-a9ff-629e00bb35b8] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/{id} 422 62ms userId=1 planId=1
2026-11-19T22:08:28.509-03:00  INFO 2086893 --- [           main] [8f5abbfa-50c2-45f1-ae4e-2a806c8693f1] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 16ms userId=1 planId=1
2026-11-19T22:08:28.525-03:00  INFO 2086893 --- [           main] [5810cc97-90e6-4dbf-ab0f-fbe0b426df36] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/{id} 200 13ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureHubIT#updateOfARowSh` - exit 0

```
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-19T22:08:55.241-03:00  INFO 2087418 --- [           main] [f4669ac5-4490-443f-8824-7668d8bda0a6] i.m.server.McpAsyncServer                : Client initialize request - Protocol: 2025-06-18, Capabilities: ClientCapabilities[experimental=null, roots=null, sampling=null, elicitation=null, extensions=null], Info: Implementation[name=test, title=null, version=1, description=null, icons=null, websiteUrl=null]
2026-11-19T22:08:55.261-03:00  INFO 2087418 --- [           main] [f4669ac5-4490-443f-8824-7668d8bda0a6] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 149ms userId=- planId=-
2026-11-19T22:08:55.272-03:00  INFO 2087418 --- [           main] [dbc85072-052c-4979-9ff7-c62721b43ca1] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 7ms userId=- planId=-
2026-11-19T22:08:55.411-03:00  WARN 2087418 --- [           main] [d4c8d862-c929-445a-a456-a2911364dac4] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#com.lcs.findraco.transaction.request.UpdateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, Long)
2026-11-19T22:08:55.414-03:00  WARN 2087418 --- [           main] [d4c8d862-c929-445a-a456-a2911364dac4] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#com.lcs.findraco.transaction.request.UpdateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, Long)
2026-11-19T22:08:55.414-03:00  WARN 2087418 --- [           main] [d4c8d862-c929-445a-a456-a2911364dac4] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#items()
2026-11-19T22:08:55.415-03:00  WARN 2087418 --- [           main] [d4c8d862-c929-445a-a456-a2911364dac4] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-19T22:08:55.415-03:00  WARN 2087418 --- [           main] [d4c8d862-c929-445a-a456-a2911364dac4] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-19T22:08:55.415-03:00  WARN 2087418 --- [           main] [d4c8d862-c929-445a-a456-a2911364dac4] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#participants()
2026-11-19T22:08:55.462-03:00  INFO 2087418 --- [           main] [d4c8d862-c929-445a-a456-a2911364dac4] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=update_transaction user=1 plan=1 outcome=ok durationMs=174
2026-11-19T22:08:55.477-03:00  INFO 2087418 --- [           main] [d4c8d862-c929-445a-a456-a2911364dac4] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 204ms userId=- planId=-
2026-11-19T22:08:55.561-03:00  INFO 2087418 --- [           main] [ce6eff47-5c29-43f6-8721-424de02ef513] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/{id} 200 39ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='FormerMemberEditIT#formerMembe` - exit 0

```
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-19T22:09:22.571-03:00  WARN 2087946 --- [           main] [2a98d619-ccca-4af8-8e77-bff5f26d33c4] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-19T22:09:22.574-03:00  WARN 2087946 --- [           main] [2a98d619-ccca-4af8-8e77-bff5f26d33c4] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-19T22:09:22.575-03:00  WARN 2087946 --- [           main] [2a98d619-ccca-4af8-8e77-bff5f26d33c4] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-19T22:09:22.766-03:00  INFO 2087946 --- [           main] [2a98d619-ccca-4af8-8e77-bff5f26d33c4] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 321ms userId=1 planId=1
2026-11-19T22:09:22.858-03:00  INFO 2087946 --- [           main] [974c029c-bc4b-4de8-857a-2cb3e2604cd1] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 77ms userId=1 planId=1
2026-11-19T22:09:22.881-03:00  INFO 2087946 --- [           main] [e568fb62-527d-49ac-887d-3dff924da840] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 22ms userId=1 planId=1
2026-11-19T22:09:22.905-03:00  INFO 2087946 --- [           main] [7da1bda7-cc95-41c8-b647-e761baa604b7] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 21ms userId=1 planId=1
2026-11-19T22:09:22.936-03:00  INFO 2087946 --- [           main] [da1c9c43-69ef-40f7-8d61-2e4abf7d2d18] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 422 28ms userId=1 planId=1
2026-11-19T22:09:22.984-03:00  INFO 2087946 --- [           main] [98feb099-430f-43c3-9a36-0fcdf979c9b9] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 422 23ms userId=1 planId=1
2026-11-19T22:09:22.998-03:00  INFO 2087946 --- [           main] [a2bf52c3-8d05-407a-979f-0c0163dea725] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/{id} 200 12ms userId=1 planId=1
```
