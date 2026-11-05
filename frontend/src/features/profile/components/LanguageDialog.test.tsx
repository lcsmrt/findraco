import type { User } from "@/api/dtos";
import { authHandlers } from "@/api/services/auth.handlers";
import { i18n } from "@/i18n/i18n";
import { recordRequests } from "@/test/recordRequests";
import { renderWithProviders } from "@/test/renderWithProviders";
import { server } from "@/test/server";
import { cleanup, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Toaster } from "sonner";
import { afterEach, describe, expect, it, vi } from "vitest";
import { LanguageDialog } from "./LanguageDialog";

const ana: User = {
  id: 1,
  name: "Ana",
  email: "ana@example.com",
  timeZone: "America/Sao_Paulo",
  timeZoneMode: "AUTOMATIC",
  language: null,
};

afterEach(cleanup);

describe("LanguageDialog", () => {
  it("lists both languages in the dialog", () => {
    renderWithProviders(<LanguageDialog open onOpenChange={vi.fn()} />);

    expect(screen.getByText("Language / Idioma")).toBeTruthy();
    expect(screen.getByRole("radio", { name: "English" })).toBeTruthy();
    expect(screen.getByRole("radio", { name: "Português (Brasil)" })).toBeTruthy();
  });

  it("switches the texts at once and saves the language", async () => {
    const user = userEvent.setup();
    const requests = recordRequests();
    server.use(authHandlers.updateLanguage({ ...ana, language: "pt-BR" }));
    renderWithProviders(<LanguageDialog open onOpenChange={vi.fn()} />);

    await user.click(screen.getByRole("radio", { name: "Português (Brasil)" }));

    expect(await screen.findByText("Escolha o idioma em que você lê o app.")).toBeTruthy();
    expect(i18n.language).toBe("pt-BR");
    await waitFor(() => expect(requests.some((request) => request.method === "PATCH")).toBe(true));
    const patch = requests.find((request) => request.method === "PATCH");
    expect(new URL(patch?.url ?? "").pathname).toBe("/api/findraco/user/me/language");
    expect(await patch?.json()).toEqual({ language: "pt-BR" });
  });

  it("keeps the picked language when saving fails", async () => {
    const user = userEvent.setup();
    server.use(authHandlers.updateLanguageFailed());
    renderWithProviders(
      <>
        <LanguageDialog open onOpenChange={vi.fn()} />
        <Toaster />
      </>,
    );

    await user.click(screen.getByRole("radio", { name: "Português (Brasil)" }));

    expect(await screen.findByText("Algo deu errado do nosso lado. Tente novamente mais tarde.")).toBeTruthy();
    expect(i18n.language).toBe("pt-BR");
    expect(screen.getByRole("radio", { name: "Português (Brasil)" }).getAttribute("aria-checked")).toBe("true");
  });
});
