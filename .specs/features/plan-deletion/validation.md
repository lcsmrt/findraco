# Plan Deletion Validation

**Date**: 2026-11-03
**Spec**: `.specs/features/plan-deletion/spec.md`
**Diff range**: `small-fixes..plan-deletion` (HEAD f41447e). Fixes since iteration 1: `0e6288a..f41447e` (F1 f7494c0, F2 e31d454, F3 fd4313d, F4 06cdee5, F5 f41447e)
**Verifier**: independent sub-agent (author ≠ verifier), re-verification iteration 2 of 3
**Verdict**: FAIL

**History**: Iteration 1 (2026-11-03, HEAD 1b9647d): FAIL. B1, B5 and B10 survived, AC 2 of Restore flashed the card while loading, and Restore AC 3 and Edge Case 3 were only partly covered (gaps 1-5). Iteration 2: gaps 1, 2, 4 and 5 are closed. Gap 3 is fixed in the code, but the rewritten test no longer catches the main AC 2 case (mutant M-F3b survives).

---

## Task Completion

| Task | Status | Notes |
| ---- | ------ | ----- |
| T1-T8 | ✅ Done | as in iteration 1 |
| F1 | ✅ Done | `PlanPurgeJobIT.java:89-105`; B1 killed |
| F2 | ✅ Done | `PlanArchiveRaceIT` and the `PESSIMISTIC_WRITE` row lock; B5a/B5b/N1 killed; stable across 4 runs |
| F3 | ⚠️ Partial | The code no longer renders while loading (`ArchivedPlansSection.tsx:17`), and M-F3a is killed. But the test's check after the response arrives runs before the response is rendered, so M-F3b survives (gap 1) |
| F4 | ✅ Done | `PlanArchiveIT.java:174-231`, `PlanPermanentDeletionIT.java:264-280`; N3/N4 killed |
| F5 | ✅ Done | `PlanPurgeJobIT.java:109-126`; B10 killed |

---

## Spec-Anchored Acceptance Criteria

### P1: Restore an archived plan

| Criterion | Spec-defined outcome | `file:line` + assertion | Result |
| --------- | -------------------- | ----------------------- | ------ |
| AC 1: list the owner's archived plans with name, archive date, deletion date | owner-only, archived-only; `deletesAt = archivedAt + 30 d` | `backend/src/test/java/com/lcs/findraco/plan/PlanArchiveIT.java:94-101`: `$.length() == 2`, `$[0].deletesAt` / `$[1].deletesAt` = archive + 30 d; non-owner `:113` `$.length() == 0`. UI: `frontend/src/features/plans/components/ArchivedPlansSection.test.tsx:105-109`: `getByText("Archived on 20/10/2026")`, `getByText("Deleted permanently on 19/11/2026")` | ✅ PASS |
| AC 2: no archived plan → no section | the section SHALL NOT show, while loading or after | While loading: `ArchivedPlansSection.test.tsx:91` `expect(queryByText("Archived plans")).toBeNull()` with the request held open (M-F3a killed). **After the response**: `:94-95` waits on `getByRole("button", { name: /Personal/ })`, which is already true before the response arrives, and then asserts `queryByText(...)).toBeNull()` synchronously, before the empty list has rendered. So a container that renders the card for an empty list passes the test (M-F3b survived, 3 runs, also across all of `src/features/plans` and `src/app`, 188 tests) | ❌ GAP (gap 1) |
| AC 3: restore clears `deleted_at`; back for every member with the same members, roles, transactions, categories, series | `deleted_at` null; each member's role; data unchanged | `PlanArchiveIT.java:174-231`: archived through the real `DELETE /plan/{id}`, `dataOf(plan)).isEqualTo(before)` over `transactions`, `categories`, `recurrence_definitions` (each `> 0` first, `:208`), `myRole == "OWNER"` (`:228`) and `"EDITOR"` (`:230`); earlier: `:131-140` and `getDeletedAt()).isNull()`. UI `ArchivedPlansSection.test.tsx:144` `findByRole("menuitemradio", { name: "Old home" })` | ✅ PASS |
| AC 4: non-owner → 404 `plan-not-found` | 404 + slug | `PlanArchiveIT.java:151` `problem(NOT_FOUND, "plan-not-found")`, archive unchanged `:153`; matrix `PlanAuthorizationMatrixIT` restore cells | ✅ PASS |
| AC 5: not archived → 409 | 409 `plan-not-archived` | `PlanArchiveIT.java:162` `problem(CONFLICT, "plan-not-archived")` | ✅ PASS |
| AC 6: archive dialog copy (30 days, "Archived plans", no support) | copy | Checked by reading `frontend/src/features/plans/PlansPage.tsx` (unchanged since iteration 1). Copy has no test row in the project's closed test table (AD-015) | ✅ by inspection |

### P1: Delete an archived plan now

| Criterion | Spec-defined outcome | `file:line` + assertion | Result |
| --------- | -------------------- | ----------------------- | ------ |
| AC 1: button disabled until exact name | exact, case-sensitive, no trim | `deletePlanPermanentlyForm.test.ts:6,16`; `DeletePlanPermanentlyDialogView.stories.tsx:25-39` (`toBeDisabled()` / `toBeEnabled()`); flow `ArchivedPlansSection.test.tsx:152-173` | ✅ PASS |
| AC 2: plan + every scoped row removed in one transaction, 204 | 204, 0 rows in 10 tables | `PlanPermanentDeletionIT.java:213` seeded `allMatch(n -> n > 0)`, `:215` `isNoContent()`, `:218` `allMatch(n -> n == 0)` | ✅ PASS |
| AC 3: row leaves the list without reload | row gone | `ArchivedPlansSection.test.tsx:173` `queryByText("Old home")).toBeNull()` inside `waitFor`, after the dialog closes; hook invalidation `usePlanService.test.ts` | ✅ PASS |
| AC 4: not archived → 409, nothing deleted | 409 + rows unchanged | `PlanPermanentDeletionIT.java:234` `problem(CONFLICT, "plan-not-archived")` + rows equal | ✅ PASS |
| AC 5: non-owner / gone → 404 `plan-not-found` | 404 + slug | `PlanPermanentDeletionIT.java:248`, `:260`; matrix cells | ✅ PASS |
| AC 6: other plans and users unchanged | equal | `PlanPermanentDeletionIT.java:220-221` `rowsOf(kept)).isEqualTo(keptBefore)`, `users()).isEqualTo(usersBefore)` | ✅ PASS |

### P1: Purge after the retention period

| Criterion | Spec-defined outcome | `file:line` + assertion | Result |
| --------- | -------------------- | ----------------------- | ------ |
| AC 1: delete plans archived ≥ 30 d | exactly 30 d → gone | `PlanPurgeJobIT.java:67-69` `PERIOD == 30 d`, `exists(thirtyDays)).isFalse()`, `exists(olderStill)).isFalse()` | ✅ PASS |
| AC 2: active and < 30 d stay | kept, also in the DELETE itself | `PlanPurgeJobIT.java:70-71` (job); `:89-95` `purge(id29Days, cutoff)).isFalse()` + `exists).isTrue()` (B1 killed); `:99-105` active plan handed to `purge` → `isFalse()` | ✅ PASS |
| AC 3: failure logged by id, rest continue, retried | log + other deleted + retry | `PlanPurgeJobIT.java:147-174` | ✅ PASS |
| AC 4: restore during a run is not purged | `purge` false, plan kept | `PlanPurgeJobIT.java:84-85` (`deleted_at` re-check); cutoff re-check `:94-95` | ✅ PASS |
| AC 5: completion log count + ids, no names | `Purged N archived plans: [ids]` | `PlanPurgeJobIT.java:129-` `contains("Purged 1 archived plans: [id]")`, `doesNotContain(name)` | ✅ PASS |
| AC 6: cron `app.*`, validated, `-` turns off schedule and startup run; 30 d constant | blank fails; `-` → no startup run | `ConfigurationPropertiesTest.java:183-185`; `PlanPurgeJobIT.java:109-115` `jobWithCron("-").runAtStartup()` → `exists(overdue)).isTrue()`; `:119-125` real cron → `isFalse()` (B10 killed) | ✅ PASS |

### Edge Cases

| Edge case | Evidence | Result |
| --------- | -------- | ------ |
| Restore and "Delete now" race: first to commit wins; second 404 or 409 | `PlanArchiveRaceIT.java:96-109`: the delete commits while the real `POST /restore` waits on the row lock → `problem(NOT_FOUND, "plan-not-found")`, `existsById).isFalse()`. `:113-126`: the restore commits while the real `DELETE /permanent` waits → `problem(CONFLICT, "plan-not-archived")`, `getDeletedAt()).isNull()`. The harness checks `pg_stat_activity` for a lock wait, so it fails loudly if the request did not block. Passed 4 runs out of 4 (full gate + 3 isolated runs). Note: the winner is simulated in the test's own transaction (a repository delete or setter), not through the competing HTTP route; the loser goes through the real route, which is the side under test | ✅ PASS |
| Pending invitation deleted, link unknown | `PlanPermanentDeletionIT.java:223` `problem(NOT_FOUND, "invitation-not-found")` | ✅ PASS |
| Archived plan was a member's default → member keeps the personal plan made at archive time | `PlanPermanentDeletionIT.java:264-280`: archived through the route, deleted now, member's `GET /plan` → `$.length() == 1`, `$[0].isDefault == true`, `$[0].myRole == "OWNER"` (N3 killed) | ✅ PASS |
| Archived request fails → active plans still show, error in the section | `ArchivedPlansSection.test.tsx:117` alert text; heading and switcher present (M-F3c killed) | ✅ PASS |

**Status**: ❌ 1 gap (Restore AC 2 after the response; the loading half is covered). Every other AC and edge case is matched to its spec outcome; Restore AC 6 is checked by inspection under the test table's rule.

### Notes on the F2 design

- The 0-row branch of `deletePermanently` was removed (`PlanService.java:127-130`). It is safe only because the guard reads the plan under the lock. N1 (lock taken after the membership lookup loaded the plan, so the guard sees stale state) makes delete-now answer **204 while deleting nothing** (`PlanArchiveRaceIT:124`, `expected:<409> but was:<204>`). The race IT catches that, so the ordering is protected. The method's comment at `PlanService.java:146-147` states why.
- B5b (plain `findById`) confirms the iteration-1 reasoning: without the lock, a restore that loses answers 409 (not 404), and a delete-now that loses answers 204.
- Restore losing to the purge job (which takes no lock): the restore's `FOR UPDATE` waits on the purge's DELETE and then finds no row → 404, as the design table says. This is reasoning only, with no test, and no AC asks for one.

---

## Discrimination Sensor

Done by mutating file copies in place: back up, apply, `spotless:apply`, run only the related tests, restore, `cmp` (every restore was identical; `git status --porcelain` was empty before and after). No stash, no worktree. Frontend: `node node_modules/vitest/vitest.mjs run`. Backend: `./mvnw -B verify -Dtest=NONE -Dit.test=<ITs> -Djacoco.skip=true`; the default IT set is PlanArchiveIT, PlanArchiveRaceIT, PlanPermanentDeletionIT, PlanPurgeJobIT, PlanAuthorizationMatrixIT (200 tests).

| # | File:line | Mutation | Tests run | Killed? |
| - | --------- | -------- | --------- | ------- |
| B1 | `PlanRepository.java:30` | DELETE drops `and p.deletedAt <= :cutoff` | default set | ✅ Killed (`PlanPurgeJobIT:94`) |
| B5a | `PlanRepository.java:24` | drop `@Lock(PESSIMISTIC_WRITE)` | default set | ✅ Killed (both race tests: "finished without waiting for the plan row lock") |
| B5b | `PlanService.java:149` | guard uses plain `findById` instead of the locked finder | default set | ✅ Killed (`PlanArchiveRaceIT:108` 404 → 409; `:124` 409 → 204) |
| B10 | `PlanPurgeJob.java:44` | startup run condition inverted | PlanPurgeJobIT, PlanArchiveIT | ✅ Killed (`PlanPurgeJobIT:115`, `:125`) |
| N1 | `PlanService.java:146-156` | take the lock after the membership lookup has loaded the plan (stale `deletedAt`) | default set | ✅ Killed (`PlanArchiveRaceIT:124`, 204 instead of 409) |
| N3 | `PlanService.java:264` | archive no longer provisions the personal plan | PlanPermanentDeletionIT | ✅ Killed (`PlanPermanentDeletionIT:277`) |
| N4 | `PlanService.java:261` | archive also drops non-owner memberships | PlanArchiveIT | ✅ Killed (`PlanArchiveIT:230`, round trip) |
| M-F3a | `ArchivedPlansSection.tsx:17` | back to the iteration-1 condition (card shown while loading) | `ArchivedPlansSection.test.tsx` | ✅ Killed (`:91`) |
| M-F3b | `ArchivedPlansSection.tsx:17` | `if (isLoading) return null;` (card shown for an empty list once loaded) | `ArchivedPlansSection.test.tsx`; then all of `src/features/plans` + `src/app` (188) | ❌ Survived (3 runs) |
| M-F3c | `ArchivedPlansSection.tsx:17` | `if (isLoading \|\| plans.length === 0)` (error hidden when the list is empty) | `ArchivedPlansSection.test.tsx` | ✅ Killed (`:117`) |

Equivalent mutant, not run: dropping `p.deletedAt is not null` from the DELETE alone (`NULL <= :cutoff` is never true).

M-F3b is the mutant F5 killed in iteration 1. It came back because F3 changed the loading render: the old `waitFor(() => queryByText(...) toBeNull())` used to keep retrying past the spinner card, but with the new code it passes during loading, and the rewrite replaced it with an assertion that never waits for the response to render.

**Sensor depth**: expanded (data-deletion path, 10 mutations this iteration; the 13 killed in iteration 1 cover code the fixes did not touch)
**Result**: 9/10 killed: FAIL ❌ (M-F3b survived)

---

## Code Quality

| Principle | Status |
| --------- | ------ |
| Minimum code | ✅ (`Loading` prop and story removed with the state they served) |
| Surgical changes | ✅ |
| No scope creep | ✅ |
| Matches patterns | ✅ (`@Lock` finder in the repository; the race IT uses `TransactionTemplate` + `pg_stat_activity`, no Mockito). One raw `http.get("*/plan/archived")` in the flow test instead of a handler factory, needed to hold the response open; acceptable |
| Spec-anchored outcome check | ⚠️ gap 1 |
| Per-layer Coverage Expectation | ✅ |
| Every test maps to a spec requirement | ✅ |
| Documented guidelines: `CLAUDE.md`, `.specs/codebase/TESTING.md`, AD-015 | ✅ no lint/TS bypass, no `@SuppressWarnings`, no `vi.mock` of own modules |

---

## Gate Check

- **Backend** `./mvnw -B verify`: exit 0, BUILD SUCCESS. Unit 245 passed; IT 531 passed (iteration 1: 523; +8 = 2 race, 1 archive round trip, 1 personal plan, 4 purge); 0 failed, 0 skipped.
- **Frontend** `pnpm lint && pnpm build && pnpm test`: exit 0. Unit + tooling + storybook 1001 passed (iteration 1: 1002; −1 is the removed `Loading` story, justified because the state no longer exists); critical with coverage 177 passed; 29 story-only files skipped as before.
- No test weakened except the AC 2 flow test's assertion after the response (gap 1).

---

## Fix Plans

### Fix 1 (Minor): AC 2 after the response is not discriminated (M-F3b)

- **Root cause**: in `ArchivedPlansSection.test.tsx:93-95`, `release()` is followed by `waitFor` on the Personal switcher button, which already exists, so the final `queryByText("Archived plans")).toBeNull()` runs before the empty response renders.
- **Fix task**: after `release()`, wait on a signal that the archived query has settled, for example `await waitFor(() => expect(queryClient.getQueryState(<archived key>)?.status).toBe("success"))` using the `queryClient` that `renderWithProviders` returns, then assert the heading is absent. The check on the loading state stays as it is.
- **Done when**: M-F3b (`if (isLoading) return null;`) fails the test and the current code passes it.

---

## Requirement Traceability Update

| Requirement | Previous Status | New Status |
| ----------- | --------------- | ---------- |
| PDEL-01 | ❌ Needs fix | ⚠️ Needs fix (AC 2 test after the response, gap 1) |
| PDEL-02 | ⚠️ Needs fix | ✅ Verified |
| PDEL-03 | ✅ Verified (inspection) | ✅ Verified (inspection) |
| PDEL-04 | ✅ Verified | ✅ Verified |
| PDEL-05 | ⚠️ Needs fix | ✅ Verified |
| PDEL-06 | ⚠️ Needs fix | ✅ Verified |
| PDEL-07 | ✅ Verified | ✅ Verified |
| PDEL-08 | ⚠️ Needs fix | ✅ Verified |

---

## Summary

**Overall**: ❌ Not Ready. One test-only gap; the shipped code behaves as the spec says.

**Spec-anchored check**: 21/22 ACs + edge cases matched (Restore AC 6 by inspection); 1 ❌ (Restore AC 2 after the response)
**Sensor**: 9/10 killed this iteration (M-F3b survived); B1, B5 (adapted), B10 now killed
**Gate**: backend 776 passed, frontend 1178 passed, 0 failed

**What works**: everything from iteration 1, plus the cutoff re-check in the DELETE, the row lock that serializes restore and delete-now (both race outcomes proven, not flaky), the archive → restore round trip with data and roles, the personal plan surviving a permanent delete, `-` skipping the startup run, and no card while loading.

**Next steps**: route Fix 1 to an implementer, then run the third and last re-verification.
