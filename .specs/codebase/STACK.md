# Tech Stack

**Analyzed:** 2026-07-05
**Updated:** 2026-10-30 (backend-standards BST-21)

Monorepo at `/home/lcs/dev/finsight` with two independent apps: `backend` (Spring Boot REST API) and `frontend` (React SPA). Single git repo at the root since 2026-07-25, carrying both apps' histories; they deploy as one Docker stack (see `DEPLOY.md`).

## Core

- Framework: Spring Boot 4.1.2 (backend) + React 19 (frontend)
- Language: Java 25 (backend), TypeScript ~5.7 (frontend)
- Runtime: JVM 25 (backend), Node/Vite 6 (frontend)
- Package manager: Maven wrapper (backend), pnpm (frontend, workspace at the root)


## Frontend

- UI Framework: React 19 + react-router-dom 7.6 (SPA)
- Build: Vite 6 (`@vitejs/plugin-react`)
- Styling: Tailwind CSS v4.1 via `@tailwindcss/vite` (no `tailwind.config`; CSS in `src/styles/globals.css`), `class-variance-authority`, `tailwind-merge`, `tw-animate-css`
- Component system: shadcn/ui (new-york style; primitives under `src/components/<name>/`, not `components/ui`), `@base-ui/react` 1.3, `lucide-react` 0.487 icons
- Data/State: `@tanstack/react-query` 5.72 (server state), React Context (global auth state), `@tanstack/react-table` 8.21
- Data fetching: axios 1.8
- Charts: recharts 2.15
- Form Handling: react-hook-form 7.55 + zod 3.24 (`@hookform/resolvers` 5)
- Dates: date-fns 4.1; Toasts: sonner 2.0

## Backend

- API style: REST via Spring Web (`@RestController`); base path `/api/findraco`; the contract is the committed `backend/openapi.json`
- Database: PostgreSQL 16 via Spring Data JPA / Hibernate 7, `ddl-auto=validate`; schema owned by Flyway migrations (`src/main/resources/db/migration`); `globally_quoted_identifiers=true`, snake_case naming
- Authentication: Spring Security 7 + JWT bearer tokens (jjwt, one version property) + an opaque cookie session; Argon2id passwords (BouncyCastle) with BCrypt verified for old hashes
- Validation: Spring Validation (`spring-boot-starter-validation`); errors as RFC 9457 problem+json
- Rate limiting: Bucket4j in memory
- CSV: Apache Commons CSV
- API docs: springdoc-openapi (Swagger UI at `/swagger-ui.html`)
- Configuration: `app.*` `@ConfigurationProperties` records; `spring.config.import=optional:file:.env[.properties]` (reads `backend/.env` locally; production uses real environment variables)
- Server port: 3000 (not the Spring default 8080)
- Build checks (run by `./mvnw verify`): Spotless (palantir-java-format), `-Xlint:all` with `failOnWarning`, Error Prone, maven-enforcer (Java 25, no Lombok or MapStruct), ArchUnit (`ArchitectureTest`), JaCoCo branch gate on the invariant classes

## Testing

- Backend unit (`*Test`) and integration (`*IT`): JUnit 5 + AssertJ via `spring-boot-starter-test`, Testcontainers Postgres, Awaitility, ArchUnit; no Mockito in tests (see `TESTING.md`)
- Frontend Unit/Component: Vitest 3 + Storybook 9 (`@storybook/addon-vitest`, `@vitest/browser`, `@vitest/coverage-v8`)
- Frontend E2E: Playwright 1.55 (available via Vitest browser runner)

## External Services

- Database: PostgreSQL on the VPS; tests use a disposable container
- Optional SMTP for password reset; no third-party API integrations, message queues, or payment providers

## Development Tools

- Backend: `spring-boot-devtools`, Maven wrapper (`mvnw`), Dockerfile; the root `docker-compose.yml`
- Frontend: ESLint 9 (`typescript-eslint`, `eslint-plugin-check-file`, `eslint-plugin-import`, react-hooks/react-refresh/storybook plugins), Prettier 3 (+ `prettier-plugin-tailwindcss`), Husky 9 git hooks
- No Lombok, no MapStruct on the backend (DTOs are records mapped by `from(entity)`)

## Backend Configuration (`.env`)

`SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`, `JWT_SECRET_KEY`, `ALLOWED_ORIGINS`, `APP_URL`, `SERVER_ADDRESS` and the optional `SMTP_*`; the full list with defaults is `backend/.env.example` and `application.properties`. Frontend needs no variables in production (the axios base URL defaults to the same-origin `/api/findraco`); `VITE_FINDRACO_API_URL` overrides it for the dev server.
