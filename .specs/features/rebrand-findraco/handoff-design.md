# Handoff — Rebrand visual design iteration

**Date:** 2026-10-11
**Feature:** Rebrand finSight → findraco (`.specs/features/rebrand-findraco/`)
**Status:** Functional rename DONE and deployed; **visual design IN PROGRESS** — the user finds the
current look rough ("still pretty ugly"), is validating it, and wants to iterate on it.

## Completed ✓

- T1–T12 of `tasks.md`: full functional rename (package `com.lcs.findraco`, API `/api/findraco`,
  `VITE_FINDRACO_API_URL`, compose `findraco-*`), gold-hoard light + dark theme with navbar toggle,
  dragon-wing-and-coin logo + favicon, plain themed 404.
- First prod deploy 2026-10-11 (`91f3911` on `main`) at http://72.60.1.97:8094; Portainer stack
  recreated as `findraco` (id 74); `deploy.yml` redeploys on every push to `main`.

## In Progress

- Visual polish. **No specific complaints captured yet** — the first step of the new session is to ask
  the user what bothers them (palette/contrast, specific screens, components, identity/typography),
  or to screenshot every screen in both themes and build a critique list for them to prioritize.

## Where the design lives

- Tokens: `frontend/src/index.css` — `@theme inline` (l.3), light `:root` (l.58: parchment
  `--background #fdf6e3`, `--primary #b45309`), dark `.dark` (l.117: `--background #0f172a`,
  `--primary #f59e0b`). Rationale: `design.md` §2 "Theme: gold hoard, light + dark".
- Theme switching: `frontend/src/app/providers/ThemeProvider.tsx`; toggle in
  `frontend/src/components/navbar/Navbar.tsx`; pre-paint script in `frontend/index.html`.
- Logo/assets: `frontend/public/findraco-logo*.png`, `favicon.ico`, `apple-touch-icon.png`; auth
  pages (`features/login`, `features/registerUser`, `features/forgotPassword`, `features/resetPassword`)
  share a header + dotted/glow background from `components/layout/AuthLayout.tsx`.
- Shared components: `frontend/src/components/*` (shadcn-based — don't modify primitives, per CLAUDE.md);
  Storybook available (`pnpm storybook`, port 6006) for isolated component review.

## Rules to respect

- English only in code/UI/specs (CLAUDE.md). Frontend conventions in `CLAUDE.md` + skills
  `/component-creation`, `/feature-structure`.
- Every push to `main` deploys to prod — work on a branch (e.g. `feat/rebrand-design`) and merge only
  when the user approves.
- Base UI: build-green ≠ runtime-correct (STATE.md L-002) — check changes in a real browser.

## Running locally

- Front: `cd frontend && pnpm dev` → http://localhost:5173 (may already be running in a terminal window).
- Back: `cd backend && pnpm dev` → :3000; needs the DB tunnel `ssh -N -L 5432:localhost:5432 vps`
  (the user runs it; the agent's auto mode blocked it). Without it, logged-in screens have no data.
- Mailpit for local emails: http://localhost:8025 (Docker Desktop: `systemctl --user start docker-desktop`).

## Unrelated open items (don't mix in)

- Rotate the prod `dev` DB password after the user talks to Iuri (STATE.md Todos).
- `PasswordRecoveryIT` written but never run.
