# Transactions hooks: remove dead branches

## Status: DONE (2026-10-20)

## Why

The flow-coverage feature cut the transactions feature-hook tests and found two branches no screen reaches (`test-calibration/audit.md`, F7). The user asked to remove dead code (2026-10-20).

## Requirements

- QDB-01: `useTransactionActions` SHALL expose `closeDrawer()` in place of `onDrawerOpenChange(open)`. The drawer has no trigger of its own, so its `onOpenChange` only ever reports a close; the "ignore an open request" branch goes.
- QDB-02: `useTransactionFormSubmit`'s series edit SHALL receive the transaction from `submit`, which already checked it, so the redundant `!transaction` check goes.
- QDB-03: The `!definition` check SHALL stay, with a comment: it narrows the type, and without it a series edit would fall through to a plain update. The drawer disables Save while the definition loads (`TransactionFormDrawer.test.tsx` covers it).
- QDB-04: Behaviour unchanged: the transactions flow tests pass untouched; the frontend prerelease bumps (production code changed).

## Out of scope

Backend CSV parsing tests (queued under the backend standards review; the frontend only sends the file).
