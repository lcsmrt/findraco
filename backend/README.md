# findraco Backend

Spring Boot REST API for personal finance management. Built as a learning project to explore backend development with Java.

## Tech Stack

- **Java 25** + **Spring Boot 4.1** — application framework
- **Spring Security** + **JWT** (jjwt) — authentication and authorization
- **Spring Data JPA** + **Hibernate** — data access layer
- **PostgreSQL** — relational database
- **SpringDoc / OpenAPI 3** — API documentation (Swagger UI)
- **Docker** — containerized deployment

> **Schema management:** Flyway migrations in `src/main/resources/db/migration` are the only source of the schema; Hibernate only validates it (`ddl-auto=validate`).

## Features

- JWT-based authentication (login, profile)
- User registration and profile management
- Financial transaction CRUD with filtering, sorting, and pagination
- Transaction categories with spending limits
- Nubank CSV import
- **Recurring & installment transaction series** — register one commitment (bounded start–end) and the API generates the individual monthly transactions; delete the whole series in one call
- Dashboard summary (monthly trends, category breakdown)

## Project Structure

```
src/main/java/com/lcs/findraco/
  auth/ user/ plan/       One package per feature, each with layer sub-packages
  category/ transaction/  (controller, service, repository, model, request, response,
  dashboard/              exception, config)
  shared/                 Cross-cutting: config, error, openapi, security, web, ratelimit
src/main/resources/db/migration/   Flyway migrations
```

The package rules and conventions are in the `backend-structure` skill (`../.claude/skills/`).

## Getting Started

### Prerequisites

- **Java 25** (JDK)
- A reachable **PostgreSQL** database. This project does **not** bundle a local database — point it at your own Postgres instance. The root `docker-compose.yml` builds and runs the **API container** (host networking) for deployment; it does not start a database. The tests need Docker instead (they start their own Postgres).

### Configure environment

The app loads variables from a dotenv file in this directory (or you can export them in your shell). Copy the template and fill it in:

```bash
cp .env.example .env
```

Required variables (see `.env.example`):

```
SPRING_DATASOURCE_URL=jdbc:postgresql://HOST:PORT/DATABASE?ssl=true&sslmode=require
SPRING_DATASOURCE_USERNAME=your_db_user
SPRING_DATASOURCE_PASSWORD=your_db_password
# Base64 text of at least 32 random bytes: openssl rand -base64 48 (the app refuses to start otherwise)
JWT_SECRET_KEY=generate_with__openssl_rand_-base64_48
# Optional: SERVER_PORT (default 3000), SERVER_ADDRESS (default 127.0.0.1), JWT_EXPIRATION_MS (default 900000)
```

### Run locally

```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=local
```

The `local` profile (`application-local.properties`, also what `pnpm dev` uses) echoes SQL and, when
SMTP is not configured, logs the password reset link. Every other profile logs neither.

The API starts on **http://localhost:3000** (configurable via `SERVER_PORT`).

### Local test account

The dev database (`dev_finsight`) has a shared account for manual and visual testing, with a few
categories (some with spending limits) and sample transactions:

| Email                 | Password        | Name      |
| --------------------- | --------------- | --------- |
| `test@findraco.local` | `Findraco#2026` | Test User |

It only exists in the dev database — never create it in production. Password-reset emails in dev are
captured by Mailpit (UI at http://localhost:8025, see `.env.example`), not delivered to a real inbox.

### API documentation

Swagger UI: **http://localhost:3000/swagger-ui.html**

The contract is committed as [`openapi.json`](openapi.json): `OpenApiSnapshotIT` fails with a diff when the
generated `/v3/api-docs` differs from it. A change to a request or response regenerates it in the same commit:

```bash
./mvnw verify -Dit.test=OpenApiSnapshotIT -Dopenapi.update=true
```

Recurring/installment endpoints (base `/api/findraco/financial-transaction`):

- `POST /series` — create a series. Body: `{ type, amount, description, categoryId?, mode: "INSTALLMENT" | "RECURRING", startDate, parcelsNumber?, interval?: "MONTHLY", endDate? }`. `amount` is per occurrence; `INSTALLMENT` needs `parcelsNumber`, `RECURRING` needs `interval` + `endDate`. Returns `{ seriesId, count, occurrences[] }`.
- `DELETE /series/{seriesId}` — delete all occurrences of a series.

### Tests

```bash
./mvnw test                                         # *Test — NOTE: the @SpringBootTest context test needs a reachable DB + env vars
./mvnw test -Dtest=RecurringTransactionGeneratorTest   # pure unit test for series generation — needs NO database
./mvnw verify                                       # adds the *IT integration suite + coverage gate
```

⚠️ The `*IT` suite runs against the database `.env` points at and **truncates every table before each test** — a full `verify` leaves that database empty. It refuses to run against anything outside the `DISPOSABLE_DATABASES` allowlist in `AbstractIntegrationTest`. See [`../.specs/codebase/TESTING.md`](../.specs/codebase/TESTING.md).

## Spec-Driven Development

Planning artifacts (specs, design, tasks, codebase map) live in [`../.specs/`](../.specs). See `../.specs/features/recurring-transactions/` for this feature's spec → design → tasks.

## Frontend

See [findraco Frontend](../frontend) for the React SPA that consumes this API.
