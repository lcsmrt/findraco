# findraco

Personal-finance app: Spring Boot API (`backend`) + React/TS SPA (`frontend`).

> Prescriptive write-time standards. Detailed procedures live in the skills under `.claude/skills/`
> (or `.agents/skills/` if you rename the folder); descriptive maps in `.specs/codebase/`.
> This file overrides inference — if a rule is missing, ask rather than infer.
> Lives at the monorepo root and governs both apps.

---

## General

- **English only** — code, UI, comments, specs. Never leak Portuguese into artifacts.
- Follow the written standard; if a rule is missing, **ask — don't infer**.
- Research how it's usually solved before reinventing; prefer established patterns.
- Consistency and clarity over cleverness. No premature abstraction, no junk.
- For anything larger than a quick fix, follow the **TLC Spec-Driven** workflow
  (`.claude/skills/tlc-spec-driven/SKILL.md`).

---

## Backend (`backend`)

Spring Boot 4 / Java 25. Essentials only: each skill holds the full rules, their reasons and what checks
each one (ArchUnit rule, test, build tool, or review). Read the matching skill before writing backend code.

- Package by feature: `com.lcs.findraco.<auth|user|plan|category|transaction|dashboard>.<layer>`, layers
  `controller`, `service`, `repository`, `model`, `request`, `response`, `exception`, `config` (plus
  `transaction.importer`); cross-cutting code in `shared.<config|error|openapi|security|web|ratelimit>`.
  Another feature is reached through its `service` or `model` only; writes to its tables go through its
  service; a read-only repository over its entity serves aggregate reads. → `/backend-structure`
- Layered: **controller → service → repository**. The controller resolves identity, delegates one call
  and returns the response; the service runs the rules in its transaction and returns the response
  record (`XxxResponse.from(entity)`); open-in-view is off. → `/backend-endpoint`
- Identity: values, never entities. `PlanContext(planId, userId, role)` for plan-scoped endpoints (its
  resolver checks membership, 404 otherwise), `@CurrentUser AuthenticatedUser` otherwise. Roles through
  `PlanAuthorization` (`canX` queries behind `requireX` guards; responses carry the flags). Outside the
  caller's scope is 404, never 403. → `/backend-endpoint`
- DTOs (**no Lombok, no MapStruct**) are records, one public type per file, nothing nested:
  `CreateXxxRequest` / `UpdateXxxRequest` / `XxxFilter`, `XxxResponse` / `XxxSummaryResponse`; every input
  bounded; edit requests carry the `version` of a guarded entity. → `/backend-endpoint`
- A rule the object alone decides lives in the entity (guarded aggregates: one creation method, no public
  setters); a rule that needs a repository, the user, the clock or another feature lives in the service.
  → `/backend-structure`
- Errors: one `application/problem+json` format, `type` = `urn:findraco:problem:<slug>` from `ProblemType`;
  a rule is a `DomainException` nested in the feature's `XxxExceptions`; statuses are semantic (400
  unreadable, 422 invalid, 409 clashes with state, 404 scope). A new slug needs its frontend copy in
  `problems.ts`. → `/backend-exceptions`
- Routes live in the feature's `controller/XxxRoutes` (`ApiRoutes` holds `BASE` and `PLAN`); a public route
  is a `PublicEndpoints` bean of its feature. The API contract is the committed `backend/openapi.json`:
  regenerate it in the same commit as any contract change
  (`./mvnw verify -Dit.test=OpenApiSnapshotIT -Dopenapi.update=true`). → `/backend-endpoint`
- Persistence: migrations in `db/migration` are the only source of the schema (named constraints, indexed
  foreign keys, an applied one is never edited); entities carry no schema annotations; configuration is
  `app.*` `@ConfigurationProperties` records, no `@Value`; time comes from the injected UTC `Clock`.
  → `/backend-structure`
- Tests: a closed table decides them (entity rules and pure logic → unit `*Test`; a rule or guard → `*IT`
  asserting status and problem `type`; every endpoint × role in the role matrix); ITs run on a Testcontainers
  Postgres; no Mockito, fakes at external boundaries. → `/backend-testing`
- Build: `./mvnw verify` runs Spotless (palantir-java-format; `./mvnw spotless:apply`), `-Xlint:all` with
  `failOnWarning`, Error Prone, maven-enforcer and `ArchitectureTest`. No `@SuppressWarnings`; a wrong check
  is changed once, in `pom.xml`. Needs JDK 25 (`JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8`) and Docker; setup in
  `.specs/codebase/TESTING.md`.
- Skills: `/backend-endpoint`, `/backend-exceptions`, `/backend-testing`, `/backend-structure`.

---

## Frontend (`frontend`)

React + TS, feature-oriented. Essentials only: each skill holds the full rules, their reasons and how
they are enforced. Read the matching skill before writing frontend code.

- Code style: `function` declarations for components, helpers and handlers; arrows only as inline
  callbacks. Named exports, never default, never `React.FC`. `type` everywhere, never `interface`; no
  `any`. Props `XxxProps`; files `PascalCase.tsx`, `useXxx.ts`, `camelCase.ts`. `cn()` for classes,
  `cva` for variants. → `/component-creation`
- Component files export only components. Logic that hits an extraction trigger moves to a sibling
  `.ts` with a test; at most 60 code lines before a component's main `return` (extract a hook); no IIFE
  in JSX. → `/component-creation`
- Every component with its own visual has a story; a container fetches and passes down, with no visual
  of its own. → `/component-creation`, `/frontend-testing`
- Primitives live in `src/components/<family>/base/` and are ours: edit them for app-wide changes only
  (tokens, variants, loading state, a11y); domain behaviour goes in a composition. Check shadcn and Base
  UI before writing a component by hand. → `/component-creation`
- Design system only: text through `Heading`/`Text` (no raw `<p>`/`<hN>`, no size or weight classes);
  meaningful colour from theme tokens, never the raw palette; money through `Amount`, `formatMoney` and
  `CurrencyInput`. → `/component-creation`
- Where code lives: born where it is used, lifted one rung when a second consumer appears; features
  never import each other; only `app/` imports features; providers are `XxxProvider.tsx` + `useXxx.ts`.
  `@/` cross-folder, relative within a feature. → `/feature-structure`
- Data: service hooks in `src/api/services/` (raw function + `useXxx` hook), plan-scoped query keys,
  mutations via `buildMutationOptions`; components never call `findracoApi`. Each service ships typed
  MSW handler factories. Request types `CreateXxxRequest`/`UpdateXxxRequest`; `XxxResponse` = API wire
  shape. → `/api-integration`
- Forms: react-hook-form + zod; every field through `Controller` via `FormField`; domain-typed values
  (`XxxFormValues`); `useWatch` locally, never root `watch()` + `setValue()`; `useFieldArray` for every
  dynamic list. → `/form-creation`
- Tests: logic → sibling unit test (90% branch coverage); visual → story (a11y violations fail); flow →
  integration test with MSW, never `vi.mock` of our own modules. → `/frontend-testing`
- Comments explain why, never what; no spec IDs in code (traceability lives in test names).
  → `/component-creation`
- No bypass: `eslint-disable` comments are ignored and `@ts-ignore`/`@ts-expect-error`/`@ts-nocheck` are
  lint errors. A wrong rule changes for the whole codebase. Lint is green on every `main` commit.
- CI gates deploy: a push that changes an app runs its lint, build and tests (docs-only pushes run
  nothing); nothing reaches production without passing them. → `/frontend-testing`
- Skills: `/component-creation`, `/feature-structure`, `/form-creation`, `/api-integration`,
  `/frontend-testing`.

---

## Skills

Before working on a specific layer, read the matching skill first:

| Task | Skill |
| ---- | ----- |
| Backend endpoint/service/repository/DTO | `.claude/skills/backend-endpoint/SKILL.md` |
| Backend exception / error handling | `.claude/skills/backend-exceptions/SKILL.md` |
| Frontend feature structure | `.claude/skills/feature-structure/SKILL.md` |
| Frontend component | `.claude/skills/component-creation/SKILL.md` |
| Frontend form | `.claude/skills/form-creation/SKILL.md` |
| Frontend API integration | `.claude/skills/api-integration/SKILL.md` |
| Frontend tests and stories | `.claude/skills/frontend-testing/SKILL.md` |
| Spec-driven planning/execution | `.claude/skills/tlc-spec-driven/SKILL.md` |

---

## Project State

Project decisions and the latest pause handoff live in `.specs/STATE.md`; roadmap, backlog and open todos in
`.specs/project/ROADMAP.md`; environment gotchas in `.specs/codebase/CONCERNS.md`.
