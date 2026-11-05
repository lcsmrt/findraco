# mobile-form-sheet proofs

**HEAD**: f5f603b
**Tree**: clean
**Shell**: /bin/sh
**Result**: 25 pass, 0 fail

| Check | Proof | Result |
| --- | --- | --- |
| C1 | `run unit / ✓ opens as a bottom sheet on a narrow screen` | pass |
| C2 | `run unit / ✓ opens on the right on a wide screen` | pass |
| C3 | `run unit / ✓ reports 639px as narrow and 640px as wide` | pass |
| C4 | `walk - FormSheet stories Short and Long at 390×844: Short ends below its content, Long's top edge sits at 42.2` | pass (Walked) |
| C5 | `walk - FormSheet story Long at 390×844, form scrolled to its end: title and footer at the same screen position` | pass (Walked) |
| C6 | `walk - FormSheet story Short at 390×844: a handle bar centred at the sheet's top edge` | pass (Walked) |
| C7 | `walk - FormSheet story Short at 390×844: a pointer drag down from the handle closes the sheet; the story's sub` | pass (Walked) |
| C8 | `run unit / ✓ closes without saving on Escape or a backdrop tap` | pass |
| C9 | `walk - not reachable in headless Chromium; confirmed by the user on the iPhone PWA at UAT` | pass (Walked) |
| C10 | `walk - FormSheet story Short at 390×844: Cancel and Submit side by side, equal width, Submit right` | pass (Walked) |
| C11 | `walk - FormSheet story WithMobileActions at 390×844: Delete and Duplicate on the first row, Cancel and Submit ` | pass (Walked) |
| C12 | `walk - FormSheet story Short at 390×844: a single footer row` | pass (Walked) |
| C13 | `run unit / ✓ labels the create row with the transaction type, next to partial matches` | pass |
| C14 | `run unit / ✓ offers no create row when a category of that type has the same name` | pass |
| C15 | `run unit / ✓ hides the create row without the manage-categories permission` | pass |
| C16 | `run unit / ✓ offers no create row for a blank search or one over 255 characters` | pass |
| C17 | `run unit / ✓ creates the typed category with the transaction type and nothing else` | pass |
| C18 | `run unit / ✓ selects the created category, keeps the other values and opens no other sheet` | pass |
| C19 | `run unit / ✓ shows the created toast` | pass |
| C20 | `run unit / ✓ disables the create row while the request is pending` | pass |
| C21 | `run unit / ✓ shows the problem copy and keeps the search when creation fails` | pass |
| C22 | `run unit / ✓ clears a quick-created category when the type changes` | pass |
| Build | `cd frontend && pnpm lint` | pass |
| Build | `cd frontend && pnpm build` | pass |
| Build | `cd frontend && node scripts/check-siblings.ts` | pass |

## Output

`Run unit` - exit 0

```
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer category quick-create > shows the problem copy and keeps the search when creation fails 180ms
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer category quick-create > clears a quick-created category when the type changes 251ms
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer series edit (STD-07 AC 2) > offers no save while the series definition is loading 49ms
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer series edit (STD-07 AC 2) > edits This one of the series from the occurrence 133ms
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer series edit (STD-07 AC 2) > edits This and following of the series from the occurrence 137ms
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer series edit (STD-07 AC 2) > edits All of the series from the occurrence 140ms
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer series edit (STD-07 AC 2) > edits the whole series without asking when the number of installments changed 93ms
 ✓ |unit| src/features/transactions/components/TransactionFormDrawer.test.tsx > TransactionFormDrawer series edit (STD-07 AC 2) > sends nothing and stays open when the scope is cancelled 132ms

 Test Files  3 passed (3)
      Tests  30 passed (30)
   Start at  23:52:15
   Duration  6.05s (transform 322ms, setup 171ms, collect 2.08s, tests 3.50s, environment 1.10s, prepare 120ms)

No story files found for the specified pattern: src/**/*.mdx
```
