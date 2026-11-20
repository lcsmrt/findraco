# neutral-movements proofs

**HEAD**: 45909c31
**Tree**: clean
**Shell**: /bin/sh
**Result**: 40 pass, 0 fail

| Check | Proof | Result |
| --- | --- | --- |
| C1 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='NeutralMovementsIT#neutralRows` | pass |
| C2 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='NeutralMovementsIT#neutralRows` | pass |
| C3 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='NeutralMovementsIT#neutralKind` | pass |
| C4 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='NeutralMovementsIT#neutralKind` | pass |
| C5 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='NeutralMovementsIT#dashboardRe` | pass |
| C6 | `run stories / ✓ src/features/overview/components/SummaryCards.stories.tsx > With Neutral Movements` | pass |
| C6 | `run stories / ✓ src/features/overview/components/SummaryCards.stories.tsx > Default` | pass |
| C28 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='NeutralMovementsIT#uncategoriz` | pass |
| C28 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpNeutralKindIT#uncategorized` | pass |
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
| C25 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='NeutralCandidatesIT#applyingRe` | pass |
| C26 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='NeutralMovementsIT#anyMemberCa` | pass |
| C26 | `run unit / ✓ TransactionFormDrawer > keeps the payer of a neutral row when another member saves it` | pass |
| C27 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='NeutralCandidatesIT#oneWordNam` | pass |
| C17 | `run unit / ✓ transactionForm > maps the movement kind both ways` | pass |
| C17 | `run unit / ✓ TransactionFormDrawer > saves a neutral kind without category or split` | pass |
| C17 | `run unit / ✓ TransactionFormDrawer > keeps the category of a refund, from the expense categories` | pass |
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
 ✓ |storybook (chromium)| src/features/transactions/components/TransactionCells.stories.tsx > Read Only 34ms

 Test Files  4 passed (4)
      Tests  34 passed (34)
   Start at  18:28:42
   Duration  3.37s (transform 0ms, setup 1.97s, collect 1.87s, tests 3.10s, environment 0ms, prepare 8.76s)

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

 ✓ |unit| src/features/transactions/TransactionsPage.test.tsx > TransactionsPage period navigator (PNAV-01, PNAV-02) > replaces a custom range with the This month preset (PNAV-03 AC 1) 168ms
stdout | src/features/transactions/TransactionsPage.test.tsx > TransactionsPage period navigator (PNAV-01, PNAV-02) > ignores the pre-feature from and to params and opens on the current month (PNAV-05)
Creating Table Instance...

 ✓ |unit| src/features/transactions/TransactionsPage.test.tsx > TransactionsPage period navigator (PNAV-01, PNAV-02) > keeps the period when all filters are cleared (PNAV-02 AC 4) 146ms
 ✓ |unit| src/features/transactions/TransactionsPage.test.tsx > TransactionsPage period navigator (PNAV-01, PNAV-02) > ignores the pre-feature from and to params and opens on the current month (PNAV-05) 42ms

 Test Files  4 passed (4)
      Tests  157 passed (157)
   Start at  18:28:47
   Duration  13.28s (transform 725ms, setup 399ms, collect 11.33s, tests 15.37s, environment 1.62s, prepare 166ms)

No story files found for the specified pattern: src/**/*.mdx
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='NeutralMovementsIT#neutralRows` - exit 0

```
2026-11-20T18:29:29.373-03:00  INFO 2205491 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable resources capabilities, notification: true
2026-11-20T18:29:29.374-03:00  INFO 2205491 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable resources templates capabilities, notification: true
2026-11-20T18:29:29.375-03:00  INFO 2205491 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable prompts capabilities, notification: true
2026-11-20T18:29:29.376-03:00  INFO 2205491 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable completions capabilities
2026-11-20T18:29:29.504-03:00  INFO 2205491 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-20T18:29:29.505-03:00  INFO 2205491 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-20T18:29:29.506-03:00  INFO 2205491 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-20T18:29:29.559-03:00  INFO 2205491 --- [           main] [] c.l.f.transaction.NeutralMovementsIT     : Started NeutralMovementsIT in 9.868 seconds (process running for 11.082)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-20T18:29:30.343-03:00  INFO 2205491 --- [           main] [88041909-c2c7-41a4-a04d-70e3c82cda49] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/dashboard 200 268ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='NeutralMovementsIT#neutralRows` - exit 0

```
2026-11-20T18:29:57.122-03:00  INFO 2206039 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable resources templates capabilities, notification: true
2026-11-20T18:29:57.123-03:00  INFO 2206039 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable prompts capabilities, notification: true
2026-11-20T18:29:57.124-03:00  INFO 2206039 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable completions capabilities
2026-11-20T18:29:57.278-03:00  INFO 2206039 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-20T18:29:57.279-03:00  INFO 2206039 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-20T18:29:57.280-03:00  INFO 2206039 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-20T18:29:57.337-03:00  INFO 2206039 --- [           main] [] c.l.f.transaction.NeutralMovementsIT     : Started NeutralMovementsIT in 9.393 seconds (process running for 10.549)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-20T18:29:58.062-03:00  INFO 2206039 --- [           main] [6ac26337-0bf5-486e-9fb5-8484d8e0e1c0] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/dashboard/trend 200 238ms userId=1 planId=1
2026-11-20T18:29:58.116-03:00  INFO 2206039 --- [           main] [6aefa75a-a465-40f6-8d2a-fad99573b30b] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/dashboard 200 45ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='NeutralMovementsIT#neutralKind` - exit 0

```
2026-11-20T18:30:24.822-03:00  INFO 2206580 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-20T18:30:24.823-03:00  INFO 2206580 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-20T18:30:24.879-03:00  INFO 2206580 --- [           main] [] c.l.f.transaction.NeutralMovementsIT     : Started NeutralMovementsIT in 9.367 seconds (process running for 10.625)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-20T18:30:25.649-03:00  INFO 2206580 --- [           main] [c1268b0f-25fe-44c9-b186-84dab6ec2bc2] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/category/spending 200 248ms userId=1 planId=1
2026-11-20T18:30:25.691-03:00  INFO 2206580 --- [           main] [7d2876f2-1c32-470e-bd95-4b6134e6ce59] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/category/spending 200 22ms userId=1 planId=1
2026-11-20T18:30:25.765-03:00  INFO 2206580 --- [           main] [65a5238f-260c-433c-a666-7a33263ff47c] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/category/spending 200 17ms userId=1 planId=1
2026-11-20T18:30:25.794-03:00  INFO 2206580 --- [           main] [ccc3e2b0-37b5-48c9-a98d-5e0744254a72] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/category/spending 200 20ms userId=1 planId=1
2026-11-20T18:30:25.821-03:00  INFO 2206580 --- [           main] [0cf1561f-f6aa-41d8-985e-1ad6f81c5c50] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/category/spending 200 25ms userId=1 planId=1
2026-11-20T18:30:25.847-03:00  INFO 2206580 --- [           main] [3aa399bf-6f9e-4aca-ab9c-82a3b6114356] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/category/spending 200 23ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='NeutralMovementsIT#neutralKind` - exit 0

```
2026-11-20T18:30:53.297-03:00  INFO 2207113 --- [           main] [b97abcd5-e8f3-4fc3-99bf-70916649d988] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/{id} 422 21ms userId=1 planId=1
2026-11-20T18:30:53.314-03:00  INFO 2207113 --- [           main] [cd968975-074e-4940-b745-9f12081c70c3] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 14ms userId=1 planId=1
2026-11-20T18:30:53.331-03:00  INFO 2207113 --- [           main] [0140a0f1-bc56-49d1-8814-cdd8b67b267b] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/{id} 422 14ms userId=1 planId=1
2026-11-20T18:30:53.342-03:00  INFO 2207113 --- [           main] [5f3efbee-35e3-4fd2-bea7-8d76077aba03] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 9ms userId=1 planId=1
2026-11-20T18:30:53.355-03:00  INFO 2207113 --- [           main] [3fa22d9c-3382-406c-828f-e72321eae17d] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/{id} 422 11ms userId=1 planId=1
2026-11-20T18:30:53.368-03:00  INFO 2207113 --- [           main] [e653a13c-ba39-4a3c-a59f-e960fc8a7765] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 11ms userId=1 planId=1
2026-11-20T18:30:53.382-03:00  INFO 2207113 --- [           main] [c589504b-04ad-4500-a368-042b13f9bb70] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/{id} 422 12ms userId=1 planId=1
2026-11-20T18:30:53.391-03:00  INFO 2207113 --- [           main] [b1e9eaee-ce6f-4022-8d06-18e9b039352d] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 8ms userId=1 planId=1
2026-11-20T18:30:53.406-03:00  INFO 2207113 --- [           main] [cdbabfc3-d027-4ea8-8835-cd012b7ee6ae] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/{id} 422 12ms userId=1 planId=1
2026-11-20T18:30:53.417-03:00  INFO 2207113 --- [           main] [74a82bfa-e918-48aa-85e3-faa0e1e645b5] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 9ms userId=1 planId=1
2026-11-20T18:30:53.430-03:00  INFO 2207113 --- [           main] [49aafc08-d6ef-4564-a807-9a79b932a4db] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/{id} 422 11ms userId=1 planId=1
2026-11-20T18:30:53.442-03:00  INFO 2207113 --- [           main] [f4561861-8bf5-48a0-9b77-454b9f318baf] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 10ms userId=1 planId=1
2026-11-20T18:30:53.458-03:00  INFO 2207113 --- [           main] [32113f63-44d6-40ac-9150-4a38662013f3] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/{id} 422 14ms userId=1 planId=1
2026-11-20T18:30:53.466-03:00  INFO 2207113 --- [           main] [5307fe28-57e6-4d81-8d7f-0ab0ab12018e] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 6ms userId=1 planId=1
2026-11-20T18:30:53.479-03:00  INFO 2207113 --- [           main] [21e21d7e-138b-4f73-9a64-64b9a78237d2] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/{id} 422 12ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='NeutralMovementsIT#dashboardRe` - exit 0

```
2026-11-20T18:31:20.515-03:00  INFO 2207637 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable resources templates capabilities, notification: true
2026-11-20T18:31:20.516-03:00  INFO 2207637 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable prompts capabilities, notification: true
2026-11-20T18:31:20.518-03:00  INFO 2207637 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable completions capabilities
2026-11-20T18:31:20.653-03:00  INFO 2207637 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-20T18:31:20.653-03:00  INFO 2207637 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-20T18:31:20.655-03:00  INFO 2207637 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 2 ms
2026-11-20T18:31:20.708-03:00  INFO 2207637 --- [           main] [] c.l.f.transaction.NeutralMovementsIT     : Started NeutralMovementsIT in 9.101 seconds (process running for 10.404)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-20T18:31:21.416-03:00  INFO 2207637 --- [           main] [71687a2f-4301-4d1c-8fd9-1d8aa70127d5] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/{id} 200 202ms userId=1 planId=1
2026-11-20T18:31:21.507-03:00  INFO 2207637 --- [           main] [13d93945-3f37-470f-9efb-96cac2d8e321] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/dashboard 200 85ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='NeutralMovementsIT#uncategoriz` - exit 0

```
2026-11-20T18:31:48.522-03:00  INFO 2208170 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable resources capabilities, notification: true
2026-11-20T18:31:48.524-03:00  INFO 2208170 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable resources templates capabilities, notification: true
2026-11-20T18:31:48.524-03:00  INFO 2208170 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable prompts capabilities, notification: true
2026-11-20T18:31:48.526-03:00  INFO 2208170 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable completions capabilities
2026-11-20T18:31:48.659-03:00  INFO 2208170 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-20T18:31:48.659-03:00  INFO 2208170 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-20T18:31:48.660-03:00  INFO 2208170 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-20T18:31:48.713-03:00  INFO 2208170 --- [           main] [] c.l.f.transaction.NeutralMovementsIT     : Started NeutralMovementsIT in 9.289 seconds (process running for 10.505)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-20T18:31:49.503-03:00  INFO 2208170 --- [           main] [226e5eb4-d554-4384-9ab8-e4082f08abe1] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction 200 300ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpNeutralKindIT#uncategorized` - exit 0

```
2026-11-20T18:32:16.943-03:00  INFO 2208685 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-20T18:32:16.943-03:00  INFO 2208685 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-20T18:32:16.944-03:00  INFO 2208685 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-20T18:32:17.002-03:00  INFO 2208685 --- [           main] [] com.lcs.findraco.mcp.McpNeutralKindIT    : Started McpNeutralKindIT in 9.599 seconds (process running for 10.861)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-20T18:32:17.571-03:00  INFO 2208685 --- [           main] [eee84e79-cbd7-452b-bf8b-8feff2f2b8cb] i.m.server.McpAsyncServer                : Client initialize request - Protocol: 2025-06-18, Capabilities: ClientCapabilities[experimental=null, roots=null, sampling=null, elicitation=null, extensions=null], Info: Implementation[name=test, title=null, version=1, description=null, icons=null, websiteUrl=null]
2026-11-20T18:32:17.591-03:00  INFO 2208685 --- [           main] [eee84e79-cbd7-452b-bf8b-8feff2f2b8cb] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 138ms userId=- planId=-
2026-11-20T18:32:17.602-03:00  INFO 2208685 --- [           main] [34b9b181-123e-46d4-9c05-26c60dd6466a] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 7ms userId=- planId=-
2026-11-20T18:32:17.800-03:00  INFO 2208685 --- [           main] [849bb684-c12e-4b89-a912-34e613c3054a] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=list_transactions user=1 plan=1 outcome=ok durationMs=181
2026-11-20T18:32:17.814-03:00  INFO 2208685 --- [           main] [849bb684-c12e-4b89-a912-34e613c3054a] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 210ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='NeutralMovementsIT#refundLower` - exit 0

```
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-20T18:32:45.877-03:00  INFO 2209216 --- [           main] [9570af0e-caae-4808-8861-8ff30b9c1078] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/dashboard 200 278ms userId=1 planId=1
2026-11-20T18:32:45.967-03:00  WARN 2209216 --- [           main] [55471704-f810-4b65-9594-f5615ec7b5b9] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind)
2026-11-20T18:32:45.969-03:00  WARN 2209216 --- [           main] [55471704-f810-4b65-9594-f5615ec7b5b9] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind)
2026-11-20T18:32:45.970-03:00  WARN 2209216 --- [           main] [55471704-f810-4b65-9594-f5615ec7b5b9] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-20T18:32:45.970-03:00  WARN 2209216 --- [           main] [55471704-f810-4b65-9594-f5615ec7b5b9] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#participants()
2026-11-20T18:32:45.971-03:00  WARN 2209216 --- [           main] [55471704-f810-4b65-9594-f5615ec7b5b9] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#items()
2026-11-20T18:32:45.971-03:00  WARN 2209216 --- [           main] [55471704-f810-4b65-9594-f5615ec7b5b9] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-20T18:32:46.003-03:00  INFO 2209216 --- [           main] [55471704-f810-4b65-9594-f5615ec7b5b9] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 64ms userId=1 planId=1
2026-11-20T18:32:46.033-03:00  INFO 2209216 --- [           main] [271bf164-40ae-4511-8383-78732735cac6] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/dashboard 200 29ms userId=1 planId=1
2026-11-20T18:32:46.103-03:00  INFO 2209216 --- [           main] [7ced41ca-9879-4139-996e-572f33a488f3] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/category/spending 200 67ms userId=1 planId=1
2026-11-20T18:32:46.122-03:00  INFO 2209216 --- [           main] [7e3e85c6-4a37-4e8a-aeac-0444608e6c49] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/dashboard/trend 200 17ms userId=1 planId=1
2026-11-20T18:32:46.134-03:00  INFO 2209216 --- [           main] [b6757f13-7400-4f17-9af1-11605c092072] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/dashboard/trend 200 11ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='NeutralMovementsIT#refundLower` - exit 0

```
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-20T18:33:13.788-03:00  INFO 2209741 --- [           main] [cccce9b4-b22e-482b-b6d5-18ceb89afbc3] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/dashboard 200 288ms userId=1 planId=1
2026-11-20T18:33:13.879-03:00  WARN 2209741 --- [           main] [b904b339-5027-4fef-9e4d-5be671b50573] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#participants()
2026-11-20T18:33:13.882-03:00  WARN 2209741 --- [           main] [b904b339-5027-4fef-9e4d-5be671b50573] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-20T18:33:13.882-03:00  WARN 2209741 --- [           main] [b904b339-5027-4fef-9e4d-5be671b50573] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#items()
2026-11-20T18:33:13.882-03:00  WARN 2209741 --- [           main] [b904b339-5027-4fef-9e4d-5be671b50573] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind)
2026-11-20T18:33:13.882-03:00  WARN 2209741 --- [           main] [b904b339-5027-4fef-9e4d-5be671b50573] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind)
2026-11-20T18:33:13.883-03:00  WARN 2209741 --- [           main] [b904b339-5027-4fef-9e4d-5be671b50573] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-20T18:33:13.942-03:00  INFO 2209741 --- [           main] [b904b339-5027-4fef-9e4d-5be671b50573] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 88ms userId=1 planId=1
2026-11-20T18:33:13.979-03:00  INFO 2209741 --- [           main] [341acb44-68e0-4acd-bf4e-3cbca0aaf06d] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/dashboard 200 34ms userId=1 planId=1
2026-11-20T18:33:14.046-03:00  INFO 2209741 --- [           main] [02dc2f4b-92f9-40d5-9713-eb4920d7ca12] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/category/spending 200 65ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='NeutralMovementsIT#refundNeeds` - exit 0

```
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-20T18:33:41.587-03:00  WARN 2210270 --- [           main] [3b4a5b57-1929-4846-ad7b-a9c061351074] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-20T18:33:41.591-03:00  WARN 2210270 --- [           main] [3b4a5b57-1929-4846-ad7b-a9c061351074] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind)
2026-11-20T18:33:41.591-03:00  WARN 2210270 --- [           main] [3b4a5b57-1929-4846-ad7b-a9c061351074] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind)
2026-11-20T18:33:41.591-03:00  WARN 2210270 --- [           main] [3b4a5b57-1929-4846-ad7b-a9c061351074] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#participants()
2026-11-20T18:33:41.591-03:00  WARN 2210270 --- [           main] [3b4a5b57-1929-4846-ad7b-a9c061351074] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-20T18:33:41.591-03:00  WARN 2210270 --- [           main] [3b4a5b57-1929-4846-ad7b-a9c061351074] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#items()
2026-11-20T18:33:41.690-03:00  INFO 2210270 --- [           main] [3b4a5b57-1929-4846-ad7b-a9c061351074] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 214ms userId=1 planId=1
2026-11-20T18:33:41.734-03:00  INFO 2210270 --- [           main] [0f0f0fad-94c7-4e76-8683-22bf4d2ac647] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 18ms userId=1 planId=1
2026-11-20T18:33:41.744-03:00  INFO 2210270 --- [           main] [4474fc5b-5398-4632-945d-415ae617dae6] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 8ms userId=1 planId=1
2026-11-20T18:33:41.849-03:00  INFO 2210270 --- [           main] [87f530cc-b101-431f-a767-ed7b411c8ccb] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 31ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='NeutralMovementsIT#limitIsMeas` - exit 0

```
2026-11-20T18:34:08.712-03:00  INFO 2210791 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable resources templates capabilities, notification: true
2026-11-20T18:34:08.713-03:00  INFO 2210791 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable prompts capabilities, notification: true
2026-11-20T18:34:08.714-03:00  INFO 2210791 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable completions capabilities
2026-11-20T18:34:08.856-03:00  INFO 2210791 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-20T18:34:08.856-03:00  INFO 2210791 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-20T18:34:08.858-03:00  INFO 2210791 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 2 ms
2026-11-20T18:34:08.914-03:00  INFO 2210791 --- [           main] [] c.l.f.transaction.NeutralMovementsIT     : Started NeutralMovementsIT in 9.319 seconds (process running for 10.618)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-20T18:34:09.692-03:00  INFO 2210791 --- [           main] [b000734f-3115-4260-9434-74284a7aef11] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/category/spending 200 266ms userId=1 planId=1
2026-11-20T18:34:09.773-03:00  INFO 2210791 --- [           main] [e45e6631-d721-4096-ad86-e7d0d98b85ef] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/category/spending 200 21ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='NeutralImportIT#importMarksOnl` - exit 0

```
2026-11-20T18:34:36.005-03:00  INFO 2211307 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable resources capabilities, notification: true
2026-11-20T18:34:36.007-03:00  INFO 2211307 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable resources templates capabilities, notification: true
2026-11-20T18:34:36.008-03:00  INFO 2211307 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable prompts capabilities, notification: true
2026-11-20T18:34:36.009-03:00  INFO 2211307 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable completions capabilities
2026-11-20T18:34:36.144-03:00  INFO 2211307 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-20T18:34:36.144-03:00  INFO 2211307 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-20T18:34:36.145-03:00  INFO 2211307 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-20T18:34:36.203-03:00  INFO 2211307 --- [           main] [] c.l.f.transaction.NeutralImportIT        : Started NeutralImportIT in 9.145 seconds (process running for 10.401)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-20T18:34:36.934-03:00  INFO 2211307 --- [           main] [bdd56150-ea65-43d2-bf45-24dfa43baf65] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/import 201 278ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='NeutralCandidatesIT#candidates` - exit 0

```
2026-11-20T18:35:03.793-03:00  INFO 2211816 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable resources templates capabilities, notification: true
2026-11-20T18:35:03.794-03:00  INFO 2211816 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable prompts capabilities, notification: true
2026-11-20T18:35:03.795-03:00  INFO 2211816 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable completions capabilities
2026-11-20T18:35:03.935-03:00  INFO 2211816 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-20T18:35:03.935-03:00  INFO 2211816 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-20T18:35:03.937-03:00  INFO 2211816 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 2 ms
2026-11-20T18:35:03.993-03:00  INFO 2211816 --- [           main] [] c.l.f.transaction.NeutralCandidatesIT    : Started NeutralCandidatesIT in 9.221 seconds (process running for 10.495)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-20T18:35:04.708-03:00  INFO 2211816 --- [           main] [ae8cfa46-a8af-4ce7-a87d-88b2bdef11f8] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/{id} 200 203ms userId=1 planId=1
2026-11-20T18:35:04.805-03:00  INFO 2211816 --- [           main] [9bd1d8dd-d8a3-47a3-9f09-0a8d54a91449] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/neutral-candidates 200 92ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='NeutralCandidatesIT#applyingAC` - exit 0

```
2026-11-20T18:35:31.979-03:00  INFO 2212348 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-20T18:35:31.980-03:00  INFO 2212348 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-20T18:35:32.035-03:00  INFO 2212348 --- [           main] [] c.l.f.transaction.NeutralCandidatesIT    : Started NeutralCandidatesIT in 9.32 seconds (process running for 10.568)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-20T18:35:32.849-03:00  INFO 2212348 --- [           main] [32b61d1f-8777-42e4-8b79-f7b6ca544f74] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/dashboard 200 293ms userId=1 planId=1
2026-11-20T18:35:32.988-03:00  INFO 2212348 --- [           main] [d13b490d-edf5-4b69-9a8b-bc509e287bc9] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/{id}/kind 200 74ms userId=1 planId=1
2026-11-20T18:35:33.029-03:00  INFO 2212348 --- [           main] [8bd04655-076d-4bad-bcab-a9c08f7595aa] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/dashboard 200 28ms userId=1 planId=1
2026-11-20T18:35:33.093-03:00  INFO 2212348 --- [           main] [f83fa396-2d84-4570-b93c-050eb3babf42] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/neutral-candidates 200 63ms userId=1 planId=1
2026-11-20T18:35:33.123-03:00  INFO 2212348 --- [           main] [9f990c6b-01a6-4797-a954-bc7a66127527] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/{id}/kind 409 20ms userId=1 planId=1
2026-11-20T18:35:33.175-03:00  INFO 2212348 --- [           main] [2a0e7341-85e2-4d18-b230-47912e659b72] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/{id}/kind 200 17ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='NeutralCandidatesIT#reviewFoll` - exit 0

```
2026-11-20T18:36:00.158-03:00  INFO 2212869 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-20T18:36:00.160-03:00  INFO 2212869 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 2 ms
2026-11-20T18:36:00.223-03:00  INFO 2212869 --- [           main] [] c.l.f.transaction.NeutralCandidatesIT    : Started NeutralCandidatesIT in 9.253 seconds (process running for 10.518)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-20T18:36:00.987-03:00  INFO 2212869 --- [           main] [28e280de-983a-4d76-9de9-ba803d16a269] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/neutral-candidates 200 279ms userId=2 planId=1
2026-11-20T18:36:01.034-03:00  INFO 2212869 --- [           main] [99993c7a-5b32-4403-bf5a-487f60658f17] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/neutral-candidates 200 36ms userId=1 planId=1
2026-11-20T18:36:01.142-03:00  INFO 2212869 --- [           main] [875a61a2-f6b9-4d90-a170-fa362b5295cf] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/{id}/kind 403 39ms userId=2 planId=1
2026-11-20T18:36:01.204-03:00  INFO 2212869 --- [           main] [58346369-16f3-4255-b885-fe654e918150] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/{id}/kind 200 30ms userId=2 planId=1
2026-11-20T18:36:01.214-03:00  INFO 2212869 --- [           main] [5b68a22b-6923-44f6-a48b-75c3d526b5c4] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/neutral-candidates 404 8ms userId=3 planId=1
2026-11-20T18:36:01.223-03:00  INFO 2212869 --- [           main] [f48ddcfe-44d9-41cd-856f-9d14f830f7ca] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/{id}/kind 404 7ms userId=3 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='PlanAuthorizationMatrixIT#neut` - exit 0

```
2026-11-20T18:36:30.269-03:00  INFO 2213383 --- [           main] [b13c94d5-1b50-4d3b-a5c6-516522b5e264] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/invitation 201 8ms userId=37 planId=31
2026-11-20T18:36:30.289-03:00  INFO 2213383 --- [           main] [39ecd715-89a6-4665-9d63-1b1073adf2a5] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/{id} 200 13ms userId=37 planId=31
2026-11-20T18:36:30.310-03:00  INFO 2213383 --- [           main] [d171c3bc-1466-41ac-a516-864d38cacf8d] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/{id}/kind 200 17ms userId=38 planId=31
2026-11-20T18:36:30.398-03:00  INFO 2213383 --- [           main] [bd21b14e-2609-4357-8142-f098c51c77a7] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 26ms userId=43 planId=36
2026-11-20T18:36:30.408-03:00  INFO 2213383 --- [           main] [12799298-81a0-4065-a267-1ca136722768] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/invitation 201 8ms userId=43 planId=36
2026-11-20T18:36:30.431-03:00  INFO 2213383 --- [           main] [d487b262-3d29-4525-9996-c8a62939dcef] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/{id} 200 18ms userId=43 planId=36
2026-11-20T18:36:30.457-03:00  INFO 2213383 --- [           main] [ae9643cf-4e1f-4104-97ed-34198811525d] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/{id}/kind 403 18ms userId=45 planId=36
2026-11-20T18:36:30.542-03:00  INFO 2213383 --- [           main] [d04442f0-67b0-402f-bf86-4e82d4bdc2a0] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 14ms userId=49 planId=41
2026-11-20T18:36:30.551-03:00  INFO 2213383 --- [           main] [147ace83-8fe0-4e56-8eae-6cb691cafd6e] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/invitation 201 6ms userId=49 planId=41
2026-11-20T18:36:30.562-03:00  INFO 2213383 --- [           main] [742eea13-bcfb-4d2b-8559-7bdd681f933b] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/{id} 200 7ms userId=49 planId=41
2026-11-20T18:36:30.574-03:00  INFO 2213383 --- [           main] [6a47f372-f7cd-4637-98c0-dd5be565fa84] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/{id}/kind 403 9ms userId=52 planId=41
2026-11-20T18:36:30.667-03:00  INFO 2213383 --- [           main] [2823200b-9514-41a7-87f5-b9ae7cac7dc9] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 13ms userId=55 planId=46
2026-11-20T18:36:30.676-03:00  INFO 2213383 --- [           main] [709ea4aa-16ce-4dea-9a28-5d28f0b09a46] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/invitation 201 8ms userId=55 planId=46
2026-11-20T18:36:30.707-03:00  INFO 2213383 --- [           main] [3d608208-7ef0-4383-92d4-a3225eb79349] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/{id} 200 22ms userId=55 planId=46
2026-11-20T18:36:30.727-03:00  INFO 2213383 --- [           main] [34b5b16e-3e64-4644-80ac-e65c8991a215] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/{id}/kind 404 12ms userId=59 planId=46
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='NeutralCandidatesIT#applyingRe` - exit 0

```
2026-11-20T18:36:58.104-03:00  INFO 2213902 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-20T18:36:58.104-03:00  INFO 2213902 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-20T18:36:58.106-03:00  INFO 2213902 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 2 ms
2026-11-20T18:36:58.160-03:00  INFO 2213902 --- [           main] [] c.l.f.transaction.NeutralCandidatesIT    : Started NeutralCandidatesIT in 9.619 seconds (process running for 10.939)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-20T18:36:58.931-03:00  INFO 2213902 --- [           main] [145814e3-4da4-4a6c-ada5-7a5add682691] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/neutral-candidates 200 278ms userId=1 planId=1
2026-11-20T18:36:59.068-03:00  INFO 2213902 --- [           main] [31ffbdf4-3d93-4d1a-893f-1c5d25794739] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/category/spending 200 68ms userId=1 planId=1
2026-11-20T18:36:59.125-03:00  INFO 2213902 --- [           main] [d5f19301-b960-45af-bfe2-f3d6b4e6cef7] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/{id}/kind 200 48ms userId=1 planId=1
2026-11-20T18:36:59.144-03:00  INFO 2213902 --- [           main] [44cbcef5-ad6f-427a-a2f4-529efaa098a8] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/neutral-candidates 200 15ms userId=1 planId=1
2026-11-20T18:36:59.172-03:00  INFO 2213902 --- [           main] [a40d509b-3899-4249-80b7-bc4ddb225e6b] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/category/spending 200 26ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='NeutralMovementsIT#anyMemberCa` - exit 0

```
2026-11-20T18:37:26.254-03:00  INFO 2214430 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 2 ms
2026-11-20T18:37:26.316-03:00  INFO 2214430 --- [           main] [] c.l.f.transaction.NeutralMovementsIT     : Started NeutralMovementsIT in 9.153 seconds (process running for 10.376)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-20T18:37:26.905-03:00  WARN 2214430 --- [           main] [2b27873f-09c0-4922-b41c-574aa264fd9e] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#com.lcs.findraco.transaction.request.UpdateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long)
2026-11-20T18:37:26.908-03:00  WARN 2214430 --- [           main] [2b27873f-09c0-4922-b41c-574aa264fd9e] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#com.lcs.findraco.transaction.request.UpdateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long)
2026-11-20T18:37:26.908-03:00  WARN 2214430 --- [           main] [2b27873f-09c0-4922-b41c-574aa264fd9e] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#items()
2026-11-20T18:37:26.909-03:00  WARN 2214430 --- [           main] [2b27873f-09c0-4922-b41c-574aa264fd9e] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-20T18:37:26.909-03:00  WARN 2214430 --- [           main] [2b27873f-09c0-4922-b41c-574aa264fd9e] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#participants()
2026-11-20T18:37:26.909-03:00  WARN 2214430 --- [           main] [2b27873f-09c0-4922-b41c-574aa264fd9e] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-20T18:37:27.077-03:00  INFO 2214430 --- [           main] [2b27873f-09c0-4922-b41c-574aa264fd9e] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/{id} 200 285ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='NeutralCandidatesIT#oneWordNam` - exit 0

```
2026-11-20T18:37:53.568-03:00  INFO 2214936 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable resources capabilities, notification: true
2026-11-20T18:37:53.569-03:00  INFO 2214936 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable resources templates capabilities, notification: true
2026-11-20T18:37:53.570-03:00  INFO 2214936 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable prompts capabilities, notification: true
2026-11-20T18:37:53.571-03:00  INFO 2214936 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable completions capabilities
2026-11-20T18:37:53.697-03:00  INFO 2214936 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-20T18:37:53.697-03:00  INFO 2214936 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-20T18:37:53.699-03:00  INFO 2214936 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-20T18:37:53.762-03:00  INFO 2214936 --- [           main] [] c.l.f.transaction.NeutralCandidatesIT    : Started NeutralCandidatesIT in 9.336 seconds (process running for 10.563)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
2026-11-20T18:37:54.514-03:00  INFO 2214936 --- [           main] [1113f509-2356-4a05-9510-ee731a6cb6ae] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/neutral-candidates 200 275ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='NeutralMovementsIT#listFilterN` - exit 0

```
2026-11-20T18:38:21.259-03:00  INFO 2215447 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable prompts capabilities, notification: true
2026-11-20T18:38:21.260-03:00  INFO 2215447 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable completions capabilities
2026-11-20T18:38:21.395-03:00  INFO 2215447 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-20T18:38:21.395-03:00  INFO 2215447 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-20T18:38:21.397-03:00  INFO 2215447 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-20T18:38:21.450-03:00  INFO 2215447 --- [           main] [] c.l.f.transaction.NeutralMovementsIT     : Started NeutralMovementsIT in 9.251 seconds (process running for 10.582)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-20T18:38:22.269-03:00  INFO 2215447 --- [           main] [4b8a9aa7-8c18-436c-9f36-74214e821d79] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction 200 317ms userId=1 planId=1
2026-11-20T18:38:22.318-03:00  INFO 2215447 --- [           main] [6776fdfa-82c1-4d19-9c13-d10698c2d9c0] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction 200 37ms userId=1 planId=1
2026-11-20T18:38:22.350-03:00  INFO 2215447 --- [           main] [77a4f381-0ce2-42c0-ae26-cea525d6f957] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction 200 30ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpNeutralKindIT#createTakesTh` - exit 0

```
2026-11-20T18:38:50.239-03:00  INFO 2215960 --- [           main] [bda8765e-3533-48f4-bc36-34b568fa3f02] i.m.server.McpAsyncServer                : Client initialize request - Protocol: 2025-06-18, Capabilities: ClientCapabilities[experimental=null, roots=null, sampling=null, elicitation=null, extensions=null], Info: Implementation[name=test, title=null, version=1, description=null, icons=null, websiteUrl=null]
2026-11-20T18:38:50.260-03:00  INFO 2215960 --- [           main] [bda8765e-3533-48f4-bc36-34b568fa3f02] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 138ms userId=- planId=-
2026-11-20T18:38:50.270-03:00  INFO 2215960 --- [           main] [593e4b65-014e-439e-a0dc-08218b025f77] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 7ms userId=- planId=-
2026-11-20T18:38:50.410-03:00  WARN 2215960 --- [           main] [a8235b31-2639-47be-8b14-47acfd9d4f48] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#items()
2026-11-20T18:38:50.413-03:00  WARN 2215960 --- [           main] [a8235b31-2639-47be-8b14-47acfd9d4f48] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-20T18:38:50.413-03:00  WARN 2215960 --- [           main] [a8235b31-2639-47be-8b14-47acfd9d4f48] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#participants()
2026-11-20T18:38:50.413-03:00  WARN 2215960 --- [           main] [a8235b31-2639-47be-8b14-47acfd9d4f48] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-20T18:38:50.413-03:00  WARN 2215960 --- [           main] [a8235b31-2639-47be-8b14-47acfd9d4f48] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind)
2026-11-20T18:38:50.414-03:00  WARN 2215960 --- [           main] [a8235b31-2639-47be-8b14-47acfd9d4f48] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind)
2026-11-20T18:38:50.441-03:00  INFO 2215960 --- [           main] [a8235b31-2639-47be-8b14-47acfd9d4f48] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=create_transaction user=1 plan=1 outcome=ok durationMs=147
2026-11-20T18:38:50.455-03:00  INFO 2215960 --- [           main] [a8235b31-2639-47be-8b14-47acfd9d4f48] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 183ms userId=- planId=-
2026-11-20T18:38:50.535-03:00  INFO 2215960 --- [           main] [bf5c0ff4-3401-48d6-9a77-c3b039c1e46d] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=create_transaction user=1 plan=1 outcome=ok durationMs=75
2026-11-20T18:38:50.535-03:00  INFO 2215960 --- [           main] [bf5c0ff4-3401-48d6-9a77-c3b039c1e46d] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 79ms userId=- planId=-
2026-11-20T18:38:50.561-03:00  INFO 2215960 --- [           main] [abe3a08f-89ee-4c24-9481-e75440115c77] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=create_transaction user=1 plan=1 outcome=error durationMs=22
2026-11-20T18:38:50.562-03:00  INFO 2215960 --- [           main] [abe3a08f-89ee-4c24-9481-e75440115c77] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 25ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpNeutralKindIT#updateAndList` - exit 0

```
2026-11-20T18:39:18.461-03:00  WARN 2216476 --- [           main] [0289729c-607c-4870-9741-c571cad4d3dd] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-20T18:39:18.462-03:00  WARN 2216476 --- [           main] [0289729c-607c-4870-9741-c571cad4d3dd] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#com.lcs.findraco.transaction.request.UpdateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long)
2026-11-20T18:39:18.462-03:00  WARN 2216476 --- [           main] [0289729c-607c-4870-9741-c571cad4d3dd] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#com.lcs.findraco.transaction.request.UpdateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind, Long)
2026-11-20T18:39:18.462-03:00  WARN 2216476 --- [           main] [0289729c-607c-4870-9741-c571cad4d3dd] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-20T18:39:18.463-03:00  WARN 2216476 --- [           main] [0289729c-607c-4870-9741-c571cad4d3dd] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#participants()
2026-11-20T18:39:18.507-03:00  INFO 2216476 --- [           main] [0289729c-607c-4870-9741-c571cad4d3dd] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=update_transaction user=1 plan=1 outcome=ok durationMs=199
2026-11-20T18:39:18.521-03:00  INFO 2216476 --- [           main] [0289729c-607c-4870-9741-c571cad4d3dd] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 231ms userId=- planId=-
2026-11-20T18:39:18.594-03:00  INFO 2216476 --- [           main] [d11b07be-82c7-46eb-8b28-a4f11199d928] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=list_transactions user=1 plan=1 outcome=ok durationMs=62
2026-11-20T18:39:18.595-03:00  INFO 2216476 --- [           main] [d11b07be-82c7-46eb-8b28-a4f11199d928] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 67ms userId=- planId=-
2026-11-20T18:39:18.606-03:00  INFO 2216476 --- [           main] [d245aa37-5daf-4fcb-9953-fd87ff179193] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=update_transaction user=1 plan=1 outcome=error durationMs=7
2026-11-20T18:39:18.607-03:00  INFO 2216476 --- [           main] [d245aa37-5daf-4fcb-9953-fd87ff179193] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 10ms userId=- planId=-
2026-11-20T18:39:18.678-03:00  INFO 2216476 --- [           main] [de033301-76d8-4879-af01-baad51ee66ef] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=update_transaction user=1 plan=1 outcome=ok durationMs=24
2026-11-20T18:39:18.679-03:00  INFO 2216476 --- [           main] [de033301-76d8-4879-af01-baad51ee66ef] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 28ms userId=- planId=-
2026-11-20T18:39:18.706-03:00  INFO 2216476 --- [           main] [e18a5637-af92-4a1f-ad7f-192562977081] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=list_transactions user=1 plan=1 outcome=ok durationMs=22
2026-11-20T18:39:18.706-03:00  INFO 2216476 --- [           main] [e18a5637-af92-4a1f-ad7f-192562977081] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 26ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpNeutralKindIT#summaryToolsU` - exit 0

```
2026-11-20T18:39:46.690-03:00  INFO 2216996 --- [           main] [d8a9d7a2-fd50-41de-9196-cf7fca9204f0] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 136ms userId=- planId=-
2026-11-20T18:39:46.701-03:00  INFO 2216996 --- [           main] [de793bb4-edd6-4ba0-9dd9-cc0b2bb875eb] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 7ms userId=- planId=-
2026-11-20T18:39:46.900-03:00  WARN 2216996 --- [           main] [55bcd3e3-b6c7-4fc7-9e78-7ea7cb0eb6f8] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind)
2026-11-20T18:39:46.904-03:00  WARN 2216996 --- [           main] [55bcd3e3-b6c7-4fc7-9e78-7ea7cb0eb6f8] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, TransactionKind)
2026-11-20T18:39:46.905-03:00  WARN 2216996 --- [           main] [55bcd3e3-b6c7-4fc7-9e78-7ea7cb0eb6f8] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-20T18:39:46.905-03:00  WARN 2216996 --- [           main] [55bcd3e3-b6c7-4fc7-9e78-7ea7cb0eb6f8] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#participants()
2026-11-20T18:39:46.905-03:00  WARN 2216996 --- [           main] [55bcd3e3-b6c7-4fc7-9e78-7ea7cb0eb6f8] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-20T18:39:46.906-03:00  WARN 2216996 --- [           main] [55bcd3e3-b6c7-4fc7-9e78-7ea7cb0eb6f8] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#items()
2026-11-20T18:39:46.931-03:00  INFO 2216996 --- [           main] [55bcd3e3-b6c7-4fc7-9e78-7ea7cb0eb6f8] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=create_transaction user=1 plan=1 outcome=ok durationMs=211
2026-11-20T18:39:46.944-03:00  INFO 2216996 --- [           main] [55bcd3e3-b6c7-4fc7-9e78-7ea7cb0eb6f8] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 242ms userId=- planId=-
2026-11-20T18:39:47.083-03:00  INFO 2216996 --- [           main] [82bb4bc2-74b6-42b7-95ba-f73c66298aab] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/dashboard 200 107ms userId=1 planId=1
2026-11-20T18:39:47.131-03:00  INFO 2216996 --- [           main] [0bc2aad9-5b99-4fac-9200-64d67054cf5c] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=get_month_summary user=1 plan=1 outcome=ok durationMs=36
2026-11-20T18:39:47.131-03:00  INFO 2216996 --- [           main] [0bc2aad9-5b99-4fac-9200-64d67054cf5c] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 40ms userId=- planId=-
2026-11-20T18:39:47.182-03:00  INFO 2216996 --- [           main] [31efe3c6-ea10-45cf-b5af-4130b7f72a4b] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=get_category_spending user=1 plan=1 outcome=ok durationMs=46
2026-11-20T18:39:47.182-03:00  INFO 2216996 --- [           main] [31efe3c6-ea10-45cf-b5af-4130b7f72a4b] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 49ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='MigrationsIT#transactionKindIs` - exit 0

```
2026-11-20T18:40:13.900-03:00  INFO 2217511 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Registered tools: 10
2026-11-20T18:40:13.901-03:00  INFO 2217511 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable resources capabilities, notification: true
2026-11-20T18:40:13.902-03:00  INFO 2217511 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable resources templates capabilities, notification: true
2026-11-20T18:40:13.903-03:00  INFO 2217511 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable prompts capabilities, notification: true
2026-11-20T18:40:13.904-03:00  INFO 2217511 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable completions capabilities
2026-11-20T18:40:14.037-03:00  INFO 2217511 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-20T18:40:14.037-03:00  INFO 2217511 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-20T18:40:14.038-03:00  INFO 2217511 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-20T18:40:14.096-03:00  INFO 2217511 --- [           main] [] com.lcs.findraco.MigrationsIT            : Started MigrationsIT in 9.248 seconds (process running for 10.439)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
```
