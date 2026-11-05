# actual-vs-forecast proofs

**HEAD**: 076e69a
**Tree**: clean
**Shell**: /bin/sh
**Result**: 53 pass, 0 fail

| Check | Proof | Result |
| --- | --- | --- |
| C1 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q test -Dtest='TransactionConfirmationTest#byDateO` | pass |
| C2 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q test -Dtest='TransactionConfirmationTest#confirm` | pass |
| C3 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q test -Dtest='TransactionConfirmationTest#byDateA` | pass |
| C4 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q test -Dtest='TransactionConfirmationTest#byDateT` | pass |
| C5 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q test -Dtest='UserTodayTest#todayFollowsTheUsersZ` | pass |
| C6 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionStatusIT#listReport` | pass |
| C7 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesConfirmationIT#newSeries` | pass |
| C8 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesConfirmationIT#flagChang` | pass |
| C9 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q test -Dtest='TransactionConfirmationTest#require` | pass |
| C10 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q test -Dtest='TransactionConfirmationTest#require` | pass |
| C11 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q test -Dtest='TransactionConfirmationTest#confirm` | pass |
| C12 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q test -Dtest='TransactionConfirmationTest#unconfi` | pass |
| C13 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q test -Dtest='TransactionConfirmationTest#turning` | pass |
| C14 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesConfirmationIT#pivotStat` | pass |
| C15 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesConfirmationIT#allEditKe` | pass |
| C16 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesConfirmationIT#following` | pass |
| C17 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionConfirmIT#confirmSt` | pass |
| C18 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionConfirmIT#confirmIs` | pass |
| C19 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionConfirmIT#staleConf` | pass |
| C20 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionConfirmIT#rejectsAZ` | pass |
| C21 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='MigrationsIT#v23LeavesExisting` | pass |
| C22 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='MigrationsIT#v23KeepsExistingV` | pass |
| C23 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionStatusIT#oneOffIsBy` | pass |
| C24 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionStatusIT#statusUses` | pass |
| C25 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesConfirmationIT#topUpStam` | pass |
| C26 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionConfirmIT#confirmin` | pass |
| C27 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='DashboardActualIT#summarySplit` | pass |
| C28 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='DashboardActualIT#pendingCount` | pass |
| C29 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='DashboardActualIT#noForecastMe` | pass |
| C30 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='DashboardActualIT#trendAndPeop` | pass |
| C31 | `run unit / ✓ confirmTransaction > posts amount, date and version` | pass |
| C32 | `run stories / ✓ TransactionCells.stories.tsx > Status Badges` | pass |
| C33 | `run stories / ✓ TransactionMobileList.stories.tsx > Forecast And Pending` | pass |
| C34 | `run unit / ✓ TransactionsPage > confirm on a pending row opens the dialog prefilled` | pass |
| C35 | `run unit / ✓ ConfirmTransactionDialog > confirms with the edited amount` | pass |
| C36 | `run unit / ✓ useTransactionActions > hides confirm without permission or when actual` | pass |
| C37 | `run unit / ✓ confirmTransactionForm > rejects an empty or zero amount` | pass |
| C38 | `run unit / ✓ TransactionFormDrawer > series starts requiring confirmation` | pass |
| C39 | `run unit / ✓ TransactionFormDrawer > status keeps its value when another field changes` | pass |
| C40 | `run unit / ✓ TransactionFormDrawer > status forecast unconfirms` | pass |
| C41 | `run unit / ✓ TransactionFormDrawer > one-off shows no confirmation controls` | pass |
| C42 | `run stories / ✓ SummaryCards.stories.tsx > With Forecast` | pass |
| C43 | `walk - Storybook at 390×844 with locale pt-BR: summary cards, transaction cells, mobile list, confirm dialog, ` | pass (Walked) |
| C44 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesConfirmationIT#following` | pass |
| C45 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesConfirmationIT#undoneMov` | pass |
| C46 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesConfirmationIT#confirmOn` | pass |
| C47 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesConfirmationIT#pivotStat` | pass |
| C48 | `run unit / ✓ TransactionsPage > mobile confirm opens the dialog` | pass |
| C49 | `run unit / ✓ summaryView > member selected keeps actual figures` | pass |
| Build | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -DskipITs -Dsurefire.skip=true` | pass |
| Build | `cd frontend && pnpm lint` | pass |
| Build | `cd frontend && pnpm build` | pass |
| Build | `cd frontend && node scripts/check-siblings.ts` | pass |

## Output

`Run unit` - exit 0

```
       please check the style of container, or the props width(100%) and height(100%),
       or add a minWidth(0) or minHeight(undefined) or use aspect(undefined) to control the
       height and width.

stderr | src/features/overview/OverviewPage.test.tsx > OverviewPage member filter > drops a member who is no longer in the plan from the URL
The width(0) and height(0) of chart should be greater than 0,
       please check the style of container, or the props width(100%) and height(100%),
       or add a minWidth(0) or minHeight(undefined) or use aspect(undefined) to control the
       height and width.

stderr | src/features/overview/OverviewPage.test.tsx > OverviewPage category usage > asks the server for the chosen period and shows the status it answers
The width(0) and height(0) of chart should be greater than 0,
       please check the style of container, or the props width(100%) and height(100%),
       or add a minWidth(0) or minHeight(undefined) or use aspect(undefined) to control the
       height and width.
```

`Run stories` - exit 0

```
A component suspended inside an `act` scope, but the `act` call was not awaited. When testing React components that depend on asynchronous data, you must await the result:

await act(() => ...)
stderr | src/features/transactions/components/TransactionCells.stories.tsx > Edit Participants
You are using Testing Library's `screen` object. Use `within(canvasElement)` instead.
More info: https://storybook.js.org/docs/writing-tests/interaction-testing?ref=error
stderr | src/features/transactions/components/SeriesScopeDialogProvider.stories.tsx > Choose Scope
You are using Testing Library's `screen` object. Use `within(canvasElement)` instead.
More info: https://storybook.js.org/docs/writing-tests/interaction-testing?ref=error
stderr | src/features/transactions/components/ConfirmTransactionDialogView.stories.tsx > Filled
You are using Testing Library's `screen` object. Use `within(canvasElement)` instead.
More info: https://storybook.js.org/docs/writing-tests/interaction-testing?ref=error
stderr | src/features/transactions/components/SeriesScopeDialog.stories.tsx > Edit
You are using Testing Library's `screen` object. Use `within(canvasElement)` instead.
More info: https://storybook.js.org/docs/writing-tests/interaction-testing?ref=error
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q test -Dtest='TransactionConfirmationTest#byDateO` - exit 0

```
(no output)
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q test -Dtest='TransactionConfirmationTest#confirm` - exit 0

```
(no output)
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q test -Dtest='TransactionConfirmationTest#byDateA` - exit 0

```
(no output)
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q test -Dtest='TransactionConfirmationTest#byDateT` - exit 0

```
(no output)
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q test -Dtest='UserTodayTest#todayFollowsTheUsersZ` - exit 0

```
(no output)
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionStatusIT#listReport` - exit 0

```
2026-11-05T16:48:18.743-03:00  INFO 678806 --- [           main] [] j.LocalContainerEntityManagerFactoryBean : Initialized JPA EntityManagerFactory for persistence unit 'default'
2026-11-05T16:48:18.832-03:00  INFO 678806 --- [           main] [] o.s.d.j.r.query.QueryEnhancerFactories   : Hibernate is in classpath; If applicable, HQL parser will be used.
2026-11-05T16:48:19.579-03:00  INFO 678806 --- [           main] [] eAuthenticationProviderManagerConfigurer : Global AuthenticationManager configured with AuthenticationProvider bean with name authenticationProvider
2026-11-05T16:48:19.579-03:00  WARN 678806 --- [           main] [] r$InitializeUserDetailsManagerConfigurer : Global AuthenticationManager configured with an AuthenticationProvider bean. UserDetailsService beans will not be used by Spring Security for automatically configuring username/password login. Consider removing the AuthenticationProvider bean. Alternatively, consider using the UserDetailsService in a manually instantiated DaoAuthenticationProvider. If the current configuration is intentional, to turn off this warning, increase the logging level of 'org.springframework.security.config.annotation.authentication.configuration.InitializeUserDetailsBeanManagerConfigurer' to ERROR
2026-11-05T16:48:20.880-03:00  INFO 678806 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-05T16:48:20.880-03:00  INFO 678806 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-05T16:48:20.881-03:00  INFO 678806 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-05T16:48:20.936-03:00  INFO 678806 --- [           main] [] c.l.f.transaction.TransactionStatusIT    : Started TransactionStatusIT in 8.426 seconds (process running for 9.579)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-05T16:48:21.738-03:00  INFO 678806 --- [           main] [866d0f75-51f3-4d8e-9756-f7a367decdf6] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction 200 326ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesConfirmationIT#newSeries` - exit 0

```
2026-11-05T16:48:42.789-03:00  INFO 679419 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-05T16:48:42.789-03:00  INFO 679419 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-05T16:48:42.791-03:00  INFO 679419 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-05T16:48:42.841-03:00  INFO 679419 --- [           main] [] c.l.f.transaction.SeriesConfirmationIT   : Started SeriesConfirmationIT in 8.264 seconds (process running for 9.528)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-05T16:48:43.447-03:00  WARN 679419 --- [           main] [369588d6-ab80-4e49-b758-e7f0ee7bd77d] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-05T16:48:43.451-03:00  WARN 679419 --- [           main] [369588d6-ab80-4e49-b758-e7f0ee7bd77d] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-05T16:48:43.451-03:00  WARN 679419 --- [           main] [369588d6-ab80-4e49-b758-e7f0ee7bd77d] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-05T16:48:43.623-03:00  INFO 679419 --- [           main] [369588d6-ab80-4e49-b758-e7f0ee7bd77d] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 299ms userId=1 planId=1
2026-11-05T16:48:43.701-03:00  INFO 679419 --- [           main] [f5f95f7b-3d8f-4be2-86af-c0a622499e0b] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 27ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesConfirmationIT#flagChang` - exit 0

```
2026-11-05T16:49:04.604-03:00  INFO 680024 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-05T16:49:04.656-03:00  INFO 680024 --- [           main] [] c.l.f.transaction.SeriesConfirmationIT   : Started SeriesConfirmationIT in 8.298 seconds (process running for 9.56)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
2026-11-05T16:49:05.221-03:00  WARN 680024 --- [           main] [0cc99fb2-b654-4424-8239-559cd85e4158] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-05T16:49:05.224-03:00  WARN 680024 --- [           main] [0cc99fb2-b654-4424-8239-559cd85e4158] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-05T16:49:05.225-03:00  WARN 680024 --- [           main] [0cc99fb2-b654-4424-8239-559cd85e4158] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-05T16:49:05.409-03:00  INFO 680024 --- [           main] [0cc99fb2-b654-4424-8239-559cd85e4158] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 302ms userId=1 planId=1
2026-11-05T16:49:05.507-03:00  INFO 680024 --- [           main] [e6f595a5-9dba-4444-ae0b-7a6e09ef8afa] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 80ms userId=1 planId=1
2026-11-05T16:49:05.556-03:00  INFO 680024 --- [           main] [b8ba2122-ee49-4229-9edd-717291f7a552] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 46ms userId=1 planId=1
2026-11-05T16:49:05.642-03:00  INFO 680024 --- [           main] [9f902244-8c58-474a-aee4-f557f641384b] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 33ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q test -Dtest='TransactionConfirmationTest#require` - exit 0

```
(no output)
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q test -Dtest='TransactionConfirmationTest#require` - exit 0

```
(no output)
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q test -Dtest='TransactionConfirmationTest#confirm` - exit 0

```
(no output)
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q test -Dtest='TransactionConfirmationTest#unconfi` - exit 0

```
(no output)
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q test -Dtest='TransactionConfirmationTest#turning` - exit 0

```
(no output)
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesConfirmationIT#pivotStat` - exit 0

```
2026-11-05T16:49:47.617-03:00  INFO 682110 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-05T16:49:47.619-03:00  INFO 682110 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 2 ms
2026-11-05T16:49:47.680-03:00  INFO 682110 --- [           main] [] c.l.f.transaction.SeriesConfirmationIT   : Started SeriesConfirmationIT in 8.214 seconds (process running for 9.385)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-05T16:49:48.242-03:00  WARN 682110 --- [           main] [e3cd7e52-17de-4e98-aa88-e7b2a86ab72a] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-05T16:49:48.245-03:00  WARN 682110 --- [           main] [e3cd7e52-17de-4e98-aa88-e7b2a86ab72a] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-05T16:49:48.245-03:00  WARN 682110 --- [           main] [e3cd7e52-17de-4e98-aa88-e7b2a86ab72a] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-05T16:49:48.420-03:00  INFO 682110 --- [           main] [e3cd7e52-17de-4e98-aa88-e7b2a86ab72a] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 297ms userId=1 planId=1
2026-11-05T16:49:48.512-03:00  INFO 682110 --- [           main] [bf69960a-2491-44de-bfd0-b6d7afb75f63] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 75ms userId=1 planId=1
2026-11-05T16:49:48.547-03:00  INFO 682110 --- [           main] [776c8a60-30e4-4bc2-968c-a1d5a28da1bf] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 32ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesConfirmationIT#allEditKe` - exit 0

```
2026-11-05T16:50:09.028-03:00  INFO 682736 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-05T16:50:09.029-03:00  INFO 682736 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-05T16:50:09.082-03:00  INFO 682736 --- [           main] [] c.l.f.transaction.SeriesConfirmationIT   : Started SeriesConfirmationIT in 8.069 seconds (process running for 9.319)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-05T16:50:09.662-03:00  WARN 682736 --- [           main] [22a20880-ca31-484e-b370-9557d03f9283] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-05T16:50:09.665-03:00  WARN 682736 --- [           main] [22a20880-ca31-484e-b370-9557d03f9283] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-05T16:50:09.666-03:00  WARN 682736 --- [           main] [22a20880-ca31-484e-b370-9557d03f9283] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-05T16:50:09.859-03:00  INFO 682736 --- [           main] [22a20880-ca31-484e-b370-9557d03f9283] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 312ms userId=1 planId=1
2026-11-05T16:50:09.962-03:00  INFO 682736 --- [           main] [fd7f32a6-f1ed-4e0f-8c75-7d77f759bf25] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 84ms userId=1 planId=1
2026-11-05T16:50:10.009-03:00  INFO 682736 --- [           main] [e419c11d-e0e0-4f4a-854c-3f0c28f16f76] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 44ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesConfirmationIT#following` - exit 0

```
2026-11-05T16:50:30.901-03:00  INFO 683321 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-05T16:50:30.902-03:00  INFO 683321 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-05T16:50:30.965-03:00  INFO 683321 --- [           main] [] c.l.f.transaction.SeriesConfirmationIT   : Started SeriesConfirmationIT in 8.243 seconds (process running for 9.535)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-05T16:50:31.545-03:00  WARN 683321 --- [           main] [c3c3a310-28d9-46fa-97d0-cba10f161b63] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-05T16:50:31.548-03:00  WARN 683321 --- [           main] [c3c3a310-28d9-46fa-97d0-cba10f161b63] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-05T16:50:31.548-03:00  WARN 683321 --- [           main] [c3c3a310-28d9-46fa-97d0-cba10f161b63] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-05T16:50:31.725-03:00  INFO 683321 --- [           main] [c3c3a310-28d9-46fa-97d0-cba10f161b63] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 302ms userId=1 planId=1
2026-11-05T16:50:31.811-03:00  INFO 683321 --- [           main] [c4aa7012-aa53-4d65-b39c-b67bbde0525c] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 65ms userId=1 planId=1
2026-11-05T16:50:31.854-03:00  INFO 683321 --- [           main] [3075b88d-ca51-428a-8562-d46f0e34f712] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 39ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionConfirmIT#confirmSt` - exit 0

```
2026-11-05T16:50:52.617-03:00  INFO 683897 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-05T16:50:52.618-03:00  INFO 683897 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-05T16:50:52.674-03:00  INFO 683897 --- [           main] [] c.l.f.transaction.TransactionConfirmIT   : Started TransactionConfirmIT in 8.202 seconds (process running for 9.359)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-05T16:50:53.271-03:00  WARN 683897 --- [           main] [94a25a87-9b09-478f-9091-3dd4d6483cf5] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-05T16:50:53.274-03:00  WARN 683897 --- [           main] [94a25a87-9b09-478f-9091-3dd4d6483cf5] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-05T16:50:53.275-03:00  WARN 683897 --- [           main] [94a25a87-9b09-478f-9091-3dd4d6483cf5] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-05T16:50:53.448-03:00  INFO 683897 --- [           main] [94a25a87-9b09-478f-9091-3dd4d6483cf5] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 289ms userId=1 planId=1
2026-11-05T16:50:53.514-03:00  INFO 683897 --- [           main] [61761ec1-f03c-46ee-9b23-b3d44da75959] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/{id}/confirm 200 50ms userId=1 planId=1
2026-11-05T16:50:53.672-03:00  INFO 683897 --- [           main] [43790673-4c9b-4285-b93a-777a31edd861] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 79ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionConfirmIT#confirmIs` - exit 0

```
2026-11-05T16:51:14.567-03:00  INFO 684472 --- [           main] [] c.l.f.transaction.TransactionConfirmIT   : Started TransactionConfirmIT in 8.264 seconds (process running for 9.458)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-05T16:51:15.187-03:00  WARN 684472 --- [           main] [507bdca5-236d-4ef2-a6dc-a3114225c7bb] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-05T16:51:15.190-03:00  WARN 684472 --- [           main] [507bdca5-236d-4ef2-a6dc-a3114225c7bb] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-05T16:51:15.191-03:00  WARN 684472 --- [           main] [507bdca5-236d-4ef2-a6dc-a3114225c7bb] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-05T16:51:15.360-03:00  INFO 684472 --- [           main] [507bdca5-236d-4ef2-a6dc-a3114225c7bb] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 301ms userId=1 planId=1
2026-11-05T16:51:15.404-03:00  INFO 684472 --- [           main] [1aee4bcc-cb43-43c6-bc66-be03ceb48bb7] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/{id}/confirm 403 28ms userId=3 planId=1
2026-11-05T16:51:15.440-03:00  INFO 684472 --- [           main] [1e0abc81-667a-41cc-a5ec-6ffd55648d24] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/{id}/confirm 403 11ms userId=2 planId=1
2026-11-05T16:51:15.447-03:00  INFO 684472 --- [           main] [6d21dec2-63e0-4f98-8d45-2d6905f1349b] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/{id}/confirm 404 6ms userId=4 planId=1
2026-11-05T16:51:15.505-03:00  INFO 684472 --- [           main] [a5adb093-dba3-403a-9c3b-569734640bb1] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/{id}/confirm 404 11ms userId=4 planId=3
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionConfirmIT#staleConf` - exit 0

```
2026-11-05T16:51:36.297-03:00  INFO 685089 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-05T16:51:36.298-03:00  INFO 685089 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-05T16:51:36.299-03:00  INFO 685089 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-05T16:51:36.362-03:00  INFO 685089 --- [           main] [] c.l.f.transaction.TransactionConfirmIT   : Started TransactionConfirmIT in 8.265 seconds (process running for 9.484)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
2026-11-05T16:51:36.935-03:00  WARN 685089 --- [           main] [0969dd58-5802-4270-8a2b-cb06335798fd] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-05T16:51:36.938-03:00  WARN 685089 --- [           main] [0969dd58-5802-4270-8a2b-cb06335798fd] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-05T16:51:36.938-03:00  WARN 685089 --- [           main] [0969dd58-5802-4270-8a2b-cb06335798fd] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-05T16:51:37.127-03:00  INFO 685089 --- [           main] [0969dd58-5802-4270-8a2b-cb06335798fd] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 314ms userId=1 planId=1
2026-11-05T16:51:37.181-03:00  INFO 685089 --- [           main] [b89cf094-b89d-4497-a9ae-549c12127bdc] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/{id}/confirm 409 35ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionConfirmIT#rejectsAZ` - exit 0

```
2026-11-05T16:51:57.845-03:00  INFO 685666 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-05T16:51:57.845-03:00  INFO 685666 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-05T16:51:57.847-03:00  INFO 685666 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 2 ms
2026-11-05T16:51:57.900-03:00  INFO 685666 --- [           main] [] c.l.f.transaction.TransactionConfirmIT   : Started TransactionConfirmIT in 8.376 seconds (process running for 9.597)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-05T16:51:58.479-03:00  WARN 685666 --- [           main] [df2ffa43-02d6-4a64-ac64-204b5669f0de] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-05T16:51:58.482-03:00  WARN 685666 --- [           main] [df2ffa43-02d6-4a64-ac64-204b5669f0de] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-05T16:51:58.482-03:00  WARN 685666 --- [           main] [df2ffa43-02d6-4a64-ac64-204b5669f0de] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-05T16:51:58.653-03:00  INFO 685666 --- [           main] [df2ffa43-02d6-4a64-ac64-204b5669f0de] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 288ms userId=1 planId=1
2026-11-05T16:51:58.700-03:00  INFO 685666 --- [           main] [e2950dfa-5673-4501-8f37-795a1f417ced] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/{id}/confirm 422 22ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='MigrationsIT#v23LeavesExisting` - exit 0

```
2026-11-05T16:52:20.954-03:00  INFO 686248 --- [           main] [] o.f.core.internal.command.DbMigrate      : Migrating schema "public" to version "15 - optimistic locking versions"
2026-11-05T16:52:20.969-03:00  INFO 686248 --- [           main] [] o.f.core.internal.command.DbMigrate      : Migrating schema "public" to version "16 - hardening constraints"
2026-11-05T16:52:21.008-03:00  INFO 686248 --- [           main] [] o.f.core.internal.command.DbMigrate      : Migrating schema "public" to version "17 - transaction source text"
2026-11-05T16:52:21.014-03:00  INFO 686248 --- [           main] [] o.f.core.internal.command.DbMigrate      : Migrating schema "public" to version "18 - recurrence exceptions and watermark"
2026-11-05T16:52:21.024-03:00  INFO 686248 --- [           main] [] o.f.core.internal.command.DbMigrate      : Migrating schema "public" to version "19 - drop percent split mode"
2026-11-05T16:52:21.033-03:00  INFO 686248 --- [           main] [] o.f.core.internal.command.DbMigrate      : Migrating schema "public" to version "20 - lowercase emails"
2026-11-05T16:52:21.043-03:00  INFO 686248 --- [           main] [] o.f.core.internal.command.DbMigrate      : Migrating schema "public" to version "21 - cascade plan deletion"
2026-11-05T16:52:21.061-03:00  INFO 686248 --- [           main] [] o.f.core.internal.command.DbMigrate      : Migrating schema "public" to version "22 - add user language"
2026-11-05T16:52:21.067-03:00  INFO 686248 --- [           main] [] o.f.core.internal.command.DbMigrate      : Successfully applied 22 migrations to schema "public", now at version v22 (execution time 00:00.233s)
2026-11-05T16:52:21.110-03:00  INFO 686248 --- [           main] [] org.flywaydb.core.FlywayExecutor         : Database: jdbc:postgresql://localhost:41129/findraco_test_v13_scratch?loggerLevel=OFF (PostgreSQL 16.14)
2026-11-05T16:52:21.129-03:00  INFO 686248 --- [           main] [] o.f.core.internal.command.DbValidate     : Successfully validated 24 migrations (execution time 00:00.008s)
2026-11-05T16:52:21.147-03:00  INFO 686248 --- [           main] [] o.f.core.internal.command.DbMigrate      : Current version of schema "public": 22
2026-11-05T16:52:21.153-03:00  INFO 686248 --- [           main] [] o.f.core.internal.command.DbMigrate      : Migrating schema "public" to version "23 - add transaction confirmation"
2026-11-05T16:52:21.184-03:00  INFO 686248 --- [           main] [] o.f.core.internal.command.DbMigrate      : Migrating schema "public" to version "24 - add transaction scheduled date"
2026-11-05T16:52:21.204-03:00  INFO 686248 --- [           main] [] o.f.core.internal.command.DbMigrate      : Successfully applied 2 migrations to schema "public", now at version v24 (execution time 00:00.026s)
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='MigrationsIT#v23KeepsExistingV` - exit 0

```
2026-11-05T16:52:42.686-03:00  INFO 686838 --- [           main] [] o.f.core.internal.command.DbMigrate      : Migrating schema "public" to version "15 - optimistic locking versions"
2026-11-05T16:52:42.701-03:00  INFO 686838 --- [           main] [] o.f.core.internal.command.DbMigrate      : Migrating schema "public" to version "16 - hardening constraints"
2026-11-05T16:52:42.745-03:00  INFO 686838 --- [           main] [] o.f.core.internal.command.DbMigrate      : Migrating schema "public" to version "17 - transaction source text"
2026-11-05T16:52:42.754-03:00  INFO 686838 --- [           main] [] o.f.core.internal.command.DbMigrate      : Migrating schema "public" to version "18 - recurrence exceptions and watermark"
2026-11-05T16:52:42.763-03:00  INFO 686838 --- [           main] [] o.f.core.internal.command.DbMigrate      : Migrating schema "public" to version "19 - drop percent split mode"
2026-11-05T16:52:42.775-03:00  INFO 686838 --- [           main] [] o.f.core.internal.command.DbMigrate      : Migrating schema "public" to version "20 - lowercase emails"
2026-11-05T16:52:42.785-03:00  INFO 686838 --- [           main] [] o.f.core.internal.command.DbMigrate      : Migrating schema "public" to version "21 - cascade plan deletion"
2026-11-05T16:52:42.803-03:00  INFO 686838 --- [           main] [] o.f.core.internal.command.DbMigrate      : Migrating schema "public" to version "22 - add user language"
2026-11-05T16:52:42.810-03:00  INFO 686838 --- [           main] [] o.f.core.internal.command.DbMigrate      : Successfully applied 22 migrations to schema "public", now at version v22 (execution time 00:00.225s)
2026-11-05T16:52:42.843-03:00  INFO 686838 --- [           main] [] org.flywaydb.core.FlywayExecutor         : Database: jdbc:postgresql://localhost:39513/findraco_test_v13_scratch?loggerLevel=OFF (PostgreSQL 16.14)
2026-11-05T16:52:42.862-03:00  INFO 686838 --- [           main] [] o.f.core.internal.command.DbValidate     : Successfully validated 24 migrations (execution time 00:00.009s)
2026-11-05T16:52:42.874-03:00  INFO 686838 --- [           main] [] o.f.core.internal.command.DbMigrate      : Current version of schema "public": 22
2026-11-05T16:52:42.876-03:00  INFO 686838 --- [           main] [] o.f.core.internal.command.DbMigrate      : Migrating schema "public" to version "23 - add transaction confirmation"
2026-11-05T16:52:42.888-03:00  INFO 686838 --- [           main] [] o.f.core.internal.command.DbMigrate      : Migrating schema "public" to version "24 - add transaction scheduled date"
2026-11-05T16:52:42.896-03:00  INFO 686838 --- [           main] [] o.f.core.internal.command.DbMigrate      : Successfully applied 2 migrations to schema "public", now at version v24 (execution time 00:00.009s)
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionStatusIT#oneOffIsBy` - exit 0

```
2026-11-05T16:53:04.203-03:00  INFO 687423 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-05T16:53:04.256-03:00  INFO 687423 --- [           main] [] c.l.f.transaction.TransactionStatusIT    : Started TransactionStatusIT in 8.255 seconds (process running for 9.391)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-05T16:53:04.813-03:00  WARN 687423 --- [           main] [b07e1f54-4459-477f-bc1c-121bae0d58d9] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-05T16:53:04.816-03:00  WARN 687423 --- [           main] [b07e1f54-4459-477f-bc1c-121bae0d58d9] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List)
2026-11-05T16:53:04.816-03:00  WARN 687423 --- [           main] [b07e1f54-4459-477f-bc1c-121bae0d58d9] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List)
2026-11-05T16:53:04.816-03:00  WARN 687423 --- [           main] [b07e1f54-4459-477f-bc1c-121bae0d58d9] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#items()
2026-11-05T16:53:04.816-03:00  WARN 687423 --- [           main] [b07e1f54-4459-477f-bc1c-121bae0d58d9] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-05T16:53:04.816-03:00  WARN 687423 --- [           main] [b07e1f54-4459-477f-bc1c-121bae0d58d9] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#participants()
2026-11-05T16:53:05.001-03:00  INFO 687423 --- [           main] [b07e1f54-4459-477f-bc1c-121bae0d58d9] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 300ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionStatusIT#statusUses` - exit 0

```
2026-11-05T16:53:24.328-03:00  INFO 687996 --- [           main] [] o.s.d.j.r.query.QueryEnhancerFactories   : Hibernate is in classpath; If applicable, HQL parser will be used.
2026-11-05T16:53:25.012-03:00  INFO 687996 --- [           main] [] eAuthenticationProviderManagerConfigurer : Global AuthenticationManager configured with AuthenticationProvider bean with name authenticationProvider
2026-11-05T16:53:25.013-03:00  WARN 687996 --- [           main] [] r$InitializeUserDetailsManagerConfigurer : Global AuthenticationManager configured with an AuthenticationProvider bean. UserDetailsService beans will not be used by Spring Security for automatically configuring username/password login. Consider removing the AuthenticationProvider bean. Alternatively, consider using the UserDetailsService in a manually instantiated DaoAuthenticationProvider. If the current configuration is intentional, to turn off this warning, increase the logging level of 'org.springframework.security.config.annotation.authentication.configuration.InitializeUserDetailsBeanManagerConfigurer' to ERROR
2026-11-05T16:53:26.197-03:00  INFO 687996 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-05T16:53:26.198-03:00  INFO 687996 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-05T16:53:26.199-03:00  INFO 687996 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-05T16:53:26.253-03:00  INFO 687996 --- [           main] [] c.l.f.transaction.TransactionStatusIT    : Started TransactionStatusIT in 8.259 seconds (process running for 9.495)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-05T16:53:27.037-03:00  INFO 687996 --- [           main] [64ffa3df-c496-44c6-90a1-1498b6488a80] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction 200 275ms userId=1 planId=1
2026-11-05T16:53:27.117-03:00  INFO 687996 --- [           main] [2aacdacf-98c3-45c0-9e25-a3b713aadbb9] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction 200 29ms userId=2 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesConfirmationIT#topUpStam` - exit 0

```
2026-11-05T16:53:45.497-03:00  INFO 688586 --- [           main] [] org.hibernate.orm.core                   : HHH000489: No JTA platform available (set 'hibernate.transaction.jta.platform' to enable JTA platform integration)
2026-11-05T16:53:45.539-03:00  INFO 688586 --- [           main] [] j.LocalContainerEntityManagerFactoryBean : Initialized JPA EntityManagerFactory for persistence unit 'default'
2026-11-05T16:53:45.631-03:00  INFO 688586 --- [           main] [] o.s.d.j.r.query.QueryEnhancerFactories   : Hibernate is in classpath; If applicable, HQL parser will be used.
2026-11-05T16:53:46.393-03:00  INFO 688586 --- [           main] [] eAuthenticationProviderManagerConfigurer : Global AuthenticationManager configured with AuthenticationProvider bean with name authenticationProvider
2026-11-05T16:53:46.393-03:00  WARN 688586 --- [           main] [] r$InitializeUserDetailsManagerConfigurer : Global AuthenticationManager configured with an AuthenticationProvider bean. UserDetailsService beans will not be used by Spring Security for automatically configuring username/password login. Consider removing the AuthenticationProvider bean. Alternatively, consider using the UserDetailsService in a manually instantiated DaoAuthenticationProvider. If the current configuration is intentional, to turn off this warning, increase the logging level of 'org.springframework.security.config.annotation.authentication.configuration.InitializeUserDetailsBeanManagerConfigurer' to ERROR
2026-11-05T16:53:47.619-03:00  INFO 688586 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-05T16:53:47.619-03:00  INFO 688586 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-05T16:53:47.620-03:00  INFO 688586 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-05T16:53:47.677-03:00  INFO 688586 --- [           main] [] c.l.f.transaction.SeriesConfirmationIT   : Started SeriesConfirmationIT in 8.34 seconds (process running for 9.544)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionConfirmIT#confirmin` - exit 0

```
2026-11-05T16:54:09.224-03:00  INFO 689176 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-05T16:54:09.225-03:00  INFO 689176 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-05T16:54:09.284-03:00  INFO 689176 --- [           main] [] c.l.f.transaction.TransactionConfirmIT   : Started TransactionConfirmIT in 8.142 seconds (process running for 9.499)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
2026-11-05T16:54:09.857-03:00  WARN 689176 --- [           main] [51cb80eb-294d-4505-850a-ab330b91f706] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-05T16:54:09.860-03:00  WARN 689176 --- [           main] [51cb80eb-294d-4505-850a-ab330b91f706] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-05T16:54:09.860-03:00  WARN 689176 --- [           main] [51cb80eb-294d-4505-850a-ab330b91f706] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-05T16:54:10.030-03:00  INFO 689176 --- [           main] [51cb80eb-294d-4505-850a-ab330b91f706] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 292ms userId=1 planId=1
2026-11-05T16:54:10.092-03:00  INFO 689176 --- [           main] [aa54c56c-05a9-4e8c-b046-16eea78b66b1] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/{id}/confirm 200 44ms userId=1 planId=1
2026-11-05T16:54:10.116-03:00  INFO 689176 --- [           main] [2d665ff5-aa66-4b66-b629-456e5ae8b5de] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/{id}/confirm 409 21ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='DashboardActualIT#summarySplit` - exit 0

```
2026-11-05T16:54:28.715-03:00  INFO 689749 --- [           main] [] j.LocalContainerEntityManagerFactoryBean : Initialized JPA EntityManagerFactory for persistence unit 'default'
2026-11-05T16:54:28.812-03:00  INFO 689749 --- [           main] [] o.s.d.j.r.query.QueryEnhancerFactories   : Hibernate is in classpath; If applicable, HQL parser will be used.
2026-11-05T16:54:29.546-03:00  INFO 689749 --- [           main] [] eAuthenticationProviderManagerConfigurer : Global AuthenticationManager configured with AuthenticationProvider bean with name authenticationProvider
2026-11-05T16:54:29.547-03:00  WARN 689749 --- [           main] [] r$InitializeUserDetailsManagerConfigurer : Global AuthenticationManager configured with an AuthenticationProvider bean. UserDetailsService beans will not be used by Spring Security for automatically configuring username/password login. Consider removing the AuthenticationProvider bean. Alternatively, consider using the UserDetailsService in a manually instantiated DaoAuthenticationProvider. If the current configuration is intentional, to turn off this warning, increase the logging level of 'org.springframework.security.config.annotation.authentication.configuration.InitializeUserDetailsBeanManagerConfigurer' to ERROR
2026-11-05T16:54:30.751-03:00  INFO 689749 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-05T16:54:30.752-03:00  INFO 689749 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-05T16:54:30.753-03:00  INFO 689749 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-05T16:54:30.807-03:00  INFO 689749 --- [           main] [] c.l.f.dashboard.DashboardActualIT        : Started DashboardActualIT in 8.134 seconds (process running for 9.253)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-05T16:54:31.542-03:00  INFO 689749 --- [           main] [7a8dc7e2-cdfc-416b-afa3-200e537edb65] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/dashboard 200 252ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='DashboardActualIT#pendingCount` - exit 0

```
2026-11-05T16:54:50.530-03:00  INFO 690322 --- [           main] [] j.LocalContainerEntityManagerFactoryBean : Initialized JPA EntityManagerFactory for persistence unit 'default'
2026-11-05T16:54:50.628-03:00  INFO 690322 --- [           main] [] o.s.d.j.r.query.QueryEnhancerFactories   : Hibernate is in classpath; If applicable, HQL parser will be used.
2026-11-05T16:54:51.348-03:00  INFO 690322 --- [           main] [] eAuthenticationProviderManagerConfigurer : Global AuthenticationManager configured with AuthenticationProvider bean with name authenticationProvider
2026-11-05T16:54:51.348-03:00  WARN 690322 --- [           main] [] r$InitializeUserDetailsManagerConfigurer : Global AuthenticationManager configured with an AuthenticationProvider bean. UserDetailsService beans will not be used by Spring Security for automatically configuring username/password login. Consider removing the AuthenticationProvider bean. Alternatively, consider using the UserDetailsService in a manually instantiated DaoAuthenticationProvider. If the current configuration is intentional, to turn off this warning, increase the logging level of 'org.springframework.security.config.annotation.authentication.configuration.InitializeUserDetailsBeanManagerConfigurer' to ERROR
2026-11-05T16:54:52.589-03:00  INFO 690322 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-05T16:54:52.589-03:00  INFO 690322 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-05T16:54:52.591-03:00  INFO 690322 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-05T16:54:52.651-03:00  INFO 690322 --- [           main] [] c.l.f.dashboard.DashboardActualIT        : Started DashboardActualIT in 8.249 seconds (process running for 9.491)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-05T16:54:53.372-03:00  INFO 690322 --- [           main] [d9a8c86b-4d89-4015-b3c8-a220ad400858] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/dashboard 200 252ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='DashboardActualIT#noForecastMe` - exit 0

```
2026-11-05T16:55:12.275-03:00  INFO 690908 --- [           main] [] j.LocalContainerEntityManagerFactoryBean : Initialized JPA EntityManagerFactory for persistence unit 'default'
2026-11-05T16:55:12.373-03:00  INFO 690908 --- [           main] [] o.s.d.j.r.query.QueryEnhancerFactories   : Hibernate is in classpath; If applicable, HQL parser will be used.
2026-11-05T16:55:13.083-03:00  INFO 690908 --- [           main] [] eAuthenticationProviderManagerConfigurer : Global AuthenticationManager configured with AuthenticationProvider bean with name authenticationProvider
2026-11-05T16:55:13.083-03:00  WARN 690908 --- [           main] [] r$InitializeUserDetailsManagerConfigurer : Global AuthenticationManager configured with an AuthenticationProvider bean. UserDetailsService beans will not be used by Spring Security for automatically configuring username/password login. Consider removing the AuthenticationProvider bean. Alternatively, consider using the UserDetailsService in a manually instantiated DaoAuthenticationProvider. If the current configuration is intentional, to turn off this warning, increase the logging level of 'org.springframework.security.config.annotation.authentication.configuration.InitializeUserDetailsBeanManagerConfigurer' to ERROR
2026-11-05T16:55:14.270-03:00  INFO 690908 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-05T16:55:14.270-03:00  INFO 690908 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-05T16:55:14.272-03:00  INFO 690908 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 2 ms
2026-11-05T16:55:14.324-03:00  INFO 690908 --- [           main] [] c.l.f.dashboard.DashboardActualIT        : Started DashboardActualIT in 8.148 seconds (process running for 9.302)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-05T16:55:15.111-03:00  INFO 690908 --- [           main] [77527898-f835-4ed6-b71e-1bdc457537cf] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/dashboard 200 275ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='DashboardActualIT#trendAndPeop` - exit 0

```
2026-11-05T16:55:33.806-03:00  INFO 691488 --- [           main] [] o.s.d.j.r.query.QueryEnhancerFactories   : Hibernate is in classpath; If applicable, HQL parser will be used.
2026-11-05T16:55:34.530-03:00  INFO 691488 --- [           main] [] eAuthenticationProviderManagerConfigurer : Global AuthenticationManager configured with AuthenticationProvider bean with name authenticationProvider
2026-11-05T16:55:34.531-03:00  WARN 691488 --- [           main] [] r$InitializeUserDetailsManagerConfigurer : Global AuthenticationManager configured with an AuthenticationProvider bean. UserDetailsService beans will not be used by Spring Security for automatically configuring username/password login. Consider removing the AuthenticationProvider bean. Alternatively, consider using the UserDetailsService in a manually instantiated DaoAuthenticationProvider. If the current configuration is intentional, to turn off this warning, increase the logging level of 'org.springframework.security.config.annotation.authentication.configuration.InitializeUserDetailsBeanManagerConfigurer' to ERROR
2026-11-05T16:55:35.770-03:00  INFO 691488 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-05T16:55:35.770-03:00  INFO 691488 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-05T16:55:35.771-03:00  INFO 691488 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-05T16:55:35.823-03:00  INFO 691488 --- [           main] [] c.l.f.dashboard.DashboardActualIT        : Started DashboardActualIT in 8.226 seconds (process running for 9.376)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-05T16:55:36.594-03:00  INFO 691488 --- [           main] [68656751-1983-4993-bd17-4db082557bc0] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/dashboard 200 264ms userId=1 planId=1
2026-11-05T16:55:36.626-03:00  INFO 691488 --- [           main] [d58aad25-b518-42e9-83d7-93b4ae112557] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/dashboard/trend 200 21ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesConfirmationIT#following` - exit 0

```
2026-11-05T16:55:56.865-03:00  INFO 692062 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-05T16:55:56.866-03:00  INFO 692062 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-05T16:55:56.922-03:00  INFO 692062 --- [           main] [] c.l.f.transaction.SeriesConfirmationIT   : Started SeriesConfirmationIT in 8.087 seconds (process running for 9.242)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-05T16:55:57.509-03:00  WARN 692062 --- [           main] [72505d49-e800-4413-827f-393885d1ca7a] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-05T16:55:57.512-03:00  WARN 692062 --- [           main] [72505d49-e800-4413-827f-393885d1ca7a] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-05T16:55:57.512-03:00  WARN 692062 --- [           main] [72505d49-e800-4413-827f-393885d1ca7a] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-05T16:55:57.683-03:00  INFO 692062 --- [           main] [72505d49-e800-4413-827f-393885d1ca7a] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 286ms userId=1 planId=1
2026-11-05T16:55:57.745-03:00  INFO 692062 --- [           main] [9af805ac-57ee-4469-a9f8-0bb0a89de5bc] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/{id}/confirm 200 44ms userId=1 planId=1
2026-11-05T16:55:57.822-03:00  INFO 692062 --- [           main] [5d287f6e-3b3c-473d-a40a-7aec36178648] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 74ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesConfirmationIT#undoneMov` - exit 0

```
2026-11-05T16:56:18.274-03:00  INFO 692627 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 2 ms
2026-11-05T16:56:18.333-03:00  INFO 692627 --- [           main] [] c.l.f.transaction.SeriesConfirmationIT   : Started SeriesConfirmationIT in 8.194 seconds (process running for 9.396)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-05T16:56:18.906-03:00  WARN 692627 --- [           main] [b5c43ffc-98e8-48ef-958c-7c2045c899aa] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-05T16:56:18.909-03:00  WARN 692627 --- [           main] [b5c43ffc-98e8-48ef-958c-7c2045c899aa] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-05T16:56:18.910-03:00  WARN 692627 --- [           main] [b5c43ffc-98e8-48ef-958c-7c2045c899aa] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-05T16:56:19.101-03:00  INFO 692627 --- [           main] [b5c43ffc-98e8-48ef-958c-7c2045c899aa] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 319ms userId=1 planId=1
2026-11-05T16:56:19.182-03:00  INFO 692627 --- [           main] [a45ff3b6-4882-4278-bc78-9ff49c24a303] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/{id}/confirm 200 60ms userId=1 planId=1
2026-11-05T16:56:19.255-03:00  INFO 692627 --- [           main] [7a1d616b-3281-4501-b619-a0ef38c33058] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 69ms userId=1 planId=1
2026-11-05T16:56:19.314-03:00  INFO 692627 --- [           main] [49b376f0-d59c-400b-bc3e-653a5e117821] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 55ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesConfirmationIT#confirmOn` - exit 0

```
2026-11-05T16:56:39.934-03:00  INFO 693228 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-05T16:56:39.935-03:00  INFO 693228 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-05T16:56:39.991-03:00  INFO 693228 --- [           main] [] c.l.f.transaction.SeriesConfirmationIT   : Started SeriesConfirmationIT in 8.279 seconds (process running for 9.457)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-05T16:56:40.551-03:00  WARN 693228 --- [           main] [f7d7852a-7d00-4704-9da7-a4e9b9f8f4c2] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-05T16:56:40.554-03:00  WARN 693228 --- [           main] [f7d7852a-7d00-4704-9da7-a4e9b9f8f4c2] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-05T16:56:40.555-03:00  WARN 693228 --- [           main] [f7d7852a-7d00-4704-9da7-a4e9b9f8f4c2] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-05T16:56:40.736-03:00  INFO 693228 --- [           main] [f7d7852a-7d00-4704-9da7-a4e9b9f8f4c2] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 296ms userId=1 planId=1
2026-11-05T16:56:40.801-03:00  INFO 693228 --- [           main] [5a6c0792-9b1c-4ac9-8844-ca565dc45b42] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/{id}/confirm 200 48ms userId=1 planId=1
2026-11-05T16:56:40.885-03:00  INFO 693228 --- [           main] [0104e263-eb7d-4bb0-afa2-8dfc1463bf27] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 81ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesConfirmationIT#pivotStat` - exit 0

```
2026-11-05T16:57:01.919-03:00  INFO 693785 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-05T16:57:01.920-03:00  INFO 693785 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-05T16:57:01.978-03:00  INFO 693785 --- [           main] [] c.l.f.transaction.SeriesConfirmationIT   : Started SeriesConfirmationIT in 8.344 seconds (process running for 9.51)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-05T16:57:02.563-03:00  WARN 693785 --- [           main] [9a3f81da-ed51-4080-b59d-733326fa1b26] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-05T16:57:02.566-03:00  WARN 693785 --- [           main] [9a3f81da-ed51-4080-b59d-733326fa1b26] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-05T16:57:02.567-03:00  WARN 693785 --- [           main] [9a3f81da-ed51-4080-b59d-733326fa1b26] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-05T16:57:02.737-03:00  INFO 693785 --- [           main] [9a3f81da-ed51-4080-b59d-733326fa1b26] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 284ms userId=1 planId=1
2026-11-05T16:57:02.842-03:00  INFO 693785 --- [           main] [633b5974-306b-4f84-8783-5136e49e90ad] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 89ms userId=1 planId=1
2026-11-05T16:57:02.927-03:00  INFO 693785 --- [           main] [f953546b-cd21-4d0e-8289-b20f904ac1b6] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 34ms userId=1 planId=1
```
