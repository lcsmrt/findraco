import { PlanContext, type PlanContextValue } from "@/app/providers/usePlanContext";
import type { AuthContextValue } from "@/app/providers/useAuth";
import { renderWithProviders } from "@/test/renderWithProviders";
import { cleanup, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Navbar } from "./Navbar";

afterEach(cleanup);

const auth: AuthContextValue = {
  user: {
    id: 1,
    name: "Ana Lima",
    email: "ana@example.com",
    timeZone: "America/Sao_Paulo",
    timeZoneMode: "AUTOMATIC",
    language: null,
  },
  setUser: vi.fn(),
  status: "authenticated",
  signIn: vi.fn(),
  signOut: vi.fn(),
  retry: vi.fn(),
  announceSessionExpiry: vi.fn(),
};
const plan: PlanContextValue = {
  plans: [],
  activePlanId: null,
  activePlan: undefined,
  setActivePlanId: vi.fn(),
  isLoading: false,
};

describe("Navbar language entry", () => {
  it("offers English and Português (Brasil)", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <PlanContext.Provider value={plan}>
        <Navbar />
      </PlanContext.Provider>,
      {
        auth,
        theme: { theme: "light", setTheme: vi.fn(), toggleTheme: vi.fn() },
        appUpdate: { state: { kind: "none" }, update: vi.fn() },
        installApp: { mode: null, install: vi.fn(), instructionsOpen: false, closeInstructions: vi.fn() },
      },
    );

    await user.click(screen.getByText("AL"));
    await user.click(await screen.findByRole("menuitem", { name: "Language / Idioma" }));

    expect(await screen.findByRole("radio", { name: "English" })).toBeDefined();
    expect(screen.getByRole("radio", { name: "Português (Brasil)" })).toBeDefined();
  });
});
