import { useEffect } from "react";
import { toast } from "sonner";
import type { UpdateState } from "./utils/appUpdate";

/**
 * Shows the update notice once per version. A fixed id keeps a single toast however often the state
 * changes. The toast is never dismissed from code: sonner reports a programmatic dismissal through
 * `onDismiss` too, which would record a version the member never closed.
 */
export function useUpdateToast(
  state: UpdateState,
  update: () => void,
  onDismiss: (version: string) => void,
) {
  const version = state.kind === "available" && state.showToast ? state.version : null;

  useEffect(() => {
    if (version === null) return;
    toast("New version available", {
      id: "app-update",
      duration: Infinity,
      action: { label: "Update", onClick: update },
      onDismiss: () => onDismiss(version),
    });
  }, [version, update, onDismiss]);
}
