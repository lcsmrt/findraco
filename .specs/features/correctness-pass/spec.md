# Correctness Pass Specification

**Approved**: 2026-11-18 - user: "Consegue seguir com design e tasks e execução disso aqui sozinho? Em seguida, escolher adequadamente entre lean e sdd e continuar com a fase 1. Sozinho, sem me chamar pra nada, até 9 da manhã"

> Unattended run: the user approved the spec as presented and delegated tasks and execution; their review moves to after the build.

## Problem Statement

The design survey (`.specs/project/DESIGN-PLAN.md`, Track 0) found seven defects that show wrong numbers, wrong labels or a
blank screen, or that save data the user did not choose. Each one is small, but together they cost trust in the figures
the redesign will build on, so they ship before any redesign work.

## Goals

- [ ] Reloading or opening a link on any plan the user belongs to shows that plan.
- [ ] Every figure under a headline uses the same basis as the headline.
- [ ] No form path saves an attribution or a date the user did not see.
- [ ] Period, label and percent copy say what the figure is.

## Out of Scope

| Feature | Reason |
| ------- | ------ |
| "Este mês" shortcut chip on the period navigator | New control, not a defect; DESIGN-PLAN C8/N2 |
| Member chips "Eu · Marina · Dividir" | Redesign of attribution, DESIGN-PLAN C2 |
| Backend default attribution when a request has no participants | The API and the MCP rely on "no participants → the creator"; the defect is the form sending nothing |
| Real account balance | DESIGN-PLAN R7; this pass only relabels the current figure |
| Category rows' forecast-inclusive basis | Needs a new API field, DESIGN-PLAN O1 |
| Progressive loading in place of the pager | DESIGN-PLAN C8 |

---

## Assumptions & Open Questions

| Assumption / decision | Chosen default | Rationale | Confirmed? |
| --------------------- | -------------- | --------- | ---------- |
| Arrow landing on a preset range (B4) | Stored as that preset; other ranges stay absolute (AD-027) | User, 2026-11-17: "Yes, save as preset (Recommended)" | y |
| Label of the income − expenses card (B7) | pt-BR "Resultado", en "Net" | User, 2026-11-17: "Resultado (Recommended)" | y |
| "Outra pessoa" with nobody picked (B3) | Choosing it preselects the first other member; an empty person blocks saving with "Escolha a pessoa" / "Choose the person" | User, 2026-11-17: "Preselect + block (Recommended)" | y |
| Clear button on a required date (B5) | Removed; erasing the text and leaving the field shows the date the form holds; optional dates keep the clear button | User, 2026-11-17: "Remove the X (Recommended)" | y |
| Basis of the per-person legend (B2) | The actual amount, the same basis as the headline the card labels "Realizado" | The card's caption names the headline as actual; the forecast keeps its own caption line | y - code |
| "First other member" (B3) | The first member other than the current user in the order the person picker lists them | The picker's order is what the user sees | y - code |
| Percent shown next to a limit (B6) | Rounded as today, but at most 99 while money remains and at least 101 while over | "restam R$ 1,22 · 100%" reads as contradictory; status itself stays the API's | y - code |
| Blank-page cause (B1) | The active plan is cleared while the session is still restoring (`user` is null), then the default plan overwrites the link's plan in the same effect pass and the gate waits forever | Read in `PlanProvider.tsx` and `PlanFiltersGate.tsx`; reproduced twice in the browser | y - code |

**Open questions:** none - all resolved or logged above.

---

## User Stories

### P1: A link or reload opens the plan it names ⭐ MVP

**User Story**: As a member of several plans, I want a reload or a saved link on a non-default plan to open that plan, so that I never see a blank screen.

**Why P1**: The screen is blank until the user switches plans by hand; it hits every reload on a shared plan.

**Acceptance Criteria**:

1. WHEN a signed-in member reloads a screen whose URL has `plan` set to a plan they belong to that is not their default plan THEN the system SHALL render that screen for that plan and the plan switcher SHALL show that plan's name.  <!-- event-driven -->
2. WHEN a signed-out user signs in and then opens a screen URL whose `plan` is a non-default plan they belong to THEN the system SHALL render that screen for that plan.  <!-- event-driven -->
3. WHILE the session is being restored the system SHALL keep the stored active plan instead of clearing it.  <!-- state-driven -->
4. IF the URL's `plan` is a plan the user does not belong to THEN the system SHALL redirect to the active plan's saved state for that screen (unchanged behaviour).  <!-- unwanted-behavior -->

**Independent Test**: Sign in, switch to a non-default plan, reload `/overview`: the Overview of that plan renders.

---

### P1: Figures share the headline's basis ⭐ MVP

**User Story**: As a plan member, I want the per-person amounts under Income and Expenses to add up to the headline, so that the card does not contradict itself.

**Why P1**: The headline says R$ 6.127 actual while the names under it sum to R$ 7.586 forecast.

**Acceptance Criteria**:

1. WHEN the Overview summary shows Income or Expenses THEN each member's amount and bar width SHALL use that member's actual amount (`actualIncome` / `actualExpense`), with widths relative to the plan's actual total.  <!-- event-driven -->
2. IF a member's actual amount is zero THEN the system SHALL omit that member from the legend and the bar.  <!-- unwanted-behavior -->
3. WHEN the Overview shows the income − expenses card THEN its label SHALL read "Resultado" in pt-BR and "Net" in en.  <!-- event-driven -->

**Independent Test**: With a plan that has forecast expenses, the member amounts under Expenses sum to the headline.

---

### P1: The form saves what the user chose ⭐ MVP

**User Story**: As a plan member, I want the transaction form never to save an attribution or a date different from what it shows.

**Why P1**: Today an expense meant for someone else is silently saved as the creator's, and a cleared date looks empty while the old one is saved.

**Acceptance Criteria**:

1. WHEN the member chooses "Outra pessoa" in the attribution field and no other member is already among the participants THEN the system SHALL select the first member other than the current user in the person picker; an other member already chosen (coming from Dividir) stays selected.  <!-- event-driven -->
2. IF the attribution is "Outra pessoa" and no person is selected when the member saves THEN the system SHALL not send the request and SHALL show "Escolha a pessoa" (en "Choose the person") on the person field.  <!-- unwanted-behavior -->
3. The transaction date field SHALL show no clear button.  <!-- ubiquitous -->
4. WHEN the member erases the date text and leaves the field THEN the system SHALL show the date the form still holds.  <!-- event-driven -->
5. WHERE a date field is optional (the series end date) the system SHALL keep its clear button and clearing it SHALL clear the value.  <!-- optional-feature -->

**Independent Test**: Choose "Outra pessoa" in a two-member plan and save: the expense belongs to the other member.

---

### P1: The period follows the calendar when it should ⭐ MVP

**User Story**: As a plan member, I want stepping back to the current month to put me on "this month", so that the screen does not stay pinned to an old month later.

**Why P1**: After ‹ then ›, the screen opens on the same fixed month forever.

**Acceptance Criteria**:

1. WHEN the member taps an arrow and the resulting range equals a preset's range resolved against today (This month, Last 3 months, Last 6 months, This year) THEN the system SHALL store that preset in the URL, not a custom range.  <!-- event-driven -->
2. WHEN the member taps an arrow and the resulting range equals no preset's range THEN the system SHALL store the absolute range (unchanged behaviour).  <!-- event-driven -->
3. WHEN a preset reached by the arrows is restored in a later calendar month THEN the system SHALL resolve it against the new current date.  <!-- event-driven -->

**Independent Test**: On the Overview, tap ‹ then ›: the URL holds no `period=custom`.

---

### P2: Lists and limits say what they hold

**User Story**: As a plan member, I want the phone list, the pager and the limit percent to match the data.

**Why P2**: Smaller inconsistencies; no wrong totals.

**Acceptance Criteria**:

1. WHEN a phone transaction row belongs to a series THEN the system SHALL show the same series marker the desktop row shows.  <!-- event-driven -->
2. IF a transaction list has zero rows THEN the system SHALL not show the pager, on phone or desktop.  <!-- unwanted-behavior -->
3. WHILE a category with a limit still has money remaining the system SHALL show its percent as at most 99.  <!-- state-driven -->
4. WHILE a category is over its limit the system SHALL show its percent as at least 101.  <!-- state-driven -->

**Independent Test**: A category at 99.9% shows "99%" next to its remaining amount.

---

## Edge Cases

- IF the plan list fails to load on a reload THEN the system SHALL keep the existing error/empty behaviour of the gate (no new state).
- WHEN a plan has a single member THEN the system SHALL keep today's behaviour of hiding the attribution field (`TransactionFormDrawer.tsx:83`), so there is nobody to preselect.
- WHEN a custom range picked in the calendar equals a preset's range THEN the system SHALL keep it as a custom range (only arrows are normalised; AD-027 covers arrows).

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
| -------------- | ----- | ----- | ------ |
| FIX-01 | P1: Link or reload opens its plan (AC 1–4) | Tasks | Pending |
| FIX-02 | P1: Figures share the headline's basis (AC 1–2) | Tasks | Pending |
| FIX-03 | P1: Figures share the headline's basis (AC 3) | Tasks | Pending |
| FIX-04 | P1: The form saves what the user chose (AC 1–2) | Tasks | Pending |
| FIX-05 | P1: The form saves what the user chose (AC 3–5) | Tasks | Pending |
| FIX-06 | P1: The period follows the calendar (AC 1–3) | Tasks | Pending |
| FIX-07 | P2: Lists and limits say what they hold (AC 1–2) | Tasks | Pending |
| FIX-08 | P2: Lists and limits say what they hold (AC 3–4) | Tasks | Pending |

**Coverage:** 8 total, 0 mapped to tasks, 8 unmapped ⚠️

---

## Sources

- `.specs/project/DESIGN-PLAN.md` Track 0 (B1–B7) - the defects and their evidence.
- `.specs/features/period-navigator/spec.md` persistence row, amended by AD-027.
- User answers, 2026-11-17 (B3, B4, B5, B7).

---

## Success Criteria

- [ ] A reload on the shared plan renders it on the first try.
- [ ] The member amounts under each summary headline sum to it.
- [ ] No transaction saved from the form carries an attribution or date the form did not show.
