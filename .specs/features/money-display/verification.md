# Money display verification

**Verdict**: FAIL
**Proofs**: `proofs.md` at 8d781f30
**Verifier**: independent sub-agent (author != verifier)

## Checks

| Check | Test | Holds |
| --- | --- | --- |
| C1 | `src/utils/money.test.ts` `writes a negative with U+2212`, `writes a value that rounds to zero without a minus`, `writes a compact negative with U+2212` | yes - exact strings with NBSP for -1234.5, -0.004, 0 and compact -1500 (names cite no AC, see findings) |
| C2 | `Money.stories.tsx` `Formats` | yes - exact `textContent` of the four AC 1 examples, in order |
| C3 | `Money.stories.tsx` `Typeface` | yes - computed family starts with Space Grotesk, no "mono", `tabular-nums` |
| C4 | `Money.stories.tsx` `Tones` | yes - each listed tone/value pair asserts its class; `default` asserts neither |
| C5 | `Money.stories.tsx` `Large Value` | yes - exact text and computed `white-space: nowrap` |
| C6 | `ItemsField.stories.tsx` `Over Allocated` | yes - exact sentence "Remainder: −R$ 5,00" |
| C7 | `TransactionCells.stories.tsx` `Money Amounts` | yes - exact debit/credit text (full-string match) and class on the figure itself |
| C8 | `TransactionMobileList.stories.tsx` `Money Amounts` | yes - same assertions |
| C9 | `NeutralReviewListView.stories.tsx` `Money Amounts` | yes - same assertions |
| C10 | `PlanTrashListView.stories.tsx` `Money Amounts` | yes - same assertions |
| C11 | `TransactionsPageView.stories.tsx` `Amount Column Aligned` | yes - computed `text-align: right` on the header and on two amount cells |
| C12 | `TransactionCells.stories.tsx` `Edit Amount Typeface` | yes - clicks the amount, reads the input's computed family and `font-variant-numeric` |
| C13 | `SummaryCards.stories.tsx` `Figure Sizes` | yes - phone card income/expense computed 20 px, result 24 px (no responsive size variant, so the viewport does not change it) |
| C14 | `SummaryCards.stories.tsx` `Readable Figures` | yes - each figure found in both layouts (length 2), each >= 14 px |
| C15 | `CategorySpendingList.stories.tsx` `Readable Figures` | yes - the seven named figures each >= 14 px; the sub-row "of R$ Y" shares the root's unbranched `Text` |
| C16 | `MonthlyTrendChart.stories.tsx` `Tooltip` | yes - two tooltip values, Space Grotesk, `tabular-nums`, 14 px (asserts the look, not the component; enough for the claim) - but only on non-zero values, see findings |
| C17 | `CategoryTreeRow.stories.tsx` `Readable Figures` | yes - limit and both member limits, two layouts each, >= 14 px and `tabular-nums` |
| C18 | `CategoryLimitFields.stories.tsx` `Share Percent` | yes - 75% and 25% at exactly 14 px |
| C19 | `node -e` over `typographyVariants.ts` | yes - exact class strings for `figure`/`headline`/`title`, `tabular-nums` present with `numeric` and absent without |
| C20 | `eslint --stdin` probe in `src/features/overview/components/Probe.tsx` | yes for the bare call it names - but the guard misses a conditional child, see findings |
| C21 | `eslint --stdin` probe with `t(..., { amount: formatMoney(1) })` | partly - `\|\| true` plus a grep for absence also passes when ESLint does not run at all |
| C22 | `grep` over `src` and `package.json`, `test ! -e src/components/amount`, `grep` in `CLAUDE.md` | yes - covers the class, the token (`--font-mono` matches), the dependency, the import and the doc line |
| C23 | walk - Overview 390/1280, Transactions 1280, Categories 390 | yes - `proofs.md` records it Walked at 8d781f30; no artefact beyond that row to judge |
| C24 | `MonthlyTrendChart.stories.tsx` `Tooltip Spacing` | yes - measured gap label-to-amount >= 8 px on the widest fixture figures |
| C25 | `TransactionsPageView.stories.tsx` `Amount Header Label Aligned` | yes - arrow right edge <= label left, label right within 8 px of the amount's right |
| C26 | `MonthlyTrendChart.stories.tsx` `Tooltip Zero` | appended for finding 1 - asserts the exact two texts "R$ 1.000,00" and "R$ 0,00"; fails at 8d781f30 (author-checked, not re-judged) |
| C27 | `Money.stories.tsx` `Half Cent Tone`; `money.test.ts` `says %s shows as negative` | appended for finding 2 - exact text and class, table over -0.005/-0.01/-0.004/0/0.01 (author-checked, not re-judged) |
| C28 | `eslint.config.test.ts` `reports formatMoney rendered as a JSX child through %s` | appended for finding 3 - one message per form after a real lint; fails at 8d781f30 (author-checked, not re-judged) |
| C29 | `eslint.config.test.ts` `allows formatMoney in %s` | appended for finding 4 - the Verifier named this test as the sound proof of C21 |
| C30 | `eslint.config.test.ts` `allows an augmentation to repeat…` and `reports an unused type parameter outside a *.d.ts` | appended for finding 6 - valid and invalid case (author-checked, not re-judged) |

## Findings

| Finding | Evidence | Fix | Closed |
| --- | --- | --- | --- |
| The chart tooltip shows a bare "0" for a month with a zero value, not "R$ 0,00" through `Money` (AC 11); no check uses a zero value | own example at HEAD: 12 months income 5000, expenses 0, hover June -> tooltip text "June 2026IncomeR$ 5.000,00Expenses0" (one `R$` value instead of two). `Chart.tsx:223` `{item.value && (...)}` renders `0` | test `item.value != null` (or branch on `typeof item.value === "number"` first) and add a tooltip story with a zero month asserting "R$ 0,00" at 14 px | `791a31e0` - C26 |
| `tone="bySign"` can disagree with the figure it colours: -0.005 shows "−R$ 0,01" in green (AC 3: bySign follows what the figure shows) | own example at HEAD: `<Money value={-0.005} tone="bySign" />` -> text "−R$ 0,01", class `text-success`. `toCents` uses `Math.round` (half toward +inf, -0.5 -> -0) while `Intl` rounds half away from zero. Low impact: API amounts carry two decimals | take the sign from the same rounding `formatMoney` uses (e.g. a `minusSign` part survives in `formatToParts`), and add -0.005 to the `Tones` story | `791a31e0` - C27 |
| The AC 15 guard misses `formatMoney` rendered as a JSX child through a conditional, a logical or a template literal | `eslint --stdin` at HEAD on `<span>{ok ? formatMoney(1) : null}</span>`, `<span>{ok && formatMoney(1)}</span>` and ``<span>{`${formatMoney(1)}`}</span>`` in `src/features/...`: exit 0, no "Render money through" message. Selector `JSXElement > JSXExpressionContainer > CallExpression` matches only the bare call; C20 tests only that | widen the selector to a `formatMoney` call under `ConditionalExpression`/`LogicalExpression`/`TemplateLiteral` directly in a child container, and add those cases to `eslint.config.test.ts` | `791a31e0` - C28 |
| C21's proof passes when ESLint does not run | the proof captures the lint output with an or-true replaced by an or-true fallback and only checks that two strings are absent, so a config crash or a missing binary prints neither and passes | prove C21 with `eslint.config.test.ts` `allows formatMoney in %s` (tooling project), which asserts the message list is empty after a real lint | `791a31e0` - C29 |
| The three new `formatMoney` tests cite no AC, and the edited compact test dropped its citation | `money.test.ts` `writes a negative with U+2212` etc.; repo rule (frontend-testing, "Test names cite the AC they prove") | append `(money-display AC 1)` to each name | `791a31e0` - C1 (names now cite money-display AC 1) |
| `eslint.config.js` turns `no-unused-vars` off for every `*.d.ts` with no tooling case | diff in `eslint.config.js` (`files: ['**/*.d.ts']`); the tooling row asks one valid and one invalid case per behaviour of the config | add an `eslint.config.test.ts` case for an augmentation that repeats unused type parameters | `791a31e0` - C30 |
