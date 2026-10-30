## Validation: backend-standards - PASS

**Result**: PASS (no blocking gap; 8 non-blocking gaps ranked at the end). Lean, risk-focused scope approved by the user.

- Branch `backend-standards`, commit range `317918f..2b38ff5` (102 commits, 610 files).
- Tasks: 236/236 rows of the tasks.md status tables are done; no task blocked or partial.
- Real working tree clean before and after verification (`git status --porcelain` empty both times); the sensor ran in a scratch worktree, since removed.

## Gate

| Gate | Command | Result |
| ---- | ------- | ------ |
| Backend | `cd backend && ./mvnw -B verify` | PASS. Surefire 242 tests, Failsafe total 493 tests (0 failures, 0 errors, 0 skipped). JaCoCo "All coverage checks have been met". Enforcer (Java version, banned deps) passed. Spotless clean (296 files). |
| Frontend lint | `pnpm lint` | PASS |
| Frontend build | `pnpm build` | PASS |
| Frontend test | `pnpm test` | 1st run: 881 passed, 2 failed (`TimeZoneDialog.test.tsx` "pins the chosen zone" timed out at 5000 ms, the second failure followed from it). Re-run twice: 883/883 passed (136 files passed, 29 skipped files). Judged a load-induced flake (the machine was busy), not a regression. Listed as a gap. |

Test integrity: no test-count baseline from before the feature was kept in the task input, so a decrease cannot be proven either way. 493 backend plus 883 frontend tests run green; the 29 skipped frontend files are vitest project scoping, not `.skip` tests.

## Spec-anchored check (high-risk ACs only)

Legend: PASS = assertion targets the spec's exact outcome. GAP = no assertion found. SPG = spec-precision gap (assertion weaker than, or different from, the spec wording).
`ITs` paths are under `backend/src/test/java/com/lcs/findraco/`.

### BST-06 (aggregates, optimistic locking)
| AC | Spec outcome | Evidence | Result |
| -- | ------------ | -------- | ------ |
| 4 (H1) | no participants -> named exception on HTTP and CSV | `transaction/model/TransactionTest.java:26-28` `assertThatThrownBy(Transaction.create(... List.of() ...)).isInstanceOf(ParticipantsRequiredException)`; HTTP `transaction/TransactionEntryPathsIT.java:38-45` `problem(422, "participants-required")` + zero rows; CSV `TransactionEntryPathsIT.java:49-70` every imported row has a participant row with `share_amount = amount`, and the import path calls `Transaction.create` (`TransactionImportService.java:112`) | PASS |
| 5 (H3) | series edit end<start -> 422, same type as create | `transaction/SeriesEditIT.java:598-622` `problem(422, "period-start-after-end")` on create and on edit, then `endDate` unchanged | PASS |
| 6 (H5) | EXACT split with missing share -> 422, never 500 | `transaction/TransactionEntryPathsIT.java:75-90` `problem(422, "exact-share-invalid")` + zero rows; `TransactionTest.java:32-35` | PASS |
| 7 (H7) | series edit with other-type category -> 422 | `SeriesEditIT.java:626-642` `problem(422, "transaction-category-type-mismatch")` | PASS |
| 8 (H7) | category type change while used -> 409 | `category/CategoryHierarchyIT.java:209-224` `problem(409, "category-type-change-in-use")`, stored type unchanged, an unused category still changes (200) | PASS |
| 10 | stale version -> 409 `stale-version`, nothing changes | `OptimisticLockingIT.java:63` `problem(409, "stale-version")` then `:69-77` first edit's EXACT split (70/30) and version survive; series `:106`, category `:125` | PASS |
| 9 (support) | edit requires `version` | `OptimisticLockingIT.java:77` (`aTransactionEditWithoutAVersionIsInvalid`) | PASS |

### BST-12 (migrations, H12)
| AC | Spec outcome | Evidence | Result |
| -- | ------------ | -------- | ------ |
| 4 | partial unique index `(plan_id, source_ref) WHERE source_ref IS NOT NULL` | `MigrationsIT.java:288-302` nulls repeat, same ref in another plan ok, duplicate in same plan throws `DataIntegrityViolationException` containing `uk_transactions_plan_source_ref` | PASS |
| 5 | two concurrent imports store each row once | `transaction/ConcurrentImportIT.java:60-83` two threads released by a latch, `imported` sums to 30 and `findAllByPlan` has size 30 | PASS |
| 6 | series edit/delete hold the same lock as the top-up | `ConcurrentImportIT.java:129-165,167-195` holds `findByPlanAndSeriesIdForUpdate` and asserts the edit and the delete block (`pending.get(HOLD_MILLIS)` throws) then finish 2xx | PASS |
| 7 | migration aborts naming the violation | `MigrationsIT.java:344-370` four `FlywayException`s with messages `V16 precondition failed: 1 users have a null email, name or password`, `...e-mails are registered more than once`, `...amount that is not positive`, `...imported references appear more than once in a plan`; also V19 (`:389-397`) and the rename (`:420`) | PASS |

### BST-14 (rate limits, exposure)
| AC | Spec outcome | Evidence | Result |
| -- | ------------ | -------- | ------ |
| 1 bind | listen only on the bridge gateway (`SERVER_ADDRESS`) | config only: `application.properties:103` `server.address=${SERVER_ADDRESS:127.0.0.1}`, `docker-compose.yml:18` makes it mandatory. No automated test asserts the bind. | SPG (config-verified; VPS step pending user) |
| 1 forwarded | trust `X-Forwarded-For` only from the proxy | `shared/web/ClientAddressIT.java:85-86` untrusted peer -> `isEqualTo("127.0.0.1")`; `:94-95` proxy -> client IP; `:99-100` forged leading entry ignored | PASS |
| 2 | 429 + `Retry-After` + `rate-limited` + WARN, per IP/e-mail/user | `shared/ratelimit/RateLimitIT.java:95-99` `problem(429, "rate-limited")`, `Retry-After` non-null and positive; routes: login per IP `:103`, login per e-mail across IPs and case `:114-122`, forgot per e-mail `:126`, per IP `:136`, register `:147`, CSV per user `:161`; WARN without e-mail `:175-186` | PASS |
| 3 | limits read from `app.rate-limit.*` | `ConfigurationPropertiesTest.java:164-171` zero capacity and missing rule fail startup naming `app.rate-limit` | PASS |

### BST-15 (authentication hardening)
| AC | Spec outcome | Evidence | Result |
| -- | ------------ | -------- | ------ |
| 1 | <8 or >128 code points -> 422 `PasswordLength` | `auth/PasswordHashingIT.java:90-94` `problem(422, "validation-failed")` + `$.errors[?(@.field=='password')].code == "PasswordLength"`; bounds `shared/security/PasswordPolicyTest.java:47-69` (7 fail, 8 and 128 pass, 129 fail, emoji = 1) | PASS |
| 2 | control/invisible char -> 422 | `PasswordHashingIT.java:97-103` zero-width -> code `PasswordCharacters`; parametrized `PasswordPolicyTest.java:91-92` | PASS |
| 3 | any language, spaces, emoji accepted | `PasswordPolicyTest.java:63-69,96-102` | PASS |
| 4 | NFKC before hash and verify | `PasswordHashingIT.java:106-114` register decomposed, login with composed and decomposed both 200; `PasswordPolicyTest.java:119-122` | PASS |
| 5 | Argon2id; BCrypt rehash on login | `PasswordHashingIT.java:44-52` `$2` before, `startsWith("{argon2}$argon2id$")` after, login still works; wrong password leaves hash unchanged `:56-62`; new account `:66-77` | PASS |
| 6 | one `PasswordEncoder` for real and dummy hashes | single bean `auth/config/PasswordEncoderConfig.java:25`; no test or ArchUnit rule guards it | SPG (no guard) |
| 7 | forgot-password returns before mail; same status/body known or unknown | `auth/ForgotPasswordAsyncIT.java:52-64` no mail at response time, mail later from a `mail-` thread; `:68-83` same status, same body, headers superset | PASS |
| 8 | JWT secret <32 bytes -> refuse to start | `ConfigurationPropertiesTest.java:101-104` 16-byte secret fails startup, `:108-109` non-base64 fails, `:113-115` 32 bytes starts | PASS |
| 9 | `sub` = user id | `auth/AuthenticationIT.java:285` `payload.get("sub") == String.valueOf(userId)` | PASS |
| 10 | no `spring.dotenv.filename` | `grep dotenv` over `backend/src` and `pom.xml` finds nothing; no test guard | SPG (no guard) |

### BST-16 (CSV import)
| AC | Spec outcome | Evidence | Result |
| -- | ------------ | -------- | ------ |
| 3 | unknown header -> 422 `csv-unknown-format` | `transaction/CsvImportIT.java:178-183` | PASS |
| 4 | card bill -> 422 `csv-format-not-supported` | `CsvImportIT.java:187-192` | PASS |
| 5 | any bad row -> nothing stored, 422, lines listed, cap 50 | `CsvImportIT.java:112-127` `import-line-invalid`, `errors.length()==1`, `[0].line==5`, `field=="date"`, `code=="date-invalid"`, zero rows, then the fixed file imports 3; cap `:131-138` `errors.length()==50` | PASS |
| 6 | size, row bound, invalid UTF-8 -> 422 naming the problem and the line | `CsvImportIT.java:142-147` `csv-too-large`; `:151-160` `csv-too-many-rows` + nothing stored; `:164-174` `csv-encoding-invalid` with `detail` containing `line 2` | PASS |
| 8 | rows built by `Transaction.create`, `sourceText` and `sourceRef` stored | `TransactionImportService.java:112`; `CsvImportIT.java:99-109` tuple `(sourceRef, sourceText, description)`; `TransactionTest.java:216` `getSourceText() == "UBER *TRIP"`; parser-level `StatementParserRegistryTest.java:36,90,100` | PASS (IT row has `description == sourceText`, so the IT alone cannot tell the two fields apart; the model test covers it) |

### BST-18 (series correctness)
| AC | Spec outcome | Evidence | Result |
| -- | ------------ | -------- | ------ |
| 1 | deleting one occurrence stores its date in `recurrence_exceptions` | behavioural only: `SeriesEditIT.java:533-558` deletes March, edits, `containsExactly("2026-01-15","2026-02-15","2026-04-15","2026-05-15")`; the table is never queried directly (mapped at `RecurrenceDefinition.java:78`) | SPG (indirect) |
| 2 / 3 (H8) | generator never produces an excepted date; deleted occurrence does not reappear after edit | `RecurringTransactionGeneratorTest.java:466-476` `containsExactly(07-01, 09-01, 10-01)` with 08-01 excepted; `SeriesTopUpJobIT.java:126-140` `.doesNotContain(TODAY.plusMonths(3))`; `SeriesEditIT.java:550-557` | PASS |
| 6 | read within watermark writes nothing and takes no lock | `SeriesHorizonIT.java:60-72` Hibernate statistics: insert, update, delete counts all zero; beyond-mark extension `:44-58` | SPG: "no lock" is not asserted, and entity statistics do not see native or bulk writes |
| 9 (H10) | DELETE without `scope` -> 400 | `SeriesEditIT.java:562-575` `problem(400, "malformed-request")`, all 3 occurrences remain | PASS |
| 10 | `(k/N)` labels kept after "this and following" delete | `SeriesEditIT.java:578-594` `containsExactlyInAnyOrder("Laptop (1/10)".."Laptop (4/10)")` | PASS |

### BST-19 (plans keep their invariants)
| AC | Spec outcome | Evidence | Result |
| -- | ------------ | -------- | ------ |
| 1 | leave/removal/plan delete provisions a personal plan | `plan/PlanKeepsAPlanIT.java:28-38` (removal), `:42-56` (plan delete), helper `:82-88`: one membership, plan differs, `isDefault()`, role `OWNER` | PASS |
| 2 | leaving the last plan -> 409 | `PlanKeepsAPlanIT.java:62-79` `problem(409, "last-plan")`, membership count still 1; leaving one of several -> 204 | PASS |
| 3 (H6) | EMAIL invitation without e-mail -> 422 | `plan/InvitationLifecycleIT.java:139-147` `problem(422, "invitation-email-required")` | PASS |
| 4 (H9) | soft-deleted plan -> preview and accept 404 | `InvitationLifecycleIT.java:151-161` `problem(404, "invitation-not-found")` on both | PASS |
| 5 (H9) | invitation role OWNER -> 422 | implemented as a narrowed enum without OWNER (`InvitationRole`, tasks.md T39: 422 `validation-failed`, code `NarrowedEnum`); no test sends OWNER to the invitation endpoint (`grep NarrowedEnum` in tests: none) | GAP (untested) |
| (AC 6) | `PERCENT` not a split mode | `TransactionCrudIT.java:375-385` `problem(400, "malformed-request")`; DB side `MigrationsIT.java:406-415` | PASS (AC says "not a split mode"; status unspecified) |

### BST-10 AC 9, BST-08 AC 1/7/8/10, BST-13 AC 3, BST-01 AC 5
| AC | Spec outcome | Evidence | Result |
| -- | ------------ | -------- | ------ |
| BST-10 AC 9 | flag false iff endpoint refuses, per role and action | `plan/PlanAuthorizationMatrixIT.java:905-914` `assertThat(status in 2xx).isEqualTo(allowed)` and, when refused, `isIn(403, 404)`; plan flags `:769-810`, transaction flags per role and row `:815-847`; route coverage both ways `:644-665`; every route x role `:628-636` | PASS |
| BST-08 AC 1 | problem+json from advice, entry point, access-denied handler, filter | `shared/error/ProblemProducersIT.java:59-70` advice, `:72-78` entry point 401, `:80-93` access-denied 403 (media type, `type == .../forbidden`, `requestId`), `:98-109` filter exception | PASS |
| BST-08 AC 7 | out-of-scope -> 404, never 403 | `PlanAuthorizationMatrixIT.java:104,142,247,294` non-member reads, creates, edits, manages -> 404 (`:850-862` read and delete of a row -> `isNotFound`) | PASS |
| BST-08 AC 8 | unexpected exception (incl. `IllegalArgumentException`) -> 500 with fixed detail, cause at ERROR | `ProblemProducersIT.java:118-132` `getDetail() == Problems.INTERNAL_DETAIL`, logged event with the cause message; `:137-142` IAE routed to `handleUnexpected`; `:98-113` for filters | PASS |
| BST-08 AC 10 | `detail` never holds token, e-mail or personal data | no test scans `detail` (only the 500 fixed detail and `csv-encoding-invalid` "line N" are asserted) | SPG (no direct test) |
| BST-13 AC 3 | log has no passwords, tokens, reset links, e-mails, bodies, amounts, in login and reset flows | `shared/LogHygieneIT.java:66-128` runs register, login, forgot, reset; `:126` `noneMatch(line.contains(secret))` per secret, `:128` no `reset-password?token=`; also `RateLimitIT.java:184-186` e-mail absent from the WARN | PASS |
| BST-01 AC 5 | logout and reset leave the session answering 401; 15-minute access token | `auth/SessionIT.java:222-229` logout then refresh -> 401 `session-invalid` + cookie cleared (`:296-301`); `auth/PasswordRecoveryIT.java:195-208` reset -> both devices 401, other user's device 200; lifetime `ConfigurationPropertiesTest.java:86` `expiration == Duration.ofMinutes(15)` and `AuthenticationIT.java:251,269` 900 s | PASS |

## Guards for the remaining ACs (existence only)

| Area | Guard |
| ---- | ----- |
| Disposable DB (BST-01) | `support/TestcontainersConfig.java`, `support/DisposableDatabaseGuard(+Test)`; CI `./mvnw -B verify` at `.github/workflows` line 182 |
| Formatting (BST-02/03) | Spotless in `pom.xml:233`, `.git-blame-ignore-revs`, hooks via `frontend/.husky` |
| Enforcer, warnings, Error Prone | `pom.xml:185-203` (Java version, banned Lombok/MapStruct), `:214-218` `failOnWarning` + `-Xlint:all,-serial`, `:225` Error Prone |
| No `@SuppressWarnings` | `ArchitectureTest.noSourceSuppressesWarnings` |
| ArchUnit structure | `ArchitectureTest`: `controllersNeverAccessRepositories`, `constructorInjectionOnly`, `packagesFollowTheFeatureLayout`, `featuresMeetThroughTheirServicesAndModels`, `sharedDependsOnNoFeature`, `noIllegalArgumentAsUserError`, `repositoriesOverAnotherFeaturesEntityAreReadOnly`, `modelsTakeDomainValuesOnly`, `guardedEntitiesHaveNoPublicSetters`, `aggregateChildrenHaveNoWriteRepository`, `dtosAreRecords`, `requestTextAndCollectionsAreBounded`, `dtosKeepTheirComponentNames`, `timeComesFromTheInjectedClockInUtc`, `entitiesCarryNoSchemaAnnotations`, `controllersReceiveNoEntities` |
| OSIV, show-sql | `application.properties:21` `open-in-view=false`, `:19` `show-sql=false` (true only in `application-local.properties`); `StatementCountIT` |
| Migrations / schema | `MigrationsIT` (boot on empty DB under `ddl-auto=validate`, FK indexes, constraint names) |
| OpenAPI contract | `OpenApiSnapshotIT` (+ `baseline-api-docs.json`), `OpenApiConventionsIT` |
| Request tracing | `RequestIdFilterIT`, `RequestLogFilterIT` |
| Time zone | `TimeZoneIT`, `SessionClockBoundaryIT` |
| Category usage from the server | `CategorySpendingIT`, `CategoryUsageCalculatorTest`, `CategorySpendingAssemblerTest` |
| Config records | `ConfigurationPropertiesTest` |
| Frontend | lint (custom rules `componentLogicCap`, `noJsxIife`), `scripts/check-siblings`, build and 883 tests green |
| Docs / skills | `.claude/skills/backend-structure`, `backend-testing`, `CLAUDE.md`, `DEPLOY.md` updated in the last commits (not deep-checked) |

## Discrimination sensor

Five mutations, each applied in an isolated `git worktree` (HEAD `2b38ff5`), tests run with the given Maven flags, original file restored, worktree removed. Surefire stops the build on the first failing phase, so every kill came from the unit tests; the matching ITs were not reached.

| # | Mutation | Tests run | Result |
| - | -------- | --------- | ------ |
| M1 | `RateLimiter.consume`: refusal condition `!probe.isConsumed()` made unreachable (`&& probe.getNanosToWaitForRefill() < 0`) | `RateLimiterTest`, `RateLimitIT` | KILLED (`RateLimiterTest`: 4 of 6 failed, e.g. `allowsTheCapacityAndRefusesTheNextCallWithTheWait`) |
| M2 | `SplitResolver.split`: participants-required rule disabled (`shares.size() < 0`) | `TransactionTest`, `TransactionEntryPathsIT` | KILLED (`createWithoutParticipantsFails`, `aRefusedEditChangesNothing`) |
| M3 | `RecurringTransactionGenerator`: excepted-date skip removed | `RecurringTransactionGeneratorTest`, `SeriesTopUpJobIT`, `SeriesEditIT` | KILLED (`forwardWindowNeverProducesAnExceptedDate:475`) |
| M4 | `PlanAuthorization`: contributor own-row rule dropped (any owned row allowed) | `PlanAuthorizationTest`, `PlanAuthorizationMatrixIT` | KILLED (`modifyOthersDeniedForContributor`, `modifyQueryPerRoleAndRowOwner[3]`) |
| M5 | `JwtProperties`: minimum key length lowered from 32 to 8 bytes | `ConfigurationPropertiesTest`, `AuthenticationIT` | KILLED (`sixteenByteJwtSecretFailsStartup`) |

**5 injected, 5 killed, 0 survived.** Real tree `git status --porcelain` identical to baseline (empty). Worktree list shows only the main tree.

## Pending user (not failures)

- Production precheck of the V16/V19 migration preconditions against the real database.
- `SERVER_ADDRESS` set to the docker0 gateway on the VPS (compose refuses to start without it); bind check on port 3000 from the public interface.
- Production JWT secret of at least 32 bytes (startup refuses a shorter one).
- Container time zone on the VPS.
- CI run on push (workflow not executed from this session).

## Ranked gaps (none blocks the verdict)

1. BST-19 AC 5 (H9): OWNER invitation role -> 422 is implemented (narrowed enum) but no test sends OWNER to the invitation endpoint. Add a one-case IT.
2. BST-18 AC 6: "reads take no lock" is not asserted; the Hibernate statistics check also misses native or bulk writes. Add a statement/lock assertion or tighten the spec wording.
3. BST-08 AC 10: no test scans problem `detail` for tokens, e-mails or personal data (spec-precision: only the fixed 500 detail is asserted).
4. BST-15 AC 6 and AC 10: "one `PasswordEncoder`" and "no `spring.dotenv.filename`" hold in code but have no test or ArchUnit guard.
5. BST-14 AC 1: the bind address is config-only; no test. Covered by the pending VPS step.
6. BST-18 AC 1: `recurrence_exceptions` is never queried directly; covered only through behaviour (generator and edit tests).
7. BST-16 AC 8: in `CsvImportIT` the description equals the source text, so the IT cannot distinguish the fields; the model test (`TransactionTest.java:216`) does.
8. Frontend `TimeZoneDialog.test.tsx` (BST-11 AC 7) timed out once under load (passed on two re-runs); consider a longer timeout or fewer `userEvent` steps.

Spec-precision note: BST-19 AC 6 ("`PERCENT` not a split mode") does not give a status code; the code answers 400 `malformed-request`.
