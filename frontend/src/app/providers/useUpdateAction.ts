import { useCallback, useEffect, useRef } from "react";

const WORKER_WAIT_MS = 10_000;

type UpdateActionInput = {
  needRefresh: boolean;
  checkForUpdate: () => Promise<void>;
  activateUpdate: () => Promise<void>;
};

/**
 * Takes the app to the newest version. A waiting worker is activated at once; otherwise the browser
 * is asked for one and given a short while to install it. If none arrives (no worker support, or an
 * install that failed) the page reloads: only on this tap, so a failed install cannot loop.
 */
export function useUpdateAction({ needRefresh, checkForUpdate, activateUpdate }: UpdateActionInput) {
  const waitingRef = useRef(needRefresh);
  const resolversRef = useRef<Array<() => void>>([]);

  useEffect(() => {
    waitingRef.current = needRefresh;
    if (!needRefresh) return;
    resolversRef.current.forEach((resolve) => resolve());
    resolversRef.current = [];
  }, [needRefresh]);

  const waitForWorker = useCallback(() => {
    if (waitingRef.current) return Promise.resolve(true);
    return new Promise<boolean>((resolve) => {
      const timer = setTimeout(() => resolve(false), WORKER_WAIT_MS);
      resolversRef.current.push(() => {
        clearTimeout(timer);
        resolve(true);
      });
    });
  }, []);

  const run = useCallback(async () => {
    if (!waitingRef.current) {
      await checkForUpdate();
      if (!(await waitForWorker())) {
        window.location.reload();
        return;
      }
    }
    await activateUpdate();
  }, [checkForUpdate, activateUpdate, waitForWorker]);

  return useCallback(() => void run(), [run]);
}
