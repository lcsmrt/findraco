# mcp-connector proofs

**HEAD**: 8112379c
**Tree**: clean
**Shell**: /bin/sh
**Result**: 71 pass, 0 fail

| Check | Proof | Result |
| --- | --- | --- |
| C1 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q test -Dtest='ConfigurationPropertiesTest#oauthRe` | pass |
| C2 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='MigrationsIT#oauthTablesExist'` | pass |
| C3 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q test -Dtest='CimdRegisteredClientRepositoryTest#` | pass |
| C4 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q test -Dtest='CimdRegisteredClientRepositoryTest#` | pass |
| C5 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q test -Dtest='CimdRegisteredClientRepositoryTest#` | pass |
| C6 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q test -Dtest='CimdRegisteredClientRepositoryTest#` | pass |
| C7 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q test -Dtest='CimdRegisteredClientRepositoryTest#` | pass |
| C8 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='AuthorizationServerIT#metadata` | pass |
| C9 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='AuthorizationServerIT#noRegist` | pass |
| C10 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='AuthorizationServerIT#anonymou` | pass |
| C11 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='AuthorizationServerIT#signedIn` | pass |
| C12 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='AuthorizationServerIT#clientIn` | pass |
| C13 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='AuthorizationServerIT#allowIss` | pass |
| C14 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='AuthorizationServerIT#denyRetu` | pass |
| C15 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='AuthorizationServerIT#missingP` | pass |
| C16 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='AuthorizationServerIT#codeExch` | pass |
| C17 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='AuthorizationServerIT#unlisted` | pass |
| C18 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='OAuthRefreshIT#refreshRotates'` | pass |
| C19 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='OAuthRefreshIT#idleRefreshExpi` | pass |
| C20 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='OAuthRefreshIT#replayRevokesGr` | pass |
| C21 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='OAuthRefreshIT#passwordResetRe` | pass |
| C22 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='OAuthRefreshIT#unlistedClientC` | pass |
| C23 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpSecurityIT#anonymousGetsRes` | pass |
| C24 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpSecurityIT#protectedResourc` | pass |
| C25 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpSecurityIT#tokensDoNotCross` | pass |
| C26 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpSecurityIT#wrongAudienceOrS` | pass |
| C27 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpPlanToolsIT#listPlansShowsA` | pass |
| C28 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpPlanToolsIT#planResolvesByD` | pass |
| C29 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q test -Dtest='McpNamesTest#matchesIgnoringCaseAnd` | pass |
| C30 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpPlanToolsIT#unknownOrAmbigu` | pass |
| C31 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpSecurityIT#rateLimitIsToolE` | pass |
| C32 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpPlanToolsIT#unexpectedFailu` | pass |
| C33 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpPlanToolsIT#callLogOmitsArg` | pass |
| C34 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpReadToolsIT#listCategories'` | pass |
| C35 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpReadToolsIT#listTransaction` | pass |
| C36 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpReadToolsIT#listTransaction` | pass |
| C37 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpReadToolsIT#monthSummaryMat` | pass |
| C38 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpReadToolsIT#categorySpendin` | pass |
| C39 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpReadToolsIT#todayFollowsSav` | pass |
| C40 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpReadToolsIT#readToolsAreRea` | pass |
| C41 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureToolsIT#createPaidBy` | pass |
| C42 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureToolsIT#createDefaul` | pass |
| C43 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureToolsIT#createResolv` | pass |
| C44 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureToolsIT#createReject` | pass |
| C45 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureToolsIT#writeResultN` | pass |
| C46 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureToolsIT#createSchema` | pass |
| C47 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureToolsIT#confirmRecor` | pass |
| C48 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureToolsIT#confirmRecom` | pass |
| C49 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureToolsIT#confirmNotAw` | pass |
| C50 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureToolsIT#roleMatrixFo` | pass |
| C51 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureToolsIT#otherPlanIdN` | pass |
| C52 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureToolsIT#writeHints' ` | pass |
| C53 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q test -Dtest='McpUpdateCopyTest#keepsEveryStoredF` | pass |
| C54 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpUpdateToolIT#updateKeepsIte` | pass |
| C55 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpUpdateToolIT#occurrenceEdit` | pass |
| C56 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpUpdateToolIT#emptyUpdateIsT` | pass |
| C57 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpUpdateToolIT#splitRulesOnAm` | pass |
| C58 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpUpdateToolIT#amountBelowIte` | pass |
| C59 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpUpdateToolIT#staleVersionIs` | pass |
| C60 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpUpdateToolIT#viewerCannotEd` | pass |
| C61 | `run unit / ✓ getOAuthClientInfo > requests the client by id` | pass |
| C62 | `run unit / ✓ OAuthLoginPage > submits the form to the authorization server` | pass |
| C63 | `run stories / ✓ OAuthConsentView.stories.tsx > Ready` | pass |
| C64 | `run stories / ✓ OAuthConsentView.stories.tsx > Unknown Client` | pass |
| C65 | `run stories / ✓ OAuthLoginView.stories.tsx > Wrong Credentials` | pass |
| C66 | `run unit / ✓ OAuthConsentPage > posts the decision to the authorization server` | pass |
| C67 | `cd frontend && grep -q "oauth2" vite.config.ts && grep -q "well-known" vite.config.ts && grep -q "\\\\/mcp" vi` | pass |
| Build | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -DskipITs -Dsurefire.skip=true` | pass |
| Build | `cd frontend && pnpm lint` | pass |
| Build | `cd frontend && pnpm build` | pass |
| Build | `cd frontend && node scripts/check-siblings.ts` | pass |

## Output

`Run unit` - exit 0

```
 ✓ |unit| src/api/services/useInvitationService.test.ts > invitation mutations show their short success message > create shows "Invitation created." (NAV-05 AC 1, 2) 72ms
 ✓ |unit| src/features/oauth/OAuthConsentPage.test.tsx > OAuthConsentPage > posts the decision to the authorization server 195ms
 ✓ |unit| src/features/oauth/OAuthConsentPage.test.tsx > OAuthConsentPage > offers no decision when the app is unknown 22ms
 ✓ |unit| src/api/services/useInvitationService.test.ts > invitation mutations show their short success message > revoke shows "Invitation revoked." (NAV-05 AC 1, 2) 53ms
 ✓ |unit| src/api/services/useInvitationService.test.ts > invitation mutations show their short success message > accept shows "You joined the plan." (NAV-05 AC 1, 2) 53ms
 ✓ |unit| src/api/services/useOAuthService.test.ts > getOAuthClientInfo > requests the client by id 69ms
 ✓ |unit| src/features/oauth/utils/csrfToken.test.ts > readCsrfToken > returns the raw value of the XSRF-TOKEN cookie among others 1ms
 ✓ |unit| src/features/oauth/utils/csrfToken.test.ts > readCsrfToken > returns an empty string when the cookie is absent 0ms

 Test Files  10 passed (10)
      Tests  53 passed (53)
   Start at  16:10:25
   Duration  2.55s (transform 397ms, setup 910ms, collect 2.59s, tests 3.04s, environment 4.26s, prepare 459ms)

No story files found for the specified pattern: src/**/*.mdx
```

`Run stories` - exit 0

```
info Using tsconfig paths for react-docgen
info Using tsconfig paths for react-docgen
info Using tsconfig paths for react-docgen
 ✓ |storybook (chromium)| src/features/oauth/OAuthConsentView.stories.tsx > Ready 249ms
 ✓ |storybook (chromium)| src/features/oauth/OAuthConsentView.stories.tsx > Unknown Client 38ms
 ✓ |storybook (chromium)| src/features/oauth/OAuthLoginView.stories.tsx > Sign In 246ms
 ✓ |storybook (chromium)| src/features/oauth/OAuthLoginView.stories.tsx > Wrong Credentials 46ms
 ✓ |storybook (chromium)| src/features/oauth/OAuthLoginView.stories.tsx > Rate Limited 27ms

 Test Files  2 passed (2)
      Tests  5 passed (5)
   Start at  16:10:30
   Duration  1.79s (transform 0ms, setup 822ms, collect 241ms, tests 610ms, environment 0ms, prepare 4.22s)

No story files found for the specified pattern: src/**/*.mdx
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q test -Dtest='ConfigurationPropertiesTest#oauthRe` - exit 0

```
16:10:36.968 [main] INFO org.hibernate.validator.internal.util.Version -- HV000001: Hibernate Validator 9.1.5.Final
16:10:37.347 [main] WARN org.springframework.context.annotation.AnnotationConfigApplicationContext -- Exception encountered during context initialization - cancelling refresh attempt: org.springframework.boot.context.properties.ConfigurationPropertiesBindException: Error creating bean with name 'app.oauth-com.lcs.findraco.shared.config.OAuthProperties': Could not bind properties to 'OAuthProperties' : prefix=app.oauth, ignoreInvalidFields=false, ignoreUnknownFields=true
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='MigrationsIT#oauthTablesExist'` - exit 0

```
2026-11-08T16:11:00.262-03:00  INFO 1207570 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Registered tools: 8
2026-11-08T16:11:00.262-03:00  INFO 1207570 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable resources capabilities, notification: true
2026-11-08T16:11:00.264-03:00  INFO 1207570 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable resources templates capabilities, notification: true
2026-11-08T16:11:00.265-03:00  INFO 1207570 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable prompts capabilities, notification: true
2026-11-08T16:11:00.266-03:00  INFO 1207570 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable completions capabilities
2026-11-08T16:11:00.393-03:00  INFO 1207570 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-08T16:11:00.393-03:00  INFO 1207570 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-08T16:11:00.394-03:00  INFO 1207570 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-08T16:11:00.455-03:00  INFO 1207570 --- [           main] [] com.lcs.findraco.MigrationsIT            : Started MigrationsIT in 12.145 seconds (process running for 13.276)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q test -Dtest='CimdRegisteredClientRepositoryTest#` - exit 0

```
(no output)
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q test -Dtest='CimdRegisteredClientRepositoryTest#` - exit 0

```
(no output)
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q test -Dtest='CimdRegisteredClientRepositoryTest#` - exit 0

```
16:11:20.568 [main] WARN com.lcs.findraco.auth.service.CimdRegisteredClientRepository -- Client metadata document http://127.0.0.1:33551/other-id refused: client_id names another client
16:11:20.607 [main] WARN com.lcs.findraco.auth.service.CimdRegisteredClientRepository -- Client metadata document http://127.0.0.1:33551/secret refused: token_endpoint_auth_method is not none
16:11:20.610 [main] WARN com.lcs.findraco.auth.service.CimdRegisteredClientRepository -- Client metadata document http://127.0.0.1:33551/no-code refused: grant_types lacks authorization_code
16:11:20.612 [main] WARN com.lcs.findraco.auth.service.CimdRegisteredClientRepository -- Client metadata document http://127.0.0.1:33551/plain-http refused: a redirect URI is neither https nor loopback
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q test -Dtest='CimdRegisteredClientRepositoryTest#` - exit 0

```
(no output)
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q test -Dtest='CimdRegisteredClientRepositoryTest#` - exit 0

```
16:11:31.088 [main] WARN com.lcs.findraco.auth.service.CimdRegisteredClientRepository -- Client metadata document http://127.0.0.1:42763/oauth/client could not be fetched: UncheckedIOException
16:11:31.095 [main] WARN com.lcs.findraco.auth.service.CimdRegisteredClientRepository -- Client metadata document http://127.0.0.1:42763/oauth/client could not be fetched: UncheckedIOException
16:11:31.100 [main] WARN com.lcs.findraco.auth.service.CimdRegisteredClientRepository -- Client metadata document http://127.0.0.1:42763/oauth/client could not be fetched: UncheckedIOException
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='AuthorizationServerIT#metadata` - exit 0

```
2026-11-08T16:11:51.081-03:00  INFO 1209749 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable resources capabilities, notification: true
2026-11-08T16:11:51.083-03:00  INFO 1209749 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable resources templates capabilities, notification: true
2026-11-08T16:11:51.083-03:00  INFO 1209749 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable prompts capabilities, notification: true
2026-11-08T16:11:51.084-03:00  INFO 1209749 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable completions capabilities
2026-11-08T16:11:51.210-03:00  INFO 1209749 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-08T16:11:51.210-03:00  INFO 1209749 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-08T16:11:51.212-03:00  INFO 1209749 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 2 ms
2026-11-08T16:11:51.277-03:00  INFO 1209749 --- [           main] [] c.l.findraco.auth.AuthorizationServerIT  : Started AuthorizationServerIT in 9.167 seconds (process running for 10.317)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-08T16:11:51.615-03:00  INFO 1209749 --- [           main] [19506c99-9a67-4160-ab06-41dc5898d894] c.l.f.shared.web.RequestLogFilter        : GET - 200 16ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='AuthorizationServerIT#noRegist` - exit 0

```
2026-11-08T16:12:15.129-03:00  INFO 1210313 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable resources capabilities, notification: true
2026-11-08T16:12:15.131-03:00  INFO 1210313 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable resources templates capabilities, notification: true
2026-11-08T16:12:15.131-03:00  INFO 1210313 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable prompts capabilities, notification: true
2026-11-08T16:12:15.132-03:00  INFO 1210313 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable completions capabilities
2026-11-08T16:12:15.268-03:00  INFO 1210313 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-08T16:12:15.268-03:00  INFO 1210313 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-08T16:12:15.270-03:00  INFO 1210313 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 2 ms
2026-11-08T16:12:15.326-03:00  INFO 1210313 --- [           main] [] c.l.findraco.auth.AuthorizationServerIT  : Started AuthorizationServerIT in 9.206 seconds (process running for 10.504)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-08T16:12:15.680-03:00  INFO 1210313 --- [           main] [dba4e41f-6259-46c4-807c-22b5268dd42b] c.l.f.shared.web.RequestLogFilter        : POST /** 404 36ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='AuthorizationServerIT#anonymou` - exit 0

```
2026-11-08T16:12:38.178-03:00  INFO 1210870 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable resources templates capabilities, notification: true
2026-11-08T16:12:38.178-03:00  INFO 1210870 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable prompts capabilities, notification: true
2026-11-08T16:12:38.179-03:00  INFO 1210870 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable completions capabilities
2026-11-08T16:12:38.311-03:00  INFO 1210870 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-08T16:12:38.312-03:00  INFO 1210870 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-08T16:12:38.313-03:00  INFO 1210870 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-08T16:12:38.369-03:00  INFO 1210870 --- [           main] [] c.l.findraco.auth.AuthorizationServerIT  : Started AuthorizationServerIT in 8.916 seconds (process running for 10.161)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-08T16:12:38.724-03:00  WARN 1210870 --- [           main] [caf19ac3-b2ea-40e0-9be5-617b3873ddf1] c.l.f.a.s.CimdRegisteredClientRepository : Client metadata document http://127.0.0.1:1/oauth/test-client could not be fetched: ResourceAccessException
2026-11-08T16:12:38.730-03:00  INFO 1210870 --- [           main] [caf19ac3-b2ea-40e0-9be5-617b3873ddf1] c.l.f.shared.web.RequestLogFilter        : GET - 302 46ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='AuthorizationServerIT#signedIn` - exit 0

```
2026-11-08T16:13:01.551-03:00  INFO 1211439 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable completions capabilities
2026-11-08T16:13:01.676-03:00  INFO 1211439 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-08T16:13:01.677-03:00  INFO 1211439 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-08T16:13:01.678-03:00  INFO 1211439 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-08T16:13:01.742-03:00  INFO 1211439 --- [           main] [] c.l.findraco.auth.AuthorizationServerIT  : Started AuthorizationServerIT in 8.912 seconds (process running for 10.112)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-08T16:13:02.146-03:00  WARN 1211439 --- [           main] [3b43c9c8-3293-4f43-9d1f-995b2f5c0db6] c.l.f.a.s.CimdRegisteredClientRepository : Client metadata document http://127.0.0.1:1/oauth/test-client could not be fetched: ResourceAccessException
2026-11-08T16:13:02.153-03:00  INFO 1211439 --- [           main] [3b43c9c8-3293-4f43-9d1f-995b2f5c0db6] c.l.f.shared.web.RequestLogFilter        : GET - 302 42ms userId=- planId=-
2026-11-08T16:13:02.411-03:00  INFO 1211439 --- [           main] [1e0adb3d-7fa0-4c0b-8ef1-074f83176c4a] c.l.f.shared.web.RequestLogFilter        : POST - 302 254ms userId=- planId=-
2026-11-08T16:13:02.445-03:00  INFO 1211439 --- [           main] [2645e26c-92a8-4af9-903d-34cc576d3ca0] c.l.f.shared.web.RequestLogFilter        : GET - 302 33ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='AuthorizationServerIT#clientIn` - exit 0

```
2026-11-08T16:13:25.658-03:00  INFO 1212008 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable prompts capabilities, notification: true
2026-11-08T16:13:25.659-03:00  INFO 1212008 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable completions capabilities
2026-11-08T16:13:25.785-03:00  INFO 1212008 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-08T16:13:25.785-03:00  INFO 1212008 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-08T16:13:25.787-03:00  INFO 1212008 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 2 ms
2026-11-08T16:13:25.846-03:00  INFO 1212008 --- [           main] [] c.l.findraco.auth.AuthorizationServerIT  : Started AuthorizationServerIT in 9.027 seconds (process running for 10.207)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-08T16:13:26.225-03:00  WARN 1212008 --- [           main] [d8094c29-14f6-4a1e-bf63-bc4cb54d0b0f] c.l.f.a.s.CimdRegisteredClientRepository : Client metadata document http://127.0.0.1:1/oauth/test-client could not be fetched: ResourceAccessException
2026-11-08T16:13:26.237-03:00  INFO 1212008 --- [           main] [d8094c29-14f6-4a1e-bf63-bc4cb54d0b0f] c.l.f.shared.web.RequestLogFilter        : GET /oauth2/client-info 200 65ms userId=- planId=-
2026-11-08T16:13:26.271-03:00  INFO 1212008 --- [           main] [2498d16a-aafd-4c69-be8f-1069b61888c7] c.l.f.shared.web.RequestLogFilter        : GET /oauth2/client-info 404 6ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='AuthorizationServerIT#allowIss` - exit 0

```
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-08T16:13:49.957-03:00  WARN 1212560 --- [           main] [280eb38e-43ef-4f26-9978-70cfe3f7613b] c.l.f.a.s.CimdRegisteredClientRepository : Client metadata document http://127.0.0.1:1/oauth/test-client could not be fetched: ResourceAccessException
2026-11-08T16:13:49.964-03:00  INFO 1212560 --- [           main] [280eb38e-43ef-4f26-9978-70cfe3f7613b] c.l.f.shared.web.RequestLogFilter        : GET - 302 50ms userId=- planId=-
2026-11-08T16:13:50.195-03:00  INFO 1212560 --- [           main] [fedf83e8-dc97-4e0c-ae9f-4478f3f7c82f] c.l.f.shared.web.RequestLogFilter        : POST - 302 228ms userId=- planId=-
2026-11-08T16:13:50.229-03:00  INFO 1212560 --- [           main] [dc48c9ee-31c0-47a5-8df4-26209f1e2d6a] c.l.f.shared.web.RequestLogFilter        : GET - 302 32ms userId=- planId=-
2026-11-08T16:13:50.289-03:00  INFO 1212560 --- [           main] [827537c4-fa01-4c78-90aa-877a9bfab65d] c.l.f.shared.web.RequestLogFilter        : POST - 302 58ms userId=- planId=-
2026-11-08T16:13:50.393-03:00  INFO 1212560 --- [           main] [5a7c3c7c-77e1-4d3c-bb38-2c7c67dde89c] c.l.f.shared.web.RequestLogFilter        : POST - 200 50ms userId=- planId=-
2026-11-08T16:13:50.416-03:00  WARN 1212560 --- [           main] [1b4b9202-d40c-4508-a636-228f5224db74] 2AuthorizationCodeAuthenticationProvider : Invalidated authorization token(s) previously issued to registered client 'http://127.0.0.1:1/oauth/test-client'
2026-11-08T16:13:50.417-03:00  INFO 1212560 --- [           main] [1b4b9202-d40c-4508-a636-228f5224db74] c.l.f.shared.web.RequestLogFilter        : POST - 400 24ms userId=- planId=-
2026-11-08T16:13:50.445-03:00  INFO 1212560 --- [           main] [7deee657-0810-422b-97c9-cd23123d3d35] c.l.f.shared.web.RequestLogFilter        : GET - 302 0ms userId=- planId=-
2026-11-08T16:13:50.476-03:00  INFO 1212560 --- [           main] [9362e4fa-9a00-4e70-a7b9-4df7082c8a8f] c.l.f.shared.web.RequestLogFilter        : POST - 302 30ms userId=- planId=-
2026-11-08T16:13:50.481-03:00  INFO 1212560 --- [           main] [240bdb98-31ad-478f-8b1e-48c80054d0fc] c.l.f.shared.web.RequestLogFilter        : GET - 302 4ms userId=- planId=-
2026-11-08T16:13:50.496-03:00  INFO 1212560 --- [           main] [6a25e61a-30cc-4b46-8d4a-02fde84006f7] c.l.f.shared.web.RequestLogFilter        : POST - 302 13ms userId=- planId=-
2026-11-08T16:13:50.503-03:00  INFO 1212560 --- [           main] [57d878ca-4013-4ce0-891c-d67b30f52158] c.l.f.shared.web.RequestLogFilter        : POST - 400 5ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='AuthorizationServerIT#denyRetu` - exit 0

```
2026-11-08T16:14:13.840-03:00  INFO 1213104 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-08T16:14:13.841-03:00  INFO 1213104 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-08T16:14:13.842-03:00  INFO 1213104 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-08T16:14:13.898-03:00  INFO 1213104 --- [           main] [] c.l.findraco.auth.AuthorizationServerIT  : Started AuthorizationServerIT in 8.924 seconds (process running for 10.183)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-08T16:14:14.307-03:00  WARN 1213104 --- [           main] [3fa78cb1-7d58-425e-a6b4-37e0341f1750] c.l.f.a.s.CimdRegisteredClientRepository : Client metadata document http://127.0.0.1:1/oauth/test-client could not be fetched: ResourceAccessException
2026-11-08T16:14:14.313-03:00  INFO 1213104 --- [           main] [3fa78cb1-7d58-425e-a6b4-37e0341f1750] c.l.f.shared.web.RequestLogFilter        : GET - 302 42ms userId=- planId=-
2026-11-08T16:14:14.562-03:00  INFO 1213104 --- [           main] [7683f387-3ba8-4ffc-b3db-2adfee9193dc] c.l.f.shared.web.RequestLogFilter        : POST - 302 245ms userId=- planId=-
2026-11-08T16:14:14.594-03:00  INFO 1213104 --- [           main] [18dea435-7133-43bf-ada3-c16f1c6769b0] c.l.f.shared.web.RequestLogFilter        : GET - 302 30ms userId=- planId=-
2026-11-08T16:14:14.633-03:00  INFO 1213104 --- [           main] [0add3751-3007-4eae-8ae7-0df72d6f0525] c.l.f.shared.web.RequestLogFilter        : POST - 302 37ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='AuthorizationServerIT#missingP` - exit 0

```
2026-11-08T16:14:38.088-03:00  INFO 1213684 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable prompts capabilities, notification: true
2026-11-08T16:14:38.090-03:00  INFO 1213684 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable completions capabilities
2026-11-08T16:14:38.214-03:00  INFO 1213684 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-08T16:14:38.214-03:00  INFO 1213684 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-08T16:14:38.216-03:00  INFO 1213684 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 2 ms
2026-11-08T16:14:38.273-03:00  INFO 1213684 --- [           main] [] c.l.findraco.auth.AuthorizationServerIT  : Started AuthorizationServerIT in 9.072 seconds (process running for 10.211)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-08T16:14:38.635-03:00  WARN 1213684 --- [           main] [bda65e97-4031-487e-b3f1-dae773544b98] c.l.f.a.s.CimdRegisteredClientRepository : Client metadata document http://127.0.0.1:1/oauth/test-client could not be fetched: ResourceAccessException
2026-11-08T16:14:38.639-03:00  INFO 1213684 --- [           main] [bda65e97-4031-487e-b3f1-dae773544b98] c.l.f.shared.web.RequestLogFilter        : GET - 302 39ms userId=- planId=-
2026-11-08T16:14:38.683-03:00  INFO 1213684 --- [           main] [057fe261-f0d7-4089-91d8-2ed285510b1b] c.l.f.shared.web.RequestLogFilter        : GET - 302 0ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='AuthorizationServerIT#codeExch` - exit 0

```
2026-11-08T16:15:01.577-03:00  INFO 1214230 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-08T16:15:01.578-03:00  INFO 1214230 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-08T16:15:01.641-03:00  INFO 1214230 --- [           main] [] c.l.findraco.auth.AuthorizationServerIT  : Started AuthorizationServerIT in 8.963 seconds (process running for 10.092)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-08T16:15:02.050-03:00  WARN 1214230 --- [           main] [4227f6c4-9695-4628-8fdb-4dc21af6309c] c.l.f.a.s.CimdRegisteredClientRepository : Client metadata document http://127.0.0.1:1/oauth/test-client could not be fetched: ResourceAccessException
2026-11-08T16:15:02.056-03:00  INFO 1214230 --- [           main] [4227f6c4-9695-4628-8fdb-4dc21af6309c] c.l.f.shared.web.RequestLogFilter        : GET - 302 42ms userId=- planId=-
2026-11-08T16:15:02.305-03:00  INFO 1214230 --- [           main] [f52e11e7-ddda-44a6-b830-0980681d8373] c.l.f.shared.web.RequestLogFilter        : POST - 302 245ms userId=- planId=-
2026-11-08T16:15:02.341-03:00  INFO 1214230 --- [           main] [a4449d9d-1060-46d1-aa63-fd71bda776ec] c.l.f.shared.web.RequestLogFilter        : GET - 302 34ms userId=- planId=-
2026-11-08T16:15:02.394-03:00  INFO 1214230 --- [           main] [ded21c50-ab4e-41f2-8cdc-74fda401bf13] c.l.f.shared.web.RequestLogFilter        : POST - 302 52ms userId=- planId=-
2026-11-08T16:15:02.449-03:00  INFO 1214230 --- [           main] [d0bb5e4d-b11e-4444-9cb4-b6e6945746e6] c.l.f.shared.web.RequestLogFilter        : POST - 200 53ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='AuthorizationServerIT#unlisted` - exit 0

```
2026-11-08T16:15:25.210-03:00  INFO 1214809 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable resources capabilities, notification: true
2026-11-08T16:15:25.211-03:00  INFO 1214809 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable resources templates capabilities, notification: true
2026-11-08T16:15:25.212-03:00  INFO 1214809 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable prompts capabilities, notification: true
2026-11-08T16:15:25.213-03:00  INFO 1214809 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable completions capabilities
2026-11-08T16:15:25.337-03:00  INFO 1214809 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-08T16:15:25.337-03:00  INFO 1214809 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-08T16:15:25.339-03:00  INFO 1214809 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-08T16:15:25.417-03:00  INFO 1214809 --- [           main] [] c.l.findraco.auth.AuthorizationServerIT  : Started AuthorizationServerIT in 8.949 seconds (process running for 10.17)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-08T16:15:25.739-03:00  INFO 1214809 --- [           main] [bce8d754-00c0-4432-8ae6-99870a94cc15] c.l.f.shared.web.RequestLogFilter        : GET - 400 10ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='OAuthRefreshIT#refreshRotates'` - exit 0

```
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-08T16:15:49.405-03:00  WARN 1215360 --- [           main] [d1cd75fb-ac24-422f-9bfb-aa4a9c98cac4] c.l.f.a.s.CimdRegisteredClientRepository : Client metadata document http://127.0.0.1:1/oauth/test-client could not be fetched: ResourceAccessException
2026-11-08T16:15:49.412-03:00  INFO 1215360 --- [           main] [d1cd75fb-ac24-422f-9bfb-aa4a9c98cac4] c.l.f.shared.web.RequestLogFilter        : GET - 302 42ms userId=- planId=-
2026-11-08T16:15:49.667-03:00  INFO 1215360 --- [           main] [c16891c7-d36c-483d-880b-e0f9370b65fd] c.l.f.shared.web.RequestLogFilter        : POST - 302 251ms userId=- planId=-
2026-11-08T16:15:49.702-03:00  INFO 1215360 --- [           main] [c0f750bc-2182-4d44-8e8c-006f1a2b79d9] c.l.f.shared.web.RequestLogFilter        : GET - 302 34ms userId=- planId=-
2026-11-08T16:15:49.751-03:00  INFO 1215360 --- [           main] [d2a5a175-8fb7-4898-a7d3-bba94c816120] c.l.f.shared.web.RequestLogFilter        : POST - 302 47ms userId=- planId=-
2026-11-08T16:15:49.805-03:00  INFO 1215360 --- [           main] [9bcfdd8d-e612-4ab8-be64-9f765d74fb69] c.l.f.shared.web.RequestLogFilter        : POST - 200 53ms userId=- planId=-
2026-11-08T16:15:49.839-03:00  INFO 1215360 --- [           main] [04803639-7fa0-484d-9013-69b9854d3054] c.l.f.shared.web.RequestLogFilter        : POST - 200 33ms userId=- planId=-
2026-11-08T16:15:49.901-03:00  WARN 1215360 --- [           main] [21645906-6a30-49ce-b56c-73273e97e3b8] f.a.s.ReplayRevokingAuthorizationService : Refresh token replay detected; revoked grant 22e9e031-5b41-41af-9aed-de86f6b46845 of user 1
2026-11-08T16:15:49.903-03:00  INFO 1215360 --- [           main] [21645906-6a30-49ce-b56c-73273e97e3b8] c.l.f.shared.web.RequestLogFilter        : POST - 400 9ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='OAuthRefreshIT#idleRefreshExpi` - exit 0

```
2026-11-08T16:16:12.725-03:00  INFO 1215920 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 2 ms
2026-11-08T16:16:12.791-03:00  INFO 1215920 --- [           main] [] com.lcs.findraco.auth.OAuthRefreshIT     : Started OAuthRefreshIT in 8.903 seconds (process running for 10.062)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-08T16:16:13.227-03:00  WARN 1215920 --- [           main] [ee9ae346-3202-41e1-b10f-f08e3e153c17] c.l.f.a.s.CimdRegisteredClientRepository : Client metadata document http://127.0.0.1:1/oauth/test-client could not be fetched: ResourceAccessException
2026-11-08T16:16:13.233-03:00  INFO 1215920 --- [           main] [ee9ae346-3202-41e1-b10f-f08e3e153c17] c.l.f.shared.web.RequestLogFilter        : GET - 302 44ms userId=- planId=-
2026-11-08T16:16:13.483-03:00  INFO 1215920 --- [           main] [fa53bda9-ba06-4acf-bd88-f7bab02dda3d] c.l.f.shared.web.RequestLogFilter        : POST - 302 245ms userId=- planId=-
2026-11-08T16:16:13.516-03:00  INFO 1215920 --- [           main] [ce4afe45-74fd-4972-9dbf-d423dd3e1e4f] c.l.f.shared.web.RequestLogFilter        : GET - 302 32ms userId=- planId=-
2026-11-08T16:16:13.566-03:00  INFO 1215920 --- [           main] [44bca699-1e90-4558-8077-957ea3c39fa1] c.l.f.shared.web.RequestLogFilter        : POST - 302 48ms userId=- planId=-
2026-11-08T16:16:13.614-03:00  INFO 1215920 --- [           main] [538d8ecc-9ba1-4f9b-b704-9fdf2dbfb8f5] c.l.f.shared.web.RequestLogFilter        : POST - 200 47ms userId=- planId=-
2026-11-08T16:16:13.680-03:00  INFO 1215920 --- [           main] [f0aea72e-33e1-4fe8-9607-e172c16a729b] c.l.f.shared.web.RequestLogFilter        : POST - 400 13ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='OAuthRefreshIT#replayRevokesGr` - exit 0

```
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-08T16:16:37.248-03:00  WARN 1216491 --- [           main] [27bdd99b-ec66-4f17-ad9c-83d0b0e5304b] c.l.f.a.s.CimdRegisteredClientRepository : Client metadata document http://127.0.0.1:1/oauth/test-client could not be fetched: ResourceAccessException
2026-11-08T16:16:37.255-03:00  INFO 1216491 --- [           main] [27bdd99b-ec66-4f17-ad9c-83d0b0e5304b] c.l.f.shared.web.RequestLogFilter        : GET - 302 42ms userId=- planId=-
2026-11-08T16:16:37.513-03:00  INFO 1216491 --- [           main] [d298a064-1225-4eb9-b4dd-777f94475e61] c.l.f.shared.web.RequestLogFilter        : POST - 302 254ms userId=- planId=-
2026-11-08T16:16:37.546-03:00  INFO 1216491 --- [           main] [2e955f1a-73d0-46e1-8f6a-d933c99f97c4] c.l.f.shared.web.RequestLogFilter        : GET - 302 31ms userId=- planId=-
2026-11-08T16:16:37.594-03:00  INFO 1216491 --- [           main] [330574d7-4b5c-430f-a723-923f39927354] c.l.f.shared.web.RequestLogFilter        : POST - 302 47ms userId=- planId=-
2026-11-08T16:16:37.641-03:00  INFO 1216491 --- [           main] [5df1c069-14e0-4f6e-bac9-ebdcca059590] c.l.f.shared.web.RequestLogFilter        : POST - 200 46ms userId=- planId=-
2026-11-08T16:16:37.673-03:00  INFO 1216491 --- [           main] [f1de4558-2a71-45e0-90ec-f152a34f544a] c.l.f.shared.web.RequestLogFilter        : POST - 200 30ms userId=- planId=-
2026-11-08T16:16:37.681-03:00  WARN 1216491 --- [           main] [d3683908-55c5-4e98-a580-930d99842363] f.a.s.ReplayRevokingAuthorizationService : Refresh token replay detected; revoked grant ae0f7cb2-9977-48c1-955b-a8803e00feb4 of user 1
2026-11-08T16:16:37.682-03:00  INFO 1216491 --- [           main] [d3683908-55c5-4e98-a580-930d99842363] c.l.f.shared.web.RequestLogFilter        : POST - 400 7ms userId=- planId=-
2026-11-08T16:16:37.708-03:00  INFO 1216491 --- [           main] [a0b88e1e-2f5f-45b9-88f3-a9a10ae46499] c.l.f.shared.web.RequestLogFilter        : POST - 400 2ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='OAuthRefreshIT#passwordResetRe` - exit 0

```
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-08T16:17:01.328-03:00  WARN 1217051 --- [           main] [45d036f9-91b1-4560-90da-a7bc06af148d] c.l.f.a.s.CimdRegisteredClientRepository : Client metadata document http://127.0.0.1:1/oauth/test-client could not be fetched: ResourceAccessException
2026-11-08T16:17:01.335-03:00  INFO 1217051 --- [           main] [45d036f9-91b1-4560-90da-a7bc06af148d] c.l.f.shared.web.RequestLogFilter        : GET - 302 43ms userId=- planId=-
2026-11-08T16:17:01.578-03:00  INFO 1217051 --- [           main] [b4042a8e-21a7-4d05-8dc1-a77b23665903] c.l.f.shared.web.RequestLogFilter        : POST - 302 240ms userId=- planId=-
2026-11-08T16:17:01.609-03:00  INFO 1217051 --- [           main] [1a79557a-b505-4d40-800e-4d413342c86d] c.l.f.shared.web.RequestLogFilter        : GET - 302 30ms userId=- planId=-
2026-11-08T16:17:01.661-03:00  INFO 1217051 --- [           main] [24420d94-cf5f-4fe5-8441-1bc9fcdf781b] c.l.f.shared.web.RequestLogFilter        : POST - 302 50ms userId=- planId=-
2026-11-08T16:17:01.713-03:00  INFO 1217051 --- [           main] [22e0348a-af97-4677-9086-8962a82f8893] c.l.f.shared.web.RequestLogFilter        : POST - 200 51ms userId=- planId=-
2026-11-08T16:17:01.715-03:00  INFO 1217051 --- [           main] [789d3cd9-62cb-4b55-8e4c-a40f6241cc84] c.l.f.shared.web.RequestLogFilter        : GET - 302 0ms userId=- planId=-
2026-11-08T16:17:01.746-03:00  INFO 1217051 --- [           main] [feff94c2-e648-4e77-aa36-096d0635d628] c.l.f.shared.web.RequestLogFilter        : POST - 302 30ms userId=- planId=-
2026-11-08T16:17:01.751-03:00  INFO 1217051 --- [           main] [d2b50c4b-7416-4100-8d36-81c6751b01ee] c.l.f.shared.web.RequestLogFilter        : GET - 302 4ms userId=- planId=-
2026-11-08T16:17:01.762-03:00  INFO 1217051 --- [           main] [24715e06-d0ae-46e8-b147-ca211adc682d] c.l.f.shared.web.RequestLogFilter        : POST - 302 10ms userId=- planId=-
2026-11-08T16:17:01.795-03:00  INFO 1217051 --- [           main] [0dbaa839-be2e-415f-acda-842b35604769] c.l.f.shared.web.RequestLogFilter        : POST - 200 31ms userId=- planId=-
2026-11-08T16:17:01.886-03:00  INFO 1217051 --- [           main] [a510fa41-a058-4a11-8532-17f1f36093b8] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/auth/reset-password 204 87ms userId=- planId=-
2026-11-08T16:17:01.938-03:00  INFO 1217051 --- [           main] [41d4bd86-f825-41ff-a52e-5b33056c8231] c.l.f.shared.web.RequestLogFilter        : POST - 400 5ms userId=- planId=-
2026-11-08T16:17:01.987-03:00  INFO 1217051 --- [           main] [66c2c2c7-2c74-497a-a36c-763fbb9b4cbf] c.l.f.shared.web.RequestLogFilter        : POST - 200 26ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='OAuthRefreshIT#unlistedClientC` - exit 0

```
2026-11-08T16:17:24.973-03:00  INFO 1217612 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-08T16:17:25.035-03:00  INFO 1217612 --- [           main] [] com.lcs.findraco.auth.OAuthRefreshIT     : Started OAuthRefreshIT in 8.94 seconds (process running for 10.142)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-08T16:17:25.439-03:00  WARN 1217612 --- [           main] [60b79208-c98a-4f69-82cd-3aa9a7118420] c.l.f.a.s.CimdRegisteredClientRepository : Client metadata document http://127.0.0.1:1/oauth/test-client could not be fetched: ResourceAccessException
2026-11-08T16:17:25.446-03:00  INFO 1217612 --- [           main] [60b79208-c98a-4f69-82cd-3aa9a7118420] c.l.f.shared.web.RequestLogFilter        : GET - 302 43ms userId=- planId=-
2026-11-08T16:17:25.703-03:00  INFO 1217612 --- [           main] [5d9b182c-1dcf-4ce5-8bb5-9be48b4e39a6] c.l.f.shared.web.RequestLogFilter        : POST - 302 253ms userId=- planId=-
2026-11-08T16:17:25.739-03:00  INFO 1217612 --- [           main] [33920e40-0210-48a1-94c6-f618df8c5eb5] c.l.f.shared.web.RequestLogFilter        : GET - 302 34ms userId=- planId=-
2026-11-08T16:17:25.787-03:00  INFO 1217612 --- [           main] [42bfd331-844b-4cd5-a03f-baea66ee7feb] c.l.f.shared.web.RequestLogFilter        : POST - 302 47ms userId=- planId=-
2026-11-08T16:17:25.842-03:00  INFO 1217612 --- [           main] [2bab6118-2f41-4a50-9213-45ddebf2bde2] c.l.f.shared.web.RequestLogFilter        : POST - 200 53ms userId=- planId=-
2026-11-08T16:17:25.844-03:00  INFO 1217612 --- [           main] [f1dcb4ea-63e5-43f7-b28f-de6479df8622] c.l.f.shared.web.RequestLogFilter        : POST - 401 1ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpSecurityIT#anonymousGetsRes` - exit 0

```
2026-11-08T16:17:48.367-03:00  INFO 1218178 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable resources templates capabilities, notification: true
2026-11-08T16:17:48.368-03:00  INFO 1218178 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable prompts capabilities, notification: true
2026-11-08T16:17:48.369-03:00  INFO 1218178 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable completions capabilities
2026-11-08T16:17:48.490-03:00  INFO 1218178 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-08T16:17:48.490-03:00  INFO 1218178 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-08T16:17:48.492-03:00  INFO 1218178 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-08T16:17:48.566-03:00  INFO 1218178 --- [           main] [] com.lcs.findraco.mcp.McpSecurityIT       : Started McpSecurityIT in 8.84 seconds (process running for 10.008)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-08T16:17:48.879-03:00  INFO 1218178 --- [           main] [2df8be56-8db5-47c9-8eaf-fc471091e0b0] c.l.f.shared.web.RequestLogFilter        : POST - 401 8ms userId=- planId=-
2026-11-08T16:17:48.887-03:00  INFO 1218178 --- [           main] [ec52dc9c-5e71-4af9-a866-590127fd7bca] c.l.f.shared.web.RequestLogFilter        : POST - 401 1ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpSecurityIT#protectedResourc` - exit 0

```
2026-11-08T16:18:12.010-03:00  INFO 1218729 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable resources templates capabilities, notification: true
2026-11-08T16:18:12.011-03:00  INFO 1218729 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable prompts capabilities, notification: true
2026-11-08T16:18:12.012-03:00  INFO 1218729 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable completions capabilities
2026-11-08T16:18:12.147-03:00  INFO 1218729 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-08T16:18:12.148-03:00  INFO 1218729 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-08T16:18:12.150-03:00  INFO 1218729 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 2 ms
2026-11-08T16:18:12.205-03:00  INFO 1218729 --- [           main] [] com.lcs.findraco.mcp.McpSecurityIT       : Started McpSecurityIT in 8.923 seconds (process running for 10.167)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
2026-11-08T16:18:12.531-03:00  INFO 1218729 --- [           main] [159c1a4e-1133-4b47-9788-636b3ca33475] c.l.f.shared.web.RequestLogFilter        : GET - 200 11ms userId=- planId=-
2026-11-08T16:18:12.559-03:00  INFO 1218729 --- [           main] [35a9eab9-85d3-41d5-a4a8-d665d5ccb71f] c.l.f.shared.web.RequestLogFilter        : GET - 200 0ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpSecurityIT#tokensDoNotCross` - exit 0

```
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-08T16:18:36.129-03:00  WARN 1219290 --- [           main] [de4b9a40-7a26-458c-b726-8da132d7cc01] c.l.f.a.s.CimdRegisteredClientRepository : Client metadata document http://127.0.0.1:1/oauth/test-client could not be fetched: ResourceAccessException
2026-11-08T16:18:36.136-03:00  INFO 1219290 --- [           main] [de4b9a40-7a26-458c-b726-8da132d7cc01] c.l.f.shared.web.RequestLogFilter        : GET - 302 42ms userId=- planId=-
2026-11-08T16:18:36.384-03:00  INFO 1219290 --- [           main] [2a92adeb-946a-4e9f-a266-5d97ac40d385] c.l.f.shared.web.RequestLogFilter        : POST - 302 244ms userId=- planId=-
2026-11-08T16:18:36.418-03:00  INFO 1219290 --- [           main] [a2aaa772-1d00-4e52-8dd6-9d80afd5c38b] c.l.f.shared.web.RequestLogFilter        : GET - 302 33ms userId=- planId=-
2026-11-08T16:18:36.468-03:00  INFO 1219290 --- [           main] [ccf0b207-baca-48d6-9790-56c78071ca86] c.l.f.shared.web.RequestLogFilter        : POST - 302 48ms userId=- planId=-
2026-11-08T16:18:36.515-03:00  INFO 1219290 --- [           main] [00ed9cfc-1d13-47ac-abd2-95ff3026414c] c.l.f.shared.web.RequestLogFilter        : POST - 200 46ms userId=- planId=-
2026-11-08T16:18:36.587-03:00  INFO 1219290 --- [           main] [570613c7-3740-4c21-aef8-0525f5010eda] c.l.f.shared.web.RequestLogFilter        : GET - 401 70ms userId=- planId=-
2026-11-08T16:18:36.621-03:00  INFO 1219290 --- [           main] [d7fbdc07-508f-4f57-b2a0-2d2276d36ac2] c.l.f.shared.web.RequestLogFilter        : POST - 401 4ms userId=- planId=-
2026-11-08T16:18:36.661-03:00  INFO 1219290 --- [           main] [bcfad770-1f8a-4b7d-a48e-5879ba57ec06] i.m.server.McpAsyncServer                : Client initialize request - Protocol: 2025-06-18, Capabilities: ClientCapabilities[experimental=null, roots=null, sampling=null, elicitation=null, extensions=null], Info: Implementation[name=test, title=null, version=1, description=null, icons=null, websiteUrl=null]
2026-11-08T16:18:36.677-03:00  INFO 1219290 --- [           main] [bcfad770-1f8a-4b7d-a48e-5879ba57ec06] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 53ms userId=- planId=-
2026-11-08T16:18:36.687-03:00  INFO 1219290 --- [           main] [44fd3bcd-e213-43e7-b5c1-a5d94ed7afef] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 7ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpSecurityIT#wrongAudienceOrS` - exit 0

```
2026-11-08T16:18:59.775-03:00  INFO 1219838 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable resources templates capabilities, notification: true
2026-11-08T16:18:59.776-03:00  INFO 1219838 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable prompts capabilities, notification: true
2026-11-08T16:18:59.777-03:00  INFO 1219838 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable completions capabilities
2026-11-08T16:18:59.901-03:00  INFO 1219838 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-08T16:18:59.901-03:00  INFO 1219838 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-08T16:18:59.903-03:00  INFO 1219838 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-08T16:18:59.959-03:00  INFO 1219838 --- [           main] [] com.lcs.findraco.mcp.McpSecurityIT       : Started McpSecurityIT in 8.785 seconds (process running for 10.126)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-08T16:19:00.366-03:00  INFO 1219838 --- [           main] [feaf73c2-1c60-4033-85c0-664f7962e456] c.l.f.shared.web.RequestLogFilter        : POST - 401 13ms userId=- planId=-
2026-11-08T16:19:00.371-03:00  INFO 1219838 --- [           main] [7486177b-c1be-4cf8-9802-7103667fbd89] c.l.f.shared.web.RequestLogFilter        : POST - 401 1ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpPlanToolsIT#listPlansShowsA` - exit 0

```
2026-11-08T16:19:23.184-03:00  INFO 1220389 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-08T16:19:23.184-03:00  INFO 1220389 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-08T16:19:23.185-03:00  INFO 1220389 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-08T16:19:23.240-03:00  INFO 1220389 --- [           main] [] com.lcs.findraco.mcp.McpPlanToolsIT      : Started McpPlanToolsIT in 8.825 seconds (process running for 10.006)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-08T16:19:23.779-03:00  INFO 1220389 --- [           main] [f5f88d36-409a-43fd-9faa-bb91ca4d39c6] i.m.server.McpAsyncServer                : Client initialize request - Protocol: 2025-06-18, Capabilities: ClientCapabilities[experimental=null, roots=null, sampling=null, elicitation=null, extensions=null], Info: Implementation[name=test, title=null, version=1, description=null, icons=null, websiteUrl=null]
2026-11-08T16:19:23.798-03:00  INFO 1220389 --- [           main] [f5f88d36-409a-43fd-9faa-bb91ca4d39c6] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 142ms userId=- planId=-
2026-11-08T16:19:23.809-03:00  INFO 1220389 --- [           main] [aa942791-2ccb-4a42-bf47-9fa0304578b1] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 7ms userId=- planId=-
2026-11-08T16:19:23.911-03:00  INFO 1220389 --- [           main] [7de8dbc1-b167-4d26-a237-bf6b4cc3a6de] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=list_plans user=1 plan=null outcome=ok durationMs=87
2026-11-08T16:19:23.925-03:00  INFO 1220389 --- [           main] [7de8dbc1-b167-4d26-a237-bf6b4cc3a6de] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 114ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpPlanToolsIT#planResolvesByD` - exit 0

```
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-08T16:19:47.415-03:00  INFO 1220952 --- [           main] [601d55ea-5c29-4d6e-8455-1bd467987a53] i.m.server.McpAsyncServer                : Client initialize request - Protocol: 2025-06-18, Capabilities: ClientCapabilities[experimental=null, roots=null, sampling=null, elicitation=null, extensions=null], Info: Implementation[name=test, title=null, version=1, description=null, icons=null, websiteUrl=null]
2026-11-08T16:19:47.436-03:00  INFO 1220952 --- [           main] [601d55ea-5c29-4d6e-8455-1bd467987a53] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 131ms userId=- planId=-
2026-11-08T16:19:47.448-03:00  INFO 1220952 --- [           main] [391930cb-e8ae-4de9-b1c6-d07326f7d305] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 7ms userId=- planId=-
2026-11-08T16:19:47.582-03:00  INFO 1220952 --- [           main] [78304774-cc16-49be-921e-8fbde3cff6f0] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=plan_probe user=1 plan=1 outcome=ok durationMs=120
2026-11-08T16:19:47.597-03:00  INFO 1220952 --- [           main] [78304774-cc16-49be-921e-8fbde3cff6f0] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 148ms userId=- planId=-
2026-11-08T16:19:47.652-03:00  INFO 1220952 --- [           main] [b1d99a0b-f289-48f8-bfeb-87ffab5bb097] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=plan_probe user=1 plan=2 outcome=ok durationMs=11
2026-11-08T16:19:47.653-03:00  INFO 1220952 --- [           main] [b1d99a0b-f289-48f8-bfeb-87ffab5bb097] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 15ms userId=- planId=-
2026-11-08T16:19:47.663-03:00  INFO 1220952 --- [           main] [a59b2d44-7747-478c-8f79-eefb411ef4e3] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=plan_probe user=1 plan=2 outcome=ok durationMs=7
2026-11-08T16:19:47.664-03:00  INFO 1220952 --- [           main] [a59b2d44-7747-478c-8f79-eefb411ef4e3] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 10ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q test -Dtest='McpNamesTest#matchesIgnoringCaseAnd` - exit 0

```
(no output)
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpPlanToolsIT#unknownOrAmbigu` - exit 0

```
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
2026-11-08T16:20:16.281-03:00  INFO 1221804 --- [           main] [06c3d9ce-41b8-4c5d-9af3-ac57abe09136] i.m.server.McpAsyncServer                : Client initialize request - Protocol: 2025-06-18, Capabilities: ClientCapabilities[experimental=null, roots=null, sampling=null, elicitation=null, extensions=null], Info: Implementation[name=test, title=null, version=1, description=null, icons=null, websiteUrl=null]
2026-11-08T16:20:16.300-03:00  INFO 1221804 --- [           main] [06c3d9ce-41b8-4c5d-9af3-ac57abe09136] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 138ms userId=- planId=-
2026-11-08T16:20:16.311-03:00  INFO 1221804 --- [           main] [f90129aa-55b6-4f03-a788-ab07a612e907] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 7ms userId=- planId=-
2026-11-08T16:20:16.406-03:00  INFO 1221804 --- [           main] [d2f31631-3196-4bbc-b6e9-135d49cc57e1] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=plan_probe user=1 plan=null outcome=error durationMs=82
2026-11-08T16:20:16.421-03:00  INFO 1221804 --- [           main] [d2f31631-3196-4bbc-b6e9-135d49cc57e1] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 108ms userId=- planId=-
2026-11-08T16:20:16.472-03:00  INFO 1221804 --- [           main] [9fc041d8-1c88-4829-945b-43dba0833aeb] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=plan_probe user=1 plan=null outcome=error durationMs=6
2026-11-08T16:20:16.473-03:00  INFO 1221804 --- [           main] [9fc041d8-1c88-4829-945b-43dba0833aeb] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 10ms userId=- planId=-
2026-11-08T16:20:16.480-03:00  INFO 1221804 --- [           main] [7443feaa-8217-4e6c-a43d-88d0ee7a9b1e] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=plan_probe user=1 plan=null outcome=error durationMs=3
2026-11-08T16:20:16.481-03:00  INFO 1221804 --- [           main] [7443feaa-8217-4e6c-a43d-88d0ee7a9b1e] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 6ms userId=- planId=-
2026-11-08T16:20:16.487-03:00  INFO 1221804 --- [           main] [ea2a454c-05ff-43b0-8f78-4a5f51004ff4] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=plan_probe user=1 plan=null outcome=error durationMs=3
2026-11-08T16:20:16.487-03:00  INFO 1221804 --- [           main] [ea2a454c-05ff-43b0-8f78-4a5f51004ff4] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 6ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpSecurityIT#rateLimitIsToolE` - exit 0

```
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
2026-11-08T16:20:40.246-03:00  INFO 1222368 --- [           main] [ac25d8a4-9ff0-40d6-82c6-4f651bb77a3a] i.m.server.McpAsyncServer                : Client initialize request - Protocol: 2025-06-18, Capabilities: ClientCapabilities[experimental=null, roots=null, sampling=null, elicitation=null, extensions=null], Info: Implementation[name=test, title=null, version=1, description=null, icons=null, websiteUrl=null]
2026-11-08T16:20:40.266-03:00  INFO 1222368 --- [           main] [ac25d8a4-9ff0-40d6-82c6-4f651bb77a3a] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 129ms userId=- planId=-
2026-11-08T16:20:40.277-03:00  INFO 1222368 --- [           main] [b9a3a0bc-4806-4564-88ef-da11a8ce2485] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 7ms userId=- planId=-
2026-11-08T16:20:40.378-03:00  INFO 1222368 --- [           main] [fbc19d73-6737-4e53-bdd9-9b93fa6b87f3] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=list_plans user=1 plan=null outcome=ok durationMs=86
2026-11-08T16:20:40.391-03:00  INFO 1222368 --- [           main] [fbc19d73-6737-4e53-bdd9-9b93fa6b87f3] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 113ms userId=- planId=-
2026-11-08T16:20:40.460-03:00  INFO 1222368 --- [           main] [540f0546-3d71-4b44-ae4d-f5073cf0e9a4] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=list_plans user=1 plan=null outcome=ok durationMs=6
2026-11-08T16:20:40.460-03:00  INFO 1222368 --- [           main] [540f0546-3d71-4b44-ae4d-f5073cf0e9a4] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 10ms userId=- planId=-
2026-11-08T16:20:40.464-03:00  WARN 1222368 --- [           main] [b84392bb-3e14-4deb-8631-e24c86b2078d] c.l.f.shared.ratelimit.RateLimiter       : Rate limit MCP_USER exceeded; retry in 3600s
2026-11-08T16:20:40.464-03:00  INFO 1222368 --- [           main] [b84392bb-3e14-4deb-8631-e24c86b2078d] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=list_plans user=1 plan=null outcome=rate-limited durationMs=0
2026-11-08T16:20:40.465-03:00  INFO 1222368 --- [           main] [b84392bb-3e14-4deb-8631-e24c86b2078d] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 3ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpPlanToolsIT#unexpectedFailu` - exit 0

```
	at java.base/jdk.internal.reflect.DirectMethodHandleAccessor.invoke(DirectMethodHandleAccessor.java:104)
	at java.base/java.lang.reflect.Method.invoke(Method.java:565)
	at org.apache.maven.surefire.api.util.ReflectionUtils.invokeMethodWithArray(ReflectionUtils.java:125)
	at org.apache.maven.surefire.junitplatform.LauncherAdapter.executeWithCancellationToken(LauncherAdapter.java:68)
	at org.apache.maven.surefire.junitplatform.LauncherAdapter.execute(LauncherAdapter.java:54)
	at org.apache.maven.surefire.junitplatform.JUnitPlatformProvider.execute(JUnitPlatformProvider.java:203)
	at org.apache.maven.surefire.junitplatform.JUnitPlatformProvider.invokeAllTests(JUnitPlatformProvider.java:168)
	at org.apache.maven.surefire.junitplatform.JUnitPlatformProvider.invoke(JUnitPlatformProvider.java:136)
	at org.apache.maven.surefire.booter.ForkedBooter.runSuitesInProcess(ForkedBooter.java:385)
	at org.apache.maven.surefire.booter.ForkedBooter.execute(ForkedBooter.java:162)
	at org.apache.maven.surefire.booter.ForkedBooter.run(ForkedBooter.java:507)
	at org.apache.maven.surefire.booter.ForkedBooter.main(ForkedBooter.java:495)

2026-11-08T16:21:04.590-03:00  INFO 1222919 --- [           main] [6c083355-8d56-4007-a9ab-7ecf9207c08e] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=break_down user=1 plan=null outcome=failed durationMs=14
2026-11-08T16:21:04.603-03:00  INFO 1222919 --- [           main] [6c083355-8d56-4007-a9ab-7ecf9207c08e] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 39ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpPlanToolsIT#callLogOmitsArg` - exit 0

```
2026-11-08T16:21:27.773-03:00  INFO 1223486 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-08T16:21:27.773-03:00  INFO 1223486 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-08T16:21:27.775-03:00  INFO 1223486 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 2 ms
2026-11-08T16:21:27.833-03:00  INFO 1223486 --- [           main] [] com.lcs.findraco.mcp.McpPlanToolsIT      : Started McpPlanToolsIT in 9.049 seconds (process running for 10.303)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-08T16:21:28.355-03:00  INFO 1223486 --- [           main] [1cc4a043-a9ae-412a-a816-6a4c36923069] i.m.server.McpAsyncServer                : Client initialize request - Protocol: 2025-06-18, Capabilities: ClientCapabilities[experimental=null, roots=null, sampling=null, elicitation=null, extensions=null], Info: Implementation[name=test, title=null, version=1, description=null, icons=null, websiteUrl=null]
2026-11-08T16:21:28.375-03:00  INFO 1223486 --- [           main] [1cc4a043-a9ae-412a-a816-6a4c36923069] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 128ms userId=- planId=-
2026-11-08T16:21:28.385-03:00  INFO 1223486 --- [           main] [945b7fd6-6665-4279-86a5-fd0cf6a40027] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 7ms userId=- planId=-
2026-11-08T16:21:28.514-03:00  INFO 1223486 --- [           main] [9b719060-8112-4d24-826e-17c0be42ce11] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=plan_probe user=1 plan=1 outcome=ok durationMs=115
2026-11-08T16:21:28.527-03:00  INFO 1223486 --- [           main] [9b719060-8112-4d24-826e-17c0be42ce11] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 140ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpReadToolsIT#listCategories'` - exit 0

```
2026-11-08T16:21:51.312-03:00  INFO 1224037 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-08T16:21:51.312-03:00  INFO 1224037 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-08T16:21:51.314-03:00  INFO 1224037 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 2 ms
2026-11-08T16:21:51.370-03:00  INFO 1224037 --- [           main] [] com.lcs.findraco.mcp.McpReadToolsIT      : Started McpReadToolsIT in 8.942 seconds (process running for 10.155)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-08T16:21:51.949-03:00  INFO 1224037 --- [           main] [aad8e180-b723-4a78-93b5-5c8bdee5fa75] i.m.server.McpAsyncServer                : Client initialize request - Protocol: 2025-06-18, Capabilities: ClientCapabilities[experimental=null, roots=null, sampling=null, elicitation=null, extensions=null], Info: Implementation[name=test, title=null, version=1, description=null, icons=null, websiteUrl=null]
2026-11-08T16:21:51.969-03:00  INFO 1224037 --- [           main] [aad8e180-b723-4a78-93b5-5c8bdee5fa75] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 129ms userId=- planId=-
2026-11-08T16:21:51.981-03:00  INFO 1224037 --- [           main] [19e296d9-3886-4a95-9b10-bb94d17ebd1d] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 7ms userId=- planId=-
2026-11-08T16:21:52.167-03:00  INFO 1224037 --- [           main] [140ce0c7-01b3-4103-b085-902f7c68b1fa] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=list_categories user=1 plan=1 outcome=ok durationMs=172
2026-11-08T16:21:52.181-03:00  INFO 1224037 --- [           main] [140ce0c7-01b3-4103-b085-902f7c68b1fa] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 199ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpReadToolsIT#listTransaction` - exit 0

```
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-08T16:22:15.821-03:00  INFO 1224579 --- [           main] [16147751-041f-4cb6-b2c0-64ef391d74d3] i.m.server.McpAsyncServer                : Client initialize request - Protocol: 2025-06-18, Capabilities: ClientCapabilities[experimental=null, roots=null, sampling=null, elicitation=null, extensions=null], Info: Implementation[name=test, title=null, version=1, description=null, icons=null, websiteUrl=null]
2026-11-08T16:22:15.842-03:00  INFO 1224579 --- [           main] [16147751-041f-4cb6-b2c0-64ef391d74d3] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 131ms userId=- planId=-
2026-11-08T16:22:15.855-03:00  INFO 1224579 --- [           main] [b6371100-670c-4a8e-bff2-e525d66022df] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 8ms userId=- planId=-
2026-11-08T16:22:16.058-03:00  INFO 1224579 --- [           main] [53d2b105-d450-442e-90fe-251cbf58c24b] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=list_transactions user=1 plan=1 outcome=ok durationMs=188
2026-11-08T16:22:16.076-03:00  INFO 1224579 --- [           main] [53d2b105-d450-442e-90fe-251cbf58c24b] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 220ms userId=- planId=-
2026-11-08T16:22:16.167-03:00  INFO 1224579 --- [           main] [31abf14a-f949-4211-8aa8-d6b3bbcef685] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=list_transactions user=1 plan=1 outcome=ok durationMs=36
2026-11-08T16:22:16.167-03:00  INFO 1224579 --- [           main] [31abf14a-f949-4211-8aa8-d6b3bbcef685] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 39ms userId=- planId=-
2026-11-08T16:22:16.213-03:00  INFO 1224579 --- [           main] [80732314-7762-41e5-b2c0-d2b5b159cacf] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=list_transactions user=1 plan=1 outcome=ok durationMs=42
2026-11-08T16:22:16.214-03:00  INFO 1224579 --- [           main] [80732314-7762-41e5-b2c0-d2b5b159cacf] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 45ms userId=- planId=-
2026-11-08T16:22:16.245-03:00  INFO 1224579 --- [           main] [b07c5b1c-60a3-4876-98b6-1b4a54edd273] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=list_transactions user=1 plan=1 outcome=ok durationMs=23
2026-11-08T16:22:16.245-03:00  INFO 1224579 --- [           main] [b07c5b1c-60a3-4876-98b6-1b4a54edd273] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 29ms userId=- planId=-
2026-11-08T16:22:16.274-03:00  INFO 1224579 --- [           main] [b63e0bb4-e943-4b98-a647-f65de7ee29ff] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=list_transactions user=1 plan=1 outcome=ok durationMs=22
2026-11-08T16:22:16.275-03:00  INFO 1224579 --- [           main] [b63e0bb4-e943-4b98-a647-f65de7ee29ff] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 28ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpReadToolsIT#listTransaction` - exit 0

```
2026-11-08T16:22:40.162-03:00  INFO 1225138 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-08T16:22:40.221-03:00  INFO 1225138 --- [           main] [] com.lcs.findraco.mcp.McpReadToolsIT      : Started McpReadToolsIT in 9.273 seconds (process running for 10.476)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-08T16:22:40.969-03:00  INFO 1225138 --- [           main] [cb4ede4c-d20d-40e6-943b-8b4375e71e9f] i.m.server.McpAsyncServer                : Client initialize request - Protocol: 2025-06-18, Capabilities: ClientCapabilities[experimental=null, roots=null, sampling=null, elicitation=null, extensions=null], Info: Implementation[name=test, title=null, version=1, description=null, icons=null, websiteUrl=null]
2026-11-08T16:22:40.989-03:00  INFO 1225138 --- [           main] [cb4ede4c-d20d-40e6-943b-8b4375e71e9f] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 131ms userId=- planId=-
2026-11-08T16:22:41.000-03:00  INFO 1225138 --- [           main] [f4b14bc2-630a-49d7-8e3d-31e5b1d36181] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 7ms userId=- planId=-
2026-11-08T16:22:41.227-03:00  INFO 1225138 --- [           main] [d7c66ee7-4d97-4abf-9646-aef06ed87302] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=list_transactions user=1 plan=1 outcome=ok durationMs=213
2026-11-08T16:22:41.243-03:00  INFO 1225138 --- [           main] [d7c66ee7-4d97-4abf-9646-aef06ed87302] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 241ms userId=- planId=-
2026-11-08T16:22:41.326-03:00  INFO 1225138 --- [           main] [e41c0f74-84f0-436a-9779-00110efcf71c] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=list_transactions user=1 plan=1 outcome=ok durationMs=26
2026-11-08T16:22:41.327-03:00  INFO 1225138 --- [           main] [e41c0f74-84f0-436a-9779-00110efcf71c] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 31ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpReadToolsIT#monthSummaryMat` - exit 0

```
2026-11-08T16:23:04.569-03:00  INFO 1225690 --- [           main] [] com.lcs.findraco.mcp.McpReadToolsIT      : Started McpReadToolsIT in 8.771 seconds (process running for 9.963)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-08T16:23:05.352-03:00  INFO 1225690 --- [           main] [f1263ba1-fa6a-4cd4-964e-ea0a1c47c943] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/dashboard 200 271ms userId=1 planId=1
2026-11-08T16:23:05.410-03:00  INFO 1225690 --- [           main] [8128e20b-befc-4b6d-9c66-ec2f0eceb267] i.m.server.McpAsyncServer                : Client initialize request - Protocol: 2025-06-18, Capabilities: ClientCapabilities[experimental=null, roots=null, sampling=null, elicitation=null, extensions=null], Info: Implementation[name=test, title=null, version=1, description=null, icons=null, websiteUrl=null]
2026-11-08T16:23:05.429-03:00  INFO 1225690 --- [           main] [8128e20b-befc-4b6d-9c66-ec2f0eceb267] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 56ms userId=- planId=-
2026-11-08T16:23:05.439-03:00  INFO 1225690 --- [           main] [7fc356c5-8fd3-4c1f-a3d6-639aa50ad642] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 8ms userId=- planId=-
2026-11-08T16:23:05.510-03:00  INFO 1225690 --- [           main] [10d56215-3ba6-48b2-a0fe-7ab4eae9a08d] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=get_month_summary user=1 plan=1 outcome=ok durationMs=53
2026-11-08T16:23:05.529-03:00  INFO 1225690 --- [           main] [10d56215-3ba6-48b2-a0fe-7ab4eae9a08d] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 88ms userId=- planId=-
2026-11-08T16:23:05.564-03:00  INFO 1225690 --- [           main] [376f9b57-b2a5-4cdd-8b72-980727493ee1] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=get_month_summary user=1 plan=1 outcome=ok durationMs=30
2026-11-08T16:23:05.564-03:00  INFO 1225690 --- [           main] [376f9b57-b2a5-4cdd-8b72-980727493ee1] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 34ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpReadToolsIT#categorySpendin` - exit 0

```
2026-11-08T16:23:28.240-03:00  INFO 1226256 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-08T16:23:28.242-03:00  INFO 1226256 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 2 ms
2026-11-08T16:23:28.305-03:00  INFO 1226256 --- [           main] [] com.lcs.findraco.mcp.McpReadToolsIT      : Started McpReadToolsIT in 8.792 seconds (process running for 10.028)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-08T16:23:29.048-03:00  INFO 1226256 --- [           main] [bb36a680-11fb-421a-97b0-b4e5f6dde63d] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/category/spending 200 276ms userId=1 planId=1
2026-11-08T16:23:29.118-03:00  INFO 1226256 --- [           main] [8e6ab789-110a-4117-9b41-59ecf1b96be0] i.m.server.McpAsyncServer                : Client initialize request - Protocol: 2025-06-18, Capabilities: ClientCapabilities[experimental=null, roots=null, sampling=null, elicitation=null, extensions=null], Info: Implementation[name=test, title=null, version=1, description=null, icons=null, websiteUrl=null]
2026-11-08T16:23:29.137-03:00  INFO 1226256 --- [           main] [8e6ab789-110a-4117-9b41-59ecf1b96be0] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 55ms userId=- planId=-
2026-11-08T16:23:29.146-03:00  INFO 1226256 --- [           main] [ec70c51a-f25c-499e-8e93-9ab3ed83d231] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 8ms userId=- planId=-
2026-11-08T16:23:29.208-03:00  INFO 1226256 --- [           main] [25c08fe0-1080-4702-8818-b471a2904be3] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=get_category_spending user=1 plan=1 outcome=ok durationMs=44
2026-11-08T16:23:29.225-03:00  INFO 1226256 --- [           main] [25c08fe0-1080-4702-8818-b471a2904be3] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 77ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpReadToolsIT#todayFollowsSav` - exit 0

```
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-08T16:23:52.503-03:00  INFO 1226805 --- [           main] [d597bc09-4875-4045-9c27-a517562c70fe] i.m.server.McpAsyncServer                : Client initialize request - Protocol: 2025-06-18, Capabilities: ClientCapabilities[experimental=null, roots=null, sampling=null, elicitation=null, extensions=null], Info: Implementation[name=test, title=null, version=1, description=null, icons=null, websiteUrl=null]
2026-11-08T16:23:52.524-03:00  INFO 1226805 --- [           main] [d597bc09-4875-4045-9c27-a517562c70fe] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 131ms userId=- planId=-
2026-11-08T16:23:52.535-03:00  INFO 1226805 --- [           main] [c3d31c6f-8236-442a-8acb-f85af3dbe4ff] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 7ms userId=- planId=-
2026-11-08T16:23:52.740-03:00  INFO 1226805 --- [           main] [dc1f51e2-0169-4cc4-86bb-1874ab711684] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=list_transactions user=1 plan=1 outcome=ok durationMs=191
2026-11-08T16:23:52.754-03:00  INFO 1226805 --- [           main] [dc1f51e2-0169-4cc4-86bb-1874ab711684] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 218ms userId=- planId=-
2026-11-08T16:23:52.768-03:00  INFO 1226805 --- [           main] [f4bad085-117b-4bcb-9150-12b3a1fd333d] i.m.server.McpAsyncServer                : Client initialize request - Protocol: 2025-06-18, Capabilities: ClientCapabilities[experimental=null, roots=null, sampling=null, elicitation=null, extensions=null], Info: Implementation[name=test, title=null, version=1, description=null, icons=null, websiteUrl=null]
2026-11-08T16:23:52.769-03:00  INFO 1226805 --- [           main] [f4bad085-117b-4bcb-9150-12b3a1fd333d] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 2ms userId=- planId=-
2026-11-08T16:23:52.771-03:00  INFO 1226805 --- [           main] [8b1e48ad-b3e4-4ef2-9a98-188dc3e9e142] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 1ms userId=- planId=-
2026-11-08T16:23:52.831-03:00  INFO 1226805 --- [           main] [eff1d3ac-75bc-4134-a360-37740bbfc86a] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=get_month_summary user=1 plan=1 outcome=ok durationMs=56
2026-11-08T16:23:52.831-03:00  INFO 1226805 --- [           main] [eff1d3ac-75bc-4134-a360-37740bbfc86a] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 59ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpReadToolsIT#readToolsAreRea` - exit 0

```
2026-11-08T16:24:15.785-03:00  INFO 1227369 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable completions capabilities
2026-11-08T16:24:15.909-03:00  INFO 1227369 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-08T16:24:15.910-03:00  INFO 1227369 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-08T16:24:15.911-03:00  INFO 1227369 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-08T16:24:15.980-03:00  INFO 1227369 --- [           main] [] com.lcs.findraco.mcp.McpReadToolsIT      : Started McpReadToolsIT in 8.832 seconds (process running for 10.086)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-08T16:24:16.482-03:00  INFO 1227369 --- [           main] [cdced31a-10b6-4d83-96d0-9fd6b33b027f] i.m.server.McpAsyncServer                : Client initialize request - Protocol: 2025-06-18, Capabilities: ClientCapabilities[experimental=null, roots=null, sampling=null, elicitation=null, extensions=null], Info: Implementation[name=test, title=null, version=1, description=null, icons=null, websiteUrl=null]
2026-11-08T16:24:16.501-03:00  INFO 1227369 --- [           main] [cdced31a-10b6-4d83-96d0-9fd6b33b027f] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 130ms userId=- planId=-
2026-11-08T16:24:16.512-03:00  INFO 1227369 --- [           main] [ec99f4ca-ebe1-4134-aedb-10c2ee49f7cd] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 7ms userId=- planId=-
2026-11-08T16:24:16.536-03:00  INFO 1227369 --- [           main] [b581c7be-5328-437e-ab01-ee66323319ae] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 23ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureToolsIT#createPaidBy` - exit 0

```
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-08T16:24:39.813-03:00  INFO 1227920 --- [           main] [c4bd37e6-f720-4f3f-bef0-db29427b36b7] i.m.server.McpAsyncServer                : Client initialize request - Protocol: 2025-06-18, Capabilities: ClientCapabilities[experimental=null, roots=null, sampling=null, elicitation=null, extensions=null], Info: Implementation[name=test, title=null, version=1, description=null, icons=null, websiteUrl=null]
2026-11-08T16:24:39.832-03:00  INFO 1227920 --- [           main] [c4bd37e6-f720-4f3f-bef0-db29427b36b7] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 138ms userId=- planId=-
2026-11-08T16:24:39.843-03:00  INFO 1227920 --- [           main] [1b7cba58-fa51-4ea9-8d1d-cca3f429f038] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 7ms userId=- planId=-
2026-11-08T16:24:39.992-03:00  WARN 1227920 --- [           main] [7dbb4646-4466-4981-a553-93d83fd0b626] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#items()
2026-11-08T16:24:39.995-03:00  WARN 1227920 --- [           main] [7dbb4646-4466-4981-a553-93d83fd0b626] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List)
2026-11-08T16:24:39.995-03:00  WARN 1227920 --- [           main] [7dbb4646-4466-4981-a553-93d83fd0b626] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List)
2026-11-08T16:24:39.995-03:00  WARN 1227920 --- [           main] [7dbb4646-4466-4981-a553-93d83fd0b626] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-08T16:24:39.995-03:00  WARN 1227920 --- [           main] [7dbb4646-4466-4981-a553-93d83fd0b626] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-08T16:24:39.995-03:00  WARN 1227920 --- [           main] [7dbb4646-4466-4981-a553-93d83fd0b626] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#participants()
2026-11-08T16:24:40.029-03:00  INFO 1227920 --- [           main] [7dbb4646-4466-4981-a553-93d83fd0b626] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=create_transaction user=1 plan=1 outcome=ok durationMs=163
2026-11-08T16:24:40.042-03:00  INFO 1227920 --- [           main] [7dbb4646-4466-4981-a553-93d83fd0b626] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 198ms userId=- planId=-
2026-11-08T16:24:40.192-03:00  INFO 1227920 --- [           main] [b2e53879-b585-4fef-ac44-c4353e2720ad] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/{id} 200 59ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureToolsIT#createDefaul` - exit 0

```
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
2026-11-08T16:25:03.484-03:00  INFO 1228471 --- [           main] [d6cbcfd0-d90d-46fe-a5f9-67b8b044fa1d] i.m.server.McpAsyncServer                : Client initialize request - Protocol: 2025-06-18, Capabilities: ClientCapabilities[experimental=null, roots=null, sampling=null, elicitation=null, extensions=null], Info: Implementation[name=test, title=null, version=1, description=null, icons=null, websiteUrl=null]
2026-11-08T16:25:03.504-03:00  INFO 1228471 --- [           main] [d6cbcfd0-d90d-46fe-a5f9-67b8b044fa1d] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 138ms userId=- planId=-
2026-11-08T16:25:03.515-03:00  INFO 1228471 --- [           main] [5ecc0ca2-5072-41bf-a0db-e68c7cfc063f] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 7ms userId=- planId=-
2026-11-08T16:25:03.649-03:00  WARN 1228471 --- [           main] [89ba0aa8-1a46-447a-9ee7-b7025771d07a] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#participants()
2026-11-08T16:25:03.652-03:00  WARN 1228471 --- [           main] [89ba0aa8-1a46-447a-9ee7-b7025771d07a] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-08T16:25:03.652-03:00  WARN 1228471 --- [           main] [89ba0aa8-1a46-447a-9ee7-b7025771d07a] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#items()
2026-11-08T16:25:03.652-03:00  WARN 1228471 --- [           main] [89ba0aa8-1a46-447a-9ee7-b7025771d07a] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-08T16:25:03.652-03:00  WARN 1228471 --- [           main] [89ba0aa8-1a46-447a-9ee7-b7025771d07a] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List)
2026-11-08T16:25:03.652-03:00  WARN 1228471 --- [           main] [89ba0aa8-1a46-447a-9ee7-b7025771d07a] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List)
2026-11-08T16:25:03.687-03:00  INFO 1228471 --- [           main] [89ba0aa8-1a46-447a-9ee7-b7025771d07a] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=create_transaction user=1 plan=1 outcome=ok durationMs=154
2026-11-08T16:25:03.701-03:00  INFO 1228471 --- [           main] [89ba0aa8-1a46-447a-9ee7-b7025771d07a] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 185ms userId=- planId=-
2026-11-08T16:25:03.783-03:00  INFO 1228471 --- [           main] [941d6a58-dab5-49e7-accd-bb2f4253f26f] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/{id} 200 49ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureToolsIT#createResolv` - exit 0

```
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-08T16:25:27.805-03:00  INFO 1229027 --- [           main] [af75fa1f-fe0e-4506-80ee-bccba63577ea] i.m.server.McpAsyncServer                : Client initialize request - Protocol: 2025-06-18, Capabilities: ClientCapabilities[experimental=null, roots=null, sampling=null, elicitation=null, extensions=null], Info: Implementation[name=test, title=null, version=1, description=null, icons=null, websiteUrl=null]
2026-11-08T16:25:27.830-03:00  INFO 1229027 --- [           main] [af75fa1f-fe0e-4506-80ee-bccba63577ea] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 156ms userId=- planId=-
2026-11-08T16:25:27.842-03:00  INFO 1229027 --- [           main] [5021b672-ce12-44d8-9988-9a20ef829a52] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 7ms userId=- planId=-
2026-11-08T16:25:28.022-03:00  WARN 1229027 --- [           main] [9c06c503-4612-4bf5-a893-7cbdc83a604d] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-08T16:25:28.025-03:00  WARN 1229027 --- [           main] [9c06c503-4612-4bf5-a893-7cbdc83a604d] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List)
2026-11-08T16:25:28.026-03:00  WARN 1229027 --- [           main] [9c06c503-4612-4bf5-a893-7cbdc83a604d] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List)
2026-11-08T16:25:28.026-03:00  WARN 1229027 --- [           main] [9c06c503-4612-4bf5-a893-7cbdc83a604d] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#participants()
2026-11-08T16:25:28.026-03:00  WARN 1229027 --- [           main] [9c06c503-4612-4bf5-a893-7cbdc83a604d] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#items()
2026-11-08T16:25:28.026-03:00  WARN 1229027 --- [           main] [9c06c503-4612-4bf5-a893-7cbdc83a604d] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-08T16:25:28.054-03:00  INFO 1229027 --- [           main] [9c06c503-4612-4bf5-a893-7cbdc83a604d] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=create_transaction user=1 plan=1 outcome=ok durationMs=193
2026-11-08T16:25:28.067-03:00  INFO 1229027 --- [           main] [9c06c503-4612-4bf5-a893-7cbdc83a604d] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 224ms userId=- planId=-
2026-11-08T16:25:28.147-03:00  INFO 1229027 --- [           main] [5b9b575d-2b61-43c2-a503-7831c5025416] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/{id} 200 47ms userId=1 planId=1
2026-11-08T16:25:28.240-03:00  INFO 1229027 --- [           main] [2a6f9fec-e2ab-4252-bbd6-2761c513853b] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=create_transaction user=1 plan=1 outcome=error durationMs=24
2026-11-08T16:25:28.241-03:00  INFO 1229027 --- [           main] [2a6f9fec-e2ab-4252-bbd6-2761c513853b] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 27ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureToolsIT#createReject` - exit 0

```
2026-11-08T16:25:51.828-03:00  WARN 1229582 --- [           main] [be708880-9258-42b5-b0e0-e2b69574983f] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List)
2026-11-08T16:25:51.829-03:00  WARN 1229582 --- [           main] [be708880-9258-42b5-b0e0-e2b69574983f] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List)
2026-11-08T16:25:51.829-03:00  WARN 1229582 --- [           main] [be708880-9258-42b5-b0e0-e2b69574983f] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#participants()
2026-11-08T16:25:51.829-03:00  WARN 1229582 --- [           main] [be708880-9258-42b5-b0e0-e2b69574983f] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-08T16:25:51.829-03:00  WARN 1229582 --- [           main] [be708880-9258-42b5-b0e0-e2b69574983f] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#items()
2026-11-08T16:25:51.836-03:00  INFO 1229582 --- [           main] [be708880-9258-42b5-b0e0-e2b69574983f] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=create_transaction user=1 plan=1 outcome=error durationMs=133
2026-11-08T16:25:51.850-03:00  INFO 1229582 --- [           main] [be708880-9258-42b5-b0e0-e2b69574983f] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 163ms userId=- planId=-
2026-11-08T16:25:51.907-03:00  INFO 1229582 --- [           main] [c4d4b176-6678-4745-b1df-733e8474bbaf] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=create_transaction user=1 plan=1 outcome=error durationMs=13
2026-11-08T16:25:51.907-03:00  INFO 1229582 --- [           main] [c4d4b176-6678-4745-b1df-733e8474bbaf] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 17ms userId=- planId=-
2026-11-08T16:25:51.927-03:00  INFO 1229582 --- [           main] [787fc2d0-6430-457d-b469-0d2be2c0934b] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=create_transaction user=1 plan=1 outcome=error durationMs=9
2026-11-08T16:25:51.928-03:00  INFO 1229582 --- [           main] [787fc2d0-6430-457d-b469-0d2be2c0934b] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 19ms userId=- planId=-
2026-11-08T16:25:51.939-03:00  INFO 1229582 --- [           main] [ddb6e934-2e92-46d4-84cd-a748154c801d] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=create_transaction user=1 plan=1 outcome=error durationMs=7
2026-11-08T16:25:51.939-03:00  INFO 1229582 --- [           main] [ddb6e934-2e92-46d4-84cd-a748154c801d] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 10ms userId=- planId=-
2026-11-08T16:25:51.950-03:00  INFO 1229582 --- [           main] [2dfd38f1-1f6a-40c5-8e1d-3a1959364bcc] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=create_transaction user=1 plan=1 outcome=error durationMs=6
2026-11-08T16:25:51.950-03:00  INFO 1229582 --- [           main] [2dfd38f1-1f6a-40c5-8e1d-3a1959364bcc] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 9ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureToolsIT#writeResultN` - exit 0

```
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-08T16:26:15.323-03:00  INFO 1230126 --- [           main] [fa59d755-bdba-4547-90cd-bf3882f90f8f] i.m.server.McpAsyncServer                : Client initialize request - Protocol: 2025-06-18, Capabilities: ClientCapabilities[experimental=null, roots=null, sampling=null, elicitation=null, extensions=null], Info: Implementation[name=test, title=null, version=1, description=null, icons=null, websiteUrl=null]
2026-11-08T16:26:15.343-03:00  INFO 1230126 --- [           main] [fa59d755-bdba-4547-90cd-bf3882f90f8f] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 129ms userId=- planId=-
2026-11-08T16:26:15.354-03:00  INFO 1230126 --- [           main] [3b71058c-b347-421d-92ca-4527103b1d32] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 7ms userId=- planId=-
2026-11-08T16:26:15.554-03:00  WARN 1230126 --- [           main] [9c1223fb-e12b-432a-b223-30248af0e9fc] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#participants()
2026-11-08T16:26:15.557-03:00  WARN 1230126 --- [           main] [9c1223fb-e12b-432a-b223-30248af0e9fc] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-08T16:26:15.557-03:00  WARN 1230126 --- [           main] [9c1223fb-e12b-432a-b223-30248af0e9fc] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#items()
2026-11-08T16:26:15.557-03:00  WARN 1230126 --- [           main] [9c1223fb-e12b-432a-b223-30248af0e9fc] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-08T16:26:15.558-03:00  WARN 1230126 --- [           main] [9c1223fb-e12b-432a-b223-30248af0e9fc] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List)
2026-11-08T16:26:15.558-03:00  WARN 1230126 --- [           main] [9c1223fb-e12b-432a-b223-30248af0e9fc] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List)
2026-11-08T16:26:15.581-03:00  INFO 1230126 --- [           main] [9c1223fb-e12b-432a-b223-30248af0e9fc] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=create_transaction user=1 plan=1 outcome=ok durationMs=203
2026-11-08T16:26:15.596-03:00  INFO 1230126 --- [           main] [9c1223fb-e12b-432a-b223-30248af0e9fc] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 241ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureToolsIT#createSchema` - exit 0

```
2026-11-08T16:26:38.617-03:00  INFO 1230691 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable completions capabilities
2026-11-08T16:26:38.741-03:00  INFO 1230691 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-08T16:26:38.742-03:00  INFO 1230691 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-08T16:26:38.743-03:00  INFO 1230691 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-08T16:26:38.799-03:00  INFO 1230691 --- [           main] [] com.lcs.findraco.mcp.McpCaptureToolsIT   : Started McpCaptureToolsIT in 8.886 seconds (process running for 10.052)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-08T16:26:39.304-03:00  INFO 1230691 --- [           main] [2cd67b1a-3d46-4aa4-a879-6d44916117f3] i.m.server.McpAsyncServer                : Client initialize request - Protocol: 2025-06-18, Capabilities: ClientCapabilities[experimental=null, roots=null, sampling=null, elicitation=null, extensions=null], Info: Implementation[name=test, title=null, version=1, description=null, icons=null, websiteUrl=null]
2026-11-08T16:26:39.324-03:00  INFO 1230691 --- [           main] [2cd67b1a-3d46-4aa4-a879-6d44916117f3] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 130ms userId=- planId=-
2026-11-08T16:26:39.335-03:00  INFO 1230691 --- [           main] [c09753c6-af7d-488c-a85d-ceeba2377306] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 7ms userId=- planId=-
2026-11-08T16:26:39.358-03:00  INFO 1230691 --- [           main] [17e3fee6-91e9-4b29-a0ce-ea320d28f761] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 22ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureToolsIT#confirmRecor` - exit 0

```
2026-11-08T16:27:03.007-03:00  INFO 1231236 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-08T16:27:03.063-03:00  INFO 1231236 --- [           main] [] com.lcs.findraco.mcp.McpCaptureToolsIT   : Started McpCaptureToolsIT in 8.91 seconds (process running for 10.167)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-08T16:27:03.595-03:00  INFO 1231236 --- [           main] [6b0d14ef-caa9-402b-8ad9-0cd30ea7a1ea] i.m.server.McpAsyncServer                : Client initialize request - Protocol: 2025-06-18, Capabilities: ClientCapabilities[experimental=null, roots=null, sampling=null, elicitation=null, extensions=null], Info: Implementation[name=test, title=null, version=1, description=null, icons=null, websiteUrl=null]
2026-11-08T16:27:03.615-03:00  INFO 1231236 --- [           main] [6b0d14ef-caa9-402b-8ad9-0cd30ea7a1ea] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 137ms userId=- planId=-
2026-11-08T16:27:03.626-03:00  INFO 1231236 --- [           main] [2bab85ab-b6e0-4171-96d0-a94d437c0ed5] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 7ms userId=- planId=-
2026-11-08T16:27:03.793-03:00  INFO 1231236 --- [           main] [c48a0b62-1206-4e70-9d77-414515394574] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=confirm_transaction user=1 plan=1 outcome=ok durationMs=150
2026-11-08T16:27:03.807-03:00  INFO 1231236 --- [           main] [c48a0b62-1206-4e70-9d77-414515394574] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 180ms userId=- planId=-
2026-11-08T16:27:03.892-03:00  INFO 1231236 --- [           main] [a887c3b6-ecb9-4ffc-8cff-854f862f1a99] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=confirm_transaction user=1 plan=1 outcome=ok durationMs=25
2026-11-08T16:27:03.892-03:00  INFO 1231236 --- [           main] [a887c3b6-ecb9-4ffc-8cff-854f862f1a99] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 29ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureToolsIT#confirmRecom` - exit 0

```
2026-11-08T16:27:26.933-03:00  INFO 1231784 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-08T16:27:26.935-03:00  INFO 1231784 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 2 ms
2026-11-08T16:27:26.990-03:00  INFO 1231784 --- [           main] [] com.lcs.findraco.mcp.McpCaptureToolsIT   : Started McpCaptureToolsIT in 8.914 seconds (process running for 10.058)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-08T16:27:27.535-03:00  INFO 1231784 --- [           main] [630b488b-6d87-4047-bd8e-bdb4819b4748] i.m.server.McpAsyncServer                : Client initialize request - Protocol: 2025-06-18, Capabilities: ClientCapabilities[experimental=null, roots=null, sampling=null, elicitation=null, extensions=null], Info: Implementation[name=test, title=null, version=1, description=null, icons=null, websiteUrl=null]
2026-11-08T16:27:27.554-03:00  INFO 1231784 --- [           main] [630b488b-6d87-4047-bd8e-bdb4819b4748] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 129ms userId=- planId=-
2026-11-08T16:27:27.565-03:00  INFO 1231784 --- [           main] [3c980457-8b08-4b1f-8125-87e0b8bf30e0] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 7ms userId=- planId=-
2026-11-08T16:27:27.734-03:00  INFO 1231784 --- [           main] [64c282d3-3754-4f83-8af6-5f03efa8cda6] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=confirm_transaction user=1 plan=1 outcome=ok durationMs=154
2026-11-08T16:27:27.748-03:00  INFO 1231784 --- [           main] [64c282d3-3754-4f83-8af6-5f03efa8cda6] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 182ms userId=- planId=-
2026-11-08T16:27:27.827-03:00  INFO 1231784 --- [           main] [93094b6c-0ce0-431e-a8c2-91ba6e94016b] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/{id} 200 39ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureToolsIT#confirmNotAw` - exit 0

```
2026-11-08T16:27:51.403-03:00  INFO 1232348 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-08T16:27:51.404-03:00  INFO 1232348 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-08T16:27:51.462-03:00  INFO 1232348 --- [           main] [] com.lcs.findraco.mcp.McpCaptureToolsIT   : Started McpCaptureToolsIT in 9.098 seconds (process running for 10.34)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-08T16:27:52.001-03:00  INFO 1232348 --- [           main] [c779a5a9-c615-4289-b690-11a2e7fea44d] i.m.server.McpAsyncServer                : Client initialize request - Protocol: 2025-06-18, Capabilities: ClientCapabilities[experimental=null, roots=null, sampling=null, elicitation=null, extensions=null], Info: Implementation[name=test, title=null, version=1, description=null, icons=null, websiteUrl=null]
2026-11-08T16:27:52.020-03:00  INFO 1232348 --- [           main] [c779a5a9-c615-4289-b690-11a2e7fea44d] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 128ms userId=- planId=-
2026-11-08T16:27:52.031-03:00  INFO 1232348 --- [           main] [34e84149-3f20-45e4-8b8d-56015ed2c647] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 7ms userId=- planId=-
2026-11-08T16:27:52.198-03:00  INFO 1232348 --- [           main] [057c5abf-5bd5-4caa-a8f0-d6de448cfed7] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=confirm_transaction user=1 plan=1 outcome=error durationMs=150
2026-11-08T16:27:52.212-03:00  INFO 1232348 --- [           main] [057c5abf-5bd5-4caa-a8f0-d6de448cfed7] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 180ms userId=- planId=-
2026-11-08T16:27:52.327-03:00  INFO 1232348 --- [           main] [1bc46b82-32b6-4f55-911f-82645ba0c23c] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/{id} 200 42ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureToolsIT#roleMatrixFo` - exit 0

```
2026-11-08T16:28:15.919-03:00  INFO 1232884 --- [           main] [75547573-e9dc-4df0-8911-a87ecc7e9415] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 2ms userId=- planId=-
2026-11-08T16:28:15.921-03:00  INFO 1232884 --- [           main] [92cb8fbd-1549-49c8-9209-3dded2215154] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 1ms userId=- planId=-
2026-11-08T16:28:15.928-03:00  INFO 1232884 --- [           main] [747397ba-101d-4698-ad38-8f08b56d5ec7] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=create_transaction user=5 plan=null outcome=error durationMs=4
2026-11-08T16:28:15.928-03:00  INFO 1232884 --- [           main] [747397ba-101d-4698-ad38-8f08b56d5ec7] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 6ms userId=- planId=-
2026-11-08T16:28:16.026-03:00  INFO 1232884 --- [           main] [0aa6ed2d-e567-4f88-aae5-81abb697c63e] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/{id} 200 42ms userId=1 planId=1
2026-11-08T16:28:16.040-03:00  INFO 1232884 --- [           main] [47d28246-7a76-4bf5-ae41-9e3e2797d536] i.m.server.McpAsyncServer                : Client initialize request - Protocol: 2025-06-18, Capabilities: ClientCapabilities[experimental=null, roots=null, sampling=null, elicitation=null, extensions=null], Info: Implementation[name=test, title=null, version=1, description=null, icons=null, websiteUrl=null]
2026-11-08T16:28:16.040-03:00  INFO 1232884 --- [           main] [47d28246-7a76-4bf5-ae41-9e3e2797d536] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 2ms userId=- planId=-
2026-11-08T16:28:16.042-03:00  INFO 1232884 --- [           main] [5b827461-1305-4fed-890e-05f92023c755] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 1ms userId=- planId=-
2026-11-08T16:28:16.065-03:00  INFO 1232884 --- [           main] [205c6d4e-c225-4eeb-a3c4-ae64ecb0c392] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=create_transaction user=3 plan=1 outcome=ok durationMs=19
2026-11-08T16:28:16.066-03:00  INFO 1232884 --- [           main] [205c6d4e-c225-4eeb-a3c4-ae64ecb0c392] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 23ms userId=- planId=-
2026-11-08T16:28:16.072-03:00  INFO 1232884 --- [           main] [b4c3b453-1819-41f2-8ee1-c5e04701264f] i.m.server.McpAsyncServer                : Client initialize request - Protocol: 2025-06-18, Capabilities: ClientCapabilities[experimental=null, roots=null, sampling=null, elicitation=null, extensions=null], Info: Implementation[name=test, title=null, version=1, description=null, icons=null, websiteUrl=null]
2026-11-08T16:28:16.073-03:00  INFO 1232884 --- [           main] [b4c3b453-1819-41f2-8ee1-c5e04701264f] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 2ms userId=- planId=-
2026-11-08T16:28:16.075-03:00  INFO 1232884 --- [           main] [235830b6-a478-41d2-8024-e243e15128e0] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 1ms userId=- planId=-
2026-11-08T16:28:16.121-03:00  INFO 1232884 --- [           main] [630aff9d-7c56-4310-bbb1-f07174f323ff] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=confirm_transaction user=2 plan=1 outcome=ok durationMs=43
2026-11-08T16:28:16.121-03:00  INFO 1232884 --- [           main] [630aff9d-7c56-4310-bbb1-f07174f323ff] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 45ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureToolsIT#otherPlanIdN` - exit 0

```
2026-11-08T16:28:39.088-03:00  INFO 1233459 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-08T16:28:39.088-03:00  INFO 1233459 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-08T16:28:39.089-03:00  INFO 1233459 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-08T16:28:39.146-03:00  INFO 1233459 --- [           main] [] com.lcs.findraco.mcp.McpCaptureToolsIT   : Started McpCaptureToolsIT in 8.829 seconds (process running for 10.079)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-08T16:28:39.682-03:00  INFO 1233459 --- [           main] [4d5a862f-3f1a-4774-b873-536a4e81e204] i.m.server.McpAsyncServer                : Client initialize request - Protocol: 2025-06-18, Capabilities: ClientCapabilities[experimental=null, roots=null, sampling=null, elicitation=null, extensions=null], Info: Implementation[name=test, title=null, version=1, description=null, icons=null, websiteUrl=null]
2026-11-08T16:28:39.703-03:00  INFO 1233459 --- [           main] [4d5a862f-3f1a-4774-b873-536a4e81e204] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 129ms userId=- planId=-
2026-11-08T16:28:39.714-03:00  INFO 1233459 --- [           main] [e14c474a-4d55-4ea9-955e-6fbb956d9482] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 7ms userId=- planId=-
2026-11-08T16:28:39.867-03:00  INFO 1233459 --- [           main] [e252dd87-8fdc-40f0-abcc-0bdcddc564b9] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=confirm_transaction user=1 plan=1 outcome=error durationMs=137
2026-11-08T16:28:39.886-03:00  INFO 1233459 --- [           main] [e252dd87-8fdc-40f0-abcc-0bdcddc564b9] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 171ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureToolsIT#writeHints' ` - exit 0

```
2026-11-08T16:29:02.904-03:00  INFO 1234004 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable completions capabilities
2026-11-08T16:29:03.029-03:00  INFO 1234004 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-08T16:29:03.029-03:00  INFO 1234004 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-08T16:29:03.030-03:00  INFO 1234004 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-08T16:29:03.089-03:00  INFO 1234004 --- [           main] [] com.lcs.findraco.mcp.McpCaptureToolsIT   : Started McpCaptureToolsIT in 8.837 seconds (process running for 10.055)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-08T16:29:03.614-03:00  INFO 1234004 --- [           main] [1de4bc8c-4f12-4d42-930a-416e5973ce83] i.m.server.McpAsyncServer                : Client initialize request - Protocol: 2025-06-18, Capabilities: ClientCapabilities[experimental=null, roots=null, sampling=null, elicitation=null, extensions=null], Info: Implementation[name=test, title=null, version=1, description=null, icons=null, websiteUrl=null]
2026-11-08T16:29:03.635-03:00  INFO 1234004 --- [           main] [1de4bc8c-4f12-4d42-930a-416e5973ce83] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 130ms userId=- planId=-
2026-11-08T16:29:03.646-03:00  INFO 1234004 --- [           main] [93bd93dc-7231-41d0-94e2-1a51ae59ab47] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 7ms userId=- planId=-
2026-11-08T16:29:03.668-03:00  INFO 1234004 --- [           main] [0be9d651-9962-4d88-989d-9695cdb92991] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 22ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q test -Dtest='McpUpdateCopyTest#keepsEveryStoredF` - exit 0

```
(no output)
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpUpdateToolIT#updateKeepsIte` - exit 0

```
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-08T16:29:32.067-03:00  INFO 1234849 --- [           main] [c41d0f08-759b-4baa-81f9-b0584ac6388a] i.m.server.McpAsyncServer                : Client initialize request - Protocol: 2025-06-18, Capabilities: ClientCapabilities[experimental=null, roots=null, sampling=null, elicitation=null, extensions=null], Info: Implementation[name=test, title=null, version=1, description=null, icons=null, websiteUrl=null]
2026-11-08T16:29:32.088-03:00  INFO 1234849 --- [           main] [c41d0f08-759b-4baa-81f9-b0584ac6388a] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 139ms userId=- planId=-
2026-11-08T16:29:32.099-03:00  INFO 1234849 --- [           main] [19fadc36-b7e7-4189-81d3-ba2fcf0ceb70] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 7ms userId=- planId=-
2026-11-08T16:29:32.251-03:00  WARN 1234849 --- [           main] [25243d1c-caf4-49fe-9976-4627eed85645] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-08T16:29:32.254-03:00  WARN 1234849 --- [           main] [25243d1c-caf4-49fe-9976-4627eed85645] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#items()
2026-11-08T16:29:32.254-03:00  WARN 1234849 --- [           main] [25243d1c-caf4-49fe-9976-4627eed85645] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-08T16:29:32.254-03:00  WARN 1234849 --- [           main] [25243d1c-caf4-49fe-9976-4627eed85645] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#com.lcs.findraco.transaction.request.UpdateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, Long)
2026-11-08T16:29:32.254-03:00  WARN 1234849 --- [           main] [25243d1c-caf4-49fe-9976-4627eed85645] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#com.lcs.findraco.transaction.request.UpdateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, Long)
2026-11-08T16:29:32.255-03:00  WARN 1234849 --- [           main] [25243d1c-caf4-49fe-9976-4627eed85645] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#participants()
2026-11-08T16:29:32.334-03:00  INFO 1234849 --- [           main] [25243d1c-caf4-49fe-9976-4627eed85645] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=update_transaction user=1 plan=1 outcome=ok durationMs=220
2026-11-08T16:29:32.347-03:00  INFO 1234849 --- [           main] [25243d1c-caf4-49fe-9976-4627eed85645] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 247ms userId=- planId=-
2026-11-08T16:29:32.473-03:00  INFO 1234849 --- [           main] [9d253640-d203-4702-a071-c4345140ae33] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/{id} 200 45ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpUpdateToolIT#occurrenceEdit` - exit 0

```
2026-11-08T16:29:56.375-03:00  INFO 1235411 --- [           main] [b2b2028e-65db-4ad7-86e1-e3b90ed684bb] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 268ms userId=1 planId=1
2026-11-08T16:29:56.487-03:00  INFO 1235411 --- [           main] [e9f8131a-480d-44a3-8368-9d228c07bc0c] i.m.server.McpAsyncServer                : Client initialize request - Protocol: 2025-06-18, Capabilities: ClientCapabilities[experimental=null, roots=null, sampling=null, elicitation=null, extensions=null], Info: Implementation[name=test, title=null, version=1, description=null, icons=null, websiteUrl=null]
2026-11-08T16:29:56.503-03:00  INFO 1235411 --- [           main] [e9f8131a-480d-44a3-8368-9d228c07bc0c] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 47ms userId=- planId=-
2026-11-08T16:29:56.511-03:00  INFO 1235411 --- [           main] [39585fcb-bca6-40a1-93cb-38a03d828964] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 7ms userId=- planId=-
2026-11-08T16:29:56.573-03:00  WARN 1235411 --- [           main] [452ea4c7-9f41-4619-8767-8172184e6289] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-08T16:29:56.574-03:00  WARN 1235411 --- [           main] [452ea4c7-9f41-4619-8767-8172184e6289] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#participants()
2026-11-08T16:29:56.574-03:00  WARN 1235411 --- [           main] [452ea4c7-9f41-4619-8767-8172184e6289] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#items()
2026-11-08T16:29:56.574-03:00  WARN 1235411 --- [           main] [452ea4c7-9f41-4619-8767-8172184e6289] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-08T16:29:56.574-03:00  WARN 1235411 --- [           main] [452ea4c7-9f41-4619-8767-8172184e6289] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#com.lcs.findraco.transaction.request.UpdateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, Long)
2026-11-08T16:29:56.574-03:00  WARN 1235411 --- [           main] [452ea4c7-9f41-4619-8767-8172184e6289] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#com.lcs.findraco.transaction.request.UpdateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, Long)
2026-11-08T16:29:56.613-03:00  INFO 1235411 --- [           main] [452ea4c7-9f41-4619-8767-8172184e6289] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=update_transaction user=1 plan=1 outcome=ok durationMs=87
2026-11-08T16:29:56.626-03:00  INFO 1235411 --- [           main] [452ea4c7-9f41-4619-8767-8172184e6289] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 114ms userId=- planId=-
2026-11-08T16:29:56.645-03:00  INFO 1235411 --- [           main] [c52589ab-2101-42f6-a794-45d96ca2f1cc] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/{id} 200 14ms userId=1 planId=1
2026-11-08T16:29:56.661-03:00  INFO 1235411 --- [           main] [8749bb14-3787-4f86-9c5e-5ee27cc84da1] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/{id} 200 12ms userId=1 planId=1
2026-11-08T16:29:56.675-03:00  INFO 1235411 --- [           main] [5b5a8940-9404-43c8-aeba-f1542f645786] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/{id} 200 12ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpUpdateToolIT#emptyUpdateIsT` - exit 0

```
2026-11-08T16:30:19.559-03:00  INFO 1235964 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-08T16:30:19.559-03:00  INFO 1235964 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-08T16:30:19.561-03:00  INFO 1235964 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 2 ms
2026-11-08T16:30:19.623-03:00  INFO 1235964 --- [           main] [] com.lcs.findraco.mcp.McpUpdateToolIT     : Started McpUpdateToolIT in 8.953 seconds (process running for 10.097)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-08T16:30:20.172-03:00  INFO 1235964 --- [           main] [9d904b12-ebd2-4dcc-81df-de1e45a26295] i.m.server.McpAsyncServer                : Client initialize request - Protocol: 2025-06-18, Capabilities: ClientCapabilities[experimental=null, roots=null, sampling=null, elicitation=null, extensions=null], Info: Implementation[name=test, title=null, version=1, description=null, icons=null, websiteUrl=null]
2026-11-08T16:30:20.192-03:00  INFO 1235964 --- [           main] [9d904b12-ebd2-4dcc-81df-de1e45a26295] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 140ms userId=- planId=-
2026-11-08T16:30:20.204-03:00  INFO 1235964 --- [           main] [667cede0-4549-48ee-a508-e3734069d443] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 8ms userId=- planId=-
2026-11-08T16:30:20.326-03:00  INFO 1235964 --- [           main] [c01ceb73-e6a8-42eb-9e0e-7b254099012c] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=update_transaction user=1 plan=1 outcome=error durationMs=107
2026-11-08T16:30:20.340-03:00  INFO 1235964 --- [           main] [c01ceb73-e6a8-42eb-9e0e-7b254099012c] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 134ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpUpdateToolIT#splitRulesOnAm` - exit 0

```
2026-11-08T16:30:44.672-03:00  WARN 1236511 --- [           main] [ce77feaa-0685-4a67-9014-6b67c615bd1c] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#participants()
2026-11-08T16:30:44.676-03:00  WARN 1236511 --- [           main] [ce77feaa-0685-4a67-9014-6b67c615bd1c] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#com.lcs.findraco.transaction.request.UpdateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, Long)
2026-11-08T16:30:44.676-03:00  WARN 1236511 --- [           main] [ce77feaa-0685-4a67-9014-6b67c615bd1c] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#com.lcs.findraco.transaction.request.UpdateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, Long)
2026-11-08T16:30:44.676-03:00  WARN 1236511 --- [           main] [ce77feaa-0685-4a67-9014-6b67c615bd1c] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-08T16:30:44.676-03:00  WARN 1236511 --- [           main] [ce77feaa-0685-4a67-9014-6b67c615bd1c] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-08T16:30:44.677-03:00  WARN 1236511 --- [           main] [ce77feaa-0685-4a67-9014-6b67c615bd1c] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#items()
2026-11-08T16:30:44.735-03:00  INFO 1236511 --- [           main] [ce77feaa-0685-4a67-9014-6b67c615bd1c] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=update_transaction user=1 plan=1 outcome=ok durationMs=198
2026-11-08T16:30:44.750-03:00  INFO 1236511 --- [           main] [ce77feaa-0685-4a67-9014-6b67c615bd1c] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 227ms userId=- planId=-
2026-11-08T16:30:44.828-03:00  INFO 1236511 --- [           main] [4ea18c74-2109-4027-80e7-18776ae49dca] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/{id} 200 42ms userId=1 planId=1
2026-11-08T16:30:44.921-03:00  INFO 1236511 --- [           main] [a6614b45-b8c5-4f13-98af-cb26558ca261] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=update_transaction user=1 plan=1 outcome=error durationMs=22
2026-11-08T16:30:44.922-03:00  INFO 1236511 --- [           main] [a6614b45-b8c5-4f13-98af-cb26558ca261] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 26ms userId=- planId=-
2026-11-08T16:30:44.953-03:00  INFO 1236511 --- [           main] [d31aed57-48fa-447a-9873-6b700e4d8fff] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/{id} 200 23ms userId=1 planId=1
2026-11-08T16:30:44.988-03:00  INFO 1236511 --- [           main] [fc94e0b1-12e5-4717-b6d5-b5a79385cd68] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=update_transaction user=1 plan=1 outcome=ok durationMs=30
2026-11-08T16:30:44.988-03:00  INFO 1236511 --- [           main] [fc94e0b1-12e5-4717-b6d5-b5a79385cd68] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 34ms userId=- planId=-
2026-11-08T16:30:45.005-03:00  INFO 1236511 --- [           main] [ea87f9f6-38d8-4cc2-a79e-f4c88030ed26] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/{id} 200 14ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpUpdateToolIT#amountBelowIte` - exit 0

```
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-08T16:31:08.291-03:00  INFO 1237058 --- [           main] [910c5a7f-a46a-4ca9-9354-bd56d95b9137] i.m.server.McpAsyncServer                : Client initialize request - Protocol: 2025-06-18, Capabilities: ClientCapabilities[experimental=null, roots=null, sampling=null, elicitation=null, extensions=null], Info: Implementation[name=test, title=null, version=1, description=null, icons=null, websiteUrl=null]
2026-11-08T16:31:08.311-03:00  INFO 1237058 --- [           main] [910c5a7f-a46a-4ca9-9354-bd56d95b9137] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 129ms userId=- planId=-
2026-11-08T16:31:08.321-03:00  INFO 1237058 --- [           main] [3b48c0a8-798e-48a1-931f-e185e6c2f6a1] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 7ms userId=- planId=-
2026-11-08T16:31:08.470-03:00  WARN 1237058 --- [           main] [2090e0bf-9dd1-4e6c-b750-2d1f7511e431] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-08T16:31:08.473-03:00  WARN 1237058 --- [           main] [2090e0bf-9dd1-4e6c-b750-2d1f7511e431] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#com.lcs.findraco.transaction.request.UpdateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, Long)
2026-11-08T16:31:08.473-03:00  WARN 1237058 --- [           main] [2090e0bf-9dd1-4e6c-b750-2d1f7511e431] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#com.lcs.findraco.transaction.request.UpdateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, Long)
2026-11-08T16:31:08.473-03:00  WARN 1237058 --- [           main] [2090e0bf-9dd1-4e6c-b750-2d1f7511e431] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#participants()
2026-11-08T16:31:08.473-03:00  WARN 1237058 --- [           main] [2090e0bf-9dd1-4e6c-b750-2d1f7511e431] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#items()
2026-11-08T16:31:08.473-03:00  WARN 1237058 --- [           main] [2090e0bf-9dd1-4e6c-b750-2d1f7511e431] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-08T16:31:08.509-03:00  INFO 1237058 --- [           main] [2090e0bf-9dd1-4e6c-b750-2d1f7511e431] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=update_transaction user=1 plan=1 outcome=error durationMs=173
2026-11-08T16:31:08.524-03:00  INFO 1237058 --- [           main] [2090e0bf-9dd1-4e6c-b750-2d1f7511e431] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 201ms userId=- planId=-
2026-11-08T16:31:08.650-03:00  INFO 1237058 --- [           main] [e4398698-6f4f-4355-8f25-b442e3a5465a] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/{id} 200 50ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpUpdateToolIT#staleVersionIs` - exit 0

```
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-08T16:31:32.531-03:00  INFO 1237602 --- [           main] [6a9a3563-585b-42a9-8a09-eb0acea7619b] i.m.server.McpAsyncServer                : Client initialize request - Protocol: 2025-06-18, Capabilities: ClientCapabilities[experimental=null, roots=null, sampling=null, elicitation=null, extensions=null], Info: Implementation[name=test, title=null, version=1, description=null, icons=null, websiteUrl=null]
2026-11-08T16:31:32.551-03:00  INFO 1237602 --- [           main] [6a9a3563-585b-42a9-8a09-eb0acea7619b] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 137ms userId=- planId=-
2026-11-08T16:31:32.562-03:00  INFO 1237602 --- [           main] [bcff235e-7fbd-4878-b914-70cfcd1b87cd] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 7ms userId=- planId=-
2026-11-08T16:31:32.710-03:00  WARN 1237602 --- [           main] [7ba4b647-4888-4f62-aba4-5284ffeece57] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-08T16:31:32.713-03:00  WARN 1237602 --- [           main] [7ba4b647-4888-4f62-aba4-5284ffeece57] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#com.lcs.findraco.transaction.request.UpdateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, Long)
2026-11-08T16:31:32.713-03:00  WARN 1237602 --- [           main] [7ba4b647-4888-4f62-aba4-5284ffeece57] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#com.lcs.findraco.transaction.request.UpdateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, Long)
2026-11-08T16:31:32.713-03:00  WARN 1237602 --- [           main] [7ba4b647-4888-4f62-aba4-5284ffeece57] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-08T16:31:32.714-03:00  WARN 1237602 --- [           main] [7ba4b647-4888-4f62-aba4-5284ffeece57] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#participants()
2026-11-08T16:31:32.714-03:00  WARN 1237602 --- [           main] [7ba4b647-4888-4f62-aba4-5284ffeece57] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#items()
2026-11-08T16:31:32.737-03:00  INFO 1237602 --- [           main] [7ba4b647-4888-4f62-aba4-5284ffeece57] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=update_transaction user=1 plan=1 outcome=error durationMs=160
2026-11-08T16:31:32.752-03:00  INFO 1237602 --- [           main] [7ba4b647-4888-4f62-aba4-5284ffeece57] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 189ms userId=- planId=-
2026-11-08T16:31:32.878-03:00  INFO 1237602 --- [           main] [067545db-bfe5-43f4-8eab-93e867af8bce] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/{id} 200 42ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpUpdateToolIT#viewerCannotEd` - exit 0

```
2026-11-08T16:31:56.306-03:00  INFO 1238155 --- [           main] [5093db08-7118-4b5e-b97e-711fe3bcca99] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 129ms userId=- planId=-
2026-11-08T16:31:56.317-03:00  INFO 1238155 --- [           main] [42f331cb-66e6-403d-9196-ed7686c0113c] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 7ms userId=- planId=-
2026-11-08T16:31:56.489-03:00  WARN 1238155 --- [           main] [fd72dd2a-2b39-41e5-9618-dbb7a276138b] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-08T16:31:56.492-03:00  WARN 1238155 --- [           main] [fd72dd2a-2b39-41e5-9618-dbb7a276138b] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-08T16:31:56.493-03:00  WARN 1238155 --- [           main] [fd72dd2a-2b39-41e5-9618-dbb7a276138b] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#items()
2026-11-08T16:31:56.493-03:00  WARN 1238155 --- [           main] [fd72dd2a-2b39-41e5-9618-dbb7a276138b] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#participants()
2026-11-08T16:31:56.494-03:00  WARN 1238155 --- [           main] [fd72dd2a-2b39-41e5-9618-dbb7a276138b] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#com.lcs.findraco.transaction.request.UpdateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, Long)
2026-11-08T16:31:56.494-03:00  WARN 1238155 --- [           main] [fd72dd2a-2b39-41e5-9618-dbb7a276138b] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#com.lcs.findraco.transaction.request.UpdateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, Long)
2026-11-08T16:31:56.518-03:00  INFO 1238155 --- [           main] [fd72dd2a-2b39-41e5-9618-dbb7a276138b] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=update_transaction user=2 plan=1 outcome=error durationMs=185
2026-11-08T16:31:56.533-03:00  INFO 1238155 --- [           main] [fd72dd2a-2b39-41e5-9618-dbb7a276138b] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 215ms userId=- planId=-
2026-11-08T16:31:56.654-03:00  INFO 1238155 --- [           main] [68bf26fb-b42e-473c-9c6a-5d328f747c5f] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/{id} 200 43ms userId=1 planId=1
2026-11-08T16:31:56.672-03:00  INFO 1238155 --- [           main] [44e9587e-5792-4098-a50a-a2d251712687] i.m.server.McpAsyncServer                : Client initialize request - Protocol: 2025-06-18, Capabilities: ClientCapabilities[experimental=null, roots=null, sampling=null, elicitation=null, extensions=null], Info: Implementation[name=test, title=null, version=1, description=null, icons=null, websiteUrl=null]
2026-11-08T16:31:56.672-03:00  INFO 1238155 --- [           main] [44e9587e-5792-4098-a50a-a2d251712687] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 3ms userId=- planId=-
2026-11-08T16:31:56.675-03:00  INFO 1238155 --- [           main] [72f0b73e-ce6f-43f1-b41d-17a3136a4d2b] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 1ms userId=- planId=-
2026-11-08T16:31:56.687-03:00  INFO 1238155 --- [           main] [67a90fd7-8194-401a-a8e7-612d198e1296] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 11ms userId=- planId=-
```

`cd frontend && grep -q "oauth2" vite.config.ts && grep -q "well-known" vite.config.ts && grep -q "\\\\/mcp" vi` - exit 0

```
(no output)
```
