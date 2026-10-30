---
name: backend-testing
description: Decide and write backend tests in the findraco Spring Boot API - the closed test table (entity rules and pure logic get unit `*Test`, endpoints with a rule or guard get an `*IT` per rule asserting status and problem `type`, plain CRUD only a role-matrix row, migrations `MigrationsIT`), the Testcontainers Postgres base `AbstractIntegrationTest`, `Fixtures`, `TestAuthHelper`, `ProblemMatchers.problem`, the in-memory mail fake and fixed `Clock`, the role matrix over every endpoint, the OpenAPI snapshot update command, and how to run the suite locally (JDK 25, Docker). Each rule says what checks it. Use when adding or changing a backend test, deciding whether code gets a test, or running the suite. Triggers on "backend test", "IT", "integration test", "unit test", "Testcontainers", "role matrix", "Fixtures", "ProblemMatchers", "mock", "fake", "JaCoCo", "openapi snapshot", "run the tests".
metadata:
  type: reference
---

# Backend Testing

A closed table decides what gets a test; code that matches no row gets none. Outcomes are tested against
a real Postgres, not calls against mocks, so a refactor without a bug breaks no test (S8). Endpoint
shapes are in `backend-endpoint`, errors in `backend-exceptions`, packages in `backend-structure`.

Tags: **[ArchUnit: rule]**, **[test: Class]**, **[build]** (surefire, failsafe, JaCoCo, Spotless,
compiler), **[review]** (no tool checks it). `S` and `AD` numbers are decisions in
`.specs/features/backend-standards/context.md` and `.specs/STATE.md`.

---

## 1. The table (S8, AD-020)

| Code | Test | Where |
| ---- | ---- | ----- |
| Entity rule (S3) and pure logic (split resolver, series generator and regenerator, CSV parsers, usage calculator, `PlanAuthorization`, rate limiter, password policy, like patterns) | Unit `*Test`, one per rule and edge case; no Spring, no mocks | next to the class, same package: `transaction/model/SplitResolverTest`, `plan/service/PlanAuthorizationTest` |
| Endpoint with a rule or a permission guard | `*IT` over HTTP, one per rule, asserting status **and** problem `type` | the feature's test package: `plan/PlanManagementIT`, `category/CategoryDeleteIT` |
| Plain CRUD endpoint with no rule | Only its role-matrix row | `plan/PlanAuthorizationMatrixIT` |
| Report query | `*IT` when it holds logic (grouping, filters, partition) | `dashboard/DashboardPartitionIT` |
| Migration | `MigrationsIT` (boots and validates the schema), plus a data migration's own precondition case | `MigrationsIT` |
| Structural rule | `ArchitectureTest` rule, failing once on a planted violation | `ArchitectureTest` |

- A new test names a row of the table; "it would be nice" is not a row. [review]
- Entity rules are tested on the entity, not through HTTP; the HTTP path gets one IT per rule when the
  endpoint adds a rule of its own. [review]
- Test names state the rule, not the method (`deletingTheLastPlanIsRefused`). [review]
- Unit tests are named `*Test` (surefire); integration tests `*IT` (failsafe). [build: pom surefire and
  failsafe defaults]

## 2. No mocks of our classes (S8)

- No Mockito anywhere: tests never mock a repository, service or request record. Build the real object, or
  use the real bean from the context. [ArchUnit: ArchitectureTest `noTestUsesMockito`]
- External boundaries get hand-written fakes:
  - Time: a fixed `java.time.Clock`. A unit test builds the class with `Clock.fixed(...)`; an IT that must
    control time builds the service by hand over the real repository (`SessionClockBoundaryIT`,
    `SeriesTopUpJobIT`), since the context clock is the system one. ITs read "today" from
    `fixtures.today()`, never `LocalDate.now()`.
  - Mail: `support.RecordingMailSender` through `@Import(InMemoryMailConfig.class)` (records messages, holds
    sends until `release` is counted down, reads reset tokens with `resetTokensSentTo`). Mail goes out on an
    executor, so wait with Awaitility. [test: ForgotPasswordAsyncIT, PasswordRecoveryIT]
- Time-based rules that real time cannot reach are tested by rewriting rows with SQL (`SessionIT`
  backdating) or the fixed-clock approach above. [review]

## 3. Integration base (S7, AD-020)

- Every `*IT` extends `support.AbstractIntegrationTest`: `@SpringBootTest(MOCK)` + MockMvc, profile `test`,
  a disposable `postgres:16-alpine` Testcontainers instance shared by the JVM (`TestcontainersConfig`,
  `@ServiceConnection`), Flyway from an empty database, and `truncateAll()` before each test (truncation,
  not rollback, so the code under test commits for real). [build: the base class; test:
  DisposableDatabaseGuardTest]
- The truncation refuses any database but `findraco_test` (`DisposableDatabaseGuard`). Never point a test
  at a shared database. [test: DisposableDatabaseGuardTest]
- Contexts are cached: keep `@TestPropertySource` and `@Import` to the few classes that need them (they
  each start their own context). [review]
- The `test` profile (`src/test/resources/application-test.properties`) sets a fixed JWT key, generous rate
  limits (a rate-limit IT sets tight ones itself) and `app.series.top-up-cron=-`, so no scheduled job fires
  in a test; an IT calls the job itself. [build: properties; test: SeriesTopUpJobIT]
- Helpers in `support/`:
  - `Fixtures`: `aUser()`, `aPlan(owner)`, `addMember(plan, user, role)`, `aTransaction(...)`,
    `aCategory(...)`, `now()`, `today()`, and `transactionVersion(id)` / `categoryVersion(id)` /
    `seriesVersion(seriesId)` for the `version` an edit request must send. Build state through these, not
    through the endpoint under test.
  - `TestAuthHelper.asUser(user)`: a real JWT from the production `JwtService`; never `@WithMockUser` on a
    security-sensitive test. [review]
  - `ProblemMatchers.problem(status, slug)`: asserts status, the problem media type and
    `urn:findraco:problem:<slug>`. Every error assertion uses it. [review]
  - `CapturedLogs`: collects log events for hygiene and level assertions.

## 4. The role matrix (S13, AD-020)

- `PlanAuthorizationMatrixIT` holds one table of rows (`Row(key, request, owner, editor, contributor,
  viewer)`) and runs every row for owner, editor, contributor, viewer and non-member (404). A new
  plan-scoped endpoint adds its row; an endpoint that is not role-scoped (public, about the caller, or
  addressed by a token) is listed in `NOT_ROLE_SCOPED` with its reason. [test: the matrix, and
  `everyEndpointOfTheApplicationHasAMatrixRowOrIsListedAsNotRoleScoped`, which walks the handler mappings
  and fails on an endpoint with no row or a row with no endpoint]
- Removing a guard from an endpoint fails a row. When you add a guard, break it once to see its row fail,
  then revert it. [review]
- The permission flags in responses agree with the guards: false if and only if the call is refused.
  [test: `planFlagsAgreeWithThePlanWideEndpointsForEveryRole`,
  `transactionFlagsAgreeWithEditAndDeleteForEveryRoleAndRow`]

## 5. What a rule's test asserts

- One IT per rule, with the exact status and slug: `.andExpect(problem(HttpStatus.CONFLICT, "last-plan"))`;
  a field error also asserts `field` or `errors[].code`. [review]
- A refused write also asserts that nothing changed (the row is unchanged, the count the same). [review]
- A query that feeds a response asserts its statement count when the shape matters. [test: StatementCountIT]
- A contract change is caught by `OpenApiSnapshotIT`: it compares `/v3/api-docs` with the committed
  `backend/openapi.json` and prints the diff. Regenerate it in the same commit:
  `./mvnw verify -Dit.test=OpenApiSnapshotIT -Dopenapi.update=true`. [test: OpenApiSnapshotIT]
- A new request field is bounded and its bound has a case in `BoundedInputsIT`. [test: BoundedInputsIT]
- Secrets and personal data never reach a log; a new flow that handles them is added to `LogHygieneIT`.
  [test: LogHygieneIT]

## 6. Structural rules (AD-016)

- `ArchitectureTest` holds every structural rule; a new rule lands in the commit that makes the code comply
  and fails once on a planted violation (planted, seen red, reverted). [review]
- No `@SuppressWarnings` to get green: fix the code, or change the check for the whole project in
  `pom.xml`. [ArchUnit: ArchitectureTest `noSourceSuppressesWarnings`] Nor is a test `@Disabled` to hide a
  failure. [review]
- Unit tests of pure logic are held by the JaCoCo gate for the invariant classes only (80% branches on
  `SplitResolver`, `CategorySpendingAssembler`, `ItemShareAllocator`, `PlanAuthorization`); there is no
  global percentage. [build: JaCoCo `check`]

## 7. Running

- From `backend/`, with JDK 25 and Docker running:
  `JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B verify`. Unit tests: `./mvnw test`. One class:
  `./mvnw -B verify -Dtest='NoSuch*' -Dit.test='PlanManagementIT' -Dsurefire.failIfNoSpecifiedTests=false
  -Dfailsafe.failIfNoSpecifiedTests=false`. The Docker socket setup on Linux is in
  `.specs/codebase/TESTING.md`.
- CI runs `./mvnw -B verify` (every test class, JaCoCo, Spotless, ArchUnit); deploy waits for it. [build:
  `.github/workflows/ci.yml`]
- `./mvnw spotless:apply` before committing; the pre-commit hook needs the same `JAVA_HOME`. [build:
  Spotless]

## Before done

- [ ] The test matches a row of the table; a rule has its own test, not a bundle.
- [ ] Status and slug asserted with `problem(...)`; a refused write asserts nothing changed.
- [ ] A new plan-scoped endpoint has its role-matrix row.
- [ ] No Mockito; boundaries use a fixed `Clock` or the in-memory mail fake.
- [ ] `openapi.json` regenerated when the contract moved.
- [ ] `./mvnw -B verify` green.
