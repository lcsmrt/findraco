import { waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { recordRequests } from "@/test/recordRequests";
import { renderHookWithProviders } from "@/test/renderWithProviders";
import { server } from "@/test/server";
import { authHandlers } from "./auth.handlers";
import {
  getUserProfile,
  logout,
  useForgotPassword,
  useLogin,
  useRegisterUser,
  useResetPassword,
  useValidatePasswordResetToken,
} from "./useAuthService";

const user = { id: 3, name: "Ana", email: "ana@example.com" };

describe("useLogin", () => {
  it("POSTs the credentials to /auth/login and resolves with the token", async () => {
    server.use(authHandlers.login({ token: "access-token" }));
    const requests = recordRequests();

    const { result } = renderHookWithProviders(() => useLogin());
    result.current.mutate({ body: { email: "ana@example.com", password: "secret" } });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(requests).toHaveLength(1);
    expect(requests[0].method).toBe("POST");
    expect(new URL(requests[0].url).pathname).toBe("/api/findraco/auth/login");
    expect(await requests[0].json()).toEqual({ email: "ana@example.com", password: "secret" });
    expect(result.current.data).toEqual({ token: "access-token" });
  });
});

describe("logout", () => {
  it("POSTs to /auth/logout with no body and resolves on 204", async () => {
    server.use(authHandlers.logout());
    const requests = recordRequests();

    await expect(logout()).resolves.toBeUndefined();

    expect(requests).toHaveLength(1);
    expect(requests[0].method).toBe("POST");
    expect(new URL(requests[0].url).pathname).toBe("/api/findraco/auth/logout");
    expect(await requests[0].text()).toBe("");
  });
});

describe("getUserProfile", () => {
  it("GETs /user/me and resolves with the user", async () => {
    server.use(authHandlers.me(user));
    const requests = recordRequests();

    await expect(getUserProfile()).resolves.toEqual(user);

    expect(requests).toHaveLength(1);
    expect(requests[0].method).toBe("GET");
    expect(new URL(requests[0].url).pathname).toBe("/api/findraco/user/me");
  });
});

describe("useRegisterUser", () => {
  it("POSTs the registration to /user and resolves with the created user", async () => {
    server.use(authHandlers.register(user));
    const requests = recordRequests();
    const body = { name: "Ana", email: "ana@example.com", password: "secret" };

    const { result } = renderHookWithProviders(() => useRegisterUser());
    result.current.mutate({ body });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(requests).toHaveLength(1);
    expect(requests[0].method).toBe("POST");
    expect(new URL(requests[0].url).pathname).toBe("/api/findraco/user");
    expect(await requests[0].json()).toEqual(body);
    expect(result.current.data).toEqual(user);
  });
});

describe("useForgotPassword", () => {
  it("POSTs the email to /auth/forgot-password", async () => {
    server.use(authHandlers.forgotPassword());
    const requests = recordRequests();

    const { result } = renderHookWithProviders(() => useForgotPassword());
    result.current.mutate({ body: { email: "ana@example.com" } });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(requests).toHaveLength(1);
    expect(requests[0].method).toBe("POST");
    expect(new URL(requests[0].url).pathname).toBe("/api/findraco/auth/forgot-password");
    expect(await requests[0].json()).toEqual({ email: "ana@example.com" });
  });
});

describe("useValidatePasswordResetToken", () => {
  it("GETs /auth/reset-password/validate with the token as a query param and returns the verdict", async () => {
    server.use(authHandlers.validateResetToken({ valid: false }));
    const requests = recordRequests();

    const { result } = renderHookWithProviders(() => useValidatePasswordResetToken("abc 123"));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(requests).toHaveLength(1);
    expect(requests[0].method).toBe("GET");
    const url = new URL(requests[0].url);
    expect(url.pathname).toBe("/api/findraco/auth/reset-password/validate");
    expect(Object.fromEntries(url.searchParams)).toEqual({ token: "abc 123" });
    expect(result.current.data).toEqual({ valid: false });
  });
});

describe("useResetPassword", () => {
  it("POSTs the token and new password to /auth/reset-password", async () => {
    server.use(authHandlers.resetPassword());
    const requests = recordRequests();

    const { result } = renderHookWithProviders(() => useResetPassword());
    result.current.mutate({ body: { token: "abc", password: "new-secret" } });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(requests).toHaveLength(1);
    expect(requests[0].method).toBe("POST");
    expect(new URL(requests[0].url).pathname).toBe("/api/findraco/auth/reset-password");
    expect(await requests[0].json()).toEqual({ token: "abc", password: "new-secret" });
  });
});
