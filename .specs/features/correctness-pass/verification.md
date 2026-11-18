# Correctness Pass verification

**Verdict**: FAIL
**Proofs**: `proofs.md` at 1756ae7d
**Verifier**: independent sub-agent (author != verifier)

## Checks

| Check | Test | Holds |
| --- | --- | --- |
| C1 | `PlanProvider.test.tsx` `reloading a link to a non-default plan renders that plan` | yes - real Auth/Plan providers and gate; fails when the provider is reverted to 74f8b22a |
| C2 | `PlanProvider.test.tsx` `a link to a non-default plan opened after sign-in renders that plan` | yes - the only test that fails when the ref is dropped and the effect reads `activePlanId` state again |
| C3 | `PlanProvider.test.tsx` `keeps the stored active plan while the session is restoring` | yes - asserts `loading`, context id 3 and storage `"3"` on first render, and id 3 after `authenticated` |
| C4 | `PlanFiltersGate.test.tsx` `restores the active plan's state for a link to a plan the user does not belong to, never applying its ids` | yes - gate over a stub `PlanContext` (unchanged rule); a throwaway reload of `?plan=9` through the real `PlanProvider` also landed on the stored plan |
| C5 | `summaryView.test.ts` `member segments use actual amounts relative to the plan's actual total` | yes - exact amounts, exact widths over `planActual`, sums equal `actual`; fails when the filter, amount or width denominator is reverted |
| C6 | `summaryView.test.ts` `omits a member whose actual amount is zero` | yes - Livia has forecast 2414 and actual 0; fails when the filter goes back to `amountOf` |
| C7 | `SummaryCards.stories.tsx` `With Forecast` | yes - `getAllByText("Net")` is an exact match on a visible element |
| C8 | `grep -q '"balance": "Resultado"' frontend/src/i18n/pt-BR.json` | yes |
| C9 | `transactionForm.test.ts` `participantsForMode > preselects the first other member for someone else` | yes - `[me, Marina, Bruno]` gives Marina, from `[]` and from `[me]`; picking `members[0]` would give me and fail |
| C10 | `transactionForm.test.ts` `participantsForMode > keeps an other member already chosen for someone else` | yes - `[me, Bruno]` keeps Bruno, not the first other member Marina |
| C11 | `transactionForm.test.ts` `transactionFormSchema > someone else without a person is invalid with the choose-the-person message` | yes - asserts `success: false` and the `participants` issue's message key |
| C12 | `TransactionFormDrawer.test.tsx` `the date field has no clear button` | yes - the field holds today's date, so the button would render without `required` |
| C13 | `DatePicker.stories.tsx` `Required Restores Date` | yes - fails when the `required` branch in `commitInput` is removed |
| C14 | `DatePicker.stories.tsx` `Optional Clears` | yes - asserts an empty input and a last `onChange(undefined)` |
| C15 | `periodParams.test.ts` `selectionForRange > a range equal to a preset's range becomes that preset` | yes - all four presets at `now` |
| C16 | `periodParams.test.ts` `selectionForRange > a range equal to no preset stays a custom range` | no - one case whose start and end both differ from every preset; matching on the start date alone passes C15-C19 |
| C17 | `periodParams.test.ts` `selectionForRange > a preset reached by the arrows resolves against a later date` | yes - a stored custom range would resolve to October and fail |
| C18 | `OverviewPage.test.tsx` `OverviewPage > previous then next arrow returns to this month as a preset` | yes - asserts the exact params `{ plan: "5" }` after ‹ ›, and the custom range after ‹ |
| C19 | `TransactionsPage.test.tsx` `previous then next arrow returns to this month as a preset` | yes - exact params `{}` after ‹ › |
| C20 | `TransactionMobileList.stories.tsx` `Series Row` | yes - one "Series" marker, on the Gym row only |
| C21 | `TablePagination.stories.tsx` `Empty` | yes - no page text, no Next button, no page-size combobox (the base rendered "Page 1 of 1") |
| C22 | `spendingRows.test.ts` `usageOf > caps the percent at 99 while money remains` | yes - 99.9 with 1.22 left gives 99 (base gave 100) |
| C23 | `spendingRows.test.ts` `usageOf > shows at least 101 percent while over` | yes - OVER at 100.2 gives 101 (base gave 100) |
| C24 | `ConfirmTransactionDialogView.stories.tsx` `Date Without Clear` | yes - added with the fix; fails when `required` is removed (mutation probe at 11d6c8f6) |

## Findings

| Finding | Evidence | Fix | Closed |
| --- | --- | --- | --- |
| The confirm dialog's transaction date still has the clear button and the B5 defect: clearing it empties the text while the form keeps and saves the old date | `ConfirmTransactionDialogView.tsx:81-87` - `DatePicker` without `required`, `onChange={(date) => date && field.onChange(date)}`; `DatePicker.tsx:114` renders the clear button when `!required`; FIX-05 AC 3 ("the transaction date field SHALL show no clear button") and the goal "no form path saves a date the user did not see"; no check covers this call site | pass `required` and `onChange={field.onChange}` as the drawer does, and add a check that the confirm dialog's date has no clear button | 11d6c8f6 - C24 |
| C16 proves FIX-06 AC 2 on one case that shares no edge with a preset, so a preset match on the start date alone passes every check | Mutation `return dates.startDate === range.startDate;` in `periodParams.ts:49`: C15-C19 all green; only the unrelated `TransactionsPage ... moves a multi-month period by its own length (PNAV-01 AC 5)` failed. A range like 2026-10-01 to 2026-10-20 (reachable by stepping a non-aligned custom range) would snap to This month | add cases to C16's test with a range that shares a preset's start but not its end (2026-10-01 to 2026-10-20) and one that shares the end but not the start (2026-09-01 to 2026-10-31), both staying custom | 11d6c8f6 - C16 |
