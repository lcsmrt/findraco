# Test Calibration Audit

**Spec**: `.specs/features/test-calibration/spec.md` (AUD-01..AUD-06)
**Design**: verdict rules in `.specs/features/test-calibration/design.md`
**Date**: 2026-10-20
**Status**: report committed before the cut (AUD-03). The cut lands in T10–T14; a row whose result differs from its plan is updated there, with the reason. T15 fills the after-numbers.

Every test and story file (182, from `vitest list` per project) has one row: kind, verdict, the table row or rule behind it, and the planned test count. "Before" is the suite on this branch after Phases 1–3 (1439 tests; the spec baseline of 1442 counted three tooling cases T1 replaced).

## How the rules were read

- **Unit rows** are the path patterns in `frontend/scripts/testTable.ts`. A file in a row keeps one case per rule plus the edges it names; a case that repeats another case's rule with other data, or asserts library behaviour (TanStack `enabled`, dedupe and keys; zod parse/throw; Base UI `aria-pressed`), is cut. Critical modules also keep their 90% branches.
- **Pure computation outside a row** (sort, grouping, scale, filter mapping in a `components/` folder) moves to the feature's `utils/` with its test. **Glue** (column definitions, labels, a `matchMedia` wrapper, storage wrappers) loses its test.
- **Feature hooks** (`use*.ts` outside `hooks/` and `api/services/`) are cut only when a flow or unit test covers every decision they assert, cited as `file:line`. Covered cases inside a kept file are trimmed; the rest stays and becomes a follow-up.
- **Flow tests** keep container decisions (CAL-08); a value rule another unit test owns is cut, naming that test.
- **A `.test.tsx` of a presentational component** has no row (presentational → story): cut, with its behaviour cited where another layer holds it, otherwise a follow-up.
- **Test-harness guard** (`src/test/setupUnit.test.ts`, `unhandledRequests.test.ts`) is gate code: it fails tests. It is read as the tooling row.
- **Stories.** A story keeps running when it shows a state the component's own code handles or holds a `play` for the component's own interaction. A "state" is a branch in the component's own code that renders different content or elements: with data, loading, empty, error, a permission or mode branch. These are catalog: a variant that only changes classes or a label lookup, an optional slot present or absent, a prop passed straight to a primitive (`disabled`, `isLoading`, `aria-invalid`), a state a child component handles, extreme content, and every viewport story (no component branches on the viewport in code; layout is Tailwind's). One story per state: a second story through the same branch is catalog. Every catalog story still helps the catalog, so none is removed.

## Totals

| Kind | Files before | Tests before | Files running after (planned) | Tests after (planned) |
| --- | --- | --- | --- | --- |
| Logic | 42 | 486 | 37 | 398 |
| Service hooks | 6 | 81 | 6 | 39 |
| Hooks | 22 | 104 | 21 | 89 |
| Flows and component tests (`.test.tsx`) | 14 | 114 | 12 | 63 |
| Tooling | 6 | 189 | 6 | 121 |
| Stories outside `base/` | 63 | 323 | 63 | 166 |
| Stories in `base/` | 29 | 142 | 0 | 0 |
| **Total** | **182** | **1439** | **145** | **876** |

"Service hooks" counts `src/api/services/` only; the API client and `api/utils/` are under Logic. Files running after: a `base/` story file stays in the catalog but runs no test.

## Time

| Measure | Before | After |
| --- | --- | --- |
| Local wall time, `unit` (20 cores, 5 workers) | 24.9s | T15 |
| Local wall time, `storybook` | 16.8s | T15 |
| Local wall time, `tooling` | 3.0s | T15 |
| Local wall time, `critical` with coverage | 3.7s | T15 |
| CI test step, full run (N=2) | 126s mean of 5 (spec baseline 247s, run 39360830629) | T15 |
| CI test step, affected run | 27s (run 39375424397) | — |

## Verdicts

| File | Kind | Verdict | Rule | Tests before → after | Note |
| --- | --- | --- | --- | --- | --- |
| `src/api/clients/accessToken.test.ts` | unit | keep | API client | 2 → 2 | each case a rule of the token store |
| `src/api/clients/findracoApi.test.ts` | unit | keep | critical module | 8 → 8 | each case a renewal rule |
| `src/api/utils/buildMutationOptions.test.ts` | unit | keep | business rule (`utils/`, `*Form(s).ts`) | 2 → 2 | each case a rule |
| `src/api/utils/buildPagedQuery.test.ts` | unit | keep | business rule (`utils/`, `*Form(s).ts`) | 5 → 4 | the two empty-query cases are one rule |
| `src/api/utils/resolveErrorMessage.test.ts` | unit | keep | business rule (`utils/`, `*Form(s).ts`) | 7 → 5 | three fallback cases are one rule |
| `src/api/utils/resolveSuccessMessage.test.ts` | unit | keep | business rule (`utils/`, `*Form(s).ts`) | 4 → 4 | each case a rule |
| `src/api/utils/toPagination.test.ts` | unit | keep | business rule (`utils/`, `*Form(s).ts`) | 4 → 4 | first, middle, last, empty: the rule's edges |
| `src/app/layout/navigation.test.ts` | unit | move | pure computation outside a row → `utils/` | 10 → 4 | `currentDestination` is a computation → `app/layout/utils/`; the path-list case is glue; four destination mappings are one rule |
| `src/app/providers/resolveTheme.test.ts` | unit | cut | glue outside every row | 4 → 0 | a wrapper around `matchMedia` |
| `src/app/routing/filterStorage.test.ts` | unit | cut | glue outside every row | 10 → 0 | a storage wrapper; per-screen and per-plan isolation: `src/app/routing/PlanFiltersGate.test.tsx:360`, `:218` |
| `src/app/routing/planParams.test.ts` | unit | keep | URL params | 5 → 2 | a round trip and an invalid value; four malformed values are one rule |
| `src/components/input/currencyDigits.test.ts` | unit | keep | critical module | 18 → 12 | four "enters N from the right" and four zero cases repeat their rules; keep the branch threshold |
| `src/components/table/utils/cols.test.ts` | unit | keep | business rule (`utils/`, `*Form(s).ts`) | 6 → 5 | two "untouched" cases are one rule |
| `src/features/auth/authForms.test.ts` | unit | keep | business rule (`utils/`, `*Form(s).ts`) | 12 → 12 | each case a schema rule |
| `src/features/auth/returnLocation.test.ts` | unit | move | pure computation outside a row → `utils/` | 9 → 3 | → `features/auth/utils/`; eight malformed-state cases are one rule with two edges |
| `src/features/categories/categoryTree.test.ts` | unit | move | pure computation outside a row → `utils/` | 6 → 6 | → `features/categories/utils/` |
| `src/features/categories/components/categoryDeletion.test.ts` | unit | move | pure computation outside a row → `utils/` | 17 → 17 | → `features/categories/utils/`; each case a rule |
| `src/features/categories/components/categoryForm.test.ts` | unit | keep | critical module | 49 → 48 | "lists income roots for CREDIT" repeats the type filter; keep the branch threshold |
| `src/features/overview/components/spendingRows.test.ts` | unit | move | pure computation outside a row → `utils/` | 19 → 19 | → `features/overview/utils/`; each case an AC rule |
| `src/features/overview/components/summaryView.test.ts` | unit | move | pure computation outside a row → `utils/` | 4 → 4 | → `features/overview/utils/` |
| `src/features/overview/components/trendMonths.test.ts` | unit | move | pure computation outside a row → `utils/` | 7 → 7 | → `features/overview/utils/` |
| `src/features/overview/filters/overviewParams.test.ts` | unit | keep | URL params | 21 → 16 | round trips collapse to preset+member and custom; legacy-param cases are one rule |
| `src/features/overview/utils/periodNavigator.test.ts` | unit | keep | business rule (`utils/`, `*Form(s).ts`) | 9 → 9 | each case a rule |
| `src/features/overview/utils/scaleLimits.test.ts` | unit | keep | business rule (`utils/`, `*Form(s).ts`) | 18 → 14 | four per-preset month counts are one rule; null/undefined limit is one rule |
| `src/features/plans/components/invitationLabel.test.ts` | unit | cut | glue outside every row | 3 → 0 | a label |
| `src/features/plans/components/inviteForm.test.ts` | unit | keep | business rule (`utils/`, `*Form(s).ts`) | 9 → 9 | each case a rule |
| `src/features/plans/components/planNameForm.test.ts` | unit | keep | business rule (`utils/`, `*Form(s).ts`) | 5 → 2 | throw/no-throw on direct parse is zod's; missing and empty name are one rule |
| `src/features/transactions/components/activeFilterCount.test.ts` | unit | move | pure computation outside a row → `utils/` | 10 → 4 | → `features/transactions/utils/`; seven per-field counts are one rule |
| `src/features/transactions/components/groupByDay.test.ts` | unit | move | pure computation outside a row → `utils/` | 4 → 4 | → `features/transactions/utils/` |
| `src/features/transactions/components/transactionColumns.test.ts` | unit | cut | glue outside every row | 2 → 0 | column definitions |
| `src/features/transactions/components/transactionFilterDraft.test.ts` | unit | move | pure computation outside a row → `utils/` | 13 → 10 | → `features/transactions/utils/`; the member trio repeats the category trio's rules. Done (T12): the member field rides in the three category cases, so `withDraftMember` and `memberId` keep an assertion |
| `src/features/transactions/components/transactionForm.series.test.ts` | unit | keep | critical module | 36 → 36 | each case a rule; keep the branch threshold |
| `src/features/transactions/components/transactionForm.test.ts` | unit | keep | critical module | 53 → 49 | per-field inline-save cases are one rule; keep the branch threshold |
| `src/features/transactions/components/transactionSort.test.ts` | unit | move | pure computation outside a row → `utils/` | 14 → 8 | → `features/transactions/utils/`; per-column mappings are one rule, the attributedTo and endDate cases are edges |
| `src/features/transactions/filters/transactionParams.test.ts` | unit | keep | URL params | 20 → 14 | one invalid value per field; legacy-param cases are one rule. Done (T12): those cuts give 15; the reserved-character round trip is also cut, as it asserts `URLSearchParams` encoding |
| `src/features/transactions/utils/categoryOptions.test.ts` | unit | keep | business rule (`utils/`, `*Form(s).ts`) | 7 → 7 | each case a rule |
| `src/lib/storage.test.ts` | unit | cut | glue outside every row | 6 → 0 | a storage wrapper |
| `src/utils/memberColors.test.ts` | unit | keep | business rule (`utils/`, `*Form(s).ts`) | 3 → 3 | each case a rule |
| `src/utils/money.test.ts` | unit | keep | critical module | 16 → 16 | each case a format or cents rule; keep the branch threshold |
| `src/utils/searchParams.test.ts` | unit | keep | business rule (`utils/`, `*Form(s).ts`) | 13 → 13 | each invalid value an edge of the id/date rule |
| `src/utils/string/formatters.test.ts` | unit | keep | business rule (`utils/`, `*Form(s).ts`) | 7 → 7 | each case a rule |
| `src/utils/string/masks.test.ts` | unit | keep | business rule (`utils/`, `*Form(s).ts`) | 9 → 9 | each case an edge of the mask |
| `src/api/services/useAuthService.test.ts` | service | keep | service hook | 7 → 7 | one per endpoint already |
| `src/api/services/useDashboardService.test.ts` | service | keep | service hook | 7 → 2 | one per endpoint; `enabled` and query-key cases are TanStack's |
| `src/api/services/useFinancialTransactionCategoryService.test.ts` | service | keep | service hook | 25 → 7 | one per endpoint/mutation (list, get, create, update, delete with reassignment, spending, usage); refresh and toast fold into each mutation's test; `enabled`, dedupe and key cases are TanStack's |
| `src/api/services/useFinancialTransactionService.test.ts` | service | keep | service hook | 21 → 9 | one per endpoint/mutation (list, series, create, update, delete, import, series create/update/delete); "works without caller options" and `enabled` cases cut |
| `src/api/services/useInvitationService.test.ts` | service | keep | service hook | 5 → 3 | one per mutation; caller-onSuccess cases repeat the one kept in `usePlanService.test.ts` |
| `src/api/services/usePlanService.test.ts` | service | keep | service hook | 16 → 11 | one per endpoint/mutation, plus one caller-onSuccess case (the five repeat one rule, which `buildMutationOptions.test.ts` does not hold); the failed-request case is TanStack's |
| `src/app/providers/useAuth.test.tsx` | feature hook | keep | feature hook | 2 → 2 | throw-outside-provider is covered by no flow; follow-up F1 |
| `src/app/providers/useAuthSession.test.tsx` | feature hook | keep | feature hook | 13 → 13 | AuthProvider start-up/expiry decisions; no flow covers them; follow-up F2 |
| `src/app/providers/usePlanContext.test.tsx` | feature hook | keep | feature hook | 2 → 2 | follow-up F1 |
| `src/app/providers/useTheme.test.tsx` | feature hook | keep | feature hook | 2 → 2 | follow-up F1 |
| `src/components/dialog/useConfirm.test.tsx` | feature hook | keep | feature hook | 2 → 2 | `components/dialog/useConfirm.ts` is no shared hook; follow-up F1 |
| `src/features/categories/components/useCategoryFormSubmit.test.ts` | feature hook | keep | feature hook | 3 → 3 | update and failure decisions have no flow; follow-up F4 |
| `src/features/overview/filters/useOverviewFilters.test.tsx` | feature hook | cut | feature hook | 3 → 0 | URL write without history and foreign keys untouched: `src/hooks/useSearchParamGroup.test.tsx:61`; legacy period parsed, ignored and never serialized: `src/features/overview/filters/overviewParams.test.ts:129` (T12 merged the two legacy cases) |
| `src/features/overview/useOverviewMemberFilter.test.tsx` | feature hook | keep | feature hook | 3 → 3 | no Overview flow test; follow-up F5 |
| `src/features/overview/useOverviewTrend.test.ts` | feature hook | keep | feature hook | 3 → 1 | window and fill are `trendMonths.test.ts`; the per-member request has no flow; follow-up F5 |
| `src/features/plans/components/usePlanNameSubmit.test.ts` | feature hook | keep | feature hook | 3 → 1 | create and rename: `src/features/plans/components/PlanNameDialog.test.tsx:22`, `:45`; failure has no flow; follow-up F6 |
| `src/features/transactions/components/useCsvImport.test.ts` | feature hook | keep | feature hook | 3 → 3 | no flow imports a file; follow-up F7 |
| `src/features/transactions/components/useSeriesScope.test.tsx` | feature hook | keep | feature hook | 2 → 2 | follow-up F1 |
| `src/features/transactions/components/useTransactionActions.test.tsx` | feature hook | keep | feature hook | 11 → 8 | edit, duplicate, delete: `src/features/transactions/TransactionsPage.test.tsx:167`, `:180`, `:193`; series scopes and cancels have no flow; follow-up F7 |
| `src/features/transactions/components/useTransactionFormSubmit.test.ts` | feature hook | keep | feature hook | 11 → 9 | create and failure: `src/app/layout/MainLayout.test.tsx:221`, `:250`; series edits have no flow; follow-up F7 |
| `src/features/transactions/components/useTransactionSearch.test.ts` | feature hook | keep | feature hook | 7 → 6 | settled search: `src/features/transactions/TransactionsPage.test.tsx:141`; the rest has no flow; follow-up F7 |
| `src/features/transactions/filters/useTransactionFilters.test.tsx` | feature hook | keep | feature hook | 3 → 1 | URL write and foreign keys: `src/hooks/useSearchParamGroup.test.tsx:61`; the clear subset has no flow; follow-up F7 |
| `src/features/transactions/useTransactionFilterChips.test.tsx` | feature hook | keep | feature hook | 8 → 8 | no flow shows chips; follow-up F7 |
| `src/features/transactions/useTransactionsPage.test.ts` | feature hook | keep | feature hook | 6 → 6 | page resets have no flow; follow-up F7 |
| `src/hooks/useCategoryFormSheet.test.tsx` | shared hook | keep | shared hook | 2 → 2 | throws outside, returns inside |
| `src/hooks/useMemberColors.test.ts` | shared hook | keep | shared hook | 4 → 4 | each case a promised behaviour |
| `src/hooks/usePlanPermissions.test.ts` | shared hook | keep | shared hook | 6 → 6 | one per role and the two not-ready states |
| `src/hooks/useSearchParamGroup.test.tsx` | shared hook | keep | shared hook | 5 → 5 | each case a promised behaviour |
| `src/app/layout/MainLayout.test.tsx` | flow | rewrite | container → flow (CAL-08) | 14 → 11 | the four per-destination taps are one decision; global add, failure and permission cases stay |
| `src/app/routing/AppRouter.test.tsx` | flow | rewrite | container → flow (CAL-08) | 5 → 2 | the redirect and one served route; four routes are one decision |
| `src/app/routing/PlanFiltersGate.test.tsx` | flow | rewrite | container → flow (CAL-08) | 32 → 20 | 14 per-key "screen param" cases are one rule per screen (2 stay); restore, link, plan-switch and storage-failure decisions stay |
| `src/app/routing/PrivateRoute.test.tsx` | flow | keep | container → flow (CAL-08) | 4 → 4 | loading, unreachable, redirect, render: each a decision |
| `src/components/input/CurrencyInput.test.tsx` | presentational | cut | presentational → story | 7 → 0 | digit rules: `currencyDigits.test.ts`; typing display: `CurrencyInput.stories.tsx` Empty play; the number reaching the payload: `src/features/transactions/components/TransactionFormDrawer.test.tsx:137` (kept as the happy submit); keypad is a hand check |
| `src/components/input/DatePicker.test.tsx` | presentational | cut | presentational → story | 3 → 0 | form focus and blur wiring has no story play yet; follow-up F3 |
| `src/features/auth/ForgotPasswordPage.test.tsx` | flow | rewrite | container → flow (CAL-08) | 2 → 1 | the empty-email rule is `authForms.test.ts` (forgotPasswordSchema) |
| `src/features/auth/LoginPage.test.tsx` | flow | rewrite | container → flow (CAL-08) | 6 → 3 | field rules are `authForms.test.ts` (loginSchema); no remember-me is visual |
| `src/features/auth/ResetPasswordPage.test.tsx` | flow | rewrite | container → flow (CAL-08) | 3 → 2 | passwords-differ is `authForms.test.ts` (resetPasswordSchema) |
| `src/features/categories/components/CategoryFormSheet.test.tsx` | flow | rewrite | container → flow (CAL-08) | 8 → 3 | limit payload rules are `categoryForm.test.ts` (toPayload); aria-pressed is Base UI's; happy submit and cancel stay; no API-failure case: follow-up F4. Done (T14): the edit submit (PUT to the category's URL) is a container decision the plan missed, so it stays (AUD-04); the happy submit now types a limit and asserts the full payload |
| `src/features/plans/components/InvitePlanDialog.test.tsx` | flow | rewrite | container → flow (CAL-08) | 4 → 3 | missing email is `inviteForm.test.ts`; no cancel or API-failure case: follow-up F6 |
| `src/features/plans/components/PlanNameDialog.test.tsx` | flow | rewrite | container → flow (CAL-08) | 3 → 2 | empty name is `planNameForm.test.ts` |
| `src/features/transactions/TransactionsPage.test.tsx` | flow | rewrite | container → flow (CAL-08) | 8 → 7 | the sort mapping is `transactionSort.test.ts` |
| `src/features/transactions/components/TransactionFormDrawer.test.tsx` | flow | rewrite | container → flow (CAL-08) | 15 → 6 | money, split, attribution and schema rules are `transactionForm.test.ts` / `transactionForm.series.test.ts` / `currencyDigits.test.ts`; happy create (full payload), edit, cancel, edit and create actions, series mutation stay |
| `eslint.config.test.ts` | tooling | keep | tooling: one valid + one invalid per behaviour | 114 → 47 | per-path repeats of one fragment collapse to one invalid and one valid case per behaviour; each layer keeps its fragment case |
| `eslint/rules/componentLogicCap.test.ts` | tooling | keep | tooling: one valid + one invalid per behaviour | 24 → 24 | already one valid and one invalid case per counting behaviour |
| `eslint/rules/noJsxIife.test.ts` | tooling | keep | tooling: one valid + one invalid per behaviour | 6 → 6 | valid/invalid pairs |
| `scripts/check-siblings.test.ts` | tooling | keep | tooling: one valid + one invalid per behaviour | 39 → 39 | one requiring and one passing case per row and per exemption (T1) |
| `src/test/setupUnit.test.ts` | tooling | keep | tooling: one valid + one invalid per behaviour | 2 → 2 | the unhandled-request guard is gate code; the pair proves one behaviour |
| `src/test/unhandledRequests.test.ts` | tooling | keep | tooling: one valid + one invalid per behaviour | 4 → 3 | naming one and every request is one behaviour |
| `src/app/layout/AuthLayoutView.stories.tsx` | story | catalog (story-level) | presentational → story per own state / own `play` (CAL-06) | 3 → 1 | no own branch: with-data render; tall content and mobile are catalog; `!test`: TallContent, Mobile |
| `src/app/layout/BottomBarView.stories.tsx` | story | catalog (story-level) | presentational → story per own state / own `play` (CAL-06) | 5 → 2 | own add interaction and the no-add branch; other active tabs repeat the active branch; `!test`: TransactionsActive, CategoriesActive, PlansActive |
| `src/app/layout/MainLayoutView.stories.tsx` | story | catalog (story-level) | presentational → story per own state / own `play` (CAL-06) | 4 → 2 | with and without the navigation branch (only story with it); `!test`: LongContent, Mobile |
| `src/app/layout/NavbarView.stories.tsx` | story | catalog (story-level) | presentational → story per own state / own `play` (CAL-06) | 3 → 1 | with data and its own menu interaction; `!test`: LongPlanName, Mobile |
| `src/app/layout/TabRowView.stories.tsx` | story | catalog (story-level) | presentational → story per own state / own `play` (CAL-06) | 5 → 2 | own add interaction and the no-add branch; other active tabs repeat the active branch; `!test`: TransactionsActive, CategoriesActive, PlansActive |
| `src/app/layout/ToasterView.stories.tsx` | story | catalog (story-level) | presentational → story per own state / own `play` (CAL-06) | 8 → 1 | toast types, theme and placement are sonner's; one render; `!test`: Error, Info, Warning, Loading, Dark, LongMessage, Mobile |
| `src/app/routing/SessionStatusView.stories.tsx` | story | catalog (story-level) | presentational → story per own state / own `play` (CAL-06) | 3 → 2 | its two status branches, retry interaction; `!test`: MobileUnreachable |
| `src/components/amount/Amount.stories.tsx` | story | catalog (story-level) | presentational → story per own state / own `play` (CAL-06) | 4 → 2 | the debit sign branch and its absence; zero repeats credit; `!test`: Zero, LargeValue |
| `src/components/appVersion/AppVersion.stories.tsx` | story | catalog (story-level) | presentational → story per own state / own `play` (CAL-06) | 2 → 1 | no own branch; alignment is a class variant; `!test`: Centered |
| `src/components/dialog/ConfirmDialogProvider.stories.tsx` | story | catalog (story-level) | presentational → story per own state / own `play` (CAL-06) | 5 → 2 | its own confirm and cancel resolution; destructive is a button variant; `!test`: Destructive, LongDescription, Mobile |
| `src/components/form/FormField.stories.tsx` | story | catalog (story-level) | presentational → story per own state / own `play` (CAL-06) | 5 → 2 | with data and the error state; description is an optional slot, disabled is the primitive's; `!test`: WithDescription, LongLabelAndError, Disabled |
| `src/components/form/FormSheet.stories.tsx` | story | catalog (story-level) | presentational → story per own state / own `play` (CAL-06) | 6 → 1 | submitting and unavailable pass through to Button; mobile actions is an optional slot; `!test`: Submitting, SubmitUnavailable, WithMobileActions, LongContentScrolls, Mobile |
| `src/components/input/CurrencyInput.stories.tsx` | story | catalog (story-level) | presentational → story per own state / own `play` (CAL-06) | 5 → 2 | typing interaction and the value branch; invalid and disabled pass through; `!test`: LargeValue, Invalid, Disabled |
| `src/components/input/DatePicker.stories.tsx` | story | catalog (story-level) | presentational → story per own state / own `play` (CAL-06) | 10 → 7 | own open, parse and range branches; disabled days and disabled are the calendar's; `!test`: DisabledDates, Disabled, RangeMobile |
| `src/components/input/StandardCombobox.stories.tsx` | story | catalog (story-level) | presentational → story per own state / own `play` (CAL-06) | 10 → 6 | own filter, create, loading and clear branches; open and the empty list are Base UI's; `!test`: Open, NoResults, Disabled, LongLabelsManyItems |
| `src/components/input/StandardMultiCombobox.stories.tsx` | story | catalog (story-level) | presentational → story per own state / own `play` (CAL-06) | 7 → 3 | placeholder, chips and its overflow count; open and the empty list are Base UI's; `!test`: Open, NoResults, Disabled, LongNames |
| `src/components/memberDot/MemberDot.stories.tsx` | story | catalog (story-level) | presentational → story per own state / own `play` (CAL-06) | 4 → 1 | no own branch; colours and size are args; `!test`: FormerMember, Palette, Larger |
| `src/components/pageHeader/PageHeader.stories.tsx` | story | catalog (story-level) | presentational → story per own state / own `play` (CAL-06) | 4 → 1 | with data; title-only is an optional slot; `!test`: TitleOnly, LongTitle, Mobile |
| `src/components/sectionHeader/SectionHeader.stories.tsx` | story | catalog (story-level) | presentational → story per own state / own `play` (CAL-06) | 5 → 1 | with data; title-only and level are variants; `!test`: TitleOnly, NestedLevel, LongText, Mobile |
| `src/components/table/Table.stories.tsx` | story | keep | presentational → story per own state / own `play` (CAL-06) | 1 → 1 | only story, with data |
| `src/components/table/TableContent.stories.tsx` | story | catalog (story-level) | presentational → story per own state / own `play` (CAL-06) | 6 → 1 | a composition: loading, empty and expand belong to TableBody; `!test`: Loading, Empty, Expandable, ManyLongRows, Mobile |
| `src/components/table/TablePagination.stories.tsx` | story | catalog (story-level) | presentational → story per own state / own `play` (CAL-06) | 8 → 3 | page-change interaction, the zero-total branch, the no-size branch; first/last only pass flags to Button; `!test`: FirstPage, LastPage, Loading, ManyPages, Mobile |
| `src/components/table/components/TableActionsDropdown.stories.tsx` | story | catalog (story-level) | presentational → story per own state / own `play` (CAL-06) | 4 → 2 | own action filter; subtle is a class variant; `!test`: Subtle, LongLabels |
| `src/components/table/components/TableBody.stories.tsx` | story | catalog (story-level) | presentational → story per own state / own `play` (CAL-06) | 6 → 4 | its loading, empty and expand branches; a custom empty state is an optional slot; `!test`: CustomEmptyState, ManyLongRows |
| `src/components/table/components/TableHeader.stories.tsx` | story | catalog (story-level) | presentational → story per own state / own `play` (CAL-06) | 4 → 3 | own sort cycle and one icon per direction; `!test`: LongHeaders |
| `src/components/themeToggle/ThemeToggleView.stories.tsx` | story | catalog (story-level) | presentational → story per own state / own `play` (CAL-06) | 2 → 1 | own toggle interaction; dark is the same branch; `!test`: Dark |
| `src/components/transactionTypeToggle/TransactionTypeToggle.stories.tsx` | story | catalog (story-level) | presentational → story per own state / own `play` (CAL-06) | 3 → 1 | own change interaction; credit and disabled are the toggle's; `!test`: Credit, Disabled |
| `src/features/auth/ForgotPasswordView.stories.tsx` | story | catalog (story-level) | presentational → story per own state / own `play` (CAL-06) | 5 → 3 | with data, error and the submitted branch; sending passes through to Button; `!test`: Sending, Mobile |
| `src/features/auth/LoginView.stories.tsx` | story | catalog (story-level) | presentational → story per own state / own `play` (CAL-06) | 4 → 2 | with data and error; submitting passes through to Button; `!test`: Submitting, Mobile |
| `src/features/auth/RegisterUserView.stories.tsx` | story | catalog (story-level) | presentational → story per own state / own `play` (CAL-06) | 4 → 2 | with data and error; submitting passes through to Button; `!test`: Submitting, Mobile |
| `src/features/auth/ResetPasswordView.stories.tsx` | story | catalog (story-level) | presentational → story per own state / own `play` (CAL-06) | 6 → 4 | with data, error and its validating and invalid-link branches; `!test`: Submitting, Mobile |
| `src/features/auth/components/AuthCard.stories.tsx` | story | catalog (story-level) | presentational → story per own state / own `play` (CAL-06) | 4 → 1 | with data; title-only is an optional slot; `!test`: TitleOnly, LongDescription, Mobile |
| `src/features/auth/components/PasswordInput.stories.tsx` | story | catalog (story-level) | presentational → story per own state / own `play` (CAL-06) | 3 → 1 | own show/hide interaction; invalid and disabled pass through; `!test`: Invalid, Disabled |
| `src/features/categories/CategoriesPageView.stories.tsx` | story | catalog (story-level) | presentational → story per own state / own `play` (CAL-06) | 6 → 4 | manage permission, loading and empty branches; `!test`: ManyLongCategories, Mobile |
| `src/features/categories/components/CategoryFormSheetProvider.stories.tsx` | story | catalog (story-level) | presentational → story per own state / own `play` (CAL-06) | 4 → 3 | its own open modes and close; `!test`: Mobile |
| `src/features/categories/components/CategoryLimitFields.stories.tsx` | story | catalog (story-level) | presentational → story per own state / own `play` (CAL-06) | 5 → 3 | single and per-member modes and the not-allowed branch; an empty amount is CurrencyInput's; `!test`: NoLimit, ManyMembers |
| `src/features/categories/components/CategoryTreeRow.stories.tsx` | story | catalog (story-level) | presentational → story per own state / own `play` (CAL-06) | 9 → 6 | owner, member-limit, child, former-member, no-limit and read-only branches; `!test`: LastChild, LongContent, Mobile |
| `src/features/notFound/NotFoundView.stories.tsx` | story | catalog (story-level) | presentational → story per own state / own `play` (CAL-06) | 2 → 1 | with data and its link; `!test`: Mobile |
| `src/features/overview/OverviewPageView.stories.tsx` | story | catalog (story-level) | presentational → story per own state / own `play` (CAL-06) | 6 → 2 | with data and its skeleton branch; empty and single-member are the children's; `!test`: SingleMember, Empty, LargeValues, Mobile |
| `src/features/overview/components/CategorySpendingList.stories.tsx` | story | catalog (story-level) | presentational → story per own state / own `play` (CAL-06) | 5 → 3 | status branches with expand interaction, the member focus branch, empty; `!test`: ManyLongCategories, Mobile |
| `src/features/overview/components/MemberFilterChips.stories.tsx` | story | catalog (story-level) | presentational → story per own state / own `play` (CAL-06) | 4 → 3 | own select/clear mapping and the select fallback past the chip limit; `!test`: LongNames |
| `src/features/overview/components/MonthlyTrendChart.stories.tsx` | story | catalog (story-level) | presentational → story per own state / own `play` (CAL-06) | 6 → 2 | with data and its skeleton branch; other ranges are data; `!test`: QuarterSelected, NoData, YearLargeValues, Mobile |
| `src/features/overview/components/PeriodNavigator.stories.tsx` | story | catalog (story-level) | presentational → story per own state / own `play` (CAL-06) | 7 → 4 | preset and custom branches, own menu and calendar interactions; labels are periodNavigator's; `!test`: LastThreeMonths, ThisYear, AcrossYears |
| `src/features/overview/components/SummaryCards.stories.tsx` | story | catalog (story-level) | presentational → story per own state / own `play` (CAL-06) | 6 → 2 | with data and the no-segments branch; member dimming is a class; `!test`: MemberSelected, NegativeBalance, ManyMembersLargeValues, Mobile |
| `src/features/plans/AcceptInvitationView.stories.tsx` | story | catalog (story-level) | presentational → story per own state / own `play` (CAL-06) | 6 → 3 | with data, loading and error branches; accepting passes through to Button; `!test`: Accepting, LongNames, Mobile |
| `src/features/plans/PlansPageView.stories.tsx` | story | catalog (story-level) | presentational → story per own state / own `play` (CAL-06) | 6 → 3 | manage permission branches and loading; archiving passes through to Button; `!test`: Archiving, ManyLongPlans, Mobile |
| `src/features/plans/components/InvitePlanDialogView.stories.tsx` | story | catalog (story-level) | presentational → story per own state / own `play` (CAL-06) | 6 → 4 | with data, error and both created branches; creating passes through to Button; `!test`: Creating, Mobile |
| `src/features/plans/components/PlanInvitationsListView.stories.tsx` | story | catalog (story-level) | presentational → story per own state / own `play` (CAL-06) | 5 → 3 | with data, loading and empty branches; `!test`: ManyLongEmails, Mobile |
| `src/features/plans/components/PlanMembersListView.stories.tsx` | story | catalog (story-level) | presentational → story per own state / own `play` (CAL-06) | 6 → 4 | manage permission, loading and empty branches; `!test`: ManyLongNames, Mobile |
| `src/features/plans/components/PlanNameDialogView.stories.tsx` | story | catalog (story-level) | presentational → story per own state / own `play` (CAL-06) | 6 → 2 | with data and error; rename is a label lookup, submitting passes through; `!test`: Rename, Submitting, LongName, Mobile |
| `src/features/plans/components/PlanSwitcherView.stories.tsx` | story | catalog (story-level) | presentational → story per own state / own `play` (CAL-06) | 3 → 2 | with data and the no-plan fallback; `!test`: LongPlanName |
| `src/features/plans/components/TransferOwnershipDialogView.stories.tsx` | story | catalog (story-level) | presentational → story per own state / own `play` (CAL-06) | 5 → 3 | with data, loading and empty branches; transferring passes through; `!test`: Transferring, Mobile |
| `src/features/transactions/TransactionsPageView.stories.tsx` | story | catalog (story-level) | presentational → story per own state / own `play` (CAL-06) | 8 → 3 | with data, the chips branch and the importing branch; loading and empty are the list's; `!test`: SingleMember, Loading, Empty, ManyLongTransactions, Mobile |
| `src/features/transactions/components/AttributionFields.stories.tsx` | story | catalog (story-level) | presentational → story per own state / own `play` (CAL-06) | 6 → 4 | one per attribution mode its own code renders; `!test`: ManyMembers, MobileSomeoneElse |
| `src/features/transactions/components/CategoryComboboxView.stories.tsx` | story | catalog (story-level) | presentational → story per own state / own `play` (CAL-06) | 8 → 6 | value, grouping, loading, empty and create branches; `!test`: Disabled, ManyLongNames |
| `src/features/transactions/components/EndDateField.stories.tsx` | story | catalog (story-level) | presentational → story per own state / own `play` (CAL-06) | 4 → 3 | ongoing badge branch, with value, error; `!test`: Disabled |
| `src/features/transactions/components/InstallmentsField.stories.tsx` | story | catalog (story-level) | presentational → story per own state / own `play` (CAL-06) | 5 → 4 | create and series-edit branches, preview and error; `!test`: ManyInstallments |
| `src/features/transactions/components/ItemsField.stories.tsx` | story | catalog (story-level) | presentational → story per own state / own `play` (CAL-06) | 4 → 3 | empty, with data and the over-total error; `!test`: LongDescriptions |
| `src/features/transactions/components/SeriesScopeDialog.stories.tsx` | story | catalog (story-level) | presentational → story per own state / own `play` (CAL-06) | 3 → 1 | own choice interaction; delete only swaps labels; `!test`: Delete, Mobile |
| `src/features/transactions/components/SeriesScopeDialogProvider.stories.tsx` | story | keep | presentational → story per own state / own `play` (CAL-06) | 2 → 2 | its own resolve and cancel |
| `src/features/transactions/components/TransactionCells.stories.tsx` | story | catalog (story-level) | presentational → story per own state / own `play` (CAL-06) | 11 → 7 | series and empty branches, each cell's own edit interaction; income is Amount's; `!test`: Income, Deleting, LongDescriptionLargeAmount, Mobile |
| `src/features/transactions/components/TransactionFilterPopoverView.stories.tsx` | story | catalog (story-level) | presentational → story per own state / own `play` (CAL-06) | 6 → 4 | count badge and member-picker branches; category loading is the combobox's; `!test`: LoadingCategories, Mobile |
| `src/features/transactions/components/TransactionMobileList.stories.tsx` | story | catalog (story-level) | presentational → story per own state / own `play` (CAL-06) | 5 → 3 | with data, loading and empty branches; `!test`: ManyLongRows, Desktop |
| `src/components/avatar/base/Avatar.stories.tsx` | base story | catalog | `base/` primitive → catalog only (CAL-07) | 2 → 0 | merge `"!test"` into the meta `tags` |
| `src/components/badge/base/Badge.stories.tsx` | base story | catalog | `base/` primitive → catalog only (CAL-07) | 9 → 0 | merge `"!test"` into the meta `tags` |
| `src/components/button/base/Button.stories.tsx` | base story | catalog | `base/` primitive → catalog only (CAL-07) | 6 → 0 | merge `"!test"` into the meta `tags` |
| `src/components/calendar/base/Calendar.stories.tsx` | base story | catalog | `base/` primitive → catalog only (CAL-07) | 9 → 0 | merge `"!test"` into the meta `tags` |
| `src/components/card/base/Card.stories.tsx` | base story | catalog | `base/` primitive → catalog only (CAL-07) | 2 → 0 | merge `"!test"` into the meta `tags` |
| `src/components/chart/base/Chart.stories.tsx` | base story | catalog | `base/` primitive → catalog only (CAL-07) | 8 → 0 | merge `"!test"` into the meta `tags` |
| `src/components/dialog/base/Dialog.stories.tsx` | base story | catalog | `base/` primitive → catalog only (CAL-07) | 2 → 0 | merge `"!test"` into the meta `tags` |
| `src/components/dropdown/base/Dropdown.stories.tsx` | base story | catalog | `base/` primitive → catalog only (CAL-07) | 3 → 0 | merge `"!test"` into the meta `tags` |
| `src/components/input/base/Checkbox.stories.tsx` | base story | catalog | `base/` primitive → catalog only (CAL-07) | 4 → 0 | merge `"!test"` into the meta `tags` |
| `src/components/input/base/Combobox.stories.tsx` | base story | catalog | `base/` primitive → catalog only (CAL-07) | 9 → 0 | merge `"!test"` into the meta `tags` |
| `src/components/input/base/Field.stories.tsx` | base story | catalog | `base/` primitive → catalog only (CAL-07) | 9 → 0 | merge `"!test"` into the meta `tags` |
| `src/components/input/base/Input.stories.tsx` | base story | catalog | `base/` primitive → catalog only (CAL-07) | 5 → 0 | merge `"!test"` into the meta `tags` |
| `src/components/input/base/InputGroup.stories.tsx` | base story | catalog | `base/` primitive → catalog only (CAL-07) | 7 → 0 | merge `"!test"` into the meta `tags` |
| `src/components/input/base/Label.stories.tsx` | base story | catalog | `base/` primitive → catalog only (CAL-07) | 4 → 0 | merge `"!test"` into the meta `tags` |
| `src/components/input/base/NumberField.stories.tsx` | base story | catalog | `base/` primitive → catalog only (CAL-07) | 5 → 0 | merge `"!test"` into the meta `tags` |
| `src/components/input/base/RadioGroup.stories.tsx` | base story | catalog | `base/` primitive → catalog only (CAL-07) | 2 → 0 | merge `"!test"` into the meta `tags` |
| `src/components/input/base/Select.stories.tsx` | base story | catalog | `base/` primitive → catalog only (CAL-07) | 3 → 0 | merge `"!test"` into the meta `tags` |
| `src/components/input/base/Textarea.stories.tsx` | base story | catalog | `base/` primitive → catalog only (CAL-07) | 3 → 0 | merge `"!test"` into the meta `tags` |
| `src/components/popover/base/Popover.stories.tsx` | base story | catalog | `base/` primitive → catalog only (CAL-07) | 1 → 0 | merge `"!test"` into the meta `tags` |
| `src/components/separator/base/Separator.stories.tsx` | base story | catalog | `base/` primitive → catalog only (CAL-07) | 2 → 0 | merge `"!test"` into the meta `tags` |
| `src/components/sheet/base/Sheet.stories.tsx` | base story | catalog | `base/` primitive → catalog only (CAL-07) | 8 → 0 | merge `"!test"` into the meta `tags` |
| `src/components/skeleton/base/Skeleton.stories.tsx` | base story | catalog | `base/` primitive → catalog only (CAL-07) | 2 → 0 | merge `"!test"` into the meta `tags` |
| `src/components/spinner/base/Spinner.stories.tsx` | base story | catalog | `base/` primitive → catalog only (CAL-07) | 2 → 0 | merge `"!test"` into the meta `tags` |
| `src/components/table/base/TableParts.stories.tsx` | base story | catalog | `base/` primitive → catalog only (CAL-07) | 5 → 0 | merge `"!test"` into the meta `tags` |
| `src/components/toggle/base/Toggle.stories.tsx` | base story | catalog | `base/` primitive → catalog only (CAL-07) | 4 → 0 | merge `"!test"` into the meta `tags` |
| `src/components/toggleGroup/base/ToggleGroup.stories.tsx` | base story | catalog | `base/` primitive → catalog only (CAL-07) | 6 → 0 | merge `"!test"` into the meta `tags` |
| `src/components/tooltip/base/Tooltip.stories.tsx` | base story | catalog | `base/` primitive → catalog only (CAL-07) | 2 → 0 | merge `"!test"` into the meta `tags` |
| `src/components/typography/base/Heading.stories.tsx` | base story | catalog | `base/` primitive → catalog only (CAL-07) | 8 → 0 | merge `"!test"` into the meta `tags` |
| `src/components/typography/base/Text.stories.tsx` | base story | catalog | `base/` primitive → catalog only (CAL-07) | 10 → 0 | merge `"!test"` into the meta `tags` |

## Moves

Each moves with its test, and every import follows (T12):

- `features/categories/categoryTree.ts` → `features/categories/utils/`
- `features/categories/components/categoryDeletion.ts` → `features/categories/utils/`
- `features/overview/components/spendingRows.ts`, `summaryView.ts`, `trendMonths.ts` → `features/overview/utils/`
- `features/transactions/components/activeFilterCount.ts`, `groupByDay.ts`, `transactionFilterDraft.ts`, `transactionSort.ts` → `features/transactions/utils/`
- `features/auth/returnLocation.ts` → `features/auth/utils/`
- `app/layout/navigation.ts` → `app/layout/utils/`

No critical module moves.

## Follow-ups (AUD-06)

Behaviour the table asks a test for that no test at the right layer covers. The audit writes none of them.

- **F1. Provider guards.** `useAuth`, `usePlanContext`, `useTheme`, `useConfirm`, `useSeriesScope` each assert "throws outside its provider". No flow can reach that, and the feature-hook row says none. Decide it in the table (a row for provider hooks, or no test); the five files stay until then.
- **F2. AuthProvider flow.** `useAuthSession.test.tsx` is a flow of `AuthProvider` with `PrivateRoute` (start-up, expiry, sign-out). Rename it as the provider's flow test; the cases stay.
- **F3. DatePicker form wiring.** Focus on an empty required submit, touched on blur and the typed date reaching the form have no story `play` once `DatePicker.test.tsx` is cut. Add them to `DatePicker.stories.tsx`.
- **F4. Category form flow.** `CategoryFormSheet.test.tsx` has no API-failure case (its edit case stays, T14); with it, `useCategoryFormSubmit.test.ts` can go.
- **F5. Overview flow.** No `OverviewPage` flow test exists; the member filter and the per-member trend request live only in hook tests.
- **F6. Plan dialogs.** `PlanNameDialog.test.tsx` and `InvitePlanDialog.test.tsx` have no cancel or API-failure case; with them, `usePlanNameSubmit.test.ts` can go.
- **F7. Transactions flows.** `TransactionsPage.test.tsx` has no import, series-delete scope, filter-chip, page-reset or clear case, and `TransactionFormDrawer.test.tsx` no series-edit scope; with them, the remaining transactions feature-hook tests can go.
