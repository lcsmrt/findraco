# Plan Deletion Specification

## Problem Statement

"Archive plan" sets `plans.deleted_at` and nothing else: the plan vanishes for every member, there is no way back in the app (the dialog says "contact support", and there is none), and every archived row stays in the database forever (AD-006 trade-off). ROADMAP M4-07 closes 1.0 criterion 2 (data safety): an archive must be reversible, and a deletion must really delete.

## Goals

- [ ] An owner can restore a plan they archived, with everything it had, for 30 days.
- [ ] An owner can delete an archived plan permanently at once.
- [ ] A plan archived 30 days ago or more is deleted permanently without anyone acting.

## Out of Scope

| Feature | Reason |
| ------- | ------ |
| Email or in-app notice to members on archive, restore or deletion | User, 2026-11-03 |
| Exporting a plan before deletion | User, 2026-11-03 |
| Off-VPS backup copy | Deferred in the 1.0 criteria (2026-10-31) |
| Archived plans for non-owners (EDITOR, CONTRIBUTOR, VIEWER) | User, 2026-11-03: owner only |
| A grace period for plans already archived at deploy | User, 2026-11-03: retention counts from `deleted_at` for every plan |
| Account deletion | Separate feature; not in the 1.0 criteria |

---

## Assumptions & Open Questions

| Assumption / decision | Chosen default | Rationale | Confirmed? |
| --------------------- | -------------- | --------- | ---------- |
| Lifecycle | Active → Archived (restorable) → deleted permanently, by "Delete now" or after the retention period | User, 2026-11-03: option C | y |
| Retention period | 30 days from `deleted_at`, a code constant; only the job's cron is `app.*` configuration | User, 2026-11-03 (30 days); AD-021: the archive dialog states the period, so it is a contract value the frontend mirrors, not operational config | y |
| Plans already archived when this ships | Counted from their own `deleted_at`; those past 30 days are deleted on the first job run | User, 2026-11-03 | y |
| Who sees and acts on archived plans | Users with the OWNER role in the plan at the time it was archived | User, 2026-11-03 | y |
| Backups | A permanent deletion removes the plan from the database at once; the daily `pg_dump` copies (7 kept) still hold it for up to 7 days, then it is gone everywhere | Existing backup policy; recovery within that week is a manual restore from a dump | y |
| Where the archived list lives | An "Archived plans" section on the Plans screen, shown only when the user owns at least one archived plan | The Plans screen already holds plan management; nothing new in the navigation (user, 2026-11-03) | y |
| "Delete now" confirmation | A dialog that enables its destructive button only when the typed text equals the plan name exactly | Strong confirmation for an irreversible action (GitHub's repository deletion pattern); a UI guard, the API needs no name (user, 2026-11-03) | y |
| Restore when the owner already has other plans | Restored as one more plan; the personal plan created for members when it was archived stays | Deleting a plan someone may already use would lose data | y |
| What a permanent deletion removes | The plan and every row scoped to it: transactions with their items and participants, categories with their limits and member settings, series definitions and exceptions, memberships, invitations | "Really delete" (Problem Statement); no orphan rows | y |
| Saved filters for a deleted plan | Left in the browser's storage; they reference a plan id no route accepts | Client-side only, harmless, cleaned by no server action | y |
| Job schedule | Daily, cron configurable, like the series top-up job; one plan per transaction | Mirrors `SeriesTopUpJob`; one failing plan never blocks the rest | y |

**Open questions:** none - all resolved or logged above.

---

## User Stories

### P1: Restore an archived plan ⭐ MVP

**User Story**: As a plan owner, I want to see the plans I archived and bring one back so that an archive is never a loss.

**Why P1**: Without it, archiving is a silent deletion with no way back.

**Acceptance Criteria**:

1. WHEN a user opens the Plans screen THEN the system SHALL list, under "Archived plans", every archived plan in which the user holds the OWNER role, each with its name, its archive date and its permanent-deletion date (archive date + retention period).
2. WHEN the user owns no archived plan THEN the system SHALL NOT show the "Archived plans" section.
3. WHEN an owner restores an archived plan THEN the system SHALL clear its `deleted_at`, and the plan SHALL appear again in the plan switcher of every member, with the same members, roles, transactions, categories and series it had when archived.
4. IF a user who is not an OWNER of the plan requests its restore THEN the system SHALL answer 404 with the plan-not-found problem type.
5. IF the plan to restore is not archived THEN the system SHALL answer 409.
6. The archive confirmation dialog SHALL state that the plan can be restored from "Archived plans" for 30 days, then is deleted permanently, and SHALL no longer mention support.

**Independent Test**: Archive a plan, open Plans, see it under "Archived plans" with both dates, restore it, see it in the switcher with its transactions.

---

### P1: Delete an archived plan now ⭐ MVP

**User Story**: As a plan owner, I want to delete an archived plan permanently right away so that I do not wait 30 days for data I want gone.

**Why P1**: Option C (user, 2026-11-03); the purge path the job also needs.

**Acceptance Criteria**:

1. WHEN an owner chooses "Delete now" on an archived plan THEN the system SHALL open a confirmation dialog whose delete button stays disabled until the typed text equals the plan name exactly.
2. WHEN the owner confirms THEN the system SHALL remove the plan and every row scoped to it (transactions with their items and participants, categories with their limits and member settings, series definitions and exceptions, memberships, invitations) in one transaction, and answer 204.
3. WHEN the deletion succeeds THEN the system SHALL remove the plan from the "Archived plans" list without a reload.
4. IF the plan is not archived THEN the system SHALL answer 409 and delete nothing.
5. IF a user who is not an OWNER of the plan, or any user for a plan that no longer exists, requests the deletion THEN the system SHALL answer 404 with the plan-not-found problem type.
6. The permanent deletion SHALL leave every other plan's rows, and every user account, unchanged.

**Independent Test**: Archive a plan with transactions, series and a member, delete it now, and find no row with its id in any plan-scoped table while another plan's data is intact.

---

### P1: Purge after the retention period ⭐ MVP

**User Story**: As an owner, I want archived plans to be deleted by themselves after 30 days so that archived data does not accumulate.

**Why P1**: Closes the AD-006 trade-off ("archived rows accumulate until a purge exists").

**Acceptance Criteria**:

1. WHEN the daily purge job runs THEN the system SHALL permanently delete, as in "Delete now", every plan whose `deleted_at` is at least the retention period (30 days) before the job's current instant.
2. The purge job SHALL NOT delete an active plan or a plan archived less than the retention period ago.
3. IF deleting one plan fails THEN the job SHALL log the plan id and the error, continue with the remaining plans, and retry that plan on its next run.
4. WHILE a restore of a plan commits during a purge run, the purge SHALL NOT delete that plan (the delete re-checks `deleted_at` inside its own transaction).
5. WHEN the job finishes THEN it SHALL log the number of plans deleted, with plan ids only and no plan names or user data.
6. The job's cron SHALL be `app.*` configuration, validated at startup, where `-` turns the schedule and the startup run off; the 30-day retention period SHALL be a code constant (AD-021).

**Independent Test**: With a fixed clock, a plan archived 30 days ago is gone after one job run; one archived 29 days ago and one active plan remain.

---

## Edge Cases

- IF the restore and the "Delete now" requests for one plan race THEN the system SHALL apply the first to commit and answer the second 404 (plan gone) or 409 (plan active again).
- WHEN a pending invitation belongs to a plan being deleted THEN the system SHALL delete it, and its link SHALL answer as an unknown invitation.
- WHEN the archived plan was the default plan of a member THEN its deletion SHALL leave that member with the personal plan created at archive time.
- WHEN the "Archived plans" request fails THEN the Plans screen SHALL still show the active plans and an error in the archived section only.

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
| -------------- | ----- | ----- | ------ |
| PDEL-01 | P1: Restore — archived list (AC 1, 2) | Design | Pending |
| PDEL-02 | P1: Restore — restore action and scope (AC 3, 4, 5) | Design | Pending |
| PDEL-03 | P1: Restore — archive dialog copy (AC 6) | Design | Pending |
| PDEL-04 | P1: Delete now — typed-name confirmation (AC 1, 3) | Design | Pending |
| PDEL-05 | P1: Delete now — cascade removal and guards (AC 2, 4, 5, 6) | Execute | In Progress |
| PDEL-06 | P1: Purge — retention job (AC 1, 2, 4) | Design | Pending |
| PDEL-07 | P1: Purge — failure isolation and logging (AC 3, 5) | Design | Pending |
| PDEL-08 | P1: Purge — configuration (AC 6) | Design | Pending |

**Coverage:** 8 total, 0 mapped to tasks, 8 unmapped ⚠️

---

## Success Criteria

- [ ] No archived plan older than 30 days remains in production after the first daily run.
- [ ] An archived plan restored in production comes back with all its transactions and members.
- [ ] "Archive plan" no longer mentions support.
