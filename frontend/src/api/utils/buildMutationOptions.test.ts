import {
  QueryClient,
  type MutationFunctionContext,
} from "@tanstack/react-query";
import {
  AxiosError,
  AxiosHeaders,
  type InternalAxiosRequestConfig,
} from "axios";
import { toast } from "sonner";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SessionExpiredError } from "../clients/sessionExpiredError";
import { buildMutationOptions } from "./buildMutationOptions";

vi.mock("sonner", () => ({ toast: { error: vi.fn(), success: vi.fn() } }));

const mockedToastError = vi.mocked(toast.error);

const requestConfig: InternalAxiosRequestConfig = {
  headers: new AxiosHeaders(),
};

const apiError = (status: number, message: string) =>
  new AxiosError(
    `Request failed with status code ${status}`,
    AxiosError.ERR_BAD_REQUEST,
    requestConfig,
    null,
    {
      data: { message },
      status,
      statusText: "",
      headers: {},
      config: requestConfig,
    },
  );

const mutationContext: MutationFunctionContext = {
  client: new QueryClient(),
  meta: undefined,
};

afterEach(() => {
  vi.clearAllMocks();
});

describe("buildMutationOptions onError", () => {
  it("shows no error toast when the session could not be renewed, and still calls the caller's onError", () => {
    const onError = vi.fn();
    const error = new SessionExpiredError(
      apiError(401, "Authentication required."),
    );

    buildMutationOptions<void, void>(undefined, { onError }).onError?.(
      error,
      undefined,
      undefined,
      mutationContext,
    );

    expect(mockedToastError).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalledExactlyOnceWith(error);
  });

  it("shows the resolved message for any other error and calls the caller's onError", () => {
    const onError = vi.fn();
    const error = apiError(404, "Category not found.");

    buildMutationOptions<void, void>(undefined, { onError }).onError?.(
      error,
      undefined,
      undefined,
      mutationContext,
    );

    expect(mockedToastError).toHaveBeenCalledExactlyOnceWith(
      "Category not found.",
    );
    expect(onError).toHaveBeenCalledExactlyOnceWith(error);
  });
});
