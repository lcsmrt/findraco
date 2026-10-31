import { UseMutationOptions } from "@tanstack/react-query";
import { SessionExpiredError } from "../clients/sessionExpiredError";
import { MutationOptions } from "../types/mutationOptions";
import { problemToast, problemType } from "./problems";
import { resolveSuccessMessage } from "./resolveSuccessMessage";
import { toast } from "sonner";

type MutationDefaults<TData, TVariables> = Omit<
  MutationOptions<TData, TVariables>,
  "onSuccess" | "onError" | "onStale"
>;

/**
 * Builds TanStack mutation callbacks with toast handling.
 * @param defaults Service-level defaults (messages, toast flags). All fields optional.
 * @param options Caller overrides — same shape, takes precedence over defaults.
 */
export function buildMutationOptions<TData, TVariables>(
  defaults?: MutationDefaults<TData, TVariables>,
  options?: MutationOptions<TData, TVariables>,
): Pick<UseMutationOptions<TData, Error, TVariables>, "onSuccess" | "onError"> {
  const {
    successMessage,
    errorMessage,
    showSuccessToast = true,
    showErrorToast = true,
  } = { ...defaults, ...options };

  const { onSuccess, onError, onStale } = options ?? {};

  return {
    onSuccess: (data, variables) => {
      if (showSuccessToast) {
        toast.success(
          resolveSuccessMessage({
            message: successMessage,
            data,
            variables,
            fallbackMessage: "Operation completed successfully.",
          }),
        );
      }
      onSuccess?.(data, variables);
    },
    onError: (error, _variables, _onMutateResult, context) => {
      // A failed renewal already showed the session-expired message.
      if (showErrorToast && !(error instanceof SessionExpiredError)) {
        const { message, description } = problemToast(error, errorMessage);
        toast.error(message, description ? { description } : undefined);
      }
      if (problemType(error) === "stale-version") {
        // Someone changed the item since it was read: reload what is on screen, so the next edit
        // starts from the stored version instead of failing again.
        void context.client.invalidateQueries();
        onStale?.();
      }
      onError?.(error);
    },
  };
}
