# series-day-edit proofs

**HEAD**: 8b448c59
**Tree**: clean
**Shell**: /bin/sh
**Result**: 29 pass, 0 fail

| Check | Proof | Result |
| --- | --- | --- |
| C1 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesDateEditIT#onlyThisMoves` | pass |
| C2 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesDateEditIT#movedAloneKee` | pass |
| C3 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesDateEditIT#dayChangeMove` | pass |
| C4 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesDateEditIT#confirmedKeep` | pass |
| C5 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesDateEditIT#movedAloneMov` | pass |
| C6 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesDateEditIT#dayThirtyOneF` | pass |
| C7 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesDateEditIT#deletedMonthS` | pass |
| C8 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesDateEditIT#topUpUsesChan` | pass |
| C9 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesDateEditIT#restoreBefore` | pass |
| C10 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesDateEditIT#firstOccurren` | pass |
| C11 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesDateEditIT#firstOccurren` | pass |
| C12 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesDateEditIT#monthShiftMov` | pass |
| C13 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesDateEditIT#invalidDateCh` | pass |
| C14 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesDateEditIT#monthCollisio` | pass |
| C15 | `run unit / ✓ TransactionFormDrawer series date > shows the opened occurrence's date` | pass |
| C16 | `run unit / ✓ TransactionFormDrawer series date > offers only this and following when the date changed` | pass |
| C16 | `run stories / ✓ src/features/transactions/components/SeriesScopeDialog.stories.tsx > Date Changed` | pass |
| C17 | `run unit / ✓ TransactionFormDrawer series date > offers every scope when the date is unchanged` | pass |
| C18 | `run unit / ✓ transactionForm series date > sends the pivot date only when it changed` | pass |
| C19 | `run unit / ✓ TransactionFormDrawer series date > refuses a date and installments change in one edit` | pass |
| C20 | `run unit / ✓ TransactionFormDrawer series date > shows the series date problems from the API` | pass |
| C21 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='MigrationsIT#recurrenceDayOfMo` | pass |
| C22 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='OpenApiSnapshotIT' -Dsurefire.` | pass |
| C23 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesEditIT,SeriesConfirmatio` | pass |
| C24 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesDateEditIT#dateChangeNee` | pass |
| Build | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -DskipITs -Dsurefire.skip=true` | pass |
| Build | `cd frontend && pnpm lint` | pass |
| Build | `cd frontend && pnpm build` | pass |
| Build | `cd frontend && node scripts/check-siblings.ts` | pass |

## Output

`Run unit` - exit 0

```
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer > keeps a former member's share when saving 82ms
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer > shows the split of a row shared with a former member in a one-member plan 116ms
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer > the date field has no clear button 46ms
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer > saves a neutral kind without category or split 359ms
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer > keeps the payer of a neutral row when another member saves it 103ms
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer > keeps the category of a refund, from the expense categories 329ms
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer > reopens a row with its movement kind 56ms
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer > one-off shows no confirmation controls 39ms

 Test Files  2 passed (2)
      Tests  91 passed (91)
   Start at  02:23:51
   Duration  10.70s (transform 411ms, setup 218ms, collect 4.82s, tests 7.11s, environment 751ms, prepare 87ms)

No story files found for the specified pattern: src/**/*.mdx
```

`Run stories` - exit 0

```
info Using tsconfig paths for react-docgen
info Using tsconfig paths for react-docgen
info Using tsconfig paths for react-docgen
 ✓ |storybook (chromium)| src/features/transactions/components/SeriesScopeDialog.stories.tsx > Edit 289ms
 ✓ |storybook (chromium)| src/features/transactions/components/SeriesScopeDialog.stories.tsx > Date Changed 43ms

 Test Files  1 passed (1)
      Tests  2 passed (2)
   Start at  02:24:03
   Duration  1.62s (transform 0ms, setup 368ms, collect 146ms, tests 334ms, environment 0ms, prepare 2.06s)

No story files found for the specified pattern: src/**/*.mdx
stderr | src/features/transactions/components/SeriesScopeDialog.stories.tsx > Edit
You are using Testing Library's `screen` object. Use `within(canvasElement)` instead.
More info: https://storybook.js.org/docs/writing-tests/interaction-testing?ref=error
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesDateEditIT#onlyThisMoves` - exit 0

```
2026-11-23T02:24:27.604-03:00  INFO 2381672 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-23T02:24:27.665-03:00  INFO 2381672 --- [           main] [] c.l.f.transaction.SeriesDateEditIT       : Started SeriesDateEditIT in 11.074 seconds (process running for 12.371)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-23T02:24:28.257-03:00  WARN 2381672 --- [           main] [4defdb05-3349-449d-a34e-1cc0073d35b8] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-23T02:24:28.259-03:00  WARN 2381672 --- [           main] [4defdb05-3349-449d-a34e-1cc0073d35b8] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-23T02:24:28.260-03:00  WARN 2381672 --- [           main] [4defdb05-3349-449d-a34e-1cc0073d35b8] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-23T02:24:28.421-03:00  INFO 2381672 --- [           main] [4defdb05-3349-449d-a34e-1cc0073d35b8] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 277ms userId=1 planId=1
2026-11-23T02:24:28.514-03:00  INFO 2381672 --- [           main] [a601ab03-dffb-464e-8781-916865e2156c] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 76ms userId=1 planId=1
2026-11-23T02:24:28.648-03:00  INFO 2381672 --- [           main] [3b13981b-ed1f-4d15-aca0-dfddb72059cf] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 33ms userId=1 planId=1
2026-11-23T02:24:28.679-03:00  INFO 2381672 --- [           main] [a5f21b37-26e6-4ad5-81c9-a9104d629521] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 28ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesDateEditIT#movedAloneKee` - exit 0

```
2026-11-23T02:24:56.257-03:00  INFO 2382188 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-23T02:24:56.258-03:00  INFO 2382188 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-23T02:24:56.315-03:00  INFO 2382188 --- [           main] [] c.l.f.transaction.SeriesDateEditIT       : Started SeriesDateEditIT in 9.485 seconds (process running for 10.793)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-23T02:24:56.896-03:00  WARN 2382188 --- [           main] [22292c13-9712-4e09-8bee-25deee0faf60] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-23T02:24:56.899-03:00  WARN 2382188 --- [           main] [22292c13-9712-4e09-8bee-25deee0faf60] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-23T02:24:56.900-03:00  WARN 2382188 --- [           main] [22292c13-9712-4e09-8bee-25deee0faf60] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-23T02:24:57.071-03:00  INFO 2382188 --- [           main] [22292c13-9712-4e09-8bee-25deee0faf60] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 283ms userId=1 planId=1
2026-11-23T02:24:57.162-03:00  INFO 2382188 --- [           main] [bdc83867-cfc2-41e9-afb7-0fc948097816] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 75ms userId=1 planId=1
2026-11-23T02:24:57.210-03:00  INFO 2382188 --- [           main] [e2100860-035f-4157-ad94-a3e5886bd677] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 46ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesDateEditIT#dayChangeMove` - exit 0

```
2026-11-23T02:25:24.986-03:00  INFO 2382703 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-23T02:25:25.047-03:00  INFO 2382703 --- [           main] [] c.l.f.transaction.SeriesDateEditIT       : Started SeriesDateEditIT in 9.429 seconds (process running for 10.624)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-23T02:25:25.649-03:00  WARN 2382703 --- [           main] [40e5e1c3-6bde-482a-b05e-699c25c06b27] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-23T02:25:25.652-03:00  WARN 2382703 --- [           main] [40e5e1c3-6bde-482a-b05e-699c25c06b27] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-23T02:25:25.652-03:00  WARN 2382703 --- [           main] [40e5e1c3-6bde-482a-b05e-699c25c06b27] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-23T02:25:25.824-03:00  INFO 2382703 --- [           main] [40e5e1c3-6bde-482a-b05e-699c25c06b27] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 308ms userId=1 planId=1
2026-11-23T02:25:25.933-03:00  INFO 2382703 --- [           main] [adce0e28-681d-4ef7-81d9-2ed3a321bf91] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 93ms userId=1 planId=1
2026-11-23T02:25:26.034-03:00  INFO 2382703 --- [           main] [5af2cdb3-2775-4a69-987d-7874377a29cd] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 27ms userId=1 planId=1
2026-11-23T02:25:26.069-03:00  INFO 2382703 --- [           main] [c5397154-5db6-40bf-8fce-efe255428bc7] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 33ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesDateEditIT#confirmedKeep` - exit 0

```
2026-11-23T02:25:53.988-03:00  INFO 2383231 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-23T02:25:53.989-03:00  INFO 2383231 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-23T02:25:54.049-03:00  INFO 2383231 --- [           main] [] c.l.f.transaction.SeriesDateEditIT       : Started SeriesDateEditIT in 9.551 seconds (process running for 10.792)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-23T02:25:54.620-03:00  WARN 2383231 --- [           main] [d0165586-4b81-4c49-b035-ed7b26f92cf2] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-23T02:25:54.623-03:00  WARN 2383231 --- [           main] [d0165586-4b81-4c49-b035-ed7b26f92cf2] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-23T02:25:54.624-03:00  WARN 2383231 --- [           main] [d0165586-4b81-4c49-b035-ed7b26f92cf2] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-23T02:25:54.796-03:00  INFO 2383231 --- [           main] [d0165586-4b81-4c49-b035-ed7b26f92cf2] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 287ms userId=1 planId=1
2026-11-23T02:25:54.855-03:00  INFO 2383231 --- [           main] [542e799c-c70d-4469-8e3d-1138344d2229] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/{id}/confirm 200 41ms userId=1 planId=1
2026-11-23T02:25:54.926-03:00  INFO 2383231 --- [           main] [b857b112-90ce-46c9-83ce-e045224d4090] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 67ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesDateEditIT#movedAloneMov` - exit 0

```
2026-11-23T02:26:22.913-03:00  INFO 2383729 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-23T02:26:22.915-03:00  INFO 2383729 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 2 ms
2026-11-23T02:26:22.973-03:00  INFO 2383729 --- [           main] [] c.l.f.transaction.SeriesDateEditIT       : Started SeriesDateEditIT in 9.433 seconds (process running for 10.667)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-23T02:26:23.557-03:00  WARN 2383729 --- [           main] [4bc8828b-8af7-4a80-b665-68a361617788] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-23T02:26:23.560-03:00  WARN 2383729 --- [           main] [4bc8828b-8af7-4a80-b665-68a361617788] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-23T02:26:23.560-03:00  WARN 2383729 --- [           main] [4bc8828b-8af7-4a80-b665-68a361617788] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-23T02:26:23.718-03:00  INFO 2383729 --- [           main] [4bc8828b-8af7-4a80-b665-68a361617788] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 292ms userId=1 planId=1
2026-11-23T02:26:23.826-03:00  INFO 2383729 --- [           main] [b13c18d4-3926-4cbf-ade2-bcb62a1d6c98] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 90ms userId=1 planId=1
2026-11-23T02:26:23.879-03:00  INFO 2383729 --- [           main] [b02df115-ae27-4c18-a7b3-e7a91ca2b625] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 50ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesDateEditIT#dayThirtyOneF` - exit 0

```
2026-11-23T02:26:51.282-03:00  INFO 2384231 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 2 ms
2026-11-23T02:26:51.339-03:00  INFO 2384231 --- [           main] [] c.l.f.transaction.SeriesDateEditIT       : Started SeriesDateEditIT in 9.423 seconds (process running for 10.598)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-23T02:26:51.934-03:00  WARN 2384231 --- [           main] [c21de4a3-60f9-42a5-b5ff-15965250c71a] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-23T02:26:51.938-03:00  WARN 2384231 --- [           main] [c21de4a3-60f9-42a5-b5ff-15965250c71a] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-23T02:26:51.938-03:00  WARN 2384231 --- [           main] [c21de4a3-60f9-42a5-b5ff-15965250c71a] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-23T02:26:52.094-03:00  INFO 2384231 --- [           main] [c21de4a3-60f9-42a5-b5ff-15965250c71a] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 276ms userId=1 planId=1
2026-11-23T02:26:52.202-03:00  INFO 2384231 --- [           main] [788cfb80-7952-4e73-bc6f-d98509db2e28] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 92ms userId=1 planId=1
2026-11-23T02:26:52.279-03:00  INFO 2384231 --- [           main] [12b44a4d-1d39-49f6-bcd1-17f33d98f350] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 29ms userId=1 planId=1
2026-11-23T02:26:52.306-03:00  INFO 2384231 --- [           main] [aae7635b-df21-4b93-94cd-6c91f00cd191] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 24ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesDateEditIT#deletedMonthS` - exit 0

```
2026-11-23T02:27:19.753-03:00  INFO 2384763 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 2 ms
2026-11-23T02:27:19.815-03:00  INFO 2384763 --- [           main] [] c.l.f.transaction.SeriesDateEditIT       : Started SeriesDateEditIT in 9.459 seconds (process running for 10.592)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-23T02:27:20.448-03:00  WARN 2384763 --- [           main] [7c1e354d-7036-486c-a0e2-4a73671f6aae] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-23T02:27:20.451-03:00  WARN 2384763 --- [           main] [7c1e354d-7036-486c-a0e2-4a73671f6aae] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-23T02:27:20.451-03:00  WARN 2384763 --- [           main] [7c1e354d-7036-486c-a0e2-4a73671f6aae] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-23T02:27:20.615-03:00  INFO 2384763 --- [           main] [7c1e354d-7036-486c-a0e2-4a73671f6aae] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 287ms userId=1 planId=1
2026-11-23T02:27:20.720-03:00  INFO 2384763 --- [           main] [632e5b63-8235-4490-8853-fa2f1506cd22] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 91ms userId=1 planId=1
2026-11-23T02:27:20.777-03:00  INFO 2384763 --- [           main] [1881b728-25a8-499f-bafe-7187e277588b] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 51ms userId=1 planId=1
2026-11-23T02:27:20.893-03:00  INFO 2384763 --- [           main] [162a6eaf-e18c-4a45-bd8c-bde1cb47cf62] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 40ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesDateEditIT#topUpUsesChan` - exit 0

```
2026-11-23T02:27:48.794-03:00  INFO 2385285 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-23T02:27:48.794-03:00  INFO 2385285 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-23T02:27:48.795-03:00  INFO 2385285 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-23T02:27:48.853-03:00  INFO 2385285 --- [           main] [] c.l.f.transaction.SeriesDateEditIT       : Started SeriesDateEditIT in 10.339 seconds (process running for 11.532)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-23T02:27:49.436-03:00  WARN 2385285 --- [           main] [6de417d8-29e3-435f-ae3f-9d38df935756] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-23T02:27:49.440-03:00  WARN 2385285 --- [           main] [6de417d8-29e3-435f-ae3f-9d38df935756] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-23T02:27:49.440-03:00  WARN 2385285 --- [           main] [6de417d8-29e3-435f-ae3f-9d38df935756] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-23T02:27:49.622-03:00  INFO 2385285 --- [           main] [6de417d8-29e3-435f-ae3f-9d38df935756] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 298ms userId=1 planId=1
2026-11-23T02:27:49.789-03:00  INFO 2385285 --- [           main] [078060b7-74b5-4595-95b8-8504510ed47d] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 148ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesDateEditIT#restoreBefore` - exit 0

```
2026-11-23T02:28:18.542-03:00  INFO 2385787 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-23T02:28:18.606-03:00  INFO 2385787 --- [           main] [] c.l.f.transaction.SeriesDateEditIT       : Started SeriesDateEditIT in 9.274 seconds (process running for 10.534)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-23T02:28:19.184-03:00  WARN 2385787 --- [           main] [1c3759a3-b4c3-4cbf-a648-b423c7d14962] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-23T02:28:19.187-03:00  WARN 2385787 --- [           main] [1c3759a3-b4c3-4cbf-a648-b423c7d14962] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-23T02:28:19.188-03:00  WARN 2385787 --- [           main] [1c3759a3-b4c3-4cbf-a648-b423c7d14962] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-23T02:28:19.352-03:00  INFO 2385787 --- [           main] [1c3759a3-b4c3-4cbf-a648-b423c7d14962] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 296ms userId=1 planId=1
2026-11-23T02:28:19.430-03:00  INFO 2385787 --- [           main] [9a576332-88d3-40a0-a918-4120205a1128] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 68ms userId=1 planId=1
2026-11-23T02:28:19.481-03:00  INFO 2385787 --- [           main] [7ec9f49c-ec3e-4d57-8477-64e9cb10dc79] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 46ms userId=1 planId=1
2026-11-23T02:28:19.510-03:00  INFO 2385787 --- [           main] [b22fb1e7-380e-43d6-9e19-46dd25f18f86] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 409 27ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesDateEditIT#firstOccurren` - exit 0

```
2026-11-23T02:28:47.379-03:00  INFO 2386305 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-23T02:28:47.379-03:00  INFO 2386305 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-23T02:28:47.381-03:00  INFO 2386305 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 2 ms
2026-11-23T02:28:47.440-03:00  INFO 2386305 --- [           main] [] c.l.f.transaction.SeriesDateEditIT       : Started SeriesDateEditIT in 9.256 seconds (process running for 10.517)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-23T02:28:48.021-03:00  WARN 2386305 --- [           main] [ade00e3c-3f38-421c-af34-a6b50ad95570] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-23T02:28:48.025-03:00  WARN 2386305 --- [           main] [ade00e3c-3f38-421c-af34-a6b50ad95570] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-23T02:28:48.025-03:00  WARN 2386305 --- [           main] [ade00e3c-3f38-421c-af34-a6b50ad95570] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-23T02:28:48.180-03:00  INFO 2386305 --- [           main] [ade00e3c-3f38-421c-af34-a6b50ad95570] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 264ms userId=1 planId=1
2026-11-23T02:28:48.280-03:00  INFO 2386305 --- [           main] [87df4ec8-6fae-4965-84eb-c13249cee8a6] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 86ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesDateEditIT#firstOccurren` - exit 0

```
2026-11-23T02:29:15.452-03:00  INFO 2386810 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-23T02:29:15.452-03:00  INFO 2386810 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-23T02:29:15.454-03:00  INFO 2386810 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-23T02:29:15.522-03:00  INFO 2386810 --- [           main] [] c.l.f.transaction.SeriesDateEditIT       : Started SeriesDateEditIT in 9.365 seconds (process running for 10.644)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-23T02:29:16.097-03:00  WARN 2386810 --- [           main] [647eee05-767f-4462-8f52-a0a93cd13e7f] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-23T02:29:16.100-03:00  WARN 2386810 --- [           main] [647eee05-767f-4462-8f52-a0a93cd13e7f] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-23T02:29:16.100-03:00  WARN 2386810 --- [           main] [647eee05-767f-4462-8f52-a0a93cd13e7f] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-23T02:29:16.274-03:00  INFO 2386810 --- [           main] [647eee05-767f-4462-8f52-a0a93cd13e7f] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 295ms userId=1 planId=1
2026-11-23T02:29:16.402-03:00  INFO 2386810 --- [           main] [e54ffef4-02b4-492e-9575-c7faf8821e6d] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 112ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesDateEditIT#monthShiftMov` - exit 0

```
2026-11-23T02:29:43.623-03:00  INFO 2387310 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-23T02:29:43.624-03:00  INFO 2387310 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-23T02:29:43.691-03:00  INFO 2387310 --- [           main] [] c.l.f.transaction.SeriesDateEditIT       : Started SeriesDateEditIT in 9.21 seconds (process running for 10.446)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-23T02:29:44.272-03:00  WARN 2387310 --- [           main] [cf6f6c17-4437-4f63-9178-3e410d47fbc7] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-23T02:29:44.275-03:00  WARN 2387310 --- [           main] [cf6f6c17-4437-4f63-9178-3e410d47fbc7] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-23T02:29:44.275-03:00  WARN 2387310 --- [           main] [cf6f6c17-4437-4f63-9178-3e410d47fbc7] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-23T02:29:44.444-03:00  INFO 2387310 --- [           main] [cf6f6c17-4437-4f63-9178-3e410d47fbc7] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 299ms userId=1 planId=1
2026-11-23T02:29:44.543-03:00  INFO 2387310 --- [           main] [a0e27d52-9930-4c0b-84d3-823cb9ae60d5] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 87ms userId=1 planId=1
2026-11-23T02:29:44.607-03:00  INFO 2387310 --- [           main] [2d1fee7c-11f5-4047-a930-1e44013ef4b9] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 58ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesDateEditIT#invalidDateCh` - exit 0

```
2026-11-23T02:30:12.501-03:00  INFO 2387836 --- [           main] [] c.l.f.transaction.SeriesDateEditIT       : Started SeriesDateEditIT in 9.634 seconds (process running for 10.796)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-23T02:30:13.067-03:00  WARN 2387836 --- [           main] [9c1a6fa3-780d-40f9-8cbe-3eb1c29a7eda] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-23T02:30:13.069-03:00  WARN 2387836 --- [           main] [9c1a6fa3-780d-40f9-8cbe-3eb1c29a7eda] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-23T02:30:13.070-03:00  WARN 2387836 --- [           main] [9c1a6fa3-780d-40f9-8cbe-3eb1c29a7eda] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-23T02:30:13.253-03:00  INFO 2387836 --- [           main] [9c1a6fa3-780d-40f9-8cbe-3eb1c29a7eda] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 294ms userId=1 planId=1
2026-11-23T02:30:13.349-03:00  INFO 2387836 --- [           main] [4b3d324f-49a2-4a94-b424-132b9cdb92c8] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 422 76ms userId=1 planId=1
2026-11-23T02:30:13.401-03:00  INFO 2387836 --- [           main] [7a3f2d1c-c729-4482-976b-5fa8fcdedb8e] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 422 24ms userId=1 planId=1
2026-11-23T02:30:13.503-03:00  INFO 2387836 --- [           main] [5782fd19-23ba-4087-b5ef-27de7bd42635] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 44ms userId=1 planId=1
2026-11-23T02:30:13.551-03:00  INFO 2387836 --- [           main] [4e2312fe-e967-4032-ae6b-21a3ae75ed80] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 42ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesDateEditIT#monthCollisio` - exit 0

```
2026-11-23T02:30:40.381-03:00  INFO 2388330 --- [           main] [] c.l.f.transaction.SeriesDateEditIT       : Started SeriesDateEditIT in 9.278 seconds (process running for 10.53)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-23T02:30:40.967-03:00  WARN 2388330 --- [           main] [1c1d733e-4a8d-43f0-9c9f-477633379831] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-23T02:30:40.970-03:00  WARN 2388330 --- [           main] [1c1d733e-4a8d-43f0-9c9f-477633379831] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-23T02:30:40.970-03:00  WARN 2388330 --- [           main] [1c1d733e-4a8d-43f0-9c9f-477633379831] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-23T02:30:41.129-03:00  INFO 2388330 --- [           main] [1c1d733e-4a8d-43f0-9c9f-477633379831] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 272ms userId=1 planId=1
2026-11-23T02:30:41.210-03:00  INFO 2388330 --- [           main] [79377719-b294-48b9-a931-615c4098c06b] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/{id}/confirm 200 52ms userId=1 planId=1
2026-11-23T02:30:41.285-03:00  INFO 2388330 --- [           main] [bfb819c2-8e45-4862-aff3-6534666cb928] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 422 69ms userId=1 planId=1
2026-11-23T02:30:41.430-03:00  INFO 2388330 --- [           main] [b9597f64-f85a-43e6-9eb0-d526fda8a4d8] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 36ms userId=1 planId=1
2026-11-23T02:30:41.468-03:00  INFO 2388330 --- [           main] [59a934f8-cc3f-4e60-8a45-c8493e660716] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 34ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='MigrationsIT#recurrenceDayOfMo` - exit 0

```
2026-11-23T02:31:09.412-03:00  INFO 2388859 --- [           main] [] o.f.core.internal.command.DbMigrate      : Migrating schema "public" to version "21 - cascade plan deletion"
2026-11-23T02:31:09.428-03:00  INFO 2388859 --- [           main] [] o.f.core.internal.command.DbMigrate      : Migrating schema "public" to version "22 - add user language"
2026-11-23T02:31:09.434-03:00  INFO 2388859 --- [           main] [] o.f.core.internal.command.DbMigrate      : Migrating schema "public" to version "23 - add transaction confirmation"
2026-11-23T02:31:09.443-03:00  INFO 2388859 --- [           main] [] o.f.core.internal.command.DbMigrate      : Migrating schema "public" to version "24 - add transaction scheduled date"
2026-11-23T02:31:09.450-03:00  INFO 2388859 --- [           main] [] o.f.core.internal.command.DbMigrate      : Migrating schema "public" to version "25 - add oauth authorization"
2026-11-23T02:31:09.461-03:00  INFO 2388859 --- [           main] [] o.f.core.internal.command.DbMigrate      : Migrating schema "public" to version "26 - add oauth rotated refresh tokens"
2026-11-23T02:31:09.469-03:00  INFO 2388859 --- [           main] [] o.f.core.internal.command.DbMigrate      : Migrating schema "public" to version "27 - add transaction trash"
2026-11-23T02:31:09.491-03:00  INFO 2388859 --- [           main] [] o.f.core.internal.command.DbMigrate      : Migrating schema "public" to version "28 - add recurrence rule revision"
2026-11-23T02:31:09.502-03:00  INFO 2388859 --- [           main] [] o.f.core.internal.command.DbMigrate      : Migrating schema "public" to version "29 - add transaction kind"
2026-11-23T02:31:09.508-03:00  INFO 2388859 --- [           main] [] o.f.core.internal.command.DbMigrate      : Successfully applied 29 migrations to schema "public", now at version v29 (execution time 00:00.265s)
2026-11-23T02:31:09.542-03:00  INFO 2388859 --- [           main] [] org.flywaydb.core.FlywayExecutor         : Database: jdbc:postgresql://localhost:42193/findraco_test_v13_scratch?loggerLevel=OFF (PostgreSQL 16.14)
2026-11-23T02:31:09.560-03:00  INFO 2388859 --- [           main] [] o.f.core.internal.command.DbValidate     : Successfully validated 30 migrations (execution time 00:00.007s)
2026-11-23T02:31:09.574-03:00  INFO 2388859 --- [           main] [] o.f.core.internal.command.DbMigrate      : Current version of schema "public": 29
2026-11-23T02:31:09.576-03:00  INFO 2388859 --- [           main] [] o.f.core.internal.command.DbMigrate      : Migrating schema "public" to version "30 - add recurrence day of month"
2026-11-23T02:31:09.586-03:00  INFO 2388859 --- [           main] [] o.f.core.internal.command.DbMigrate      : Successfully applied 1 migration to schema "public", now at version v30 (execution time 00:00.005s)
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='OpenApiSnapshotIT' -Dsurefire.` - exit 0

```
2026-11-23T02:31:36.990-03:00  INFO 2389355 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable resources templates capabilities, notification: true
2026-11-23T02:31:36.991-03:00  INFO 2389355 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable prompts capabilities, notification: true
2026-11-23T02:31:36.992-03:00  INFO 2389355 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable completions capabilities
2026-11-23T02:31:37.146-03:00  INFO 2389355 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-23T02:31:37.146-03:00  INFO 2389355 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-23T02:31:37.147-03:00  INFO 2389355 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-23T02:31:37.206-03:00  INFO 2389355 --- [           main] [] c.lcs.findraco.shared.OpenApiSnapshotIT  : Started OpenApiSnapshotIT in 9.366 seconds (process running for 10.753)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-23T02:31:38.157-03:00  INFO 2389355 --- [           main] [764e3212-44fb-450e-8767-307f10c15838] o.springdoc.api.AbstractOpenApiResource  : Init duration for springdoc-openapi is: 605 ms
2026-11-23T02:31:38.192-03:00  INFO 2389355 --- [           main] [764e3212-44fb-450e-8767-307f10c15838] c.l.f.shared.web.RequestLogFilter        : GET /v3/api-docs 200 670ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesEditIT,SeriesConfirmatio` - exit 0

```
2026-11-23T02:32:15.819-03:00  INFO 2389878 --- [           main] [4b01ece1-19eb-4b7e-8487-6fd4b7ffdb76] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/{id} 200 5ms userId=1 planId=1
2026-11-23T02:32:15.866-03:00  INFO 2389878 --- [           main] [7d37412f-6045-403f-bee7-b61a642ecf1f] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 7ms userId=1 planId=1
2026-11-23T02:32:15.874-03:00  INFO 2389878 --- [           main] [e0f4b251-003c-4168-a716-488609239296] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 7ms userId=2 planId=1
2026-11-23T02:32:15.884-03:00  INFO 2389878 --- [           main] [41d62010-68ef-475f-b34e-14ffda673369] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/{id} 200 8ms userId=1 planId=1
2026-11-23T02:32:15.889-03:00  INFO 2389878 --- [           main] [1d860575-53d6-4efd-9bf5-1e3e23e92fe9] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/{id} 200 4ms userId=2 planId=1
2026-11-23T02:32:15.897-03:00  INFO 2389878 --- [           main] [29a94692-9d16-4382-a79f-8b53e062f997] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/trash 200 7ms userId=2 planId=1
2026-11-23T02:32:15.907-03:00  INFO 2389878 --- [           main] [39d17c2c-c013-43c3-8cff-8ae05ba616c5] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/trash 200 9ms userId=1 planId=1
2026-11-23T02:32:15.917-03:00  INFO 2389878 --- [           main] [e45f9626-aeac-42bb-a565-6103997de3a0] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 200 9ms userId=2 planId=1
2026-11-23T02:32:15.934-03:00  INFO 2389878 --- [           main] [5d8c3d66-cdd3-4d10-a391-209f0f07ef3b] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction 200 16ms userId=2 planId=1
2026-11-23T02:32:15.982-03:00  INFO 2389878 --- [           main] [49291567-dc19-408e-9414-4e0ee29548e6] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 10ms userId=1 planId=1
2026-11-23T02:32:15.993-03:00  INFO 2389878 --- [           main] [655a179f-f565-49af-9941-b808e1882496] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 9ms userId=1 planId=1
2026-11-23T02:32:16.017-03:00  INFO 2389878 --- [           main] [e878f7a5-14c1-45d6-a96e-613b73ac95cb] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/dashboard 200 23ms userId=1 planId=1
2026-11-23T02:32:16.027-03:00  INFO 2389878 --- [           main] [6d376305-d7f1-4fdd-adac-0a4df223d421] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/{id} 200 9ms userId=1 planId=1
2026-11-23T02:32:16.050-03:00  INFO 2389878 --- [           main] [2fabe9c2-9c60-48b5-a6f8-3f4a6c2942ae] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction 200 19ms userId=1 planId=1
2026-11-23T02:32:16.069-03:00  INFO 2389878 --- [           main] [0b404263-f0c1-4de4-9bab-3a312999c922] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/dashboard 200 18ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesDateEditIT#dateChangeNee` - exit 0

```
2026-11-23T02:32:43.776-03:00  INFO 2390382 --- [           main] [] c.l.f.transaction.SeriesDateEditIT       : Started SeriesDateEditIT in 9.576 seconds (process running for 10.797)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-23T02:32:44.358-03:00  WARN 2390382 --- [           main] [8ec40490-cf71-452f-962a-787b7ffbaf62] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-23T02:32:44.361-03:00  WARN 2390382 --- [           main] [8ec40490-cf71-452f-962a-787b7ffbaf62] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-23T02:32:44.362-03:00  WARN 2390382 --- [           main] [8ec40490-cf71-452f-962a-787b7ffbaf62] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-23T02:32:44.529-03:00  INFO 2390382 --- [           main] [8ec40490-cf71-452f-962a-787b7ffbaf62] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 281ms userId=1 planId=1
2026-11-23T02:32:44.624-03:00  INFO 2390382 --- [           main] [6b680b0f-b09b-49a5-aa9c-df208267d6b5] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 403 77ms userId=2 planId=1
2026-11-23T02:32:44.674-03:00  INFO 2390382 --- [           main] [857a4958-35ad-4631-ac27-a0f73df44dd0] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 403 19ms userId=2 planId=1
2026-11-23T02:32:44.687-03:00  INFO 2390382 --- [           main] [f74b66fb-ff7a-4108-aa2a-b1c2b41fc948] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 403 10ms userId=3 planId=1
2026-11-23T02:32:44.699-03:00  INFO 2390382 --- [           main] [57f01b6d-49ab-457b-a41f-f014df421bd4] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 404 9ms userId=4 planId=1
```
