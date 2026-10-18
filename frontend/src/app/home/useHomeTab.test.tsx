import { act, cleanup, render } from "@testing-library/react";
import {
  MemoryRouter,
  useLocation,
  useNavigate,
  type Location,
} from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
import { useHomeTab } from "./useHomeTab";

let hook: ReturnType<typeof useHomeTab>;
let location: Location;
let navigate: ReturnType<typeof useNavigate>;

const Probe = () => {
  location = useLocation();
  navigate = useNavigate();
  hook = useHomeTab();
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

describe("useHomeTab", () => {
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

  it("loads a legacy categoriesPeriod link on the Categories tab without a Categories period", () => {
    setup(
      "/?plan=1&tab=categories&period=last-3m&categoriesPeriod=custom&categoriesPeriodFrom=2026-09-01&categoriesPeriodTo=2026-09-30",
    );

    expect(hook.tab).toBe("categories");
    expect("categories" in hook).toBe(false);
    expect("updateCategories" in hook).toBe(false);
  });

  it("switches to the Categories tab", () => {
    setup("/?plan=1");

    act(() => hook.setTab("categories"));

    expect(currentParams()).toEqual({ plan: "1", tab: "categories" });
    expect(hook.tab).toBe("categories");
  });
});
