import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import {
  AxiosError,
  AxiosHeaders,
  type InternalAxiosRequestConfig,
} from "axios";
import { ReactNode } from "react";
import {
  MemoryRouter,
  Route,
  Routes,
  useLocation,
  useNavigate,
  type Location,
  type NavigateFunction,
} from "react-router-dom";
import { toast } from "sonner";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type Mock,
} from "vitest";
import { getAccessToken, setAccessToken } from "@/api/clients/accessToken";
import {
  findracoApi,
  renewSession,
  setSessionExpiredHandler,
} from "@/api/clients/findracoApi";
import { PrivateRoute } from "@/app/routing/PrivateRoute";
import { AuthProvider } from "./AuthProvider";
import { useAuth } from "./useAuth";

vi.mock("@/api/clients/findracoApi", () => ({
  findracoApi: { get: vi.fn(), post: vi.fn() },
  renewSession: vi.fn(),
  setSessionExpiredHandler: vi.fn(),
}));

vi.mock("sonner", () => ({ toast: { error: vi.fn() } }));

const mockedApi = findracoApi as unknown as { get: Mock; post: Mock };
const mockedRenewSession = vi.mocked(renewSession);
const mockedToastError = vi.mocked(toast.error);

const SESSION_EXPIRED_MESSAGE = "Your session expired. Please sign in again.";
const PROFILE = { id: 1, name: "Ana Lima", email: "ana@example.com" };

const requestConfig: InternalAxiosRequestConfig = {
  headers: new AxiosHeaders(),
};

const unauthorizedError = () =>
  new AxiosError(
    "Unauthorized",
    AxiosError.ERR_BAD_REQUEST,
    requestConfig,
    null,
    {
      data: { message: "Authentication required." },
      status: 401,
      statusText: "",
      headers: {},
      config: requestConfig,
    },
  );

const networkError = () =>
  new AxiosError("Network Error", AxiosError.ERR_NETWORK, requestConfig, null);

const expireHandler = () => {
  const handler = vi.mocked(setSessionExpiredHandler).mock.lastCall?.[0];
  if (!handler) throw new Error("No session-expired handler registered");
  return handler;
};

const renewSucceeds = () =>
  mockedRenewSession.mockImplementation(async () => {
    setAccessToken("renewed-token");
    return "renewed-token";
  });

// Mirrors the real renewSession: a 401 renewal fires the handler, then rejects.
const renewAnswers401 = () =>
  mockedRenewSession.mockImplementation(async () => {
    expireHandler()();
    throw unauthorizedError();
  });

let auth: ReturnType<typeof useAuth>;
let currentLocation: Location;
let navigateTo: NavigateFunction;

const Probe = () => {
  auth = useAuth();
  currentLocation = useLocation();
  navigateTo = useNavigate();
  return (
    <>
      <p data-testid="status">{auth.status}</p>
      <p data-testid="user">{auth.user?.name ?? ""}</p>
    </>
  );
};

const createQueryClient = () =>
  new QueryClient({ defaultOptions: { queries: { retry: false } } });

const renderProvider = (
  initialEntry = "/plans?tab=members",
  queryClient = createQueryClient(),
) => {

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialEntry]}>
        <AuthProvider>{children}</AuthProvider>
      </MemoryRouter>
    </QueryClientProvider>
  );

  render(<Probe />, { wrapper: Wrapper });

  return { queryClient };
};

const status = () => screen.getByTestId("status").textContent;

beforeEach(() => {
  localStorage.clear();
  setAccessToken(null);
  mockedApi.get.mockImplementation(async (url: string) => {
    if (url === "/user/me") return { data: PROFILE };
    throw new Error(`Unexpected GET ${url}`);
  });
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("AuthProvider start-up", () => {
  it("stays anonymous with no network call when there is no session hint and removes the legacy token", async () => {
    localStorage.setItem("accessToken", '"legacy-jwt"');

    renderProvider();

    expect(status()).toBe("anonymous");
    expect(localStorage.getItem("accessToken")).toBeNull();
    expect(mockedRenewSession).not.toHaveBeenCalled();
    expect(mockedApi.get).not.toHaveBeenCalled();
    expect(mockedApi.post).not.toHaveBeenCalled();
    expect(getAccessToken()).toBeNull();
  });

  it("renews the session and loads the profile when the hint is present", async () => {
    localStorage.setItem("hasSession", "true");
    renewSucceeds();

    renderProvider();

    expect(status()).toBe("loading");
    await waitFor(() => expect(status()).toBe("authenticated"));
    expect(screen.getByTestId("user").textContent).toBe("Ana Lima");
    expect(mockedApi.get).toHaveBeenCalledWith("/user/me");
    expect(getAccessToken()).toBe("renewed-token");
  });

  // Expired AC 9 (amended 2026-10-16): a public page stays put and shows no toast.
  it("clears the session silently and stays on a public page when renewal answers 401", async () => {
    localStorage.setItem("hasSession", "true");
    localStorage.setItem("activePlanId", "10");
    renewAnswers401();

    const queryClient = createQueryClient();
    queryClient.setQueryData(["plans"], [{ id: 10 }]);

    renderProvider("/reset-password?token=abc", queryClient);

    await waitFor(() => expect(status()).toBe("anonymous"));
    expect(currentLocation.pathname).toBe("/reset-password");
    expect(currentLocation.search).toBe("?token=abc");
    expect(mockedToastError).not.toHaveBeenCalled();
    expect(getAccessToken()).toBeNull();
    expect(queryClient.getQueryCache().getAll()).toHaveLength(0);
    expect(localStorage.getItem("activePlanId")).toBeNull();
    expect(localStorage.getItem("hasSession")).toBeNull();
  });

  it("becomes unreachable when renewal fails without a response, and retry() runs start-up again", async () => {
    localStorage.setItem("hasSession", "true");
    mockedRenewSession.mockRejectedValueOnce(networkError());

    renderProvider();

    await waitFor(() => expect(status()).toBe("unreachable"));
    expect(mockedToastError).not.toHaveBeenCalled();
    expect(localStorage.getItem("hasSession")).toBe("true");

    renewSucceeds();
    act(() => auth.retry());

    await waitFor(() => expect(status()).toBe("authenticated"));
    expect(mockedRenewSession).toHaveBeenCalledTimes(2);
    expect(screen.getByTestId("user").textContent).toBe("Ana Lima");
  });
});

describe("AuthProvider session end", () => {
  const renderAuthenticated = async () => {
    localStorage.setItem("hasSession", "true");
    localStorage.setItem("activePlanId", "10");
    renewSucceeds();
    const rendered = renderProvider();
    await waitFor(() => expect(status()).toBe("authenticated"));
    rendered.queryClient.setQueryData(["plans"], [{ id: 10 }]);
    return rendered;
  };

  it("clears the session and sends the user to /login with the current location when it expires", async () => {
    const { queryClient } = await renderAuthenticated();

    act(() => expireHandler()());

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
    expect(mockedToastError).toHaveBeenCalledTimes(1);
    expect(mockedToastError).toHaveBeenCalledWith(SESSION_EXPIRED_MESSAGE);
  });

  it.each([
    [
      "the logout request succeeds",
      () => mockedApi.post.mockResolvedValue({ status: 204 }),
    ],
    [
      "the logout request fails",
      () => mockedApi.post.mockRejectedValue(networkError()),
    ],
  ])("signs out without a toast when %s", async (_, arrangeLogout) => {
    arrangeLogout();
    const { queryClient } = await renderAuthenticated();

    await act(() => auth.signOut());

    expect(mockedApi.post).toHaveBeenCalledWith("/auth/logout");
    expect(status()).toBe("anonymous");
    expect(screen.getByTestId("user").textContent).toBe("");
    expect(getAccessToken()).toBeNull();
    expect(queryClient.getQueryCache().getAll()).toHaveLength(0);
    expect(localStorage.getItem("activePlanId")).toBeNull();
    expect(localStorage.getItem("hasSession")).toBeNull();
    expect(currentLocation.pathname).toBe("/login");
    expect(mockedToastError).not.toHaveBeenCalled();
  });
});

describe("AuthProvider signIn", () => {
  it("keeps the token in memory, sets the hint and loads the profile", async () => {
    renderProvider("/login");
    expect(status()).toBe("anonymous");

    await act(() => auth.signIn("login-token"));

    expect(getAccessToken()).toBe("login-token");
    expect(localStorage.getItem("hasSession")).toBe("true");
    expect(localStorage.getItem("accessToken")).toBeNull();
    expect(mockedApi.get).toHaveBeenCalledWith("/user/me");
    expect(status()).toBe("authenticated");
    expect(screen.getByTestId("user").textContent).toBe("Ana Lima");
  });
});

describe("AuthProvider with PrivateRoute", () => {
  const renderApp = (initialEntry: string) =>
    render(
      <QueryClientProvider client={createQueryClient()}>
        <MemoryRouter initialEntries={[initialEntry]}>
          <AuthProvider>
            <Probe />
            <Routes>
              <Route path="/login" element={<p>Login page</p>} />
              <Route path="/reset-password" element={<p>Reset page</p>} />
              <Route element={<PrivateRoute />}>
                <Route path="/plans" element={<p>Private page</p>} />
              </Route>
            </Routes>
          </AuthProvider>
        </MemoryRouter>
      </QueryClientProvider>,
    );

  it("takes the user from a private page to /login with one expiry toast when the session expired at start-up", async () => {
    localStorage.setItem("hasSession", "true");
    renewAnswers401();

    renderApp("/plans?tab=members");

    await screen.findByText("Login page");
    expect(currentLocation.state).toMatchObject({
      from: { pathname: "/plans", search: "?tab=members" },
    });
    expect(mockedToastError).toHaveBeenCalledTimes(1);
    expect(mockedToastError).toHaveBeenCalledWith(SESSION_EXPIRED_MESSAGE);
    expect(localStorage.getItem("hasSession")).toBeNull();
    expect(screen.queryByText("Private page")).toBeNull();
  });

  it("shows the expiry toast once when the session expires mid-session on a private page", async () => {
    localStorage.setItem("hasSession", "true");
    renewSucceeds();
    renderApp("/plans?tab=members");
    await screen.findByText("Private page");

    act(() => expireHandler()());

    await screen.findByText("Login page");
    expect(currentLocation.state).toMatchObject({
      from: { pathname: "/plans", search: "?tab=members" },
    });
    expect(mockedToastError).toHaveBeenCalledTimes(1);
    expect(mockedToastError).toHaveBeenCalledWith(SESSION_EXPIRED_MESSAGE);
  });

  it("does not announce a start-up expiry found on a public page when the user later opens a private page", async () => {
    localStorage.setItem("hasSession", "true");
    renewAnswers401();
    renderApp("/reset-password?token=abc");
    await waitFor(() => expect(status()).toBe("anonymous"));
    expect(screen.getByText("Reset page")).toBeTruthy();

    act(() => navigateTo("/plans"));

    await screen.findByText("Login page");
    expect(mockedToastError).not.toHaveBeenCalled();
  });

  it("announces a start-up expiry only once, not again after signing in and out", async () => {
    localStorage.setItem("hasSession", "true");
    renewAnswers401();
    renderApp("/plans");
    await screen.findByText("Login page");
    expect(mockedToastError).toHaveBeenCalledTimes(1);

    await act(() => auth.signIn("fresh-token"));
    act(() => navigateTo("/plans"));
    await screen.findByText("Private page");
    await act(() => auth.signOut());
    await screen.findByText("Login page");

    act(() => navigateTo("/plans"));

    await screen.findByText("Login page");
    expect(mockedToastError).toHaveBeenCalledTimes(1);
  });

  it("redirects a visitor who never signed in without the expiry toast", async () => {
    renderApp("/plans");

    await screen.findByText("Login page");
    expect(mockedToastError).not.toHaveBeenCalled();
  });
});
