# Mobile Form Sheet verification

**Verdict**: FAIL
**Proofs**: `proofs.md` at a3fc971 (code unchanged at 6aab821)
**Verifier**: independent sub-agent (author != verifier)

## Checks

| Check | Test | Holds |
| --- | --- | --- |
| C1 | `TransactionFormDrawer.test.tsx` `opens as a bottom sheet on a narrow screen` | yes - `data-side` is a proxy for the anchoring, which the C4 walk shows; inverting `isNarrow` fails it |
| C2 | `TransactionFormDrawer.test.tsx` `opens on the right on a wide screen` | yes |
| C3 | `useIsNarrowScreen.test.ts` `reports 639px as narrow and 640px as wide` | yes - both sides of the bound and the change back; 640px query fails it |
| C4 | walk - FormSheet `Short` and `Long` at 390x844 (`short.png`, `long-before.png`) | yes - Short sized to its content, Long's top at ~42px |
| C5 | walk - FormSheet `Long` scrolled (`long-before.png`, `long-scrolled.png`) | yes - title and footer at the same position after scrolling to Field 20 |
| C6 | walk - FormSheet `Short` (`short.png`) | yes - handle centred at the top edge |
| C7 | walk - FormSheet `Short` swipe (`short-after-swipe.png`) | partly - the sheet is gone, but the walk records "the submit button was never pressed", not the submit spy the check names; only a swipe from the handle, not from the scrolled-to-top form body |
| C8 | `TransactionFormDrawer.test.tsx` `closes without saving on Escape or a backdrop tap` | yes - `false` twice and no non-GET request; dropping the close in `FormSheet` fails it |
| C9 | walk - deferred to UAT on the iPhone PWA | no - not walked; the `**Walked:**` line does not mention C9, yet `proofs.md` records it as pass |
| C10 | walk - FormSheet `Short` (`short.png`) | yes - Cancel x16 w175, Submit x199 w175 |
| C11 | walk - FormSheet `WithMobileActions` (`mobile-actions.png`) | yes |
| C12 | walk - FormSheet `Short` (`short.png`) | yes |
| C13 | `categoryQuickCreate.test.ts` `labels the create row with the transaction type, next to partial matches` | yes - exact labels for both types, "Pet shop" partial match present |
| C14 | `categoryQuickCreate.test.ts` `offers no create row when a category of that type has the same name` | yes for the search side (`"  fOOd "`, other type); the trim of the stored name is untested (mutation survived) |
| C15 | `categoryQuickCreate.test.ts` `offers no create row without the manage-categories permission` | no - holds the pure rule only; `CategoryCombobox` passing `canManageCategories: true` keeps every test green |
| C16 | `categoryQuickCreate.test.ts` `offers no create row for a blank search or one over 255 characters` | yes - 256 hidden, padded 255 shown, blank and empty hidden |
| C17 | `TransactionFormDrawer.test.tsx` `creates the typed category with the transaction type and nothing else` | yes - exact body `{ type, description }`; sending the raw search fails it |
| C18 | `TransactionFormDrawer.test.tsx` `selects the created category, keeps the other values and opens no other sheet` | yes - category, description, amount, one dialog, and the saved transaction carries `categoryId: 77` |
| C19 | `TransactionFormDrawer.test.tsx` `shows the created toast` | yes - exact copy, called once |
| C20 | `TransactionFormDrawer.test.tsx` `disables the create row while the request is pending` | yes - gated handler; `disabled: false` fails it |
| C21 | `TransactionFormDrawer.test.tsx` `shows the problem copy and keeps the search when creation fails` | yes - exact problem copy, search, category and description kept |
| C22 | `TransactionFormDrawer.test.tsx` `clears a quick-created category when the type changes` | yes |

Discrimination sensor: 16 mutations, 13 killed, 3 survived (`CategoryCombobox` permission forced true; stored-description trim removed in `categoryQuickCreate`; `setSearch("")` after success removed - no criterion fixes the last, so it is not a finding). Own examples at `HEAD`, all as the spec states: tab/newline-only search, `água` vs stored `ÁGUA`, `food` vs stored ` Food `, a 1000-character search, an empty list, and the drawer rendered with `manageCategories: false` (no create row).

Implementation review: no `eslint-disable`/`@ts-ignore`; `--drawer-keyboard-inset` and `--drawer-swipe-movement-y` are real Base UI 1.6 variables; the desktop footer keeps the stacked full-width buttons (`sm:flex-col`, `sm:flex-none` inside `SheetFooter`'s `flex-col`); the size/weight classes in `Drawer.tsx` follow the `Sheet`/`Dialog` base primitives.

## Findings

| Finding | Evidence | Fix | Closed |
| --- | --- | --- | --- |
| The container's permission wiring has no test: forcing the create row on for every member keeps the suite green | `CategoryCombobox.tsx:54` - mutation `canManageCategories: true` survived; C15's test calls `categoryQuickCreate` directly and `renderDrawer` always grants `manageCategories` | add a `TransactionFormDrawer.test.tsx` case rendering a plan with `manageCategories: false`, typing "Pet" and asserting no `Create expense category "Pet"` button; point C15 at it | |
| C9 is recorded as passed but was never walked | `proofs.md` row C9 `pass (Walked)`; the `**Walked:**` line in `spec.md` covers C4-C7 and C10-C12 only | leave C9 open until the user confirms the footer above the keyboard on the iPhone PWA, then record it on the `**Walked:**` line | |
| C7's walk does not record what the check names | `**Walked:**` says "the submit button was never pressed", the check says "the story's submit spy stays uncalled"; only a drag from the handle | re-walk asserting the `onSubmit` spy's call count, and drag from the form body scrolled to its top as AC 6 states | |
| The stored-name half of "ignoring surrounding spaces" is untested | `categoryQuickCreate.ts:43` - removing `.trim()` on `category.description` survived | add a stored `" Food "` to the C14 test and assert `"food"` offers no row | |
