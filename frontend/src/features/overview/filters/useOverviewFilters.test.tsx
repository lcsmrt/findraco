import { act, cleanup, render } from "@testing-library/react";
import {
  MemoryRouter,
  useLocation,
  useNavigate,
  type Location,
} from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
import { useOverviewFilters } from "./useOverviewFilters";

let hook: ReturnType<typeof useOverviewFilters>;
let location: Location;
let navigate: ReturnType<typeof useNavigate>;

function Probe() {
  location = useLocation();
  navigate = useNavigate();
  hook = useOverviewFilters();
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

describe("useOverviewFilters", () => {
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

  it("updating the Overview filters leaves the Transactions params intact", () => {
    setup(
      "/?plan=1&tab=transactions&period=custom&periodFrom=2026-09-01&periodTo=2026-09-30&overviewMember=7&member=3&q=market&min=50",
    );

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

  it("loads a legacy categoriesPeriod link without a Categories period and keeps it out of updates", () => {
    setup(
      "/?plan=1&tab=categories&period=last-3m&categoriesPeriod=custom&categoriesPeriodFrom=2026-09-01&categoriesPeriodTo=2026-09-30",
    );

    expect(hook.overview.period).toBe("last-3m");
    expect("categories" in hook).toBe(false);
    expect("updateCategories" in hook).toBe(false);

    act(() => hook.updateOverview((o) => ({ ...o, period: "last-6m" })));
    expect(currentParams()).toEqual({
      plan: "1",
      tab: "categories",
      period: "last-6m",
      categoriesPeriod: "custom",
      categoriesPeriodFrom: "2026-09-01",
      categoriesPeriodTo: "2026-09-30",
    });
  });
});
