# Frontend Standards Tasks

## Execution Protocol (MANDATORY -- do not skip)

Implement these tasks with the `tlc-spec-driven` skill: **activate it by name and follow its Execute flow and Critical Rules.** Do not search for skill files by filesystem path. The skill is the source of truth for the full flow (per-task cycle, sub-agent delegation, adequacy review, Verifier, discrimination sensor).

**If the skill cannot be activated, STOP and tell the user - do not proceed without it.**

---

**Spec**: `.specs/features/frontend-standards/spec.md`  
**Design**: `.specs/features/frontend-standards/design.md` (approved 2026-10-17)  
**Status**: Approved 2026-10-17 — In Progress

**Scope**: STD-01..STD-12. STD-13 is deferred until after the backend standards review (design decision 10) and STD-14 is blocked by the local Docker database; each gets its own tasks when unblocked.

**Execution notes**

- All frontend commands run from `frontend/` with pnpm (workspace root `pnpm-lock.yaml`). Install dependencies with `pnpm add` at exact versions.
- One task = one Conventional Commit (the `Commit` line). From T31 on, the `commit-msg` hook checks it.
- G1: from T29 on, `pnpm lint` exits 0 on every commit; a rule lands in the same commit that fixes its violations. Before T29, a commit never raises the lint error count (baseline 66).
- No `eslint-disable`, `@ts-ignore`, `@ts-expect-error` or `@ts-nocheck`, ever (AD-010). A wrong rule changes for everyone.
- Tasks marked "checked, reverted" prove a guard by breaking it once; the breaking change is never committed.
- Pushing is the user's call. STD-03/04 CI criteria are verified on the first push after T33/T42; ask before pushing (a push to `main` deploys).
- Baseline before T10: `unit` project 35 files, 356 tests, all green.

---

## Test Coverage Matrix

> Generated from codebase, project guidelines, and spec - confirm before Execute. Guidelines found: `CLAUDE.md`, `.specs/codebase/TESTING.md`, `frontend/vite.config.ts` (`unit` + `storybook` projects), `frontend/package.json`, `context.md` F1/F2, `design.md` decisions 3, 8, 9, AD-012.

| Code Layer | Required Test Type | Coverage Expectation | Location Pattern | Run Command |
| ---------- | ------------------ | -------------------- | ---------------- | ----------- |
| Logic module (`.ts` with a decision point, arithmetic or iteration callback) and hooks with logic | unit | All branches; 1:1 to the ACs it serves; every listed edge case; ≥ 90% branches once T114 lands | sibling `*.test.ts(x)` | Quick |
| Service hooks and API client | unit through MSW (from T35) | Every function touched: method, URL, params/body, response mapping; 401 → refresh → retry | sibling `*.test.ts` + `*.handlers.ts` | Quick |
| Flow (screen or container whose behaviour a task changes) | integration (`unit` project, `renderWithProviders`, network via MSW only) | Happy + edge + error paths of the ACs touched; existing tests adapted only in imports and value entry | sibling `*.test.tsx` | Quick |
| Presentational component | story (`storybook` project, a11y in error mode from T41) | Story checklist: each variant, each handled state (empty, loading, error), extreme content, mobile viewport when the layout changes; `play` for basic interactions | sibling `*.stories.tsx` | Full |
| Tooling: ESLint config, local rules, gate script | unit (`tooling` project, Node) | A passing and a failing case per AC; the config test asserts every fragment per layer path | `eslint.config.test.ts`, `eslint/rules/*.test.ts`, `scripts/*.test.ts` | Quick |
| Pure moves and renames, constant and type modules | none (existing tests move with their subjects) | Build gate | - | Build |
| Skills, docs, CI workflow, husky hooks, `components.json` | none (automated) | Docs gate or the manual check in the task; CI criteria on the first push | - | Docs / Build |

## Gate Check Commands

> Generated from codebase - confirm before Execute. Run from `frontend/`.

| Gate Level | When to Use | Command |
| ---------- | ----------- | ------- |
| Docs | Skill and doc tasks (Phase 1) | none; the task's `Done when` checked against `context.md` and `design.md` |
| Quick | Tasks with unit, integration or tooling tests | `pnpm exec vitest run --project=unit --project=tooling` |
| Full | Tasks with stories | `pnpm exec vitest run` (every project); from T116 on: `pnpm test` (adds the sibling and coverage gates) |
| Build | Phase end, config, moves, lint rules | `pnpm lint && pnpm build && pnpm exec vitest run` (from T116: `pnpm lint && pnpm build && pnpm test`). Before T29, lint passes when its error count is not higher than the previous commit's: `pnpm exec eslint . -f json \| python3 -c "import json,sys; print(sum(len(f['messages']) for f in json.load(sys.stdin)))"` |

---

## Execution Plan

Phases are ordered and run sequentially - each phase completes before the next begins, and tasks within a phase execute in order. Diagrams show dependencies inside a phase; dependencies on earlier phases are listed in each task.

### Phase 1: Written standards (STD-01)

Every decision in `context.md` and `design.md` written once, where work starts. Rules whose slice has not landed yet hold through the skill only (G1).

```
T1 → T2
T1 → T3
T1 → T4
T1 → T5
T1 → T6
T2 → T6
T3 → T6
T4 → T6
T5 → T6
T6 → T7
T6 → T8
T5 → T9
```

### Phase 2: Lint baseline: config and mechanical fixes (STD-02)

Lint is red at 66 errors until T29. Until then each commit keeps the error count at or below the previous one.

```
T10 → T11
T12
T13
```

### Phase 3: Lint baseline: providers (STD-02, C3)

Each provider becomes `XxxProvider.tsx` (component only) + `useXxx.ts` (context object + hook that throws outside the provider). Consumers import the hook from its new file.

```
T14
T15
T16
T17
T18
T19
T20
T21
```

### Phase 4: Lint baseline: component files export only components (STD-02, C1)

Non-component exports move to sibling `.ts` modules; their tests move with them. Ends with lint at 0.

```
T22 → T23
T23 → T24
T22 → T29
T23 → T29
T24 → T29
T25 → T29
T26 → T29
T27 → T29
T28 → T29
```

### Phase 5: Gates before production (STD-03)

The CI acceptance criteria are verified on the first push after T33, which needs the user's go-ahead (pushing to `main` deploys).

```
T30 → T31
T32 → T33
```

### Phase 6: Test infrastructure (STD-04)

MSW with no global handlers; handler factories beside services; the Storybook project joins `pnpm test` with a11y in error mode.

```
T34 → T35
T35 → T36
T35 → T37
T35 → T38
T34 → T39
T36 → T40
T37 → T40
T38 → T40
T41 → T42
```

### Phase 7: Structure: filter state and `app/home` (STD-05, decision 4)

The filter state reaches its final home before the folder moves. Behaviour unchanged: tab switches push history, filter updates replace, the gate restores per (user, plan).

```
T43 → T44
T43 → T45
T44 → T46
T45 → T46
T46 → T47
```

### Phase 8: Structure: folders and layered imports (STD-05)

Pure moves (tests move with their subjects), then the import rules land green.

```
T48 → T49
T48 → T50
T49 → T51
T50 → T51
T53 → T54
T51 → T55
T52 → T55
T54 → T55
```

### Phase 9: Shared components: money, `FormField`, `CurrencyInput` (STD-06)

`FormField` lands here because the money, auth and plan fields of STD-06 are its first consumers (design decision 5, sequencing note).

```
T56 → T57
T56 → T59
T59 → T60
T58 → T61
T59 → T61
T61 → T62
```

### Phase 10: Shared components: toggles, `NumberField`, `Amount` (STD-06)

From the shadcn (Base UI) registry first, per the check-first rule.

```
T63 → T64
T63 → T65
T63 → T66
T63 → T67
T68
T69
```

### Phase 11: Shared components: shells, auth, plans, permissions, tokens (STD-06)

Auth and plan forms move to `FormField` here (decision 5).

```
T70 → T71
T72 → T74
T73 → T74
T74 → T75
T76
T77
T78
T79
```

### Phase 12: Form decomposition (STD-07)

Guarded by the existing drawer and category form tests, adapted only in imports and value entry.

```
T80 → T85
T81 → T85
T82 → T85
T83 → T85
T84 → T85
T86 → T88
T87 → T88
```

### Phase 13: Typography (STD-08)

The seven-step scale of design decision 7; the visual changes it lists are accepted.

```
T89 → T90
T89 → T91
T90 → T92
T91 → T92
T89 → T93
T89 → T94
T89 → T95
T92 → T96
T93 → T96
T94 → T96
T95 → T96
```

### Phase 14: Mechanical conventions (STD-09)

Function declarations by area (a codemod is worth trying), then the rule lands green; comments last.

```
T97 → T102
T98 → T102
T99 → T102
T100 → T102
T101 → T102
T103
```

### Phase 15: Story coverage (STD-10)

The gate script is built first and wired last, once every component it names has a story or a container/view split.

```
T104 → T105
T104 → T106
T104 → T107
T104 → T108
T104 → T109
T104 → T110
T105 → T111
T106 → T111
T107 → T111
T108 → T111
T109 → T111
T110 → T111
```

### Phase 16: Test coverage (STD-11)

Decision 8's content criterion; coverage on `src/**/*.ts` with a 90% branch floor.

```
T112 → T113 → T114 → T115 → T116
```

### Phase 17: Transactions tab and the logic cap (STD-12)

Last slice before mobile-navigation. The cap lands green, so any other component over 60 code lines gets its hook in T125.

```
T117 → T123
T118 → T123
T119 → T123
T120 → T123
T121 → T123
T122 → T123
T123 → T124
T124 → T125
```

---

## Task Breakdown

### Phase 1: Written standards (STD-01) (T1–T9)

### T1: Rewrite the `component-creation` skill

**What**: Rewrite the skill around C1, C2, C4b, `base/` families, the shadcn/Base UI check-first flow, F1 (container vs presentational, story checklist), D4 (60 code lines before the main `return`, no IIFE in JSX), E2 (`function` declarations), E4a (token colours), E4b/C7 with the seven-step scale of design decision 7, E5 (comments explain why, no spec IDs), `Amount`/`formatMoney`, and no inline bypass (AD-010).
**Where**: `.claude/skills/component-creation/SKILL.md`
**Depends on**: None
**Reuses**: `context.md`, `design.md` decisions 1, 7, 9
**Requirement**: STD-01 (AC 1, 2, 5)

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [x] Each listed decision appears as a rule with its enforcement mechanism (lint rule, gate script, review)
- [x] No rule from STD-01 AC 2's list remains ("don't modify shadcn primitives", "pure helpers always in `utils/`", "domain language stays in the feature", "arrow function components", "comments only JSDoc")
- [x] Adding a primitive: check shadcn and Base UI, install with the CLI, move into `<family>/base/`, convert to function style (AC 5)
- [x] States that a component may show more than 60 physical lines before its `return` and pass (blank and comment lines do not count)
- [x] Docs gate: every item above checked against `context.md` and `design.md`

**Tests**: none
**Gate**: docs
**Commit**: `docs(skills): rewrite component-creation for the frontend standards`

---

### T2: Rewrite the `feature-structure` skill

**What**: Rewrite around C4 (features `overview`, `transactions`, `categories`, `plans`, `auth`, `notFound`), C4b colocation ladder, C2, C5, C6 (`app/layout`, `app/home`, import rule), C9 (`lib/` vs `utils/`), C3 provider pattern, design decision 4 (filter state per feature, `useSearchParamGroup`) and decision 1's layer table, including the rule that a new layer spreads its parents' fragments and gets a config-test case.
**Where**: `.claude/skills/feature-structure/SKILL.md`
**Depends on**: T1
**Reuses**: `context.md`, `design.md` decisions 1, 4
**Requirement**: STD-01 (AC 1, 2)

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [x] Folder map and import rules match decision 1's table and C6's wording
- [x] No contradiction with T1's skill
- [x] Docs gate: every item above checked against `context.md` and `design.md`

**Tests**: none
**Gate**: docs
**Commit**: `docs(skills): rewrite feature-structure for the frontend standards`

---

### T3: Rewrite the `form-creation` skill

**What**: Rewrite around design decision 5 and AD-013: every field through `Controller` via `FormField` (raw `Controller` for special layouts), domain-typed values, `toFormValues`/`toPayload` converting shape and type only, `useWatch` locally (never root `watch()` + `setValue`), `useFieldArray` for every dynamic list (D2), `FieldError errors={[…]}` (E3), `CurrencyInput` and `NumberField`, `FormSheet` (B3), schema and mappers in `xxxForm.ts` with a test, submit flow in `useXxxFormSubmit` (D1/D2), container by complexity.
**Where**: `.claude/skills/form-creation/SKILL.md`
**Depends on**: T1
**Reuses**: `design.md` decision 5
**Requirement**: STD-01 (AC 1, 2)

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [x] The `watch()` + `setValue()` pattern is gone from the skill and named as the anti-pattern
- [x] The `FormField` example matches decision 5's snippet
- [x] Docs gate: every item above checked against `context.md` and `design.md`

**Tests**: none
**Gate**: docs
**Commit**: `docs(skills): rewrite form-creation around Controller and FormField`

---

### T4: Rewrite the `api-integration` skill

**What**: Keep the service-hook layer (axios, TanStack Query, `["entity", params]` keys, `buildMutationOptions`, plan scoping) and add: `*.handlers.ts` factories beside each service (decision 3), typed through MSW generics with the hand-written DTOs until STD-13, `toPagination` beside `buildPagedQuery`, and the rule that non-test code never imports `*.handlers` or `@/test/*`. The `XxxResponse` naming rule stays until STD-13.
**Where**: `.claude/skills/api-integration/SKILL.md`
**Depends on**: T1
**Reuses**: `design.md` decisions 3, 10
**Requirement**: STD-01 (AC 1, 2)

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [x] Handler-factory example matches `dashboardHandlers.trend(trend)` from decision 3
- [x] Docs gate: every item above checked against `context.md` and `design.md`

**Tests**: none
**Gate**: docs
**Commit**: `docs(skills): add MSW handler factories to api-integration`

---

### T5: Create the `frontend-testing` skill

**What**: New skill: F2's table (logic → unit, visual → story, flow → integration, E2E later), decision 8's logic criterion and the sibling gate, 90% branches on logic only, the story checklist (F1), `play` for basic interactions only, decision 3 (no global handlers, scenarios that group but never hide, unhandled request fails, `renderWithProviders` with real context objects), "no `vi.mock` of our modules in flow tests", the `unit`/`storybook`/`tooling` projects, flaky tests fixed never retried, coverage as a signal (mutants are the counterweight).
**Where**: `.claude/skills/frontend-testing/SKILL.md`
**Depends on**: T1
**Reuses**: `context.md` F1, F2; `design.md` decisions 3, 8; AD-012
**Requirement**: STD-01 (AC 3)

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [x] Defines what gets a unit test, a story, an integration test and an E2E test
- [x] Contains the story checklist and the "no `vi.mock` of our modules in flow tests" rule
- [x] Docs gate: every item above checked against `context.md` and `design.md`

**Tests**: none
**Gate**: docs
**Commit**: `docs(skills): add frontend-testing skill`

---

### T6: Rewrite the `CLAUDE.md` Frontend section

**What**: Replace the Frontend essentials with the new standards in short form, pointing to the five skills: function declarations, files export only components, `base/` primitives editable for app-wide changes, typography and tokens only through the design system, comments explain why, no inline bypass, CI gates deploy (AD-011).
**Where**: `CLAUDE.md`
**Depends on**: T1, T2, T3, T4, T5
**Reuses**: -
**Requirement**: STD-01 (AC 1, 2)

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [x] No "`export const Foo = (props) => {}`", "don't modify shadcn primitives" or "JSDoc only" rule remains
- [x] Skills list includes `/frontend-testing`
- [x] Docs gate: every item above checked against `context.md` and `design.md`

**Tests**: none
**Gate**: docs
**Commit**: `docs: rewrite CLAUDE.md frontend section for the standards`

---

### T7: Update `CONVENTIONS.md`

**What**: Describe the conventions the standards define (naming, function style, `type`, exports, comments, tokens, typography, forms), consistent with T1–T6.
**Where**: `.specs/codebase/CONVENTIONS.md`
**Depends on**: T6
**Reuses**: -
**Requirement**: STD-01 (AC 4)

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [x] No statement contradicts the skills
- [x] Docs gate: every item above checked against `context.md` and `design.md`

**Tests**: none
**Gate**: docs
**Commit**: `docs(codebase): update CONVENTIONS for the frontend standards`

---

### T8: Update `STRUCTURE.md`

**What**: Describe the target frontend tree (features, `app/layout`, `app/home`, families with `base/`, `src/test/`, `eslint/rules/`, `scripts/`), noting which slice (STD-05, 06, 08, 10, 12) brings each area into place.
**Where**: `.specs/codebase/STRUCTURE.md`
**Depends on**: T6
**Reuses**: -
**Requirement**: STD-01 (AC 4)

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [ ] Tree matches decision 1's layers and decision 4's destinations
- [ ] Docs gate: every item above checked against `context.md` and `design.md`

**Tests**: none
**Gate**: docs
**Commit**: `docs(codebase): update STRUCTURE for the frontend standards`

---

### T9: Update `TESTING.md`

**What**: Describe the harness the standards define: three Vitest projects, MSW setup and handler factories, `renderWithProviders`, the sibling gate, coverage scope and threshold, Storybook a11y in error mode, CI jobs.
**Where**: `.specs/codebase/TESTING.md`
**Depends on**: T5
**Reuses**: -
**Requirement**: STD-01 (AC 4)

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [ ] Commands match the Gate Check Commands of this file
- [ ] Docs gate: every item above checked against `context.md` and `design.md`

**Tests**: none
**Gate**: docs
**Commit**: `docs(codebase): update TESTING for the frontend standards`

---

### Phase 2: Lint baseline: config and mechanical fixes (STD-02) (T10–T13)

### T10: ESLint foundation with a config test

**What**: Switch `eslint.config.js` to `defineConfig()`; set `linterOptions.noInlineConfig: true`; configure `@typescript-eslint/ban-ts-comment` to report `@ts-ignore`, `@ts-expect-error` and `@ts-nocheck`; remove the unused `eslint-plugin-import`, `eslint-plugin-check-file`, `eslint-plugin-prettier`, `eslint-config-prettier`. Add the `tooling` Vitest project (Node environment; includes `eslint.config.test.ts`, `eslint/**/*.test.ts`, `scripts/**/*.test.ts`), extend `tsconfig.node.json` to those files, make `test` run `unit` + `tooling`, and write `eslint.config.test.ts` (decision 1).
**Where**: `frontend/eslint.config.js`
**Depends on**: None
**Reuses**: `design.md` decision 1; ESLint `calculateConfigForFile`, `lintText`
**Requirement**: STD-02 (AC 2, 3, 9)

**Tools**: MCP: NONE · Skill: `frontend-testing`

**Done when**:

- [ ] Config test: `noInlineConfig` and `ban-ts-comment` active for a `src/**/*.tsx` path
- [ ] Config test: a violation preceded by `// eslint-disable-next-line` is still reported (AC 9); `// @ts-ignore` is reported (AC 3)
- [ ] The four plugins are gone from `package.json` and the lockfile
- [ ] Lint error count ≤ 66
- [ ] Quick gate passes
- [ ] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: tooling
**Gate**: build
**Commit**: `build(frontend): eslint foundation with noInlineConfig, ban-ts-comment and a config test`

---

### T11: `type` everywhere

**What**: Enable `@typescript-eslint/consistent-type-definitions: ["error", "type"]` and apply its autofix to the ~20 files with `interface`.
**Where**: `frontend/eslint.config.js`
**Depends on**: T10
**Reuses**: -
**Requirement**: STD-02 (AC 4)

**Tools**: MCP: NONE · Skill: `frontend-testing`

**Done when**:

- [ ] `grep -rn "^\s*\(export \)\?interface " src` returns nothing
- [ ] Config test asserts the rule
- [ ] Lint error count not higher than after T10
- [ ] Quick gate passes
- [ ] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: tooling
**Gate**: build
**Commit**: `refactor(frontend): replace interface declarations with type`

---

### T12: Storybook configuration fixes

**What**: Point the 15 stories at `@storybook/react-vite` types and remove `@storybook/addon-backgrounds` from `.storybook/main.ts` (F3).
**Where**: `frontend/.storybook/main.ts`
**Depends on**: None
**Reuses**: -
**Requirement**: STD-02 (AC 7)

**Tools**: MCP: NONE · Skill: `component-creation`, `frontend-testing`

**Done when**:

- [ ] 0 `storybook/no-renderer-packages` and 0 `storybook/no-uninstalled-addons` errors
- [ ] Existing stories still pass in the `storybook` project
- [ ] Full gate passes

**Tests**: story
**Gate**: full
**Commit**: `build(frontend): storybook stories use react-vite types; drop core addon`

---

### T13: `components.json` points at the real paths

**What**: Set `utils` → `@/lib/mergeClasses`, `css` → `src/index.css`, `ui` → `@/components` (C8).
**Where**: `frontend/components.json`
**Depends on**: None
**Reuses**: -
**Requirement**: STD-02 (AC 8)

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [ ] The three aliases match; the CLI install in T63 confirms it
- [ ] Build gate passes

**Tests**: none
**Gate**: build
**Commit**: `build(frontend): point components.json at the real paths`

---

### Phase 3: Lint baseline: providers (STD-02, C3) (T14–T21)

### T14: Split `AuthProvider`

**What**: Split `AuthProvider` into the Provider component file and a `use…` module holding the context object and a hook that throws outside the provider; update every import. The context default becomes `null` so the hook can detect a missing provider.
**Where**: `frontend/src/app/providers/useAuth.ts`
**Depends on**: None
**Reuses**: C3
**Requirement**: STD-02 (AC 6)

**Tools**: MCP: NONE · Skill: `frontend-testing`, `feature-structure`

**Done when**:

- [ ] The Provider file exports only the component; `react-refresh/only-export-components` clean for it
- [ ] Hook test: throws outside the provider, returns the value inside
- [ ] Quick gate passes
- [ ] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: unit
**Gate**: quick
**Commit**: `refactor(frontend): split AuthProvider into provider and hook`

---

### T15: Split `PlanProvider`

**What**: Split `PlanProvider` into the Provider component file and a `use…` module holding the context object and a hook that throws outside the provider; update every import. 
**Where**: `frontend/src/app/providers/usePlanContext.ts`
**Depends on**: None
**Reuses**: C3
**Requirement**: STD-02 (AC 6)

**Tools**: MCP: NONE · Skill: `frontend-testing`, `feature-structure`

**Done when**:

- [ ] The Provider file exports only the component; `react-refresh/only-export-components` clean for it
- [ ] Hook test: throws outside the provider, returns the value inside
- [ ] Quick gate passes
- [ ] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: unit
**Gate**: quick
**Commit**: `refactor(frontend): split PlanProvider into provider and hook`

---

### T16: Split `ThemeProvider`

**What**: Split `ThemeProvider` into the Provider component file and a `use…` module holding the context object and a hook that throws outside the provider; update every import. 
**Where**: `frontend/src/app/providers/useTheme.ts`
**Depends on**: None
**Reuses**: C3
**Requirement**: STD-02 (AC 6)

**Tools**: MCP: NONE · Skill: `frontend-testing`, `feature-structure`

**Done when**:

- [ ] The Provider file exports only the component; `react-refresh/only-export-components` clean for it
- [ ] Hook test: throws outside the provider, returns the value inside
- [ ] Quick gate passes
- [ ] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: unit
**Gate**: quick
**Commit**: `refactor(frontend): split ThemeProvider into provider and hook`

---

### T17: Move the query client out of `TanStackQueryProvider`

**What**: Move `tanStackQueryClient` to its own module beside the provider so the provider file exports only the component.
**Where**: `frontend/src/app/providers/queryClient.ts`
**Depends on**: None
**Reuses**: -
**Requirement**: STD-02 (AC 5, 6)

**Tools**: MCP: NONE · Skill: `feature-structure`, `component-creation`

**Done when**:

- [ ] Provider file exports only the component
- [ ] Quick gate passes
- [ ] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: none
**Gate**: quick
**Commit**: `refactor(frontend): move the query client beside its provider`

---

### T18: Split `ConfirmDialog` (`useConfirmDialog.tsx`)

**What**: Split `ConfirmDialog` (`useConfirmDialog.tsx`) into the Provider component file and a `use…` module holding the context object and a hook that throws outside the provider; update every import. The provider becomes `ConfirmDialogProvider.tsx`.
**Where**: `frontend/src/components/dialog/useConfirmDialog.ts`
**Depends on**: None
**Reuses**: C3
**Requirement**: STD-02 (AC 6)

**Tools**: MCP: NONE · Skill: `frontend-testing`, `feature-structure`

**Done when**:

- [ ] The Provider file exports only the component; `react-refresh/only-export-components` clean for it
- [ ] Hook test: throws outside the provider, returns the value inside
- [ ] Quick gate passes
- [ ] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: unit
**Gate**: quick
**Commit**: `refactor(frontend): split ConfirmDialog` (`useConfirmDialog.tsx`) into provider and hook`

---

### T19: Split `SeriesScopeDialog`

**What**: Split `SeriesScopeDialog` into the Provider component file and a `use…` module holding the context object and a hook that throws outside the provider; update every import. The dialog view stays in `SeriesScopeDialog.tsx`; the provider becomes `SeriesScopeDialogProvider.tsx`.
**Where**: `frontend/src/features/home/components/transactions/useSeriesScopeDialog.ts`
**Depends on**: None
**Reuses**: C3
**Requirement**: STD-02 (AC 6)

**Tools**: MCP: NONE · Skill: `frontend-testing`, `feature-structure`

**Done when**:

- [ ] The Provider file exports only the component; `react-refresh/only-export-components` clean for it
- [ ] Hook test: throws outside the provider, returns the value inside
- [ ] Quick gate passes
- [ ] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: unit
**Gate**: quick
**Commit**: `refactor(frontend): split SeriesScopeDialog into provider and hook`

---

### T20: Split the `CategoryFormSheet` provider

**What**: Split the `CategoryFormSheet` provider into the Provider component file and a `use…` module holding the context object and a hook that throws outside the provider; update every import. The provider becomes `CategoryFormSheetProvider.tsx` (C3, D2).
**Where**: `frontend/src/features/home/components/categories/useCategoryFormSheet.ts`
**Depends on**: None
**Reuses**: C3
**Requirement**: STD-02 (AC 6)

**Tools**: MCP: NONE · Skill: `frontend-testing`, `feature-structure`

**Done when**:

- [ ] The Provider file exports only the component; `react-refresh/only-export-components` clean for it
- [ ] Hook test: throws outside the provider, returns the value inside
- [ ] Quick gate passes
- [ ] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: unit
**Gate**: quick
**Commit**: `refactor(frontend): split the `CategoryFormSheet` provider into provider and hook`

---

### T21: Split the `Table` context

**What**: Split the `Table` context into the Provider component file and a `use…` module holding the context object and a hook that throws outside the provider; update every import. `TableRoot` keeps rendering the provider.
**Where**: `frontend/src/components/table/useTable.ts`
**Depends on**: None
**Reuses**: C3
**Requirement**: STD-02 (AC 6)

**Tools**: MCP: NONE · Skill: `frontend-testing`, `feature-structure`

**Done when**:

- [ ] The Provider file exports only the component; `react-refresh/only-export-components` clean for it
- [ ] Hook test: throws outside the provider, returns the value inside
- [ ] Quick gate passes
- [ ] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: unit
**Gate**: quick
**Commit**: `refactor(frontend): split the `Table` context into provider and hook`

---

### Phase 4: Lint baseline: component files export only components (STD-02, C1) (T22–T29)

### T22: Extract the transaction form's schema and mappers

**What**: Move the schema, `toPayload`, `toSeriesCreatePayload`, `toSeriesEditPayload`, `buildDefaultValues` and the other exports of `TransactionFormDrawer.tsx` into `transactionForm.ts`; move the helper tests from `TransactionFormDrawer.test.ts` and `.series.test.ts` into `transactionForm.test.ts` (and a `.series` sibling if it keeps them readable).
**Where**: `frontend/src/features/home/components/transactions/transactionForm.ts`
**Depends on**: None
**Reuses**: -
**Requirement**: STD-02 (AC 5), STD-07 (AC 1)

**Tools**: MCP: NONE · Skill: `frontend-testing`, `feature-structure`

**Done when**:

- [ ] `TransactionFormDrawer.tsx` exports only components
- [ ] Moved tests pass unchanged except imports
- [ ] Quick gate passes
- [ ] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: unit
**Gate**: quick
**Commit**: `refactor(frontend): move transaction form schema and mappers to transactionForm.ts`

---

### T23: Extract the category form's helpers, schema and mappers

**What**: Move the 10 non-component exports of `CategoryFormSheet.tsx` into `categoryForm.ts`; `CategoryFormSheet.test.ts` becomes `categoryForm.test.ts`.
**Where**: `frontend/src/features/home/components/categories/categoryForm.ts`
**Depends on**: T22
**Reuses**: -
**Requirement**: STD-02 (AC 5), STD-07 (AC 1)

**Tools**: MCP: NONE · Skill: `frontend-testing`, `feature-structure`

**Done when**:

- [ ] `CategoryFormSheet.tsx` exports only components
- [ ] Quick gate passes
- [ ] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: unit
**Gate**: quick
**Commit**: `refactor(frontend): move category form helpers to categoryForm.ts`

---

### T24: Extract `DeleteCategoryDialog` helpers

**What**: Move its 5 non-component exports into a sibling module named by content; move `DeleteCategoryDialog.test.ts` with them.
**Where**: `frontend/src/features/home/components/categories/DeleteCategoryDialog.tsx`
**Depends on**: T23
**Reuses**: -
**Requirement**: STD-02 (AC 5)

**Tools**: MCP: NONE · Skill: `frontend-testing`, `feature-structure`

**Done when**:

- [ ] The component file exports only components
- [ ] Quick gate passes
- [ ] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: unit
**Gate**: quick
**Commit**: `refactor(frontend): move delete-category helpers beside the dialog`

---

### T25: Split `transactionColumns.tsx`

**What**: Separate the column-definition builder and helpers (sibling `.ts`) from the cell components (`.tsx`), so each file exports one kind.
**Where**: `frontend/src/features/home/components/transactions/transactionColumns.tsx`
**Depends on**: None
**Reuses**: -
**Requirement**: STD-02 (AC 5)

**Tools**: MCP: NONE · Skill: `frontend-testing`, `feature-structure`

**Done when**:

- [ ] No `only-export-components` error in either file
- [ ] Logic moved to `.ts` has a sibling test
- [ ] Quick gate passes
- [ ] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: unit
**Gate**: quick
**Commit**: `refactor(frontend): split transaction columns into builders and cells`

---

### T26: Move the single non-component exports of four feature files

**What**: `CategoryCombobox.tsx`, `TransactionFilterPopover.tsx`, `CreatePlanDialog.tsx`, `ResetPasswordPage.tsx` each export one non-component; move each to a sibling `.ts` with its test moving too (`CategoryCombobox.test.ts`, `CreatePlanDialog.test.ts`, `ResetPasswordPage.test.ts`).
**Where**: four feature component files (listed in What)
**Depends on**: None
**Reuses**: -
**Requirement**: STD-02 (AC 5)

**Tools**: MCP: NONE · Skill: `frontend-testing`, `feature-structure`

**Done when**:

- [ ] 0 `only-export-components` errors in the four files
- [ ] Quick gate passes
- [ ] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: unit
**Gate**: quick
**Commit**: `refactor(frontend): move single helper exports out of component files`

---

### T27: Move primitive variant exports

**What**: `buttonVariants`, `badgeVariants` and the `Combobox` non-component export move to sibling `.ts` modules in their families.
**Where**: `frontend/src/components/button/buttonVariants.ts`
**Depends on**: None
**Reuses**: -
**Requirement**: STD-02 (AC 5)

**Tools**: MCP: NONE · Skill: `component-creation`, `frontend-testing`

**Done when**:

- [ ] `Button.tsx`, `Badge.tsx`, `Combobox.tsx` export only components
- [ ] Full gate passes

**Tests**: story
**Gate**: full
**Commit**: `refactor(frontend): move primitive variants beside their components`

---

### T28: Type the table without `any`

**What**: Replace the 6 `any` in `Table.tsx`, `TableActionsDropdown.tsx` and `cols.ts` with generics; fix the `prefer-const`. `cols.ts` gets its sibling test (it holds decision points).
**Where**: `frontend/src/components/table/utils/cols.ts`
**Depends on**: None
**Reuses**: -
**Requirement**: STD-02 (AC 1)

**Tools**: MCP: NONE · Skill: `frontend-testing`, `feature-structure`

**Done when**:

- [ ] 0 `no-explicit-any` and `prefer-const` errors
- [ ] `cols.test.ts` covers every branch
- [ ] Quick gate passes
- [ ] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: unit
**Gate**: quick
**Commit**: `refactor(frontend): type the table generics without any`

---

### T29: Lint green: `only-export-components` as error

**What**: Set `react-refresh/only-export-components` to `error` and confirm the whole baseline.
**Where**: `frontend/eslint.config.js`
**Depends on**: T22, T23, T24, T25, T26, T27, T28
**Reuses**: -
**Requirement**: STD-02 (AC 1, 5)

**Tools**: MCP: NONE · Skill: `frontend-testing`

**Done when**:

- [ ] `pnpm lint` exits 0
- [ ] Config test asserts the rule at `error`
- [ ] Build gate passes
- [ ] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: tooling
**Gate**: build
**Commit**: `build(frontend): only-export-components as error; lint green`

---

### Phase 5: Gates before production (STD-03) (T30–T33)

### T30: `pre-commit` hook runs lint-staged

**What**: Add `"packageManager": "pnpm@11.1.2"` to the root `package.json`; add `lint-staged` to the frontend with ESLint on staged `*.{ts,tsx}`; create `frontend/.husky/pre-commit` running it from `frontend/`.
**Where**: `frontend/.husky/pre-commit`
**Depends on**: None
**Reuses**: -
**Requirement**: STD-03 (AC 5)

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [ ] Staging a file with a lint error blocks the commit (checked, then reverted)
- [ ] A clean staged file commits
- [ ] Build gate passes

**Tests**: none
**Gate**: build
**Commit**: `build: pre-commit hook runs eslint on staged frontend files`

---

### T31: `commit-msg` hook runs `check_commit.py`

**What**: Create `frontend/.husky/commit-msg` running `python3 .claude/skills/tlc-spec-driven/scripts/check_commit.py "$1"` from the repo root.
**Where**: `frontend/.husky/commit-msg`
**Depends on**: T30
**Reuses**: -
**Requirement**: STD-03 (AC 6)

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [ ] A commit with message "stuff" is rejected locally
- [ ] A Conventional Commit passes
- [ ] Build gate passes

**Tests**: none
**Gate**: build
**Commit**: `build: commit-msg hook enforces conventional commits`

---

### T32: `ci.yml` with frontend and backend jobs

**What**: Create `.github/workflows/ci.yml` on `push` (all branches) and `workflow_dispatch`: `frontend` (pnpm via corepack, frozen install, `pnpm lint`, `pnpm build`, `pnpm test`) and `backend` (Temurin 17, `./mvnw test`).
**Where**: `.github/workflows/ci.yml`
**Depends on**: None
**Reuses**: -
**Requirement**: STD-03 (AC 1)

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [ ] YAML parses (`python3 -c 'import yaml,sys; yaml.safe_load(open(sys.argv[1]))'`)
- [ ] Commands match the local Build gate
- [ ] First push: both jobs green (user go-ahead)

**Tests**: none
**Gate**: build
**Commit**: `ci: run frontend and backend checks on every push`

---

### T33: `changes` and `deploy` jobs; remove `deploy.yml`

**What**: Add `changes` (git diff of `before..sha`; `deployable=true` when any path is outside `.specs/`, `.claude/`, `*.md`; dispatch, zeroed `before` or non-ancestor `before` count as deployable) and `deploy` (`needs: [changes, frontend, backend]`, push to `main` with `deployable == 'true'` only, `concurrency` group, head guard via `git ls-remote` before the unchanged Portainer call). Delete `deploy.yml`.
**Where**: `.github/workflows/ci.yml`
**Depends on**: T32
**Reuses**: `.github/workflows/deploy.yml` Portainer step; design decision 2
**Requirement**: STD-03 (AC 2, 3, 4)

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [ ] The `changes` script, run locally against crafted ranges, prints false for docs-only and true for mixed, first-push and force-push cases
- [ ] Head guard exits 0 without deploying when the SHA is not the tip
- [ ] YAML parses
- [ ] First push to `main`: CI green, then deploy runs (user go-ahead)

**Tests**: none
**Gate**: build
**Commit**: `ci: deploy only after CI, with change filter and head guard`

---

### Phase 6: Test infrastructure (STD-04) (T34–T42)

### T34: MSW server and the unhandled-request recorder

**What**: Add `msw` (exact version); create `src/test/server.ts` (`setupServer()` with no handlers), `src/test/unhandledRequests.ts` (records unhandled requests, `assertNone()` throws listing method + URL, `reset()`), and `src/test/setupUnit.ts` (listen with the recorder, `afterEach`: reset handlers, assert, reset; close) wired as the `unit` project's setup file.
**Where**: `frontend/src/test/setupUnit.ts`
**Depends on**: None
**Reuses**: design decision 3
**Requirement**: STD-04 (AC 3)

**Tools**: MCP: NONE · Skill: `frontend-testing`, `feature-structure`

**Done when**:

- [ ] `unhandledRequests.test.ts`: records, throws naming the URL, resets
- [ ] Existing unit tests pass with the setup active
- [ ] Quick gate passes
- [ ] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: unit
**Gate**: quick
**Commit**: `test(frontend): msw server with unhandled-request failure`

---

### T35: `renderWithProviders`; auth handlers; `useAuthService` through MSW

**What**: Create `src/test/renderWithProviders.tsx` (QueryClient with retry off, `MemoryRouter`, the real context objects from T14–T16 with explicit values) and `src/api/services/auth.handlers.ts`; rewrite `useAuthService.test.ts` without `vi.mock`, asserting what reaches the network.
**Where**: `frontend/src/api/services/useAuthService.test.ts`
**Depends on**: T34
**Reuses**: T14–T16 context objects
**Requirement**: STD-04 (AC 4)

**Tools**: MCP: NONE · Skill: `form-creation`, `api-integration`, `frontend-testing`

**Done when**:

- [ ] No `vi.mock` in the file
- [ ] Each service function: request method, URL, params/body and response mapping asserted
- [ ] Quick gate passes
- [ ] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: unit
**Gate**: quick
**Commit**: `test(frontend): auth service tests through msw`

---

### T36: Dashboard handlers; `useDashboardService` through MSW

**What**: `dashboard.handlers.ts` with typed factories; rewrite `useDashboardService.test.ts` without `vi.mock`.
**Where**: `frontend/src/api/services/useDashboardService.test.ts`
**Depends on**: T35
**Reuses**: -
**Requirement**: STD-04 (AC 4)

**Tools**: MCP: NONE · Skill: `form-creation`, `api-integration`, `frontend-testing`

**Done when**:

- [ ] No `vi.mock`
- [ ] Quick gate passes
- [ ] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: unit
**Gate**: quick
**Commit**: `test(frontend): dashboard service tests through msw`

---

### T37: Category handlers; category service through MSW

**What**: `financialTransactionCategory.handlers.ts`; rewrite `useFinancialTransactionCategoryService.test.ts` without `vi.mock`.
**Where**: `frontend/src/api/services/useFinancialTransactionCategoryService.test.ts`
**Depends on**: T35
**Reuses**: -
**Requirement**: STD-04 (AC 4)

**Tools**: MCP: NONE · Skill: `form-creation`, `api-integration`, `frontend-testing`

**Done when**:

- [ ] No `vi.mock`
- [ ] Quick gate passes
- [ ] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: unit
**Gate**: quick
**Commit**: `test(frontend): category service tests through msw`

---

### T38: Plan handlers; `usePlanService` through MSW

**What**: `plan.handlers.ts`; rewrite `usePlanService.test.ts` without `vi.mock`.
**Where**: `frontend/src/api/services/usePlanService.test.ts`
**Depends on**: T35
**Reuses**: -
**Requirement**: STD-04 (AC 4)

**Tools**: MCP: NONE · Skill: `form-creation`, `api-integration`, `frontend-testing`

**Done when**:

- [ ] No `vi.mock`
- [ ] Quick gate passes
- [ ] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: unit
**Gate**: quick
**Commit**: `test(frontend): plan service tests through msw`

---

### T39: `findracoApi` tests through MSW, including session refresh

**What**: Replace the hand-written axios adapter in `findracoApi.test.ts` with MSW handlers; keep every scenario; the held-refresh concurrency cases use a deferred promise inside the handler; one test covers 401 → refresh → retry.
**Where**: `frontend/src/api/clients/findracoApi.test.ts`
**Depends on**: T34
**Reuses**: -
**Requirement**: STD-04 (AC 4)

**Tools**: MCP: NONE · Skill: `form-creation`, `api-integration`, `frontend-testing`

**Done when**:

- [ ] No custom adapter
- [ ] 401 → refresh → retry test passes through MSW
- [ ] Same scenario list as before
- [ ] Quick gate passes
- [ ] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: unit
**Gate**: quick
**Commit**: `test(frontend): findraco client tests through msw, incl. refresh`

---

### T40: Lint: test support only from tests

**What**: Add the `no-restricted-imports` fragment forbidding non-test files from importing `*.handlers` or `@/test/*` (decision 8), applied to `src/**` except tests, with a config-test case.
**Where**: `frontend/eslint.config.js`
**Depends on**: T36, T37, T38
**Reuses**: -
**Requirement**: STD-04 (AC 3)

**Tools**: MCP: NONE · Skill: `frontend-testing`

**Done when**:

- [ ] Config test: the fragment is active for `src/features/x/Foo.tsx` and absent for `Foo.test.tsx`
- [ ] `pnpm lint` exits 0
- [ ] Build gate passes

**Tests**: tooling
**Gate**: build
**Commit**: `build(frontend): forbid test support imports outside tests`

---

### T41: Storybook in `pnpm test`, a11y in error mode

**What**: `test` runs every Vitest project; set `a11y: { test: "error" }` in `.storybook/preview.tsx`; fix the violations the existing stories surface (in the primitive or story, never by disabling a check).
**Where**: `frontend/.storybook/preview.tsx`
**Depends on**: None
**Reuses**: -
**Requirement**: STD-04 (AC 1, 2)

**Tools**: MCP: NONE · Skill: `component-creation`, `frontend-testing`

**Done when**:

- [ ] `pnpm test` runs `unit`, `tooling` and `storybook`
- [ ] Breaking an `aria` attribute in a story fails `pnpm test` (checked, then reverted)
- [ ] Full gate passes
- [ ] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: story
**Gate**: full
**Commit**: `test(frontend): storybook project in pnpm test with a11y errors`

---

### T42: CI installs the Playwright browser

**What**: The `frontend` job caches and installs Chromium for the `storybook` project before `pnpm test`.
**Where**: `.github/workflows/ci.yml`
**Depends on**: T41
**Reuses**: -
**Requirement**: STD-04 (AC 5)

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [ ] YAML parses
- [ ] Next push: the frontend job runs both projects (user go-ahead)

**Tests**: none
**Gate**: build
**Commit**: `ci: install playwright chromium for storybook tests`

---

### Phase 7: Structure: filter state and `app/home` (STD-05, decision 4) (T43–T47)

### T43: `useSearchParamGroup`

**What**: Generic `useSearchParamGroup<T>(keys, parse, serialize)` returning `{ value, update(fn), clear(keys?) }`, updates with `replace`; extracted from `withParams` in `useHomeFilters`.
**Where**: `frontend/src/hooks/useSearchParamGroup.ts`
**Depends on**: None
**Reuses**: `features/home/hooks/useHomeFilters.ts`
**Requirement**: STD-05 (AC 1)

**Tools**: MCP: NONE · Skill: `frontend-testing`, `feature-structure`

**Done when**:

- [ ] Test: parse, update with replace, clear subset, untouched foreign keys
- [ ] Quick gate passes
- [ ] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: unit
**Gate**: quick
**Commit**: `refactor(frontend): extract useSearchParamGroup`

---

### T44: Overview filters own their params

**What**: Overview params (`period`, `periodFrom/To`, `overviewMember`, `Period`, `resolvePeriodDates`) and `useOverviewFilters` move to `features/overview/filters/`, exporting the key list; tests split from `homeFilterParams.test.ts` and `useHomeFilters.test.tsx`.
**Where**: `frontend/src/features/overview/filters/useOverviewFilters.ts`
**Depends on**: T43
**Reuses**: -
**Requirement**: STD-05 (AC 1)

**Tools**: MCP: NONE · Skill: `frontend-testing`, `feature-structure`

**Done when**:

- [ ] Overview consumers use the new hook
- [ ] Moved tests pass
- [ ] Quick gate passes
- [ ] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: unit
**Gate**: quick
**Commit**: `refactor(frontend): overview filters own their params`

---

### T45: Transactions filters own their params

**What**: Transactions params (`type`, `category`, `q`, `sort`, `size`, …) and `useTransactionFilters` move to `features/transactions/filters/`, exporting the key list; tests split likewise.
**Where**: `frontend/src/features/transactions/filters/useTransactionFilters.ts`
**Depends on**: T43
**Reuses**: -
**Requirement**: STD-05 (AC 1)

**Tools**: MCP: NONE · Skill: `frontend-testing`, `feature-structure`

**Done when**:

- [ ] Transactions consumers use the new hook
- [ ] Quick gate passes
- [ ] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: unit
**Gate**: quick
**Commit**: `refactor(frontend): transactions filters own their params`

---

### T46: `app/home`: page, tab and plan params

**What**: `HomePage` moves to `src/app/home/`; tab and plan params become `homeParams.ts` + `useHomeTab` (tab switches push history); the router imports the new page.
**Where**: `frontend/src/app/home/useHomeTab.ts`
**Depends on**: T44, T45
**Reuses**: -
**Requirement**: STD-05 (AC 1)

**Tools**: MCP: NONE · Skill: `frontend-testing`, `feature-structure`

**Done when**:

- [ ] Test: tab switch pushes, plan param read
- [ ] Routes behave as before
- [ ] Quick gate passes
- [ ] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: unit
**Gate**: quick
**Commit**: `refactor(frontend): home page and tab params move to app/home`

---

### T47: `HomeFiltersGate` and `filterStorage` move to `app/home`

**What**: Move `HomeFiltersGate` (+ test) and `lib/filterStorage` (+ test) to `src/app/home/`; the gate builds its key list from T44/T45's exported lists; `HomeFiltersGate.test.tsx` drops `vi.mock` of the providers for `renderWithProviders` and gains a case built from the exported lists; `features/home/filters/` and `useHomeFilters` are deleted.
**Where**: `frontend/src/app/home/HomeFiltersGate.tsx`
**Depends on**: T46
**Reuses**: -
**Requirement**: STD-05 (AC 1, 9)

**Tools**: MCP: NONE · Skill: `form-creation`, `api-integration`, `frontend-testing`

**Done when**:

- [ ] No `vi.mock` in the gate test
- [ ] `src/lib/` holds only `mergeClasses` and `storage`
- [ ] Quick gate passes
- [ ] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: integration
**Gate**: quick
**Commit**: `refactor(frontend): filter gate and storage live with app/home`

---

### Phase 8: Structure: folders and layered imports (STD-05) (T48–T55)

### T48: Lift shared pieces to the root

**What**: `MemberDot` → `src/components/memberDot/`, `memberColors` (+ test) → `src/utils/`, `TransactionTypeToggle` → `src/components/transactionTypeToggle/` (C4b).
**Where**: `frontend/src/utils/memberColors.ts`
**Depends on**: None
**Reuses**: -
**Requirement**: STD-05 (AC 4)

**Tools**: MCP: NONE · Skill: `feature-structure`, `component-creation`

**Done when**:

- [ ] No feature imports them from another feature
- [ ] Quick gate passes
- [ ] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: none
**Gate**: build
**Commit**: `refactor(frontend): lift MemberDot, memberColors and TransactionTypeToggle to the root`

---

### T49: `features/overview`

**What**: Move the overview components, helpers (+ tests), `useOverviewMemberFilter` and `PeriodNavigator` with `periodNavigator` utils (overview is its only consumer) into `features/overview/`, placing each module next to its single consumer (C2).
**Where**: `frontend/src/features/overview/OverviewTab.tsx`
**Depends on**: T48
**Reuses**: -
**Requirement**: STD-05 (AC 1, 4)

**Tools**: MCP: NONE · Skill: `feature-structure`, `component-creation`

**Done when**:

- [ ] Overview renders as before
- [ ] Build gate passes
- [ ] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: none
**Gate**: build
**Commit**: `refactor(frontend): overview becomes its own feature`

---

### T50: `features/transactions`

**What**: Move the transactions components, helpers (+ tests) and hooks (`useTransactionsPage`, `useTransactionFilterChips`) into `features/transactions/`.
**Where**: `frontend/src/features/transactions/TransactionsTab.tsx`
**Depends on**: T48
**Reuses**: -
**Requirement**: STD-05 (AC 1, 4)

**Tools**: MCP: NONE · Skill: `feature-structure`, `component-creation`

**Done when**:

- [ ] Transactions tab behaves as before
- [ ] Build gate passes
- [ ] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: none
**Gate**: build
**Commit**: `refactor(frontend): transactions becomes its own feature`

---

### T51: `features/categories`; `features/home` removed

**What**: Move the categories components and helpers (+ tests) into `features/categories/`; delete the empty `features/home/`.
**Where**: `frontend/src/features/categories/CategoriesTab.tsx`
**Depends on**: T49, T50
**Reuses**: -
**Requirement**: STD-05 (AC 1)

**Tools**: MCP: NONE · Skill: `feature-structure`, `component-creation`

**Done when**:

- [ ] `src/features/home` does not exist
- [ ] Build gate passes
- [ ] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: none
**Gate**: build
**Commit**: `refactor(frontend): categories becomes its own feature`

---

### T52: `features/auth`

**What**: `login`, `registerUser`, `forgotPassword`, `resetPassword` merge into `features/auth/` (four pages, tests move).
**Where**: `frontend/src/features/auth/LoginPage.tsx`
**Depends on**: None
**Reuses**: -
**Requirement**: STD-05 (AC 1)

**Tools**: MCP: NONE · Skill: `feature-structure`, `component-creation`

**Done when**:

- [ ] No `login`, `registerUser`, `forgotPassword`, `resetPassword` folders
- [ ] Build gate passes
- [ ] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: none
**Gate**: build
**Commit**: `refactor(frontend): merge the auth screens into one feature`

---

### T53: `app/layout`

**What**: `MainLayout`, `AuthLayout`, `Navbar` and the `Toaster` move to `src/app/layout/` (C6).
**Where**: `frontend/src/app/layout/MainLayout.tsx`
**Depends on**: None
**Reuses**: -
**Requirement**: STD-05 (AC 2)

**Tools**: MCP: NONE · Skill: `feature-structure`, `component-creation`

**Done when**:

- [ ] `src/components/layout` and `navbar` do not exist
- [ ] Build gate passes
- [ ] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: none
**Gate**: build
**Commit**: `refactor(frontend): app shell moves to app/layout`

---

### T54: `base/` marker for primitives

**What**: Move every shadcn/Base UI primitive into `<family>/base/` (button, badge, card, dialog, dropdown, popover, separator, sheet, skeleton, spinner, tooltip, avatar, calendar, chart, sonner, table parts, …); stories and variant modules move with them.
**Where**: `frontend/src/components/*/base/`
**Depends on**: T53
**Reuses**: -
**Requirement**: STD-05 (AC 3)

**Tools**: MCP: NONE · Skill: `feature-structure`, `component-creation`

**Done when**:

- [ ] Each family's primitives sit in `base/`; compositions stay at the family root
- [ ] Full gate passes
- [ ] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: none
**Gate**: full
**Commit**: `refactor(frontend): primitives move into family base folders`

---

### T55: Layered import restrictions

**What**: Add decision 1's fragments and layer blocks (`src/**` except `app/`: no `@/app/*` but `providers/*` and `routing/paths`; `features/**`: + no `@/features/*`; `components/**`: + no `@/features/*`; `components/**/base/**`: + no `@/api/*`, no `@/app/*`), keeping T40's fragment in every layer; config-test case per layer path.
**Where**: `frontend/eslint.config.js`
**Depends on**: T51, T52, T54
**Reuses**: -
**Requirement**: STD-05 (AC 5, 6, 7, 8)

**Tools**: MCP: NONE · Skill: `frontend-testing`

**Done when**:

- [ ] Config test: each layer path has every expected fragment
- [ ] `import … from "@/features/plans/…"` inside `features/overview` fails lint (checked, reverted)
- [ ] `pnpm lint` exits 0
- [ ] Build gate passes

**Tests**: tooling
**Gate**: build
**Commit**: `build(frontend): layered import restrictions with config tests`

---

### Phase 9: Shared components: money, `FormField`, `CurrencyInput` (STD-06) (T56–T62)

### T56: `money.ts`

**What**: `MONEY_LOCALE`, `MONEY_CURRENCY`, `formatMoney(value, { compact? })`, `toCents(value)` (decision 6).
**Where**: `frontend/src/utils/money.ts`
**Depends on**: None
**Reuses**: -
**Requirement**: STD-06 (AC 6)

**Tools**: MCP: NONE · Skill: `frontend-testing`, `feature-structure`

**Done when**:

- [ ] Test: format, negative, compact axis values, `toCents` on float-prone values (0.1 + 0.2)
- [ ] Quick gate passes
- [ ] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: unit
**Gate**: quick
**Commit**: `feat(frontend): money module with formatMoney and toCents`

---

### T57: Every display goes through `formatMoney`

**What**: Replace `formatCurrency(…, "BRL")`, the three local `money` shortcuts, the trend chart's `Intl.NumberFormat` and `Chart`'s locale-less `toLocaleString` with `formatMoney`; delete `formatCurrency`.
**Where**: `frontend/src/utils/string/formatters.ts`
**Depends on**: T56
**Reuses**: -
**Requirement**: STD-06 (AC 6)

**Tools**: MCP: NONE · Skill: `frontend-testing`, `feature-structure`

**Done when**:

- [ ] `grep -rn "Intl.NumberFormat\|formatCurrency\|toLocaleString" src` returns only `money.ts`
- [ ] Quick gate passes
- [ ] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: unit
**Gate**: quick
**Commit**: `refactor(frontend): format all money through formatMoney`

---

### T58: `FormField`

**What**: `FormField` wraps `Controller` + `Field` + `FieldLabel` + `FieldDescription` + `FieldError` and gives a render prop a `field` with `id`, `ref`, `onBlur`, `aria-invalid`, `value`, `onChange` (decision 5); story inside a test form.
**Where**: `frontend/src/components/form/FormField.tsx`
**Depends on**: None
**Reuses**: -
**Requirement**: STD-06 (AC 9), STD-07

**Tools**: MCP: NONE · Skill: `component-creation`, `frontend-testing`

**Done when**:

- [ ] Stories: label only, with description, with error, disabled; label is associated with the input
- [ ] Full gate passes

**Tests**: story
**Gate**: full
**Commit**: `feat(frontend): FormField over Controller and Field`

---

### T59: `CurrencyInput`

**What**: Composition over `Input`: `value: number | null`, `onValueChange`; digits enter from the right as cents; non-digits ignored; paste "R$ 12,34" → 12.34; at most 15 digits; empty → `null`; caret at the end; `inputMode="numeric"`; display via `formatMoney`. The digit logic lives in a sibling `currencyDigits.ts`.
**Where**: `frontend/src/components/input/CurrencyInput.tsx`
**Depends on**: T56
**Reuses**: -
**Requirement**: STD-06 (AC 4, 5)

**Tools**: MCP: NONE · Skill: `component-creation`, `frontend-testing`

**Done when**:

- [ ] `currencyDigits.test.ts`: 1, 12, 123, 1234 → 0.01, 0.12, 1.23, 12.34; non-digits ignored; paste; 15-digit cap; empty → null
- [ ] Story `play`: typing 1234 shows R$ 12,34
- [ ] Full gate passes
- [ ] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: unit + story
**Gate**: full
**Commit**: `feat(frontend): CurrencyInput with ATM-style typing`

---

### T60: `CurrencyInput` in the filter and inline edit

**What**: Filter min/max (`TransactionFilterPopover`, `transactionFilterDraft`) and the table's inline amount edit hold numbers and use `CurrencyInput`.
**Where**: `frontend/src/features/transactions/components/TransactionFilterPopover.tsx`
**Depends on**: T59
**Reuses**: -
**Requirement**: STD-06 (AC 4)

**Tools**: MCP: NONE · Skill: `frontend-testing`, `feature-structure`

**Done when**:

- [ ] `transactionFilterDraft.test.ts` updated to numbers
- [ ] No `maskCurrency` in these files
- [ ] Quick gate passes
- [ ] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: unit
**Gate**: quick
**Commit**: `refactor(frontend): filter and inline edit use CurrencyInput`

---

### T61: Transaction form money fields are numeric

**What**: Amount, items and participant shares bind `CurrencyInput` through `FormField`; the schema holds `number | null`; sums and "items ≤ total" compare via `toCents`; mappers stop parsing masked strings.
**Where**: `frontend/src/features/transactions/components/transactionForm.ts`
**Depends on**: T58, T59
**Reuses**: -
**Requirement**: STD-06 (AC 4), STD-07

**Tools**: MCP: NONE · Skill: `form-creation`, `api-integration`, `frontend-testing`

**Done when**:

- [ ] New `TransactionFormDrawer.test.tsx` (`renderWithProviders`, MSW): typing 1234 in Amount submits 12.34; items over the total show the error
- [ ] `transactionForm.test.ts` updated to numbers
- [ ] Quick gate passes
- [ ] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: integration
**Gate**: quick
**Commit**: `refactor(frontend): transaction form money fields hold numbers`

---

### T62: Category form limits are numeric; `maskCurrency` removed

**What**: Category limit and member limits bind `CurrencyInput` through `FormField`; `categoryForm.ts` holds numbers; delete `maskCurrency` and its currency → locale table (and `masks.ts` if empty).
**Where**: `frontend/src/features/categories/components/categoryForm.ts`
**Depends on**: T61
**Reuses**: -
**Requirement**: STD-06 (AC 4, 6)

**Tools**: MCP: NONE · Skill: `form-creation`, `api-integration`, `frontend-testing`

**Done when**:

- [ ] New `CategoryFormSheet.test.tsx` (`renderWithProviders`, MSW): typing a limit submits the number; empty limit submits none
- [ ] `grep -rn maskCurrency src` returns nothing
- [ ] `categoryForm.test.ts` updated
- [ ] Quick gate passes
- [ ] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: integration
**Gate**: quick
**Commit**: `refactor(frontend): category limits hold numbers; drop maskCurrency`

---

### Phase 10: Shared components: toggles, `NumberField`, `Amount` (STD-06) (T63–T69)

### T63: `ToggleGroup` primitive with `tone` and `chip`

**What**: Install `toggle` and `toggle-group` with the shadcn CLI (exact version), move them to `toggle/base/` and `toggleGroup/base/`, add `tone` (primary, destructive, success) and `chip` variants.
**Where**: `frontend/src/components/toggleGroup/base/ToggleGroup.tsx`
**Depends on**: T13
**Reuses**: -
**Requirement**: STD-06 (AC 1, 2)

**Tools**: MCP: NONE · Skill: `component-creation`, `frontend-testing`

**Done when**:

- [ ] Stories per tone, chip, disabled; `play`: arrow keys move focus, selected item has `aria-pressed="true"`
- [ ] Full gate passes

**Tests**: story
**Gate**: full
**Commit**: `feat(frontend): ToggleGroup primitive with tone and chip variants`

---

### T64: `TransactionTypeToggle` on `ToggleGroup`

**What**: Rebuild as a ~10-line composition (Debit destructive, Credit success).
**Where**: `frontend/src/components/transactionTypeToggle/TransactionTypeToggle.tsx`
**Depends on**: T63
**Reuses**: -
**Requirement**: STD-06 (AC 1, 2)

**Tools**: MCP: NONE · Skill: `component-creation`, `frontend-testing`

**Done when**:

- [ ] Story with keyboard `play`
- [ ] Existing form tests pass
- [ ] Full gate passes
- [ ] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: story
**Gate**: full
**Commit**: `refactor(frontend): TransactionTypeToggle composes ToggleGroup`

---

### T65: Transaction form toggles on `ToggleGroup`

**What**: The recurrence mode toggle and the three `AttributionFields` toggles use the primitive.
**Where**: `frontend/src/features/transactions/components/AttributionFields.tsx`
**Depends on**: T63
**Reuses**: -
**Requirement**: STD-06 (AC 1, 2)

**Tools**: MCP: NONE · Skill: `form-creation`, `api-integration`, `frontend-testing`

**Done when**:

- [ ] `TransactionFormDrawer.test.tsx`: choosing a recurrence mode and an attribution option reaches the payload
- [ ] Quick gate passes
- [ ] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: integration
**Gate**: quick
**Commit**: `refactor(frontend): transaction form toggles use ToggleGroup`

---

### T66: Category limit mode on `ToggleGroup`

**What**: `CategoryLimitFields` limit mode uses the primitive.
**Where**: `frontend/src/features/categories/components/CategoryLimitFields.tsx`
**Depends on**: T63
**Reuses**: -
**Requirement**: STD-06 (AC 1, 2)

**Tools**: MCP: NONE · Skill: `form-creation`, `api-integration`, `frontend-testing`

**Done when**:

- [ ] `CategoryFormSheet.test.tsx`: switching the limit mode reaches the payload
- [ ] Quick gate passes
- [ ] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: integration
**Gate**: quick
**Commit**: `refactor(frontend): category limit mode uses ToggleGroup`

---

### T67: `MemberFilterChips` on the `chip` variant

**What**: Rebuild `MemberFilterChips` on `ToggleGroup` `chip`; add its story.
**Where**: `frontend/src/features/overview/components/MemberFilterChips.tsx`
**Depends on**: T63
**Reuses**: -
**Requirement**: STD-06 (AC 1, 2)

**Tools**: MCP: NONE · Skill: `component-creation`, `frontend-testing`

**Done when**:

- [ ] Story: none selected, one selected, many members, long names
- [ ] Full gate passes
- [ ] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: story
**Gate**: full
**Commit**: `refactor(frontend): member filter chips use ToggleGroup`

---

### T68: `NumberField` for installments

**What**: Add `NumberField` (shadcn registry if present, else Base UI composed) in `input/base/`; the three digits-only IIFE installment inputs use it with min 1, step 1.
**Where**: `frontend/src/components/input/base/NumberField.tsx`
**Depends on**: None
**Reuses**: -
**Requirement**: STD-06 (AC 3)

**Tools**: MCP: NONE · Skill: `component-creation`, `frontend-testing`

**Done when**:

- [ ] Story: increment, decrement at min, typing
- [ ] No IIFE left in the installment inputs
- [ ] Drawer tests pass
- [ ] Full gate passes
- [ ] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: story
**Gate**: full
**Commit**: `feat(frontend): NumberField for installment inputs`

---

### T69: `Amount`

**What**: `Amount` (`value`, `type`): debit "- " prefix and destructive tone, credit success tone, `tabular-nums`, via `formatMoney`; the mobile list and the table use it.
**Where**: `frontend/src/components/amount/Amount.tsx`
**Depends on**: T57
**Reuses**: -
**Requirement**: STD-06 (AC 7)

**Tools**: MCP: NONE · Skill: `component-creation`, `frontend-testing`

**Done when**:

- [ ] Story: debit, credit, zero, large value
- [ ] Full gate passes
- [ ] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: story
**Gate**: full
**Commit**: `feat(frontend): Amount component for signed, toned values`

---

### Phase 11: Shared components: shells, auth, plans, permissions, tokens (STD-06) (T70–T79)

### T70: `FormSheet`; `CategoryFormSheet` on it

**What**: `FormSheet` (`open`, `onOpenChange`, `title`, `onSubmit`, `isSubmitting`, `submitLabel`, `mobileActions?`, `children`) with a story; `CategoryFormSheet` renders through it.
**Where**: `frontend/src/components/form/FormSheet.tsx`
**Depends on**: None
**Reuses**: -
**Requirement**: STD-06 (AC 8)

**Tools**: MCP: NONE · Skill: `component-creation`, `frontend-testing`

**Done when**:

- [ ] Story: idle, submitting, with mobile actions, long content scrolling, mobile viewport
- [ ] `CategoryFormSheet.test.tsx` passes (Cancel closes, Submit sends)
- [ ] Full gate passes
- [ ] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: story
**Gate**: full
**Commit**: `feat(frontend): FormSheet skeleton; category form uses it`

---

### T71: `TransactionFormDrawer` on `FormSheet`

**What**: Render the transaction form through `FormSheet`, Delete/Duplicate in `mobileActions`.
**Where**: `frontend/src/features/transactions/components/TransactionFormDrawer.tsx`
**Depends on**: T70
**Reuses**: -
**Requirement**: STD-06 (AC 8)

**Tools**: MCP: NONE · Skill: `form-creation`, `api-integration`, `frontend-testing`

**Done when**:

- [ ] `TransactionFormDrawer.test.tsx`: Cancel closes, Submit sends, Delete and Duplicate reachable
- [ ] Quick gate passes
- [ ] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: integration
**Gate**: quick
**Commit**: `refactor(frontend): transaction form renders through FormSheet`

---

### T72: `AuthCard`

**What**: `AuthCard` built on `Card`, with a story.
**Where**: `frontend/src/features/auth/components/AuthCard.tsx`
**Depends on**: None
**Reuses**: -
**Requirement**: STD-06 (AC 9)

**Tools**: MCP: NONE · Skill: `component-creation`, `frontend-testing`

**Done when**:

- [ ] Story: with title and description, mobile viewport
- [ ] Full gate passes

**Tests**: story
**Gate**: full
**Commit**: `feat(frontend): AuthCard on Card`

---

### T73: `PasswordInput`

**What**: `PasswordInput` built on `InputGroup` with a visibility toggle that has an accessible name; story.
**Where**: `frontend/src/features/auth/components/PasswordInput.tsx`
**Depends on**: None
**Reuses**: -
**Requirement**: STD-06 (AC 9)

**Tools**: MCP: NONE · Skill: `component-creation`, `frontend-testing`

**Done when**:

- [ ] Story `play`: toggling shows and hides the value
- [ ] Full gate passes

**Tests**: story
**Gate**: full
**Commit**: `feat(frontend): PasswordInput on InputGroup`

---

### T74: Login and register pages on the shared pieces

**What**: `LoginPage` and `RegisterUserPage` use `AuthCard`, `PasswordInput`, `FormField`; button labels are plain text; errors only through `FieldError errors={[…]}`; `LoginPage.test.tsx` drops `vi.mock` for MSW + `renderWithProviders`.
**Where**: `frontend/src/features/auth/LoginPage.tsx`
**Depends on**: T58, T72, T73
**Reuses**: -
**Requirement**: STD-06 (AC 9)

**Tools**: MCP: NONE · Skill: `form-creation`, `api-integration`, `frontend-testing`

**Done when**:

- [ ] Login test: success, invalid credentials, validation errors through the network
- [ ] No `register(` in the two pages
- [ ] Quick gate passes
- [ ] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: integration
**Gate**: quick
**Commit**: `refactor(frontend): login and register use AuthCard, PasswordInput, FormField`

---

### T75: Forgot and reset password pages on the shared pieces

**What**: Same as T74 for `ForgotPasswordPage` and `ResetPasswordPage`; `ResetPasswordPage.test.ts` adapted.
**Where**: `frontend/src/features/auth/ResetPasswordPage.tsx`
**Depends on**: T74
**Reuses**: -
**Requirement**: STD-06 (AC 9)

**Tools**: MCP: NONE · Skill: `form-creation`, `api-integration`, `frontend-testing`

**Done when**:

- [ ] No `register(` in the two pages
- [ ] Tests through the network for the changed flows
- [ ] Quick gate passes
- [ ] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: integration
**Gate**: quick
**Commit**: `refactor(frontend): forgot and reset password use the auth pieces`

---

### T76: `PlanNameDialog`

**What**: Merge `CreatePlanDialog` and `RenamePlanDialog` into `PlanNameDialog` with required `mode: "create" | "rename"` (title and submit derive from it), fields through `FormField`; `CreatePlanDialog.test.ts` becomes its test.
**Where**: `frontend/src/features/plans/components/PlanNameDialog.tsx`
**Depends on**: T58
**Reuses**: -
**Requirement**: STD-06 (AC 10)

**Tools**: MCP: NONE · Skill: `form-creation`, `api-integration`, `frontend-testing`

**Done when**:

- [ ] Test: create and rename submit the right request
- [ ] Old dialogs deleted
- [ ] Quick gate passes
- [ ] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: integration
**Gate**: quick
**Commit**: `refactor(frontend): PlanNameDialog replaces create and rename dialogs`

---

### T77: `InvitePlanDialog` on `FormField`

**What**: Its two `register` fields move to `FormField`.
**Where**: `frontend/src/features/plans/components/InvitePlanDialog.tsx`
**Depends on**: T58
**Reuses**: -
**Requirement**: STD-06 (AC 9), decision 5

**Tools**: MCP: NONE · Skill: `form-creation`, `api-integration`, `frontend-testing`

**Done when**:

- [ ] No `register(` left in `src`
- [ ] Invite flow test through the network
- [ ] Quick gate passes
- [ ] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: integration
**Gate**: quick
**Commit**: `refactor(frontend): invite dialog fields use FormField`

---

### T78: `usePlanPermissions`

**What**: Hook returning `PlanPermissions` mirroring `PlanAuthorization.java`, all false while the plan or role loads; replace every `myRole` comparison in components.
**Where**: `frontend/src/hooks/usePlanPermissions.ts`
**Depends on**: None
**Reuses**: -
**Requirement**: STD-06 (AC 11, 12)

**Tools**: MCP: NONE · Skill: `frontend-testing`, `feature-structure`

**Done when**:

- [ ] Test: role × capability matrix (OWNER, EDITOR, CONTRIBUTOR, VIEWER) + loading
- [ ] `grep -rn myRole src --include=*.tsx` returns nothing
- [ ] Quick gate passes
- [ ] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: unit
**Gate**: quick
**Commit**: `feat(frontend): usePlanPermissions replaces inline role checks`

---

### T79: `--warning` token and the palette ban

**What**: Add `--warning`/`--warning-foreground` to both themes; replace the two ambers and `Badge`'s greens with tokens; add the palette fragment to every layer (decision 1, `base/` included) with a message naming the tokens; config test.
**Where**: `frontend/eslint.config.js`
**Depends on**: T55
**Reuses**: -
**Requirement**: STD-06 (AC 13, 14)

**Tools**: MCP: NONE · Skill: `frontend-testing`

**Done when**:

- [ ] Config test: palette fragment active in every layer, including `components/**/base/**`
- [ ] `text-amber-600` in a component fails lint (checked, reverted)
- [ ] `pnpm lint` exits 0
- [ ] Build gate passes

**Tests**: tooling
**Gate**: build
**Commit**: `feat(frontend): warning token; ban raw palette colours`

---

### Phase 12: Form decomposition (STD-07) (T80–T88)

### T80: `useTransactionFormSubmit`

**What**: The 4 mutations and the series-scope flow move into the hook; `transaction.handlers.ts` created for its tests.
**Where**: `frontend/src/features/transactions/components/useTransactionFormSubmit.ts`
**Depends on**: None
**Reuses**: -
**Requirement**: STD-07 (AC 2)

**Tools**: MCP: NONE · Skill: `frontend-testing`, `feature-structure`

**Done when**:

- [ ] Test through MSW: create, update, series edit with each scope, duplicate, error path
- [ ] Quick gate passes
- [ ] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: unit
**Gate**: quick
**Commit**: `refactor(frontend): transaction submit flow in useTransactionFormSubmit`

---

### T81: `ItemsField` on `useFieldArray`

**What**: Items list with `useFieldArray`; totals read with `useWatch`; "items ≤ total" via `toCents`; story inside a test form.
**Where**: `frontend/src/features/transactions/components/ItemsField.tsx`
**Depends on**: None
**Reuses**: -
**Requirement**: STD-07 (AC 3)

**Tools**: MCP: NONE · Skill: `component-creation`, `frontend-testing`

**Done when**:

- [ ] Story: empty, several items, over-total error
- [ ] Drawer item tests pass
- [ ] Full gate passes
- [ ] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: story
**Gate**: full
**Commit**: `refactor(frontend): ItemsField on useFieldArray`

---

### T82: Participants on `useFieldArray`

**What**: `AttributionFields` manages `participants` with `useFieldArray` instead of `setValue("participants", …)`; story.
**Where**: `frontend/src/features/transactions/components/AttributionFields.tsx`
**Depends on**: None
**Reuses**: -
**Requirement**: STD-07 (AC 3)

**Tools**: MCP: NONE · Skill: `component-creation`, `frontend-testing`

**Done when**:

- [ ] No `setValue("participants"` left
- [ ] Story: single payer, split, many members
- [ ] Full gate passes
- [ ] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: story
**Gate**: full
**Commit**: `refactor(frontend): participants on useFieldArray`

---

### T83: `EndDateField`

**What**: One End date field used by create and series edit; story.
**Where**: `frontend/src/features/transactions/components/EndDateField.tsx`
**Depends on**: None
**Reuses**: -
**Requirement**: STD-07 (AC 4)

**Tools**: MCP: NONE · Skill: `component-creation`, `frontend-testing`

**Done when**:

- [ ] Both modes use it
- [ ] Story
- [ ] Full gate passes
- [ ] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: story
**Gate**: full
**Commit**: `refactor(frontend): one EndDateField for create and series edit`

---

### T84: Last-installment helper and `InstallmentsField`

**What**: The "last installment" preview is computed by a helper in `transactionForm.ts` (tested); `InstallmentsField` (on `NumberField`) shows it and is used by create and series edit.
**Where**: `frontend/src/features/transactions/components/InstallmentsField.tsx`
**Depends on**: None
**Reuses**: -
**Requirement**: STD-07 (AC 4, 5)

**Tools**: MCP: NONE · Skill: `component-creation`, `frontend-testing`

**Done when**:

- [ ] Helper test: even split, remainder cents, 1 installment
- [ ] Story
- [ ] Full gate passes
- [ ] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: unit + story
**Gate**: full
**Commit**: `refactor(frontend): InstallmentsField with a tested last-installment helper`

---

### T85: `TransactionFormDrawer` assembly

**What**: Remaining fields through `FormField`; no root `watch()`/`setValue()`; the component composes sections (~150–250 lines).
**Where**: `frontend/src/features/transactions/components/TransactionFormDrawer.tsx`
**Depends on**: T80, T81, T82, T83, T84
**Reuses**: -
**Requirement**: STD-07 (AC 6)

**Tools**: MCP: NONE · Skill: `form-creation`, `api-integration`, `frontend-testing`

**Done when**:

- [ ] `transactionForm.test.ts` (the former drawer tests, T22) and `TransactionFormDrawer.test.tsx` pass, adapted only in imports and value entry
- [ ] No `watch(` at the form root, no `setValue(` for field binding
- [ ] Quick gate passes
- [ ] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: integration
**Gate**: quick
**Commit**: `refactor(frontend): TransactionFormDrawer composes its sections`

---

### T86: `useCategoryFormSubmit`

**What**: The category form's mutations move into the hook.
**Where**: `frontend/src/features/categories/components/useCategoryFormSubmit.ts`
**Depends on**: None
**Reuses**: -
**Requirement**: STD-07 (AC 2)

**Tools**: MCP: NONE · Skill: `frontend-testing`, `feature-structure`

**Done when**:

- [ ] Test through MSW: create, update, error path
- [ ] Quick gate passes
- [ ] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: unit
**Gate**: quick
**Commit**: `refactor(frontend): category submit flow in useCategoryFormSubmit`

---

### T87: Member limits on `useFieldArray`

**What**: `CategoryLimitFields` manages `memberLimits` with `useFieldArray`; story.
**Where**: `frontend/src/features/categories/components/CategoryLimitFields.tsx`
**Depends on**: None
**Reuses**: -
**Requirement**: STD-07 (AC 3)

**Tools**: MCP: NONE · Skill: `component-creation`, `frontend-testing`

**Done when**:

- [ ] Story: no limit, shared limit, per-member limits
- [ ] Full gate passes
- [ ] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: story
**Gate**: full
**Commit**: `refactor(frontend): member limits on useFieldArray`

---

### T88: `CategoryFormSheet` assembly

**What**: Remaining fields through `FormField`; composes its sections.
**Where**: `frontend/src/features/categories/components/CategoryFormSheet.tsx`
**Depends on**: T86, T87
**Reuses**: -
**Requirement**: STD-07 (AC 6)

**Tools**: MCP: NONE · Skill: `form-creation`, `api-integration`, `frontend-testing`

**Done when**:

- [ ] `categoryForm.test.ts` and `CategoryFormSheet.test.tsx` pass, adapted only in imports and value entry
- [ ] Quick gate passes
- [ ] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: integration
**Gate**: quick
**Commit**: `refactor(frontend): CategoryFormSheet composes its sections`

---

### Phase 13: Typography (STD-08) (T89–T96)

### T89: `typographyVariants`, `Heading`, `Text`

**What**: `typographyVariants` (cva: `display`, `headline`, `title`, `label`, `body`, `secondary`, `caption`) exported for non-HTML targets; `Heading` (`level` 1–6) and `Text` (`as`, default `span`).
**Where**: `frontend/src/components/typography/base/typographyVariants.ts`
**Depends on**: None
**Reuses**: -
**Requirement**: STD-08 (AC 1, 5)

**Tools**: MCP: NONE · Skill: `component-creation`, `frontend-testing`

**Done when**:

- [ ] Stories: every variant, every level, long text
- [ ] Full gate passes

**Tests**: story
**Gate**: full
**Commit**: `feat(frontend): Heading and Text over one type scale`

---

### T90: `PageHeader`

**What**: `PageHeader` (title + optional description/actions) on `Heading`/`Text`.
**Where**: `frontend/src/components/pageHeader/PageHeader.tsx`
**Depends on**: T89
**Reuses**: -
**Requirement**: STD-08 (AC 4)

**Tools**: MCP: NONE · Skill: `component-creation`, `frontend-testing`

**Done when**:

- [ ] Story: title only, with description and actions, mobile viewport
- [ ] Full gate passes

**Tests**: story
**Gate**: full
**Commit**: `feat(frontend): PageHeader`

---

### T91: `SectionHeader` on the scale

**What**: Rebuild `SectionHeader` on `Heading` (`title`) and `Text`; removes `text-md`.
**Where**: `frontend/src/components/sectionHeader/SectionHeader.tsx`
**Depends on**: T89
**Reuses**: -
**Requirement**: STD-08 (AC 4)

**Tools**: MCP: NONE · Skill: `component-creation`, `frontend-testing`

**Done when**:

- [ ] Story
- [ ] Full gate passes

**Tests**: story
**Gate**: full
**Commit**: `refactor(frontend): SectionHeader on the type scale`

---

### T92: Typography: app, auth, 404, plans

**What**: Raw `<p>`/`<hN>` and size/weight classes in `src/app/**`, `features/auth`, `features/notFound` (404 numeral as `display`) and `features/plans` move to `Heading`/`Text`/`PageHeader`/`SectionHeader`/`FieldDescription`.
**Where**: `frontend/src/features/plans/PlansPage.tsx`
**Depends on**: T90, T91
**Reuses**: -
**Requirement**: STD-08 (AC 2, 3, 4)

**Tools**: MCP: NONE · Skill: `feature-structure`, `component-creation`

**Done when**:

- [ ] No raw text tags or size/weight classes in these folders
- [ ] Build gate passes
- [ ] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: none
**Gate**: build
**Commit**: `refactor(frontend): typography scale in app, auth, 404 and plans`

---

### T93: Typography: overview

**What**: Same for `features/overview`, including the accepted `SummaryCards` changes and the trend chart's SVG tick via `typographyVariants({ variant: "label" })`.
**Where**: `frontend/src/features/overview/components/SummaryCards.tsx`
**Depends on**: T89
**Reuses**: -
**Requirement**: STD-08 (AC 2, 3)

**Tools**: MCP: NONE · Skill: `feature-structure`, `component-creation`

**Done when**:

- [ ] No raw text tags or size/weight classes in the folder
- [ ] Build gate passes
- [ ] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: none
**Gate**: build
**Commit**: `refactor(frontend): typography scale in overview`

---

### T94: Typography: transactions and categories

**What**: Same for `features/transactions` and `features/categories`; field help text through `FieldDescription`.
**Where**: `frontend/src/features/transactions/`
**Depends on**: T89
**Reuses**: -
**Requirement**: STD-08 (AC 2, 3, 4)

**Tools**: MCP: NONE · Skill: `feature-structure`, `component-creation`

**Done when**:

- [ ] No raw text tags or size/weight classes in the folders
- [ ] Build gate passes
- [ ] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: none
**Gate**: build
**Commit**: `refactor(frontend): typography scale in transactions and categories`

---

### T95: Typography: shared compositions

**What**: Same for `src/components/**` outside `base/`.
**Where**: `frontend/src/components/`
**Depends on**: T89
**Reuses**: -
**Requirement**: STD-08 (AC 2, 3)

**Tools**: MCP: NONE · Skill: `feature-structure`, `component-creation`

**Done when**:

- [ ] No raw text tags or size/weight classes outside `base/`
- [ ] Full gate passes
- [ ] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: none
**Gate**: full
**Commit**: `refactor(frontend): typography scale in shared compositions`

---

### T96: Typography lint

**What**: Add the typography fragment (sizes `text-xs`…`text-9xl`, arbitrary `text-[…]`, undefined `text-md`; weights `font-thin`…`font-black`) and the raw `<p>`/`<h1>`–`<h6>` fragment to every layer outside `base/`; alignment and family classes stay allowed; config test.
**Where**: `frontend/eslint.config.js`
**Depends on**: T92, T93, T94, T95
**Reuses**: -
**Requirement**: STD-08 (AC 2, 3)

**Tools**: MCP: NONE · Skill: `frontend-testing`

**Done when**:

- [ ] Config test: fragments active outside `base/`, absent inside
- [ ] `<p className="text-sm">` in a feature fails lint (checked, reverted)
- [ ] `pnpm lint` exits 0
- [ ] Build gate passes

**Tests**: tooling
**Gate**: build
**Commit**: `build(frontend): enforce typography through Heading and Text`

---

### Phase 14: Mechanical conventions (STD-09) (T97–T103)

### T97: Function declarations: `src/components`, `src/hooks`, `src/lib`, `src/utils`

**What**: Convert top-level arrows and function expressions, and handlers declared inside components, to `function` declarations in `src/components`, `src/hooks`, `src/lib`, `src/utils`; inline callbacks stay arrows. Parameters are typed where a function-type annotation is lost (E2).
**Where**: `frontend/src/components/`
**Depends on**: None
**Reuses**: -
**Requirement**: STD-09 (AC 1)

**Tools**: MCP: NONE · Skill: `feature-structure`, `component-creation`

**Done when**:

- [ ] No `func-style: declaration` violation in the area (rule run ad hoc)
- [ ] Quick gate passes
- [ ] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: none
**Gate**: quick
**Commit**: `refactor(frontend): function declarations in src/components, src/hooks, src/lib, src/utils`

---

### T98: Function declarations: `src/api`, `src/app`, `src/test`

**What**: Convert top-level arrows and function expressions, and handlers declared inside components, to `function` declarations in `src/api`, `src/app`, `src/test`; inline callbacks stay arrows. Parameters are typed where a function-type annotation is lost (E2).
**Where**: `frontend/src/api/`
**Depends on**: None
**Reuses**: -
**Requirement**: STD-09 (AC 1)

**Tools**: MCP: NONE · Skill: `feature-structure`, `component-creation`

**Done when**:

- [ ] No `func-style: declaration` violation in the area (rule run ad hoc)
- [ ] Quick gate passes
- [ ] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: none
**Gate**: quick
**Commit**: `refactor(frontend): function declarations in src/api, src/app, src/test`

---

### T99: Function declarations: `features/overview` and `features/categories`

**What**: Convert top-level arrows and function expressions, and handlers declared inside components, to `function` declarations in `features/overview` and `features/categories`; inline callbacks stay arrows. Parameters are typed where a function-type annotation is lost (E2).
**Where**: `frontend/src/features/overview/`
**Depends on**: None
**Reuses**: -
**Requirement**: STD-09 (AC 1)

**Tools**: MCP: NONE · Skill: `feature-structure`, `component-creation`

**Done when**:

- [ ] No `func-style: declaration` violation in the area (rule run ad hoc)
- [ ] Quick gate passes
- [ ] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: none
**Gate**: quick
**Commit**: `refactor(frontend): function declarations in features/overview and features/categories`

---

### T100: Function declarations: `features/transactions`

**What**: Convert top-level arrows and function expressions, and handlers declared inside components, to `function` declarations in `features/transactions`; inline callbacks stay arrows. Parameters are typed where a function-type annotation is lost (E2).
**Where**: `frontend/src/features/transactions/`
**Depends on**: None
**Reuses**: -
**Requirement**: STD-09 (AC 1)

**Tools**: MCP: NONE · Skill: `feature-structure`, `component-creation`

**Done when**:

- [ ] No `func-style: declaration` violation in the area (rule run ad hoc)
- [ ] Quick gate passes
- [ ] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: none
**Gate**: quick
**Commit**: `refactor(frontend): function declarations in features/transactions`

---

### T101: Function declarations: `features/plans`, `features/auth`, `features/notFound`, config and scripts

**What**: Convert top-level arrows and function expressions, and handlers declared inside components, to `function` declarations in `features/plans`, `features/auth`, `features/notFound`, config and scripts; inline callbacks stay arrows. Parameters are typed where a function-type annotation is lost (E2).
**Where**: `frontend/src/features/plans/`
**Depends on**: None
**Reuses**: -
**Requirement**: STD-09 (AC 1)

**Tools**: MCP: NONE · Skill: `feature-structure`, `component-creation`

**Done when**:

- [ ] No `func-style: declaration` violation in the area (rule run ad hoc)
- [ ] Quick gate passes
- [ ] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: none
**Gate**: quick
**Commit**: `refactor(frontend): function declarations in features/plans, features/auth, features/notFound, config and scripts`

---

### T102: `func-style` rule

**What**: Enable `func-style: ["error", "declaration"]` with options calibrated against the ESLint docs; config test.
**Where**: `frontend/eslint.config.js`
**Depends on**: T97, T98, T99, T100, T101
**Reuses**: -
**Requirement**: STD-09 (AC 1)

**Tools**: MCP: NONE · Skill: `frontend-testing`

**Done when**:

- [ ] `const Foo = () => …` at top level fails lint (checked, reverted)
- [ ] `pnpm lint` exits 0
- [ ] Build gate passes

**Tests**: tooling
**Gate**: build
**Commit**: `build(frontend): enforce function declarations`

---

### T103: Comments explain why, without spec IDs

**What**: Remove spec/requirement IDs from comments and JSDoc; replace comments that narrate what the code does with names or extractions; enrich shallow "why" comments with their consequence (E5).
**Where**: `frontend/src/`
**Depends on**: None
**Reuses**: -
**Requirement**: STD-09 (AC 2, 3)

**Tools**: MCP: NONE · Skill: `feature-structure`, `component-creation`

**Done when**:

- [ ] `grep -rE "(CAT|UX|NAV|STD|SESS)-[0-9]+" src --include=*.ts* | grep -v test` returns nothing
- [ ] Quick gate passes
- [ ] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: none
**Gate**: quick
**Commit**: `refactor(frontend): comments explain why, without spec IDs`

---

### Phase 15: Story coverage (STD-10) (T104–T111)

### T104: `check-siblings.ts`: story report

**What**: TypeScript script (Node 24 type stripping, `typescript` compiler API) listing every `.tsx` under `src/` (except `index.tsx`, `src/test/**`, tests and stories) without a sibling `.stories.tsx` that does not directly import `@/api/services`, `@/app/providers` or `react-router-dom`; non-zero exit naming each file. Not wired yet.
**Where**: `frontend/scripts/check-siblings.ts`
**Depends on**: None
**Reuses**: -
**Requirement**: STD-10 (AC 1, 2)

**Tools**: MCP: NONE · Skill: `frontend-testing`

**Done when**:

- [ ] `check-siblings.test.ts` (tooling): presentational without story fails naming it; with story passes; container exempt by each import kind
- [ ] `tsconfig.node.json` covers `scripts/`
- [ ] Quick gate passes

**Tests**: tooling
**Gate**: quick
**Commit**: `build(frontend): sibling gate script, story report`

---

### T105: Stories: `src/components` primitives (`base/`)

**What**: Every component the T104 report lists in `src/components` primitives (`base/`) gets a story following the checklist; a component that cannot render from props alone is split into container + view, the view getting the story (STD-10 AC 4).
**Where**: `frontend/src/components/*/base/`
**Depends on**: T104
**Reuses**: -
**Requirement**: STD-10 (AC 1, 3, 4)

**Tools**: MCP: NONE · Skill: `component-creation`, `frontend-testing`

**Done when**:

- [ ] The report lists nothing in the area
- [ ] Each story file covers variants, handled states, extreme content, mobile viewport when the layout changes
- [ ] Full gate passes
- [ ] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: story
**Gate**: full
**Commit**: `test(frontend): stories for src/components primitives (base/)`

---

### T106: Stories: `src/components` compositions

**What**: Every component the T104 report lists in `src/components` compositions gets a story following the checklist; a component that cannot render from props alone is split into container + view, the view getting the story (STD-10 AC 4).
**Where**: `frontend/src/components/`
**Depends on**: T104
**Reuses**: -
**Requirement**: STD-10 (AC 1, 3, 4)

**Tools**: MCP: NONE · Skill: `component-creation`, `frontend-testing`

**Done when**:

- [ ] The report lists nothing in the area
- [ ] Each story file covers variants, handled states, extreme content, mobile viewport when the layout changes
- [ ] Full gate passes
- [ ] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: story
**Gate**: full
**Commit**: `test(frontend): stories for src/components compositions`

---

### T107: Stories: `features/overview`

**What**: Every component the T104 report lists in `features/overview` gets a story following the checklist; a component that cannot render from props alone is split into container + view, the view getting the story (STD-10 AC 4).
**Where**: `frontend/src/features/overview/`
**Depends on**: T104
**Reuses**: -
**Requirement**: STD-10 (AC 1, 3, 4)

**Tools**: MCP: NONE · Skill: `component-creation`, `frontend-testing`

**Done when**:

- [ ] The report lists nothing in the area
- [ ] Each story file covers variants, handled states, extreme content, mobile viewport when the layout changes
- [ ] Full gate passes
- [ ] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: story
**Gate**: full
**Commit**: `test(frontend): stories for features/overview`

---

### T108: Stories: `features/transactions`

**What**: Every component the T104 report lists in `features/transactions` gets a story following the checklist; a component that cannot render from props alone is split into container + view, the view getting the story (STD-10 AC 4).
**Where**: `frontend/src/features/transactions/`
**Depends on**: T104
**Reuses**: -
**Requirement**: STD-10 (AC 1, 3, 4)

**Tools**: MCP: NONE · Skill: `component-creation`, `frontend-testing`

**Done when**:

- [ ] The report lists nothing in the area
- [ ] Each story file covers variants, handled states, extreme content, mobile viewport when the layout changes
- [ ] Full gate passes
- [ ] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: story
**Gate**: full
**Commit**: `test(frontend): stories for features/transactions`

---

### T109: Stories: `features/categories`

**What**: Every component the T104 report lists in `features/categories` gets a story following the checklist; a component that cannot render from props alone is split into container + view, the view getting the story (STD-10 AC 4).
**Where**: `frontend/src/features/categories/`
**Depends on**: T104
**Reuses**: -
**Requirement**: STD-10 (AC 1, 3, 4)

**Tools**: MCP: NONE · Skill: `component-creation`, `frontend-testing`

**Done when**:

- [ ] The report lists nothing in the area
- [ ] Each story file covers variants, handled states, extreme content, mobile viewport when the layout changes
- [ ] Full gate passes
- [ ] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: story
**Gate**: full
**Commit**: `test(frontend): stories for features/categories`

---

### T110: Stories: `features/plans`, `features/auth`, `features/notFound`, `src/app`

**What**: Every component the T104 report lists in `features/plans`, `features/auth`, `features/notFound`, `src/app` gets a story following the checklist; a component that cannot render from props alone is split into container + view, the view getting the story (STD-10 AC 4).
**Where**: `frontend/src/features/plans/`
**Depends on**: T104
**Reuses**: -
**Requirement**: STD-10 (AC 1, 3, 4)

**Tools**: MCP: NONE · Skill: `component-creation`, `frontend-testing`

**Done when**:

- [ ] The report lists nothing in the area
- [ ] Each story file covers variants, handled states, extreme content, mobile viewport when the layout changes
- [ ] Full gate passes
- [ ] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: story
**Gate**: full
**Commit**: `test(frontend): stories for features/plans, features/auth, features/notFound, src/app`

---

### T111: Story gate in `pnpm test`

**What**: `test` runs the story report before Vitest; CI follows through `pnpm test`.
**Where**: `frontend/package.json`
**Depends on**: T105, T106, T107, T108, T109, T110
**Reuses**: -
**Requirement**: STD-10 (AC 2)

**Tools**: MCP: NONE · Skill: `frontend-testing`

**Done when**:

- [ ] Deleting a story fails `pnpm test` naming the component (checked, reverted)
- [ ] Full gate passes

**Tests**: tooling
**Gate**: full
**Commit**: `build(frontend): story gate runs in pnpm test`

---

### Phase 16: Test coverage (STD-11) (T112–T116)

### T112: `check-siblings.ts`: test report

**What**: Add the logic classification: a `.ts` needs a sibling `.test.ts` when it has a decision point (`if`, ternary, `switch`, `&&`/`||`/`??` as a value, loop, `try`/`catch`), arithmetic on non-literals, or an iteration callback; `*.handlers.ts` exempt by suffix.
**Where**: `frontend/scripts/check-siblings.ts`
**Depends on**: T111
**Reuses**: -
**Requirement**: STD-11 (AC 1, 2)

**Tools**: MCP: NONE · Skill: `frontend-testing`

**Done when**:

- [ ] Test per decision-point kind, arithmetic, iteration callback; a type-only, a constant-only and a `*.handlers.ts` module exempt
- [ ] Quick gate passes

**Tests**: tooling
**Gate**: quick
**Commit**: `build(frontend): sibling gate script, test report`

---

### T113: Tests for the logic modules the report lists

**What**: Sibling tests for every module the report names (today `buildPagedQuery`, `resolveErrorMessage`, `resolveSuccessMessage`, plus any new one).
**Where**: `frontend/src/api/utils/buildPagedQuery.test.ts`
**Depends on**: T112
**Reuses**: -
**Requirement**: STD-11 (AC 1)

**Tools**: MCP: NONE · Skill: `frontend-testing`, `feature-structure`

**Done when**:

- [ ] The test report lists nothing
- [ ] Every branch of each module covered
- [ ] Quick gate passes
- [ ] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: unit
**Gate**: quick
**Commit**: `test(frontend): cover the remaining logic modules`

---

### T114: Coverage scope and threshold

**What**: Vitest `v8` coverage on `src/**/*.ts` excluding tests, `*.handlers.ts`, `src/test/**`, `.d.ts`; branch threshold 90%.
**Where**: `frontend/vite.config.ts`
**Depends on**: T113
**Reuses**: -
**Requirement**: STD-11 (AC 3, 4)

**Tools**: MCP: NONE · Skill: `frontend-testing`

**Done when**:

- [ ] `vitest run --coverage` reports per-file branches; components, stories, DTOs and types excluded
- [ ] Quick gate passes

**Tests**: tooling
**Gate**: quick
**Commit**: `build(frontend): coverage on logic modules with a 90% branch floor`

---

### T115: Close the branch gaps

**What**: Add the missing cases (asserting behaviour, never covering without asserting) until branch coverage is ≥ 90%.
**Where**: `frontend/src/`
**Depends on**: T114
**Reuses**: -
**Requirement**: STD-11 (AC 3)

**Tools**: MCP: NONE · Skill: `frontend-testing`, `feature-structure`

**Done when**:

- [ ] Coverage ≥ 90% branches
- [ ] Quick gate passes
- [ ] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: unit
**Gate**: quick
**Commit**: `test(frontend): close branch coverage gaps on logic`

---

### T116: Full gate in `pnpm test`

**What**: `test` = `node scripts/check-siblings.ts && vitest run --coverage`.
**Where**: `frontend/package.json`
**Depends on**: T115
**Reuses**: -
**Requirement**: STD-11 (AC 2, 3)

**Tools**: MCP: NONE · Skill: `frontend-testing`

**Done when**:

- [ ] Deleting a helper test fails `pnpm test` naming it; removing a branch's case fails coverage (checked, reverted)
- [ ] Full gate passes

**Tests**: tooling
**Gate**: full
**Commit**: `build(frontend): sibling and coverage gates in pnpm test`

---

### Phase 17: Transactions tab and the logic cap (STD-12) (T117–T125)

### T117: `toPagination`

**What**: Paged response → table pagination, beside `buildPagedQuery`; used by every paged consumer.
**Where**: `frontend/src/api/utils/toPagination.ts`
**Depends on**: None
**Reuses**: -
**Requirement**: STD-12 (AC 2)

**Tools**: MCP: NONE · Skill: `frontend-testing`, `feature-structure`

**Done when**:

- [ ] Test: first, middle, last, empty page
- [ ] Quick gate passes
- [ ] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: unit
**Gate**: quick
**Commit**: `feat(frontend): toPagination beside buildPagedQuery`

---

### T118: `transactionSort.ts`

**What**: Column ↔ sort-field maps out of `TransactionsTab`.
**Where**: `frontend/src/features/transactions/components/transactionSort.ts`
**Depends on**: None
**Reuses**: -
**Requirement**: STD-12 (AC 1)

**Tools**: MCP: NONE · Skill: `frontend-testing`, `feature-structure`

**Done when**:

- [ ] Test: every column both ways, unknown column
- [ ] Quick gate passes
- [ ] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: unit
**Gate**: quick
**Commit**: `refactor(frontend): transaction sort mapping in transactionSort.ts`

---

### T119: `useTransactionSearch`

**What**: Debounced search draft ↔ URL.
**Where**: `frontend/src/features/transactions/components/useTransactionSearch.ts`
**Depends on**: None
**Reuses**: -
**Requirement**: STD-12 (AC 1)

**Tools**: MCP: NONE · Skill: `frontend-testing`, `feature-structure`

**Done when**:

- [ ] Test with fake timers: debounce, URL sync both ways, clear
- [ ] Quick gate passes
- [ ] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: unit
**Gate**: quick
**Commit**: `refactor(frontend): transaction search in useTransactionSearch`

---

### T120: Inline-save mapper

**What**: The inline-save payload is built by a mapper in `transactionForm.ts`.
**Where**: `frontend/src/features/transactions/components/transactionForm.ts`
**Depends on**: None
**Reuses**: -
**Requirement**: STD-12 (AC 1)

**Tools**: MCP: NONE · Skill: `frontend-testing`, `feature-structure`

**Done when**:

- [ ] Mapper test: each editable field
- [ ] Quick gate passes
- [ ] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: unit
**Gate**: quick
**Commit**: `refactor(frontend): inline-save payload mapper`

---

### T121: `useTransactionActions`

**What**: Edit, duplicate, delete (series scope or confirm) and drawer state; `DrawerState` at module scope.
**Where**: `frontend/src/features/transactions/components/useTransactionActions.ts`
**Depends on**: None
**Reuses**: -
**Requirement**: STD-12 (AC 1)

**Tools**: MCP: NONE · Skill: `frontend-testing`, `feature-structure`

**Done when**:

- [ ] Test through MSW: edit opens, duplicate opens prefilled, delete single and series with each scope, cancel
- [ ] Quick gate passes
- [ ] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: unit
**Gate**: quick
**Commit**: `refactor(frontend): transaction row actions in useTransactionActions`

---

### T122: `useCsvImport`

**What**: CSV import flow out of `TransactionsTab`.
**Where**: `frontend/src/features/transactions/components/useCsvImport.ts`
**Depends on**: None
**Reuses**: -
**Requirement**: STD-12 (AC 1)

**Tools**: MCP: NONE · Skill: `frontend-testing`, `feature-structure`

**Done when**:

- [ ] Test through MSW: success, partial failure, error
- [ ] Quick gate passes
- [ ] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: unit
**Gate**: quick
**Commit**: `refactor(frontend): CSV import in useCsvImport`

---

### T123: `TransactionsTab` composes the hooks

**What**: First write `TransactionsTab.test.tsx` (`renderWithProviders`, MSW) against the current tab as a guard; then `TransactionsTab` uses T117–T122 with behaviour unchanged.
**Where**: `frontend/src/features/transactions/TransactionsTab.tsx`
**Depends on**: T117, T118, T119, T120, T121, T122
**Reuses**: -
**Requirement**: STD-12 (AC 1, 2)

**Tools**: MCP: NONE · Skill: `form-creation`, `api-integration`, `frontend-testing`

**Done when**:

- [ ] `TransactionsTab.test.tsx` green before and after the refactor: search, sort, page, open edit, duplicate, delete
- [ ] ≤ 60 code lines before the main `return`
- [ ] Quick gate passes
- [ ] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: integration
**Gate**: quick
**Commit**: `refactor(frontend): TransactionsTab composes its hooks`

---

### T124: `local/no-jsx-iife`

**What**: Local rule in TypeScript: any call whose callee is an arrow or function expression inside a JSX expression container (children or attributes) is an error; registered in the `local` plugin.
**Where**: `frontend/eslint/rules/noJsxIife.ts`
**Depends on**: T123
**Reuses**: -
**Requirement**: STD-12 (AC 4, 5)

**Tools**: MCP: NONE · Skill: `frontend-testing`

**Done when**:

- [ ] `RuleTester` cases: IIFE in children, in an attribute, a normal call allowed
- [ ] `pnpm lint` exits 0
- [ ] Build gate passes

**Tests**: tooling
**Gate**: build
**Commit**: `build(frontend): local rule bans IIFEs in JSX`

---

### T125: `local/component-logic-cap`

**What**: Local rule: a PascalCase function (or one assigned to a PascalCase variable, incl. inside `memo`) returning JSX may have at most `max` (60) code lines from its body start to its last top-level `return`; blank and comment lines do not count; early returns count; message suggests a hook. Any component over the cap gets its hook extracted in this task (if more than two do, stop and split into tasks).
**Where**: `frontend/eslint/rules/componentLogicCap.ts`
**Depends on**: T124
**Reuses**: -
**Requirement**: STD-12 (AC 3, 5)

**Tools**: MCP: NONE · Skill: `frontend-testing`

**Done when**:

- [ ] `RuleTester` cases: 60 and 61 lines, non-component function, blank/comment lines not counted, early return counted, `memo` component
- [ ] Config test asserts both local rules
- [ ] `pnpm lint` exits 0
- [ ] Build gate passes
- [ ] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: tooling
**Gate**: build
**Commit**: `build(frontend): local rule caps component logic at 60 lines`

---

## Phase Execution Map

```
P1 → P2 → P3 → P4 → P5 → P6 → P7 → P8 → P9 → P10 → P11 → P12 → P13 → P14 → P15 → P16 → P17

P1  Written standards (STD-01): T1–T9 (9 tasks)
P2  Lint baseline: config and mechanical fixes (STD-02): T10–T13 (4 tasks)
P3  Lint baseline: providers (STD-02, C3): T14–T21 (8 tasks)
P4  Lint baseline: component files export only components (STD-02, C1): T22–T29 (8 tasks)
P5  Gates before production (STD-03): T30–T33 (4 tasks)
P6  Test infrastructure (STD-04): T34–T42 (9 tasks)
P7  Structure: filter state and `app/home` (STD-05, decision 4): T43–T47 (5 tasks)
P8  Structure: folders and layered imports (STD-05): T48–T55 (8 tasks)
P9  Shared components: money, `FormField`, `CurrencyInput` (STD-06): T56–T62 (7 tasks)
P10 Shared components: toggles, `NumberField`, `Amount` (STD-06): T63–T69 (7 tasks)
P11 Shared components: shells, auth, plans, permissions, tokens (STD-06): T70–T79 (10 tasks)
P12 Form decomposition (STD-07): T80–T88 (9 tasks)
P13 Typography (STD-08): T89–T96 (8 tasks)
P14 Mechanical conventions (STD-09): T97–T103 (7 tasks)
P15 Story coverage (STD-10): T104–T111 (8 tasks)
P16 Test coverage (STD-11): T112–T116 (5 tasks)
P17 Transactions tab and the logic cap (STD-12): T117–T125 (9 tasks)
```

125 tasks in 17 phases. Execute packs whole phases into ~7-task batches, one sub-agent worker per batch (sequential).

## Validation

### Task Granularity Check

| Task | Scope | Status |
| ---- | ----- | ------ |
| T1: Rewrite the `component-creation` skill | 1 skill file | ✅ Granular |
| T2: Rewrite the `feature-structure` skill | 1 skill file | ✅ Granular |
| T3: Rewrite the `form-creation` skill | 1 skill file | ✅ Granular |
| T4: Rewrite the `api-integration` skill | 1 skill file | ✅ Granular |
| T5: Create the `frontend-testing` skill | 1 skill file | ✅ Granular |
| T6: Rewrite the `CLAUDE.md` Frontend section | 1 section | ✅ Granular |
| T7: Update `CONVENTIONS.md` | 1 doc | ✅ Granular |
| T8: Update `STRUCTURE.md` | 1 doc | ✅ Granular |
| T9: Update `TESTING.md` | 1 doc | ✅ Granular |
| T10: ESLint foundation with a config test | 1 config + its test | ✅ Granular |
| T11: `type` everywhere | 1 rule + autofix | ✅ Granular |
| T12: Storybook configuration fixes | mechanical import change | ⚠️ Cohesive (one mechanical change) |
| T13: `components.json` points at the real paths | 1 file | ✅ Granular |
| T14: Split `AuthProvider` | 1 provider | ✅ Granular |
| T15: Split `PlanProvider` | 1 provider | ✅ Granular |
| T16: Split `ThemeProvider` | 1 provider | ✅ Granular |
| T17: Move the query client out of `TanStackQueryProvider` | 1 constant | ✅ Granular |
| T18: Split `ConfirmDialog` (`useConfirmDialog.tsx`) | 1 provider | ✅ Granular |
| T19: Split `SeriesScopeDialog` | 1 provider | ✅ Granular |
| T20: Split the `CategoryFormSheet` provider | 1 provider | ✅ Granular |
| T21: Split the `Table` context | 1 provider | ✅ Granular |
| T22: Extract the transaction form's schema and mappers | 1 module | ✅ Granular |
| T23: Extract the category form's helpers, schema and mappers | 1 module | ✅ Granular |
| T24: Extract `DeleteCategoryDialog` helpers | 1 module | ✅ Granular |
| T25: Split `transactionColumns.tsx` | 1 module split | ✅ Granular |
| T26: Move the single non-component exports of four feature files | 4 one-line moves, same change | ⚠️ Cohesive (one mechanical change) |
| T27: Move primitive variant exports | 3 cva moves, same change | ⚠️ Cohesive (one mechanical change) |
| T28: Type the table without `any` | 1 module + call sites | ✅ Granular |
| T29: Lint green: `only-export-components` as error | 1 rule level | ✅ Granular |
| T30: `pre-commit` hook runs lint-staged | 1 hook + its config | ✅ Granular |
| T31: `commit-msg` hook runs `check_commit.py` | 1 hook | ✅ Granular |
| T32: `ci.yml` with frontend and backend jobs | 1 workflow, 2 jobs | ✅ Granular |
| T33: `changes` and `deploy` jobs; remove `deploy.yml` | 2 jobs in 1 workflow | ✅ Granular |
| T34: MSW server and the unhandled-request recorder | 1 setup + recorder | ✅ Granular |
| T35: `renderWithProviders`; auth handlers; `useAuthService` through MSW | 1 test file + handlers | ✅ Granular |
| T36: Dashboard handlers; `useDashboardService` through MSW | 1 test file + handlers | ✅ Granular |
| T37: Category handlers; category service through MSW | 1 test file + handlers | ✅ Granular |
| T38: Plan handlers; `usePlanService` through MSW | 1 test file + handlers | ✅ Granular |
| T39: `findracoApi` tests through MSW, including session refresh | 1 test file | ✅ Granular |
| T40: Lint: test support only from tests | 1 fragment | ✅ Granular |
| T41: Storybook in `pnpm test`, a11y in error mode | 1 config + fixes | ✅ Granular |
| T42: CI installs the Playwright browser | 1 step | ✅ Granular |
| T43: `useSearchParamGroup` | 1 hook | ✅ Granular |
| T44: Overview filters own their params | 1 hook + params | ✅ Granular |
| T45: Transactions filters own their params | 1 hook + params | ✅ Granular |
| T46: `app/home`: page, tab and plan params | 1 hook + page move | ✅ Granular |
| T47: `HomeFiltersGate` and `filterStorage` move to `app/home` | 1 component + storage move | ✅ Granular |
| T48: Lift shared pieces to the root | 3 moves | ⚠️ Cohesive (one mechanical change) |
| T49: `features/overview` | feature move | ✅ Granular |
| T50: `features/transactions` | feature move | ✅ Granular |
| T51: `features/categories`; `features/home` removed | feature move | ✅ Granular |
| T52: `features/auth` | feature merge | ✅ Granular |
| T53: `app/layout` | 4 moves | ⚠️ Cohesive (one mechanical change) |
| T54: `base/` marker for primitives | mechanical move | ⚠️ Cohesive (one mechanical change) |
| T55: Layered import restrictions | 1 config block set | ✅ Granular |
| T56: `money.ts` | 1 module | ✅ Granular |
| T57: Every display goes through `formatMoney` | call-site replacement | ⚠️ Cohesive (one mechanical change) |
| T58: `FormField` | 1 component | ✅ Granular |
| T59: `CurrencyInput` | 1 component + its helper | ✅ Granular |
| T60: `CurrencyInput` in the filter and inline edit | 2 consumers | ⚠️ Cohesive (one mechanical change) |
| T61: Transaction form money fields are numeric | schema + 3 fields | ✅ Granular |
| T62: Category form limits are numeric; `maskCurrency` removed | schema + 2 fields + deletion | ✅ Granular |
| T63: `ToggleGroup` primitive with `tone` and `chip` | 1 primitive pair | ✅ Granular |
| T64: `TransactionTypeToggle` on `ToggleGroup` | 1 component | ✅ Granular |
| T65: Transaction form toggles on `ToggleGroup` | 4 toggles, 2 files | ⚠️ Cohesive (one mechanical change) |
| T66: Category limit mode on `ToggleGroup` | 1 toggle | ✅ Granular |
| T67: `MemberFilterChips` on the `chip` variant | 1 component | ✅ Granular |
| T68: `NumberField` for installments | 1 primitive + 3 call sites | ✅ Granular |
| T69: `Amount` | 1 component | ✅ Granular |
| T70: `FormSheet`; `CategoryFormSheet` on it | 1 component + 1 adopter | ✅ Granular |
| T71: `TransactionFormDrawer` on `FormSheet` | 1 adopter | ✅ Granular |
| T72: `AuthCard` | 1 component | ✅ Granular |
| T73: `PasswordInput` | 1 component | ✅ Granular |
| T74: Login and register pages on the shared pieces | 2 pages, same change | ⚠️ Cohesive (one mechanical change) |
| T75: Forgot and reset password pages on the shared pieces | 2 pages, same change | ⚠️ Cohesive (one mechanical change) |
| T76: `PlanNameDialog` | 1 component | ✅ Granular |
| T77: `InvitePlanDialog` on `FormField` | 1 component | ✅ Granular |
| T78: `usePlanPermissions` | 1 hook + call sites | ✅ Granular |
| T79: `--warning` token and the palette ban | 1 token pair + 1 fragment | ✅ Granular |
| T80: `useTransactionFormSubmit` | 1 hook | ✅ Granular |
| T81: `ItemsField` on `useFieldArray` | 1 component | ✅ Granular |
| T82: Participants on `useFieldArray` | 1 component | ✅ Granular |
| T83: `EndDateField` | 1 component | ✅ Granular |
| T84: Last-installment helper and `InstallmentsField` | 1 component + 1 helper | ✅ Granular |
| T85: `TransactionFormDrawer` assembly | 1 component | ✅ Granular |
| T86: `useCategoryFormSubmit` | 1 hook | ✅ Granular |
| T87: Member limits on `useFieldArray` | 1 component | ✅ Granular |
| T88: `CategoryFormSheet` assembly | 1 component | ✅ Granular |
| T89: `typographyVariants`, `Heading`, `Text` | 1 scale + 2 components | ✅ Granular |
| T90: `PageHeader` | 1 component | ✅ Granular |
| T91: `SectionHeader` on the scale | 1 component | ✅ Granular |
| T92: Typography: app, auth, 404, plans | call-site migration | ⚠️ Cohesive (one mechanical change) |
| T93: Typography: overview | call-site migration | ⚠️ Cohesive (one mechanical change) |
| T94: Typography: transactions and categories | call-site migration | ⚠️ Cohesive (one mechanical change) |
| T95: Typography: shared compositions | call-site migration | ⚠️ Cohesive (one mechanical change) |
| T96: Typography lint | 2 fragments | ✅ Granular |
| T97: Function declarations: `src/components`, `src/hooks`, `src/lib`, `src/utils` | mechanical conversion | ⚠️ Cohesive (one mechanical change) |
| T98: Function declarations: `src/api`, `src/app`, `src/test` | mechanical conversion | ⚠️ Cohesive (one mechanical change) |
| T99: Function declarations: `features/overview` and `features/categories` | mechanical conversion | ⚠️ Cohesive (one mechanical change) |
| T100: Function declarations: `features/transactions` | mechanical conversion | ⚠️ Cohesive (one mechanical change) |
| T101: Function declarations: `features/plans`, `features/auth`, `features/notFound`, config and scripts | mechanical conversion | ⚠️ Cohesive (one mechanical change) |
| T102: `func-style` rule | 1 rule | ✅ Granular |
| T103: Comments explain why, without spec IDs | comment pass | ⚠️ Cohesive (one mechanical change) |
| T104: `check-siblings.ts`: story report | 1 script | ✅ Granular |
| T105: Stories: `src/components` primitives (`base/`) | area stories | ⚠️ Cohesive (one mechanical change) |
| T106: Stories: `src/components` compositions | area stories | ⚠️ Cohesive (one mechanical change) |
| T107: Stories: `features/overview` | area stories | ⚠️ Cohesive (one mechanical change) |
| T108: Stories: `features/transactions` | area stories | ⚠️ Cohesive (one mechanical change) |
| T109: Stories: `features/categories` | area stories | ⚠️ Cohesive (one mechanical change) |
| T110: Stories: `features/plans`, `features/auth`, `features/notFound`, `src/app` | area stories | ⚠️ Cohesive (one mechanical change) |
| T111: Story gate in `pnpm test` | 1 script line | ✅ Granular |
| T112: `check-siblings.ts`: test report | 1 script extension | ✅ Granular |
| T113: Tests for the logic modules the report lists | missing tests | ⚠️ Cohesive (one mechanical change) |
| T114: Coverage scope and threshold | 1 config | ✅ Granular |
| T115: Close the branch gaps | missing cases | ⚠️ Cohesive (one mechanical change) |
| T116: Full gate in `pnpm test` | 1 script line | ✅ Granular |
| T117: `toPagination` | 1 function | ✅ Granular |
| T118: `transactionSort.ts` | 1 module | ✅ Granular |
| T119: `useTransactionSearch` | 1 hook | ✅ Granular |
| T120: Inline-save mapper | 1 function | ✅ Granular |
| T121: `useTransactionActions` | 1 hook | ✅ Granular |
| T122: `useCsvImport` | 1 hook | ✅ Granular |
| T123: `TransactionsTab` composes the hooks | 1 component | ✅ Granular |
| T124: `local/no-jsx-iife` | 1 rule | ✅ Granular |
| T125: `local/component-logic-cap` | 1 rule | ✅ Granular |

### Diagram-Definition Cross-Check

| Task | Depends On (task body) | Diagram Shows | Status |
| ---- | ---------------------- | ------------- | ------ |
| T1 | None | - | ✅ Match |
| T2 | T1 | T1 → T2 | ✅ Match |
| T3 | T1 | T1 → T3 | ✅ Match |
| T4 | T1 | T1 → T4 | ✅ Match |
| T5 | T1 | T1 → T5 | ✅ Match |
| T6 | T1, T2, T3, T4, T5 | T1 → T6, T2 → T6, T3 → T6, T4 → T6, T5 → T6 | ✅ Match |
| T7 | T6 | T6 → T7 | ✅ Match |
| T8 | T6 | T6 → T8 | ✅ Match |
| T9 | T5 | T5 → T9 | ✅ Match |
| T10 | None | - | ✅ Match |
| T11 | T10 | T10 → T11 | ✅ Match |
| T12 | None | - | ✅ Match |
| T13 | None | - | ✅ Match |
| T14 | None | - | ✅ Match |
| T15 | None | - | ✅ Match |
| T16 | None | - | ✅ Match |
| T17 | None | - | ✅ Match |
| T18 | None | - | ✅ Match |
| T19 | None | - | ✅ Match |
| T20 | None | - | ✅ Match |
| T21 | None | - | ✅ Match |
| T22 | None | - | ✅ Match |
| T23 | T22 | T22 → T23 | ✅ Match |
| T24 | T23 | T23 → T24 | ✅ Match |
| T25 | None | - | ✅ Match |
| T26 | None | - | ✅ Match |
| T27 | None | - | ✅ Match |
| T28 | None | - | ✅ Match |
| T29 | T22, T23, T24, T25, T26, T27, T28 | T22 → T29, T23 → T29, T24 → T29, T25 → T29, T26 → T29, T27 → T29, T28 → T29 | ✅ Match |
| T30 | None | - | ✅ Match |
| T31 | T30 | T30 → T31 | ✅ Match |
| T32 | None | - | ✅ Match |
| T33 | T32 | T32 → T33 | ✅ Match |
| T34 | None | - | ✅ Match |
| T35 | T34 | T34 → T35 | ✅ Match |
| T36 | T35 | T35 → T36 | ✅ Match |
| T37 | T35 | T35 → T37 | ✅ Match |
| T38 | T35 | T35 → T38 | ✅ Match |
| T39 | T34 | T34 → T39 | ✅ Match |
| T40 | T36, T37, T38 | T36 → T40, T37 → T40, T38 → T40 | ✅ Match |
| T41 | None | - | ✅ Match |
| T42 | T41 | T41 → T42 | ✅ Match |
| T43 | None | - | ✅ Match |
| T44 | T43 | T43 → T44 | ✅ Match |
| T45 | T43 | T43 → T45 | ✅ Match |
| T46 | T44, T45 | T44 → T46, T45 → T46 | ✅ Match |
| T47 | T46 | T46 → T47 | ✅ Match |
| T48 | None | - | ✅ Match |
| T49 | T48 | T48 → T49 | ✅ Match |
| T50 | T48 | T48 → T50 | ✅ Match |
| T51 | T49, T50 | T49 → T51, T50 → T51 | ✅ Match |
| T52 | None | - | ✅ Match |
| T53 | None | - | ✅ Match |
| T54 | T53 | T53 → T54 | ✅ Match |
| T55 | T51, T52, T54 | T51 → T55, T52 → T55, T54 → T55 | ✅ Match |
| T56 | None | - | ✅ Match |
| T57 | T56 | T56 → T57 | ✅ Match |
| T58 | None | - | ✅ Match |
| T59 | T56 | T56 → T59 | ✅ Match |
| T60 | T59 | T59 → T60 | ✅ Match |
| T61 | T58, T59 | T58 → T61, T59 → T61 | ✅ Match |
| T62 | T61 | T61 → T62 | ✅ Match |
| T63 | T13 | - (earlier phase: T13) | ✅ Match |
| T64 | T63 | T63 → T64 | ✅ Match |
| T65 | T63 | T63 → T65 | ✅ Match |
| T66 | T63 | T63 → T66 | ✅ Match |
| T67 | T63 | T63 → T67 | ✅ Match |
| T68 | None | - | ✅ Match |
| T69 | T57 | - (earlier phase: T57) | ✅ Match |
| T70 | None | - | ✅ Match |
| T71 | T70 | T70 → T71 | ✅ Match |
| T72 | None | - | ✅ Match |
| T73 | None | - | ✅ Match |
| T74 | T58, T72, T73 | T72 → T74, T73 → T74 (earlier phase: T58) | ✅ Match |
| T75 | T74 | T74 → T75 | ✅ Match |
| T76 | T58 | - (earlier phase: T58) | ✅ Match |
| T77 | T58 | - (earlier phase: T58) | ✅ Match |
| T78 | None | - | ✅ Match |
| T79 | T55 | - (earlier phase: T55) | ✅ Match |
| T80 | None | - | ✅ Match |
| T81 | None | - | ✅ Match |
| T82 | None | - | ✅ Match |
| T83 | None | - | ✅ Match |
| T84 | None | - | ✅ Match |
| T85 | T80, T81, T82, T83, T84 | T80 → T85, T81 → T85, T82 → T85, T83 → T85, T84 → T85 | ✅ Match |
| T86 | None | - | ✅ Match |
| T87 | None | - | ✅ Match |
| T88 | T86, T87 | T86 → T88, T87 → T88 | ✅ Match |
| T89 | None | - | ✅ Match |
| T90 | T89 | T89 → T90 | ✅ Match |
| T91 | T89 | T89 → T91 | ✅ Match |
| T92 | T90, T91 | T90 → T92, T91 → T92 | ✅ Match |
| T93 | T89 | T89 → T93 | ✅ Match |
| T94 | T89 | T89 → T94 | ✅ Match |
| T95 | T89 | T89 → T95 | ✅ Match |
| T96 | T92, T93, T94, T95 | T92 → T96, T93 → T96, T94 → T96, T95 → T96 | ✅ Match |
| T97 | None | - | ✅ Match |
| T98 | None | - | ✅ Match |
| T99 | None | - | ✅ Match |
| T100 | None | - | ✅ Match |
| T101 | None | - | ✅ Match |
| T102 | T97, T98, T99, T100, T101 | T97 → T102, T98 → T102, T99 → T102, T100 → T102, T101 → T102 | ✅ Match |
| T103 | None | - | ✅ Match |
| T104 | None | - | ✅ Match |
| T105 | T104 | T104 → T105 | ✅ Match |
| T106 | T104 | T104 → T106 | ✅ Match |
| T107 | T104 | T104 → T107 | ✅ Match |
| T108 | T104 | T104 → T108 | ✅ Match |
| T109 | T104 | T104 → T109 | ✅ Match |
| T110 | T104 | T104 → T110 | ✅ Match |
| T111 | T105, T106, T107, T108, T109, T110 | T105 → T111, T106 → T111, T107 → T111, T108 → T111, T109 → T111, T110 → T111 | ✅ Match |
| T112 | T111 | - (earlier phase: T111) | ✅ Match |
| T113 | T112 | T112 → T113 | ✅ Match |
| T114 | T113 | T113 → T114 | ✅ Match |
| T115 | T114 | T114 → T115 | ✅ Match |
| T116 | T115 | T115 → T116 | ✅ Match |
| T117 | None | - | ✅ Match |
| T118 | None | - | ✅ Match |
| T119 | None | - | ✅ Match |
| T120 | None | - | ✅ Match |
| T121 | None | - | ✅ Match |
| T122 | None | - | ✅ Match |
| T123 | T117, T118, T119, T120, T121, T122 | T117 → T123, T118 → T123, T119 → T123, T120 → T123, T121 → T123, T122 → T123 | ✅ Match |
| T124 | T123 | T123 → T124 | ✅ Match |
| T125 | T124 | T124 → T125 | ✅ Match |

### Test Co-location Validation

| Task | Code Layer Created/Modified | Matrix Requires | Task Says | Status |
| ---- | --------------------------- | --------------- | --------- | ------ |
| T1: Rewrite the `component-creation` skill | Skills/docs | none | none | ✅ OK |
| T2: Rewrite the `feature-structure` skill | Skills/docs | none | none | ✅ OK |
| T3: Rewrite the `form-creation` skill | Skills/docs | none | none | ✅ OK |
| T4: Rewrite the `api-integration` skill | Skills/docs | none | none | ✅ OK |
| T5: Create the `frontend-testing` skill | Skills/docs | none | none | ✅ OK |
| T6: Rewrite the `CLAUDE.md` Frontend section | Skills/docs | none | none | ✅ OK |
| T7: Update `CONVENTIONS.md` | Skills/docs | none | none | ✅ OK |
| T8: Update `STRUCTURE.md` | Skills/docs | none | none | ✅ OK |
| T9: Update `TESTING.md` | Skills/docs | none | none | ✅ OK |
| T10: ESLint foundation with a config test | Tooling | tooling | tooling | ✅ OK |
| T11: `type` everywhere | Tooling | tooling | tooling | ✅ OK |
| T12: Storybook configuration fixes | Presentational component (stories) | story | story | ✅ OK |
| T13: `components.json` points at the real paths | Config | none | none | ✅ OK |
| T14: Split `AuthProvider` | Logic module / hook | unit | unit | ✅ OK |
| T15: Split `PlanProvider` | Logic module / hook | unit | unit | ✅ OK |
| T16: Split `ThemeProvider` | Logic module / hook | unit | unit | ✅ OK |
| T17: Move the query client out of `TanStackQueryProvider` | Constant module | none | none | ✅ OK |
| T18: Split `ConfirmDialog` (`useConfirmDialog.tsx`) | Logic module / hook | unit | unit | ✅ OK |
| T19: Split `SeriesScopeDialog` | Logic module / hook | unit | unit | ✅ OK |
| T20: Split the `CategoryFormSheet` provider | Logic module / hook | unit | unit | ✅ OK |
| T21: Split the `Table` context | Logic module / hook | unit | unit | ✅ OK |
| T22: Extract the transaction form's schema and mappers | Logic module / hook | unit | unit | ✅ OK |
| T23: Extract the category form's helpers, schema and mappers | Logic module / hook | unit | unit | ✅ OK |
| T24: Extract `DeleteCategoryDialog` helpers | Logic module / hook | unit | unit | ✅ OK |
| T25: Split `transactionColumns.tsx` | Logic module / hook | unit | unit | ✅ OK |
| T26: Move the single non-component exports of four feature files | Logic module / hook | unit | unit | ✅ OK |
| T27: Move primitive variant exports | Presentational component | story | story | ✅ OK |
| T28: Type the table without `any` | Logic module / hook | unit | unit | ✅ OK |
| T29: Lint green: `only-export-components` as error | Tooling | tooling | tooling | ✅ OK |
| T30: `pre-commit` hook runs lint-staged | CI/hooks | none | none | ✅ OK |
| T31: `commit-msg` hook runs `check_commit.py` | CI/hooks | none | none | ✅ OK |
| T32: `ci.yml` with frontend and backend jobs | CI/hooks | none | none | ✅ OK |
| T33: `changes` and `deploy` jobs; remove `deploy.yml` | CI/hooks | none | none | ✅ OK |
| T34: MSW server and the unhandled-request recorder | Logic module / hook | unit | unit | ✅ OK |
| T35: `renderWithProviders`; auth handlers; `useAuthService` through MSW | Service hooks / API client | unit | unit | ✅ OK |
| T36: Dashboard handlers; `useDashboardService` through MSW | Service hooks / API client | unit | unit | ✅ OK |
| T37: Category handlers; category service through MSW | Service hooks / API client | unit | unit | ✅ OK |
| T38: Plan handlers; `usePlanService` through MSW | Service hooks / API client | unit | unit | ✅ OK |
| T39: `findracoApi` tests through MSW, including session refresh | Service hooks / API client | unit | unit | ✅ OK |
| T40: Lint: test support only from tests | Tooling | tooling | tooling | ✅ OK |
| T41: Storybook in `pnpm test`, a11y in error mode | Presentational component (stories) | story | story | ✅ OK |
| T42: CI installs the Playwright browser | CI/hooks | none | none | ✅ OK |
| T43: `useSearchParamGroup` | Logic module / hook | unit | unit | ✅ OK |
| T44: Overview filters own their params | Logic module / hook | unit | unit | ✅ OK |
| T45: Transactions filters own their params | Logic module / hook | unit | unit | ✅ OK |
| T46: `app/home`: page, tab and plan params | Logic module / hook | unit | unit | ✅ OK |
| T47: `HomeFiltersGate` and `filterStorage` move to `app/home` | Flow (integration) | integration | integration | ✅ OK |
| T48: Lift shared pieces to the root | Move/rename | none | none | ✅ OK |
| T49: `features/overview` | Move/rename | none | none | ✅ OK |
| T50: `features/transactions` | Move/rename | none | none | ✅ OK |
| T51: `features/categories`; `features/home` removed | Move/rename | none | none | ✅ OK |
| T52: `features/auth` | Move/rename | none | none | ✅ OK |
| T53: `app/layout` | Move/rename | none | none | ✅ OK |
| T54: `base/` marker for primitives | Move/rename | none | none | ✅ OK |
| T55: Layered import restrictions | Tooling | tooling | tooling | ✅ OK |
| T56: `money.ts` | Logic module / hook | unit | unit | ✅ OK |
| T57: Every display goes through `formatMoney` | Logic module / hook | unit | unit | ✅ OK |
| T58: `FormField` | Presentational component | story | story | ✅ OK |
| T59: `CurrencyInput` | Presentational component + logic module | unit + story | unit + story | ✅ OK |
| T60: `CurrencyInput` in the filter and inline edit | Logic module / hook | unit | unit | ✅ OK |
| T61: Transaction form money fields are numeric | Flow (integration) | integration | integration | ✅ OK |
| T62: Category form limits are numeric; `maskCurrency` removed | Flow (integration) | integration | integration | ✅ OK |
| T63: `ToggleGroup` primitive with `tone` and `chip` | Presentational component | story | story | ✅ OK |
| T64: `TransactionTypeToggle` on `ToggleGroup` | Presentational component | story | story | ✅ OK |
| T65: Transaction form toggles on `ToggleGroup` | Flow (integration) | integration | integration | ✅ OK |
| T66: Category limit mode on `ToggleGroup` | Flow (integration) | integration | integration | ✅ OK |
| T67: `MemberFilterChips` on the `chip` variant | Presentational component | story | story | ✅ OK |
| T68: `NumberField` for installments | Presentational component | story | story | ✅ OK |
| T69: `Amount` | Presentational component | story | story | ✅ OK |
| T70: `FormSheet`; `CategoryFormSheet` on it | Presentational component | story | story | ✅ OK |
| T71: `TransactionFormDrawer` on `FormSheet` | Flow (integration) | integration | integration | ✅ OK |
| T72: `AuthCard` | Presentational component | story | story | ✅ OK |
| T73: `PasswordInput` | Presentational component | story | story | ✅ OK |
| T74: Login and register pages on the shared pieces | Flow (integration) | integration | integration | ✅ OK |
| T75: Forgot and reset password pages on the shared pieces | Flow (integration) | integration | integration | ✅ OK |
| T76: `PlanNameDialog` | Flow (integration) | integration | integration | ✅ OK |
| T77: `InvitePlanDialog` on `FormField` | Flow (integration) | integration | integration | ✅ OK |
| T78: `usePlanPermissions` | Logic module / hook | unit | unit | ✅ OK |
| T79: `--warning` token and the palette ban | Tooling | tooling | tooling | ✅ OK |
| T80: `useTransactionFormSubmit` | Logic module / hook | unit | unit | ✅ OK |
| T81: `ItemsField` on `useFieldArray` | Presentational component | story | story | ✅ OK |
| T82: Participants on `useFieldArray` | Presentational component | story | story | ✅ OK |
| T83: `EndDateField` | Presentational component | story | story | ✅ OK |
| T84: Last-installment helper and `InstallmentsField` | Presentational component + logic module | unit + story | unit + story | ✅ OK |
| T85: `TransactionFormDrawer` assembly | Flow (integration) | integration | integration | ✅ OK |
| T86: `useCategoryFormSubmit` | Logic module / hook | unit | unit | ✅ OK |
| T87: Member limits on `useFieldArray` | Presentational component | story | story | ✅ OK |
| T88: `CategoryFormSheet` assembly | Flow (integration) | integration | integration | ✅ OK |
| T89: `typographyVariants`, `Heading`, `Text` | Presentational component | story | story | ✅ OK |
| T90: `PageHeader` | Presentational component | story | story | ✅ OK |
| T91: `SectionHeader` on the scale | Presentational component | story | story | ✅ OK |
| T92: Typography: app, auth, 404, plans | Move/rename | none | none | ✅ OK |
| T93: Typography: overview | Move/rename | none | none | ✅ OK |
| T94: Typography: transactions and categories | Move/rename | none | none | ✅ OK |
| T95: Typography: shared compositions | Move/rename | none | none | ✅ OK |
| T96: Typography lint | Tooling | tooling | tooling | ✅ OK |
| T97: Function declarations: `src/components`, `src/hooks`, `src/lib`, `src/utils` | Move/rename | none | none | ✅ OK |
| T98: Function declarations: `src/api`, `src/app`, `src/test` | Move/rename | none | none | ✅ OK |
| T99: Function declarations: `features/overview` and `features/categories` | Move/rename | none | none | ✅ OK |
| T100: Function declarations: `features/transactions` | Move/rename | none | none | ✅ OK |
| T101: Function declarations: `features/plans`, `features/auth`, `features/notFound`, config and scripts | Move/rename | none | none | ✅ OK |
| T102: `func-style` rule | Tooling | tooling | tooling | ✅ OK |
| T103: Comments explain why, without spec IDs | Move/rename | none | none | ✅ OK |
| T104: `check-siblings.ts`: story report | Tooling | tooling | tooling | ✅ OK |
| T105: Stories: `src/components` primitives (`base/`) | Presentational component | story | story | ✅ OK |
| T106: Stories: `src/components` compositions | Presentational component | story | story | ✅ OK |
| T107: Stories: `features/overview` | Presentational component | story | story | ✅ OK |
| T108: Stories: `features/transactions` | Presentational component | story | story | ✅ OK |
| T109: Stories: `features/categories` | Presentational component | story | story | ✅ OK |
| T110: Stories: `features/plans`, `features/auth`, `features/notFound`, `src/app` | Presentational component | story | story | ✅ OK |
| T111: Story gate in `pnpm test` | Tooling | tooling | tooling | ✅ OK |
| T112: `check-siblings.ts`: test report | Tooling | tooling | tooling | ✅ OK |
| T113: Tests for the logic modules the report lists | Logic module / hook | unit | unit | ✅ OK |
| T114: Coverage scope and threshold | Tooling | tooling | tooling | ✅ OK |
| T115: Close the branch gaps | Logic module / hook | unit | unit | ✅ OK |
| T116: Full gate in `pnpm test` | Tooling | tooling | tooling | ✅ OK |
| T117: `toPagination` | Logic module / hook | unit | unit | ✅ OK |
| T118: `transactionSort.ts` | Logic module / hook | unit | unit | ✅ OK |
| T119: `useTransactionSearch` | Logic module / hook | unit | unit | ✅ OK |
| T120: Inline-save mapper | Logic module / hook | unit | unit | ✅ OK |
| T121: `useTransactionActions` | Logic module / hook | unit | unit | ✅ OK |
| T122: `useCsvImport` | Logic module / hook | unit | unit | ✅ OK |
| T123: `TransactionsTab` composes the hooks | Flow (integration) | integration | integration | ✅ OK |
| T124: `local/no-jsx-iife` | Tooling | tooling | tooling | ✅ OK |
| T125: `local/component-logic-cap` | Tooling | tooling | tooling | ✅ OK |

