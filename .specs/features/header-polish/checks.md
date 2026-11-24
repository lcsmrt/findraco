# Header polish checks

Build: cd frontend && pnpm lint; cd frontend && pnpm build; cd frontend && node scripts/check-siblings.ts
Run unit: cd frontend && pnpm exec vitest run --project=unit --reporter=verbose src/features/transactions/TransactionsPage.test.tsx
Run stories: cd frontend && pnpm exec vitest run --project=storybook --reporter=verbose src/components/periodNavigator/PeriodNavigator.stories.tsx src/features/transactions/TransactionsPageView.stories.tsx src/features/plans/PlansPageView.stories.tsx src/features/categories/CategoriesPageView.stories.tsx src/features/overview/components/MemberFilterChips.stories.tsx
Run walkfix: cd frontend && pnpm exec vitest run --project=storybook --reporter=verbose src/components/table/TablePagination.stories.tsx src/features/transactions/TransactionsPageView.stories.tsx
Run verifyfix: cd frontend && pnpm exec vitest run --project=storybook --reporter=verbose src/features/overview/components/MemberFilterChips.stories.tsx src/components/periodNavigator/PeriodNavigator.stories.tsx src/features/transactions/TransactionsPageView.stories.tsx
Plan: `.specs/features/header-polish/plan.md`

22 checks in 4 slices · 0 one-way doors · 0 open, of which 0 block

Story rules:
- The storybook project runs at a 1200 × 900 viewport. Each width check sets its own viewport in `play` with `page.viewport` from `vitest/browser`.
- Sizes and edges are read with `getBoundingClientRect` inside `waitFor`, because heights transition.
- Stories render in English: "This month", "Last 3 months", "Last 6 months", "This year", "More actions", "Import CSV", "Review movements", "1 movement to review", "Review". The pt-BR copy is the plan's.

## Checks

### S1 - One period control

**C1** - The period control renders exactly three buttons: previous, the label, next. No "Range" button exists (AC 1)
Proof: run stories | ✓ src/components/periodNavigator/PeriodNavigator.stories.tsx > Arrows And Label Only

**C2** - At 1280 px, tapping the label opens a popover with the four presets "This month", "Last 3 months", "Last 6 months" and "This year" above a range calendar, and the current preset is marked with `aria-checked="true"` or `aria-pressed="true"` (AC 2)
Proof: run stories | ✓ src/components/periodNavigator/PeriodNavigator.stories.tsx > Panel Popover

**C3** - At 414 px, tapping the label opens the same presets and calendar in a bottom sheet: a dialog whose bottom edge is at the viewport bottom (AC 2)
Proof: run stories | ✓ src/components/periodNavigator/PeriodNavigator.stories.tsx > Panel Sheet Phone

**C4** - Picking "Last 3 months" calls `onPresetChange("last-3m")` and closes the panel. Picking two different days calls `onRangeChange` with those ISO dates and closes it (AC 3)
Proof: run stories | ✓ src/components/periodNavigator/PeriodNavigator.stories.tsx > Preset Applies
Proof: run stories | ✓ src/components/periodNavigator/PeriodNavigator.stories.tsx > Range Applies

**C5** - From November 2026, the next arrow calls `onStep` with 2026-12-01 to 2026-12-31 and the previous arrow with 2026-10-01 to 2026-10-31 (AC 4)
Proof: run stories | ✓ src/components/periodNavigator/PeriodNavigator.stories.tsx > Arrows Step

**C6** - At 414 px, the previous arrow's left edge matches the control's container left edge and the next arrow's right edge matches its right edge, within 1 px. The label's centre is within 2 px of the container's centre (AC 5)
Proof: run stories | ✓ src/components/periodNavigator/PeriodNavigator.stories.tsx > Spans Width Phone

### S2 - Transactions header

**C7** - The header has one "More actions" button and no other button. Opening it shows "Import CSV" and "Review movements". Choosing "Review movements" calls `onReview` (AC 6)
Proof: run stories | ✓ src/features/transactions/TransactionsPageView.stories.tsx > More Actions Menu

**C8** - While importing, the menu item reads "Importing…" and is disabled. Without `onReview` (a viewer), the menu has no "Review movements" (AC 6)
Proof: run stories | ✓ src/features/transactions/TransactionsPageView.stories.tsx > Importing Disabled
Proof: run stories | ✓ src/features/transactions/TransactionsPageView.stories.tsx > Viewer Has No Review

**C9** - With a review total of 1, the view shows "1 movement to review" and a "Review" button that calls `onReview`, plus a dot on "More actions". With 4 it shows "4 movements to review". With 0 there is no notice and no dot (AC 7)
Proof: run stories | ✓ src/features/transactions/TransactionsPageView.stories.tsx > Review Notice

**C10** - The page reads the candidates total and passes it on for an editor. With the candidates endpoint answering a total of 4, an editor sees "4 movements to review". A viewer sees no notice and the endpoint is not called (AC 7)
Proof: run unit | ✓ src/features/transactions/TransactionsPage.test.tsx > shows the review notice with the candidates total for an editor
Proof: run unit | ✓ src/features/transactions/TransactionsPage.test.tsx > shows no review notice to a viewer

**C11** - At 414 px and at 1280 px, the period control's box, the search-and-filters row and the list share left and right edges, within 1 px (AC 8)
Proof: run stories | ✓ src/features/transactions/TransactionsPageView.stories.tsx > Edges Aligned

### S3 - Page headers

**C12** - The Plans page view renders no paragraph or text under the `h1` inside its header (AC 9)
Proof: run stories | ✓ src/features/plans/PlansPageView.stories.tsx > No Description

**C13** - At 414 px, the header action's top lies between the `h1`'s top and bottom: "New category" on Categories, "New plan" on Plans and "More actions" on Transactions (AC 10)
Proof: run stories | ✓ src/features/categories/CategoriesPageView.stories.tsx > Action On Title Row
Proof: run stories | ✓ src/features/plans/PlansPageView.stories.tsx > Action On Title Row
Proof: run stories | ✓ src/features/transactions/TransactionsPageView.stories.tsx > Action On Title Row

### S4 - Chips

**C14** - At 414 px, each member chip's visible box measures 32 px tall. `document.elementFromPoint` at the chip's horizontal centre, 6 px above its top and 6 px below its bottom, returns the chip or an element inside it (AC 11)
Proof: run stories | ✓ src/features/overview/components/MemberFilterChips.stories.tsx > Chip Size Phone

**C15** - At 414 px, the same holds for a removable filter chip on Transactions: 32 px visible, and hit 6 px above and below (AC 11)
Proof: run stories | ✓ src/features/transactions/TransactionsPageView.stories.tsx > Filter Chip Size Phone

**C16** - At 1280 px, each member chip measures 28 px tall (AC 12)
Proof: run stories | ✓ src/features/overview/components/MemberFilterChips.stories.tsx > Chip Size Desktop

**C17** - On the local stack at 390 × 844 and 1280 × 800, Overview, Transactions, Categories and Plans show the single period control and its panel (sheet on phone), the "⋯" menu and the review notice, header actions on the title row, and 32 px chips, with nothing clipped or overflowing (AC 1-12)
Proof: walk - each page at both widths

### Appended after the walk

**C18** - At 414 px, the "More actions" menu items "Import CSV" and "Review movements" each measure 44 px tall or more: menu items join the phone touch tier (AC 6; the walk found 28 px)
Proof: run walkfix | ✓ src/features/transactions/TransactionsPageView.stories.tsx > Menu Items Phone

**C19** - At 360 px, the pagination footer does not overflow its box. Previous and next sit inside it, and first and last are not rendered as buttons (AC 8; the walk found the last-page button clipped at 320 and 360)
Proof: run walkfix | ✓ src/components/table/TablePagination.stories.tsx > Fits Phone

### Appended after the Verifier

**C20** - At 414 px with chips that wrap onto two rows (members "Lucas", "Livia", "Anastácia" and "Bartholomeu" on the Overview, and the four presets in the period sheet at 320 px), a tap 6 px below each first-row chip lands on that chip, never on the row below. Wrapped chip rows are at least 14 px apart (AC 11; finding 1)
Proof: run verifyfix | ✓ src/features/overview/components/MemberFilterChips.stories.tsx > Wrapped Rows Phone
Proof: run verifyfix | ✓ src/components/periodNavigator/PeriodNavigator.stories.tsx > Wrapped Presets Phone

**C21** - At 414 px with removable filter chips on two rows, a tap 6 px above and 6 px below a first-row chip's remove button lands on that remove button (AC 11; finding 2)
Proof: run verifyfix | ✓ src/features/transactions/TransactionsPageView.stories.tsx > Filter Chip Remove Target

**C22** - Closing the period panel returns keyboard focus to the period label, whether by picking a preset with the keyboard or by pressing Escape. This holds at 1280 px (popover) and at 414 px (sheet) (AC 2; finding 3)
Proof: run verifyfix | ✓ src/components/periodNavigator/PeriodNavigator.stories.tsx > Focus Returns To Label

## Coverage

| Set (size) | Member -> proof | Unproven |
| --- | --- | --- |
| presets, AC 2 (4) | "This month" C2 · "Last 3 months" C2 C4 · "Last 6 months" C2 · "This year" C2 | - |
| panel forms, AC 2 (2) | popover C2 · sheet C3 | - |
| menu items, AC 6 (2) | "Import CSV" C7 C8 · "Review movements" C7 C8 | - |
| review examples, AC 7 (4) | 1 C9 · 4 C9 C10 · 0 C9 · viewer C10 | - |
| headers, AC 10 (3) | Categories C13 · Plans C13 · Transactions C13 | - |
| chips, AC 11 (2) | member chips C14 · filter chips C15 | - |
| widths, AC 8 (2) | 414 C11 · 1280 C11 | - |

## Swept

- validation: n/a - no input added; the calendar keeps its range rule (two different days)
- failure modes: existing - a failed candidates query shows no notice (the query's error state); the review sheet keeps its own error state
- idempotency: n/a - nothing is written
- authorization: C8 C10 - review only for those who may create transactions; the endpoint is not called for a viewer
- concurrency: n/a - nothing is written
- data lifecycle: existing - the candidates query is invalidated after an edit or import (`useTransactionService`), so the notice follows
- dependency failure: n/a - no external call; the candidates query is the app's own API (failure mode above)
- state transitions: n/a - no entity changes state
- observability: n/a - no logging requirement

## Handoff

- **Settled mid-build:** none
- **Dispatched:** build worker (Sonnet), all slices, at `19eca0b4`, returned (C1-C16 at `f394140f`); walk worker (Sonnet) at `d03ad4db`, returned; Verifier (Opus) at `dc64b96f`, returned (FAIL, 5 findings); verify-fix worker (Sonnet) at the findings commit
- **Boundary:** C1-C16 closed at `f394140f`; C18-C19 at `9396519e`; C20-C22 closed at `ee825b0e`
- **Abandoned:** none
- **Walked:** C17 on the local stack at `d03ad4db` (walk Postgres 5434, backend local profile on 3000, `pnpm dev` 5173), Playwright pt-BR, dark, 390x844 and 1280x800. Visão geral: "‹ novembro 2026 ›" only, no "Intervalo"; at 390 the control spans 16-374 with 44 px arrows at the edges; member chips 32 px visible with a 45 px tap area (taps 6 px above and below toggle them), 28 px at 1280. The label opens a bottom sheet "Escolha um período" at 390 and a popover at 1280, with "Este mês" (marked), "Últimos 3 meses", "Últimos 6 meses" and "Este ano" above the calendar; "Últimos 3 meses" gives "set – nov 2026" and closes; days 10 then 11 give "10 – 11 nov 2026" and close. Transações: title and one "⋯" "Mais ações"; with 2 candidates a dot and "2 movimentos para revisar" with "Revisar" (opens the review sheet); the menu has "Importar CSV" and "Revisar movimentos", whose items were 28 px at 390 (C18); period row, search and filters row and list share 16-374 at 390 and 16-398 at 414; at 1280 left edges 16, the period control inline (plan assumption); a filter chip 32 px at 390. At 320 and 360 the pagination footer overflowed and clipped "last page" (C19). Categorias and Planos: title and action on one row; no subtitle on Planos. New transaction form and bottom bar unchanged. Users reach these from the Visão geral and Transações period label, the Transações "⋯", and the four tabs.
