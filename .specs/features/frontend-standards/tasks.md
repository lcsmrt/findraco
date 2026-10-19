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
T109 → T126
T104 → T110
T126 → T110
T126 → T127
T126 → T128
T126 → T129
T126 → T130
T126 → T131
T105 → T111
T106 → T111
T107 → T111
T108 → T111
T109 → T111
T110 → T111
T127 → T111
T128 → T111
T129 → T111
T130 → T111
T131 → T111
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

- [x] Tree matches decision 1's layers and decision 4's destinations
- [x] Docs gate: every item above checked against `context.md` and `design.md`

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

- [x] Commands match the Gate Check Commands of this file
- [x] Docs gate: every item above checked against `context.md` and `design.md`

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

- [x] Config test: `noInlineConfig` and `ban-ts-comment` active for a `src/**/*.tsx` path
- [x] Config test: a violation preceded by `// eslint-disable-next-line` is still reported (AC 9); `// @ts-ignore` is reported (AC 3)
- [x] The four plugins are gone from `package.json` and the lockfile
- [x] Lint error count ≤ 66
- [x] Quick gate passes
- [x] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: tooling
**Gate**: build
**Commit**: `build(frontend): eslint foundation with noInlineConfig, ban-ts-comment and a config test`

---

### T11: `type` everywhere

**What**: Enable `@typescript-eslint/consistent-type-definitions: ["error", "type"]` and apply its autofix to the ~20 files with `interface`. The one library augmentation (`declare module "axios"` adding `sessionRetried` in `findracoApi.ts`, which only an `interface` can merge) moves to `src/api/clients/axios.d.ts`; the rule is off for `**/*.d.ts` for everyone (E1 addendum, 2026-10-17). Partial work from the first attempt: scratchpad `t11-partial.patch`.
**Where**: `frontend/eslint.config.js`
**Depends on**: T10
**Reuses**: -
**Requirement**: STD-02 (AC 4)

**Tools**: MCP: NONE · Skill: `frontend-testing`

**Done when**:

- [x] `grep -rn "^\s*\(export \)\?interface " src --include=*.ts --include=*.tsx | grep -v '\.d\.ts:'` returns nothing
- [x] Config test asserts the rule is on for `src/**/*.ts(x)` and off for `src/**/*.d.ts`
- [x] Lint error count not higher than after T10
- [x] Quick gate passes
- [x] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

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

- [x] 0 `storybook/no-renderer-packages` and 0 `storybook/no-uninstalled-addons` errors
- [x] Existing stories still pass in the `storybook` project (16 files, 42 tests, after installing Chromium build 1234 locally)
- [x] Full gate passes

**Tests**: story
**Gate**: full
**Commit**: `build(frontend): storybook stories use react-vite types; drop core addon`

Follow-up: the direct `@storybook/react` devDependency is removed; nothing imports it since the stories moved to `@storybook/react-vite`, which keeps it as its own dependency.

---

### T13: `components.json` points at the real paths

**What**: Set `utils` → `@/lib/mergeClasses`, `css` → `src/index.css`, `ui` → `@/components` (C8).
**Where**: `frontend/components.json`
**Depends on**: None
**Reuses**: -
**Requirement**: STD-02 (AC 8)

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [x] The three aliases match; the CLI install in T63 confirms it
- [x] Build gate passes

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

- [x] The Provider file exports only the component; `react-refresh/only-export-components` clean for it
- [x] Hook test: throws outside the provider, returns the value inside
- [x] Quick gate passes
- [x] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

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

- [x] The Provider file exports only the component; `react-refresh/only-export-components` clean for it
- [x] Hook test: throws outside the provider, returns the value inside
- [x] Quick gate passes
- [x] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

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

- [x] The Provider file exports only the component; `react-refresh/only-export-components` clean for it
- [x] Hook test: throws outside the provider, returns the value inside
- [x] Quick gate passes
- [x] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

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

- [x] Provider file exports only the component
- [x] Quick gate passes
- [x] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

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

- [x] The Provider file exports only the component; `react-refresh/only-export-components` clean for it
- [x] Hook test: throws outside the provider, returns the value inside
- [x] Quick gate passes
- [x] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

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

- [x] The Provider file exports only the component; `react-refresh/only-export-components` clean for it
- [x] Hook test: throws outside the provider, returns the value inside
- [x] Quick gate passes
- [x] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

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

- [x] The Provider file exports only the component; `react-refresh/only-export-components` clean for it
- [x] Hook test: throws outside the provider, returns the value inside
- [x] Quick gate passes
- [x] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

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

- [x] The Provider file exports only the component; `react-refresh/only-export-components` clean for it
- [x] Hook test: throws outside the provider, returns the value inside
- [x] Quick gate passes
- [x] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: unit
**Gate**: quick
**Commit**: `refactor(frontend): split the `Table` context into provider and hook`

Follow-up: the T18/T19 hook modules are renamed after their hooks (`useConfirm.ts`, `useSeriesScope.ts`, tests with them), per the provider pattern `useXxx.ts` → `useXxx`.

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

- [x] `TransactionFormDrawer.tsx` exports only components
- [x] Moved tests pass unchanged except imports
- [x] Quick gate passes
- [x] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

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

- [x] `CategoryFormSheet.tsx` exports only components
- [x] Quick gate passes
- [x] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

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

- [x] The component file exports only components
- [x] Quick gate passes
- [x] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

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

- [x] No `only-export-components` error in either file
- [x] Logic moved to `.ts` has a sibling test
- [x] Quick gate passes
- [x] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

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

- [x] 0 `only-export-components` errors in the four files
- [x] Quick gate passes
- [x] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

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

- [x] `Button.tsx`, `Badge.tsx`, `Combobox.tsx` export only components
- [x] Full gate passes

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

- [x] 0 `no-explicit-any` and `prefer-const` errors
- [x] `cols.test.ts` covers every branch
- [x] Quick gate passes
- [x] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Follow-up (2026-10-18, after T111)**: `refactor(frontend): remove forced type casts`. Lint cannot catch every forced `as`, so the remaining ones in `src` (non-test) went: `Sorting.by` is the column id (`string`), not `keyof TData`, which `TableHeader` and `TransactionsTab` had forced; Select views read labels through Base UI `items` and narrow `null` instead of casting (`TransactionFilterPopoverView`, `PlanMembersListView`); `RadioGroup` is generic, so `SeriesScopeDialog` gets its value type; CSS custom properties use the `StyleWithVariables` type (`ToasterView`, `Chart`); `Chart` iterates typed themes and reads payload fields through a `typeof` guard; `InputGroup` narrows with `instanceof Element`; `clearSessionStorage` iterates `Object.values`; the auth pages read the return location through `readReturnLocation` (tested). Only the `type Table as TanstackTable` import alias remains, which is not a cast.

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

- [x] `pnpm lint` exits 0
- [x] Config test asserts the rule at `error`
- [x] Build gate passes
- [x] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

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

- [x] Staging a file with a lint error blocks the commit (checked, then reverted)
- [x] A clean staged file commits
- [x] Build gate passes

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

- [x] A commit with message "stuff" is rejected locally
- [x] A Conventional Commit passes
- [x] Build gate passes

**Tests**: none
**Gate**: build
**Commit**: `build: commit-msg hook enforces conventional commits`

---

### T32: `ci.yml` with frontend and backend jobs

**What**: Create `.github/workflows/ci.yml` on `push` (all branches) and `workflow_dispatch`: `frontend` (pnpm via corepack, frozen install, `pnpm lint`, `pnpm build`, `pnpm test`) and `backend` (Temurin 17, `./mvnw test`). `FindracoApplicationTests` extends `AbstractIntegrationTest` and needs the database, so it is renamed `FindracoApplicationIT` (the project's `*IT` convention; failsafe runs it with `verify`).
**Where**: `.github/workflows/ci.yml`
**Depends on**: None
**Reuses**: -
**Requirement**: STD-03 (AC 1)

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [x] YAML parses (`python3 -c 'import yaml,sys; yaml.safe_load(open(sys.argv[1]))'`)
- [x] Commands match the local Build gate
- [x] First push: both jobs green (run 39140226172, 2026-10-18: after fixing setup-node's cache in 5e1f94d, all four jobs green; Portainer redeployed)

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

- [x] The `changes` script, run locally against crafted ranges, prints false for docs-only and true for mixed, first-push and force-push cases
- [x] Head guard exits 0 without deploying when the SHA is not the tip
- [x] YAML parses
- [x] First push to `main`: CI green, then deploy runs (run 39140226172, 2026-10-18: after fixing setup-node's cache in 5e1f94d, all four jobs green; Portainer redeployed)

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

- [x] `unhandledRequests.test.ts`: records, throws naming the URL, resets
- [x] Existing unit tests pass with the setup active
- [x] Quick gate passes
- [x] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

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

- [x] No `vi.mock` in the file
- [x] Each service function: request method, URL, params/body and response mapping asserted
- [x] Quick gate passes
- [x] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

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

- [x] No `vi.mock`
- [x] Quick gate passes
- [x] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

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

- [x] No `vi.mock`
- [x] Quick gate passes
- [x] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

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

- [x] No `vi.mock`
- [x] Quick gate passes
- [x] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

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

- [x] No custom adapter
- [x] 401 → refresh → retry test passes through MSW
- [x] Same scenario list as before
- [x] Quick gate passes
- [x] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

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

- [x] Config test: the fragment is active for `src/features/x/Foo.tsx` and absent for `Foo.test.tsx`
- [x] `pnpm lint` exits 0
- [x] Build gate passes

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

- [x] `pnpm test` runs `unit`, `tooling` and `storybook`
- [x] Breaking an `aria` attribute in a story fails `pnpm test` (checked, then reverted)
- [x] Full gate passes
- [x] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

Follow-up (after T69): the Storybook project failed its first run after a new Base UI import. Its dependency cache (`node_modules/.cache/storybook/<hash>/sb-vitest`) is reused until the lockfile changes, so a Base UI subpath imported for the first time was discovered mid-run; Vite re-optimised and reloaded, and the story loading at that moment failed (reproduced with a scratch story importing `@base-ui/react/tabs`). The storybook project now lists every public Base UI entry point, read from the package's `exports`, in `optimizeDeps.include`. With the scratch story on a warm cache the run passes with no reload; two cold runs (cache cleared) pass, 24 files / 78 tests. No retries.

Follow-up (after T96): the combined `pnpm exec vitest run` timed out at random (5000 ms user-event tests and 15000 ms stories, different ones each run, plus `findBy` misses after the 1000 ms default) while every file passed alone. Cause: CPU oversubscription. Vitest sizes the fork pool (`unit`, `tooling`) and the browser pool (`storybook`) independently, each at `availableParallelism() - 1` (19 on this 20-core machine), so up to 38 workers plus Chromium renderers and the Vite server ran at once; load average reached 20 to 33. Reproduced in 3 of 5 default runs (1 to 5 failing files, wall 46 to 71 s). Fix: `maxWorkers: "25%"` at the root, which sizes both pools, so the whole run stays under one busy process per core; on a 4-core CI runner that is 1 fork and 1 page instead of 3 and 3. A first version gave the `storybook` project its own `maxWorkers`; it worked at runtime but Vitest types the option as root-only, so `pnpm build` (`tsc -b` over `vite.config.ts`) failed, and the caps were unified. No timeout or retry changed. After: 3 combined runs in a row green, 104 files / 844 tests, wall 24 s each (before: 46 to 71 s), load average 4 to 7. Quick gate 19 s (before: 17 s).

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

- [x] YAML parses
- [x] Next push: the frontend job runs both projects (user go-ahead) — verified: run 39141736690 (2026-10-18), storybook in CI, all jobs green, deployed

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

- [x] Test: parse, update with replace, clear subset, untouched foreign keys
- [x] Quick gate passes
- [x] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

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

- [x] Overview consumers use the new hook
- [x] Moved tests pass
- [x] Quick gate passes
- [x] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

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

- [x] Transactions consumers use the new hook
- [x] Quick gate passes
- [x] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

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

- [x] Test: tab switch pushes, plan param read
- [x] Routes behave as before
- [x] Quick gate passes
- [x] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

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

- [x] No `vi.mock` in the gate test
- [x] `src/lib/` holds only `mergeClasses` and `storage`
- [x] Quick gate passes
- [x] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

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

- [x] No feature imports them from another feature
- [x] Quick gate passes
- [x] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: none
**Gate**: build
**Commit**: `refactor(frontend): lift MemberDot, memberColors and TransactionTypeToggle to the root`

Follow-up: `useMemberColors` reads the API and the plan context, so by C9 it is not a pure function; it moved to `src/hooks/useMemberColors.ts`. The colour functions and `MemberColorOf` stay in `src/utils/memberColors.ts` with their test (the hook had no test cases to move). Commit `refactor(frontend): move useMemberColors to src/hooks`.

---

### T49: `features/overview`

**What**: Move the overview components, helpers (+ tests), `useOverviewMemberFilter` and `PeriodNavigator` with `periodNavigator` utils (overview is its only consumer) into `features/overview/`, placing each module next to its single consumer (C2).
**Where**: `frontend/src/features/overview/OverviewTab.tsx`
**Depends on**: T48
**Reuses**: -
**Requirement**: STD-05 (AC 1, 4)

**Tools**: MCP: NONE · Skill: `feature-structure`, `component-creation`

**Done when**:

- [x] Overview renders as before
- [x] Build gate passes
- [x] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

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

- [x] Transactions tab behaves as before
- [x] Build gate passes
- [x] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

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

- [x] `src/features/home` does not exist
- [x] Build gate passes
- [x] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

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

- [x] No `login`, `registerUser`, `forgotPassword`, `resetPassword` folders
- [x] Build gate passes
- [x] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

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

- [x] `src/components/layout` and `navbar` do not exist
- [x] Build gate passes
- [x] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

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

- [x] Each family's primitives sit in `base/`; compositions stay at the family root
- [x] Full gate passes
- [x] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

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

- [x] Config test: each layer path has every expected fragment
- [x] `import … from "@/features/plans/…"` inside `features/overview` fails lint (checked, reverted)
- [x] `pnpm lint` exits 0
- [x] Build gate passes

**Tests**: tooling
**Gate**: build
**Commit**: `build(frontend): layered import restrictions with config tests`

Follow-up: `crossFeatureImports` now applies to every layer outside `src/app/**` (C6: only `app/` imports features), so `hooks`, `utils`, `lib`, `api` and `test` reject `@/features/*` too; the `features/**` and `components/**` blocks, now identical to their parent, are gone. Config-test cases added per layer; design decision 1 and `feature-structure` tables updated. Commit `build(frontend): only app may import features`.

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

- [x] Test: format, negative, compact axis values, `toCents` on float-prone values (0.1 + 0.2)
- [x] Quick gate passes
- [x] Test count ≥ before; a test is removed only when it moves with its subject (report the count): unit + tooling 507 → 523

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

- [x] `grep -rn "Intl.NumberFormat\|formatCurrency\|toLocaleString" src` returns only `money.ts`, plus two non-display hits: `maskCurrency`'s `toLocaleString` in `masks.ts` (deleted in T62) and `Calendar`'s month-name date formatting (dates, not money)
- [x] Quick gate passes
- [x] Test count ≥ before; a test is removed only when it moves with its subject (report the count): unit + tooling 523 → 523 (`formatCurrency` had no tests)

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

- [x] Stories: label only, with description, with error, disabled; label is associated with the input
- [x] Full gate passes

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

- [x] `currencyDigits.test.ts`: 1, 12, 123, 1234 → 0.01, 0.12, 1.23, 12.34; non-digits ignored; paste; 15-digit cap; empty → null
- [x] Story `play`: typing 1234 shows R$ 12,34
- [x] The component's own `onChange` wins over a spread `onChange` (decision 5 spreads react-hook-form's `field`): a test spreading a `field` still delivers numbers, never the masked string (`CurrencyInput.test.tsx`; checked against the reversed order, which fails it)
- [x] Full gate passes
- [x] Test count ≥ before; a test is removed only when it moves with its subject (report the count): all projects 570 → 593

Note: `@testing-library/user-event` 14.6.1 added (exact, the version Storybook already bundles) so unit and integration tests type like a user.

Follow-up (`fix(frontend): currency input keeps a typed zero`): `parseCurrencyDigits` mapped all-zero input to `null`, so R$ 0,00 could not be entered, against decision 5 ("limit R$ 0,00" ≠ "no limit"). Now no digit → `null`, any digit including only zeros → its value (typing "0" shows R$ 0,00 and yields 0), and a deletion that leaves only the display's zero padding → `null`, so backspace still empties the field. The component tells a deletion by the input event's `inputType`. Schemas unchanged: the transaction amount still rejects 0 (`transactionForm.test.ts` "rejects a zero amount"); category limits accept 0. Tests: unit + tooling 560 → 567.

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

- [x] `transactionFilterDraft.test.ts` updated to numbers (it had no amount cases; four added)
- [x] No `maskCurrency` in these files
- [x] Quick gate passes
- [x] Test count ≥ before; a test is removed only when it moves with its subject (report the count): unit + tooling 541 → 545

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

- [x] New `TransactionFormDrawer.test.tsx` (`renderWithProviders`, MSW): typing 1234 in Amount submits 12.34; items over the total show the error
- [x] `transactionForm.test.ts` updated to numbers
- [x] Quick gate passes
- [x] Test count ≥ before; a test is removed only when it moves with its subject (report the count): unit + tooling 545 → 556

Notes: Amount binds through `FormField`. Item amounts bind through a raw `Controller` with an `aria-label`, because the item row has no visible labels (the skill's special-layout case); participant shares keep the `setValue` path through `AttributionFields`, because that path marks the participants as edited by hand, which the owned-category default depends on. T81/T82 move both lists to `useFieldArray`. Registering `items.N.amount` makes the resolver file the list-level items error under `errors.items.root`. `financialTransaction.handlers.ts` added (create, update) for the integration test.

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

- [x] New `CategoryFormSheet.test.tsx` (`renderWithProviders`, MSW): typing a limit submits the number; empty limit submits none
- [x] `grep -rn maskCurrency src` returns nothing
- [x] `categoryForm.test.ts` updated
- [x] Quick gate passes
- [x] Test count ≥ before; a test is removed only when it moves with its subject (report the count): unit + tooling 556 → 560; all projects 612

Notes: the plain limit binds through `FormField`; member limits bind through a raw `Controller` (the member's name labels the row). `masks.ts` keeps `maskDate`, so it stays. The integration test waits for the members and categories queries before typing, because the sheet resets its values when they arrive.

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

- [x] Stories per tone, chip, disabled; `play`: arrow keys move focus, selected item has `aria-pressed="true"` (Base UI `Toggle` renders `aria-pressed` itself, plus `data-pressed`)
- [x] Full gate passes: all projects 619 → 629

Notes: installed with `pnpm dlx shadcn@4.21.5 add toggle toggle-group`. With `"style": "new-york"` the CLI resolved the Radix flavour (`radix-ui` dependency), so `components.json` now says `"style": "base-nova"`, the Base UI style whose sizes match the existing `Button`. The registry now emits `import { cn } from "cn"` and adds the `cn` npm package; the dependency was reverted and the imports point at `@/lib/mergeClasses`. Default size raised to `h-9` to match `Button`. The `Success` story failed axe colour contrast (green-600 text on the success/15 fill, 2.5:1), a defect the Credit toggle already had: `--success` (light) moved to green-800, as `--destructive` did before. A single-choice group lets the pressed item be clicked off (value `[]`); compositions ignore the empty value so a segmented control keeps its selection.

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

- [x] Story with keyboard `play`
- [x] Existing form tests pass
- [x] Full gate passes
- [x] Test count ≥ before; a test is removed only when it moves with its subject (report the count): all projects 629 → 632

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

- [x] `TransactionFormDrawer.test.tsx`: choosing a recurrence mode and an attribution option reaches the payload
- [x] Quick gate passes
- [x] Test count ≥ before; a test is removed only when it moves with its subject (report the count): unit + tooling 567 → 571

Notes: the toggles are the recurrence mode and, in `AttributionFields`, "Attributed to" and "Split mode" (the existing Exact test already covered the split mode payload). `financialTransactionHandlers.createSeries` added for the series tests.

Follow-up (production report, after T96): on mobile the "Someone else" option of "Attributed to" spilled over its button borders. Cause in the primitive: the full-width segmented pattern (`w-full flex-nowrap` group, `flex-1` items, used by four toggles) shrinks every item to an equal share of the row, and the size's `min-w-9` replaces flexbox's automatic floor at the content width, so a label wider than its share (89.5 px in a 90.7 px button with 20 px of padding, in the 288 px drawer of a 320 px phone) overflowed. `ToggleGroupItem` now ends its classes with `min-w-fit`: an item is never narrower than its label and the other items give up the space. Story `AttributionFields/MobileSomeoneElse` (mobile viewport, 288 px container) asserts each label fits inside its button's padding; it failed before the fix.

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

- [x] `CategoryFormSheet.test.tsx`: switching the limit mode reaches the payload
- [x] Quick gate passes
- [x] Test count ≥ before; a test is removed only when it moves with its subject (report the count): unit + tooling 571 → 573

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

- [x] Story: none selected, one selected, many members, long names
- [x] Full gate passes
- [x] Test count ≥ before; a test is removed only when it moves with its subject (report the count): all projects 638 → 642

Notes: the `ManyMembers` story (5+ members, the combobox branch) failed axe `button-name`: the combobox trigger had no accessible name. It now has a visually hidden "Filter by member" label.

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

- [x] Story: increment, decrement at min, typing
- [x] No IIFE left in the installment inputs
- [x] Drawer tests pass
- [x] Full gate passes
- [x] Test count ≥ before; a test is removed only when it moves with its subject (report the count): all projects 642 → 647

Notes: the shadcn registry has no number field (404 for the Base UI styles), so `NumberField` composes Base UI's (`Root`, `Group`, `Decrement`, `Input`, `Increment`, whole numbers via `format`). Base UI gives the input role `textbox` with `aria-roledescription`, not `spinbutton`. `parcelsNumber` and `currentParcel` now hold `number | null` instead of digit strings, so the inputs bind through `Controller` without parsing; the schema checks, the series mappers and `buildDefaultValues` read numbers, and `transactionForm.series.test.ts` changed only its value entry ("12" → 12). The last-installment preview stays an IIFE until T84.

**Tests**: story
**Gate**: full
**Commit**: `feat(frontend): NumberField for installment inputs`

---

### T69: `Amount`

**What**: `Amount` (`value`, `type`): debit "- " prefix and destructive tone, credit success tone, monospace (`font-mono`, as today), via `formatMoney`; the mobile list and the table use it.
**Where**: `frontend/src/components/amount/Amount.tsx`
**Depends on**: T57
**Reuses**: -
**Requirement**: STD-06 (AC 7)

**Tools**: MCP: NONE · Skill: `component-creation`, `frontend-testing`

**Done when**:

- [x] Story: debit, credit, zero, large value
- [x] Full gate passes (phase end: build gate, lint 0)
- [x] Test count ≥ before; a test is removed only when it moves with its subject (report the count): all projects 647 → 651

Notes: `Amount` sets no font size (typography lint, T96); the mobile list passes its `text-sm` through `className` until T94.

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

- [x] Story: idle, submitting, with mobile actions, long content scrolling, mobile viewport
- [x] `CategoryFormSheet.test.tsx` passes (Cancel closes, Submit sends)
- [x] Full gate passes
- [x] Test count ≥ before; a test is removed only when it moves with its subject (report the count): all projects 651 → 658

Notes: `FormSheet` needed no per-case props. Submit is a `type="submit"` button tied to the form by `form={id}`, since the footer sits outside the scrolling form; Enter in a field and the button both go through the form's `onSubmit`. `CategoryFormSheet.test.tsx` gained the Cancel and Submit-closes cases (6 → 8).

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

- [x] `TransactionFormDrawer.test.tsx`: Cancel closes, Submit sends, Delete and Duplicate reachable
- [x] Quick gate passes
- [x] Test count ≥ before; a test is removed only when it moves with its subject (report the count): all projects 658 → 662

Notes: one per-case prop was needed: `submitDisabled` on `FormSheet`. A series edit keeps Submit disabled while the series definition loads, as before; dropping it would leave a Submit that silently does nothing (the submit handler returns without a definition). It is documented as "Submit is unavailable while the form waits for data" and has a `SubmitUnavailable` story. The "Loading…" line moved inside the form. `TransactionFormDrawer.test.tsx` gained Cancel, Delete/Duplicate reachable in edit, and none in create (10 → 13).

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

- [x] Story: with title and description, mobile viewport
- [x] Full gate passes

Notes: `AuthCard` takes `title`, `description?`, `children` and `className`; the title is the page's `<h1>` (typography moves to `Heading` in T92). All projects 662 → 666.

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

- [x] Story `play`: toggling shows and hides the value
- [x] Full gate passes

Notes: the toggle is an `InputGroupButton` named "Show password" / "Hide password" by its action; it is disabled with the input. Every other input prop, `ref` included, reaches the input. Stories: toggle (`play`), invalid, disabled. All projects 666 → 669.

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

- [x] Login test: success, invalid credentials, validation errors through the network
- [x] No `register(` in the two pages
- [x] Quick gate passes
- [x] Test count ≥ before; a test is removed only when it moves with its subject (report the count): unit + tooling 578 → 580 (login test 4 → 6); all projects 669 → 671

Notes: `LoginPage.test.tsx` runs through `renderWithProviders` and MSW with no `vi.mock`: the real `useLogin` and `findracoApi` send the request, and a rendered sonner `Toaster` shows the error toast. New `authHandlers.loginRejected(message)` answers 401 with the API's `{ message }` body. `renderWithProviders`' `route` now takes a router `InitialEntry`, so a test can start with location state (the "return to where you came from" case). The login and register schemas stay in the page files; moving them is STD-07 territory.

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

- [x] No `register(` in the two pages
- [x] Tests through the network for the changed flows
- [x] Quick gate passes
- [x] Test count ≥ before; a test is removed only when it moves with its subject (report the count): unit + tooling 580 → 585; all projects 671 → 676

Notes: there was no `ResetPasswordPage.test.ts` (only the schema test `resetPasswordForm.test.ts`, unchanged), so the flows got new integration tests: `ForgotPasswordPage.test.tsx` (sends the email and confirms; empty email) and `ResetPasswordPage.test.tsx` (sets the password with the link's token and goes to sign in; mismatch sends nothing; invalid token offers a new link). Forgot password's intro and confirmation are the `AuthCard` description. On reset, each password field has its own visibility toggle (before, the one toggle also revealed the confirmation).

Follow-up (`refactor(frontend): move auth form schemas to form modules`): the four auth schemas live in one `authForms.ts` beside the pages, since login, register and forgot password share the email rule (`emailField`); each form exports `XxxFormValues`/`XxxFormOutput` and its page types `useForm` with both. `resetPasswordForm.ts` and its test moved into `authForms.ts`/`authForms.test.ts` (3 tests kept) with 9 new tests, one per rule and message. Unit + tooling 613 → 622.

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

- [x] Test: create and rename submit the right request
- [x] Old dialogs deleted
- [x] Quick gate passes
- [x] Test count ≥ before; a test is removed only when it moves with its subject (report the count): unit + tooling 585 → 588 (`planNameForm.test.ts` moved with its schema, 5; new `PlanNameDialog.test.tsx`, 3); all projects 676 → 679

Notes: the props are a union: `mode: "create"` takes `onSuccess?`, `mode: "rename"` requires `plan`, so a rename without a plan does not compile. `createPlanForm.ts` became `planNameForm.ts` (`planNameSchema`, the one schema both dialogs had) and its test moved with it. The dialog is now a `<form>`, so Enter submits. Submit picks between two mutations inline; the dialog stays far under the logic cap, so no `usePlanNameSubmit` hook was extracted.

Follow-up (`refactor(frontend): plan name submit in usePlanNameSubmit`): the form skill puts a submit that chooses between mutations in a hook regardless of size, so the choice moved to `usePlanNameSubmit` (`mode: "create"` with `onCreated?`, `mode: "rename"` with `plan`; both take `onDone`). Its test runs through MSW: create (POST body, the created plan handed back), rename (PUT to the plan), and a failed create held in flight by a deferred (`isSubmitting` true, then false; `onDone` never called). New `planHandlers.createNetworkError(release?)`. `planNameForm.ts` exports `PlanNameFormValues`/`PlanNameFormOutput`. Unit + tooling 622 → 625.

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

- [x] No `register(` left in `src`
- [x] Invite flow test through the network
- [x] Quick gate passes
- [x] Test count ≥ before; a test is removed only when it moves with its subject (report the count): unit + tooling 588 → 591; all projects 679 → 682

Notes: to empty `grep -rn "register(" src` three more call sites changed: the description fields of `CategoryFormSheet` and `TransactionFormDrawer` (the last two `register` bindings, planned for STD-07) now go through `FormField`, and `authHandlers.register` became `authHandlers.registerUser`, after the service it mirrors (`useRegisterUser`). New `invitation.handlers.ts` (`create`). `InvitePlanDialog.test.tsx` covers an email invitation, the missing-email error and a link invitation with an expiry; the type and role selects keep `watch` + `setValue` until STD-07.

Follow-up (`refactor(frontend): invite dialog selects bind through FormField`): the type and role selects bind through `FormField` (the trigger takes `id`, `ref`, `onBlur`, `aria-invalid`; `onValueChange={field.onChange}`), so their labels name them; `Select items={…}` shows the label in the trigger, which removed the two `as` casts. The form reads `type` with `useWatch`; no `watch`/`setValue` is left in the dialog. New test: the role and type picked through their labels reach the request body (`{ role: "EDITOR", type: "LINK" }`). The invite schema still sits in the dialog file (not in this follow-up's scope). Unit + tooling 625 → 626.

Follow-up (`refactor(frontend): move the invite form schema to a form module`): `inviteForm.ts` holds `inviteSchema`, `InviteFormValues`/`InviteFormOutput`, `INVITE_FORM_DEFAULTS` and `toInvitePayload` (the email/link branching that `onSubmit` built inline); the dialog keeps `useForm` and layout. `inviteForm.test.ts` covers each rule and message (email required and whitespace-only for an email invitation, link without email accepted, role and type enums) and each payload branch. Unit + tooling 662 → 671.

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

- [x] Test: role × capability matrix (OWNER, EDITOR, CONTRIBUTOR, VIEWER) + loading
- [x] `grep -rn myRole src --include=*.tsx` returns nothing
- [x] Quick gate passes
- [x] Test count ≥ before; a test is removed only when it moves with its subject (report the count): unit + tooling 591 → 597; all projects 682 → 688

Notes: the matrix test derives its expectations from `PlanAuthorization.java` (cited in the test): `requireCanCreateTransaction`, `requireCanAttributeToOthers`, `requireCanManageCategories`, `requireOwner`. "Loading" is "no active plan": the plans query has no data while it loads (`isLoading` is true only without data), so the hook checks `activePlan` alone. The five comparisons (`CategoriesTab`, `PlansPage`, `PlanMembersList`, `TransactionsTab`, `TransactionFormDrawer`) read the hook; `isOwner` became `canManagePlan`. The grep still lists test fixtures and one display, `PlansPage`'s role badge (`ROLE_LABELS[plan.myRole]`), which shows the role of every plan in the list and decides nothing; no component compares `myRole`.

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

- [x] Config test: palette fragment active in every layer, including `components/**/base/**`
- [x] `text-amber-600` in a component fails lint (checked, reverted)
- [x] `pnpm lint` exits 0
- [x] Build gate passes

Notes: `--warning` is amber-800 (#92400e) in light mode, since amber-700 fell below 4.5:1 on the muted background and on a warning/15 fill, and amber-400 (#fbbf24) in dark mode (7.9:1 on the card); foregrounds #fffbeb and #1f1405. `CategorySpendingList` and `TransactionFormDrawer` use `text-warning`; `Badge` `success` uses `bg-success/10 text-success border-success/30` (success/15 would fall to 4.5:1 on the dark card). The palette fragment (`paletteSelectors`: a `Literal` and a `TemplateElement` selector) bans `text|bg|border|ring|fill|stroke|outline|decoration|from|via|to|divide|placeholder|caret|accent|shadow` with any named hue or grey and a shade; black/white overlays (`bg-black/10`) stay allowed. It sits in three syntax layer blocks (`src/**` except `app`, `src/app/**`, `base/`), ready for the typography fragments of T96. The config test asserts it on nine paths (base `.tsx` and `.ts`, tests and stories included) and lints a JSX string, a `cn()` argument, a template literal and a grey behind a variant in a feature and in `base/`. Checked: a base block with a different selector list fails 6 tests; `text-amber-600` in `TransactionFormDrawer` fails lint (reverted). Tooling 73 tests (57 → 73); all projects 688 → 704.

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

- [x] Test through MSW: create, update, series edit with each scope, duplicate, error path
- [x] Quick gate passes
- [x] Test count ≥ before; a test is removed only when it moves with its subject (report the count): unit + tooling 626 → 642 (new `useTransactionFormSubmit.test.ts`, 11; `seriesParcelsChanged`, 5)

Notes: the four mutations and the series-scope flow live in `useTransactionFormSubmit`; the drawer passes `useSeriesScope()`'s `chooseScope` in, so the test drives each scope (and a cancelled prompt) without rendering the dialog. `seriesParcelsChanged(definition, parcelsNumber)` in `transactionForm.ts` (tested) replaces the drawer's `originalParcelsNumberRef`: a changed installment count edits the whole series without asking, and the warning reads the same helper. The handlers file already existed as `financialTransaction.handlers.ts` (named after its service); it gained `updateSeries` and `createRejected`. Tests through MSW: create, update, duplicate (POST, no PUT), series create, each of the three scopes, count changed (ALL, no prompt), cancelled prompt and definition still loading (nothing sent), a rejected create (`onDone` not called).

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

- [x] Story: empty, several items, over-total error
- [x] Drawer item tests pass
- [x] Full gate passes
- [x] Test count ≥ before; a test is removed only when it moves with its subject (report the count): unit + tooling 642 → 646 (`itemsRemainderCents`, 4); storybook +4 (`ItemsField.stories.tsx`); all projects 733 → 741

Notes: `ItemsField` holds the list with `useFieldArray` (rows keyed by `field.id`); description, amount and category bind through raw `Controller`s, since the row has no visible labels (description and amount carry `aria-label`s "Item n description"/"Item n amount"; the remove button became "Remove item n"). Amount, items and type are read with `useWatch`, the list-level error with `useFormState`. The remainder comes from `itemsRemainderCents(amount, items)` in `transactionForm.ts` (tested), which removed the items IIFE. The per-item category picker is `CategoryCombobox`, which fetches categories and reads the category sheet context, so `ItemsField` takes it as a `renderCategory` slot and stays presentational: its story renders in a test form with a read-only stand-in and no providers. Stories: empty (add an item), several items (remove one, remainder updates), over total (error and negative remainder), long descriptions. The drawer's item tests pass unchanged.

**Tests**: story
**Gate**: full
**Commit**: `refactor(frontend): items list in ItemsField on useFieldArray`

---

### T82: Participants on `useFieldArray`

**What**: `AttributionFields` manages `participants` with `useFieldArray` instead of `setValue("participants", …)`; story.
**Where**: `frontend/src/features/transactions/components/AttributionFields.tsx`
**Depends on**: None
**Reuses**: -
**Requirement**: STD-07 (AC 3)

**Tools**: MCP: NONE · Skill: `component-creation`, `frontend-testing`

**Done when**:

- [x] No `setValue("participants"` left
- [x] Story: single payer, split, many members
- [x] Full gate passes
- [x] Test count ≥ before; a test is removed only when it moves with its subject (report the count): unit + tooling 646 → 653 (`participantsForMode`, 5; drawer owned-category tests, 2); storybook +5 (`AttributionFields.stories.tsx`); all projects 741 → 753

Notes: the participants list is one `useFieldArray` owned by the form (the drawer for now), because choosing an owned category also replaces it; `AttributionFields` receives it and binds the mode and split toggles with `useController`, each share through a raw `Controller` (`aria-label` "Name's share"; the member checkboxes gained the member's name as label). Values are read with `useWatch`; `participantsForMode` in `transactionForm.ts` (tested) holds the per-mode rule that the mode handler had inline. The hand-edited flag keeps its behaviour: every change made in `AttributionFields` calls `onEdit`, which sets the drawer's ref, and `categoryAttribution` then leaves the participants alone. Two new drawer tests guard it and passed before and after the change: an owned category attributes the transaction to its owner; after a hand edit (Split), choosing that category keeps the split. The list-level error is read from `root` once a share is registered (the resolver moves it there), else from the list. Stories: single payer, someone else, split (uncheck, exact), exact shares, many members. Found: `StandardCombobox`'s popup (a `role=dialog`) has no accessible name and fails axe when opened, so the story does not open it; left for STD-10.

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

- [x] Both modes use it
- [x] Story
- [x] Full gate passes
- [x] Test count ≥ before; a test is removed only when it moves with its subject (report the count): unit + tooling 653 (unchanged); storybook +4 (`EndDateField.stories.tsx`); all projects 753 → 757

Notes: `EndDateField` binds `endDate` through a raw `Controller`, since the "Ongoing" badge shares the label's row; create (Recurring mode) and series edit (recurring series) both render it, which removed the two copies and their `watch`/`setValue` binding. The help line is now a `FieldDescription` (it was a styled `<p>`). The id comes from `useId` instead of two fixed ids. Validation now follows the form's mode like every other `Controller` field (re-validates on change after the first submit) instead of `shouldValidate` on every pick. `DatePicker` takes no `ref`/`onBlur`, so the field cannot receive focus-on-error; left as it is. Stories: ongoing (typing a date hides the badge), with end date, before the start date (error), disabled.

Follow-up (`fix(frontend): date picker receives focus on validation errors`): `DatePicker` takes `ref` (forwarded to its text input, React 19 `ref` as a prop) and `onBlur` (called after the typed text is committed); the transaction date (`FormField`) and `EndDateField` pass `field.ref`/`field.onBlur`, so both receive focus-on-error and touched state. `DatePicker.test.tsx` renders a small form with a required date through `FormField`: submitting empty focuses the date input; with `mode: "onBlur"` leaving the empty input reports the error; a typed date still reaches the submit. Unit + tooling 671 → 674.

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

- [x] Helper test: even split, remainder cents, 1 installment
- [x] Story
- [x] Full gate passes
- [x] Test count ≥ before; a test is removed only when it moves with its subject (report the count): unit + tooling 653 → 659 (`lastInstallment`, 6); storybook +5 (`InstallmentsField.stories.tsx`); all projects 757 → 768

Notes: spec-precision gap in the task text: "even split, remainder cents" assumes the preview splits an amount, but every installment carries the full amount (backend `RecurringTransactionGenerator` copies `amount` to each occurrence) and the preview shows only the last installment's number and month. `lastInstallment(date, parcelsNumber, currentParcel)` keeps exactly the IIFE's rule, and its test covers what the preview decides: counted from the first installment, from a later current installment, current = last, one installment (no preview), empty count, current beyond the count or below 1. `InstallmentsField` takes a required `mode`: `create` adds the current installment and the preview; `seriesEdit` takes the `definition`, shows "Currently: parcel x of y" as the field description and the whole-series warning (`seriesParcelsChanged` read with `useWatch`). Both counts bind through `FormField` with `NumberField`'s explicit props, which removed the last IIFE and the drawer's `watch("parcelsNumber")`. Stories: create empty (typing a count shows the preview), from a later installment, too few (error), series edit (raising the count shows the warning), many installments.

**Tests**: unit + story
**Gate**: full
**Commit**: `refactor(frontend): installments field with a last-installment helper`

---

### T85: `TransactionFormDrawer` assembly

**What**: Remaining fields through `FormField`; no root `watch()`/`setValue()`; the component composes sections (~150–250 lines).
**Where**: `frontend/src/features/transactions/components/TransactionFormDrawer.tsx`
**Depends on**: T80, T81, T82, T83, T84
**Reuses**: -
**Requirement**: STD-07 (AC 6)

**Tools**: MCP: NONE · Skill: `form-creation`, `api-integration`, `frontend-testing`

**Done when**:

- [x] `transactionForm.test.ts` (the former drawer tests, T22) and `TransactionFormDrawer.test.tsx` pass, adapted only in imports and value entry
- [x] No `watch(` at the form root, no `setValue(` for field binding
- [x] Quick gate passes
- [x] Test count ≥ before; a test is removed only when it moves with its subject (report the count): unit + tooling 659 (unchanged); `transactionForm.test.ts`, `transactionForm.series.test.ts` and `TransactionFormDrawer.test.tsx` pass with no change at all

Notes: the drawer composes `TypeField`, the description and amount `FormField`s, `CategoryField`, the date `FormField`, `ItemsField`, `AttributionFields`, `InstallmentsField`, `EndDateField` and `RecurrenceFields`; the three sections used once (`TypeField`, `CategoryField`, `RecurrenceFields`) are non-exported components in the drawer file. Category and date bind through `FormField`; type, the recurring checkbox and the mode toggle through raw `Controller`s (a toggle group names itself; a checkbox sits beside its label). Values that steer the layout are read with `useWatch` in the section that needs them (type in `CategoryField`, recurring and mode in `RecurrenceFields`); no `watch` is left. `setValue` remains only for side effects on other fields, never for binding: a new type clears the category, turning repetition off or switching mode drops the other settings, and an owned category sets the attribution mode and split. Clearing the date's text keeps the last date, as before. Logic lines before the main `return`: `TransactionFormDrawer` 48 (was about 110), `TypeField` 0, `CategoryField` 1, `RecurrenceFields` 1; the drawer is now a `function` declaration. File 696 → 397 lines; the main component is about 200.

**Tests**: integration
**Gate**: quick
**Commit**: `refactor(frontend): transaction drawer composes its sections`

---

### T86: `useCategoryFormSubmit`

**What**: The category form's mutations move into the hook.
**Where**: `frontend/src/features/categories/components/useCategoryFormSubmit.ts`
**Depends on**: None
**Reuses**: -
**Requirement**: STD-07 (AC 2)

**Tools**: MCP: NONE · Skill: `frontend-testing`, `feature-structure`

**Done when**:

- [x] Test through MSW: create, update, error path
- [x] Quick gate passes
- [x] Test count ≥ before; a test is removed only when it moves with its subject (report the count): unit + tooling 659 → 662 (new `useCategoryFormSubmit.test.ts`, 3)

Notes: `useCategoryFormSubmit({ editing, onSuccess?, onDone })` holds the create and update mutations; both hand the saved category to `onSuccess` (the category picker's "create" option selects it) and then close. Tests through MSW: create (POST body, created category handed back), update (PUT to the category, updated one handed back), a rejected create (neither callback runs). New `financialTransactionCategoryHandlers.createRejected(message)`.

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

- [x] Story: no limit, shared limit, per-member limits
- [x] Full gate passes
- [x] Test count ≥ before; a test is removed only when it moves with its subject (report the count): unit + tooling 662 (unchanged); storybook +5 (`CategoryLimitFields.stories.tsx`); all projects 771 → 776

Notes: `CategoryLimitFields` owns `memberLimits` with `useFieldArray` (rows keyed by `field.id`; removing a former member's entry is `remove(index)` instead of a filtered `setValue`), binds the limit mode with `useController`, reads the rows with `useWatch` for the shares (`memberLimitShares`, now computed here instead of in the sheet) and the errors with `useFormState`. Its props shrink to `control`, `perMemberDisabledReason` and `disabled`; it is now a `function` declaration. Stories: no limit, shared limit, per-member limits (shares, a former member's disabled row removed), per member not allowed (owned category), many members.

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

- [x] `categoryForm.test.ts` and `CategoryFormSheet.test.tsx` pass, adapted only in imports and value entry
- [x] Quick gate passes
- [x] Test count ≥ before; a test is removed only when it moves with its subject (report the count): unit + tooling 662 (unchanged); all projects 776 (unchanged); `categoryForm.test.ts` and `CategoryFormSheet.test.tsx` pass with no change at all

Notes: the sheet composes `TypeField` (raw `Controller`: the toggle group names itself), the name `FormField`, `ParentField` and `OwnerField` (`FormField` with the "(optional)" label and the hints as descriptions), and `LimitSection` (`CategoryLimitFields` when the type is DEBIT, with the owned-category reason). Each section reads the values it depends on with `useWatch` (type for the parent options; parent to hide the owner; type, parent and owner for the limits); no `watch` is left. `setValue` remains only for side effects: a new type clears the parent (and the limit for income), a parent clears the owner, an owner sets the single limit. The two hints under parent and owner are `FieldDescription`s now (`text-sm`, they were `text-xs`). Logic lines before the main `return`: `CategoryFormSheet` 31, `TypeField` 0, `ParentField` 2, `OwnerField` 3, `LimitSection` 3, `CategoryLimitFields` 9; the sheet is now a `function` declaration. Build gate green (lint, build, 98 files / 776 tests). STD-07 done.

**Tests**: integration
**Gate**: quick
**Commit**: `refactor(frontend): category sheet composes its sections`

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

- [x] Stories: every variant, every level, long text
- [x] Full gate passes

Notes: `typographyVariants` holds the seven steps with the classes of decision 7 (`display` also carries the numeral's `leading-none` and `tracking-tighter`; `body` is the default). `Text` renders `span` | `p` | `div`; `Heading` requires `level` and `variant`. Stories: each variant on `Text` (plus `p`, truncated long text and a colour override) and each level on `Heading` (plus `display` and a wrapping long title). All projects 788 → 806.

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

- [x] Story: title only, with description and actions, mobile viewport
- [x] Full gate passes

Notes: title as `Heading` level 1 `headline`, description as `Text` `p` `secondary`, actions beside it, wrapping below on a narrow screen. Stories: title only, with description and actions, long title, mobile viewport. All projects 806 → 810.

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

- [x] Story
- [x] Full gate passes

Notes: title as `Heading` `title` (`level` 2 by default, 3–4 allowed; `text-md` gone, same 16px semibold as the inherited size it rendered), subtitle as `Text` `caption`. The only consumer (`PlansPage`) now gets an `h2` instead of a `span`. Stories: title only, subtitle and action, nested level, long text, mobile. All projects 810 → 815.

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

- [x] No raw text tags or size/weight classes in these folders
- [x] Build gate passes
- [x] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

Notes: first, `body`, `secondary` and `caption` gained `font-normal` (skill table updated). Plans title/subtitle and actions on `PageHeader` (h1, 24px / 14px), plan card name `title`, TransferOwnership help text `FieldDescription`, 404 numeral `display`, 404 and auth titles `headline` (404 30→24px), wordmark `headline` (30→24px, normal tracking), 404 description and "Can't reach" `secondary`, auth link buttons without `font-bold`, HomePage tabs and the "Forgot password?" link without classes that repeat Button's, Toaster through `typographyVariants`. Inline emphasis in descriptions (`text-foreground font-medium`) is `Text` `label` with `text-foreground`. Test fixtures in `AuthProvider.test.tsx` and `PrivateRoute.test.tsx` render `<div>` instead of `<p>` (queries unchanged). `SectionHeader` keeps its stories but has no consumer now. All projects 815 → 815.

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

- [x] No raw text tags or size/weight classes in the folder
- [x] Build gate passes
- [x] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

Notes: metric labels `secondary` (normal weight); desktop figures and both Balance sizes `headline` (mobile Balance 30→24px, so `Balance` lost its `size` prop); mobile Income/Expenses `title` (18px bold → 16px semibold); `PeriodNavigator` label `title` (mobile 14→16px). Trend tick: `typographyVariants({ variant: "caption" })` with `fill-foreground` for the current period and `fill-muted-foreground` otherwise (the SVG colour classes; the `fontSize` attribute and `font-semibold` are gone), per the second review instead of `label`; the skill example follows. `CategorySpendingList`: status text `caption` + `text-warning`/`text-destructive` (normal weight); member sub-row name and amounts `caption` (`text-foreground` for the name and spent figure); root/child names `title`/`body` (same 16px semibold / 14px as before); root amounts `label` + `secondary` (same look); owner pill is `Badge` `outline`; empty state `secondary`. All projects 815 → 815.

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

- [x] No raw text tags or size/weight classes in the folders
- [x] Build gate passes
- [x] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

Notes: help text in the category form and limit fields is `FieldDescription` (12→14px). The forced `text-sm` is gone from the TransactionCells inputs (×3) and the AttributionFields share input. The filter count is `Badge` (default). "Clear all" is Button `size="xs"`. The mobile day header (`Heading` level 3) and the category column header are `caption` (normal weight). Combobox trigger text and option labels are `Text` (`body`/`label`), so the trigger no longer inherits Button's `font-medium`. SeriesScopeDialog helper text is `secondary` and no longer inherits `FieldLabel`'s weight. The root category name is `title` in both layouts (wide 14→16px, decision 7 row added), the child name is `body`. "(optional)" in labels is `secondary`. Status, warning and remainder lines are `Text` with token colours. The CategoryCombobox "Create" button moved to the default size with `h-7` (same look). All projects 815 → 815; run per project, because the combined run timed out at random under machine load (load average ~20).

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

- [x] No raw text tags or size/weight classes outside `base/`
- [x] Full gate passes
- [x] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

Notes: table pagination counts are `secondary` (14px at every width). "Lines per page" and the empty table cell are `Text`. `AppVersion` is `caption`. `StandardCombobox` trigger and "Create" text are `body`. In `StandardMultiCombobox` the placeholder is `secondary` and the overflow chip is `Badge` `secondary`. `ProfilePictureInput` (no consumer) is deleted. The `SectionHeader` story asserts the classes of `typographyVariants({ variant: "title" })` instead of literal strings, which the T96 lint would flag. All projects 815 → 815, run per project. In the combined run, user-event tests time out at random under machine load; each takes under 1.3s alone.

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

- [x] Config test: fragments active outside `base/`, absent inside
- [x] `<p className="text-sm">` in a feature fails lint (checked, reverted)
- [x] `pnpm lint` exits 0
- [x] Build gate passes

Notes: `typographySelectors` (Literal and TemplateElement over one regex: sizes `text-xs`…`text-9xl`, `text-2xs`, `text-md`, arbitrary `text-[…]`, with breakpoint/`!` prefixes and `/` line-height modifiers; weights `font-thin`…`font-black`) and `rawTextTagSelectors` (`JSXOpeningElement` `p`, `h1`–`h6`) are spread into the `src/**` and `src/app/**` syntax layers; `base/` keeps palette only. Config test: the fragments per layer path (11 paths, stories and tests included, base/ absent), `<p className="text-sm">` reported twice, raw headings, each size/weight form, allowed alignment/family/colour classes, base/ free. The palette test's helper now keeps only palette messages, since its `text-sm font-medium` probe is a typography error now. A dropped fragment on the `app/` layer turns two cases red (checked, reverted). The proof file `src/features/plans/LintProbe.tsx` failed with both messages (checked, reverted). Tooling 73 → 101.

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

- [x] No `func-style: declaration` violation in the area (rule run ad hoc)
- [x] Quick gate passes
- [x] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

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

- [x] No `func-style: declaration` violation in the area (rule run ad hoc)
- [x] Quick gate passes
- [x] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

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

- [x] No `func-style: declaration` violation in the area (rule run ad hoc)
- [x] Quick gate passes
- [x] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

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

- [x] No `func-style: declaration` violation in the area (rule run ad hoc)
- [x] Quick gate passes
- [x] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

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

- [x] No `func-style: declaration` violation in the area (rule run ad hoc)
- [x] Quick gate passes
- [x] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

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

- [x] `const Foo = () => …` at top level fails lint (checked, reverted)
- [x] `pnpm lint` exits 0
- [x] Build gate passes

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

- [x] `grep -rE "(CAT|UX|NAV|STD|SESS)-[0-9]+" src --include=*.ts* | grep -v test` returns nothing
- [x] Quick gate passes
- [x] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: none
**Gate**: quick
**Commit**: `refactor(frontend): comments explain why, without spec IDs`

---

### Phase 15: Story coverage (STD-10) (T104–T111)

### T104: `check-siblings.ts`: story report

**What**: TypeScript script (Node 24 type stripping, `typescript` compiler API) listing every `.tsx` under `src/` (except `index.tsx`, `src/test/**`, tests and stories) without a sibling `.stories.tsx` that does not directly import `@/api/services`, `@/app/providers` or `react-router-dom`; non-zero exit naming each file. Not wired yet. Hook tests may be `.test.tsx` (provider wrappers need JSX): a sibling `.test.ts` or `.test.tsx` both count.
**Where**: `frontend/scripts/check-siblings.ts`
**Depends on**: None
**Reuses**: -
**Requirement**: STD-10 (AC 1, 2)

**Tools**: MCP: NONE · Skill: `frontend-testing`

**Done when**:

- [x] `check-siblings.test.ts` (tooling): presentational without story fails naming it; with story passes; container exempt by each import kind
- [x] `tsconfig.node.json` covers `scripts/`
- [x] Quick gate passes

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

- [x] The report lists nothing in the area
- [x] Each story file covers variants, handled states, extreme content, mobile viewport when the layout changes
- [x] Full gate passes
- [x] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

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

- [x] The report lists nothing in the area
- [x] Each story file covers variants, handled states, extreme content, mobile viewport when the layout changes
- [x] Full gate passes
- [x] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

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

- [x] The report lists nothing in the area
- [x] Each story file covers variants, handled states, extreme content, mobile viewport when the layout changes
- [x] Full gate passes
- [x] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

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

- [x] The report lists nothing in the area
- [x] Each story file covers variants, handled states, extreme content, mobile viewport when the layout changes
- [x] Full gate passes
- [x] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

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

- [x] The report lists nothing in the area
- [x] Each story file covers variants, handled states, extreme content, mobile viewport when the layout changes
- [x] Full gate passes
- [x] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: story
**Gate**: full
**Commit**: `test(frontend): stories for features/categories`

---

### T110: Stories: `features/plans`, `features/auth`, `features/notFound`, `src/app`

**What**: Every component the T104 report lists in `features/plans`, `features/auth`, `features/notFound`, `src/app` gets a story following the checklist; a component that cannot render from props alone is split into container + view, the view getting the story (STD-10 AC 4).
**Where**: `frontend/src/features/plans/`
**Depends on**: T104, T126
**Reuses**: -
**Requirement**: STD-10 (AC 1, 3, 4)

**Tools**: MCP: NONE · Skill: `component-creation`, `frontend-testing`

**Done when**:

- [x] The report lists nothing in the area
- [x] Each story file covers variants, handled states, extreme content, mobile viewport when the layout changes
- [x] Full gate passes
- [x] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: story
**Gate**: full
**Commit**: `test(frontend): stories for features/plans, features/auth, features/notFound, src/app`

---

### T126: Gate refinement: real paths, our hooks, containers without markup

**What**: Gate refinement decided 2026-10-18 (user followed the orchestrator's recommendation; explanation pending): (1) resolve relative and `@/` imports to real paths before classifying; (2) a component is a container when it imports one of the three modules directly **or** one of our modules (hook) that does; (3) a container may render only components, never intrinsic HTML elements (`div`, `span`, `button`…), so STD-10 AC 4 is enforced mechanically. Report both violations (missing story, container with markup), naming files. Not wired yet.
**Where**: `frontend/scripts/check-siblings.ts`
**Depends on**: T109
**Reuses**: `scripts/check-siblings.ts`, the story checklist
**Requirement**: STD-10 (AC 1, 2, 4)

**Tools**: MCP: NONE · Skill: `component-creation`, `frontend-testing`

**Done when**:

- [x] Tests: relative import resolved; container via our hook; container with an intrinsic element fails naming it; container rendering only components passes
- [x] Report lists the containers to split
- [x] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: tooling
**Gate**: quick
**Commit**: `build(frontend): story gate sees our hooks and container markup`

---

### T127: Container/view splits: `src/app` (layouts, Navbar, Toaster, PrivateRoute, HomePage tabs)

**What**: Apply T126's report in `src/app` (layouts, Navbar, Toaster, PrivateRoute, HomePage tabs); the view gets the story.
**Where**: `frontend/src/app/layout/`
**Depends on**: T126
**Reuses**: `scripts/check-siblings.ts`, the story checklist
**Requirement**: STD-10 (AC 1, 2, 4)

**Tools**: MCP: NONE · Skill: `component-creation`, `frontend-testing`

**Done when**:

- [x] Every container in `src/app` (layouts, Navbar, Toaster, PrivateRoute, HomePage tabs) that renders HTML elements of its own is split: the container keeps the hooks and renders only components; the view renders from props and has a story per the checklist
- [x] Behaviour unchanged; existing tests pass (moved with their subjects where needed)
- [x] Full gate passes
- [x] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: story
**Gate**: full
**Commit**: `refactor(frontend): split app shell containers into views`

---

### T128: Container/view splits: `features/transactions` and `features/overview`

**What**: Apply T126's report in `features/transactions` and `features/overview`; the view gets the story.
**Where**: `frontend/src/features/transactions/`
**Depends on**: T126
**Reuses**: `scripts/check-siblings.ts`, the story checklist
**Requirement**: STD-10 (AC 1, 2, 4)

**Tools**: MCP: NONE · Skill: `component-creation`, `frontend-testing`

**Done when**:

- [x] Every container in `features/transactions` and `features/overview` that renders HTML elements of its own is split: the container keeps the hooks and renders only components; the view renders from props and has a story per the checklist
- [x] Behaviour unchanged; existing tests pass (moved with their subjects where needed)
- [x] Full gate passes
- [x] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: story
**Gate**: full
**Commit**: `refactor(frontend): split transactions and overview containers`

---

### T129: Container/view splits: `features/categories`

**What**: Apply T126's report in `features/categories`; the view gets the story.
**Where**: `frontend/src/features/categories/`
**Depends on**: T126
**Reuses**: `scripts/check-siblings.ts`, the story checklist
**Requirement**: STD-10 (AC 1, 2, 4)

**Tools**: MCP: NONE · Skill: `component-creation`, `frontend-testing`

**Done when**:

- [x] Every container in `features/categories` that renders HTML elements of its own is split: the container keeps the hooks and renders only components; the view renders from props and has a story per the checklist
- [x] Behaviour unchanged; existing tests pass (moved with their subjects where needed)
- [x] Full gate passes
- [x] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: story
**Gate**: full
**Commit**: `refactor(frontend): split categories containers into views`

---

### T130: Container/view splits: `features/plans`

**What**: Apply T126's report in `features/plans`; the view gets the story.
**Where**: `frontend/src/features/plans/`
**Depends on**: T126
**Reuses**: `scripts/check-siblings.ts`, the story checklist
**Requirement**: STD-10 (AC 1, 2, 4)

**Tools**: MCP: NONE · Skill: `component-creation`, `frontend-testing`

**Done when**:

- [x] Every container in `features/plans` that renders HTML elements of its own is split: the container keeps the hooks and renders only components; the view renders from props and has a story per the checklist
- [x] Behaviour unchanged; existing tests pass (moved with their subjects where needed)
- [x] Full gate passes
- [x] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: story
**Gate**: full
**Commit**: `refactor(frontend): split plans containers into views`

---

### T131: Container/view splits: `features/auth`, `features/notFound`, `src/components` (e.g. `ThemeToggle`)

**What**: Apply T126's report in `features/auth`, `features/notFound`, `src/components` (e.g. `ThemeToggle`); the view gets the story.
**Where**: `frontend/src/features/auth/`
**Depends on**: T126
**Reuses**: `scripts/check-siblings.ts`, the story checklist
**Requirement**: STD-10 (AC 1, 2, 4)

**Tools**: MCP: NONE · Skill: `component-creation`, `frontend-testing`

**Done when**:

- [x] Every container in `features/auth`, `features/notFound`, `src/components` (e.g. `ThemeToggle`) that renders HTML elements of its own is split: the container keeps the hooks and renders only components; the view renders from props and has a story per the checklist
- [x] Behaviour unchanged; existing tests pass (moved with their subjects where needed)
- [x] Full gate passes
- [x] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

**Tests**: story
**Gate**: full
**Commit**: `refactor(frontend): split auth, 404 and shared containers`

---

### T111: Story gate in `pnpm test`

**What**: `test` runs the story report before Vitest; CI follows through `pnpm test`.
**Where**: `frontend/package.json`
**Depends on**: T105, T106, T107, T108, T109, T110, T127, T128, T129, T130, T131
**Reuses**: -
**Requirement**: STD-10 (AC 2)

**Tools**: MCP: NONE · Skill: `frontend-testing`

**Done when**:

- [x] Deleting a story fails `pnpm test` naming the component (checked, reverted)
- [x] Full gate passes

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

- [x] Test per decision-point kind, arithmetic, iteration callback; a type-only, a constant-only and a `*.handlers.ts` module exempt
- [x] Quick gate passes

Note: `src/test/**` is test support like `*.handlers.ts` and is skipped too (the coverage scope excludes it as well). Literal-only arithmetic (`5 * 60 * 1000`) is a constant, not logic. `+` counts as arithmetic even on strings, since the AST cannot tell them apart; template literals carry no operator. First report: `useFinancialTransactionService`, `buildPagedQuery`, `resolveErrorMessage`, `resolveSuccessMessage`, `useMemberColors`, `masks.ts` (T113).

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

- [x] The test report lists nothing
- [x] Every branch of each module covered
- [x] Quick gate passes
- [x] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

Done: unit + tooling 71 files / 762 tests → 77 / 811, none removed. Six modules, each at 100% branches: `buildPagedQuery`, `resolveErrorMessage`, `resolveSuccessMessage`, `masks.ts`, `useMemberColors` and `useFinancialTransactionService` (through MSW; five handler factories added). The import test asserts method, URL, result and refresh but not the multipart body: under jsdom, MSW's XHR interceptor receives jsdom's `FormData` as the text `[object FormData]`.

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

- [x] `vitest run --coverage` reports per-file branches; components, stories, DTOs and types excluded
- [x] Quick gate passes

Choices: `thresholds.perFile` (the failure names the module, and a module with few branches cannot hide behind well-tested ones, so removing one case can fail the gate); measured on the `unit` project only (`vitest run --project=unit --coverage`; `tooling` covers no `src` file, and `storybook` would count helpers that stories run without asserting); `all: false`, because v8 reports a module no test loads as 0% branches even when it has none (barrels, `queryClient.ts`, `useDebounce`), while the sibling gate already makes every logic module load in its test. First run: 95.8% branches over 71 modules; five under 90% (T115). `coverage/` is git-ignored.

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

- [x] Coverage ≥ 90% branches
- [x] Quick gate passes
- [x] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

Done: 97.8% branches overall, every module ≥ 90%; unit + tooling 811 → 835 tests, none removed. Raised: `useDashboardService` 77.8 → 100 (not fetched without a plan or while disabled); `usePlanService` 87.2 → 100 (five mutations hand result and request to the caller's `onSuccess`); `transactionFilterDraft` 78.3 → 100 (date range both ways, one-ended ranges, no range and the "all" type); `transactionForm` 89.7 → 94.1 (current-installment validation, attribution read from an existing transaction, Me without a known user, Someone else before and after a pick); `formatters` 50 → 100 (`formatDate` string and `Date` paths, `getFirstAndLastInitials`). `getFirstName` lost its `?? name`: `split` always returns an element, so that arm could never run.

---

### T116: Full gate in `pnpm test`

**What**: `test` = `node scripts/check-siblings.ts && vitest run --coverage`.
**Where**: `frontend/package.json`
**Depends on**: T115
**Reuses**: -
**Requirement**: STD-11 (AC 2, 3)

**Tools**: MCP: NONE · Skill: `frontend-testing`

**Done when**:

- [x] Deleting a helper test fails `pnpm test` naming it; removing a branch's case fails coverage (checked, reverted)
- [x] Full gate passes

Done: `test` = `node scripts/check-siblings.ts && vitest run --project=unit --coverage && vitest run --project=tooling --project=storybook`. Deviation from the literal `vitest run --coverage`: coverage is root-level in Vitest, so a single run measures the `storybook` project too, and stories raised modules without asserting them (`periodNavigator` 90 → 91.7%, `spendingRows` 94.0 → 95.5%). CI still runs every project through `pnpm test`. Checked, reverted: without `resolveSuccessMessage.test.ts` the run stops with `Logic modules without a sibling .test.ts: src/api/utils/resolveSuccessMessage.ts`; without its "no message or fallback" case it fails `Coverage for branches (80%) does not meet global threshold (90%) for src/api/utils/resolveSuccessMessage.ts`. The full gate exposed a flaky `TransferOwnershipDialogView` story (a11y caught the listbox mid exit), fixed in its own commit before this one.

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

- [x] Test: first, middle, last, empty page
- [x] Quick gate passes
- [x] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

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

- [x] Test: every column both ways, unknown column
- [x] Quick gate passes
- [x] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

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

- [x] Test with fake timers: debounce, URL sync both ways, clear
- [x] Quick gate passes
- [x] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

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

- [x] Mapper test: each editable field
- [x] Quick gate passes
- [x] Test count ≥ before; a test is removed only when it moves with its subject (report the count)

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

