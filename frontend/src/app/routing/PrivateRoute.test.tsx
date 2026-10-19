import { cleanup, fireEvent, screen } from "@testing-library/react";
import { Route, Routes, useLocation } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { AuthContextValue, AuthStatus } from "@/app/providers/useAuth";
import { renderWithProviders } from "@/test/renderWithProviders";
import { PrivateRoute } from "./PrivateRoute";

function authValue(status: AuthStatus, retry: () => void): AuthContextValue {
  return {
    user: null,
    setUser: vi.fn(),
    status,
    signIn: vi.fn(),
    signOut: vi.fn(),
    retry,
    announceSessionExpiry: vi.fn(),
  };
}

function LoginProbe() {
  const location = useLocation();
  return <div data-testid="login">{JSON.stringify(location.state)}</div>;
}

function renderRoute(status: AuthStatus, retry = vi.fn()) {
  return renderWithProviders(
    <Routes>
      <Route path="/login" element={<LoginProbe />} />
      <Route element={<PrivateRoute />}>
        <Route path="/plans" element={<div>Private page</div>} />
      </Route>
    </Routes>,
    { route: "/plans?tab=members", auth: authValue(status, retry) },
  );
}

afterEach(() => {
  cleanup();
});

describe("PrivateRoute", () => {
  it("renders a full-page spinner and not the private page while loading", () => {
    renderRoute("loading");

    expect(screen.getByRole("status", { name: "Loading" })).toBeTruthy();
    expect(screen.queryByText("Private page")).toBeNull();
  });

  it("renders the unreachable message and retries from its button", () => {
    const retry = vi.fn();
    renderRoute("unreachable", retry);

    expect(screen.getByText("Can't reach findraco.")).toBeTruthy();
    expect(screen.queryByText("Private page")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Retry" }));
    expect(retry).toHaveBeenCalledTimes(1);
  });

  it("redirects an anonymous user to /login carrying the path and query", () => {
    renderRoute("anonymous");

    const state = JSON.parse(screen.getByTestId("login").textContent ?? "null");
    expect(state.from).toMatchObject({
      pathname: "/plans",
      search: "?tab=members",
    });
    expect(screen.queryByText("Private page")).toBeNull();
  });

  it("renders the private page when authenticated", () => {
    renderRoute("authenticated");

    expect(screen.getByText("Private page")).toBeTruthy();
  });
});
