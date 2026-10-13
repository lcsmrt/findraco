# Categories Revamp Validation

## UX polish round — iteration 2

### Validation: categories-revamp UX polish round - PASS

**Result**: PASS (UX polish round, iteration 2). Both iteration-1 gaps are closed with evidence, mutant B3 is now killed, 6/6 fresh and re-run mutants are killed, and every gate is green.

**Date**: 2026-10-12
**Spec**: `.specs/features/categories-revamp/spec.md`, "Amendment: UX polish round" (UX-01..UX-05)
**Diff range**: `93b900e..HEAD` (HEAD `e01ef64`). Fix diff re-checked: `f776269..HEAD` = `afa8453` (F6) + `e01ef64` (F7); 5 files, only `CategorySpendingAssemblerTest.java`, `spendingRows.ts`, `spendingRows.test.ts`, `CategorySpendingList.tsx` and `tasks.md`
**Verifier**: independent sub-agent (author ≠ verifier), UX round iteration 2 of max 3

#### Task completion

F6 and F7 ("Fix tasks (UX verification iteration 1)" in `tasks.md`) are marked done with their Done-when boxes checked. U1–U12 are unchanged since iteration 1.

#### Gaps from iteration 1

| Gap | Evidence | Result |
| --- | -------- | ------ |
| 1. UX-04 AC 1: `active` of a spend-only former member on a non-owned row (mutant B3) | `CategorySpendingAssemblerTest.java:636` `formerMembersSpendOnAPlainCategoryIsListedInactive`: plain category, `activeMemberIds = {MEMBER}`, spend by `OTHER_MEMBER` with no entry. `:643` `getSpent()` `isEqualByComparingTo("40")`, `:644` `getLimit()` `isNull()`, `:645` `isActive()` `isFalse()`, `:646` the active member `isTrue()`. Matches the spec outcome (spend, own limit null, active flag) | ✅ closed |
| 2. Cosmetic: focused member with no spend in a row drew a grey dot | `spendingRows.ts:58` `MemberFocus.color`, set at `:245` `color: colorOf(selectedMember.id)` independent of segments; `CategorySpendingList.tsx:129` `<MemberDot color={row.focus.color} />` (the `focusColor` fallback chain is removed). `spendingRows.test.ts:326` Rent with spend only by Lucas, Livia selected → `focus` `toEqual({…, color: colorOf(LIVIA), spent: 0, of: 1500, sharedLimit: 1500})`; `:283` the same for a member with spend | ✅ closed |

#### Regression spot-check (UX ACs touched by the fix diff)

- UX-04 AC 1: the other member-list assertions are unchanged (`CategorySpendingAssemblerTest.java:569` owned-row former member inactive, `:585`, `:616`, and the owned case after `:646`) and pass (33/33).
- UX-04 AC 7: `spendingRows.test.ts:283` keeps the full focus shape (`spent 694, of 1745, sharedLimit 2000`) plus the colour; `:302` (85% warning) and `:316` (dormant entry) are untouched and green. `focus` is read only in `CategorySpendingList.tsx:127-132`; text and shared-limit rendering are unchanged.
- No other UX AC's code or tests are in `f776269..HEAD`, so iteration 1's other passes stand (the full frontend and backend suites re-ran green below).

**Status**: ✅ All UX ACs covered (51/51). The 2 spec-precision gaps from iteration 1 (UX-04 AC 7 on owned rows, UX-05 AC 8 non-month labels) are unchanged and non-blocking, as recorded there.

#### Discrimination sensor

Each mutant ran in a temporary `git worktree` at HEAD (`node_modules` symlinked; backend `./mvnw -o test -Dtest=CategorySpendingAssemblerTest`), reverted after each run, and the worktree was removed. Real-tree `git status --porcelain` before = after = empty (baseline matched).

| # | File:line | Mutation | Killed? |
| - | --------- | -------- | ------- |
| B3 (re-run) | `CategorySpendingAssembler.java:162` | `null, limits.activeMemberIds().contains(member))` → `null, true)` | ✅ (1 failed: `CategorySpendingAssemblerTest.java:645`) |
| B4 | `CategorySpendingAssembler.java:186` | owned row: member `active` → always `true` | ✅ (1 failed: `formerMembersShareInAnOwnedCategoryIsListedInactive`) |
| M13 | `spendingRows.ts:245` | F7: focus colour → `"var(--muted-foreground)"` (the old grey) | ✅ (2 failed) |
| M14 | `spendingRows.ts:245` | F7: focus colour → `colorOf(row.ownerId ?? 0)` (wrong member) | ✅ (2 failed) |
| M15 | `summaryView.ts:52` | dimmed `person.userId !== memberId` → `===` (highlight inverted) | ✅ (1 failed) |
| M16 | `categoryTree.ts:43` | drop the A–Z sort of children | ✅ (1 failed) |

**Sensor depth**: expanded. **Sensor result** — 6/6 killed, PASS.

#### Gate check

| Gate | Command | Result |
| ---- | ------- | ------ |
| Frontend tests | `npm run test` | 27 files, **318 passed**, 0 failed, 0 skipped (F7 edits 2 assertions, adds none) |
| Frontend build | `npm run build` | exit 0 |
| Frontend lint | `npm run lint` | 23 errors / 44 warnings, the same pre-existing 23 errors as iteration 1 (0 new) |
| Backend | `./mvnw verify` (from `backend/`) | exit 0: unit **96 passed**, IT **152 passed**, 0 failed, 0 skipped; JaCoCo "All coverage checks have been met". `dev_finsight` emptied (accepted) |

**Test count**: backend unit +1 (`CategorySpendingAssemblerTest` 32 → 33). The per-class sum is 96 (PlanAuthorization 24, Assembler 33, RecurringGenerator 16, SeriesRegenerator 9, ItemShareAllocator 7, SplitResolver 6, app 1); iteration 1's "101 unit" was a miscount (95 then). No test was removed or weakened.

#### Code quality

F6 is test-only. F7 is minimal: one field on `MemberFocus`, one assignment, and a removed fallback helper; it matches the existing `color` fields on `MemberSubRow`/owner. ✅

#### Requirement traceability (UX round)

| Requirement | Status |
| ----------- | ------ |
| UX-01 | ✅ Verified |
| UX-02 | ✅ Verified |
| UX-03 | ✅ Verified |
| UX-04 | ✅ Verified (AC 1 gap closed) |
| UX-05 | ✅ Verified |

#### Summary

**Overall**: ✅ Ready, pending the interactive UAT for the UX round.
**Spec-anchored check**: 51/51 ACs matched; 2 non-blocking spec-precision gaps (unchanged).
**Sensor**: 6/6 killed (B3 now killed).
**Gate**: frontend 318 passed, build ok, lint 23 existing errors; backend 96 unit + 152 IT passed, JaCoCo met.

---

## UX polish round — iteration 1

### Iteration 1 verdict (superseded by iteration 2): FAIL

**Iteration 1 outcome** — FAIL (UX polish round, iteration 1). 50/51 UX ACs are traced to a passing assertion or to confirmed presentational code, all gates are green, and 15 of 16 effective mutants are killed. One mutant survives: the new members rule in `CategorySpendingAssembler` can report a spend-only former member as active and no test notices (UX-04 AC 1, "whether they are an active member"). One small fix task closes it.

**Date**: 2026-10-12
**Spec**: `.specs/features/categories-revamp/spec.md`, "Amendment: UX polish round" (UX-01..UX-05)
**Diff range**: `93b900e..HEAD` (HEAD `3215362`, U1–U12, 12 commits, 48 files)
**Verifier**: independent sub-agent (author ≠ verifier), UX round iteration 1 of max 3

#### Task completion

U1–U12 are all marked done in `tasks.md` with their gates recorded. Nothing is blocked or partial.

#### Gate check

| Gate | Command | Result |
| ---- | ------- | ------ |
| Frontend tests | `npm run test` | 27 files, **318 passed**, 0 failed, 0 skipped |
| Frontend build | `npm run build` | exit 0 (only the existing chunk-size warning) |
| Frontend lint | `npm run lint` | 23 errors / 44 warnings. All 23 errors are in files that already had them; none is in a file this round touched (`CategoryFormSheet.tsx` and `TransactionFormDrawer.tsx` have warnings only) |
| Backend | `./mvnw verify` (from `backend/`) | exit 0: unit **101 passed**, IT **152 passed**, 0 failed, 0 skipped; JaCoCo check met. This run emptied `dev_finsight`, which is accepted for this gate. It ran after the screenshots, so the `@ux.test` seed data is gone now |

**Test count**: the frontend went from 269 at `93b900e` (measured in a scratch worktree) to 318 (+49). U9 removed 11 Categories-codec cases (`homeFilterParams.test.ts`) and replaced them with 3 cases for the amended outcome (`homeFilterParams.test.ts:216-239`). This removal is justified: UX-01 AC 1 removes the codec. The backend changes update superseded assertions to the amended outcome. None is weakened: `CategorySpendingAssemblerTest.java:332,479,569` and `CategorySpendingIT.java:83,241` now assert the extra member rows by value (spent, null limit, active). The new tests are `CategorySpendingAssemblerTest.java:585,616,636`, `CategorySpendingIT.java:284` and `DashboardTrendIT` (5 cases).

#### Spec-anchored acceptance criteria

Legend: ✅ the assertion matches the spec outcome and ran green. 🖥 presentational: the Test Coverage Matrix gates it on the build only, so it was confirmed by reading the component and by headless screenshots (Playwright, 390 and 1280 px, `lucas@ux.test` OWNER and `livia@ux.test` non-owner, before the backend gate wiped the data). ⚠️ spec-precision gap.

##### UX-01 Categories tab is management-only

| AC | Spec outcome | Evidence | Result |
| -- | ------------ | -------- | ------ |
| 1 | No period, spend, percent or bars | The period codec is gone: `homeFilterParams.test.ts:226` asserts `"parseCategoriesFilters" in homeFilterParams` is false, and `:216` checks that legacy params are ignored. `CategoriesTab.tsx:105` reads only `useGetFinancialTransactionCategories`, with no spending hook. Screenshots at 390 and 1280 show no period, spend or bars | ✅ + 🖥 |
| 2 | Wide: name, owner, monthly limit, per-member absolute amounts in aligned columns, "—" when empty | `CategoryTreeRow.tsx:14` grid columns, `:170-188` with `EMPTY = "—"`. The 1280 screenshot shows "Lucas R$ 600,00 · Livia R$ 400,00" and "—" | 🖥 |
| 3 | Always expanded; roots A–Z, children A–Z under them, tree guide | `categoryTree.test.ts:85` `toEqual(["bills","Food","Leisure","transport"])` and `:103` children grouped and sorted. `CategoryTreeRow.tsx:22` TreeGuide. There are no chevrons in the screenshots | ✅ |
| 4 | Non-OWNER: same rows, no actions | `CategoriesTab.tsx:101` `canManage = myRole === "OWNER"` gates the New button, the icons and the tap button (`CategoryTreeRow.tsx:190,230`). For `livia@ux.test` at 1280, 0 Edit/Delete/New buttons were found while hovering | 🖥 |
| 5 | Former owner and per-member entries greyed as "former member" | `CategoryTreeRow.tsx:45-58` (`ownerActive === false`) and `:80-89` (`!entry.active`). No former member in the seed data, so this was confirmed by reading the code only | 🖥 |

##### UX-02 Row actions and mobile lists

| AC | Spec outcome | Evidence | Result |
| -- | ------------ | -------- | ------ |
| 1 | Wide + OWNER: hover or focus reveals Edit and Delete, plus New subcategory on roots | `CategoryTreeRow.tsx:189` `group-focus-within/row:opacity-100 group-hover/row:opacity-100`, and `:192` `!isChild` adds ＋. In the screenshot, hovering Food shows ＋ ✎ 🗑 | 🖥 |
| 2 | New subcategory opens the create form with that root as parent | `CategoryFormSheet.test.ts:190` `buildDefaultValues(null,{parentId:4},[],categories)` `toEqual({type:"CREDIT",…,parentId:4,…})`, and `:208` the schema accepts it. In the 1280 screenshot, clicking ＋ on Food opens "New Category" with Parent = Food | ✅ |
| 3 | Narrow + OWNER: tap opens edit; footer has Delete and, on a root, New subcategory | `CategoryTreeRow.tsx:230-240` mobile button calls `onEdit`. `CategoryFormSheet.tsx:572-595` has `sm:hidden` Delete and `editing.parentId == null` New subcategory. In the 390 screenshot, tapping Food opens the edit sheet with both buttons | 🖥 |
| 4 | Narrow Transactions: list grouped by day under a date heading; description, category, participants, signed amount | `groupByDay.test.ts:216` one group per day in page order, `:232` interleaved days, `:259` no UTC shift (TZ America/Sao_Paulo). `TransactionMobileList.tsx` shows the heading `EEE, d MMM yyyy`, "category · names" and "- R$". The 390 screenshot confirms it | ✅ + 🖥 |
| 5 | Narrow: tap opens edit; footer has Duplicate and Delete | `TransactionFormDrawer.tsx` has an edit-only `sm:hidden` footer, and `TransactionsTab.tsx` wires `handleDuplicate` and `handleDelete`. The 390 screenshot of "Market 2" shows Delete and Duplicate | 🖥 |
| 6 | Wide keeps the table, in-cell editing and hover icons | `TransactionsTab.tsx`: the table is moved unchanged into `hidden sm:block`. The 1280 screenshot shows the table | 🖥 |

##### UX-03 Overview spending list

| AC | Spec outcome | Evidence | Result |
| -- | ------------ | -------- | ------ |
| 1 | List (not chart); roots A–Z, children A–Z | `spendingRows.test.ts:74` `toEqual(["Food","rent"])` (CREDIT dropped) and `:75` `toEqual(["delivery","Restaurants"])`. `CategorySpendingChart.tsx` is deleted | ✅ |
| 2 | With a limit: "spent of limit", a bar and status; without one: spend, no bar, no track | `spendingRows.test.ts:123` `bar` `toBeNull()` for a no-limit row. `CategorySpendingList.tsx:95` " of {limit}" and `:146` bar only when `row.bar`. Gifts and Restaurants in the screenshots have no track | ✅ |
| 3 | over when spend > limit; warning when ≥ 80%; else ok | `spendingRows.test.ts:89-93`: 101/100 → "over", 100/100 → "warning", 80/100 → "warning", 79/100 → "ok", no limit → "none" | ✅ |
| 4 | ok "remaining X" muted; warning "⚠ remaining X" amber; over "▲ over by X" red | `spendingRows.test.ts:102-103` `{remaining:149,overBy:null}` / `{remaining:null,overBy:67}`. `CategorySpendingList.tsx:64-83` sets the muted, amber and destructive classes with TriangleAlert and Triangle icons. Confirmed in the screenshots | ✅ + 🖥 |
| 5 | Over: tick at the limit and the overflow hatched | `spendingRows.test.ts:133` `limitTickPct` ≈ 66.67 for 150/100, and `:142` null when within. `CategorySpendingList.tsx:41-53` draws the hatch and the tick. Visible on Delivery, Groceries and Repairs | ✅ |
| 6 | On load, a root with children is collapsed unless a child is warning or over | `spendingRows.test.ts:163` `defaultExpandedIds` equals exactly [warned, overChild]: a calm root and a root that is itself over are excluded. `CategorySpendingList.tsx:292` seeds the state, and the list mounts only after the data loads (`OverviewTab.tsx:130`) | ✅ |
| 7 | A click anywhere on a root with children toggles it | `CategorySpendingList.tsx:251-259`: the whole row is a `<button aria-expanded>` | 🖥 |
| 8 | Integer percentages | `spendingRows.test.ts:109` `percent` `toBe(87)` for 872.8/1000 | ✅ |
| 9 | Limits scaled to the period's months | `spendingRows.test.ts:178-180`: limit 1200 over 3 months, and sub-row limits `[780,420]` | ✅ |

##### UX-04 Per-person on the Overview

| AC | Spec outcome | Evidence | Result |
| -- | ------------ | -------- | ------ |
| 1 | Every member with spend or with an entry: spend, own limit (null without one), active | `CategorySpendingAssemblerTest.java:585` (Σ members == row, root and child, `limit` null, `isActive` true), `:616` (entry with no spend → spent 0, limit 140), `:636` (owned: owner and others, limit null). `CategorySpendingIT.java:284` `/spending` lists both members of a plain category with spend, null limit and active true. **Gap:** the `active` flag of a spend-only *former* member on a non-owned row is never asserted. Mutant B3 survives | ❌ GAP (partial) |
| 2 | Fixed colour per member, by position in members ordered by user id | `memberColors.test.ts:189-193` (input order irrelevant; indexes 0/1/2), `:200-202` (wraps modulo 6), `:207` (unknown → neutral) | ✅ |
| 3 | Unfiltered: segments in member colours sized by spend; a line with each member's spend | `spendingRows.test.ts:194-203`: segments `[[1,1051,"blue",false],[2,694,"pink",false]]`, Σ amount 1745, member line | ✅ |
| 4 | Per-member limits: always-visible sub-row per member with own status | `spendingRows.test.ts:216-218`: Lucas 250/260 "warning" remaining 10, Livia 150/140 "over" overBy 10. `CategorySpendingList.tsx:263` renders sub-rows outside the toggle | ✅ |
| 5 | Owned: owner pill and a bar in the owner's colour with the owner's spend | `spendingRows.test.ts:246-251`: owner `{memberId:2,…,color:"pink"}`, a single segment `[2,70,"pink"]` | ✅ |
| 6 | Selected member with own limit: their spend vs their limit | `spendingRows.test.ts:265`: `{spent:150,limit:140,status:"over",overBy:10}` | ✅ |
| 7 | Selected member without own limit: whole-category bar vs category limit, member highlighted, others dimmed, "<m> X of Y · shared limit L", never their share vs the whole limit | `spendingRows.test.ts:282-287` (row 1745/2000 warning; focus `{spent:694,of:1745,sharedLimit:2000}`; dimmed `[[1,true],[2,false]]`), `:302` (1700 → 85% warning, not Livia's 50%), `:316` (a dormant entry counts as no own limit). The 1280 member screenshot shows "Livia R$ 350,00 of R$ 760,00 · shared limit R$ 1.500,00". ⚠️ The spec is silent on owned rows with a member selected (author's choice is recorded in the U5 note) | ✅ ⚠️ |
| 8 | 2–4 members: chips "All" + dots; >4: combobox with dots; 1: none | `MemberFilterChips.tsx:192` (`<=1` → null), `:194` (`>4` → combobox with `renderItem` dots), and the chips otherwise. The screenshot shows "All · ● Lucas · ● Livia" | 🖥 |
| 9 | No By Person card | `PersonBreakdownList.tsx` is deleted and `OverviewTab.tsx` renders none | 🖥 |

##### UX-05 Overview summary, trend and period

| AC | Spec outcome | Evidence | Result |
| -- | ------------ | -------- | ------ |
| 1 | Income, Expenses, Balance; Income and Expenses each with a member-segmented bar and amounts | `summaryView.test.ts:88-99` (totals 5147/4450/697; segments ordered by id with colours; widths sum to 100) | ✅ |
| 2 | Selected member: their totals, segment highlighted | `summaryView.test.ts:105-115` (2414/2105/309; dimmed `[[1,true],[2,false]]`) | ✅ |
| 3 | Narrow: one block, Balance on top, Income and Expenses side by side; wide: three cards | `SummaryCards.tsx:109-135` (`sm:hidden` block / `hidden sm:grid sm:grid-cols-3`). Confirmed at 390 and 1280 | 🖥 |
| 4 | Grouped Income/Expense bars for the 6 months ending at the period's last month, or the whole period if longer; after the list | `trendMonths.test.ts:207` (Oct → May–Oct), `:211` (12-month period → its 12 months), `:215` (crosses the year), `:219`. `OverviewTab.tsx:136` places the trend after the list | ✅ |
| 5 | Months with no data → zero bars; in-period months highlighted | `trendMonths.test.ts:235-242` (zeros filled), `:250-257` (`inPeriod` flags) | ✅ |
| 6 | Selected member → trend shows their amounts | `OverviewTab.tsx:58-63` adds `memberId` to the trend filter. Backend: `DashboardTrendIT.java:60-62` (partner-only 50 / 40). Hook: `useDashboardService.test.ts:44` `toHaveBeenCalledWith("/plan/5/dashboard/trend",{params})` | ✅ |
| 7 | Trend endpoint returns income and expenses per month for the range and optional member | `DashboardTrendIT.java:48-51` (3 months: 1000/200, 0/100, 500/0; June and October excluded), `:60-62` (memberId), `:86-87` (other plan → 404 like the summary), `:73` (viewer), `:95-96` (missing range → 400) | ✅ |
| 8 | Label "October 2026" / "Aug – Oct 2026"; arrows shift by the period's length | `periodNavigator.test.ts:75` "October 2026", `:79` "Aug – Oct 2026", `:84` across years, and `:95-108` shifts by 1/3/6/12 across years. ⚠️ The spec defines no label for a custom range not aligned to months (the author shows days: `:88`) | ✅ ⚠️ |
| 9 | Range menu: This month, Last 3 months, Last 6 months, This year, Custom | `PeriodNavigator.tsx:26-29,133`. The screenshot of the open menu shows all five. `periodNavigator.test.ts:121` presets resolve like `resolvePeriodDates` | ✅ + 🖥 |
| 10 | Period persists in the URL and local storage via the home filter mechanism | Arrows write `customRange` through `updateOverview` (`OverviewTab.tsx:94`). The existing overview codec round-trip is at `homeFilterParams.test.ts:40`. Live: after the ‹ arrow the URL became `?…&period=custom&periodFrom=2026-09-01&periodTo=2026-09-30`. The member selection survived a reload (it is kept in local storage) | ✅ + 🖥 |

**Status**: ❌ 1 gap (UX-04 AC 1 `active` for a spend-only former member); ⚠️ 2 spec-precision gaps (UX-04 AC 7 on owned rows, UX-05 AC 8 non-month labels). Neither precision gap blocks this round: the author's choices are recorded in the task notes and are consistent with the ACs.

**Superseded CAT ACs re-checked**: P1 Tab AC 3–5 and 8 and P1 Sub AC 11 are replaced by UX-01 and UX-03, and their old Categories-tab assertions are gone with the codec. The Overview assertions above cover the replacement. The P2 AC 6 and P3 AC 5 rows on the Overview are covered by UX-04 AC 4–5. Unchanged CAT backend behaviour still passes in the full IT run (152/0).

#### SPEC_DEVIATION review

- **U3 palette** (`--member-1..6` instead of `--chart-1..5` + one): **acceptable**. UX-04 AC 2 only requires "a fixed colour from a palette, by position", and that is met. The deviation is from the design, not the spec. It is justified because the five `--chart-*` tokens are amber shades that clash with the warning status (UX-03 AC 4).
- U4–U12 notes record choices where the spec is silent (day labels for unaligned ranges, sub-rows hidden while a member is selected, footer Delete closing the sheet). None contradicts an AC.

#### Discrimination sensor

Each mutant was run in a temporary `git worktree` at HEAD (`node_modules` symlinked, backend `-o` offline), then reverted. The worktree was removed and `git status --porcelain` of the real tree matched the pre-sensor baseline (empty). Sensor depth: expanded (≥5).

| # | File | Mutation | Killed? |
| - | ---- | -------- | ------- |
| M1 | `spendingRows.ts:118` | warning `ratio >= 0.8` → `>` | ✅ (1 failed) |
| M2 | `spendingRows.ts:109` | over `spent > limit` → `>=` | ✅ (2 failed) |
| M3 | `spendingRows.ts:286` | auto-expand also a root that is itself over | ✅ (1 failed) |
| M4 | `spendingRows.ts:202` | a dormant own entry counts as own limit | ✅ (1 failed) |
| M5 | `spendingRows.ts:251` | evaluate the selected member's share against the whole limit (the old `Limits.forRow` bug) | ✅ (3 failed) |
| M6 | `summaryView.ts:44` | totals ignore the selected member | ✅ (2 failed) |
| M7 | `trendMonths.ts:158` | `Math.max` → `Math.min` (window length) | ✅ (7 failed) |
| M8 | `trendMonths.ts:196` | in-period end `<=` → `<` | ✅ (2 failed) |
| M9 | `periodNavigator.ts:54` | shift by 1 month instead of the range's length | ✅ (3 failed) |
| M10 | `memberColors.ts:153` | drop the sort by user id | ✅ (2 failed) |
| M11 | `categoryTree.ts:34` | an orphan child is no longer a root | ✅ (1 failed) |
| M12 | `groupByDay.ts:180` | `split("T")[0]` → `new Date(d).toISOString().slice(0,10)` | ➖ Survived, **equivalent**: the API sends `LocalDate` (`yyyy-MM-dd`), which parses as UTC and round-trips unchanged. M12b is the real local-format shift |
| M12b | `groupByDay.ts:180` | `new Date(d).toLocaleDateString("en-CA")` (UTC shift) | ✅ (3 failed) |
| B1 | `CategorySpendingAssembler.java:153` | drop the spend-only members (only entries listed, the pre-UX rule) | ✅ (4 failed) |
| B2 | `CategorySpendingAssembler.java:179` | owned row leaves out the owner (the pre-UX rule) | ✅ (4 failed) |
| B3 | `CategorySpendingAssembler.java:162` | a spend-only member without an entry is always `active=true` | ❌ **Survived** (32/32 unit pass, and no IT seeds a former member with spend on a non-owned row) |

**Iteration 1 sensor outcome** — 15/16 effective mutants killed (M12 is equivalent) → ❌ FAIL.

#### Code quality

| Check | Status |
| ----- | ------ |
| Minimum code, surgical, no scope creep | ✅ (`StandardCombobox.renderItem` is a small optional prop needed for UX-04 AC 8 dots) |
| Matches patterns (CLAUDE.md: arrow named exports, service hooks, `ApiRoutes`, `PlanContext`) | ✅ |
| Logic in tested pure helpers; presentational components build-gated per the matrix | ✅ |
| Spec-anchored outcome check | ❌ UX-04 AC 1 `active` (B3) |
| Every new test maps to a UX AC, an edge case or a Done-when | ✅ |
| Guidelines: `CLAUDE.md`, `.specs/codebase/TESTING.md` | ✅ |

**Observation (cosmetic, not an AC breach)**: with a member selected, a row where that member has no spend and that has no limit (e.g. Gifts) draws the focus dot in the neutral grey instead of the member's colour (`CategorySpendingList.tsx:125-128`: the fallback chain finds no segment).

#### Fix plan

**Fix UX-1: assert `active` for spend-only members on non-owned rows** (Major)
- **Root cause**: the U1 tests assert `isActive()` true for active members only. The new `limits.activeMemberIds().contains(member)` branch (`CategorySpendingAssembler.java:162`) is never exercised with a former member.
- **Task**: in `CategorySpendingAssemblerTest`, add a case with a plain (non-owned, no entry) category with spend by a member outside `activeMemberIds`, and assert that member is listed with their spend, `limit` null and `isActive()` false. Optionally mirror it in `CategorySpendingIT` (remove the partner after a split on a plain category).
- **Done when**: mutant B3 (`null, limits.activeMemberIds().contains(member))` → `null, true)`) is killed, and the quick and full gates pass.

#### Requirement traceability (UX round)

| Requirement | Status |
| ----------- | ------ |
| UX-01 | ✅ Verified |
| UX-02 | ✅ Verified |
| UX-03 | ✅ Verified |
| UX-04 | ❌ Needs fix (AC 1 `active`, B3) |
| UX-05 | ✅ Verified |

#### Summary

**Overall**: ❌ Not ready. The round needs one fix task (Fix UX-1) and then re-verification.
**Spec-anchored check**: 50/51 ACs matched; 1 gap; 2 spec-precision gaps flagged.
**Sensor**: 15/16 killed (B3 survived; M12 equivalent).
**Gate**: frontend 318 passed, build ok, lint 23 existing errors (0 new); backend 101 unit + 152 IT passed, JaCoCo met.

---


## CAT round (CAT-01..17) - iteration 3: PASS

**CAT round outcome** - PASS (iteration 3). The iteration-2 gap (P2 AC 4 "0 when the total is 0") is closed by `9119578`: `CategoryFormSheet.test.ts:286` asserts `shares.get(10)` and `shares.get(20)` are `0` for two R$ 0 rows, and mutant F7 is now killed. The optional `ownerActive` hardening also landed: `CategorySpendingIT` now kills M18/M19 on its own. Full frontend suite 269 passed. Interactive UAT is still pending (user-facing).

**Date**: 2026-10-12
**Spec**: `.specs/features/categories-revamp/spec.md` (amended in `50472da`)
**Diff range**: `main...feat/categories-revamp`, HEAD `9119578`
**Verifier**: independent sub-agent (author ≠ verifier), iteration 3 of max 3 (narrow re-check)

### Iteration history

- **Iteration 1 (FAIL, `c6aebdb`)**: former owner not marked (P3 AC 7), no `/spending` IT for per-member/owned rows, targetless delete probe (P1 Sub AC 17). Fixed by F1-F5 (`7858a34`..`21194f5`) and spec amendment `50472da`.
- **Iteration 2 (FAIL, `5be07b8`)**: everything verified (backend 238/0, JaCoCo met; frontend 268; 25/26 mutants killed) except P2 AC 4 zero-total clause, whose mutant F7 survived.
- **Iteration 3 (this report, narrow)**: re-checked only `9119578` (new zero-total test, `isBoolean()` checks at `CategorySpendingIT.java:259,263`, controller indentation, docs). The detailed iteration-2 tables below remain valid, with the rows updated.

### Iteration 3 checks

Isolation: `git worktree add --detach <scratchpad>/wt HEAD`, `frontend/node_modules` symlinked, `backend/.env` sourced (datasource `dev_finsight`). Each mutant restored with `git checkout` in the scratch; worktree removed with `--force` and pruned; real tree `git status --porcelain` identical to its pre-check baseline.

| Check | Command | Outcome |
| ----- | ------- | ------- |
| Spec anchor | read P2 AC 4 (`spec.md:123`) vs new test | ✅ test expects `0` for every member when the total is 0, which is the spec outcome |
| F7 re-run | drop `total === 0 ? 0 :` in `CategoryFormSheet.tsx:235`; `npx vitest run …/CategoryFormSheet.test.ts` | ✅ **killed**: "gives every member a 0% share when the total is 0" failed (1 failed / 45 passed) |
| M18/M19 re-run | `CategorySpendingDto` ctor: non-true `ownerActive` → `null`; `./mvnw -q verify -Dit.test=CategorySpendingIT …` | ✅ **killed by the IT**: `removedOwnerIsReportedInactiveAndStillCountsTheirShare` failed (body shows `"ownerActive":null`) |
| Frontend full | `npm test` (real code) | ✅ 19 files, **269 passed**, 0 failed (+1 vs iteration 2) |

The backend full gate was not re-run: `9119578` touches backend only by adding two assertions to an IT (verified green except under mutation) and a whitespace-only indent fix in `FinancialTransactionCategoryController.java`.

---

## Gate Check

All runs used a scratch `git worktree` at HEAD with `backend/.env`, so the datasource was `jdbc:postgresql://localhost:5432/dev_finsight`.

| Gate | Command | Outcome |
| ---- | ------- | ------- |
| Backend full (Full + Build) | `./mvnw verify` | **BUILD SUCCESS**: surefire 92 run / 0 failed / 0 skipped; failsafe 146 run / 0 failed / 0 skipped (**238 total**); "All coverage checks have been met" (JaCoCo branch rule) |
| Frontend unit | `npm test` | 19 files, **268 passed**, 0 failed |
| Frontend build | `npm run build` | exit 0 (only the chunk-size warning, which already existed) |
| Frontend lint | `npm run lint` | 23 errors / 44 warnings. All 23 errors are in `.storybook/main.ts`, `src/components/**/*.stories.tsx` and `src/components/table/**`, the same set as on `main`. **None of the 33 frontend files in the diff has an error**, so this is not a regression |

- New feature ITs that ran green: `CategoryHierarchyIT` 11, `CategoryDeleteIT` 12, `CategoryMemberLimitIT` 17, `CategoryOwnerIT` 12, `CategorySpendingIT` 8, `TransactionCategoryFilterIT` 2, `DashboardPartitionIT` 6, `MigrationsIT` 5.
- **Test count**: backend `@Test` annotations went from 144 on `main` to 241 at HEAD (+97). 238 ran, and none were skipped. The orchestrator's "244" does not match this run. Frontend: 268 tests ran (251 at iteration 1, +17 from F4/F5). No test count went down.
- `e027f5c` (`MigrationsIT.java:91-96`) filters out only a row whose state is `BASELINE` **and** whose version equals the configured baseline version. Every other applied migration must still be `SUCCESS`, and the on-disk/applied version list is still checked with `containsExactlyElementsOf`. The test was not weakened.

---

## Task Completion

| Task | Status | Notes |
| ---- | ------ | ----- |
| T1-T24 | ✅ Done | Every "Full gate passes - PENDING: needs DB tunnel" box in `tasks.md` is now satisfied by this run. The boxes are still unticked in `tasks.md` (orchestrator bookkeeping) |
| F1-F5 | ✅ Done | Verified below. F2/F3 full-gate boxes: same note |
| T20 | ⏳ Manual check pending | 2-member category in the tab. Folded into the UAT below |

Resolved SPEC_DEVIATION: T13 (targetless probe), replaced by F3/F4. Remaining SPEC_DEVIATIONs are harmless: T1 (`V11`), T4 (Σ shares divisor), T9 (optional `parentId`).

---

## Spec-Anchored Acceptance Criteria

Legend:
- ✅ PASS: the assertion matches the spec outcome and the test ran green.
- 🔍 Static: presentational, so no test by design per the TESTING.md matrix. The source was inspected; the item is in the UAT list.
- ❌ GAP: no assertion covers the spec outcome.

### P1: Categories tab (CAT-01..05)

| AC | Spec outcome | `file:line` + assertion | Result |
| -- | ------------ | ----------------------- | ------ |
| 1 | Overview, Transactions, Categories | `frontend/src/features/home/hooks/useHomeFilters.test.tsx:205` `expect(hook.tab).toBe("categories")`; tab order is static in `HomePage.tsx` | ✅ param · 🔍 order |
| 2 | Expenses then Income, root then children | `backend/src/test/java/com/lcs/findraco/services/CategorySpendingIT.java:58-107` returns DEBIT, DEBIT, CREDIT with nested children; `CategorySpendingAssemblerTest.java:222-235` | ✅ |
| 3 | name, owner, limit, spend, % | `CategorySpendingIT.java:77-81` spent 400 / limit 400 / remaining 0 / percentUsed 100 / overLimit false; `:232-235` owner row; UI `CategoryTreeRow.tsx` | ✅ · 🔍 UI |
| 4 | Period change recomputes | `useFinancialTransactionCategoryService.test.ts:204-235` `toHaveBeenLastCalledWith(".../spending", { params: nextRange })` | ✅ |
| 5 | URL + localStorage | `HomeFiltersGate.test.tsx:116-131` `toEqual({ period: "last-6m", customRange: null })`; `homeFilterParams.test.ts:238` | ✅ |
| 6/7 | OWNER actions / read-only for others | UI gate `canManage = myRole === "OWNER"` (`CategoriesTab.tsx`); API: `CategoryHierarchyIT.java:199` 403 for non-OWNER, `CategorySpendingIT.java:111-122` VIEWER gets 200 | ✅ API · 🔍 UI |
| 8 | spend > limit → over | `CategorySpendingIT.java:93` `delivery.overLimit` true (250 vs 200); `scaleLimits.test.ts` equality is not over | ✅ |
| 9 | Old dialog gone, link to tab | old dialog files deleted; `TransactionsTab.tsx` `setTab("categories")` | 🔍 |

### P1: Two-level subcategories (CAT-06..10)

| AC | Spec outcome | `file:line` + assertion | Result |
| -- | ------------ | ----------------------- | ------ |
| 1 | saved as child | `CategoryHierarchyIT.java:41`, `:58`: `isCreated()`/`isOk()`, `parentId == food.id` | ✅ |
| 2 | parent is a child → 400 | `CategoryHierarchyIT.java:94` `isBadRequest()` (mutant M1 killed) | ✅ |
| 3 | has children + parent → 400 | `CategoryHierarchyIT.java:108` (M15 killed) | ✅ |
| 4 | type mismatch → 400 | `CategoryHierarchyIT.java:136` (M16 killed) | ✅ |
| 5 | parent not in plan → 404 | `CategoryHierarchyIT.java:153`, `:172` `isNotFound()` | ✅ |
| 6 | type change with children → 400 | `CategoryHierarchyIT.java:184` (M2 killed) | ✅ |
| 7/8 | parent = direct + children; child alone | `CategorySpendingIT.java:77` Food 400 = direct + Delivery, `:89` Delivery 250; `CategorySpendingAssemblerTest.java:144,164` | ✅ |
| 9/10 | parent limit on rollup; child independent | `CategorySpendingIT.java:78-81` (parent at 100%, not over) vs `:90-93` (child 125%, over) | ✅ |
| 11 | Overview roots expandable | `DashboardPartitionIT.java:262` Food 100 with child Delivery 60; chart expand is static | ✅ · 🔍 |
| 12 | filter by parent includes children | `TransactionCategoryFilterIT.java:33` 3 ids / `totalElements == 3` (M10 killed) | ✅ |
| 13 | picker grouped, both selectable | `CategoryCombobox.test.ts:35-38` `toEqual([1, 2, 3, 6, 4, 5])` | ✅ |
| 14 | delete parent with children → 409 | `CategoryDeleteIT.java:69` `isConflict()` (M3, M6 killed) | ✅ |
| 15 | target moves every ref in one tx | `CategoryDeleteIT.java:112` moves transactions/items/recurrences, 204 (M4 killed); rollback `:198` | ✅ |
| 16 | self / child / other type → 400 | `CategoryDeleteIT.java:134`, `:148` (M5 killed), `:163` | ✅ |
| 17 (amended) | dialog shows usage counts, requires a target when any count > 0 | `DeleteCategoryDialog.test.ts:102` null while counts are unknown, `:111-123` null without a target for each single non-zero count, reassign with target; `:77` `isCategoryInUse`; `:84` `describeUsage`; hook `useFinancialTransactionCategoryService.test.ts:351-370` GETs `.../{id}/usage`. Wiring `DeleteCategoryDialog.tsx:115,159` | ✅ (F4-F6 killed) |
| 18 (new) | counts of transactions, items, recurrences | `CategoryDeleteIT.java:228-248` `transactions == 2`, `items == 1`, `recurrenceDefinitions == 3` (M13 swap killed); `:251` all zero; `:267` other plan → 404 | ✅ |

Edge cases:
- In-use delete without a target returns 409 with counts: `CategoryDeleteIT.java:85` (M17 killed). ✅
- R$ 0 spend: `CategorySpendingIT.java:97`. ✅
- Parent without a limit and child with a limit: `CategorySpendingAssemblerTest`. ✅
- All per-member limits removed leaves no limit: `CategoryMemberLimitIT.java:123` (M8 killed). ✅
- R$ 0 limit with R$ 0 spend is 0% and not over: `CategorySpendingAssemblerTest`, `scaleLimits.test.ts`. ✅
- A parent that becomes a root again stops rolling up: `DashboardPartitionIT.java:262` and `CategoryHierarchyIT.java:77`. ✅

### P2: Per-member limits (CAT-11..14)

| AC | Spec outcome | `file:line` + assertion | Result |
| -- | ------------ | ----------------------- | ------ |
| 1 | one amount per member | `CategoryMemberLimitIT.java:52` | ✅ |
| 2 | limit = sum | `CategoryMemberLimitIT.java:79`; through `/spending` `CategorySpendingIT.java:162` `limit == 400` | ✅ |
| 3 | plain limit ignored | `CategoryMemberLimitIT.java:99` | ✅ |
| 4 (amended) | read-only %, **one decimal**, **0 when total is 0** | `CategoryFormSheet.test.ts:282` 65/35, `:286-293` zero total → `0` for each member (iteration 3), `:306-313` 33.3/66.7 | ✅ (F7 killed) |
| 5 | member spend = shares, items proportional | `CategorySpendingIT.java:168,175` 50/50 of R$100; `ItemShareAllocatorTest`; `DashboardPartitionIT.java:309` (M12 killed) | ✅ |
| 6 | per-member rows: spend, limit, over mark | `CategorySpendingIT.java:166-179` spend 50, limits 260/140, remaining, overLimit false, active true; over = true in `CategorySpendingAssemblerTest.java:301-309` (M11 killed) | ✅ |
| 7 | non-active member → 400 | `CategoryMemberLimitIT.java:158` | ✅ |
| 8 | duplicate → 400 | `CategoryMemberLimitIT.java:172` | ✅ |
| 9 | negative → 400 | `CategoryMemberLimitIT.java:185` | ✅ |
| 10 | CREDIT or owned → 400 | `CategoryMemberLimitIT.java:197`, `:209` | ✅ |
| 11 | former entry kept, excluded, shown | `CategorySpendingIT.java:196-203` row limit 260, former `active` false, limit 140 kept; `CategoryMemberLimitIT.java:247`, `:288` (M7 killed) | ✅ |
| 12 | rejoin reactivates | `CategorySpendingIT.java:210-215` limit 400, `active` true; `CategoryMemberLimitIT.java:305` | ✅ |
| 13 | OWNER removes former entry | `CategoryMemberLimitIT.java:326` (M8 killed) | ✅ |

### P3: Owned categories (CAT-14..17)

| AC | Spec outcome | `file:line` + assertion | Result |
| -- | ------------ | ----------------------- | ------ |
| 1 | owner stored on root | `CategoryOwnerIT.java:52` | ✅ |
| 2 | child gets parent's owner | `CategoryOwnerIT.java:90`; `CategorySpendingIT.java:263` | ✅ |
| 3 | owner on child → 400 | `CategoryOwnerIT.java:105` | ✅ |
| 4 | owner not active → 400 | `CategoryOwnerIT.java:122`, `:182` (M9 killed) | ✅ |
| 5 | owned spend = owner's share, limit evaluated against it | `CategorySpendingIT.java:220-240` spent 70 of 70/30, limit 100, 70%; the other member's 30 is listed separately | ✅ |
| 6 (amended) | participants follow the selected category: active owner at 100%, else defaults; untouched + create only | `TransactionFormDrawer.test.ts:339-395`: owner → `toEqual(livia)`; unowned / cleared / former owner → `toEqual(createDefaults)`; duplicate → `toEqual` duplicated defaults; touched → `toBe(manual)`; edit → `toBe(editing)` (F1-F3 killed) | ✅ |
| 7 | former owner kept, shown "former member", clear/change, rejoin | API `CategoryOwnerIT.java:139`, `:157`, `:199`; `/spending` `CategorySpendingIT.java:259` `ownerActive` false (root and child `:263`), `:270` true after rejoin (M14 killed); `CategorySpendingAssemblerTest.java:526,541` `isFalse()`; tab `CategoryTreeRow.tsx:140` "(former member)" badge | ✅ · 🔍 badge |
| 8 | visible to every member | `CategoryOwnerIT.java:218` | ✅ |

**Status**:
- ✅ No gaps. The iteration-2 zero-total gap (P2 AC 4) is fixed and verified in iteration 3.
- Iteration-1 gap 1 (P3 AC 7) is fixed and verified.
- Iteration-1 gap 2 (no `/spending` IT for per-member/owned rows) is fixed and verified.
- The AC 17 deviation is resolved by the spec amendment plus F3/F4.
- Both iteration-1 spec-precision gaps were resolved by amending the spec (P2 AC 4 rounding, P3 AC 6 switching).

---

## Discrimination Sensor

**Isolation**:
- Scratch worktree created with `git worktree add --detach <scratchpad>/vwt HEAD`, with `frontend/node_modules` symlinked.
- After every mutant, the file was restored with `git checkout` inside the scratch.
- The worktree was removed with `git worktree remove --force` and pruned.
- The real tree's `git status --porcelain` matched its pre-sensor baseline (empty) afterwards.
- Backend runs were strictly sequential, one IT class each: `./mvnw -q verify -Dit.test=<IT> -Dtest=NoSuchTest -Dsurefire.failIfNoSpecifiedTests=false -Djacoco.skip=true`.
- Every kill was an assertion failure, not a compile error.

**Backend (IT layer; the 12 pending mutants from iteration 1 plus 7 more)**

| # | File:target | Mutation | Killed by |
| - | ----------- | -------- | --------- |
| M1 | `FinancialTransactionCategoryService.resolveParent` | drop the parent-is-child check | ✅ `CategoryHierarchyIT.parentThatIsItselfAChildIsRejectedWith400` |
| M2 | `…Service.update` | drop the type-change-with-children check | ✅ `typeChangeOnCategoryWithChildrenIsRejectedWith400` |
| M3 | `…Service.delete` | drop the `existsByParent` 409 | ✅ `CategoryDeleteIT.parentWithChildrenIsRejectedWith409` |
| M4 | `…Service.delete` | remove `recurrenceDefinitionRepository.reassignCategory` | ✅ `reassignMovesTransactionsItemsAndRecurrenceDefinitionsThenDeletesWith204` |
| M5 | `…Service.resolveReassignTarget` | drop the own-child target check | ✅ `targetIsOneOfItsChildrenIsRejectedWith400` |
| M6 | `GlobalExceptionHandler.handleCategoryConflict` | 409 → 400 | ✅ `categoryInUseWithoutTargetIsRejectedWith409ReportingCounts`, `parentWithChildrenIsRejectedWith409` |
| M7 | `…Service.replaceMemberLimits` | allow a former member's amount to change | ✅ `CategoryMemberLimitIT.changingAFormerMembersAmountIsRejectedWith400` |
| M8 | `…Service.replaceMemberLimits` | remove `removeIf` | ✅ 3 tests (set replace, remove all, remove former entry) |
| M9 | `…Service.resolveOwner` | return the stored owner for any id (no active check) | ✅ `CategoryOwnerIT.formerMemberCannotBecomeTheOwnerOfAnotherCategory`, `ownerWhoIsNotAnActiveMemberIsRejectedWith400` |
| M10 | `FinancialTransactionSpecification.categoryInTree` | drop the parent-id branch | ✅ `TransactionCategoryFilterIT.filteringByParentReturnsParentAndChildTransactions` |
| M11 | `CategorySpendingService.members()` | active ids = `Set.of()` | ✅ 4 `CategorySpendingIT` tests (was expected to survive in iteration 1; F2 kills it) |
| M12 | `CategorySpendingService.facts` | apply the member filter to item rows **before** allocation | ✅ `DashboardPartitionIT.memberFilterAppliesToItemPortions` |
| M13 | `…Service.usageOf` | swap the item and recurrence counts | ✅ `CategoryDeleteIT.usageCountsTransactionsItemsAndRecurrenceDefinitionsForAnyMember` |
| M14 | `CategorySpendingAssembler` owned row | `ownerActive = true` | ✅ `CategorySpendingIT.removedOwnerIsReportedInactiveAndStillCountsTheirShare` |
| M15 | `…Service.update` | drop the "has children cannot get a parent" check | ✅ `categoryWithChildrenGivenAParentIsRejectedWith400` |
| M16 | `…Service.resolveParent` | drop the type-mismatch check | ✅ `parentOfDifferentTypeIsRejectedWith400` |
| M17 | `…Service.delete` | in-use without a target no longer rejected | ✅ `categoryInUseWithoutTargetIsRejectedWith409ReportingCounts` |
| M18/M19 | `CategorySpendingAssembler` owned row | inactive owner → `ownerActive = null` instead of `false` | ✅ Iteration 3: killed by `CategorySpendingIT.removedOwnerIsReportedInactiveAndStillCountsTheirShare` (new `isBoolean()` checks at `:259,263`); also killed by `CategorySpendingAssemblerTest:526,541` |

**Frontend (unit project, fix commits)**

| # | File | Mutation | Killed by |
| - | ---- | -------- | --------- |
| F1 | `TransactionFormDrawer.tsx:304` | drop the `mode === "edit"` guard | ✅ "never changes the participants in edit mode" |
| F2 | `TransactionFormDrawer.tsx:305` | no fallback to the defaults | ✅ 4 "restores the default participants…" tests |
| F3 | `TransactionFormDrawer.tsx:304` | ignore `participantsTouched` | ✅ "changes nothing after a manual participant edit" |
| F4 | `DeleteCategoryDialog.tsx:47` | recurrences ignored by `isCategoryInUse` | ✅ 2 tests |
| F5 | `DeleteCategoryDialog.tsx:61` | submit a plain delete while the counts are unknown | ✅ "cannot submit before the usage counts are known" |
| F6 | `useFinancialTransactionCategoryService.ts:88` | wrong usage URL | ✅ "GETs the plan-scoped usage counts of the category" |
| F7 | `CategoryFormSheet.tsx:235` | drop the `total === 0 ? 0 :` guard (0/0 → `NaN`) | ✅ Iteration 3: "gives every member a 0% share when the total is 0" (survived in iteration 2) |

**Sensor depth**: expanded (≥5; core domain / data integrity).

**Result**: 26 injected, 26 killed, 0 survived (F7 and M18/M19 re-run and killed in iteration 3). The 24 iteration-1 mutants (unit layer) were not re-run, because their code is unchanged except for the F1 assembler line, which M14/M19 cover.

---

## Code Quality

| Principle | Status |
| --------- | ------ |
| Minimum code / surgical / no scope creep | ✅ The fix commits touch only what F1-F5 required |
| Matches patterns | ✅ Typed DTO, `PlanContext`, service hook + query key, `buildMutationOptions` invalidation. Iteration-2 indentation nit fixed in `9119578` |
| Spec-anchored outcome check | ✅ All ACs asserted or static + UAT |
| Per-layer coverage (routes: happy + edge + error) | ✅ `/spending` now covers per-member, owned and former-member cases; `/usage` covers happy, zero and foreign 404 |
| Every test maps to an AC / edge / Done-when | ✅ |
| Guidelines | `CLAUDE.md`, `.specs/codebase/TESTING.md` |

Doc nit: the F4 text in `tasks.md:751` names the query key `["financialTransactionCategoryUsage", …]`, but the code and its test use `["categoryUsage", planId, id]`.

---

## Fix Plans

None. Iteration-2 Fix 1 and the optional `ownerActive` hardening were both applied in `9119578` and verified.

---

## Interactive UAT (pending: user-facing)

This list is the T20 manual check plus the presentational ACs that have no automated UI test by design:
- three tabs in order (P1 AC 1);
- row content and over-limit badge (AC 3, 8);
- OWNER vs VIEWER actions (AC 6/7);
- Transactions-tab link (AC 9);
- Overview expand (Sub AC 11);
- delete dialog showing counts and asking for a target (Sub AC 17);
- 2-member Groceries 260/140 with 65% / 35% and the per-member rows (P2 AC 4, 6);
- "(former member)" owner badge (P3 AC 7).

Note: `./mvnw verify` truncated `dev_finsight`, so the data must be re-seeded first.

---

## Requirement Traceability Update

| Requirement | New status |
| ----------- | ---------- |
| CAT-01, CAT-02, CAT-03, CAT-06, CAT-11, CAT-07, CAT-09, CAT-10, CAT-12, CAT-13, CAT-14, CAT-15, CAT-16, CAT-17 | ✅ Verified (presentational parts → UAT) |
| CAT-04, CAT-05, CAT-08 | ✅ Verified at API/logic level · UI by UAT |

---

## Summary

**Overall**: ✅ Ready, pending the interactive UAT.

**Spec-anchored check**: 0 gaps. Every AC matches the spec outcome, or is static and in the UAT list.
**Sensor**: 26 injected, 26 killed, 0 survived.
**Gate**: iteration 2 backend 238 passed / 0 failed (JaCoCo met), build ok, 0 new lint errors; iteration 3 frontend 269 passed / 0 failed, `CategorySpendingIT` green on real code.

**Next steps**: interactive UAT (re-seed `dev_finsight` first) → tick the `tasks.md` full-gate boxes.
