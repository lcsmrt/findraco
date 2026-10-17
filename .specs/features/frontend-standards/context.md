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
  - `src/components/**` must not import `@/features/*` or `@/app/*` (C6).
  - `src/features/**` must not import `@/features/*`. Imports inside a feature are relative by convention, so any `@/features/…` import is cross-feature (colocation ladder).
- Residual cost, accepted: one extra folder level for families that are only a primitive. Revisit if it proves noisy.
- Path to this decision: a `ui/` split was proposed to protect "untouchable" primitives. The user questioned the premise, it did not hold, and the proposal was withdrawn. The user then kept the idea of a mechanical boundary, which became the `base/` marker plus lint.

---

## Process notes

- Skills are updated once, in one coherent pass, after the review. Decisions are recorded here as they are made, so a change of chat loses nothing.
