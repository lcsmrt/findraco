import { act, cleanup, render } from "@testing-library/react";
import {
  MemoryRouter,
  useLocation,
  useNavigate,
  type Location,
} from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
import { useTransactionFilters } from "./useTransactionFilters";

let hook: ReturnType<typeof useTransactionFilters>;
let location: Location;
let navigate: ReturnType<typeof useNavigate>;

function Probe() {
  location = useLocation();
  navigate = useNavigate();
  hook = useTransactionFilters();
  return null;
}

/** Renders the hook at `initial`, with `/other` as the previous history entry. */
function setup(initial: string) {
  render(
    <MemoryRouter initialEntries={["/other", initial]} initialIndex={1}>
      <Probe />
    </MemoryRouter>,
  );
}

function currentParams() {
  return Object.fromEntries(new URLSearchParams(location.search));
}

async function goBack() {
  await act(async () => navigate(-1));
}

afterEach(cleanup);

describe("useTransactionFilters", () => {
  it("writes a Transactions filter change to the URL without adding a history entry", async () => {
    setup("/?plan=1");

    act(() =>
      hook.updateTransactions((t) => ({
        ...t,
        filter: { ...t.filter, categoryId: 12, type: "DEBIT" },
        sort: { by: "amount", direction: "desc" },
        size: 25,
      })),
    );

    expect(currentParams()).toEqual({
      plan: "1",
      category: "12",
      type: "DEBIT",
      sort: "amount.desc",
      size: "25",
    });
    expect(hook.transactions.filter).toEqual({ categoryId: 12, type: "DEBIT" });

    await goBack();
    expect(location.pathname).toBe("/other");
  });

  it("updating the Transactions filters leaves the Overview params intact", () => {
    setup(
      "/?plan=1&tab=transactions&period=custom&periodFrom=2026-09-01&periodTo=2026-09-30&overviewMember=7&member=3&q=market",
    );

    act(() =>
      hook.updateTransactions((t) => ({
        ...t,
        filter: { ...t.filter, amountMin: 50 },
      })),
    );
    expect(currentParams()).toEqual({
      plan: "1",
      tab: "transactions",
      period: "custom",
      periodFrom: "2026-09-01",
      periodTo: "2026-09-30",
      overviewMember: "7",
      member: "3",
      q: "market",
      min: "50",
    });
  });

  it("clear removes the Transactions filters and search, keeping sort, page size and other params", async () => {
    setup(
      "/?plan=1&tab=transactions&period=last-3m&overviewMember=7&type=CREDIT&category=12&member=3&from=2026-10-01&to=2026-10-31&min=1&max=99.5&q=market&sort=amount.asc&size=25",
    );

    act(() => hook.clearTransactions());

    expect(currentParams()).toEqual({
      plan: "1",
      tab: "transactions",
      period: "last-3m",
      overviewMember: "7",
      sort: "amount.asc",
      size: "25",
    });
    expect(hook.transactions).toEqual({
      filter: {},
      sort: { by: "amount", direction: "asc" },
      size: 25,
    });

    await goBack();
    expect(location.pathname).toBe("/other");
  });
});
