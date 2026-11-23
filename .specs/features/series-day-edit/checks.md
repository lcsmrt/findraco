# Series date edit checks

Build: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -DskipITs -Dsurefire.skip=true; cd frontend && pnpm lint; cd frontend && pnpm build; cd frontend && node scripts/check-siblings.ts
Run unit: cd frontend && pnpm exec vitest run --project=unit --reporter=verbose src/features/transactions/components/TransactionFormDrawer.test.tsx src/features/transactions/components/transactionForm.series.test.ts
Run stories: cd frontend && pnpm exec vitest run --project=storybook --reporter=verbose src/features/transactions/components/SeriesScopeDialog.stories.tsx
Plan: `.specs/features/series-day-edit/plan.md`

26 checks in 4 slices · 3 one-way doors · 0 open, of which 0 block

## Checks

### S1 - One occurrence

**C1** - Monthly 16/03-16/06/2026: April to 20/04 with "Só esta" gives 16/03, 20/04, 16/05, 16/06; April to 02/05 gives April's occurrence on 02/05 and May's on 16/05, and April's slot stays in April (AC 1)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesDateEditIT#onlyThisMovesOneOccurrence' -Dsurefire.skip=true

**C2** - April moved alone to 20/04, then the amount edited with "Todas": April stays 20/04 and carries the new amount (AC 2)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesDateEditIT#movedAloneKeepsDateOnAllEdit' -Dsurefire.skip=true

### S2 - The day from an occurrence on

**C3** - Monthly 16/03-16/06/2026: from April to 18/04 with "Esta e as seguintes" gives 16/03, 18/04, 18/05, 18/06 and end 18/06/2026; from March (the first) to 18/03 gives 18/03 to 18/06 (AC 3)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesDateEditIT#dayChangeMovesPivotAndFollowing' -Dsurefire.skip=true

**C4** - May confirmed on 16/05, from April to 18/04: April 18/04, May 16/05, June 18/06 (AC 4)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesDateEditIT#confirmedKeepsDateOnDayChange' -Dsurefire.skip=true

**C5** - April moved alone to 20/04, then from March to 18/03 with "Esta e as seguintes": April is 18/04 (AC 5)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesDateEditIT#movedAloneMovesWithFollowing' -Dsurefire.skip=true

**C6** - Day 31 from 16/01/2026 gives 31/01, 28/02, 31/03, 30/04; a series starting 16/02/2026 moved to 31/03 from March gives 16/02, 31/03, 30/04 and 31/05 (AC 6; example corrected 2026-11-23 with the owner)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesDateEditIT#dayThirtyOneFallsOnMonthEnd' -Dsurefire.skip=true

**C7** - April deleted "only this", then from March to 18/03: no occurrence in April, and a later "Todas" amount edit does not refill it (AC 7)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesDateEditIT#deletedMonthStaysEmptyOnDayChange' -Dsurefire.skip=true

**C8** - An open-ended series moved to day 31: the top-up adds the next months on 31, or on the last day of a shorter month (AC 8)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesDateEditIT#topUpUsesChangedDay' -Dsurefire.skip=true

**C9** - A deletion made before a "Esta e as seguintes" date change: restoring it answers 409 `trash-series-changed` (AC 9)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesDateEditIT#restoreBeforeDateChangeConflicts' -Dsurefire.skip=true

### S3 - The start month

**C10** - Monthly 16/03-16/06/2026, first occurrence to 16/04: 16/04, 16/05, 16/06, 16/07, end 16/07/2026, still 4 occurrences (AC 10)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesDateEditIT#firstOccurrenceShiftsRecurringMonth' -Dsurefire.skip=true

**C11** - Installments 10x from 16/12/2026, first to 05/01/2027: 05/01/2027 to 05/10/2027, labelled 1/10 to 10/10 (AC 10)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesDateEditIT#firstOccurrenceShiftsInstallmentMonth' -Dsurefire.skip=true

**C12** - Monthly 16/03-16/06/2026 with April deleted, first to 16/04: no occurrence in May (AC 10)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesDateEditIT#monthShiftMovesDeletedMonth' -Dsurefire.skip=true

**C13** - Monthly from 16/03/2026: April to 18/05 "Esta e as seguintes" → 422 `series-date-change-invalid`; April to 18/04 "Todas" → 422 `series-date-change-invalid`; both leave every occurrence and the version unchanged; April to 18/04 "Esta e as seguintes" → 200; no `pivotDate` with "Todas" → 200 (AC 11)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesDateEditIT#invalidDateChangeIsRefused' -Dsurefire.skip=true

**C14** - Month change while an occurrence is confirmed → 422 `series-month-change-confirmed` and nothing changes, over: monthly 16/03-16/06/2026 with April confirmed, first to 16/04; with June confirmed, first to 16/02; installments 10x from 16/12/2026 with 10/10 confirmed, first to 16/11/2026; and with nothing confirmed, first to 16/04 → 200 (AC 12; claim changed 2026-11-23 with the owner)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesDateEditIT#monthCollisionIsRefused' -Dsurefire.skip=true

### S4 - The form

**C15** - Opening April's occurrence of a series to edit shows "Data" with April's date (AC 13)
Proof: run unit | ✓ TransactionFormDrawer series date > shows the opened occurrence's date

**C16** - With the date changed, saving opens the scope dialog with only "Só esta" and "Esta e as seguintes" (AC 14)
Proof: run unit | ✓ TransactionFormDrawer series date > offers only this and following when the date changed
Proof: run stories | ✓ src/features/transactions/components/SeriesScopeDialog.stories.tsx > Date Changed

**C17** - With the date unchanged, the scope dialog offers "Só esta", "Esta e as seguintes" and "Todas" as today (AC 14)
Proof: run unit | ✓ TransactionFormDrawer series date > offers every scope when the date is unchanged

**C18** - The edit payload carries `pivotDate` only when the date changed, and `null` otherwise (AC 14)
Proof: run unit | ✓ transactionForm series date > sends the pivot date only when it changed

**C19** - With the date and the number of installments both changed, saving sends nothing and shows the message that they go in separate edits (AC 15)
Proof: run unit | ✓ TransactionFormDrawer series date > refuses a date and installments change in one edit

**C20** - The API answering `series-date-change-invalid` and `series-month-change-confirmed` shows each one's message, table-driven over both slugs (AC 16)
Proof: run unit | ✓ TransactionFormDrawer series date > shows the series date problems from the API

### Appended after the Verifier (2026-11-23)

**C25** - Monthly 16/03-16/06/2026, end typed 16/08/2026 and first to 16/04 in one edit: 16/04 to 16/08, end 16/08/2026, 5 occurrences (AC 17)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesDateEditIT#typedEndWinsOverMonthShift' -Dsurefire.skip=true

**C26** - Series ending 16/06/2026 with June moved alone to 02/07/2026: reopened, amount changed and saved with "Só esta" sends the edit (AC 18)
Proof: run unit | ✓ TransactionFormDrawer series date > saves an occurrence moved past the series end

### Doors and what stays

**C21** - Door 1: after `V30`, an existing definition with `start_date` 16/03/2026 has `day_of_month` 16, and a value of 0 or 32 is refused by `ck_recurrence_definitions_day_of_month`
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='MigrationsIT#recurrenceDayOfMonthIsFilledAndBounded' -Dsurefire.skip=true

**C22** - Door 2: `pivotDate` is in the committed `backend/openapi.json`
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='OpenApiSnapshotIT' -Dsurefire.skip=true

**C23** - Door 3 and what stays: series edit, deletion, confirmation, top-up and trash keep passing (`SeriesEditIT`, `SeriesConfirmationIT`, `OpenEndedSeriesIT`, `OpenEndedTopUpIT`, `SeriesTopUpJobIT`, `TransactionTrashIT`, `TrashRuleRevisionIT`); a test changes only where the plan's `Changes underneath` changes the claim (dates no longer reset to the slot)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesEditIT,SeriesConfirmationIT,OpenEndedSeriesIT,OpenEndedTopUpIT,SeriesTopUpJobIT,TransactionTrashIT,TrashRuleRevisionIT' -Dsurefire.skip=true

**C24** - A member who may not modify an occurrence in scope gets 404/403 as today on a date change, and nothing moves
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SeriesDateEditIT#dateChangeNeedsRightsOverEveryOccurrenceInScope' -Dsurefire.skip=true

## Coverage

| Set (size) | Member -> proof | Unproven |
| --- | --- | --- |
| `PUT /plan/{planId}/transaction/series/{seriesId}` statuses (4 new or changed) | 200 C3 · 422 `series-date-change-invalid` C13 · 422 `series-month-change-confirmed` C14 · denied C24 | - |
| scopes for a date change (3) | "Só esta" C1 · "Esta e as seguintes" C3 · "Todas" refused C13 | - |
| AC 1 examples (2) | same month C1 · another month C1 | - |
| AC 3 examples (2) | from a later occurrence C3 · from the first C3 | - |
| AC 6 examples (2) | from January C6 · February start C6 | - |
| AC 12 examples (4) | April confirmed C14 · June confirmed C14 · 10/10 confirmed C14 · none confirmed C14 | - |
| AC 17 examples (2) | end typed C25 · end unchanged C10 | - |
| AC 18 examples (1) | moved past the end C26 | - |
| AC 10 examples (3) | recurring C10 · installments C11 · deleted month C12 | - |
| AC 11 examples (4) | another month mid-series C13 · "Todas" C13 · same month C13 · no `pivotDate` C13 | - |
| AC 12 examples (2) | with a confirmed C14 · without C14 | - |
| occurrence kinds under a date change (4) | forecast C3 · confirmed C4 · moved alone C5 · deleted C7 | - |
| readers of the slot (4) | regenerator C7 · trash restore C9 · top-up C8 · deletions C23 | - |
| creators of later occurrences (2) | `OpenEndedSeriesTopUpService` C8 · `SeriesRegenerator` refill C6 | - |
| form scope dialog states (2) | date changed C16 · unchanged C17 | - |
| problem slugs with copy (2) | `series-date-change-invalid` C20 · `series-month-change-confirmed` C20 | - |
| doors (3) | `day_of_month` C21 · `pivotDate` C22 · no split C23 | - |

## Swept

- validation: C13, C19 - the form blocks date + installments; the API refuses "Todas" with a date and a month change mid-series
- failure modes: C13, C14 - a refused change stores nothing (one transaction)
- idempotency: existing - the edit claims the definition `version`; sending the same edit twice with the old version is 409
- authorization: C24
- concurrency: existing - `editSeries` locks the definition `FOR UPDATE` and claims its version, as the top-up does
- data lifecycle: C21 - backfill from `start_date`; C2 - a moved date survives later edits; C9 - earlier trash entries refuse a restore
- dependency failure: n/a - no external call
- state transitions: C4 - confirmed stays; C2, C5 - moved alone, then kept or moved along
- observability: n/a - no logging requirement

## Handoff

- **Settled mid-build:** 2026-11-23, after the Verifier: month change with a confirmed occurrence - "Recusa se tiver confirmada (Recomendado)"; end typed with a month change - "Vale o que digitei (Recomendado)"; AC 6 February example - "Pode trocar (Recomendado)". Surfaced, not fixed (outside the diff): deleting "this and following" picks occurrences by current date, not slot (`TransactionService.deleteSeries`); a day change on an occurrence moved alone to another month counts the month from its slot and is refused as a month change
- **Dispatched:** backend worker (Sonnet) at 6d2fa84d - C1-C14, C21-C24, returned at 27d4809e (C6's February example unreachable as written, asked the owner); frontend worker (Sonnet) at 27d4809e - C15-C20, returned at 8b741cab; walk worker (Sonnet) at 8b741cab, returned; Verifier (Opus) at 6957e36e, returned FAIL with 4 findings; fix worker (Sonnet) at the next commit - findings 1-4
- **Boundary:** none yet
- **Abandoned:** none
- **Walked:** local stack at 8b741cab (throwaway Postgres container on 5434, db `walk`; backend `spring-boot:run` profile local on 3000; built SPA via `vite preview` on 5173), Playwright pt-BR 1280x800 and 390x844. "Aluguel" R$ 1.000 monthly 16/03-16/07/2027 and "Notebook" 10x from 16/12/2026 created in the UI. 2nd occurrence → "Editar série", Data 16/04/2027; to 18/04 → dialog shows only "Só esta" and "Esta e as seguintes"; "Esta e as seguintes" → 16/03, 18/04, 18/05, 18/06, 18/07, end 18/07/2027. 3rd to 20/05 "Só esta" → only it moves; value to R$ 1.200 with no date change → three scopes; "Todas" → all R$ 1.200, 3rd stays 20/05. 1st to 16/04 "Esta e as seguintes" → 16/04-16/08/2027, 5 occurrences, the 20/05 one moved along. 2nd to 16/06 "Esta e as seguintes" → toast "Essa mudança de data não é possível: com \"Todas\" a data não muda, e o mês só muda a partir da primeira ocorrência.", list unchanged. Notebook date + parcels 12 → no request, "Mude a data e o número de parcelas em edições separadas. Salve uma, depois a outra."; date only 1st to 05/01/2027 → 05/01-05/10/2027, 1/10-10/10. Saving unchanged sends `pivotDate: null` and the new end; nothing moves. Phone: edit sheet Data full width, scope dialog 358 px, "Só esta" saved → card "quinta, 17 jun 2027". Users reach it from Transações → a series row → Editar.
