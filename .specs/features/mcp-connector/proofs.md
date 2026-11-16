# mcp-connector proofs

**HEAD**: 5c27b6f7
**Tree**: clean
**Shell**: /bin/sh
**Result**: 85 pass, 0 fail

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
| C68 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='AuthorizationServerIT#forwarde` | pass |
| C69 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpPlanToolsIT#unknownArgument` | pass |
| C70 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpPlanToolsIT#wrongTypeAndEnu` | pass |
| C71 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='AuthorizationServerIT#loopback` | pass |
| C72 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q test -Dtest='McpUpdateCopyTest#keepsInstallmentS` | pass |
| C73 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='AuthorizationServerIT#codeLive` | pass |
| C74 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureToolsIT#roleMatrixFo` | pass |
| C75 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q test -Dtest='ConfigurationPropertiesTest#mcpRate` | pass |
| C76 | `run unit / ✓ OAuthLoginPage > shows the wrong-credentials message for a bare ?error` | pass |
| C77 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='AuthorizationServerIT#clientIn` | pass |
| C78 | `run unit / ✓ getOAuthClientInfo > sends the consent state so the pending redirect is named` | pass |
| C79 | `run unit / ✓ OAuthConsentPage > asks which host the pending request redirects to` | pass |
| C80 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpPlanToolsIT#archivedDefault` | pass |
| C81 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpPlanToolsIT#memberRemovedAf` | pass |
| Build | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -DskipITs -Dsurefire.skip=true` | pass |
| Build | `cd frontend && pnpm lint` | pass |
| Build | `cd frontend && pnpm build` | pass |
| Build | `cd frontend && node scripts/check-siblings.ts` | pass |

## Output

`Run unit` - exit 0

```
 ✓ |unit| src/features/oauth/OAuthLoginPage.test.tsx > OAuthLoginPage > shows the wrong-credentials message for a bare ?error 9ms
 ✓ |unit| src/features/oauth/OAuthLoginPage.test.tsx > OAuthLoginPage > shows the rate-limit message for ?error=rate-limited 7ms
 ✓ |unit| src/api/services/useInvitationService.test.ts > invitation mutations show their short success message > revoke shows "Invitation revoked." (NAV-05 AC 1, 2) 55ms
 ✓ |unit| src/api/services/useInvitationService.test.ts > invitation mutations show their short success message > accept shows "You joined the plan." (NAV-05 AC 1, 2) 54ms
 ✓ |unit| src/features/oauth/utils/csrfToken.test.ts > readCsrfToken > returns the raw value of the XSRF-TOKEN cookie among others 1ms
 ✓ |unit| src/features/oauth/utils/csrfToken.test.ts > readCsrfToken > returns an empty string when the cookie is absent 0ms
 ✓ |unit| src/api/services/useOAuthService.test.ts > getOAuthClientInfo > requests the client by id 68ms
 ✓ |unit| src/api/services/useOAuthService.test.ts > getOAuthClientInfo > sends the consent state so the pending redirect is named 54ms

 Test Files  10 passed (10)
      Tests  56 passed (56)
   Start at  20:00:32
   Duration  2.59s (transform 414ms, setup 854ms, collect 2.62s, tests 3.14s, environment 4.33s, prepare 440ms)

No story files found for the specified pattern: src/**/*.mdx
```

`Run stories` - exit 0

```
info Using tsconfig paths for react-docgen
info Using tsconfig paths for react-docgen
info Using tsconfig paths for react-docgen
 ✓ |storybook (chromium)| src/features/oauth/OAuthConsentView.stories.tsx > Ready 249ms
 ✓ |storybook (chromium)| src/features/oauth/OAuthConsentView.stories.tsx > Unknown Client 28ms
 ✓ |storybook (chromium)| src/features/oauth/OAuthLoginView.stories.tsx > Sign In 245ms
 ✓ |storybook (chromium)| src/features/oauth/OAuthLoginView.stories.tsx > Wrong Credentials 41ms
 ✓ |storybook (chromium)| src/features/oauth/OAuthLoginView.stories.tsx > Rate Limited 41ms

 Test Files  2 passed (2)
      Tests  5 passed (5)
   Start at  20:00:36
   Duration  1.69s (transform 0ms, setup 798ms, collect 218ms, tests 607ms, environment 0ms, prepare 4.14s)

No story files found for the specified pattern: src/**/*.mdx
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q test -Dtest='ConfigurationPropertiesTest#oauthRe` - exit 0

```
20:00:43.319 [main] INFO org.hibernate.validator.internal.util.Version -- HV000001: Hibernate Validator 9.1.5.Final
20:00:43.717 [main] WARN org.springframework.context.annotation.AnnotationConfigApplicationContext -- Exception encountered during context initialization - cancelling refresh attempt: org.springframework.boot.context.properties.ConfigurationPropertiesBindException: Error creating bean with name 'app.oauth-com.lcs.findraco.shared.config.OAuthProperties': Could not bind properties to 'OAuthProperties' : prefix=app.oauth, ignoreInvalidFields=false, ignoreUnknownFields=true
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='MigrationsIT#oauthTablesExist'` - exit 0

```
2026-11-08T20:01:02.413-03:00  INFO 1322723 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Registered tools: 8
2026-11-08T20:01:02.413-03:00  INFO 1322723 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable resources capabilities, notification: true
2026-11-08T20:01:02.415-03:00  INFO 1322723 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable resources templates capabilities, notification: true
2026-11-08T20:01:02.415-03:00  INFO 1322723 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable prompts capabilities, notification: true
2026-11-08T20:01:02.416-03:00  INFO 1322723 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable completions capabilities
2026-11-08T20:01:02.549-03:00  INFO 1322723 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-08T20:01:02.550-03:00  INFO 1322723 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-08T20:01:02.551-03:00  INFO 1322723 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-08T20:01:02.608-03:00  INFO 1322723 --- [           main] [] com.lcs.findraco.MigrationsIT            : Started MigrationsIT in 8.719 seconds (process running for 9.918)
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
20:01:22.666 [main] WARN com.lcs.findraco.auth.service.CimdRegisteredClientRepository -- Client metadata document http://127.0.0.1:35597/other-id refused: client_id names another client
20:01:22.710 [main] WARN com.lcs.findraco.auth.service.CimdRegisteredClientRepository -- Client metadata document http://127.0.0.1:35597/secret refused: token_endpoint_auth_method is not none
20:01:22.713 [main] WARN com.lcs.findraco.auth.service.CimdRegisteredClientRepository -- Client metadata document http://127.0.0.1:35597/no-code refused: grant_types lacks authorization_code
20:01:22.715 [main] WARN com.lcs.findraco.auth.service.CimdRegisteredClientRepository -- Client metadata document http://127.0.0.1:35597/plain-http refused: a redirect URI is neither https nor loopback
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q test -Dtest='CimdRegisteredClientRepositoryTest#` - exit 0

```
(no output)
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q test -Dtest='CimdRegisteredClientRepositoryTest#` - exit 0

```
20:01:32.925 [main] WARN com.lcs.findraco.auth.service.CimdRegisteredClientRepository -- Client metadata document http://127.0.0.1:37217/oauth/client could not be fetched: UncheckedIOException
20:01:32.931 [main] WARN com.lcs.findraco.auth.service.CimdRegisteredClientRepository -- Client metadata document http://127.0.0.1:37217/oauth/client could not be fetched: UncheckedIOException
20:01:32.935 [main] WARN com.lcs.findraco.auth.service.CimdRegisteredClientRepository -- Client metadata document http://127.0.0.1:37217/oauth/client could not be fetched: UncheckedIOException
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='AuthorizationServerIT#metadata` - exit 0

```
2026-11-08T20:01:51.942-03:00  INFO 1324798 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable resources capabilities, notification: true
2026-11-08T20:01:51.943-03:00  INFO 1324798 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable resources templates capabilities, notification: true
2026-11-08T20:01:51.944-03:00  INFO 1324798 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable prompts capabilities, notification: true
2026-11-08T20:01:51.945-03:00  INFO 1324798 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable completions capabilities
2026-11-08T20:01:52.071-03:00  INFO 1324798 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-08T20:01:52.072-03:00  INFO 1324798 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-08T20:01:52.073-03:00  INFO 1324798 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-08T20:01:52.128-03:00  INFO 1324798 --- [           main] [] c.l.findraco.auth.AuthorizationServerIT  : Started AuthorizationServerIT in 8.872 seconds (process running for 10.126)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-08T20:01:52.457-03:00  INFO 1324798 --- [           main] [9a06b030-d0b5-4808-8595-fb04348e6f2b] c.l.f.shared.web.RequestLogFilter        : GET - 200 16ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='AuthorizationServerIT#noRegist` - exit 0

```
2026-11-08T20:02:16.072-03:00  INFO 1325341 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable resources capabilities, notification: true
2026-11-08T20:02:16.073-03:00  INFO 1325341 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable resources templates capabilities, notification: true
2026-11-08T20:02:16.074-03:00  INFO 1325341 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable prompts capabilities, notification: true
2026-11-08T20:02:16.075-03:00  INFO 1325341 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable completions capabilities
2026-11-08T20:02:16.212-03:00  INFO 1325341 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-08T20:02:16.213-03:00  INFO 1325341 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-08T20:02:16.214-03:00  INFO 1325341 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-08T20:02:16.269-03:00  INFO 1325341 --- [           main] [] c.l.findraco.auth.AuthorizationServerIT  : Started AuthorizationServerIT in 8.826 seconds (process running for 10.028)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-08T20:02:16.622-03:00  INFO 1325341 --- [           main] [aacfff9f-b491-4f2f-9b1e-9f1b94c36a7d] c.l.f.shared.web.RequestLogFilter        : POST /** 404 37ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='AuthorizationServerIT#anonymou` - exit 0

```
2026-11-08T20:02:39.622-03:00  INFO 1325886 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable resources templates capabilities, notification: true
2026-11-08T20:02:39.622-03:00  INFO 1325886 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable prompts capabilities, notification: true
2026-11-08T20:02:39.624-03:00  INFO 1325886 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable completions capabilities
2026-11-08T20:02:39.751-03:00  INFO 1325886 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-08T20:02:39.751-03:00  INFO 1325886 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-08T20:02:39.753-03:00  INFO 1325886 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-08T20:02:39.817-03:00  INFO 1325886 --- [           main] [] c.l.findraco.auth.AuthorizationServerIT  : Started AuthorizationServerIT in 8.943 seconds (process running for 10.076)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-08T20:02:40.176-03:00  WARN 1325886 --- [           main] [1e979360-9ff0-43b3-aebe-4a2e7b832036] c.l.f.a.s.CimdRegisteredClientRepository : Client metadata document http://127.0.0.1:1/oauth/test-client could not be fetched: ResourceAccessException
2026-11-08T20:02:40.183-03:00  INFO 1325886 --- [           main] [1e979360-9ff0-43b3-aebe-4a2e7b832036] c.l.f.shared.web.RequestLogFilter        : GET - 302 45ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='AuthorizationServerIT#signedIn` - exit 0

```
2026-11-08T20:03:03.457-03:00  INFO 1326430 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable completions capabilities
2026-11-08T20:03:03.596-03:00  INFO 1326430 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-08T20:03:03.596-03:00  INFO 1326430 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-08T20:03:03.597-03:00  INFO 1326430 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-08T20:03:03.653-03:00  INFO 1326430 --- [           main] [] c.l.findraco.auth.AuthorizationServerIT  : Started AuthorizationServerIT in 8.827 seconds (process running for 9.978)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-08T20:03:04.055-03:00  WARN 1326430 --- [           main] [ddae0ec6-a193-4a31-8fe4-2b05cf65cc07] c.l.f.a.s.CimdRegisteredClientRepository : Client metadata document http://127.0.0.1:1/oauth/test-client could not be fetched: ResourceAccessException
2026-11-08T20:03:04.061-03:00  INFO 1326430 --- [           main] [ddae0ec6-a193-4a31-8fe4-2b05cf65cc07] c.l.f.shared.web.RequestLogFilter        : GET - 302 41ms userId=- planId=-
2026-11-08T20:03:04.327-03:00  INFO 1326430 --- [           main] [7ce092e8-c6df-44e9-8905-731bc4f20cc8] c.l.f.shared.web.RequestLogFilter        : POST - 302 262ms userId=- planId=-
2026-11-08T20:03:04.362-03:00  INFO 1326430 --- [           main] [208ac2e1-05de-45cb-8846-7b7e27cbe7d9] c.l.f.shared.web.RequestLogFilter        : GET - 302 33ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='AuthorizationServerIT#clientIn` - exit 0

```
2026-11-08T20:03:27.891-03:00  INFO 1326980 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable prompts capabilities, notification: true
2026-11-08T20:03:27.892-03:00  INFO 1326980 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable completions capabilities
2026-11-08T20:03:28.024-03:00  INFO 1326980 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-08T20:03:28.024-03:00  INFO 1326980 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-08T20:03:28.026-03:00  INFO 1326980 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-08T20:03:28.102-03:00  INFO 1326980 --- [           main] [] c.l.findraco.auth.AuthorizationServerIT  : Started AuthorizationServerIT in 8.887 seconds (process running for 10.116)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
2026-11-08T20:03:28.480-03:00  WARN 1326980 --- [           main] [f96524b7-3b8f-4c80-bf04-d3bbd66cf45b] c.l.f.a.s.CimdRegisteredClientRepository : Client metadata document http://127.0.0.1:1/oauth/test-client could not be fetched: ResourceAccessException
2026-11-08T20:03:28.493-03:00  INFO 1326980 --- [           main] [f96524b7-3b8f-4c80-bf04-d3bbd66cf45b] c.l.f.shared.web.RequestLogFilter        : GET /oauth2/client-info 200 72ms userId=- planId=-
2026-11-08T20:03:28.524-03:00  INFO 1326980 --- [           main] [13dfdbf4-d8d0-477d-829f-e787882bbbd1] c.l.f.shared.web.RequestLogFilter        : GET /oauth2/client-info 404 7ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='AuthorizationServerIT#allowIss` - exit 0

```
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-08T20:03:52.664-03:00  WARN 1327506 --- [           main] [068be9a3-1b2f-44b1-881a-7eaaf4d2bf89] c.l.f.a.s.CimdRegisteredClientRepository : Client metadata document http://127.0.0.1:1/oauth/test-client could not be fetched: ResourceAccessException
2026-11-08T20:03:52.671-03:00  INFO 1327506 --- [           main] [068be9a3-1b2f-44b1-881a-7eaaf4d2bf89] c.l.f.shared.web.RequestLogFilter        : GET - 302 48ms userId=- planId=-
2026-11-08T20:03:52.925-03:00  INFO 1327506 --- [           main] [371232d2-fce2-4abc-8a35-91d659283f42] c.l.f.shared.web.RequestLogFilter        : POST - 302 250ms userId=- planId=-
2026-11-08T20:03:52.956-03:00  INFO 1327506 --- [           main] [40fa6b06-161e-458b-aafb-6b70e5cfe48c] c.l.f.shared.web.RequestLogFilter        : GET - 302 30ms userId=- planId=-
2026-11-08T20:03:53.015-03:00  INFO 1327506 --- [           main] [6c9c6cad-e5ad-4e53-9cfd-e725242c8b6e] c.l.f.shared.web.RequestLogFilter        : POST - 302 58ms userId=- planId=-
2026-11-08T20:03:53.119-03:00  INFO 1327506 --- [           main] [53579f50-7823-4b6b-8f20-002c19df4ca8] c.l.f.shared.web.RequestLogFilter        : POST - 200 49ms userId=- planId=-
2026-11-08T20:03:53.146-03:00  WARN 1327506 --- [           main] [fe244717-b74c-4e30-8711-6ecb974caa9b] 2AuthorizationCodeAuthenticationProvider : Invalidated authorization token(s) previously issued to registered client 'http://127.0.0.1:1/oauth/test-client'
2026-11-08T20:03:53.147-03:00  INFO 1327506 --- [           main] [fe244717-b74c-4e30-8711-6ecb974caa9b] c.l.f.shared.web.RequestLogFilter        : POST - 400 26ms userId=- planId=-
2026-11-08T20:03:53.176-03:00  INFO 1327506 --- [           main] [dd9c4c03-f78e-488b-9f60-f87c3d37485c] c.l.f.shared.web.RequestLogFilter        : GET - 302 0ms userId=- planId=-
2026-11-08T20:03:53.208-03:00  INFO 1327506 --- [           main] [cb604831-e543-41d7-ad90-5a6887c4717e] c.l.f.shared.web.RequestLogFilter        : POST - 302 31ms userId=- planId=-
2026-11-08T20:03:53.213-03:00  INFO 1327506 --- [           main] [11b98fcc-ca88-48ed-927b-7beb2d0a434a] c.l.f.shared.web.RequestLogFilter        : GET - 302 4ms userId=- planId=-
2026-11-08T20:03:53.230-03:00  INFO 1327506 --- [           main] [358040d9-afeb-4719-b47d-e752d551eb8d] c.l.f.shared.web.RequestLogFilter        : POST - 302 15ms userId=- planId=-
2026-11-08T20:03:53.244-03:00  INFO 1327506 --- [           main] [6ad0e002-7a7d-4d3b-a2c3-87def563103c] c.l.f.shared.web.RequestLogFilter        : POST - 400 11ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='AuthorizationServerIT#denyRetu` - exit 0

```
2026-11-08T20:04:16.723-03:00  INFO 1328055 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-08T20:04:16.723-03:00  INFO 1328055 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-08T20:04:16.725-03:00  INFO 1328055 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 2 ms
2026-11-08T20:04:16.782-03:00  INFO 1328055 --- [           main] [] c.l.findraco.auth.AuthorizationServerIT  : Started AuthorizationServerIT in 8.878 seconds (process running for 10.032)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-08T20:04:17.196-03:00  WARN 1328055 --- [           main] [576432b2-2391-42cb-be42-4a0013ff03b6] c.l.f.a.s.CimdRegisteredClientRepository : Client metadata document http://127.0.0.1:1/oauth/test-client could not be fetched: ResourceAccessException
2026-11-08T20:04:17.202-03:00  INFO 1328055 --- [           main] [576432b2-2391-42cb-be42-4a0013ff03b6] c.l.f.shared.web.RequestLogFilter        : GET - 302 52ms userId=- planId=-
2026-11-08T20:04:17.449-03:00  INFO 1328055 --- [           main] [b7b83a45-c6cb-4188-9486-cb95c071fb6d] c.l.f.shared.web.RequestLogFilter        : POST - 302 243ms userId=- planId=-
2026-11-08T20:04:17.480-03:00  INFO 1328055 --- [           main] [a5038224-5321-454f-b5fe-26745da347e3] c.l.f.shared.web.RequestLogFilter        : GET - 302 29ms userId=- planId=-
2026-11-08T20:04:17.515-03:00  INFO 1328055 --- [           main] [8139fc09-16b6-408f-84cf-63a04caec9a5] c.l.f.shared.web.RequestLogFilter        : POST - 302 34ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='AuthorizationServerIT#missingP` - exit 0

```
2026-11-08T20:04:41.097-03:00  INFO 1328582 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable prompts capabilities, notification: true
2026-11-08T20:04:41.099-03:00  INFO 1328582 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable completions capabilities
2026-11-08T20:04:41.231-03:00  INFO 1328582 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-08T20:04:41.231-03:00  INFO 1328582 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-08T20:04:41.232-03:00  INFO 1328582 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-08T20:04:41.291-03:00  INFO 1328582 --- [           main] [] c.l.findraco.auth.AuthorizationServerIT  : Started AuthorizationServerIT in 8.892 seconds (process running for 10.137)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-08T20:04:41.656-03:00  WARN 1328582 --- [           main] [2a71016a-9643-4841-a074-c13df3ae82fe] c.l.f.a.s.CimdRegisteredClientRepository : Client metadata document http://127.0.0.1:1/oauth/test-client could not be fetched: ResourceAccessException
2026-11-08T20:04:41.660-03:00  INFO 1328582 --- [           main] [2a71016a-9643-4841-a074-c13df3ae82fe] c.l.f.shared.web.RequestLogFilter        : GET - 302 49ms userId=- planId=-
2026-11-08T20:04:41.705-03:00  INFO 1328582 --- [           main] [620db4e1-e2a2-4e0b-95ea-54581c842007] c.l.f.shared.web.RequestLogFilter        : GET - 302 0ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='AuthorizationServerIT#codeExch` - exit 0

```
2026-11-08T20:05:04.970-03:00  INFO 1329111 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-08T20:05:04.971-03:00  INFO 1329111 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-08T20:05:05.025-03:00  INFO 1329111 --- [           main] [] c.l.findraco.auth.AuthorizationServerIT  : Started AuthorizationServerIT in 8.753 seconds (process running for 9.954)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-08T20:05:05.427-03:00  WARN 1329111 --- [           main] [c21a7ac7-c2a4-4327-81e3-10da4bc908a2] c.l.f.a.s.CimdRegisteredClientRepository : Client metadata document http://127.0.0.1:1/oauth/test-client could not be fetched: ResourceAccessException
2026-11-08T20:05:05.434-03:00  INFO 1329111 --- [           main] [c21a7ac7-c2a4-4327-81e3-10da4bc908a2] c.l.f.shared.web.RequestLogFilter        : GET - 302 42ms userId=- planId=-
2026-11-08T20:05:05.708-03:00  INFO 1329111 --- [           main] [057dfd0b-8495-4e76-bdc6-e5f0c332fa97] c.l.f.shared.web.RequestLogFilter        : POST - 302 271ms userId=- planId=-
2026-11-08T20:05:05.746-03:00  INFO 1329111 --- [           main] [60081d87-ad3c-437d-8795-37267495549d] c.l.f.shared.web.RequestLogFilter        : GET - 302 37ms userId=- planId=-
2026-11-08T20:05:05.793-03:00  INFO 1329111 --- [           main] [88b8d621-bcb9-40c1-87f3-8a2d63330c20] c.l.f.shared.web.RequestLogFilter        : POST - 302 45ms userId=- planId=-
2026-11-08T20:05:05.841-03:00  INFO 1329111 --- [           main] [83bf161b-144a-4386-9ab8-3d500062eeee] c.l.f.shared.web.RequestLogFilter        : POST - 200 47ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='AuthorizationServerIT#unlisted` - exit 0

```
2026-11-08T20:05:29.236-03:00  INFO 1329673 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable resources capabilities, notification: true
2026-11-08T20:05:29.238-03:00  INFO 1329673 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable resources templates capabilities, notification: true
2026-11-08T20:05:29.238-03:00  INFO 1329673 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable prompts capabilities, notification: true
2026-11-08T20:05:29.240-03:00  INFO 1329673 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable completions capabilities
2026-11-08T20:05:29.370-03:00  INFO 1329673 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-08T20:05:29.370-03:00  INFO 1329673 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-08T20:05:29.372-03:00  INFO 1329673 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-08T20:05:29.434-03:00  INFO 1329673 --- [           main] [] c.l.findraco.auth.AuthorizationServerIT  : Started AuthorizationServerIT in 8.974 seconds (process running for 10.143)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-08T20:05:29.779-03:00  INFO 1329673 --- [           main] [1adcf2b3-43ab-456c-94f8-a752108de71e] c.l.f.shared.web.RequestLogFilter        : GET - 400 10ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='OAuthRefreshIT#refreshRotates'` - exit 0

```
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
2026-11-08T20:05:54.804-03:00  WARN 1330188 --- [           main] [421506d2-c0bf-4540-8a69-cdbc44346062] c.l.f.a.s.CimdRegisteredClientRepository : Client metadata document http://127.0.0.1:1/oauth/test-client could not be fetched: ResourceAccessException
2026-11-08T20:05:54.811-03:00  INFO 1330188 --- [           main] [421506d2-c0bf-4540-8a69-cdbc44346062] c.l.f.shared.web.RequestLogFilter        : GET - 302 43ms userId=- planId=-
2026-11-08T20:05:55.079-03:00  INFO 1330188 --- [           main] [454b21ca-f02c-4fb1-9c72-a68322dd6b7a] c.l.f.shared.web.RequestLogFilter        : POST - 302 264ms userId=- planId=-
2026-11-08T20:05:55.110-03:00  INFO 1330188 --- [           main] [cee14f97-74c8-4a46-b4e6-6a08a506b408] c.l.f.shared.web.RequestLogFilter        : GET - 302 29ms userId=- planId=-
2026-11-08T20:05:55.158-03:00  INFO 1330188 --- [           main] [7bf0494d-1806-41de-9866-0638f985ffee] c.l.f.shared.web.RequestLogFilter        : POST - 302 47ms userId=- planId=-
2026-11-08T20:05:55.208-03:00  INFO 1330188 --- [           main] [f7c42180-3e61-4c6f-b07f-44476211b8ff] c.l.f.shared.web.RequestLogFilter        : POST - 200 48ms userId=- planId=-
2026-11-08T20:05:55.238-03:00  INFO 1330188 --- [           main] [1f4c152b-ba91-4e08-a03d-a3a71254541b] c.l.f.shared.web.RequestLogFilter        : POST - 200 29ms userId=- planId=-
2026-11-08T20:05:55.291-03:00  WARN 1330188 --- [           main] [c25218c0-e2d5-4f2b-a010-b80384dccf23] f.a.s.ReplayRevokingAuthorizationService : Refresh token replay detected; revoked grant 4e81f814-7e8f-4223-93d7-b9b7844c102d of user 1
2026-11-08T20:05:55.292-03:00  INFO 1330188 --- [           main] [c25218c0-e2d5-4f2b-a010-b80384dccf23] c.l.f.shared.web.RequestLogFilter        : POST - 400 8ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='OAuthRefreshIT#idleRefreshExpi` - exit 0

```
2026-11-08T20:06:18.792-03:00  INFO 1330727 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 2 ms
2026-11-08T20:06:18.850-03:00  INFO 1330727 --- [           main] [] com.lcs.findraco.auth.OAuthRefreshIT     : Started OAuthRefreshIT in 8.841 seconds (process running for 9.953)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
2026-11-08T20:06:19.264-03:00  WARN 1330727 --- [           main] [945db2f2-88a9-48c0-b730-775427fc78bf] c.l.f.a.s.CimdRegisteredClientRepository : Client metadata document http://127.0.0.1:1/oauth/test-client could not be fetched: ResourceAccessException
2026-11-08T20:06:19.272-03:00  INFO 1330727 --- [           main] [945db2f2-88a9-48c0-b730-775427fc78bf] c.l.f.shared.web.RequestLogFilter        : GET - 302 44ms userId=- planId=-
2026-11-08T20:06:19.542-03:00  INFO 1330727 --- [           main] [64f1fd82-ab74-4ad6-9fb7-bc582d732c5d] c.l.f.shared.web.RequestLogFilter        : POST - 302 266ms userId=- planId=-
2026-11-08T20:06:19.573-03:00  INFO 1330727 --- [           main] [00eb17b3-8610-4037-ae80-a564b1c66134] c.l.f.shared.web.RequestLogFilter        : GET - 302 30ms userId=- planId=-
2026-11-08T20:06:19.628-03:00  INFO 1330727 --- [           main] [1a75053e-d2c4-4aca-99d2-73d18a17e5d2] c.l.f.shared.web.RequestLogFilter        : POST - 302 53ms userId=- planId=-
2026-11-08T20:06:19.678-03:00  INFO 1330727 --- [           main] [6c782766-b4f3-48dc-8c7e-ae596b313e52] c.l.f.shared.web.RequestLogFilter        : POST - 200 49ms userId=- planId=-
2026-11-08T20:06:19.743-03:00  INFO 1330727 --- [           main] [3136cb54-4a3f-4fd7-ad07-e190fad1bef0] c.l.f.shared.web.RequestLogFilter        : POST - 400 12ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='OAuthRefreshIT#replayRevokesGr` - exit 0

```
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
2026-11-08T20:06:43.929-03:00  WARN 1331249 --- [           main] [8e00fb63-f824-49d1-b697-6e87be94d281] c.l.f.a.s.CimdRegisteredClientRepository : Client metadata document http://127.0.0.1:1/oauth/test-client could not be fetched: ResourceAccessException
2026-11-08T20:06:43.936-03:00  INFO 1331249 --- [           main] [8e00fb63-f824-49d1-b697-6e87be94d281] c.l.f.shared.web.RequestLogFilter        : GET - 302 43ms userId=- planId=-
2026-11-08T20:06:44.176-03:00  INFO 1331249 --- [           main] [ab1dee9c-98c3-4fcf-9004-ae1c841178e8] c.l.f.shared.web.RequestLogFilter        : POST - 302 237ms userId=- planId=-
2026-11-08T20:06:44.208-03:00  INFO 1331249 --- [           main] [6546b3d0-89e6-46bf-be14-3c2b8f83e6d6] c.l.f.shared.web.RequestLogFilter        : GET - 302 30ms userId=- planId=-
2026-11-08T20:06:44.260-03:00  INFO 1331249 --- [           main] [bead405e-7394-4ea9-bcd1-432a06563dac] c.l.f.shared.web.RequestLogFilter        : POST - 302 51ms userId=- planId=-
2026-11-08T20:06:44.311-03:00  INFO 1331249 --- [           main] [543b3553-4f8f-4ffe-bb17-849b99be40a1] c.l.f.shared.web.RequestLogFilter        : POST - 200 50ms userId=- planId=-
2026-11-08T20:06:44.344-03:00  INFO 1331249 --- [           main] [90621e62-7eec-477a-9a42-0da4afdffcc8] c.l.f.shared.web.RequestLogFilter        : POST - 200 32ms userId=- planId=-
2026-11-08T20:06:44.356-03:00  WARN 1331249 --- [           main] [5b7c43af-916f-402d-bb95-138d6392826d] f.a.s.ReplayRevokingAuthorizationService : Refresh token replay detected; revoked grant ec5535b4-2106-4b53-b051-408f6dd3a0e9 of user 1
2026-11-08T20:06:44.358-03:00  INFO 1331249 --- [           main] [5b7c43af-916f-402d-bb95-138d6392826d] c.l.f.shared.web.RequestLogFilter        : POST - 400 9ms userId=- planId=-
2026-11-08T20:06:44.389-03:00  INFO 1331249 --- [           main] [f4689dd1-e2f1-4b32-9d66-3a5e2681694d] c.l.f.shared.web.RequestLogFilter        : POST - 400 4ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='OAuthRefreshIT#passwordResetRe` - exit 0

```
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-08T20:07:08.429-03:00  WARN 1331777 --- [           main] [9f3f2e3a-2296-4dba-8990-17da7a30776a] c.l.f.a.s.CimdRegisteredClientRepository : Client metadata document http://127.0.0.1:1/oauth/test-client could not be fetched: ResourceAccessException
2026-11-08T20:07:08.435-03:00  INFO 1331777 --- [           main] [9f3f2e3a-2296-4dba-8990-17da7a30776a] c.l.f.shared.web.RequestLogFilter        : GET - 302 43ms userId=- planId=-
2026-11-08T20:07:08.693-03:00  INFO 1331777 --- [           main] [8aaa3876-5369-43ca-bbf8-cf4f5ea3c908] c.l.f.shared.web.RequestLogFilter        : POST - 302 254ms userId=- planId=-
2026-11-08T20:07:08.723-03:00  INFO 1331777 --- [           main] [8b9d1dc1-7ea9-4b90-94c2-181628f73aac] c.l.f.shared.web.RequestLogFilter        : GET - 302 28ms userId=- planId=-
2026-11-08T20:07:08.770-03:00  INFO 1331777 --- [           main] [fc926ef6-3c55-40a9-92ce-8db6c44165d3] c.l.f.shared.web.RequestLogFilter        : POST - 302 46ms userId=- planId=-
2026-11-08T20:07:08.818-03:00  INFO 1331777 --- [           main] [b10e7caf-f48d-4bed-85c7-e7191cf2eca2] c.l.f.shared.web.RequestLogFilter        : POST - 200 47ms userId=- planId=-
2026-11-08T20:07:08.820-03:00  INFO 1331777 --- [           main] [d109e437-f4a0-4b2c-8a7f-63f132c8fa49] c.l.f.shared.web.RequestLogFilter        : GET - 302 0ms userId=- planId=-
2026-11-08T20:07:08.857-03:00  INFO 1331777 --- [           main] [e2546e91-4ede-4b13-85c1-502de2f2a3e4] c.l.f.shared.web.RequestLogFilter        : POST - 302 36ms userId=- planId=-
2026-11-08T20:07:08.862-03:00  INFO 1331777 --- [           main] [2d269866-ce1e-4efd-8020-d26bbc993f5a] c.l.f.shared.web.RequestLogFilter        : GET - 302 4ms userId=- planId=-
2026-11-08T20:07:08.877-03:00  INFO 1331777 --- [           main] [de57ba9e-fb19-452c-bcbe-e8b4d385f3d1] c.l.f.shared.web.RequestLogFilter        : POST - 302 14ms userId=- planId=-
2026-11-08T20:07:08.897-03:00  INFO 1331777 --- [           main] [fd107380-0250-490e-94f7-bbd3f46454c0] c.l.f.shared.web.RequestLogFilter        : POST - 200 19ms userId=- planId=-
2026-11-08T20:07:08.981-03:00  INFO 1331777 --- [           main] [455d0ff7-daeb-4596-9b53-761d8a9d934e] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/auth/reset-password 204 80ms userId=- planId=-
2026-11-08T20:07:09.040-03:00  INFO 1331777 --- [           main] [60c0a6f7-75b8-4ecd-b851-460c31e6ec6f] c.l.f.shared.web.RequestLogFilter        : POST - 400 5ms userId=- planId=-
2026-11-08T20:07:09.103-03:00  INFO 1331777 --- [           main] [fa042f15-5a88-4b95-a35c-d6acd00244f9] c.l.f.shared.web.RequestLogFilter        : POST - 200 33ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='OAuthRefreshIT#unlistedClientC` - exit 0

```
2026-11-08T20:07:32.548-03:00  INFO 1332304 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-08T20:07:32.625-03:00  INFO 1332304 --- [           main] [] com.lcs.findraco.auth.OAuthRefreshIT     : Started OAuthRefreshIT in 8.999 seconds (process running for 10.182)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
2026-11-08T20:07:33.030-03:00  WARN 1332304 --- [           main] [fcf7e7a0-a101-40a0-a649-925074f7ecd6] c.l.f.a.s.CimdRegisteredClientRepository : Client metadata document http://127.0.0.1:1/oauth/test-client could not be fetched: ResourceAccessException
2026-11-08T20:07:33.037-03:00  INFO 1332304 --- [           main] [fcf7e7a0-a101-40a0-a649-925074f7ecd6] c.l.f.shared.web.RequestLogFilter        : GET - 302 43ms userId=- planId=-
2026-11-08T20:07:33.285-03:00  INFO 1332304 --- [           main] [f6e17829-316e-493b-a345-172421c5cd4d] c.l.f.shared.web.RequestLogFilter        : POST - 302 244ms userId=- planId=-
2026-11-08T20:07:33.318-03:00  INFO 1332304 --- [           main] [7260331a-379c-4f4f-a85b-c262e9080773] c.l.f.shared.web.RequestLogFilter        : GET - 302 31ms userId=- planId=-
2026-11-08T20:07:33.364-03:00  INFO 1332304 --- [           main] [8c2a1e33-9e2d-4d0c-85f4-0a90c361405d] c.l.f.shared.web.RequestLogFilter        : POST - 302 45ms userId=- planId=-
2026-11-08T20:07:33.411-03:00  INFO 1332304 --- [           main] [28244007-3fea-4169-9efe-1843ba768fed] c.l.f.shared.web.RequestLogFilter        : POST - 200 46ms userId=- planId=-
2026-11-08T20:07:33.413-03:00  INFO 1332304 --- [           main] [338376e6-1a53-4251-baf9-97808d0255b4] c.l.f.shared.web.RequestLogFilter        : POST - 401 1ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpSecurityIT#anonymousGetsRes` - exit 0

```
2026-11-08T20:07:56.647-03:00  INFO 1332835 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable resources templates capabilities, notification: true
2026-11-08T20:07:56.648-03:00  INFO 1332835 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable prompts capabilities, notification: true
2026-11-08T20:07:56.649-03:00  INFO 1332835 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable completions capabilities
2026-11-08T20:07:56.786-03:00  INFO 1332835 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-08T20:07:56.786-03:00  INFO 1332835 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-08T20:07:56.788-03:00  INFO 1332835 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 2 ms
2026-11-08T20:07:56.857-03:00  INFO 1332835 --- [           main] [] com.lcs.findraco.mcp.McpSecurityIT       : Started McpSecurityIT in 9.019 seconds (process running for 10.132)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-08T20:07:57.178-03:00  INFO 1332835 --- [           main] [52b8fcd9-0923-4878-8c3c-f4d0d117cb69] c.l.f.shared.web.RequestLogFilter        : POST - 401 8ms userId=- planId=-
2026-11-08T20:07:57.186-03:00  INFO 1332835 --- [           main] [6b0cfd40-aa35-4a50-8570-0dcad89fe125] c.l.f.shared.web.RequestLogFilter        : POST - 401 2ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpSecurityIT#protectedResourc` - exit 0

```
2026-11-08T20:08:20.335-03:00  INFO 1333353 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable resources templates capabilities, notification: true
2026-11-08T20:08:20.336-03:00  INFO 1333353 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable prompts capabilities, notification: true
2026-11-08T20:08:20.337-03:00  INFO 1333353 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable completions capabilities
2026-11-08T20:08:20.474-03:00  INFO 1333353 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-08T20:08:20.474-03:00  INFO 1333353 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-08T20:08:20.476-03:00  INFO 1333353 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-08T20:08:20.532-03:00  INFO 1333353 --- [           main] [] com.lcs.findraco.mcp.McpSecurityIT       : Started McpSecurityIT in 8.868 seconds (process running for 10.017)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-08T20:08:20.843-03:00  INFO 1333353 --- [           main] [23b0ce59-ba02-418e-9642-26576fd63f9d] c.l.f.shared.web.RequestLogFilter        : GET - 200 11ms userId=- planId=-
2026-11-08T20:08:20.871-03:00  INFO 1333353 --- [           main] [3b779d16-962e-406e-9f1e-305549c99c27] c.l.f.shared.web.RequestLogFilter        : GET - 200 0ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpSecurityIT#tokensDoNotCross` - exit 0

```
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-08T20:08:44.859-03:00  WARN 1333871 --- [           main] [b0f2f345-164d-42b4-a06e-5fdb3ca9cdb5] c.l.f.a.s.CimdRegisteredClientRepository : Client metadata document http://127.0.0.1:1/oauth/test-client could not be fetched: ResourceAccessException
2026-11-08T20:08:44.866-03:00  INFO 1333871 --- [           main] [b0f2f345-164d-42b4-a06e-5fdb3ca9cdb5] c.l.f.shared.web.RequestLogFilter        : GET - 302 48ms userId=- planId=-
2026-11-08T20:08:45.125-03:00  INFO 1333871 --- [           main] [b221b5be-cdee-46e4-a0f8-461f83c5e597] c.l.f.shared.web.RequestLogFilter        : POST - 302 255ms userId=- planId=-
2026-11-08T20:08:45.156-03:00  INFO 1333871 --- [           main] [99ddf56c-4354-4cdd-bb68-7588fc77b327] c.l.f.shared.web.RequestLogFilter        : GET - 302 29ms userId=- planId=-
2026-11-08T20:08:45.204-03:00  INFO 1333871 --- [           main] [c1ce8bae-2f5c-400c-a0e6-87b7f1589e42] c.l.f.shared.web.RequestLogFilter        : POST - 302 47ms userId=- planId=-
2026-11-08T20:08:45.251-03:00  INFO 1333871 --- [           main] [070a9bee-ad62-49ed-9862-c65c21903f58] c.l.f.shared.web.RequestLogFilter        : POST - 200 46ms userId=- planId=-
2026-11-08T20:08:45.328-03:00  INFO 1333871 --- [           main] [ac99bfa1-7a50-40ef-b5a0-a19d38bff751] c.l.f.shared.web.RequestLogFilter        : GET - 401 76ms userId=- planId=-
2026-11-08T20:08:45.366-03:00  INFO 1333871 --- [           main] [9b0a3c52-1a9d-4df7-9504-771f994c376c] c.l.f.shared.web.RequestLogFilter        : POST - 401 5ms userId=- planId=-
2026-11-08T20:08:45.407-03:00  INFO 1333871 --- [           main] [d22cbf0f-5d5d-4c42-987d-1845cda56da4] i.m.server.McpAsyncServer                : Client initialize request - Protocol: 2025-06-18, Capabilities: ClientCapabilities[experimental=null, roots=null, sampling=null, elicitation=null, extensions=null], Info: Implementation[name=test, title=null, version=1, description=null, icons=null, websiteUrl=null]
2026-11-08T20:08:45.424-03:00  INFO 1333871 --- [           main] [d22cbf0f-5d5d-4c42-987d-1845cda56da4] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 55ms userId=- planId=-
2026-11-08T20:08:45.432-03:00  INFO 1333871 --- [           main] [1b49f8d8-269a-40e6-bc8e-52ebc9ec77be] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 7ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpSecurityIT#wrongAudienceOrS` - exit 0

```
2026-11-08T20:09:08.870-03:00  INFO 1334403 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable resources templates capabilities, notification: true
2026-11-08T20:09:08.871-03:00  INFO 1334403 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable prompts capabilities, notification: true
2026-11-08T20:09:08.872-03:00  INFO 1334403 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable completions capabilities
2026-11-08T20:09:09.005-03:00  INFO 1334403 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-08T20:09:09.005-03:00  INFO 1334403 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-08T20:09:09.006-03:00  INFO 1334403 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-08T20:09:09.062-03:00  INFO 1334403 --- [           main] [] com.lcs.findraco.mcp.McpSecurityIT       : Started McpSecurityIT in 8.955 seconds (process running for 10.072)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-08T20:09:09.461-03:00  INFO 1334403 --- [           main] [3720fa82-54fd-489a-9baf-1db0a89f6a3d] c.l.f.shared.web.RequestLogFilter        : POST - 401 12ms userId=- planId=-
2026-11-08T20:09:09.467-03:00  INFO 1334403 --- [           main] [56a1f091-6a71-4f41-8c9b-1472f1a89079] c.l.f.shared.web.RequestLogFilter        : POST - 401 1ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpPlanToolsIT#listPlansShowsA` - exit 0

```
2026-11-08T20:09:32.965-03:00  INFO 1334920 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-08T20:09:32.966-03:00  INFO 1334920 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-08T20:09:32.967-03:00  INFO 1334920 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-08T20:09:33.024-03:00  INFO 1334920 --- [           main] [] com.lcs.findraco.mcp.McpPlanToolsIT      : Started McpPlanToolsIT in 8.876 seconds (process running for 10.106)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-08T20:09:33.547-03:00  INFO 1334920 --- [           main] [6943d191-4860-492f-9cf6-b3798d7ff1e6] i.m.server.McpAsyncServer                : Client initialize request - Protocol: 2025-06-18, Capabilities: ClientCapabilities[experimental=null, roots=null, sampling=null, elicitation=null, extensions=null], Info: Implementation[name=test, title=null, version=1, description=null, icons=null, websiteUrl=null]
2026-11-08T20:09:33.567-03:00  INFO 1334920 --- [           main] [6943d191-4860-492f-9cf6-b3798d7ff1e6] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 130ms userId=- planId=-
2026-11-08T20:09:33.578-03:00  INFO 1334920 --- [           main] [f5532e0d-1862-407f-af58-c07c8b1852c3] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 7ms userId=- planId=-
2026-11-08T20:09:33.687-03:00  INFO 1334920 --- [           main] [be4f8d2f-6e68-4f66-a5de-868ace4fc7ea] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=list_plans user=1 plan=null outcome=ok durationMs=96
2026-11-08T20:09:33.699-03:00  INFO 1334920 --- [           main] [be4f8d2f-6e68-4f66-a5de-868ace4fc7ea] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 121ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpPlanToolsIT#planResolvesByD` - exit 0

```
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-08T20:09:57.489-03:00  INFO 1335465 --- [           main] [a2a9c6c1-fadb-4f39-bf98-5dbc62086177] i.m.server.McpAsyncServer                : Client initialize request - Protocol: 2025-06-18, Capabilities: ClientCapabilities[experimental=null, roots=null, sampling=null, elicitation=null, extensions=null], Info: Implementation[name=test, title=null, version=1, description=null, icons=null, websiteUrl=null]
2026-11-08T20:09:57.511-03:00  INFO 1335465 --- [           main] [a2a9c6c1-fadb-4f39-bf98-5dbc62086177] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 151ms userId=- planId=-
2026-11-08T20:09:57.522-03:00  INFO 1335465 --- [           main] [bf62dabb-c3ff-4359-a52a-f1d8dc54a392] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 7ms userId=- planId=-
2026-11-08T20:09:57.645-03:00  INFO 1335465 --- [           main] [2e4244f2-0217-4c90-80c4-7997ac26584e] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=plan_probe user=1 plan=1 outcome=ok durationMs=110
2026-11-08T20:09:57.659-03:00  INFO 1335465 --- [           main] [2e4244f2-0217-4c90-80c4-7997ac26584e] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 136ms userId=- planId=-
2026-11-08T20:09:57.717-03:00  INFO 1335465 --- [           main] [247575a0-51d7-4362-9926-23bfb189cdf8] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=plan_probe user=1 plan=2 outcome=ok durationMs=13
2026-11-08T20:09:57.717-03:00  INFO 1335465 --- [           main] [247575a0-51d7-4362-9926-23bfb189cdf8] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 17ms userId=- planId=-
2026-11-08T20:09:57.726-03:00  INFO 1335465 --- [           main] [d52cb31d-c6e6-448e-a344-f3cf58efa205] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=plan_probe user=1 plan=2 outcome=ok durationMs=5
2026-11-08T20:09:57.726-03:00  INFO 1335465 --- [           main] [d52cb31d-c6e6-448e-a344-f3cf58efa205] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 8ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q test -Dtest='McpNamesTest#matchesIgnoringCaseAnd` - exit 0

```
(no output)
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpPlanToolsIT#unknownOrAmbigu` - exit 0

```
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-08T20:10:25.950-03:00  INFO 1336261 --- [           main] [ac97552b-5710-446e-9e01-155d68c813e7] i.m.server.McpAsyncServer                : Client initialize request - Protocol: 2025-06-18, Capabilities: ClientCapabilities[experimental=null, roots=null, sampling=null, elicitation=null, extensions=null], Info: Implementation[name=test, title=null, version=1, description=null, icons=null, websiteUrl=null]
2026-11-08T20:10:25.972-03:00  INFO 1336261 --- [           main] [ac97552b-5710-446e-9e01-155d68c813e7] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 142ms userId=- planId=-
2026-11-08T20:10:25.983-03:00  INFO 1336261 --- [           main] [aaead7b2-05f4-4dac-b519-8941a03de14b] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 7ms userId=- planId=-
2026-11-08T20:10:26.079-03:00  INFO 1336261 --- [           main] [5802a9e8-f6b7-4d94-8886-e3f3c88b90f5] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=plan_probe user=1 plan=null outcome=error durationMs=83
2026-11-08T20:10:26.092-03:00  INFO 1336261 --- [           main] [5802a9e8-f6b7-4d94-8886-e3f3c88b90f5] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 108ms userId=- planId=-
2026-11-08T20:10:26.164-03:00  INFO 1336261 --- [           main] [4708021f-7eaa-4305-9eed-0eb5548db2a1] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=plan_probe user=1 plan=null outcome=error durationMs=7
2026-11-08T20:10:26.164-03:00  INFO 1336261 --- [           main] [4708021f-7eaa-4305-9eed-0eb5548db2a1] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 11ms userId=- planId=-
2026-11-08T20:10:26.172-03:00  INFO 1336261 --- [           main] [7ee482f0-f2dc-420f-b21a-e71ca6729530] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=plan_probe user=1 plan=null outcome=error durationMs=4
2026-11-08T20:10:26.172-03:00  INFO 1336261 --- [           main] [7ee482f0-f2dc-420f-b21a-e71ca6729530] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 6ms userId=- planId=-
2026-11-08T20:10:26.178-03:00  INFO 1336261 --- [           main] [f1d09a58-619a-43cd-acd5-dc82de9d909c] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=plan_probe user=1 plan=null outcome=error durationMs=3
2026-11-08T20:10:26.179-03:00  INFO 1336261 --- [           main] [f1d09a58-619a-43cd-acd5-dc82de9d909c] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 5ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpSecurityIT#rateLimitIsToolE` - exit 0

```
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-08T20:10:49.767-03:00  INFO 1336790 --- [           main] [12966f95-d74a-4e76-b18f-149762221105] i.m.server.McpAsyncServer                : Client initialize request - Protocol: 2025-06-18, Capabilities: ClientCapabilities[experimental=null, roots=null, sampling=null, elicitation=null, extensions=null], Info: Implementation[name=test, title=null, version=1, description=null, icons=null, websiteUrl=null]
2026-11-08T20:10:49.787-03:00  INFO 1336790 --- [           main] [12966f95-d74a-4e76-b18f-149762221105] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 150ms userId=- planId=-
2026-11-08T20:10:49.798-03:00  INFO 1336790 --- [           main] [b586abc2-ca48-44d6-9791-6aa68d00a845] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 7ms userId=- planId=-
2026-11-08T20:10:49.906-03:00  INFO 1336790 --- [           main] [33c4a610-2fc7-4150-a2dd-d55e628f3dcd] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=list_plans user=1 plan=null outcome=ok durationMs=95
2026-11-08T20:10:49.920-03:00  INFO 1336790 --- [           main] [33c4a610-2fc7-4150-a2dd-d55e628f3dcd] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 121ms userId=- planId=-
2026-11-08T20:10:49.968-03:00  INFO 1336790 --- [           main] [b3703314-3c3d-444d-99ac-f0e33a53dd71] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=list_plans user=1 plan=null outcome=ok durationMs=6
2026-11-08T20:10:49.969-03:00  INFO 1336790 --- [           main] [b3703314-3c3d-444d-99ac-f0e33a53dd71] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 9ms userId=- planId=-
2026-11-08T20:10:49.973-03:00  WARN 1336790 --- [           main] [77071796-8857-4c04-87ab-bd28a1c79292] c.l.f.shared.ratelimit.RateLimiter       : Rate limit MCP_USER exceeded; retry in 3600s
2026-11-08T20:10:49.973-03:00  INFO 1336790 --- [           main] [77071796-8857-4c04-87ab-bd28a1c79292] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=list_plans user=1 plan=null outcome=rate-limited durationMs=0
2026-11-08T20:10:49.973-03:00  INFO 1336790 --- [           main] [77071796-8857-4c04-87ab-bd28a1c79292] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 3ms userId=- planId=-
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

2026-11-08T20:11:13.966-03:00  INFO 1337313 --- [           main] [b84e8ac1-dd8f-457e-aed4-fde4d1d293a8] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=break_down user=1 plan=null outcome=failed durationMs=13
2026-11-08T20:11:13.988-03:00  INFO 1337313 --- [           main] [b84e8ac1-dd8f-457e-aed4-fde4d1d293a8] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 47ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpPlanToolsIT#callLogOmitsArg` - exit 0

```
2026-11-08T20:11:37.351-03:00  INFO 1337846 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-08T20:11:37.351-03:00  INFO 1337846 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-08T20:11:37.353-03:00  INFO 1337846 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 2 ms
2026-11-08T20:11:37.415-03:00  INFO 1337846 --- [           main] [] com.lcs.findraco.mcp.McpPlanToolsIT      : Started McpPlanToolsIT in 8.853 seconds (process running for 9.951)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
2026-11-08T20:11:37.945-03:00  INFO 1337846 --- [           main] [bafd2d80-5c0d-41d8-82ef-8989981ef9db] i.m.server.McpAsyncServer                : Client initialize request - Protocol: 2025-06-18, Capabilities: ClientCapabilities[experimental=null, roots=null, sampling=null, elicitation=null, extensions=null], Info: Implementation[name=test, title=null, version=1, description=null, icons=null, websiteUrl=null]
2026-11-08T20:11:37.965-03:00  INFO 1337846 --- [           main] [bafd2d80-5c0d-41d8-82ef-8989981ef9db] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 132ms userId=- planId=-
2026-11-08T20:11:37.976-03:00  INFO 1337846 --- [           main] [f49f2455-f783-4bda-928e-2caa54250992] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 7ms userId=- planId=-
2026-11-08T20:11:38.121-03:00  INFO 1337846 --- [           main] [864c63e3-e7c5-49d1-bcf1-06ef7a2dc832] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=plan_probe user=1 plan=1 outcome=ok durationMs=131
2026-11-08T20:11:38.135-03:00  INFO 1337846 --- [           main] [864c63e3-e7c5-49d1-bcf1-06ef7a2dc832] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 157ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpReadToolsIT#listCategories'` - exit 0

```
2026-11-08T20:12:01.775-03:00  INFO 1338367 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-08T20:12:01.776-03:00  INFO 1338367 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-08T20:12:01.777-03:00  INFO 1338367 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-08T20:12:01.836-03:00  INFO 1338367 --- [           main] [] com.lcs.findraco.mcp.McpReadToolsIT      : Started McpReadToolsIT in 8.792 seconds (process running for 9.915)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-08T20:12:02.374-03:00  INFO 1338367 --- [           main] [0fde3ee7-ba34-41fc-8186-0a92e2c95dab] i.m.server.McpAsyncServer                : Client initialize request - Protocol: 2025-06-18, Capabilities: ClientCapabilities[experimental=null, roots=null, sampling=null, elicitation=null, extensions=null], Info: Implementation[name=test, title=null, version=1, description=null, icons=null, websiteUrl=null]
2026-11-08T20:12:02.395-03:00  INFO 1338367 --- [           main] [0fde3ee7-ba34-41fc-8186-0a92e2c95dab] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 147ms userId=- planId=-
2026-11-08T20:12:02.406-03:00  INFO 1338367 --- [           main] [c85aab00-d81c-4cb8-b2be-b25479c2992e] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 7ms userId=- planId=-
2026-11-08T20:12:02.594-03:00  INFO 1338367 --- [           main] [9782cf8d-7bc3-4a0e-bccc-6c4d2d83d194] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=list_categories user=1 plan=1 outcome=ok durationMs=175
2026-11-08T20:12:02.609-03:00  INFO 1338367 --- [           main] [9782cf8d-7bc3-4a0e-bccc-6c4d2d83d194] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 202ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpReadToolsIT#listTransaction` - exit 0

```
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-08T20:12:26.837-03:00  INFO 1338894 --- [           main] [a3980d9f-7ec4-47e5-a071-0bd3d1db3245] i.m.server.McpAsyncServer                : Client initialize request - Protocol: 2025-06-18, Capabilities: ClientCapabilities[experimental=null, roots=null, sampling=null, elicitation=null, extensions=null], Info: Implementation[name=test, title=null, version=1, description=null, icons=null, websiteUrl=null]
2026-11-08T20:12:26.857-03:00  INFO 1338894 --- [           main] [a3980d9f-7ec4-47e5-a071-0bd3d1db3245] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 136ms userId=- planId=-
2026-11-08T20:12:26.868-03:00  INFO 1338894 --- [           main] [cc84da71-8f26-4931-ae15-7e7acec2a07d] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 7ms userId=- planId=-
2026-11-08T20:12:27.073-03:00  INFO 1338894 --- [           main] [8ebb9895-cfd1-4ef4-a527-7e76d6fbd25b] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=list_transactions user=1 plan=1 outcome=ok durationMs=190
2026-11-08T20:12:27.088-03:00  INFO 1338894 --- [           main] [8ebb9895-cfd1-4ef4-a527-7e76d6fbd25b] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 219ms userId=- planId=-
2026-11-08T20:12:27.179-03:00  INFO 1338894 --- [           main] [ed46edd3-12aa-4cad-9343-ec3167eac3b3] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=list_transactions user=1 plan=1 outcome=ok durationMs=35
2026-11-08T20:12:27.179-03:00  INFO 1338894 --- [           main] [ed46edd3-12aa-4cad-9343-ec3167eac3b3] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 39ms userId=- planId=-
2026-11-08T20:12:27.221-03:00  INFO 1338894 --- [           main] [ced75108-6cab-430e-a924-29420f689ee5] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=list_transactions user=1 plan=1 outcome=ok durationMs=38
2026-11-08T20:12:27.222-03:00  INFO 1338894 --- [           main] [ced75108-6cab-430e-a924-29420f689ee5] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 41ms userId=- planId=-
2026-11-08T20:12:27.246-03:00  INFO 1338894 --- [           main] [130f910e-1e86-425d-a0d2-68540cba5a7d] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=list_transactions user=1 plan=1 outcome=ok durationMs=18
2026-11-08T20:12:27.247-03:00  INFO 1338894 --- [           main] [130f910e-1e86-425d-a0d2-68540cba5a7d] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 23ms userId=- planId=-
2026-11-08T20:12:27.274-03:00  INFO 1338894 --- [           main] [6af9a6c2-d06a-48a3-be5c-5bd3631b1ed6] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=list_transactions user=1 plan=1 outcome=ok durationMs=22
2026-11-08T20:12:27.274-03:00  INFO 1338894 --- [           main] [6af9a6c2-d06a-48a3-be5c-5bd3631b1ed6] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 26ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpReadToolsIT#listTransaction` - exit 0

```
2026-11-08T20:12:50.599-03:00  INFO 1339426 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-08T20:12:50.674-03:00  INFO 1339426 --- [           main] [] com.lcs.findraco.mcp.McpReadToolsIT      : Started McpReadToolsIT in 8.731 seconds (process running for 9.88)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
2026-11-08T20:12:51.408-03:00  INFO 1339426 --- [           main] [bae1b134-0099-4aa4-92db-de31370a5a2d] i.m.server.McpAsyncServer                : Client initialize request - Protocol: 2025-06-18, Capabilities: ClientCapabilities[experimental=null, roots=null, sampling=null, elicitation=null, extensions=null], Info: Implementation[name=test, title=null, version=1, description=null, icons=null, websiteUrl=null]
2026-11-08T20:12:51.428-03:00  INFO 1339426 --- [           main] [bae1b134-0099-4aa4-92db-de31370a5a2d] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 136ms userId=- planId=-
2026-11-08T20:12:51.439-03:00  INFO 1339426 --- [           main] [34e0e16f-ef2d-4a4c-b5b3-46d368a81148] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 7ms userId=- planId=-
2026-11-08T20:12:51.646-03:00  INFO 1339426 --- [           main] [09ef68e2-724b-49bd-a445-5583f1b49850] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=list_transactions user=1 plan=1 outcome=ok durationMs=191
2026-11-08T20:12:51.660-03:00  INFO 1339426 --- [           main] [09ef68e2-724b-49bd-a445-5583f1b49850] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 220ms userId=- planId=-
2026-11-08T20:12:51.750-03:00  INFO 1339426 --- [           main] [d478509b-3575-4739-8130-e07299e4c193] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=list_transactions user=1 plan=1 outcome=ok durationMs=21
2026-11-08T20:12:51.750-03:00  INFO 1339426 --- [           main] [d478509b-3575-4739-8130-e07299e4c193] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 26ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpReadToolsIT#monthSummaryMat` - exit 0

```
2026-11-08T20:13:15.281-03:00  INFO 1339946 --- [           main] [] com.lcs.findraco.mcp.McpReadToolsIT      : Started McpReadToolsIT in 8.818 seconds (process running for 9.979)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-08T20:13:16.016-03:00  INFO 1339946 --- [           main] [e430057b-a0cd-46c4-a287-5347feba0675] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/dashboard 200 248ms userId=1 planId=1
2026-11-08T20:13:16.062-03:00  INFO 1339946 --- [           main] [d084d74e-e004-47da-ba34-8129a18b3bae] i.m.server.McpAsyncServer                : Client initialize request - Protocol: 2025-06-18, Capabilities: ClientCapabilities[experimental=null, roots=null, sampling=null, elicitation=null, extensions=null], Info: Implementation[name=test, title=null, version=1, description=null, icons=null, websiteUrl=null]
2026-11-08T20:13:16.080-03:00  INFO 1339946 --- [           main] [d084d74e-e004-47da-ba34-8129a18b3bae] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 53ms userId=- planId=-
2026-11-08T20:13:16.089-03:00  INFO 1339946 --- [           main] [fc33024a-a89b-488e-a3aa-e8172d339c3e] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 7ms userId=- planId=-
2026-11-08T20:13:16.152-03:00  INFO 1339946 --- [           main] [e21170b4-e5cf-4e26-aa1d-577702263383] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=get_month_summary user=1 plan=1 outcome=ok durationMs=47
2026-11-08T20:13:16.168-03:00  INFO 1339946 --- [           main] [e21170b4-e5cf-4e26-aa1d-577702263383] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 77ms userId=- planId=-
2026-11-08T20:13:16.200-03:00  INFO 1339946 --- [           main] [da72a085-c1eb-4be7-95a0-376ff1991407] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=get_month_summary user=1 plan=1 outcome=ok durationMs=27
2026-11-08T20:13:16.201-03:00  INFO 1339946 --- [           main] [da72a085-c1eb-4be7-95a0-376ff1991407] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 31ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpReadToolsIT#categorySpendin` - exit 0

```
2026-11-08T20:13:39.700-03:00  INFO 1340486 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-08T20:13:39.704-03:00  INFO 1340486 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 3 ms
2026-11-08T20:13:39.763-03:00  INFO 1340486 --- [           main] [] com.lcs.findraco.mcp.McpReadToolsIT      : Started McpReadToolsIT in 8.922 seconds (process running for 10.095)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-08T20:13:40.528-03:00  INFO 1340486 --- [           main] [8bae7410-9c7c-4313-8776-dc07398e11fa] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/category/spending 200 268ms userId=1 planId=1
2026-11-08T20:13:40.601-03:00  INFO 1340486 --- [           main] [52c27ceb-8391-40f6-94a2-a8ebafb18c16] i.m.server.McpAsyncServer                : Client initialize request - Protocol: 2025-06-18, Capabilities: ClientCapabilities[experimental=null, roots=null, sampling=null, elicitation=null, extensions=null], Info: Implementation[name=test, title=null, version=1, description=null, icons=null, websiteUrl=null]
2026-11-08T20:13:40.623-03:00  INFO 1340486 --- [           main] [52c27ceb-8391-40f6-94a2-a8ebafb18c16] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 62ms userId=- planId=-
2026-11-08T20:13:40.634-03:00  INFO 1340486 --- [           main] [39216525-7b94-45ef-8099-5da203619348] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 9ms userId=- planId=-
2026-11-08T20:13:40.705-03:00  INFO 1340486 --- [           main] [72e0e687-93b1-400c-8ee5-6b0079251a68] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=get_category_spending user=1 plan=1 outcome=ok durationMs=53
2026-11-08T20:13:40.721-03:00  INFO 1340486 --- [           main] [72e0e687-93b1-400c-8ee5-6b0079251a68] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 85ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpReadToolsIT#todayFollowsSav` - exit 0

```
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-08T20:14:04.619-03:00  INFO 1341009 --- [           main] [95597dcc-6c2a-460e-9e3d-6fb8891b6f45] i.m.server.McpAsyncServer                : Client initialize request - Protocol: 2025-06-18, Capabilities: ClientCapabilities[experimental=null, roots=null, sampling=null, elicitation=null, extensions=null], Info: Implementation[name=test, title=null, version=1, description=null, icons=null, websiteUrl=null]
2026-11-08T20:14:04.640-03:00  INFO 1341009 --- [           main] [95597dcc-6c2a-460e-9e3d-6fb8891b6f45] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 131ms userId=- planId=-
2026-11-08T20:14:04.650-03:00  INFO 1341009 --- [           main] [a37734b8-7d52-4020-baaf-76436f229e4f] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 7ms userId=- planId=-
2026-11-08T20:14:04.838-03:00  INFO 1341009 --- [           main] [acc1fbb1-9ecd-440a-8f71-fc6ecde2b585] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=list_transactions user=1 plan=1 outcome=ok durationMs=173
2026-11-08T20:14:04.852-03:00  INFO 1341009 --- [           main] [acc1fbb1-9ecd-440a-8f71-fc6ecde2b585] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 200ms userId=- planId=-
2026-11-08T20:14:04.866-03:00  INFO 1341009 --- [           main] [26e9905b-8121-40d1-bc65-2cae243df87a] i.m.server.McpAsyncServer                : Client initialize request - Protocol: 2025-06-18, Capabilities: ClientCapabilities[experimental=null, roots=null, sampling=null, elicitation=null, extensions=null], Info: Implementation[name=test, title=null, version=1, description=null, icons=null, websiteUrl=null]
2026-11-08T20:14:04.867-03:00  INFO 1341009 --- [           main] [26e9905b-8121-40d1-bc65-2cae243df87a] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 2ms userId=- planId=-
2026-11-08T20:14:04.869-03:00  INFO 1341009 --- [           main] [ec20f5f2-ae4b-408f-ac30-864162dfdfbf] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 1ms userId=- planId=-
2026-11-08T20:14:04.926-03:00  INFO 1341009 --- [           main] [1b7f3966-0120-41a4-be45-cbf308b75ab2] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=get_month_summary user=1 plan=1 outcome=ok durationMs=53
2026-11-08T20:14:04.926-03:00  INFO 1341009 --- [           main] [1b7f3966-0120-41a4-be45-cbf308b75ab2] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 56ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpReadToolsIT#readToolsAreRea` - exit 0

```
2026-11-08T20:14:28.155-03:00  INFO 1341559 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable completions capabilities
2026-11-08T20:14:28.308-03:00  INFO 1341559 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-08T20:14:28.309-03:00  INFO 1341559 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-08T20:14:28.310-03:00  INFO 1341559 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-08T20:14:28.368-03:00  INFO 1341559 --- [           main] [] com.lcs.findraco.mcp.McpReadToolsIT      : Started McpReadToolsIT in 8.854 seconds (process running for 10.004)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-08T20:14:28.868-03:00  INFO 1341559 --- [           main] [42edae27-fff8-4a4b-94a8-970ad2c046be] i.m.server.McpAsyncServer                : Client initialize request - Protocol: 2025-06-18, Capabilities: ClientCapabilities[experimental=null, roots=null, sampling=null, elicitation=null, extensions=null], Info: Implementation[name=test, title=null, version=1, description=null, icons=null, websiteUrl=null]
2026-11-08T20:14:28.887-03:00  INFO 1341559 --- [           main] [42edae27-fff8-4a4b-94a8-970ad2c046be] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 136ms userId=- planId=-
2026-11-08T20:14:28.898-03:00  INFO 1341559 --- [           main] [0dcccdc7-1ea6-4212-9fa2-51b45adce306] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 6ms userId=- planId=-
2026-11-08T20:14:28.920-03:00  INFO 1341559 --- [           main] [ce3ca879-6be9-43c3-bfd9-82b3b97b053a] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 21ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureToolsIT#createPaidBy` - exit 0

```
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-08T20:14:52.850-03:00  INFO 1342092 --- [           main] [601afb5c-99a8-4f5b-a569-40f12b19e3ee] i.m.server.McpAsyncServer                : Client initialize request - Protocol: 2025-06-18, Capabilities: ClientCapabilities[experimental=null, roots=null, sampling=null, elicitation=null, extensions=null], Info: Implementation[name=test, title=null, version=1, description=null, icons=null, websiteUrl=null]
2026-11-08T20:14:52.871-03:00  INFO 1342092 --- [           main] [601afb5c-99a8-4f5b-a569-40f12b19e3ee] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 133ms userId=- planId=-
2026-11-08T20:14:52.882-03:00  INFO 1342092 --- [           main] [83d7020f-eb9b-45e7-a4bd-5c6bb73d9713] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 7ms userId=- planId=-
2026-11-08T20:14:53.026-03:00  WARN 1342092 --- [           main] [b43de268-f68c-4200-8d6a-6701dc0dffa9] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List)
2026-11-08T20:14:53.029-03:00  WARN 1342092 --- [           main] [b43de268-f68c-4200-8d6a-6701dc0dffa9] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List)
2026-11-08T20:14:53.029-03:00  WARN 1342092 --- [           main] [b43de268-f68c-4200-8d6a-6701dc0dffa9] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#participants()
2026-11-08T20:14:53.029-03:00  WARN 1342092 --- [           main] [b43de268-f68c-4200-8d6a-6701dc0dffa9] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-08T20:14:53.030-03:00  WARN 1342092 --- [           main] [b43de268-f68c-4200-8d6a-6701dc0dffa9] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#items()
2026-11-08T20:14:53.030-03:00  WARN 1342092 --- [           main] [b43de268-f68c-4200-8d6a-6701dc0dffa9] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-08T20:14:53.064-03:00  INFO 1342092 --- [           main] [b43de268-f68c-4200-8d6a-6701dc0dffa9] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=create_transaction user=1 plan=1 outcome=ok durationMs=164
2026-11-08T20:14:53.077-03:00  INFO 1342092 --- [           main] [b43de268-f68c-4200-8d6a-6701dc0dffa9] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 194ms userId=- planId=-
2026-11-08T20:14:53.207-03:00  INFO 1342092 --- [           main] [c926a41c-0ed5-4120-b3ca-408db07efa22] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/{id} 200 56ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureToolsIT#createDefaul` - exit 0

```
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-08T20:15:17.285-03:00  INFO 1342639 --- [           main] [b89defa2-f38e-4d90-88eb-a199b3688499] i.m.server.McpAsyncServer                : Client initialize request - Protocol: 2025-06-18, Capabilities: ClientCapabilities[experimental=null, roots=null, sampling=null, elicitation=null, extensions=null], Info: Implementation[name=test, title=null, version=1, description=null, icons=null, websiteUrl=null]
2026-11-08T20:15:17.307-03:00  INFO 1342639 --- [           main] [b89defa2-f38e-4d90-88eb-a199b3688499] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 154ms userId=- planId=-
2026-11-08T20:15:17.321-03:00  INFO 1342639 --- [           main] [3cfbeff3-6312-4785-876a-a823d720cc0b] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 10ms userId=- planId=-
2026-11-08T20:15:17.459-03:00  WARN 1342639 --- [           main] [3f3ee658-d436-4f46-863d-61a511923101] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List)
2026-11-08T20:15:17.462-03:00  WARN 1342639 --- [           main] [3f3ee658-d436-4f46-863d-61a511923101] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List)
2026-11-08T20:15:17.463-03:00  WARN 1342639 --- [           main] [3f3ee658-d436-4f46-863d-61a511923101] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#items()
2026-11-08T20:15:17.463-03:00  WARN 1342639 --- [           main] [3f3ee658-d436-4f46-863d-61a511923101] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#participants()
2026-11-08T20:15:17.463-03:00  WARN 1342639 --- [           main] [3f3ee658-d436-4f46-863d-61a511923101] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-08T20:15:17.464-03:00  WARN 1342639 --- [           main] [3f3ee658-d436-4f46-863d-61a511923101] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-08T20:15:17.500-03:00  INFO 1342639 --- [           main] [3f3ee658-d436-4f46-863d-61a511923101] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=create_transaction user=1 plan=1 outcome=ok durationMs=161
2026-11-08T20:15:17.514-03:00  INFO 1342639 --- [           main] [3f3ee658-d436-4f46-863d-61a511923101] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 191ms userId=- planId=-
2026-11-08T20:15:17.598-03:00  INFO 1342639 --- [           main] [39cc8add-afe1-4317-b0b7-2b46234f62d1] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/{id} 200 51ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureToolsIT#createResolv` - exit 0

```
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-08T20:15:41.595-03:00  INFO 1343149 --- [           main] [53ef131d-0e31-4f42-8329-f93c6dc3c133] i.m.server.McpAsyncServer                : Client initialize request - Protocol: 2025-06-18, Capabilities: ClientCapabilities[experimental=null, roots=null, sampling=null, elicitation=null, extensions=null], Info: Implementation[name=test, title=null, version=1, description=null, icons=null, websiteUrl=null]
2026-11-08T20:15:41.614-03:00  INFO 1343149 --- [           main] [53ef131d-0e31-4f42-8329-f93c6dc3c133] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 143ms userId=- planId=-
2026-11-08T20:15:41.626-03:00  INFO 1343149 --- [           main] [bbddff6b-4cbc-4846-ad46-24679ea17fcf] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 7ms userId=- planId=-
2026-11-08T20:15:41.808-03:00  WARN 1343149 --- [           main] [40817a22-489c-473c-b508-1f594f1387b2] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#participants()
2026-11-08T20:15:41.811-03:00  WARN 1343149 --- [           main] [40817a22-489c-473c-b508-1f594f1387b2] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-08T20:15:41.811-03:00  WARN 1343149 --- [           main] [40817a22-489c-473c-b508-1f594f1387b2] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#items()
2026-11-08T20:15:41.811-03:00  WARN 1343149 --- [           main] [40817a22-489c-473c-b508-1f594f1387b2] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-08T20:15:41.812-03:00  WARN 1343149 --- [           main] [40817a22-489c-473c-b508-1f594f1387b2] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List)
2026-11-08T20:15:41.812-03:00  WARN 1343149 --- [           main] [40817a22-489c-473c-b508-1f594f1387b2] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List)
2026-11-08T20:15:41.835-03:00  INFO 1343149 --- [           main] [40817a22-489c-473c-b508-1f594f1387b2] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=create_transaction user=1 plan=1 outcome=ok durationMs=191
2026-11-08T20:15:41.848-03:00  INFO 1343149 --- [           main] [40817a22-489c-473c-b508-1f594f1387b2] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 222ms userId=- planId=-
2026-11-08T20:15:41.937-03:00  INFO 1343149 --- [           main] [2aea5647-c478-42fd-b7b3-1f9e26eb5288] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/{id} 200 57ms userId=1 planId=1
2026-11-08T20:15:42.019-03:00  INFO 1343149 --- [           main] [f52bd8aa-aa3a-479d-9cc7-27ba08e6b578] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=create_transaction user=1 plan=1 outcome=error durationMs=22
2026-11-08T20:15:42.019-03:00  INFO 1343149 --- [           main] [f52bd8aa-aa3a-479d-9cc7-27ba08e6b578] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 26ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureToolsIT#createReject` - exit 0

```
2026-11-08T20:16:06.202-03:00  WARN 1343681 --- [           main] [f986464c-663c-41eb-b919-37fcdc5981cb] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#items()
2026-11-08T20:16:06.203-03:00  WARN 1343681 --- [           main] [f986464c-663c-41eb-b919-37fcdc5981cb] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-08T20:16:06.203-03:00  WARN 1343681 --- [           main] [f986464c-663c-41eb-b919-37fcdc5981cb] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List)
2026-11-08T20:16:06.203-03:00  WARN 1343681 --- [           main] [f986464c-663c-41eb-b919-37fcdc5981cb] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List)
2026-11-08T20:16:06.203-03:00  WARN 1343681 --- [           main] [f986464c-663c-41eb-b919-37fcdc5981cb] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-08T20:16:06.210-03:00  INFO 1343681 --- [           main] [f986464c-663c-41eb-b919-37fcdc5981cb] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=create_transaction user=1 plan=1 outcome=error durationMs=123
2026-11-08T20:16:06.223-03:00  INFO 1343681 --- [           main] [f986464c-663c-41eb-b919-37fcdc5981cb] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 153ms userId=- planId=-
2026-11-08T20:16:06.279-03:00  INFO 1343681 --- [           main] [d2259cf0-7b50-484a-8348-8e4166aa6901] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=create_transaction user=1 plan=1 outcome=error durationMs=11
2026-11-08T20:16:06.279-03:00  INFO 1343681 --- [           main] [d2259cf0-7b50-484a-8348-8e4166aa6901] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 15ms userId=- planId=-
2026-11-08T20:16:06.307-03:00  INFO 1343681 --- [           main] [bd014ee2-f7b9-4f9f-851c-99c4ecc1bace] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=create_transaction user=1 plan=1 outcome=error durationMs=11
2026-11-08T20:16:06.308-03:00  INFO 1343681 --- [           main] [bd014ee2-f7b9-4f9f-851c-99c4ecc1bace] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 27ms userId=- planId=-
2026-11-08T20:16:06.319-03:00  INFO 1343681 --- [           main] [8a585929-9b7d-46b7-839f-450704a334fd] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=create_transaction user=1 plan=1 outcome=error durationMs=7
2026-11-08T20:16:06.319-03:00  INFO 1343681 --- [           main] [8a585929-9b7d-46b7-839f-450704a334fd] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 10ms userId=- planId=-
2026-11-08T20:16:06.332-03:00  INFO 1343681 --- [           main] [4d9ef48d-4b04-4ddf-9534-1b0374ede780] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=create_transaction user=1 plan=1 outcome=error durationMs=7
2026-11-08T20:16:06.332-03:00  INFO 1343681 --- [           main] [4d9ef48d-4b04-4ddf-9534-1b0374ede780] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 11ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureToolsIT#writeResultN` - exit 0

```
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-08T20:16:30.512-03:00  INFO 1344211 --- [           main] [b0124384-b048-405f-8cc1-350b795e896e] i.m.server.McpAsyncServer                : Client initialize request - Protocol: 2025-06-18, Capabilities: ClientCapabilities[experimental=null, roots=null, sampling=null, elicitation=null, extensions=null], Info: Implementation[name=test, title=null, version=1, description=null, icons=null, websiteUrl=null]
2026-11-08T20:16:30.532-03:00  INFO 1344211 --- [           main] [b0124384-b048-405f-8cc1-350b795e896e] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 141ms userId=- planId=-
2026-11-08T20:16:30.543-03:00  INFO 1344211 --- [           main] [599ff2aa-6b35-4fe6-bb56-98b95ac942d6] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 7ms userId=- planId=-
2026-11-08T20:16:30.732-03:00  WARN 1344211 --- [           main] [41b80c14-a035-4795-a384-e6e1ce84a826] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-08T20:16:30.735-03:00  WARN 1344211 --- [           main] [41b80c14-a035-4795-a384-e6e1ce84a826] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#participants()
2026-11-08T20:16:30.736-03:00  WARN 1344211 --- [           main] [41b80c14-a035-4795-a384-e6e1ce84a826] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-08T20:16:30.736-03:00  WARN 1344211 --- [           main] [41b80c14-a035-4795-a384-e6e1ce84a826] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List)
2026-11-08T20:16:30.736-03:00  WARN 1344211 --- [           main] [41b80c14-a035-4795-a384-e6e1ce84a826] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#com.lcs.findraco.transaction.request.CreateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List)
2026-11-08T20:16:30.736-03:00  WARN 1344211 --- [           main] [41b80c14-a035-4795-a384-e6e1ce84a826] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: CreateTransactionRequest#items()
2026-11-08T20:16:30.762-03:00  INFO 1344211 --- [           main] [41b80c14-a035-4795-a384-e6e1ce84a826] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=create_transaction user=1 plan=1 outcome=ok durationMs=196
2026-11-08T20:16:30.788-03:00  INFO 1344211 --- [           main] [41b80c14-a035-4795-a384-e6e1ce84a826] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 244ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureToolsIT#createSchema` - exit 0

```
2026-11-08T20:16:54.229-03:00  INFO 1344734 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable completions capabilities
2026-11-08T20:16:54.364-03:00  INFO 1344734 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-08T20:16:54.365-03:00  INFO 1344734 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-08T20:16:54.366-03:00  INFO 1344734 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-08T20:16:54.423-03:00  INFO 1344734 --- [           main] [] com.lcs.findraco.mcp.McpCaptureToolsIT   : Started McpCaptureToolsIT in 8.81 seconds (process running for 10.072)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-08T20:16:54.933-03:00  INFO 1344734 --- [           main] [85cc8261-a375-47f2-834e-42d317fd604e] i.m.server.McpAsyncServer                : Client initialize request - Protocol: 2025-06-18, Capabilities: ClientCapabilities[experimental=null, roots=null, sampling=null, elicitation=null, extensions=null], Info: Implementation[name=test, title=null, version=1, description=null, icons=null, websiteUrl=null]
2026-11-08T20:16:54.954-03:00  INFO 1344734 --- [           main] [85cc8261-a375-47f2-834e-42d317fd604e] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 132ms userId=- planId=-
2026-11-08T20:16:54.965-03:00  INFO 1344734 --- [           main] [ca1b3f5b-9137-49ed-9ce2-2f6006b71087] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 7ms userId=- planId=-
2026-11-08T20:16:54.989-03:00  INFO 1344734 --- [           main] [69f1c4cb-db9f-4437-bc91-46a69a197bb1] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 22ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureToolsIT#confirmRecor` - exit 0

```
2026-11-08T20:17:18.173-03:00  INFO 1345281 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-08T20:17:18.231-03:00  INFO 1345281 --- [           main] [] com.lcs.findraco.mcp.McpCaptureToolsIT   : Started McpCaptureToolsIT in 8.739 seconds (process running for 9.906)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-08T20:17:18.781-03:00  INFO 1345281 --- [           main] [949dbd74-5076-41d8-a35b-da75db293e94] i.m.server.McpAsyncServer                : Client initialize request - Protocol: 2025-06-18, Capabilities: ClientCapabilities[experimental=null, roots=null, sampling=null, elicitation=null, extensions=null], Info: Implementation[name=test, title=null, version=1, description=null, icons=null, websiteUrl=null]
2026-11-08T20:17:18.802-03:00  INFO 1345281 --- [           main] [949dbd74-5076-41d8-a35b-da75db293e94] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 131ms userId=- planId=-
2026-11-08T20:17:18.813-03:00  INFO 1345281 --- [           main] [9408de13-bf3e-4603-8fae-224481f8b530] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 7ms userId=- planId=-
2026-11-08T20:17:19.005-03:00  INFO 1345281 --- [           main] [651a6fd2-ce46-4eaf-bce5-aea7d3fc0472] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=confirm_transaction user=1 plan=1 outcome=ok durationMs=176
2026-11-08T20:17:19.021-03:00  INFO 1345281 --- [           main] [651a6fd2-ce46-4eaf-bce5-aea7d3fc0472] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 207ms userId=- planId=-
2026-11-08T20:17:19.106-03:00  INFO 1345281 --- [           main] [7bd9f09c-5402-418e-a5b1-2a288922cc45] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=confirm_transaction user=1 plan=1 outcome=ok durationMs=29
2026-11-08T20:17:19.107-03:00  INFO 1345281 --- [           main] [7bd9f09c-5402-418e-a5b1-2a288922cc45] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 33ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureToolsIT#confirmRecom` - exit 0

```
2026-11-08T20:17:43.088-03:00  INFO 1345802 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-08T20:17:43.089-03:00  INFO 1345802 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-08T20:17:43.148-03:00  INFO 1345802 --- [           main] [] com.lcs.findraco.mcp.McpCaptureToolsIT   : Started McpCaptureToolsIT in 9.01 seconds (process running for 10.216)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-08T20:17:43.697-03:00  INFO 1345802 --- [           main] [cc5299e0-c316-4a23-8c95-3083524c4197] i.m.server.McpAsyncServer                : Client initialize request - Protocol: 2025-06-18, Capabilities: ClientCapabilities[experimental=null, roots=null, sampling=null, elicitation=null, extensions=null], Info: Implementation[name=test, title=null, version=1, description=null, icons=null, websiteUrl=null]
2026-11-08T20:17:43.717-03:00  INFO 1345802 --- [           main] [cc5299e0-c316-4a23-8c95-3083524c4197] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 141ms userId=- planId=-
2026-11-08T20:17:43.728-03:00  INFO 1345802 --- [           main] [73db05bb-f1a2-4a89-8175-11226ff90a97] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 7ms userId=- planId=-
2026-11-08T20:17:43.911-03:00  INFO 1345802 --- [           main] [4950f165-2c3e-46d1-9932-d918fe4f0e68] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=confirm_transaction user=1 plan=1 outcome=ok durationMs=168
2026-11-08T20:17:43.925-03:00  INFO 1345802 --- [           main] [4950f165-2c3e-46d1-9932-d918fe4f0e68] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 196ms userId=- planId=-
2026-11-08T20:17:44.002-03:00  INFO 1345802 --- [           main] [3389e419-df32-4d4a-bb1a-703743aa6912] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/{id} 200 43ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureToolsIT#confirmNotAw` - exit 0

```
2026-11-08T20:18:07.726-03:00  INFO 1346343 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-08T20:18:07.727-03:00  INFO 1346343 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-08T20:18:07.788-03:00  INFO 1346343 --- [           main] [] com.lcs.findraco.mcp.McpCaptureToolsIT   : Started McpCaptureToolsIT in 9.161 seconds (process running for 10.354)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-08T20:18:08.353-03:00  INFO 1346343 --- [           main] [4e77adeb-8bad-4c39-b13c-d9df7e7fee40] i.m.server.McpAsyncServer                : Client initialize request - Protocol: 2025-06-18, Capabilities: ClientCapabilities[experimental=null, roots=null, sampling=null, elicitation=null, extensions=null], Info: Implementation[name=test, title=null, version=1, description=null, icons=null, websiteUrl=null]
2026-11-08T20:18:08.373-03:00  INFO 1346343 --- [           main] [4e77adeb-8bad-4c39-b13c-d9df7e7fee40] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 130ms userId=- planId=-
2026-11-08T20:18:08.384-03:00  INFO 1346343 --- [           main] [025b3f7c-4adb-4d31-bbbe-6b3edd523737] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 7ms userId=- planId=-
2026-11-08T20:18:08.553-03:00  INFO 1346343 --- [           main] [caa319f2-8a02-4c75-8afc-ab113cbd8eb1] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=confirm_transaction user=1 plan=1 outcome=error durationMs=154
2026-11-08T20:18:08.569-03:00  INFO 1346343 --- [           main] [caa319f2-8a02-4c75-8afc-ab113cbd8eb1] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 183ms userId=- planId=-
2026-11-08T20:18:08.694-03:00  INFO 1346343 --- [           main] [3d48594b-36e4-4471-8643-192e103b963c] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/{id} 200 48ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureToolsIT#roleMatrixFo` - exit 0

```
2026-11-08T20:18:33.005-03:00  INFO 1346869 --- [           main] [ba7c6566-0a24-4c31-81c1-7e540ad44c70] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 2ms userId=- planId=-
2026-11-08T20:18:33.007-03:00  INFO 1346869 --- [           main] [8bd178f1-bbb0-4a08-b91b-1b15139b7991] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 1ms userId=- planId=-
2026-11-08T20:18:33.013-03:00  INFO 1346869 --- [           main] [1a1fb00a-ce09-45ea-9d37-6c93f0dc6fd5] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=create_transaction user=5 plan=null outcome=error durationMs=3
2026-11-08T20:18:33.013-03:00  INFO 1346869 --- [           main] [1a1fb00a-ce09-45ea-9d37-6c93f0dc6fd5] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 5ms userId=- planId=-
2026-11-08T20:18:33.095-03:00  INFO 1346869 --- [           main] [b5cc799b-1ed0-4afe-942e-7a4b022afdb8] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/{id} 200 41ms userId=1 planId=1
2026-11-08T20:18:33.107-03:00  INFO 1346869 --- [           main] [ef59de3e-0e34-4cae-bc42-eb2923a63a37] i.m.server.McpAsyncServer                : Client initialize request - Protocol: 2025-06-18, Capabilities: ClientCapabilities[experimental=null, roots=null, sampling=null, elicitation=null, extensions=null], Info: Implementation[name=test, title=null, version=1, description=null, icons=null, websiteUrl=null]
2026-11-08T20:18:33.108-03:00  INFO 1346869 --- [           main] [ef59de3e-0e34-4cae-bc42-eb2923a63a37] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 2ms userId=- planId=-
2026-11-08T20:18:33.110-03:00  INFO 1346869 --- [           main] [8c7fd737-c822-40f6-9b9e-5132b3f019d6] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 1ms userId=- planId=-
2026-11-08T20:18:33.138-03:00  INFO 1346869 --- [           main] [aa3178e6-41a8-42a9-ae78-1dbbe6f36f27] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=create_transaction user=3 plan=1 outcome=ok durationMs=25
2026-11-08T20:18:33.138-03:00  INFO 1346869 --- [           main] [aa3178e6-41a8-42a9-ae78-1dbbe6f36f27] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 27ms userId=- planId=-
2026-11-08T20:18:33.143-03:00  INFO 1346869 --- [           main] [013cdd83-d79f-4110-bfed-ac4d85b2ed20] i.m.server.McpAsyncServer                : Client initialize request - Protocol: 2025-06-18, Capabilities: ClientCapabilities[experimental=null, roots=null, sampling=null, elicitation=null, extensions=null], Info: Implementation[name=test, title=null, version=1, description=null, icons=null, websiteUrl=null]
2026-11-08T20:18:33.143-03:00  INFO 1346869 --- [           main] [013cdd83-d79f-4110-bfed-ac4d85b2ed20] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 2ms userId=- planId=-
2026-11-08T20:18:33.145-03:00  INFO 1346869 --- [           main] [219e93ae-4b8a-452b-af4d-7ca3e0c48c25] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 1ms userId=- planId=-
2026-11-08T20:18:33.184-03:00  INFO 1346869 --- [           main] [8381ea53-feb0-47cb-9261-cf3dd83fe758] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=confirm_transaction user=2 plan=1 outcome=ok durationMs=36
2026-11-08T20:18:33.184-03:00  INFO 1346869 --- [           main] [8381ea53-feb0-47cb-9261-cf3dd83fe758] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 38ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureToolsIT#otherPlanIdN` - exit 0

```
2026-11-08T20:18:56.638-03:00  INFO 1347403 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-08T20:18:56.639-03:00  INFO 1347403 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-08T20:18:56.640-03:00  INFO 1347403 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-08T20:18:56.698-03:00  INFO 1347403 --- [           main] [] com.lcs.findraco.mcp.McpCaptureToolsIT   : Started McpCaptureToolsIT in 8.755 seconds (process running for 9.891)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-08T20:18:57.247-03:00  INFO 1347403 --- [           main] [93521bba-8b5b-4850-a483-57d1f7e33f14] i.m.server.McpAsyncServer                : Client initialize request - Protocol: 2025-06-18, Capabilities: ClientCapabilities[experimental=null, roots=null, sampling=null, elicitation=null, extensions=null], Info: Implementation[name=test, title=null, version=1, description=null, icons=null, websiteUrl=null]
2026-11-08T20:18:57.267-03:00  INFO 1347403 --- [           main] [93521bba-8b5b-4850-a483-57d1f7e33f14] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 132ms userId=- planId=-
2026-11-08T20:18:57.278-03:00  INFO 1347403 --- [           main] [953779db-27ee-4aea-b144-54f15459c54d] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 7ms userId=- planId=-
2026-11-08T20:18:57.418-03:00  INFO 1347403 --- [           main] [f4bde011-5309-48bc-9a25-6767359baa1b] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=confirm_transaction user=1 plan=1 outcome=error durationMs=125
2026-11-08T20:18:57.434-03:00  INFO 1347403 --- [           main] [f4bde011-5309-48bc-9a25-6767359baa1b] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 154ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureToolsIT#writeHints' ` - exit 0

```
2026-11-08T20:19:20.787-03:00  INFO 1347938 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable completions capabilities
2026-11-08T20:19:20.920-03:00  INFO 1347938 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-08T20:19:20.920-03:00  INFO 1347938 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-08T20:19:20.921-03:00  INFO 1347938 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-08T20:19:20.981-03:00  INFO 1347938 --- [           main] [] com.lcs.findraco.mcp.McpCaptureToolsIT   : Started McpCaptureToolsIT in 8.846 seconds (process running for 9.986)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-08T20:19:21.485-03:00  INFO 1347938 --- [           main] [8343e4bc-9cde-453b-b883-df8f5e7ba346] i.m.server.McpAsyncServer                : Client initialize request - Protocol: 2025-06-18, Capabilities: ClientCapabilities[experimental=null, roots=null, sampling=null, elicitation=null, extensions=null], Info: Implementation[name=test, title=null, version=1, description=null, icons=null, websiteUrl=null]
2026-11-08T20:19:21.506-03:00  INFO 1347938 --- [           main] [8343e4bc-9cde-453b-b883-df8f5e7ba346] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 130ms userId=- planId=-
2026-11-08T20:19:21.517-03:00  INFO 1347938 --- [           main] [141334b8-8814-4773-8a1b-b27a9bfeebd0] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 7ms userId=- planId=-
2026-11-08T20:19:21.540-03:00  INFO 1347938 --- [           main] [18e3e1fd-52c6-42d2-a7c9-c33ae568640f] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 22ms userId=- planId=-
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
2026-11-08T20:19:50.676-03:00  INFO 1348755 --- [           main] [51ca4032-ee2c-4d35-9edb-3a7f9bd87c98] i.m.server.McpAsyncServer                : Client initialize request - Protocol: 2025-06-18, Capabilities: ClientCapabilities[experimental=null, roots=null, sampling=null, elicitation=null, extensions=null], Info: Implementation[name=test, title=null, version=1, description=null, icons=null, websiteUrl=null]
2026-11-08T20:19:50.696-03:00  INFO 1348755 --- [           main] [51ca4032-ee2c-4d35-9edb-3a7f9bd87c98] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 128ms userId=- planId=-
2026-11-08T20:19:50.707-03:00  INFO 1348755 --- [           main] [5bc38803-f1ad-41d6-a185-b507c7675102] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 7ms userId=- planId=-
2026-11-08T20:19:50.861-03:00  WARN 1348755 --- [           main] [73148a9e-934e-4f85-b460-baf0c5124676] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-08T20:19:50.864-03:00  WARN 1348755 --- [           main] [73148a9e-934e-4f85-b460-baf0c5124676] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-08T20:19:50.865-03:00  WARN 1348755 --- [           main] [73148a9e-934e-4f85-b460-baf0c5124676] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#participants()
2026-11-08T20:19:50.865-03:00  WARN 1348755 --- [           main] [73148a9e-934e-4f85-b460-baf0c5124676] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#com.lcs.findraco.transaction.request.UpdateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, Long)
2026-11-08T20:19:50.865-03:00  WARN 1348755 --- [           main] [73148a9e-934e-4f85-b460-baf0c5124676] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#com.lcs.findraco.transaction.request.UpdateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, Long)
2026-11-08T20:19:50.866-03:00  WARN 1348755 --- [           main] [73148a9e-934e-4f85-b460-baf0c5124676] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#items()
2026-11-08T20:19:50.939-03:00  INFO 1348755 --- [           main] [73148a9e-934e-4f85-b460-baf0c5124676] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=update_transaction user=1 plan=1 outcome=ok durationMs=217
2026-11-08T20:19:50.956-03:00  INFO 1348755 --- [           main] [73148a9e-934e-4f85-b460-baf0c5124676] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 248ms userId=- planId=-
2026-11-08T20:19:51.076-03:00  INFO 1348755 --- [           main] [1c2a52ba-d34d-4b6e-82dd-5cf529a34797] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/{id} 200 45ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpUpdateToolIT#occurrenceEdit` - exit 0

```
2026-11-08T20:20:15.509-03:00  INFO 1349292 --- [           main] [17b7eb7c-81fa-403e-86c9-777fc55c68de] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/plan/{planId}/transaction/series 201 249ms userId=1 planId=1
2026-11-08T20:20:15.610-03:00  INFO 1349292 --- [           main] [ef24a6e9-8dd8-49fb-aae7-6f902dc1c911] i.m.server.McpAsyncServer                : Client initialize request - Protocol: 2025-06-18, Capabilities: ClientCapabilities[experimental=null, roots=null, sampling=null, elicitation=null, extensions=null], Info: Implementation[name=test, title=null, version=1, description=null, icons=null, websiteUrl=null]
2026-11-08T20:20:15.625-03:00  INFO 1349292 --- [           main] [ef24a6e9-8dd8-49fb-aae7-6f902dc1c911] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 45ms userId=- planId=-
2026-11-08T20:20:15.634-03:00  INFO 1349292 --- [           main] [ef7b009c-6748-4324-accf-f1a0f68ba765] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 7ms userId=- planId=-
2026-11-08T20:20:15.723-03:00  WARN 1349292 --- [           main] [c6042e71-6382-40c2-9db1-8641e8c5ef43] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#participants()
2026-11-08T20:20:15.723-03:00  WARN 1349292 --- [           main] [c6042e71-6382-40c2-9db1-8641e8c5ef43] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-08T20:20:15.723-03:00  WARN 1349292 --- [           main] [c6042e71-6382-40c2-9db1-8641e8c5ef43] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-08T20:20:15.723-03:00  WARN 1349292 --- [           main] [c6042e71-6382-40c2-9db1-8641e8c5ef43] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#com.lcs.findraco.transaction.request.UpdateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, Long)
2026-11-08T20:20:15.724-03:00  WARN 1349292 --- [           main] [c6042e71-6382-40c2-9db1-8641e8c5ef43] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#com.lcs.findraco.transaction.request.UpdateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, Long)
2026-11-08T20:20:15.724-03:00  WARN 1349292 --- [           main] [c6042e71-6382-40c2-9db1-8641e8c5ef43] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#items()
2026-11-08T20:20:15.764-03:00  INFO 1349292 --- [           main] [c6042e71-6382-40c2-9db1-8641e8c5ef43] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=update_transaction user=1 plan=1 outcome=ok durationMs=105
2026-11-08T20:20:15.778-03:00  INFO 1349292 --- [           main] [c6042e71-6382-40c2-9db1-8641e8c5ef43] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 143ms userId=- planId=-
2026-11-08T20:20:15.798-03:00  INFO 1349292 --- [           main] [7dffcef1-8b9a-4bdf-a3f2-93d60ab2c567] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/{id} 200 15ms userId=1 planId=1
2026-11-08T20:20:15.813-03:00  INFO 1349292 --- [           main] [4677cf7c-0f0e-4b5d-8d52-f410ac187cf6] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/{id} 200 12ms userId=1 planId=1
2026-11-08T20:20:15.826-03:00  INFO 1349292 --- [           main] [1f62fa25-d94b-4764-9fe9-29ba9d7d768a] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/{id} 200 12ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpUpdateToolIT#emptyUpdateIsT` - exit 0

```
2026-11-08T20:20:39.138-03:00  INFO 1349830 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-08T20:20:39.138-03:00  INFO 1349830 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-08T20:20:39.140-03:00  INFO 1349830 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 2 ms
2026-11-08T20:20:39.205-03:00  INFO 1349830 --- [           main] [] com.lcs.findraco.mcp.McpUpdateToolIT     : Started McpUpdateToolIT in 8.719 seconds (process running for 9.856)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-08T20:20:39.735-03:00  INFO 1349830 --- [           main] [66e51c8a-80ec-423e-a600-88e6f0198d05] i.m.server.McpAsyncServer                : Client initialize request - Protocol: 2025-06-18, Capabilities: ClientCapabilities[experimental=null, roots=null, sampling=null, elicitation=null, extensions=null], Info: Implementation[name=test, title=null, version=1, description=null, icons=null, websiteUrl=null]
2026-11-08T20:20:39.764-03:00  INFO 1349830 --- [           main] [66e51c8a-80ec-423e-a600-88e6f0198d05] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 137ms userId=- planId=-
2026-11-08T20:20:39.775-03:00  INFO 1349830 --- [           main] [4d018ba3-efde-4127-a7b4-45a381249e4f] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 7ms userId=- planId=-
2026-11-08T20:20:39.897-03:00  INFO 1349830 --- [           main] [48adf541-1dbb-4597-99a1-f6fa437e8214] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=update_transaction user=1 plan=1 outcome=error durationMs=106
2026-11-08T20:20:39.911-03:00  INFO 1349830 --- [           main] [48adf541-1dbb-4597-99a1-f6fa437e8214] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 134ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpUpdateToolIT#splitRulesOnAm` - exit 0

```
2026-11-08T20:21:04.252-03:00  WARN 1350344 --- [           main] [3821ee0c-3985-4d3d-8e3a-0a8db07c192c] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-08T20:21:04.255-03:00  WARN 1350344 --- [           main] [3821ee0c-3985-4d3d-8e3a-0a8db07c192c] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-08T20:21:04.256-03:00  WARN 1350344 --- [           main] [3821ee0c-3985-4d3d-8e3a-0a8db07c192c] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#com.lcs.findraco.transaction.request.UpdateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, Long)
2026-11-08T20:21:04.256-03:00  WARN 1350344 --- [           main] [3821ee0c-3985-4d3d-8e3a-0a8db07c192c] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#com.lcs.findraco.transaction.request.UpdateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, Long)
2026-11-08T20:21:04.257-03:00  WARN 1350344 --- [           main] [3821ee0c-3985-4d3d-8e3a-0a8db07c192c] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#items()
2026-11-08T20:21:04.257-03:00  WARN 1350344 --- [           main] [3821ee0c-3985-4d3d-8e3a-0a8db07c192c] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#participants()
2026-11-08T20:21:04.309-03:00  INFO 1350344 --- [           main] [3821ee0c-3985-4d3d-8e3a-0a8db07c192c] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=update_transaction user=1 plan=1 outcome=ok durationMs=199
2026-11-08T20:21:04.323-03:00  INFO 1350344 --- [           main] [3821ee0c-3985-4d3d-8e3a-0a8db07c192c] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 227ms userId=- planId=-
2026-11-08T20:21:04.400-03:00  INFO 1350344 --- [           main] [73ef2b87-55ef-40ae-9237-c79c03b5523d] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/{id} 200 45ms userId=1 planId=1
2026-11-08T20:21:04.477-03:00  INFO 1350344 --- [           main] [c1ddf3f0-4821-4756-8d22-038298015043] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=update_transaction user=1 plan=1 outcome=error durationMs=18
2026-11-08T20:21:04.478-03:00  INFO 1350344 --- [           main] [c1ddf3f0-4821-4756-8d22-038298015043] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 22ms userId=- planId=-
2026-11-08T20:21:04.501-03:00  INFO 1350344 --- [           main] [664cd158-fce1-4705-bd47-13dac92e229f] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/{id} 200 17ms userId=1 planId=1
2026-11-08T20:21:04.532-03:00  INFO 1350344 --- [           main] [45eb3939-aa61-4060-a455-f9e845a086e7] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=update_transaction user=1 plan=1 outcome=ok durationMs=26
2026-11-08T20:21:04.533-03:00  INFO 1350344 --- [           main] [45eb3939-aa61-4060-a455-f9e845a086e7] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 30ms userId=- planId=-
2026-11-08T20:21:04.548-03:00  INFO 1350344 --- [           main] [c792fdfa-4370-4a5b-8d42-831aa27ff461] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/{id} 200 12ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpUpdateToolIT#amountBelowIte` - exit 0

```
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-08T20:21:28.394-03:00  INFO 1350892 --- [           main] [62f851e2-1309-493c-82d9-060e06e4f472] i.m.server.McpAsyncServer                : Client initialize request - Protocol: 2025-06-18, Capabilities: ClientCapabilities[experimental=null, roots=null, sampling=null, elicitation=null, extensions=null], Info: Implementation[name=test, title=null, version=1, description=null, icons=null, websiteUrl=null]
2026-11-08T20:21:28.414-03:00  INFO 1350892 --- [           main] [62f851e2-1309-493c-82d9-060e06e4f472] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 132ms userId=- planId=-
2026-11-08T20:21:28.425-03:00  INFO 1350892 --- [           main] [fc7c85ce-eddb-4cc9-9595-7bcf1671d007] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 7ms userId=- planId=-
2026-11-08T20:21:28.602-03:00  WARN 1350892 --- [           main] [202a2c47-47ae-4588-a491-0cfcdb21d601] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-08T20:21:28.605-03:00  WARN 1350892 --- [           main] [202a2c47-47ae-4588-a491-0cfcdb21d601] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-08T20:21:28.605-03:00  WARN 1350892 --- [           main] [202a2c47-47ae-4588-a491-0cfcdb21d601] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#items()
2026-11-08T20:21:28.605-03:00  WARN 1350892 --- [           main] [202a2c47-47ae-4588-a491-0cfcdb21d601] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#participants()
2026-11-08T20:21:28.606-03:00  WARN 1350892 --- [           main] [202a2c47-47ae-4588-a491-0cfcdb21d601] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#com.lcs.findraco.transaction.request.UpdateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, Long)
2026-11-08T20:21:28.606-03:00  WARN 1350892 --- [           main] [202a2c47-47ae-4588-a491-0cfcdb21d601] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#com.lcs.findraco.transaction.request.UpdateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, Long)
2026-11-08T20:21:28.642-03:00  INFO 1350892 --- [           main] [202a2c47-47ae-4588-a491-0cfcdb21d601] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=update_transaction user=1 plan=1 outcome=error durationMs=190
2026-11-08T20:21:28.656-03:00  INFO 1350892 --- [           main] [202a2c47-47ae-4588-a491-0cfcdb21d601] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 230ms userId=- planId=-
2026-11-08T20:21:28.778-03:00  INFO 1350892 --- [           main] [127642ff-74c7-4e16-8160-514035716317] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/{id} 200 48ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpUpdateToolIT#staleVersionIs` - exit 0

```
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-08T20:21:52.797-03:00  INFO 1351407 --- [           main] [7085ccdf-c058-4bb7-bffb-b2b3c952b47c] i.m.server.McpAsyncServer                : Client initialize request - Protocol: 2025-06-18, Capabilities: ClientCapabilities[experimental=null, roots=null, sampling=null, elicitation=null, extensions=null], Info: Implementation[name=test, title=null, version=1, description=null, icons=null, websiteUrl=null]
2026-11-08T20:21:52.816-03:00  INFO 1351407 --- [           main] [7085ccdf-c058-4bb7-bffb-b2b3c952b47c] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 131ms userId=- planId=-
2026-11-08T20:21:52.826-03:00  INFO 1351407 --- [           main] [af19e660-117e-4797-abfc-7d2f049f9dc1] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 6ms userId=- planId=-
2026-11-08T20:21:52.992-03:00  WARN 1351407 --- [           main] [e4514038-8189-4405-9b6d-13e25d18c710] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#com.lcs.findraco.transaction.request.UpdateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, Long)
2026-11-08T20:21:52.995-03:00  WARN 1351407 --- [           main] [e4514038-8189-4405-9b6d-13e25d18c710] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#com.lcs.findraco.transaction.request.UpdateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, Long)
2026-11-08T20:21:52.995-03:00  WARN 1351407 --- [           main] [e4514038-8189-4405-9b6d-13e25d18c710] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-08T20:21:52.995-03:00  WARN 1351407 --- [           main] [e4514038-8189-4405-9b6d-13e25d18c710] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#participants()
2026-11-08T20:21:52.996-03:00  WARN 1351407 --- [           main] [e4514038-8189-4405-9b6d-13e25d18c710] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-08T20:21:52.996-03:00  WARN 1351407 --- [           main] [e4514038-8189-4405-9b6d-13e25d18c710] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#items()
2026-11-08T20:21:53.019-03:00  INFO 1351407 --- [           main] [e4514038-8189-4405-9b6d-13e25d18c710] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=update_transaction user=1 plan=1 outcome=error durationMs=177
2026-11-08T20:21:53.032-03:00  INFO 1351407 --- [           main] [e4514038-8189-4405-9b6d-13e25d18c710] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 205ms userId=- planId=-
2026-11-08T20:21:53.152-03:00  INFO 1351407 --- [           main] [b98bb320-f490-4491-95a2-e5067eef7af3] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/{id} 200 46ms userId=1 planId=1
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpUpdateToolIT#viewerCannotEd` - exit 0

```
2026-11-08T20:22:17.689-03:00  INFO 1351943 --- [           main] [0586cea7-167b-44c6-b610-7b8d13fe6913] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 137ms userId=- planId=-
2026-11-08T20:22:17.701-03:00  INFO 1351943 --- [           main] [311d84d7-ce25-4d85-8e12-bbcb4c702ac2] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 7ms userId=- planId=-
2026-11-08T20:22:17.847-03:00  WARN 1351943 --- [           main] [e8cc5b92-4c66-4a48-8f5e-329b93a869c8] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#items()
2026-11-08T20:22:17.850-03:00  WARN 1351943 --- [           main] [e8cc5b92-4c66-4a48-8f5e-329b93a869c8] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: participants
2026-11-08T20:22:17.851-03:00  WARN 1351943 --- [           main] [e8cc5b92-4c66-4a48-8f5e-329b93a869c8] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#com.lcs.findraco.transaction.request.UpdateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, Long)
2026-11-08T20:22:17.851-03:00  WARN 1351943 --- [           main] [e8cc5b92-4c66-4a48-8f5e-329b93a869c8] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#com.lcs.findraco.transaction.request.UpdateTransactionRequest(Long, TransactionType, BigDecimal, String, Integer, LocalDate, LocalDate, SplitMode, List, List, Long)
2026-11-08T20:22:17.851-03:00  WARN 1351943 --- [           main] [e8cc5b92-4c66-4a48-8f5e-329b93a869c8] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: UpdateTransactionRequest#participants()
2026-11-08T20:22:17.851-03:00  WARN 1351943 --- [           main] [e8cc5b92-4c66-4a48-8f5e-329b93a869c8] o.h.v.i.m.a.CascadingMetaDataBuilder     : HV000271: Using `@Valid` on a container (java.util.List) is deprecated. You should apply the annotation on the type argument(s). Affected element: items
2026-11-08T20:22:17.872-03:00  INFO 1351943 --- [           main] [e8cc5b92-4c66-4a48-8f5e-329b93a869c8] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=update_transaction user=2 plan=1 outcome=error durationMs=155
2026-11-08T20:22:17.887-03:00  INFO 1351943 --- [           main] [e8cc5b92-4c66-4a48-8f5e-329b93a869c8] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 185ms userId=- planId=-
2026-11-08T20:22:18.008-03:00  INFO 1351943 --- [           main] [8b87546b-e195-4bc9-82d0-4f7b8d837e6e] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan/{planId}/transaction/{id} 200 43ms userId=1 planId=1
2026-11-08T20:22:18.029-03:00  INFO 1351943 --- [           main] [33aec6c4-b9c2-4c22-8851-fa2806f37834] i.m.server.McpAsyncServer                : Client initialize request - Protocol: 2025-06-18, Capabilities: ClientCapabilities[experimental=null, roots=null, sampling=null, elicitation=null, extensions=null], Info: Implementation[name=test, title=null, version=1, description=null, icons=null, websiteUrl=null]
2026-11-08T20:22:18.029-03:00  INFO 1351943 --- [           main] [33aec6c4-b9c2-4c22-8851-fa2806f37834] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 2ms userId=- planId=-
2026-11-08T20:22:18.032-03:00  INFO 1351943 --- [           main] [aefbf6a9-e7cd-4420-afb5-54a93e8dbe13] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 1ms userId=- planId=-
2026-11-08T20:22:18.043-03:00  INFO 1351943 --- [           main] [8d6ac78d-ce73-4135-bc19-426f4b354a84] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 10ms userId=- planId=-
```

`cd frontend && grep -q "oauth2" vite.config.ts && grep -q "well-known" vite.config.ts && grep -q "\\\\/mcp" vi` - exit 0

```
(no output)
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='AuthorizationServerIT#forwarde` - exit 0

```
2026-11-08T20:22:41.571-03:00  INFO 1352464 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-08T20:22:41.571-03:00  INFO 1352464 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-08T20:22:41.572-03:00  INFO 1352464 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-08T20:22:41.627-03:00  INFO 1352464 --- [           main] [] c.l.findraco.auth.AuthorizationServerIT  : Started AuthorizationServerIT in 8.919 seconds (process running for 10.108)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
2026-11-08T20:22:42.050-03:00  WARN 1352464 --- [           main] [33baf3c8-6cba-4053-ba68-75de7b5a47b0] c.l.f.a.s.CimdRegisteredClientRepository : Client metadata document http://127.0.0.1:1/oauth/test-client could not be fetched: ResourceAccessException
2026-11-08T20:22:42.057-03:00  INFO 1352464 --- [           main] [33baf3c8-6cba-4053-ba68-75de7b5a47b0] c.l.f.shared.web.RequestLogFilter        : GET - 302 48ms userId=- planId=-
2026-11-08T20:22:42.256-03:00  INFO 1352464 --- [           main] [5ac677e1-267f-46b4-91c5-834cebdc433d] c.l.f.shared.web.RequestLogFilter        : POST - 302 195ms userId=- planId=-
2026-11-08T20:22:42.319-03:00  INFO 1352464 --- [           main] [c5fce9ae-e53f-4e61-b5d4-6a019220178f] c.l.f.shared.web.RequestLogFilter        : POST - 302 62ms userId=- planId=-
2026-11-08T20:22:42.353-03:00  INFO 1352464 --- [           main] [e3bbf656-ecde-47c7-9181-e623c7e3de9f] c.l.f.shared.web.RequestLogFilter        : GET - 302 32ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpPlanToolsIT#unknownArgument` - exit 0

```
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-08T20:23:06.188-03:00  INFO 1352984 --- [           main] [f0516a7e-824c-4e63-b72b-5c53a201dd9a] i.m.server.McpAsyncServer                : Client initialize request - Protocol: 2025-06-18, Capabilities: ClientCapabilities[experimental=null, roots=null, sampling=null, elicitation=null, extensions=null], Info: Implementation[name=test, title=null, version=1, description=null, icons=null, websiteUrl=null]
2026-11-08T20:23:06.209-03:00  INFO 1352984 --- [           main] [f0516a7e-824c-4e63-b72b-5c53a201dd9a] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 130ms userId=- planId=-
2026-11-08T20:23:06.224-03:00  INFO 1352984 --- [           main] [7d076198-e1ec-4e0e-877b-8b66b5aaa7c7] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 10ms userId=- planId=-
2026-11-08T20:23:06.237-03:00  WARN 1352984 --- [           main] [f1d8e45d-489e-4792-895b-2d030ced6d7e] i.m.util.ToolInputValidator              : Tool (list_categories) input validation failed: Validation failed: JSON schema validation errors: [: property 'bogus' is not defined in the schema and the schema does not allow additional properties]
2026-11-08T20:23:06.255-03:00  INFO 1352984 --- [           main] [f1d8e45d-489e-4792-895b-2d030ced6d7e] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 29ms userId=- planId=-
2026-11-08T20:23:06.309-03:00  WARN 1352984 --- [           main] [0ab63c2e-3985-48c8-b4c9-7ddabcc0cc39] i.m.util.ToolInputValidator              : Tool (create_transaction) input validation failed: Validation failed: JSON schema validation errors: [: property 'plano' is not defined in the schema and the schema does not allow additional properties]
2026-11-08T20:23:06.309-03:00  INFO 1352984 --- [           main] [0ab63c2e-3985-48c8-b4c9-7ddabcc0cc39] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 3ms userId=- planId=-
2026-11-08T20:23:06.474-03:00  INFO 1352984 --- [           main] [579af801-b247-47b4-9887-1d197b0083d5] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=list_categories user=1 plan=2 outcome=ok durationMs=155
2026-11-08T20:23:06.474-03:00  INFO 1352984 --- [           main] [579af801-b247-47b4-9887-1d197b0083d5] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 159ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpPlanToolsIT#wrongTypeAndEnu` - exit 0

```
2026-11-08T20:23:30.000-03:00  INFO 1353527 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 3 ms
2026-11-08T20:23:30.060-03:00  INFO 1353527 --- [           main] [] com.lcs.findraco.mcp.McpPlanToolsIT      : Started McpPlanToolsIT in 8.994 seconds (process running for 10.123)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-08T20:23:30.579-03:00  INFO 1353527 --- [           main] [d20c9f69-d55f-4cca-805f-c01d1b1ba268] i.m.server.McpAsyncServer                : Client initialize request - Protocol: 2025-06-18, Capabilities: ClientCapabilities[experimental=null, roots=null, sampling=null, elicitation=null, extensions=null], Info: Implementation[name=test, title=null, version=1, description=null, icons=null, websiteUrl=null]
2026-11-08T20:23:30.599-03:00  INFO 1353527 --- [           main] [d20c9f69-d55f-4cca-805f-c01d1b1ba268] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 128ms userId=- planId=-
2026-11-08T20:23:30.609-03:00  INFO 1353527 --- [           main] [8d5b79d5-fb24-4053-8e23-5c080d0bbcd0] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 6ms userId=- planId=-
2026-11-08T20:23:30.620-03:00  WARN 1353527 --- [           main] [0f8f9e16-9938-42ee-98e4-7162b25c63fb] i.m.util.ToolInputValidator              : Tool (create_transaction) input validation failed: Validation failed: JSON schema validation errors: [/amount: string found, number expected]
2026-11-08T20:23:30.637-03:00  INFO 1353527 --- [           main] [0f8f9e16-9938-42ee-98e4-7162b25c63fb] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 26ms userId=- planId=-
2026-11-08T20:23:30.690-03:00  WARN 1353527 --- [           main] [ac471492-babd-4075-8671-1b27873351b7] i.m.util.ToolInputValidator              : Tool (create_transaction) input validation failed: Validation failed: JSON schema validation errors: [/type: does not have a value in the enumeration ["CREDIT", "DEBIT"]]
2026-11-08T20:23:30.690-03:00  INFO 1353527 --- [           main] [ac471492-babd-4075-8671-1b27873351b7] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 3ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='AuthorizationServerIT#loopback` - exit 0

```
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-08T20:23:54.831-03:00  WARN 1354038 --- [           main] [cece4bc8-772e-41d5-9c1a-4c8f761a76b9] c.l.f.a.s.CimdRegisteredClientRepository : Client metadata document http://127.0.0.1:1/oauth/test-client could not be fetched: ResourceAccessException
2026-11-08T20:23:54.838-03:00  INFO 1354038 --- [           main] [cece4bc8-772e-41d5-9c1a-4c8f761a76b9] c.l.f.shared.web.RequestLogFilter        : GET - 302 42ms userId=- planId=-
2026-11-08T20:23:55.102-03:00  INFO 1354038 --- [           main] [05943211-80b3-417f-89b4-41f4a6a13cac] c.l.f.shared.web.RequestLogFilter        : POST - 302 260ms userId=- planId=-
2026-11-08T20:23:55.105-03:00  WARN 1354038 --- [           main] [cdadf1d8-82f7-48fe-a672-c3ed75bf1676] c.l.f.a.s.CimdRegisteredClientRepository : Client metadata document http://127.0.0.1:1/oauth/loopback-client could not be fetched: ResourceAccessException
2026-11-08T20:23:55.136-03:00  INFO 1354038 --- [           main] [cdadf1d8-82f7-48fe-a672-c3ed75bf1676] c.l.f.shared.web.RequestLogFilter        : GET - 302 32ms userId=- planId=-
2026-11-08T20:23:55.186-03:00  INFO 1354038 --- [           main] [e1d2e630-828d-4673-bd58-2dd812736ddb] c.l.f.shared.web.RequestLogFilter        : POST - 302 47ms userId=- planId=-
2026-11-08T20:23:55.245-03:00  INFO 1354038 --- [           main] [95c591a8-44d8-4b66-a063-ef32bff6cf95] c.l.f.shared.web.RequestLogFilter        : GET - 400 0ms userId=- planId=-
2026-11-08T20:23:55.246-03:00  INFO 1354038 --- [           main] [7b292edf-e4c0-467a-a014-dfcdf6195255] c.l.f.shared.web.RequestLogFilter        : GET - 400 0ms userId=- planId=-
2026-11-08T20:23:55.247-03:00  INFO 1354038 --- [           main] [fc4909cb-e737-4f3f-94d2-ccd7e46247f6] c.l.f.shared.web.RequestLogFilter        : GET - 400 0ms userId=- planId=-
2026-11-08T20:23:55.248-03:00  INFO 1354038 --- [           main] [60894a3c-1339-47fb-b417-38ba1cd33557] c.l.f.shared.web.RequestLogFilter        : GET - 400 0ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q test -Dtest='McpUpdateCopyTest#keepsInstallmentS` - exit 0

```
(no output)
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='AuthorizationServerIT#codeLive` - exit 0

```
2026-11-08T20:24:23.306-03:00  INFO 1354853 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-08T20:24:23.307-03:00  INFO 1354853 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-08T20:24:23.369-03:00  INFO 1354853 --- [           main] [] c.l.findraco.auth.AuthorizationServerIT  : Started AuthorizationServerIT in 8.875 seconds (process running for 10.049)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-08T20:24:23.758-03:00  WARN 1354853 --- [           main] [7442f106-7533-4234-8e14-8c9260ad126f] c.l.f.a.s.CimdRegisteredClientRepository : Client metadata document http://127.0.0.1:1/oauth/test-client could not be fetched: ResourceAccessException
2026-11-08T20:24:23.765-03:00  INFO 1354853 --- [           main] [7442f106-7533-4234-8e14-8c9260ad126f] c.l.f.shared.web.RequestLogFilter        : GET - 302 42ms userId=- planId=-
2026-11-08T20:24:24.017-03:00  INFO 1354853 --- [           main] [4463edfc-9751-481a-bf19-6f8459a97901] c.l.f.shared.web.RequestLogFilter        : POST - 302 248ms userId=- planId=-
2026-11-08T20:24:24.048-03:00  INFO 1354853 --- [           main] [7ad64588-a3f6-4a4a-8901-95de1c776fd1] c.l.f.shared.web.RequestLogFilter        : GET - 302 30ms userId=- planId=-
2026-11-08T20:24:24.096-03:00  INFO 1354853 --- [           main] [b6e80fe1-426e-4be1-b615-8230455120ce] c.l.f.shared.web.RequestLogFilter        : POST - 302 47ms userId=- planId=-
2026-11-08T20:24:24.165-03:00  INFO 1354853 --- [           main] [b565723c-f5c3-4774-9fde-591da7d0156a] c.l.f.shared.web.RequestLogFilter        : POST - 400 15ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q test -Dtest='ConfigurationPropertiesTest#mcpRate` - exit 0

```
(no output)
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='AuthorizationServerIT#clientIn` - exit 0

```
2026-11-08T20:24:51.816-03:00  INFO 1355659 --- [           main] [] c.l.findraco.auth.AuthorizationServerIT  : Started AuthorizationServerIT in 8.739 seconds (process running for 9.89)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-08T20:24:52.225-03:00  WARN 1355659 --- [           main] [6aa63ca3-3606-4a0a-8f06-e8a92bf1fb44] c.l.f.a.s.CimdRegisteredClientRepository : Client metadata document http://127.0.0.1:1/oauth/test-client could not be fetched: ResourceAccessException
2026-11-08T20:24:52.232-03:00  INFO 1355659 --- [           main] [6aa63ca3-3606-4a0a-8f06-e8a92bf1fb44] c.l.f.shared.web.RequestLogFilter        : GET - 302 53ms userId=- planId=-
2026-11-08T20:24:52.487-03:00  INFO 1355659 --- [           main] [b5b45af5-32cd-41b2-85ef-73778c3c5e0d] c.l.f.shared.web.RequestLogFilter        : POST - 302 251ms userId=- planId=-
2026-11-08T20:24:52.490-03:00  WARN 1355659 --- [           main] [85bb143c-f53c-4b40-9de1-b0d40f256794] c.l.f.a.s.CimdRegisteredClientRepository : Client metadata document http://127.0.0.1:1/oauth/loopback-client could not be fetched: ResourceAccessException
2026-11-08T20:24:52.521-03:00  INFO 1355659 --- [           main] [85bb143c-f53c-4b40-9de1-b0d40f256794] c.l.f.shared.web.RequestLogFilter        : GET - 302 32ms userId=- planId=-
2026-11-08T20:24:52.582-03:00  INFO 1355659 --- [           main] [d7eab829-c2a3-4544-b925-1417e2bb9b2b] c.l.f.shared.web.RequestLogFilter        : GET /oauth2/client-info 200 60ms userId=- planId=-
2026-11-08T20:24:52.621-03:00  INFO 1355659 --- [           main] [b49d5067-e98d-4570-b377-41eef4692283] c.l.f.shared.web.RequestLogFilter        : GET /oauth2/client-info 200 3ms userId=- planId=-
2026-11-08T20:24:52.627-03:00  INFO 1355659 --- [           main] [5708a0f7-47c8-47f0-b40b-6c4b7eb7f5f9] c.l.f.shared.web.RequestLogFilter        : GET /oauth2/client-info 200 5ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpPlanToolsIT#archivedDefault` - exit 0

```
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-08T20:25:17.057-03:00  INFO 1356184 --- [           main] [e52e4c61-20bd-4431-ae61-43621fc6ad97] i.m.server.McpAsyncServer                : Client initialize request - Protocol: 2025-06-18, Capabilities: ClientCapabilities[experimental=null, roots=null, sampling=null, elicitation=null, extensions=null], Info: Implementation[name=test, title=null, version=1, description=null, icons=null, websiteUrl=null]
2026-11-08T20:25:17.078-03:00  INFO 1356184 --- [           main] [e52e4c61-20bd-4431-ae61-43621fc6ad97] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 137ms userId=- planId=-
2026-11-08T20:25:17.089-03:00  INFO 1356184 --- [           main] [c0c90075-fc85-48e9-aca8-931e57c1f2e0] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 7ms userId=- planId=-
2026-11-08T20:25:17.192-03:00  INFO 1356184 --- [           main] [01749c0c-51fb-47c6-b1a3-54f729c87af3] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=plan_probe user=1 plan=null outcome=error durationMs=89
2026-11-08T20:25:17.207-03:00  INFO 1356184 --- [           main] [01749c0c-51fb-47c6-b1a3-54f729c87af3] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 116ms userId=- planId=-
2026-11-08T20:25:17.309-03:00  INFO 1356184 --- [           main] [c2656fb6-7589-43b1-8b13-6787324105a1] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=plan_probe user=1 plan=2 outcome=ok durationMs=33
2026-11-08T20:25:17.309-03:00  INFO 1356184 --- [           main] [c2656fb6-7589-43b1-8b13-6787324105a1] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 37ms userId=- planId=-
2026-11-08T20:25:17.317-03:00  INFO 1356184 --- [           main] [fcb1be96-bd5d-4c1b-90db-46270dc7e781] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=plan_probe user=1 plan=null outcome=error durationMs=2
2026-11-08T20:25:17.317-03:00  INFO 1356184 --- [           main] [fcb1be96-bd5d-4c1b-90db-46270dc7e781] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 6ms userId=- planId=-
2026-11-08T20:25:17.325-03:00  INFO 1356184 --- [           main] [8f84671b-2670-441c-aaa1-b57b7d257649] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=plan_probe user=1 plan=null outcome=error durationMs=3
2026-11-08T20:25:17.326-03:00  INFO 1356184 --- [           main] [8f84671b-2670-441c-aaa1-b57b7d257649] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 7ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpPlanToolsIT#memberRemovedAf` - exit 0

```
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-08T20:25:41.479-03:00  INFO 1356699 --- [           main] [04a9dba2-1963-461c-8ae8-06edc5cee988] i.m.server.McpAsyncServer                : Client initialize request - Protocol: 2025-06-18, Capabilities: ClientCapabilities[experimental=null, roots=null, sampling=null, elicitation=null, extensions=null], Info: Implementation[name=test, title=null, version=1, description=null, icons=null, websiteUrl=null]
2026-11-08T20:25:41.517-03:00  INFO 1356699 --- [           main] [04a9dba2-1963-461c-8ae8-06edc5cee988] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 148ms userId=- planId=-
2026-11-08T20:25:41.529-03:00  INFO 1356699 --- [           main] [6f3b91dc-fe72-4ef7-b2a0-ff98ac2c7281] c.l.f.shared.web.RequestLogFilter        : POST /mcp 202 7ms userId=- planId=-
2026-11-08T20:25:41.658-03:00  INFO 1356699 --- [           main] [0bb8e6c7-32d7-4b81-bca5-18d4af667b8f] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=plan_probe user=2 plan=1 outcome=ok durationMs=116
2026-11-08T20:25:41.672-03:00  INFO 1356699 --- [           main] [0bb8e6c7-32d7-4b81-bca5-18d4af667b8f] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 142ms userId=- planId=-
2026-11-08T20:25:41.723-03:00  INFO 1356699 --- [           main] [a56744d4-0c40-47d1-ab9c-00816cb5a056] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=plan_probe user=2 plan=null outcome=error durationMs=6
2026-11-08T20:25:41.724-03:00  INFO 1356699 --- [           main] [a56744d4-0c40-47d1-ab9c-00816cb5a056] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 9ms userId=- planId=-
2026-11-08T20:25:41.733-03:00  INFO 1356699 --- [           main] [037b13f1-1e79-488a-a578-7fa647a4abe1] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=plan_probe user=2 plan=null outcome=error durationMs=3
2026-11-08T20:25:41.733-03:00  INFO 1356699 --- [           main] [037b13f1-1e79-488a-a578-7fa647a4abe1] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 6ms userId=- planId=-
2026-11-08T20:25:41.740-03:00  INFO 1356699 --- [           main] [21e01028-6762-4636-a2ad-0c30b1cdc682] c.l.findraco.mcp.service.McpToolRunner   : MCP tool=plan_probe user=2 plan=null outcome=error durationMs=3
2026-11-08T20:25:41.740-03:00  INFO 1356699 --- [           main] [21e01028-6762-4636-a2ad-0c30b1cdc682] c.l.f.shared.web.RequestLogFilter        : POST /mcp 200 6ms userId=- planId=-
```
