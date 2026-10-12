# Categories Revamp Validation

## Validation: categories-revamp - FAIL

**Result**: FAIL - one AC gap in shipped behavior (P3 AC 7 / CAT-14: a former owner is not marked "former member" in the Categories tab) and a missing end-to-end IT for per-member/owned spend through `/spending`. Independently of those, every `*IT` gate is **PENDING (needs DB tunnel)**, so this feature cannot be marked done even after the fixes until `./mvnw verify` has run.

**Date**: 2026-10-12
**Spec**: `.specs/features/categories-revamp/spec.md`
**Diff range**: `675a151..HEAD` (24 feature commits, `4e48c90` … `47c46ca`, branch `feat/categories-revamp`)
**Verifier**: independent sub-agent (author ≠ verifier)

---

## Task Completion

| Task | Status | Notes |
| ---- | ------ | ----- |
| T4, T5, T9–T16, T18, T19, T22–T24 | ✅ Done | Unit/build gates re-run by the Verifier and green |
| T1, T2, T3, T6, T7, T8, T17, T21 | ⏳ Code done, gate PENDING | ITs written, not run (DB tunnel down) |
| T20 | ⏳ Build done, manual check PENDING | Manual 2-member check needs API + DB |

SPEC_DEVIATIONs recorded in tasks.md: T1 (migration `V11`, `V10` taken), T4 (`ItemShareAllocator` divides by Σ shares, equal to amount under SPLIT-01), T9 (`parentId` optional on the TS type), **T13 (in-use is learned from a first delete's 409; see P1 Sub AC 17 below)**.

---

## Spec-Anchored Acceptance Criteria

Legend: ✅ PASS (assertion matches spec outcome, test ran green) · ⏳ PENDING (assertion statically matches the spec outcome; `*IT` not run - needs DB tunnel) · 🔍 Static only (presentational, no test by design per the Test Coverage Matrix - source inspected) · ⚠️ Spec-precision gap / deviation · ❌ GAP

### P1: Categories tab (CAT-01..CAT-05)

| AC | Spec-defined outcome | `file:line` + assertion | Result |
| -- | -------------------- | ----------------------- | ------ |
| 1 Three tabs, order | Overview, Transactions, Categories | `frontend/src/features/home/HomePage.tsx` tabs array (`{ key: "categories", label: "Categories" }` appended last); `frontend/src/features/home/hooks/useHomeFilters.test.tsx:205` - `expect(hook.tab).toBe("categories")`; `frontend/src/features/home/filters/homeFilterParams.test.ts:198` - `expect(parseTab(...)).toBe("categories")` | 🔍 order static; tab param ✅ |
| 2 Grouped by type, roots then children | Expenses then Income; each root followed by children | `backend/src/test/java/com/lcs/findraco/services/CategorySpendingAssemblerTest.java:222-231` - `containsExactly("food","Rent","Salary")`, types DEBIT,DEBIT,CREDIT, children nested; `backend/.../CategorySpendingIT.java:52-58,72-75` - DEBIT,DEBIT,CREDIT and `delivery.parentId == food.id`; UI `CategoriesTab.tsx:169,176` Expenses section before Income | ✅ unit · ⏳ IT · 🔍 UI |
| 3 Row content | name, owner, limit, spend, % used | `CategorySpendingIT.java:62-80` - spent 400 / limit 400 / remaining 0 / percentUsed 100 / overLimit false; `CategorySpendingAssemblerTest.java:455-456` - `ownerName == "Lucas"`; UI `CategoryTreeRow.tsx:135-176` renders name, owner badge, spent, limit, `%` | ✅ unit · ⏳ IT · 🔍 UI |
| 4 Period change recomputes | new request for the new range | `frontend/src/api/services/useFinancialTransactionCategoryService.test.ts:218-235` - `toHaveBeenCalledTimes(2)` + `toHaveBeenLastCalledWith(".../spending", { params: nextRange })` | ✅ PASS |
| 5 Period persisted in URL + localStorage (M5-03) | `categoriesPeriod*` params, restored per user+plan | `frontend/src/features/home/filters/HomeFiltersGate.test.tsx:116-131` - `expect(filters.categories).toEqual({ period: "last-6m", customRange: null })`; `homeFilterParams.test.ts:238` (serializes `categoriesPeriod`); `useHomeFilters.test.tsx:165` | ✅ PASS |
| 6 OWNER: create/edit/delete | actions offered | `frontend/.../categories/CategoriesTab.tsx:89` - `canManage = activePlan?.myRole === "OWNER"`, `:153` New button, `CategoryTreeRow.tsx:179` actions behind `canManage`; backend authz unchanged | 🔍 Static only |
| 7 Non-OWNER read-only | no actions | Same `canManage` gate; backend 403: `CategoryHierarchyIT.java:199-210` - `status().isForbidden()`; read allowed: `CategorySpendingIT.java:98-109` (VIEWER 200) | 🔍 UI · ⏳ IT |
| 8 Over-limit mark | spend > limit → marked | `CategorySpendingAssemblerTest.java:164-168` - 250 vs 200 → `overLimit` true; `frontend/src/features/home/utils/scaleLimits.test.ts:55,64` - over / not over at equality; UI badge `CategoryTreeRow.tsx:140` | ✅ logic · 🔍 UI |
| 9 Old dialog gone, link to tab | no `CategoriesManageDialog`; button opens Categories tab | `TransactionsTab.tsx` diff - `onClick={() => setTab("categories")}`, `CategoriesManageDialog.tsx`/`CategoryFormDialog.tsx` deleted (no imports remain; build green) | 🔍 Static only |

### P1: Two-level subcategories (CAT-06..CAT-10)

| AC | Spec-defined outcome | `file:line` + assertion | Result |
| -- | -------------------- | ----------------------- | ------ |
| 1 Save as child | 201/200, `parentId` persisted | `backend/.../CategoryHierarchyIT.java:47-53` - `isCreated()`, `parentId == food.id`, persisted parent; `:65-71` update | ⏳ PENDING |
| 2 Parent is a child | 400 | `CategoryHierarchyIT.java:101` - `isBadRequest()`, `:103` nothing saved | ⏳ PENDING |
| 3 Category with children gets a parent | 400 | `CategoryHierarchyIT.java:116-118` | ⏳ PENDING |
| 4 Parent type differs | 400 | `CategoryHierarchyIT.java:143-148` (create and update) | ⏳ PENDING |
| 5 Parent not in plan | 404 | `CategoryHierarchyIT.java:162-167` (other plan), `:177` (nonexistent) | ⏳ PENDING |
| 6 Type change with children | 400 | `CategoryHierarchyIT.java:191-193` - type unchanged | ⏳ PENDING |
| 7 Parent spend = direct + children (item-aware) | rolled-up sum | `CategorySpendingAssemblerTest.java:144` - `spent == 180`; `:185-187` item partition per leaf before rollup | ✅ PASS |
| 8 Child spend alone | own leaf only | `CategorySpendingAssemblerTest.java:164` (250) vs parent `:169` (260) | ✅ PASS |
| 9 Parent limit vs rolled-up | evaluated on rollup | `CategorySpendingAssemblerTest.java:145-148` - limit 400, remaining 220, 45.00%, not over | ✅ PASS |
| 10 Child limit independent | child over while parent not | `CategorySpendingAssemblerTest.java:165-170` | ✅ PASS |
| 11 Overview roots expandable to children | roots rolled up, `children[]` | `CategorySpendingAssemblerTest.java:260-262`; `DashboardPartitionIT` `parentRollsUpChildSpendInTheDashboardUntilTheChildBecomesRoot` - Food 100 with child Delivery 60; chart expand `CategorySpendingChart.tsx` | ✅ unit · ⏳ IT · 🔍 UI |
| 12 Filter by parent includes children | parent + child rows | `backend/.../TransactionCategoryFilterIT.java:40-42` - 3 ids, `totalElements == 3`; `:53-54` child only | ⏳ PENDING |
| 13 Picker grouped, both levels selectable | children under parent | `frontend/.../transactions/CategoryCombobox.test.ts:35-38` - `toEqual([1, 2, 3, 6, 4, 5])`; `:45` parent kept visible in search | ✅ PASS |
| 14 Delete parent with children | 409 | `backend/.../CategoryDeleteIT.java:73-77` - `isConflict()` with and without target, both rows kept | ⏳ PENDING |
| 15 Delete with target moves all refs, one tx | 204; txs/items/recurrences on target | `CategoryDeleteIT.java:119-126` - source gone, 3 reference kinds moved; rollback `:195-220` | ⏳ PENDING |
| 16 Invalid target (self / child / other type) | 400 | `CategoryDeleteIT.java:137`, `:152`, `:167` - `isBadRequest()`; foreign target 404 `:184` | ⏳ PENDING |
| 17 UI asks for target before sending the delete | target chosen before the delete | `frontend/.../categories/DeleteCategoryDialog.test.ts:69-73` - `buildDeleteRequest(..., { inUse: true, targetId: null })` → `toBeNull()` | ⚠️ Deviation: the UI first sends a delete **without** target and learns "in use" from the 409 (T13 SPEC_DEVIATION); the reassigning delete is never sent without a target. Outcome-safe (the 409 deletes nothing) but contradicts the literal AC - needs user acceptance or a spec amendment |

Edge cases: in-use delete without target → 409 + counts `CategoryDeleteIT.java:93-97` (`contains("2 transaction(s)", "1 item(s)", "1 recurrence definition(s)")`) ⏳; no spend → R$ 0 `CategorySpendingAssemblerTest.java:225` ✅; parent no limit + child limit `:200-207` ✅; all per-member limits removed → no limit `CategoryMemberLimitIT.java:130-136` ⏳; R$ 0 limit + R$ 0 spend → 0%, not over `CategorySpendingAssemblerTest.java:241-244` ✅ and `scaleLimits.test.ts:68` ✅; parent cleared → stops rolling up `DashboardPartitionIT` (`afterMove`: Food 40, Delivery 60) ⏳.

### P2: Per-member limits (CAT-11..CAT-14)

| AC | Spec-defined outcome | `file:line` + assertion | Result |
| -- | -------------------- | ----------------------- | ------ |
| 1 One amount per member stored | 260 / 140 rows | `backend/.../CategoryMemberLimitIT.java:66-68` | ⏳ PENDING |
| 2 Category limit = sum | 400 | `CategoryMemberLimitIT.java:91,94` - `effectiveLimit == 400`; `CategorySpendingAssemblerTest.java:278` - `limit == 400` | ✅ unit · ⏳ IT |
| 3 Plain limit ignored | effective 400, stored plain null | `CategoryMemberLimitIT.java:109-118` | ⏳ PENDING |
| 4 Read-only % share | 65% / 35% | `frontend/.../categories/CategoryFormSheet.test.ts:277-284` - `shares.get(10) == 65`, `shares.get(20) == 35` | ✅ PASS (⚠️ rounding unspecified) |
| 5 Member spend = shares, items proportional | 50/50 R$100 → 50 each; cents exact | `CategorySpendingAssemblerTest.java:298-306`; `:323` item partition; `ItemShareAllocatorTest.java:32-36` (18/12), `:51-56` (Σ = 10.00), `:69` (tie by member id); SQL member facts `DashboardPartitionIT` `memberFilterAppliesToItemPortions` (28/12, 42/18, 70/30) | ✅ unit · ⏳ IT |
| 6 Per-member rows: spend, limit, over mark | Lívia 50 vs 40 → over | `CategorySpendingAssemblerTest.java:301-309` - 125.00%, `overLimit` true; `scaleLimits.test.ts:135`; UI `CategoryTreeRow.tsx:58-96` | ✅ unit · 🔍 UI · ❌ no IT through `/spending` (gap 2) |
| 7 Non-active member | 400 | `CategoryMemberLimitIT.java:165-167` | ⏳ PENDING |
| 8 Duplicate member | 400 | `CategoryMemberLimitIT.java:178-180`; FE `CategoryFormSheet.test.ts:319` | ⏳ IT · ✅ FE |
| 9 Negative amount | 400 | `CategoryMemberLimitIT.java:190-192`; FE `CategoryFormSheet.test.ts:329` | ⏳ IT · ✅ FE |
| 10 CREDIT or owned | 400 | `CategoryMemberLimitIT.java:202-204`, `:219-224`; FE `CategoryFormSheet.test.ts:335,345` | ⏳ IT · ✅ FE |
| 11 Former member entry kept, excluded, shown | effective 260, `active=false`, still stored; greyed row | `CategoryMemberLimitIT.java:257-262`; `CategorySpendingAssemblerTest.java:353-362` - limit 260, former `isActive()` false, remaining/percent/over null; UI badge `CategoryTreeRow.tsx:71` | ✅ unit · ⏳ IT · 🔍 UI |
| 12 Rejoin reactivates | entry active, 140, effective 400 | `CategoryMemberLimitIT.java:319-321` | ⏳ PENDING |
| 13 OWNER removes former entry | deleted | `CategoryMemberLimitIT.java:338-339`; FE `CategoryFormSheet.test.ts:393` | ⏳ IT · ✅ FE |

### P3: Owned categories (CAT-15..CAT-17, CAT-14)

| AC | Spec-defined outcome | `file:line` + assertion | Result |
| -- | -------------------- | ----------------------- | ------ |
| 1 Owner stored on root | ownerId persisted | `backend/.../CategoryOwnerIT.java:61-65` | ⏳ PENDING |
| 2 Child gets parent's owner | child reports parent owner | `CategoryOwnerIT.java:98-100`; `CategorySpendingAssemblerTest.java:501` | ✅ unit · ⏳ IT |
| 3 Owner on child | 400 | `CategoryOwnerIT.java:112-117`; FE `CategoryFormSheet.test.ts:451,483` | ⏳ IT · ✅ FE |
| 4 Owner not active | 400 | `CategoryOwnerIT.java:129-134`, `:192` | ⏳ PENDING |
| 5 Owned spend = owner's share | 120 of owner vs limit 100 → over | `CategorySpendingAssemblerTest.java:457-461`; `:474` (others excluded); `:500-503` children | ✅ unit · ❌ no IT through `/spending` (gap 2) |
| 6 Default owner as 100% participant | owner single participant unless edited | `frontend/.../transactions/TransactionFormDrawer.test.ts:229-244` - `participants: [{ memberId: 2 }]`; `:260-268` touched → `toBeNull()` | ✅ PASS (⚠️ switching back to an unowned category unspecified) |
| 7 Former owner kept, shown "former member", clear/change, rejoin | `ownerActive=false`; tab shows "former member" | API: `CategoryOwnerIT.java:149-151,166-177,212-213` ⏳. **Tab**: `frontend/src/features/home/components/categories/CategoryTreeRow.tsx:137-138` renders `<Badge>{row.ownerName}</Badge>` with no former-member marker, and `backend/.../dtos/response/CategorySpendingDto.java:22-23,38-40` carries no owner-active flag. Only the form's owner select labels it (`CategoryFormSheet.tsx:521`) | ❌ GAP (gap 1) |
| 8 Visible to every member | categories + transactions listed for non-owner | `CategoryOwnerIT.java:231-240` | ⏳ PENDING |

**Status**: ❌ 1 AC gap (P3 AC 7 tab display) · ⏳ every IT-backed criterion statically matches the spec outcome but has not run · ⚠️ 1 deviation (P1 Sub AC 17) + 2 spec-precision gaps.

---

## Discrimination Sensor

Isolated scratch: `git worktree add <scratchpad>/verify-wt HEAD`, `frontend/node_modules` symlinked; worktree removed with `git worktree remove --force`; real-tree `git status --porcelain` matched the pre-sensor baseline (empty) afterwards. Backend runner: `./mvnw -q test -Dtest='CategorySpendingAssemblerTest,ItemShareAllocatorTest' -Djacoco.skip=true`; frontend: `npx vitest run --project=unit`. Every kill was a test assertion failure, not a compile error.

| # | File (scratch) | Mutation | Killed by |
| - | -------------- | -------- | --------- |
| B1 | `CategorySpendingAssembler.java:124` | children's spend not merged into parent rollup | ✅ 7 tests (e.g. `childIsEvaluatedAloneAgainstItsOwnLimit`) |
| B2 | `CategorySpendingAssembler.java:165` | owned row counts all members, not the owner | ✅ `ownedCategoryCountsTheOwnersSpendOnly` et al. |
| B3 | `CategorySpendingAssembler.java:188` | dormant entries included in the limit sum | ✅ `dormantEntryIsListedButExcludedFromTheSumAndEvaluation:353` |
| B4 | `CategorySpendingAssembler.java:199` | member filter uses a dormant member's own limit | ✅ `memberFilterIgnoresTheMembersDormantEntry:406` |
| B5 | `CategorySpendingAssembler.java:141` | child does not inherit parent's owner | ✅ `childrenOfAnOwnedRootCountTheOwnersSpendOnly:502` |
| B6 | `CategorySpendingAssembler.java:92` | Overview drops limit-only categories | ✅ `overviewListsACategoryWhoseOnlyLimitIsPerMember:440` |
| B7 | `ItemShareAllocator.java:95` | tie broken by higher member id | ✅ `tieInRemaindersIsBrokenByLowerMemberId:69` |
| B8 | `ItemShareAllocator.java:97` | leftover cents never distributed | ✅ `tenOverThreeUnevenSharesSumsToExactlyTen:51` |
| B9 | `ItemShareAllocator.java:66` | B facts emitted for uncategorized txs | ✅ `uncategorizedTransactionProducesOnlyItemCategoryFacts:110` |
| B10 | `CategorySpendingAssembler.java:153` | per-member row always `active=true` | ✅ `dormantEntryIsListed…:357` |
| F1 | `frontend/src/features/home/utils/scaleLimits.ts:37` | `spent > limit` → `>=` | ✅ `scaleLimits.test.ts` "is not over when spend equals the limit" |
| F2 | `CategoryFormSheet.tsx` duplicate check | duplicate member accepted | ✅ "rejects the same member twice" |
| F3 | `CategoryFormSheet.tsx` negative check | negative amount accepted | ✅ "rejects a negative amount" |
| F4 | `CategoryFormSheet.tsx:321` | `ownerId` sent for a child | ✅ "sends the owner for a root and never for a child" |
| F5 | `DeleteCategoryDialog.tsx` `eligibleDeleteTargets` | own children offered as targets | ✅ 2 tests |
| F6 | `CategoryCombobox.tsx` `groupCategoryOptions` | parent hidden when only a child matches | ✅ 2 tests |
| F7 | `homeFilterParams.ts:164` | categories tab reads `period` instead of `categoriesPeriod` | ✅ 7 tests |
| F8 | `TransactionFormDrawer.tsx` `ownerDefaultAttribution` | default applied after manual edit | ✅ "is not applied after a manual participant edit" |
| F9 | `CategoryFormSheet.tsx` `memberLimitShares` | former members get a share | ✅ "leaves out former members…" |
| F10 | `DeleteCategoryDialog.tsx` `buildDeleteRequest` | in-use delete sent without target | ✅ "cannot submit an in-use delete without a target" |
| F11 | `scaleLimits.ts:54` | former member's usage evaluated | ✅ "scales a former member's amount but leaves it unevaluated" |
| F12 | `CategoryFormSheet.tsx:133` | owner on a child accepted by schema | ✅ "rejects an owner on a child" |
| F13 | `CategoryFormSheet.tsx:183` | per-member limits allowed on owned category | ✅ 2 tests |
| F14 | `scaleLimits.ts:36` | R$0 limit → NaN/Infinity percent | ✅ "reports 0 percent and not over for a zero limit with zero spend" |

**Sensor depth**: expanded (core domain), 24 manual behavior-level mutations (10 backend, 14 frontend).
**Sensor outcome**: 24 injected, 24 killed, 0 survived (runnable layers only).

---

## Gate Check

| Gate | Command | Outcome |
| ---- | ------- | ------- |
| Backend compile | `./mvnw -q -DskipTests test-compile` | exit 0 |
| Backend unit | `./mvnw test -Dtest='CategorySpendingAssemblerTest,ItemShareAllocatorTest,SplitResolverTest,SeriesRegeneratorTest,RecurringTransactionGeneratorTest,PlanAuthorizationTest'` | 90 run, 0 failed, 0 skipped (assembler 28, allocator 7) |
| Backend full (Build gate) | `./mvnw verify` (all `*IT`, `FinSightApplicationTests`, JaCoCo branch rule) | **PENDING (needs DB tunnel)** |
| Frontend unit | `npm run test` | 19 files, 251 passed, 0 failed |
| Frontend build | `npm run build` | exit 0 (chunk-size warning only) |
| Frontend lint | `npm run lint` | 23 errors / 41 warnings; **0 errors in files touched by the diff** (all 23 in storybook/table files untouched since `675a151`). Changed files only add `react-refresh/only-export-components` warnings, the pattern already used for exported pure helpers |

- **Test count**: backend `@Test` 144 → 233 (+89; `CategoryBreakdownAssemblerTest`'s 6 cases ported, not lost); frontend `it(` occurrences 113 → 212 by grep (vitest: 251 run at HEAD). No test count decrease; removed test lines are only mock-shape updates (no assertion weakened).
- **Skipped**: none.

---

## Code Quality

| Principle | Status |
| --------- | ------ |
| Minimum code / no scope creep | ✅ (one extra rule beyond spec - owner on a root whose children have per-member limits → 400 - is a necessary consequence of P3 AC 2 + P2 AC 10) |
| Surgical changes | ✅ old dialog/assembler removed as the design required |
| Matches patterns (typed exceptions, `GlobalExceptionHandler`, `@Valid`, service hooks, zod forms) | ✅ |
| Spec-anchored outcome check | ⚠️ see gaps |
| Per-layer Coverage Expectation | ❌ `/spending` route lacks the per-member / owned / former-member cases (matrix: "routes … happy + every listed edge case") |
| Every test maps to an AC / edge / Done-when | ✅ |
| Documented guidelines | `CLAUDE.md`, `.specs/codebase/TESTING.md` |

---

## Fix Plans

### Fix 1 (Major): Former owner not marked in the Categories tab - P3 AC 7 / CAT-14
- **Root cause**: `CategorySpendingDto` (`backend/src/main/java/com/lcs/findraco/dtos/response/CategorySpendingDto.java:22-23,38-40`) exposes `ownerId`/`ownerName` only; `CategoryTreeRow.tsx:137-138` renders the name with no dormancy marker. The spec's Assumptions table requires ownership of a former member to be "shown greyed as 'former member' in the tab".
- **Fix task**: add `ownerActive` to `CategorySpendingDto` (from the active member ids the assembler already has) and the TS `CategorySpending` type; render the owner badge greyed with "Former member" when `ownerActive === false`. Assembler unit test: dormant owner row has `ownerActive == false` (extend `dormantOwnerStillAttributesTheirSpend`).
- **Done when**: assembler test asserts `ownerActive` false for a dormant owner and true otherwise; build green.

### Fix 2 (Major): No end-to-end IT for per-member and owned spend through `/spending`
- **Root cause**: `CategorySpendingIT` seeds no per-member limits, owner or former member; `CategorySpendingService.members()` / `findAllByPlanWithDetails` / the active-member wiring are only exercised by hand-built rows in the pure assembler test.
- **Fix task**: add `CategorySpendingIT` cases mirroring the P2 and P3 Independent Tests: (a) Groceries 260/140, a 50/50 R$100 transaction → row limit 400, members 50/50 with limits 260/140; (b) remove the partner → their member row `active=false`, row limit 260; (c) owned "Professional" with a 70/30 transaction → row `spent` = owner's 70.
- **Done when**: those ITs pass under `./mvnw verify`.

### Fix 3 (Decision): P1 Sub AC 17 deviation
- The dialog sends a delete without target first and asks for a target only after the 409. Either accept and amend AC 17 ("…SHALL ask for a target category before moving any reference"), or add a reference-count endpoint and ask up front. Orchestrator should ask the user.

---

## Spec-precision gaps

1. **P2 AC 4** - percentage display rounding is not specified (implementation: one decimal, `CategoryFormSheet.tsx` `memberLimitShares`; test asserts 65 / 35 only).
2. **P3 AC 6** - unspecified what happens when the user switches from an owned category to an unowned one after the default was applied (implementation keeps the owner as participant), and whether the default applies in edit mode (implementation: create/duplicate only).

---

## Pending (tunnel)

Run `cd backend && ./mvnw verify` once the DB tunnel is up. Then:

1. Run every `*IT` in the diff: `MigrationsIT`, `CategoryHierarchyIT`, `CategoryDeleteIT`, `CategorySpendingIT`, `TransactionCategoryFilterIT`, `DashboardPartitionIT`, `CategoryMemberLimitIT`, `CategoryOwnerIT`, plus `FinSightApplicationTests` and the JaCoCo branch rule.
2. Run these IT-layer mutations (each must be killed):
   - `FinancialTransactionCategoryService.resolveParent`: drop `parent.getParent() != null` check → `CategoryHierarchyIT` parent-is-child 400.
   - `update`: drop `hasChildren && dto.getType() != …` → type-change 400.
   - `delete`: move the `existsByParent` check after reassignment / remove it → `CategoryDeleteIT` 409 parent.
   - `delete`: remove `recurrenceDefinitionRepository.reassignCategory(...)` → reassign test (definition still on source / FK error).
   - `resolveReassignTarget`: drop the child-target check → 400 own-child target.
   - `GlobalExceptionHandler`: map `CategoryInUseException` to 400 instead of 409 → in-use 409.
   - `replaceMemberLimits`: allow a former member's amount to change → `changingAFormerMembersAmountIsRejectedWith400`.
   - `replaceMemberLimits`: remove the `removeIf` → set-replace and former-entry removal tests.
   - `resolveOwner`: return `stored` for any id (no active check) → `formerMemberCannotBecomeTheOwnerOfAnotherCategory`.
   - `FinancialTransactionSpecification.categoryInTree`: drop the parent-id branch → `TransactionCategoryFilterIT`.
   - `CategorySpendingService.members()`: pass `Set.of()` as active ids → **expected to survive today** (no IT covers per-member rows through `/spending`); Fix 2 must kill it.
   - `CategorySpendingService.facts`: apply the member filter before allocation → `DashboardPartitionIT.memberFilterAppliesToItemPortions`.
3. T20 manual check of a 2-member category in the tab, then interactive UAT for the tab (P1 AC 1, 3, 6-9; CAT-08 expand), which have no automated UI test by design.

---

## Requirement Traceability Update

| Requirement | New status |
| ----------- | ---------- |
| CAT-01, CAT-02, CAT-03 | Verified (unit) · IT pending |
| CAT-04, CAT-05 | Static only · UAT pending |
| CAT-06, CAT-09, CAT-10 | IT pending (CAT-10 AC 17 deviation awaiting decision) |
| CAT-07, CAT-08 | Verified (unit) · IT pending |
| CAT-11, CAT-12, CAT-13 | Verified (unit/FE) · IT pending · Fix 2 |
| CAT-14 | ❌ Needs fix (Fix 1) · IT pending |
| CAT-15 | IT pending |
| CAT-16 | Verified (unit) · Fix 2 |
| CAT-17 | Verified (unit) |

---

## Summary

**Overall**: ❌ Not ready

**Spec-anchored check**: 1 AC gap, 1 deviation, 2 spec-precision gaps; all IT-backed criteria statically match but are pending.
**Sensor**: 24/24 killed (runnable layers).
**Gate**: backend unit 90 / 0 failed, frontend 251 / 0 failed, build ok, 0 new lint errors; `./mvnw verify` pending.

**What works**: item-aware per-member allocation (cent-exact), two-level rollup and independent child limits, dormancy in the assembler, form schema rules, owner default participant, period persistence, grouped picker, delete-target eligibility.

**Next steps**: Fix 1 and Fix 2 → decide Fix 3 with the user → run `./mvnw verify` + the Pending mutations → re-verify.
