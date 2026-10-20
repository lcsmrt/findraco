# Testing Infrastructure

**Analyzed:** 2026-07-05
**Updated:** 2026-07-25 (`*IT` moved off Testcontainers onto the `dev_finsight` database)
**Prior:** 2026-07-17 (test-foundation feature, T1–T21 — see `.specs/features/test-foundation/`)
**Frontend:** 2026-10-20, recalibrated by the test-calibration feature (testing model AD-015, superseding AD-012; `.specs/features/test-calibration/`). The closed test table lives in the `frontend-testing` skill and, as code, in `frontend/scripts/testTable.ts`.

## Test Frameworks

**Backend (backend):**

- Unit (`*Test`, surefire, `mvn test`): JUnit 5 via `spring-boot-starter-test`. Plain Mockito/AssertJ unit tests for pure logic — no Spring context.
- Integration (`*IT`, failsafe, `mvn verify`): JUnit 5 + `spring-boot-starter-test`. Runs against the real `dev_finsight` Postgres over the SSH tunnel (**not** an ephemeral container — Testcontainers was removed 2026-07-25), full Flyway migration chain, real MockMvc HTTP requests, real JWTs via the production `JwtService` (not `@WithMockUser` for security-sensitive tests).
- Coverage: JaCoCo (`jacoco-maven-plugin` 0.8.15) — global report always generated; a `check` rule gates branch coverage ≥0.80 on exactly three invariant-bearing classes (see Coverage Targets below). No global minimum.
- E2E: none (out of scope — MockMvc-driven integration tests substitute for HTTP-level E2E).

**Frontend (frontend):** Vitest with four projects, run from `frontend/` with pnpm. What gets which test, and how much, is the closed test table in the `frontend-testing` skill: a code kind recognised by path and file name maps to a test kind and an amount, and a module matching no row gets no test.

- `unit` (jsdom): business rules, service hooks, the API client, URL params, shared hooks (`renderHook`), and flow tests of containers. An MSW server starts for every test file with **no default handlers**; each test adds what it needs with `server.use(...)`. A request without a handler is recorded and thrown in `afterEach`, naming method and URL (MSW's `onUnhandledRequest: "error"` alone would let code that swallows the error pass).
- `storybook` (Chromium via Playwright, `@storybook/addon-vitest`): a story runs as a test only when it shows a state the component handles in its own code or holds a `play` for the component's own interaction; every other story, and every `base/` primitive's story file, carries the `!test` tag and stays in the catalog only. The a11y addon runs in error mode (`a11y: { test: "error" }` in `.storybook/preview.tsx`), so a violation fails a running story.
- `tooling` (Node): the local ESLint rules (`eslint/rules/*.test.ts`, `RuleTester` on Vitest's `describe`/`it`), the sibling gate's own test (`scripts/check-siblings.test.ts`) and the ESLint config test (`eslint.config.test.ts`, `ESLint#calculateConfigForFile` per layer path). (STD-02 onward.)
- `critical` (jsdom, like `unit`): the five critical modules' own tests (`<module>.test.ts`, `<module>.*.test.ts`), the only run with coverage.
- Coverage: `@vitest/coverage-v8` over the five critical modules only (`criticalModules` in `scripts/testTable.ts`), each held to 90% branches on its own; no other module has a threshold and there is no global number. It runs only in the `critical` project, so an unrelated test that loads a critical module partly never measures it.
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
- **Sibling gate** (`frontend/scripts/check-siblings.ts`): fails naming the file when (a) a module the test table requires a test for has no sibling `.test.ts` (a critical module, or a module in a unit row of `scripts/testTable.ts` that holds logic), (b) a component file that is neither a container nor under a `base/` folder has no sibling `.stories.tsx`, or (c) a container renders HTML elements of its own. Container detection and the markup rule live in the `component-creation` skill.

## Testing Patterns

### Unit Tests

**Backend:** plain JUnit 5 + Mockito, no Spring context, fast. Covers `SplitResolver`, `CategorySpendingAssembler`, `SeriesRegenerator`, `RecurringTransactionGenerator`, `PlanAuthorization` — the pure-logic/invariant classes.

**Frontend:** the unit rows of the test table: business rules (form schema and mappers in `xxxForm.ts`, pure computation under a `utils/` folder), service hooks through MSW with the real `findracoApi` (method, URL, params/body and response mapping asserted; one test crosses the 401 → refresh → retry interceptor), URL params, and shared hooks through `renderHook`. Feature hooks have no test of their own; their container's flow covers them. Tests are derived from the spec's ACs and their names cite the AC. No test asserts library behaviour.

### Integration Tests

**Backend — Approach:** `*IT` classes extend `AbstractIntegrationTest`, drive the app through real HTTP requests via MockMvc against the `dev_finsight` Postgres (real commits — **not** `@Transactional` rollback; state is reset via a fast `TRUNCATE ... RESTART IDENTITY CASCADE` `@BeforeEach`, deliberately, because rollback-wrapping would hide flush-order bugs like the one found during series-edit, CONCERNS.md L-007). Real JWTs via `TestAuthHelper`, not mocked auth, for anything security-sensitive. Fixtures seed data directly through repositories (fast, clear setup) rather than driving every precondition through the API.

**⚠️ The suite empties `dev_finsight`.** `truncateAll()` wipes every table (except `flyway_schema_history`) before *each* test, so after any `./mvnw verify` the dev database is empty and needs re-seeding for manual UI testing. That is the accepted trade — there are only two databases and `dev_finsight` is the throwaway one now that the real data lives in prod. Because the datasource comes from `backend/.env` (which sits next to `.env.production`, and both point at the same Postgres instance), `AbstractIntegrationTest` fails the run unless the connected database's name is in its `DISPOSABLE_DATABASES` allowlist. Widen that set only for another genuinely throwaway database; **never** add the production one.

**Frontend — Approach:** integration tests in the `unit` project render the real screen through `renderWithProviders` (`QueryClientProvider` with retries off, `MemoryRouter`, and the real context objects with explicit values, e.g. `<PlanContext.Provider value={…}>`), with only the network simulated by MSW. Named scenarios (`signedInMember({ role: "VIEWER" })`) group handler factories and expose everything the test relies on as parameters. Flow tests never `vi.mock` our own modules. A flow test asserts only container decisions: one happy submit with the full payload that reaches the network, an API failure, cancel, permission, and what happens after saving; a pure function's input and output belong to its unit test. Once E2E journeys exist, a happy path a journey covers gets no flow test.

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
pnpm test                                               # full suite: sibling gate, unit, tooling and storybook, then critical with coverage
pnpm exec vitest related --run <files>                  # per task: the tests that import the changed files
pnpm exec vitest run --project=unit --project=tooling   # quick: unit, flows, tooling
pnpm exec vitest run --project=storybook                # stories that run as tests (Chromium, headless)
pnpm test:coverage                                      # critical modules' coverage alone
```

`pnpm test` runs `node scripts/check-siblings.ts && vitest run --project=unit --project=tooling --project=storybook && vitest run --project=critical --coverage`. Workers: a quarter of the cores locally, a fixed 2 on CI (`process.env.CI`).

## Coverage Targets

**Current:**
- Backend: global JaCoCo report generated on every `mvn verify` (no global minimum). A `check` rule gates branch coverage ≥0.80 on exactly `SplitResolver`, `CategorySpendingAssembler`, `PlanAuthorization` — the three invariant-bearing classes identified during design (AD-007's partition invariant, SPLIT-01, and the two-layer plan authz model). Weakening test coverage on any of these three fails `mvn verify`; no other class is gated.
- Frontend: 90% branch coverage per module on exactly five critical modules: `utils/money.ts`, `components/input/currencyDigits.ts`, `transactionForm.ts`, `categoryForm.ts`, `api/clients/findracoApi.ts` (an error there writes wrong data or drops the session unnoticed). No other module is gated, and there is no global number.

**Goals:** extend the JaCoCo floor to additional invariant classes as they're identified.
**Enforcement:** backend — `jacoco:check` bound to the `verify` phase (hard gate, fails the build). Frontend — the Vitest coverage threshold fails `pnpm test` and the CI `frontend` job.

## Test Coverage Matrix

| Code Layer | Test Type | Location Pattern | Run Command | Amount |
| --- | --- | --- | --- | --- |
| Backend pure logic (resolvers/assemblers/authz) | unit (present) | `backend/src/test/**/*Test.java` | `./mvnw test` | — |
| Backend HTTP/security/DB slice | integration (present) | `backend/src/test/**/*IT.java` | `./mvnw verify` | — |
| Backend controllers (beyond the *IT already covering create/edit/auth/dashboard/csv/invitations) | integration (partial) | same as above | `./mvnw verify` | — |
| Backend migrations | integration (present) | `backend/src/test/**/MigrationsIT.java` | `./mvnw verify` | — |
| Frontend business rules (`*Form.ts`, `*Forms.ts`, `utils/**`) | unit (sibling gate; 90% branches on the critical modules only) | `frontend/src/**/*.test.ts` | `pnpm exec vitest run --project=unit` | one case per rule the spec states, plus the edges it names |
| Frontend URL params (`*Params.ts`) | unit (sibling gate) | `frontend/src/**/*.test.ts` | `pnpm exec vitest run --project=unit` | a round trip, plus an invalid value |
| Frontend shared hooks (`hooks/*.ts`) | unit through `renderHook` (sibling gate) | `frontend/src/hooks/*.test.ts` | `pnpm exec vitest run --project=unit` | one case per behaviour it promises its callers |
| Frontend service hooks | unit through MSW, real `findracoApi` | `frontend/src/api/services/*.test.ts` + `*.handlers.ts` | `pnpm exec vitest run --project=unit` | one test per endpoint or mutation, asserting method, URL, params/body and response mapping |
| Frontend API client | unit through MSW | `frontend/src/api/clients/*.test.ts` | `pnpm exec vitest run --project=unit` | the single 401 → refresh → retry test, plus one case per rule the client promises |
| Frontend feature hooks | none (covered by the container's flow test) | — | — | none |
| Frontend containers | flow test (`renderWithProviders`, MSW only) | `frontend/src/**/*.test.tsx` | `pnpm exec vitest run --project=unit` | the container's own decisions only (`frontend-testing` "Flow tests") |
| Frontend presentational components | story (a11y in error mode) | `frontend/src/**/*.stories.tsx` | `pnpm exec vitest run --project=storybook` | one story per state its own code handles, a `play` per interaction of its own |
| Frontend `base/` primitives | catalog story only (`!test`) | `frontend/src/components/*/base/*.stories.tsx` | — | none runs as a test |
| Frontend tooling (lint config, local rules, gate scripts) | unit (Node) | `frontend/eslint.config.test.ts`, `frontend/eslint/rules/*.test.ts`, `frontend/scripts/*.test.ts` | `pnpm exec vitest run --project=tooling` | one valid and one invalid case per behaviour |
| Frontend UI glue, formatting, wrappers, types, constants | none | — | — | none |
| Frontend critical journeys | E2E (Playwright) | not yet in place (blocked by the local Docker database) | — | — |

**Frontend floor and ceiling.** For a frontend layer, the test table in the `frontend-testing` skill sets both the floor and the ceiling of its matrix row; the existing tests set neither. A feature's Test Coverage Matrix copies the row's test kind and amount, and a row whose test kind is none gets no test, whatever older code has.

**Discrimination sensor scope.** The Verifier's sensor mutates only frontend code in a table row whose test kind is not none. A mutant in glue, a feature hook or a catalog-only visual that survives is the table working, not a gap.

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
| Quick (FE) | Every task that is not the last of its phase | `cd frontend && pnpm exec vitest related --run <changed files>` (only the tests that import them) |
| Full       | Backend change touching HTTP/DB/security   | `cd backend && ./mvnw verify` (tunnel up; empties `dev_finsight` — see Local Environment Setup) |
| Full (FE)  | Frontend change with stories               | `cd frontend && pnpm test` |
| Build      | Last task of each phase only               | `cd backend && ./mvnw package` ; `cd frontend && pnpm lint && pnpm build && pnpm test` |

**Gate policy (user, 2026-10-19):** per task, run only the tests related to the files it changed; lint,
build and the whole suite run once, at the end of each phase. Lint already runs on staged files at every
commit. Group mechanical changes (one message change across five services, one rename) into a single
task rather than one per file. Test only what would really break: behaviour a user or a caller relies on,
not markup details, library behaviour or a case another layer already covers. Visual properties the test
browser cannot see (safe-area insets, stacking order) are a hand check named in the spec, not a test.

Commands are extracted from `backend/pom.xml` (Maven wrapper, failsafe+jacoco bindings) and `frontend/package.json` scripts; the frontend rows match the Gate Check Commands of `.specs/features/frontend-standards/tasks.md`.

## CI and Local Gates

- **Local (husky, `frontend/.husky/`, STD-03):** `pre-commit` runs `lint-staged` (ESLint on staged frontend files); `commit-msg` runs `python3 .claude/skills/tlc-spec-driven/scripts/check_commit.py` (Conventional Commits). `--no-verify` skips them; CI does not.
- **CI (`.github/workflows/ci.yml`, STD-03):** the `changes` job diffs from the last green run on the branch (not the previous push, so code a failed run rejected is tested again) and runs each app job only when that app changed: docs (`.specs/`, `.claude/`, `*.md`) touch neither, `frontend/**` and `backend/**` their own, anything else (root config, lockfile, workflow, compose) both; dispatch, a first run or a force push run both. `frontend` job — pnpm, Playwright browser (cached), `pnpm lint`, `pnpm build` (`tsc`) and the sibling gate over the whole tree on every run; with a usable base, only the `unit` and `storybook` tests that import a file changed since it (`vitest run --changed <base>`), with `tooling` (Vitest's related-file walk fails with `EISDIR` on its `eslint` import) and `critical` with coverage always whole; a change to a file tests depend on without importing it (theme CSS, `vite.config.ts`, `src/test/**`, `.storybook/**`, `package.json`, the lockfile, `scripts/testTable.ts`) reruns everything (`forceRerunTriggers`); without a usable base, `pnpm test`. A weekly run (Mondays 06:00 UTC, on `main`) and every manual dispatch run the full suite and never deploy; a failure ends the run red and GitHub emails it; `backend` job — Temurin 17, `./mvnw test` (surefire only; `*IT` join once the local Postgres in Docker exists, via a CI service container).
- **Deploy:** the `deploy` job `needs` `changes`, `frontend` and `backend` (each passed or skipped as unchanged); runs only on `main` when some app changed; one at a time; a head guard skips it when the tested commit is no longer the tip of `main`. Today `deploy.yml` still deploys every push to `main` untested.
- **Flaky tests** are fixed at the cause; retries are never added.
