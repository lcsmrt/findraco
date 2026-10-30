---
name: backend-endpoint
description: Create or modify a REST endpoint in the findraco Spring Boot API as a vertical slice inside its feature package - routes (`XxxRoutes`, `ApiRoutes`), controller, service, repository, `Create/UpdateXxxRequest`, `XxxFilter` and `XxxResponse` records. Covers identity (`PlanContext`, `@CurrentUser AuthenticatedUser`), roles (`PlanAuthorization`), transactions and what a service returns, entity graphs and paging (`PageRequests`, `PageResponse`, specifications), bounded and validated input, optimistic-lock versions, OpenAPI conventions and the committed snapshot. Each rule says what checks it (ArchUnit rule, test, build tool, or review). Use when adding or changing any endpoint or its service, repository or DTOs. For errors use /backend-exceptions, for tests /backend-testing, for where a class lives /backend-structure. Triggers on "backend endpoint", "new endpoint", "controller", "service method", "REST API", "add route", "repository query", "request record", "response record", "PlanContext", "PlanAuthorization", "pagination", "openapi".
metadata:
  type: reference
---

# Backend Endpoint

A backend change is a vertical slice inside one feature: `controller -> service -> repository`, with
`request` and `response` records. The controller is the endpoint and its contract only; the service runs
the business rules; the repository is data access with no rule. Package layout and cross-feature rules
are in `backend-structure`; errors in `backend-exceptions`; tests in `backend-testing`.

Tags: **[ArchUnit: rule]** is a method or field of `ArchitectureTest`; **[test: Class]** a test that
fails when the rule breaks; **[build]** Spotless, `-Xlint` + `failOnWarning`, Error Prone or enforcer;
**[review]** no tool checks it. The `S` numbers are the decisions in
`.specs/features/backend-standards/context.md`.

---

## 1. Route (S18)

- Each feature owns its routes in `<feature>.controller.XxxRoutes` (`TransactionRoutes.TRANSACTION`,
  `CategoryRoutes.CATEGORY`, `DashboardRoutes.DASHBOARD`, `PlanRoutes.PLAN_INVITATION`). `shared.web.ApiRoutes`
  holds only `BASE` and `PLAN`. Plan-scoped routes are `ApiRoutes.PLAN + "/{planId}/<feature>"`. [review]
- Singular kebab-case nouns (`/transaction`, `/category`); an action is `POST /{id}/<verb>`
  (`/leave`, `/transfer`). Never a route literal in a controller. [review]
- A route open without authentication is a `PublicEndpoints` bean declared by its own feature, next to its
  routes; the security chain permits every such bean. [test: AuthenticationIT and the other ITs call these routes without a token; review]
- Every plan-scoped route must have a row in the role matrix. [test: PlanAuthorizationMatrixIT
  `everyEndpointOfTheApplicationHasAMatrixRowOrIsListedAsNotRoleScoped`]

## 2. Controller (S1, S4, S18)

- Constructor injection only, `private final`, no Lombok. [ArchUnit: constructorInjectionOnly; build:
  enforcer bans Lombok and MapStruct]
- A controller never touches a repository or an `@Entity`: it receives ids and request records and returns
  the response the service built. [ArchUnit: controllersNeverAccessRepositories, controllersNeverMapEntities]
- No controller parameter is an entity. A resolver supplies values: `PlanContext(planId, userId, role)` for
  plan-scoped endpoints, `@CurrentUser AuthenticatedUser` otherwise. [ArchUnit: controllersReceiveNoEntities]
- `PlanContext` is resolved by `PlanContextArgumentResolver` from `{planId}`: it checks membership and a
  non-member gets 404 before the method runs, so no endpoint can forget the gate. A role lost between the
  check and the service holds for the current request only. [test: PlanAuthorizationMatrixIT]
- Parameter order: path variables, the request or filter, identity last (`PlanContext ctx`). [review]
- `@Valid` on every `@RequestBody` and `@ModelAttribute` filter. [review; test: BoundedInputsIT]
- Documentation: `@Tag` on the class, `@Operation(summary)` on each method; `@ApiResponse` only where the
  convention cannot reach (an endpoint answering 200 or 201). [review]
- Status: `201` create (`ResponseEntity.status(HttpStatus.CREATED)`, never a raw number), `204` delete and
  state-only actions, `200` read and update. The success status is declared in code and the snapshot reads
  it. [test: OpenApiSnapshotIT, OpenApiConventionsIT]
- No business logic: one call to a service, wrapped in a `ResponseEntity`. [review]

```java
@Operation(summary = "Creates a new transaction")
@ResponseStatus(HttpStatus.CREATED)
@PostMapping
public ResponseEntity<TransactionResponse> createTransaction(
        @RequestBody @Valid CreateTransactionRequest dto, PlanContext ctx) {
    return ResponseEntity.status(HttpStatus.CREATED).body(transactionService.create(dto, ctx));
}
```

## 3. Service (S3, S4, S13, S18, S26)

- `@Transactional` on writes, `@Transactional(readOnly = true)` on reads. With open-in-view off
  (`spring.jpa.open-in-view=false`) every database access happens in a service transaction. [test: the ITs
  fail with `LazyInitializationException`; review]
- A service method a controller calls returns the response record, built with `XxxResponse.from(entity)`
  before the transaction ends. A method another feature calls returns the entity or nothing. [review;
  ArchUnit: controllersNeverMapEntities keeps entities out of controllers]
- Services take ids and reload what they need inside their own transaction; the entities a resolver loads
  never travel. [ArchUnit: controllersReceiveNoEntities]
- Permissions go through `PlanAuthorization`: each rule is a query `canX(...)`, each guard `requireX(...)`
  throws exactly when the query is false, so the flags in responses and the guards cannot disagree. The
  guard runs before the target data is touched. [test: PlanAuthorizationTest, PlanAuthorizationMatrixIT]
- A response that depends on the caller carries a typed permissions record (`PlanPermissionsResponse`,
  `TransactionPermissionsResponse`), computed by the same queries; the frontend reads the flags and
  computes nothing. [test: PlanAuthorizationMatrixIT flag-agreement tests]
- A resource outside the caller's scope answers 404, never 403; 403 only when the caller can see the
  resource but not do the action. [test: PlanAuthorizationMatrixIT, PlanManagementIT]
- A rule that needs only the object itself lives in the entity (`backend-structure`); a rule that needs a
  repository, the current user, another feature or the clock lives in the service. [review]
- Cross-feature calls go through the owner's `service` and `model` only (`backend-structure`).
  [ArchUnit: featuresMeetThroughTheirServicesAndModels]
- Time comes from the injected `Clock` (UTC), never `now()` alone. [ArchUnit:
  timeComesFromTheInjectedClockInUtc]
- Reads never write: a read that needs generated data first extends it in its own short transaction
  (`SeriesHorizon.ensureCovered`, called by the dashboard and spending services, which read in a
  `TransactionTemplate`). [test: SeriesHorizonIT]
- A destructive endpoint never defaults to its widest scope: the series delete requires `scope`. [test:
  SeriesEditIT]

## 4. Repository (S2, S4)

- Extend `JpaRepository`; prefer derived queries and `@Query` only when a name cannot say it. No business
  rule. [review]
- Every user-data query is plan-scoped. [review; test: the ITs of each feature]
- A finder that feeds a response declares what it loads with `@EntityGraph`, so a list costs a fixed number
  of queries. [test: StatementCountIT; review]
- Dynamic filters are a `Specification` (`TransactionSpecification`). A paged sort goes through
  `PageRequests.of(page, size, sortBy, direction)` (it appends `id` as the unique tiebreaker; the two
  specification-owned orderings end in `id` too). Search terms go through `LikePatterns.contains` and
  `LikePatterns.ESCAPE`, so `%` and `_` match literally. [test: TransactionPagingIT, LikePatternsTest]
- A repository over another feature's entity extends `Repository` and declares no write; a child of an
  aggregate (participant, item, member limit) has no write repository. [ArchUnit:
  repositoriesOverAnotherFeaturesEntityAreReadOnly, aggregateChildrenHaveNoWriteRepository]
- A page is wrapped in `shared.web.PageResponse`. [review]

## 5. Requests and responses (S10, S17)

- Records, one public type per file, nothing nested; no `Dto` suffix. [ArchUnit: dtosAreRecords,
  dtosDeclareNoNestedTypes]
- Names: `CreateXxxRequest` / `UpdateXxxRequest` in `request/`, `XxxFilter` for query parameters,
  `XxxResponse` / `XxxSummaryResponse` (the slim form embedded in another response) in `response/`; simple
  names are unique across features. [ArchUnit: requestNamesMatchTheirPackage, responseNamesMatchTheirPackage,
  dtoNamesAreUnique]
- JSON name = record component name; no `@JsonProperty` in a DTO. [ArchUnit: dtosKeepTheirComponentNames]
- Every request `String`, collection and map is bounded with `@Size` (strings aligned with the column; a
  password uses `@ValidPassword`); numbers get a range. [ArchUnit: requestTextAndCollectionsAreBounded;
  test: BoundedInputsIT]
- Composition over copy: the series edit nests a `CreateSeriesRequest`. A narrowed enum
  (`InvitationRole`, `TransferredOwnerRole`) implements `shared.error.NarrowedEnum` so a value outside it is
  422 on its field. [test: BoundedInputsIT]
- No field without a consumer. [review]
- A response is built by `static from(entity)`; fields are required in the contract unless `@Nullable`.
  [test: OpenApiConventionsIT]
- Money is `BigDecimal` with `@Digits(integer = 13, fraction = 2)`; dates the user types are `LocalDate`,
  instants are `Instant` (UTC). [review; ArchUnit: timeComesFromTheInjectedClockInUtc]

## 6. Concurrency (S6, S25)

- `Transaction`, `Category` and `RecurrenceDefinition` carry `@Version`. Responses return `version`, edit
  requests require it as a `Long`, and the service compares with `StaleVersionException.requireCurrent`
  (409 `stale-version`); an edit takes `PESSIMISTIC_FORCE_INCREMENT` on the root so child-only changes bump
  it. Deletes take no version. [test: OptimisticLockingIT]

## 7. OpenAPI is the contract (S16)

- springdoc customizers in `shared.openapi` make the schema true by convention (required unless
  `@Nullable`, `planId` as a path parameter, enums as `$ref`, common problem responses). Do not annotate
  what a convention covers. [test: OpenApiConventionsIT]
- `backend/openapi.json` is committed. Any request, response or route change regenerates it in the same
  commit: `./mvnw verify -Dit.test=OpenApiSnapshotIT -Dopenapi.update=true`. [test: OpenApiSnapshotIT]
- The frontend types and MSW mocks of a contract change land in the same slice. [review]

## Before done

- [ ] Route in the feature's `XxxRoutes`; role-matrix row added; public routes via `PublicEndpoints`.
- [ ] Controller delegates one call and returns a `ResponseEntity` with the right status.
- [ ] Service: transaction type, guard before data, 404 for out of scope, response built inside.
- [ ] Repository: plan-scoped, entity graph for response finders, `PageRequests` for paged sorts.
- [ ] Requests bounded and validated; edit requests carry `version`.
- [ ] `openapi.json` regenerated; a test per rule and status (`backend-testing`).
- [ ] `./mvnw verify` green (ArchUnit and the build tools run in it).
