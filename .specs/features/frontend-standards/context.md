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

### Pending, proposed to close at C6/C7

- Split `src/components/` into `ui/` (vendored shadcn/Base UI primitives: never edited, only updated through the CLI, no story/test obligation) and `src/components/<name>/` (our components: editable, story required). Explained to the user on 2026-10-16. Approval expected; confirm at C6/C7.

---

## Process notes

- Skills are updated once, in one coherent pass, after the review. Decisions are recorded here as they are made, so a change of chat loses nothing.
