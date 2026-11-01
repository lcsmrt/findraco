import { useCallback, useState, type ReactNode } from "react";
import { z } from "zod";
import { UpdateRequiredDialogView } from "@/app/layout/UpdateRequiredDialogView";
import { getItemFromStorage, storeItem } from "@/lib/storage";
import { useServiceWorker } from "./serviceWorker";
import { AppUpdateContext } from "./useAppUpdate";
import { useUpdateAction } from "./useUpdateAction";
import { useUpdateToast } from "./useUpdateToast";
import { useVersionManifest } from "./useVersionManifest";
import { decideUpdate } from "./utils/appUpdate";

type AppUpdateProviderProps = {
  children: ReactNode;
};

export function AppUpdateProvider({ children }: AppUpdateProviderProps) {
  const { needRefresh, checkForUpdate, activateUpdate } = useServiceWorker();
  const manifest = useVersionManifest(checkForUpdate);
  const [dismissedVersion, setDismissedVersion] = useState(() =>
    getItemFromStorage("dismissedUpdate", z.string()),
  );
  const update = useUpdateAction({ needRefresh, checkForUpdate, activateUpdate });
  const state = decideUpdate({ running: __APP_VERSION__, manifest, needRefresh, dismissedVersion });

  const dismiss = useCallback((version: string) => {
    storeItem("dismissedUpdate", version);
    setDismissedVersion(version);
  }, []);
  useUpdateToast(state, update, dismiss);

  return (
    <AppUpdateContext.Provider value={{ state, update }}>
      {children}
      {state.kind === "required" && <UpdateRequiredDialogView onUpdate={update} />}
    </AppUpdateContext.Provider>
  );
}
