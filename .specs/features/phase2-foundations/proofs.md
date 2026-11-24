# phase2-foundations proofs

**HEAD**: d1402c10
**Tree**: clean
**Shell**: /bin/sh
**Result**: 63 pass, 0 fail

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
| C45 | `run verifyfix / ✓ src/features/plans/components/DeletePlanPermanentlyDialogView.stories.tsx > Focus Ring` | pass |
| C45 | `run verifyfix / ✓ src/components/input/CurrencyInput.stories.tsx > Invalid Focus Ring` | pass |
| C46 | `cd frontend && ! grep -rnE --include=*.ts --include=*.tsx 'ring-(ring/destructive)/' src / grep -v -E '\.stori` | pass |
| C47 | `run verifyfix / ✓ src/components/input/CurrencyInput.stories.tsx > Dark Field Contrast` | pass |
| C48 | `run verifyfix / ✓ src/features/overview/components/MemberFilterChips.stories.tsx > Touch Target` | pass |
| C49 | `run stories / ✓ src/features/transactions/components/TransactionCells.stories.tsx > Status Colours And Icons` | pass |
| C49 | `run stories / ✓ src/features/plans/components/PlanInvitationsListView.stories.tsx > Status Colours And Icons` | pass |
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
    at DemoMultiCombobox (http://localhost:63315/home/lcs/dev/findraco/frontend/src/components/input/StandardMultiCombobox.stories.tsx?import&browserv=1795488251335:40:30)
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
 ✓ |storybook (chromium)| src/features/transactions/TransactionsPageView.stories.tsx > With Review 112ms
 ✓ |storybook (chromium)| src/features/transactions/TransactionsPageView.stories.tsx > Importing 108ms

 Test Files  5 passed (5)
      Tests  46 passed (46)
   Start at  23:44:21
   Duration  4.82s (transform 0ms, setup 2.66s, collect 2.62s, tests 6.73s, environment 0ms, prepare 10.57s)

No story files found for the specified pattern: src/**/*.mdx
stderr | src/app/layout/NavbarView.stories.tsx > Signed In
You are using Testing Library's `screen` object. Use `within(canvasElement)` instead.
More info: https://storybook.js.org/docs/writing-tests/interaction-testing?ref=error
stderr | src/features/transactions/components/TransactionFilterPopoverView.stories.tsx > Open Shared Plan
You are using Testing Library's `screen` object. Use `within(canvasElement)` instead.
More info: https://storybook.js.org/docs/writing-tests/interaction-testing?ref=error
```

`Run verifyfix` - exit 0

```
 ✓ |storybook (chromium)| src/features/overview/components/MemberFilterChips.stories.tsx > One Selected 40ms
 ✓ |storybook (chromium)| src/features/overview/components/MemberFilterChips.stories.tsx > Many Members 43ms
 ✓ |storybook (chromium)| src/components/input/CurrencyInput.stories.tsx > Invalid Focus Ring 260ms
 ✓ |storybook (chromium)| src/components/input/CurrencyInput.stories.tsx > Dark Field Contrast 41ms
 ✓ |storybook (chromium)| src/features/plans/components/DeletePlanPermanentlyDialogView.stories.tsx > Focus Ring 264ms

 Test Files  3 passed (3)
      Tests  11 passed (11)
   Start at  23:44:28
   Duration  2.47s (transform 0ms, setup 1.32s, collect 804ms, tests 2.05s, environment 0ms, prepare 6.17s)

No story files found for the specified pattern: src/**/*.mdx
stderr | src/features/plans/components/DeletePlanPermanentlyDialogView.stories.tsx > Exact Name Required
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
2026-11-23T23:45:03.668-03:00  INFO 2574325 --- [           main] [28cd9369-4b7d-4678-b087-22d3c32d98e2] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan 200 65ms userId=1 planId=-
2026-11-23T23:45:03.812-03:00  INFO 2574325 --- [           main] [c09e53c0-ec5a-4f66-bcf6-b58ef8a2b68a] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/user 201 35ms userId=- planId=-
2026-11-23T23:45:03.822-03:00  INFO 2574325 --- [           main] [ac08b40e-920d-4335-a0aa-ccab78b3a1bf] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan 200 6ms userId=1 planId=-
2026-11-23T23:45:03.897-03:00  INFO 2574325 --- [           main] [358822b0-cd09-4b91-b647-f07b1a5fd05e] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/user 201 31ms userId=- planId=-
2026-11-23T23:45:03.906-03:00  INFO 2574325 --- [           main] [b88fb6b5-fc13-44ca-ba40-58e3e7fee627] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan 200 5ms userId=1 planId=-
2026-11-23T23:45:03.982-03:00  INFO 2574325 --- [           main] [faae26dd-979e-4028-ae09-9445d2c032c1] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/user 201 30ms userId=- planId=-
2026-11-23T23:45:03.995-03:00  INFO 2574325 --- [           main] [16346042-d077-409c-a845-ed2982611178] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan 200 7ms userId=1 planId=-
2026-11-23T23:45:04.067-03:00  INFO 2574325 --- [           main] [3e4cbfe1-0f1c-4b01-b96b-661a7dd97272] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/user 201 32ms userId=- planId=-
2026-11-23T23:45:04.075-03:00  INFO 2574325 --- [           main] [af5889db-cdd3-4ab0-9ecc-938f705f6fb3] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan 200 5ms userId=1 planId=-
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SignUpDefaultsIT#storesDeviceT` - exit 0

```
2026-11-23T23:45:32.751-03:00  INFO 2574830 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable prompts capabilities, notification: true
2026-11-23T23:45:32.752-03:00  INFO 2574830 --- [           main] [] o.s.a.m.s.c.a.McpServerAutoConfiguration : Enable completions capabilities
2026-11-23T23:45:32.896-03:00  INFO 2574830 --- [           main] [] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-23T23:45:32.897-03:00  INFO 2574830 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-23T23:45:32.898-03:00  INFO 2574830 --- [           main] [] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-23T23:45:32.964-03:00  INFO 2574830 --- [           main] [] com.lcs.findraco.user.SignUpDefaultsIT   : Started SignUpDefaultsIT in 9.625 seconds (process running for 10.906)
2026-11-23T23:45:33.643-03:00  INFO 2574830 --- [           main] [8cf5447e-41cb-496c-965b-c49fc7b144e0] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/user 201 333ms userId=- planId=-
2026-11-23T23:45:33.823-03:00  INFO 2574830 --- [           main] [bb62e6dd-a508-454b-bdcc-eb5983e72b73] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/user 201 41ms userId=- planId=-
2026-11-23T23:45:33.884-03:00  INFO 2574830 --- [           main] [e2f70c1e-ae27-4e96-8fdb-e7cf0d872d3b] c.l.f.shared.web.RequestLogFilter        : POST /api/findraco/user 201 27ms userId=- planId=-
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SignUpDefaultsIT#namesRecovere` - exit 0

```
2026-11-23T23:46:02.032-03:00  INFO 2575375 --- [           main] [] com.lcs.findraco.user.SignUpDefaultsIT   : Started SignUpDefaultsIT in 9.705 seconds (process running for 10.989)
2026-11-23T23:46:02.652-03:00  INFO 2575375 --- [           main] [e47e3695-125b-46c2-93e1-b00b29edc971] c.l.f.shared.web.RequestLogFilter        : PATCH /api/findraco/user/me/language 200 141ms userId=2 planId=-
2026-11-23T23:46:02.792-03:00  INFO 2575375 --- [           main] [aeedca73-5fd1-4cad-b01a-0f192ede8c14] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{id}/members/{userId} 204 133ms userId=1 planId=-
2026-11-23T23:46:02.811-03:00  INFO 2575375 --- [           main] [84b10020-a9bd-4494-a3e2-bc5cfdb10859] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan 200 11ms userId=2 planId=-
2026-11-23T23:46:02.937-03:00  INFO 2575375 --- [           main] [1b9d55e8-9500-4dc8-8fe9-6148dda6fb04] c.l.f.shared.web.RequestLogFilter        : PATCH /api/findraco/user/me/language 200 12ms userId=2 planId=-
2026-11-23T23:46:02.955-03:00  INFO 2575375 --- [           main] [13b36fab-76a0-462d-ae10-743913f7454a] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{id}/members/{userId} 204 16ms userId=1 planId=-
2026-11-23T23:46:02.964-03:00  INFO 2575375 --- [           main] [8309c980-c097-4675-9f03-85e8eaac127c] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan 200 5ms userId=2 planId=-
2026-11-23T23:46:03.034-03:00  INFO 2575375 --- [           main] [eda23c4d-3abc-4e58-ae99-c52e8fa02dfc] c.l.f.shared.web.RequestLogFilter        : DELETE /api/findraco/plan/{id}/members/{userId} 204 19ms userId=1 planId=-
2026-11-23T23:46:03.043-03:00  INFO 2575375 --- [           main] [188c12b6-e6a1-495f-96b2-fd2fd4b6cde4] c.l.f.shared.web.RequestLogFilter        : GET /api/findraco/plan 200 5ms userId=2 planId=-
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build as described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (/home/lcs/.m2/repository/net/bytebuddy/byte-buddy-agent/1.18.15/byte-buddy-agent-1.18.15.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd frontend && ! grep -rnE --include=*.ts --include=*.tsx 'ring-(ring/destructive)/' src / grep -v -E '\.stori` - exit 0

```
(no output)
```
