# Internationalisation (M5-10) verification

**Verdict**: FAIL
**Proofs**: `proofs.md` at ac05729 (reviewed at c592b63; only spec docs changed since)
**Verifier**: independent sub-agent (author != verifier)

## Checks

| Check | Test | Holds |
| --- | --- | --- |
| C1 | walk - Storybook 390×844, `locale` pt-BR (`walk-i18n/` captures) | partly - the screens read clean, but a walk cannot see toasts, aria-labels or a fallback text that shows only with no active plan; four English texts remain (findings 2-4) |
| C2 | `pnpm exec vitest run --project=unit --project=storybook` | yes - the suite asserts English copy throughout |
| C3 | `dates.test.ts` `names months and weekdays in Portuguese` | partly - asserts `formatPattern` only; no test shows the period navigator, the date picker or the charts receiving the locale (walk shows them) |
| C4 | `TransactionFormDrawer.test.tsx` `shows user data as typed in Portuguese` | yes - description and category name shown as typed in pt-BR |
| C5 | `i18n.test.ts` `uses the singular for one and the plural otherwise in both languages` | yes - 1 and 3 in both languages; mutating the count call to `_other` fails it |
| C6 | `eslint.config.test.ts` `reports literal interface texts in components` | no - JSX passed through any other attribute (`render={<span>Select plan</span>}`, `icon=`) is not reported, and a live leak sits behind it |
| C7 | `translationParity.test.ts` `fails when the two languages differ` | yes - keys both ways, variables, plural forms and a missing `_other`; removing the variable or the `_other` check fails it |
| C8 | `translationParity.test.ts` `the committed language files are in parity` | yes |
| C9 | `TransactionFormDrawer.test.tsx` `keeps typed values when the language changes` | yes - typed value, error and button re-read after the switch |
| C10 | `resolveDeviceLanguage.test.ts` `picks pt-BR for a Portuguese device language and en otherwise` | yes - first-only and `/^pt/` mutations both fail it |
| C11 | `LanguageDialog.test.tsx` `offers English and Português (Brasil)` | partly - renders the dialog, not the profile menu entry (the navbar capture shows the entry) |
| C12 | `syncDocumentLanguage.test.ts` `sets the document lang to the language in use` | yes - dropping the listener fails it |
| C13 | `LanguageDialog.test.tsx` `switches the texts at once and saves the language` | yes - asserts the Portuguese text, path and body; removing the save fails it |
| C14 | `AuthProvider.test.tsx` `applies the saved language at sign-in` | yes - removing the apply fails it |
| C15 | `AuthProvider.test.tsx` `uses the device language when signed out` | yes - removing the reset in `endSession` fails it |
| C16 | `LanguageDialog.test.tsx` `keeps the picked language when saving fails` | yes - switching only on success fails it |
| C17 | `i18n.test.ts` `starts the tests in English` | partly - unit setup only; Storybook's `initialGlobals.locale: "en"` is held by C2's story run, not by this test |
| C18 | `dates.test.ts` `writes 04/11/2026 in Portuguese` | yes |
| C19 | `dates.test.ts` `writes 04/11/2026 in English on a Brazilian device` | yes for BR - but the region rule is wrong for other English regions (finding 1) |
| C20 | `dates.test.ts` `writes 11/04/2026 in English on a US device` | yes |
| C21 | `UserLanguageIT#storesTheLanguageAndReturnsIt` | yes - null before, stored column and `/user/me` after |
| C22 | `UserLanguageIT#rejectsAnUnknownLanguage` | yes - `fr` and missing both 422 `validation-failed`, stored value unchanged |
| C23 | grep for date-fns `format` imports outside `utils/dates.ts` | yes - the other `toLocale*` calls are the calendar's own dropdown and a `data-day` attribute |
| C24 | `PasswordResetLanguageIT#usesTheSavedLanguage` | yes - saved pt-BR over request en; swapping the precedence fails it |
| C25 | `PasswordResetLanguageIT#usesTheRequestLanguageWhenNoneIsSaved` | yes |
| C26 | `PasswordResetLanguageIT#fallsBackToEnglish` | yes for none and `fr` - a tag over 10 characters answers 422 and sends nothing (finding 8) |
| C27 | `money.test.ts` `formats money the same in both languages` | yes |
| C28 | `dates.test.ts` `reads CSV dates as dd/mm/yyyy in both languages` | no - the CSV is parsed by the backend (`NubankAccountStatementParser`, fixed `dd/MM/uuuu`); the test calls date-fns `parse` with an explicit pattern, which is library behaviour, and survives a mutation that makes `parseDate` ignore its pattern |

## Findings

| Finding | Evidence | Fix | Closed |
| --- | --- | --- | --- |
| 1. `en` on any English-speaking device outside the US writes US dates (en-GB, en-AU, en-IE, en-CA, en-NZ: `11/04/2026`), against I18N-03 AC 1 | `frontend/src/utils/dates.ts:28` - `new Intl.Locale("und-GB").maximize()` is `en-Latn-GB`, and ICU resolves that to plain `en` (`resolvedOptions().locale === "en"`); BR works only because `pt` alone defaults to the Brazilian layout. Own example at HEAD: device `en-GB` → `11/04/2026`, placeholder `mm/dd/yyyy` | build the locale without the script: `` new Intl.Locale(`${maximized.language}-${region}`) `` (en-GB, pt-BR, en-US); add `en-GB` → `04/11/2026` to `dates.test.ts` | |
| 2. The lint skips JSX passed through attributes other than the four, and one English text already ships through that hole | `eslint-plugin-i18next` `jsx-only` ignores the subtree of non-included attributes: `<T render={<button>Open menu</button>} />`, `aria-label` inside `render=`, `icon={<span>Close</span>}` all pass; `frontend/src/features/plans/components/PlanSwitcherView.tsx:39` `{activePlanName ?? "Select plan"}` inside `render=` passes `pnpm lint` (the same text outside `render` is reported). I18N-01 AC 6 says a literal in JSX fails | key "Select plan"; make the rule see JSX text in any attribute (an `eslint.config.test.ts` case with `render={<span>Text</span>}` must report), e.g. a local rule on `JSXText`/string children regardless of parent attribute | |
| 3. Toasts fired from code stay English in pt-BR (I18N-01 AC 1 "toasts") | `frontend/src/features/plans/components/InvitePlanDialog.tsx:43` `toast.success("Link copied to clipboard.")`; `frontend/src/app/providers/useUpdateToast.ts:19,22` `"New version available"`, action `"Update"` (the PWA update notice). Neither file is seen by the lint (a call argument, a `.ts` module) | move the three texts to keys with pt-BR values; guard `toast(...)` arguments, e.g. the plugin's `callees`/`mode: "all"` on `toast` calls or a scan test | |
| 4. Screen-reader labels from libraries stay English in pt-BR | `frontend/src/components/calendar/base/Calendar.tsx` receives the date-fns `ptBR`, which has no `labels`, so DayPicker's "Go to the Next Month" / "Go to the Previous Month" / month and year dropdown labels stay English (`react-day-picker/locale` `ptBR` carries them); `frontend/src/app/layout/ToasterView.tsx:25` `closeButton` keeps sonner's "Close toast" (`closeButtonAriaLabel` unset) | pass `react-day-picker/locale`'s `ptBR`/`enUS` from `dateFnsLocale`; set `closeButtonAriaLabel` to a key | |
| 5. C28 proves nothing about the CSV import | the CSV is read only by `backend/.../transaction/importer/NubankAccountStatementParser.java:38` (`dd/MM/uuuu`, no language input); `frontend/src/utils/dates.test.ts:83` tests date-fns `parse` with a pattern it passes itself; mutant `parseDate` ignoring `pattern` survived (10/10 pass) | point C28 at a backend unit test that parses the ambiguous `04/11/2026` as 2026-11-04 (existing `StatementParserRegistryTest` uses `15/07`); drop the frontend test (library behaviour) | |
| 6. Three checks assert less than their criterion | C3 asserts the helper, not the navigator / picker / charts; C11 renders the dialog, not the profile menu entry; C17 covers the unit setup, not Storybook | C3: a story or flow assertion that the period navigator reads `outubro 2026` in pt-BR; C11: render the navbar menu and assert "Language / Idioma" opens the dialog; C17: name C2's story run as its proof or assert `preview.initialGlobals` | |
| 7. pt-BR holds three English values, on unused keys | `frontend/src/i18n/pt-BR.json:748-750` `typeAll` "All", `typeCredit` "Credit", `typeDebit` "Debit" under `transactionFilterPopoverView`; no source references them (the only unused keys of 547) | delete the three keys from both files | |
| 8. A reset request whose language exceeds 10 characters is refused instead of sent in English (I18N-04 AC 3) | `backend/.../auth/request/ForgotPasswordRequest.java` `@Size(max = 10)` on `language` → 422, no e-mail; not reachable from the app (it sends `en`/`pt-BR`) | keep the bound but record it in the spec as an accepted 422, or map an oversize tag to unknown | |
| 9. Field errors in problem toasts start with the API's English field name in pt-BR | `frontend/src/api/utils/problems.ts` `problemFieldErrors` → `` `${field} ${constraint}` `` ("description é obrigatório") | translate known field names through keys, or drop the field prefix when no form field claims it | |

Mutations (discrimination sensor, file copies restored and `cmp`-checked): 14 frontend + 1 backend. Killed 14: device language first-only and `/^pt/` (C10), language-region bypass and forced device region (C18-C20), parity variable and `_other` checks (C7), sign-out reset and sign-in apply (C14, C15), forgot-password hard-coded `en`, dialog save removed (C13), `lang` listener removed (C12), count call forced to `_other` (C5), switch only on save success (C16), backend saved/request precedence swapped (C24). Survived 1: `parseDate` ignoring its pattern (C28). Typed keys checked: a typo in a `t("…")` key fails `tsc -p tsconfig.app.json`; every string key in the source exists in `en.json`. No `eslint-disable`, `@ts-*` or `@SuppressWarnings` in the diff; the `interface` in `i18next.d.ts` is the module augmentation TypeScript requires. Glossary terms and the "você" register hold in pt-BR on a sample of 50 values.
