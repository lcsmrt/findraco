# Internationalisation (M5-10) Tasks

## Execution Protocol (MANDATORY -- do not skip)

Implement these tasks with the `tlc-spec-driven` skill: **activate it by name and follow its Execute flow and Critical Rules.** Do not search for skill files by filesystem path. The skill is the source of truth for the full flow (per-task cycle, sub-agent delegation, the walk, check_proofs, the Verifier and the screens sub-agent).

**If the skill cannot be activated, STOP and tell the user - do not proceed without it.**

---

**Design**: `.specs/features/i18n/design.md`
**Status**: Approved
**Approved**: 2026-11-05 - user: "Pode seguir"
**Build**: cd frontend && pnpm lint; cd frontend && pnpm build; cd frontend && node scripts/check-siblings.ts
**Run unit**: cd frontend && pnpm exec vitest run --project=unit --project=tooling --reporter=verbose src/i18n src/utils/dates.test.ts src/utils/money.test.ts src/features/transactions/utils src/features/profile src/app/providers/AuthProvider.test.tsx src/features/auth src/features/transactions/components/TransactionFormDrawer.test.tsx scripts/translationParity.test.ts eslint.config.test.ts

---

## Test Coverage Matrix

> Generated from codebase, project guidelines, and spec. Guidelines found: `CLAUDE.md`, `frontend/scripts/testTable.ts`, `.claude/skills/frontend-testing`, `.claude/skills/backend-testing`.

| Code Layer | Required Test Type | Coverage Expectation | Location Pattern | Run Command |
| ---------- | ------------------ | -------------------- | ---------------- | ----------- |
| Backend endpoint with a rule (language validation, reset language) | integration (`*IT`) | One IT per rule asserting status and problem `type`; the role matrix gains the new endpoint | `backend/src/test/java/com/lcs/findraco/**/*IT.java` | `cd backend && ./mvnw -B verify -Dit.test=<Class>` |
| Frontend pure rule (`utils/`, `i18n/utils/`) | unit | 1:1 to the ACs it decides, edge cases included | sibling `*.test.ts` | Run unit |
| Shared / service hook | unit | Raw function + hook per `api-integration` | sibling `*.test.ts(x)` | Run unit |
| Container (dialog, provider, form drawer) | flow (unit project, MSW) | The container's decisions only | sibling `*.test.tsx` | Run unit |
| Lint rule / tooling script | tooling | Rule reports the cases it bans; script fails on the cases it guards | `eslint.config.test.ts`, `scripts/*.test.ts` | Run unit |
| Presentational views | story | One story per state handled; catalog otherwise | `*.stories.tsx` | `pnpm exec vitest run --project=storybook` |
| Resource files, i18n init, migration | none | build gate only | - | Build |

## Gate Check Commands

| Gate Level | When to Use | Command |
| ---------- | ----------- | ------- |
| Quick | After tasks with unit/tooling tests only | `cd frontend && pnpm exec vitest run --project=unit --project=tooling <related files>` |
| Full | After tasks with integration tests | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B verify` |
| Build | Last task of a phase | the `**Build**:` line + `cd frontend && pnpm exec vitest run --project=unit --project=tooling --project=storybook` (+ Full when the phase touched the backend) |

---

## Execution Plan

### Phase 1: Foundation (backend and i18n base)

```
T1 → T2
T3 → T4
```

### Phase 2: Texts and the language choice

```
T5 → T6 → T7 → T8 → T9
```

---

## Task Breakdown

### T1: Store the user's language

**What**: `V22` migration, `User.language`, `UpdateLanguageRequest` (`@Pattern` `en|pt-BR`), `PATCH /user/language`, `UserResponse.language`, `openapi.json` regenerated, `UserLanguageIT`, role-matrix row.
**Where**: `backend/src/main/java/com/lcs/findraco/user/`
**Depends on**: None
**Reuses**: the time-zone update path (`UpdateTimeZoneRequest`, `UserController.updateTimeZone`, `TimeZoneIT`)
**Requirement**: I18N-02

**Done when**:

- [ ] C21, C22 pass
- [ ] `OpenApiSnapshotIT` green with the regenerated snapshot

**Tests**: integration
**Gate**: full
**Commit**: `feat(user): store the user's language`

---

### T2: Send the reset e-mail in the reader's language

**What**: optional `language` on the password-reset request; `EmailService` subject and body per language; `PasswordResetService` picks `user.language ?? request.language ?? en`; `PasswordResetLanguageIT` with the in-memory mail fake.
**Where**: `backend/src/main/java/com/lcs/findraco/auth/service/`
**Depends on**: T1
**Reuses**: `PasswordRecoveryIT` setup, in-memory mail fake
**Requirement**: I18N-04

**Done when**:

- [ ] C24, C25, C26 pass; snapshot regenerated

**Tests**: integration
**Gate**: full
**Commit**: `feat(auth): send the reset e-mail in the reader's language`

---

### T3: The i18n base

**What**: i18next + react-i18next installed; `src/i18n/` (init, `en.json` + `pt-BR.json` holding the first keys, typed `CustomTypeOptions`), `resolveDeviceLanguage` + test, document `lang` sync + test, unit and Storybook setup in `en`, a Storybook `locale` global for the walk, `scripts/translationParity.ts` + test (key sets, interpolation variables, plural forms).
**Where**: `frontend/src/i18n/`
**Depends on**: None
**Reuses**: `frontend/src/test/setupUnit.ts`, `.storybook/preview.tsx`
**Requirement**: I18N-01, I18N-02

**Done when**:

- [ ] C7, C8, C12, C17 pass

**Tests**: unit
**Gate**: quick
**Commit**: `feat(frontend): add the i18n base`

---

### T4: Dates in the viewer's format

**What**: `utils/dates.ts` (`formatDate` and the date-fns locale of the language in use) + test; every display `format(...)` call replaced; `Calendar`/`DatePicker`/period navigator/charts receive the locale; CSV keeps `dd/mm/yyyy`.
**Where**: `frontend/src/utils/dates.ts`
**Depends on**: T3
**Reuses**: `Calendar` `locale` prop, `formatMoney`
**Requirement**: I18N-03, I18N-01

**Done when**:

- [ ] C3, C18, C19, C20, C23, C27, C28 pass
- [ ] Build gate green (last task of Phase 1), backend Full gate green

**Tests**: unit
**Gate**: build
**Commit**: `feat(frontend): format dates by language and device region`

---

### T5: Move the interface texts to en.json

**What**: run the one-off `ts-morph` codemod (design.md, Codemod) over `src/**/*.tsx`: pure literals become `t("…")`, `en.json` filled, `common.*` for texts in 3+ components; every rendered English string identical.
**Where**: `frontend/src/i18n/en.json`
**Depends on**: None (Phase 1 done)
**Reuses**: design.md codemod rules
**Requirement**: I18N-01

**Done when**:

- [ ] The full unit + storybook suite green, unchanged test files
- [ ] A read sample of the diff shows no garbled text

**Tests**: none
**Gate**: build
**Commit**: `refactor(frontend): move interface texts to en.json`

---

### T6: Translate the texts the codemod left

**What**: enable `i18next/no-literal-string` (JSX text and `placeholder`, `title`, `aria-label`, `alt`; tests and stories excluded) + its `eslint.config.test.ts` cases; fix every report: zod messages as keys translated by `FormField`, `problems.ts` copy as `problems.<slug>` resolved at call time, toasts in hooks, interpolations and plurals (`_one`/`_other`).
**Where**: `frontend/eslint.config.js`
**Depends on**: T5
**Reuses**: `FormField`, `problems.ts`
**Requirement**: I18N-01

**Done when**:

- [ ] C5, C6 pass; `pnpm lint` green

**Tests**: unit
**Gate**: quick
**Commit**: `feat(frontend): ban literal interface texts and key the rest`

---

### T7: Portuguese texts

**What**: `pt-BR.json` with every key, following the approved tone and glossary (spec.md); parity green.
**Where**: `frontend/src/i18n/pt-BR.json`
**Depends on**: T6
**Reuses**: spec.md Glossary
**Requirement**: I18N-01

**Done when**:

- [ ] C1, C4, C8 pass

**Tests**: unit
**Gate**: quick
**Commit**: `feat(frontend): add the Brazilian Portuguese texts`

---

### T8: Choose the language

**What**: `useUpdateLanguage` service hook + MSW handler factory; `LanguageDialog` (+ view + story) in the profile menu; `AuthProvider` applies `user.language` at sign-in and returns to the device language at sign-out; forgot-password sends the page's language.
**Where**: `frontend/src/features/profile/components/LanguageDialog.tsx`
**Depends on**: T7
**Reuses**: `TimeZoneDialog` pattern, `buildMutationOptions`
**Requirement**: I18N-02, I18N-04

**Done when**:

- [ ] C9, C10, C11, C13, C14, C15, C16 pass
- [ ] Walk recorded (C1, C2)

**Tests**: unit
**Gate**: quick
**Commit**: `feat(frontend): choose the language in the profile menu`

---

### T9: Release

**What**: bump `frontend/package.json` to the next `1.0.0-beta.N`.
**Where**: `frontend/package.json`
**Depends on**: T8
**Reuses**: -
**Requirement**: -

**Done when**:

- [ ] Build gate green (last task of Phase 2)

**Tests**: none
**Gate**: build
**Commit**: `chore(release): 1.0.0-beta.N`

---

## Checks

**C1** - With the language `pt-BR`, the Overview, Transactions (list, form, filters), Categories, Plans and profile menu views show no English text except user data (I18N-01, AC 1)
Proof: walk - Storybook at 390×844 with the `locale` global `pt-BR`: the page-view stories of the five destinations, the transaction form and the profile menu, each read for English

**C2** - With the language `en` every interface text reads as before this feature (I18N-01, AC 2)
Proof: cd frontend && pnpm exec vitest run --project=unit --project=storybook

**C3** - In `pt-BR` month and weekday names are Portuguese (I18N-01, AC 3)
Proof: run unit | ✓ names months and weekdays in Portuguese

**C4** - User data renders as typed in `pt-BR` (I18N-01, AC 4)
Proof: run unit | ✓ shows user data as typed in Portuguese

**C5** - A count uses the singular for 1 and the plural otherwise, in each language (I18N-01, AC 5)
Proof: run unit | ✓ uses the singular for one and the plural otherwise in both languages

**C6** - Lint reports a literal JSX text and a literal `placeholder`, `title`, `aria-label` or `alt` in a component (I18N-01, AC 6)
Proof: run unit | ✓ reports literal interface texts in components

**C7** - The parity check fails when a key, an interpolation variable or a plural form exists in one language only (I18N-01, AC 7)
Proof: run unit | ✓ fails when the two languages differ

**C8** - The committed language files are in parity (I18N-01, AC 7)
Proof: run unit | ✓ the committed language files are in parity

**C9** - Switching the language with a form open keeps every typed value and translates its texts and errors (edge case 1)
Proof: run unit | ✓ keeps typed values when the language changes

**C10** - With no saved language, `pt*` anywhere in the device languages (first match) selects `pt-BR`, otherwise `en` (I18N-02, AC 1)
Proof: run unit | ✓ picks pt-BR for a Portuguese device language and en otherwise

**C11** - The profile menu offers "Language / Idioma" with "English" and "Português (Brasil)" (I18N-02, AC 2)
Proof: run unit | ✓ offers English and Português (Brasil)

**C12** - The document `lang` follows the language in use (I18N-02, AC 8)
Proof: run unit | ✓ sets the document lang to the language in use

**C13** - Picking a language switches the screen without a reload and sends `PATCH /user/language` with it (I18N-02, AC 3)
Proof: run unit | ✓ switches the texts at once and saves the language

**C14** - A saved language applies at sign-in over the device language (I18N-02, AC 4)
Proof: run unit | ✓ applies the saved language at sign-in

**C15** - Signed out, the public pages use the device language, also after a sign-out (I18N-02, AC 5; edge case 2)
Proof: run unit | ✓ uses the device language when signed out

**C16** - A failed save keeps the picked language and shows the problem copy (I18N-02, AC 7)
Proof: run unit | ✓ keeps the picked language when saving fails

**C17** - Unit tests and Storybook start in English (design, Risks)
Proof: run unit | ✓ starts the tests in English

**C18** - `pt-BR` writes 4 November 2026 as `04/11/2026` (I18N-03, AC 2)
Proof: run unit | ✓ writes 04/11/2026 in Portuguese

**C19** - `en` with region BR writes `04/11/2026` (I18N-03, AC 3)
Proof: run unit | ✓ writes 04/11/2026 in English on a Brazilian device

**C20** - `en` with region US writes `11/04/2026` (I18N-03, AC 4)
Proof: run unit | ✓ writes 11/04/2026 in English on a US device

**C21** - `PATCH /user/language` with `pt-BR` stores it and `/user` returns it (I18N-02, AC 3 and 4)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='UserLanguageIT#storesTheLanguageAndReturnsIt' -Dsurefire.skip=true

**C22** - An unknown language answers 422 `validation-failed` (I18N-02, AC 6)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='UserLanguageIT#rejectsAnUnknownLanguage' -Dsurefire.skip=true

**C23** - No display code formats a date with date-fns `format` outside `utils/dates.ts` (I18N-03, AC 1)
Proof: cd frontend && test -z "$(grep -rlE 'import \{[^}]*\bformat\b[^}]*\} from "date-fns"' src --include='*.ts' --include='*.tsx' --exclude='*.test.*' --exclude='*.stories.*' | grep -v '^src/utils/dates.ts$')"

**C24** - A reset for an account saved in `pt-BR` sends the Portuguese e-mail (I18N-04, AC 1)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='PasswordResetLanguageIT#usesTheSavedLanguage' -Dsurefire.skip=true

**C25** - With none saved, the e-mail follows the request's language (I18N-04, AC 2)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='PasswordResetLanguageIT#usesTheRequestLanguageWhenNoneIsSaved' -Dsurefire.skip=true

**C26** - With none saved and no or an unknown request language, the e-mail is English (I18N-04, AC 3)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='PasswordResetLanguageIT#fallsBackToEnglish' -Dsurefire.skip=true

**C27** - Money reads `R$ 1.234,56` in both languages (I18N-03, AC 5)
Proof: run unit | ✓ formats money the same in both languages

**C28** - The CSV import reads `dd/mm/yyyy` in both languages (I18N-03, AC 6)
Proof: run unit | ✓ reads CSV dates as dd/mm/yyyy in both languages

---

## Handoff

**Settled mid-build:** none
**Dispatched:** batch A (T1–T4, Sonnet) at HEAD after the approval commit
**Walked:** not yet
