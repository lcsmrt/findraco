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

## Quarantined (failed when applied - ignore)

A confirmed lesson that recurred alongside failure. Kept for the maintainer to review.

_none_
