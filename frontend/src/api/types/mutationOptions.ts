import type { ParseKeys } from "i18next";

/**
 * Options for customizing messages, toast and callbacks in mutation operations.
 */
export type MutationOptions<TData = unknown, TVariables = unknown> = {
  /**
   * Custom success message: a translation key, or a function that builds the text (already translated).
   */
  successMessage?: ParseKeys | ((data: TData, variables: TVariables) => string);

  /**
   * Custom error message: a translation key.
   */
  errorMessage?: ParseKeys;

  /**
   * Determines whether to show a success toast (default: true).
   */
  showSuccessToast?: boolean;

  /**
   * Determines whether to show an error toast (default: true).
   */
  showErrorToast?: boolean;

  /**
   * Callback executed on success.
   */
  onSuccess?: (data: TData, variables: TVariables) => void;

  /**
   * Callback executed on error.
   */
  onError?: (error: Error) => void;

  /**
   * Callback executed when an edit is refused as stale (409 `stale-version`): someone changed the item
   * since it was read. The copy is already shown and the data on screen reloaded; a form closes here.
   */
  onStale?: () => void;
}
