# Filter Persistence Design

**Spec**: `.specs/features/filter-persistence/spec.md`

## Principles

1. **One source of truth: the URL.** Filter state is *derived* from `useSearchParams` on every render. No `useState` mirrors of filter values, no effects copying state back and forth (the main source of loops and double fetches).
2. **Storage is a write-through mirror**, never read during normal rendering. It is read only to *rebuild a URL* when home is opened without one.
3. **Restore happens before data hooks mount**, so no request is ever fired with default or stale-plan filters.
4. **Zero extra requests for names in the common case.**

## URL shape

Home state lives in the query string of `/`. Both tabs' state is present at once, so a tab switch only changes `tab` and never loses the other tab's filters (no storage round-trip for tab switches).

| Param | Owner | Example | Notes |
| ----- | ----- | ------- | ----- |
| `plan` | gate | `plan=3` | Plan the params belong to; guards against cross-plan ids (FPERS-08) |
| `tab` | Home | `tab=transactions` | Default `overview` |
| `period` | Overview | `period=last-3m` / `period=custom` | Preset token, stored relative (FPERS-06) |
| `periodFrom`, `periodTo` | Overview | `2026-09-01` | Only with `period=custom` |
| `overviewMember` | Overview | `overviewMember=7` | |
| `type` | Transactions | `DEBIT` | |
| `category`, `member` | Transactions | `12`, `7` | Ids only |
| `from`, `to` | Transactions | `2026-10-01` | |
| `min`, `max` | Transactions | `50.00` | |
| `q` | Transactions | `mercado` | Debounced 400 ms (existing) |
| `sort` | Transactions | `amount.desc` | |
| `size` | Transactions | `25` | |

Default values are omitted from the URL. Page number stays in component state (not in URL, not remembered — spec Out of Scope).

## Components

### `homeFilterParams.ts` (pure, no React) — `features/home/filters/`
- `parseOverviewFilters(params)`, `parseTransactionFilters(params)`: typed state; any unparseable value → that field's default (FPERS-09 AC2), `from > to` custom range → `this-month`.
- `serialize*` counterparts that drop defaults.
- `resolvePeriodDates(token, now)`: moved from `OverviewTab.getPeriodDates`, `now` injected for tests.
- All edge logic is here so it is unit-tested without rendering.

### `useHomeFilters` (replaces `useTransactionFilters` + Overview local state)
- Reads `useSearchParams`, returns `{ overview, transactions, tab, setTab, updateOverview, updateTransactions, clearTransactions }`.
- Filter updates: `setSearchParams(fn, { replace: true })`; tab switch: `{ replace: false }` (FPERS-03).
- `TransactionsTab` / `OverviewTab` keep their current props/JSX; only the state source changes. Search input keeps a local draft string for typing, debounced into `q`.

### `filterStorage.ts` — `lib/`
- `saveHomeFilters(userId, planId, search)` / `loadHomeFilters(userId, planId)`, key `homeFilters:{userId}:{planId}`, value = the query string. Every call wrapped in try/catch → no-op/null on failure (FPERS-07).
- Separate from `lib/storage.ts` (fixed key enum).
- **Logout**: `Navbar.logout` calls `clearStorage()` = `localStorage.clear()`, which would wipe saved filters (contradicts the confirmed "kept on logout" assumption) and also the theme choice. Change logout to remove only the auth keys (`accessToken`, `user`, `activePlanId`).

### `HomeFiltersGate` (in `HomePage`)
Synchronous decision during render, before tabs mount:

| URL state | Action |
| --------- | ------ |
| no home params | `<Navigate replace>` to saved state for (user, active plan), or `?plan=<active>` |
| `plan` ≠ active plan | same as above → plan switch from `PlanSwitcher`, `/plans` or invitation restores that plan's state (FPERS-08), wherever the switch happened |
| `plan` = active plan | render tabs; an effect saves the query string to storage when it changes (write-only) |

`<Navigate>` is rendered instead of the tabs, so the transactions/dashboard queries mount once, already with the restored filters — no wasted request.

### Name resolution for chips (the "one request per id?" question)
- **Members**: `useGetPlanMembers(planId)` is already loaded by both tabs (shared TanStack cache key) → name lookup is a `find`, **0 requests**. Missing id after load → drop the filter (FPERS-10).
- **Category**: new `useGetFinancialTransactionCategory(id)` → existing `GET /plan/{planId}/financial-transaction-category/{id}`, enabled only when a category filter is active. At most **1 request**, in parallel with the transactions query (it doesn't block it — the table filters by id), cached per `(plan, id)`. When the user picks a category in the popover, the chosen object is seeded with `queryClient.setQueryData`, so in-session picks cost **0 requests**; only a reload/shared link with a category costs one. 404 → drop the filter (FPERS-10).
- Rejected: storing labels in storage (goes stale on rename, useless for shared URLs); fetching the whole category list (paged/unbounded, more data than one row).

## Decisions within the spec's assumptions
- ~~A shared link whose `plan` is not the active plan is treated as a plan mismatch~~ — revised after verification (user decision): the gate distinguishes the two mismatch causes. If the **active plan changed** since the gate last rendered (user switched plans) → load the new plan's saved state. If the **URL changed / first mount** and `plan` is another plan the user belongs to → switch the active plan to it (effect; render nothing until settled) and keep the URL filters. Unknown plan → active plan's saved state.
- Clear removes filters + `q`, keeps `sort`/`size` (user decision).
