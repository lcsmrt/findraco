import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useAuth, type AuthStatus } from "@/app/providers/AuthProvider";
import { PrivateRoute } from "./PrivateRoute";

vi.mock("@/app/providers/AuthProvider", () => ({ useAuth: vi.fn() }));

const retry = vi.fn();

const mockStatus = (status: AuthStatus) =>
  vi.mocked(useAuth).mockReturnValue({
    user: null,
    setUser: vi.fn(),
    status,
    signIn: vi.fn(),
    signOut: vi.fn(),
    retry,
    announceSessionExpiry: vi.fn(),
  });

const LoginProbe = () => {
  const location = useLocation();
  return <p data-testid="login">{JSON.stringify(location.state)}</p>;
};

const renderRoute = () =>
  render(
    <MemoryRouter initialEntries={["/plans?tab=members"]}>
      <Routes>
        <Route path="/login" element={<LoginProbe />} />
        <Route element={<PrivateRoute />}>
          <Route path="/plans" element={<p>Private page</p>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("PrivateRoute", () => {
  it("renders a full-page spinner and not the private page while loading", () => {
    mockStatus("loading");

    renderRoute();

    expect(screen.getByRole("status", { name: "Loading" })).toBeTruthy();
    expect(screen.queryByText("Private page")).toBeNull();
  });

  it("renders the unreachable message and retries from its button", () => {
    mockStatus("unreachable");

    renderRoute();

    expect(screen.getByText("Can't reach findraco.")).toBeTruthy();
    expect(screen.queryByText("Private page")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Retry" }));
    expect(retry).toHaveBeenCalledTimes(1);
  });

  it("redirects an anonymous user to /login carrying the path and query", () => {
    mockStatus("anonymous");

    renderRoute();

    const state = JSON.parse(screen.getByTestId("login").textContent ?? "null");
    expect(state.from).toMatchObject({
      pathname: "/plans",
      search: "?tab=members",
    });
    expect(screen.queryByText("Private page")).toBeNull();
  });

  it("renders the private page when authenticated", () => {
    mockStatus("authenticated");

    renderRoute();

    expect(screen.getByText("Private page")).toBeTruthy();
  });
});
