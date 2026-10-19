# Frontend Standards Validation

**Date**: 2026-10-19
**Spec**: `.specs/features/frontend-standards/spec.md`
**Diff range**: `5160905..d3bbee5` (159 commits on `main`; `origin/main` is at `d8bf3e0`, so the last 33 commits, STD-09 T103 onwards, are not pushed and have no CI run yet)
**Verifier**: independent sub-agent (author ≠ verifier)
**Scope**: STD-01..STD-12. STD-13 is Deferred (design decision 10) and STD-14 is blocked by the local Docker database. Neither is in scope for this report.

**Current verdict (iteration 1 re-verification, at `cc2bcea`): FAIL ❌.** Gaps 1–3 and Fix 4 are closed: M28, M29 and M9 are now killed, and M9 fails in 12 ms. One new mutant survives on the fixed logic-cap rule: deleting its `JSXFragment` listener breaks no test. The fix is one RuleTester case. See "Iteration 1 re-verification" at the end of this report.

**Initial verdict (at `d3bbee5`): FAIL ❌.** Every gate is green and every mechanical guarantee I tested in the scratch worktree fires. Two problems block PASS:

- **Two surviving mutants on the unhandled-request guard (STD-04 AC 3).** The behaviour works when tried by hand, but no test protects it.
- **A way around the logic cap (STD-12 AC 3).** A component that returns its JSX through a variable or a call is not counted.

All three fixes are small (see Fix Plans).

---

## Task Completion

| Task | Status | Notes |
| ---- | ------ | ----- |
| T1–T131 (125 tasks, 17 phases) | ✅ Done | Every `- [ ]` in `tasks.md` is checked. The deviations recorded in the task notes were reviewed: T84 (spec-precision gap in "even split"), T116 (coverage runs on `unit` only), T61/T81/T82/T85/T87 (raw `Controller` for unlabelled rows) and T110/T126 (gate refinement, design decision 8). None of them contradicts an AC. |

---

## Spec-Anchored Acceptance Criteria

Paths are relative to `frontend/` unless they start with `.claude/`, `.specs/`, `.github/` or `CLAUDE.md`. "Probe" means I fed code to `eslint --stdin --stdin-filename <path>` in the real tree (this reads only, no file is written), or I mutated the scratch worktree and ran the gate there.

### STD-01 Written standards (docs: checked by reading against `context.md`)

| AC | Spec-defined outcome | Evidence | Result |
| -- | -------------------- | -------- | ------ |
| 1 | Every `context.md` decision is stated as a rule, with its enforcement where it has one | `CLAUDE.md:45-79` (one bullet per area, each pointing to its skill). Decision → skill line: C4b ladder `.claude/skills/feature-structure/SKILL.md:71`; `base/` `.claude/skills/component-creation/SKILL.md:195,215`; C6 `feature-structure/SKILL.md:109`; C5 `feature-structure/SKILL.md:49`; C1 `component-creation/SKILL.md:90-107`; D4 `component-creation/SKILL.md:118-135`; C3 `feature-structure/SKILL.md:28,183`; C8 `component-creation/SKILL.md:228`; C9 `feature-structure/SKILL.md:98,103`; B1 `component-creation/SKILL.md:248`; B2/B6 `component-creation/SKILL.md:251-252,333-335`; B3 `component-creation/SKILL.md:256`; B5 `form-creation/SKILL.md:354`; B7 `component-creation/SKILL.md:349`; D2 `form-creation/SKILL.md:220`; E1 `component-creation/SKILL.md:61`; FormValues/FormOutput `form-creation/SKILL.md:17,48-51`; E2 `component-creation/SKILL.md:59,74`; E3 `form-creation/SKILL.md:166,178`; E4b `component-creation/SKILL.md:268`; E5 `component-creation/SKILL.md:440`; F1 `frontend-testing/SKILL.md:23,88,139`; F2 `frontend-testing/SKILL.md:17-25,151`; F3 `frontend-testing/SKILL.md:85`; G1/no-bypass `component-creation/SKILL.md:455-456`; G2 `frontend-testing/SKILL.md:217-220` | ✅ PASS |
| 2 | None of the five listed contradictions remain in the four rewritten skills | `grep -i "don't modify shadcn\|always in utils\|domain language stays\|arrow function component\|only JSDoc"` over the skills returns nothing. The only `export const X = () =>` is the "Wrong" example at `component-creation/SKILL.md:74-75` | ✅ PASS |
| 3 | `frontend-testing` defines unit / story / integration / E2E, the story checklist and the no-`vi.mock` rule | `.claude/skills/frontend-testing/SKILL.md:17-25` (table, E2E row at :25), `:88` (story checklist), `:151` ("Never `vi.mock` our own modules in a flow test") | ✅ PASS |
| 4 | CONVENTIONS / STRUCTURE / TESTING describe the standards | `.specs/codebase/CONVENTIONS.md:27,51-52`; `STRUCTURE.md:35,42,51-52`; `TESTING.md:19-22,40` | ✅ PASS |
| 5 | Primitive flow: check shadcn + Base UI → CLI → move to `<family>/base/` → convert to function style | `.claude/skills/component-creation/SKILL.md:222-240` (steps 1–5, in that order) | ✅ PASS |

### STD-02 Green lint baseline

| AC | Spec-defined outcome | Evidence | Result |
| -- | -------------------- | -------- | ------ |
| 1 | `npm run lint` exits 0 | `pnpm lint` exit 0 at `d3bbee5` (gate run below) | ✅ PASS |
| 2 | `linterOptions.noInlineConfig: true` | `eslint.config.js:149-151`; `eslint.config.test.ts:27` - `expect(componentConfig.linterOptions.noInlineConfig).toBe(true)` | ✅ PASS |
| 3 | `ban-ts-comment` reports `@ts-ignore`, `@ts-expect-error` and `@ts-nocheck` | `eslint.config.js:172-175`; `eslint.config.test.ts:31,42` - `expect(ruleIds).toContain("@typescript-eslint/ban-ts-comment")` for each directive. Probe: `// @ts-ignore` in `src/utils/probe.ts` → `@typescript-eslint/ban-ts-comment` | ✅ PASS |
| 4 | `consistent-type-definitions: "type"`; no `interface` outside `*.d.ts` | `eslint.config.js:177,190-193`; `eslint.config.test.ts:92` - `toEqual([2, "type"])` + `toContain("@typescript-eslint/consistent-type-definitions")`; `grep -rnE "^\s*(export )?interface " src` outside `.d.ts` returns nothing. Probe: `export interface Foo` → reported | ✅ PASS |
| 5 | A component `.tsx` exports only components | `eslint.config.js:167-170`; `eslint.config.test.ts:71` - `toContain("react-refresh/only-export-components")`. Probe: a helper exported beside a component → reported | ✅ PASS |
| 6 | Every provider is split into `XxxProvider.tsx` + `useXxx.ts`, and the hook throws outside its provider | `src/app/providers/{Auth,Plan,Theme}Provider.tsx` + `useAuth.ts`, `usePlanContext.ts`, `useTheme.ts`; `src/components/dialog/useConfirm.ts:15`; `src/features/transactions/components/useSeriesScope.ts:15`; `src/hooks/useCategoryFormSheet.ts:21`; throw tests e.g. `src/hooks/useCategoryFormSheet.test.tsx:13` (12 tests cite AC 6) | ✅ PASS (⚠️ see spec-precision gap SP-5) |
| 7 | Stories import from `@storybook/react-vite`; no `addon-backgrounds` | `grep '@storybook/react"'` returns nothing; `.storybook/main.ts` addons are chromatic, docs, a11y, vitest | ✅ PASS |
| 8 | `components.json` aliases point at the project's real paths | `components.json`: `"utils": "@/lib/mergeClasses"`, `"css": "src/index.css"`, `"ui": "@/components"` | ✅ PASS |
| 9 | An `eslint-disable` comment does not silence the rule | `eslint.config.test.ts:53-60` - `expect(ruleIds).toContain("@typescript-eslint/no-explicit-any")` after `eslint-disable-next-line` and after `/* eslint-disable */`. Probe: `// eslint-disable-next-line @typescript-eslint/no-explicit-any` before `(): any` → still `@typescript-eslint/no-explicit-any`, plus a notice that the inline config is ignored | ✅ PASS |

### STD-03 Gates before production

| AC | Spec-defined outcome | Evidence | Result |
| -- | -------------------- | -------- | ------ |
| 1 | Every push to any branch runs a frontend job (lint, build, tests) and a backend job (`./mvnw test`) | `.github/workflows/ci.yml:3-5` (`on: push` with no branch filter), `:42-106` (lint `:74`, build `:78`, `pnpm test` `:106`), `:108-122` (`./mvnw -B test`). CI run 39180075199 (`d8bf3e0`): frontend, backend, changes and deploy all succeeded | ✅ PASS |
| 2 | Deploy runs only after both CI jobs succeed | `ci.yml:125` `needs: [changes, frontend, backend]`; the `if:` at `:126` has no status function, so GitHub adds `success()` | ✅ PASS |
| 3 | A failed CI job means no deploy | CI run 39140135153: frontend `failure` → deploy `skipped` | ✅ PASS |
| 4 | A push to `main` that changes only `.specs/**`, `.claude/**` or `*.md` does not deploy | `ci.yml:29-40`. That shell step, replayed locally: docs-only commit `94a757e` → `deployable=false`; code commit → `true`; zeroed `before`, non-ancestor `before` (force push) and `workflow_dispatch` → `true`. No docs-only push has reached GitHub since `ci.yml` landed (run 39141736690 pushed code too) | ✅ PASS (local replay; no live evidence yet) |
| 5 | `pre-commit` runs ESLint on staged frontend files and blocks on error | `frontend/.husky/pre-commit` (`pnpm exec lint-staged`); `package.json` `"lint-staged": {"*.{ts,tsx}": "eslint --max-warnings=0"}`; `core.hooksPath=frontend/.husky/_`. Scratch: staged `export const Probe = () => null;` → hook exit 1 (`func-style`) | ✅ PASS |
| 6 | `commit-msg` runs `check_commit.py` and blocks a non-Conventional message | `frontend/.husky/commit-msg` (`check_commit.py "$1"`). Scratch: message "stuff" → `check_commit: FAIL`, exit 1 | ✅ PASS |

### STD-04 Test infrastructure

| AC | Spec-defined outcome | Evidence | Result |
| -- | -------------------- | -------- | ------ |
| 1 | `npm test` runs the `unit` and `storybook` projects | `package.json` `test` = `node scripts/check-siblings.ts && vitest run --project=unit --coverage && vitest run --project=tooling --project=storybook`; gate log: unit 82 files, tooling + storybook 95 files | ✅ PASS |
| 2 | Storybook a11y is `test: "error"`, and the existing stories pass | `.storybook/preview.tsx:17`; 91 story files pass (gate run) | ✅ PASS |
| 3 | MSW starts for every test file, handlers reset after each test, and any request without a handler fails the test | `vite.config.ts:117` (`setupFiles`), `src/test/setupUnit.ts:7-23`, `src/test/unhandledRequests.ts:18-23`; `src/test/unhandledRequests.test.ts:11` - `toThrow(/GET …\nPOST …$/)`. Scratch: a test that swallows an error from an unmocked `GET /nowhere` fails with "Requests without an MSW handler". **But mutants M28 and M29 survive**: no test checks a single unhandled request, and no test checks the `afterEach` wiring | ❌ GAP (works, but no test protects it) |
| 4 | Service-hook tests go through MSW, with a 401 → refresh → retry test | No `vi.mock` under `src/api/services/` (5 test files); `src/api/clients/findracoApi.test.ts:126` - `expect(requests.map(pathOf)).toEqual(["/plans", "/auth/refresh", "/plans"])` and `expect(authorizations(requests, "/plans")).toEqual(["Bearer old-token", "Bearer new-token"])` | ✅ PASS (⚠️ SP-3 for hook tests outside `api/services`) |
| 5 | CI installs the Playwright browser and runs both projects | `ci.yml:82-106` (Chromium install/cache, then `pnpm test`) | ✅ PASS |

### STD-05 Structure

| AC | Spec-defined outcome | Evidence | Result |
| -- | -------------------- | -------- | ------ |
| 1 | `features/` holds exactly overview, transactions, categories, plans, auth, notFound | `ls src/features` → exactly those six | ✅ PASS |
| 2 | Layouts, Navbar and Toaster are in `src/app/layout/` | `src/app/layout/{MainLayout,AuthLayout,Navbar,Toaster}.tsx` (+ views) | ✅ PASS |
| 3 | Primitives are in `<family>/base/` | `src/components/*/base/` (button, input, table, toggle, toggleGroup, typography, …) | ✅ PASS |
| 4 | `MemberDot`, `memberColors`, `TransactionTypeToggle` at the root | `src/components/memberDot/`, `src/components/transactionTypeToggle/`, `src/utils/` | ✅ PASS |
| 5 | `features/**` importing `@/features/*` is a lint error | `eslint.config.js:47-52,196`; `eslint.config.test.ts:241` row `features/overview` → `@/features/plans/...` - `expect(restricted).toBe(true)`. Probe: reported (`no-restricted-imports`) | ✅ PASS |
| 6 | `components/**` importing `@/features/*` or `@/app/*` (other than providers and `routing/paths`) is a lint error | `eslint.config.js:37-42`; `eslint.config.test.ts:241` AC 6 rows (`@/app/home/homeParams` true, `@/app/providers/useTheme` false, `@/app/routing/paths` false). Probe: `@/app/layout/Navbar` from `src/components/x` → reported | ✅ PASS |
| 7 | `components/**/base/**` importing `@/features/*`, `@/app/*` or `@/api/*` is a lint error | `eslint.config.js:198-201`; `eslint.config.test.ts:241` AC 7 rows (all true; `@/lib/mergeClasses` false); `:212` fragment-per-layer table | ✅ PASS |
| 8 | Importing `@/app/layout/*` or `@/app/routing/*` (except `paths`) from outside `app/` is a lint error | `eslint.config.test.ts:241` AC 8 rows (`@/app/layout/Navbar`, `@/app/routing/AppRouter` true; `paths`, providers false). Design decision 4 makes it stricter (all of `@/app/*`) | ✅ PASS |
| 9 | `lib/` holds only adapters, and `filterStorage` lives with its state | `src/lib/` = `mergeClasses.ts`, `storage.ts`, `styleWithVariables.ts`; `src/app/home/filterStorage.ts` | ✅ PASS |

### STD-06 Shared components and tokens

| AC | Spec-defined outcome | Evidence | Result |
| -- | -------------------- | -------- | ------ |
| 1 | `ToggleGroup` (tone + chip) replaces the five hand-built toggles | `src/components/toggleGroup/base/ToggleGroup.tsx`; `src/features/categories/components/CategoryFormSheet.test.tsx:167` (limit mode payload); stories for `TransactionTypeToggle`, `AttributionFields`, `MemberFilterChips` and `CategoryLimitFields` | ✅ PASS |
| 2 | The selected item has `aria-pressed="true"`; arrow keys move focus | `src/components/toggleGroup/base/ToggleGroup.stories.tsx:55-58` - `userEvent.keyboard("{ArrowRight}")` → `expect(Month).toHaveFocus()`; `src/components/transactionTypeToggle/TransactionTypeToggle.stories.tsx:43-49` - `toHaveAttribute("aria-pressed", "true")`; `CategoryFormSheet.test.tsx:159` - `expect(single.getAttribute("aria-pressed")).toBe("true")` | ✅ PASS |
| 3 | Installments use `NumberField`, min 1, step 1 | `src/features/transactions/components/InstallmentsField.tsx:51-52,72-73` (`min={1}`, `step={1}`) | ✅ PASS |
| 4 | Typing 1,2,3,4 shows R$ 0,01 → R$ 12,34 and the form gets 12.34 | `src/components/input/currencyDigits.test.ts` ("enters 1 / 12 / 123 / 1234 from the right"); `src/features/transactions/components/TransactionFormDrawer.test.tsx:144-161` - input value `"R$ 12,34"` and `expect(await sentBody(requests,"POST")).toEqual({… amount: 12.34 …})`; `src/components/input/CurrencyInput.test.tsx:41` - `toEqual({ amount: 12.34 })` | ✅ PASS |
| 5 | Pasted or typed non-digits are ignored | `src/components/input/currencyDigits.test.ts:25` - `expect(parseCurrencyDigits(typed)).toBe(expected)`, including `"R$ 12,34"` → `12.34` | ✅ PASS |
| 6 | Money is formatted only through `formatMoney`, from one locale/currency source; the currency → locale table is gone | `src/utils/money.ts:5-27`; `src/utils/money.test.ts:8` - `expect(MONEY_LOCALE).toBe("pt-BR")`, `expect(MONEY_CURRENCY).toBe("BRL")`. `grep Intl.NumberFormat\|"pt-BR"\|"BRL"` in `src` finds only `money.ts` and one story fixture (`src/components/table/base/TableParts.stories.tsx:90`, `toLocaleString("pt-BR")`, cosmetic) | ✅ PASS |
| 7 | `Amount`: debit "- " + destructive, credit success, monospace; used by the mobile list and the table | `src/components/amount/Amount.tsx:19-24`; consumers `TransactionMobileList.tsx`, `TransactionCells.tsx`, `CategorySpendingList.tsx`; stories Debit / Credit / Zero / LargeValue | ✅ PASS |
| 8 | Both sheets render through `FormSheet` | `src/features/categories/components/CategoryFormSheet.tsx` and `src/features/transactions/components/TransactionFormDrawer.tsx` render `<FormSheet`; `CategoryFormSheet.test.tsx:189` - `expect(onOpenChange).toHaveBeenCalledWith(false)` and no non-GET request | ✅ PASS |
| 9 | Auth pages use `AuthCard` and `PasswordInput`, plain-text button labels, `FieldError errors={[…]}` | 8 `AuthCard` / `PasswordInput` uses in `src/features/auth/*Page.tsx`; `src/features/auth/ForgotPasswordPage.test.tsx:13` (13 tests cite AC 9); `FieldError` only through `FormField` | ✅ PASS |
| 10 | One `PlanNameDialog` with a required `mode` | `src/features/plans/components/PlanNameDialog.tsx` (discriminated union); `PlanNameDialog.test.tsx:22` | ✅ PASS |
| 11 | Role decisions read `usePlanPermissions()`; no direct `myRole` comparison | `src/hooks/usePlanPermissions.ts:123-141`; `usePlanPermissions.test.ts:52` - `toEqual(expected)` over the `PlanAuthorization` matrix; `grep "myRole ==="` outside the hook finds nothing (`PlanMembersList.tsx:24,29` compares other members' roles) | ✅ PASS |
| 12 | All capabilities are false while the plan or role is loading | `usePlanPermissions.test.ts:56,60` - `toEqual(NONE)` while loading and with no active plan | ✅ PASS |
| 13 | `--warning` / `--warning-foreground` exist in both modes; amber and Badge greens use tokens | `src/index.css:25-26,92-93,161-162` | ✅ PASS |
| 14 | A raw palette class is a lint error that names the token to use | `eslint.config.js:74-81` (message lists the tokens); `eslint.config.test.ts:298` - `toHaveLength(2)`. Probe: `text-amber-600` in a feature and `bg-green-100` in `base/` → `no-restricted-syntax` | ✅ PASS |

### STD-07 Form decomposition

| AC | Spec-defined outcome | Evidence | Result |
| -- | -------------------- | -------- | ------ |
| 1 | `transactionForm.ts` and `categoryForm.ts` exist, each with a sibling test | `src/features/transactions/components/transactionForm.ts` + `.test.ts` + `.series.test.ts`; `src/features/categories/components/categoryForm.ts` + test | ✅ PASS |
| 2 | Mutations and series flow live in `useTransactionFormSubmit` / `useCategoryFormSubmit` | `useCategoryFormSubmit.test.ts:59` - `expect(sent(requests)).toEqual([["POST", API]])`; `useTransactionFormSubmit.test.ts` covers each scope and a cancelled prompt | ✅ PASS |
| 3 | `useFieldArray` for items, `memberLimits` and participants | `ItemsField.tsx`, `CategoryLimitFields.tsx`, the drawer's participants (T81/T82/T87); `grep "watch("` in `src` returns nothing; `transactionForm.test.ts:548` (remainder helper) | ✅ PASS |
| 4 | End date and installments are one component each, shared by create and series edit | `EndDateField.tsx`, `InstallmentsField.tsx` (`mode: create \| seriesEdit`) | ✅ PASS |
| 5 | The last-installment preview comes from a tested helper | `transactionForm.ts:280-292`; `transactionForm.series.test.ts:522` - `expect(lastInstallment(july, 12, 3)).toEqual({ number: 12, month: new Date(2027, 3, 15) })`. Mutants M16 and M17 killed | ✅ PASS |
| 6 | The existing drawer and sheet tests pass, adapted only in imports and value entry | Both suites pass; the task notes (T61, T68, T70, T71) record value-entry changes and new cases only | ✅ PASS |

### STD-08 Typography

| AC | Spec-defined outcome | Evidence | Result |
| -- | -------------------- | -------- | ------ |
| 1 | `Heading` / `Text` in `typography/base/` share the seven-variant scale | `src/components/typography/base/{Heading,Text}.tsx`, `typographyVariants.ts` | ✅ PASS |
| 2 | A raw `<p>` / `<h1>`–`<h6>` outside `base/` is a lint error | `eslint.config.js:98-103`; `eslint.config.test.ts:380,388`. Probe: `<p className="text-sm">` in a feature → `no-restricted-syntax` | ✅ PASS |
| 3 | Size and weight classes outside `base/` are errors; alignment and `font-mono` are allowed | `eslint.config.js:88-95`; `eslint.config.test.ts:380` - `expect(messages).toHaveLength(2)`; `:421` (`base/` free). Probe: `text-center font-mono` → no error | ✅ PASS |
| 4 | Page titles use `PageHeader`, section titles `SectionHeader`, help text `FieldDescription` | `src/components/pageHeader/`, `sectionHeader/`; T90–T95 notes | ✅ PASS |
| 5 | Variants name a role, not a screen | `typographyVariants.ts` variants: display, headline, title, label, body, secondary, caption | ✅ PASS |

### STD-09 Mechanical conventions

| AC | Spec-defined outcome | Evidence | Result |
| -- | -------------------- | -------- | ------ |
| 1 | `func-style: declaration`; arrows only as inline callbacks | `eslint.config.js:181-185`; `eslint.config.test.ts:103` - `expect(config.rules["func-style"]).toEqual([...])`, `:130` (inline callbacks allowed). Probe: top-level `export const Probe = () => …` → `func-style` | ✅ PASS |
| 2 | No spec IDs in comments | `grep -rnE "(CAT\|UX\|NAV\|STD\|AD\|M5)-[0-9]+" src` outside tests and stories returns nothing | ✅ PASS |
| 3 | Every `//` comment explains a reason | Spot-checked (e.g. `findracoApi.ts:8-11,37-38,100,104`; `CurrencyInput.tsx:59,80-81`; `HomeFiltersGate.tsx:37-38,68,73-74`): all explain a reason | ⚠️ Spec-precision gap (SP-2: checked by review only) |

### STD-10 Story coverage

| AC | Spec-defined outcome | Evidence | Result |
| -- | -------------------- | -------- | ------ |
| 1 | Every non-container component file has a sibling story | `scripts/check-siblings.ts:117-138`; `scripts/check-siblings.test.ts:24` - `expect(findMissingStories(srcDir)).toEqual(["components/card/Card.tsx"])`; the real gate passes | ✅ PASS |
| 2 | A missing story fails `npm test` and CI, naming the file | `check-siblings.ts:300-314` (exit code 1); scratch: `Amount.stories.tsx` removed → `Component files without a sibling .stories.tsx: src/components/amount/Amount.tsx`, exit 1 | ✅ PASS |
| 3 | Each story file covers variants, states, extreme content and a mobile viewport where the layout changes | Spot-check: `Amount.stories.tsx` (Debit / Credit / Zero / LargeValue), `TransactionMobileList.stories.tsx` (Loading / Empty / ManyLongRows / Desktop), `FormSheet.stories.tsx` (Idle / Submitting / SubmitUnavailable / WithMobileActions / LongContentScrolls / Mobile) | ⚠️ Spec-precision gap (SP-1: content is not checked mechanically) |
| 4 | A container with its own visual is split into container + view | `check-siblings.ts:281-287`; `check-siblings.test.ts:119` - `expect(findContainersWithMarkup(srcDir)).toEqual([...])`; scratch: a `useNavigate` container rendering `<div>` → `Containers rendering HTML elements … ProbeContainer.tsx (<div>)`, exit 1 | ✅ PASS |

### STD-11 Test coverage

| AC | Spec-defined outcome | Evidence | Result |
| -- | -------------------- | -------- | ------ |
| 1 | Every logic `.ts` module and hook with logic has a sibling test; DTO, type and constant modules are exempt | `check-siblings.ts:182-263`; `check-siblings.test.ts:157` - `expect(findMissingTests(srcDir)).toEqual(["utils/probe.ts"])` for each kind of decision point | ✅ PASS (⚠️ SP-4: `===` alone is not "logic") |
| 2 | A missing test fails `npm test` and CI, naming the file | Scratch: `usePlanPermissions.test.ts` removed → `Logic modules without a sibling .test.ts: src/hooks/usePlanPermissions.ts`, exit 1 | ✅ PASS |
| 3 | Branch coverage of logic below 90% fails `npm test` | `vite.config.ts:75-82` (`branches: 90, perFile: true`); scratch: the two AC 12 cases deleted → `ERROR: Coverage for branches (75%) does not meet global threshold (90%) for src/hooks/usePlanPermissions.ts`, exit 1 | ✅ PASS |
| 4 | The threshold does not apply to components, stories, DTOs or types | `vite.config.ts:78-79` (`include: src/**/*.ts`, excluding tests, handlers, `src/test`, `.d.ts`). Type-only modules emit no branches | ✅ PASS |

### STD-12 Transactions tab and the logic cap

| AC | Spec-defined outcome | Evidence | Result |
| -- | -------------------- | -------- | ------ |
| 1 | `TransactionsTab` delegates to `useTransactionSearch`, `useTransactionActions`, `useCsvImport` and `transactionSort.ts`; the inline-save payload comes from a mapper in `transactionForm.ts` | `src/features/transactions/TransactionsTab.tsx:21-25`; `transactionForm.ts:397` (`toInlineSavePayload`); `TransactionsTab.test.tsx:120`; mutants M18 and M19 killed | ✅ PASS |
| 2 | Paged responses convert through `toPagination` in `src/api/utils/` | `TransactionsTab.tsx:111`; `src/api/utils/toPagination.test.ts:18` - `toEqual({... first: true ...})`; M20 killed | ✅ PASS |
| 3 | A PascalCase function **returning JSX** with more than 60 logic lines before its main return is a lint error | `eslint/rules/componentLogicCap.ts`; `componentLogicCap.test.ts:32` (60 lines valid), `:60-62` - `errors: tooLong("Summary", 61)`. Probes: 60 lines → clean, 61 → reported, 61 inside `memo(function …)` → reported, 60 lines + 60 comments + 60 blank lines → clean. **Gap:** a 70-line component that ends with `const content = <span/>; return content;` (or `return renderIt();`) is not reported. `isJsx` (`componentLogicCap.ts:15-24`) only recognises a JSX literal in the `return` argument. Nothing in today's code uses this pattern (I checked by widening `isJsx` in scratch and re-linting `src`) | ❌ GAP (the rule can be evaded) |
| 4 | An IIFE in JSX is a lint error | `eslint/rules/noJsxIife.ts:119-120`; `noJsxIife.test.ts:34,44`. Probe: `{(() => a * 2)()}` → `local/no-jsx-iife` | ✅ PASS |
| 5 | RuleTester covers 60 and 61 lines, a non-component and an IIFE in JSX | `componentLogicCap.test.ts:32,34,60`; `noJsxIife.test.ts:34` | ✅ PASS |

**Status**: ❌ 2 AC gaps (STD-04 AC 3 discrimination, STD-12 AC 3 evasion); ⚠️ 5 spec-precision gaps flagged.

---

## Edge Cases

- [x] A lint regex flagging a legitimate class is adjusted for everyone: no per-file bypass exists (bypass scan below). The palette regex ends in `-\d`, so neutral tokens pass.
- [x] A container misclassified by the story gate gets split, not exempted: `findContainersWithMarkup` blocks containers that render markup.
- [x] Tests move with their subjects: the unit count went from 35 files / 356 tests to 82 / 748, with nothing removed according to the task notes.
- [x] A reinstalled shadcn primitive fails lint until converted: probes show `func-style` and the palette ban both fire inside `base/`.
- [x] Flaky Storybook runs are fixed, not retried: no `retry` or `retries` setting in `vite.config.ts` or `.storybook`. `maxWorkers: "25%"` (`vite.config.ts:65`) treats the CPU starvation that caused the flakiness.
- [x] STD-12 is merged before mobile-navigation: it is in the HEAD commit.

---

## Gate Check

- **Gate command**: `pnpm lint && pnpm build && pnpm test` from `frontend/`, at `d3bbee5`, real tree
- **Lint**: exit 0
- **Build** (`tsc -b && vite build`): exit 0. Vite's chunk-size warning is pre-existing and does not block.
- **Test**: exit 0
  - `check-siblings.ts`: exit 0
  - `unit` + coverage: 82 files, **748 passed**, 0 failed, 0 skipped. Branches 97.98% overall; the lowest per-file figure is `periodNavigator.ts` at 90%.
  - `tooling` + `storybook`: 95 files, **632 passed** (tooling: 4 files, 173 tests; storybook: 91 files, 459 tests), 0 failed, 0 skipped
- **Backend** `./mvnw -B test`: exit 0, 118 tests, 0 failures, 0 errors, 0 skipped
- **Test count before feature**: `unit` 35 files / 356 tests (tasks.md baseline before T10)
- **Test count after feature**: `unit` 748 + `tooling` 173 + `storybook` 459 = 1380
- **Delta**: +1024
- **Skipped tests**: none
- **CI**: the last 4 pushed runs are green (39180075199 at `d8bf3e0` ran frontend, backend, changes and deploy, all successful). HEAD `d3bbee5` and the 32 commits before it are **not pushed**, so CI has not seen them.

---

## Discrimination Sensor

Expanded tier: this feature guards the whole frontend. All mutations ran in a temporary `git worktree` under the scratchpad, using `pnpm install --offline`. Each mutant was applied, its tests were run, and the file was restored; afterwards the worktree was removed. Real-tree `git status --porcelain` was empty before and is empty after (match).

| # | File:line | Mutation | Tests run | Result |
| - | --------- | -------- | --------- | ------ |
| M1 | `src/components/input/currencyDigits.ts:24` | `/ 100` → `/ 10` | currencyDigits + CurrencyInput | ✅ Killed (16 failed) |
| M2 | `currencyDigits.ts:21` | strip non-digits → keep `,` | same | ✅ Killed (14) |
| M3 | `currencyDigits.ts:22` | `slice(0, 15)` → `slice(-15)` | same | ✅ Killed (1) |
| M4 | `currencyDigits.ts:23` | drop the `deleting` → null case | same | ✅ Killed (3) |
| M5 | `src/utils/money.ts:35` | `Math.round` → `Math.floor` in `toCents` | money | ✅ Killed (1) |
| M6 | `money.ts:26` | ignore `compact` | money | ✅ Killed (4) |
| M7 | `src/hooks/usePlanPermissions.ts:135` | `canAttributeToOthers`: EDITOR → CONTRIBUTOR | usePlanPermissions | ✅ Killed (2) |
| M8 | `usePlanPermissions.ts:126` | no plan → EDITOR permissions | same | ✅ Killed (2) |
| M9 | `src/api/clients/findracoApi.ts:108` | retry without `sessionRetried` | findracoApi | ✅ Killed, but by a hang: the retry loop never ended (runaway memory) and I stopped the worker after about 2.5 min. See gap 3 |
| M10 | `findracoApi.ts:101` | flip the renewal-401 → `SessionExpiredError` check | findracoApi | ✅ Killed (2) |
| M11 | `findracoApi.ts:53` | `??=` → `=` (no shared renewal) | findracoApi | ✅ Killed (2) |
| M12 | `src/hooks/useSearchParamGroup.ts:44` | update `replace: true` → `false` (push) | useSearchParamGroup | ✅ Killed (1) |
| M13 | `useSearchParamGroup.ts:18` | stop removing the group's old keys | same | ✅ Killed (3) |
| M14 | `src/app/home/HomeFiltersGate.tsx:18` | drop the transaction keys from the home keys | HomeFiltersGate | ✅ Killed (10) |
| M15 | `HomeFiltersGate.tsx:78` | never restore saved filters | same | ✅ Killed (5) |
| M16 | `transactionForm.ts:291` | `lastInstallment` month off by one | transactionForm (+ series) | ✅ Killed (3) |
| M17 | `transactionForm.ts:288` | preview for a 1-installment series | same | ✅ Killed (1) |
| M18 | `useTransactionActions.ts:70` | series delete scope forced to `"ALL"` | useTransactionActions | ✅ Killed (2) |
| M19 | `useTransactionActions.ts:84` | delete without confirmation | same | ✅ Killed (1) |
| M20 | `src/api/utils/toPagination.ts:155` | `first` from page 1 | toPagination | ✅ Killed (3) |
| M21 | `eslint/rules/componentLogicCap.ts:95` | `count > max` → `>=` | componentLogicCap (tooling) | ✅ Killed (3) |
| M22 | `componentLogicCap.ts:76` | count comment lines too | same | ✅ Killed (1) |
| M23 | `componentLogicCap.ts:91` | main return `findLast` → `find` | same | ➖ Survived, but equivalent: two top-level `return`s in one block only differ when the second is unreachable. Not counted |
| M24 | `scripts/check-siblings.ts:161` | `??` no longer counts as logic | check-siblings (tooling) | ✅ Killed (2) |
| M25 | `check-siblings.ts:36` | type-only imports make a container | same | ✅ Killed (1) |
| M26 | `check-siblings.ts:237` | logic searched at the top level only | same | ✅ Killed (22) |
| M27 | `check-siblings.ts:271` | `<div>` not counted as markup | same | ✅ Killed (1) |
| M28 | `src/test/unhandledRequests.ts:19` | `requests.length === 0` → `<= 1` (one unhandled request is ignored) | unhandledRequests | ❌ **Survived** (3/3 pass) |
| M29 | `src/test/setupUnit.ts:18` | remove `unhandledRequests.assertNone()` | whole `unit` project | ❌ **Survived** (748/748 pass) |

**Sensor depth**: expanded, 29 behaviour-level mutants (M9 needed a manual stop).
**Result**: 26 killed, 1 equivalent, **2 survived** - FAIL ❌. Both survivors protect STD-04 AC 3 ("fail a test on any request without a handler"). That behaviour is real today (checked in scratch), but a regression there would go unnoticed.

---

## Payload / conjunction rule

Tests that check request bodies compare the whole payload by value (for example `TransactionFormDrawer.test.tsx:156-162`: `toEqual({ type, description, amount: 12.34, startDate: stringMatching(...), items: [] })`, and `useCategoryFormSubmit.test.ts` checks method + URL + body). 22 test files capture traffic with `recordRequests()`. The 11 bare `toHaveBeenCalledTimes` checks are call counts sitting next to value assertions; none of them replaces a payload check. ✅

---

## Behaviour preservation

The stated exceptions hold: B1 `aria-pressed` and arrows, the B2 `NumberField`, a11y fixes (the `--warning` amber-800 contrast, the Success toggle contrast, the "Filter by member" label) and the decision 7 table. The task notes record **user-visible changes that are in none of those lists**. They are small and plausibly side effects of the scale or of the composition, but the spec says nothing may change silently, so they need UAT confirmation:

1. Combobox trigger text loses Button's `font-medium`; SeriesScopeDialog helper text loses `FieldLabel`'s weight (T94). This is typography, but these rows are not in decision 7's table.
2. Reset password: each password field now has its own visibility toggle; before, one toggle revealed both (T75).
3. `PlanNameDialog` is now a `<form>`, so Enter submits (T76).
4. `EndDateField` validation follows the form's mode (re-validates on change after the first submit) instead of on every pick (T83).
5. `ToggleGroup` default height raised to `h-9` to match `Button` (T63), which changes the size of the five replaced toggles.
6. Plans' `SectionHeader` consumer renders `h2` instead of `span` (T91). This is semantic and improves a11y.

---

## Bypass scan (`frontend/src`, `scripts`, `eslint`, `.storybook`, config)

| Pattern | Hits |
| ------- | ---- |
| `eslint-disable`, `@ts-ignore`, `@ts-expect-error`, `@ts-nocheck` | 0. The only hit is the explanatory comment at `eslint.config.js:148` |
| `.skip` / `.only` / `.todo` in tests | 0. `RuleTester.itOnly = it.only` in both rule tests only connects RuleTester to Vitest; no case sets `only: true` |
| Raised timeouts or retries | No test or global timeout is raised, and no retries are configured. `TransactionsTab.test.tsx:137` uses `waitFor(..., { timeout: 2000 })` for a 400 ms debounce, which is reasonable. `retry: 1` in `useTransactionFilterChips.test.tsx:75` exercises the hook's own retry rule |
| `any` | 0. The only hit is a comment at `src/components/table/Table.tsx:18` explaining why it is avoided |
| ` as ` casts (excluding `as const` and import aliases) | Only in three tests that still `vi.mock` `findracoApi`: `useTransactionFilterChips.test.tsx:24,41,47`, `useOverviewMemberFilter.test.tsx:16`, `useAuthSession.test.tsx:46` (see gap 4) |

---

## Code Quality

| Principle | Status |
| --------- | ------ |
| Minimum code | ✅ (local rules about 110 + 30 lines, gate script about 320 lines, each with tests) |
| Surgical changes | ✅ (backend: only the `FindracoApplicationTests` → `FindracoApplicationIT` rename) |
| No scope creep | ✅ (STD-13 and STD-14 untouched) |
| Matches patterns | ✅ (lint itself enforces the patterns) |
| Spec-anchored outcome check | ⚠️ 2 gaps (above) |
| Per-layer coverage expectation | ✅ logic ≥ 90% branches per file; flows covered through MSW for the touched ACs |
| Every test maps to a requirement | ✅ test names cite STD ACs or design decisions (sampled) |
| Documented guidelines followed | ✅ `CLAUDE.md`, `.claude/skills/frontend-testing`, `.specs/codebase/TESTING.md`, apart from the residual `vi.mock` (gap 4) |

---

## Spec-precision gaps

- **SP-1 (STD-10 AC 3)**: story *content* (variants, states, extreme content, mobile) is checked by review only; the gate checks only that the file exists. I spot-checked three files and they comply.
- **SP-2 (STD-09 AC 3)**: whether a comment explains "why" is checked by review only (E5 accepts this). The comments I sampled comply.
- **SP-3 (STD-04 AC 4)**: the AC limits the MSW migration to "service-hook tests". Hook tests outside `api/services` still `vi.mock` our modules: `useAuthSession.test.tsx` (created in STD-12 when `AuthProvider` was split), `useOverviewMemberFilter.test.tsx`, `useTransactionFilterChips.test.tsx`, and `PrivateRoute.test.tsx` (mocks `useAuth`). The spec does not say whether these count as "flow tests" under the frontend-testing rule.
- **SP-4 (STD-11 AC 1)**: "logic" is whatever design decision 8 defines. A module whose only computation is a comparison (`toPagination`: `page.page === 0`) does not count as logic, so the gate would accept it without a test. It has one anyway (required by STD-12 AC 2 and the design).
- **SP-5 (STD-02 AC 6)**: "every context provider" does not say whether file-private compound-component contexts count. `src/components/chart/base/Chart.tsx:28` and `src/components/toggleGroup/base/ToggleGroup.tsx:15` keep a private context in a primitive file; neither exports a hook or a provider, so Fast Refresh is unaffected.
- **STD-03 AC 4** is shown only by replaying the CI shell step locally; no docs-only push has run on GitHub yet.

---

## Fix Plans

### Fix 1: The unhandled-request guard has no test that discriminates (M28, M29) - Major

- **Root cause**: `unhandledRequests.test.ts` checks only two-request and zero-request cases, and nothing checks that `setupUnit.ts`'s `afterEach` calls `assertNone()`.
- **Fix task**:
  - Add a recorder case with exactly one recorded request that expects a throw.
  - Test the wiring. Two options: move the `afterEach` body into an exported function in `src/test/` and test it with a server that receives one unmocked request, or add a `tooling` test that runs Vitest's `unit` project on a fixture test file making an unmocked request and asserts a failing exit and the "Requests without an MSW handler" message.
- **Done when**: M28 and M29 re-run in scratch are killed.

### Fix 2: The logic cap misses components that return JSX through a variable or a call (STD-12 AC 3) - Major

- **Root cause**: `componentLogicCap.ts:15-24` (`isJsx`) treats a function as a component only when a `return` argument is a JSX literal, or a conditional or logical expression containing one.
- **Fix task**: recognise a PascalCase function as a component when its body contains JSX, or when its main `return` hands back an identifier bound to JSX or a call. Add RuleTester cases: a 61-line component ending `return content;`, and one ending `return renderX();`. Update the skill's definition if the criterion changes. D4 says "no escape".
- **Done when**: both new cases are reported, existing cases unchanged, `pnpm lint` still green.

### Fix 3: A broken session retry hangs the suite instead of failing (M9) - Minor

- **Fix task**: give `findracoApi.test.ts`'s always-401 scenario a request counter or a test-level timeout, so that a missing `sessionRetried` fails fast with an assertion.
- **Done when**: M9 fails in seconds.

### Fix 4 (Minor, optional): residual `vi.mock` of our modules

Migrate `useAuthSession.test.tsx`, `useOverviewMemberFilter.test.tsx`, `useTransactionFilterChips.test.tsx` and `PrivateRoute.test.tsx` to MSW and `renderWithProviders`, or resolve SP-3 in the spec.

---

## Requirement Traceability Update (proposed; spec.md not edited by the Verifier)

| Requirement | Previous Status | New Status |
| ----------- | --------------- | ---------- |
| STD-01, 02, 03, 05, 06, 07, 08, 09, 10, 11 | Done | ✅ Verified |
| STD-04 | Done | ❌ Needs Fix (AC 3 discrimination: M28, M29) |
| STD-12 | Done | ❌ Needs Fix (AC 3 evasion) |
| STD-13 | Deferred | Deferred (out of scope) |
| STD-14 | Pending | Pending, blocked (out of scope) |

---

## Summary (initial run)

**Overall**: ❌ Not Ready (small, bounded fixes)

**Spec-anchored check**: 71/75 ACs matched the spec outcome; 2 gaps (STD-04 AC 3, STD-12 AC 3); 2 ACs held at spec-precision (STD-09 AC 3, STD-10 AC 3); 5 spec-precision notes in total
**Sensor**: 26/28 non-equivalent mutants killed (29 injected, 1 equivalent, 2 survived)
**Gate**: lint 0, build 0, test 0 (748 unit + 632 tooling/storybook passed, 0 failed, 0 skipped); backend 118 passed

**What works**: every lint guarantee fires (inline disables ignored, `@ts-*` reported, cross-feature and layer imports, palette, raw `<p>` and size/weight classes, top-level arrows, IIFE in JSX, a 61-line component). The sibling, container-markup and per-file coverage gates fail with the file named. CI gates the deploy and skips it on a failure. The husky hooks block commits. The money, permissions, session-refresh, URL-state, form-mapper and delete-scope logic all has discriminating tests.

**Issues found**: Fix 1 (M28/M29), Fix 2 (logic-cap evasion), Fix 3 (hang instead of failure), plus behaviour changes for UAT and residual `vi.mock` usage.

**Next steps**: route Fixes 1–3 to an implementer, re-run the Verifier (iteration 1 of 3), push so CI runs on the 33 unpushed commits, and confirm the six behaviour changes in UAT.

---

## Iteration 1 re-verification

**Date**: 2026-10-19
**Fix range**: `a63e4d7..cc2bcea` (5 commits, T132–T136). HEAD is `cc2bcea`.
**Verifier**: a new independent sub-agent. It did not write the fixes.
**Scope**: a focused re-check. It covers gaps 1–3, Fix 4 (SP-3), the ACs the fixes touch, new mutants on the fixed code, and a bypass scan of the fix range. The ACs not touched by the fixes keep their initial-run evidence.

### Gates (real tree, `frontend/`, at `cc2bcea`)

- **Lint** (`pnpm lint`): exit 0
- **Build** (`pnpm build`): exit 0
- **Test** (`pnpm test`): exit 0
  - `check-siblings.ts`: exit 0
  - `unit` + coverage: 83 files, **751 passed**, 0 failed, 0 skipped (748 → 751: one recorder case and two setup-guard cases). Branch coverage is 97.98% overall.
  - `tooling` + `storybook`: 95 files, **637 passed**, 0 failed, 0 skipped (632 → 637: five new `componentLogicCap` RuleTester cases)
- **Backend**: not re-run, because the fix range touches no backend file.

### Discrimination sensor (scratch worktree)

All mutants ran in a temporary `git worktree` at `cc2bcea` under the scratchpad, after `pnpm install --offline`. Each file was restored after its run, and the worktree was removed at the end. The real tree's `git status --porcelain` was empty before and after (match).

| # | File:line | Mutation | Tests run | Result |
| - | --------- | -------- | --------- | ------ |
| M28 (re-run) | `src/test/unhandledRequests.ts:19` | `requests.length === 0` → `<= 1` | `src/test/` | ✅ Killed (3 failed: `throws naming a single recorded request` and both `setupUnit.test.ts` cases) |
| M29 (re-run) | `src/test/setupUnit.ts:18` | remove `unhandledRequests.assertNone()` | `src/test/` | ✅ Killed (2 failed: `setupUnit.test.ts:14` `it.fails` now passes, so it is reported as a failure, and `:23` gets `[]`) |
| M9 (re-run) | `src/api/clients/findracoApi.ts:108` | retry without `sessionRetried: true` | findracoApi | ✅ Killed **fast**: `does not retry a retried request a second time` failed in 12 ms (whole file 1.1 s, 3 s wall time). The third `/plans` call gets 500, so `toMatchObject({ response: { status: 401 } })` fails |
| N1 | `eslint/rules/componentLogicCap.ts` `markJsx` | mark only the innermost frame, so nested JSX is ignored | componentLogicCap (tooling) | ✅ Killed (1 failed: `a component returning a render call at 61 lines`) |
| N2 | `componentLogicCap.ts` listeners | delete `JSXFragment: markJsx` | componentLogicCap (tooling) | ❌ **Survived** (18/18 pass). No RuleTester case has a component whose only JSX is a fragment. The behaviour works today: a probe of a 61-line component ending `return <>{a}</>;` through `eslint --stdin` in the real tree is reported. Nothing protects it |
| N3 | `src/test/setupUnit.ts:21` | drop `unhandledRequests.reset()` in `finally` | `src/test/` | ✅ Killed (1 failed: `names the request in that failure`) |
| N4 | `findracoApi.ts:108` | allow exactly one extra retry (`sessionRetried: config.sessionRetried !== undefined`) | findracoApi | ✅ Killed (1 failed, 11 ms) |

**Sensor depth**: focused re-check: 3 re-runs and 4 new mutants.
**Result**: 6 killed, 1 survived (N2). FAIL.

### AC evidence for the fixes

| AC | Evidence (`file:line` + assertion) | Result |
| -- | ---------------------------------- | ------ |
| STD-04 AC 3 (an unhandled request fails the test) | `src/test/unhandledRequests.test.ts:11-19` puts one request in the recorder and expects `toThrow(/^Requests without an MSW handler \(add one with server\.use\):\nGET http:\/\/localhost\/api\/findraco\/plan$/)`. `src/test/setupUnit.test.ts:14` is an `it.fails` test that swallows the error from an unmocked `fetch`. `:23` then checks `expect(failures).toEqual([\`Requests without an MSW handler (add one with server.use):\nGET ${UNHANDLED_URL}\`])`, which pins both the wiring and the message. M28, M29 and N3 are killed | ✅ PASS (⚠️ residual R2) |
| STD-04 AC 4 (service-hook tests go through MSW; 401 → refresh → retry) | `grep -rn "vi.mock(" src --include=*.test.ts*` finds only two hits, both of the third-party `sonner`: `src/features/transactions/components/useCsvImport.test.ts:12` and `src/api/utils/buildMutationOptions.test.ts:15`. None of our modules is mocked in a flow or hook test. `useAuthSession.test.tsx` now uses `authHandlers.*` (e.g. `:110` `expect(paths(requests)).toEqual(["POST /auth/refresh", "GET /user/me"])`, `:218` `toBe("Bearer login-token")`). `PrivateRoute.test.tsx`, `useOverviewMemberFilter.test.tsx` and `useTransactionFilterChips.test.tsx` pass explicit context values; their only `vi.fn()` are context callbacks. Retry bound: `src/api/clients/findracoApi.test.ts:221` (`plansAttempts > 2` → 500), with `:232` `toHaveLength(2)` and `:233` `toHaveLength(1)` | ✅ PASS. SP-3 resolved in practice |
| STD-12 AC 3 (a PascalCase function returning JSX with more than 60 logic lines is an error) | `eslint/rules/componentLogicCap.test.ts:83` `returnsVariable(logic(60))` → `errors: tooLong("Summary", 61)`. `:88` `returnsCall(logic(58))` (with a 3-line local `renderContent`) → `tooLong("Summary", 61)`. `:71` keeps a PascalCase function with no JSX and 80 lines valid. N1 is killed. The `JSXFragment` path is untested (N2) | ❌ GAP (N2 survives) |
| STD-12 AC 5 (60 lines is allowed) | `componentLogicCap.test.ts:64` `returnsVariable(logic(59))` (59 + `const content` = 60) is valid, and `:68` `returnsCall(logic(57))` (57 + 3 = 60) is valid. The original 60/61 cases are unchanged | ✅ PASS |
| STD-06 AC 6 (money through `formatMoney`) | `src/components/table/base/TableParts.stories.tsx:91` `amount: formatMoney(987654.32 + index)`; no `toLocaleString` is left in the file | ✅ PASS |

### Residuals

- **R1: a component whose only JSX comes from a module-level render function is not recognised.** Probe: a 61-line `Summary` that ends `return renderContent(a);`, with `renderContent` declared at module level in the same file, is not reported (`eslint --stdin`, real tree). **Judgement: an acceptable residual, not blocking.**
  - Only a deliberate workaround reaches this case. The component must have no JSX of its own and hand all of its markup to a camelCase function outside it. Ordinary drift does not produce that shape. Review catches it more easily than an inline `return content;`, because the markup visibly lives outside the component.
  - Today's code does not use the pattern. `grep -E "^(export )?function render[A-Z]" src/**/*.tsx` finds no module-level render helpers.
  - For an imported helper, the rule would need analysis across files. The task note overstates the limit for the same-file case, though. That case needs no type or call-graph analysis: the callee is a `FunctionDeclaration` in the same `Program`, so it can be resolved by name. **Optional hardening for iteration 2:** treat a PascalCase function as a component when its main `return` calls a same-file function that contains JSX, and add one RuleTester case.
- **R2: the two `setupUnit.test.ts` cases depend on their order.** `names the request in that failure` reads state that the `it.fails` case writes. If the second case runs alone, it fails: `vitest run src/test/setupUnit.test.ts -t "names the request"` gives 1 failed and 1 skipped. The gate runs the whole file in declaration order and `vite.config.ts` does not configure `sequence.shuffle`, so the gate is sound. Someone filtering with `-t`, or a future shuffle setting, would see a false failure. Not blocking. A one-line comment would help, or `describe.sequential`, or making the second case skip itself when the first did not run.

### Bypass scan (fix range `a63e4d7..cc2bcea`, added lines)

| Pattern | Result |
| ------- | ------ |
| `eslint-disable`, `@ts-` | none |
| ` as ` casts (other than `as const`) | none. The 5 casts from gap 4 left with the `vi.mock` removal |
| `.skip`, `.only` | none. `it.fails` (`setupUnit.test.ts:14`) is an inverted expectation, not a skip; M29 proves it fails when the guard is gone |
| Raised timeouts or retries | none. T134 bounds the loop with a counter, not a timeout |

### Fix Plan (iteration 2)

**Fix 5: give the logic cap's fragment path a test (N2), Minor but blocking.**

- **Task**: add a RuleTester `invalid` case for a 61-line component whose only JSX is a fragment, for example `return <>{value}</>;`, and a matching 60-line `valid` case.
- **Optional**: add R1 same-file render-helper resolution and the R2 order note in the same pass.
- **Done when**: N2 (delete `JSXFragment: markJsx`) is killed in scratch and `pnpm lint` and `pnpm test` stay green.

### Requirement Traceability Update (proposed)

| Requirement | Status after iteration 1 |
| ----------- | ------------------------ |
| STD-04 | ✅ Verified (AC 3 and AC 4 discriminate; SP-3 resolved) |
| STD-12 | ❌ Needs Fix (AC 3: N2 survivor) |
| Others | unchanged from the initial run |

### Iteration 1 summary

**Overall**: ❌ Not Ready. One small blocking gap remains (iteration 1 of 3 used).
**Gate**: lint 0, build 0, test 0 (751 unit + 637 tooling/storybook passed, 0 failed, 0 skipped)
**Sensor (iteration 1)**: 7 mutations: 6 killed, 1 survived (N2)
**Closed**: gap 1 (M28, M29), gap 2 (`return content;` and `return renderX();` with a local helper), gap 3 (M9 now fails in 12 ms), Fix 4 / SP-3 (no `vi.mock` of our modules)
**Open**: Fix 5 (N2). Residuals R1 and R2 do not block.
