# i18n proofs

**HEAD**: 85f40f3
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
| C28 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q test -Dtest='StatementParserRegistryTest#ambiguo` | pass |
| Build | `cd frontend && pnpm lint` | pass |
| Build | `cd frontend && pnpm build` | pass |
| Build | `cd frontend && node scripts/check-siblings.ts` | pass |

## Output

`Run unit` - exit 0

```
 ✓ |tooling| eslint.config.test.ts > eslint.config.js > local rules > with 61 lines of logic before the return reports ["local/component-logic-cap"] (STD-12 AC 3) 5ms
 ✓ |tooling| eslint.config.test.ts > eslint.config.js > local rules > reports an IIFE in a component's JSX (STD-12 AC 4) 2ms
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer series edit (STD-07 AC 2) > edits This and following of the series from the occurrence 156ms
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer series edit (STD-07 AC 2) > edits All of the series from the occurrence 159ms
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer series edit (STD-07 AC 2) > edits the whole series without asking when the number of installments changed 91ms
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer series edit (STD-07 AC 2) > sends nothing and stays open when the scope is cancelled 110ms
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer language > keeps typed values when the language changes 101ms
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer language > shows user data as typed in Portuguese 32ms

 Test Files  27 passed (27)
      Tests  205 passed (205)
   Start at  03:09:18
   Duration  8.70s (transform 875ms, setup 2.09s, collect 12.22s, tests 9.85s, environment 11.26s, prepare 1.32s)

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
2026-11-05T03:10:30.428-03:00  INFO 467584 --- [           main] [] eAuthenticationProviderManagerConfigurer : Global AuthenticationManager configured with AuthenticationProvider bean with name authenticationProvider
2026-11-05T03:10:30.428-03:00  WARN 467584 --- [           main] [] r$InitializeUserDetailsManagerConfigurer : Global AuthenticationManager configured with an AuthenticationProvider bean. UserDetailsService beans will not be used by Spring Security for automatically configuring username/password login. Consider removing the AuthenticationProvider bean. Alternatively, consider using the UserDetailsService in a manually instantiated DaoAuthenticationProvider. If the current configuration is intentional, to turn off this warning, increase the logging level of 'org.springframework.security.config.annotation.authentication.configuration.InitializeUserDetailsBeanManagerConfigurer' to ERROR
2026-11-05T03:10:31.523-03:00  INFO 467584 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-05T03:10:31.523-03:00  INFO 467584 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-05T03:10:31.524-03:00  INFO 467584 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-05T03:10:31.597-03:00  INFO 467584 --- [           main] [] com.lcs.findraco.user.UserLanguageIT     : Started UserLanguageIT in 8.946 seconds (process running for 10.21)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-05T03:10:32.182-03:00  INFO 467584 --- [           main] [1065ab40-1273-47ca-8a7f-a1e1904b4734] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/user/me 200 138ms userId=1 planId=-
2026-11-05T03:10:32.261-03:00  INFO 467584 --- [           main] [da55afb7-11c0-4c3e-a994-873c3b3902f9] c.l.f.shared.web.RequestLogFilter        : PATCH /api/findraco/user/me/language 200 46ms userId=1 planId=-
2026-11-05T03:10:32.328-03:00  INFO 467584 --- [           main] [350e12d9-7bd7-4f12-948d-e352487699b2] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/user/me 200 8ms userId=1 planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='UserLanguageIT#rejectsAnUnknow` - exit 0

```
2026-11-05T03:10:51.515-03:00  INFO 468142 --- [           main] [] eAuthenticationProviderManagerConfigurer : Global AuthenticationManager configured with AuthenticationProvider bean with name authenticationProvider
2026-11-05T03:10:51.516-03:00  WARN 468142 --- [           main] [] r$InitializeUserDetailsManagerConfigurer : Global AuthenticationManager configured with an AuthenticationProvider bean. UserDetailsService beans will not be used by Spring Security for automatically configuring username/password login. Consider removing the AuthenticationProvider bean. Alternatively, consider using the UserDetailsService in a manually instantiated DaoAuthenticationProvider. If the current configuration is intentional, to turn off this warning, increase the logging level of 'org.springframework.security.config.annotation.authentication.configuration.InitializeUserDetailsBeanManagerConfigurer' to ERROR
2026-11-05T03:10:52.590-03:00  INFO 468142 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-05T03:10:52.591-03:00  INFO 468142 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-05T03:10:52.592-03:00  INFO 468142 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-05T03:10:52.648-03:00  INFO 468142 --- [           main] [] com.lcs.findraco.user.UserLanguageIT     : Started UserLanguageIT in 8.157 seconds (process running for 9.354)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-05T03:10:53.245-03:00  INFO 468142 --- [           main] [78f1b118-6361-472e-bb7b-2a53ad0e3ddc] c.l.f.shared.web.RequestLogFilter        : PATCH /api/findraco/user/me/language 200 170ms userId=1 planId=-
2026-11-05T03:10:53.279-03:00  INFO 468142 --- [           main] [c19fbdcf-b352-4275-afc6-959b8b36bce2] c.l.f.shared.web.RequestLogFilter        : PATCH /api/findraco/user/me/language 422 28ms userId=1 planId=-
2026-11-05T03:10:53.314-03:00  INFO 468142 --- [           main] [57f4ffe2-2f3e-4861-b218-07aae49dc986] c.l.f.shared.web.RequestLogFilter        : PATCH /api/findraco/user/me/language 422 5ms userId=1 planId=-
```

`cd frontend && test -z "$(grep -rlE 'import \{[^}]*\bformat\b[^}]*\} from "date-fns"' src --include='*.ts' --i` - exit 0

```
(no output)
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='PasswordResetLanguageIT#usesTh` - exit 0

```
2026-11-05T03:11:11.680-03:00  INFO 468668 --- [           main] [] j.LocalContainerEntityManagerFactoryBean : Initialized JPA EntityManagerFactory for persistence unit 'default'
2026-11-05T03:11:11.768-03:00  INFO 468668 --- [           main] [] o.s.d.j.r.query.QueryEnhancerFactories   : Hibernate is in classpath; If applicable, HQL parser will be used.
2026-11-05T03:11:12.494-03:00  INFO 468668 --- [           main] [] eAuthenticationProviderManagerConfigurer : Global AuthenticationManager configured with AuthenticationProvider bean with name authenticationProvider
2026-11-05T03:11:12.495-03:00  WARN 468668 --- [           main] [] r$InitializeUserDetailsManagerConfigurer : Global AuthenticationManager configured with an AuthenticationProvider bean. UserDetailsService beans will not be used by Spring Security for automatically configuring username/password login. Consider removing the AuthenticationProvider bean. Alternatively, consider using the UserDetailsService in a manually instantiated DaoAuthenticationProvider. If the current configuration is intentional, to turn off this warning, increase the logging level of 'org.springframework.security.config.annotation.authentication.configuration.InitializeUserDetailsBeanManagerConfigurer' to ERROR
2026-11-05T03:11:13.644-03:00  INFO 468668 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-05T03:11:13.644-03:00  INFO 468668 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-05T03:11:13.646-03:00  INFO 468668 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 2 ms
2026-11-05T03:11:13.704-03:00  INFO 468668 --- [           main] [] c.l.f.auth.PasswordResetLanguageIT       : Started PasswordResetLanguageIT in 8.261 seconds (process running for 9.44)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
2026-11-05T03:11:14.253-03:00  INFO 468668 --- [           main] [eb9c5d81-acf9-4c36-a377-25a49194e036] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/auth/forgot-password 204 174ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='PasswordResetLanguageIT#usesTh` - exit 0

```
2026-11-05T03:11:32.602-03:00  INFO 469187 --- [           main] [] j.LocalContainerEntityManagerFactoryBean : Initialized JPA EntityManagerFactory for persistence unit 'default'
2026-11-05T03:11:32.694-03:00  INFO 469187 --- [           main] [] o.s.d.j.r.query.QueryEnhancerFactories   : Hibernate is in classpath; If applicable, HQL parser will be used.
2026-11-05T03:11:33.471-03:00  INFO 469187 --- [           main] [] eAuthenticationProviderManagerConfigurer : Global AuthenticationManager configured with AuthenticationProvider bean with name authenticationProvider
2026-11-05T03:11:33.471-03:00  WARN 469187 --- [           main] [] r$InitializeUserDetailsManagerConfigurer : Global AuthenticationManager configured with an AuthenticationProvider bean. UserDetailsService beans will not be used by Spring Security for automatically configuring username/password login. Consider removing the AuthenticationProvider bean. Alternatively, consider using the UserDetailsService in a manually instantiated DaoAuthenticationProvider. If the current configuration is intentional, to turn off this warning, increase the logging level of 'org.springframework.security.config.annotation.authentication.configuration.InitializeUserDetailsBeanManagerConfigurer' to ERROR
2026-11-05T03:11:34.541-03:00  INFO 469187 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-05T03:11:34.542-03:00  INFO 469187 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-05T03:11:34.543-03:00  INFO 469187 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-05T03:11:34.596-03:00  INFO 469187 --- [           main] [] c.l.f.auth.PasswordResetLanguageIT       : Started PasswordResetLanguageIT in 8.032 seconds (process running for 9.187)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-05T03:11:35.162-03:00  INFO 469187 --- [           main] [1376b1cb-e8da-432f-9cd7-5397b07b73a2] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/auth/forgot-password 204 188ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='PasswordResetLanguageIT#fallsB` - exit 0

```
2026-11-05T03:11:54.575-03:00  INFO 469714 --- [           main] [] eAuthenticationProviderManagerConfigurer : Global AuthenticationManager configured with AuthenticationProvider bean with name authenticationProvider
2026-11-05T03:11:54.575-03:00  WARN 469714 --- [           main] [] r$InitializeUserDetailsManagerConfigurer : Global AuthenticationManager configured with an AuthenticationProvider bean. UserDetailsService beans will not be used by Spring Security for automatically configuring username/password login. Consider removing the AuthenticationProvider bean. Alternatively, consider using the UserDetailsService in a manually instantiated DaoAuthenticationProvider. If the current configuration is intentional, to turn off this warning, increase the logging level of 'org.springframework.security.config.annotation.authentication.configuration.InitializeUserDetailsBeanManagerConfigurer' to ERROR
2026-11-05T03:11:55.642-03:00  INFO 469714 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-05T03:11:55.643-03:00  INFO 469714 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-05T03:11:55.644-03:00  INFO 469714 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-05T03:11:55.697-03:00  INFO 469714 --- [           main] [] c.l.f.auth.PasswordResetLanguageIT       : Started PasswordResetLanguageIT in 8.131 seconds (process running for 9.251)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
2026-11-05T03:11:56.256-03:00  INFO 469714 --- [           main] [463671d7-8d7a-472d-9171-95c4857c9b7c] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/auth/forgot-password 204 166ms userId=- planId=-
2026-11-05T03:11:56.273-03:00  INFO 469714 --- [           main] [0c7e5953-6381-4089-ae01-7e09886eb2d4] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/auth/forgot-password 204 11ms userId=- planId=-
2026-11-05T03:11:56.282-03:00  INFO 469714 --- [           main] [adf9bd2d-193f-4e4d-a6ad-24e60de6f6e6] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/auth/forgot-password 204 8ms userId=- planId=-
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q test -Dtest='StatementParserRegistryTest#ambiguo` - exit 0

```
(no output)
```
