import { act, cleanup, fireEvent, screen, waitFor } from "@testing-library/react";
import { toast } from "sonner";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ToasterView } from "@/app/layout/ToasterView";
import { clearSessionStorage } from "@/lib/storage";
import { pwaRegisterFake } from "@/test/fakePwaRegister";
import { recordRequests } from "@/test/recordRequests";
import { renderWithProviders } from "@/test/renderWithProviders";
import { server } from "@/test/server";
import { versionHandlers } from "@/test/version.handlers";
import { AppUpdateProvider } from "./AppUpdateProvider";
import { useAppUpdate } from "./useAppUpdate";

// Relative to the build under test, so the file does not age with every release bump.
const RUNNING = __APP_VERSION__;
const NEWER = "99.0.0";
const NEWEST = "99.1.0";
const TOAST_TITLE = "New version available";

function Probe() {
  const { state } = useAppUpdate();
  return <div data-testid="state">{state.kind === "available" ? `available ${state.version}` : state.kind}</div>;
}

function renderProvider(route = "/") {
  return renderWithProviders(
    <AppUpdateProvider>
      <Probe />
      <ToasterView />
    </AppUpdateProvider>,
    { route },
  );
}

function bringAppToForeground() {
  return act(async () => {
    document.dispatchEvent(new Event("visibilitychange"));
  });
}

// A toast that must not appear is asserted after a later one has rendered: toasts show in order, so a
// wrongly raised update toast would be on screen by then.
async function expectNoUpdateToast() {
  act(() => {
    toast("Barrier");
  });
  await screen.findByText("Barrier");
  expect(screen.queryByText(TOAST_TITLE)).toBeNull();
}

function versionRequests(requests: Request[]) {
  return requests.filter((request) => new URL(request.url).pathname === "/version.json");
}

beforeEach(() => {
  localStorage.clear();
  pwaRegisterFake.reset();
});

afterEach(() => {
  vi.useRealTimers();
  // The toast store outlives a render; clear it while the Toaster is still mounted.
  act(() => {
    toast.dismiss();
  });
  cleanup();
});

describe("AppUpdateProvider notice", () => {
  it("shows the toast for a newer version with a waiting worker (PWA-03 AC 1)", async () => {
    pwaRegisterFake.setNeedRefresh(true);
    server.use(versionHandlers.manifest({ version: NEWER, minSupported: RUNNING }));

    renderProvider();

    expect(await screen.findByText(TOAST_TITLE)).toBeTruthy();
    expect(screen.getByRole("button", { name: "Update" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Close toast" })).toBeTruthy();
    expect(screen.getByTestId("state").textContent).toBe(`available ${NEWER}`);
  });

  it("shows the toast on a signed-out route (PWA-07 signed out)", async () => {
    pwaRegisterFake.setNeedRefresh(true);
    server.use(versionHandlers.manifest({ version: NEWER, minSupported: RUNNING }));

    renderProvider("/login");

    expect(await screen.findByText(TOAST_TITLE)).toBeTruthy();
  });

  it("shows no toast without a waiting worker (PWA-03 AC 6)", async () => {
    server.use(versionHandlers.manifest({ version: NEWER, minSupported: RUNNING }));
    const requests = recordRequests();

    renderProvider();

    await waitFor(() => expect(versionRequests(requests)).toHaveLength(1));
    await waitFor(() => expect(screen.getByTestId("state").textContent).toBe("none"));
    await expectNoUpdateToast();
  });

  it("does not show a closed toast again for that version, only for a newer one (PWA-03 AC 3)", async () => {
    pwaRegisterFake.setNeedRefresh(true);
    server.use(versionHandlers.manifest({ version: NEWER, minSupported: RUNNING }));
    renderProvider();
    fireEvent.click(await screen.findByRole("button", { name: "Close toast" }));
    await waitFor(() => expect(screen.queryByText(TOAST_TITLE)).toBeNull());

    await bringAppToForeground();

    await waitFor(() => expect(screen.getByTestId("state").textContent).toBe(`available ${NEWER}`));
    await expectNoUpdateToast();

    server.use(versionHandlers.manifest({ version: NEWEST, minSupported: RUNNING }));
    await bringAppToForeground();

    expect(await screen.findByText(TOAST_TITLE)).toBeTruthy();
  });

  it("keeps a closed toast closed after the session is cleared (PWA-03 AC 3)", async () => {
    pwaRegisterFake.setNeedRefresh(true);
    server.use(versionHandlers.manifest({ version: NEWER, minSupported: RUNNING }));
    const first = renderProvider();
    fireEvent.click(await screen.findByRole("button", { name: "Close toast" }));
    await waitFor(() => expect(screen.queryByText(TOAST_TITLE)).toBeNull());

    clearSessionStorage();
    first.unmount();
    renderProvider();

    await waitFor(() => expect(screen.getByTestId("state").textContent).toBe(`available ${NEWER}`));
    await expectNoUpdateToast();
  });

  it("activates the waiting worker from the toast action (PWA-03 AC 2)", async () => {
    pwaRegisterFake.setNeedRefresh(true);
    server.use(versionHandlers.manifest({ version: NEWER, minSupported: RUNNING }));
    renderProvider();

    fireEvent.click(await screen.findByRole("button", { name: "Update" }));

    await waitFor(() => expect(pwaRegisterFake.activateCalls).toBe(1));
  });
});

describe("AppUpdateProvider checks", () => {
  it("reads version.json and asks for a new worker on start-up and on each return to the foreground (PWA-03 AC 8)", async () => {
    server.use(versionHandlers.manifest({ version: RUNNING, minSupported: RUNNING }));
    const requests = recordRequests();

    renderProvider();
    await waitFor(() => expect(versionRequests(requests)).toHaveLength(1));
    expect(pwaRegisterFake.updateCalls).toBe(1);

    await bringAppToForeground();

    await waitFor(() => expect(versionRequests(requests)).toHaveLength(2));
    expect(pwaRegisterFake.updateCalls).toBe(2);
  });

  it("checks again every 60 minutes, not sooner (PWA-03 AC 8)", async () => {
    // Only the interval is faked; the rest of the app and its network keep real time.
    vi.useFakeTimers({ toFake: ["setInterval", "clearInterval"] });
    server.use(versionHandlers.manifest({ version: RUNNING, minSupported: RUNNING }));
    const requests = recordRequests();
    renderProvider();
    await waitFor(() => expect(versionRequests(requests)).toHaveLength(1));
    expect(pwaRegisterFake.updateCalls).toBe(1);

    await act(async () => {
      vi.advanceTimersByTime(59 * 60 * 1000);
    });

    expect(versionRequests(requests)).toHaveLength(1);
    expect(pwaRegisterFake.updateCalls).toBe(1);

    await act(async () => {
      vi.advanceTimersByTime(60 * 1000);
    });

    await waitFor(() => expect(versionRequests(requests)).toHaveLength(2));
    expect(pwaRegisterFake.updateCalls).toBe(2);
  });

  it("keeps the blocking dialog when a later check fails (PWA-04 AC 5)", async () => {
    server.use(versionHandlers.manifest({ version: NEWER, minSupported: NEWER }));
    const requests = recordRequests();
    renderProvider();
    await screen.findByRole("dialog", { name: "Update required" });

    server.use(versionHandlers.serverError());
    await bringAppToForeground();
    await waitFor(() => expect(versionRequests(requests)).toHaveLength(2));
    // Let the failed response be read before asserting that nothing changed.
    await act(async () => {});

    expect(screen.getByRole("dialog", { name: "Update required" })).toBeTruthy();
  });

  it("keeps the update notice when a later check fails (PWA-04 AC 5)", async () => {
    pwaRegisterFake.setNeedRefresh(true);
    server.use(versionHandlers.manifest({ version: NEWER, minSupported: RUNNING }));
    const requests = recordRequests();
    renderProvider();
    await screen.findByText(TOAST_TITLE);

    server.use(versionHandlers.malformed());
    await bringAppToForeground();
    await waitFor(() => expect(versionRequests(requests)).toHaveLength(2));
    await act(async () => {});

    expect(screen.getByTestId("state").textContent).toBe(`available ${NEWER}`);
    expect(screen.getByText(TOAST_TITLE)).toBeTruthy();
  });

  it.each([
    ["answers with a server error", versionHandlers.serverError()],
    ["is malformed", versionHandlers.malformed()],
  ])("shows neither notice nor dialog when version.json %s (PWA-04 AC 5)", async (_name, handler) => {
    pwaRegisterFake.setNeedRefresh(true);
    server.use(handler);
    const requests = recordRequests();

    renderProvider();

    await waitFor(() => expect(versionRequests(requests)).toHaveLength(1));
    // Let the response be read before asserting that nothing came of it.
    await act(async () => {});
    expect(screen.getByTestId("state").textContent).toBe("none");
    await expectNoUpdateToast();
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});

describe("AppUpdateProvider required update", () => {
  const requiredManifest = { version: NEWER, minSupported: NEWER };

  it("blocks with the dialog, and keeps a single one across repeated checks (PWA-04 AC 2, PWA-07 single dialog)", async () => {
    server.use(versionHandlers.manifest(requiredManifest));
    const requests = recordRequests();
    renderProvider();

    const dialog = await screen.findByRole("dialog", { name: "Update required" });
    expect(dialog.textContent).toContain("A new version of findraco is needed to continue.");

    await bringAppToForeground();
    await bringAppToForeground();
    await waitFor(() => expect(versionRequests(requests)).toHaveLength(3));

    expect(screen.getAllByRole("dialog")).toHaveLength(1);
  });

  it("activates the waiting worker from the dialog (PWA-04 AC 3)", async () => {
    pwaRegisterFake.setNeedRefresh(true);
    server.use(versionHandlers.manifest(requiredManifest));
    renderProvider();

    fireEvent.click(await screen.findByRole("button", { name: "Update" }));

    await waitFor(() => expect(pwaRegisterFake.activateCalls).toBe(1));
  });

  it("fetches the new worker first, then activates it, when none waits (PWA-04 AC 3)", async () => {
    server.use(versionHandlers.manifest(requiredManifest));
    renderProvider();
    const button = await screen.findByRole("button", { name: "Update" });
    await waitFor(() => expect(pwaRegisterFake.updateCalls).toBe(1));
    pwaRegisterFake.installWorkerOnUpdate();

    fireEvent.click(button);

    await waitFor(() => expect(pwaRegisterFake.activateCalls).toBe(1));
    expect(pwaRegisterFake.updateCalls).toBe(2);
  });
});
