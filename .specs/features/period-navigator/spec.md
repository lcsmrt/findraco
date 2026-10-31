# Period Navigator Specification

## Problem Statement

On the Transactions screen, the period is a Date field buried in the filters popover, and the list opens unbounded, so answering "what did we spend this month" on a phone takes a popover, two date taps and an Apply. The Overview already steps month by month with the `PeriodNavigator`, but its label does nothing on click; a custom range takes Range → Custom…. ROADMAP M5-06 is a 1.0 criterion ("daily use on the phone without friction").

## Goals

- [ ] On Transactions, moving to the previous or next month takes one tap, from any screen width.
- [ ] Transactions opens on a month, never on the unbounded list.
- [ ] On both screens, a custom range is one tap on the label away.

## Out of Scope

| Feature | Reason |
| ------- | ------ |
| One period shared by Overview and Transactions | Deferred (user, 2026-10-31); each screen keeps its own period |
| "All time" option on Transactions | User chose to try without it; a wide Custom range covers it |
| Quarter / semester / year stepping granularity | Parked in ROADMAP M5-06 (2026-10-11) |
| Backend changes | The list endpoint already filters by `startDateFrom` / `startDateTo` |
| Other filters (type, category, member, amount, search), sort, page size | Unchanged |

---

## Assumptions & Open Questions

| Assumption / decision | Chosen default | Rationale | Confirmed? |
| --------------------- | -------------- | --------- | ---------- |
| Default period on Transactions | This month, as a relative preset (still the current month in a later month) | Same default as the Overview; user picked option 1 with this default | y |
| Date control in the filters popover | Removed; the navigator is the only date control | User, 2026-10-31 | y |
| Date chip and active-filter count | No date chip; the period does not count as an active filter | The label already shows the period at all times | y |
| Clear filters | Leaves the period unchanged | The period is location, not a filter (user, 2026-10-31) | y |
| Range menu options on Transactions | This month · Last 3 months · Last 6 months · This year · Custom… (no All time) | User, 2026-10-31 | y |
| Persistence | Period saved and restored with the screen's other params, per (user, plan), like the Overview; an arrow-reached month is restored as that fixed month | User, 2026-10-31: keep the last month viewed | y |
| Placement | Own row above the search row, left-aligned, on every width | Same position as the Overview (user, 2026-10-31) | y |
| Label click | Opens the same range calendar as Custom…, on both screens; Custom… stays in the menu | Agent's discretion, stated to the user | y |
| Page after a period change | First page | A page number from another period points at unrelated rows | y |
| Arrow step | The period's own length in months (1, 3, 6, 12), as on the Overview | Reuse of `shiftRange`; one behaviour for both screens | y |
| Invalid or partial range in the URL | A custom range missing either end, with an unparsable date, or with its start after its end → This month; the old `from`/`to` params are ignored | Design: Transactions uses the Overview's `period`/`periodFrom`/`periodTo` keys; falling back beats an error | y |
| Old links / saved states with no date param | Open on This month (before: unbounded) | Default changes by design; single-user links | y |

**Open questions:** none - all resolved or logged above.

---

## User Stories

### P1: Step through months on Transactions ⭐ MVP

**User Story**: As a plan member, I want the Transactions list to open on the current month and step month by month so that I see one month's transactions without opening filters.

**Why P1**: It is the M5-06 gap that blocks the 1.0 phone-use criterion.

**Acceptance Criteria**:

1. WHEN a member opens Transactions with no period in the URL and no saved state THEN the system SHALL show the label for the current calendar month (e.g. "October 2026") and request only transactions with a start date from the first to the last day of that month.  <!-- event-driven -->
2. WHEN the member taps "Previous period" on a one-month period THEN the system SHALL show the previous calendar month's label and transactions, across a year boundary (January 2026 → December 2025).  <!-- event-driven -->
3. WHEN the member taps "Next period" on a one-month period THEN the system SHALL show the next calendar month's label and transactions.  <!-- event-driven -->
4. WHEN the member picks a Range menu option (This month, Last 3 months, Last 6 months, This year) THEN the system SHALL request the range that option resolves to on the Overview and show that range's label.  <!-- event-driven -->
5. WHEN the member taps an arrow on a multi-month period THEN the system SHALL move the range by its own length in months (3-month range Aug–Oct 2026 → May–Jul 2026).  <!-- event-driven -->
6. WHEN the period changes THEN the system SHALL show the first page of the list.  <!-- event-driven -->
7. The Transactions Range menu SHALL offer exactly This month, Last 3 months, Last 6 months, This year and Custom….  <!-- ubiquitous -->
8. The navigator SHALL sit on its own row above the search row, left-aligned, on every screen width.  <!-- ubiquitous -->
9. WHEN the period changes THEN the system SHALL keep the other filters, the search, the sort and the page size unchanged.  <!-- event-driven -->

**Independent Test**: Open Transactions on a plan with transactions in September and October 2026; see "October 2026" and only October rows; tap ‹ and see "September 2026" and only September rows.

---

### P1: The navigator replaces the date filter ⭐ MVP

**User Story**: As a plan member, I want one date control on Transactions so that the period is never set in two places.

**Why P1**: Without it, the popover and the navigator disagree about the same `from`/`to`.

**Acceptance Criteria**:

1. The Transactions filters popover SHALL have no date field.  <!-- ubiquitous -->
2. The Transactions filter chips SHALL include no chip for the period.  <!-- ubiquitous -->
3. The active-filter count on the filters button SHALL not count the period.  <!-- ubiquitous -->
4. WHEN the member clears all filters THEN the system SHALL keep the current period.  <!-- event-driven -->

**Independent Test**: Step to September, apply a category filter, tap "Clear all"; the category chip goes away and the label still reads "September 2026".

---

### P1: Last period viewed is restored ⭐ MVP

**User Story**: As a plan member, I want Transactions to come back on the month I last looked at so that switching screens does not lose my place.

**Why P1**: User decision; without it the arrows' result is lost on every tab switch.

**Acceptance Criteria**:

1. WHEN the member leaves Transactions on an arrow-reached month and returns to it without query params THEN the system SHALL show that same month.  <!-- event-driven -->
2. WHEN the member leaves Transactions on a preset (e.g. This month) and returns in a later calendar month THEN the system SHALL resolve the preset against the current date (This month → the new current month).  <!-- event-driven -->
3. The saved period SHALL be kept per (user, plan), like the screen's other saved params.  <!-- ubiquitous -->

**Independent Test**: Step to August, open Overview, open Transactions from the nav bar; the label reads "August 2026".

---

### P2: Label opens the range calendar

**User Story**: As a plan member, I want to tap the period label to pick a custom range so that a custom range is one tap away.

**Why P2**: Convenience on both screens; Custom… in the menu already reaches it.

**Acceptance Criteria**:

1. WHEN the member clicks the period label on the Overview or on Transactions THEN the system SHALL open the range calendar that Custom… opens, preset to the current range.  <!-- event-driven -->
2. WHEN the member picks a range of two different days in that calendar THEN the system SHALL apply it as the period and close the calendar.  <!-- event-driven -->
3. The period label SHALL be a button with an accessible name that announces it opens the period picker and includes the current label.  <!-- ubiquitous -->
4. The Range menu SHALL keep its Custom… item.  <!-- ubiquitous -->

**Independent Test**: On either screen, tap "October 2026", pick 5–20 Oct, see "5 – 20 Oct 2026" and rows from those days only.

---

## Edge Cases

- IF the URL carries a custom range missing either end, with an unparsable date, or with its start after its end THEN the system SHALL use This month.
- IF the URL carries the pre-feature `from` / `to` params THEN the system SHALL ignore them and use This month.
- WHEN the URL or saved state has no period at all (links from before this feature) THEN the system SHALL use This month.
- WHEN the chosen month has no transactions THEN the system SHALL show the existing "No transactions found." empty state with the navigator still usable.
- WHEN the period is a custom range not aligned to whole months THEN the system SHALL label it with its days, as on the Overview ("5 – 20 Oct 2026").

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
| -------------- | ----- | ----- | ------ |
| PNAV-01 | P1: Step through months (AC 1–9) | Execute | Verified |
| PNAV-02 | P1: Navigator replaces the date filter (AC 1–4) | Execute | Verified |
| PNAV-03 | P1: Last period viewed is restored (AC 1–3) | Execute | Verified |
| PNAV-04 | P2: Label opens the range calendar (AC 1–4) | Execute | Verified |
| PNAV-05 | Edge cases (invalid / missing range, empty month, day-range label) | Execute | Verified |

**Coverage:** 5 total, 5 mapped to tasks (T1–T6, F1–F3), 0 unmapped

---

## Success Criteria

- [ ] From Transactions on a phone, the previous month's list is one tap away.
- [ ] Transactions never opens on the unbounded list.
- [ ] On both screens, a custom range is one tap on the label away.
