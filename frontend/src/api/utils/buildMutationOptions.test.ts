import {
  QueryClient,
  type MutationFunctionContext,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { afterEach, describe, expect, it, vi } from "vitest";
import { problemError } from "@/test/problems";
import { SessionExpiredError } from "../clients/sessionExpiredError";
import { buildMutationOptions } from "./buildMutationOptions";

vi.mock("sonner", () => ({ toast: { error: vi.fn(), success: vi.fn() } }));

const mockedToastError = vi.mocked(toast.error);

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
      problemError(401, "session-invalid"),
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

  it("shows the type's copy and the request id, never the detail, and calls the caller's onError (BST-08 AC 11)", () => {
    const onError = vi.fn();
    const error = problemError(404, "category-not-found", { requestId: "req-1" });

    buildMutationOptions<void, void>(undefined, { onError }).onError?.(
      error,
      undefined,
      undefined,
      mutationContext,
    );

    expect(mockedToastError).toHaveBeenCalledExactlyOnceWith(
      "This category no longer exists.",
      { description: "Request id: req-1" },
    );
    expect(onError).toHaveBeenCalledExactlyOnceWith(error);
  });
});

describe("buildMutationOptions on a stale edit", () => {
  it("shows the stale-version copy, reloads the data on screen and calls onStale (BST-06 AC 11)", () => {
    const onStale = vi.fn();
    const onError = vi.fn();
    const client = new QueryClient();
    const invalidate = vi.spyOn(client, "invalidateQueries");
    const error = problemError(409, "stale-version");

    buildMutationOptions<void, void>(undefined, { onStale, onError }).onError?.(
      error,
      undefined,
      undefined,
      { client, meta: undefined },
    );

    expect(mockedToastError).toHaveBeenCalledExactlyOnceWith(
      "Someone else changed this in the meantime. Reload it and try again.",
      undefined,
    );
    expect(invalidate).toHaveBeenCalledExactlyOnceWith();
    expect(onStale).toHaveBeenCalledOnce();
    expect(onError).toHaveBeenCalledExactlyOnceWith(error);
  });

  it("reloads nothing and calls no onStale for any other error", () => {
    const onStale = vi.fn();
    const client = new QueryClient();
    const invalidate = vi.spyOn(client, "invalidateQueries");

    buildMutationOptions<void, void>(undefined, { onStale }).onError?.(
      problemError(409, "category-in-use"),
      undefined,
      undefined,
      { client, meta: undefined },
    );

    expect(invalidate).not.toHaveBeenCalled();
    expect(onStale).not.toHaveBeenCalled();
  });
});
