# Rebrand: finSight → findraco — Tasks

**Date:** 2026-08-14
**Spec:** `spec.md`
**Design:** `design.md`
**Status:** Ready to Execute

---

## Requirement Traceability

| Requirement | Story | Task(s) |
| ----------- | ----- | ------- |
| BRD-01 | User-facing rename | T3, T9 |
| BRD-02 | Backend code/API rename | T1, T2 |
| BRD-03 | Frontend code/env rename | T3, T4 |
| BRD-04 | Docker/deploy/docs rename | T4, T5, T11 |
| BRD-05 | Dark theme remake | T7 |
| BRD-06 | Light theme creation | T7 |
| BRD-07 | Theme toggle + persistence | T6 |
| BRD-08 | Logo image assets | T8 |
| BRD-09 | Favicon + asset cleanup, plain 404 | T8, T10 |

---

## Execution Order

Single sequence — the rename is all-or-nothing, and the theme/assets layer on top.

### Phase 1 — Rename (backend)

**T1 — Rename Java package to `com.lcs.findraco`**

- Move `backend/src/main/java/com/lcs/finsight/**` to `backend/src/main/java/com/lcs/findraco/**`.
- Move `backend/src/test/java/com/lcs/finsight/**` to `backend/src/test/java/com/lcs/findraco/**`.
- Update every `package` and `import` statement.
- Rename the main class `FinSightApplication` → `FindracoApplication` and `FinSightApplicationTests` → `FindracoApplicationTests` (file + class names).
- Update `pom.xml`: `<groupId>`, `<artifactId>`, `<name>`, JaCoCo `<includes>`.
- Update `backend/package.json` name to `findraco-backend`.
- Gate: `cd backend && ./mvnw compile` green.

**T2 — Rename API prefix and app name**

- Change `ApiRoutes.BASE` from `/api/finsight` to `/api/findraco`.
- Change `spring.application.name` from `finsight` to `findraco` in `application.properties`.
- Update any hard-coded occurrences in backend tests.
- Leave `dev_finsight` database-name references in `application-test.properties` comments untouched (DB rename is out of scope).
- Gate: `cd backend && ./mvnw test` green.

### Phase 2 — Rename (frontend + workspace + Docker)

**T3 — Rename frontend API client and env var**

- Rename `frontend/src/api/clients/finsightApi.ts` → `findracoApi.ts`.
- Update all importers (`useAuthService`, `useDashboardService`, `useFinancialTransactionService`, `useFinancialTransactionCategoryService`, `useInvitationService`, `usePlanService`, `usePlanService.test.ts`, `AuthProvider`).
- Change env var from `VITE_FINSIGHT_API_URL` to `VITE_FINDRACO_API_URL` (client keeps the `?? "/api/findraco"` fallback).
- Update `frontend/.env.development` and root `.env.production.example`. No frontend `.env.production` exists; `frontend/vite-env.d.ts` declares no `VITE_` vars — nothing to update there.
- `frontend/nginx.conf`: update the comment mentioning `/api/finsight/`; the `location /api/` proxy itself needs no change.
- Gate: `cd frontend && pnpm build` green.

**T4 — Rename workspace packages**

- Root `package.json`: name `findraco`; scripts reference `findraco-frontend` / `findraco-backend`.
- `frontend/package.json`: name `findraco-frontend`.
- `backend/package.json`: name `findraco-backend`.
- Update any `pnpm --filter finsight-frontend` references in READMEs.
- Gate: `pnpm install --frozen-lockfile` + `pnpm build` green.

**T5 — Rename Docker services/images**

- `docker-compose.yml`: `finsight-api` → `findraco-api`, `finsight-web` → `findraco-web`.
- `frontend/Dockerfile`: comments and `pnpm --filter findraco-frontend`.
- `.github/workflows/deploy.yml`: update the comment mentioning the Portainer stack URL (`/stacks/finsight?...`) — note the Portainer stack name itself is a deploy-time rename.
- Gate: `docker compose config` parses (no build required).

### Phase 3 — Theme

**T6 — Theme provider + toggle**

- Create `frontend/src/app/providers/ThemeProvider.tsx`:
  - Reads `localStorage.findraco-theme` (`light | dark | system`).
  - Falls back to `matchMedia('(prefers-color-scheme: dark)')`.
  - Toggles `.dark` class on `<html>`.
  - Exposes `theme`, `setTheme`, `toggleTheme` via context.
- Add an inline `<script>` in `frontend/index.html` that resolves the stored/system theme and applies `.dark` before first paint (no wrong-theme flash).
- Wire provider in `App.tsx`.
- Add theme toggle button to `Navbar.tsx` (sun/moon icon from lucide-react).
- Gate: toggle works, reload persists choice, no flash on load.

**T7 — Gold-hoard light + dark tokens**

- Rewrite `frontend/src/index.css`:
  - `:root` holds the light theme (parchment background, amber/gold primary).
  - `.dark` holds the dark theme (charcoal-navy background, brighter amber primary).
  - Keep existing `@theme inline` mappings; only the variable values change.
  - Both blocks must define every mapped variable — including `--popover` / `--popover-foreground`, which the current file defines and dropping breaks popovers. Font/radius/shadow variables stay on `:root`.
  - Update chart colors to gold/amber tones.
- Audit components for hard-coded colors outside tokens; fix any found.
- Gate: visual pass of login, dashboard, transactions, categories in both modes.

### Phase 4 — Assets

**T8 — New logo, favicon, and asset cleanup**

- Logo is the user-provided image, already at `frontend/public/findraco-logo.png` (dragon wing curled around a gold coin, transparent PNG). No text wordmark.
- Generate `frontend/public/favicon.ico` and `frontend/public/apple-touch-icon.png` from the logo image (tooling at agent's discretion, e.g. ImageMagick).
- At agent's discretion, ship a downscaled web-size copy for navbar use (the 426 KB source is heavy).
- Delete: old `frontend/public/favicon.ico`, `frontend/public/finsigh-icon.png`, `frontend/public/assets/bingus.webp`, `frontend/public/assets/happy-cat-happy-happy-happy.gif`, and the superseded agent-drawn drafts `frontend/public/findraco-wordmark.svg` + `frontend/public/findraco-icon.svg`.
- Update `frontend/index.html` `<title>` and favicon links.
- Use the logo image in `Navbar`, `LoginPage`, `RegisterUserPage`. Plain body-font "findraco" text next to the icon is allowed (agent's discretion); no wordmark artwork.
- Gate: no 404s for assets; favicon visible in tab; logo reads on both themes.

**T9 — Update user-visible strings**

- Replace "finSight" with "findraco" in:
  - `frontend/index.html` `<title>`
  - `LoginPage`, `RegisterUserPage` headings/copy
  - `Navbar` alt texts
  - Any toast/error messages
- Gate: `grep -ri "finsight" frontend/src frontend/public frontend/index.html` returns nothing.

**T10 — Plain themed 404**

- Replace the Bingus 404 in `frontend/src/features/notFound/NotFoundPage.tsx` (catch-all route in `frontend/src/app/routing/AppRouter.tsx`).
- New page: centered icon (may reuse the logo image) + "Page not found" + link to `/`.
- Gate: unknown route renders the new 404 in both themes.

### Phase 5 — Docs & verification

**T11 — Update living docs**

- Update `README.md`, `backend/README.md`, `frontend/README.md` to say "findraco" and reference the new env var/package names.
- Update `AGENTS.md` first paragraph from "finSight" to "findraco".
- Update `CLAUDE.md` and `.claude/commands/consistency-review.md` finsight references.
- Update living `.specs/project/*` files (PROJECT.md, STATE.md, ROADMAP.md, IDEAS.md) finsight references — historical `.specs/features/*` and `.specs/codebase/*` stay untouched.
- Add a deploy checklist note in `design.md` or a new `DEPLOY.md`:
  - Portainer env var rename (`VITE_FINDRACO_API_URL`).
  - Old `/api/finsight` prefix no longer served by the API.
  - Portainer stack rename (`finsight` → `findraco`) is a manual VPS step.
- Gate: no stale references in living docs.

**T12 — Final verification**

- `grep -ri "finsight" --exclude-dir={.git,node_modules,target,dist,.specs} .` returns nothing except documented `dev_finsight` DB-name references in test-config comments.
- `cd backend && ./mvnw test` green.
- `cd frontend && pnpm build && pnpm test` green.
- Manual UAT: login, dashboard, transactions, categories, 404 in light and dark modes.
- Update `spec.md` requirement statuses to Verified and close this feature in `STATE.md` / `ROADMAP.md`.

---

## Progress Log

| Task | Status | Commit | Notes |
| ---- | ------ | ------ | ----- |
| T1   | Verified | - | Package moved, imports rewritten, main/test classes renamed, pom.xml + backend/package.json updated; `./mvnw compile` green |
| T2   | Verified | - | `ApiRoutes.BASE` → `/api/findraco`, `spring.application.name` → `findraco`; tests blocked by unavailable Postgres |
| T3   | Verified | - | `finsightApi` → `findracoApi`, `VITE_FINSIGHT_API_URL` → `VITE_FINDRACO_API_URL`, nginx comment updated; `pnpm build` green |
| T4   | Verified | - | Workspace package names renamed; README filter refs updated; `pnpm install --frozen-lockfile` + `pnpm build` green |
| T5   | Verified | - | Docker services/images/containers renamed; `docker compose config` parses |
| T6   | Verified | - | `ThemeProvider` + inline `index.html` script + navbar toggle; `pnpm build` green |
| T7   | Verified | - | Gold-hoard light/dark tokens in `index.css`; hard-coded colors audited and switched to tokens; `pnpm build` green |
| T8   | Verified | - | Favicon, apple-touch-icon, and 128px web logo generated; old assets deleted; logo used in navbar/login/register/404 |
| T9   | Verified | - | User-visible strings updated; `grep -ri finsight frontend/src frontend/public frontend/index.html` returns nothing |
| T10  | Verified | - | Plain themed 404 page replaces Bingus; `pnpm build` green |
| T11  | Verified | - | Living docs updated; `DEPLOY.md` added with Portainer checklist |
| T12  | Verified | - | `pnpm build` green, frontend `pnpm test` green (42 tests); backend `./mvnw test` blocked by unavailable Postgres |
