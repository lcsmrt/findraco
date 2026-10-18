# Testing Infrastructure

**Analyzed:** 2026-07-05
**Updated:** 2026-07-25 (`*IT` moved off Testcontainers onto the `dev_finsight` database)
**Prior:** 2026-07-17 (test-foundation feature, T1–T21 — see `.specs/features/test-foundation/`)
**Frontend:** 2026-10-17, rewritten for the frontend-standards feature (testing model AD-012, `frontend-testing` skill). It describes the target harness; areas still being built are marked with the slice that brings them (`.specs/features/frontend-standards/tasks.md`).

## Test Frameworks

**Backend (backend):**

- Unit (`*Test`, surefire, `mvn test`): JUnit 5 via `spring-boot-starter-test`. Plain Mockito/AssertJ unit tests for pure logic — no Spring context.
- Integration (`*IT`, failsafe, `mvn verify`): JUnit 5 + `spring-boot-starter-test`. Runs against the real `dev_finsight` Postgres over the SSH tunnel (**not** an ephemeral container — Testcontainers was removed 2026-07-25), full Flyway migration chain, real MockMvc HTTP requests, real JWTs via the production `JwtService` (not `@WithMockUser` for security-sensitive tests).
- Coverage: JaCoCo (`jacoco-maven-plugin` 0.8.15) — global report always generated; a `check` rule gates branch coverage ≥0.80 on exactly three invariant-bearing classes (see Coverage Targets below). No global minimum.
- E2E: none (out of scope — MockMvc-driven integration tests substitute for HTTP-level E2E).

**Frontend (frontend):** Vitest with three projects, run from `frontend/` with pnpm. The rules for what gets which test live in the `frontend-testing` skill.

- `unit` (jsdom): logic modules, hooks with logic (`renderHook`), service hooks, and integration tests of screens. An MSW server starts for every test file with **no default handlers**; each test adds what it needs with `server.use(...)`. A request without a handler is recorded and thrown in `afterEach`, naming method and URL (MSW's `onUnhandledRequest: "error"` alone would let code that swallows the error pass). (STD-04; today service-hook tests `vi.mock` the HTTP client.)
- `storybook` (Chromium via Playwright, `@storybook/addon-vitest`): every story renders as a test, `play` functions cover basic interactions, and the a11y addon runs in error mode (`a11y: { test: "error" }` in `.storybook/preview.tsx`), so a violation fails the run. (In `pnpm test` from STD-04; today run separately.)
- `tooling` (Node): the local ESLint rules (`eslint/rules/*.test.ts`, `RuleTester` on Vitest's `describe`/`it`), the sibling gate's own test (`scripts/check-siblings.test.ts`) and the ESLint config test (`eslint.config.test.ts`, `ESLint#calculateConfigForFile` per layer path). (STD-02 onward.)
- Coverage: `@vitest/coverage-v8` over `src/**/*.ts`, excluding tests, `*.handlers.ts`, `src/test/**` and `.d.ts`; branch threshold 90% (STD-11).
- E2E: Playwright (installed), 3–5 smoke journeys against the real backend and a disposable database; blocked by the local Docker database (STD-14).

## Test Organization

**Backend:**

- Location: `backend/src/test/java/com/lcs/finsight/`.
- Harness/support (test-infrastructure, not app code): `support/AbstractIntegrationTest.java` (base class every `*IT` extends — `@SpringBootTest(MOCK)` + MockMvc + `truncateAll()` `@BeforeEach` + the disposable-database guard), `support/TestAuthHelper.java` (real-JWT bearer tokens), `support/Fixtures.java` (plan/member/transaction builders via real repositories).
- `*Test` files (existing, unchanged by this pass): `services/SplitResolverTest.java`, `services/CategorySpendingAssemblerTest.java`, `services/SeriesRegeneratorTest.java`, `services/RecurringTransactionGeneratorTest.java`, `security/PlanAuthorizationTest.java`.
- `*IT` files (new): `support/HarnessSmokeIT.java`, `services/SplitInvariantIT.java`, `services/DashboardPartitionIT.java`, `security/PlanAuthorizationMatrixIT.java`, `security/AuthenticationIT.java`, `services/TransactionCrudIT.java`, `services/SeriesEditIT.java`, `services/MigrationsIT.java`, `services/CsvImportIT.java`, `services/InvitationLifecycleIT.java`.
- `FinSightApplicationTests.java` now extends `AbstractIntegrationTest` (previously booted against the real `SPRING_DATASOURCE_URL`/`.env`, which made even the default context-load stub depend on a live tunnel).
- Test config: `src/test/resources/application-test.properties` (fixed `JWT_SECRET_KEY`, `spring.flyway.enabled=true`, `ddl-auto=validate`). It deliberately does **not** set the datasource — `application.properties`' `${SPRING_DATASOURCE_*}` placeholders resolve from `backend/.env` exactly as in a normal run.

**Frontend:**

- Everything is a sibling of its subject: `xxx.test.ts` beside a logic module or hook, `Xxx.test.tsx` beside a screen or container (integration), `Xxx.stories.tsx` beside a presentational component.
- `src/test/`: harness only (`server.ts`, `setupUnit.ts`, `unhandledRequests.ts`, `renderWithProviders.tsx`, `scenarios.ts`).
- `src/api/services/xxx.handlers.ts`: typed MSW handler factories per endpoint (`dashboardHandlers.trend(trend)`), beside the service they mirror. Only tests and stories may import them or `@/test/*` (lint `no-restricted-imports`).
- **Sibling gate** (`frontend/scripts/check-siblings.ts`, STD-10/11): reads each module's AST and fails naming the file when (a) a `.ts` module holding a decision point (`if`, ternary, `switch`, `&&`/`||`/`??` as a value, loop, `try`/`catch`), arithmetic on non-literal operands or an iteration callback has no sibling `.test.ts` (type-only, DTO, constant-only and `*.handlers.ts` modules exempt), or (b) a `.tsx` under `src/` that does not directly import `@/api/services`, `@/app/providers` or `react-router-dom` has no sibling `.stories.tsx` (tests, stories, `src/index.tsx` and `src/test/**` excepted).

## Testing Patterns

### Unit Tests

**Backend:** plain JUnit 5 + Mockito, no Spring context, fast. Covers `SplitResolver`, `CategorySpendingAssembler`, `SeriesRegenerator`, `RecurringTransactionGenerator`, `PlanAuthorization` — the pure-logic/invariant classes.

**Frontend:** schema rules and the form mappers (`toFormValues`/`toPayload` in `xxxForm.ts`), helpers extracted from components, hooks through `renderHook`, and service hooks through MSW with the real `findracoApi` (method, URL, params/body and response mapping asserted; one test crosses the 401 → refresh → retry interceptor). Tests are derived from the spec's ACs and their names cite the AC. Presentational components are covered by stories, not unit tests; business logic is never simulated through clicks.

### Integration Tests

**Backend — Approach:** `*IT` classes extend `AbstractIntegrationTest`, drive the app through real HTTP requests via MockMvc against the `dev_finsight` Postgres (real commits — **not** `@Transactional` rollback; state is reset via a fast `TRUNCATE ... RESTART IDENTITY CASCADE` `@BeforeEach`, deliberately, because rollback-wrapping would hide flush-order bugs like the one found during series-edit, CONCERNS.md L-007). Real JWTs via `TestAuthHelper`, not mocked auth, for anything security-sensitive. Fixtures seed data directly through repositories (fast, clear setup) rather than driving every precondition through the API.

**⚠️ The suite empties `dev_finsight`.** `truncateAll()` wipes every table (except `flyway_schema_history`) before *each* test, so after any `./mvnw verify` the dev database is empty and needs re-seeding for manual UI testing. That is the accepted trade — there are only two databases and `dev_finsight` is the throwaway one now that the real data lives in prod. Because the datasource comes from `backend/.env` (which sits next to `.env.production`, and both point at the same Postgres instance), `AbstractIntegrationTest` fails the run unless the connected database's name is in its `DISPOSABLE_DATABASES` allowlist. Widen that set only for another genuinely throwaway database; **never** add the production one.

**Frontend — Approach:** integration tests in the `unit` project render the real screen through `renderWithProviders` (`QueryClientProvider` with retries off, `MemoryRouter`, and the real context objects with explicit values, e.g. `<PlanContext.Provider value={…}>`), with only the network simulated by MSW. Named scenarios (`signedInMember({ role: "VIEWER" })`) group handler factories and expose everything the test relies on as parameters. Flow tests never `vi.mock` our own modules. Required for every new spec AC; existing flows gain them when a change touches them.

### E2E Tests

Backend: none, by design (see Test Frameworks above). Frontend: Playwright smoke journeys (sign in, add a transaction, see it on the Overview, switch plans) once the local Docker database exists; they never run against `dev_finsight`.

## Local Environment Setup — the DB tunnel (read before running `*IT`/`mvn verify`)

The `*IT` suite talks to `dev_finsight` on the VPS through the SSH tunnel that publishes it on `localhost:5432`. **Bring the tunnel up first** — with it down, every `*IT` (and `FinSightApplicationTests`, which surefire also picks up) fails at context startup with `Connection to localhost:5432 refused`. `backend/.env` must exist too; nothing supplies a fallback datasource anymore.

Docker is no longer involved. Testcontainers, `TestContainersConfig.java`, and `docker-java.properties` were removed 2026-07-25, which retires the `DOCKER_HOST` / `TESTCONTAINERS_RYUK_DISABLED` exports that CONCERNS.md Lesson L-008 documented — that lesson is now historical.

## Test Execution

**Backend:**

```bash
cd backend
./mvnw test          # *Test (surefire) — but FinSightApplicationTests is an integration test by
                     # inheritance, so this still needs the tunnel; -Dtest=<name> for a pure unit test
./mvnw verify         # unit + integration (*Test + *IT) + jacoco:check — needs the tunnel, empties dev_finsight
```

**Frontend:**

```bash
cd frontend
pnpm test                                               # sibling gate, then every project with coverage (what CI runs; STD-11)
pnpm exec vitest run --project=unit --project=tooling   # quick: logic, flows, tooling
pnpm exec vitest run                                    # every project, without the sibling and coverage gates
pnpm exec vitest run --project=storybook                # stories only (Chromium, headless)
```

Until the sibling and coverage gates join `pnpm test` (STD-11), `pnpm exec vitest run` is the full run.

## Coverage Targets

**Current:**
- Backend: global JaCoCo report generated on every `mvn verify` (no global minimum). A `check` rule gates branch coverage ≥0.80 on exactly `SplitResolver`, `CategorySpendingAssembler`, `PlanAuthorization` — the three invariant-bearing classes identified during design (AD-007's partition invariant, SPLIT-01, and the two-layer plan authz model). Weakening test coverage on any of these three fails `mvn verify`; no other class is gated.
- Frontend: 90% branch coverage on `src/**/*.ts` (logic modules and hooks; tests, `*.handlers.ts`, `src/test/**` and `.d.ts` excluded), never global; components, stories, DTOs and types are outside the threshold (STD-11; today wired, not enforced). Coverage is a signal: the Verifier's mutation sensor catches branches that are executed but not asserted.

**Goals:** extend the JaCoCo floor to additional invariant classes as they're identified.
**Enforcement:** backend — `jacoco:check` bound to the `verify` phase (hard gate, fails the build). Frontend — the Vitest coverage threshold fails `pnpm test` and the CI `frontend` job.

## Test Coverage Matrix

| Code Layer                           | Test Type              | Location Pattern                                              | Run Command                              |
| ------------------------------------- | ----------------------- | --------------------------------------------------------------- | ----------------------------------------- |
| Backend pure logic (resolvers/assemblers/authz) | unit (present)  | `backend/src/test/**/*Test.java`                       | `./mvnw test`                             |
| Backend HTTP/security/DB slice        | integration (present)   | `backend/src/test/**/*IT.java`                          | `./mvnw verify`                           |
| Backend controllers (beyond the *IT already covering create/edit/auth/dashboard/csv/invitations) | integration (partial) | same as above | `./mvnw verify` |
| Backend migrations                    | integration (present)   | `backend/src/test/**/MigrationsIT.java`                 | `./mvnw verify`                           |
| Frontend logic modules and hooks with logic | unit (sibling gate + 90% branches) | `frontend/src/**/*.test.ts` | `pnpm exec vitest run --project=unit` |
| Frontend service hooks and API client | unit through MSW | `frontend/src/api/**/*.test.ts` + `*.handlers.ts` | `pnpm exec vitest run --project=unit` |
| Frontend flows (screens, containers) | integration (`renderWithProviders`, MSW only) | `frontend/src/**/*.test.tsx` | `pnpm exec vitest run --project=unit` |
| Frontend presentational components | story (story checklist, a11y in error mode) | `frontend/src/**/*.stories.tsx` | `pnpm exec vitest run --project=storybook` |
| Frontend tooling (lint config, local rules, gate script) | unit (Node) | `frontend/eslint.config.test.ts`, `frontend/eslint/rules/*.test.ts`, `frontend/scripts/*.test.ts` | `pnpm exec vitest run --project=tooling` |
| Frontend critical journeys | E2E (Playwright) | not yet in place (blocked by the local Docker database) | — |

Remaining gaps (not "no coverage exists" anymore, but "coverage is not yet exhaustive") — see `CONCERNS.md`.

## Parallelism Assessment

| Test Type                     | Parallel-Safe? | Isolation Model                                                                                  | Evidence |
| ------------------------------ | -------------- | -------------------------------------------------------------------------------------------------- | -------- |
| Backend `*Test` (unit)         | Yes            | No Spring context, no shared state                                                                  | Plain JUnit/Mockito |
| Backend `*IT` (integration, **development**) | **No — superseded 2026-07-25** | All concurrent `mvn` invocations now share the one `dev_finsight` database, and each truncates every table between tests. Two parallel runs will wipe each other's data mid-test. Run the backend suite one at a time; do not fan `[P]` sub-agents across `mvn verify`. | Testcontainers removed — no per-JVM container |
| Backend `*IT` (integration, **committed suite**) | No — single-fork by design | All `*IT` in one `mvn verify` run share one container + truncate-between-tests; this supersedes the old "shares one real datasource, no isolation" note | design.md TD-3 |
| Frontend `unit` project tests   | Yes            | jsdom; one MSW server per test file, handlers reset after each test, no default handlers            | `setupUnit.ts` |
| Frontend `tooling` project tests | Yes          | Node, no shared state                                                                                | `RuleTester`, AST script tests |
| Frontend `storybook` project tests | Yes         | Each story renders in an isolated headless Chromium context                                         | `vite.config.ts` (`browser` project) |

## Gate Check Commands

| Gate Level | When to Use                               | Command                                                                                       |
| ---------- | ------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| Quick      | Backend change, unit tests only            | `cd backend && ./mvnw test` (needs the tunnel — `FinSightApplicationTests` boots a context) |
| Docs (FE)  | Skill and doc changes                      | none; check the change against the feature's `context.md` and `design.md`                     |
| Quick (FE) | Frontend logic, flow or tooling change     | `cd frontend && pnpm exec vitest run --project=unit --project=tooling`                        |
| Full       | Backend change touching HTTP/DB/security   | `cd backend && ./mvnw verify` (tunnel up; empties `dev_finsight` — see Local Environment Setup) |
| Full (FE)  | Frontend change with stories               | `cd frontend && pnpm exec vitest run` (every project); once the gates are in `pnpm test`: `pnpm test` |
| Build      | Phase completion, config, moves, lint rules | `cd backend && ./mvnw package` ; `cd frontend && pnpm lint && pnpm build && pnpm exec vitest run` (once the gates are in `pnpm test`: `pnpm lint && pnpm build && pnpm test`) |

Commands are extracted from `backend/pom.xml` (Maven wrapper, failsafe+jacoco bindings) and `frontend/package.json` scripts; the frontend rows match the Gate Check Commands of `.specs/features/frontend-standards/tasks.md`.

## CI and Local Gates

- **Local (husky, `frontend/.husky/`, STD-03):** `pre-commit` runs `lint-staged` (ESLint on staged frontend files); `commit-msg` runs `python3 .claude/skills/tlc-spec-driven/scripts/check_commit.py` (Conventional Commits). `--no-verify` skips them; CI does not.
- **CI (`.github/workflows/ci.yml`, every push, STD-03):** `frontend` job — pnpm, Playwright browser (cached), `pnpm lint`, `pnpm build` (`tsc`), the Vitest projects and the sibling/coverage gates configured at the time; `backend` job — Temurin 17, `./mvnw test` (surefire only; `*IT` join once the local Postgres in Docker exists, via a CI service container).
- **Deploy:** the `deploy` job `needs` `changes`, `frontend` and `backend`; runs only on `main` when the push changes something outside `.specs/`, `.claude/` and `*.md`; one at a time; a head guard skips it when the tested commit is no longer the tip of `main`. Today `deploy.yml` still deploys every push to `main` untested.
- **Flaky tests** are fixed at the cause; retries are never added.
