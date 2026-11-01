import { useRegisterSW } from "virtual:pwa-register/react";
import { useCallback, useRef } from "react";

type ServiceWorkerState = {
  /** A new worker finished installing and waits to take over. */
  needRefresh: boolean;
  /** Asks the browser to look for a new worker now; resolves when the look is done. */
  checkForUpdate: () => Promise<void>;
  /** Hands control to the waiting worker; the page reloads once it has it. */
  activateUpdate: () => Promise<void>;
};

// The one seam over the plugin's virtual module, so the rest of the app and its tests never touch it.
export function useServiceWorker(): ServiceWorkerState {
  const registrationRef = useRef<ServiceWorkerRegistration | undefined>(undefined);
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_swUrl, registration) {
      registrationRef.current = registration;
    },
  });

  const checkForUpdate = useCallback(async () => {
    // The browser only checks on navigation; a standalone app is rarely navigated, so ask it.
    if (!navigator.onLine) return;
    try {
      await registrationRef.current?.update();
    } catch {
      // A failed look is the same as no new version; the next trigger asks again.
    }
  }, []);

  const activateUpdate = useCallback(() => updateServiceWorker(true), [updateServiceWorker]);

  return { needRefresh, checkForUpdate, activateUpdate };
}
