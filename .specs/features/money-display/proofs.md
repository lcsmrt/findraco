# money-display proofs

**HEAD**: 27f037b3
**Tree**: clean
**Shell**: /bin/sh
**Result**: 42 pass, 0 fail

| Check | Proof | Result |
| --- | --- | --- |
| C1 | `run critical / ✓ src/utils/money.test.ts > formatMoney > writes a negative with U+2212` | pass |
| C1 | `run critical / ✓ src/utils/money.test.ts > formatMoney > writes a value that rounds to zero without a minus` | pass |
| C1 | `run critical / ✓ src/utils/money.test.ts > formatMoney > writes a compact negative with U+2212` | pass |
| C2 | `run stories / ✓ src/components/money/Money.stories.tsx > Formats` | pass |
| C3 | `run stories / ✓ src/components/money/Money.stories.tsx > Typeface` | pass |
| C4 | `run stories / ✓ src/components/money/Money.stories.tsx > Tones` | pass |
| C5 | `run stories / ✓ src/components/money/Money.stories.tsx > Large Value` | pass |
| C6 | `run stories / ✓ src/features/transactions/components/ItemsField.stories.tsx > Over Allocated` | pass |
| C7 | `run stories / ✓ src/features/transactions/components/TransactionCells.stories.tsx > Money Amounts` | pass |
| C8 | `run stories / ✓ src/features/transactions/components/TransactionMobileList.stories.tsx > Money Amounts` | pass |
| C9 | `run stories / ✓ src/features/transactions/components/NeutralReviewListView.stories.tsx > Money Amounts` | pass |
| C10 | `run stories / ✓ src/features/plans/components/PlanTrashListView.stories.tsx > Money Amounts` | pass |
| C11 | `run stories / ✓ src/features/transactions/TransactionsPageView.stories.tsx > Amount Column Aligned` | pass |
| C12 | `run stories / ✓ src/features/transactions/components/TransactionCells.stories.tsx > Edit Amount Typeface` | pass |
| C13 | `run stories / ✓ src/features/overview/components/SummaryCards.stories.tsx > Figure Sizes` | pass |
| C14 | `run stories / ✓ src/features/overview/components/SummaryCards.stories.tsx > Readable Figures` | pass |
| C15 | `run stories / ✓ src/features/overview/components/CategorySpendingList.stories.tsx > Readable Figures` | pass |
| C16 | `run stories / ✓ src/features/overview/components/MonthlyTrendChart.stories.tsx > Tooltip` | pass |
| C17 | `run stories / ✓ src/features/categories/components/CategoryTreeRow.stories.tsx > Readable Figures` | pass |
| C18 | `run stories / ✓ src/features/categories/components/CategoryLimitFields.stories.tsx > Share Percent` | pass |
| C19 | `cd frontend && node -e "import('./src/components/typography/base/typographyVariants.ts').then(({ typographyVar` | pass |
| C20 | `cd frontend && printf 'import { formatMoney } from "@/utils/money";\n\nexport function Probe() {\n  return <sp` | pass |
| C21 | `cd frontend && out=$(printf 'import { useTranslation } from "react-i18next";\nimport { formatMoney } from "@/u` | pass |
| C22 | `cd frontend && ! grep -rnE "font-mono/jetbrains-mono/function Amount\b" src package.json && test ! -e src/comp` | pass |
| C23 | `walk - open Overview, Transactions and Categories at those widths on the local stack` | pass (Walked) |
| C24 | `run stories / ✓ src/features/overview/components/MonthlyTrendChart.stories.tsx > Tooltip Spacing` | pass |
| C25 | `run stories / ✓ src/features/transactions/TransactionsPageView.stories.tsx > Amount Header Label Aligned` | pass |
| C26 | `run stories / ✓ src/features/overview/components/MonthlyTrendChart.stories.tsx > Tooltip Zero` | pass |
| C27 | `run stories / ✓ src/components/money/Money.stories.tsx > Half Cent Tone` | pass |
| C27 | `run critical / ✓ src/utils/money.test.ts > formatMoney > says -0.005 shows as negative: true` | pass |
| C27 | `run critical / ✓ src/utils/money.test.ts > formatMoney > says -0.004 shows as negative: false` | pass |
| C28 | `run tooling / ✓ eslint.config.test.ts > money through Money > reports formatMoney rendered as a JSX child thro` | pass |
| C28 | `run tooling / ✓ eslint.config.test.ts > money through Money > reports formatMoney rendered as a JSX child thro` | pass |
| C28 | `run tooling / ✓ eslint.config.test.ts > money through Money > reports formatMoney rendered as a JSX child thro` | pass |
| C29 | `run tooling / ✓ eslint.config.test.ts > money through Money > allows formatMoney in <span>{t("key", { amount: ` | pass |
| C29 | `run tooling / ✓ eslint.config.test.ts > money through Money > allows formatMoney in <span>{true ? t("key", { a` | pass |
| C29 | `run tooling / ✓ eslint.config.test.ts > money through Money > allows formatMoney in <input value={formatMoney(` | pass |
| C30 | `run tooling / ✓ eslint.config.test.ts > code style > allows an augmentation to repeat a library's unused type ` | pass |
| C30 | `run tooling / ✓ eslint.config.test.ts > code style > reports an unused type parameter outside a *.d.ts` | pass |
| Build | `cd frontend && pnpm lint` | pass |
| Build | `cd frontend && pnpm build` | pass |
| Build | `cd frontend && node scripts/check-siblings.ts` | pass |

## Output

`Run critical` - exit 0

```
 ✓ |critical| src/utils/money.test.ts > formatMoney > formats the chart axis value 1500 compactly as "R$ 1,5 mil" (STD-06 AC 6) 0ms
 ✓ |critical| src/utils/money.test.ts > formatMoney > formats the chart axis value 2000000 compactly as "R$ 2 mi" (STD-06 AC 6) 0ms
 ✓ |critical| src/utils/money.test.ts > formatMoney > keeps the full form when compact is false (STD-06 AC 6) 0ms
 ✓ |critical| src/utils/money.test.ts > toCents > turns a float-prone sum into exact cents (STD-06 AC 6) 0ms
 ✓ |critical| src/utils/money.test.ts > toCents > converts 19.99 reais to 1999 cents (STD-06 AC 6) 0ms
 ✓ |critical| src/utils/money.test.ts > toCents > converts 12.34 reais to 1234 cents (STD-06 AC 6) 0ms
 ✓ |critical| src/utils/money.test.ts > toCents > converts -12.34 reais to -1234 cents (STD-06 AC 6) 0ms
 ✓ |critical| src/utils/money.test.ts > toCents > converts 0 reais to 0 cents (STD-06 AC 6) 0ms

 Test Files  1 passed (1)
      Tests  23 passed (23)
   Start at  22:02:21
   Duration  769ms (transform 72ms, setup 112ms, collect 33ms, tests 8ms, environment 402ms, prepare 54ms)

No story files found for the specified pattern: src/**/*.mdx
```

`Run stories` - exit 0

```
 ✓ |storybook (chromium)| src/features/transactions/components/NeutralReviewListView.stories.tsx > Newest Only 47ms

 Test Files  12 passed (12)
      Tests  81 passed (81)
   Start at  22:02:24
   Duration  6.07s (transform 0ms, setup 4.07s, collect 4.52s, tests 11.93s, environment 0ms, prepare 56.89s)

No story files found for the specified pattern: src/**/*.mdx
stderr | src/features/transactions/components/TransactionCells.stories.tsx > Edit Description
A component suspended inside an `act` scope, but the `act` call was not awaited. When testing React components that depend on asynchronous data, you must await the result:

await act(() => ...)
stderr | src/features/transactions/components/TransactionCells.stories.tsx > Edit Participants
You are using Testing Library's `screen` object. Use `within(canvasElement)` instead.
More info: https://storybook.js.org/docs/writing-tests/interaction-testing?ref=error
```

`Run tooling` - exit 0

```
 ✓ |tooling| eslint.config.test.ts > eslint.config.js > money through Money > allows formatMoney in <span>{t("key", { amount: formatMoney(1) })}</span> (money-display AC 15) 3ms
 ✓ |tooling| eslint.config.test.ts > eslint.config.js > money through Money > allows formatMoney in <span>{true ? t("key", { amount: formatMoney(1) }) : null}</span> (money-display AC 15) 3ms
 ✓ |tooling| eslint.config.test.ts > eslint.config.js > money through Money > allows formatMoney in <input value={formatMoney(1)} readOnly /> (money-display AC 15) 2ms
 ✓ |tooling| eslint.config.test.ts > eslint.config.js > interface texts > reports literal interface texts in components 21ms
 ✓ |tooling| eslint.config.test.ts > eslint.config.js > interface texts > leaves tests and stories to assert and render copy as it is 17ms
 ✓ |tooling| eslint.config.test.ts > eslint.config.js > local rules > with 60 lines of logic before the return reports [] (STD-12 AC 3) 6ms
 ✓ |tooling| eslint.config.test.ts > eslint.config.js > local rules > with 61 lines of logic before the return reports ["local/component-logic-cap"] (STD-12 AC 3) 5ms
 ✓ |tooling| eslint.config.test.ts > eslint.config.js > local rules > reports an IIFE in a component's JSX (STD-12 AC 4) 2ms

 Test Files  1 passed (1)
      Tests  50 passed (50)
   Start at  22:02:32
   Duration  1.16s (transform 36ms, setup 0ms, collect 115ms, tests 813ms, environment 0ms, prepare 50ms)

No story files found for the specified pattern: src/**/*.mdx
```

`cd frontend && node -e "import('./src/components/typography/base/typographyVariants.ts').then(({ typographyVar` - exit 0

```
(no output)
```

`cd frontend && printf 'import { formatMoney } from "@/utils/money";\n\nexport function Probe() {\n  return <sp` - exit 0

```
(no output)
```

`cd frontend && out=$(printf 'import { useTranslation } from "react-i18next";\nimport { formatMoney } from "@/u` - exit 0

```
(no output)
```

`cd frontend && ! grep -rnE "font-mono/jetbrains-mono/function Amount\b" src package.json && test ! -e src/comp` - exit 0

```
(no output)
```
