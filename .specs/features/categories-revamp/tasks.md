# Categories Revamp Tasks

## Execution Protocol (MANDATORY -- do not skip)

Implement these tasks with the `tlc-spec-driven` skill: **activate it by name and follow its Execute flow and Critical Rules.** Do not search for skill files by filesystem path. The skill is the source of truth for the full flow (per-task cycle, sub-agent delegation, adequacy review, Verifier, discrimination sensor).

**If the skill cannot be activated, STOP and tell the user - do not proceed without it.**

---

**Design**: `.specs/features/categories-revamp/design.md`
**Status**: Approved (2026-10-12)

---

## Test Coverage Matrix

> Generated from codebase, project guidelines, and spec - confirm before Execute. Guidelines found: `CLAUDE.md`, `.specs/codebase/TESTING.md`, `backend/pom.xml` (JaCoCo branch ≥ 0.80 on invariant classes), `frontend/package.json` (vitest `unit` project).

| Code Layer | Required Test Type | Coverage Expectation | Location Pattern | Run Command |
| ---------- | ------------------ | -------------------- | ---------------- | ----------- |
| Backend pure logic (allocator, assembler) | unit (JUnit 5, no Spring) | All branches; 1:1 to spec ACs; every listed edge case; JaCoCo branch ≥ 0.80 | `backend/src/test/java/com/lcs/findraco/services/*Test.java` | `./mvnw test -Dtest=<Name>Test` |
| Backend service / controller / repository / migration | integration (`*IT` extends `AbstractIntegrationTest`, MockMvc, real JWT) | All routes in scope: happy + every listed edge case + error paths with exact status | `backend/src/test/java/com/lcs/findraco/**/*IT.java` | `./mvnw verify` (needs DB tunnel; empties `dev_finsight`) |
| Frontend pure logic, schemas, mappers, hooks | unit (vitest, jsdom, `renderHook` + real `QueryClient`) | Every AC the unit owns: happy + edge + failure | co-located `*.test.ts(x)` | `npm run test` |
| Frontend presentational wiring (tab, rows, chart) | none | build gate (logic lives in tested helpers/hooks) | - | build gate |

## Gate Check Commands

> Generated from codebase - confirm before Execute. Backend from `backend/`, frontend from `frontend/`.

| Gate Level | When to Use | Command |
| ---------- | ----------- | ------- |
| Quick | Tasks with unit tests only | backend: `./mvnw test -Dtest='<Name>Test'` · frontend: `npm run test` |
| Full | Tasks with backend integration tests | `./mvnw verify` |
| Build | Phase completion or wiring-only tasks | backend: `./mvnw verify` · frontend: `npm run lint && npm run build && npm run test` |

---

## Execution Plan

Phases run in order; tasks within a phase run in order. Each phase ships a usable slice (P1 backend, P1 frontend, P2, P3).

### Phase 1: Backend core (P1: hierarchy, delete, spend tree)

```
T1 → T2 → T3 → T4 → T5 → T6 → T7 → T8
```

### Phase 2: Frontend core (P1: tab, form, delete, picker, chart)

```
T9 → T10 → T11 → T12 → T13 → T14 → T15 → T16
```

### Phase 3: Per-member limits (P2)

```
T17 → T18 → T19 → T20
```

### Phase 4: Owned categories (P3)

```
T21 → T22 → T23 → T24
```

---

## Task Breakdown

<!-- Phase 1: Backend core (P1: hierarchy, delete, spend tree) -->

### T1: Schema V10 + entities

**What**: Flyway `V10__category_hierarchy_owner_member_limits.sql` (design DDL) plus `parent`/`owner`/`memberLimits` on `FinancialTransactionCategory` and the new `CategoryMemberLimit` entity + repository.
**Where**: `backend/src/main/java/com/lcs/findraco/models/FinancialTransactionCategory.java`
**Depends on**: None
**Reuses**: V6/V7 migration style; `TransactionParticipant` mapping
**Requirement**: CAT-06, CAT-11, CAT-15

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [x] Migration applies on the full Flyway chain; `ddl-auto=validate` passes
- [x] `MigrationsIT` asserts existing categories become roots with no owner and no member limits (written, not run)
- [x] Unique `(category_id, member_user_id)` and `amount >= 0` constraints rejected at DB level (IT) (written, not run)
- [x] Full gate passes

> SPEC_DEVIATION: migration is `V11__category_hierarchy_owner_member_limits.sql`; `V10` was already taken by `V10__create_password_reset_tokens.sql`.

**Tests**: integration
**Gate**: full

---

### T2: Hierarchy rules on create/update

**What**: `parentId` on the category request/response DTOs and the hierarchy rules in `FinancialTransactionCategoryService` (parent in plan → 404; parent is a child, category with children gets a parent, type ≠ parent, type change with children → 400), with typed exceptions mapped in `GlobalExceptionHandler`.
**Where**: `backend/src/main/java/com/lcs/findraco/services/FinancialTransactionCategoryService.java`
**Depends on**: T1
**Reuses**: `findById` privacy rule, `PlanAuthorization`
**Requirement**: CAT-06

**Tools**:

- MCP: NONE
- Skill: `backend-exceptions`, `backend-endpoint`

**Done when**:

- [x] New `CategoryHierarchyIT`: one test per AC of P1 Sub 1–6 with the exact status code (written, not run)
- [x] Non-OWNER create/update with `parentId` still rejected as today (written, not run)
- [x] Full gate passes

**Tests**: integration
**Gate**: full

---

### T3: Delete with reassignment

**What**: `DELETE ...?reassignTo=` : children → 409; in use without target → 409 with counts; valid target → bulk move of transactions, items and recurrence definitions, then delete, in one transaction; invalid target (self, own child, other type) → 400; target not in plan → 404.
**Where**: `backend/src/main/java/com/lcs/findraco/services/FinancialTransactionCategoryService.java`
**Depends on**: T2
**Reuses**: Existing delete flow; repository bulk `@Modifying` queries
**Requirement**: CAT-10

**Tools**:

- MCP: NONE
- Skill: `backend-exceptions`, `backend-endpoint`

**Done when**:

- [x] `CategoryDeleteIT` covers: unused delete 204; parent with children 409; in use without target 409 with counts; reassign moves all three reference kinds then 204; each invalid target 400; foreign target 404 (written, not run)
- [x] Failure midway leaves every reference unchanged (rollback asserted) (written, not run)
- [x] Full gate passes

**Tests**: integration
**Gate**: full

---

### T4: ItemShareAllocator

**What**: Pure class allocating each categorized item's amount across the transaction's participants in integer cents by largest remainder (ties by member id), producing B and I facts per category × member.
**Where**: `backend/src/main/java/com/lcs/findraco/services/ItemShareAllocator.java`
**Depends on**: T3
**Reuses**: `SplitResolver` cents arithmetic
**Requirement**: CAT-12

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [x] `ItemShareAllocatorTest`: 60/40 split on a R$ 30 item → 18/12; R$ 10 over 33.34/33.33/33.33 sums to exactly 10.00; tie broken by member id; single participant gets all; zero-amount transaction handled
- [x] Class added to the JaCoCo branch ≥ 0.80 rule in `backend/pom.xml` (branch coverage 22/22)
- [x] Quick gate passes (7 passed, 0 failed)

**Tests**: unit
**Gate**: quick

---

### T5: CategorySpendingAssembler (tree, rollup, plain limits)

**What**: Pure assembler: leaf `A − B + I` per category × member, two-level rollup (parent = own + children, child = own), plain-limit evaluation, every category present with zero spend; replaces `CategoryBreakdownAssembler` (tests ported first, then the old class and its JaCoCo include removed).
**Where**: `backend/src/main/java/com/lcs/findraco/services/CategorySpendingAssembler.java`
**Depends on**: T4
**Reuses**: `CategoryBreakdownAssembler` + its tests; `CategoryBreakdownDto` limit math
**Requirement**: CAT-02, CAT-07

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [x] Every case of `CategoryBreakdownAssemblerTest` ported and passing against the new class (6/6, via `assembleOverview`)
- [x] New cases: parent rolls up children; child evaluated alone; parent without limit + child with limit; zero-spend rows; R$ 0 limit with R$ 0 spend not over
- [x] JaCoCo include switched to the new class; branch ≥ 0.80 (24/26 = 0.92)
- [x] Quick gate passes (13 passed, 0 failed; old test still 6/6)

> Note: `DashboardService` still calls `CategoryBreakdownAssembler` until T6 rewires it, so the old class and `CategoryBreakdownAssemblerTest` are deleted in T6 (all cases already ported here).

**Tests**: unit
**Gate**: quick

---

### T6: CategorySpendingService + dashboard delegation

**What**: Fact queries (`findCategoryMemberFacts`, `findCategorizedItemParticipantRows`), categories fetched with `parent`/`owner`/`memberLimits` in one query, active member ids, and `CategorySpendingService.compute`; `DashboardService.buildCategoryBreakdown` delegates to it and `CategoryBreakdownDto` gains `categoryId`, `parentId`, `children`.
**Where**: `backend/src/main/java/com/lcs/findraco/services/CategorySpendingService.java`
**Depends on**: T5
**Reuses**: `DashboardService`, `PlanMembershipRepository.findAllByPlan`
**Requirement**: CAT-07, CAT-08, CAT-12

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [x] `DashboardPartitionIT` still passes unchanged for flat data (top-line totals and per-category numbers identical)
- [x] New IT cases: parent rollup in the dashboard; member filter now applies to item portions (gap at `DashboardService.java:73-76` closed) (written, not run)
- [x] Full gate passes

> Note: `CategoryBreakdownAssembler`, its test (ported in T5) and the three old category queries are removed here, now that the dashboard no longer uses them. Active member ids are not fetched yet: nothing reads them before T18.

**Tests**: integration
**Gate**: full

---

### T7: Spending endpoint

**What**: `GET {FINANCIAL_TRANSACTION_CATEGORY}/spending?startDate&endDate` returning `List<CategorySpendingDto>` (DEBIT and CREDIT trees, zero-spend included).
**Where**: `backend/src/main/java/com/lcs/findraco/controllers/FinancialTransactionCategoryController.java`
**Depends on**: T6
**Reuses**: Controller conventions (`PlanContext`, response DTO)
**Requirement**: CAT-01, CAT-02

**Tools**:

- MCP: NONE
- Skill: `backend-endpoint`

**Done when**:

- [x] `CategorySpendingIT`: tree shape grouped by type, children nested, spend/limit/percent/overLimit per row; VIEWER can read; non-member gets 404 (written, not run)
- [x] Full gate passes

**Tests**: integration
**Gate**: full

---

### T8: Transaction filter includes children

**What**: `categoryId` filter in `FinancialTransactionSpecification` matches the category or any child of it.
**Where**: `backend/src/main/java/com/lcs/findraco/specifications/FinancialTransactionSpecification.java`
**Depends on**: T7
**Reuses**: `categoryEquals`
**Requirement**: CAT-09

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [x] `TransactionCrudIT` (or new IT) case: filtering by a parent returns parent and child transactions; filtering by a child returns only the child's (new `TransactionCategoryFilterIT`, written, not run)
- [x] Full gate passes

**Tests**: integration
**Gate**: full

---

<!-- Phase 2: Frontend core (P1: tab, form, delete, picker, chart) -->

### T9: Category DTOs and service hooks

**What**: Wire types from the design, `useGetCategorySpending`, delete with `reassignTo`; every category mutation invalidates `categories`, `categorySpending` and `dashboard`.
**Where**: `frontend/src/api/services/useFinancialTransactionCategoryService.ts`
**Depends on**: None (after Phase 1)
**Reuses**: Existing category service hooks, `buildMutationOptions`
**Requirement**: CAT-01, CAT-10

**Tools**:

- MCP: NONE
- Skill: `api-integration`

**Done when**:

- [x] Hook tests: spending query key includes plan and range; delete sends `reassignTo` only when given; invalidations asserted
- [x] Quick gate passes (148 passed, 0 failed)

> Note: the dashboard query key is `dashboardSummary`; delete variables are now `{ id, reassignTo? }`. A delete with `reassignTo` also invalidates `financialTransactions` (their category changed). SPEC_DEVIATION: `parentId` is optional on the TS type so partial category shapes in transaction forms still type-check.

**Tests**: unit
**Gate**: quick

---

### T10: Categories tab in home filters

**What**: `HomeTab` gains `"categories"`; `CategoriesFilters` (`period`, `customRange`) parsed/serialized with `categoriesPeriod*` params and persisted like the other tabs.
**Where**: `frontend/src/features/home/filters/homeFilterParams.ts`
**Depends on**: T9
**Reuses**: M5-03 codec and `useHomeFilters`
**Requirement**: CAT-03

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [x] Round-trip and fallback tests for the new params; tab param accepts `categories`; saved state restores the categories period
- [x] Quick gate passes (165 passed, 0 failed)

**Tests**: unit
**Gate**: quick

---

### T11: Shared month scaling helper

**What**: Extract the month-count / limit-scaling logic from `OverviewTab` into a pure helper used by Overview and the Categories tab.
**Where**: `frontend/src/features/home/utils/scaleLimits.ts`
**Depends on**: T10
**Reuses**: `scaledCategoryBreakdown` in `OverviewTab.tsx`
**Requirement**: CAT-02, CAT-03

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [x] Unit tests: 1-month, 3-month and custom ranges scale limits like today; Overview output unchanged
- [x] Quick gate passes (179 passed, 0 failed)

**Tests**: unit
**Gate**: quick

---

### T12: CategoryFormSheet (type, name, parent, single limit)

**What**: New form replacing `CategoryFormDialog`: zod schema + `buildDefaultValues`/`toPayload`; parent options are roots of the same type, excluding itself; parent field disabled while the category has children.
**Where**: `frontend/src/features/home/components/categories/CategoryFormSheet.tsx`
**Depends on**: T11
**Reuses**: `CategoryFormDialog.tsx`
**Requirement**: CAT-06

**Tools**:

- MCP: NONE
- Skill: `form-creation`

**Done when**:

- [x] Schema/mapper tests: parent options filtered by type and root-ness; type change blocked with children; CREDIT clears limit; payload shape matches the API
- [x] Quick gate passes (200 passed, 0 failed)

> Note: the file also exports `CategoryFormSheetProvider` / `useCategoryFormSheet` (openCreate/openEdit), the replacement for `CategoryFormDialogProvider`; T14 mounts it and deletes the dialog.

**Tests**: unit
**Gate**: quick

---

### T13: DeleteCategoryDialog

**What**: Delete confirmation that, for an in-use category, requires a target from a pure `eligibleDeleteTargets` (same type, not itself, not its children) and explains the children rule on 409.
**Where**: `frontend/src/features/home/components/categories/DeleteCategoryDialog.tsx`
**Depends on**: T12
**Reuses**: `useConfirm` patterns
**Requirement**: CAT-10

**Tools**:

- MCP: NONE
- Skill: `component-creation`

**Done when**:

- [x] Unit tests for `eligibleDeleteTargets`; dialog cannot submit an in-use delete without a target
- [x] Quick gate passes (211 passed, 0 failed)

> SPEC_DEVIATION: no endpoint reports reference counts, so "in use" is learned from the API's 409 on a first delete without target (which deletes nothing); the dialog then requires a target before sending `reassignTo`.

**Tests**: unit
**Gate**: quick

---

### T14: CategoriesTab + tree rows + home wiring

**What**: `CategoriesTab` (period picker, Expenses/Income sections, OWNER-only actions) and `CategoryTreeRow`; third tab in `HomePage`; Transactions tab "Manage categories" opens the tab; `CategoriesManageDialog` and `CategoryFormDialog` deleted.
**Where**: `frontend/src/features/home/components/categories/CategoriesTab.tsx`
**Depends on**: T13
**Reuses**: Overview period picker, `cn`/`cva`
**Requirement**: CAT-01, CAT-02, CAT-04, CAT-05

**Tools**:

- MCP: NONE
- Skill: `component-creation`, `feature-structure`

**Done when**:

- [x] Tab order Overview, Transactions, Categories; VIEWER sees no actions; over-limit rows marked
- [x] No imports of the deleted dialogs remain
- [x] Build gate passes (build ok; 211 tests; lint: 0 new errors, 23 pre-existing errors in stories/table files)

> Note: the Overview period buttons were extracted into `components/PeriodPicker.tsx` and shared with the tab. `CategoryFormSheetProvider` replaces `CategoryFormDialogProvider` in `AppProvider`; the combobox now opens the sheet (its edit/delete paths go in T15).

**Tests**: none
**Gate**: build

---

### T15: Grouped CategoryCombobox

**What**: Options grouped by parent (pure `groupCategoryOptions`), both levels selectable; quick create gains a parent field; edit/delete removed.
**Where**: `frontend/src/features/home/components/transactions/CategoryCombobox.tsx`
**Depends on**: T14
**Reuses**: Current combobox search/quick create
**Requirement**: CAT-09

**Tools**:

- MCP: NONE
- Skill: `component-creation`

**Done when**:

- [x] Unit tests for `groupCategoryOptions` (children under parents, orphans as roots, search keeps a matching child's parent visible)
- [x] No edit/delete paths left in the combobox
- [x] Quick gate passes (218 passed, 0 failed)

> Note: the combobox now loads the plan's categories once (size 100, by type) and searches on the client, so a child's parent is always known; quick create opens `CategoryFormSheet` (which has the parent field). The transaction filter popover (also named by CAT-09 AC 13) uses the same grouping, with children labelled "Parent › Child".

**Tests**: unit
**Gate**: quick

---

### T16: Grouped Overview chart

**What**: `CategorySpendingChart` shows roots with rolled-up spend; clicking a root expands its children.
**Where**: `frontend/src/features/home/components/overview/CategorySpendingChart.tsx`
**Depends on**: T15
**Reuses**: Existing chart entries/status logic
**Requirement**: CAT-08

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [x] Expand/collapse works on roots with children; roots without children unchanged
- [x] Build gate passes (build ok; 218 tests; lint: 0 new errors, 23 pre-existing)

**Tests**: none
**Gate**: build

---

<!-- Phase 3: Per-member limits (P2) -->

### T17: Member limits API and rules

**What**: `memberLimits` on request/response (with `active`, `effectiveLimit`), replaced as a set; rules: non-active member, duplicate, negative, CREDIT, owned → 400; plain limit ignored while entries exist; dormant entries kept unless the OWNER omits them explicitly.
**Where**: `backend/src/main/java/com/lcs/findraco/services/FinancialTransactionCategoryService.java`
**Depends on**: None (after Phase 2)
**Reuses**: T2 rules pattern
**Requirement**: CAT-11, CAT-13, CAT-14

**Tools**:

- MCP: NONE
- Skill: `backend-exceptions`

**Done when**:

- [x] `CategoryMemberLimitIT`: one test per P2 AC 1–3, 7–10 and 11–13; member removed then re-invited → entry active again with the same amount (17 tests, written, not run)
- [x] Full gate passes

> Note: `memberLimits` omitted (null) keeps the stored entries; a list (even empty) replaces them as a set. A former member's entry is kept when sent back unchanged, deleted when omitted, and rejected (400) when its amount changes. While entries exist the stored plain limit is cleared. Category endpoints now return DTOs built in the service (active member ids are needed for `active`/`effectiveLimit`); the category embedded in transaction responses leaves `memberLimits`/`effectiveLimit` null. Until T21, the "owned" rule reads the stored owner (or the parent's).

**Tests**: integration
**Gate**: full

---

### T18: Assembler: per-member limits and dormancy

**What**: Effective limit = sum of active entries; per-member rows with own spend vs. own limit; dormant entries shown, excluded from sum and evaluation; member filter shows that member's limit.
**Where**: `backend/src/main/java/com/lcs/findraco/services/CategorySpendingAssembler.java`
**Depends on**: T17
**Reuses**: T5 assembler
**Requirement**: CAT-11, CAT-12, CAT-14

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [x] Unit tests: 260/140 → limit 400, 65/35 percent; 50/50 R$ 100 adds 50 each; member without entry counts in total only; dormant entry excluded; member-filtered row uses the member's limit; parent per-member rollup
- [x] Quick gate passes (23 passed, 0 failed; branch coverage 41/44 incl. nested records)

> Note: the 65/35 share is not a backend field: the rows carry 260/140 and the share percent is computed read-only in the form (T19). A dormant member row keeps its amount as `limit` but `remaining`/`percentUsed`/`overLimit` are null. `CategorySpendingService` now fetches active member ids via `PlanMembershipRepository.findAllByPlan`; the Overview also lists a category whose only limit is per member.

**Tests**: unit
**Gate**: quick

---

### T19: Form: per-member limit mode

**What**: Limit mode single / per member in `CategoryFormSheet`; per-member rows (active members) with read-only percent; former-member entries listed with remove.
**Where**: `frontend/src/features/home/components/categories/CategoryFormSheet.tsx`
**Depends on**: T18
**Reuses**: T12 form
**Requirement**: CAT-11, CAT-14

**Tools**:

- MCP: NONE
- Skill: `form-creation`

**Done when**:

- [x] Schema/mapper tests: duplicate member rejected; negative rejected; percent computed; disabled for CREDIT and owned; removing a former member drops it from the payload
- [x] Quick gate passes (233 passed, 0 failed)

> Note: the limit UI lives in a new `CategoryLimitFields.tsx` (mode toggle, one row per active member, former members greyed with remove). Existing `CategoryFormSheet.test.ts` fixtures/expectations gained the new `limitMode`/`memberLimits` fields (shape change, no assertion weakened). Single mode sends `memberLimits: []` (clears entries). Until T23, "owned" is read from the stored owner of the category or its parent.

**Tests**: unit
**Gate**: quick

---

### T20: Tree rows: per-member breakdown

**What**: `CategoryTreeRow` expands per-member rows (spend, limit, usage, over-limit); former members greyed.
**Where**: `frontend/src/features/home/components/categories/CategoryTreeRow.tsx`
**Depends on**: T19
**Reuses**: T14 row
**Requirement**: CAT-12, CAT-14

**Tools**:

- MCP: NONE
- Skill: `component-creation`

**Done when**:

- [ ] Build gate passes; manual check of a 2-member category in the tab — PENDING: manual check needs the API + DB tunnel (build gate passed)
- [x] Build gate passes (build ok; 237 tests; lint: 0 new errors, 23 pre-existing)

> Note: per-member rows open from a members toggle on the row; former members are greyed with a "Former member" badge and no usage. `scaleTreeLimits` now also scales `members[].limit` via a tested `scaleMemberLimit` (a former member's amount is scaled but never evaluated).

**Tests**: none
**Gate**: build

---

<!-- Phase 4: Owned categories (P3) -->

### T21: Owner API and rules

**What**: `ownerId` on request, `ownerId`/`ownerName`/`ownerActive` on response; owner only on roots (child → 400), owner must be an active member (400), children inherit on read; dormant ownership kept and re-applied on rejoin.
**Where**: `backend/src/main/java/com/lcs/findraco/services/FinancialTransactionCategoryService.java`
**Depends on**: None (after Phase 3)
**Reuses**: T17 rules pattern
**Requirement**: CAT-14, CAT-15

**Tools**:

- MCP: NONE
- Skill: `backend-exceptions`

**Done when**:

- [x] `CategoryOwnerIT`: one test per P3 AC 1–4, 7, 8; removed owner shows `ownerActive=false`, rejoin restores it (12 tests, written, not run)
- [x] Full gate passes

> Note: `ownerId` follows the full-replace PUT (null clears it), so `CategoryMemberLimitIT`'s owned-category update now resends `ownerId`. A former owner is kept only when sent back unchanged. Setting an owner on a root whose children have per-member limits is rejected (400) since children inherit the owner. The category embedded in transaction responses also carries `ownerId`/`ownerName` (`ownerActive` null).

**Tests**: integration
**Gate**: full

---

### T22: Assembler: owned spend

**What**: Owned category (and its children) spend = owner's facts only; limit evaluated against it; other members' shares shown as per-member rows without limit.
**Where**: `backend/src/main/java/com/lcs/findraco/services/CategorySpendingAssembler.java`
**Depends on**: T21
**Reuses**: T18 assembler
**Requirement**: CAT-16

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [x] Unit tests: owner-only spend; inherited by children; non-owner share listed but not counted; dormant owner still attributes historic spend
- [x] Quick gate passes (28 passed, 0 failed; branch coverage 49/52)

> Note: the assembler now also takes `memberNames` (id → name) for the non-owner rows; `CategorySpendingService` builds it from the memberships plus `UserRepository.findAllById` for former members with spend facts.

**Tests**: unit
**Gate**: quick

---

### T23: Form and rows: owner

**What**: Owner select (roots only, active members) in `CategoryFormSheet`; owner badge in tree rows; per-member mode disabled when owned.
**Where**: `frontend/src/features/home/components/categories/CategoryFormSheet.tsx`
**Depends on**: T22
**Reuses**: T19 form
**Requirement**: CAT-15

**Tools**:

- MCP: NONE
- Skill: `form-creation`

**Done when**:

- [x] Schema/mapper tests: owner hidden for children; owner and per-member mode mutually exclusive
- [x] Quick gate passes (246 passed, 0 failed)

> Note: the owner select ("Belongs to") shows only for roots; choosing a parent clears it, and choosing an owner switches the limit to single. The row's owner badge was already in place (T14). The owned check now reads the form's `ownerId` instead of the stored owner, so the T19 owned-category test sets `ownerId: 10` in its values, and the exact-shape fixtures gained `ownerId` (no assertion weakened).

**Tests**: unit
**Gate**: quick

---

### T24: Default participant for owned category

**What**: In `TransactionFormDrawer`, choosing an owned category while the participants field is not dirty sets the owner as the single 100% participant.
**Where**: `frontend/src/features/home/components/transactions/TransactionFormDrawer.tsx`
**Depends on**: T23
**Reuses**: Participant split form state
**Requirement**: CAT-17

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [x] `TransactionFormDrawer.test.ts`: owner applied when untouched; not applied after a manual participant edit; unowned category leaves participants as they are
- [x] Quick gate passes (251 passed, 0 failed; phase build also ok, lint: 0 new errors, 23 pre-existing)

> Note: "participants not dirty" is tracked by a ref set by every attribution change made through `AttributionFields` (its `setValue` calls do not mark RHF dirty state), reset when the form resets. The default applies on create/duplicate only (not edit), and not when the owner left the plan.

**Tests**: unit
**Gate**: quick

---

## Fix tasks (verification iteration 1)

Gaps 1 and 2 from `validation.md` (FAIL, iteration 1); F3–F5 from the spec amendment in `50472da` (P1 Sub AC 17–18, P3 AC 6).

### F1: Former owner shown in the Categories tab

**What**: `ownerActive` (null without an owner) on `CategorySpendingDto`, computed from the active member ids already used for dormancy; children inherit the parent's value. The TS `CategorySpending` type carries it and `CategoryTreeRow` greys the owner badge with "(former member)" when `ownerActive === false`.
**Where**: `backend/src/main/java/com/lcs/findraco/dtos/response/CategorySpendingDto.java`, `backend/src/main/java/com/lcs/findraco/services/CategorySpendingAssembler.java`, `frontend/src/api/dtos/financialTransactionCategory.ts`, `frontend/src/features/home/components/categories/CategoryTreeRow.tsx`
**Depends on**: None
**Reuses**: T22 assembler, T23 owner badge
**Requirement**: CAT-14 (P3 AC 7)

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [x] `CategorySpendingAssemblerTest`: `ownerActive` true for an active owner (root and inheriting child), false for a former owner (root and inheriting child), null without an owner
- [x] Owner badge greyed with "(former member)" when `ownerActive === false` (presentational, no render test by design)
- [x] Quick gate passes (assembler 29 passed, 0 failed; test-compile ok; frontend 251 passed, build ok, lint 23 pre-existing errors, 0 new)

> Note: the badge logic is a one-line inline condition, not a helper, so no frontend unit test was added. Two frontend fixtures gained `ownerActive: null` for the new required field.

**Tests**: unit
**Gate**: quick

---

### F2: `/spending` IT for per-member, owned and former-member rows

**What**: `CategorySpendingIT` cases through the real endpoint: the P2 independent test (Groceries 260/140 → limit 400, a 50/50 R$100 transaction gives each member 50 against their own limit); the P3 independent test (owned row counts the owner's 70 only, the other 30 listed without a limit); a removed member's entry `active=false` and out of the sum, active again with the same amount after rejoining; a removed owner reported `ownerActive=false` on the root and its child, true again after rejoining.
**Where**: `backend/src/test/java/com/lcs/findraco/services/CategorySpendingIT.java`
**Depends on**: F1
**Reuses**: `CategoryMemberLimitIT` / `CategoryOwnerIT` remove and rejoin helpers
**Requirement**: CAT-12 (P2 AC 6), CAT-14 (P2 AC 11-12, P3 AC 7), CAT-16 (P3 AC 5)

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [x] 4 new `CategorySpendingIT` tests covering the cases above; the "service passes an empty active-member set" mutation fails the P2 and P3 tests (`active`, `limit`, `ownerActive` asserted) (written, not run)
- [x] Full gate passes

**Tests**: integration
**Gate**: full

---

### F3: Category usage endpoint

**What**: `GET {FINANCIAL_TRANSACTION_CATEGORY}/{id}/usage` → `CategoryUsageDto { transactions, items, recurrenceDefinitions }` (longs), plan-scoped (404 when not in the plan), readable by any member. Reuses the three `countByCategory` queries the delete already runs for its 409 message (now one shared `usageOf` helper).
**Where**: `backend/src/main/java/com/lcs/findraco/dtos/response/CategoryUsageDto.java`, `backend/src/main/java/com/lcs/findraco/services/FinancialTransactionCategoryService.java`, `backend/src/main/java/com/lcs/findraco/controllers/FinancialTransactionCategoryController.java`, `backend/src/test/java/com/lcs/findraco/services/CategoryDeleteIT.java`
**Depends on**: None
**Reuses**: T3 count queries
**Requirement**: CAT-10 (P1 Sub AC 18)

**Tools**:

- MCP: NONE
- Skill: `backend-endpoint`

**Done when**:

- [x] `CategoryDeleteIT`: counts 2 / 1 / 3 for a category used by each kind (read by a VIEWER); 0 / 0 / 0 for an unused category; 404 for another plan's category (written, not run)
- [x] Full gate passes

**Tests**: integration
**Gate**: full

---

### F4: Delete dialog asks for a target up front

**What**: `useGetCategoryUsage` service hook (key `["categoryUsage", planId, id]`, invalidated by category and transaction mutations). `DeleteCategoryDialog` loads the counts on open, shows them, and requires a target when any count is above zero before sending the delete; the targetless-probe-then-409 flow and its T13 `SPEC_DEVIATION` are removed (an unexpected 409 is shown as an error message).
**Where**: `frontend/src/api/services/useFinancialTransactionCategoryService.ts` (+ test), `frontend/src/api/services/useFinancialTransactionService.ts` (usage invalidation), `frontend/src/api/dtos/financialTransactionCategory.ts`, `frontend/src/features/home/components/categories/DeleteCategoryDialog.tsx` (+ logic test)
**Depends on**: F3
**Reuses**: T13 dialog and target picker
**Requirement**: CAT-10 (P1 Sub AC 17)

**Tools**:

- MCP: NONE
- Skill: `api-integration`

**Done when**:

- [x] Hook test: query key includes plan and id; GET `.../{id}/usage`; not fetched without an id or while closed; invalidated by a category delete
- [x] Logic test: target required iff any count > 0; no delete request before the counts load or without a target when required; counts shown as text (`describeUsage`)
- [x] Quick gate + build pass; lint no new errors (frontend 260 passed, build ok, lint 23 pre-existing errors, 0 new)

> Note: the T13 `buildDeleteRequest` tests were updated, not removed: their input changed from the 409-learned `inUse` flag to the usage counts (amended P1 Sub AC 17). `classifyDeleteError` stays for a 409 raised by a change after the dialog opened (shown as an error, counts reloaded). The T13 `SPEC_DEVIATION` is resolved.

**Tests**: unit
**Gate**: quick + build

---

### F5: Participants follow the selected category

**What**: In `TransactionFormDrawer`, while creating (incl. duplicate) and the participants were not edited by hand, selecting a category sets the participants from it: active owner at 100%, otherwise (no owner, former owner, cleared) the form's default participants. Edit mode never changes participants automatically.
**Where**: `frontend/src/features/home/components/transactions/TransactionFormDrawer.tsx` (+ test)
**Depends on**: None
**Reuses**: T24 owner default
**Requirement**: CAT-16 (P3 AC 6, amended)

**Tools**:

- MCP: NONE
- Skill: `form-creation`

**Done when**:

- [x] Tests (`categoryAttribution`): owned → owner; owned then unowned / cleared / former owner → default; owned then another owned → new owner; duplicate restores the duplicated transaction's participants; after a manual participant edit → no change; edit mode → no change
- [x] Quick gate + build pass; lint no new errors (frontend 268 passed, build ok, lint 23 pre-existing errors, 0 new)

> Note: the T24 test "leaves the participants as they are for an unowned category" was renamed to "has no owner attribution for an unowned category" (assertions unchanged): `ownerDefaultAttribution` still returns null there, and restoring the defaults is now `categoryAttribution`'s job (amended P3 AC 6).

**Tests**: unit
**Gate**: quick + build

---


## UX polish round (2026-10-12)

Spec amendment UX-01..UX-05; design amendment "UX polish round". Batches: Phases 5–6 (U1–U8), Phase 7 (U9–U12).

### Phase 5: UX backend

```
U1 → U2
```

### Phase 6: UX Overview

```
U3 → U4 → U5 → U6 → U7 → U8
```

### Phase 7: UX Categories and Transactions

```
U9 → U10 → U11 → U12
```

<!-- Phase 5: UX backend -->

### U1: Members on every category row

**What**: `CategorySpendingAssembler` lists, for every non-owned category, each member with spend facts or a limit entry (sorted by member id; own limit or null; `active`). Owned categories list every member with spend, owner included, `limit` null; row spend unchanged (owner's).
**Where**: `backend/src/main/java/com/lcs/findraco/services/CategorySpendingAssembler.java`, `backend/src/test/java/com/lcs/findraco/services/CategorySpendingAssemblerTest.java`, `backend/src/test/java/com/lcs/findraco/services/CategorySpendingIT.java`
**Depends on**: None
**Reuses**: T18/T22 assembler
**Requirement**: UX-04 (AC 1)

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [x] Unit: a category without limit entries lists every member with spend; Σ members.spent == row.spent for non-owned rows (root rolled up and child); a member with a limit entry and no spend is listed with spent 0; owned row lists owner and others with limit null and row spend = owner's
- [x] IT: `/spending` returns the members of a plain category with spend for both members
- [x] Full gate passes (unit 95, IT 147 passed, 0 failed; assembler 32)

> Note: members with a zero net share (A - B + I = 0) and no limit entry are not listed, as before for owned rows. Superseded assertions were updated to the amended outcome (UX-04 AC 1), not removed: `memberWithoutAnEntryCountsInTheTotalOnly`, `parentMemberRowsRollUpTheChildrensSpend`, `nonOwnerSharesAreListedWithoutALimit`, `childrenOfAnOwnedRootCountTheOwnersSpendOnly`, `formerMembersShareInAnOwnedCategoryIsListedInactive` and two `CategorySpendingIT` member-count checks now expect the extra member rows.

**Tests**: unit + integration
**Gate**: full

---
### U2: Dashboard trend endpoint

**What**: `GET {DASHBOARD}/trend?startDate&endDate&memberId` → `List<MonthlyTrendDto>`, reusing the monthly trend query; plan-scoped, readable by any member.
**Where**: `backend/src/main/java/com/lcs/findraco/controllers/DashboardController.java`, `backend/src/main/java/com/lcs/findraco/services/DashboardService.java`, dashboard IT under `backend/src/test/java/com/lcs/findraco/`
**Depends on**: U1
**Reuses**: `buildMonthlyTrend`, `DashboardFilterDto`
**Requirement**: UX-05 (AC 7)

**Tools**:

- MCP: NONE
- Skill: `backend-endpoint`

**Done when**:

- [x] IT: income and expenses per month for a 3-month range; memberId restricts to that member's shares; 404/403 behaviour for another plan matches the dashboard summary
- [x] Full gate passes (unit 95, IT 152 passed, 0 failed; `DashboardTrendIT` 5)

> Note: `DashboardTrendIT` also covers a VIEWER read and a missing range (400). Months without data are absent from the response; the frontend fills them (U8). The trend tops up open-ended series first, like the summary.

**Tests**: integration
**Gate**: full

---
<!-- Phase 6: UX Overview -->

### U3: Member colours and trend hook

**What**: `utils/memberColors.ts`: palette + `memberColorIndex(members, userId)` (position in members sorted by userId, modulo palette) and `useMemberColors()`. `useGetDashboardTrend(filter)` in `useDashboardService.ts` (key includes plan, range, member) and the `MonthlyTrend` wire type reuse.
**Where**: `frontend/src/features/home/utils/memberColors.ts` (+ test), `frontend/src/api/services/useDashboardService.ts` (+ test)
**Depends on**: U2
**Reuses**: `useGetPlanMembers`, existing dashboard hook pattern
**Requirement**: UX-04 (AC 2), UX-05 (AC 7)

**Tools**:

- MCP: NONE
- Skill: `api-integration`

**Done when**:

- [x] Unit: colour is stable regardless of input order; wraps modulo palette; unknown user → neutral
- [x] Hook test: GET `.../dashboard/trend` with start, end and memberId; key includes plan and params
- [x] Quick gate passes (frontend 275 passed, 0 failed; new files lint clean)

> SPEC_DEVIATION: the palette is six new `--member-1..6` tokens (light and dark in `index.css`), not `--chart-1..5` + one extra. Reason: the `--chart-*` tokens are five shades of amber, indistinguishable as identities and the same hue as the warning status (UX-03 AC 4). The new hues (blue, pink, green, cyan, violet, aqua) skip amber and red and pass the dataviz palette validator on the card surface in both themes.

**Tests**: unit
**Gate**: quick

---
### U4: Period navigator

**What**: Pure `periodNavigator.ts` (`periodLabel`, `shiftRange`, `presetRange`) and `PeriodNavigator.tsx` (‹ label › + Range menu: This month, Last 3 months, Last 6 months, This year, Custom). Replaces `PeriodPicker` on the Overview; writes the existing Overview `period` / `customRange` fields (arrows produce a `customRange`).
**Where**: `frontend/src/features/home/utils/periodNavigator.ts` (+ test), `frontend/src/features/home/components/PeriodNavigator.tsx`, `frontend/src/features/home/components/overview/OverviewTab.tsx`
**Depends on**: U3
**Reuses**: `resolvePeriodDates`, existing date-range picker in `PeriodPicker`
**Requirement**: UX-05 (AC 8–10)

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [x] Unit: label 'October 2026' for one calendar month, 'Aug – Oct 2026' for a range, year shown on both ends across years; shift ±1 moves by the range's month count (1, 3, 6, 12), across year boundaries; presets resolve like `resolvePeriodDates`
- [x] Quick gate + build pass (frontend 284 passed, 0 failed; build ok; lint 23 pre-existing errors, 0 new)

> Note: a custom range not aligned to whole months is labelled with its days ("5 – 20 Oct 2026"); the spec defines labels for month ranges only. "Custom…" in the Range menu opens a range calendar anchored to the navigator instead of the old inline date-range input. `PeriodPicker` stays for the Categories tab until U9.

**Tests**: unit
**Gate**: quick + build

---
### U5: Overview spending rows model

**What**: Pure `spendingRows.ts`: from the DEBIT `CategorySpending` tree, month count, selected member and colours → sorted view rows with status, remaining/overBy, integer percent, member segments (dimmed when another member is selected), member sub-rows for per-member limits, owner pill, and the default-expanded root ids.
**Where**: `frontend/src/features/home/components/overview/spendingRows.ts` (+ test)
**Depends on**: U4
**Reuses**: `scaleTreeLimits`, `usageStatus` thresholds
**Requirement**: UX-03 (AC 1–4, 6, 8–9), UX-04 (AC 3–7)

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [x] Unit: alphabetical roots and children; over / warning (≥80%) / ok / none; remaining vs overBy; integer percent; no-limit row has no bar; roots auto-expanded only when a child is warning/over
- [x] Unit: unfiltered segments sum to spend in member colours; per-member sub-rows with own status; owned row single owner segment + pill
- [x] Unit: member selected with own limit → their spend vs their limit; without → whole-category bar vs category limit, their segment highlighted, others dimmed, never their share vs the whole limit
- [x] Quick gate passes (`spendingRows` 19, frontend 303 passed, 0 failed)

> Note: decisions where the spec is silent: with a member selected, per-member sub-rows are hidden (the row itself is the member's view); a dormant own entry counts as no own limit; on an owned row, a non-owner's focus amount is 0 (owned spend is the owner's) and the owner selecting it sees it as their own row (no "shared limit" text). The member line lists every member with non-zero spend, so an owned row also shows the other members' shares (dimmed when another member is selected).

**Tests**: unit
**Gate**: quick

---
### U6: Overview list, member chips and wiring

**What**: `CategorySpendingList.tsx` (replaces and deletes `CategorySpendingChart.tsx`): row-wide toggle button with chevron, segmented bar, limit tick + hatched overflow, status text, member line and sub-rows. `MemberFilterChips.tsx` (2–4 members chips, >4 combobox with dots, 1 none). `OverviewTab` reads `/spending` unfiltered for the list.
**Where**: `frontend/src/features/home/components/overview/CategorySpendingList.tsx`, `frontend/src/features/home/components/overview/MemberFilterChips.tsx`, `frontend/src/features/home/components/overview/OverviewTab.tsx`
**Depends on**: U5
**Reuses**: `useGetCategorySpending`, `useOverviewMemberFilter`
**Requirement**: UX-03 (AC 2, 5, 7), UX-04 (AC 8)

**Tools**:

- MCP: NONE
- Skill: `component-creation`

**Done when**:

- [x] Rows, toggle, bar and chips render per spec at 390px and 1280px (presentational, build-gated; checked with headless screenshots, light and dark, unfiltered and with a member selected)
- [x] Build gate passes; lint no new errors (frontend 303 passed, build ok, lint 23 pre-existing errors, 0 new)

> Note: `StandardCombobox` gained an optional `renderItem` (list and trigger) for the colour dots of the >4-member combobox; `MemberDot` is its own file for reuse by the summary. The percent is shown next to the status text ("remaining R$ 149 · 85%"). The expand state is initialised once from the default-expanded roots and kept across period changes (manual toggles last until leaving the page).

**Tests**: none
**Gate**: build

---
### U7: Summary block with members

**What**: Pure `summaryView(dashboard, memberId, colours)` + rewritten `SummaryCards.tsx`: desktop three cards, `< sm` one block (Balance on top, Income and Expenses side by side), each with member segments and amounts. Dashboard fetched without `memberId`. Delete `PersonBreakdownList.tsx`.
**Where**: `frontend/src/features/home/components/overview/summaryView.ts` (+ test), `frontend/src/features/home/components/overview/SummaryCards.tsx`, `frontend/src/features/home/components/overview/OverviewTab.tsx`
**Depends on**: U6
**Reuses**: `personBreakdown`
**Requirement**: UX-04 (AC 9), UX-05 (AC 1–3)

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [x] Unit: unfiltered totals and per-member segments; member selected → that member's income, expense and balance with their segment highlighted
- [x] Quick gate + build pass (frontend 307 passed, 0 failed; build ok; lint 23 pre-existing errors, 0 new)

> Note: with a member selected, the segments keep their share of the plan's total (the member's highlighted, others dimmed), and the balance is the member's `net`. Until U8 the old trend chart reads the now-unfiltered `monthlyTrend` of the summary.

**Tests**: unit
**Gate**: quick + build

---
### U8: Six-month trend bars

**What**: Pure `trendWindow(range)` and `fillTrendMonths(data, window, selectedRange)`; `MonthlyTrendChart.tsx` rewritten as grouped Income/Expense bars with in-period months highlighted, placed after the category list, fed by `useGetDashboardTrend` with the member filter.
**Where**: `frontend/src/features/home/components/overview/trendMonths.ts` (+ test), `frontend/src/features/home/components/overview/MonthlyTrendChart.tsx`, `frontend/src/features/home/components/overview/OverviewTab.tsx`
**Depends on**: U7
**Reuses**: U3 hook
**Requirement**: UX-05 (AC 4–6)

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [x] Unit: one-month period → 6 months ending at it; 12-month period → its 12 months; missing months zero; in-period flags; crosses year boundary
- [x] Quick gate + build pass (frontend 314 passed, 0 failed; build ok; lint 23 pre-existing errors, 0 new)

> Note: months outside the selected period are drawn at 30% opacity and their tick label muted; in-period ticks are bold. Bar animation is off: with recharts 2 the bars did not redraw after the member filter changed the data (seen in headless screenshots). The trend requests whole calendar months (window start to the end of the last month).

**Tests**: unit
**Gate**: quick + build

---
<!-- Phase 7: UX Categories and Transactions -->

### U9: Drop the Categories period filter

**What**: Remove `categoriesPeriod` / `CategoriesFilters.period` / `customRange` from home filters; old URLs with `categoriesPeriod` still load (ignored).
**Where**: `frontend/src/features/home/filters/homeFilterParams.ts` (+ test), `frontend/src/features/home/hooks/useHomeFilters.ts` (+ test)
**Depends on**: None
**Reuses**: M5-03 filter persistence
**Requirement**: UX-01 (AC 1)

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [x] Unit: parsing a URL with `categoriesPeriod` yields no error and no categories period; serialization emits none; existing filter tests updated, not deleted
- [x] Quick gate passes (frontend 305 passed, 0 failed; build ok; lint 23 pre-existing errors, 0 new)

> Note: the Categories codec is gone, so its 11 round-trip cases (`homeFilterParams.test.ts` "categories codec") were rewritten as 3 cases for the amended outcome (legacy params parse and are ignored, no codec exported, serialization emits none); the hook and gate cases now load legacy params instead of writing them. A link carrying only `categoriesPeriod` no longer counts as home params, so the gate restores the plan's saved state. `PeriodPicker.tsx` lost its last user and is deleted. To keep the build green, `CategoriesTab` drops the picker here and reads the current month until U10 removes spend from it.

**Tests**: unit
**Gate**: quick

---
### U10: Management-only Categories tab

**What**: Pure `buildCategoryTree(categories)` (alphabetical roots, children under them). `CategoriesTab` + `CategoryTreeRow` rewritten: data from `useGetFinancialTransactionCategories` for every role; desktop aligned columns Name | Owner | Monthly limit | Per member | actions (hover ✎ 🗑, ＋ on roots); `< sm` stacked rows, tap → edit (OWNER); tree guide; former members greyed.
**Where**: `frontend/src/features/home/components/categories/categoryTree.ts` (+ test), `frontend/src/features/home/components/categories/CategoriesTab.tsx`, `frontend/src/features/home/components/categories/CategoryTreeRow.tsx`
**Depends on**: U9
**Reuses**: `useCategoryFormSheet`, `DeleteCategoryDialog`
**Requirement**: UX-01 (AC 1–5), UX-02 (AC 1–2)

**Tools**:

- MCP: NONE
- Skill: `component-creation`

**Done when**:

- [x] Unit: tree sorted case-insensitively; children grouped under their root; Expenses before Income; orphan child (parent missing) shown as root
- [x] Quick gate + build pass (`categoryTree` 6, frontend 311 passed, 0 failed; build ok; lint 23 pre-existing errors, 0 new; checked with headless screenshots at 390px and 1280px, light and dark, with a hovered root)

> Note: the Monthly limit column shows `effectiveLimit` (the per-member sum, or the plain limit). A child shows its parent's owner, as the API reports it. Owners and per-member entries carry the member's colour dot; a former member's dot is neutral and the text greyed with "(former member)". The ＋ icon opens the create form with the root's type only; U11 adds the parent prefill. Read-only roles get the same rows with plain (non-button) mobile rows and no action icons.

**Tests**: unit
**Gate**: quick + build

---
### U11: Category form footer and parent prefill

**What**: `openCreate({ parentId })` prefills the parent; in edit mode below `sm` the footer offers Delete (opens `DeleteCategoryDialog`) and, for a root, New subcategory.
**Where**: `frontend/src/features/home/components/categories/CategoryFormSheet.tsx` (+ test), `frontend/src/features/home/components/categories/CategoriesTab.tsx`
**Depends on**: U10
**Reuses**: existing sheet and dialog
**Requirement**: UX-02 (AC 2–3)

**Tools**:

- MCP: NONE
- Skill: `form-creation`

**Done when**:

- [ ] Unit: create with a parentId starts with that parent and its type; without keeps today's defaults
- [ ] Quick gate + build pass

**Tests**: unit
**Gate**: quick + build

---
### U12: Transactions mobile list

**What**: Pure `groupByDay(transactions)`; `TransactionMobileList.tsx` rendered `sm:hidden` (table wrapper `hidden sm:block`), day headings, description, category, participants, signed amount; tap → existing edit. `TransactionFormDrawer` edit footer gains Duplicate and Delete below `sm`.
**Where**: `frontend/src/features/home/components/transactions/groupByDay.ts` (+ test), `frontend/src/features/home/components/transactions/TransactionMobileList.tsx`, `frontend/src/features/home/components/transactions/TransactionsTab.tsx`, `frontend/src/features/home/components/transactions/TransactionFormDrawer.tsx`
**Depends on**: U11
**Reuses**: tab handlers `handleEdit` / `handleDuplicate` / `handleDelete`, pagination
**Requirement**: UX-02 (AC 4–6)

**Tools**:

- MCP: NONE
- Skill: `component-creation`

**Done when**:

- [ ] Unit: groups keep the page's order, one group per calendar day, local-date safe (no UTC shift)
- [ ] Quick gate + build pass; lint no new errors

**Tests**: unit
**Gate**: quick + build

---

## Phase Execution Map

```
Phase 1 → Phase 2 → Phase 3 → Phase 4

Phase 1:  T1 → T2 → T3 → T4 → T5 → T6 → T7 → T8
Phase 2:  T9 → T10 → T11 → T12 → T13 → T14 → T15 → T16
Phase 3:  T17 → T18 → T19 → T20
Phase 4:  T21 → T22 → T23 → T24
Phase 5:  U1 → U2
Phase 6:  U3 → U4 → U5 → U6 → U7 → U8
Phase 7:  U9 → U10 → U11 → U12
```

Batches (~7 tasks, whole phases): Phase 1 (8) · Phase 2 (8) · Phases 3 + 4 (8) · Phases 5 + 6 (8) · Phase 7 (4).

## Diagram-Definition Cross-Check

| Task | Depends On (task body) | Diagram Shows | Status |
| ---- | ---------------------- | ------------- | ------ |
| T1 | None | phase start | ✅ Match |
| T2 | T1 | T1 | ✅ Match |
| T3 | T2 | T2 | ✅ Match |
| T4 | T3 | T3 | ✅ Match |
| T5 | T4 | T4 | ✅ Match |
| T6 | T5 | T5 | ✅ Match |
| T7 | T6 | T6 | ✅ Match |
| T8 | T7 | T7 | ✅ Match |
| T9 | None (after Phase 1) | phase start | ✅ Match |
| T10 | T9 | T9 | ✅ Match |
| T11 | T10 | T10 | ✅ Match |
| T12 | T11 | T11 | ✅ Match |
| T13 | T12 | T12 | ✅ Match |
| T14 | T13 | T13 | ✅ Match |
| T15 | T14 | T14 | ✅ Match |
| T16 | T15 | T15 | ✅ Match |
| T17 | None (after Phase 2) | phase start | ✅ Match |
| T18 | T17 | T17 | ✅ Match |
| T19 | T18 | T18 | ✅ Match |
| T20 | T19 | T19 | ✅ Match |
| T21 | None (after Phase 3) | phase start | ✅ Match |
| T22 | T21 | T21 | ✅ Match |
| T23 | T22 | T22 | ✅ Match |
| T24 | T23 | T23 | ✅ Match |

## Test Co-location Validation

| Task | Code Layer Created/Modified | Matrix Requires | Task Says | Status |
| ---- | --------------------------- | --------------- | --------- | ------ |
| T1: Schema V10 + entities | Backend service/controller/repo/migration | integration | integration | ✅ OK |
| T2: Hierarchy rules on create/update | Backend service/controller/repo/migration | integration | integration | ✅ OK |
| T3: Delete with reassignment | Backend service/controller/repo/migration | integration | integration | ✅ OK |
| T4: ItemShareAllocator | Backend pure logic | unit | unit | ✅ OK |
| T5: CategorySpendingAssembler (tree, rollup, plain limits) | Backend pure logic | unit | unit | ✅ OK |
| T6: CategorySpendingService + dashboard delegation | Backend service/controller/repo/migration | integration | integration | ✅ OK |
| T7: Spending endpoint | Backend service/controller/repo/migration | integration | integration | ✅ OK |
| T8: Transaction filter includes children | Backend service/controller/repo/migration | integration | integration | ✅ OK |
| T9: Category DTOs and service hooks | Frontend logic/schema/hook | unit | unit | ✅ OK |
| T10: Categories tab in home filters | Frontend logic/schema/hook | unit | unit | ✅ OK |
| T11: Shared month scaling helper | Frontend logic/schema/hook | unit | unit | ✅ OK |
| T12: CategoryFormSheet (type, name, parent, single limit) | Frontend logic/schema/hook | unit | unit | ✅ OK |
| T13: DeleteCategoryDialog | Frontend logic/schema/hook | unit | unit | ✅ OK |
| T14: CategoriesTab + tree rows + home wiring | Frontend presentational wiring | none | none | ✅ OK |
| T15: Grouped CategoryCombobox | Frontend logic/schema/hook | unit | unit | ✅ OK |
| T16: Grouped Overview chart | Frontend presentational wiring | none | none | ✅ OK |
| T17: Member limits API and rules | Backend service/controller/repo/migration | integration | integration | ✅ OK |
| T18: Assembler: per-member limits and dormancy | Backend pure logic | unit | unit | ✅ OK |
| T19: Form: per-member limit mode | Frontend logic/schema/hook | unit | unit | ✅ OK |
| T20: Tree rows: per-member breakdown | Frontend presentational wiring | none | none | ✅ OK |
| T21: Owner API and rules | Backend service/controller/repo/migration | integration | integration | ✅ OK |
| T22: Assembler: owned spend | Backend pure logic | unit | unit | ✅ OK |
| T23: Form and rows: owner | Frontend logic/schema/hook | unit | unit | ✅ OK |
| T24: Default participant for owned category | Frontend logic/schema/hook | unit | unit | ✅ OK |

## Requirement Coverage

| Requirement | Tasks |
| ----------- | ----- |
| CAT-01 | T7, T9, T14 |
| CAT-02 | T5, T7, T11, T14 |
| CAT-03 | T10, T11 |
| CAT-04 | T14 |
| CAT-05 | T14 |
| CAT-06 | T1, T2, T12 |
| CAT-07 | T5, T6 |
| CAT-08 | T6, T16 |
| CAT-09 | T8, T15 |
| CAT-10 | T3, T9, T13 |
| CAT-11 | T1, T17, T18, T19 |
| CAT-12 | T4, T6, T18, T20 |
| CAT-13 | T17 |
| CAT-14 | T17, T18, T19, T20, T21 |
| CAT-15 | T1, T21, T23 |
| CAT-16 | T22 |
| CAT-17 | T24 |
