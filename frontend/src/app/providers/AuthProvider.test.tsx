import { act, cleanup, screen, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import {
  Route,
  Routes,
  useLocation,
  useNavigate,
  type Location,
  type NavigateFunction,
} from "react-router-dom";
import { Toaster } from "sonner";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { getAccessToken, setAccessToken } from "@/api/clients/accessToken";
import { renewSession } from "@/api/clients/findracoApi";
import type { User } from "@/api/dtos";
import { authHandlers } from "@/api/services/auth.handlers";
import { PrivateRoute } from "@/app/routing/PrivateRoute";
import { recordRequests } from "@/test/recordRequests";
import { renderWithProviders } from "@/test/renderWithProviders";
import { server } from "@/test/server";
import { AuthProvider } from "./AuthProvider";
import { useAuth } from "./useAuth";

const SESSION_EXPIRED_MESSAGE = "Your session expired. Please sign in again.";
const PROFILE: User = { id: 1, name: "Ana Lima", email: "ana@example.com" };
const API_PATH = "/api/findraco";

let auth: ReturnType<typeof useAuth>;
let currentLocation: Location;
let navigateTo: NavigateFunction;

function Probe() {
  auth = useAuth();
  currentLocation = useLocation();
  navigateTo = useNavigate();
  return (
    <>
      <div data-testid="status">{auth.status}</div>
      <div data-testid="user">{auth.user?.name ?? ""}</div>
    </>
  );
}

// The session is rendered through AuthProvider, its only consumer: route guards and the probe read
// it from the context, which is how the app sees it. The real Toaster shows what the user sees.
function renderSession(tree: ReactNode, route: string) {
  return renderWithProviders(
    <AuthProvider>
      {tree}
      <Toaster />
    </AuthProvider>,
    { route },
  );
}

function renderProvider(initialEntry = "/plans?tab=members") {
  return renderSession(<Probe />, initialEntry);
}

function status() {
  return screen.getByTestId("status").textContent;
}

function paths(requests: Request[]) {
  return requests.map((request) => `${request.method} ${new URL(request.url).pathname.replace(API_PATH, "")}`);
}

function expiryToasts() {
  return screen.queryAllByText(SESSION_EXPIRED_MESSAGE);
}

/** Ends the session the way the API does: a renewal that answers 401 fires the expiry handler. */
async function expireSession() {
  server.use(authHandlers.refreshRejected());
  await act(() => renewSession().catch(() => undefined));
}

beforeEach(() => {
  localStorage.clear();
  setAccessToken(null);
});

afterEach(() => {
  cleanup();
});

describe("AuthProvider start-up", () => {
  it("stays anonymous with no network call when there is no session hint and removes the legacy token", async () => {
    localStorage.setItem("accessToken", '"legacy-jwt"');
    const requests = recordRequests();

    renderProvider();

    expect(status()).toBe("anonymous");
    expect(localStorage.getItem("accessToken")).toBeNull();
    expect(requests).toEqual([]);
    expect(getAccessToken()).toBeNull();
  });

  it("renews the session and loads the profile when the hint is present", async () => {
    localStorage.setItem("hasSession", "true");
    server.use(authHandlers.refresh({ token: "renewed-token" }), authHandlers.me(PROFILE));
    const requests = recordRequests();

    renderProvider();

    expect(status()).toBe("loading");
    await waitFor(() => expect(status()).toBe("authenticated"));
    expect(screen.getByTestId("user").textContent).toBe("Ana Lima");
    expect(paths(requests)).toEqual(["POST /auth/refresh", "GET /user/me"]);
    expect(getAccessToken()).toBe("renewed-token");
  });

  // Expired AC 9 (amended 2026-10-16): a public page stays put and shows no toast.
  it("clears the session silently and stays on a public page when renewal answers 401", async () => {
    localStorage.setItem("hasSession", "true");
    localStorage.setItem("activePlanId", "10");
    server.use(authHandlers.refreshRejected());

    const { queryClient } = renderProvider("/reset-password?token=abc");
    // Seeded while the renewal is still on the network.
    queryClient.setQueryData(["plans"], [{ id: 10 }]);

    await waitFor(() => expect(status()).toBe("anonymous"));
    expect(currentLocation.pathname).toBe("/reset-password");
    expect(currentLocation.search).toBe("?token=abc");
    expect(expiryToasts()).toHaveLength(0);
    expect(getAccessToken()).toBeNull();
    expect(queryClient.getQueryCache().getAll()).toHaveLength(0);
    expect(localStorage.getItem("activePlanId")).toBeNull();
    expect(localStorage.getItem("hasSession")).toBeNull();
  });

  it("becomes unreachable when renewal fails without a response, and retry() runs start-up again", async () => {
    localStorage.setItem("hasSession", "true");
    server.use(authHandlers.refreshNetworkError());
    const requests = recordRequests();

    renderProvider();

    await waitFor(() => expect(status()).toBe("unreachable"));
    expect(expiryToasts()).toHaveLength(0);
    expect(localStorage.getItem("hasSession")).toBe("true");

    server.use(authHandlers.refresh({ token: "renewed-token" }), authHandlers.me(PROFILE));
    act(() => auth.retry());

    await waitFor(() => expect(status()).toBe("authenticated"));
    expect(paths(requests).filter((path) => path === "POST /auth/refresh")).toHaveLength(2);
    expect(screen.getByTestId("user").textContent).toBe("Ana Lima");
  });
});

describe("AuthProvider session end", () => {
  async function renderAuthenticated() {
    localStorage.setItem("hasSession", "true");
    localStorage.setItem("activePlanId", "10");
    server.use(authHandlers.refresh({ token: "renewed-token" }), authHandlers.me(PROFILE));
    const rendered = renderProvider();
    await waitFor(() => expect(status()).toBe("authenticated"));
    rendered.queryClient.setQueryData(["plans"], [{ id: 10 }]);
    return rendered;
  }

  it("clears the session and sends the user to /login with the current location when it expires", async () => {
    const { queryClient } = await renderAuthenticated();

    await expireSession();

    expect(status()).toBe("anonymous");
    expect(screen.getByTestId("user").textContent).toBe("");
    expect(getAccessToken()).toBeNull();
    expect(queryClient.getQueryCache().getAll()).toHaveLength(0);
    expect(localStorage.getItem("activePlanId")).toBeNull();
    expect(localStorage.getItem("hasSession")).toBeNull();
    expect(currentLocation.pathname).toBe("/login");
    expect(currentLocation.state).toMatchObject({
      from: { pathname: "/plans", search: "?tab=members" },
    });
    expect(await screen.findAllByText(SESSION_EXPIRED_MESSAGE)).toHaveLength(1);
  });

  it.each([
    ["the logout request succeeds", authHandlers.logout],
    ["the logout request fails", authHandlers.logoutNetworkError],
  ])("signs out without a toast when %s", async (_, logoutHandler) => {
    const { queryClient } = await renderAuthenticated();
    server.use(logoutHandler());
    const requests = recordRequests();

    await act(() => auth.signOut());

    expect(paths(requests)).toEqual(["POST /auth/logout"]);
    expect(status()).toBe("anonymous");
    expect(screen.getByTestId("user").textContent).toBe("");
    expect(getAccessToken()).toBeNull();
    expect(queryClient.getQueryCache().getAll()).toHaveLength(0);
    expect(localStorage.getItem("activePlanId")).toBeNull();
    expect(localStorage.getItem("hasSession")).toBeNull();
    expect(currentLocation.pathname).toBe("/login");
    expect(expiryToasts()).toHaveLength(0);
  });
});

describe("AuthProvider signIn", () => {
  it("keeps the token in memory, sets the hint and loads the profile", async () => {
    server.use(authHandlers.me(PROFILE));
    const requests = recordRequests();
    renderProvider("/login");
    expect(status()).toBe("anonymous");

    await act(() => auth.signIn("login-token"));

    expect(getAccessToken()).toBe("login-token");
    expect(localStorage.getItem("hasSession")).toBe("true");
    expect(localStorage.getItem("accessToken")).toBeNull();
    expect(paths(requests)).toEqual(["GET /user/me"]);
    expect(requests[0].headers.get("Authorization")).toBe("Bearer login-token");
    expect(status()).toBe("authenticated");
    expect(screen.getByTestId("user").textContent).toBe("Ana Lima");
  });
});

describe("AuthProvider with PrivateRoute", () => {
  function renderApp(initialEntry: string) {
    return renderSession(
      <>
        <Probe />
        <Routes>
          <Route path="/login" element={<div>Login page</div>} />
          <Route path="/reset-password" element={<div>Reset page</div>} />
          <Route element={<PrivateRoute />}>
            <Route path="/plans" element={<div>Private page</div>} />
          </Route>
        </Routes>
      </>,
      initialEntry,
    );
  }

  it("takes the user from a private page to /login with one expiry toast when the session expired at start-up", async () => {
    localStorage.setItem("hasSession", "true");
    server.use(authHandlers.refreshRejected());

    renderApp("/plans?tab=members");

    await screen.findByText("Login page");
    expect(currentLocation.state).toMatchObject({
      from: { pathname: "/plans", search: "?tab=members" },
    });
    expect(await screen.findAllByText(SESSION_EXPIRED_MESSAGE)).toHaveLength(1);
    expect(localStorage.getItem("hasSession")).toBeNull();
    expect(screen.queryByText("Private page")).toBeNull();
  });

  it("shows the expiry toast once when the session expires mid-session on a private page", async () => {
    localStorage.setItem("hasSession", "true");
    server.use(authHandlers.refresh({ token: "renewed-token" }), authHandlers.me(PROFILE));
    renderApp("/plans?tab=members");
    await screen.findByText("Private page");

    await expireSession();

    await screen.findByText("Login page");
    expect(currentLocation.state).toMatchObject({
      from: { pathname: "/plans", search: "?tab=members" },
    });
    expect(await screen.findAllByText(SESSION_EXPIRED_MESSAGE)).toHaveLength(1);
  });

  it("does not announce a start-up expiry found on a public page when the user later opens a private page", async () => {
    localStorage.setItem("hasSession", "true");
    server.use(authHandlers.refreshRejected());
    renderApp("/reset-password?token=abc");
    await waitFor(() => expect(status()).toBe("anonymous"));
    expect(screen.getByText("Reset page")).toBeTruthy();

    act(() => navigateTo("/plans"));

    await screen.findByText("Login page");
    expect(expiryToasts()).toHaveLength(0);
  });

  it("announces a start-up expiry only once, not again after signing in and out", async () => {
    localStorage.setItem("hasSession", "true");
    server.use(authHandlers.refreshRejected(), authHandlers.me(PROFILE), authHandlers.logout());
    renderApp("/plans");
    await screen.findByText("Login page");
    expect(await screen.findAllByText(SESSION_EXPIRED_MESSAGE)).toHaveLength(1);

    await act(() => auth.signIn("fresh-token"));
    act(() => navigateTo("/plans"));
    await screen.findByText("Private page");
    await act(() => auth.signOut());
    await screen.findByText("Login page");

    act(() => navigateTo("/plans"));

    await screen.findByText("Login page");
    expect(expiryToasts()).toHaveLength(1);
  });

  it("redirects a visitor who never signed in without the expiry toast", async () => {
    renderApp("/plans");

    await screen.findByText("Login page");
    expect(expiryToasts()).toHaveLength(0);
  });
});
