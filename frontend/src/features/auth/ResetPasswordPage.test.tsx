import { authHandlers } from "@/api/services/auth.handlers";
import { recordRequests } from "@/test/recordRequests";
import { renderWithProviders } from "@/test/renderWithProviders";
import { server } from "@/test/server";
import { cleanup, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
import { ResetPassword } from "./ResetPasswordPage";

const TOKEN = "reset-token";

function renderReset() {
  renderWithProviders(
    <Routes>
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/login" element={<output>Login page</output>} />
    </Routes>,
    { route: `/reset-password?token=${TOKEN}` },
  );
}

afterEach(cleanup);

describe("ResetPassword", () => {
  it("sets the new password with the link's token and goes to sign in (STD-06 AC 9)", async () => {
    const user = userEvent.setup();
    const requests = recordRequests();
    server.use(authHandlers.validateResetToken({ valid: true }), authHandlers.resetPassword());
    renderReset();

    await user.type(await screen.findByLabelText("New password"), "new-secret");
    await user.type(screen.getByLabelText("Confirm new password"), "new-secret");
    await user.click(screen.getByRole("button", { name: "Set new password" }));

    expect(await screen.findByText("Login page")).toBeTruthy();
    const validate = requests.find((request) => request.method === "GET");
    expect(new URL(validate?.url ?? "").searchParams.get("token")).toBe(TOKEN);
    const reset = requests.find((request) => request.method === "POST");
    expect(reset?.url).toMatch(/\/auth\/reset-password$/);
    expect(await reset?.json()).toEqual({ token: TOKEN, password: "new-secret" });
  });

  it("offers a new link when the token is no longer valid", async () => {
    server.use(authHandlers.validateResetToken({ valid: false }));
    renderReset();

    expect(await screen.findByText("This link is invalid or has expired.")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Request a new link" })).toBeTruthy();
    expect(screen.queryByLabelText("New password")).toBeNull();
  });
});
