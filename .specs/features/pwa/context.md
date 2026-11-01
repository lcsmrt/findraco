# PWA Context

**Gathered:** 2026-11-01
**Spec:** `.specs/features/pwa/spec.md`
**Status:** Ready for design

---

## Feature Boundary

Make findraco installable (manifest, icons, standalone look) with a service worker that precaches the app shell only, plus the update path that worker requires: a dismissible update notice, a recovery point in the avatar menu, and a blocking update below a committed minimum version. Frontend build, frontend code and nginx only.

---

## Implementation Decisions

### 1. What the service worker does

- Precache the app shell (HTML, JS, CSS, icons, font). `/api/*` is never cached.
- Offline cold start renders the app; the existing `unreachable` screen covers a session that cannot be resumed.
- Offline read (C) explicitly deferred to its own feature.

### 2. How a new release arrives

- The new worker waits; the user decides when to switch (prompt, not auto-reload), so a form is never wiped mid-typing.
- Ignored notice → the new version runs on the next cold start.

### 3. Urgent update

- Minimum supported version, published per build in `version.json` (outside the precache, `no-cache` in nginx).
- Below the minimum → blocking dialog, one "Update" action, no dismissal.
- Copy is neutral: "Update required" / "A new version of findraco is needed to continue." Never mention security to the user; the reason lives in the commit and `DEPLOY.md`.
- Must ship in the first worker release: an installed app that cannot read the minimum can never be forced.

### 4. Where the normal notice lives

- Toast (same `sonner` toaster), "Update" + close, not auto-dismissed, shown once per waiting version.
- Recovery after closing it: "Update to <version>" item in the avatar menu, above the version line, plus a primary-colour dot on the avatar while an update waits (user asked for a way back after closing by accident).
- Fix toasts on mobile to sit above the bottom bar (applies to all toasts).

### 5. Install discovery

- "Install app" item in the avatar menu: native prompt where `beforeinstallprompt` fired; two-step instructions dialog on iOS; hidden when standalone or not installable.
- No proactive banner.

### 6. Standalone appearance

- Status bar follows the resolved theme (`theme-color` synced; iOS `black-translucent` + navbar `safe-area-inset-top`).
- Defaults accepted: name/short name "findraco", `start_url` `/`, `display: standalone`, orientation unlocked, icons 192/512/maskable from the 1024 px logo, Android splash from the manifest, no iOS splash images.

### Agent's Discretion

- Tooling: `vite-plugin-pwa` (Workbox) is the expected route; confirm in Design (Knowledge Verification Chain).
- Version check cadence (start-up, foreground, 60 min), fail-open on `version.json` errors, semver ordering, per-device "dismissed" memory, where `minSupported` is committed.

### Declined / Undiscussed Gray Areas → Assumptions

- Version check cadence, fail-open behaviour, version ordering, `minSupported` location, notice on auth screens, dismissal memory per device, iOS non-Safari instructions, emergency self-destroying worker: all logged in the spec's Assumptions table; confirmed by the user 2026-11-01.

---

## Specific References

- User does not know PWAs yet: explanations of service worker lifecycle given in chat (2026-11-01); keep `DEPLOY.md` additions explanatory.
- The avatar menu already shows `v<version> - <date>` (`NavbarView.tsx`); the update item sits next to it.

---

## Deferred Ideas

- Offline read and queued writes (ROADMAP M5-07 "later").
- Push notifications.
- Proactive install invitation, if nobody finds the menu item.
