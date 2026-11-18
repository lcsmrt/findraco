# correctness-pass proofs

**HEAD**: 9dd6a437
**Tree**: clean
**Shell**: /bin/sh
**Result**: 27 pass, 0 fail

| Check | Proof | Result |
| --- | --- | --- |
| C1 | `run unit / ✓ PlanProvider > reloading a link to a non-default plan renders that plan` | pass |
| C2 | `run unit / ✓ PlanProvider > a link to a non-default plan opened after sign-in renders that plan` | pass |
| C3 | `run unit / ✓ PlanProvider > keeps the stored active plan while the session is restoring` | pass |
| C4 | `run unit / ✓ PlanFiltersGate > restores the active plan's state for a link to a plan the user does not belong ` | pass |
| C5 | `run unit / ✓ summaryView > member segments use actual amounts relative to the plan's actual total` | pass |
| C6 | `run unit / ✓ summaryView > omits a member whose actual amount is zero` | pass |
| C7 | `run stories / ✓ SummaryCards.stories.tsx > With Forecast` | pass |
| C8 | `grep -q '"balance": "Resultado"' frontend/src/i18n/pt-BR.json` | pass |
| C9 | `run unit / ✓ participantsForMode > preselects the first other member for someone else` | pass |
| C10 | `run unit / ✓ participantsForMode > keeps an other member already chosen for someone else` | pass |
| C11 | `run unit / ✓ transactionFormSchema > someone else without a person is invalid with the choose-the-person messa` | pass |
| C12 | `run unit / ✓ TransactionFormDrawer > the date field has no clear button` | pass |
| C13 | `run stories / ✓ DatePicker.stories.tsx > Required Restores Date` | pass |
| C14 | `run stories / ✓ DatePicker.stories.tsx > Optional Clears` | pass |
| C15 | `run unit / ✓ selectionForRange > a range equal to a preset's range becomes that preset` | pass |
| C16 | `run unit / ✓ selectionForRange > a range equal to no preset stays a custom range` | pass |
| C17 | `run unit / ✓ selectionForRange > a preset reached by the arrows resolves against a later date` | pass |
| C18 | `run unit / ✓ OverviewPage > previous then next arrow returns to this month as a preset` | pass |
| C19 | `run unit / ✓ TransactionsPage > previous then next arrow returns to this month as a preset` | pass |
| C20 | `run stories / ✓ TransactionMobileList.stories.tsx > Series Row` | pass |
| C21 | `run stories / ✓ TablePagination.stories.tsx > Empty` | pass |
| C22 | `run unit / ✓ usageOf > caps the percent at 99 while money remains` | pass |
| C23 | `run unit / ✓ usageOf > shows at least 101 percent while over` | pass |
| C24 | `run stories / ✓ ConfirmTransactionDialogView.stories.tsx > Date Without Clear` | pass |
| Build | `cd frontend && pnpm lint` | pass |
| Build | `cd frontend && pnpm build` | pass |
| Build | `cd frontend && node scripts/check-siblings.ts` | pass |

## Output

`Run unit` - exit 0

```
       please check the style of container, or the props width(100%) and height(100%),
       or add a minWidth(0) or minHeight(undefined) or use aspect(undefined) to control the
       height and width.

stderr | src/features/overview/OverviewPage.test.tsx > OverviewPage > previous then next arrow returns to this month as a preset
The width(0) and height(0) of chart should be greater than 0,
       please check the style of container, or the props width(100%) and height(100%),
       or add a minWidth(0) or minHeight(undefined) or use aspect(undefined) to control the
       height and width.

stderr | src/features/overview/OverviewPage.test.tsx > OverviewPage > previous then next arrow returns to this month as a preset
The width(0) and height(0) of chart should be greater than 0,
       please check the style of container, or the props width(100%) and height(100%),
       or add a minWidth(0) or minHeight(undefined) or use aspect(undefined) to control the
       height and width.
```

`Run stories` - exit 0

```
 ✓ |storybook (chromium)| src/components/input/DatePicker.stories.tsx > Range Empty 280ms
 ✓ |storybook (chromium)| src/components/input/DatePicker.stories.tsx > Range Single Month 67ms

 Test Files  5 passed (5)
      Tests  27 passed (27)
   Start at  08:18:28
   Duration  3.69s (transform 0ms, setup 2.81s, collect 2.12s, tests 3.64s, environment 0ms, prepare 11.75s)

No story files found for the specified pattern: src/**/*.mdx
stderr | src/features/transactions/components/ConfirmTransactionDialogView.stories.tsx > Filled
You are using Testing Library's `screen` object. Use `within(canvasElement)` instead.
More info: https://storybook.js.org/docs/writing-tests/interaction-testing?ref=error
stderr | src/components/input/DatePicker.stories.tsx > Calendar Open
You are using Testing Library's `screen` object. Use `within(canvasElement)` instead.
More info: https://storybook.js.org/docs/writing-tests/interaction-testing?ref=error
```

`grep -q '"balance": "Resultado"' frontend/src/i18n/pt-BR.json` - exit 0

```
(no output)
```
