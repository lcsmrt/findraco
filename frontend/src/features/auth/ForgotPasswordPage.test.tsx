import { authHandlers } from "@/api/services/auth.handlers";
import { recordRequests } from "@/test/recordRequests";
import { renderWithProviders } from "@/test/renderWithProviders";
import { server } from "@/test/server";
import { cleanup, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { ForgotPassword } from "./ForgotPasswordPage";

afterEach(cleanup);

describe("ForgotPassword", () => {
  it("sends the email and confirms without saying whether the account exists (STD-06 AC 9)", async () => {
    const user = userEvent.setup();
    const requests = recordRequests();
    server.use(authHandlers.forgotPassword());
    renderWithProviders(<ForgotPassword />, { route: "/forgot-password" });

    await user.type(screen.getByLabelText("Email"), "ana@example.com");
    await user.click(screen.getByRole("button", { name: "Send reset link" }));

    expect(
      await screen.findByText(
        "If an account exists for that email, we sent a link to reset your password. It expires in 60 minutes.",
      ),
    ).toBeTruthy();
    expect(requests).toHaveLength(1);
    expect(requests[0].method).toBe("POST");
    expect(requests[0].url).toMatch(/\/auth\/forgot-password$/);
    expect(await requests[0].json()).toEqual({ email: "ana@example.com" });
    expect(screen.queryByLabelText("Email")).toBeNull();
  });
});
