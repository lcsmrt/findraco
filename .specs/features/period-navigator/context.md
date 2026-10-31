# Period Navigator Context

**Gathered:** 2026-10-31
**Spec:** `.specs/features/period-navigator/spec.md`
**Status:** Ready for design

---

## Feature Boundary

ROADMAP M5-06, second half. The Overview already has the `PeriodNavigator` ("‹ October 2026 ›" + Range menu, categories-revamp U4). This feature brings the same navigator to the Transactions screen, which opens on the current month, and makes a click on the label open the range calendar on both screens. Sharing one period across the screens is not part of it (user, 2026-10-31: "futuramente a gente pensa").

---

## Implementation Decisions

### Scope

- Option 1 of three (user, 2026-10-31): navigator on Transactions + label click on both screens. Shared period across screens (option 2) deferred.
- Transactions opens on the current month instead of the unbounded list.

### Date filter in the popover

- The navigator is the only date control on Transactions. The popover's Date field and the date chip go away, and the period no longer counts as an active filter.
- "Clear all" / clear filters leaves the period untouched: the period is where you are, not a filter.

### Range menu options on Transactions

- Same options as the Overview: This month · Last 3 months · Last 6 months · This year · Custom…
- No "All time" (user, 2026-10-31): a wide Custom range covers it. Add later if it is missed.

### Persistence

- The period is restored like the Overview does today: the saved query string per (user, plan) brings back the last period, including a month reached with the arrows. No reset to the current month on entering the screen (user, 2026-10-31: "tem que ficar o mês que eu tava olhando por último").

### Placement

- Own row above the search row, left-aligned, on every screen width, matching the Overview's position so the label does not move when switching screens.

### Agent's Discretion

Stated by the agent, not contested by the user (2026-10-31):

- Clicking the label opens the same range calendar as "Custom…"; "Custom…" stays in the menu.
- Changing the period sends the list back to its first page.
- Arrows step by the period's own length, as on the Overview.
- Old links with only `from` or only `to`, or with `from` after `to`, open on the current month.

### Declined / Undiscussed Gray Areas → Assumptions

- None beyond the agent's-discretion items above, which are logged in the spec's Assumptions.

---

## Specific References

- The Overview's `PeriodNavigator` (`frontend/src/features/overview/components/PeriodNavigator.tsx`) is the reference: same label, arrows, menu and calendar.

---

## Deferred Ideas

- One period shared by Overview and Transactions (changing the month on one moves the other).
- "All time" option on the Transactions Range menu, if a wide Custom range turns out to be friction.
