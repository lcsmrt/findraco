/** The non-standard event Chromium fires when the app can be installed. */
export type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

type InstallPromptSnapshot = {
  prompt: BeforeInstallPromptEvent | null;
  installed: boolean;
};

function isBeforeInstallPromptEvent(event: Event): event is BeforeInstallPromptEvent {
  return "prompt" in event && typeof event.prompt === "function" && "userChoice" in event;
}

// Lives outside React because the browser fires the event once, early, usually before React mounts.
// Listening only inside the provider would lose it.
export function createInstallPromptStore() {
  let snapshot: InstallPromptSnapshot = { prompt: null, installed: false };
  const listeners = new Set<() => void>();

  function setSnapshot(next: InstallPromptSnapshot) {
    snapshot = next;
    listeners.forEach((listener) => listener());
  }

  return {
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    getSnapshot: () => snapshot,
    /** Starts listening; call before React mounts. Returns the function that stops listening. */
    listen(target: Window) {
      function onBeforeInstallPrompt(event: Event) {
        if (!isBeforeInstallPromptEvent(event)) return;
        // Stops the browser's own mini-infobar; the app offers the install from its menu instead.
        event.preventDefault();
        setSnapshot({ ...snapshot, prompt: event });
      }
      function onAppInstalled() {
        setSnapshot({ prompt: null, installed: true });
      }
      target.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      target.addEventListener("appinstalled", onAppInstalled);
      return () => {
        target.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
        target.removeEventListener("appinstalled", onAppInstalled);
      };
    },
    /** A captured event can prompt only once, so using it empties the store. */
    takePrompt() {
      const { prompt } = snapshot;
      if (prompt) setSnapshot({ ...snapshot, prompt: null });
      return prompt;
    },
    markInstalled() {
      setSnapshot({ prompt: null, installed: true });
    },
  };
}

export type InstallPromptStore = ReturnType<typeof createInstallPromptStore>;

export const installPromptStore = createInstallPromptStore();
