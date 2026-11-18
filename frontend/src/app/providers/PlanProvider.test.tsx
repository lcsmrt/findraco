import { cleanup, fireEvent, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { setAccessToken } from "@/api/clients/accessToken";
import type { Plan, User } from "@/api/dtos";
import { authHandlers } from "@/api/services/auth.handlers";
import { planHandlers } from "@/api/services/plan.handlers";
import { PlanFiltersGate } from "@/app/routing/PlanFiltersGate";
import { OVERVIEW_PARAM_KEYS } from "@/features/overview/filters/overviewParams";
import { renderWithProviders } from "@/test/renderWithProviders";
import { server } from "@/test/server";
import { AuthProvider } from "./AuthProvider";
import { PlanProvider } from "./PlanProvider";
import { useAuth } from "./useAuth";
import { usePlanContext } from "./usePlanContext";

const PROFILE: User = {
  id: 1,
  name: "Ana Lima",
  email: "ana@example.com",
  timeZone: "America/Sao_Paulo",
  timeZoneMode: "AUTOMATIC",
  language: null,
};

function plan(id: number, name: string, isDefault: boolean): Plan {
  return {
    id,
    name,
    isDefault,
    myRole: "OWNER",
    permissions: { createTransactions: true, attributeToOthers: true, manageCategories: true, managePlan: true },
  };
}

const HOME = plan(1, "Home", true);
const TRIPS = plan(3, "Trips", false);

/** What the screen behind the gate shows: the plan it was rendered for. */
function Screen() {
  const { activePlan } = usePlanContext();
  return <div data-testid="screen">{activePlan?.name}</div>;
}

function Session() {
  const { status, signIn } = useAuth();
  const { activePlanId } = usePlanContext();
  return (
    <>
      <div data-testid="status">{status}</div>
      <div data-testid="active-plan-id">{String(activePlanId)}</div>
      <button type="button" onClick={() => void signIn("signed-in-token")}>
        Sign in
      </button>
    </>
  );
}

function renderApp(route: string) {
  return renderWithProviders(
    <AuthProvider>
      <PlanProvider>
        <Session />
        <PlanFiltersGate screen="overview" paramKeys={OVERVIEW_PARAM_KEYS}>
          <Screen />
        </PlanFiltersGate>
      </PlanProvider>
    </AuthProvider>,
    { route },
  );
}

beforeEach(() => {
  localStorage.clear();
  setAccessToken(null);
});

afterEach(() => {
  cleanup();
});

describe("PlanProvider", () => {
  it("reloading a link to a non-default plan renders that plan", async () => {
    localStorage.setItem("hasSession", "true");
    localStorage.setItem("activePlanId", "3");
    server.use(
      authHandlers.refresh({ token: "renewed-token" }),
      authHandlers.me(PROFILE),
      planHandlers.list([HOME, TRIPS]),
    );

    renderApp("/overview?plan=3");

    await waitFor(() => expect(screen.getByTestId("screen").textContent).toBe("Trips"));
  });

  it("a link to a non-default plan opened after sign-in renders that plan", async () => {
    server.use(authHandlers.me(PROFILE), planHandlers.list([HOME, TRIPS]));

    renderApp("/overview?plan=3");
    expect(screen.queryByTestId("screen")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));

    await waitFor(() => expect(screen.getByTestId("screen").textContent).toBe("Trips"));
  });

  it("keeps the stored active plan while the session is restoring", async () => {
    localStorage.setItem("hasSession", "true");
    localStorage.setItem("activePlanId", "3");
    server.use(
      authHandlers.refresh({ token: "renewed-token" }),
      authHandlers.me(PROFILE),
      planHandlers.list([HOME, TRIPS]),
    );

    renderApp("/overview?plan=3");

    expect(screen.getByTestId("status").textContent).toBe("loading");
    expect(screen.getByTestId("active-plan-id").textContent).toBe("3");
    expect(localStorage.getItem("activePlanId")).toBe("3");

    await waitFor(() => expect(screen.getByTestId("status").textContent).toBe("authenticated"));
    expect(screen.getByTestId("active-plan-id").textContent).toBe("3");
  });
});
