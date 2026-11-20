# Design Refactoring Plan

**Date:** 2026-11-17 · **Status:** proposal, nothing decided or scheduled · **Scope:** whole product, not bound to the current roadmap.

This is a survey and a proposal. Each item becomes a spec (tlc Specify) or a quick fix before any code is written.
Items that reverse a recorded decision are marked **[reverses]** and need the owner's call.

## Method

- Local app with seeded data (shared plan "Casa", two members, four months, series, installments, splits, items).
- 48 screenshots: phone 390×844 and desktop 1440×900, light and dark, forms, filters, empty states.
- Five independent read-only lenses: navigation and consistency, dashboard analysis, daily-use flows, design system,
  product and roadmap.
- The gravest findings were checked in code by the main agent. The **Checked** column says how:
  `run` = reproduced in the running app, `code` = read in code, `shot` = visible in a screenshot, `lens` = reported by
  a lens and not re-checked.
- Not covered: auth pages and the import dialog were judged from code only; nothing was tested on a real phone.

## Diagnosis

findraco records money well: shared plans, limits, splits, series and actual-versus-forecast are modelled with care.
It is weaker as the thing you open several times a day:

1. **It does not say what needs you.** Bills to confirm, categories over limit and upcoming charges have to be found by
   scrolling and paging.
2. **Its numbers disagree on one screen.** "Expenses this month" appears as three different figures on the Overview,
   with no label telling which basis each block uses.
3. **Capture is a record editor.** A simple expense is about six taps and two keyboards, and the app remembers nothing
   from previous entries.
4. **Navigation spends daily slots on yearly tasks.** Plans is a tab; settings have no home; series have no place.
5. **The visual system has drifted.** Money has four styles, selection has three idioms, most phone controls are
   28–32 px, and each page has its own header, width and action placement.

## Owner answers (2026-11-17)

| Question | Answer | Consequence for this plan |
|---|---|---|
| How do card purchases get in? | Sent through Claude (MCP). | Claude is the main capture channel: MCP gaps (R9) move to the front; the in-app quick add (C1) matters less. The account statement also carries the card-bill payment, so today each card purchase is counted twice (once typed through Claude, once inside the bill payment): R3 becomes urgent. Card bill import (R5) loses priority. |
| Pool money or settle up? | Pool. | Settlement and a payer field (R15) are dropped. The per-person split is informational; member views on the Overview lose weight. |
| Do both import into the same plan? | Yes. | A Pix between the two appears in both statements, as an expense on one side and an income on the other, inflating both totals: another reason for R3. |
| What is "Saldo"? | Money in the accounts, with the divergence shown as untracked money. | R7 becomes **light accounts and balance alignment** (see below). Until then, the current figure is income − expenses and must be labelled as the month's result (B7). This answers the open questions of the "Balance alignment" idea in IDEAS.md. |
| Open to other people in 2027? | Not necessarily, but the product must be professional. A friend of the owner already uses it and asked for R17. | First-run work for strangers (category template, invite emails, plan currency) goes to Later. Defaults that any user would notice (device time zone and language, localized plan name) and quality standards (trash, accessibility, touch targets, change history) stay. |
| Drop Expense Items P3? | Yes. | Dropped from ROADMAP and STATE. P2 (quantity, itemized marker) is folded into C12 and S4 instead of being a feature of its own. |

## Principles for the refactor

1. **Answer first, record second.** Every screen opens on the answer to its question, then the detail.
2. **One number, one meaning.** A figure states its basis (actual, forecast, share) wherever it appears.
3. **Three taps for the common case.** The frequent path is short; the rare path is one step further, never in the way.
4. **Every figure opens its rows.** A total is a link to the transactions behind it.
5. **One pattern per job.** One money style, one page header, one form container, one row-action rule.

---

## Track 0 — Defects (fix before any redesign)

Small, independent fixes. None needs a design decision.

| ID | Defect | Evidence | Effort | Checked |
|---|---|---|---|---|
| B1 | Reloading on a non-default plan (`/overview?plan=3`) renders a blank page and the switcher falls back to the default plan. Probable cause: `PlanProvider` and `PlanFiltersGate` both set the active plan in the same effect pass and the default wins; the gate's effect never re-runs. Cause not yet confirmed by a test. | `app/providers/PlanProvider.tsx:28-44`, `app/routing/PlanFiltersGate.tsx:52-58` | S | run (twice) |
| B2 | Under the "Realizado" expense headline (6.127,37) the per-person legend sums to the forecast figure (7.586,27). Same for one member selected. | `features/overview/utils/summaryView.ts:66-75` uses `person.expense`; the API already returns `actualExpense` | S | shot + code |
| B3 | "Outra pessoa" with no person picked saves the expense as the creator's, with no error. | `features/transactions/components/transactionForm.ts:370-374`; no schema check for `SOMEONE` | S | code |
| B4 | Stepping with the period arrows stores an absolute range. After ‹ then ›, the screen stays pinned to that month forever (saved without expiry); in December it still opens on November. | `utils/periodParams.ts:28-33`, `utils/period.ts:59-70` | S | code |
| B5 | The clear (X) button on the required date field blanks the input while the form keeps the old date. | `features/transactions/components/TransactionFormDrawer.tsx:230` | S | lens |
| B6 | Phone rows never show the series marker; an empty list still shows a pager; "restam R$ 1,22 · 100%" (rounding). | `TransactionMobileList.tsx:46,133-138`, `spendingRows.ts:114` | S | shot + lens |
| B7 | The card labelled "Saldo" is income − expenses for the period (`DashboardService.java:58-70`), but the owner reads "Saldo" as money in the account. Relabel it as the period result ("Resultado") until R7 provides a real balance. | owner answer, code | S | code |

---

## Track 1 — Overview that answers the questions

Questions the screen must answer: am I OK this month, where did it go, what is still coming, who spent it, how are we trending.

| ID | Change | Why | Backend | Effort | Reversible |
|---|---|---|---|---|---|
| O1 | One basis per block, labelled. Category rows show actual as the solid bar and forecast as a paler tail. | Today cards are actual (6.127), category rows are forecast-inclusive and exclude uncategorised (7.442), totals are forecast (7.586). "restam R$ 375" is silently after-forecast. | Add `actualSpent` to `CategorySpendingResponse` and its member rows | M | easy |
| O2 | Two heroes, in this order: **money in the accounts** with the untracked gap (once R7 lands), then the **forecast month-end result** with "realizado até hoje" as secondary. Add one **budget line**: committed versus the sum of limits, plus "ainda por vir". Before R7, only the month result shows, labelled as such (B7). | The current hero (actual result, called "Saldo") is inflated mid-month and only falls. In the seeded month the plan is already over its total budget on day 17 and nothing says so. | None for the month result; R7 for the balance | S–M | easy |
| O3 | **Attention block** at the top: to confirm (overdue first), categories over or near limit, next 7 days. Each line opens the filtered list. Hidden when empty. | The daily entry point is missing. ROADMAP M2's goal was "see upcoming bills and money-left in the dashboard". | `status` in `TransactionFilter`, or a small `/dashboard/upcoming` | M | easy |
| O4 | Sort categories by severity (over, near, then by spend). On phone show those plus the top few, "ver todas" expands. | Sorting is alphabetical (`spendingRows.ts:280`); the worst rows (Saúde 243%, Transporte 134%) are two screens down. | None | S | easy |
| O5 | **Pace**: a "today" tick on each bar at elapsed-days ÷ days-in-month, and "R$ X/dia até o fim". | Warning is a fixed 80% of the limit (`CategoryUsageCalculator.java:18`): paid rent raises a warning, a variable category at 60% on day 5 does not. | None for the tick | S | easy |
| O6 | Trend becomes **monthly columns**: expense column (solid actual + pale forecast for the current month), an income marker per month, net as a label. Omit months before the data began. Extend 2–3 months forward. | Smoothed lines imply a ramp between months; pre-data months show as R$ 0; the current month's forecast looks closed. The forward months are already materialised. | `actualIncome`/`actualExpenses` in `MonthlyTrendResponse` | M | easy |
| O7 | "Sem categoria · N" row linking to the filtered list. | Category query excludes null categories (`CategorySpendingRepository.java:22`), so the list does not reconcile with the cards. | Uncategorised aggregate + filter option | M | easy |
| O8 | **Drill-down**: every category row and summary figure opens Transactions with category, member and period set. Expand moves to the chevron. | Nothing on the Overview navigates anywhere. The URL params already exist. | None | S | easy |
| O9 | Limits, status and hatching only for month-aligned ranges; N whole months are labelled "(N meses)". | Limit is multiplied by calendar months touched (`CategoryUsageCalculator.java:25-31`): a 12-day range across two months gets 2× the limit. | None | S | easy |
| O10 | Over-limit encoding: limit is always the full track; overflow is a separate short bar scaled to over ÷ limit. | Every over-limit row is 100% full, so R$ 37 over and R$ 570 over look the same. | None | M | easy |
| O11 | With a member selected, that member's amount is the row's primary number; rows where they spent 0 are hidden. | Cards switch to the member, rows keep the household total. | None | S–M | easy |
| O12 | "vs. mês anterior" on the expense total; later per category. | "Is this month unusual?" has no answer. | None for the total | S–M | easy |
| O13 | **Colour roles**: red only for over-limit and negative results; income and expense totals in foreground colour. Hatch becomes a neutral stripe. | Red means expense, over-limit and (nearly) member 2. A normal expense total looks like an alarm. | None | S | easy |
| O14 | Label the per-person split as each one's **share** ("parte de cada um") and move it below the category list. | It reads as "who paid"; the model has shares only, no payer. The owners pool money, so it is information, not a decision driver. | None | S | easy |

---

## Track 2 — The daily loop: capture, confirm, find, fix

| ID | Change | Why | Effort | Reversible |
|---|---|---|---|---|
| C1 | **Amount-first quick add with memory.** Opens on the amount keypad; six category chips by recent use; description autocomplete that prefills category and attribution; type, date, items, attribution and recurrence collapsed behind "Mais detalhes" with a one-line summary. Target: +, digits, chip, save. | Six taps, two keyboards, alphabetical category list, nothing remembered. Needs a decision on optional description. | M (L with a suggestions endpoint) | easy |
| C2 | Attribution as member chips: "Eu · Marina · Dividir". | Removes the two-step "Outra pessoa" + one-option combobox, and the cause of B3. | S | easy |
| C3 | "Salvar e nova"; success toast with **Desfazer** and **Editar**; optimistic insert. | Three purchases cost three full round trips; a wrong tap means find, open, fix, save. | S–M | easy |
| C4 | Date: tapping the field opens the calendar on touch; chips "Hoje · Ontem · Anteontem"; no clear button on a required date. | The calendar hides behind a 24 px icon and the field raises the alphabetic keyboard. | S | easy |
| C5 | Recurrence as a three-way control under the date: "Única · Mensal · Parcelada". For Parcelada, "valor total / valor da parcela" with a live echo ("6× de R$ 300,00 · última em abr/2027"). Confirmation default per kind. | The checkbox is off-screen; the amount silently means per installment; "exige confirmação" defaults on for fixed-price subscriptions. | S–M | easy |
| C6 | **Confirmation made visible**: badge "A confirmar" in the warning tone (plain "Previsto" for automatic ones); a labelled "Confirmar" button; status filter; a dot on the Transactions tab; confirm date defaults to today when the due date passed. | The control is a muted check that reads as "done"; "Previsto" covers three different states. Pairs with O3. | M | easy |
| C7 | **Occurrence-first edit**: tapping a series row edits that occurrence (with date and amount); a control at the top switches scope ("Só esta · Esta e as seguintes · Todas"). | Today the sheet is titled "Editar série", has no date, and asks scope only after Salvar. Moving one occurrence's date needs backend support. | M | easy (UI) |
| C8 | **Finding**: on phone, progressive loading in place of the pager; search scope chip ("em novembro · tudo"); sort in the filter sheet; day totals in the day headings. | 10 rows per page (`transactionParams.ts:24`) means four page turns for one month; search is silently limited to the visible month. | M | easy |
| C9 | **Uncategorised queue and bulk actions**: a "Sem categoria (n)" chip; a review queue (card, suggested chips, save and advance, "apply to all with this description"); long-press selection with Categoria, Atribuir, Excluir. | After an import every row is uncategorised: about four taps per row with no filter to isolate them. | M–L | easy |
| C10 | **Import review step** before commit: each row is new, already imported, looks like a manual entry (skipped by default) or confirms a forecast; suggested category; "Importar 23 · ignorar 5"; batch id so an import can be undone. | One tap on an unlabelled icon writes N rows with no preview; manual entries and forecasts are double counted. | L | needs migration (batch id) |
| C11 | Exact split: with two people the second share is the remainder; with more, a live "faltam R$ x". | The user does the arithmetic and is told only on submit. | S | easy |
| C12 | Items as their own step: description + amount rows inheriting the parent category, "next" appends a row, total is the running sum unless typed. | About five interactions per line and the total must be known first. | M | easy |
| C13 | PWA: refetch on resume and pull-to-refresh; a one-time install banner; manifest shortcuts ("Nova transação", "A confirmar"). Offline create queue later. | `refetchOnWindowFocus` is off (`queryClient.ts:7`), so the partner's entries do not appear on resume. | S (queue: L) | easy |
| C14 | Categories: "+ subcategoria" row under each root on phone; pickers ordered by use; archive a category keeping its history. | Subcategory creation is hidden inside the parent's edit sheet; a category can only be deleted. | S (archive: M) | archive needs migration |
| C15 | Empty states with a next step, and "filtered to nothing" told apart from "no data yet" (with "Limpar filtros"). | A new plan shows three screens of zeros. | S | easy |

---

## Track 3 — Structure and navigation

| ID | Change | Why | Effort | Reversible |
|---|---|---|---|---|
| N1 | **[reverses M5-09]** Replace the Plans tab with **"Mais"**: current plan (members, invitations, rename, transfer, archive), my plans, import, account (name, time zone, language, theme, logout), connector (MCP), version. The avatar becomes a shortcut to it. | A quarter of the phone's navigation goes to yearly tasks, and settings are split over the avatar menu, a navbar icon and a tab. Connector management has nowhere to live. Cost: one more tap to reach members. | M | easy (keep `/plans` as a redirect) |
| N2 | **[reverses filter-persistence]** Share the **period** between Overview and Transactions per user and plan; other filters stay per screen. | The two screens can show different months under an identical navigator. Cost: no more "Overview on six months while the list stays on this month". | M | easy |
| N3 | **Recurring view**: each series once, with amount, next date, "3/10", remaining total and end month. Starts as a toggle on Transactions. | "What are my fixed commitments, when do installments end" has no answer. | M–L (needs a series list endpoint) | easy |
| N4 | Edit a limit from the Overview row. Later, consider moving Categories under "Mais". | The same tree appears twice (limits on one tab, spend on the other) with no link. | S (move: M) | easy |
| N5 | **One page shell**: a single header contract (title as `h1`, context slot, actions slot) and one content width. | Three of four pages have no heading; the content edge jumps from 1408 px to 736 px between tabs. | S | easy |
| N6 | One filled primary per screen (the global add); page-level creates are outline in the header slot. | Categories shows two amber buttons 60 px apart; on phone the reachable "+" creates a transaction while the page is about categories. | S | easy |
| N7 | **Overlay rule**: anything with inputs uses the form sheet; centred dialogs are for confirmations only. Filters, invite, plan name, time zone and language move to the sheet. Excluir and Duplicar move to a "⋯" menu in the sheet header. | Three overlay patterns for the same task; a five-field filter popover at 390 px; four stacked buttons with Excluir in the thumb zone. | M | easy |
| N8 | One row-action rule: an always-visible "⋯" on desktop tables, a chevron on tappable phone rows, plan actions as a labelled menu. | Hover-only actions on desktop, unlabelled icon trio on Plans, no tap cue on phone category rows. | S–M | easy |
| N9 | Desktop: cap content near 1200 px; Overview in two columns at `lg`; fixed table column widths; Saldo first on both sizes. | At 1440 px the layout is a stretched phone column: bars 1360 px wide, amount far from its label. | M | easy |

---

## Track 4 — Design system

System-level moves; each one removes a class of inconsistency.

| ID | Move | Why | Effort |
|---|---|---|---|
| S1 | **One `Money` component** (proportional typeface, tabular figures, true minus, `sign` and `tone` props, right-aligned columns). Replaces both `Amount` components and raw `formatMoney` call sites. | Money has four looks; two components are both named `Amount` (`components/amount/Amount.tsx`, `CategorySpendingList.tsx:102`); the mono "- R$" does not align in columns. | M |
| S2 | **Touch tier in the primitives**: 44 px hit area below `sm`, applied inside button, toggle and input variants. | Sizes top out at 40 px; `sm` is 28 px, icon 32 px (`buttonVariants.ts`). Confirm sits next to edit, archive next to rename. | M |
| S3 | **Focus and field contrast**: a `--focus` token at ≥ 3:1, darker `--input` border, focus style on every row button, a global reduced-motion block. | Focus ring is amber at 50% (about 1.4:1 on paper); field borders about 1.4:1; no reduced-motion handling anywhere. | S |
| S4 | **Three badge families**: `status` (tinted, with icon), `tag` (outline, categories only), `meta` (role, count, series). One shared badge row for table and phone list. | A forecast marker and a category look identical; "Pending" is built with a class override. | S |
| S5 | **Member colour scale** re-picked by lightness and hue, no green, ≥ 3:1 against card and against the overflow pattern; avatars tinted with the member colour. | Member 2's pink sits beside the red hatch (about 1.6:1); member 3 is green like income; the scale wraps at seven. | M |
| S6 | **Two selection idioms**: a joined segmented control for form choices, chips for filters, one `--selected` token. Underline stays for navigation only. | Selected means amber tint, black fill or underline depending on the screen; unselected options look disabled. | M |
| S7 | **`StateBlock`** for empty, error and loading, with an optional action. | Empty states are bare sentences at ad-hoc heights; Plans uses a spinner where others use skeletons; a failed query looks like endless loading. | M |
| S8 | **Surface ladder** (page, card, overlay), one field background rule, three radius values, two shadow steps, no bordered box inside a card. | Dialogs sit on paper and popovers on card; card versus page is 1.07:1; five radius values in use. | M |
| S9 | `IconButton` with a required label and automatic tooltip; at most one icon-only action per group on phone. | Labels exist for assistive tech but nothing is visible; the tooltip primitive is unused. | S–M |
| S10 | Tokens: add `--info`, semantic series tokens, `--overflow-pattern`; delete the unused chart ambers, sidebar and serif tokens. | The next status or chart would be improvised. | S |
| S11 | Type scale: add a 20 px step and a numeric flag; no information-bearing number below 14 px. | The scale jumps from 16 to 24 px; phone headline figures are label-sized. | S |
| S12 | One `FormActions` (primary position, cancel style, destructive slot) for dialog, sheet and popover. | Primary and destructive actions move between containers. | S |
| S13 | **Brand**: SVG mark and wordmark, the dragon in empty and success states, iOS splash screens. | Logged in, the product is anonymous; the only voice is on the 404. | M |

All of Track 4 is easy to reverse: tokens and components, no stored data.

---

## Track 5 — Roadmap proposals

Status is against ROADMAP.md and IDEAS.md.

| ID | Feature | Problem it solves | Status | Size | Notes |
|---|---|---|---|---|---|
| R1 | **Trash** (soft delete, 30-day restore) | Delete is physical (`TransactionService.java:291`) and a transaction has no timestamps. One wrong tap, by a person or by Claude, is recoverable only from a database dump. | planned, re-prioritise | M | 1.0 criterion "data safety". Every read must filter it. Unlocks MCP delete. |
| R2 | CSV export of a range | No user-level way out. | planned | S | |
| R3 | **Neutral movements** (transfer between the owners, card-bill payment, savings move) | Only CREDIT and DEBIT exist. With card purchases sent through Claude and both statements imported into one plan, each card purchase counts twice (the purchase and the bill payment) and each Pix between the owners counts as both expense and income. | new, **urgent** | M | Migration plus every aggregate. The importer proposes it (bill payment text, a Pix whose counterpart is a plan member); the user or Claude confirms. Phase 1 of R7. |
| R4 | **Category memory** from history | Every imported row is categorised by hand. | planned, re-prioritise | M | Deterministic: same bank text, last chosen category. Mark as suggested. Feeds C9, C10 and the MCP. |
| R5 | **Card bill import** with invoice cycle | The owner sends card purchases through Claude, but the external user types them by hand and wants to import the bill instead (2026-11-17). The importer detects card bills only to reject them (`CardBillDetector`). | paused (M4-09), **raised** | L | Built on the import review step (C10) so each row can be categorised and attributed (to him or to a contact) before commit. Installments ("Parcela 3/6") must not duplicate across bills. Later a reconciliation source for the card account of R7. |
| R6 | Match imported rows to forecasts and installments | Double counting; manual confirmation of what the bank already proves. | paused | M–L | Propose, never auto-merge. |
| R7 | **Light accounts and balance alignment** | The owner reads "Saldo" as money in the account and wants the gap shown as untracked money. Today there is no account, no opening balance and no way to state the real balance. | planned as an idea ("Balance alignment"), **re-scoped** | L | See the design sketch below. Phase 1 is R3. |
| R7b | Forward view of the next months | "How much will we have in February" cannot be answered. | planned | S chart (O6), M projected balance after R7 | |
| R8 | Yearly recurrence | IPVA, IPTU, insurance, annual subscriptions. | planned (M4-08, narrowed) | S–M | Weekly and biweekly are not worth it. |
| R9 | **MCP as the capture hub** | Claude is the main capture channel. `update_transaction` cannot set a category, `create_transaction` cannot attribute, split or add items, lists have no uncategorised or to-confirm filter, and there is no delete. | partly planned, **first** | M | Delete after R1. Account and kind parameters after R3/R7. |
| R10 | Reimbursements linked to an expense | A repayment logged as income inflates both sides. | planned | — | **Merged into R17.** |
| R17 | **People outside the plan and money to receive** | Requested by an external user (2026-11-17): he shares a credit card with his parents, pays the bill and needs to know which purchases were theirs so he can charge them. Today a share can only go to a plan member with an account. The same mechanism covers the owner's own "Reimbursements" idea (a sister's gym plan, a friend's half of a pizza). | new, **requested by a user** | M–L | After R3. See the sketch below. |
| R11 | Push reminders (bill due, limit crossed) | Nothing prompts the user. | planned (M4-06) | M | After O3. iOS: installed PWA only. |
| R12 | Professional defaults: device time zone and language at sign-up, localised default plan name | A new user gets a plan called "My plan" in São Paulo time. | new | S | The pending time-zone discussion. |
| R12b | Opening to others: category template, invite emails, plan currency | Needed only when strangers sign up. | new + planned | M | Later. |
| R13 | Change history per transaction | In a shared plan nobody can tell who changed an amount, and Claude now writes too. | new | M | After R1. |
| R14 | Year table (category × month), comparisons with the average | "Is this month unusual?" | new | S–M | A limit is one value for all time, so changing it rewrites past months. |
| ~~R15~~ | ~~Settlement with a payer field~~ | Dropped: the owners pool money. | | | |
| R16 | Personal token and quick-add endpoint for iOS Shortcuts | Capture at the moment of paying. | new | M | Lower now that Claude is the capture channel. |

### R7 design sketch (for the spec, not decided)

- **Account**: name, kind (`CHECKING`, `CARD`, `CASH`), optional owner member, belongs to a plan.
- **Transaction gets an optional account.** Imports set it from the statement; Claude sets it ("no cartão da Marina");
  the app form offers the last one used.
- **Card purchases are expenses on the card account**: they count in the month's spending on the purchase date but do
  not reduce money in the checking accounts. The bill payment is a **transfer** checking → card (R3), so it no longer
  counts as an expense.
- **Balance checkpoint**: "real balance of account A on date D". The Nubank account CSV has no balance column
  (`NubankAccountStatementParser.java:30-31`), so it is typed, in the app or through Claude ("saldo hoje 3.200").
- **Expected balance** = last checkpoint + movements after it. At the next checkpoint, **untracked = real − expected**,
  shown per period and never turned into a fake transaction.
- **Overview hero**: sum of checking (and cash) balances, the untracked gap since the last checkpoint, and the open
  card bill, so "money minus what the card already owes" is visible.
- Not double-entry: no ledger, no chart of accounts, no balancing of every row. Transactions without an account stay
  valid and count in spending; they only stay out of the balance.
- Cost: migration (account table, nullable `account_id`, transfer kind), every aggregate reviewed, new screens under
  "Mais". Reversal is expensive once people record checkpoints, so the spec must settle the model first.

### R17 design sketch (for the spec, not decided)

- **Contact**: a person in the plan with a name and no login (for example "Pai", "Mãe"). A contact can later be linked to
  a real member if they ever sign up.
- **A share can go to a member or to a contact.** "Eu · Pai · Mãe · Dividir" in the form and in Claude ("a farmácia foi
  da minha mãe").
- **A contact's share is not the plan's spending.** It stays out of expenses, category totals and limits, and adds to
  "a receber de Mãe". Otherwise the parents' purchases would blow the friend's budget and limits every month.
- **Two contact modes** (the user confirmed both are needed): **to charge** (parents: share is not spending, adds to money
  to receive) and **dependant** (child, pet: share *is* plan spending, attributed to them so per-person views show it,
  nothing to receive).
- **Repayment** is a neutral movement (R3) linked to a contact: the Pix from the parents lowers what they owe and is not
  income. Parents pay in parts and sometimes all at once, so a repayment is **not linked to specific purchases**: it lowers
  the running balance. "Quitar" records exactly the amount still owed.
- **Per-contact statement**, grouped by month or card bill: purchases, repayments and the balance owed. Repayments are
  applied to the oldest open period for display only ("outubro quitado, novembro faltam R$ 300"), a derived view with
  no stored link. A text ready to send, in the app and through Claude ("quanto meus pais me devem?").
- **Attribution memory**: the same bank text that was attributed to a contact before is suggested for them again (extends
  R4 from category to attribution), so an imported bill is mostly pre-sorted.
- With R7, money to receive appears next to the account balance, so the parents' purchases do not look like untracked money.
- Open for the spec: how a series assigns contacts; whether a purchase can be split between him and a contact (likely
  yes, through the existing split modes).
- Cost: migration (contact table; participant points to exactly one of member or contact, also for series), every
  aggregate reviewed, a contacts screen under "Mais", MCP parameters. The new columns are additive; what is costly to
  undo is the rule "a contact's share is not spending", so the spec settles it first.

**Do not build** (opinion of the survey): Open Finance and per-bank parsers; double-entry bookkeeping (R7 stays light);
envelope rollover, goals, investments, net worth; multi-currency conversion; backend OCR or a classifier (Claude reads
receipts); WhatsApp or Telegram bot, native app, widgets; tags, attachments, comments, activity feed; settlement between
plan members (receivables from people outside the plan are R17).
**Expense Items P3 is dropped** (owner, 2026-11-17).

---

## Suggested sequence

Revised after the owner answers (2026-11-17). Maintenance already queued (Dependabot majors, release tags, production
database password rotation, the first-connect MCP 403) runs alongside and does not block any phase.

| Phase | Contents | Why here |
|---|---|---|
| 0. Correctness | B1–B7 | Wrong numbers and labels cost trust; all are small and need no decision. |
| 1. Truthful totals | R1 trash, R3 neutral movements, R9 MCP gaps (category on update, filters, items, attribution, delete through the trash, kind) | Totals are distorted today by card bill payments and Pix between the owners, and Claude is the capture channel. Redesigning screens over wrong numbers would be wasted work. |
| 2. Foundations | S1, S2, S3, S4 (absorbs the P2 itemized marker), S10, S11, N5, N6, R12 | Every later screen uses money, touch sizes, badges and the page shell. |
| 3. People and imports | R17 contacts and money to receive; then C10 import review with R4 category and attribution memory; then R5 card bill import on top of it | The external user's whole flow: import the bill, sort his purchases from his parents', charge them. R17 changes the participant model every aggregate reads. The review step is built once and serves both statement formats. |
| 4. Accounts | R7 light accounts and balance alignment | Gives the Overview its real hero; card bills from R5 and transfers from R3 already exist. |
| 5. Overview | O2 with the balance hero, O1, O3 + C6, O4, O5, O6, O7, O8, O9, O13, O14 (now also showing dependants and money to receive) | One redesign with the final data in hand instead of two. |
| 6. Daily flows | C9 with bulk attribution, R6, C7, C8, C2, C4, C11, C15, then C3, C5, C12 (absorbs P2 quantity), C13, C14 | Categorizing and confirming what Claude and the imports bring in, before polishing in-app capture. |
| 7. Structure | N1 "Mais" (also hosts contacts and accounts), N2, N7, N8, N9, N4, N3 | The two reversals of earlier decisions, made once the new screens exist. |
| Later | C1 quick add, R7b, R8, R11, R13, R14, R2, R12b, R16, S5–S9, S12, S13 | By value; R2 and R13 before calling it 1.0. |

Phase 2 can run in parallel with phase 1 (frontend versus backend). Phases 3 and 4 are the largest; if phase 4 slips,
phase 5 can ship with the month-result hero and gain the balance later.

## Decisions for the owner

One topic per round, in this order:

The product questions were answered on 2026-11-17 (see Owner answers). Remaining topics, one per round, in phase order:

1. **Neutral movements** (R3): which kinds exist, how the importer proposes them, how Claude marks them. Includes the
   repayment kind that R17 needs.
2. **Contacts and money to receive** (R17): the "not spending" rule, the two modes, repayments and the per-contact
   statement. Worth checking the sketch with the friend who asked for it.
3. **Import review** (C10, R4, R5): row states, suggestions, attribution during review, undo of a batch.
4. **Accounts model** (R7): which account kinds, per-member or shared, how often a checkpoint is asked for.
5. **Overview hero and colour roles** (O2, O13).
6. **Confirmation vocabulary and defaults** (C6, C5): "A confirmar" versus "Previsto"; when a series should require
   confirmation.
7. **Navigation** (N1): "Mais" in place of Plans; where Categories, contacts and accounts live (N4).
8. **Shared period** (N2).
9. **Quick add shape** (C1, C5): amount-first, optional description, what stays behind "Mais detalhes".

## Keep

- Global add from every screen, role-gated, returning to where you were.
- Plan, period and filters in the URL, saved per user, plan and screen.
- ATM-style currency input with the numeric keypad.
- One source for category spending shared by Overview and Categories.
- Over-limit shown with icon and text, never colour alone; status never invented per member against a shared limit.
- Token discipline: every colour through variables with light and dark parity; all text through `Heading`/`Text`.
- Warm paper, amber and Space Grotesk as the identity; the dragon voice of the 404 as its seed.
- Equal split in one tap; inline "create category" in the picker; confirm dialog prefilled with the forecast amount.

## Evidence

Screenshots and lens reports were produced in a session scratchpad and are not kept in the repo. They can be
regenerated by seeding a local database through the API and capturing the routes with Playwright.
