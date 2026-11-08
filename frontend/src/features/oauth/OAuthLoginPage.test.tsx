import { renderWithProviders } from "@/test/renderWithProviders";
import { cleanup, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { OAuthLoginPage } from "./OAuthLoginPage";

beforeEach(() => {
  document.cookie = "XSRF-TOKEN=csrf-123; path=/";
});

afterEach(() => {
  document.cookie = "XSRF-TOKEN=; path=/; max-age=0";
  cleanup();
});

describe("OAuthLoginPage", () => {
  it("submits the form to the authorization server", async () => {
    const user = userEvent.setup();
    renderWithProviders(<OAuthLoginPage />, { route: "/oauth/login" });
    await user.type(screen.getByLabelText("Email"), "ana@example.com");
    await user.type(screen.getByLabelText("Password", { selector: "input" }), "s3cret-pass");

    const form = screen.getByRole("button", { name: "Sign in" }).closest("form")!;
    const submitted = new Promise<FormData>((resolve) => {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        resolve(new FormData(form));
      });
    });
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    expect(form.method).toBe("post");
    expect(form.getAttribute("action")).toBe("/oauth2/login");
    expect(Object.fromEntries(await submitted)).toEqual({
      email: "ana@example.com",
      password: "s3cret-pass",
      _csrf: "csrf-123",
    });
  });

  it("shows the rate-limit message for ?error=rate-limited", () => {
    renderWithProviders(<OAuthLoginPage />, { route: "/oauth/login?error=rate-limited" });

    expect(screen.getByRole("alert").textContent).toBe("Too many attempts. Wait a few minutes and try again.");
  });
});
