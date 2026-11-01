import { useEffect, useSyncExternalStore } from "react";

// Stands in for the plugin's virtual module, which only exists in a real build. Tests drive the
// worker through `pwaRegisterFake` and read what the app asked of it.
type FakeRegistration = { update: () => Promise<void> };
type FakeOptions = {
  onRegisteredSW?: (swUrl: string, registration: FakeRegistration) => void;
};

const listeners = new Set<() => void>();
let needRefresh = false;
let workerAppearsOnUpdate = false;
let updateCalls = 0;
let activateCalls = 0;

function notify() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

const registration: FakeRegistration = {
  async update() {
    updateCalls += 1;
    if (workerAppearsOnUpdate) pwaRegisterFake.setNeedRefresh(true);
  },
};

export const pwaRegisterFake = {
  setNeedRefresh(value: boolean) {
    needRefresh = value;
    notify();
  },
  /** The next `registration.update()` finds and installs a new worker. */
  installWorkerOnUpdate() {
    workerAppearsOnUpdate = true;
  },
  get updateCalls() {
    return updateCalls;
  },
  get activateCalls() {
    return activateCalls;
  },
  reset() {
    needRefresh = false;
    workerAppearsOnUpdate = false;
    updateCalls = 0;
    activateCalls = 0;
    notify();
  },
};

export function useRegisterSW(options: FakeOptions = {}) {
  const current = useSyncExternalStore(subscribe, () => needRefresh);
  const { onRegisteredSW } = options;
  useEffect(() => {
    onRegisteredSW?.("/sw.js", registration);
  }, [onRegisteredSW]);
  return {
    needRefresh: [current, pwaRegisterFake.setNeedRefresh] as const,
    offlineReady: [false, () => undefined] as const,
    async updateServiceWorker() {
      activateCalls += 1;
    },
  };
}
