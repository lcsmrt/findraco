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
