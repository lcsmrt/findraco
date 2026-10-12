import { act, cleanup, render } from "@testing-library/react";
import {
  MemoryRouter,
  useLocation,
  useNavigate,
  type Location,
} from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
import { useHomeFilters } from "./useHomeFilters";

let hook: ReturnType<typeof useHomeFilters>;
let location: Location;
let navigate: ReturnType<typeof useNavigate>;

const Probe = () => {
  location = useLocation();
  navigate = useNavigate();
  hook = useHomeFilters();
  return null;
};

/** Renders the hook at `initial`, with `/other` as the previous history entry. */
const setup = (initial: string) => {
  render(
    <MemoryRouter initialEntries={["/other", initial]} initialIndex={1}>
      <Probe />
    </MemoryRouter>,
  );
};

const currentParams = () =>
  Object.fromEntries(new URLSearchParams(location.search));

const goBack = () => act(async () => navigate(-1));

afterEach(cleanup);

describe("useHomeFilters", () => {
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

  it("writes an Overview filter change to the URL without adding a history entry", async () => {
    setup("/?plan=1");

    act(() =>
      hook.updateOverview((o) => ({ ...o, period: "last-3m", memberId: 7 })),
    );

    expect(currentParams()).toEqual({
      plan: "1",
      period: "last-3m",
      overviewMember: "7",
    });
    expect(hook.overview).toEqual({
      period: "last-3m",
      customRange: null,
      memberId: 7,
    });

    await goBack();
    expect(location.pathname).toBe("/other");
  });

  it("pushes a history entry on tab switch so Back returns to the previous tab", async () => {
    setup("/?plan=1&period=last-6m");

    act(() => hook.setTab("transactions"));

    expect(currentParams()).toEqual({
      plan: "1",
      period: "last-6m",
      tab: "transactions",
    });
    expect(hook.tab).toBe("transactions");

    await goBack();
    expect(location.pathname).toBe("/");
    expect(currentParams()).toEqual({ plan: "1", period: "last-6m" });
    expect(hook.tab).toBe("overview");
  });

  it("updating one tab's filters leaves the other tab's params intact", () => {
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

    act(() => hook.updateOverview((o) => ({ ...o, memberId: null })));
    expect(currentParams()).toEqual({
      plan: "1",
      tab: "transactions",
      period: "custom",
      periodFrom: "2026-09-01",
      periodTo: "2026-09-30",
      member: "3",
      q: "market",
      min: "50",
    });
  });

  it("clear removes every Transactions param and nothing else", async () => {
    setup(
      "/?plan=1&tab=transactions&period=last-3m&overviewMember=7&type=CREDIT&category=12&member=3&from=2026-10-01&to=2026-10-31&min=1&max=99.5&q=market&sort=amount.asc&size=25",
    );

    act(() => hook.clearTransactions());

    expect(currentParams()).toEqual({
      plan: "1",
      tab: "transactions",
      period: "last-3m",
      overviewMember: "7",
    });
    expect(hook.transactions).toEqual({ filter: {}, sort: null, size: 10 });

    await goBack();
    expect(location.pathname).toBe("/other");
  });
});
