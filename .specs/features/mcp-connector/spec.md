# Claude MCP Connector — Specification

**Approved**: 2026-11-08 - user: "Manda bala fi, pode ser assim"

> ROADMAP M5-05. Decisions from the discuss pass (2026-11-07) are recorded in `.specs/STATE.md` § Handoff
> and in the Assumptions table below.

## Problem Statement

Recording a purchase means opening the app, finding the form and typing it in, so small expenses get
recorded late or never; the planned WhatsApp capture channel was dropped for this one. A remote MCP
server lets the user add, confirm and correct transactions, and ask about the plan, by talking to Claude
(mobile app, claude.ai, Claude Code), with the same rules and permissions as the app.

## Goals

- [ ] A purchase said to Claude in one sentence ("gastei 42 no posto") is stored in the right plan and
      category, with no app screen opened.
- [ ] Paying a forecast transaction from chat confirms that forecast with the real amount and date and
      never leaves a duplicate actual next to it.
- [ ] No tool call reads or changes data the same user could not read or change in the app.
- [ ] The connector is added in claude.ai once, with the user's Findraco sign-in, and keeps working
      without signing in again while it is used at least every 30 days.

## Out of Scope

| Feature | Reason |
| ------- | ------ |
| Deleting transactions | Backend delete is physical, no trash; user wants edit/delete questions settled first (soft delete is the candidate prerequisite). ROADMAP |
| Creating, editing or deleting series, recurrences and installments | Series reconcile carried the AD-025 data-loss cases; an installment purchase is a series. ROADMAP |
| Splitting a transaction between members | A wrong split keeps the total right, so the error stays silent; done in the app (user, 2026-11-07) |
| Editing category, type, status, items or participants | P2 covers amount, effective date and description only |
| Categories, plans, members, invitations | Configuration, rarely done, better on screen |
| CSV import, trend report | `list_transactions` and `get_month_summary` cover the chat questions |
| Sign in with Google | Separate feature (Findraco as OAuth client); it would plug into the same login page |
| "Connected apps" screen with per-client revoke | See Assumptions; revoke goes through the password reset for now. ROADMAP |
| A status filter on `list_transactions` | The list endpoint has no status filter; each row carries its status |
| Separate MCP service or subdomain | Hosting decision: inside the backend, reversible without changing the contract |

---

## Assumptions & Open Questions

| Assumption / decision | Chosen default | Rationale | Confirmed? |
| --------------------- | -------------- | --------- | ---------- |
| Write scope | Read + create + confirm (P1) + edit amount/date/description of one transaction (P2); no delete | User decision | y |
| Auth | OAuth 2.1 with the backend as authorization server (Spring Authorization Server), authorization code + PKCE `S256` | claude.ai and mobile connectors take only OAuth or none; reuses the existing accounts and sessions | y |
| Client registration | Client ID Metadata Documents (CIMD): a `client_id` is one of the allowlisted HTTPS URLs (claude.ai's and Claude Code's metadata documents), fetched and validated; Dynamic Client Registration off | Claude prefers CIMD when advertised; the MCP spec deprecates DCR; no open registration endpoint (user, 2026-11-08, AD-026) | y |
| Token lifetimes | Access token 15 minutes; refresh token rotating, 30 days of inactivity, sliding | Same policy as the app sessions (`session-persistence`) | y |
| Revoking Claude's access | A password reset ends every grant of that user; no per-client revoke screen yet | Same rule as app sessions; keeps the feature to no new settings screen | y |
| Scope | One OAuth scope, `findraco.mcp`, granting every tool in this spec | A single connector with a fixed tool set; finer scopes add nothing for one client | y |
| Plan selection | Optional `plan` parameter (name or id) on every plan-scoped tool, plus `list_plans`; omitted → the user's default plan | User decision | y |
| Plan name match | Case- and accent-insensitive exact match over the user's active (non-archived) plans | Natural speech; an archived plan is not a working plan | y |
| Hosting | Inside the Spring backend, `/mcp` over Streamable HTTP, own `mcp` package, tools as thin adapters over existing services; nginx routes `/mcp`, `/oauth2/` and `/.well-known/` on the same domain | User decision; reversible to a separate service without changing the URL or tools | y |
| Split | Never set by Claude: a created transaction is paid in full by its creator | User decision | y |
| Installments | Not created by Claude | User decision (an installment purchase is a series) | y |
| Category | By name, same match rule as plans; omitted → uncategorized (the backend allows it); unknown name → error with the plan's category names | User decision for unknown names; uncategorized matches the app's create; Claude normally picks one from `list_categories` | y |
| Reader's "today" | The user's saved time zone (`users.time_zone`, AD-025): already captured from the device on every app request in automatic mode, or pinned in the profile | User: a fixed Brazilian zone does not fit a global app; the app already stores it, so tool calls read it | y |
| Idempotency | No dedup key; a repeated `create_transaction` creates a second row | MCP clients do not retry tool calls on their own; a duplicate is one row to delete in the app | y |
| Rate limit | 60 tool calls per minute per user through the existing `RateLimiter` | Far above chat use; bounds a looping client | y |
| Response language | Tool descriptions and error messages in English; Claude phrases them to the user | Claude translates; keeps one set of messages, same as the API | y |

**Open questions:** none — every row confirmed by the user on 2026-11-08.

---

## User Stories

### P1: Connect Claude to Findraco ⭐ MVP

**User Story**: As a Findraco user, I want to add Findraco as a connector in Claude with my own sign-in
so that Claude acts on my plans and nobody else's.

**Why P1**: Nothing else works without it.

**Acceptance Criteria**:

1. The system SHALL publish OAuth protected-resource metadata (RFC 9728) for `/mcp` and authorization-server metadata (RFC 8414) under `/.well-known/` on the app's domain.  <!-- ubiquitous -->
2. WHEN a request to `/mcp` carries no access token or an invalid or expired one THEN the system SHALL respond `401` with a `WWW-Authenticate` header that points to the protected-resource metadata.  <!-- event-driven -->
3. WHEN an authorization request carries an allowlisted `client_id` URL THEN the system SHALL fetch its metadata document and accept only the redirect URIs it lists.  <!-- event-driven -->
15. IF a `client_id` is not an allowlisted URL, or its metadata document is unreachable, invalid, or names a different `client_id` THEN the system SHALL refuse the request with error `invalid_client`.  <!-- unwanted-behavior -->
16. The system SHALL offer no dynamic client registration endpoint.  <!-- ubiquitous -->
4. WHEN the authorization endpoint is opened by a user who is not signed in THEN the system SHALL show the Findraco sign-in form before the consent page.  <!-- event-driven -->
5. WHEN a signed-in user reaches the consent page THEN the system SHALL show the client's name, its redirect host and what it may do (read plans, categories and transactions; create, confirm and edit transactions), with "Allow" and "Deny".  <!-- event-driven -->
6. WHEN the user chooses "Allow" THEN the system SHALL redirect to the client with an authorization code that is valid for one use within 60 seconds.  <!-- event-driven -->
7. WHEN the user chooses "Deny" THEN the system SHALL redirect to the client with error `access_denied` and issue no code.  <!-- event-driven -->
8. IF an authorization request lacks a PKCE `S256` code challenge THEN the system SHALL refuse it with error `invalid_request`.  <!-- unwanted-behavior -->
9. WHEN a valid code is exchanged with the matching PKCE verifier THEN the system SHALL issue an access token valid for 15 minutes and a refresh token.  <!-- event-driven -->
10. WHEN a refresh token is used THEN the system SHALL issue a new access token and a new refresh token and invalidate the one used.  <!-- event-driven -->
11. IF a refresh token was not used for 30 days THEN the system SHALL refuse it with error `invalid_grant`.  <!-- unwanted-behavior -->
12. IF an already-used refresh token is presented THEN the system SHALL refuse it and revoke every token of that grant.  <!-- unwanted-behavior -->
13. WHEN a user resets their password THEN the system SHALL revoke every MCP grant of that user, so their refresh tokens fail and no new access token is issued.  <!-- event-driven -->
14. The system SHALL accept MCP access tokens only on `/mcp` and SHALL refuse them on `/api/` with `401`.  <!-- ubiquitous -->

**Independent Test**: Add the connector in claude.ai, sign in, allow; Claude lists the tools. Deny once and see the connector fail to connect.

---

### P1: Read plan data from chat ⭐ MVP

**User Story**: As a user, I want to ask Claude about my plans, categories, transactions and month so
that I get answers without opening the app.

**Why P1**: Finding the forecast to confirm and the category to use depends on reading; it also answers the daily "how am I doing" questions.

**Acceptance Criteria**:

1. WHEN `list_plans` is called THEN the system SHALL return the caller's active plans with id, name, the caller's role and which one is the default.  <!-- event-driven -->
2. WHEN a plan-scoped tool is called without `plan` THEN the system SHALL act on the caller's default plan.  <!-- event-driven -->
3. WHEN a plan-scoped tool is called with `plan` THEN the system SHALL resolve it as an id or as a case- and accent-insensitive exact name among the caller's active plans.  <!-- event-driven -->
4. IF `plan` matches no active plan of the caller THEN the system SHALL return a tool error that lists the caller's plan names and SHALL read or change nothing.  <!-- unwanted-behavior -->
5. IF `plan` matches two or more of the caller's plans by name THEN the system SHALL return a tool error that lists the matching plans with their ids.  <!-- unwanted-behavior -->
6. The system SHALL check the caller's membership and role in the resolved plan on every call, with the same rules as the API.  <!-- ubiquitous -->
7. WHEN `list_categories` is called THEN the system SHALL return the plan's categories with id, name, parent name and monthly limit.  <!-- event-driven -->
8. WHEN `list_transactions` is called THEN the system SHALL return the plan's transactions filtered by the optional period, category, type and description text, newest first, at most 50 per call, each with id, description, amount, date, type, category name and status (`ACTUAL`, `FORECAST` or `PENDING`).  <!-- event-driven -->
9. WHEN `list_transactions` matches more transactions than it returns THEN the system SHALL say how many matched and how to fetch the next page.  <!-- event-driven -->
10. WHEN `get_month_summary` is called with an optional month THEN the system SHALL return that month's income, expenses, actual and forecast totals and the per-member breakdown, the current month when omitted.  <!-- event-driven -->
11. WHEN `get_category_spending` is called with an optional month THEN the system SHALL return each category's spending against its limit for that month, the current month when omitted.  <!-- event-driven -->
12. The system SHALL compute status, "today" and "current month" with the caller's saved time zone, as the app does.  <!-- ubiquitous -->
13. The system SHALL mark every read tool `readOnlyHint: true`.  <!-- ubiquitous -->

**Independent Test**: With two plans, ask Claude "quanto gastei com mercado esse mês no plano da casa?" and get the same number the app shows for that plan.

---

### P1: Capture and confirm transactions from chat ⭐ MVP

**User Story**: As a user, I want to tell Claude what I spent or received, or that I paid a forecast
bill, so that the plan stays current without opening the app.

**Why P1**: This is the capture channel, the reason for the connector.

**Acceptance Criteria**:

1. WHEN `create_transaction` is called with type, amount and description THEN the system SHALL create one transaction in the resolved plan, created by the caller and paid in full by the caller.  <!-- event-driven -->
2. WHEN `create_transaction` is called without a date THEN the system SHALL date it today.  <!-- event-driven -->
3. WHEN `create_transaction` is called with a category name THEN the system SHALL resolve it among the plan's categories by the plan-name match rule.  <!-- event-driven -->
4. WHEN `create_transaction` is called without a category THEN the system SHALL create it uncategorized.  <!-- event-driven -->
5. IF the category name matches no category of the plan THEN the system SHALL return a tool error that lists the plan's category names and SHALL create nothing.  <!-- unwanted-behavior -->
6. IF the amount is not positive, has more than 2 decimal places, or the description is blank or longer than 255 characters THEN the system SHALL return a tool error naming the field and SHALL create nothing.  <!-- unwanted-behavior -->
7. WHEN a transaction is created or changed THEN the system SHALL return it with id, description, amount, date, type, category name, status and the plan's name.  <!-- event-driven -->
8. The system SHALL offer no parameter for installments, recurrence, split, participants or items on `create_transaction`.  <!-- ubiquitous -->
9. WHEN `confirm_transaction` is called with a transaction id, the real amount and optionally the real date THEN the system SHALL confirm that transaction with them, the date defaulting to today.  <!-- event-driven -->
10. WHEN a confirmed amount differs from the forecast amount on an `EQUAL` split THEN the system SHALL recompute the shares, as the app's Confirm does.  <!-- event-driven -->
11. IF the transaction is not awaiting confirmation THEN the system SHALL return a tool error saying it does not take confirmation and that its date or amount can be edited instead.  <!-- unwanted-behavior -->
12. IF the caller's role may not change that transaction THEN the system SHALL return a tool error and SHALL change nothing.  <!-- unwanted-behavior -->
13. IF the transaction id belongs to no transaction of the resolved plan THEN the system SHALL return a "not found" tool error.  <!-- unwanted-behavior -->
14. The system SHALL mark `create_transaction` and `confirm_transaction` `destructiveHint: false`, and `confirm_transaction` `idempotentHint: true`.  <!-- ubiquitous -->

**Independent Test**: Say "paguei a conta de luz, deu 187" with a pending forecast "Luz" in the plan; Claude finds it, confirms it, and the app shows one actual "Luz" of 187 and no new row.

---

### P2: Edit a transaction's amount, date or description from chat

**User Story**: As a user, I want to correct the amount, the effective date or the description of a
transaction from chat so that a capture mistake or a bill paid on another day is fixed in place.

**Why P2**: The user wants editing right after capture; P1 works without it.

**Acceptance Criteria**:

1. WHEN `update_transaction` is called with a transaction id and any of amount, date and description THEN the system SHALL change only those fields of that one transaction and keep every other field as stored.  <!-- event-driven -->
2. WHILE the transaction is an occurrence of a series the system SHALL apply the change to that occurrence alone (scope `THIS_ONE`).  <!-- state-driven -->
3. IF `update_transaction` is called with none of amount, date and description THEN the system SHALL return a tool error and SHALL change nothing.  <!-- unwanted-behavior -->
4. WHEN the amount changes on a transaction split `EQUAL` THEN the system SHALL recompute the shares over the new amount.  <!-- event-driven -->
5. IF the amount changes on a transaction split `EXACT` THEN the system SHALL return a tool error saying its split is by fixed amounts and must be edited in the app, and SHALL change nothing.  <!-- unwanted-behavior -->
6. IF the new amount is smaller than the sum of the transaction's items THEN the system SHALL return the API's item-sum error as a tool error and SHALL change nothing.  <!-- unwanted-behavior -->
7. IF the transaction changed between the tool's read and its write THEN the system SHALL return a tool error saying it changed meanwhile and SHALL change nothing.  <!-- unwanted-behavior -->
8. IF the caller's role may not change that transaction THEN the system SHALL return a tool error and SHALL change nothing.  <!-- unwanted-behavior -->
9. The system SHALL mark `update_transaction` `destructiveHint: false` and `idempotentHint: true`.  <!-- ubiquitous -->

**Independent Test**: Create "Posto 42" from chat, say "na verdade foi 48, ontem"; the app shows one "Posto" of 48 dated yesterday.

---

## Edge Cases

- IF a tool call exceeds 60 calls in a minute for the same user THEN the system SHALL return a tool error saying to retry in a moment and SHALL run nothing.
- IF a tool receives an unknown parameter or a value of the wrong type THEN the system SHALL return a tool error naming the parameter.
- WHEN the default plan is archived or missing THEN the system SHALL return a tool error asking for a `plan` and listing the active plans.
- IF the caller left or was removed from a plan after connecting THEN the system SHALL refuse that plan on the next call, as the app does.
- WHEN a tool fails on an unexpected server error THEN the system SHALL return a generic tool error with no stack trace, and SHALL log it with the user id, tool name and a correlation id.
- The system SHALL log every tool call with user id, plan id, tool name, outcome and duration, and SHALL NOT log amounts or descriptions.

---

## Implicit-Requirement Sweep

| Dimension | Covered by |
| --------- | ---------- |
| Input validation & bounds | Capture 6, P2 3/5/6, Edge 2; list cap Read 8 |
| Failure / partial-failure states | Every write is one service call in one transaction: it changes all or nothing (Capture 5/6, P2 3–8) |
| Idempotency / retry | Assumption: no dedup on create; confirm/update idempotent (Capture 14, P2 9) |
| Auth boundaries & rate limits | Connect 1–14, Read 6, Edge 1/4 |
| Concurrency / ordering | P2 7 (version check); confirm uses the stored version the same way |
| Data lifecycle / expiry | Connect 6/9/11/13 |
| Observability | Edge 5/6 |
| External-dependency failure | N/A because the server calls no external service; Claude's side failing is the client's concern |
| State-transition integrity | Capture 11 (confirm only when awaiting confirmation), P2 2 (`THIS_ONE` only) |

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
| -------------- | ----- | ----- | ------ |
| MCP-01 | P1: Connect — metadata, 401 challenge (1–2) | - | Pending |
| MCP-02 | P1: Connect — sign-in, consent, code (4–8) | - | Pending |
| MCP-03 | P1: Connect — tokens, refresh, revoke, audience (9–14) | - | Pending |
| MCP-10 | P1: Connect — CIMD client validation, no DCR (3, 15–16) | - | Pending |
| MCP-04 | P1: Read — plan resolution and membership (1–6) | - | Pending |
| MCP-05 | P1: Read — categories, transactions, summary, spending (7–13) | - | Pending |
| MCP-06 | P1: Capture — `create_transaction` (1–8, 14) | - | Pending |
| MCP-07 | P1: Capture — `confirm_transaction` (9–14) | - | Pending |
| MCP-08 | P2: Edit — `update_transaction` (1–9) | - | Pending |
| MCP-09 | Edge cases — rate limit, errors, logging | - | Pending |

**Coverage:** 10 total, 0 mapped to tasks, 10 unmapped ⚠️

---

## Sources

- ROADMAP M5-05 — goal of the connector
- `.specs/STATE.md` § Handoff, 2026-11-07 — discuss decisions
- `TransactionController`, `CreateTransactionRequest`, `UpdateTransactionRequest`, `ConfirmTransactionRequest`, `Transaction.confirm` — existing write rules the tools reuse
- `.specs/features/session-persistence/spec.md` — token lifetime policy reused

## Success Criteria

- [ ] Over the first two weeks of use, every expense the user tells Claude lands in the right plan and category without opening the app.
- [ ] Zero duplicate actual rows from paying a forecast through chat.
- [ ] Zero tool calls that read or change data outside the caller's plans (integration tests per tool with a non-member and a viewer).
