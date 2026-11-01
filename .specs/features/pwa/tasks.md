# PWA Tasks

## Execution Protocol (MANDATORY -- do not skip)

Implement these tasks with the `tlc-spec-driven` skill: **activate it by name and follow its Execute flow and Critical Rules.** Do not search for skill files by filesystem path. The skill is the source of truth for the full flow (per-task cycle, sub-agent delegation, adequacy review, Verifier, discrimination sensor).

**If the skill cannot be activated, STOP and tell the user - do not proceed without it.**

---

**Design**: `.specs/features/pwa/design.md`
**Status**: Approved (2026-11-01)

---

## Test Coverage Matrix

> Generated from codebase, project guidelines, and spec - confirm before Execute. Guidelines found: `CLAUDE.md` (Frontend), `.claude/skills/frontend-testing/SKILL.md`, `frontend/scripts/testTable.ts`, `frontend/package.json`, AD-015.

| Code Layer | Required Test Type | Coverage Expectation | Location Pattern | Run Command |
| ---------- | ------------------ | -------------------- | ---------------- | ----------- |
| Pure computation (`utils/*.ts`) | unit | Every AC and edge case it decides (version order, manifest parsing, update decision, platform checks) | sibling `*.test.ts` | Quick |
| Build script (`scripts/*.ts`) | unit (tooling project) | The `version.json` content and the min > version refusal | sibling `*.test.ts` | Tooling |
| Container / provider with decisions (`AppUpdateProvider`, `InstallAppProvider`) | flow (`renderWithProviders`, MSW for `/version.json`, the aliased fake for `virtual:pwa-register/react`; never `vi.mock` of our modules) | Each decision the provider makes: toast once per version, menu state, blocking dialog, fail-open, update/reload path; install mode per platform | sibling `*.test.tsx` | Quick |
| Presentational (`*View.tsx`) | story (a11y in error mode) | One story per state it handles; `play` where the state is reached by interaction | sibling `*.stories.tsx` | Full |
| Config, adapter, CSS, nginx, docs | none | Build gate | - | Build |

## Gate Check Commands

> Run from `frontend/`. Per task: only the affected test files. Full gate once at each phase end. Verifier: never a git worktree with `pnpm exec` (STATE handoff lesson).

| Gate Level | When to Use | Command |
| ---------- | ----------- | ------- |
| Quick | Tasks with unit or flow tests | `pnpm exec vitest run --project=unit <affected test files>` |
| Tooling | Tasks with build-script tests | `pnpm exec vitest run --project=tooling <affected test files>` |
| Full | Tasks with stories | `pnpm exec vitest run --project=unit --project=storybook <affected files>` |
| Build | Config tasks and last task of each phase | `pnpm lint && pnpm build && pnpm test` |

---

## Execution Plan

### Phase 1: Build and shell

```
T1 → T2 → T3 → T4
```

### Phase 2: Update path

```
T5 → T6 → T7 → T8 → T9
```

### Phase 3: Install and docs

```
T10 → T11 → T12 → T13 → T14
```

---

## Task Breakdown

### T1: `vite-plugin-pwa` build: worker, manifest, icons, `version.json`

**What**: Add `vite-plugin-pwa` ^2, `@vite-pwa/assets-generator` ^2 and `@fontsource-variable/space-grotesk`; configure `VitePWA` per design (`registerType: "prompt"`, `injectRegister: false`, manifest, `globPatterns`/`globIgnores`, `navigateFallbackDenylist: [/^\/api\//]`, no `runtimeCaching`, `pwaAssets` from `findraco-logo.png` with `minimal-2023`, `overrideManifestIcons`, `injectThemeColor: false`); add `pwa-assets.config.ts`; add `scripts/versionManifest.ts` (builds `{ version, minSupported }`, throws when `minSupported` > `version`) used by an inline build-only plugin that emits `version.json`; add `findraco.minSupportedVersion` to `package.json` (= the version this feature ships with); `index.html`: `viewport-fit=cover`, `theme-color` meta, Apple standalone metas, Fontsource replaces the Google Fonts links, old icon links removed (generator injects them); delete `public/favicon.ico` and `public/apple-touch-icon.png`. Confirm `useRegisterSW` options against the installed package types and note any deviation from the design.
**Where**: `frontend/vite.config.ts`
**Depends on**: None
**Reuses**: existing `pkg` read and `define` block
**Requirement**: PWA-01, PWA-02, PWA-04

**Done when**:

- [x] `scripts/versionManifest.test.ts`: content equals `{ version, minSupported }`; `minSupported` greater than `version` (incl. pre-release order) throws naming both
- [x] `pnpm build` output holds `sw.js`, `manifest.webmanifest` (name, short name, start_url, display, 192/512/maskable icons), `version.json`, the icons and the woff2 font; `sw.js` precache lists no `version.json` and no `findraco-logo.png`
- [x] `vite dev` registers no worker
- [x] Gate check passes: Tooling + Build

**Tests**: unit
**Gate**: build

**Commit**: `feat(frontend): build the PWA worker, manifest and version file`

---

### T2: nginx cache headers

**What**: `no-cache` for `index.html` (incl. the SPA fallback), `sw.js`, `version.json`, `manifest.webmanifest` (with its MIME type); one-year `immutable` for `/assets/`.
**Where**: `frontend/nginx.conf`
**Depends on**: T1
**Reuses**: existing server block
**Requirement**: PWA-02

**Done when**:

- [x] `docker run --rm -v $PWD/frontend/nginx.conf:/etc/nginx/conf.d/default.conf nginx:1.27-alpine nginx -t` passes (or the built image starts) and `curl -I` on each path shows the header
- [x] Gate check passes: Build

**Tests**: none
**Gate**: build

**Commit**: `feat(frontend): cache headers for the worker and app shell`

---

### T3: `theme-color` follows the resolved theme

**What**: The inline theme script in `index.html` and `ThemeProvider.applyTheme` both set `<meta name="theme-color">` to the computed `--background` after toggling `dark`, so first paint and every theme change (toggle, system under "system") agree.
**Where**: `frontend/src/app/providers/ThemeProvider.tsx`
**Depends on**: T2
**Reuses**: `applyTheme`, `resolveTheme`
**Requirement**: PWA-06

**Done when**:

- [x] In the browser: light → `#f5f3ec`, dark → `#262624`, switching updates the meta
- [x] Gate check passes: Build

**Tests**: none
**Gate**: build

**Commit**: `feat(frontend): status bar colour follows the theme`

---

### T4: Safe-area top and toasts above the bottom bar

**What**: Navbar pads `env(safe-area-inset-top)` with height `calc(4rem + inset)`; `MainLayoutView` top padding matches; `BottomBarView` carries `data-bottom-bar`; `index.css` sets `--toast-mobile-bottom` on `:root:has([data-bottom-bar])`; `ToasterView` passes `mobileOffset` with that variable (fallback per design if sonner rejects it). Stories of the touched views still pass.
**Where**: `frontend/src/app/layout/ToasterView.tsx`
**Depends on**: T3
**Reuses**: bottom bar `pb-[env(safe-area-inset-bottom)]` pattern
**Requirement**: PWA-01, PWA-03

**Done when**:

- [x] At 375 px with the bottom bar, a toast's bottom edge sits above the bar (checked in the browser or a `MainLayoutView` story `play`)
- [x] Gate check passes: Full + Build (phase end)

**Tests**: story
**Gate**: build

**Commit**: `fix(frontend): toasts clear the bottom bar and the navbar clears the notch`

---

### T5: Update rules in `appUpdate.ts`

**What**: `compareVersions`, `parseVersionManifest`, `decideUpdate` per design.
**Where**: `frontend/src/app/providers/utils/appUpdate.ts`
**Depends on**: None (Phase 1 complete)
**Reuses**: zod
**Requirement**: PWA-03, PWA-04

**Done when**:

- [x] Unit: `1.0.0-beta.9` < `1.0.0-beta.23` < `1.0.0` < `1.0.1`; equal versions → 0; malformed / missing fields / non-object → `null`; `null` manifest → none; `minSupported` > running → required (also when no worker waits); newer version + waiting worker → available with `showToast` true, false when dismissed version equals it, true when a different version was dismissed; newer version without a waiting worker → none; same version + waiting worker → none
- [x] Gate check passes: Quick

**Tests**: unit
**Gate**: quick

**Commit**: `feat(frontend): decide between update notice and required update`

---

### T6: `UpdateRequiredDialogView`

**What**: Blocking dialog: title "Update required", text "A new version of findraco is needed to continue.", single "Update" button; no close button; Escape and outside click do nothing.
**Where**: `frontend/src/app/layout/UpdateRequiredDialogView.tsx`
**Depends on**: T5
**Reuses**: `Dialog` primitive, `Heading`/`Text`, `Button`
**Requirement**: PWA-04

**Done when**:

- [ ] Story: open state; `play` presses Escape and clicks outside, dialog stays; clicking "Update" calls `onUpdate`
- [ ] Gate check passes: Full

**Tests**: story
**Gate**: full

**Commit**: `feat(frontend): blocking dialog for a required update`

---

### T7: Service worker adapter and test fake

**What**: `useServiceWorker()` over `virtual:pwa-register/react` (`needRefresh`, `checkForUpdate` = online check + `registration.update()`, `activateUpdate` = `updateServiceWorker(true)`); `vite-plugin-pwa/react` types; `src/test/fakePwaRegister.ts` (controllable `needRefresh`, records `update`/`activate` calls) aliased for the `unit` and `critical` projects.
**Where**: `frontend/src/app/providers/serviceWorker.ts`
**Depends on**: T6
**Reuses**: plugin's periodic-update recipe
**Requirement**: PWA-02, PWA-03

**Done when**:

- [ ] Type-check passes with the virtual module; existing unit suite passes with the alias
- [ ] Gate check passes: Build

**Tests**: none
**Gate**: build

**Commit**: `feat(frontend): one seam over the service worker registration`

---

### T8: `AppUpdateProvider` + `useAppUpdate`

**What**: Provider per design: checks on mount, foreground (`visibilitychange`), every 60 min; reads `/version.json` (`no-store`) and the adapter; shows the toast (`id: "app-update"`, `duration: Infinity`, "Update" action, dismissal stored under `STORAGE_KEYS.dismissedUpdate`, kept by `clearSessionStorage`); renders `UpdateRequiredDialogView` for `required`; `update()` activates, or checks and waits up to 10 s, else reloads. Mounted in `AppProvider` outside `AuthProvider`.
**Where**: `frontend/src/app/providers/AppUpdateProvider.tsx`
**Depends on**: T7
**Reuses**: `appUpdate.ts`, `lib/storage`, `toast`, MSW handler factory for `/version.json` (new, in `src/test/`)
**Requirement**: PWA-03, PWA-04, PWA-07

**Done when**:

- [ ] Flow: newer version + waiting worker → toast "New version available"; close it → not shown again for that version after a foreground check; a newer second version shows it again; `minSupported` above running → blocking dialog, one instance across repeated checks; `version.json` 500 / malformed → no toast, no dialog; foreground event triggers a new fetch; "Update" with a waiting worker activates it; signed-out route still shows the toast
- [ ] Gate check passes: Quick

**Tests**: unit
**Gate**: quick

**Commit**: `feat(frontend): notify and force app updates`

---

### T9: Navbar update item and avatar dot

**What**: `NavbarView` `update?: { version; onUpdate }` prop → "Update to <version>" item above the separator and a primary dot on the avatar; `Navbar` reads `useAppUpdate` (`available` only).
**Where**: `frontend/src/app/layout/NavbarView.tsx`
**Depends on**: T8
**Reuses**: `DropdownMenuItem` style of the existing items, `Avatar`
**Requirement**: PWA-03

**Done when**:

- [ ] Stories: default (no item, no dot) and update waiting (dot; `play` opens the menu, sees "Update to 1.0.0-beta.99", clicks it, `onUpdate` called)
- [ ] Gate check passes: Full + Build (phase end)

**Tests**: story
**Gate**: build

**Commit**: `feat(frontend): update entry in the account menu`

---

### T10: Platform checks in `platform.ts`

**What**: `isStandalone`, `isIos` per design, taking their inputs as arguments.
**Where**: `frontend/src/app/providers/utils/platform.ts`
**Depends on**: None (Phase 2 complete)
**Reuses**: none
**Requirement**: PWA-05

**Done when**:

- [ ] Unit: standalone by `display-mode` and by `navigator.standalone`; iPhone UA, iPad UA, iPadOS reporting Macintosh with touch points → iOS; desktop Mac without touch, Android → not iOS
- [ ] Gate check passes: Quick

**Tests**: unit
**Gate**: quick

**Commit**: `feat(frontend): detect standalone mode and iOS`

---

### T11: `InstallAppProvider` + `useInstallApp`

**What**: `beforeinstallprompt` captured at module load in `index.tsx` and handed to the provider; mode `native` / `ios` / `null`; `install()` prompts natively or opens the instructions dialog state; `appinstalled` or accepted prompt → `null`. Mounted in `AppProvider`.
**Where**: `frontend/src/app/providers/InstallAppProvider.tsx`
**Depends on**: T10
**Reuses**: `platform.ts`
**Requirement**: PWA-05

**Done when**:

- [ ] Flow: dispatched `beforeinstallprompt` → mode native, `install()` calls `prompt()`, accepted → null; iOS UA outside standalone → ios; standalone → null; no event and not iOS → null
- [ ] Gate check passes: Quick

**Tests**: unit
**Gate**: quick

**Commit**: `feat(frontend): know when and how the app can be installed`

---

### T12: `InstallInstructionsDialogView`

**What**: Dialog "Install findraco" with two steps: tap the Share icon, then "Add to Home Screen"; close button.
**Where**: `frontend/src/app/layout/InstallInstructionsDialogView.tsx`
**Depends on**: T11
**Reuses**: `Dialog` primitive, `lucide` `Share`
**Requirement**: PWA-05

**Done when**:

- [ ] Story: open state (a11y clean)
- [ ] Gate check passes: Full

**Tests**: story
**Gate**: full

**Commit**: `feat(frontend): install instructions for iOS`

---

### T13: Navbar install item

**What**: `NavbarView` `install?: { onInstall }` prop → "Install app" item; `Navbar` reads `useInstallApp` and renders the instructions dialog for `ios`.
**Where**: `frontend/src/app/layout/Navbar.tsx`
**Depends on**: T12
**Reuses**: T9 item pattern
**Requirement**: PWA-05

**Done when**:

- [ ] Stories: installable (`play` opens the menu, clicks "Install app", `onInstall` called) and update + installable together
- [ ] Gate check passes: Full

**Tests**: story
**Gate**: full

**Commit**: `feat(frontend): install entry in the account menu`

---

### T14: `DEPLOY.md` PWA section

**What**: How releases reach installed apps; raising `findraco.minSupportedVersion` (never above `version`, neutral copy shown to users); emergency self-destroying `sw.js` and its rollback; installed iOS app signs in once; UAT checklist (install on Android and iPhone, offline open, update toast, bottom bar above the home indicator).
**Where**: `DEPLOY.md`
**Depends on**: T13
**Reuses**: existing checklist format
**Requirement**: PWA-08

**Done when**:

- [ ] Section present and matches the shipped config
- [ ] Gate check passes: Build (phase end)

**Tests**: none
**Gate**: build

**Commit**: `docs: PWA release and emergency procedures`

---

## Phase Execution Map

```
Phase 1 → Phase 2 → Phase 3

Phase 1:  T1 → T2 → T3 → T4
Phase 2:  T5 → T6 → T7 → T8 → T9
Phase 3:  T10 → T11 → T12 → T13 → T14
```

Batches (~7 tasks, whole phases): Phase 1 (4), Phase 2 (5), Phase 3 (5) → three workers.

---

## Task Granularity Check

| Task | Scope | Status |
| ---- | ----- | ------ |
| T1 | Build config: one plugin setup + its emitted file | ⚠️ Cohesive (one build concern; split would leave an unbuildable state) |
| T2 | 1 config file | ✅ |
| T3 | 1 behaviour (theme meta) in provider + inline script | ✅ |
| T4 | 1 layout concern (insets/offset) | ⚠️ Cohesive |
| T5 | 1 module | ✅ |
| T6 | 1 component | ✅ |
| T7 | 1 adapter + its fake | ✅ |
| T8 | 1 provider | ✅ |
| T9 | 1 component change | ✅ |
| T10 | 1 module | ✅ |
| T11 | 1 provider | ✅ |
| T12 | 1 component | ✅ |
| T13 | 1 container change | ✅ |
| T14 | 1 doc section | ✅ |

## Diagram-Definition Cross-Check

| Task | Depends On (task body) | Diagram Shows | Status |
| ---- | ---------------------- | ------------- | ------ |
| T1 | None | start of Phase 1 | ✅ |
| T2 | T1 | T1 → T2 | ✅ |
| T3 | T2 | T2 → T3 | ✅ |
| T4 | T3 | T3 → T4 | ✅ |
| T5 | None | start of Phase 2 (after Phase 1) | ✅ |
| T6 | T5 | T5 → T6 | ✅ |
| T7 | T6 | T6 → T7 | ✅ |
| T8 | T7 | T7 → T8 | ✅ |
| T9 | T8 | T8 → T9 | ✅ |
| T10 | None | start of Phase 3 (after Phase 2) | ✅ |
| T11 | T10 | T10 → T11 | ✅ |
| T12 | T11 | T11 → T12 | ✅ |
| T13 | T12 | T12 → T13 | ✅ |
| T14 | T13 | T13 → T14 | ✅ |

## Test Co-location Validation

| Task | Code Layer Created/Modified | Matrix Requires | Task Says | Status |
| ---- | --------------------------- | --------------- | --------- | ------ |
| T1 | Config + build script | unit (tooling) | unit | ✅ |
| T2 | nginx config | none | none | ✅ |
| T3 | Provider without decisions (theme meta) | none | none | ✅ |
| T4 | Presentational views + CSS | story | story | ✅ |
| T5 | Pure computation | unit | unit | ✅ |
| T6 | Presentational | story | story | ✅ |
| T7 | Adapter | none | none | ✅ (exercised by T8's flow through the fake) |
| T8 | Provider with decisions | flow | unit (flow) | ✅ |
| T9 | Presentational + container | story | story | ✅ |
| T10 | Pure computation | unit | unit | ✅ |
| T11 | Provider with decisions | flow | unit (flow) | ✅ |
| T12 | Presentational | story | story | ✅ |
| T13 | Container (no new decision) + view prop | story | story | ✅ |
| T14 | Docs | none | none | ✅ |
