---
name: backend-exceptions
description: Add or change an error the findraco API answers - a `DomainException` subclass nested in the feature's `XxxExceptions`, its `ProblemType` slug, the semantic HTTP status (400 unreadable, 422 invalid, 409 conflicts with state, 404 outside scope, 403, 401, 500), field errors, the frontend `problems.ts` copy, and how the one RFC 9457 `application/problem+json` format is produced by the advice, the security handlers, filters and the error page. Each rule says what checks it (ArchUnit rule, test, or review). Use when adding a new error condition, changing a status, mapping a framework exception, or touching `shared.error`. For the endpoint itself use /backend-endpoint, for testing an error /backend-testing. Triggers on "exception", "error handling", "DomainException", "ProblemType", "ProblemDetail", "problem+json", "GlobalExceptionHandler", "status code", "422", "409", "validation error", "error response", "problems.ts".
metadata:
  type: reference
---

# Backend Exceptions

Every error is one format, `application/problem+json` (RFC 9457), with a stable `type`, produced in
`shared.error`. A feature throws a named exception where the rule lives; nothing maps HTTP in a
controller. The client owns the user-facing text: it maps `type` to copy, and `detail` is English for
developers. Layout of a slice is in `backend-endpoint`; tests in `backend-testing`.

Tags: **[ArchUnit: rule]** a rule of `ArchitectureTest`; **[test: Class]** a test that fails when the rule
breaks; **[build]** compiler or `tsc`; **[review]** no tool checks it. `S` numbers are decisions in
`.specs/features/backend-standards/context.md`.

---

## 1. The contract (S15)

- Body: `type` = `urn:findraco:problem:<slug>`, `title` = the status phrase, `status`, `detail`, plus
  `requestId` (the request id of the log line) and, when one applies, `field`. Field errors are
  `errors: [{ field, code, message }]`, where `code` is the constraint's simple name (`NotBlank`, `Size`)
  and `message` a fallback. [test: ProblemProducersIT]
- One builder, `shared.error.Problems`, serves the advice (`GlobalExceptionHandler`), the 401 entry point
  (`ProblemAuthenticationEntryPoint`), the 403 handler (`ProblemAccessDeniedHandler`), filters
  (`ProblemResponseWriter`) and the servlet error page (`ProblemErrorController`). A new producer uses it.
  [test: ProblemProducersIT checks the media type of each producer]
- The slug is contract: never renamed, and a new rule gets a new slug. The slug list is the
  `ProblemType` enum, exposed in the OpenAPI schema. [test: OpenApiConventionsIT
  `theProblemTypeCatalogueIsAnEnum`]
- `detail` never carries a token, an e-mail or personal data (it reaches the log, S14); machine data a
  client needs goes in an extension (`field`, `errors`). A 5xx always carries the fixed
  `Problems.INTERNAL_DETAIL`. [test: LogHygieneIT, ProblemProducersIT; review]

## 2. Define the exception (S5)

- One class per rule, nested in the feature's `<feature>.exception.XxxExceptions` (`PlanExceptions`,
  `CategoryExceptions`, `TransactionExceptions`, ...), extending `shared.error.DomainException`, named
  `<Subject><Condition>Exception`. The status is declared in the constructor, next to the rule. [review]
- Distinct meaning or status means a distinct class and slug. The same error with variable data is one class
  with the data in `detail`. Never reuse a class whose message is written for another context. [review]
- Pass the `field` when the error belongs to one request field (`super(type, status, "role", detail)`), so
  the frontend highlights it. A list of items (the import's bad lines) goes in `errors`. [test: the IT of
  the rule]
- Throw it where the rule lives: in the entity when the object alone decides (S3), in the service when it
  needs a repository, the user, the clock or another feature. [review]
- Our code never throws `IllegalArgumentException` as a user-facing error; an escaped one answers 500 with
  the fixed detail. [ArchUnit: noIllegalArgumentAsUserError; test: ProblemProducersIT
  `anEscapedIllegalArgumentExceptionIsHandledAsUnexpected`]
- Bean Validation (`@Valid`) stays for the shape of single request fields; an invariant also lives in the
  entity, because CSV and future entry paths bypass the request. [review]

```java
public static class LastOwnerException extends DomainException {
    public LastOwnerException() {
        super(ProblemType.LAST_OWNER, HttpStatus.CONFLICT,
                "You cannot remove or demote the last owner of the plan. Transfer ownership first.");
    }
}
```

## 3. Choose the status (S5)

| Status | Meaning | Test |
| ------ | ------- | ---- |
| `400` | The request could not be read: malformed JSON, wrong type, unknown enum value, missing parameter (`MalformedRequestException`, slug `malformed-request`) | |
| `422` | It was read, but its content is invalid on its own: a field constraint (`validation-failed`), a rule such as `participants-required` or `exact-share-invalid` | Would it still be invalid against an empty database? Yes: 422 |
| `409` | It would be valid, but clashes with stored state: taken e-mail, subcategories, category in use, last plan or owner, used/revoked/expired invitation, `stale-version` | stored state must change first: 409 |
| `404` | The resource does not exist or is outside the caller's scope | never 403 for scope |
| `403` | The caller can see the resource but their role does not allow the action | `insufficient-role`, `not-transaction-creator` |
| `401` | No usable session; login answers a generic `invalid-credentials` | |
| `429` | `RateLimitedException`, with a `Retry-After` header | |
| `500` | Unexpected: a fixed detail, the cause logged at ERROR | |

- The table is applied by review; each status is asserted by the IT of the rule with
  `ProblemMatchers.problem(status, slug)`. [test: the feature ITs, e.g. PlanManagementIT]
- Where a semantic status would reveal data, security wins: out of scope is 404, login fails generically,
  forgot-password answers the same for any e-mail. Accepted exception: sign-up with a taken e-mail is 409
  `email-taken`. [test: AuthenticationIT `registeringATakenEmailAnswers409`, ForgotPasswordAsyncIT]
- A 4xx logs no stack trace; ERROR is for what needs action (5xx); suspicious refusals log WARN. [test:
  RequestLogFilterIT; review]

## 4. Mapping lives in one place

- `GlobalExceptionHandler` (`@RestControllerAdvice extends ResponseEntityExceptionHandler`) answers a
  `DomainException` with its own type and status, so a new rule needs **no new handler**. It also types
  Spring's request errors (400 unreadable, 422 failed constraint, 409 for a race caught at commit by the
  optimistic lock) and backstops everything else as 500. [test: ProblemProducersIT]
- Class-level (global) validation errors are mapped to a field-less entry of `errors`. [review]
- A value outside a `NarrowedEnum` (an enum that accepts only part of its values) is 422 on its field;
  any other unknown enum value stays 400. [test: BoundedInputsIT, ProblemProducersIT]
- `StaleVersionException.requireCurrent(stored, sent)` is the one stale check (409 `stale-version`, field
  `version`). [test: OptimisticLockingIT]

## 5. Add a new problem: the checklist

1. Add the constant to `ProblemType` (`MY_RULE("my-rule")`), grouped with its feature's slugs.
2. Add the exception to the feature's `XxxExceptions`, with the status from section 3.
3. Throw it in the entity or service.
4. Add the slug to the `ProblemType` union in `frontend/src/api/dtos/problem.ts` and its copy to
   `PROBLEM_COPY` in `frontend/src/api/utils/problems.ts`. The record is `Record<ProblemType, string>`, so a
   slug without copy fails `pnpm build`. The union is hand-written until the types are generated, so a slug
   missing from the union is caught by review. [build: tsc; review]
5. Regenerate the snapshot: `./mvnw verify -Dit.test=OpenApiSnapshotIT -Dopenapi.update=true`. [test:
   OpenApiSnapshotIT]
6. Write the IT that asserts `problem(status, slug)` (and `field` when it has one). [review]

The frontend reads errors only through `problems.ts` (`problemType`, `problemMessage`,
`problemFieldErrors`, `problemLineErrors`, `problemToast`): it branches on the slug, never on message
text, and an unknown slug falls back to a generic sentence per status.

## Before done

- [ ] Exception nested in `XxxExceptions`, extends `DomainException`, one per meaning.
- [ ] Status from the table (422 vs 409 by the empty-database test; 404 for scope).
- [ ] `field` set when it belongs to a request field; `detail` English, no personal data.
- [ ] New slug in `ProblemType`, the frontend union and `PROBLEM_COPY`; snapshot regenerated.
- [ ] An IT asserts status and slug with `ProblemMatchers.problem`.
