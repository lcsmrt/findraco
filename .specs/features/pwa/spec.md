# PWA (Installable) Specification

## Problem Statement

findraco is used daily on the phone, but only as a browser tab: no home-screen icon, the browser chrome eats the screen, and a cold start without network shows the browser's error page. ROADMAP M5-07 is the last open item of 1.0 criterion 1 ("daily use on the phone without friction"). Making the app installable adds a service worker, and a service worker brings its own risk: a device can keep running an old bundle after a deploy, so the update path has to be right in the first release.

## Goals

- [ ] The app installs to the home screen on Android, iOS and desktop Chrome/Edge and opens full screen, without browser chrome.
- [ ] An installed app opens to its own UI with no network, never to the browser's error page.
- [ ] Every device reaches a new release: a normal one through a dismissible notice that can be recovered from the avatar menu, and one below the minimum supported version through a blocking update.

## Out of Scope

| Feature | Reason |
| ------- | ------ |
| Offline read (caching API responses on the device) | ROADMAP defers it; financial data stored on the device needs its own feature (plan switch, sign-out, invalidation) |
| Queued offline writes | Same as above; separate feature |
| Push notifications | ROADMAP defers it |
| Proactive install invitation (banner or toast on first visit) | User chose the menu item only (decision 5); can be added later if nobody finds it |
| iOS splash screens | Needs one image per screen size; Android generates its own from the manifest |
| Backend changes | Everything is frontend build, frontend code and nginx config |
| Offline state UI beyond what exists | A cold start offline already ends on the `unreachable` screen with Retry (`useAuthSession`); queries already show their error states |

---

## Assumptions & Open Questions

| Assumption / decision | Chosen default | Rationale | Confirmed? |
| --------------------- | -------------- | --------- | ---------- |
| What the service worker does | Precaches the app shell (HTML, JS, CSS, icons, font); `/api/*` is never cached and always goes to the network | Decision 1, option B | y |
| How a new release reaches an installed app | The new worker waits; the app shows a notice with an "Update" action; if ignored, the new version takes over on the next cold start | Decision 2, option B: never interrupts a half-filled form | y |
| Forcing an urgent update | A `version.json` published per build (`version`, `minSupported`), outside the precache; a running version below `minSupported` gets a blocking dialog | Decision 3, option A: the minimum still holds for a device that skips the release that raised it | y |
| Blocking dialog copy | Title "Update required", body "A new version of findraco is needed to continue.", single action "Update"; no mention of security | User, decision 3: security wording alarms the user | y |
| Where the update notice lives | A toast with "Update" and close, not auto-dismissed, shown once per new version; plus an "Update to <version>" item in the avatar menu and a dot on the avatar while an update waits | Decision 4 + follow-up: a toast closed by accident must be recoverable | y |
| Toast position on mobile | Above the bottom bar (and its safe area), for every toast, not only the update one | Toasts today sit over the bottom bar on mobile (`ToasterView` has no mobile offset) | y |
| How users learn they can install | An "Install app" item in the avatar menu: native prompt on Chrome/Edge (Android and desktop), a two-step instructions dialog on iOS; hidden when already installed or not installable | Decision 5, option B | y |
| Status bar colour in standalone | Follows the app's resolved theme (light `#f5f3ec`, dark `#262624`); on iOS the content extends behind the status bar and the navbar pads `safe-area-inset-top` | Decision 6, option A | y |
| Manifest basics | Name and short name "findraco"; `start_url` `/`; `display: standalone`; orientation unlocked; icons 192, 512 and a maskable 512 generated from `findraco-logo.png` (1024 px) | Defaults accepted by the user with decision 6 | y |
| When the app checks for a new version | On start-up, when the app returns to the foreground, and every 60 minutes while open | Standalone apps are rarely cold-started; the browser's own check alone could leave a device behind for a day | y |
| `version.json` unreachable (offline, error, malformed) | No notice and no block when no check has succeeded yet; after a success, a failed check keeps the last known state; checks again at the next trigger | Failing closed would lock users out over a transient error; a blocking dialog must not vanish because the phone went offline | y (refined 2026-11-01 after verification, PWA-04 AC 7) |
| Version ordering | Semantic Versioning 2.0.0 precedence, including pre-release (`1.0.0-beta.9` < `1.0.0-beta.23` < `1.0.0`) | Versions are `1.0.0-beta.N` now and plain `1.0.0` later | y |
| Where `minSupported` comes from | A value committed in the frontend, written into `version.json` at build time; raising it is a deliberate commit | Same "contract in the repo" approach as `openapi.json`; exact place decided in Design | y |
| Update notice on auth screens (login, register, reset) | Toast and blocking dialog show there too; the avatar menu item and dot exist only where the navbar is | The notice is app-wide; the menu does not exist signed out | y |
| "Shown once per version" memory | Per device (browser storage), keyed by the waiting version | No backend change; a dismissed notice is recoverable from the menu anyway | y |
| Install instructions on iOS browsers other than Safari | Same dialog on any iOS browser (Share → Add to Home Screen) | iOS 16.4+ allows adding to the home screen from other browsers' share sheet | y |
| Session in the installed iOS app | The user signs in once inside the installed app | Platform fact: a standalone iOS app has its own cookie storage, separate from Safari; the `SameSite=Strict` session cookie works within it | y |
| Emergency removal of a broken worker | A self-destroying `sw.js` procedure documented in `DEPLOY.md`, not a feature of the app | Last resort if the worker itself can no longer update | y |

**Open questions:** none - all resolved or logged above.

---

## User Stories

### P1: Install and open full screen ⭐ MVP

**User Story**: As a plan member on a phone, I want to add findraco to my home screen and open it like an app so that it takes the whole screen and starts from an icon.

**Why P1**: It is the M5-07 deliverable and the last open item of 1.0 criterion 1.

**Acceptance Criteria**:

1. The system SHALL serve a web app manifest with name "findraco", short name "findraco", `start_url` `/`, `display` `standalone`, a background colour and icons of 192 px, 512 px and a 512 px maskable icon.  <!-- ubiquitous -->
2. The maskable icon SHALL keep the whole logo inside the central 80% safe zone.  <!-- ubiquitous -->
3. WHILE the app runs in standalone mode on iOS the navbar SHALL pad its top by `env(safe-area-inset-top)` so that no navbar content sits under the status bar.  <!-- state-driven -->
4. WHEN the app is opened from the home-screen icon THEN the system SHALL open on `/` and show the screen that route resolves to for the session (dashboard signed in, login otherwise).  <!-- event-driven -->

**Independent Test**: In Chrome on Android, open findraco.lcsmrt.com, install it from the browser menu, open it from the icon: it opens without the address bar, on the dashboard; Chrome DevTools → Application → Manifest reports no installability errors (Lighthouse dropped its PWA category).

---

### P1: Opens without network ⭐ MVP

**User Story**: As a member who opens the installed app on a weak or no connection, I want the app itself to open so that I see findraco's own state instead of the browser's error page.

**Why P1**: An installed app that opens to the system error page is what makes it feel "not a real app"; this is the reason for the service worker (decision 1).

**Acceptance Criteria**:

1. WHEN a production build runs for the first time in a browser that supports service workers THEN the system SHALL register a service worker that precaches every file of that build's app shell.  <!-- event-driven -->
2. WHEN the app is opened with no network after a previous online visit THEN the system SHALL render the app from the precache, ending on the existing `unreachable` screen with Retry when a session exists, or on the login screen when none does.  <!-- event-driven -->
3. The service worker SHALL never serve a request under `/api/` from any cache.  <!-- ubiquitous -->
4. WHEN a navigation request reaches the worker for any app route (e.g. `/transactions`) THEN the system SHALL answer with the precached `index.html`.  <!-- event-driven -->
5. The web server SHALL send `Cache-Control: no-cache` for `index.html`, `sw.js`, `version.json` and the manifest, and a one-year `immutable` cache for files under `/assets/`.  <!-- ubiquitous -->
6. WHILE the app runs in development (`vite dev`) the system SHALL not register a service worker.  <!-- state-driven -->

**Independent Test**: Install, open once online, switch the phone to airplane mode, close and reopen the app: findraco's own `unreachable` screen appears, not the browser's.

---

### P1: Update notice for a new release ⭐ MVP

**User Story**: As a member with the app installed, I want to be told when a new version is available and update with one tap so that I get fixes without losing what I am typing.

**Why P1**: Without it a device keeps the old bundle after every deploy; it ships with the first worker or not at all (decision 2).

**Acceptance Criteria**:

1. WHEN a new version's worker finishes installing while the app is open THEN the system SHALL show a toast titled "New version available" with an "Update" action and a close button, not dismissed automatically.  <!-- event-driven -->
2. WHEN the member taps "Update" (in the toast or the avatar menu) THEN the system SHALL activate the waiting worker and reload the page once, running the new version.  <!-- event-driven -->
3. WHEN the member closes the update toast THEN the system SHALL not show the toast again for that same waiting version on that device.  <!-- event-driven -->
4. WHILE a new version waits the avatar menu SHALL show an "Update to <version>" item (e.g. "Update to 1.0.0-beta.23") above the app version line.  <!-- state-driven -->
5. WHILE a new version waits the avatar SHALL show a dot in the primary colour at its corner.  <!-- state-driven -->
6. WHILE no new version waits the system SHALL show neither the menu item nor the dot.  <!-- state-driven -->
7. IF the member never taps "Update" THEN the system SHALL run the new version on the next cold start of the app.  <!-- unwanted-behavior -->
8. The system SHALL check for a new version on start-up, when the app returns to the foreground, and every 60 minutes while it stays open.  <!-- ubiquitous -->
9. WHILE the viewport is below the `sm` breakpoint every toast SHALL sit above the bottom bar and its safe area, never over it.  <!-- state-driven -->

**Independent Test**: With beta.N installed, deploy beta.N+1, bring the app to the foreground: the toast appears; close it; the avatar shows a dot and the menu shows "Update to 1.0.0-beta.N+1"; tap it: the app reloads and the menu shows the new version.

---

### P1: Blocking update below the minimum version ⭐ MVP

**User Story**: As the maintainer, I want to stop any device from running a version I marked unsupported so that a broken or vulnerable bundle does not stay in use on phones whose owners ignore the notice.

**Why P1**: An installed app that cannot read the minimum version cannot be forced later; it must ship in the first worker release (decision 3).

**Acceptance Criteria**:

1. Every production build SHALL publish `/version.json` containing `version` (the build's version) and `minSupported` (the committed minimum), excluded from the worker's precache.  <!-- ubiquitous -->
2. WHEN a version check reads a `minSupported` greater than the running version THEN the system SHALL show a blocking dialog titled "Update required" with the text "A new version of findraco is needed to continue." and a single "Update" action, with no close button and no dismissal by Escape or outside click.  <!-- event-driven -->
3. WHEN the member taps "Update" in the blocking dialog THEN the system SHALL load the newest version (activating a waiting worker, or fetching and activating it first) and reload.  <!-- event-driven -->
4. WHEN a version check reads a `version` greater than the running version and a `minSupported` not greater than the running version THEN the system SHALL show the normal update notice, not the blocking dialog.  <!-- event-driven -->
5. IF `version.json` cannot be fetched or parsed and no earlier check in this session succeeded THEN the system SHALL show neither notice nor dialog and keep the app usable.  <!-- unwanted-behavior -->
7. IF a later check fails after an earlier one succeeded THEN the system SHALL keep the state the last successful check produced (a shown notice or blocking dialog stays).  <!-- unwanted-behavior -->
6. The system SHALL order versions by Semantic Versioning 2.0.0 precedence, so that `1.0.0-beta.9` < `1.0.0-beta.23` < `1.0.0`.  <!-- ubiquitous -->

**Independent Test**: With beta.N installed, deploy beta.N+1 with `minSupported` = beta.N+1, bring the app to the foreground: the blocking dialog appears and nothing behind it is reachable; tap "Update": the app reloads on beta.N+1 and the dialog is gone.

---

### P2: Install from the app

**User Story**: As a member, I want an "Install app" option inside findraco so that I can install it even on iOS, where the browser never offers it.

**Why P2**: The browser menu already installs on Android and desktop; this closes the iOS blind spot and helps shared-plan members who do not know the app is installable.

**Acceptance Criteria**:

1. WHERE the browser has offered installation (`beforeinstallprompt`) the avatar menu SHALL show an "Install app" item that opens the browser's native install prompt.  <!-- optional-feature -->
2. WHEN the app runs on iOS outside standalone mode THEN the avatar menu SHALL show "Install app", and tapping it SHALL open a dialog with two steps: tap the Share icon, then "Add to Home Screen".  <!-- event-driven -->
3. WHILE the app runs in standalone mode the system SHALL not show "Install app".  <!-- state-driven -->
4. IF the browser is neither iOS nor has offered installation THEN the system SHALL not show "Install app".  <!-- unwanted-behavior -->
5. WHEN the native install prompt is accepted THEN the system SHALL hide "Install app".  <!-- event-driven -->

**Independent Test**: On iPhone Safari, open the avatar menu, tap "Install app", follow the two steps: the icon is on the home screen; open it: the menu no longer shows "Install app".

---

### P2: Status bar follows the theme

**User Story**: As a member using the installed app, I want the system status bar to match the app's light or dark theme so that the top of the screen looks native.

**Why P2**: Cosmetic but seen on every open (decision 6).

**Acceptance Criteria**:

1. The document SHALL carry a `theme-color` equal to the resolved theme's background (`#f5f3ec` light, `#262624` dark) from the first paint.  <!-- ubiquitous -->
2. WHEN the resolved theme changes (toggle, or the system theme under "system") THEN the system SHALL update `theme-color` to the new theme's background.  <!-- event-driven -->
3. WHILE the app runs in standalone mode on iOS the status bar SHALL be opaque in the page colour (no `apple-mobile-web-app-status-bar-style`), so iOS 26's top-edge blur does not fall on the navbar (changed 2026-11-01 after device UAT; `black-translucent` let the blur cover the navbar).  <!-- state-driven -->

**Independent Test**: Installed on Android, switch the theme in the app: the status bar changes colour with it.

---

## Edge Cases

- IF the browser does not support service workers THEN the system SHALL run as today, with no update notice and no error; the blocking dialog still applies below `minSupported`, its "Update" reloading from the network.
- IF a new version is detected while the blocking dialog is already open THEN the system SHALL keep a single dialog.
- WHEN the update toast and an operation toast (e.g. "Transaction saved") are both visible THEN the system SHALL keep the update toast until the member acts on it.
- WHEN the member is signed out and an update waits THEN the system SHALL still show the toast on the auth screens.
- IF a reload after "Update" still runs the old version (the new worker failed to install) THEN the system SHALL show the notice again at the next check rather than loop reloading.

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
| -------------- | ----- | ----- | ------ |
| PWA-01 | P1: Install and open full screen (AC 1–4) | Execute | Verified |
| PWA-02 | P1: Opens without network (AC 1–6) | Execute | Verified |
| PWA-03 | P1: Update notice for a new release (AC 1–9) | Execute | Verified |
| PWA-04 | P1: Blocking update below the minimum version (AC 1–7) | Execute | Verified |
| PWA-05 | P2: Install from the app (AC 1–5) | Execute | Verified |
| PWA-06 | P2: Status bar follows the theme (AC 1–3) | Execute | Verified |
| PWA-07 | Edge cases (no SW support, single dialog, toast coexistence, signed out, failed update) | Execute | Verified |
| PWA-08 | `DEPLOY.md`: raising `minSupported`, nginx headers, emergency self-destroying worker | Execute | Verified |

**Coverage:** 8 total, 8 mapped to tasks (T1–T14, F1–F4), 0 unmapped

---

## Success Criteria

- [ ] Installed on the user's phone, findraco opens full screen from the icon, online and offline.
- [ ] After a deploy, the installed app shows the new version in the avatar menu within one foreground return or 60 minutes.
- [ ] Raising `minSupported` blocks every older running version at its next check.
