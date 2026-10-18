import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, renderHook } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";
import { MemoryRouter, type InitialEntry } from "react-router-dom";
import { AuthContext, type AuthContextValue } from "@/app/providers/useAuth";
import { PlanContext, type PlanContextValue } from "@/app/providers/usePlanContext";
import { ThemeContext, type ThemeContextValue } from "@/app/providers/useTheme";

/**
 * The context values a test relies on. A context left out is not provided at all, so a component
 * that needs it fails loudly instead of running on a default the test never chose.
 */
export type ProviderValues = {
  /** The starting location; an object carries router state (`{ pathname, state }`). */
  route?: InitialEntry;
  auth?: AuthContextValue;
  plan?: PlanContextValue;
  theme?: ThemeContextValue;
};

function createTestQueryClient() {
  return new QueryClient({
    // A retry would turn every error-path test into a slow, repeated request.
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
}

function createProviders(values: ProviderValues, queryClient: QueryClient) {
  return function Providers({ children }: { children: ReactNode }) {
    let tree = children;
    if (values.theme) {
      tree = <ThemeContext.Provider value={values.theme}>{tree}</ThemeContext.Provider>;
    }
    if (values.plan) {
      tree = <PlanContext.Provider value={values.plan}>{tree}</PlanContext.Provider>;
    }
    if (values.auth) {
      tree = <AuthContext.Provider value={values.auth}>{tree}</AuthContext.Provider>;
    }
    return (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[values.route ?? "/"]}>{tree}</MemoryRouter>
      </QueryClientProvider>
    );
  };
}

/**
 * Renders a tree inside a fresh query client, a memory router and the real context objects with
 * the given values. Returns the query client so a test can read or seed the cache.
 */
export function renderWithProviders(ui: ReactElement, values: ProviderValues = {}) {
  const queryClient = createTestQueryClient();
  const result = render(ui, { wrapper: createProviders(values, queryClient) });
  return { ...result, queryClient };
}

/** `renderWithProviders` for a hook; `seed` fills the cache before the first render. */
export function renderHookWithProviders<Result, Props>(
  hook: (props: Props) => Result,
  values: ProviderValues & {
    initialProps?: Props;
    seed?: (queryClient: QueryClient) => void;
  } = {},
) {
  const queryClient = createTestQueryClient();
  values.seed?.(queryClient);
  const result = renderHook(hook, {
    wrapper: createProviders(values, queryClient),
    initialProps: values.initialProps,
  });
  return { ...result, queryClient };
}
