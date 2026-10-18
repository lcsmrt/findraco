# Frontend Standards Context

**Gathered:** 2026-10-16 to 2026-10-17
**Input:** `.specs/codebase/frontend-quality-audit.md`
**Status:** Spec approved 2026-10-17; next is Design.

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

### D3 — `TransactionsTab` decomposition

- `useTransactionSearch` (debounced draft ↔ URL); `transactionSort.ts` beside it, with a test (column ↔ sort-field maps); `useTransactionActions` (edit, duplicate, delete with series scope or confirm, drawer state); the inline-save payload becomes a mapper in `transactionForm.ts`; `useCsvImport`; `DrawerState` moves to module scope.
- New: `toPagination(page)` in `src/api/utils/`, next to `buildPagedQuery` (the inverse), replacing the hand-built paged-response → table pagination mapping.
- Done together with, or right before, mobile-navigation's implementation, since NAV-02 moves "create" from this tab to the shell's global add. `useTransactionActions` keeps edit, duplicate and delete.

### E1 — `type` everywhere

- `type` for every object type, DTOs included, enforced by `@typescript-eslint/consistent-type-definitions: "type"` (autofix; ~32 files). Reason: `interface` declarations merge silently; `type` covers objects, unions and intersections, and the discriminated unions the project relies on. The only legitimate `interface` use, augmenting a library's types, does not occur today; if it does, the rule changes for everyone.
- **Addendum (2026-10-17, Execute T11):** it does occur. `findracoApi.ts` augments axios's `AxiosRequestConfig` with `sessionRetried`, which only an `interface` can merge. Rule changed for everyone: library augmentations live in `*.d.ts` files (`src/api/clients/axios.d.ts`), and `consistent-type-definitions` is off for `**/*.d.ts`. Application code still never declares an `interface`.

### Form value types: `XxxFormValues` + `XxxFormOutput` (user, 2026-10-17, Execute)

- `XxxFormValues = z.input<typeof schema>` (what fields hold while editing; `null` when empty) and `XxxFormOutput = z.output<typeof schema>` (what a valid submit hands over; a type-predicate `refine` narrows required `number | null` to `number`). `useForm<XxxFormValues, unknown, XxxFormOutput>`; `toPayload` takes `XxxFormOutput`, so it needs no `!` or `as`.
- Both names always exist, even when identical: they name two moments of the form, not one thing twice, so every form reads the same.
- Rejected: `XxxFormSubmitValues` (longer, leaves zod's vocabulary); declaring the output type only when it differs (the `toPayload` signature would vary per form); renaming `Values` to `Input` for symmetry. "Values" is react-hook-form's vocabulary (`defaultValues`, `getValues`), and "Input" already names components here (`Input`, `CurrencyInput`), so `TransactionFormInput` would read as a component.

### E2 — `function` declarations at top level, arrows for callbacks (react.dev style)

- Components, helpers and handlers declared inside components use `function` declarations. Arrows are for callbacks passed inline (`onClick={() => …}`, `.map((x) => …)`).
- Chosen on intrinsic merit, setting migration cost aside: it matches react.dev and shadcn (snippets and generated code arrive this way), generics are clean in `.tsx`, and overloads are possible. Trade-off accepted: a function type annotation (`const f: UseFormSetValue<T> = …`) is no longer available; type the parameters instead.
- Lint: `func-style: ["error", "declaration"]`. It flags function expressions and arrows assigned to variables; inline callbacks are unaffected. Verify the exact options (e.g. typed arrow assignments) against the ESLint docs at implementation.
- Cost: ~340 conversions without autofix. A dedicated mechanical slice (a codemod is worth trying). `CLAUDE.md` ("`export const Foo = (props) => {}`") and the component skill are rewritten.
- Myth noted for the skill: hoisting is not needed to keep helpers below the component, since a helper defined below is already loaded by render time.

### E3 — `FieldError` always takes `errors={[…]}`

- One form. The component already renders nothing without an error and lists several. The auth pages' `{errors.x && <FieldError>{…}</FieldError>}` re-implements that by hand. No ready lint rule exists, so it goes in the forms skill; the fix rides on the auth refactor (C5).

### E4a — `--warning` token; meaningful colour only from tokens, lint-enforced

- Add `--warning` / `--warning-foreground` to both themes, next to `success`. Replace the two hand-written ambers (`CategorySpendingList` amber-700/400, `TransactionFormDrawer` amber-600/400) with `text-warning`, and the `Badge` hand-written greens with `success`.
- Rule: colour that carries meaning comes from a theme token, never from the raw palette.
- Lint without a plugin (Tailwind 4 plugin support is uneven): built-in `no-restricted-syntax` with a regex over string literals and template elements, e.g. `(text|bg|border|ring|fill|stroke|outline|decoration)-(red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|slate|gray|zinc|neutral|stone)-\d+`, with a message pointing to the tokens. It catches `className="…"` and `cn(…)` arguments alike. Calibrate the regex at implementation (e.g. whether neutral greys are allowed).

### E4b + C7 — Typography in the design system, lint-enforced

- `Heading` and `Text` live in `typography/base/` (design-system primitives).
  - `<Heading level={1..6} variant="page" | "section" | "subsection">`: `level` picks the semantic tag from the document outline, `variant` picks the look from the design role. They are deliberately separate.
  - `<Text variant="body" | "muted" | "caption" | … as="p" | "span" | …>`.
- Enforcement (built-in lint, no plugin), outside `**/base/**`:
  1. no raw `<p>` or `<h1>`–`<h6>` (`no-restricted-syntax` JSX selector);
  2. no font-size or font-weight classes (`text-xs`…`text-9xl`, `font-thin`…`font-black`) in strings. Alignment (`text-left/center/right`) and family (`font-mono`) stay allowed. Calibrate at implementation.
  Together they leave `Heading`/`Text` as the only way to size or weight text. Colour stays free but token-only (E4a).
- Primitives in `base/` (`Label`, `Button`, `Badge`, `FieldDescription`, inputs) keep their own built-in text styles, so nobody writes `<Label><Text>`.
- `SectionHeader` (C7) is kept and adopted. A new `PageHeader` is added. Both are compositions of `Heading`/`Text`. Field help text uses the existing `FieldDescription` (16 raw `<p className="text-muted-foreground text-xs|sm">` today).
- Variant curation: a new variant must name a role, never a screen (no `summaryCardBigNumberMobile`). A case that fits no variant gets a new role variant, never an exception.
- Known limits: text rendered by libraries (Recharts labels, toast content) is out of the linter's reach; pass tokens there.
- Path: the agent first recommended "components only for structural roles" (C), weighing migration effort. The user's criterion is quality over effort, and enforced typography removes C's residual inconsistency, so the agent changed its recommendation. Shadcn's "Typography" is a CSS sheet (Typeset) for prose, not components.

### E5 — Comments explain why, in words, without spec IDs

- JSDoc documents what is exported (the contract).
- `//` is allowed only for **why**: a constraint, a non-obvious consequence, a decision someone might otherwise "simplify" and break. The sentence must carry the context ("if this changes, X breaks"), not just label a rule.
- A comment that narrates **what** the code does is replaced by a better name or an extraction.
- No spec/requirement IDs in comments or JSDoc. Traceability to the spec lives in test names. Colocated tests (C2) sit next to the code, cite the ACs, and break when the behaviour changes; a comment never does. The current IDs (e.g. `(CAT-15)`, `(UX-02 AC 5)`) are removed, and shallow comments are enriched or turned into names.
- This replaces the `CLAUDE.md` rule "no comments except JSDoc", which would have forced moving line-level "why" comments away from their lines, or deleting them. Most of the 36 current `//` comments are good "why" comments and stay.
- Not lint-enforceable: why vs what is about content, not form. Enforced in the skill and in review (Verifier).
- Path: the agent first proposed allowing spec references, then dropped them too quickly when the user asked "do we need them?", using an argument ("IDs rot") that applies to the sentence as much as to the ID. Re-tested together, the decision rested on the readers: noise for the user, redundant with the colocated test for agents, and a risk of IDs replacing context.

### F1 — Stories: every piece of UI with its own visual

- **Criterion:** a component with its own visual has a story. If it cannot render from props alone, its visual is extracted into a component that can (container + view). A well-made container has no visual of its own (it fetches and passes down), so every piece of UI ends up covered.
- **Presentational** = renders only from props plus local UI state (`useState`, `useReducer`, refs for open, hover, input drafts). **Container** = takes data or causes effects from outside: service hooks (`@/api/services`), app context hooks (`@/app/providers`), router hooks (`react-router-dom`), or our hooks built on them. Practical test: can a story render it with props only, with no provider, API or router? React Hook Form sections (`useFieldArray`) count as presentational; the story wraps them in a test form.
- **Story checklist:** one story per variant; one per state the component handles (empty, loading, error); extreme content (long text, big values, many items); mobile viewport when the layout changes. Not a token "Default" story.
- **Role of stories:** first a workshop (develop and see every state in isolation, which matters for the mobile-first work ahead) and documentation (the story list is the state list). Second, a free test: render plus a11y. `play` covers basic interactions only (open, select). Business logic is unit-tested (F2), never simulated through clicks. This matches the Storybook team's own testing direction; it is not a distortion.
- **Enforcement:** `npm test` runs the `storybook` vitest project too; addon-a11y set to fail (`a11y: { test: "error" }`). A gate script requires a sibling `.stories.tsx` for every component file that does not directly import `@/api/services`, `@/app/providers` or `react-router-dom`. It cannot see our hooks that wrap those, so it errs on the strict side and pushes the container/view split; refine later if it gets in the way.
- Costs accepted: stories for trivial components; a11y in error mode surfaces existing issues at once; tests run slower (real browser).

### F2 — What gets which test

| What | Covered by | Enforced by |
| --- | --- | --- |
| Logic: `.ts` modules (C1 triggers), our hooks with logic, mappers, service hooks | unit tests (Vitest; `renderHook` for hooks) | gate script: every logic `.ts` has a sibling `.test.ts` (DTOs, types and constants exempt); **≥ 90% branch coverage on logic modules and hooks only**, never global |
| Visual: presentational components | stories (F1), with basic interactions in `play` | F1 script |
| Flows: what a container orchestrates, as the spec's ACs describe | **integration tests**: Testing Library `render` of the real screen (providers, TanStack Query cache, hooks, `findracoApi` with its interceptors), with **only the network simulated by MSW** | tlc execution contract + Verifier (spec-anchored check, mutants) |

- Rule: flow tests never `vi.mock` our own modules. Today's service-hook tests mock `findracoApi`, which skips the session-refresh interceptor, base URL and param serialisation. MSW intercepts at the network, is independent of the HTTP client, and its handlers can be reused in stories or for running without a backend.
- Testing Library is the query/interaction library in both places: `storybook/test` re-exports it for `play`, and integration tests use `render` directly. No duplication: presentational interactions live in `play`, not in a second test.
- **Generated API types (OpenAPI):** frontend DTOs are generated from the backend's OpenAPI schema (springdoc/Swagger) instead of hand-written, and MSW handlers are typed with them, so a handler that drifts from the real API fails to compile. This is the Java-backend equivalent of sharing TS types with a Node backend. Pact-style contract tests are not needed: same team, one deploy. It touches the backend too, so it is its own slice. Caveat: generated types still describe JSON (a `Date` arrives as a string).
- **E2E smoke tests (Playwright, already installed):** 3–5 critical journeys (sign in, add a transaction, see it on the Overview, switch plans) against the real backend and DB. Sequenced **after** the ROADMAP task "local dev database in Docker", since E2E cannot run against the database `mvn verify` empties.
- Not adopted now: visual regression (story screenshots). Baselines would churn during the UX rounds; revisit when they slow down.
- Coverage numbers can be gamed (cover a branch without asserting). The Verifier's mutation sensor is the counterweight.

### F3 — Storybook configuration

- Stories import types from the framework package `@storybook/react-vite`, not the renderer `@storybook/react` (15 files). Remove `@storybook/addon-backgrounds` from `.storybook/main.ts`, since it is core in Storybook 9. Set `a11y: { test: "error" }` in `preview.tsx` (F1).

### G1 — Lint is green on `main`, always

- No warning phase. Each new rule lands in the same slice, and the same commit, that fixes its violations. The first slice clears today's 66 errors, most of which fall out of C1, C3 and F3. Until a rule's slice lands, that standard holds only through the skill. A short, known window.

### G2 — Gates before production

- **CI on GitHub Actions** (free and unlimited, since `lcsmrt/finsight` is public; a self-hosted runner on the VPS is rejected because it would compete with production, and GitHub advises against self-hosted runners on public repos), on every push:
  - frontend job: `lint`, `tsc` (via `build`), `vitest` with the `unit` and `storybook` projects (installs the Playwright browser), the 90% branch-coverage gate on logic and hooks, and the story/test sibling scripts;
  - backend job: `./mvnw test` (unit tests, no DB). The full `./mvnw verify` with `*IT` joins once the local Postgres in Docker exists, via a CI service container.
- **Deploy depends on CI:** the deploy job `needs` both CI jobs. A red commit never reaches production.
- **Local hooks via husky.** It is already installed (`prepare` script), but `.husky/` has no hooks. `pre-commit` runs `lint-staged` (lint on changed files). `commit-msg` runs the tlc `check_commit.py` (Conventional Commits). Value here: feedback in seconds, before a broken commit exists, which matters with ~156 commits a month, mostly by agents. Hooks can be skipped with `--no-verify`; CI cannot, and CI is the real guarantee.

### A1–A3 — Root causes, closed by the above

- A1 (no story rule) → F1. A2 (no test rule) → F2. A3 (rules exist but nothing enforces them) → the lint rules recorded above, plus G1 and G2.

---

## Process notes

- Skills are updated once, in one coherent pass, after the review. Decisions are recorded here as they are made, so a change of chat loses nothing.
