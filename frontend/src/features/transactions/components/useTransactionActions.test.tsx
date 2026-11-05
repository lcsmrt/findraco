import type { Transaction } from "@/api/dtos/transaction";
import type { PlanContextValue } from "@/app/providers/usePlanContext";
import { ConfirmDialogProvider } from "@/components/dialog/ConfirmDialogProvider";
import { renderWithProviders } from "@/test/renderWithProviders";
import { cleanup, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { SeriesScopeDialogProvider } from "./SeriesScopeDialogProvider";
import { useTransactionActions } from "./useTransactionActions";

const plan: PlanContextValue = { activePlanId: 5, setActivePlanId: () => {}, plans: [], isLoading: false };

const pending: Transaction = {
  id: 40,
  permissions: { edit: true, delete: true },
  version: 3,
  type: "DEBIT",
  amount: 200,
  description: "Electricity",
  startDate: "2026-10-10",
  endDate: "2026-10-10",
  seriesId: "s1",
  splitMode: "EQUAL",
  participants: [],
  items: [],
  status: "PENDING",
  requiresConfirmation: true,
};

const cases: [string, Transaction][] = [
  ["pending", pending],
  ["forecast", { ...pending, status: "FORECAST" }],
  ["actual", { ...pending, status: "ACTUAL" }],
  ["read-only", { ...pending, permissions: { edit: false, delete: false } }],
  ["by-date", { ...pending, requiresConfirmation: false, status: "FORECAST" }],
];

// The hook decides which rows offer Confirm; the harness prints its answer per row.
function Harness() {
  const { canConfirm } = useTransactionActions();
  return (
    <ul>
      {cases.map(([name, transaction]) => (
        <li key={name}>{`${name}: ${canConfirm(transaction)}`}</li>
      ))}
    </ul>
  );
}

afterEach(cleanup);

describe("useTransactionActions", () => {
  it("hides confirm without permission or when actual", () => {
    renderWithProviders(
      <ConfirmDialogProvider>
        <SeriesScopeDialogProvider>
          <Harness />
        </SeriesScopeDialogProvider>
      </ConfirmDialogProvider>,
      { plan },
    );

    expect(screen.getByText("pending: true")).toBeTruthy();
    expect(screen.getByText("forecast: true")).toBeTruthy();
    expect(screen.getByText("actual: false")).toBeTruthy();
    expect(screen.getByText("read-only: false")).toBeTruthy();
    expect(screen.getByText("by-date: false")).toBeTruthy();
  });
});
