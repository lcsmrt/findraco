# Mobile Form Sheet Specification

**Approved**: 2026-11-04 - user: "Provo, manda bala."

## Problem Statement

On the phone, the transaction and category forms open as a side sheet built for the desktop: it slides in from the right, its footer stacks up to three full-width rows, and the footer does not stay in place while the form scrolls (user, 2026-11-04). Creating a category from the transaction form opens the whole category form on top of it, a detour when all the user needs is a name. This is the "category form: mobile presentation" topic deferred to the second UX round of `categories-revamp`.

## Goals

- [ ] On the phone, both forms open as a sheet that rises from the bottom edge, with their actions always visible.
- [ ] A missing category is created from the transaction form's category picker in one tap, without leaving the form.

## Out of Scope

| Feature | Reason |
| ------- | ------ |
| A "Discard changes?" confirmation when a changed form is closed | User, 2026-11-04: start simple; every dismissal closes, as today |
| Parent, spending limit or owner at quick-create | Configuration belongs to the Categories tab (user, 2026-11-04) |
| An "Edit" action on the quick-create toast | It would open the category form over the transaction form, the stacking this feature removes |
| The iOS-style scaled-down sheet behind a nested one | No sheet is nested any more |
| Footer layout on the desktop | Only the phone layout was discussed |
| Other overlays (delete confirmations, filter popover, date picker) | Not form sheets |

---

## Assumptions & Open Questions

| Assumption / decision | Chosen default | Rationale | Confirmed? |
| --------------------- | -------------- | --------- | ---------- |
| Phone vs desktop | Below 640px (Tailwind `sm`) the bottom sheet; from 640px the right side sheet of today | The bottom bar switches at the same width (`BottomBarView` `sm:hidden`) | y (agent's discretion) |
| Phone presentation | A bottom sheet sized to its content, at most 95% of the dynamic viewport height, the form scrolling inside it | User, 2026-11-04 (over full screen) | y |
| Dismissal | Swipe down, backdrop tap, Escape and Cancel all close at once, with no confirmation, changes lost | User, 2026-11-04: start simple | y |
| Phone footer | Mobile actions (Delete, Duplicate, New subcategory) on one row; Cancel and Submit side by side on the row below | User, 2026-11-04: try the compact footer | y |
| Creating a category from the transaction form | An inline "Create … category" row in the category picker creates the category and selects it; no sheet opens | User, 2026-11-04 | y |
| Type of a quick-created category | The type selected in the transaction form at that moment, named in the row ("expense" / "income") | User, 2026-11-04; the picker already lists only that type | y |
| When the create row shows | Whenever the trimmed search is non-empty and no category of that type has the same name, ignoring case and surrounding spaces, also next to partial matches | User, 2026-11-04 | y |
| Who sees the create row | Users whose plan permissions include managing categories | The API refuses category creation to everyone else; today the row shows to all and fails on save | y |
| Name length | The create row is not shown when the trimmed search exceeds 255 characters | The API bound on a category description | y |

**Open questions:** none - all resolved or logged above.

---

## User Stories

### P1: Form sheets fit the phone ⭐ MVP

**User Story**: As a user on the phone, I want the transaction and category forms to rise from the bottom with their buttons always in reach so that filling them feels native.

**Why P1**: The PWA (M5-07) made the phone the daily channel; the forms are where the daily work happens.

**Acceptance Criteria**:

1. WHILE the viewport is narrower than 640px the system SHALL open every form sheet anchored to the bottom edge at full width.
2. WHILE the viewport is 640px or wider the system SHALL open every form sheet anchored to the right edge, as today.
3. WHILE the viewport is narrower than 640px the form sheet SHALL be as tall as its content, up to 95% of the dynamic viewport height.
4. WHILE the content is taller than the form sheet, the system SHALL scroll the form inside the sheet and keep the title and the footer in place.
5. WHILE the viewport is narrower than 640px the form sheet SHALL show a drag handle at its top edge.
6. WHEN the user swipes the bottom sheet down while the form is scrolled to its top THEN the system SHALL close the sheet without saving.
7. WHEN the user taps the backdrop or presses Escape THEN the system SHALL close the sheet without saving.
8. WHILE the virtual keyboard is open on the phone, the footer SHALL stay visible above the keyboard.

**Independent Test**: On a 390px viewport, open New Transaction from the bottom bar: the sheet rises from the bottom, the footer stays put while the form scrolls, and a swipe down closes it.

---

### P1: Compact footer on the phone ⭐ MVP

**User Story**: As a user on the phone, I want the form footer to take as little height as possible so that more of the form shows above the keyboard.

**Why P1**: Three stacked full-width rows leave little room on a phone with the keyboard open.

**Acceptance Criteria**:

1. WHILE the viewport is narrower than 640px the system SHALL place Cancel and Submit on one row, each taking half its width, Submit on the right.
2. WHERE a form passes mobile actions, the system SHALL place them on one row above Cancel and Submit.
3. WHERE a form passes no mobile actions, the footer SHALL hold a single row.

**Independent Test**: On a 390px viewport, editing a transaction shows two footer rows (Delete · Duplicate, then Cancel · Save); creating one shows a single row.

---

### P1: Create a category without leaving the transaction form ⭐ MVP

**User Story**: As a user logging a transaction, I want to create a missing category from the category picker in one tap so that I never leave the transaction I am typing.

**Why P1**: It removes the only nested sheet, which a bottom sheet makes awkward.

**Acceptance Criteria**:

1. WHILE the user can manage categories and the trimmed search is non-empty, the category picker SHALL show, below the matches, a row reading `Create expense category "<search>"` for an expense transaction and `Create income category "<search>"` for an income one.
2. IF a category of the transaction's type has the same name as the trimmed search, ignoring case, THEN the picker SHALL NOT show the create row.
3. IF the user cannot manage categories THEN the picker SHALL NOT show the create row.
4. IF the trimmed search exceeds 255 characters THEN the picker SHALL NOT show the create row.
5. WHEN the user selects the create row THEN the system SHALL create a category with the trimmed search as its description, the transaction's type, and no parent, spending limit or owner.
6. WHEN the category is created THEN the system SHALL select it in the transaction form, keep every other value of the form, and open no other sheet.
7. WHEN the category is created THEN the system SHALL show the toast `Category "<description>" created`.
8. WHILE the creation request is pending, the create row SHALL be disabled.
9. IF the creation fails THEN the system SHALL show the copy of the returned problem type in a toast, keep the search text, and leave the transaction form unchanged.

**Independent Test**: In an expense transaction, type "Pet" in the category picker, tap `Create expense category "Pet"`: the picker closes with "Pet" selected and the toast shows.

---

## Edge Cases

- IF the search is only spaces THEN the picker SHALL NOT show the create row.
- WHEN the user changes the transaction type after quick-creating a category THEN the system SHALL clear the selected category, as today, and the created category SHALL remain in the plan.

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
| -------------- | ----- | ----- | ------ |
| MFS-01 | P1: Form sheets fit the phone | Execute | Implementing |
| MFS-02 | P1: Compact footer on the phone | Execute | Implementing |
| MFS-03 | P1: Create a category without leaving the transaction form | Execute | Pending |

**Coverage:** 3 total, 0 mapped to tasks, 3 unmapped ⚠️

---

## Success Criteria

- [ ] On the user's iPhone (PWA), both forms rise from the bottom, the footer never scrolls away, and a swipe down closes them.
- [ ] Creating a missing category from a transaction takes one tap after typing its name.

---

## Checks

Tasks are implicit (Medium scope): T1 the form sheet (MFS-01, MFS-02), T2 the quick-create (MFS-03), T3 the release bump. The visual claims are walked in Storybook at a 390×844 window; the virtual keyboard (MFS-01 AC 8) cannot open in headless Chromium and is confirmed at UAT on the user's iPhone.

**Build**: cd frontend && pnpm lint; cd frontend && pnpm build; cd frontend && node scripts/check-siblings.ts

**Run unit**: cd frontend && pnpm exec vitest run --project=unit --reporter=verbose src/hooks/useIsNarrowScreen.test.ts src/features/transactions/utils/categoryQuickCreate.test.ts src/features/transactions/components/TransactionFormDrawer.test.tsx

**C1** - Below 640px a form sheet opens anchored to the bottom edge (MFS-01, AC 1)
Proof: run unit | ✓ opens as a bottom sheet on a narrow screen

**C2** - From 640px a form sheet opens anchored to the right edge (MFS-01, AC 2)
Proof: run unit | ✓ opens on the right on a wide screen

**C3** - The narrow-screen query reads 639px and below as narrow, 640px as wide (MFS-01, AC 1 and 2)
Proof: run unit | ✓ reports 639px as narrow and 640px as wide

**C4** - At 390px the bottom sheet is as tall as a short form, and a long form stops at 95% of the viewport height (MFS-01, AC 3)
Proof: walk - FormSheet stories Short and Long at 390×844: Short ends below its content, Long's top edge sits at 42px or less from the top (844 × 5%)

**C5** - Scrolling a long form keeps the title and the footer in place (MFS-01, AC 4)
Proof: walk - FormSheet story Long at 390×844, form scrolled to its end: title and footer at the same screen position as before the scroll

**C6** - The bottom sheet shows a drag handle at its top edge (MFS-01, AC 5)
Proof: walk - FormSheet story Short at 390×844: a handle bar centred at the sheet's top edge

**C7** - A downward swipe from the top of the form closes the sheet and nothing is submitted (MFS-01, AC 6)
Proof: walk - FormSheet story Short at 390×844: a pointer drag down from the handle closes the sheet; the story's submit spy stays uncalled

**C8** - Escape and a backdrop tap close the sheet without saving (MFS-01, AC 7)
Proof: run unit | ✓ closes without saving on Escape or a backdrop tap

**C9** - With the keyboard open the footer stays visible (MFS-01, AC 8)
Proof: walk - not reachable in headless Chromium; confirmed by the user on the iPhone PWA at UAT

**C10** - At 390px Cancel and Submit share one row, Submit on the right (MFS-02, AC 1)
Proof: walk - FormSheet story Short at 390×844: Cancel and Submit side by side, equal width, Submit right

**C11** - With mobile actions the footer has two rows, actions above (MFS-02, AC 2)
Proof: walk - FormSheet story WithMobileActions at 390×844: Delete and Duplicate on the first row, Cancel and Submit on the second

**C12** - Without mobile actions the footer has one row (MFS-02, AC 3)
Proof: walk - FormSheet story Short at 390×844: a single footer row

**C13** - The create row reads `Create expense category "<search>"` for an expense and `Create income category "<search>"` for an income, also next to partial matches (MFS-03, AC 1)
Proof: run unit | ✓ labels the create row with the transaction type, next to partial matches

**C14** - A category of the same type and name, ignoring case and surrounding spaces, hides the create row (MFS-03, AC 2)
Proof: run unit | ✓ offers no create row when a category of that type has the same name

**C15** - Without the manage-categories permission there is no create row (MFS-03, AC 3)
Proof: run unit | ✓ offers no create row without the manage-categories permission

**C16** - A trimmed search over 255 characters, or of spaces only, shows no create row (MFS-03, AC 4; edge case 1)
Proof: run unit | ✓ offers no create row for a blank search or one over 255 characters

**C17** - Tapping the create row posts description `Pet`, the transaction's type, and no parent, limit or owner (MFS-03, AC 5)
Proof: run unit | ✓ creates the typed category with the transaction type and nothing else

**C18** - After creation the category is selected, the other values are kept and no other dialog opens (MFS-03, AC 6)
Proof: run unit | ✓ selects the created category, keeps the other values and opens no other sheet

**C19** - After creation the toast reads `Category "Pet" created` (MFS-03, AC 7)
Proof: run unit | ✓ shows the created toast

**C20** - While the request is pending the create row is disabled (MFS-03, AC 8)
Proof: run unit | ✓ disables the create row while the request is pending

**C21** - A failed creation shows its problem copy, keeps the search text and leaves the form unchanged (MFS-03, AC 9)
Proof: run unit | ✓ shows the problem copy and keeps the search when creation fails

**C22** - Changing the type after a quick-create clears the category; the created category stays in the list (edge case 2)
Proof: run unit | ✓ clears a quick-created category when the type changes

---

## Handoff

**Settled mid-build:** none
**Dispatched:** batch worker T1–T3 (Sonnet) at HEAD after the spec commit
**Walked:** not yet
