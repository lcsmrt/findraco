# Codebase Concerns

**Analysis Date:** 2026-07-05

## Tech Debt

**No database migration tool (schema managed by Hibernate `ddl-auto=update`):**

- Issue: Schema is created/altered at startup by Hibernate, not by versioned migrations. The README lists **Flyway** as part of the stack, but no Flyway (or Liquibase) dependency, config, or `db/migration` directory exists.
- Files: `backend/src/main/resources/application.properties` (`spring.jpa.hibernate.ddl-auto=update`); `backend/pom.xml` (no `flyway-core` dependency); README claim in `backend/README.md` ("Flyway — database migrations").
- Why: Convenient during early solo development — the schema "just appears" from JPA entities.
- Impact: **HIGH.** No version control of schema, no reviewable change history, no safe rollback. `ddl-auto=update` never drops or narrows columns, so renamed/removed fields silently drift and leave orphaned columns; it can also apply unintended DDL against a shared/prod database. Environments diverge because schema depends on whichever entity version last booted.
- Fix approach: Adopt Flyway (or Liquibase). Baseline the current schema as `V1__baseline.sql`, switch `ddl-auto` to `validate`, and gate all future schema changes behind reviewed migration scripts.

**Inert recurrence/installment fields (`frequency`, `parcelsNumber`):**

- Issue: `FinancialTransaction.frequency` (free-text `String`) and `parcelsNumber` (`Integer`) are persisted and echoed on create/update but never expanded into future or installment occurrences — the data is stored and otherwise ignored.
- Files: `backend/src/main/java/com/lcs/finsight/models/FinancialTransaction.java` (lines 33-34); set-but-unused in `backend/src/main/java/com/lcs/finsight/services/FinancialTransactionService.java` (`create` lines 101-102, `update` lines 126-127) — no logic reads them to generate occurrences.
- Why: Fields were modeled ahead of the recurrence/forecast feature.
- Impact: **MEDIUM (feature-blocking).** The planned spending-forecast feature intends to consume these. `frequency` is uncontrolled free text with no enum/vocabulary, so values are inconsistent and cannot be reliably interpreted by forecasting logic — a data-quality problem that compounds the longer unvalidated rows accumulate.
- Fix approach: Replace `frequency` with a controlled enum (e.g. `NONE`, `WEEKLY`, `MONTHLY`, `YEARLY`) validated at the DTO boundary; add service logic to expand recurrences and installments (`parcelsNumber`) into projected occurrences. Backfill/normalize existing free-text values via a migration.

## Security Considerations

**Secrets handling — backend (well-managed):**

- Risk: Leakage of DB credentials / JWT signing secret.
- Files: `backend/.gitignore` (ignores `.env`, `.env.production`); `backend/.env.example` (placeholder keys only: `SPRING_DATASOURCE_*`, `JWT_SECRET_KEY`); secrets consumed via env in `application.properties`.
- Current mitigation: Real `.env` files are gitignored and a sanitized `.env.example` documents required keys. A live `backend/.env` exists on disk but is untracked. No secrets are hardcoded in source.
- Recommendations: Low residual risk. Keep secrets out of `docker-compose.yml` literals (currently interpolated from env — good). If a root git repo is later initialized (see below), re-confirm `.env` files are excluded before the first commit. Consider rotating any secret that has ever been shared outside the machine.

**Secrets handling — frontend (`.env.*` not gitignored) — LARGELY MOOT since 2026-07-25:**

- Risk: `frontend/.env.development` is **not** matched by `frontend/.gitignore` (it lists `*.local` but not `.env` / `.env.*`), so it is committed. `.env.production` no longer exists — the production build takes its API base URL from a code-level default — and the root `.gitignore` now excludes `.env` / `.env.production` everywhere.
- Files: `frontend/.gitignore`; `frontend/.env.development`.
- Current mitigation: The file holds only `VITE_FINSIGHT_API_URL` — a public API base URL that ships in the client bundle anyway, so no secret is exposed today.
- Recommendations: **LOW.** Add `.env` and `.env.*.local` handling to the frontend `.gitignore` and provide a `.env.example` before any secret-bearing var is ever introduced. Never place secrets in `VITE_`-prefixed vars (they are inlined into the browser bundle).

**Session handling — RESOLVED 2026-10-16 (M5-08, `.specs/features/session-persistence/`):**

- What was wrong: the JWT lived 24h with no renewal, the API answered an expired token with an empty `403`, `PrivateRoute` only checked that a token existed in `localStorage`, and `AuthProvider` swallowed the profile-load failure (`refetch()` never rejects), so an expired session rendered private pages with no data. Logout left the token and query cache in memory.
- What changed: 15-minute JWT kept in memory only; renewable 30-day session behind a rotating, hashed `user_sessions` token in an `HttpOnly`, `SameSite=Strict` cookie scoped to `/api/findraco/auth`; replay outside a 30 s grace revokes the device chain; unauthenticated → `401` "Authentication required."; the SPA renews and retries on `401`, gates private routes on a resolved session status, and sends an expired session to `/login` with a toast. Sign-out revokes the device session server-side; a password reset revokes every session. See ARCHITECTURE.md "Authentication".
- Residual risks (**LOW**):
  - A revoked session's access token stays usable until its 15-minute expiry (no per-request DB check, by design).
  - No rate limiting on `/auth/login` or `/auth/refresh` (out of scope, same call as `password-recovery`).
  - Safari may not store a `Secure` cookie over plain-HTTP `localhost`; set `SESSION_COOKIE_SECURE=false` in `backend/.env` for local development if renewal fails there.
  - A mutation that fails because the session expired also shows its own error toast ("Authentication required.") next to the expiry toast, since the interceptor rejects with the original `401`.
  - `*IT` tests for the session endpoints were written while the DB tunnel was down; run `./mvnw verify` to confirm them.

## Fragile Areas

**Nubank CSV import parser:**

- Files: `backend/src/main/java/com/lcs/finsight/services/FinancialTransactionService.java` (`importFromNubankCsv`, lines 140-192).
- Why fragile: Positional parsing assumes Nubank's exact 4-column layout and `dd/MM/yyyy` date format; any format change (extra columns, locale differences, quoted commas) misparses. A single bad row (`LocalDate.parse`/`BigDecimal` failure) throws inside the loop, aborting the entire import with a generic wrapped `RuntimeException("Erro ao processar o arquivo CSV.")`.
- Common failures: unparseable date/amount, header assumptions, encoding issues.
- Safe modification: Introduce per-row error collection (skip + report bad rows instead of failing the batch), validate column count/format explicitly, and cover with a service test using sample CSV fixtures before changing parsing logic.
- Test coverage: none (see below).

## Test Coverage Gaps

**Backend — RESOLVED 2026-07-17 (test-foundation feature, `.specs/features/test-foundation/`):**

- What changed: A real Testcontainers-Postgres integration harness (`AbstractIntegrationTest` + `TestContainersConfig` + `TestAuthHelper` + `Fixtures`) now backs 10 `*IT` integration test classes covering the previously-unguarded critical paths: split invariant + per-user filtering (`SplitInvariantIT`), item-aware dashboard partition invariant (`DashboardPartitionIT`), the full plan-role×ownership authz matrix incl. fail-closed writes and non-member 404s (`PlanAuthorizationMatrixIT`), register/login/cross-plan-denial (`AuthenticationIT`), transaction PUT full-replace + validation guards (`TransactionCrudIT`), series generation/edit-scopes/guards (`SeriesEditIT`), the full Flyway chain on an empty DB (`MigrationsIT`), CSV import dedup (`CsvImportIT`), and invitation lifecycle (`InvitationLifecycleIT`). Plus 5 pre-existing `*Test` unit-test classes for the pure-logic layer (`SplitResolver`, `CategoryBreakdownAssembler`, `SeriesRegenerator`, `RecurringTransactionGenerator`, `PlanAuthorization`). JaCoCo gates branch coverage ≥0.80 on the three invariant-bearing classes; `mvn verify` fails if that regresses. Details: `.specs/codebase/TESTING.md`.
- Amended 2026-07-25: the harness was moved off Testcontainers onto the `dev_finsight` database over the SSH tunnel (`TestContainersConfig` deleted), so the suite now **does** depend on `.env` + the tunnel and **empties `dev_finsight`** on every run. `MigrationsIT` correspondingly no longer proves the chain applies to a genuinely empty DB — it asserts the applied set matches the files on disk. Coverage of app behavior is unchanged.
- Residual gap: coverage is real but not exhaustive — controllers/services not yet touched by an `*IT` (e.g. category CRUD, dashboard's monthly-trend/person-breakdown endpoints) still rely on manual verification. Lower priority than before; add incrementally as those areas change.
- Two real (pre-existing, unrelated to the harness) bugs were **found** while writing these tests — B-002 (login with an unknown email returned 500 instead of 401) and B-003 (negative top-level transaction amount was accepted); both fixed 2026-07-19 (`b23d940`, `c62e7be8`).

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

**`backend/README.md` contains multiple inaccuracies:**

- Issue: The README misstates the actual stack/config, reducing trust in project docs.
- Files & specifics:
  - **Java version:** README says "Java 21"; `backend/pom.xml` sets `java.version=17` and the `Dockerfile` builds/runs on temurin-17. Impact: **LOW** — reconcile and pin one toolchain (align README + `pom.xml` + Docker base images).
  - **Server port:** README says Swagger is at `http://localhost:8080/...`; the app runs on port `3000` (`application.properties`: `server.port=${SERVER_PORT:3000}`, `Dockerfile` `EXPOSE 3000`). Impact: **LOW** — doc drift; correct the URL/port.
  - **Flyway:** README lists Flyway, but no migration tooling exists (see Tech Debt above). Impact: covered under the HIGH migration concern.
  - **Env var names:** README's "Getting Started" documents `DB_URL`/`DB_USERNAME`/`DB_PASSWORD`/`JWT_SECRET`, but the app actually reads `SPRING_DATASOURCE_URL`/`_USERNAME`/`_PASSWORD` and `JWT_SECRET_KEY` (`application.properties`, `.env.example`). Impact: **LOW** — misleads new setup; align README with `.env.example`.
- Fix approach: Update the README to match reality (Java 17, port 3000, correct env keys) and either adopt Flyway or drop the claim.

## Environment & Process Gotchas

Lessons from past sessions (moved here from the old `.specs/project/STATE.md` on 2026-10-11; IDs kept because older specs cite them). They are environment/process knowledge, not verification signals, so they don't belong in the skill's `lessons.json`.

- **L-001 — Reconcile tasks against the code at phase boundaries.** A green compile once hid that T6/T7 were marked done but never written. Compile ≠ complete.
- **L-002 — Frontend build-green ≠ runtime-correct for Base UI.** Compound components (e.g. `Menu.GroupLabel` needs a `Menu.Group`) fail only at render. Check in a browser or a story with a `play` function; mirror the primitive's own story for nesting.
- **L-003 — The DB is the SSH tunnel, not a local Postgres.** Before declaring the DB down, check `ss -tlnp | grep 5432`; `systemctl status postgresql` is irrelevant here.
- **L-004 — Re-check "next available" numbers at the start of Execute.** Planned migration V5 was taken by the time Execute ran; always `ls db/migration/` (and re-verify line refs) before T1, and log drift as a `SPEC_DEVIATION`.
- **L-005 — A listening tunnel isn't a live tunnel.** Probe the DB with `timeout 10-15`; exit 124 means a stale tunnel. If it recurs after a reconnect, surface it instead of retrying.
- **L-006 — Non-default dev ports need `ALLOWED_ORIGINS`.** A Vite instance on a port other than 5173 is blocked by CORS and only shows a generic "An error occurred" toast.
- **L-007 — A migration on disk can be applied before it's committed.** Any backend instance booting against the same DB (e.g. the user's own dev server reloading) runs Flyway. Check `flyway_schema_history` on the real DB before assuming a clean baseline.
- _L-008 (Testcontainers + Docker Desktop env vars) is obsolete since Testcontainers was removed on 2026-07-25._

---

_Concerns audit: 2026-07-05_
_Update as issues are fixed or new ones discovered_
