# Backend Standards Tasks

## Execution Protocol (MANDATORY -- do not skip)

Implement these tasks with the `tlc-spec-driven` skill: **activate it by name and follow its Execute flow and Critical Rules.** Do not search for skill files by filesystem path. The skill is the source of truth for the full flow (per-task cycle, sub-agent delegation, adequacy review, Verifier, discrimination sensor).

**If the skill cannot be activated, STOP and tell the user - do not proceed without it.**

---

**Spec**: `.specs/features/backend-standards/spec.md`
**Design**: `.specs/features/backend-standards/design.md` (approved 2026-10-29)
**Status**: In Progress — approved by the user up front for an unattended run (2026-10-29); the user reviews the result afterwards instead of approving each step

**Execution notes**

- Backend commands run from `backend/`; frontend commands from `frontend/` with pnpm.
- Phases follow the design's run order, not the BST ID order. Task paths before T12/T13 use the old packages; after them, the feature packages.
- One task = one Conventional Commit (the `Commit` line); move-only commits stay separate from edits (T12, T13).
- A rule lands in the commit that makes the code comply; `ArchitectureTest` is never red on `main`. No `@SuppressWarnings`, ever (AD-016).
- "checked, reverted" proves a guard by breaking it once; the break is never committed.
- Every task that changes a response or request regenerates `backend/openapi.json` (from T26 on) in the same commit.
- Every push that ships a frontend change bumps `1.0.0-beta.N` in its own `chore(release)` commit.
- Pushing is the user's call; push only on the feature branch, never `main`. Steps on the VPS (T50 `SERVER_ADDRESS`, T54 secret, T43 container zone, T46 precheck) are done by the user before the deploy of their slice.
- Gates: per task only the affected tests (Quick), and only when the task has tests; the full Build gate once at the end of each worker batch rather than each phase (user, 2026-10-29: fewer checks for an unattended run). A task's "Gate: build" line therefore means "build at batch end" unless it ends a batch.
- Local environment: JDK 25 at `~/.jdks/jdk-25.0.5+8` (set `JAVA_HOME` from BST-02 on; BST-01 runs on the system JDK 17); Docker Desktop at `unix:///home/lcs/.docker/desktop/docker.sock`.

---

## Test Coverage Matrix

> Generated from codebase, project guidelines, and spec - confirm before Execute. Guidelines found: `CLAUDE.md`, `.specs/codebase/TESTING.md`, `context.md` S8 (closed backend test table), AD-015 (frontend test table), `backend/pom.xml` (surefire `*Test`, failsafe `*IT`, JaCoCo gate), `frontend/package.json`.

| Code Layer | Required Test Type | Coverage Expectation | Location Pattern | Run Command |
| ---------- | ------------------ | -------------------- | ---------------- | ----------- |
| Entity rule and pure logic (aggregates, split, generator, parser, usage calculator, rate limiter, password policy, `PlanAuthorization`) | unit (`*Test`, no Spring, no mocks) | One test per rule and listed edge case | `backend/src/test/java/**/*Test.java` | Quick |
| Endpoint with a rule or guard; migrations; filters; config binding | integration (`*IT`, Testcontainers) | One IT per rule asserting status and `type`; a role-matrix row per endpoint | `backend/src/test/java/**/*IT.java` | Quick |
| Architecture rules | unit (`ArchitectureTest`) | Each rule green on the code and failing once on a planted violation | `backend/src/test/java/com/lcs/findraco/ArchitectureTest.java` | Quick |
| Plain CRUD endpoint, moves, renames, records with unchanged JSON | none beyond the existing suite and the role matrix | Build gate | - | Build |
| Frontend logic and service hooks | unit (AD-015 table) | Per the frontend test table | sibling `*.test.ts` | Quick (frontend) |
| Frontend containers and flows | integration (MSW only) | The decisions the task changes | sibling `*.test.tsx` | Quick (frontend) |
| Build config, CI, Dockerfile, skills, docs | none | Build gate or the task's manual check | - | Build / Docs |

## Gate Check Commands

> Generated from codebase - confirm before Execute.

| Gate Level | When to Use | Command |
| ---------- | ----------- | ------- |
| Docs | Skill and doc tasks | none; `Done when` checked against `context.md` and `design.md` |
| Quick | Per task | Backend: `./mvnw -B verify -Dtest='<touched>*Test' -Dit.test='<touched>*IT' -Dsurefire.failIfNoSpecifiedTests=false -Dfailsafe.failIfNoSpecifiedTests=false`; frontend (when touched): `pnpm exec vitest run --project=unit <touched files>` |
| Full | Not used per task (lean gates) | - |
| Build | Last task of each phase | `./mvnw -B verify`; when the phase touched the frontend also `pnpm lint && pnpm build && pnpm test` |

---

## Execution Plan

Phases run in order; tasks inside a phase run in order. Each phase is one slice (BST-04 is split in two).

### Phase 1: Disposable test database and CI gate (BST-01)

Every IT on a throwaway Postgres; the full suite gates deploy. Session ITs green before anything else (H13).

```
T1 → T2 → T3
```

### Phase 2: Supported platform (BST-02)

Boot 4.1 and Java 25 on today's code, so every failure is the upgrade's.

```
T4 → T5 → T6
```

### Phase 3: Mechanical enforcement (BST-03)

Tools first, before the big move, so the move lands formatted and checked.

```
T7 → T8 → T9 → T10
```

### Phase 4: Configuration under `app.*` and feature packages (BST-04, part 1)

Configuration records first (independent of the move), then move-only commits, then the renames.

```
T11 → T12 → T13 → T14 → T15
```

### Phase 5: Records, identity values and boundaries (BST-04, part 2)

DTOs as records, `PlanContext` as values, and the ArchUnit rules that hold the new shape.

```
T16 → T17 → T18
```

### Phase 6: Request tracing and logging (BST-13)

Request ids exist before the error contract puts them in every problem.

```
T19 → T20 → T21
```

### Phase 7: Error contract (BST-08)

One problem shape from every producer; the frontend reads `type`, never `detail`.

```
T22 → T23 → T24
```

### Phase 8: OpenAPI as the contract (BST-09)

From here on every contract change shows as a snapshot diff.

```
T25 → T26
```

### Phase 9: Cross-feature access (BST-05)

Writes through the owner, aggregate reads through read-only repositories.

```
T27 → T28
```

### Phase 10: Persistence boundary (BST-07)

OSIV off; services return responses built inside the transaction.

```
T29 → T30
```

### Phase 11: Aggregates and optimistic locking (BST-06)

Rules in the aggregate on every entry path; concurrent edits never lost.

```
T31 → T32 → T33 → T34 → T35 → T36
```

### Phase 12: Contract shape and permissions (BST-10)

Bounded inputs, no dead fields, permissions from the server.

```
T37 → T38 → T39 → T40 → T41 → T42
```

### Phase 13: Time (BST-11)

Instants in UTC, dates as calendar dates, the device zone sent on every request.

```
T43 → T44 → T45
```

### Phase 14: Migrations and database guarantees (BST-12)

Invariants in the database; precondition checks on production data first.

```
T46 → T47
```

### Phase 15: Rate limits and network exposure (BST-14)

Throttle the abuse paths; the API answers only the proxy.

```
T48 → T49 → T50
```

### Phase 16: Authentication hardening (BST-15)

Argon2id, a typeable password policy, no timing tells, a real key check.

```
T51 → T52 → T53 → T54 → T55
```

### Phase 17: CSV import (BST-16)

A pure parser per format, all or nothing, the bank's text kept.

```
T56 → T57 → T58
```

### Phase 18: Category usage from the server (BST-17)

One evaluation of limits for every screen and channel.

```
T59 → T60 → T61
```

### Phase 19: Series correctness (BST-18)

Deleted occurrences stay deleted; reads never write.

```
T62 → T63 → T64 → T65
```

### Phase 20: Plans keep their invariants (BST-19)

Nobody is left without a plan; invitations obey the rules.

```
T66 → T67 → T68 → T69
```

### Phase 21: Test coverage under the table (BST-20)

Fill what the rule slices left untested.

```
T70 → T71 → T72
```

### Phase 22: Written standards, docs and cleanup (BST-21)

Skills describe what now exists.

```
T73 → T74 → T75 → T76 → T77 → T78
```

---

## Task Breakdown

<!-- Phase 1 -->

### T1: Run ITs on a Testcontainers Postgres

**What**: Add `spring-boot-testcontainers` and `org.testcontainers:postgresql` (Boot 3.5 managed; renamed in BST-02), a `TestcontainersConfig` with a `@ServiceConnection` `postgres:16-alpine` bean imported by `AbstractIntegrationTest`, the disposable allowlist set to the container database name, and `application-test.properties` stripped of every tunnel and `dev_finsight` reference.
**Where**: `backend/src/test/java/com/lcs/findraco/support/TestcontainersConfig.java` (plus `AbstractIntegrationTest`, `application-test.properties`, `backend/pom.xml`)
**Depends on**: None
**Reuses**: `AbstractIntegrationTest` truncation and guard
**Requirement**: BST-01 (AC 1, 2, 6)

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [x] With the SSH tunnel down, `./mvnw -B verify` boots every IT on the container (run with `backend/.env` moved aside: no datasource at all)
- [x] The guard refuses a database named `findraco` (one unit case in `AbstractIntegrationTest`'s own test or a dedicated `DisposableDatabaseGuardTest`)
- [x] Stopping Docker makes the IT run fail, not skip (unreachable daemon: 177 errors, 0 skipped)
- [x] Gate passes: Quick (see Gate Check Commands)

**Tests**: integration
**Gate**: quick
**Commit**: `test(backend): run integration tests on a Testcontainers Postgres`

---

### T2: Make the session ITs green (H13)

**What**: Run `SessionIT`, `AuthenticationIT`, `UserSessionRepositoryIT`, `PasswordRecoveryIT` on the container and fix every failure in production code (revocation on logout and reset answers 401; access token lifetime 15 min).
**Where**: `backend/src/main/java/com/lcs/findraco/services/SessionService.java` (and whatever the failures point to)
**Depends on**: T1
**Reuses**: AD-009 session model
**Requirement**: BST-01 (AC 5)

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [x] The four classes pass (green on the container with no production change; revocation broken once, `SessionIT` and `PasswordRecoveryIT` failed, reverted)
- [x] Each fix has the failing assertion that proved it (no session fix needed; the suite exposed a series date drift, fixed in `1b9fba8` with three failing unit cases first)
- [x] Gate passes: Quick (see Gate Check Commands)

**Tests**: integration
**Gate**: quick
**Commit**: `fix(auth): session revocation and token lifetime under the full IT suite`

---

### T3: Gate deploy on `./mvnw -B verify`

**What**: CI backend job runs `./mvnw -B verify` (all `*Test`, `*IT`, JaCoCo); `deploy` keeps `needs` on it; `TESTING.md` loses the tunnel instructions.
**Where**: `.github/workflows/ci.yml` (and `.specs/codebase/TESTING.md`)
**Depends on**: T2
**Reuses**: AD-011 workflow
**Requirement**: BST-01 (AC 3, 4)

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [x] The job command is `./mvnw -B verify`
- [x] `deploy` still `needs` the backend job
- [ ] Verified on the first push of the branch (user pushes) — verified on first push (user)
- [x] Gate passes: Build (see Gate Check Commands)

**Tests**: none
**Gate**: build
**Commit**: `ci(backend): run the full suite with verify before deploy`

---

<!-- Phase 2 -->

### T4: Upgrade to Spring Boot 4.1 and Java 25

**What**: Parent to the latest 4.1.x, `java.version` 25, `spring-boot-starter-web` → `spring-boot-starter-webmvc`, springdoc 3.1.0, Testcontainers 2 artifacts (`testcontainers-postgresql`), Jackson 3 in our code, Security 7 and Hibernate 7 adjustments; jjwt-jackson kept unless the build conflicts (then `jjwt-orgjson`); failsafe `argLine` with an explicit `-Xmx` (OOM watch).
**Where**: `backend/pom.xml` (plus the compile fixes it forces)
**Depends on**: None in this phase (phase 1 complete)
**Reuses**: design Risks: Jackson 3, jjwt, spring-dotenv, OOM
**Requirement**: BST-02 (AC 1, 3)

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [x] `./mvnw -B verify` green with the same test count as before (no test weakened or deleted): 116 `*Test`, 177 `*IT` before and after
- [x] `/v3/api-docs` field names diffed before/after: every baseline field kept; springdoc 3 adds the recursive `children` lists the wire JSON already had (`baseline-api-docs.json`)
- [x] If `spring-dotenv` fails on Boot 4, its replacement from T54 moves here (noted in the commit): it failed, `spring.config.import` landed in T4
- [x] Gate passes: Quick (see Gate Check Commands)

**Tests**: integration
**Gate**: quick
**Commit**: `build(backend): upgrade to Spring Boot 4.1 and Java 25`

---

### T5: Layered Java 25 image

**What**: Dockerfile: `maven:3.9-eclipse-temurin-25`, `COPY pom.xml` → `mvn -B dependency:go-offline` → `COPY src` → `package -DskipTests`; runtime `eclipse-temurin:25-jre-alpine`.
**Where**: `backend/Dockerfile`
**Depends on**: T4
**Reuses**: current two-stage Dockerfile
**Requirement**: BST-02 (AC 2, 4)

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [x] `docker build` twice with a source-only change reuses the dependency layer
- [x] Gate passes: Quick (see Gate Check Commands)

**Tests**: none
**Gate**: quick
**Commit**: `build(backend): layered Java 25 image`

---

### T6: Dependabot for maven, npm and actions

**What**: Weekly, grouped per ecosystem: maven `/backend`, npm `/`, github-actions `/`.
**Where**: `.github/dependabot.yml`
**Depends on**: T5
**Reuses**: none
**Requirement**: BST-02 (AC 5)

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [ ] File validates on GitHub after the push — verified on first push (user)
- [x] Gate passes: Build (see Gate Check Commands)

**Tests**: none
**Gate**: build
**Commit**: `ci: dependabot for maven, npm and GitHub Actions`

---

<!-- Phase 3 -->

### T7: Spotless with palantir-java-format

**What**: Spotless plugin with `palantirJavaFormat` 2.96.0, `check` bound to `verify`; one formatting commit; its SHA in `.git-blame-ignore-revs`; the pre-commit hook runs `spotless:check` when backend files are staged.
**Where**: `backend/pom.xml` (plus `.git-blame-ignore-revs`, `.husky/pre-commit`)
**Depends on**: None in this phase (phase 2 complete)
**Reuses**: husky hooks (AD-011)
**Requirement**: BST-03 (AC 1–3)

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [x] A misformatted file fails `verify` (checked, reverted)
- [x] A staged misformatted file blocks the commit (checked, reverted)
- [x] Format commit listed in `.git-blame-ignore-revs`
- [x] Gate passes: Quick (see Gate Check Commands)

**Tests**: none
**Gate**: quick
**Commit**: `build(backend): spotless with palantir-java-format`

---

### T8: Enforcer and warnings as errors

**What**: maven-enforcer `bannedDependencies` (Lombok, MapStruct) and `requireJavaVersion [25,26)`; compiler `-Xlint:all`, `failOnWarning`, `-parameters`; fix every warning and remove every `@SuppressWarnings`.
**Where**: `backend/pom.xml` (plus the warning fixes)
**Depends on**: T7
**Reuses**: none
**Requirement**: BST-03 (AC 4–6, 8)

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [x] Adding Lombok fails the build (checked, reverted)
- [x] Zero warnings; `grep -r @SuppressWarnings backend/src` empty
- [x] Gate passes: Quick (see Gate Check Commands)

**Tests**: none
**Gate**: quick
**Commit**: `build(backend): enforcer rules and compiler warnings as errors`

---

### T9: Error Prone

**What**: Smoke-compile with Error Prone 2.51.0 on JDK 25 (`-XDcompilePolicy=simple`, `--should-stop=ifError=FLOW`, `-Xplugin:ErrorProne`, `.mvn/jvm.config` exports). If it works: enable, fix findings, disable false positives project-wide with a comment. If not: record the deferral in `STATE.md` and stop the task.
**Where**: `backend/pom.xml` (plus `backend/.mvn/jvm.config`)
**Depends on**: T8
**Reuses**: design Tech Decisions
**Requirement**: BST-03 (AC 7)

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [x] Either Error Prone runs on every compile with zero errors, or the deferral is recorded with the failing output
- [x] Gate passes: Quick (see Gate Check Commands)

**Tests**: none
**Gate**: quick
**Commit**: `build(backend): error prone`

---

### T10: ArchitectureTest with today's rules

**What**: ArchUnit 1.5.1 `archunit-junit5`; one `ArchitectureTest` with: controllers never access repositories, no field injection, no `@SuppressWarnings`. Later slices add their rule here in the commit that makes the code comply.
**Where**: `backend/src/test/java/com/lcs/findraco/ArchitectureTest.java`
**Depends on**: T9
**Reuses**: `CLAUDE.md` Backend rules
**Requirement**: BST-03 (AC 9)

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [x] Injecting a repository into a controller fails the test (checked, reverted)
- [x] Green on current code
- [x] Gate passes: Build (see Gate Check Commands)

**Tests**: unit
**Gate**: build
**Commit**: `test(backend): ArchUnit architecture test`

---

<!-- Phase 4 -->

### T11: Configuration records under `app.*`

**What**: `@Validated @ConfigurationProperties` records replacing every `@Value`: `JwtProperties` (`app.jwt`, was `jwt.*`), `SessionProperties`, `MailProperties`, `CorsProperties` (`app.cors.allowed-origins=${ALLOWED_ORIGINS}`), `AppProperties`; `@ConfigurationPropertiesScan`; env var names unchanged.
**Where**: `backend/src/main/java/com/lcs/findraco/config/` (records; moved with their feature in T12) plus `application.properties`, `application-test.properties`
**Depends on**: None in this phase (phase 3 complete)
**Reuses**: existing property keys
**Requirement**: BST-04 (AC 15)

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [x] `grep -r '@Value' backend/src/main` empty
- [x] An `ApplicationContextRunner` test: a missing or out-of-range value fails startup, one case per record
- [x] `.env` and Portainer env need no change
- [x] Gate passes: Quick (see Gate Check Commands)

**Tests**: unit
**Gate**: quick
**Commit**: `refactor(backend): configuration records under app.*`

---

### T12: Move shared, auth and user packages

**What**: Move-only commit (package and import lines only): `shared/{config,error,security,web}`, `auth/*` (JWT, filter, sessions, password reset, `SecurityConfig`), `user/*`, into layer sub-packages.
**Where**: `backend/src/main/java/com/lcs/findraco/` (moves)
**Depends on**: T11
**Reuses**: design Target structure
**Requirement**: BST-04 (AC 1, 2)

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [x] `git log --follow` tracks every moved file
- [x] Suite green
- [x] Gate passes: Quick (see Gate Check Commands)

**Tests**: none
**Gate**: quick
**Commit**: `refactor(backend): move shared, auth and user into feature packages`

---

### T13: Move and rename plan, category, transaction and dashboard

**What**: Move commit, then a rename commit: `FinancialTransactionCategory*` → `category.*` `Category*`, `FinancialTransaction*` → `transaction.*` `Transaction*`, `PlanAuthorization` to `plan.service`, specifications into repositories, `DateUtils` to its users, `ApiRoutes` split into `XxxRoutes` per feature with `BASE`/`PLAN` in `shared.web`.
**Where**: `backend/src/main/java/com/lcs/findraco/` (moves and renames)
**Depends on**: T12
**Reuses**: design Target structure
**Requirement**: BST-04 (AC 1, 2, 4)

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [x] No class named `FinancialTransaction*`
- [x] Old packages (`controllers`, `services`, `models`, …) gone
- [x] Suite green
- [x] Gate passes: Quick (see Gate Check Commands)

**Tests**: none
**Gate**: quick
**Commit**: `refactor(backend): transaction and category feature packages with one name per domain`

---

### T14: Rename tables and constraints

**What**: `V13__rename_transactions_and_categories.sql`: precondition block (old names present, new absent, else `RAISE EXCEPTION`), table, sequence, index and constraint renames to `pk_/uk_/fk_/idx_/ck_`; `@Table` and quoted constraint names in entities follow.
**Where**: `backend/src/main/resources/db/migration/V13__rename_transactions_and_categories.sql`
**Depends on**: T13
**Reuses**: V11/V12 naming
**Requirement**: BST-04 (AC 5, 6)

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [x] `MigrationsIT` green
- [x] A test database pre-created with `transactions` makes V13 abort with its message
- [x] Gate passes: Quick (see Gate Check Commands)

**Tests**: integration
**Gate**: quick
**Commit**: `feat(db): rename transaction and category tables and constraints`

---

### T15: Rename routes and move the frontend to them

**What**: `/financial-transaction` → `/transaction`, `/financial-transaction-category` → `/category`; frontend services and MSW handlers renamed to `transaction`/`category`; old paths 404.
**Where**: `backend/src/main/java/com/lcs/findraco/transaction/controller/TransactionRoutes.java` (plus `CategoryRoutes`, `frontend/src/api/services/*`)
**Depends on**: T14
**Reuses**: frontend service hooks
**Requirement**: BST-04 (AC 13, 14)

**Tools**: MCP: NONE · Skill: `/api-integration`

**Done when**:

- [x] An IT: each old path answers 404
- [x] Frontend service tests green on the new paths
- [x] Frontend beta bumped in its own commit
- [x] Gate passes: Build (see Gate Check Commands)

**Tests**: integration
**Gate**: build
**Commit**: `feat(api): transaction and category routes`

---

<!-- Phase 5 -->

### T16: DTOs as records with the S10 names

**What**: Every request/response DTO becomes a `record` named `CreateXxxRequest`/`UpdateXxxRequest`/`XxxResponse`/`XxxSummaryResponse`, one per file, no nested types, `static from(entity)` on responses; `PagedResponseDto` → `PageResponse<T>`.
**Where**: `backend/src/main/java/com/lcs/findraco/*/request/`, `backend/src/main/java/com/lcs/findraco/*/response/`
**Depends on**: None in this phase (phase 4 complete)
**Reuses**: existing DTO fields
**Requirement**: BST-04 (AC 7, 12)

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [x] `/v3/api-docs` field names diffed against the BST-02 baseline: identical
- [x] Suite green
- [x] Gate passes: Quick (see Gate Check Commands)

**Tests**: integration
**Gate**: quick
**Commit**: `refactor(backend): request and response records`

---

### T17: `PlanContext` and `AuthenticatedUser` as values

**What**: `PlanContext(planId, userId, role)` in `plan.service`, resolver in `plan.controller` self-registered via `WebMvcConfigurer`; `AuthenticatedUser(id)` in `shared.security`; services take ids and reload inside their transaction; parameter order ids → request → identity.
**Where**: `backend/src/main/java/com/lcs/findraco/plan/service/PlanContext.java` (plus resolver and service signatures)
**Depends on**: T16
**Reuses**: `PlanContextArgumentResolver` membership check
**Requirement**: BST-04 (AC 9, 11)

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [x] Non-member request answers 404 before the controller (existing IT)
- [x] Suite green
- [x] Gate passes: Quick (see Gate Check Commands)

**Tests**: integration
**Gate**: quick
**Commit**: `refactor(backend): plan context and authenticated user as values`

---

### T18: ArchUnit rules for the structure

**What**: Add: `shared` depends on no feature; cross-feature only via `service`/`model`; allowed sub-package list; DTO names unique, suffix matches package, no nested types; no entity received from an argument resolver. Update `CLAUDE.md` Backend lines for these rules.
**Where**: `backend/src/test/java/com/lcs/findraco/ArchitectureTest.java`
**Depends on**: T17
**Reuses**: T10
**Requirement**: BST-04 (AC 3, 8, 10)

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [x] Each rule fails once on a planted violation (checked, reverted)
- [x] Green on the code
- [x] Gate passes: Build (see Gate Check Commands)

**Tests**: unit
**Gate**: build
**Commit**: `test(backend): architecture rules for feature packages and DTOs`

---

<!-- Phase 6 -->

### T19: Request id filter

**What**: `RequestIdFilter` (highest order): accept `X-Request-Id` matching `[A-Za-z0-9-]{1,64}` or generate a UUID; MDC + response header; `%X{requestId}` in `logback-spring.xml`.
**Where**: `backend/src/main/java/com/lcs/findraco/shared/web/RequestIdFilter.java` (plus `logback-spring.xml`)
**Depends on**: None in this phase (phase 5 complete)
**Reuses**: none
**Requirement**: BST-13 (AC 1)

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [x] IT: header echoed when valid, replaced when invalid, generated when absent
- [x] Gate passes: Quick (see Gate Check Commands)

**Tests**: integration
**Gate**: quick
**Commit**: `feat(backend): request id on every request`

---

### T20: One log line per request

**What**: `RequestLogFilter`: INFO `method route status durationMs userId planId`, route from the best-matching pattern; 4xx without stack traces, 5xx at ERROR.
**Where**: `backend/src/main/java/com/lcs/findraco/shared/web/RequestLogFilter.java`
**Depends on**: T19
**Reuses**: T22 later logs 5xx causes
**Requirement**: BST-13 (AC 2, 4)

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [x] IT with a captured appender: one line per request with the template, not the raw path
- [x] Gate passes: Quick (see Gate Check Commands)

**Tests**: integration
**Gate**: quick
**Commit**: `feat(backend): request log line`

---

### T21: Log hygiene

**What**: Remove e-mail and stack trace logging from the JWT filter, the reset link log outside `local`; `show-sql=false` in base properties, `true` in `application-local.properties`; `LogHygieneIT` over login and reset flows.
**Where**: `backend/src/test/java/com/lcs/findraco/shared/LogHygieneIT.java` (plus `JwtAuthenticationFilter`, `EmailService`, properties)
**Depends on**: T20
**Reuses**: captured appender from T20
**Requirement**: BST-13 (AC 3, 5)

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [x] `LogHygieneIT` asserts no password, token, e-mail or link in the log
- [x] Gate passes: Build (see Gate Check Commands)

**Tests**: integration
**Gate**: build
**Commit**: `fix(backend): no personal data or secrets in logs`

---

<!-- Phase 7 -->

### T22: ProblemDetail infrastructure and one handler

**What**: `ProblemType` (slugs, `uri()`), `DomainException` (type, status, field, detail), `Problems.of` (adds `requestId`), `GlobalExceptionHandler` rewritten (400 unreadable, 422 validation with `errors[{field, code, message}]`, 409 optimistic lock, 500 fixed), problem entry point and access-denied handler; every `XxxExceptions` class extends `DomainException`; `ErrorResponseDto` and `FieldErrorDto` deleted.
**Where**: `backend/src/main/java/com/lcs/findraco/shared/error/` (plus each feature's `exception/`)
**Depends on**: None in this phase (phase 6 complete)
**Reuses**: existing exception semantics
**Requirement**: BST-08 (AC 1–8, 10, 13)

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [x] `ProblemProducersIT`: advice, 401, 403 and a filter all answer `application/problem+json` with a URN `type` and `requestId`
- [x] A field error answers 422 with `code` = constraint name
- [x] Malformed JSON answers 400
- [x] `ArchitectureTest`: `shared` depends on no feature (`noClasses` in `..shared..` depend on any feature package), green once `GlobalExceptionHandler` no longer imports feature exceptions or `SessionCookies` (handed off by T18)
- [x] Gate passes: Quick (see Gate Check Commands)

**Tests**: integration
**Gate**: quick
**Commit**: `feat(api): ProblemDetail error contract`

---

### T23: Named exceptions instead of `IllegalArgumentException`

**What**: Each of the 22 user-facing `IllegalArgumentException` throws becomes a named `DomainException`; ArchUnit rule forbids new ones.
**Where**: `backend/src/main/java/com/lcs/findraco/*/service/` (throw sites)
**Depends on**: T22
**Reuses**: T22
**Requirement**: BST-08 (AC 9)

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [x] `grep -rn 'new IllegalArgumentException' backend/src/main` empty
- [x] ArchUnit rule fails on a planted throw (checked, reverted)
- [x] Existing ITs updated to assert `type` and the semantic status
- [x] Gate passes: Quick (see Gate Check Commands)

**Tests**: integration
**Gate**: quick
**Commit**: `refactor(backend): named exceptions for user errors`

---

### T24: Frontend problem map

**What**: `problems.ts`: `type` → copy map with a generic message per status (including `rate-limited` and `stale-version`), toasts show copy plus `requestId`, never `detail`; forms read 422 `errors`; category delete branches on `type` (X2); MSW handlers return problem bodies.
**Where**: `frontend/src/api/utils/problems.ts` (plus `findracoApi`, form error mapping, handlers)
**Depends on**: T23
**Reuses**: `buildMutationOptions`
**Requirement**: BST-08 (AC 11, 12); BST-14 (AC 4)

**Tools**: MCP: NONE · Skill: `/api-integration`

**Done when**:

- [x] Unit tests: known type, unknown type → status fallback, 422 field mapping
- [x] Category delete flow test tells both 409s apart
- [x] Frontend beta bumped
- [x] Gate passes: Build (see Gate Check Commands)

**Tests**: unit
**Gate**: build
**Commit**: `feat(web): error copy from problem type`

---

<!-- Phase 8 -->

### T25: springdoc customizers

**What**: Required unless `@Nullable`; `PlanContext` hidden and `planId` as path parameter; enums as `$ref` (`sortBy` an enum); success status from `@ResponseStatus`; common problem responses (403 on plan routes); `ProblemType` schema.
**Where**: `backend/src/main/java/com/lcs/findraco/shared/openapi/` 
**Depends on**: None in this phase (phase 7 complete)
**Reuses**: `OpenApiConfig`
**Requirement**: BST-09 (AC 1–6)

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [x] IT asserts each convention on one sample operation and one sample schema
- [x] Gate passes: Quick (see Gate Check Commands)

**Tests**: integration
**Gate**: quick
**Commit**: `feat(api): OpenAPI conventions`

---

### T26: Committed OpenAPI snapshot

**What**: `OpenApiSnapshotIT` normalises `/v3/api-docs`, compares it with `backend/openapi.json`, prints a diff; `-Dopenapi.update=true` rewrites it.
**Where**: `backend/src/test/java/com/lcs/findraco/shared/OpenApiSnapshotIT.java` (plus `backend/openapi.json`)
**Depends on**: T25
**Reuses**: T25
**Requirement**: BST-09 (AC 7)

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [x] Renaming a response field without regenerating fails with the diff (checked, reverted)
- [x] Gate passes: Build (see Gate Check Commands)

**Tests**: integration
**Gate**: build
**Commit**: `test(api): committed OpenAPI snapshot`

---

<!-- Phase 9 -->

### T27: Read-only report repositories

**What**: Dashboard report queries move to `DashboardReportRepository extends Repository<Transaction, Long>`; category spend queries to `CategorySpendingRepository`.
**Where**: `backend/src/main/java/com/lcs/findraco/dashboard/repository/DashboardReportRepository.java` (plus `CategorySpendingRepository`)
**Depends on**: None in this phase (phase 8 complete)
**Reuses**: existing JPQL
**Requirement**: BST-05 (AC 2)

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [x] Dashboard and category spending ITs green unchanged
- [x] Gate passes: Quick (see Gate Check Commands)

**Tests**: integration
**Gate**: quick
**Commit**: `refactor(backend): read-only report repositories`

---

### T28: Category delete through `TransactionService`

**What**: `TransactionService.reassignCategory`/`deleteByCategory` used by category delete; ArchUnit: a repository over another feature's entity extends `Repository` only and has no `@Modifying`.
**Where**: `backend/src/main/java/com/lcs/findraco/category/service/CategoryService.java` (plus `TransactionService`)
**Depends on**: T27
**Reuses**: T27
**Requirement**: BST-05 (AC 1, 3)

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [x] `CategoryDeleteIT` green
- [x] Adding `save` to the dashboard repository fails ArchUnit (checked, reverted)
- [x] `ArchitectureTest.CROSS_FEATURE_LAYERS` drops `repository`: no class depends on another feature's repository package, and the S2 read-only repository rule above covers repositories over another feature's entity (handed off by T18; the category usage counts move behind `TransactionService` too)
- [x] Gate passes: Build (see Gate Check Commands)

**Tests**: integration
**Gate**: build
**Commit**: `refactor(backend): category delete through the transaction owner`

---


**Batch 5 deviations (T22–T28, unattended run)**

- T22 status rule: 422 when the request must change (including a reference to a parent, target or member that does not fit), 409 when stored state must change first (subcategories, use, last plan/owner, taken e-mail, used/revoked/expired invitation, stale version). Invitations moved from 410 to 409; a missing required field of a `XxxFilter` is Bean Validation, so 422. The servlet error page (`ProblemErrorController`) is the "filter" producer; `/error` is public and the request id survives the error dispatch. Validation messages are pinned to English (`spring.web.locale=en`, fixed resolver).
- T22 kept a transitional `IllegalArgumentException` → 400 mapping for one commit; T23 removed it (escaped ones now answer 500).
- T25: `PlanContext` is hidden by the plan feature (`PlanWebConfig`, `SpringDocUtils.addRequestWrapperToIgnore`), since `shared` cannot reference it; the shared customizer only adds `planId`. A `@Nullable` response field is optional and also typed with `null` (the API writes nulls). Conditional 200/201 endpoints (CSV import, accept invitation) declare both with `@ApiResponse`. The snapshot also drops `info.version`.
- T28: `TransactionCategoryService` (transaction feature) holds `countReferences`/`reassignCategory`, because `TransactionService` already depends on `CategoryService` (a constructor cycle). No `deleteByCategory`: a category in use is never deleted without a target, so nothing would call it.

<!-- Phase 10 -->

### T29: OSIV off, services return responses

**What**: `spring.jpa.open-in-view=false`; every `@ManyToOne` LAZY; controller-called service methods return `XxxResponse.from(entity)` built in the transaction; cross-feature methods return entities or nothing.
**Where**: `backend/src/main/java/com/lcs/findraco/*/service/` (plus `application.properties`, entities)
**Depends on**: None in this phase (phase 9 complete)
**Reuses**: T16 `from` factories
**Requirement**: BST-07 (AC 1–4)

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [x] Suite green with OSIV off
- [x] No controller maps an entity
- [x] Gate passes: Quick (see Gate Check Commands)

**Tests**: integration
**Gate**: quick
**Commit**: `refactor(backend): OSIV off and responses built in services`

---

### T30: Entity graphs and a fixed statement count

**What**: `@EntityGraph` on list finders, collections by a second id query; `StatementCountIT` with Hibernate statistics (test profile only).
**Where**: `backend/src/test/java/com/lcs/findraco/transaction/StatementCountIT.java` (plus repository finders)
**Depends on**: T29
**Reuses**: T29
**Requirement**: BST-07 (AC 5)

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [x] 5 and 20 rows issue the same number of statements
- [x] Gate passes: Build (see Gate Check Commands)

**Tests**: integration
**Gate**: build
**Commit**: `perf(backend): fixed queries per transaction page`

---

<!-- Phase 11 -->

### T31: Transaction aggregate

**What**: `Transaction.create(TransactionDraft)`, `edit`, `replaceSplit`, `replaceItems`; no public setters; children change through the root; H1 (at least one participant) and H5 (EXACT shares present, non-negative) as named exceptions.
**Where**: `backend/src/main/java/com/lcs/findraco/transaction/model/Transaction.java` (plus `TransactionDraft`)
**Depends on**: None in this phase (phase 10 complete)
**Reuses**: `SplitResolver`
**Requirement**: BST-06 (AC 1, 4, 6)

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [x] Unit tests per rule (no Spring)
- [x] Gate passes: Quick (see Gate Check Commands)

**Tests**: unit
**Gate**: quick
**Commit**: `refactor(transaction): transaction aggregate guards its rules`

---

### T32: Series aggregate

**What**: `RecurrenceDefinition.create`, `editPattern` with the end-before-start rule (H3) and category-type match (H7) on create and edit.
**Where**: `backend/src/main/java/com/lcs/findraco/transaction/model/RecurrenceDefinition.java`
**Depends on**: T31
**Reuses**: series create validation
**Requirement**: BST-06 (AC 1, 5, 7)

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [x] Unit tests per rule
- [x] Edit and create answer the same `type` (IT)
- [x] Gate passes: Quick (see Gate Check Commands)

**Tests**: unit
**Gate**: quick
**Commit**: `refactor(transaction): series aggregate guards its rules`

---

### T33: Category aggregate

**What**: `Category.create`, `rename`, `changeType(inUse)` → 409 when in use (H7), `setLimit`.
**Where**: `backend/src/main/java/com/lcs/findraco/category/model/Category.java`
**Depends on**: T32
**Reuses**: none
**Requirement**: BST-06 (AC 1, 8)

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [x] Unit tests per rule
- [x] IT: type change while used answers 409
- [x] Gate passes: Quick (see Gate Check Commands)

**Tests**: unit
**Gate**: quick
**Commit**: `refactor(category): category aggregate guards its rules`

---

### T34: Services use the aggregates on every path

**What**: HTTP and CSV paths create through the aggregates; child repositories lose write methods; ArchUnit: `model` depends on no service/repository/request/security, guarded entities have no public setters, children have no write repository.
**Where**: `backend/src/main/java/com/lcs/findraco/transaction/service/` (plus category services, `ArchitectureTest`)
**Depends on**: T33
**Reuses**: T31–T33
**Requirement**: BST-06 (AC 2, 3, 4)

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [x] IT: a CSV row and an HTTP request both reject a transaction without participants
- [x] Each new ArchUnit rule fails once (checked, reverted)
- [x] Gate passes: Quick (see Gate Check Commands)

**Tests**: integration
**Gate**: quick
**Commit**: `refactor(backend): every entry path through the aggregates`

---

### T35: Optimistic locking

**What**: `V15__optimistic_locking_versions.sql`; `@Version` on the three roots; `version` in responses and required in edit requests; stale → 409 `stale-version`.
**Where**: `backend/src/main/resources/db/migration/V15__optimistic_locking_versions.sql` (plus entities, DTOs)
**Depends on**: T34
**Reuses**: T22 lock mapping
**Requirement**: BST-06 (AC 9, 10)

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [x] IT: two edits with the same version → second 409 and the first's split survives
- [x] Snapshot regenerated
- [x] Gate passes: Quick (see Gate Check Commands)

**Tests**: integration
**Gate**: quick
**Commit**: `feat(api): optimistic locking on transactions, series and categories`

---

### T36: Frontend sends versions and handles stale edits

**What**: Edit payloads carry `version`; on `stale-version` the shared mutation handler shows the copy and invalidates the query.
**Where**: `frontend/src/api/utils/buildMutationOptions.ts` (plus form payload mappers)
**Depends on**: T35
**Reuses**: T24 map
**Requirement**: BST-06 (AC 11)

**Tools**: MCP: NONE · Skill: `/form-creation`, `/api-integration`

**Done when**:

- [x] Flow test: a 409 stale-version shows the copy and refetches
- [x] Frontend beta bumped
- [x] Gate passes: Build (see Gate Check Commands)

**Tests**: integration
**Gate**: build
**Commit**: `feat(web): stale edit warning and reload`

---

**Batch 6 deviations (T29–T36, unattended run)**

- T29: the commit subject says "open-in-view" instead of "OSIV": the commit-msg hook rejects a subject starting with an upper-case word. ArchitectureTest gains `controllersNeverMapEntities` (a controller depends on no `@Entity`), which makes "no controller maps an entity" mechanical. Controller-facing methods renamed where the old name returned an entity: `PlanService.listPlans`/`getPlan` (the old `getMembership` is private), `TransactionService.getById`; `PlanInvitationService.AcceptResult` carries the response.
- T30: the 5-versus-20 comparison reads a page of 5 and a page of 20 out of 25 rows, so both pages are full and both run the total count (Spring Data skips the count on a short first page). Category list and plan member list got the same treatment (entity graph, member limits by a second query). Series occurrence lists (`findAllByPlanAndSeriesId`) get an entity graph for their to-one associations only; their participants still load per row (bounded by the 120-occurrence cap).
- T31: `SplitResolver` moved from `transaction.service` (a bean) to `transaction.model` (plain class used by the aggregates), its test moved with it unchanged apart from the package; it gained `split(amount, mode, shares)` over `Share` values, which checks H1 (`participants-required`), duplicates and H5 (`exact-share-invalid`, also inside the EXACT resolution, which used to throw an NPE → 500). The aggregate API is `create(TransactionDraft)`, `edit(details, mode, shares, items)` (the PUT full replace), `edit(details, mode, shares)` (series stamping, keeps items and re-checks them), `replaceSplit`, `replaceItems`; `TransactionDraft` = plan, creator, `TransactionDetails`, split, items, `externalId`, series. Contract change: an explicit empty `participants` list now answers 422 `participants-required` (omitted still means "the creator pays it all"); the frontend never sends `[]`. Because the setters are gone, every path (HTTP, series generation, top-up, CSV) already creates through `Transaction.create` in T31; the CSV path gives each row the importer as its only participant (the H1 fix), ahead of T34. `createSeries` now saves the definition before generating, so every occurrence is created attached to it.
- T32: `RecurrenceDefinition.create(SeriesDraft)` owns every creation rule (parcels required, current parcel in range, interval required, H3, H7, the split) and `editPattern(SeriesPattern)` repeats H3, H7 and the split, comparing the category with the series' own type (the old edit compared it with the request's `type`). The series id is generated by `create`. Two more intention methods replace setters the services used: `markGeneratedThrough` (create, edit, top-up) and `shortenTo` (delete "this and following"). `DateUtils` is gone: its only rule now lives in the aggregates. `except(LocalDate)` is left to BST-18 (T62), which adds the exceptions it records.
- T33: `setLimit` is `changeLimits(spendingLimit, memberLimits)`: a public `set…` method would break the "no public setters" rule, and the plain and per-member limits are one rule (per-member limits clear the plain one; none on income or owned categories; one per member), so they change together (null member limits keep the stored ones). The other setters the service used became `moveUnder` (parent rules: itself, a subcategory, another type) and `assignOwner` (roots only); rules that need the repository or the plan's members (subcategories block type and parent changes, former members' entries and owners, a child's member limits blocking an owner) stay in `CategoryService`. New problem `category-type-change-in-use` (409, field `type`), with frontend copy. `CategoryMemberLimit` is a child of the root too (package-private constructor, no setters).
- T34: the services already went through the aggregates since T31–T33 (removing the setters forced it), so T34 carries the guards: `TransactionItemRepository` is gone (its count and bulk category move are on `TransactionRepository`, the root's), `CategoryMemberLimitRepository` extends `Repository` with reads only, and three ArchUnit rules (`modelsTakeDomainValuesOnly`, `guardedEntitiesHaveNoPublicSetters`, `aggregateChildrenHaveNoWriteRepository`), each failing once on a planted violation (checked, reverted). "A CSV row rejects a transaction without participants": a CSV row has no participants of its own to leave empty (the importer is always its participant), so `TransactionEntryPathsIT` proves the HTTP path answers 422 `participants-required` for an empty list and that no imported row is stored without a participant (the importer at 100%), plus 422 `exact-share-invalid` for an EXACT split with a missing share (AC 6). `CategoryMemberLimit` counts as an aggregate child, beside the three the design lists.
- T35: an edit compares the sent `version` with the loaded one (`StaleVersionException`, a `shared.error` `DomainException` like `MalformedRequestException`, 409 `stale-version`, field `version`) and then takes `PESSIMISTIC_FORCE_INCREMENT` on the root: a change to the children alone (a split, items, member limits) leaves the root clean, so without the forced bump a second editor holding the same version would overwrite the first. The forced bump also makes the version move by more than one per edit (clients only compare it). Edit responses are built after a flush so they carry the new version. A series edit compares the definition's version (what the edit form reads from `GET /series/{id}`), also for "this one". Edit requests carry `version` as a required `Long`; deletes take none. The category delete's bulk reassign does not bump the moved rows' versions (JPQL bulk update). Test helpers send the stored version (`Fixtures.transactionVersion`/`categoryVersion`/`seriesVersion`) unless a test sets its own; the role matrix sends 0 for rows it has just created.
- T36: `buildMutationOptions` reads the query client from TanStack's mutation context and, on `stale-version`, invalidates every query (the edited item can sit in several lists; a stale conflict is rare) and calls a new `onStale` option after the shared toast. The transaction drawer (plain and series edits) and the category sheet pass `onStale` to close, so the user reopens the reloaded item instead of retrying on the old version. `version` is required on `Transaction`, `Category` and `RecurrenceDefinitionResponse`, so test and story fixtures gained it, and the transaction form's category schema carries it too (its values are `Category` objects). The flow test lives in `TransactionsPage.test.tsx` (the container with the real `Toaster`); payload tests of `toInlineSavePayload`/`toSeriesEditPayload` and the service tests expect the version in the body. Noticed, not changed: `toInlineSavePayload` sends no `items`, so a table cell edit clears a transaction's items on the full-replace PUT.

<!-- Phase 12 -->

### T37: Dead fields and JSON names

**What**: Drop `categoryBreakdown` and `monthlyTrend` from the dashboard summary; JSON names equal component names (`isDefault`); frontend types follow.
**Where**: `backend/src/main/java/com/lcs/findraco/dashboard/response/DashboardSummaryResponse.java` (plus `CategoryResponse`, frontend types)
**Depends on**: None in this phase (phase 11 complete)
**Reuses**: none
**Requirement**: BST-10 (AC 1, 2)

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [x] Snapshot diff shows only these changes
- [x] Frontend build green
- [x] `ArchitectureTest` cross-feature rule: another feature's `response` is reachable only from a `response` package (a response embedding another feature's response, S10); green once `DashboardService` no longer reads `CategorySpendingResponse` (handed off by T18)
- [x] Gate passes: Quick (see Gate Check Commands)

**Tests**: integration
**Gate**: quick
**Commit**: `refactor(api): remove unused dashboard fields`

---

### T38: Composed series edit request

**What**: `UpdateSeriesRequest(scope, pivotOccurrenceId, series: CreateSeriesRequest)`; frontend payload follows.
**Where**: `backend/src/main/java/com/lcs/findraco/transaction/request/UpdateSeriesRequest.java` (plus frontend series payload)
**Depends on**: T37
**Reuses**: `CreateSeriesRequest`
**Requirement**: BST-10 (AC 3)

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [x] `SeriesEditIT` green on the new shape
- [x] Frontend series edit test green
- [x] Frontend beta bumped
- [x] Gate passes: Quick (see Gate Check Commands)

**Tests**: integration
**Gate**: quick
**Commit**: `feat(api): series edit request composes the create request`

---

### T39: Bounded inputs and narrower enums

**What**: `@Size` on every request `String`/`List` (≤ column length), money `@Digits(fraction = 2)`, `spendingLimit` `@PositiveOrZero`, `parcelsNumber` bounded; `TransferredOwnerRole` and an invitation role enum without OWNER (H9 part, H11); ArchUnit `@Size` rule.
**Where**: `backend/src/main/java/com/lcs/findraco/*/request/` 
**Depends on**: T38
**Reuses**: column lengths in migrations
**Requirement**: BST-10 (AC 4–6); BST-19 (AC 5)

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [x] IT per bound class: over-long string, 3 fraction digits, negative limit, OWNER role → 422
- [x] ArchUnit rule fails on an unbounded field (checked, reverted)
- [x] Gate passes: Quick (see Gate Check Commands)

**Tests**: integration
**Gate**: quick
**Commit**: `feat(api): bounded request inputs`

---

### T40: `PlanAuthorization` queries and guards

**What**: Each rule is `canX(...)`; each `requireX` is `if (!canX) throw`.
**Where**: `backend/src/main/java/com/lcs/findraco/plan/service/PlanAuthorization.java`
**Depends on**: T39
**Reuses**: `PlanAuthorizationTest`
**Requirement**: BST-10 (AC 8)

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [x] Unit test per rule and role
- [x] Gate passes: Quick (see Gate Check Commands)

**Tests**: unit
**Gate**: quick
**Commit**: `refactor(plan): authorization as queries and guards`

---

### T41: Permissions in responses and the role matrix

**What**: `PlanPermissionsResponse` on `PlanResponse`, `TransactionPermissionsResponse` on `TransactionResponse`; `PlanAuthorizationMatrixIT` asserts flag false ⇔ endpoint refuses, for every role and action.
**Where**: `backend/src/test/java/com/lcs/findraco/plan/PlanAuthorizationMatrixIT.java` (plus responses)
**Depends on**: T40
**Reuses**: T40
**Requirement**: BST-10 (AC 7, 9)

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [x] Matrix green for owner, editor, contributor, viewer, non-member
- [x] Snapshot regenerated
- [x] Gate passes: Quick (see Gate Check Commands)

**Tests**: integration
**Gate**: quick
**Commit**: `feat(api): permission flags in plan and transaction responses`

---

### T42: Frontend reads permission flags

**What**: `usePlanPermissions` reads `activePlan.permissions`; row actions read `transaction.permissions`; all false while loading; the mirror logic goes.
**Where**: `frontend/src/hooks/usePlanPermissions.ts` (plus row actions)
**Depends on**: T41
**Reuses**: existing hook API
**Requirement**: BST-10 (AC 10, 11)

**Tools**: MCP: NONE · Skill: `/api-integration`

**Done when**:

- [x] Flow test: a contributor sees no edit or delete on another member's row
- [x] Frontend beta bumped
- [x] Gate passes: Build (see Gate Check Commands)

**Tests**: integration
**Gate**: build
**Commit**: `feat(web): permissions from the server`

---

**Batch 7 deviations (T37–T42 plus two fixes, unattended run)**

- T37: the dashboard's `categoryBreakdown` was its only user of `CategorySpendingService.computeOverview` and `CategorySpendingAssembler.assembleOverview` (the Overview reads `GET /category/spending`), so both went with `CategoryBreakdownResponse`, along with the overview-only listing rule (spend-descending order, only active or limited categories). Their unit tests that proved the item partition now call `assemble` (the order assertion of the worked example went with the order rule); the three tests of the overview-only listing went with it. `DashboardPartitionIT` reads the partition from the category spending tree and the totals from the dashboard; its member-filter case became "member rows follow the item portions", because the spending endpoint has no member filter (the member-filter branch of `compute`/`assemble` is now reachable from unit tests only, a cleanup candidate). `monthlyTrend` code stays: `GET /dashboard/trend` uses it. The frontend `PlanResponse` wire type and `mapPlan` are gone (the wire shape is now `Plan`). Two guards beyond the task: ArchUnit `dtosKeepTheirComponentNames` (no `@JsonProperty` in a DTO) for AC 2, and the OpenAPI customizer no longer reads `@JsonProperty`. CLAUDE.md's cross-feature line follows the narrowed rule.
- T38: `version` stays on the outer request (it is the definition's version, not part of the series). Field errors of the series read `series.<field>` (`SeriesEditIT.anEditValidatesItsSeriesLikeTheCreate`).
- T39: `parcelsNumber` is bounded 1..120 on the transaction requests: no column check exists, the series form has no maximum, and the series requests already had `@Max(120)` (the 120-occurrence cap), so 120 is the real bound, not the design's 420. A series description is bounded at 245, the 255 column minus the longest installment suffix ` (120/120)`. Passwords are bounded at 128 (BST-15 refines them); list bounds are 50 participants, 50 member limits, 100 items (no column to follow; generous for a personal plan). Filter strings got `@Size` too (the ArchUnit rule covers every request package). The narrowed enums are `plan.model.InvitationRole` and `TransferredOwnerRole` (enums cannot live in `request`, which holds records only); they implement `shared.error.NarrowedEnum`, and a value outside such an enum answers 422 `validation-failed` on its field (code `NarrowedEnum`) while any other unknown enum value stays 400 `malformed-request` (T22's `anUnknownEnumValueAnswers400` unchanged). The frontend request types use `GrantableRole` and the constraint copy gained `NarrowedEnum`.
- T40: `requireOwner` was renamed `requireCanManagePlan` (its query is `canManagePlan`). The modify guard keeps its two exceptions (contributor → `cannot-modify-others-transaction`, viewer → insufficient role), chosen after the query is false.
- T41: edit and delete share one rule today, so both flags come from `canModifyTransaction`. The non-member row of the matrix has no flags to read (404), so its flags count as false and the test checks every call is refused. The agreement test failed once on a planted wrong `delete` flag (checked, reverted). The matrix also checks `isDefault` on the wire (T37 AC 2).
- T42: row actions read `transaction.permissions`: Edit and Delete buttons, every inline cell (read-only display without `edit`), the participants cell, the mobile row tap (disabled) and the drawer's Delete. Duplicate stays on every row (it creates, so it follows `createTransactions` through the drawer). The role-matrix tests of the hook went with the mirror; the hook test now proves the flags are read, not computed, and the loading cases. `PlanMembersList` still computes the last-owner rule on the client (member management, not a permission flag; left for BST-19). New `ReadOnly` story on `TransactionCells`.
- Fix (inline items, `d44065c`): the contract is now explicit: `items` is required on `UpdateTransactionRequest` (omitted → 422 `validation-failed` on `items`, stored items kept; `[]` removes them); create keeps it optional; omitted `participants` keep their T31 meaning. The inline payload sends the stored items back. Noticed, not changed: neither the drawer nor a cell edit sends `endDate` or `parcelsNumber`, so a PUT clears them on an installment occurrence (they only label the row today).
- Fix (reassignment versions, `d4c95df`): `UPDATE VERSIONED` on the transaction and series-definition moves, plus a bump of every transaction whose item moves (before the items move). A row both in the category and holding an item in it moves by two (clients only compare versions).
- One beta bump for the batch (`1.0.0-beta.16`), as the coordinator allowed, instead of one per frontend task.

**Batch 8 deviations (T43–T47 plus one fix, unattended run)**

- T43: `Clock` is `systemUTC()`; the JWT service now takes the `Clock` too (it called `Instant.now()`), and the ITs read "today" from `fixtures.today()` (the application clock) instead of a per-instance `LocalDate.now()`. The ArchUnit rule `timeComesFromTheInjectedClockInUtc` refuses any `java.time` `now` that is not `now(Clock)`, `ZoneId.systemDefault()`, `Clock.systemDefaultZone()` and `TimeZone.getDefault()`; it failed on a planted `Instant.now()` (checked, reverted). The whole suite ran green once with `-DargLine=-Duser.timezone=Pacific/Kiritimati` (not made permanent). Server-side "today" (top-up, dashboard) is still the UTC date, not the user's zone: the ACs only store the zone; using it to pick "today" is a later step. The invitation `expiresAt` request is now an instant, so the frontend sends `new Date(local).toISOString()` (T45). `DEPLOY.md` carries the `docker exec findraco-api date` check.
- T44: a header is valid when it is an id in `ZoneId.getAvailableZoneIds()` (stricter than `ZoneId.of`, which accepts offsets like `+03:00`); an invalid header is ignored, an invalid or missing zone in `PATCH /user/me/time-zone` with `PINNED` answers 400 `malformed-request` on `zone` (no new problem slug). `UserResponse` gained `timeZone` and `timeZoneMode`. The interceptor reads the user the JWT filter already loaded, so a matching header costs no query. `Time-Zone` was added to the CORS allowed headers (T45 commit); without it a cross-origin dev build would fail its preflight.
- T45: there was no profile screen, so the zone setting is a "Time zone" item in the avatar menu opening a dialog (automatic or pinned plus a zone list from `Intl.supportedValuesOf`); `tsconfig.app.json` gained the `ES2022.Intl` lib for it. Beta bumped once for the batch (`1.0.0-beta.17`).
- T46: besides the AC constraints, V16 renames the primary keys and the checks that still had default names to `pk_`/`ck_`, and the foreign keys of the other tables to `fk_<table>_<column>`; unique and index names of earlier migrations (`uk_cml_*`, `idx_txn_*`, `idx_recdef_*`) already carry a valid prefix and were left. New: `uk_users_email`, enum checks on `transactions.split_mode` and the series enums, amount `> 0` and `parcels_number` 1..420 (the DB is wider than the request's 1..120). `ArchitectureTest.entitiesCarryNoSchemaAnnotations` covers AC 1 and failed on a planted `@Column(nullable = false)` (checked, reverted). `backend/scripts/precheck-v16.sql` was run against a scratch Postgres with V1..V15 (zero rows) but **not on production: the box stays "pending user (VPS)"**, and the deploy of this slice waits for it.
- T47: the concurrent import is serialized per plan with `pg_advisory_xact_lock` (the second import then sees the first's rows and skips them), rather than catching a unique-index conflict: a conflict aborts the Postgres transaction and the Hibernate session, so it cannot be turned into a skipped row in place. The index stays as the backstop. Consequences: a blank reference is stored as no reference and always imports (an empty string would collide on the index), a zero amount is refused as `import-line-invalid` (it would violate `ck_transactions_amount_positive`), and a reference repeated inside one file is imported once. Series edit and delete use `findByPlanAndSeriesIdForUpdate` (the series is addressed by its id, not the definition's); delete takes the lock before reading the occurrences.
- Fix (installment edit, own `fix(web)` commit): the PUT of a plain transaction cannot tell an omitted `parcelsNumber` from a null one (null is the plain transaction's real value), so the `items` approach (required field) does not fit; the frontend sends the stored `parcelsNumber` and `endDate` in the drawer's `toPayload` and in `toInlineSavePayload`. Occurrences are generated with a null `endDate`, so the loss was the parcel count; the test failed before the change. A start date moved past a stored end date now answers `period-start-after-end` instead of silently clearing the end date.

<!-- Phase 13 -->

### T43: UTC clock and `timestamptz`

**What**: `Clock.systemUTC()`; instant fields `Instant`; `V14__instants_to_timestamptz_and_user_time_zone.sql` (`AT TIME ZONE 'UTC'`, `users.time_zone`, `time_zone_mode`); the three `LocalDateTime.now()` fixed; ArchUnit clock and zone rules. Before deploy the user confirms the container runs in UTC.
**Where**: `backend/src/main/resources/db/migration/V14__instants_to_timestamptz_and_user_time_zone.sql` (plus `TimeConfig`, entities)
**Depends on**: None in this phase (phase 12 complete)
**Reuses**: `Clock` bean
**Requirement**: BST-11 (AC 1–4)

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [x] Suite green with `-Duser.timezone=Pacific/Kiritimati`
- [x] ArchUnit fails on a planted `LocalDate.now()` (checked, reverted)
- [x] Gate passes: Quick (see Gate Check Commands)

**Tests**: integration
**Gate**: quick
**Commit**: `feat(backend): instants in UTC`

---

### T44: Time-Zone header and pinned zone

**What**: `TimeZoneInterceptor` stores a valid `Time-Zone` when the mode is automatic and the value differs; invalid ignored; `PATCH /user/me/time-zone`.
**Where**: `backend/src/main/java/com/lcs/findraco/user/controller/TimeZoneInterceptor.java` (plus the endpoint)
**Depends on**: T43
**Reuses**: none
**Requirement**: BST-11 (AC 5, 6)

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [x] IT: valid header stored, invalid ignored, pinned zone not overwritten
- [x] Gate passes: Quick (see Gate Check Commands)

**Tests**: integration
**Gate**: quick
**Commit**: `feat(user): time zone from the device or pinned`

---

### T45: Frontend sends the zone and lets the user pin it

**What**: `findracoApi` sends `Time-Zone` from `Intl.DateTimeFormat().resolvedOptions().timeZone`; profile zone setting.
**Where**: `frontend/src/api/clients/findracoApi.ts` (plus profile setting)
**Depends on**: T44
**Reuses**: profile screen
**Requirement**: BST-11 (AC 7)

**Tools**: MCP: NONE · Skill: `/form-creation`, `/api-integration`

**Done when**:

- [x] Client test asserts the header
- [x] Profile flow test pins a zone
- [x] Frontend beta bumped
- [x] Gate passes: Build (see Gate Check Commands)

**Tests**: integration
**Gate**: build
**Commit**: `feat(web): send and pin the time zone`

---

<!-- Phase 14 -->

### T46: Hardening constraints and indexes

**What**: A read-only precondition SQL script for the user to run on production (nulls, duplicates, negatives); then `V16__hardening_constraints.sql` with its own precondition block, `NOT NULL`/`CHECK`/`UNIQUE`, missing FK indexes, `external_id` → `source_ref`, `uk_transactions_plan_source_ref` partial index; entities drop schema-only annotations.
**Where**: `backend/src/main/resources/db/migration/V16__hardening_constraints.sql` (plus `backend/scripts/precheck-v16.sql`, entities)
**Depends on**: None in this phase (phase 13 complete)
**Reuses**: S9 naming
**Requirement**: BST-12 (AC 1–4, 7, 8)

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [x] `MigrationsIT` green
- [x] Seeded dirty data makes V16 abort naming the violation
- [x] The user ran the precheck on production with zero rows (stop otherwise) — pending user (VPS)
- [x] Gate passes: Quick (see Gate Check Commands)

**Tests**: integration
**Gate**: quick
**Commit**: `feat(db): database guards for the domain invariants`

---

### T47: Concurrent import and series locks

**What**: In-file dedup plus unique-index handling on import; series edit and delete take `findByIdForUpdate`.
**Where**: `backend/src/test/java/com/lcs/findraco/transaction/ConcurrentImportIT.java` (plus import and series services)
**Depends on**: T46
**Reuses**: T46 index
**Requirement**: BST-12 (AC 5, 6)

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [x] Two concurrent imports store each row once
- [x] Series edit waits on the top-up lock (IT)
- [x] Gate passes: Build (see Gate Check Commands)

**Tests**: integration
**Gate**: build
**Commit**: `fix(transaction): concurrent imports and series edits are safe`

---

**Batch 11 deviations (T62-T69, unattended run)**

- T62: V18 has the `recurrence_exceptions` table (FK `ON DELETE CASCADE`, PK `(definition_id, exception_date)`) and `plans.series_generated_until`. Deleting "this one" records the pivot date (the delete also had to learn it, since AC 1 is about the delete). The regenerator keeps a map by date; a duplicate date among the existing rows goes to `toDelete`. Installment labels stay position-derived (parcel k of N), the exceptions only drop slots.
- T63: `app.series.horizon-months` / `app.series.top-up-cron` are `SeriesProperties`; the generator and the regenerator take it (their constants are gone) and `horizonFrom(today)` is the one place the horizon is computed. `OpenEndedSeriesTopUpService` keeps its name (it is the transactional worker) but is plain `@Transactional` now: `topUp(planId, today)` and `extendTo(planId, through)`. Both stamp each due definition's `generatedThrough` and the plan's `series_generated_until` with the requested date, also when nothing was due; this fixes the due query (before, the last occurrence was the mark, so every definition was "due" and locked on every read). `-` as the cron turns the schedule and the startup run off; the test profile sets it, so no job fires in a test. The job IT builds `SeriesTopUpJob` by hand with a fixed `Clock` (the context clock is the system one). Creating or re-opening an open-ended series lowers the plan's mark to the horizon, so a read past it extends the new series too. A new plan has a null mark until the first job run or first read: that first read writes once.
- T64: `SeriesHorizon.ensureCovered(planId, end)` is called by `DashboardService` (summary, trend) and `CategorySpendingService.getSpending` before the read, which now runs in a `TransactionTemplate` (read-only) instead of `@Transactional`, because a Spring proxy would open the read transaction before the body. The extension goes to the period end (not only to the horizon) but at most 9 years ahead of today, so a request cannot ask for unbounded rows or hit the 120-occurrence cap of a pass. `DashboardPartitionIT` expected the old "always the horizon" mark; it now expects the period end. T63 and T64 were committed in that order but T63 alone leaves the dashboard reading inside a read-only transaction that writes (the T64 commit fixes it).
- T65: nothing changed in the frontend (the delete call already sent `scope`); a missing scope is `400 malformed-request`. The "(k/N) keeps N" rule already held for the rows left behind, an IT now pins it. The snapshot changed (the parameter is required).
- T66: only removal and plan deletion needed `ensurePersonalPlan`; leaving needs nothing because it already refuses the last plan (409 `last-plan`, IT kept). The new personal plan is the sign-up one ("My plan", default, OWNER).
- T67: new problem `invitation-email-required` (422, with frontend slug and copy). Preview and accept of a deleted plan's invitation answer `invitation-not-found` (404).
- T68: V19 checks `transactions` and `recurrence_definitions`; the abort message is `V19 precondition failed: N rows use the PERCENT split mode`. The problem `split-mode-not-supported` became unreachable and was removed (backend, frontend slug and copy). A request with `"PERCENT"` is now `400 malformed-request` (an unknown enum value). The only frontend use of the value was a test fixture (now `EXACT`).
- T69: `PageRequests.of` appends `id`; `TransactionService` used `PageRequest.of` directly for the plain sorts and now goes through `PageRequests.of`; the two specification-owned orderings add `id` to their own `orderBy`. `LikePatterns.contains(term)` (lower case, escaped, wrapped) plus `ESCAPE` for `CriteriaBuilder.like`; both specifications use it. "Checked, reverted" was not done for the paging IT.
- Frontend changed (a problem slug and copy, a type): beta bumped once at batch end.

**Batch 10 deviations (T56-T61, unattended run)**

- T56: Commons CSV 1.14.1; no `BOMInputStream`: `StrictUtf8` decodes the bytes with a `REPORT` decoder (line of the first bad byte from its position) and drops a leading U+FEFF. The registry takes `byte[]` (decode, read the header with Commons CSV, pick the parser), so the BOM and encoding cases are tested at registry level (`StatementParserRegistryTest`, 16 tests covering the 12 of AC 9). The header is now checked (it used to be skipped): `date,amount,id,description` or the Portuguese names, case and accent blind. Card bill = a header with `title` and `amount` and no `id`. Rules kept: `dd/MM/yyyy` (now STRICT, so 31/02 is an error instead of clamping), signed amount with a dot (now at most 2 decimals, no exponent), blank id = null ref. Rules tightened: a record must have exactly 4 columns (an unquoted comma in the description is now `column-count`; it used to be swallowed by `split(",", 4)`), a blank description is `blank`. Parser error codes: `date-invalid`, `amount-invalid`, `amount-zero`, `column-count`, `malformed` (bad quoting, the rest of the file is unreadable), `too-long`, `blank`. The parser collects maxErrors + 1 errors, so the service can tell the list was cut. `ParseResult` has the two components of the design.
- T57: new problem slugs `csv-unknown-format`, `csv-format-not-supported`, `csv-encoding-invalid`, `csv-too-many-rows`, `csv-too-large`; the rows-invalid problem keeps the existing slug `import-line-invalid` (its copy already existed). `DomainException` got an optional `errors` list that `Problems.of` writes as the `errors` extension. Order: size (`MultipartFile.getSize`) -> rate limit -> role -> parse. `TransactionImportService` is new (import left `TransactionService`, which lost its rate limiter and import imports); `TransactionImportResponse` became `ImportResultResponse`. The description keeps the first 255 characters of the bank's text (column limit); `sourceText` holds up to 512 (longer is `too-long`). Multipart limits are 2 MB, not 1 MB: with 1 MB the container would answer a bare 413 before the service could answer the typed 422 `csv-too-large` that AC 6 asks for; `app.import.max-bytes` is the real bound. `TransactionDraft` has a 9-component canonical constructor plus the old 8-argument one, so the other callers did not change. `Transaction.sourceText` is `updatable = false` with a getter only (`TransactionTest.theBanksTextSurvivesEveryEdit`). The existing CSV fixture with an unquoted comma was quoted.
- T58: no dialog: the import stays a button + toast. The success toast says the counts (`importResultMessage`); a rejected file shows the type's copy plus up to 10 `Line N: ...` lines and "...and N more" in the toast description. Field/line errors share the `errors` array; `problemFieldErrors` ignores line errors. Commit subject is lower-case `csv` (the hook).
- T59-T60: the period params stay `startDate`/`endDate` (the endpoint already took them; renaming would break the contract for nothing). `overLimit` was replaced by `status` (`OK|WARNING|OVER`, null without a limit or for a former member's entry); `limit` is now the limit scaled to the period for rows and members. `CategoryUsage` (record) and `UsageStatus` live in `category.model` so the response and the calculator can share them; `CategoryUsageCalculator` is a static pure class (`monthsTouched` clamps a reversed range to 1). Warning rule: `spent >= 0.8 * limit`, over: `spent > limit`, a zero limit with zero spend is ok (as the frontend did). The unreachable member-filter branch was removed from the service, the assembler, the repository query and two assembler tests. `CategorySpendingIT` used a "yesterday to tomorrow" period that scaled the limits on the first and last day of a month; it now asks for the whole current month.
- T61: `countMonths` moved to `utils/periodMonths.ts` (the navigator and the trend still need it; it is period maths, not limit maths). `usageOf` now reads the API's `remaining`/`percentUsed`/`status`; `WARNING_RATIO` is gone from the frontend. The service hook test for the import lost its toast and refresh assertions; the page flow keeps POST + toast + list refresh. Fixtures in tests and stories state the API's verdict explicitly (`judged(...)`); none computes one.
- Gate: `tsc --noEmit -p .` does not catch what `tsc -b` (the build) does; the batch-end build found one narrowing error, fixed in its own commit.

**Batch 9 deviations (T48–T55, unattended run)**

- T48: Bucket4j is 8.21.0 (latest 8.x on Central, not 8.19.0). `RateLimitProperties` has one `RateLimitRule` component per limit (`loginIp`, `loginEmail`, ...) instead of a map, so a missing key fails startup by plain `@NotNull @Valid`; `ConfigurationPropertiesTest` covers a zero capacity and a missing rule. Every key (IP too, not only e-mail) is trimmed, lower-cased and SHA-256 hashed. The buckets use a Bucket4j `TimeMeter` over the injected `Clock`; the Caffeine `expireAfterAccess` runs on Caffeine's own ticker (real time), which only affects when idle keys are forgotten. A refusal logs `WARN Rate limit LOGIN_EMAIL exceeded; retry in Ns` with no key at all (the IP is not logged either; the request log line already has the caller). `GlobalExceptionHandler` has a `RateLimitedException` handler that adds `Retry-After`. The test profile has 100000 for every rule.
- T49: services call `consume` first (login: IP then e-mail; reset: IP then e-mail; register: IP; import: user id). `@ClientIp` lives in `shared.web` with its resolver and `SharedWebConfig`, which also tells springdoc to ignore the annotation, so the snapshot did not change (429 was already a common response). The import is limited per user across plans. `RateLimitIT` sets tight limits with `@TestPropertySource` (its own context) and checks each route, the e-mail limit across IPs, case-insensitive e-mails and that the log line carries no e-mail.
- T50: the commit subject is `feat(deploy): api reachable only through the proxy` (lower-case `api`: the commit hook requires a lower-case description). `docker-compose.yml` uses `${SERVER_ADDRESS:?...}`, so the stack refuses to start without it instead of passing an empty value (an empty `server.address` could bind publicly). The `internal-proxies` regex is loopback plus 172.16.0.0/12; the IT (`ClientAddressIT`, real HTTP on a random port) proves `X-Forwarded-For` is honoured from a trusted peer, ignored from an untrusted one (the same loopback peer with the property narrowed to Docker's range) and that a forged leading entry does not hide the entry the proxy appended. The checklist in `DEPLOY.md` is written; the box "User ran the VPS checklist" stays **pending user (VPS)**.
- T51: one `DelegatingPasswordEncoder` in `auth.config.PasswordEncoderConfig`; stored new hashes read `{argon2}$argon2id$...` (the `{id}` prefix is part of the format, so the IT checks for that prefix). BouncyCastle `bcprov-jdk18on` 1.86. The dummy hash for unknown users comes from the provider's encoder, i.e. the same bean (Argon2 for the dummy while real legacy users still verify with BCrypt 12, so until each user's first login the two paths differ in time; after the migration they match). `CustomUserDetailsService` also implements `UserDetailsPasswordService`; `UserService.replacePasswordHash` stores the re-hash.
- T52: the constraint lives in `shared.security` (`ValidPassword`, `PasswordLength`, `PasswordCharacters`, `PasswordNormalizer`), not in `auth.request`, because `CreateUserRequest` is in `user.request` and the architecture rule forbids a feature reaching another feature's requests. To get the two `errors[].code` values from the existing code-derivation (the annotation's simple name), `@ValidPassword` is composed of `@PasswordLength` and `@PasswordCharacters` without `@ReportAsSingleViolation`. The ArchUnit rule "request strings are bounded" now accepts `@ValidPassword` in place of `@Size`. Create, update and reset requests use it (the update request carries a password too); the login request keeps no policy and its `@Size` bound went from 128 to 1024 so a 128-code-point emoji password (256 UTF-16 units) can still sign in. The OpenAPI schema for the three password fields lost `maxLength 128` (bound by the constraint, which the schema generator does not read). Frontend copy for the two codes is in `problems.ts`.
- T53: `@Async` is on `EmailService.sendPasswordResetEmail` (a call from another bean, so the proxy applies), executor `mailExecutor` with `app.mail.executor.core-size/max-size/queue-capacity` (2/4/100). Spring grows the pool beyond the core only after the queue is full, so effectively 2 threads while fewer than 100 are queued. A full queue drops the message with a WARN instead of throwing, so the response never depends on the mail system. The "in-memory mail fake" did not exist; `ForgotPasswordAsyncIT` defines one (a `JavaMailSenderImpl` that records and can hold a send) and uses Awaitility. The response does not wait for the lookup either way, but a known account still does two small writes before answering; the ACs ask for the same status and body, which the IT checks.
- T54: `JwtProperties` has `secretKeyBytes()` and an `@AssertTrue` check (field `secretKeyStrongEnough`), failing on non-Base64 text and on fewer than 32 decoded bytes. `JwtService.generateToken(long userId)`, `getUserIdFromToken`, and `JwtAuthenticationFilter` loads by id through `CustomUserDetailsService.loadUserById`; `isTokenExpired` and `validateToken` were removed (unused). Confirmed: `spring-dotenv` and `spring.dotenv.filename` were already gone (T4). The local `backend/.env` secret decodes to 64 bytes (checked, value not printed). `.env.example` and the README now say `openssl rand -base64 48`. The production check is in `DEPLOY.md`; **the user must run it before deploying this slice**.
- T55: `utils/passwordSchema.ts` exports `newPasswordSchema(emptyMessage)` (used by the sign-up and reset schemas; sign-in keeps `min(1)`), `passwordLength`, and `passwordSpacesHint`, shown as the field description in the sign-up and reset forms. `ResetPasswordView` hit the 60-line logic cap, so its invalid-link branch became a small `InvalidLink` component. The sign-up story's password was lengthened to meet the policy (own `test(frontend)` commit, found by the full gate). Beta bumped once for the batch (`1.0.0-beta.18`).

<!-- Phase 15 -->

### T48: Rate limiter

**What**: `RateLimit` enum, `RateLimitProperties` (`app.rate-limit.*`, every key required), `RateLimiter.consume` on Bucket4j 8.19.0 with a bounded Caffeine cache, e-mail keys normalised and hashed, `RateLimitedException` with retry-after.
**Where**: `backend/src/main/java/com/lcs/findraco/shared/ratelimit/RateLimiter.java` (plus enum and properties)
**Depends on**: None in this phase (phase 14 complete)
**Reuses**: T11 config pattern
**Requirement**: BST-14 (AC 3)

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [x] Unit tests with a fixed clock: allows N, refuses N+1 with retry-after, refills
- [x] Gate passes: Quick (see Gate Check Commands)

**Tests**: unit
**Gate**: quick
**Commit**: `feat(backend): rate limiter`

---

### T49: Limits on login, reset, register and import

**What**: Services call `consume` first; `@ClientIp` resolver; 429 with `Retry-After` and `rate-limited`, WARN log.
**Where**: `backend/src/main/java/com/lcs/findraco/auth/service/AuthenticationService.java` (plus reset, register, import services, `ClientIpArgumentResolver`)
**Depends on**: T48
**Reuses**: T48
**Requirement**: BST-14 (AC 2)

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [x] IT per route: the limit + 1 answers 429 with `Retry-After`; login per e-mail across IPs
- [x] Gate passes: Quick (see Gate Check Commands)

**Tests**: integration
**Gate**: quick
**Commit**: `feat(api): rate limits on sensitive endpoints`

---

### T50: Listen only where the proxy reaches

**What**: `server.address=${SERVER_ADDRESS:127.0.0.1}`, `server.forward-headers-strategy=native`, `internal-proxies` to Docker ranges; `DEPLOY.md` checklist (set `SERVER_ADDRESS` to the docker0 IP, check the public IP:3000 refuses and the site works).
**Where**: `backend/src/main/resources/application.properties` (plus `DEPLOY.md`, `docker-compose.yml` env)
**Depends on**: T49
**Reuses**: docker-compose topology
**Requirement**: BST-14 (AC 1)

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [x] IT: `X-Forwarded-For` from a non-proxy address is ignored
- [ ] User ran the VPS checklist
- [x] Gate passes: Build (see Gate Check Commands)

**Tests**: integration
**Gate**: build
**Commit**: `feat(deploy): API reachable only through the proxy`

---

<!-- Phase 16 -->

### T51: Argon2id with BCrypt migration

**What**: One `DelegatingPasswordEncoder` bean (Argon2 `defaultsForSpringSecurity_v5_8` for new, BCrypt 12 for unprefixed matches), rehash on login via `UserDetailsPasswordService`, dummy hash from the same bean; BouncyCastle dependency.
**Where**: `backend/src/main/java/com/lcs/findraco/auth/config/PasswordEncoderConfig.java` (plus `UserService`, `SecurityConfig`)
**Depends on**: None in this phase (phase 15 complete)
**Reuses**: existing encoder uses
**Requirement**: BST-15 (AC 5, 6)

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [x] IT: a BCrypt user logs in and the hash starts with `$argon2id$`
- [x] Gate passes: Quick (see Gate Check Commands)

**Tests**: integration
**Gate**: quick
**Commit**: `feat(auth): argon2id password hashing`

---

### T52: Password policy

**What**: `@ValidPassword` (NFKC, 8–128 code points, no `Cc`/`Cf`/`Zl`/`Zp`) with codes `PasswordLength`/`PasswordCharacters`; `PasswordNormalizer` on create, reset and login.
**Where**: `backend/src/main/java/com/lcs/findraco/auth/request/ValidPassword.java` (plus validator, normalizer)
**Depends on**: T51
**Reuses**: none
**Requirement**: BST-15 (AC 1–4)

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [x] Unit tests: 7/8/128/129 code points, emoji counted as one, zero-width and tab refused, accents and spaces accepted, NFKC equivalence
- [x] Gate passes: Quick (see Gate Check Commands)

**Tests**: unit
**Gate**: quick
**Commit**: `feat(auth): password policy by characters`

---

### T53: Forgot-password answers at once

**What**: `@Async` mail on a bounded executor (`app.mail.executor.*`); same response for known and unknown e-mails.
**Where**: `backend/src/main/java/com/lcs/findraco/auth/service/PasswordResetService.java` (plus executor config)
**Depends on**: T52
**Reuses**: in-memory mail fake
**Requirement**: BST-15 (AC 7)

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [x] IT: identical status and body for both cases; mail delivered asynchronously
- [x] Gate passes: Quick (see Gate Check Commands)

**Tests**: integration
**Gate**: quick
**Commit**: `fix(auth): forgot-password reveals nothing by timing`

---

### T54: JWT key, subject and dotenv

**What**: Secret Base64-decoded with a ≥ 32-byte startup check; `sub` = user id, filter loads by id; `spring.dotenv.filename` and `spring-dotenv` removed, `spring.config.import=optional:file:.env[.properties]` (unless moved in T4). User checks the production secret before deploy.
**Where**: `backend/src/main/java/com/lcs/findraco/auth/service/JwtService.java` (plus `JwtProperties`, `JwtAuthenticationFilter`, `pom.xml`, properties)
**Depends on**: T53
**Reuses**: T11 records
**Requirement**: BST-15 (AC 8–10)

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [x] Context test: a 16-byte secret fails startup
- [x] IT: token `sub` is the id; session refresh still works
- [x] Gate passes: Quick (see Gate Check Commands)

**Tests**: integration
**Gate**: quick
**Commit**: `feat(auth): decoded JWT key and id subject`

---

### T55: Frontend password schema

**What**: Zod schema mirrors 8–128 code points and forbidden characters; non-blocking warning on leading or trailing spaces.
**Where**: `frontend/src/features/auth/utils/passwordSchema.ts`
**Depends on**: T54
**Reuses**: existing auth forms
**Requirement**: BST-15 (AC 11)

**Tools**: MCP: NONE · Skill: `/form-creation`

**Done when**:

- [x] Unit tests mirror T52's cases
- [x] Frontend beta bumped
- [x] Gate passes: Build (see Gate Check Commands)

**Tests**: unit
**Gate**: build
**Commit**: `feat(web): password rules match the server`

---

<!-- Phase 17 -->

### T56: Statement parser for Nubank

**What**: `StatementParser`, `ParseResult`, `ImportedRow`, `ImportError`, `NubankAccountStatementParser` on Commons CSV (BOM, strict UTF-8 with line), card-bill detector, `StatementParserRegistry`.
**Where**: `backend/src/main/java/com/lcs/findraco/transaction/importer/NubankAccountStatementParser.java` (plus interface, records, registry)
**Depends on**: None in this phase (phase 16 complete)
**Reuses**: current parsing rules
**Requirement**: BST-16 (AC 1–4, 9)

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [x] The 12 unit cases of AC 9 pass
- [x] Gate passes: Quick (see Gate Check Commands)

**Tests**: unit
**Gate**: quick
**Commit**: `feat(transaction): statement parser registry with a Nubank parser`

---

### T57: All-or-nothing import with the bank's text

**What**: `V17__transaction_source_text.sql`; `app.import.*` bounds (1 MB, 5 000 rows, 50 errors) and multipart limit; service: size → rate limit → parse → 422 with every error capped, else dedup and `Transaction.create` with `sourceText`/`sourceRef`; `ImportResultResponse(imported, skippedDuplicates)`.
**Where**: `backend/src/main/java/com/lcs/findraco/transaction/service/TransactionImportService.java` (plus migration, response, properties)
**Depends on**: T56
**Reuses**: T56, T34
**Requirement**: BST-16 (AC 5–8)

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [x] `CsvImportIT`: one bad line imports nothing and lists it; re-import skips duplicates; size and row bound answer 422
- [x] Snapshot regenerated
- [x] Gate passes: Quick (see Gate Check Commands)

**Tests**: integration
**Gate**: quick
**Commit**: `feat(transaction): all-or-nothing CSV import`

---

### T58: Frontend import result and errors

**What**: Show `imported`/`skippedDuplicates`; list invalid lines from `errors`; format problems from the map.
**Where**: `frontend/src/features/transactions/components/CsvImportDialog.tsx` (or the current import component)
**Depends on**: T57
**Reuses**: T24 map
**Requirement**: BST-16 (AC 5, 7)

**Tools**: MCP: NONE · Skill: `/component-creation`

**Done when**:

- [x] Flow test: error list shown; success counts shown
- [x] Frontend beta bumped
- [x] Gate passes: Build (see Gate Check Commands)

**Tests**: integration
**Gate**: build
**Commit**: `feat(web): CSV import result and line errors`

---

<!-- Phase 18 -->

### T59: Category usage calculator

**What**: Pure `CategoryUsageCalculator`: limit scaled by months touched, spent, remaining, percentUsed, status with `WARNING_RATIO` constant.
**Where**: `backend/src/main/java/com/lcs/findraco/category/service/CategoryUsageCalculator.java`
**Depends on**: None in this phase (phase 17 complete)
**Reuses**: `CategorySpendingAssembler`
**Requirement**: BST-17 (AC 1–3)

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [x] Unit tests incl. 15 Oct–10 Nov → limit 200, status boundaries
- [x] Gate passes: Quick (see Gate Check Commands)

**Tests**: unit
**Gate**: quick
**Commit**: `feat(category): usage evaluated for any period`

---

### T60: Spending endpoint takes a period

**What**: `start`/`end` params; response carries the evaluated fields per category and member.
**Where**: `backend/src/main/java/com/lcs/findraco/category/controller/CategorySpendingController.java` (or its current controller)
**Depends on**: T59
**Reuses**: T59
**Requirement**: BST-17 (AC 1)

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [x] `CategorySpendingIT` covers a multi-month period
- [x] Snapshot regenerated
- [x] Gate passes: Quick (see Gate Check Commands)

**Tests**: integration
**Gate**: quick
**Commit**: `feat(api): category spending for any period`

---

### T61: Frontend reads usage from the server

**What**: Delete `scaleLimits.ts` and the evaluation in `spendingRows.ts`; read the fields; keep one of the two CSV POST+toast+refresh assertions.
**Where**: `frontend/src/features/overview/utils/spendingRows.ts` (plus deletions)
**Depends on**: T60
**Reuses**: presentation components
**Requirement**: BST-17 (AC 4, 5)

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [x] Overview flow tests green on server values
- [x] `scaleLimits.ts` gone
- [x] Frontend beta bumped
- [x] Gate passes: Build (see Gate Check Commands)

**Tests**: integration
**Gate**: build
**Commit**: `refactor(web): category usage from the server`

---

<!-- Phase 19 -->

### T62: Series exceptions and reconcile by date

**What**: `V18__recurrence_exceptions_and_watermark.sql`; `RecurrenceDefinition.except(date)` (`@ElementCollection`); generator skips exceptions; `SeriesRegenerator` matches by date (H8).
**Where**: `backend/src/main/java/com/lcs/findraco/transaction/service/SeriesRegenerator.java` (plus entity, generator, migration)
**Depends on**: None in this phase (phase 18 complete)
**Reuses**: `RecurringTransactionGenerator`
**Requirement**: BST-18 (AC 1–3)

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [x] Generator and regenerator unit tests: excepted date never produced; edit after a deleted occurrence keeps it gone
- [x] Gate passes: Quick (see Gate Check Commands)

**Tests**: unit
**Gate**: quick
**Commit**: `fix(transaction): deleted occurrences stay deleted`

---

### T63: Daily top-up job

**What**: `SeriesTopUpJob` (`app.series.top-up-cron`, `app.series.horizon-months`, at startup); due query fixed; watermark advances to the horizon when nothing is due.
**Where**: `backend/src/main/java/com/lcs/findraco/transaction/service/SeriesTopUpJob.java`
**Depends on**: T62
**Reuses**: `OpenEndedSeriesTopUpService` logic
**Requirement**: BST-18 (AC 4, 8)

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [x] IT with fixed clock: job tops up to today + 12 months and advances the watermark
- [x] Gate passes: Quick (see Gate Check Commands)

**Tests**: integration
**Gate**: quick
**Commit**: `feat(transaction): daily series top-up`

---

### T64: Reads extend, never write within the horizon

**What**: `SeriesHorizon.ensureCovered(planId, end)` before read transactions; `REQUIRES_NEW` removed from read paths.
**Where**: `backend/src/main/java/com/lcs/findraco/transaction/service/SeriesHorizon.java` (plus read services)
**Depends on**: T63
**Reuses**: T63
**Requirement**: BST-18 (AC 5–7)

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [x] IT: period beyond the watermark extends; covered period issues no write statement
- [x] Gate passes: Quick (see Gate Check Commands)

**Tests**: integration
**Gate**: quick
**Commit**: `refactor(transaction): reads never write series`

---

### T65: Explicit delete scope

**What**: `DELETE` series requires `scope` (400 when absent, H10); THIS_AND_FOLLOWING keeps "(k/N)" labels; frontend always sends scope.
**Where**: `backend/src/main/java/com/lcs/findraco/transaction/controller/TransactionController.java` (plus frontend delete call)
**Depends on**: T64
**Reuses**: none
**Requirement**: BST-18 (AC 9, 10)

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [x] IT: missing scope → 400; labels keep N
- [x] Frontend beta bumped
- [x] Gate passes: Build (see Gate Check Commands)

**Tests**: integration
**Gate**: build
**Commit**: `fix(api): series delete requires its scope`

---

<!-- Phase 20 -->

### T66: Every user keeps a plan

**What**: `PlanService.ensurePersonalPlan(userId)` after removal, leave and plan deletion; leaving the last plan answers 409.
**Where**: `backend/src/main/java/com/lcs/findraco/plan/service/PlanService.java`
**Depends on**: None in this phase (phase 19 complete)
**Reuses**: sign-up provisioning
**Requirement**: BST-19 (AC 1, 2)

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [x] ITs: removal, plan deletion and leave
- [x] Gate passes: Quick (see Gate Check Commands)

**Tests**: integration
**Gate**: quick
**Commit**: `fix(plan): every user keeps a plan`

---

### T67: Invitation rules

**What**: EMAIL invitation without e-mail → 422 (H6); soft-deleted plan → preview and accept 404 (H9).
**Where**: `backend/src/main/java/com/lcs/findraco/plan/service/PlanInvitationService.java`
**Depends on**: T66
**Reuses**: `InvitationLifecycleIT`
**Requirement**: BST-19 (AC 3, 4)

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [x] IT per rule
- [x] Gate passes: Quick (see Gate Check Commands)

**Tests**: integration
**Gate**: quick
**Commit**: `fix(plan): invitation rules`

---

### T68: Drop `PERCENT`

**What**: `V19__drop_percent_split_mode.sql` with precondition; `SplitMode` without `PERCENT`; frontend type follows.
**Where**: `backend/src/main/resources/db/migration/V19__drop_percent_split_mode.sql` (plus `SplitMode`)
**Depends on**: T67
**Reuses**: none
**Requirement**: BST-19 (AC 6)

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [x] `MigrationsIT` green; a stored `PERCENT` row makes V19 abort
- [x] Snapshot regenerated
- [x] Gate passes: Quick (see Gate Check Commands)

**Tests**: integration
**Gate**: quick
**Commit**: `refactor(api): remove the unsupported percent split`

---

### T69: Stable paging and escaped search

**What**: Every `toPageable` ends with `id`; `LikePatterns.escape` with `ESCAPE '\'` (H15).
**Where**: `backend/src/main/java/com/lcs/findraco/shared/web/PageRequests.java` (plus `LikePatterns`, specifications)
**Depends on**: T68
**Reuses**: sort map
**Requirement**: BST-19 (AC 7)

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [x] IT: equal sort keys page deterministically; searching `%` matches literally
- [x] Gate passes: Build (see Gate Check Commands)

**Tests**: integration
**Gate**: build
**Commit**: `fix(api): stable paging and literal search`

---

<!-- Phase 21 -->

### T70: Plan management ITs

**What**: ITs for plan delete, leave, transfer, role change, invitation list and preview (T2).
**Where**: `backend/src/test/java/com/lcs/findraco/plan/PlanManagementIT.java`
**Depends on**: None in this phase (phase 20 complete)
**Reuses**: `Fixtures`, `TestAuthHelper`
**Requirement**: BST-20 (AC 2, 5)

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [ ] One IT per endpoint rule asserting status and `type`
- [ ] Gate passes: Quick (see Gate Check Commands)

**Tests**: integration
**Gate**: quick
**Commit**: `test(plan): plan management endpoints`

---

### T71: Transaction list filter ITs

**What**: ITs for every list filter other than category (T4).
**Where**: `backend/src/test/java/com/lcs/findraco/transaction/TransactionListFilterIT.java`
**Depends on**: T70
**Reuses**: `TransactionCategoryFilterIT`
**Requirement**: BST-20 (AC 6)

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [ ] One case per filter
- [ ] Gate passes: Quick (see Gate Check Commands)

**Tests**: integration
**Gate**: quick
**Commit**: `test(transaction): list filters`

---

### T72: Role matrix covers every endpoint

**What**: A test enumerates the handler mappings and fails if an endpoint has no matrix row; missing rows added; remaining entity/pure-logic gaps get unit tests; tests that only verify calls removed (T6).
**Where**: `backend/src/test/java/com/lcs/findraco/plan/PlanAuthorizationMatrixIT.java`
**Depends on**: T71
**Reuses**: T41
**Requirement**: BST-20 (AC 1, 3, 4)

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [ ] Removing a guard from any endpoint fails a row (checked, reverted)
- [ ] No Mockito mock of our own classes remains
- [ ] Gate passes: Build (see Gate Check Commands)

**Tests**: integration
**Gate**: build
**Commit**: `test(backend): role matrix over every endpoint`

---

<!-- Phase 22 -->

### T73: Rewrite `backend-endpoint`

**What**: Real names, each rule tagged with its check (ArchUnit, test, review).
**Where**: `.claude/skills/backend-endpoint/SKILL.md`
**Depends on**: None in this phase (phase 21 complete)
**Reuses**: design, context S1–S27
**Requirement**: BST-21 (AC 1)

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [ ] Every rule maps to a context decision
- [ ] Docs gate

**Tests**: none
**Gate**: docs
**Commit**: `docs(skills): backend-endpoint for the backend standards`

---

### T74: Rewrite `backend-exceptions`

**What**: DomainException, ProblemType, statuses, frontend map.
**Where**: `.claude/skills/backend-exceptions/SKILL.md`
**Depends on**: T73
**Reuses**: T22
**Requirement**: BST-21 (AC 1)

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [ ] Every rule maps to a context decision
- [ ] Docs gate

**Tests**: none
**Gate**: docs
**Commit**: `docs(skills): backend-exceptions for the error contract`

---

### T75: Create `backend-testing`

**What**: The S8 table, Testcontainers base, fakes, role matrix, snapshot update command.
**Where**: `.claude/skills/backend-testing/SKILL.md`
**Depends on**: T74
**Reuses**: AD-020
**Requirement**: BST-21 (AC 2)

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [ ] Every rule maps to a context decision
- [ ] Docs gate

**Tests**: none
**Gate**: docs
**Commit**: `docs(skills): backend-testing`

---

### T76: Create `backend-structure`

**What**: Packages, cross-feature rules, aggregates, persistence, migrations, configuration, short Security and Logging sections.
**Where**: `.claude/skills/backend-structure/SKILL.md`
**Depends on**: T75
**Reuses**: AD-017, AD-021
**Requirement**: BST-21 (AC 2)

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [ ] Every rule maps to a context decision
- [ ] Docs gate

**Tests**: none
**Gate**: docs
**Commit**: `docs(skills): backend-structure`

---

### T77: CLAUDE.md and codebase docs

**What**: Backend section of `CLAUDE.md` rewritten to the essentials with skill pointers; `.specs/codebase/` docs purged of dead identifiers and pointing to folders.
**Where**: `CLAUDE.md` (plus `.specs/codebase/*.md`)
**Depends on**: T76
**Reuses**: frontend section shape
**Requirement**: BST-21 (AC 3)

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [ ] Grep for each renamed identifier in docs: no hits
- [ ] Docs gate

**Tests**: none
**Gate**: docs
**Commit**: `docs: backend standards in CLAUDE.md and codebase docs`

---

### T78: Dead code and pom cleanup

**What**: Untrack `backend/bin/`, remove unused finders and the duplicated `findAllByPlan`, one jjwt version property, English pom comments.
**Where**: `backend/pom.xml` (plus `backend/bin/`, repositories)
**Depends on**: T77
**Reuses**: none
**Requirement**: BST-21 (AC 4)

**Tools**: MCP: NONE · Skill: NONE

**Done when**:

- [ ] `git ls-files backend/bin` empty
- [ ] Suite green
- [ ] Gate passes: Build (see Gate Check Commands)

**Tests**: none
**Gate**: build
**Commit**: `chore(backend): remove dead code`

---

## Task Granularity Check

| Task | Scope | Status |
| ---- | ----- | ------ |
| T1: Run ITs on a Testcontainers Postgres | one cohesive change (grouped mechanical edits per lean-gates rule) | ✅ |
| T2: Make the session ITs green (H13) | one file or one config | ✅ |
| T3: Gate deploy on `./mvnw -B verify` | one file or one config | ✅ |
| T4: Upgrade to Spring Boot 4.1 and Java 25 | one cohesive change (grouped mechanical edits per lean-gates rule) | ✅ |
| T5: Layered Java 25 image | one file or one config | ✅ |
| T6: Dependabot for maven, npm and actions | one file or one config | ✅ |
| T7: Spotless with palantir-java-format | one cohesive change (grouped mechanical edits per lean-gates rule) | ✅ |
| T8: Enforcer and warnings as errors | one cohesive change (grouped mechanical edits per lean-gates rule) | ✅ |
| T9: Error Prone | one cohesive change (grouped mechanical edits per lean-gates rule) | ✅ |
| T10: ArchitectureTest with today's rules | one file or one config | ✅ |
| T11: Configuration records under `app.*` | one file or one config | ✅ |
| T12: Move shared, auth and user packages | one cohesive change (grouped mechanical edits per lean-gates rule) | ✅ |
| T13: Move and rename plan, category, transaction and dashboard | one cohesive change (grouped mechanical edits per lean-gates rule) | ✅ |
| T14: Rename tables and constraints | one file or one config | ✅ |
| T15: Rename routes and move the frontend to them | one cohesive change (grouped mechanical edits per lean-gates rule) | ✅ |
| T16: DTOs as records with the S10 names | one file or one config | ✅ |
| T17: `PlanContext` and `AuthenticatedUser` as values | one cohesive change (grouped mechanical edits per lean-gates rule) | ✅ |
| T18: ArchUnit rules for the structure | one file or one config | ✅ |
| T19: Request id filter | one cohesive change (grouped mechanical edits per lean-gates rule) | ✅ |
| T20: One log line per request | one file or one config | ✅ |
| T21: Log hygiene | one cohesive change (grouped mechanical edits per lean-gates rule) | ✅ |
| T22: ProblemDetail infrastructure and one handler | one cohesive change (grouped mechanical edits per lean-gates rule) | ✅ |
| T23: Named exceptions instead of `IllegalArgumentException` | one file or one config | ✅ |
| T24: Frontend problem map | one cohesive change (grouped mechanical edits per lean-gates rule) | ✅ |
| T25: springdoc customizers | one file or one config | ✅ |
| T26: Committed OpenAPI snapshot | one cohesive change (grouped mechanical edits per lean-gates rule) | ✅ |
| T27: Read-only report repositories | one cohesive change (grouped mechanical edits per lean-gates rule) | ✅ |
| T28: Category delete through `TransactionService` | one cohesive change (grouped mechanical edits per lean-gates rule) | ✅ |
| T29: OSIV off, services return responses | one cohesive change (grouped mechanical edits per lean-gates rule) | ✅ |
| T30: Entity graphs and a fixed statement count | one cohesive change (grouped mechanical edits per lean-gates rule) | ✅ |
| T31: Transaction aggregate | one cohesive change (grouped mechanical edits per lean-gates rule) | ✅ |
| T32: Series aggregate | one file or one config | ✅ |
| T33: Category aggregate | one file or one config | ✅ |
| T34: Services use the aggregates on every path | one cohesive change (grouped mechanical edits per lean-gates rule) | ✅ |
| T35: Optimistic locking | one cohesive change (grouped mechanical edits per lean-gates rule) | ✅ |
| T36: Frontend sends versions and handles stale edits | one cohesive change (grouped mechanical edits per lean-gates rule) | ✅ |
| T37: Dead fields and JSON names | one cohesive change (grouped mechanical edits per lean-gates rule) | ✅ |
| T38: Composed series edit request | one cohesive change (grouped mechanical edits per lean-gates rule) | ✅ |
| T39: Bounded inputs and narrower enums | one file or one config | ✅ |
| T40: `PlanAuthorization` queries and guards | one file or one config | ✅ |
| T41: Permissions in responses and the role matrix | one cohesive change (grouped mechanical edits per lean-gates rule) | ✅ |
| T42: Frontend reads permission flags | one cohesive change (grouped mechanical edits per lean-gates rule) | ✅ |
| T43: UTC clock and `timestamptz` | one cohesive change (grouped mechanical edits per lean-gates rule) | ✅ |
| T44: Time-Zone header and pinned zone | one cohesive change (grouped mechanical edits per lean-gates rule) | ✅ |
| T45: Frontend sends the zone and lets the user pin it | one cohesive change (grouped mechanical edits per lean-gates rule) | ✅ |
| T46: Hardening constraints and indexes | one cohesive change (grouped mechanical edits per lean-gates rule) | ✅ |
| T47: Concurrent import and series locks | one cohesive change (grouped mechanical edits per lean-gates rule) | ✅ |
| T48: Rate limiter | one cohesive change (grouped mechanical edits per lean-gates rule) | ✅ |
| T49: Limits on login, reset, register and import | one cohesive change (grouped mechanical edits per lean-gates rule) | ✅ |
| T50: Listen only where the proxy reaches | one cohesive change (grouped mechanical edits per lean-gates rule) | ✅ |
| T51: Argon2id with BCrypt migration | one cohesive change (grouped mechanical edits per lean-gates rule) | ✅ |
| T52: Password policy | one cohesive change (grouped mechanical edits per lean-gates rule) | ✅ |
| T53: Forgot-password answers at once | one cohesive change (grouped mechanical edits per lean-gates rule) | ✅ |
| T54: JWT key, subject and dotenv | one cohesive change (grouped mechanical edits per lean-gates rule) | ✅ |
| T55: Frontend password schema | one file or one config | ✅ |
| T56: Statement parser for Nubank | one cohesive change (grouped mechanical edits per lean-gates rule) | ✅ |
| T57: All-or-nothing import with the bank's text | one cohesive change (grouped mechanical edits per lean-gates rule) | ✅ |
| T58: Frontend import result and errors | one file or one config | ✅ |
| T59: Category usage calculator | one file or one config | ✅ |
| T60: Spending endpoint takes a period | one file or one config | ✅ |
| T61: Frontend reads usage from the server | one cohesive change (grouped mechanical edits per lean-gates rule) | ✅ |
| T62: Series exceptions and reconcile by date | one cohesive change (grouped mechanical edits per lean-gates rule) | ✅ |
| T63: Daily top-up job | one file or one config | ✅ |
| T64: Reads extend, never write within the horizon | one cohesive change (grouped mechanical edits per lean-gates rule) | ✅ |
| T65: Explicit delete scope | one cohesive change (grouped mechanical edits per lean-gates rule) | ✅ |
| T66: Every user keeps a plan | one file or one config | ✅ |
| T67: Invitation rules | one file or one config | ✅ |
| T68: Drop `PERCENT` | one cohesive change (grouped mechanical edits per lean-gates rule) | ✅ |
| T69: Stable paging and escaped search | one cohesive change (grouped mechanical edits per lean-gates rule) | ✅ |
| T70: Plan management ITs | one file or one config | ✅ |
| T71: Transaction list filter ITs | one file or one config | ✅ |
| T72: Role matrix covers every endpoint | one file or one config | ✅ |
| T73: Rewrite `backend-endpoint` | one file or one config | ✅ |
| T74: Rewrite `backend-exceptions` | one file or one config | ✅ |
| T75: Create `backend-testing` | one file or one config | ✅ |
| T76: Create `backend-structure` | one file or one config | ✅ |
| T77: CLAUDE.md and codebase docs | one cohesive change (grouped mechanical edits per lean-gates rule) | ✅ |
| T78: Dead code and pom cleanup | one cohesive change (grouped mechanical edits per lean-gates rule) | ✅ |

## Diagram-Definition Cross-Check

| Task | Depends On (task body) | Diagram Shows | Status |
| ---- | ---------------------- | ------------- | ------ |
| T1 | - | - | ✅ Match |
| T2 | T1 | T1 | ✅ Match |
| T3 | T2 | T2 | ✅ Match |
| T4 | - | - | ✅ Match |
| T5 | T4 | T4 | ✅ Match |
| T6 | T5 | T5 | ✅ Match |
| T7 | - | - | ✅ Match |
| T8 | T7 | T7 | ✅ Match |
| T9 | T8 | T8 | ✅ Match |
| T10 | T9 | T9 | ✅ Match |
| T11 | - | - | ✅ Match |
| T12 | T11 | T11 | ✅ Match |
| T13 | T12 | T12 | ✅ Match |
| T14 | T13 | T13 | ✅ Match |
| T15 | T14 | T14 | ✅ Match |
| T16 | - | - | ✅ Match |
| T17 | T16 | T16 | ✅ Match |
| T18 | T17 | T17 | ✅ Match |
| T19 | - | - | ✅ Match |
| T20 | T19 | T19 | ✅ Match |
| T21 | T20 | T20 | ✅ Match |
| T22 | - | - | ✅ Match |
| T23 | T22 | T22 | ✅ Match |
| T24 | T23 | T23 | ✅ Match |
| T25 | - | - | ✅ Match |
| T26 | T25 | T25 | ✅ Match |
| T27 | - | - | ✅ Match |
| T28 | T27 | T27 | ✅ Match |
| T29 | - | - | ✅ Match |
| T30 | T29 | T29 | ✅ Match |
| T31 | - | - | ✅ Match |
| T32 | T31 | T31 | ✅ Match |
| T33 | T32 | T32 | ✅ Match |
| T34 | T33 | T33 | ✅ Match |
| T35 | T34 | T34 | ✅ Match |
| T36 | T35 | T35 | ✅ Match |
| T37 | - | - | ✅ Match |
| T38 | T37 | T37 | ✅ Match |
| T39 | T38 | T38 | ✅ Match |
| T40 | T39 | T39 | ✅ Match |
| T41 | T40 | T40 | ✅ Match |
| T42 | T41 | T41 | ✅ Match |
| T43 | - | - | ✅ Match |
| T44 | T43 | T43 | ✅ Match |
| T45 | T44 | T44 | ✅ Match |
| T46 | - | - | ✅ Match |
| T47 | T46 | T46 | ✅ Match |
| T48 | - | - | ✅ Match |
| T49 | T48 | T48 | ✅ Match |
| T50 | T49 | T49 | ✅ Match |
| T51 | - | - | ✅ Match |
| T52 | T51 | T51 | ✅ Match |
| T53 | T52 | T52 | ✅ Match |
| T54 | T53 | T53 | ✅ Match |
| T55 | T54 | T54 | ✅ Match |
| T56 | - | - | ✅ Match |
| T57 | T56 | T56 | ✅ Match |
| T58 | T57 | T57 | ✅ Match |
| T59 | - | - | ✅ Match |
| T60 | T59 | T59 | ✅ Match |
| T61 | T60 | T60 | ✅ Match |
| T62 | - | - | ✅ Match |
| T63 | T62 | T62 | ✅ Match |
| T64 | T63 | T63 | ✅ Match |
| T65 | T64 | T64 | ✅ Match |
| T66 | - | - | ✅ Match |
| T67 | T66 | T66 | ✅ Match |
| T68 | T67 | T67 | ✅ Match |
| T69 | T68 | T68 | ✅ Match |
| T70 | - | - | ✅ Match |
| T71 | T70 | T70 | ✅ Match |
| T72 | T71 | T71 | ✅ Match |
| T73 | - | - | ✅ Match |
| T74 | T73 | T73 | ✅ Match |
| T75 | T74 | T74 | ✅ Match |
| T76 | T75 | T75 | ✅ Match |
| T77 | T76 | T76 | ✅ Match |
| T78 | T77 | T77 | ✅ Match |

## Test Co-location Validation

| Task | Code Layer Created/Modified | Matrix Requires | Task Says | Status |
| ---- | --------------------------- | --------------- | --------- | ------ |
| T1: Run ITs on a Testcontainers Postgres | endpoint, migration, filter or flow | integration | integration | ✅ OK |
| T2: Make the session ITs green (H13) | endpoint, migration, filter or flow | integration | integration | ✅ OK |
| T3: Gate deploy on `./mvnw -B verify` | build config, CI, moves, docs | none | none | ✅ OK |
| T4: Upgrade to Spring Boot 4.1 and Java 25 | endpoint, migration, filter or flow | integration | integration | ✅ OK |
| T5: Layered Java 25 image | build config, CI, moves, docs | none | none | ✅ OK |
| T6: Dependabot for maven, npm and actions | build config, CI, moves, docs | none | none | ✅ OK |
| T7: Spotless with palantir-java-format | build config, CI, moves, docs | none | none | ✅ OK |
| T8: Enforcer and warnings as errors | build config, CI, moves, docs | none | none | ✅ OK |
| T9: Error Prone | build config, CI, moves, docs | none | none | ✅ OK |
| T10: ArchitectureTest with today's rules | entity rule / pure logic / architecture / frontend logic | unit | unit | ✅ OK |
| T11: Configuration records under `app.*` | entity rule / pure logic / architecture / frontend logic | unit | unit | ✅ OK |
| T12: Move shared, auth and user packages | build config, CI, moves, docs | none | none | ✅ OK |
| T13: Move and rename plan, category, transaction and dashboard | build config, CI, moves, docs | none | none | ✅ OK |
| T14: Rename tables and constraints | endpoint, migration, filter or flow | integration | integration | ✅ OK |
| T15: Rename routes and move the frontend to them | endpoint, migration, filter or flow | integration | integration | ✅ OK |
| T16: DTOs as records with the S10 names | endpoint, migration, filter or flow | integration | integration | ✅ OK |
| T17: `PlanContext` and `AuthenticatedUser` as values | endpoint, migration, filter or flow | integration | integration | ✅ OK |
| T18: ArchUnit rules for the structure | entity rule / pure logic / architecture / frontend logic | unit | unit | ✅ OK |
| T19: Request id filter | endpoint, migration, filter or flow | integration | integration | ✅ OK |
| T20: One log line per request | endpoint, migration, filter or flow | integration | integration | ✅ OK |
| T21: Log hygiene | endpoint, migration, filter or flow | integration | integration | ✅ OK |
| T22: ProblemDetail infrastructure and one handler | endpoint, migration, filter or flow | integration | integration | ✅ OK |
| T23: Named exceptions instead of `IllegalArgumentException` | endpoint, migration, filter or flow | integration | integration | ✅ OK |
| T24: Frontend problem map | entity rule / pure logic / architecture / frontend logic | unit | unit | ✅ OK |
| T25: springdoc customizers | endpoint, migration, filter or flow | integration | integration | ✅ OK |
| T26: Committed OpenAPI snapshot | endpoint, migration, filter or flow | integration | integration | ✅ OK |
| T27: Read-only report repositories | endpoint, migration, filter or flow | integration | integration | ✅ OK |
| T28: Category delete through `TransactionService` | endpoint, migration, filter or flow | integration | integration | ✅ OK |
| T29: OSIV off, services return responses | endpoint, migration, filter or flow | integration | integration | ✅ OK |
| T30: Entity graphs and a fixed statement count | endpoint, migration, filter or flow | integration | integration | ✅ OK |
| T31: Transaction aggregate | entity rule / pure logic / architecture / frontend logic | unit | unit | ✅ OK |
| T32: Series aggregate | entity rule / pure logic / architecture / frontend logic | unit | unit | ✅ OK |
| T33: Category aggregate | entity rule / pure logic / architecture / frontend logic | unit | unit | ✅ OK |
| T34: Services use the aggregates on every path | endpoint, migration, filter or flow | integration | integration | ✅ OK |
| T35: Optimistic locking | endpoint, migration, filter or flow | integration | integration | ✅ OK |
| T36: Frontend sends versions and handles stale edits | endpoint, migration, filter or flow | integration | integration | ✅ OK |
| T37: Dead fields and JSON names | endpoint, migration, filter or flow | integration | integration | ✅ OK |
| T38: Composed series edit request | endpoint, migration, filter or flow | integration | integration | ✅ OK |
| T39: Bounded inputs and narrower enums | endpoint, migration, filter or flow | integration | integration | ✅ OK |
| T40: `PlanAuthorization` queries and guards | entity rule / pure logic / architecture / frontend logic | unit | unit | ✅ OK |
| T41: Permissions in responses and the role matrix | endpoint, migration, filter or flow | integration | integration | ✅ OK |
| T42: Frontend reads permission flags | endpoint, migration, filter or flow | integration | integration | ✅ OK |
| T43: UTC clock and `timestamptz` | endpoint, migration, filter or flow | integration | integration | ✅ OK |
| T44: Time-Zone header and pinned zone | endpoint, migration, filter or flow | integration | integration | ✅ OK |
| T45: Frontend sends the zone and lets the user pin it | endpoint, migration, filter or flow | integration | integration | ✅ OK |
| T46: Hardening constraints and indexes | endpoint, migration, filter or flow | integration | integration | ✅ OK |
| T47: Concurrent import and series locks | endpoint, migration, filter or flow | integration | integration | ✅ OK |
| T48: Rate limiter | entity rule / pure logic / architecture / frontend logic | unit | unit | ✅ OK |
| T49: Limits on login, reset, register and import | endpoint, migration, filter or flow | integration | integration | ✅ OK |
| T50: Listen only where the proxy reaches | endpoint, migration, filter or flow | integration | integration | ✅ OK |
| T51: Argon2id with BCrypt migration | endpoint, migration, filter or flow | integration | integration | ✅ OK |
| T52: Password policy | entity rule / pure logic / architecture / frontend logic | unit | unit | ✅ OK |
| T53: Forgot-password answers at once | endpoint, migration, filter or flow | integration | integration | ✅ OK |
| T54: JWT key, subject and dotenv | endpoint, migration, filter or flow | integration | integration | ✅ OK |
| T55: Frontend password schema | entity rule / pure logic / architecture / frontend logic | unit | unit | ✅ OK |
| T56: Statement parser for Nubank | entity rule / pure logic / architecture / frontend logic | unit | unit | ✅ OK |
| T57: All-or-nothing import with the bank's text | endpoint, migration, filter or flow | integration | integration | ✅ OK |
| T58: Frontend import result and errors | endpoint, migration, filter or flow | integration | integration | ✅ OK |
| T59: Category usage calculator | entity rule / pure logic / architecture / frontend logic | unit | unit | ✅ OK |
| T60: Spending endpoint takes a period | endpoint, migration, filter or flow | integration | integration | ✅ OK |
| T61: Frontend reads usage from the server | endpoint, migration, filter or flow | integration | integration | ✅ OK |
| T62: Series exceptions and reconcile by date | entity rule / pure logic / architecture / frontend logic | unit | unit | ✅ OK |
| T63: Daily top-up job | endpoint, migration, filter or flow | integration | integration | ✅ OK |
| T64: Reads extend, never write within the horizon | endpoint, migration, filter or flow | integration | integration | ✅ OK |
| T65: Explicit delete scope | endpoint, migration, filter or flow | integration | integration | ✅ OK |
| T66: Every user keeps a plan | endpoint, migration, filter or flow | integration | integration | ✅ OK |
| T67: Invitation rules | endpoint, migration, filter or flow | integration | integration | ✅ OK |
| T68: Drop `PERCENT` | endpoint, migration, filter or flow | integration | integration | ✅ OK |
| T69: Stable paging and escaped search | endpoint, migration, filter or flow | integration | integration | ✅ OK |
| T70: Plan management ITs | endpoint, migration, filter or flow | integration | integration | ✅ OK |
| T71: Transaction list filter ITs | endpoint, migration, filter or flow | integration | integration | ✅ OK |
| T72: Role matrix covers every endpoint | endpoint, migration, filter or flow | integration | integration | ✅ OK |
| T73: Rewrite `backend-endpoint` | build config, CI, moves, docs | none | none | ✅ OK |
| T74: Rewrite `backend-exceptions` | build config, CI, moves, docs | none | none | ✅ OK |
| T75: Create `backend-testing` | build config, CI, moves, docs | none | none | ✅ OK |
| T76: Create `backend-structure` | build config, CI, moves, docs | none | none | ✅ OK |
| T77: CLAUDE.md and codebase docs | build config, CI, moves, docs | none | none | ✅ OK |
| T78: Dead code and pom cleanup | build config, CI, moves, docs | none | none | ✅ OK |

**Totals**: 78 tasks in 22 phases.

## Requirement Coverage

| Requirement | Tasks |
| ----------- | ----- |
| BST-01 | T1, T2, T3 |
| BST-02 | T4, T5, T6 |
| BST-03 | T7, T8, T9, T10 |
| BST-04 | T11, T12, T13, T14, T15, T16, T17, T18 |
| BST-05 | T27, T28 |
| BST-06 | T31, T32, T33, T34, T35, T36 |
| BST-07 | T29, T30 |
| BST-08 | T22, T23, T24 |
| BST-09 | T25, T26 |
| BST-10 | T37, T38, T39, T40, T41, T42 |
| BST-11 | T43, T44, T45 |
| BST-12 | T46, T47 |
| BST-13 | T19, T20, T21 |
| BST-14 | T24, T48, T49, T50 |
| BST-15 | T51, T52, T53, T54, T55 |
| BST-16 | T56, T57, T58 |
| BST-17 | T59, T60, T61 |
| BST-18 | T62, T63, T64, T65 |
| BST-19 | T39, T66, T67, T68, T69 |
| BST-20 | T70, T71, T72 |
| BST-21 | T73, T74, T75, T76, T77, T78 |
