# Internationalisation (M5-10) Specification

**Approved**: 2026-11-05 - user: "Ficou ótimo"

## Problem Statement

The interface exists only in English, and the user's wife, who shares a plan with him, struggles to use it (user, 2026-11-05). Every text is written inline in about 140 components, with no translation layer. ROADMAP M5-10 planned UI copy in more than one language with formatting by the viewer's locale; the error contract (AD-018) and the single money module (frontend-standards B6) were built for it.

## Goals

- [ ] A user whose device is in Portuguese uses the whole app in Brazilian Portuguese without changing any setting.
- [ ] Any user switches the language in the profile menu, and the choice follows them to every device.
- [ ] A text added later in one language only, or written inline in a component, fails the build.

## Out of Scope

| Feature | Reason |
| ------- | ------ |
| Translating data users type (category, transaction, plan and member names) | User data, never translated (context.md) |
| Languages beyond `en` and `pt-BR` | User, 2026-11-05 |
| A region / format preference, and a user-chosen date format | Deferred (user, 2026-11-05) |
| Money formatting by language | Currency is data, not language (user, 2026-11-05); stays `R$ 1.234,56` |
| Translating the API's problem `detail` | Developer text in English by AD-018; users read the frontend copy |
| Storybook catalog in Portuguese | Developer tooling |

---

## Assumptions & Open Questions

| Assumption / decision | Chosen default | Rationale | Confirmed? |
| --------------------- | -------------- | --------- | ---------- |
| Languages | `en` (source) and `pt-BR` | User, 2026-11-05 | y |
| Device language mapping | Any `pt*` in the device's preferred languages, first match wins in order, selects `pt-BR`; anything else selects `en` | `pt-PT` readers read `pt-BR`; English is the source | y (agent's discretion) |
| Language choice | Device language until the user picks one in the profile menu; the pick is saved on the account (as the time zone is) and applied at every sign-in | User, 2026-11-05: "auto + troca via config" | y |
| Before sign-in | Login, sign-up and password pages use the device language | Nothing else is known yet | y |
| Reset e-mail language | The account's saved language; with none saved, the language of the page that asked | User asked for the market pattern (2026-11-05) | y |
| Date format | Chosen language with the device's region (`Intl.Locale`); `pt-BR` writes `04/11/2026`, `en` on a Brazilian device `04/11/2026`, on a US device `11/04/2026` | Market pattern: language and regional format are separate (user confirmed 2026-11-05) | y |
| Money | `R$ 1.234,56` in both languages, unchanged | User, 2026-11-05 | y |
| Typed dates (inputs, CSV) | The CSV keeps `dd/mm/yyyy` (the Nubank file's format); date inputs follow the displayed format | The file format is the bank's, not the viewer's | y (agent's discretion) |
| Portuguese tone | Second person "você", sentence case, the terms in the Glossary below | Common Brazilian app register; approved with the spec | y |

**Glossary (approved with the spec, 2026-11-05):** Plan → Plano · Overview → Visão geral · Transactions → Transações · Categories → Categorias · Expense → Despesa · Income → Receita · Installment → Parcela · Recurring → Recorrente · Series → Série · Spending limit → Limite de gastos · Owner / Editor / Contributor / Viewer → Dono / Editor / Colaborador / Leitor · Archive → Arquivar · Sign in → Entrar.

**Open questions:** none - all resolved or logged above.

---

## User Stories

### P1: The app in Brazilian Portuguese ⭐ MVP

**User Story**: As a Portuguese-speaking member of a plan, I want every screen in Portuguese so that I can use the app without knowing English.

**Why P1**: The reason for the feature.

**Acceptance Criteria**:

1. WHILE the language is `pt-BR` the system SHALL show every interface text in Brazilian Portuguese: navigation, page and section titles, labels, placeholders, buttons, menus, dialogs, toasts, empty states, form validation messages and the copy of every problem type.
2. WHILE the language is `en` the system SHALL show the interface texts as they read before this feature.
3. WHILE the language is `pt-BR` the system SHALL show month and weekday names in Portuguese, in the period navigator, the date picker and the charts.
4. The system SHALL show data users typed (category, transaction, plan and member names) as typed, in either language.
5. WHEN a count is shown in a text (parcels, lines, members, days) THEN the system SHALL use the singular for 1 and the plural otherwise, in each language.
6. IF a component holds an interface text as a literal in JSX or in a user-facing prop (`placeholder`, `title`, `aria-label`, `alt`) THEN the lint SHALL fail.
7. IF a translation key exists in one language file and not in the other THEN the build SHALL fail.

**Independent Test**: With the device in Portuguese, sign in, add a transaction from the bottom bar, open Categories and Plans: no English text appears except user data.

---

### P1: Choose the language ⭐ MVP

**User Story**: As a user, I want the app to start in my device's language and let me change it so that each person in the house reads their own language.

**Why P1**: Without it, nobody can change a wrong guess.

**Acceptance Criteria**:

1. WHEN a user with no saved language opens the app THEN the system SHALL use `pt-BR` if any of the device's preferred languages starts with `pt`, the first such match in order, and `en` otherwise.
2. WHEN the user opens the profile menu THEN the system SHALL offer a "Language / Idioma" control listing "English" and "Português (Brasil)", each written in its own language.
3. WHEN the user picks a language THEN the system SHALL switch every text on screen to it without reloading the page and save it on the user's account.
4. WHEN a user with a saved language signs in, on any device, THEN the system SHALL use the saved language.
5. WHILE no user is signed in the system SHALL use the device language.
6. IF the language sent to the API is neither `en` nor `pt-BR` THEN the API SHALL answer 422 with the validation-failed problem type.
7. IF saving the language fails THEN the system SHALL keep the picked language on screen for the session and show the copy of the returned problem type.
8. The system SHALL set the document's `lang` attribute to the language in use.

**Independent Test**: On a device in English, pick "Português (Brasil)" in the profile menu: the screen switches at once; sign in on a second browser in English: the app opens in Portuguese.

---

### P1: Dates in the viewer's format ⭐ MVP

**User Story**: As a user, I want dates written the way my region writes them so that I never misread a day for a month.

**Why P1**: Translated text with misread dates breaks trust in the ledger.

**Acceptance Criteria**:

1. The system SHALL format every displayed date with the language in use and the device's region.
2. WHEN the language is `pt-BR` THEN the system SHALL write 4 November 2026 as `04/11/2026`.
3. WHEN the language is `en` and the device region is Brazil THEN the system SHALL write 4 November 2026 as `04/11/2026`.
4. WHEN the language is `en` and the device region is the United States THEN the system SHALL write 4 November 2026 as `11/04/2026`.
5. The system SHALL format money as `R$ 1.234,56` in both languages.
6. The CSV import SHALL keep reading dates as `dd/mm/yyyy` in both languages.

**Independent Test**: With the language `en` on a browser whose locale is `en-US`, the transactions list shows `11/04/2026` for 4 November; switch to Portuguese: `04/11/2026`; amounts read `R$ 1.234,56` both times.

---

### P2: The reset e-mail in the reader's language

**User Story**: As a user who forgot their password, I want the reset e-mail in my language so that I can follow it.

**Why P2**: The only server-sent text; rare, but met when the user is already stuck.

**Acceptance Criteria**:

1. WHEN a password reset is requested for an account with a saved language THEN the system SHALL send the e-mail's subject and body in that language.
2. WHEN a password reset is requested for an account with no saved language THEN the system SHALL send the e-mail in the language of the page that asked.
3. IF the request carries no language or one other than `en` and `pt-BR`, and the account has none saved, THEN the system SHALL send the e-mail in English.

**Independent Test**: With an account saved in Portuguese, request a reset from a page in English: the e-mail arrives in Portuguese.

---

## Edge Cases

- WHEN the user switches language while a form is open THEN the system SHALL keep every typed value and show the form's texts and validation messages in the new language.
- WHEN the user signs out THEN the system SHALL return to the device language on the public pages.

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
| -------------- | ----- | ----- | ------ |
| I18N-01 | P1: The app in Brazilian Portuguese | Design | Pending |
| I18N-02 | P1: Choose the language | Design | Pending |
| I18N-03 | P1: Dates in the viewer's format | Design | Pending |
| I18N-04 | P2: The reset e-mail in the reader's language | Design | Pending |

**Coverage:** 4 total, 0 mapped to tasks, 4 unmapped ⚠️

---

## Success Criteria

- [ ] The user's wife uses the app on her phone in Portuguese for a week without asking what a screen means.
- [ ] A new English text without its Portuguese key fails CI.
