# Validation: flow-coverage

**Result**: PASS

- Commit range: `c9cb3d3..4799f75` (branch `flow-coverage`, 15 commits)
- Verifier: independent sub-agent (did not author the code); read-only on the real tree
- Date: 2026-10-20

## Tasks

`tasks.md`: 23 checkboxes done, 0 open.

## Spec-anchored check (evidence-or-zero)

Paths are relative to `frontend/src/`.

### P1: DatePicker form wiring

| AC | Spec outcome | Evidence | Result |
| --- | --- | --- | --- |
| FLOW-01 | empty required submit focuses the input | `components/input/DatePicker.stories.tsx:119` `waitFor(() => expect(input).toHaveFocus())` (+ `:120` submit not called) | ✅ |
| FLOW-02 | blur marks the field touched, shown as the component shows it | `components/input/DatePicker.stories.tsx:114` `expect(await canvas.findByRole("alert")).toHaveTextContent("Pick a due date")` after `tab()`, with `:112` no alert before blur (form `mode: "onTouched"`) | ✅ |
| FLOW-03 | typed date reaches submitted value | `components/input/DatePicker.stories.tsx:127` `expect(submitDueDate.mock.calls[0][0]).toEqual({ dueDate: new Date(2026, 2, 5) })` | ✅ (exact value) |

### P1: Container decisions in flow tests

| AC | Spec outcome | Evidence | Result |
| --- | --- | --- | --- |
| FLOW-04 | category save fails: sheet stays open with typed values, no success toast | `features/categories/components/CategoryFormSheet.test.tsx:162` Name `toBe("Groceries")`, `:163` amount `"R$ 250,50"`, `:164` `onOpenChange).not.toHaveBeenCalledWith(false)`, `:166` `toast.success).not.toHaveBeenCalled()` | ✅ |
| FLOW-05 | trend request carries the member; member's figures shown; summary plan-wide | `features/overview/OverviewPage.test.tsx:109` `lastTrendQuery(requests)).toHaveProperty("memberId", "7")`, `:111` `findAllByText(/777,77/)` (Ana's net, differs from the plan's 1.800,00), `:113` every summary query has no `memberId` | ✅ |
| FLOW-06 | Cancel: nothing reaches the network, dialog closes | `features/plans/components/PlanNameDialog.test.tsx:74-75` `onOpenChange).toHaveBeenCalledWith(false)` + `requests).toEqual([])`; `features/plans/components/InvitePlanDialog.test.tsx:108-109` same pair | ✅ |
| FLOW-07 | request fails: dialog stays open with its values | `features/plans/components/PlanNameDialog.test.tsx:100-102` dialog present, Name `toBe("Household")`, `onOpenChange` not called; `features/plans/components/InvitePlanDialog.test.tsx:125`, `:127` Email `toBe("ana@example.com")`, `onOpenChange` not called | ✅ |
| FLOW-08 (CSV) | import reaches the network, result shown | `features/transactions/TransactionsPage.test.tsx:289` "Transactions imported." shown, `:291` one POST to `/import`, `:292` list refetched; rejection `:304`, `:307` | ✅ ⚠️ file body not asserted (see gaps) |
| FLOW-08 (series delete) | chosen scope reaches the network | `features/transactions/TransactionsPage.test.tsx:365-366` `writes(requests)).toEqual([["DELETE", ".../series/s-1?scope=${scope}&pivotOccurrenceId=55"]])` over 3 scopes (`it.each` `:350`); cancel `:380` | ✅ (values) |
| FLOW-08 (chips) | active filters as chips; removing one clears that filter | `features/transactions/TransactionsPage.test.tsx:392`, `:399` chips + request params; `:433` `toEqual({ page: "0", size: "10", type: "DEBIT" })`, `:435` chips `["Debit"]` | ✅ |
| FLOW-08 (page reset) | page back to first on filter change | `features/transactions/TransactionsPage.test.tsx:428` page 1 reached, then `:433` `page: "0"` after chip removal; also sort `:448`, size `:467` | ✅ |
| FLOW-08 (clear all) | clearing all filters | `features/transactions/TransactionsPage.test.tsx:483` search box empty, `:485` request keeps only sort/size, `:492` no chips, `:496` no search written back | ✅ |
| FLOW-09 | series edit: chosen scope reaches the network | `features/transactions/components/TransactionFormDrawer.test.tsx:429` PUT to `/series/s-1`, `:432-435` `toMatchObject({ scope, pivotOccurrenceId: 55, description: "Gym", ... })` over 3 scopes (`it.each` `:414`); changed installments `:452` `{ scope: "ALL", parcelsNumber: 10 }`; cancel `:466-467` | ✅ (values) |
| FLOW-10 | each cut hook test cites a covering `file:line` in `audit.md` | Spot-checked all citations in the `useCategoryFormSubmit`, `useOverviewMemberFilter`, `useOverviewTrend`, `usePlanNameSubmit`, `useCsvImport`, `useTransactionActions`, `useTransactionFormSubmit`, `useTransactionSearch`, `useTransactionFilterChips` and `useTransactionsPage` rows. Each one lands on a real `expect`/`it` line that matches the decision (e.g. `TransactionsPage.test.tsx:433`, `TransactionFormDrawer.test.tsx:452`, `OverviewPage.test.tsx:109`). No feature-hook test files remain under `features/` or `app/providers/` | ✅ |

### P2: Provider guards and AuthProvider

| AC | Spec outcome | Evidence | Result |
| --- | --- | --- | --- |
| FLOW-11 | table and TESTING.md say provider guards get no test | `.claude/skills/frontend-testing/SKILL.md:36` "Provider guard ... none"; `.specs/codebase/TESTING.md:121` "Frontend provider guards ... none" | ✅ |
| FLOW-12 | guard tests removed (6 hooks) | `grep "must be used within"` matches only source files, no `*.test.*`; `useAuth`, `usePlanContext`, `useTheme`, `useConfirm`, `useSeriesScope` test files deleted; `hooks/useCategoryFormSheet.test.tsx` lost its guard case (−6 lines) and keeps 1 case for the sibling gate | ✅ |
| FLOW-13 | `AuthProvider.test.tsx` beside `AuthProvider.tsx` with the same cases | renamed at 100% similarity (`useAuthSession.test.tsx => AuthProvider.test.tsx`, 0 lines changed); `app/providers/AuthProvider.test.tsx:88` first case | ✅ |

### Edge cases

- Hook test kept because no flow can reach it: none kept among feature hooks. `useCategoryFormSheet` (a shared hook) keeps 1 case, and the reason is recorded in `audit.md`. ✅
- A hook test file left with zero cases gets deleted: all cut files are deleted. ✅
- No production code changed: the only non-test source change is `api/services/invitation.handlers.ts` (MSW factory `createRejected`, test support). ✅

## Payload / conjunction rule

Network assertions check values: series-delete URL with `scope` and `pivotOccurrenceId` (`TransactionsPage.test.tsx:366`), series-edit body (`TransactionFormDrawer.test.tsx:432`), list query params as whole objects (`toEqual`), trend `memberId` value `"7"` (`OverviewPage.test.tsx:109`), and an empty request list on cancel. One exception: the CSV import asserts method and URL only, not the uploaded file (jsdom `FormData` reaches MSW unserialised). `audit.md` F7 already records this.

## Gate

The orchestrator ran it on HEAD `4799f75` just before verification, so it was not rerun: lint OK, build OK, 846 unit/storybook tests + 169 critical tests passed, 0 failed. The hook-test case count goes down by design (74 → 1 provider/feature-hook cases). Each cut cites its covering flow assertion (FLOW-10), and flow-test counts went up: TransactionsPage 7 → 29, TransactionFormDrawer 8 → 15, Plan dialogs +4, CategoryFormSheet +1, OverviewPage new (3), DatePicker `InForm` story.

## Discrimination sensor

Scratch: a temporary git worktree at HEAD, with `node_modules` symlinks to the real installs, removed afterwards. Each mutant ran only its covering file through `node node_modules/vitest/vitest.mjs run --project=<p> <file>` (`pnpm exec` was dropped because its deps-status check tries `pnpm install`). A baseline of each file passed before mutation. For the storybook run, the worktree's `vite.config.ts` got a scratch-only `server.fs.allow` and `cacheDir` override (reverted with the worktree). Without it the browser could not load the symlinked setup file. That first attempt counts as an environment error, not a kill.

| # | Target | Mutation | Covering file | Result |
| --- | --- | --- | --- | --- |
| M1 | `useTransactionActions` series-delete scope | `scope` → `"ALL"` in `deleteSeries` | `TransactionsPage.test.tsx` | KILLED (2 scope cases) |
| M2 | `useTransactionFormSubmit` series-edit scope | scope arg of `toSeriesEditPayload` → `"ALL"` | `TransactionFormDrawer.test.tsx` | KILLED (2 scope cases) |
| M3 | `useTransactionFilterChips` chip removal | `keys.forEach` → `keys.slice(1).forEach` (removes nothing) | `TransactionsPage.test.tsx` | KILLED (3) |
| M4 | `useTransactionsPage` page reset | `page = pageState.page` (never resets) | `TransactionsPage.test.tsx` | KILLED (4) |
| M5 | CSV import result handling | drop `invalidateTransactionData` in `useImportNubankCsv` onSuccess | `TransactionsPage.test.tsx` | KILLED (1) |
| M6 | `useCategoryFormSubmit` failure path | `createCategory.mutate({ body }, { onError: () => onDone() })` | `CategoryFormSheet.test.tsx` | KILLED (1) |
| M7 | `useOverviewTrend` memberId | filter → `trendRange` (member dropped) | `OverviewPage.test.tsx` | KILLED (1) |
| M8 | `DatePicker` onBlur wiring | remove `onBlur?.()` from the input's blur | `DatePicker.stories.tsx` (storybook) | KILLED (`InForm`: no `alert`) |

8 injected, 8 killed, 0 survived. All targets sit in a test-table row with a test kind (feature hooks: container → flow test; `DatePicker`: presentational → story; `useFinancialTransactionService.ts`: service hook → unit), as root `CLAUDE.md` requires. One extra onChange mutant was discarded because it ran stacked on M8, so it is not counted.

Isolation: `git status --porcelain` on the real tree was empty before and after. `frontend/node_modules/typescript` still links to `../../node_modules/.pnpm/typescript@5.7.3/...`. Side effect: through the symlink, the unit runs rewrote Vitest's run-order cache `frontend/node_modules/.vite/vitest/<hash>/results.json` (a cache every local Vitest run rewrites; no packages touched).

## Gaps (non-blocking)

1. ⚠️ FLOW-08 CSV: the uploaded file's content is asserted by no test (jsdom `FormData` limitation). It is already recorded in `audit.md` F7, and the spec's wording ("reaching the network") is met by method and URL.
2. ⚠️ Spec precision, FLOW-06: "the dialog closes" is asserted as `onOpenChange(false)` on a controlled dialog, not as the dialog leaving the DOM. That is acceptable for a controlled component, and the spec does not say which.
