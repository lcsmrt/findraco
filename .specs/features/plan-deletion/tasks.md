# Plan Deletion Tasks

## Execution Protocol (MANDATORY -- do not skip)

Implement these tasks with the `tlc-spec-driven` skill: **activate it by name and follow its Execute flow and Critical Rules.** Do not search for skill files by filesystem path. The skill is the source of truth for the full flow (per-task cycle, sub-agent delegation, adequacy review, Verifier, discrimination sensor).

**If the skill cannot be activated, STOP and tell the user - do not proceed without it.**

---

**Design**: `.specs/features/plan-deletion/design.md`
**Status**: Approved

Branch `plan-deletion`, cut from `small-fixes` (PR #11, beta.25) so the prerelease stays linear; this feature ships beta.26.

---

## Test Coverage Matrix

> Generated from codebase, project guidelines, and spec - confirm before Execute. Guidelines found: `CLAUDE.md` (Backend/Frontend tests), AD-015 (frontend test table, `frontend/scripts/testTable.ts`), AD-020 (backend closed table), `.specs/codebase/TESTING.md`.

| Code Layer | Required Test Type | Coverage Expectation | Location Pattern | Run Command |
| ---------- | ------------------ | -------------------- | ---------------- | ----------- |
| Migration / schema | integration | Every FK to `plans` is `ON DELETE CASCADE` | `backend/src/test/java/com/lcs/findraco/plan/*IT.java` | `./mvnw verify -Dit.test=PlanSchemaIT` |
| Backend endpoint with a rule or guard | integration (`*IT` on Testcontainers Postgres, status + problem `type`) | One IT per rule: happy path, 404 scope, 409 state; every endpoint × role in `PlanAuthorizationMatrixIT`; `OpenApiSnapshotIT` green | `backend/src/test/java/com/lcs/findraco/plan/*IT.java` | `./mvnw verify -Dit.test='<Name>IT'` |
| Backend job | integration (fixed `Clock`, as `SeriesTopUpJobIT`) | Purges at 30 days, keeps 29 days and active plans | `backend/src/test/java/com/lcs/findraco/plan/PlanPurgeJobIT.java` | `./mvnw verify -Dit.test=PlanPurgeJobIT` |
| Frontend service hooks | unit (`renderHook`, MSW handler factories) | Request shape and cache invalidation per hook | `frontend/src/api/services/usePlanService.test.ts` | `node node_modules/vitest/vitest.mjs run src/api/services/usePlanService.test.ts` |
| Frontend container | flow test (real providers, MSW only, no `vi.mock` of our modules) | Its decisions only: empty → hidden, error → section error, restore, delete-now | co-located `*.test.tsx` | `node node_modules/vitest/vitest.mjs run src/features/plans` |
| Frontend presentational | story with `play` for each state it handles (a11y in error mode) | Each handled state | co-located `*.stories.tsx` | `node node_modules/vitest/vitest.mjs run --project=storybook src/features/plans` |
| Copy / docs / version | none | build gate only | - | build gate |

## Gate Check Commands

> Generated from codebase - confirm before Execute. Backend from `backend/` with `JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8` and Docker; frontend from `frontend/`. Process rule (2026-10-19): related tests per task, full gate once per phase.

| Gate Level | When to Use | Command |
| ---------- | ----------- | ------- |
| Quick | Frontend tasks | the task's related tests (matrix Run Command) + `pnpm lint` |
| Full | Backend tasks | `./mvnw verify -Dit.test='<the task's ITs>'` (Spotless, Error Prone, ArchUnit run with it) |
| Build | End of each phase | backend: `./mvnw -B verify` · frontend: `pnpm lint && pnpm build && pnpm test` |

---

## Execution Plan

### Phase 1: Backend

```
T1 → T2 → T3 → T4
```

### Phase 2: Frontend

```
T5 → T6 → T7 → T8
```

---

## Task Breakdown

### T1: Cascade migration and schema guard

**What**: V21 re-creates every foreign key that references `plans` with `ON DELETE CASCADE` (same names), `PlanSchemaIT` asserts it, and AD-023 is appended to `STATE.md`.
**Where**: `backend/src/main/resources/db/migration/V21__cascade_plan_deletion.sql`
**Depends on**: None
**Reuses**: constraint names from V2, V8, V13, V16; AD format in `.specs/STATE.md`
**Requirement**: PDEL-05

**Tools**:

- MCP: NONE
- Skill: `/backend-structure`, `/backend-testing`

**Done when**:

- [x] `PlanSchemaIT` queries `pg_constraint` for FKs whose `confrelid` is `plans` and asserts each `confdeltype = 'c'`; it fails before V21 and passes after
- [x] AD-023 added (cascade only on permanent deletion; AD-006 archive unchanged; exception to AD-017 writes; enforced by `PlanSchemaIT`)
- [x] Gate: `./mvnw verify -Dit.test=PlanSchemaIT` passes

**Tests**: integration
**Gate**: full

**Commit**: `feat(backend): cascade plan-scoped rows on permanent plan deletion`

---

### T2: List and restore archived plans

**What**: `GET /plan/archived` (owner's archived plans with `archivedAt` and `deletesAt`) and `POST /plan/{id}/restore`, with `PlanRetention`, `ArchivedPlanResponse`, `PlanNotArchivedException` (`plan-not-archived`, 409) and the regenerated `openapi.json`.
**Where**: `backend/src/main/java/com/lcs/findraco/plan/service/PlanService.java`
**Depends on**: T1
**Reuses**: `getMembership`, `PlanResponse.from`, `PlanManagementIT` setup, `PlanAuthorizationMatrixIT`
**Requirement**: PDEL-01, PDEL-02

**Tools**:

- MCP: NONE
- Skill: `/backend-endpoint`, `/backend-exceptions`, `/backend-testing`

**Done when**:

- [x] `PlanArchiveIT`: the list returns only plans the caller owns that are archived, newest first, `deletesAt = archivedAt + 30 days`; empty list for a non-owner member of an archived plan
- [x] `PlanArchiveIT`: restore → 200, `deleted_at` null, every member's `GET /plan` lists it with the same role; non-owner → 404 `plan-not-found`; active plan → 409 `plan-not-archived`; unknown id → 404
- [x] Both endpoints × every role in `PlanAuthorizationMatrixIT`
- [x] `plan-not-archived` copy added to `frontend/src/api/utils/problems.ts` (the build forces it)
- [x] `openapi.json` regenerated; `OpenApiSnapshotIT` green
- [x] Gate: `./mvnw verify -Dit.test='PlanArchiveIT,PlanAuthorizationMatrixIT,OpenApiSnapshotIT'` passes

**Tests**: integration
**Gate**: full

**Commit**: `feat(backend): list and restore archived plans`

---

### T3: Delete an archived plan now

**What**: `DELETE /plan/{id}/permanent` removes an archived plan through `PlanRepository.deleteArchivedBefore(id, now)`, guarded like restore.
**Where**: `backend/src/main/java/com/lcs/findraco/plan/repository/PlanRepository.java`
**Depends on**: T2
**Reuses**: T2 guards, `Fixtures`
**Requirement**: PDEL-05

**Tools**:

- MCP: NONE
- Skill: `/backend-endpoint`, `/backend-testing`

**Done when**:

- [x] `PlanPermanentDeletionIT` seeds a plan with a child category, a member limit, an itemised transaction with participants and an item category, an installment series with an exception, a second member and a pending invitation; archives it; deletes it → 204; zero rows with its id (directly or through a parent) in every plan-scoped table
- [x] A second plan with the same row kinds is unchanged; every user account remains
- [x] Active plan → 409 `plan-not-archived`, nothing deleted; non-owner → 404; already deleted → 404
- [x] The pending invitation's token answers as unknown afterwards
- [x] Endpoint × role in `PlanAuthorizationMatrixIT`; `openapi.json` regenerated
- [x] Gate: `./mvnw verify -Dit.test='PlanPermanentDeletionIT,PlanAuthorizationMatrixIT,OpenApiSnapshotIT'` passes

**Tests**: integration
**Gate**: full

**Commit**: `feat(backend): delete an archived plan permanently`

---

### T4: Daily purge job

**What**: `PlanPurgeJob` (cron `app.plans.purge-cron`, startup run unless `-`) purges every plan archived at least 30 days ago, one transaction per plan, logging failures by id and the final count with ids only.
**Where**: `backend/src/main/java/com/lcs/findraco/plan/service/PlanPurgeJob.java`
**Depends on**: T3
**Reuses**: `SeriesTopUpJob`, `SeriesProperties`, `SeriesTopUpJobIT`
**Requirement**: PDEL-06, PDEL-07, PDEL-08

**Tools**:

- MCP: NONE
- Skill: `/backend-structure`, `/backend-testing`

**Done when**:

- [x] `PlanPurgeProperties` (`@Validated`, `@NotBlank purgeCron`) bound; `application.properties` sets `app.plans.purge-cron=0 0 4 * * *`; the test profile turns it off with `-`
- [x] `PlanPurgeJobIT` with `Clock.fixed`: archived exactly 30 days ago → gone; 29 days → kept; active → kept
- [x] `PlanPurgeJobIT`: `purge(id, cutoff)` on a plan restored after the id list was read deletes nothing
- [x] The completion log carries plan ids and no plan name (`CapturedLogs`)
- [x] Build gate: `./mvnw -B verify` passes (end of Phase 1)

**Tests**: integration
**Gate**: build

**Commit**: `feat(backend): purge plans archived for 30 days`

---

### T5: Archived-plan service hooks

**What**: `useGetArchivedPlans`, `useRestorePlan`, `useDeletePlanPermanently`, their MSW factories, and the types regenerated from `openapi.json`.
**Where**: `frontend/src/api/services/usePlanService.ts`
**Depends on**: None (Phase 2 starts after Phase 1)
**Reuses**: `useDeletePlan`, `plan.handlers.ts`, `buildMutationOptions`
**Requirement**: PDEL-01, PDEL-02, PDEL-05

**Tools**:

- MCP: NONE
- Skill: `/api-integration`, `/frontend-testing`

**Done when**:

- [x] Unit tests: each hook calls its route; restore invalidates `["plans"]`; delete invalidates `["plans", "archived"]`
- [x] Gate: `usePlanService.test.ts` passes and `pnpm lint` is clean

**Tests**: unit
**Gate**: quick

**Commit**: `feat(frontend): archived plan service hooks`

---

### T6: Archived plans section

**What**: `ArchivedPlansSection` (container) and `ArchivedPlansListView` render the "Archived plans" card on the Plans screen with name, archive date, deletion date, Restore and Delete now; hidden when empty, own error when the request fails.
**Where**: `frontend/src/features/plans/components/ArchivedPlansSection.tsx`
**Depends on**: T5
**Reuses**: `Card`, `PlanInvitationsListView` row layout, `Text`, date formatting in the user's time zone
**Requirement**: PDEL-01, PDEL-02

**Tools**:

- MCP: NONE
- Skill: `/component-creation`, `/frontend-testing`

**Done when**:

- [x] Stories with `play`: list with two plans (both dates visible), loading
- [x] Flow test: empty list → no "Archived plans" heading; failing request → section error while active plans render; Restore → POST sent, row leaves the list, plan appears in the switcher
- [x] Gate: `src/features/plans` tests and stories pass; `pnpm lint` clean

**Tests**: integration
**Gate**: quick

**Commit**: `feat(frontend): archived plans section with restore`

---

### T7: Delete-now confirmation dialog

**What**: `DeletePlanPermanentlyDialog` and its view: the destructive button stays disabled until the typed text equals the plan name exactly; confirming deletes and closes; the row leaves the list.
**Where**: `frontend/src/features/plans/components/DeletePlanPermanentlyDialog.tsx`
**Depends on**: T6
**Reuses**: `PlanNameDialogView`, `FormField`, `Button variant="destructive"`
**Requirement**: PDEL-04, PDEL-05

**Tools**:

- MCP: NONE
- Skill: `/component-creation`, `/form-creation`, `/frontend-testing`

**Done when**:

- [x] Story with `play`: button disabled on empty and on a near match (`"Casa "`, `"casa"`), enabled on the exact name
- [x] Flow test: Delete now → type name → confirm → DELETE sent, dialog closes, row gone; a 409 `plan-not-archived` shows its copy
- [x] Gate: `src/features/plans` tests and stories pass; `pnpm lint` clean

**Tests**: integration
**Gate**: quick

**Commit**: `feat(frontend): confirm a permanent plan deletion by its name`

---

### T8: Archive copy and release

**What**: The Archive confirmation says the plan can be restored from "Archived plans" for 30 days, then is deleted permanently, with no mention of support; prerelease bumped to `1.0.0-beta.26`.
**Where**: `frontend/src/features/plans/PlansPage.tsx`
**Depends on**: T7
**Reuses**: `useConfirm`
**Requirement**: PDEL-03

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [x] Copy changed; `frontend/package.json` at `1.0.0-beta.26` in its own `chore(release)` commit
- [x] Build gate: `pnpm lint && pnpm build && pnpm test` passes (end of Phase 2)

**Tests**: none
**Gate**: build

**Commit**: `feat(frontend): say how long an archived plan can be restored`

---

## Phase Execution Map

```
Phase 1 → Phase 2

Phase 1:  T1 ------→ T2 ------→ T3 ------→ T4
Phase 2:  T5 ------→ T6 ------→ T7 ------→ T8
```

---

## Validation

### Task Granularity Check

| Task | Scope | Status |
| ---- | ----- | ------ |
| T1 | 1 migration + its guard test | ✅ Granular |
| T2 | 2 endpoints on one resource (list + restore) | ⚠️ Cohesive (share guards and response) |
| T3 | 1 endpoint | ✅ Granular |
| T4 | 1 job + its properties | ✅ Granular |
| T5 | 3 hooks in one file | ⚠️ Cohesive (one service file) |
| T6 | 1 container + its view | ✅ Granular |
| T7 | 1 dialog + its view | ✅ Granular |
| T8 | 1 copy change + version | ✅ Granular |

### Diagram-Definition Cross-Check

| Task | Depends On (task body) | Diagram Shows | Status |
| ---- | ---------------------- | ------------- | ------ |
| T1 | None | start of Phase 1 | ✅ Match |
| T2 | T1 | T1 → T2 | ✅ Match |
| T3 | T2 | T2 → T3 | ✅ Match |
| T4 | T3 | T3 → T4 | ✅ Match |
| T5 | None | start of Phase 2 | ✅ Match |
| T6 | T5 | T5 → T6 | ✅ Match |
| T7 | T6 | T6 → T7 | ✅ Match |
| T8 | T7 | T7 → T8 | ✅ Match |

### Test Co-location Validation

| Task | Code Layer Created/Modified | Matrix Requires | Task Says | Status |
| ---- | --------------------------- | --------------- | --------- | ------ |
| T1 | Migration / schema | integration | integration | ✅ OK |
| T2 | Backend endpoint | integration | integration | ✅ OK |
| T3 | Backend endpoint | integration | integration | ✅ OK |
| T4 | Backend job | integration | integration | ✅ OK |
| T5 | Frontend service hooks | unit | unit | ✅ OK |
| T6 | Container + presentational | flow test + story | integration | ✅ OK |
| T7 | Container + presentational | flow test + story | integration | ✅ OK |
| T8 | Copy / version | none | none | ✅ OK |
