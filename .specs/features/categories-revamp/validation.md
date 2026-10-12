# Categories Revamp Validation

## Validation: categories-revamp - FAIL

**Result**: FAIL (iteration 2) - one minor gap. The amended P2 AC 4 clause "0 when the total is 0" has no assertion, and its mutant survives (`CategoryFormSheet.tsx:235`). Everything else passes. The full gate is green: `./mvnw verify` 238 run with 0 failed, JaCoCo met; frontend 268 passed. All 5 iteration-1 fixes are verified, and 18 of the 19 backend IT-layer mutants were killed by the ITs. The 19th, M19, is killed by the unit test.

**Date**: 2026-10-12
**Spec**: `.specs/features/categories-revamp/spec.md` (amended in `50472da`: P1 Sub AC 17/18, P2 AC 4, P3 AC 6)
**Diff range**: `main...feat/categories-revamp` (feature commits `e756dda`/`675a151`..`e027f5c`, HEAD `e027f5c`)
**Verifier**: independent sub-agent (author ≠ verifier), iteration 2 of max 3

### Iteration history

- **Iteration 1 (FAIL, `c6aebdb`)**: there were 3 problems.
  - Gap 1: a former owner was not marked in the tab (P3 AC 7).
  - Gap 2: no `/spending` IT covered per-member or owned rows.
  - Deviation: the delete dialog probed with a targetless delete (P1 Sub AC 17).

  There were also 2 spec-precision gaps, and every `*IT` was pending because the DB tunnel was down. The fixes are `7858a34` (F1 `ownerActive`), `e290a9f` (F2 `/spending` ITs), `8e8fa45` (F3 usage endpoint), `a805acd` (F4 dialog reads the usage counts), `21194f5` (F5 participants follow the category) and the spec amendment `50472da`. `e027f5c` made `MigrationsIT` accept the `BASELINE` state for the baseline row only.
- **Iteration 2 (this report)**: all of the above are verified. One new minor gap was found through the amended P2 AC 4.

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
| 4 (amended) | read-only %, **one decimal**, **0 when total is 0** | `CategoryFormSheet.test.ts:282` 65/35, `:297-303` 33.3/66.7. **No assertion for a zero total**: mutant F7 (removing `total === 0 ? 0 :` at `CategoryFormSheet.tsx:235`, which yields `NaN`) **survived** | ❌ GAP (minor) |
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
- ❌ 1 minor gap: the zero-total clause of P2 AC 4.
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
| M18/M19 | `CategorySpendingAssembler` owned row | inactive owner → `ownerActive = null` instead of `false` | ⚠️ **survives `CategorySpendingIT`**, because `JsonNode.asBoolean()` reads null as false (`CategorySpendingIT.java:259,263`). ✅ Killed by the unit tests `CategorySpendingAssemblerTest.dormantOwnerStillAttributesTheirSpend:526` and `formerOwnerIsReportedInactiveOnTheRootAndItsChildren:541` |

**Frontend (unit project, fix commits)**

| # | File | Mutation | Killed by |
| - | ---- | -------- | --------- |
| F1 | `TransactionFormDrawer.tsx:304` | drop the `mode === "edit"` guard | ✅ "never changes the participants in edit mode" |
| F2 | `TransactionFormDrawer.tsx:305` | no fallback to the defaults | ✅ 4 "restores the default participants…" tests |
| F3 | `TransactionFormDrawer.tsx:304` | ignore `participantsTouched` | ✅ "changes nothing after a manual participant edit" |
| F4 | `DeleteCategoryDialog.tsx:47` | recurrences ignored by `isCategoryInUse` | ✅ 2 tests |
| F5 | `DeleteCategoryDialog.tsx:61` | submit a plain delete while the counts are unknown | ✅ "cannot submit before the usage counts are known" |
| F6 | `useFinancialTransactionCategoryService.ts:88` | wrong usage URL | ✅ "GETs the plan-scoped usage counts of the category" |
| F7 | `CategoryFormSheet.tsx:235` | drop the `total === 0 ? 0 :` guard (0/0 → `NaN`) | ❌ **Survived** (268/268 passed) |

**Sensor depth**: expanded (≥5; core domain / data integrity).

**Result**: 26 injected, 25 killed, 1 survived (F7). M18/M19 counts as killed at suite level. The 24 iteration-1 mutants (unit layer) were not re-run, because their code is unchanged except for the F1 assembler line, which M14/M19 cover.

---

## Code Quality

| Principle | Status |
| --------- | ------ |
| Minimum code / surgical / no scope creep | ✅ The fix commits touch only what F1-F5 required |
| Matches patterns | ✅ Typed DTO, `PlanContext`, service hook + query key, `buildMutationOptions` invalidation. Cosmetic: the `@Operation` after the new usage endpoint is over-indented by 4 spaces (`FinancialTransactionCategoryController.java:62`) |
| Spec-anchored outcome check | ⚠️ P2 AC 4 zero-total clause not asserted |
| Per-layer coverage (routes: happy + edge + error) | ✅ `/spending` now covers per-member, owned and former-member cases; `/usage` covers happy, zero and foreign 404 |
| Every test maps to an AC / edge / Done-when | ✅ |
| Guidelines | `CLAUDE.md`, `.specs/codebase/TESTING.md` |

Doc nit: the F4 text in `tasks.md:751` names the query key `["financialTransactionCategoryUsage", …]`, but the code and its test use `["categoryUsage", planId, id]`.

---

## Fix Plans

### Fix 1 (Minor): assert the zero-total share (P2 AC 4, amended)
- **Root cause**: the `total === 0 ? 0 :` branch in `memberLimitShares` (`frontend/src/features/home/components/categories/CategoryFormSheet.tsx:235`) has no test, so removing it (which produces `NaN%`) goes unnoticed.
- **Fix task**: in `CategoryFormSheet.test.ts` under `describe("memberLimitShares")`, add `it("reports 0 for every member when the total is 0")` with two active rows of `maskCurrency("0")` and expect `shares.get(10)` and `shares.get(20)` to be `0`.
- **Done when**: mutant F7 is killed and `npm test` is green.

### Optional hardening (non-blocking)
- `CategorySpendingIT.java:259,263`: assert `row.get("ownerActive").isBoolean()` (or use `isEqualTo(BooleanNode.FALSE)`), so the IT also rejects `null`. The unit test already covers this.

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
| CAT-01, CAT-02, CAT-03, CAT-06, CAT-07, CAT-09, CAT-10, CAT-12, CAT-13, CAT-14, CAT-15, CAT-16, CAT-17 | ✅ Verified (presentational parts → UAT) |
| CAT-04, CAT-05, CAT-08 | ✅ Verified at API/logic level · UI by UAT |
| CAT-11 | ❌ Needs fix (Fix 1: zero-total share assertion) |

---

## Summary

**Overall**: ❌ Not ready. One minor gap, which needs a one-test fix.

**Spec-anchored check**: 1 gap (P2 AC 4 zero-total). Every other AC matches the spec outcome, or is static and in the UAT list.
**Sensor**: 26 injected, 25 killed, 1 survived (F7).
**Gate**: backend 238 passed / 0 failed (JaCoCo met); frontend 268 passed / 0 failed; build ok; 0 new lint errors.

**Next steps**: Fix 1 → re-verify (iteration 3: re-run F7 and `npm test`) → interactive UAT → tick the `tasks.md` full-gate boxes.
