# mcp-capture-hub proofs

**HEAD**: 3078ae4f
**Tree**: clean
**Shell**: /bin/sh
**Result**: 27 pass, 0 fail

| Check | Proof | Result |
| --- | --- | --- |
| C1 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureHubIT#createWithoutN` | pass |
| C2 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureHubIT#createForOneNa` | pass |
| C3 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureHubIT#createForSever` | pass |
| C4 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureHubIT#createWithAnUn` | pass |
| C5 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureHubIT#createForSomeo` | pass |
| C6 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureToolsIT#createSchema` | pass |
| C26 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureHubIT#contributorCan` | pass |
| C7 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureHubIT#updateWithCate` | pass |
| C8 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureHubIT#updateWithRemo` | pass |
| C9 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureHubIT#updateWithCate` | pass |
| C10 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureHubIT#updateWithACat` | pass |
| C11 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionListFilterIT#uncate` | pass |
| C12 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureHubIT#listUncategori` | pass |
| C13 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionListFilterIT#status` | pass |
| C14 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureHubIT#listPendingRet` | pass |
| C15 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionListFilterIT#invali` | pass |
| C16 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureHubIT#listUncategori` | pass |
| C17 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureHubIT#listedRowsCarr` | pass |
| C25 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureHubIT#updateOfARowSh` | pass |
| C18 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureHubIT#deleteASingleR` | pass |
| C19 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureHubIT#deleteAnOccurr` | pass |
| C20 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureHubIT#restoreDeletio` | pass |
| C21 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureHubIT#deleteToolIsDe` | pass |
| C22 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureHubIT#deleteFollowsT` | pass |
| C23 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='OpenApiSnapshotIT#theGenerated` | pass |
| C24 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionListFilterIT#filter` | pass |
| Build | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -DskipITs -Dsurefire.skip=true` | pass |

## Output

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureHubIT#createWithoutN` - exit 0

```
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-19T01:18:23.885-03:00  INFO 1968623 --- [           main] [955855b2-33f0-49a1-8b9e-9fd8df742b2b] i.m.server.McpAsyncServer                : Client initialize request - Protocol: 2025-06-18, Capabilities: ClientCapabilities[experimental=null, roots=null, sampling=null, elicitation=null, extensions=null], Info: Implementation[name=test, title=null, version=1, description=null, icons=null, websiteUrl=null]
2026-11-19T01:18:23.904-03:00  INFO 1968623 --- [           main] [955855b2-33f0-49a1-8b9e-9fd8df742b2b] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 129ms userId=- planId=-
2026-11-19T01:18:23.915-03:00  INFO 1968623 --- [           main] [19b84f1e-4874-45e6-8c48-f52ee48be900] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 7ms userId=- planId=-
2026-11-19T01:18:24.053-03:00  WARN 1968623 --- [           main] [a448f214-3370-48dc-be65-b9be37b34f38] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#items()
2026-11-19T01:18:24.056-03:00  WARN 1968623 --- [           main] [a448f214-3370-48dc-be65-b9be37b34f38] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-19T01:18:24.057-03:00  WARN 1968623 --- [           main] [a448f214-3370-48dc-be65-b9be37b34f38] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List)
2026-11-19T01:18:24.057-03:00  WARN 1968623 --- [           main] [a448f214-3370-48dc-be65-b9be37b34f38] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List)
2026-11-19T01:18:24.057-03:00  WARN 1968623 --- [           main] [a448f214-3370-48dc-be65-b9be37b34f38] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#participants()
2026-11-19T01:18:24.057-03:00  WARN 1968623 --- [           main] [a448f214-3370-48dc-be65-b9be37b34f38] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-19T01:18:24.092-03:00  INFO 1968623 --- [           main] [a448f214-3370-48dc-be65-b9be37b34f38] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=create_transaction user=1 plan=1 outcome=ok durationMs=159
2026-11-19T01:18:24.106-03:00  INFO 1968623 --- [           main] [a448f214-3370-48dc-be65-b9be37b34f38] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 189ms userId=- planId=-
2026-11-19T01:18:24.231-03:00  INFO 1968623 --- [           main] [0c84726a-5ac5-4ed6-95f4-60e87ea31fd6] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/{id} 200 49ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureHubIT#createForOneNa` - exit 0

```
2026-11-19T01:18:49.291-03:00  INFO 1969147 --- [           main] [4565f9f0-6d96-48b3-bdc1-d41acd333c14] i.m.server.McpAsyncServer                : Client initialize request - Protocol: 2025-06-18, Capabilities: ClientCapabilities[experimental=null, roots=null, sampling=null, elicitation=null, extensions=null], Info: Implementation[name=test, title=null, version=1, description=null, icons=null, websiteUrl=null]
2026-11-19T01:18:49.310-03:00  INFO 1969147 --- [           main] [4565f9f0-6d96-48b3-bdc1-d41acd333c14] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 140ms userId=- planId=-
2026-11-19T01:18:49.321-03:00  INFO 1969147 --- [           main] [7ef2288a-3e7b-4e8a-ae68-da7c3313e44e] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 6ms userId=- planId=-
2026-11-19T01:18:49.469-03:00  WARN 1969147 --- [           main] [8be04642-3543-4dec-b7ba-639b5274af73] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-19T01:18:49.472-03:00  WARN 1969147 --- [           main] [8be04642-3543-4dec-b7ba-639b5274af73] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-19T01:18:49.472-03:00  WARN 1969147 --- [           main] [8be04642-3543-4dec-b7ba-639b5274af73] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List)
2026-11-19T01:18:49.473-03:00  WARN 1969147 --- [           main] [8be04642-3543-4dec-b7ba-639b5274af73] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List)
2026-11-19T01:18:49.473-03:00  WARN 1969147 --- [           main] [8be04642-3543-4dec-b7ba-639b5274af73] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#items()
2026-11-19T01:18:49.473-03:00  WARN 1969147 --- [           main] [8be04642-3543-4dec-b7ba-639b5274af73] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#participants()
2026-11-19T01:18:49.523-03:00  INFO 1969147 --- [           main] [8be04642-3543-4dec-b7ba-639b5274af73] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=create_transaction user=1 plan=1 outcome=ok durationMs=183
2026-11-19T01:18:49.536-03:00  INFO 1969147 --- [           main] [8be04642-3543-4dec-b7ba-639b5274af73] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 212ms userId=- planId=-
2026-11-19T01:18:49.636-03:00  INFO 1969147 --- [           main] [55e28676-8379-4391-8bfd-b974521aff9a] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/{id} 200 48ms userId=1 planId=1
2026-11-19T01:18:49.739-03:00  INFO 1969147 --- [           main] [4e5bd2a1-8c69-4205-96fa-93475737d4a7] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=create_transaction user=1 plan=1 outcome=ok durationMs=24
2026-11-19T01:18:49.739-03:00  INFO 1969147 --- [           main] [4e5bd2a1-8c69-4205-96fa-93475737d4a7] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 28ms userId=- planId=-
2026-11-19T01:18:49.753-03:00  INFO 1969147 --- [           main] [070ed2e6-7bfb-4cb6-8be0-ddd6023169ee] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/{id} 200 12ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureHubIT#createForSever` - exit 0

```
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-19T01:19:14.829-03:00  INFO 1969670 --- [           main] [57024b4d-9309-46fd-8f0a-6e148359d31b] i.m.server.McpAsyncServer                : Client initialize request - Protocol: 2025-06-18, Capabilities: ClientCapabilities[experimental=null, roots=null, sampling=null, elicitation=null, extensions=null], Info: Implementation[name=test, title=null, version=1, description=null, icons=null, websiteUrl=null]
2026-11-19T01:19:14.849-03:00  INFO 1969670 --- [           main] [57024b4d-9309-46fd-8f0a-6e148359d31b] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 153ms userId=- planId=-
2026-11-19T01:19:14.860-03:00  INFO 1969670 --- [           main] [003c181a-92c2-4bf2-8d33-5ab0ef102445] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 7ms userId=- planId=-
2026-11-19T01:19:15.010-03:00  WARN 1969670 --- [           main] [9b58ad18-a90b-420d-a9e0-61c35978eefd] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#items()
2026-11-19T01:19:15.013-03:00  WARN 1969670 --- [           main] [9b58ad18-a90b-420d-a9e0-61c35978eefd] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List)
2026-11-19T01:19:15.013-03:00  WARN 1969670 --- [           main] [9b58ad18-a90b-420d-a9e0-61c35978eefd] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List)
2026-11-19T01:19:15.013-03:00  WARN 1969670 --- [           main] [9b58ad18-a90b-420d-a9e0-61c35978eefd] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-19T01:19:15.014-03:00  WARN 1969670 --- [           main] [9b58ad18-a90b-420d-a9e0-61c35978eefd] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-19T01:19:15.014-03:00  WARN 1969670 --- [           main] [9b58ad18-a90b-420d-a9e0-61c35978eefd] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#participants()
2026-11-19T01:19:15.072-03:00  INFO 1969670 --- [           main] [9b58ad18-a90b-420d-a9e0-61c35978eefd] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=create_transaction user=1 plan=1 outcome=ok durationMs=192
2026-11-19T01:19:15.087-03:00  INFO 1969670 --- [           main] [9b58ad18-a90b-420d-a9e0-61c35978eefd] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 224ms userId=- planId=-
2026-11-19T01:19:15.173-03:00  INFO 1969670 --- [           main] [ae392158-aa80-4f0e-a521-0f1a0b3dceaa] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/{id} 200 54ms userId=1 planId=1
2026-11-19T01:19:15.289-03:00  INFO 1969670 --- [           main] [dfdc3f61-d93c-4d18-bf07-d4891c2d9b4d] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 41ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureHubIT#createWithAnUn` - exit 0

```
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-19T01:19:40.303-03:00  INFO 1970183 --- [           main] [32ec4504-fc22-4bd5-a08b-d36ed3946293] i.m.server.McpAsyncServer                : Client initialize request - Protocol: 2025-06-18, Capabilities: ClientCapabilities[experimental=null, roots=null, sampling=null, elicitation=null, extensions=null], Info: Implementation[name=test, title=null, version=1, description=null, icons=null, websiteUrl=null]
2026-11-19T01:19:40.324-03:00  INFO 1970183 --- [           main] [32ec4504-fc22-4bd5-a08b-d36ed3946293] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 130ms userId=- planId=-
2026-11-19T01:19:40.334-03:00  INFO 1970183 --- [           main] [26c87494-5eeb-4706-ba59-8e67ccca9a4e] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 7ms userId=- planId=-
2026-11-19T01:19:40.490-03:00  INFO 1970183 --- [           main] [d040971e-bac0-4ac5-b9b9-8869ca326223] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=create_transaction user=1 plan=1 outcome=error durationMs=136
2026-11-19T01:19:40.505-03:00  INFO 1970183 --- [           main] [d040971e-bac0-4ac5-b9b9-8869ca326223] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 168ms userId=- planId=-
2026-11-19T01:19:40.562-03:00  INFO 1970183 --- [           main] [8eb141c1-b6b4-4255-af69-ebf47a885f1f] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=create_transaction user=1 plan=1 outcome=error durationMs=14
2026-11-19T01:19:40.562-03:00  INFO 1970183 --- [           main] [8eb141c1-b6b4-4255-af69-ebf47a885f1f] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 18ms userId=- planId=-
2026-11-19T01:19:40.579-03:00  INFO 1970183 --- [           main] [122003ea-9bc9-483b-a149-bd0e4dcecb29] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=create_transaction user=1 plan=1 outcome=error durationMs=13
2026-11-19T01:19:40.580-03:00  INFO 1970183 --- [           main] [122003ea-9bc9-483b-a149-bd0e4dcecb29] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 16ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureHubIT#createForSomeo` - exit 0

```
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
2026-11-19T01:20:05.955-03:00  INFO 1970707 --- [           main] [8c431c84-377d-4c70-a3a5-cd638425ff85] i.m.server.McpAsyncServer                : Client initialize request - Protocol: 2025-06-18, Capabilities: ClientCapabilities[experimental=null, roots=null, sampling=null, elicitation=null, extensions=null], Info: Implementation[name=test, title=null, version=1, description=null, icons=null, websiteUrl=null]
2026-11-19T01:20:05.975-03:00  INFO 1970707 --- [           main] [8c431c84-377d-4c70-a3a5-cd638425ff85] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 130ms userId=- planId=-
2026-11-19T01:20:05.986-03:00  INFO 1970707 --- [           main] [6fb3ff8c-6b1d-4f99-8e99-7c0f22890cb5] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 7ms userId=- planId=-
2026-11-19T01:20:06.139-03:00  INFO 1970707 --- [           main] [f226107b-61ed-47f1-b79a-2bb82957396e] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=create_transaction user=1 plan=1 outcome=error durationMs=134
2026-11-19T01:20:06.154-03:00  INFO 1970707 --- [           main] [f226107b-61ed-47f1-b79a-2bb82957396e] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 165ms userId=- planId=-
2026-11-19T01:20:06.224-03:00  WARN 1970707 --- [           main] [78e38274-58cf-4d6a-82d1-92baef6fc8ef] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List)
2026-11-19T01:20:06.226-03:00  WARN 1970707 --- [           main] [78e38274-58cf-4d6a-82d1-92baef6fc8ef] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List)
2026-11-19T01:20:06.227-03:00  WARN 1970707 --- [           main] [78e38274-58cf-4d6a-82d1-92baef6fc8ef] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#participants()
2026-11-19T01:20:06.227-03:00  WARN 1970707 --- [           main] [78e38274-58cf-4d6a-82d1-92baef6fc8ef] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-19T01:20:06.227-03:00  WARN 1970707 --- [           main] [78e38274-58cf-4d6a-82d1-92baef6fc8ef] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#items()
2026-11-19T01:20:06.227-03:00  WARN 1970707 --- [           main] [78e38274-58cf-4d6a-82d1-92baef6fc8ef] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-19T01:20:06.276-03:00  INFO 1970707 --- [           main] [78e38274-58cf-4d6a-82d1-92baef6fc8ef] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=create_transaction user=1 plan=1 outcome=ok durationMs=73
2026-11-19T01:20:06.276-03:00  INFO 1970707 --- [           main] [78e38274-58cf-4d6a-82d1-92baef6fc8ef] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 77ms userId=- planId=-
2026-11-19T01:20:06.357-03:00  INFO 1970707 --- [           main] [12d9d94c-c770-4776-80b0-2d476d49144a] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/{id} 200 45ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureToolsIT#createSchema` - exit 0

```
2026-11-19T01:20:30.740-03:00  INFO 1971231 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable completions capabilities
2026-11-19T01:20:30.876-03:00  INFO 1971231 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-19T01:20:30.876-03:00  INFO 1971231 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-19T01:20:30.877-03:00  INFO 1971231 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-19T01:20:30.933-03:00  INFO 1971231 --- [           main] [] com.lcs.findraco.mcp.McpCaptureToolsIT   : Started McpCaptureToolsIT in 8.898 seconds (process running for 10.159)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-19T01:20:31.452-03:00  INFO 1971231 --- [           main] [92f59668-c2eb-4c7c-835d-6c868d47f5cb] i.m.server.McpAsyncServer                : Client initialize request - Protocol: 2025-06-18, Capabilities: ClientCapabilities[experimental=null, roots=null, sampling=null, elicitation=null, extensions=null], Info: Implementation[name=test, title=null, version=1, description=null, icons=null, websiteUrl=null]
2026-11-19T01:20:31.472-03:00  INFO 1971231 --- [           main] [92f59668-c2eb-4c7c-835d-6c868d47f5cb] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 145ms userId=- planId=-
2026-11-19T01:20:31.483-03:00  INFO 1971231 --- [           main] [6d2fe17c-d31e-4e9f-88ac-9a15768a6b41] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 7ms userId=- planId=-
2026-11-19T01:20:31.508-03:00  INFO 1971231 --- [           main] [a71dde7d-1285-4f41-bf46-1a23fc17d37f] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 23ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureHubIT#contributorCan` - exit 0

```
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-19T01:20:57.370-03:00  INFO 1971749 --- [           main] [d33a7c9b-6454-4183-b588-b5bb4e1bd00d] i.m.server.McpAsyncServer                : Client initialize request - Protocol: 2025-06-18, Capabilities: ClientCapabilities[experimental=null, roots=null, sampling=null, elicitation=null, extensions=null], Info: Implementation[name=test, title=null, version=1, description=null, icons=null, websiteUrl=null]
2026-11-19T01:20:57.391-03:00  INFO 1971749 --- [           main] [d33a7c9b-6454-4183-b588-b5bb4e1bd00d] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 133ms userId=- planId=-
2026-11-19T01:20:57.402-03:00  INFO 1971749 --- [           main] [16245423-ec4a-4a42-9788-13c7b8255c35] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 7ms userId=- planId=-
2026-11-19T01:20:57.571-03:00  WARN 1971749 --- [           main] [bbc55fd8-e5e1-48ed-9b11-82e72d183739] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List)
2026-11-19T01:20:57.574-03:00  WARN 1971749 --- [           main] [bbc55fd8-e5e1-48ed-9b11-82e72d183739] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List)
2026-11-19T01:20:57.575-03:00  WARN 1971749 --- [           main] [bbc55fd8-e5e1-48ed-9b11-82e72d183739] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-19T01:20:57.575-03:00  WARN 1971749 --- [           main] [bbc55fd8-e5e1-48ed-9b11-82e72d183739] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-19T01:20:57.575-03:00  WARN 1971749 --- [           main] [bbc55fd8-e5e1-48ed-9b11-82e72d183739] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#participants()
2026-11-19T01:20:57.575-03:00  WARN 1971749 --- [           main] [bbc55fd8-e5e1-48ed-9b11-82e72d183739] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#items()
2026-11-19T01:20:57.599-03:00  INFO 1971749 --- [           main] [bbc55fd8-e5e1-48ed-9b11-82e72d183739] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=create_transaction user=2 plan=1 outcome=error durationMs=177
2026-11-19T01:20:57.617-03:00  INFO 1971749 --- [           main] [bbc55fd8-e5e1-48ed-9b11-82e72d183739] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 212ms userId=- planId=-
2026-11-19T01:20:57.727-03:00  INFO 1971749 --- [           main] [087cd516-1b00-4902-b8ec-8a049f063fc9] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=create_transaction user=2 plan=1 outcome=ok durationMs=58
2026-11-19T01:20:57.727-03:00  INFO 1971749 --- [           main] [087cd516-1b00-4902-b8ec-8a049f063fc9] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 62ms userId=- planId=-
2026-11-19T01:20:57.822-03:00  INFO 1971749 --- [           main] [f5db7312-e1c3-476a-9b81-8f0121765cdd] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/{id} 200 59ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureHubIT#updateWithCate` - exit 0

```
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-19T01:21:23.294-03:00  INFO 1972276 --- [           main] [ffe001b7-11bd-4bc6-aaf1-116cb866137a] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/{id} 200 218ms userId=1 planId=1
2026-11-19T01:21:23.366-03:00  INFO 1972276 --- [           main] [bc0e1211-3da4-471f-94c3-1fd645f751da] i.m.server.McpAsyncServer                : Client initialize request - Protocol: 2025-06-18, Capabilities: ClientCapabilities[experimental=null, roots=null, sampling=null, elicitation=null, extensions=null], Info: Implementation[name=test, title=null, version=1, description=null, icons=null, websiteUrl=null]
2026-11-19T01:21:23.382-03:00  INFO 1972276 --- [           main] [bc0e1211-3da4-471f-94c3-1fd645f751da] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 54ms userId=- planId=-
2026-11-19T01:21:23.391-03:00  INFO 1972276 --- [           main] [f33d3139-09d6-43f1-b13f-e7654888e00f] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 7ms userId=- planId=-
2026-11-19T01:21:23.503-03:00  WARN 1972276 --- [           main] [2c0c8d86-162e-481d-8eb1-9ede4a712189] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#com.lcs.findraco.transaction.request.UpdateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, Long)
2026-11-19T01:21:23.506-03:00  WARN 1972276 --- [           main] [2c0c8d86-162e-481d-8eb1-9ede4a712189] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#com.lcs.findraco.transaction.request.UpdateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, Long)
2026-11-19T01:21:23.506-03:00  WARN 1972276 --- [           main] [2c0c8d86-162e-481d-8eb1-9ede4a712189] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-19T01:21:23.506-03:00  WARN 1972276 --- [           main] [2c0c8d86-162e-481d-8eb1-9ede4a712189] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#participants()
2026-11-19T01:21:23.507-03:00  WARN 1972276 --- [           main] [2c0c8d86-162e-481d-8eb1-9ede4a712189] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-19T01:21:23.507-03:00  WARN 1972276 --- [           main] [2c0c8d86-162e-481d-8eb1-9ede4a712189] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#items()
2026-11-19T01:21:23.573-03:00  INFO 1972276 --- [           main] [2c0c8d86-162e-481d-8eb1-9ede4a712189] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=update_transaction user=1 plan=1 outcome=ok durationMs=165
2026-11-19T01:21:23.587-03:00  INFO 1972276 --- [           main] [2c0c8d86-162e-481d-8eb1-9ede4a712189] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 194ms userId=- planId=-
2026-11-19T01:21:23.644-03:00  INFO 1972276 --- [           main] [58cf5c60-6a6c-4ba2-8457-eb5664ddcad1] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/{id} 200 16ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureHubIT#updateWithRemo` - exit 0

```
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-19T01:21:48.826-03:00  INFO 1972794 --- [           main] [9eace15d-9e57-45f5-bbd5-ef5fde0fa9c9] i.m.server.McpAsyncServer                : Client initialize request - Protocol: 2025-06-18, Capabilities: ClientCapabilities[experimental=null, roots=null, sampling=null, elicitation=null, extensions=null], Info: Implementation[name=test, title=null, version=1, description=null, icons=null, websiteUrl=null]
2026-11-19T01:21:48.846-03:00  INFO 1972794 --- [           main] [9eace15d-9e57-45f5-bbd5-ef5fde0fa9c9] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 133ms userId=- planId=-
2026-11-19T01:21:48.856-03:00  INFO 1972794 --- [           main] [ffd7bdfc-044e-4729-b546-468e50a1a880] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 7ms userId=- planId=-
2026-11-19T01:21:49.036-03:00  WARN 1972794 --- [           main] [5e9eee07-7338-42be-b8c6-973587cc0fa6] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#participants()
2026-11-19T01:21:49.039-03:00  WARN 1972794 --- [           main] [5e9eee07-7338-42be-b8c6-973587cc0fa6] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-19T01:21:49.040-03:00  WARN 1972794 --- [           main] [5e9eee07-7338-42be-b8c6-973587cc0fa6] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-19T01:21:49.040-03:00  WARN 1972794 --- [           main] [5e9eee07-7338-42be-b8c6-973587cc0fa6] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#com.lcs.findraco.transaction.request.UpdateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, Long)
2026-11-19T01:21:49.040-03:00  WARN 1972794 --- [           main] [5e9eee07-7338-42be-b8c6-973587cc0fa6] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#com.lcs.findraco.transaction.request.UpdateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, Long)
2026-11-19T01:21:49.040-03:00  WARN 1972794 --- [           main] [5e9eee07-7338-42be-b8c6-973587cc0fa6] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#items()
2026-11-19T01:21:49.089-03:00  INFO 1972794 --- [           main] [5e9eee07-7338-42be-b8c6-973587cc0fa6] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=update_transaction user=1 plan=1 outcome=ok durationMs=217
2026-11-19T01:21:49.103-03:00  INFO 1972794 --- [           main] [5e9eee07-7338-42be-b8c6-973587cc0fa6] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 246ms userId=- planId=-
2026-11-19T01:21:49.180-03:00  INFO 1972794 --- [           main] [b4abcff9-0d63-4026-91d3-5c458ed0071c] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/{id} 200 39ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureHubIT#updateWithCate` - exit 0

```
2026-11-19T01:22:13.701-03:00  INFO 1973315 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-19T01:22:13.702-03:00  INFO 1973315 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-19T01:22:13.758-03:00  INFO 1973315 --- [           main] [] com.lcs.findraco.mcp.McpCaptureHubIT     : Started McpCaptureHubIT in 8.883 seconds (process running for 10.247)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-19T01:22:14.317-03:00  INFO 1973315 --- [           main] [981588cf-a548-4943-813f-b0b57cedb561] i.m.server.McpAsyncServer                : Client initialize request - Protocol: 2025-06-18, Capabilities: ClientCapabilities[experimental=null, roots=null, sampling=null, elicitation=null, extensions=null], Info: Implementation[name=test, title=null, version=1, description=null, icons=null, websiteUrl=null]
2026-11-19T01:22:14.337-03:00  INFO 1973315 --- [           main] [981588cf-a548-4943-813f-b0b57cedb561] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 150ms userId=- planId=-
2026-11-19T01:22:14.348-03:00  INFO 1973315 --- [           main] [6f25b120-1b89-4f5f-bd7b-aedc5bef663b] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 7ms userId=- planId=-
2026-11-19T01:22:14.473-03:00  INFO 1973315 --- [           main] [20a7ae30-1696-4da2-a149-8b94e78e4c26] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=update_transaction user=1 plan=1 outcome=error durationMs=110
2026-11-19T01:22:14.487-03:00  INFO 1973315 --- [           main] [20a7ae30-1696-4da2-a149-8b94e78e4c26] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 138ms userId=- planId=-
2026-11-19T01:22:14.632-03:00  INFO 1973315 --- [           main] [add7d342-36a2-45bb-899d-f9810c77fb81] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/{id} 200 59ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureHubIT#updateWithACat` - exit 0

```
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-19T01:22:39.817-03:00  INFO 1973844 --- [           main] [b463632c-114b-4556-a213-2881781def9b] i.m.server.McpAsyncServer                : Client initialize request - Protocol: 2025-06-18, Capabilities: ClientCapabilities[experimental=null, roots=null, sampling=null, elicitation=null, extensions=null], Info: Implementation[name=test, title=null, version=1, description=null, icons=null, websiteUrl=null]
2026-11-19T01:22:39.837-03:00  INFO 1973844 --- [           main] [b463632c-114b-4556-a213-2881781def9b] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 141ms userId=- planId=-
2026-11-19T01:22:39.848-03:00  INFO 1973844 --- [           main] [73a21690-1ee6-404f-9853-70597640b6c7] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 7ms userId=- planId=-
2026-11-19T01:22:40.043-03:00  WARN 1973844 --- [           main] [27c297da-1aaa-4a0b-8e09-506aa7f02250] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-19T01:22:40.046-03:00  WARN 1973844 --- [           main] [27c297da-1aaa-4a0b-8e09-506aa7f02250] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#com.lcs.findraco.transaction.request.UpdateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, Long)
2026-11-19T01:22:40.047-03:00  WARN 1973844 --- [           main] [27c297da-1aaa-4a0b-8e09-506aa7f02250] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#com.lcs.findraco.transaction.request.UpdateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, Long)
2026-11-19T01:22:40.047-03:00  WARN 1973844 --- [           main] [27c297da-1aaa-4a0b-8e09-506aa7f02250] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#items()
2026-11-19T01:22:40.047-03:00  WARN 1973844 --- [           main] [27c297da-1aaa-4a0b-8e09-506aa7f02250] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#participants()
2026-11-19T01:22:40.047-03:00  WARN 1973844 --- [           main] [27c297da-1aaa-4a0b-8e09-506aa7f02250] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-19T01:22:40.088-03:00  INFO 1973844 --- [           main] [27c297da-1aaa-4a0b-8e09-506aa7f02250] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=update_transaction user=1 plan=1 outcome=error durationMs=224
2026-11-19T01:22:40.109-03:00  INFO 1973844 --- [           main] [27c297da-1aaa-4a0b-8e09-506aa7f02250] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 260ms userId=- planId=-
2026-11-19T01:22:40.227-03:00  INFO 1973844 --- [           main] [776d19c4-dced-4941-9fa0-57e3ea2ced6d] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/{id} 200 42ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionListFilterIT#uncate` - exit 0

```
2026-11-19T01:23:04.733-03:00  INFO 1974369 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable prompts capabilities, notification: true
2026-11-19T01:23:04.734-03:00  INFO 1974369 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable completions capabilities
2026-11-19T01:23:04.860-03:00  INFO 1974369 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-19T01:23:04.860-03:00  INFO 1974369 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-19T01:23:04.861-03:00  INFO 1974369 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-19T01:23:04.917-03:00  INFO 1974369 --- [           main] [] c.l.f.t.TransactionListFilterIT          : Started TransactionListFilterIT in 8.815 seconds (process running for 10.079)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-19T01:23:05.712-03:00  INFO 1974369 --- [           main] [aee3c12e-1fe1-44f5-b9c0-3576135789b0] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction 200 309ms userId=1 planId=1
2026-11-19T01:23:05.814-03:00  INFO 1974369 --- [           main] [e89f38b7-1cbc-4b27-b25a-3093b9ed2606] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction 200 37ms userId=1 planId=1
2026-11-19T01:23:05.844-03:00  INFO 1974369 --- [           main] [d2eac1da-9921-4082-940c-39d10c0a46e2] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction 200 27ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureHubIT#listUncategori` - exit 0

```
2026-11-19T01:23:30.551-03:00  INFO 1974887 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-19T01:23:30.551-03:00  INFO 1974887 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-19T01:23:30.553-03:00  INFO 1974887 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 2 ms
2026-11-19T01:23:30.617-03:00  INFO 1974887 --- [           main] [] com.lcs.findraco.mcp.McpCaptureHubIT     : Started McpCaptureHubIT in 8.883 seconds (process running for 10.161)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-19T01:23:31.171-03:00  INFO 1974887 --- [           main] [17451927-3b80-4bfc-92e9-638a9bdafb8d] i.m.server.McpAsyncServer                : Client initialize request - Protocol: 2025-06-18, Capabilities: ClientCapabilities[experimental=null, roots=null, sampling=null, elicitation=null, extensions=null], Info: Implementation[name=test, title=null, version=1, description=null, icons=null, websiteUrl=null]
2026-11-19T01:23:31.202-03:00  INFO 1974887 --- [           main] [17451927-3b80-4bfc-92e9-638a9bdafb8d] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 148ms userId=- planId=-
2026-11-19T01:23:31.213-03:00  INFO 1974887 --- [           main] [285be441-234f-4261-9e45-e4b6efe70c27] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 7ms userId=- planId=-
2026-11-19T01:23:31.396-03:00  INFO 1974887 --- [           main] [b8d10f54-40fd-426c-be92-8a59f05efa42] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=list_transactions user=1 plan=1 outcome=ok durationMs=168
2026-11-19T01:23:31.410-03:00  INFO 1974887 --- [           main] [b8d10f54-40fd-426c-be92-8a59f05efa42] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 195ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionListFilterIT#status` - exit 0

```
2026-11-19T01:23:56.227-03:00  INFO 1975403 --- [           main] [] c.l.f.t.TransactionListFilterIT          : Started TransactionListFilterIT in 8.972 seconds (process running for 10.216)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-19T01:23:57.027-03:00  INFO 1975403 --- [           main] [bf2c012c-884b-4741-9a7d-13eab4a0ae29] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction 200 274ms userId=1 planId=1
2026-11-19T01:23:57.128-03:00  INFO 1975403 --- [           main] [b71a5114-8b40-4f93-b062-d25251ded020] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction 200 31ms userId=1 planId=1
2026-11-19T01:23:57.156-03:00  INFO 1975403 --- [           main] [f77d0257-adfa-4cb5-8a3b-a3175cebb313] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction 200 26ms userId=1 planId=1
2026-11-19T01:23:57.182-03:00  INFO 1975403 --- [           main] [e087e18a-6757-4c0a-ae36-156a197cba1e] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction 200 23ms userId=1 planId=1
2026-11-19T01:23:57.212-03:00  INFO 1975403 --- [           main] [40c0d89a-9a8f-4540-acab-ad535cb92e22] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction 200 25ms userId=1 planId=1
2026-11-19T01:23:57.236-03:00  INFO 1975403 --- [           main] [98a636b3-6dd4-4929-a15a-b887df2002a2] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction 200 22ms userId=1 planId=1
2026-11-19T01:23:57.250-03:00  INFO 1975403 --- [           main] [7d325a8a-4397-459c-a6e9-70dbc5dbb999] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction 200 12ms userId=2 planId=1
2026-11-19T01:23:57.275-03:00  INFO 1975403 --- [           main] [b05f248e-ab87-41ed-b4c5-ceb6d606fc2e] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction 200 22ms userId=2 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureHubIT#listPendingRet` - exit 0

```
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-19T01:24:22.805-03:00  INFO 1975922 --- [           main] [cc6db582-9867-475a-b841-707507a1ce63] i.m.server.McpAsyncServer                : Client initialize request - Protocol: 2025-06-18, Capabilities: ClientCapabilities[experimental=null, roots=null, sampling=null, elicitation=null, extensions=null], Info: Implementation[name=test, title=null, version=1, description=null, icons=null, websiteUrl=null]
2026-11-19T01:24:22.825-03:00  INFO 1975922 --- [           main] [cc6db582-9867-475a-b841-707507a1ce63] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 153ms userId=- planId=-
2026-11-19T01:24:22.835-03:00  INFO 1975922 --- [           main] [ce69cffa-fb82-4bc5-9113-cf73193135c0] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 7ms userId=- planId=-
2026-11-19T01:24:23.022-03:00  INFO 1975922 --- [           main] [b6511ea8-6290-47fd-b589-7d566116785b] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=list_transactions user=1 plan=1 outcome=ok durationMs=171
2026-11-19T01:24:23.036-03:00  INFO 1975922 --- [           main] [b6511ea8-6290-47fd-b589-7d566116785b] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 199ms userId=- planId=-
2026-11-19T01:24:23.193-03:00  INFO 1975922 --- [           main] [341886c2-434b-40d5-b03a-cfce2843de6a] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction 200 69ms userId=1 planId=1
2026-11-19T01:24:23.221-03:00  INFO 1975922 --- [           main] [ceca9e53-3d72-4856-bb7c-f6704853003e] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=list_transactions user=1 plan=1 outcome=ok durationMs=24
2026-11-19T01:24:23.222-03:00  INFO 1975922 --- [           main] [ceca9e53-3d72-4856-bb7c-f6704853003e] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 27ms userId=- planId=-
2026-11-19T01:24:23.253-03:00  INFO 1975922 --- [           main] [b9344c9f-6e8d-4825-9076-c484c71483de] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=list_transactions user=1 plan=1 outcome=ok durationMs=27
2026-11-19T01:24:23.254-03:00  INFO 1975922 --- [           main] [b9344c9f-6e8d-4825-9076-c484c71483de] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 30ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionListFilterIT#invali` - exit 0

```
2026-11-19T01:24:47.506-03:00  INFO 1976436 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable resources templates capabilities, notification: true
2026-11-19T01:24:47.506-03:00  INFO 1976436 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable prompts capabilities, notification: true
2026-11-19T01:24:47.508-03:00  INFO 1976436 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable completions capabilities
2026-11-19T01:24:47.632-03:00  INFO 1976436 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-19T01:24:47.632-03:00  INFO 1976436 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-19T01:24:47.634-03:00  INFO 1976436 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 2 ms
2026-11-19T01:24:47.688-03:00  INFO 1976436 --- [           main] [] c.l.f.t.TransactionListFilterIT          : Started TransactionListFilterIT in 8.842 seconds (process running for 10.047)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-19T01:24:48.372-03:00  INFO 1976436 --- [           main] [306f109f-7cb1-4bb4-8107-234741ee3414] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction 400 222ms userId=1 planId=1
2026-11-19T01:24:48.412-03:00  INFO 1976436 --- [           main] [720186ee-a027-49a0-b1d3-c2efb67cc3ce] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction 400 9ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureHubIT#listUncategori` - exit 0

```
2026-11-19T01:25:13.332-03:00  INFO 1976960 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-19T01:25:13.332-03:00  INFO 1976960 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-19T01:25:13.334-03:00  INFO 1976960 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-19T01:25:13.398-03:00  INFO 1976960 --- [           main] [] com.lcs.findraco.mcp.McpCaptureHubIT     : Started McpCaptureHubIT in 8.9 seconds (process running for 10.057)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-19T01:25:13.921-03:00  INFO 1976960 --- [           main] [ecaeb03f-0be5-4d40-92a5-b75868124a62] i.m.server.McpAsyncServer                : Client initialize request - Protocol: 2025-06-18, Capabilities: ClientCapabilities[experimental=null, roots=null, sampling=null, elicitation=null, extensions=null], Info: Implementation[name=test, title=null, version=1, description=null, icons=null, websiteUrl=null]
2026-11-19T01:25:13.948-03:00  INFO 1976960 --- [           main] [ecaeb03f-0be5-4d40-92a5-b75868124a62] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 136ms userId=- planId=-
2026-11-19T01:25:13.959-03:00  INFO 1976960 --- [           main] [72f381f3-8243-4207-b4c2-12dce0e0ae80] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 7ms userId=- planId=-
2026-11-19T01:25:14.130-03:00  INFO 1976960 --- [           main] [e08dbf77-12d6-469d-b023-b0d10c80551b] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=list_transactions user=1 plan=1 outcome=error durationMs=156
2026-11-19T01:25:14.144-03:00  INFO 1976960 --- [           main] [e08dbf77-12d6-469d-b023-b0d10c80551b] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 184ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureHubIT#listedRowsCarr` - exit 0

```
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-19T01:25:39.832-03:00  WARN 1977473 --- [           main] [2b2d5063-bd44-4a9e-bec0-7e8a5c9d24af] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-19T01:25:39.837-03:00  WARN 1977473 --- [           main] [2b2d5063-bd44-4a9e-bec0-7e8a5c9d24af] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-19T01:25:39.838-03:00  WARN 1977473 --- [           main] [2b2d5063-bd44-4a9e-bec0-7e8a5c9d24af] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-19T01:25:39.989-03:00  INFO 1977473 --- [           main] [2b2d5063-bd44-4a9e-bec0-7e8a5c9d24af] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 280ms userId=1 planId=1
2026-11-19T01:25:40.060-03:00  INFO 1977473 --- [           main] [9e584516-2b14-4370-9b3b-e3355f235950] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 58ms userId=1 planId=1
2026-11-19T01:25:40.120-03:00  INFO 1977473 --- [           main] [e79dbd8a-c23f-45d1-9639-a3e883de167f] i.m.server.McpAsyncServer                : Client initialize request - Protocol: 2025-06-18, Capabilities: ClientCapabilities[experimental=null, roots=null, sampling=null, elicitation=null, extensions=null], Info: Implementation[name=test, title=null, version=1, description=null, icons=null, websiteUrl=null]
2026-11-19T01:25:40.138-03:00  INFO 1977473 --- [           main] [e79dbd8a-c23f-45d1-9639-a3e883de167f] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 52ms userId=- planId=-
2026-11-19T01:25:40.147-03:00  INFO 1977473 --- [           main] [528f3f4f-26e6-44fa-bd0f-507007cf1e86] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 8ms userId=- planId=-
2026-11-19T01:25:40.272-03:00  INFO 1977473 --- [           main] [ae080ac9-eb0a-46c3-b9d2-59adce607237] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=list_transactions user=1 plan=1 outcome=ok durationMs=108
2026-11-19T01:25:40.288-03:00  INFO 1977473 --- [           main] [ae080ac9-eb0a-46c3-b9d2-59adce607237] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 139ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureHubIT#updateOfARowSh` - exit 0

```
2026-11-19T01:26:04.868-03:00  INFO 1977990 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-19T01:26:04.870-03:00  INFO 1977990 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 2 ms
2026-11-19T01:26:04.926-03:00  INFO 1977990 --- [           main] [] com.lcs.findraco.mcp.McpCaptureHubIT     : Started McpCaptureHubIT in 8.903 seconds (process running for 10.144)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-19T01:26:05.491-03:00  INFO 1977990 --- [           main] [e13e1674-62a9-4be7-aec0-0c339ac1b767] i.m.server.McpAsyncServer                : Client initialize request - Protocol: 2025-06-18, Capabilities: ClientCapabilities[experimental=null, roots=null, sampling=null, elicitation=null, extensions=null], Info: Implementation[name=test, title=null, version=1, description=null, icons=null, websiteUrl=null]
2026-11-19T01:26:05.511-03:00  INFO 1977990 --- [           main] [e13e1674-62a9-4be7-aec0-0c339ac1b767] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 133ms userId=- planId=-
2026-11-19T01:26:05.522-03:00  INFO 1977990 --- [           main] [a28b4335-ca6b-4b48-b7f8-848d5b95e8a2] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 7ms userId=- planId=-
2026-11-19T01:26:05.719-03:00  INFO 1977990 --- [           main] [1eea522e-a850-4b1a-816e-7e0c1acf7f19] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=update_transaction user=1 plan=1 outcome=error durationMs=182
2026-11-19T01:26:05.736-03:00  INFO 1977990 --- [           main] [1eea522e-a850-4b1a-816e-7e0c1acf7f19] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 213ms userId=- planId=-
2026-11-19T01:26:05.859-03:00  INFO 1977990 --- [           main] [b035911c-eba6-4e70-b2c5-09d4c4e3f0cf] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/{id} 200 49ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureHubIT#deleteASingleR` - exit 0

```
2026-11-19T01:26:30.646-03:00  INFO 1978502 --- [           main] [] com.lcs.findraco.mcp.McpCaptureHubIT     : Started McpCaptureHubIT in 8.939 seconds (process running for 10.21)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-19T01:26:31.234-03:00  INFO 1978502 --- [           main] [b486284c-4389-4d46-945f-5c1201325910] i.m.server.McpAsyncServer                : Client initialize request - Protocol: 2025-06-18, Capabilities: ClientCapabilities[experimental=null, roots=null, sampling=null, elicitation=null, extensions=null], Info: Implementation[name=test, title=null, version=1, description=null, icons=null, websiteUrl=null]
2026-11-19T01:26:31.255-03:00  INFO 1978502 --- [           main] [b486284c-4389-4d46-945f-5c1201325910] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 137ms userId=- planId=-
2026-11-19T01:26:31.266-03:00  INFO 1978502 --- [           main] [1d499cc7-4cb4-430c-bfce-96549a9acbb8] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 7ms userId=- planId=-
2026-11-19T01:26:31.442-03:00  INFO 1978502 --- [           main] [56aeb35f-fab3-4e24-b8c1-35f7cc801ad5] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=delete_transaction user=1 plan=1 outcome=ok durationMs=160
2026-11-19T01:26:31.459-03:00  INFO 1978502 --- [           main] [56aeb35f-fab3-4e24-b8c1-35f7cc801ad5] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 191ms userId=- planId=-
2026-11-19T01:26:31.574-03:00  INFO 1978502 --- [           main] [d926d12b-e236-4b0a-b843-f61557b1f791] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=list_transactions user=1 plan=1 outcome=ok durationMs=69
2026-11-19T01:26:31.575-03:00  INFO 1978502 --- [           main] [d926d12b-e236-4b0a-b843-f61557b1f791] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 74ms userId=- planId=-
2026-11-19T01:26:31.661-03:00  INFO 1978502 --- [           main] [60000bd1-1ec9-4650-854a-6cd37910d4d3] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/trash 200 42ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureHubIT#deleteAnOccurr` - exit 0

```
2026-11-19T01:26:56.577-03:00  INFO 1979012 --- [           main] [7c591cdd-efba-44b3-babf-e27298b988d2] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 7ms userId=- planId=-
2026-11-19T01:26:56.711-03:00  INFO 1979012 --- [           main] [d0e9fd80-7d4d-439a-94a7-f4a2e7b6d1b3] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=delete_transaction user=1 plan=1 outcome=ok durationMs=120
2026-11-19T01:26:56.724-03:00  INFO 1979012 --- [           main] [d0e9fd80-7d4d-439a-94a7-f4a2e7b6d1b3] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 145ms userId=- planId=-
2026-11-19T01:26:56.821-03:00  INFO 1979012 --- [           main] [53854313-5bec-4eb2-be81-ff461b374edc] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=list_transactions user=1 plan=1 outcome=ok durationMs=53
2026-11-19T01:26:56.821-03:00  INFO 1979012 --- [           main] [53854313-5bec-4eb2-be81-ff461b374edc] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 57ms userId=- planId=-
2026-11-19T01:26:56.852-03:00  INFO 1979012 --- [           main] [efa51e0d-a1f0-43ea-9ab0-087cad81e313] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=list_transactions user=1 plan=1 outcome=ok durationMs=21
2026-11-19T01:26:56.853-03:00  INFO 1979012 --- [           main] [efa51e0d-a1f0-43ea-9ab0-087cad81e313] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 24ms userId=- planId=-
2026-11-19T01:26:56.892-03:00  INFO 1979012 --- [           main] [d0ccc60b-41d4-428c-bd19-4b910dfb2662] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=delete_transaction user=1 plan=1 outcome=ok durationMs=33
2026-11-19T01:26:56.893-03:00  INFO 1979012 --- [           main] [d0ccc60b-41d4-428c-bd19-4b910dfb2662] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 36ms userId=- planId=-
2026-11-19T01:26:56.913-03:00  INFO 1979012 --- [           main] [1ca4828a-ec41-421f-91aa-4f8f4052abcd] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=list_transactions user=1 plan=1 outcome=ok durationMs=16
2026-11-19T01:26:56.913-03:00  INFO 1979012 --- [           main] [1ca4828a-ec41-421f-91aa-4f8f4052abcd] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 19ms userId=- planId=-
2026-11-19T01:26:56.946-03:00  INFO 1979012 --- [           main] [9c161ec2-5314-43e5-a7ee-44fcf37d5bab] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=delete_transaction user=1 plan=1 outcome=ok durationMs=29
2026-11-19T01:26:56.946-03:00  INFO 1979012 --- [           main] [9c161ec2-5314-43e5-a7ee-44fcf37d5bab] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 32ms userId=- planId=-
2026-11-19T01:26:56.963-03:00  INFO 1979012 --- [           main] [23e95437-1cbd-4d3e-9195-0b046945e37f] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=list_transactions user=1 plan=1 outcome=ok durationMs=13
2026-11-19T01:26:56.963-03:00  INFO 1979012 --- [           main] [23e95437-1cbd-4d3e-9195-0b046945e37f] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 16ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureHubIT#restoreDeletio` - exit 0

```
2026-11-19T01:27:22.814-03:00  INFO 1979536 --- [           main] [9848684f-40d3-44fd-b692-10a18f1801ad] i.m.server.McpAsyncServer                : Client initialize request - Protocol: 2025-06-18, Capabilities: ClientCapabilities[experimental=null, roots=null, sampling=null, elicitation=null, extensions=null], Info: Implementation[name=test, title=null, version=1, description=null, icons=null, websiteUrl=null]
2026-11-19T01:27:22.814-03:00  INFO 1979536 --- [           main] [9848684f-40d3-44fd-b692-10a18f1801ad] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 2ms userId=- planId=-
2026-11-19T01:27:22.816-03:00  INFO 1979536 --- [           main] [417aa68d-4fe3-4e85-931f-e47415585225] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 1ms userId=- planId=-
2026-11-19T01:27:22.827-03:00  INFO 1979536 --- [           main] [32b6ae05-36b0-4df9-b1d7-f6dcfabaf186] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=restore_deletion user=2 plan=2 outcome=error durationMs=8
2026-11-19T01:27:22.828-03:00  INFO 1979536 --- [           main] [32b6ae05-36b0-4df9-b1d7-f6dcfabaf186] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 10ms userId=- planId=-
2026-11-19T01:27:22.899-03:00  WARN 1979536 --- [           main] [505b9fdb-c49d-4e4a-a3ba-8a30ae80f3e3] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-19T01:27:22.902-03:00  WARN 1979536 --- [           main] [505b9fdb-c49d-4e4a-a3ba-8a30ae80f3e3] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-19T01:27:22.902-03:00  WARN 1979536 --- [           main] [505b9fdb-c49d-4e4a-a3ba-8a30ae80f3e3] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-19T01:27:22.957-03:00  INFO 1979536 --- [           main] [505b9fdb-c49d-4e4a-a3ba-8a30ae80f3e3] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 95ms userId=1 planId=1
2026-11-19T01:27:23.023-03:00  INFO 1979536 --- [           main] [58fa12eb-dcb9-489b-83a6-01c431280760] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=delete_transaction user=1 plan=1 outcome=ok durationMs=60
2026-11-19T01:27:23.024-03:00  INFO 1979536 --- [           main] [58fa12eb-dcb9-489b-83a6-01c431280760] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 63ms userId=- planId=-
2026-11-19T01:27:23.057-03:00  INFO 1979536 --- [           main] [40139704-340e-4636-9e70-e32c4b1c8866] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=delete_transaction user=1 plan=1 outcome=ok durationMs=30
2026-11-19T01:27:23.058-03:00  INFO 1979536 --- [           main] [40139704-340e-4636-9e70-e32c4b1c8866] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 33ms userId=- planId=-
2026-11-19T01:27:23.074-03:00  INFO 1979536 --- [           main] [2ec6a741-57f5-4059-b044-61d4490e0803] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=restore_deletion user=1 plan=1 outcome=error durationMs=12
2026-11-19T01:27:23.074-03:00  INFO 1979536 --- [           main] [2ec6a741-57f5-4059-b044-61d4490e0803] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 15ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureHubIT#deleteToolIsDe` - exit 0

```
2026-11-19T01:27:47.891-03:00  INFO 1980049 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable completions capabilities
2026-11-19T01:27:48.023-03:00  INFO 1980049 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-19T01:27:48.023-03:00  INFO 1980049 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-19T01:27:48.025-03:00  INFO 1980049 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 2 ms
2026-11-19T01:27:48.084-03:00  INFO 1980049 --- [           main] [] com.lcs.findraco.mcp.McpCaptureHubIT     : Started McpCaptureHubIT in 8.955 seconds (process running for 10.19)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-19T01:27:48.599-03:00  INFO 1980049 --- [           main] [a5fc3fba-f08c-4421-b43a-49a1e072051e] i.m.server.McpAsyncServer                : Client initialize request - Protocol: 2025-06-18, Capabilities: ClientCapabilities[experimental=null, roots=null, sampling=null, elicitation=null, extensions=null], Info: Implementation[name=test, title=null, version=1, description=null, icons=null, websiteUrl=null]
2026-11-19T01:27:48.619-03:00  INFO 1980049 --- [           main] [a5fc3fba-f08c-4421-b43a-49a1e072051e] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 132ms userId=- planId=-
2026-11-19T01:27:48.632-03:00  INFO 1980049 --- [           main] [8721ecc0-5a71-45f4-86f0-b78abeca8c65] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 9ms userId=- planId=-
2026-11-19T01:27:48.656-03:00  INFO 1980049 --- [           main] [ffd9d82e-9c6c-4a2c-94d8-a5169b777817] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 23ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureHubIT#deleteFollowsT` - exit 0

```
2026-11-19T01:28:14.595-03:00  INFO 1980563 --- [           main] [0a3ee108-710a-403f-b05b-a89bbc7a9249] i.m.server.McpAsyncServer                : Client initialize request - Protocol: 2025-06-18, Capabilities: ClientCapabilities[experimental=null, roots=null, sampling=null, elicitation=null, extensions=null], Info: Implementation[name=test, title=null, version=1, description=null, icons=null, websiteUrl=null]
2026-11-19T01:28:14.596-03:00  INFO 1980563 --- [           main] [0a3ee108-710a-403f-b05b-a89bbc7a9249] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 2ms userId=- planId=-
2026-11-19T01:28:14.598-03:00  INFO 1980563 --- [           main] [9c8efeb3-2033-4f8d-95f4-1132e6f29a2b] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 1ms userId=- planId=-
2026-11-19T01:28:14.607-03:00  INFO 1980563 --- [           main] [560145fd-0a9b-46a1-b85f-6bea1872cc9a] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=restore_deletion user=3 plan=1 outcome=error durationMs=6
2026-11-19T01:28:14.607-03:00  INFO 1980563 --- [           main] [560145fd-0a9b-46a1-b85f-6bea1872cc9a] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 9ms userId=- planId=-
2026-11-19T01:28:14.612-03:00  INFO 1980563 --- [           main] [9ee03577-11a9-41da-ae25-a1e159a41fec] i.m.server.McpAsyncServer                : Client initialize request - Protocol: 2025-06-18, Capabilities: ClientCapabilities[experimental=null, roots=null, sampling=null, elicitation=null, extensions=null], Info: Implementation[name=test, title=null, version=1, description=null, icons=null, websiteUrl=null]
2026-11-19T01:28:14.613-03:00  INFO 1980563 --- [           main] [9ee03577-11a9-41da-ae25-a1e159a41fec] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 2ms userId=- planId=-
2026-11-19T01:28:14.615-03:00  INFO 1980563 --- [           main] [9a5eba26-7dc8-4277-a7b2-2338a3cbd6d1] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 1ms userId=- planId=-
2026-11-19T01:28:14.634-03:00  INFO 1980563 --- [           main] [be86fcd5-8235-4ce4-b8c9-10d18ed9bacc] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=restore_deletion user=2 plan=1 outcome=error durationMs=17
2026-11-19T01:28:14.635-03:00  INFO 1980563 --- [           main] [be86fcd5-8235-4ce4-b8c9-10d18ed9bacc] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 19ms userId=- planId=-
2026-11-19T01:28:14.642-03:00  INFO 1980563 --- [           main] [9fa1132d-2ad5-460b-aae0-206fd65843d4] i.m.server.McpAsyncServer                : Client initialize request - Protocol: 2025-06-18, Capabilities: ClientCapabilities[experimental=null, roots=null, sampling=null, elicitation=null, extensions=null], Info: Implementation[name=test, title=null, version=1, description=null, icons=null, websiteUrl=null]
2026-11-19T01:28:14.642-03:00  INFO 1980563 --- [           main] [9fa1132d-2ad5-460b-aae0-206fd65843d4] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 3ms userId=- planId=-
2026-11-19T01:28:14.645-03:00  INFO 1980563 --- [           main] [39233dd1-beba-4fe7-9fda-e271f77104e9] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 1ms userId=- planId=-
2026-11-19T01:28:14.661-03:00  INFO 1980563 --- [           main] [52dab736-2573-4fb7-a2e0-b9af783a8562] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=list_transactions user=1 plan=1 outcome=ok durationMs=14
2026-11-19T01:28:14.662-03:00  INFO 1980563 --- [           main] [52dab736-2573-4fb7-a2e0-b9af783a8562] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 17ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='OpenApiSnapshotIT#theGenerated` - exit 0

```
2026-11-19T01:28:39.413-03:00  INFO 1981075 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable resources templates capabilities, notification: true
2026-11-19T01:28:39.413-03:00  INFO 1981075 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable prompts capabilities, notification: true
2026-11-19T01:28:39.415-03:00  INFO 1981075 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable completions capabilities
2026-11-19T01:28:39.543-03:00  INFO 1981075 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-19T01:28:39.543-03:00  INFO 1981075 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-19T01:28:39.544-03:00  INFO 1981075 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-19T01:28:39.599-03:00  INFO 1981075 --- [           main] [] c.lcs.findraco.shared.OpenApiSnapshotIT  : Started OpenApiSnapshotIT in 8.868 seconds (process running for 10.223)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-19T01:28:40.480-03:00  INFO 1981075 --- [           main] [b96f622b-f773-4bfd-9424-648a3379b8e3] o.springdoc.api.AbstractOpenApiResource  : Init duration for springdoc-openapi is: 536 ms
2026-11-19T01:28:40.519-03:00  INFO 1981075 --- [           main] [b96f622b-f773-4bfd-9424-648a3379b8e3] c.l.f.shared.web.RequestLogFilter        : GET /v3/api-docs 200 602ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TransactionListFilterIT#filter` - exit 0

```
2026-11-19T01:29:04.939-03:00  INFO 1981589 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable resources capabilities, notification: true
2026-11-19T01:29:04.942-03:00  INFO 1981589 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable resources templates capabilities, notification: true
2026-11-19T01:29:04.942-03:00  INFO 1981589 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable prompts capabilities, notification: true
2026-11-19T01:29:04.944-03:00  INFO 1981589 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable completions capabilities
2026-11-19T01:29:05.071-03:00  INFO 1981589 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-19T01:29:05.072-03:00  INFO 1981589 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-19T01:29:05.073-03:00  INFO 1981589 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-19T01:29:05.128-03:00  INFO 1981589 --- [           main] [] c.l.f.t.TransactionListFilterIT          : Started TransactionListFilterIT in 8.747 seconds (process running for 10.03)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-19T01:29:05.768-03:00  INFO 1981589 --- [           main] [db79578c-4821-4cfd-b503-a8273a29bc0c] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction 404 188ms userId=2 planId=1
```
