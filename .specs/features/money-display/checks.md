# Money display checks

Build: cd frontend && pnpm lint; cd frontend && pnpm build; cd frontend && node scripts/check-siblings.ts
Run critical: cd frontend && pnpm exec vitest run --project=critical --reporter=verbose src/utils/money.test.ts
Run stories: cd frontend && pnpm exec vitest run --project=storybook --reporter=verbose src/components/money/Money.stories.tsx src/features/transactions/components/TransactionCells.stories.tsx src/features/transactions/components/TransactionMobileList.stories.tsx src/features/transactions/components/NeutralReviewListView.stories.tsx src/features/plans/components/PlanTrashListView.stories.tsx src/features/transactions/TransactionsPageView.stories.tsx src/features/overview/components/SummaryCards.stories.tsx src/features/overview/components/CategorySpendingList.stories.tsx src/features/overview/components/MonthlyTrendChart.stories.tsx src/features/categories/components/CategoryTreeRow.stories.tsx src/features/categories/components/CategoryLimitFields.stories.tsx src/features/transactions/components/ItemsField.stories.tsx
Plan: `.specs/features/money-display/plan.md`

23 checks in 5 slices · 2 one-way doors · 0 open, of which 0 block

Size checks read the computed `font-size` in the browser (`getComputedStyle`), never a class name: 14 px or larger means `parseFloat(fontSize) >= 14`.

## Checks

### S1 - One money component

**C1** - `formatMoney` writes a negative with U+2212 and no space, and a value that rounds to zero with no minus (AC 1)
- 1234.5 → "R$ 1.234,50"; -1234.5 → "−R$ 1.234,50"; 0 → "R$ 0,00"; -0.004 → "R$ 0,00"; compact -1500 → "−R$ 1,5 mil"
Proof: run critical | ✓ src/utils/money.test.ts > formatMoney > writes a negative with U+2212
Proof: run critical | ✓ src/utils/money.test.ts > formatMoney > writes a value that rounds to zero without a minus
Proof: run critical | ✓ src/utils/money.test.ts > formatMoney > writes a compact negative with U+2212

**C2** - `Money` renders the four AC 1 examples exactly as text: "R$ 1.234,50", "−R$ 1.234,50", "R$ 0,00", "R$ 0,00" (AC 1)
Proof: run stories | ✓ src/components/money/Money.stories.tsx > Formats

**C3** - `Money` renders with `tabular-nums` and a computed `font-family` that starts with "Space Grotesk", never a monospace face (AC 2)
Proof: run stories | ✓ src/components/money/Money.stories.tsx > Typeface

**C4** - `Money` tones: `income` → `text-success`; `expense` → `text-destructive`; `bySign` 10 → `text-success`, 0 → `text-success`, -0.004 → `text-success`, -10 → `text-destructive`; `default` → none of the two (AC 3)
Proof: run stories | ✓ src/components/money/Money.stories.tsx > Tones

**C5** - `Money` with 9999999999999.99 renders "R$ 9.999.999.999.999,99" with computed `white-space: nowrap` (AC 4)
Proof: run stories | ✓ src/components/money/Money.stories.tsx > Large Value

**C6** - The items field shows a negative remainder of -5 as "−R$ 5,00" inside its translated sentence (AC 1: sentences get the same minus)
Proof: run stories | ✓ src/features/transactions/components/ItemsField.stories.tsx > Over Allocated

### S2 - Transaction lists

**C7** - The table cells show a debit of 1234.50 as "−R$ 1.234,50" in `text-destructive` and a credit of 1234.50 as "R$ 1.234,50" in `text-success` (AC 5)
Proof: run stories | ✓ src/features/transactions/components/TransactionCells.stories.tsx > Money Amounts

**C8** - The phone list shows the same debit and credit the same way (AC 5)
Proof: run stories | ✓ src/features/transactions/components/TransactionMobileList.stories.tsx > Money Amounts

**C9** - The neutral review list shows the same debit and credit the same way (AC 5)
Proof: run stories | ✓ src/features/transactions/components/NeutralReviewListView.stories.tsx > Money Amounts

**C10** - The trash list shows the same debit and credit the same way (AC 5)
Proof: run stories | ✓ src/features/plans/components/PlanTrashListView.stories.tsx > Money Amounts

**C11** - In the transactions table, the amount column header and each amount cell have a computed `text-align` of `right` (AC 6)
Proof: run stories | ✓ src/features/transactions/TransactionsPageView.stories.tsx > Amount Column Aligned

**C12** - Clicking an amount in the table opens an input whose computed `font-family` starts with "Space Grotesk" and whose `font-variant-numeric` is `tabular-nums` (AC 7)
Proof: run stories | ✓ src/features/transactions/components/TransactionCells.stories.tsx > Edit Amount Typeface

### S3 - Overview

**C13** - In the phone card, the Income and Expense figures compute to 20 px and the result to 24 px (AC 8)
Proof: run stories | ✓ src/features/overview/components/SummaryCards.stories.tsx > Figure Sizes

**C14** - In both layouts, each per-member amount, the "Previsto" line and the neutral movements line compute to 14 px or larger (AC 9)
Proof: run stories | ✓ src/features/overview/components/SummaryCards.stories.tsx > Readable Figures

**C15** - In the category spending list, the spent amount, "de R$ Y", the limit status with its percentage, the member line, the focus line and a subcategory amount each compute to 14 px or larger (AC 10)
Proof: run stories | ✓ src/features/overview/components/CategorySpendingList.stories.tsx > Readable Figures

**C16** - Hovering a month in the trend chart shows a tooltip whose value text is rendered by `Money` (`tabular-nums`, Space Grotesk) at 14 px (AC 11)
Proof: run stories | ✓ src/features/overview/components/MonthlyTrendChart.stories.tsx > Tooltip

### S4 - Categories tab

**C17** - A category row shows its limit and each member limit amount with `tabular-nums` at 14 px or larger, in both the narrow and the wide layout (AC 12)
Proof: run stories | ✓ src/features/categories/components/CategoryTreeRow.stories.tsx > Readable Figures

**C18** - The per-member limit fields show each member's share percentage at 14 px (AC 13)
Proof: run stories | ✓ src/features/categories/components/CategoryLimitFields.stories.tsx > Share Percent

### S5 - Scale and guard

**C19** - The scale has `figure` = "text-xl font-bold" beside `headline` = "text-2xl font-bold" and `title` = "text-base font-semibold", and `numeric: true` adds `tabular-nums`, absent without it (AC 14)
Proof: cd frontend && node -e "import('./src/components/typography/base/typographyVariants.ts').then(({ typographyVariants: v }) => { const a = require('assert'); a.strictEqual(v({ variant: 'figure' }), 'text-xl font-bold'); a.strictEqual(v({ variant: 'headline' }), 'text-2xl font-bold'); a.strictEqual(v({ variant: 'title' }), 'text-base font-semibold'); a.ok(v({ variant: 'body', numeric: true }).split(' ').includes('tabular-nums')); a.ok(!v({ variant: 'body' }).split(' ').includes('tabular-nums')); })"

**C20** - Lint fails a feature component that renders `{formatMoney(1)}` as a JSX child, with the message "Render money through <Money>" (AC 15)
Proof: cd frontend && printf 'import { formatMoney } from "@/utils/money";\n\nexport function Probe() {\n  return <span>{formatMoney(1)}</span>;\n}\n' | pnpm exec eslint --stdin --stdin-filename src/features/overview/components/Probe.tsx | grep -q "Render money through <Money>"

**C21** - Lint allows `formatMoney` inside a translated sentence's values (AC 15)
Proof: cd frontend && out=$(printf 'import { useTranslation } from "react-i18next";\nimport { formatMoney } from "@/utils/money";\n\nexport function Probe() {\n  const { t } = useTranslation();\n  return <span>{t("overview.summaryCards.forecast", { amount: formatMoney(1) })}</span>;\n}\n' | pnpm exec eslint --stdin --stdin-filename src/features/overview/components/Probe.tsx || true); ! echo "$out" | grep -q -E "Parsing error|Render money through"

**C22** - The frontend has no `Amount` component, no `font-mono` class, no `--font-mono` token and no JetBrains Mono import or dependency, and `CLAUDE.md` names `Money` for money display (AC 16)
Proof: cd frontend && ! grep -rnE "font-mono|jetbrains-mono|function Amount\b" src package.json && test ! -e src/components/amount && grep -q 'money through `Money`' ../CLAUDE.md

**C23** - The Overview at 390 px and 1280 px, the Transactions table at 1280 px and the Categories tab at 390 px show every amount in the new format with nothing clipped or overflowing (AC 5, 8, 12)
Proof: walk - open Overview, Transactions and Categories at those widths on the local stack

## Coverage

| Set (size) | Member -> proof | Unproven |
| --- | --- | --- |
| AC 1 examples (5) | 1234.5 C1 C2 · -1234.5 C1 C2 · 0 C1 C2 · -0.004 C1 C2 · compact -1500 C1 | - |
| `tone` values (4) | `income` C4 · `expense` C4 · `bySign` 10 / 0 / -0.004 / -10 C4 · `default` C4 | - |
| transaction lists, AC 5 (4) | table C7 · phone list C8 · neutral review C9 · trash C10 | - |
| readers in Changes underneath (10) | `TransactionCells` C7 C12 · `TransactionMobileList` C8 · `NeutralReviewListView` C9 · `PlanTrashListView` C10 · `SummaryCards` C13 C14 · `CategorySpendingList` C15 · `CategoryTreeRow` C17 · `CategoryLimitFields` C18 · `Chart` tooltip C16 · `ItemsField` C6 | - |
| AC 10 figures (6) | spent C15 · "de R$ Y" C15 · status with % C15 · member line C15 · focus line C15 · subcategory amount C15 | - |
| AC 9 figures (3) | per-member amount C14 · "Previsto" C14 · neutral line C14 | - |
| Landing doors (2) | `Money` API C2 C3 C4 C5 · `figure` and `numeric` C19 C13 | - |
| removals, AC 16 (4) | `Amount` C22 · `font-mono` C22 · JetBrains Mono C22 · CLAUDE.md C22 | - |
| lint guard, AC 15 (2) | JSX child refused C20 · sentence value allowed C21 | - |

## Swept

- validation: n/a - no input changes; the inline amount input keeps its existing rules (`EditAmount` story)
- failure modes: n/a - presentation only
- idempotency: n/a - nothing is written
- authorization: existing - the inline amount edit shows only with `permissions.edit` (`ReadOnly` story)
- concurrency: n/a - nothing is written
- data lifecycle: existing - the inline amount saves through the unchanged `onSave` (`EditAmount` story)
- dependency failure: n/a - the typeface is bundled; a font that fails to load falls back to the sans stack
- state transitions: n/a - no state changes
- observability: n/a - no logging requirement

## Handoff

- **Settled mid-build:** none
- **Dispatched:** none
- **Boundary:** none yet
- **Abandoned:** none
- **Walked:** none yet
