# Plan Deletion Validation

**Date**: 2026-11-03
**Spec**: `.specs/features/plan-deletion/spec.md`
**Diff range**: `small-fixes..HEAD` (37731df..5e17e9f, 18 commits, 48 files). Since iteration 2 (`ab3dc3e..5e17e9f`): one commit, 5e17e9f, which changes 2 lines in `frontend/src/features/plans/components/ArchivedPlansSection.test.tsx` and nothing else
**Verifier**: independent sub-agent (author ≠ verifier), re-verification iteration 3 of 3
**Verdict**: PASS

**Result**: PASS ✅. The single iteration-2 gap (Restore AC 2 after the response, mutant M-F3b) is closed, every AC and edge case is matched to its spec outcome, the sensor killed 4/4 this iteration, and the frontend gate is green.

---

## History

- **Iteration 1** (HEAD 1b9647d): FAIL. B1, B5 and B10 survived, Restore AC 2 flashed the card while loading, and Restore AC 3 and Edge Case 3 were only partly covered (gaps 1-5). Fixes F1-F5: f7494c0, e31d454, fd4313d, 06cdee5, f41447e.
- **Iteration 2** (HEAD f41447e, report ab3dc3e): FAIL. Gaps 1, 2, 4 and 5 were closed. Gap 3 was fixed in the code (`ArchivedPlansSection.tsx:17` renders nothing while loading), but the rewritten flow test checked "no section" before the empty response had rendered, so M-F3b (`if (isLoading) return null;`) survived. Fix 1: 5e17e9f.
- **Iteration 3** (HEAD 5e17e9f): this report. Fix 1 confirmed.

---

## Task Completion

| Task | Status | Notes |
| ---- | ------ | ----- |
| T1-T8 | ✅ Done | as in iteration 1 |
| F1 | ✅ Done | `PlanPurgeJobIT.java:89-105`; B1 killed (iteration 2) |
| F2 | ✅ Done | `PlanArchiveRaceIT` + `PESSIMISTIC_WRITE` row lock; B5a/B5b/N1 killed (iteration 2) |
| F3 | ✅ Done | Code since fd4313d; test finished in 5e17e9f. M-F3a killed (iteration 2), M-F3b killed (this iteration) |
| F4 | ✅ Done | `PlanArchiveIT.java:174-231`, `PlanPermanentDeletionIT.java:264-280`; N3/N4 killed (iteration 2) |
| F5 | ✅ Done | `PlanPurgeJobIT.java:109-126`; B10 killed (iteration 2) |
| Fix 1 (iteration 2) | ✅ Done | 5e17e9f; `ArchivedPlansSection.test.tsx:87,94` |

---

## Fix-Commit Review (5e17e9f)

- Touches only `ArchivedPlansSection.test.tsx`, 2 lines. Line 87: `renderSection()` → `const { queryClient } = renderSection();`. Line 94: `waitFor(() => expect(screen.getByRole("button", { name: /Personal/ })).toBeTruthy())` (already true before the response) → `waitFor(() => expect(queryClient.getQueryState(["plans", "archived"])?.status).toBe("success"))`.
- No assertion removed or weakened. The loading-state check (`:89-91`) and the final `expect(screen.queryByText("Archived plans")).toBeNull()` (`:95`) are unchanged. The new wait is stronger: it holds until the archived query (key `["plans", "archived"]`, `frontend/src/api/services/usePlanService.ts:38`) has stored the empty response.
- No `vi.mock`, no lint or TS bypass. The test still uses MSW only.

---

## Spec-Anchored Acceptance Criteria

Backend files and every frontend file except the test above are unchanged since iteration 2, so their `file:line` citations still hold. In the changed test, lines did not move (2 lines in, 2 lines out, in place).

### P1: Restore an archived plan

| Criterion | Spec-defined outcome | `file:line` + assertion | Result |
| --------- | -------------------- | ----------------------- | ------ |
| AC 1: list the owner's archived plans with name, archive date, deletion date | owner-only, archived-only; `deletesAt = archivedAt + 30 d` | `backend/src/test/java/com/lcs/findraco/plan/PlanArchiveIT.java:94-101`: `$.length() == 2`, `$[0].deletesAt` / `$[1].deletesAt` = archive + 30 d; non-owner `:113` `$.length() == 0`. UI: `frontend/src/features/plans/components/ArchivedPlansSection.test.tsx:105-109`: `getByText("Archived on 20/10/2026")`, `getByText("Deleted permanently on 19/11/2026")` | ✅ PASS |
| AC 2: no archived plan → no section | the section SHALL NOT show, while loading or after | While loading: `ArchivedPlansSection.test.tsx:91` `expect(screen.queryByText("Archived plans")).toBeNull()` with the request held open (M-F3a killed, iteration 2). After the response: `:94` `waitFor(() => expect(queryClient.getQueryState(["plans", "archived"])?.status).toBe("success"))`, then `:95` `expect(screen.queryByText("Archived plans")).toBeNull()`. M-F3b is now killed 3 runs out of 3 (`AssertionError: expected <div data-slot="card-title" …> to be null`) | ✅ PASS |
| AC 3: restore clears `deleted_at`; back for every member with the same members, roles, transactions, categories, series | `deleted_at` null; each member's role; data unchanged | `PlanArchiveIT.java:174-231`: archived through the real `DELETE /plan/{id}`, `dataOf(plan)).isEqualTo(before)` over `transactions`, `categories`, `recurrence_definitions` (each `> 0` first, `:208`), `myRole == "OWNER"` (`:228`) and `"EDITOR"` (`:230`); also `:131-140` `getDeletedAt()).isNull()`. UI `ArchivedPlansSection.test.tsx:144` `findByRole("menuitemradio", { name: "Old home" })` | ✅ PASS |
| AC 4: non-owner → 404 `plan-not-found` | 404 + slug | `PlanArchiveIT.java:151` `problem(NOT_FOUND, "plan-not-found")`, archive unchanged `:153`; restore cells in `PlanAuthorizationMatrixIT` | ✅ PASS |
| AC 5: not archived → 409 | 409 `plan-not-archived` | `PlanArchiveIT.java:162` `problem(CONFLICT, "plan-not-archived")` | ✅ PASS |
| AC 6: archive dialog copy (30 days, "Archived plans", no support) | copy | Checked by reading `frontend/src/features/plans/PlansPage.tsx` (unchanged). Copy has no row in the project's closed test table (AD-015) | ✅ by inspection |

### P1: Delete an archived plan now

| Criterion | Spec-defined outcome | `file:line` + assertion | Result |
| --------- | -------------------- | ----------------------- | ------ |
| AC 1: button disabled until exact name | exact, case-sensitive, no trim | `deletePlanPermanentlyForm.test.ts:6,16`; `DeletePlanPermanentlyDialogView.stories.tsx:25-39` (`toBeDisabled()` / `toBeEnabled()`); flow `ArchivedPlansSection.test.tsx:159-164` (`confirm.disabled` true for `"old home"`, false for `"Old home"`) | ✅ PASS |
| AC 2: plan + every scoped row removed in one transaction, 204 | 204, 0 rows in 10 tables | `PlanPermanentDeletionIT.java:213` seeded `allMatch(n -> n > 0)`, `:215` `isNoContent()`, `:218` `allMatch(n -> n == 0)` | ✅ PASS |
| AC 3: row leaves the list without reload | row gone | `ArchivedPlansSection.test.tsx:173` `waitFor(() => expect(screen.queryByText("Old home")).toBeNull())` after the dialog closes, `:174` `Trip to Lisbon` stays; hook invalidation `usePlanService.test.ts:299,317,335` `isInvalidated).toBe(true)` | ✅ PASS |
| AC 4: not archived → 409, nothing deleted | 409 + rows unchanged | `PlanPermanentDeletionIT.java:234` `problem(CONFLICT, "plan-not-archived")` + rows equal | ✅ PASS |
| AC 5: non-owner / gone → 404 `plan-not-found` | 404 + slug | `PlanPermanentDeletionIT.java:248`, `:260`; matrix cells | ✅ PASS |
| AC 6: other plans and users unchanged | equal | `PlanPermanentDeletionIT.java:220-221` `rowsOf(kept)).isEqualTo(keptBefore)`, `users()).isEqualTo(usersBefore)` | ✅ PASS |

### P1: Purge after the retention period

| Criterion | Spec-defined outcome | `file:line` + assertion | Result |
| --------- | -------------------- | ----------------------- | ------ |
| AC 1: delete plans archived ≥ 30 d | exactly 30 d → gone | `PlanPurgeJobIT.java:67-69` `PERIOD == 30 d`, `exists(thirtyDays)).isFalse()`, `exists(olderStill)).isFalse()` | ✅ PASS |
| AC 2: active and < 30 d stay | kept, also in the DELETE itself | `PlanPurgeJobIT.java:70-71` (job); `:89-95` `purge(id29Days, cutoff)).isFalse()` + `exists).isTrue()`; `:99-105` active plan passed to `purge` → `isFalse()` | ✅ PASS |
| AC 3: failure logged by id, rest continue, retried | log + other deleted + retry | `PlanPurgeJobIT.java:147-174` | ✅ PASS |
| AC 4: restore during a run is not purged | `purge` false, plan kept | `PlanPurgeJobIT.java:84-85` (`deleted_at` re-check); cutoff re-check `:94-95` | ✅ PASS |
| AC 5: completion log count + ids, no names | `Purged N archived plans: [ids]` | `PlanPurgeJobIT.java:129` `contains("Purged 1 archived plans: [id]")`, `doesNotContain(name)` | ✅ PASS |
| AC 6: cron `app.*`, validated, `-` turns off schedule and startup run; 30 d constant | blank fails; `-` → no startup run | `ConfigurationPropertiesTest.java:183-185`; `PlanPurgeJobIT.java:109-115` `jobWithCron("-").runAtStartup()` → `exists(overdue)).isTrue()`; `:119-125` real cron → `isFalse()` | ✅ PASS |

### Edge Cases

| Edge case | Evidence | Result |
| --------- | -------- | ------ |
| Restore and "Delete now" race: first to commit wins; second 404 or 409 | `PlanArchiveRaceIT.java:96-109`: delete commits while the real `POST /restore` waits on the row lock → `problem(NOT_FOUND, "plan-not-found")`, `existsById).isFalse()`. `:113-126`: restore commits while the real `DELETE /permanent` waits → `problem(CONFLICT, "plan-not-archived")`, `getDeletedAt()).isNull()`. `pg_stat_activity` lock-wait check. The winner is simulated in the test's own transaction; the loser goes through the real route | ✅ PASS |
| Pending invitation deleted, link unknown | `PlanPermanentDeletionIT.java:223` `problem(NOT_FOUND, "invitation-not-found")` | ✅ PASS |
| Archived plan was a member's default → member keeps the personal plan made at archive time | `PlanPermanentDeletionIT.java:264-280`: member's `GET /plan` → `$.length() == 1`, `$[0].isDefault == true`, `$[0].myRole == "OWNER"` | ✅ PASS |
| Archived request fails → active plans still show, error in the section | `ArchivedPlansSection.test.tsx:117` `findByRole("alert")).textContent).toMatch(/Could not load your archived plans/)`, `:118` heading, `:119` switcher (M-F3c killed, again this iteration) | ✅ PASS |

**Status**: ✅ All ACs and edge cases covered and matched to their spec outcomes (22/22; Restore AC 6 by inspection under the test-table rule). No spec-precision gaps.

### Notes on the F2 design (carried from iteration 2, code unchanged)

- The 0-row branch of `deletePermanently` was removed (`PlanService.java:127-130`). That is safe only because the guard reads the plan under the lock. N1 (lock taken after the membership lookup loaded the plan) makes delete-now answer 204 while deleting nothing, and `PlanArchiveRaceIT:124` catches it. The comment at `PlanService.java:146-147` gives the reason.
- Restore losing to the purge job (which takes no lock): the restore's `FOR UPDATE` waits on the purge's DELETE, then finds no row → 404, as the design says. This rests on reasoning only, with no test; no AC requires one.

---

## Discrimination Sensor

Method (iteration 3): mutate `frontend/src/features/plans/components/ArchivedPlansSection.tsx` in place from a backup copy, run `node node_modules/vitest/vitest.mjs run src/features/plans/components/ArchivedPlansSection.test.tsx` from `frontend/`, restore from the backup and `cmp` (every restore was identical). `git status --porcelain` was empty before the sensor and empty after it. No stash, no worktree. The unmutated file then passed 7/7.

### Iteration 3

| # | File:line | Mutation | Tests run | Killed? |
| - | --------- | -------- | --------- | ------- |
| M-F3b | `ArchivedPlansSection.tsx:17` | `if (isLoading) return null;` (card shown for an empty list once loaded) | `ArchivedPlansSection.test.tsx`, 3 runs | ✅ Killed 3/3 (AC 2 test, final `:95` assertion: `expected <div data-slot="card-title" …> to be null`) |
| M-F3c | `ArchivedPlansSection.tsx:17` | `!isError` dropped: `if (isLoading \|\| plans.length === 0) return null;` (an error with an empty list hides the section) | `ArchivedPlansSection.test.tsx` | ✅ Killed (edge-case test `:117`) |
| M-F3d | `ArchivedPlansSection.tsx:17` | boundary: `plans.length <= 1` (hides a single archived plan) | `ArchivedPlansSection.test.tsx` | ✅ Killed (3 tests: restore, delete, cancel) |
| control | - | unmutated | `ArchivedPlansSection.test.tsx` | 7/7 pass |

### Across iterations

| Iteration | Injected | Killed | Survived |
| --------- | -------- | ------ | -------- |
| 1 | 16 | 13 | 3 (B1, B5, B10) |
| 2 | 10 (B1, B5a, B5b, B10, N1, N3, N4, M-F3a, M-F3b, M-F3c) | 9 | 1 (M-F3b) |
| 3 | 3 (M-F3b, M-F3c, M-F3d) | 3 | 0 |

Every mutant that survived in an earlier iteration is now killed: B1, B5a/B5b and B10 in iteration 2, M-F3b in iteration 3. The backend is unchanged since iteration 2, so its kills there still hold. Equivalent mutant, not run: dropping `p.deletedAt is not null` from the DELETE alone (`NULL <= :cutoff` is never true).

**Sensor depth**: expanded (data-deletion path; 29 mutations over 3 iterations)
**Sensor outcome**: 3/3 killed this iteration, no survivors left: PASS ✅

---

## Code Quality

| Principle | Status |
| --------- | ------ |
| Minimum code | ✅ (the fix is 2 test lines) |
| Surgical changes | ✅ |
| No scope creep | ✅ |
| Matches patterns | ✅ (`getQueryState` is already used in `usePlanService.test.ts:299`; one raw `http.get("*/plan/archived")` to hold the response open, acceptable as in iteration 2) |
| Spec-anchored outcome check | ✅ |
| Per-layer Coverage Expectation | ✅ |
| Every test maps to a spec requirement | ✅ |
| Documented guidelines: `CLAUDE.md`, `.specs/codebase/TESTING.md`, AD-015 | ✅ no lint/TS bypass, no `@SuppressWarnings`, no `vi.mock` of own modules |

---

## Gate Check

- **Frontend** `pnpm lint && pnpm build && pnpm test` (from `frontend/`, iteration 3): exit 0. Unit + tooling + storybook: 148 files passed, 29 skipped (story-only, as before), 1001 tests passed; critical with coverage: 6 files, 177 tests passed. 0 failed. Same counts as iteration 2: the fix edits one existing test and adds none.
- **Backend**: `git diff --stat ab3dc3e..HEAD -- backend` is empty, so iteration 2's gate still applies: `./mvnw -B verify` exit 0, unit 245 passed, IT 531 passed, 0 failed, 0 skipped.
- **Test count before feature → after**: backend IT 523 (iteration 1) → 531; frontend 1002 (iteration 1) → 1001 (−1, the removed `Loading` story, justified in iteration 2).
- No test removed or weakened in this iteration.

---

## Requirement Traceability Update

| Requirement | Previous Status | New Status |
| ----------- | --------------- | ---------- |
| PDEL-01 | ⚠️ Needs fix | ✅ Verified |
| PDEL-02 | ✅ Verified | ✅ Verified |
| PDEL-03 | ✅ Verified (inspection) | ✅ Verified (inspection) |
| PDEL-04 | ✅ Verified | ✅ Verified |
| PDEL-05 | ✅ Verified | ✅ Verified |
| PDEL-06 | ✅ Verified | ✅ Verified |
| PDEL-07 | ✅ Verified | ✅ Verified |
| PDEL-08 | ✅ Verified | ✅ Verified |

---

## Summary

**Overall**: ✅ Ready

**Spec-anchored check**: 22/22 ACs + edge cases matched (Restore AC 6 by inspection); 0 spec-precision gaps
**Sensor**: 3/3 killed this iteration; no survivors remain across iterations 1-3
**Gate**: frontend 1178 passed (1001 + 177), backend 776 passed (iteration 2, backend unchanged), 0 failed

**What works**: everything verified in iterations 1-2, plus AC 2 now proven in both halves (no card while loading, none after an empty response).

**Lessons**: no new signal this iteration. The iteration-2 signal (M-F3b) is already recorded as candidate L-040. It stays a candidate: promotion needs the same lesson in a second distinct feature, and the script does that bookkeeping. Nothing to penalize, because L-040 was not a confirmed lesson loaded for this feature.

**Next steps**: interactive UAT for the Plans screen (archived list, restore, delete now), then merge.
