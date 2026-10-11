# Rebrand findraco Context

**Gathered:** 2026-08-01
**Spec:** `.specs/features/rebrand-findraco/spec.md`
**Status:** Ready for design

---

## Feature Boundary

Rename finSight → findraco across all functional surfaces, remake the theme (light + dark)
around a gold-hoard dragon identity, and replace the logo with a user-provided
dragon-wing-and-coin image (no text wordmark). Historical `.specs` docs, the DB, and the
Portainer stack are explicitly out of scope.

---

## Implementation Decisions

### Rename depth

- **Full functional rename**: UI strings, `<title>`, Java package `com.lcs.finsight` →
  `com.lcs.findraco`, API prefix `/api/finsight` → `/api/findraco`, pnpm package names
  (`findraco`, `findraco-frontend`, `findraco-backend`), Docker services/images/containers
  (`findraco-api`, `findraco-web`), env var prefix `VITE_FINSIGHT_API_URL` →
  `VITE_FINDRACO_API_URL`, living docs (READMEs, AGENTS.md, CLAUDE.md, `.specs/project/*`).
- Historical `.specs/features/*` + `.specs/codebase/*` stay untouched.
- axios client `finsightApi` → `findracoApi` (mechanical rename across ~8 importers).
- Misnamed `finsigh-icon.png` disappears with the old logo.

### Theme direction: Gold hoard

- **Dark**: amber/gold primary on deep charcoal-navy background (treasure-pile vibe).
- **Light**: warm parchment background with the same gold identity.
- Class strategy (`.dark`) — `dark:` variants already half-wired in components.
- Theme toggle in the navbar; `prefers-color-scheme` default; localStorage persistence.

### Logo: user-provided image, no wordmark

- Dragon wing curled around a gold coin, transparent-background PNG — provided by the user,
  copied to `frontend/public/findraco-logo.png`. The image is the whole mark; there is no
  stylized "findraco" text logo.
- Transparent background reads on both parchment and charcoal-navy themes.
- Favicon: proper generated icon set from the logo image.
- Supersedes the earlier agent-drawn SVG decision (those draft SVGs are deleted).

### 404 and easter eggs

- **Plain 404**: themed, no mascot gag. Bingus (`bingus.webp`) removed from the 404 page;
  unused `happy-cat-happy-happy-happy.gif` deleted.

### Agent's Discretion

- Exact oklch token values for both palettes (within the gold-hoard direction).
- Favicon generation tooling and sizes; optional downscaled web-size copy of the logo PNG.
- Whether plain-text "findraco" (body font, not artwork) sits next to the icon in the navbar.
- Toggle UI details (icon choice, placement within navbar).

---

## Specific References

- Brand metaphor: dragon "hoarding" — users hoard and guard their treasure (money).
- Name: **findraco** — lowercase in prose and any plain-text brand mentions.

---

## Deferred Ideas

- Real commissioned dragon mascot artwork (could replace the current logo image later).
- Renaming the local repo dir / GitHub repo — user's manual step.
- Portainer env var rename (`VITE_FINDRACO_API_URL`) — deploy-time checklist item.
