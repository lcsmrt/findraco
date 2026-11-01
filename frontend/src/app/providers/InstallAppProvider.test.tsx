import { act, cleanup, fireEvent, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "@/test/renderWithProviders";
import { InstallAppProvider } from "./InstallAppProvider";
import { createInstallPromptStore, type InstallPromptStore } from "./installPromptStore";
import { useInstallApp } from "./useInstallApp";

const IPHONE =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1";

function Probe() {
  const { mode, install, instructionsOpen } = useInstallApp();
  return (
    <div>
      <div data-testid="mode">{mode ?? "none"}</div>
      <div data-testid="instructions">{instructionsOpen ? "open" : "closed"}</div>
      <button onClick={install}>Install</button>
    </div>
  );
}

let store: InstallPromptStore;
let stopListening: () => void;

function renderProvider() {
  return renderWithProviders(
    <InstallAppProvider store={store}>
      <Probe />
    </InstallAppProvider>,
  );
}

function stubDisplayModeStandalone(standalone: boolean) {
  vi.stubGlobal("matchMedia", (query: string) => ({ matches: standalone, media: query }));
}

function offerInstallation(outcome: "accepted" | "dismissed" = "accepted") {
  const prompt = vi.fn(() => Promise.resolve());
  const event = Object.assign(new Event("beforeinstallprompt", { cancelable: true }), {
    prompt,
    userChoice: Promise.resolve({ outcome }),
  });
  act(() => {
    window.dispatchEvent(event);
  });
  return { event, prompt };
}

function mode() {
  return screen.getByTestId("mode").textContent;
}

beforeEach(() => {
  store = createInstallPromptStore();
  stopListening = store.listen(window);
  stubDisplayModeStandalone(false);
});

afterEach(() => {
  cleanup();
  stopListening();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("InstallAppProvider", () => {
  it("offers the native prompt once the browser has offered installation (PWA-05 AC 1)", () => {
    renderProvider();
    expect(mode()).toBe("none");

    const { event, prompt } = offerInstallation();

    expect(event.defaultPrevented).toBe(true);
    expect(mode()).toBe("native");
    fireEvent.click(screen.getByRole("button", { name: "Install" }));
    expect(prompt).toHaveBeenCalledTimes(1);
  });

  it("catches an offer made before the provider mounted (PWA-05 AC 1)", () => {
    offerInstallation();

    renderProvider();

    expect(mode()).toBe("native");
  });

  it("hides the item once the prompt is accepted (PWA-05 AC 5)", async () => {
    renderProvider();
    offerInstallation("accepted");

    fireEvent.click(screen.getByRole("button", { name: "Install" }));

    await waitFor(() => expect(mode()).toBe("none"));
  });

  it("hides the item when the app reports being installed (PWA-05 AC 5)", () => {
    renderProvider();
    offerInstallation();

    act(() => {
      window.dispatchEvent(new Event("appinstalled"));
    });

    expect(mode()).toBe("none");
  });

  it("shows the iOS instructions outside standalone mode (PWA-05 AC 2)", () => {
    vi.spyOn(navigator, "userAgent", "get").mockReturnValue(IPHONE);
    renderProvider();

    expect(mode()).toBe("ios");
    expect(screen.getByTestId("instructions").textContent).toBe("closed");
    fireEvent.click(screen.getByRole("button", { name: "Install" }));
    expect(screen.getByTestId("instructions").textContent).toBe("open");
  });

  it("offers nothing in standalone mode (PWA-05 AC 3)", () => {
    stubDisplayModeStandalone(true);
    vi.spyOn(navigator, "userAgent", "get").mockReturnValue(IPHONE);
    renderProvider();
    offerInstallation();

    expect(mode()).toBe("none");
  });

  it("offers nothing without an offer and outside iOS (PWA-05 AC 4)", () => {
    renderProvider();

    expect(mode()).toBe("none");
  });
});
