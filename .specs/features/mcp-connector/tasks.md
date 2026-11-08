# Claude MCP Connector Tasks

## Execution Protocol (MANDATORY -- do not skip)

Implement these tasks with the `tlc-spec-driven` skill: **activate it by name and follow its Execute flow and Critical Rules.** Do not search for skill files by filesystem path. The skill is the source of truth for the full flow (per-task cycle, sub-agent delegation, the walk, check_proofs, the Verifier and the screens sub-agent).

**If the skill cannot be activated, STOP and tell the user - do not proceed without it.**

---

**Design**: `.specs/features/mcp-connector/design.md`
**Status**: Approved
**Approved**: 2026-11-08 - user: "Manda bala pae"
**Build**: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -DskipITs -Dsurefire.skip=true; cd frontend && pnpm lint; cd frontend && pnpm build; cd frontend && node scripts/check-siblings.ts
**Run unit**: cd frontend && pnpm exec vitest run --project=unit --reporter=verbose src/features/oauth src/api/services
**Run stories**: cd frontend && pnpm exec vitest run --project=storybook --reporter=verbose src/features/oauth

---

## Test Coverage Matrix

> Generated from codebase, project guidelines, and spec. Guidelines found: `CLAUDE.md`, `.claude/skills/backend-testing`, `.claude/skills/frontend-testing`, `frontend/scripts/testTable.ts`. Lean per the user's rule: test what would really break, no repeats across layers.

| Code Layer | Required Test Type | Coverage Expectation | Location Pattern | Run Command |
| ---------- | ------------------ | -------------------- | ---------------- | ----------- |
| Pure logic (CIMD document validation, name matching, update copy) | unit (`*Test`) | 1:1 to the ACs it decides; fakes at the HTTP boundary (JDK `HttpServer`), no Mockito | `backend/src/test/java/com/lcs/findraco/**/*Test.java` | `./mvnw -B -q test -Dtest=<Class>` |
| Security chains, OAuth endpoints, MCP tools | integration (`*IT`) | One IT per rule asserting the status / OAuth error / tool `isError`; role matrix per write tool (owner, editor, viewer, non-member) | `backend/src/test/java/com/lcs/findraco/**/*IT.java` | `./mvnw -B verify -Dit.test=<Class>` |
| Migration | `MigrationsIT` | Tables and constraints exist | `backend/src/test/java/com/lcs/findraco/MigrationsIT.java` | `./mvnw -B verify -Dit.test=MigrationsIT` |
| Frontend service hook | unit | Raw function + hook | sibling `*.test.ts` | Run unit |
| Containers (OAuth login, consent) | flow (unit project, MSW) | The container's decisions only | sibling `*.test.tsx` | Run unit |
| Presentational views | story | One story per state handled | `*.stories.tsx` | Run stories |
| Config, nginx, service worker, docs, i18n files, prerelease bump | none | build gate only | - | Build |

## Gate Check Commands

| Gate Level | When to Use | Command |
| ---------- | ----------- | ------- |
| Quick | Tasks with unit tests, or ITs of the task only | `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q test -Dtest=<Class>` / `./mvnw -B verify -Dit.test=<Class> -Dsurefire.skip=true`; `cd frontend && pnpm exec vitest run --project=unit <files>` |
| Full | n/a: each task runs its own ITs | - |
| Build | Last task of each phase | Phases 1–2: `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B verify`; Phase 3: the `**Build**:` line + `cd frontend && pnpm exec vitest run --project=unit --project=tooling --project=storybook` |

---

## Execution Plan

### Phase 1: Authorization server

```
T1 → T2 → T3 → T4
```

### Phase 2: MCP server and tools

```
T5 → T6 → T7 → T8
```

### Phase 3: Screens and infrastructure

```
T9 → T10
```

---

## Task Breakdown

### T1: Dependencies, configuration and schema

**What**: Add `spring-boot-starter-oauth2-authorization-server`, `spring-boot-starter-oauth2-resource-server` and the Spring AI 2.0 BOM + `spring-ai-starter-mcp-server-webmvc`; `app.oauth` `@ConfigurationProperties` record (issuer, mcp-resource, signing-key path, `cimd.allowed-clients`, `cimd.cache-ttl`) and `app.rate-limit.mcp-user`; `JWKSource` from the PEM; `V25__add_oauth_authorization.sql` (design Data Models); `spring.ai.mcp.server.protocol=STREAMABLE`; dev/test PEM under `src/test/resources`; `ConfigurationPropertiesTest` and `MigrationsIT` cases.
**Where**: `backend/pom.xml`
**Depends on**: None
**Reuses**: `app.*` property pattern (AD-021), `RateLimitProperties`
**Requirement**: MCP-03

**Done when**:

- [x] C1, C2 pass
- [x] App starts in tests with the test PEM; fails to start without `app.oauth.signing-key`

**Tests**: integration
**Gate**: quick
**Commit**: `feat(backend): add oauth and mcp foundations`

---

### T2: CIMD client repository

**What**: `CimdRegisteredClientRepository` (exact allowlist, fetch with caps and no redirects, document validation, Caffeine cache, pinned-copy fallback in `resources/oauth/cimd/`), the two pinned documents, `CimdRegisteredClientRepositoryTest` against a JDK `HttpServer` fake.
**Where**: `backend/src/main/java/com/lcs/findraco/auth/service/CimdRegisteredClientRepository.java`
**Depends on**: T1
**Reuses**: Caffeine, `RestClient`
**Requirement**: MCP-10

**Done when**:

- [x] C3, C4, C5, C6, C7 pass

**Tests**: unit
**Gate**: quick
**Commit**: `feat(backend): resolve claude clients from their metadata documents`

---

### T3: Authorization server chain, sign-in and consent

**What**: `AuthorizationServerConfig` (chain `@Order(1)`, metadata with `client_id_metadata_document_supported` and only `none`, PKCE `S256` required, no registration endpoint, form login at `/oauth2/login` with the login rate limits, consent page `/oauth/consent`, CSRF cookie on `/oauth2`, token settings, `aud` customizer from `resource`), `OAuthClientInfoController`; `AuthorizationServerIT` driving the full code flow with MockMvc.
**Where**: `backend/src/main/java/com/lcs/findraco/auth/config/AuthorizationServerConfig.java`
**Depends on**: T2
**Reuses**: `AuthenticationProvider`, `RateLimiter`, `SecurityConfig` (gets an explicit `securityMatcher`)
**Requirement**: MCP-01, MCP-02, MCP-03, MCP-10

**Done when**:

- [x] C8–C17 pass

**Tests**: integration
**Gate**: quick
**Commit**: `feat(backend): issue tokens to claude through an authorization server`

---

### T4: Public-client refresh, reuse detection and revocation

**What**: `PublicClientRefreshTokenGenerator`, `PublicClientRefreshAuthenticationConverter` + `Provider`, the reuse-detecting `OAuth2AuthorizationService` decorator, `McpGrantService.revokeAll` called from `PasswordResetService`, purge of expired grants in the daily job; `OAuthRefreshIT`.
**Where**: `backend/src/main/java/com/lcs/findraco/auth/config/PublicClientRefresh.java`
**Depends on**: T3
**Reuses**: `PasswordResetService`, existing daily job
**Requirement**: MCP-03

**Done when**:

- [x] C18–C22 pass
- [x] Build gate green (end of Phase 1)

**Tests**: integration
**Gate**: build
**Commit**: `feat(backend): let claude renew its tokens and revoke them on password reset`

---

### T5: MCP chain, plan resolution and `list_plans`

**What**: `McpSecurityConfig` (chain `@Order(2)`, JWT validators for issuer/audience/scope, `401` with `WWW-Authenticate` resource metadata, protected-resource metadata endpoint, `MCP_USER` rate-limit filter), `McpPlanResolver` (+ `McpNames` normaliser and `McpNamesTest`), `McpToolException` → `isError` mapping, `McpCallLogger`, `McpPlanTools.list_plans`; `McpSecurityIT`, `McpPlanToolsIT`; `ArchitectureTest` rule placing `mcp` like a feature.
**Where**: `backend/src/main/java/com/lcs/findraco/mcp/`
**Depends on**: None
**Reuses**: `PlanService.listPlans`, `resolveContext`, `RateLimiter`
**Requirement**: MCP-01, MCP-03, MCP-04, MCP-09

**Done when**:

- [x] C23–C33 pass

**Tests**: integration
**Gate**: quick
**Commit**: `feat(backend): serve the mcp endpoint with plan resolution`

---

### T6: Read tools

**What**: `McpCategoryTools` (`list_categories`, `get_category_spending`), `McpTransactionTools.list_transactions`, `McpSummaryTools.get_month_summary`, with read-only hints; `McpReadToolsIT`.
**Where**: `backend/src/main/java/com/lcs/findraco/mcp/tool/`
**Depends on**: T5
**Reuses**: `CategoryService`, `CategorySpendingService`, `TransactionService.findAllByPlanPaged`, `DashboardService.getSummary`, `UserService.today`
**Requirement**: MCP-05

**Done when**:

- [x] C34–C40 pass

**Tests**: integration
**Gate**: quick
**Commit**: `feat(backend): answer plan questions through mcp`

---

### T7: `create_transaction` and `confirm_transaction`

**What**: The two write tools, `McpCategoryResolver`, hints; `McpCaptureToolsIT` with the role matrix (owner, editor, viewer, non-member).
**Where**: `backend/src/main/java/com/lcs/findraco/mcp/tool/McpTransactionTools.java`
**Depends on**: T6
**Reuses**: `TransactionService.create`, `confirm`, `getById`
**Requirement**: MCP-06, MCP-07

**Done when**:

- [x] C41–C52 pass

**Tests**: integration
**Gate**: quick
**Commit**: `feat(backend): capture and confirm transactions through mcp`

---

### T8: `update_transaction`

**What**: The edit tool: copy every stored field, override amount/date/description, `EXACT` refusal, occurrences through `editSeries` with `THIS_ONE`; `McpUpdateCopyTest` (each copied field) and `McpUpdateToolIT`.
**Where**: `backend/src/main/java/com/lcs/findraco/mcp/tool/McpTransactionTools.java` (modify)
**Depends on**: T7
**Reuses**: `TransactionService.update`, `editSeries`, `getSeriesDefinition`
**Requirement**: MCP-08

**Done when**:

- [x] C53–C60 pass
- [x] Build gate green (end of Phase 2)

**Tests**: integration
**Gate**: build
**Commit**: `feat(backend): edit amount, date and description through mcp`

---

### T9: OAuth sign-in and consent screens

**What**: `useOAuthClientInfo` service hook + MSW handlers; `features/oauth/OAuthLoginPage` + `OAuthLoginView` (reusing the login fields, plain form POST with the CSRF cookie, `?error` state); `OAuthConsentPage` + `OAuthConsentView` (loading, unknown client, ready; Allow/Deny form POST); routes outside `PrivateRoute`; keys in `en.json` and `pt-BR.json`; flow tests, stories.
**Where**: `frontend/src/features/oauth/`
**Depends on**: None
**Reuses**: `LoginView` fields, `AuthCard`, `PasswordInput`, `Heading`/`Text`
**Requirement**: MCP-02

**Done when**:

- [x] C61–C66 pass

**Tests**: unit
**Gate**: quick
**Commit**: `feat(frontend): sign in and consent screens for connecting claude`

---

### T10: Routing, service worker and deploy

**What**: nginx `location`s for `/oauth2/`, `/mcp` (`proxy_buffering off`, long read timeout) and `/.well-known/`; `navigateFallbackDenylist` gains the three prefixes; `DEPLOY.md` section for the signing-key secret and the `app.oauth.*` values; ROADMAP M5-05 note; prerelease bump to `1.0.0-beta.31` in its own commit.
**Where**: `frontend/nginx.conf`
**Depends on**: T9
**Reuses**: existing `/api/` location
**Requirement**: MCP-01

**Done when**:

- [x] C67 passes
- [x] Build gate green (end of Phase 3)

**Tests**: none
**Gate**: build
**Commit**: `chore(deploy): route oauth and mcp through nginx`

---

## Checks

Backend proofs share the prefix `cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q`; ITs add `-Dsurefire.skip=true`, unit tests add `-Dsurefire.failIfNoSpecifiedTests=true`.

**C1** - Startup fails when `app.oauth.signing-key` is missing (MCP-03, design Risks)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q test -Dtest='ConfigurationPropertiesTest#oauthRequiresSigningKey' -Dsurefire.failIfNoSpecifiedTests=true

**C2** - `oauth2_authorization` and `oauth2_authorization_consent` exist with an index on `principal_name` (MCP-03)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='MigrationsIT#oauthTablesExist' -Dsurefire.skip=true

**C3** - An allowlisted `client_id` resolves to a client whose redirect URIs are exactly the document's (MCP-10, Connect 3)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q test -Dtest='CimdRegisteredClientRepositoryTest#allowlistedClientGetsDocumentRedirects' -Dsurefire.failIfNoSpecifiedTests=true

**C4** - A `client_id` outside the allowlist resolves to nothing and is never fetched (MCP-10, Connect 15)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q test -Dtest='CimdRegisteredClientRepositoryTest#unlistedClientIsNotFetched' -Dsurefire.failIfNoSpecifiedTests=true

**C5** - A document whose `client_id` differs, or with an auth method other than `none`, or without `authorization_code`, is refused (MCP-10, Connect 15)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q test -Dtest='CimdRegisteredClientRepositoryTest#invalidDocumentsAreRefused' -Dsurefire.failIfNoSpecifiedTests=true

**C6** - claude.ai's real document (with `jwt-bearer`) is accepted with only `authorization_code` and `refresh_token` (MCP-10, Connect 3)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q test -Dtest='CimdRegisteredClientRepositoryTest#claudeDocumentExtraGrantIgnored' -Dsurefire.failIfNoSpecifiedTests=true

**C7** - A fetch failure falls back to the cached entry, then to the pinned copy (MCP-10, design Risks)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q test -Dtest='CimdRegisteredClientRepositoryTest#fetchFailureFallsBack' -Dsurefire.failIfNoSpecifiedTests=true

**C8** - Authorization-server metadata advertises CIMD, `S256`, only `none`, and no `registration_endpoint` (MCP-01 Connect 1; MCP-10 Connect 16)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='AuthorizationServerIT#metadataAdvertisesCimdOnly' -Dsurefire.skip=true

**C9** - A registration request answers `404` (MCP-10, Connect 16)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='AuthorizationServerIT#noRegistrationEndpoint' -Dsurefire.skip=true

**C10** - An authorization request without a signed-in session redirects to `/oauth/login` (MCP-02, Connect 4)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='AuthorizationServerIT#anonymousAuthorizeRedirectsToLogin' -Dsurefire.skip=true

**C11** - A signed-in authorization request redirects to `/oauth/consent` with `client_id`, `scope` and `state` (MCP-02, Connect 5)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='AuthorizationServerIT#signedInAuthorizeRedirectsToConsent' -Dsurefire.skip=true

**C12** - `GET /oauth2/client-info` returns the client's name and redirect host, `404` for an unknown client (MCP-02, Connect 5)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='AuthorizationServerIT#clientInfoNamesClient' -Dsurefire.skip=true

**C13** - "Allow" redirects to the client with a code; the code works once and not after 60 seconds (MCP-02, Connect 6)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='AuthorizationServerIT#allowIssuesSingleUseCode' -Dsurefire.skip=true

**C14** - "Deny" redirects with `access_denied` and no code (MCP-02, Connect 7)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='AuthorizationServerIT#denyReturnsAccessDenied' -Dsurefire.skip=true

**C15** - An authorization request without an `S256` challenge is refused with `invalid_request` (MCP-02, Connect 8)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='AuthorizationServerIT#missingPkceRefused' -Dsurefire.skip=true

**C16** - The code exchange returns a 15-minute access token whose `aud` is the canonical `/mcp` URL, plus a refresh token (MCP-03, Connect 9)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='AuthorizationServerIT#codeExchangeIssuesAudienceBoundTokens' -Dsurefire.skip=true

**C17** - An authorization request with an unlisted `client_id` is refused with `invalid_client` (MCP-10, Connect 15)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='AuthorizationServerIT#unlistedClientRefused' -Dsurefire.skip=true

**C18** - A refresh returns a new access token and a new refresh token; the used one stops working (MCP-03, Connect 10)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='OAuthRefreshIT#refreshRotates' -Dsurefire.skip=true

**C19** - A refresh token unused for 30 days is refused with `invalid_grant` (MCP-03, Connect 11)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='OAuthRefreshIT#idleRefreshExpires' -Dsurefire.skip=true

**C20** - Replaying a rotated-out refresh token revokes the whole grant (MCP-03, Connect 12)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='OAuthRefreshIT#replayRevokesGrant' -Dsurefire.skip=true

**C21** - A password reset makes every MCP refresh token of that user fail (MCP-03, Connect 13)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='OAuthRefreshIT#passwordResetRevokesGrants' -Dsurefire.skip=true

**C22** - A refresh request for a client outside the allowlist is refused with `invalid_client` (MCP-03, Connect 15)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='OAuthRefreshIT#unlistedClientCannotRefresh' -Dsurefire.skip=true

**C23** - `/mcp` without a token answers `401` with `WWW-Authenticate: Bearer resource_metadata="…/.well-known/oauth-protected-resource"` (MCP-01, Connect 2)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpSecurityIT#anonymousGetsResourceMetadataChallenge' -Dsurefire.skip=true

**C24** - Protected-resource metadata names the resource, the issuer and `findraco.mcp` (MCP-01, Connect 1)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpSecurityIT#protectedResourceMetadata' -Dsurefire.skip=true

**C25** - An MCP token on `/api/...` answers `401`, and an app token on `/mcp` answers `401` (MCP-03, Connect 14)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpSecurityIT#tokensDoNotCrossChains' -Dsurefire.skip=true

**C26** - A token with another audience or without the scope answers `401` (MCP-03, Connect 2)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpSecurityIT#wrongAudienceOrScopeRefused' -Dsurefire.skip=true

**C27** - `list_plans` returns the caller's active plans with id, name, role and the default flag, archived ones excluded (MCP-04, Read 1)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpPlanToolsIT#listPlansShowsActivePlans' -Dsurefire.skip=true

**C28** - A tool without `plan` acts on the default plan; with a name or id it acts on that plan (MCP-04, Read 2–3)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpPlanToolsIT#planResolvesByDefaultNameOrId' -Dsurefire.skip=true

**C29** - Names match ignoring case and accents, exactly otherwise (MCP-04, Read 3)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q test -Dtest='McpNamesTest#matchesIgnoringCaseAndAccents' -Dsurefire.failIfNoSpecifiedTests=true

**C30** - An unknown plan returns `isError` listing the plan names; two matches list names with ids; a plan of someone else is unknown (MCP-04, Read 4–6)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpPlanToolsIT#unknownOrAmbiguousPlanIsToolError' -Dsurefire.skip=true

**C31** - The 61st call in a minute returns `isError` "retry in a moment" (MCP-09, Edge 1)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpSecurityIT#rateLimitIsToolError' -Dsurefire.skip=true

**C32** - An unexpected failure returns a generic `isError` with a request id and no stack trace (MCP-09, Edge 5)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpPlanToolsIT#unexpectedFailureIsGenericToolError' -Dsurefire.skip=true

**C33** - Each tool call logs user, plan, tool, outcome and duration, and never an amount or description (MCP-09, Edge 6)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpPlanToolsIT#callLogOmitsArguments' -Dsurefire.skip=true

**C34** - `list_categories` returns id, name, parent name and monthly limit (MCP-05, Read 7)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpReadToolsIT#listCategories' -Dsurefire.skip=true

**C35** - `list_transactions` filters by period, category, type and text, newest first, with status per row (MCP-05, Read 8)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpReadToolsIT#listTransactionsFilters' -Dsurefire.skip=true

**C36** - `list_transactions` returns at most 50 and says how many matched and how to get the next page (MCP-05, Read 8–9)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpReadToolsIT#listTransactionsPages' -Dsurefire.skip=true

**C37** - `get_month_summary` matches the dashboard summary for the same month, the current month when omitted (MCP-05, Read 10)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpReadToolsIT#monthSummaryMatchesDashboard' -Dsurefire.skip=true

**C38** - `get_category_spending` matches the category spending endpoint for the same month (MCP-05, Read 11)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpReadToolsIT#categorySpendingMatchesEndpoint' -Dsurefire.skip=true

**C39** - With the clock just after midnight in the user's zone but before it in UTC, status and current month follow the user's zone (MCP-05, Read 12)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpReadToolsIT#todayFollowsSavedTimeZone' -Dsurefire.skip=true

**C40** - Every read tool is listed with `readOnlyHint: true` (MCP-05, Read 13)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpReadToolsIT#readToolsAreReadOnly' -Dsurefire.skip=true

**C41** - `create_transaction` creates one transaction in the plan, created and paid in full by the caller (MCP-06, Capture 1)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureToolsIT#createPaidByCaller' -Dsurefire.skip=true

**C42** - Without a date it is dated today in the user's zone; without a category it is uncategorized (MCP-06, Capture 2, 4)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureToolsIT#createDefaults' -Dsurefire.skip=true

**C43** - A category name resolves by the name rule; an unknown one returns `isError` with the category names and creates nothing (MCP-06, Capture 3, 5)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureToolsIT#createResolvesCategoryByName' -Dsurefire.skip=true

**C44** - A non-positive amount, 3 decimals, or a blank or 256-character description returns `isError` naming the field and creates nothing (MCP-06, Capture 6)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureToolsIT#createRejectsInvalidInput' -Dsurefire.skip=true

**C45** - The write result carries id, description, amount, date, type, category, status and plan name (MCP-06, Capture 7)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureToolsIT#writeResultNamesPlan' -Dsurefire.skip=true

**C46** - The `create_transaction` schema has no installments, recurrence, split, participants or items parameter (MCP-06, Capture 8)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureToolsIT#createSchemaHasNoSeriesOrSplit' -Dsurefire.skip=true

**C47** - `confirm_transaction` confirms a pending forecast with the real amount and date, the date defaulting to today, and adds no row (MCP-07, Capture 9)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureToolsIT#confirmRecordsRealAmountAndDate' -Dsurefire.skip=true

**C48** - Confirming a different amount on an `EQUAL` split recomputes the shares (MCP-07, Capture 10)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureToolsIT#confirmRecomputesEqualSplit' -Dsurefire.skip=true

**C49** - Confirming a transaction not awaiting confirmation returns `isError` pointing to editing its date or amount (MCP-07, Capture 11)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureToolsIT#confirmNotAwaitingIsToolError' -Dsurefire.skip=true

**C50** - A viewer's create or confirm, and a contributor's confirm of another member's row, return `isError` and change nothing (MCP-06, MCP-07, Capture 12)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureToolsIT#roleMatrixForWrites' -Dsurefire.skip=true

**C51** - A transaction id from another plan returns "not found" (MCP-07, Capture 13)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureToolsIT#otherPlanIdNotFound' -Dsurefire.skip=true

**C52** - `create_transaction` and `confirm_transaction` carry `destructiveHint: false`, confirm also `idempotentHint: true` (MCP-06, MCP-07, Capture 14)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureToolsIT#writeHints' -Dsurefire.skip=true

**C53** - The update copy keeps every stored field (category, type, parcels, end date, split, participants, items, version) and overrides only the given ones (MCP-08, Edit 1)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q test -Dtest='McpUpdateCopyTest#keepsEveryStoredField' -Dsurefire.failIfNoSpecifiedTests=true

**C54** - `update_transaction` on a transaction with items and participants changes the amount and keeps both (MCP-08, Edit 1)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpUpdateToolIT#updateKeepsItemsAndParticipants' -Dsurefire.skip=true

**C55** - Editing a series occurrence changes that occurrence only (MCP-08, Edit 2)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpUpdateToolIT#occurrenceEditIsThisOne' -Dsurefire.skip=true

**C56** - A call with none of amount, date and description returns `isError` (MCP-08, Edit 3)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpUpdateToolIT#emptyUpdateIsToolError' -Dsurefire.skip=true

**C57** - A new amount on an `EQUAL` split recomputes the shares; on an `EXACT` split it returns `isError` and changes nothing (MCP-08, Edit 4–5)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpUpdateToolIT#splitRulesOnAmountChange' -Dsurefire.skip=true

**C58** - An amount below the items' sum returns the item-sum error and changes nothing (MCP-08, Edit 6)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpUpdateToolIT#amountBelowItemsIsToolError' -Dsurefire.skip=true

**C59** - A transaction changed between the tool's read and write returns "changed meanwhile" and changes nothing (MCP-08, Edit 7)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpUpdateToolIT#staleVersionIsToolError' -Dsurefire.skip=true

**C60** - A viewer's edit returns `isError`; the tool carries `destructiveHint: false`, `idempotentHint: true` (MCP-08, Edit 8–9)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpUpdateToolIT#viewerCannotEditAndHints' -Dsurefire.skip=true

**C61** - `getOAuthClientInfo` calls `GET /oauth2/client-info` with the client id (MCP-02, Connect 5)
Proof: run unit | ✓ getOAuthClientInfo > requests the client by id

**C62** - The sign-in page posts email, password and the CSRF token to `/oauth2/login` (MCP-02, Connect 4)
Proof: run unit | ✓ OAuthLoginPage > submits the form to the authorization server

**C63** - The consent page shows the client name, its redirect host and the capability list with "Allow" and "Deny" (MCP-02, Connect 5)
Proof: run stories | ✓ OAuthConsentView.stories.tsx > Ready

**C64** - The consent page for an unknown client shows the error and no buttons (MCP-02, Connect 15)
Proof: run stories | ✓ OAuthConsentView.stories.tsx > Unknown Client

**C65** - The sign-in page shows the wrong-credentials message when redirected back with `?error` (MCP-02, Connect 4)
Proof: run stories | ✓ OAuthLoginView.stories.tsx > Wrong Credentials

**C66** - "Allow" and "Deny" post `consent_action`, `client_id`, `state`, `scope` and the CSRF token to `/oauth2/authorize` (MCP-02, Connect 6–7)
Proof: run unit | ✓ OAuthConsentPage > posts the decision to the authorization server

**C67** - The service worker never answers navigations to `/oauth2/`, `/mcp` or `/.well-known/` (MCP-01, design Risks)
Proof: cd frontend && grep -q "oauth2" vite.config.ts && grep -q "well-known" vite.config.ts && grep -q "\\\\/mcp" vite.config.ts

**C68** - Behind a TLS-terminating proxy (`X-Forwarded-Proto: https`, another `Host`) every redirect of the connect flow (authorize to login, login failure, login to authorize, authorize to consent) stays on the issuer origin (MCP-02, Connect 4, design Risks)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='AuthorizationServerIT#forwardedHttpsRedirectsStayHttps' -Dsurefire.skip=true

**C69** - A tool call with an argument outside the tool's schema (including a misspelled `plan`) returns `isError` naming the parameter and creates nothing (MCP-09, Edge 2)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpPlanToolsIT#unknownArgumentIsToolError' -Dsurefire.skip=true

**C70** - A wrong-type or wrong-enum argument returns `isError` naming the parameter, worded in English whatever the machine locale (MCP-09, Edge 2, Assumptions)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpPlanToolsIT#wrongTypeAndEnumErrorsAreEnglish' -Dsurefire.skip=true

**C71** - A client that registers `http://localhost/callback` is met on any port; another path, `https`, userinfo or `localhost.evil.example` is a 400 with no redirect (MCP-02, Connect 8)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='AuthorizationServerIT#loopbackRedirectAnyPort' -Dsurefire.skip=true

**C72** - Changing the description of an installment keeps its `(k/N)` suffix; a description that already ends in one is kept as given (MCP-08, Edit 1)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q test -Dtest='McpUpdateCopyTest#keepsInstallmentSuffix' -Dsurefire.failIfNoSpecifiedTests=true

**C73** - The stored authorization code lives exactly 60 seconds (`expires_at - issued_at`), and one past it is refused with `invalid_grant` (MCP-02, Connect 6)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='AuthorizationServerIT#codeLivesSixtySeconds' -Dsurefire.skip=true

**C74** - A contributor confirming another member's row gets the "cannot modify a transaction created by another member" tool error and the row is unchanged (MCP-07, Capture 12)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureToolsIT#roleMatrixForWrites' -Dsurefire.skip=true

**C75** - The shipped `app.rate-limit.mcp-user` rule is 60 calls per `PT1M` (MCP-09, Edge 1)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q test -Dtest='ConfigurationPropertiesTest#mcpRateLimitDefaultIsSixtyPerMinute' -Dsurefire.failIfNoSpecifiedTests=true

**C76** - The sign-in page shows the wrong-credentials message for a bare `?error` in the URL, as the server redirects a failed sign-in (MCP-02, Connect 4)
Proof: run unit | ✓ OAuthLoginPage > shows the wrong-credentials message for a bare ?error

**C77** - The consent page names the host of the redirect URI this request asked for (found by the consent `state`), not the document's first host; with no pending request it falls back to a registered host (MCP-02, Connect 5)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='AuthorizationServerIT#clientInfoNamesRequestedRedirectHost' -Dsurefire.skip=true

**C78** - The client-info request carries the consent `state` when there is one (MCP-02, Connect 5)
Proof: run unit | ✓ getOAuthClientInfo > sends the consent state so the pending redirect is named

**C79** - The consent page passes the URL's `state` to the client-info request (MCP-02, Connect 5)
Proof: run unit | ✓ OAuthConsentPage > asks which host the pending request redirects to

**C80** - An archived or missing default plan returns a tool error asking for `plan` and listing the active plans; with none it says "You have no active plan." (MCP-04, Edge 3)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpPlanToolsIT#archivedDefaultPlanAsksForPlan' -Dsurefire.skip=true

**C81** - A member removed from a plan after connecting is refused that plan and never shown it (MCP-04, Edge 4)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpPlanToolsIT#memberRemovedAfterConnectingIsRefused' -Dsurefire.skip=true

---

## Handoff

**Settled mid-build:** none
**Dispatched:** worker A (Phase 1, T1–T4, Opus) at d066ce3, returned (4d08e64); worker B (Phase 2, T5–T8, Sonnet) at 4d08e64, returned (17d5dce4); worker C (Phase 3, T9–T10, Sonnet) at 17d5dce4, returned (8112379c); Verifier (Opus) at 6a6f39fd, returned FAIL (11 findings); fix worker (Sonnet) at 6a6f39fd
**Walked:** 2026-11-08, local stack (backend `local` profile on a throwaway Postgres, built SPA behind `frontend/nginx.conf` in nginx:1.27, Playwright, Claude Code's real CIMD document fetched from claude.ai). Connect: `/oauth2/authorize` → `/oauth/login` (`walk/login.png`); wrong password → `?error` "E-mail ou senha inválidos." (`walk/login-error.png`); 6th try in a minute → `?error=rate-limited`; right password → `/oauth/consent` naming Claude Code, capabilities, Negar/Permitir (`walk/consent.png`); unknown client → "app not recognized", no buttons (`walk/consent-unknown.png`); Permitir → 302 to `http://localhost:9999/callback?code&state`; second connect with stored consent skips the page. Token: 200, 899 s, refresh issued, `aud` = `/mcp`. MCP: initialize, 8 tools listed; `list_plans` default plan; `create_transaction` "Posto" 42 DEBIT → ACTUAL today in plan "My plan"; `list_transactions` shows it; unknown plan → isError listing plans. Refresh rotates; replaying the old one → `invalid_grant` and the new one dies too. Found: (W1) behind nginx the AS builds absolute redirects from forwarded headers: `proxy_set_header Host $host` drops the port and Tomcat takes the port from `X-Forwarded-Proto`, so `/oauth2/authorize` redirected to `http://localhost/oauth/login` (walk used `$http_host` + `X-Forwarded-Port`); prod depends on its TLS topology. (W2) consent says "você volta para 127.0.0.1" while the request's redirect is `localhost`: it shows the document's first redirect URI, not the requested one. (W3) a tool input-schema error comes in the JVM locale (Portuguese) while other tool errors are English.

---

## Phase Execution Map

```
Phase 1 → Phase 2 → Phase 3

Phase 1:  T1 ------→ T2 ------→ T3 ------→ T4
Phase 2:  T5 ------→ T6 ------→ T7 ------→ T8
Phase 3:  T9 ------→ T10
```

Batches: Phase 1 + Phase 2 is 8 tasks; the split lands on the phase boundary: worker A = Phase 1 (T1–T4), worker B = Phase 2 (T5–T8), worker C = Phase 3 (T9–T10).
