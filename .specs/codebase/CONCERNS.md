# Codebase Concerns

**Analysis Date:** 2026-07-05

## Tech Debt

**Database schema management — RESOLVED (backend-standards, 2026-10):** Flyway migrations (`backend/src/main/resources/db/migration`) are the only source of the schema and Hibernate runs with `ddl-auto=validate`. The rules are in the `backend-structure` skill.

**Recurrence and installments — RESOLVED:** the inert `frequency`/`parcelsNumber` fields became real series (`RecurrenceDefinition` with its exceptions, generated occurrences, a daily top-up job). What remains is a product question: whether a future occurrence is an entry or a forecast (the "Recurrence v3" feature).

**Where the open backend concerns live:** the findings of the backend audit that the standards did not fix are recorded in `backend-quality-audit.md` and the feature specs under `.specs/features/backend-standards/`.

## Security Considerations

**Secrets handling — backend (well-managed):**

- Risk: Leakage of DB credentials / JWT signing secret.
- Files: `backend/.gitignore` (ignores `.env`, `.env.production`); `backend/.env.example` (placeholder keys only: `SPRING_DATASOURCE_*`, `JWT_SECRET_KEY`); secrets consumed via env in `application.properties`.
- Current mitigation: Real `.env` files are gitignored and a sanitized `.env.example` documents required keys. A live `backend/.env` exists on disk but is untracked. No secrets are hardcoded in source.
- Recommendations: Low residual risk. Keep secrets out of `docker-compose.yml` literals (currently interpolated from env — good). If a root git repo is later initialized (see below), re-confirm `.env` files are excluded before the first commit. Consider rotating any secret that has ever been shared outside the machine.

**Secrets handling — frontend (`.env.*` not gitignored) — LARGELY MOOT since 2026-07-25:**

- Risk: `frontend/.env.development` is **not** matched by `frontend/.gitignore` (it lists `*.local` but not `.env` / `.env.*`), so it is committed. `.env.production` no longer exists — the production build takes its API base URL from a code-level default — and the root `.gitignore` now excludes `.env` / `.env.production` everywhere.
- Files: `frontend/.gitignore`; `frontend/.env.development`.
- Current mitigation: The file holds only `VITE_FINDRACO_API_URL` — a public API base URL that ships in the client bundle anyway, so no secret is exposed today.
- Recommendations: **LOW.** Add `.env` and `.env.*.local` handling to the frontend `.gitignore` and provide a `.env.example` before any secret-bearing var is ever introduced. Never place secrets in `VITE_`-prefixed vars (they are inlined into the browser bundle).

**Session handling — RESOLVED 2026-10-16 (M5-08, `.specs/features/session-persistence/`):**

- What was wrong: the JWT lived 24h with no renewal, the API answered an expired token with an empty `403`, `PrivateRoute` only checked that a token existed in `localStorage`, and `AuthProvider` swallowed the profile-load failure (`refetch()` never rejects), so an expired session rendered private pages with no data. Logout left the token and query cache in memory.
- What changed: 15-minute JWT kept in memory only; renewable 30-day session behind a rotating, hashed `user_sessions` token in an `HttpOnly`, `SameSite=Strict` cookie scoped to `/api/findraco/auth`; replay outside a 30 s grace revokes the device chain; unauthenticated → `401` "Authentication required."; the SPA renews and retries on `401`, gates private routes on a resolved session status, and sends an expired session to `/login` with a toast. Sign-out revokes the device session server-side; a password reset revokes every session. See ARCHITECTURE.md "Authentication".
- Residual risks (**LOW**):
  - A revoked session's access token stays usable until its 15-minute expiry (no per-request DB check, by design).
  - Login, forgot-password, sign-up and CSV import are rate limited since backend-standards; `/auth/refresh` is not.
  - Safari may not store a `Secure` cookie over plain-HTTP `localhost`; set `SESSION_COOKIE_SECURE=false` in `backend/.env` for local development if renewal fails there.
  - A mutation that fails because the session expired also shows its own error toast ("Authentication required.") next to the expiry toast, since the interceptor rejects with the original `401`.

## Fragile Areas

**CSV import parser — RESOLVED (backend-standards, 2026-10):** a pure parser per format behind `StatementParser` (`transaction/importer`), chosen by header, strict UTF-8, all or nothing with the bad lines listed, covered by `StatementParserRegistryTest` and `CsvImportIT`.

## Test Coverage Gaps

**Backend — RESOLVED (backend-standards, 2026-10):** a closed test table decides backend tests (`backend-testing` skill); the integration tests run on a Testcontainers Postgres; the role matrix (`PlanAuthorizationMatrixIT`) has a row per plan-scoped endpoint and fails on an endpoint without one. Details: `TESTING.md`.

**Frontend — PARTIALLY RESOLVED 2026-07-17 (test-foundation feature):**

- What changed: A `unit` vitest project (jsdom, `npm run test`) now runs alongside the existing `storybook` project. Real logic tests exist for: `CreatePlanDialog`'s zod schema, `TransactionFormDrawer`'s schema/defaults/payload-mapping/edit-reset for both plain and series/recurring modes, and `usePlanService`'s URL-scoping + cache-invalidation behavior. The `Dropdown.stories.tsx` Base UI compound-component bug class (L-002 below) now has an automated `play`-function regression guard, red/green-proven against the original failure mode.
- Residual gap: most other feature components/hooks under `frontend/src/features/**` and `src/api/**` still have no dedicated tests (only the two forms and one service hook above). Coverage is real but narrow — extend incrementally as those areas change.
- Risk: Medium → Low-Medium (down from Medium — the highest-risk flows named in the original entry, form validation and one auth-scoped data hook, now have coverage; the general "most things still untested" risk remains).
- Priority: Medium.
- Difficulty to test: Low — the harness and conventions are established (see `TESTING.md`); extending to another form/hook is now a matter of following the existing pattern, not building infrastructure.

## Missing Critical Features

**~~No root version control~~ — RESOLVED 2026-07-25:**

- The monorepo root is now a git repo. Both sub-repo histories were merged in under `backend/` and `frontend/` (233 commits total), and the previously unversioned root files (`.specs/`, `.claude/`, `CLAUDE.md`, the migration runbook) are tracked. The sub-repos no longer have their own `.git`; `lcsmrt/finSight-backend` and `lcsmrt/finSight-frontend` on GitHub are stale as of that date.
- Root `.gitignore` covers `.env` / `.env.production` (secrets stay in the Portainer stack); each app's own `.gitignore` still covers `target/`, `dist/`, `node_modules/`.

## Documentation Drift

**`backend/README.md` — RESOLVED (2026-10-30):** Java version, port, Flyway, environment variable names and the project structure now match the code.

## Environment & Process Gotchas

Lessons from past sessions (moved here from the old `.specs/project/STATE.md` on 2026-10-11; IDs kept because older specs cite them). They are environment/process knowledge, not verification signals, so they don't belong in the skill's `lessons.json`.

- **L-001 — Reconcile tasks against the code at phase boundaries.** A green compile once hid that T6/T7 were marked done but never written. Compile ≠ complete.
- **L-002 — Frontend build-green ≠ runtime-correct for Base UI.** Compound components (e.g. `Menu.GroupLabel` needs a `Menu.Group`) fail only at render. Check in a browser or a story with a `play` function; mirror the primitive's own story for nesting.
- **L-003 — The dev database is remote.** Running the app locally needs a reachable Postgres; the tests do not (they use Docker).
- **L-004 — Re-check "next available" numbers at the start of Execute.** Planned migration V5 was taken by the time Execute ran; always `ls db/migration/` (and re-verify line refs) before T1, and log drift as a `SPEC_DEVIATION`.
- **L-006 — Non-default dev ports need `ALLOWED_ORIGINS`.** A Vite instance on a port other than 5173 is blocked by CORS and only shows a generic "An error occurred" toast.
- **L-007 — A migration on disk can be applied before it's committed.** Any backend instance booting against the same DB (e.g. the user's own dev server reloading) runs Flyway. Check `flyway_schema_history` on the real DB before assuming a clean baseline.
- **L-008 — Testcontainers on Docker Desktop (Linux) needs the two user-level files** described in `TESTING.md` (Local Environment Setup).

---

_Concerns audit: 2026-07-05_
_Update as issues are fixed or new ones discovered_
