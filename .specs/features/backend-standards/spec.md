# Backend Standards Specification

## Problem Statement

The backend audit (`.specs/codebase/backend-quality-audit.md`, 2026-10-20) found the same root cause as the frontend audit: missing standards, not chaos. Packages by type leave no boundary between domains, business rules live on one entry path and not on another (H1, H3), the error contract is in three states, nothing is checked by a tool, CI runs 9 of 32 test classes, and the platform (Spring Boot 3.5.3, Java 17) is out of free support since 2026-06-30. The symptoms include data-corrupting bugs and 500s on accepted input (H1–H15). Every decision in this spec was taken with the user, one at a time; rationale and rejected alternatives are in `context.md` (S1–S27).

## Goals

- [ ] The backend standards are written once, coherently, in the backend skills, `CLAUDE.md` and `.specs/codebase/` docs, and every one that a tool can check is enforced in the build (ArchUnit, Spotless, enforcer, `-Xlint`, Error Prone).
- [ ] `./mvnw -B verify` runs every test class on a disposable database, locally and in CI, and deploy waits for it.
- [ ] The platform runs on a supported Spring Boot 4.1 and Java 25.
- [ ] The existing code complies with the standards, slice by slice; every audit H bug is fixed under them, each with a test that fails before the fix.
- [ ] The frontend changes the new contract requires ship in the same slice as the backend change, with no other user-visible behaviour change than those listed in Assumptions.

## Out of Scope

| Feature | Reason |
| ------- | ------ |
| Recurrence v3: actual vs forecast | Product decision, own Discuss (S26); queued in `STATE.md` |
| Multiple banks, card bills, classification memory, merchant normalisation | Own feature (S19 lays the groundwork: parser registry, `sourceText`) |
| E-mail confirmation on sign-up (closing the 409 enumeration) | Needs a confirmation flow; the user wants it later (S5) |
| Frontend generated API types | frontend-standards STD-13; this feature delivers its prerequisites (S10, S16) |
| MCP connector, WhatsApp, i18n | Their own roadmap items; the standards prepare for them (S15, S22, S11) |
| Distributed scheduling lock (ShedLock) | One instance today (S26) |
| Metrics, distributed tracing, JSON logs | Deferred until needed (S14) |
| Replacing nginx | User plans it separately; S20 is proxy-agnostic |
| Local Docker database quick task | Testcontainers covers tests (S7); the dev database is a separate quick task |

---

## Assumptions & Open Questions

| Assumption / decision | Chosen default | Rationale | Confirmed? |
| --------------------- | -------------- | --------- | ---------- |
| All standards decisions | As recorded in `context.md` S1–S27 | Reviewed one at a time with the user, 2026-10-20 to 2026-10-29 | y |
| Slice order | BST-01 → 02 → … → 21 as numbered below; Design may merge adjacent slices or reorder within a dependency-safe order, never move BST-01/02 later | Test harness first so the upgrade is checked by all 32 classes; upgrade before the restructure (S23); structure before the rules that are written against it | y |
| Testcontainers before the upgrade | BST-01 (S7 + H13) precedes BST-02 (S23); S23's "first slice" is read as "first production-code slice" | The upgrade needs the full IT suite to tell whether it broke anything; today 23 classes never run in CI | y |
| Rules land already satisfied | Each ArchUnit rule, enforcer rule or `failOnWarning` lands in the slice that makes the code comply, never red (as frontend G1) | A red build blocks every other slice | y |
| Skills and docs timing | Each slice updates the skill section and `CLAUDE.md` lines for the rule it lands; BST-20 does the final docs pass and dead-code removal | S24 says skills describe only what exists | y |
| Routes | `/financial-transaction` → `/transaction`, `/financial-transaction-category` → `/category`; every other route unchanged (S24 amended) | User, 2026-10-29: consistency end to end; the web is the only client and the generated types guide the change | y |
| User-visible changes allowed | Error copy from the `type` map (S15); 422 instead of 400 on field errors (S5); stale-version warning and reload (S6); edit/delete shown only when permitted (S13); 429 copy (S20); password rules 8–128 (S21); CSV result and error list (S19); category usage for any period from the server (S22); series no longer resurrect deleted occurrences (S25) | Each is a decided contract change; anything else is behaviour-preserving | y |
| Existing data | Hardening migrations check preconditions on production data and abort on anything unexpected (S9); a null/duplicate check runs before each constraint migration | Constraints on dirty data fail the deploy | y |
| Rate-limit values | Login 5/min per e-mail and 20/min per IP; forgot-password 3/hour per e-mail and 10/hour per IP; register 5/hour per IP; CSV import 10/hour per user | Common defaults for a small app (S20) | y |
| CSV bounds | 1 MB, 5 000 rows, error list capped at 50 | Far above a monthly bank statement; bounds per S17 | y |
| Configurable values | Operational values live in `application.properties` under `app.*`, bound by `@ConfigurationProperties` and validated at startup: rate limits, CSV bounds and error cap, series horizon, daily-job schedule. Contract values the frontend mirrors (password length, field sizes, money scale) stay in code | User, 2026-10-29: "leave configurable what can be"; a contract value changed only on the server would drift from the client | y |
| Argon2id parameters | Spring Security 7 `Argon2PasswordEncoder.defaultsForSpringSecurity_v5_8()` unless Design finds a newer recommended preset | Library defaults follow OWASP; ~50 ms target (S21) | n |
| Error Prone and JDK 25 | Verified in Design; if no compatible release exists, Error Prone lands in the first slice after one does, the other S12 tools do not wait | S23 watch point | y |
| Version numbers | Exact Boot 4.1.x, Commons CSV, Bucket4j, ArchUnit, Testcontainers versions chosen in Design from the latest stable releases | Facts to look up, not decisions | y |
| Beta bumps | Every push that ships a frontend change bumps `1.0.0-beta.N` (process rule, 2026-10-19) | Existing rule | y |

**Open questions:** none - all resolved or logged above.

---

## User Stories

### P1: Disposable test database and CI gate ⭐ MVP

**User Story**: As the developer, I want every test class to run on a throwaway Postgres, locally and in CI, so that a green build means the whole suite passed and no test touches shared data.

**Why P1**: S7, H13; every later slice relies on the full suite.

**Acceptance Criteria**:

1. WHEN an IT class runs THEN it SHALL use a Postgres 16 Testcontainers instance started for the run via `@ServiceConnection`.  <!-- event-driven -->
2. The test configuration SHALL contain no URL, host or credential of `dev_finsight` or of the SSH tunnel.  <!-- ubiquitous -->
3. WHEN CI runs the backend job THEN it SHALL execute `./mvnw -B verify`, running every `*Test` and `*IT` class and the JaCoCo gate.  <!-- event-driven -->
4. IF any backend test or the JaCoCo gate fails THEN the deploy job SHALL NOT run.  <!-- unwanted-behavior -->
5. WHEN the session ITs (`*SessionIT`, `*AuthenticationIT`, `*UserSessionRepositoryIT`, `*PasswordRecoveryIT`) run THEN they SHALL pass, including logout and password reset answering 401 on the revoked session and a 15-minute access-token lifetime (H13).  <!-- event-driven -->
6. The truncation guard SHALL refuse to truncate a database whose name is not disposable.  <!-- ubiquitous -->

**Independent Test**: Stop the SSH tunnel and run `./mvnw verify` → all 32 classes run green; break a session revocation → the session IT fails.

---

### P1: Supported platform ⭐ MVP

**User Story**: As the developer, I want the backend on Spring Boot 4.1 and Java 25 with automatic dependency updates, so that it receives security patches.

**Why P1**: S23; 3.5 has had no free patches since 2026-06-30.

**Acceptance Criteria**:

1. The backend SHALL build with Spring Boot 4.1.x and Java 25.  <!-- ubiquitous -->
2. The production image SHALL run on a Java 25 base image.  <!-- ubiquitous -->
3. WHEN the upgrade lands THEN every test class SHALL pass with no test weakened or deleted.  <!-- event-driven -->
4. The Dockerfile SHALL copy `pom.xml` and resolve dependencies in a layer before copying `src`.  <!-- ubiquitous -->
5. The repository SHALL contain a `.github/dependabot.yml` for maven, npm and GitHub Actions, grouped weekly.  <!-- ubiquitous -->

**Independent Test**: `./mvnw -v` and `mvn help:evaluate` show Java 25 and Boot 4.1; a redeploy with unchanged `pom.xml` reuses the dependency layer.

---

### P1: Mechanical enforcement ⭐ MVP

**User Story**: As the developer (and the agents who write most commits), I want the build to reject formatting drift, banned dependencies, compiler warnings, known bug patterns and architecture violations, so that the standards hold without review.

**Why P1**: S12; S1–S27 lean on the build to hold them.

**Acceptance Criteria**:

1. WHEN `./mvnw verify` runs THEN Spotless SHALL check palantir-java-format and fail on any unformatted file.  <!-- event-driven -->
2. WHEN a developer commits THEN the pre-commit hook SHALL run the Spotless check on staged backend files and block the commit on a violation.  <!-- event-driven -->
3. The formatting commit SHALL be listed in `.git-blame-ignore-revs`.  <!-- ubiquitous -->
4. IF `pom.xml` declares Lombok or MapStruct THEN maven-enforcer SHALL fail the build.  <!-- unwanted-behavior -->
5. IF the build runs on a Java version other than 25 THEN maven-enforcer SHALL fail the build.  <!-- unwanted-behavior -->
6. IF compilation emits any warning under `-Xlint:all` THEN the build SHALL fail.  <!-- unwanted-behavior -->
7. WHERE Error Prone supports the JDK in use the compiler SHALL run Error Prone and fail on any error-level finding.  <!-- optional-feature -->
8. The codebase SHALL contain no `@SuppressWarnings`; a check disabled for good is disabled once, project-wide, in the build configuration.  <!-- ubiquitous -->
9. The test suite SHALL contain one ArchUnit test class that holds every structural rule of this spec, including the current `CLAUDE.md` rules (no controller-to-repository access, no field injection).  <!-- ubiquitous -->

**Independent Test**: Add `@SuppressWarnings("unchecked")` → build fails; inject a repository into a controller → ArchUnit fails; misformat a file → Spotless fails.

---

### P1: Structure by feature ⭐ MVP

**User Story**: As the developer, I want one package per feature with layer sub-packages and one name per domain, so that a feature's code lives together and boundaries are checked.

**Why P1**: S1, S10, S18, S24; the other rules are written against this structure.

**Acceptance Criteria**:

1. Production code SHALL live under `com.lcs.findraco.<feature>` for `transaction`, `category`, `plan`, `auth`, `user`, `dashboard` (final list fixed in Design), plus `shared`.  <!-- ubiquitous -->
2. Within a feature, classes SHALL sit in layer sub-packages (`controller`, `service`, `repository`, `model`, `request`, `response`, others named in Design).  <!-- ubiquitous -->
3. IF a class in feature X depends on feature Y outside Y's `service` and `model` packages (and S2's read-only repositories) THEN ArchUnit SHALL fail.  <!-- unwanted-behavior -->
4. Classes SHALL be named `Category*` and `Transaction*`; no class SHALL be named `FinancialTransaction*`.  <!-- ubiquitous -->
5. Tables SHALL be `transactions` and `categories`, with their sequences, primary keys, checks, foreign keys and indexes named `pk_`, `uk_`, `fk_`, `idx_`, `ck_` (S9, S24).  <!-- ubiquitous -->
6. IF the rename migration finds the tables under neither the old nor the new names THEN it SHALL abort.  <!-- unwanted-behavior -->
7. Request and response DTOs SHALL be `record`s named `CreateXxxRequest`, `UpdateXxxRequest`, `XxxResponse`, `XxxSummaryResponse`, one public type per file, with no nested types and no `Dto` suffix (S10).  <!-- ubiquitous -->
8. IF two DTOs share a simple name, a DTO suffix does not match its package, or a DTO declares a nested type THEN ArchUnit SHALL fail.  <!-- unwanted-behavior -->
9. `PlanContext` SHALL carry `planId`, `userId` and `role` only, and the authenticated identity SHALL be `AuthenticatedUser(id)` (S18).  <!-- ubiquitous -->
10. IF a controller or service method receives a JPA entity from an argument resolver THEN ArchUnit SHALL fail.  <!-- unwanted-behavior -->
11. WHEN a request targets a plan the caller is not a member of THEN the resolver SHALL answer 404 before the controller runs.  <!-- event-driven -->
12. The JSON of every endpoint SHALL be unchanged by this slice, except where a later story states otherwise.  <!-- ubiquitous -->
13. Transaction routes SHALL be under `/api/findraco/plan/{planId}/transaction` and category routes under `/api/findraco/plan/{planId}/category`; the frontend SHALL call the new routes in the same slice.  <!-- ubiquitous -->
14. IF a request uses `/financial-transaction` or `/financial-transaction-category` THEN the system SHALL answer 404.  <!-- unwanted-behavior -->
15. IF a configuration value under `app.*` is missing or out of range THEN the application SHALL refuse to start.  <!-- unwanted-behavior -->

**Independent Test**: The S16 snapshot (or, before it, a recorded `/v3/api-docs` diff of field names) is unchanged; ArchUnit fails when a `category` service imports `transaction.repository`.

---

### P2: Cross-feature access

**User Story**: As the developer, I want writes to another feature's tables to go through its owner and aggregate reads through read-only repositories, so that invariants have one guardian.

**Why P2**: S2.

**Acceptance Criteria**:

1. WHEN a category is deleted THEN its transactions SHALL be reassigned through `TransactionService`, not through transaction, item or recurrence repositories.  <!-- event-driven -->
2. The dashboard report queries SHALL live in a `dashboard` repository extending Spring Data `Repository`.  <!-- ubiquitous -->
3. IF a repository outside its entity's owner feature declares `save`, `delete` or any modifying query THEN ArchUnit SHALL fail.  <!-- unwanted-behavior -->

**Independent Test**: Category delete IT keeps reassigning transactions; adding `save` to the dashboard repository fails ArchUnit.

---

### P2: Aggregates guard their consistency, with optimistic locking

**User Story**: As a plan member, I want every entry path (form, CSV, future MCP) to obey the same rules and concurrent edits never to overwrite each other silently, so that my money data stays correct.

**Why P2**: S3, S6; fixes H1, H3, H5, H7.

**Acceptance Criteria**:

1. `Transaction`, `RecurrenceDefinition` and `Category` SHALL have one creation method that requires valid data and no public setters.  <!-- ubiquitous -->
2. IF a `model` class depends on a `service`, `repository`, security or `request` package THEN ArchUnit SHALL fail.  <!-- unwanted-behavior -->
3. IF participants or items are written through a repository of their own THEN ArchUnit SHALL fail.  <!-- unwanted-behavior -->
4. IF a transaction would be created with no participant THEN creation SHALL fail with its named exception, on HTTP and CSV paths alike (H1).  <!-- unwanted-behavior -->
5. IF a series edit sets an end date before its start THEN it SHALL answer 422 with the same `type` as series creation (H3).  <!-- unwanted-behavior -->
6. IF an EXACT split has a missing or negative share THEN the request SHALL answer 422, never 500 (H5).  <!-- unwanted-behavior -->
7. IF a series edit uses a category whose type differs from the series' type THEN it SHALL answer 422 (H7).  <!-- unwanted-behavior -->
8. IF a category's type change is requested while transactions use it THEN it SHALL answer 409 (H7).  <!-- unwanted-behavior -->
9. Responses for transactions, series and categories SHALL carry `version`, and their edit requests SHALL require it.  <!-- ubiquitous -->
10. IF an edit request carries a stale `version` THEN the system SHALL answer 409 with `type` `urn:findraco:problem:stale-version` and change nothing.  <!-- unwanted-behavior -->
11. WHEN the frontend receives the stale-version 409 THEN it SHALL tell the user the item was changed by someone else and reload it.  <!-- event-driven -->

**Independent Test**: Two edits with the same version → second gets 409 and the first's split survives; a CSV row path and an HTTP path both reject a transaction without participants.

---

### P2: Persistence boundary (OSIV off)

**User Story**: As the developer, I want every database access inside a service transaction with declared fetch plans, so that queries are visible and bounded.

**Why P2**: S4.

**Acceptance Criteria**:

1. `spring.jpa.open-in-view` SHALL be `false`.  <!-- ubiquitous -->
2. A service method called by a controller SHALL return a response type, built by `XxxResponse.from(entity)` inside the transaction.  <!-- ubiquitous -->
3. A service method called by another feature SHALL return an entity or nothing, never a response type.  <!-- ubiquitous -->
4. Every `@ManyToOne` SHALL be LAZY.  <!-- ubiquitous -->
5. WHEN the transaction list returns a page of 20 rows THEN it SHALL issue a fixed number of SQL statements independent of the row count, asserted by an IT.  <!-- event-driven -->

**Independent Test**: The list IT counts statements for 5 and 20 rows → equal.

---

### P2: Error contract

**User Story**: As a client (web today, mobile, WhatsApp and MCP later), I want every error in one documented shape with a stable identifier, so that I branch on the problem, not on its wording.

**Why P2**: S5, S15; fixes X1, X2, X3.

**Acceptance Criteria**:

1. Every error response SHALL be `application/problem+json`, produced by the advice, the authentication entry point, the access-denied handler and filters alike.  <!-- ubiquitous -->
2. Every problem `type` SHALL be `urn:findraco:problem:<slug>`, with the slug from the `ProblemType` enum.  <!-- ubiquitous -->
3. Every problem body SHALL carry `requestId` and, when a field is involved, `field`.  <!-- ubiquitous -->
4. WHEN Bean Validation fails THEN the response SHALL be 422 with `errors: [{ field, code, message }]`, where `code` is the constraint name.  <!-- event-driven -->
5. WHEN the request cannot be read (malformed JSON, wrong type, unknown enum, missing parameter) THEN the response SHALL be 400.  <!-- event-driven -->
6. WHEN a request clashes with stored state THEN the response SHALL be 409; WHEN it is invalid on its own THEN 422.  <!-- event-driven -->
7. IF a resource is outside the caller's scope THEN the response SHALL be 404, never 403.  <!-- unwanted-behavior -->
8. IF an unexpected exception escapes (including `IllegalArgumentException`) THEN the response SHALL be 500 with a fixed `detail` and the cause logged at `ERROR`.  <!-- unwanted-behavior -->
9. IF production code throws `IllegalArgumentException` as a user-facing error THEN ArchUnit SHALL fail.  <!-- unwanted-behavior -->
10. `detail` SHALL never contain a token, an e-mail address or other personal data.  <!-- ubiquitous -->
11. The frontend SHALL show error copy from a `type` → message map, falling back to a generic message per status, and SHALL never show `detail`.  <!-- ubiquitous -->
12. WHEN a category delete answers 409 THEN the frontend SHALL tell "has subcategories" from "has transactions" by `type` (X2).  <!-- event-driven -->
13. `ErrorResponseDto` SHALL not exist.  <!-- ubiquitous -->

**Independent Test**: A test walks the producers (advice, 401 entry point, 403 handler, a filter) and asserts the media type and `type` URN; rewording an exception message changes no frontend behaviour.

---

### P2: OpenAPI as the contract

**User Story**: As the frontend (and future clients), I want a schema that tells the truth and changes only visibly, so that generated types are correct.

**Why P2**: S16; prerequisite of frontend STD-13.

**Acceptance Criteria**:

1. Every response field SHALL be required in the schema unless annotated `@Nullable`.  <!-- ubiquitous -->
2. `PlanContext` SHALL not appear in the schema; `planId` SHALL appear as a path parameter on plan routes.  <!-- ubiquitous -->
3. Enums SHALL appear as named `$ref` schemas, including the allowed `sortBy` values.  <!-- ubiquitous -->
4. Every operation SHALL declare its real success status (200, 201 or 204).  <!-- ubiquitous -->
5. Every operation SHALL declare 400, 401, 404, 422 and 500 responses referencing a shared `ProblemDetail` schema, and plan routes SHALL also declare 403.  <!-- ubiquitous -->
6. The schema SHALL expose `ProblemType` as an enum.  <!-- ubiquitous -->
7. IF the generated `/v3/api-docs` differs from the committed `backend/openapi.json` THEN an IT SHALL fail and print the diff.  <!-- unwanted-behavior -->

**Independent Test**: Rename a response field without regenerating → snapshot IT fails with the diff.

---

### P2: Contract shape and permissions

**User Story**: As a client, I want bounded inputs, no dead fields, composed requests and the server telling me what I may do, so that the contract is small, safe and honest.

**Why P2**: S13, S17; fixes X7, C14.

**Acceptance Criteria**:

1. The dashboard summary SHALL not return `categoryBreakdown` or `monthlyTrend`.  <!-- ubiquitous -->
2. JSON property names SHALL equal Java component names (`isDefault` serialises as `isDefault`).  <!-- ubiquitous -->
3. The series edit request SHALL be `{ scope, pivotOccurrenceId, series }`, with `series` the series create request.  <!-- ubiquitous -->
4. IF a request `String` or `List` component lacks `@Size` THEN ArchUnit SHALL fail.  <!-- unwanted-behavior -->
5. Request strings SHALL be bounded at or below their column length; money SHALL accept at most 2 fraction digits; `spendingLimit` SHALL be zero or positive; `parcelsNumber` SHALL be bounded on every request that carries it (H11, C14).  <!-- ubiquitous -->
6. The ownership transfer request SHALL use an enum without `OWNER`.  <!-- ubiquitous -->
7. `PlanResponse` SHALL carry `permissions` with `createTransactions`, `attributeToOthers`, `manageCategories`, `managePlan`, and `TransactionResponse` SHALL carry `permissions` with `edit`, `delete`.  <!-- ubiquitous -->
8. Each `PlanAuthorization` guard `requireX` SHALL be implemented as `if (!canX(...)) throw`.  <!-- ubiquitous -->
9. WHEN the role matrix IT runs THEN for every role and action the flag SHALL be false if and only if the endpoint refuses the call.  <!-- event-driven -->
10. The frontend SHALL read permission flags from responses and compute none; while data loads every flag SHALL be false.  <!-- ubiquitous -->
11. WHEN a contributor views another member's transaction THEN the frontend SHALL not offer edit or delete.  <!-- event-driven -->

**Independent Test**: Role matrix IT green over every endpoint × role; a contributor sees no edit on another member's row.

---

### P2: Time

**User Story**: As a member anywhere, I want instants stored in UTC, transaction dates as calendar dates and "today" taken from my device, so that dates never shift.

**Why P2**: S11.

**Acceptance Criteria**:

1. Instant columns SHALL be `timestamptz` and their Java fields `Instant`.  <!-- ubiquitous -->
2. Transaction dates SHALL be `LocalDate` and SHALL never be converted between zones.  <!-- ubiquitous -->
3. IF production code calls `now()` without the injected `Clock`, `LocalDate.now()` without a zone, or `ZoneId.systemDefault()` THEN ArchUnit SHALL fail.  <!-- unwanted-behavior -->
4. `users.time_zone` SHALL hold an IANA id, default automatic, with existing users set to `America/Sao_Paulo`.  <!-- ubiquitous -->
5. WHEN a request carries a `Time-Zone` header and the user's zone is automatic THEN the server SHALL store that zone.  <!-- event-driven -->
6. IF the `Time-Zone` header is not a valid IANA id THEN the server SHALL ignore it and keep the stored zone.  <!-- unwanted-behavior -->
7. The frontend SHALL send `Time-Zone` on every request, and the profile SHALL let the user pin a zone.  <!-- ubiquitous -->

**Independent Test**: Run the suite with the JVM in `Pacific/Kiritimati` → same results; ArchUnit fails on a `LocalDate.now()`.

---

### P2: Migrations and database guarantees

**User Story**: As the developer, I want the schema to live only in migrations and to guard the invariants that bypass the code, so that the database is never the weak point.

**Why P2**: S9; fixes H12, P3, P4.

**Acceptance Criteria**:

1. Entities SHALL carry no `@Index`, `@UniqueConstraint` or other schema-only annotations.  <!-- ubiquitous -->
2. Every SQL-expressible S3 invariant SHALL also be a `NOT NULL`, `CHECK` or `UNIQUE` constraint.  <!-- ubiquitous -->
3. Every foreign key SHALL have an index unless a composite index starts with it.  <!-- ubiquitous -->
4. The `transactions` table SHALL have a partial unique index on `(plan_id, source_ref) WHERE source_ref IS NOT NULL` (H12).  <!-- ubiquitous -->
5. WHEN two imports of the same file run concurrently THEN each row SHALL be stored once (H12).  <!-- event-driven -->
6. WHEN a series edit or delete runs THEN it SHALL hold the same lock on the definition as the top-up (H12).  <!-- event-driven -->
7. IF a data or constraint migration finds data violating its precondition THEN it SHALL abort with a message naming the violation.  <!-- unwanted-behavior -->
8. A `MigrationsIT` SHALL boot on an empty database and validate the schema against the entities.  <!-- ubiquitous -->

**Independent Test**: Concurrent import IT stores each row once; a migration run against seeded dirty data aborts.

---

### P2: Request tracing and logging

**User Story**: As the developer, I want every request traceable from a user's report to the log, with nothing sensitive logged, so that support is possible and safe.

**Why P2**: S14; fixes S3, S7.

**Acceptance Criteria**:

1. WHEN a request arrives THEN the system SHALL use its `X-Request-Id` or generate one, put it in the MDC and return it in the response header.  <!-- event-driven -->
2. WHEN a request completes THEN the system SHALL log one `INFO` line with method, route template, status, duration, user id and plan id.  <!-- event-driven -->
3. The log SHALL never contain passwords, tokens, reset links, e-mail addresses, request bodies or amounts; a test SHALL assert it for the login and reset flows.  <!-- ubiquitous -->
4. IF a 4xx is answered THEN no stack trace SHALL be logged; IF a 5xx is answered THEN it SHALL be logged at `ERROR`.  <!-- unwanted-behavior -->
5. `spring.jpa.show-sql` SHALL be off outside the local profile.  <!-- ubiquitous -->

**Independent Test**: A failing request's toast shows the request id; grepping the log for it finds the request line and the error.

---

### P2: Rate limits and network exposure

**User Story**: As a user, I want brute force, reset bombing and spam throttled and the API reachable only through the proxy, so that my account and the SMTP quota are safe.

**Why P2**: S20; fixes S1, S2.

**Acceptance Criteria**:

1. The API SHALL listen only on the address the reverse-proxy container reaches (the Docker bridge gateway, set by `SERVER_ADDRESS`), never on the public interface, and SHALL trust `X-Forwarded-For` only from the reverse proxy.  <!-- ubiquitous -->
2. IF a client exceeds the configured limit for login (per IP and per e-mail), forgot-password (per e-mail and per IP), register (per IP) or CSV import (per user) THEN the system SHALL answer 429 with `Retry-After` and `type` `urn:findraco:problem:rate-limited`, and log `WARN`.  <!-- unwanted-behavior -->
3. The limits SHALL be read from `app.rate-limit.*` configuration.  <!-- ubiquitous -->
4. WHEN the frontend receives 429 THEN it SHALL show the rate-limit copy.  <!-- event-driven -->

**Independent Test**: The sixth login in a minute for one e-mail from different IPs gets 429; port 3000 does not answer on the public interface.

---

### P2: Authentication hardening

**User Story**: As a user, I want strong, typeable passwords accepted, weak ones refused, and no timing tells about my account, so that my account is safe without friction.

**Why P2**: S21; fixes S4, S5, S6, S8.

**Acceptance Criteria**:

1. IF a password on sign-up or reset has fewer than 8 or more than 128 code points THEN the system SHALL answer 422 with `code` `PasswordLength`.  <!-- unwanted-behavior -->
2. IF a password contains a control or invisible character (zero-width, line break, tab) THEN the system SHALL answer 422.  <!-- unwanted-behavior -->
3. The system SHALL accept letters in any language, digits, punctuation, spaces and emoji in passwords.  <!-- ubiquitous -->
4. The system SHALL normalise passwords to Unicode NFKC before hashing and before verifying.  <!-- ubiquitous -->
5. New hashes SHALL be Argon2id; WHEN a user with a BCrypt hash logs in successfully THEN the hash SHALL be replaced by Argon2id.  <!-- event-driven -->
6. The system SHALL use one `PasswordEncoder` for real and dummy hashes.  <!-- ubiquitous -->
7. WHEN forgot-password is requested THEN the response SHALL return before the e-mail is sent, with the same status and body whether or not the account exists.  <!-- event-driven -->
8. IF the JWT secret decodes to fewer than 32 bytes THEN the application SHALL refuse to start.  <!-- unwanted-behavior -->
9. The JWT `sub` SHALL be the user id.  <!-- ubiquitous -->
10. `spring.dotenv.filename` SHALL not exist in the configuration.  <!-- ubiquitous -->
11. The frontend password schema SHALL mirror AC 1–3 and warn, without blocking, about leading or trailing spaces.  <!-- ubiquitous -->
12. The system SHALL trim and lower-case (`Locale.ROOT`) every e-mail before storing or comparing it (sign-up, login, forgot/reset password, e-mail invitations), so `Taken@x` and `taken@x` are the same account; a migration SHALL lower-case existing e-mails and refuse to run if that creates a duplicate. (Addendum 2026-10-30, user decision after review.)  <!-- ubiquitous -->

**Independent Test**: "coração tropeira 🌵" registers and logs in from another device; a BCrypt user logs in and the stored hash starts with `$argon2id$`.

---

### P2: CSV import

**User Story**: As a member, I want an import that recognises the file, rejects it whole with every bad line listed, and keeps the bank's text, so that my data is complete and future rules can learn from it.

**Why P2**: S19; fixes L3, T4 (CSV), H1 on the CSV path.

**Acceptance Criteria**:

1. Parsing SHALL be done by `StatementParser` implementations chosen by a registry from the header; the service SHALL contain no parsing.  <!-- ubiquitous -->
2. A parser SHALL read via Apache Commons CSV, touch no database and return valid rows plus errors `[{ line, field, code }]`.  <!-- ubiquitous -->
3. IF the header matches no parser THEN the system SHALL answer 422 `csv-unknown-format`.  <!-- unwanted-behavior -->
4. IF the header is a known unsupported format (card bill) THEN the system SHALL answer 422 `csv-format-not-supported`.  <!-- unwanted-behavior -->
5. IF any row is invalid THEN the system SHALL import nothing and answer 422 listing every invalid line, capped at 50.  <!-- unwanted-behavior -->
6. IF the file exceeds the size or row bound, or contains invalid UTF-8 THEN the system SHALL answer 422 naming the problem (and the line, for encoding).  <!-- unwanted-behavior -->
7. WHEN a file imports THEN the response SHALL be `{ imported, skippedDuplicates }`.  <!-- event-driven -->
8. Each imported row SHALL be created through the `Transaction` creation method and SHALL store the bank's original text in the immutable `sourceText` and the bank id in `sourceRef`.  <!-- ubiquitous -->
9. The parser SHALL have unit tests for: valid file, bad date, bad amount, missing column, empty file, header only, comma inside quotes, quotes kept out of values, BOM, wrong header, card-bill header, blank lines.  <!-- ubiquitous -->

**Independent Test**: Import a statement with one bad line → nothing stored, the line listed; fix it and re-import → all stored, duplicates skipped on a second run.

---

### P2: Category usage from the server

**User Story**: As a member, I want category limits evaluated the same way on every screen and channel for any period, so that "how much is left" has one answer.

**Why P2**: S22; fixes T7.

**Acceptance Criteria**:

1. The category spending endpoint SHALL accept `start` and `end` and return per category and per member `limit` (scaled to the months the period touches), `spent`, `remaining`, `percentUsed` and `status` (`ok | warning | over`).  <!-- ubiquitous -->
2. WHEN the period is 15 Oct–10 Nov with a monthly limit of 100 THEN `limit` SHALL be 200.  <!-- event-driven -->
3. The warning threshold SHALL be defined only in the backend.  <!-- ubiquitous -->
4. The frontend SHALL contain no limit scaling or status computation.  <!-- ubiquitous -->
5. Exactly one of the two frontend CSV import tests SHALL assert the POST + toast + refresh sequence.  <!-- ubiquitous -->

**Independent Test**: Same period on Overview and via the API gives identical status; `scaleLimits.ts` no longer exists.

---

### P2: Series correctness

**User Story**: As a member, I want deleted occurrences to stay deleted, reads never to write and destructive calls never to assume the widest scope, so that series behave predictably.

**Why P2**: S25, S26, H10; fixes H8, H14.

**Acceptance Criteria**:

1. WHEN one occurrence is deleted THEN its date SHALL be stored in `recurrence_exceptions`.  <!-- event-driven -->
2. The generator SHALL never produce an excepted date, and the reconcile SHALL match existing rows by date.  <!-- ubiquitous -->
3. WHEN a series with a deleted occurrence is edited THEN the deleted occurrence SHALL not reappear (H8).  <!-- event-driven -->
4. WHEN the daily job runs (and at startup) THEN every open-ended series SHALL be generated up to today + 12 months.  <!-- event-driven -->
5. WHEN a read asks for a period ending after a plan's generated watermark THEN the service SHALL extend that plan's series to the period end in a separate transaction before reading.  <!-- event-driven -->
6. WHILE a read's period is within the generated watermark the read SHALL write nothing and take no lock.  <!-- state-driven -->
7. No read service SHALL open a `REQUIRES_NEW` transaction.  <!-- ubiquitous -->
8. WHEN nothing is due THEN the watermark SHALL advance to the horizon.  <!-- event-driven -->
9. IF `DELETE` on a series omits `scope` THEN the system SHALL answer 400.  <!-- unwanted-behavior -->
10. WHEN installments are deleted "this and following" THEN remaining labels SHALL keep their original "(k/N)".  <!-- event-driven -->

**Independent Test**: Delete March, edit the series → March stays gone; a dashboard GET within the horizon issues no write statement.

---

### P2: Plans keep their invariants

**User Story**: As a member, I want always to have a plan and invitations that cannot bypass the rules, so that I never land on a broken screen.

**Why P2**: S27, H6, H9.

**Acceptance Criteria**:

1. WHEN leaving, removal or plan deletion would leave a user with no plan THEN the system SHALL provision a personal plan for that user.  <!-- event-driven -->
2. IF a user tries to leave their last plan THEN the system SHALL answer 409.  <!-- unwanted-behavior -->
3. IF an EMAIL invitation lacks an e-mail THEN the system SHALL answer 422 (H6).  <!-- unwanted-behavior -->
4. IF an invitation's plan is soft-deleted THEN preview and accept SHALL answer 404 (H9).  <!-- unwanted-behavior -->
5. IF an invitation requests role OWNER THEN the system SHALL answer 422 (H9).  <!-- unwanted-behavior -->
6. `PERCENT` SHALL not be a split mode in the API.  <!-- ubiquitous -->
7. Every paged query SHALL end its sort with `id`, and search SHALL escape LIKE wildcards (H15).  <!-- ubiquitous -->

**Independent Test**: The owner removes a member whose only plan it is → the member logs in to a fresh personal plan.

---

### P3: Test coverage under the table

**User Story**: As the developer, I want backend tests decided by one closed table, so that every rule is tested once, at the right level.

**Why P3**: S8; fills T2, T3, T4 gaps not covered by the stories above.

**Acceptance Criteria**:

1. Each entity rule and pure logic module SHALL have unit tests per rule and edge case, with no Spring and no mocks.  <!-- ubiquitous -->
2. Each endpoint with a rule or guard SHALL have an IT per rule asserting status and `type`.  <!-- ubiquitous -->
3. The role matrix SHALL be one table-driven test covering every endpoint × role (owner, editor, contributor, viewer, non-member).  <!-- ubiquitous -->
4. Tests SHALL not mock our own classes; external boundaries SHALL use fakes (fixed `Clock`, in-memory mail sender).  <!-- ubiquitous -->
5. Plan management endpoints (delete, leave, transfer, role change, invitation list and preview) SHALL each have an IT (T2).  <!-- ubiquitous -->
6. Transaction list filters other than category SHALL have an IT (T4).  <!-- ubiquitous -->

**Independent Test**: Removing a guard from any endpoint fails a role-matrix row.

---

### P3: Written standards, docs and cleanup

**User Story**: As the developer (and the agents), I want the backend skills and docs to describe exactly what exists, so that new code follows it without re-deciding.

**Why P3**: S24; G4, G5, G6. Lands last because skills describe only what exists.

**Acceptance Criteria**:

1. `backend-endpoint` and `backend-exceptions` SHALL use the real names (`PlanContext`, `PlanAuthorization`, `ApiRoutes`) and tag each rule with what checks it.  <!-- ubiquitous -->
2. A `backend-testing` skill and one structure + persistence + migrations skill SHALL exist, with short Security and Logging sections.  <!-- ubiquitous -->
3. `.specs/codebase/` docs SHALL contain no identifier that no longer exists, and SHALL point to folders instead of listing files.  <!-- ubiquitous -->
4. `backend/bin/` SHALL not be tracked; unused finders SHALL be removed; jjwt SHALL be versioned by one property; `pom.xml` comments SHALL be English.  <!-- ubiquitous -->

**Independent Test**: Grep the docs for each renamed identifier → no hits; every skill rule maps to a context decision.

---

## Edge Cases

- IF a rule cannot be enforced by a tool THEN the skill SHALL say "checked by review", never pretend a tool checks it.
- IF Error Prone flags a false positive THEN the check SHALL be disabled project-wide in the build config with a comment, never per line.
- WHEN a slice changes the contract THEN the frontend change, the `openapi.json` regeneration and the MSW mocks SHALL land in the same slice.
- IF a production precondition check (null/duplicate) fails before a constraint migration THEN the slice SHALL stop and the data SHALL be fixed with the user before continuing.
- WHEN the S1 move runs THEN git SHALL track renames (move and edit in separate commits where a file changes beyond its package line).
- IF the Testcontainers Docker daemon is unavailable THEN the IT run SHALL fail loudly, never silently skip.

---

## Implicit-Requirement Dimensions

| Dimension | Resolution |
| --------- | ---------- |
| Input validation & bounds | Contract shape AC 4–6; passwords AC 1–3; CSV AC 6; time AC 6 |
| Failure / partial-failure states | CSV all-or-nothing (AC 5); migrations abort on preconditions; CI blocks deploy |
| Idempotency / retry / duplicate handling | CSV dedup by `sourceRef` with a unique index; top-up idempotent by watermark and lock |
| Auth boundaries & rate limits | Resolver 404 outside scope; role matrix; permissions flags; rate limits (S20) |
| Concurrency / ordering | Optimistic locking (S6); definition lock on series edit/delete; concurrent import AC |
| Data lifecycle / expiry | Series exceptions persist user intent; sessions and tokens unchanged; zero-plan provisioning |
| Observability | Request id, request line, log hygiene (S14) |
| External-dependency failure | SMTP async on forgot-password; Docker unavailable fails ITs loudly; N/A beyond that, no new external service |
| State-transition integrity | Aggregate methods (S3); category type change blocked while in use; ownership transfer enum |

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
| -------------- | ----- | ----- | ------ |
| BST-01 | P1 Disposable test database and CI gate (AC 1–6) — S7, H13 | Execute | Done |
| BST-02 | P1 Supported platform (AC 1–5) — S23 | Execute | Done |
| BST-03 | P1 Mechanical enforcement (AC 1–9) — S12 | Execute | Done |
| BST-04 | P1 Structure by feature (AC 1–15) — S1, S10, S18, S24 item 4 | Execute | Done |
| BST-05 | P2 Cross-feature access (AC 1–3) — S2 | Execute | Done |
| BST-06 | P2 Aggregates and optimistic locking (AC 1–11) — S3, S6, H1, H3, H5, H7 | Execute | Done |
| BST-07 | P2 Persistence boundary (AC 1–5) — S4 | Execute | Done |
| BST-08 | P2 Error contract (AC 1–13) — S5, S15 | Execute | Done |
| BST-09 | P2 OpenAPI as the contract (AC 1–7) — S16 | Execute | Done |
| BST-10 | P2 Contract shape and permissions (AC 1–11) — S13, S17, H11 | Execute | Done |
| BST-11 | P2 Time (AC 1–7) — S11 | Execute | Done |
| BST-12 | P2 Migrations and database guarantees (AC 1–8) — S9, H12 | Execute | Done |
| BST-13 | P2 Request tracing and logging (AC 1–5) — S14 | Execute | Done |
| BST-14 | P2 Rate limits and network exposure (AC 1–4) — S20 | Execute | Done |
| BST-15 | P2 Authentication hardening (AC 1–12) — S21, addendum AC 12 | Execute | In progress |
| BST-16 | P2 CSV import (AC 1–9) — S19 | Execute | Done |
| BST-17 | P2 Category usage from the server (AC 1–5) — S22 | Execute | Done |
| BST-18 | P2 Series correctness (AC 1–10) — S25, S26, H8, H10, H14 | Execute | Done |
| BST-19 | P2 Plans keep their invariants (AC 1–7) — S27, H6, H9, H15 | Execute | Done |
| BST-20 | P3 Test coverage under the table (AC 1–6) — S8, T2–T4 | Execute | Done |
| BST-21 | P3 Written standards, docs and cleanup (AC 1–4) — S24 items 1–3 | Execute | Done |

**ID format:** `BST-NN`; each ID is one slice covering the AC range in its row. Slice order follows the IDs unless Design refines it (Assumptions).

**Coverage:** 21 total, 21 mapped to tasks (T1–T83)

---

## Success Criteria

- [ ] `./mvnw -B verify` is green on every `main` commit with all test classes on Testcontainers, and deploy has never run after a red backend job.
- [ ] The backend runs Spring Boot 4.1 on Java 25 in production.
- [ ] The codebase contains no `@SuppressWarnings`, no `IllegalArgumentException` as a user error, no `FinancialTransaction*` class and no `ErrorResponseDto`.
- [ ] Every audit H bug has a test that failed before its fix and passes after.
- [ ] Every error the frontend shows comes from the `type` map, and no frontend code computes permissions or category usage.
