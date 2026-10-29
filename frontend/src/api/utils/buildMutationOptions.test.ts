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
