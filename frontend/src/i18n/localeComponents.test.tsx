import { PeriodNavigator } from "@/components/periodNavigator/PeriodNavigator";
import { act, cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { i18n } from "./i18n";

afterEach(cleanup);

function renderNavigator() {
  render(
    <PeriodNavigator
      range={{ startDate: "2026-10-01", endDate: "2026-10-31" }}
      period="this-month"
      isCustom={false}
      onPresetChange={vi.fn()}
      onRangeChange={vi.fn()}
    />,
  );
}

describe("components that show dates", () => {
  it("names months and weekdays in Portuguese", async () => {
    renderNavigator();
    expect(screen.getByText("October 2026")).toBeDefined();

    await act(() => i18n.changeLanguage("pt-BR"));
    expect(screen.getByText("outubro 2026")).toBeDefined();

    // The calendar behind the label names its month and its screen-reader controls in Portuguese too.
    await userEvent.setup().click(screen.getByRole("button", { name: "Escolher período, outubro 2026" }));
    expect(await screen.findByText("fev.")).toBeDefined();
    expect(screen.getByRole("button", { name: /próximo mês/i })).toBeDefined();
  });
});
