# Header polish verification

**Verdict**: FAIL
**Proofs**: `proofs.md` at dc64b96f
**Verifier**: independent sub-agent (author != verifier)

## Checks

| Check | Test | Holds |
| --- | --- | --- |
| C1 | `PeriodNavigator.stories.tsx` `Arrows And Label Only` | yes - exact list of the three button names, and no "Range" |
| C2 | `PeriodNavigator.stories.tsx` `Panel Popover` | yes - four presets, `aria-pressed` per preset, presets above the grid, panel not at the window bottom |
| C3 | `PeriodNavigator.stories.tsx` `Panel Sheet Phone` | yes, loosely - bottom edge at the viewport bottom holds the sheet; only "Last 6 months" of the four presets is asserted |
| C4 | `PeriodNavigator.stories.tsx` `Preset Applies`, `Range Applies` | yes - exact `last-3m`, exact ISO pair, one click does not apply, the panel closes |
| C5 | `PeriodNavigator.stories.tsx` `Arrows Step` | yes - exact ranges both ways |
| C6 | `PeriodNavigator.stories.tsx` `Spans Width Phone` | yes - both edges within 1 px and the label centre within 2 px |
| C7 | `TransactionsPageView.stories.tsx` `More Actions Menu` | yes - the title row holds exactly one button; both items; `onReview` called once |
| C8 | `TransactionsPageView.stories.tsx` `Importing Disabled`, `Viewer Has No Review` | yes |
| C9 | `TransactionsPageView.stories.tsx` `Review Notice` | yes - exact copy, dot and button; the 4 and 0 cases sit in `Review Notice Many` and `Nothing To Review`, which ran green in the same group but no proof line names them |
| C10 | `TransactionsPage.test.tsx` `shows the review notice with the candidates total for an editor`, `shows no review notice to a viewer` | yes - total 4 from MSW, `size=1` asserted, no candidates request for a viewer |
| C11 | `TransactionsPageView.stories.tsx` `Edges Aligned` | yes - at 1280 it measures the context row's right edge, not the control's, which follows the approved desktop assumption; AC 8 and C11 still say the control |
| C12 | `PlansPageView.stories.tsx` `No Description` | yes - no `p`, and the header text is exactly "PlansNew plan" |
| C13 | `CategoriesPageView.stories.tsx`, `PlansPageView.stories.tsx`, `TransactionsPageView.stories.tsx` `Action On Title Row` | yes |
| C14 | `MemberFilterChips.stories.tsx` `Chip Size Phone` | no - three members fit on one row; a wrapped row (four members at 414, or at 320) loses the tap below the first row, and no case covers it |
| C15 | `TransactionsPageView.stories.tsx` `Filter Chip Size Phone` | no - probes the badge's centre, where the hit lands on the badge itself, which does nothing on tap; it passes with the remove button's own tap area gone |
| C16 | `MemberFilterChips.stories.tsx` `Chip Size Desktop` | yes |
| C17 | walk - each page at both widths | no - `pass (Walked)` comes from the presence of a `**Walked:**` line, and proofs.md has no walk record |
| C18 | `TransactionsPageView.stories.tsx` `Menu Items Phone` | yes |
| C19 | `TablePagination.stories.tsx` `Fits Phone` | yes - no overflow, previous and next inside, first and last not exposed |
| C20 | `MemberFilterChips.stories.tsx` `Wrapped Rows Phone`; `PeriodNavigator.stories.tsx` `Wrapped Presets Phone` | appended for finding 1 - asserts two rows, then the 6 px probe; fails before `72cfee47` (author-checked, not re-judged) |
| C21 | `TransactionsPageView.stories.tsx` `Filter Chip Remove Target` | appended for finding 2 - probes the remove button itself; fails before `72cfee47` (author-checked, not re-judged) |
| C22 | `PeriodNavigator.stories.tsx` `Focus Returns To Label` | appended for finding 3 - fails before `ee825b0e` (author-checked, not re-judged) |

## Findings

| Finding | Evidence | Fix | Closed |
| --- | --- | --- | --- |
| Wrapped chip rows overlap their tap areas: a tap 5-6 px below a first-row chip selects the chip on the row below (AC 11), against the rule this diff wrote into `component-creation` (`max-sm:gap-y-3` for wrapped rows) | Throwaway story at HEAD: `MemberFilterChips` with Lucas, Livia, Anastácia, Bartholomeu at 414 wraps (rows at y 40 and 78, 6 px gap); `elementFromPoint` 5 and 6 px below "All" returns "Bartholomeu". At 320, "All"/"Lucas" below returns "Anastácia". The period panel's sheet at 320 wraps its presets 6 px apart: 6 px below "This month" returns "Last 6 months" | give the `ToggleGroup` chip row and the `PeriodPanel` preset row the wrapped-row gap (`max-sm:gap-y-3` or more); add a wrapped case (four members at 414) to C14 that probes 6 px below a first-row chip | `72cfee47` - C20 |
| The filter chip's remove button loses its tap 6 px below when another chip row follows; C15 cannot see it because it probes the badge, which is not interactive | Throwaway story at HEAD, five filter chips at 414 and 320: at the remove button's x, 5 and 6 px above returns the button, but 6 px below "Debit" returns the next row's badge `SPAN` (the 12 px row gap is smaller than the two 6.5 px pseudo-elements). At the chip's centre the hit is the badge `SPAN` itself, so C15's `chip.contains(hit)` holds with no target behind it | probe at the remove button's centre and assert the button is hit, above and below, with a following row; widen the row gap past 13 px or shorten the pseudo so two rows never meet | `72cfee47` - C21 |
| Keyboard focus drops to `<body>` when the period panel closes, after picking a preset or pressing Escape; before this diff the presets lived in a menu that returned focus to its trigger. No check names it | Throwaway story at HEAD, 1280: focus the label, Enter (focus lands on the selected day), Shift+Tab to "Last 6 months", Enter: `onPresetChange("last-6m")`, then `document.activeElement` is `BODY`; reopen and Escape: `BODY`. The `Popover` and `Drawer` in `PeriodNavigator.tsx` are opened by state with no trigger, so nothing receives focus back | make the label the panel's trigger (`PopoverTrigger`/`DrawerTrigger` `render`) or pass `finalFocus` to the label; add a story asserting focus returns to the label after a preset and after Escape | `ee825b0e` - C22 |
| C17 is green without a walk record: `check_proofs.py` writes `pass (Walked)` whenever any `**Walked:**` line exists (lines 64, 212-213), and the line at HEAD reads "none - C17 needs the local stack (backend and database), which the build worker did not start" (seen while locating that line; the rest of the Handoff was not used). C18 and C19 cite walk findings, so a walk seems to have run, but nothing records which pages and widths it covered | `proofs.md` C17 row; `checks.md` `**Walked:**` line | record the walk (the four pages at 390 and 1280, what each showed) on the `**Walked:**` line, or run it | `e81bb4db` - the `**Walked:**` line now records C17's walk at `d03ad4db` |
| Phase 2 claims this plan superseded still state the old rule: phase-2 C25 (every filter chip 44 px on Transactions) and C48 (member chips 44 px, proof `Member Filter Chips > Touch Target`, a story this diff deleted) | `.specs/features/phase2-foundations/checks.md` lines 100 and 186; `git diff 19eca0b4..dc64b96f -- MemberFilterChips.stories.tsx` removes `TouchTarget` | mark phase-2 C25 (chip part) and C48 superseded by header-polish C14-C16 | `e81bb4db` - phase-2 C25 and C48 marked superseded by C14 and C15 |

Own examples that held: a custom range already selected marks no preset (all four `aria-pressed="false"`); the period control at 320 with "Nov 2025 – Feb 2026" fits 288 px with no overflow; the "⋯" menu works by keyboard (Enter opens on "Import CSV", ArrowDown reaches "Review movements", Escape returns focus to the trigger, End+Enter calls `onReview`), and the "Review" button shows the ring token; the notice reads "2/21 movements to review" and "2/21 movimentos para revisar". One aside, not this feature: pt-BR counts that are multiples of 1,000,000 fall back to English (CLDR `many`, and no `_many` key exists anywhere in the repo).
