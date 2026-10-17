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

---

## Process notes

- Skills are updated once, in one coherent pass, after the review. Decisions are recorded here as they are made, so a change of chat loses nothing.
