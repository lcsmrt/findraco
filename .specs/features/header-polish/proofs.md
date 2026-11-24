# header-polish proofs

**HEAD**: f394140f
**Tree**: clean
**Shell**: /bin/sh
**Result**: 25 pass, 0 fail

| Check | Proof | Result |
| --- | --- | --- |
| C1 | `run stories / ✓ src/components/periodNavigator/PeriodNavigator.stories.tsx > Arrows And Label Only` | pass |
| C2 | `run stories / ✓ src/components/periodNavigator/PeriodNavigator.stories.tsx > Panel Popover` | pass |
| C3 | `run stories / ✓ src/components/periodNavigator/PeriodNavigator.stories.tsx > Panel Sheet Phone` | pass |
| C4 | `run stories / ✓ src/components/periodNavigator/PeriodNavigator.stories.tsx > Preset Applies` | pass |
| C4 | `run stories / ✓ src/components/periodNavigator/PeriodNavigator.stories.tsx > Range Applies` | pass |
| C5 | `run stories / ✓ src/components/periodNavigator/PeriodNavigator.stories.tsx > Arrows Step` | pass |
| C6 | `run stories / ✓ src/components/periodNavigator/PeriodNavigator.stories.tsx > Spans Width Phone` | pass |
| C7 | `run stories / ✓ src/features/transactions/TransactionsPageView.stories.tsx > More Actions Menu` | pass |
| C8 | `run stories / ✓ src/features/transactions/TransactionsPageView.stories.tsx > Importing Disabled` | pass |
| C8 | `run stories / ✓ src/features/transactions/TransactionsPageView.stories.tsx > Viewer Has No Review` | pass |
| C9 | `run stories / ✓ src/features/transactions/TransactionsPageView.stories.tsx > Review Notice` | pass |
| C10 | `run unit / ✓ src/features/transactions/TransactionsPage.test.tsx > shows the review notice with the candidates` | pass |
| C10 | `run unit / ✓ src/features/transactions/TransactionsPage.test.tsx > shows no review notice to a viewer` | pass |
| C11 | `run stories / ✓ src/features/transactions/TransactionsPageView.stories.tsx > Edges Aligned` | pass |
| C12 | `run stories / ✓ src/features/plans/PlansPageView.stories.tsx > No Description` | pass |
| C13 | `run stories / ✓ src/features/categories/CategoriesPageView.stories.tsx > Action On Title Row` | pass |
| C13 | `run stories / ✓ src/features/plans/PlansPageView.stories.tsx > Action On Title Row` | pass |
| C13 | `run stories / ✓ src/features/transactions/TransactionsPageView.stories.tsx > Action On Title Row` | pass |
| C14 | `run stories / ✓ src/features/overview/components/MemberFilterChips.stories.tsx > Chip Size Phone` | pass |
| C15 | `run stories / ✓ src/features/transactions/TransactionsPageView.stories.tsx > Filter Chip Size Phone` | pass |
| C16 | `run stories / ✓ src/features/overview/components/MemberFilterChips.stories.tsx > Chip Size Desktop` | pass |
| C17 | `walk - each page at both widths` | pass (Walked) |
| Build | `cd frontend && pnpm lint` | pass |
| Build | `cd frontend && pnpm build` | pass |
| Build | `cd frontend && node scripts/check-siblings.ts` | pass |

## Output

`Run stories` - exit 0

```
 ✓ |storybook (chromium)| src/features/transactions/TransactionsPageView.stories.tsx > Action On Title Row 106ms
 ✓ |storybook (chromium)| src/features/transactions/TransactionsPageView.stories.tsx > Filter Chip Size Phone 268ms

 Test Files  5 passed (5)
      Tests  47 passed (47)
   Start at  00:59:16
   Duration  5.68s (transform 0ms, setup 2.68s, collect 2.16s, tests 7.40s, environment 0ms, prepare 10.76s)

No story files found for the specified pattern: src/**/*.mdx
stderr | src/components/periodNavigator/PeriodNavigator.stories.tsx > Panel Popover
You are using Testing Library's `screen` object. Use `within(canvasElement)` instead.
More info: https://storybook.js.org/docs/writing-tests/interaction-testing?ref=error
stderr | src/features/transactions/TransactionsPageView.stories.tsx > More Actions Menu
You are using Testing Library's `screen` object. Use `within(canvasElement)` instead.
More info: https://storybook.js.org/docs/writing-tests/interaction-testing?ref=error
```

`Run unit` - exit 0

```
Creating Table Instance...

 ✓ |unit| src/features/transactions/TransactionsPage.test.tsx > TransactionsPage period navigator (PNAV-01, PNAV-02) > replaces a custom range with the This month preset (PNAV-03 AC 1) 238ms
stdout | src/features/transactions/TransactionsPage.test.tsx > TransactionsPage period navigator (PNAV-01, PNAV-02) > ignores the pre-feature from and to params and opens on the current month (PNAV-05)
Creating Table Instance...

 ✓ |unit| src/features/transactions/TransactionsPage.test.tsx > TransactionsPage period navigator (PNAV-01, PNAV-02) > keeps the period when all filters are cleared (PNAV-02 AC 4) 141ms
 ✓ |unit| src/features/transactions/TransactionsPage.test.tsx > TransactionsPage period navigator (PNAV-01, PNAV-02) > ignores the pre-feature from and to params and opens on the current month (PNAV-05) 25ms

 Test Files  1 passed (1)
      Tests  48 passed (48)
   Start at  00:59:24
   Duration  13.19s (transform 669ms, setup 99ms, collect 3.21s, tests 9.36s, environment 328ms, prepare 42ms)

No story files found for the specified pattern: src/**/*.mdx
```
