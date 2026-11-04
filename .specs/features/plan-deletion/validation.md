# Plan Deletion Validation

**Date**: 2026-11-03
**Spec**: `.specs/features/plan-deletion/spec.md`
**Diff range**: `small-fixes..plan-deletion` (9ff8aff spec; feature 0fd9c08..1b9647d, HEAD 1b9647d)
**Verifier**: independent sub-agent (author ≠ verifier)
**Verdict**: FAIL

---

## Task Completion

| Task | Status | Notes |
| ---- | ------ | ----- |
| T1 | ✅ Done | V21 + `PlanSchemaIT` |
| T2 | ✅ Done | list + restore |
| T3 | ✅ Done | delete now |
| T4 | ✅ Done | purge job |
| T5 | ✅ Done | hooks; `ArchivedPlan` type hand-written (no generator exists), matches `openapi.json` `ArchivedPlanResponse` field for field |
| T6 | ✅ Done | section; the "Delete now" button landed in T7. No AC is left without evidence because of that |
| T7 | ✅ Done | typed-name dialog |
| T8 | ✅ Done | copy + `1.0.0-beta.26` |

---

## Spec-Anchored Acceptance Criteria

### P1: Restore an archived plan

| Criterion | Spec-defined outcome | `file:line` + assertion | Result |
| --------- | -------------------- | ----------------------- | ------ |
| AC 1: list the owner's archived plans with name, archive date, deletion date | only plans the caller OWNS that are archived; `deletesAt = archivedAt + 30 d` | `backend/src/test/java/com/lcs/findraco/plan/PlanArchiveIT.java:58-66`: `jsonPath("$.length()").value(2)`, `$[0].archivedAt == newer`, `$[0].deletesAt == newer + 30 d`; another user's archived plan and an active plan seeded and left out. Non-owner: `PlanArchiveIT.java:77`: `$.length() == 0`. UI: `frontend/src/features/plans/components/ArchivedPlansSection.test.tsx:80-86`: `getByText("Archived on 20/10/2026")`, `getByText("Deleted permanently on 19/11/2026")`; story `ArchivedPlansListView.stories.tsx:23-28` | ✅ PASS |
| AC 2: no archived plan → no section | the section SHALL NOT show | `ArchivedPlansSection.test.tsx:72`: `waitFor(() => expect(queryByText("Archived plans")).toBeNull())`. The test only checks the state after the request settles. While the request is loading, `ArchivedPlansSection.tsx:17` does not return null, and `ArchivedPlansListView.tsx:45` shows the "Archived plans" card with a spinner. Every user who owns no archived plan sees that card for a moment, which the AC forbids, and the `waitFor` lets it pass | ❌ GAP (gap 3) |
| AC 3: restore clears `deleted_at`; the plan is back in every member's switcher with the same members, roles, transactions, categories and series | `deleted_at` null; each member lists it with their role; data intact | `PlanArchiveIT.java:92-104`: 200 + `$.myRole == "OWNER"`; `getDeletedAt()).isNull()`; the editor's `GET /plan` shows `myRole == "EDITOR"`. UI: `ArchivedPlansSection.test.tsx:113-121`: POST sent, row gone, `findByRole("menuitemradio", { name: "Old home" })` in the switcher. **Not asserted**: the transactions, categories and series. The test also archives with `setDeletedAt` and never calls the real archive route (`DELETE /plan/{id}`), so the archive → restore round trip is never exercised | ⚠️ partial → gap 4 |
| AC 4: non-owner restore → 404 `plan-not-found` | 404 + `plan-not-found` | `PlanArchiveIT.java:115`: `problem(NOT_FOUND, "plan-not-found")` + archive stays (`:117-118`); matrix `PlanAuthorizationMatrixIT.java:395-400` (EDITOR/CONTRIBUTOR/VIEWER 404) | ✅ PASS |
| AC 5: plan not archived → 409 | 409 (`plan-not-archived`) | `PlanArchiveIT.java:126`: `problem(CONFLICT, "plan-not-archived")` | ✅ PASS |
| AC 6: archive dialog states 30 days and "Archived plans", no support | copy | No test. Checked by reading `frontend/src/features/plans/PlansPage.tsx:31`; `grep -i support` finds no copy left in `src/**/*.tsx`. The project's closed test table (AD-015; tasks matrix "Copy → none") gives copy no test | ✅ by inspection (no test by the table's rule) |

### P1: Delete an archived plan now

| Criterion | Spec-defined outcome | `file:line` + assertion | Result |
| --------- | -------------------- | ----------------------- | ------ |
| AC 1: button disabled until the text equals the name exactly | exact, case-sensitive, no trim | `deletePlanPermanentlyForm.test.ts:6,16` (`"casa"`, `"Casa "`, `" Casa"`, `"Cas"`, `""` → false); `DeletePlanPermanentlyDialogView.stories.tsx:25-39` (`toBeDisabled()` on `"Casa "` and `"casa"`, `toBeEnabled()` on `"Casa"`); `ArchivedPlansSection.test.tsx:135-141` | ✅ PASS |
| AC 2: remove the plan and every scoped row in one transaction, 204 | 204; zero rows in all 10 plan-scoped tables | `PlanPermanentDeletionIT.java:210-217`: all 10 tables seeded (`allMatch(n -> n > 0)`), `status().isNoContent()`, `existsById(...)).isFalse()`, `rowsOf(doomed)...allMatch(n -> n == 0)`. One statement (`PlanRepository.java:23`) inside `@Transactional` | ✅ PASS |
| AC 3: the row leaves the list without a reload | row gone | `ArchivedPlansSection.test.tsx:149-151`: dialog closed, `queryByText("Old home")).toBeNull()`; hook `usePlanService.test.ts:317`: `["plans","archived"]` invalidated | ✅ PASS |
| AC 4: not archived → 409, nothing deleted | 409 + rows unchanged | `PlanPermanentDeletionIT.java:233-236`: `problem(CONFLICT, "plan-not-archived")`, `rowsOf(plan)).isEqualTo(before)`; UI copy `ArchivedPlansSection.test.tsx:183` | ✅ PASS |
| AC 5: non-owner or gone → 404 `plan-not-found` | 404 + `plan-not-found` | `PlanPermanentDeletionIT.java:247` (editor), `:259` (already deleted); matrix `PlanAuthorizationMatrixIT.java:402-407` | ✅ PASS |
| AC 6: other plans and users unchanged | equal counts | `PlanPermanentDeletionIT.java:218-220`: `rowsOf(kept)).isEqualTo(keptBefore)`, `users()).isEqualTo(usersBefore)` | ✅ PASS |

### P1: Purge after the retention period

| Criterion | Spec-defined outcome | `file:line` + assertion | Result |
| --------- | -------------------- | ----------------------- | ------ |
| AC 1: delete every plan archived ≥ 30 days before now | exactly 30 d → gone | `PlanPurgeJobIT.java:64-66`: `PERIOD == 30 d`, `exists(thirtyDays)).isFalse()`, `exists(olderStill)).isFalse()` | ✅ PASS |
| AC 2: active and < 30 d plans stay | kept | `PlanPurgeJobIT.java:67-68`. Holds through the id list only. The `deleted_at <= :cutoff` check in the DELETE itself has no test (mutant B1 survived) | ⚠️ partial → gap 1 |
| AC 3: one failure is logged by id, the rest continue, it is retried next run | error log has the id; other plan deleted; retried | `PlanPurgeJobIT.java:120-131`: `exists(failing)).isTrue()`, `exists(other)).isFalse()`, a single ERROR event containing `"plan " + failing.getId()`, completion log, second run → `exists(failing)).isFalse()` | ✅ PASS |
| AC 4: a restore committed during a run is not purged (re-check in the delete's transaction) | `purge` returns false; plan kept | `PlanPurgeJobIT.java:81-82`: `purge(...)).isFalse()`, `exists(plan)).isTrue()`. This covers the `deleted_at IS NOT NULL` re-check. The cutoff re-check has no test (B1) | ⚠️ partial → gap 1 |
| AC 5: completion log has the count and ids, no names | `Purged N archived plans: [ids]`, no name | `PlanPurgeJobIT.java:94-99`: `contains("Purged 1 archived plans: [id]")`, `doesNotContain(purged.getName())` | ✅ PASS |
| AC 6: cron is `app.*`, validated, `-` turns off schedule and startup run; 30 d a code constant | blank → startup fails; `-` → no startup run | `ConfigurationPropertiesTest.java:183-185` (blank fails startup); `PlanPurgeJobIT.java:64` (constant). That `-` skips the startup run has no test (mutant B10 survived). `SeriesTopUpJob` has the same gap | ⚠️ partial → gap 5 |

### Edge Cases

| Edge case | Evidence | Result |
| --------- | -------- | ------ |
| Restore and "Delete now" race: first to commit wins; the second gets 404 or 409 | Only the order-of-requests cases are tested: delete after restore → 409 (`PlanPermanentDeletionIT.java:233`), restore of a gone id → 404 (`PlanArchiveIT.java:134`). Delete-now losing **inside** its transaction (`PlanService.java:129`, `== 0` → 409) has no test: mutant B5 survived. With that branch removed, the API answers 204 and "Plan deleted." while the plan is active again. Not verified, by reasoning only: a restore that loses (its UPDATE matches 0 rows after the delete commits) probably answers 409 `stale-version` through `GlobalExceptionHandler.handleStaleVersion`, not the 404 the design's error table expects | ❌ GAP (gap 2) |
| A pending invitation of a deleted plan is deleted and its link answers unknown | `PlanPermanentDeletionIT.java:221-222`: `problem(NOT_FOUND, "invitation-not-found")`; the kept plan's link is still 200 (`:223`) | ✅ PASS |
| The archived plan was a member's default: the member keeps the personal plan made at archive time | Covered only indirectly by "other plans unchanged" (`PlanPermanentDeletionIT.java:218-219`). No test archives through the real route (which creates the personal plan) and then deletes. `isDefault` is a flag on the plan, not a pointer from users, so nothing can dangle | ⚠️ indirect → folded into gap 4 |
| The archived request fails: active plans still show, the error stays in the section | `ArchivedPlansSection.test.tsx:94-96`: `findByRole("alert")` text, heading present, switcher button present | ✅ PASS |

**Status**: ❌ Gaps present (2 ❌, 3 ⚠️ partial; AC 6 of Restore by inspection only, by the test table's rule)

### Points the authors raised

- **a. Loading spinner for users with no archived plan.** This is a real AC 2 violation, not a matter of taste. During the request, every user sees the card titled "Archived plans", and most users own no archived plan, so it then disappears: a heading flash and a layout shift on every Plans visit. The fix is cheap and can be undone: render nothing while loading (the card sits at the bottom of the page, under invitations, so appearing late costs nothing). Then drop the `Loading` story, or keep the view's loading state only if another consumer needs it. Gap 3.
- **b. Restore test sets up the post-restore handlers before the click.** The test is valid. MSW stands in for the server state, and the server side ("the plan is listed for every member") is proven by `PlanArchiveIT.java:99-103`. What the flow test proves is that the switcher refetches `["plans"]` after the restore and shows the plan from that refetch. Mutant F3 (invalidate only `["plans","archived"]`) failed this test, so it really depends on the invalidation and not on some unrelated refetch.
- **c. Delete-now button added in T7; types hand-written.** No AC is left uncovered by this. `ArchivedPlan` matches `openapi.json` (`id` int64, `name`, `archivedAt`/`deletesAt` date-time, all required).
- **d. Postgres trigger for Purge AC 3.** It is dropped in a `finally` (`PlanPurgeJobIT.java:116-117`) and only fires for the failing plan's id (`WHEN (OLD.id = ...)`). The ITs run in one JVM, sequentially, with no Testcontainers reuse, and the full gate passed with `PlanAuthorizationMatrixIT` and `PlanManagementIT` running after it. There is no leak. One theoretical gap: if `CREATE TRIGGER` itself failed, the function would stay behind, but that test would already be failing.
- **e. Restore-vs-purge race (Purge AC 4 / Edge Case 1).** The `deleted_at IS NOT NULL` re-check is proven. The cutoff re-check (gap 1) and the delete-now race-loser branch (gap 2) are not.

---

## Discrimination Sensor

Done by mutating file copies in place, running only the related tests, restoring, and comparing with `cmp` (every restore was identical). No stash, no worktree. Frontend tests ran via `node node_modules/vitest/vitest.mjs run`.

| # | File:line | Mutation | Tests run | Killed? |
| - | --------- | -------- | --------- | ------- |
| B1 | `PlanRepository.java:23` | DELETE drops `and p.deletedAt <= :cutoff` | Archive, PermanentDeletion, PurgeJob, AuthorizationMatrix ITs | ❌ Survived |
| B2 | `PlanRepository.java:26` | id list `<= :cutoff` → `< :cutoff` | same | ✅ Killed (`PlanPurgeJobIT:65`) |
| B3 | `PlanRetention.java:9` | 30 days → 29 | same | ✅ Killed (`PlanArchiveIT:62`, `PlanPurgeJobIT:64`) |
| B4 | `PlanService.java` `getArchivedPlanMembership` | drop the OWNER filter | same | ✅ Killed (Archive/PermanentDeletion ITs + 6 matrix cells) |
| B5 | `PlanService.java:129` | delete-now ignores 0 deleted rows (no 409) | same | ❌ Survived |
| B6 | `PlanPurgeJob.java` loop | `break` after the first failure | same | ✅ Killed (`PlanPurgeJobIT:121`) |
| B7 | `PlanService.restore` | don't clear `deleted_at` | same | ✅ Killed (`PlanArchiveIT:98`) |
| B8 | `PlanExceptions.PlanNotArchivedException` | 409 → 422 | same | ✅ Killed (4 tests) |
| B9 | `PlanMembershipRepository` archived query | drop `p.deletedAt is not null` | same | ✅ Killed (`PlanArchiveIT:57,104`) |
| B10 | `PlanPurgeJob.java:44` | startup run when cron is `-` (inverted) | PurgeJob, Archive ITs + ConfigurationPropertiesTest | ❌ Survived |
| F1 | `deletePlanPermanentlyForm.ts` | typed text trimmed | unit + storybook `src/features/plans` | ✅ Killed (2 unit + story) |
| F2 | `deletePlanPermanentlyForm.ts` | case-insensitive compare | same | ✅ Killed (2 unit + story + flow) |
| F3 | `usePlanService.ts` `useRestorePlan` | invalidate `["plans","archived"]` only | unit `usePlanService.test.ts` + `src/features/plans` | ✅ Killed (hook + flow) |
| F4 | `usePlanService.ts` `useDeletePlanPermanently` | no invalidation on success | same | ✅ Killed (hook + flow) |
| F5 | `ArchivedPlansSection.tsx:17` | empty list still rendered | same | ✅ Killed (`ArchivedPlansSection.test.tsx:72`) |
| F6 | `ArchivedPlansSection.tsx:17` | error hidden when list empty (drop `!isError`) | same | ✅ Killed (`ArchivedPlansSection.test.tsx:94`) |

Equivalent mutant, not run: dropping `p.deletedAt is not null` from the DELETE changes nothing, because `NULL <= :cutoff` is never true in SQL.

**Sensor depth**: expanded (data-deletion path, 16 mutations)
**Result**: 13/16 killed: FAIL ❌ (B1, B5, B10 survived)

---

## Code Quality

| Principle | Status |
| --------- | ------ |
| Minimum code | ✅ |
| Surgical changes | ✅ |
| No scope creep | ✅ |
| Matches patterns (`SeriesTopUpJob`, `buildMutationOptions`, handler factories, container/view split) | ✅ |
| Spec-anchored outcome check | ⚠️ gaps 1-5 |
| Per-layer Coverage Expectation (one IT per rule; endpoint × role matrix; job with fixed clock) | ✅ except the race-loser branch (gap 2) |
| Every test maps to a spec requirement | ✅ (test names carry PDEL ids / AC refs) |
| Documented guidelines followed: `CLAUDE.md`, `.specs/codebase/TESTING.md`, AD-015 test table | ✅ no lint/TS bypass, no Mockito, no `vi.mock` of own modules |

---

## Gate Check

- **Backend**: `./mvnw -B verify` → exit 0, BUILD SUCCESS. Unit 245 passed, IT 523 passed, 0 failed, 0 skipped (Spotless, Error Prone, ArchUnit, `OpenApiSnapshotIT` green).
- **Frontend**: eslint ✅, `tsc -b && vite build` ✅, `check-siblings` ✅, vitest unit+tooling+storybook: 1002 passed, 0 failed (29 story-only files have every story tagged `!test`, as before), critical with coverage: 177 passed.
- **New tests in scope**: backend PlanSchemaIT 1, PlanArchiveIT 6, PlanPermanentDeletionIT 4, PlanPurgeJobIT 4, 8 new matrix cells, 1 ConfigurationPropertiesTest. Frontend: 4 hook tests, 7 flow tests, 7 form unit tests, 6 tested stories. No test removed or weakened (`MainLayout.test.tsx` only adds an `archived([])` handler).

---

## Fix Plans

### Fix 1 (Major): the DELETE's cutoff check has no test (B1)

- **Root cause**: the job only ever passes ids from the cutoff-filtered list, so `p.deletedAt <= :cutoff` in `deleteArchivedBefore` is never the thing that refuses a delete.
- **Fix task**: in `PlanPurgeJobIT`, call `planService.purge(id, cutoff)` on a plan archived 29 days ago (or on one restored and re-archived after the list was read) → `isFalse()`, and the plan still exists.
- **Done when**: B1 fails that test.

### Fix 2 (Major): "Delete now" losing to a restore inside its transaction has no test (B5)

- **Root cause**: the guard read already refuses an active plan, so the `== 0 → PlanNotArchivedException` branch is only reached under real concurrency.
- **Fix task**: add an IT in `PlanPermanentDeletionIT` that holds the row lock from a second connection running an uncommitted `UPDATE plans SET deleted_at = NULL`. Start delete-now in another thread; it passes the guard and then blocks on the row. Commit the restore. Assert 409 `plan-not-archived` and that the plan exists. Optionally do the mirror case (restore losing to a delete) and assert what it answers. If it is 409 `stale-version`, either map it to 404 or update the edge case to match.
- **Done when**: B5 fails the new test.

### Fix 3 (Minor, user-visible): the "Archived plans" card flashes for users with none (AC 2)

- **Fix task**: `ArchivedPlansSection` renders nothing while `isLoading`. Adjust the view's `Loading` story (or remove the loading state if no consumer is left). In the flow test, assert that no "Archived plans" text is present while the request is pending (for example, with a delayed handler), not only after it settles.
- **Done when**: the flow test fails on the current code and passes after the fix.

### Fix 4 (Minor): Restore AC 3 data and Edge Case 3 are not asserted through the real archive route

- **Fix task**: in `PlanArchiveIT`, seed a plan with a member, a category, a transaction and a series; archive it via `DELETE /plan/{id}`; restore it; assert the row counts per table are unchanged and that each member has the same role. In `PlanPermanentDeletionIT`, archive a plan that is the member's only plan via the route, delete it now, and assert the member's `GET /plan` lists the personal plan.
- **Done when**: both assertions are in place and pass.

### Fix 5 (Minor): `-` skipping the startup run has no test (B10)

- **Fix task**: a `PlanPurgeJobIT` case that runs `runAtStartup()` with `new PlanPurgeProperties("-")` and a plan archived 40 days ago → it still exists. A sibling case with a real cron → it is deleted.
- **Done when**: B10 fails that test.

---

## Requirement Traceability Update

| Requirement | Previous Status | New Status |
| ----------- | --------------- | ---------- |
| PDEL-01 | Done | ❌ Needs fix (AC 2 loading flash) |
| PDEL-02 | Done | ⚠️ Needs fix (AC 3 data not asserted) |
| PDEL-03 | Done | ✅ Verified (by inspection) |
| PDEL-04 | Done | ✅ Verified |
| PDEL-05 | Done | ⚠️ Needs fix (race-loser branch, Edge Case 1) |
| PDEL-06 | Backend done | ⚠️ Needs fix (cutoff re-check, B1) |
| PDEL-07 | Backend done | ✅ Verified |
| PDEL-08 | Backend done | ⚠️ Needs fix (`-` startup run, B10) |

---

## Summary

**Overall**: ❌ Not Ready (close: every gap is a missing test or one line in the frontend, and no data-loss defect was found in the shipped code)

**Spec-anchored check**: 13/22 ACs + edge cases fully matched; 2 ❌ gaps, 3 ⚠️ partial, Restore AC 6 by inspection
**Sensor**: 13/16 mutations killed (B1, B5, B10 survived)
**Gate**: backend 768 passed, frontend 1179 passed, 0 failed

**What works**: the cascade (all 10 tables proven empty, the other plan unchanged), the owner scope (404), the 409s, the 30-day boundary, failure isolation, the id-only logs, the typed-name guard (exact, no trim, case-sensitive), cache invalidation, the section's error isolation.

**Next steps**: route fixes 1-5 to an implementer, then re-verify.
