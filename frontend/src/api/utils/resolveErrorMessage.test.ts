import { AxiosError, AxiosHeaders, type InternalAxiosRequestConfig } from "axios";
import { describe, expect, it } from "vitest";
import { resolveErrorMessage } from "./resolveErrorMessage";

const requestConfig: InternalAxiosRequestConfig = { headers: new AxiosHeaders() };

function apiError(data: unknown) {
  return new AxiosError("Request failed with status code 400", AxiosError.ERR_BAD_REQUEST, requestConfig, null, {
    data,
    status: 400,
    statusText: "",
    headers: {},
    config: requestConfig,
  });
}

describe("resolveErrorMessage", () => {
  it("shows the API's message, not axios's own", () => {
    expect(resolveErrorMessage({ error: apiError({ message: "Amount must be positive." }) })).toBe(
      "Amount must be positive.",
    );
  });

  it("joins a list of API messages with commas", () => {
    expect(resolveErrorMessage({ error: apiError({ message: ["Name is required", "Email is invalid"] }) })).toBe(
      "Name is required, Email is invalid",
    );
  });

  it("shows a plain error's message", () => {
    expect(resolveErrorMessage({ error: new Error("Boom"), fallbackMessage: "Could not save." })).toBe("Boom");
  });

  it("falls back for an error with no message and for a value that is not an error", () => {
    const networkError = new AxiosError("Network Error", AxiosError.ERR_NETWORK);

    expect(resolveErrorMessage({ error: networkError, fallbackMessage: "Could not save." })).toBe("Could not save.");
    expect(resolveErrorMessage({ error: new Error(""), fallbackMessage: "Could not save." })).toBe("Could not save.");
    expect(resolveErrorMessage({ error: "Boom", fallbackMessage: "Could not save." })).toBe("Could not save.");
  });

  it("uses the generic message without a fallback", () => {
    expect(resolveErrorMessage({ error: undefined })).toBe("An unexpected error occurred.");
  });
});
