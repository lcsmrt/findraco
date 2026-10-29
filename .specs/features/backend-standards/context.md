# Backend Standards Context

**Gathered:** 2026-10-20 onwards
**Input:** `.specs/codebase/backend-quality-audit.md`
**Status:** Discuss complete (2026-10-29): S1–S27 adopted. Next: Design.

---

## Feature Boundary

Backend coding standards in `finsight`: how each kind of backend code is structured and behaves, down to architecture, written into backend skills and `CLAUDE.md`, enforced by tools where a tool can check it, then applied to the existing code slice by slice. Same shape as `.specs/features/frontend-standards/`.

---

## Process notes

- The audit's H bugs (data corruption and 500s) wait for the standards; nothing is fixed ahead of them (user, 2026-10-20). They become slices under the new standards.
- Owed to the user: a plain explanation of the S12 tools (ArchUnit, Spotless/palantir-java-format, maven-enforcer, `-Xlint` + `failOnWarning`, Error Prone): what each does, with an example (user, 2026-10-21).

---

## Decisions

### S1 — Package by feature (audit G2, A1)

- The backend moves from packages by type (`controllers/`, `services/`, `models/`, `repositories/`, `dtos/`, `exceptions/`) to one package per feature under `com.lcs.findraco`: `transaction/` (including series, splits, items, CSV import), `category/`, `plan/` (memberships, invitations), `auth/` (sessions, password reset, JWT), `user/`, `dashboard/`, plus `shared/` for config, security infrastructure, the error contract and `ApiRoutes`. The exact list is settled in Design.
- Inside a feature, classes sit in layer sub-packages (`controller/`, `service/`, `repository/`, `model/`, `request/`, `response/`, and others as needed). Layer roles: the controller is the endpoint and its contract only, the service is where business rules run, the repository is data access with no business rule.
- Because Java's package-private does not reach across sub-packages, repositories and helpers are `public`. The boundary between features is enforced by one generic ArchUnit rule in the build, not by the compiler: a class in feature X may depend on feature Y's `service` and `model` packages only, plus what S2 allows for reads. A violation fails the build.
- Revised 2026-10-21 (user approved): S1 first said "flat inside a feature, package-private". The flat layout would have put about 50 files in `transaction/`. Layer sub-packages plus a single rule keep each folder readable, and the rule is checked just as strictly.
- Same colocation ladder as the frontend (frontend-standards C4b): code is born in the feature that uses it and lifts to `shared/` when a second feature needs it.
- Why: today one feature spans 7 packages and everything must be `public`, so nothing stops a service from using another domain's repository. Cheap at 126 files, more expensive with every feature (MCP connector, i18n), and the ArchUnit rules are written against the structure.
- Rejected: (a) keep packages by type with a `domain/` sub-package for pure logic. No move, but no boundary between domains.
- Residual cost: one large move commit (renames tracked by git), JaCoCo includes and docs updated; cross-feature reads need their own rule (S2).
- Not DDD as such (user asked, 2026-10-20): this is "package by feature" / a modular monolith. It borrows DDD's bounded-context shape and, where useful, the aggregate idea (an aggregate root guards its children's invariants). DDD's full tactical set (domain model separate from JPA, application layer, ports and adapters) is not adopted: premature for this app.

### S2 — Cross-feature access: writes through the owner, aggregate reads through a read-only repository (audit A1, L2)

- **Writes**: a write to another feature's table always goes through the owner's public service. Example: category delete calls `TransactionService.reassignCategory(...)` instead of the transaction, item and recurrence repositories.
- **Aggregate reads** (sums, counts, report rows): a feature may declare its own repository over another feature's entity, extending Spring Data `Repository` (no `save`/`delete`), holding the queries it needs. Example: `dashboard/` owns the five report queries now on `FinancialTransactionRepository`. ArchUnit checks that a repository outside the owner feature declares no write methods.
- **Reads that need a domain rule** come from the owner's service.
- Entities stay public; JPA associations cross features (`FinancialTransaction` → `Plan`, `User`, `Category`).
- Why: what must be protected is the write path, where invariants break. Report queries are shaped by the screen that reads them; putting them in the owner couples it to that screen, adds pass-through methods and grows the largest service (L2).
- Tested against the strongest argument for (a) "everything through the owner": colocation keeps invariant knowledge together. It did not hold: H1 (CSV rows without participants) sits inside `FinancialTransactionService` next to the `create` that does it right. A single factory and a test prevent it, not colocation.
- Rejected: (a) everything through the owner's service; (c) public repositories by convention (today's state, no boundary).
- Residual cost: two repository interfaces over one entity; a schema change to an owner's table must check other features' read queries (JPQL is validated at startup; semantics by the query's IT).
- User, 2026-10-20: adopted, to be revisited with use.

### S3 — Where business rules live: the aggregate guards its own consistency (audit A2, H1, H3)

- **The test:** to check the rule, is anything needed besides the object itself (the entity plus the children that belong only to it)? No → the rule lives in the entity. Yes (a repository lookup, the current user, another independent entity, today's date, another feature) → the rule lives in the service.
- Examples: "a transaction has at least one participant", "the split sums to the total", "a series' end date is not before its start" → entity. "Only the plan owner deletes a category", "e-mail is unique" (service plus DB constraint), "the category belongs to the transaction's plan", "deleting a category moves its transactions" → service.
- Request validation (`@Valid`) checks the shape of the client input for per-field error messages; it is not the guarantee. An invariant that is also a shape check lives in the entity, and the request may repeat it.
- **Guarded entities:** those with at least one rule that passes the test. Today `FinancialTransaction`, `RecurrenceDefinition`, `Category`. They have a single creation method (static factory or constructor) that requires valid data, and intention-revealing methods instead of public setters. Their methods take domain values, never request DTOs (several entry paths: HTTP, CSV, the future MCP connector). Other entities stay plain data.
- The service still owns the use case: it loads, checks permissions, calls other features and saves. It no longer has to remember the consistency rules on each path.
- **Enforced by ArchUnit:** `model` packages depend on no `service`, `repository`, security or `request` package; guarded entities have no public setters; children (participants, items) change only through their root and have no repository of their own for writes.
- Why: H1 (CSV import creates transactions with no participants) and H3 (`editSeries` skips the date check that `createSeries` runs) are the same failure. The rule existed on one path and not on another. With the rule in the entity, both bugs cannot happen.
- Rejected: (a) every rule in the service (today, each new entry path must remember every rule); (c) a factory only (fixes creation, H1, but not edits, H3).
- Residual cost: the three entities gain methods and services switch from setters to them during the compliance slices. Easy to reverse (no schema or API change).
- User, 2026-10-21: adopted.

### S4 — The service returns the response; OSIV off (audit L1, P2)

- `spring.jpa.open-in-view=false`. Every database access happens inside a service transaction.
- **A service method the controller calls returns the response class.** A service method another feature calls (S2) returns the entity or nothing; no JSON crosses there. The controller receives the response and returns it.
- Mapping lives in the response class (`XxxResponse.from(entity)`), called by the service before the transaction ends.
- `@ManyToOne` is LAZY. A finder that feeds a response declares what it loads with `@EntityGraph`, so a list costs a fixed number of queries, visible in the repository.
- Why: with OSIV on, the controller reaches the database through lazy loading after the service ends. That gives hidden queries (about 40 for a 20-row transaction page) and holds the connection while the JSON is written. With OSIV off, a forgotten association fails loudly (`LazyInitializationException`), and the ITs catch it, instead of costing silent extra queries.
- Rejected: (a) the controller maps, OSIV explicitly on, plus `default_batch_fetch_size` (one line; the controller keeps touching the database implicitly).
- Residual cost: move the mapping into services where controllers do it today (most transaction and plan endpoints), and add entity graphs to the list finders. Done in the compliance slices. Easy to reverse.
- User, 2026-10-21: adopted ("I prefer to have more control over what is happening").

### S5 — A rule violation is a named exception thrown where the rule lives (audit X3)

- Each business rule has its own exception (e.g. `SeriesEndBeforeStart`, thrown by the entity per S3; `CategoryNotInPlan`, thrown by the service). Each maps to a ProblemDetail with its own `type` and, when one applies, the field involved, so the frontend branches on `type` and highlights the field.
- Bean Validation (`@Valid`) stays for the shape of single request fields.
- Status codes are semantic:
  - `400`: the request could not be read (malformed JSON, wrong type, unknown enum, missing parameter).
  - `422`: it was read, but its content is invalid on its own (a field constraint, a business rule).
  - `409`: it would be valid, but it clashes with stored state (uniqueness, a category with subcategories, a stale version).
  - `401`: unauthenticated or invalid session.
  - `403`: the caller can see the resource, but their role does not allow the action.
  - `404`: the resource does not exist or is outside the caller's scope.
  - `500`: unexpected; a fixed message, details logged.
  - Test for 422 vs 409: would the request still be invalid against an empty database? Yes → 422.
- Where a semantic status would reveal data, security wins:
  - Outside the caller's scope the answer is always 404, never 403.
  - Login fails with a generic 401 that does not say whether the e-mail or the password was wrong.
  - A password-reset request answers the same whether or not the e-mail exists.
  - Accepted exception: sign-up with a taken e-mail answers 409, which reveals that the address is registered. Hiding it needs an e-mail confirmation flow we do not have. The user wants this improved later (2026-10-21).
- Frontend impact: forms expect 422 instead of 400 for field errors; adjusted with the ProblemDetail migration.
- Fixed rules: our code never throws `IllegalArgumentException` as a user-facing error (ArchUnit). An escaped `IllegalArgumentException` answers a fixed message and logs the detail. Class-level (global) validation errors are mapped.
- Why: one place per rule, valid on every entry path (HTTP, CSV, MCP). The frontend stops parsing message text (X2). Internal messages stop leaking to toasts.
- Rejected: (a) class-level Bean Validation on request DTOs (HTTP path only, so CSV and MCP bypass it, the H1 failure; and it duplicates the entity rule).
- Residual cost: about 7 new exceptions, done together with the queued ProblemDetail migration.
- User, 2026-10-21: adopted, with semantic status codes instead of a single 400 ("400 for everything smells bad").

### S6 — Optimistic locking on the guarded entities (audit P1)

- `FinancialTransaction`, `RecurrenceDefinition` and `Category` (the S3 guarded entities) get a `@Version` column. Responses carry `version`; edit requests must send it back. A stale version answers 409 with its own `type` ("changed by someone else"); the frontend warns and reloads.
- Version in the body, not `ETag`/`If-Match`: edit forms open from list endpoints, which have no per-item header, so the version has to be in the body anyway, and that also puts it in the generated types.
- Why: two members editing one transaction lose a split silently (full replace of participants and items). That is wrong money data, with no trace. With S3 the cost is three columns.
- Rejected: (b) accept last-write-wins. It was my first recommendation; I reversed it because the loss is silent and the cost became small.
- Residual cost: one migration, a `version` field in responses and edit requests, and 409 handling in the frontend.
- User, 2026-10-21: adopted.

### S7 — Integration tests run on Testcontainers (audit T1)

- Every IT run starts a disposable Postgres 16 container (Spring Boot `@ServiceConnection`) and discards it. Same setup locally and in CI; the ITs can no longer reach the shared dev database.
- CI runs `./mvnw -B verify`: every test class plus the JaCoCo gate. The guard that only allows truncating a disposable-named database stays, and so does truncation (not rollback) between tests.
- Why: today each IT truncates `dev_finsight` over the SSH tunnel, so CI runs 9 of 32 classes and deploys without the rest. Testing against the production engine and version, isolated per run, is the mainstream Spring practice (native support since Boot 3.1).
- Rejected: (b) a long-lived local compose Postgres plus a CI service database (two configs that can drift, and one more thing that must be running before tests).
- Residual cost: the Testcontainers dependency, a new test base class, Docker on the dev machine, and 3 to 5 seconds per run. Prerequisite for H13.
- User, 2026-10-21: adopted.

### S8 — A closed test table decides backend tests (audit T5, T6)

| Code | Test |
|---|---|
| Entity rule (S3) and pure logic (split, series generator, CSV parser) | Unit `*Test` per rule and edge case; no Spring, no mocks |
| Endpoint with a rule or a permission guard | `*IT` over HTTP, one per rule (asserts status and error `type`), plus a row in the role matrix |
| Plain CRUD endpoint with no rule | Only its role-matrix row |
| Report query | `*IT` when it holds logic (grouping, filters) |
| Migration | `MigrationsIT` (boots and validates the schema) |

- Code that matches no row gets no test.
- No mocks of our own classes (repositories, services). External boundaries use simple fakes: a fixed `Clock`, an in-memory mail sender.
- Why: S1, S3 and S4 restructure most of the code; tests that assert calls break on every refactor without a bug, outcome tests survive them. The failures the new decisions introduce (a lazy association with OSIV off, a version conflict, a uniqueness constraint) only show against a real database, and S7 makes that cheap.
- Rejected: (b) unit-first with Mockito mocks of repositories, ITs only when unavoidable (the common market default).
- T6: `SessionServiceTest` keeps only its clock-boundary cases; tests that only verify calls are removed.
- Residual cost: a `backend-testing` skill; the missing tests (T2, T3, T4) come with the compliance slices.
- User, 2026-10-21: adopted.

### S9 — Migration rules (audit P3, P4)

1. Migrations are the only source of the schema. Entities carry no `@Index`, `@UniqueConstraint` or other schema annotations (they are dead under `validate` and already drift).
2. Every S3 invariant expressible in SQL is also a database constraint (`NOT NULL`, `CHECK`, `UNIQUE`): the entity guards the code, the database guards whatever bypasses it. One hardening migration after a null check on production (P3).
3. Indexes:
   - Every foreign key gets an index, unless a composite index already starts with that column. Postgres does not index foreign keys on its own, so without one, parent deletes and joins scan the child table.
   - A query gets an index when it runs on a table that grows without bound (transactions, items, participants, sessions) and filters by a selective column. Since every query is plan-scoped, this is normally a composite index that starts with `plan_id`, e.g. `(plan_id, start_date)`.
   - No index on low-cardinality columns or small tables.
4. Explicit names, following the convention V11 and V12 already use: `pk_`, `uk_`, `fk_`, `idx_`, `ck_`.
5. An applied migration is never edited. Fixes go forward in a new migration (Flyway community has no undo).
6. A data migration checks its preconditions and aborts loudly on anything unexpected.
- Flyway stays (plain SQL, a single Postgres); Liquibase's advantage is multi-database changelogs, which we do not need.
- Rejected: mirroring schema annotations strictly in entities (two sources, nothing verifies they match); an index on every searched column (the user found it drastic: write cost with no read gain on small or low-cardinality tables).
- User, 2026-10-21: adopted.

### S10 — DTO naming and shape (audit X4, X5, X8)

1. Names match the frontend's, since its types are generated from them: `CreateXxxRequest` and `UpdateXxxRequest` for input, `XxxResponse` for output, `XxxSummaryResponse` for the slim form embedded in another response (X5: the category inside a transaction carries only id, name and colour). No `Dto` suffix; the `request/` or `response/` package says what it is.
2. One public type per file, nothing nested (e.g. `TransactionParticipantResponse` in its own file). This removes the name collisions at the root.
3. Requests and responses are `record`s (immutable; Jackson, Bean Validation and Spring binding support them). The S4 mapping is `static from(entity)` on the response record. Entities stay classes (JPA requires it).
4. An ArchUnit test checks: unique simple names across DTOs, the suffix matches the package, no nested types.
- Rejected: keep hand-written classes and only rename (hundreds of getter lines for no gain).
- Residual cost: about 40 DTOs renamed and converted in one mechanical slice alongside S1; the frontend regenerates its types and updates imports. JSON is unchanged.
- User, 2026-10-21: adopted.

### S11 — Time: instants in UTC, transaction dates as calendar dates, zones from the device (audit L5)

1. **Instants** (sessions, tokens, invitations, `created_at`, `deleted_at`) are `Instant` in Java and `timestamptz` in Postgres, in UTC.
2. **A transaction's date is a calendar date** (`LocalDate`), with no zone and no time. It is the day of the purchase as it appears on the receipt or the statement, typed by the user or imported from CSV. It is never converted.
3. **Interactive features use the device zone** (read by the browser): the suggested date of a new transaction, the current month, the display of instants. Travel is followed automatically. The backend receives explicit dates and ranges from the frontend and does not derive "today" for the user.
4. **The profile holds a zone for server-initiated features** (MCP connector, e-mails, reminders): IANA id in `users.time_zone`, "automatic" by default, kept current from the `Time-Zone` header the frontend sends on every request (precedent: the GitHub REST API), and the user can pin it manually. Existing users start with `America/Sao_Paulo`.
5. **The server never uses the machine zone.** ArchUnit forbids `now()` without the injected `Clock`, `LocalDate.now()` without a zone and `ZoneId.systemDefault()`. Tests use a fixed `Clock`. Internal horizons (open-ended series top-up) are months ahead, so the zone does not matter for them.
- Why: today the clock follows the machine zone, three places skip the `Clock`, and columns are `timestamp without time zone`. Instances in different zones would disagree on what day it is. Internationalization is on the roadmap, so a single hard-coded business zone was rejected by the user as a workaround.
- Considered and rejected:
  - (a) A single configured business zone (`America/Sao_Paulo`). It defers the problem.
  - A fixed profile zone for interactive use. It is wrong for frequent travellers.
  - Storing the transaction's zone (date plus `time_zone`, the iCalendar and ISO 8583 idea). Without a time it adds only a label, and a default taken from the device is often wrong for retroactive entries. Inferred data that is often wrong is worse than none.
- Accepted cost: a member in an earlier zone may, for a few hours, see a purchase dated "tomorrow". It is the receipt's date, which is the YNAB, Expensify and bank-statement model.
- Future: if the place of purchase matters, it becomes an explicit location field typed by the user, never inferred.
- Residual cost:
  - One migration (instant columns to `timestamptz`, plus `users.time_zone`).
  - `LocalDateTime` to `Instant` in those fields; the three `now()` calls fixed.
  - The `Time-Zone` header in the API client, and the zone setting in the profile.
- User, 2026-10-21: adopted after discussion.

### S12 — Mechanical enforcement (audit G1)

1. **ArchUnit**: one test class holding every structural rule decided here: the feature boundary (S1, S2), entities with no outward dependencies and no setters on guarded ones (S3), no `IllegalArgumentException` as a user error (S5), DTO naming (S10), clock and zone (S11), plus the current `CLAUDE.md` rules (no controller-to-repository access, no field injection).
2. **Spotless with palantir-java-format** in CI and the pre-commit hook. It keeps the current 4-space indentation and has no configuration to maintain. One formatting commit, listed in `.git-blame-ignore-revs`.
3. **maven-enforcer**: bans Lombok and MapStruct, pins the Java version.
4. **Compiler warnings fail the build** (`-Xlint:all` + `failOnWarning`), the backend twin of a green lint.
5. **Error Prone**: compile-time bug checks (non-exhaustive `switch`, `equals` across incompatible types, ignored return values). Same no-bypass policy as the frontend: no `@SuppressWarnings` to silence a check; a wrong check is disabled for the whole project in one place.
- Why: S1 to S11 lean on the build to hold them; the code is about to be restructured, which is when this class of bug enters.
- Residual cost: Error Prone needs JVM flags in `.mvn/jvm.config` and can delay a JDK upgrade until a compatible release; occasional false positives.
- User, 2026-10-21: adopted.

### S13 — The server says what the caller may do (audit: frontend mirror of `PlanAuthorization`)

- `PlanAuthorization` is the single source. Each rule is a query `canX(...)` that returns a boolean; each guard `requireX(...)` is `if (!canX(...)) throw ...`, so the guard and the flag cannot disagree.
- Responses carry a typed permissions object, computed by those queries for the caller:
  - `PlanResponse.permissions` (`PlanPermissionsResponse`): the plan-wide capabilities (`createTransactions`, `attributeToOthers`, `manageCategories`, `managePlan`).
  - A resource whose rule depends on the row itself gets its own object, e.g. `TransactionResponse.permissions` (`TransactionPermissionsResponse`: `edit`, `delete`; a contributor may change only their own rows). The same applies to any future row-dependent rule.
  - Booleans in an object, not an `allowedActions` string list, so the generated frontend types carry the exact keys.
- The frontend reads these flags and computes nothing: `usePlanPermissions` reads `activePlan.permissions`, row actions read `transaction.permissions`. Everything is still false until the data loads.
- The flags only drive the UI. The backend still checks every action, so a wrong flag never opens a hole.
- Tests (S8):
  - `PlanAuthorization` gets unit tests per rule, since it is pure logic.
  - The role matrix IT asserts, for each role and action, that the flag and the endpoint agree: flag false if and only if the call is refused.
- Why: the frontend copy is already incomplete. It has no contributor-own-row rule, so it shows edit and delete on other members' transactions, which end in 403. Same principle as S3: a rule lives in one place and others ask it. Per-row flags are cheap (role plus row owner, already in memory).
- Rejected: (b) keep the mirror plus a test comparing both; (c) leave it.
- Residual cost: new response fields; `usePlanPermissions` and the row actions read them; the frontend permission tests become data reads.
- The user wants to see this pattern working cleanly; it may be reused in another system.
- User, 2026-10-21: adopted.

### S14 — Request tracing and logging (audit S3, S7)

1. **Request id.** Every request gets one: the incoming `X-Request-Id` or a generated one. It is put in the MDC (so every log line of the request carries it), returned in the response header and included in every ProblemDetail, so an error toast can show it and the case can be found in the log.
2. **One log line per request**: method, route template, status, duration, user id, plan id. Never a body, token or e-mail.
3. **Never logged**: passwords, tokens, reset links, e-mail addresses, request bodies, financial amounts. A test checks the reset and login flows.
4. **Levels**: `ERROR` only for what needs action (5xx); `WARN` for suspicious refusals (e.g. repeated invalid tokens); `INFO` for the request line; expected 4xx errors log no stack trace.
5. `show-sql` is off outside the local profile.
- Deferred until needed: metrics, distributed tracing, structured JSON logs (one instance today).
- Why: nothing ties a user's report to a request today; `show-sql=true` in production, the JWT filter logs e-mails with stack traces, and live reset links reach the log.
- Residual cost: one filter, logging config, and removing the leaking log calls.
- User, 2026-10-21: adopted.

### S15 — Error contract: one ProblemDetail, stable type, text owned by the client (audit X1, X2, A4)

1. **One format, every producer**: the advice, the authentication entry point (401), the access-denied handler (403) and filters all answer `application/problem+json` through one helper `problem(status, slug, ex)`. A test walks the producers and checks the media type. `ErrorResponseDto` is deleted.
2. **`type` is a stable identifier, not a link**: `urn:findraco:problem:<slug>` (e.g. `urn:findraco:problem:category-has-subcategories`). RFC 9457 allows a non-resolvable URI; no problem pages will be published.
3. **User-facing text belongs to the client.** The frontend maps `type` to copy in the viewer's language; an unknown `type` falls back to a generic sentence per status. `detail` is English, for developers and logs, and never reaches a toast. The body also carries `requestId` (S14) and, when one applies, `field` (S5).
4. **Field errors**: `errors: [{ field, code, message }]`; `code` is the constraint (`NotBlank`, `Size`), which the frontend translates; `message` is a fallback only.
5. The old quick spec (`.specs/quick/error-contract-problemdetail-migration.md`: `finsight.app` URIs, stale paths, entry point missing) is absorbed here and deleted.
- Why: one rule in one place; X2 disappears (category delete branches on `type`, not message text); i18n (M5-10) needs no backend change; a new client (mobile, WhatsApp, MCP) handles errors the same way as the web.
- Rejected: (a) `https://findraco.lcsmrt.com/problems/...` as `type`: the host is a personal domain and may change, and `type` is contract, so a change breaks every client; (b) the backend returns final, translated text (`Accept-Language` + `MessageSource`): UI copy spread into the backend, duplicating the frontend i18n, and channels with their own tone (WhatsApp) still need their own copy.
- Residual cost: a frontend `type → copy` map (~15–20 slugs), ~8 MSW mocks; changing the `type` format later is breaking, so it is fixed now while the web is the only client. "Text belongs to the client" can be revisited without breaking, since `detail` stays.
- User, 2026-10-28: adopted.

### S16 — OpenAPI is the contract, true by convention, guarded by a committed snapshot (audit X6; frontend STD-13 prerequisite)

1. **True by convention, not by annotation.** springdoc customizers in `shared/`: response fields required unless `@Nullable` (with a test); `PlanContext` hidden; `planId` declared as a path parameter; enums as named `$ref`s (`sortBy` becomes an enum); the real success status (201, 200, 204). Manual annotations only where the convention cannot reach; `@Operation(description)` only when behaviour is not obvious from the name.
2. **Errors generic, catalogue typed.** A customizer adds the common responses (400, 401, 404, 422, 500; 403 on plan routes) to every operation, pointing at a shared `ProblemDetail` schema. The S15 slugs live in one Java enum (`ProblemType`), exposed in the schema, so the frontend map is `Record<ProblemType, string>` and a new backend error breaks the frontend build until its copy exists. No per-endpoint list of possible `type`s.
3. **Committed snapshot.** An IT (Testcontainers, S7) generates `/v3/api-docs` and compares it with the committed `backend/openapi.json`, failing with the diff. The frontend generates its types from that file, so frontend CI never boots the backend, and every contract change shows as a diff in review.
- Why: the frontend types are generated from this schema (frontend-standards decision 10); today every field is optional and never nullable, `PlanContext` leaks as query params and errors are undocumented, so the generated types would be wrong everywhere.
- Rejected: (a) annotate everything by hand (`@ApiResponse`, `@Schema` per field): noise that drifts silently; (b) frontend CI boots the backend to fetch the schema: slow, needs a database, couples the pipelines; (c) per-endpoint error lists: precise but expensive to keep true; the global catalogue gives the safety that matters.
- Residual cost: about 4 customizers and the snapshot IT; every DTO change regenerates `openapi.json` in the same commit (intended). Highly reversible: infrastructure only, the contract itself does not change.
- User, 2026-10-28: adopted.

### S17 — Contract shape rules (audit X7, C14)

1. **No field without a consumer.** The dashboard's `categoryBreakdown` and `monthlyTrend` are removed; a field comes back when a client needs it (perhaps the MCP connector).
2. **JSON name = Java field name**, never renamed in a mapper (`isDefault` stays `isDefault`). Records (S10) give this by default; the S16 snapshot shows any drift.
3. **Composition over copy.** The series edit request becomes `{ scope, pivotOccurrenceId, series: CreateSeriesRequest }` instead of repeating its 12 fields (records cannot extend).
4. **Every input is bounded.** Strings and lists carry `@Size` (strings aligned with the column), numbers a range. An enum that accepts only part of its values becomes its own narrower enum (`TransferredOwnerRole` without `OWNER`), so the invalid value cannot be represented. ArchUnit checks that every request `String` and `List` has `@Size`.
5. **`detail` never carries tokens, e-mails or personal data** (it reaches the log, S14). Machine data a client needs goes in an extension (`field`, `conflictingId`).
- Why: each X7 symptom is a missing rule; copied fields drift (a new validation lands on one side only); unbounded input reaches the database or a loop.
- Rejected: (a) keep the dashboard fields in case someone uses them: cost today, no value; (b) keep the copied series fields plus a test comparing both validations: a patch for a problem composition removes.
- Residual cost: one small slice (2 fields removed, 1 DTO restructured, `@Size` across ~40 requests, 1 enum). The series edit nesting changes that endpoint's JSON (breaking; the web is the only client and the generated types guide the change); the rest is reversible.
- User, 2026-10-28: adopted.

### S18 — Identity and plan inside a request: values, not entities (audit L4, A11)

1. **`PlanContext` carries values**: `PlanContext(planId, userId, role)`; `@CurrentUser` becomes `AuthenticatedUser(id)`. The resolver still checks membership (one gate, fails early with 404, no endpoint can forget it); the service reloads what it needs inside its own transaction.
2. **The role checked by the resolver holds for the request.** A role lost in the milliseconds between check and service ends with the current request; the next one is refused. Concurrent writes are covered by S6.
3. **Written down as they exist, nothing renamed**: parameter order (target ids, then the request, identity last); routes singular kebab-case, actions as `POST /{id}/<verb>`; `PlanContext` as the sanctioned exception to "pass ids"; one `toPageable` with a sort map replaces the duplicated whitelist.
- Why: with OSIV off (S4) the entities the resolver loads arrive detached in the service; the first lazy access throws `LazyInitializationException`, and saving them can silently overwrite data.
- Rejected: (b) every service checks membership in its own transaction: about 30 places to forget, and forgetting is a security hole; (c) keep the entities and `merge` in the service: brings back the silent overwrite.
- Residual cost: service signatures change from `User` to ids (mechanical, inside the S1 slice); one extra primary-key load in some endpoints. ArchUnit checks that no controller or service takes an entity as a resolver-supplied parameter. Internal only, reversible without touching the contract.
- User, 2026-10-28: adopted.

### S19 — CSV import: a pure parser per format, all or nothing (audit L3, T4; Queue item "CSV import parsing tests")

1. **Parsers behind one interface.** `StatementParser` (`supports(header)`, `parse(stream)`), chosen by a registry from the header. Each bank or format (account statement, card bill, OFX later) is a new parser; the service does not change. Parsers use Apache Commons CSV (quotes, commas, BOM), touch no database and return valid rows plus errors `[{line, field, code}]`. Every parser emits the same neutral row: `ImportedRow(date, amount, sourceText, sourceRef?, format)`.
2. **The format is recognised by its header.** An unknown header answers 422 `csv-unknown-format`; a known but unsupported one (card bill today) answers its own `type` (`csv-format-not-supported`), never "0 imported".
3. **Bounds** (S17): maximum file size and row count; strict UTF-8 (an invalid byte answers 422 with the line).
4. **All or nothing.** Any bad row rejects the whole file, listing every bad line (capped, e.g. 50) in the ProblemDetail `errors`.
5. **Each row becomes a transaction through the aggregate's own constructor** (S3), the same path as HTTP.
6. **Deduplication is per format.** Nubank's id is the `sourceRef`; a format without one (card bill) defines its own key when it lands (e.g. date + amount + text + order).
7. **The bank's original text is kept**: `sourceText`, immutable, separate from the user-editable `description` (nullable column, one migration).
8. **The response explains the outcome**: `{ imported, skippedDuplicates }` instead of a bare `int`.
9. **Tests** (S8): about 12 unit tests on the parser (bad date, bad amount, missing column, empty file, comma in description, quotes, BOM, wrong header, ...); the IT covers only deduplication, persistence and permission. Afterwards, check which frontend tests the backend makes redundant.
- Why: today an unrecognised file reports "0 imported" silently, a hand-rolled `split` breaks on quoted commas, the first bad line aborts with an `IllegalArgumentException` (S5) and rows bypass the aggregate rules. In a finance app, an import missing rows unnoticed is the worst outcome: the balance is silently wrong, and a bad row in a bank export usually means the whole file is suspect (format, locale). `sourceText` is the one thing that cannot be recovered later: future learning rules (IDEAS §2, §6) match on the bank's text, not on the name the user edited; rows imported before the column exists would lose it on the first edit.
- Rejected: (b) import the good rows and report the bad ones (dedup makes re-import safe, but an unread report leaves data incomplete); (c) keep the hand-rolled parser and patch the holes (reinventing a CSV parser).
- Future (own feature, not here): multiple banks and card bills, statement vs. bill reconciliation, classification memory ("classified once, classified next time"), merchant normalisation as a derived optional field computed from `sourceText`.
- Residual cost: one dependency (Commons CSV), the parser interface and a first parser, one column, a small breaking change in the endpoint response (web only). Switching (a) ↔ (b) later touches only the service's handling of the error list.
- User, 2026-10-28: adopted (a), with the extension points and `sourceText` now.

### S20 — Rate limiting in the app; the API is reachable only through the proxy (audit S1, S2)

1. **The API listens on localhost only** (`server.address=127.0.0.1`) and trusts `X-Forwarded-For` only from the reverse proxy (`forward-headers-strategy`). Prerequisite for the rest: a client reaching port 3000 directly bypasses any proxy limit and can forge its IP. How the proxy reaches the API is confirmed during execution.
2. **Rate limits live in the app (Bucket4j, in memory; one instance):** login keyed by IP and e-mail; forgot-password by e-mail and IP; register by IP; CSV import by user. Over the limit: 429 with `Retry-After`, ProblemDetail `rate-limited` (S15), a `WARN` log line (S14).
3. **Limits are configuration**, in one place; an IT checks each route.
- Proxy-agnostic on purpose: the user plans to leave nginx (2026-10-28). Nothing here depends on the proxy beyond "it sets `X-Forwarded-For`", so the replacement needs no change in the app.
- Why: no limit exists today (login brute force, reset e-mail bombing against the SMTP quota, mass sign-up, CSV upload), and port 3000 (API and Swagger) answers on the public IP. A per-e-mail key needs the request body, which only the app sees; in the app the limits are tested in CI and behave the same locally.
- Rejected: (b) nginx `limit_req` only (IP-only, untested, and nginx is on its way out); (c) both layers (a proxy flood limit can be added later if volume ever calls for it).
- Residual cost: one dependency, one filter, one config block; 429 is new contract (frontend copy). Closing port 3000 takes Swagger off the public IP (SSH tunnel or local only). Reversible.
- User, 2026-10-28: adopted.

### S21 — Authentication hardening (audit S4, S5, S6, S8)

1. **Password policy: length in characters, Argon2id.** Revised 2026-10-28 (user asked why 72 bytes and whether to block spaces and emoji): BCrypt reads only 72 bytes, which would force a byte limit no user understands. So:
   - Hash with **Argon2id** (`Argon2PasswordEncoder`, OWASP's current choice; no length ceiling). `DelegatingPasswordEncoder` keeps verifying the existing BCrypt hashes and rehashes to Argon2id on each user's next login; nobody resets.
   - **8 to 128 characters**, counted as code points on both sides (`[...s].length`, `codePointCount`); 128 is an anti-abuse bound, not a target. Message: "8 to 128 characters".
   - **Accepted**: letters in any language (accents), digits, punctuation, spaces (passphrases), emoji. **Rejected**: control and invisible characters (zero-width, line break, tab): never typed on purpose, they arrive by paste and make a password that looks right and never matches. The frontend warns about leading or trailing spaces without blocking them.
   - **Unicode NFKC** before hashing, on create and verify, so "ç" typed on different devices matches.
   - No composition rules (upper case, symbol): NIST advises against them. Violations answer 422 (S15); mirrored in the frontend schema.
2. **No timing tells.** One `PasswordEncoder` bean (cost 12) for real and dummy hashes; forgot-password queues the e-mail asynchronously and answers at once, with the same timing whether or not the account exists (closes what S5 promises).
3. **JWT key and subject.** The secret is Base64-*decoded*; the app refuses to start below 32 bytes. `sub` is the user id, not the mutable e-mail (matches S18's `AuthenticatedUser(id)`). At the switch, 15-minute access tokens become invalid once and refresh silently.
4. **dotenv.** `spring.dotenv.filename` (does nothing) is removed; documented: local = `backend/.env`, production = Portainer env. The unused local `backend/.env.production` is checked and deleted by the user.
- Unchanged: sign-up keeps answering 409 for a taken e-mail (S5); closing it needs e-mail confirmation, later.
- Why: a 1-character password is accepted and a >72-byte one surfaces as a raw 400; login and reset timing reveal whether an account exists; the key derivation is misleading with no weak-key guard.
- Rejected: (a) a lower maximum (e.g. 32): rejects exactly the strongest passwords; (b) composition rules: predictable passwords, more friction; (c) BCrypt with a 72-byte limit (a unit users cannot see); (d) ASCII only (clean byte count, blocks accents, the real case for Portuguese passphrases); (e) SHA-256 pre-hash + BCrypt (home-made construction with known pitfalls); (f) block emoji (no security gain, one more rule to keep and explain; the user's call if wanted).
- Residual cost: one dependency (BouncyCastle, required by Argon2), ~50 ms CPU per login (as BCrypt 12), one constraint, one async mail call, a key-derivation change that ends current 15-minute sessions once. Existing accounts are unaffected (policy applies at sign-up and reset). Reversible.
- User, 2026-10-28: adopted; asked why 72 (BCrypt ceiling, explained).

### S22 — The server evaluates category usage for any period (audit T7)

- The category spending endpoint takes `start` and `end` and returns, per category and per member, `limit` (already scaled to the months the period touches), `spent`, `remaining`, `percentUsed` and `status` (`ok | warning | over`). The month-scaling rule and `WARNING_RATIO` move to the backend, with unit tests (S8). The frontend keeps presentation only (bar width, colour, copy); `scaleLimits.ts` and the evaluation in `spendingRows.ts` go.
- With it: the duplicated POST + toast + refresh assertion leaves one of the two frontend CSV tests. Backend parser tests make no frontend test redundant (the frontend never tested parsing).
- Why: the rule exists twice today. The backend computes and tests usage for one month only, and the frontend discards it and recomputes for any period with a threshold only it knows. Same principle as S3 and S13: one rule, one place. The MCP and WhatsApp channels will answer "how much is left for groceries this month?", and each would otherwise be another copy.
- Rejected: (b) drop the fields from the API and own the evaluation in the frontend (every new channel reimplements it); (c) keep both knowingly (two copies and their drift).
- Residual cost: the endpoint changes (small breaking change, web only); the logic and its tests move from frontend to backend. Moving back to (b) is simple.
- User, 2026-10-28: adopted (a).

### S23 — Platform: Spring Boot 4.1 and Java 25 first; Dependabot; layered image (audit G3)

1. **Spring Boot 4.1 + Java 25 (current LTS) as the first slice of this feature, before S1.** Spring Boot 3.5 lost free support on 2026-06-30 (3.5.16 was its last OSS release); 4.0's ends 2026-12-31, 4.1's around 2027-07. Upgrading on today's code and tests means a failure is the upgrade's; after the S1 restructure every failure is ambiguous. Watch points: Jackson 3 (`com.fasterxml` → `tools.jackson` imports and config), Spring Security 7, Hibernate 7, Testcontainers 2; check Error Prone (S12) supports JDK 25 in the version adopted. Records (S10) and ProblemDetail (S15) are native to this stack.
2. **Dependabot** for maven, npm and GitHub Actions, grouped weekly.
3. **Layered Dockerfile**: `COPY pom.xml` → `dependency:go-offline` → `COPY src`; a deploy with unchanged dependencies reuses the layer.
- Why: Boot 3.5.3 and Java 17 get no security patches; nothing announces fixes; every redeploy downloads all dependencies.
- Rejected: (b) 3.5.16 only (last free release, gets nothing further); (c) Boot 4 after 1.0, as the audit proposed on 2026-10-20 (months unpatched, and dearer after S1 puts more code in the new shape).
- Residual cost: the least predictable slice of the feature (Jackson 3 alone touches many imports); on the VPS Java 25 is a base-image change. Reversible while it is an isolated commit; costly once S1 sits on top.
- Sources: spring.io "Spring Boot 3.5.16 available now" (2026-06-25); secondary EOL trackers (HeroDevs, isitpatched). Confirm dates on spring.io/projects/spring-boot#support during Design.
- User, 2026-10-29: adopted.

### S24 — Skills, docs, dead code, and one name per domain (audit G4, G5, G6)

1. **Skills (G4).** `backend-endpoint` and `backend-exceptions` are rewritten with the real names (`PlanContext`, `PlanAuthorization`, `ApiRoutes`), describing only what exists, each rule tagged with what checks it (ArchUnit, test, review). New: `backend-testing` (S8) and one skill for structure, persistence and migrations; short Security and Logging sections. Same shape as the five frontend skills.
2. **Docs (G5).** One pass over the six stale docs (~30 old identifiers; CONCERNS' "no migration tool", TESTING's tunnel). Docs point to folders instead of listing files.
3. **Dead code (G6).** `backend/bin/` (17 tracked `.class` files of `expensesmanager`), unused finders and the duplicated `findAllByPlan` go; one jjwt version property; `pom.xml` comments in English.
4. **One name per domain, code and database.** The package name is the domain name: `Category*` and `Transaction*` replace `FinancialTransactionCategory*` and `FinancialTransaction*`. Tables `financial_transactions` → `transactions`, `financial_transaction_categories` → `categories`; their sequences, primary keys, checks, foreign keys and indexes renamed to the S9 convention (`pk_transactions`, `ck_transactions_type`, `fk_transactions_categories`, `idx_...`). Routes unchanged; JSON unchanged.
   - One rename migration, in the same slice as S1 and S10 (they already touch every one of these files). `ALTER ... RENAME` is metadata only, instant and transactional; references are by internal id, so nothing breaks inside the database. Single instance and Flyway before start: no window with old code on new names. The migration checks the old names exist and aborts otherwise (S9); `pg_dump` before the deploy.
   - Java side: `@Table` on two entities and the two constraint/index names the code quotes; no native queries.
   - Frontend: generated type names change (`FinancialTransactionResponse` → `TransactionResponse`), guided by the compiler.
- Why: two naming patterns side by side (`FinancialTransactionCategory*` next to `CategorySpendingService`), a class name repeating its package, and database errors that would keep quoting old names. The user prefers consistency end to end.
- Rejected: (b) rename `Category*` only (leaves `FinancialTransaction` as the exception); (c) accept the mix; (d) code only, tables untouched (user, 2026-10-29: "consistency" includes the database).
- Residual cost: near zero inside the S1/S10 slice; one migration. Nothing outside the app references these names (user confirmed). Reversible by a forward migration.
- User, 2026-10-29: adopted, tables included.

### S25 — A series remembers its skipped dates (audit H8)

- Deleting one occurrence ("this one") records its date in the series' exceptions (`recurrence_exceptions(definition_id, date)`, the iCalendar `EXDATE` model used by Google Calendar and Outlook). The generator never produces an excepted date. The series aggregate owns its exceptions (S3).
- The reconcile matches existing rows **by date**, never by sorted position.
- A pattern change (day 5 → day 10) leaves old exceptions unmatched, as expected. "Restore occurrence" later is deleting the exception.
- Why: today a deleted occurrence comes back on the next series edit (the reconcile matches by position and refills the gap): data the user deleted on purpose returns and the balance is wrong.
- Rejected: (b) match by date and never recreate a date that once existed: needs the same memory as a soft-deleted tombstone inside the transactions table, mixing "deleted transaction" with "skipped date" and making every query filter tombstones.
- Residual cost: one small table, one aggregate rule, about 3 generator unit tests (S8). Reversible, but recorded exceptions are user intent; dropping the table later would lose it.
- User, 2026-10-29: adopted (a).

### Audit H bugs without their own decision

- H5, H6, H7, H9, H11 are fixed by S3, S5 and S17 in the compliance slices; H12 by S9 constraints (partial unique index on `(plan_id, source_ref)`, in-file dedup, the definition locked in edit/delete).
- **H10 rule**: a destructive endpoint never defaults to its widest scope; `scope` is required on series delete.
- **H13 sequencing**: the session ITs run green on a disposable database (S7) before any other slice; if they fail, they are fixed first (revocation is a security promise).

### S26 — Reads never write: series top-up leaves the read path (audit H14)

1. **A daily job** (`@Scheduled`, also run at startup to cover downtime) tops up every open-ended series to the horizon (today + 12 months). Creating or editing a series still generates to the horizon at once.
2. **On-demand extension**: when a read asks for a period ending after a plan's generated watermark, the service first extends that plan's series to the period end in its own short transaction, then reads. The common case (period covered) is a cheap watermark comparison: no lock, no second connection.
3. The "due" query is fixed, and the watermark advances to the horizon even when nothing is generated.
- An IT checks that a period beyond the horizon extends the series and that a covered period writes nothing (fixed `Clock`, S8). Several instances would need a distributed lock (ShedLock); one instance today, noted only.
- Why: today every dashboard and category-spend GET opens a second connection (`REQUIRES_NEW`, pool of 5) and, through a bug in the due query, takes a `PESSIMISTIC_WRITE` lock that generates nothing; a read that writes is what S4 removes; every new channel (MCP, WhatsApp) would have to remember the top-up. Beyond 12 months, open-ended series disappear from view.
- Research (user asked, 2026-10-29): Google Calendar stores the rule and expands occurrences per viewed window; finance apps (Quicken, YNAB, Firefly III, Actual) keep a rule, make an occurrence real when it is due, and show the future as a forecast apart from what happened. Our model materialises 12 months ahead as real rows mixed with actuals; that is the root of the horizon.
- Deferred to its own feature (Queue: "Recurrence v3: actual vs forecast"): whether a future occurrence is an entry or a forecast, and what that means for lists, dashboard and budget. S26 keeps both paths open: the series already stores its rule and its exceptions (S25).
- Rejected: (b) keep the top-up on read but before the transaction (still a read that writes, every channel must call it); (c) virtual occurrences now (rewrites list, sums, paging and occurrence editing; a product decision first); a navigation cap (e.g. 10 years), dropped until the v3 feature decides the model.
- Residual cost: one job, a watermark check at the start of each read service, the due-query fix. Reversible: generation itself is unchanged, only when it runs.
- User, 2026-10-29: adopted.

### S27 — Every user keeps a plan; unsupported values are not representable (audit H15)

1. **"Every user has at least one plan"** is one rule, enforced where a membership is lost: when leaving, being removed or having a plan deleted would leave someone with none, a personal plan is provisioned for them (as at sign-up). `leavePlan` keeps refusing to leave the last plan on one's own (almost always a mistake). About 3 ITs (removal, plan deletion, leave).
2. **`PERCENT` leaves the API enum** until the feature exists (S17: an invalid value is not representable). The migration that drops it checks no stored row uses it and aborts otherwise (S9).
- Installment labels after a THIS_AND_FOLLOWING delete keep "(k/N)" with the original N: the history matches the card bill (a 10x purchase stopped at the 4th stays "(4/10)"). User, 2026-10-29; easy to change later.
- Small H15 items, no decision needed: every paged sort ends with `id` as a unique tiebreaker; LIKE wildcards in search are escaped.
- Why: `removeMember` and plan deletion can leave a user with zero plans while the app assumes an active plan; `PERCENT` is accepted by every DTO and rejected deep in `SplitResolver` with an `IllegalArgumentException`.
- Rejected: (b) block removing a member whose only plan it is (lets a member hold the plan hostage; does not cover plan deletion).
- User, 2026-10-29: adopted (a) and the `PERCENT` removal.
