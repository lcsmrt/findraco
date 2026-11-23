# series-day-edit proofs

**HEAD**: 9642ea5b
**Tree**: clean
**Shell**: /bin/sh
**Result**: 31 pass, 0 fail

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
| C25 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesDateEditIT#typedEndWinsO` | pass |
| C26 | `run unit / ✓ TransactionFormDrawer series date > saves an occurrence moved past the series end` | pass |
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
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer > keeps a former member's share when saving 93ms
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer > shows the split of a row shared with a former member in a one-member plan 121ms
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer > the date field has no clear button 43ms
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer > saves a neutral kind without category or split 380ms
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer > keeps the payer of a neutral row when another member saves it 103ms
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer > keeps the category of a refund, from the expense categories 333ms
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer > reopens a row with its movement kind 53ms
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer > one-off shows no confirmation controls 41ms

 Test Files  2 passed (2)
      Tests  92 passed (92)
   Start at  14:05:23
   Duration  10.78s (transform 429ms, setup 227ms, collect 4.74s, tests 7.23s, environment 715ms, prepare 89ms)

No story files found for the specified pattern: src/**/*.mdx
```

`Run stories` - exit 0

```
info Using tsconfig paths for react-docgen
info Using tsconfig paths for react-docgen
info Using tsconfig paths for react-docgen
 ✓ |storybook (chromium)| src/features/transactions/components/SeriesScopeDialog.stories.tsx > Edit 284ms
 ✓ |storybook (chromium)| src/features/transactions/components/SeriesScopeDialog.stories.tsx > Date Changed 43ms

 Test Files  1 passed (1)
      Tests  2 passed (2)
   Start at  14:05:35
   Duration  1.61s (transform 0ms, setup 377ms, collect 132ms, tests 328ms, environment 0ms, prepare 2.07s)

No story files found for the specified pattern: src/**/*.mdx
stderr | src/features/transactions/components/SeriesScopeDialog.stories.tsx > Edit
You are using Testing Library's `screen` object. Use `within(canvasElement)` instead.
More info: https://storybook.js.org/docs/writing-tests/interaction-testing?ref=error
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesDateEditIT#onlyThisMoves` - exit 0

```
2026-11-23T14:05:57.841-03:00  INFO 2445070 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 2 ms
2026-11-23T14:05:57.900-03:00  INFO 2445070 --- [           main] [] c.l.f.transaction.SeriesDateEditIT       : Started SeriesDateEditIT in 9.653 seconds (process running for 10.822)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-23T14:05:58.462-03:00  WARN 2445070 --- [           main] [504f848c-a7e6-48f4-b1bf-81943bc6ff1b] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-23T14:05:58.465-03:00  WARN 2445070 --- [           main] [504f848c-a7e6-48f4-b1bf-81943bc6ff1b] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-23T14:05:58.466-03:00  WARN 2445070 --- [           main] [504f848c-a7e6-48f4-b1bf-81943bc6ff1b] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-23T14:05:58.614-03:00  INFO 2445070 --- [           main] [504f848c-a7e6-48f4-b1bf-81943bc6ff1b] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 262ms userId=1 planId=1
2026-11-23T14:05:58.688-03:00  INFO 2445070 --- [           main] [06ed41a6-e1af-4ab8-8cf1-0494584b2e8a] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 61ms userId=1 planId=1
2026-11-23T14:05:58.797-03:00  INFO 2445070 --- [           main] [c8c60d78-9e70-408e-911c-5cbb74ddbb94] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 33ms userId=1 planId=1
2026-11-23T14:05:58.824-03:00  INFO 2445070 --- [           main] [a134027f-7e46-4b53-b66b-2c036e64287f] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 24ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesDateEditIT#movedAloneKee` - exit 0

```
2026-11-23T14:06:27.872-03:00  INFO 2445613 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-23T14:06:27.874-03:00  INFO 2445613 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 2 ms
2026-11-23T14:06:27.931-03:00  INFO 2445613 --- [           main] [] c.l.f.transaction.SeriesDateEditIT       : Started SeriesDateEditIT in 10.255 seconds (process running for 11.479)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-23T14:06:28.498-03:00  WARN 2445613 --- [           main] [c076383f-eccf-44db-91ef-06a0d673f1f9] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-23T14:06:28.502-03:00  WARN 2445613 --- [           main] [c076383f-eccf-44db-91ef-06a0d673f1f9] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-23T14:06:28.502-03:00  WARN 2445613 --- [           main] [c076383f-eccf-44db-91ef-06a0d673f1f9] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-23T14:06:28.671-03:00  INFO 2445613 --- [           main] [c076383f-eccf-44db-91ef-06a0d673f1f9] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 278ms userId=1 planId=1
2026-11-23T14:06:28.752-03:00  INFO 2445613 --- [           main] [21567ab7-c229-4cca-81e4-d6f6ffb285b8] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 67ms userId=1 planId=1
2026-11-23T14:06:28.795-03:00  INFO 2445613 --- [           main] [e54b54a1-144c-4879-b160-6fa9779e0b6f] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 40ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesDateEditIT#dayChangeMove` - exit 0

```
2026-11-23T14:06:58.486-03:00  INFO 2446146 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-23T14:06:58.562-03:00  INFO 2446146 --- [           main] [] c.l.f.transaction.SeriesDateEditIT       : Started SeriesDateEditIT in 9.287 seconds (process running for 10.603)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-23T14:06:59.129-03:00  WARN 2446146 --- [           main] [b58adc01-c950-4308-97e7-f1d0847c1e99] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-23T14:06:59.133-03:00  WARN 2446146 --- [           main] [b58adc01-c950-4308-97e7-f1d0847c1e99] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-23T14:06:59.133-03:00  WARN 2446146 --- [           main] [b58adc01-c950-4308-97e7-f1d0847c1e99] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-23T14:06:59.289-03:00  INFO 2446146 --- [           main] [b58adc01-c950-4308-97e7-f1d0847c1e99] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 278ms userId=1 planId=1
2026-11-23T14:06:59.377-03:00  INFO 2446146 --- [           main] [28aacc62-8a73-42f3-a334-f1a36068f0ff] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 73ms userId=1 planId=1
2026-11-23T14:06:59.469-03:00  INFO 2446146 --- [           main] [af135a49-ab39-4a20-82d5-1c2bd47b44f5] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 28ms userId=1 planId=1
2026-11-23T14:06:59.502-03:00  INFO 2446146 --- [           main] [e992756a-c830-4a94-b9b4-048e0a9022a2] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 30ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesDateEditIT#confirmedKeep` - exit 0

```
2026-11-23T14:07:27.309-03:00  INFO 2446707 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-23T14:07:27.310-03:00  INFO 2446707 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-23T14:07:27.389-03:00  INFO 2446707 --- [           main] [] c.l.f.transaction.SeriesDateEditIT       : Started SeriesDateEditIT in 9.354 seconds (process running for 10.599)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-23T14:07:27.959-03:00  WARN 2446707 --- [           main] [3a229561-93c7-410b-a171-56bdfb7740c4] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-23T14:07:27.963-03:00  WARN 2446707 --- [           main] [3a229561-93c7-410b-a171-56bdfb7740c4] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-23T14:07:27.963-03:00  WARN 2446707 --- [           main] [3a229561-93c7-410b-a171-56bdfb7740c4] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-23T14:07:28.121-03:00  INFO 2446707 --- [           main] [3a229561-93c7-410b-a171-56bdfb7740c4] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 290ms userId=1 planId=1
2026-11-23T14:07:28.170-03:00  INFO 2446707 --- [           main] [85d504aa-a26f-4241-aa16-f1479867acbd] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/{id}/confirm 200 36ms userId=1 planId=1
2026-11-23T14:07:28.238-03:00  INFO 2446707 --- [           main] [601b9cbb-a400-4ad9-b87a-ccc06c696973] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 64ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesDateEditIT#movedAloneMov` - exit 0

```
2026-11-23T14:07:55.919-03:00  INFO 2447241 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-23T14:07:55.921-03:00  INFO 2447241 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 2 ms
2026-11-23T14:07:55.979-03:00  INFO 2447241 --- [           main] [] c.l.f.transaction.SeriesDateEditIT       : Started SeriesDateEditIT in 9.409 seconds (process running for 10.697)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-23T14:07:56.556-03:00  WARN 2447241 --- [           main] [32bdf74e-85c2-45b9-a203-19e9127c51eb] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-23T14:07:56.559-03:00  WARN 2447241 --- [           main] [32bdf74e-85c2-45b9-a203-19e9127c51eb] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-23T14:07:56.560-03:00  WARN 2447241 --- [           main] [32bdf74e-85c2-45b9-a203-19e9127c51eb] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-23T14:07:56.729-03:00  INFO 2447241 --- [           main] [32bdf74e-85c2-45b9-a203-19e9127c51eb] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 295ms userId=1 planId=1
2026-11-23T14:07:56.818-03:00  INFO 2447241 --- [           main] [692fd66e-7a1c-441a-87ec-47dddfb92996] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 74ms userId=1 planId=1
2026-11-23T14:07:56.877-03:00  INFO 2447241 --- [           main] [d6e56c1e-a238-480b-af21-9354ef72bbe5] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 55ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesDateEditIT#dayThirtyOneF` - exit 0

```
2026-11-23T14:08:24.829-03:00  INFO 2447774 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 2 ms
2026-11-23T14:08:24.886-03:00  INFO 2447774 --- [           main] [] c.l.f.transaction.SeriesDateEditIT       : Started SeriesDateEditIT in 9.343 seconds (process running for 10.639)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-23T14:08:25.474-03:00  WARN 2447774 --- [           main] [09da9592-d21d-483a-9766-92d14147dec2] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-23T14:08:25.477-03:00  WARN 2447774 --- [           main] [09da9592-d21d-483a-9766-92d14147dec2] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-23T14:08:25.477-03:00  WARN 2447774 --- [           main] [09da9592-d21d-483a-9766-92d14147dec2] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-23T14:08:25.654-03:00  INFO 2447774 --- [           main] [09da9592-d21d-483a-9766-92d14147dec2] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 291ms userId=1 planId=1
2026-11-23T14:08:25.749-03:00  INFO 2447774 --- [           main] [404e9b87-1489-4dcd-b3df-22943256b068] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 81ms userId=1 planId=1
2026-11-23T14:08:25.823-03:00  INFO 2447774 --- [           main] [8580bbe8-58f8-47bb-982b-fcecccc218cb] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 26ms userId=1 planId=1
2026-11-23T14:08:25.861-03:00  INFO 2447774 --- [           main] [42bc37dc-e286-47d6-929f-f8f97211193a] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 36ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesDateEditIT#deletedMonthS` - exit 0

```
2026-11-23T14:08:53.574-03:00  INFO 2448334 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-23T14:08:53.633-03:00  INFO 2448334 --- [           main] [] c.l.f.transaction.SeriesDateEditIT       : Started SeriesDateEditIT in 9.243 seconds (process running for 10.539)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-23T14:08:54.225-03:00  WARN 2448334 --- [           main] [4cc3ad19-0221-4582-a60c-8dc2f5e8ed26] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-23T14:08:54.230-03:00  WARN 2448334 --- [           main] [4cc3ad19-0221-4582-a60c-8dc2f5e8ed26] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-23T14:08:54.231-03:00  WARN 2448334 --- [           main] [4cc3ad19-0221-4582-a60c-8dc2f5e8ed26] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-23T14:08:54.407-03:00  INFO 2448334 --- [           main] [4cc3ad19-0221-4582-a60c-8dc2f5e8ed26] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 294ms userId=1 planId=1
2026-11-23T14:08:54.493-03:00  INFO 2448334 --- [           main] [2f297651-7aea-4ede-b378-1391d5521e9a] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 75ms userId=1 planId=1
2026-11-23T14:08:54.550-03:00  INFO 2448334 --- [           main] [ec5c6dfb-7105-4bc6-b0de-f85f03102403] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 51ms userId=1 planId=1
2026-11-23T14:08:54.643-03:00  INFO 2448334 --- [           main] [b51ef8ab-a089-4b1a-8664-7f8d4d42dce7] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 33ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesDateEditIT#topUpUsesChan` - exit 0

```
2026-11-23T14:09:22.062-03:00  INFO 2448856 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-23T14:09:22.063-03:00  INFO 2448856 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-23T14:09:22.064-03:00  INFO 2448856 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-23T14:09:22.122-03:00  INFO 2448856 --- [           main] [] c.l.f.transaction.SeriesDateEditIT       : Started SeriesDateEditIT in 9.277 seconds (process running for 10.615)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-23T14:09:22.685-03:00  WARN 2448856 --- [           main] [00bdff6c-84bc-4578-a80c-a881113c9a19] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-23T14:09:22.688-03:00  WARN 2448856 --- [           main] [00bdff6c-84bc-4578-a80c-a881113c9a19] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-23T14:09:22.688-03:00  WARN 2448856 --- [           main] [00bdff6c-84bc-4578-a80c-a881113c9a19] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-23T14:09:22.887-03:00  INFO 2448856 --- [           main] [00bdff6c-84bc-4578-a80c-a881113c9a19] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 311ms userId=1 planId=1
2026-11-23T14:09:23.060-03:00  INFO 2448856 --- [           main] [9bc7cbcb-58ac-4a6a-b22a-0188186621a6] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 157ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesDateEditIT#restoreBefore` - exit 0

```
2026-11-23T14:09:50.296-03:00  INFO 2449399 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 2 ms
2026-11-23T14:09:50.352-03:00  INFO 2449399 --- [           main] [] c.l.f.transaction.SeriesDateEditIT       : Started SeriesDateEditIT in 9.317 seconds (process running for 10.661)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-23T14:09:50.926-03:00  WARN 2449399 --- [           main] [7b9f62a6-bbc1-442f-b73e-956334a26e1f] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-23T14:09:50.929-03:00  WARN 2449399 --- [           main] [7b9f62a6-bbc1-442f-b73e-956334a26e1f] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-23T14:09:50.929-03:00  WARN 2449399 --- [           main] [7b9f62a6-bbc1-442f-b73e-956334a26e1f] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-23T14:09:51.087-03:00  INFO 2449399 --- [           main] [7b9f62a6-bbc1-442f-b73e-956334a26e1f] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 271ms userId=1 planId=1
2026-11-23T14:09:51.176-03:00  INFO 2449399 --- [           main] [33f14879-9b92-4749-96f4-9fb887122fbb] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 71ms userId=1 planId=1
2026-11-23T14:09:51.230-03:00  INFO 2449399 --- [           main] [656522ba-c804-4778-9a33-f90a8f5fd73f] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 49ms userId=1 planId=1
2026-11-23T14:09:51.265-03:00  INFO 2449399 --- [           main] [08f17a96-7e6c-43e6-aabf-7724b9cc4689] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 409 33ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesDateEditIT#firstOccurren` - exit 0

```
2026-11-23T14:10:18.440-03:00  INFO 2449929 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-23T14:10:18.441-03:00  INFO 2449929 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-23T14:10:18.442-03:00  INFO 2449929 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-23T14:10:18.502-03:00  INFO 2449929 --- [           main] [] c.l.f.transaction.SeriesDateEditIT       : Started SeriesDateEditIT in 9.407 seconds (process running for 10.695)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
2026-11-23T14:10:19.074-03:00  WARN 2449929 --- [           main] [0c1e2213-7053-47e6-887b-86878bff2498] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-23T14:10:19.077-03:00  WARN 2449929 --- [           main] [0c1e2213-7053-47e6-887b-86878bff2498] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-23T14:10:19.078-03:00  WARN 2449929 --- [           main] [0c1e2213-7053-47e6-887b-86878bff2498] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-23T14:10:19.275-03:00  INFO 2449929 --- [           main] [0c1e2213-7053-47e6-887b-86878bff2498] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 308ms userId=1 planId=1
2026-11-23T14:10:19.386-03:00  INFO 2449929 --- [           main] [b50165f2-a50d-4f80-8d4a-3c32f511fe3d] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 94ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesDateEditIT#firstOccurren` - exit 0

```
2026-11-23T14:10:47.442-03:00  INFO 2450451 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-23T14:10:47.442-03:00  INFO 2450451 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-23T14:10:47.444-03:00  INFO 2450451 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 2 ms
2026-11-23T14:10:47.510-03:00  INFO 2450451 --- [           main] [] c.l.f.transaction.SeriesDateEditIT       : Started SeriesDateEditIT in 9.362 seconds (process running for 10.594)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-23T14:10:48.115-03:00  WARN 2450451 --- [           main] [3d1c65fa-93a4-40d8-aa74-bdbd6c9463d4] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-23T14:10:48.118-03:00  WARN 2450451 --- [           main] [3d1c65fa-93a4-40d8-aa74-bdbd6c9463d4] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-23T14:10:48.119-03:00  WARN 2450451 --- [           main] [3d1c65fa-93a4-40d8-aa74-bdbd6c9463d4] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-23T14:10:48.297-03:00  INFO 2450451 --- [           main] [3d1c65fa-93a4-40d8-aa74-bdbd6c9463d4] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 297ms userId=1 planId=1
2026-11-23T14:10:48.437-03:00  INFO 2450451 --- [           main] [552ef6a4-172c-4802-94f8-97a920db7442] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 123ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesDateEditIT#monthShiftMov` - exit 0

```
2026-11-23T14:11:15.533-03:00  INFO 2450995 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-23T14:11:15.535-03:00  INFO 2450995 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 2 ms
2026-11-23T14:11:15.591-03:00  INFO 2450995 --- [           main] [] c.l.f.transaction.SeriesDateEditIT       : Started SeriesDateEditIT in 9.337 seconds (process running for 10.63)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-23T14:11:16.152-03:00  WARN 2450995 --- [           main] [a5ea8cd2-664e-4e0d-a974-0cb54091188b] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-23T14:11:16.155-03:00  WARN 2450995 --- [           main] [a5ea8cd2-664e-4e0d-a974-0cb54091188b] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-23T14:11:16.156-03:00  WARN 2450995 --- [           main] [a5ea8cd2-664e-4e0d-a974-0cb54091188b] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-23T14:11:16.317-03:00  INFO 2450995 --- [           main] [a5ea8cd2-664e-4e0d-a974-0cb54091188b] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 285ms userId=1 planId=1
2026-11-23T14:11:16.409-03:00  INFO 2450995 --- [           main] [5ad6925a-219a-4347-b444-ba026feef1dc] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 80ms userId=1 planId=1
2026-11-23T14:11:16.466-03:00  INFO 2450995 --- [           main] [3d6d94dc-32c3-4261-a967-f567efa1965a] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 51ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesDateEditIT#invalidDateCh` - exit 0

```
2026-11-23T14:11:44.099-03:00  INFO 2451508 --- [           main] [] c.l.f.transaction.SeriesDateEditIT       : Started SeriesDateEditIT in 9.347 seconds (process running for 10.543)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-23T14:11:44.679-03:00  WARN 2451508 --- [           main] [193161aa-44fb-4aef-b2d8-5477a24b9dcf] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-23T14:11:44.683-03:00  WARN 2451508 --- [           main] [193161aa-44fb-4aef-b2d8-5477a24b9dcf] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-23T14:11:44.683-03:00  WARN 2451508 --- [           main] [193161aa-44fb-4aef-b2d8-5477a24b9dcf] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-23T14:11:44.859-03:00  INFO 2451508 --- [           main] [193161aa-44fb-4aef-b2d8-5477a24b9dcf] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 293ms userId=1 planId=1
2026-11-23T14:11:44.959-03:00  INFO 2451508 --- [           main] [0605cc02-cff4-4362-8509-40cfe20709ca] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 422 80ms userId=1 planId=1
2026-11-23T14:11:45.017-03:00  INFO 2451508 --- [           main] [8f24aa1e-3483-4aea-8c7c-ba10d65370d0] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 422 24ms userId=1 planId=1
2026-11-23T14:11:45.127-03:00  INFO 2451508 --- [           main] [8d4eda70-d79e-4e3d-9978-eefa23c91275] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 41ms userId=1 planId=1
2026-11-23T14:11:45.176-03:00  INFO 2451508 --- [           main] [6d346e40-0db1-45e0-9012-7c3a5a89ac8c] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 42ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesDateEditIT#monthCollisio` - exit 0

```
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
2026-11-23T14:12:12.742-03:00  WARN 2452021 --- [           main] [51eda3db-7e44-4dc8-ac3b-2a756f1d164e] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-23T14:12:12.745-03:00  WARN 2452021 --- [           main] [51eda3db-7e44-4dc8-ac3b-2a756f1d164e] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-23T14:12:12.746-03:00  WARN 2452021 --- [           main] [51eda3db-7e44-4dc8-ac3b-2a756f1d164e] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-23T14:12:12.905-03:00  INFO 2452021 --- [           main] [51eda3db-7e44-4dc8-ac3b-2a756f1d164e] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 293ms userId=1 planId=1
2026-11-23T14:12:12.963-03:00  INFO 2452021 --- [           main] [e4027ce0-41ff-4714-8352-4f265f7e9089] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/{id}/confirm 200 42ms userId=1 planId=1
2026-11-23T14:12:13.035-03:00  INFO 2452021 --- [           main] [d4bec3d9-2ea1-4283-b53e-a9ed792080e2] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 422 63ms userId=1 planId=1
2026-11-23T14:12:13.167-03:00  INFO 2452021 --- [           main] [88a82f7b-5ff7-4d1c-954f-4fcc55371f66] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 27ms userId=1 planId=1
2026-11-23T14:12:13.182-03:00  INFO 2452021 --- [           main] [b7d8facb-307a-4fc6-964f-5c05573fbc2f] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/{id}/confirm 200 12ms userId=1 planId=1
2026-11-23T14:12:13.203-03:00  INFO 2452021 --- [           main] [2546c456-9b6d-4342-8919-43dde2843fb7] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 422 16ms userId=1 planId=1
2026-11-23T14:12:13.245-03:00  INFO 2452021 --- [           main] [284862ac-8724-4cd6-996c-d7a86efc3d70] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 36ms userId=1 planId=1
2026-11-23T14:12:13.265-03:00  INFO 2452021 --- [           main] [6d38366a-f5c2-4d6d-8f07-8b6c5da1d9ba] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/{id}/confirm 200 17ms userId=1 planId=1
2026-11-23T14:12:13.287-03:00  INFO 2452021 --- [           main] [bdd2cd73-3e62-46f4-b1b4-e8709964f3cb] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 422 17ms userId=1 planId=1
2026-11-23T14:12:13.309-03:00  INFO 2452021 --- [           main] [b53f78ea-3b7e-4a50-80c6-e3fbc9c90ab0] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 19ms userId=1 planId=1
2026-11-23T14:12:13.340-03:00  INFO 2452021 --- [           main] [5cf95094-4349-4ac3-ab72-a7f064160431] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 28ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesDateEditIT#typedEndWinsO` - exit 0

```
2026-11-23T14:12:41.069-03:00  INFO 2452545 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-23T14:12:41.069-03:00  INFO 2452545 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-23T14:12:41.071-03:00  INFO 2452545 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 2 ms
2026-11-23T14:12:41.128-03:00  INFO 2452545 --- [           main] [] c.l.f.transaction.SeriesDateEditIT       : Started SeriesDateEditIT in 9.417 seconds (process running for 10.692)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-23T14:12:41.707-03:00  WARN 2452545 --- [           main] [b0ce1ce0-94b9-4895-a889-b733037c713d] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-23T14:12:41.710-03:00  WARN 2452545 --- [           main] [b0ce1ce0-94b9-4895-a889-b733037c713d] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-23T14:12:41.710-03:00  WARN 2452545 --- [           main] [b0ce1ce0-94b9-4895-a889-b733037c713d] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-23T14:12:41.886-03:00  INFO 2452545 --- [           main] [b0ce1ce0-94b9-4895-a889-b733037c713d] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 291ms userId=1 planId=1
2026-11-23T14:12:41.998-03:00  INFO 2452545 --- [           main] [ee0d2c23-68f4-43ad-827d-17a75b6e2807] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 95ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='MigrationsIT#recurrenceDayOfMo` - exit 0

```
2026-11-23T14:13:09.258-03:00  INFO 2453065 --- [           main] [] o.f.core.internal.command.DbMigrate      : Migrating schema "public" to version "21 - cascade plan deletion"
2026-11-23T14:13:09.277-03:00  INFO 2453065 --- [           main] [] o.f.core.internal.command.DbMigrate      : Migrating schema "public" to version "22 - add user language"
2026-11-23T14:13:09.287-03:00  INFO 2453065 --- [           main] [] o.f.core.internal.command.DbMigrate      : Migrating schema "public" to version "23 - add transaction confirmation"
2026-11-23T14:13:09.298-03:00  INFO 2453065 --- [           main] [] o.f.core.internal.command.DbMigrate      : Migrating schema "public" to version "24 - add transaction scheduled date"
2026-11-23T14:13:09.308-03:00  INFO 2453065 --- [           main] [] o.f.core.internal.command.DbMigrate      : Migrating schema "public" to version "25 - add oauth authorization"
2026-11-23T14:13:09.320-03:00  INFO 2453065 --- [           main] [] o.f.core.internal.command.DbMigrate      : Migrating schema "public" to version "26 - add oauth rotated refresh tokens"
2026-11-23T14:13:09.328-03:00  INFO 2453065 --- [           main] [] o.f.core.internal.command.DbMigrate      : Migrating schema "public" to version "27 - add transaction trash"
2026-11-23T14:13:09.348-03:00  INFO 2453065 --- [           main] [] o.f.core.internal.command.DbMigrate      : Migrating schema "public" to version "28 - add recurrence rule revision"
2026-11-23T14:13:09.358-03:00  INFO 2453065 --- [           main] [] o.f.core.internal.command.DbMigrate      : Migrating schema "public" to version "29 - add transaction kind"
2026-11-23T14:13:09.367-03:00  INFO 2453065 --- [           main] [] o.f.core.internal.command.DbMigrate      : Successfully applied 29 migrations to schema "public", now at version v29 (execution time 00:00.268s)
2026-11-23T14:13:09.409-03:00  INFO 2453065 --- [           main] [] org.flywaydb.core.FlywayExecutor         : Database: jdbc:postgresql://localhost:46269/findraco_test_v13_scratch?loggerLevel=OFF (PostgreSQL 16.14)
2026-11-23T14:13:09.429-03:00  INFO 2453065 --- [           main] [] o.f.core.internal.command.DbValidate     : Successfully validated 30 migrations (execution time 00:00.010s)
2026-11-23T14:13:09.447-03:00  INFO 2453065 --- [           main] [] o.f.core.internal.command.DbMigrate      : Current version of schema "public": 29
2026-11-23T14:13:09.450-03:00  INFO 2453065 --- [           main] [] o.f.core.internal.command.DbMigrate      : Migrating schema "public" to version "30 - add recurrence day of month"
2026-11-23T14:13:09.463-03:00  INFO 2453065 --- [           main] [] o.f.core.internal.command.DbMigrate      : Successfully applied 1 migration to schema "public", now at version v30 (execution time 00:00.008s)
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='OpenApiSnapshotIT' -Dsurefire.` - exit 0

```
2026-11-23T14:13:36.541-03:00  INFO 2453576 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable resources templates capabilities, notification: true
2026-11-23T14:13:36.542-03:00  INFO 2453576 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable prompts capabilities, notification: true
2026-11-23T14:13:36.543-03:00  INFO 2453576 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable completions capabilities
2026-11-23T14:13:36.688-03:00  INFO 2453576 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-23T14:13:36.688-03:00  INFO 2453576 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-23T14:13:36.690-03:00  INFO 2453576 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 2 ms
2026-11-23T14:13:36.747-03:00  INFO 2453576 --- [           main] [] c.lcs.findraco.shared.OpenApiSnapshotIT  : Started OpenApiSnapshotIT in 9.27 seconds (process running for 10.657)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-23T14:13:37.702-03:00  INFO 2453576 --- [           main] [6796ab94-64d9-47ad-84e0-e27157080c5b] o.springdoc.api.AbstractOpenApiResource  : Init duration for springdoc-openapi is: 607 ms
2026-11-23T14:13:37.744-03:00  INFO 2453576 --- [           main] [6796ab94-64d9-47ad-84e0-e27157080c5b] c.l.f.shared.web.RequestLogFilter        : GET /v3/api-docs 200 678ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesEditIT,SeriesConfirmatio` - exit 0

```
2026-11-23T14:14:15.256-03:00  INFO 2454141 --- [           main] [06dd09af-0f8e-40ae-a871-8868c16ce492] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/{id} 200 5ms userId=1 planId=1
2026-11-23T14:14:15.305-03:00  INFO 2454141 --- [           main] [e721d3cb-13ae-42ee-9eeb-d5a12061b3ef] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 10ms userId=1 planId=1
2026-11-23T14:14:15.314-03:00  INFO 2454141 --- [           main] [395439d4-175d-4854-b8b5-5a93ef2056ed] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 8ms userId=2 planId=1
2026-11-23T14:14:15.322-03:00  INFO 2454141 --- [           main] [2912932c-0bb5-4b57-9527-12af2b9075f8] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/{id} 200 6ms userId=1 planId=1
2026-11-23T14:14:15.330-03:00  INFO 2454141 --- [           main] [bf8c96e3-9f0b-4163-b53c-5e6accd8eea4] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/{id} 200 7ms userId=2 planId=1
2026-11-23T14:14:15.341-03:00  INFO 2454141 --- [           main] [d6b24795-c484-47b0-af05-d3b2d1389b39] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/trash 200 10ms userId=2 planId=1
2026-11-23T14:14:15.351-03:00  INFO 2454141 --- [           main] [fc708c52-2dd2-4786-bf0e-b079c7b6722a] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/trash 200 9ms userId=1 planId=1
2026-11-23T14:14:15.363-03:00  INFO 2454141 --- [           main] [177f7755-d73a-4490-a6e5-ddac79898588] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 200 10ms userId=2 planId=1
2026-11-23T14:14:15.387-03:00  INFO 2454141 --- [           main] [445e321e-0fed-417e-a2d7-c87c65d34552] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction 200 23ms userId=2 planId=1
2026-11-23T14:14:15.431-03:00  INFO 2454141 --- [           main] [d4ee3a1c-c358-4b76-9c4e-91eeb0355726] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 11ms userId=1 planId=1
2026-11-23T14:14:15.441-03:00  INFO 2454141 --- [           main] [19da3366-133b-4b61-bb6b-274a1cf54314] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 8ms userId=1 planId=1
2026-11-23T14:14:15.463-03:00  INFO 2454141 --- [           main] [69d54a0e-16e6-4281-95a2-b50cb7737abb] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/dashboard 200 20ms userId=1 planId=1
2026-11-23T14:14:15.472-03:00  INFO 2454141 --- [           main] [696bc36b-1760-4946-9074-fbb53c0f4ab4] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/{id} 200 8ms userId=1 planId=1
2026-11-23T14:14:15.498-03:00  INFO 2454141 --- [           main] [903ff055-7d66-46ae-8257-a4796b587cd6] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction 200 21ms userId=1 planId=1
2026-11-23T14:14:15.519-03:00  INFO 2454141 --- [           main] [addc5656-989d-4476-a07f-b53f4aa5ce4e] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/dashboard 200 20ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesDateEditIT#dateChangeNee` - exit 0

```
2026-11-23T14:14:42.973-03:00  INFO 2454670 --- [           main] [] c.l.f.transaction.SeriesDateEditIT       : Started SeriesDateEditIT in 9.279 seconds (process running for 10.476)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-23T14:14:43.560-03:00  WARN 2454670 --- [           main] [04d8416f-f273-4b5b-a875-2a71815c6c66] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-23T14:14:43.563-03:00  WARN 2454670 --- [           main] [04d8416f-f273-4b5b-a875-2a71815c6c66] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-23T14:14:43.564-03:00  WARN 2454670 --- [           main] [04d8416f-f273-4b5b-a875-2a71815c6c66] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-23T14:14:43.725-03:00  INFO 2454670 --- [           main] [04d8416f-f273-4b5b-a875-2a71815c6c66] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 279ms userId=1 planId=1
2026-11-23T14:14:43.810-03:00  INFO 2454670 --- [           main] [d8fa71ee-96ec-4be2-bbca-6a70ec47b3c6] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 403 67ms userId=2 planId=1
2026-11-23T14:14:43.861-03:00  INFO 2454670 --- [           main] [a7eb4a61-7d80-45ef-aee3-5d667fadcde7] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 403 19ms userId=2 planId=1
2026-11-23T14:14:43.869-03:00  INFO 2454670 --- [           main] [73e29bc3-3208-43d2-a75e-c93d2996dd3c] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 403 6ms userId=3 planId=1
2026-11-23T14:14:43.877-03:00  INFO 2454670 --- [           main] [1acabefc-a78c-4849-9aa1-649156389a7f] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 404 5ms userId=4 planId=1
```
