import {
  AxiosError,
  type AxiosAdapter,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getAccessToken, setAccessToken } from "./accessToken";
import { findracoApi, setSessionExpiredHandler } from "./findracoApi";
import { SessionExpiredError } from "./sessionExpiredError";

type RecordedCall = {
  url?: string;
  authorization: unknown;
  withCredentials?: boolean;
};

type RefreshOutcome = "ok" | "unauthorized" | "network";

const AUTH_REQUIRED = { message: "Authentication required." };

const respond = (
  config: InternalAxiosRequestConfig,
  status: number,
  data: unknown,
): Promise<AxiosResponse> => {
  const response: AxiosResponse = {
    data,
    status,
    statusText: "",
    headers: {},
    config,
  };

  if (status >= 200 && status < 300) return Promise.resolve(response);

  return Promise.reject(
    new AxiosError(
      `Request failed with status code ${status}`,
      AxiosError.ERR_BAD_REQUEST,
      config,
      null,
      response,
    ),
  );
};

const networkError = (config: InternalAxiosRequestConfig) =>
  Promise.reject(
    new AxiosError("Network Error", AxiosError.ERR_NETWORK, config, null),
  );

const flushMicrotasks = () =>
  new Promise<void>((resolve) => setTimeout(resolve, 0));

/**
 * Scripted backend: protected routes accept only "Bearer new-token"; the
 * refresh endpoint answers per `refreshOutcome` once `releaseRefresh()` runs
 * (or immediately when `holdRefresh` is false).
 */
const createBackend = (options: {
  refreshOutcome: RefreshOutcome;
  holdRefresh?: boolean;
  acceptRenewedToken?: boolean;
}) => {
  const calls: RecordedCall[] = [];
  let release: () => void = () => {};
  const refreshGate = new Promise<void>((resolve) => {
    release = resolve;
  });

  const adapter: AxiosAdapter = async (config) => {
    calls.push({
      url: config.url,
      authorization: config.headers.Authorization,
      withCredentials: config.withCredentials,
    });

    if (config.url === "/auth/login") {
      return respond(config, 401, {
        message: "Invalid username or password.",
      });
    }

    if (config.url === "/auth/refresh") {
      if (options.holdRefresh) await refreshGate;
      if (options.refreshOutcome === "network") return networkError(config);
      if (options.refreshOutcome === "unauthorized") {
        return respond(config, 401, AUTH_REQUIRED);
      }
      return respond(config, 200, { token: "new-token" });
    }

    const accepted =
      (options.acceptRenewedToken ?? true) &&
      config.headers.Authorization === "Bearer new-token";

    return accepted
      ? respond(config, 200, { url: config.url })
      : respond(config, 401, AUTH_REQUIRED);
  };

  const callsTo = (url: string) => calls.filter((call) => call.url === url);

  return { adapter, calls, callsTo, releaseRefresh: () => release() };
};

const originalAdapter = findracoApi.defaults.adapter;
const expiredHandler = vi.fn();

beforeEach(() => {
  setAccessToken("old-token");
  setSessionExpiredHandler(expiredHandler);
});

afterEach(() => {
  findracoApi.defaults.adapter = originalAdapter;
  setAccessToken(null);
  expiredHandler.mockReset();
  Reflect.deleteProperty(navigator, "locks");
});

describe("findracoApi request defaults", () => {
  it("sends the in-memory access token as a Bearer header and includes credentials", async () => {
    const backend = createBackend({ refreshOutcome: "ok" });
    findracoApi.defaults.adapter = backend.adapter;
    setAccessToken("new-token");

    await findracoApi.get("/plans");

    expect(backend.calls).toEqual([
      {
        url: "/plans",
        authorization: "Bearer new-token",
        withCredentials: true,
      },
    ]);
  });
});

describe("findracoApi session renewal", () => {
  it("renews once on a 401 and resolves with the retried request's data", async () => {
    expect(navigator.locks).toBeUndefined();
    const backend = createBackend({ refreshOutcome: "ok" });
    findracoApi.defaults.adapter = backend.adapter;

    const response = await findracoApi.get("/plans");

    expect(response.data).toEqual({ url: "/plans" });
    expect(backend.callsTo("/auth/refresh")).toHaveLength(1);
    expect(backend.callsTo("/plans").map((call) => call.authorization)).toEqual(
      ["Bearer old-token", "Bearer new-token"],
    );
    expect(getAccessToken()).toBe("new-token");
    expect(expiredHandler).not.toHaveBeenCalled();
  });

  it("renews once for three simultaneous 401s and retries each request", async () => {
    const backend = createBackend({ refreshOutcome: "ok", holdRefresh: true });
    findracoApi.defaults.adapter = backend.adapter;

    const requests = Promise.all([
      findracoApi.get("/plans"),
      findracoApi.get("/categories"),
      findracoApi.get("/transactions"),
    ]);
    await flushMicrotasks();
    backend.releaseRefresh();
    const responses = await requests;

    expect(responses.map((response) => response.data)).toEqual([
      { url: "/plans" },
      { url: "/categories" },
      { url: "/transactions" },
    ]);
    expect(backend.callsTo("/auth/refresh")).toHaveLength(1);
    for (const url of ["/plans", "/categories", "/transactions"]) {
      expect(
        backend.callsTo(url).map((call) => call.authorization),
      ).toEqual(["Bearer old-token", "Bearer new-token"]);
    }
  });

  it("calls the expiry handler once and rejects all three requests with a session-expired error when renewal answers 401", async () => {
    const backend = createBackend({
      refreshOutcome: "unauthorized",
      holdRefresh: true,
    });
    findracoApi.defaults.adapter = backend.adapter;

    const requests = Promise.allSettled([
      findracoApi.get("/plans"),
      findracoApi.get("/categories"),
      findracoApi.get("/transactions"),
    ]);
    await flushMicrotasks();
    backend.releaseRefresh();
    const results = await requests;

    expect(results.map((result) => result.status)).toEqual([
      "rejected",
      "rejected",
      "rejected",
    ]);
    const urls = ["/plans", "/categories", "/transactions"];
    results.forEach((result, index) => {
      if (result.status !== "rejected") throw new Error("Expected a rejection");
      expect(result.reason).toBeInstanceOf(SessionExpiredError);
      expect(result.reason.original).toMatchObject({
        config: { url: urls[index] },
        response: { status: 401, data: AUTH_REQUIRED },
      });
    });
    expect(backend.callsTo("/auth/refresh")).toHaveLength(1);
    expect(expiredHandler).toHaveBeenCalledTimes(1);
  });

  it("rejects with the original error and keeps the session when renewal fails without a response", async () => {
    const backend = createBackend({ refreshOutcome: "network" });
    findracoApi.defaults.adapter = backend.adapter;

    const error = await findracoApi.get("/plans").catch((e: unknown) => e);

    expect(error).toBeInstanceOf(AxiosError);
    expect(error).toMatchObject({
      config: { url: "/plans" },
      response: { status: 401, data: AUTH_REQUIRED },
    });
    expect(expiredHandler).not.toHaveBeenCalled();
    expect(getAccessToken()).toBe("old-token");
  });

  it("does not renew when /auth/login answers 401", async () => {
    const backend = createBackend({ refreshOutcome: "ok" });
    findracoApi.defaults.adapter = backend.adapter;

    const error = await findracoApi
      .post("/auth/login", { email: "a@b.c", password: "wrong" })
      .catch((e: unknown) => e);

    expect(error).toMatchObject({
      response: {
        status: 401,
        data: { message: "Invalid username or password." },
      },
    });
    expect(backend.calls.map((call) => call.url)).toEqual(["/auth/login"]);
    expect(expiredHandler).not.toHaveBeenCalled();
  });

  it("does not retry a retried request a second time", async () => {
    const backend = createBackend({
      refreshOutcome: "ok",
      acceptRenewedToken: false,
    });
    findracoApi.defaults.adapter = backend.adapter;

    const error = await findracoApi.get("/plans").catch((e: unknown) => e);

    expect(error).toMatchObject({ response: { status: 401 } });
    expect(backend.callsTo("/plans")).toHaveLength(2);
    expect(backend.callsTo("/auth/refresh")).toHaveLength(1);
  });

  it("runs the renewal inside the cross-tab Web Lock when the browser supports it", async () => {
    let lockHeld = false;
    const request = vi.fn(
      async (name: string, callback: (lock: Lock | null) => unknown) => {
        lockHeld = true;
        try {
          return await callback({ name, mode: "exclusive" });
        } finally {
          lockHeld = false;
        }
      },
    );
    Object.defineProperty(navigator, "locks", {
      value: { request },
      configurable: true,
    });

    const backend = createBackend({ refreshOutcome: "ok" });
    const lockStateAtRefresh: boolean[] = [];
    findracoApi.defaults.adapter = (config) => {
      if (config.url === "/auth/refresh") lockStateAtRefresh.push(lockHeld);
      return backend.adapter(config);
    };

    const response = await findracoApi.get("/plans");

    expect(response.data).toEqual({ url: "/plans" });
    expect(request).toHaveBeenCalledTimes(1);
    expect(request.mock.calls[0][0]).toBe("findraco-session-renewal");
    expect(lockStateAtRefresh).toEqual([true]);
  });
});
