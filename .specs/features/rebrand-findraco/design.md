# Rebrand: finSight → findraco — Design

**Date:** 2026-08-14
**Spec:** `spec.md`
**Status:** Design

---

## Design Decisions

### 1. Rename depth & sequencing

All functional references move from `finSight`/`finsight` to `findraco` in a single pass. A half-renamed stack (new UI hitting `/api/finsight`) is worse than a big bang, and the changes are mechanical.

| Surface | From | To | How |
| ------- | ---- | -- | --- |
| Java base package | `com.lcs.finsight` | `com.lcs.findraco` | Move every `.java` file under `backend/src/main/java/com/lcs/findraco/` and `backend/src/test/java/com/lcs/findraco/`, rewrite imports, update `pom.xml` `<groupId>` / `artifactId` / `name` and JaCoCo includes. Also rename the main class `FinSightApplication` → `FindracoApplication` and `FinSightApplicationTests` → `FindracoApplicationTests` (the case-insensitive grep gate catches these). |
| API route prefix | `/api/finsight` | `/api/findraco` | Change `ApiRoutes.BASE` and the single constant only; controllers compose the rest from it. |
| Frontend API client | `finsightApi` | `findracoApi` | Rename `frontend/src/api/clients/finsightApi.ts` and all 8 importers. |
| Frontend env var | `VITE_FINSIGHT_API_URL` | `VITE_FINDRACO_API_URL` | Update `frontend/.env.development`, root `.env.production.example`, and the client fallback. No frontend `.env.production` exists; `frontend/vite-env.d.ts` declares no `VITE_` vars, so nothing to update there. |
| pnpm package names | `finsight` / `finsight-frontend` / `finsight-backend` | `findraco` / `findraco-frontend` / `findraco-backend` | Root + frontend + backend `package.json`. |
| Docker service/image/container | `finsight-api` / `finsight-web` | `findraco-api` / `findraco-web` | `docker-compose.yml`, `frontend/Dockerfile` (`--filter` flags + comments), deploy docs. |
| `spring.application.name` | `finsight` | `findraco` | `application.properties`. |
| User-visible strings | "finSight" | "findraco" | `<title>`, login/register copy, navbar, toasts, alt texts, READMEs, AGENTS.md, CLAUDE.md. |

**Historical `.specs/features/*` and `.specs/codebase/*` stay untouched** per spec. References to the real database names (`finsight`, `dev_finsight`) in test-config comments also stay — the databases themselves are out of scope.

### 2. Theme: gold hoard, light + dark

The app currently ships one hard-coded dark theme (the dark palette sits on `:root`; there is no `.dark` block). We move the new dark palette behind a `.dark` class so `dark:` Tailwind variants flip automatically, and the no-class `:root` tokens become the new light theme. The default theme on first visit is `system` (`prefers-color-scheme`), not light.

#### Token architecture

CSS custom properties are defined on `:root` (light) and `.dark` (dark). Tailwind v4's `@theme inline` already maps `--color-*` to those variables, so no utility class changes are needed beyond adding `.dark` to `<html>`. The blocks below must include **all** tokens the current `index.css` defines — notably `--popover`/`--popover-foreground`, which are mapped in `@theme inline` and break popovers if dropped. Fonts, radius, and shadow variables stay as-is on `:root`.

```css
:root {
  --background: #fdf6e3;            /* parchment */
  --foreground: #1f1b14;            /* near-black ink */
  --card: #fff8e7;
  --card-foreground: #1f1b14;
  --popover: #fff8e7;
  --popover-foreground: #1f1b14;
  --primary: #b45309;               /* amber-700 gold */
  --primary-foreground: #fffbeb;    /* amber-50 */
  --secondary: #e7d5b0;
  --secondary-foreground: #451a03;
  --muted: #f3e9d0;
  --muted-foreground: #78716c;
  --accent: #d97706;
  --accent-foreground: #fffbeb;
  --destructive: #dc2626;
  --destructive-foreground: #fef2f2;
  --success: #16a34a;
  --success-foreground: #f0fdf4;
  --border: #d6c6a8;
  --input: #d6c6a8;
  --ring: #b45309;
  --sidebar: #fff8e7;
  --sidebar-foreground: #1f1b14;
  --sidebar-primary: #b45309;
  --sidebar-primary-foreground: #fffbeb;
  --sidebar-accent: #f3e9d0;
  --sidebar-accent-foreground: #451a03;
  --sidebar-border: #d6c6a8;
  --sidebar-ring: #b45309;
}

.dark {
  --background: #0f172a;            /* deep charcoal-navy */
  --foreground: #f8fafc;
  --card: #1e293b;
  --card-foreground: #f8fafc;
  --popover: #1e293b;
  --popover-foreground: #f8fafc;
  --primary: #f59e0b;               /* amber-500 */
  --primary-foreground: #1f1b14;
  --secondary: #334155;
  --secondary-foreground: #f8fafc;
  --muted: #1e293b;
  --muted-foreground: #94a3b8;
  --accent: #fbbf24;
  --accent-foreground: #1f1b14;
  --destructive: #ef4444;
  --destructive-foreground: #fef2f2;
  --success: #22c55e;
  --success-foreground: #052e16;
  --border: #334155;
  --input: #334155;
  --ring: #f59e0b;
  --sidebar: #0f172a;
  --sidebar-foreground: #f8fafc;
  --sidebar-primary: #f59e0b;
  --sidebar-primary-foreground: #1f1b14;
  --sidebar-accent: #1e293b;
  --sidebar-accent-foreground: #f8fafc;
  --sidebar-border: #334155;
  --sidebar-ring: #f59e0b;
}
```

Charts keep the existing `--chart-1..5` variables; values are updated to gold/amber tones that read well in both modes.

#### Theme toggle

- A `ThemeProvider` wraps the app. It reads `localStorage` (`findraco-theme: light | dark | system`), falls back to `prefers-color-scheme`, and toggles `.dark` on `<html>`.
- An inline `<script>` in `frontend/index.html` resolves the stored/system theme and applies `.dark` **before first paint** — without it, dark-preference users get a light flash before React mounts.
- A theme button goes in the navbar (sun/moon icon).
- Default on first visit: `system`.

### 3. Logo, favicon, and 404

#### Logo: user-provided image, no wordmark

The logo is a user-provided image — a dragon wing curled around a gold coin — already copied to `frontend/public/findraco-logo.png` (1024×1024, transparent-background PNG, reads on both parchment and charcoal-navy). The image is the whole mark: there is no stylized "findraco" text logo. Any brand text next to it is plain body-font text, not artwork.

- `frontend/public/findraco-logo.png` — the logo, used in navbar, login, and register.
- `frontend/public/favicon.ico` — generated from the logo image.
- `frontend/public/apple-touch-icon.png` — generated from the logo image.
- The 426 KB source is heavy for a navbar; a downscaled web-size copy may be generated at the agent's discretion.

#### Deletions

- `frontend/public/favicon.ico` (current misnamed PNG)
- `frontend/public/finsigh-icon.png` (typo'd filename)
- `frontend/public/findraco-wordmark.svg` and `frontend/public/findraco-icon.svg` (agent-drawn drafts that predate the image decision)
- `frontend/public/assets/bingus.webp`
- `frontend/public/assets/happy-cat-happy-happy-happy.gif`

#### 404

Replace the Bingus 404 with a plain themed 404 page: a centered icon (may reuse the logo image) + "Page not found" + link home.

### 4. Component impact

- **Navbar**: swap logo image, add theme toggle button.
- **Login / Register**: swap logo image, remove cat GIF.
- **Charts (recharts)**: use CSS variable-aware colors; no hard-coded crimson.
- **All components**: existing `dark:` classes (~50 across 17 files) already flip automatically once `.dark` is present. We audit for any hard-coded colors outside the token system.

### 5. Build & deploy

- No schema migration needed.
- nginx in `frontend/nginx.conf` proxies `location /api/` wholesale — the `/api/finsight` prefix appears only in a comment. Update the comment; no path change is needed. Old cached bundles calling `/api/finsight` are forwarded and 404 at the API, which no longer serves that prefix.
- Deploy checklist: update Portainer env `VITE_FINDRACO_API_URL`; a full stack deploy is required (frontend and API ship the prefix change together).

---

## Risk Mitigation

| Risk | Mitigation |
| ---- | ---------- |
| Java package rename breaks imports | Single mechanical move; `./mvnw compile` catches every missed reference. |
| Frontend env var rename breaks deploy | Client keeps its `?? "/api/findraco"` same-origin fallback (spec-mandated), so the nginx-served production build is unaffected; the var only matters in dev. `frontend/.env.development` and root `.env.production.example` updated. |
| Cached frontend bundle calls old `/api/finsight` | Acceptable per spec; deploy ships both layers together. The API 404s the old prefix. |
| Light theme unreadable | Manual UAT on every page before marking done. |
| Wrong-theme flash on load (FOUC) | Inline theme-resolution script in `index.html` before the bundle loads. |
| Dropped tokens break components | Both token blocks must cover every variable `@theme inline` maps (popover included); visual UAT catches stragglers. |

---

## Verification

- `grep -ri "finsight" --exclude-dir={.git,node_modules,target,dist,.specs} .` returns nothing except documented DB-name references (`dev_finsight` in test-config comments).
- `cd backend && ./mvnw test` green.
- `cd frontend && pnpm build && pnpm test` green.
- Manual UAT: login, dashboard, transactions, categories in both light and dark modes; verify logo + favicon + 404.
