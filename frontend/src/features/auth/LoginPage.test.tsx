import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import {
  AxiosError,
  AxiosHeaders,
  type InternalAxiosRequestConfig,
} from "axios";
import {
  MemoryRouter,
  Route,
  Routes,
  useLocation,
  type InitialEntry,
} from "react-router-dom";
import { toast } from "sonner";
import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { findracoApi } from "@/api/clients/findracoApi";
import { useAuth } from "@/app/providers/useAuth";
import { Login } from "./LoginPage";

vi.mock("@/api/clients/findracoApi", () => ({
  findracoApi: { get: vi.fn(), post: vi.fn() },
}));

vi.mock("@/app/providers/useAuth", () => ({ useAuth: vi.fn() }));

vi.mock("sonner", () => ({ toast: { error: vi.fn(), success: vi.fn() } }));

const mockedApi = findracoApi as unknown as { get: Mock; post: Mock };
const mockedToastError = vi.mocked(toast.error);
const signIn = vi.fn();

const CREDENTIALS = { email: "ana@example.com", password: "secret-password" };

const requestConfig: InternalAxiosRequestConfig = {
  headers: new AxiosHeaders(),
};

const wrongCredentialsError = () =>
  new AxiosError(
    "Unauthorized",
    AxiosError.ERR_BAD_REQUEST,
    requestConfig,
    null,
    {
      data: { message: "Invalid username or password." },
      status: 401,
      statusText: "",
      headers: {},
      config: requestConfig,
    },
  );

const LocationProbe = () => {
  const location = useLocation();
  return (
    <p data-testid="location">{`${location.pathname}${location.search}`}</p>
  );
};

const renderLogin = (initialEntry: InitialEntry = "/login") => {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });

  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialEntry]}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<LocationProbe />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

const submitCredentials = () => {
  fireEvent.change(screen.getByLabelText("Email"), {
    target: { value: CREDENTIALS.email },
  });
  fireEvent.change(screen.getByLabelText("Password"), {
    target: { value: CREDENTIALS.password },
  });
  fireEvent.click(screen.getByRole("button", { name: "Sign in" }));
};

beforeEach(() => {
  signIn.mockResolvedValue(undefined);
  vi.mocked(useAuth).mockReturnValue({
    user: null,
    setUser: vi.fn(),
    status: "anonymous",
    signIn,
    signOut: vi.fn(),
    retry: vi.fn(),
    announceSessionExpiry: vi.fn(),
  });
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("Login sign-in", () => {
  it("signs in and returns to the path and query string the user came from", async () => {
    mockedApi.post.mockResolvedValue({ data: { token: "login-token" } });

    renderLogin({
      pathname: "/login",
      state: { from: { pathname: "/plans", search: "?x=1" } },
    });
    submitCredentials();

    await waitFor(() =>
      expect(screen.getByTestId("location").textContent).toBe("/plans?x=1"),
    );
    expect(mockedApi.post).toHaveBeenCalledWith("/auth/login", CREDENTIALS);
    expect(signIn).toHaveBeenCalledExactlyOnceWith("login-token");
  });

  it("goes to the home page when there is no previous location", async () => {
    mockedApi.post.mockResolvedValue({ data: { token: "login-token" } });

    renderLogin();
    submitCredentials();

    await waitFor(() =>
      expect(screen.getByTestId("location").textContent).toBe("/"),
    );
    expect(signIn).toHaveBeenCalledExactlyOnceWith("login-token");
  });

  it("shows the wrong-credentials message and does not sign in", async () => {
    mockedApi.post.mockRejectedValue(wrongCredentialsError());

    renderLogin();
    submitCredentials();

    await waitFor(() =>
      expect(mockedToastError).toHaveBeenCalledWith(
        "Invalid username or password.",
      ),
    );
    expect(mockedToastError).toHaveBeenCalledTimes(1);
    expect(signIn).not.toHaveBeenCalled();
    expect(mockedApi.post).toHaveBeenCalledTimes(1);
    expect(screen.queryByTestId("location")).toBeNull();
  });
});

describe("Login form", () => {
  it("offers no remember-me option", () => {
    renderLogin();

    expect(screen.queryByRole("checkbox")).toBeNull();
    expect(screen.queryByText(/remember/i)).toBeNull();
  });
});
