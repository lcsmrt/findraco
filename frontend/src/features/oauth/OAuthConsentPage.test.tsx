import { oauthHandlers } from "@/api/services/oauth.handlers";
import { renderWithProviders } from "@/test/renderWithProviders";
import { server } from "@/test/server";
import { cleanup, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { OAuthConsentPage } from "./OAuthConsentPage";

const ROUTE =
  "/oauth/consent?client_id=https%3A%2F%2Fclaude.ai%2Fclient&scope=findraco.mcp&state=state-xyz";

beforeEach(() => {
  document.cookie = "XSRF-TOKEN=csrf-123; path=/";
});

afterEach(() => {
  document.cookie = "XSRF-TOKEN=; path=/; max-age=0";
  cleanup();
});

async function decide(label: "Allow" | "Deny") {
  const user = userEvent.setup();
  const button = await screen.findByRole("button", { name: label });
  const form = button.closest("form")!;
  let decision: Record<string, FormDataEntryValue> = {};
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    decision = Object.fromEntries(new FormData(form, event.submitter));
  });
  await user.click(button);
  return { form, decision };
}

describe("OAuthConsentPage", () => {
  it("posts the decision to the authorization server", async () => {
    server.use(oauthHandlers.clientInfo({ name: "Claude", redirectHost: "claude.ai" }));
    renderWithProviders(<OAuthConsentPage />, { route: ROUTE });

    const allow = await decide("Allow");
    expect(allow.form.getAttribute("action")).toBe("/oauth2/authorize");
    expect(allow.form.method).toBe("post");
    expect(allow.decision).toEqual({
      client_id: "https://claude.ai/client",
      state: "state-xyz",
      scope: "findraco.mcp",
      _csrf: "csrf-123",
      consent_action: "allow",
    });

    expect((await decide("Deny")).decision).toMatchObject({ consent_action: "deny" });
  });

  it("offers no decision when the app is unknown", async () => {
    server.use(oauthHandlers.clientNotFound());
    renderWithProviders(<OAuthConsentPage />, { route: ROUTE });

    expect(await screen.findByRole("heading", { level: 1, name: "App not recognized" })).toBeTruthy();
    expect(screen.queryByRole("button")).toBeNull();
  });
});
