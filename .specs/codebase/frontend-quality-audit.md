# Frontend Quality Audit

**Date**: 2026-10-16
**Scope**: `frontend/src` (15.7k lines; 8.9k in `features/`). Backend not covered.
**Lens**: hygiene, structure, reuse, separation of concerns, test and story coverage. The 2026-07-12 `reinvention-audit.md` covered "libraries vs hand-rolled code" and found the architecture sound; that verdict still holds and is not repeated here.
**Purpose**: input for the frontend standards. Each finding is reviewed with the user and becomes a rule, a refactor slice, or is dropped.

---

## Verdict

The decay is real and has one main cause: **the standards are silent where the code went wrong**. `component-creation` never asks for a story or a test, so none were written. `feature-structure` has a helpers-go-in-`utils/` rule, but no gate checks it, and the lint that would catch half of it is already red. CI only deploys: no lint, typecheck or test runs before code reaches production.

The code itself is not chaotic. The data layer, routing and forms follow their conventions. The damage concentrates in a few places: two oversized forms, visual patterns copied instead of extracted, and helpers living inside component files.

---

## Numbers

| Measure | Value |
| ------- | ----- |
| Shared components (`src/components/*`) | 22 folders, 16 stories, all of them for shadcn/Base UI primitives; 0 for the app's own shared components (`StandardCombobox`, `DatePicker`, `TablePagination`, `SectionHeader`…) |
| Feature components (`src/features/**/*.tsx`) | 37 files, 0 stories |
| Frontend test files | 23 in features (all logic or form-helper tests), 0 for shared components |
| `npm run lint` | 66 errors: 43 `react-refresh/only-export-components`, 15 `storybook/no-renderer-packages`, 6 `no-explicit-any`, 1 `no-uninstalled-addons`, 1 `prefer-const` |
| CI checks before deploy | none (`deploy.yml` only redeploys) |
| Largest files | `TransactionFormDrawer.tsx` 1226, `CategoryFormSheet.tsx` 717, `transactionColumns.tsx` 455, `TransactionsTab.tsx` 388 |

---

## A. Missing standards (root cause)

| ID | Finding | Evidence | Proposal |
| -- | ------- | -------- | -------- |
| A1 | No rule on when a component gets a story | `component-creation/SKILL.md` has no mention of stories | Rule decides which components get stories (see F1) |
| A2 | No rule on when a component or hook gets a test | Same skill; `TESTING.md` describes the harness, not the obligation | Rule decides what gets tested and how (see F2) |
| A3 | Rules exist but nothing enforces them | Hook extraction is in `component-creation` ("Feature Components — Hook Extraction"), yet `TransactionsTab` holds ~200 lines of logic | A gate: CI runs lint + typecheck + tests; lint must be green first (G1, G2) |

## B. Duplication: patterns copied instead of extracted

| ID | Finding | Evidence | Proposal |
| -- | ------- | -------- | -------- |
| B1 | Segmented toggle built by hand 5 times, the same 2-line className copied 7× | `TransactionTypeToggle.tsx:24-45`, `TransactionFormDrawer.tsx` recurrence mode, `CategoryLimitFields.tsx:27`, `AttributionFields.tsx:86,146,160` | A shared `ToggleGroup` over Base UI's ToggleGroup, with a `tone` variant (primary / destructive / success) |
| B2 | Masked inputs written inline: currency mask on `onChange` in 7 places, digits-only input via IIFE in JSX 3×, masked → cents parsing implemented 4× | `TransactionFormDrawer.tsx:232` `parseAmount`, the inline remainder computation and the 3 parcel IIFEs; `CategoryFormSheet.tsx:212` `parseLimit`; `CategoryLimitFields.tsx:108,146`; `AttributionFields.tsx:213`; `TransactionFilterPopover.tsx:201,211` | `CurrencyInput` and `DigitsInput` components plus one `parseMaskedCurrency` in `utils/string/masks` |
| B3 | Form sheet shell duplicated: Sheet + header + scrolling form + footer with the mobile-only Delete/secondary row + Cancel/Save | `TransactionFormDrawer.tsx` (render) and `CategoryFormSheet.tsx:446-616` | A shared `FormSheet` (title, footer actions, mobile actions slot) |
| B4 | Auth card shell copied 4× (same className), password visibility input 4×, `<p>` used as the label inside `Button` 5× | `LoginPage.tsx:68`, `RegisterUserPage.tsx:67`, `ForgotPasswordPage.tsx:47`, `ResetPasswordPage.tsx`; password inputs at `LoginPage.tsx:87`, `RegisterUserPage.tsx:98`, `ResetPasswordPage.tsx:97,126` | `AuthCard` + `PasswordInput`; button labels as plain text |
| B5 | Create and Rename plan dialogs are the same component | `diff CreatePlanDialog.tsx RenamePlanDialog.tsx` differs only in the hook, defaults and title | One `PlanNameDialog` with `mode: "create" \| "rename"` (the existing multi-mode rule in CONVENTIONS) |
| B6 | Money formatting helper redefined in 4 files; signed amount (sign + colour by type) built twice | `const money` in `CategoryTreeRow.tsx:9`, `CategorySpendingList.tsx:16`, `SummaryCards.tsx:7`; signed amount in `TransactionMobileList.tsx:40-44`, `transactionColumns.tsx:134` | `formatBRL` in `utils/string/formatters` + an `Amount` component (signed, toned) |
| B7 | Plan role checks inline in 5 places; mobile-navigation will add more ("can create") | `myRole === …` in `TransactionsTab.tsx`, `TransactionFormDrawer.tsx:543`, `CategoriesTab.tsx`, `PlansPage.tsx`, `PlanMembersList.tsx` | `usePlanPermissions()` returning named capabilities (`canCreateTransactions`, `canAttributeToOthers`, `canManageCategories`, `canManagePlan`) mirroring `PlanAuthorization.java` |
| B8 | Inside `TransactionFormDrawer`, the End date and Number of installments blocks exist twice (create vs series edit) | End date at the series-edit and create branches; parcels at both | Extracted field components (falls out of D1) |

## C. Placement and structure

| ID | Finding | Evidence | Proposal |
| -- | ------- | -------- | -------- |
| C1 | Component files export schemas, mappers and helpers; that is the bulk of the 43 `only-export-components` errors, and it breaks Fast Refresh | `TransactionFormDrawer.tsx` exports the schema, `toPayload`, `toSeriesCreatePayload`, `toSeriesEditPayload`, `buildDefaultValues`…; `CategoryFormSheet.tsx` exports 10 helpers; `DeleteCategoryDialog.tsx` 5 | A form's schema and mappers live in a sibling `xxxForm.ts`; a component file exports components only |
| C2 | Pure helpers inside `components/` against the existing `utils/` rule | `categoryTree.ts`, `spendingRows.ts`, `summaryView.ts`, `trendMonths.ts`, `groupByDay.ts`, `transactionFilterDraft.ts` | **Your call**: move to `utils/`, or change the rule to "a helper sits next to its only consumer" |
| C3 | A context provider lives inside a form component file | `CategoryFormSheet.tsx:632-717` (`CategoryFormSheetProvider`, `useCategoryFormSheet`) | Its own file (`CategoryFormSheetProvider.tsx` or `hooks/`) |
| C4 | `features/home` holds three features (overview, transactions, categories), a non-standard `filters/` folder, and cross-cutting pieces at its root (`PeriodNavigator`, member colours) | `features/home/**`: 56 files | **Your call**: split into `features/overview`, `features/transactions`, `features/categories` with `home` as the shell, or keep `home` with subfolders. Mobile-navigation makes them peer destinations with Plans |
| C5 | Four auth screens are four features | `features/login`, `registerUser`, `forgotPassword`, `resetPassword` | **Your call**: one `features/auth` |
| C6 | Shared components that are not presentational, and a shared component importing a feature (inverted dependency) | `components/navbar/Navbar.tsx` uses `useAuth` and imports `features/plans/components/PlanSwitcher`; `components/layout/` | App shell (layout, navbar, the new bottom bar) moves to `src/app/layout/`; `src/components/` stays presentational |
| C7 | `SectionHeader` is shared but used once | `PlansPage.tsx` only | Keep it as the page/section heading primitive and adopt it, or fold it back into Plans. **Your call**, tied to D-typography (E4) |
| C8 | `components.json` (shadcn CLI config) points at paths that do not exist | aliases `ui: @/components/ui`, `utils: @/lib/utils`, css `src/styles/globals.css`; the real files are `lib/mergeClasses.ts` and `src/index.css` | Fix the config so `npx shadcn add` installs where the primitives live |
| C9 | No stated boundary between `src/lib/` and `src/utils/`, and a feature-specific module in `lib/` | `lib/` holds `mergeClasses`, `storage`, `filterStorage`; `utils/` holds `string/formatters`, `string/masks` | `lib/` = adapters around libraries and browser APIs; `utils/` = our pure functions; `filterStorage` moves to its feature |

## D. Size and separation of concerns

| ID | Finding | Evidence | Proposal |
| -- | ------- | -------- | -------- |
| D1 | `TransactionFormDrawer.tsx` (1226 lines) mixes a 170-line schema, 300 lines of mappers, 4 mutations and a 700-line JSX tree with IIFEs; the items editor rebuilds arrays by hand instead of `useFieldArray` | `TransactionFormDrawer.tsx:61-527`, items at the render's Items field | Split: `transactionForm.ts` (schema + mappers), `useTransactionFormSubmit` (the 4 mutations + scope flow), field sections (`ItemsField` on `useFieldArray`, `RecurrenceFields`, `SeriesEditFields`) |
| D2 | `CategoryFormSheet.tsx` (717 lines): 10 helpers + schema + component + provider | see C1, C3 | Same split as D1 |
| D3 | `TransactionsTab.tsx` keeps search debounce, sort mapping, delete/series-scope flow, inline-save payload and CSV import inside the component; a `type` declared inside the component body | `TransactionsTab.tsx:60-250`, `DrawerState` at :148 | Hooks per concern (`useTransactionSearch`, `useTransactionActions`); payload building in `transactionForm.ts` |
| D4 | Page-level size guideline missing | — | **Your call**: a soft limit (e.g. a component file over ~250 lines needs a reason) |

## E. Convention drift

| ID | Finding | Evidence | Proposal |
| -- | ------- | -------- | -------- |
| E1 | `interface` for props despite "type over interface" | 9 non-DTO files, e.g. `TransactionTypeToggle.tsx:6`, `TransactionFormDrawer.tsx:236`, `SeriesScopeDialog.tsx`, `components/input/DatePicker.tsx` | Fix in passing; an ESLint rule (`@typescript-eslint/consistent-type-definitions: type`) enforces it |
| E2 | `function` declarations in features (13) next to arrow functions | `TransactionFormDrawer.tsx:232,246,270,305,317…` | **Your call**: is "arrow only" for components, or for every function? Then lint it |
| E3 | `FieldError` used two ways | `errors={[errors.x]}` in the home forms; `{errors.x && <FieldError>{…}</FieldError>}` in the auth pages | One way: `errors={[…]}` |
| E4 | No warning token: amber is hardcoded in two different shades; Badge hardcodes green; no typography primitive, so headings are raw `<h1>` with copied classes | `CategorySpendingList.tsx` (amber-700/400), `TransactionFormDrawer.tsx` (amber-600/400), `Badge.tsx`; 5 `<h1 className="text-foreground text-2xl font-bold">` | Add `--warning` to the theme; **your call** on a `Heading`/`Text` primitive vs Tailwind classes on raw tags |
| E5 | `//` comments in features (36) despite "JSDoc only" | e.g. `TransactionsTab.tsx:41,69,72`, `CategoryFormSheet.tsx:502` | **Your call**: keep the rule (convert to JSDoc or delete) or allow short `//` for non-obvious lines; several of these explain real constraints |

## F. Tests and stories

| ID | Finding | Evidence | Proposal |
| -- | ------- | -------- | -------- |
| F1 | Stories only for primitives | 16 stories, all primitives; 0 for app shared components; 0 for features | **Your call** on the bar. Recommended: every shared component gets a story with its states; feature components get one only when they have visual states worth seeing (e.g. `CategorySpendingList` ok/warning/over/hatch, `SummaryCards`) |
| F2 | Tests cover helpers well, components barely | Component behaviour only for 2 forms (`TransactionFormDrawer.test.ts`, `CategoryFormSheet.test.ts`, via exported helpers); no shared component tests | **Your call** on the bar. Recommended: every pure helper and hook tested (already the practice); interactive components get a Testing Library or story `play` test on their main behaviour; presentational ones are covered by the story |
| F3 | Storybook config errors | 15 `no-renderer-packages` (stories import `@storybook/react` instead of `@storybook/react-vite`), 1 uninstalled addon in `.storybook/main.ts` | Fix with the lint pass |

## G. Tooling and gates

| ID | Finding | Evidence | Proposal |
| -- | ------- | -------- | -------- |
| G1 | Lint is red, so it signals nothing | 66 errors | Make it green (most errors fall out of C1 and F3) |
| G2 | CI checks nothing before deploying | `.github/workflows/deploy.yml` | A `ci.yml` on PRs and before deploy: `lint`, `tsc --noEmit`, `vitest` (unit + storybook projects); the backend `./mvnw verify` stays local while it needs the DB tunnel |

---

## Not a problem (kept as is)

- Raw `div`/`span` used for layout inside a component is normal with Tailwind + shadcn. The issue is repeated visual patterns that were never extracted (B1–B6, E4), not intrinsic elements as such. `CategorySpendingList.tsx` has the most raw markup (31), but it is already split into 12 small named sub-components.
- Data layer (`src/api/services`), routing, providers and the form stack follow their conventions.
- No default exports, no `React.FC`.
