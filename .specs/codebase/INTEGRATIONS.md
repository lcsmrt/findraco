# External Integrations

**Analyzed:** 2026-07-05
**Updated:** 2026-10-30 (backend-standards BST-21)

## Database

**Service:** PostgreSQL 16.
**Purpose:** Primary persistence for users, plans, categories, transactions and series, sessions and reset tokens.
**Implementation:** Spring Data JPA / Hibernate over the PostgreSQL driver; the datasource comes from `SPRING_DATASOURCE_*` in `backend/src/main/resources/application.properties`.
**Schema management:** Flyway migrations in `backend/src/main/resources/db/migration` are the only source of the schema; Hibernate runs with `ddl-auto=validate`. The migration rules are in the `backend-structure` skill.
**Provisioning:** the root `docker-compose.yml` runs the API (`network_mode: host`) and the web container; the database is a separate instance reachable on the VPS's localhost. Tests start their own disposable Postgres (Testcontainers); see `TESTING.md`.
**Configuration:** environment variables only (`SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`). Local runs read `backend/.env`; production reads the Portainer stack environment.

## Authentication (JWT and sessions)

**Service:** JSON Web Tokens via `io.jsonwebtoken` (jjwt: `jjwt-api`, `jjwt-impl`, `jjwt-jackson`, one version property in `backend/pom.xml`), layered on Spring Security.
**Purpose:** Stateless auth for the REST API (15-minute access token) with a renewable cookie session behind it.
**Implementation:** `JwtAuthenticationFilter` and `SecurityConfig` in the `auth` feature; controllers receive `@CurrentUser AuthenticatedUser` or a `PlanContext`.
**Configuration:** `app.jwt.*` (`JWT_SECRET_KEY` Base64, at least 32 decoded bytes or the app does not start; `JWT_EXPIRATION_MS`). Details in `ARCHITECTURE.md` and the `backend-structure` skill.

## API Integrations

### CSV import (inbound external data)

**Purpose:** Ingests a transaction history exported from a bank as a CSV file. This is a manual file upload, not a live bank API.
**Location:** `POST /api/findraco/plan/{planId}/transaction/import` (`TransactionController`), `transaction/service/TransactionImportService`, and the parsers behind `StatementParser` in `transaction/importer` (chosen by a registry from the file header).
**Behaviour:** `multipart/form-data`, field `file`; strict UTF-8; the format is recognised by its header (an unknown one is `csv-unknown-format`, a known unsupported one `csv-format-not-supported`); file size, row count and listed errors are bounded by `app.import.*`; all or nothing (any bad row rejects the file with the lines listed); each row becomes a transaction through the aggregate's own creation method; a row already stored (same source reference) is skipped; the response says `{ imported, skippedDuplicates }`. Imports of one plan run one after the other (advisory lock) and are rate limited per user.
**Authentication:** a valid JWT and a role allowed to create transactions.

### E-mail (SMTP)

**Purpose:** Sends the password reset link.
**Implementation:** `auth/service/EmailService` on a dedicated executor (`app.mail.executor.*`), so the reset request answers at once whether or not the account exists. SMTP is optional: without `SMTP_HOST` nothing is sent (a local run logs the link; any other run does not).
**Configuration:** `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`, `APP_URL`.

### API documentation (springdoc / OpenAPI)

**Purpose:** The API contract and interactive docs.
**Implementation:** springdoc-openapi, shaped by the customizers in `shared/openapi`. The committed `backend/openapi.json` is compared with the generated schema by `OpenApiSnapshotIT`; the frontend types follow it.
**URL:** `http://<host>:3000/swagger-ui.html`. The API listens on `server.address` (localhost by default, the docker0 gateway in production), so Swagger is not on a public address.

### Frontend → Backend HTTP client

**Purpose:** The React SPA consumes the Spring Boot REST API.
**Location:** `frontend/src/api/clients/findracoApi.ts`, an Axios instance with `baseURL: import.meta.env.VITE_FINDRACO_API_URL ?? "/api/findraco"`; only development sets the variable, and production uses the same-origin fallback proxied by the nginx container.
**Authentication:** a request interceptor injects `Authorization: Bearer <token>` from the in-memory store; a response interceptor renews the session on a `401` and retries once (see `ARCHITECTURE.md`). The client also sends the `Time-Zone` header.
**Data layer:** TanStack Query service hooks in `frontend/src/api/services` wrap the client; components never call Axios directly.
**CORS:** allowed origins come from `ALLOWED_ORIGINS` (`app.cors`).

## Deployment / CI

### CI and deploy (GitHub Actions)

**Location:** `.github/workflows/ci.yml`.
**Flow:** a push runs the jobs of the apps it changed (frontend lint, build, tests; backend `./mvnw -B verify`); a push to `main` that passes redeploys the Portainer stack through its API. Nothing deploys without passing the gates. Steps done by hand on the VPS are in `DEPLOY.md`.

### Containers

**Location:** `backend/Dockerfile` (multi-stage: `maven:3.9-eclipse-temurin-25` build, `eclipse-temurin:25-jre-alpine` runtime; dependencies resolve in their own layer before `src`), `frontend/Dockerfile` (nginx serving the SPA and proxying `/api`), and the root `docker-compose.yml`, which injects the environment.

## Not Present

No message queue, no third-party payment or notification providers and no live banking or aggregation API. The only background work is the in-process daily series top-up job (`app.series.top-up-cron`) and the mail executor.
