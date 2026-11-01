import { createContext, useContext } from "react";

export type InstallMode = "native" | "ios";

export type InstallAppContextValue = {
  /** How the app can be installed here; null when it cannot or already is. */
  mode: InstallMode | null;
  /** Opens the browser's install prompt, or the iOS instructions. */
  install: () => void;
  instructionsOpen: boolean;
  closeInstructions: () => void;
};

export const InstallAppContext = createContext<InstallAppContextValue | null>(null);

export function useInstallApp() {
  const context = useContext(InstallAppContext);
  if (!context) throw new Error("useInstallApp must be used within an InstallAppProvider");
  return context;
}
