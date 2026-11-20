# phase1-followups proofs

**HEAD**: 5dd4f403
**Tree**: clean
**Shell**: /bin/sh
**Result**: 19 pass, 0 fail

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
| C8 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='FormerMemberEditIT#editKeeping` | pass |
| C9 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='FormerMemberEditIT#seriesEditK` | pass |
| C10 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='FormerMemberEditIT#formerMembe` | pass |
| C11 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureHubIT#updateOfARowSh` | pass |
| C12 | `run stories / ✓ src/features/transactions/components/AttributionFields.stories.tsx > Former Participant` | pass |
| C12 | `run unit / ✓ TransactionFormDrawer > keeps a former member's share when saving` | pass |
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
 ✓ |storybook (chromium)| src/features/transactions/components/AttributionFields.stories.tsx > Single Payer 278ms
 ✓ |storybook (chromium)| src/features/transactions/components/AttributionFields.stories.tsx > Someone Else 43ms
 ✓ |storybook (chromium)| src/features/transactions/components/AttributionFields.stories.tsx > Split 83ms
 ✓ |storybook (chromium)| src/features/transactions/components/AttributionFields.stories.tsx > Former Participant 63ms
 ✓ |storybook (chromium)| src/features/transactions/components/AttributionFields.stories.tsx > Former Person 31ms
 ✓ |storybook (chromium)| src/features/transactions/components/AttributionFields.stories.tsx > Split Exact Shares 46ms

 Test Files  1 passed (1)
      Tests  6 passed (6)
   Start at  21:13:02
   Duration  1.94s (transform 0ms, setup 366ms, collect 255ms, tests 545ms, environment 0ms, prepare 2.10s)

No story files found for the specified pattern: src/**/*.mdx
```

`Run unit` - exit 0

```
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer language > shows user data as typed in Portuguese 33ms
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer > series starts requiring confirmation 173ms
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer > status keeps its value when another field changes 172ms
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer > status forecast unconfirms 142ms
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer > keeps a former member's share when saving 87ms
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer > shows the split of a row shared with a former member in a one-member plan 109ms
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer > the date field has no clear button 35ms
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer > one-off shows no confirmation controls 35ms

 Test Files  1 passed (1)
      Tests  34 passed (34)
   Start at  21:13:06
   Duration  7.71s (transform 358ms, setup 94ms, collect 2.81s, tests 4.31s, environment 322ms, prepare 41ms)

No story files found for the specified pattern: src/**/*.mdx
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TrashRuleRevisionIT#restoreAft` - exit 0

```
2026-11-19T21:13:35.416-03:00  INFO 2055187 --- [           main] [] c.l.f.transaction.TrashRuleRevisionIT    : Started TrashRuleRevisionIT in 10.483 seconds (process running for 11.664)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-19T21:13:35.988-03:00  WARN 2055187 --- [           main] [9d57c685-a812-4224-aee0-c24978193ff4] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-19T21:13:35.991-03:00  WARN 2055187 --- [           main] [9d57c685-a812-4224-aee0-c24978193ff4] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-19T21:13:35.992-03:00  WARN 2055187 --- [           main] [9d57c685-a812-4224-aee0-c24978193ff4] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-19T21:13:36.167-03:00  INFO 2055187 --- [           main] [9d57c685-a812-4224-aee0-c24978193ff4] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 286ms userId=1 planId=1
2026-11-19T21:13:36.254-03:00  INFO 2055187 --- [           main] [c864ffad-6b82-4d9b-b235-176f44a2355f] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 75ms userId=1 planId=1
2026-11-19T21:13:36.280-03:00  INFO 2055187 --- [           main] [83949e3b-0dbb-4855-b5a6-e507bf6dcf94] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 24ms userId=1 planId=1
2026-11-19T21:13:36.313-03:00  INFO 2055187 --- [           main] [5137ead2-5f5f-4883-ae72-c660d3c90307] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 200 31ms userId=1 planId=1
2026-11-19T21:13:36.401-03:00  INFO 2055187 --- [           main] [aeafe9e0-ccd1-44ec-880a-82a454836e89] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction 200 65ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TrashRuleRevisionIT#restoreAft` - exit 0

```
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-19T21:14:03.673-03:00  WARN 2055735 --- [           main] [19dfef24-533d-4803-ac9b-bd908152e3d4] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-19T21:14:03.676-03:00  WARN 2055735 --- [           main] [19dfef24-533d-4803-ac9b-bd908152e3d4] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-19T21:14:03.677-03:00  WARN 2055735 --- [           main] [19dfef24-533d-4803-ac9b-bd908152e3d4] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-19T21:14:03.837-03:00  INFO 2055735 --- [           main] [19dfef24-533d-4803-ac9b-bd908152e3d4] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 282ms userId=1 planId=1
2026-11-19T21:14:03.925-03:00  INFO 2055735 --- [           main] [0b8dedde-2667-4040-b032-e85c3e4cb65c] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 76ms userId=1 planId=1
2026-11-19T21:14:03.972-03:00  INFO 2055735 --- [           main] [3a7db413-3dda-49f7-95c9-5457437e4ac1] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 41ms userId=1 planId=1
2026-11-19T21:14:04.008-03:00  INFO 2055735 --- [           main] [b6e23aed-ece2-4fe6-8d2c-3b25b5925334] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 200 34ms userId=1 planId=1
2026-11-19T21:14:04.024-03:00  INFO 2055735 --- [           main] [8add1d65-6374-4bd5-95cc-76660940308f] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/{id} 200 14ms userId=1 planId=1
2026-11-19T21:14:04.098-03:00  INFO 2055735 --- [           main] [440d7813-f2fa-4d98-921e-23c08d408ccf] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/{id} 200 17ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TrashRuleRevisionIT#restoreAft` - exit 0

```
2026-11-19T21:14:30.325-03:00  INFO 2056260 --- [           main] [] c.l.f.transaction.TrashRuleRevisionIT    : Started TrashRuleRevisionIT in 9.093 seconds (process running for 10.311)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-19T21:14:30.889-03:00  WARN 2056260 --- [           main] [b4bc5ee1-705e-4899-b2ee-598149263e44] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-19T21:14:30.892-03:00  WARN 2056260 --- [           main] [b4bc5ee1-705e-4899-b2ee-598149263e44] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-19T21:14:30.892-03:00  WARN 2056260 --- [           main] [b4bc5ee1-705e-4899-b2ee-598149263e44] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-19T21:14:31.072-03:00  INFO 2056260 --- [           main] [b4bc5ee1-705e-4899-b2ee-598149263e44] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 297ms userId=1 planId=1
2026-11-19T21:14:31.165-03:00  INFO 2056260 --- [           main] [63121196-1047-41bf-a653-60c1bd4bc16f] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 81ms userId=1 planId=1
2026-11-19T21:14:31.235-03:00  INFO 2056260 --- [           main] [e4be639c-60e2-4c21-9565-39aa665d917d] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 63ms userId=1 planId=1
2026-11-19T21:14:31.267-03:00  INFO 2056260 --- [           main] [b734ad60-290c-4fce-baff-88a07dbee8f0] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 409 30ms userId=1 planId=1
2026-11-19T21:14:31.428-03:00  INFO 2056260 --- [           main] [935f1226-ef32-4cca-bc3e-f6ee608e1375] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction 200 73ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TrashRuleRevisionIT#restoreAft` - exit 0

```
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-19T21:14:58.016-03:00  WARN 2056788 --- [           main] [c4d5a20e-3bc7-4de8-a21e-05d8b792cdd6] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-19T21:14:58.026-03:00  WARN 2056788 --- [           main] [c4d5a20e-3bc7-4de8-a21e-05d8b792cdd6] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-19T21:14:58.027-03:00  WARN 2056788 --- [           main] [c4d5a20e-3bc7-4de8-a21e-05d8b792cdd6] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-19T21:14:58.199-03:00  INFO 2056788 --- [           main] [c4d5a20e-3bc7-4de8-a21e-05d8b792cdd6] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 304ms userId=1 planId=1
2026-11-19T21:14:58.285-03:00  INFO 2056788 --- [           main] [e8e31dcf-95e0-4c91-8939-bbe8ca25f00e] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 73ms userId=1 planId=1
2026-11-19T21:14:58.319-03:00  INFO 2056788 --- [           main] [6aaec4c7-521c-4ac5-b025-ee2172d4d419] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 31ms userId=1 planId=1
2026-11-19T21:14:58.358-03:00  INFO 2056788 --- [           main] [4f787ff1-8d00-4fe6-9583-e585db4d9d94] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 409 37ms userId=1 planId=1
2026-11-19T21:14:58.423-03:00  INFO 2056788 --- [           main] [bb227a50-1170-49ef-9410-e2fced516500] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 200 37ms userId=1 planId=1
2026-11-19T21:14:58.510-03:00  INFO 2056788 --- [           main] [f2c3d302-94d7-4dad-8fa9-f311cd8898e4] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction 200 85ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TrashRuleRevisionIT#restoreAft` - exit 0

```
2026-11-19T21:15:25.744-03:00  INFO 2057317 --- [           main] [719aad7c-09de-4318-a099-cbc5a714268e] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 80ms userId=1 planId=1
2026-11-19T21:15:25.810-03:00  INFO 2057317 --- [           main] [346cc020-aeb3-4a3c-9c01-d14a62d7ce80] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 60ms userId=1 planId=1
2026-11-19T21:15:25.845-03:00  INFO 2057317 --- [           main] [ecf6ae26-5e1e-42f5-898c-e3363b15130c] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 409 32ms userId=1 planId=1
2026-11-19T21:15:25.915-03:00  INFO 2057317 --- [           main] [9d6e2d0a-40e0-43f9-b6bf-7e66f33d4372] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 25ms userId=3 planId=2
2026-11-19T21:15:25.942-03:00  INFO 2057317 --- [           main] [4b0a6d99-27ea-4469-a83e-293cfac05fa2] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 24ms userId=3 planId=2
2026-11-19T21:15:25.985-03:00  INFO 2057317 --- [           main] [65b2447b-2c6c-4562-9454-af6e6ffce430] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 40ms userId=3 planId=2
2026-11-19T21:15:26.004-03:00  INFO 2057317 --- [           main] [aaebe350-7007-413c-acf0-e924bcd8dd6c] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 409 17ms userId=3 planId=2
2026-11-19T21:15:26.050-03:00  INFO 2057317 --- [           main] [5dc1226c-6e14-4f01-9023-13c227f3191d] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 28ms userId=5 planId=3
2026-11-19T21:15:26.079-03:00  INFO 2057317 --- [           main] [5d25d170-1f2e-4500-94e2-24bcb33430b7] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 26ms userId=5 planId=3
2026-11-19T21:15:26.157-03:00  INFO 2057317 --- [           main] [d9b0ad93-70a5-48a2-a30b-2e702496f664] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 73ms userId=5 planId=3
2026-11-19T21:15:26.174-03:00  INFO 2057317 --- [           main] [092dab83-ff87-48c9-a004-1f3e231e0842] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 409 15ms userId=5 planId=3
2026-11-19T21:15:26.208-03:00  INFO 2057317 --- [           main] [16b1ef52-313c-43fe-86e3-12ff38cd870c] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 19ms userId=7 planId=4
2026-11-19T21:15:26.231-03:00  INFO 2057317 --- [           main] [b9b4edc7-a1d6-4c4e-a7fa-70b373cab4ce] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 21ms userId=7 planId=4
2026-11-19T21:15:26.269-03:00  INFO 2057317 --- [           main] [98f04bd7-2ae1-4ad6-a642-b487a17c5c99] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 36ms userId=7 planId=4
2026-11-19T21:15:26.290-03:00  INFO 2057317 --- [           main] [af95f6cc-6040-4bac-a720-b9904af2b3d6] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 409 19ms userId=7 planId=4
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TrashRuleRevisionIT#flagOnlyEd` - exit 0

```
2026-11-19T21:15:52.655-03:00  INFO 2057839 --- [           main] [] c.l.f.transaction.TrashRuleRevisionIT    : Started TrashRuleRevisionIT in 9.242 seconds (process running for 10.437)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-19T21:15:53.243-03:00  WARN 2057839 --- [           main] [cc7381bf-5be5-467a-b065-7089b12edc8a] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-19T21:15:53.247-03:00  WARN 2057839 --- [           main] [cc7381bf-5be5-467a-b065-7089b12edc8a] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-19T21:15:53.247-03:00  WARN 2057839 --- [           main] [cc7381bf-5be5-467a-b065-7089b12edc8a] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-19T21:15:53.413-03:00  INFO 2057839 --- [           main] [cc7381bf-5be5-467a-b065-7089b12edc8a] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 278ms userId=1 planId=1
2026-11-19T21:15:53.500-03:00  INFO 2057839 --- [           main] [028b2b3f-8509-4048-aff4-d8760f7b9061] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 77ms userId=1 planId=1
2026-11-19T21:15:53.542-03:00  INFO 2057839 --- [           main] [478f7a92-99d3-48bb-9a4d-a31bfd55000b] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 37ms userId=1 planId=1
2026-11-19T21:15:53.572-03:00  INFO 2057839 --- [           main] [90854698-3f86-4a25-b992-2332e7299b55] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 200 28ms userId=1 planId=1
2026-11-19T21:15:53.637-03:00  INFO 2057839 --- [           main] [3d6bc235-9fef-4521-bf16-f52ac651b8dc] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction 200 63ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='MigrationsIT#ruleRevisionReset` - exit 0

```
2026-11-19T21:16:19.919-03:00  INFO 2058378 --- [           main] [] o.f.core.internal.command.DbMigrate      : Migrating schema "public" to version "19 - drop percent split mode"
2026-11-19T21:16:19.931-03:00  INFO 2058378 --- [           main] [] o.f.core.internal.command.DbMigrate      : Migrating schema "public" to version "20 - lowercase emails"
2026-11-19T21:16:19.942-03:00  INFO 2058378 --- [           main] [] o.f.core.internal.command.DbMigrate      : Migrating schema "public" to version "21 - cascade plan deletion"
2026-11-19T21:16:19.960-03:00  INFO 2058378 --- [           main] [] o.f.core.internal.command.DbMigrate      : Migrating schema "public" to version "22 - add user language"
2026-11-19T21:16:19.968-03:00  INFO 2058378 --- [           main] [] o.f.core.internal.command.DbMigrate      : Migrating schema "public" to version "23 - add transaction confirmation"
2026-11-19T21:16:19.978-03:00  INFO 2058378 --- [           main] [] o.f.core.internal.command.DbMigrate      : Migrating schema "public" to version "24 - add transaction scheduled date"
2026-11-19T21:16:19.987-03:00  INFO 2058378 --- [           main] [] o.f.core.internal.command.DbMigrate      : Migrating schema "public" to version "25 - add oauth authorization"
2026-11-19T21:16:19.997-03:00  INFO 2058378 --- [           main] [] o.f.core.internal.command.DbMigrate      : Migrating schema "public" to version "26 - add oauth rotated refresh tokens"
2026-11-19T21:16:20.008-03:00  INFO 2058378 --- [           main] [] o.f.core.internal.command.DbMigrate      : Migrating schema "public" to version "27 - add transaction trash"
2026-11-19T21:16:20.027-03:00  INFO 2058378 --- [           main] [] o.f.core.internal.command.DbMigrate      : Successfully applied 27 migrations to schema "public", now at version v27 (execution time 00:00.274s)
2026-11-19T21:16:20.059-03:00  INFO 2058378 --- [           main] [] org.flywaydb.core.FlywayExecutor         : Database: jdbc:postgresql://localhost:46329/findraco_test_v13_scratch?loggerLevel=OFF (PostgreSQL 16.14)
2026-11-19T21:16:20.081-03:00  INFO 2058378 --- [           main] [] o.f.core.internal.command.DbValidate     : Successfully validated 28 migrations (execution time 00:00.010s)
2026-11-19T21:16:20.096-03:00  INFO 2058378 --- [           main] [] o.f.core.internal.command.DbMigrate      : Current version of schema "public": 27
2026-11-19T21:16:20.099-03:00  INFO 2058378 --- [           main] [] o.f.core.internal.command.DbMigrate      : Migrating schema "public" to version "28 - add recurrence rule revision"
2026-11-19T21:16:20.110-03:00  INFO 2058378 --- [           main] [] o.f.core.internal.command.DbMigrate      : Successfully applied 1 migration to schema "public", now at version v28 (execution time 00:00.005s)
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TrashRuleRevisionIT#restoringO` - exit 0

```
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-19T21:16:47.277-03:00  WARN 2058892 --- [           main] [75ef3c0b-c783-4651-b3c8-d8260d1fcd7a] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-19T21:16:47.280-03:00  WARN 2058892 --- [           main] [75ef3c0b-c783-4651-b3c8-d8260d1fcd7a] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-19T21:16:47.281-03:00  WARN 2058892 --- [           main] [75ef3c0b-c783-4651-b3c8-d8260d1fcd7a] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-19T21:16:47.470-03:00  INFO 2058892 --- [           main] [75ef3c0b-c783-4651-b3c8-d8260d1fcd7a] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 307ms userId=1 planId=1
2026-11-19T21:16:47.545-03:00  INFO 2058892 --- [           main] [b24dae73-5823-4adf-8f65-c7a0610a8dca] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 64ms userId=1 planId=1
2026-11-19T21:16:47.574-03:00  INFO 2058892 --- [           main] [4335acba-95a3-4d76-9203-76265ab6ad8f] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 27ms userId=1 planId=1
2026-11-19T21:16:47.610-03:00  INFO 2058892 --- [           main] [3f289737-8a89-46d8-b89d-9733036ed21c] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 200 34ms userId=1 planId=1
2026-11-19T21:16:47.630-03:00  INFO 2058892 --- [           main] [2363beae-920c-4062-b2fb-564250809e82] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/trash/{deletionId}/restore 200 18ms userId=1 planId=1
2026-11-19T21:16:47.698-03:00  INFO 2058892 --- [           main] [1bf17f6e-a769-40cf-b4b1-b8265606c172] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction 200 66ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='FormerMemberEditIT#editKeeping` - exit 0

```
2026-11-19T21:17:13.578-03:00  WARN 2059423 --- [           main] [d7297f8d-56eb-494f-be3c-7e921538bfeb] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#items()
2026-11-19T21:17:13.582-03:00  WARN 2059423 --- [           main] [d7297f8d-56eb-494f-be3c-7e921538bfeb] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-19T21:17:13.583-03:00  WARN 2059423 --- [           main] [d7297f8d-56eb-494f-be3c-7e921538bfeb] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-19T21:17:13.583-03:00  WARN 2059423 --- [           main] [d7297f8d-56eb-494f-be3c-7e921538bfeb] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List)
2026-11-19T21:17:13.584-03:00  WARN 2059423 --- [           main] [d7297f8d-56eb-494f-be3c-7e921538bfeb] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List)
2026-11-19T21:17:13.584-03:00  WARN 2059423 --- [           main] [d7297f8d-56eb-494f-be3c-7e921538bfeb] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#participants()
2026-11-19T21:17:13.738-03:00  INFO 2059423 --- [           main] [d7297f8d-56eb-494f-be3c-7e921538bfeb] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 292ms userId=1 planId=1
2026-11-19T21:17:13.766-03:00  WARN 2059423 --- [           main] [d3519b03-49c5-4b70-8b87-a2b69e302748] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-19T21:17:13.766-03:00  WARN 2059423 --- [           main] [d3519b03-49c5-4b70-8b87-a2b69e302748] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-19T21:17:13.766-03:00  WARN 2059423 --- [           main] [d3519b03-49c5-4b70-8b87-a2b69e302748] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#participants()
2026-11-19T21:17:13.767-03:00  WARN 2059423 --- [           main] [d3519b03-49c5-4b70-8b87-a2b69e302748] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#com.lcs.findraco.transaction.request.UpdateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, Long)
2026-11-19T21:17:13.767-03:00  WARN 2059423 --- [           main] [d3519b03-49c5-4b70-8b87-a2b69e302748] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#com.lcs.findraco.transaction.request.UpdateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, Long)
2026-11-19T21:17:13.767-03:00  WARN 2059423 --- [           main] [d3519b03-49c5-4b70-8b87-a2b69e302748] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#items()
2026-11-19T21:17:13.811-03:00  INFO 2059423 --- [           main] [d3519b03-49c5-4b70-8b87-a2b69e302748] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/{id} 200 56ms userId=1 planId=1
2026-11-19T21:17:13.888-03:00  INFO 2059423 --- [           main] [60abbf7c-6a7e-4b98-a05b-30754e7c29af] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/{id} 200 18ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='FormerMemberEditIT#seriesEditK` - exit 0

```
2026-11-19T21:17:39.713-03:00  INFO 2059943 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-19T21:17:39.713-03:00  INFO 2059943 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-19T21:17:39.715-03:00  INFO 2059943 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 2 ms
2026-11-19T21:17:39.769-03:00  INFO 2059943 --- [           main] [] c.l.f.transaction.FormerMemberEditIT     : Started FormerMemberEditIT in 9.193 seconds (process running for 10.361)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
2026-11-19T21:17:40.334-03:00  WARN 2059943 --- [           main] [5368b5f4-b4c2-4d81-a7b4-8ad18411d860] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#com.lcs.findraco.transaction.request.CreateSeriesRequest(TransactionType, BigDecimal, String, Long, RecurrenceMode, LocalDate, Integer, Integer, RecurrenceInterval, LocalDate, SplitMode, List, Boolean)
2026-11-19T21:17:40.338-03:00  WARN 2059943 --- [           main] [5368b5f4-b4c2-4d81-a7b4-8ad18411d860] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-19T21:17:40.338-03:00  WARN 2059943 --- [           main] [5368b5f4-b4c2-4d81-a7b4-8ad18411d860] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateSeriesRequest#participants()
2026-11-19T21:17:40.525-03:00  INFO 2059943 --- [           main] [5368b5f4-b4c2-4d81-a7b4-8ad18411d860] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 298ms userId=1 planId=1
2026-11-19T21:17:40.623-03:00  INFO 2059943 --- [           main] [d52a6770-ca7b-47cd-a299-443fdb2fdb6f] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/series/{seriesId} 200 83ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='FormerMemberEditIT#formerMembe` - exit 0

```
2026-11-19T21:18:06.890-03:00  WARN 2060472 --- [           main] [20c77e25-d9ee-402c-a7eb-15babc45213b] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-19T21:18:06.891-03:00  WARN 2060472 --- [           main] [20c77e25-d9ee-402c-a7eb-15babc45213b] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-19T21:18:06.891-03:00  WARN 2060472 --- [           main] [20c77e25-d9ee-402c-a7eb-15babc45213b] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#items()
2026-11-19T21:18:06.891-03:00  WARN 2060472 --- [           main] [20c77e25-d9ee-402c-a7eb-15babc45213b] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List)
2026-11-19T21:18:06.891-03:00  WARN 2060472 --- [           main] [20c77e25-d9ee-402c-a7eb-15babc45213b] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List)
2026-11-19T21:18:07.039-03:00  INFO 2060472 --- [           main] [20c77e25-d9ee-402c-a7eb-15babc45213b] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 201 266ms userId=1 planId=1
2026-11-19T21:18:07.060-03:00  WARN 2060472 --- [           main] [fea98881-67da-4353-b78c-92c3f0349f8b] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#com.lcs.findraco.transaction.request.UpdateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, Long)
2026-11-19T21:18:07.060-03:00  WARN 2060472 --- [           main] [fea98881-67da-4353-b78c-92c3f0349f8b] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#com.lcs.findraco.transaction.request.UpdateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, Long)
2026-11-19T21:18:07.060-03:00  WARN 2060472 --- [           main] [fea98881-67da-4353-b78c-92c3f0349f8b] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-19T21:18:07.060-03:00  WARN 2060472 --- [           main] [fea98881-67da-4353-b78c-92c3f0349f8b] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-19T21:18:07.060-03:00  WARN 2060472 --- [           main] [fea98881-67da-4353-b78c-92c3f0349f8b] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#participants()
2026-11-19T21:18:07.060-03:00  WARN 2060472 --- [           main] [fea98881-67da-4353-b78c-92c3f0349f8b] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#items()
2026-11-19T21:18:07.093-03:00  INFO 2060472 --- [           main] [fea98881-67da-4353-b78c-92c3f0349f8b] c.l.f.shared.web.RequestLogFilter        : PUT /api/findraco/plan/{planId}/transaction/{id} 422 43ms userId=1 planId=1
2026-11-19T21:18:07.136-03:00  INFO 2060472 --- [           main] [fda4f30b-a614-4a41-8896-e1f66fdb8476] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction 422 12ms userId=1 planId=1
2026-11-19T21:18:07.149-03:00  INFO 2060472 --- [           main] [a77a1f41-32e9-4028-8706-b828c4fad773] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/{id} 200 10ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureHubIT#updateOfARowSh` - exit 0

```
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-19T21:18:33.416-03:00  INFO 2060988 --- [           main] [383a9901-2c49-4965-b6c4-749b9071f2be] i.m.server.McpAsyncServer                : Client initialize request - Protocol: 2025-06-18, Capabilities: ClientCapabilities[experimental=null, roots=null, sampling=null, elicitation=null, extensions=null], Info: Implementation[name=test, title=null, version=1, description=null, icons=null, websiteUrl=null]
2026-11-19T21:18:33.435-03:00  INFO 2060988 --- [           main] [383a9901-2c49-4965-b6c4-749b9071f2be] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 129ms userId=- planId=-
2026-11-19T21:18:33.453-03:00  INFO 2060988 --- [           main] [21f96df7-3aa7-4c1f-94f0-7b390eebfff2] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 14ms userId=- planId=-
2026-11-19T21:18:33.598-03:00  WARN 2060988 --- [           main] [0c3ee34c-ebab-481a-9e69-0de3a4fb1c9e] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#participants()
2026-11-19T21:18:33.601-03:00  WARN 2060988 --- [           main] [0c3ee34c-ebab-481a-9e69-0de3a4fb1c9e] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#items()
2026-11-19T21:18:33.602-03:00  WARN 2060988 --- [           main] [0c3ee34c-ebab-481a-9e69-0de3a4fb1c9e] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-19T21:18:33.602-03:00  WARN 2060988 --- [           main] [0c3ee34c-ebab-481a-9e69-0de3a4fb1c9e] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#com.lcs.findraco.transaction.request.UpdateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, Long)
2026-11-19T21:18:33.602-03:00  WARN 2060988 --- [           main] [0c3ee34c-ebab-481a-9e69-0de3a4fb1c9e] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#com.lcs.findraco.transaction.request.UpdateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, Long)
2026-11-19T21:18:33.602-03:00  WARN 2060988 --- [           main] [0c3ee34c-ebab-481a-9e69-0de3a4fb1c9e] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-19T21:18:33.651-03:00  INFO 2060988 --- [           main] [0c3ee34c-ebab-481a-9e69-0de3a4fb1c9e] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=update_transaction user=1 plan=1 outcome=ok durationMs=181
2026-11-19T21:18:33.666-03:00  INFO 2060988 --- [           main] [0c3ee34c-ebab-481a-9e69-0de3a4fb1c9e] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 211ms userId=- planId=-
2026-11-19T21:18:33.742-03:00  INFO 2060988 --- [           main] [93300ef8-0a4a-44c4-9819-ddd106e47895] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/{id} 200 38ms userId=1 planId=1
```
