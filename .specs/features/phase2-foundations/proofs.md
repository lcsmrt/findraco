# phase2-foundations proofs

**HEAD**: 1832920a
**Tree**: clean
**Shell**: /bin/sh
**Result**: 56 pass, 0 fail

| Check | Proof | Result |
| --- | --- | --- |
| C1 | `run stories / ✓ src/features/transactions/components/TransactionCells.stories.tsx > Forecast Badge` | pass |
| C2 | `run stories / ✓ src/features/transactions/components/TransactionMobileList.stories.tsx > Forecast Badge` | pass |
| C3 | `run stories / ✓ src/features/transactions/components/TransactionCells.stories.tsx > Pending Badge` | pass |
| C4 | `run stories / ✓ src/features/transactions/components/TransactionMobileList.stories.tsx > Pending Badge` | pass |
| C5 | `run stories / ✓ src/features/transactions/components/TransactionCells.stories.tsx > Category Tag` | pass |
| C6 | `cd frontend && test "$(grep -rl --include=*.tsx 'variant="tag"' src / grep -v -E '\.stories\./\.test\.//base/'` | pass |
| C7 | `run stories / ✓ src/features/transactions/components/TransactionBadges.stories.tsx > Items Count` | pass |
| C8 | `run stories / ✓ src/features/transactions/components/TransactionBadges.stories.tsx > Order` | pass |
| C9 | `run stories / ✓ src/features/transactions/components/TransactionCells.stories.tsx > Badge Row` | pass |
| C9 | `run stories / ✓ src/features/transactions/components/TransactionMobileList.stories.tsx > Badge Row` | pass |
| C10 | `run stories / ✓ src/features/transactions/components/TransactionCells.stories.tsx > Meta Badges` | pass |
| C11 | `run stories / ✓ src/features/plans/PlansPageView.stories.tsx > Meta Badges` | pass |
| C12 | `run stories / ✓ src/features/transactions/components/EndDateField.stories.tsx > Meta Badges` | pass |
| C13 | `run stories / ✓ src/features/plans/components/PlanTrashListView.stories.tsx > Meta Badges` | pass |
| C14 | `run stories / ✓ src/features/overview/components/CategorySpendingList.stories.tsx > Meta Badges` | pass |
| C15 | `run stories / ✓ src/features/transactions/components/TransactionFilterPopoverView.stories.tsx > Meta Badges` | pass |
| C16 | `run stories / ✓ src/components/input/StandardMultiCombobox.stories.tsx > Meta Badges` | pass |
| C17 | `run stories / ✓ src/features/plans/components/PlanInvitationsListView.stories.tsx > Status Badges` | pass |
| C18 | `cd frontend && ! grep -nE -- '--(chart-[0-9]/sidebar/font-serif)' src/index.css && ! grep -nE '^\s*(default/se` | pass |
| C19 | `cd frontend && node -e "const css=require('fs').readFileSync('src/index.css','utf8');const block=(sel)=>css.sl` | pass |
| C20 | `cd frontend && ! grep -rn --include=*.ts --include=*.tsx 'ring-ring/' src / grep -v -E '\.stories\./\.test\.'` | pass |
| C21 | `run stories / ✓ src/features/transactions/TransactionsPageView.stories.tsx > Focus Ring` | pass |
| C22 | `run stories / ✓ src/features/transactions/components/TransactionMobileList.stories.tsx > Row Focus` | pass |
| C23 | `run stories / ✓ src/features/categories/components/CategoryTreeRow.stories.tsx > Row Focus` | pass |
| C23 | `run stories / ✓ src/features/overview/components/CategorySpendingList.stories.tsx > Row Focus` | pass |
| C24 | `cd frontend && node -e "const css=require('fs').readFileSync('src/index.css','utf8');const i=css.indexOf('pref` | pass |
| C25 | `run stories / ✓ src/features/transactions/TransactionsPageView.stories.tsx > Touch Targets` | pass |
| C26 | `run stories / ✓ src/features/categories/components/CategoryLimitFields.stories.tsx > Touch Targets` | pass |
| C27 | `run stories / ✓ src/features/transactions/components/TransactionFilterPopoverView.stories.tsx > Touch Targets` | pass |
| C28 | `run stories / ✓ src/components/input/StandardCombobox.stories.tsx > Touch Target` | pass |
| C29 | `run stories / ✓ src/features/transactions/TransactionsPageView.stories.tsx > Desktop Sizes` | pass |
| C30 | `run stories / ✓ src/features/overview/OverviewPageView.stories.tsx > Page Title` | pass |
| C30 | `run stories / ✓ src/features/transactions/TransactionsPageView.stories.tsx > Page Title` | pass |
| C30 | `run stories / ✓ src/features/categories/CategoriesPageView.stories.tsx > Page Title` | pass |
| C30 | `run stories / ✓ src/features/plans/PlansPageView.stories.tsx > Page Title` | pass |
| C31 | `run stories / ✓ src/app/layout/MainLayoutView.stories.tsx > Content Width` | pass |
| C32 | `run stories / ✓ src/features/categories/CategoriesPageView.stories.tsx > Header Actions` | pass |
| C32 | `run stories / ✓ src/features/plans/PlansPageView.stories.tsx > Header Actions` | pass |
| C33 | `run unit / ✓ src/app/layout/MainLayout.test.tsx > opens the new transaction form from the Categories page` | pass |
| C34 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SignUpDefaultsIT#namesFirstPla` | pass |
| C35 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SignUpDefaultsIT#storesDeviceT` | pass |
| C36 | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SignUpDefaultsIT#namesRecovere` | pass |
| C37 | `run unit / ✓ src/utils/percent.test.ts > formatPercent > writes 61.8 as "61,8%" in pt-BR` | pass |
| C37 | `run unit / ✓ src/utils/percent.test.ts > formatPercent > writes 61.8 as "61.8%" in en` | pass |
| C37 | `run unit / ✓ src/utils/percent.test.ts > formatPercent > writes 50 as "50%" in pt-BR` | pass |
| C38 | `run stories / ✓ src/features/categories/components/CategoryLimitFields.stories.tsx > Share Percent` | pass |
| C39 | `walk - Overview, Transactions, Categories and Plans at both widths, plus a sign-up with a pt-BR browser` | pass (Walked) |
| C40 | `run walkfix / ✓ src/app/layout/NavbarView.stories.tsx > Avatar Focus And Size` | pass |
| C41 | `run walkfix / ✓ src/features/transactions/TransactionsPageView.stories.tsx > Icon Button Targets` | pass |
| C42 | `run walkfix / ✓ src/features/transactions/components/TransactionFilterPopoverView.stories.tsx > Checkbox Targe` | pass |
| C43 | `run walkfix / ✓ src/features/transactions/components/TransactionMobileList.stories.tsx > Title Not Squeezed` | pass |
| C44 | `run walkfix / ✓ src/features/plans/PlansPageView.stories.tsx > Members Header Phone` | pass |
| Build | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -DskipITs -Dsurefire.skip=true` | pass |
| Build | `cd frontend && pnpm lint` | pass |
| Build | `cd frontend && pnpm build` | pass |
| Build | `cd frontend && node scripts/check-siblings.ts` | pass |

## Output

`Run stories` - exit 0

```
You are using Testing Library's `screen` object. Use `within(canvasElement)` instead.
More info: https://storybook.js.org/docs/writing-tests/interaction-testing?ref=error
stderr | src/components/input/StandardMultiCombobox.stories.tsx > Empty
Base UI: A component that acts as a button expected a native <button> because the `nativeButton` prop is true. Rendering a non-<button> removes native button semantics, which can impact forms and accessibility. Use a real <button> in the `render` prop, or set `nativeButton` to `false`.
    at ComboboxTrigger (http://localhost:63315/src/components/input/base/Combobox.tsx:27:26)
    at StandardMultiCombobox (http://localhost:63315/src/components/input/StandardMultiCombobox.tsx:74:109)
    at DemoMultiCombobox (http://localhost:63315/home/lcs/dev/findraco/frontend/src/components/input/StandardMultiCombobox.stories.tsx?import&browserv=1795487377606:40:30)
    at Object.render [as originalStoryFn] (http://localhost:63315/node_modules/.cache/storybook/ec9f39a437a8e0c0ecea7eb59c54222578b7a99d74078d0582f739c2ac87764b/sb-vitest/deps/@storybook_react-vite.js?v=764c4b0d:850:32)
    at undecoratedStoryFn (http://localhost:63315/node_modules/.cache/storybook/ec9f39a437a8e0c0ecea7eb59c54222578b7a99d74078d0582f739c2ac87764b/sb-vitest/deps/chunk-ATJ2VNVK.js?v=764c4b0d:8253:44)
    at hookified (http://localhost:63315/node_modules/.cache/storybook/ec9f39a437a8e0c0ecea7eb59c54222578b7a99d74078d0582f739c2ac87764b/sb-vitest/deps/chunk-ATJ2VNVK.js?v=764c4b0d:7396:13)
    at http://localhost:63315/node_modules/.cache/storybook/ec9f39a437a8e0c0ecea7eb59c54222578b7a99d74078d0582f739c2ac87764b/sb-vitest/deps/@storybook_react-vite.js?v=764c4b0d:41:86
    at http://localhost:63315/node_modules/.cache/storybook/ec9f39a437a8e0c0ecea7eb59c54222578b7a99d74078d0582f739c2ac87764b/sb-vitest/deps/chunk-ATJ2VNVK.js?v=764c4b0d:8193:8
stderr | src/components/input/StandardMultiCombobox.stories.tsx > Empty
You are using Testing Library's `screen` object. Use `within(canvasElement)` instead.
More info: https://storybook.js.org/docs/writing-tests/interaction-testing?ref=error
```

`Run unit` - exit 0

```
       please check the style of container, or the props width(100%) and height(100%),
       or add a minWidth(0) or minHeight(undefined) or use aspect(undefined) to control the
       height and width.

stderr | src/app/layout/MainLayout.test.tsx > MainLayout global add > switching from an EDITOR plan to a VIEWER plan hides the add without a reload (NAV-02 edge)
The width(0) and height(0) of chart should be greater than 0,
       please check the style of container, or the props width(100%) and height(100%),
       or add a minWidth(0) or minHeight(undefined) or use aspect(undefined) to control the
       height and width.

stderr | src/app/layout/MainLayout.test.tsx > MainLayout global add > switching from an EDITOR plan to a VIEWER plan hides the add without a reload (NAV-02 edge)
The width(0) and height(0) of chart should be greater than 0,
       please check the style of container, or the props width(100%) and height(100%),
       or add a minWidth(0) or minHeight(undefined) or use aspect(undefined) to control the
       height and width.
```

`Run walkfix` - exit 0

```
 ✓ |storybook (chromium)| src/features/transactions/TransactionsPageView.stories.tsx > With Review 114ms
 ✓ |storybook (chromium)| src/features/transactions/TransactionsPageView.stories.tsx > Importing 131ms

 Test Files  5 passed (5)
      Tests  46 passed (46)
   Start at  23:29:49
   Duration  5.90s (transform 0ms, setup 3.38s, collect 3.11s, tests 8.11s, environment 0ms, prepare 12.58s)

No story files found for the specified pattern: src/**/*.mdx
stderr | src/app/layout/NavbarView.stories.tsx > Signed In
You are using Testing Library's `screen` object. Use `within(canvasElement)` instead.
More info: https://storybook.js.org/docs/writing-tests/interaction-testing?ref=error
stderr | src/features/transactions/components/TransactionFilterPopoverView.stories.tsx > Open Shared Plan
You are using Testing Library's `screen` object. Use `within(canvasElement)` instead.
More info: https://storybook.js.org/docs/writing-tests/interaction-testing?ref=error
```

`cd frontend && test "$(grep -rl --include=*.tsx 'variant="tag"' src / grep -v -E '\.stories\./\.test\.//base/'` - exit 0

```
(no output)
```

`cd frontend && ! grep -nE -- '--(chart-[0-9]/sidebar/font-serif)' src/index.css && ! grep -nE '^\s*(default/se` - exit 0

```
(no output)
```

`cd frontend && node -e "const css=require('fs').readFileSync('src/index.css','utf8');const block=(sel)=>css.sl` - exit 0

```
(no output)
```

`cd frontend && ! grep -rn --include=*.ts --include=*.tsx 'ring-ring/' src / grep -v -E '\.stories\./\.test\.'` - exit 0

```
(no output)
```

`cd frontend && node -e "const css=require('fs').readFileSync('src/index.css','utf8');const i=css.indexOf('pref` - exit 0

```
(no output)
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SignUpDefaultsIT#namesFirstPla` - exit 0

```
2026-11-23T23:30:24.096-03:00  INFO 2562967 --- [           main] [cd0cfd4e-1daf-48bc-be5c-1bd15cc2857b] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan 200 61ms userId=1 planId=-
2026-11-23T23:30:24.257-03:00  INFO 2562967 --- [           main] [27c03432-fe7a-4e6f-912b-446c67634594] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/user 201 41ms userId=- planId=-
2026-11-23T23:30:24.268-03:00  INFO 2562967 --- [           main] [5cb4f215-f605-4857-ae55-2907fb170bf1] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan 200 6ms userId=1 planId=-
2026-11-23T23:30:24.353-03:00  INFO 2562967 --- [           main] [babaf21e-43d7-4b0a-abf8-dd410d23053e] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/user 201 39ms userId=- planId=-
2026-11-23T23:30:24.365-03:00  INFO 2562967 --- [           main] [131ef192-187e-42cb-8948-0f9fb439076c] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan 200 7ms userId=1 planId=-
2026-11-23T23:30:24.441-03:00  INFO 2562967 --- [           main] [1d603c48-3524-4b51-b462-aa1f2e5c3fd6] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/user 201 31ms userId=- planId=-
2026-11-23T23:30:24.452-03:00  INFO 2562967 --- [           main] [2c0240ca-f2bb-4d06-a1fa-b0a2d6d211fd] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan 200 7ms userId=1 planId=-
2026-11-23T23:30:24.521-03:00  INFO 2562967 --- [           main] [e91c0829-810a-44d2-8188-ab0bd70dfabe] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/user 201 28ms userId=- planId=-
2026-11-23T23:30:24.532-03:00  INFO 2562967 --- [           main] [fadb50e4-dd4e-483a-a8c6-9fd4f162aba8] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan 200 7ms userId=1 planId=-
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SignUpDefaultsIT#storesDeviceT` - exit 0

```
2026-11-23T23:30:52.284-03:00  INFO 2563481 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable prompts capabilities, notification: true
2026-11-23T23:30:52.286-03:00  INFO 2563481 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable completions capabilities
2026-11-23T23:30:52.422-03:00  INFO 2563481 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-23T23:30:52.422-03:00  INFO 2563481 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-23T23:30:52.423-03:00  INFO 2563481 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-23T23:30:52.485-03:00  INFO 2563481 --- [           main] [] com.lcs.findraco.user.SignUpDefaultsIT   : Started SignUpDefaultsIT in 9.987 seconds (process running for 11.256)
2026-11-23T23:30:53.190-03:00  INFO 2563481 --- [           main] [13e5e39f-8154-41d0-b879-8866e573a12d] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/user 201 344ms userId=- planId=-
2026-11-23T23:30:53.369-03:00  INFO 2563481 --- [           main] [fa5eb1cf-66e1-4ed8-9001-e16414017e64] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/user 201 39ms userId=- planId=-
2026-11-23T23:30:53.440-03:00  INFO 2563481 --- [           main] [05248bac-1766-4460-858f-f6770ebfad94] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/user 201 36ms userId=- planId=-
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SignUpDefaultsIT#namesRecovere` - exit 0

```
2026-11-23T23:31:21.272-03:00  INFO 2563938 --- [           main] [] com.lcs.findraco.user.SignUpDefaultsIT   : Started SignUpDefaultsIT in 9.886 seconds (process running for 11.146)
2026-11-23T23:31:21.922-03:00  INFO 2563938 --- [           main] [a5563d25-b304-4530-8028-06ee0bd34d17] c.l.f.shared.web.RequestLogFilter        : PATCH /api/findraco/user/me/language 200 132ms userId=2 planId=-
2026-11-23T23:31:22.042-03:00  INFO 2563938 --- [           main] [f447e55c-468f-4194-85f4-8f415c36cdf4] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{id}/members/{userId} 204 114ms userId=1 planId=-
2026-11-23T23:31:22.058-03:00  INFO 2563938 --- [           main] [cde31649-3039-4e03-9b12-8e21d7453751] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan 200 11ms userId=2 planId=-
2026-11-23T23:31:22.195-03:00  INFO 2563938 --- [           main] [cf1c6b1d-492d-4b39-bae9-e2f3de7d00a5] c.l.f.shared.web.RequestLogFilter        : PATCH /api/findraco/user/me/language 200 8ms userId=2 planId=-
2026-11-23T23:31:22.217-03:00  INFO 2563938 --- [           main] [d1e75e58-337f-44d4-9938-db12500f69d7] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{id}/members/{userId} 204 20ms userId=1 planId=-
2026-11-23T23:31:22.229-03:00  INFO 2563938 --- [           main] [738b3a7b-10dc-4377-809c-b5905b2f8cb5] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan 200 8ms userId=2 planId=-
2026-11-23T23:31:22.300-03:00  INFO 2563938 --- [           main] [c0d224d6-c93e-46dd-83a4-8ea1e9cba939] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{id}/members/{userId} 204 14ms userId=1 planId=-
2026-11-23T23:31:22.310-03:00  INFO 2563938 --- [           main] [39c22ae1-f6c7-41f7-8a83-971945f3c4ee] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan 200 6ms userId=2 planId=-
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```
