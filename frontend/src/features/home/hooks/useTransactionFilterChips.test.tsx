import { findracoApi } from "@/api/clients/findracoApi";
import type { FinancialTransactionCategory } from "@/api/dtos";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  act,
  cleanup,
  renderHook,
  waitFor,
} from "@testing-library/react";
import { AxiosError, type AxiosResponse } from "axios";
import type { ReactNode } from "react";
import { MemoryRouter, useLocation, type Location } from "react-router-dom";
import { afterEach, describe, expect, it, vi, type Mock } from "vitest";
import { useHomeFilters } from "./useHomeFilters";
import { useTransactionFilterChips } from "./useTransactionFilterChips";

vi.mock("@/api/clients/findracoApi", () => ({
  findracoApi: { get: vi.fn() },
}));
vi.mock("@/app/providers/PlanProvider", () => ({
  usePlanContext: () => ({ activePlanId: 5 }),
}));

const mockedGet = findracoApi.get as unknown as Mock;

const MEMBERS_URL = "/plan/5/members";
const CATEGORY_URL = "/plan/5/financial-transaction-category/12";
const members = [
  { userId: 7, name: "Ana", email: "ana@x.com", role: "OWNER" },
  { userId: 8, name: "Bruno", email: "bruno@x.com", role: "EDITOR" },
];
const groceries: FinancialTransactionCategory = {
  id: 12,
  type: "DEBIT",
  description: "Groceries",
};

const notFound = () =>
  new AxiosError("Not found", "ERR_BAD_REQUEST", undefined, undefined, {
    status: 404,
  } as AxiosResponse);

/** Routes GETs: members always resolve; the category resolves or 404s. */
const mockApi = ({ categoryExists = true } = {}) =>
  mockedGet.mockImplementation(async (url: string) => {
    if (url === MEMBERS_URL) return { data: members };
    if (url === CATEGORY_URL) {
      if (categoryExists) return { data: groceries };
      throw notFound();
    }
    throw new Error(`Unexpected GET ${url}`);
  });

let location: Location;
const LocationProbe = () => {
  location = useLocation();
  return null;
};

const setup = (url: string) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[url]}>
        {children}
        <LocationProbe />
      </MemoryRouter>
    </QueryClientProvider>
  );
  return renderHook(
    () => ({ chips: useTransactionFilterChips(), home: useHomeFilters() }),
    { wrapper: Wrapper },
  );
};

const labels = (result: ReturnType<typeof setup>["result"]) =>
  result.current.chips.chips.map((c) => c.label);

const params = () => Object.fromEntries(new URLSearchParams(location.search));

const categoryRequests = () =>
  mockedGet.mock.calls.filter(([url]) => url === CATEGORY_URL).length;

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("useTransactionFilterChips", () => {
  it("labels every active filter like the current chips, with category and member names", async () => {
    mockApi();
    const { result } = setup(
      "/?plan=5&type=DEBIT&category=12&member=7&from=2026-10-01&to=2026-10-31&min=50&max=200",
    );

    await waitFor(() => expect(result.current.chips.chips).toHaveLength(5));
    expect(labels(result)).toEqual([
      "Debit",
      "Groceries",
      "Ana",
      "01/10/2026 – 31/10/2026",
      "R$ 50,00 – R$ 200,00",
    ]);
    expect(result.current.chips.category).toEqual(groceries);
    expect(result.current.chips.member).toEqual({ id: 7, name: "Ana" });
  });

  it("labels open-ended date and amount ranges and the credit type", () => {
    mockApi();
    const { result, unmount } = setup("/?plan=5&type=CREDIT&from=2026-10-01&min=50");
    expect(labels(result)).toEqual(["Credit", "From 01/10/2026", "≥ R$ 50,00"]);
    unmount();

    const { result: upper } = setup("/?plan=5&to=2026-10-31&max=200");
    expect(labels(upper)).toEqual(["Until 31/10/2026", "≤ R$ 200,00"]);
  });

  it("removing a chip removes only its params from the URL", () => {
    mockApi();
    const { result } = setup("/?plan=5&type=DEBIT&from=2026-10-01&to=2026-10-31");

    const dateChip = result.current.chips.chips.find((c) => c.key === "date")!;
    act(() => dateChip.onRemove());

    expect(params()).toEqual({ plan: "5", type: "DEBIT" });
    expect(labels(result)).toEqual(["Debit"]);
  });

  it("shows a seeded (picked) category with zero category requests", async () => {
    mockApi();
    const { result } = setup("/?plan=5");

    act(() => {
      result.current.chips.seedCategory(groceries);
      result.current.home.updateTransactions((t) => ({
        ...t,
        filter: { ...t.filter, categoryId: 12 },
      }));
    });

    expect(labels(result)).toEqual(["Groceries"]);
    await waitFor(() => expect(mockedGet).toHaveBeenCalledWith(MEMBERS_URL));
    expect(categoryRequests()).toBe(0);
  });

  it("drops a category that no longer exists (404) from the URL", async () => {
    mockApi({ categoryExists: false });
    const { result } = setup("/?plan=5&category=12&type=DEBIT");

    await waitFor(() => expect(params()).toEqual({ plan: "5", type: "DEBIT" }));
    expect(result.current.home.transactions.filter.categoryId).toBeUndefined();
    expect(labels(result)).toEqual(["Debit"]);
  });

  it("drops a member who is not in the plan once members are loaded", async () => {
    mockApi();
    const { result } = setup("/?plan=5&member=99&category=12");

    await waitFor(() => expect(params()).toEqual({ plan: "5", category: "12" }));
    expect(result.current.home.transactions.filter.memberId).toBeUndefined();
    await waitFor(() => expect(labels(result)).toEqual(["Groceries"]));
  });
});
