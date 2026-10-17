# Mobile Navigation Context

**Gathered:** 2026-10-16
**Spec:** `.specs/features/mobile-navigation/spec.md`
**Status:** Spec confirmed 2026-10-16; ready for design

---

## Feature Boundary

How the user moves between the app's screens and adds a transaction from anywhere, on narrow and wide screens. First topic of the second categories UX round (deferred in `categories-revamp/context.md`). The other three topics (mobile transactions list, category form, delete dialog and empty states) are separate features, one at a time. ROADMAP M5-09.

---

## Implementation Decisions

### Structure (narrow screens, < `sm`)

- A **fixed bottom bar** replaces the top tabs: Overview · Transactions · (+) · Categories · Plans, with the "+" as a prominent centre button (Mobills / Organizze pattern).
- **Plans is the fourth destination.** It balances the bar around the "+", and in a shared-plans app the members/invites screen is a real destination. The Plans page loses its "Back" button.
- The top bar keeps logo, plan switcher, theme toggle and avatar menu.
- The bar is **always visible**. It does not hide on scroll, and content gets bottom padding so nothing hides behind it.

### The "+" action

- One tap opens the **New Transaction form directly**, type Expense (DEBIT). The type toggle inside the form switches to Income. No intermediate menu.
- After saving, the user **stays on the current screen** and a toast reads "Transaction added." No navigation.
- **Hidden for VIEWERs** of the active plan. The backend already rejects their creates (`PlanAuthorization.java:16`), so the bar shows the four destinations, symmetric. The desktop "New Transaction" button hides too.

### Wide screens (≥ `sm`)

- **Desktop mirrors the mobile structure.** The top tab row reads Overview · Transactions · Categories · Plans, and "New Transaction" moves from the Transactions toolbar to the tab row, available on every destination.

### Agent's Discretion

Proposed by the agent and accepted by the user as a block (2026-10-16):

- Bar items show an icon with an always-visible label. The active item uses the `primary` colour. Icons come from lucide.
- "Manage plans" leaves the plan switcher dropdown, since Plans is now a destination. "Create plan" stays.
- The Transactions toolbar drops "New Transaction" (now global) and "Manage Categories" (Categories is one tap away). Import, search and filters stay as they are. The list itself is the next topic.
- The bar respects the iOS home-indicator safe area (`env(safe-area-inset-bottom)`), which prepares M5-07 PWA.
- Browser back between destinations works as today: a home tab switch pushes a history entry, and Plans keeps `/plans` and shows the same bar.
- The "+" adds to the active plan from the switcher, on every screen.
- "Transaction added." shows on every create through the "+" or "New Transaction", including inside Transactions. Edit and duplicate stay without a toast.

### Declined / Undiscussed Gray Areas → Assumptions

- The accept-invitation page shows no navigation bar or tab row, since it is a one-off flow before the user lands in the plan. Logged in the spec.

---

## Specific References

- Bottom bar with a centre "+": Mobills, Organizze.
- Always-visible bottom bar: Nubank, Mobills.

---

## Deferred Ideas

None. The discussion stayed within the feature scope. The remaining round-2 topics are queued as their own features.
