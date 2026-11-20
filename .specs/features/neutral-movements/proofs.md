# neutral-movements proofs

**HEAD**: 84f3db67
**Tree**: clean
**Shell**: /bin/sh
**Result**: 33 pass, 0 fail

| Check | Proof | Result |
| --- | --- | --- |
| C1 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='NeutralMovementsIT#neutralRows` | pass |
| C2 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='NeutralMovementsIT#neutralRows` | pass |
| C3 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='NeutralMovementsIT#neutralKind` | pass |
| C4 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='NeutralMovementsIT#neutralKind` | pass |
| C5 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='NeutralMovementsIT#dashboardRe` | pass |
| C6 | `run stories / ✓ src/features/overview/components/SummaryCards.stories.tsx > With Neutral Movements` | pass |
| C6 | `run stories / ✓ src/features/overview/components/SummaryCards.stories.tsx > Default` | pass |
| C7 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='NeutralMovementsIT#refundLower` | pass |
| C8 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='NeutralMovementsIT#refundLower` | pass |
| C9 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='NeutralMovementsIT#refundNeeds` | pass |
| C10 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='NeutralMovementsIT#limitIsMeas` | pass |
| C11 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='NeutralImportIT#importMarksOnl` | pass |
| C12 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='NeutralCandidatesIT#candidates` | pass |
| C13 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='NeutralCandidatesIT#applyingAC` | pass |
| C14 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='NeutralCandidatesIT#reviewFoll` | pass |
| C15 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='PlanAuthorizationMatrixIT#neut` | pass |
| C16 | `run unit / ✓ NeutralReviewSheet > applies a candidate and removes it from the list` | pass |
| C16 | `run stories / ✓ src/features/transactions/components/NeutralReviewListView.stories.tsx > Empty` | pass |
| C17 | `run unit / ✓ transactionForm > maps the movement kind both ways` | pass |
| C17 | `run unit / ✓ TransactionFormDrawer > saves a neutral kind without category or split` | pass |
| C18 | `run unit / ✓ TransactionFormDrawer > reopens a row with its movement kind` | pass |
| C19 | `run stories / ✓ src/features/transactions/components/TransactionCells.stories.tsx > Movement Kinds` | pass |
| C19 | `run stories / ✓ src/features/transactions/components/TransactionMobileList.stories.tsx > Movement Kinds` | pass |
| C20 | `run unit / ✓ TransactionsPage > filters the list to neutral movements` | pass |
| C20 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='NeutralMovementsIT#listFilterN` | pass |
| C21 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpNeutralKindIT#createTakesTh` | pass |
| C22 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpNeutralKindIT#updateAndList` | pass |
| C23 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpNeutralKindIT#summaryToolsU` | pass |
| C24 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='MigrationsIT#transactionKindIs` | pass |
| Build | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -DskipITs -Dsurefire.skip=true` | pass |
| Build | `cd frontend && pnpm lint` | pass |
| Build | `cd frontend && pnpm build` | pass |
| Build | `cd frontend && node scripts/check-siblings.ts` | pass |

## Output

`Run stories` - exit 0

```
 ✓ |storybook (chromium)| src/features/transactions/components/TransactionCells.stories.tsx > Read Only 40ms

 Test Files  4 passed (4)
      Tests  34 passed (34)
   Start at  23:10:26
   Duration  3.17s (transform 0ms, setup 1.85s, collect 1.88s, tests 3.02s, environment 0ms, prepare 11.93s)

No story files found for the specified pattern: src/**/*.mdx
stderr | src/features/transactions/components/TransactionCells.stories.tsx > Edit Description
A component suspended inside an `act` scope, but the `act` call was not awaited. When testing React components that depend on asynchronous data, you must await the result:

await act(() => ...)
stderr | src/features/transactions/components/TransactionCells.stories.tsx > Edit Participants
You are using Testing Library's `screen` object. Use `within(canvasElement)` instead.
More info: https://storybook.js.org/docs/writing-tests/interaction-testing?ref=error
```

`Run unit` - exit 0

```
Creating Table Instance...

 ✓ |unit| src/features/transactions/TransactionsPage.test.tsx > TransactionsPage period navigator (PNAV-01, PNAV-02) > replaces a custom range with the This month preset (PNAV-03 AC 1) 158ms
stdout | src/features/transactions/TransactionsPage.test.tsx > TransactionsPage period navigator (PNAV-01, PNAV-02) > ignores the pre-feature from and to params and opens on the current month (PNAV-05)
Creating Table Instance...

 ✓ |unit| src/features/transactions/TransactionsPage.test.tsx > TransactionsPage period navigator (PNAV-01, PNAV-02) > keeps the period when all filters are cleared (PNAV-02 AC 4) 138ms
 ✓ |unit| src/features/transactions/TransactionsPage.test.tsx > TransactionsPage period navigator (PNAV-01, PNAV-02) > ignores the pre-feature from and to params and opens on the current month (PNAV-05) 29ms

 Test Files  4 passed (4)
      Tests  156 passed (156)
   Start at  23:10:31
   Duration  13.06s (transform 693ms, setup 402ms, collect 11.02s, tests 15.13s, environment 1.64s, prepare 163ms)

No story files found for the specified pattern: src/**/*.mdx
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='NeutralMovementsIT#neutralRows` - exit 0

```
2026-11-19T23:11:05.605-03:00  INFO 2136669 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable resources capabilities, notification: true
2026-11-19T23:11:05.607-03:00  INFO 2136669 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable resources templates capabilities, notification: true
2026-11-19T23:11:05.607-03:00  INFO 2136669 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable prompts capabilities, notification: true
2026-11-19T23:11:05.609-03:00  INFO 2136669 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable completions capabilities
2026-11-19T23:11:05.751-03:00  INFO 2136669 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-19T23:11:05.752-03:00  INFO 2136669 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-19T23:11:05.753-03:00  INFO 2136669 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-19T23:11:05.811-03:00  INFO 2136669 --- [           main] [] c.l.f.transaction.NeutralMovementsIT     : Started NeutralMovementsIT in 9.669 seconds (process running for 11.008)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-19T23:11:06.602-03:00  INFO 2136669 --- [           main] [20163c25-8cf3-43c0-8e48-0da0da52d4ee] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/dashboard 200 274ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='NeutralMovementsIT#neutralRows` - exit 0

```
2026-11-19T23:11:32.918-03:00  INFO 2137204 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable resources templates capabilities, notification: true
2026-11-19T23:11:32.919-03:00  INFO 2137204 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable prompts capabilities, notification: true
2026-11-19T23:11:32.920-03:00  INFO 2137204 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable completions capabilities
2026-11-19T23:11:33.049-03:00  INFO 2137204 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-19T23:11:33.049-03:00  INFO 2137204 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-19T23:11:33.050-03:00  INFO 2137204 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-19T23:11:33.110-03:00  INFO 2137204 --- [           main] [] c.l.f.transaction.NeutralMovementsIT     : Started NeutralMovementsIT in 9.255 seconds (process running for 10.417)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-19T23:11:33.843-03:00  INFO 2137204 --- [           main] [7a141342-737d-4bd3-abc3-18638ccd6b75] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/dashboard/trend 200 232ms userId=1 planId=1
2026-11-19T23:11:33.912-03:00  INFO 2137204 --- [           main] [54c27da6-e540-4357-91b0-5412b5c35bf2] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/dashboard 200 58ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='NeutralMovementsIT#neutralKind` - exit 0

```
2026-11-19T23:12:00.325-03:00  INFO 2137734 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-19T23:12:00.326-03:00  INFO 2137734 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-19T23:12:00.380-03:00  INFO 2137734 --- [           main] [] c.l.f.transaction.NeutralMovementsIT     : Started NeutralMovementsIT in 9.207 seconds (process running for 10.464)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-19T23:12:01.175-03:00  INFO 2137734 --- [           main] [44ed75b2-c110-40fc-9ab7-9768add1c185] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/category/spending 200 266ms userId=1 planId=1
2026-11-19T23:12:01.221-03:00  INFO 2137734 --- [           main] [1e95009d-23df-4ed5-a041-2fb72fb10437] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/category/spending 200 23ms userId=1 planId=1
2026-11-19T23:12:01.309-03:00  INFO 2137734 --- [           main] [f963e822-8af7-4240-bb07-eef9091b1db8] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/category/spending 200 23ms userId=1 planId=1
2026-11-19T23:12:01.338-03:00  INFO 2137734 --- [           main] [98e88635-bf6d-449b-bba1-aa5b8b3bb56f] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/category/spending 200 19ms userId=1 planId=1
2026-11-19T23:12:01.365-03:00  INFO 2137734 --- [           main] [74be3cb3-f7bb-4a80-ab6c-d60e2560d543] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/category/spending 200 25ms userId=1 planId=1
2026-11-19T23:12:01.387-03:00  INFO 2137734 --- [           main] [1b50672b-3311-4b3f-a99c-352144c334d1] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/category/spending 200 18ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='NeutralMovementsIT#neutralKind` - exit 0

```
2026-11-19T23:12:28.444-03:00  INFO 2138256 --- [           main] [5b089f34-f237-4226-998d-daab26f6b66a] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/{id} 422 17ms userId=1 planId=1
2026-11-19T23:12:28.458-03:00  INFO 2138256 --- [           main] [272efccd-2dac-4a43-a7b8-8d7030aee755] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 11ms userId=1 planId=1
2026-11-19T23:12:28.471-03:00  INFO 2138256 --- [           main] [46db330e-f3e0-4759-84bf-7d5d10cf4109] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/{id} 422 12ms userId=1 planId=1
2026-11-19T23:12:28.482-03:00  INFO 2138256 --- [           main] [d37f4c6b-44a0-43dd-ab73-d7441598ac69] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 9ms userId=1 planId=1
2026-11-19T23:12:28.496-03:00  INFO 2138256 --- [           main] [bbe60f52-3877-418e-b75a-1055251d9f8b] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/{id} 422 12ms userId=1 planId=1
2026-11-19T23:12:28.509-03:00  INFO 2138256 --- [           main] [2d64b006-6e84-4f48-be10-30b2ed7a1961] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 11ms userId=1 planId=1
2026-11-19T23:12:28.528-03:00  INFO 2138256 --- [           main] [828f7ee2-54b4-4d75-9d0e-e64627951547] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/{id} 422 17ms userId=1 planId=1
2026-11-19T23:12:28.538-03:00  INFO 2138256 --- [           main] [aa240af0-d1af-407b-854d-b0f1f3af5186] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 9ms userId=1 planId=1
2026-11-19T23:12:28.552-03:00  INFO 2138256 --- [           main] [74d3a4cb-7567-4d6a-96ff-6584c28c2c83] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/{id} 422 12ms userId=1 planId=1
2026-11-19T23:12:28.563-03:00  INFO 2138256 --- [           main] [45bde849-106c-4cab-ae3d-6695091b0e76] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 9ms userId=1 planId=1
2026-11-19T23:12:28.578-03:00  INFO 2138256 --- [           main] [43577170-5f96-40f9-b669-eb0706d26486] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/{id} 422 13ms userId=1 planId=1
2026-11-19T23:12:28.589-03:00  INFO 2138256 --- [           main] [0f72558a-fe1a-4540-962a-9618a83613db] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 9ms userId=1 planId=1
2026-11-19T23:12:28.601-03:00  INFO 2138256 --- [           main] [f2825a4e-02bd-4b4c-ba0f-a0b1e3d7ff34] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/{id} 422 10ms userId=1 planId=1
2026-11-19T23:12:28.609-03:00  INFO 2138256 --- [           main] [ee03977b-3de1-47cf-a2c9-d23eccf523b4] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 7ms userId=1 planId=1
2026-11-19T23:12:28.618-03:00  INFO 2138256 --- [           main] [99dd14a7-88ff-4b8e-b434-f32de747f967] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/{id} 422 7ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='NeutralMovementsIT#dashboardRe` - exit 0

```
2026-11-19T23:12:54.795-03:00  INFO 2138797 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable resources templates capabilities, notification: true
2026-11-19T23:12:54.796-03:00  INFO 2138797 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable prompts capabilities, notification: true
2026-11-19T23:12:54.797-03:00  INFO 2138797 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable completions capabilities
2026-11-19T23:12:54.925-03:00  INFO 2138797 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-19T23:12:54.925-03:00  INFO 2138797 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-19T23:12:54.927-03:00  INFO 2138797 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 2 ms
2026-11-19T23:12:54.986-03:00  INFO 2138797 --- [           main] [] c.l.f.transaction.NeutralMovementsIT     : Started NeutralMovementsIT in 9.079 seconds (process running for 10.369)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-19T23:12:55.682-03:00  INFO 2138797 --- [           main] [5fc3b7eb-853d-43de-a85a-f3bb59d3ad75] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/{id} 200 218ms userId=1 planId=1
2026-11-19T23:12:55.763-03:00  INFO 2138797 --- [           main] [8f8d480b-5651-4941-91cd-520e0b7e302c] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/dashboard 200 75ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='NeutralMovementsIT#refundLower` - exit 0

```
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-19T23:13:22.956-03:00  INFO 2139307 --- [           main] [425758c5-e89b-4b21-95a2-10cfe2968a71] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/dashboard 200 279ms userId=1 planId=1
2026-11-19T23:13:23.028-03:00  WARN 2139307 --- [           main] [0fe7c5da-6c36-4dc0-8780-0f470f74199c] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#participants()
2026-11-19T23:13:23.030-03:00  WARN 2139307 --- [           main] [0fe7c5da-6c36-4dc0-8780-0f470f74199c] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-19T23:13:23.031-03:00  WARN 2139307 --- [           main] [0fe7c5da-6c36-4dc0-8780-0f470f74199c] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind)
2026-11-19T23:13:23.031-03:00  WARN 2139307 --- [           main] [0fe7c5da-6c36-4dc0-8780-0f470f74199c] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind)
2026-11-19T23:13:23.031-03:00  WARN 2139307 --- [           main] [0fe7c5da-6c36-4dc0-8780-0f470f74199c] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#items()
2026-11-19T23:13:23.031-03:00  WARN 2139307 --- [           main] [0fe7c5da-6c36-4dc0-8780-0f470f74199c] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-19T23:13:23.061-03:00  INFO 2139307 --- [           main] [0fe7c5da-6c36-4dc0-8780-0f470f74199c] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 56ms userId=1 planId=1
2026-11-19T23:13:23.090-03:00  INFO 2139307 --- [           main] [5c9c0593-4e8a-4ee7-b933-f5baa68e6f0b] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/dashboard 200 27ms userId=1 planId=1
2026-11-19T23:13:23.156-03:00  INFO 2139307 --- [           main] [2b56df07-4c79-4a86-848b-ce76577bc47d] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/category/spending 200 64ms userId=1 planId=1
2026-11-19T23:13:23.175-03:00  INFO 2139307 --- [           main] [3509299d-3c0f-487d-8dd0-b37dd1f68e95] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/dashboard/trend 200 16ms userId=1 planId=1
2026-11-19T23:13:23.188-03:00  INFO 2139307 --- [           main] [1f7dc685-57fb-42a6-93b5-291f486b1c21] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/dashboard/trend 200 11ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='NeutralMovementsIT#refundLower` - exit 0

```
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-19T23:13:50.355-03:00  INFO 2139826 --- [           main] [eef7c55b-d604-4818-87c4-e0a3d3b77573] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/dashboard 200 271ms userId=1 planId=1
2026-11-19T23:13:50.443-03:00  WARN 2139826 --- [           main] [d99c0cb7-a374-41ed-8b36-d1067cfc8d09] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-19T23:13:50.446-03:00  WARN 2139826 --- [           main] [d99c0cb7-a374-41ed-8b36-d1067cfc8d09] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#items()
2026-11-19T23:13:50.447-03:00  WARN 2139826 --- [           main] [d99c0cb7-a374-41ed-8b36-d1067cfc8d09] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-19T23:13:50.447-03:00  WARN 2139826 --- [           main] [d99c0cb7-a374-41ed-8b36-d1067cfc8d09] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind)
2026-11-19T23:13:50.447-03:00  WARN 2139826 --- [           main] [d99c0cb7-a374-41ed-8b36-d1067cfc8d09] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind)
2026-11-19T23:13:50.447-03:00  WARN 2139826 --- [           main] [d99c0cb7-a374-41ed-8b36-d1067cfc8d09] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#participants()
2026-11-19T23:13:50.514-03:00  INFO 2139826 --- [           main] [d99c0cb7-a374-41ed-8b36-d1067cfc8d09] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 99ms userId=1 planId=1
2026-11-19T23:13:50.543-03:00  INFO 2139826 --- [           main] [026378b7-bddf-4cb7-8404-ae983a3cbec6] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/dashboard 200 26ms userId=1 planId=1
2026-11-19T23:13:50.609-03:00  INFO 2139826 --- [           main] [006b94a8-bfd4-44fa-84f2-192d487b3c17] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/category/spending 200 65ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='NeutralMovementsIT#refundNeeds` - exit 0

```
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-19T23:14:17.337-03:00  WARN 2140351 --- [           main] [e604a382-bf68-4b6f-92d3-34ad6959fead] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-19T23:14:17.341-03:00  WARN 2140351 --- [           main] [e604a382-bf68-4b6f-92d3-34ad6959fead] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-19T23:14:17.341-03:00  WARN 2140351 --- [           main] [e604a382-bf68-4b6f-92d3-34ad6959fead] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#participants()
2026-11-19T23:14:17.341-03:00  WARN 2140351 --- [           main] [e604a382-bf68-4b6f-92d3-34ad6959fead] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#items()
2026-11-19T23:14:17.342-03:00  WARN 2140351 --- [           main] [e604a382-bf68-4b6f-92d3-34ad6959fead] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind)
2026-11-19T23:14:17.342-03:00  WARN 2140351 --- [           main] [e604a382-bf68-4b6f-92d3-34ad6959fead] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind)
2026-11-19T23:14:17.437-03:00  INFO 2140351 --- [           main] [e604a382-bf68-4b6f-92d3-34ad6959fead] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 208ms userId=1 planId=1
2026-11-19T23:14:17.484-03:00  INFO 2140351 --- [           main] [ebd20da5-7856-4031-a81a-5b8bfce6b954] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 17ms userId=1 planId=1
2026-11-19T23:14:17.496-03:00  INFO 2140351 --- [           main] [5029a143-c816-4598-a3ed-4cf215cb2691] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 11ms userId=1 planId=1
2026-11-19T23:14:17.600-03:00  INFO 2140351 --- [           main] [2e679de0-67a9-4e6d-afdc-cb5a9e261283] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 33ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='NeutralMovementsIT#limitIsMeas` - exit 0

```
2026-11-19T23:14:43.652-03:00  INFO 2140866 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable resources templates capabilities, notification: true
2026-11-19T23:14:43.653-03:00  INFO 2140866 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable prompts capabilities, notification: true
2026-11-19T23:14:43.654-03:00  INFO 2140866 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable completions capabilities
2026-11-19T23:14:43.781-03:00  INFO 2140866 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-19T23:14:43.782-03:00  INFO 2140866 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-19T23:14:43.783-03:00  INFO 2140866 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-19T23:14:43.838-03:00  INFO 2140866 --- [           main] [] c.l.f.transaction.NeutralMovementsIT     : Started NeutralMovementsIT in 9.127 seconds (process running for 10.413)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-19T23:14:44.610-03:00  INFO 2140866 --- [           main] [9a5a0770-06ac-48f8-8553-b1aef67d01ba] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/category/spending 200 263ms userId=1 planId=1
2026-11-19T23:14:44.690-03:00  INFO 2140866 --- [           main] [71aea740-ab8b-4580-a059-cc19a5594d50] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/category/spending 200 24ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='NeutralImportIT#importMarksOnl` - exit 0

```
2026-11-19T23:15:10.752-03:00  INFO 2141380 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable resources capabilities, notification: true
2026-11-19T23:15:10.753-03:00  INFO 2141380 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable resources templates capabilities, notification: true
2026-11-19T23:15:10.754-03:00  INFO 2141380 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable prompts capabilities, notification: true
2026-11-19T23:15:10.755-03:00  INFO 2141380 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable completions capabilities
2026-11-19T23:15:10.881-03:00  INFO 2141380 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-19T23:15:10.881-03:00  INFO 2141380 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-19T23:15:10.883-03:00  INFO 2141380 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 2 ms
2026-11-19T23:15:10.936-03:00  INFO 2141380 --- [           main] [] c.l.f.transaction.NeutralImportIT        : Started NeutralImportIT in 8.99 seconds (process running for 10.208)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-19T23:15:11.679-03:00  INFO 2141380 --- [           main] [09ec925c-30e2-48a7-8889-fff978d38fa1] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/import 201 258ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='NeutralCandidatesIT#candidates` - exit 0

```
2026-11-19T23:15:37.771-03:00  INFO 2141912 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable resources templates capabilities, notification: true
2026-11-19T23:15:37.772-03:00  INFO 2141912 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable prompts capabilities, notification: true
2026-11-19T23:15:37.773-03:00  INFO 2141912 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable completions capabilities
2026-11-19T23:15:37.901-03:00  INFO 2141912 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-19T23:15:37.901-03:00  INFO 2141912 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-19T23:15:37.903-03:00  INFO 2141912 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 2 ms
2026-11-19T23:15:37.962-03:00  INFO 2141912 --- [           main] [] c.l.f.transaction.NeutralCandidatesIT    : Started NeutralCandidatesIT in 9.066 seconds (process running for 10.216)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-19T23:15:38.690-03:00  INFO 2141912 --- [           main] [44718004-38dc-4bba-8446-af49f5c00c0a] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/{id} 200 222ms userId=1 planId=1
2026-11-19T23:15:38.796-03:00  INFO 2141912 --- [           main] [b1e12bb3-2205-46dd-b2e8-fd62848a6cfb] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/neutral-candidates 200 101ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='NeutralCandidatesIT#applyingAC` - exit 0

```
2026-11-19T23:16:04.894-03:00  INFO 2142452 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-19T23:16:04.896-03:00  INFO 2142452 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-19T23:16:04.953-03:00  INFO 2142452 --- [           main] [] c.l.f.transaction.NeutralCandidatesIT    : Started NeutralCandidatesIT in 9.107 seconds (process running for 10.268)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-19T23:16:05.689-03:00  INFO 2142452 --- [           main] [0abf6477-f9e4-444a-8845-2c0967a5c2bb] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/dashboard 200 264ms userId=1 planId=1
2026-11-19T23:16:05.799-03:00  INFO 2142452 --- [           main] [f624a9a5-ed7f-42f7-8c1b-688801619438] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/{id}/kind 200 58ms userId=1 planId=1
2026-11-19T23:16:05.841-03:00  INFO 2142452 --- [           main] [66bf9399-60e5-4128-a67b-43cdd49b2ab8] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/dashboard 200 29ms userId=1 planId=1
2026-11-19T23:16:05.899-03:00  INFO 2142452 --- [           main] [304237a8-b272-4ad6-aa61-078692a775b1] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/neutral-candidates 200 55ms userId=1 planId=1
2026-11-19T23:16:05.929-03:00  INFO 2142452 --- [           main] [1c963aff-50ac-43c7-bc5e-07711ea01adb] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/{id}/kind 409 21ms userId=1 planId=1
2026-11-19T23:16:05.978-03:00  INFO 2142452 --- [           main] [ca779516-a5f0-4033-9119-5e2de6502b07] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/{id}/kind 200 17ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='NeutralCandidatesIT#reviewFoll` - exit 0

```
2026-11-19T23:16:32.395-03:00  INFO 2142962 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-19T23:16:32.396-03:00  INFO 2142962 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-19T23:16:32.458-03:00  INFO 2142962 --- [           main] [] c.l.f.transaction.NeutralCandidatesIT    : Started NeutralCandidatesIT in 9.072 seconds (process running for 10.335)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-19T23:16:33.226-03:00  INFO 2142962 --- [           main] [db3c2461-0d2c-4921-a435-992fbc32c5ac] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/neutral-candidates 200 284ms userId=2 planId=1
2026-11-19T23:16:33.266-03:00  INFO 2142962 --- [           main] [b709fddc-0bef-49e0-9f72-7ba574d685f0] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/neutral-candidates 200 28ms userId=1 planId=1
2026-11-19T23:16:33.357-03:00  INFO 2142962 --- [           main] [041e94cd-468b-49ae-9e76-22c9c26d9573] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/{id}/kind 403 40ms userId=2 planId=1
2026-11-19T23:16:33.419-03:00  INFO 2142962 --- [           main] [e0e27442-b052-440b-9090-7187aaeca926] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/{id}/kind 200 33ms userId=2 planId=1
2026-11-19T23:16:33.428-03:00  INFO 2142962 --- [           main] [24f45537-1356-42b4-ac29-84b7841b6982] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/neutral-candidates 404 7ms userId=3 planId=1
2026-11-19T23:16:33.436-03:00  INFO 2142962 --- [           main] [be82c98a-868a-4845-87fb-b90e44a87262] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/{id}/kind 404 5ms userId=3 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='PlanAuthorizationMatrixIT#neut` - exit 0

```
2026-11-19T23:17:01.411-03:00  INFO 2143486 --- [           main] [84770db4-a108-4194-bca9-55b6c170facb] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/invitation 201 13ms userId=37 planId=31
2026-11-19T23:17:01.440-03:00  INFO 2143486 --- [           main] [2cd8d8a2-ce8d-49c6-a19b-dbcf22045ac1] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/{id} 200 21ms userId=37 planId=31
2026-11-19T23:17:01.476-03:00  INFO 2143486 --- [           main] [0bf20afa-f701-432f-9c2e-b49196ee6d64] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/{id}/kind 200 29ms userId=38 planId=31
2026-11-19T23:17:01.566-03:00  INFO 2143486 --- [           main] [b60436f5-1025-4033-8995-f30066bf8c1b] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 19ms userId=43 planId=36
2026-11-19T23:17:01.580-03:00  INFO 2143486 --- [           main] [5104365f-6cb0-4a23-9f71-0938ee2830fd] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/invitation 201 12ms userId=43 planId=36
2026-11-19T23:17:01.601-03:00  INFO 2143486 --- [           main] [1c9fc7b5-cd92-4bb6-bfeb-f2209c82dc11] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/{id} 200 14ms userId=43 planId=36
2026-11-19T23:17:01.618-03:00  INFO 2143486 --- [           main] [4f00fbd4-ed24-4019-b8ee-05bfba33a3de] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/{id}/kind 403 13ms userId=45 planId=36
2026-11-19T23:17:01.711-03:00  INFO 2143486 --- [           main] [f837cd13-493f-43f2-a5b3-f7954f8a2c90] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 31ms userId=49 planId=41
2026-11-19T23:17:01.732-03:00  INFO 2143486 --- [           main] [fc303c50-fe50-4b36-abcb-1a80534c1159] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/invitation 201 19ms userId=49 planId=41
2026-11-19T23:17:01.764-03:00  INFO 2143486 --- [           main] [e68969c5-39f8-414b-b1c7-d1f5dae135ca] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/{id} 200 21ms userId=49 planId=41
2026-11-19T23:17:01.778-03:00  INFO 2143486 --- [           main] [6dfebe95-5a8b-4d4b-8588-9fe16da3814f] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/{id}/kind 403 8ms userId=52 planId=41
2026-11-19T23:17:01.832-03:00  INFO 2143486 --- [           main] [59ef803f-fd64-4b83-8e31-58cc7dc41347] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 15ms userId=55 planId=46
2026-11-19T23:17:01.840-03:00  INFO 2143486 --- [           main] [ad1d52ce-b351-42da-80f0-dbbea5f9a34f] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/invitation 201 6ms userId=55 planId=46
2026-11-19T23:17:01.851-03:00  INFO 2143486 --- [           main] [be398728-6b46-48d9-af22-5d9852289998] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/{id} 200 7ms userId=55 planId=46
2026-11-19T23:17:01.859-03:00  INFO 2143486 --- [           main] [9cad0915-61f7-431c-9945-91e9f9f304dd] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/{id}/kind 404 4ms userId=59 planId=46
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='NeutralMovementsIT#listFilterN` - exit 0

```
2026-11-19T23:17:28.345-03:00  INFO 2144005 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable prompts capabilities, notification: true
2026-11-19T23:17:28.347-03:00  INFO 2144005 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable completions capabilities
2026-11-19T23:17:28.472-03:00  INFO 2144005 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-19T23:17:28.472-03:00  INFO 2144005 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-19T23:17:28.473-03:00  INFO 2144005 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-19T23:17:28.526-03:00  INFO 2144005 --- [           main] [] c.l.f.transaction.NeutralMovementsIT     : Started NeutralMovementsIT in 9.365 seconds (process running for 10.513)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-19T23:17:29.282-03:00  INFO 2144005 --- [           main] [1e1ff4aa-3649-4a1d-9aec-d226bd8e6e7b] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction 200 283ms userId=1 planId=1
2026-11-19T23:17:29.321-03:00  INFO 2144005 --- [           main] [79a8df8d-0769-4de0-b0ba-06d279c78e21] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction 200 27ms userId=1 planId=1
2026-11-19T23:17:29.349-03:00  INFO 2144005 --- [           main] [a3790d3a-df5b-46c5-89b3-4fd1951ccf3b] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction 200 26ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpNeutralKindIT#createTakesTh` - exit 0

```
2026-11-19T23:17:56.499-03:00  INFO 2144528 --- [           main] [b06dec0d-70d5-45d2-b4a7-64349e5cbd6f] i.m.server.McpAsyncServer                : Client initialize request - Protocol: 2025-06-18, Capabilities: ClientCapabilities[experimental=null, roots=null, sampling=null, elicitation=null, extensions=null], Info: Implementation[name=test, title=null, version=1, description=null, icons=null, websiteUrl=null]
2026-11-19T23:17:56.519-03:00  INFO 2144528 --- [           main] [b06dec0d-70d5-45d2-b4a7-64349e5cbd6f] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 131ms userId=- planId=-
2026-11-19T23:17:56.530-03:00  INFO 2144528 --- [           main] [5c8e70dd-e1fe-4f92-8245-5bb052b0e4a5] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 7ms userId=- planId=-
2026-11-19T23:17:56.669-03:00  WARN 2144528 --- [           main] [c7e40f0c-bb6c-4250-b248-7ec89bb71fa9] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind)
2026-11-19T23:17:56.671-03:00  WARN 2144528 --- [           main] [c7e40f0c-bb6c-4250-b248-7ec89bb71fa9] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind)
2026-11-19T23:17:56.672-03:00  WARN 2144528 --- [           main] [c7e40f0c-bb6c-4250-b248-7ec89bb71fa9] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#items()
2026-11-19T23:17:56.672-03:00  WARN 2144528 --- [           main] [c7e40f0c-bb6c-4250-b248-7ec89bb71fa9] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-19T23:17:56.672-03:00  WARN 2144528 --- [           main] [c7e40f0c-bb6c-4250-b248-7ec89bb71fa9] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#participants()
2026-11-19T23:17:56.672-03:00  WARN 2144528 --- [           main] [c7e40f0c-bb6c-4250-b248-7ec89bb71fa9] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-19T23:17:56.696-03:00  INFO 2144528 --- [           main] [c7e40f0c-bb6c-4250-b248-7ec89bb71fa9] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=create_transaction user=1 plan=1 outcome=ok durationMs=147
2026-11-19T23:17:56.710-03:00  INFO 2144528 --- [           main] [c7e40f0c-bb6c-4250-b248-7ec89bb71fa9] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 179ms userId=- planId=-
2026-11-19T23:17:56.784-03:00  INFO 2144528 --- [           main] [d1f52699-b5ac-45dd-a7e7-bb299ea043cc] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=create_transaction user=1 plan=1 outcome=ok durationMs=69
2026-11-19T23:17:56.784-03:00  INFO 2144528 --- [           main] [d1f52699-b5ac-45dd-a7e7-bb299ea043cc] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 73ms userId=- planId=-
2026-11-19T23:17:56.810-03:00  INFO 2144528 --- [           main] [6d7afa5a-5f97-4888-a366-018491c2dc9e] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=create_transaction user=1 plan=1 outcome=error durationMs=20
2026-11-19T23:17:56.810-03:00  INFO 2144528 --- [           main] [6d7afa5a-5f97-4888-a366-018491c2dc9e] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 24ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpNeutralKindIT#updateAndList` - exit 0

```
2026-11-19T23:18:24.176-03:00  WARN 2145036 --- [           main] [1a58cce7-104d-4150-b061-f16171709582] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#items()
2026-11-19T23:18:24.176-03:00  WARN 2145036 --- [           main] [1a58cce7-104d-4150-b061-f16171709582] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-19T23:18:24.177-03:00  WARN 2145036 --- [           main] [1a58cce7-104d-4150-b061-f16171709582] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#com.lcs.findraco.transaction.request.UpdateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long)
2026-11-19T23:18:24.177-03:00  WARN 2145036 --- [           main] [1a58cce7-104d-4150-b061-f16171709582] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#com.lcs.findraco.transaction.request.UpdateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long)
2026-11-19T23:18:24.178-03:00  WARN 2145036 --- [           main] [1a58cce7-104d-4150-b061-f16171709582] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-19T23:18:24.223-03:00  INFO 2145036 --- [           main] [1a58cce7-104d-4150-b061-f16171709582] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=update_transaction user=1 plan=1 outcome=ok durationMs=185
2026-11-19T23:18:24.237-03:00  INFO 2145036 --- [           main] [1a58cce7-104d-4150-b061-f16171709582] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 215ms userId=- planId=-
2026-11-19T23:18:24.305-03:00  INFO 2145036 --- [           main] [c63791a4-7a06-4657-abee-155d3a2b9b64] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=list_transactions user=1 plan=1 outcome=ok durationMs=59
2026-11-19T23:18:24.306-03:00  INFO 2145036 --- [           main] [c63791a4-7a06-4657-abee-155d3a2b9b64] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 63ms userId=- planId=-
2026-11-19T23:18:24.315-03:00  INFO 2145036 --- [           main] [14e59f1a-0910-47c7-a900-4c85037fb612] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=update_transaction user=1 plan=1 outcome=error durationMs=5
2026-11-19T23:18:24.316-03:00  INFO 2145036 --- [           main] [14e59f1a-0910-47c7-a900-4c85037fb612] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 8ms userId=- planId=-
2026-11-19T23:18:24.383-03:00  INFO 2145036 --- [           main] [2279a634-1ea3-46af-a5b3-8fa66ff62d65] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=update_transaction user=1 plan=1 outcome=ok durationMs=22
2026-11-19T23:18:24.384-03:00  INFO 2145036 --- [           main] [2279a634-1ea3-46af-a5b3-8fa66ff62d65] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 25ms userId=- planId=-
2026-11-19T23:18:24.409-03:00  INFO 2145036 --- [           main] [299b935a-bf1c-477a-a52c-cfcfa6e231da] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=list_transactions user=1 plan=1 outcome=ok durationMs=21
2026-11-19T23:18:24.409-03:00  INFO 2145036 --- [           main] [299b935a-bf1c-477a-a52c-cfcfa6e231da] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 24ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpNeutralKindIT#summaryToolsU` - exit 0

```
2026-11-19T23:18:51.748-03:00  INFO 2145560 --- [           main] [e275ac8f-5bc5-4909-8f2d-20f8822bffe7] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 162ms userId=- planId=-
2026-11-19T23:18:51.760-03:00  INFO 2145560 --- [           main] [5c12d615-7d51-4640-a72e-29c1286a0b05] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 7ms userId=- planId=-
2026-11-19T23:18:51.938-03:00  WARN 2145560 --- [           main] [79675553-7bc1-42b7-a9b2-df15d02762ca] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-19T23:18:51.941-03:00  WARN 2145560 --- [           main] [79675553-7bc1-42b7-a9b2-df15d02762ca] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#items()
2026-11-19T23:18:51.941-03:00  WARN 2145560 --- [           main] [79675553-7bc1-42b7-a9b2-df15d02762ca] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-19T23:18:51.942-03:00  WARN 2145560 --- [           main] [79675553-7bc1-42b7-a9b2-df15d02762ca] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind)
2026-11-19T23:18:51.942-03:00  WARN 2145560 --- [           main] [79675553-7bc1-42b7-a9b2-df15d02762ca] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind)
2026-11-19T23:18:51.942-03:00  WARN 2145560 --- [           main] [79675553-7bc1-42b7-a9b2-df15d02762ca] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#participants()
2026-11-19T23:18:51.965-03:00  INFO 2145560 --- [           main] [79675553-7bc1-42b7-a9b2-df15d02762ca] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=create_transaction user=1 plan=1 outcome=ok durationMs=185
2026-11-19T23:18:51.978-03:00  INFO 2145560 --- [           main] [79675553-7bc1-42b7-a9b2-df15d02762ca] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 217ms userId=- planId=-
2026-11-19T23:18:52.124-03:00  INFO 2145560 --- [           main] [4da5feb1-40e9-4833-a28c-bc8345e5d151] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/dashboard 200 113ms userId=1 planId=1
2026-11-19T23:18:52.174-03:00  INFO 2145560 --- [           main] [9b843a31-ef81-42ae-b514-fb564b97481b] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=get_month_summary user=1 plan=1 outcome=ok durationMs=38
2026-11-19T23:18:52.174-03:00  INFO 2145560 --- [           main] [9b843a31-ef81-42ae-b514-fb564b97481b] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 42ms userId=- planId=-
2026-11-19T23:18:52.220-03:00  INFO 2145560 --- [           main] [ddfb5fac-a652-4271-842c-0c61b2f277ec] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=get_category_spending user=1 plan=1 outcome=ok durationMs=42
2026-11-19T23:18:52.221-03:00  INFO 2145560 --- [           main] [ddfb5fac-a652-4271-842c-0c61b2f277ec] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 45ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='MigrationsIT#transactionKindIs` - exit 0

```
2026-11-19T23:19:18.085-03:00  INFO 2146084 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Registered tools: 10
2026-11-19T23:19:18.085-03:00  INFO 2146084 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable resources capabilities, notification: true
2026-11-19T23:19:18.087-03:00  INFO 2146084 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable resources templates capabilities, notification: true
2026-11-19T23:19:18.088-03:00  INFO 2146084 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable prompts capabilities, notification: true
2026-11-19T23:19:18.089-03:00  INFO 2146084 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable completions capabilities
2026-11-19T23:19:18.216-03:00  INFO 2146084 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-19T23:19:18.216-03:00  INFO 2146084 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-19T23:19:18.217-03:00  INFO 2146084 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-19T23:19:18.295-03:00  INFO 2146084 --- [           main] [] com.lcs.findraco.MigrationsIT            : Started MigrationsIT in 8.985 seconds (process running for 10.24)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```
