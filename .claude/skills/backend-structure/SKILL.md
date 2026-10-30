---
name: backend-structure
description: Decide where backend code lives in the findraco Spring Boot API and how it persists - package by feature (`auth`, `user`, `plan`, `category`, `transaction`, `dashboard`, `shared`) with layer sub-packages, the cross-feature rules (writes through the owner's service, read-only aggregate repositories), guarded aggregates and where a business rule lives, JPA and persistence conventions (lazy associations, entity graphs, `@Version`, no schema annotations), Flyway migration rules and constraint names, `app.*` configuration properties, time and zones, plus short Security and Logging sections. Each rule says what checks it (ArchUnit rule, test, build tool, or review). Use when creating a class and choosing its package, adding a table or migration, adding configuration, touching security or logging, or judging an import between features. For endpoints use /backend-endpoint, for errors /backend-exceptions, for tests /backend-testing. Triggers on "package", "where does this go", "new feature", "migration", "Flyway", "entity", "aggregate", "repository", "cross-feature", "ArchUnit", "configuration properties", "@Value", "JWT", "rate limit", "logging", "time zone".
metadata:
  type: reference
---

# Backend Structure

The folder states a class's feature and its layer. Code is born in the feature that uses it and moves to
`shared` only when a second feature needs it. The boundary between features is an ArchUnit rule, not the
compiler: repositories and helpers are `public` because Java's package-private does not cross
sub-packages (S1).

Tags: **[ArchUnit: rule]**, **[test: Class]**, **[build]** (Spotless, `-Xlint:all,-serial` with
`failOnWarning`, Error Prone, maven-enforcer, Flyway, Hibernate `validate`), **[review]**. `S` and `AD`
numbers are decisions in `.specs/features/backend-standards/context.md` and `.specs/STATE.md`.

---

## 1. Packages (S1, AD-017)

```
backend/src/main/java/com/lcs/findraco/
  FindracoApplication.java
  auth/ user/ plan/ category/ transaction/ dashboard/    one package per feature
      controller/   XxxController, XxxRoutes, XxxWebConfig (resolvers, PublicEndpoints)
      service/      XxxService and the pure helpers a service uses
      repository/   XxxRepository, XxxSpecification
      model/        entities, enums, value types (aggregate rules live here)
      request/      CreateXxxRequest, UpdateXxxRequest, XxxFilter (records)
      response/     XxxResponse, XxxSummaryResponse (records)
      exception/    XxxExceptions (nested DomainException subclasses)
      config/       XxxProperties, feature beans
      importer/     (transaction only) the CSV parsers behind StatementParser
  shared/
      config/ error/ openapi/ security/ web/ ratelimit/  infrastructure no single feature owns
```

- A class sits in exactly one of those packages; a feature uses only the layer sub-packages it needs.
  [ArchUnit: packagesFollowTheFeatureLayout]
- Domain name = package name = route = table: `Transaction*`, `Category*`, `/transaction`, `/category`,
  tables `transactions`, `categories`. [review; test: RenamedRoutesIT, MigrationsIT]
- Born in the feature, lifted to `shared` on the second consumer. `shared` depends on no feature.
  [ArchUnit: sharedDependsOnNoFeature]
- Controllers, services and repositories are the layers of `backend-endpoint`; no business rule in a
  controller or a repository. [ArchUnit: controllersNeverAccessRepositories; review]

## 2. Between features (S2, AD-017)

- A feature reaches another through its `service` and `model` only. Another feature's `response` is
  reachable only from a response that embeds it; never its controllers, requests, exceptions or
  configuration. [ArchUnit: featuresMeetThroughTheirServicesAndModels]
- Writes to another feature's tables go through the owner's public service (category delete calls
  `TransactionCategoryService.reassignCategory`, in the transaction feature, because `TransactionService`
  already depends on `CategoryService`). [ArchUnit: repositoriesOverAnotherFeaturesEntityAreReadOnly]
- Aggregate reads (sums, counts, report rows) may use a repository of the reader's own over the other
  feature's entity, extending `Repository` with read methods only (`dashboard/repository/DashboardReportRepository`).
  [ArchUnit: repositoriesOverAnotherFeaturesEntityAreReadOnly]
- A read that needs a domain rule comes from the owner's service. Entities stay public and JPA
  associations cross features. [review]
- A constructor cycle between two services is solved by moving the shared operation to a service in one of
  the features, never by field injection. [ArchUnit: constructorInjectionOnly]

## 3. Aggregates: where a rule lives (S3)

- The test: to check the rule, is anything needed besides the object itself and the children that belong
  only to it? No: the rule lives in the entity. Yes (a repository, the current user, another independent
  entity, today's date, another feature): it lives in the service. [review]
- Guarded entities (`Transaction`, `RecurrenceDefinition`, `Category` and their children
  `TransactionParticipant`, `TransactionItem`, `RecurrenceDefinitionParticipant`, `CategoryMemberLimit`)
  have one creation method (`Transaction.create(TransactionDraft)`, `RecurrenceDefinition.create(SeriesDraft)`,
  `Category.create(...)`) that requires valid data, and intention-revealing methods (`edit`, `replaceSplit`,
  `changeLimits`, `moveUnder`, `except`, `shortenTo`) instead of setters. [ArchUnit:
  guardedEntitiesHaveNoPublicSetters]
- Their methods take domain values (`TransactionDetails`, `Share`, `SeriesDraft`), never a request or a
  response, so HTTP, CSV and any future entry path share the same rules. `model` packages depend on no
  service, repository, security or request package. [ArchUnit: modelsTakeDomainValuesOnly]
- Children change only through their root and have no write repository. [ArchUnit:
  aggregateChildrenHaveNoWriteRepository]
- A rule that is also a shape check lives in the entity and the request may repeat it. Each rule has a unit
  test on the entity. [test: TransactionTest, RecurrenceDefinitionTest, CategoryTest, SplitResolverTest]
- Other entities stay plain data. [review]

## 4. Persistence (S4, S6, S9, AD-016)

- `spring.jpa.open-in-view=false`; `ddl-auto=validate`; every `@ManyToOne` is `LAZY`. A forgotten
  association fails loudly. [build: Hibernate validate; test: the ITs]
- A finder that feeds a response declares `@EntityGraph`. [review; test: StatementCountIT]
- Guarded roots carry `@Version` (`Transaction`, `RecurrenceDefinition`, `Category`). [test:
  OptimisticLockingIT]
- Entities carry no `@Index`, `@UniqueConstraint`, `@Column(nullable = false)` or other schema annotation:
  migrations are the only source of the schema. [ArchUnit: entitiesCarryNoSchemaAnnotations]
- Table and column names come from `QuotedSnakeCaseNamingStrategy` (quoted snake case); no native query
  except where a feature needs it (the import's advisory lock). [review]
- Time: instants are `Instant` in UTC and `timestamptz`; a transaction's date is a `LocalDate` (no zone,
  never converted). The only clock is the injected `Clock` (`TimeConfig`, `Clock.systemUTC()`); `now()`
  without it, `ZoneId.systemDefault()`, `Clock.systemDefaultZone()` and `TimeZone.getDefault()` are
  forbidden. [ArchUnit: timeComesFromTheInjectedClockInUtc]
- Interactive features use the device zone; the `Time-Zone` header keeps the user's stored zone current
  (`TimeZoneInterceptor`), for server-initiated features. The server never derives "today" for a user
  from the machine. [test: TimeZoneIT]

## 5. Migrations (S9)

Files `backend/src/main/resources/db/migration/V<n>__<what>.sql`, plain SQL, run by Flyway before start.

1. The migrations are the only source of the schema. [ArchUnit: entitiesCarryNoSchemaAnnotations; build:
   Hibernate validate]
2. An applied migration is never edited; a fix is a new migration (Flyway community has no undo).
   [test: MigrationsIT `everyMigrationOnDiskIsAppliedAndSuccessful`; review]
3. A rule an entity guards and SQL can express is also a constraint (`NOT NULL`, `CHECK`, `UNIQUE`): the
   entity guards the code, the database guards whatever bypasses it. [test: MigrationsIT]
4. Explicit names: `pk_`, `uk_`, `fk_<table>_<column>`, `idx_`, `ck_<table>_<what>`. [test: MigrationsIT
   `everyConstraintCarriesAConventionalName`]
5. Every foreign key is indexed unless a composite index already starts with its column; a query on a table
   that grows without bound and filters by a selective column gets an index, normally one starting with
   `plan_id`. No index on low-cardinality columns or small tables. [test: MigrationsIT
   `everyForeignKeyIsIndexed`; review]
6. A data migration checks its preconditions and aborts loudly (`RAISE EXCEPTION 'V19 precondition failed:
   ...'`); a table migration that could hit production data ships a precheck script in `backend/scripts/`
   and `pg_dump` first. [test: MigrationsIT; review]
7. Instant columns are `timestamptz`. [test: MigrationsIT `instantColumnsAreTimestamptz`]

## 6. Configuration (S20, S23, AD-021)

- Operational configuration lives under `app.*` in `application.properties` and is bound by
  `@Validated @ConfigurationProperties` records (found by `@ConfigurationPropertiesScan`): `app.jwt`,
  `app.cors`, `app.session`, `app.rate-limit`, `app.mail`, `app.import`, `app.series`. A missing or
  out-of-range value fails startup. No `@Value`. [ArchUnit: constructorInjectionOnly forbids `@Value` on
  fields; test: ConfigurationPropertiesTest]
- Environment variable names stay stable (`JWT_SECRET_KEY`, `ALLOWED_ORIGINS`, `SMTP_*`, `SERVER_ADDRESS`).
  Local = `backend/.env`, production = the Portainer environment. [review]
- Operational values (rate limits, CSV bounds, series horizon and schedule, session lifetimes) are
  configurable; contract values the frontend mirrors (password length, field sizes, money scale, the usage
  warning ratio) stay in code. [review]
- The `test` profile overrides only what a test needs (`application-test.properties`). [review]

## 7. Security (S18, S20, S21)

- Stateless JWT in `Authorization`, plus an opaque session cookie for renewal (`SessionService`, hash only
  in the database, rotation with a reuse grace). Spring Security's chain is `auth.config.SecurityConfig`;
  CSRF is off because no cookie authenticates an API call. [test: SessionIT, AuthenticationIT]
- Passwords: `DelegatingPasswordEncoder` (Argon2id; BCrypt verifies old hashes and re-hashes at login), the
  `@ValidPassword` policy (8 to 128 code points, NFKC, no control characters). [test: PasswordPolicyTest,
  PasswordHashingIT]
- The JWT secret is Base64 and at least 32 bytes or the app does not start; `sub` is the user id. [test:
  ConfigurationPropertiesTest]
- Rate limits are Bucket4j buckets keyed by hashed IP, e-mail or user (`shared.ratelimit.RateLimiter`),
  consumed first in the service; over the limit answers 429 `rate-limited` with `Retry-After`. [test:
  RateLimitIT, RateLimiterTest]
- The API listens on `server.address` (localhost by default) and trusts `X-Forwarded-For` only from the
  configured proxies; the client address comes from `@ClientIp`. [test: ClientAddressIT]
- Unknown-account and wrong-password logins answer the same; mail is sent asynchronously so timing does not
  tell. [test: AuthenticationIT, ForgotPasswordAsyncIT]

## 8. Logging (S14)

- Every request gets an id (`X-Request-Id` or generated) in the MDC, the response header and every problem
  body (`RequestIdFilter`). [test: RequestIdFilterIT]
- One INFO line per request: method, route template, status, duration, user id, plan id (`RequestLogFilter`);
  a 5xx is ERROR; no stack trace for an expected 4xx. [test: RequestLogFilterIT]
- Never logged: passwords, tokens, reset links, e-mail addresses, request bodies, financial amounts.
  [test: LogHygieneIT; review]
- `spring.jpa.show-sql=false` outside the local profile. [build: `application.properties`]

## 9. Build tools (AD-016)

- Spotless with palantir-java-format (`./mvnw spotless:apply`), `-Xlint:all,-serial` with `failOnWarning`,
  Error Prone, and maven-enforcer (Java 25, no Lombok or MapStruct) run in `./mvnw verify`, CI and the
  pre-commit hook. [build]
- No `@SuppressWarnings`; a check that is wrong for the project is disabled once, in `pom.xml`, with a
  comment. [ArchUnit: noSourceSuppressesWarnings]
- Dependency versions are properties or managed by the Spring Boot parent; one property per library family
  (`jjwt`). [review]

## Before done

- [ ] The class is in a feature's layer package (or `shared` after a second consumer).
- [ ] Cross-feature calls go through `service`/`model`; writes through the owner.
- [ ] A rule the object alone decides lives in the entity, with a unit test.
- [ ] New table or column: a new migration with named constraints and indexed foreign keys.
- [ ] New configuration is an `app.*` properties record, validated, with a test.
- [ ] `./mvnw -B verify` green (`ArchitectureTest` is part of it).
