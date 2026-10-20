---
name: frontend-testing
description: Decide and write frontend tests in findraco, and know the gates that run them. Covers the closed test table (code kind by path and file name → test kind → amount, `scripts/testTable.ts`) and the sibling test/story gate (`scripts/check-siblings.ts`); 90% branch coverage on the five critical modules only; stories that run as tests (states the component handles, its own `play`) versus catalog-only stories (`!test` tag, every `base/` primitive); Storybook a11y in error mode; flow tests that assert container decisions only, with `renderWithProviders` and MSW (explicit per-test handlers, scenarios, unhandled requests fail); no `vi.mock` of our own modules; no tests of library behaviour; the E2E overlap rule; how Specify and the Test Coverage Matrix use the table; the `unit`/`critical`/`storybook`/`tooling` Vitest projects and commands; affected-only CI runs and the weekly full run; flaky tests; husky hooks and the CI/deploy gates. Use when writing or changing any test or story, adding a module that may need a test, writing spec ACs or a Test Coverage Matrix, mocking the network, or when a gate fails. Triggers on "test", "unit test", "vitest", "story", "storybook", "play function", "a11y", "integration test", "msw", "mock", "vi.mock", "renderHook", "coverage", "check-siblings", "test table", "catalog story", "flaky", "e2e", "playwright", "CI failed", "pre-commit".
metadata:
  type: reference
---

# Frontend Testing

Tests should fail on our defects. That decides everything below: a closed table says which code gets
which test and how much, flows run the real app with only the network simulated, and nothing tests a
library on our behalf.

Commands run from `frontend/` with pnpm.

---

## The test table

What to test is a lookup, not a judgment call. A module's kind is recognised by its path and file name
only (paths under `src/`); the unit rows live as code in `scripts/testTable.ts`, which the sibling gate
and the Vitest config read. **A module that matches no row gets no test, even with an `if` in it.**

| Code kind | Recognised by | Test | Amount |
| --- | --- | --- | --- |
| **Business rule**: form schema and mappers, money, recurrence, split, any pure computation | `*Form.ts`, `*Forms.ts`, any `.ts` under a `utils/` folder | unit, sibling `xxx.test.ts` | one case per rule the spec states, plus the edges it names |
| **Service hook** | `api/services/use*Service.ts` | unit through MSW, real `findracoApi` | one test per endpoint or mutation, asserting method, URL, params/body and response mapping |
| **API client** | `api/clients/*.ts` | unit through MSW | the single 401 → refresh → retry test, plus one case per rule the client promises |
| **URL params** | `*Params.ts` | unit | a round trip, plus an invalid value |
| **Shared hook** | `hooks/*.ts` | unit through `renderHook` | one case per behaviour it promises its callers |
| **Feature hook** | `use*.ts` anywhere else | none of its own | its container's flow test covers it |
| **Container** | a `.tsx` the gate's container rule matches (`component-creation`) | flow test, sibling `Xxx.test.tsx` | the container decisions below ("Flow tests") |
| **Presentational component** | any other `.tsx` outside `base/` | story, sibling `Xxx.stories.tsx` | one story per state its own code handles, a `play` per interaction of its own ("Stories") |
| **`base/` primitive** | `.tsx` under a `<family>/base/` folder | catalog story only | none runs as a test |
| **Tooling**: local lint rules, gate scripts, lint config | `eslint/rules/*.ts`, `scripts/*.ts`, `eslint.config.js` | unit (Node) | one valid and one invalid case per behaviour the rule promises |
| **Anything else**: UI glue (column definitions, labels, class maps, prop mapping, route lists), simple formatting, wrappers, types, DTOs, constants, `*.handlers.ts` | | none | |

- Pure computation shown to the user (a sort, a grouping, a scale) is a business rule: it lives in the
  feature's `utils/` folder, not beside a component, and keeps its test. A `.ts` of glue beside a
  component stays there with no test.
- **No test in any layer asserts library behaviour**: Base UI, Tailwind, TanStack, react-hook-form, MSW,
  zod's own parsing. A test of `cn` tests `tailwind-merge`, which cannot fail on our defects.
- **Once E2E journeys exist, a happy path an E2E journey covers gets no flow test of its own.**
- A rule is tested once, at its row. A flow test never repeats a unit rule through clicks, and a story
  never asserts a business rule.
- Derive tests from the spec's ACs, never from the implementation. Test names cite the AC they prove
  (`it("rejects an amount of zero (TXN-03 AC 2)")`): that is where spec traceability lives, not in code
  comments.
- Testing Library is the query and interaction library everywhere: `storybook/test` re-exports it for
  `play`, flow tests use it directly.
- No visual regression (story screenshot) tests for now: baselines would churn while the UI is still
  being reworked.

### The table in the spec-driven flow

- **Specify.** A visual-only AC (layout, spacing, colour, an icon) becomes a story or a named hand check,
  not a unit or flow test. An AC that restates a rule already specified at another layer (a form-schema rule
  repeated as a screen AC) is not written.
- **Tasks.** The table, not the existing tests, sets the floor and the ceiling of each layer's Test
  Coverage Matrix row. A layer whose row says none gets none, whatever older code has.
- **Verify.** The discrimination sensor's scope is set in `CLAUDE.md`: only code whose row has a test.

---

## The sibling gate

`scripts/check-siblings.ts` prints three reports, each naming the files; any entry fails `pnpm test` and
CI:

1. modules the table requires a test for, without a sibling `.test.ts`: a module in a unit row that
   holds logic (a decision point, arithmetic on non-literal operands or an iteration callback), or any
   critical module. Inside a row, a module with nothing to test (types, constants, a branchless wrapper)
   still needs none;
2. component files that need a story and lack one: every `.tsx` that is not a container and not under a
   `base/` folder;
3. containers that render HTML elements of their own (`component-creation`).

When the gate names a module, write its test at the row's amount. When it names a component that should
not need a story, the component is a container with a visual of its own: split it into container and
view. There is no exemption list; a row that gives a wrong result is fixed in `testTable.ts` for every
file.

---

## Coverage: 90% branches on the critical modules only

| Critical module | Why |
| --- | --- |
| `utils/money.ts` | parses and compares every amount |
| `components/input/currencyDigits.ts` | turns keystrokes into the amount saved |
| `features/transactions/components/transactionForm.ts` | maps a transaction to the payload saved |
| `features/categories/components/categoryForm.ts` | maps a category and its limits to the payload saved |
| `api/clients/findracoApi.ts` | renews the session; a defect drops it |

- An error in these writes wrong data or drops the session without the user noticing; a display error
  is visible. Each must reach 90% branches on its own, so a failure names the module. No other module
  has a threshold, and no global number exists.
- Coverage runs only in the `critical` project, over each critical module's own tests
  (`<module>.test.ts`, `<module>.*.test.ts`): an unrelated test that loads a critical module partly would
  fail it for no defect.
- A moved critical module moves in `criticalModules` (`scripts/testTable.ts`) in the same commit.
- Coverage is a signal, not proof. Executing a branch without asserting its outcome games the number;
  every covered branch has an assertion on the result.

---

## Stories

Story types come from the framework package: `import type { Meta, StoryObj } from "@storybook/react-vite"`,
never `@storybook/react`.

Every story is in the catalog; only some run as tests. **A story runs as a test only when it shows a
state the component handles in its own code (with data, empty, loading, error) or holds a `play` for the
component's own interaction.** Every other story (a variant showcase, extreme content, a mobile
viewport) carries the `!test` tag, or is removed when it adds nothing to the catalog. Not a token
`Default` story: the running stories are the component's state list.

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { SummaryCards } from "./SummaryCards";

const meta = {
  title: "Overview/SummaryCards",
  component: SummaryCards,
} satisfies Meta<typeof SummaryCards>;
export default meta;

type Story = StoryObj<typeof meta>;

// States SummaryCards handles itself: runs as a test.
export const WithData: Story = {
  args: { summary: { totalIncome: 5000, totalExpenses: 3200, netBalance: 1800 } },
};

export const Loading: Story = { args: { summary: undefined, isLoading: true } };

// Catalog only: extreme content and a mobile viewport show the layout, they test nothing of ours.
export const LargeValues: Story = {
  args: { summary: { totalIncome: 987654321.99, totalExpenses: 123456789.01, netBalance: 864197532.98 } },
  tags: ["!test"],
};

export const Mobile: Story = {
  args: WithData.args,
  globals: { viewport: { value: "mobile1" } },
  tags: ["!test"],
};
```

- **A `base/` primitive's story file is catalog only**: `"!test"` goes into the meta's `tags`, and the
  gate demands no story for a primitive. The user keeps the catalog; a primitive's behaviour is Base UI's.
- **Merge tags, never add a second key.** Many metas already carry `tags: ["autodocs"]`; the catalog
  meta is `tags: ["autodocs", "!test"]`. A second `tags` key silently overrides the first, and the file
  keeps running. The same holds for a story that already has tags.
- **`play` covers the component's own interactions only**: open, select, type into a field. Never a
  business rule, never what a library does on its own (a Base UI popover opening on click).
  ```tsx
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Category" }));
    await expect(canvas.getByRole("listbox")).toBeVisible();
  },
  ```
- A react-hook-form section (`ItemsField`) renders inside a small test form built in the story file with
  `useForm` and default values.
- **Accessibility runs in error mode** (`a11y: { test: "error" }` in `.storybook/preview.tsx`) on every
  story that runs as a test: a violation fails it. Fix the component or the story; never disable a check.
- A catalog story that stops rendering fails no gate (`build-storybook` is not in CI). That is accepted;
  fix it when seen.

---

## Flow tests

A flow test renders a container with the real providers, TanStack Query cache, hooks and `findracoApi`
with its interceptors. **Only the network is simulated, by MSW.** It asserts only container decisions:

- one happy submit, asserting the full payload that reaches the network;
- an API failure;
- cancel;
- permission (what a role sees or may do);
- what happens after saving: navigation, toast, refetch.

An assertion that depends only on a pure function's input and output lives in that function's unit test,
not in a flow test. `MainLayout.test.tsx` is the model: each test is a decision of the screen.

**Never `vi.mock` our own modules in a flow test**: services, `findracoApi`, providers, hooks. Why:
mocking `findracoApi` skipped the session-refresh interceptor, the base URL and param serialisation,
which are exactly what breaks in production. MSW intercepts at the network, independent of the client.

```tsx
it("shows the viewer no create action (PLAN-04 AC 2)", async () => {
  server.use(...signedInMember({ role: "VIEWER" }), transactionHandlers.list([]));

  renderWithProviders(<TransactionsScreen />);

  expect(await screen.findByText("No transactions yet")).toBeVisible();
  expect(screen.queryByRole("button", { name: "New transaction" })).not.toBeInTheDocument();
});
```

### MSW rules

- **No global handlers.** The server starts empty; each test calls `server.use(...)` with what it needs.
  Why: with a default "happy path" set, a test can pass on a fixture it does not know about (a VIEWER
  test passing on an OWNER fixture), and fixture edits ripple into unrelated tests.
- **Build responses from the handler factories** in `src/api/services/xxx.handlers.ts`
  (`dashboardHandlers.trend(trend)`; how to write them: `api-integration`).
- **Scenarios group, they never hide.** A named scenario in `src/test/scenarios.ts`
  (`signedInMember({ role: "VIEWER" })`) bundles the factories a screen needs; its parameters name
  everything the test relies on. A value the assertion depends on is a parameter, never a buried default.
- **An unhandled request fails the test.** The `unit` setup records every request without a handler and
  throws in `afterEach`, naming method and URL. MSW's own `onUnhandledRequest: "error"` is not enough: it
  only fails the request, and code that swallows the error would still pass. Add the handler the test
  needs; never loosen the setup.
- To assert what reached the network, capture the request in the handler and assert on it
  (method, URL, params, body).
- For concurrency (a held refresh while other requests wait), resolve a deferred promise inside the
  handler.

### `renderWithProviders`

`src/test/renderWithProviders.tsx` renders a tree inside a `QueryClientProvider` (retries off), a
`MemoryRouter`, and the **real context objects with explicit values**
(`<PlanContext.Provider value={…}>`, exported from `useXxx.ts` by the provider pattern in
`feature-structure`). Pass the values the test relies on; never mock a provider module.

---

## Vitest projects and commands

| Project | Environment | Runs |
| --- | --- | --- |
| `unit` | jsdom, MSW server per file | `src/**/*.test.{ts,tsx}`: unit tests and flow tests |
| `critical` | jsdom, like `unit` | the critical modules' own tests, with coverage and the 90% threshold |
| `storybook` | Chromium (Playwright), a11y in error mode | every `*.stories.tsx` story without the `!test` tag |
| `tooling` | Node | local lint rules (`eslint/rules/*.test.ts`), `scripts/check-siblings.test.ts`, `eslint.config.test.ts` |

| Command | Use |
| --- | --- |
| `pnpm test` | the full suite: sibling gate, `unit`, `tooling` and `storybook`, then `critical` with coverage |
| `pnpm exec vitest related --run <files>` | per task: only the tests that import the changed files |
| `pnpm exec vitest run --project=unit --project=tooling` | quick loop for unit, flow and tooling tests |
| `pnpm test:coverage` | the critical modules' coverage alone |

- Workers: a quarter of the cores locally, a fixed 2 on CI (`process.env.CI`). Vitest's percentage gives
  the 4-core runner one worker, and more workers than that made `user-event` tests time out at random.
- **Flaky tests are fixed, never retried.** A test that fails intermittently has a cause; find and fix
  it. Adding retries hides it.

---

## Gates

| Where | What runs | Blocks |
| --- | --- | --- |
| `pre-commit` (husky, `frontend/.husky/`) | `lint-staged`: ESLint on the staged frontend files | the commit |
| `commit-msg` (husky) | `check_commit.py`: Conventional Commits | the commit |
| CI `frontend` job (`.github/workflows/ci.yml`, pushes that change `frontend/` or root files, diffed from the last green run) | lint, `build` (`tsc`), the sibling gate, then the affected tests or the full suite (below) | deploy |
| CI weekly run (Mondays 06:00 UTC, on `main`) and manual dispatch | the full suite; never deploys; a failure ends the run red and GitHub emails it | nothing |
| CI `backend` job (pushes that change `backend/` or root files) | `./mvnw test` | deploy |
| CI `deploy` job (push to `main`) | needs each app job green or skipped as unchanged, and some app changed; one at a time; skipped when the tested commit is no longer the tip of `main` | production |

**What a push tests.** With a usable base (the last green run on the branch), the `frontend` job runs
only the `unit` and `storybook` tests that import a file changed since it (`vitest run --changed <base>`);
`tooling` always runs whole (Vitest's related-file walk fails with `EISDIR` on its `eslint` import, and it
takes a second), and so does `critical` with coverage. A change to a file tests depend on without
importing it (theme CSS, `vite.config.ts`, `src/test/**`, `.storybook/**`, `package.json`, the lockfile,
`scripts/testTable.ts`) reruns everything (`forceRerunTriggers`). Without a usable base (dispatch,
schedule, first run, force push) the full suite runs. A test the import graph misses still runs in the
weekly full run and in the full gate at each phase end.

- `--no-verify` skips the hooks, not CI. A commit that skips them still fails CI and never deploys.
- Fix forward. If an older commit's deploy is skipped because a newer one is the tip, and the newer one
  fails CI, production stays on the previous release until a fix lands. Push the fix.
