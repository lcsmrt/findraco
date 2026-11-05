# i18n proofs

**HEAD**: ac05729
**Tree**: clean
**Shell**: /bin/sh
**Result**: 31 pass, 0 fail

| Check | Proof | Result |
| --- | --- | --- |
| C1 | `walk - Storybook at 390×844 with the locale global pt-BR: the page-view stories of the five destinations, the ` | pass (Walked) |
| C2 | `cd frontend && pnpm exec vitest run --project=unit --project=storybook` | pass |
| C3 | `run unit / ✓ names months and weekdays in Portuguese` | pass |
| C4 | `run unit / ✓ shows user data as typed in Portuguese` | pass |
| C5 | `run unit / ✓ uses the singular for one and the plural otherwise in both languages` | pass |
| C6 | `run unit / ✓ reports literal interface texts in components` | pass |
| C7 | `run unit / ✓ fails when the two languages differ` | pass |
| C8 | `run unit / ✓ the committed language files are in parity` | pass |
| C9 | `run unit / ✓ keeps typed values when the language changes` | pass |
| C10 | `run unit / ✓ picks pt-BR for a Portuguese device language and en otherwise` | pass |
| C11 | `run unit / ✓ offers English and Português (Brasil)` | pass |
| C12 | `run unit / ✓ sets the document lang to the language in use` | pass |
| C13 | `run unit / ✓ switches the texts at once and saves the language` | pass |
| C14 | `run unit / ✓ applies the saved language at sign-in` | pass |
| C15 | `run unit / ✓ uses the device language when signed out` | pass |
| C16 | `run unit / ✓ keeps the picked language when saving fails` | pass |
| C17 | `run unit / ✓ starts the tests in English` | pass |
| C18 | `run unit / ✓ writes 04/11/2026 in Portuguese` | pass |
| C19 | `run unit / ✓ writes 04/11/2026 in English on a Brazilian device` | pass |
| C20 | `run unit / ✓ writes 11/04/2026 in English on a US device` | pass |
| C21 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='UserLanguageIT#storesTheLangua` | pass |
| C22 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='UserLanguageIT#rejectsAnUnknow` | pass |
| C23 | `cd frontend && test -z "$(grep -rlE 'import \{[^}]*\bformat\b[^}]*\} from "date-fns"' src --include='*.ts' --i` | pass |
| C24 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='PasswordResetLanguageIT#usesTh` | pass |
| C25 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='PasswordResetLanguageIT#usesTh` | pass |
| C26 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='PasswordResetLanguageIT#fallsB` | pass |
| C27 | `run unit / ✓ formats money the same in both languages` | pass |
| C28 | `run unit / ✓ reads CSV dates as dd/mm/yyyy in both languages` | pass |
| Build | `cd frontend && pnpm lint` | pass |
| Build | `cd frontend && pnpm build` | pass |
| Build | `cd frontend && node scripts/check-siblings.ts` | pass |

## Output

`Run unit` - exit 0

```
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer series edit (STD-07 AC 2) > offers no save while the series definition is loading 45ms
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer series edit (STD-07 AC 2) > edits This one of the series from the occurrence 139ms
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer series edit (STD-07 AC 2) > edits This and following of the series from the occurrence 151ms
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer series edit (STD-07 AC 2) > edits All of the series from the occurrence 135ms
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer series edit (STD-07 AC 2) > edits the whole series without asking when the number of installments changed 93ms
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer series edit (STD-07 AC 2) > sends nothing and stays open when the scope is cancelled 111ms
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer language > keeps typed values when the language changes 102ms
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer language > shows user data as typed in Portuguese 35ms

 Test Files  25 passed (25)
      Tests  203 passed (203)
   Start at  02:44:36
   Duration  7.79s (transform 772ms, setup 1.84s, collect 7.34s, tests 8.96s, environment 10.34s, prepare 1.22s)

No story files found for the specified pattern: src/**/*.mdx
```

`cd frontend && pnpm exec vitest run --project=unit --project=storybook` - exit 0

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

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='UserLanguageIT#storesTheLangua` - exit 0

```
2026-11-05T02:45:42.779-03:00  INFO 440939 --- [           main] [] eAuthenticationProviderManagerConfigurer : Global AuthenticationManager configured with AuthenticationProvider bean with name authenticationProvider
2026-11-05T02:45:42.780-03:00  WARN 440939 --- [           main] [] r$InitializeUserDetailsManagerConfigurer : Global AuthenticationManager configured with an AuthenticationProvider bean. UserDetailsService beans will not be used by Spring Security for automatically configuring username/password login. Consider removing the AuthenticationProvider bean. Alternatively, consider using the UserDetailsService in a manually instantiated DaoAuthenticationProvider. If the current configuration is intentional, to turn off this warning, increase the logging level of 'org.springframework.security.config.annotation.authentication.configuration.InitializeUserDetailsBeanManagerConfigurer' to ERROR
2026-11-05T02:45:43.922-03:00  INFO 440939 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-05T02:45:43.922-03:00  INFO 440939 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-05T02:45:43.924-03:00  INFO 440939 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-05T02:45:44.001-03:00  INFO 440939 --- [           main] [] com.lcs.findraco.user.UserLanguageIT     : Started UserLanguageIT in 10.665 seconds (process running for 11.946)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-05T02:45:44.584-03:00  INFO 440939 --- [           main] [d0813d31-fdbd-4810-ab2a-daf3339a1562] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/user/me 200 119ms userId=1 planId=-
2026-11-05T02:45:44.660-03:00  INFO 440939 --- [           main] [415a6de1-1cdb-42b8-a2df-ea1b4e041cd1] c.l.f.shared.web.RequestLogFilter        : PATCH /api/findraco/user/me/language 200 43ms userId=1 planId=-
2026-11-05T02:45:44.735-03:00  INFO 440939 --- [           main] [f4071641-e16a-4d8c-a08c-ae9cdd449e2f] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/user/me 200 7ms userId=1 planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='UserLanguageIT#rejectsAnUnknow` - exit 0

```
2026-11-05T02:46:04.522-03:00  INFO 441501 --- [           main] [] eAuthenticationProviderManagerConfigurer : Global AuthenticationManager configured with AuthenticationProvider bean with name authenticationProvider
2026-11-05T02:46:04.523-03:00  WARN 441501 --- [           main] [] r$InitializeUserDetailsManagerConfigurer : Global AuthenticationManager configured with an AuthenticationProvider bean. UserDetailsService beans will not be used by Spring Security for automatically configuring username/password login. Consider removing the AuthenticationProvider bean. Alternatively, consider using the UserDetailsService in a manually instantiated DaoAuthenticationProvider. If the current configuration is intentional, to turn off this warning, increase the logging level of 'org.springframework.security.config.annotation.authentication.configuration.InitializeUserDetailsBeanManagerConfigurer' to ERROR
2026-11-05T02:46:05.670-03:00  INFO 441501 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-05T02:46:05.670-03:00  INFO 441501 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-05T02:46:05.672-03:00  INFO 441501 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-05T02:46:05.724-03:00  INFO 441501 --- [           main] [] com.lcs.findraco.user.UserLanguageIT     : Started UserLanguageIT in 8.348 seconds (process running for 9.486)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-05T02:46:06.324-03:00  INFO 441501 --- [           main] [d396ccce-ef67-4e6a-82c9-04bdf907eb6d] c.l.f.shared.web.RequestLogFilter        : PATCH /api/findraco/user/me/language 200 139ms userId=1 planId=-
2026-11-05T02:46:06.361-03:00  INFO 441501 --- [           main] [af6ab2f7-ec1b-45bf-91da-538f98322bc7] c.l.f.shared.web.RequestLogFilter        : PATCH /api/findraco/user/me/language 422 30ms userId=1 planId=-
2026-11-05T02:46:06.395-03:00  INFO 441501 --- [           main] [0581f511-1d7b-45c5-92b8-c402029bb6e9] c.l.f.shared.web.RequestLogFilter        : PATCH /api/findraco/user/me/language 422 6ms userId=1 planId=-
```

`cd frontend && test -z "$(grep -rlE 'import \{[^}]*\bformat\b[^}]*\} from "date-fns"' src --include='*.ts' --i` - exit 0

```
(no output)
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='PasswordResetLanguageIT#usesTh` - exit 0

```
2026-11-05T02:46:25.079-03:00  INFO 442014 --- [           main] [] j.LocalContainerEntityManagerFactoryBean : Initialized JPA EntityManagerFactory for persistence unit 'default'
2026-11-05T02:46:25.164-03:00  INFO 442014 --- [           main] [] o.s.d.j.r.query.QueryEnhancerFactories   : Hibernate is in classpath; If applicable, HQL parser will be used.
2026-11-05T02:46:25.887-03:00  INFO 442014 --- [           main] [] eAuthenticationProviderManagerConfigurer : Global AuthenticationManager configured with AuthenticationProvider bean with name authenticationProvider
2026-11-05T02:46:25.887-03:00  WARN 442014 --- [           main] [] r$InitializeUserDetailsManagerConfigurer : Global AuthenticationManager configured with an AuthenticationProvider bean. UserDetailsService beans will not be used by Spring Security for automatically configuring username/password login. Consider removing the AuthenticationProvider bean. Alternatively, consider using the UserDetailsService in a manually instantiated DaoAuthenticationProvider. If the current configuration is intentional, to turn off this warning, increase the logging level of 'org.springframework.security.config.annotation.authentication.configuration.InitializeUserDetailsBeanManagerConfigurer' to ERROR
2026-11-05T02:46:26.967-03:00  INFO 442014 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-05T02:46:26.967-03:00  INFO 442014 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-05T02:46:26.968-03:00  INFO 442014 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-05T02:46:27.020-03:00  INFO 442014 --- [           main] [] c.l.f.auth.PasswordResetLanguageIT       : Started PasswordResetLanguageIT in 8.612 seconds (process running for 9.824)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-05T02:46:27.632-03:00  INFO 442014 --- [           main] [f4d18851-481a-4607-b9a5-e368dc5715cd] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/auth/forgot-password 204 170ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='PasswordResetLanguageIT#usesTh` - exit 0

```
2026-11-05T02:46:46.372-03:00  INFO 442546 --- [           main] [] j.LocalContainerEntityManagerFactoryBean : Initialized JPA EntityManagerFactory for persistence unit 'default'
2026-11-05T02:46:46.465-03:00  INFO 442546 --- [           main] [] o.s.d.j.r.query.QueryEnhancerFactories   : Hibernate is in classpath; If applicable, HQL parser will be used.
2026-11-05T02:46:47.217-03:00  INFO 442546 --- [           main] [] eAuthenticationProviderManagerConfigurer : Global AuthenticationManager configured with AuthenticationProvider bean with name authenticationProvider
2026-11-05T02:46:47.217-03:00  WARN 442546 --- [           main] [] r$InitializeUserDetailsManagerConfigurer : Global AuthenticationManager configured with an AuthenticationProvider bean. UserDetailsService beans will not be used by Spring Security for automatically configuring username/password login. Consider removing the AuthenticationProvider bean. Alternatively, consider using the UserDetailsService in a manually instantiated DaoAuthenticationProvider. If the current configuration is intentional, to turn off this warning, increase the logging level of 'org.springframework.security.config.annotation.authentication.configuration.InitializeUserDetailsBeanManagerConfigurer' to ERROR
2026-11-05T02:46:48.292-03:00  INFO 442546 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-05T02:46:48.292-03:00  INFO 442546 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-05T02:46:48.293-03:00  INFO 442546 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-05T02:46:48.347-03:00  INFO 442546 --- [           main] [] c.l.f.auth.PasswordResetLanguageIT       : Started PasswordResetLanguageIT in 8.196 seconds (process running for 9.343)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-05T02:46:48.914-03:00  INFO 442546 --- [           main] [97a0411c-fdc9-4103-9631-d2d60cc7fe5d] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/auth/forgot-password 204 176ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='PasswordResetLanguageIT#fallsB` - exit 0

```
2026-11-05T02:47:07.133-03:00  INFO 443058 --- [           main] [] o.s.d.j.r.query.QueryEnhancerFactories   : Hibernate is in classpath; If applicable, HQL parser will be used.
2026-11-05T02:47:07.852-03:00  INFO 443058 --- [           main] [] eAuthenticationProviderManagerConfigurer : Global AuthenticationManager configured with AuthenticationProvider bean with name authenticationProvider
2026-11-05T02:47:07.853-03:00  WARN 443058 --- [           main] [] r$InitializeUserDetailsManagerConfigurer : Global AuthenticationManager configured with an AuthenticationProvider bean. UserDetailsService beans will not be used by Spring Security for automatically configuring username/password login. Consider removing the AuthenticationProvider bean. Alternatively, consider using the UserDetailsService in a manually instantiated DaoAuthenticationProvider. If the current configuration is intentional, to turn off this warning, increase the logging level of 'org.springframework.security.config.annotation.authentication.configuration.InitializeUserDetailsBeanManagerConfigurer' to ERROR
2026-11-05T02:47:08.942-03:00  INFO 443058 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-05T02:47:08.943-03:00  INFO 443058 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-05T02:47:08.944-03:00  INFO 443058 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-05T02:47:09.009-03:00  INFO 443058 --- [           main] [] c.l.f.auth.PasswordResetLanguageIT       : Started PasswordResetLanguageIT in 8.126 seconds (process running for 9.27)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-05T02:47:09.561-03:00  INFO 443058 --- [           main] [e6a21d55-5430-49b2-863f-52c657c5d22a] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/auth/forgot-password 204 179ms userId=- planId=-
2026-11-05T02:47:09.578-03:00  INFO 443058 --- [           main] [c4b904b1-85ea-4731-9fda-3b10123164aa] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/auth/forgot-password 204 12ms userId=- planId=-
```
