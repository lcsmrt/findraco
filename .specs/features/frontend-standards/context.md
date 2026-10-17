# Frontend Standards Context

**Gathered:** 2026-10-16 (in progress)
**Input:** `.specs/codebase/frontend-quality-audit.md`
**Status:** Discussing. Each audit finding is reviewed one at a time (user, 2026-10-16), in dependency order: structure (C) → components (B) → separation (D) → conventions (E) → tests and stories (F) → gates (G).

---

## Feature Boundary

Frontend coding standards in `finsight`: where code lives, what gets extracted, when a component gets a story or a test, and the gates that enforce them. The output is updated skills and `CLAUDE.md` in this repo (a shared skills repo is deferred, user 2026-10-16), plus refactor slices that bring existing code in line. Mobile-navigation (M5-09) waits at "spec approved" and is the first feature built under these standards.

---

## Decisions

### C4 — `features/home` is split

- Overview, Transactions and Categories become sibling features under `src/features/`, next to Plans. `home` stops being a feature.
- Routes stay as they are (`/?tab=…`). The URL filter state shared by the tabs (`useHomeFilters`, `HomeFiltersGate`) is settled in mobile-navigation's Design, together with the app shell.

### C4b — Colocation ladder (user's pattern, adopted with three refinements)

- Code is born where it is used. When a sibling needs it, it moves up one level; when the scope grows, it moves up again, possibly to the root.
- Concrete levels: inside the component's file → the feature's `components/` → the parent module's `components/` (only when features are grouped under a module) → `src/components/`.
- The ladder applies to hooks and utils too: the feature's `hooks/` and `utils/` → `src/hooks/` and `src/utils/`.
- The root accepts components with domain names. The old rule ("anything with domain language stays inside the feature") is dropped, since it contradicts the ladder.
- Consequence: features never import from each other. Anything two features need has been lifted.
- Applied today: `MemberDot` and `memberColors` (overview + categories) and `TransactionTypeToggle` (transactions + categories) move to the root.
- Rejected alternatives: a separate domain layer (`entities/`, `domain/`, `shared/`). For three files it is premature abstraction, and the user found it unclear.

### Shared components — organised by family, primitives marked by `base/`

- No separate `ui/`/`primitives/` folder. `src/components/` stays organised by family: a family folder holds both its primitives and the compositions built on them, as `table/` and `input/` already do.
- The primitive pieces of a family (code that came from shadcn/Base UI) live in `<family>/base/`. Example: `button/base/Button.tsx`, `input/base/Input.tsx`, `table/base/TableParts.tsx`.
- Primitives are **ours and editable**, but only for changes that apply to the whole app: tokens, variants, loading state, a11y fixes. Domain or screen behaviour goes into a composition. This replaces the `CLAUDE.md` rule "don't modify shadcn primitives", which was already broken by `Button` `isLoading` and `Badge` `success`, for good reasons.
- New primitive: install with the shadcn CLI, then move it into `<family>/base/` (the CLI writes flat files).
- Lint (built-in `no-restricted-imports`, no new dependency):
  - `src/components/**/base/**` must not import `@/features/*`, `@/app/*` or `@/api/*`.
  - `src/components/**` must not import `@/features/*`, nor anything under `@/app/*` except `@/app/providers/*` and `@/app/routing/paths` (C6).
  - `src/features/**` must not import `@/features/*`. Imports inside a feature are relative by convention, so any `@/features/…` import is cross-feature (colocation ladder).
- Residual cost, accepted: one extra folder level for families that are only a primitive. Revisit if it proves noisy.
- Path to this decision: a `ui/` split was proposed to protect "untouchable" primitives. The user questioned the premise, it did not hold, and the proposal was withdrawn. The user then kept the idea of a mechanical boundary, which became the `base/` marker plus lint.

### C5 — One `auth` feature

- `login/`, `registerUser/`, `forgotPassword/` and `resetPassword/` merge into `src/features/auth/` with four pages. The shared `AuthCard` and `PasswordInput` (B4) live in `auth/components/`, so their location states their real scope. Without the merge, the ladder would push them to the root.

### C6 — App shell lives in `src/app/layout/`

- `MainLayout`, `AuthLayout`, `Navbar`, the `Toaster` (sonner) and mobile-navigation's bottom bar and tab row move to `src/app/layout/`. Only the router uses them (ladder), and they assemble features, so they must sit above them. In `src/components/` they would create a two-way dependency with features.
- `ThemeToggle` stays in `src/components/` (used by the shell and the 404 page).
- Import rule: outside `app/`, code may import only `@/app/providers/*` (global context hooks: `useAuth`, `usePlanContext`, `useTheme`) and `@/app/routing/paths`. Layouts and the router are never imported from outside `app/`. `app/` is the only layer that may import features.
- Rejected: shell as a feature. It needs to import other features, so it would start life as an exception to "features never import features".

### C1 — Component files export only components; concrete extraction triggers

- A component `.tsx` exports only components (`react-refresh/only-export-components`). Fast Refresh needs this to swap components in place and keep state; a mixed file forces a full reload.
- Non-exported helpers may stay in the component's file (rung zero of the ladder) unless they hit a trigger. A helper moves to its own `.ts` module, with a test, when it has any of:
  1. a branch or loop that computes a value (`if`, ternary, `switch`, `reduce`, `map` with logic); a ternary that only picks a className does not count;
  2. arithmetic on money, dates or quantities;
  3. a business rule, i.e. something the spec defines (an AC or a requirement ID);
  4. more than 10 lines.
- What stays inside: one-expression formatters, className builders, constants, JSX-only sub-components.
- Example: the transaction form's schema and mappers become `transactionForm.ts`.

### D4 — Cap on component logic, not file size (user's refinement)

- A local ESLint rule (in `eslint.config.js`, no package) limits a component, meaning a PascalCase function returning JSX, to **60 lines from the start of its body to its main `return`**. Above that, extract a `useXxx` hook. The cap is hard, with no escape, because extracting logic into a hook is always possible.
- The same rule forbids IIFEs inside JSX (`{(() => …)()}`), which hide logic from the count.
- No file-size cap. A large JSX tree can be a legitimately rich screen; `CategorySpendingList.tsx` (325 lines, 12 small sub-components) is fine.
- **No bypasses anywhere:** `linterOptions.noInlineConfig: true` makes ESLint ignore `eslint-disable` comments, and `@typescript-eslint/ban-ts-comment` forbids `@ts-ignore`, `@ts-expect-error` and `@ts-nocheck`. If a number proves wrong, it changes for everyone; no per-file exceptions.
- Residual cost: the local rule is code we own (~40 lines plus a test).

### C2 — An extracted module sits next to its consumer

- A `.ts` module used by one component sits next to it (`components/overview/spendingRows.ts` beside `CategorySpendingList.tsx`, with its test). A second consumer in the feature lifts it to the feature's `utils/`, and from there it follows the ladder to `src/utils/`.
- The folder states the scope, not the kind: one principle for components, hooks and helpers. This replaces the old "pure helpers always go in `utils/`" rule.
- Residual cost: `components/` folders mix `.tsx` and `.ts`.

### C3 — Provider pattern: `XxxProvider.tsx` + `useXxx.ts`

- Every context provider is two files. `XxxProvider.tsx` exports only the Provider component. `useXxx.ts` holds the `createContext` object and the hook, which throws when used outside the provider.
- Why: (1) a file exporting a Provider and a hook defeats Fast Refresh, and re-running it calls `createContext()` again, producing a new context object that already-mounted consumers do not match ("must be used within a provider" during dev); (2) consumers import only the hook, so Provider internals never touch them; (3) no exception to C1.
- Applies to the 6 current providers (`app/providers/*` ×4, `CategoryFormSheet`, `SeriesScopeDialog`) and to future ones.

### C8 — `components.json` points at the real names

- `utils` → `@/lib/mergeClasses`, `css` → `src/index.css`, `ui` → `@/components`. The project's names are kept: `mergeClasses` describes its content where `utils` invites a junk drawer, and `index.css` is the Vite default (`globals.css` is a Next.js habit). Cost: a snippet pasted from the shadcn docs needs its `cn` import adjusted by hand.

### C9 — `lib/` vs `utils/`

- `src/lib/` holds adapters around a library or browser API (`mergeClasses` wraps `clsx` + `tailwind-merge`; `storage` wraps `localStorage`). `src/utils/` holds our own pure functions with no external dependency (formatting, masking, calculating).
- `lib/filterStorage.ts` is the home tabs' filter persistence, not generic, so it moves down the ladder to wherever the filter state lands (mobile-navigation Design).

### Rule: check shadcn and Base UI before writing a component by hand (user, at B1)

- Before building a UI component, check the shadcn registry (Base UI flavour) and Base UI itself. Install from shadcn when it exists; compose Base UI when shadcn lacks it; hand-write only what neither offers.
- shadcn pieces worth remembering for later items: `Empty` (empty states), `Typography` (E4/C7), `Drawer` (bottom sheet), `Item` (list rows), `Tabs`, `Button Group`.

### B1 — `ToggleGroup` from shadcn (Base UI)

- Install `toggle-group` (and its `toggle` dependency) through the shadcn CLI once C8 is fixed, then move it to `toggleGroup/base/` and `toggle/base/`.
- Edit the primitive (an app-wide change) to add `tone` colours (primary / destructive / success) and a `chip` variant.
- `TransactionTypeToggle` becomes a ~10-line composition at the root. The recurrence mode toggle, the category limit mode toggle, the three `AttributionFields` toggles and `MemberFilterChips` use the primitive.
- This also fixes a hidden defect: the hand-built toggles do not expose the selected state (`aria-pressed`) or arrow-key navigation.

### B2 — Masked inputs

- Integer inputs (installments) use Base UI `NumberField` (min 1, step 1). The 3 IIFE "digits only" inputs go away.
- Money uses our own `CurrencyInput`, a composition over `Input`, with **ATM-style typing**: each digit enters from the right (1234 → R$ 12,34), numeric keypad only, as today and as in Brazilian banking apps. It **shows the mask but hands the form a number**. The masked string never leaves the component, so the 4 parse implementations go away. Neither shadcn nor Base UI offers this typing.
- Rejected: Base UI `NumberField` with currency format (free typing with a comma, formatted on blur). User chose ATM-style typing.

### B3 — `FormSheet`, the shared skeleton of sheet forms

- `FormSheet` in `src/components/` (used by two features) holds only the skeleton: Sheet, title, scrolling form, footer with Cancel/Submit and loading state, and a `mobileActions` slot (Delete, Duplicate, New subcategory). Everything specific to a form stays in that form.
- Bonus: if the sheet becomes something else on mobile (e.g. a bottom `Drawer`, the category-form UX topic), the change happens once for every form.
- The user first declined ("only 2 cases"), then reversed: a possible future change of container is no reason to keep duplicating.
- Risk to watch: per-case props piling up. Keep it to the skeleton.

### B4 — Auth pieces

- `AuthCard` (built on the existing `Card`; today the four pages re-implement it with raw classes) and `PasswordInput` (built on `InputGroup`; neither shadcn nor Base UI has one) live in `auth/components/`.
- Button labels are plain text, not `<p>` (5 places). Any font weight comes from a `Button` variant.

### B5 — `PlanNameDialog`

- `CreatePlanDialog` and `RenamePlanDialog` merge into `PlanNameDialog` with a required `mode: "create" | "rename"`. Title and submit derive from `mode`, as the existing multi-mode form convention says.
- A "rule of three" (extract on the third occurrence) was discussed and **not adopted**. The user prefers to standardise now and split later if the cases ever need to diverge.

### B6 — One money-formatting logic, ready for i18n

- One money module: `formatMoney(value)` for display, and the same engine drives the `CurrencyInput` mask (B2). Both read locale and currency from **one source**. Today that source is a constant in one place (`pt-BR`, `BRL`). With i18n it becomes the user's locale plus the plan's (or user's) currency, and no screen changes.
- Locale and currency are independent: the viewer's language sets the formatting, the data sets the currency. The 11-entry currency → locale table in `maskCurrency` goes away, since it is conceptually wrong under i18n and `Intl` formats any currency in any locale.
- The three local `money` shortcuts go away.
- `Amount` component (root; used by transactions and overview): value + type → signed, toned (red debit / green credit), monospace. Uses `formatMoney`.
- Context: the user plans to internationalise the app soon (ROADMAP M5-10).

### B7 — `usePlanPermissions()`

- A hook in `src/hooks/` (used by several features) returns named capabilities that mirror `PlanAuthorization.java`: `canCreateTransactions`, `canAttributeToOthers`, `canManageCategories`, `canManagePlan`. Screens ask "may I?" instead of "what is my role?". The rules live in one place, with a test over the role × capability matrix. It also handles "role still loading" once (mobile-navigation edge case).
- Replaces the 5 inline `myRole === …` checks.
- Residual cost, accepted: the rules are still duplicated between backend and frontend. An endpoint returning capabilities would remove that, but is not worth it today.

### D1 (+ B8) — `TransactionFormDrawer` decomposition

- Mostly dictated by earlier rules: schema and mappers → `transactionForm.ts` with tests (C1, C2); the 4 mutations and the series-scope flow → `useTransactionFormSubmit` (D4); IIFEs → `CurrencyInput`, `NumberField` and a tested helper for "last installment" (B2, D4, C1); mode buttons → `ToggleGroup` (B1); skeleton → `FormSheet` (B3); End date and Number of installments, written twice today, become one field component each, used by create and series edit (B8).
- New: the items list uses `useFieldArray` (`ItemsField`), replacing the manual array rebuild on every keystroke and the repeated `watch("items")` that re-renders the whole form.
- Target: the main component becomes ~150–250 lines of section composition. It is its own refactor slice, guarded by `TransactionFormDrawer.test.ts` and `.series.test.ts`.

### D2 — `CategoryFormSheet` decomposition, and the `useFieldArray` rule

- By rule: helpers, schema and mappers → `categoryForm.ts` (C1, C2); provider → `CategoryFormSheetProvider.tsx` + `useCategoryFormSheet.ts` (C3); logic → `useCategoryFormSubmit` (D4); skeleton → `FormSheet` (B3); `CurrencyInput` and `ToggleGroup` in the limit fields (B2, B1). It is its own refactor slice.
- **Rule (forms skill): every dynamic list inside a form uses `useFieldArray`.** It applies to transaction items, `memberLimits` (`CategoryLimitFields`) and `participants` (`AttributionFields`, 4 manual `setValue("participants", …)` today).

---

## Process notes

- Skills are updated once, in one coherent pass, after the review. Decisions are recorded here as they are made, so a change of chat loses nothing.
