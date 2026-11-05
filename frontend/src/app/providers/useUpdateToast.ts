import { useEffect } from "react";
import { toast } from "sonner";
import { i18n } from "@/i18n/i18n";
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
    toast(i18n.t("app.updateToast.available"), {
      id: "app-update",
      duration: Infinity,
      action: { label: i18n.t("app.updateToast.update"), onClick: update },
      onDismiss: () => onDismiss(version),
    });
  }, [version, update, onDismiss]);
}
