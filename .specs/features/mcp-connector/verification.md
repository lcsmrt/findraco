# Claude MCP Connector verification

**Verdict**: FAIL
**Proofs**: `proofs.md` at 8112379c (diff range d066ce3..6a6f39fd, read at HEAD 6a6f39fd)
**Verifier**: independent sub-agent (author != verifier)

## Checks

| Check | Test | Holds |
| --- | --- | --- |
| C1 | `ConfigurationPropertiesTest` `oauthRequiresSigningKey` | yes |
| C2 | `MigrationsIT` `oauthTablesExist` | yes |
| C3 | `CimdRegisteredClientRepositoryTest` `allowlistedClientGetsDocumentRedirects` | yes |
| C4 | `CimdRegisteredClientRepositoryTest` `unlistedClientIsNotFetched` | yes - asserts zero hits on the fake host |
| C5 | `CimdRegisteredClientRepositoryTest` `invalidDocumentsAreRefused` | yes |
| C6 | `CimdRegisteredClientRepositoryTest` `claudeDocumentExtraGrantIgnored` | yes |
| C7 | `CimdRegisteredClientRepositoryTest` `fetchFailureFallsBack` | yes |
| C8 | `AuthorizationServerIT` `metadataAdvertisesCimdOnly` | yes |
| C9 | `AuthorizationServerIT` `noRegistrationEndpoint` | yes |
| C10 | `AuthorizationServerIT` `anonymousAuthorizeRedirectsToLogin` | yes - but only without forwarded headers (see finding W1) |
| C11 | `AuthorizationServerIT` `signedInAuthorizeRedirectsToConsent` | yes |
| C12 | `AuthorizationServerIT` `clientInfoNamesClient` | yes - the host is the document's, not the request's (finding W2) |
| C13 | `AuthorizationServerIT` `allowIssuesSingleUseCode` | no - the 60-second half writes `authorization_code_expires_at` itself, so any code TTL passes |
| C14 | `AuthorizationServerIT` `denyReturnsAccessDenied` | yes |
| C15 | `AuthorizationServerIT` `missingPkceRefused` | yes - missing and `plain` |
| C16 | `AuthorizationServerIT` `codeExchangeIssuesAudienceBoundTokens` | yes - exp-iat = 900, aud, iss, sub |
| C17 | `AuthorizationServerIT` `unlistedClientRefused` | yes |
| C18 | `OAuthRefreshIT` `refreshRotates` | yes |
| C19 | `OAuthRefreshIT` `idleRefreshExpires` | yes - asserts the stored 30-day window, then the expiry |
| C20 | `OAuthRefreshIT` `replayRevokesGrant` | yes - the newer token dies and the grant row is gone |
| C21 | `OAuthRefreshIT` `passwordResetRevokesGrants` | yes - another user's grant survives |
| C22 | `OAuthRefreshIT` `unlistedClientCannotRefresh` | yes |
| C23 | `McpSecurityIT` `anonymousGetsResourceMetadataChallenge` | yes |
| C24 | `McpSecurityIT` `protectedResourceMetadata` | yes |
| C25 | `McpSecurityIT` `tokensDoNotCrossChains` | yes |
| C26 | `McpSecurityIT` `wrongAudienceOrScopeRefused` | yes |
| C27 | `McpPlanToolsIT` `listPlansShowsActivePlans` | yes |
| C28 | `McpPlanToolsIT` `planResolvesByDefaultNameOrId` | yes |
| C29 | `McpNamesTest` `matchesIgnoringCaseAndAccents` | yes |
| C30 | `McpPlanToolsIT` `unknownOrAmbiguousPlanIsToolError` | yes - a stranger's plan by id and by name is unknown, never named |
| C31 | `McpSecurityIT` `rateLimitIsToolError` | no - the limit is overridden to 2 per hour; the 60-per-minute value is never asserted |
| C32 | `McpPlanToolsIT` `unexpectedFailureIsGenericToolError` | yes |
| C33 | `McpPlanToolsIT` `callLogOmitsArguments` | yes |
| C34 | `McpReadToolsIT` `listCategories` | yes |
| C35 | `McpReadToolsIT` `listTransactionsFilters` | yes |
| C36 | `McpReadToolsIT` `listTransactionsPages` | yes - 51 rows, 50 then 1 |
| C37 | `McpReadToolsIT` `monthSummaryMatchesDashboard` | yes |
| C38 | `McpReadToolsIT` `categorySpendingMatchesEndpoint` | yes |
| C39 | `McpReadToolsIT` `todayFollowsSavedTimeZone` | yes - the status half; the current-month half only discriminates at a month boundary |
| C40 | `McpReadToolsIT` `readToolsAreReadOnly` | yes |
| C41 | `McpCaptureToolsIT` `createPaidByCaller` | yes |
| C42 | `McpCaptureToolsIT` `createDefaults` | yes |
| C43 | `McpCaptureToolsIT` `createResolvesCategoryByName` | yes |
| C44 | `McpCaptureToolsIT` `createRejectsInvalidInput` | yes - 0, -5, 3 decimals, blank, 256 chars |
| C45 | `McpCaptureToolsIT` `writeResultNamesPlan` | yes |
| C46 | `McpCaptureToolsIT` `createSchemaHasNoSeriesOrSplit` | yes - exact property set |
| C47 | `McpCaptureToolsIT` `confirmRecordsRealAmountAndDate` | yes |
| C48 | `McpCaptureToolsIT` `confirmRecomputesEqualSplit` | yes |
| C49 | `McpCaptureToolsIT` `confirmNotAwaitingIsToolError` | yes |
| C50 | `McpCaptureToolsIT` `roleMatrixForWrites` | no - the contributor-confirms-another's-row case asserts `isNotBlank()`, so any error (not found, bad plan) passes |
| C51 | `McpCaptureToolsIT` `otherPlanIdNotFound` | yes |
| C52 | `McpCaptureToolsIT` `writeHints` | yes - Spring AI 2.0.2 always emits the hints (defaults `destructiveHint=true`), so `asBoolean()` discriminates |
| C53 | `McpUpdateCopyTest` `keepsEveryStoredField` | yes - record equality over every field |
| C54 | `McpUpdateToolIT` `updateKeepsItemsAndParticipants` | yes |
| C55 | `McpUpdateToolIT` `occurrenceEditIsThisOne` | yes - siblings and the definition untouched; slot kept (checked by own example) |
| C56 | `McpUpdateToolIT` `emptyUpdateIsToolError` | yes |
| C57 | `McpUpdateToolIT` `splitRulesOnAmountChange` | yes |
| C58 | `McpUpdateToolIT` `amountBelowItemsIsToolError` | yes |
| C59 | `McpUpdateToolIT` `staleVersionIsToolError` | yes |
| C60 | `McpUpdateToolIT` `viewerCannotEditAndHints` | yes |
| C61 | `useOAuthService.test.ts` `getOAuthClientInfo > requests the client by id` | yes |
| C62 | `OAuthLoginPage.test.tsx` `OAuthLoginPage > submits the form to the authorization server` | yes |
| C63 | `OAuthConsentView.stories.tsx` `Ready` | yes |
| C64 | `OAuthConsentView.stories.tsx` `Unknown Client` | yes |
| C65 | `OAuthLoginView.stories.tsx` `Wrong Credentials` | no - the story passes `error` directly; the page's bare `?error` mapping (`OAuthLoginPage.tsx` `readError`) has no test |
| C66 | `OAuthConsentPage.test.tsx` `OAuthConsentPage > posts the decision to the authorization server` | yes |
| C67 | `grep` on `vite.config.ts` `navigateFallbackDenylist` | yes |

## Findings

| Finding | Evidence | Fix | Closed |
| --- | --- | --- | --- |
| High - (W1) Behind the prod proxy, every absolute redirect the authorization server builds comes from the request: the consent redirect (Spring AS builds it from the request's scheme, host and port), the saved-request redirect after sign-in, and Tomcat's absolutizing of the relative login/`?error` redirects (`server.tomcat.use-relative-redirects` is false by default in Boot). nginx sends `Host $host` (no port) and `X-Forwarded-Proto $scheme`; nginx listens only on :80, so TLS ends in front of it and `$scheme` is `http` in prod. So the connect flow redirects to `http://<domain>/oauth/...`: at best a downgrade hop that needs an http→https redirect upstream, at worst a broken connect. No test sends forwarded headers. | `frontend/nginx.conf:27,34,47` (`X-Forwarded-Proto $scheme`, `Host $host`); `application.properties:140` (`forward-headers-strategy=native`); `AuthorizationServerConfig.java:163,185`; `AuthorizationServerIT.java` asserts `http://localhost/oauth/consent?` (built from the request) | Stop building redirects from the request: set `consentPage` and the `LoginUrlAuthenticationEntryPoint`/form `loginPage`/failure URL to absolute URLs built from `app.oauth.issuer`, and set `server.tomcat.use-relative-redirects=true` for the rest. Also make nginx pass the real values: `X-Forwarded-Proto` from the trusted TLS terminator (`$http_x_forwarded_proto` through a `map` that defaults to `$scheme`), `X-Forwarded-Host $http_host`/`X-Forwarded-Port`. Add an IT that sends `X-Forwarded-Proto: https` + `X-Forwarded-Host` and asserts `https://` on the consent and post-login redirects. Check the prod TLS topology in DEPLOY.md. | ef619206 |
| Medium - Spec Edge 2 (an unknown parameter is a tool error naming it) is not built and has no check: an unknown argument is ignored without a word. With a misspelled `plan` (e.g. `plano`), a write lands in the default plan instead of the intended one. Wrong types and bad enum values are refused (schema validation). | Own example at HEAD: `list_categories {"bogus":1}` → `isError:false`; `create_transaction amount:"abc"` → isError naming `/amount` | Refuse arguments outside the tool's schema (`additionalProperties:false` in the generated input schemas, or check the argument names in `McpToolRunner`), with an error naming the parameter; add a check/IT for unknown, wrong-type and wrong-enum arguments | 09a6a486 |
| Medium - The loopback redirect validator (a `localhost` redirect matches on any port, RFC 8252) has no test. Reading it: it applies only when the requested host is exactly `localhost`, swaps only the port into each registered URI and then compares whole strings (scheme, userinfo, path, query), so a non-loopback registration can never match. Errors are a 400 page, never a redirect. Judged correct and safe. But Claude Code's connect depends on it, and a regression would show up only in production. | `AuthorizationServerConfig.java:277-290`; the test client registers only `https://client.example/callback` | Add an IT with a test client that registers `http://localhost/callback`: `http://localhost:54321/callback` issues a code to that exact URI; `http://localhost:1/other`, `https://localhost:1/callback`, `http://user@localhost:1/callback` and `http://localhost.evil.example:1/callback` are refused with 400 and no redirect | 1487b03f |
| Low - `update_transaction` on a series occurrence (SPEC_DEVIATION, plain `update`): a later app series edit with scope ALL or THIS_AND_FOLLOWING that covers the slot puts the occurrence back to the series amount, date and description, so the MCP correction is lost. The app's own THIS_ONE edit is lost the same way: it is not frozen, only CONFIRMED occurrences are. The slot is never corrupted: `scheduled_date` is `updatable=false` and stays, and there is no duplicate or gap. The deviation is sound and adds no data loss beyond the app's own. Two differences remain: it can move the date, which THIS_ONE cannot, and that move is also undone; and a new description on an installment drops the `(k/N)` suffix that THIS_ONE re-appends. | Own example at HEAD: series of 3 × 300; MCP update #2 → 350, date +3d (`scheduled_date` kept); then PUT series ALL 320 → all three 320 on their slot dates, no new row | Accept as parity, and say in the tool description that a later series edit in the app resets the occurrence. Keep the `(k/N)` suffix when the description of an installment occurrence changes (as `editSeries` THIS_ONE does) | a15dee7f |
| Low - C13 does not hold the 60-second code lifetime | `AuthorizationServerIT.java:125-128` writes `authorization_code_expires_at = now() - 1s` | Assert `authorization_code_expires_at - authorization_code_issued_at = 60s` on the stored row (like C19 does for 30 days), then expire it | 9fc4aed4 |
| Low - C50's contributor case accepts any error | `McpCaptureToolsIT.java:293-294` `.isNotBlank()` | Assert the contributor's message (`CannotModifyOthersTransactionException`'s text) | 9fc4aed4 |
| Low - C65: the page's bare `?error` → wrong-credentials mapping is untested; only `?error=rate-limited` is | `OAuthLoginPage.tsx` `readError`; `OAuthLoginPage.test.tsx:41` | Add a page test for `/oauth/login?error` showing "Invalid e-mail or password." | 6218b1d4 |
| Low - C31 never asserts the configured 60 calls per minute | `McpSecurityIT.java:27` overrides capacity=2, period=PT1H | Assert `app.rate-limit.mcp-user` binds to 60/PT1M (e.g. in `ConfigurationPropertiesTest` or on `RateLimitProperties`) | 9fc4aed4 |
| Low - (W2) The consent page names the alphabetically first host among the document's redirects, not the host of the redirect_uri in this request. Claude Code shows "127.0.0.1" while redirecting to `localhost`. Spec Connect 5 says "its redirect host". | `OAuthClientService.java:24-28` (`sorted().findFirst()`) | Pass the pending request's redirect host to the consent page: look up the authorization by its consent `state` (`OAuth2AuthorizationService.findByToken(state, STATE)`) in `client-info`, or show every registered host | 97799578 |
| Low - (W3) Schema-validation errors come in the JVM locale (Portuguese on the dev machine), while every other tool error is in English. Spec Assumptions: messages in English. | Own example: `/amount: string encontrado, number esperado` | Pin the validator's locale to English (or `-Duser.language=en` in the image) and add a wrong-type case to the Edge 2 IT | 09a6a486 |
| Low - Spec Edge 3 (archived or missing default plan) and Edge 4 (a member removed after connecting) have no check. Both behave correctly, but with no active plan the message reads "Your plans: ." | Own example: archived default → "You have no default plan. Pass the plan argument. Your plans: ."; removed member → plan unknown | Add checks for Edge 3/4; word the empty case ("You have no active plan") | a45c3b0e |
