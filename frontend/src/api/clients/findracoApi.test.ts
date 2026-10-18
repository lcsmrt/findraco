import { waitFor } from "@testing-library/react";
import { AxiosError } from "axios";
import { http, HttpResponse, type HttpHandler } from "msw";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { LoginResponse } from "../dtos";
import { recordRequests } from "@/test/recordRequests";
import { server } from "@/test/server";
import { getAccessToken, setAccessToken } from "./accessToken";
import { findracoApi, setSessionExpiredHandler } from "./findracoApi";
import { SessionExpiredError } from "./sessionExpiredError";

type RefreshOutcome = "ok" | "unauthorized" | "network";

type Deferred = { promise: Promise<void>; resolve: () => void };

const AUTH_REQUIRED = { message: "Authentication required." };
const PROTECTED_URLS = ["/plans", "/categories", "/transactions"];
const API_PATH = "/api/findraco";

function deferred(): Deferred {
  let resolve: () => void = () => {};
  const promise = new Promise<void>((settle) => {
    resolve = settle;
  });
  return { promise, resolve };
}

/** Protected routes accept only "Bearer new-token" (or nothing, when `acceptRenewedToken` is false). */
function protectedRoutes({ acceptRenewedToken = true } = {}): HttpHandler[] {
  return PROTECTED_URLS.map((url) =>
    http.get(`*${API_PATH}${url}`, ({ request }) => {
      const accepted =
        acceptRenewedToken && request.headers.get("Authorization") === "Bearer new-token";
      return accepted
        ? HttpResponse.json({ url })
        : HttpResponse.json(AUTH_REQUIRED, { status: 401 });
    }),
  );
}

/** The refresh endpoint answers per `outcome`, after `hold` resolves when one is given. */
function refreshRoute(outcome: RefreshOutcome, hold?: Promise<void>): HttpHandler {
  return http.post<Record<string, never>, never, LoginResponse | typeof AUTH_REQUIRED>(
    `*${API_PATH}/auth/refresh`,
    async () => {
      await hold;
      if (outcome === "network") return HttpResponse.error();
      if (outcome === "unauthorized") return HttpResponse.json(AUTH_REQUIRED, { status: 401 });
      return HttpResponse.json({ token: "new-token" });
    },
  );
}

function loginRejected(): HttpHandler {
  return http.post(`*${API_PATH}/auth/login`, () =>
    HttpResponse.json({ message: "Invalid username or password." }, { status: 401 }),
  );
}

function pathOf(request: Request) {
  return new URL(request.url).pathname.replace(API_PATH, "");
}

function callsTo(requests: Request[], url: string) {
  return requests.filter((request) => pathOf(request) === url);
}

function authorizations(requests: Request[], url: string) {
  return callsTo(requests, url).map((request) => request.headers.get("Authorization"));
}

/**
 * Sends the three protected requests and resolves `hold` once every one has had its 401 settled,
 * so all of them reach the interceptor while the single renewal is still pending. axios calls
 * `validateStatus` when it settles a response; from there to the interceptor is only microtasks,
 * so one macrotask later every interceptor has joined the renewal.
 */
function sendThreeThenRelease(hold: Deferred) {
  const settled = new Set<string>();
  const requests = PROTECTED_URLS.map((url) =>
    findracoApi.get(url, {
      validateStatus(status) {
        settled.add(url);
        return status >= 200 && status < 300;
      },
    }),
  );
  const released = waitFor(() => expect(settled.size).toBe(PROTECTED_URLS.length))
    .then(() => new Promise((resolve) => setTimeout(resolve, 0)))
    .then(() => hold.resolve());
  return { requests, released };
}

const expiredHandler = vi.fn();

beforeEach(() => {
  setAccessToken("old-token");
  setSessionExpiredHandler(expiredHandler);
});

afterEach(() => {
  setAccessToken(null);
  expiredHandler.mockReset();
  Reflect.deleteProperty(navigator, "locks");
});

describe("findracoApi request defaults", () => {
  it("sends the in-memory access token as a Bearer header and includes credentials", async () => {
    server.use(...protectedRoutes());
    const requests = recordRequests();
    setAccessToken("new-token");

    await findracoApi.get("/plans");

    expect(
      requests.map((request) => ({
        url: pathOf(request),
        authorization: request.headers.get("Authorization"),
        credentials: request.credentials,
      })),
    ).toEqual([{ url: "/plans", authorization: "Bearer new-token", credentials: "include" }]);
  });
});

describe("findracoApi session renewal", () => {
  it("renews once on a 401 and retries the request with the new token (401 → refresh → retry)", async () => {
    expect(navigator.locks).toBeUndefined();
    server.use(...protectedRoutes(), refreshRoute("ok"));
    const requests = recordRequests();

    const response = await findracoApi.get("/plans");

    expect(response.data).toEqual({ url: "/plans" });
    expect(requests.map(pathOf)).toEqual(["/plans", "/auth/refresh", "/plans"]);
    expect(authorizations(requests, "/plans")).toEqual(["Bearer old-token", "Bearer new-token"]);
    expect(callsTo(requests, "/auth/refresh")[0].credentials).toBe("include");
    expect(getAccessToken()).toBe("new-token");
    expect(expiredHandler).not.toHaveBeenCalled();
  });

  it("renews once for three simultaneous 401s and retries each request", async () => {
    const hold = deferred();
    server.use(...protectedRoutes(), refreshRoute("ok", hold.promise));
    const requests = recordRequests();

    const { requests: sent, released } = sendThreeThenRelease(hold);
    await released;

    expect((await Promise.all(sent)).map((response) => response.data)).toEqual([
      { url: "/plans" },
      { url: "/categories" },
      { url: "/transactions" },
    ]);
    expect(callsTo(requests, "/auth/refresh")).toHaveLength(1);
    for (const url of PROTECTED_URLS) {
      expect(authorizations(requests, url)).toEqual(["Bearer old-token", "Bearer new-token"]);
    }
  });

  it("calls the expiry handler once and rejects all three requests with a session-expired error when renewal answers 401", async () => {
    const hold = deferred();
    server.use(...protectedRoutes(), refreshRoute("unauthorized", hold.promise));
    const requests = recordRequests();

    const { requests: sent, released } = sendThreeThenRelease(hold);
    await released;
    const results = await Promise.allSettled(sent);

    expect(results.map((result) => result.status)).toEqual(["rejected", "rejected", "rejected"]);
    results.forEach((result, index) => {
      if (result.status !== "rejected") throw new Error("Expected a rejection");
      expect(result.reason).toBeInstanceOf(SessionExpiredError);
      expect(result.reason.original).toMatchObject({
        config: { url: PROTECTED_URLS[index] },
        response: { status: 401, data: AUTH_REQUIRED },
      });
    });
    expect(callsTo(requests, "/auth/refresh")).toHaveLength(1);
    expect(expiredHandler).toHaveBeenCalledTimes(1);
  });

  it("rejects with the original error and keeps the session when renewal fails without a response", async () => {
    server.use(...protectedRoutes(), refreshRoute("network"));

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
    server.use(loginRejected());
    const requests = recordRequests();

    const error = await findracoApi
      .post("/auth/login", { email: "a@b.c", password: "wrong" })
      .catch((e: unknown) => e);

    expect(error).toMatchObject({
      response: {
        status: 401,
        data: { message: "Invalid username or password." },
      },
    });
    expect(requests.map(pathOf)).toEqual(["/auth/login"]);
    expect(expiredHandler).not.toHaveBeenCalled();
  });

  it("does not retry a retried request a second time", async () => {
    server.use(...protectedRoutes({ acceptRenewedToken: false }), refreshRoute("ok"));
    const requests = recordRequests();

    const error = await findracoApi.get("/plans").catch((e: unknown) => e);

    expect(error).toMatchObject({ response: { status: 401 } });
    expect(callsTo(requests, "/plans")).toHaveLength(2);
    expect(callsTo(requests, "/auth/refresh")).toHaveLength(1);
  });

  it("runs the renewal inside the cross-tab Web Lock when the browser supports it", async () => {
    let lockHeld = false;
    const request = vi.fn(async (name: string, callback: (lock: Lock | null) => unknown) => {
      lockHeld = true;
      try {
        return await callback({ name, mode: "exclusive" });
      } finally {
        lockHeld = false;
      }
    });
    Object.defineProperty(navigator, "locks", {
      value: { request },
      configurable: true,
    });
    const lockStateAtRefresh: boolean[] = [];
    function recordLockState({ request: sent }: { request: Request }) {
      if (pathOf(sent) === "/auth/refresh") lockStateAtRefresh.push(lockHeld);
    }
    server.events.on("request:start", recordLockState);
    server.use(...protectedRoutes(), refreshRoute("ok"));

    try {
      const response = await findracoApi.get("/plans");

      expect(response.data).toEqual({ url: "/plans" });
      expect(request).toHaveBeenCalledTimes(1);
      expect(request.mock.calls[0][0]).toBe("findraco-session-renewal");
      expect(lockStateAtRefresh).toEqual([true]);
    } finally {
      server.events.removeListener("request:start", recordLockState);
    }
  });
});
