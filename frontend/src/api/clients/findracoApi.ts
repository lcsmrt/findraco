import axios from "axios";
import { LoginResponse } from "../dtos";
import { getAccessToken, setAccessToken } from "./accessToken";

declare module "axios" {
  interface AxiosRequestConfig {
    /** Set on the single retry that follows a session renewal. */
    sessionRetried?: boolean;
  }
}

const SESSION_RENEWAL_LOCK = "findraco-session-renewal";

// In production the SPA is served by the same nginx that proxies /api to the API,
// so a same-origin path is all it needs — no build-time configuration. The env var
// only exists for development, where Vite serves the app and the API is elsewhere.
// `withCredentials` lets the HttpOnly session cookie reach /auth/* cross-origin in dev.
export const findracoApi = axios.create({
  baseURL: import.meta.env.VITE_FINDRACO_API_URL ?? "/api/findraco",
  withCredentials: true,
});

let onSessionExpired: () => void = () => {};

/**
 * Registers what to do when the session can no longer be renewed.
 * @param handler Called once per failed renewal.
 */
export const setSessionExpiredHandler = (handler: () => void): void => {
  onSessionExpired = handler;
};

const requestNewAccessToken = async (): Promise<string> => {
  const { data } = await findracoApi.post<LoginResponse>("/auth/refresh");
  setAccessToken(data.token);
  return data.token;
};

// Tabs share the cookie jar: the Web Lock makes them rotate the session token
// one after another. Browsers without the API rely on the server's grace window.
const requestNewAccessTokenExclusively = (): Promise<string> =>
  navigator.locks
    ? navigator.locks.request(SESSION_RENEWAL_LOCK, requestNewAccessToken)
    : requestNewAccessToken();

let pendingRenewal: Promise<string> | null = null;

/**
 * Exchanges the session cookie for a new access token and stores it. Concurrent
 * callers share one request; a 401 answer fires the session-expired handler once.
 * @returns The new access token.
 */
export const renewSession = (): Promise<string> => {
  pendingRenewal ??= requestNewAccessTokenExclusively()
    .catch((error: unknown) => {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        onSessionExpired();
      }
      throw error;
    })
    .finally(() => {
      pendingRenewal = null;
    });

  return pendingRenewal;
};

findracoApi.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken();

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

findracoApi.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (
      !axios.isAxiosError(error) ||
      error.response?.status !== 401 ||
      !error.config ||
      error.config.sessionRetried ||
      error.config.url?.startsWith("/auth/")
    ) {
      return Promise.reject(error);
    }

    const { config } = error;

    try {
      await renewSession();
    } catch {
      // Expired session: the handler already ran. Network failure: the caller
      // sees the original error and stays signed in.
      return Promise.reject(error);
    }

    return findracoApi.request({ ...config, sessionRetried: true });
  },
);
