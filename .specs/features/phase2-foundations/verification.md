# Phase 2 foundations verification

**Verdict**: FAIL
**Proofs**: `proofs.md` at 1832920a
**Verifier**: independent sub-agent (author != verifier)

## Checks

| Check | Test | Holds |
| --- | --- | --- |
| C1 | `TransactionCells.stories.tsx` `ForecastBadge` | yes - family, tone, border 0, tint differs from card; any svg counts as the clock |
| C2 | `TransactionMobileList.stories.tsx` `ForecastBadge` | yes - same assertions as C1 |
| C3 | `TransactionCells.stories.tsx` `PendingBadge` | partly - asserts `data-tone="warning"`, not the warning tint, and any svg, not the triangle |
| C4 | `TransactionMobileList.stories.tsx` `PendingBadge` | partly - as C3 |
| C5 | `TransactionCells.stories.tsx` `CategoryTag` | yes |
| C6 | grep for `variant="tag"` in production `.tsx` | yes - a computed `variant={x}` would escape it; none exists today |
| C7 | `TransactionBadges.stories.tsx` `ItemsCount` | yes - exact "1 item"/"3 items", empty group for 0 |
| C8 | `TransactionBadges.stories.tsx` `Order` | yes - exact label array |
| C9 | `TransactionCells.stories.tsx` / `TransactionMobileList.stories.tsx` `BadgeRow` | yes - left positions sorted in the named order, both halves |
| C10 | `TransactionCells.stories.tsx` `MetaBadges` | yes |
| C11 | `PlansPageView.stories.tsx` `MetaBadges` | yes |
| C12 | `EndDateField.stories.tsx` `MetaBadges` | yes |
| C13 | `PlanTrashListView.stories.tsx` `MetaBadges` | yes |
| C14 | `CategorySpendingList.stories.tsx` `MetaBadges` | yes |
| C15 | `TransactionFilterPopoverView.stories.tsx` `MetaBadges` | yes |
| C16 | `StandardMultiCombobox.stories.tsx` `MetaBadges` | yes |
| C17 | `PlanInvitationsListView.stories.tsx` `StatusBadges` | partly - tone from `data-tone`, icon presence only (clock/check/x not told apart) |
| C18 | grep over `index.css` and `badgeVariants.ts` | yes |
| C19 | node contrast script over `index.css` | yes - all 8 theme x token x surface pairs |
| C20 | grep for `ring-ring/` | yes for that pattern - but it misses `focus-visible:ring-destructive/20`, which still replaces the ring (finding 1) |
| C21 | `TransactionsPageView.stories.tsx` `FocusRing` | yes - box-shadow only, light theme only |
| C22 | `TransactionMobileList.stories.tsx` `RowFocus` | no - the `outlineColor` branch is always rgb(161, 74, 7) |
| C23 | `CategoryTreeRow.stories.tsx` / `CategorySpendingList.stories.tsx` `RowFocus` | no - same `outlineColor` branch as C22 |
| C24 | node string check over `index.css` | yes |
| C25 | `TransactionsPageView.stories.tsx` `TouchTargets` | yes for buttons, search and the Badge filter chips; the `Toggle` chip that Coverage maps here is not on this page |
| C26 | `CategoryLimitFields.stories.tsx` `TouchTargets` | yes |
| C27 | `TransactionFilterPopoverView.stories.tsx` `TouchTargets` | yes - reads heights without `waitFor`, unlike its siblings |
| C28 | `StandardCombobox.stories.tsx` `TouchTarget` | yes |
| C29 | `TransactionsPageView.stories.tsx` `DesktopSizes` | yes - default 36, sm 28, icon 32 x 32 at 1280 |
| C30 | `OverviewPageView` / `TransactionsPageView` / `CategoriesPageView` / `PlansPageView` stories `PageTitle` | yes at the 1200 px runner width; "every width" rests on the walk |
| C31 | `MainLayoutView.stories.tsx` `ContentWidth` | yes |
| C32 | `CategoriesPageView.stories.tsx` / `PlansPageView.stories.tsx` `HeaderActions` | yes |
| C33 | `MainLayout.test.tsx` `opens the new transaction form from the Categories page` | yes |
| C34 | `SignUpDefaultsIT#namesFirstPlanFromDeviceLanguage` | yes - 5 rows, through the API |
| C35 | `SignUpDefaultsIT#storesDeviceTimeZone` | yes - 201, response and DB |
| C36 | `SignUpDefaultsIT#namesRecoveredPlanFromSavedLanguage` | yes |
| C37 | `percent.test.ts` three cases | yes |
| C38 | `CategoryLimitFields.stories.tsx` `SharePercent` | yes - en and pt-BR through `i18n.changeLanguage` |
| C39 | walk (proofs.md: pass, Walked) | yes - recorded as walked; light theme only per its claim |
| C40 | `NavbarView.stories.tsx` `AvatarFocusAndSize` | yes - box-shadow, 44 x 44 |
| C41 | `TransactionsPageView.stories.tsx` `IconButtonTargets` | yes |
| C42 | `TransactionFilterPopoverView.stories.tsx` `CheckboxTarget` | yes |
| C43 | `TransactionMobileList.stories.tsx` `TitleNotSqueezed` | yes |
| C44 | `PlansPageView.stories.tsx` `MembersHeaderPhone` | yes |
| C45 | `DeletePlanPermanentlyDialogView.stories.tsx` `FocusRing`; `CurrencyInput.stories.tsx` `InvalidFocusRing` | appended for finding 1 - fails before `453fee13` (author-checked, not re-judged) |
| C46 | lone grep for `ring-(ring\|destructive)/` | appended for finding 1 - mechanical (author-checked, not re-judged) |
| C47 | `CurrencyInput.stories.tsx` `DarkFieldContrast` | appended for finding 3 - computes 4.5:1 on the computed fill; fails before `453fee13` (author-checked, not re-judged) |
| C48 | `MemberFilterChips.stories.tsx` `TouchTarget` | appended for finding 4 - the Verifier measured 44 px; the test now holds it (author-checked, not re-judged) |
| C49 | `TransactionCells.stories.tsx` and `PlanInvitationsListView.stories.tsx` `StatusColoursAndIcons` | appended for finding 5 - fails when tone classes are swapped (author-checked, not re-judged) |

## Findings

| Finding | Evidence | Fix | Closed |
| --- | --- | --- | --- |
| A destructive button and any `aria-invalid` field draw a 20% red focus ring, not the solid `--ring` (AC 9) | throwaway story at HEAD: focused `<Button variant="destructive">` and focused `<Input aria-invalid>` both give box-shadow `oklab(0.505 0.169 0.088 / 0.2) 0 0 0 3px`, about 1.4:1 on card; `buttonVariants.ts` destructive has `focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40`, and `aria-invalid:ring-destructive/20` sits on Button, Input, Select, Checkbox, RadioGroup, Toggle, Textarea, InputGroup, NumberField; used by `DeleteCategoryDialog` and `DeletePlanPermanentlyDialogView` | drop the destructive focus override (or make it solid at 3:1), decide what a focused invalid field draws, and add a story that focuses a destructive button and an invalid input and asserts rgb(161, 74, 7) | `453fee13` - C45 C46 |
| C22 and C23 pass without any focus ring | `index.css` base layer `* { @apply outline-ring }` sets `outline-color` to the ring on every element; a throwaway `<button class="outline-none">` reads `outlineColor` rgb(161, 74, 7) before focus. Each `RowFocus` story accepts `${boxShadow} ${outlineColor}` containing it | assert on `boxShadow` alone (as C21 and C40 do), or on outline colour only when `outline-style` is not `none` | `1b7eaf33` - C22 C23 (box-shadow before and after focus) |
| In the dark theme, lightening `--input` also lightens every field's fill, and placeholder text fell below 4.5:1 | `--input` is a fill as well as a border: `dark:bg-input/30` on Input, InputGroup, NumberField, Select, Combobox chips, Checkbox; `dark:has-disabled:bg-input/80`. Field fill over card moved from about #383834 to #484743; `--muted-foreground` placeholder on it is 3.76:1 (was 4.81:1). No check covers the dark field surface | keep the fill on its own token (or a lower alpha) so only the border reaches 3:1, and check placeholder contrast in both themes | `453fee13` - C47 |
| Coverage maps the `Toggle` chip to C25, but C25's chips are `Badge` filter chips; the `Toggle` chip (`MemberFilterChips` on Overview) has no 44 px test | `TransactionsPageView.stories.tsx` `TouchTargets` selects `[data-variant=meta]` with a button inside; `variant="chip"` appears only in `MemberFilterChips.tsx`. A throwaway story measured the chips 44 px at 414, so the code holds and only the proof is missing | add a 414 px height assertion to a `MemberFilterChips` story and fix the Coverage row | `66955d9f` - C48 |
| C3, C4 and C17 prove the tone attribute, not the tint or the icon the criteria name | `data-tone` comes from the prop; the warning/success/destructive classes live in `statusToneVariants.ts`, and swapping them passes every check. `querySelector("svg")` accepts any icon | compare the computed background or text colour to the tone's token, and identify the icon (for example by its lucide class) | `4aff1143` - C49 |

## Notes (not findings)

- Own examples, all at HEAD, all as the plan says: `Accept-Language` "PT", "PT-br" and " pt-BR" give Meu plano; "*", "", "pt_BR" and "es, pt" give My plan; "pt;q=0.1, en" gives Meu plano and "en;q=0.1, pt" gives My plan (the plan says *first* language, which ignores q-values). `Time-Zone` "UTC", "America/Sao_Paulo" and "Etc/GMT+3" are stored; "", " Europe/Lisbon", "europe/lisbon", "GMT+3", "+03:00", "Z" and "EST" fall back. `formatPercent`: 0.04 gives "0%", 99.95 gives "100%", 1234.5 gives "1.234,5%" in pt-BR, -5 gives "-5%". Two items read "2 items" / "2 itens", one item in pt-BR "1 item". A `tone` on `meta`/`tag` sets no `data-tone` and no tint; `status` without a tone is neutral.
- Plan-level, AC 1 is met as written: `status` neutral (`--secondary`) and `meta` (`--muted`) backgrounds are 1.04:1 (light) and 1.08:1 (dark) apart, so "Forecast" and a "Series" meta badge differ only by text colour and icon. The owner may want to look at this against the goal "every marker says what kind of thing it is".
- Sign-up names the first plan from `Accept-Language` but does not save that language, so a Portuguese user who never picks one gets "My plan" back from `ensurePersonalPlan` (AC 22 says exactly this).
