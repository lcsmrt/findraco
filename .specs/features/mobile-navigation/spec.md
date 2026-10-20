# Mobile Navigation Specification

## Problem Statement

On a phone, the home tabs sit at the top, out of thumb reach, and adding a transaction (the most frequent action) is only possible from inside the Transactions tab. Plan management is buried behind "Manage plans" in the plan switcher, with a "Back" button to return. Milestone M5 ("Capture Every Day") needs capture to be one tap away from any screen.

## Goals

- [ ] From any main screen, on any screen width, a member who may create transactions opens the New Transaction form in one tap.
- [ ] On a phone, every destination (Overview, Transactions, Categories, Plans) is reachable in one tap from a bar within thumb reach.
- [ ] Narrow and wide screens offer the same destinations and the same global add action.

## Out of Scope

| Feature | Reason |
| ------- | ------ |
| Mobile transactions list content (k/N, recurrence, day totals, mobile search/filters) | Separate round-2 topic, one at a time (user, 2026-10-16) |
| Category form layout and presentation | Separate round-2 topic |
| Delete dialog copy, empty states, skeletons | Separate round-2 topic |
| Hide-on-scroll bottom bar | User chose an always-visible bar |
| Action menu on "+" (import, new category) | User chose "+" opens the form directly |
| Role gating of other actions (import, edit, delete) for VIEWERs | Not discussed; only the "+" is gated here |
| PWA manifest / service worker | ROADMAP M5-07 |

---

## Assumptions & Open Questions

| Assumption / decision | Chosen default | Rationale | Confirmed? |
| --------------------- | -------------- | --------- | ---------- |
| Narrow vs wide | Narrow = below the `sm` breakpoint (640px); wide = `sm` and up | The breakpoint the app already uses to swap the table for the mobile list | y |
| Bar labels and active state | Icon with an always-visible label; active item in the `primary-ink` colour | Agent proposal, accepted; `primary-ink`, not `primary`, because plain amber text fails contrast (Execute, 2026-10-19) | y |
| "Manage plans" in the switcher | Removed; "New plan" (the existing create item) stays | Plans is a destination now | y |
| Transactions toolbar | "New Transaction" and "Manage Categories" removed; import, search and filters unchanged | Both are now redundant | y |
| Safe area | The bar pads its bottom by `env(safe-area-inset-bottom)` | iOS home indicator; prepares the PWA | y |
| History | Every destination switch pushes a history entry; each destination has its own path (NAV-06) | Changed at Design (user, 2026-10-19): the `?tab=` param mixed location with filters | y |
| Old `/?tab=` links | Not mapped: like any `/` visit they land on `/overview` | Very few users and bookmarks; a mapping would be kept forever for a case that barely exists (user, 2026-10-19) | y |
| Filters saved before NAV-06 | Not carried over: each screen starts from its defaults once after the deploy | Converting the old per-page format is code for one day (user, 2026-10-19) | y |
| Target plan of "+" | The active plan from the switcher | One active plan everywhere (AD-005) | y |
| Toast scope | "Transaction added." ("Series created." for a series) on every successful create, global add or not, duplicate included; edit and delete keep a success toast in the short style (NAV-05) | Corrected at Design (user, 2026-10-19): edit and duplicate already toasted; the earlier "stay without a toast" misdescribed them | y |
| Role still loading | While the active plan or its role is not loaded, the global add is hidden | Avoids flashing the "+" for a VIEWER | n |
| Accept-invitation page | Shows neither the bottom bar nor the tab row | A one-off flow before the user lands in the plan | n |

**Open questions:** none - all resolved or logged above.

---

## User Stories

### P1: Bottom navigation bar ⭐ MVP

**User Story**: As a member on a phone, I want the app's destinations in a bar at the bottom so that I switch screens with my thumb.

**Why P1**: The core of the topic; the global add sits inside it.

**Acceptance Criteria**:

1. WHILE the screen is narrow, the Overview, Transactions, Categories and Plans screens SHALL show a bar fixed to the bottom of the viewport with, in order: Overview, Transactions, a centre add button, Categories, Plans.  <!-- state-driven -->
2. WHILE the screen is narrow, the system SHALL NOT show the top tab row.  <!-- state-driven -->
3. Each destination in the bottom bar SHALL show an icon and a visible text label.  <!-- ubiquitous -->
4. WHEN the current screen is a destination THEN its bottom-bar item SHALL be shown in the `primary-ink` colour and marked `aria-current="page"`.  <!-- event-driven -->
5. WHEN the user taps Overview, Transactions or Categories THEN the system SHALL navigate to that screen's path (NAV-06), with that screen's saved filters for the active plan.  <!-- event-driven -->
6. WHEN the user taps Plans THEN the system SHALL navigate to `/plans`.  <!-- event-driven -->
7. WHILE the bottom bar is shown, it SHALL stay visible during scrolling, and the page SHALL reserve bottom space equal to the bar's height so the last content is not covered.  <!-- state-driven -->
8. The bottom bar SHALL pad its bottom edge by `env(safe-area-inset-bottom)`. Checked by hand on a phone: the inset is 0 in the test browser.  <!-- ubiquitous -->

**Independent Test**: On a 390px-wide viewport, tap each bar item and see the matching screen with the item highlighted; scroll a long list to the end and see its last row above the bar.

---

### P1: Add a transaction from anywhere ⭐ MVP

**User Story**: As a member who may add transactions, I want a "+" on every main screen so that I log an expense the moment it happens.

**Why P1**: The capture gain is the reason for the topic (M5 goal).

**Acceptance Criteria**:

1. WHILE the screen is wide, the Overview, Transactions, Categories and Plans screens SHALL show a "New Transaction" button in the tab row.  <!-- state-driven -->
2. WHEN the user activates the bottom-bar add button or the "New Transaction" button THEN the system SHALL open the New Transaction form for the active plan with type Expense selected.  <!-- event-driven -->
3. WHEN a transaction is created from the global add THEN the system SHALL close the form, keep the user on the screen they were on, and show the toast "Transaction added." ("Series created." when the form created a recurring or installment series).  <!-- event-driven -->
4. WHEN a transaction is created from the global add THEN the system SHALL refresh the active plan's transaction, dashboard and category data so the current screen reflects it.  <!-- event-driven -->
5. WHILE the user's role in the active plan is VIEWER the system SHALL NOT show the bottom-bar add button or the "New Transaction" button.  <!-- state-driven -->
6. WHILE the add button is hidden the bottom bar SHALL show its four destinations evenly spaced.  <!-- state-driven -->
7. IF creating the transaction fails THEN the system SHALL keep the form open with the entered values and SHALL NOT show a success toast.  <!-- unwanted-behavior -->
8. The Transactions toolbar SHALL NOT show its own "New Transaction" button.  <!-- ubiquitous -->

**Independent Test**: As an EDITOR on the Overview, tap "+", save an expense, stay on the Overview with the toast and updated totals; as a VIEWER, see no "+" and no "New Transaction".

---

### P2: Plans as a destination

**User Story**: As a plan owner, I want Plans next to the other destinations so that I reach members and invites without digging through the switcher.

**Why P2**: Balances the bar and the desktop tabs; the screen itself is unchanged.

**Acceptance Criteria**:

1. WHILE the screen is wide, the tab row SHALL show, in order: Overview, Transactions, Categories, Plans.  <!-- state-driven -->
2. WHILE the screen is wide, the Overview, Transactions, Categories and Plans screens SHALL show the tab row, with the current destination marked active.  <!-- state-driven -->
3. WHEN the user activates the Plans tab THEN the system SHALL navigate to `/plans`.  <!-- event-driven -->
4. The Plans page SHALL NOT show a "Back" button.  <!-- ubiquitous -->
5. The plan switcher dropdown SHALL NOT offer "Manage plans" and SHALL keep "New plan".  <!-- ubiquitous -->

**Independent Test**: On desktop, click Plans in the tab row, see the Plans page with the tab active and no "Back"; open the switcher and see no "Manage plans".

---

### P3: Transactions toolbar cleanup

**User Story**: As a member, I want the Transactions toolbar free of shortcuts the navigation already gives me so that search and filters have room on a phone.

**Why P3**: Follows from the new navigation; small.

**Acceptance Criteria**:

1. The Transactions toolbar SHALL NOT show the "Manage Categories" button.  <!-- ubiquitous -->
2. The Transactions toolbar SHALL keep search, filters and import with their current behaviour.  <!-- ubiquitous -->

**Independent Test**: Open Transactions on phone and desktop; see search, filters and import, and no "Manage Categories" or "New Transaction".

---

### P3: Short success messages

**User Story**: As a member, I want success messages short enough to read at a glance so that a toast confirms the action without stopping me.

**Why P3**: Added at Design (user, 2026-10-19): "Transaction added." would sit next to "…successfully." messages; the user chose one short style for every success toast.

**Acceptance Criteria**:

1. Every success toast raised by an API service SHALL be a short past-tense sentence without the word "successfully", with the wording in the design's message table.  <!-- ubiquitous -->
2. WHEN an API service's mutation succeeds THEN the system SHALL show the message the design's message table lists for that mutation.  <!-- event-driven -->

**Independent Test**: Create, edit and delete a category, a plan rename and a transaction; each toast matches the table.

---

### P2: One address per screen

**User Story**: As a member, I want each screen to have its own address so that a link, a bookmark or the Back button lands on that screen with its own filters.

**Why P2**: Added at Design (user, 2026-10-19): with tabs as a query param, a link from Plans to a tab lost that tab's filters.

**Acceptance Criteria**:

1. The system SHALL serve Overview at `/overview`, Transactions at `/transactions`, Categories at `/categories` and Plans at `/plans`.  <!-- ubiquitous -->
2. WHEN the user opens Overview, Transactions or Categories without filter params THEN the system SHALL apply that screen's last filters for the active plan, or its defaults when none are saved.  <!-- event-driven -->
3. WHEN the user changes a screen's filters THEN the system SHALL save them for that screen and the active plan, without changing another screen's saved filters.  <!-- event-driven -->
4. WHEN the user switches the active plan THEN the system SHALL stay on the same screen and apply that plan's saved filters for it.  <!-- event-driven -->
5. WHEN the user opens a screen's link that carries filter params THEN the system SHALL apply them, making the link's plan active when the user belongs to it.  <!-- event-driven -->
6. WHEN the user opens `/` THEN the system SHALL redirect to `/overview`.  <!-- event-driven -->

**Independent Test**: Filter Transactions by "mercado", go to Plans, tap Transactions: the search is still "mercado"; tap Overview: its own period, untouched; open the site root: land on `/overview`.

---

## Edge Cases

- WHILE the active plan or the user's role in it is not loaded the system SHALL NOT show the global add.
- WHEN the user switches the active plan to one where they are a VIEWER THEN the global add SHALL disappear without a reload.
- WHEN the global add form is open on the Plans page and the user saves THEN the system SHALL stay on the Plans page.
- WHILE the New Transaction form is open on a narrow screen it SHALL cover the bottom bar. Checked by hand: it follows from the overlay layer (`z-50`) sitting above the bar (`z-20`).
- The accept-invitation page SHALL show neither the bottom bar nor the tab row.

---

## Implicit-Requirement Dimensions

| Dimension | Resolution |
| --------- | ---------- |
| Input validation & bounds | N/A because the transaction form and its validation are unchanged |
| Failure / partial-failure states | Failed create keeps the form and shows no success toast (NAV-02 AC 7) |
| Idempotency / retry | N/A because creation semantics are unchanged; the button is the existing form's |
| Auth boundaries | Global add hidden for VIEWER (NAV-02 AC 5); backend enforcement unchanged |
| Concurrency / ordering | N/A because the feature adds no shared state |
| Data lifecycle | Saved filters move to one entry per (user, plan, screen) in local storage; old per-page entries are ignored (NAV-06) |
| Observability | N/A because the project has no frontend telemetry conventions |
| External-dependency failure | N/A because the feature calls no new service |
| State-transition integrity | Role change on plan switch updates the add button (Edge Cases) |

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
| -------------- | ----- | ----- | ------ |
| NAV-01 | P1 Bottom bar (AC 1–8) | Execute | Implemented (pending verification) |
| NAV-02 | P1 Add from anywhere (AC 1–8) + Edge (role loading, plan switch, Plans page, form covers bar) | Execute | Implemented (pending verification) |
| NAV-03 | P2 Plans as a destination (AC 1–5) + Edge (accept-invitation page) | Execute | Implemented (pending verification) |
| NAV-04 | P3 Toolbar cleanup (AC 1–2) | Execute | Implemented (pending verification) |
| NAV-05 | P3 Short success messages (AC 1–2) | Execute | Implemented (pending verification) |
| NAV-06 | P2 One address per screen (AC 1–6) | Execute | Implemented (pending verification) |

**ID format:** `NAV-NN`; each ID covers the AC range named in its row.

**Coverage:** 6 total, 0 mapped to tasks, 6 unmapped ⚠️ (before Tasks)

---

## Success Criteria

- [ ] On the phone, logging an expense from the Overview takes one tap to open the form, with no screen change after saving.
- [ ] Every destination is one tap away on the phone, with the thumb.
- [ ] A VIEWER never sees an add action they cannot complete.
