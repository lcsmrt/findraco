# Actual vs Forecast (Recurrence v3) Specification

**Approved**: 2026-11-05 - user: "Ta ok"

## Problem Statement

Every series occurrence is a plain transaction, so a bill due on the 20th already counts as spent on the 5th and the month looks more spent than it is. A variable bill (electricity, water) is generated with a guessed amount and nothing tells the user it still needs the real one. AD-002 left open whether future rows become forecasts; the user asked to separate them now (2026-11-05, `context.md`).

## Goals

- [ ] The month summary shows what has happened and what is expected, for income, expenses and balance.
- [ ] A variable bill stays forecast and visibly pending until a member confirms it with its real amount.
- [ ] Existing plans behave as before on the day this ships: no pending pile.

## Out of Scope

| Feature | Reason |
| ------- | ------ |
| Matching an imported CSV row to its forecast occurrence | Its own feature (user, 2026-11-05: "Fora do escopo, pode ser.") |
| Forecast shown in the category limit bars | The categories UI will be redone (user, 2026-11-05) |
| Bank sync, reminders or notifications for pending bills | New capabilities, not asked |

---

## Assumptions & Open Questions

| Assumption / decision | Chosen default | Rationale | Confirmed? |
| --------------------- | -------------- | --------- | ---------- |
| What decides the status | The series flag "Requires confirmation" (boolean, on by default for new series) | User, 2026-11-05 (context.md, 1, 5, 8) | y |
| Flag off | The occurrence is forecast before its date and actual from its date | User, 2026-11-05 (8) | y |
| Flag on, date passed, not confirmed | Stays forecast, shown as pending, counts in forecast only | User, 2026-11-05 (7) | y |
| One-off transaction dated in the future | Forecast before its date, actual from its date; no flag | User, 2026-11-05 (9) | y |
| Confirming | A "Confirm" action opens a dialog with amount and date filled in | User, 2026-11-05 (6) | y |
| Edit form | A "Status: Forecast · Actual" control, preset to the current state; saving keeps what it shows; it also undoes a confirmation | User, 2026-11-05 (11) | y |
| Existing data | Existing series get the flag off; their past occurrences are actual | User, 2026-11-05 (10) | y |
| Category limit bars | Unchanged: they keep counting every transaction of the month, forecast included, as today | User, 2026-11-05 (3) | y |
| "Today" | The date in the user's saved time zone, as the period navigator already uses | Existing behaviour (`TimeZoneInterceptor`) | y (code) |
| Figures in the summary | Actual = sum of actual transactions; Forecast = sum of all transactions of the month (actual + still forecast), the market "previsto" | Organizze/Mobills "saldo previsto" reading (agent) | y (user, 2026-11-05: "Ta ok") |
| Monthly trend chart and per-person breakdown | Unchanged: they keep counting every transaction, as today | Keeps this feature to the summary and the list; the charts can split later | y (user, 2026-11-05: "Ta ok") |
| Series edit (scope "this and following" / "all") | Changes only occurrences still forecast; a confirmed occurrence keeps its amount and date | A confirmed occurrence is a real record; rewriting it from the template would undo the confirmation | y (user, 2026-11-05: "Ta ok") |
| Turning the flag on or off on an existing series | Applies to its occurrences still forecast; a confirmed one stays actual | Same reason | y (user, 2026-11-05: "Ta ok") |
| Who confirms | Whoever may edit that occurrence (`PlanAuthorization`, as edit) | Confirming is an edit | y (code) |
| Imported CSV rows | Actual (they record what the bank already charged) | A bank statement holds no future rows | y (code) |

**Open questions:** none - all resolved or logged above.

---

## User Stories

### P1: Forecast and actual in the month summary ⭐ MVP

**User Story**: As a plan member, I want the month's income, expenses and balance as both actual and forecast so that I know where I stand and where the month is going.

**Why P1**: The reason for the feature.

**Acceptance Criteria**:

1. The system SHALL treat a transaction as actual WHEN it is confirmed, or WHEN its series does not require confirmation (or it belongs to no series) and its date is on or before today.
2. The system SHALL treat every other transaction as forecast.
3. WHEN a member opens the overview for a month THEN the system SHALL show, for income, expenses and balance, the actual figure (sum of actual transactions) and the forecast figure (sum of all the month's transactions).
4. WHEN a transaction's date arrives and it requires no confirmation THEN the system SHALL count it as actual without any user action.
5. WHILE the selected month has no forecast transaction the system SHALL show the forecast figures equal to the actual ones.
6. The system SHALL keep the category limit bars, the monthly trend chart and the per-person breakdown counting every transaction of the month, as before this feature.

**Independent Test**: On the 5th, with rent R$ 2.000 due on the 20th (flag off) and salary R$ 5.000 received on the 1st: expenses read actual R$ 0,00 / forecast R$ 2.000,00; income R$ 5.000,00 / R$ 5.000,00; balance R$ 5.000,00 / R$ 3.000,00.

---

### P1: Variable bills wait for confirmation ⭐ MVP

**User Story**: As a plan member, I want a variable bill to stay forecast until I enter what was really charged so that the month shows real numbers.

**Why P1**: The user's own case (electricity, variable amounts).

**Acceptance Criteria**:

1. WHEN a member creates an installment or recurring series THEN the system SHALL offer a "Requires confirmation" control, on by default.
2. WHEN a member edits a series THEN the system SHALL let them turn "Requires confirmation" on or off, applying it to the series' occurrences still forecast.
3. WHILE an occurrence requires confirmation and is not confirmed the system SHALL keep it forecast, whatever its date.
4. WHILE an occurrence requires confirmation, is not confirmed and its date is before today the system SHALL mark it "Pending" in the transactions list.
5. WHILE a transaction is forecast and not pending the system SHALL mark it "Forecast" in the transactions list.
6. WHEN a member who may edit an unconfirmed occurrence that requires confirmation uses "Confirm" on it THEN the system SHALL open a dialog with its amount and date filled in.
7. WHEN the member submits the confirm dialog THEN the system SHALL save the amount and date shown, mark the occurrence confirmed and count it as actual.
8. WHEN a member opens the edit form of an occurrence that requires confirmation THEN the system SHALL show a "Status" control with "Forecast" and "Actual", preset to its current state.
9. WHEN the member saves that form THEN the system SHALL store the status the control shows, and never change it as a side effect of another field.
10. WHEN a member sets a confirmed occurrence's status to "Forecast" and saves THEN the system SHALL make it forecast again.
11. WHERE a member may not edit an occurrence the system SHALL hide "Confirm" and answer a confirm request with 404 if the occurrence is outside their plan, or the plan's role-denied problem otherwise.
12. WHEN a series is edited with scope "this and following" or "all" THEN the system SHALL leave every confirmed occurrence's amount and date unchanged.
13. IF a confirm request carries a stale `version` THEN the system SHALL answer 409 with the stale-version problem type and change nothing.
14. IF the confirm dialog's amount is empty or not above zero THEN the system SHALL show the form's validation message and not submit.

**Independent Test**: Create "Electricity" monthly R$ 200 (flag on). On the 12th, the occurrence dated the 10th shows "Pending" and expenses actual exclude it; use Confirm, change 200 to 187,40, save: it shows no badge and expenses actual include R$ 187,40.

---

### P1: Existing plans unchanged on day one ⭐ MVP

**User Story**: As an existing user, I want my plans to look as they did so that the release does not hand me a pile of pending bills.

**Why P1**: A migration that floods the list with "Pending" breaks trust on day one.

**Acceptance Criteria**:

1. WHEN the migration runs THEN the system SHALL set "Requires confirmation" off on every existing series.
2. WHEN the migration runs THEN the system SHALL leave every existing transaction's amount, date, category and split unchanged.
3. WHEN the migration has run THEN the system SHALL show no existing transaction as "Pending".

**Independent Test**: On a copy of production data, run the migration: no row shows "Pending"; past rows count as actual; future rows of existing series count as forecast.

---

### P1: One-off future transactions ⭐ MVP

**User Story**: As a plan member, I want a one-off transaction dated ahead to count as expected until its day so that a booked appointment is not spent before it happens.

**Why P1**: Same rule as series; without it, one-off rows break the summary.

**Acceptance Criteria**:

1. WHILE a one-off transaction's date is after today the system SHALL count it as forecast and mark it "Forecast".
2. WHEN a one-off transaction's date arrives THEN the system SHALL count it as actual.
3. The system SHALL show no "Requires confirmation" or "Status" control on a one-off transaction.

**Independent Test**: Add "Dentist" R$ 300 dated the 25th on the 5th: expenses forecast include it, actual do not; on the 25th it counts as actual.

---

## Edge Cases

- WHEN a confirmed occurrence's date is later than today THEN the system SHALL count it as actual (paid early).
- WHEN a member deletes a confirmed occurrence THEN the system SHALL delete it as any occurrence today (exception recorded, AD per recurrence-v2).
- IF the series template's amount changes after some occurrences were confirmed THEN the system SHALL show the confirmed ones with their confirmed amounts.
- WHEN the language is `pt-BR` THEN the system SHALL show "Realizado", "Previsto", "Pendente", "Confirmar", "Exige confirmação" and "Situação" (glossary additions).

**Implicit dimensions:** input bounds - confirm amount and date as the transaction form (AC 14); failure - one transaction per confirm, all or nothing; idempotency - confirming a confirmed occurrence is not offered and an edit carries `version` (AC 13); auth - AC 11; concurrency - optimistic `version` (AC 13); state transitions - forecast ↔ actual only through confirm and the Status control (AC 7, 9, 10); data lifecycle - migration (story 3); observability and external dependencies N/A because the feature calls no external service and adds no background work beyond the existing generator.

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
| -------------- | ----- | ----- | ------ |
| AVF-01 | P1: Forecast and actual in the month summary | Design | Pending |
| AVF-02 | P1: Variable bills wait for confirmation | Design | Pending |
| AVF-03 | P1: Existing plans unchanged on day one | Design | Pending |
| AVF-04 | P1: One-off future transactions | Design | Pending |

**Coverage:** 4 total, 0 mapped to tasks, 4 unmapped ⚠️

---

## Sources

- `.specs/features/actual-vs-forecast/context.md` - the user's decisions, 2026-11-05
- `.specs/STATE.md` AD-002, and the recurrence decision of 2026-10-29 that names this feature
- [YNAB scheduled transactions](https://support.ynab.com/en_us/scheduled-transactions-a-guide-BygrAIFA9), [Mais Controle "Como marcar como pago"](https://intercom.help/mais_controle/pt/articles/13639407-como-marcar-como-pago) - market references for confirmation

---

## Success Criteria

- [ ] For a month, the user reads the actual balance without adding up anything by hand.
- [ ] The electricity bill is confirmed with its real amount in under 10 seconds from the transactions list.
