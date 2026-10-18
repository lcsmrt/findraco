import { findracoApi } from "@/api/clients/findracoApi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { MemoryRouter, useLocation, type Location } from "react-router-dom";
import { afterEach, describe, expect, it, vi, type Mock } from "vitest";
import { useOverviewMemberFilter } from "./useOverviewMemberFilter";

vi.mock("@/api/clients/findracoApi", () => ({
  findracoApi: { get: vi.fn() },
}));
vi.mock("@/app/providers/usePlanContext", () => ({
  usePlanContext: () => ({ activePlanId: 5 }),
}));

const mockedGet = findracoApi.get as unknown as Mock;

const ana = { userId: 7, name: "Ana", email: "ana@x.com", role: "OWNER" };
const bruno = { userId: 8, name: "Bruno", email: "bruno@x.com", role: "EDITOR" };

const mockMembers = (members: (typeof ana)[]) =>
  mockedGet.mockImplementation(async (url: string) => {
    if (url === "/plan/5/members") return { data: members };
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
  return renderHook(() => useOverviewMemberFilter(), { wrapper: Wrapper });
};

const params = () => Object.fromEntries(new URLSearchParams(location.search));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("useOverviewMemberFilter", () => {
  it("applies the member filter and shows the picker on a multi-member plan", async () => {
    mockMembers([ana, bruno]);
    const { result } = setup("/?plan=5&overviewMember=7");

    await waitFor(() => expect(result.current.showMemberPicker).toBe(true));
    expect(result.current.selectedMember).toEqual({ id: 7, name: "Ana" });
    expect(result.current.effectiveMemberId).toBe(7);
    expect(params()).toEqual({ plan: "5", overviewMember: "7" });
  });

  it("hides the picker and ignores a saved member on a single-member plan", async () => {
    mockMembers([ana]);
    const { result } = setup("/?plan=5&overviewMember=7");

    await waitFor(() => expect(result.current.memberOptions).toHaveLength(1));
    expect(result.current.showMemberPicker).toBe(false);
    expect(result.current.effectiveMemberId).toBeNull();
  });

  it("drops a member who is no longer in the plan from the URL", async () => {
    mockMembers([ana, bruno]);
    const { result } = setup("/?plan=5&period=last-3m&overviewMember=99");

    await waitFor(() => expect(params()).toEqual({ plan: "5", period: "last-3m" }));
    expect(result.current.effectiveMemberId).toBeNull();
    expect(result.current.selectedMember).toBeNull();
  });
});
