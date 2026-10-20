---
name: feature-structure
description: Decide where frontend code lives in the findraco SPA and which imports are allowed. Covers the folder map (features, `app/layout`, `app/routing`, `components/` families, `hooks/`, `lib/` vs `utils/`, `src/test/`), the colocation ladder for components, hooks and helpers, the layered import rules and their lint fragments, the provider pattern (`XxxProvider.tsx` + `useXxx.ts`), per-feature URL filter state with `useSearchParamGroup` and `PlanFiltersGate`, and wiring pages into the router (one route per destination). Use when scaffolding a feature, adding a file and deciding its folder, lifting shared code, adding a context provider, touching `eslint.config.js` layer restrictions, or judging an import. Triggers on "new feature", "feature structure", "folder structure", "scaffold a feature", "where does this file go", "move to shared", "lift to root", "provider", "context", "createContext", "cross-feature import", "no-restricted-imports", "app shell", "layout".
metadata:
  type: reference
---

# Feature Structure

The folder states a piece's scope, not its kind. Code is born where it is used and moves up only
when a wider scope needs it. Do not create folders that have no content yet.

Component anatomy and shared component families are in `component-creation`; service hooks and
handlers in `api-integration`; test infrastructure in `frontend-testing`.

---

## Folder map

```
frontend/
  eslint.config.js          layered import/syntax restrictions (see Layers)
  eslint/rules/             local lint rules (local/component-logic-cap, local/no-jsx-iife) + tests
  scripts/check-siblings.ts sibling test/story gate
  src/
    api/                    clients/, dtos/, services/ (useXxxService.ts + xxx.handlers.ts), types/, utils/
    app/                    the only layer that imports features
      providers/            global context: XxxProvider.tsx + useXxx.ts (useAuth, usePlanContext, useTheme)
      routing/              AppRouter, PrivateRoute, paths.ts, PlanFiltersGate, planParams.ts, filterStorage.ts
      layout/               app shell: MainLayout, AuthLayout, Navbar, Toaster, TabRowView, BottomBarView, navigation.ts
    components/             shared UI by family, primitives in <family>/base/
    features/
      overview/             filters/ (overview params + useOverviewFilters), components/, …
      transactions/         filters/ (transaction params + useTransactionFilters), components/, …
      categories/
      plans/
      auth/                 LoginPage, RegisterUserPage, ForgotPasswordPage, ResetPasswordPage; components/AuthCard, PasswordInput
      notFound/
    hooks/                  hooks used by 2+ features (usePlanPermissions, useSearchParamGroup, useDebounce)
    lib/                    adapters around a library or browser API (mergeClasses, storage)
    utils/                  our own pure functions (money.ts, formatters, memberColors)
    test/                   test infrastructure (server, setupUnit, renderWithProviders, scenarios)
```

- Features: `overview`, `transactions`, `categories`, `plans`, `auth`, `notFound`. There is no `home`
  feature and no tab composition: each destination is its own route (`/overview`, `/transactions`,
  `/categories`, `/plans`) and `/` redirects to `/overview`. The URL carries only that screen's filters
  and the plan (`?plan=`).
- A screen that is a route is named `XxxPage` (`OverviewPage`, `TransactionsPage`, `CategoriesPage`,
  `PlansPage`), with its view `XxxPageView`.
- The navigation (tab row, bottom bar, global add) lives in `MainLayout`, which derives the current
  destination from the pathname (`navigation.ts`); screens render content only.
- `auth` is one feature with four pages. `AuthCard` (on `Card`) and `PasswordInput` (on `InputGroup`)
  live in `auth/components/`, which states their real scope.
- `notFound` uses `ThemeToggle`, which is why `ThemeToggle` stays in `src/components/` and not in the
  shell.

### Inside a feature

| Level | Structure | When |
| --- | --- | --- |
| Minimal | `XxxPage.tsx` only | one page, no sub-components, no custom hooks |
| Standard | + `components/` | the page needs sub-components |
| Enhanced | + `hooks/` | a hook is used by 2+ components of the feature |
| Comprehensive | + `utils/` | a helper is used by 2+ components of the feature |

- Start at the smallest level that fits.
- A feature may have several pages; do not split a feature because its pages link to each other.
- Group related component clusters in named subfolders of `components/` (`components/overview/`).
- A hook or helper used by one component sits next to it, not in `hooks/` or `utils/` (ladder below).
  `components/` folders therefore mix `.tsx` and `.ts`.

---

## The colocation ladder

Code is born where it is used. When a sibling needs it, it moves up one level; when the scope grows,
it moves up again, possibly to the root.

| Rung | Components | Hooks and helpers |
| --- | --- | --- |
| 0 | inside the component's file (non-exported, JSX-only sub-components) | inside the component's file, until an extraction trigger fires (`component-creation`) |
| 1 | the feature's `components/` | its own `.ts` next to its single consumer (`spendingRows.ts` beside `CategorySpendingList.tsx`, with its test) |
| 2 | the parent module's `components/` (only when features are grouped under a module) | the feature's `hooks/` or `utils/` (second consumer in the feature) |
| 3 | `src/components/` | `src/hooks/`, `src/utils/` (second feature) |

- The root accepts components with domain names (`MemberDot`, `TransactionTypeToggle`, `Amount`).
  Scope decides the folder, not vocabulary.
- **Features never import from each other.** Anything two features need has been lifted. Enforced by
  lint `no-restricted-imports` on `@/features/*` everywhere outside `src/app/**`.
- When you lift a module, move its test with it, and update every import in the same commit.
- Two occurrences of a pattern are enough to extract (`component-creation`); this ladder decides where
  the extracted piece goes.

Why a ladder and not a separate domain layer (`entities/`, `shared/`): the folder then tells you who
uses the code, and a layer for a handful of files is premature abstraction.

---

## `lib/` vs `utils/`

- `src/lib/`: adapters around a library or browser API. `mergeClasses` wraps `clsx` + `tailwind-merge`;
  `storage` wraps `localStorage`.
- `src/utils/`: our own pure functions with no external dependency (formatting, masking, calculating,
  `money.ts`).
- A module that serves one area is not generic and goes down the ladder to that area:
  `filterStorage.ts` lives in `app/routing/` with the filters gate that uses it.

---

## The app shell and `app/`

- `src/app/layout/` holds the shell: `MainLayout`, `AuthLayout`, `Navbar`, the `Toaster`, and the
  mobile bottom bar and tab row. Only the router uses them, and they assemble features, so they sit
  above features. In `src/components/` they would create a two-way dependency with features.
- `app/` is the only layer that may import features.
- **Outside `app/`, import only `@/app/providers/*` (global context hooks: `useAuth`, `usePlanContext`,
  `useTheme`) and `@/app/routing/paths`.** Layouts, the router, the filters gate and any future `app/`
  folder are never imported from outside `app/`. Enforced by lint `no-restricted-imports`.
- Why not a "shell" feature: it must import other features, so it would start life as an exception to
  "features never import features".

### Screen filter state

URL filter state is split by owner:

| Piece | Lives in |
| --- | --- |
| Overview params + `useOverviewFilters` | `features/overview/filters/` |
| Transactions params + `useTransactionFilters` | `features/transactions/filters/` |
| `PlanFiltersGate`, plan param (`planParams.ts`), `filterStorage` | `src/app/routing/` |
| The "update this key group" mechanics | `src/hooks/useSearchParamGroup.ts` |

- A feature's filter hook builds on `useSearchParamGroup(keys, parse, serialize)`, which returns
  `{ value, update(fn), clear(keys?) }`. Filter updates use `replace`; a destination switch is a
  `<Link>` and pushes history.
- Every screen with filters goes through `PlanFiltersGate({ screen, paramKeys, children })` in
  `AppRouter`. Each feature exports its list of filter keys and the route passes it as `paramKeys`. The
  gate saves and restores that screen's query string per (user, plan, screen), so one screen's filters
  never change another's. A new filter param missing from its feature's list is not persisted, so add it
  to the list in the same change.
- Features share no filter. A filter that two features need would follow the ladder like anything else.

---

## Provider pattern: `XxxProvider.tsx` + `useXxx.ts`

Every context provider is two files:

- `XxxProvider.tsx` exports only the Provider component.
- `useXxx.ts` holds the `createContext` object (default `null`) and the hook, which throws when used
  outside the provider. It exports the context object too, so tests render it with explicit values.

```tsx
// usePlanContext.ts
import { createContext, useContext } from "react";

export type PlanContextValue = {
  activePlanId: number | null;
  setActivePlanId: (planId: number) => void;
};

export const PlanContext = createContext<PlanContextValue | null>(null);

export function usePlanContext() {
  const context = useContext(PlanContext);
  if (!context) throw new Error("usePlanContext must be used within a PlanProvider");
  return context;
}
```

```tsx
// PlanProvider.tsx
import { PlanContext } from "./usePlanContext";

export function PlanProvider({ children }: PlanProviderProps) {
  // state …
  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>;
}
```

Why:

1. A file that exports a Provider and a hook defeats Fast Refresh. Re-running it calls
   `createContext()` again, and already-mounted consumers no longer match the new context object
   ("must be used within a provider" during development).
2. Consumers import only the hook, so Provider internals never reach them.
3. It keeps the "component files export only components" rule (`component-creation`) without exception.

Enforced by lint `react-refresh/only-export-components` (the Provider file) and the sibling gate (the
hook holds a decision point, so it needs `useXxx.test.ts`: throws outside, returns the value inside).

Global providers live in `app/providers/`; a provider used by one feature lives in that feature, next
to its consumers (`CategoryFormSheetProvider.tsx` + `useCategoryFormSheet.ts`). Context-based compound
components (`Table`) follow the same split.

---

## Imports and layers

- `@/` for cross-folder imports; relative imports (`./`, `../`) only within the same feature. So any
  `@/features/…` import inside `src/features/` is cross-feature and fails lint.
- Never reach another feature with a relative path (`../../plans/x`). Lint sees the string, not the
  resolved path, so this escapes it; review and the Verifier catch it.

Restrictions per layer (`eslint.config.js`):

| Glob | `no-restricted-imports` | `no-restricted-syntax` |
| --- | --- | --- |
| `src/**` except `src/app/**` | all of `@/app/*` except `@/app/providers/*` and `@/app/routing/paths`; `@/features/*` | palette + typography + raw `<p>`/`<hN>` |
| `src/app/**` | none | palette + typography + raw `<p>`/`<hN>` |
| `src/components/**/base/**` | the above + `@/api/*` and all of `@/app/*` | palette only |

Everywhere, non-test files never import `*.handlers` or `@/test/*` (see `api-integration`).

**Changing a layer.** In flat config, when two blocks match a file and set the same rule, the later
block's options replace the earlier ones; a layer can silently lose a restriction while lint stays
green. So:

- The top of `eslint.config.js` declares named fragments (`paletteSelectors`, `typographySelectors`,
  `rawTextTagSelectors`, `appInternalsImports`, `crossFeatureImports`, `appAnyImports`, `apiImports`, …).
- Each layer block spreads the **complete** list for its layer, its parents' fragments included.
- A new layer gets a case in `eslint.config.test.ts`, which calls `ESLint#calculateConfigForFile` on one
  path per layer and asserts every expected fragment is active. Without the case, a forgotten fragment
  goes unnoticed.

---

## Expected output when scaffolding a feature

1. Propose the smallest valid tree (levels above) and say why each folder exists.
2. Name anything that must be lifted (a second feature needs it) and where it lands on the ladder.
3. Wire the page in `src/app/routing/AppRouter.tsx` as its own route, importing the page directly
   (`import { PlansPage } from "@/features/plans/PlansPage"`); no `index.ts` barrels. Add its path to
   `paths.ts`. A page with URL filters is wrapped in `PlanFiltersGate`; a new destination also joins
   `navigation.ts`.
4. Shell pieces (navigation, layout) go to `src/app/layout/`, never into a feature.
