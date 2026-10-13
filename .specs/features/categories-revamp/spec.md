# Categories Revamp Specification

## Problem Statement

Categories are a flat list managed from a dialog buried in the Transactions tab. Users fake hierarchy through names ("Food - Delivery", "Food - Dining out", "Shopping - Home", "Shopping - Personal"), so the dashboard cannot roll related spending together and a limit cannot cover a group. In a shared plan, every limit is plan-total: there is no way to say "this category is only mine" or "inside Groceries I may spend R$ 260 and my partner R$ 140".

## Goals

- [ ] Categories get a dedicated home tab where the whole tree, its limits and the selected period's spend are managed and tracked in one place.
- [ ] Categories form a two-level hierarchy (parent > child); a parent's spend and limit cover its children, so names no longer carry the hierarchy.
- [ ] A category limit can be set per member, with the category limit being the sum, and each member's spend is tracked against their own limit.
- [ ] A category can belong to one member; its spend and limit are that member's.

## Out of Scope

| Feature | Reason |
| ------- | ------ |
| Private categories (hidden from other members) | User chose "visible, but owned"; hiding rows changes authorization and dashboard totals. Stays in IDEAS ("Finer privacy controls"). |
| More than two levels | User chose parent > child only. |
| Automatic conversion of existing "Parent - Child" names | The user reorganizes by hand in the new tab (rename + set parent); confirmed 2026-10-12. |
| Percent-based per-member limit input | User chose absolute amount per member; the percent split is shown read-only. |
| Category icons / colors | Not requested. |
| Automatic categorization | Separate IDEAS item. |
| Hiding / archiving categories | YNAB and Actual recommend hiding over deleting for categories with history; useful, but a separate capability. Deferred. |
| Changing who may manage categories | OWNER-only management (AD-004) stays. |

---

## Assumptions & Open Questions

| Assumption / decision | Chosen default | Rationale | Confirmed? |
| --------------------- | -------------- | --------- | ---------- |
| Hierarchy depth | Exactly two levels: a category is either a root or a child of a root | User decision | y |
| Transactions on a parent | Transactions and items may use a parent directly; parent spend = direct spend + all children's spend | User accepted the recommended rollup | y |
| Parent vs. child limit | A parent limit is consumed by the parent's direct spend plus all children; a child limit is independent, consumed by the child's own spend only, and never adds to or changes the parent limit | User decision ("child limit is just a narrower view") | y |
| Per-member spend measure | A member's spend in a category is the sum of their participation `share_amount` on transactions in that category, not `created_by` | Matches the existing person breakdown and expense splitting (a 50/50 rent counts half each) | y |
| Per-member spend with line items | An item's amount is attributed to members in the same proportion as the parent transaction's participation shares | Items have no split of their own (AD-007); proportional keeps per-member totals equal to the category total; cents allocated by largest remainder. Provisional: user wants to revisit (IDEAS.md "Item-level splits") | y |
| Per-member limits model | Limits are entered as an absolute amount per member; the category limit equals their sum and is not editable separately while per-member limits exist | User decision | y |
| Members without a per-member limit | A member with no entry has no individual limit; their spend still counts toward the category spend and the category (sum) limit | Avoids hidden zero limits; the total stays honest | n |
| Owned category visibility | Every member sees owned categories and their transactions; only attribution and limits are the owner's | User decision | y |
| Owned category spend and limit | An owned category's spend shown in the tab and evaluated against its limit is the owner's participation spend only; per-member limits are not allowed on an owned category | "Only valid for me": a single person's limit is just the category limit | n |
| Owned category default participant | When a transaction is created in an owned category and the participants were not changed by hand, the owner is the single 100% participant | Owned spend lands on the owner without extra clicks | n |
| Owner on children | A child inherits its parent's owner and cannot set its own | Keeps a subtree consistently "mine" or "shared" | n |
| Type on children | A child must have the same type (DEBIT/CREDIT) as its parent | A rollup across types is meaningless | n |
| CREDIT categories | No limits (existing rule) and no per-member limits; hierarchy and ownership are allowed | Keeps the existing income behavior | n |
| Transaction filter by parent | Filtering transactions by a parent includes its children's transactions | Matches the rollup | n |
| Deleting a category in use | The delete takes an optional target category; when given, every transaction, item and recurrence definition is moved to it, then the category is deleted. Without a target, an in-use category is rejected with 409 and the body reports how many rows reference it | Benchmark: YNAB, Actual Budget and KMyMoney all prompt for a category to receive the transactions (merge) instead of refusing or cascading; 409 is the standard code for "still referenced" state conflicts | y |
| Deleting a parent | Rejected with 409 while it has children; children are moved or deleted first | Benchmark: YNAB web asks to move categories out before deleting a group | y |
| Member removed from / leaves the plan | Nothing is deleted. Their per-member limit entries and category ownership stay stored but dormant: excluded from the category limit sum and from limit evaluation, shown greyed as "former member" in the tab, and removable by the OWNER. When the same user rejoins, they reactivate unchanged | Benchmark: Splitwise, YNAB Together and collaborative tools revoke access but keep the person's data and history; findraco already keeps a removed member's transactions and participations (membership row is hard-deleted, history is not) | y |
| Migration of existing data | Existing categories become roots with no owner and no per-member limits; nothing else changes | Zero behavior change on deploy | n |
| Old Categories dialog | Removed; the Transactions tab links to the Categories tab instead | One place to manage categories | n |

**Open questions:** none - all resolved or logged above.

---

## User Stories

### P1: Categories tab ⭐ MVP

**User Story**: As a plan member, I want a Categories tab on the home page so that I manage categories and see how each one is doing in one place.

**Why P1**: Every other story shows up here; it replaces the buried dialog.

**Acceptance Criteria**:

1. The home page SHALL show three tabs in this order: Overview, Transactions, Categories.  <!-- ubiquitous -->
2. WHEN the user opens the Categories tab THEN the system SHALL list the plan's categories grouped by type (Expenses, then Income), each root followed by its children.  <!-- event-driven -->
3. WHEN the Categories tab is shown THEN each category row SHALL display its name, owner (if any), limit (if any), spend in the selected period and percent of limit used.  <!-- event-driven -->
4. WHEN the user changes the period on the Categories tab THEN the system SHALL recompute every row's spend for the new period.  <!-- event-driven -->
5. The Categories tab period SHALL persist in the URL and local storage using the same mechanism as the other home tabs (M5-03).  <!-- ubiquitous -->
6. WHILE the user's plan role is OWNER the Categories tab SHALL offer create, edit and delete actions.  <!-- state-driven -->
7. WHILE the user's plan role is not OWNER the Categories tab SHALL show the categories read-only, with no create, edit or delete actions.  <!-- state-driven -->
8. WHEN a category's spend exceeds its limit THEN its row SHALL be marked over limit.  <!-- event-driven -->
9. WHEN the user opens the Transactions tab THEN the system SHALL NOT offer the old Categories dialog and SHALL offer a link to the Categories tab instead.  <!-- event-driven -->

**Independent Test**: Open the Categories tab, switch the period, create/edit/delete a category as OWNER; open it as VIEWER and see no actions.

---

### P1: Two-level subcategories ⭐ MVP

**User Story**: As a plan owner, I want to nest categories one level (Food > Delivery) so that related spending rolls up and one limit can cover a group.

**Why P1**: This is the main pain (hierarchy faked in names).

**Acceptance Criteria**:

1. WHEN an OWNER creates or edits a category with a parent THEN the system SHALL save it as a child of that parent.  <!-- event-driven -->
2. IF the chosen parent is itself a child THEN the system SHALL reject the request with 400.  <!-- unwanted -->
3. IF a category that has children is given a parent THEN the system SHALL reject the request with 400.  <!-- unwanted -->
4. IF the chosen parent's type differs from the category's type THEN the system SHALL reject the request with 400.  <!-- unwanted -->
5. IF the chosen parent does not exist in the same plan THEN the system SHALL respond 404.  <!-- unwanted -->
6. IF an OWNER changes the type of a category that has children THEN the system SHALL reject the request with 400.  <!-- unwanted -->
7. The system SHALL compute a parent's spend as its direct spend plus the spend of all its children, using the item-aware partition of AD-007.  <!-- ubiquitous -->
8. The system SHALL compute a child's spend from the child alone.  <!-- ubiquitous -->
9. The system SHALL evaluate a parent's limit against the parent's rolled-up spend.  <!-- ubiquitous -->
10. The system SHALL evaluate a child's limit against the child's own spend, independently of the parent's limit.  <!-- ubiquitous -->
11. WHEN the Overview category breakdown is shown THEN the system SHALL list root categories with rolled-up spend, each expandable to its children.  <!-- event-driven -->
12. WHEN the user filters transactions by a parent category THEN the system SHALL return transactions in the parent and in all its children.  <!-- event-driven -->
13. WHEN the user picks a category in the transaction form or filter THEN the category picker SHALL show children under their parent, and both parents and children SHALL be selectable.  <!-- event-driven -->
14. IF an OWNER deletes a category that has children THEN the system SHALL reject the request with 409.  <!-- unwanted -->
15. WHEN an OWNER deletes a category in use with a target category of the same type and plan THEN the system SHALL move every transaction, item and recurrence definition to the target and delete the category in one transaction.  <!-- event-driven -->
16. IF the delete target is the category itself, one of its children, or of a different type THEN the system SHALL reject the request with 400.  <!-- unwanted -->
17. WHEN an OWNER opens the delete dialog for a category THEN the UI SHALL show how many transactions, items and recurrence definitions use it (from a usage endpoint) and, when any is above zero, SHALL require a target category before sending the delete.  <!-- event-driven -->
18. WHEN a client requests a category's usage THEN the system SHALL return the counts of transactions, items and recurrence definitions referencing it.  <!-- event-driven -->

**Independent Test**: Create Food > Delivery and Food > Dining out, set a R$ 400 limit on Food and R$ 200 on Delivery, add transactions to each; the Food row shows the sum against R$ 400, Delivery shows only its own spend against R$ 200.

---

### P2: Per-member limits

**User Story**: As a plan owner, I want to give each member their own limit inside a shared category so that we each track our own share (e.g. me R$ 260, my partner R$ 140, R$ 400 total).

**Why P2**: Needed for the couple's plan, but the tab and hierarchy deliver value without it.

**Acceptance Criteria**:

1. WHEN an OWNER sets per-member limits on a DEBIT category THEN the system SHALL store one absolute amount per listed member.  <!-- event-driven -->
2. WHILE a category has per-member limits the system SHALL report the category limit as the sum of those amounts.  <!-- state-driven -->
3. WHILE a category has per-member limits the system SHALL ignore any plain limit sent for that category.  <!-- state-driven -->
4. WHEN per-member limits are shown THEN the system SHALL display each member's share of the total as a read-only percentage rounded to one decimal place (0 when the total is 0).  <!-- event-driven -->
5. The system SHALL compute a member's spend in a category as the sum of that member's participation shares on the category's transactions, with item amounts attributed in proportion to those shares.  <!-- ubiquitous -->
6. WHEN the Categories tab shows a category with per-member limits THEN each member's row SHALL display their spend, their limit and an over-limit mark when their spend exceeds their limit.  <!-- event-driven -->
7. IF a per-member limit names a user who is not an active member of the plan THEN the system SHALL reject the request with 400.  <!-- unwanted -->
8. IF a per-member limit lists the same member twice THEN the system SHALL reject the request with 400.  <!-- unwanted -->
9. IF a per-member limit amount is negative THEN the system SHALL reject the request with 400.  <!-- unwanted -->
10. IF per-member limits are sent for a CREDIT category or an owned category THEN the system SHALL reject the request with 400.  <!-- unwanted -->
11. WHILE a user with a per-member limit entry is not an active member of the plan the system SHALL keep the entry, exclude it from the category limit sum and limit evaluation, and show it as "former member".  <!-- state-driven -->
12. WHEN a removed user rejoins the plan THEN the system SHALL apply their stored per-member limit entries again without reconfiguration.  <!-- event-driven -->
13. WHEN an OWNER removes a former member's entry THEN the system SHALL delete it.  <!-- event-driven -->

**Independent Test**: In a two-member plan, set Groceries to Lucas R$ 260 / Lívia R$ 140; the tab shows R$ 400 total and 65% / 35%; a 50/50 R$ 100 transaction adds R$ 50 to each member's spend.

---

### P3: Owned categories

**User Story**: As a plan owner, I want to mark a category as belonging to one member so that spending that only applies to that person is tracked as theirs.

**Why P3**: Covers fewer cases than per-member limits; the per-person breakdown already gives a partial view.

**Acceptance Criteria**:

1. WHEN an OWNER sets an owner on a root category THEN the system SHALL store that member as the category owner.  <!-- event-driven -->
2. The system SHALL give every child the owner of its parent.  <!-- ubiquitous -->
3. IF an owner is sent for a child category THEN the system SHALL reject the request with 400.  <!-- unwanted -->
4. IF the owner is not an active member of the plan THEN the system SHALL reject the request with 400.  <!-- unwanted -->
5. WHEN the Categories tab shows an owned category THEN its spend SHALL be the owner's participation spend and its limit SHALL be evaluated against that spend.  <!-- event-driven -->
6. WHILE creating a transaction whose participants were not edited by hand, WHEN the user selects a category THEN the form SHALL set the participants from the newly selected category: its active owner at 100% if it has one, otherwise the form's default participants.  <!-- complex -->
7. WHILE a category's owner is not an active member of the plan the system SHALL keep the ownership, show the owner as "former member", and allow the OWNER to clear or change it; when that user rejoins, the ownership applies again.  <!-- state-driven -->
8. The system SHALL show owned categories and their transactions to every plan member.  <!-- ubiquitous -->

**Independent Test**: Mark "Professional expenses" as Lucas's; create a transaction in it as Lívia without touching participants; Lucas is the 100% participant and the category spend counts only Lucas's share.

---

## Amendment: UX polish round (2026-10-12)

Decisions in `context.md` → "Amendment: UX polish round". The Categories tab becomes management-only; all tracking moves to the Overview, which replaces the category chart with a list that shows who spent. The Transactions tab gets a mobile list.

**Superseded ACs:** P1 Tab AC 3–5 (spend, percent and period on the Categories tab) → UX-01 and UX-03; P1 Sub AC 11 (Overview chart) → UX-03; P2 AC 6 and P3 AC 5 (per-member and owned rows) now apply to the Overview list → UX-04. P1 Tab AC 8 (over-limit mark) moves to the Overview → UX-03. All other ACs stand.

### UX: Categories tab is management-only

**Acceptance Criteria**:

1. The Categories tab SHALL NOT show a period selector, spend, percent used or usage bars.  <!-- ubiquitous -->
2. WHEN the Categories tab is shown on a wide screen (≥ `sm`) THEN each row SHALL show the name, owner, monthly limit and per-member limits as absolute amounts in aligned columns, with "—" for an empty value.  <!-- event-driven -->
3. The Categories tab SHALL list every category always expanded: roots sorted alphabetically, each followed by its children sorted alphabetically, children indented under a tree guide.  <!-- ubiquitous -->
4. WHILE the user's plan role is not OWNER the Categories tab SHALL show the same rows with no actions.  <!-- state-driven -->
5. WHILE an owner or a per-member limit entry belongs to a former member the Categories tab SHALL show it greyed as "former member".  <!-- state-driven -->

### UX: Row actions and mobile lists

**Acceptance Criteria**:

1. WHILE the screen is wide and the user is an OWNER, WHEN a Categories row is hovered or focused THEN it SHALL reveal Edit and Delete icons, plus New subcategory on root rows.  <!-- complex -->
2. WHEN the user picks New subcategory on a root THEN the create form SHALL open with that root as the parent.  <!-- event-driven -->
3. WHILE the screen is narrow (< `sm`) and the user is an OWNER, WHEN a Categories row is tapped THEN its edit form SHALL open, and the form footer SHALL offer Delete and, on a root, New subcategory.  <!-- complex -->
4. WHILE the screen is narrow the Transactions tab SHALL show a list instead of the table: rows grouped by day under a date heading, each row showing description, category, participants and signed amount.  <!-- state-driven -->
5. WHILE the screen is narrow, WHEN a transaction row is tapped THEN its edit form SHALL open, and the form footer SHALL offer Duplicate and Delete.  <!-- complex -->
6. WHILE the screen is wide the Transactions tab SHALL keep the current table, in-cell editing and hover action icons.  <!-- state-driven -->

### UX: Overview spending list

**Acceptance Criteria**:

1. The Overview SHALL show expense categories as a list, not a chart: roots sorted alphabetically, each root's children sorted alphabetically.  <!-- ubiquitous -->
2. WHEN a row has a limit THEN it SHALL show "spent of limit", a usage bar and its status text; WHEN a row has no limit THEN it SHALL show its spend with no bar and no track.  <!-- event-driven -->
3. The system SHALL classify a row with a limit as over when spend > limit, warning when spend ≥ 80% of the limit, and ok otherwise.  <!-- ubiquitous -->
4. WHEN a row's status is shown THEN ok SHALL read "remaining X" muted, warning "⚠ remaining X" in amber, and over "▲ over by X" in red.  <!-- event-driven -->
5. WHEN a row is over THEN its bar SHALL mark the limit with a vertical tick and hatch the part beyond it.  <!-- event-driven -->
6. WHEN the Overview loads THEN a root with children SHALL be collapsed unless one of its children is in warning or over, in which case it SHALL be expanded.  <!-- event-driven -->
7. WHEN the user clicks or taps anywhere on a root row that has children THEN the system SHALL toggle its children.  <!-- event-driven -->
8. The Overview SHALL show percentages as integers.  <!-- ubiquitous -->
9. The Overview SHALL scale monthly limits to the number of months in the selected period (existing rule).  <!-- ubiquitous -->

### UX: Per-person on the Overview

**Acceptance Criteria**:

1. WHEN a client requests category spending THEN the system SHALL list, for every category, each member with spend in it or with a per-member limit entry, with their spend, their own limit (null without one) and whether they are an active member.  <!-- event-driven -->
2. The system SHALL give each plan member a fixed colour from a palette, by their position in the plan's member list ordered by user id.  <!-- ubiquitous -->
3. WHILE no member is selected the Overview SHALL draw each category bar as segments in the members' colours sized by their spend, with a line listing each member's spend.  <!-- state-driven -->
4. WHILE a category has per-member limits the Overview SHALL show one sub-row per member, always visible, with that member's spend against their own limit and its status.  <!-- state-driven -->
5. WHEN the Overview shows an owned category THEN its row SHALL show an owner pill and a bar in the owner's colour holding the owner's spend.  <!-- event-driven -->
6. WHILE a member is selected, WHEN a category has a per-member limit for them THEN the row SHALL show that member's spend against their own limit.  <!-- complex -->
7. WHILE a member is selected, WHEN a category has no per-member limit for them THEN the row SHALL keep the whole-category bar against the category limit, highlight the member's segment, dim the others, and read "<member> X of Y · shared limit L"; it SHALL NOT evaluate the member's spend against the whole limit.  <!-- complex -->
8. WHILE the plan has 2 to 4 members the Overview SHALL offer the member filter as chips ("All" plus one per member with their colour dot); WHILE it has more than 4 it SHALL offer a combobox with colour dots; WHILE it has 1 it SHALL offer none.  <!-- state-driven -->
9. The Overview SHALL NOT show the By Person card.  <!-- ubiquitous -->

### UX: Overview summary, trend and period

**Acceptance Criteria**:

1. The Overview summary SHALL show Income, Expenses and Balance; Income and Expenses SHALL each show a bar segmented by member colours and each member's amount.  <!-- ubiquitous -->
2. WHILE a member is selected the summary SHALL show that member's totals and highlight their segment.  <!-- state-driven -->
3. WHILE the screen is narrow the summary SHALL be one block with Balance on top and Income and Expenses side by side; WHILE wide it SHALL be three cards in a row.  <!-- state-driven -->
4. The Overview SHALL show Income and Expenses as grouped bars per month for the 6 calendar months ending at the selected period's last month, or for every month of the selected period when it spans more than 6, after the category list.  <!-- ubiquitous -->
5. WHEN a month in the trend has no transactions THEN it SHALL show zero bars; WHEN a month lies inside the selected period THEN it SHALL be highlighted.  <!-- event-driven -->
6. WHILE a member is selected the trend SHALL show that member's amounts.  <!-- state-driven -->
7. WHEN a client requests the monthly trend for a date range and optional member THEN the system SHALL return income and expenses per month for that range.  <!-- event-driven -->
8. The Overview period control SHALL show the selected period as "October 2026" for one calendar month or "Aug – Oct 2026" for a longer range, with previous and next arrows that shift the period by its length in months.  <!-- ubiquitous -->
9. WHEN the user opens the range menu THEN it SHALL offer This month, Last 3 months, Last 6 months, This year and Custom.  <!-- event-driven -->
10. The Overview period SHALL persist in the URL and local storage using the existing home filter mechanism.  <!-- ubiquitous -->

---

## Edge Cases

- IF an OWNER deletes a category referenced by any transaction, item or recurrence definition without a target THEN the system SHALL reject the request with 409 and report the reference count, instead of today's server error.
- WHEN a category has no transactions in the period THEN its row SHALL show R$ 0 spend.
- WHEN a parent has no limit and a child has one THEN the parent SHALL show no limit and the child SHALL be evaluated on its own.
- WHEN per-member limits are all removed THEN the category SHALL have no limit until a plain limit is set.
- WHEN a limit is R$ 0 and spend is R$ 0 THEN percent used SHALL be 0 and the row SHALL not be over limit (existing `CategoryBreakdownDto` rule).
- WHEN a parent becomes a root again (parent cleared) THEN its spend SHALL no longer roll into the former parent.

---

## Implicit-Requirement Dimensions

| Dimension | Resolution |
| --------- | ---------- |
| Input validation & bounds | CAT-06, CAT-13, CAT-15 |
| Failure / partial-failure states | Category + per-member limits saved in one transaction; any invalid entry rejects the whole request (CAT-13) |
| Idempotency / retry | N/A because category updates are full-replace PUTs; per-member limits are replaced as a set on each update |
| Auth boundaries | OWNER-only management unchanged (CAT-04); reads stay plan-scoped via `PlanContext` |
| Concurrency / ordering | N/A because only the plan OWNER edits categories; last write wins as for every other entity |
| Data lifecycle | Member removal keeps dormant data (CAT-14); delete with reassignment or guard (CAT-10) |
| Observability | N/A because the project has no logging/metrics conventions for CRUD features |
| External-dependency failure | N/A because the feature calls no external service |
| State-transition integrity | Root ⇄ child moves and type changes guarded (CAT-06) |

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
| -------------- | ----- | ----- | ------ |
| CAT-01 | P1 Tab (AC 1–2, tabs and grouped tree) | Tasks | In Tasks |
| CAT-02 | P1 Tab (AC 3, 8, row content and over-limit mark) | Tasks | In Tasks |
| CAT-03 | P1 Tab (AC 4–5, period) | Tasks | In Tasks |
| CAT-04 | P1 Tab (AC 6–7, role gating) | Tasks | In Tasks |
| CAT-05 | P1 Tab (AC 9, dialog replaced) | Tasks | In Tasks |
| CAT-06 | P1 Sub (AC 1–6, hierarchy rules) | Tasks | In Tasks |
| CAT-07 | P1 Sub (AC 7–10, rollup and limits) | Tasks | In Tasks |
| CAT-08 | P1 Sub (AC 11, Overview breakdown) | Tasks | In Tasks |
| CAT-09 | P1 Sub (AC 12–13, filter and picker) | Tasks | In Tasks |
| CAT-10 | P1 Sub (AC 14–18) + Edge (delete in use), delete with reassignment and usage counts | Tasks | In Tasks |
| CAT-11 | P2 Member (AC 1–4, store, sum, display) | Tasks | In Tasks |
| CAT-12 | P2 Member (AC 5–6, spend by shares, per-member rows) | Tasks | In Tasks |
| CAT-13 | P2 Member (AC 7–10, validation) | Tasks | In Tasks |
| CAT-14 | P2 Member (AC 11–13) + P3 Owned (AC 7), dormant data for former members | Tasks | In Tasks |
| CAT-15 | P3 Owned (AC 1–4, owner rules) | Tasks | In Tasks |
| CAT-16 | P3 Owned (AC 5, 8, owner spend and visibility) | Tasks | In Tasks |
| CAT-17 | P3 Owned (AC 6, default participant) | Tasks | In Tasks |
| UX-01 | UX Categories tab (AC 1–5) | Tasks | In Tasks |
| UX-02 | UX Row actions and mobile lists (AC 1–6) | Tasks | In Tasks |
| UX-03 | UX Overview spending list (AC 1–9) | Tasks | In Tasks |
| UX-04 | UX Per-person (AC 1–9) | Tasks | In Tasks |
| UX-05 | UX Summary, trend and period (AC 1–10) | Tasks | In Tasks |

**ID format:** `CAT-NN` and `UX-NN` (UX polish round); each ID covers the AC range named in its row. CAT-02, CAT-03, CAT-08 and the display parts of CAT-12 / CAT-16 are superseded where the amendment says so.

**Coverage:** 22 total, 22 mapped to tasks, 0 unmapped

---

## Success Criteria

- [ ] The "Parent - Child" names in the couple's plan are replaced by real parent/child categories, and the Overview shows the rolled-up totals.
- [ ] Groceries can be tracked as Lucas R$ X / Lívia R$ Y with each person's spend against their own limit.
- [ ] Category management no longer requires opening a dialog from the Transactions tab.
