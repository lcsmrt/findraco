# LESSONS - auto-maintained by scripts/lessons.py

> Machine-owned. Do NOT hand-edit. Changes are overwritten on the next `lessons.py` write.
> Canonical state lives in `.specs/lessons.json`. Edit lessons only via the script.
> promote_threshold=2 distinct features · window_days=45 · quarantine_threshold=2

## Confirmed (load these at Specify/Design)

Corroborated across multiple features. Safe to apply as guidance.

_none_

## Candidates (under observation - do NOT load as guidance yet)

Seen once or not yet corroborated. Tracked, not trusted.

### L-001 - For a write-through persistence effect, assert storage reflects a state change made after mount, not only the initial save
- signal: `surviving_mutant` · recurrence: 1 feature(s) · scope: `frontend-hooks` · harmful: 0
- features: filter-persistence
- evidence: M1 frontend/src/features/home/filters/HomeFiltersGate.tsx:44 (frontend-hooks)
- last seen: 2026-10-12T02:31:17Z

### L-002 - When behavior depends on a specific error status, test a different error status and assert the behavior does not trigger
- signal: `surviving_mutant` · recurrence: 1 feature(s) · scope: `frontend-hooks` · harmful: 0
- features: filter-persistence
- evidence: M9 frontend/src/features/home/hooks/useTransactionFilterChips.ts:60 (frontend-hooks)
- last seen: 2026-10-12T02:31:17Z

### L-003 - Move AC-bearing branching out of build-only UI components into a pure helper or hook so it can be unit tested
- signal: `ac_gap` · recurrence: 1 feature(s) · scope: `frontend-components` · harmful: 0
- features: filter-persistence
- evidence: P1-Nav AC5, edge single-member; frontend/src/features/home/components/overview/OverviewTab.tsx:51 (frontend-components)
- last seen: 2026-10-12T02:31:17Z

### L-004 - When a spec says clear filters, state explicitly whether sort and page size are reset
- signal: `spec_precision_gap` · recurrence: 1 feature(s) · scope: `frontend` · harmful: 0
- features: filter-persistence
- evidence: P1-Nav AC8 frontend/src/features/home/hooks/useHomeFilters.ts:84 (frontend)
- last seen: 2026-10-12T02:31:17Z

### L-005 - Carry every status flag the spec requires a view to show, such as former member, on each response DTO that view reads, not only on the CRUD response
- signal: `ac_gap` · recurrence: 1 feature(s) · scope: `api-dtos` · harmful: 0
- features: categories-revamp
- evidence: P3 AC7 / frontend/src/features/home/components/categories/CategoryTreeRow.tsx:137 (api-dtos)
- last seen: 2026-10-12T18:23:53Z

### L-006 - Give each AC-bearing route an integration test that seeds the feature's new settings, not only a pure-logic test fed hand-built rows
- signal: `ac_gap` · recurrence: 1 feature(s) · scope: `backend-it` · harmful: 0
- features: categories-revamp
- evidence: CAT-12 AC6, CAT-16 AC5 / backend CategorySpendingIT (no per-member or owner case) (backend-it)
- last seen: 2026-10-12T18:23:53Z

### L-007 - When a UI AC requires asking the user before a request, confirm at design time that the API exposes the data needed to decide up front
- signal: `spec_deviation` · recurrence: 1 feature(s) · scope: `frontend` · harmful: 0
- features: categories-revamp
- evidence: tasks.md T13 SPEC_DEVIATION / P1 Sub AC17 (frontend)
- last seen: 2026-10-12T18:23:53Z

### L-008 - State the rounding precision of every displayed percentage in the AC
- signal: `spec_precision_gap` · recurrence: 1 feature(s) · scope: `spec` · harmful: 0
- features: categories-revamp
- evidence: P2 AC4 memberLimitShares rounding (spec)
- last seen: 2026-10-12T18:23:53Z

### L-009 - For a form default driven by a selection, state what happens when the selection changes again and whether the default applies in edit mode
- signal: `spec_precision_gap` · recurrence: 1 feature(s) · scope: `spec` · harmful: 0
- features: categories-revamp
- evidence: P3 AC6 ownerDefaultAttribution (spec)
- last seen: 2026-10-12T18:23:53Z

### L-010 - When a rule lists new rows that carry a status flag, test each flag value on the new rows, not only on the rows that existed before
- signal: `surviving_mutant` · recurrence: 1 feature(s) · scope: `backend-assembler` · harmful: 0
- features: categories-revamp
- evidence: validation.md UX round B3 CategorySpendingAssembler.java:162 (backend-assembler)
- last seen: 2026-10-13T02:20:14Z

### L-011 - When an AC defines labels for a control, state the label for every input shape the control accepts, including custom ranges
- signal: `spec_precision_gap` · recurrence: 1 feature(s) · scope: `spec` · harmful: 0
- features: categories-revamp
- evidence: validation.md UX round UX-05 AC 8 periodNavigator.test.ts:88 (spec)
- last seen: 2026-10-13T02:20:14Z

### L-012 - When an AC defines a filtered view, state how it applies to every row variant, such as owned or limit-holding rows
- signal: `spec_precision_gap` · recurrence: 1 feature(s) · scope: `spec` · harmful: 0
- features: categories-revamp
- evidence: validation.md UX round UX-04 AC 7 owned rows (spec)
- last seen: 2026-10-13T02:20:14Z

### L-013 - Check at design time that reused colour tokens are distinguishable from each other and from status colours before naming them in the design
- signal: `spec_deviation` · recurrence: 1 feature(s) · scope: `frontend-design` · harmful: 0
- features: categories-revamp
- evidence: tasks.md U3 SPEC_DEVIATION member palette (frontend-design)
- last seen: 2026-10-13T02:20:14Z

### L-014 - When a page consumes navigation state that an AC depends on, test the page itself, not only the component that produces the state
- signal: `surviving_mutant` · recurrence: 1 feature(s) · scope: `frontend-pages` · harmful: 0
- features: session-persistence
- evidence: frontend/src/features/login/LoginPage.tsx:55 (mutant L1) (frontend-pages)
- last seen: 2026-10-16T17:58:23Z

### L-015 - Give every negative UI acceptance criterion an explicit test assertion that the element is absent
- signal: `ac_gap` · recurrence: 1 feature(s) · scope: `frontend-pages` · harmful: 0
- features: session-persistence
- evidence: spec.md P1 Persist AC 10 (no remember-me) - no assertion (frontend-pages)
- last seen: 2026-10-16T17:58:23Z

### L-016 - When a spec defines a global error toast, state whether the failing request's own error toast is suppressed
- signal: `spec_precision_gap` · recurrence: 1 feature(s) · scope: `frontend-api` · harmful: 0
- features: session-persistence
- evidence: validation.md Q2; buildMutationOptions.ts:44 toasts the 401 after expiry (frontend-api)
- last seen: 2026-10-16T17:58:23Z

### L-017 - Scope auth redirect criteria to private routes and say what public routes do on session expiry
- signal: `spec_deviation` · recurrence: 1 feature(s) · scope: `frontend-auth` · harmful: 0
- features: session-persistence
- evidence: tasks.md T12 SPEC_DEVIATION; validation.md Q1 (frontend-auth)
- last seen: 2026-10-16T17:58:23Z

### L-018 - For a one-shot notification, test that repeating the triggering condition later in the same session does not show it again
- signal: `surviving_mutant` · recurrence: 1 feature(s) · scope: `frontend-auth` · harmful: 0
- features: session-persistence
- evidence: frontend/src/app/providers/AuthProvider.tsx:113 (mutant A15, iteration 2) (frontend-auth)
- last seen: 2026-10-16T20:19:27Z

## Quarantined (failed when applied - ignore)

A confirmed lesson that recurred alongside failure. Kept for the maintainer to review.

_none_
