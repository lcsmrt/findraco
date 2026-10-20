# Mobile Navigation Validation

## Validation: PASS

**Date**: 2026-10-19
**Spec**: `.specs/features/mobile-navigation/spec.md`
**Diff range**: `1a64e44..HEAD` (HEAD = `5ccf3bc`, 24 commits, 83 files)
**Verifier**: independent sub-agent (author ≠ verifier), re-verify pass 2

The previous pass (HEAD `d2d32c1`) failed on NAV-01 only: mutants M10 (bar not `fixed`) and M11
(active item not coloured) survived, and AC 8 and the "form covers the bar" edge case had no
evidence. Since then `07f79fd` amended spec and design (`primary-ink`; AC 8 and the cover edge case
declared hand checks under the TESTING.md gate policy; "New plan"), `d21b70f` changed the
container rule in `scripts/check-siblings.ts` and removed `RouterLink.tsx`, and `5ccf3bc` added
the two assertions. All four gaps are closed. M10, M11 and two mutants on the new rule are killed.
The gate is green.

---

## Task Completion

| Task | Status | Notes |
| ---- | ------ | ----- |
| T1-T21 | ✅ Done | All `[x]` in `tasks.md`. Commits `d84f446`..`d2d32c1`, fixes `07f79fd`..`5ccf3bc` |

---

## Spec-Anchored Acceptance Criteria

### NAV-01 Bottom navigation bar

| Criterion | Spec-defined outcome | `file:line` + assertion | Result |
| --------- | -------------------- | ----------------------- | ------ |
| AC 1: narrow, bar fixed to the viewport bottom, order Overview, Transactions, +, Categories, Plans | Exact order; fixed | Order: `frontend/src/app/layout/BottomBarView.stories.tsx:49` - `expect(itemNames(bar)).toEqual(["Overview","Transactions","New Transaction","Categories","Plans"])` (390px). Fixed: `frontend/src/app/layout/MainLayoutView.stories.tsx:87` - `expect(getComputedStyle(bar).position).toBe("fixed")` | ✅ PASS (M10 killed) |
| AC 2: narrow, no top tab row | Tab row absent | `frontend/src/app/layout/MainLayoutView.stories.tsx:78` - `queryByRole("navigation",{name:"Destinations"})` `toBeNull()` | ✅ PASS |
| AC 3: icon + visible label per destination | Label visible | `frontend/src/app/layout/BottomBarView.stories.tsx:57` - `expect(within(bar).getByText(label)).toBeVisible()` for the four labels. Icon is an `aria-hidden` svg, not asserted | ✅ PASS (icon is markup detail; gate policy, low) |
| AC 4: current item in `primary-ink` and `aria-current="page"` | `aria-current` on exactly the current item; `primary-ink` colour | `frontend/src/app/layout/BottomBarView.stories.tsx:59-60` - `toHaveAttribute("aria-current","page")`, `toHaveLength(1)`; `:76,:83,:90` per destination; `frontend/src/app/layout/MainLayout.test.tsx:177` after navigation. Colour: `:64` - active link `color` `toBe(tokenColor("--primary-ink"))`, `:65` label same colour, `:66` inactive Plans `.not.toBe(activeColor)` | ✅ PASS (M11 killed; spec now says `primary-ink`, matching `BottomBarView.tsx:70`) |
| AC 5: tap Overview/Transactions/Categories → that path with its saved filters | Path; restored filters | `frontend/src/app/layout/MainLayout.test.tsx:176` - `expect(pathname).toBe(path)` (it.each `:165-170`); `:187-189` - search box value `toBe("mercado")` from `filters:transactions:1:5` | ✅ PASS |
| AC 6: tap Plans → `/plans` | `/plans` | `frontend/src/app/layout/MainLayout.test.tsx:176` (row `["Plans","/plans"]`) | ✅ PASS |
| AC 7: stays visible while scrolling; page reserves bar height | Last row above the bar at scroll end; bar pinned to viewport | `frontend/src/app/layout/MainLayoutView.stories.tsx:83-85` - after `scrollTo(bottom)`, last row `bottom` `toBeLessThanOrEqual(bar.top)`; `:87` `position` `toBe("fixed")`; `:88` `Math.round(bar.bottom)` `toBe(view.innerHeight)` | ✅ PASS (M9, M10 killed) |
| AC 8: bottom padded by `env(safe-area-inset-bottom)` | Hand check (spec AC 8: "Checked by hand on a phone: the inset is 0 in the test browser") | Spec-declared hand check; implementation `frontend/src/app/layout/BottomBarView.tsx:28` has `pb-[env(safe-area-inset-bottom)]` | ✅ Hand check (per TESTING.md "Gate policy") |

### NAV-02 Add a transaction from anywhere

| Criterion | Spec-defined outcome | `file:line` + assertion | Result |
| --------- | -------------------- | ----------------------- | ------ |
| AC 1: wide, "New Transaction" in the tab row on the four screens | Button in tab row | `frontend/src/app/layout/TabRowView.stories.tsx:134-135` - click `New Transaction`, `expect(args.onAdd).toHaveBeenCalledTimes(1)` (desktop viewport); `frontend/src/app/layout/MainLayout.test.tsx:233` uses the tab-row button on /overview | ✅ PASS |
| AC 2: add opens New Transaction for the active plan, type Expense | Dialog "New Transaction", Debit pressed | `frontend/src/app/layout/MainLayout.test.tsx:221-223` - `findByRole("dialog",{name:"New Transaction"})`, Debit `aria-pressed` `toBe("true")`, Credit `toBe("false")` | ✅ PASS |
| AC 3: form closes, user stays, toast "Transaction added." ("Series created." for series) | Exact strings; same path | `frontend/src/app/layout/MainLayout.test.tsx:236-238` - dialog gone, `pathname` `toBe("/overview")`, `toast.success` `toHaveBeenCalledWith("Transaction added.")`; `:251-252` for /plans; series: `frontend/src/api/services/useFinancialTransactionService.test.ts:344` - `toHaveBeenCalledWith("Series created.")` | ✅ PASS (series at service level only) |
| AC 4: refresh transaction, dashboard and category data | Invalidate `financialTransactions`, `categoryUsage`, `categorySpending`, `dashboardSummary`, `dashboardTrend` | `frontend/src/api/services/useFinancialTransactionService.test.ts:205` - `expect(invalidated(queryClient)).toMatchObject(transactionData)` (all five keys `true`; same on update/delete/import/series at `:246,:274,:309,:343,...`); flow: `frontend/src/app/layout/MainLayout.test.tsx:239` - dashboard GET count `toHaveLength(2)` | ✅ PASS (payload: every key asserted by value) |
| AC 5: VIEWER sees no add | No "New Transaction" button anywhere | `frontend/src/app/layout/MainLayout.test.tsx:275` - `queryByRole("button",{name:"New Transaction"})` `toBeNull()` | ✅ PASS |
| AC 6: add hidden → four destinations evenly spaced | 4 items, equal width filling the bar | `frontend/src/app/layout/BottomBarView.stories.tsx:98-102` - names `toEqual([4 labels])`, one rounded width, `widths[0]*4 === bar width`; `frontend/src/app/layout/MainLayout.test.tsx:276` - 4 links | ✅ PASS |
| AC 7: failed create keeps the form with its values, no success toast | Values kept; `toast.success` not called | `frontend/src/app/layout/MainLayout.test.tsx:265-268` - Description `toBe("Groceries")`, Amount `toBe("R$ 12,34")`, `toast.success` `not.toHaveBeenCalled()`; `frontend/src/api/services/useFinancialTransactionService.test.ts:221-229` nothing invalidated | ✅ PASS |
| AC 8: Transactions toolbar has no "New Transaction" | Absent | `frontend/src/features/transactions/TransactionsPage.test.tsx:128` - `queryByRole("button",{name:"New Transaction"})` `toBeNull()` | ✅ PASS |

### NAV-03 Plans as a destination

| Criterion | Spec-defined outcome | `file:line` + assertion | Result |
| --------- | -------------------- | ----------------------- | ------ |
| AC 1: wide tab row order Overview, Transactions, Categories, Plans | Exact order | `frontend/src/app/layout/TabRowView.stories.tsx:124-129` - link texts `toEqual([...])` | ✅ PASS |
| AC 2: tab row on the four screens, current marked active | `aria-current="page"` on current | `frontend/src/app/layout/TabRowView.stories.tsx:130-131,142,149,156`; `frontend/src/app/layout/MainLayout.test.tsx:195,200` | ✅ PASS |
| AC 3: Plans tab → `/plans` | `/plans` | `frontend/src/app/layout/MainLayout.test.tsx:199` - `expect(pathname).toBe("/plans")` | ✅ PASS |
| AC 4: no "Back" on Plans | Absent | `frontend/src/features/plans/PlansPageView.stories.tsx:41` - `queryByRole("button",{name:"Back"})` `toBeNull()` | ✅ PASS |
| AC 5: no "Manage plans", keep "New plan" | Manage plans absent; create item present | `frontend/src/features/plans/components/PlanSwitcherView.stories.tsx:32-33` - `menuitem "New plan"` visible, `"Manage plans"` `toBeNull()` | ✅ PASS (spec amended to "New plan" in `07f79fd`) |
| Edge: accept-invitation shows no bar and no tab row | Both absent | `frontend/src/app/layout/MainLayout.test.tsx:208-210` - both navigations `toBeNull()` | ✅ PASS |

### NAV-04 Toolbar cleanup

| Criterion | Spec-defined outcome | `file:line` + assertion | Result |
| --------- | -------------------- | ----------------------- | ------ |
| AC 1: no "Manage Categories" | Absent | `frontend/src/features/transactions/TransactionsPage.test.tsx:129` - `toBeNull()` | ✅ PASS |
| AC 2: search, filters, import kept | Present | `frontend/src/features/transactions/TransactionsPage.test.tsx:125-127` - three `getByRole` present | ✅ PASS |

### NAV-05 Short success messages

| Criterion | Spec-defined outcome | `file:line` + assertion | Result |
| --------- | -------------------- | ----------------------- | ------ |
| AC 1, 2: every service success toast per the design table | Exact strings, 21 mutations | Transactions: `frontend/src/api/services/useFinancialTransactionService.test.ts:206,247,275,310,344,378,409`. Categories: `frontend/src/api/services/useFinancialTransactionCategoryService.test.ts:418-429` (it.each of 3). Plans: `frontend/src/api/services/usePlanService.test.ts:82,101,124,177,196,215,235`. Invitations: `frontend/src/api/services/useInvitationService.test.ts:28,38,48`. Auth: `frontend/src/api/services/useAuthService.test.ts:88` ("Account created."), `:138` (reset unchanged). All `toast.success` `toHaveBeenCalledWith(<exact string>)` | ✅ PASS (latent: `frontend/src/api/utils/buildMutationOptions.ts:39` keeps the fallback "Operation completed successfully."; no service reaches it today) |

### NAV-06 One address per screen

| Criterion | Spec-defined outcome | `file:line` + assertion | Result |
| --------- | -------------------- | ----------------------- | ------ |
| AC 1: four paths | `/overview`, `/transactions`, `/categories`, `/plans` | `frontend/src/app/routing/AppRouter.test.tsx:124-154` - each screen's own control plus `pathname` `toBe(path)`; `frontend/src/app/layout/navigation.test.ts:3-9` - `DESTINATION_PATHS` `toEqual({...})` | ✅ PASS |
| AC 2: no params → last filters or defaults, per screen | Saved query per screen, or only `plan` | `frontend/src/app/routing/PlanFiltersGate.test.tsx:339-356` - `params()` `toEqual({plan:"5",q:"market"})` / `{plan:"5",period:"last-3m"}` / `{plan:"5"}` | ✅ PASS |
| AC 3: saving one screen leaves the others alone | Other entry unchanged | `frontend/src/app/routing/PlanFiltersGate.test.tsx:376-377`; `frontend/src/app/routing/filterStorage.test.ts:34-40` | ✅ PASS |
| AC 4: plan switch stays on screen with that plan's filters | Same path; new plan's saved params | `frontend/src/app/routing/PlanFiltersGate.test.tsx:388-389` - pathname `/transactions`, params `{plan:"5",member:"3"}`; flow `frontend/src/app/layout/MainLayout.test.tsx:288` | ✅ PASS |
| AC 5: link with filter params applies them and activates a member plan | Plan 4 active; params kept | `frontend/src/app/routing/PlanFiltersGate.test.tsx:397-400` | ✅ PASS |
| AC 6: `/` → `/overview` | Redirect | `frontend/src/app/routing/AppRouter.test.tsx:117-121` - `pathname` `toBe("/overview")`; login fallback `frontend/src/features/auth/LoginPage.test.tsx:75-83` | ✅ PASS |

**Status**: ✅ All ACs have discriminating evidence or a spec-declared hand check.

Line refs for NAV-02..06 were spot-checked against HEAD: between `d2d32c1` and `5ccf3bc` only
`BottomBarView.stories.tsx`, `MainLayoutView.stories.tsx`, `BottomBarView.tsx`, `TabRowView.tsx` and
`RouterLink.tsx` changed under `src/`. The `BottomBarView.stories.tsx` refs were updated (NAV-02 AC 6
now `:98-102`). The previous report's `MainLayoutView.stories.tsx` refs (`:244`, `:247-251`,
`:208-215`) were wrong for a 90-line file; corrected above and below.

---

## Edge Cases

- [x] Role/plan not loaded → no add: `frontend/src/app/layout/MainLayout.test.tsx:291-296`
- [x] Switch to a VIEWER plan hides add without reload: `frontend/src/app/layout/MainLayout.test.tsx:279-289`
- [x] Save on Plans stays on Plans: `frontend/src/app/layout/MainLayout.test.tsx:242-253`
- [x] The form covers the bottom bar on narrow screens: spec-declared hand check (spec edge case: "Checked by hand: it follows from the overlay layer (`z-50`) sitting above the bar (`z-20`)"). Structure: `frontend/src/components/sheet/base/Sheet.tsx:28,53` (`z-50`), `frontend/src/app/layout/BottomBarView.tsx:28` (`z-20`)
- [x] Accept-invitation page without navigation: `frontend/src/app/layout/MainLayout.test.tsx:203-211`, `frontend/src/app/layout/MainLayoutView.stories.tsx:46-47`

---

## Previous Gaps (pass 1)

| # | Gap | Now |
| - | --- | --- |
| 1 | `fixed` not discriminated (AC 1, AC 7) | ✅ Closed: `MainLayoutView.stories.tsx:87-88`; M10 killed (`Expected "fixed", Received "static"` at `:87`) |
| 2 | Active colour unasserted; token differed from spec (AC 4) | ✅ Closed: spec/design amended to `primary-ink` (`07f79fd`); `BottomBarView.stories.tsx:64-66`; M11 killed (`Expected rgb(161, 74, 7), Received rgb(107, 103, 94)` at `:64`) |
| 3 | AC 8 safe-area no evidence | ✅ Closed: spec AC 8 declares a hand check, as TESTING.md "Gate policy" prescribes for insets |
| 4 | Form covers bar no evidence | ✅ Closed: spec edge case declares a hand check (stacking order, per gate policy) |

## Container Rule Change (`d21b70f`)

Genuine rule change, not a workaround. `frontend/scripts/check-siblings.ts:10-14,71-76`: a
`react-router-dom` import makes a file a container only if it binds a `use*` hook, `Routes` or
`Outlet`, or binds the whole module (namespace/default/`export *`, conservatively). `Link`,
`NavLink` and `Navigate` no longer do. The rule applies to the whole codebase, and
`RouterLink.tsx` (the pass-1 workaround) is deleted; `TabRowView.tsx` and `BottomBarView.tsx`
import `Link` directly. Tests: `frontend/scripts/check-siblings.test.ts:47-55` (a view rendering only
`Link` still needs a story, and is not a container with markup) and `:102-110` (our helper built on
`useLocation` makes its user a container). Both mutants on the rule are killed (M13, M14). Low note:
the `Routes`/`Outlet` branch has no dedicated unit test; it is exercised only by the real tree
(`AppRouter.tsx`, `MainLayout.tsx`, `AuthLayout.tsx`) through `node scripts/check-siblings.ts` in the
gate.

---

## Discrimination Sensor

Scratch: a temporary `git worktree` of HEAD under the session scratchpad, deps from
`pnpm install --offline --frozen-lockfile --ignore-scripts` (real node_modules, no symlink; no husky).
The real tree's `git status --porcelain` showed only the untracked `validation.md` before and after;
`core.hooksPath` unchanged (`frontend/.husky/_`). The worktree was removed and pruned.

Pass 1 (HEAD `d2d32c1`):

| # | File:line | Mutation | Tests run | Killed? |
| - | --------- | -------- | --------- | ------- |
| M1 | `frontend/src/api/services/useFinancialTransactionService.ts:32` | Drop `dashboardSummary` from `invalidateTransactionData` | service test + MainLayout.test | ✅ Killed (9 failed) |
| M2 | `frontend/src/app/layout/navigation.ts:33` | `currentDestination` falls back to `"overview"` instead of `null` | navigation.test + MainLayout.test | ✅ Killed (4 failed) |
| M3 | `frontend/src/app/routing/AppRouter.tsx:32` | `/` redirects to `/plans` | AppRouter.test | ✅ Killed |
| M4 | `frontend/src/app/layout/MainLayout.tsx:22` | `onAdd = openAdd` (ignore role) | MainLayout.test | ✅ Killed (3 failed) |
| M5 | `frontend/src/app/routing/filterStorage.ts:6` | Storage key without the screen | filterStorage + PlanFiltersGate + MainLayout tests | ✅ Killed (31 failed) |
| M6 | `frontend/src/api/services/useFinancialTransactionService.ts:88` | Toast back to "Transaction created successfully." | service test + MainLayout.test | ✅ Killed (3 failed) |
| M7 | `frontend/src/app/routing/PlanFiltersGate.tsx:37` | `activePlanSwitched = false` | PlanFiltersGate + MainLayout tests | ✅ Killed (3 failed) |
| M8 | `frontend/src/app/layout/BottomBarView.tsx:61` | `active = destination !== current` | BottomBarView + MainLayoutView stories | ✅ Killed (4 failed) |
| M9 | `frontend/src/app/layout/MainLayoutView.tsx:23` | Remove the bottom padding reservation | stories | ✅ Killed |
| M10 | `frontend/src/app/layout/BottomBarView.tsx:28` | Remove `fixed` | stories | ❌ Survived (pass 1) |
| M11 | `frontend/src/app/layout/BottomBarView.tsx:70` | Active item never coloured | stories | ❌ Survived (pass 1) |
| M12 | `frontend/src/app/layout/BottomBarView.tsx:32` | Always `grid-cols-5` | BottomBarView stories | ✅ Killed |

This pass (HEAD `5ccf3bc`; baseline BottomBarView + MainLayoutView stories 2 files / 9 tests passing):

| # | File:line | Mutation | Tests run | Killed? |
| - | --------- | -------- | --------- | ------- |
| M10 | `frontend/src/app/layout/BottomBarView.tsx:28` | Remove `fixed` from the bar | BottomBarView + MainLayoutView stories | ✅ Killed (With Navigation Mobile, `MainLayoutView.stories.tsx:87`) |
| M11 | `frontend/src/app/layout/BottomBarView.tsx:70,74` | Link always `text-muted-foreground`, label without `text-primary-ink` | same stories | ✅ Killed (Overview Active, `BottomBarView.stories.tsx:64`) |
| M13 | `frontend/scripts/check-siblings.ts:75` | `importsRouterHook` returns `true` for any router import (`Link` a container again) | check-siblings.test + `node scripts/check-siblings.ts` | ✅ Killed (1 test failed: "does not exempt a view that only renders router components"; script exit 1 on the real tree) |
| M14 | `frontend/scripts/check-siblings.ts:75` | Drop the `use*` clause (`useNavigate` no longer a container) | check-siblings.test + `node scripts/check-siblings.ts` | ✅ Killed (5 tests failed; script exit 1) |

**Sensor depth**: expanded (main navigation, data refresh, container rule)
**Sensor outcome**: all current mutants killed. Cumulative 14 distinct mutants; M10 and M11 survived pass 1 and are killed now

---

## Gate Check

- **Gate command**: `pnpm lint && pnpm build && pnpm test` (from `frontend/`), exit 0
- **Result**: lint clean; build ok (chunk-size warning only); sibling gate clean; unit 86 files / 791 tests passing (with coverage thresholds); tooling + storybook 96 files / 651 tests passing; 0 failed, 0 skipped
- **Test count before feature**: unit 83 / 752 (T1); tooling + storybook 95 / 643 (T6)
- **Test count after feature**: unit 86 / 791; tooling + storybook 96 / 651
- **Delta**: +39 unit, +8 tooling/storybook (+2 since pass 1: the two new check-siblings tests; the story assertions were added inside existing plays). No assertions weakened.

---

## Code Quality

| Principle | Status |
| --------- | ------ |
| Minimum code / surgical / no scope creep | ✅ Fix commits touch only the gaps and the rule |
| Matches patterns | ✅ Container/view split, services via `buildMutationOptions`, MSW handler factories |
| Spec-anchored outcome check | ✅ Every AC asserted or a spec-declared hand check |
| Per-layer coverage | ✅ |
| Every test maps to a requirement | ✅ |
| Guidelines followed: `CLAUDE.md`, `.claude/skills/frontend-testing/SKILL.md`, no lint/TS bypasses | ✅ `RouterLink.tsx` workaround replaced by a rule change |

Low notes (outside the verdict): AC 3 icon not asserted (markup detail); `Routes`/`Outlet` rule
branch has no dedicated unit test; `frontend/src/api/utils/buildMutationOptions.ts:39` keeps the
generic fallback toast, unreachable today.

---

## Requirement Traceability Update

| Requirement | Previous Status | New Status |
| ----------- | --------------- | ---------- |
| NAV-01 | ❌ Needs Fix | ✅ Verified (AC 8 hand check) |
| NAV-02 | ✅ Verified | ✅ Verified (cover edge case hand check) |
| NAV-03 | ✅ Verified | ✅ Verified |
| NAV-04 | ✅ Verified | ✅ Verified |
| NAV-05 | ✅ Verified | ✅ Verified |
| NAV-06 | ✅ Verified | ✅ Verified |

(The Verifier does not edit `spec.md`. The orchestrator applies these statuses.)

---

## Summary

**Overall**: ✅ Ready

**Spec-anchored check**: 35 AC rows; 34 asserted against the spec outcome, 1 spec-declared hand check (NAV-01 AC 8); edge cases 4 asserted, 1 hand check.
**Sensor**: this pass 4/4 killed (M10, M11, M13, M14); cumulative 14/14 killed at HEAD
**Gate**: exit 0. unit 791 passed; tooling + storybook 651 passed

**Hand checks for UAT**: safe-area inset on a phone (NAV-01 AC 8); New Transaction form covers the bar on a narrow screen.
