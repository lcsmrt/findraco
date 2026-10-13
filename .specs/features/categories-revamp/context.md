# Categories Revamp Context

**Gathered:** 2026-10-12
**Spec:** `.specs/features/categories-revamp/spec.md`
**Status:** Ready for design (pending spec confirmation)

---

## Feature Boundary

A Categories tab on the home page, two-level categories (parent > child) with rollup, per-member limits whose sum is the category limit, and categories owned by one member. ROADMAP M5-04.

---

## Implementation Decisions

### Scope

- All four pieces are in: own tab, subcategories, per-person categories, shared limit split between members.
- Priority order for delivery: tab + subcategories (P1), per-member limits (P2), owned categories (P3).

### Hierarchy

- Exactly two levels.
- A parent limit is the group's budget: the parent's direct spend and all children consume it.
- A child limit does not add to the parent limit; it is a narrower view on one slice of spending.
- Otherwise as recommended: parents accept transactions directly; the Overview shows parents expandable to children.

### Per-person

- Two cases: (1) a category that only applies to one member; (2) inside a category, each member has their own limit and the category limit is the sum.
- Owned categories stay visible to every member; ownership only drives attribution and limits.
- Per-member limits are entered as absolute amounts; the percent split is shown read-only.

### Categories tab

- Management + the selected period's spend: tree, limits, usage bar, per-member split, create/edit/delete. Replaces the current dialog.

### Agent's Discretion

None explicitly delegated.

### Declined / Undiscussed Gray Areas → Assumptions

Logged in the spec's Assumptions table: per-member spend measured by participation shares; items attributed proportionally; members without an entry; owned-category spend and default participant; children inherit owner and type; CREDIT rules; filter by parent includes children; delete with reassignment (409 without target); dormant data for former members; zero-change migration; dialog removal.

---

## Specific References

- The couple's plan already fakes hierarchy by name: "Alimentação - Delivery" / "Alimentação - Fora", "Compras - Casa" / "Compras - Pessoal" (see the raifu report `financas/gastos-por-categoria.md`).
- The user's example split: 65% / 35% inside one category.
- "Lívia Set" column in that report: how much of a category is only hers, i.e. the per-member view the tab should give natively.

---

## Deferred Ideas

- Private categories hidden from other members (IDEAS "Finer privacy controls").
- Percent-based entry for per-member limits.
- Automatic conversion of existing "Parent - Child" names.
- Hiding / archiving categories (YNAB, Actual Budget pattern).
- Item-level splits: the proportional item × member rule is provisional; user wants to revisit (IDEAS.md "Item-level splits").

---

## Amendment: UX polish round (2026-10-12)

Discuss pass after the first UAT, pace **Detailed** (one decision per turn, with benchmarks). User complaints: the Overview is ugly on mobile; expanding parents in the chart depends on where you click, uses ugly glyphs, and the parent › child hierarchy reads as mixed; nothing shows who spent; the Categories tab looks like a dashboard rather than an operational management screen and overlaps the Overview.

**Scope:** Categories tab + Overview (including general mobile layout). Transactions tab out.

### Screen roles

- The Categories tab is **pure management** (Monarch Settings › Categories, Organizze/Mobills pattern): structure and configuration only (tree, owner, configured limit, per-member split as configured values). No period picker, no spend, no usage bars.
- All tracking (spend vs limit, who spent) moves to the Overview, the single analysis screen. Spec P1 AC 3–5 and P2 AC 6 move to the Overview (spec amendment).
- Scope widened by the user: the Transactions tab's row actions and mobile layout are in too, for consistency.

### Row actions & mobile pattern (both Transactions and Categories)

- Consistency means the same actions with the same names and effects on every screen; the affordance may differ per device.
- **Desktop:** inline action icons revealed on row hover (current Transactions pattern), one click. Categories adopts the same icons.
- **Mobile (< sm):** no tables. List rows; tapping a row opens its edit form (one tap). Secondary actions (Duplicate, Delete) live in the form footer. Transactions grouped by day, description + category + people on the left, amount on the right (Nubank / Mobills / YNAB app pattern). In-cell editing stays desktop-only.
- Rejected: always-visible ⋮ menu (two clicks to edit, user wants minimum friction); swipe actions (low discoverability on web, scroll conflicts).

### Categories tab layout

- **Desktop:** aligned columns, Name | Owner | Monthly limit | Per member | actions (Monarch / Actual Budget settings pattern). Amounts right-aligned, `—` when empty. Per-member split always visible (no toggle), as absolute amounts; the percent appears only in a tooltip / the form.
- **Mobile:** stacked list rows (per the mobile pattern above).
- Ordering: alphabetical, roots then children; Expenses before Income. *(assumed, not contested)*
- New subcategory: on desktop a third hover icon **＋** on root rows (parent prefilled); on mobile in the parent's form footer. *(assumed, not contested)*
- Hierarchy: **always expanded**, no chevrons; parent in bold; children indented and tied to the parent by a thin tree guide (`├ └`).

### Overview: spending by category

- The Recharts horizontal bar chart is **replaced by an HTML list with progress bars** (Monarch Budget, Copilot, Mobills "Orçamentos", Nubank planning pattern): name, "R$ spent of R$ limit", remaining/overspent, thin bar. Parents expand by clicking anywhere on the row (real chevron icon); children indented with a thinner bar. Per-person info goes on these rows (see Per-person).
- Initial state: parents **collapsed, except those with a child over limit or in warning**, which open automatically (management by exception). Manual toggles last until leaving the page.
- Ordering: **alphabetical** (roots, then children), same as the Categories tab; problems surface by colour and auto-expansion, not position.

### Per-person (Overview)

- Each member gets a **fixed colour** (same as their avatar). Unfiltered, each category bar is **segmented by member**, with a secondary line "● Test 1.051 · ● Partner 694". Requires the backend to expose per-member spend for every category (today only for categories with per-member limits).
- Categories with per-member limits: one **always-visible sub-row per member** with their own bar against their own limit (the 👥 toggle goes away). Owned categories: owner pill, bar in the owner's colour.
- Consequence: status (ok / warning / over) can no longer be the bar colour; decided under Status semantics.
- **Member filter:** a category where the member has their own limit shows their spend vs their limit. A category without one keeps the whole-category bar against the shared limit, with the member's segment highlighted and the others dimmed; text "Partner 694 of 1.745 · shared limit 2.000". Never compares a member's share against the whole limit as if it were theirs (today's bug, `Limits.forRow`).
- **Selector:** chips "All · ● Test · ● Partner" with member colours (Honeydue pattern); doubles as the colour legend. More than 4 members → falls back to the combobox, with colour dots.
- **"By Person" card removed**, merged into the summary cards: Income and Expenses each get a member-segmented bar and "● Test 2.733 · ● Partner 2.414" under the total. Per-person net balance goes away.

### Overview general layout
- **Summary on mobile:** a single block, Balance as the hero on top, Income and Expenses side by side below, each with its member bar and per-member values on two short lines (~200px instead of ~450px; Nubank / Mobills home pattern). Desktop keeps three cards in a row, with member bars.
- **Trend:** always the **last 6 months** up to the end of the selected period (or the whole period if longer), as **grouped Income/Expense bars**, selected month highlighted (Monarch Cash Flow pattern). Placed at the bottom, after the categories. Replaces the single-dot line chart.
- **Period selector:** month navigator "‹ October 2026 ›" as the main control (arrows step month by month), plus a "Range ▾" menu (Last 3M · Last 6M · This year · Custom). On a range the label becomes "Aug – Oct 2026" and the arrows step the whole range (YNAB / Mobills / Nubank pattern). Member chips on the line below on mobile. Same on desktop.

### Status semantics

- Status lives in the **number, not the bar colour** (YNAB-style text + Monarch-style limit mark): right side reads "remaining 254" (muted, ok), "⚠ remaining 149" (amber, warning ≥ 80%), "▲ over by 67" (red, over).
- When over, the bar shows a strong vertical tick at the limit and the part beyond it hatched in red, keeping member colours.
- Percentages are integers (87%, not 87.28%).
- **No limit:** no bar and no track, only the amount and the per-member dots, so it never reads as a warning (fixes "no-limit" amber ≈ warning orange).
- The period navigator delivers ROADMAP M5-06 (month stepping) on the Overview.

### Deferred to a second UX round

The user picked these for discussion, then chose to ship the decisions above first and discuss these in a second round (2026-10-12). Until then they keep their current behaviour, adapted only as far as the decisions above require.

- **Mobile navigation:** top tabs (current) vs a fixed bottom bar (Overview · Transactions · Categories) with a "+" to add a transaction from any screen (Mobills / Organizze pattern).
- **Mobile transactions list details:** row content (installment k/N, recurrence, participants), per-day grouping with day totals, search and filters on mobile.
- **Category form:** field order, per-member limit editing, mobile presentation (bottom sheet vs full screen), placement of Delete / New subcategory.
- **Delete dialog and empty states:** reassignment dialog copy, "no categories" / "no spend in period" texts, skeletons, participants-follow-category behaviour.

### Interface language

- UI copy stays in English, as today; the Portuguese in the discussion mockups was only for the conversation. *(assumed, not contested)*

## Deferred Ideas (UX round)

- Per-person settlement ("who owes whom"); the per-person net balance was dropped with the By Person card.
- PWA / installable app → ROADMAP M5-07.
- Member-chosen colour: each member picks their own identity colour (today it is assigned by user-id order, UX-04 AC 2). User asked for it on 2026-10-13, after the colour palette shipped.
