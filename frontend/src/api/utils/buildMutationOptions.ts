import { UseMutationOptions } from "@tanstack/react-query";
import { SessionExpiredError } from "../clients/sessionExpiredError";
import { MutationOptions } from "../types/mutationOptions";
import { problemToast } from "./problems";
import { resolveSuccessMessage } from "./resolveSuccessMessage";
import { toast } from "sonner";

type MutationDefaults<TData, TVariables> = Omit<
  MutationOptions<TData, TVariables>,
  "onSuccess" | "onError"
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

  const { onSuccess, onError } = options ?? {};

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
    onError: (error) => {
      // A failed renewal already showed the session-expired message.
      if (showErrorToast && !(error instanceof SessionExpiredError)) {
        const { message, description } = problemToast(error, errorMessage);
        toast.error(message, description ? { description } : undefined);
      }
      onError?.(error);
    },
  };
}
