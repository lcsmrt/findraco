# Filter Persistence Specification

## Problem Statement

Every filter on the home screen lives in component-local state, and `HomePage` unmounts the inactive tab. Switching between Overview and Transactions, visiting `/plans`, or reloading the page throws away the period, member, category, date, amount, search and sort the user just set, so they re-filter constantly. Now that the app is used daily, this is the most frequent friction.

## Goals

- [ ] Filters on both home tabs survive tab switches, navigation to other pages and full page reloads.
- [ ] Each plan remembers its own filters; switching plans never applies one plan's category/member filters to another.
- [ ] A filtered view can be bookmarked or shared as a URL and reopens identically.

## Out of Scope

| Feature | Reason |
| ------- | ------ |
| Server-side sync of filters across devices | Needs a backend preferences store; per-device persistence covers the current single-user-per-device usage. Revisit with M5-05 (MCP) if needed. |
| Named / saved views ("My groceries view") | A separate feature; this one only remembers the last-used state. |
| Sharing filters between tabs (Overview member ⇄ Transactions member) | Each tab keeps independent filter state, matching how dashboards and lists diverge in mature tools. |
| Remembering the table page number | Page position is navigation, not a filter; mature list UIs reset it on return. |

---

## Assumptions & Open Questions

| Assumption / decision | Chosen default | Rationale | Confirmed? |
| --------------------- | -------------- | --------- | ---------- |
| Persistence mechanism | URL query params are the source of truth for the visible state; the last-used state is also saved in `localStorage` and restored when the home route is opened without filter params | Industry-standard hybrid (GitHub/Jira/Stripe URL state + Linear/Notion sticky views); survives reload, keeps back button and shareable links | n (user leaned to localStorage; hybrid proposed) |
| Persistence scope | Per user, per plan: storage key namespaced by user id and plan id | User chose "each plan remembers its own"; user id prevents leaking state between accounts on a shared browser | y (per plan) |
| Logout | Saved filters are kept on logout (not cleared) | A session expiry should not wipe filters; keys are namespaced by user | n |
| Relative periods | Overview presets are stored as tokens (`this-month`, `last-3m`, `last-6m`, `this-year`) and resolved to dates at read time; a custom range is stored as absolute dates | Prevents a remembered "this month" from freezing on a past month | n |
| What is remembered (sticky) | Active home tab; Overview period + member; Transactions type, category, member, date range, amount range, description search, sort, page size | User picked tab + Overview period/person; search, sort and page size count as view state in mature tools | n (search/sort/size) |
| What is not remembered | Transactions page number (reset to the first page on restore) | See Out of Scope | n |
| History behaviour | Changing a filter replaces the current history entry; switching tabs pushes a new entry | Back button navigates between screens/tabs, not through every filter tweak | n |
| Stale references | A remembered category or member that no longer exists in the plan is dropped silently | Deleted category / member who left the plan must not break the screen | n |
| Storage unavailable | Fall back to URL + in-memory state with no error shown | Private mode / blocked storage must not break filtering | n |

**Open questions:** none - all resolved or logged above (required before the spec is confirmed).

---

## User Stories

### P1: Filters survive tab switches and navigation ⭐ MVP

**User Story**: As a plan member, I want the filters I set on Overview and Transactions to still be applied when I come back to that tab, so that I don't re-filter every time I switch views.

**Why P1**: This is the reported pain.

**Acceptance Criteria**:

1. WHEN the user changes a Transactions filter (type, category, member, date range, amount range, description search), sort or page size THEN the system SHALL reflect that value in the home URL query params.
2. WHEN the user changes the Overview period (preset or custom range) or member THEN the system SHALL reflect that value in the home URL query params.
3. WHEN the user switches from one home tab to the other and back THEN the system SHALL show the returning tab with exactly the filters it had before the switch.
4. WHEN the user navigates from home to `/plans` and back to home through the app navigation THEN the system SHALL restore the active tab and that tab's filters.
5. WHEN filters are restored on Transactions THEN the system SHALL show the first page of results.
6. WHEN the user changes a filter THEN the system SHALL replace the current browser history entry instead of pushing a new one.
7. WHEN the user switches home tabs THEN the system SHALL push a new browser history entry so Back returns to the previous tab.
8. WHEN the user clicks "Clear filters" on Transactions THEN the system SHALL remove all Transactions filter params from the URL and from the saved state.

**Independent Test**: Set a category + date filter on Transactions, set "Last 3M" + a member on Overview, switch tabs both ways and visit `/plans`; both tabs come back with their filters.

---

### P1: Filters survive page reload ⭐ MVP

**User Story**: As a plan member, I want my last filters to come back after a reload or reopening the app, so that the app opens the way I left it.

**Why P1**: User explicitly wants persistence beyond the session.

**Acceptance Criteria**:

1. WHEN any home filter, the sort, the page size or the active tab changes THEN the system SHALL save the resulting state to `localStorage` under a key namespaced by the current user id and active plan id.
2. WHEN the home route is opened with no filter query params THEN the system SHALL restore the saved state for the current user and plan and write it into the URL.
3. WHEN the home route is opened with filter query params THEN the system SHALL apply the URL params and save them as the new remembered state.
4. WHEN a remembered Overview preset period is restored THEN the system SHALL resolve it to dates relative to the current date (a saved `this-month` restored in a later month SHALL show that later month).
5. WHEN a remembered custom date range is restored THEN the system SHALL apply the same absolute dates that were saved.
6. IF no saved state exists for the current user and plan THEN the system SHALL show the current defaults (Overview tab, `this-month`, no member, no Transactions filters, page size 10, no sort).
7. IF `localStorage` is unavailable or throws THEN the system SHALL keep filtering through URL and in-memory state without showing an error.

**Independent Test**: Apply filters on both tabs, reload the browser; same tab and filters appear. Open `/` in a new browser tab; same state appears.

---

### P1: Each plan remembers its own filters ⭐ MVP

**User Story**: As a member of several plans, I want each plan to keep its own filters, so that switching plans never shows a stale category or member from another plan.

**Why P1**: Category and member ids are plan-scoped; leaking them across plans shows wrong or empty data.

**Acceptance Criteria**:

1. WHEN the user switches the active plan THEN the system SHALL replace the home filters with the saved state of the newly active plan, or the defaults if it has none.
2. WHEN the user switches back to a previous plan THEN the system SHALL restore that plan's last filters.
3. The system SHALL never apply a category id or member id saved for one plan while a different plan is active.

**Independent Test**: Filter plan A by a category, switch to plan B (no filters shown), filter B by a member, switch back to A; A's category filter is back.

---

### P2: Shareable filtered URL

**User Story**: As a user, I want to bookmark or share a filtered view as a link, so that I can jump straight to "groceries this month".

**Why P2**: Falls out of the URL design; valuable but not the core pain.

**Acceptance Criteria**:

1. WHEN a user opens a home URL containing valid filter params for a plan they belong to THEN the system SHALL render the tab and filters encoded in the URL, including the filter chips with the category and member names.
2. IF a URL param holds an unparseable value (non-numeric id, malformed date, unknown period token, unknown sort field) THEN the system SHALL ignore that param and apply the default for it.

**Independent Test**: Copy the URL of a filtered Transactions view, open it in a private window after logging in; the same filters and chips appear.

---

## Edge Cases

- IF a restored or URL category id does not belong to the active plan's categories THEN the system SHALL drop the category filter and remove it from the URL and saved state.
- IF a restored or URL member id is not a current member of the active plan THEN the system SHALL drop the member filter and remove it from the URL and saved state.
- IF the restored custom range has `from` after `to` THEN the system SHALL discard the custom range and fall back to `this-month`.
- WHEN the active plan has a single member THEN the system SHALL hide the Overview member picker and ignore any saved Overview member filter (current behaviour preserved).

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
| -------------- | ----- | ----- | ------ |
| FPERS-01 | P1: Tab switch & navigation (AC 1–2, URL sync) | Tasks | In Tasks |
| FPERS-02 | P1: Tab switch & navigation (AC 3–5, restore on return) | Tasks | In Tasks |
| FPERS-03 | P1: Tab switch & navigation (AC 6–7, history) | Tasks | In Tasks |
| FPERS-04 | P1: Tab switch & navigation (AC 8, clear) | Tasks | In Tasks |
| FPERS-05 | P1: Reload (AC 1–3, save/restore precedence) | Tasks | In Tasks |
| FPERS-06 | P1: Reload (AC 4–5, relative vs absolute periods) | Tasks | In Tasks |
| FPERS-07 | P1: Reload (AC 6–7, defaults & storage failure) | Tasks | In Tasks |
| FPERS-08 | P1: Per-plan (AC 1–3) | Tasks | In Tasks |
| FPERS-09 | P2: Shareable URL (AC 1–2) | Tasks | In Tasks |
| FPERS-10 | Edge cases (stale ids, bad range, single member) | Tasks | In Tasks |

**Coverage:** 10 total, 10 mapped to tasks, 0 unmapped

---

## Success Criteria

- [ ] Zero filter resets when switching tabs, visiting `/plans`, reloading or switching plans and back.
- [ ] A copied home URL reopens the identical filtered view.
