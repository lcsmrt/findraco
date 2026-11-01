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

### L-019 - Before designing a Secure cookie or any HTTPS-only mechanism, confirm production is actually served over HTTPS
- signal: `spec_precision_gap` · recurrence: 1 feature(s) · scope: `deploy` · harmful: 0
- features: session-persistence
- evidence: design.md AD-009 (Secure session cookie) vs production served over plain HTTP at 72.60.1.97:8094 (deploy)
- last seen: 2026-10-17T00:16:24Z

### L-020 - Test a count-based guard at its boundary (exactly one item), not only with several
- signal: `surviving_mutant` · recurrence: 1 feature(s) · scope: `test-infrastructure` · harmful: 0
- features: frontend-standards
- evidence: validation.md M28 src/test/unhandledRequests.ts:19 (test-infrastructure)
- last seen: 2026-10-19T05:32:26Z

### L-021 - Prove global test-harness wiring with a test that triggers it, not only the helper it calls
- signal: `surviving_mutant` · recurrence: 1 feature(s) · scope: `test-infrastructure` · harmful: 0
- features: frontend-standards
- evidence: validation.md M29 src/test/setupUnit.ts:18 (test-infrastructure)
- last seen: 2026-10-19T05:32:26Z

### L-022 - A lint rule that recognises a construct syntactically needs RuleTester cases for its indirect forms (through a variable or a call), or it can be evaded
- signal: `ac_gap` · recurrence: 1 feature(s) · scope: `lint-rules` · harmful: 0
- features: frontend-standards
- evidence: STD-12 AC 3 eslint/rules/componentLogicCap.ts:15 (lint-rules)
- last seen: 2026-10-19T05:32:26Z

### L-023 - When an AC bans mocking our own modules, name which test kinds it covers (service hooks, other hooks, flows)
- signal: `spec_precision_gap` · recurrence: 1 feature(s) · scope: `testing` · harmful: 0
- features: frontend-standards
- evidence: SP-3 STD-04 AC 4 (testing)
- last seen: 2026-10-19T05:32:26Z

### L-024 - Mark ACs that only review can check as review-enforced in the spec, so the Verifier does not expect a mechanical gate
- signal: `spec_precision_gap` · recurrence: 1 feature(s) · scope: `spec` · harmful: 0
- features: frontend-standards
- evidence: SP-1 STD-10 AC 3; SP-2 STD-09 AC 3 (spec)
- last seen: 2026-10-19T05:32:26Z

### L-025 - Give every AST node type a custom lint rule listens to its own RuleTester case
- signal: `surviving_mutant` · recurrence: 1 feature(s) · scope: `eslint-rules` · harmful: 0
- features: frontend-standards
- evidence: validation.md iteration 1: N2 (componentLogicCap.ts JSXFragment listener) (eslint-rules)
- last seen: 2026-10-19T12:00:37Z

### L-026 - When trimming a flow test because a pure function's unit test covers its values, keep a flow case for any component wiring around that function (when it is called, guards, refs that change its inputs)
- signal: `ac_gap` · recurrence: 1 feature(s) · scope: `frontend flow tests` · harmful: 0
- features: test-calibration
- evidence: AUD-04; validation.md M9/M10 (frontend flow tests)
- last seen: 2026-10-20T06:24:27Z

### L-027 - A lookup table or mapping is data, not one rule: assert every entry in one table-driven case rather than a single sample entry
- signal: `surviving_mutant` · recurrence: 1 feature(s) · scope: `frontend unit tests` · harmful: 0
- features: test-calibration
- evidence: M6 transactionSort.ts:13 (frontend unit tests)
- last seen: 2026-10-20T06:24:28Z

### L-028 - When a screen's param-key list drives persistence or clearing, test that a URL holding only the new keys is saved, restored and cleared as intended.
- signal: `surviving_mutant` · recurrence: 1 feature(s) · scope: `frontend/url-params` · harmful: 0
- features: period-navigator
- evidence: transactionParams.ts:31 M4 (frontend/url-params)
- last seen: 2026-10-31T13:03:51Z

### L-029 - Start an interaction story from the state users actually reach (the default), not a state chosen to make the interaction pass.
- signal: `ac_gap` · recurrence: 1 feature(s) · scope: `frontend/stories` · harmful: 0
- features: period-navigator
- evidence: PNAV-04 AC2; PeriodNavigator.stories.tsx:78 (frontend/stories)
- last seen: 2026-10-31T13:03:51Z

### L-030 - Write layout acceptance criteria as assertable structure (order, landmark, role), or mark them as visual review only.
- signal: `spec_precision_gap` · recurrence: 1 feature(s) · scope: `frontend/specs` · harmful: 0
- features: period-navigator
- evidence: PNAV-01 AC8 (frontend/specs)
- last seen: 2026-10-31T13:03:51Z

### L-031 - Verify a generated service worker by running it in a real browser (cache populated, offline navigation renders), not by reading its precache list
- signal: `ac_gap` · recurrence: 1 feature(s) · scope: `frontend build, pwa` · harmful: 0
- features: pwa
- evidence: PWA-02 AC 1/2/4; frontend/vite.config.ts:114 (frontend build, pwa)
- last seen: 2026-11-01T17:06:54Z

### L-032 - Assert an outcome only the tested branch can cause, so a sibling branch reaching the same state does not satisfy the test
- signal: `surviving_mutant` · recurrence: 1 feature(s) · scope: `frontend flow tests` · harmful: 0
- features: pwa
- evidence: M5 frontend/src/app/providers/InstallAppProvider.tsx:36 (frontend flow tests)
- last seen: 2026-11-01T17:06:54Z

### L-033 - For a fail-open AC, state what a failed later check does to state already shown, not only to the first check
- signal: `spec_precision_gap` · recurrence: 1 feature(s) · scope: `spec` · harmful: 0
- features: pwa
- evidence: PWA-04 AC 5; frontend/src/app/providers/useVersionManifest.ts:29 (spec)
- last seen: 2026-11-01T17:06:54Z

### L-034 - Cover timer-driven triggers (intervals, timeouts) with fake-timer flow cases; an AC listing several triggers needs one case per trigger
- signal: `ac_gap` · recurrence: 1 feature(s) · scope: `frontend flow tests` · harmful: 0
- features: pwa
- evidence: PWA-03 AC 8; frontend/src/app/providers/useVersionManifest.ts:37 (frontend flow tests)
- last seen: 2026-11-01T17:06:54Z

## Quarantined (failed when applied - ignore)

A confirmed lesson that recurred alongside failure. Kept for the maintainer to review.

_none_
