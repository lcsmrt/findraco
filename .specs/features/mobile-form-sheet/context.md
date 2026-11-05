# Mobile Form Sheet Context

**Gathered:** 2026-11-04
**Spec:** `.specs/features/mobile-form-sheet/spec.md`
**Status:** Ready for design

---

## Feature Boundary

On the phone, the two form sheets (transaction, category) become a bottom sheet with a compact, fixed footer; the transaction form's category picker creates a missing category inline instead of opening the category form. The desktop keeps its right side sheet.

---

## Implementation Decisions

### Phone presentation

- A bottom sheet sized to its content, at most 95% of the viewport, with a drag handle; chosen over full screen, which leaves the short category form mostly empty and needs its own back control.

### Dismissal

- Every dismissal closes at once, changes lost, as today (user: "start simple, improve later if needed").

### Footer

- Compact: mobile actions on one row, Cancel · Submit side by side below. The footer not staying fixed today is a bug this feature fixes (MFS-01 AC 4).

### Category creation from the transaction form

- Both stacking options (sheet over sheet, full screen over sheet) felt wrong to the user. Mid-transaction the user needs only a name, so the picker creates the category inline with the name and the transaction's type, selects it, and shows a toast. Configuration (parent, limit, owner) stays in the Categories tab.
- The row names the type: `Create expense category "Pet"`.

### Agent's Discretion

- Breakpoint: 640px, the bottom bar's.
- The toast carries no "Edit" action: it would reopen the stacking.

### Declined / Undiscussed Gray Areas → Assumptions

- None; all four areas were discussed.

---

## Specific References

- Inline tag creation as in Notion, Linear and Todoist.
- Base UI `Drawer` (installed, `@base-ui/react` 1.6): swipe to dismiss, virtual keyboard provider.

---

## Deferred Ideas

- "Discard changes?" confirmation on closing a changed form.
- A small parent picker on the create row, if creating subcategories from a transaction turns out to be common.
