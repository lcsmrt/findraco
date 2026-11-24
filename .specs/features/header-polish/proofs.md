# header-polish proofs

**HEAD**: 7d5e888c
**Tree**: clean
**Shell**: /bin/sh
**Result**: 31 pass, 0 fail

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
| C18 | `run walkfix / ✓ src/features/transactions/TransactionsPageView.stories.tsx > Menu Items Phone` | pass |
| C19 | `run walkfix / ✓ src/components/table/TablePagination.stories.tsx > Fits Phone` | pass |
| C20 | `run verifyfix / ✓ src/features/overview/components/MemberFilterChips.stories.tsx > Wrapped Rows Phone` | pass |
| C20 | `run verifyfix / ✓ src/components/periodNavigator/PeriodNavigator.stories.tsx > Wrapped Presets Phone` | pass |
| C21 | `run verifyfix / ✓ src/features/transactions/TransactionsPageView.stories.tsx > Filter Chip Remove Target` | pass |
| C22 | `run verifyfix / ✓ src/components/periodNavigator/PeriodNavigator.stories.tsx > Focus Returns To Label` | pass |
| Build | `cd frontend && pnpm lint` | pass |
| Build | `cd frontend && pnpm build` | pass |
| Build | `cd frontend && node scripts/check-siblings.ts` | pass |

## Output

`Run stories` - exit 0

```
 ✓ |storybook (chromium)| src/features/transactions/TransactionsPageView.stories.tsx > Filter Chip Size Phone 265ms
 ✓ |storybook (chromium)| src/features/transactions/TransactionsPageView.stories.tsx > Filter Chip Remove Target 98ms

 Test Files  5 passed (5)
      Tests  52 passed (52)
   Start at  01:35:52
   Duration  6.08s (transform 0ms, setup 2.82s, collect 2.20s, tests 8.90s, environment 0ms, prepare 11.66s)

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

 ✓ |unit| src/features/transactions/TransactionsPage.test.tsx > TransactionsPage period navigator (PNAV-01, PNAV-02) > replaces a custom range with the This month preset (PNAV-03 AC 1) 250ms
stdout | src/features/transactions/TransactionsPage.test.tsx > TransactionsPage period navigator (PNAV-01, PNAV-02) > ignores the pre-feature from and to params and opens on the current month (PNAV-05)
Creating Table Instance...

 ✓ |unit| src/features/transactions/TransactionsPage.test.tsx > TransactionsPage period navigator (PNAV-01, PNAV-02) > keeps the period when all filters are cleared (PNAV-02 AC 4) 119ms
 ✓ |unit| src/features/transactions/TransactionsPage.test.tsx > TransactionsPage period navigator (PNAV-01, PNAV-02) > ignores the pre-feature from and to params and opens on the current month (PNAV-05) 27ms

 Test Files  1 passed (1)
      Tests  48 passed (48)
   Start at  01:36:00
   Duration  13.18s (transform 694ms, setup 122ms, collect 3.17s, tests 9.36s, environment 342ms, prepare 40ms)

No story files found for the specified pattern: src/**/*.mdx
```

`Run walkfix` - exit 0

```
 ✓ |storybook (chromium)| src/features/transactions/TransactionsPageView.stories.tsx > Action On Title Row 105ms
stdout | src/features/transactions/TransactionsPageView.stories.tsx > Filter Chip Remove Target
Creating Table Instance...
 ✓ |storybook (chromium)| src/features/transactions/TransactionsPageView.stories.tsx > Filter Chip Size Phone 254ms
 ✓ |storybook (chromium)| src/features/transactions/TransactionsPageView.stories.tsx > Filter Chip Remove Target 93ms

 Test Files  2 passed (2)
      Tests  24 passed (24)
   Start at  01:36:15
   Duration  5.25s (transform 0ms, setup 1.04s, collect 795ms, tests 3.77s, environment 0ms, prepare 4.30s)

No story files found for the specified pattern: src/**/*.mdx
stderr | src/features/transactions/TransactionsPageView.stories.tsx > More Actions Menu
You are using Testing Library's `screen` object. Use `within(canvasElement)` instead.
More info: https://storybook.js.org/docs/writing-tests/interaction-testing?ref=error
```

`Run verifyfix` - exit 0

```
 ✓ |storybook (chromium)| src/features/transactions/TransactionsPageView.stories.tsx > Filter Chip Size Phone 254ms
 ✓ |storybook (chromium)| src/features/transactions/TransactionsPageView.stories.tsx > Filter Chip Remove Target 97ms

 Test Files  3 passed (3)
      Tests  36 passed (36)
   Start at  01:36:22
   Duration  5.36s (transform 0ms, setup 1.30s, collect 1.44s, tests 6.51s, environment 0ms, prepare 6.24s)

No story files found for the specified pattern: src/**/*.mdx
stderr | src/components/periodNavigator/PeriodNavigator.stories.tsx > Panel Popover
You are using Testing Library's `screen` object. Use `within(canvasElement)` instead.
More info: https://storybook.js.org/docs/writing-tests/interaction-testing?ref=error
stderr | src/features/transactions/TransactionsPageView.stories.tsx > More Actions Menu
You are using Testing Library's `screen` object. Use `within(canvasElement)` instead.
More info: https://storybook.js.org/docs/writing-tests/interaction-testing?ref=error
```
