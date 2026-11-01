# PWA Validation

**Date**: 2026-11-01
**Spec**: `.specs/features/pwa/spec.md` (current version, incl. PWA-04 AC 7 and the refined no-service-worker edge case)
**Diff range**: `b04ff1c..b74cd9c` (branch `pwa`)
**Verifier**: independent sub-agent (author ≠ verifier), iteration 2 of 3

**Verdict**: PASS ✅

Iteration 1 failed because the built worker threw on a duplicate precache entry and cached nothing. That is fixed. `dist/sw.js` now lists 15 unique URLs, and headless Chromium fills the precache and opens `/transactions` offline on findraco's own screens: sign-in without a session, and "Can't reach findraco." + Retry with one. The build guard rejects a re-added `webmanifest` glob. All 6 sensor mutants were killed, including the one that survived iteration 1 (`markInstalled()`). Lint and the full suite are green.

---

## Task Completion

| Task | Status | Notes |
| ---- | ------ | ----- |
| T1–T14 | ✅ Done | T1's worker defect was fixed by F1 |
| F1 | ✅ Done | `sw.js` has no duplicates; the guard fails the build (checked: re-adding `webmanifest` → `vite build` exit 1, "The precache list names these URLs more than once … manifest.webmanifest") |
| F2 | ✅ Done | Removing `markInstalled()` is now killed (M1) |
| F3 | ✅ Done | Hourly interval (M4) and keep-last-state (M3) are killed |
| F4 | ✅ Done | Infinite toast (M6) and reload-once (M5) are killed; there is a no-support flow case |

---

## Spec-Anchored Acceptance Criteria

### PWA-01: Install and open full screen

| AC | Spec-defined outcome | Evidence | Result |
| -- | -------------------- | -------- | ------ |
| 1 | manifest name/short_name "findraco", `start_url` `/`, `display` `standalone`, background colour, 192, 512 and maskable 512 icons | built `dist/manifest.webmanifest`: `"name":"findraco","short_name":"findraco","start_url":"/","display":"standalone","background_color":"#f5f3ec"`, icons `pwa-192x192.png` 192x192, `pwa-512x512.png` 512x512, `maskable-icon-512x512.png` 512x512 `"purpose":"maskable"`; config `frontend/vite.config.ts:97-113` | ✅ PASS (build) |
| 2 | whole logo inside the central 80% safe zone | `dist/maskable-icon-512x512.png` measured again: farthest non-background pixel at r = 170.8 px, safe radius 204.8 px (0.4 × 512) | ✅ PASS (build) |
| 3 | navbar pads `env(safe-area-inset-top)` in iOS standalone | `frontend/src/app/layout/NavbarView.tsx:40` `h-[calc(4rem+env(safe-area-inset-top))] … pt-[env(safe-area-inset-top)]`; `MainLayoutView.tsx:20` matching `pt-[calc(4rem+env(safe-area-inset-top))]`; built `index.html` `viewport-fit=cover` | ✅ config; look on a notched device = UAT |
| 4 | opened from the icon → `/`, the route's screen for the session | manifest `start_url:"/"`; in Chromium `/` resolves to `/login` without a session (offline proof run) | ✅ config; home-screen launch = UAT |

### PWA-02: Opens without network

| AC | Spec-defined outcome | Evidence | Result |
| -- | -------------------- | -------- | ------ |
| 1 | registers a worker that precaches every app-shell file | `dist/sw.js` precache: 15 URLs, 0 duplicates (index.html, JS, CSS, 3 woff2, icons, favicon, manifest). Chromium: `registration.active.state = "activated"`, `workbox-precache-v2-…` holds the same 15 entries. Guard: `scripts/precacheManifest.test.ts:37-39` `toThrow("manifest.webmanifest")` (plugin-added duplicate), `:31-33` `toThrow("index.html")`; wiring `vite.config.ts:120-128`, proven by a build with `webmanifest` re-globbed → exit 1 | ✅ PASS |
| 2 | offline open after an online visit → app from the precache: `unreachable` + Retry with a session, login without one | Chromium offline, `goto /transactions`: no navigation error, URL `/login`, body "Sign in … Email … Password", no page errors. With `hasSession` set: URL `/transactions`, body "Can't reach findraco.\n\nRetry" (`SessionStatusView.tsx:22`) | ✅ PASS (browser) |
| 3 | `/api/` never served from any cache | `dist/sw.js`: one `registerRoute` (`NavigationRoute(createHandlerBoundToURL("index.html"),{denylist:[/^\/api\//]})`), no runtime strategy (`NetworkFirst`/`CacheFirst`/`StaleWhileRevalidate`/`NetworkOnly` absent), no `/api` URL in the precache; offline with a session the API refresh failed (unreachable screen) instead of being answered from a cache; config `vite.config.ts:137` | ✅ PASS (build + browser) |
| 4 | navigation to any app route answered with the precached `index.html` | the offline `goto /transactions` above rendered the app, and only the `NavigationRoute` could answer it | ✅ PASS (browser) |
| 5 | `no-cache` for index.html, sw.js, version.json, manifest; one-year `immutable` for `/assets/` | `frontend/nginx.conf:25-47`; `nginx:1.27-alpine` serving the built `dist`, `curl -I`: `/`, `/index.html`, `/transactions`, `/sw.js`, `/version.json`, `/manifest.webmanifest` → `Cache-Control: no-cache` (manifest `Content-Type: application/manifest+json`); `/assets/index-D2NWT0Oz.js` → `public, max-age=31536000, immutable` | ✅ PASS |
| 6 | no worker under `vite dev` | `devOptions` unset; `injectRegister: false` (`vite.config.ts:96`); `node_modules/vite-plugin-pwa/dist/index.js:1019-1031`: under `serve` without `devOptions.enabled` the virtual module is generated in `"dev"` mode (no registration) | ✅ PASS (config) |

### PWA-03: Update notice for a new release

| AC | Spec-defined outcome | `file:line` + assertion | Result |
| -- | -------------------- | ----------------------- | ------ |
| 1 | toast "New version available", "Update" action, close button, not dismissed automatically | `frontend/src/app/providers/AppUpdateProvider.test.tsx:77-79` `findByText("New version available")`, `getByRole("button",{name:"Update"})`, `getByRole("button",{name:"Close toast"})`; not auto-dismissed: `:291-296` 30 s of fake time → `queryByText("Saved")` null while `getByText(TOAST_TITLE)` stays (kills M6); `utils/appUpdate.test.ts:53` `toEqual({kind:"available",version:"1.0.0-beta.23",showToast:true})` | ✅ PASS |
| 2 | "Update" (toast or menu) activates the waiting worker and reloads once | toast: `AppUpdateProvider.test.tsx:143` `activateCalls).toBe(1)`; menu: `NavbarView.stories.tsx:50-53` menuitem "Update to 1.0.0-beta.99" → `onUpdate` `toHaveBeenCalledTimes(1)`, wired at `Navbar.tsx:28` | ✅ PASS (the reload after activation belongs to the plugin; on a real deploy = UAT) |
| 3 | closed toast not shown again for that version on that device | `AppUpdateProvider.test.tsx:103-119` (no toast after a foreground check, toast again for `99.1.0`); `:121-134` survives `clearSessionStorage()` + remount; `utils/appUpdate.test.ts:64` `showToast:false`, `:71` `showToast:true` | ✅ PASS |
| 4 | "Update to <version>" item above the version line | `NavbarView.stories.tsx:76-81` `toEqual(["Update to 1.0.0-beta.99","Install app","Time zone","Logout"])` (version line after the separator) | ✅ PASS |
| 5 | primary-colour dot on the avatar while an update waits | `NavbarView.stories.tsx:48` `getByText("Update available")` (sr-only text in `AvatarBadge`, `bg-primary` at `components/avatar/base/Avatar.tsx:53`) | ✅ PASS (colour is visual) |
| 6 | neither item nor dot without a waiting version | `NavbarView.stories.tsx:36` `queryByText("Update available")` null; `utils/appUpdate.test.ts:76,81` `{kind:"none"}`; `AppUpdateProvider.test.tsx:99-100` state `none`, no toast. The item and the dot come from the same `update` prop (`NavbarView.tsx:55,64`), which `Navbar.tsx:28` sets only for `available` | ✅ PASS |
| 7 | never tapping → new version on the next cold start | browser worker lifecycle (`registerType: "prompt"`, the waiting worker activates once every client is closed) | UAT (deploy-driven) |
| 8 | checks on start-up, on foreground, every 60 min | start-up + foreground: `AppUpdateProvider.test.tsx:153-159` `versionRequests` 1 → 2, `updateCalls` 1 → 2; hourly: `:171-183` at 59 min `toHaveLength(1)`/`updateCalls 1`, at 60 min `toHaveLength(2)`/`updateCalls 2` (kills M4) | ✅ PASS |
| 9 | below `sm` every toast sits above the bottom bar and its safe area | `MainLayoutView.stories.tsx:115-116` (story `ToastAboveBottomBar`, mobile viewport) `toastElement.getBoundingClientRect().bottom` `toBeLessThanOrEqual(bar.getBoundingClientRect().top)` | ✅ PASS (home indicator on device = UAT) |

### PWA-04: Blocking update below the minimum version

| AC | Spec-defined outcome | `file:line` + assertion | Result |
| -- | -------------------- | ----------------------- | ------ |
| 1 | `/version.json` with `version` and `minSupported`, not precached | `scripts/versionManifest.test.ts:5-8` `toEqual({version:"1.0.0-beta.23",minSupported:"1.0.0-beta.20"})`; built `dist/version.json` = `{"version":"1.0.0-beta.22","minSupported":"1.0.0-beta.22"}`; `version.json` absent from `dist/sw.js` | ✅ PASS |
| 2 | dialog "Update required" / "A new version of findraco is needed to continue." / single "Update"; no close button, no dismissal by Escape or outside click | `AppUpdateProvider.test.tsx:244-245` `findByRole("dialog",{name:"Update required"})`, `toContain("A new version of findraco is needed to continue.")`; `UpdateRequiredDialogView.stories.tsx:18` `queryByRole("button",{name:"Close"})` null, `:20-25` Escape and a click outside → still `toBeVisible()`, `:27-28` "Update" → `onUpdate` once; `utils/appUpdate.test.ts:48` `{kind:"required"}` with no worker waiting | ✅ PASS |
| 3 | "Update" loads the newest version (activate a waiting worker, or fetch and activate first) and reloads | `AppUpdateProvider.test.tsx:261` `activateCalls).toBe(1)` (worker waiting); `:273-274` `activateCalls).toBe(1)` after `updateCalls).toBe(2)` (fetched first) | ✅ PASS |
| 4 | newer `version`, `minSupported` not above running → normal notice, not the dialog | `utils/appUpdate.test.ts:51-57` (`minSupported: running` → `available`); `AppUpdateProvider.test.tsx:71-80` toast + state `available 99.0.0` | ✅ PASS |
| 5 | fetch/parse failure with no earlier success → neither notice nor dialog, app usable | `AppUpdateProvider.test.tsx:217-233` (500 and malformed, with a waiting worker): state `"none"`, no toast, `queryByRole("dialog")` null; `utils/appUpdate.test.ts:33-35` `toBeNull()` ×6, `:43` `{kind:"none"}` | ✅ PASS |
| 7 | a later failed check keeps the state the last success produced | `AppUpdateProvider.test.tsx:186-199` dialog shown, then a 500 → `getByRole("dialog",{name:"Update required"})` still there; `:201-215` notice shown, then malformed → state `available 99.0.0` and the toast stay (both kill M3) | ✅ PASS |
| 6 | SemVer 2.0.0 order `1.0.0-beta.9` < `1.0.0-beta.23` < `1.0.0` | `utils/appUpdate.test.ts:6-10` `compareVersions(…)).toBe(-1)` / `toBe(1)` over `["1.0.0-beta.9","1.0.0-beta.23","1.0.0","1.0.1"]`; `:14` equal → `0` | ✅ PASS |

Note (not a gap): the two later-failure tests (`AppUpdateProvider.test.tsx:186,201`) cite "PWA-04 AC 5" in their names, but the spec now numbers that behaviour AC 7. Rename them so traceability matches the spec.

### PWA-05: Install from the app

| AC | Spec-defined outcome | `file:line` + assertion | Result |
| -- | -------------------- | ----------------------- | ------ |
| 1 | `beforeinstallprompt` → "Install app" opens the native prompt | `InstallAppProvider.test.tsx:80-83` `event.defaultPrevented` true, mode `"native"`, `prompt` `toHaveBeenCalledTimes(1)`; `:86-92` offer before mount is caught; `NavbarView.stories.tsx:61-63` "Install app" → `onInstall` once | ✅ PASS |
| 2 | iOS outside standalone → "Install app" → two-step dialog (Share, then "Add to Home Screen") | `InstallAppProvider.test.tsx:141-144` mode `"ios"`, instructions `closed` → `open`; `InstallInstructionsDialogView.stories.tsx:18-20` `toHaveLength(2)`, "Tap the Share icon", "Add to Home Screen"; `utils/platform.test.ts:28-41`; rendered by `Navbar.tsx:31-38` | ✅ PASS |
| 3 | standalone → no "Install app" | `InstallAppProvider.test.tsx:147-154` mode `"none"` with an iPhone UA and an offer; `utils/platform.test.ts:13-25` | ✅ PASS |
| 4 | neither iOS nor offered → none | `InstallAppProvider.test.tsx:156-160` `mode()).toBe("none")`; `utils/platform.test.ts:39-40` | ✅ PASS |
| 5 | accepted native prompt → "Install app" hidden | `InstallAppProvider.test.tsx:103-112` after an accepted prompt a new offer keeps `"none"` (kills M1); `:114-124` after a dismissed prompt a new offer → `"native"` (a dismissed prompt is told apart from an accepted one); `:94-101`, `:126-135` (`appinstalled`) | ✅ PASS |

### PWA-06: Status bar follows the theme

| AC | Spec-defined outcome | Evidence | Result |
| -- | -------------------- | -------- | ------ |
| 1 | `theme-color` = the resolved background from the first paint | Chromium on `dist` with the JS bundle blocked (inline scripts only): light → `#f5f3ec`, `colorScheme: dark` → `#262624`; `frontend/index.html` body script, `ThemeProvider.tsx:11-16` | ✅ PASS (browser) |
| 2 | theme change updates `theme-color` | same run, after "Toggle theme": light → `#262624`, dark → `#f5f3ec` | ✅ PASS (browser) |
| 3 | `black-translucent` status bar in iOS standalone | built `index.html`: `<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">` | ✅ config; look on device = UAT |

### PWA-07: Edge cases

| Edge case | Evidence | Result |
| --------- | -------- | ------ |
| No service-worker support → runs as today, no notice, no error; below `minSupported` the dialog still applies and its "Update" reloads from the network | `AppUpdateProvider.test.tsx:326-339` (`withoutWorkerSupport()`, newer version): `updateCalls).toBe(0)`, state `"none"`, no dialog, no toast. Dialog still applies: `utils/appUpdate.test.ts:46-48` `required` with `needRefresh: false`. "Update" reloads when no worker arrives: `AppUpdateProvider.test.tsx:299-316` `reload` `toHaveBeenCalledTimes(1)`, `activateCalls).toBe(0)`. That is the same code path, because without support `checkForUpdate` resolves with no registration (`serviceWorker.ts:26-30`) | ✅ PASS (the dialog + reload part is shown by these combined cases; no single test runs `withoutWorkerSupport()` with a required manifest) |
| New version while the blocking dialog is open → single dialog | `AppUpdateProvider.test.tsx:247-251` 3 checks → `getAllByRole("dialog")).toHaveLength(1)` | ✅ PASS |
| Update toast and an operation toast together → update toast stays | `AppUpdateProvider.test.tsx:279-297` "Saved" expires, `getByText(TOAST_TITLE)` stays | ✅ PASS |
| Signed out → toast on the auth screens | `AppUpdateProvider.test.tsx:83-90` route `/login` → `findByText("New version available")`; provider mounted outside `AuthProvider` (`AppProvider.tsx`) | ✅ PASS |
| Reload after "Update" still runs the old version → notice again at the next check, no reload loop | `AppUpdateProvider.test.tsx:299-324` one reload after 10 s; one more hour → still `toHaveBeenCalledTimes(1)`, dialog still shown (kills M5) | ✅ PASS |

### PWA-08: `DEPLOY.md`

| Item | Evidence | Result |
| ---- | -------- | ------ |
| Raising `minSupported`, nginx headers, emergency self-destroying worker | `DEPLOY.md` "## PWA": "Forcing an update (`minSupportedVersion`)" (never above `version`, neutral copy), "Emergency: a broken worker" (self-unregistering `sw.js`: clears caches, `registration.unregister()`, navigates clients; rollback), "Good to know" (nginx headers match `nginx.conf`; iOS sign-in once), UAT list | ✅ PASS (docs) |

**Status**: ✅ All ACs covered. 30 automated or build/browser-verified; PWA-03 AC 7 and the on-device parts of PWA-01 AC 3/4, PWA-03 AC 9 and PWA-06 AC 3 are UAT. No spec-precision gaps.

---

## Payload / conjunction rule (provider decisions)

| Decision | Asserted on value/state? |
| -------- | ------------------------ |
| Toast once per version | ✅ state `available 99.0.0` with no toast after a foreground check, then the toast again for `99.1.0` (`AppUpdateProvider.test.tsx:112-118`) |
| Dismissed key survives sign-out | ✅ `clearSessionStorage()` + remount → state `available`, no toast (`:128-133`) |
| Single blocking dialog | ✅ `toHaveLength(1)` after 3 version requests (`:249-251`) |
| Fail-open on a first failure | ✅ state `"none"`, no toast, no dialog after the request was seen (`:227-232`) |
| Keep last state on a later failure | ✅ dialog stays (`:198`); state `available 99.0.0` and the toast stay (`:213-214`) |
| Triggers | ✅ request count and `updateCalls` by value: 1 → 2 on foreground (`:153-159`); 1 at 59 min, 2 at 60 min (`:175-183`) |
| Update path | ✅ `activateCalls` = 1 (`:143`, `:261`); fetch-then-activate `updateCalls` = 2 + `activateCalls` = 1 (`:273-274`); no worker → `reload` ×1 and `activateCalls` 0 (`:315-316`), still ×1 an hour later (`:322`) |
| No support | ✅ `updateCalls` 0, state `"none"`, no dialog, no toast (`:335-338`) |
| Install mode per platform | ✅ `native` / `ios` / `none` by value (`InstallAppProvider.test.tsx:81,141,153,159`); accepted vs dismissed told apart by a second offer (`:111`, `:123`) |

---

## Discrimination Sensor

Run in place, without a worktree or `git stash`: `git status --porcelain` baseline recorded first. For each mutant: copy the target to the scratchpad, mutate in place, run only its test file (`node node_modules/vitest/vitest.mjs run --project=<p> <file>` from `frontend/`), restore from the copy, `cmp` (identical every time). Porcelain matched the baseline at the end. Targets are only modules whose test-table row has a test kind (`utils/*.ts`, `scripts/*.ts`, the providers and their hooks covered by their flow tests).

| # | File:line | Mutation | Tests run | Killed? |
| - | --------- | -------- | --------- | ------- |
| M1 | `frontend/src/app/providers/InstallAppProvider.tsx:36` | `if (outcome === "accepted") store.markInstalled();` → removed (iteration 1's survivor) | `InstallAppProvider.test.tsx` (1 failed: "keeps the item hidden after an accepted prompt even if the browser offers again") | ✅ Killed |
| M2 | `frontend/scripts/precacheManifest.ts:24` | dropped `...additionalUrls` from the duplicate check (F1 guard ignores the plugin's own entries, the exact iteration-1 defect) | `scripts/precacheManifest.test.ts`, tooling (1 failed: "throws when a globbed entry repeats one added by the plugin") | ✅ Killed |
| M3 | `frontend/src/app/providers/useVersionManifest.ts:29` | `if (active && next) setManifest(next)` → `if (active) setManifest(next)` (a failed later check clears the state) | `AppUpdateProvider.test.tsx` (2 failed: keep dialog / keep notice) | ✅ Killed |
| M4 | `frontend/src/app/providers/useVersionManifest.ts:4` | `CHECK_INTERVAL_MS` 60 min → 30 min | `AppUpdateProvider.test.tsx` (1 failed: "checks again every 60 minutes, not sooner") | ✅ Killed |
| M5 | `frontend/src/app/providers/useUpdateAction.ts:42` | removed `window.location.reload()` | `AppUpdateProvider.test.tsx` (1 failed: "reloads once when no worker arrives") | ✅ Killed |
| M6 | `frontend/src/app/providers/useUpdateToast.ts:21` | removed `duration: Infinity` (sonner default) | `AppUpdateProvider.test.tsx` (1 failed: "keeps the update toast past sonner's default duration") | ✅ Killed |

Separate config check, not counted in the sensor: `vite.config.ts` has no test row. Re-adding `webmanifest` to `globPatterns` made `pnpm exec vite build` exit 1 with the guard's error. The file was restored (`cmp` identical) and the build re-run clean (15 entries).

**Sensor depth**: lightweight+ (6 mutations, prioritising the iteration-1 survivor and the F1 guard)
**Result**: 6/6 killed. PASS ✅

---

## Offline proof (real browser)

- `pnpm build` (exit 0, `PWA v2.0.0`, `generateSW`, `precache 15 entries (1698.41 KiB)`), then `pnpm exec vite preview --port 4173` from `frontend/`. A Playwright script in the scratchpad (never in the repo) drove Chromium 1234 headless.
- Online `goto /`: `navigator.serviceWorker.ready` → `active.state = "activated"`, scope `http://127.0.0.1:4173/`. Cache `workbox-precache-v2-http://127.0.0.1:4173/` held 15 entries: `/index.html`, `/assets/index-D2NWT0Oz.js`, `/assets/index-D9UmF6cN.css`, 3 woff2, `/assets/workbox-window…js`, `/manifest.webmanifest`, `/favicon.ico`, `/apple-touch-icon-180x180.png`, `/findraco-logo-128.png`, 4 `pwa-*`/maskable PNGs. After a reload, `navigator.serviceWorker.controller` was set.
- `context.setOffline(true)`, `goto /transactions`: no navigation error. Title "findraco", URL `/login`, body "Sign in / Email / Password / … v1.0.0-beta.22 - 20261101", no page errors.
- Offline with `hasSession=true`, `goto /transactions`: URL `/transactions`, body "Can't reach findraco. / Retry", the existing `unreachable` screen.
- The server was stopped afterwards (port 4173 closed).

---

## Code Quality

| Principle | Status |
| --------- | ------ |
| Minimum code | ✅ |
| Surgical changes | ✅ (fixes touch `vite.config.ts`, a new `scripts/precacheManifest.ts` + test, the two provider test files, the fake) |
| No scope creep | ✅ |
| Matches patterns | ✅ providers `XxxProvider.tsx` + `useXxx.ts`; fake at the virtual-module boundary; MSW for `/version.json`; no `vi.mock` of our modules; no lint/TS bypass |
| Spec-anchored outcome check | ✅ the worker is now verified by running it, not by listing it |
| Per-layer coverage (utils 1:1; container decisions) | ✅ |
| Every test maps to a requirement | ✅ names cite ACs (two names cite AC 5 for what is now AC 7; see the PWA-04 note) |
| Documented guidelines followed: `CLAUDE.md` Frontend, `.claude/skills/frontend-testing/SKILL.md`, `frontend/scripts/testTable.ts` | ✅ |

Iteration 1 noted a risk: a main chunk past Workbox's 2 MiB limit would silently drop out of the precache. `showMaximumFileSizeToCacheInBytesWarning: false` (`vite.config.ts:116`) now makes that a build failure. The main chunk is 1.53 MB.

---

## Interactive UAT items (device only, not failures)

1. Android Chrome: install from the browser or the account menu, open from the icon without browser bars, on `/` resolving to the dashboard or login (PWA-01 AC 4, PWA-05 AC 1/5 on device).
2. iPhone Safari: "Install app" → two steps → home screen; standalone opens with no "Install app"; the navbar clears the notch and the status bar is `black-translucent` in both themes (PWA-01 AC 3, PWA-05 AC 2/3, PWA-06 AC 3).
3. On-device offline open of the installed app after one online visit (PWA-02 AC 2; proven in headless Chromium here).
4. Deploy-driven update: deploy N+1 → toast, close, dot + "Update to N+1", tap → reload on N+1 (PWA-03 AC 2). Never tapping → N+1 on the next cold start (PWA-03 AC 7). Raising `minSupported` → blocking dialog on the device, "Update" reloads onto the new version (PWA-04 independent test).
5. iPhone: the bottom bar sits above the home indicator and toasts clear it (PWA-03 AC 9 on device).

---

## Gate Check

- **Gate command**: from `frontend/`, `pnpm lint && pnpm test`. `pnpm build` was run separately for the build inspection (exit 0).
- **Result**: exit 0, first run. Lint clean. `check-siblings` clean. `unit + tooling + storybook`: 144 files passed, 29 skipped (173); 975 tests passed. `critical --coverage`: 6 files, 174 tests passed. The time-zone flake did not occur.
- **Test count**: iteration 1 had 962 (+174), now 975 (+174), so +13. That is `precacheManifest.test.ts` 5, `InstallAppProvider.test.tsx` 2, `AppUpdateProvider.test.tsx` 6. No test was removed or weakened.
- **Skipped files**: 29, the existing skipped set (not added by this diff).
- **Failures**: none.

---

## Requirement Traceability Update (recommended for `spec.md`; the Verifier does not edit it)

| Requirement | New Status |
| ----------- | ---------- |
| PWA-01 | ✅ Verified (on-device look and launch = UAT) |
| PWA-02 | ✅ Verified |
| PWA-03 | ✅ Verified (AC 7 = UAT) |
| PWA-04 | ✅ Verified |
| PWA-05 | ✅ Verified |
| PWA-06 | ✅ Verified (AC 3 look = UAT) |
| PWA-07 | ✅ Verified |
| PWA-08 | ✅ Verified |

---

## Summary

**Overall**: ✅ Ready (pending device UAT)

**Spec-anchored check**: all ACs of PWA-01..PWA-08 and all 5 edge cases have evidence; 0 spec-precision gaps
**Sensor**: 6/6 mutations killed
**Gate**: lint + 975 + 174 tests passed; build passed
**Offline proof**: precache populated (15), offline `/transactions` renders sign-in (no session) and "Can't reach findraco." + Retry (session)

**Iteration-1 gaps resolved**: duplicate precache entry (F1, plus a build guard proven to fire), PWA-05 AC 5 discrimination (F2/M1), the hourly check and the later-failure state (F3/M3/M4), the edge cases (F4/M5/M6 + no-support case).

**Non-blocking follow-ups**: rename the two "PWA-04 AC 5" later-failure tests to "AC 7"; update the statuses in the spec's traceability table; run the device UAT above.
