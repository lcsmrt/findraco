---
name: frontend-testing
description: Decide and write frontend tests in findraco, and know the gates that run them. Covers what gets a unit test, a story, an integration test or an E2E test; the content-based "logic module" criterion and the sibling test/story gate (`scripts/check-siblings.ts`); 90% branch coverage on logic only; the story checklist and `play` limits; Storybook a11y in error mode; integration tests with `renderWithProviders` and MSW (explicit per-test handlers, scenarios, unhandled requests fail); no `vi.mock` of our own modules in flow tests; the `unit`/`storybook`/`tooling` Vitest projects and commands; flaky tests; husky hooks and the CI/deploy gates. Use when writing or changing any test or story, adding a module that may need a test, mocking the network, or when a gate fails. Triggers on "test", "unit test", "vitest", "story", "storybook", "play function", "a11y", "integration test", "msw", "mock", "vi.mock", "renderHook", "coverage", "check-siblings", "flaky", "e2e", "playwright", "CI failed", "pre-commit".
metadata:
  type: reference
---

# Frontend Testing

Tests should fail on our defects. That decides everything below: logic is unit-tested, visuals are
rendered in stories, flows run the real app with only the network simulated, and nothing tests a
library on our behalf.

Commands run from `frontend/` with pnpm.

---

## What gets which test

| What | Test | File | Enforced by |
| --- | --- | --- | --- |
| **Logic**: a `.ts` module that meets the logic criterion below, our hooks with logic, form mappers, service hooks | unit test (Vitest; `renderHook` for hooks; service hooks through MSW) | sibling `xxx.test.ts` | sibling gate; 90% branch coverage |
| **Visual**: every presentational component (`component-creation` defines it) | story, with `play` for basic interactions only | sibling `Xxx.stories.tsx` | story gate; a11y in error mode |
| **Flow**: what a container orchestrates, as the spec's ACs describe it | integration test: Testing Library `render` of the real screen through `renderWithProviders`, network simulated by MSW only | sibling `Xxx.test.tsx` | the tlc execution contract and the Verifier (spec-anchored check, mutants) |
| **Journey**: 3–5 critical paths (sign in, add a transaction, see it on the Overview, switch plans) | E2E with Playwright against the real backend and a disposable database | not yet in place | waits for the local Docker database; never runs against `dev_finsight` |

- Business logic is unit-tested, never simulated through clicks in a story.
- No visual regression (story screenshot) tests for now: baselines would churn while the UI is still
  being reworked.
- Every new spec AC gets a test at the right row above. An existing flow without an integration test
  gets one when a change touches it.
- Derive tests from the spec's ACs, never from the implementation. Test names cite the AC they prove
  (`it("rejects an amount of zero (TXN-03 AC 2)")`): that is where spec traceability lives, not in code
  comments.
- Testing Library is the query and interaction library everywhere: `storybook/test` re-exports it for
  `play`, integration tests use it directly. A presentational interaction lives in `play`, not in a
  second test.

---

## The logic criterion and the sibling gate

**A `.ts` module is logic, and needs a sibling `.test.ts`, when it contains at least one of:**

- a decision point: `if`, ternary, `switch`, `&&` / `||` / `??` used as a value, a loop, `try`/`catch`;
- arithmetic on non-literal operands;
- an iteration callback: `map`, `filter`, `reduce`, `forEach`, ….

Hooks are `.ts` modules and follow the same criterion.

- Classification is by content, never by name or path. A constants file that grows a function becomes
  logic; no rename or folder escapes the gate.
- Exempt by content: type-only and DTO modules, constant-only modules, branchless wrappers (`cn`,
  `SessionExpiredError`, `useDebounce`). Do not write tests for them: a test of `cn` tests
  `tailwind-merge`, which cannot fail on our defects.
- Exempt by suffix: `*.handlers.ts` (test support, see `api-integration`).

`scripts/check-siblings.ts` reads every module's AST and prints two reports, each naming the files:
modules that need a test and lack one, and component files that need a story and lack one (the story
rule is in `component-creation`). Any entry fails `pnpm test` and CI.

When the gate names a file, write the missing test or story. When it names a component that should not
need a story, the component is a container with a visual of its own: split it into container and view.
There is no exemption list.

---

## Coverage: 90% branches on logic, nowhere else

- Vitest `v8` coverage over `src/**/*.ts`, excluding tests, `*.handlers.ts`, `src/test/**` and `.d.ts`.
  Branch threshold 90% per module; below it, `pnpm test` fails naming the module. Measured on the
  `unit` project only: stories run helpers without asserting their results.
- Coverage runs in its own invocation on `unit` (Vitest takes coverage settings only at the root) and
  measures only modules a test loads (`all: false`): the sibling gate already gives every logic module a
  test, and v8 would report an unloaded barrel as 0% branches.
- Components (`.tsx`), stories, DTOs and types are outside the threshold. Never set a global number.
- Coverage is a signal, not proof. Executing a branch without asserting its outcome games the number.
  Every covered branch has an assertion on the result; the Verifier's mutation sensor catches tests that
  would pass against a wrong implementation.

---

## Stories

Story types come from the framework package: `import type { Meta, StoryObj } from "@storybook/react-vite"`,
never `@storybook/react`.

**Story checklist.** A story file covers:

1. each variant the component exposes;
2. each state it handles: empty, loading, error;
3. extreme content: long text, big values, many items;
4. a mobile viewport when the layout changes on mobile.

Not a token `Default` story. The story list is the component's state list.

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { SummaryCards } from "./SummaryCards";

const meta = {
  title: "Overview/SummaryCards",
  component: SummaryCards,
} satisfies Meta<typeof SummaryCards>;
export default meta;

type Story = StoryObj<typeof meta>;

export const PositiveBalance: Story = {
  args: { summary: { totalIncome: 5000, totalExpenses: 3200, netBalance: 1800 } },
};

export const NegativeBalance: Story = {
  args: { summary: { totalIncome: 2500, totalExpenses: 3200, netBalance: -700 } },
};

export const Loading: Story = { args: { summary: undefined, isLoading: true } };

export const LargeValues: Story = {
  args: { summary: { totalIncome: 987654321.99, totalExpenses: 123456789.01, netBalance: 864197532.98 } },
};

export const Mobile: Story = {
  args: PositiveBalance.args,
  globals: { viewport: { value: "mobile1" } },
};
```

- **`play` covers basic interactions only**: open, select, type into a field.
  ```tsx
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Category" }));
    await expect(canvas.getByRole("listbox")).toBeVisible();
  },
  ```
- A react-hook-form section (`ItemsField`) renders inside a small test form built in the story file with
  `useForm` and default values.
- **Accessibility runs in error mode** (`a11y: { test: "error" }` in `.storybook/preview.tsx`): a
  violation fails the story test. Fix the component or the story; never disable a check.
- Stories run in a real browser, so they are a free render test as well as the workshop where a
  component is built and every state is seen in isolation.

---

## Integration tests (flows)

An integration test renders the real screen with the real providers, TanStack Query cache, hooks and
`findracoApi` with its interceptors. **Only the network is simulated, by MSW.**

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
| `unit` | jsdom, MSW server per file | `src/**/*.test.{ts,tsx}`: logic, hooks, service hooks, integration tests |
| `storybook` | Chromium (Playwright), a11y in error mode | every `*.stories.tsx` |
| `tooling` | Node | local lint rules (`eslint/rules/*.test.ts`), `scripts/check-siblings.test.ts`, `eslint.config.test.ts` |

| Command | Use |
| --- | --- |
| `pnpm test` | everything: sibling gate, `unit` with coverage, then `tooling` and `storybook` (what CI runs) |
| `pnpm exec vitest run --project=unit --project=tooling` | quick loop for logic, flows and tooling |
| `pnpm exec vitest run` | every project, without the sibling and coverage gates |

**Flaky tests are fixed, never retried.** A test that fails intermittently has a cause; find and fix
it. Adding retries hides it.

---

## Gates

| Where | What runs | Blocks |
| --- | --- | --- |
| `pre-commit` (husky, `frontend/.husky/`) | `lint-staged`: ESLint on the staged frontend files | the commit |
| `commit-msg` (husky) | `check_commit.py`: Conventional Commits | the commit |
| CI `frontend` job (`.github/workflows/ci.yml`, every push) | lint, `build` (`tsc`), `pnpm test` (sibling gate, all projects, coverage) | deploy |
| CI `backend` job (every push) | `./mvnw test` | deploy |
| CI `deploy` job (push to `main`) | needs both jobs green and a deployable change (not only `.specs/`, `.claude/`, `*.md`); one at a time; skipped when the tested commit is no longer the tip of `main` | production |

- `--no-verify` skips the hooks, not CI. A commit that skips them still fails CI and never deploys.
- Fix forward. If an older commit's deploy is skipped because a newer one is the tip, and the newer one
  fails CI, production stays on the previous release until a fix lands. Push the fix.
