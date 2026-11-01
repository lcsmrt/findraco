import { useCallback, useState, useSyncExternalStore, type ReactNode } from "react";
import { installPromptStore, type InstallPromptStore } from "./installPromptStore";
import { InstallAppContext, type InstallMode } from "./useInstallApp";
import { isIos, isStandalone } from "./utils/platform";

type InstallAppProviderProps = {
  children: ReactNode;
  /** Defaults to the store `index.tsx` started before React mounted. */
  store?: InstallPromptStore;
};

function detectMode(offeredByBrowser: boolean, installed: boolean): InstallMode | null {
  const standalone = isStandalone({
    displayModeStandalone: window.matchMedia("(display-mode: standalone)").matches,
    // Only iOS Safari defines it, so the DOM type does not.
    navigatorStandalone: "standalone" in navigator ? navigator.standalone === true : undefined,
  });
  if (standalone || installed) return null;
  if (offeredByBrowser) return "native";
  return isIos(navigator.userAgent, navigator.maxTouchPoints) ? "ios" : null;
}

export function InstallAppProvider({ children, store = installPromptStore }: InstallAppProviderProps) {
  const { prompt, installed } = useSyncExternalStore(store.subscribe, store.getSnapshot);
  const [instructionsOpen, setInstructionsOpen] = useState(false);
  const mode = detectMode(prompt !== null, installed);

  const install = useCallback(() => {
    const captured = store.takePrompt();
    if (!captured) {
      setInstructionsOpen(true);
      return;
    }
    void captured.prompt().then(async () => {
      const { outcome } = await captured.userChoice;
      if (outcome === "accepted") store.markInstalled();
    });
  }, [store]);

  const closeInstructions = useCallback(() => setInstructionsOpen(false), []);

  return (
    <InstallAppContext.Provider value={{ mode, install, instructionsOpen, closeInstructions }}>
      {children}
    </InstallAppContext.Provider>
  );
}
