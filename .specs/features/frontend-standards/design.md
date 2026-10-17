# Frontend Standards Design

**Spec**: `.specs/features/frontend-standards/spec.md`
**Context**: `.specs/features/frontend-standards/context.md` (locked decisions)
**Status**: Draft (decisions recorded one at a time with the user)

---

## Architecture Overview

`context.md` already fixes the architecture: where code lives, what gets extracted, which gates exist. This design settles the open "how" decisions, in slice order:

1. `eslint.config.js` composition (STD-02; base for STD-05/06/08/09/12) — **decided**
2. CI and deploy layout, husky hooks (STD-03)
3. MSW setup and the session-refresh test (STD-04)
4. Where the home filter state lands when `features/home` is removed (STD-05)
5. `CurrencyInput` API and the locale/currency source of `formatMoney` (STD-06)
6. `Heading`/`Text` variant set (STD-08)
7. Story and test gate scripts (STD-10/11)
8. Local lint rule shape: logic cap + IIFE ban (STD-12)
9. OpenAPI generator (STD-13)

---

## Design Decisions

### 1. `eslint.config.js` composes layered restrictions from named fragments, guarded by a config test

**Problem.** The folder layers overlap (`components/**/base/**` ⊂ `components/**` ⊂ outside `app/`) and all use the same two built-in rules, `no-restricted-imports` and `no-restricted-syntax`. In flat config, when two blocks match a file and set the same rule, the later block's options **replace** the earlier ones. Verified on ESLint 9.39.5: a palette ban on `components/**` followed by a typography ban on `base/**` leaves `base/` files with no palette ban, and lint stays green.

**Decision.**

- The top of `eslint.config.js` declares named fragments: `paletteSelectors`, `typographySelectors`, `rawTextTagSelectors` (for `no-restricted-syntax`) and `appInternalsImports`, `crossFeatureImports`, `appAnyImports`, `apiImports` (for `no-restricted-imports`).
- Each layer block spreads the **complete** list for its layer, so the layer table below reads directly in the code:

| Glob | `no-restricted-imports` | `no-restricted-syntax` |
| --- | --- | --- |
| `src/**` except `src/app/**` | `@/app/layout/*`, `@/app/routing/*` except `paths` | palette + typography + raw `<p>`/`<hN>` |
| `src/app/**` | — | palette + typography + raw `<p>`/`<hN>` |
| `src/features/**` | the above + `@/features/*` | same |
| `src/components/**` | the above + `@/features/*`, `@/app/*` except `providers/*` and `routing/paths` | same |
| `src/components/**/base/**` | the above + `@/api/*`, all of `@/app/*` | **palette only** |

- A config test calls `ESLint#calculateConfigForFile` on one representative path per layer and asserts every expected fragment is active. A forgotten fragment becomes a red test instead of a silent gap.
- `tseslint.config()` (deprecated in typescript-eslint 8.65) is replaced by ESLint's `defineConfig()`.

**Rejected.**

- One local rule per concern (`local/token-colors`, …): unique names cannot collide, but it adds ~3 owned rules and reopens the "built-in rules, no plugin" decision (E4a, E4b, `base/`) for a problem a test already solves.
- `import/no-restricted-paths` (`eslint-plugin-import`, installed but unused): one block avoids collisions for imports, but resolving `@/` needs `eslint-import-resolver-typescript` (a new dependency), and it does nothing for `no-restricted-syntax`.

**Residual cost.** A new layer must spread its parents' fragments; the test catches the omission only if the layer gets a test case (rule written in the skill). Relative cross-feature imports (`../../plans/x`) escape `no-restricted-imports`, which sees the string, not the resolved path; review and the Verifier cover them, and cross-folder imports use `@/` by convention.

**Reversibility.** Full: one config file, no application code involved.

---

## Risks & Concerns

| Concern | Location (file:line) | Impact | Mitigation |
| ------- | -------------------- | ------ | ---------- |
| Same-rule options replace across flat-config blocks | `frontend/eslint.config.js` | A layer silently loses a restriction; lint stays green | Decision 1: named fragments + `calculateConfigForFile` test |
| Unused lint devDependencies: `eslint-plugin-import`, `eslint-plugin-check-file`, `eslint-plugin-prettier`, `eslint-config-prettier` | `frontend/package.json` | Dead dependencies suggest rules that do not run | Remove in STD-02 |
