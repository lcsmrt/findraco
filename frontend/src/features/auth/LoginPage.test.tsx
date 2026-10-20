import { authHandlers } from "@/api/services/auth.handlers";
import type { AuthContextValue } from "@/app/providers/useAuth";
import { recordRequests } from "@/test/recordRequests";
import { renderWithProviders, type ProviderValues } from "@/test/renderWithProviders";
import { server } from "@/test/server";
import { cleanup, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Login } from "./LoginPage";

const CREDENTIALS = { email: "ana@example.com", password: "secret-password" };

function LocationProbe() {
  const location = useLocation();
  return <output aria-label="location">{`${location.pathname}${location.search}`}</output>;
}

function authValue(signIn: AuthContextValue["signIn"]): AuthContextValue {
  return {
    user: null,
    setUser: vi.fn(),
    status: "anonymous",
    signIn,
    signOut: vi.fn(),
    retry: vi.fn(),
    announceSessionExpiry: vi.fn(),
  };
}

function renderLogin(route: ProviderValues["route"] = "/login") {
  const signIn = vi.fn().mockResolvedValue(undefined);
  renderWithProviders(
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<LocationProbe />} />
      </Routes>
      <Toaster />
    </>,
    { route, auth: authValue(signIn) },
  );
  return { signIn };
}

async function submitCredentials(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText("Email"), CREDENTIALS.email);
  await user.type(screen.getByLabelText("Password"), CREDENTIALS.password);
  await user.click(screen.getByRole("button", { name: "Sign in" }));
}

afterEach(cleanup);

describe("Login sign-in", () => {
  it("signs in and returns to the path and query string the user came from", async () => {
    const user = userEvent.setup();
    const requests = recordRequests();
    server.use(authHandlers.login({ token: "login-token" }));
    const { signIn } = renderLogin({
      pathname: "/login",
      state: { from: { pathname: "/plans", search: "?x=1" } },
    });

    await submitCredentials(user);

    expect((await screen.findByLabelText("location")).textContent).toBe("/plans?x=1");
    expect(requests).toHaveLength(1);
    expect(requests[0].method).toBe("POST");
    expect(requests[0].url).toMatch(/\/auth\/login$/);
    expect(await requests[0].json()).toEqual(CREDENTIALS);
    expect(signIn).toHaveBeenCalledExactlyOnceWith("login-token");
  });

  it("goes to the Overview when there is no previous location (NAV-06 AC 6)", async () => {
    const user = userEvent.setup();
    server.use(authHandlers.login({ token: "login-token" }));
    const { signIn } = renderLogin();

    await submitCredentials(user);

    expect((await screen.findByLabelText("location")).textContent).toBe("/overview");
    expect(signIn).toHaveBeenCalledExactlyOnceWith("login-token");
  });

  it("shows the wrong-credentials message and does not sign in", async () => {
    const user = userEvent.setup();
    server.use(authHandlers.loginRejected("Invalid username or password."));
    const { signIn } = renderLogin();

    await submitCredentials(user);

    expect(await screen.findByText("Invalid username or password.")).toBeTruthy();
    expect(signIn).not.toHaveBeenCalled();
    expect(screen.getByRole("heading", { level: 1, name: "Sign in" })).toBeTruthy();
    expect(screen.queryByLabelText("location")).toBeNull();
  });
});
